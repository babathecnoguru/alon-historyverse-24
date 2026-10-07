/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE
   ---------------------------------------------------------
   File: regular-marketplace.js
   Version: 25.0 MARKETPLACE BUSINESS + ENGAGEMENT
   Creator: Baba Thecno Guru

   FEATURES
   • Email + Password Login
   • Agreement Login
   • Existing Account Password Migration
   • Profile + Logout
   • Item / Property / Vehicle
   • New / Used / Refurbished
   • World Country Database
   • Flag + Country + ISO + Calling Code
   • Country / State / City
   • Price + Currency
   • Local / Country / Global / All Countries
   • Image + Video
   • My Ads
   • Edit / Delete Ads
   • Business / Showroom Advertisement
   • Large Business Photo
   • Direct Business / Apply / Contact Link
   • Like / Dislike
   • Views
   • Country-wise Views
   • Contextual Business Messaging
   • Showroom Edit / Delete
   • $10 Showroom Advertisement Structure
   • Future Featured / Top-up Ready
   • LocalStorage Persistence
   • Mobile Friendly
   • No Global Marketplace changes
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIG
       ===================================================== */

    const CONFIG = {

        version: "25.0",

        currency: "USD",

        showroomPrice: 10,

        maxImageSize:
            8 * 1024 * 1024,

        maxVideoSize:
            40 * 1024 * 1024,

        accountsKey:
            "alon_historyverse_regular_marketpkes_accounts",

        sessionKey:
            "alon_historyverse_regular_marketpkes_session",

        listingsKey:
            "alon_historyverse_regular_marketpkes_listings",

        showroomsKey:
            "alon_historyverse_regular_marketpkes_showrooms",

        messagesKey:
            "alon_historyverse_regular_marketpkes_messages",

        engagementKey:
            "alon_historyverse_regular_marketpkes_engagement",

        visitorCountryKey:
            "alon_historyverse_regular_marketpkes_visitor_country"
    };


    /* =====================================================
       CATEGORY DATABASE
       ===================================================== */

    const CATEGORY_DATA = {

        item: [
            "Mobile Phone",
            "Laptop",
            "Computer",
            "Tablet",
            "TV",
            "Camera",
            "Electronics",
            "Furniture",
            "Home Appliance",
            "Clothing",
            "Jewellery",
            "Books",
            "Tools",
            "Machinery",
            "Sports Equipment",
            "Office Equipment",
            "Other Item"
        ],

        property: [
            "House",
            "Shop",
            "Flat / Apartment",
            "Bungalow",
            "Plot",
            "Land",
            "Office",
            "Warehouse",
            "Farm",
            "Commercial Property",
            "Industrial Property",
            "Other Property"
        ],

        vehicle: [
            "Car",
            "SUV / 4x4",
            "Motorcycle / Bike",
            "Scooter",
            "EV",
            "Truck",
            "Trailer",
            "Tractor",
            "JCB / Excavator",
            "Bus",
            "Van",
            "Ambulance",
            "Taxi",
            "Commercial Vehicle",
            "Three-Wheeler",
            "Farm Vehicle",
            "Construction Vehicle",
            "Boat / Water Vehicle",
            "Other Vehicle"
        ]
    };


    /* =====================================================
       CONDITION DATABASE
       ===================================================== */

    const CONDITION_DATA = [
        "New",
        "Used",
        "Refurbished"
    ];


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function byId(id) {
        return document.getElementById(id);
    }


    function safeText(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value);
    }


    function escapeHTML(value) {

        return safeText(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function generateId(prefix) {

        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }


    function nowISO() {

        return new Date().toISOString();
    }


    function readJSON(
        key,
        fallback
    ) {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            const parsed =
                JSON.parse(value);

            return parsed === null
                ? fallback
                : parsed;

        } catch (error) {

            console.warn(
                "Regular Marketplace storage read error:",
                error
            );

            return fallback;
        }
    }


    function writeJSON(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.error(
                "Regular Marketplace storage write error:",
                error
            );

            return false;
        }
    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.warn(error);
        }
    }


    function normalizeEmail(value) {

        return safeText(value)
            .trim()
            .toLowerCase();
    }


    /* =====================================================
       PASSWORD HELPERS
       ===================================================== */

    async function hashPassword(
        password
    ) {

        const value =
            safeText(password);

        if (
            window.crypto &&
            window.crypto.subtle &&
            window.TextEncoder
        ) {

            try {

                const data =
                    new TextEncoder()
                        .encode(value);

                const hash =
                    await window.crypto.subtle.digest(
                        "SHA-256",
                        data
                    );

                return Array.from(
                    new Uint8Array(hash)
                )
                    .map(function (byte) {

                        return byte
                            .toString(16)
                            .padStart(2, "0");
                    })
                    .join("");

            } catch (error) {

                console.warn(
                    "Password hashing unavailable:",
                    error
                );
            }
        }


        /*
         * Compatibility fallback.
         * This is only used where Web Crypto
         * is unavailable.
         */

        let hash = 0;

        for (
            let i = 0;
            i < value.length;
            i++
        ) {

            hash =
                (
                    (
                        hash << 5
                    ) -
                    hash +
                    value.charCodeAt(i)
                ) |
                0;
        }

        return (
            "fallback_" +
            Math.abs(hash)
                .toString(36)
        );
    }


    function validPassword(
        password
    ) {

        const value =
            safeText(password);

        return (
            value.length >= 6 &&
            value.length <= 128
        );
    }


    /* =====================================================
       ACCOUNT SYSTEM
       ===================================================== */

    function getAccounts() {

        return readJSON(
            CONFIG.accountsKey,
            []
        );
    }


    function saveAccounts(
        accounts
    ) {

        return writeJSON(
            CONFIG.accountsKey,
            accounts
        );
    }


    function getSession() {

        return readJSON(
            CONFIG.sessionKey,
            null
        );
    }


    function saveSession(
        session
    ) {

        return writeJSON(
            CONFIG.sessionKey,
            session
        );
    }


    function clearSession() {

        removeStorage(
            CONFIG.sessionKey
        );
    }


    function getCurrentAccount() {

        const session =
            getSession();

        if (
            !session ||
            !session.email
        ) {
            return null;
        }


        const accounts =
            getAccounts();


        const email =
            normalizeEmail(
                session.email
            );


        return (
            accounts.find(
                function (account) {

                    return (
                        normalizeEmail(
                            account.email
                        ) === email
                    );
                }
            ) || null
        );
    }


    function isLoggedIn() {

        return !!getCurrentAccount();
    }


    /* =====================================================
       LOGIN STATUS
       ===================================================== */

    function setLoginStatus(
        message,
        type
    ) {

        const status =
            byId("rmLoginStatus");

        if (!status) {
            return;
        }

        status.textContent =
            safeText(message);

        status.className =
            "rm-status " +
            (type || "");
    }


    function setListingStatus(
        message,
        type
    ) {

        const status =
            byId("rmListingStatus");

        if (!status) {
            return;
        }

        status.textContent =
            safeText(message);

        status.className =
            "rm-status " +
            (type || "");
    }


    function setShowroomStatus(
        message,
        type
    ) {

        const status =
            byId("rmShowroomStatus");

        if (!status) {
            return;
        }

        status.textContent =
            safeText(message);

        status.className =
            "rm-status " +
            (type || "");
    }


    /* =====================================================
       LOGIN FORM COMPATIBILITY
       ===================================================== */

    function ensurePasswordLoginUI() {

        const loginForm =
            byId("rmLoginForm");

        if (!loginForm) {
            return;
        }


        /*
         * Hide the old Name login field.
         * Profile name remains untouched.
         */

        const oldName =
            byId("rmLoginName");

        if (oldName) {

            const wrapper =
                oldName.closest(".rm-field");

            if (wrapper) {
                wrapper.style.display = "none";
            } else {
                oldName.style.display = "none";
            }
        }


        let password =
            byId("rmLoginPassword");


        if (!password) {

            const email =
                byId("rmLoginEmail");


            password =
                document.createElement(
                    "input"
                );

            password.type =
                "password";

            password.id =
                "rmLoginPassword";

            password.name =
                "password";

            password.autocomplete =
                "current-password";

            password.placeholder =
                "Password";

            password.minLength = 6;

            password.required = true;

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "rm-field";

            const label =
                document.createElement(
                    "label"
                );

            label.htmlFor =
                "rmLoginPassword";

            label.textContent =
                "Password";

            wrapper.appendChild(
                label
            );

            wrapper.appendChild(
                password
            );


            if (email) {

                const emailWrapper =
                    email.closest(
                        ".rm-field"
                    );

                if (
                    emailWrapper &&
                    emailWrapper.parentNode
                ) {

                    emailWrapper.parentNode.insertBefore(
                        wrapper,
                        emailWrapper.nextSibling
                    );

                } else {

                    loginForm.insertBefore(
                        wrapper,
                        loginForm.firstChild
                    );
                }

            } else {

                loginForm.insertBefore(
                    wrapper,
                    loginForm.firstChild
                );
            }
        }


        password.autocomplete =
            "current-password";
    }


    /* =====================================================
       LOGIN UI
       ===================================================== */

    function updateLoginUI() {

        ensurePasswordLoginUI();


        const loginSection =
            byId("rmLoginSection");

        const profileSection =
            byId("rmProfileSection");

        const sellSection =
            byId("rmSellSection");

        const myAdsSection =
            byId("rmMyAdsSection");

        const showroomSection =
            byId("rmShowroomSection");

        const showroomsSection =
            byId("rmShowroomsSection");

        const profileName =
            byId("rmProfileName");

        const profileEmail =
            byId("rmProfileEmail");


        const account =
            getCurrentAccount();


        if (sellSection) {
            sellSection.style.display = "";
        }

        if (myAdsSection) {
            myAdsSection.style.display = "";
        }

        if (showroomSection) {
            showroomSection.style.display = "";
        }

        if (showroomsSection) {
            showroomsSection.style.display = "";
        }


        if (account) {

            if (loginSection) {
                loginSection.style.display = "none";
            }

            if (profileSection) {
                profileSection.style.display = "";
            }

            if (profileName) {

                profileName.textContent =
                    account.name ||
                    "User";
            }

            if (profileEmail) {

                profileEmail.textContent =
                    account.email ||
                    "";
            }

        } else {

            if (loginSection) {
                loginSection.style.display = "";
            }

            if (profileSection) {
                profileSection.style.display = "none";
            }

            if (profileName) {
                profileName.textContent = "";
            }

            if (profileEmail) {
                profileEmail.textContent = "";
            }
        }
    }


    /* =====================================================
       LOGIN
       ===================================================== */

    async function loginUser() {

        ensurePasswordLoginUI();


        const emailInput =
            byId("rmLoginEmail");

        const passwordInput =
            byId("rmLoginPassword");

        const agreement =
            byId("rmAgreement");


        const email =
            emailInput
                ? normalizeEmail(
                    emailInput.value
                )
                : "";


        const password =
            passwordInput
                ? safeText(
                    passwordInput.value
                )
                : "";


        if (!email) {

            setLoginStatus(
                "Please enter your email address.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            setLoginStatus(
                "Please enter a valid email address.",
                "error"
            );

            if (emailInput) {
                emailInput.focus();
            }

            return;
        }


        if (
            !validPassword(password)
        ) {

            setLoginStatus(
                "Password must contain at least 6 characters.",
                "error"
            );

            if (passwordInput) {
                passwordInput.focus();
            }

            return;
        }


        if (
            agreement &&
            !agreement.checked
        ) {

            setLoginStatus(
                "Please accept the agreement.",
                "error"
            );

            return;
        }


        let accounts =
            getAccounts();


        let account =
            accounts.find(
                function (item) {

                    return (
                        normalizeEmail(
                            item.email
                        ) === email
                    );
                }
            );


        const passwordHash =
            await hashPassword(
                password
            );


        /*
         * Existing passwordless accounts:
         * the first successful password login
         * establishes a password for that account.
         *
         * Existing account name is preserved.
         */

        if (account) {

            if (
                account.passwordHash
            ) {

                if (
                    account.passwordHash !==
                    passwordHash
                ) {

                    setLoginStatus(
                        "Incorrect email or password.",
                        "error"
                    );

                    return;
                }

            } else {

                account.passwordHash =
                    passwordHash;

                account.updatedAt =
                    nowISO();
            }

        } else {

            /*
             * New account.
             *
             * Name is intentionally not used
             * as the login credential.
             */

            account = {

                id:
                    generateId(
                        "account"
                    ),

                name:
                    "User",

                email:
                    email,

                passwordHash:
                    passwordHash,

                createdAt:
                    nowISO(),

                updatedAt:
                    nowISO()
            };


            accounts.push(
                account
            );
        }


        if (
            !saveAccounts(
                accounts
            )
        ) {

            setLoginStatus(
                "Could not save account on this device.",
                "error"
            );

            return;
        }


        saveSession({

            accountId:
                account.id,

            email:
                account.email,

            loggedInAt:
                nowISO()
        });


        setLoginStatus(
            "Login successful.",
            "success"
        );


        updateLoginUI();

        renderListings();

        renderShowrooms();

        renderBusinessMessages();

        resetListingForm();

        resetShowroomForm();
    }


    /* =====================================================
       LOGOUT
       ===================================================== */

    function logoutUser() {

        clearSession();

        updateLoginUI();

        renderListings();

        renderShowrooms();

        renderBusinessMessages();

        resetListingForm();

        resetShowroomForm();

        setLoginStatus(
            "You have been logged out.",
            "success"
        );
    }


    /* =====================================================
       COUNTRY DATABASE
       ===================================================== */

    function getCountryDatabase() {

        let countries =
            window.MARKETPLACE_COUNTRIES;


        if (
            !countries ||
            (
                Array.isArray(countries) &&
                countries.length === 0
            )
        ) {

            countries =
                window.ALON_WORLD_COUNTRIES;
        }


        if (
            !countries ||
            (
                Array.isArray(countries) &&
                countries.length === 0
            )
        ) {

            countries =
                window.WORLD_COUNTRIES;
        }


        if (
            Array.isArray(countries)
        ) {

            return countries;
        }


        if (
            countries &&
            typeof countries === "object"
        ) {

            return Object.keys(
                countries
            )
                .map(
                    function (key) {

                        const value =
                            countries[key];


                        if (
                            value &&
                            typeof value === "object"
                        ) {

                            return Object.assign(
                                {
                                    code: key
                                },
                                value
                            );
                        }


                        return {

                            code: key,

                            name: value
                        };
                    }
                );
        }


        return [];
    }


    function countryValue(
        country,
        keys
    ) {

        for (
            let i = 0;
            i < keys.length;
            i++
        ) {

            const key =
                keys[i];


            if (
                country &&
                country[key] !== undefined &&
                country[key] !== null &&
                country[key] !== ""
            ) {

                return country[key];
            }
        }


        return "";
    }


    function countryLabel(
        country
    ) {

        const flag =
            countryValue(
                country,
                [
                    "flag",
                    "emoji",
                    "icon"
                ]
            );


        const name =
            countryValue(
                country,
                [
                    "name",
                    "country",
                    "label"
                ]
            );


        const code =
            countryValue(
                country,
                [
                    "code",
                    "iso",
                    "isoCode",
                    "iso2"
                ]
            );


        const calling =
            countryValue(
                country,
                [
                    "callingCode",
                    "calling",
                    "dialCode",
                    "phoneCode"
                ]
            );


        let label = "";


        if (flag) {
            label +=
                flag + " ";
        }


        label +=
            name ||
            code ||
            "Unknown";


        if (code) {

            label +=
                " (" +
                code +
                ")";
        }


        if (calling) {

            label +=
                " +" +
                String(calling)
                    .replace(
                        /^\+/,
                        ""
                    );
        }


        return label;
    }


    function countryOptionValue(
        country
    ) {

        return safeText(
            countryValue(
                country,
                [
                    "code",
                    "iso",
                    "isoCode",
                    "iso2"
                ]
            )
        );
    }


    function populateCountrySelect(
        selectId
    ) {

        const select =
            byId(selectId);


        if (!select) {
            return;
        }


        const countries =
            getCountryDatabase();


        if (!countries.length) {

            console.warn(
                "ALON Regular Marketplace: country database not loaded."
            );

            return;
        }


        const oldValue =
            safeText(
                select.value
            );


        const fragment =
            document.createDocumentFragment();


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";


        firstOption.textContent =
            "Select Country";


        fragment.appendChild(
            firstOption
        );


        countries.forEach(
            function (country) {

                if (!country) {
                    return;
                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    countryOptionValue(
                        country
                    );


                option.textContent =
                    countryLabel(
                        country
                    );


                option.dataset.country =
                    safeText(
                        countryValue(
                            country,
                            [
                                "name",
                                "country",
                                "label"
                            ]
                        )
                    );


                option.dataset.iso =
                    safeText(
                        countryValue(
                            country,
                            [
                                "code",
                                "iso",
                                "isoCode",
                                "iso2"
                            ]
                        )
                    );


                option.dataset.callingCode =
                    safeText(
                        countryValue(
                            country,
                            [
                                "callingCode",
                                "calling",
                                "dialCode",
                                "phoneCode"
                            ]
                        )
                    );


                option.dataset.flag =
                    safeText(
                        countryValue(
                            country,
                            [
                                "flag",
                                "emoji",
                                "icon"
                            ]
                        )
                    );


                fragment.appendChild(
                    option
                );
            }
        );


        select.innerHTML = "";

        select.appendChild(
            fragment
        );


        if (oldValue) {

            select.value =
                oldValue;
        }
    }


    function populateAllCountries() {

        populateCountrySelect(
            "rmCountry"
        );

        populateCountrySelect(
            "rmShowroomCountry"
        );
    }


    /* =====================================================
       LOCATION UI
       ===================================================== */

    function hideOldLocationFields() {

        const oldListingPin =
            byId("rmPin");

        if (oldListingPin) {

            const wrapper =
                oldListingPin.closest(
                    ".rm-field"
                );

            if (wrapper) {
                wrapper.style.display =
                    "none";
            }
        }


        const oldShowroomPin =
            byId("rmShowroomPin");

        if (oldShowroomPin) {

            const wrapper =
                oldShowroomPin.closest(
                    ".rm-field"
                );

            if (wrapper) {
                wrapper.style.display =
                    "none";
            }
        }


        const oldTaluka =
            byId("rmShowroomTaluka");

        if (oldTaluka) {

            const wrapper =
                oldTaluka.closest(
                    ".rm-field"
                );

            if (wrapper) {
                wrapper.style.display =
                    "none";
            }
        }


        const listingCity =
            byId("rmCity");


        if (listingCity) {

            const wrapper =
                listingCity.closest(
                    ".rm-field"
                );

            if (wrapper) {

                const label =
                    wrapper.querySelector(
                        "label"
                    );

                if (label) {
                    label.textContent =
                        "City";
                }
            }
        }


        const showroomCity =
            byId("rmShowroomCity");


        if (showroomCity) {

            const wrapper =
                showroomCity.closest(
                    ".rm-field"
                );

            if (wrapper) {

                const label =
                    wrapper.querySelector(
                        "label"
                    );

                if (label) {
                    label.textContent =
                        "City";
                }
            }
        }


        const oldDistrict =
            byId("rmDistrict");


        if (
            oldDistrict &&
            !byId("rmCity")
        ) {

            const wrapper =
                oldDistrict.closest(
                    ".rm-field"
                );

            if (wrapper) {

                const label =
                    wrapper.querySelector(
                        "label"
                    );

                if (label) {

                    label.textContent =
                        "City";
                }
            }
        }


        const oldShowroomDistrict =
            byId("rmShowroomDistrict");


        if (
            oldShowroomDistrict &&
            !byId("rmShowroomCity")
        ) {

            const wrapper =
                oldShowroomDistrict.closest(
                    ".rm-field"
                );

            if (wrapper) {

                const label =
                    wrapper.querySelector(
                        "label"
                    );

                if (label) {

                    label.textContent =
                        "City";
                }
            }
        }
    }


    function getListingCity() {

        const city =
            byId("rmCity");


        if (city) {

            return safeText(
                city.value
            ).trim();
        }


        const oldDistrict =
            byId("rmDistrict");


        return oldDistrict
            ? safeText(
                oldDistrict.value
            ).trim()
            : "";
    }


    function setListingCity(
        value
    ) {

        const city =
            byId("rmCity");


        if (city) {

            city.value =
                safeText(value);

            return;
        }


        const oldDistrict =
            byId("rmDistrict");


        if (oldDistrict) {

            oldDistrict.value =
                safeText(value);
        }
    }


    function getShowroomCity() {

        const city =
            byId("rmShowroomCity");


        if (city) {

            return safeText(
                city.value
            ).trim();
        }


        const oldDistrict =
            byId("rmShowroomDistrict");


        return oldDistrict
            ? safeText(
                oldDistrict.value
            ).trim()
            : "";
    }


    function setShowroomCity(
        value
    ) {

        const city =
            byId("rmShowroomCity");


        if (city) {

            city.value =
                safeText(value);

            return;
        }


        const oldDistrict =
            byId("rmShowroomDistrict");


        if (oldDistrict) {

            oldDistrict.value =
                safeText(value);
        }
    }


    /* =====================================================
       CATEGORY SYSTEM
       ===================================================== */

    function getSelectedType() {

        const typeSelect =
            byId("rmListingType");


        if (
            typeSelect &&
            typeSelect.value
        ) {

            return typeSelect.value;
        }


        const checked =
            document.querySelector(
                'input[name="rmTypeChoice"]:checked'
            );


        return checked
            ? safeText(
                checked.value
            )
            : "item";
    }


    function populateListingCategories(
        selectedType,
        selectedCategory
    ) {

        const select =
            byId("rmListingCategory");


        if (!select) {
            return;
        }


        const type =
            selectedType ||
            getSelectedType() ||
            "item";


        const categories =
            CATEGORY_DATA[type] ||
            CATEGORY_DATA.item;


        const oldValue =
            selectedCategory !== undefined
                ? selectedCategory
                : select.value;


        select.innerHTML = "";


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";


        firstOption.textContent =
            "Select Category";


        select.appendChild(
            firstOption
        );


        categories.forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category;


                option.textContent =
                    category;


                select.appendChild(
                    option
                );
            }
        );


        if (oldValue) {

            select.value =
                oldValue;
        }
    }


    function populateConditionOptions(
        selectedValue
    ) {

        const select =
            byId(
                "rmListingCondition"
            );


        if (!select) {
            return;
        }


        const oldValue =
            selectedValue !== undefined
                ? selectedValue
                : select.value;


        select.innerHTML = "";


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";


        firstOption.textContent =
            "Select Condition";


        select.appendChild(
            firstOption
        );


        CONDITION_DATA.forEach(
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


        if (oldValue) {

            select.value =
                oldValue;
        }
    }


    function syncTypeChoice() {

        const typeSelect =
            byId(
                "rmListingType"
            );


        const checked =
            document.querySelector(
                'input[name="rmTypeChoice"]:checked'
            );


        if (
            typeSelect &&
            checked
        ) {

            typeSelect.value =
                checked.value;
        }


        populateListingCategories(
            typeSelect
                ? typeSelect.value
                : (
                    checked
                        ? checked.value
                        : "item"
                )
        );
    }


    /* =====================================================
       FILE READER
       ===================================================== */

    function readFileAsDataURL(
        file
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                if (!file) {

                    resolve("");

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
                                "Could not read file."
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
       LISTING STORAGE
       ===================================================== */

    function getListings() {

        return readJSON(
            CONFIG.listingsKey,
            []
        );
    }


    function saveListings(
        listings
    ) {

        return writeJSON(
            CONFIG.listingsKey,
            listings
        );
    }


    function getMyListings() {

        const account =
            getCurrentAccount();


        if (!account) {
            return [];
        }


        return getListings()
            .filter(
                function (listing) {

                    return (
                        normalizeEmail(
                            listing.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );
    }


    /* =====================================================
       LISTING FORM
       ===================================================== */

    function resetListingForm() {

        const form =
            byId(
                "rmListingForm"
            );


        if (!form) {
            return;
        }


        form.reset();


        const id =
            byId(
                "rmListingId"
            );


        if (id) {
            id.value = "";
        }


        const updateButton =
            byId(
                "rmUpdateBtn"
            );


        const cancelButton =
            byId(
                "rmCancelEditBtn"
            );


        const saveButton =
            byId(
                "rmSaveBtn"
            );


        if (updateButton) {

            updateButton.style.display =
                "none";
        }


        if (cancelButton) {

            cancelButton.style.display =
                "none";
        }


        if (saveButton) {

            saveButton.style.display =
                "";
        }


        const defaultType =
            document.querySelector(
                'input[name="rmTypeChoice"][value="item"]'
            );


        if (defaultType) {

            defaultType.checked =
                true;
        }


        const typeSelect =
            byId(
                "rmListingType"
            );


        if (typeSelect) {

            typeSelect.value =
                "item";
        }


        populateListingCategories(
            "item"
        );


        populateConditionOptions();


        setListingStatus(
            "",
            ""
        );
    }


    function requireLoginForAction() {

        if (isLoggedIn()) {
            return true;
        }


        setLoginStatus(
            "Please login with your email and password before using this feature.",
            "error"
        );


        const loginSection =
            byId(
                "rmLoginSection"
            );


        if (loginSection) {

            loginSection.style.display =
                "";


            loginSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }


        return false;
    }


    /* =====================================================
       LISTING SAVE
       ===================================================== */

    async function saveListing(
        event
    ) {

        if (event) {

            event.preventDefault();
        }


        if (
            !requireLoginForAction()
        ) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {
            return;
        }


        const title =
            safeText(
                byId("rmListingTitle")
                    ? byId("rmListingTitle").value
                    : ""
            ).trim();


        const type =
            safeText(
                byId("rmListingType")
                    ? byId("rmListingType").value
                    : getSelectedType()
            ).trim();


        const category =
            safeText(
                byId("rmListingCategory")
                    ? byId("rmListingCategory").value
                    : ""
            ).trim();


        const condition =
            safeText(
                byId("rmListingCondition")
                    ? byId("rmListingCondition").value
                    : ""
            ).trim();


        const country =
            safeText(
                byId("rmCountry")
                    ? byId("rmCountry").value
                    : ""
            ).trim();


        const state =
            safeText(
                byId("rmState")
                    ? byId("rmState").value
                    : ""
            ).trim();


        const city =
            getListingCity();


        const price =
            safeText(
                byId("rmPrice")
                    ? byId("rmPrice").value
                    : ""
            ).trim();


        const currency =
            safeText(
                byId("rmCurrency")
                    ? byId("rmCurrency").value
                    : CONFIG.currency
            ).trim() ||
            CONFIG.currency;


        const location =
            safeText(
                byId("rmLocation")
                    ? byId("rmLocation").value
                    : ""
            ).trim();


        const reach =
            safeText(
                byId("rmReach")
                    ? byId("rmReach").value
                    : ""
            ).trim();


        const description =
            safeText(
                byId("rmDescription")
                    ? byId("rmDescription").value
                    : ""
            ).trim();


        if (!title) {

            setListingStatus(
                "Please enter listing title.",
                "error"
            );

            return;
        }


        if (!type) {

            setListingStatus(
                "Please select listing type.",
                "error"
            );

            return;
        }


        if (!category) {

            setListingStatus(
                "Please select category.",
                "error"
            );

            return;
        }


        if (!country) {

            setListingStatus(
                "Please select country.",
                "error"
            );

            return;
        }


        const imageInput =
            byId("rmImage");


        const videoInput =
            byId("rmVideo");


        const imageFile =
            imageInput &&
            imageInput.files
                ? imageInput.files[0]
                : null;


        const videoFile =
            videoInput &&
            videoInput.files
                ? videoInput.files[0]
                : null;


        if (
            imageFile &&
            imageFile.size >
            CONFIG.maxImageSize
        ) {

            setListingStatus(
                "Image must be 8 MB or smaller.",
                "error"
            );

            return;
        }


        if (
            videoFile &&
            videoFile.size >
            CONFIG.maxVideoSize
        ) {

            setListingStatus(
                "Video must be 40 MB or smaller.",
                "error"
            );

            return;
        }


        const listingId =
            safeText(
                byId("rmListingId")
                    ? byId("rmListingId").value
                    : ""
            ).trim();


        let listings =
            getListings();


        const existing =
            listingId
                ? listings.find(
                    function (item) {

                        return (
                            item.id ===
                            listingId &&
                            normalizeEmail(
                                item.ownerEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            )
                        );
                    }
                )
                : null;


        let imageData =
            existing
                ? existing.image || ""
                : "";


        let videoData =
            existing
                ? existing.video || ""
                : "";


        try {

            if (imageFile) {

                imageData =
                    await readFileAsDataURL(
                        imageFile
                    );
            }


            if (videoFile) {

                videoData =
                    await readFileAsDataURL(
                        videoFile
                    );
            }

        } catch (error) {

            setListingStatus(
                "Could not read selected media.",
                "error"
            );

            return;
        }


        const listing = {

            id:
                listingId ||
                generateId(
                    "listing"
                ),

            ownerId:
                account.id,

            ownerName:
                account.name,

            ownerEmail:
                account.email,

            title:
                title,

            type:
                type,

            category:
                category,

            condition:
                condition,

            country:
                country,

            state:
                state,

            city:
                city,

            /*
             * Legacy compatibility.
             * Old district/pin values are not used
             * by the new interface.
             */

            district:
                city,

            pin:
                "",

            price:
                price,

            currency:
                currency,

            location:
                location,

            reach:
                reach,

            description:
                description,

            image:
                imageData,

            video:
                videoData,

            createdAt:
                existing
                    ? existing.createdAt
                    : nowISO(),

            updatedAt:
                nowISO()
        };


        if (existing) {

            const index =
                listings.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            listingId
                        );
                    }
                );


            if (index !== -1) {

                listings[index] =
                    Object.assign(
                        {},
                        listings[index],
                        listing
                    );
            }

        } else {

            listings.unshift(
                listing
            );
        }


        if (
            !saveListings(
                listings
            )
        ) {

            setListingStatus(
                "Could not save listing.",
                "error"
            );

            return;
        }


        setListingStatus(
            existing
                ? "Advertisement updated successfully."
                : "Advertisement saved successfully.",
            "success"
        );


        resetListingForm();

        renderListings();
    }


    /* =====================================================
       EDIT LISTING
       ===================================================== */

    function editListing(
        listingId
    ) {

        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const listing =
            getListings().find(
                function (item) {

                    return (
                        item.id ===
                        listingId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        if (!listing) {
            return;
        }


        const id =
            byId(
                "rmListingId"
            );


        const title =
            byId(
                "rmListingTitle"
            );


        const type =
            byId(
                "rmListingType"
            );


        const category =
            byId(
                "rmListingCategory"
            );


        const condition =
            byId(
                "rmListingCondition"
            );


        const country =
            byId(
                "rmCountry"
            );


        const state =
            byId(
                "rmState"
            );


        const price =
            byId(
                "rmPrice"
            );


        const currency =
            byId(
                "rmCurrency"
            );


        const location =
            byId(
                "rmLocation"
            );


        const reach =
            byId(
                "rmReach"
            );


        const description =
            byId(
                "rmDescription"
            );


        if (id) {
            id.value =
                listing.id;
        }


        if (title) {
            title.value =
                listing.title || "";
        }


        if (type) {

            type.value =
                listing.type ||
                "item";
        }


        const radio =
            document.querySelector(
                'input[name="rmTypeChoice"][value="' +
                safeText(
                    listing.type ||
                    "item"
                ).replace(
                    /"/g,
                    '\\"'
                ) +
                '"]'
            );


        if (radio) {
            radio.checked =
                true;
        }


        populateListingCategories(
            listing.type ||
            "item",
            listing.category ||
            ""
        );


        populateConditionOptions(
            listing.condition ||
            ""
        );


        if (country) {

            country.value =
                listing.country ||
                "";
        }


        if (state) {

            state.value =
                listing.state ||
                "";
        }


        setListingCity(
            listing.city ||
            listing.district ||
            ""
        );


        if (price) {

            price.value =
                listing.price ||
                "";
        }


        if (currency) {

            currency.value =
                listing.currency ||
                CONFIG.currency;
        }


        if (location) {

            location.value =
                listing.location ||
                "";
        }


        if (reach) {

            reach.value =
                listing.reach ||
                "";
        }


        if (description) {

            description.value =
                listing.description ||
                "";
        }


        const saveButton =
            byId(
                "rmSaveBtn"
            );


        const updateButton =
            byId(
                "rmUpdateBtn"
            );


        const cancelButton =
            byId(
                "rmCancelEditBtn"
            );


        if (saveButton) {

            saveButton.style.display =
                "none";
        }


        if (updateButton) {

            updateButton.style.display =
                "";
        }


        if (cancelButton) {

            cancelButton.style.display =
                "";
        }


        const sellSection =
            byId(
                "rmSellSection"
            );


        if (sellSection) {

            sellSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       DELETE LISTING
       ===================================================== */

    function deleteListing(
        listingId
    ) {

        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const listing =
            getListings().find(
                function (item) {

                    return (
                        item.id ===
                        listingId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        if (!listing) {
            return;
        }


        const confirmed =
            window.confirm(
                "Delete this advertisement?"
            );


        if (!confirmed) {
            return;
        }


        const listings =
            getListings().filter(
                function (item) {

                    return !(
                        item.id ===
                        listingId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        saveListings(
            listings
        );


        setListingStatus(
            "Advertisement deleted.",
            "success"
        );


        renderListings();
    }


    /* =====================================================
       LISTING RENDER
       ===================================================== */

    function renderListings() {

        const container =
            byId(
                "rmListings"
            );


        if (!container) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Login with your email and password to see your saved advertisements.' +
                '</div>';

            return;
        }


        const listings =
            getMyListings();


        if (!listings.length) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'No advertisements yet.' +
                '</div>';

            return;
        }


        container.innerHTML =
            listings
                .map(
                    function (listing) {

                        return renderListingCard(
                            listing
                        );
                    }
                )
                .join("");
    }


    function renderListingCard(
        listing
    ) {

        const image =
            listing.image
                ? (
                    '<img src="' +
                    escapeHTML(
                        listing.image
                    ) +
                    '" alt="' +
                    escapeHTML(
                        listing.title
                    ) +
                    '" style="max-width:100%;height:auto;">'
                )
                : "";


        const video =
            listing.video
                ? (
                    '<video controls style="max-width:100%;height:auto;">' +
                    '<source src="' +
                    escapeHTML(
                        listing.video
                    ) +
                    '">' +
                    '</video>'
                )
                : "";


        const price =
            listing.price
                ? (
                    escapeHTML(
                        listing.currency ||
                        CONFIG.currency
                    ) +
                    " " +
                    escapeHTML(
                        listing.price
                    )
                )
                : "Price on request";


        const city =
            listing.city ||
            listing.district ||
            "";


        const reach =
            listing.reach ||
            "Not specified";


        return (

            '<article class="rm-ad-card">' +

                '<div class="rm-ad-media">' +
                    image +
                    video +
                '</div>' +

                '<div class="rm-ad-content">' +

                    '<h3>' +
                        escapeHTML(
                            listing.title
                        ) +
                    '</h3>' +

                    '<p><strong>Type:</strong> ' +
                        escapeHTML(
                            listing.type
                        ) +
                    '</p>' +

                    '<p><strong>Category:</strong> ' +
                        escapeHTML(
                            listing.category
                        ) +
                    '</p>' +

                    '<p><strong>Condition:</strong> ' +
                        escapeHTML(
                            listing.condition
                        ) +
                    '</p>' +

                    '<p><strong>Country:</strong> ' +
                        escapeHTML(
                            listing.country
                        ) +
                    '</p>' +

                    '<p><strong>State:</strong> ' +
                        escapeHTML(
                            listing.state
                        ) +
                    '</p>' +

                    '<p><strong>City:</strong> ' +
                        escapeHTML(
                            city
                        ) +
                    '</p>' +

                    '<p><strong>Location:</strong> ' +
                        escapeHTML(
                            listing.location
                        ) +
                    '</p>' +

                    '<p><strong>Reach:</strong> ' +
                        escapeHTML(
                            reach
                        ) +
                    '</p>' +

                    '<p><strong>Price:</strong> ' +
                        price +
                    '</p>' +

                    '<p>' +
                        escapeHTML(
                            listing.description
                        ) +
                    '</p>' +

                    '<div class="rm-ad-actions">' +

                        '<button type="button" ' +
                            'class="rm-edit-ad-btn" ' +
                            'data-id="' +
                            escapeHTML(
                                listing.id
                            ) +
                            '">' +
                            'Edit' +
                        '</button>' +

                        '<button type="button" ' +
                            'class="rm-delete-ad-btn" ' +
                            'data-id="' +
                            escapeHTML(
                                listing.id
                            ) +
                            '">' +
                            'Delete' +
                        '</button>' +

                    '</div>' +

                '</div>' +

            '</article>'
        );
    }


    /* =====================================================
       SHOWROOM STORAGE
       ===================================================== */

    function getShowrooms() {

        return readJSON(
            CONFIG.showroomsKey,
            []
        );
    }


    function saveShowrooms(
        showrooms
    ) {

        return writeJSON(
            CONFIG.showroomsKey,
            showrooms
        );
    }


    function getMyShowrooms() {

        const account =
            getCurrentAccount();


        if (!account) {
            return [];
        }


        return getShowrooms()
            .filter(
                function (showroom) {

                    return (
                        normalizeEmail(
                            showroom.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );
    }


    /* =====================================================
       SHOWROOM DIRECT LINK
       ===================================================== */

    function getShowroomDirectLink() {

        const input =
            byId(
                "rmShowroomDirectLink"
            );


        if (!input) {
            return "";
        }


        return safeText(
            input.value
        ).trim();
    }


    function validDirectLink(
        value
    ) {

        if (!value) {
            return true;
        }


        try {

            const url =
                new URL(
                    value,
                    window.location.href
                );


            return (
                url.protocol ===
                "http:" ||
                url.protocol ===
                "https:"
            );

        } catch (error) {

            return false;
        }
    }


    function ensureShowroomDirectLinkUI() {

        const form =
            byId(
                "rmShowroomForm"
            );


        if (!form) {
            return;
        }


        let input =
            byId(
                "rmShowroomDirectLink"
            );


        if (input) {
            return;
        }


        input =
            document.createElement(
                "input"
            );


        input.type =
            "url";


        input.id =
            "rmShowroomDirectLink";


        input.name =
            "directLink";


        input.placeholder =
            "Website / Apply / Contact Link";


        input.autocomplete =
            "url";


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "rm-field";


        const label =
            document.createElement(
                "label"
            );


        label.htmlFor =
            "rmShowroomDirectLink";


        label.textContent =
            "Direct Business / Apply / Contact Link";


        wrapper.appendChild(
            label
        );


        wrapper.appendChild(
            input
        );


        const description =
            byId(
                "rmShowroomDescription"
            );


        if (description) {

            const descriptionWrapper =
                description.closest(
                    ".rm-field"
                );


            if (
                descriptionWrapper &&
                descriptionWrapper.parentNode
            ) {

                descriptionWrapper.parentNode.insertBefore(
                    wrapper,
                    descriptionWrapper
                );

            } else {

                form.appendChild(
                    wrapper
                );
            }

        } else {

            form.appendChild(
                wrapper
            );
        }
    }


    /* =====================================================
       ENGAGEMENT STORAGE
       ===================================================== */

    function getEngagement() {

        return readJSON(
            CONFIG.engagementKey,
            {}
        );
    }


    function saveEngagement(
        engagement
    ) {

        return writeJSON(
            CONFIG.engagementKey,
            engagement
        );
    }


    function getItemEngagement(
        itemId
    ) {

        const all =
            getEngagement();


        if (
            !all[itemId]
        ) {

            all[itemId] = {

                likes: [],

                dislikes: [],

                views: 0,

                countries: {}
            };
        }


        return all[itemId];
    }


    function saveItemEngagement(
        itemId,
        data
    ) {

        const all =
            getEngagement();


        all[itemId] =
            data;


        return saveEngagement(
            all
        );
    }


    function currentVisitorCountry() {

        const stored =
            safeText(
                localStorage.getItem(
                    CONFIG.visitorCountryKey
                )
            ).trim();


        if (stored) {
            return stored;
        }


        const countrySelect =
            byId(
                "rmCountry"
            );


        if (
            countrySelect &&
            countrySelect.value
        ) {

            return countrySelect.value;
        }


        return "Unknown";
    }


    function getViewerKey() {

        const account =
            getCurrentAccount();


        if (account) {

            return (
                "account:" +
                normalizeEmail(
                    account.email
                )
            );
        }


        let key =
            safeText(
                localStorage.getItem(
                    "alon_historyverse_regular_marketpkes_visitor"
                )
            );


        if (!key) {

            key =
                generateId(
                    "visitor"
                );


            try {

                localStorage.setItem(
                    "alon_historyverse_regular_marketpkes_visitor",
                    key
                );

            } catch (error) {
                console.warn(error);
            }
        }


        return (
            "visitor:" +
            key
        );
    }


    function addView(
        itemId
    ) {

        if (!itemId) {
            return;
        }


        const all =
            getEngagement();


        const data =
            all[itemId] ||
            {
                likes: [],
                dislikes: [],
                views: 0,
                countries: {}
            };


        const viewerKey =
            getViewerKey();


        const viewKey =
            "alon_historyverse_regular_marketpkes_view_" +
            itemId +
            "_" +
            viewerKey;


        try {

            if (
                sessionStorage.getItem(
                    viewKey
                )
            ) {
                return;
            }


            sessionStorage.setItem(
                viewKey,
                "1"
            );

        } catch (error) {

            /*
             * If sessionStorage is unavailable,
             * the view is still counted once.
             */
        }


        data.views =
            Number(
                data.views || 0
            ) + 1;


        const country =
            currentVisitorCountry();


        data.countries =
            data.countries || {};


        data.countries[country] =
            Number(
                data.countries[country] ||
                0
            ) + 1;


        all[itemId] =
            data;


        saveEngagement(
            all
        );
    }


    function toggleReaction(
        itemId,
        reaction
    ) {

        if (!itemId) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const data =
            getItemEngagement(
                itemId
            );


        const key =
            normalizeEmail(
                account.email
            );


        data.likes =
            Array.isArray(
                data.likes
            )
                ? data.likes
                : [];


        data.dislikes =
            Array.isArray(
                data.dislikes
            )
                ? data.dislikes
                : [];


        const likesIndex =
            data.likes.indexOf(
                key
            );


        const dislikesIndex =
            data.dislikes.indexOf(
                key
            );


        if (
            reaction ===
            "like"
        ) {

            if (
                likesIndex !== -1
            ) {

                data.likes.splice(
                    likesIndex,
                    1
                );

            } else {

                data.likes.push(
                    key
                );


                if (
                    dislikesIndex !== -1
                ) {

                    data.dislikes.splice(
                        dislikesIndex,
                        1
                    );
                }
            }

        } else if (
            reaction ===
            "dislike"
        ) {

            if (
                dislikesIndex !== -1
            ) {

                data.dislikes.splice(
                    dislikesIndex,
                    1
                );

            } else {

                data.dislikes.push(
                    key
                );


                if (
                    likesIndex !== -1
                ) {

                    data.likes.splice(
                        likesIndex,
                        1
                    );
                }
            }
        }


        saveItemEngagement(
            itemId,
            data
        );


        renderShowrooms();
    }


    function getCountryReachText(
        data
    ) {

        const countries =
            data &&
            data.countries
                ? data.countries
                : {};


        const names =
            Object.keys(
                countries
            )
                .filter(
                    function (country) {

                        return (
                            Number(
                                countries[country]
                            ) > 0
                        );
                    }
                );


        const totalViews =
            names.reduce(
                function (
                    total,
                    country
                ) {

                    return (
                        total +
                        Number(
                            countries[country] ||
                            0
                        )
                    );

                },
                0
            );


        return {

            countries:
                names.length,

            views:
                totalViews
        };
    }


    /* =====================================================
       SHOWROOM FORM
       ===================================================== */

    function resetShowroomForm() {

        const form =
            byId(
                "rmShowroomForm"
            );


        if (!form) {
            return;
        }


        form.reset();


        const id =
            byId(
                "rmShowroomId"
            );


        if (id) {

            id.value = "";
        }


        const saveButton =
            byId(
                "rmShowroomSaveBtn"
            );


        const updateButton =
            byId(
                "rmShowroomUpdateBtn"
            );


        if (saveButton) {

            saveButton.style.display =
                "";
        }


        if (updateButton) {

            updateButton.style.display =
                "none";
        }


        setShowroomStatus(
            "",
            ""
        );
    }


    /* =====================================================
       SHOWROOM SAVE
       ===================================================== */

    async function saveShowroom(
        event
    ) {

        if (event) {

            event.preventDefault();
        }


        if (
            !requireLoginForAction()
        ) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {
            return;
        }


        const name =
            safeText(
                byId("rmShowroomName")
                    ? byId("rmShowroomName").value
                    : ""
            ).trim();


        const country =
            safeText(
                byId("rmShowroomCountry")
                    ? byId("rmShowroomCountry").value
                    : ""
            ).trim();


        const state =
            safeText(
                byId("rmShowroomState")
                    ? byId("rmShowroomState").value
                    : ""
            ).trim();


        const city =
            getShowroomCity();


        const category =
            safeText(
                byId("rmShowroomCategory")
                    ? byId("rmShowroomCategory").value
                    : ""
            ).trim();


        const reach =
            safeText(
                byId("rmShowroomReach")
                    ? byId("rmShowroomReach").value
                    : ""
            ).trim();


        const description =
            safeText(
                byId("rmShowroomDescription")
                    ? byId("rmShowroomDescription").value
                    : ""
            ).trim();


        const directLink =
            getShowroomDirectLink();


        if (!name) {

            setShowroomStatus(
                "Please enter business / showroom name.",
                "error"
            );

            return;
        }


        if (!country) {

            setShowroomStatus(
                "Please select country.",
                "error"
            );

            return;
        }


        if (
            !validDirectLink(
                directLink
            )
        ) {

            setShowroomStatus(
                "Please enter a valid http or https direct link.",
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


        const imageFile =
            imageInput &&
            imageInput.files
                ? imageInput.files[0]
                : null;


        const videoFile =
            videoInput &&
            videoInput.files
                ? videoInput.files[0]
                : null;


        if (
            imageFile &&
            imageFile.size >
            CONFIG.maxImageSize
        ) {

            setShowroomStatus(
                "Showroom image must be 8 MB or smaller.",
                "error"
            );

            return;
        }


        if (
            videoFile &&
            videoFile.size >
            CONFIG.maxVideoSize
        ) {

            setShowroomStatus(
                "Showroom video must be 40 MB or smaller.",
                "error"
            );

            return;
        }


        const showroomId =
            safeText(
                byId("rmShowroomId")
                    ? byId("rmShowroomId").value
                    : ""
            ).trim();


        let showrooms =
            getShowrooms();


        const existing =
            showroomId
                ? showrooms.find(
                    function (item) {

                        return (
                            item.id ===
                            showroomId &&
                            normalizeEmail(
                                item.ownerEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            )
                        );
                    }
                )
                : null;


        let imageData =
            existing
                ? existing.image || ""
                : "";


        let videoData =
            existing
                ? existing.video || ""
                : "";


        try {

            if (imageFile) {

                imageData =
                    await readFileAsDataURL(
                        imageFile
                    );
            }


            if (videoFile) {

                videoData =
                    await readFileAsDataURL(
                        videoFile
                    );
            }

        } catch (error) {

            setShowroomStatus(
                "Could not read selected media.",
                "error"
            );

            return;
        }


        const showroom = {

            id:
                showroomId ||
                generateId(
                    "showroom"
                ),

            ownerId:
                account.id,

            ownerName:
                account.name,

            ownerEmail:
                account.email,

            name:
                name,

            country:
                country,

            state:
                state,

            city:
                city,

            /*
             * Legacy compatibility.
             */

            district:
                city,

            taluka:
                "",

            pin:
                "",

            category:
                category,

            reach:
                reach,

            description:
                description,

            directLink:
                directLink,

            image:
                imageData,

            video:
                videoData,

            price:
                CONFIG.showroomPrice,

            currency:
                "USD",

            paymentStatus:
                existing
                    ? existing.paymentStatus ||
                      "unpaid"
                    : "unpaid",

            /*
             * Future advertising structure.
             * No payment processing is activated.
             */

            featured:
                existing
                    ? !!existing.featured
                    : false,

            featuredPriority:
                existing
                    ? Number(
                        existing.featuredPriority ||
                        0
                    )
                    : 0,

            adStatus:
                existing
                    ? existing.adStatus ||
                      "active"
                    : "active",

            createdAt:
                existing
                    ? existing.createdAt
                    : nowISO(),

            updatedAt:
                nowISO()
        };


        if (existing) {

            const index =
                showrooms.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            showroomId
                        );
                    }
                );


            if (index !== -1) {

                showrooms[index] =
                    Object.assign(
                        {},
                        showrooms[index],
                        showroom
                    );
            }

        } else {

            showrooms.unshift(
                showroom
            );
        }


        if (
            !saveShowrooms(
                showrooms
            )
        ) {

            setShowroomStatus(
                "Could not save showroom advertisement.",
                "error"
            );

            return;
        }


        setShowroomStatus(
            existing
                ? "Business / showroom advertisement updated."
                : "Business / showroom advertisement saved. Advertisement price: $10 USD.",
            "success"
        );


        resetShowroomForm();

        renderShowrooms();
    }


    /* =====================================================
       EDIT SHOWROOM
       ===================================================== */

    function editShowroom(
        showroomId
    ) {

        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const showroom =
            getShowrooms().find(
                function (item) {

                    return (
                        item.id ===
                        showroomId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        if (!showroom) {
            return;
        }


        const id =
            byId(
                "rmShowroomId"
            );


        const name =
            byId(
                "rmShowroomName"
            );


        const country =
            byId(
                "rmShowroomCountry"
            );


        const state =
            byId(
                "rmShowroomState"
            );


        const category =
            byId(
                "rmShowroomCategory"
            );


        const reach =
            byId(
                "rmShowroomReach"
            );


        const description =
            byId(
                "rmShowroomDescription"
            );


        const directLink =
            byId(
                "rmShowroomDirectLink"
            );


        if (id) {

            id.value =
                showroom.id;
        }


        if (name) {

            name.value =
                showroom.name ||
                "";
        }


        if (country) {

            country.value =
                showroom.country ||
                "";
        }


        if (state) {

            state.value =
                showroom.state ||
                "";
        }


        setShowroomCity(
            showroom.city ||
            showroom.district ||
            ""
        );


        if (category) {

            category.value =
                showroom.category ||
                "";
        }


        if (reach) {

            reach.value =
                showroom.reach ||
                "";
        }


        if (description) {

            description.value =
                showroom.description ||
                "";
        }


        if (directLink) {

            directLink.value =
                showroom.directLink ||
                "";
        }


        const saveButton =
            byId(
                "rmShowroomSaveBtn"
            );


        const updateButton =
            byId(
                "rmShowroomUpdateBtn"
            );


        if (saveButton) {

            saveButton.style.display =
                "none";
        }


        if (updateButton) {

            updateButton.style.display =
                "";
        }


        const section =
            byId(
                "rmShowroomSection"
            );


        if (section) {

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       DELETE SHOWROOM
       ===================================================== */

    function deleteShowroom(
        showroomId
    ) {

        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const showroom =
            getShowrooms().find(
                function (item) {

                    return (
                        item.id ===
                        showroomId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        if (!showroom) {
            return;
        }


        const confirmed =
            window.confirm(
                "Delete this business / showroom advertisement?"
            );


        if (!confirmed) {
            return;
        }


        const showrooms =
            getShowrooms().filter(
                function (item) {

                    return !(
                        item.id ===
                        showroomId &&
                        normalizeEmail(
                            item.ownerEmail
                        ) ===
                        normalizeEmail(
                            account.email
                        )
                    );
                }
            );


        saveShowrooms(
            showrooms
        );


        setShowroomStatus(
            "Business / showroom advertisement deleted.",
            "success"
        );


        renderShowrooms();
    }


    /* =====================================================
       SHOWROOM CARD
       ===================================================== */

    function renderShowroomCard(
        showroom
    ) {

        const image =
            showroom.image
                ? (
                    '<img src="' +
                    escapeHTML(
                        showroom.image
                    ) +
                    '" alt="' +
                    escapeHTML(
                        showroom.name
                    ) +
                    '" style="width:100%;max-width:100%;height:auto;display:block;">'
                )
                : (
                    '<div class="rm-showroom-no-image">' +
                        'Business Photo Not Available' +
                    '</div>'
                );


        const video =
            showroom.video
                ? (
                    '<video controls style="width:100%;max-width:100%;height:auto;">' +
                        '<source src="' +
                        escapeHTML(
                            showroom.video
                        ) +
                        '">' +
                    '</video>'
                )
                : "";


        const city =
            showroom.city ||
            showroom.district ||
            "";


        const reach =
            showroom.reach ||
            "Not specified";


        const engagement =
            getItemEngagement(
                showroom.id
            );


        const reachData =
            getCountryReachText(
                engagement
            );


        const account =
            getCurrentAccount();


        const viewerKey =
            account
                ? normalizeEmail(
                    account.email
                )
                : "";


        const liked =
            viewerKey &&
            engagement.likes &&
            engagement.likes.indexOf(
                viewerKey
            ) !== -1;


        const disliked =
            viewerKey &&
            engagement.dislikes &&
            engagement.dislikes.indexOf(
                viewerKey
            ) !== -1;


        addView(
            showroom.id
        );


        const directLink =
            showroom.directLink
                ? (
                    '<a class="rm-business-direct-link" ' +
                        'href="' +
                        escapeHTML(
                            showroom.directLink
                        ) +
                        '" ' +
                        'target="_blank" ' +
                        'rel="noopener noreferrer">' +
                        'Apply / Contact Business' +
                    '</a>'
                )
                : "";


        return (

            '<article class="rm-showroom-card" ' +
                'data-showroom-id="' +
                escapeHTML(
                    showroom.id
                ) +
            '">' +

                /*
                 * 1. Business name / profile
                 */

                '<div class="rm-showroom-content">' +

                    '<h3>' +
                        escapeHTML(
                            showroom.name
                        ) +
                    '</h3>' +

                    '<p><strong>Business Profile:</strong> ' +
                        escapeHTML(
                            showroom.ownerName ||
                            "Business"
                        ) +
                    '</p>' +

                '</div>' +


                /*
                 * 2. Large photo
                 */

                '<div class="rm-showroom-media">' +
                    image +
                    video +
                '</div>' +


                /*
                 * 3. Business information
                 */

                '<div class="rm-showroom-content">' +

                    '<p><strong>Category:</strong> ' +
                        escapeHTML(
                            showroom.category
                        ) +
                    '</p>' +

                    '<p><strong>Country:</strong> ' +
                        escapeHTML(
                            showroom.country
                        ) +
                    '</p>' +

                    '<p><strong>State:</strong> ' +
                        escapeHTML(
                            showroom.state
                        ) +
                    '</p>' +

                    '<p><strong>City:</strong> ' +
                        escapeHTML(
                            city
                        ) +
                    '</p>' +

                    '<p><strong>Reach:</strong> ' +
                        escapeHTML(
                            reach
                        ) +
                    '</p>' +

                    '<p>' +
                        escapeHTML(
                            showroom.description
                        ) +
                    '</p>' +

                '</div>' +


                /*
                 * 4. Direct link
                 */

                '<div class="rm-showroom-direct">' +
                    directLink +
                '</div>' +


                /*
                 * 5-9. Engagement + message
                 */

                '<div class="rm-showroom-engagement">' +

                    '<button type="button" ' +
                        'class="rm-showroom-like-btn" ' +
                        'data-id="' +
                        escapeHTML(
                            showroom.id
                        ) +
                        '">' +
                        '👍 Like ' +
                        '<span>' +
                            escapeHTML(
                                engagement.likes
                                    ? engagement.likes.length
                                    : 0
                            ) +
                        '</span>' +
                    '</button>' +

                    '<button type="button" ' +
                        'class="rm-showroom-dislike-btn" ' +
                        'data-id="' +
                        escapeHTML(
                            showroom.id
                        ) +
                        '">' +
                        '👎 Dislike ' +
                        '<span>' +
                            escapeHTML(
                                engagement.dislikes
                                    ? engagement.dislikes.length
                                    : 0
                            ) +
                        '</span>' +
                    '</button>' +

                    '<div class="rm-showroom-stats">' +

                        '<span>' +
                            '👁 Views: ' +
                            escapeHTML(
                                engagement.views ||
                                0
                            ) +
                        '</span>' +

                        '<span>' +
                            '🌍 Countries: ' +
                            escapeHTML(
                                reachData.countries
                            ) +
                        '</span>' +

                        '<span>' +
                            '👥 Country-wise Views: ' +
                            escapeHTML(
                                reachData.views
                            ) +
                        '</span>' +

                    '</div>' +

                    '<button type="button" ' +
                        'class="rm-message-business-btn" ' +
                        'data-id="' +
                        escapeHTML(
                            showroom.id
                        ) +
                        '">' +
                        'Message Business' +
                    '</button>' +

                '</div>' +


                /*
                 * Advertisement structure.
                 * No payment is collected here.
                 */

                '<div class="rm-showroom-content">' +

                    '<p><strong>Advertisement Price:</strong> $10 USD</p>' +

                    '<p><strong>Payment Status:</strong> ' +
                        escapeHTML(
                            showroom.paymentStatus ||
                            "unpaid"
                        ) +
                    '</p>' +

                '</div>' +


                /*
                 * Owner controls
                 */

                '<div class="rm-ad-actions">' +

                    '<button type="button" ' +
                        'class="rm-edit-showroom-btn" ' +
                        'data-id="' +
                        escapeHTML(
                            showroom.id
                        ) +
                        '">' +
                        'Edit' +
                    '</button>' +

                    '<button type="button" ' +
                        'class="rm-delete-showroom-btn" ' +
                        'data-id="' +
                        escapeHTML(
                            showroom.id
                        ) +
                        '">' +
                        'Delete' +
                    '</button>' +

                '</div>' +

            '</article>'
        );
    }


    /* =====================================================
       SHOWROOM RENDER
       ===================================================== */

    function renderShowrooms() {

        const container =
            byId(
                "rmShowrooms"
            );


        if (!container) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Login with your email and password to see your business / showroom advertisements.' +
                '</div>';

            return;
        }


        const showrooms =
            getMyShowrooms();


        if (!showrooms.length) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'No business / showroom advertisements yet.' +
                '</div>';

            return;
        }


        container.innerHTML =
            showrooms
                .map(
                    function (showroom) {

                        return renderShowroomCard(
                            showroom
                        );
                    }
                )
                .join("");
    }


    /* =====================================================
       CONTEXTUAL BUSINESS MESSAGING
       ===================================================== */

    function getMessages() {

        return readJSON(
            CONFIG.messagesKey,
            []
        );
    }


    function saveMessages(
        messages
    ) {

        return writeJSON(
            CONFIG.messagesKey,
            messages
        );
    }


    function getBusinessConversation(
        showroom
    ) {

        const account =
            getCurrentAccount();


        if (!account) {
            return [];
        }


        return getMessages()
            .filter(
                function (message) {

                    return (
                        message.type ===
                        "business",

                        message.showroomId ===
                        showroom.id &&
                        (
                            normalizeEmail(
                                message.senderEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            ) ||
                            normalizeEmail(
                                message.receiverEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            )
                        )
                    );
                }
            );
    }


    function openBusinessMessage(
        showroomId
    ) {

        const account =
            getCurrentAccount();


        if (!account) {

            requireLoginForAction();

            return;
        }


        const showroom =
            getShowrooms().find(
                function (item) {

                    return (
                        item.id ===
                        showroomId
                    );
                }
            );


        if (!showroom) {
            return;
        }


        /*
         * Business owner cannot send a message
         * to their own business through the
         * customer messaging button.
         */

        if (
            normalizeEmail(
                showroom.ownerEmail
            ) ===
            normalizeEmail(
                account.email
            )
        ) {

            window.alert(
                "This is your own business advertisement."
            );

            return;
        }


        const message =
            window.prompt(
                "Message " +
                showroom.name +
                ":"
            );


        if (
            message === null
        ) {
            return;
        }


        const text =
            safeText(
                message
            ).trim();


        if (!text) {

            window.alert(
                "Please enter a message."
            );

            return;
        }


        const messages =
            getMessages();


        messages.push({

            id:
                generateId(
                    "message"
                ),

            type:
                "business",

            showroomId:
                showroom.id,

            listingType:
                "showroom",

            senderId:
                account.id,

            senderName:
                account.name,

            senderEmail:
                account.email,

            receiverId:
                showroom.ownerId,

            receiverName:
                showroom.ownerName,

            receiverEmail:
                showroom.ownerEmail,

            message:
                text,

            createdAt:
                nowISO(),

            read:
                false
        });


        if (
            saveMessages(
                messages
            )
        ) {

            window.alert(
                "Message sent to the business."
            );

            renderBusinessMessages();
        }
    }


    function renderBusinessMessages() {

        const container =
            byId(
                "rmBusinessMessages"
            );


        if (!container) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Login to view your business messages.' +
                '</div>';

            return;
        }


        const messages =
            getMessages()
                .filter(
                    function (message) {

                        return (
                            normalizeEmail(
                                message.senderEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            ) ||
                            normalizeEmail(
                                message.receiverEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            )
                        );
                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            new Date(
                                b.createdAt
                            ) -
                            new Date(
                                a.createdAt
                            )
                        );
                    }
                );


        if (!messages.length) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'No business messages yet.' +
                '</div>';

            return;
        }


        container.innerHTML =
            messages
                .map(
                    function (message) {

                        const outgoing =
                            normalizeEmail(
                                message.senderEmail
                            ) ===
                            normalizeEmail(
                                account.email
                            );


                        return (

                            '<article class="rm-business-message">' +

                                '<p><strong>' +
                                    (
                                        outgoing
                                            ? "You"
                                            : escapeHTML(
                                                message.senderName ||
                                                "Business"
                                            )
                                    ) +
                                '</strong></p>' +

                                '<p>' +
                                    escapeHTML(
                                        message.message
                                    ) +
                                '</p>' +

                                '<small>' +
                                    escapeHTML(
                                        message.createdAt
                                    ) +
                                '</small>' +

                            '</article>'
                        );
                    }
                )
                .join("");
    }


    /* =====================================================
       DISCOVERY POSITION
       ===================================================== */

    function moveDiscoveryAboveResponsibility() {

        const discovery =
            document.querySelector(
                ".rm-discovery-section"
            );


        if (!discovery) {
            return;
        }


        const responsibility =
            document.querySelector(
                ".rm-page .rm-responsibility"
            ) ||
            document.querySelector(
                ".rm-page [id*='Responsibility']"
            ) ||
            document.querySelector(
                ".rm-page [id*='responsibility']"
            );


        if (
            responsibility &&
            responsibility.parentNode
        ) {

            responsibility.parentNode.insertBefore(
                discovery,
                responsibility
            );

            return;
        }


        /*
         * Fallback for the existing layout where
         * Discovery is outside .rm-page.
         */

        const page =
            document.querySelector(
                ".rm-page"
            );


        if (
            page &&
            discovery.parentNode !== page
        ) {

            page.appendChild(
                discovery
            );
        }
    }


    /* =====================================================
       DYNAMIC STYLE
       ===================================================== */

    function addDynamicStyles() {

        if (
            byId(
                "alonRegularMarketplaceV25Style"
            )
        ) {
            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "alonRegularMarketplaceV25Style";


        style.textContent = `

            .rm-showroom-direct {
                margin: 12px 0;
            }

            .rm-business-direct-link {
                display: inline-block;
                padding: 10px 16px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 700;
                border: 1px solid #d7b35a;
            }

            .rm-showroom-engagement {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                align-items: center;
                margin: 14px 0;
            }

            .rm-showroom-engagement button {
                cursor: pointer;
            }

            .rm-showroom-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                width: 100%;
                margin-top: 6px;
            }

            .rm-business-message {
                border: 1px solid #d7b35a;
                border-radius: 8px;
                padding: 12px;
                margin: 8px 0;
            }

            .rm-showroom-no-image {
                min-height: 180px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed #d7b35a;
            }

            .rm-discovery-section {
                margin-top: 20px;
            }

            @media (max-width: 600px) {

                .rm-showroom-engagement {
                    flex-direction: column;
                    align-items: stretch;
                }

                .rm-showroom-engagement button {
                    width: 100%;
                }

                .rm-showroom-stats {
                    flex-direction: column;
                }
            }
        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       TYPE RADIO EVENTS
       ===================================================== */

    function bindTypeEvents() {

        const radios =
            document.querySelectorAll(
                'input[name="rmTypeChoice"]'
            );


        radios.forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    function () {

                        const typeSelect =
                            byId(
                                "rmListingType"
                            );


                        if (typeSelect) {

                            typeSelect.value =
                                radio.value;
                        }


                        populateListingCategories(
                            radio.value
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       DYNAMIC EVENTS
       ===================================================== */

    function bindDynamicEvents() {

        const listings =
            byId(
                "rmListings"
            );


        if (listings) {

            listings.addEventListener(
                "click",
                function (event) {

                    const editButton =
                        event.target.closest(
                            ".rm-edit-ad-btn"
                        );


                    if (editButton) {

                        editListing(
                            editButton.dataset.id
                        );

                        return;
                    }


                    const deleteButton =
                        event.target.closest(
                            ".rm-delete-ad-btn"
                        );


                    if (deleteButton) {

                        deleteListing(
                            deleteButton.dataset.id
                        );
                    }
                }
            );
        }


        const showrooms =
            byId(
                "rmShowrooms"
            );


        if (showrooms) {

            showrooms.addEventListener(
                "click",
                function (event) {

                    const editButton =
                        event.target.closest(
                            ".rm-edit-showroom-btn"
                        );


                    if (editButton) {

                        editShowroom(
                            editButton.dataset.id
                        );

                        return;
                    }


                    const deleteButton =
                        event.target.closest(
                            ".rm-delete-showroom-btn"
                        );


                    if (deleteButton) {

                        deleteShowroom(
                            deleteButton.dataset.id
                        );

                        return;
                    }


                    const likeButton =
                        event.target.closest(
                            ".rm-showroom-like-btn"
                        );


                    if (likeButton) {

                        toggleReaction(
                            likeButton.dataset.id,
                            "like"
                        );

                        return;
                    }


                    const dislikeButton =
                        event.target.closest(
                            ".rm-showroom-dislike-btn"
                        );


                    if (dislikeButton) {

                        toggleReaction(
                            dislikeButton.dataset.id,
                            "dislike"
                        );

                        return;
                    }


                    const messageButton =
                        event.target.closest(
                            ".rm-message-business-btn"
                        );


                    if (messageButton) {

                        openBusinessMessage(
                            messageButton.dataset.id
                        );
                    }
                }
            );
        }
    }


    /* =====================================================
       MAIN EVENTS
       ===================================================== */

    function bindEvents() {

        const loginForm =
            byId(
                "rmLoginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    loginUser();
                }
            );
        }


        const logoutButton =
            byId(
                "rmLogoutBtn"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    logoutUser();
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
                function (event) {

                    saveListing(
                        event
                    );
                }
            );
        }


        const showroomForm =
            byId(
                "rmShowroomForm"
            );


        if (showroomForm) {

            showroomForm.addEventListener(
                "submit",
                function (event) {

                    saveShowroom(
                        event
                    );
                }
            );
        }


        const cancelEdit =
            byId(
                "rmCancelEditBtn"
            );


        if (cancelEdit) {

            cancelEdit.addEventListener(
                "click",
                function () {

                    resetListingForm();
                }
            );
        }


        const resetListing =
            byId(
                "rmResetBtn"
            );


        if (resetListing) {

            resetListing.addEventListener(
                "click",
                function () {

                    resetListingForm();
                }
            );
        }


        const resetShowroom =
            byId(
                "rmShowroomResetBtn"
            );


        if (resetShowroom) {

            resetShowroom.addEventListener(
                "click",
                function () {

                    resetShowroomForm();
                }
            );
        }


        const typeSelect =
            byId(
                "rmListingType"
            );


        if (typeSelect) {

            typeSelect.addEventListener(
                "change",
                function () {

                    const radio =
                        document.querySelector(
                            'input[name="rmTypeChoice"][value="' +
                            safeText(
                                typeSelect.value
                            ).replace(
                                /"/g,
                                '\\"'
                            ) +
                            '"]'
                        );


                    if (radio) {

                        radio.checked =
                            true;
                    }


                    populateListingCategories(
                        typeSelect.value
                    );
                }
            );
        }


        bindTypeEvents();

        bindDynamicEvents();
    }


    /* =====================================================
       COUNTRY RETRY
       ===================================================== */

    function startCountryRetry() {

        let attempts = 0;

        const maxAttempts =
            20;


        function tryPopulate() {

            attempts++;


            const countries =
                getCountryDatabase();


            if (
                countries.length
            ) {

                populateAllCountries();

                return;
            }


            if (
                attempts <
                maxAttempts
            ) {

                window.setTimeout(
                    tryPopulate,
                    300
                );
            }
        }


        tryPopulate();
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function init() {

        console.log(
            "ALON HISTORYVERSE 24 Regular Marketplace " +
            CONFIG.version +
            " initialized."
        );


        addDynamicStyles();

        ensurePasswordLoginUI();

        ensureShowroomDirectLinkUI();

        hideOldLocationFields();

        moveDiscoveryAboveResponsibility();

        updateLoginUI();


        populateListingCategories(
            "item"
        );


        populateConditionOptions();


        startCountryRetry();


        bindEvents();


        renderListings();

        renderShowrooms();

        renderBusinessMessages();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_REGULAR_MARKETPLACE = {

        version:
            CONFIG.version,

        login:
            loginUser,

        logout:
            logoutUser,

        saveListing:
            saveListing,

        editListing:
            editListing,

        deleteListing:
            deleteListing,

        saveShowroom:
            saveShowroom,

        editShowroom:
            editShowroom,

        deleteShowroom:
            deleteShowroom,

        renderListings:
            renderListings,

        renderShowrooms:
            renderShowrooms,

        renderBusinessMessages:
            renderBusinessMessages,

        populateCountries:
            populateAllCountries,

        likeShowroom:
            function (id) {
                toggleReaction(
                    id,
                    "like"
                );
            },

        dislikeShowroom:
            function (id) {
                toggleReaction(
                    id,
                    "dislike"
                );
            },

        messageBusiness:
            openBusinessMessage
    };


    /* =====================================================
       START
       ===================================================== */

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