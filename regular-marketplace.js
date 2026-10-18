
/*
============================================================
 ALON HISTORYVERSE 24
 REGULAR MARKETPLACE
 File: regular-marketplace.js
 Version: 26.1 SHARED MARKETPLACE API
 Creator: Baba Thecno Guru

 PART 1 OF 3
 API, authentication, session, shared utilities,
 country database and listing categories.

 Uses the separate Marketplace API Worker.
 Does NOT use the Owner/Admin Security Worker.
============================================================
*/
(function () {
  "use strict";

  if (window.__ALON_REGULAR_MARKETPLACE_V261_INIT__) return;
  window.__ALON_REGULAR_MARKETPLACE_V261_INIT__ = true;

  const CONFIG = {
    version: "26.1 SHARED MARKETPLACE API",
    apiBase: "https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev",
    marketplace: "regular",
    currency: "USD",
    showroomPrice: 10,
    maxImageBytes: 8 * 1024 * 1024,
    maxVideoBytes: 40 * 1024 * 1024,

    tokenKey: "ALON_REGULAR_MARKETPLACE_API_TOKEN",
    userKey: "ALON_REGULAR_MARKETPLACE_API_USER",

    accountsKey: "alon_historyverse_regular_marketpkes_accounts",
    sessionKey: "alon_historyverse_regular_marketpkes_session",
    listingsKey: "alon_historyverse_regular_marketpkes_listings",
    showroomsKey: "alon_historyverse_regular_marketpkes_showrooms",
    messagesKey: "alon_historyverse_regular_marketpkes_messages",
    engagementKey: "alon_historyverse_regular_marketpkes_engagement",
    visitorKey: "alon_historyverse_regular_marketpkes_visitor",
    visitorCountryKey: "alon_historyverse_regular_marketpkes_visitor_country"
  };

  const CATEGORY_DATA = {
    item: [
      "Electronics", "Home & Kitchen", "Clothing & Fashion",
      "Books & Education", "Furniture", "Tools & Equipment",
      "Agriculture", "Sports & Fitness", "Toys & Games",
      "Other Items"
    ],
    property: [
      "House", "Apartment / Flat", "Land / Plot",
      "Commercial Property", "Office", "Shop",
      "Warehouse", "Farm", "Other Property"
    ],
    vehicle: [
      "Car", "Motorcycle / Bike", "Scooter", "Truck",
      "Bus", "Van", "Bicycle", "Tractor",
      "Construction Vehicle", "Other Vehicle"
    ]
  };

  const CONDITION_DATA = [
    "New", "Used", "Refurbished", "For Parts", "Not Applicable"
  ];

  let authMode = "login";
  let apiUser = null;
  let apiToken = "";
  let remoteListings = [];
  let remoteShowrooms = [];
  let remoteMessages = [];
  let refreshInProgress = false;

  const byId = id => document.getElementById(id);
  const safeText = value => String(value == null ? "" : value);
  const normalizeEmail = value => safeText(value).trim().toLowerCase();
  const nowISO = () => new Date().toISOString();

  const generateId = prefix =>
    (prefix || "id") + "_" +
    Date.now().toString(36) + "_" +
    Math.random().toString(36).slice(2, 10);

  function escapeHTML(value) {
    return safeText(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : JSON.parse(value);
    } catch (error) {
      console.warn("Regular Marketplace: storage read failed", error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Regular Marketplace: storage write failed", error);
      return false;
    }
  }

  function removeStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function getToken() {
    return apiToken || safeText(readJSON(CONFIG.tokenKey, ""));
  }

  function getCurrentAccount() {
    if (apiUser && apiUser.id) {
      return {
        id: apiUser.id,
        name: apiUser.displayName || apiUser.name || apiUser.email,
        email: normalizeEmail(apiUser.email)
      };
    }

    const stored = readJSON(CONFIG.userKey, null);
    if (!stored || !stored.id || !stored.email || !getToken()) return null;

    return {
      id: stored.id,
      name: stored.displayName || stored.name || stored.email,
      email: normalizeEmail(stored.email)
    };
  }

  function isLoggedIn() {
    return !!(getToken() && getCurrentAccount());
  }

  function saveApiSession(data) {
    if (!data || !data.token || !data.user || !data.user.id) {
      throw new Error("The API did not return a valid login session.");
    }

    apiToken = String(data.token);
    apiUser = {
      id: String(data.user.id),
      email: normalizeEmail(data.user.email),
      displayName: String(
        data.user.displayName ||
        data.user.name ||
        data.user.email ||
        "User"
      )
    };

    if (!writeJSON(CONFIG.tokenKey, apiToken) ||
        !writeJSON(CONFIG.userKey, apiUser)) {
      removeStorage(CONFIG.tokenKey);
      removeStorage(CONFIG.userKey);
      apiToken = "";
      apiUser = null;
      throw new Error("Could not save the API session in this browser.");
    }
  }

  function clearApiSession() {
    apiToken = "";
    apiUser = null;
    removeStorage(CONFIG.tokenKey);
    removeStorage(CONFIG.userKey);
    removeStorage(CONFIG.sessionKey);
  }

  async function apiRequest(path, options) {
    options = options || {};

    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if (options.body != null && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const token = getToken();
    if (token) headers.set("Authorization", "Bearer " + token);

    const response = await fetch(CONFIG.apiBase + path, {
      method: options.method || "GET",
      headers,
      body: options.body == null
        ? undefined
        : options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
      cache: "no-store",
      credentials: "omit"
    });

    let result = {};
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      try {
        result = await response.json();
      } catch (_) {
        result = {};
      }
    } else {
      const raw = await response.text();
      if (!response.ok) {
        throw new Error(raw || "Marketplace API request failed.");
      }
    }

    if (!response.ok || result.ok === false) {
      if (response.status === 401) {
        clearApiSession();
      }

      throw new Error(
        result.message ||
        result.error ||
        ("Marketplace API error: HTTP " + response.status)
      );
    }

    return result;
  }

  function recordsPath(kind, id) {
    return "/api/marketplace/records/" +
      encodeURIComponent(kind) +
      (id ? "/" + encodeURIComponent(id) : "") +
      "?marketplace=" + encodeURIComponent(CONFIG.marketplace);
  }

  async function apiGetRecords(kind) {
    const result = await apiRequest(recordsPath(kind));
    return Array.isArray(result.records) ? result.records : [];
  }

  async function apiCreateRecord(kind, record) {
    return apiRequest(recordsPath(kind), {
      method: "POST",
      body: { record }
    });
  }

  async function apiUpdateRecord(kind, id, record) {
    return apiRequest(recordsPath(kind, id), {
      method: "PUT",
      body: { record }
    });
  }

  async function apiDeleteRecord(kind, id) {
    return apiRequest(recordsPath(kind, id), {
      method: "DELETE"
    });
  }

  function setElementHidden(element, hidden) {
    if (!element) return;
    element.hidden = !!hidden;

    if (element.classList &&
        (element.classList.contains("rm-hidden") || hidden)) {
      element.classList.toggle("rm-hidden", !!hidden);
    }
  }

  function setStatus(id, message, isError) {
    const node = byId(id);
    if (!node) return;

    node.textContent = message || "";
    node.classList.toggle("show", !!message);
    node.setAttribute("role", "status");
    node.style.color = isError ? "#b42318" : "";
  }

  const setLoginStatus = (message, error) =>
    setStatus("rmLoginStatus", message, error);

  const setListingStatus = (message, error) =>
    setStatus("rmListingStatus", message, error);

  const setShowroomStatus = (message, error) =>
    setStatus("rmShowroomStatus", message, error);

  function validPassword(password) {
    return safeText(password).length >= 8;
  }

  function requireLoginForAction() {
    if (isLoggedIn()) return true;

    setLoginStatus(
      "Please log in with your Marketplace API account first.",
      true
    );

    const form = byId("rmLoginForm");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const email = byId("rmLoginEmail");
    if (email) email.focus({ preventScroll: true });

    return false;
  }

  async function verifyApiSession() {
    if (!getToken()) return false;

    try {
      const result = await apiRequest("/api/auth/session");
      if (!result.user || !result.user.id) {
        clearApiSession();
        return false;
      }

      apiUser = {
        id: String(result.user.id),
        email: normalizeEmail(result.user.email),
        displayName: String(
          result.user.displayName ||
          result.user.name ||
          result.user.email
        )
      };

      writeJSON(CONFIG.userKey, apiUser);
      return true;
    } catch (error) {
      clearApiSession();
      console.warn("Marketplace session could not be verified.", error);
      return false;
    }
  }

  async function loginUser() {
    const email = normalizeEmail(
      byId("rmLoginEmail") && byId("rmLoginEmail").value
    );

    const passwordInput = byId("rmLoginPassword") ||
      (byId("rmLoginForm") &&
       byId("rmLoginForm").querySelector("input[type='password']"));

    const password = passwordInput ? passwordInput.value : "";
    const agreement = byId("rmAgreement");
    const name = safeText(
      byId("rmLoginName") && byId("rmLoginName").value
    ).trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setLoginStatus("Enter a valid email address.", true);
    }

    if (agreement && !agreement.checked) {
      return setLoginStatus(
        "Please accept the Terms & Conditions before continuing.",
        true
      );
    }

    if (!validPassword(password)) {
      return setLoginStatus(
        "Password must be at least 8 characters for the Marketplace API.",
        true
      );
    }

    try {
      setLoginStatus(
        authMode === "register"
          ? "Creating your shared Marketplace account..."
          : "Verifying your Marketplace account..."
      );

      const result = await apiRequest(
        authMode === "register"
          ? "/api/auth/register"
          : "/api/auth/login",
        {
          method: "POST",
          body: authMode === "register"
            ? {
                email,
                password,
                displayName: name,
                termsAccepted: true
              }
            : { email, password }
        }
      );

      saveApiSession(result);
      authMode = "login";
      ensurePasswordLoginUI();
      updateLoginUI();

      setLoginStatus(
        "Login successful. Your User ID is " + apiUser.id + "."
      );

      await refreshRemoteData();
    } catch (error) {
      setLoginStatus(error.message || "Marketplace login failed.", true);
    }
  }

  async function logoutUser() {
    try {
      if (getToken()) {
        await apiRequest("/api/auth/logout", { method: "POST" });
      }
    } catch (error) {
      console.warn("Server logout could not be confirmed.", error);
    }

    clearApiSession();
    remoteListings = [];
    remoteShowrooms = [];
    remoteMessages = [];

    const form = byId("rmLoginForm");
    if (form) form.reset();

    updateLoginUI();
    setLoginStatus("You have been logged out.");
  }

  function ensurePasswordLoginUI() {
    const form = byId("rmLoginForm");
    if (!form) return;

    const email = byId("rmLoginEmail");
    if (email) {
      email.type = "email";
      email.required = true;
      email.autocomplete = "email";
    }

    let password = byId("rmLoginPassword") ||
      form.querySelector("input[name='password'], input[type='password']");

    if (!password) {
      const wrap = document.createElement("div");
      wrap.className = "rm-field rm-login-password-field";

      const label = document.createElement("label");
      label.htmlFor = "rmLoginPassword";
      label.textContent = "Password";

      password = document.createElement("input");
      password.id = "rmLoginPassword";
      password.name = "password";
      password.type = "password";
      password.autocomplete = "current-password";
      password.required = true;
      password.minLength = 8;
      password.placeholder = "At least 8 characters";

      wrap.append(label, password);

      const agreement = byId("rmAgreement");
      const agreementWrap = agreement &&
        (agreement.closest("label") || agreement.parentElement);

      if (agreementWrap && agreementWrap.parentNode === form) {
        form.insertBefore(wrap, agreementWrap);
      } else {
        form.appendChild(wrap);
      }
    }

    password.id = password.id || "rmLoginPassword";
    password.required = true;
    password.minLength = 8;
    password.autocomplete =
      authMode === "register" ? "new-password" : "current-password";

    const name = byId("rmLoginName");
    if (name) {
      const label = form.querySelector("label[for='rmLoginName']");
      setElementHidden(label, authMode !== "register");
      setElementHidden(name, authMode !== "register");
      name.required = authMode === "register";
      name.autocomplete = "name";
    }

    let modeButton = byId("rmAuthModeBtn");

    if (!modeButton) {
      modeButton = document.createElement("button");
      modeButton.type = "button";
      modeButton.id = "rmAuthModeBtn";
      modeButton.className = "rm-btn";
      modeButton.style.marginTop = "10px";

      const actions = form.querySelector(".rm-actions");
      if (actions) actions.appendChild(modeButton);
      else form.appendChild(modeButton);

      modeButton.addEventListener("click", function () {
        authMode = authMode === "login" ? "register" : "login";
        ensurePasswordLoginUI();

        const submit = form.querySelector("button[type='submit']");
        if (submit) {
          submit.textContent =
            authMode === "register" ? "Create Account" : "Login";
        }

        setLoginStatus(
          authMode === "register"
            ? "Create a shared Marketplace account using your name, email and password."
            : "Enter the email and password of your Marketplace account."
        );
      });
    }

    modeButton.textContent =
      authMode === "register"
        ? "Already have an account? Login"
        : "New user? Create Account";

    const submit = form.querySelector("button[type='submit']");
    if (submit) {
      submit.textContent =
        authMode === "register" ? "Create Account" : "Login";
    }
  }

  function updateLoginUI() {
    const account = getCurrentAccount();
    setElementHidden(byId("rmLoginForm"), !!account);
    setElementHidden(byId("rmProfileSection"), !account);

    if (byId("rmProfileName")) {
      byId("rmProfileName").textContent = account ? account.name : "";
    }

    if (byId("rmProfileEmail")) {
      byId("rmProfileEmail").textContent = account ? account.email : "";
    }

    let profileId = byId("rmProfileUserId");

    if (!profileId && byId("rmProfileEmail")) {
      profileId = document.createElement("p");
      profileId.id = "rmProfileUserId";
      byId("rmProfileEmail").insertAdjacentElement("afterend", profileId);
    }

    if (profileId) {
      profileId.innerHTML = "<strong>User ID:</strong> " +
        escapeHTML(account ? account.id : "Not logged in");
    }

    document.querySelectorAll("[data-rm-current-user-id]").forEach(el => {
      el.textContent = account ? account.id : "Not logged in";
    });
  }

  function getCountryDatabase() {
    const db =
      window.ALON_MARKETPLACE_COUNTRIES ||
      window.MARKETPLACE_COUNTRIES ||
      window.marketplaceCountries ||
      window.COUNTRIES;

    if (Array.isArray(db)) return db;
    if (db && Array.isArray(db.countries)) return db.countries;
    if (db && typeof db === "object") return Object.values(db);
    return [];
  }

  function countryValue(item) {
    if (typeof item === "string") return item;
    return safeText(
      item && (item.name || item.country || item.label ||
      item.value || item.commonName)
    );
  }

  function populateCountrySelect(select) {
    if (!select) return;

    const previous = select.value;
    const countries = getCountryDatabase()
      .map(countryValue)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    if (!countries.length) return;

    select.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = "Select country";
    select.appendChild(first);

    countries.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    });

    if (countries.includes(previous)) select.value = previous;
  }

  function populateAllCountries() {
    ["rmCountry", "rmShowroomCountry"].forEach(id => {
      populateCountrySelect(byId(id));
    });
  }

  function hideOldLocationFields() {
    ["rmPin", "rmShowroomPin"].forEach(id => {
      const input = byId(id);
      if (!input) return;

      const parent = input.closest(".rm-field") || input.parentElement;
      if (parent) parent.hidden = true;
      input.required = false;
    });

    const taluka = byId("rmShowroomTaluka");
    if (taluka) {
      const parent = taluka.closest(".rm-field") || taluka.parentElement;
      if (parent) parent.hidden = true;
      taluka.required = false;
    }

    [
      ["rmDistrict", "City"],
      ["rmShowroomDistrict", "City"]
    ].forEach(([id, labelText]) => {
      const input = byId(id);
      if (!input) return;

      const label = document.querySelector("label[for='" + id + "']");
      if (label) label.textContent = labelText;
      input.placeholder = labelText;
    });
  }

  function getCity(id, fallbackId) {
    return safeText(
      (byId(id) && byId(id).value) ||
      (fallbackId && byId(fallbackId) && byId(fallbackId).value)
    ).trim();
  }

  function getSelectedType() {
    const select = byId("rmListingType");
    if (select && select.value) return select.value;

    const checked = document.querySelector(
      "input[name='rmTypeChoice']:checked"
    );

    return checked ? checked.value : "item";
  }

  function populateListingCategories(type) {
    const select = byId("rmListingCategory");
    if (!select) return;

    const current = select.value;
    const categories = CATEGORY_DATA[type] || CATEGORY_DATA.item;
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select category";
    select.appendChild(placeholder);

    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      select.appendChild(option);
    });

    if (categories.includes(current)) select.value = current;
  }

  function populateConditionOptions() {
    const select = byId("rmListingCondition");
    if (!select) return;

    const current = select.value;
    select.innerHTML = "";

    CONDITION_DATA.forEach(condition => {
      const option = document.createElement("option");
      option.value = condition;
      option.textContent = condition;
      select.appendChild(option);
    });

    if (CONDITION_DATA.includes(current)) select.value = current;
  }

  function syncTypeChoice(type) {
    const select = byId("rmListingType");
    if (select) select.value = type;

    const radio = document.querySelector(
      "input[name='rmTypeChoice'][value='" + CSS.escape(type) + "']"
    );

    if (radio) radio.checked = true;
    populateListingCategories(type);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve("");

      const reader = new FileReader();
      reader.onload = () => resolve(safeText(reader.result));
      reader.onerror = () => reject(new Error("Could not read selected file."));
      reader.readAsDataURL(file);
    });
  }

  // PART 2 CONTINUES BELOW THIS POINT.

// ============================================================
// PART 2 OF 3
// Shared listings, media upload, seller messages and showrooms.
// Continue directly after PART 1.
// ============================================================

  function getListings() {
    return remoteListings.filter(item =>
      item && item.status !== "deleted" && item.status !== "inactive"
    );
  }

  function getMyListings() {
    const account = getCurrentAccount();
    if (!account) return [];

    return getListings().filter(item =>
      String(item.ownerId || item.sellerId || "") === String(account.id)
    );
  }

  function getShowrooms() {
    return remoteShowrooms.filter(item =>
      item && item.status !== "deleted" && item.status !== "inactive"
    );
  }

  function getMyShowrooms() {
    const account = getCurrentAccount();
    if (!account) return [];

    return getShowrooms().filter(item =>
      String(item.ownerId || item.sellerId || "") === String(account.id)
    );
  }

  function getMessages() {
    return remoteMessages.filter(Boolean);
  }

  async function uploadMedia(file, kind) {
    if (!file) return "";

    const isImage = kind === "image";
    const maxBytes = isImage
      ? CONFIG.maxImageBytes
      : CONFIG.maxVideoBytes;

    if (file.size > maxBytes) {
      throw new Error(
        isImage
          ? "Image must be 8 MB or smaller."
          : "Video must be 40 MB or smaller."
      );
    }

    const allowedTypes = isImage
      ? ["image/jpeg", "image/png", "image/webp", "image/gif"]
      : ["video/mp4", "video/webm", "video/quicktime"];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        isImage
          ? "Choose a JPG, PNG, WebP or GIF image."
          : "Choose an MP4, WebM or MOV video."
      );
    }

    if (!requireLoginForAction()) {
      throw new Error("Please log in before uploading media.");
    }

    const form = new FormData();
    form.append("file", file);
    form.append("marketplace", CONFIG.marketplace);
    form.append("kind", kind);

    const result = await apiRequest("/api/media", {
      method: "POST",
      body: form
    });

    if (!result.url) {
      throw new Error("The Marketplace API did not return a media URL.");
    }

    return result.url;
  }

  function resetListingForm() {
    const form = byId("rmListingForm");
    if (form) form.reset();

    if (byId("rmListingId")) byId("rmListingId").value = "";

    setElementHidden(byId("rmSaveBtn"), false);
    setElementHidden(byId("rmUpdateBtn"), true);
    setElementHidden(byId("rmCancelEditBtn"), true);

    syncTypeChoice("item");
    populateConditionOptions();
    setListingStatus("");
  }

  function collectListingFields(account, existing) {
    return {
      id: existing ? existing.id : generateId("listing"),
      type: getSelectedType(),
      category: safeText(
        byId("rmListingCategory") && byId("rmListingCategory").value
      ).trim(),
      title: safeText(
        byId("rmListingTitle") && byId("rmListingTitle").value
      ).trim(),
      condition: safeText(
        byId("rmListingCondition") && byId("rmListingCondition").value
      ).trim(),
      country: safeText(
        byId("rmCountry") && byId("rmCountry").value
      ).trim(),
      state: safeText(
        byId("rmState") && byId("rmState").value
      ).trim(),
      city: getCity("rmDistrict"),
      district: getCity("rmDistrict"),
      pin: "",
      price: safeText(
        byId("rmPrice") && byId("rmPrice").value
      ).trim(),
      currency: safeText(
        byId("rmCurrency") && byId("rmCurrency").value
      ).trim() || CONFIG.currency,
      location: safeText(
        byId("rmLocation") && byId("rmLocation").value
      ).trim(),
      reach: safeText(
        byId("rmReach") && byId("rmReach").value
      ).trim() || "Local",
      description: safeText(
        byId("rmDescription") && byId("rmDescription").value
      ).trim(),
      image: existing ? existing.image || "" : "",
      video: existing ? existing.video || "" : "",
      createdAt: existing ? existing.createdAt : nowISO(),
      updatedAt: nowISO(),
      status: "active"
    };
  }

  async function refreshRemoteData() {
    if (refreshInProgress) return;
    refreshInProgress = true;

    try {
      const results = await Promise.all([
        apiGetRecords("listing"),
        apiGetRecords("showroom"),
        isLoggedIn()
          ? apiRequest("/api/marketplace/messages")
          : Promise.resolve({ messages: [] })
      ]);

      remoteListings = results[0].map(item => ({
        ...item,
        ownerId: item.ownerId || item.sellerId || "",
        ownerName: item.ownerName || item.sellerName || "Seller",
        status: item.status || "active"
      }));

      remoteShowrooms = results[1].map(item => ({
        ...item,
        ownerId: item.ownerId || item.sellerId || "",
        ownerName: item.ownerName || item.sellerName || "Business",
        status: item.status || "active"
      }));

      remoteMessages = Array.isArray(results[2].messages)
        ? results[2].messages
        : [];

      renderListings();
      renderMarketplaceListings();
      renderShowrooms();
      renderBusinessMessages();
    } catch (error) {
      console.error("Regular Marketplace refresh failed:", error);

      setListingStatus(
        "Marketplace could not refresh from the server: " +
        (error.message || "Please try again."),
        true
      );
    } finally {
      refreshInProgress = false;
    }
  }

  async function saveListing(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!requireLoginForAction()) return;

    const account = getCurrentAccount();
    const id = safeText(
      byId("rmListingId") && byId("rmListingId").value
    ).trim();

    const existing = id
      ? getListings().find(item =>
          item.id === id &&
          String(item.ownerId || item.sellerId) === String(account.id)
        )
      : null;

    if (id && !existing) {
      return setListingStatus(
        "Listing not found or you do not own it.",
        true
      );
    }

    const listing = collectListingFields(account, existing);

    if (!listing.title) {
      return setListingStatus("Enter a listing title.", true);
    }

    if (!listing.category) {
      return setListingStatus("Select a category.", true);
    }

    if (!listing.country) {
      return setListingStatus("Select a country.", true);
    }

    if (!listing.description) {
      return setListingStatus("Enter a description.", true);
    }

    const imageFile = byId("rmImage") && byId("rmImage").files[0];
    const videoFile = byId("rmVideo") && byId("rmVideo").files[0];

    try {
      setListingStatus(
        "Uploading media and saving your listing to the server..."
      );

      if (imageFile) listing.image = await uploadMedia(imageFile, "image");
      if (videoFile) listing.video = await uploadMedia(videoFile, "video");

      if (existing) {
        await apiUpdateRecord("listing", existing.id, listing);
      } else {
        await apiCreateRecord("listing", listing);
      }

      await refreshRemoteData();
      resetListingForm();

      setListingStatus(
        existing
          ? "Listing updated on the Marketplace server."
          : "Listing published successfully. Seller ID: " + account.id
      );
    } catch (error) {
      setListingStatus(
        error.message || "The listing could not be saved.",
        true
      );
    }
  }

  function editListing(id) {
    if (!requireLoginForAction()) return;

    const account = getCurrentAccount();
    const listing = getMyListings().find(item => item.id === id);

    if (!listing) {
      return setListingStatus(
        "Listing not found or you do not own it.",
        true
      );
    }

    const values = {
      rmListingId: listing.id,
      rmListingTitle: listing.title,
      rmListingCondition: listing.condition,
      rmCountry: listing.country,
      rmState: listing.state,
      rmDistrict: listing.city || listing.district,
      rmPin: "",
      rmPrice: listing.price,
      rmCurrency: listing.currency,
      rmLocation: listing.location,
      rmReach: listing.reach,
      rmDescription: listing.description
    };

    syncTypeChoice(listing.type || "item");

    Object.entries(values).forEach(([id, value]) => {
      const element = byId(id);
      if (element) element.value = value == null ? "" : value;
    });

    if (byId("rmListingCategory")) {
      byId("rmListingCategory").value = listing.category || "";
    }

    setElementHidden(byId("rmSaveBtn"), true);
    setElementHidden(byId("rmUpdateBtn"), false);
    setElementHidden(byId("rmCancelEditBtn"), false);

    setListingStatus(
      "Editing your server listing. Choose new media only to replace existing media."
    );

    const form = byId("rmListingForm");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function deleteListing(id) {
    if (!requireLoginForAction()) return;

    const listing = getMyListings().find(item => item.id === id);
    if (!listing) {
      return setListingStatus(
        "Listing not found or you do not own it.",
        true
      );
    }

    if (!confirm("Delete this listing from the Marketplace server?")) return;

    try {
      await apiDeleteRecord("listing", id);
      await refreshRemoteData();
      setListingStatus("Listing deleted from the server.");
    } catch (error) {
      setListingStatus(error.message || "Listing could not be deleted.", true);
    }
  }

  function mediaHTML(src, kind, alt) {
    if (!src) return "";

    const safeSrc = escapeHTML(src);

    if (kind === "video") {
      return '<video controls preload="metadata" style="width:100%;max-width:100%;height:auto">' +
        '<source src="' + safeSrc + '"></video>';
    }

    return '<img loading="lazy" src="' + safeSrc +
      '" alt="' + escapeHTML(alt || "Listing photo") +
      '" style="display:block;width:100%;max-height:360px;object-fit:contain">';
  }

  function renderListingCard(listing, ownerControls) {
    const price = listing.price
      ? escapeHTML(listing.currency || CONFIG.currency) + " " +
        escapeHTML(listing.price)
      : "Price not specified";

    const location = [
      listing.city || listing.district,
      listing.state,
      listing.country
    ].filter(Boolean).map(escapeHTML).join(", ") || "Location not specified";

    const controls = ownerControls
      ? '<div class="rm-ad-actions">' +
        '<button type="button" class="rm-edit-ad-btn" data-id="' +
        escapeHTML(listing.id) + '">Edit</button>' +
        '<button type="button" class="rm-delete-ad-btn" data-id="' +
        escapeHTML(listing.id) + '">Delete</button></div>'
      : "";

    const account = getCurrentAccount();
    const isOwner = !!account &&
      String(listing.ownerId || listing.sellerId || "") === String(account.id);

    return '<article class="rm-listing-card" data-listing-id="' +
      escapeHTML(listing.id) + '">' +
      (listing.image
        ? '<div class="rm-listing-media">' +
          mediaHTML(listing.image, "image", listing.title) + '</div>'
        : "") +
      (listing.video
        ? '<div class="rm-listing-media">' +
          mediaHTML(listing.video, "video", listing.title) + '</div>'
        : "") +
      '<div class="rm-listing-content">' +
      '<h3>' + escapeHTML(listing.title) + '</h3>' +
      '<p><strong>Listing ID:</strong> ' + escapeHTML(listing.id) + '</p>' +
      '<p><strong>Seller:</strong> ' +
        escapeHTML(listing.ownerName || listing.sellerName || "Seller") + '</p>' +
      '<p><strong>Seller ID:</strong> ' +
        escapeHTML(listing.ownerId || listing.sellerId || "Not available") + '</p>' +
      '<p><strong>Type:</strong> ' + escapeHTML(listing.type || "item") + '</p>' +
      '<p><strong>Category:</strong> ' + escapeHTML(listing.category || "") + '</p>' +
      '<p><strong>Condition:</strong> ' +
        escapeHTML(listing.condition || "Not specified") + '</p>' +
      '<p><strong>Price:</strong> ' + price + '</p>' +
      '<p><strong>Location:</strong> ' + location + '</p>' +
      '<p><strong>Reach:</strong> ' + escapeHTML(listing.reach || "Local") + '</p>' +
      '<p>' + escapeHTML(listing.description || "") + '</p></div>' +
      (isOwner
        ? '<p class="rm-owner-note">This is your listing.</p>'
        : '<button type="button" class="rm-message-seller-btn" data-id="' +
          escapeHTML(listing.id) + '">Message Seller</button>') +
      controls + '</article>';
  }

  function renderListings() {
    const container = byId("rmListings");
    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML =
        '<div class="rm-empty">Login to view and manage your listings.</div>';
      return;
    }

    const listings = getMyListings();

    container.innerHTML = listings.length
      ? listings.map(item => renderListingCard(item, true)).join("")
      : '<div class="rm-empty">You have no listings yet. Add an item, property or vehicle above.</div>';
  }

  function ensureMarketplaceBrowseUI() {
    const sellSection = byId("rmSellSection");
    if (!sellSection || byId("rmMarketplaceListingsSection")) return;

    const section = document.createElement("section");
    section.id = "rmMarketplaceListingsSection";
    section.className = "rm-section";
    section.innerHTML =
      '<h2>🛍️ Marketplace Listings — All Sellers</h2>' +
      '<p class="rm-note">Browse active listings published by all sellers on the server.</p>' +
      '<div id="rmMarketplaceListings" class="rm-list-grid">' +
      '<div class="rm-empty">Loading Marketplace listings...</div></div>';

    const form = byId("rmListingForm");
    if (form) form.insertAdjacentElement("afterend", section);
    else sellSection.appendChild(section);
  }

  function renderMarketplaceListings() {
    const container = byId("rmMarketplaceListings");
    if (!container) return;

    const account = getCurrentAccount();
    const listings = getListings();

    if (!listings.length) {
      container.innerHTML =
        '<div class="rm-empty">No active listings yet. Listings from sellers will appear here.</div>';
      return;
    }

    container.innerHTML = listings.map(item => {
      const own = !!account &&
        String(item.ownerId || item.sellerId || "") === String(account.id);
      return renderListingCard(item, own);
    }).join("");
  }

  async function openListingMessage(listingId) {
    if (!requireLoginForAction()) return;

    const account = getCurrentAccount();
    const listing = getListings().find(item => item.id === listingId);

    if (!listing) return alert("This listing is no longer available.");

    if (String(listing.ownerId || listing.sellerId || "") === String(account.id)) {
      return alert("This is your own listing.");
    }

    const text = prompt(
      "Message seller " + (listing.ownerName || listing.sellerName || "Seller") +
      " about: " + listing.title
    );

    if (text === null) return;
    if (!text.trim()) return alert("Please enter a message.");

    try {
      await apiRequest("/api/marketplace/messages", {
        method: "POST",
        body: {
          marketplace: CONFIG.marketplace,
          listingId: listing.id,
          listingTitle: listing.title,
          toId: String(listing.ownerId || listing.sellerId || ""),
          text: text.trim()
        }
      });

      await refreshRemoteData();
      playNotificationTone();
      alert("Your message was sent to the seller through the Marketplace API.");
    } catch (error) {
      alert(error.message || "The seller message could not be sent.");
    }
  }

// PART 3 CONTINUES BELOW THIS POINT.

// ============================================================
// PART 3 OF 3
// Business ads, inbox, events, styles and initialization.
// Continue directly after PART 2.
// ============================================================

  function getShowroomDirectLink() {
    const input = byId("rmShowroomDirectLink");
    return input ? input.value.trim() : "";
  }

  function validDirectLink(link) {
    if (!link) return true;
    try {
      const url = new URL(link);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (_) {
      return false;
    }
  }

  function ensureShowroomDirectLinkUI() {
    const form = byId("rmShowroomForm");
    if (!form || byId("rmShowroomDirectLink")) return;

    const wrap = document.createElement("div");
    wrap.className = "rm-field";

    const label = document.createElement("label");
    label.htmlFor = "rmShowroomDirectLink";
    label.textContent = "Business website / contact link (optional)";

    const input = document.createElement("input");
    input.id = "rmShowroomDirectLink";
    input.name = "directLink";
    input.type = "url";
    input.placeholder = "https://example.com";
    input.autocomplete = "url";

    wrap.append(label, input);

    const description = byId("rmShowroomDescription");
    const parent = description &&
      (description.closest(".rm-field") || description.parentElement);

    if (parent && parent.parentNode === form) {
      parent.insertAdjacentElement("afterend", wrap);
    } else {
      form.appendChild(wrap);
    }
  }

  function resetShowroomForm() {
    const form = byId("rmShowroomForm");
    if (form) form.reset();

    if (byId("rmShowroomId")) byId("rmShowroomId").value = "";

    setElementHidden(byId("rmShowroomSaveBtn"), false);
    setElementHidden(byId("rmShowroomUpdateBtn"), true);
    setShowroomStatus("");
  }

  function collectShowroomFields(account, existing) {
    return {
      id: existing ? existing.id : generateId("business"),
      name: safeText(
        byId("rmShowroomName") && byId("rmShowroomName").value
      ).trim(),
      country: safeText(
        byId("rmShowroomCountry") && byId("rmShowroomCountry").value
      ).trim(),
      state: safeText(
        byId("rmShowroomState") && byId("rmShowroomState").value
      ).trim(),
      city: getCity("rmShowroomDistrict"),
      district: getCity("rmShowroomDistrict"),
      category: safeText(
        byId("rmShowroomCategory") && byId("rmShowroomCategory").value
      ).trim(),
      reach: safeText(
        byId("rmShowroomReach") && byId("rmShowroomReach").value
      ).trim() || "Local",
      description: safeText(
        byId("rmShowroomDescription") &&
        byId("rmShowroomDescription").value
      ).trim(),
      directLink: getShowroomDirectLink(),
      image: existing ? existing.image || "" : "",
      video: existing ? existing.video || "" : "",
      price: CONFIG.showroomPrice,
      currency: CONFIG.currency,
      paymentStatus: existing ? existing.paymentStatus || "unpaid" : "unpaid",
      adStatus: "active",
      status: "active",
      createdAt: existing ? existing.createdAt : nowISO(),
      updatedAt: nowISO()
    };
  }

  async function saveShowroom(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!requireLoginForAction()) return;

    const account = getCurrentAccount();
    const id = safeText(
      byId("rmShowroomId") && byId("rmShowroomId").value
    ).trim();

    const existing = id
      ? getMyShowrooms().find(item => item.id === id)
      : null;

    if (id && !existing) {
      return setShowroomStatus(
        "Business advertisement not found or you do not own it.",
        true
      );
    }

    const showroom = collectShowroomFields(account, existing);

    if (!showroom.name) {
      return setShowroomStatus("Enter your business name.", true);
    }

    if (!showroom.country) {
      return setShowroomStatus("Select a country.", true);
    }

    if (!validDirectLink(showroom.directLink)) {
      return setShowroomStatus(
        "Enter a valid HTTP or HTTPS business link.",
        true
      );
    }

    const imageFile = byId("rmShowroomImage") &&
      byId("rmShowroomImage").files[0];

    const videoFile = byId("rmShowroomVideo") &&
      byId("rmShowroomVideo").files[0];

    try {
      setShowroomStatus("Saving business advertisement to the server...");

      if (imageFile) {
        showroom.image = await uploadMedia(imageFile, "image");
      }

      if (videoFile) {
        showroom.video = await uploadMedia(videoFile, "video");
      }

      if (existing) {
        await apiUpdateRecord("showroom", existing.id, showroom);
      } else {
        await apiCreateRecord("showroom", showroom);
      }

      await refreshRemoteData();
      resetShowroomForm();

      setShowroomStatus(
        existing
          ? "Business advertisement updated on the server."
          : "Business advertisement published. The displayed $10 USD is a planned price; no payment was collected."
      );
    } catch (error) {
      setShowroomStatus(
        error.message || "Business advertisement could not be saved.",
        true
      );
    }
  }

  function editShowroom(id) {
    if (!requireLoginForAction()) return;

    const showroom = getMyShowrooms().find(item => item.id === id);

    if (!showroom) {
      return setShowroomStatus(
        "Business advertisement not found or you do not own it.",
        true
      );
    }

    const fields = {
      rmShowroomId: showroom.id,
      rmShowroomName: showroom.name,
      rmShowroomCountry: showroom.country,
      rmShowroomState: showroom.state,
      rmShowroomDistrict: showroom.city || showroom.district,
      rmShowroomCategory: showroom.category,
      rmShowroomReach: showroom.reach,
      rmShowroomDescription: showroom.description,
      rmShowroomDirectLink: showroom.directLink || ""
    };

    Object.entries(fields).forEach(([id, value]) => {
      const element = byId(id);
      if (element) element.value = value == null ? "" : value;
    });

    setElementHidden(byId("rmShowroomSaveBtn"), true);
    setElementHidden(byId("rmShowroomUpdateBtn"), false);

    setShowroomStatus(
      "Editing your advertisement. Select new media only to replace existing media."
    );

    const form = byId("rmShowroomForm");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function deleteShowroom(id) {
    if (!requireLoginForAction()) return;

    if (!getMyShowrooms().some(item => item.id === id)) {
      return setShowroomStatus(
        "Business advertisement not found or you do not own it.",
        true
      );
    }

    if (!confirm("Delete this business advertisement from the server?")) {
      return;
    }

    try {
      await apiDeleteRecord("showroom", id);
      await refreshRemoteData();
      setShowroomStatus("Business advertisement deleted from the server.");
    } catch (error) {
      setShowroomStatus(
        error.message || "Business advertisement could not be deleted.",
        true
      );
    }
  }

  function getEngagement() {
    const value = readJSON(CONFIG.engagementKey, {});
    return value && typeof value === "object" ? value : {};
  }

  function getItemEngagement(id) {
    const item = getEngagement()[id] || {};

    return {
      likes: Array.isArray(item.likes) ? item.likes : [],
      dislikes: Array.isArray(item.dislikes) ? item.dislikes : [],
      views: Number(item.views) || 0,
      countries: item.countries || {},
      viewed: Array.isArray(item.viewed) ? item.viewed : []
    };
  }

  function saveItemEngagement(id, data) {
    const all = getEngagement();
    all[id] = data;
    return writeJSON(CONFIG.engagementKey, all);
  }

  function getViewerKey() {
    const account = getCurrentAccount();
    if (account) return "user:" + account.id;

    try {
      let visitor = sessionStorage.getItem(CONFIG.visitorKey);
      if (!visitor) {
        visitor = generateId("visitor");
        sessionStorage.setItem(CONFIG.visitorKey, visitor);
      }
      return visitor;
    } catch (_) {
      return "visitor:" + Date.now();
    }
  }

  function currentVisitorCountry() {
    const stored = safeText(
      readJSON(CONFIG.visitorCountryKey, "")
    ).trim();

    if (stored) return stored;

    return safeText(
      byId("rmCountry") && byId("rmCountry").value
    ).trim() || "Unknown";
  }

  function addView(id) {
    const data = getItemEngagement(id);
    const viewer = getViewerKey();

    if (data.viewed.includes(viewer)) return data;

    data.viewed.push(viewer);
    data.views += 1;

    const country = currentVisitorCountry();
    data.countries[country] =
      (Number(data.countries[country]) || 0) + 1;

    saveItemEngagement(id, data);
    return data;
  }

  function toggleReaction(id, reaction) {
    if (!requireLoginForAction()) return;

    const account = getCurrentAccount();
    const data = getItemEngagement(id);
    const key = account.id;

    const active = reaction === "like" ? data.likes : data.dislikes;
    const opposite = reaction === "like" ? data.dislikes : data.likes;
    const index = active.indexOf(key);

    if (index >= 0) {
      active.splice(index, 1);
    } else {
      active.push(key);
      const oppositeIndex = opposite.indexOf(key);
      if (oppositeIndex >= 0) opposite.splice(oppositeIndex, 1);
    }

    saveItemEngagement(id, data);
    renderShowrooms();
  }

  function getCountryReachText(data) {
    const entries = Object.entries(data.countries || {})
      .filter(([country, count]) => country && Number(count) > 0);

    return {
      countries: entries.length
        ? entries.map(entry => entry[0]).join(", ")
        : "No country data yet",
      views: entries.length
        ? entries.map(entry => entry[0] + ": " + entry[1]).join(" · ")
        : "No views yet"
    };
  }

  function renderShowroomCard(showroom) {
    const engagement = getItemEngagement(showroom.id);
    const reach = getCountryReachText(engagement);
    const account = getCurrentAccount();

    const isOwner = !!account &&
      String(showroom.ownerId || showroom.sellerId || "") === String(account.id);

    const city = showroom.city || showroom.district || "";

    const image = showroom.image
      ? mediaHTML(showroom.image, "image", showroom.name)
      : '<div class="rm-showroom-no-image">Business photo not provided</div>';

    const video = showroom.video
      ? mediaHTML(showroom.video, "video", showroom.name)
      : "";

    const directLink = showroom.directLink && validDirectLink(showroom.directLink)
      ? '<a class="rm-business-direct-link" href="' +
        escapeHTML(showroom.directLink) +
        '" target="_blank" rel="noopener noreferrer">Contact Business</a>'
      : "";

    const ownerControls = isOwner
      ? '<div class="rm-ad-actions">' +
        '<button type="button" class="rm-edit-showroom-btn" data-id="' +
        escapeHTML(showroom.id) + '">Edit</button>' +
        '<button type="button" class="rm-delete-showroom-btn" data-id="' +
        escapeHTML(showroom.id) + '">Delete</button></div>'
      : "";

    return '<article class="rm-showroom-card" data-showroom-id="' +
      escapeHTML(showroom.id) + '">' +
      '<div class="rm-showroom-content"><h3>' +
        escapeHTML(showroom.name || "Business") + '</h3>' +
        '<p><strong>Business ID:</strong> ' + escapeHTML(showroom.id) + '</p>' +
        '<p><strong>Seller:</strong> ' +
          escapeHTML(showroom.ownerName || showroom.sellerName || "Business") + '</p>' +
        '<p><strong>Seller ID:</strong> ' +
          escapeHTML(showroom.ownerId || showroom.sellerId || "Not available") + '</p></div>' +
      '<div class="rm-showroom-media">' + image + video + '</div>' +
      '<div class="rm-showroom-content">' +
        '<p><strong>Category:</strong> ' + escapeHTML(showroom.category || "") + '</p>' +
        '<p><strong>Country:</strong> ' + escapeHTML(showroom.country || "") + '</p>' +
        '<p><strong>State:</strong> ' + escapeHTML(showroom.state || "") + '</p>' +
        '<p><strong>City:</strong> ' + escapeHTML(city) + '</p>' +
        '<p><strong>Reach:</strong> ' + escapeHTML(showroom.reach || "Local") + '</p>' +
        '<p>' + escapeHTML(showroom.description || "") + '</p></div>' +
      '<div class="rm-showroom-direct">' + directLink + '</div>' +
      '<div class="rm-showroom-engagement">' +
        '<button type="button" class="rm-showroom-like-btn" data-id="' +
          escapeHTML(showroom.id) + '">👍 Like ' + engagement.likes.length + '</button>' +
        '<button type="button" class="rm-showroom-dislike-btn" data-id="' +
          escapeHTML(showroom.id) + '">👎 Dislike ' + engagement.dislikes.length + '</button>' +
        '<div class="rm-showroom-stats"><span>👁 Views: ' + engagement.views +
        '</span><span>🌍 Countries: ' + escapeHTML(reach.countries) +
        '</span><span>👥 Country views: ' + escapeHTML(reach.views) + '</span></div>' +
        (isOwner
          ? '<p class="rm-owner-note">This is your advertisement.</p>'
          : '<button type="button" class="rm-message-business-btn" data-id="' +
            escapeHTML(showroom.id) + '">Message Business</button>') +
      '</div>' +
      '<div class="rm-showroom-content"><p><strong>Advertisement price:</strong> $10 USD (planned)</p>' +
        '<p><strong>Payment status:</strong> ' +
          escapeHTML(showroom.paymentStatus || "unpaid") + '</p>' +
        '<small>No payment is processed by this page.</small></div>' +
      ownerControls + '</article>';
  }

  function renderShowrooms() {
    const container = byId("rmShowrooms");
    if (!container) return;

    if (!isLoggedIn()) {
      container.innerHTML =
        '<div class="rm-empty">Log in to browse business advertisements.</div>';
      return;
    }

    const showrooms = getShowrooms();
    const section = byId("rmShowroomsSection");

    if (section) {
      const heading = section.querySelector("h2");
      if (heading) heading.textContent = "🏢 All Businesses / Showrooms";
    }

    if (!showrooms.length) {
      container.innerHTML =
        '<div class="rm-empty">No business advertisements have been published yet.</div>';
      return;
    }

    container.innerHTML = showrooms.map(renderShowroomCard).join("");
  }

  function playNotificationTone() {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;

      const context = new Audio();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.22);
      oscillator.onended = () => context.close();
    } catch (_) {}
  }

  async function openBusinessMessage(showroomId) {
    if (!requireLoginForAction()) return;

    const showroom = getShowrooms().find(item => item.id === showroomId);
    if (!showroom) return alert("Business advertisement not found.");

    const account = getCurrentAccount();
    const ownerId = String(showroom.ownerId || showroom.sellerId || "");

    if (ownerId === String(account.id)) {
      return alert("This is your own business advertisement.");
    }

    alert(
      "The current Marketplace Worker supports shared messages for item, property and vehicle listings. Its message endpoint does not yet support showroom conversations."
    );
  }

  function renderBusinessMessages() {
    const container = byId("rmBusinessMessages");
    if (!container) return;

    const account = getCurrentAccount();

    if (!account) {
      container.innerHTML =
        '<div class="rm-empty">Log in to view your messages.</div>';
      return;
    }

    const messages = getMessages().filter(message =>
      String(message.fromId) === String(account.id) ||
      String(message.toId) === String(account.id)
    );

    if (!messages.length) {
      container.innerHTML =
        '<div class="rm-empty">No messages yet. Messages from other signed-in Marketplace users will appear here.</div>';
      return;
    }

    container.innerHTML = messages.map(message => {
      const outgoing = String(message.fromId) === String(account.id);

      return '<article class="rm-business-message">' +
        '<p><strong>' + (outgoing ? "Sent message" : "Received message") + '</strong></p>' +
        '<p><strong>Listing:</strong> ' + escapeHTML(message.listingTitle || "") + '</p>' +
        '<p>' + escapeHTML(message.text || "") + '</p>' +
        '<small>' + escapeHTML(message.createdAt || "") + '</small>' +
        '</article>';
    }).join("");
  }

  function ensureMessagesUI() {
    if (byId("rmBusinessMessages")) return;

    const section = byId("rmShowroomsSection") || byId("rmProfileSection");
    if (!section) return;

    const wrapper = document.createElement("section");
    wrapper.id = "rmMessagesSection";
    wrapper.className = "rm-section";
    wrapper.innerHTML =
      '<h2>✉️ Inbox & Sent Messages</h2>' +
      '<p class="rm-note">Messages are loaded from the shared Marketplace API.</p>' +
      '<div id="rmBusinessMessages"><div class="rm-empty">Log in to view messages.</div></div>';

    section.insertAdjacentElement("afterend", wrapper);
  }

  function moveDiscoveryAboveResponsibility() {
    const discovery = document.querySelector(".rm-discovery-section");
    if (!discovery) return;

    const responsibility =
      document.querySelector(".rm-page .rm-responsibility") ||
      document.querySelector(".rm-page [id*='Responsibility']") ||
      document.querySelector(".rm-page [id*='responsibility']");

    if (responsibility && responsibility.parentNode) {
      responsibility.parentNode.insertBefore(discovery, responsibility);
    }
  }

  function addDynamicStyles() {
    if (byId("alonRegularMarketplaceV261Style")) return;

    const style = document.createElement("style");
    style.id = "alonRegularMarketplaceV261Style";
    style.textContent = `
      .rm-list-grid,.rm-listings-grid{
        display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
        gap:16px;align-items:start
      }
      .rm-listing-card,.rm-showroom-card{
        min-width:0;overflow-wrap:anywhere;border:1px solid #dedede;
        border-radius:12px;padding:14px;background:#fff;color:#171717;
        box-shadow:0 2px 8px rgba(0,0,0,.05)
      }
      .rm-listing-card img,.rm-showroom-card img{
        max-width:100%;height:auto
      }
      .rm-listing-content p,.rm-showroom-content p{overflow-wrap:anywhere}
      .rm-showroom-direct{margin:12px 0}
      .rm-business-direct-link{
        display:inline-block;padding:10px 16px;border-radius:8px;
        text-decoration:none;font-weight:700;border:1px solid #d7b35a;color:inherit
      }
      .rm-showroom-engagement{
        display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:14px 0
      }
      .rm-showroom-engagement button{cursor:pointer}
      .rm-showroom-stats{
        display:flex;flex-wrap:wrap;gap:10px;width:100%;margin-top:6px
      }
      .rm-business-message{
        border:1px solid #d7b35a;border-radius:8px;padding:12px;margin:8px 0
      }
      .rm-showroom-no-image{
        min-height:180px;display:flex;align-items:center;justify-content:center;
        border:1px dashed #d7b35a
      }
      .rm-message-seller-btn,.rm-message-business-btn{
        border:1px solid #b58d28;border-radius:8px;padding:10px 14px;
        background:#d7b35a;color:#111;font-weight:700;cursor:pointer;margin:8px 0
      }
      .rm-listing-stats{font-size:13px;color:#555}
      .rm-discovery-section{margin-top:20px}
      .rm-ad-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      .rm-ad-actions button{cursor:pointer}
      .rm-empty{padding:14px;border:1px dashed #bbb;border-radius:8px}
      @media(max-width:600px){
        .rm-list-grid,.rm-listings-grid{grid-template-columns:1fr}
        .rm-showroom-engagement{flex-direction:column;align-items:stretch}
        .rm-showroom-engagement button{width:100%}
        .rm-showroom-stats{flex-direction:column}
      }
    `;

    document.head.appendChild(style);
  }

  function bindTypeEvents() {
    document.querySelectorAll('input[name="rmTypeChoice"]').forEach(radio => {
      radio.addEventListener("change", () => {
        const select = byId("rmListingType");
        if (select) select.value = radio.value;
        populateListingCategories(radio.value);
      });
    });
  }

  function bindDynamicEvents() {
    const listings = byId("rmListings");

    if (listings) {
      listings.addEventListener("click", event => {
        const edit = event.target.closest(".rm-edit-ad-btn");
        if (edit) return editListing(edit.dataset.id);

        const remove = event.target.closest(".rm-delete-ad-btn");
        if (remove) deleteListing(remove.dataset.id);
      });
    }

    const browse = byId("rmMarketplaceListings");

    if (browse) {
      browse.addEventListener("click", event => {
        const edit = event.target.closest(".rm-edit-ad-btn");
        if (edit) return editListing(edit.dataset.id);

        const remove = event.target.closest(".rm-delete-ad-btn");
        if (remove) return deleteListing(remove.dataset.id);

        const message = event.target.closest(".rm-message-seller-btn");
        if (message) openListingMessage(message.dataset.id);
      });
    }

    const showrooms = byId("rmShowrooms");

    if (showrooms) {
      showrooms.addEventListener("click", event => {
        const edit = event.target.closest(".rm-edit-showroom-btn");
        if (edit) return editShowroom(edit.dataset.id);

        const remove = event.target.closest(".rm-delete-showroom-btn");
        if (remove) return deleteShowroom(remove.dataset.id);

        const like = event.target.closest(".rm-showroom-like-btn");
        if (like) return toggleReaction(like.dataset.id, "like");

        const dislike = event.target.closest(".rm-showroom-dislike-btn");
        if (dislike) return toggleReaction(dislike.dataset.id, "dislike");

        const message = event.target.closest(".rm-message-business-btn");
        if (message) openBusinessMessage(message.dataset.id);
      });
    }
  }

  function bindEvents() {
    const loginForm = byId("rmLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", event => {
        event.preventDefault();
        loginUser();
      });
    }

    const logout = byId("rmLogoutBtn");
    if (logout) logout.addEventListener("click", logoutUser);

    const listingForm = byId("rmListingForm");
    if (listingForm) listingForm.addEventListener("submit", saveListing);

    const showroomForm = byId("rmShowroomForm");
    if (showroomForm) showroomForm.addEventListener("submit", saveShowroom);

    const cancel = byId("rmCancelEditBtn");
    if (cancel) cancel.addEventListener("click", resetListingForm);

    const resetListing = byId("rmResetBtn");
    if (resetListing) resetListing.addEventListener("click", resetListingForm);

    const resetShowroom = byId("rmShowroomResetBtn");
    if (resetShowroom) resetShowroom.addEventListener("click", resetShowroomForm);

    const updateListing = byId("rmUpdateBtn");
    if (updateListing) updateListing.addEventListener("click", saveListing);

    const updateShowroom = byId("rmShowroomUpdateBtn");
    if (updateShowroom) updateShowroom.addEventListener("click", saveShowroom);

    const typeSelect = byId("rmListingType");
    if (typeSelect) {
      typeSelect.addEventListener("change", () => {
        const radio = document.querySelector(
          'input[name="rmTypeChoice"][value="' +
          CSS.escape(typeSelect.value) + '"]'
        );

        if (radio) radio.checked = true;
        populateListingCategories(typeSelect.value);
      });
    }

    bindTypeEvents();
    bindDynamicEvents();
  }

  function startCountryRetry() {
    let attempts = 0;

    function tryPopulate() {
      attempts++;

      if (getCountryDatabase().length) {
        populateAllCountries();
        return;
      }

      if (attempts < 20) {
        window.setTimeout(tryPopulate, 300);
      }
    }

    tryPopulate();
  }

  async function init() {
    console.log(
      "ALON HISTORYVERSE 24 Regular Marketplace " +
      CONFIG.version + " initializing."
    );

    addDynamicStyles();
    ensurePasswordLoginUI();
    ensureShowroomDirectLinkUI();
    hideOldLocationFields();
    moveDiscoveryAboveResponsibility();
    ensureMarketplaceBrowseUI();
    ensureMessagesUI();

    populateListingCategories("item");
    populateConditionOptions();
    startCountryRetry();
    bindEvents();
    updateLoginUI();

    if (await verifyApiSession()) {
      updateLoginUI();
      await refreshRemoteData();
    } else {
      renderListings();
      renderMarketplaceListings();
      renderShowrooms();
      renderBusinessMessages();
    }
  }

  window.ALON_REGULAR_MARKETPLACE = {
    version: CONFIG.version,
    login: loginUser,
    logout: logoutUser,
    refresh: refreshRemoteData,
    saveListing,
    editListing,
    deleteListing,
    saveShowroom,
    editShowroom,
    deleteShowroom,
    renderListings,
    renderMarketplaceListings,
    renderShowrooms,
    renderBusinessMessages,
    populateCountries: populateAllCountries,
    likeShowroom: id => toggleReaction(id, "like"),
    dislikeShowroom: id => toggleReaction(id, "dislike"),
    messageBusiness: openBusinessMessage,
    messageSeller: openListingMessage
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
