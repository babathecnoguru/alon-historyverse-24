/*
============================================================
 ALON HISTORYVERSE 24
 REGULAR MARKETPLACE — DISCOVERY ENGINE
 File: regular-marketplace-discovery.js
 Version: 27.0 CLOUDFLARE API INTEGRATION
 Creator: Baba Thecno Guru

 FEATURES
 ------------------------------------------------------------
 1. Brand Promoters
 2. Travel & Tourist Places
 3. Culture Guides
 4. Movie Promoters
 5. Serials
 6. Podcasts
 7. Hosting
 8. Web Series
 9. Luxury Lifestyle
10. Sports
11. Games
12. Songs
13. Albums
14. Upcoming Content
15. World Culture & Local Life

 API-backed publishing, editing, deletion, media uploads,
 comments, engagement and view tracking.

 Existing marketplace-countries.js is not modified.
 Global Marketplace and Jobs are not modified.
============================================================
*/

(function () {
  "use strict";

  if (window.ALON_REGULAR_DISCOVERY_V27) return;
  window.ALON_REGULAR_DISCOVERY_V27 = true;

  const CONFIG = {
    version: "27.0 CLOUDFLARE API INTEGRATION",

    /*
      Keep this aligned with the actual Marketplace Worker
      deployed for ALON HISTORYVERSE 24.
    */
    apiBase:
      "https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev",

    tokenKey: "alon_marketplace_api_token",

    maxImageBytes: 8 * 1024 * 1024,
    maxVideoBytes: 40 * 1024 * 1024,

    requestTimeout: 30000,

    /*
      These are the API routes this client expects.
      The Worker must implement them for server persistence.
    */
    recordsPath: "/api/marketplace/records/discovery",
    mediaPath: "/api/media",
    engagementPath: "/api/marketplace/engagement",
    commentsPath: "/api/marketplace/comments",
    viewsPath: "/api/marketplace/views"
  };

  const STORAGE_KEYS = {
    cultureGuides:
      "alon_historyverse_regular_culture_guides",
    serials:
      "alon_historyverse_regular_serials",
    podcasts:
      "alon_historyverse_regular_podcasts",
    hosting:
      "alon_historyverse_regular_hosting",
    webSeries:
      "alon_historyverse_regular_web_series",
    luxury:
      "alon_historyverse_regular_luxury",
    sports:
      "alon_historyverse_regular_sports",
    games:
      "alon_historyverse_regular_games",
    songs:
      "alon_historyverse_regular_songs",
    albums:
      "alon_historyverse_regular_albums",
    upcoming:
      "alon_historyverse_regular_upcoming",
    brandPromoters:
      "alon_historyverse_regular_brand_promoters",
    travelPlaces:
      "alon_historyverse_regular_travel_places",
    moviePromoters:
      "alon_historyverse_regular_movie_promoters",
    worldCulture:
      "alon_historyverse_regular_world_culture"
  };

  const CATEGORIES = [
    {
      id: "brandPromoters",
      label: "Brand Promoters",
      feed: "rmdBrandFeed",
      storage: STORAGE_KEYS.brandPromoters
    },
    {
      id: "travelPlaces",
      label: "Travel & Tourist Places",
      feed: "rmdTravelFeed",
      storage: STORAGE_KEYS.travelPlaces
    },
    {
      id: "cultureGuides",
      label: "Culture Guides",
      feed: "rmdGuideFeed",
      storage: STORAGE_KEYS.cultureGuides
    },
    {
      id: "moviePromoters",
      label: "Movie Promoters",
      feed: "rmdMovieFeed",
      storage: STORAGE_KEYS.moviePromoters
    },
    {
      id: "serials",
      label: "Serials",
      feed: "rmdSerialFeed",
      storage: STORAGE_KEYS.serials
    },
    {
      id: "podcasts",
      label: "Podcasts",
      feed: "rmdPodcastFeed",
      storage: STORAGE_KEYS.podcasts
    },
    {
      id: "hosting",
      label: "Hosting",
      feed: "rmdHostingFeed",
      storage: STORAGE_KEYS.hosting
    },
    {
      id: "webSeries",
      label: "Web Series",
      feed: "rmdWebSeriesFeed",
      storage: STORAGE_KEYS.webSeries
    },
    {
      id: "luxury",
      label: "Luxury Lifestyle",
      feed: "rmdLuxuryFeed",
      storage: STORAGE_KEYS.luxury
    },
    {
      id: "sports",
      label: "Sports",
      feed: "rmdSportsFeed",
      storage: STORAGE_KEYS.sports
    },
    {
      id: "games",
      label: "Games",
      feed: "rmdGamesFeed",
      storage: STORAGE_KEYS.games
    },
    {
      id: "songs",
      label: "Songs",
      feed: "rmdSongsFeed",
      storage: STORAGE_KEYS.songs
    },
    {
      id: "albums",
      label: "Albums",
      feed: "rmdAlbumsFeed",
      storage: STORAGE_KEYS.albums
    },
    {
      id: "upcoming",
      label: "New & Upcoming",
      feed: "rmdUpcomingFeed",
      storage: STORAGE_KEYS.upcoming
    },
    {
      id: "worldCulture",
      label: "World Culture & Local Life",
      feed: "rmdCultureFeed",
      storage: STORAGE_KEYS.worldCulture
    }
  ];

  const state = {
    records: [],
    countries: [],
    activeCategory: "brandPromoters",
    search: "",
    country: "",
    editingId: null,
    loading: false,
    initialized: false
  };

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function safeURL(value) {
    if (!value) return "";

    try {
      const url = new URL(value, window.location.origin);

      if (
        url.protocol !== "https:" &&
        url.protocol !== "http:" &&
        url.protocol !== "blob:"
      ) {
        return "";
      }

      return url.href;
    } catch (_) {
      return "";
    }
  }

  function makeId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return (
      "rmd-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 11)
    );
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function getToken() {
    return (
      localStorage.getItem(CONFIG.tokenKey) ||
      localStorage.getItem("ALON_AUTH_TOKEN") ||
      ""
    );
  }

  function getAccount() {
    const candidates = [
      "ALON_AUTH_USER",
      "alon_historyverse_regular_marketplace_account",
      "alon_historyverse_regular_marketplace_session",
      "alon_historyverse_luxury_account",
      "alon_historyverse_luxury_session"
    ];

    for (const key of candidates) {
      const value = readJSON(key, null);

      if (value && typeof value === "object") {
        const account = value.user || value.account || value;

        if (
          account.id ||
          account.userId ||
          account.email ||
          account.user_id
        ) {
          return account;
        }
      }
    }

    return null;
  }

  function getUserId() {
    const account = getAccount();

    if (!account) return "";

    return String(
      account.id ||
      account.userId ||
      account.user_id ||
      account.email ||
      ""
    );
  }

  function getUserName() {
    const account = getAccount();

    if (!account) return "Marketplace User";

    return String(
      account.name ||
      account.fullName ||
      account.username ||
      account.email ||
      "Marketplace User"
    );
  }

  function isLoggedIn() {
    return Boolean(getToken() && getUserId());
  }

  async function apiRequest(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getToken();

    if (token) {
      headers.set("Authorization", "Bearer " + token);
    }

    const isFormData =
      typeof FormData !== "undefined" &&
      options.body instanceof FormData;

    if (!isFormData && options.body != null) {
      headers.set("Content-Type", "application/json");
    }

    headers.set("Accept", "application/json");

    const controller =
      typeof AbortController !== "undefined"
        ? new AbortController()
        : null;

    const timeout = controller
      ? setTimeout(
          () => controller.abort(),
          CONFIG.requestTimeout
        )
      : null;

    try {
      const response = await fetch(
        CONFIG.apiBase.replace(/\/$/, "") + path,
        {
          ...options,
          headers,
          credentials: "omit",
          signal: controller ? controller.signal : undefined
        }
      );

      const raw = await response.text();
      let data = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (_) {
        data = { message: raw };
      }

      if (!response.ok || data.ok === false) {
        throw new Error(
          data.message ||
          data.error ||
          "API request failed (" + response.status + ")"
        );
      }

      return data;
    } catch (error) {
      if (error && error.name === "AbortError") {
        throw new Error("API request timed out. Please try again.");
      }

      throw error;
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  function recordsURL(extra = "") {
    const params = new URLSearchParams();
    params.set("marketplace", "regular");

    if (extra) {
      const additional = new URLSearchParams(extra);

      additional.forEach((value, key) => {
        params.set(key, value);
      });
    }

    return CONFIG.recordsPath + "?" + params.toString();
  }

  function normalizeRecord(record) {
    if (!record || typeof record !== "object") return null;

    const category = String(
      record.category ||
      record.feature ||
      record.discoveryCategory ||
      ""
    );

    if (!CATEGORIES.some(item => item.id === category)) {
      return null;
    }

    return {
      ...record,
      id: String(record.id || record.recordId || ""),
      category,
      title: String(record.title || ""),
      description: String(record.description || ""),
      tags: Array.isArray(record.tags)
        ? record.tags
        : String(record.tags || "")
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean),
      country: String(record.country || ""),
      state: String(record.state || ""),
      city: String(record.city || ""),
      mediaUrl: String(
        record.mediaUrl ||
        record.media_url ||
        record.image ||
        record.video ||
        ""
      ),
      mediaType: String(
        record.mediaType ||
        record.media_type ||
        "image"
      ),
      ownerId: String(
        record.ownerId ||
        record.owner_id ||
        record.userId ||
        record.user_id ||
        ""
      ),
      ownerName: String(
        record.ownerName ||
        record.owner_name ||
        record.author ||
        "Marketplace User"
      ),
      createdAt: record.createdAt || record.created_at || "",
      views: Number(record.views || record.viewCount || 0),
      likes: Number(record.likes || record.likeCount || 0),
      dislikes: Number(record.dislikes || record.dislikeCount || 0),
      comments: Array.isArray(record.comments)
        ? record.comments
        : []
    };
  }

  function extractRecords(data) {
    if (Array.isArray(data)) return data;

    const possible = [
      data.records,
      data.items,
      data.listings,
      data.data,
      data.results
    ];

    for (const item of possible) {
      if (Array.isArray(item)) return item;
    }

    if (data.data && Array.isArray(data.data.records)) {
      return data.data.records;
    }

    return [];
  }

  async function loadRecords() {
    state.loading = true;
    renderStatus("Loading Discovery content…");

    try {
      const data = await apiRequest(recordsURL());

      state.records = extractRecords(data)
        .map(normalizeRecord)
        .filter(Boolean);

      renderAllFeeds();
      renderStatus(
        state.records.length +
        " Discovery posts loaded from the server."
      );

      return state.records;
    } catch (error) {
      renderAllFeeds();

      renderStatus(
        "Could not load server content: " +
        error.message +
        ". Please check the Marketplace API Worker and its Discovery routes."
      );

      return [];
    } finally {
      state.loading = false;
    }
  }

  async function uploadMedia(file) {
    if (!file) return null;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      throw new Error("Choose an image or video file.");
    }

    const limit = isVideo
      ? CONFIG.maxVideoBytes
      : CONFIG.maxImageBytes;

    if (file.size > limit) {
      throw new Error(
        isVideo
          ? "Video size must not exceed 40 MB."
          : "Image size must not exceed 8 MB."
      );
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("marketplace", "regular");
    formData.append("feature", "discovery");
    formData.append("fileName", file.name);

    const result = await apiRequest(CONFIG.mediaPath, {
      method: "POST",
      body: formData
    });

    const media =
      result.media ||
      result.data ||
      result.file ||
      result;

    const url = safeURL(
      media.url ||
      media.publicUrl ||
      media.public_url ||
      media.location
    );

    if (!url) {
      throw new Error(
        "The media API did not return a valid public URL."
      );
    }

    return {
      url,
      type: isVideo ? "video" : "image",
      name: file.name,
      size: file.size
    };
  }

  function getCategory(categoryId) {
    return CATEGORIES.find(item => item.id === categoryId);
  }

  function getCategoryRecords(categoryId) {
    let records = state.records.filter(
      item => item.category === categoryId
    );

    if (state.country) {
      records = records.filter(
        item => item.country.toLowerCase() ===
          state.country.toLowerCase()
      );
    }

    if (state.search) {
      const needle = state.search.toLowerCase();

      records = records.filter(item => {
        const text = [
          item.title,
          item.description,
          item.country,
          item.state,
          item.city,
          item.ownerName,
          ...(item.tags || [])
        ].join(" ").toLowerCase();

        return text.includes(needle);
      });
    }

    return records.sort((a, b) => {
      const aTime = Date.parse(a.createdAt || 0) || 0;
      const bTime = Date.parse(b.createdAt || 0) || 0;
      return bTime - aTime;
    });
  }

  function renderStatus(message) {
    const status = $("#rmdStatus");

    if (status) {
      status.textContent = message || "";
    }
  }

  function mediaHTML(record) {
    const url = safeURL(record.mediaUrl);

    if (!url) return "";

    if (record.mediaType === "video") {
      return (
        '<video class="rmd-media" controls preload="metadata" ' +
        'playsinline src="' + escapeHTML(url) + '">' +
        "Your browser does not support video playback." +
        "</video>"
      );
    }

    return (
      '<img class="rmd-media" loading="lazy" ' +
      'src="' + escapeHTML(url) + '" ' +
      'alt="' + escapeHTML(record.title) + '">'
    );
  }

  function isOwner(record) {
    const currentId = getUserId();

    return Boolean(
      currentId &&
      record.ownerId &&
      currentId === record.ownerId
    );
  }

  function recordCard(record) {
    const tags = (record.tags || [])
      .map(tag =>
        '<span class="rmd-tag">#' +
        escapeHTML(tag.replace(/^#/, "")) +
        "</span>"
      )
      .join(" ");

    const location = [
      record.city,
      record.state,
      record.country
    ].filter(Boolean).join(", ");

    const ownerActions = isOwner(record)
      ? (
        '<div class="rmd-owner-actions">' +
          '<button type="button" data-rmd-edit="' +
            escapeHTML(record.id) + '">Edit</button>' +
          '<button type="button" data-rmd-delete="' +
            escapeHTML(record.id) + '">Delete</button>' +
        "</div>"
      )
      : "";

    return (
      '<article class="rmd-card" data-record-id="' +
        escapeHTML(record.id) + '">' +

        mediaHTML(record) +

        '<div class="rmd-card-body">' +
          '<h3>' + escapeHTML(record.title) + "</h3>" +

          '<p class="rmd-description">' +
            escapeHTML(record.description) +
          "</p>" +

          (tags
            ? '<div class="rmd-tags">' + tags + "</div>"
            : "") +

          (location
            ? '<p class="rmd-location">📍 ' +
                escapeHTML(location) +
              "</p>"
            : "") +

          '<p class="rmd-author">By ' +
            escapeHTML(record.ownerName) +
          "</p>" +

          '<div class="rmd-stats">' +
            '<span>Views: ' +
              escapeHTML(record.views) +
            "</span>" +
            '<span>Likes: ' +
              escapeHTML(record.likes) +
            "</span>" +
            '<span>Dislikes: ' +
              escapeHTML(record.dislikes) +
            "</span>" +
          "</div>" +

          '<div class="rmd-actions">' +
            '<button type="button" data-rmd-like="' +
              escapeHTML(record.id) + '">👍 Like</button>' +
            '<button type="button" data-rmd-dislike="' +
              escapeHTML(record.id) + '">👎 Dislike</button>' +
            '<button type="button" data-rmd-comment="' +
              escapeHTML(record.id) + '">Comments (' +
              escapeHTML(record.comments.length) +
            ")</button>" +
          "</div>" +

          '<div class="rmd-comment-area" id="rmdComments-' +
            escapeHTML(record.id) + '" hidden>' +
            '<div class="rmd-comments-list"></div>' +
            '<form data-rmd-comment-form="' +
              escapeHTML(record.id) + '">' +
              '<textarea name="comment" rows="2" maxlength="3000" ' +
                'placeholder="Write a comment…" required></textarea>' +
              '<button type="submit">Send Comment</button>' +
            "</form>" +
          "</div>" +

          ownerActions +
        "</div>" +
      "</article>"
    );
  }

  function renderFeed(categoryId) {
    const category = getCategory(categoryId);
    if (!category) return;

    let feed = document.getElementById(category.feed);

    if (!feed) {
      const pane = document.querySelector(
        '[data-rmd-pane="' + categoryId + '"]'
      );

      if (pane) {
        feed = document.createElement("div");
        feed.id = category.feed;
        feed.className = "rmd-feed";
        pane.appendChild(feed);
      }
    }

    if (!feed) return;

    const records = getCategoryRecords(categoryId);

    if (!records.length) {
      feed.innerHTML =
        '<div class="rmd-empty">' +
          "No server posts found in this category yet." +
        "</div>";
      return;
    }

    feed.innerHTML = records.map(recordCard).join("");
  }

  function renderAllFeeds() {
    CATEGORIES.forEach(item => renderFeed(item.id));
  }

  function countryOptions() {
    const options = [
      '<option value="">All countries</option>'
    ];

    state.countries.forEach(country => {
      const name = typeof country === "string"
        ? country
        : (
          country.name ||
          country.country ||
          country.label ||
          ""
        );

      if (name) {
        options.push(
          '<option value="' + escapeHTML(name) + '">' +
            escapeHTML(name) +
          "</option>"
        );
      }
    });

    return options.join("");
  }

  function loadCountries() {
    const sources = [
      window.ALON_MARKETPLACE_COUNTRIES,
      window.MARKETPLACE_COUNTRIES,
      window.ALON_COUNTRIES
    ];

    for (const source of sources) {
      if (Array.isArray(source) && source.length) {
        state.countries = source;
        return;
      }

      if (
        source &&
        Array.isArray(source.countries) &&
        source.countries.length
      ) {
        state.countries = source.countries;
        return;
      }
    }

    state.countries = [];
  }

  function addStyles() {
    if ($("#rmdV27Styles")) return;

    const style = document.createElement("style");
    style.id = "rmdV27Styles";

    style.textContent = `
      #rmDiscoveryHub {
        color: #f2f4f8;
        background: #05080f;
        padding: 16px;
        border-radius: 14px;
        font-family: Arial, sans-serif;
      }

      #rmDiscoveryHub * {
        box-sizing: border-box;
      }

      #rmDiscoveryHub .rmd-heading {
        color: #f0d27a;
        margin: 0 0 8px;
      }

      #rmDiscoveryHub .rmd-subtitle {
        color: #c5cad3;
        margin: 0 0 16px;
        line-height: 1.5;
      }

      #rmDiscoveryHub .rmd-controls,
      #rmDiscoveryHub .rmd-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      #rmDiscoveryHub .rmd-controls {
        margin: 14px 0;
      }

      #rmDiscoveryHub input,
      #rmDiscoveryHub select,
      #rmDiscoveryHub textarea {
        width: 100%;
        min-width: 0;
        color: #f4f5f7;
        background: #111827;
        border: 1px solid #3b4350;
        border-radius: 8px;
        padding: 11px;
        font: inherit;
      }

      #rmDiscoveryHub input[type="file"] {
        grid-column: 1 / -1;
      }

      #rmDiscoveryHub button {
        color: #f0d27a;
        background: #141b28;
        border: 1px solid #65552c;
        border-radius: 8px;
        padding: 9px 12px;
        font: inherit;
        cursor: pointer;
      }

      #rmDiscoveryHub button:hover {
        background: #222c3d;
      }

      #rmDiscoveryHub .rmd-primary {
        color: #080b10;
        background: #d7b35a;
        border-color: #d7b35a;
        font-weight: 700;
      }

      #rmDiscoveryHub .rmd-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 16px 0;
      }

      #rmDiscoveryHub .rmd-tab[aria-selected="true"] {
        color: #080b10;
        background: #d7b35a;
        font-weight: 700;
      }

      #rmDiscoveryHub .rmd-pane[hidden],
      #rmDiscoveryHub [hidden] {
        display: none !important;
      }

      #rmDiscoveryHub .rmd-feed {
        display: grid;
        grid-template-columns: repeat(
          auto-fill,
          minmax(min(100%, 270px), 1fr)
        );
        gap: 14px;
        margin-top: 14px;
      }

      #rmDiscoveryHub .rmd-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid #303948;
        border-radius: 12px;
        background: #0c111b;
      }

      #rmDiscoveryHub .rmd-media {
        display: block;
        width: 100%;
        max-height: 340px;
        object-fit: contain;
        background: #03050a;
      }

      #rmDiscoveryHub .rmd-card-body {
        padding: 13px;
      }

      #rmDiscoveryHub .rmd-card h3 {
        margin: 0 0 9px;
        color: #f0d27a;
        overflow-wrap: anywhere;
      }

      #rmDiscoveryHub .rmd-description {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.5;
      }

      #rmDiscoveryHub .rmd-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      #rmDiscoveryHub .rmd-tag {
        color: #f0d27a;
        font-size: 12px;
      }

      #rmDiscoveryHub .rmd-location,
      #rmDiscoveryHub .rmd-author {
        color: #b8c0cc;
        font-size: 13px;
        overflow-wrap: anywhere;
      }

      #rmDiscoveryHub .rmd-stats,
      #rmDiscoveryHub .rmd-actions,
      #rmDiscoveryHub .rmd-owner-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 10px;
      }

      #rmDiscoveryHub .rmd-stats {
        color: #d2d7df;
        font-size: 12px;
        justify-content: space-between;
      }

      #rmDiscoveryHub .rmd-empty,
      #rmDiscoveryHub #rmdStatus {
        color: #c6ccd6;
        padding: 12px 0;
        line-height: 1.5;
      }

      #rmDiscoveryHub .rmd-publish-panel {
        border: 1px solid #343e4e;
        border-radius: 12px;
        padding: 14px;
        margin: 14px 0;
      }

      #rmDiscoveryHub .rmd-publish-panel h3 {
        color: #f0d27a;
        margin-top: 0;
      }

      #rmDiscoveryHub .rmd-full {
        grid-column: 1 / -1;
      }

      #rmDiscoveryHub .rmd-comment-area {
        margin-top: 12px;
        border-top: 1px solid #303948;
        padding-top: 10px;
      }

      #rmDiscoveryHub .rmd-comment {
        border-bottom: 1px solid #252d3a;
        padding: 8px 0;
        overflow-wrap: anywhere;
      }

      #rmDiscoveryHub .rmd-comment small {
        color: #b8c0cc;
      }

      @media (max-width: 560px) {
        #rmDiscoveryHub {
          padding: 10px;
        }

        #rmDiscoveryHub .rmd-controls,
        #rmDiscoveryHub .rmd-form-grid {
          grid-template-columns: minmax(0, 1fr);
        }

        #rmDiscoveryHub .rmd-tabs button {
          flex: 1 1 42%;
        }

        #rmDiscoveryHub .rmd-actions button,
        #rmDiscoveryHub .rmd-owner-actions button {
          flex: 1 1 auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function buildInterface(hub) {
    if ($("#rmdV27Root", hub)) return;

    const tabs = CATEGORIES.map((item, index) =>
      '<button type="button" class="rmd-tab" ' +
        'data-rmd-tab="' + escapeHTML(item.id) + '" ' +
        'aria-selected="' + (index === 0 ? "true" : "false") + '">' +
        escapeHTML(item.label) +
      "</button>"
    ).join("");

    const panes = CATEGORIES.map((item, index) =>
      '<section class="rmd-pane" data-rmd-pane="' +
        escapeHTML(item.id) + '"' +
        (index === 0 ? "" : " hidden") + ">" +
        '<h3 class="rmd-heading">' +
          escapeHTML(item.label) +
        "</h3>" +
        '<div id="' + escapeHTML(item.feed) +
          '" class="rmd-feed"></div>' +
      "</section>"
    ).join("");

    hub.innerHTML = `
      <div id="rmdV27Root">
        <h2 class="rmd-heading">Regular Marketplace Discovery</h2>
        <p class="rmd-subtitle">
          Discover brands, destinations, culture, entertainment,
          sports, games, music and upcoming content.
        </p>

        <div class="rmd-controls">
          <input id="rmdSearch" type="search"
            placeholder="Search titles, tags, places…"
            aria-label="Search Discovery posts">

          <select id="rmdCountryFilter"
            aria-label="Filter by country">
            ${countryOptions()}
          </select>
        </div>

        <div class="rmd-publish-panel">
          <h3 id="rmdFormHeading">Publish Discovery Content</h3>

          <form id="rmdPublishForm">
            <div class="rmd-form-grid">
              <select id="rmdCategory" name="category" required>
                ${CATEGORIES.map(item =>
                  '<option value="' + escapeHTML(item.id) + '">' +
                    escapeHTML(item.label) +
                  "</option>"
                ).join("")}
              </select>

              <input id="rmdTitle" name="title"
                maxlength="200" required
                placeholder="Post title">

              <textarea id="rmdDescription" name="description"
                class="rmd-full" rows="4" maxlength="15000"
                placeholder="Description and useful details"
                required></textarea>

              <input id="rmdTags" name="tags"
                maxlength="1000"
                placeholder="Tags separated by commas">

              <select id="rmdPublishCountry" name="country">
                ${countryOptions()}
              </select>

              <input id="rmdState" name="state"
                maxlength="120" placeholder="State / Province">

              <input id="rmdCity" name="city"
                maxlength="120" placeholder="City">

              <input id="rmdMedia" name="media" type="file"
                accept="image/*,video/*">

              <p class="rmd-full">
                Image limit: 8 MB. Video limit: 40 MB.
                Uploads require a working media API.
              </p>

              <button id="rmdSubmit" class="rmd-primary"
                type="submit">Publish</button>

              <button id="rmdCancelEdit" type="button" hidden>
                Cancel Edit
              </button>
            </div>
          </form>
        </div>

        <div id="rmdStatus" role="status" aria-live="polite"></div>

        <div class="rmd-tabs" role="tablist">
          ${tabs}
        </div>

        ${panes}
      </div>
    `;
  }

  function ensureInterface() {
    const hub = $("#rmDiscoveryHub");

    if (!hub) {
      console.warn(
        "ALON Discovery: #rmDiscoveryHub was not found. " +
        "Place this script after the Discovery container."
      );
      return false;
    }

    addStyles();
    buildInterface(hub);
    return true;
  }

  function setActiveCategory(categoryId) {
    if (!getCategory(categoryId)) return;

    state.activeCategory = categoryId;

    $$(".rmd-tab").forEach(button => {
      button.setAttribute(
        "aria-selected",
        button.dataset.rmdTab === categoryId
          ? "true"
          : "false"
      );
    });

    $$(".rmd-pane").forEach(pane => {
      pane.hidden = pane.dataset.rmdPane !== categoryId;
    });
  }

  function resetForm() {
    const form = $("#rmdPublishForm");
    if (form) form.reset();

    state.editingId = null;

    const heading = $("#rmdFormHeading");
    const submit = $("#rmdSubmit");
    const cancel = $("#rmdCancelEdit");

    if (heading) heading.textContent = "Publish Discovery Content";
    if (submit) submit.textContent = "Publish";
    if (cancel) cancel.hidden = true;
  }

  function beginEdit(recordId) {
    const record = state.records.find(
      item => item.id === recordId
    );

    if (!record) {
      renderStatus("Post not found. Refresh the feed and try again.");
      return;
    }

    if (!isOwner(record)) {
      renderStatus("Only the post owner can edit this post.");
      return;
    }

    state.editingId = record.id;

    $("#rmdCategory").value = record.category;
    $("#rmdTitle").value = record.title;
    $("#rmdDescription").value = record.description;
    $("#rmdTags").value = (record.tags || []).join(", ");
    $("#rmdPublishCountry").value = record.country || "";
    $("#rmdState").value = record.state || "";
    $("#rmdCity").value = record.city || "";
    $("#rmdMedia").value = "";

    $("#rmdFormHeading").textContent = "Edit Discovery Content";
    $("#rmdSubmit").textContent = "Save Changes";
    $("#rmdCancelEdit").hidden = false;

    setActiveCategory(record.category);

    const form = $("#rmdPublishForm");

    if (form) {
      form.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  async function submitRecord(event) {
    event.preventDefault();

    if (!isLoggedIn()) {
      renderStatus(
        "Please sign in through the existing Marketplace login first."
      );
      return;
    }

    const form = event.currentTarget;
    const submit = $("#rmdSubmit");
    const fileInput = $("#rmdMedia");
    const file = fileInput && fileInput.files
      ? fileInput.files[0]
      : null;

    const category = $("#rmdCategory").value;
    const title = $("#rmdTitle").value.trim();
    const description = $("#rmdDescription").value.trim();

    if (!getCategory(category)) {
      renderStatus("Choose a valid Discovery category.");
      return;
    }

    if (!title || !description) {
      renderStatus("Title and description are required.");
      return;
    }

    const editing = state.editingId
      ? state.records.find(item => item.id === state.editingId)
      : null;

    if (editing && !isOwner(editing)) {
      renderStatus("You cannot edit another user's post.");
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Saving…";
    }

    try {
      let uploadedMedia = null;

      if (file) {
        renderStatus("Uploading media…");
        uploadedMedia = await uploadMedia(file);
      }

      const payload = {
        marketplace: "regular",
        type: "discovery",
        category,
        title,
        description,
        tags: $("#rmdTags").value
          .split(",")
          .map(tag => tag.trim().replace(/^#/, ""))
          .filter(Boolean)
          .slice(0, 50),
        country: $("#rmdPublishCountry").value,
        state: $("#rmdState").value.trim(),
        city: $("#rmdCity").value.trim(),
        ownerId: getUserId(),
        ownerName: getUserName()
      };

      if (uploadedMedia) {
        payload.mediaUrl = uploadedMedia.url;
        payload.mediaType = uploadedMedia.type;
        payload.mediaName = uploadedMedia.name;
      } else if (editing) {
        payload.mediaUrl = editing.mediaUrl || "";
        payload.mediaType = editing.mediaType || "image";
      }

      let response;

      if (editing) {
        response = await apiRequest(
          CONFIG.recordsPath + "/" +
            encodeURIComponent(editing.id) +
            "?marketplace=regular",
          {
            method: "PUT",
            body: JSON.stringify(payload)
          }
        );
      } else {
        response = await apiRequest(
          recordsURL(),
          {
            method: "POST",
            body: JSON.stringify(payload)
          }
        );
      }

      renderStatus(
        response.message ||
        (editing
          ? "Post updated on the server."
          : "Post published to the server.")
      );

      resetForm();
      await loadRecords();
    } catch (error) {
      renderStatus(
        "Save failed: " + error.message
      );
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = state.editingId
          ? "Save Changes"
          : "Publish";
      }
    }
  }

  async function deleteRecord(recordId) {
    const record = state.records.find(
      item => item.id === recordId
    );

    if (!record) return;

    if (!isOwner(record)) {
      renderStatus("Only the post owner can delete this post.");
      return;
    }

    if (!window.confirm("Delete this Discovery post permanently?")) {
      return;
    }

    try {
      await apiRequest(
        CONFIG.recordsPath + "/" +
          encodeURIComponent(record.id) +
          "?marketplace=regular",
        { method: "DELETE" }
      );

      renderStatus("Post deleted from the server.");

      if (state.editingId === record.id) {
        resetForm();
      }

      await loadRecords();
    } catch (error) {
      renderStatus("Delete failed: " + error.message);
    }
  }

  async function sendEngagement(recordId, action) {
    if (!isLoggedIn()) {
      renderStatus("Please sign in before engaging with a post.");
      return;
    }

    const record = state.records.find(
      item => item.id === recordId
    );

    if (!record) return;

    try {
      await apiRequest(CONFIG.engagementPath, {
        method: "POST",
        body: JSON.stringify({
          marketplace: "regular",
          recordType: "discovery",
          recordId,
          action,
          userId: getUserId(),
          category: record.category
        })
      });

      renderStatus("Your response was saved.");
      await loadRecords();
    } catch (error) {
      renderStatus(
        "Engagement could not be saved: " + error.message
      );
    }
  }

  async function trackView(recordId) {
    const key = "rmd_seen_" + recordId;

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch (_) {
      // The server still receives the request if session storage
      // is unavailable; duplicate control may then be server-side.
    }

    try {
      await apiRequest(CONFIG.viewsPath, {
        method: "POST",
        body: JSON.stringify({
          marketplace: "regular",
          recordType: "discovery",
          recordId,
          country: $("#rmdCountryFilter")?.value || ""
        })
      });
    } catch (error) {
      console.warn("Discovery view tracking failed:", error.message);
    }
  }

  function renderComments(recordId, container) {
    const record = state.records.find(
      item => item.id === recordId
    );

    if (!record || !container) return;

    const list = $(".rmd-comments-list", container);
    if (!list) return;

    const comments = Array.isArray(record.comments)
      ? record.comments
      : [];

    if (!comments.length) {
      list.innerHTML =
        '<p class="rmd-empty">No comments loaded for this post.</p>';
      return;
    }

    list.innerHTML = comments.map(comment => {
      const name = comment.userName ||
        comment.user_name ||
        comment.author ||
        "Marketplace User";

      const body = comment.text ||
        comment.comment ||
        comment.message ||
        "";

      const date = comment.createdAt ||
        comment.created_at ||
        "";

      return (
        '<div class="rmd-comment">' +
          '<strong>' + escapeHTML(name) + "</strong>" +
          "<p>" + escapeHTML(body) + "</p>" +
          (date
            ? "<small>" + escapeHTML(date) + "</small>"
            : "") +
        "</div>"
      );
    }).join("");
  }

  async function submitComment(event, recordId) {
    event.preventDefault();

    if (!isLoggedIn()) {
      renderStatus("Please sign in before commenting.");
      return;
    }

    const form = event.currentTarget;
    const textarea = $('textarea[name="comment"]', form);
    const comment = textarea ? textarea.value.trim() : "";

    if (!comment) {
      renderStatus("Write a comment first.");
      return;
    }

    try {
      await apiRequest(CONFIG.commentsPath, {
        method: "POST",
        body: JSON.stringify({
          marketplace: "regular",
          recordType: "discovery",
          recordId,
          text: comment,
          userId: getUserId(),
          userName: getUserName()
        })
      });

      if (textarea) textarea.value = "";

      renderStatus("Comment submitted.");
      await loadRecords();

      const area = $("#rmdComments-" + CSS.escape(recordId));

      if (area) {
        area.hidden = false;
        renderComments(recordId, area);
      }
    } catch (error) {
      renderStatus(
        "Comment could not be saved: " + error.message
      );
    }
  }

  function bindEvents() {
    const hub = $("#rmDiscoveryHub");
    if (!hub || hub.dataset.rmdBound === "1") return;

    hub.dataset.rmdBound = "1";

    hub.addEventListener("click", async event => {
      const tab = event.target.closest("[data-rmd-tab]");

      if (tab) {
        setActiveCategory(tab.dataset.rmdTab);
        return;
      }

      const edit = event.target.closest("[data-rmd-edit]");

      if (edit) {
        beginEdit(edit.dataset.rmdEdit);
        return;
      }

      const remove = event.target.closest("[data-rmd-delete]");

      if (remove) {
        await deleteRecord(remove.dataset.rmdDelete);
        return;
      }

      const like = event.target.closest("[data-rmd-like]");

      if (like) {
        await sendEngagement(like.dataset.rmdLike, "like");
        return;
      }

      const dislike = event.target.closest("[data-rmd-dislike]");

      if (dislike) {
        await sendEngagement(dislike.dataset.rmdDislike, "dislike");
        return;
      }

      const commentButton = event.target.closest(
        "[data-rmd-comment]"
      );

      if (commentButton) {
        const recordId = commentButton.dataset.rmdComment;
        const area = $("#rmdComments-" + CSS.escape(recordId));

        if (area) {
          area.hidden = !area.hidden;
          renderComments(recordId, area);
        }

        await trackView(recordId);
      }
    });

    hub.addEventListener("submit", async event => {
      if (event.target.id === "rmdPublishForm") {
        await submitRecord(event);
        return;
      }

      const commentForm = event.target.closest(
        "[data-rmd-comment-form]"
      );

      if (commentForm) {
        await submitComment(
          event,
          commentForm.dataset.rmdCommentForm
        );
      }
    });

    hub.addEventListener("change", event => {
      if (event.target.id === "rmdCountryFilter") {
        state.country = event.target.value;
        renderAllFeeds();
      }
    });

    hub.addEventListener("input", event => {
      if (event.target.id === "rmdSearch") {
        state.search = event.target.value.trim();
        renderAllFeeds();
      }
    });

    hub.addEventListener("click", event => {
      if (event.target.id === "rmdCancelEdit") {
        resetForm();
      }
    });
  }

  function checkCompatibility() {
    const base = window.ALON_REGULAR_MARKETPLACE;

    if (!base) {
      console.info(
        "Discovery initialized independently. " +
        "The regular marketplace core export was not found."
      );
      return;
    }

    console.info(
      "Discovery detected the regular marketplace core:",
      base.version || "version not exposed"
    );
  }

  async function init() {
    if (state.initialized) return;

    if (!ensureInterface()) return;

    state.initialized = true;

    loadCountries();

    const countryFilter = $("#rmdCountryFilter");
    const publishCountry = $("#rmdPublishCountry");

    if (countryFilter) {
      countryFilter.innerHTML = countryOptions();
    }

    if (publishCountry) {
      publishCountry.innerHTML = countryOptions();
    }

    bindEvents();
    checkCompatibility();
    setActiveCategory(state.activeCategory);

    const cancel = $("#rmdCancelEdit");

    if (cancel) {
      cancel.addEventListener("click", resetForm);
    }

    await loadRecords();
  }

  window.ALON_REGULAR_DISCOVERY = {
    version: CONFIG.version,

    refresh: loadRecords,

    publish: async payload => {
      if (!isLoggedIn()) {
        throw new Error("Sign in before publishing.");
      }

      return apiRequest(recordsURL(), {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          marketplace: "regular",
          type: "discovery",
          ownerId: getUserId(),
          ownerName: getUserName()
        })
      });
    },

    getRecords: () => state.records.slice(),

    getCategories: () => CATEGORIES.map(item => ({ ...item })),

    setCategory: setActiveCategory,

    apiBase: CONFIG.apiBase
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();