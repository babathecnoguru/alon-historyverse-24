/*
============================================================
 ALON HISTORYVERSE 24
 LUXURY LIFESTYLE / BRAND PROMOTER
 File: luxury-lifestyle.js
 Version: 2.0.0
 Owner: Baba Thecno Guru

 IMPORTANT
 ------------------------------------------------------------
 1. This system is separate from Marketplace and Jobs.
 2. marketplace-countries.js is READ-ONLY.
 3. Existing Marketplace/Jobs files are NOT modified.
 4. No payment is processed by this frontend.
 5. Real high-value transactions require secure backend,
    verification and applicable legal compliance.
============================================================
*/

(function () {
    "use strict";

    /* ======================================================
       CONSTANTS
    ====================================================== */

    const VERSION = "2.0.0";

    const SYSTEM_NAME = "ALON HISTORYVERSE 24";

    const MODULE_NAME = "Luxury Lifestyle";

    const STORAGE_KEY =
        "alon_historyverse_luxury_lifestyle_listings";

    const SETTINGS_KEY =
        "alon_historyverse_luxury_lifestyle_settings";

    const TERMS_KEY =
        "alon_historyverse_luxury_lifestyle_terms";

    const MEDIA_KEY =
        "alon_historyverse_luxury_lifestyle_media";

    /* ======================================================
       ACTIONS
    ====================================================== */

    const ACTIONS = [
        {
            id: "buy",
            name: "Buy",
            icon: "🛒"
        },
        {
            id: "sell",
            name: "Sell",
            icon: "💰"
        },
        {
            id: "rent",
            name: "Rent",
            icon: "🔑"
        },
        {
            id: "booking",
            name: "Booking",
            icon: "📅"
        },
        {
            id: "promote",
            name: "Promote",
            icon: "📢"
        }
    ];

    /* ======================================================
       CATEGORIES
    ====================================================== */

    const CATEGORIES = [
        {
            id: "private-helicopters",
            name: "Private Helicopters",
            icon: "🚁",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "private-jets",
            name: "Private Jets",
            icon: "✈️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "aircraft",
            name: "Aircraft",
            icon: "🛩️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "luxury-cars",
            name: "Luxury & Sports Cars",
            icon: "🏎️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "luxury-watches",
            name: "Luxury Watches",
            icon: "⌚",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "luxury-bikes",
            name: "Luxury Bikes",
            icon: "🏍️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "premium-trucks",
            name: "Premium Trucks",
            icon: "🚛",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "luxury-property",
            name: "Luxury Property",
            icon: "🏢",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "bungalows",
            name: "Luxury Bungalows",
            icon: "🏡",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "flats",
            name: "Luxury Flats",
            icon: "🏙️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "party-plots",
            name: "Party Plots & Event Spaces",
            icon: "🎉",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "dance-bars",
            name: "Dance Bars & Entertainment Venues",
            icon: "🎵",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "hotels",
            name: "Luxury Hotels & Resorts",
            icon: "🏨",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "malls",
            name: "Malls & Commercial Spaces",
            icon: "🏬",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "yachts",
            name: "Yachts & Luxury Boats",
            icon: "🛥️",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "ships",
            name: "Ships",
            icon: "🚢",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "container-ships",
            name: "Container Ships",
            icon: "🚢",
            actions: ["buy", "sell", "rent", "booking"]
        },

        {
            id: "heavy-machinery",
            name: "Large & Heavy Machines",
            icon: "🏗️",
            actions: ["buy", "sell", "rent"]
        },

        {
            id: "movies",
            name: "Movies",
            icon: "🎬",
            actions: ["promote"]
        },

        {
            id: "serials",
            name: "Serials",
            icon: "📺",
            actions: ["promote"]
        },

        {
            id: "web-series",
            name: "Web Series",
            icon: "🎞️",
            actions: ["promote"]
        },

        {
            id: "podcasts",
            name: "Podcasts & Shows",
            icon: "🎙️",
            actions: ["promote"]
        },

        {
            id: "songs",
            name: "Songs",
            icon: "🎵",
            actions: ["promote"]
        },

        {
            id: "albums",
            name: "Albums",
            icon: "💿",
            actions: ["promote"]
        },

        {
            id: "sports",
            name: "Sports",
            icon: "🏆",
            actions: ["promote", "booking"]
        },

        {
            id: "games",
            name: "Games",
            icon: "🎮",
            actions: ["promote"]
        },

        {
            id: "tourist-guide",
            name: "Tourist Guide",
            icon: "🗺️",
            actions: ["promote", "booking"]
        },

        {
            id: "best-tourist-places",
            name: "Best Tourist Places",
            icon: "🌍",
            actions: ["promote", "booking"]
        }
    ];

    /* ======================================================
       CONDITIONS
    ====================================================== */

    const CONDITIONS = [
        "New",
        "Used",
        "Refurbished",
        "Pre-Owned",
        "Under Construction",
        "Available for Booking",
        "For Promotion"
    ];

    /* ======================================================
       MEDIA TYPES
    ====================================================== */

    const MEDIA_TYPES = [
        {
            id: "photo",
            name: "Photo"
        },
        {
            id: "hd-photo",
            name: "HD Picture"
        },
        {
            id: "video",
            name: "Video"
        },
        {
            id: "3d",
            name: "3D"
        },
        {
            id: "gallery",
            name: "Gallery"
        }
    ];

    /* ======================================================
       STATUS
    ====================================================== */

    const STATUS = {
        DRAFT: "draft",
        ACTIVE: "active",
        PENDING: "pending-verification",
        SOLD: "sold",
        RENTED: "rented",
        BOOKED: "booked",
        CLOSED: "closed"
    };

    /* ======================================================
       TERMS
    ====================================================== */

    const TERMS = {
        version: "2.0",

        title:
            "ALON HISTORYVERSE 24 — Luxury Lifestyle Terms & Conditions",

        points: [

            "ALON HISTORYVERSE 24 Luxury Lifestyle एक information, listing और promotion platform है।",

            "Website किसी listed item, property, aircraft, helicopter, jet, vehicle, ship, machinery, hotel, venue या service की ownership की guarantee नहीं देती।",

            "किसी listing का website पर दिखाई देना ownership, availability, authenticity, legality, condition या transaction completion की पुष्टि नहीं है।",

            "Listing submit करने वाला owner, seller, dealer, company या advertiser अपनी दी गई जानकारी और documents के लिए स्वयं जिम्मेदार है।",

            "Buyer, renter या booking customer को transaction से पहले ownership, registration, licence, permit, insurance, tax, condition और अन्य आवश्यक documents स्वयं verify करने चाहिए।",

            "Website पर दिखाई गई price indicative हो सकती है और अंतिम price संबंधित owner, seller, company या service provider से verify करनी होगी।",

            "ALON HISTORYVERSE 24 किसी buyer और seller के बीच payment, delivery, transfer, possession, registration या ownership transfer की guarantee नहीं देती।",

            "किसी fraud, scam, fake document, false information, payment dispute या third-party dispute की स्थिति में संबंधित parties स्वयं appropriate legal authority और service provider से संपर्क करें।",

            "Aircraft, helicopters, jets, ships, vehicles, property, heavy machinery तथा अन्य regulated assets के लिए लागू स्थानीय, राष्ट्रीय और अंतरराष्ट्रीय कानूनों का पालन आवश्यक है।",

            "किसी photo, video, logo, movie, serial, song, album, brand material या अन्य copyrighted content को upload करने वाला व्यक्ति उसके उपयोग के अधिकार के लिए स्वयं जिम्मेदार होगा।",

            "Third-party company, dealer, owner, advertiser, hotel, property owner या service provider की actions के लिए website जिम्मेदार नहीं है।",

            "Website पर उपलब्ध media केवल presentation और information के लिए हो सकता है। Actual product या property media से अलग हो सकता है।",

            "Booking, rental, purchase, sale या promotional agreement को final करने से पहले संबंधित party के साथ सभी terms स्वयं verify करें।",

            "जहाँ लागू कानून अनुमति देता है, ALON HISTORYVERSE 24 किसी third-party listing या transaction से होने वाले indirect loss, financial loss, property loss, delay, cancellation या dispute के लिए जिम्मेदारी स्वीकार नहीं करता।",

            "इन Terms की acceptance platform usage की शर्त है और यह किसी transaction या ownership की guarantee नहीं है।"
        ],

        acceptanceText:
            "मैंने Luxury Lifestyle Terms & Conditions पढ़े और समझे हैं तथा मैं समझता/समझती हूँ कि listing और transaction verification की जिम्मेदारी संबंधित parties की है।"
    };

    /* ======================================================
       UTILITY
    ====================================================== */

    function $(selector, parent) {

        return (parent || document).querySelector(selector);
    }

    function $$(selector, parent) {

        return Array.from(
            (parent || document).querySelectorAll(selector)
        );
    }

    function text(value) {

        return String(value == null ? "" : value).trim();
    }

    function id(prefix) {

        return (
            prefix +
            "_" +
            Date.now().toString(36) +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }

    function now() {

        return new Date().toISOString();
    }

    function escapeHTML(value) {

        return text(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* ======================================================
       COUNTRY SYSTEM
       READ-ONLY
    ====================================================== */

    function getCountries() {

        const sources = [

            window.MARKETPLACE_COUNTRIES,

            window.ALON_MARKETPLACE_COUNTRIES,

            window.ALON_WORLD_COUNTRIES,

            window.WORLD_COUNTRIES,

            window.GLOBAL_COUNTRIES
        ];

        for (let i = 0; i < sources.length; i++) {

            if (
                Array.isArray(sources[i]) &&
                sources[i].length
            ) {

                return sources[i];
            }
        }

        return [];
    }

    function getCountryName(country) {

        if (!country) {
            return "";
        }

        if (typeof country === "string") {
            return country;
        }

        return (
            country.name ||
            country.country ||
            country.label ||
            ""
        );
    }

    function getCountryCode(country) {

        if (!country) {
            return "";
        }

        if (typeof country === "string") {
            return "";
        }

        return (
            country.iso ||
            country.isoCode ||
            country.code ||
            country.countryCode ||
            ""
        );
    }

    function getCallingCode(country) {

        if (!country) {
            return "";
        }

        if (typeof country === "string") {
            return "";
        }

        return (
            country.callingCode ||
            country.phoneCode ||
            country.dialCode ||
            ""
        );
    }

    function getCountryFlag(country) {

        if (!country) {
            return "🌍";
        }

        if (typeof country === "string") {
            return "🌍";
        }

        return (
            country.flag ||
            country.emoji ||
            "🌍"
        );
    }

    /* ======================================================
       STORAGE
    ====================================================== */

    function readJSON(key, fallback) {

        try {

            const raw =
                localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            const parsed =
                JSON.parse(raw);

            return parsed;

        } catch (error) {

            console.warn(
                "[Luxury Lifestyle] Storage read error:",
                error
            );

            return fallback;
        }
    }

    function writeJSON(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "[Luxury Lifestyle] Storage write error:",
                error
            );

            return false;
        }
    }

    /* ======================================================
       SETTINGS
    ====================================================== */

    function getSettings() {

        return readJSON(
            SETTINGS_KEY,
            {
                market: "international",
                country: "",
                countryCode: "",
                callingCode: "",
                flag: "🌍",
                city: "",
                currency: "",
                language: ""
            }
        );
    }

    function saveSettings(settings) {

        return writeJSON(
            SETTINGS_KEY,
            Object.assign(
                {},
                getSettings(),
                settings || {}
            )
        );
    }

    /* ======================================================
       TERMS
    ====================================================== */

    function termsAccepted() {

        const data =
            readJSON(
                TERMS_KEY,
                null
            );

        return !!(
            data &&
            data.accepted === true &&
            data.version === TERMS.version
        );
    }

    function acceptTerms() {

        return writeJSON(
            TERMS_KEY,
            {
                accepted: true,
                version: TERMS.version,
                acceptedAt: now()
            }
        );
    }

    function showTerms() {

        let box =
            $("#luxuryTermsModal");

        if (!box) {

            box =
                document.createElement("div");

            box.id =
                "luxuryTermsModal";

            box.innerHTML = `
                <div class="luxury-terms-overlay">
                    <div class="luxury-terms-box">

                        <button
                            type="button"
                            class="luxury-terms-close"
                            data-luxury-close-terms
                        >×</button>

                        <h2>
                            ${escapeHTML(TERMS.title)}
                        </h2>

                        <div class="luxury-terms-content">
                            ${TERMS.points.map(
                                function (point, index) {
                                    return `
                                        <p>
                                            <strong>${index + 1}.</strong>
                                            ${escapeHTML(point)}
                                        </p>
                                    `;
                                }
                            ).join("")}
                        </div>

                        <label class="luxury-terms-check">
                            <input
                                type="checkbox"
                                id="luxuryTermsAccept"
                            >
                            <span>
                                ${escapeHTML(
                                    TERMS.acceptanceText
                                )}
                            </span>
                        </label>

                        <div class="luxury-terms-actions">

                            <button
                                type="button"
                                data-luxury-close-terms
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                id="luxuryAcceptTermsButton"
                            >
                                Accept Terms
                            </button>

                        </div>

                    </div>
                </div>
            `;

            document.body.appendChild(box);

            const style =
                document.createElement("style");

            style.textContent = `
                .luxury-terms-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: rgba(0,0,0,.82);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 18px;
                    box-sizing: border-box;
                }

                .luxury-terms-box {
                    width: min(900px, 100%);
                    max-height: 90vh;
                    overflow: auto;
                    background: #05080f;
                    border: 1px solid #d7b35a;
                    border-radius: 16px;
                    padding: 22px;
                    color: #fff;
                    box-sizing: border-box;
                    position: relative;
                    box-shadow: 0 20px 70px rgba(0,0,0,.7);
                }

                .luxury-terms-box h2 {
                    color: #f0d27a;
                    margin-top: 0;
                    padding-right: 35px;
                }

                .luxury-terms-content p {
                    line-height: 1.65;
                    margin: 12px 0;
                    color: #e9e9e9;
                }

                .luxury-terms-close {
                    position: absolute;
                    right: 15px;
                    top: 12px;
                    width: 38px;
                    height: 38px;
                    border: 1px solid #d7b35a;
                    border-radius: 50%;
                    background: transparent;
                    color: #f0d27a;
                    font-size: 25px;
                    cursor: pointer;
                }

                .luxury-terms-check {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    margin-top: 20px;
                    padding: 15px;
                    border: 1px solid rgba(215,179,90,.4);
                    border-radius: 10px;
                    background: rgba(215,179,90,.05);
                    line-height: 1.5;
                }

                .luxury-terms-check input {
                    margin-top: 4px;
                    transform: scale(1.2);
                }

                .luxury-terms-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }

                .luxury-terms-actions button {
                    border: 1px solid #d7b35a;
                    background: #101722;
                    color: #fff;
                    padding: 11px 18px;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .luxury-terms-actions button:last-child {
                    background: #d7b35a;
                    color: #05080f;
                    font-weight: 700;
                }
            `;

            document.head.appendChild(style);

            $$("#luxuryTermsModal [data-luxury-close-terms]")
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            closeTerms
                        );
                    }
                );

            $("#luxuryAcceptTermsButton")
                .addEventListener(
                    "click",
                    function () {

                        const check =
                            $("#luxuryTermsAccept");

                        if (
                            !check ||
                            !check.checked
                        ) {

                            alert(
                                "Please accept the Terms & Conditions first."
                            );

                            return;
                        }

                        acceptTerms();

                        closeTerms();

                        notify(
                            "Terms & Conditions accepted."
                        );
                    }
                );
        }

        box.style.display = "block";
    }

    function closeTerms() {

        const box =
            $("#luxuryTermsModal");

        if (box) {
            box.style.display = "none";
        }
    }

    /* ======================================================
       LISTINGS
    ====================================================== */

    function getListings() {

        const data =
            readJSON(
                STORAGE_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }

    function saveListings(listings) {

        return writeJSON(
            STORAGE_KEY,
            Array.isArray(listings)
                ? listings
                : []
        );
    }

    function getCategory(categoryId) {

        return CATEGORIES.find(
            function (category) {
                return category.id === categoryId;
            }
        ) || null;
    }

    function getAction(actionId) {

        return ACTIONS.find(
            function (action) {
                return action.id === actionId;
            }
        ) || null;
    }

    function actionAllowed(
        categoryId,
        actionId
    ) {

        const category =
            getCategory(categoryId);

        if (!category) {
            return false;
        }

        return category.actions.includes(
            actionId
        );
    }

    /* ======================================================
       CREATE LISTING
    ====================================================== */

    function createListing(data) {

        if (!data) {
            throw new Error(
                "Listing data is required."
            );
        }

        const category =
            getCategory(
                text(data.categoryId)
            );

        if (!category) {
            throw new Error(
                "Please select a valid category."
            );
        }

        const action =
            getAction(
                text(data.action)
            );

        if (!action) {
            throw new Error(
                "Please select a valid action."
            );
        }

        if (
            !actionAllowed(
                category.id,
                action.id
            )
        ) {
            throw new Error(
                "This action is not available for the selected category."
            );
        }

        if (!termsAccepted()) {

            throw new Error(
                "Please accept Terms & Conditions first."
            );
        }

        const settings =
            getSettings();

        const listing = {

            id:
                id("luxury"),

            system:
                SYSTEM_NAME,

            module:
                MODULE_NAME,

            version:
                VERSION,

            categoryId:
                category.id,

            categoryName:
                category.name,

            categoryIcon:
                category.icon,

            action:
                action.id,

            actionName:
                action.name,

            title:
                text(data.title),

            description:
                text(data.description),

            brand:
                text(data.brand),

            model:
                text(data.model),

            condition:
                text(data.condition),

            price:
                text(data.price),

            currency:
                text(
                    data.currency ||
                    settings.currency
                ),

            market:
                data.market === "local"
                    ? "local"
                    : "international",

            country:
                text(
                    data.country ||
                    settings.country
                ),

            countryCode:
                text(
                    data.countryCode ||
                    settings.countryCode
                ),

            countryFlag:
                text(
                    data.countryFlag ||
                    settings.flag ||
                    "🌍"
                ),

            callingCode:
                text(
                    data.callingCode ||
                    settings.callingCode
                ),

            city:
                text(
                    data.city ||
                    settings.city
                ),

            ownerType:
                text(data.ownerType),

            ownerName:
                text(data.ownerName),

            companyName:
                text(data.companyName),

            contactEmail:
                text(data.contactEmail),

            contactPhone:
                text(data.contactPhone),

            website:
                text(data.website),

            media:
                Array.isArray(data.media)
                    ? data.media
                    : [],

            status:
                STATUS.DRAFT,

            termsAccepted:
                true,

            termsVersion:
                TERMS.version,

            createdAt:
                now(),

            updatedAt:
                now()
        };

        return listing;
    }

    function addListing(data) {

        const listing =
            createListing(data);

        const listings =
            getListings();

        listings.unshift(listing);

        saveListings(listings);

        return listing;
    }

    /* ======================================================
       UPDATE
    ====================================================== */

    function updateListing(
        listingId,
        updates
    ) {

        const listings =
            getListings();

        const index =
            listings.findIndex(
                function (listing) {
                    return listing.id === listingId;
                }
            );

        if (index === -1) {

            throw new Error(
                "Listing not found."
            );
        }

        listings[index] =
            Object.assign(
                {},
                listings[index],
                updates || {},
                {
                    updatedAt: now()
                }
            );

        saveListings(listings);

        return listings[index];
    }

    /* ======================================================
       DELETE
    ====================================================== */

    function deleteListing(
        listingId
    ) {

        const listings =
            getListings();

        const next =
            listings.filter(
                function (listing) {
                    return listing.id !== listingId;
                }
            );

        if (
            next.length ===
            listings.length
        ) {
            return false;
        }

        saveListings(next);

        return true;
    }

    /* ======================================================
       GET LISTING
    ====================================================== */

    function getListing(
        listingId
    ) {

        return getListings().find(
            function (listing) {
                return listing.id === listingId;
            }
        ) || null;
    }

    /* ======================================================
       PUBLISH
    ====================================================== */

    function publishListing(
        listingId
    ) {

        if (!termsAccepted()) {

            showTerms();

            throw new Error(
                "Terms & Conditions must be accepted."
            );
        }

        return updateListing(
            listingId,
            {
                status:
                    STATUS.ACTIVE,

                termsAccepted:
                    true,

                termsVersion:
                    TERMS.version
            }
        );
    }

    /* ======================================================
       STATUS UPDATE
    ====================================================== */

    function setStatus(
        listingId,
        status
    ) {

        const allowed =
            Object.values(STATUS);

        if (
            !allowed.includes(status)
        ) {

            throw new Error(
                "Invalid listing status."
            );
        }

        return updateListing(
            listingId,
            {
                status: status
            }
        );
    }

    /* ======================================================
       MEDIA
    ====================================================== */

    function getMedia() {

        return readJSON(
            MEDIA_KEY,
            []
        );
    }

    function saveMedia(media) {

        return writeJSON(
            MEDIA_KEY,
            media
        );
    }

    function addMedia(
        listingId,
        mediaData
    ) {

        const listing =
            getListing(listingId);

        if (!listing) {

            throw new Error(
                "Listing not found."
            );
        }

        if (!mediaData) {

            throw new Error(
                "Media data is required."
            );
        }

        const valid =
            MEDIA_TYPES.some(
                function (item) {
                    return (
                        item.id ===
                        mediaData.type
                    );
                }
            );

        if (!valid) {

            throw new Error(
                "Invalid media type."
            );
        }

        const media = {

            id:
                id("media"),

            listingId:
                listingId,

            type:
                text(mediaData.type),

            url:
                text(mediaData.url),

            thumbnail:
                text(mediaData.thumbnail),

            title:
                text(mediaData.title),

            createdAt:
                now()
        };

        const all =
            getMedia();

        all.unshift(media);

        saveMedia(all);

        const listingMedia =
            Array.isArray(listing.media)
                ? listing.media
                : [];

        listingMedia.push(media);

        updateListing(
            listingId,
            {
                media:
                    listingMedia
            }
        );

        return media;
    }

    function removeMedia(
        listingId,
        mediaId
    ) {

        const listing =
            getListing(listingId);

        if (!listing) {
            return false;
        }

        const media =
            Array.isArray(listing.media)
                ? listing.media
                : [];

        const filtered =
            media.filter(
                function (item) {
                    return item.id !== mediaId;
                }
            );

        updateListing(
            listingId,
            {
                media: filtered
            }
        );

        const all =
            getMedia();

        saveMedia(
            all.filter(
                function (item) {
                    return item.id !== mediaId;
                }
            )
        );

        return true;
    }

    /* ======================================================
       FILTER
    ====================================================== */

    function filterListings(filters) {

        const listings =
            getListings();

        if (!filters) {
            return listings;
        }

        const query =
            text(filters.query)
                .toLowerCase();

        return listings.filter(
            function (listing) {

                if (
                    filters.category &&
                    listing.categoryId !==
                    filters.category
                ) {
                    return false;
                }

                if (
                    filters.action &&
                    listing.action !==
                    filters.action
                ) {
                    return false;
                }

                if (
                    filters.market &&
                    listing.market !==
                    filters.market
                ) {
                    return false;
                }

                if (
                    filters.country &&
                    listing.countryCode !==
                    filters.country
                ) {
                    return false;
                }

                if (
                    filters.city &&
                    listing.city.toLowerCase() !==
                    text(filters.city).toLowerCase()
                ) {
                    return false;
                }

                if (
                    filters.condition &&
                    listing.condition !==
                    filters.condition
                ) {
                    return false;
                }

                if (
                    filters.status &&
                    listing.status !==
                    filters.status
                ) {
                    return false;
                }

                if (query) {

                    const searchable = [

                        listing.title,

                        listing.description,

                        listing.brand,

                        listing.model,

                        listing.categoryName,

                        listing.country,

                        listing.city,

                        listing.ownerName,

                        listing.companyName

                    ]
                        .join(" ")
                        .toLowerCase();

                    if (
                        !searchable.includes(
                            query
                        )
                    ) {
                        return false;
                    }
                }

                return true;
            }
        );
    }

    /* ======================================================
       SEARCH
    ====================================================== */

    function searchListings(query) {

        return filterListings(
            {
                query: query
            }
        );
    }

    /* ======================================================
       STATISTICS
    ====================================================== */

    function statistics() {

        const listings =
            getListings();

        const result = {

            total:
                listings.length,

            active: 0,

            draft: 0,

            pending: 0,

            sold: 0,

            rented: 0,

            booked: 0,

            closed: 0
        };

        listings.forEach(
            function (listing) {

                if (
                    Object.prototype.hasOwnProperty.call(
                        result,
                        listing.status
                    )
                ) {

                    result[listing.status]++;
                }
            }
        );

        return result;
    }

    /* ======================================================
       UI NOTIFICATION
    ====================================================== */

    function notify(message) {

        let notification =
            $("#luxuryNotification");

        if (!notification) {

            notification =
                document.createElement("div");

            notification.id =
                "luxuryNotification";

            notification.style.cssText = `
                position:fixed;
                right:18px;
                bottom:18px;
                z-index:100000;
                max-width:360px;
                padding:14px 18px;
                border:1px solid #d7b35a;
                border-radius:10px;
                background:#05080f;
                color:#fff;
                box-shadow:0 10px 35px rgba(0,0,0,.5);
                display:none;
            `;

            document.body.appendChild(
                notification
            );
        }

        notification.textContent =
            message;

        notification.style.display =
            "block";

        clearTimeout(
            notification._timer
        );

        notification._timer =
            setTimeout(
                function () {
                    notification.style.display =
                        "none";
                },
                3500
            );
    }

    /* ======================================================
       COUNTRY SELECT
    ====================================================== */

    function populateCountrySelect(
        select
    ) {

        if (!select) {
            return;
        }

        const countries =
            getCountries();

        const current =
            select.value;

        select.innerHTML = `
            <option value="">
                🌍 Select Country
            </option>
        `;

        countries.forEach(
            function (country) {

                const name =
                    getCountryName(country);

                const code =
                    getCountryCode(country);

                const flag =
                    getCountryFlag(country);

                const calling =
                    getCallingCode(country);

                if (!name) {
                    return;
                }

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    code || name;

                option.textContent =
                    flag +
                    " " +
                    name +
                    (
                        calling
                            ? " " + calling
                            : ""
                    );

                option.dataset.country =
                    name;

                option.dataset.iso =
                    code;

                option.dataset.callingCode =
                    calling;

                option.dataset.flag =
                    flag;

                select.appendChild(
                    option
                );
            }
        );

        if (current) {
            select.value = current;
        }
    }

    /* ======================================================
       ALL COUNTRY SELECTS
    ====================================================== */

    function initializeCountrySelects() {

        const selectors = [

            "#luxuryCountry",

            "#luxury-country",

            "#luxuryCountrySelect",

            "[data-luxury-country]",

            "select[name='luxuryCountry']",

            "select[name='country']"
        ];

        selectors.forEach(
            function (selector) {

                $$(selector).forEach(
                    function (select) {

                        populateCountrySelect(
                            select
                        );

                        select.addEventListener(
                            "change",
                            handleCountryChange
                        );
                    }
                );
            }
        );
    }

    function handleCountryChange(event) {

        const select =
            event.currentTarget;

        const option =
            select.options[
                select.selectedIndex
            ];

        if (!option) {
            return;
        }

        saveSettings(
            {
                country:
                    option.dataset.country ||
                    option.textContent.trim(),

                countryCode:
                    option.dataset.iso ||
                    select.value,

                callingCode:
                    option.dataset.callingCode ||
                    "",

                flag:
                    option.dataset.flag ||
                    "🌍"
            }
        );

        const countryOutput =
            $(
                "[data-luxury-selected-country]"
            );

        if (countryOutput) {

            countryOutput.textContent =
                (
                    option.dataset.flag ||
                    "🌍"
                ) +
                " " +
                (
                    option.dataset.country ||
                    option.textContent.trim()
                );
        }
    }

    /* ======================================================
       CATEGORY SELECTS
    ====================================================== */

    function populateCategorySelect(
        select
    ) {

        if (!select) {
            return;
        }

        const current =
            select.value;

        select.innerHTML = `
            <option value="">
                Select Category
            </option>
        `;

        CATEGORIES.forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category.id;

                option.textContent =
                    category.icon +
                    " " +
                    category.name;

                select.appendChild(
                    option
                );
            }
        );

        if (current) {
            select.value = current;
        }
    }

    function initializeCategorySelects() {

        const selectors = [

            "#luxuryCategory",

            "#luxury-category",

            "#luxuryCategorySelect",

            "[data-luxury-category]",

            "select[name='luxuryCategory']"
        ];

        selectors.forEach(
            function (selector) {

                $$(selector).forEach(
                    populateCategorySelect
                );
            }
        );
    }

    /* ======================================================
       ACTION SELECT
    ====================================================== */

    function populateActionSelect(
        select,
        categoryId
    ) {

        if (!select) {
            return;
        }

        const category =
            getCategory(categoryId);

        select.innerHTML = `
            <option value="">
                Select Action
            </option>
        `;

        if (!category) {

            ACTIONS.forEach(
                function (action) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        action.id;

                    option.textContent =
                        action.icon +
                        " " +
                        action.name;

                    select.appendChild(
                        option
                    );
                }
            );

            return;
        }

        category.actions.forEach(
            function (actionId) {

                const action =
                    getAction(actionId);

                if (!action) {
                    return;
                }

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    action.id;

                option.textContent =
                    action.icon +
                    " " +
                    action.name;

                select.appendChild(
                    option
                );
            }
        );
    }

    function initializeActionSelects() {

        const categorySelect =
            $(
                "#luxuryCategory, " +
                "#luxury-category, " +
                "#luxuryCategorySelect, " +
                "[data-luxury-category], " +
                "select[name='luxuryCategory']"
            );

        const actionSelect =
            $(
                "#luxuryAction, " +
                "#luxury-action, " +
                "#luxuryActionSelect, " +
                "[data-luxury-action], " +
                "select[name='luxuryAction']"
            );

        if (!actionSelect) {
            return;
        }

        populateActionSelect(
            actionSelect,
            categorySelect
                ? categorySelect.value
                : ""
        );

        if (categorySelect) {

            categorySelect.addEventListener(
                "change",
                function () {

                    populateActionSelect(
                        actionSelect,
                        categorySelect.value
                    );
                }
            );
        }
    }

    /* ======================================================
       CONDITION SELECT
    ====================================================== */

    function initializeConditionSelects() {

        $$(
            "#luxuryCondition, " +
            "#luxury-condition, " +
            "select[name='condition'], " +
            "[data-luxury-condition]"
        ).forEach(
            function (select) {

                const current =
                    select.value;

                select.innerHTML = `
                    <option value="">
                        Select Condition
                    </option>
                `;

                CONDITIONS.forEach(
                    function (condition) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            condition;

                        option.textContent =
                            condition;

                        select.appendChild(
                            option
                        );
                    }
                );

                if (current) {
                    select.value =
                        current;
                }
            }
        );
    }

    /* ======================================================
       FORM VALUE HELPER
    ====================================================== */

    function valueFrom(
        form,
        names
    ) {

        for (
            let i = 0;
            i < names.length;
            i++
        ) {

            const element =
                form.elements[names[i]];

            if (
                element &&
                text(element.value)
            ) {

                return text(
                    element.value
                );
            }
        }

        return "";
    }

    /* ======================================================
       FORM HANDLER
    ====================================================== */

    function handleListingForm(
        form
    ) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                try {

                    if (!termsAccepted()) {

                        showTerms();

                        notify(
                            "Please accept Terms & Conditions."
                        );

                        return;
                    }

                    const data = {

                        categoryId:
                            valueFrom(
                                form,
                                [
                                    "categoryId",
                                    "category",
                                    "luxuryCategory"
                                ]
                            ),

                        action:
                            valueFrom(
                                form,
                                [
                                    "action",
                                    "luxuryAction"
                                ]
                            ),

                        title:
                            valueFrom(
                                form,
                                [
                                    "title",
                                    "name",
                                    "listingTitle"
                                ]
                            ),

                        description:
                            valueFrom(
                                form,
                                [
                                    "description"
                                ]
                            ),

                        brand:
                            valueFrom(
                                form,
                                [
                                    "brand"
                                ]
                            ),

                        model:
                            valueFrom(
                                form,
                                [
                                    "model"
                                ]
                            ),

                        condition:
                            valueFrom(
                                form,
                                [
                                    "condition"
                                ]
                            ),

                        price:
                            valueFrom(
                                form,
                                [
                                    "price"
                                ]
                            ),

                        currency:
                            valueFrom(
                                form,
                                [
                                    "currency"
                                ]
                            ),

                        market:
                            valueFrom(
                                form,
                                [
                                    "market"
                                ]
                            ) ||
                            "international",

                        country:
                            valueFrom(
                                form,
                                [
                                    "country"
                                ]
                            ),

                        countryCode:
                            valueFrom(
                                form,
                                [
                                    "countryCode"
                                ]
                            ),

                        city:
                            valueFrom(
                                form,
                                [
                                    "city"
                                ]
                            ),

                        ownerType:
                            valueFrom(
                                form,
                                [
                                    "ownerType"
                                ]
                            ),

                        ownerName:
                            valueFrom(
                                form,
                                [
                                    "ownerName"
                                ]
                            ),

                        companyName:
                            valueFrom(
                                form,
                                [
                                    "companyName"
                                ]
                            ),

                        contactEmail:
                            valueFrom(
                                form,
                                [
                                    "contactEmail"
                                ]
                            ),

                        contactPhone:
                            valueFrom(
                                form,
                                [
                                    "contactPhone"
                                ]
                            ),

                        website:
                            valueFrom(
                                form,
                                [
                                    "website"
                                ]
                            )
                    };

                    const listing =
                        addListing(data);

                    form.reset();

                    notify(
                        "Listing saved as Draft."
                    );

                    renderListings();

                    if (
                        typeof window
                            .luxuryLifestyleListingCreated
                            === "function"
                    ) {

                        window
                            .luxuryLifestyleListingCreated(
                                listing
                            );
                    }

                } catch (error) {

                    console.error(
                        "[Luxury Lifestyle]",
                        error
                    );

                    alert(
                        error.message ||
                        "Unable to create listing."
                    );
                }
            }
        );
    }

    /* ======================================================
       FORM DISCOVERY
    ====================================================== */

    function initializeForms() {

        $$(
            "form[data-luxury-listing-form], " +
            "#luxuryListingForm, " +
            "#luxury-listing-form"
        ).forEach(
            handleListingForm
        );
    }

    /* ======================================================
       RENDER LISTINGS
    ====================================================== */

    function renderListings(
        listings
    ) {

        const containers = [

            ...$$(
                "#luxuryListings"
            ),

            ...$$(
                "#luxury-listings"
            ),

            ...$$(
                "[data-luxury-listings]"
            )
        ];

        if (!containers.length) {
            return;
        }

        const data =
            Array.isArray(listings)
                ? listings
                : getListings();

        containers.forEach(
            function (container) {

                if (!data.length) {

                    container.innerHTML = `
                        <div class="luxury-empty">
                            <div style="font-size:42px;">
                                ✨
                            </div>
                            <h3>
                                No Luxury Listings Yet
                            </h3>
                            <p>
                                Add the first Luxury Lifestyle listing.
                            </p>
                        </div>
                    `;

                    return;
                }

                container.innerHTML =
                    data.map(
                        renderListingCard
                    ).join("");

                bindListingButtons(
                    container
                );
            }
        );
    }

    function renderListingCard(
        listing
    ) {

        const media =
            Array.isArray(listing.media)
                ? listing.media
                : [];

        const firstMedia =
            media.find(
                function (item) {
                    return (
                        item.type === "photo" ||
                        item.type === "hd-photo"
                    );
                }
            );

        const image =
            firstMedia &&
            firstMedia.url
                ? `
                    <img
                        src="${escapeHTML(firstMedia.url)}"
                        alt="${escapeHTML(listing.title)}"
                        loading="lazy"
                    >
                `
                : `
                    <div
                        style="
                            min-height:180px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:58px;
                        "
                    >
                        ${escapeHTML(
                            listing.categoryIcon ||
                            "✨"
                        )}
                    </div>
                `;

        const location =
            [
                listing.countryFlag,
                listing.country,
                listing.city
            ]
                .filter(Boolean)
                .join(" ");

        return `
            <article
                class="luxury-listing-card"
                data-listing-id="${escapeHTML(listing.id)}"
                style="
                    border:1px solid rgba(215,179,90,.35);
                    border-radius:14px;
                    overflow:hidden;
                    background:#080d16;
                    margin-bottom:18px;
                "
            >

                <div
                    class="luxury-listing-media"
                    style="
                        min-height:180px;
                        background:#05080f;
                        overflow:hidden;
                    "
                >
                    ${image}
                </div>

                <div
                    style="
                        padding:16px;
                    "
                >

                    <div
                        style="
                            color:#d7b35a;
                            font-size:13px;
                            margin-bottom:7px;
                        "
                    >
                        ${escapeHTML(
                            listing.categoryIcon || ""
                        )}
                        ${escapeHTML(
                            listing.categoryName || ""
                        )}
                    </div>

                    <h3
                        style="
                            margin:5px 0 9px;
                            color:#f0d27a;
                        "
                    >
                        ${escapeHTML(
                            listing.title ||
                            "Untitled Listing"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            listing.description
                        )}
                    </p>

                    <div>
                        <strong>
                            ${escapeHTML(
                                listing.actionName || ""
                            )}
                        </strong>
                    </div>

                    ${
                        listing.price
                            ? `
                                <div
                                    style="
                                        margin-top:8px;
                                        font-weight:700;
                                    "
                                >
                                    ${escapeHTML(
                                        listing.currency
                                    )}
                                    ${escapeHTML(
                                        listing.price
                                    )}
                                </div>
                            `
                            : ""
                    }

                    ${
                        location
                            ? `
                                <div
                                    style="
                                        margin-top:8px;
                                    "
                                >
                                    📍
                                    ${escapeHTML(
                                        location
                                    )}
                                </div>
                            `
                            : ""
                    }

                    <div
                        style="
                            margin-top:10px;
                            font-size:12px;
                            opacity:.75;
                        "
                    >
                        Status:
                        ${escapeHTML(
                            listing.status
                        )}
                    </div>

                    <div
                        class="luxury-listing-actions"
                        style="
                            display:flex;
                            flex-wrap:wrap;
                            gap:8px;
                            margin-top:14px;
                        "
                    >

                        <button
                            type="button"
                            data-luxury-view
                            data-id="${escapeHTML(listing.id)}"
                        >
                            View
                        </button>

                        ${
                            listing.status ===
                            STATUS.DRAFT
                                ? `
                                    <button
                                        type="button"
                                        data-luxury-publish
                                        data-id="${escapeHTML(listing.id)}"
                                    >
                                        Publish
                                    </button>
                                `
                                : ""
                        }

                        <button
                            type="button"
                            data-luxury-delete
                            data-id="${escapeHTML(listing.id)}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </article>
        `;
    }

    /* ======================================================
       LISTING BUTTONS
    ====================================================== */

    function bindListingButtons(
        container
    ) {

        $$(
            "[data-luxury-view]",
            container
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const listing =
                            getListing(
                                button.dataset.id
                            );

                        if (!listing) {
                            return;
                        }

                        showListingDetails(
                            listing
                        );
                    }
                );
            }
        );

        $$(
            "[data-luxury-publish]",
            container
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        try {

                            publishListing(
                                button.dataset.id
                            );

                            notify(
                                "Listing published."
                            );

                            renderListings();

                        } catch (error) {

                            alert(
                                error.message
                            );
                        }
                    }
                );
            }
        );

        $$(
            "[data-luxury-delete]",
            container
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const confirmed =
                            window.confirm(
                                "Delete this listing?"
                            );

                        if (!confirmed) {
                            return;
                        }

                        deleteListing(
                            button.dataset.id
                        );

                        notify(
                            "Listing deleted."
                        );

                        renderListings();
                    }
                );
            }
        );
    }

    /* ======================================================
       DETAILS
    ====================================================== */

    function showListingDetails(
        listing
    ) {

        let modal =
            $("#luxuryListingDetailsModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxuryListingDetailsModal";

            document.body.appendChild(
                modal
            );
        }

        const media =
            Array.isArray(listing.media)
                ? listing.media
                : [];

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:99998;
                    background:rgba(0,0,0,.85);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:18px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(800px,100%);
                        max-height:90vh;
                        overflow:auto;
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:15px;
                        padding:22px;
                        color:#fff;
                        box-sizing:border-box;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            gap:15px;
                        "
                    >

                        <h2
                            style="
                                color:#f0d27a;
                                margin-top:0;
                            "
                        >
                            ${escapeHTML(
                                listing.categoryIcon || ""
                            )}
                            ${escapeHTML(
                                listing.title
                            )}
                        </h2>

                        <button
                            type="button"
                            data-close-luxury-details
                            style="
                                width:38px;
                                height:38px;
                                border-radius:50%;
                                background:transparent;
                                color:#f0d27a;
                                border:1px solid #d7b35a;
                                font-size:22px;
                            "
                        >
                            ×
                        </button>

                    </div>

                    <p>
                        <strong>Category:</strong>
                        ${escapeHTML(
                            listing.categoryName
                        )}
                    </p>

                    <p>
                        <strong>Action:</strong>
                        ${escapeHTML(
                            listing.actionName
                        )}
                    </p>

                    ${
                        listing.brand
                            ? `
                                <p>
                                    <strong>Brand:</strong>
                                    ${escapeHTML(
                                        listing.brand
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        listing.model
                            ? `
                                <p>
                                    <strong>Model:</strong>
                                    ${escapeHTML(
                                        listing.model
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        listing.condition
                            ? `
                                <p>
                                    <strong>Condition:</strong>
                                    ${escapeHTML(
                                        listing.condition
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        listing.price
                            ? `
                                <p>
                                    <strong>Price:</strong>
                                    ${escapeHTML(
                                        listing.currency
                                    )}
                                    ${escapeHTML(
                                        listing.price
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        listing.country ||
                        listing.city
                            ? `
                                <p>
                                    <strong>Location:</strong>
                                    ${escapeHTML(
                                        [
                                            listing.countryFlag,
                                            listing.country,
                                            listing.city
                                        ]
                                            .filter(Boolean)
                                            .join(" ")
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <p>
                        ${escapeHTML(
                            listing.description
                        )}
                    </p>

                    ${
                        media.length
                            ? `
                                <hr>

                                <h3>
                                    Media
                                </h3>

                                <div>
                                    ${media.map(
                                        function (item) {

                                            if (
                                                (
                                                    item.type ===
                                                    "photo" ||
                                                    item.type ===
                                                    "hd-photo"
                                                ) &&
                                                item.url
                                            ) {

                                                return `
                                                    <img
                                                        src="${escapeHTML(item.url)}"
                                                        alt=""
                                                        style="
                                                            max-width:100%;
                                                            border-radius:10px;
                                                            margin-bottom:10px;
                                                        "
                                                    >
                                                `;
                                            }

                                            if (
                                                item.type ===
                                                "video" &&
                                                item.url
                                            ) {

                                                return `
                                                    <video
                                                        controls
                                                        style="
                                                            width:100%;
                                                            margin-bottom:10px;
                                                        "
                                                    >
                                                        <source
                                                            src="${escapeHTML(item.url)}"
                                                        >
                                                    </video>
                                                `;
                                            }

                                            return `
                                                <div
                                                    style="
                                                        padding:10px;
                                                        border:1px solid rgba(215,179,90,.25);
                                                        margin-bottom:8px;
                                                        border-radius:8px;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        item.type
                                                    )}
                                                </div>
                                            `;
                                        }
                                    ).join("")}
                                </div>
                            `
                            : ""
                    }

                    <hr>

                    <p
                        style="
                            font-size:12px;
                            opacity:.7;
                            line-height:1.6;
                        "
                    >
                        ALON HISTORYVERSE 24 is a listing,
                        information and promotion platform.
                        Ownership, availability, authenticity,
                        price and transaction details must be
                        independently verified by the relevant
                        parties.
                    </p>

                </div>
            </div>
        `;

        modal.style.display =
            "block";

        const close =
            $(
                "[data-close-luxury-details]",
                modal
            );

        if (close) {

            close.addEventListener(
                "click",
                function () {

                    modal.style.display =
                        "none";
                }
            );
        }
    }

    /* ======================================================
       SEARCH / FILTER UI
    ====================================================== */

    function initializeFilters() {

        const search =
            $(
                "#luxurySearch, " +
                "#luxury-search, " +
                "[data-luxury-search]"
            );

        const category =
            $(
                "#luxuryFilterCategory, " +
                "[data-luxury-filter-category]"
            );

        const action =
            $(
                "#luxuryFilterAction, " +
                "[data-luxury-filter-action]"
            );

        const market =
            $(
                "#luxuryFilterMarket, " +
                "[data-luxury-filter-market]"
            );

        const country =
            $(
                "#luxuryFilterCountry, " +
                "[data-luxury-filter-country]"
            );

        function update() {

            const results =
                filterListings(
                    {
                        query:
                            search
                                ? search.value
                                : "",

                        category:
                            category
                                ? category.value
                                : "",

                        action:
                            action
                                ? action.value
                                : "",

                        market:
                            market
                                ? market.value
                                : "",

                        country:
                            country
                                ? country.value
                                : ""
                    }
                );

            renderListings(
                results
            );
        }

        [
            search,
            category,
            action,
            market,
            country
        ]
            .filter(Boolean)
            .forEach(
                function (element) {

                    element.addEventListener(
                        "input",
                        update
                    );

                    element.addEventListener(
                        "change",
                        update
                    );
                }
            );
    }

    /* ======================================================
       CATEGORY CARDS
    ====================================================== */

    function renderCategoryCards() {

        const containers =
            $$(
                "#luxuryCategories, " +
                "#luxury-categories, " +
                "[data-luxury-categories]"
            );

        containers.forEach(
            function (container) {

                container.innerHTML =
                    CATEGORIES.map(
                        function (category) {

                            return `
                                <button
                                    type="button"
                                    class="luxury-category-card"
                                    data-luxury-category-card
                                    data-category="${escapeHTML(category.id)}"
                                >
                                    <span
                                        style="
                                            font-size:32px;
                                            display:block;
                                        "
                                    >
                                        ${category.icon}
                                    </span>

                                    <span>
                                        ${escapeHTML(
                                            category.name
                                        )}
                                    </span>
                                </button>
                            `;
                        }
                    ).join("");

                $$(
                    "[data-luxury-category-card]",
                    container
                ).forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                const category =
                                    button.dataset.category;

                                const select =
                                    $(
                                        "#luxuryCategory, " +
                                        "#luxury-category, " +
                                        "#luxuryCategorySelect, " +
                                        "[data-luxury-category]"
                                    );

                                if (select) {

                                    select.value =
                                        category;

                                    select.dispatchEvent(
                                        new Event(
                                            "change"
                                        )
                                    );
                                }

                                renderListings(
                                    filterListings(
                                        {
                                            category:
                                                category
                                        }
                                    )
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    /* ======================================================
       TERMS BUTTONS
    ====================================================== */

    function initializeTermsButtons() {

        $$(
            "[data-luxury-terms], " +
            "#luxuryTermsButton, " +
            "#luxury-terms-button"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    showTerms
                );
            }
        );
    }

    /* ======================================================
       ACTION BUTTONS
    ====================================================== */

    function initializeActionButtons() {

        $$(
            "[data-luxury-action-button]"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            button.dataset.luxuryActionButton;

                        if (
                            !getAction(action)
                        ) {
                            return;
                        }

                        $(
                            "[data-luxury-action-button].active"
                        )?.classList.remove(
                            "active"
                        );

                        button.classList.add(
                            "active"
                        );

                        const actionSelect =
                            $(
                                "#luxuryAction, " +
                                "#luxury-action, " +
                                "#luxuryActionSelect"
                            );

                        if (actionSelect) {

                            actionSelect.value =
                                action;

                            actionSelect.dispatchEvent(
                                new Event(
                                    "change"
                                )
                            );
                        }
                    }
                );
            }
        );
    }

    /* ======================================================
       MARKET BUTTONS
    ====================================================== */

    function initializeMarketButtons() {

        $$(
            "[data-luxury-market]"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const market =
                            button.dataset.luxuryMarket;

                        saveSettings(
                            {
                                market:
                                    market
                            }
                        );

                        $$(
                            "[data-luxury-market]"
                        ).forEach(
                            function (item) {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );

                        button.classList.add(
                            "active"
                        );
                    }
                );
            }
        );
    }

    /* ======================================================
       CLEAR DATA BUTTON
       Only luxury system storage
    ====================================================== */

    function initializeClearButton() {

        $$(
            "[data-luxury-clear-data]"
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const confirmed =
                            window.confirm(
                                "This will delete Luxury Lifestyle listings stored on this device. Continue?"
                            );

                        if (!confirmed) {
                            return;
                        }

                        localStorage.removeItem(
                            STORAGE_KEY
                        );

                        localStorage.removeItem(
                            MEDIA_KEY
                        );

                        notify(
                            "Luxury Lifestyle local data cleared."
                        );

                        renderListings();
                    }
                );
            }
        );
    }

    /* ======================================================
       GLOBAL EVENTS
    ====================================================== */

    function initializeGlobalEvents() {

        document.addEventListener(
            "click",
            function (event) {

                const terms =
                    event.target.closest(
                        "[data-luxury-open-terms]"
                    );

                if (terms) {
                    showTerms();
                }

                const publish =
                    event.target.closest(
                        "[data-luxury-publish-id]"
                    );

                if (publish) {

                    try {

                        publishListing(
                            publish.dataset.luxuryPublishId
                        );

                        renderListings();

                        notify(
                            "Listing published."
                        );

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            }
        );
    }

    /* ======================================================
       INITIALIZATION
    ====================================================== */

    function initialize() {

        console.log(
            SYSTEM_NAME +
            " — " +
            MODULE_NAME +
            " v" +
            VERSION +
            " loaded."
        );

        initializeCountrySelects();

        initializeCategorySelects();

        initializeActionSelects();

        initializeConditionSelects();

        initializeForms();

        initializeFilters();

        initializeTermsButtons();

        initializeActionButtons();

        initializeMarketButtons();

        initializeClearButton();

        initializeGlobalEvents();

        renderCategoryCards();

        renderListings();

        /*
         * Terms are not forced open automatically.
         * They are required when publishing/creating
         * a listing.
         */

        console.log(
            "[Luxury Lifestyle] Countries:",
            getCountries().length
        );

        console.log(
            "[Luxury Lifestyle] Listings:",
            getListings().length
        );

        console.log(
            "[Luxury Lifestyle] Terms accepted:",
            termsAccepted()
        );
    }

    /* ======================================================
       PUBLIC API
    ====================================================== */

    window.ALON_LUXURY_LIFESTYLE = {

        version:
            VERSION,

        systemName:
            SYSTEM_NAME,

        moduleName:
            MODULE_NAME,

        categories:
            CATEGORIES,

        actions:
            ACTIONS,

        conditions:
            CONDITIONS,

        mediaTypes:
            MEDIA_TYPES,

        status:
            STATUS,

        terms:
            TERMS,

        getCountries:
            getCountries,

        getCountryName:
            getCountryName,

        getCountryCode:
            getCountryCode,

        getCountryFlag:
            getCountryFlag,

        getCallingCode:
            getCallingCode,

        getSettings:
            getSettings,

        saveSettings:
            saveSettings,

        termsAccepted:
            termsAccepted,

        acceptTerms:
            acceptTerms,

        showTerms:
            showTerms,

        getListings:
            getListings,

        getListing:
            getListing,

        createListing:
            createListing,

        addListing:
            addListing,

        updateListing:
            updateListing,

        deleteListing:
            deleteListing,

        publishListing:
            publishListing,

        setStatus:
            setStatus,

        addMedia:
            addMedia,

        removeMedia:
            removeMedia,

        getMedia:
            getMedia,

        filterListings:
            filterListings,

        searchListings:
            searchListings,

        statistics:
            statistics,

        renderListings:
            renderListings,

        renderCategoryCards:
            renderCategoryCards
    };

    /* ======================================================
       START
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }

})();