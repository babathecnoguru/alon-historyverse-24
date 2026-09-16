/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE ENGINE
   ---------------------------------------------------------
   Version: 24.2 SAFE REGULAR MARKETPLACE
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
   • Country database integration
   • Business / Showroom system
   • Worldwide showroom reach
   • Showroom Save / Edit / Delete
   • Payment verification gate
   • Browser persistence
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const CONFIG = {

        version: "24.2",

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

        imageLimit:
            8 * 1024 * 1024,

        videoLimit:
            20 * 1024 * 1024

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


        if (!email || !email.includes("@")) {

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


        /*
         * Browser-only account.
         * Password is stored locally for this
         * static marketplace implementation.
         *
         * A production server should replace this
         * with secure server-side authentication.
         */

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

        if (state.loggedIn && state.account) {

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


        if (!loginBox || !profileBox) {
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
                byId(
                    "rmProfileName"
                );

            const email =
                byId(
                    "rmProfileEmail"
                );


            if (name) {

                name.textContent =
                    state.account.name ||
                    "";

            }


            if (email) {

                email.textContent =
                    state.account.email ||
                    "";

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

            {
                value: "electronics",
                label: "📱 Electronics"
            },

            {
                value: "mobile",
                label: "📱 Mobile Phones"
            },

            {
                value: "computer",
                label: "💻 Computers / Laptops"
            },

            {
                value: "furniture",
                label: "🪑 Furniture"
            },

            {
                value: "clothing",
                label: "👕 Clothing / Fashion"
            },

            {
                value: "footwear",
                label: "👟 Footwear"
            },

            {
                value: "home",
                label: "🏠 Home & Household"
            },

            {
                value: "appliances",
                label: "🔌 Home Appliances"
            },

            {
                value: "kitchen",
                label: "🍳 Kitchen Items"
            },

            {
                value: "books",
                label: "📚 Books"
            },

            {
                value: "sports",
                label: "⚽ Sports & Fitness"
            },

            {
                value: "toys",
                label: "🧸 Toys & Kids"
            },

            {
                value: "tools",
                label: "🔧 Tools"
            },

            {
                value: "machinery",
                label: "⚙️ Machinery & Equipment"
            },

            {
                value: "jewellery",
                label: "💎 Jewellery"
            },

            {
                value: "musical",
                label: "🎸 Musical Instruments"
            },

            {
                value: "agriculture",
                label: "🌾 Agriculture Products"
            },

            {
                value: "office",
                label: "🏢 Office Equipment"
            },

            {
                value: "collectibles",
                label: "🏺 Collectibles & Antiques"
            },

            {
                value: "other-item",
                label: "📦 Other Item"
            }

        ],


        property: [

            {
                value: "house",
                label: "🏠 House"
            },

            {
                value: "flat",
                label: "🏢 Flat / Apartment"
            },

            {
                value: "bungalow",
                label: "🏡 Bungalow"
            },

            {
                value: "villa",
                label: "🏘️ Villa"
            },

            {
                value: "plot",
                label: "📐 Residential Plot"
            },

            {
                value: "land",
                label: "🌳 Land"
            },

            {
                value: "farm",
                label: "🌾 Farm / Agricultural Land"
            },

            {
                value: "shop",
                label: "🏪 Shop"
            },

            {
                value: "office",
                label: "🏢 Office"
            },

            {
                value: "warehouse",
                label: "🏭 Warehouse"
            },

            {
                value: "factory",
                label: "🏭 Factory"
            },

            {
                value: "commercial-property",
                label: "🏬 Commercial Property"
            },

            {
                value: "hotel-property",
                label: "🏨 Hotel / Resort Property"
            },

            {
                value: "rental-property",
                label: "🔑 Rental Property"
            },

            {
                value: "other-property",
                label: "🏠 Other Property"
            }

        ],


        vehicle: [

            {
                value: "car",
                label: "🚗 Car"
            },

            {
                value: "suv",
                label: "🚙 SUV / 4x4"
            },

            {
                value: "motorcycle-bike",
                label: "🏍️ Motorcycle / Bike"
            },

            {
                value: "scooter",
                label: "🛵 Scooter"
            },

            {
                value: "electric-vehicle",
                label: "⚡ Electric Vehicle"
            },

            {
                value: "truck",
                label: "🚚 Truck"
            },

            {
                value: "trailer",
                label: "🚛 Trailer"
            },

            {
                value: "tractor",
                label: "🚜 Tractor"
            },

            {
                value: "jcb-excavator",
                label: "🏗️ JCB / Excavator"
            },

            {
                value: "bus",
                label: "🚌 Bus"
            },

            {
                value: "van",
                label: "🚐 Van"
            },

            {
                value: "ambulance",
                label: "🚑 Ambulance"
            },

            {
                value: "taxi",
                label: "🚕 Taxi"
            },

            {
                value: "commercial-vehicle",
                label: "🚛 Commercial Vehicle"
            },

            {
                value: "three-wheeler",
                label: "🛺 Three-Wheeler"
            },

            {
                value: "farm-vehicle",
                label: "🚜 Farm Vehicle"
            },

            {
                value: "construction-vehicle",
                label: "🏗️ Construction Vehicle"
            },

            {
                value: "boat",
                label: "🛥️ Boat / Water Vehicle"
            },

            {
                value: "other-vehicle",
                label: "🚘 Other Vehicle"
            }

        ]

    };


    function categoryLabel(
        type,
        value
    ) {

        const list =
            CATEGORY_DATA[type] ||
            [];


        const item =
            list.find(
                function (category) {

                    return (
                        category.value ===
                        value
                    );

                }
            );


        return item
            ? item.label
            : value || "Other";

    }


    function updateCategoryOptions() {

        const typeSelect =
            byId(
                "rmListingType"
            );

        const categorySelect =
            byId(
                "rmListingCategory"
            );


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
                document.createElement(
                    "option"
                );

            option.value =
                "";

            option.textContent =
                "Select type first";

            categorySelect.appendChild(
                option
            );

            return;

        }


        const first =
            document.createElement(
                "option"
            );

        first.value =
            "";

        first.textContent =
            "Select Category";

        categorySelect.appendChild(
            first
        );


        (
            CATEGORY_DATA[type] ||
            []
        ).forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );

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

    function getCountryDatabase() {

        const sources = [

            window.MARKETPLACE_COUNTRIES,

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
                Array.isArray(
                    source.countries
                )
            ) {

                return source.countries;

            }

        }


        return [];

    }


    function normalizeCountry(
        item
    ) {

        if (!item) {
            return null;
        }


        if (
            typeof item ===
            "string"
        ) {

            return {

                name:
                    item,

                iso:
                    "",

                callingCode:
                    "",

                flag:
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


        const iso =
            text(
                item.iso ||
                item.iso2 ||
                item.code ||
                item.countryCode ||
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


        return {

            name:
                text(name).trim(),

            iso:
                iso,

            callingCode:
                callingCode,

            flag:
                flag

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
                    normalizeCountry(
                        item
                    );


                if (
                    !country ||
                    !country.name
                ) {

                    return;

                }


                const key =
                    (
                        country.iso ||
                        country.name
                    )
                    .toLowerCase();


                if (
                    seen.has(key)
                ) {

                    return;

                }


                seen.add(key);

                result.push(
                    country
                );

            }
        );


        result.sort(
            function (a, b) {

                return a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        sensitivity:
                            "base"
                    }
                );

            }
        );


        state.countries =
            result;

    }


    function countryLabel(
        country
    ) {

        let value = "";


        if (country.flag) {

            value +=
                country.flag +
                " ";

        }


        value +=
            country.name;


        if (country.iso) {

            value +=
                " (" +
                country.iso +
                ")";

        }


        if (country.callingCode) {

            value +=
                " " +
                country.callingCode;

        }


        return value;

    }


    function populateCountries() {

        const listingCountry =
            byId(
                "rmCountry"
            );

        const showroomCountry =
            byId(
                "rmShowroomCountry"
            );


        if (listingCountry) {

            const current =
                listingCountry.value;


            listingCountry.innerHTML =
                "";


            const empty =
                document.createElement(
                    "option"
                );

            empty.value =
                "";

            empty.textContent =
                "Select Country";

            listingCountry.appendChild(
                empty
            );


            state.countries.forEach(
                function (country) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        country.iso ||
                        country.name;

                    option.textContent =
                        countryLabel(
                            country
                        );

                    listingCountry.appendChild(
                        option
                    );

                }
            );


            listingCountry.value =
                current;

        }


        if (showroomCountry) {

            const current =
                showroomCountry.value;


            showroomCountry.innerHTML =
                "";


            const empty =
                document.createElement(
                    "option"
                );

            empty.value =
                "";

            empty.textContent =
                "Select Country";

            showroomCountry.appendChild(
                empty
            );


            state.countries.forEach(
                function (country) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        country.iso ||
                        country.name;

                    option.textContent =
                        countryLabel(
                            country
                        );

                    showroomCountry.appendChild(
                        option
                    );

                }
            );


            showroomCountry.value =
                current;

        }

    }


    function findCountry(
        value
    ) {

        const target =
            text(value)
                .trim()
                .toLowerCase();


        if (!target) {
            return null;
        }


        return (

            state.countries.find(
                function (country) {

                    return (
                        country.iso
                            .toLowerCase() ===
                        target
                    );

                }
            ) ||

            state.countries.find(
                function (country) {

                    return (
                        country.name
                            .toLowerCase() ===
                        target
                    );

                }
            ) ||

            null

        );

    }


    function getCountryName(
        value
    ) {

        const country =
            findCountry(value);


        if (country) {

            return countryLabel(
                country
            );

        }


        return text(value) ||
            "Not specified";

    }


    /* =====================================================
       FILE MEDIA
       ===================================================== */

    function readFile(
        file
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

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


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    async function processImage(
        file
    ) {

        if (!file) {
            return null;
        }


        if (
            !file.type.startsWith(
                "image/"
            )
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


    async function processVideo(
        file
    ) {

        if (!file) {
            return null;
        }


        if (
            !file.type.startsWith(
                "video/"
            )
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
                ? text(
                    element.value
                ).trim()
                : "";

        }


        return {

            type:
                value(
                    "rmListingType"
                ),

            category:
                value(
                    "rmListingCategory"
                ),

            condition:
                value(
                    "rmListingCondition"
                ),

            title:
                value(
                    "rmListingTitle"
                ),

            price:
                value(
                    "rmListingPrice"
                ),

            country:
                value(
                    "rmCountry"
                ),

            state:
                value(
                    "rmState"
                ),

            district:
                value(
                    "rmDistrict"
                ),

            taluka:
                value(
                    "rmTaluka"
                ),

            pin:
                value(
                    "rmPin"
                ),

            phone:
                value(
                    "rmPhone"
                ),

            email:
                value(
                    "rmEmail"
                ),

            description:
                value(
                    "rmDescription"
                )

        };

    }


    function validateListing(
        data
    ) {

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


    async function saveListing(
        event
    ) {

        event.preventDefault();


        if (!requireLogin()) {
            return;
        }


        const data =
            listingFormData();


        const validation =
            validateListing(
                data
            );


        if (validation) {

            showStatus(
                "rmListingStatus",
                validation,
                "error"
            );

            return;

        }


        const saveButton =
            byId(
                "rmSaveListingButton"
            );


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.textContent =
                "Saving...";

        }


        try {

            const imageInput =
                byId(
                    "rmImage"
                );


            const videoInput =
                byId(
                    "rmVideo"
                );


            let image = null;

            let video = null;


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


            if (existing) {

                if (
                    existing.ownerEmail !==
                    state.account.email
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


                existing.type =
                    data.type;

                existing.category =
                    data.category;

                existing.condition =
                    data.condition;

                existing.title =
                    data.title;

                existing.price =
                    data.price;

                existing.country =
                    data.country;

                existing.state =
                    data.state;

                existing.district =
                    data.district;

                existing.taluka =
                    data.taluka;

                existing.pin =
                    data.pin;

                existing.phone =
                    data.phone;

                existing.email =
                    data.email;

                existing.description =
                    data.description;

                existing.image =
                    image;

                existing.video =
                    video;

                existing.updatedAt =
                    new Date()
                        .toISOString();


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
                        data.country,

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
                    state.editingListingId
                        ? "Update Listing"
                        : "💾 Save Listing";

            }

        }

    }


    /* =====================================================
       LISTING RESET
       ===================================================== */

    function resetListingForm() {

        const form =
            byId(
                "rmListingForm"
            );


        if (form) {

            form.reset();

        }


        state.editingListingId =
            null;


        updateCategoryOptions();


        const button =
            byId(
                "rmSaveListingButton"
            );


        if (button) {

            button.textContent =
                "💾 Save Listing";

        }


        const cancel =
            byId(
                "rmCancelEditButton"
            );


        if (cancel) {

            cancel.classList.add(
                "rm-hidden"
            );

        }

    }


    /* =====================================================
       EDIT LISTING
       ===================================================== */

    function editListing(
        id
    ) {

        if (!requireLogin()) {
            return;
        }


        const item =
            state.listings.find(
                function (listing) {

                    return (
                        listing.id ===
                        id
                    );

                }
            );


        if (!item) {

            alert(
                "Listing not found."
            );

            return;

        }


        if (
            item.ownerEmail !==
            state.account.email
        ) {

            alert(
                "You can edit only your own listing."
            );

            return;

        }


        state.editingListingId =
            id;


        const setValue =
            function (
                id,
                value
            ) {

                const element =
                    byId(id);

                if (element) {

                    element.value =
                        value || "";

                }

            };


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

        setValue(
            "rmCountry",
            item.country
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
            byId(
                "rmSaveListingButton"
            );


        if (button) {

            button.textContent =
                "Update Listing";

        }


        const cancel =
            byId(
                "rmCancelEditButton"
            );


        if (cancel) {

            cancel.classList.remove(
                "rm-hidden"
            );

        }


        const section =
            byId(
                "rmCreateListing"
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
       DELETE LISTING
       ===================================================== */

    function deleteListing(
        id
    ) {

        if (!requireLogin()) {
            return;
        }


        const item =
            state.listings.find(
                function (listing) {

                    return (
                        listing.id ===
                        id
                    );

                }
            );


        if (!item) {
            return;
        }


        if (
            item.ownerEmail !==
            state.account.email
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

                    return (
                        listing.id !==
                        id
                    );

                }
            );


        saveListings();


        if (
            state.editingListingId ===
            id
        ) {

            resetListingForm();

        }


        renderListings();

    }


    /* =====================================================
       LISTING MEDIA
       ===================================================== */

    function renderListingMedia(
        item
    ) {

        let html = "";


        if (
            item.image &&
            item.image.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<img src="' +
                item.image.data +
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
                item.video.data +
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
       LISTING CARD
       ===================================================== */

    function createListingCard(
        item
    ) {

        const card =
            document.createElement(
                "article"
            );


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

                :

            item.type === "property"
                ? "🏠 Property"

                :

            "🛍️ General Item";


        card.innerHTML =

            "<h3>" +

            escapeHTML(
                item.title
            ) +

            "</h3>" +

            "<p>" +

            "<strong>Type:</strong> " +

            typeLabel +

            "</p>" +

            "<p>" +

            "<strong>Category:</strong> " +

            escapeHTML(
                categoryLabel(
                    item.type,
                    item.category
                )
            ) +

            "</p>" +

            "<p>" +

            "<strong>Condition:</strong> " +

            escapeHTML(
                item.condition ||
                "Not specified"
            ) +

            "</p>" +

            "<p>" +

            "<strong>Price:</strong> " +

            escapeHTML(
                item.price
            ) +

            " " +

            escapeHTML(
                CONFIG.currency
            ) +

            "</p>" +

            "<p>" +

            "<strong>📍 Location:</strong> " +

            escapeHTML(
                locationText
            ) +

            "</p>" +

            (
                item.pin
                    ? "<p><strong>PIN / ZIP:</strong> " +
                      escapeHTML(
                          item.pin
                      ) +
                      "</p>"
                    : ""
            ) +

            (
                item.phone
                    ? "<p><strong>📞 Phone:</strong> " +
                      escapeHTML(
                          item.phone
                      ) +
                      "</p>"
                    : ""
            ) +

            (
                item.email
                    ? "<p><strong>✉️ Email:</strong> " +
                      escapeHTML(
                          item.email
                      ) +
                      "</p>"
                    : ""
            ) +

            (
                item.description
                    ? "<p>" +
                      escapeHTML(
                          item.description
                      ) +
                      "</p>"
                    : ""
            ) +

            renderListingMedia(
                item
            ) +

            (
                item.ownerEmail ===
                (
                    state.account
                        ? state.account.email
                        : ""
                )
                    ?

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

                "</div>"

                    :

                ""

            );


        return card;

    }


    /* =====================================================
       MY LISTINGS CONTAINER
       ===================================================== */

    function getMyListingsContainer() {

        /*
         * The supplied HTML historically used the same
         * id "rmMyListings" for the section and inner
         * container. This helper safely selects the inner
         * element when duplicate IDs exist.
         */

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
            section.tagName ===
            "SECTION"
        ) {

            return (
                section.querySelector(
                    "div"
                ) ||
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
                "<div>" +
                "Login to view your listings." +
                "</div>";

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
                "<div>" +
                "No listings created yet." +
                "</div>";

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
       SHOWROOM FORM
       ===================================================== */

    function showroomFormData() {

        function value(id) {

            const element =
                byId(id);

            return element
                ? text(
                    element.value
                ).trim()
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


    function showroomTypeLabel(
        value
    ) {

        const select =
            byId(
                "rmShowroomType"
            );


        if (!select) {
            return value || "Other Business";
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
            : value || "Other Business";

    }


    function validateShowroom(
        data
    ) {

        if (!state.loggedIn) {

            return "Please login first.";

        }


        if (!data.name) {

            return "Business / Showroom name is required.";

        }


        if (!data.type) {

            return "Please select Business / Showroom Type.";

        }


        if (!data.country) {

            return "Please select business country.";

        }


        if (!data.phone) {

            return "Business phone / WhatsApp is required.";

        }


        if (!data.email) {

            return "Business email is required.";

        }


        if (!data.description) {

            return "Business description is required.";

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


        /*
         * IMPORTANT:
         *
         * This is intentionally NOT a fake payment.
         *
         * A static GitHub Pages frontend cannot securely
         * verify a real $10 payment by itself.
         *
         * The real Google Pay / UPI gateway must call
         * acceptVerifiedPayment() only after server-side
         * verification.
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
            "Payment gateway is not connected yet. No payment has been charged. Connect a real payment gateway and server-side verification before publishing.",
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
            )
            .toLowerCase();


        const amount =
            Number(
                paymentData.amount
            );


        const currency =
            text(
                paymentData.currency
            )
            .toUpperCase();


        const paymentId =
            text(
                paymentData.paymentId ||
                paymentData.transactionId ||
                paymentData.id
            );


        if (
            status !==
            "verified"
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
            "Payment verified. You can now publish the worldwide advertisement.",
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


        if (
            !state.verifiedPayment
        ) {

            showStatus(
                "rmShowroomStatus",
                "Verified $10 payment is required before publishing.",
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

            let image = null;

            let video = null;


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


            if (existing) {

                if (
                    existing.ownerEmail !==
                    state.account.email
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


                existing.name =
                    data.name;

                existing.type =
                    data.type;

                existing.typeLabel =
                    showroomTypeLabel(
                        data.type
                    );

                existing.country =
                    data.country;

                existing.state =
                    data.state;

                existing.district =
                    data.district;

                existing.taluka =
                    data.taluka;

                existing.pin =
                    data.pin;

                existing.phone =
                    data.phone;

                existing.email =
                    data.email;

                existing.description =
                    data.description;

                existing.reach =
                    "WORLDWIDE";

                existing.image =
                    image;

                existing.video =
                    video;

                existing.payment =
                    state.verifiedPayment;

                existing.updatedAt =
                    new Date()
                        .toISOString();


                saveShowrooms();


                state.editingShowroomId =
                    null;


                resetShowroomForm();


                showStatus(
                    "rmShowroomStatus",
                    "Business advertisement updated successfully.",
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
                        "WORLDWIDE",

                    country:
                        data.country,

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
                    "Worldwide business advertisement published successfully.",
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
                    "🌍 Publish Worldwide Advertisement";

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


        const publish =
            byId(
                "rmPublishShowroomBtn"
            );


        if (publish) {

            publish.disabled =
                true;

            publish.textContent =
                "🌍 Publish Worldwide Advertisement";

        }


        hideStatus(
            "rmPaymentStatus"
        );

    }


    /* =====================================================
       SHOWROOM EDIT
       ===================================================== */

    function editShowroom(
        id
    ) {

        if (!requireLogin()) {
            return;
        }


        const item =
            state.showrooms.find(
                function (showroom) {

                    return (
                        showroom.id ===
                        id
                    );

                }
            );


        if (!item) {

            alert(
                "Advertisement not found."
            );

            return;

        }


        if (
            item.ownerEmail !==
            state.account.email
        ) {

            alert(
                "You can edit only your own advertisement."
            );

            return;

        }


        state.editingShowroomId =
            id;


        const setValue =
            function (
                id,
                value
            ) {

                const element =
                    byId(id);

                if (element) {

                    element.value =
                        value || "";

                }

            };


        setValue(
            "rmShowroomName",
            item.name
        );

        setValue(
            "rmShowroomType",
            item.type
        );

        setValue(
            "rmShowroomCountry",
            item.country
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
         * Editing requires a fresh verified payment
         * before republishing.
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
            "Please complete payment verification again before republishing the edited advertisement.",
            "error"
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

    function deleteShowroom(
        id
    ) {

        if (!requireLogin()) {
            return;
        }


        const item =
            state.showrooms.find(
                function (showroom) {

                    return (
                        showroom.id ===
                        id
                    );

                }
            );


        if (!item) {
            return;
        }


        if (
            item.ownerEmail !==
            state.account.email
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

                    return (
                        showroom.id !==
                        id
                    );

                }
            );


        saveShowrooms();


        if (
            state.editingShowroomId ===
            id
        ) {

            resetShowroomForm();

        }


        renderShowrooms();

    }


    /* =====================================================
       SHOWROOM MEDIA
       ===================================================== */

    function renderShowroomMedia(
        item
    ) {

        let html = "";


        if (
            item.image &&
            item.image.data
        ) {

            html +=

                '<div class="rm-media">' +

                '<img src="' +
                item.image.data +
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
                item.video.data +
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

    function createShowroomCard(
        item
    ) {

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


        card.innerHTML =

            "<h3>" +

            escapeHTML(
                item.name
            ) +

            "</h3>" +

            "<p>" +

            "<strong>🏢 Business Type:</strong> " +

            escapeHTML(
                item.typeLabel ||
                showroomTypeLabel(
                    item.type
                )
            ) +

            "</p>" +

            "<p>" +

            "<strong>🌍 Advertisement Reach:</strong> WORLDWIDE" +

            "</p>" +

            "<p>" +

            "<strong>📍 Business Location:</strong> " +

            escapeHTML(
                locationText
            ) +

            "</p>" +

            (
                item.pin
                    ? "<p><strong>PIN / ZIP:</strong> " +
                      escapeHTML(
                          item.pin
                      ) +
                      "</p>"
                    : ""
            ) +

            "<p>" +

            "<strong>📞 Phone / WhatsApp:</strong> " +

            escapeHTML(
                item.phone
            ) +

            "</p>" +

            "<p>" +

            "<strong>✉️ Email:</strong> " +

            '<a href="mailto:' +
            escapeHTML(
                item.email
            ) +
            '">' +

            escapeHTML(
                item.email
            ) +

            "</a>" +

            "</p>" +

            (
                item.description
                    ? "<p>" +
                      escapeHTML(
                          item.description
                      ) +
                      "</p>"
                    : ""
            ) +

            renderShowroomMedia(
                item
            ) +

            (
                item.payment &&
                item.payment.paymentId

                    ?

                "<p>" +

                "<strong>Payment:</strong> Verified" +

                "</p>"

                    :

                ""

            ) +

            (
                owner

                    ?

                '<div class="rm-actions">' +

                '<button type="button" data-rm-action="edit-showroom" data-id="' +
                escapeHTML(item.id) +
                '">' +

                "✏️ Edit" +

                "</button>" +

                '<button type="button" data-rm-action="delete-showroom" data-id="' +
                escapeHTML(item.id) +
                '">' +

                "🗑️ Delete" +

                "</button>" +

                "</div>"

                    :

                ""

            );


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

    function handleListingActions(
        event
    ) {

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

            editListing(id);

        }


        if (
            action ===
            "delete-listing"
        ) {

            deleteListing(id);

        }

    }


    function handleShowroomActions(
        event
    ) {

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

            editShowroom(id);

        }


        if (
            action ===
            "delete-showroom"
        ) {

            deleteShowroom(id);

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
                function () {

                    updateCategoryOptions();

                }
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

    }


    /* =====================================================
       REFRESH FUNCTIONS
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
            deleteShowroom

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