/* =========================================================
   ALON HISTORYVERSE 24
   GLOBAL MARKETPLACE ENGINE
   Version: 25.0 GLOBAL API INTEGRATION
   Creator: Baba Thecno Guru

   Login / Register / Session / Logout: Marketplace API
   Business Ads: Shared API records
   Views and Country Counts: API-backed
   No Like / Dislike
   ========================================================= */

(function () {
    "use strict";

    const CONFIG = {
        version: "25.0",
        marketplace: "global",
        kind: "showroom",
        tokenKey: "alon_marketplace_api_token",
        userKey: "alon_marketplace_api_user",
        apiBase: (
            window.ALON_MARKETPLACE_API_BASE ||
            "https://alon-historyverse-marketplace-api.bthecnoguru.workers.dev"
        ).replace(/\/+$/, ""),
        maxImageSize: 8 * 1024 * 1024,
        maxVideoSize: 40 * 1024 * 1024
    };

    const $ = id => document.getElementById(id);

    let currentUser = null;
    let ads = [];
    let countryNames = new Map();
    let viewedThisPage = new Set();
    let busy = false;

    function token() {
        return localStorage.getItem(CONFIG.tokenKey) || "";
    }

    function saveSession(data) {
        if (data.token) {
            localStorage.setItem(CONFIG.tokenKey, data.token);
        }
        if (data.user) {
            localStorage.setItem(CONFIG.userKey, JSON.stringify(data.user));
            currentUser = data.user;
        }
    }

    function clearSession() {
        localStorage.removeItem(CONFIG.tokenKey);
        localStorage.removeItem(CONFIG.userKey);
        currentUser = null;
    }

    function status(id, message, success = false) {
        const el = $(id);
        if (!el) return;
        el.textContent = message || "";
        el.classList.toggle("show", !!message);
        el.dataset.status = success ? "success" : "error";
    }

    async function api(path, options = {}) {
        const headers = new Headers(options.headers || {});
        headers.set("Accept", "application/json");

        if (options.body && !(options.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        if (token()) {
            headers.set("Authorization", "Bearer " + token());
        }

        const response = await fetch(CONFIG.apiBase + path, {
            ...options,
            headers,
            cache: "no-store"
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
            const error = new Error(
                data.message || data.error ||
                "Request failed. Check the Marketplace API configuration."
            );
            error.status = response.status;
            throw error;
        }

        return data;
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function setLoggedInUI(loggedIn) {
        const loginBox = $("marketplaceLoginBox");
        const profileBox = $("marketplaceProfileBox");
        const protectedAreas = [
            "createAd", "myAds", "marketplaceSearchSection",
            "marketplaceCountrySection", "productsSection",
            "servicesSection", "jobsSection"
        ];

        if (loginBox) loginBox.style.display = loggedIn ? "none" : "";
        if (profileBox) profileBox.style.display = loggedIn ? "" : "none";

        protectedAreas.forEach(id => {
            const el = $(id);
            if (el) el.classList.toggle("marketplace-hidden", !loggedIn);
        });

        if (loggedIn) {
            const email = $("marketplaceProfileEmail");
            if (email) email.textContent = currentUser?.email || "";
        }
    }

    async function restoreSession() {
        if (!token()) {
            setLoggedInUI(false);
            return false;
        }

        try {
            const data = await api("/api/auth/session");
            currentUser = data.user || null;
            if (currentUser) {
                localStorage.setItem(CONFIG.userKey, JSON.stringify(currentUser));
                setLoggedInUI(true);
                return true;
            }
        } catch (_) {
            clearSession();
        }

        setLoggedInUI(false);
        return false;
    }

    async function login() {
        const email = $("marketplaceLoginEmail")?.value.trim().toLowerCase() || "";
        const password = $("marketplaceLoginPassword")?.value || "";

        if (!email || !password) {
            status("marketplaceLoginStatus", "Enter your email and password.");
            return;
        }

        try {
            status("marketplaceLoginStatus", "Logging in…");
            const data = await api("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            saveSession(data);
            setLoggedInUI(true);
            status("marketplaceLoginStatus", "Login successful.", true);
            await loadMarketplace();
        } catch (error) {
            status("marketplaceLoginStatus", error.message);
        }
    }

    async function register() {
        const name = $("marketplaceRegisterName")?.value.trim() || "";
        const email = $("marketplaceRegisterEmail")?.value.trim().toLowerCase() || "";
        const password = $("marketplaceRegisterPassword")?.value || "";
        const termsAccepted = !!$("marketplaceTermsAccepted")?.checked;

        if (!email || !password) {
            status("marketplaceRegisterStatus", "Enter your email and password.");
            return;
        }

        if (!termsAccepted) {
            status("marketplaceRegisterStatus", "Please accept the Terms first.");
            return;
        }

        try {
            status("marketplaceRegisterStatus", "Creating account…");
            const data = await api("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    displayName: name,
                    email,
                    password,
                    termsAccepted: true
                })
            });

            saveSession(data);
            setLoggedInUI(true);
            status("marketplaceRegisterStatus", "Account created successfully.", true);
            await loadMarketplace();
        } catch (error) {
            status("marketplaceRegisterStatus", error.message);
        }
    }

    async function logout() {
        try {
            if (token()) {
                await api("/api/auth/logout", { method: "POST" });
            }
        } catch (_) {
            // Clear the local session even if the network is unavailable.
        }

        clearSession();
        ads = [];
        renderAds([]);
        setLoggedInUI(false);
        status("marketplaceLoginStatus", "You have logged out.", true);
    }

    function getCountryName(code) {
        if (!code) return "Unknown";
        return countryNames.get(String(code).toUpperCase()) || String(code);
    }

    function initCountries() {
        const countries = [
            window.MARKETPLACE_COUNTRIES,
            window.ALON_MARKETPLACE_COUNTRIES,
            window.ALON_WORLD_COUNTRIES,
            window.WORLD_COUNTRIES
        ].find(list => Array.isArray(list) && list.length) || [];

        countries.forEach(country => {
            const code = country.iso2 || country.code2 || country.code || "";
            const name = country.name || country.country || "";
            if (code && name) countryNames.set(String(code).toUpperCase(), name);
        });

        ["country", "adCountry"].forEach(id => {
            const select = $(id);
            if (!select || select.options.length > 1) return;

            countries.forEach(country => {
                const code = country.iso2 || country.code2 || country.code || "";
                const name = country.name || country.country || "";
                if (!code || !name) return;

                const option = document.createElement("option");
                option.value = code;
                option.textContent = `${country.flag || "🌍"} ${name}`;
                select.appendChild(option);
            });
        });
    }

    async function uploadMedia(file, label) {
        if (!file) return "";

        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo ? CONFIG.maxVideoSize : CONFIG.maxImageSize;

        if (file.size > maxSize) {
            throw new Error(
                `${label} is too large. Maximum allowed size is ${Math.round(maxSize / 1024 / 1024)} MB.`
            );
        }

        const form = new FormData();
        form.append("file", file);
        form.append("marketplace", CONFIG.marketplace);

        const data = await api("/api/media", {
            method: "POST",
            body: form
        });

        if (!data.url) throw new Error("Media upload did not return a URL.");
        return data.url;
    }

    async function saveAdvertisement(event) {
        event.preventDefault();
        if (!token() || busy) return;

        const title = $("adTitle")?.value.trim() || "";
        const businessName = $("businessName")?.value.trim() || "";
        const category = $("adCategory")?.value || "business";
        const description = $("adDescription")?.value.trim() || "";
        const countryCode = $("adCountry")?.value || "";
        const countryName = getCountryName(countryCode);
        const state = $("adState")?.value.trim() || "";
        const city = $("adCity")?.value.trim() || "";
        const price = $("adPrice")?.value.trim() || "";
        const currency = $("adCurrency")?.value || "USD";
        const offer = $("adOffer")?.value.trim() || "";
        const phone = $("adPhone")?.value.trim() || "";
        const email = $("adEmail")?.value.trim() || "";
        const website = $("adWebsite")?.value.trim() || "";
        const social = $("adSocial")?.value.trim() || "";
        const videoURL = $("adVideoURL")?.value.trim() || "";
        const editingId = $("editingAdId")?.value || "";

        if (!title || !countryCode) {
            status("marketplaceAdStatus", "Enter an advertisement title and select a country.");
            return;
        }

        if (website && !/^https:\/\//i.test(website)) {
            status("marketplaceAdStatus", "Website links must start with https://.");
            return;
        }

        if (social && !/^https:\/\//i.test(social)) {
            status("marketplaceAdStatus", "Business links must start with https://.");
            return;
        }

        if (videoURL && !/^https:\/\//i.test(videoURL)) {
            status("marketplaceAdStatus", "Video links must start with https://.");
            return;
        }

        busy = true;
        const saveButton = $("saveAdButton");
        if (saveButton) saveButton.disabled = true;

        try {
            status("marketplaceAdStatus", "Saving advertisement…");

            const images = [];
            const imageFiles = Array.from($("adImages")?.files || []);
            for (const file of imageFiles) {
                images.push(await uploadMedia(file, "Image"));
            }

            let video = videoURL;
            const videoFile = $("adVideo")?.files?.[0];
            if (videoFile) video = await uploadMedia(videoFile, "Video");

            const record = {
                title,
                businessName,
                name: businessName || title,
                category,
                description,
                country: { name: countryName, iso2: countryCode },
                countryCode,
                state,
                city,
                price,
                currency,
                offer,
                images,
                video,
                phone,
                email,
                website,
                social,
                status: "active"
            };

            const path = "/api/marketplace/records/showroom?marketplace=global";
            const data = await api(
                editingId ? path + "/" + encodeURIComponent(editingId) : path,
                {
                    method: editingId ? "PUT" : "POST",
                    body: JSON.stringify({ record })
                }
            );

            $("editingAdId").value = "";
            $("advertisementForm")?.reset();
            status("marketplaceAdStatus", "Advertisement saved.", true);

            await loadMarketplace();
            if (data.record?.id) {
                await recordView(data.record.id);
            }
        } catch (error) {
            status("marketplaceAdStatus", error.message);
        } finally {
            busy = false;
            if (saveButton) saveButton.disabled = false;
        }
    }

    async function loadMarketplace() {
        if (!token()) return;

        try {
            const params = new URLSearchParams();
            params.set("marketplace", CONFIG.marketplace);

            const data = await api(
                "/api/marketplace/records/showroom?" + params.toString()
            );

            ads = Array.isArray(data.records) ? data.records : [];
            renderAds(filterAds(ads));
        } catch (error) {
            const list = $("globalAdsList");
            if (list) {
                list.textContent = "Unable to load advertisements: " + error.message;
            }
        }
    }

    function filterAds(records) {
        const search = ($("marketplaceSearch")?.value || "").trim().toLowerCase();
        const country = $("country")?.value || "";
        const category = $("marketplaceCategory")?.value || "";

        return records.filter(ad => {
            const text = [
                ad.title, ad.businessName, ad.name,
                ad.description, ad.category, ad.city,
                ad.state, ad.country?.name
            ].join(" ").toLowerCase();

            const adCountry = ad.countryCode || ad.country?.iso2 || "";
            return (!search || text.includes(search)) &&
                (!country || adCountry.toUpperCase() === country.toUpperCase()) &&
                (!category || ad.category === category);
        });
    }

    async function recordView(id) {
        if (!token() || !id || viewedThisPage.has(id)) return;
        viewedThisPage.add(id);

        try {
            await api("/api/marketplace/views", {
                method: "POST",
                body: JSON.stringify({
                    marketplace: CONFIG.marketplace,
                    kind: CONFIG.kind,
                    recordId: id
                })
            });
        } catch (error) {
            // View counts require the matching Worker route and D1 tables.
            console.warn("Global Marketplace view count unavailable:", error.message);
        }
    }

    function renderAds(records) {
        const list = $("globalAdsList");
        const myList = $("myAdsList");
        if (!list) return;

        list.replaceChildren();
        if (myList) myList.replaceChildren();

        if (!records.length) {
            list.textContent = "No business advertisements available yet.";
            if (myList) myList.textContent = "No advertisements created yet.";
            return;
        }

        records.forEach(ad => {
            const card = document.createElement("article");
            card.className = "ah-card marketplace-ad-card";

            const images = Array.isArray(ad.images) ? ad.images : [];
            const media = images.map(url =>
                `<img loading="lazy" src="${escapeHTML(url)}" alt="${escapeHTML(ad.title)}">`
            ).join("");

            const video = ad.video
                ? (String(ad.video).startsWith("https://")
                    ? `<video controls preload="none" src="${escapeHTML(ad.video)}"></video>`
                    : "")
                : "";

            const views = Number(ad.viewCount || ad.views || 0);
            const countries = Number(ad.countryCount || ad.countriesViewed || 0);
            const ownerId = ad.ownerId || ad.owner_id || "";
            const mine = currentUser && ownerId && currentUser.id === ownerId;

            card.innerHTML = `
                <div class="marketplace-media-preview">${media}${video}</div>
                <h3>${escapeHTML(ad.title || ad.name || "Business Advertisement")}</h3>
                <p><strong>Business:</strong> ${escapeHTML(ad.businessName || ad.name || "")}</p>
                <p><strong>Category:</strong> ${escapeHTML(ad.category || "business")}</p>
                <p>${escapeHTML(ad.description || "")}</p>
                <p><strong>Location:</strong> ${escapeHTML([
                    ad.city, ad.state, ad.country?.name || getCountryName(ad.countryCode || ad.country?.iso2)
                ].filter(Boolean).join(", "))}</p>
                ${ad.price ? `<p><strong>Price:</strong> ${escapeHTML(ad.price)} ${escapeHTML(ad.currency || "")}</p>` : ""}
                ${ad.offer ? `<p><strong>Offer:</strong> ${escapeHTML(ad.offer)}</p>` : ""}
                ${ad.website ? `<p><strong>Website:</strong> <a href="${escapeHTML(ad.website)}" target="_blank" rel="noopener noreferrer">Visit</a></p>` : ""}
                ${ad.social ? `<p><strong>Business link:</strong> <a href="${escapeHTML(ad.social)}" target="_blank" rel="noopener noreferrer">Open</a></p>` : ""}
                <div class="marketplace-counts">
                    <span>Views: <strong>${views}</strong></span>
                    <span>Countries: <strong>${countries}</strong></span>
                </div>
                ${mine ? `<div class="marketplace-ad-actions">
                    <button type="button" data-edit-ad="${escapeHTML(ad.id)}">Edit</button>
                    <button type="button" data-delete-ad="${escapeHTML(ad.id)}">Delete</button>
                </div>` : ""}
            `;

            list.appendChild(card);

            if (mine && myList) myList.appendChild(card.cloneNode(true));
        });

        if (myList && !myList.children.length) {
            myList.textContent = "No advertisements created by this account.";
        }

        records.forEach(ad => {
            if (!viewedThisPage.has(ad.id)) recordView(ad.id);
        });
    }

    function editAd(id) {
        const ad = ads.find(item => item.id === id);
        if (!ad || !currentUser || ad.ownerId !== currentUser.id) return;

        $("editingAdId").value = ad.id;
        $("adTitle").value = ad.title || "";
        $("businessName").value = ad.businessName || ad.name || "";
        $("adCategory").value = ad.category || "business";
        $("adDescription").value = ad.description || "";
        $("adCountry").value = ad.countryCode || ad.country?.iso2 || "";
        $("adState").value = ad.state || "";
        $("adCity").value = ad.city || "";
        $("adPrice").value = ad.price || "";
        $("adCurrency").value = ad.currency || "USD";
        $("adOffer").value = ad.offer || "";
        $("adPhone").value = ad.phone || "";
        $("adEmail").value = ad.email || "";
        $("adWebsite").value = ad.website || "";
        $("adSocial").value = ad.social || "";
        $("adVideoURL").value = ad.video || "";

        window.location.hash = "createAd";
    }

    async function deleteAd(id) {
        const ad = ads.find(item => item.id === id);
        if (!ad || !currentUser || ad.ownerId !== currentUser.id) return;
        if (!window.confirm("Delete this advertisement?")) return;

        try {
            await api(
                "/api/marketplace/records/showroom/" +
                encodeURIComponent(id) + "?marketplace=global",
                { method: "DELETE" }
            );
            await loadMarketplace();
        } catch (error) {
            status("marketplaceAdStatus", error.message);
        }
    }

    function bindEvents() {
        $("marketplaceLoginButton")?.addEventListener("click", login);
        $("marketplaceRegisterButton")?.addEventListener("click", register);
        $("marketplaceLogoutButton")?.addEventListener("click", logout);
        $("advertisementForm")?.addEventListener("submit", saveAdvertisement);

        $("marketplaceSearchForm")?.addEventListener("submit", event => {
            event.preventDefault();
            renderAds(filterAds(ads));
        });

        $("country")?.addEventListener("change", () => renderAds(filterAds(ads)));
        $("marketplaceCategory")?.addEventListener("change", () => renderAds(filterAds(ads)));

        document.addEventListener("click", event => {
            const edit = event.target.closest("[data-edit-ad]");
            if (edit) {
                editAd(edit.dataset.editAd);
                return;
            }

            const del = event.target.closest("[data-delete-ad]");
            if (del) deleteAd(del.dataset.deleteAd);
        });
    }

    async function init() {
        initCountries();
        bindEvents();
        setLoggedInUI(false);

        const loggedIn = await restoreSession();
        if (loggedIn) await loadMarketplace();
    }

    window.ALON_GLOBAL_MARKETPLACE = {
        version: CONFIG.version,
        load: loadMarketplace,
        login,
        register,
        logout,
        getAds: () => ads.slice()
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();