
/*
============================================================
 ALON HISTORYVERSE 24
 SHARED MARKETPLACE API WORKER
 File: marketplace-api-worker.js
 Cloudflare Worker Name:
 alon-historyverse-marketplace-api

 Creator: Baba Thecno Guru

 Supports:
 - Jobs: Local + International
 - Global Marketplace records
 - Regular Marketplace records
 - Luxury Marketplace records
 - Shared API authentication
 - D1 database storage
 - R2 image/video storage

 Required bindings:
 D1: DB
 R2: MEDIA

 IMPORTANT:
 This Worker is separate from Owner/Admin Security Worker.
============================================================
*/

const CONFIG = {
  name: "ALON HISTORYVERSE 24 MARKETPLACE API",
  version: "1.0.0",
  allowedOrigins: [
    "https://babathecnoguru.github.io",
    "https://alon-historyverse-24.com",
    "https://www.alon-historyverse-24.com"
  ],
  marketplaces: [
    "jobs",
    "global",
    "regular",
    "luxury"
  ],
  recordKinds: [
    "listing",
    "showroom",
    "item",
    "property",
    "vehicle"
  ],
  maxImageBytes: 8 * 1024 * 1024,
  maxVideoBytes: 40 * 1024 * 1024,
  sessionDays: 30
};

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers }
  });
}

function fail(message, status = 400) {
  return json({ ok: false, message }, status);
}

function nowISO() {
  return new Date().toISOString();
}

function randomId(prefix = "id") {
  return prefix + "_" + crypto.randomUUID().replace(/-/g, "");
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes))
    .map(value => value.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(value) {
  const data = new TextEncoder().encode(value);
  return bytesToHex(await crypto.subtle.digest("SHA-256", data));
}

/*
============================================================
 PASSWORD HASHING
 Cloudflare Workers PBKDF2 limit:
 Maximum supported iterations: 100000
============================================================
*/

async function passwordHash(password, salt) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    key,
    256
  );

  return bytesToHex(bits);
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  if (a.length !== b.length) return false;

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

function getOrigin(request) {
  return request.headers.get("Origin") || "";
}

function corsHeaders(request) {
  const origin = getOrigin(request);

  const headers = {
    "Access-Control-Allow-Methods":
      "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };

  if (CONFIG.allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function withCors(response, request) {
  const headers = new Headers(response.headers);

  for (const [key, value] of Object.entries(corsHeaders(request))) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function validOrigin(request) {
  const origin = getOrigin(request);

  if (!origin) return true;

  return CONFIG.allowedOrigins.includes(origin);
}

function getBearerToken(request) {
  const value = request.headers.get("Authorization") || "";
  const match = value.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function readJSON(request) {
  try {
    return await request.json();
  } catch (_) {
    return null;
  }
}

function validMarketplace(value) {
  return CONFIG.marketplaces.includes(
    String(value || "").toLowerCase()
  );
}

function cleanUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: user.created_at
  };
}

/*
============================================================
 DATABASE INITIALIZATION
============================================================
*/

async function ensureDatabase(env) {
  if (!env.DB) {
    throw new Error("D1 binding DB is missing.");
  }

  const statements = [
    `CREATE TABLE IF NOT EXISTS marketplace_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,

    `CREATE TABLE IF NOT EXISTS marketplace_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES marketplace_users(id)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_marketplace_sessions_user
      ON marketplace_sessions(user_id)`,

    `CREATE INDEX IF NOT EXISTS idx_marketplace_sessions_expiry
      ON marketplace_sessions(expires_at)`,

    `CREATE TABLE IF NOT EXISTS marketplace_records (
      id TEXT PRIMARY KEY,
      marketplace TEXT NOT NULL,
      kind TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      record_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY(owner_id) REFERENCES marketplace_users(id)
    )`,

    `CREATE INDEX IF NOT EXISTS idx_marketplace_records_scope
      ON marketplace_records(marketplace, kind, status)`,

    `CREATE INDEX IF NOT EXISTS idx_marketplace_records_owner
      ON marketplace_records(owner_id)`,

    `CREATE TABLE IF NOT EXISTS marketplace_media (
      id TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL,
      marketplace TEXT NOT NULL,
      object_key TEXT NOT NULL UNIQUE,
      content_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      created_at TEXT NOT NULL
    )`
  ];

  for (const statement of statements) {
    await env.DB.prepare(statement).run();
  }
}

/*
============================================================
 AUTHENTICATION
============================================================
*/

async function createSession(env, user) {
  const token = crypto.randomUUID() +
    "." + crypto.randomUUID();

  const tokenHash = await sha256(token);
  const sessionId = randomId("session");

  const expiresAt = new Date(
    Date.now() + CONFIG.sessionDays * 86400000
  ).toISOString();

  await env.DB.prepare(`
    INSERT INTO marketplace_sessions
    (id, user_id, token_hash, expires_at, revoked, created_at)
    VALUES (?, ?, ?, ?, 0, ?)
  `).bind(
    sessionId,
    user.id,
    tokenHash,
    expiresAt,
    nowISO()
  ).run();

  return token;
}

async function getAuthenticatedUser(request, env) {
  const token = getBearerToken(request);

  if (!token) return null;

  const tokenHash = await sha256(token);

  const row = await env.DB.prepare(`
    SELECT
      u.id,
      u.email,
      u.display_name,
      u.created_at,
      s.id AS session_id
    FROM marketplace_sessions s
    INNER JOIN marketplace_users u
      ON u.id = s.user_id
    WHERE s.token_hash = ?
      AND s.revoked = 0
      AND s.expires_at > ?
    LIMIT 1
  `).bind(tokenHash, nowISO()).first();

  if (!row) return null;

  return {
    user: cleanUser(row),
    sessionId: row.session_id
  };
}

async function register(request, env) {
  const body = await readJSON(request);

  if (!body) return fail("Invalid JSON body.");

  const email = String(body.email || "")
    .trim()
    .toLowerCase();

  const password = String(body.password || "");

  const displayName = String(body.displayName || "")
    .trim()
    .slice(0, 100);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("Valid email address is required.");
  }

  if (password.length < 8 || password.length > 128) {
    return fail("Password must be 8 to 128 characters.");
  }

  if (body.termsAccepted !== true) {
    return fail("Terms acceptance is required.");
  }

  const existing = await env.DB.prepare(`
    SELECT id FROM marketplace_users
    WHERE email = ?
    LIMIT 1
  `).bind(email).first();

  if (existing) {
    return fail("An account with this email already exists.", 409);
  }

  const id = randomId("user");
  const salt = crypto.randomUUID();
  const hash = await passwordHash(password, salt);

  await env.DB.prepare(`
    INSERT INTO marketplace_users
    (id, email, display_name, password_hash, password_salt, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    email,
    displayName,
    hash,
    salt,
    nowISO()
  ).run();

  const user = {
    id,
    email,
    display_name: displayName,
    created_at: nowISO()
  };

  const token = await createSession(env, user);

  return json({
    ok: true,
    user: cleanUser(user),
    token
  }, 201);
}

async function login(request, env) {
  const body = await readJSON(request);

  if (!body) return fail("Invalid JSON body.");

  const email = String(body.email || "")
    .trim()
    .toLowerCase();

  const password = String(body.password || "");

  if (!email || !password) {
    return fail("Email and password are required.");
  }

  const user = await env.DB.prepare(`
    SELECT *
    FROM marketplace_users
    WHERE email = ?
    LIMIT 1
  `).bind(email).first();

  if (!user) {
    return fail("Invalid email or password.", 401);
  }

  const calculated = await passwordHash(
    password,
    user.password_salt
  );

  if (!safeEqual(calculated, user.password_hash)) {
    return fail("Invalid email or password.", 401);
  }

  const token = await createSession(env, user);

  return json({
    ok: true,
    user: cleanUser(user),
    token
  });
}

async function session(request, env) {
  const auth = await getAuthenticatedUser(request, env);

  if (!auth) {
    return fail("Session expired. Please log in again.", 401);
  }

  return json({
    ok: true,
    user: auth.user
  });
}

async function logout(request, env) {
  const token = getBearerToken(request);

  if (token) {
    const tokenHash = await sha256(token);

    await env.DB.prepare(`
      UPDATE marketplace_sessions
      SET revoked = 1
      WHERE token_hash = ?
    `).bind(tokenHash).run();
  }

  return json({ ok: true, message: "Logged out." });
}

/*
============================================================
 MARKETPLACE RECORDS
============================================================
*/

function normalizeRecord(record) {
  if (!record || typeof record !== "object" ||
      Array.isArray(record)) {
    return null;
  }

  const copy = { ...record };

  delete copy.ownerId;
  delete copy.owner_id;
  delete copy.sellerId;
  delete copy.createdAt;
  delete copy.updatedAt;

  return copy;
}

function recordResponse(row) {
  let record;

  try {
    record = JSON.parse(row.record_json);
  } catch (_) {
    record = {};
  }

  return {
    ...record,
    id: row.id,
    marketplace: row.marketplace,
    kind: row.kind,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status
  };
}

async function listRecords(request, env, kind, marketplace) {
  const rows = await env.DB.prepare(`
    SELECT *
    FROM marketplace_records
    WHERE marketplace = ?
      AND kind = ?
      AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 500
  `).bind(marketplace, kind).all();

  return json({
    ok: true,
    records: (rows.results || []).map(recordResponse)
  });
}

async function createRecord(
  request,
  env,
  auth,
  kind,
  marketplace
) {
  const body = await readJSON(request);
  const record = normalizeRecord(body && body.record);

  if (!record) {
    return fail("A valid record object is required.");
  }

  if (kind === "listing") {
    if (!String(record.title || "").trim()) {
      return fail("Job title is required.");
    }

    if (!String(record.description || "").trim()) {
      return fail("Job description is required.");
    }

    if (!String(record.country || "").trim()) {
      return fail("Country is required.");
    }

    record.jobType =
      String(record.jobType || record.type || "local")
        .toLowerCase()
        .includes("international")
        ? "international"
        : "local";
  }

  const id = String(record.id || randomId(kind))
    .slice(0, 120);

  const created = nowISO();

  await env.DB.prepare(`
    INSERT INTO marketplace_records
    (id, marketplace, kind, owner_id, record_json,
     status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
  `).bind(
    id,
    marketplace,
    kind,
    auth.user.id,
    JSON.stringify(record),
    created,
    created
  ).run();

  const saved = {
    ...record,
    id,
    marketplace,
    kind,
    ownerId: auth.user.id,
    createdAt: created,
    updatedAt: created,
    status: "active"
  };

  return json({
    ok: true,
    record: saved
  }, 201);
}

async function updateRecord(
  request,
  env,
  auth,
  kind,
  marketplace,
  id
) {
  const row = await env.DB.prepare(`
    SELECT *
    FROM marketplace_records
    WHERE id = ?
      AND marketplace = ?
      AND kind = ?
      AND status = 'active'
    LIMIT 1
  `).bind(id, marketplace, kind).first();

  if (!row) return fail("Record not found.", 404);

  if (row.owner_id !== auth.user.id) {
    return fail("You cannot edit another user's record.", 403);
  }

  const body = await readJSON(request);
  const incoming = normalizeRecord(body && body.record);

  if (!incoming) return fail("A valid record object is required.");

  let oldRecord = {};

  try {
    oldRecord = JSON.parse(row.record_json);
  } catch (_) {}

  const updatedRecord = {
    ...oldRecord,
    ...incoming
  };

  if (kind === "listing") {
    if (!String(updatedRecord.title || "").trim()) {
      return fail("Job title is required.");
    }

    if (!String(updatedRecord.description || "").trim()) {
      return fail("Job description is required.");
    }

    if (!String(updatedRecord.country || "").trim()) {
      return fail("Country is required.");
    }
  }

  const updatedAt = nowISO();

  await env.DB.prepare(`
    UPDATE marketplace_records
    SET record_json = ?, updated_at = ?
    WHERE id = ?
      AND marketplace = ?
      AND kind = ?
      AND owner_id = ?
  `).bind(
    JSON.stringify(updatedRecord),
    updatedAt,
    id,
    marketplace,
    kind,
    auth.user.id
  ).run();

  return json({
    ok: true,
    record: {
      ...updatedRecord,
      id,
      marketplace,
      kind,
      ownerId: auth.user.id,
      createdAt: row.created_at,
      updatedAt,
      status: row.status
    }
  });
}

async function deleteRecord(
  env,
  auth,
  kind,
  marketplace,
  id
) {
  const result = await env.DB.prepare(`
    UPDATE marketplace_records
    SET status = 'deleted',
        updated_at = ?
    WHERE id = ?
      AND marketplace = ?
      AND kind = ?
      AND owner_id = ?
      AND status = 'active'
  `).bind(
    nowISO(),
    id,
    marketplace,
    kind,
    auth.user.id
  ).run();

  if (!result.meta || result.meta.changes === 0) {
    return fail("Record not found or not owned by you.", 404);
  }

  return json({
    ok: true,
    message: "Record deleted."
  });
}

/*
============================================================
 MEDIA UPLOAD / DELIVERY
============================================================
*/

function safeFileExtension(fileName, contentType) {
  const known = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov"
  };

  return known[contentType] || "bin";
}

async function uploadMedia(request, env, auth) {
  if (!env.MEDIA) {
    return fail("R2 binding MEDIA is missing.", 500);
  }

  let form;

  try {
    form = await request.formData();
  } catch (_) {
    return fail("Invalid multipart upload.");
  }

  const file = form.get("file");

  const marketplace = String(form.get("marketplace") || "")
    .toLowerCase();

  if (!validMarketplace(marketplace)) {
    return fail("Invalid marketplace.");
  }

  if (!(file instanceof File) || file.size < 1) {
    return fail("A file is required.");
  }

  const type = file.type.toLowerCase();
  const isImage = type.startsWith("image/");
  const isVideo = type.startsWith("video/");

  if (!isImage && !isVideo) {
    return fail("Only image and video files are supported.");
  }

  if (isImage && file.size > CONFIG.maxImageBytes) {
    return fail("Image size must not exceed 8 MB.");
  }

  if (isVideo && file.size > CONFIG.maxVideoBytes) {
    return fail("Video size must not exceed 40 MB.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime"
  ];

  if (!allowedTypes.includes(type)) {
    return fail("This media format is not supported.");
  }

  const mediaId = randomId("media");
  const extension = safeFileExtension(file.name, type);

  const objectKey =
    marketplace + "/" + auth.user.id + "/" +
    mediaId + "." + extension;

  await env.MEDIA.put(objectKey, file.stream(), {
    httpMetadata: {
      contentType: type,
      cacheControl: "public, max-age=31536000, immutable"
    },
    customMetadata: {
      ownerId: auth.user.id,
      marketplace,
      mediaId
    }
  });

  await env.DB.prepare(`
    INSERT INTO marketplace_media
    (id, owner_id, marketplace, object_key,
     content_type, file_size, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    mediaId,
    auth.user.id,
    marketplace,
    objectKey,
    type,
    file.size,
    nowISO()
  ).run();

  const url = new URL(request.url);

  const mediaUrl =
    url.origin + "/media/" +
    objectKey.split("/").map(encodeURIComponent).join("/");

  return json({
    ok: true,
    id: mediaId,
    url: mediaUrl,
    contentType: type,
    size: file.size
  }, 201);
}

async function getMedia(request, env, pathname) {
  if (!env.MEDIA) {
    return fail("R2 binding MEDIA is missing.", 500);
  }

  const rawKey = pathname.slice("/media/".length);

  let key;

  try {
    key = rawKey.split("/").map(decodeURIComponent).join("/");
  } catch (_) {
    return fail("Invalid media path.", 400);
  }

  if (!key || key.includes("..") || key.startsWith("/")) {
    return fail("Invalid media path.", 400);
  }

  const object = await env.MEDIA.get(key);

  if (!object) {
    return fail("Media not found.", 404);
  }

  const headers = new Headers();

  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return new Response(object.body, {
    status: 200,
    headers
  });
}

/*
============================================================
 ROUTER
============================================================
*/

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request)
    });
  }

  if (!validOrigin(request)) {
    return fail("Origin is not allowed.", 403);
  }

  if (method === "GET" && pathname === "/") {
    return json({
      ok: true,
      service: CONFIG.name,
      version: CONFIG.version,
      status: "ONLINE",
      features: [
        "authentication",
        "jobs",
        "global-marketplace",
        "regular-marketplace",
        "luxury-marketplace",
        "media-storage"
      ]
    });
  }

  if (method === "GET" && pathname.startsWith("/media/")) {
    return getMedia(request, env, pathname);
  }

  await ensureDatabase(env);

  if (method === "POST" && pathname === "/api/auth/register") {
    return register(request, env);
  }

  if (method === "POST" && pathname === "/api/auth/login") {
    return login(request, env);
  }

  if (method === "GET" && pathname === "/api/auth/session") {
    return session(request, env);
  }

  if (method === "POST" && pathname === "/api/auth/logout") {
    return logout(request, env);
  }

  if (method === "POST" && pathname === "/api/media") {
    const auth = await getAuthenticatedUser(request, env);

    if (!auth) return fail("Login required.", 401);

    return uploadMedia(request, env, auth);
  }

  if (
    pathname === "/api/marketplace/records" ||
    pathname.startsWith("/api/marketplace/records/")
  ) {
    const auth = await getAuthenticatedUser(request, env);

    const kind = pathname === "/api/marketplace/records"
      ? ""
      : pathname.split("/")[4] || "";

    if (!CONFIG.recordKinds.includes(kind)) {
      return fail("Unsupported record type.", 404);
    }

    const marketplace = String(
      url.searchParams.get("marketplace") || ""
    ).toLowerCase();

    if (!validMarketplace(marketplace)) {
      return fail("A valid marketplace parameter is required.");
    }

    const parts = pathname.split("/").filter(Boolean);

    const id = parts.length > 4
      ? decodeURIComponent(parts[5] || "")
      : "";

    if (method === "GET") {
      return listRecords(request, env, kind, marketplace);
    }

    if (!auth) return fail("Login required.", 401);

    if (method === "POST" && !id) {
      return createRecord(
        request, env, auth, kind, marketplace
      );
    }

    if (method === "PUT" && id) {
      return updateRecord(
        request, env, auth, kind, marketplace, id
      );
    }

    if (method === "DELETE" && id) {
      return deleteRecord(
        env, auth, kind, marketplace, id
      );
    }

    return fail("Method not allowed.", 405);
  }

  return fail("API route not found.", 404);
}

/*
============================================================
 WORKER ENTRY
============================================================
*/

export default {
  async fetch(request, env, ctx) {
    try {
      const response = await handleRequest(request, env);

      return withCors(response, request);
    } catch (error) {
      console.error(
        "Marketplace Worker Error:",
        error && error.stack ? error.stack : error
      );

      return withCors(
        fail("Internal server error. Check Worker logs.", 500),
        request
      );
    }
  }
};
