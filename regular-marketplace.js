/*
============================================================
 ALON HISTORYVERSE 24
 REGULAR MARKETPLACE
 File: regular-marketplace.js
 Version: 25.2 SELLER DISCOVERY + ACCOUNT LOGIN FIX
 Creator: Baba Thecno Guru

 Existing HTML IDs and v25 storage keys are preserved.
 This browser-only build stores data in localStorage. For messages,
 listings, and analytics to sync between different devices/users, a
 shared backend/API is required; this file does not pretend otherwise.
============================================================
*/
(function () {
  "use strict";

  const CONFIG = {
    version: "25.2 SELLER DISCOVERY + ACCOUNT LOGIN FIX",
    currency: "USD",
    showroomPrice: 10,
    maxImageBytes: 8 * 1024 * 1024,
    maxVideoBytes: 40 * 1024 * 1024,
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
    item: ["Electronics", "Home & Kitchen", "Clothing & Fashion", "Books & Education", "Furniture", "Tools & Equipment", "Agriculture", "Sports & Fitness", "Toys & Games", "Other Items"],
    property: ["House", "Apartment / Flat", "Land / Plot", "Commercial Property", "Office", "Shop", "Warehouse", "Farm", "Other Property"],
    vehicle: ["Car", "Motorcycle / Bike", "Scooter", "Truck", "Bus", "Van", "Bicycle", "Tractor", "Construction Vehicle", "Other Vehicle"]
  };
  const CONDITION_DATA = ["New", "Used", "Refurbished", "For Parts", "Not Applicable"];
  let authMode = "login";

  const byId = id => document.getElementById(id);
  const safeText = value => String(value == null ? "" : value);
  const escapeHTML = value => safeText(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const generateId = prefix => `${prefix || "id"}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  const nowISO = () => new Date().toISOString();
  const normalizeEmail = value => safeText(value).trim().toLowerCase();

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      console.warn("Regular Marketplace: could not read storage", key, error);
      return fallback;
    }
  }
  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Regular Marketplace: storage save failed", key, error);
      alert("Save failed. Your browser storage may be full. Try a smaller image/video or remove unused browser data.");
      return false;
    }
  }
  function removeStorage(key) {
    try { localStorage.removeItem(key); return true; } catch (_) { return false; }
  }

  async function hashPassword(password) {
    const value = safeText(password);
    try {
      if (window.crypto && crypto.subtle && window.TextEncoder) {
        const bytes = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (error) { console.warn("Password hashing fallback used.", error); }
    // Compatibility fallback only; SHA-256 is preferred when Web Crypto is available.
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) { hash ^= value.charCodeAt(i); hash = Math.imul(hash, 16777619); }
    return "fallback_" + (hash >>> 0).toString(16);
  }
  function validPassword(password) { return safeText(password).length >= 6; }
  function getAccounts() { const v = readJSON(CONFIG.accountsKey, []); return Array.isArray(v) ? v : []; }
  function saveAccounts(v) { return writeJSON(CONFIG.accountsKey, v); }
  function getSession() { return readJSON(CONFIG.sessionKey, null); }
  function saveSession(v) { return writeJSON(CONFIG.sessionKey, v); }
  function clearSession() { removeStorage(CONFIG.sessionKey); }
  function getCurrentAccount() {
    const session = getSession();
    if (!session || !session.email) return null;
    return getAccounts().find(a => normalizeEmail(a.email) === normalizeEmail(session.email)) || null;
  }
  function isLoggedIn() { return !!getCurrentAccount(); }

  function setElementHidden(element, hidden) {
    if (!element) return;
    element.hidden = !!hidden;
    if (element.classList && (element.classList.contains("rm-hidden") || hidden)) {
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
  const setLoginStatus = (m, e) => setStatus("rmLoginStatus", m, e);
  const setListingStatus = (m, e) => setStatus("rmListingStatus", m, e);
  const setShowroomStatus = (m, e) => setStatus("rmShowroomStatus", m, e);

  function ensurePasswordLoginUI() {
    const form = byId("rmLoginForm");
    if (!form) return;
    const email = byId("rmLoginEmail");
    if (email) { email.type = "email"; email.required = true; email.autocomplete = "email"; }

    let password = byId("rmLoginPassword") || form.querySelector("input[name='password'], input[type='password']");
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
      password.minLength = 6;
      password.required = true;
      password.placeholder = "At least 6 characters";
      wrap.append(label, password);
      const agreement = byId("rmAgreement");
      const agreementWrap = agreement && (agreement.closest("label") || agreement.parentElement);
      if (agreementWrap && agreementWrap.parentNode === form) form.insertBefore(wrap, agreementWrap);
      else form.appendChild(wrap);
    } else {
      password.id = password.id || "rmLoginPassword";
      password.required = true;
      password.minLength = 6;
    }

    const name = byId("rmLoginName");
    if (name) {
      const nameLabel = form.querySelector("label[for='rmLoginName']");
      setElementHidden(nameLabel, authMode !== "register");
      setElementHidden(name, authMode !== "register");
      name.required = authMode === "register";
      name.autocomplete = "name";
    }
    password.autocomplete = authMode === "register" ? "new-password" : "current-password";

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
        if (submit) submit.textContent = authMode === "register" ? "Create Account" : "Login";
        setLoginStatus(authMode === "register" ? "Create a new local marketplace account using your name, email and password." : "Enter the email and password of your existing account.");
      });
    }
    modeButton.textContent = authMode === "register" ? "Already have an account? Login" : "New user? Create Account";
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.textContent = authMode === "register" ? "Create Account" : "Login";
  }

  function updateLoginUI() {
    const account = getCurrentAccount();
    const loginForm = byId("rmLoginForm");
    const profile = byId("rmProfileSection");
    setElementHidden(loginForm, !!account);
    setElementHidden(profile, !account);
    if (byId("rmProfileName")) byId("rmProfileName").textContent = account ? account.name : "";
    if (byId("rmProfileEmail")) byId("rmProfileEmail").textContent = account ? account.email : "";
    let profileId = byId("rmProfileUserId");
    if (!profileId && byId("rmProfileEmail")) {
      profileId = document.createElement("p");
      profileId.id = "rmProfileUserId";
      byId("rmProfileEmail").insertAdjacentElement("afterend", profileId);
    }
    if (profileId) profileId.innerHTML = "<strong>User ID:</strong> " + escapeHTML(account ? account.id : "Not logged in");
    document.querySelectorAll("[data-rm-current-user-id]").forEach(el => { el.textContent = account ? account.id : "Not logged in"; });
    renderListings(); renderMarketplaceListings(); renderShowrooms(); renderBusinessMessages();
  }

  async function loginUser() {
    const email = normalizeEmail(byId("rmLoginEmail") && byId("rmLoginEmail").value);
    const passwordInput = byId("rmLoginPassword") || (byId("rmLoginForm") && byId("rmLoginForm").querySelector("input[type='password']"));
    const password = passwordInput ? passwordInput.value : "";
    const agreement = byId("rmAgreement");
    const enteredName = safeText(byId("rmLoginName") && byId("rmLoginName").value).trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setLoginStatus("Enter a valid email address.", true);
    if (agreement && !agreement.checked) return setLoginStatus("Please accept the Terms & Conditions before continuing.", true);
    if (!validPassword(password)) return setLoginStatus("Password must be at least 6 characters.", true);

    const accounts = getAccounts();
    let account = accounts.find(a => normalizeEmail(a.email) === email);
    const passwordHash = await hashPassword(password);

    if (authMode === "register") {
      if (!enteredName) return setLoginStatus("Enter your name to create an account.", true);
      if (account) return setLoginStatus("An account with this email already exists. Switch to Login.", true);
      account = { id: generateId("buyer"), name: enteredName, email, passwordHash, acceptedTermsAt: nowISO(), createdAt: nowISO() };
      accounts.push(account);
      if (!saveAccounts(accounts)) return setLoginStatus("Account could not be saved. Check browser storage.", true);
    } else {
      if (!account) return setLoginStatus("No account found for this email in this browser. Choose Create Account first, or use the device where your account was created.", true);
      if (account.passwordHash) {
        if (account.passwordHash !== passwordHash) return setLoginStatus("Incorrect password. Please try again.", true);
      } else if (account.password) {
        if (account.password !== password) return setLoginStatus("Incorrect password. Please try again.", true);
        account.passwordHash = passwordHash;
        delete account.password;
        if (!saveAccounts(accounts)) return setLoginStatus("Could not update the account. Try again.", true);
      } else {
        return setLoginStatus("This older local account has no verifiable password. For safety, it cannot be claimed through Login. Connect the shared account backend or use a verified registration flow.", true);
      }
    }

    if (!saveSession({ email, loggedInAt: nowISO() })) return setLoginStatus("Login session could not be saved.", true);
    setLoginStatus((authMode === "register" ? "Account created and logged in. Your buyer/seller ID is " : "Login successful. Your buyer/seller ID is ") + account.id + ".");
    authMode = "login";
    ensurePasswordLoginUI();
    updateLoginUI();
  }

  function logoutUser() {
    clearSession();
    const form = byId("rmLoginForm"); if (form) form.reset();
    updateLoginUI(); setLoginStatus("You have been logged out.");
  }
  function requireLoginForAction() {
    if (isLoggedIn()) return true;
    setLoginStatus("Please login with your email and password to continue.", true);
    const form = byId("rmLoginForm"); if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
    const email = byId("rmLoginEmail"); if (email) email.focus({ preventScroll: true });
    return false;
  }

  function getCountryDatabase() {    if (Array.isArray(db)) return db;
    if (db && Array.isArray(db.countries)) return db.countries;
    if (db && typeof db === "object") return Object.values(db);
    return [];
  }
  function countryValue(item) {
    if (typeof item === "string") return item;
    return safeText(item && (item.name || item.country || item.label || item.value || item.commonName));
  }
  function countryLabel(item) {
    if (typeof item === "string") return item;
    const name = countryValue(item); const flag = safeText(item && (item.flag || item.emoji));
    const code = safeText(item && (item.iso2 || item.code || item.isoCode));
    const dial = safeText(item && (item.dialCode || item.callingCode || item.phone));
    return [flag, name, code, dial].filter(Boolean).join(" ");
  }
  function countryOptionValue(item) { return countryValue(item); }
  function populateCountrySelect(select) {
    if (!select) return;
    const previous = select.value;
    const countries = getCountryDatabase().map(countryValue).filter(Boolean).sort((a,b) => a.localeCompare(b));
    if (!countries.length) return;
    const placeholder = select.querySelector("option[value='']");
    select.innerHTML = "";
    const first = document.createElement("option"); first.value = ""; first.textContent = "Select country"; select.appendChild(first);
    countries.forEach(name => { const option = document.createElement("option"); option.value = name; option.textContent = name; select.appendChild(option); });
    if (countries.includes(previous)) select.value = previous;
    else if (placeholder && placeholder.selected) select.value = "";
  }
  function populateAllCountries() {
    ["rmCountry", "rmShowroomCountry"].forEach(id => populateCountrySelect(byId(id)));
  }
  function hideOldLocationFields() {
    ["rmPin", "rmShowroomPin"].forEach(id => { const input = byId(id); if (input) { const parent = input.closest(".rm-field") || input.parentElement; if (parent) parent.hidden = true; input.required = false; } });
    const taluka = byId("rmShowroomTaluka"); if (taluka) { const parent = taluka.closest(".rm-field") || taluka.parentElement; if (parent) parent.hidden = true; taluka.required = false; }
    const district = byId("rmDistrict"); if (district) { const label = document.querySelector("label[for='rmDistrict']"); if (label) label.textContent = "City"; district.placeholder = "City"; }
    const showroomDistrict = byId("rmShowroomDistrict"); if (showroomDistrict) { const label = document.querySelector("label[for='rmShowroomDistrict']"); if (label) label.textContent = "City"; showroomDistrict.placeholder = "City"; }
  }
  const getCity = (id, fallbackId) => safeText(byId(id) && byId(id).value || (fallbackId && byId(fallbackId) && byId(fallbackId).value)).trim();
  function setCity(id, value) { if (byId(id)) byId(id).value = value || ""; }

  function getSelectedType() {
    const select = byId("rmListingType");
    if (select && select.value) return select.value;
    const checked = document.querySelector("input[name='rmTypeChoice']:checked");
    return checked ? checked.value : "item";
  }
  function populateListingCategories(type) {
    const select = byId("rmListingCategory"); if (!select) return;
    const current = select.value; const categories = CATEGORY_DATA[type] || CATEGORY_DATA.item;
    select.innerHTML = "";
    const placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = "Select category"; select.appendChild(placeholder);
    categories.forEach(category => { const option = document.createElement("option"); option.value = category; option.textContent = category; select.appendChild(option); });
    if (categories.includes(current)) select.value = current;
  }
  function populateConditionOptions() {
    const select = byId("rmListingCondition"); if (!select) return;
    const current = select.value; select.innerHTML = "";
    CONDITION_DATA.forEach(condition => { const o = document.createElement("option"); o.value = condition; o.textContent = condition; select.appendChild(o); });
    if (CONDITION_DATA.includes(current)) select.value = current;
  }
  function syncTypeChoice(type) {
    const select = byId("rmListingType"); if (select) select.value = type;
    const radio = document.querySelector("input[name='rmTypeChoice'][value='" + CSS.escape(type) + "']"); if (radio) radio.checked = true;
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
  function getListings() { const v = readJSON(CONFIG.listingsKey, []); return Array.isArray(v) ? v : []; }
  function saveListings(v) { return writeJSON(CONFIG.listingsKey, v); }
  function getMyListings() { const account = getCurrentAccount(); return account ? getListings().filter(x => normalizeEmail(x.ownerEmail) === normalizeEmail(account.email)) : []; }
  function resetListingForm() {
    const form = byId("rmListingForm"); if (form) form.reset();
    if (byId("rmListingId")) byId("rmListingId").value = "";
    setElementHidden(byId("rmSaveBtn"), false);
    setElementHidden(byId("rmUpdateBtn"), true);
    setElementHidden(byId("rmCancelEditBtn"), true);
    syncTypeChoice("item"); populateConditionOptions(); setListingStatus("");
  }

  function collectListingFields(account, existing) {
    return {
      id: existing ? existing.id : generateId("listing"),
      ownerId: account.id, ownerName: account.name, ownerEmail: account.email,
      type: getSelectedType(), category: safeText(byId("rmListingCategory") && byId("rmListingCategory").value).trim(),
      title: safeText(byId("rmListingTitle") && byId("rmListingTitle").value).trim(),
      condition: safeText(byId("rmListingCondition") && byId("rmListingCondition").value).trim(),
      country: safeText(byId("rmCountry") && byId("rmCountry").value).trim(),
      state: safeText(byId("rmState") && byId("rmState").value).trim(),
      city: getCity("rmDistrict"), district: getCity("rmDistrict"),
      pin: "", price: safeText(byId("rmPrice") && byId("rmPrice").value).trim(),
      currency: safeText(byId("rmCurrency") && byId("rmCurrency").value).trim() || CONFIG.currency,
      location: safeText(byId("rmLocation") && byId("rmLocation").value).trim(),
      reach: safeText(byId("rmReach") && byId("rmReach").value).trim() || "Local",
      description: safeText(byId("rmDescription") && byId("rmDescription").value).trim(),
      image: existing ? existing.image || "" : "", video: existing ? existing.video || "" : "",
      createdAt: existing ? existing.createdAt : nowISO(), updatedAt: nowISO(),
      views: existing && Number(existing.views) || 0, status: "active"
    };
  }
  async function saveListing(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const id = safeText(byId("rmListingId") && byId("rmListingId").value).trim();
    const listings = getListings(); const existing = id ? listings.find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email)) : null;
    if (id && !existing) { setListingStatus("Listing not found or you do not own it.", true); return; }
    const listing = collectListingFields(account, existing);
    if (!listing.title) return setListingStatus("Enter an item/property/vehicle title.", true);
    if (!listing.category) return setListingStatus("Select a category.", true);
    if (!listing.country) return setListingStatus("Select a country.", true);
    if (!listing.description) return setListingStatus("Enter a description.", true);
    const imageFile = byId("rmImage") && byId("rmImage").files[0];
    const videoFile = byId("rmVideo") && byId("rmVideo").files[0];
    if (imageFile && imageFile.size > CONFIG.maxImageBytes) return setListingStatus("Image must be 8 MB or smaller.", true);
    if (videoFile && videoFile.size > CONFIG.maxVideoBytes) return setListingStatus("Video must be 40 MB or smaller.", true);
    try {
      if (imageFile) listing.image = await readFileAsDataURL(imageFile);
      if (videoFile) listing.video = await readFileAsDataURL(videoFile);
    } catch (error) { return setListingStatus(error.message || "Media could not be loaded.", true); }
    if (existing) { const index = listings.findIndex(x => x.id === existing.id); listings[index] = listing; }
    else listings.unshift(listing);
    if (!saveListings(listings)) return setListingStatus("Listing was not saved. Storage may be full.", true);
    setListingStatus(existing ? "Listing updated successfully." : "Listing saved successfully. Your seller ID is " + account.id + ".");
    resetListingForm(); renderListings(); renderMarketplaceListings();
  }
  function editListing(id) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const listing = getListings().find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email));
    if (!listing) return setListingStatus("Listing not found or you do not own it.", true);
    const values = { rmListingId: listing.id, rmListingTitle: listing.title, rmListingCondition: listing.condition, rmCountry: listing.country, rmState: listing.state, rmDistrict: listing.city || listing.district, rmPin: "", rmPrice: listing.price, rmCurrency: listing.currency, rmLocation: listing.location, rmReach: listing.reach, rmDescription: listing.description };
    syncTypeChoice(listing.type || "item");
    Object.keys(values).forEach(id2 => { const el = byId(id2); if (el) el.value = values[id2] == null ? "" : values[id2]; });
    const category = byId("rmListingCategory"); if (category) category.value = listing.category;
    setElementHidden(byId("rmSaveBtn"), true);
    setElementHidden(byId("rmUpdateBtn"), false);
    setElementHidden(byId("rmCancelEditBtn"), false);
    setListingStatus("Editing listing. Select a new image/video only if you want to replace the existing media.");
    const form = byId("rmListingForm"); if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function deleteListing(id) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const listings = getListings(); const target = listings.find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email));
    if (!target) return setListingStatus("Listing not found or you do not own it.", true);
    if (!confirm("Delete this listing permanently from this browser?")) return;
    const next = listings.filter(x => x.id !== id);
    if (!saveListings(next)) return setListingStatus("Delete failed. Browser storage could not be updated.", true);
    setListingStatus("Listing deleted successfully."); renderListings(); renderMarketplaceListings();
  }
  function mediaHTML(src, kind, alt) {
    if (!src) return "";
    if (kind === "video") return '<video controls preload="metadata" style="width:100%;max-width:100%;height:auto"><source src="' + escapeHTML(src) + '"></video>';
    return '<img loading="lazy" src="' + escapeHTML(src) + '" alt="' + escapeHTML(alt || "Listing photo") + '" style="display:block;width:100%;max-height:360px;object-fit:contain">';
  }
  function renderListingCard(listing, ownerControls) {
    const price = listing.price ? escapeHTML(listing.currency || CONFIG.currency) + " " + escapeHTML(listing.price) : "Price not specified";
    const location = [listing.city || listing.district, listing.state, listing.country].filter(Boolean).map(escapeHTML).join(", ") || "Location not specified";
    const controls = ownerControls ? '<div class="rm-ad-actions"><button type="button" class="rm-edit-ad-btn" data-id="' + escapeHTML(listing.id) + '">Edit</button><button type="button" class="rm-delete-ad-btn" data-id="' + escapeHTML(listing.id) + '">Delete</button></div>' : '';
    return '<article class="rm-listing-card" data-listing-id="' + escapeHTML(listing.id) + '">' +
      (listing.image ? '<div class="rm-listing-media">' + mediaHTML(listing.image, "image", listing.title) + '</div>' : '') +
      (listing.video ? '<div class="rm-listing-media">' + mediaHTML(listing.video, "video", listing.title) + '</div>' : '') +
      '<div class="rm-listing-content"><h3>' + escapeHTML(listing.title) + '</h3>' +
      '<p><strong>Listing ID:</strong> ' + escapeHTML(listing.id) + '</p><p><strong>Seller:</strong> ' + escapeHTML(listing.ownerName || "Seller") + '</p><p><strong>Seller ID:</strong> ' + escapeHTML(listing.ownerId || "Not available") + '</p>' +
      '<p><strong>Type:</strong> ' + escapeHTML(listing.type || "item") + '</p><p><strong>Category:</strong> ' + escapeHTML(listing.category) + '</p><p><strong>Condition:</strong> ' + escapeHTML(listing.condition || "Not specified") + '</p>' +
      '<p><strong>Price:</strong> ' + price + '</p><p><strong>Location:</strong> ' + location + '</p><p><strong>Reach:</strong> ' + escapeHTML(listing.reach || "Local") + '</p><p>' + escapeHTML(listing.description || "") + '</p></div>' +
      (ownerControls ? '<p class="rm-owner-note">This is your listing.</p>' : '<button type="button" class="rm-message-seller-btn" data-id="' + escapeHTML(listing.id) + '">Message Seller</button>') + controls + '</article>';
  }
  function renderListings() {
    const container = byId("rmListings"); if (!container) return;
    if (!isLoggedIn()) { container.innerHTML = '<div class="rm-empty">Login to view and manage your listings.</div>'; return; }
    const listings = getMyListings();
    if (!listings.length) { container.innerHTML = '<div class="rm-empty">You have no listings yet. Save an item, property or vehicle to see it here.</div>'; return; }
    container.innerHTML = listings.map(x => renderListingCard(x, true)).join("");
  }

  function ensureMarketplaceBrowseUI() {
    const sellSection = byId("rmSellSection");
    if (!sellSection || byId("rmMarketplaceListingsSection")) return;
    const section = document.createElement("section");
    section.id = "rmMarketplaceListingsSection";
    section.className = "rm-section";
    section.innerHTML = '<h2>🛍️ Marketplace Listings — All Sellers</h2><p class="rm-note">Browse active item, property and vehicle advertisements saved in this browser.</p><div id="rmMarketplaceListings" class="rm-list-grid"><div class="rm-empty">No marketplace listings yet.</div></div>';
    const listingForm = byId("rmListingForm");
    if (listingForm) listingForm.insertAdjacentElement("afterend", section);
    else sellSection.appendChild(section);
  }
  function renderMarketplaceListings() {
    const container = byId("rmMarketplaceListings");
    if (!container) return;
    if (!isLoggedIn()) {
      container.innerHTML = '<div class="rm-empty">Login or create an account to browse marketplace listings and contact sellers.</div>';
      return;
    }
    const account = getCurrentAccount();
    const listings = getListings().filter(item => item && item.status !== "deleted" && item.status !== "inactive");
    if (!listings.length) {
      container.innerHTML = '<div class="rm-empty">No active marketplace listings yet. Sellers can add items, property or vehicles using the form above.</div>';
      return;
    }
    container.innerHTML = listings.map(item => {
      const isOwner = normalizeEmail(item.ownerEmail) === normalizeEmail(account.email);
      const card = renderListingCard(item, isOwner);
      const viewData = getItemEngagement(item.id);
      return card.replace('</article>', '<p class="rm-listing-stats">👁 Views: ' + viewData.views + '</p></article>');
    }).join("");
  }

  function getShowrooms() { const v = readJSON(CONFIG.showroomsKey, []); return Array.isArray(v) ? v : []; }
  function saveShowrooms(v) { return writeJSON(CONFIG.showroomsKey, v); }
  function getMyShowrooms() { const account = getCurrentAccount(); return account ? getShowrooms().filter(x => normalizeEmail(x.ownerEmail) === normalizeEmail(account.email)) : []; }
  function getShowroomDirectLink() { const el = byId("rmShowroomDirectLink"); return el ? el.value.trim() : ""; }
  function validDirectLink(link) { if (!link) return true; try { const u = new URL(link); return ["http:", "https:"].includes(u.protocol); } catch (_) { return false; } }
  function ensureShowroomDirectLinkUI() {
    const form = byId("rmShowroomForm"); if (!form || byId("rmShowroomDirectLink")) return;
    const wrap = document.createElement("div"); wrap.className = "rm-field";
    const label = document.createElement("label"); label.htmlFor = "rmShowroomDirectLink"; label.textContent = "Business website / application / contact link (optional)";
    const input = document.createElement("input"); input.type = "url"; input.id = "rmShowroomDirectLink"; input.name = "directLink"; input.placeholder = "https://example.com"; input.autocomplete = "url";
    wrap.append(label, input);
    const desc = byId("rmShowroomDescription"); const parent = desc && (desc.closest(".rm-field") || desc.parentElement);
    if (parent && parent.parentNode === form) parent.insertAdjacentElement("afterend", wrap); else form.appendChild(wrap);
  }
  function getEngagement() { const v = readJSON(CONFIG.engagementKey, {}); return v && typeof v === "object" ? v : {}; }
  function saveEngagement(v) { return writeJSON(CONFIG.engagementKey, v); }
  function getItemEngagement(id) {
    const all = getEngagement(); const item = all[id] || {};
    return { likes: Array.isArray(item.likes) ? item.likes : [], dislikes: Array.isArray(item.dislikes) ? item.dislikes : [], views: Number(item.views) || 0, countries: item.countries && typeof item.countries === "object" ? item.countries : {}, viewed: Array.isArray(item.viewed) ? item.viewed : [] };
  }
  function saveItemEngagement(id, data) { const all = getEngagement(); all[id] = data; return saveEngagement(all); }
  function currentVisitorCountry() {
    const saved = safeText(localStorage.getItem(CONFIG.visitorCountryKey)).trim(); if (saved) return saved;
    const select = byId("rmCountry"); return select && select.value || "Unknown";
  }
  function getViewerKey() {
    const account = getCurrentAccount();
    if (account) return "user:" + normalizeEmail(account.email);
    let visitor = safeText(sessionStorage.getItem(CONFIG.visitorKey));
    if (!visitor) { visitor = generateId("visitor"); try { sessionStorage.setItem(CONFIG.visitorKey, visitor); } catch (_) {} }
    return visitor;
  }
  function addView(id) {
    const key = getViewerKey(); const data = getItemEngagement(id);
    if (data.viewed.includes(key)) return data;
    data.viewed.push(key); data.views++;
    const country = currentVisitorCountry(); data.countries[country] = (Number(data.countries[country]) || 0) + 1;
    saveItemEngagement(id, data); return data;
  }
  function toggleReaction(id, reaction) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const key = normalizeEmail(account.email); const data = getItemEngagement(id);
    const add = reaction === "like" ? data.likes : data.dislikes;
    const remove = reaction === "like" ? data.dislikes : data.likes;
    const index = add.indexOf(key);
    if (index >= 0) add.splice(index, 1); else { add.push(key); const other = remove.indexOf(key); if (other >= 0) remove.splice(other, 1); }
    if (!saveItemEngagement(id, data)) return;
    renderShowrooms();
  }
  function getCountryReachText(data) {
    const entries = Object.entries(data.countries || {}).filter(([country, count]) => country && count > 0);
    return { countries: entries.length ? entries.map(x => x[0]).join(", ") : "No country data yet", views: entries.length ? entries.map(x => x[0] + ": " + x[1]).join(" · ") : "No views yet" };
  }
  function resetShowroomForm() {
    const form = byId("rmShowroomForm"); if (form) form.reset();
    if (byId("rmShowroomId")) byId("rmShowroomId").value = "";
    setElementHidden(byId("rmShowroomSaveBtn"), false);
    setElementHidden(byId("rmShowroomUpdateBtn"), true);
    setShowroomStatus("");
  }
  function collectShowroomFields(account, existing) {
    return {
      id: existing ? existing.id : generateId("business"), ownerId: account.id, ownerName: account.name, ownerEmail: account.email,
      name: safeText(byId("rmShowroomName") && byId("rmShowroomName").value).trim(),
      country: safeText(byId("rmShowroomCountry") && byId("rmShowroomCountry").value).trim(),
      state: safeText(byId("rmShowroomState") && byId("rmShowroomState").value).trim(),
      city: getCity("rmShowroomDistrict"), district: getCity("rmShowroomDistrict"), taluka: "", pin: "",
      category: safeText(byId("rmShowroomCategory") && byId("rmShowroomCategory").value).trim(),
      reach: safeText(byId("rmShowroomReach") && byId("rmShowroomReach").value).trim() || "Local",
      description: safeText(byId("rmShowroomDescription") && byId("rmShowroomDescription").value).trim(),
      directLink: getShowroomDirectLink(), image: existing ? existing.image || "" : "", video: existing ? existing.video || "" : "",
      price: CONFIG.showroomPrice, currency: "USD", paymentStatus: existing ? existing.paymentStatus || "unpaid" : "unpaid",
      featured: existing ? !!existing.featured : false, adStatus: "active", createdAt: existing ? existing.createdAt : nowISO(), updatedAt: nowISO()
    };
  }
  async function saveShowroom(event) {
    if (event && event.preventDefault) event.preventDefault();
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const id = safeText(byId("rmShowroomId") && byId("rmShowroomId").value).trim();
    const showrooms = getShowrooms(); const existing = id ? showrooms.find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email)) : null;
    if (id && !existing) return setShowroomStatus("Business advertisement not found or you do not own it.", true);
    const showroom = collectShowroomFields(account, existing);
    if (!showroom.name) return setShowroomStatus("Enter your business / showroom name.", true);
    if (!showroom.country) return setShowroomStatus("Select a country.", true);
    if (!validDirectLink(showroom.directLink)) return setShowroomStatus("Use a valid http:// or https:// business link.", true);
    const imageFile = byId("rmShowroomImage") && byId("rmShowroomImage").files[0];
    const videoFile = byId("rmShowroomVideo") && byId("rmShowroomVideo").files[0];
    if (imageFile && imageFile.size > CONFIG.maxImageBytes) return setShowroomStatus("Business image must be 8 MB or smaller.", true);
    if (videoFile && videoFile.size > CONFIG.maxVideoBytes) return setShowroomStatus("Business video must be 40 MB or smaller.", true);
    try { if (imageFile) showroom.image = await readFileAsDataURL(imageFile); if (videoFile) showroom.video = await readFileAsDataURL(videoFile); }
    catch (error) { return setShowroomStatus(error.message || "Business media could not be loaded.", true); }
    if (existing) showrooms[showrooms.findIndex(x => x.id === existing.id)] = showroom; else showrooms.unshift(showroom);
    if (!saveShowrooms(showrooms)) return setShowroomStatus("Business advertisement was not saved. Browser storage may be full.", true);
    setShowroomStatus(existing ? "Business advertisement updated." : "Business advertisement saved. The displayed $10 USD is a planned ad price; no payment has been collected.");
    resetShowroomForm(); renderShowrooms();
  }
  function editShowroom(id) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const showroom = getShowrooms().find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email));
    if (!showroom) return setShowroomStatus("Business advertisement not found or you do not own it.", true);
    const fields = { rmShowroomId: showroom.id, rmShowroomName: showroom.name, rmShowroomCountry: showroom.country, rmShowroomState: showroom.state, rmShowroomDistrict: showroom.city || showroom.district, rmShowroomTaluka: "", rmShowroomPin: "", rmShowroomCategory: showroom.category, rmShowroomReach: showroom.reach, rmShowroomDescription: showroom.description, rmShowroomDirectLink: showroom.directLink || "" };
    Object.entries(fields).forEach(([id2, value]) => { const el = byId(id2); if (el) el.value = value == null ? "" : value; });
    setElementHidden(byId("rmShowroomSaveBtn"), true);
    setElementHidden(byId("rmShowroomUpdateBtn"), false);
    setShowroomStatus("Editing business advertisement. Select new media only to replace existing media.");
    const form = byId("rmShowroomForm"); if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function deleteShowroom(id) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const showrooms = getShowrooms(); const target = showrooms.find(x => x.id === id && normalizeEmail(x.ownerEmail) === normalizeEmail(account.email));
    if (!target) return setShowroomStatus("Business advertisement not found or you do not own it.", true);
    if (!confirm("Delete this business/showroom advertisement from this browser?")) return;
    if (!saveShowrooms(showrooms.filter(x => x.id !== id))) return setShowroomStatus("Delete failed. Browser storage could not be updated.", true);
    setShowroomStatus("Business advertisement deleted successfully."); renderShowrooms();
  }

  function renderShowroomCard(showroom) {
    const engagement = getItemEngagement(showroom.id);
    const reachData = getCountryReachText(engagement);
    const city = showroom.city || showroom.district || "";
    const image = showroom.image ? mediaHTML(showroom.image, "image", showroom.name) : '<div class="rm-showroom-no-image">Business photo not provided</div>';
    const video = showroom.video ? mediaHTML(showroom.video, "video", showroom.name) : "";
    const directLink = showroom.directLink && validDirectLink(showroom.directLink) ? '<a class="rm-business-direct-link" href="' + escapeHTML(showroom.directLink) + '" target="_blank" rel="noopener noreferrer">Apply / Contact Business</a>' : "";
    const account = getCurrentAccount(); const isOwner = account && normalizeEmail(account.email) === normalizeEmail(showroom.ownerEmail);
    const ownerControls = isOwner ? '<div class="rm-ad-actions"><button type="button" class="rm-edit-showroom-btn" data-id="' + escapeHTML(showroom.id) + '">Edit</button><button type="button" class="rm-delete-showroom-btn" data-id="' + escapeHTML(showroom.id) + '">Delete</button></div>' : "";
    return '<article class="rm-showroom-card" data-showroom-id="' + escapeHTML(showroom.id) + '">' +
      '<div class="rm-showroom-content"><h3>' + escapeHTML(showroom.name) + '</h3><p><strong>Business Profile:</strong> ' + escapeHTML(showroom.ownerName || "Business") + '</p><p><strong>Business ID:</strong> ' + escapeHTML(showroom.id) + '</p><p><strong>Seller ID:</strong> ' + escapeHTML(showroom.ownerId || "Not available") + '</p></div>' +
      '<div class="rm-showroom-media">' + image + video + '</div>' +
      '<div class="rm-showroom-content"><p><strong>Category:</strong> ' + escapeHTML(showroom.category || "Not specified") + '</p><p><strong>Country:</strong> ' + escapeHTML(showroom.country || "") + '</p><p><strong>State:</strong> ' + escapeHTML(showroom.state || "") + '</p><p><strong>City:</strong> ' + escapeHTML(city) + '</p><p><strong>Reach:</strong> ' + escapeHTML(showroom.reach || "Not specified") + '</p><p>' + escapeHTML(showroom.description || "") + '</p></div>' +
      '<div class="rm-showroom-direct">' + directLink + '</div>' +
      '<div class="rm-showroom-engagement"><button type="button" class="rm-showroom-like-btn" data-id="' + escapeHTML(showroom.id) + '">👍 Like <span>' + engagement.likes.length + '</span></button><button type="button" class="rm-showroom-dislike-btn" data-id="' + escapeHTML(showroom.id) + '">👎 Dislike <span>' + engagement.dislikes.length + '</span></button>' +
      '<div class="rm-showroom-stats"><span>👁 Views: ' + engagement.views + '</span><span>🌍 Countries: ' + escapeHTML(reachData.countries) + '</span><span>👥 Country-wise Views: ' + escapeHTML(reachData.views) + '</span></div>' +
      (isOwner ? '<span class="rm-owner-note">This is your advertisement.</span>' : '<button type="button" class="rm-message-business-btn" data-id="' + escapeHTML(showroom.id) + '">Message Business</button>') + '</div>' +
      '<div class="rm-showroom-content"><p><strong>Advertisement Price:</strong> $10 USD (planned)</p><p><strong>Payment Status:</strong> ' + escapeHTML(showroom.paymentStatus || "unpaid") + '</p><p><small>No payment is processed by this page.</small></p></div>' + ownerControls + '</article>';
  }
  function renderShowrooms() {
    const container = byId("rmShowrooms"); if (!container) return;
    if (!isLoggedIn()) { container.innerHTML = '<div class="rm-empty">Login with your email and password to see your business / showroom advertisements.</div>'; return; }
    const showrooms = getShowrooms().filter(item => item && item.adStatus !== "deleted" && item.adStatus !== "inactive");
    const section = byId("rmShowroomsSection");
    const heading = section && section.querySelector("h2");
    const note = section && section.querySelector(".rm-note");
    if (heading) heading.textContent = "🏢 All Businesses / Showrooms";
    if (note) note.textContent = "Browse business advertisements from all sellers. You can edit or delete only advertisements owned by your account.";
    const navButtons = document.querySelectorAll("#rmMarketplaceNavigation .rm-nav-btn");
    navButtons.forEach(button => { if (button.textContent.includes("My Showrooms")) button.textContent = "🏢 All Businesses"; });
    if (!showrooms.length) { container.innerHTML = '<div class="rm-empty">No business / showroom advertisements yet.</div>'; return; }
    container.innerHTML = showrooms.map(renderShowroomCard).join("");
  }

  function openListingMessage(listingId) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount();
    const listing = getListings().find(item => item.id === listingId && item.status !== "deleted" && item.status !== "inactive");
    if (!listing) return alert("This listing is no longer available.");
    if (normalizeEmail(listing.ownerEmail) === normalizeEmail(account.email)) return alert("This is your own listing.");
    const value = prompt("Message seller " + (listing.ownerName || "Seller") + " about: " + listing.title);
    if (value === null) return;
    const messageText = safeText(value).trim();
    if (!messageText) return alert("Please enter a message.");
    const messages = getMessages();
    messages.push({ id: generateId("message"), type: "listing", listingId: listing.id, listingTitle: listing.title, senderId: account.id, senderName: account.name, senderEmail: account.email, receiverId: listing.ownerId || "", receiverName: listing.ownerName || "Seller", receiverEmail: listing.ownerEmail || "", message: messageText, createdAt: nowISO(), read: false });
    if (!saveMessages(messages)) return;
    playNotificationTone();
    alert("Message saved in this browser only. The seller can see it only in this same browser/device until a shared backend/API is connected.");
    renderBusinessMessages();
  }

  function getMessages() { const v = readJSON(CONFIG.messagesKey, []); return Array.isArray(v) ? v : []; }
  function saveMessages(v) { return writeJSON(CONFIG.messagesKey, v); }
  function getBusinessConversation(showroom) {
    const account = getCurrentAccount(); if (!account) return [];
    return getMessages().filter(message => message.type === "business" && message.showroomId === showroom.id && (normalizeEmail(message.senderEmail) === normalizeEmail(account.email) || normalizeEmail(message.receiverEmail) === normalizeEmail(account.email)));
  }
  function playNotificationTone() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass(); const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.type = "sine"; oscillator.frequency.value = 880; gain.gain.setValueAtTime(0.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.24);
      oscillator.onended = () => context.close();
    } catch (error) { console.warn("Notification tone unavailable.", error); }
  }
  function openBusinessMessage(showroomId) {
    if (!requireLoginForAction()) return;
    const account = getCurrentAccount(); const showroom = getShowrooms().find(x => x.id === showroomId && x.adStatus !== "deleted" && x.adStatus !== "inactive");
    if (!showroom) return alert("This business advertisement is no longer available.");
    if (normalizeEmail(showroom.ownerEmail) === normalizeEmail(account.email)) return alert("This is your own business advertisement.");
    const text = safeText(prompt("Message " + (showroom.ownerName || showroom.name) + " about " + showroom.name + ":") || "").trim();
    if (!text) return;
    const messages = getMessages();
    messages.push({ id: generateId("message"), type: "business", showroomId: showroom.id, senderId: account.id, senderName: account.name, senderEmail: account.email, receiverId: showroom.ownerId || "", receiverName: showroom.ownerName || showroom.name, receiverEmail: showroom.ownerEmail, message: text, createdAt: nowISO(), read: false });
    if (!saveMessages(messages)) return;
    playNotificationTone();
    alert("Message saved in this browser. The business owner will only see it on this same browser/device until a shared backend is connected.");
    renderBusinessMessages();
  }
  function renderBusinessMessages() {
    const container = byId("rmBusinessMessages"); if (!container) return;
    const account = getCurrentAccount(); if (!account) { container.innerHTML = '<div class="rm-empty">Login to view your business messages.</div>'; return; }
    const messages = getMessages().filter(m => normalizeEmail(m.senderEmail) === normalizeEmail(account.email) || normalizeEmail(m.receiverEmail) === normalizeEmail(account.email)).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!messages.length) { container.innerHTML = '<div class="rm-empty">No business messages yet.</div>'; return; }
    container.innerHTML = messages.map(message => {
      const outgoing = normalizeEmail(message.senderEmail) === normalizeEmail(account.email);
      const correspondent = outgoing ? (message.receiverName || "Business") : (message.senderName || "Buyer");
      const topic = message.type === "business" ? ("Business / Showroom: " + (message.showroomId || "")) : ("Listing: " + (message.listingTitle || message.listingId || "Marketplace"));
      return '<article class="rm-business-message"><p><strong>' + (outgoing ? "Sent to: " : "From: ") + escapeHTML(correspondent) + '</strong></p><p><strong>Conversation:</strong> ' + escapeHTML(topic) + '</p><p>' + escapeHTML(message.message) + '</p><small>' + escapeHTML(message.createdAt) + '</small></article>';
    }).join("");
  }

  function ensureMessagesUI() {
    if (byId("rmBusinessMessages")) return;
    const section = byId("rmShowroomsSection") || byId("rmProfileSection");
    if (!section) return;
    const wrapper = document.createElement("section");
    wrapper.id = "rmMessagesSection";
    wrapper.className = "rm-section";
    wrapper.innerHTML = '<h2>✉️ Inbox & Sent Messages</h2><p class="rm-note">Messages are stored locally in this browser until a shared backend/API is connected.</p><div id="rmBusinessMessages"><div class="rm-empty">Login to view your messages.</div></div>';
    section.insertAdjacentElement("afterend", wrapper);
  }

  function moveDiscoveryAboveResponsibility() {
    const discovery = document.querySelector(".rm-discovery-section"); if (!discovery) return;
    const responsibility = document.querySelector(".rm-page .rm-responsibility") || document.querySelector(".rm-page [id*='Responsibility']") || document.querySelector(".rm-page [id*='responsibility']");
    if (responsibility && responsibility.parentNode) { responsibility.parentNode.insertBefore(discovery, responsibility); return; }
    const page = document.querySelector(".rm-page"); if (page && discovery.parentNode !== page) page.appendChild(discovery);
  }
  function addDynamicStyles() {
    if (byId("alonRegularMarketplaceV25Style")) return;
    const style = document.createElement("style"); style.id = "alonRegularMarketplaceV25Style";
    style.textContent = `
      .rm-list-grid,.rm-listings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}
      .rm-listing-card,.rm-showroom-card{min-width:0;overflow-wrap:anywhere;border:1px solid #dedede;border-radius:12px;padding:14px;background:#fff;color:#171717;box-shadow:0 2px 8px rgba(0,0,0,.05)}
      .rm-listing-card img,.rm-showroom-card img{max-width:100%;height:auto}.rm-listing-content p,.rm-showroom-content p{overflow-wrap:anywhere}
      .rm-showroom-direct{margin:12px 0}.rm-business-direct-link{display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700;border:1px solid #d7b35a;color:inherit}
      .rm-showroom-engagement{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:14px 0}.rm-showroom-engagement button{cursor:pointer}.rm-showroom-stats{display:flex;flex-wrap:wrap;gap:10px;width:100%;margin-top:6px}
      .rm-business-message{border:1px solid #d7b35a;border-radius:8px;padding:12px;margin:8px 0}.rm-showroom-no-image{min-height:180px;display:flex;align-items:center;justify-content:center;border:1px dashed #d7b35a}
      .rm-message-seller-btn,.rm-message-business-btn{border:1px solid #b58d28;border-radius:8px;padding:10px 14px;background:#d7b35a;color:#111;font-weight:700;cursor:pointer;margin:8px 0}.rm-listing-stats{font-size:13px;color:#555}
      .rm-discovery-section{margin-top:20px}.rm-ad-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.rm-ad-actions button{cursor:pointer}.rm-empty{padding:14px;border:1px dashed #bbb;border-radius:8px}
      @media(max-width:600px){.rm-list-grid,.rm-listings-grid{grid-template-columns:1fr}.rm-showroom-engagement{flex-direction:column;align-items:stretch}.rm-showroom-engagement button{width:100%}.rm-showroom-stats{flex-direction:column}}
    `;
    document.head.appendChild(style);
  }
  function bindTypeEvents() {
    document.querySelectorAll('input[name="rmTypeChoice"]').forEach(radio => radio.addEventListener("change", () => {
      const select = byId("rmListingType"); if (select) select.value = radio.value; populateListingCategories(radio.value);
    }));
  }
  function bindDynamicEvents() {
    const listings = byId("rmListings");
    if (listings) listings.addEventListener("click", event => {
      const edit = event.target.closest(".rm-edit-ad-btn"); if (edit) return editListing(edit.dataset.id);
      const del = event.target.closest(".rm-delete-ad-btn"); if (del) deleteListing(del.dataset.id);
    });
    const marketplaceListings = byId("rmMarketplaceListings");
    if (marketplaceListings) marketplaceListings.addEventListener("click", event => {
      const edit = event.target.closest(".rm-edit-ad-btn"); if (edit) return editListing(edit.dataset.id);
      const del = event.target.closest(".rm-delete-ad-btn"); if (del) return deleteListing(del.dataset.id);
      const message = event.target.closest(".rm-message-seller-btn"); if (message) openListingMessage(message.dataset.id);
    });
    const showrooms = byId("rmShowrooms");
    if (showrooms) showrooms.addEventListener("click", event => {
      const edit = event.target.closest(".rm-edit-showroom-btn"); if (edit) return editShowroom(edit.dataset.id);
      const del = event.target.closest(".rm-delete-showroom-btn"); if (del) return deleteShowroom(del.dataset.id);
      const like = event.target.closest(".rm-showroom-like-btn"); if (like) return toggleReaction(like.dataset.id, "like");
      const dislike = event.target.closest(".rm-showroom-dislike-btn"); if (dislike) return toggleReaction(dislike.dataset.id, "dislike");
      const message = event.target.closest(".rm-message-business-btn"); if (message) openBusinessMessage(message.dataset.id);
    });
  }
  function bindEvents() {
    const loginForm = byId("rmLoginForm"); if (loginForm) loginForm.addEventListener("submit", event => { event.preventDefault(); loginUser(); });
    const logout = byId("rmLogoutBtn"); if (logout) logout.addEventListener("click", logoutUser);
    const listingForm = byId("rmListingForm"); if (listingForm) listingForm.addEventListener("submit", saveListing);
    const showroomForm = byId("rmShowroomForm"); if (showroomForm) showroomForm.addEventListener("submit", saveShowroom);
    const cancel = byId("rmCancelEditBtn"); if (cancel) cancel.addEventListener("click", resetListingForm);
    const resetListing = byId("rmResetBtn"); if (resetListing) resetListing.addEventListener("click", resetListingForm);
    const resetShowroom = byId("rmShowroomResetBtn"); if (resetShowroom) resetShowroom.addEventListener("click", resetShowroomForm);
    const updateListing = byId("rmUpdateBtn"); if (updateListing) updateListing.addEventListener("click", saveListing);
    const updateShowroomButton = byId("rmShowroomUpdateBtn"); if (updateShowroomButton) updateShowroomButton.addEventListener("click", saveShowroom);
    const typeSelect = byId("rmListingType"); if (typeSelect) typeSelect.addEventListener("change", () => {
      const radio = document.querySelector('input[name="rmTypeChoice"][value="' + CSS.escape(typeSelect.value) + '"]'); if (radio) radio.checked = true; populateListingCategories(typeSelect.value);
    });
    bindTypeEvents(); bindDynamicEvents();
  }
  function startCountryRetry() {
    let attempts = 0; const maxAttempts = 20;
    function tryPopulate() { attempts++; if (getCountryDatabase().length) { populateAllCountries(); return; } if (attempts < maxAttempts) window.setTimeout(tryPopulate, 300); }
    tryPopulate();
  }
  function init() {
    if (window.__ALON_REGULAR_MARKETPLACE_V252_INIT__) return;
    window.__ALON_REGULAR_MARKETPLACE_V252_INIT__ = true;
    console.log("ALON HISTORYVERSE 24 Regular Marketplace " + CONFIG.version + " initialized.");
    addDynamicStyles(); ensurePasswordLoginUI(); ensureShowroomDirectLinkUI(); hideOldLocationFields(); moveDiscoveryAboveResponsibility();
    ensureMarketplaceBrowseUI(); ensureMessagesUI();
    populateListingCategories("item"); populateConditionOptions(); startCountryRetry(); bindEvents(); updateLoginUI();
    renderListings(); renderMarketplaceListings(); renderShowrooms(); renderBusinessMessages();
  }
  window.ALON_REGULAR_MARKETPLACE = {
    version: CONFIG.version, login: loginUser, logout: logoutUser, saveListing, editListing, deleteListing,
    saveShowroom, editShowroom, deleteShowroom, renderListings, renderMarketplaceListings, renderShowrooms, renderBusinessMessages,
    populateCountries: populateAllCountries,
    likeShowroom: id => toggleReaction(id, "like"), dislikeShowroom: id => toggleReaction(id, "dislike"),
    messageBusiness: openBusinessMessage, messageSeller: openListingMessage
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();