/* =========================================================
   ALON HISTORYVERSE 24
   FILE: js/login.js
   API LOGIN + SESSION VERIFICATION + LOGOUT
   ========================================================= */

(() => {
  "use strict";

  // Separate Marketplace API.
  // Do NOT replace this with the Owner/Admin Security Worker.
  const API_BASE_URL =
    "https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev";

  const KEYS = {
    user: "ALON_AUTH_USER",
    session: "ALON_AUTH_SESSION",
    token: "ALON_AUTH_TOKEN",
    location: "ALON_USER_LOCATION"
  };

  const $ = id => document.getElementById(id);

  const el = {
    country: $("country"),
    countryPreview: $("countryPreview"),
    email: $("email"),
    password: $("password"),
    mobile: $("mobile"),
    login: $("loginBtn"),
    clear: $("clearBtn"),
    passwordToggle: $("passwordToggle"),
    locationBtn: $("locationBtn"),
    locationStatus: $("locationStatus"),
    locationDetails: $("locationDetails"),
    message: $("loginMessage"),
    userBox: $("userBox"),
    formArea: $("loginFormArea"),
    logout: $("logoutBtn")
  };

  let busy = false;
  let sessionVerified = false;
  let currentLocation = null;

  /* ---------------------------------------------------------
     SAFE STORAGE
     --------------------------------------------------------- */

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (_) {
      showMessage("Browser storage उपलब्ध नहीं है।");
      return false;
    }
  }

  function readUser() {
    try {
      return JSON.parse(storageGet(KEYS.user) || "null");
    } catch (_) {
      return null;
    }
  }

  function getToken() {
    return storageGet(KEYS.token) || "";
  }

  function clearLocalSession() {
    try {
      localStorage.removeItem(KEYS.token);
      localStorage.removeItem(KEYS.session);
      localStorage.removeItem(KEYS.user);
    } catch (_) {}

    sessionVerified = false;

    if (el.userBox) el.userBox.classList.remove("show");
    if (el.formArea) el.formArea.style.display = "block";
  }

  /* ---------------------------------------------------------
     MESSAGE
     --------------------------------------------------------- */

  function showMessage(message) {
    if (!el.message) {
      console.log("[ALON LOGIN]", message);
      return;
    }

    el.message.textContent = message;
    el.message.classList.add("show");
  }

  function hideMessage() {
    if (!el.message) return;

    el.message.textContent = "";
    el.message.classList.remove("show");
  }

  /* ---------------------------------------------------------
     COUNTRY LIST
     Reuses the existing COUNTRIES array from your HTML.
     Expected item format: [flag, name, callingCode, ISOCode]
     --------------------------------------------------------- */

  function getCountries() {
    return Array.isArray(window.ALON_COUNTRIES)
      ? window.ALON_COUNTRIES
      : [];
  }

  function loadCountries() {
    if (!el.country) return;

    const countries = getCountries();

    // Keep an existing populated select if the HTML already
    // provides its options.
    if (el.country.options.length > 1) return;

    if (!countries.length) {
      showMessage(
        "Country list नहीं मिली। HTML में window.ALON_COUNTRIES सेट करें।"
      );
      return;
    }

    el.country.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select Country / देश चुनें";
    el.country.appendChild(placeholder);

    countries.forEach(item => {
      const option = document.createElement("option");

      option.value = item[3];
      option.textContent =
        `${item[0]} ${item[1]} (${item[2]})`;

      option.dataset.flag = item[0];
      option.dataset.name = item[1];
      option.dataset.code = item[2];

      el.country.appendChild(option);
    });
  }

  function selectedCountry() {
    const code = el.country?.value;
    return getCountries().find(item => item[3] === code) || null;
  }

  el.country?.addEventListener("change", () => {
    const country = selectedCountry();

    if (el.countryPreview) {
      el.countryPreview.textContent = country
        ? `${country[0]} ${country[1]} • Calling Code ${country[2]}`
        : "Select your country";
    }
  });

  /* ---------------------------------------------------------
     PASSWORD VISIBILITY
     --------------------------------------------------------- */

  el.passwordToggle?.addEventListener("click", () => {
    if (!el.password) return;

    const show = el.password.type === "password";
    el.password.type = show ? "text" : "password";

    el.passwordToggle.textContent = show ? "🙈" : "👁";
    el.passwordToggle.setAttribute(
      "aria-label",
      show ? "Hide password" : "Show password"
    );
  });

  /* ---------------------------------------------------------
     API REQUEST
     --------------------------------------------------------- */

  async function apiRequest(path, options = {}, authenticated = false) {
    const headers = new Headers(options.headers || {});

    headers.set("Accept", "application/json");

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (authenticated) {
      const token = getToken();

      if (!token) {
        const error = new Error("Session नहीं मिला। दोबारा Login करें।");
        error.status = 401;
        throw error;
      }

      headers.set("Authorization", `Bearer ${token}`);
    }

    let response;

    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        cache: "no-store",
        credentials: "omit"
      });
    } catch (_) {
      throw new Error(
        "API connection failed. Worker URL, deployment और CORS जाँचें।"
      );
    }

    let data;

    try {
      data = await response.json();
    } catch (_) {
      throw new Error(
        `API ने सही JSON response नहीं दिया (HTTP ${response.status}).`
      );
    }

    if (!response.ok || data.ok === false) {
      const error = new Error(
        data.message ||
        data.error ||
        `API request failed (HTTP ${response.status}).`
      );

      error.status = response.status;
      error.code = data.code || "";
      throw error;
    }

    return data;
  }

  /* ---------------------------------------------------------
     FORM VALIDATION
     --------------------------------------------------------- */

  function validateForm() {
    const email = el.email?.value.trim() || "";
    const password = el.password?.value || "";
    const mobile = (el.mobile?.value || "").replace(/\D/g, "");

    if (!email) {
      showMessage("अपना email दर्ज करें।");
      el.email?.focus();
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMessage("सही email address दर्ज करें।");
      el.email?.focus();
      return false;
    }

    if (!password) {
      showMessage("अपना password दर्ज करें।");
      el.password?.focus();
      return false;
    }

    if (!selectedCountry()) {
      showMessage("अपना country चुनें।");
      el.country?.focus();
      return false;
    }

    if (mobile.length < 6 || mobile.length > 15) {
      showMessage("सही mobile number दर्ज करें।");
      el.mobile?.focus();
      return false;
    }

    return true;
  }

  /* ---------------------------------------------------------
     USER PROFILE
     API user ID and email remain authoritative.
     Country/mobile are page profile fields; they are not
     claimed to be saved to the server by this login endpoint.
     --------------------------------------------------------- */

  function buildUser(apiUser, previous = null) {
    if (!apiUser || !apiUser.id || !apiUser.email) {
      throw new Error("API response में valid user details नहीं मिलीं।");
    }

    const email = String(apiUser.email).trim().toLowerCase();

    const sameUser =
      previous &&
      String(previous.email || "").trim().toLowerCase() === email;

    const countryItem = selectedCountry();

    const country = countryItem
      ? {
          name: countryItem[1],
          flag: countryItem[0],
          callingCode: countryItem[2],
          code: countryItem[3]
        }
      : sameUser
        ? previous.country || null
        : null;

    let location = sameUser ? previous.location || null : null;

    if (currentLocation) {
      location = currentLocation;
    }

    return {
      id: apiUser.id,
      userId: apiUser.id,
      email,
      displayName: apiUser.displayName || email.split("@")[0],
      mobile: sameUser
        ? previous.mobile || ""
        : (el.mobile?.value || "").replace(/\D/g, ""),
      country,
      location,
      createdAt: apiUser.createdAt || null,
      loggedInAt: new Date().toISOString()
    };
  }

  function saveSession(apiUser, token) {
    if (!token) {
      throw new Error("API ने session token नहीं भेजा।");
    }

    const user = buildUser(apiUser, readUser());

    if (!storageSet(KEYS.user, JSON.stringify(user))) {
      throw new Error("User details browser storage में save नहीं हो सकीं।");
    }

    if (!storageSet(KEYS.token, token)) {
      throw new Error("Session token browser storage में save नहीं हुआ।");
    }

    storageSet(KEYS.session, "true");

    sessionVerified = true;
    displayUser(user);

    return user;
  }

  /* ---------------------------------------------------------
     DISPLAY AUTHENTICATED USER
     --------------------------------------------------------- */

  function displayUser(user) {
    if (el.formArea) el.formArea.style.display = "none";
    if (el.userBox) el.userBox.classList.add("show");

    const setText = (id, value) => {
      const node = $(id);
      if (node) node.textContent = value || "Not available";
    };

    setText("displayUserId", user.userId || user.id);
    setText("displayEmail", user.email);

    const country = user.country || {};

    setText(
      "displayMobile",
      `${country.callingCode || ""} ${user.mobile || ""}`.trim()
    );

    setText(
      "displayCountry",
      `${country.flag || ""} ${country.name || ""}`.trim()
    );

    const location = user.location;

    setText(
      "displayLocation",
      location &&
      Number.isFinite(Number(location.latitude)) &&
      Number.isFinite(Number(location.longitude))
        ? `${location.latitude}, ${location.longitude}`
        : "Not available"
    );
  }

  /* ---------------------------------------------------------
     LOGIN API
     POST /api/auth/login
     --------------------------------------------------------- */

  async function loginUser() {
    if (busy) return;

    hideMessage();

    if (!validateForm()) return;

    busy = true;

    if (el.login) {
      el.login.disabled = true;
      el.login.textContent = "Connecting to API...";
    }

    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: el.email.value.trim().toLowerCase(),
          password: el.password.value
        })
      });

      if (!result.user || !result.token) {
        throw new Error("Login response अधूरा है: user/token नहीं मिला।");
      }

      saveSession(result.user, result.token);

      showMessage("Login successful — API session verified.");
    } catch (error) {
      sessionVerified = false;
      showMessage(`Login नहीं हुआ: ${error.message}`);
    } finally {
      busy = false;

      if (el.login) {
        el.login.disabled = false;
        el.login.textContent = "🔐 Login / लॉगिन";
      }
    }
  }

  /* ---------------------------------------------------------
     VERIFY SESSION API
     GET /api/auth/session
     --------------------------------------------------------- */

  async function verifySession() {
    const token = getToken();

    if (!token) {
      clearLocalSession();
      return false;
    }

    try {
      const result = await apiRequest(
        "/api/auth/session",
        { method: "GET" },
        true
      );

      if (!result.user) {
        throw new Error("Session response में user नहीं मिला।");
      }

      const user = buildUser(result.user, readUser());

      storageSet(KEYS.user, JSON.stringify(user));
      storageSet(KEYS.session, "true");

      sessionVerified = true;
      displayUser(user);

      return true;
    } catch (error) {
      if (error.status === 401) {
        clearLocalSession();
        showMessage("Session expire हो गया। फिर से Login करें।");
      } else {
        // Do not claim the session is verified when API is down.
        sessionVerified = false;
        if (el.userBox) el.userBox.classList.remove("show");
        if (el.formArea) el.formArea.style.display = "block";

        showMessage(`Session verify नहीं हुआ: ${error.message}`);
      }

      return false;
    }
  }

  /* ---------------------------------------------------------
     LOGOUT API
     POST /api/auth/logout
     --------------------------------------------------------- */

  async function logoutUser() {
    if (busy) return;

    busy = true;

    if (el.logout) el.logout.disabled = true;

    try {
      if (getToken()) {
        await apiRequest(
          "/api/auth/logout",
          { method: "POST" },
          true
        );
      }

      clearLocalSession();
      showMessage("Logout successful.");
    } catch (error) {
      // Keep the token if the server has not confirmed logout.
      showMessage(`Server logout confirm नहीं हुआ: ${error.message}`);
    } finally {
      busy = false;
      if (el.logout) el.logout.disabled = false;
    }
  }

  /* ---------------------------------------------------------
     LIVE LOCATION
     --------------------------------------------------------- */

  function detectLocation() {
    hideMessage();

    if (!navigator.geolocation) {
      if (el.locationStatus) {
        el.locationStatus.textContent = "Location supported नहीं है।";
      }
      return;
    }

    if (el.locationStatus) {
      el.locationStatus.textContent = "Location detect हो रही है...";
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        currentLocation = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date().toISOString()
        };

        storageSet(KEYS.location, JSON.stringify(currentLocation));

        if (el.locationStatus) {
          el.locationStatus.textContent = "Live location detected.";
        }

        if (el.locationDetails) {
          el.locationDetails.textContent =
            `Latitude: ${currentLocation.latitude} | ` +
            `Longitude: ${currentLocation.longitude} | ` +
            `Accuracy: approximately ${currentLocation.accuracy} m`;
        }
      },
      error => {
        currentLocation = null;

        if (el.locationStatus) {
          el.locationStatus.textContent =
            error.code === 1
              ? "Location permission denied."
              : "Location could not be detected.";
        }

        if (el.locationDetails) {
          el.locationDetails.textContent =
            "Browser settings में location permission जाँचें।";
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  /* ---------------------------------------------------------
     CLEAR FORM
     --------------------------------------------------------- */

  function clearForm() {
    if (el.email) el.email.value = "";
    if (el.password) el.password.value = "";
    if (el.mobile) el.mobile.value = "";
    if (el.country) el.country.value = "";

    if (el.countryPreview) {
      el.countryPreview.textContent = "Select your country";
    }

    currentLocation = null;

    if (el.locationStatus) {
      el.locationStatus.textContent = "Location not detected";
    }

    if (el.locationDetails) {
      el.locationDetails.textContent =
        "Your browser will ask for location permission.";
    }

    hideMessage();
  }

  /* ---------------------------------------------------------
     BUTTON EVENTS
     --------------------------------------------------------- */

  el.login?.addEventListener("click", loginUser);
  el.logout?.addEventListener("click", logoutUser);
  el.clear?.addEventListener("click", clearForm);
  el.locationBtn?.addEventListener("click", detectLocation);

  [el.email, el.password, el.mobile].forEach(input => {
    input?.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        loginUser();
      }
    });
  });

  /* ---------------------------------------------------------
     PUBLIC AUTH HELPER
     Other page scripts may call window.ALON_AUTH.
     --------------------------------------------------------- */

  window.ALON_AUTH = {
    getUser: readUser,

    getUserId() {
      const user = readUser();
      return user ? user.userId || user.id || null : null;
    },

    getToken,

    isLoggedIn() {
      return sessionVerified &&
        storageGet(KEYS.session) === "true" &&
        Boolean(getToken());
    },

    verifySession,

    logout: logoutUser
  };

  /* ---------------------------------------------------------
     STARTUP
     --------------------------------------------------------- */

  loadCountries();
  verifySession();

})();