/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE ENGINE
   ---------------------------------------------------------
   Version: 24.4 SAFE REGULAR MARKETPLACE
   Creator: Baba Thecno Guru

   FEATURES
   • Regular Marketplace
   • General Item categories
   • Property categories
   • Vehicle categories
   • Login / Logout
   • Marketplace agreement
   • Profile
   • Save / Edit / Delete listings
   • Image / Video support
   • Central Marketplace Country Database
   • Country Flag + ISO-2 + ISO-3
   • Business / Showroom system
   • $10 USD Business Advertisement
   • Global / Worldwide Advertisement
   • International Advertisement
   • Global + International selectable together
   • Showroom Save / Edit / Delete
   • Payment verification gate
   • Browser persistence

   IMPORTANT
   • Global Marketplace is NOT modified.
   • Country source:
     ../marketplace-countries.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const CONFIG = {

        version: "24.4",

        listingStorage:
            "alon_historyverse_regular_marketplace_listings",

        showroomStorage:
            "alon_historyverse_regular_marketplace_showrooms",

        accountStorage:
            "alon_historyverse_regular_marketplace_account",

        sessionStorage:
            "alon_historyverse_regular_marketplace_session",

        currency:
            "USD",

        showroomPrice:
            10,

        googlePayNumber:
            "7487879528",

        imageLimit:
            8 * 1024 * 1024,

        videoLimit:
            20 * 1024 * 1024

    };


    /* =====================================================
       BUSINESS AD REACH
       ===================================================== */

    const SHOWROOM_REACH = {

        GLOBAL:
            "GLOBAL",

        INTERNATIONAL:
            "INTERNATIONAL"

    };


    const SHOWROOM_REACH_LABELS = {

        GLOBAL:
            "🌍 Global / Worldwide",

        INTERNATIONAL:
            "✈️ International"

    };


    /* =====================================================
       STATE
       ===================================================== */

    const state = {

        listings: [],

        showrooms: [],

        account: null,

        loggedIn: false,

        editingListingId: null,

        editingShowroomId: null,

        verifiedPayment: null,

        countries: []

    };


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function byId(id) {

        return document.getElementById(id);

    }


    function text(value) {

        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        );

    }


    function escapeHTML(value) {

        return text(value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    function normalizeEmail(email) {

        return text(email)
            .trim()
            .toLowerCase();

    }


    function createId(prefix) {

        return (

            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 10)

        );

    }


    function saveJSON(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "Regular Marketplace storage error:",
                error
            );

            alert(
                "Browser storage is full. Please remove some old listings or large media files."
            );

            return false;

        }

    }


    function loadJSON(key, fallback) {

        try {

            const raw =
                localStorage.getItem(key);

            if (!raw) {

                return fallback;

            }

            return JSON.parse(raw);

        } catch (error) {

            console.warn(
                "Regular Marketplace read error:",
                error
            );

            return fallback;

        }

    }


    /* =====================================================
       STATUS
       ===================================================== */

    function showStatus(
        id,
        message,
        type
    ) {

        const element =
            byId(id);

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.className =
            "rm-status show " +
            (type || "");

    }


    function hideStatus(id) {

        const element =
            byId(id);

        if (!element) {
            return;
        }

        element.textContent =
            "";

        element.className =
            "rm-status";

    }


    /* =====================================================
       STORAGE
       ===================================================== */

    function loadStorage() {

        state.listings =
            loadJSON(
                CONFIG.listingStorage,
                []
            );

        state.showrooms =
            loadJSON(
                CONFIG.showroomStorage,
                []
            );

        state.account =
            loadJSON(
                CONFIG.accountStorage,
                null
            );

        const session =
            loadJSON(
                CONFIG.sessionStorage,
                null
            );


        if (
            !Array.isArray(
                state.listings
            )
        ) {

            state.listings = [];

        }


        if (
            !Array.isArray(
                state.showrooms
            )
        ) {

            state.showrooms = [];

        }


        if (
            state.account &&
            session &&
            session.email &&
            normalizeEmail(
                session.email
            ) ===
            normalizeEmail(
                state.account.email
            )
        ) {

            state.loggedIn =
                true;

        } else {

            state.loggedIn =
                false;

        }

    }


    function saveListings() {

        return saveJSON(
            CONFIG.listingStorage,
            state.listings
        );

    }


    function saveShowrooms() {

        return saveJSON(
            CONFIG.showroomStorage,
            state.showrooms
        );

    }


    function saveAccount() {

        if (state.account) {

            saveJSON(
                CONFIG.accountStorage,
                state.account
            );

        } else {

            localStorage.removeItem(
                CONFIG.accountStorage
            );

        }

    }


    function saveSession() {

        if (
            state.loggedIn &&
            state.account
        ) {

            saveJSON(
                CONFIG.sessionStorage,
                {

                    email:
                        state.account.email,

                    loggedInAt:
                        new Date()
                            .toISOString()

                }
            );

        } else {

            localStorage.removeItem(
                CONFIG.sessionStorage
            );

        }

    }


    /* =====================================================
       ACCOUNT / LOGIN
       ===================================================== */

    function handleLogin() {

        const nameInput =
            byId("rmLoginName");

        const mobileInput =
            byId("rmLoginMobile");

        const emailInput =
            byId("rmLoginEmail");

        const passwordInput =
            byId("rmLoginPassword");

        const agreement =
            byId("rmAgreement");


        const name =
            text(
                nameInput
                    ? nameInput.value
                    : ""
            ).trim();


        const mobile =
            text(
                mobileInput
                    ? mobileInput.value
                    : ""
            ).trim();


        const email =
            normalizeEmail(
                emailInput
                    ? emailInput.value
                    : ""
            );


        const password =
            text(
                passwordInput
                    ? passwordInput.value
                    : ""
            );


        if (!name) {

            showStatus(
                "rmLoginStatus",
                "Please enter your name.",
                "error"
            );

            return;

        }


        if (!mobile) {

            showStatus(
                "rmLoginStatus",
                "Please enter your mobile number.",
                "error"
            );

            return;

        }


        if (
            !email ||
            !email.includes("@")
        ) {

            showStatus(
                "rmLoginStatus",
                "Please enter a valid email address.",
                "error"
            );

            return;

        }


        if (!password) {

            showStatus(
                "rmLoginStatus",
                "Please enter your password.",
                "error"
            );

            return;

        }


        if (
            !agreement ||
            !agreement.checked
        ) {

            showStatus(
                "rmLoginStatus",
                "You must agree to the Marketplace Agreement before login.",
                "error"
            );

            return;

        }


        if (
            state.account &&
            normalizeEmail(
                state.account.email
            ) === email
        ) {

            if (
                state.account.password !==
                password
            ) {

                showStatus(
                    "rmLoginStatus",
                    "Incorrect password.",
                    "error"
                );

                return;

            }

            state.account.name =
                name;

            state.account.mobile =
                mobile;

            state.account.agreementAccepted =
                true;

        } else {

            state.account = {

                name:
                    name,

                mobile:
                    mobile,

                email:
                    email,

                password:
                    password,

                agreementAccepted:
                    true,

                createdAt:
                    new Date()
                        .toISOString()

            };

        }


        saveAccount();


        state.loggedIn =
            true;


        saveSession();


        updateLoginUI();


        showStatus(
            "rmLoginStatus",
            "Login successful.",
            "success"
        );


        renderListings();

        renderShowrooms();

    }


    function logout() {

        state.loggedIn =
            false;

        state.editingListingId =
            null;

        state.editingShowroomId =
            null;

        state.verifiedPayment =
            null;


        localStorage.removeItem(
            CONFIG.sessionStorage
        );


        resetListingForm();

        resetShowroomForm();

        updateLoginUI();

        renderListings();

        renderShowrooms();


        showStatus(
            "rmLoginStatus",
            "You have been logged out.",
            "success"
        );

    }


    function requireLogin() {

        if (
            state.loggedIn &&
            state.account
        ) {

            return true;

        }


        alert(
            "Please login before using this feature."
        );


        return false;

    }


    function updateLoginUI() {

        const loginBox =
            byId("rmLoginBox");

        const profileBox =
            byId("rmProfileBox");


        if (
            !loginBox ||
            !profileBox
        ) {

            return;

        }


        if (
            state.loggedIn &&
            state.account
        ) {

            loginBox.classList.add(
                "rm-hidden"
            );

            profileBox.classList.remove(
                "rm-hidden"
            );


            const name =
                byId("rmProfileName");

            const email =
                byId("rmProfileEmail");


            if (name) {

                name.textContent =
                    state.account.name || "";

            }


            if (email) {

                email.textContent =
                    state.account.email || "";

            }

        } else {

            loginBox.classList.remove(
                "rm-hidden"
            );

            profileBox.classList.add(
                "rm-hidden"
            );

        }

    }


    /* =====================================================
       CATEGORY SYSTEM
       ===================================================== */

    const CATEGORY_DATA = {

        item: [

            { value: "electronics", label: "📱 Electronics" },

            { value: "mobile", label: "📱 Mobile Phones" },

            { value: "computer", label: "💻 Computers / Laptops" },

            { value: "furniture", label: "🪑 Furniture" },

            { value: "clothing", label: "👕 Clothing / Fashion" },

            { value: "footwear", label: "👟 Footwear" },

            { value: "home", label: "🏠 Home & Household" },

            { value: "appliances", label: "🔌 Home Appliances" },

            { value: "kitchen", label: "🍳 Kitchen Items" },

            { value: "books", label: "📚 Books" },

            { value: "sports", label: "⚽ Sports & Fitness" },

            { value: "toys", label: "🧸 Toys & Kids" },

            { value: "tools", label: "🔧 Tools" },

            { value: "machinery", label: "⚙️ Machinery & Equipment" },

            { value: "jewellery", label: "💎 Jewellery" },

            { value: "musical", label: "🎸 Musical Instruments" },

            { value: "agriculture", label: "🌾 Agriculture Products" },

            { value: "office", label: "🏢 Office Equipment" },

            { value: "collectibles", label: "🏺 Collectibles & Antiques" },

            { value: "other-item", label: "📦 Other Item" }

        ],


        property: [

            { value: "house", label: "🏠 House" },

            { value: "flat", label: "🏢 Flat / Apartment" },

            { value: "bungalow", label: "🏡 Bungalow" },

            { value: "villa", label: "🏘️ Villa" },

            { value: "plot", label: "📐 Residential Plot" },

            { value: "land", label: "🌳 Land" },

            { value: "farm", label: "🌾 Farm / Agricultural Land" },

            { value: "shop", label: "🏪 Shop" },

            { value: "office", label: "🏢 Office" },

            { value: "warehouse", label: "🏭 Warehouse" },

            { value: "factory", label: "🏭 Factory" },

            { value: "commercial-property", label: "🏬 Commercial Property" },

            { value: "hotel-property", label: "🏨 Hotel / Resort Property" },

            { value: "rental-property", label: "🔑 Rental Property" },

            { value: "other-property", label: "🏠 Other Property" }

        ],


        vehicle: [

            { value: "car", label: "🚗 Car" },

            { value: "suv", label: "🚙 SUV / 4x4" },

            { value: "motorcycle-bike", label: "🏍️ Motorcycle / Bike" },

            { value: "scooter", label: "🛵 Scooter" },

            { value: "electric-vehicle", label: "⚡ Electric Vehicle" },

            { value: "truck", label: "🚚 Truck" },

            { value: "trailer", label: "🚛 Trailer" },

            { value: "tractor", label: "🚜 Tractor" },

            { value: "jcb-excavator", label: "🏗️ JCB / Excavator" },

            { value: "bus", label: "🚌 Bus" },

            { value: "van", label: "🚐 Van" },

            { value: "ambulance", label: "🚑 Ambulance" },

            { value: "taxi", label: "🚕 Taxi" },

            { value: "commercial-vehicle", label: "🚛 Commercial Vehicle" },

            { value: "three-wheeler", label: "🛺 Three-Wheeler" },

            { value: "farm-vehicle", label: "🚜 Farm Vehicle" },

            { value: "construction-vehicle", label: "🏗️ Construction Vehicle" },

            { value: "boat", label: "🛥️ Boat / Water Vehicle" },

            { value: "other-vehicle", label: "🚘 Other Vehicle" }

        ]

    };


    function categoryLabel(
        type,
        value
    ) {

        const list =
            CATEGORY_DATA[type] || [];


        const item =
            list.find(
                function (category) {

                    return (
                        category.value === value
                    );

                }
            );


        return item
            ? item.label
            : value || "Other";

    }


    function updateCategoryOptions() {

        const typeSelect =
            byId("rmListingType");

        const categorySelect =
            byId("rmListingCategory");


        if (
            !typeSelect ||
            !categorySelect
        ) {

            return;

        }


        const type =
            typeSelect.value;


        categorySelect.innerHTML =
            "";


        if (!type) {

            const option =
                document.createElement("option");

            option.value = "";

            option.textContent =
                "Select type first";

            categorySelect.appendChild(
                option
            );

            return;

        }


        const first =
            document.createElement("option");

        first.value = "";

        first.textContent =
            "Select Category";

        categorySelect.appendChild(
            first
        );


        (
            CATEGORY_DATA[type] || []
        ).forEach(
            function (category) {

                const option =
                    document.createElement("option");

                option.value =
                    category.value;

                option.textContent =
                    category.label;

                categorySelect.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       COUNTRY DATABASE
       ===================================================== */

    /*
     * IMPORTANT:
     *
     * This file does NOT create another country database.
     *
     * It reads:
     *
     * window.MARKETPLACE_COUNTRIES
     *
     * from:
     *
     * ../marketplace-countries.js
     *
     * The verified database contains:
     *
     * name
     * country
     * slug
     * flag
     * code2
     * code3
     * capital
     * region
     *
     * Calling codes are intentionally NOT invented.
     */


    function getCountryDatabase() {

        const sources = [

            window.MARKETPLACE_COUNTRIES,

            window.ALON_MARKETPLACE_COUNTRIES,

            window.ALON_WORLD_COUNTRIES,

            window.WORLD_COUNTRIES

        ];


        for (
            let i = 0;
            i < sources.length;
            i++
        ) {

            const source =
                sources[i];


            if (
                Array.isArray(source)
            ) {

                return source;

            }


            if (
                source &&
                Array.isArray(source.countries)
            ) {

                return source.countries;

            }

        }


        return [];

    }


    function normalizeCountry(item) {

        if (!item) {

            return null;

        }


        if (
            typeof item === "string"
        ) {

            return {

                name:
                    item,

                country:
                    item,

                slug:
                    "",

                flag:
                    "",

                code2:
                    "",

                code3:
                    "",

                capital:
                    "",

                region:
                    "",

                iso:
                    "",

                callingCode:
                    ""

            };

        }


        const name =
            item.name ||
            item.country ||
            item.countryName ||
            item.label ||
            "";


        if (!name) {

            return null;

        }


        /*
         * New central database:
         *
         * code2
         * code3
         *
         * Old compatibility:
         *
         * iso
         * iso2
         * code
         * countryCode
         */

        const code2 =
            text(
                item.code2 ||
                item.iso2 ||
                item.iso ||
                item.code ||
                item.countryCode ||
                ""
            )
            .trim()
            .toUpperCase();


        const code3 =
            text(
                item.code3 ||
                item.iso3 ||
                item.alpha3 ||
                ""
            )
            .trim()
            .toUpperCase();


        const callingCode =
            text(
                item.callingCode ||
                item.dialCode ||
                item.phoneCode ||
                item.calling_code ||
                ""
            )
            .trim();


        const flag =
            text(
                item.flag ||
                item.emoji ||
                item.symbol ||
                ""
            )
            .trim();


        const aliases =
            Array.isArray(
                item.aliases
            )
                ? item.aliases.slice()
                : [];


        return {

            name:
                text(name).trim(),

            country:
                text(
                    item.country ||
                    name
                ).trim(),

            slug:
                text(
                    item.slug ||
                    ""
                ).trim(),

            flag:
                flag,

            code2:
                code2,

            code3:
                code3,

            capital:
                text(
                    item.capital ||
                    ""
                ).trim(),

            region:
                text(
                    item.region ||
                    ""
                ).trim(),

            aliases:
                aliases,

            /*
             * Compatibility fields.
             */

            iso:
                code2,

            callingCode:
                callingCode

        };

    }


    function loadCountries() {

        const database =
            getCountryDatabase();


        const result = [];

        const seen =
            new Set();


        database.forEach(
            function (item) {

                const country =
                    normalizeCountry(item);


                if (
                    !country ||
                    !country.name
                ) {

                    return;

                }


                const key =
                    (
                        country.code2 ||
                        country.code3 ||
                        country.slug ||
                        country.name
                    )
                    .toLowerCase();


                if (
                    seen.has(key)
                ) {

                    return;

                }


                seen.add(key);

                result.push(country);

            }
        );


        result.sort(
            function (a, b) {

                return a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                );

            }
        );


        state.countries =
            result;


        if (!result.length) {

            console.warn(
                "ALON Regular Marketplace: marketplace country database not found or empty."
            );

        } else {

            console.log(
                "ALON Regular Marketplace: " +
                result.length +
                " countries loaded."
            );

        }

    }


    function countryCodeLabel(country) {

        if (!country) {

            return "";

        }


        const codes = [];


        if (country.code2) {

            codes.push(
                country.code2
            );

        }


        if (country.code3) {

            codes.push(
                country.code3
            );

        }


        return codes.join(
            " • "
        );

    }


    function countryLabel(country) {

        if (!country) {

            return "Not specified";

        }


        let value = "";


        if (country.flag) {

            value +=
                country.flag +
                " ";

        }


        value +=
            country.name;


        const codes =
            countryCodeLabel(
                country
            );


        if (codes) {

            value +=
                " (" +
                codes +
                ")";

        }


        /*
         * Calling code is shown only if the
         * external database actually supplies one.
         *
         * The verified marketplace database
         * currently does not provide calling codes.
         */

        if (country.callingCode) {

            value +=
                " " +
                country.callingCode;

        }


        return value;

    }


    function countrySearchText(country) {

        if (!country) {

            return "";

        }


        return [

            country.name,

            country.country,

            country.slug,

            country.code2,

            country.code3,

            country.capital,

            country.region,

            ...(country.aliases || [])

        ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();

    }


    function populateCountries() {

        const listingCountry =
            byId("rmCountry");

        const showroomCountry =
            byId("rmShowroomCountry");


        function populateSelect(select) {

            if (!select) {

                return;

            }


            const current =
                select.value;


            select.innerHTML =
                "";


            const empty =
                document.createElement("option");

            empty.value = "";

            empty.textContent =
                "Select Country";

            select.appendChild(
                empty
            );


            state.countries.forEach(
                function (country) {

                    const option =
                        document.createElement("option");


                    /*
                     * Store ISO-2 as the main
                     * country value.
                     *
                     * Example:
                     *
                     * India = IN
                     * USA = US
                     * UK = GB
                     */

                    option.value =
                        country.code2 ||
                        country.code3 ||
                        country.slug ||
                        country.name;


                    /*
                     * User-facing display:
                     *
                     * 🇮🇳 India (IN • IND)
                     */

                    option.textContent =
                        countryLabel(
                            country
                        );


                    /*
                     * Extra metadata for future
                     * marketplace features.
                     */

                    option.dataset.name =
                        country.name || "";

                    option.dataset.code2 =
                        country.code2 || "";

                    option.dataset.code3 =
                        country.code3 || "";

                    option.dataset.flag =
                        country.flag || "";

                    option.dataset.slug =
                        country.slug || "";

                    option.dataset.region =
                        country.region || "";

                    select.appendChild(
                        option
                    );

                }
            );


            /*
             * Restore current value.
             */

            if (current) {

                const currentCountry =
                    findCountry(
                        current
                    );


                if (currentCountry) {

                    select.value =
                        currentCountry.code2 ||
                        currentCountry.code3 ||
                        currentCountry.slug ||
                        currentCountry.name;

                } else {

                    select.value =
                        current;

                }

            }

        }


        populateSelect(
            listingCountry
        );


        populateSelect(
            showroomCountry
        );

    }


    function findCountry(value) {

        const target =
            text(value)
                .trim()
                .toLowerCase();


        if (!target) {

            return null;

        }


        /*
         * Exact ISO-2
         */

        const code2Match =
            state.countries.find(
                function (country) {

                    return (
                        text(country.code2)
                            .toLowerCase() ===
                        target
                    );

                }
            );


        if (code2Match) {

            return code2Match;

        }


        /*
         * Exact ISO-3
         */

        const code3Match =
            state.countries.find(
                function (country) {

                    return (
                        text(country.code3)
                            .toLowerCase() ===
                        target
                    );

                }
            );


        if (code3Match) {

            return code3Match;

        }


        /*
         * Exact slug
         */

        const slugMatch =
            state.countries.find(
                function (country) {

                    return (
                        text(country.slug)
                            .toLowerCase() ===
                        target
                    );

                }
            );


        if (slugMatch) {

            return slugMatch;

        }


        /*
         * Exact name
         */

        const nameMatch =
            state.countries.find(
                function (country) {

                    return (
                        text(country.name)
                            .toLowerCase() ===
                        target
                    );

                }
            );


        if (nameMatch) {

            return nameMatch;

        }


        /*
         * Country field
         */

        const countryMatch =
            state.countries.find(
                function (country) {

                    return (
                        text(country.country)
                            .toLowerCase() ===
                        target
                    );

                }
            );


        if (countryMatch) {

            return countryMatch;

        }


        /*
         * Alias support.
         */

        const aliasMatch =
            state.countries.find(
                function (country) {

                    return (
                        Array.isArray(
                            country.aliases
                        ) &&
                        country.aliases.some(
                            function (alias) {

                                return (
                                    text(alias)
                                        .toLowerCase() ===
                                    target
                                );

                            }
                        )
                    );

                }
            );


        if (aliasMatch) {

            return aliasMatch;

        }


        return null;

    }


    function getCountryName(value) {

        const country =
            findCountry(value);


        if (country) {

            return countryLabel(
                country
            );

        }


        /*
         * Old saved records may contain
         * an unknown country value.
         */

        return text(value) ||
            "Not specified";

    }


    function getCountryValue(value) {

        const country =
            findCountry(value);


        if (!country) {

            return text(value);

        }


        return (
            country.code2 ||
            country.code3 ||
            country.slug ||
            country.name
        );

    }


    function getCountryObject(value) {

        return findCountry(value);

    }


    /* =====================================================
       FILE MEDIA
       ===================================================== */

    function readFile(file) {

        return new Promise(
            function (resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        resolve(
                            reader.result
                        );

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "Unable to read file."
                            )
                        );

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    async function processImage(file) {

        if (!file) {

            return null;

        }


        if (
            !file.type.startsWith("image/")
        ) {

            throw new Error(
                "Please select a valid image file."
            );

        }


        if (
            file.size >
            CONFIG.imageLimit
        ) {

            throw new Error(
                "Image must be 8 MB or smaller."
            );

        }


        return {

            name:
                file.name,

            type:
                file.type,

            size:
                file.size,

            data:
                await readFile(file)

        };

    }


    async function processVideo(file) {

        if (!file) {

            return null;

        }


        if (
            !file.type.startsWith("video/")
        ) {

            throw new Error(
                "Please select a valid video file."
            );

        }


        if (
            file.size >
            CONFIG.videoLimit
        ) {

            throw new Error(
                "Video must be 20 MB or smaller."
            );

        }


        return {

            name:
                file.name,

            type:
                file.type,

            size:
                file.size,

            data:
                await readFile(file)

        };

    }


    /* =====================================================
       LISTING FORM
       ===================================================== */

    function listingFormData() {

        function value(id) {

            const element =
                byId(id);

            return element
                ? text(element.value).trim()
                : "";

        }


        return {

            type:
                value("rmListingType"),

            category:
                value("rmListingCategory"),

            condition:
                value("rmListingCondition"),

            title:
                value("rmListingTitle"),

            price:
                value("rmListingPrice"),

            country:
                value("rmCountry"),

            state:
                value("rmState"),

            district:
                value("rmDistrict"),

            taluka:
                value("rmTaluka"),

            pin:
                value("rmPin"),

            phone:
                value("rmPhone"),

            email:
                value("rmEmail"),

            description:
                value("rmDescription")

        };

    }


    function validateListing(data) {

        if (!state.loggedIn) {

            return "Please login first.";

        }


        if (!data.type) {

            return "Please select Listing Type.";

        }


        if (!data.category) {

            return "Please select a category.";

        }


        if (!data.title) {

            return "Listing title is required.";

        }


        if (!data.price) {

            return "Price is required.";

        }


        if (!data.country) {

            return "Please select a country.";

        }


        if (!data.description) {

            return "Description is required.";

        }


        return "";

    }


    async function saveListing(event) {

        event.preventDefault();


        if (!requireLogin()) {

            return;

        }


        const data =
            listingFormData();


        const validation =
            validateListing(data);


        if (validation) {

            showStatus(
                "rmListingStatus",
                validation,
                "error"
            );

            return;

        }


        const saveButton =
            byId("rmSaveListingButton");


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";

        }


        try {

            const imageInput =
                byId("rmImage");

            const videoInput =
                byId("rmVideo");


            let image =
                null;

            let video =
                null;


            if (
                imageInput &&
                imageInput.files &&
                imageInput.files[0]
            ) {

                image =
                    await processImage(
                        imageInput.files[0]
                    );

            }


            if (
                videoInput &&
                videoInput.files &&
                videoInput.files[0]
            ) {

                video =
                    await processVideo(
                        videoInput.files[0]
                    );

            }


            const existing =
                state.editingListingId
                    ? state.listings.find(
                        function (item) {

                            return (
                                item.id ===
                                state.editingListingId
                            );

                        }
                    )
                    : null;


            const country =
                getCountryObject(
                    data.country
                );


            if (existing) {

                if (
                    normalizeEmail(
                        existing.ownerEmail
                    ) !==
                    normalizeEmail(
                        state.account.email
                    )
                ) {

                    throw new Error(
                        "You can edit only your own listing."
                    );

                }


                if (!image) {

                    image =
                        existing.image ||
                        null;

                }


                if (!video) {

                    video =
                        existing.video ||
                        null;

                }


                Object.assign(
                    existing,
                    {

                        type:
                            data.type,

                        category:
                            data.category,

                        condition:
                            data.condition,

                        title:
                            data.title,

                        price:
                            data.price,

                        country:
                            getCountryValue(
                                data.country
                            ),

                        countryName:
                            country
                                ? country.name
                                : data.country,

                        countryFlag:
                            country
                                ? country.flag
                                : "",

                        countryCode2:
                            country
                                ? country.code2
                                : "",

                        countryCode3:
                            country
                                ? country.code3
                                : "",

                        state:
                            data.state,

                        district:
                            data.district,

                        taluka:
                            data.taluka,

                        pin:
                            data.pin,

                        phone:
                            data.phone,

                        email:
                            data.email,

                        description:
                            data.description,

                        image:
                            image,

                        video:
                            video,

                        updatedAt:
                            new Date()
                                .toISOString()

                    }
                );


                saveListings();


                state.editingListingId =
                    null;


                resetListingForm();


                showStatus(
                    "rmListingStatus",
                    "Listing updated successfully.",
                    "success"
                );

            } else {

                const listing = {

                    id:
                        createId(
                            "regular_listing"
                        ),

                    ownerEmail:
                        state.account.email,

                    type:
                        data.type,

                    category:
                        data.category,

                    condition:
                        data.condition,

                    title:
                        data.title,

                    price:
                        data.price,

                    country:
                        getCountryValue(
                            data.country
                        ),

                    countryName:
                        country
                            ? country.name
                            : data.country,

                    countryFlag:
                        country
                            ? country.flag
                            : "",

                    countryCode2:
                        country
                            ? country.code2
                            : "",

                    countryCode3:
                        country
                            ? country.code3
                            : "",

                    state:
                        data.state,

                    district:
                        data.district,

                    taluka:
                        data.taluka,

                    pin:
                        data.pin,

                    phone:
                        data.phone,

                    email:
                        data.email,

                    description:
                        data.description,

                    image:
                        image,

                    video:
                        video,

                    createdAt:
                        new Date()
                            .toISOString(),

                    updatedAt:
                        new Date()
                            .toISOString()

                };


                state.listings.unshift(
                    listing
                );


                saveListings();

                resetListingForm();


                showStatus(
                    "rmListingStatus",
                    "Listing saved successfully.",
                    "success"
                );

            }


            renderListings();

        } catch (error) {

            console.error(
                "Listing save error:",
                error
            );


            showStatus(
                "rmListingStatus",
                error.message ||
                "Unable to save listing.",
                "error"
            );

        } finally {

            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.textContent =
                    "💾 Save Listing";

            }

        }

    }


    function resetListingForm() {

        const form =
            byId("rmListingForm");


        if (form) {

            form.reset();

        }


        state.editingListingId =
            null;


        updateCategoryOptions();


        const button =
            byId("rmSaveListingButton");


        if (button) {

            button.textContent =
                "💾 Save Listing";

        }


        const cancel =
            byId("rmCancelEditButton");


        if (cancel) {

            cancel.classList.add(
                "rm-hidden"
            );

        }

    }


    function editListing(id) {

        if (!requireLogin()) {

            return;

        }


        const item =
            state.listings.find(
                function (listing) {

                    return listing.id === id;

                }
            );


        if (!item) {

            alert(
                "Listing not found."
            );

            return;

        }


        if (
            normalizeEmail(item.ownerEmail) !==
            normalizeEmail(state.account.email)
        ) {

            alert(
                "You can edit only your own listing."
            );

            return;

        }


        state.editingListingId =
            id;


        function setValue(
            elementId,
            value
        ) {

            const element =
                byId(elementId);

            if (element) {

                element.value =
                    value || "";

            }

        }


        setValue(
            "rmListingType",
            item.type
        );


        updateCategoryOptions();


        setValue(
            "rmListingCategory",
            item.category
        );


        setValue(
            "rmListingCondition",
            item.condition
        );


        setValue(
            "rmListingTitle",
            item.title
        );


        setValue(
            "rmListingPrice",
            item.price
        );


        /*
         * New records use ISO-2.
         * Old records may use country name.
         */

        setValue(
            "rmCountry",
            getCountryValue(
                item.country ||
                item.countryName ||
                ""
            )
        );


        setValue(
            "rmState",
            item.state
        );


        setValue(
            "rmDistrict",
            item.district
        );


        setValue(
            "rmTaluka",
            item.taluka
        );


        setValue(
            "rmPin",
            item.pin
        );


        setValue(
            "rmPhone",
            item.phone
        );


        setValue(
            "rmEmail",
            item.email
        );


        setValue(
            "rmDescription",
            item.description
        );


        const button =
            byId("rmSaveListingButton");


        if (button) {

            button.textContent =
                "Update Listing";

        }


        const cancel =
            byId("rmCancelEditButton");


        if (cancel) {

            cancel.classList.remove(
                "rm-hidden"
            );

        }


        const section =
            byId("rmCreateListing");


        if (section) {

            section.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }


    function deleteListing(id) {

        if (!requireLogin()) {

            return;

        }


        const item =
            state.listings.find(
                function (listing) {

                    return listing.id === id;

                }
            );


        if (!item) {

            return;

        }


        if (
            normalizeEmail(item.ownerEmail) !==
            normalizeEmail(state.account.email)
        ) {

            alert(
                "You can delete only your own listing."
            );

            return;

        }


        if (
            !window.confirm(
                "Delete this listing?"
            )
        ) {

            return;

        }


        state.listings =
            state.listings.filter(
                function (listing) {

                    return listing.id !== id;

                }
            );


        saveListings();


        if (
            state.editingListingId === id
        ) {

            resetListingForm();

        }


        renderListings();

    }


    function renderListingMedia(item) {

        let html = "";


        if (
            item.image &&
            item.image.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<img src="' +
                escapeHTML(
                    item.image.data
                ) +
                '" alt="Listing image" loading="lazy">' +

                "</div>";

        }


        if (
            item.video &&
            item.video.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<video controls preload="metadata">' +

                '<source src="' +
                escapeHTML(
                    item.video.data
                ) +
                '" type="' +
                escapeHTML(
                    item.video.type ||
                    "video/mp4"
                ) +
                '">' +

                "Your browser does not support video." +

                "</video>" +

                "</div>";

        }


        return html;

    }


    function createListingCard(item) {

        const card =
            document.createElement("article");


        card.className =
            "rm-listing-card";


        const location = [];


        if (item.taluka) {

            location.push(
                item.taluka
            );

        }


        if (item.district) {

            location.push(
                item.district
            );

        }


        if (item.state) {

            location.push(
                item.state
            );

        }


        if (item.country) {

            location.push(
                getCountryName(
                    item.country
                )
            );

        }


        const locationText =
            location.length
                ? location.join(", ")
                : "Location not specified";


        const typeLabel =
            item.type === "vehicle"

                ? "🚗 Vehicle"

                : item.type === "property"

                    ? "🏠 Property"

                    : "🛍️ General Item";


        let html =

            "<h3>" +
            escapeHTML(
                item.title
            ) +
            "</h3>" +

            "<p><strong>Type:</strong> " +
            typeLabel +
            "</p>" +

            "<p><strong>Category:</strong> " +
            escapeHTML(
                categoryLabel(
                    item.type,
                    item.category
                )
            ) +
            "</p>" +

            "<p><strong>Condition:</strong> " +
            escapeHTML(
                item.condition ||
                "Not specified"
            ) +
            "</p>" +

            "<p><strong>Price:</strong> " +
            escapeHTML(
                item.price
            ) +
            " " +
            escapeHTML(
                CONFIG.currency
            ) +
            "</p>" +

            "<p><strong>📍 Location:</strong> " +
            escapeHTML(
                locationText
            ) +
            "</p>";


        if (item.pin) {

            html +=

                "<p><strong>PIN / ZIP:</strong> " +
                escapeHTML(
                    item.pin
                ) +
                "</p>";

        }


        if (item.phone) {

            html +=

                "<p><strong>📞 Phone:</strong> " +
                escapeHTML(
                    item.phone
                ) +
                "</p>";

        }


        if (item.email) {

            html +=

                "<p><strong>✉️ Email:</strong> " +
                escapeHTML(
                    item.email
                ) +
                "</p>";

        }


        if (item.description) {

            html +=

                "<p>" +
                escapeHTML(
                    item.description
                ) +
                "</p>";

        }


        html +=
            renderListingMedia(
                item
            );


        if (
            normalizeEmail(
                item.ownerEmail
            ) ===
            normalizeEmail(
                state.account
                    ? state.account.email
                    : ""
            )
        ) {

            html +=

                '<div class="rm-actions">' +

                '<button type="button" data-rm-action="edit-listing" data-id="' +
                escapeHTML(item.id) +
                '">' +

                "✏️ Edit" +

                "</button>" +

                '<button type="button" data-rm-action="delete-listing" data-id="' +
                escapeHTML(item.id) +
                '">' +

                "🗑️ Delete" +

                "</button>" +

                "</div>";

        }


        card.innerHTML =
            html;


        return card;

    }


    function getMyListingsContainer() {

        const matches =
            document.querySelectorAll(
                "#rmMyListings"
            );


        if (!matches.length) {

            return null;

        }


        if (matches.length > 1) {

            return matches[
                matches.length - 1
            ];

        }


        const section =
            matches[0];


        if (
            section &&
            section.tagName === "SECTION"
        ) {

            return (
                section.querySelector("div") ||
                section
            );

        }


        return section;

    }


    function renderListings() {

        const container =
            getMyListingsContainer();


        if (!container) {

            return;

        }


        if (!state.loggedIn) {

            container.innerHTML =
                "<div>Login to view your listings.</div>";

            return;

        }


        const email =
            state.account.email;


        const mine =
            state.listings.filter(
                function (item) {

                    return (
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            email
                        )
                    );

                }
            );


        if (!mine.length) {

            container.innerHTML =
                "<div>No listings created yet.</div>";

            return;

        }


        container.innerHTML =
            "";


        mine.forEach(
            function (item) {

                container.appendChild(
                    createListingCard(
                        item
                    )
                );

            }
        );

    }


    /* =====================================================
       SHOWROOM REACH SYSTEM
       ===================================================== */

    function getReachCheckbox(id) {

        const element =
            byId(id);


        return (
            element &&
            element.checked
        );

    }


    function getSelectedShowroomReach() {

        const reach = [];


        if (
            getReachCheckbox(
                "rmReachGlobal"
            )
        ) {

            reach.push(
                SHOWROOM_REACH.GLOBAL
            );

        }


        if (
            getReachCheckbox(
                "rmReachInternational"
            )
        ) {

            reach.push(
                SHOWROOM_REACH.INTERNATIONAL
            );

        }


        return reach;

    }


    function normalizeShowroomReach(value) {

        if (
            Array.isArray(value)
        ) {

            return value.filter(
                function (item) {

                    return (

                        item ===
                        SHOWROOM_REACH.GLOBAL ||

                        item ===
                        SHOWROOM_REACH.INTERNATIONAL

                    );

                }
            );

        }


        if (
            text(value)
                .toUpperCase() ===
            "WORLDWIDE"
        ) {

            return [
                SHOWROOM_REACH.GLOBAL
            ];

        }


        if (
            text(value)
                .toUpperCase() ===
            "GLOBAL"
        ) {

            return [
                SHOWROOM_REACH.GLOBAL
            ];

        }


        if (
            text(value)
                .toUpperCase() ===
            "INTERNATIONAL"
        ) {

            return [
                SHOWROOM_REACH.INTERNATIONAL
            ];

        }


        return [];

    }


    function showroomReachLabel(value) {

        const reach =
            normalizeShowroomReach(
                value
            );


        if (!reach.length) {

            return "Not selected";

        }


        return reach.map(
            function (item) {

                return (

                    SHOWROOM_REACH_LABELS[item] ||
                    item

                );

            }
        ).join(" + ");

    }


    function setShowroomReach(value) {

        const reach =
            normalizeShowroomReach(
                value
            );


        const global =
            byId(
                "rmReachGlobal"
            );


        const international =
            byId(
                "rmReachInternational"
            );


        if (global) {

            global.checked =
                reach.includes(
                    SHOWROOM_REACH.GLOBAL
                );

        }


        if (international) {

            international.checked =
                reach.includes(
                    SHOWROOM_REACH.INTERNATIONAL
                );

        }

    }


    function validateShowroomReach() {

        const reach =
            getSelectedShowroomReach();


        if (!reach.length) {

            return (
                "Please select at least one Advertisement Reach: Global / Worldwide or International."
            );

        }


        return "";

    }


    function bindReachChangeEvents() {

        const global =
            byId(
                "rmReachGlobal"
            );


        const international =
            byId(
                "rmReachInternational"
            );


        function updateReachStatus() {

            const reach =
                getSelectedShowroomReach();


            if (!reach.length) {

                showStatus(
                    "rmReachStatus",
                    "Select Global / Worldwide, International, or both.",
                    "error"
                );

                return;

            }


            showStatus(
                "rmReachStatus",
                "Selected: " +
                showroomReachLabel(
                    reach
                ),
                "success"
            );

        }


        if (global) {

            global.addEventListener(
                "change",
                updateReachStatus
            );

        }


        if (international) {

            international.addEventListener(
                "change",
                updateReachStatus
            );

        }

    }


    /* =====================================================
       SHOWROOM FORM
       ===================================================== */

    function showroomFormData() {

        function value(id) {

            const element =
                byId(id);

            return element
                ? text(element.value).trim()
                : "";

        }


        return {

            name:
                value(
                    "rmShowroomName"
                ),

            type:
                value(
                    "rmShowroomType"
                ),

            reach:
                getSelectedShowroomReach(),

            country:
                value(
                    "rmShowroomCountry"
                ),

            state:
                value(
                    "rmShowroomState"
                ),

            district:
                value(
                    "rmShowroomDistrict"
                ),

            taluka:
                value(
                    "rmShowroomTaluka"
                ),

            pin:
                value(
                    "rmShowroomPin"
                ),

            phone:
                value(
                    "rmShowroomPhone"
                ),

            email:
                value(
                    "rmShowroomEmail"
                ),

            description:
                value(
                    "rmShowroomDescription"
                )

        };

    }


    function showroomTypeLabel(value) {

        const select =
            byId(
                "rmShowroomType"
            );


        if (!select) {

            return value ||
                "Other Business";

        }


        const option =
            Array.from(
                select.options
            ).find(
                function (item) {

                    return (
                        item.value ===
                        value
                    );

                }
            );


        return option
            ? option.textContent
            : value ||
                "Other Business";

    }


    function validateShowroom(data) {

        if (!state.loggedIn) {

            return "Please login first.";

        }


        if (!data.name) {

            return (
                "Business / Showroom name is required."
            );

        }


        if (!data.type) {

            return (
                "Please select Business / Showroom Type."
            );

        }


        if (
            !data.reach ||
            !data.reach.length
        ) {

            return (
                "Please select at least one Advertisement Reach."
            );

        }


        if (!data.country) {

            return (
                "Please select business country."
            );

        }


        if (!data.phone) {

            return (
                "Business phone / WhatsApp is required."
            );

        }


        if (!data.email) {

            return (
                "Business email is required."
            );

        }


        if (!data.description) {

            return (
                "Business description is required."
            );

        }


        return "";

    }


    /* =====================================================
       PAYMENT
       ===================================================== */

    function startShowroomPayment() {

        if (!requireLogin()) {

            return;

        }


        state.verifiedPayment =
            null;


        const publish =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publish) {

            publish.disabled =
                true;

        }


        showStatus(
            "rmPaymentStatus",

            "Business Advertisement Price: $10 USD. " +
            "Google Pay payment destination: " +
            CONFIG.googlePayNumber +
            ". " +
            "No payment has been automatically charged or verified by this static page. " +
            "Publish will unlock only after a real verified payment is received.",

            "error"
        );

    }


    function acceptVerifiedPayment(
        paymentData
    ) {

        if (!paymentData) {

            return false;

        }


        const status =
            text(
                paymentData.status
            ).toLowerCase();


        const amount =
            Number(
                paymentData.amount
            );


        const currency =
            text(
                paymentData.currency
            ).toUpperCase();


        const paymentId =
            text(
                paymentData.paymentId ||
                paymentData.transactionId ||
                paymentData.id
            );


        if (
            status !== "verified"
        ) {

            return false;

        }


        if (
            amount !==
            CONFIG.showroomPrice
        ) {

            return false;

        }


        if (
            currency !==
            CONFIG.currency
        ) {

            return false;

        }


        if (!paymentId) {

            return false;

        }


        state.verifiedPayment = {

            status:
                "verified",

            amount:
                amount,

            currency:
                currency,

            paymentId:
                paymentId,

            verifiedAt:
                new Date()
                    .toISOString()

        };


        const publish =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publish) {

            publish.disabled =
                false;

        }


        showStatus(
            "rmPaymentStatus",

            "Payment verified for $10 USD. You can now publish the selected advertisement reach: " +
            showroomReachLabel(
                getSelectedShowroomReach()
            ) +
            ".",

            "success"
        );


        return true;

    }


    /* =====================================================
       SHOWROOM SAVE / PUBLISH
       ===================================================== */

    async function publishShowroom() {

        if (!requireLogin()) {

            return;

        }


        const data =
            showroomFormData();


        const validation =
            validateShowroom(
                data
            );


        if (validation) {

            showStatus(
                "rmShowroomStatus",
                validation,
                "error"
            );

            return;

        }


        if (!state.verifiedPayment) {

            showStatus(
                "rmShowroomStatus",
                "Verified $10 USD payment is required before publishing.",
                "error"
            );

            return;

        }


        const imageInput =
            byId(
                "rmShowroomImage"
            );


        const videoInput =
            byId(
                "rmShowroomVideo"
            );


        const publishButton =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publishButton) {

            publishButton.disabled =
                true;

            publishButton.textContent =
                "Publishing...";

        }


        try {

            let image =
                null;

            let video =
                null;


            if (
                imageInput &&
                imageInput.files &&
                imageInput.files[0]
            ) {

                image =
                    await processImage(
                        imageInput.files[0]
                    );

            }


            if (
                videoInput &&
                videoInput.files &&
                videoInput.files[0]
            ) {

                video =
                    await processVideo(
                        videoInput.files[0]
                    );

            }


            const existing =
                state.editingShowroomId
                    ? state.showrooms.find(
                        function (item) {

                            return (
                                item.id ===
                                state.editingShowroomId
                            );

                        }
                    )
                    : null;


            const country =
                getCountryObject(
                    data.country
                );


            if (existing) {

                if (
                    normalizeEmail(
                        existing.ownerEmail
                    ) !==
                    normalizeEmail(
                        state.account.email
                    )
                ) {

                    throw new Error(
                        "You can edit only your own advertisement."
                    );

                }


                if (!image) {

                    image =
                        existing.image ||
                        null;

                }


                if (!video) {

                    video =
                        existing.video ||
                        null;

                }


                Object.assign(
                    existing,
                    {

                        name:
                            data.name,

                        type:
                            data.type,

                        typeLabel:
                            showroomTypeLabel(
                                data.type
                            ),

                        reach:
                            data.reach,

                        country:
                            getCountryValue(
                                data.country
                            ),

                        countryName:
                            country
                                ? country.name
                                : data.country,

                        countryFlag:
                            country
                                ? country.flag
                                : "",

                        countryCode2:
                            country
                                ? country.code2
                                : "",

                        countryCode3:
                            country
                                ? country.code3
                                : "",

                        state:
                            data.state,

                        district:
                            data.district,

                        taluka:
                            data.taluka,

                        pin:
                            data.pin,

                        phone:
                            data.phone,

                        email:
                            data.email,

                        description:
                            data.description,

                        image:
                            image,

                        video:
                            video,

                        payment:
                            state.verifiedPayment,

                        status:
                            "published",

                        updatedAt:
                            new Date()
                                .toISOString()

                    }
                );


                saveShowrooms();


                state.editingShowroomId =
                    null;


                resetShowroomForm();


                showStatus(
                    "rmShowroomStatus",

                    "Business advertisement updated successfully. Reach: " +
                    showroomReachLabel(
                        data.reach
                    ),

                    "success"
                );

            } else {

                const showroom = {

                    id:
                        createId(
                            "showroom_ad"
                        ),

                    ownerEmail:
                        state.account.email,

                    name:
                        data.name,

                    type:
                        data.type,

                    typeLabel:
                        showroomTypeLabel(
                            data.type
                        ),

                    reach:
                        data.reach,

                    country:
                        getCountryValue(
                            data.country
                        ),

                    countryName:
                        country
                            ? country.name
                            : data.country,

                    countryFlag:
                        country
                            ? country.flag
                            : "",

                    countryCode2:
                        country
                            ? country.code2
                            : "",

                    countryCode3:
                        country
                            ? country.code3
                            : "",

                    state:
                        data.state,

                    district:
                        data.district,

                    taluka:
                        data.taluka,

                    pin:
                        data.pin,

                    phone:
                        data.phone,

                    email:
                        data.email,

                    description:
                        data.description,

                    image:
                        image,

                    video:
                        video,

                    payment:
                        state.verifiedPayment,

                    status:
                        "published",

                    createdAt:
                        new Date()
                            .toISOString(),

                    updatedAt:
                        new Date()
                            .toISOString()

                };


                state.showrooms.unshift(
                    showroom
                );


                saveShowrooms();


                resetShowroomForm();


                showStatus(
                    "rmShowroomStatus",

                    "Business advertisement published successfully. Reach: " +
                    showroomReachLabel(
                        data.reach
                    ),

                    "success"
                );

            }


            renderShowrooms();

        } catch (error) {

            console.error(
                "Showroom publish error:",
                error
            );


            showStatus(
                "rmShowroomStatus",

                error.message ||
                "Unable to publish advertisement.",

                "error"
            );

        } finally {

            const button =
                byId(
                    "rmPublishShowroomBtn"
                );


            if (button) {

                button.textContent =
                    "🌍 Publish Business Advertisement — $10";

                button.disabled =
                    !state.verifiedPayment;

            }

        }

    }


    /* =====================================================
       SHOWROOM RESET
       ===================================================== */

    function resetShowroomForm() {

        const form =
            byId(
                "rmShowroomForm"
            );


        if (form) {

            form.reset();

        }


        state.editingShowroomId =
            null;

        state.verifiedPayment =
            null;


        setShowroomReach([]);


        const publish =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publish) {

            publish.disabled =
                true;

            publish.textContent =
                "🌍 Publish Business Advertisement — $10";

        }


        hideStatus(
            "rmPaymentStatus"
        );


        hideStatus(
            "rmReachStatus"
        );

    }


    /* =====================================================
       SHOWROOM EDIT
       ===================================================== */

    function editShowroom(id) {

        if (!requireLogin()) {

            return;

        }


        const item =
            state.showrooms.find(
                function (showroom) {

                    return showroom.id === id;

                }
            );


        if (!item) {

            alert(
                "Advertisement not found."
            );

            return;

        }


        if (
            normalizeEmail(item.ownerEmail) !==
            normalizeEmail(state.account.email)
        ) {

            alert(
                "You can edit only your own advertisement."
            );

            return;

        }


        state.editingShowroomId =
            id;


        function setValue(
            elementId,
            value
        ) {

            const element =
                byId(
                    elementId
                );


            if (element) {

                element.value =
                    value || "";

            }

        }


        setValue(
            "rmShowroomName",
            item.name
        );


        setValue(
            "rmShowroomType",
            item.type
        );


        setShowroomReach(
            item.reach
        );


        /*
         * Supports both:
         *
         * new ISO-2 storage
         * old country-name storage
         */

        setValue(
            "rmShowroomCountry",
            getCountryValue(
                item.country ||
                item.countryName ||
                ""
            )
        );


        setValue(
            "rmShowroomState",
            item.state
        );


        setValue(
            "rmShowroomDistrict",
            item.district
        );


        setValue(
            "rmShowroomTaluka",
            item.taluka
        );


        setValue(
            "rmShowroomPin",
            item.pin
        );


        setValue(
            "rmShowroomPhone",
            item.phone
        );


        setValue(
            "rmShowroomEmail",
            item.email
        );


        setValue(
            "rmShowroomDescription",
            item.description
        );


        /*
         * Editing requires a fresh
         * verified payment before republishing.
         */

        state.verifiedPayment =
            null;


        const publish =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publish) {

            publish.disabled =
                true;

        }


        showStatus(
            "rmPaymentStatus",

            "Editing requires a fresh verified $10 USD payment before republishing.",

            "error"
        );


        showStatus(
            "rmReachStatus",

            "Current reach: " +
            showroomReachLabel(
                item.reach
            ),

            "success"
        );


        const section =
            byId(
                "rmShowroom"
            );


        if (section) {

            section.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }

    }


    /* =====================================================
       DELETE SHOWROOM
       ===================================================== */

    function deleteShowroom(id) {

        if (!requireLogin()) {

            return;

        }


        const item =
            state.showrooms.find(
                function (showroom) {

                    return showroom.id === id;

                }
            );


        if (!item) {

            return;

        }


        if (
            normalizeEmail(item.ownerEmail) !==
            normalizeEmail(state.account.email)
        ) {

            alert(
                "You can delete only your own advertisement."
            );

            return;

        }


        if (
            !window.confirm(
                "Delete this business advertisement?"
            )
        ) {

            return;

        }


        state.showrooms =
            state.showrooms.filter(
                function (showroom) {

                    return showroom.id !== id;

                }
            );


        saveShowrooms();


        if (
            state.editingShowroomId === id
        ) {

            resetShowroomForm();

        }


        renderShowrooms();

    }


    /* =====================================================
       SHOWROOM MEDIA
       ===================================================== */

    function renderShowroomMedia(item) {

        let html = "";


        if (
            item.image &&
            item.image.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<img src="' +
                escapeHTML(
                    item.image.data
                ) +
                '" alt="Business advertisement image" loading="lazy">' +

                "</div>";

        }


        if (
            item.video &&
            item.video.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<video controls preload="metadata">' +

                '<source src="' +
                escapeHTML(
                    item.video.data
                ) +
                '" type="' +
                escapeHTML(
                    item.video.type ||
                    "video/mp4"
                ) +
                '">' +

                "Your browser does not support video." +

                "</video>" +

                "</div>";

        }


        return html;

    }


    /* =====================================================
       SHOWROOM CARD
       ===================================================== */

    function createShowroomCard(item) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "rm-showroom-card";


        const location = [];


        if (item.taluka) {

            location.push(
                item.taluka
            );

        }


        if (item.district) {

            location.push(
                item.district
            );

        }


        if (item.state) {

            location.push(
                item.state
            );

        }


        if (item.country) {

            location.push(
                getCountryName(
                    item.country
                )
            );

        }


        const locationText =
            location.length
                ? location.join(", ")
                : "Location not specified";


        const owner =
            state.account &&
            normalizeEmail(
                item.ownerEmail
            ) ===
            normalizeEmail(
                state.account.email
            );


        const reachText =
            showroomReachLabel(
                item.reach
            );


        let html =

            "<h3>" +
            escapeHTML(
                item.name
            ) +
            "</h3>" +

            "<p><strong>🏢 Business Type:</strong> " +
            escapeHTML(
                item.typeLabel ||
                showroomTypeLabel(
                    item.type
                )
            ) +
            "</p>" +

            "<p><strong>🌍 Advertisement Reach:</strong> " +
            escapeHTML(
                reachText
            ) +
            "</p>" +

            "<p><strong>📍 Business Location:</strong> " +
            escapeHTML(
                locationText
            ) +
            "</p>";


        if (item.pin) {

            html +=

                "<p><strong>PIN / ZIP:</strong> " +
                escapeHTML(
                    item.pin
                ) +
                "</p>";

        }


        html +=

            "<p><strong>📞 Phone / WhatsApp:</strong> " +
            escapeHTML(
                item.phone
            ) +
            "</p>" +

            "<p><strong>✉️ Email:</strong> " +

            '<a href="mailto:' +
            escapeHTML(
                item.email
            ) +
            '">' +

            escapeHTML(
                item.email
            ) +

            "</a></p>";


        if (item.description) {

            html +=

                "<p>" +
                escapeHTML(
                    item.description
                ) +
                "</p>";

        }


        html +=
            renderShowroomMedia(
                item
            );


        if (
            item.payment &&
            item.payment.paymentId
        ) {

            html +=
                "<p><strong>Payment:</strong> Verified</p>";

        }


        if (owner) {

            html +=

                '<div class="rm-actions">' +

                '<button type="button" data-rm-action="edit-showroom" data-id="' +
                escapeHTML(
                    item.id
                ) +
                '">' +

                "✏️ Edit" +

                "</button>" +

                '<button type="button" data-rm-action="delete-showroom" data-id="' +
                escapeHTML(
                    item.id
                ) +
                '">' +

                "🗑️ Delete" +

                "</button>" +

                "</div>";

        }


        card.innerHTML =
            html;


        return card;

    }


    /* =====================================================
       RENDER SHOWROOMS
       ===================================================== */

    function renderShowrooms() {

        const container =
            byId(
                "rmShowroomListings"
            );


        if (!container) {

            return;

        }


        if (!state.loggedIn) {

            container.innerHTML =
                "<div>" +
                "Login to view your showroom advertisements." +
                "</div>";

            return;

        }


        const email =
            state.account.email;


        const mine =
            state.showrooms.filter(
                function (item) {

                    return (
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            email
                        )
                    );

                }
            );


        if (!mine.length) {

            container.innerHTML =
                "<div>" +
                "No showroom advertisements created yet." +
                "</div>";

            return;

        }


        container.innerHTML =
            "";


        mine.forEach(
            function (item) {

                container.appendChild(
                    createShowroomCard(
                        item
                    )
                );

            }
        );

    }


    /* =====================================================
       ACTION EVENTS
       ===================================================== */

    function handleListingActions(event) {

        const button =
            event.target.closest(
                "button[data-rm-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.rmAction;


        const id =
            button.dataset.id;


        if (!id) {

            return;

        }


        if (
            action ===
            "edit-listing"
        ) {

            editListing(
                id
            );

        }


        if (
            action ===
            "delete-listing"
        ) {

            deleteListing(
                id
            );

        }

    }


    function handleShowroomActions(event) {

        const button =
            event.target.closest(
                "button[data-rm-action]"
            );


        if (!button) {

            return;

        }


        const action =
            button.dataset.rmAction;


        const id =
            button.dataset.id;


        if (!id) {

            return;

        }


        if (
            action ===
            "edit-showroom"
        ) {

            editShowroom(
                id
            );

        }


        if (
            action ===
            "delete-showroom"
        ) {

            deleteShowroom(
                id
            );

        }

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function bindEvents() {

        const loginButton =
            byId(
                "rmLoginButton"
            );


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                handleLogin
            );

        }


        const logoutButton =
            byId(
                "rmLogoutButton"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        const listingType =
            byId(
                "rmListingType"
            );


        if (listingType) {

            listingType.addEventListener(
                "change",
                updateCategoryOptions
            );

        }


        const listingForm =
            byId(
                "rmListingForm"
            );


        if (listingForm) {

            listingForm.addEventListener(
                "submit",
                saveListing
            );

        }


        const cancelEdit =
            byId(
                "rmCancelEditButton"
            );


        if (cancelEdit) {

            cancelEdit.addEventListener(
                "click",
                function () {

                    resetListingForm();

                    hideStatus(
                        "rmListingStatus"
                    );

                }
            );

        }


        const listings =
            getMyListingsContainer();


        if (listings) {

            listings.addEventListener(
                "click",
                handleListingActions
            );

        }


        const payButton =
            byId(
                "rmPayShowroomBtn"
            );


        if (payButton) {

            payButton.addEventListener(
                "click",
                startShowroomPayment
            );

        }


        const publishButton =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publishButton) {

            publishButton.addEventListener(
                "click",
                publishShowroom
            );

        }


        const showroomForm =
            byId(
                "rmShowroomForm"
            );


        if (showroomForm) {

            showroomForm.addEventListener(
                "reset",
                function () {

                    setTimeout(
                        function () {

                            state.editingShowroomId =
                                null;

                            state.verifiedPayment =
                                null;

                            setShowroomReach([]);

                        },
                        0
                    );

                }
            );

        }


        const showroomListings =
            byId(
                "rmShowroomListings"
            );


        if (showroomListings) {

            showroomListings.addEventListener(
                "click",
                handleShowroomActions
            );

        }


        bindReachChangeEvents();

    }


    /* =====================================================
       REFRESH
       ===================================================== */

    function refreshCountries() {

        loadCountries();

        populateCountries();

    }


    function refreshCategories() {

        updateCategoryOptions();

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_REGULAR_MARKETPLACE = {

        version:
            CONFIG.version,

        config:
            CONFIG,

        state:
            state,

        categories:
            CATEGORY_DATA,

        showroomReach:
            SHOWROOM_REACH,

        showroomReachLabels:
            SHOWROOM_REACH_LABELS,

        login:
            handleLogin,

        logout:
            logout,

        acceptVerifiedPayment:
            acceptVerifiedPayment,

        startShowroomPayment:
            startShowroomPayment,

        renderListings:
            renderListings,

        renderShowrooms:
            renderShowrooms,

        refreshCountries:
            refreshCountries,

        refreshCategories:
            refreshCategories,

        editListing:
            editListing,

        deleteListing:
            deleteListing,

        editShowroom:
            editShowroom,

        deleteShowroom:
            deleteShowroom,

        getSelectedShowroomReach:
            getSelectedShowroomReach,

        findCountry:
            findCountry,

        getCountryName:
            getCountryName,

        getCountryObject:
            getCountryObject

    };


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        loadStorage();

        loadCountries();

        populateCountries();

        updateCategoryOptions();

        bindEvents();

        updateLoginUI();

        renderListings();

        renderShowrooms();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


})();