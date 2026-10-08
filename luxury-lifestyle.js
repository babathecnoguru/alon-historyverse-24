/*
============================================================
 ALON HISTORYVERSE 24
 LUXURY LIFESTYLE / BRAND PROMOTER
 File: luxury-lifestyle.js
 Version: 2.1.0
 Owner: Baba Thecno Guru

 IMPORTANT
 ------------------------------------------------------------
 1. This system is separate from Marketplace and Jobs.
 2. marketplace-countries.js is READ-ONLY.
 3. Existing Marketplace/Jobs files are NOT modified.
 4. No payment is processed by this frontend.
 5. Real high-value transactions require secure backend,
    verification and applicable legal compliance.
 6. Every Luxury item has its own unique Item ID/folder.
 7. Item media, details, saves and conversations are kept
    separated by Item ID.
 8. Current frontend identity/chat uses localStorage.
============================================================
*/

(function () {
    "use strict";

    /* ======================================================
       CONSTANTS
    ====================================================== */

    const VERSION = "2.1.0";

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

    const PROFILE_KEY =
        "alon_historyverse_luxury_lifestyle_profile";

    const SAVED_KEY =
        "alon_historyverse_luxury_lifestyle_saved_items";

    const MESSAGES_KEY =
        "alon_historyverse_luxury_lifestyle_messages";

    const CHAT_USER_KEY =
        "alon_historyverse_luxury_lifestyle_chat_user";

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
       LOCAL PROFILE / USER ID
    ====================================================== */

    function getChatUser() {

        let user =
            readJSON(
                CHAT_USER_KEY,
                null
            );

        if (
            !user ||
            !user.id
        ) {

            user = {

                id:
                    id("luxury_user"),

                name:
                    "Luxury User",

                createdAt:
                    now()
            };

            writeJSON(
                CHAT_USER_KEY,
                user
            );
        }

        return user;
    }

    function setChatUser(
        userData
    ) {

        const current =
            getChatUser();

        const next =
            Object.assign(
                {},
                current,
                userData || {}
            );

        if (!next.id) {
            next.id =
                id("luxury_user");
        }

        if (!next.name) {
            next.name =
                "Luxury User";
        }

        writeJSON(
            CHAT_USER_KEY,
            next
        );

        writeJSON(
            PROFILE_KEY,
            next
        );

        return next;
    }

    function getProfile() {

        return readJSON(
            PROFILE_KEY,
            getChatUser()
        );
    }

    function getCurrentUserId() {

        const user =
            getChatUser();

        return text(user.id);
    }

    function getListingSellerId(
        listing
    ) {

        if (!listing) {
            return "";
        }

        return text(
            listing.ownerId ||
            listing.sellerId ||
            listing.ownerProfileId ||
            (
                listing.ownerName
                    ? "owner_" +
                      listing.ownerName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "_")
                : ""
            ) ||
            (
                listing.companyName
                    ? "company_" +
                      listing.companyName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "_")
                : ""
            ) ||
            "seller_" + listing.id
        );
    }

    function isListingOwner(
        listing
    ) {

        if (!listing) {
            return false;
        }

        return (
            getListingSellerId(listing) ===
            getCurrentUserId()
        );
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

        const owner =
            getChatUser();

        const listingId =
            id("luxury");

        const listing = {

            id:
                listingId,

            itemId:
                listingId,

            itemFolderId:
                "luxury_item_folder_" +
                listingId,

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

            state:
                text(data.state),

            region:
                text(data.region),

            city:
                text(
                    data.city ||
                    settings.city
                ),

            serviceLocation:
                text(data.serviceLocation),

            availabilityCountry:
                text(data.availabilityCountry),

            availabilityCountryCode:
                text(data.availabilityCountryCode),

            availabilityState:
                text(data.availabilityState),

            availabilityRegion:
                text(data.availabilityRegion),

            availabilityCity:
                text(data.availabilityCity),

            availabilityLocation:
                text(data.availabilityLocation),

            customerRequiredCountry:
                text(data.customerRequiredCountry),

            customerRequiredCountryCode:
                text(data.customerRequiredCountryCode),

            customerRequiredState:
                text(data.customerRequiredState),

            customerRequiredRegion:
                text(data.customerRequiredRegion),

            customerRequiredCity:
                text(data.customerRequiredCity),

            customerRequiredLocation:
                text(data.customerRequiredLocation),

            canProvideOutsideArea:
                text(data.canProvideOutsideArea),

            ownerId:
                text(
                    data.ownerId ||
                    owner.id
                ),

            sellerId:
                text(
                    data.sellerId ||
                    data.ownerId ||
                    owner.id
                ),

            ownerProfileId:
                text(
                    data.ownerProfileId ||
                    owner.id
                ),

            ownerType:
                text(data.ownerType),

            ownerName:
                text(
                    data.ownerName ||
                    owner.name
                ),

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

            savedBy:
                [],

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

        const current =
            listings[index];

        const merged =
            Object.assign(
                {},
                current,
                updates || {},
                {
                    updatedAt: now()
                }
            );

        listings[index] =
            merged;

        saveListings(listings);

        return listings[index];
    }

    /* ======================================================
       OWNER CHECK
    ====================================================== */

    function requireListingOwner(
        listingId
    ) {

        const listing =
            getListing(listingId);

        if (!listing) {

            throw new Error(
                "Listing not found."
            );
        }

        if (
            !isListingOwner(listing)
        ) {

            throw new Error(
                "Only the item owner can perform this action."
            );
        }

        return listing;
    }

    /* ======================================================
       DELETE
    ====================================================== */

    function deleteListing(
        listingId
    ) {

        const listing =
            requireListingOwner(
                listingId
            );

        const listings =
            getListings();

        const next =
            listings.filter(
                function (item) {
                    return item.id !== listingId;
                }
            );

        if (
            next.length ===
            listings.length
        ) {
            return false;
        }

        saveListings(next);

        const saved =
            getSavedItems();

        saveSavedItems(
            saved.filter(
                function (itemId) {
                    return itemId !== listingId;
                }
            )
        );

        const media =
            getMedia();

        saveMedia(
            media.filter(
                function (item) {
                    return item.listingId !== listingId;
                }
            )
        );

        deleteItemConversations(
            listing
        );

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

        requireListingOwner(
            listingId
        );

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

        requireListingOwner(
            listingId
        );

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
            Array.isArray(media)
                ? media
                : []
        );
    }

    function getListingMedia(
        listingId
    ) {

        const listing =
            getListing(listingId);

        if (!listing) {
            return [];
        }

        const ownMedia =
            Array.isArray(listing.media)
                ? listing.media
                : [];

        const stored =
            getMedia().filter(
                function (item) {
                    return (
                        item.listingId ===
                        listingId
                    );
                }
            );

        const combined =
            ownMedia.concat(
                stored
            );

        const seen = {};

        return combined.filter(
            function (item) {

                if (!item || !item.id) {
                    return false;
                }

                if (seen[item.id]) {
                    return false;
                }

                seen[item.id] = true;

                return true;
            }
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

        requireListingOwner(
            listingId
        );

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

            itemFolderId:
                listing.itemFolderId ||
                "luxury_item_folder_" +
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

        requireListingOwner(
            listingId
        );

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
       SAVE ITEM
    ====================================================== */

    function getSavedItems() {

        const data =
            readJSON(
                SAVED_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }

    function saveSavedItems(
        itemIds
    ) {

        return writeJSON(
            SAVED_KEY,
            Array.isArray(itemIds)
                ? itemIds
                : []
        );
    }

    function isItemSaved(
        listingId
    ) {

        return getSavedItems()
            .includes(listingId);
    }

    function saveItem(
        listingId
    ) {

        const listing =
            getListing(listingId);

        if (!listing) {
            return false;
        }

        const saved =
            getSavedItems();

        if (!saved.includes(listingId)) {

            saved.push(
                listingId
            );

            saveSavedItems(
                saved
            );
        }

        return true;
    }

    function unsaveItem(
        listingId
    ) {

        saveSavedItems(
            getSavedItems().filter(
                function (itemId) {
                    return itemId !== listingId;
                }
            )
        );

        return true;
    }

    function toggleSaveItem(
        listingId
    ) {

        if (
            isItemSaved(listingId)
        ) {

            unsaveItem(
                listingId
            );

            return false;
        }

        saveItem(
            listingId
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
                    text(listing.city).toLowerCase() !==
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

                if (
                    filters.ownerOnly === true &&
                    !isListingOwner(listing)
                ) {
                    return false;
                }

                if (
                    filters.savedOnly === true &&
                    !isItemSaved(listing.id)
                ) {
                    return false;
                }

                if (query) {

                    const searchable = [

                        listing.id,

                        listing.itemId,

                        listing.title,

                        listing.description,

                        listing.brand,

                        listing.model,

                        listing.categoryName,

                        listing.country,

                        listing.state,

                        listing.region,

                        listing.city,

                        listing.serviceLocation,

                        listing.availabilityCountry,

                        listing.availabilityState,

                        listing.availabilityCity,

                        listing.availabilityLocation,

                        listing.customerRequiredCountry,

                        listing.customerRequiredState,

                        listing.customerRequiredCity,

                        listing.customerRequiredLocation,

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

                        countryFlag:
                            valueFrom(
                                form,
                                [
                                    "countryFlag"
                                ]
                            ),

                        callingCode:
                            valueFrom(
                                form,
                                [
                                    "callingCode"
                                ]
                            ),

                        state:
                            valueFrom(
                                form,
                                [
                                    "state"
                                ]
                            ),

                        region:
                            valueFrom(
                                form,
                                [
                                    "region"
                                ]
                            ),

                        city:
                            valueFrom(
                                form,
                                [
                                    "city"
                                ]
                            ),

                        serviceLocation:
                            valueFrom(
                                form,
                                [
                                    "serviceLocation",
                                    "location"
                                ]
                            ),

                        availabilityCountry:
                            valueFrom(
                                form,
                                [
                                    "availabilityCountry"
                                ]
                            ),

                        availabilityCountryCode:
                            valueFrom(
                                form,
                                [
                                    "availabilityCountryCode"
                                ]
                            ),

                        availabilityState:
                            valueFrom(
                                form,
                                [
                                    "availabilityState"
                                ]
                            ),

                        availabilityRegion:
                            valueFrom(
                                form,
                                [
                                    "availabilityRegion"
                                ]
                            ),

                        availabilityCity:
                            valueFrom(
                                form,
                                [
                                    "availabilityCity"
                                ]
                            ),

                        availabilityLocation:
                            valueFrom(
                                form,
                                [
                                    "availabilityLocation"
                                ]
                            ),

                        customerRequiredCountry:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredCountry"
                                ]
                            ),

                        customerRequiredCountryCode:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredCountryCode"
                                ]
                            ),

                        customerRequiredState:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredState"
                                ]
                            ),

                        customerRequiredRegion:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredRegion"
                                ]
                            ),

                        customerRequiredCity:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredCity"
                                ]
                            ),

                        customerRequiredLocation:
                            valueFrom(
                                form,
                                [
                                    "customerRequiredLocation"
                                ]
                            ),

                        canProvideOutsideArea:
                            valueFrom(
                                form,
                                [
                                    "canProvideOutsideArea"
                                ]
                            ),

                        ownerId:
                            valueFrom(
                                form,
                                [
                                    "ownerId"
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
                        "Item created in its own Luxury Folder."
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
       ITEM FOLDER HELPERS
    ====================================================== */

    function getItemFolderName(
        listing
    ) {

        if (!listing) {
            return "Luxury Item";
        }

        return (
            listing.categoryIcon ||
            "✨"
        ) +
        " " +
        (
            listing.title ||
            "Luxury Item"
        );
    }

    function getItemFolderData(
        listing
    ) {

        return {

            folderId:
                listing.itemFolderId ||
                "luxury_item_folder_" +
                listing.id,

            itemId:
                listing.itemId ||
                listing.id,

            title:
                listing.title || "Luxury Item",

            category:
                listing.categoryName || "",

            sellerId:
                getListingSellerId(listing),

            media:
                getListingMedia(listing.id),

            saved:
                isItemSaved(listing.id),

            owner:
                isListingOwner(listing)
        };
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
            getListingMedia(
                listing.id
            );

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
                        style="
                            width:100%;
                            height:220px;
                            object-fit:cover;
                            display:block;
                        "
                    >
                `
                : `
                    <div
                        style="
                            min-height:220px;
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
                listing.state || listing.region,
                listing.city
            ]
                .filter(Boolean)
                .join(" ");

        const availability =
            [
                listing.availabilityCountry,
                listing.availabilityState ||
                listing.availabilityRegion,
                listing.availabilityCity,
                listing.availabilityLocation
            ]
                .filter(Boolean)
                .join(" / ");

        const requiredArea =
            [
                listing.customerRequiredCountry,
                listing.customerRequiredState ||
                listing.customerRequiredRegion,
                listing.customerRequiredCity,
                listing.customerRequiredLocation
            ]
                .filter(Boolean)
                .join(" / ");

        const owner =
            isListingOwner(listing);

        const saved =
            isItemSaved(listing.id);

        const folderId =
            listing.itemFolderId ||
            "luxury_item_folder_" +
            listing.id;

        return `
            <article
                class="luxury-listing-card luxury-item-folder"
                data-listing-id="${escapeHTML(listing.id)}"
                data-item-id="${escapeHTML(
                    listing.itemId || listing.id
                )}"
                data-item-folder="${escapeHTML(folderId)}"
                style="
                    border:1px solid rgba(215,179,90,.35);
                    border-radius:16px;
                    overflow:hidden;
                    background:#080d16;
                    margin-bottom:22px;
                    box-shadow:0 12px 40px rgba(0,0,0,.25);
                "
            >

                <div
                    style="
                        padding:9px 14px;
                        background:rgba(215,179,90,.08);
                        border-bottom:1px solid rgba(215,179,90,.22);
                        font-size:12px;
                        display:flex;
                        justify-content:space-between;
                        gap:10px;
                        flex-wrap:wrap;
                    "
                >
                    <span>
                        📁 Luxury Item Folder
                    </span>

                    <span>
                        ID:
                        ${escapeHTML(
                            listing.itemId ||
                            listing.id
                        )}
                    </span>
                </div>

                <div
                    class="luxury-listing-media"
                    style="
                        min-height:220px;
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

                    ${
                        availability
                            ? `
                                <div
                                    style="
                                        margin-top:8px;
                                        font-size:13px;
                                    "
                                >
                                    🟢 Available:
                                    ${escapeHTML(
                                        availability
                                    )}
                                </div>
                            `
                            : ""
                    }

                    ${
                        requiredArea
                            ? `
                                <div
                                    style="
                                        margin-top:8px;
                                        font-size:13px;
                                    "
                                >
                                    🎯 Customer Need:
                                    ${escapeHTML(
                                        requiredArea
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
                            data-luxury-open-folder
                            data-id="${escapeHTML(listing.id)}"
                        >
                            📁 Open Item Folder
                        </button>

                        <button
                            type="button"
                            data-luxury-view
                            data-id="${escapeHTML(listing.id)}"
                        >
                            View
                        </button>

                        <button
                            type="button"
                            data-luxury-message-seller
                            data-id="${escapeHTML(listing.id)}"
                        >
                            💬 Message Seller
                        </button>

                        <button
                            type="button"
                            data-luxury-save
                            data-id="${escapeHTML(listing.id)}"
                        >
                            ${
                                saved
                                    ? "★ Saved"
                                    : "☆ Save"
                            }
                        </button>

                        ${
                            owner &&
                            listing.status === STATUS.DRAFT
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

                        ${
                            owner
                                ? `
                                    <button
                                        type="button"
                                        data-luxury-edit
                                        data-id="${escapeHTML(listing.id)}"
                                    >
                                        ✏️ Edit
                                    </button>

                                    <button
                                        type="button"
                                        data-luxury-delete
                                        data-id="${escapeHTML(listing.id)}"
                                    >
                                        Delete
                                    </button>
                                `
                                : ""
                        }

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
            "[data-luxury-open-folder]",
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

                        showItemFolder(
                            listing
                        );
                    }
                );
            }
        );

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
            "[data-luxury-message-seller]",
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

                        showLuxuryChat(
                            listing
                        );
                    }
                );
            }
        );

        $$(
            "[data-luxury-save]",
            container
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const saved =
                            toggleSaveItem(
                                button.dataset.id
                            );

                        button.textContent =
                            saved
                                ? "★ Saved"
                                : "☆ Save";

                        notify(
                            saved
                                ? "Item saved."
                                : "Item removed from Saved Items."
                        );
                    }
                );
            }
        );

        $$(
            "[data-luxury-edit]",
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

                        if (
                            !isListingOwner(
                                listing
                            )
                        ) {

                            alert(
                                "Only the item owner can edit this item."
                            );

                            return;
                        }

                        showEditListing(
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

                        const listing =
                            getListing(
                                button.dataset.id
                            );

                        if (!listing) {
                            return;
                        }

                        if (
                            !isListingOwner(
                                listing
                            )
                        ) {

                            alert(
                                "Only the item owner can delete this item."
                            );

                            return;
                        }

                        const confirmed =
                            window.confirm(
                                "Delete this Luxury Item Folder and its item data?"
                            );

                        if (!confirmed) {
                            return;
                        }

                        try {

                            deleteListing(
                                button.dataset.id
                            );

                            notify(
                                "Luxury Item Folder deleted."
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
    }

    /* ======================================================
       ITEM FOLDER
    ====================================================== */

    function showItemFolder(
        listing
    ) {

        let modal =
            $("#luxuryItemFolderModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxuryItemFolderModal";

            document.body.appendChild(
                modal
            );
        }

        const media =
            getListingMedia(
                listing.id
            );

        const owner =
            isListingOwner(
                listing
            );

        const saved =
            isItemSaved(
                listing.id
            );

        const sellerId =
            getListingSellerId(
                listing
            );

        const availability =
            [
                listing.availabilityCountry,
                listing.availabilityState ||
                listing.availabilityRegion,
                listing.availabilityCity,
                listing.availabilityLocation
            ]
                .filter(Boolean)
                .join(" / ");

        const requiredArea =
            [
                listing.customerRequiredCountry,
                listing.customerRequiredState ||
                listing.customerRequiredRegion,
                listing.customerRequiredCity,
                listing.customerRequiredLocation
            ]
                .filter(Boolean)
                .join(" / ");

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:100001;
                    background:rgba(0,0,0,.88);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:12px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(980px,100%);
                        max-height:94vh;
                        overflow:auto;
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:18px;
                        color:#fff;
                        box-sizing:border-box;
                    "
                >

                    <div
                        style="
                            position:sticky;
                            top:0;
                            z-index:2;
                            padding:15px 18px;
                            background:#05080f;
                            border-bottom:1px solid rgba(215,179,90,.3);
                            display:flex;
                            justify-content:space-between;
                            gap:12px;
                            align-items:center;
                        "
                    >

                        <div>
                            <div
                                style="
                                    color:#d7b35a;
                                    font-size:12px;
                                "
                            >
                                📁 INDIVIDUAL LUXURY ITEM FOLDER
                            </div>

                            <h2
                                style="
                                    color:#f0d27a;
                                    margin:5px 0 0;
                                "
                            >
                                ${escapeHTML(
                                    listing.categoryIcon || "✨"
                                )}
                                ${escapeHTML(
                                    listing.title ||
                                    "Luxury Item"
                                )}
                            </h2>
                        </div>

                        <button
                            type="button"
                            data-close-luxury-folder
                            style="
                                width:40px;
                                height:40px;
                                border-radius:50%;
                                background:transparent;
                                color:#f0d27a;
                                border:1px solid #d7b35a;
                                font-size:24px;
                                flex:none;
                            "
                        >
                            ×
                        </button>

                    </div>

                    <div
                        style="
                            padding:18px;
                        "
                    >

                        <div
                            style="
                                padding:13px;
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:10px;
                                margin-bottom:15px;
                                background:rgba(215,179,90,.04);
                            "
                        >

                            <div>
                                <strong>Item ID:</strong>
                                ${escapeHTML(
                                    listing.itemId ||
                                    listing.id
                                )}
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:12px;
                                    opacity:.7;
                                    word-break:break-all;
                                "
                            >
                                Folder:
                                ${escapeHTML(
                                    listing.itemFolderId ||
                                    "luxury_item_folder_" +
                                    listing.id
                                )}
                            </div>

                            <div
                                style="
                                    margin-top:5px;
                                    font-size:12px;
                                    opacity:.7;
                                "
                            >
                                Seller ID:
                                ${escapeHTML(
                                    sellerId
                                )}
                            </div>

                        </div>

                        <div
                            style="
                                display:flex;
                                flex-wrap:wrap;
                                gap:8px;
                                margin-bottom:18px;
                            "
                        >

                            <button
                                type="button"
                                data-folder-save
                                data-id="${escapeHTML(listing.id)}"
                            >
                                ${
                                    saved
                                        ? "★ Saved"
                                        : "☆ Save Item"
                                }
                            </button>

                            <button
                                type="button"
                                data-folder-chat
                                data-id="${escapeHTML(listing.id)}"
                            >
                                💬 Private Chat
                            </button>

                            ${
                                owner
                                    ? `
                                        <button
                                            type="button"
                                            data-folder-edit
                                            data-id="${escapeHTML(listing.id)}"
                                        >
                                            ✏️ Edit Item
                                        </button>
                                    `
                                    : ""
                            }

                        </div>

                        <section
                            style="
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:12px;
                                padding:15px;
                                margin-bottom:14px;
                            "
                        >

                            <h3
                                style="
                                    color:#f0d27a;
                                    margin-top:0;
                                "
                            >
                                📋 Item Details
                            </h3>

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

                            <p>
                                <strong>Status:</strong>
                                ${escapeHTML(
                                    listing.status
                                )}
                            </p>

                            <p>
                                ${escapeHTML(
                                    listing.description
                                )}
                            </p>

                        </section>

                        <section
                            style="
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:12px;
                                padding:15px;
                                margin-bottom:14px;
                            "
                        >

                            <h3
                                style="
                                    color:#f0d27a;
                                    margin-top:0;
                                "
                            >
                                📍 Service / Availability
                            </h3>

                            ${
                                availability
                                    ? `
                                        <p>
                                            🟢
                                            ${escapeHTML(
                                                availability
                                            )}
                                        </p>
                                    `
                                    : `
                                        <p>
                                            Availability location not specified.
                                        </p>
                                    `
                            }

                            ${
                                listing.serviceLocation
                                    ? `
                                        <p>
                                            📌 Service Location:
                                            ${escapeHTML(
                                                listing.serviceLocation
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                listing.canProvideOutsideArea
                                    ? `
                                        <p>
                                            🌐 Can provide outside area:
                                            ${escapeHTML(
                                                listing.canProvideOutsideArea
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </section>

                        <section
                            style="
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:12px;
                                padding:15px;
                                margin-bottom:14px;
                            "
                        >

                            <h3
                                style="
                                    color:#f0d27a;
                                    margin-top:0;
                                "
                            >
                                🎯 Customer Required Area
                            </h3>

                            ${
                                requiredArea
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                requiredArea
                                            )}
                                        </p>
                                    `
                                    : `
                                        <p>
                                            Customer required area not specified.
                                        </p>
                                    `
                            }

                        </section>

                        <section
                            style="
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:12px;
                                padding:15px;
                                margin-bottom:14px;
                            "
                        >

                            <h3
                                style="
                                    color:#f0d27a;
                                    margin-top:0;
                                "
                            >
                                👤 Owner / Seller
                            </h3>

                            ${
                                listing.ownerName
                                    ? `
                                        <p>
                                            <strong>Owner:</strong>
                                            ${escapeHTML(
                                                listing.ownerName
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                listing.companyName
                                    ? `
                                        <p>
                                            <strong>Company:</strong>
                                            ${escapeHTML(
                                                listing.companyName
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                listing.ownerType
                                    ? `
                                        <p>
                                            <strong>Type:</strong>
                                            ${escapeHTML(
                                                listing.ownerType
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                listing.contactEmail
                                    ? `
                                        <p>
                                            <strong>Email:</strong>
                                            ${escapeHTML(
                                                listing.contactEmail
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                            ${
                                listing.contactPhone
                                    ? `
                                        <p>
                                            <strong>Phone:</strong>
                                            ${escapeHTML(
                                                listing.contactPhone
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </section>

                        <section
                            style="
                                border:1px solid rgba(215,179,90,.25);
                                border-radius:12px;
                                padding:15px;
                            "
                        >

                            <h3
                                style="
                                    color:#f0d27a;
                                    margin-top:0;
                                "
                            >
                                🖼️ This Item's Media
                            </h3>

                            ${
                                media.length
                                    ? `
                                        <div
                                            style="
                                                display:grid;
                                                grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
                                                gap:10px;
                                            "
                                        >
                                            ${media.map(
                                                function (item) {

                                                    if (
                                                        (
                                                            item.type === "photo" ||
                                                            item.type === "hd-photo"
                                                        ) &&
                                                        item.url
                                                    ) {

                                                        return `
                                                            <div
                                                                style="
                                                                    border:1px solid rgba(215,179,90,.2);
                                                                    border-radius:10px;
                                                                    overflow:hidden;
                                                                "
                                                            >
                                                                <img
                                                                    src="${escapeHTML(item.url)}"
                                                                    alt="${escapeHTML(item.title || "")}"
                                                                    style="
                                                                        width:100%;
                                                                        height:150px;
                                                                        object-fit:cover;
                                                                        display:block;
                                                                    "
                                                                >

                                                                <div
                                                                    style="
                                                                        padding:7px;
                                                                        font-size:11px;
                                                                    "
                                                                >
                                                                    ${escapeHTML(
                                                                        item.type
                                                                    )}
                                                                </div>
                                                            </div>
                                                        `;
                                                    }

                                                    if (
                                                        item.type === "video" &&
                                                        item.url
                                                    ) {

                                                        return `
                                                            <div>
                                                                <video
                                                                    controls
                                                                    style="
                                                                        width:100%;
                                                                        border-radius:10px;
                                                                    "
                                                                >
                                                                    <source
                                                                        src="${escapeHTML(item.url)}"
                                                                    >
                                                                </video>
                                                            </div>
                                                        `;
                                                    }

                                                    return `
                                                        <div
                                                            style="
                                                                padding:15px;
                                                                border:1px solid rgba(215,179,90,.2);
                                                                border-radius:10px;
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
                                    : `
                                        <p>
                                            इस item के folder में अभी media नहीं है।
                                        </p>
                                    `
                            }

                        </section>

                    </div>

                </div>

            </div>
        `;

        modal.style.display =
            "block";

        const close =
            $(
                "[data-close-luxury-folder]",
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

        const saveButton =
            $(
                "[data-folder-save]",
                modal
            );

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                function () {

                    const isSaved =
                        toggleSaveItem(
                            listing.id
                        );

                    saveButton.textContent =
                        isSaved
                            ? "★ Saved"
                            : "☆ Save Item";

                    notify(
                        isSaved
                            ? "Item saved."
                            : "Item removed from Saved Items."
                    );
                }
            );
        }

        const chatButton =
            $(
                "[data-folder-chat]",
                modal
            );

        if (chatButton) {

            chatButton.addEventListener(
                "click",
                function () {

                    showLuxuryChat(
                        listing
                    );
                }
            );
        }

        const editButton =
            $(
                "[data-folder-edit]",
                modal
            );

        if (editButton) {

            editButton.addEventListener(
                "click",
                function () {

                    if (
                        isListingOwner(
                            listing
                        )
                    ) {

                        showEditListing(
                            listing
                        );
                    }
                }
            );
        }
    }

    /* ======================================================
       EDIT LISTING
    ====================================================== */

    function showEditListing(
        listing
    ) {

        if (
            !isListingOwner(
                listing
            )
        ) {

            alert(
                "Only the item owner can edit this item."
            );

            return;
        }

        let modal =
            $("#luxuryEditListingModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxuryEditListingModal";

            document.body.appendChild(
                modal
            );
        }

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:100002;
                    background:rgba(0,0,0,.88);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:15px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(760px,100%);
                        max-height:92vh;
                        overflow:auto;
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:16px;
                        padding:20px;
                        color:#fff;
                        box-sizing:border-box;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                            gap:10px;
                        "
                    >

                        <h2
                            style="
                                color:#f0d27a;
                                margin-top:0;
                            "
                        >
                            ✏️ Edit Luxury Item
                        </h2>

                        <button
                            type="button"
                            data-close-luxury-edit
                        >
                            ×
                        </button>

                    </div>

                    <p
                        style="
                            font-size:12px;
                            opacity:.7;
                            word-break:break-all;
                        "
                    >
                        Item ID:
                        ${escapeHTML(
                            listing.itemId ||
                            listing.id
                        )}
                    </p>

                    <form
                        id="luxuryEditForm"
                    >

                        <label>
                            Title
                            <input
                                name="title"
                                value="${escapeHTML(
                                    listing.title
                                )}"
                                required
                            >
                        </label>

                        <label>
                            Description
                            <textarea
                                name="description"
                                rows="5"
                            >${escapeHTML(
                                listing.description
                            )}</textarea>
                        </label>

                        <label>
                            Brand
                            <input
                                name="brand"
                                value="${escapeHTML(
                                    listing.brand
                                )}"
                            >
                        </label>

                        <label>
                            Model
                            <input
                                name="model"
                                value="${escapeHTML(
                                    listing.model
                                )}"
                            >
                        </label>

                        <label>
                            Price
                            <input
                                name="price"
                                value="${escapeHTML(
                                    listing.price
                                )}"
                            >
                        </label>

                        <label>
                            Currency
                            <input
                                name="currency"
                                value="${escapeHTML(
                                    listing.currency
                                )}"
                            >
                        </label>

                        <label>
                            Service / Asset Location
                            <input
                                name="serviceLocation"
                                value="${escapeHTML(
                                    listing.serviceLocation
                                )}"
                            >
                        </label>

                        <label>
                            Availability Country
                            <input
                                name="availabilityCountry"
                                value="${escapeHTML(
                                    listing.availabilityCountry
                                )}"
                            >
                        </label>

                        <label>
                            Availability State / Region
                            <input
                                name="availabilityState"
                                value="${escapeHTML(
                                    listing.availabilityState ||
                                    listing.availabilityRegion
                                )}"
                            >
                        </label>

                        <label>
                            Availability City
                            <input
                                name="availabilityCity"
                                value="${escapeHTML(
                                    listing.availabilityCity
                                )}"
                            >
                        </label>

                        <label>
                            Customer Required Country
                            <input
                                name="customerRequiredCountry"
                                value="${escapeHTML(
                                    listing.customerRequiredCountry
                                )}"
                            >
                        </label>

                        <label>
                            Customer Required State / Region
                            <input
                                name="customerRequiredState"
                                value="${escapeHTML(
                                    listing.customerRequiredState ||
                                    listing.customerRequiredRegion
                                )}"
                            >
                        </label>

                        <label>
                            Customer Required City
                            <input
                                name="customerRequiredCity"
                                value="${escapeHTML(
                                    listing.customerRequiredCity
                                )}"
                            >
                        </label>

                        <label>
                            Customer Required Location
                            <input
                                name="customerRequiredLocation"
                                value="${escapeHTML(
                                    listing.customerRequiredLocation
                                )}"
                            >
                        </label>

                        <label>
                            Can Provide Outside Area?
                            <input
                                name="canProvideOutsideArea"
                                value="${escapeHTML(
                                    listing.canProvideOutsideArea
                                )}"
                            >
                        </label>

                        <div
                            style="
                                display:flex;
                                gap:10px;
                                flex-wrap:wrap;
                                margin-top:15px;
                            "
                        >

                            <button
                                type="submit"
                            >
                                💾 Save Changes
                            </button>

                            <button
                                type="button"
                                data-close-luxury-edit
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;

        const style =
            document.createElement("style");

        style.dataset.luxuryEditStyle =
            "true";

        style.textContent = `
            #luxuryEditListingModal label {
                display:block;
                margin:12px 0;
                color:#e8e8e8;
            }

            #luxuryEditListingModal input,
            #luxuryEditListingModal textarea {
                width:100%;
                box-sizing:border-box;
                margin-top:6px;
                padding:10px;
                border:1px solid rgba(215,179,90,.35);
                border-radius:8px;
                background:#101722;
                color:#fff;
            }

            #luxuryEditListingModal button {
                padding:10px 15px;
                border:1px solid #d7b35a;
                border-radius:8px;
                background:#101722;
                color:#fff;
                cursor:pointer;
            }

            #luxuryEditListingModal form button[type="submit"] {
                background:#d7b35a;
                color:#05080f;
                font-weight:700;
            }
        `;

        if (
            !document.querySelector(
                "style[data-luxury-edit-style]"
            )
        ) {

            document.head.appendChild(
                style
            );
        }

        modal.style.display =
            "block";

        $$(
            "[data-close-luxury-edit]",
            modal
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        modal.style.display =
                            "none";
                    }
                );
            }
        );

        const form =
            $("#luxuryEditForm", modal);

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    try {

                        requireListingOwner(
                            listing.id
                        );

                        const updates = {

                            title:
                                valueFrom(
                                    form,
                                    ["title"]
                                ),

                            description:
                                valueFrom(
                                    form,
                                    ["description"]
                                ),

                            brand:
                                valueFrom(
                                    form,
                                    ["brand"]
                                ),

                            model:
                                valueFrom(
                                    form,
                                    ["model"]
                                ),

                            price:
                                valueFrom(
                                    form,
                                    ["price"]
                                ),

                            currency:
                                valueFrom(
                                    form,
                                    ["currency"]
                                ),

                            serviceLocation:
                                valueFrom(
                                    form,
                                    ["serviceLocation"]
                                ),

                            availabilityCountry:
                                valueFrom(
                                    form,
                                    ["availabilityCountry"]
                                ),

                            availabilityState:
                                valueFrom(
                                    form,
                                    ["availabilityState"]
                                ),

                            availabilityCity:
                                valueFrom(
                                    form,
                                    ["availabilityCity"]
                                ),

                            customerRequiredCountry:
                                valueFrom(
                                    form,
                                    ["customerRequiredCountry"]
                                ),

                            customerRequiredState:
                                valueFrom(
                                    form,
                                    ["customerRequiredState"]
                                ),

                            customerRequiredCity:
                                valueFrom(
                                    form,
                                    ["customerRequiredCity"]
                                ),

                            customerRequiredLocation:
                                valueFrom(
                                    form,
                                    ["customerRequiredLocation"]
                                ),

                            canProvideOutsideArea:
                                valueFrom(
                                    form,
                                    ["canProvideOutsideArea"]
                                )
                        };

                        updateListing(
                            listing.id,
                            updates
                        );

                        modal.style.display =
                            "none";

                        notify(
                            "Luxury Item updated."
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
            getListingMedia(
                listing.id
            );

        const availability =
            [
                listing.availabilityCountry,
                listing.availabilityState ||
                listing.availabilityRegion,
                listing.availabilityCity,
                listing.availabilityLocation
            ]
                .filter(Boolean)
                .join(" / ");

        const requiredArea =
            [
                listing.customerRequiredCountry,
                listing.customerRequiredState ||
                listing.customerRequiredRegion,
                listing.customerRequiredCity,
                listing.customerRequiredLocation
            ]
                .filter(Boolean)
                .join(" / ");

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
                        <strong>Item ID:</strong>
                        ${escapeHTML(
                            listing.itemId ||
                            listing.id
                        )}
                    </p>

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
                                            listing.state ||
                                            listing.region,
                                            listing.city
                                        ]
                                            .filter(Boolean)
                                            .join(" ")
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        availability
                            ? `
                                <p>
                                    <strong>Available In:</strong>
                                    ${escapeHTML(
                                        availability
                                    )}
                                </p>
                            `
                            : ""
                    }

                    ${
                        requiredArea
                            ? `
                                <p>
                                    <strong>Customer Needs In:</strong>
                                    ${escapeHTML(
                                        requiredArea
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

                    <div
                        style="
                            display:flex;
                            flex-wrap:wrap;
                            gap:8px;
                            margin:15px 0;
                        "
                    >

                        <button
                            type="button"
                            data-details-folder
                        >
                            📁 Open Item Folder
                        </button>

                        <button
                            type="button"
                            data-details-chat
                        >
                            💬 Message Seller
                        </button>

                    </div>

                    ${
                        media.length
                            ? `
                                <hr>

                                <h3>
                                    Media — This Item Only
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

        const folder =
            $(
                "[data-details-folder]",
                modal
            );

        if (folder) {

            folder.addEventListener(
                "click",
                function () {

                    modal.style.display =
                        "none";

                    showItemFolder(
                        listing
                    );
                }
            );
        }

        const chat =
            $(
                "[data-details-chat]",
                modal
            );

        if (chat) {

            chat.addEventListener(
                "click",
                function () {

                    showLuxuryChat(
                        listing
                    );
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

                        localStorage.removeItem(
                            SAVED_KEY
                        );

                        localStorage.removeItem(
                            MESSAGES_KEY
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
       PRIVATE MESSAGE SYSTEM
    ====================================================== */

    function getMessages() {

        const data =
            readJSON(
                MESSAGES_KEY,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }

    function saveMessages(
        messages
    ) {

        return writeJSON(
            MESSAGES_KEY,
            Array.isArray(messages)
                ? messages
                : []
        );
    }

    function getConversationId(
        listingId,
        sellerId,
        buyerId
    ) {

        return [
            "luxury_chat",
            listingId,
            sellerId,
            buyerId
        ]
            .map(
                function (value) {
                    return encodeURIComponent(
                        text(value)
                    );
                }
            )
            .join("_");
    }

    function getConversation(
        conversationId
    ) {

        return getMessages().find(
            function (conversation) {
                return (
                    conversation.id ===
                    conversationId
                );
            }
        ) || null;
    }

    function getConversationForListing(
        listing,
        buyerId
    ) {

        if (!listing) {
            return null;
        }

        const sellerId =
            getListingSellerId(
                listing
            );

        const buyer =
            text(
                buyerId ||
                getCurrentUserId()
            );

        const conversationId =
            getConversationId(
                listing.id,
                sellerId,
                buyer
            );

        return getConversation(
            conversationId
        );
    }

    function createConversation(
        listing,
        buyerId
    ) {

        if (!listing) {

            throw new Error(
                "Listing is required."
            );
        }

        const sellerId =
            getListingSellerId(
                listing
            );

        const buyer =
            text(
                buyerId ||
                getCurrentUserId()
            );

        if (!sellerId) {

            throw new Error(
                "Seller identity is missing."
            );
        }

        if (!buyer) {

            throw new Error(
                "Buyer identity is missing."
            );
        }

        if (
            sellerId ===
            buyer
        ) {

            throw new Error(
                "You cannot message yourself."
            );
        }

        const conversationId =
            getConversationId(
                listing.id,
                sellerId,
                buyer
            );

        const existing =
            getConversation(
                conversationId
            );

        if (existing) {
            return existing;
        }

        const currentUser =
            getChatUser();

        const conversation = {

            id:
                conversationId,

            listingId:
                listing.id,

            itemId:
                listing.itemId ||
                listing.id,

            itemFolderId:
                listing.itemFolderId ||
                "luxury_item_folder_" +
                listing.id,

            itemTitle:
                listing.title ||
                "Luxury Item",

            sellerId:
                sellerId,

            sellerName:
                listing.ownerName ||
                listing.companyName ||
                "Seller",

            buyerId:
                buyer,

            buyerName:
                currentUser.name ||
                "Buyer",

            messages:
                [],

            unreadForSeller:
                0,

            unreadForBuyer:
                0,

            createdAt:
                now(),

            updatedAt:
                now()
        };

        const all =
            getMessages();

        all.unshift(
            conversation
        );

        saveMessages(
            all
        );

        return conversation;
    }

    function sendLuxuryMessage(
        listingId,
        message
    ) {

        const listing =
            getListing(
                listingId
            );

        if (!listing) {

            throw new Error(
                "Item not found."
            );
        }

        const currentUser =
            getChatUser();

        const sellerId =
            getListingSellerId(
                listing
            );

        const senderId =
            text(
                currentUser.id
            );

        if (
            !senderId
        ) {

            throw new Error(
                "User identity is missing."
            );
        }

        if (
            senderId ===
            sellerId
        ) {

            throw new Error(
                "Seller cannot send a buyer message from this buyer chat."
            );
        }

        const conversation =
            createConversation(
                listing,
                senderId
            );

        const messages =
            getMessages();

        const index =
            messages.findIndex(
                function (item) {
                    return (
                        item.id ===
                        conversation.id
                    );
                }
            );

        if (index === -1) {

            throw new Error(
                "Conversation not found."
            );
        }

        const body =
            text(message);

        if (!body) {

            throw new Error(
                "Message cannot be empty."
            );
        }

        const messageObject = {

            id:
                id("luxury_msg"),

            senderId:
                senderId,

            senderName:
                currentUser.name ||
                "Luxury User",

            recipientId:
                sellerId,

            text:
                body,

            createdAt:
                now(),

            read:
                false
        };

        if (
            !Array.isArray(
                messages[index].messages
            )
        ) {

            messages[index].messages =
                [];
        }

        messages[index].messages.push(
            messageObject
        );

        messages[index].unreadForSeller =
            Number(
                messages[index].unreadForSeller ||
                0
            ) + 1;

        messages[index].updatedAt =
            now();

        saveMessages(
            messages
        );

        return messageObject;
    }

    function sendSellerLuxuryMessage(
        conversationId,
        message
    ) {

        const conversation =
            getConversation(
                conversationId
            );

        if (!conversation) {

            throw new Error(
                "Conversation not found."
            );
        }

        const currentUser =
            getChatUser();

        if (
            currentUser.id !==
            conversation.sellerId
        ) {

            throw new Error(
                "Only the seller can use seller-side messaging."
            );
        }

        const body =
            text(message);

        if (!body) {

            throw new Error(
                "Message cannot be empty."
            );
        }

        const all =
            getMessages();

        const index =
            all.findIndex(
                function (item) {
                    return (
                        item.id ===
                        conversationId
                    );
                }
            );

        if (index === -1) {

            throw new Error(
                "Conversation not found."
            );
        }

        const messageObject = {

            id:
                id("luxury_msg"),

            senderId:
                currentUser.id,

            senderName:
                currentUser.name ||
                "Seller",

            recipientId:
                conversation.buyerId,

            text:
                body,

            createdAt:
                now(),

            read:
                false
        };

        if (
            !Array.isArray(
                all[index].messages
            )
        ) {

            all[index].messages =
                [];
        }

        all[index].messages.push(
            messageObject
        );

        all[index].unreadForBuyer =
            Number(
                all[index].unreadForBuyer ||
                0
            ) + 1;

        all[index].updatedAt =
            now();

        saveMessages(
            all
        );

        return messageObject;
    }

    function markConversationRead(
        conversationId
    ) {

        const all =
            getMessages();

        const index =
            all.findIndex(
                function (item) {
                    return (
                        item.id ===
                        conversationId
                    );
                }
            );

        if (index === -1) {
            return false;
        }

        const currentUser =
            getChatUser();

        if (
            currentUser.id ===
            all[index].buyerId
        ) {

            all[index].unreadForBuyer =
                0;
        }

        if (
            currentUser.id ===
            all[index].sellerId
        ) {

            all[index].unreadForSeller =
                0;
        }

        all[index].messages =
            (
                Array.isArray(
                    all[index].messages
                )
                    ? all[index].messages
                    : []
            ).map(
                function (message) {

                    if (
                        message.recipientId ===
                        currentUser.id
                    ) {

                        return Object.assign(
                            {},
                            message,
                            {
                                read: true
                            }
                        );
                    }

                    return message;
                }
            );

        saveMessages(
            all
        );

        return true;
    }

    function getMyConversations() {

        const currentUserId =
            getCurrentUserId();

        return getMessages()
            .filter(
                function (conversation) {

                    return (
                        conversation.sellerId ===
                        currentUserId ||
                        conversation.buyerId ===
                        currentUserId
                    );
                }
            )
            .sort(
                function (a, b) {

                    return (
                        new Date(
                            b.updatedAt
                        ).getTime() -
                        new Date(
                            a.updatedAt
                        ).getTime()
                    );
                }
            );
    }

    function getItemConversations(
        listingId
    ) {

        return getMessages()
            .filter(
                function (conversation) {

                    return (
                        conversation.listingId ===
                        listingId
                    );
                }
            );
    }

    function deleteConversation(
        conversationId
    ) {

        const currentUser =
            getChatUser();

        const all =
            getMessages();

        const conversation =
            all.find(
                function (item) {
                    return (
                        item.id ===
                        conversationId
                    );
                }
            );

        if (!conversation) {
            return false;
        }

        if (
            currentUser.id !==
                conversation.sellerId &&
            currentUser.id !==
                conversation.buyerId
        ) {

            return false;
        }

        saveMessages(
            all.filter(
                function (item) {
                    return (
                        item.id !==
                        conversationId
                    );
                }
            )
        );

        return true;
    }

    function deleteItemConversations(
        listing
    ) {

        if (!listing) {
            return;
        }

        saveMessages(
            getMessages().filter(
                function (conversation) {
                    return (
                        conversation.listingId !==
                        listing.id
                    );
                }
            )
        );
    }

    /* ======================================================
       CHAT MODAL
    ====================================================== */

    function showLuxuryChat(
        listing
    ) {

        const currentUser =
            getChatUser();

        const sellerId =
            getListingSellerId(
                listing
            );

        if (
            sellerId ===
            currentUser.id
        ) {

            showSellerItemConversations(
                listing
            );

            return;
        }

        let modal =
            $("#luxuryChatModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxuryChatModal";

            document.body.appendChild(
                modal
            );
        }

        let conversation =
            getConversationForListing(
                listing,
                currentUser.id
            );

        if (!conversation) {

            try {

                conversation =
                    createConversation(
                        listing,
                        currentUser.id
                    );

            } catch (error) {

                alert(
                    error.message
                );

                return;
            }
        }

        markConversationRead(
            conversation.id
        );

        renderLuxuryChat(
            modal,
            listing,
            conversation
        );
    }

    function renderLuxuryChat(
        modal,
        listing,
        conversation
    ) {

        const currentUser =
            getChatUser();

        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:100003;
                    background:rgba(0,0,0,.9);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:12px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(720px,100%);
                        height:min(780px,94vh);
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:16px;
                        overflow:hidden;
                        display:flex;
                        flex-direction:column;
                        color:#fff;
                    "
                >

                    <div
                        style="
                            padding:14px 16px;
                            border-bottom:1px solid rgba(215,179,90,.3);
                            display:flex;
                            justify-content:space-between;
                            gap:12px;
                            align-items:center;
                        "
                    >

                        <div>
                            <div
                                style="
                                    color:#d7b35a;
                                    font-size:12px;
                                "
                            >
                                💬 PRIVATE ITEM CHAT
                            </div>

                            <strong
                                style="
                                    color:#f0d27a;
                                "
                            >
                                ${escapeHTML(
                                    listing.title ||
                                    "Luxury Item"
                                )}
                            </strong>

                            <div
                                style="
                                    font-size:11px;
                                    opacity:.65;
                                    margin-top:4px;
                                "
                            >
                                Item:
                                ${escapeHTML(
                                    listing.itemId ||
                                    listing.id
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            data-close-luxury-chat
                            style="
                                width:38px;
                                height:38px;
                                border-radius:50%;
                                background:transparent;
                                border:1px solid #d7b35a;
                                color:#f0d27a;
                                font-size:22px;
                            "
                        >
                            ×
                        </button>

                    </div>

                    <div
                        id="luxuryChatMessages"
                        style="
                            flex:1;
                            overflow:auto;
                            padding:15px;
                            display:flex;
                            flex-direction:column;
                            gap:9px;
                        "
                    >

                        ${
                            messages.length
                                ? messages.map(
                                    function (message) {

                                        const mine =
                                            message.senderId ===
                                            currentUser.id;

                                        return `
                                            <div
                                                style="
                                                    align-self:${mine ? "flex-end" : "flex-start"};
                                                    max-width:82%;
                                                "
                                            >

                                                <div
                                                    style="
                                                        font-size:10px;
                                                        opacity:.6;
                                                        margin-bottom:3px;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        message.senderName ||
                                                        "User"
                                                    )}
                                                </div>

                                                <div
                                                    style="
                                                        padding:10px 12px;
                                                        border-radius:12px;
                                                        border:1px solid rgba(215,179,90,.25);
                                                        background:${mine ? "rgba(215,179,90,.16)" : "#101722"};
                                                        line-height:1.45;
                                                        word-break:break-word;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        message.text
                                                    )}
                                                </div>

                                                <div
                                                    style="
                                                        font-size:9px;
                                                        opacity:.5;
                                                        margin-top:3px;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        new Date(
                                                            message.createdAt
                                                        ).toLocaleString()
                                                    )}
                                                </div>

                                            </div>
                                        `;
                                    }
                                ).join("")
                                : `
                                    <div
                                        style="
                                            text-align:center;
                                            margin:auto;
                                            opacity:.65;
                                        "
                                    >
                                        <div style="font-size:42px;">
                                            💬
                                        </div>
                                        <p>
                                            Start a private conversation
                                            about this item.
                                        </p>
                                    </div>
                                `
                        }

                    </div>

                    <form
                        id="luxuryChatForm"
                        style="
                            padding:12px;
                            border-top:1px solid rgba(215,179,90,.3);
                            display:flex;
                            gap:8px;
                        "
                    >

                        <input
                            type="text"
                            name="message"
                            autocomplete="off"
                            placeholder="Write a message about this item..."
                            style="
                                flex:1;
                                min-width:0;
                                padding:11px;
                                border-radius:9px;
                                border:1px solid rgba(215,179,90,.4);
                                background:#101722;
                                color:#fff;
                            "
                        >

                        <button
                            type="submit"
                            style="
                                padding:11px 16px;
                                border-radius:9px;
                                border:1px solid #d7b35a;
                                background:#d7b35a;
                                color:#05080f;
                                font-weight:700;
                            "
                        >
                            Send
                        </button>

                    </form>

                </div>

            </div>
        `;

        modal.style.display =
            "block";

        const close =
            $(
                "[data-close-luxury-chat]",
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

        const form =
            $("#luxuryChatForm", modal);

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const input =
                        form.elements.message;

                    try {

                        sendLuxuryMessage(
                            listing.id,
                            input.value
                        );

                        const updated =
                            getConversation(
                                conversation.id
                            );

                        renderLuxuryChat(
                            modal,
                            listing,
                            updated
                        );

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            );
        }

        const messagesBox =
            $("#luxuryChatMessages", modal);

        if (messagesBox) {

            messagesBox.scrollTop =
                messagesBox.scrollHeight;
        }
    }

    /* ======================================================
       SELLER CONVERSATIONS
    ====================================================== */

    function showSellerItemConversations(
        listing
    ) {

        const currentUser =
            getChatUser();

        if (
            getListingSellerId(listing) !==
            currentUser.id
        ) {

            showLuxuryChat(
                listing
            );

            return;
        }

        let modal =
            $("#luxurySellerChatsModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxurySellerChatsModal";

            document.body.appendChild(
                modal
            );
        }

        const conversations =
            getItemConversations(
                listing.id
            );

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:100004;
                    background:rgba(0,0,0,.9);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:12px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(800px,100%);
                        max-height:92vh;
                        overflow:auto;
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:16px;
                        padding:18px;
                        color:#fff;
                    "
                >

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            gap:10px;
                            align-items:center;
                        "
                    >

                        <div>
                            <div
                                style="
                                    color:#d7b35a;
                                    font-size:12px;
                                "
                            >
                                📂 ITEM MESSAGE FOLDER
                            </div>

                            <h2
                                style="
                                    color:#f0d27a;
                                    margin:5px 0;
                                "
                            >
                                ${escapeHTML(
                                    listing.title
                                )}
                            </h2>

                            <div
                                style="
                                    font-size:11px;
                                    opacity:.65;
                                "
                            >
                                Item ID:
                                ${escapeHTML(
                                    listing.itemId ||
                                    listing.id
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            data-close-seller-chats
                        >
                            ×
                        </button>

                    </div>

                    <hr>

                    ${
                        conversations.length
                            ? conversations.map(
                                function (conversation) {

                                    const unread =
                                        Number(
                                            conversation.unreadForSeller ||
                                            0
                                        );

                                    const last =
                                        Array.isArray(
                                            conversation.messages
                                        ) &&
                                        conversation.messages.length
                                            ? conversation.messages[
                                                conversation.messages.length - 1
                                              ]
                                            : null;

                                    return `
                                        <button
                                            type="button"
                                            data-open-seller-chat
                                            data-conversation-id="${escapeHTML(
                                                conversation.id
                                            )}"
                                            data-listing-id="${escapeHTML(
                                                listing.id
                                            )}"
                                            style="
                                                display:block;
                                                width:100%;
                                                text-align:left;
                                                margin:9px 0;
                                                padding:13px;
                                                border:1px solid rgba(215,179,90,.3);
                                                border-radius:10px;
                                                background:#101722;
                                                color:#fff;
                                            "
                                        >

                                            <div
                                                style="
                                                    color:#f0d27a;
                                                    font-weight:700;
                                                "
                                            >
                                                👤
                                                ${escapeHTML(
                                                    conversation.buyerName ||
                                                    "Buyer"
                                                )}

                                                ${
                                                    unread
                                                        ? `
                                                            <span
                                                                style="
                                                                    margin-left:8px;
                                                                    color:#05080f;
                                                                    background:#d7b35a;
                                                                    padding:2px 7px;
                                                                    border-radius:20px;
                                                                    font-size:10px;
                                                                "
                                                            >
                                                                ${unread} new
                                                            </span>
                                                        `
                                                        : ""
                                                }
                                            </div>

                                            <div
                                                style="
                                                    margin-top:5px;
                                                    font-size:12px;
                                                    opacity:.7;
                                                "
                                            >
                                                ${
                                                    last
                                                        ? escapeHTML(
                                                            last.text
                                                        )
                                                        : "No messages yet."
                                                }
                                            </div>

                                        </button>
                                    `;
                                }
                            ).join("")
                            : `
                                <div
                                    style="
                                        text-align:center;
                                        padding:35px 10px;
                                        opacity:.65;
                                    "
                                >
                                    <div style="font-size:42px;">
                                        💬
                                    </div>

                                    <p>
                                        No buyer conversations for this item yet.
                                    </p>
                                </div>
                            `
                    }

                </div>

            </div>
        `;

        modal.style.display =
            "block";

        const close =
            $(
                "[data-close-seller-chats]",
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

        $$(
            "[data-open-seller-chat]",
            modal
        ).forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const conversation =
                            getConversation(
                                button.dataset.conversationId
                            );

                        if (!conversation) {
                            return;
                        }

                        const item =
                            getListing(
                                button.dataset.listingId
                            );

                        if (!item) {
                            return;
                        }

                        markConversationRead(
                            conversation.id
                        );

                        showSellerChat(
                            item,
                            conversation
                        );
                    }
                );
            }
        );
    }

    /* ======================================================
       SELLER CHAT
    ====================================================== */

    function showSellerChat(
        listing,
        conversation
    ) {

        let modal =
            $("#luxurySellerChatModal");

        if (!modal) {

            modal =
                document.createElement(
                    "div"
                );

            modal.id =
                "luxurySellerChatModal";

            document.body.appendChild(
                modal
            );
        }

        const messages =
            Array.isArray(
                conversation.messages
            )
                ? conversation.messages
                : [];

        const currentUser =
            getChatUser();

        modal.innerHTML = `
            <div
                style="
                    position:fixed;
                    inset:0;
                    z-index:100005;
                    background:rgba(0,0,0,.92);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:12px;
                    box-sizing:border-box;
                "
            >

                <div
                    style="
                        width:min(720px,100%);
                        height:min(780px,94vh);
                        background:#05080f;
                        border:1px solid #d7b35a;
                        border-radius:16px;
                        overflow:hidden;
                        display:flex;
                        flex-direction:column;
                        color:#fff;
                    "
                >

                    <div
                        style="
                            padding:14px;
                            border-bottom:1px solid rgba(215,179,90,.3);
                            display:flex;
                            justify-content:space-between;
                            gap:10px;
                        "
                    >

                        <div>
                            <div
                                style="
                                    color:#d7b35a;
                                    font-size:12px;
                                "
                            >
                                👤 SELLER CHAT
                            </div>

                            <strong
                                style="
                                    color:#f0d27a;
                                "
                            >
                                ${escapeHTML(
                                    conversation.buyerName ||
                                    "Buyer"
                                )}
                            </strong>

                            <div
                                style="
                                    font-size:11px;
                                    opacity:.65;
                                    margin-top:4px;
                                "
                            >
                                Item:
                                ${escapeHTML(
                                    listing.itemId ||
                                    listing.id
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            data-close-seller-chat
                        >
                            ×
                        </button>

                    </div>

                    <div
                        id="luxurySellerChatMessages"
                        style="
                            flex:1;
                            overflow:auto;
                            padding:15px;
                            display:flex;
                            flex-direction:column;
                            gap:9px;
                        "
                    >

                        ${
                            messages.length
                                ? messages.map(
                                    function (message) {

                                        const mine =
                                            message.senderId ===
                                            currentUser.id;

                                        return `
                                            <div
                                                style="
                                                    align-self:${mine ? "flex-end" : "flex-start"};
                                                    max-width:82%;
                                                "
                                            >

                                                <div
                                                    style="
                                                        font-size:10px;
                                                        opacity:.6;
                                                        margin-bottom:3px;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        message.senderName ||
                                                        "User"
                                                    )}
                                                </div>

                                                <div
                                                    style="
                                                        padding:10px 12px;
                                                        border-radius:12px;
                                                        border:1px solid rgba(215,179,90,.25);
                                                        background:${mine ? "rgba(215,179,90,.16)" : "#101722"};
                                                        word-break:break-word;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        message.text
                                                    )}
                                                </div>

                                                <div
                                                    style="
                                                        font-size:9px;
                                                        opacity:.5;
                                                        margin-top:3px;
                                                    "
                                                >
                                                    ${escapeHTML(
                                                        new Date(
                                                            message.createdAt
                                                        ).toLocaleString()
                                                    )}
                                                </div>

                                            </div>
                                        `;
                                    }
                                ).join("")
                                : `
                                    <div
                                        style="
                                            margin:auto;
                                            opacity:.65;
                                            text-align:center;
                                        "
                                    >
                                        No messages yet.
                                    </div>
                                `
                        }

                    </div>

                    <form
                        id="luxurySellerChatForm"
                        style="
                            padding:12px;
                            border-top:1px solid rgba(215,179,90,.3);
                            display:flex;
                            gap:8px;
                        "
                    >

                        <input
                            type="text"
                            name="message"
                            autocomplete="off"
                            placeholder="Reply to buyer..."
                            style="
                                flex:1;
                                min-width:0;
                                padding:11px;
                                border-radius:9px;
                                border:1px solid rgba(215,179,90,.4);
                                background:#101722;
                                color:#fff;
                            "
                        >

                        <button
                            type="submit"
                            style="
                                padding:11px 16px;
                                border-radius:9px;
                                border:1px solid #d7b35a;
                                background:#d7b35a;
                                color:#05080f;
                                font-weight:700;
                            "
                        >
                            Send
                        </button>

                    </form>

                </div>

            </div>
        `;

        modal.style.display =
            "block";

        const close =
            $(
                "[data-close-seller-chat]",
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

        const form =
            $("#luxurySellerChatForm", modal);

        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const input =
                        form.elements.message;

                    try {

                        sendSellerLuxuryMessage(
                            conversation.id,
                            input.value
                        );

                        const updated =
                            getConversation(
                                conversation.id
                            );

                        showSellerChat(
                            listing,
                            updated
                        );

                    } catch (error) {

                        alert(
                            error.message
                        );
                    }
                }
            );
        }

        const box =
            $("#luxurySellerChatMessages", modal);

        if (box) {
            box.scrollTop =
                box.scrollHeight;
        }
    }

    /* ======================================================
       MESSAGE BUTTONS
    ====================================================== */

    function initializeLuxuryMessageButtons() {

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-luxury-message-seller]"
                    );

                if (!button) {
                    return;
                }

                const listing =
                    getListing(
                        button.dataset.id
                    );

                if (!listing) {
                    return;
                }

                showLuxuryChat(
                    listing
                );
            }
        );
    }

    /* ======================================================
       MY ITEMS / FOLDERS
    ====================================================== */

    function getMyListings() {

        return getListings().filter(
            function (listing) {
                return isListingOwner(
                    listing
                );
            }
        );
    }

    function getSavedListings() {

        const saved =
            getSavedItems();

        return getListings().filter(
            function (listing) {
                return saved.includes(
                    listing.id
                );
            }
        );
    }

    function renderMyItemFolders(
        container
    ) {

        if (!container) {
            return;
        }

        const items =
            getMyListings();

        if (!items.length) {

            container.innerHTML = `
                <div
                    style="
                        padding:20px;
                        text-align:center;
                    "
                >
                    📁 No items in your profile yet.
                </div>
            `;

            return;
        }

        container.innerHTML =
            items.map(
                function (listing) {

                    return `
                        <button
                            type="button"
                            data-my-item-folder
                            data-id="${escapeHTML(listing.id)}"
                            style="
                                width:100%;
                                text-align:left;
                                padding:13px;
                                margin-bottom:8px;
                                border:1px solid rgba(215,179,90,.3);
                                border-radius:10px;
                                background:#101722;
                                color:#fff;
                            "
                        >
                            📁
                            ${escapeHTML(
                                listing.title ||
                                "Luxury Item"
                            )}

                            <span
                                style="
                                    display:block;
                                    font-size:11px;
                                    opacity:.6;
                                    margin-top:4px;
                                "
                            >
                                ${escapeHTML(
                                    listing.itemId ||
                                    listing.id
                                )}
                            </span>
                        </button>
                    `;
                }
            )
            .join("");

        $$(
            "[data-my-item-folder]",
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

                        if (listing) {
                            showItemFolder(
                                listing
                            );
                        }
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

                const folder =
                    event.target.closest(
                        "[data-luxury-open-item-folder]"
                    );

                if (folder) {

                    const listing =
                        getListing(
                            folder.dataset.id
                        );

                    if (listing) {

                        showItemFolder(
                            listing
                        );
                    }
                }

                const myFolders =
                    event.target.closest(
                        "[data-luxury-my-folders]"
                    );

                if (myFolders) {

                    const container =
                        $(
                            "[data-luxury-my-items-container]"
                        );

                    renderMyItemFolders(
                        container
                    );
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

        getChatUser();

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

        initializeLuxuryMessageButtons();

        renderCategoryCards();

        renderListings();

        const myItemsContainer =
            $(
                "[data-luxury-my-items-container]"
            );

        if (myItemsContainer) {

            renderMyItemFolders(
                myItemsContainer
            );
        }

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

        console.log(
            "[Luxury Lifestyle] Current User:",
            getCurrentUserId()
        );

        console.log(
            "[Luxury Lifestyle] Conversations:",
            getMessages().length
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

        getListingMedia:
            getListingMedia,

        filterListings:
            filterListings,

        searchListings:
            searchListings,

        statistics:
            statistics,

        renderListings:
            renderListings,

        renderCategoryCards:
            renderCategoryCards,

        getProfile:
            getProfile,

        getChatUser:
            getChatUser,

        setChatUser:
            setChatUser,

        getCurrentUserId:
            getCurrentUserId,

        getMyListings:
            getMyListings,

        getSavedItems:
            getSavedItems,

        getSavedListings:
            getSavedListings,

        saveItem:
            saveItem,

        unsaveItem:
            unsaveItem,

        toggleSaveItem:
            toggleSaveItem,

        isItemSaved:
            isItemSaved,

        getItemFolderData:
            getItemFolderData,

        showItemFolder:
            showItemFolder,

        showListingDetails:
            showListingDetails,

        showEditListing:
            showEditListing,

        getMessages:
            getMessages,

        getConversationId:
            getConversationId,

        getConversation:
            getConversation,

        getConversationForListing:
            getConversationForListing,

        createConversation:
            createConversation,

        sendLuxuryMessage:
            sendLuxuryMessage,

        sendSellerLuxuryMessage:
            sendSellerLuxuryMessage,

        markConversationRead:
            markConversationRead,

        getMyConversations:
            getMyConversations,

        getItemConversations:
            getItemConversations,

        deleteConversation:
            deleteConversation,

        showLuxuryChat:
            showLuxuryChat,

        showSellerItemConversations:
            showSellerItemConversations
    };

    /* ======================================================
       SEPARATE MESSAGE API
    ====================================================== */

    window.ALON_LUXURY_LIFESTYLE_MESSAGES = {

        version:
            VERSION,

        getCurrentUser:
            getChatUser,

        setCurrentUser:
            setChatUser,

        getMessages:
            getMessages,

        getConversationId:
            getConversationId,

        getConversation:
            getConversation,

        getConversationForListing:
            getConversationForListing,

        createConversation:
            createConversation,

        sendMessage:
            sendLuxuryMessage,

        sendSellerMessage:
            sendSellerLuxuryMessage,

        markRead:
            markConversationRead,

        getMyConversations:
            getMyConversations,

        getItemConversations:
            getItemConversations,

        deleteConversation:
            deleteConversation,

        showChat:
            showLuxuryChat
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