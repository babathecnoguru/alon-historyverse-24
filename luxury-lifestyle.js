
/* =========================================================
   ALON HISTORYVERSE 24
   LUXURY LIFESTYLE / BRAND PROMOTER
   Version: 3.0.0
   Owner: Baba Thecno Guru

   PART 1/3
   - Core configuration and safe local storage
   - Login interface and Terms & Conditions
   - Luxury category interface
   - No price or currency fields
   ========================================================= */

(function () {
  "use strict";

  if (window.ALON_LUXURY_LIFESTYLE_V3_LOADING) return;
  window.ALON_LUXURY_LIFESTYLE_V3_LOADING = true;

  const VERSION = "3.0.0";

  const KEYS = Object.freeze({
    listings: "alon-historyverse-luxury-lifestyle-listings",
    profile: "alon-historyverse-luxury-lifestyle-profile",
    terms: "alon-historyverse-luxury-lifestyle-terms",
    messages: "alon-historyverse-luxury-lifestyle-messages",
    saved: "alon-historyverse-luxury-lifestyle-saved",
    session: "alon-historyverse-luxury-lifestyle-session"
  });

  const TERMS_VERSION = "3.0";

  const CATEGORIES = [
    { id: "private-helicopters", name: "Private Helicopters", icon: "🚁" },
    { id: "private-jets", name: "Private Jets", icon: "🛩️" },
    { id: "aircraft", name: "Aircraft", icon: "✈️" },
    { id: "luxury-cars", name: "Luxury Cars", icon: "🚘" },
    { id: "luxury-watches", name: "Luxury Watches", icon: "⌚" },
    { id: "luxury-bikes", name: "Luxury Bikes & Motorcycles", icon: "🏍️" },
    { id: "premium-trucks", name: "Premium Trucks", icon: "🚛" },
    { id: "luxury-property", name: "Luxury Property", icon: "🏢" },
    { id: "bungalows", name: "Bungalows & Villas", icon: "🏡" },
    { id: "flats", name: "Luxury Flats", icon: "🏙️" },
    { id: "party-plots", name: "Party Plots", icon: "🌴" },
    { id: "dance-bars", name: "Dance Bars & Lounges", icon: "🎶" },
    { id: "hotels", name: "Hotels & Resorts", icon: "🏨" },
    { id: "malls", name: "Malls & Shopping", icon: "🏬" },
    { id: "events", name: "Luxury Events", icon: "🎉" },
    { id: "yachts", name: "Yachts & Boats", icon: "🛥️" },
    { id: "ships", name: "Ships", icon: "🚢" },
    { id: "container-ships", name: "Container Ships", icon: "🚢" },
    { id: "heavy-machinery", name: "Heavy Machinery", icon: "🏗️" },
    { id: "movies", name: "Movies", icon: "🎬" },
    { id: "serials", name: "Serials", icon: "📺" },
    { id: "web-series", name: "Web Series", icon: "🎞️" },
    { id: "podcasts", name: "Podcasts", icon: "🎙️" },
    { id: "songs", name: "Songs", icon: "🎵" },
    { id: "albums", name: "Music Albums", icon: "💿" },
    { id: "sports", name: "Sports", icon: "🏆" },
    { id: "games", name: "Games", icon: "🎮" },
    { id: "tourist-guide", name: "Tourist Guides", icon: "🧭" },
    { id: "best-tourist-places", name: "Tourist Places", icon: "🌍" },
    { id: "photos", name: "Photography", icon: "📷" },
    { id: "videos", name: "Videos", icon: "🎥" },
    { id: "3d", name: "3D Creations", icon: "🧊" },
    { id: "website", name: "Websites & Digital Assets", icon: "🌐" }
  ];

  const ACTIONS = [
    { id: "sale", name: "For Sale" },
    { id: "rent", name: "For Rent" },
    { id: "both", name: "Sale or Rent" },
    { id: "booking", name: "Booking / Reservation" },
    { id: "promote", name: "Promote a Brand" }
  ];

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      console.warn("[Luxury Lifestyle] Storage read failed:", error);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      notify("Storage is full or unavailable. Your changes were not saved.");
      console.error("[Luxury Lifestyle] Storage write failed:", error);
      return false;
    }
  }

  function makeId(prefix = "luxury") {
    return prefix + "-" +
      Date.now().toString(36) + "-" +
      Math.random().toString(36).slice(2, 10);
  }

  function cleanText(value, maxLength = 5000) {
    return String(value == null ? "" : value)
      .trim()
      .slice(0, maxLength);
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function notify(message, type = "info") {
    let box = $("[data-luxury-notice]");

    if (!box) {
      box = document.createElement("div");
      box.setAttribute("data-luxury-notice", "");
      box.setAttribute("role", "status");

      Object.assign(box.style, {
        position: "fixed",
        left: "50%",
        bottom: "20px",
        transform: "translateX(-50%)",
        zIndex: "100005",
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        padding: "12px 18px",
        border: "1px solid #d7b35a",
        borderRadius: "12px",
        background: "#080d17",
        color: "#f0d27a",
        boxShadow: "0 8px 30px rgba(0,0,0,.4)",
        fontSize: "14px"
      });

      document.body.appendChild(box);
    }

    box.style.borderColor =
      type === "error" ? "#e56b6f" : "#d7b35a";

    box.textContent = message;
    box.hidden = false;
  }

  function getCategory(categoryId) {
    return CATEGORIES.find(item => item.id === categoryId) || {
      id: categoryId || "other",
      name: "Other Luxury Items",
      icon: "✨"
    };
  }

  function getListings() {
    const data = readJSON(KEYS.listings, []);
    return Array.isArray(data) ? data : [];
  }

  function saveListings(listings) {
    return writeJSON(KEYS.listings, listings);
  }

  function getSession() {
    return readJSON(KEYS.session, null);
  }

  function hasAcceptedTerms() {
    const terms = readJSON(KEYS.terms, null);
    return Boolean(
      terms &&
      terms.accepted === true &&
      terms.version === TERMS_VERSION
    );
  }

  function getCurrentUser() {
    const session = getSession();

    if (!session || !session.email || !hasAcceptedTerms()) {
      return null;
    }

    return {
      id: session.userId,
      email: session.email,
      name: session.name || session.email
    };
  }

  /* =======================================================
     STYLE
  ======================================================= */

  function installStyles() {
    if ($("#alonLuxuryV3Styles")) return;

    const style = document.createElement("style");
    style.id = "alonLuxuryV3Styles";

    style.textContent = `
      .alv3-wrap {
        color: #f4f0e5;
        background: #05080f;
        padding: 18px;
        border: 1px solid rgba(215,179,90,.3);
        border-radius: 18px;
        margin: 20px 0;
        font-family: Arial, sans-serif;
      }

      .alv3-wrap * { box-sizing: border-box; }

      .alv3-title {
        color: #f0d27a;
        margin: 0 0 8px;
        font-size: clamp(22px, 4vw, 32px);
      }

      .alv3-muted {
        color: #b9bfca;
        line-height: 1.6;
      }

      .alv3-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
        gap: 12px;
      }

      .alv3-card {
        min-width: 0;
        padding: 14px;
        border: 1px solid rgba(215,179,90,.3);
        border-radius: 14px;
        background: #0b111b;
        color: #f4f0e5;
      }

      .alv3-category {
        text-align: left;
        cursor: pointer;
        transition: border-color .2s, transform .2s;
      }

      .alv3-category:hover {
        border-color: #f0d27a;
        transform: translateY(-2px);
      }

      .alv3-category-icon {
        display: block;
        font-size: 28px;
        margin-bottom: 10px;
      }

      .alv3-button {
        display: inline-block;
        padding: 11px 15px;
        border: 1px solid #d7b35a;
        border-radius: 10px;
        background: #d7b35a;
        color: #10131a;
        font-weight: 700;
        cursor: pointer;
      }

      .alv3-button.secondary {
        background: transparent;
        color: #f0d27a;
      }

      .alv3-button.danger {
        border-color: #e56b6f;
        background: #40191d;
        color: #fff;
      }

      .alv3-input, .alv3-select, .alv3-textarea {
        display: block;
        width: 100%;
        min-width: 0;
        padding: 12px;
        margin: 6px 0 14px;
        border: 1px solid #344052;
        border-radius: 9px;
        background: #080d17;
        color: #fff;
        font: inherit;
      }

      .alv3-textarea {
        min-height: 100px;
        resize: vertical;
      }

      .alv3-label {
        display: block;
        color: #f0d27a;
        font-weight: 700;
        margin-top: 10px;
      }

      .alv3-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }

      .alv3-panel {
        padding: 16px;
        margin: 14px 0;
        border: 1px solid rgba(215,179,90,.25);
        border-radius: 14px;
        background: #080d17;
      }

      .alv3-hidden { display: none !important; }

      .alv3-listing-image {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        border-radius: 10px;
        background: #111927;
      }

      .alv3-chip {
        display: inline-block;
        padding: 5px 9px;
        margin: 3px;
        border: 1px solid rgba(215,179,90,.4);
        border-radius: 999px;
        color: #f0d27a;
        font-size: 12px;
      }

      .alv3-modal {
        position: fixed;
        inset: 0;
        z-index: 100000;
        display: grid;
        place-items: center;
        padding: 16px;
        background: rgba(0,0,0,.78);
        overflow: auto;
      }

      .alv3-modal-content {
        width: min(650px, 100%);
        max-height: 92vh;
        overflow: auto;
        padding: 20px;
        border: 1px solid #d7b35a;
        border-radius: 16px;
        background: #080d17;
        color: #f4f0e5;
      }

      .alv3-terms-check {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        line-height: 1.5;
        margin: 14px 0;
      }

      .alv3-terms-check input {
        margin-top: 4px;
        flex: 0 0 auto;
      }

      @media (max-width: 480px) {
        .alv3-wrap { padding: 12px; }
        .alv3-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .alv3-card { padding: 10px; }
      }
    `;

    document.head.appendChild(style);
  }

  /* =======================================================
     MAIN APP SHELL
  ======================================================= */

  function ensureAppShell() {
    let root = $("#alonLuxuryLifestyleV3");

    if (root) return root;

    root = document.createElement("section");
    root.id = "alonLuxuryLifestyleV3";
    root.className = "alv3-wrap";

    root.innerHTML = `
      <header>
        <p class="alv3-chip">ALON HISTORYVERSE 24</p>
        <h2 class="alv3-title">Luxury Lifestyle</h2>
        <p class="alv3-muted">
          Discover, list and promote luxury products, properties,
          experiences and premium services around the world.
        </p>
      </header>

      <section id="alv3LoginPanel" class="alv3-panel">
        <h3 class="alv3-title">Login / Create Local Profile</h3>
        <p class="alv3-muted">
          Enter your email and password to open this browser's
          local Luxury Lifestyle workspace. This initial version
          does not verify passwords through a server.
        </p>

        <form id="alv3LoginForm">
          <label class="alv3-label" for="alv3Email">Email</label>
          <input class="alv3-input" id="alv3Email"
            type="email" autocomplete="email" required
            maxlength="254" placeholder="you@example.com">

          <label class="alv3-label" for="alv3Password">Password</label>
          <input class="alv3-input" id="alv3Password"
            type="password" autocomplete="current-password"
            required minlength="8" maxlength="128"
            placeholder="At least 8 characters">

          <label class="alv3-label" for="alv3DisplayName">
            Display / Company Name
          </label>
          <input class="alv3-input" id="alv3DisplayName"
            type="text" maxlength="100"
            placeholder="Your name or company">

          <label class="alv3-terms-check">
            <input id="alv3TermsCheckbox" type="checkbox" required>
            <span>
              I have read and accept the
              <a href="#alv3TermsText" style="color:#f0d27a">
                Terms &amp; Conditions
              </a>.
            </span>
          </label>

          <div class="alv3-panel" id="alv3TermsText">
            <h4>Terms &amp; Conditions</h4>
            <p class="alv3-muted">
              You must provide truthful listing information and
              have permission to publish all uploaded media.
              Do not post illegal, fraudulent, stolen or misleading
              items. You are responsible for your listings and
              communication with other users.
            </p>
            <p class="alv3-muted">
              Contact details and listing information may be visible
              to people who can access this browser's saved data.
              Do not enter confidential information. Local profile
              storage is not a secure authentication system.
            </p>
            <p class="alv3-muted">
              ALON HISTORYVERSE 24 may remove prohibited content.
              Any transaction, booking or agreement is between the
              relevant parties unless a separate written agreement
              states otherwise.
            </p>
          </div>

          <button class="alv3-button" type="submit">
            Accept Terms &amp; Continue
          </button>
        </form>
      </section>

      <section id="alv3Workspace" class="alv3-hidden">
        <div class="alv3-panel">
          <div class="alv3-row">
            <div style="flex:1">
              <strong id="alv3Welcome"></strong>
              <p class="alv3-muted">
                Manage your luxury listings and inquiries.
              </p>
            </div>
            <button type="button" id="alv3Logout"
              class="alv3-button secondary">Log Out</button>
          </div>
        </div>

        <div class="alv3-panel">
          <h3>Find Luxury Items</h3>
          <label class="alv3-label" for="alv3Search">Search listings</label>
          <input class="alv3-input" id="alv3Search"
            type="search" placeholder="Search title, category or location">

          <label class="alv3-label" for="alv3ActionFilter">
            Listing Type
          </label>
          <select class="alv3-select" id="alv3ActionFilter">
            <option value="">All listing types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="both">Sale or Rent</option>
            <option value="booking">Booking / Reservation</option>
            <option value="promote">Brand Promotion</option>
          </select>
        </div>

        <div class="alv3-row">
          <button type="button" class="alv3-button"
            id="alv3CreateListing">Create Listing</button>
          <button type="button" class="alv3-button secondary"
            id="alv3MyListings">My Listings</button>
          <button type="button" class="alv3-button secondary"
            id="alv3Inbox">Seller Inbox</button>
        </div>

        <section class="alv3-panel">
          <h3>Luxury Categories</h3>
          <p class="alv3-muted">
            Select a category to browse its listings.
          </p>
          <div id="alv3CategoryGrid" class="alv3-grid"></div>
        </section>

        <section class="alv3-panel">
          <div class="alv3-row">
            <h3 id="alv3ListingHeading" style="flex:1">
              Latest Listings
            </h3>
            <button type="button" id="alv3ShowAll"
              class="alv3-button secondary">Show All</button>
          </div>
          <div id="alv3Listings" class="alv3-grid"></div>
          <p id="alv3Empty" class="alv3-muted">
            No listings to show yet.
          </p>
        </section>

        <section id="alv3FormSection" class="alv3-panel alv3-hidden">
          <h3 id="alv3FormHeading">Create a Luxury Listing</h3>
          <div id="alv3ListingFormMount"></div>
        </section>

        <section id="alv3InboxSection" class="alv3-panel alv3-hidden">
          <h3>Seller Inbox</h3>
          <div id="alv3InboxMount"></div>
        </section>
      </section>
    `;

    const existing = $(
      "#luxuryFolderBar, #luxuryListings, #luxury-listings, " +
      "[data-luxury-listings], main"
    );

    if (existing && existing.parentNode) {
      existing.parentNode.insertBefore(root, existing);
    } else {
      document.body.appendChild(root);
    }

    return root;
  }

  /* =======================================================
     CATEGORY RENDERER
  ======================================================= */

  function renderCategories() {
    const grid = $("#alv3CategoryGrid");
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map(category => `
      <button type="button"
        class="alv3-card alv3-category"
        data-alv3-category="${escapeHTML(category.id)}">
        <span class="alv3-category-icon"
          aria-hidden="true">${category.icon}</span>
        <strong>${escapeHTML(category.name)}</strong>
      </button>
    `).join("");
  }

  /* =======================================================
     TERMS ACCEPTANCE AND LOCAL PROFILE
  ======================================================= */

  function showLogin() {
    $("#alv3LoginPanel")?.classList.remove("alv3-hidden");
    $("#alv3Workspace")?.classList.add("alv3-hidden");
  }

  function showWorkspace() {
    const user = getCurrentUser();

    if (!user) {
      showLogin();
      return;
    }

    $("#alv3LoginPanel")?.classList.add("alv3-hidden");
    $("#alv3Workspace")?.classList.remove("alv3-hidden");

    const welcome = $("#alv3Welcome");
    if (welcome) {
      welcome.textContent = "Welcome, " + user.name;
    }
  }

  function acceptLocalTerms(email, displayName) {
    const accepted = writeJSON(KEYS.terms, {
      accepted: true,
      version: TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
      email: email
    });

    if (!accepted) return false;

    const session = {
      userId: makeId("user"),
      email: email,
      name: displayName || email,
      createdAt: new Date().toISOString(),
      localOnly: true
    };

    return writeJSON(KEYS.session, session);
  }

  function handleLogin(event) {
    event.preventDefault();

    const email = cleanText($("#alv3Email")?.value, 254).toLowerCase();
    const password = $("#alv3Password")?.value || "";
    const displayName = cleanText($("#alv3DisplayName")?.value, 100);
    const accepted = $("#alv3TermsCheckbox")?.checked === true;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify("Please enter a valid email address.", "error");
      return;
    }

    if (password.length < 8) {
      notify("Password must contain at least 8 characters.", "error");
      return;
    }

    if (!accepted) {
      notify("You must accept the Terms & Conditions.", "error");
      return;
    }

    /*
      This is only a local demo gate.
      The password is not saved or verified.
      Real accounts require server-side authentication.
    */
    if (!acceptLocalTerms(email, displayName)) {
      notify("Could not save your local session.", "error");
      return;
    }

    $("#alv3Password").value = "";
    showWorkspace();
    notify("Terms accepted. Local workspace opened.");
  }

  function logout() {
    try {
      localStorage.removeItem(KEYS.session);
    } catch (_) {}

    showLogin();
    notify("You have logged out.");
  }

  /* =======================================================
     PART 1 ENDS HERE.
     CONTINUE DIRECTLY WITH PART 2/3.
  ======================================================= */
/* =======================================================
   ALON HISTORYVERSE 24
   LUXURY LIFESTYLE / BRAND PROMOTER
   VERSION 3.0.0 — PART 2/3
   Continue directly after PART 1.
======================================================= */

  /* -------------------------------------------------------
     COUNTRY SELECTOR
     Reuse the site's country helper when available.
  ------------------------------------------------------- */

  function getFallbackCountries() {
    return [
      "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
      "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
      "Bahrain", "Bangladesh", "Belgium", "Bhutan", "Brazil",
      "Brunei", "Bulgaria", "Cambodia", "Canada", "Chile",
      "China", "Colombia", "Croatia", "Cyprus", "Czechia",
      "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland",
      "France", "Georgia", "Germany", "Ghana", "Greece",
      "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
      "Iran", "Iraq", "Ireland", "Israel", "Italy",
      "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait",
      "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia",
      "Maldives", "Malta", "Mauritius", "Mexico", "Monaco",
      "Mongolia", "Morocco", "Myanmar", "Nepal", "Netherlands",
      "New Zealand", "Nigeria", "Norway", "Oman", "Pakistan",
      "Philippines", "Poland", "Portugal", "Qatar", "Romania",
      "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia",
      "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka",
      "Sweden", "Switzerland", "Taiwan", "Tanzania", "Thailand",
      "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
      "United Kingdom", "United States", "Uzbekistan", "Vietnam",
      "Zambia", "Zimbabwe"
    ];
  }

  function fillCountrySelect(select) {
    if (!select || select.tagName !== "SELECT") return;

    if (select.options.length > 1) return;

    const previousValue = select.value;

    try {
      if (typeof window.ALON_FILL_COUNTRY_SELECT === "function") {
        window.ALON_FILL_COUNTRY_SELECT(select);
      }
    } catch (error) {
      console.warn(
        "[ALON Luxury] Existing country helper could not be used.",
        error
      );
    }

    if (select.options.length <= 1) {
      const placeholder = select.options.length
        ? select.options[0].textContent
        : "Select country";

      select.innerHTML = "";

      const first = document.createElement("option");
      first.value = "";
      first.textContent = placeholder;
      select.appendChild(first);

      getFallbackCountries().forEach(function (country) {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        select.appendChild(option);
      });
    }

    if (previousValue) select.value = previousValue;
  }

  function initializeCountrySelectors() {
    const app = $("#alonLuxuryLifestyleV3");
    if (!app) return;

    app.querySelectorAll(
      'select[name="country"], select[data-alon-country]'
    ).forEach(fillCountrySelect);
  }

  /* -------------------------------------------------------
     LISTING FORM
     Intentionally has NO price or currency fields.
  ------------------------------------------------------- */

  function getListingForm() {
    return $("#alonLuxuryListingForm");
  }

  function ensureListingFormFields() {
    const form = getListingForm();
    if (!form) return;

    if (form.dataset.alonLuxuryFieldsReady === "yes") return;

    form.dataset.alonLuxuryFieldsReady = "yes";

    form.innerHTML = `
      <div class="alon-luxury-form-heading">
        <h3 id="alonLuxuryFormHeading">Create Luxury Listing</h3>
        <p>
          Add your luxury item, service, company or promotional listing.
        </p>
      </div>

      <input type="hidden" name="listingId" value="">

      <label>
        Category
        <select name="category" required>
          <option value="">Select category</option>
          ${CATEGORIES.map(function (item) {
            return `
              <option value="${escapeHTML(item.id)}">
                ${escapeHTML(item.label)}
              </option>
            `;
          }).join("")}
        </select>
      </label>

      <label>
        Listing Type
        <select name="action" required>
          <option value="">Select listing type</option>
          ${ACTIONS.map(function (item) {
            return `
              <option value="${escapeHTML(item.id)}">
                ${escapeHTML(item.label)}
              </option>
            `;
          }).join("")}
        </select>
      </label>

      <label>
        Title
        <input
          type="text"
          name="title"
          maxlength="120"
          required
          placeholder="Enter listing title"
        >
      </label>

      <label>
        Description
        <textarea
          name="description"
          maxlength="5000"
          rows="5"
          required
          placeholder="Describe your item, service or promotion"
        ></textarea>
      </label>

      <label>
        Country
        <select name="country" data-alon-country required>
          <option value="">Select country</option>
        </select>
      </label>

      <label>
        City / Area
        <input
          type="text"
          name="location"
          maxlength="160"
          placeholder="Enter city, area or location"
        >
      </label>

      <label>
        Company / Brand Name
        <input
          type="text"
          name="company"
          maxlength="160"
          placeholder="Optional"
        >
      </label>

      <label>
        Seller WhatsApp
        <input
          type="tel"
          name="whatsapp"
          maxlength="30"
          placeholder="Include country code"
        >
      </label>

      <label>
        Company Website
        <input
          type="url"
          name="website"
          maxlength="500"
          placeholder="https://example.com"
        >
      </label>

      <label>
        Photos
        <input
          type="file"
          name="photos"
          accept="image/*"
          multiple
        >
      </label>

      <p class="alon-luxury-upload-note">
        Choose clear photos. Large uploads may exceed your browser's
        local storage limit. Photos saved this way remain on this browser
        unless a server-based media service is connected.
      </p>

      <div
        id="alonLuxuryPhotoPreview"
        class="alon-luxury-photo-preview"
        aria-live="polite"
      ></div>

      <div class="alon-luxury-form-actions">
        <button type="submit" class="alon-luxury-primary">
          Save Listing
        </button>
        <button
          type="button"
          data-alon-luxury-cancel-form
          class="alon-luxury-secondary"
        >
          Cancel
        </button>
      </div>
    `;

    initializeCountrySelectors();
  }

  function getFormValue(form, name) {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || "").trim() : "";
  }

  function setFormValue(form, name, value) {
    const field = form.elements.namedItem(name);
    if (field) field.value = value == null ? "" : String(value);
  }

  function openListingForm(listing) {
    const form = getListingForm();
    const workspace = $("#alonLuxuryWorkspace");
    if (!form || !workspace) return;

    ensureListingFormFields();

    const heading = $("#alonLuxuryFormHeading");
    if (heading) {
      heading.textContent = listing
        ? "Edit Luxury Listing"
        : "Create Luxury Listing";
    }

    form.reset();

    setFormValue(form, "listingId", listing ? listing.id : "");
    setFormValue(form, "category", listing ? listing.category : "");
    setFormValue(form, "action", listing ? listing.action : "");
    setFormValue(form, "title", listing ? listing.title : "");
    setFormValue(form, "description", listing ? listing.description : "");
    setFormValue(form, "country", listing ? listing.country : "");
    setFormValue(form, "location", listing ? listing.location : "");
    setFormValue(form, "company", listing ? listing.company : "");
    setFormValue(form, "whatsapp", listing ? listing.whatsapp : "");
    setFormValue(form, "website", listing ? listing.website : "");

    const fileInput = form.elements.namedItem("photos");
    if (fileInput) fileInput.value = "";

    renderPhotoPreview(listing && Array.isArray(listing.photos)
      ? listing.photos
      : []
    );

    form.hidden = false;

    const inbox = $("#alonLuxuryInbox");
    if (inbox) inbox.hidden = true;

    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeListingForm() {
    const form = getListingForm();
    if (!form) return;

    form.hidden = true;
    form.reset();
    renderPhotoPreview([]);
  }

  /* -------------------------------------------------------
     PHOTO PREVIEW
  ------------------------------------------------------- */

  function renderPhotoPreview(photos) {
    const preview = $("#alonLuxuryPhotoPreview");
    if (!preview) return;

    preview.innerHTML = "";

    (Array.isArray(photos) ? photos : []).forEach(function (photo) {
      if (!photo || !photo.dataUrl) return;

      const image = document.createElement("img");
      image.src = photo.dataUrl;
      image.alt = photo.name || "Luxury listing photo";
      image.loading = "lazy";
      image.className = "alon-luxury-preview-image";

      preview.appendChild(image);
    });
  }

  function readPhotoFile(file) {
    return new Promise(function (resolve, reject) {
      if (!file || !file.type || !file.type.startsWith("image/")) {
        reject(new Error("Please select image files only."));
        return;
      }

      const reader = new FileReader();

      reader.onload = function () {
        resolve({
          name: cleanText(file.name, 180),
          type: file.type,
          dataUrl: String(reader.result || "")
        });
      };

      reader.onerror = function () {
        reject(new Error("A photo could not be read."));
      };

      reader.readAsDataURL(file);
    });
  }

  async function readSelectedPhotos(form, existingPhotos) {
    const input = form.elements.namedItem("photos");
    const files = input && input.files
      ? Array.from(input.files)
      : [];

    if (!files.length) {
      return Array.isArray(existingPhotos) ? existingPhotos : [];
    }

    if (files.length > 8) {
      throw new Error("Please choose no more than 8 photos per listing.");
    }

    const maxBytesPerPhoto = 5 * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxBytesPerPhoto) {
        throw new Error(
          "Each photo must be 5 MB or smaller. Please resize large photos."
        );
      }
    }

    const newPhotos = await Promise.all(files.map(readPhotoFile));
    return newPhotos;
  }

  /* -------------------------------------------------------
     LISTING OWNERSHIP
     This is browser-local ownership, not secure authentication.
  ------------------------------------------------------- */

  function ownsListing(listing, user) {
    if (!listing || !user) return false;

    return String(listing.ownerId || "") === String(user.id || "");
  }

  function getListingById(id) {
    return getListings().find(function (listing) {
      return String(listing.id) === String(id);
    }) || null;
  }

  function normalizeListingData(data, oldListing, user, photos) {
    const category = getCategory(data.category);
    const action = ACTIONS.find(function (item) {
      return item.id === data.action;
    });

    if (!category) {
      throw new Error("Please select a valid category.");
    }

    if (!action) {
      throw new Error("Please select a valid listing type.");
    }

    const title = cleanText(data.title, 120);
    const description = cleanText(data.description, 5000);

    if (!title) throw new Error("Please enter a title.");
    if (!description) throw new Error("Please enter a description.");

    const country = cleanText(data.country, 100);
    if (!country) throw new Error("Please select a country.");

    let website = cleanText(data.website, 500);

    if (website) {
      try {
        const parsed = new URL(website);

        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          throw new Error("invalid protocol");
        }

        website = parsed.href;
      } catch (error) {
        throw new Error(
          "Please enter a valid website URL beginning with https:// or http://."
        );
      }
    }

    const whatsapp = cleanText(data.whatsapp, 30);

    return {
      id: oldListing ? oldListing.id : makeId("luxury"),
      ownerId: user.id,
      ownerName: cleanText(user.name || "Local Seller", 120),
      category: category.id,
      action: action.id,
      title: title,
      description: description,
      country: country,
      location: cleanText(data.location, 160),
      company: cleanText(data.company, 160),
      whatsapp: whatsapp,
      website: website,
      photos: Array.isArray(photos) ? photos : [],
      createdAt: oldListing ? oldListing.createdAt : Date.now(),
      updatedAt: Date.now()
    };
  }

  /* -------------------------------------------------------
     SAVE / UPDATE LISTING
  ------------------------------------------------------- */

  async function handleListingSubmit(event) {
    event.preventDefault();

    const form = getListingForm();
    if (!form) return;

    const user = getCurrentUser();

    if (!user) {
      notify("Please log in before creating a listing.");
      showLogin();
      return;
    }

    const listingId = getFormValue(form, "listingId");
    const oldListing = listingId ? getListingById(listingId) : null;

    if (listingId && !oldListing) {
      notify("This listing could not be found. Please refresh and try again.");
      return;
    }

    if (oldListing && !ownsListing(oldListing, user)) {
      notify("You can edit only your own listings.");
      return;
    }

    const data = {
      category: getFormValue(form, "category"),
      action: getFormValue(form, "action"),
      title: getFormValue(form, "title"),
      description: getFormValue(form, "description"),
      country: getFormValue(form, "country"),
      location: getFormValue(form, "location"),
      company: getFormValue(form, "company"),
      whatsapp: getFormValue(form, "whatsapp"),
      website: getFormValue(form, "website")
    };

    try {
      const photos = await readSelectedPhotos(
        form,
        oldListing ? oldListing.photos : []
      );

      const normalized = normalizeListingData(
        data,
        oldListing,
        user,
        photos
      );

      const listings = getListings();
      const existingIndex = listings.findIndex(function (item) {
        return item.id === normalized.id;
      });

      if (existingIndex >= 0) {
        listings[existingIndex] = normalized;
      } else {
        listings.unshift(normalized);
      }

      if (!saveListings(listings)) {
        notify(
          "The listing could not be saved. Browser storage may be full. " +
          "Try fewer or smaller photos."
        );
        return;
      }

      closeListingForm();
      renderListings();
      renderMyListings();

      notify(oldListing ? "Listing updated." : "Listing saved.");
    } catch (error) {
      console.error("[ALON Luxury] Save listing error:", error);
      notify(error && error.message
        ? error.message
        : "Could not save the listing. Please try again."
      );
    }
  }

  /* -------------------------------------------------------
     DELETE OWN LISTING
     Required confirmation wording is preserved exactly.
  ------------------------------------------------------- */

  function deleteListing(listingId) {
    const user = getCurrentUser();
    const listing = getListingById(listingId);

    if (!user) {
      notify("Please log in first.");
      showLogin();
      return;
    }

    if (!listing) {
      notify("Listing not found.");
      return;
    }

    if (!ownsListing(listing, user)) {
      notify("You can delete only your own listings.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    const updated = getListings().filter(function (item) {
      return item.id !== listingId;
    });

    if (!saveListings(updated)) {
      notify("Could not delete the listing. Please try again.");
      return;
    }

    const saved = readJSON(KEYS.saved, []);
    writeJSON(
      KEYS.saved,
      Array.isArray(saved)
        ? saved.filter(function (id) {
            return id !== listingId;
          })
        : []
    );

    renderListings();
    renderMyListings();
    renderSellerInbox();

    notify("Listing deleted.");
  }

  /* =======================================================
     PART 2 ENDS HERE.
     Continue directly with PART 3/3.
  ======================================================= *//* =======================================================
   ALON HISTORYVERSE 24
   LUXURY LIFESTYLE / BRAND PROMOTER
   VERSION 3.0.0 — PART 3/3
   Continue directly after PART 2.
======================================================= */

  /* -------------------------------------------------------
     LISTING CARDS AND CATEGORY FOLDERS
  ------------------------------------------------------- */

  function getListingCategoryLabel(categoryId) {
    const category = getCategory(categoryId);
    return category ? category.label : "Luxury Listing";
  }

  function getListingActionLabel(actionId) {
    const action = ACTIONS.find(function (item) {
      return item.id === actionId;
    });

    return action ? action.label : "Listing";
  }

  function getListingPhotos(listing) {
    return Array.isArray(listing.photos)
      ? listing.photos.filter(function (photo) {
          return photo && photo.dataUrl;
        })
      : [];
  }

  function createListingCard(listing, currentUser) {
    const card = document.createElement("article");
    card.className = "alon-luxury-listing-card";
    card.dataset.listingId = listing.id;

    const photos = getListingPhotos(listing);
    const image = photos.length
      ? `<img
           class="alon-luxury-card-image"
           src="${escapeHTML(photos[0].dataUrl)}"
           alt="${escapeHTML(listing.title)}"
           loading="lazy"
         >`
      : `<div class="alon-luxury-card-placeholder">
           <span>${escapeHTML(
             getCategory(listing.category)?.icon || "✦"
           )}</span>
         </div>`;

    const location = [
      listing.location,
      listing.country
    ].filter(Boolean).map(function (value) {
      return escapeHTML(value);
    }).join(", ");

    const owner = ownsListing(listing, currentUser);

    card.innerHTML = `
      ${image}

      <div class="alon-luxury-card-content">
        <div class="alon-luxury-card-tags">
          <span class="alon-luxury-tag">
            ${escapeHTML(getListingCategoryLabel(listing.category))}
          </span>

          <span class="alon-luxury-tag alon-luxury-action-tag">
            ${escapeHTML(getListingActionLabel(listing.action))}
          </span>
        </div>

        <h3>${escapeHTML(listing.title)}</h3>

        <p class="alon-luxury-card-description">
          ${escapeHTML(listing.description)}
        </p>

        ${
          location
            ? `<p class="alon-luxury-card-location">📍 ${location}</p>`
            : ""
        }

        ${
          listing.company
            ? `<p class="alon-luxury-card-company">
                 ${escapeHTML(listing.company)}
               </p>`
            : ""
        }

        <div class="alon-luxury-card-actions">
          <button
            type="button"
            class="alon-luxury-primary"
            data-alon-luxury-view="${escapeHTML(listing.id)}"
          >
            View Details
          </button>

          ${
            owner
              ? `
                <button
                  type="button"
                  class="alon-luxury-secondary"
                  data-alon-luxury-edit="${escapeHTML(listing.id)}"
                >Edit</button>

                <button
                  type="button"
                  class="alon-luxury-danger"
                  data-alon-luxury-delete="${escapeHTML(listing.id)}"
                >Delete</button>
              `
              : `
                <button
                  type="button"
                  class="alon-luxury-secondary"
                  data-alon-luxury-message="${escapeHTML(listing.id)}"
                >
                  Message Seller
                </button>

                <button
                  type="button"
                  class="alon-luxury-secondary"
                  data-alon-luxury-save="${escapeHTML(listing.id)}"
                >
                  Save Item
                </button>
              `
          }
        </div>
      </div>
    `;

    return card;
  }

  function renderListings() {
    const grid = $("#alonLuxuryListings");
    if (!grid) return;

    const user = getCurrentUser();
    const searchField = $("#alonLuxurySearch");
    const actionField = $("#alonLuxuryActionFilter");
    const categoryField = $("#alonLuxuryCategoryFilter");

    const query = searchField
      ? searchField.value.trim().toLowerCase()
      : "";

    const action = actionField ? actionField.value : "";
    const category = categoryField ? categoryField.value : "";

    const listings = getListings().filter(function (listing) {
      if (action && listing.action !== action) return false;
      if (category && listing.category !== category) return false;

      const searchable = [
        listing.title,
        listing.description,
        listing.company,
        listing.country,
        listing.location,
        getListingCategoryLabel(listing.category)
      ].join(" ").toLowerCase();

      return !query || searchable.includes(query);
    });

    grid.innerHTML = "";

    if (!listings.length) {
      grid.innerHTML = `
        <div class="alon-luxury-empty">
          <h3>No listings found</h3>
          <p>Try another category or search term, or create a listing.</p>
        </div>
      `;
      return;
    }

    listings.forEach(function (listing) {
      grid.appendChild(createListingCard(listing, user));
    });
  }

  function renderMyListings() {
    const container = $("#alonLuxuryMyListings");
    if (!container) return;

    const user = getCurrentUser();

    if (!user) {
      container.innerHTML = "<p>Please log in to view your listings.</p>";
      return;
    }

    const listings = getListings().filter(function (listing) {
      return ownsListing(listing, user);
    });

    container.innerHTML = "";

    if (!listings.length) {
      container.innerHTML = "<p>You have not created any listings yet.</p>";
      return;
    }

    listings.forEach(function (listing) {
      container.appendChild(createListingCard(listing, user));
    });
  }

  function renderCategoryFolders() {
    const container = $("#alonLuxuryCategories");
    if (!container) return;

    container.innerHTML = "";

    CATEGORIES.forEach(function (category) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "alon-luxury-category-card";
      button.dataset.alonLuxuryCategory = category.id;

      button.innerHTML = `
        <span class="alon-luxury-category-icon">
          ${escapeHTML(category.icon)}
        </span>
        <span>${escapeHTML(category.label)}</span>
      `;

      container.appendChild(button);
    });
  }

  /* -------------------------------------------------------
     ITEM DETAILS
  ------------------------------------------------------- */

  function showListingDetails(listingId) {
    const listing = getListingById(listingId);
    if (!listing) {
      notify("Listing not found.");
      return;
    }

    const photos = getListingPhotos(listing);
    const photoMarkup = photos.map(function (photo) {
      return `
        <img
          class="alon-luxury-detail-image"
          src="${escapeHTML(photo.dataUrl)}"
          alt="${escapeHTML(photo.name || listing.title)}"
          loading="lazy"
        >
      `;
    }).join("");

    const location = [
      listing.location,
      listing.country
    ].filter(Boolean).join(", ");

    const message = [
      "Title: " + listing.title,
      "Category: " + getListingCategoryLabel(listing.category),
      "Type: " + getListingActionLabel(listing.action),
      "Description: " + listing.description,
      location ? "Location: " + location : "",
      listing.company ? "Company: " + listing.company : "",
      listing.website ? "Website: " + listing.website : "",
      listing.whatsapp ? "WhatsApp: " + listing.whatsapp : ""
    ].filter(Boolean).join("\n");

    const dialog = document.createElement("dialog");
    dialog.className = "alon-luxury-detail-dialog";

    dialog.innerHTML = `
      <div class="alon-luxury-detail-content">
        <button
          type="button"
          class="alon-luxury-dialog-close"
          aria-label="Close details"
        >✕</button>

        <h2>${escapeHTML(listing.title)}</h2>

        <p class="alon-luxury-detail-meta">
          ${escapeHTML(getListingCategoryLabel(listing.category))}
          ·
          ${escapeHTML(getListingActionLabel(listing.action))}
        </p>

        <div class="alon-luxury-detail-photos">
          ${photoMarkup}
        </div>

        <p>${escapeHTML(listing.description)}</p>

        ${location
          ? `<p>📍 ${escapeHTML(location)}</p>`
          : ""}

        ${listing.company
          ? `<p><strong>Company:</strong>
               ${escapeHTML(listing.company)}</p>`
          : ""}

        ${listing.website
          ? `<p><strong>Website:</strong>
               <a
                 href="${escapeHTML(listing.website)}"
                 target="_blank"
                 rel="noopener noreferrer"
               >Visit Website</a>
             </p>`
          : ""}

        <div class="alon-luxury-detail-actions">
          <button
            type="button"
            class="alon-luxury-secondary"
            data-alon-luxury-copy-details
          >Copy Details</button>

          ${
            getCurrentUser() &&
            !ownsListing(listing, getCurrentUser())
              ? `
                <button
                  type="button"
                  class="alon-luxury-primary"
                  data-alon-luxury-message="${escapeHTML(listing.id)}"
                >Message Seller</button>
              `
              : ""
          }
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const closeButton = dialog.querySelector(
      ".alon-luxury-dialog-close"
    );

    closeButton.addEventListener("click", function () {
      dialog.close();
      dialog.remove();
    });

    const copyButton = dialog.querySelector(
      "[data-alon-luxury-copy-details]"
    );

    copyButton.addEventListener("click", async function () {
      try {
        await navigator.clipboard.writeText(message);
        notify("Listing details copied.");
      } catch (error) {
        notify("Copy is unavailable in this browser.");
      }
    });

    dialog.addEventListener("close", function () {
      dialog.remove();
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.showModal();
  }

  /* -------------------------------------------------------
     SAVED ITEMS
  ------------------------------------------------------- */

  function toggleSavedItem(listingId) {
    if (!getCurrentUser()) {
      notify("Please log in to save items.");
      showLogin();
      return;
    }

    if (!getListingById(listingId)) {
      notify("Listing not found.");
      return;
    }

    const saved = readJSON(KEYS.saved, []);
    const ids = Array.isArray(saved) ? saved : [];
    const index = ids.indexOf(listingId);

    if (index >= 0) {
      ids.splice(index, 1);
      writeJSON(KEYS.saved, ids);
      notify("Item removed from saved items.");
    } else {
      ids.push(listingId);

      if (!writeJSON(KEYS.saved, ids)) {
        notify("Could not save this item.");
        return;
      }

      notify("Item saved.");
    }
  }

  /* -------------------------------------------------------
     ITEM-SPECIFIC MESSAGES
     Messages are stored locally in this browser only.
  ------------------------------------------------------- */

  function getMessages() {
    const messages = readJSON(KEYS.messages, []);
    return Array.isArray(messages) ? messages : [];
  }

  function saveMessages(messages) {
    return writeJSON(KEYS.messages, messages);
  }

  function playIncomingMessageSound() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const now = context.currentTime;

      [0, 0.22].forEach(function (offset) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;

        gain.gain.setValueAtTime(0.0001, now + offset);
        gain.gain.exponentialRampToValueAtTime(
          0.12,
          now + offset + 0.025
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + offset + 0.15
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(now + offset);
        oscillator.stop(now + offset + 0.16);
      });

      window.setTimeout(function () {
        context.close().catch(function () {});
      }, 700);
    } catch (error) {
      console.warn("[ALON Luxury] Message sound unavailable.", error);
    }
  }

  function openSellerMessage(listingId) {
    const listing = getListingById(listingId);
    const user = getCurrentUser();

    if (!user) {
      notify("Please log in before messaging a seller.");
      showLogin();
      return;
    }

    if (!listing) {
      notify("Listing not found.");
      return;
    }

    if (ownsListing(listing, user)) {
      notify("This is your own listing.");
      return;
    }

    const dialog = document.createElement("dialog");
    dialog.className = "alon-luxury-message-dialog";

    dialog.innerHTML = `
      <form method="dialog" class="alon-luxury-message-content">
        <button
          type="button"
          class="alon-luxury-dialog-close"
          aria-label="Close message form"
        >✕</button>

        <h2>Message Seller</h2>
        <p><strong>${escapeHTML(listing.title)}</strong></p>

        <label>
          Your Message
          <textarea
            name="message"
            rows="5"
            maxlength="3000"
            required
            placeholder="Write your message here"
          ></textarea>
        </label>

        <button type="submit" class="alon-luxury-primary">
          Send Message
        </button>
      </form>
    `;

    document.body.appendChild(dialog);

    dialog.querySelector(".alon-luxury-dialog-close")
      .addEventListener("click", function () {
        dialog.close();
      });

    dialog.addEventListener("close", function () {
      dialog.remove();
    });

    dialog.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();

      const textarea = dialog.querySelector('textarea[name="message"]');
      const body = cleanText(textarea.value, 3000);

      if (!body) {
        notify("Please enter a message.");
        return;
      }

      const messages = getMessages();

      messages.push({
        id: makeId("message"),
        listingId: listing.id,
        listingTitle: listing.title,
        senderId: user.id,
        senderName: cleanText(user.name || "Local User", 120),
        recipientId: listing.ownerId,
        body: body,
        createdAt: Date.now(),
        read: false
      });

      if (!saveMessages(messages)) {
        notify("Message could not be saved. Browser storage may be full.");
        return;
      }

      dialog.close();
      renderSellerInbox();

      notify(
        "Message saved in this browser. Cross-device delivery requires a server."
      );
    });

    dialog.showModal();
  }

  function renderSellerInbox() {
    const inbox = $("#alonLuxuryInbox");
    if (!inbox) return;

    const user = getCurrentUser();

    if (!user) {
      inbox.innerHTML = "<p>Please log in to view your inbox.</p>";
      return;
    }

    const messages = getMessages().filter(function (message) {
      return message.recipientId === user.id ||
             message.senderId === user.id;
    }).sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    inbox.innerHTML = "";

    if (!messages.length) {
      inbox.innerHTML = "<p>No messages yet.</p>";
      return;
    }

    messages.forEach(function (message) {
      const incoming = message.recipientId === user.id;
      const card = document.createElement("article");

      card.className = "alon-luxury-message-card";

      card.innerHTML = `
        <p class="alon-luxury-message-direction">
          ${incoming ? "Incoming message" : "Sent message"}
        </p>

        <h3>${escapeHTML(message.listingTitle || "Luxury Listing")}</h3>

        <p>
          <strong>${incoming ? "From" : "To"}:</strong>
          ${escapeHTML(
            incoming
              ? message.senderName
              : getListingById(message.listingId)?.ownerName || "Seller"
          )}
        </p>

        <p>${escapeHTML(message.body)}</p>

        <small>
          ${escapeHTML(new Date(message.createdAt).toLocaleString())}
        </small>
      `;

      inbox.appendChild(card);
    });
  }

  /* -------------------------------------------------------
     NAVIGATION / FILTER CONTROLS
  ------------------------------------------------------- */

  function showSection(sectionName) {
    const form = $("#alonLuxuryListingForm");
    const inbox = $("#alonLuxuryInbox");
    const myListings = $("#alonLuxuryMyListings");
    const listings = $("#alonLuxuryListings");

    if (form) form.hidden = true;
    if (inbox) inbox.hidden = true;

    if (sectionName === "create") {
      openListingForm(null);
      return;
    }

    if (sectionName === "inbox") {
      if (inbox) {
        inbox.hidden = false;
        renderSellerInbox();
        inbox.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (sectionName === "mine") {
      if (myListings) {
        myListings.hidden = false;
        renderMyListings();
        myListings.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (myListings) myListings.hidden = true;

    if (listings) {
      listings.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleAppClick(event) {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.matches("[data-alon-luxury-cancel-form]")) {
      closeListingForm();
      return;
    }

    if (target.matches("[data-alon-luxury-edit]")) {
      const listing = getListingById(target.dataset.alonLuxuryEdit);
      if (!listing) {
        notify("Listing not found.");
        return;
      }

      if (!ownsListing(listing, getCurrentUser())) {
        notify("You can edit only your own listings.");
        return;
      }

      openListingForm(listing);
      return;
    }

    if (target.matches("[data-alon-luxury-delete]")) {
      deleteListing(target.dataset.alonLuxuryDelete);
      return;
    }

    if (target.matches("[data-alon-luxury-view]")) {
      showListingDetails(target.dataset.alonLuxuryView);
      return;
    }

    if (target.matches("[data-alon-luxury-message]")) {
      openSellerMessage(target.dataset.alonLuxuryMessage);
      return;
    }

    if (target.matches("[data-alon-luxury-save]")) {
      toggleSavedItem(target.dataset.alonLuxurySave);
      return;
    }

    if (target.matches("[data-alon-luxury-category]")) {
      const categoryFilter = $("#alonLuxuryCategoryFilter");

      if (categoryFilter) {
        categoryFilter.value = target.dataset.alonLuxuryCategory;
      }

      renderListings();

      const listings = $("#alonLuxuryListings");
      if (listings) {
        listings.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      return;
    }

    if (target.matches("[data-alon-luxury-show]")) {
      showSection(target.dataset.alonLuxuryShow);
    }
  }

  /* -------------------------------------------------------
     ADD SEARCH / FILTER / PERSONAL LISTS TO THE APP SHELL
  ------------------------------------------------------- */

  function ensureListingControls() {
    const app = $("#alonLuxuryLifestyleV3");
    if (!app) return;

    const workspace = $("#alonLuxuryWorkspace");
    if (!workspace) return;

    if (!$("#alonLuxurySearch")) {
      const filters = document.createElement("div");
      filters.className = "alon-luxury-filters";

      filters.innerHTML = `
        <input
          id="alonLuxurySearch"
          type="search"
          placeholder="Search luxury listings..."
          aria-label="Search luxury listings"
        >

        <select id="alonLuxuryActionFilter" aria-label="Filter by listing type">
          <option value="">All listing types</option>
          ${ACTIONS.map(function (item) {
            return `<option value="${escapeHTML(item.id)}">
              ${escapeHTML(item.label)}
            </option>`;
          }).join("")}
        </select>

        <select
          id="alonLuxuryCategoryFilter"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          ${CATEGORIES.map(function (item) {
            return `<option value="${escapeHTML(item.id)}">
              ${escapeHTML(item.label)}
            </option>`;
          }).join("")}
        </select>
      `;

      const grid = $("#alonLuxuryListings");
      if (grid) workspace.insertBefore(filters, grid);
      else workspace.appendChild(filters);
    }

    if (!$("#alonLuxuryMyListings")) {
      const mine = document.createElement("section");
      mine.id = "alonLuxuryMyListings";
      mine.className = "alon-luxury-listings-grid";
      mine.hidden = true;

      const grid = $("#alonLuxuryListings");
      if (grid && grid.parentNode) {
        grid.parentNode.insertBefore(mine, grid.nextSibling);
      } else {
        workspace.appendChild(mine);
      }
    }

    if (!$("#alonLuxuryCategories")) {
      const categories = document.createElement("section");
      categories.id = "alonLuxuryCategories";
      categories.className = "alon-luxury-categories-grid";

      const grid = $("#alonLuxuryListings");
      if (grid && grid.parentNode) {
        grid.parentNode.insertBefore(categories, grid);
      } else {
        workspace.appendChild(categories);
      }
    }

    if (!$("#alonLuxuryInbox")) {
      const inbox = document.createElement("section");
      inbox.id = "alonLuxuryInbox";
      inbox.className = "alon-luxury-inbox";
      inbox.hidden = true;
      workspace.appendChild(inbox);
    }
  }

  /* -------------------------------------------------------
     FINAL STYLES
  ------------------------------------------------------- */

  function installFinalStyles() {
    if ($("#alonLuxuryLifestyleV3FinalStyles")) return;

    const style = document.createElement("style");
    style.id = "alonLuxuryLifestyleV3FinalStyles";

    style.textContent = `
      #alonLuxuryLifestyleV3 .alon-luxury-filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
        margin: 18px 0;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-filters input,
      #alonLuxuryLifestyleV3 .alon-luxury-filters select,
      #alonLuxuryLifestyleV3 input,
      #alonLuxuryLifestyleV3 select,
      #alonLuxuryLifestyleV3 textarea,
      .alon-luxury-message-dialog textarea {
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
        padding: 11px;
        border: 1px solid #344054;
        border-radius: 9px;
        background: #0b1220;
        color: #f8fafc;
        font: inherit;
      }

      #alonLuxuryLifestyleV3 label,
      .alon-luxury-message-dialog label {
        display: block;
        margin: 12px 0;
        color: #f0d27a;
      }

      #alonLuxuryLifestyleV3 label input,
      #alonLuxuryLifestyleV3 label select,
      #alonLuxuryLifestyleV3 label textarea,
      .alon-luxury-message-dialog label textarea {
        margin-top: 6px;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
        gap: 10px;
        margin: 20px 0;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-category-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 90px;
        padding: 12px;
        border: 1px solid #65552d;
        border-radius: 12px;
        background: #101827;
        color: #f0d27a;
        cursor: pointer;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-category-icon {
        font-size: 24px;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-listings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin: 20px 0;
      }

      .alon-luxury-listing-card {
        overflow: hidden;
        border: 1px solid #65552d;
        border-radius: 14px;
        background: #0b1220;
        color: #f8fafc;
      }

      .alon-luxury-card-image,
      .alon-luxury-card-placeholder {
        display: flex;
        width: 100%;
        height: 190px;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        background: #151e2e;
      }

      .alon-luxury-card-placeholder span {
        color: #f0d27a;
        font-size: 48px;
      }

      .alon-luxury-card-content {
        padding: 14px;
      }

      .alon-luxury-card-content h3 {
        color: #f0d27a;
        overflow-wrap: anywhere;
      }

      .alon-luxury-card-description {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
      }

      .alon-luxury-card-tags,
      .alon-luxury-card-actions,
      .alon-luxury-form-actions,
      .alon-luxury-detail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }

      .alon-luxury-tag {
        display: inline-block;
        padding: 5px 8px;
        border-radius: 6px;
        background: #1b293b;
        color: #f0d27a;
        font-size: 12px;
      }

      #alonLuxuryLifestyleV3 button,
      .alon-luxury-detail-dialog button,
      .alon-luxury-message-dialog button {
        padding: 9px 12px;
        border: 1px solid #b99543;
        border-radius: 8px;
        cursor: pointer;
        font: inherit;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-primary,
      .alon-luxury-detail-dialog .alon-luxury-primary,
      .alon-luxury-message-dialog .alon-luxury-primary {
        background: #d7b35a;
        color: #111827;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-secondary,
      .alon-luxury-detail-dialog .alon-luxury-secondary,
      .alon-luxury-message-dialog .alon-luxury-secondary {
        background: #172235;
        color: #f0d27a;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-danger {
        border-color: #9f3b45;
        background: #3b1118;
        color: #ffd8dc;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-upload-note {
        color: #aab4c4;
        font-size: 13px;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-photo-preview,
      .alon-luxury-detail-photos {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 8px;
        margin: 12px 0;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-preview-image,
      .alon-luxury-detail-image {
        width: 100%;
        max-height: 180px;
        border-radius: 8px;
        object-fit: cover;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-empty,
      #alonLuxuryLifestyleV3 .alon-luxury-message-card {
        padding: 16px;
        border: 1px solid #344054;
        border-radius: 10px;
        background: #101827;
        color: #f8fafc;
      }

      #alonLuxuryLifestyleV3 .alon-luxury-empty h3,
      #alonLuxuryLifestyleV3 .alon-luxury-message-card h3 {
        color: #f0d27a;
      }

      .alon-luxury-detail-dialog,
      .alon-luxury-message-dialog {
        width: min(680px, calc(100% - 28px));
        max-height: 85vh;
        overflow: auto;
        border: 1px solid #b99543;
        border-radius: 16px;
        background: #05080f;
        color: #f8fafc;
      }

      .alon-luxury-detail-dialog::backdrop,
      .alon-luxury-message-dialog::backdrop {
        background: rgba(0, 0, 0, .75);
      }

      .alon-luxury-detail-content,
      .alon-luxury-message-content {
        position: relative;
        padding: 18px;
      }

      .alon-luxury-detail-content h2,
      .alon-luxury-message-content h2 {
        padding-right: 36px;
        color: #f0d27a;
      }

      .alon-luxury-dialog-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #172235;
        color: #f0d27a;
      }

      .alon-luxury-message-direction {
        color: #f0d27a;
        font-size: 12px;
      }

      @media (max-width: 520px) {
        #alonLuxuryLifestyleV3 .alon-luxury-listings-grid {
          grid-template-columns: 1fr;
        }

        .alon-luxury-card-actions button {
          flex: 1 1 auto;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /* -------------------------------------------------------
     EVENT BINDING
  ------------------------------------------------------- */

  function bindAppEvents() {
    const app = $("#alonLuxuryLifestyleV3");
    if (!app || app.dataset.alonLuxuryEventsBound === "yes") return;

    app.dataset.alonLuxuryEventsBound = "yes";

    app.addEventListener("click", handleAppClick);

    const form = getListingForm();

    if (form) {
      form.addEventListener("submit", handleListingSubmit);

      form.addEventListener("change", function (event) {
        if (!event.target.matches('input[name="photos"]')) return;

        const files = event.target.files
          ? Array.from(event.target.files)
          : [];

        if (!files.length) return;

        Promise.all(files.slice(0, 8).map(readPhotoFile))
          .then(renderPhotoPreview)
          .catch(function (error) {
            notify(error.message || "Could not preview photos.");
          });
      });
    }

    const search = $("#alonLuxurySearch");
    const actionFilter = $("#alonLuxuryActionFilter");
    const categoryFilter = $("#alonLuxuryCategoryFilter");

    if (search) {
      search.addEventListener("input", renderListings);
    }

    if (actionFilter) {
      actionFilter.addEventListener("change", renderListings);
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", renderListings);
    }

    const createButton = $("#alonLuxuryCreateListing");
    if (createButton) {
      createButton.addEventListener("click", function () {
        showSection("create");
      });
    }

    const inboxButton = $("#alonLuxuryOpenInbox");
    if (inboxButton) {
      inboxButton.addEventListener("click", function () {
        showSection("inbox");
      });
    }

    const mineButton = $("#alonLuxuryMyListingsButton");
    if (mineButton) {
      mineButton.addEventListener("click", function () {
        showSection("mine");
      });
    }
  }

  /* -------------------------------------------------------
     STARTUP
  ------------------------------------------------------- */

  function initializeLuxuryLifestyle() {
    installStyles();
    ensureAppShell();
    ensureListingFormFields();
    ensureListingControls();
    installFinalStyles();
    initializeCountrySelectors();
    renderCategoryFolders();
    bindAppEvents();

    const user = getCurrentUser();

    if (user) {
      showWorkspace();
      renderListings();
      renderMyListings();
      renderSellerInbox();
    } else {
      showLogin();
    }

    window.ALON_LUXURY_LIFESTYLE = {
      version: VERSION,
      getListings: getListings,
      renderListings: renderListings,
      renderMyListings: renderMyListings,
      renderSellerInbox: renderSellerInbox,
      openListingForm: openListingForm,
      deleteListing: deleteListing,
      showListingDetails: showListingDetails,
      openSellerMessage: openSellerMessage,
      toggleSavedItem: toggleSavedItem
    };

    window.ALON_LUXURY_LIFESTYLE_MESSAGES = {
      getMessages: getMessages,
      renderInbox: renderSellerInbox
    };

    console.info(
      "[ALON HISTORYVERSE 24] Luxury Lifestyle v" +
      VERSION +
      " initialized."
    );
  }

  /* -------------------------------------------------------
     SAFE INITIALIZATION
  ------------------------------------------------------- */

  try {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        initializeLuxuryLifestyle,
        { once: true }
      );
    } else {
      initializeLuxuryLifestyle();
    }
  } catch (error) {
    window.ALON_LUXURY_LIFESTYLE_V3_LOADING = false;

    console.error(
      "[ALON HISTORYVERSE 24] Luxury Lifestyle initialization failed:",
      error
    );
  }

})();