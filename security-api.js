/*
============================================================
 ALON HISTORYVERSE 24
 SECURE OWNER ADMIN API
 File:
 security-backend/security-api.js
============================================================
*/

const CONFIG = {
    SESSION_COOKIE: "alon_owner_session",
    SESSION_TTL_SECONDS: 12 * 60 * 60,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_SECONDS: 15 * 60,
    MAX_AUDIT_RESULTS: 200,
    MAX_SECURITY_RESULTS: 200,
    MAX_BODY_BYTES: 16 * 1024
};

const SECURITY_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "off",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin"
};

function nowISO() {
    return new Date().toISOString();
}

function randomHex(byteLength = 32) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function getRequestId() {
    return randomHex(16);
}

function safeString(value, maxLength = 500) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
}

function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            ...SECURITY_HEADERS,
            ...headers
        }
    });
}

function emptyResponse(status, headers = {}) {
    return new Response(null, {
        status,
        headers: {
            ...SECURITY_HEADERS,
            ...headers
        }
    });
}

async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function constantTimeEqual(a, b) {
    if (typeof a !== "string" || typeof b !== "string") return false;
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

function getClientIP(request) {
    return (
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("X-Forwarded-For") ||
        "unknown"
    );
}

function getUserAgent(request) {
    return safeString(
        request.headers.get("User-Agent") || "unknown",
        1000
    );
}

function getPath(request) {
    try {
        return new URL(request.url).pathname;
    } catch {
        return "unknown";
    }
}

function getAllowedOrigin(env) {
    return safeString(env.ADMIN_ORIGIN, 500);
}

function corsHeaders(request, env) {
    const headers = { "Vary": "Origin" };
    const origin = request.headers.get("Origin");
    const allowedOrigin = getAllowedOrigin(env);

    if (origin && allowedOrigin && origin === allowedOrigin) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Credentials"] = "true";
        headers["Access-Control-Allow-Headers"] =
            "Content-Type, X-Requested-With";
        headers["Access-Control-Allow-Methods"] =
            "GET, POST, OPTIONS";
    }

    return headers;
}

function parseCookies(request) {
    const header = request.headers.get("Cookie");
    const cookies = {};

    if (!header) return cookies;

    for (const part of header.split(";")) {
        const separator = part.indexOf("=");
        if (separator === -1) continue;

        const name = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();

        try {
            cookies[name] = decodeURIComponent(value);
        } catch {
            cookies[name] = value;
        }
    }

    return cookies;
}

function createSessionCookie(token) {
    return [
        `${CONFIG.SESSION_COOKIE}=${encodeURIComponent(token)}`,
        "HttpOnly",
        "Secure",
        "SameSite=Strict",
        "Path=/",
        `Max-Age=${CONFIG.SESSION_TTL_SECONDS}`
    ].join("; ");
}

function clearSessionCookie() {
    return [
        `${CONFIG.SESSION_COOKIE}=`,
        "HttpOnly",
        "Secure",
        "SameSite=Strict",
        "Path=/",
        "Max-Age=0"
    ].join("; ");
}

async function readJsonBody(request) {
    const contentLength = request.headers.get("Content-Length");

    if (
        contentLength &&
        Number(contentLength) > CONFIG.MAX_BODY_BYTES
    ) {
        throw new Error("REQUEST_BODY_TOO_LARGE");
    }

    const text = await request.text();

    if (
        new TextEncoder().encode(text).byteLength >
        CONFIG.MAX_BODY_BYTES
    ) {
        throw new Error("REQUEST_BODY_TOO_LARGE");
    }

    if (!text) return {};

    return JSON.parse(text);
}

function databaseAvailable(env) {
    return Boolean(env && env.DB);
}

async function writeAudit(
    env,
    {
        event,
        actor = "system",
        success = true,
        request,
        details = {}
    }
) {
    if (!databaseAvailable(env)) {
        console.error("AUDIT_DATABASE_UNAVAILABLE", event);
        return;
    }

    try {
        await env.DB.prepare(`
            INSERT INTO audit_logs
            (
                event,
                actor,
                success,
                ip_address,
                user_agent,
                details,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
            .bind(
                safeString(event, 200),
                safeString(actor, 300),
                success ? 1 : 0,
                getClientIP(request),
                getUserAgent(request),
                JSON.stringify(details || {}),
                nowISO()
            )
            .run();
    } catch (error) {
        console.error("AUDIT_WRITE_FAILED", error);
    }
}

async function writeSecurityEvent(
    env,
    {
        event,
        severity = "medium",
        request,
        details = {}
    }
) {
    if (!databaseAvailable(env)) {
        console.error("SECURITY_DATABASE_UNAVAILABLE", event);
        return;
    }

    try {
        await env.DB.prepare(`
            INSERT INTO security_events
            (
                event,
                severity,
                ip_address,
                user_agent,
                details,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `)
            .bind(
                safeString(event, 200),
                safeString(severity, 50),
                getClientIP(request),
                getUserAgent(request),
                JSON.stringify(details || {}),
                nowISO()
            )
            .run();
    } catch (error) {
        console.error("SECURITY_EVENT_WRITE_FAILED", error);
    }
}

async function getLoginAttempt(env, request) {
    if (!databaseAvailable(env)) return null;

    return await env.DB.prepare(`
        SELECT
            ip_address,
            attempts,
            locked_until,
            updated_at
        FROM login_attempts
        WHERE ip_address = ?
        LIMIT 1
    `)
        .bind(getClientIP(request))
        .first();
}

async function isLoginBlocked(env, request) {
    const record = await getLoginAttempt(env, request);

    if (!record || !record.locked_until) return false;

    const lockTime = new Date(record.locked_until).getTime();

    if (Date.now() < lockTime) return true;

    try {
        await env.DB.prepare(`
            DELETE FROM login_attempts
            WHERE ip_address = ?
        `)
            .bind(getClientIP(request))
            .run();
    } catch {
        // Do not expose database details.
    }

    return false;
}

async function registerFailedLogin(env, request) {
    if (!databaseAvailable(env)) return;

    const ip = getClientIP(request);
    const existing = await getLoginAttempt(env, request);

    if (!existing) {
        await env.DB.prepare(`
            INSERT INTO login_attempts
            (
                ip_address,
                attempts,
                locked_until,
                updated_at
            )
            VALUES (?, ?, ?, ?)
        `)
            .bind(ip, 1, null, nowISO())
            .run();

        return;
    }

    const attempts = Number(existing.attempts || 0) + 1;

    let lockedUntil = null;

    if (attempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
        lockedUntil = new Date(
            Date.now() + CONFIG.LOCKOUT_SECONDS * 1000
        ).toISOString();
    }

    await env.DB.prepare(`
        UPDATE login_attempts
        SET
            attempts = ?,
            locked_until = ?,
            updated_at = ?
        WHERE ip_address = ?
    `)
        .bind(
            attempts,
            lockedUntil,
            nowISO(),
            ip
        )
        .run();
}

async function resetLoginAttempts(env, request) {
    if (!databaseAvailable(env)) return;

    await env.DB.prepare(`
        DELETE FROM login_attempts
        WHERE ip_address = ?
    `)
        .bind(getClientIP(request))
        .run();
}

async function verifyOwnerCredentials(env, email, password) {
    const ownerEmail = safeString(
        env.OWNER_EMAIL,
        320
    ).toLowerCase();

    const storedHash = safeString(
        env.OWNER_PASSWORD_HASH,
        200
    ).toLowerCase();

    if (!ownerEmail || !storedHash) return false;

    const suppliedEmail = safeString(
        email,
        320
    ).toLowerCase();

    if (!constantTimeEqual(suppliedEmail, ownerEmail)) {
        return false;
    }

    const suppliedPasswordHash = await sha256(password);

    return constantTimeEqual(
        suppliedPasswordHash,
        storedHash
    );
}

async function createSession(env, request) {
    if (!databaseAvailable(env)) {
        throw new Error("DATABASE_NOT_CONFIGURED");
    }

    const rawToken = randomHex(48);
    const tokenHash = await sha256(rawToken);
    const sessionId = randomHex(24);

    const expiresAt = new Date(
        Date.now() +
        CONFIG.SESSION_TTL_SECONDS * 1000
    ).toISOString();

    await env.DB.prepare(`
        INSERT INTO admin_sessions
        (
            session_id,
            token_hash,
            owner_email,
            ip_address,
            user_agent,
            expires_at,
            revoked,
            created_at,
            last_seen_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `)
        .bind(
            sessionId,
            tokenHash,
            env.OWNER_EMAIL,
            getClientIP(request),
            getUserAgent(request),
            expiresAt,
            nowISO(),
            nowISO()
        )
        .run();

    return {
        token: rawToken,
        sessionId,
        expiresAt
    };
}

async function getAuthenticatedOwner(env, request) {
    if (!databaseAvailable(env)) return null;

    const cookies = parseCookies(request);
    const token = cookies[CONFIG.SESSION_COOKIE];

    if (!token) return null;

    const tokenHash = await sha256(token);

    const session = await env.DB.prepare(`
        SELECT
            session_id,
            owner_email,
            ip_address,
            user_agent,
            expires_at,
            revoked
        FROM admin_sessions
        WHERE token_hash = ?
        LIMIT 1
    `)
        .bind(tokenHash)
        .first();

    if (!session) return null;

    if (Number(session.revoked) === 1) return null;

    if (
        Date.now() >=
        new Date(session.expires_at).getTime()
    ) {
        await env.DB.prepare(`
            UPDATE admin_sessions
            SET revoked = 1
            WHERE session_id = ?
        `)
            .bind(session.session_id)
            .run();

        return null;
    }

    const currentIP = getClientIP(request);
    const currentUA = getUserAgent(request);

    if (session.ip_address !== currentIP) {
        await writeSecurityEvent(env, {
            event: "SESSION_IP_CHANGED",
            severity: "medium",
            request,
            details: {
                sessionId: session.session_id
            }
        });
    }

    if (session.user_agent !== currentUA) {
        await writeSecurityEvent(env, {
            event: "SESSION_USER_AGENT_CHANGED",
            severity: "medium",
            request,
            details: {
                sessionId: session.session_id
            }
        });
    }

    await env.DB.prepare(`
        UPDATE admin_sessions
        SET last_seen_at = ?
        WHERE session_id = ?
    `)
        .bind(
            nowISO(),
            session.session_id
        )
        .run();

    return {
        sessionId: session.session_id,
        ownerEmail: session.owner_email
    };
}

async function requireOwner(env, request) {
    const owner = await getAuthenticatedOwner(env, request);

    if (!owner) {
        await writeSecurityEvent(env, {
            event: "UNAUTHORIZED_ADMIN_ACCESS",
            severity: "high",
            request,
            details: {
                path: getPath(request)
            }
        });

        return null;
    }

    return owner;
}

async function getEmergencyState(env) {
    if (!databaseAvailable(env)) return "UNKNOWN";

    const state = await env.DB.prepare(`
        SELECT state_value
        FROM security_state
        WHERE state_key = ?
        LIMIT 1
    `)
        .bind("EMERGENCY_LOCKDOWN")
        .first();

    if (!state) return "INACTIVE";

    return state.state_value || "INACTIVE";
}

async function isEmergencyLockdown(env) {
    return (
        await getEmergencyState(env)
    ) === "ACTIVE";
}

async function handleLogin(request, env) {
    if (
        !env.OWNER_EMAIL ||
        !env.OWNER_PASSWORD_HASH ||
        !databaseAvailable(env)
    ) {
        await writeSecurityEvent(env, {
            event: "LOGIN_BACKEND_NOT_CONFIGURED",
            severity: "critical",
            request
        });

        return json(
            {
                ok: false,
                error: "SECURITY_BACKEND_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    if (await isEmergencyLockdown(env)) {
        await writeSecurityEvent(env, {
            event: "LOGIN_BLOCKED_BY_LOCKDOWN",
            severity: "critical",
            request
        });

        return json(
            {
                ok: false,
                error: "EMERGENCY_LOCKDOWN_ACTIVE"
            },
            423,
            corsHeaders(request, env)
        );
    }

    if (await isLoginBlocked(env, request)) {
        await writeSecurityEvent(env, {
            event: "LOGIN_RATE_LIMIT_BLOCKED",
            severity: "high",
            request
        });

        return json(
            {
                ok: false,
                error: "LOGIN_TEMPORARILY_BLOCKED"
            },
            429,
            corsHeaders(request, env)
        );
    }

    let body;

    try {
        body = await readJsonBody(request);
    } catch (error) {
        await writeSecurityEvent(env, {
            event: "INVALID_LOGIN_REQUEST",
            severity: "medium",
            request,
            details: {
                reason: error.message
            }
        });

        return json(
            {
                ok: false,
                error: "INVALID_REQUEST"
            },
            400,
            corsHeaders(request, env)
        );
    }

    const email = safeString(body.email, 320);
    const password =
        typeof body.password === "string"
            ? body.password
            : "";

    if (!email || !password) {
        return json(
            {
                ok: false,
                error: "EMAIL_AND_PASSWORD_REQUIRED"
            },
            400,
            corsHeaders(request, env)
        );
    }

    const valid = await verifyOwnerCredentials(
        env,
        email,
        password
    );

    if (!valid) {
        await registerFailedLogin(env, request);

        await writeAudit(env, {
            event: "OWNER_LOGIN_FAILED",
            actor: "unknown",
            success: false,
            request,
            details: {
                email
            }
        });

        await writeSecurityEvent(env, {
            event: "INVALID_OWNER_LOGIN",
            severity: "high",
            request,
            details: {
                email
            }
        });

        return json(
            {
                ok: false,
                error: "INVALID_CREDENTIALS"
            },
            401,
            corsHeaders(request, env)
        );
    }

    await resetLoginAttempts(env, request);

    const session = await createSession(
        env,
        request
    );

    await writeAudit(env, {
        event: "OWNER_LOGIN_SUCCESS",
        actor: env.OWNER_EMAIL,
        success: true,
        request,
        details: {
            sessionId: session.sessionId
        }
    });

    return json(
        {
            ok: true,
            authenticated: true,
            owner: true,
            expiresAt: session.expiresAt
        },
        200,
        {
            ...corsHeaders(request, env),
            "Set-Cookie":
                createSessionCookie(session.token)
        }
    );
}

async function handleSession(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                authenticated: false
            },
            401,
            corsHeaders(request, env)
        );
    }

    return json(
        {
            ok: true,
            authenticated: true,
            owner: true,
            email: owner.ownerEmail
        },
        200,
        corsHeaders(request, env)
    );
}

async function handleLogout(request, env) {
    const cookies = parseCookies(request);
    const token = cookies[CONFIG.SESSION_COOKIE];

    if (token && databaseAvailable(env)) {
        const tokenHash = await sha256(token);

        const session = await env.DB.prepare(`
            SELECT
                session_id,
                owner_email
            FROM admin_sessions
            WHERE token_hash = ?
            LIMIT 1
        `)
            .bind(tokenHash)
            .first();

        if (session) {
            await env.DB.prepare(`
                UPDATE admin_sessions
                SET revoked = 1
                WHERE session_id = ?
            `)
                .bind(session.session_id)
                .run();

            await writeAudit(env, {
                event: "OWNER_LOGOUT",
                actor: session.owner_email,
                success: true,
                request
            });
        }
    }

    return json(
        {
            ok: true,
            loggedOut: true
        },
        200,
        {
            ...corsHeaders(request, env),
            "Set-Cookie":
                clearSessionCookie()
        }
    );
}

async function handleStatus(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    return json(
        {
            ok: true,
            role: "OWNER",
            security: "ACTIVE",
            backend: "ACTIVE",
            database: databaseAvailable(env),
            lockdown: await getEmergencyState(env)
        },
        200,
        corsHeaders(request, env)
    );
}

async function handleAuditLogs(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    if (!databaseAvailable(env)) {
        return json(
            {
                ok: false,
                error: "DATABASE_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    const result = await env.DB.prepare(`
        SELECT
            id,
            event,
            actor,
            success,
            ip_address,
            user_agent,
            details,
            created_at
        FROM audit_logs
        ORDER BY id DESC
        LIMIT ?
    `)
        .bind(CONFIG.MAX_AUDIT_RESULTS)
        .all();

    return json(
        {
            ok: true,
            logs: result.results || []
        },
        200,
        corsHeaders(request, env)
    );
}

async function handleSecurityEvents(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    if (!databaseAvailable(env)) {
        return json(
            {
                ok: false,
                error: "DATABASE_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    const result = await env.DB.prepare(`
        SELECT
            id,
            event,
            severity,
            ip_address,
            user_agent,
            details,
            created_at
        FROM security_events
        ORDER BY id DESC
        LIMIT ?
    `)
        .bind(CONFIG.MAX_SECURITY_RESULTS)
        .all();

    return json(
        {
            ok: true,
            events: result.results || []
        },
        200,
        corsHeaders(request, env)
    );
}

async function handleRevokeSessions(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    if (!databaseAvailable(env)) {
        return json(
            {
                ok: false,
                error: "DATABASE_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    const cookies = parseCookies(request);
    const currentToken = cookies[CONFIG.SESSION_COOKIE];

    if (!currentToken) {
        return json(
            {
                ok: false,
                error: "CURRENT_SESSION_NOT_FOUND"
            },
            401,
            corsHeaders(request, env)
        );
    }

    const currentHash = await sha256(currentToken);

    await env.DB.prepare(`
        UPDATE admin_sessions
        SET revoked = 1
        WHERE token_hash != ?
          AND revoked = 0
    `)
        .bind(currentHash)
        .run();

    await writeAudit(env, {
        event: "OWNER_REVOKED_OTHER_SESSIONS",
        actor: owner.ownerEmail,
        success: true,
        request
    });

    return json(
        {
            ok: true,
            message: "Other Owner sessions revoked."
        },
        200,
        corsHeaders(request, env)
    );
}

async function handleEmergencyLockdown(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    if (!databaseAvailable(env)) {
        return json(
            {
                ok: false,
                error: "DATABASE_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    await env.DB.prepare(`
        INSERT INTO security_state
        (
            state_key,
            state_value,
            updated_at
        )
        VALUES (?, ?, ?)
        ON CONFLICT(state_key)
        DO UPDATE SET
            state_value = excluded.state_value,
            updated_at = excluded.updated_at
    `)
        .bind(
            "EMERGENCY_LOCKDOWN",
            "ACTIVE",
            nowISO()
        )
        .run();

    await env.DB.prepare(`
        UPDATE admin_sessions
        SET revoked = 1
        WHERE revoked = 0
    `)
        .run();

    await writeAudit(env, {
        event: "EMERGENCY_LOCKDOWN_ENABLED",
        actor: owner.ownerEmail,
        success: true,
        request
    });

    await writeSecurityEvent(env, {
        event: "EMERGENCY_LOCKDOWN_ENABLED",
        severity: "critical",
        request,
        details: {
            actor: owner.ownerEmail
        }
    });

    return json(
        {
            ok: true,
            lockdown: "ACTIVE"
        },
        200,
        {
            ...corsHeaders(request, env),
            "Set-Cookie":
                clearSessionCookie()
        }
    );
}

async function handleDisableLockdown(request, env) {
    const owner = await requireOwner(
        env,
        request
    );

    if (!owner) {
        return json(
            {
                ok: false,
                error: "OWNER_AUTHORIZATION_REQUIRED"
            },
            401,
            corsHeaders(request, env)
        );
    }

    if (!databaseAvailable(env)) {
        return json(
            {
                ok: false,
                error: "DATABASE_NOT_CONFIGURED"
            },
            503,
            corsHeaders(request, env)
        );
    }

    await env.DB.prepare(`
        INSERT INTO security_state
        (
            state_key,
            state_value,
            updated_at
        )
        VALUES (?, ?, ?)
        ON CONFLICT(state_key)
        DO UPDATE SET
            state_value = excluded.state_value,
            updated_at = excluded.updated_at
    `)
        .bind(
            "EMERGENCY_LOCKDOWN",
            "INACTIVE",
            nowISO()
        )
        .run();

    await writeAudit(env, {
        event: "EMERGENCY_LOCKDOWN_DISABLED",
        actor: owner.ownerEmail,
        success: true,
        request
    });

    await writeSecurityEvent(env, {
        event: "EMERGENCY_LOCKDOWN_DISABLED",
        severity: "high",
        request
    });

    return json(
        {
            ok: true,
            lockdown: "INACTIVE"
        },
        200,
        corsHeaders(request, env)
    );
}

async function cleanupExpiredSessions(env) {
    if (!databaseAvailable(env)) return;

    try {
        await env.DB.prepare(`
            DELETE FROM admin_sessions
            WHERE expires_at <= ?
               OR revoked = 1
        `)
            .bind(nowISO())
            .run();
    } catch (error) {
        console.error(
            "SESSION_CLEANUP_FAILED",
            error
        );
    }
}

async function cleanupOldLoginAttempts(env) {
    if (!databaseAvailable(env)) return;

    try {
        const cutoff = new Date(
            Date.now() - 24 * 60 * 60 * 1000
        ).toISOString();

        await env.DB.prepare(`
            DELETE FROM login_attempts
            WHERE updated_at < ?
        `)
            .bind(cutoff)
            .run();
    } catch (error) {
        console.error(
            "LOGIN_ATTEMPT_CLEANUP_FAILED",
            error
        );
    }
}

async function route(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    const requestId =
        request.headers.get("X-Request-ID") ||
        getRequestId();

    const commonHeaders = {
        ...corsHeaders(request, env),
        "X-Request-ID": requestId
    };

    if (method === "OPTIONS") {
        return emptyResponse(
            204,
            commonHeaders
        );
    }

    if (
        path === "/" &&
        method === "GET"
    ) {
        return json(
            {
                ok: true,
                service:
                    "ALON HISTORYVERSE 24 Secure Admin API",
                status: "ONLINE",
                requestId
            },
            200,
            commonHeaders
        );
    }

    if (
        path === "/api/admin/login" &&
        method === "POST"
    ) {
        return handleLogin(
            request,
            env
        );
    }

    if (
        path === "/api/admin/session" &&
        method === "GET"
    ) {
        return handleSession(
            request,
            env
        );
    }

    if (
        path === "/api/admin/logout" &&
        method === "POST"
    ) {
        return handleLogout(
            request,
            env
        );
    }

    if (
        path === "/api/admin/status" &&
        method === "GET"
    ) {
        return handleStatus(
            request,
            env
        );
    }

    if (
        path === "/api/admin/audit" &&
        method === "GET"
    ) {
        return handleAuditLogs(
            request,
            env
        );
    }

    if (
        path === "/api/admin/security-events" &&
        method === "GET"
    ) {
        return handleSecurityEvents(
            request,
            env
        );
    }

    if (
        path === "/api/admin/revoke-sessions" &&
        method === "POST"
    ) {
        return handleRevokeSessions(
            request,
            env
        );
    }

    if (
        path === "/api/admin/emergency" &&
        method === "POST"
    ) {
        return handleEmergencyLockdown(
            request,
            env
        );
    }

    if (
        path === "/api/admin/emergency/disable" &&
        method === "POST"
    ) {
        return handleDisableLockdown(
            request,
            env
        );
    }

    await writeSecurityEvent(env, {
        event: "UNKNOWN_ADMIN_API_ROUTE",
        severity: "medium",
        request,
        details: {
            path,
            method
        }
    });

    return json(
        {
            ok: false,
            error: "NOT_FOUND",
            requestId
        },
        404,
        commonHeaders
    );
}

export default {
    async fetch(request, env, ctx) {
        const method =
            request.method.toUpperCase();

        const allowedMethods = [
            "GET",
            "POST",
            "OPTIONS"
        ];

        if (
            !allowedMethods.includes(method)
        ) {
            return json(
                {
                    ok: false,
                    error: "METHOD_NOT_ALLOWED"
                },
                405,
                corsHeaders(request, env)
            );
        }

        if (
            ctx &&
            typeof ctx.waitUntil ===
                "function"
        ) {
            ctx.waitUntil(
                Promise.allSettled([
                    cleanupExpiredSessions(env),
                    cleanupOldLoginAttempts(env)
                ])
            );
        }

        try {
            return await route(
                request,
                env,
                ctx
            );
        } catch (error) {
            console.error(
                "SECURITY_API_INTERNAL_ERROR",
                error
            );

            try {
                await writeSecurityEvent(env, {
                    event:
                        "SECURITY_API_INTERNAL_ERROR",
                    severity:
                        "critical",
                    request,
                    details: {
                        message:
                            safeString(
                                error?.message ||
                                "Unknown error",
                                500
                            )
                    }
                });
            } catch {
                // Do not expose internal error details.
            }

            return json(
                {
                    ok: false,
                    error:
                        "INTERNAL_SERVER_ERROR"
                },
                500,
                corsHeaders(
                    request,
                    env
                )
            );
        }
    }
};