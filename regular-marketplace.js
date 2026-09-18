/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE
   ---------------------------------------------------------
   File: regular-marketplace.js
   Version: 24.8 PASSWORDLESS SAFE REGULAR MARKETPLACE
   Creator: Baba Thecno Guru

   FEATURES
   • Passwordless Name + Email Login
   • Agreement Login
   • Profile + Logout
   • Item / Property / Vehicle
   • New / Used / Refurbished
   • World Country Database
   • Flag + Country + ISO + Calling Code
   • State / District / Pin / Location
   • Price + Currency
   • Local / Country / Global / All Countries
   • Image + Video
   • My Ads
   • Edit / Delete Ads
   • Business / Showroom Advertisement
   • Showroom Edit / Delete
   • $10 Showroom Advertisement
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
        version: "24.8",
        currency: "USD",
        showroomPrice: 10,

        maxImageSize: 8 * 1024 * 1024,
        maxVideoSize: 40 * 1024 * 1024,

        accountsKey:
            "alon_historyverse_regular_marketpkes_accounts",

        sessionKey:
            "alon_historyverse_regular_marketpkes_session",

        listingsKey:
            "alon_historyverse_regular_marketpkes_listings",

        showroomsKey:
            "alon_historyverse_regular_marketpkes_showrooms"
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
        if (value === null || value === undefined) {
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


    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            const parsed = JSON.parse(value);

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


    function writeJSON(key, value) {
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


    /* =====================================================
       ACCOUNT SYSTEM
       PASSWORDLESS
       ===================================================== */

    function getAccounts() {
        return readJSON(
            CONFIG.accountsKey,
            []
        );
    }


    function saveAccounts(accounts) {
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


    function saveSession(session) {
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
        const session = getSession();

        if (!session || !session.email) {
            return null;
        }

        const accounts = getAccounts();

        const email =
            safeText(session.email)
                .trim()
                .toLowerCase();

        return (
            accounts.find(function (account) {
                return (
                    safeText(account.email)
                        .trim()
                        .toLowerCase() === email
                );
            }) || null
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
       LOGIN UI
       ===================================================== */

    function updateLoginUI() {

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


        /*
         * IMPORTANT:
         * All marketplace features stay visible.
         * Login is required only when saving/editing/deleting.
         */

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
                    account.name || "User";
            }

            if (profileEmail) {
                profileEmail.textContent =
                    account.email || "";
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
       PASSWORDLESS LOGIN
       ===================================================== */

    function loginUser() {

        const nameInput =
            byId("rmLoginName");

        const emailInput =
            byId("rmLoginEmail");

        const agreement =
            byId("rmAgreement");


        const name =
            nameInput
                ? safeText(nameInput.value).trim()
                : "";

        const email =
            emailInput
                ? safeText(emailInput.value)
                    .trim()
                    .toLowerCase()
                : "";


        if (!name) {

            setLoginStatus(
                "Please enter your name.",
                "error"
            );

            if (nameInput) {
                nameInput.focus();
            }

            return;
        }


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


        if (!emailPattern.test(email)) {

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
            accounts.find(function (item) {

                return (
                    safeText(item.email)
                        .trim()
                        .toLowerCase() === email
                );
            });


        if (account) {

            /*
             * Existing email:
             * update display name only.
             */

            account.name =
                name || account.name;

            account.updatedAt =
                nowISO();

        } else {

            /*
             * First-time email:
             * create passwordless account.
             */

            account = {
                id: generateId("account"),
                name: name,
                email: email,
                createdAt: nowISO(),
                updatedAt: nowISO()
            };

            accounts.push(account);
        }


        if (!saveAccounts(accounts)) {

            setLoginStatus(
                "Could not save account on this device.",
                "error"
            );

            return;
        }


        saveSession({
            accountId: account.id,
            email: account.email,
            loggedInAt: nowISO()
        });


        setLoginStatus(
            "Login successful.",
            "success"
        );


        updateLoginUI();

        renderListings();

        renderShowrooms();

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


        if (Array.isArray(countries)) {
            return countries;
        }


        if (
            countries &&
            typeof countries === "object"
        ) {

            return Object.keys(countries)
                .map(function (key) {

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
                });
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


    function countryLabel(country) {

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
            label += flag + " ";
        }

        label +=
            name || code || "Unknown";


        if (code) {
            label +=
                " (" + code + ")";
        }

        if (calling) {
            label +=
                " +" +
                String(calling)
                    .replace(/^\+/, "");
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
            safeText(select.value);


        const fragment =
            document.createDocumentFragment();


        const firstOption =
            document.createElement("option");

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
                    document.createElement("option");


                option.value =
                    countryOptionValue(
                        country
                    );


                option.textContent =
                    countryLabel(
                        country
                    );


                /*
                 * Save extra country information
                 * on the option.
                 */

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
            ? safeText(checked.value)
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
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "Select Category";

        select.appendChild(
            firstOption
        );


        categories.forEach(
            function (category) {

                const option =
                    document.createElement("option");

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
            byId("rmListingCondition");

        if (!select) {
            return;
        }


        const oldValue =
            selectedValue !== undefined
                ? selectedValue
                : select.value;


        select.innerHTML = "";


        const firstOption =
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "Select Condition";

        select.appendChild(
            firstOption
        );


        CONDITION_DATA.forEach(
            function (condition) {

                const option =
                    document.createElement("option");

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
            byId("rmListingType");

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
            function (resolve, reject) {

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
            .filter(function (listing) {

                return (
                    listing.ownerEmail ===
                    account.email
                );
            });
    }


    /* =====================================================
       LISTING FORM
       ===================================================== */

    function resetListingForm() {

        const form =
            byId("rmListingForm");

        if (!form) {
            return;
        }


        form.reset();


        const id =
            byId("rmListingId");

        if (id) {
            id.value = "";
        }


        const updateButton =
            byId("rmUpdateBtn");

        const cancelButton =
            byId("rmCancelEditBtn");

        const saveButton =
            byId("rmSaveBtn");


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
            defaultType.checked = true;
        }


        const typeSelect =
            byId("rmListingType");

        if (typeSelect) {
            typeSelect.value = "item";
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
            "Please login with your email before using this feature.",
            "error"
        );


        const loginSection =
            byId("rmLoginSection");


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


    async function saveListing(
        event
    ) {

        if (event) {
            event.preventDefault();
        }


        if (!requireLoginForAction()) {
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


        const district =
            safeText(
                byId("rmDistrict")
                    ? byId("rmDistrict").value
                    : ""
            ).trim();


        const pin =
            safeText(
                byId("rmPin")
                    ? byId("rmPin").value
                    : ""
            ).trim();


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


        let existing =
            listingId
                ? listings.find(function (item) {
                    return (
                        item.id === listingId &&
                        item.ownerEmail ===
                        account.email
                    );
                })
                : null;


        let imageData =
            existing
                ? existing.image
                : "";

        let videoData =
            existing
                ? existing.video
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
                generateId("listing"),

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

            district:
                district,

            pin:
                pin,

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
                    listing;
            }

        } else {

            listings.unshift(
                listing
            );
        }


        if (!saveListings(listings)) {

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
                        item.id === listingId &&
                        item.ownerEmail ===
                        account.email
                    );
                }
            );


        if (!listing) {
            return;
        }


        const id =
            byId("rmListingId");

        const title =
            byId("rmListingTitle");

        const type =
            byId("rmListingType");

        const category =
            byId("rmListingCategory");

        const condition =
            byId("rmListingCondition");

        const country =
            byId("rmCountry");

        const state =
            byId("rmState");

        const district =
            byId("rmDistrict");

        const pin =
            byId("rmPin");

        const price =
            byId("rmPrice");

        const currency =
            byId("rmCurrency");

        const location =
            byId("rmLocation");

        const reach =
            byId("rmReach");

        const description =
            byId("rmDescription");


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
                listing.type || "item";
        }


        const radio =
            document.querySelector(
                'input[name="rmTypeChoice"][value="' +
                CSS.escape(
                    listing.type || "item"
                ) +
                '"]'
            );


        if (radio) {
            radio.checked = true;
        }


        populateListingCategories(
            listing.type || "item",
            listing.category || ""
        );


        populateConditionOptions(
            listing.condition || ""
        );


        if (country) {
            country.value =
                listing.country || "";
        }

        if (state) {
            state.value =
                listing.state || "";
        }

        if (district) {
            district.value =
                listing.district || "";
        }

        if (pin) {
            pin.value =
                listing.pin || "";
        }

        if (price) {
            price.value =
                listing.price || "";
        }

        if (currency) {
            currency.value =
                listing.currency ||
                CONFIG.currency;
        }

        if (location) {
            location.value =
                listing.location || "";
        }

        if (reach) {
            reach.value =
                listing.reach || "";
        }

        if (description) {
            description.value =
                listing.description || "";
        }


        const saveButton =
            byId("rmSaveBtn");

        const updateButton =
            byId("rmUpdateBtn");

        const cancelButton =
            byId("rmCancelEditBtn");


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
            byId("rmSellSection");


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
                        item.id === listingId &&
                        item.ownerEmail ===
                        account.email
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
                        item.id === listingId &&
                        item.ownerEmail ===
                        account.email
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
       RENDER LISTINGS
       ===================================================== */

    function renderListings() {

        const container =
            byId("rmListings");

        if (!container) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Login with your email to see your saved advertisements.' +
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

                    '<p><strong>District:</strong> ' +
                        escapeHTML(
                            listing.district
                        ) +
                    '</p>' +

                    '<p><strong>PIN:</strong> ' +
                        escapeHTML(
                            listing.pin
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
            .filter(function (showroom) {

                return (
                    showroom.ownerEmail ===
                    account.email
                );
            });
    }


    /* =====================================================
       SHOWROOM FORM
       ===================================================== */

    function resetShowroomForm() {

        const form =
            byId("rmShowroomForm");

        if (!form) {
            return;
        }


        form.reset();


        const id =
            byId("rmShowroomId");

        if (id) {
            id.value = "";
        }


        const saveButton =
            byId("rmShowroomSaveBtn");

        const updateButton =
            byId("rmShowroomUpdateBtn");


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


    async function saveShowroom(
        event
    ) {

        if (event) {
            event.preventDefault();
        }


        if (!requireLoginForAction()) {
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


        const district =
            safeText(
                byId("rmShowroomDistrict")
                    ? byId("rmShowroomDistrict").value
                    : ""
            ).trim();


        const taluka =
            safeText(
                byId("rmShowroomTaluka")
                    ? byId("rmShowroomTaluka").value
                    : ""
            ).trim();


        const pin =
            safeText(
                byId("rmShowroomPin")
                    ? byId("rmShowroomPin").value
                    : ""
            ).trim();


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


        const imageInput =
            byId("rmShowroomImage");

        const videoInput =
            byId("rmShowroomVideo");


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


        let existing =
            showroomId
                ? showrooms.find(function (item) {

                    return (
                        item.id === showroomId &&
                        item.ownerEmail ===
                        account.email
                    );
                })
                : null;


        let imageData =
            existing
                ? existing.image
                : "";


        let videoData =
            existing
                ? existing.video
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
                generateId("showroom"),

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

            district:
                district,

            taluka:
                taluka,

            pin:
                pin,

            category:
                category,

            reach:
                reach,

            description:
                description,

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
                    ? existing.paymentStatus || "unpaid"
                    : "unpaid",

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
                    showroom;
            }

        } else {

            showrooms.unshift(
                showroom
            );
        }


        if (!saveShowrooms(showrooms)) {

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
                        item.id === showroomId &&
                        item.ownerEmail ===
                        account.email
                    );
                }
            );


        if (!showroom) {
            return;
        }


        const id =
            byId("rmShowroomId");

        const name =
            byId("rmShowroomName");

        const country =
            byId("rmShowroomCountry");

        const state =
            byId("rmShowroomState");

        const district =
            byId("rmShowroomDistrict");

        const taluka =
            byId("rmShowroomTaluka");

        const pin =
            byId("rmShowroomPin");

        const category =
            byId("rmShowroomCategory");

        const reach =
            byId("rmShowroomReach");

        const description =
            byId("rmShowroomDescription");


        if (id) {
            id.value =
                showroom.id;
        }

        if (name) {
            name.value =
                showroom.name || "";
        }

        if (country) {
            country.value =
                showroom.country || "";
        }

        if (state) {
            state.value =
                showroom.state || "";
        }

        if (district) {
            district.value =
                showroom.district || "";
        }

        if (taluka) {
            taluka.value =
                showroom.taluka || "";
        }

        if (pin) {
            pin.value =
                showroom.pin || "";
        }

        if (category) {
            category.value =
                showroom.category || "";
        }

        if (reach) {
            reach.value =
                showroom.reach || "";
        }

        if (description) {
            description.value =
                showroom.description || "";
        }


        const saveButton =
            byId("rmShowroomSaveBtn");

        const updateButton =
            byId("rmShowroomUpdateBtn");


        if (saveButton) {
            saveButton.style.display =
                "none";
        }

        if (updateButton) {
            updateButton.style.display =
                "";
        }


        const section =
            byId("rmShowroomSection");


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
                        item.id === showroomId &&
                        item.ownerEmail ===
                        account.email
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
                        item.id === showroomId &&
                        item.ownerEmail ===
                        account.email
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
       RENDER SHOWROOMS
       ===================================================== */

    function renderShowrooms() {

        const container =
            byId("rmShowrooms");

        if (!container) {
            return;
        }


        const account =
            getCurrentAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Login with your email to see your business / showroom advertisements.' +
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
                    '" style="max-width:100%;height:auto;">'
                )
                : "";


        const video =
            showroom.video
                ? (
                    '<video controls style="max-width:100%;height:auto;">' +
                    '<source src="' +
                    escapeHTML(
                        showroom.video
                    ) +
                    '">' +
                    '</video>'
                )
                : "";


        const reach =
            showroom.reach ||
            "Not specified";


        return (
            '<article class="rm-showroom-card">' +

                '<div class="rm-showroom-media">' +
                    image +
                    video +
                '</div>' +

                '<div class="rm-showroom-content">' +

                    '<h3>' +
                        escapeHTML(
                            showroom.name
                        ) +
                    '</h3>' +

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

                    '<p><strong>District:</strong> ' +
                        escapeHTML(
                            showroom.district
                        ) +
                    '</p>' +

                    '<p><strong>Taluka:</strong> ' +
                        escapeHTML(
                            showroom.taluka
                        ) +
                    '</p>' +

                    '<p><strong>PIN:</strong> ' +
                        escapeHTML(
                            showroom.pin
                        ) +
                    '</p>' +

                    '<p><strong>Reach:</strong> ' +
                        escapeHTML(
                            reach
                        ) +
                    '</p>' +

                    '<p><strong>Advertisement Price:</strong> $10 USD</p>' +

                    '<p><strong>Payment Status:</strong> ' +
                        escapeHTML(
                            showroom.paymentStatus ||
                            "unpaid"
                        ) +
                    '</p>' +

                    '<p>' +
                        escapeHTML(
                            showroom.description
                        ) +
                    '</p>' +

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

                '</div>' +

            '</article>'
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
                            byId("rmListingType");

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
       EVENT DELEGATION
       ===================================================== */

    function bindDynamicEvents() {

        const listings =
            byId("rmListings");


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
            byId("rmShowrooms");


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
            byId("rmLoginForm");


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
            byId("rmLogoutBtn");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                function () {

                    logoutUser();
                }
            );
        }


        const listingForm =
            byId("rmListingForm");


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
            byId("rmShowroomForm");


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
            byId("rmCancelEditBtn");


        if (cancelEdit) {

            cancelEdit.addEventListener(
                "click",
                function () {

                    resetListingForm();
                }
            );
        }


        const resetListing =
            byId("rmResetBtn");


        if (resetListing) {

            resetListing.addEventListener(
                "click",
                function () {

                    resetListingForm();
                }
            );
        }


        const resetShowroom =
            byId("rmShowroomResetBtn");


        if (resetShowroom) {

            resetShowroom.addEventListener(
                "click",
                function () {

                    resetShowroomForm();
                }
            );
        }


        const typeSelect =
            byId("rmListingType");


        if (typeSelect) {

            typeSelect.addEventListener(
                "change",
                function () {

                    const radio =
                        document.querySelector(
                            'input[name="rmTypeChoice"][value="' +
                            CSS.escape(
                                typeSelect.value
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

        const maxAttempts = 20;


        function tryPopulate() {

            attempts++;


            const countries =
                getCountryDatabase();


            if (countries.length) {

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


        /*
         * All feature sections remain visible.
         */

        updateLoginUI();


        populateListingCategories(
            "item"
        );


        populateConditionOptions();


        startCountryRetry();


        bindEvents();


        renderListings();

        renderShowrooms();
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

        populateCountries:
            populateAllCountries
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