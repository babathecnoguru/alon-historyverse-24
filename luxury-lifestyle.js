
/*
============================================================
 ALON HISTORYVERSE 24
 LUXURY LIFESTYLE / BRAND PROMOTER
 File: luxury-lifestyle.js
 Version: 3.1.0
 Owner: Baba Thecno Guru

 FEATURES
 ------------------------------------------------------------
 1. Browser-based login and session with visible User ID.
 2. Logout and login screen restoration.
 3. Category folders and item-only sample photographs.
 4. Create, edit and delete your own listings.
 5. Country, state and city fields.
 6. Search, category, country, condition and price filters.
 7. Saved listings.
 8. Inbox and seller messaging.
 9. Listing details and photo galleries.
10. Terms and Privacy dialogs.
11. Local browser storage.
12. Existing HTML IDs and file paths preserved.

 SECURITY NOTE
 ------------------------------------------------------------
 Browser storage is not server authentication.
 Connect the existing Cloudflare Worker later for secure
 accounts, cross-device listings, messages and notifications.
============================================================
*/
(function () {
  "use strict";

  const VERSION = "3.1.0";
  const KEYS = {
    listings: "alon-historyverse-luxury-lifestyle-listings",
    profile: "alon-historyverse-luxury-lifestyle-profile",
    terms: "alon-historyverse-luxury-lifestyle-terms",
    messages: "alon-historyverse-luxury-lifestyle-messages",
    saved: "alon-historyverse-luxury-lifestyle-saved",
    session: "alon-historyverse-luxury-lifestyle-session",
    accounts: "alon-historyverse-luxury-lifestyle-local-accounts"
  };
  const TERMS_VERSION = "3.1";

  const $ = id => document.getElementById(id);
  const safe = value => String(value == null ? "" : value);
  const escapeHTML = value => safe(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  const uid = prefix => prefix + "-" +
    Date.now().toString(36).toUpperCase() + "-" +
    Math.random().toString(36).slice(2, 8).toUpperCase();

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch (_) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      toast("Browser storage is full or unavailable.");
      return false;
    }
  }

  function makeId(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return "ALON-" + (hash >>> 0).toString(36).toUpperCase();
  }

  function money(value, currency) {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0) return "Price on request";
    if (number === 0) return "Price on request";
    const code = currency || "USD";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
        maximumFractionDigits: 0
      }).format(number);
    } catch (_) {
      return code + " " + number.toLocaleString();
    }
  }

  function dateLabel(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Recently added"
      : date.toLocaleDateString();
  }

  function toast(message) {
    const element = $("luxToast");
    if (!element) return;
    element.textContent = message;
    element.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      element.hidden = true;
    }, 3200);
  }

  const categories = [
    { id: "private-jets", name: "Private Jets", photo: "photo-1436491865332-7a61a109cc05" },
    { id: "private-helicopters", name: "Private Helicopters", photo: "photo-1474302770737-173ee21bab63" },
    { id: "aircraft", name: "Aircraft", photo: "photo-1540962351504-03099e0a754b" },
    { id: "cars", name: "Luxury Cars", photo: "photo-1503376780353-7e6692767b70" },
    { id: "bikes", name: "Premium Bikes", photo: "photo-1558981806-ec527fa84c39" },
    { id: "trucks", name: "Luxury Trucks", photo: "photo-1519003722824-194d4455a60c" },
    { id: "watches", name: "Luxury Watches", photo: "photo-1524805444758-089113d48a6d" },
    { id: "property", name: "Luxury Property", photo: "photo-1600607687939-ce8a6c25118c" },
    { id: "bungalows", name: "Bungalows", photo: "photo-1600596542815-ffad4c1539a9" },
    { id: "flats", name: "Luxury Flats", photo: "photo-1600210492486-724fe5c67fb0" },
    { id: "hotels", name: "Luxury Hotels", photo: "photo-1566073771259-6a8506099945" },
    { id: "yachts-ships", name: "Yachts & Ships", photo: "photo-1567899378494-47b22a2ae96a" },
    { id: "machinery", name: "Premium Machinery", photo: "photo-1581092160562-40aa08e78837" },
    { id: "movies-web-series", name: "Movies & Web Series", photo: "photo-1489599849927-2ee91cede3ba" },
    { id: "podcasts", name: "Podcasts", photo: "photo-1590602847861-f357a9332bbc" },
    { id: "songs-albums", name: "Songs & Albums", photo: "photo-1511379938547-c1f69419868d" },
    { id: "sports-games", name: "Sports & Games", photo: "photo-1461896836934-ffe607ba8211" },
    { id: "tourist-places", name: "Tourist Places & Guides", photo: "photo-1511818966892-d7d671e672a2" },
    { id: "photos-videos", name: "Photos & Videos", photo: "photo-1516035069371-29a1b244cc32" },
    { id: "3d-websites", name: "3D & Websites", photo: "photo-1460925895917-afdab827c52f" }
  ];

  const categoryMap = new Map(categories.map(item => [item.id, item]));

  function imageURL(photo, width) {
    if (/^https?:\/\//i.test(safe(photo))) return safe(photo);
    if (/^[a-z0-9-]+$/i.test(safe(photo))) {
      return "https://images.unsplash.com/" + photo +
        "?auto=format&fit=crop&w=" + (width || 900) + "&q=82";
    }
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80";
  }

  function sampleListings() {
    const now = Date.now();
    return [
      {
        id: "sample-car-001",
        title: "Performance Grand Touring Coupe",
        category: "cars",
        description: "Illustrative sample vehicle. Contact the owner to confirm specifications, ownership and availability.",
        country: "United Arab Emirates",
        state: "Dubai",
        city: "Dubai",
        condition: "Pre-owned",
        listingType: "Sale",
        price: 0,
        currency: "USD",
        photos: [imageURL("photo-1503376780353-7e6692767b70")],
        sellerId: "ALON-SAMPLE",
        sellerName: "Sample Listing",
        createdAt: new Date(now - 1000).toISOString(),
        sample: true,
        views: 0
      },
      {
        id: "sample-estate-002",
        title: "Contemporary Private Estate",
        category: "property",
        description: "Illustrative property photography. This sample does not represent a verified property for sale.",
        country: "United States",
        state: "California",
        city: "Los Angeles",
        condition: "New",
        listingType: "Rent",
        price: 0,
        currency: "USD",
        photos: [imageURL("photo-1600596542815-ffad4c1539a9")],
        sellerId: "ALON-SAMPLE",
        sellerName: "Sample Listing",
        createdAt: new Date(now - 2000).toISOString(),
        sample: true,
        views: 0
      },
      {
        id: "sample-yacht-003",
        title: "Modern Motor Yacht",
        category: "yachts-ships",
        description: "Illustrative yacht photograph. Availability and specifications have not been verified.",
        country: "France",
        state: "French Riviera",
        city: "Cannes",
        condition: "Pre-owned",
        listingType: "Sale",
        price: 0,
        currency: "USD",
        photos: [imageURL("photo-1567899378494-47b22a2ae96a")],
        sellerId: "ALON-SAMPLE",
        sellerName: "Sample Listing",
        createdAt: new Date(now - 3000).toISOString(),
        sample: true,
        views: 0
      }
    ];
  }

  let listings = read(KEYS.listings, null);
  if (!Array.isArray(listings)) {
    listings = sampleListings();
    write(KEYS.listings, listings);
  }

  let messages = read(KEYS.messages, []);
  let saved = read(KEYS.saved, {});
  let session = read(KEYS.session, null);
  let currentUser = null;
  let activeCategory = "";
  let modalPreviousFocus = null;

  if (!Array.isArray(messages)) messages = [];
  if (!saved || typeof saved !== "object") saved = {};

  function persistListings() {
    return write(KEYS.listings, listings);
  }

  function persistMessages() {
    return write(KEYS.messages, messages);
  }

  function persistSaved() {
    return write(KEYS.saved, saved);
  }

  function getAccountList() {
    const result = read(KEYS.accounts, []);
    return Array.isArray(result) ? result : [];
  }

  function emailKey(email) {
    return safe(email).trim().toLowerCase();
  }

  /*
   * Browser-only demonstration authentication.
   * Replace with the existing Worker API when connecting backend.
   */
  async function passwordDigest(password) {
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      const bytes = new TextEncoder().encode(password);
      const digest = await window.crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
    }
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = Math.imul(hash ^ password.charCodeAt(i), 16777619);
    }
    return "local-" + (hash >>> 0).toString(16);
  }

  function acceptedTerms() {
    return read(KEYS.terms, {}) || {};
  }

  async function login(email, password) {
    const normalizedEmail = emailKey(email);
    const digest = await passwordDigest(password);
    const accounts = getAccountList();
    let account = accounts.find(item => item.email === normalizedEmail);

    if (account) {
      if (account.passwordDigest !== digest) {
        throw new Error("Incorrect password for this browser account.");
      }
    } else {
      account = {
        id: makeId(normalizedEmail),
        email: normalizedEmail,
        passwordDigest: digest,
        createdAt: new Date().toISOString()
      };
      accounts.push(account);
      if (!write(KEYS.accounts, accounts)) {
        throw new Error("Could not create a browser account. Check storage.");
      }
    }

    currentUser = {
      id: account.id,
      email: account.email,
      displayName: account.displayName || account.email.split("@")[0]
    };

    session = {
      userId: currentUser.id,
      email: currentUser.email,
      createdAt: new Date().toISOString()
    };

    write(KEYS.session, session);
    write(KEYS.profile, currentUser);

    const terms = acceptedTerms();
    terms[currentUser.id] = {
      version: TERMS_VERSION,
      acceptedAt: new Date().toISOString()
    };
    write(KEYS.terms, terms);
  }

  function logout(showMessage) {
    currentUser = null;
    session = null;
    localStorage.removeItem(KEYS.session);
    $("luxApp").hidden = true;
    $("luxLoginScreen").hidden = false;
    document.body.classList.add("lux-login-mode");
    $("luxLoginPassword").value = "";
    $("luxLoginTerms").checked = false;
    $("luxLoginError").textContent =
      "Sign in using the same email and password on this browser.";
    if (showMessage) toast("You have been logged out.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showApp() {
    $("luxLoginScreen").hidden = true;
    $("luxApp").hidden = false;
    document.body.classList.remove("lux-login-mode");
    $("luxYear").textContent = String(new Date().getFullYear());
    renderUserIdentity();
    renderCategories();
    populateCountryOptions();
    populateCategoryOptions();
    renderListings();
    updateCounts();
  }

  function renderUserIdentity() {
    const nav = document.querySelector(".lux-topbar-inner .lux-nav");
    if (!nav || !currentUser) return;

    let identity = $("luxUserIdentity");
    if (!identity) {
      identity = document.createElement("div");
      identity.id = "luxUserIdentity";
      identity.style.cssText =
        "display:flex;flex-direction:column;gap:3px;min-width:0;" +
        "max-width:180px;padding:5px 9px;border:1px solid rgba(215,179,90,.35);" +
        "border-radius:12px;font-size:11px;overflow-wrap:anywhere";
      const logoutButton = $("luxLogoutButton");
      nav.insertBefore(identity, logoutButton || null);
    }

    identity.innerHTML =
      '<span style="color:#f2d98c;font-weight:800">SIGNED IN</span>' +
      '<span style="color:#fff">ID: ' + escapeHTML(currentUser.id) + '</span>' +
      '<span style="color:#aaa">' + escapeHTML(currentUser.email) + '</span>';
  }

  function renderCategories() {
    const grid = $("luxCategoryGrid");
    if (!grid) return;

    grid.innerHTML = categories.map(category => {
      const count = listings.filter(item => item.category === category.id).length;
      return `
        <button class="lux-cat" type="button"
          data-lux-category="${escapeHTML(category.id)}"
          aria-label="Browse ${escapeHTML(category.name)}">
          <img src="${escapeHTML(imageURL(category.photo, 600))}"
            alt="${escapeHTML(category.name)}" loading="lazy">
          <span>${escapeHTML(category.name)}
            <small>${count} listing${count === 1 ? "" : "s"}</small>
          </span>
        </button>`;
    }).join("");
  }

  function populateCategoryOptions() {
    const select = $("luxFilterCategory");
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">All collections</option>' +
      categories.map(category =>
        `<option value="${escapeHTML(category.id)}">${escapeHTML(category.name)}</option>`
      ).join("");
    if (categoryMap.has(current)) select.value = current;
  }

  function availableCountries() {
    const set = new Set();
    listings.forEach(item => {
      if (item.country) set.add(item.country);
    });

    /*
     * marketplace-countries.js may expose different schemas.
     * Listing countries remain available even if its schema differs.
     */
    const source = window.MARKETPLACE_COUNTRIES ||
      window.marketplaceCountries ||
      window.ALON_MARKETPLACE_COUNTRIES;

    if (Array.isArray(source)) {
      source.forEach(item => {
        if (typeof item === "string") set.add(item);
        else if (item && (item.name || item.country)) {
          set.add(item.name || item.country);
        }
      });
    }

    return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  function populateCountryOptions() {
    const select = $("luxFilterCountry");
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">All countries</option>' +
      availableCountries().map(country =>
        `<option value="${escapeHTML(country)}">${escapeHTML(country)}</option>`
      ).join("");
    if (availableCountries().includes(current)) select.value = current;
  }

  function filteredListings() {
    const query = safe($("luxSearch").value).trim().toLowerCase();
    const category = $("luxFilterCategory").value || activeCategory;
    const country = $("luxFilterCountry").value;
    const condition = $("luxFilterCondition").value;
    const minValue = $("luxMinPrice").value;
    const maxValue = $("luxMaxPrice").value;
    const min = minValue === "" ? null : Number(minValue);
    const max = maxValue === "" ? null : Number(maxValue);
    const sort = $("luxSort").value;

    let result = listings.filter(item => {
      const searchable = [
        item.title, item.description, item.country, item.state,
        item.city, item.sellerName, item.category, item.listingType
      ].join(" ").toLowerCase();

      if (query && !searchable.includes(query)) return false;
      if (category && item.category !== category) return false;
      if (country && item.country !== country) return false;
      if (condition && item.condition !== condition) return false;
      if (min !== null && Number(item.price || 0) < min) return false;
      if (max !== null && Number(item.price || 0) > max) return false;
      return true;
    });

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sort === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sort === "title") {
      result.sort((a, b) => safe(a.title).localeCompare(safe(b.title)));
    } else {
      result.sort((a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }
    return result;
  }

  function listingCard(item) {
    const category = categoryMap.get(item.category);
    const categoryName = category ? category.name : item.category;
    const photo = item.photos && item.photos.length
      ? item.photos[0]
      : imageURL(category ? category.photo : "photo-1503376780353-7e6692767b70");

    const isSaved = Array.isArray(saved[currentUser.id]) &&
      saved[currentUser.id].includes(item.id);

    const own = item.sellerId === currentUser.id;
    const sampleLabel = item.sample
      ? '<span class="lux-chip" style="top:auto;bottom:12px">Illustrative sample</span>'
      : "";

    return `
      <article class="lux-card" data-lux-listing="${escapeHTML(item.id)}">
        <div class="lux-card-media">
          <img src="${escapeHTML(photo)}" alt="${escapeHTML(item.title)}"
            loading="lazy" onerror="this.onerror=null;this.src='${escapeHTML(imageURL("photo-1503376780353-7e6692767b70"))}'">
          <span class="lux-chip">${escapeHTML(item.listingType || "Sale")}</span>
          ${sampleLabel}
          <button class="lux-save" type="button"
            data-lux-action="save" data-id="${escapeHTML(item.id)}"
            aria-label="${isSaved ? "Remove saved listing" : "Save listing"}"
            title="${isSaved ? "Remove from saved" : "Save listing"}">
            ${isSaved ? "♥" : "♡"}
          </button>
        </div>
        <div class="lux-card-body">
          <div class="lux-card-category">${escapeHTML(categoryName)}</div>
          <h3>${escapeHTML(item.title)}</h3>
          <div class="lux-card-desc">${escapeHTML(item.description || "Contact the seller for further details.")}</div>
          <div class="lux-card-meta">
            <span>${escapeHTML([item.city, item.country].filter(Boolean).join(", ") || "Location not provided")}</span>
            <span>${escapeHTML(item.condition || "Not specified")}</span>
          </div>
          <div class="lux-price">${escapeHTML(money(item.price, item.currency))}</div>
          <div class="lux-card-actions">
            <button class="lux-btn lux-btn-gold" type="button"
              data-lux-action="details" data-id="${escapeHTML(item.id)}">View details</button>
            <button class="lux-btn" type="button"
              data-lux-action="message" data-id="${escapeHTML(item.id)}">
              ${own ? "Messages" : "Contact"}
            </button>
            ${own && !item.sample ? `
              <button class="lux-btn" type="button" data-lux-action="edit"
                data-id="${escapeHTML(item.id)}">Edit</button>
              <button class="lux-btn" type="button" data-lux-action="delete"
                data-id="${escapeHTML(item.id)}">Delete</button>
            ` : ""}
          </div>
        </div>
      </article>`;
  }

  function renderListings() {
    const grid = $("luxListingsGrid");
    if (!grid || !currentUser) return;

    const result = filteredListings();
    $("luxResultsCount").textContent =
      result.length + " listing" + (result.length === 1 ? "" : "s");

    if (!result.length) {
      grid.innerHTML = `
        <div class="lux-empty">
          <h3>No matching listings</h3>
          <p>Try changing the filters or create a new listing.</p>
          <button class="lux-btn lux-btn-gold" type="button"
            data-lux-action="add">List an item</button>
        </div>`;
    } else {
      grid.innerHTML = result.map(listingCard).join("");
    }
    updateCounts();
  }

  function updateCounts() {
    if (!currentUser) return;
    const userSaved = Array.isArray(saved[currentUser.id])
      ? saved[currentUser.id] : [];
    $("luxSavedCount").textContent = String(userSaved.length);

    const unread = messages.filter(message =>
      message.toId === currentUser.id && !message.read
    ).length;
    $("luxInboxCount").textContent = String(unread);
  }

  function openModal(title, content, kicker) {
    modalPreviousFocus = document.activeElement;
    $("luxModalTitle").textContent = title;
    $("luxModalKicker").textContent = kicker || "LUXURY LIFESTYLE";
    $("luxModalContent").innerHTML = content;
    $("luxModalOverlay").hidden = false;
    document.body.style.overflow = "hidden";
    $("luxModalClose").focus();
  }

  function closeModal() {
    $("luxModalOverlay").hidden = true;
    document.body.style.overflow = "";
    if (modalPreviousFocus && typeof modalPreviousFocus.focus === "function") {
      modalPreviousFocus.focus();
    }
  }

  function termsContent() {
    return `
      <h3>Terms of Use</h3>
      <p>Use accurate information and only publish assets you own or are authorized to represent.</p>
      <p>Do not publish illegal offers, fraudulent claims, misleading photographs, impersonation, or prohibited content.</p>
      <p>Verify sellers, ownership documents, asset condition, availability and all transaction details independently.</p>
      <p>ALON HISTORYVERSE 24 does not verify sample listings. Sample photographs are illustrative and do not establish ownership or availability.</p>
      <p>Do not post passwords, payment credentials, government identity numbers or other sensitive information in public descriptions or messages.</p>
      <p>This version stores data in this browser. Clearing browser storage can remove your local data. Local browser sign-in is not secure server authentication.</p>
      <hr class="lux-divider">
      <h3>Listing rules</h3>
      <ul>
        <li>Use truthful titles, conditions, locations and prices.</li>
        <li>Use genuine photographs that you have permission to publish.</li>
        <li>Respond respectfully and report suspicious activity.</li>
        <li>Do not assume that a listing or seller has been independently verified.</li>
      </ul>`;
  }

  function privacyContent() {
    return `
      <h3>Privacy Notice</h3>
      <p>This browser-based version stores account demonstration data, listings, saved items and messages in local browser storage.</p>
      <p>Other people using the same browser profile or device may be able to access locally stored data.</p>
      <p>Do not use this prototype for sensitive account credentials or confidential transactions.</p>
      <p>Server-side account security, access controls, cross-device synchronisation and secure message delivery require the backend integration planned for a later stage.</p>
      <p>You can log out using the Logout button. Logging out does not automatically erase listings, messages or the local browser account.</p>`;
  }

  function photoInputsHTML() {
    return `
      <div class="lux-field lux-span-2">
        <label for="luxListingPhotos">Photograph URLs (one per line, up to 6)</label>
        <textarea id="luxListingPhotos" rows="3" maxlength="3000"
          placeholder="https://example.com/your-authorized-photo.jpg"></textarea>
        <p class="lux-help">Use direct image URLs that you own or are authorized to publish. This form stores URLs, not uploaded image files.</p>
        <div id="luxPhotoPreview" class="lux-photo-preview"></div>
      </div>`;
  }

  function listingForm(item) {
    const editing = Boolean(item);
    const value = key => escapeHTML(item ? item[key] || "" : "");
    const categoryValue = value("category");
    const categoryOptions = categories.map(category =>
      `<option value="${escapeHTML(category.id)}" ${category.id === categoryValue ? "selected" : ""}>${escapeHTML(category.name)}</option>`
    ).join("");

    const conditions = [
      "New", "Pre-owned", "Certified pre-owned",
      "Under construction", "For charter", "For rent"
    ];
    const conditionOptions = conditions.map(condition =>
      `<option ${item && item.condition === condition ? "selected" : ""}>${condition}</option>`
    ).join("");

    const type = item && item.listingType === "Rent" ? "Rent" : "Sale";
    const photos = item && Array.isArray(item.photos) ? item.photos.join("\n") : "";

    return `
      <form id="luxListingForm">
        <div class="lux-form-grid">
          <div class="lux-field lux-span-2">
            <label for="luxListingTitle">Item title *</label>
            <input id="luxListingTitle" required maxlength="120"
              value="${value("title")}" placeholder="Brand, model or property name">
          </div>
          <div class="lux-field">
            <label for="luxListingCategory">Category *</label>
            <select id="luxListingCategory" required>${categoryOptions}</select>
          </div>
          <div class="lux-field">
            <label for="luxListingType">Listing type *</label>
            <select id="luxListingType" required>
              <option ${type === "Sale" ? "selected" : ""}>Sale</option>
              <option ${type === "Rent" ? "selected" : ""}>Rent</option>
              <option ${item && type !== "Sale" && type !== "Rent" ? "selected" : ""}>For charter</option>
              <option>Wanted</option>
            </select>
          </div>
          <div class="lux-field">
            <label for="luxListingCondition">Condition</label>
            <select id="luxListingCondition">${conditionOptions}</select>
          </div>
          <div class="lux-field">
            <label for="luxListingCurrency">Currency</label>
            <select id="luxListingCurrency">
              ${["USD","INR","EUR","GBP","AED","CAD","AUD","SGD","JPY","CHF"].map(code =>
                `<option ${item && item.currency === code ? "selected" : (!item && code === "USD" ? "selected" : "")}>${code}</option>`
              ).join("")}
            </select>
          </div>
          <div class="lux-field">
            <label for="luxListingPrice">Asking price (optional)</label>
            <input id="luxListingPrice" type="number" min="0" step="any"
              value="${item && Number(item.price) > 0 ? escapeHTML(item.price) : ""}"
              placeholder="Leave blank for price on request">
          </div>
          <div class="lux-field">
            <label for="luxListingCountry">Country *</label>
            <input id="luxListingCountry" required maxlength="100"
              value="${value("country")}" placeholder="Country">
          </div>
          <div class="lux-field">
            <label for="luxListingState">State / Province / Region</label>
            <input id="luxListingState" maxlength="100"
              value="${value("state")}" placeholder="State or region">
          </div>
          <div class="lux-field">
            <label for="luxListingCity">City *</label>
            <input id="luxListingCity" required maxlength="100"
              value="${value("city")}" placeholder="City">
          </div>
          <div class="lux-field lux-span-2">
            <label for="luxListingDescription">Description *</label>
            <textarea id="luxListingDescription" required maxlength="5000" rows="5"
              placeholder="Describe specifications, condition, availability and important details.">${value("description")}</textarea>
          </div>
          ${photoInputsHTML()}
        </div>
        <p class="lux-help">Only publish genuine, authorized photographs and accurate details. Sample listings cannot be edited.</p>
        <div class="lux-form-actions">
          <button class="lux-btn" type="button" data-lux-action="close-modal">Cancel</button>
          <button class="lux-btn lux-btn-gold" type="submit">${editing ? "Save changes" : "Publish listing"}</button>
        </div>
        <input type="hidden" id="luxEditingId" value="${editing ? escapeHTML(item.id) : ""}">
      </form>`;
  }

  function openListingForm(item) {
    openModal(item ? "Edit your listing" : "Present your listing",
      listingForm(item), "SELL • RENT • SHOWCASE");
    const form = $("luxListingForm");
    if (!form) return;
    form.addEventListener("submit", saveListingForm);
    $("luxListingPhotos").value = item && item.photos
      ? item.photos.join("\n") : "";
    updatePhotoPreview();
    $("luxListingPhotos").addEventListener("input", updatePhotoPreview);
  }

  function updatePhotoPreview() {
    const box = $("luxPhotoPreview");
    if (!box) return;
    const urls = safe($("luxListingPhotos").value)
      .split(/\n/)
      .map(value => value.trim())
      .filter(value => /^https?:\/\//i.test(value))
      .slice(0, 6);

    box.innerHTML = urls.map(url =>
      `<img src="${escapeHTML(url)}" alt="Listing photo preview" loading="lazy"
        onerror="this.style.opacity='.25'">`
    ).join("");
  }

  function saveListingForm(event) {
    event.preventDefault();
    if (!currentUser) return logout(false);

    const title = $("luxListingTitle").value.trim();
    const category = $("luxListingCategory").value;
    const description = $("luxListingDescription").value.trim();
    const country = $("luxListingCountry").value.trim();
    const city = $("luxListingCity").value.trim();
    const priceText = $("luxListingPrice").value.trim();
    const price = priceText === "" ? 0 : Number(priceText);

    if (!title || !categoryMap.has(category) || !description || !country || !city) {
      toast("Complete all required fields.");
      return;
    }
    if (priceText !== "" && (!Number.isFinite(price) || price < 0)) {
      toast("Enter a valid price.");
      return;
    }

    const photoURLs = $("luxListingPhotos").value
      .split(/\n/)
      .map(value => value.trim())
      .filter(Boolean)
      .slice(0, 6);

    if (photoURLs.some(url => !/^https?:\/\//i.test(url))) {
      toast("Photo entries must be valid HTTP or HTTPS URLs.");
      return;
    }

    const editingId = $("luxEditingId").value;
    const existing = editingId
      ? listings.find(item => item.id === editingId && item.sellerId === currentUser.id)
      : null;

    if (editingId && !existing) {
      toast("This listing cannot be edited.");
      return;
    }

    const updated = {
      id: existing ? existing.id : uid("LUX"),
      title,
      category,
      description,
      country,
      state: $("luxListingState").value.trim(),
      city,
      condition: $("luxListingCondition").value,
      listingType: $("luxListingType").value,
      price,
      currency: $("luxListingCurrency").value,
      photos: photoURLs,
      sellerId: currentUser.id,
      sellerName: currentUser.displayName,
      createdAt: existing ? existing.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sample: false,
      views: existing ? Number(existing.views || 0) : 0
    };

    if (existing) {
      listings = listings.map(item => item.id === existing.id ? updated : item);
    } else {
      listings.unshift(updated);
    }

    if (!persistListings()) return;

    closeModal();
    populateCountryOptions();
    renderCategories();
    renderListings();
    toast(existing ? "Listing updated." : "Listing saved in this browser.");
  }

  function deleteListing(id) {
    const item = listings.find(entry =>
      entry.id === id && entry.sellerId === currentUser.id && !entry.sample
    );
    if (!item) {
      toast("You can only delete your own listings.");
      return;
    }

    openModal("Delete listing?", `
      <p>Are you sure you want to delete <strong>${escapeHTML(item.title)}</strong>?</p>
      <p class="lux-help">This removes the listing from this browser's local collection.</p>
      <div class="lux-form-actions">
        <button class="lux-btn" type="button" data-lux-action="close-modal">Cancel</button>
        <button class="lux-btn lux-btn-gold" type="button"
          data-lux-action="confirm-delete" data-id="${escapeHTML(id)}">Delete listing</button>
      </div>`, "CONFIRM ACTION");
  }

  function confirmDelete(id) {
    const item = listings.find(entry =>
      entry.id === id && entry.sellerId === currentUser.id && !entry.sample
    );
    if (!item) return toast("Listing not found.");

    listings = listings.filter(entry => entry.id !== id);
    const savedIds = Array.isArray(saved[currentUser.id]) ? saved[currentUser.id] : [];
    saved[currentUser.id] = savedIds.filter(savedId => savedId !== id);
    messages = messages.filter(message => message.listingId !== id);

    persistListings();
    persistSaved();
    persistMessages();
    closeModal();
    renderCategories();
    renderListings();
    toast("Listing deleted.");
  }

  function showDetails(id) {
    const item = listings.find(entry => entry.id === id);
    if (!item) return toast("Listing not found.");

    item.views = Number(item.views || 0) + 1;
    persistListings();

    const category = categoryMap.get(item.category);
    const photos = (item.photos || []).slice(0, 6);
    const gallery = photos.length
      ? `<div class="lux-detail-gallery">${photos.map(photo =>
          `<img src="${escapeHTML(photo)}" alt="${escapeHTML(item.title)}" loading="lazy">`
        ).join("")}</div>`
      : "";

    openModal(item.title, `
      ${gallery}
      <p class="lux-card-category">${escapeHTML(category ? category.name : item.category)}</p>
      <p>${escapeHTML(item.description || "No description supplied.")}</p>
      <hr class="lux-divider">
      <p><strong>Type:</strong> ${escapeHTML(item.listingType || "Not specified")}</p>
      <p><strong>Price:</strong> ${escapeHTML(money(item.price, item.currency))}</p>
      <p><strong>Condition:</strong> ${escapeHTML(item.condition || "Not specified")}</p>
      <p><strong>Location:</strong> ${escapeHTML([item.city, item.state, item.country].filter(Boolean).join(", ") || "Not provided")}</p>
      <p><strong>Seller:</strong> ${escapeHTML(item.sellerName || "Seller")}</p>
      <p><strong>Added:</strong> ${escapeHTML(dateLabel(item.createdAt))}</p>
      <p><strong>Views:</strong> ${Number(item.views || 0)}</p>
      ${item.sample ? '<p class="lux-help">Illustrative sample only. Availability and seller details have not been verified.</p>' : ""}
      <div class="lux-form-actions">
        <button class="lux-btn" type="button" data-lux-action="close-modal">Close</button>
        <button class="lux-btn lux-btn-gold" type="button"
          data-lux-action="message" data-id="${escapeHTML(id)}">Contact seller</button>
      </div>`, "LISTING DETAILS");
  }

  function toggleSaved(id) {
    const item = listings.find(entry => entry.id === id);
    if (!item) return;

    const ids = Array.isArray(saved[currentUser.id]) ? saved[currentUser.id] : [];
    const exists = ids.includes(id);
    saved[currentUser.id] = exists
      ? ids.filter(savedId => savedId !== id)
      : [...ids, id];

    if (!persistSaved()) return;
    renderListings();
    toast(exists ? "Removed from saved listings." : "Listing saved.");
  }

  function showSaved() {
    const ids = Array.isArray(saved[currentUser.id]) ? saved[currentUser.id] : [];
    const items = listings.filter(item => ids.includes(item.id));

    openModal("Saved listings", items.length
      ? `<div class="lux-listings">${items.map(listingCard).join("")}</div>`
      : `<div class="lux-empty"><h3>No saved listings yet</h3><p>Use the heart button to save items for later.</p></div>`,
      "YOUR COLLECTION");
  }

  function showMessageForm(id) {
    const item = listings.find(entry => entry.id === id);
    if (!item) return toast("Listing not found.");

    if (item.sellerId === currentUser.id && !item.sample) {
      showInbox(id);
      return;
    }

    if (item.sample) {
      openModal("Sample listing", `
        <p>This is an illustrative example, not a verified seller listing.</p>
        <p>To contact a seller, open a listing created by a registered local user.</p>
        <div class="lux-form-actions">
          <button class="lux-btn lux-btn-gold" type="button"
            data-lux-action="close-modal">Close</button>
        </div>`, "SELLER CONTACT");
      return;
    }

    openModal("Contact seller", `
      <p><strong>${escapeHTML(item.title)}</strong></p>
      <p class="lux-help">Your message will be stored locally in this browser. It is not sent to another device or server yet.</p>
      <form id="luxMessageForm">
        <div class="lux-field">
          <label for="luxMessageText">Your message *</label>
          <textarea id="luxMessageText" required maxlength="3000" rows="5"
            placeholder="Hello, I would like to know more about this item."></textarea>
        </div>
        <div class="lux-form-actions">
          <button class="lux-btn" type="button" data-lux-action="close-modal">Cancel</button>
          <button class="lux-btn lux-btn-gold" type="submit">Save message</button>
        </div>
      </form>`, "PRIVATE ENQUIRY");

    $("luxMessageForm").addEventListener("submit", event => {
      event.preventDefault();
      const text = $("luxMessageText").value.trim();
      if (!text) return;

      messages.push({
        id: uid("MSG"),
        listingId: item.id,
        listingTitle: item.title,
        fromId: currentUser.id,
        fromName: currentUser.displayName,
        toId: item.sellerId,
        toName: item.sellerName || "Seller",
        text,
        createdAt: new Date().toISOString(),
        read: false
      });

      if (!persistMessages()) return;
      closeModal();
      updateCounts();
      toast("Message saved in this browser.");
    });
  }

  function showInbox(listingId) {
    const relevant = messages.filter(message =>
      message.fromId === currentUser.id || message.toId === currentUser.id
    ).filter(message => !listingId || message.listingId === listingId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    relevant.forEach(message => {
      if (message.toId === currentUser.id) message.read = true;
    });
    persistMessages();
    updateCounts();

    const content = relevant.length
      ? `<div class="lux-inbox-list">${relevant.map(message => `
          <article class="lux-message">
            <strong>${escapeHTML(message.listingTitle || "Listing enquiry")}</strong>
            <p>${escapeHTML(message.text)}</p>
            <small>${escapeHTML(message.fromName || "User")} → ${escapeHTML(message.toName || "User")}
              · ${escapeHTML(dateLabel(message.createdAt))}</small>
            <div class="lux-form-actions">
              <button class="lux-btn" type="button"
                data-lux-action="reply" data-id="${escapeHTML(message.id)}">Reply</button>
            </div>
          </article>`).join("")}</div>`
      : `<div class="lux-empty"><h3>Your inbox is empty</h3><p>Listing enquiries will appear here when available in this browser.</p></div>`;

    openModal("Inbox", content, "MESSAGES & ENQUIRIES");
  }

  function replyToMessage(messageId) {
    const message = messages.find(item =>
      item.id === messageId &&
      (item.toId === currentUser.id || item.fromId === currentUser.id)
    );
    if (!message) return;

    const recipientId = message.fromId === currentUser.id
      ? message.toId : message.fromId;
    const recipientName = message.fromId === currentUser.id
      ? message.toName : message.fromName;

    openModal("Reply to message", `
      <p><strong>${escapeHTML(message.listingTitle || "Listing enquiry")}</strong></p>
      <p class="lux-help">Replies are stored locally in this browser until backend messaging is connected.</p>
      <form id="luxReplyForm">
        <div class="lux-field">
          <label for="luxReplyText">Reply to ${escapeHTML(recipientName || "user")}</label>
          <textarea id="luxReplyText" required maxlength="3000" rows="5"></textarea>
        </div>
        <div class="lux-form-actions">
          <button class="lux-btn" type="button" data-lux-action="close-modal">Cancel</button>
          <button class="lux-btn lux-btn-gold" type="submit">Save reply</button>
        </div>
      </form>`, "MESSAGE REPLY");

    $("luxReplyForm").addEventListener("submit", event => {
      event.preventDefault();
      const text = $("luxReplyText").value.trim();
      if (!text) return;

      messages.push({
        id: uid("MSG"),
        listingId: message.listingId,
        listingTitle: message.listingTitle,
        fromId: currentUser.id,
        fromName: currentUser.displayName,
        toId: recipientId,
        toName: recipientName,
        text,
        createdAt: new Date().toISOString(),
        read: false
      });

      persistMessages();
      closeModal();
      updateCounts();
      toast("Reply saved locally.");
    });
  }

  function clearFilters() {
    $("luxSearch").value = "";
    $("luxFilterCategory").value = "";
    $("luxFilterCountry").value = "";
    $("luxFilterCondition").value = "";
    $("luxMinPrice").value = "";
    $("luxMaxPrice").value = "";
    $("luxSort").value = "newest";
    activeCategory = "";
    renderListings();
  }

  function handleAction(button) {
    const action = button.dataset.luxAction;
    const id = button.dataset.id;

    switch (action) {
      case "add":
        openListingForm(null);
        break;
      case "details":
        showDetails(id);
        break;
      case "save":
        toggleSaved(id);
        break;
      case "edit": {
        const item = listings.find(entry =>
          entry.id === id && entry.sellerId === currentUser.id && !entry.sample
        );
        if (item) openListingForm(item);
        else toast("You can only edit your own listings.");
        break;
      }
      case "delete":
        deleteListing(id);
        break;
      case "confirm-delete":
        confirmDelete(id);
        break;
      case "message":
        showMessageForm(id);
        break;
      case "reply":
        replyToMessage(id);
        break;
      case "close-modal":
        closeModal();
        break;
    }
  }

  function bindEvents() {
    $("luxLoginForm").addEventListener("submit", async event => {
      event.preventDefault();

      const email = $("luxLoginEmail").value.trim();
      const password = $("luxLoginPassword").value;
      const terms = $("luxLoginTerms").checked;
      const error = $("luxLoginError");

      if (!terms) {
        error.textContent = "Please accept the Terms of Use to continue.";
        return;
      }
      if (password.length < 8) {
        error.textContent = "Password must contain at least 8 characters.";
        return;
      }

      const button = $("luxLoginForm").querySelector('button[type="submit"]');
      button.disabled = true;
      error.textContent = "Signing in…";

      try {
        await login(email, password);
        showApp();
        toast("Welcome to Luxury Lifestyle.");
      } catch (exception) {
        error.textContent = exception.message ||
          "Unable to sign in. Please try again.";
      } finally {
        button.disabled = false;
      }
    });

    $("luxLogoutButton").addEventListener("click", () => logout(true));
    $("luxAddListingButton").addEventListener("click", () => openListingForm(null));
    $("luxHeroListButton").addEventListener("click", () => openListingForm(null));
    $("luxInboxButton").addEventListener("click", () => showInbox());
    $("luxSavedButton").addEventListener("click", showSaved);
    $("luxClearFilters").addEventListener("click", clearFilters);
    $("luxModalClose").addEventListener("click", closeModal);

    $("luxModalOverlay").addEventListener("click", event => {
      if (event.target === $("luxModalOverlay")) closeModal();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !$("luxModalOverlay").hidden) closeModal();
    });

    [
      "luxSearch", "luxFilterCategory", "luxFilterCountry",
      "luxFilterCondition", "luxMinPrice", "luxMaxPrice", "luxSort"
    ].forEach(id => {
      $(id).addEventListener("input", () => {
        if (id === "luxFilterCategory") activeCategory = "";
        renderListings();
      });
      $(id).addEventListener("change", () => {
        if (id === "luxFilterCategory") activeCategory = "";
        renderListings();
      });
    });

    $("luxCategoryGrid").addEventListener("click", event => {
      const button = event.target.closest("[data-lux-category]");
      if (!button) return;

      activeCategory = button.dataset.luxCategory;
      $("luxFilterCategory").value = activeCategory;
      $("luxShowroom").scrollIntoView({ behavior: "smooth" });
      renderListings();
    });

    document.addEventListener("click", event => {
      const button = event.target.closest("[data-lux-action]");
      if (!button) return;

      /*
       * The modal's own buttons and the listing grid share delegated actions.
       * Stop navigation when an action button is clicked.
       */
      event.preventDefault();
      handleAction(button);
    });

    document.querySelectorAll("[data-lux-open-terms]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        openModal("Terms of Use", termsContent(), "TERMS & LISTING RULES");
      });
    });

    document.querySelectorAll("[data-lux-open-privacy]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        openModal("Privacy", privacyContent(), "YOUR PRIVACY");
      });
    });

    window.addEventListener("storage", event => {
      if (!event.key) return;
      if ([KEYS.listings, KEYS.saved, KEYS.messages].includes(event.key)) {
        listings = read(KEYS.listings, listings);
        saved = read(KEYS.saved, saved);
        messages = read(KEYS.messages, messages);
        renderCategories();
        populateCountryOptions();
        renderListings();
      }
    });
  }

  function start() {
    if (!$("luxLoginScreen") || !$("luxApp") || !$("luxLoginForm")) {
      console.error("[Luxury Lifestyle] Required HTML elements were not found.");
      return;
    }

    bindEvents();
    $("luxYear").textContent = String(new Date().getFullYear());

    const savedSession = read(KEYS.session, null);
    if (savedSession && savedSession.userId && savedSession.email) {
      const accounts = getAccountList();
      const account = accounts.find(item =>
        item.id === savedSession.userId &&
        item.email === savedSession.email
      );

      if (account) {
        currentUser = {
          id: account.id,
          email: account.email,
          displayName: account.displayName || account.email.split("@")[0]
        };
        showApp();
        return;
      }
    }

    logout(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

})();
