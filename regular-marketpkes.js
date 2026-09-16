/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE ENGINE
   ---------------------------------------------------------
   Version: 24.4 SAFE REGULAR MARKETPLACE
   Creator: Baba Thecno Guru

   IMPORTANT:
   • Regular Marketplace ONLY
   • Global Marketplace is NOT modified
   • Uses ../marketplace-countries.js
   • Supports Item / Property / Vehicle
   • Login / Agreement / Profile / Logout
   • Save / Edit / Delete
   • Image / Video
   • Business / Showroom
   • Global / Worldwide
   • International
   • Both reach options
   • $10 USD showroom advertisement
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

        currency: "USD",

        showroomPrice: 10,

        imageLimit:
            8 * 1024 * 1024,

        videoLimit:
            20 * 1024 * 1024

    };


    /* =====================================================
       SHOWROOM REACH
       ===================================================== */

    const SHOWROOM_REACH = {

        GLOBAL: "GLOBAL",

        INTERNATIONAL: "INTERNATIONAL"

    };


    const SHOWROOM_REACH_LABELS = {

        GLOBAL:
            "🌍 Global / Worldwide",

        INTERNATIONAL:
            "✈️ International"

    };


    /* =====================================================
       CATEGORY DATABASE
       ===================================================== */

    const CATEGORIES = {

        item: [

            {
                value: "electronics",
                label: "Electronics"
            },

            {
                value: "mobile",
                label: "Mobile Phones"
            },

            {
                value: "computer",
                label: "Computers"
            },

            {
                value: "furniture",
                label: "Furniture"
            },

            {
                value: "clothing",
                label: "Clothing"
            },

            {
                value: "footwear",
                label: "Footwear"
            },

            {
                value: "home",
                label: "Home & Household"
            },

            {
                value: "appliances",
                label: "Home Appliances"
            },

            {
                value: "kitchen",
                label: "Kitchen"
            },

            {
                value: "books",
                label: "Books"
            },

            {
                value: "sports",
                label: "Sports"
            },

            {
                value: "toys",
                label: "Toys"
            },

            {
                value: "tools",
                label: "Tools"
            },

            {
                value: "machinery",
                label: "Machinery"
            },

            {
                value: "jewellery",
                label: "Jewellery"
            },

            {
                value: "musical",
                label: "Musical Instruments"
            },

            {
                value: "agriculture",
                label: "Agriculture"
            },

            {
                value: "office",
                label: "Office"
            },

            {
                value: "collectibles",
                label: "Collectibles"
            },

            {
                value: "other-item",
                label: "Other Item"
            }

        ],


        property: [

            {
                value: "house",
                label: "House"
            },

            {
                value: "flat",
                label: "Flat / Apartment"
            },

            {
                value: "bungalow",
                label: "Bungalow"
            },

            {
                value: "villa",
                label: "Villa"
            },

            {
                value: "plot",
                label: "Plot"
            },

            {
                value: "land",
                label: "Land"
            },

            {
                value: "farm",
                label: "Farm"
            },

            {
                value: "shop",
                label: "Shop"
            },

            {
                value: "office",
                label: "Office"
            },

            {
                value: "warehouse",
                label: "Warehouse"
            },

            {
                value: "factory",
                label: "Factory"
            },

            {
                value: "commercial-property",
                label: "Commercial Property"
            },

            {
                value: "hotel-property",
                label: "Hotel Property"
            },

            {
                value: "rental-property",
                label: "Rental Property"
            },

            {
                value: "other-property",
                label: "Other Property"
            }

        ],


        vehicle: [

            {
                value: "car",
                label: "Car"
            },

            {
                value: "suv",
                label: "SUV"
            },

            {
                value: "motorcycle-bike",
                label: "Motorcycle / Bike"
            },

            {
                value: "scooter",
                label: "Scooter"
            },

            {
                value: "electric-vehicle",
                label: "Electric Vehicle"
            },

            {
                value: "truck",
                label: "Truck"
            },

            {
                value: "trailer",
                label: "Trailer"
            },

            {
                value: "tractor",
                label: "Tractor"
            },

            {
                value: "jcb-excavator",
                label: "JCB / Excavator"
            },

            {
                value: "bus",
                label: "Bus"
            },

            {
                value: "van",
                label: "Van"
            },

            {
                value: "ambulance",
                label: "Ambulance"
            },

            {
                value: "taxi",
                label: "Taxi"
            },

            {
                value: "commercial-vehicle",
                label: "Commercial Vehicle"
            },

            {
                value: "three-wheeler",
                label: "Three-Wheeler"
            },

            {
                value: "farm-vehicle",
                label: "Farm Vehicle"
            },

            {
                value: "construction-vehicle",
                label: "Construction Vehicle"
            },

            {
                value: "boat",
                label: "Boat"
            },

            {
                value: "other-vehicle",
                label: "Other Vehicle"
            }

        ]

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


    function escapeHTML(value) {

        return String(value == null ? "" : value)

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    function normalizeEmail(value) {

        return String(value || "")
            .trim()
            .toLowerCase();

    }


    function createId(prefix) {

        return (

            prefix +

            "_" +

            Date.now().toString(36) +

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
                "Marketplace storage error:",
                error
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

            console.error(
                "Marketplace read error:",
                error
            );

            return fallback;

        }

    }


    function showStatus(id, message) {

        const element = byId(id);

        if (!element) {

            return;

        }

        element.textContent = message;

        element.classList.add("show");

    }


    function hideStatus(id) {

        const element = byId(id);

        if (!element) {

            return;

        }

        element.textContent = "";

        element.classList.remove("show");

    }


    /* =====================================================
       STORAGE
       ===================================================== */

    function loadStorage() {

        const listings =
            loadJSON(
                CONFIG.listingStorage,
                []
            );

        const showrooms =
            loadJSON(
                CONFIG.showroomStorage,
                []
            );

        const account =
            loadJSON(
                CONFIG.accountStorage,
                null
            );

        const session =
            loadJSON(
                CONFIG.sessionStorage,
                null
            );


        state.listings =
            Array.isArray(listings)
                ? listings
                : [];


        state.showrooms =
            Array.isArray(showrooms)
                ? showrooms
                : [];


        state.account =
            account &&
            typeof account === "object"
                ? account
                : null;


        state.loggedIn =
            Boolean(
                session &&
                session.loggedIn === true &&
                state.account
            );

    }


    /* =====================================================
       COUNTRY DATABASE
       ===================================================== */

    function getCountryDatabase() {

        if (
            Array.isArray(
                window.MARKETPLACE_COUNTRIES
            )
        ) {

            return window.MARKETPLACE_COUNTRIES;

        }


        if (
            Array.isArray(
                window.ALON_MARKETPLACE_COUNTRIES
            )
        ) {

            return window.ALON_MARKETPLACE_COUNTRIES;

        }


        if (
            Array.isArray(
                window.ALON_WORLD_COUNTRIES
            )
        ) {

            return window.ALON_WORLD_COUNTRIES;

        }


        if (
            Array.isArray(
                window.WORLD_COUNTRIES
            )
        ) {

            return window.WORLD_COUNTRIES;

        }


        return [];

    }


    function normalizeCountry(item) {

        if (!item) {

            return null;

        }


        const name =
            String(
                item.name ||
                item.country ||
                item.countryName ||
                item.label ||
                ""
            ).trim();


        const code2 =
            String(
                item.code2 ||
                item.iso2 ||
                item.iso ||
                item.code ||
                item.countryCode ||
                ""
            ).trim().toUpperCase();


        const code3 =
            String(
                item.code3 ||
                item.iso3 ||
                ""
            ).trim().toUpperCase();


        const slug =
            String(
                item.slug ||
                ""
            ).trim().toLowerCase();


        const flag =
            String(
                item.flag ||
                item.emoji ||
                item.symbol ||
                ""
            ).trim();


        const capital =
            String(
                item.capital ||
                ""
            ).trim();


        const region =
            String(
                item.region ||
                ""
            ).trim();


        const aliases =
            Array.isArray(item.aliases)
                ? item.aliases.map(function (alias) {

                    return String(alias)
                        .trim();

                })
                : [];


        if (!name) {

            return null;

        }


        return {

            name: name,

            country: name,

            slug: slug,

            flag: flag,

            code2: code2,

            code3: code3,

            iso: code2,

            iso2: code2,

            iso3: code3,

            capital: capital,

            region: region,

            aliases: aliases

        };

    }


    function loadCountries() {

        const source =
            getCountryDatabase();


        const normalized = [];


        source.forEach(function (item) {

            const country =
                normalizeCountry(item);


            if (country) {

                normalized.push(country);

            }

        });


        const unique = [];

        const seen = new Set();


        normalized.forEach(function (country) {

            const key =
                country.code2 ||
                country.code3 ||
                country.slug ||
                country.name.toLowerCase();


            if (!seen.has(key)) {

                seen.add(key);

                unique.push(country);

            }

        });


        unique.sort(function (a, b) {

            return a.name.localeCompare(
                b.name
            );

        });


        state.countries =
            unique;

    }


    function countryLabel(country) {

        if (!country) {

            return "";

        }


        const parts = [];


        if (country.flag) {

            parts.push(
                country.flag
            );

        }


        parts.push(
            country.name
        );


        const codes = [];


        if (country.code2) {

            codes.push(
                country.code2
            );

        }


        if (
            country.code3 &&
            country.code3 !== country.code2
        ) {

            codes.push(
                country.code3
            );

        }


        if (codes.length) {

            parts.push(
                "(" +
                codes.join(" • ") +
                ")"
            );

        }


        return parts.join(" ");

    }


    function populateCountries() {

        const selects = [

            byId("rmCountry"),

            byId("rmShowroomCountry")

        ];


        selects.forEach(function (select) {

            if (!select) {

                return;

            }


            const current =
                select.value;


            select.innerHTML =
                "";


            const placeholder =
                document.createElement(
                    "option"
                );


            placeholder.value =
                "";

            placeholder.textContent =
                "Select Country";


            select.appendChild(
                placeholder
            );


            state.countries.forEach(
                function (country) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        country.code2 ||
                        country.code3 ||
                        country.slug ||
                        country.name;


                    option.textContent =
                        countryLabel(
                            country
                        );


                    option.dataset.code2 =
                        country.code2 || "";


                    option.dataset.code3 =
                        country.code3 || "";


                    option.dataset.slug =
                        country.slug || "";


                    option.dataset.name =
                        country.name || "";


                    select.appendChild(
                        option
                    );

                }
            );


            if (current) {

                const found =
                    findCountry(
                        current
                    );


                if (found) {

                    select.value =
                        found.code2 ||
                        found.code3 ||
                        found.slug ||
                        found.name;

                }

            }

        });

    }


    function findCountry(value) {

        const query =
            String(value || "")
                .trim()
                .toLowerCase();


        if (!query) {

            return null;

        }


        return (
            state.countries.find(
                function (country) {

                    if (
                        country.code2 &&
                        country.code2.toLowerCase()
                            === query
                    ) {

                        return true;

                    }


                    if (
                        country.code3 &&
                        country.code3.toLowerCase()
                            === query
                    ) {

                        return true;

                    }


                    if (
                        country.slug &&
                        country.slug.toLowerCase()
                            === query
                    ) {

                        return true;

                    }


                    if (
                        country.name &&
                        country.name.toLowerCase()
                            === query
                    ) {

                        return true;

                    }


                    return country.aliases.some(
                        function (alias) {

                            return (
                                alias.toLowerCase()
                                    === query
                            );

                        }
                    );

                }
            ) || null
        );

    }


    function getCountryName(value) {

        const country =
            findCountry(value);


        return country
            ? countryLabel(country)
            : String(value || "");

    }


    /* =====================================================
       CATEGORY SYSTEM
       ===================================================== */

    function updateCategoryOptions() {

        const typeSelect =
            byId("rmListingType");


        const categorySelect =
            byId("rmListingCategory");


        if (
            !typeSelect ||
            !categorySelect
        ) {

            console.warn(
                "Regular Marketplace category elements not found."
            );

            return;

        }


        const type =
            String(
                typeSelect.value || "item"
            ).toLowerCase();


        const categories =
            Array.isArray(
                CATEGORIES[type]
            )
                ? CATEGORIES[type]
                : [];


        const previous =
            categorySelect.value;


        categorySelect.innerHTML =
            "";


        const placeholder =
            document.createElement(
                "option"
            );


        placeholder.value =
            "";

        placeholder.textContent =
            "Select Category";


        categorySelect.appendChild(
            placeholder
        );


        categories.forEach(
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


        if (
            previous &&
            categories.some(
                function (category) {

                    return (
                        category.value ===
                        previous
                    );

                }
            )
        ) {

            categorySelect.value =
                previous;

        }

    }


    /* =====================================================
       LOGIN
       ===================================================== */

    function updateLoginUI() {

        const loginBox =
            byId("rmLoginBox");


        const profileBox =
            byId("rmProfileBox");


        const profileEmail =
            byId("rmProfileEmail");


        if (!loginBox || !profileBox) {

            return;

        }


        if (state.loggedIn) {

            loginBox.style.display =
                "none";


            profileBox.style.display =
                "block";


            if (profileEmail) {

                profileEmail.textContent =
                    state.account &&
                    state.account.email
                        ? state.account.email
                        : "";

            }

        } else {

            loginBox.style.display =
                "block";


            profileBox.style.display =
                "none";

        }

    }


    function login() {

        hideStatus(
            "rmLoginStatus"
        );


        const name =
            String(
                byId("rmLoginName")?.value ||
                ""
            ).trim();


        const mobile =
            String(
                byId("rmLoginMobile")?.value ||
                ""
            ).trim();


        const email =
            normalizeEmail(
                byId("rmLoginEmail")?.value
            );


        const password =
            String(
                byId("rmLoginPassword")?.value ||
                ""
            );


        const agreement =
            Boolean(
                byId("rmAgreement")?.checked
            );


        if (!name) {

            showStatus(
                "rmLoginStatus",
                "Please enter your name."
            );

            return;

        }


        if (!mobile) {

            showStatus(
                "rmLoginStatus",
                "Please enter your mobile number."
            );

            return;

        }


        if (!email) {

            showStatus(
                "rmLoginStatus",
                "Please enter your email address."
            );

            return;

        }


        if (!password) {

            showStatus(
                "rmLoginStatus",
                "Please enter your password."
            );

            return;

        }


        if (!agreement) {

            showStatus(
                "rmLoginStatus",
                "Please accept the Marketplace Agreement before login."
            );

            return;

        }


        state.account = {

            name: name,

            mobile: mobile,

            email: email,

            password: password,

            updatedAt:
                new Date().toISOString()

        };


        state.loggedIn =
            true;


        saveJSON(
            CONFIG.accountStorage,
            state.account
        );


        saveJSON(
            CONFIG.sessionStorage,
            {
                loggedIn: true,

                email: email,

                loginAt:
                    new Date().toISOString()
            }
        );


        updateLoginUI();


        renderListings();

        renderShowrooms();


        showStatus(
            "rmLoginStatus",
            "Login successful."
        );

    }


    function logout() {

        state.loggedIn =
            false;


        state.account =
            null;


        state.editingListingId =
            null;


        state.editingShowroomId =
            null;


        state.verifiedPayment =
            null;


        localStorage.removeItem(
            CONFIG.sessionStorage
        );


        updateLoginUI();

        renderListings();

        renderShowrooms();


        showStatus(
            "rmLoginStatus",
            "You have been logged out."
        );

    }


    /* =====================================================
       MEDIA
       ===================================================== */

    function readFileAsDataURL(file, limit) {

        return new Promise(
            function (resolve, reject) {

                if (!file) {

                    resolve(null);

                    return;

                }


                if (file.size > limit) {

                    reject(
                        new Error(
                            "File is too large."
                        )
                    );

                    return;

                }


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


    /* =====================================================
       LISTING FORM DATA
       ===================================================== */

    function getListingFormData() {

        return {

            type:
                byId("rmListingType")?.value
                || "",

            category:
                byId("rmListingCategory")?.value
                || "",

            condition:
                byId("rmListingCondition")?.value
                || "",

            title:
                String(
                    byId("rmListingTitle")?.value
                    || ""
                ).trim(),

            price:
                String(
                    byId("rmListingPrice")?.value
                    || ""
                ).trim(),

            country:
                byId("rmCountry")?.value
                || "",

            state:
                String(
                    byId("rmState")?.value
                    || ""
                ).trim(),

            district:
                String(
                    byId("rmDistrict")?.value
                    || ""
                ).trim(),

            taluka:
                String(
                    byId("rmTaluka")?.value
                    || ""
                ).trim(),

            pin:
                String(
                    byId("rmPin")?.value
                    || ""
                ).trim(),

            phone:
                String(
                    byId("rmPhone")?.value
                    || ""
                ).trim(),

            email:
                normalizeEmail(
                    byId("rmEmail")?.value
                ),

            description:
                String(
                    byId("rmDescription")?.value
                    || ""
                ).trim()

        };

    }


    function validateListing(data) {

        if (!state.loggedIn) {

            return "Please login first.";

        }


        if (!data.type) {

            return "Please select listing type.";

        }


        if (!data.category) {

            return "Please select a category.";

        }


        if (!data.title) {

            return "Please enter a title.";

        }


        if (!data.price) {

            return "Please enter the price.";

        }


        if (!data.country) {

            return "Please select a country.";

        }


        if (!data.description) {

            return "Please enter a description.";

        }


        return "";

    }


    /* =====================================================
       SAVE LISTING
       ===================================================== */

    async function saveListing(event) {

        event.preventDefault();


        hideStatus(
            "rmListingStatus"
        );


        const data =
            getListingFormData();


        const error =
            validateListing(data);


        if (error) {

            showStatus(
                "rmListingStatus",
                error
            );

            return;

        }


        const imageInput =
            byId("rmListingImage");


        const videoInput =
            byId("rmListingVideo");


        const editingId =
            state.editingListingId;


        const existing =
            editingId
                ? state.listings.find(
                    function (listing) {

                        return (
                            listing.id ===
                            editingId
                        );

                    }
                )
                : null;


        if (
            existing &&
            normalizeEmail(existing.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            showStatus(
                "rmListingStatus",
                "You can only edit your own listing."
            );

            return;

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
                    await readFileAsDataURL(
                        imageInput.files[0],
                        CONFIG.imageLimit
                    );

            } else if (existing) {

                image =
                    existing.image || null;

            }


            if (
                videoInput &&
                videoInput.files &&
                videoInput.files[0]
            ) {

                video =
                    await readFileAsDataURL(
                        videoInput.files[0],
                        CONFIG.videoLimit
                    );

            } else if (existing) {

                video =
                    existing.video || null;

            }


            const listing = {

                id:
                    editingId ||
                    createId("listing"),

                ...data,

                countryLabel:
                    getCountryName(
                        data.country
                    ),

                ownerEmail:
                    normalizeEmail(
                        state.account.email
                    ),

                ownerName:
                    state.account.name,

                image: image,

                video: video,

                createdAt:
                    existing?.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            if (editingId) {

                state.listings =
                    state.listings.map(
                        function (item) {

                            return (
                                item.id ===
                                editingId
                            )
                                ? listing
                                : item;

                        }
                    );

            } else {

                state.listings.unshift(
                    listing
                );

            }


            saveJSON(
                CONFIG.listingStorage,
                state.listings
            );


            state.editingListingId =
                null;


            clearListingForm();


            renderListings();


            showStatus(
                "rmListingStatus",
                editingId
                    ? "Listing updated successfully."
                    : "Listing saved successfully."
            );

        } catch (error) {

            console.error(error);


            showStatus(
                "rmListingStatus",
                error.message ||
                "Unable to save listing."
            );

        }

    }


    /* =====================================================
       CLEAR LISTING
       ===================================================== */

    function clearListingForm() {

        const form =
            byId("rmListingForm");


        if (form) {

            form.reset();

        }


        state.editingListingId =
            null;


        updateCategoryOptions();


        const idField =
            byId("rmListingId");


        if (idField) {

            idField.value = "";

        }

    }


    /* =====================================================
       EDIT LISTING
       ===================================================== */

    function editListing(id) {

        const listing =
            state.listings.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!listing) {

            return;

        }


        if (
            !state.loggedIn ||
            normalizeEmail(listing.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            alert(
                "You can only edit your own listing."
            );

            return;

        }


        state.editingListingId =
            id;


        const typeSelect =
            byId("rmListingType");


        if (typeSelect) {

            typeSelect.value =
                listing.type || "item";

        }


        updateCategoryOptions();


        const fields = {

            rmListingCategory:
                listing.category,

            rmListingCondition:
                listing.condition,

            rmListingTitle:
                listing.title,

            rmListingPrice:
                listing.price,

            rmCountry:
                listing.country,

            rmState:
                listing.state,

            rmDistrict:
                listing.district,

            rmTaluka:
                listing.taluka,

            rmPin:
                listing.pin,

            rmPhone:
                listing.phone,

            rmEmail:
                listing.email,

            rmDescription:
                listing.description,

            rmListingId:
                listing.id

        };


        Object.keys(fields).forEach(
            function (id) {

                const element =
                    byId(id);


                if (element) {

                    element.value =
                        fields[id] ?? "";

                }

            }
        );


        window.scrollTo({

            top:
                byId("sellItem")?.offsetTop
                || 0,

            behavior: "smooth"

        });

    }


    /* =====================================================
       DELETE LISTING
       ===================================================== */

    function deleteListing(id) {

        const listing =
            state.listings.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!listing) {

            return;

        }


        if (
            !state.loggedIn ||
            normalizeEmail(listing.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            alert(
                "You can only delete your own listing."
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
                function (item) {

                    return item.id !== id;

                }
            );


        saveJSON(
            CONFIG.listingStorage,
            state.listings
        );


        renderListings();

    }


    /* =====================================================
       RENDER LISTINGS
       ===================================================== */

    function renderListings() {

        const container =
            byId("rmListings");


        if (!container) {

            return;

        }


        if (!state.loggedIn) {

            container.innerHTML =
                "<div>Please login to view your listings.</div>";

            return;

        }


        const email =
            normalizeEmail(
                state.account.email
            );


        const mine =
            state.listings.filter(
                function (listing) {

                    return (
                        normalizeEmail(
                            listing.ownerEmail
                        ) === email
                    );

                }
            );


        if (!mine.length) {

            container.innerHTML =
                "<div>No listings created yet.</div>";

            return;

        }


        container.innerHTML =
            mine.map(
                function (listing) {

                    const media = [];


                    if (listing.image) {

                        media.push(
                            "<img src=\"" +
                            listing.image +
                            "\" alt=\"Listing image\">"
                        );

                    }


                    if (listing.video) {

                        media.push(
                            "<video controls src=\"" +
                            listing.video +
                            "\"></video>"
                        );

                    }


                    return (

                        "<article class=\"rm-card\">" +

                        "<h3>" +
                        escapeHTML(
                            listing.title
                        ) +
                        "</h3>" +

                        "<p><strong>Type:</strong> " +
                        escapeHTML(
                            listing.type
                        ) +
                        "</p>" +

                        "<p><strong>Category:</strong> " +
                        escapeHTML(
                            listing.category
                        ) +
                        "</p>" +

                        "<p><strong>Condition:</strong> " +
                        escapeHTML(
                            listing.condition
                        ) +
                        "</p>" +

                        "<p><strong>Price:</strong> " +
                        escapeHTML(
                            listing.price
                        ) +
                        "</p>" +

                        "<p><strong>Country:</strong> " +
                        escapeHTML(
                            listing.countryLabel ||
                            getCountryName(
                                listing.country
                            )
                        ) +
                        "</p>" +

                        "<p><strong>Location:</strong> " +
                        escapeHTML(
                            [
                                listing.state,
                                listing.district,
                                listing.taluka,
                                listing.pin
                            ]
                            .filter(Boolean)
                            .join(", ")
                        ) +
                        "</p>" +

                        "<p>" +
                        escapeHTML(
                            listing.description
                        ) +
                        "</p>" +

                        (
                            media.length
                                ? (
                                    "<div class=\"rm-media-preview\">" +
                                    media.join("") +
                                    "</div>"
                                )
                                : ""
                        ) +

                        "<div class=\"rm-actions\">" +

                        "<button type=\"button\" data-rm-edit-listing=\"" +
                        escapeHTML(listing.id) +
                        "\">✏️ Edit</button>" +

                        "<button type=\"button\" data-rm-delete-listing=\"" +
                        escapeHTML(listing.id) +
                        "\">🗑️ Delete</button>" +

                        "</div>" +

                        "</article>"

                    );

                }
            )
            .join("");

    }


    /* =====================================================
       SHOWROOM REACH
       ===================================================== */

    function getSelectedShowroomReach() {

        const reach = [];


        const global =
            byId(
                "rmShowroomReachGlobal"
            );


        const international =
            byId(
                "rmShowroomReachInternational"
            );


        if (
            global &&
            global.checked
        ) {

            reach.push(
                SHOWROOM_REACH.GLOBAL
            );

        }


        if (
            international &&
            international.checked
        ) {

            reach.push(
                SHOWROOM_REACH.INTERNATIONAL
            );

        }


        return reach;

    }


    function normalizeShowroomReach(value) {

        if (Array.isArray(value)) {

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
            value === "WORLDWIDE" ||
            value === "GLOBAL"
        ) {

            return [
                SHOWROOM_REACH.GLOBAL
            ];

        }


        if (
            value === "INTERNATIONAL"
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


        return reach.map(
            function (item) {

                return (
                    SHOWROOM_REACH_LABELS[
                        item
                    ] || item
                );

            }
        ).join(" + ");

    }


    function validateShowroomReach() {

        const reach =
            getSelectedShowroomReach();


        if (!reach.length) {

            return "Please select Global / Worldwide or International.";

        }


        return "";

    }


    /* =====================================================
       SHOWROOM FORM
       ===================================================== */

    function getShowroomFormData() {

        return {

            name:
                String(
                    byId("rmShowroomName")?.value
                    || ""
                ).trim(),

            type:
                String(
                    byId("rmShowroomType")?.value
                    || ""
                ).trim(),

            reach:
                getSelectedShowroomReach(),

            country:
                byId("rmShowroomCountry")?.value
                || "",

            state:
                String(
                    byId("rmShowroomState")?.value
                    || ""
                ).trim(),

            district:
                String(
                    byId("rmShowroomDistrict")?.value
                    || ""
                ).trim(),

            taluka:
                String(
                    byId("rmShowroomTaluka")?.value
                    || ""
                ).trim(),

            pin:
                String(
                    byId("rmShowroomPin")?.value
                    || ""
                ).trim(),

            phone:
                String(
                    byId("rmShowroomPhone")?.value
                    || ""
                ).trim(),

            email:
                normalizeEmail(
                    byId("rmShowroomEmail")?.value
                ),

            description:
                String(
                    byId("rmShowroomDescription")?.value
                    || ""
                ).trim()

        };

    }


    function validateShowroom(data) {

        if (!state.loggedIn) {

            return "Please login first.";

        }


        if (!data.name) {

            return "Please enter business / showroom name.";

        }


        if (!data.type) {

            return "Please enter business type.";

        }


        if (!data.reach.length) {

            return "Please select advertisement reach.";

        }


        if (!data.country) {

            return "Please select country.";

        }


        if (!data.phone) {

            return "Please enter phone / WhatsApp number.";

        }


        if (!data.email) {

            return "Please enter business email.";

        }


        if (!data.description) {

            return "Please enter business description.";

        }


        return "";

    }


    /* =====================================================
       PAYMENT
       ===================================================== */

    function startShowroomPayment() {

        const message =
            "Business / Showroom Advertisement\n\n" +

            "Price: $10 USD\n" +

            "Google Pay: 7487879528\n\n" +

            "Payment verification must be completed " +
            "before publishing.\n\n" +

            "Static GitHub Pages cannot automatically " +
            "verify a real payment.";


        alert(message);

    }


    function acceptVerifiedPayment(paymentData) {

        if (
            !paymentData ||
            paymentData.status !==
                "verified"
        ) {

            return false;

        }


        const amount =
            Number(
                paymentData.amount
            );


        if (
            amount !==
            CONFIG.showroomPrice
        ) {

            return false;

        }


        if (
            String(
                paymentData.currency ||
                ""
            ).toUpperCase()
            !== CONFIG.currency
        ) {

            return false;

        }


        const paymentId =
            paymentData.paymentId ||
            paymentData.transactionId ||
            paymentData.id;


        if (!paymentId) {

            return false;

        }


        state.verifiedPayment = {

            status: "verified",

            amount: amount,

            currency: "USD",

            paymentId:
                String(paymentId),

            verifiedAt:
                new Date().toISOString()

        };


        const button =
            byId(
                "rmPublishShowroomButton"
            );


        if (button) {

            button.disabled =
                false;

        }


        const status =
            byId(
                "rmPaymentStatus"
            );


        if (status) {

            status.textContent =
                "✅ Payment verified. Advertisement can be published.";

        }


        return true;

    }


    /* =====================================================
       SAVE SHOWROOM
       ===================================================== */

    async function saveShowroom(event) {

        event.preventDefault();


        hideStatus(
            "rmShowroomStatus"
        );


        const data =
            getShowroomFormData();


        const error =
            validateShowroom(data);


        if (error) {

            showStatus(
                "rmShowroomStatus",
                error
            );

            return;

        }


        if (!state.verifiedPayment) {

            showStatus(
                "rmShowroomStatus",
                "Please complete payment verification before publishing."
            );

            return;

        }


        const editingId =
            state.editingShowroomId;


        const existing =
            editingId
                ? state.showrooms.find(
                    function (item) {

                        return (
                            item.id ===
                            editingId
                        );

                    }
                )
                : null;


        if (
            existing &&
            normalizeEmail(existing.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            showStatus(
                "rmShowroomStatus",
                "You can only edit your own showroom."
            );

            return;

        }


        const imageInput =
            byId("rmShowroomImage");


        const videoInput =
            byId("rmShowroomVideo");


        try {

            let image = null;

            let video = null;


            if (
                imageInput &&
                imageInput.files &&
                imageInput.files[0]
            ) {

                image =
                    await readFileAsDataURL(
                        imageInput.files[0],
                        CONFIG.imageLimit
                    );

            } else if (existing) {

                image =
                    existing.image || null;

            }


            if (
                videoInput &&
                videoInput.files &&
                videoInput.files[0]
            ) {

                video =
                    await readFileAsDataURL(
                        videoInput.files[0],
                        CONFIG.videoLimit
                    );

            } else if (existing) {

                video =
                    existing.video || null;

            }


            const showroom = {

                id:
                    editingId ||
                    createId("showroom"),

                ...data,

                countryLabel:
                    getCountryName(
                        data.country
                    ),

                reachLabel:
                    showroomReachLabel(
                        data.reach
                    ),

                ownerEmail:
                    normalizeEmail(
                        state.account.email
                    ),

                ownerName:
                    state.account.name,

                image: image,

                video: video,

                payment:
                    state.verifiedPayment,

                createdAt:
                    existing?.createdAt ||
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            };


            if (editingId) {

                state.showrooms =
                    state.showrooms.map(
                        function (item) {

                            return (
                                item.id ===
                                editingId
                            )
                                ? showroom
                                : item;

                        }
                    );

            } else {

                state.showrooms.unshift(
                    showroom
                );

            }


            saveJSON(
                CONFIG.showroomStorage,
                state.showrooms
            );


            state.editingShowroomId =
                null;


            state.verifiedPayment =
                null;


            clearShowroomForm();


            renderShowrooms();


            showStatus(
                "rmShowroomStatus",
                editingId
                    ? "Showroom advertisement updated successfully."
                    : "Showroom advertisement published successfully."
            );

        } catch (error) {

            console.error(error);


            showStatus(
                "rmShowroomStatus",
                error.message ||
                "Unable to save showroom advertisement."
            );

        }

    }


    /* =====================================================
       CLEAR SHOWROOM
       ===================================================== */

    function clearShowroomForm() {

        const form =
            byId("rmShowroomForm");


        if (form) {

            form.reset();

        }


        state.editingShowroomId =
            null;


        state.verifiedPayment =
            null;


        const button =
            byId(
                "rmPublishShowroomButton"
            );


        if (button) {

            button.disabled =
                true;

        }


        const status =
            byId(
                "rmPaymentStatus"
            );


        if (status) {

            status.textContent =
                "Payment not verified.";

        }


        const idField =
            byId("rmShowroomId");


        if (idField) {

            idField.value = "";

        }

    }


    /* =====================================================
       EDIT SHOWROOM
       ===================================================== */

    function editShowroom(id) {

        const showroom =
            state.showrooms.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!showroom) {

            return;

        }


        if (
            !state.loggedIn ||
            normalizeEmail(showroom.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            alert(
                "You can only edit your own showroom."
            );

            return;

        }


        state.editingShowroomId =
            id;


        const fields = {

            rmShowroomName:
                showroom.name,

            rmShowroomType:
                showroom.type,

            rmShowroomCountry:
                showroom.country,

            rmShowroomState:
                showroom.state,

            rmShowroomDistrict:
                showroom.district,

            rmShowroomTaluka:
                showroom.taluka,

            rmShowroomPin:
                showroom.pin,

            rmShowroomPhone:
                showroom.phone,

            rmShowroomEmail:
                showroom.email,

            rmShowroomDescription:
                showroom.description,

            rmShowroomId:
                showroom.id

        };


        Object.keys(fields).forEach(
            function (id) {

                const element =
                    byId(id);


                if (element) {

                    element.value =
                        fields[id] ?? "";

                }

            }
        );


        const reach =
            normalizeShowroomReach(
                showroom.reach
            );


        const global =
            byId(
                "rmShowroomReachGlobal"
            );


        const international =
            byId(
                "rmShowroomReachInternational"
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


        /*
         * Editing requires fresh payment verification.
         */

        state.verifiedPayment =
            null;


        const publishButton =
            byId(
                "rmPublishShowroomButton"
            );


        if (publishButton) {

            publishButton.disabled =
                true;

        }


        const paymentStatus =
            byId(
                "rmPaymentStatus"
            );


        if (paymentStatus) {

            paymentStatus.textContent =
                "Fresh payment verification is required for editing.";

        }


        window.scrollTo({

            top:
                byId("showroom")?.offsetTop
                || 0,

            behavior: "smooth"

        });

    }


    /* =====================================================
       DELETE SHOWROOM
       ===================================================== */

    function deleteShowroom(id) {

        const showroom =
            state.showrooms.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!showroom) {

            return;

        }


        if (
            !state.loggedIn ||
            normalizeEmail(showroom.ownerEmail)
                !== normalizeEmail(state.account.email)
        ) {

            alert(
                "You can only delete your own showroom."
            );

            return;

        }


        if (
            !window.confirm(
                "Delete this showroom advertisement?"
            )
        ) {

            return;

        }


        state.showrooms =
            state.showrooms.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        saveJSON(
            CONFIG.showroomStorage,
            state.showrooms
        );


        renderShowrooms();

    }


    /* =====================================================
       RENDER SHOWROOMS
       ===================================================== */

    function renderShowrooms() {

        const container =
            byId("rmShowrooms");


        if (!container) {

            return;

        }


        if (!state.loggedIn) {

            container.innerHTML =
                "<div>Please login to view your showroom advertisements.</div>";

            return;

        }


        const email =
            normalizeEmail(
                state.account.email
            );


        const mine =
            state.showrooms.filter(
                function (showroom) {

                    return (
                        normalizeEmail(
                            showroom.ownerEmail
                        ) === email
                    );

                }
            );


        if (!mine.length) {

            container.innerHTML =
                "<div>No showroom advertisements created yet.</div>";

            return;

        }


        container.innerHTML =
            mine.map(
                function (showroom) {

                    const media = [];


                    if (showroom.image) {

                        media.push(
                            "<img src=\"" +
                            showroom.image +
                            "\" alt=\"Business image\">"
                        );

                    }


                    if (showroom.video) {

                        media.push(
                            "<video controls src=\"" +
                            showroom.video +
                            "\"></video>"
                        );

                    }


                    return (

                        "<article class=\"rm-card\">" +

                        "<h3>" +
                        escapeHTML(
                            showroom.name
                        ) +
                        "</h3>" +

                        "<p><strong>Business Type:</strong> " +
                        escapeHTML(
                            showroom.type
                        ) +
                        "</p>" +

                        "<p><strong>Advertisement Reach:</strong> " +
                        escapeHTML(
                            showroom.reachLabel ||
                            showroomReachLabel(
                                showroom.reach
                            )
                        ) +
                        "</p>" +

                        "<p><strong>Country:</strong> " +
                        escapeHTML(
                            showroom.countryLabel ||
                            getCountryName(
                                showroom.country
                            )
                        ) +
                        "</p>" +

                        "<p><strong>Location:</strong> " +
                        escapeHTML(
                            [
                                showroom.state,
                                showroom.district,
                                showroom.taluka,
                                showroom.pin
                            ]
                            .filter(Boolean)
                            .join(", ")
                        ) +
                        "</p>" +

                        "<p><strong>Phone:</strong> " +
                        escapeHTML(
                            showroom.phone
                        ) +
                        "</p>" +

                        "<p><strong>Email:</strong> " +
                        escapeHTML(
                            showroom.email
                        ) +
                        "</p>" +

                        "<p>" +
                        escapeHTML(
                            showroom.description
                        ) +
                        "</p>" +

                        "<p><strong>Payment:</strong> " +
                        (
                            showroom.payment &&
                            showroom.payment.status ===
                                "verified"
                                ? "✅ Verified"
                                : "Not verified"
                        ) +
                        "</p>" +

                        (
                            media.length
                                ? (
                                    "<div class=\"rm-media-preview\">" +
                                    media.join("") +
                                    "</div>"
                                )
                                : ""
                        ) +

                        "<div class=\"rm-actions\">" +

                        "<button type=\"button\" data-rm-edit-showroom=\"" +
                        escapeHTML(showroom.id) +
                        "\">✏️ Edit</button>" +

                        "<button type=\"button\" data-rm-delete-showroom=\"" +
                        escapeHTML(showroom.id) +
                        "\">🗑️ Delete</button>" +

                        "</div>" +

                        "</article>"

                    );

                }
            )
            .join("");

    }


    /* =====================================================
       EVENT BINDING
       ===================================================== */

    function bindEvents() {

        const loginButton =
            byId("rmLoginButton");


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                login
            );

        }


        const logoutButton =
            byId("rmLogoutButton");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );

        }


        const typeSelect =
            byId("rmListingType");


        if (typeSelect) {

            typeSelect.addEventListener(
                "change",
                updateCategoryOptions
            );

        }


        const listingForm =
            byId("rmListingForm");


        if (listingForm) {

            listingForm.addEventListener(
                "submit",
                saveListing
            );

        }


        const cancelEdit =
            byId(
                "rmCancelListingEditButton"
            );


        if (cancelEdit) {

            cancelEdit.addEventListener(
                "click",
                function () {

                    clearListingForm();

                    hideStatus(
                        "rmListingStatus"
                    );

                }
            );

        }


        const payButton =
            byId(
                "rmPayShowroomButton"
            );


        if (payButton) {

            payButton.addEventListener(
                "click",
                startShowroomPayment
            );

        }


        const showroomForm =
            byId("rmShowroomForm");


        if (showroomForm) {

            showroomForm.addEventListener(
                "submit",
                saveShowroom
            );

        }


        const resetShowroom =
            byId(
                "rmResetShowroomButton"
            );


        if (resetShowroom) {

            resetShowroom.addEventListener(
                "click",
                function () {

                    clearShowroomForm();

                    hideStatus(
                        "rmShowroomStatus"
                    );

                }
            );

        }


        const listingsContainer =
            byId("rmListings");


        if (listingsContainer) {

            listingsContainer.addEventListener(
                "click",
                function (event) {

                    const editButton =
                        event.target.closest(
                            "[data-rm-edit-listing]"
                        );


                    const deleteButton =
                        event.target.closest(
                            "[data-rm-delete-listing]"
                        );


                    if (editButton) {

                        editListing(
                            editButton.dataset
                                .rmEditListing
                        );

                        return;

                    }


                    if (deleteButton) {

                        deleteListing(
                            deleteButton.dataset
                                .rmDeleteListing
                        );

                    }

                }
            );

        }


        const showroomsContainer =
            byId("rmShowrooms");


        if (showroomsContainer) {

            showroomsContainer.addEventListener(
                "click",
                function (event) {

                    const editButton =
                        event.target.closest(
                            "[data-rm-edit-showroom]"
                        );


                    const deleteButton =
                        event.target.closest(
                            "[data-rm-delete-showroom]"
                        );


                    if (editButton) {

                        editShowroom(
                            editButton.dataset
                                .rmEditShowroom
                        );

                        return;

                    }


                    if (deleteButton) {

                        deleteShowroom(
                            deleteButton.dataset
                                .rmDeleteShowroom
                        );

                    }

                }
            );

        }

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
            CATEGORIES,

        showroomReach:
            SHOWROOM_REACH,

        showroomReachLabels:
            SHOWROOM_REACH_LABELS,

        login:
            login,

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
            function () {

                loadCountries();

                populateCountries();

            },

        refreshCategories:
            updateCategoryOptions,

        editListing:
            editListing,

        deleteListing:
            deleteListing,

        editShowroom:
            editShowroom,

        deleteShowroom:
            deleteShowroom,

        getSelectedShowroomReach:
            getSelectedShowroomReach

    };


    /* =====================================================
       INITIALIZATION
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


        console.log(
            "ALON HISTORYVERSE 24 Regular Marketplace " +
            CONFIG.version +
            " loaded."
        );


        console.log(
            "Marketplace countries loaded:",
            state.countries.length
        );

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