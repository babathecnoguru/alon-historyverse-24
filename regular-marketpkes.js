/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPKES
   ---------------------------------------------------------
   File: regular-marketpkes.js
   Version: 24.7 SAFE REGULAR MARKETPKES
   Creator: Baba Thecno Guru

   FEATURES
   • Item / Property / Vehicle
   • New / Used / Refurbished
   • Central World Country Database
   • Flag + Country + ISO + Calling Code
   • Login + Agreement
   • Save / Edit / Delete Listings
   • Image + Video
   • My Listings
   • Business / Showroom Advertisement
   • Global / International / Local Reach
   • $10 USD Advertisement
   • Local Storage
   • Mobile Friendly
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       CONFIG
       ========================================================= */

    const CONFIG = {

        version: "24.7",

        currency: "USD",

        showroomPrice: 10,

        maxImageSize: 8 * 1024 * 1024,

        maxVideoSize: 40 * 1024 * 1024,

        storage: {

            accounts: "alon_historyverse_regular_marketpkes_accounts",

            session: "alon_historyverse_regular_marketpkes_session",

            listings: "alon_historyverse_regular_marketpkes_listings",

            showrooms: "alon_historyverse_regular_marketpkes_showrooms"

        }

    };


    /* =========================================================
       CATEGORY DATABASE
       ========================================================= */

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


    /* =========================================================
       CONDITION DATABASE
       ========================================================= */

    const CONDITION_DATA = [

        "New",

        "Used",

        "Refurbished"

    ];


    /* =========================================================
       GENERAL HELPERS
       ========================================================= */

    function byId(id) {

        return document.getElementById(id);

    }


    function safeText(value) {

        if (value === undefined || value === null) {

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

            Date.now().toString(36) +

            "_" +

            Math.random()

                .toString(36)

                .slice(2, 10)

        );

    }


    function readStorage(key, fallback) {

        try {

            const value = localStorage.getItem(key);

            if (!value) {

                return fallback;

            }

            return JSON.parse(value);

        } catch (error) {

            console.warn(

                "REGULAR MARKETPKES: storage read error",

                error

            );

            return fallback;

        }

    }


    function writeStorage(key, value) {

        try {

            localStorage.setItem(

                key,

                JSON.stringify(value)

            );

            return true;

        } catch (error) {

            console.warn(

                "REGULAR MARKETPKES: storage write error",

                error

            );

            return false;

        }

    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            console.warn(

                "REGULAR MARKETPKES: storage remove error",

                error

            );

        }

    }


    /* =========================================================
       ACCOUNT / SESSION
       ========================================================= */

    function getAccounts() {

        const accounts = readStorage(

            CONFIG.storage.accounts,

            []

        );

        return Array.isArray(accounts)

            ? accounts

            : [];

    }


    function saveAccounts(accounts) {

        return writeStorage(

            CONFIG.storage.accounts,

            accounts

        );

    }


    function getSession() {

        return readStorage(

            CONFIG.storage.session,

            null

        );

    }


    function saveSession(session) {

        return writeStorage(

            CONFIG.storage.session,

            session

        );

    }


    function clearSession() {

        removeStorage(

            CONFIG.storage.session

        );

    }


    function getCurrentAccount() {

        const session = getSession();

        if (!session || !session.email) {

            return null;

        }

        const accounts = getAccounts();

        return (

            accounts.find(function (account) {

                return (

                    account.email ===

                    session.email

                );

            }) || null

        );

    }


    function isLoggedIn() {

        return !!getCurrentAccount();

    }


    /* =========================================================
       LOGIN UI
       ========================================================= */

    function updateLoginUI() {

        const loginSection = byId(

            "rmLoginSection"

        );

        const profileSection = byId(

            "rmProfileSection"

        );

        const listingSection = byId(

            "rmListingSection"

        );

        const myListingsSection = byId(

            "rmMyListingsSection"

        );

        const showroomSection = byId(

            "rmShowroomSection"

        );

        const myShowroomsSection = byId(

            "rmMyShowroomsSection"

        );

        const profile = byId(

            "rmProfile"

        );


        const account = getCurrentAccount();


        if (account) {

            if (loginSection) {

                loginSection.classList.add(

                    "rm-hidden"

                );

            }

            if (profileSection) {

                profileSection.classList.remove(

                    "rm-hidden"

                );

            }

            if (listingSection) {

                listingSection.classList.remove(

                    "rm-hidden"

                );

            }

            if (myListingsSection) {

                myListingsSection.classList.remove(

                    "rm-hidden"

                );

            }

            if (showroomSection) {

                showroomSection.classList.remove(

                    "rm-hidden"

                );

            }

            if (myShowroomsSection) {

                myShowroomsSection.classList.remove(

                    "rm-hidden"

                );

            }


            if (profile) {

                profile.innerHTML =

                    "<strong>Logged in:</strong> " +

                    escapeHTML(

                        account.email

                    );

            }

            return;

        }


        if (loginSection) {

            loginSection.classList.remove(

                "rm-hidden"

            );

        }

        if (profileSection) {

            profileSection.classList.add(

                "rm-hidden"

            );

        }

        if (listingSection) {

            listingSection.classList.add(

                "rm-hidden"

            );

        }

        if (myListingsSection) {

            myListingsSection.classList.add(

                "rm-hidden"

            );

        }

        if (showroomSection) {

            showroomSection.classList.add(

                "rm-hidden"

            );

        }

        if (myShowroomsSection) {

            myShowroomsSection.classList.add(

                "rm-hidden"

            );

        }

    }


    function loginUser() {

        const agreement = byId(

            "rmAgreement"

        );

        const emailInput = byId(

            "rmLoginEmail"

        );

        const passwordInput = byId(

            "rmLoginPassword"

        );

        const message = byId(

            "rmLoginMessage"

        );


        if (

            !agreement ||

            !agreement.checked

        ) {

            if (message) {

                message.textContent =

                    "Please accept the marketplace agreement.";

            }

            return;

        }


        const email = safeText(

            emailInput && emailInput.value

        )

            .trim()

            .toLowerCase();


        const password = safeText(

            passwordInput &&

            passwordInput.value

        );


        if (!email || !password) {

            if (message) {

                message.textContent =

                    "Enter email and password.";

            }

            return;

        }


        const accounts = getAccounts();


        const account = accounts.find(

            function (item) {

                return (

                    item.email === email &&

                    item.password === password

                );

            }

        );


        if (!account) {

            if (message) {

                message.textContent =

                    "Account not found or password is incorrect.";

            }

            return;

        }


        saveSession({

            email: account.email,

            loginAt: Date.now()

        });


        if (message) {

            message.textContent =

                "Login successful.";

        }


        updateLoginUI();

        renderListings();

        renderShowrooms();

    }


    function registerUser() {

        const agreement = byId(

            "rmAgreement"

        );

        const emailInput = byId(

            "rmLoginEmail"

        );

        const passwordInput = byId(

            "rmLoginPassword"

        );

        const message = byId(

            "rmLoginMessage"

        );


        if (

            !agreement ||

            !agreement.checked

        ) {

            if (message) {

                message.textContent =

                    "Please accept the marketplace agreement.";

            }

            return;

        }


        const email = safeText(

            emailInput && emailInput.value

        )

            .trim()

            .toLowerCase();


        const password = safeText(

            passwordInput &&

            passwordInput.value

        );


        if (!email || !password) {

            if (message) {

                message.textContent =

                    "Enter email and password to create account.";

            }

            return;

        }


        if (password.length < 4) {

            if (message) {

                message.textContent =

                    "Password must contain at least 4 characters.";

            }

            return;

        }


        const accounts = getAccounts();


        const existing = accounts.find(

            function (account) {

                return account.email === email;

            }

        );


        if (existing) {

            if (message) {

                message.textContent =

                    "Account already exists. Please login.";

            }

            return;

        }


        accounts.push({

            id: generateId("account"),

            email: email,

            password: password,

            createdAt: Date.now()

        });


        saveAccounts(accounts);


        saveSession({

            email: email,

            loginAt: Date.now()

        });


        if (message) {

            message.textContent =

                "Account created successfully.";

        }


        updateLoginUI();

        renderListings();

        renderShowrooms();

    }


    function logoutUser() {

        clearSession();

        updateLoginUI();

        renderListings();

        renderShowrooms();

    }


    /* =========================================================
       CENTRAL COUNTRY SYSTEM
       ========================================================= */

    function normalizeCountryRecord(country) {

        if (!country) {

            return null;

        }


        /* -----------------------------------------
           CENTRAL DATABASE ARRAY RECORD

           Example:
           [
               "India",
               "IN",
               "IND",
               "+91",
               "🇮🇳"
           ]
           ----------------------------------------- */

        if (Array.isArray(country)) {

            return {

                name: safeText(country[0]),

                iso2: safeText(country[1])

                    .toUpperCase(),

                iso3: safeText(country[2])

                    .toUpperCase(),

                callingCode: safeText(country[3]),

                flag: safeText(country[4])

            };

        }


        /* -----------------------------------------
           OBJECT RECORD
           ----------------------------------------- */

        if (

            typeof country ===

            "object"

        ) {

            return country;

        }


        return null;

    }


    function getCountryDatabase() {

        const source =

            window.MARKETPLACE_COUNTRIES;


        if (

            Array.isArray(source) &&

            source.length > 0

        ) {

            return source

                .map(

                    normalizeCountryRecord

                )

                .filter(Boolean);

        }


        if (

            source &&

            typeof source === "object"

        ) {

            return Object.values(source)

                .map(

                    normalizeCountryRecord

                )

                .filter(Boolean);

        }


        return [];

    }


    function getCountryName(country) {

        if (!country) {

            return "";

        }


        if (Array.isArray(country)) {

            return safeText(

                country[0]

            );

        }


        return (

            country.name ||

            country.countryName ||

            country.label ||

            country.title ||

            country.country ||

            ""

        );

    }


    function getCountryCode(country) {

        if (!country) {

            return "";

        }


        if (Array.isArray(country)) {

            return safeText(

                country[1]

            ).toUpperCase();

        }


        return (

            country.iso2 ||

            country.ISO2 ||

            country.code2 ||

            country.alpha2 ||

            country.countryCode ||

            country.code ||

            ""

        );

    }


    function getCountryISO3(country) {

        if (!country) {

            return "";

        }


        if (Array.isArray(country)) {

            return safeText(

                country[2]

            ).toUpperCase();

        }


        return (

            country.iso3 ||

            country.ISO3 ||

            country.code3 ||

            country.alpha3 ||

            ""

        );

    }


    function getCountryCallingCode(country) {

        if (!country) {

            return "";

        }


        let value = "";


        if (Array.isArray(country)) {

            value = safeText(

                country[3]

            );

        } else {

            value =

                country.callingCode ||

                country.calling_code ||

                country.phoneCode ||

                country.phone_code ||

                country.dialCode ||

                country.dial_code ||

                country.calling ||

                "";

        }


        value = safeText(value).trim();


        if (

            value &&

            value.charAt(0) !== "+"

        ) {

            value = "+" + value;

        }


        return value;

    }


    function getCountryFlag(country) {

        if (!country) {

            return "🌍";

        }


        if (Array.isArray(country)) {

            return (

                safeText(country[4]) ||

                "🌍"

            );

        }


        if (country.flag) {

            return country.flag;

        }


        const code = getCountryCode(

            country

        );


        if (

            code &&

            code.length === 2

        ) {

            return code

                .toUpperCase()

                .split("")

                .map(function (letter) {

                    return String

                        .fromCodePoint(

                            127397 +

                            letter.charCodeAt(0)

                        );

                })

                .join("");

        }


        return "🌍";

    }


    function createCountryOption(country) {

        const name = safeText(

            getCountryName(country)

        ).trim();


        const iso2 = safeText(

            getCountryCode(country)

        )

            .trim()

            .toUpperCase();


        const iso3 = safeText(

            getCountryISO3(country)

        )

            .trim()

            .toUpperCase();


        const callingCode =

            getCountryCallingCode(

                country

            );


        const flag =

            getCountryFlag(country);


        if (!name) {

            return null;

        }


        const option =

            document.createElement(

                "option"

            );


        option.value =

            iso2 || name;


        const parts = [];


        if (flag) {

            parts.push(flag);

        }


        parts.push(name);


        if (iso2) {

            parts.push(

                "(" + iso2 + ")"

            );

        }


        if (iso3) {

            parts.push(

                iso3

            );

        }


        if (callingCode) {

            parts.push(

                callingCode

            );

        }


        option.textContent =

            parts.join(" ");


        option.dataset.countryName =

            name;


        option.dataset.countryIso2 =

            iso2;


        option.dataset.countryIso3 =

            iso3;


        option.dataset.callingCode =

            callingCode;


        option.dataset.countryFlag =

            flag;


        return option;

    }


    function populateCountrySelect(

        selectId,

        selectedValue

    ) {

        const select = byId(selectId);


        if (!select) {

            return false;

        }


        const database =

            getCountryDatabase();


        if (!database.length) {

            console.warn(

                "REGULAR MARKETPKES: central country database is empty."

            );

            return false;

        }


        const oldValue =

            selectedValue ||

            select.value;


        select.innerHTML = "";


        const placeholder =

            document.createElement(

                "option"

            );


        placeholder.value = "";


        placeholder.textContent =

            "🌍 Select Country";


        select.appendChild(

            placeholder

        );


        database.forEach(

            function (country) {

                const option =

                    createCountryOption(

                        country

                    );


                if (option) {

                    select.appendChild(

                        option

                    );

                }

            }

        );


        if (oldValue) {

            const matchingOption =

                Array.from(

                    select.options

                ).find(

                    function (option) {

                        return (

                            option.value ===

                                oldValue ||

                            option.dataset

                                .countryName ===

                                oldValue ||

                            option.dataset

                                .countryIso2 ===

                                String(

                                    oldValue

                                ).toUpperCase()

                        );

                    }

                );


            if (matchingOption) {

                select.value =

                    matchingOption.value;

            }

        }


        return (

            select.options.length > 1

        );

    }


    function populateRegularMarketplaceCountries() {

        const first =

            populateCountrySelect(

                "rmCountry"

            );


        const second =

            populateCountrySelect(

                "rmShowroomCountry"

            );


        const success =

            first || second;


        if (!success) {

            console.warn(

                "REGULAR MARKETPKES: Country database not ready. Retrying..."

            );

        }


        return success;

    }


    function startCountryRetry() {

        let attempts = 0;

        const maxAttempts = 40;


        function attempt() {

            attempts++;


            const success =

                populateRegularMarketplaceCountries();


            if (

                success ||

                attempts >= maxAttempts

            ) {

                if (!success) {

                    console.error(

                        "REGULAR MARKETPKES: Could not load countries. Check that ../marketplace-countries.js exists and loads before regular-marketpkes.js."

                    );

                }

                return;

            }


            setTimeout(

                attempt,

                250

            );

        }


        attempt();

    }


    function getSelectedCountry(

        selectId

    ) {

        const select = byId(selectId);


        if (

            !select ||

            !select.value

        ) {

            return null;

        }


        const option =

            select.options[

                select.selectedIndex

            ];


        if (!option) {

            return null;

        }


        return {

            name:

                option.dataset.countryName ||

                option.textContent,

            iso2:

                option.dataset.countryIso2 ||

                option.value,

            iso3:

                option.dataset.countryIso3 ||

                "",

            callingCode:

                option.dataset.callingCode ||

                "",

            flag:

                option.dataset.countryFlag ||

                ""

        };

    }


    /* =========================================================
       CATEGORY UI
       ========================================================= */

    function populateListingCategories() {

        const typeSelect = byId(

            "rmListingType"

        );

        const categorySelect = byId(

            "rmCategory"

        );


        if (!typeSelect || !categorySelect) {

            return;

        }


        function updateCategories() {

            const type =

                typeSelect.value;


            categorySelect.innerHTML = "";


            const placeholder =

                document.createElement(

                    "option"

                );


            placeholder.value = "";

            placeholder.textContent =

                "Select Category";


            categorySelect.appendChild(

                placeholder

            );


            if (

                !type ||

                !CATEGORY_DATA[type]

            ) {

                return;

            }


            CATEGORY_DATA[type].forEach(

                function (category) {

                    const option =

                        document.createElement(

                            "option"

                        );


                    option.value =

                        category;


                    option.textContent =

                        category;


                    categorySelect.appendChild(

                        option

                    );

                }

            );

        }


        typeSelect.addEventListener(

            "change",

            updateCategories

        );


        updateCategories();

    }


    function populateConditionOptions() {

        const select = byId(

            "rmCondition"

        );


        if (!select) {

            return;

        }


        select.innerHTML = "";


        const placeholder =

            document.createElement(

                "option"

            );


        placeholder.value = "";

        placeholder.textContent =

            "Select Condition";


        select.appendChild(

            placeholder

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

    }


    /* =========================================================
       MEDIA HELPERS
       ========================================================= */

    function fileToDataURL(file) {

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

                                "File could not be read."

                            )

                        );

                    };


                reader.readAsDataURL(

                    file

                );

            }

        );

    }


    function validateMediaFile(

        file,

        type

    ) {

        if (!file) {

            return true;

        }


        if (

            type === "image" &&

            file.size >

                CONFIG.maxImageSize

        ) {

            alert(

                "Image is too large. Maximum size is 8 MB."

            );

            return false;

        }


        if (

            type === "video" &&

            file.size >

                CONFIG.maxVideoSize

        ) {

            alert(

                "Video is too large. Maximum size is 40 MB."

            );

            return false;

        }


        return true;

    }


    /* =========================================================
       LISTING STORAGE
       ========================================================= */

    function getAllListings() {

        const listings =

            readStorage(

                CONFIG.storage.listings,

                []

            );


        return Array.isArray(listings)

            ? listings

            : [];

    }


    function saveAllListings(

        listings

    ) {

        return writeStorage(

            CONFIG.storage.listings,

            listings

        );

    }


    function getMyListings() {

        const account =

            getCurrentAccount();


        if (!account) {

            return [];

        }


        return getAllListings()

            .filter(

                function (listing) {

                    return (

                        listing.ownerEmail ===

                        account.email

                    );

                }

            );

    }


    /* =========================================================
       LISTING EDIT STATE
       ========================================================= */

    let editingListingId = null;


    function resetListingForm() {

        const ids = [

            "rmListingType",

            "rmCategory",

            "rmCondition",

            "rmTitle",

            "rmPrice",

            "rmCountry",

            "rmState",

            "rmPin",

            "rmEmail",

            "rmDescription",

            "rmImage",

            "rmVideo"

        ];


        ids.forEach(

            function (id) {

                const element =

                    byId(id);


                if (!element) {

                    return;

                }


                if (

                    element.tagName ===

                    "SELECT"

                ) {

                    element.selectedIndex =

                        0;

                } else {

                    element.value = "";

                }

            }

        );


        populateListingCategories();

        populateConditionOptions();

        populateRegularMarketplaceCountries();


        editingListingId = null;


        const cancelButton = byId(

            "rmCancelEditBtn"

        );


        if (cancelButton) {

            cancelButton.classList.add(

                "rm-hidden"

            );

        }


        const button = byId(

            "rmSaveListingBtn"

        );


        if (button) {

            button.textContent =

                "Save Listing";

        }

    }


    function loadListingForEdit(

        listing

    ) {

        if (!listing) {

            return;

        }


        editingListingId =

            listing.id;


        const typeSelect = byId(

            "rmListingType"

        );


        if (typeSelect) {

            typeSelect.value =

                listing.type || "";

            typeSelect.dispatchEvent(

                new Event("change")

            );

        }


        const category = byId(

            "rmCategory"

        );


        if (category) {

            category.value =

                listing.category || "";

        }


        const condition = byId(

            "rmCondition"

        );


        if (condition) {

            condition.value =

                listing.condition || "";

        }


        const fields = {

            rmTitle:

                listing.title,

            rmPrice:

                listing.price,

            rmState:

                listing.state,

            rmPin:

                listing.pin,

            rmEmail:

                listing.email,

            rmDescription:

                listing.description

        };


        Object.keys(fields).forEach(

            function (id) {

                const element =

                    byId(id);


                if (element) {

                    element.value =

                        fields[id] || "";

                }

            }

        );


        populateRegularMarketplaceCountries();


        const countrySelect = byId(

            "rmCountry"

        );


        if (countrySelect) {

            countrySelect.value =

                listing.countryCode ||

                listing.countryName ||

                "";

        }


        const cancelButton = byId(

            "rmCancelEditBtn"

        );


        if (cancelButton) {

            cancelButton.classList.remove(

                "rm-hidden"

            );

        }


        const saveButton = byId(

            "rmSaveListingBtn"

        );


        if (saveButton) {

            saveButton.textContent =

                "Update Listing";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    async function saveListing() {

        const account =

            getCurrentAccount();


        if (!account) {

            alert(

                "Please login first."

            );

            return;

        }


        const type = byId(

            "rmListingType"

        );

        const category = byId(

            "rmCategory"

        );

        const condition = byId(

            "rmCondition"

        );

        const title = byId(

            "rmTitle"

        );

        const price = byId(

            "rmPrice"

        );

        const state = byId(

            "rmState"

        );

        const pin = byId(

            "rmPin"

        );

        const email = byId(

            "rmEmail"

        );

        const description = byId(

            "rmDescription"

        );

        const image = byId(

            "rmImage"

        );

        const video = byId(

            "rmVideo"

        );


        if (

            !type ||

            !type.value

        ) {

            alert(

                "Please select listing type."

            );

            return;

        }


        if (

            !category ||

            !category.value

        ) {

            alert(

                "Please select category."

            );

            return;

        }


        if (

            !title ||

            !title.value.trim()

        ) {

            alert(

                "Please enter listing title."

            );

            return;

        }


        const selectedCountry =

            getSelectedCountry(

                "rmCountry"

            );


        if (!selectedCountry) {

            alert(

                "Please select country."

            );

            return;

        }


        const imageFile =

            image && image.files

                ? image.files[0]

                : null;


        const videoFile =

            video && video.files

                ? video.files[0]

                : null;


        if (

            !validateMediaFile(

                imageFile,

                "image"

            )

        ) {

            return;

        }


        if (

            !validateMediaFile(

                videoFile,

                "video"

            )

        ) {

            return;

        }


        const imageData =

            await fileToDataURL(

                imageFile

            );


        const videoData =

            await fileToDataURL(

                videoFile

            );


        const listings =

            getAllListings();


        if (editingListingId) {

            const index =

                listings.findIndex(

                    function (item) {

                        return (

                            item.id ===

                            editingListingId &&

                            item.ownerEmail ===

                            account.email

                        );

                    }

                );


            if (index === -1) {

                alert(

                    "Listing not found."

                );

                return;

            }


            const old =

                listings[index];


            listings[index] = {

                ...old,

                type:

                    type.value,

                category:

                    category.value,

                condition:

                    condition.value,

                title:

                    title.value.trim(),

                price:

                    price.value,

                countryName:

                    selectedCountry.name,

                countryCode:

                    selectedCountry.iso2,

                countryISO3:

                    selectedCountry.iso3,

                callingCode:

                    selectedCountry.callingCode,

                countryFlag:

                    selectedCountry.flag,

                state:

                    state

                        ? state.value.trim()

                        : "",

                pin:

                    pin

                        ? pin.value.trim()

                        : "",

                email:

                    email

                        ? email.value.trim()

                        : account.email,

                description:

                    description

                        ? description.value.trim()

                        : "",

                updatedAt:

                    Date.now()

            };


            if (imageData) {

                listings[index].image =

                    imageData;

            }


            if (videoData) {

                listings[index].video =

                    videoData;

            }


        } else {

            listings.push({

                id:

                    generateId(

                        "listing"

                    ),

                ownerEmail:

                    account.email,

                type:

                    type.value,

                category:

                    category.value,

                condition:

                    condition.value,

                title:

                    title.value.trim(),

                price:

                    price.value,

                countryName:

                    selectedCountry.name,

                countryCode:

                    selectedCountry.iso2,

                countryISO3:

                    selectedCountry.iso3,

                callingCode:

                    selectedCountry.callingCode,

                countryFlag:

                    selectedCountry.flag,

                state:

                    state

                        ? state.value.trim()

                        : "",

                pin:

                    pin

                        ? pin.value.trim()

                        : "",

                email:

                    email

                        ? email.value.trim()

                        : account.email,

                description:

                    description

                        ? description.value.trim()

                        : "",

                image:

                    imageData,

                video:

                    videoData,

                createdAt:

                    Date.now(),

                updatedAt:

                    Date.now()

            });

        }


        saveAllListings(

            listings

        );


        alert(

            editingListingId

                ? "Listing updated successfully."

                : "Listing saved successfully."

        );


        resetListingForm();

        renderListings();

    }


    function deleteListing(id) {

        const account =

            getCurrentAccount();


        if (!account) {

            return;

        }


        const confirmed =

            confirm(

                "Delete this listing?"

            );


        if (!confirmed) {

            return;

        }


        const listings =

            getAllListings();


        const filtered =

            listings.filter(

                function (listing) {

                    return ! (

                        listing.id === id &&

                        listing.ownerEmail ===

                            account.email

                    );

                }

            );


        saveAllListings(

            filtered

        );


        renderListings();

    }


    /* =========================================================
       LISTING RENDER
       ========================================================= */

    function renderListings() {

        const container = byId(

            "rmListings"

        );


        if (!container) {

            return;

        }


        const listings =

            getMyListings();


        if (!listings.length) {

            container.innerHTML =

                '<p class="rm-muted">' +

                "No listings yet." +

                "</p>";

            return;

        }


        container.innerHTML = "";


        listings

            .slice()

            .reverse()

            .forEach(

                function (listing) {

                    const card =

                        document.createElement(

                            "div"

                        );


                    card.className =

                        "rm-listing";


                    const title =

                        escapeHTML(

                            listing.title

                        );


                    const price =

                        escapeHTML(

                            listing.price

                        );


                    const country =

                        escapeHTML(

                            (

                                listing.countryFlag ||

                                "🌍"

                            ) +

                            " " +

                            (

                                listing.countryName ||

                                ""

                            ) +

                            (

                                listing.countryCode

                                    ? " (" +

                                      listing.countryCode +

                                      ")"

                                    : ""

                            )

                        );


                    const location =

                        escapeHTML(

                            [

                                listing.state,

                                listing.pin

                            ]

                                .filter(Boolean)

                                .join(", ")

                        );


                    card.innerHTML =

                        "<h3>" +

                        title +

                        "</h3>" +

                        '<div class="rm-price">' +

                        (

                            price

                                ? "$" +

                                  price

                                : "Price on request"

                        ) +

                        "</div>" +

                        "<p>" +

                        "<strong>Type:</strong> " +

                        escapeHTML(

                            listing.type

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Category:</strong> " +

                        escapeHTML(

                            listing.category

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Condition:</strong> " +

                        escapeHTML(

                            listing.condition

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Country:</strong> " +

                        country +

                        "</p>" +

                        (

                            location

                                ? "<p>" +

                                  "<strong>Location:</strong> " +

                                  location +

                                  "</p>"

                                : ""

                        ) +

                        (

                            listing.description

                                ? "<p>" +

                                  escapeHTML(

                                      listing.description

                                  ) +

                                  "</p>"

                                : ""

                        );


                    if (listing.image) {

                        const image =

                            document.createElement(

                                "img"

                            );


                        image.src =

                            listing.image;


                        image.alt =

                            title;


                        card.appendChild(

                            image

                        );

                    }


                    if (listing.video) {

                        const video =

                            document.createElement(

                                "video"

                            );


                        video.src =

                            listing.video;


                        video.controls =

                            true;


                        card.appendChild(

                            video

                        );

                    }


                    const editButton =

                        document.createElement(

                            "button"

                        );


                    editButton.className =

                        "rm-btn";


                    editButton.textContent =

                        "Edit";


                    editButton.type =

                        "button";


                    editButton.addEventListener(

                        "click",

                        function () {

                            loadListingForEdit(

                                listing

                            );

                        }

                    );


                    const deleteButton =

                        document.createElement(

                            "button"

                        );


                    deleteButton.className =

                        "rm-btn rm-btn-danger";


                    deleteButton.textContent =

                        "Delete";


                    deleteButton.type =

                        "button";


                    deleteButton.addEventListener(

                        "click",

                        function () {

                            deleteListing(

                                listing.id

                            );

                        }

                    );


                    card.appendChild(

                        editButton

                    );


                    card.appendChild(

                        deleteButton

                    );


                    container.appendChild(

                        card

                    );

                }

            );

    }


    /* =========================================================
       SHOWROOM STORAGE
       ========================================================= */

    function getAllShowrooms() {

        const showrooms =

            readStorage(

                CONFIG.storage.showrooms,

                []

            );


        return Array.isArray(showrooms)

            ? showrooms

            : [];

    }


    function saveAllShowrooms(

        showrooms

    ) {

        return writeStorage(

            CONFIG.storage.showrooms,

            showrooms

        );

    }


    function getMyShowrooms() {

        const account =

            getCurrentAccount();


        if (!account) {

            return [];

        }


        return getAllShowrooms()

            .filter(

                function (showroom) {

                    return (

                        showroom.ownerEmail ===

                        account.email

                    );

                }

            );

    }


    /* =========================================================
       SHOWROOM EDIT STATE
       ========================================================= */

    let editingShowroomId = null;


    function resetShowroomForm() {

        const ids = [

            "rmShowroomName",

            "rmShowroomCountry",

            "rmShowroomState",

            "rmShowroomDistrict",

            "rmShowroomTaluka",

            "rmShowroomPin",

            "rmShowroomCategory",

            "rmShowroomEmail",

            "rmShowroomDescription",

            "rmShowroomImage",

            "rmShowroomVideo",

            "rmShowroomReach"

        ];


        ids.forEach(

            function (id) {

                const element =

                    byId(id);


                if (!element) {

                    return;

                }


                if (

                    element.tagName ===

                    "SELECT"

                ) {

                    element.selectedIndex =

                        0;

                } else {

                    element.value = "";

                }

            }

        );


        populateRegularMarketplaceCountries();


        editingShowroomId = null;


        const cancelButton = byId(

            "rmCancelShowroomEditBtn"

        );


        if (cancelButton) {

            cancelButton.classList.add(

                "rm-hidden"

            );

        }


        const button = byId(

            "rmSaveShowroomBtn"

        );


        if (button) {

            button.textContent =

                "Save Advertisement";

        }

    }


    function loadShowroomForEdit(

        showroom

    ) {

        if (!showroom) {

            return;

        }


        editingShowroomId =

            showroom.id;


        const fields = {

            rmShowroomName:

                showroom.name,

            rmShowroomState:

                showroom.state,

            rmShowroomDistrict:

                showroom.district,

            rmShowroomTaluka:

                showroom.taluka,

            rmShowroomPin:

                showroom.pin,

            rmShowroomEmail:

                showroom.email,

            rmShowroomDescription:

                showroom.description

        };


        Object.keys(fields).forEach(

            function (id) {

                const element =

                    byId(id);


                if (element) {

                    element.value =

                        fields[id] || "";

                }

            }

        );


        const category = byId(

            "rmShowroomCategory"

        );


        if (category) {

            category.value =

                showroom.category || "";

        }


        const reach = byId(

            "rmShowroomReach"

        );


        if (reach) {

            reach.value =

                showroom.reach ||

                "global";

        }


        populateRegularMarketplaceCountries();


        const country = byId(

            "rmShowroomCountry"

        );


        if (country) {

            country.value =

                showroom.countryCode ||

                showroom.countryName ||

                "";

        }


        const cancelButton = byId(

            "rmCancelShowroomEditBtn"

        );


        if (cancelButton) {

            cancelButton.classList.remove(

                "rm-hidden"

            );

        }


        const saveButton = byId(

            "rmSaveShowroomBtn"

        );


        if (saveButton) {

            saveButton.textContent =

                "Update Advertisement";

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    async function saveShowroom() {

        const account =

            getCurrentAccount();


        if (!account) {

            alert(

                "Please login first."

            );

            return;

        }


        const name = byId(

            "rmShowroomName"

        );

        const country =

            getSelectedCountry(

                "rmShowroomCountry"

            );


        const state = byId(

            "rmShowroomState"

        );

        const district = byId(

            "rmShowroomDistrict"

        );

        const taluka = byId(

            "rmShowroomTaluka"

        );

        const pin = byId(

            "rmShowroomPin"

        );

        const category = byId(

            "rmShowroomCategory"

        );

        const email = byId(

            "rmShowroomEmail"

        );

        const description = byId(

            "rmShowroomDescription"

        );

        const image = byId(

            "rmShowroomImage"

        );

        const video = byId(

            "rmShowroomVideo"

        );

        const reach = byId(

            "rmShowroomReach"

        );


        if (

            !name ||

            !name.value.trim()

        ) {

            alert(

                "Please enter business / showroom name."

            );

            return;

        }


        if (!country) {

            alert(

                "Please select country."

            );

            return;

        }


        const imageFile =

            image && image.files

                ? image.files[0]

                : null;


        const videoFile =

            video && video.files

                ? video.files[0]

                : null;


        if (

            !validateMediaFile(

                imageFile,

                "image"

            )

        ) {

            return;

        }


        if (

            !validateMediaFile(

                videoFile,

                "video"

            )

        ) {

            return;

        }


        const imageData =

            await fileToDataURL(

                imageFile

            );


        const videoData =

            await fileToDataURL(

                videoFile

            );


        const showrooms =

            getAllShowrooms();


        if (editingShowroomId) {

            const index =

                showrooms.findIndex(

                    function (item) {

                        return (

                            item.id ===

                            editingShowroomId &&

                            item.ownerEmail ===

                            account.email

                        );

                    }

                );


            if (index === -1) {

                alert(

                    "Advertisement not found."

                );

                return;

            }


            const old =

                showrooms[index];


            showrooms[index] = {

                ...old,

                name:

                    name.value.trim(),

                countryName:

                    country.name,

                countryCode:

                    country.iso2,

                countryISO3:

                    country.iso3,

                callingCode:

                    country.callingCode,

                countryFlag:

                    country.flag,

                state:

                    state

                        ? state.value.trim()

                        : "",

                district:

                    district

                        ? district.value.trim()

                        : "",

                taluka:

                    taluka

                        ? taluka.value.trim()

                        : "",

                pin:

                    pin

                        ? pin.value.trim()

                        : "",

                category:

                    category

                        ? category.value

                        : "",

                email:

                    email

                        ? email.value.trim()

                        : account.email,

                description:

                    description

                        ? description.value.trim()

                        : "",

                reach:

                    reach

                        ? reach.value

                        : "global",

                updatedAt:

                    Date.now()

            };


            if (imageData) {

                showrooms[index].image =

                    imageData;

            }


            if (videoData) {

                showrooms[index].video =

                    videoData;

            }

        } else {

            showrooms.push({

                id:

                    generateId(

                        "showroom"

                    ),

                ownerEmail:

                    account.email,

                name:

                    name.value.trim(),

                countryName:

                    country.name,

                countryCode:

                    country.iso2,

                countryISO3:

                    country.iso3,

                callingCode:

                    country.callingCode,

                countryFlag:

                    country.flag,

                state:

                    state

                        ? state.value.trim()

                        : "",

                district:

                    district

                        ? district.value.trim()

                        : "",

                taluka:

                    taluka

                        ? taluka.value.trim()

                        : "",

                pin:

                    pin

                        ? pin.value.trim()

                        : "",

                category:

                    category

                        ? category.value

                        : "",

                email:

                    email

                        ? email.value.trim()

                        : account.email,

                description:

                    description

                        ? description.value.trim()

                        : "",

                reach:

                    reach

                        ? reach.value

                        : "global",

                price:

                    CONFIG.showroomPrice,

                currency:

                    CONFIG.currency,

                paid:

                    false,

                image:

                    imageData,

                video:

                    videoData,

                createdAt:

                    Date.now(),

                updatedAt:

                    Date.now()

            });

        }


        saveAllShowrooms(

            showrooms

        );


        alert(

            editingShowroomId

                ? "Advertisement updated successfully."

                : "Advertisement saved successfully."

        );


        resetShowroomForm();

        renderShowrooms();

    }


    function deleteShowroom(id) {

        const account =

            getCurrentAccount();


        if (!account) {

            return;

        }


        const confirmed =

            confirm(

                "Delete this advertisement?"

            );


        if (!confirmed) {

            return;

        }


        const showrooms =

            getAllShowrooms();


        const filtered =

            showrooms.filter(

                function (showroom) {

                    return ! (

                        showroom.id === id &&

                        showroom.ownerEmail ===

                            account.email

                    );

                }

            );


        saveAllShowrooms(

            filtered

        );


        renderShowrooms();

    }


    /* =========================================================
       SHOWROOM RENDER
       ========================================================= */

    function renderShowrooms() {

        const container = byId(

            "rmShowrooms"

        );


        if (!container) {

            return;

        }


        const showrooms =

            getMyShowrooms();


        if (!showrooms.length) {

            container.innerHTML =

                '<p class="rm-muted">' +

                "No advertisements yet." +

                "</p>";

            return;

        }


        container.innerHTML = "";


        showrooms

            .slice()

            .reverse()

            .forEach(

                function (showroom) {

                    const card =

                        document.createElement(

                            "div"

                        );


                    card.className =

                        "rm-showroom";


                    const reachText =

                        showroom.reach ===

                        "global"

                            ? "Global Ad / All Countries"

                            : showroom.reach ===

                              "international"

                                ? "International"

                                : "Local";


                    card.innerHTML =

                        "<h3>" +

                        escapeHTML(

                            showroom.name

                        ) +

                        "</h3>" +

                        "<p>" +

                        "<strong>Country:</strong> " +

                        escapeHTML(

                            (

                                showroom.countryFlag ||

                                "🌍"

                            ) +

                            " " +

                            (

                                showroom.countryName ||

                                ""

                            ) +

                            (

                                showroom.countryCode

                                    ? " (" +

                                      showroom.countryCode +

                                      ")"

                                    : ""

                            )

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Business:</strong> " +

                        escapeHTML(

                            showroom.category

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Reach:</strong> " +

                        escapeHTML(

                            reachText

                        ) +

                        "</p>" +

                        "<p>" +

                        "<strong>Advertisement:</strong> $10 USD</p>" +

                        (

                            showroom.description

                                ? "<p>" +

                                  escapeHTML(

                                      showroom.description

                                  ) +

                                  "</p>"

                                : ""

                        );


                    if (showroom.image) {

                        const image =

                            document.createElement(

                                "img"

                            );


                        image.src =

                            showroom.image;


                        image.alt =

                            showroom.name;


                        card.appendChild(

                            image

                        );

                    }


                    if (showroom.video) {

                        const video =

                            document.createElement(

                                "video"

                            );


                        video.src =

                            showroom.video;


                        video.controls =

                            true;


                        card.appendChild(

                            video

                        );

                    }


                    const editButton =

                        document.createElement(

                            "button"

                        );


                    editButton.type =

                        "button";


                    editButton.className =

                        "rm-btn";


                    editButton.textContent =

                        "Edit";


                    editButton.addEventListener(

                        "click",

                        function () {

                            loadShowroomForEdit(

                                showroom

                            );

                        }

                    );


                    const deleteButton =

                        document.createElement(

                            "button"

                        );


                    deleteButton.type =

                        "button";


                    deleteButton.className =

                        "rm-btn rm-btn-danger";


                    deleteButton.textContent =

                        "Delete";


                    deleteButton.addEventListener(

                        "click",

                        function () {

                            deleteShowroom(

                                showroom.id

                            );

                        }

                    );


                    card.appendChild(

                        editButton

                    );


                    card.appendChild(

                        deleteButton

                    );


                    container.appendChild(

                        card

                    );

                }

            );

    }


    /* =========================================================
       $10 USD PAYMENT PROTOTYPE
       ========================================================= */

    function payShowroomAdvertisement() {

        const account =

            getCurrentAccount();


        if (!account) {

            alert(

                "Please login first."

            );

            return;

        }


        alert(

            "Showroom / Business Advertisement price is $10 USD.\n\nPayment integration can be connected separately."

        );

    }


    /* =========================================================
       EVENT BINDING
       ========================================================= */

    function bindEvents() {

        const loginButton = byId(

            "rmLoginBtn"

        );


        if (loginButton) {

            loginButton.addEventListener(

                "click",

                loginUser

            );

        }


        const registerButton = byId(

            "rmRegisterBtn"

        );


        if (registerButton) {

            registerButton.addEventListener(

                "click",

                registerUser

            );

        }


        const logoutButton = byId(

            "rmLogoutBtn"

        );


        if (logoutButton) {

            logoutButton.addEventListener(

                "click",

                logoutUser

            );

        }


        const saveListingButton = byId(

            "rmSaveListingBtn"

        );


        if (saveListingButton) {

            saveListingButton.addEventListener(

                "click",

                saveListing

            );

        }


        const cancelListingButton =

            byId(

                "rmCancelEditBtn"

            );


        if (cancelListingButton) {

            cancelListingButton.addEventListener(

                "click",

                resetListingForm

            );

        }


        const saveShowroomButton =

            byId(

                "rmSaveShowroomBtn"

            );


        if (saveShowroomButton) {

            saveShowroomButton.addEventListener(

                "click",

                saveShowroom

            );

        }


        const cancelShowroomButton =

            byId(

                "rmCancelShowroomEditBtn"

            );


        if (cancelShowroomButton) {

            cancelShowroomButton.addEventListener(

                "click",

                resetShowroomForm

            );

        }


        const paymentButton = byId(

            "rmPayShowroomBtn"

        );


        if (paymentButton) {

            paymentButton.addEventListener(

                "click",

                payShowroomAdvertisement

            );

        }

    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function init() {

        console.log(

            "ALON HISTORYVERSE 24 — Regular Marketpkes v" +

            CONFIG.version +

            " starting..."

        );


        populateListingCategories();

        populateConditionOptions();


        /*
         * Country database is loaded BEFORE
         * this JS from:
         *
         * ../marketplace-countries.js
         */

        startCountryRetry();


        bindEvents();

        updateLoginUI();

        renderListings();

        renderShowrooms();


        console.log(

            "REGULAR MARKETPKES: initialized."

        );

    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.ALON_REGULAR_MARKETPKES = {

        version:

            CONFIG.version,

        populateCountries:

            populateRegularMarketplaceCountries,

        populateCountrySelect:

            populateCountrySelect,

        renderListings:

            renderListings,

        renderShowrooms:

            renderShowrooms,

        login:

            loginUser,

        logout:

            logoutUser

    };


    /* =========================================================
       START
       ========================================================= */

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


    window.addEventListener(

        "load",

        function () {

            startCountryRetry();

        }

    );


})();