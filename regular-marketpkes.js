/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE
   ---------------------------------------------------------
   Version: 24.5 SAFE REGULAR MARKETPLACE
   Creator: Baba Thecno Guru

   FEATURES
   • Item / Property / Vehicle
   • New / Used / Refurbished
   • World Country Database
   • Flag + Country + ISO + Calling Code
   • Login + Agreement
   • Profile + Logout
   • Save / Edit / Delete Listings
   • Image + Optional Video
   • Business / Showroom Advertisement
   • Global / Worldwide Reach
   • International Reach
   • $10 USD Showroom Advertisement
   • LocalStorage Persistence

   IMPORTANT
   • REGULAR MARKETPLACE ONLY
   • DOES NOT MODIFY GLOBAL MARKETPLACE
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const CONFIG = {
        version: "24.5",
        currency: "USD",
        showroomPrice: 10,

        maxImageSize: 8 * 1024 * 1024,
        maxVideoSize: 20 * 1024 * 1024,

        listingsKey:
            "alon_historyverse_regular_marketplace_listings",

        showroomsKey:
            "alon_historyverse_regular_marketplace_showrooms",

        accountKey:
            "alon_historyverse_regular_marketplace_account",

        sessionKey:
            "alon_historyverse_regular_marketplace_session"
    };


    /* =====================================================
       CATEGORY DATABASE
       ===================================================== */

    const CATEGORY_DATA = {

        item: [
            "Electronics",
            "Mobile",
            "Computer",
            "Furniture",
            "Clothing",
            "Footwear",
            "Home",
            "Appliances",
            "Kitchen",
            "Books",
            "Sports",
            "Toys",
            "Tools",
            "Machinery",
            "Jewellery",
            "Musical Instruments",
            "Agriculture",
            "Office",
            "Collectibles",
            "Other Item"
        ],

        property: [
            "House",
            "Flat / Apartment",
            "Bungalow",
            "Villa",
            "Plot",
            "Land",
            "Farm",
            "Shop",
            "Office",
            "Warehouse",
            "Factory",
            "Commercial Property",
            "Hotel Property",
            "Rental Property",
            "Other Property"
        ],

        vehicle: [
            "Car",
            "SUV / 4x4",
            "Motorcycle / Bike",
            "Scooter",
            "Electric Vehicle",
            "Truck",
            "Trailer",
            "Tractor",
            "JCB / Excavator",
            "Bus",
            "Van",
            "Ambulance",
            "Taxi",
            "Commercial Vehicle",
            "Three Wheeler",
            "Farm Vehicle",
            "Construction Vehicle",
            "Boat / Water Vehicle",
            "Other Vehicle"
        ]
    };


    const CONDITION_DATA = [
        "New",
        "Used",
        "Refurbished",
        "Not Applicable"
    ];


    /* =====================================================
       SHORT DOM HELPER
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       STORAGE HELPERS
       ===================================================== */

    function loadJSON(key, fallback) {

        try {

            const raw = localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);

            return parsed;

        } catch (error) {

            console.error(
                "ALON Regular Marketplace storage read error:",
                error
            );

            return fallback;
        }
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
                "ALON Regular Marketplace storage write error:",
                error
            );

            return false;
        }
    }


    function generateID(prefix) {

        return (
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }


    function nowISO() {

        return new Date().toISOString();
    }


    /* =====================================================
       LOGIN / SESSION
       ===================================================== */

    function getAccount() {

        return loadJSON(
            CONFIG.accountKey,
            null
        );
    }


    function getSession() {

        return loadJSON(
            CONFIG.sessionKey,
            null
        );
    }


    function isLoggedIn() {

        const session = getSession();

        return !!(
            session &&
            session.loggedIn === true &&
            session.email
        );
    }


    function getCurrentUserEmail() {

        const session = getSession();

        if (
            session &&
            session.loggedIn === true &&
            session.email
        ) {
            return String(session.email)
                .trim()
                .toLowerCase();
        }

        return "";
    }


    /* =====================================================
       LOGIN UI
       ===================================================== */

    function updateLoginUI() {

        const loginBox =
            $("rmLoginBox");

        const profileBox =
            $("rmProfileBox");

        const profileEmail =
            $("rmProfileEmail");

        const session =
            getSession();

        const loggedIn = !!(
            session &&
            session.loggedIn === true &&
            session.email
        );


        if (loginBox) {

            loginBox.style.display =
                loggedIn ? "none" : "";
        }


        if (profileBox) {

            profileBox.style.display =
                loggedIn ? "" : "none";
        }


        if (
            loggedIn &&
            profileEmail
        ) {

            profileEmail.textContent =
                session.email;
        }
    }


    function login() {

        const name =
            $("rmLoginName")?.value
                ?.trim() || "";

        const email =
            $("rmLoginEmail")?.value
                ?.trim()
                .toLowerCase() || "";

        const password =
            $("rmLoginPassword")?.value || "";

        const agreement =
            $("rmAgreement");


        const status =
            $("rmLoginStatus");


        if (!name) {

            showStatus(
                status,
                "Please enter your name.",
                true
            );

            return false;
        }


        if (!email) {

            showStatus(
                status,
                "Please enter your email.",
                true
            );

            return false;
        }


        if (!isValidEmail(email)) {

            showStatus(
                status,
                "Please enter a valid email address.",
                true
            );

            return false;
        }


        if (!password) {

            showStatus(
                status,
                "Please enter your password.",
                true
            );

            return false;
        }


        if (!agreement || !agreement.checked) {

            showStatus(
                status,
                "Please accept the Marketplace Agreement before login.",
                true
            );

            return false;
        }


        const account = {

            name: name,

            email: email,

            password: password,

            createdAt:
                getAccount()?.createdAt ||
                nowISO(),

            updatedAt:
                nowISO()
        };


        if (!saveJSON(
            CONFIG.accountKey,
            account
        )) {

            showStatus(
                status,
                "Unable to save account on this device.",
                true
            );

            return false;
        }


        const session = {

            loggedIn: true,

            name: name,

            email: email,

            loginAt: nowISO()
        };


        saveJSON(
            CONFIG.sessionKey,
            session
        );


        updateLoginUI();


        showStatus(
            status,
            "Login successful.",
            false
        );


        renderListings();
        renderShowrooms();


        return true;
    }


    function logout() {

        localStorage.removeItem(
            CONFIG.sessionKey
        );


        updateLoginUI();


        showStatus(
            $("rmLoginStatus"),
            "You have been logged out.",
            false
        );


        renderListings();
        renderShowrooms();
    }


    function requireLogin(statusElement) {

        if (!isLoggedIn()) {

            showStatus(
                statusElement,
                "Please login first.",
                true
            );

            return false;
        }

        return true;
    }


    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =====================================================
       STATUS MESSAGE
       ===================================================== */

    function showStatus(
        element,
        message,
        isError
    ) {

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.style.display =
            message ? "" : "none";

        if (isError) {

            element.setAttribute(
                "data-status",
                "error"
            );

        } else {

            element.setAttribute(
                "data-status",
                "success"
            );
        }
    }


    /* =====================================================
       COUNTRY DATABASE
       CENTRAL FILE SUPPORT
       ===================================================== */

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

            if (
                Array.isArray(
                    sources[i]
                ) &&
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


        return String(

            country.name ||

            country.countryName ||

            country.label ||

            country.title ||

            country.country ||

            ""

        ).trim();
    }


    function getCountryCode(country) {

        if (!country) {
            return "";
        }


        return String(

            country.iso2 ||

            country.ISO2 ||

            country.code2 ||

            country.alpha2 ||

            country.countryCode ||

            country.code ||

            ""

        )
        .trim()
        .toUpperCase();
    }


    function getCountryISO3(country) {

        if (!country) {
            return "";
        }


        return String(

            country.iso3 ||

            country.ISO3 ||

            country.code3 ||

            country.alpha3 ||

            ""

        )
        .trim()
        .toUpperCase();
    }


    function getCountryCallingCode(country) {

        if (!country) {
            return "";
        }


        const value =

            country.callingCode ||

            country.calling_code ||

            country.phoneCode ||

            country.phone_code ||

            country.dialCode ||

            country.dial_code ||

            country.calling ||

            "";


        if (!value) {
            return "";
        }


        const text =
            String(value).trim();


        if (
            text.charAt(0) === "+"
        ) {

            return text;
        }


        return "+" + text;
    }


    function getCountryFlag(country) {

        if (!country) {
            return "";
        }


        if (country.flag) {

            return String(
                country.flag
            ).trim();
        }


        const code =
            getCountryCode(country);


        if (
            code.length === 2
        ) {

            return code
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


        return "";
    }


    function createCountryOption(
        country
    ) {

        const option =
            document.createElement(
                "option"
            );


        const name =
            getCountryName(country);

        const code =
            getCountryCode(country);

        const iso3 =
            getCountryISO3(country);

        const callingCode =
            getCountryCallingCode(country);

        const flag =
            getCountryFlag(country);


        option.value =
            code || name;


        option.textContent = [

            flag,

            name,

            code
                ? "(" + code + ")"
                : "",

            iso3
                ? "[" + iso3 + "]"
                : "",

            callingCode

        ]
        .filter(Boolean)
        .join(" ");


        option.dataset.countryName =
            name;

        option.dataset.countryCode =
            code;

        option.dataset.countryISO3 =
            iso3;

        option.dataset.callingCode =
            callingCode;

        option.dataset.flag =
            flag;


        return option;
    }


    function populateCountrySelect(
        selectId,
        selectedValue
    ) {

        const select =
            $(selectId);


        if (!select) {
            return false;
        }


        const database =
            getCountryDatabase();


        if (
            !database.length
        ) {

            return false;
        }


        const current =
            selectedValue ||
            select.value ||
            "";


        select.innerHTML = "";


        const firstOption =
            document.createElement(
                "option"
            );


        firstOption.value = "";

        firstOption.textContent =
            "Select Country";


        select.appendChild(
            firstOption
        );


        database.forEach(
            function (country) {

                if (!country) {
                    return;
                }


                const option =
                    createCountryOption(
                        country
                    );


                select.appendChild(
                    option
                );
            }
        );


        if (current) {

            const normalized =
                String(current)
                    .trim()
                    .toUpperCase();


            const matching =
                Array.from(
                    select.options
                ).find(
                    function (option) {

                        return (

                            String(
                                option.value
                            )
                            .toUpperCase() ===
                            normalized

                        ) ||

                        String(
                            option.dataset.countryName ||
                            ""
                        )
                        .toUpperCase() ===
                        normalized;
                    }
                );


            if (matching) {

                select.value =
                    matching.value;
            }
        }


        return (
            select.options.length > 1
        );
    }


    /* =====================================================
       CENTRAL COUNTRY HELPER
       ===================================================== */

    function populateCountryUsingCentralHelper(
        selectId,
        selectedValue
    ) {

        const helper =
            window.ALON_FILL_COUNTRY_SELECT;


        if (
            typeof helper !== "function"
        ) {

            return false;
        }


        const select =
            $(selectId);


        if (!select) {
            return false;
        }


        try {

            const result =
                helper(
                    "#" + selectId,
                    selectedValue || ""
                );


            if (
                select.options.length > 1
            ) {

                return true;
            }


            if (
                result &&
                select.options.length > 1
            ) {

                return true;
            }

        } catch (error) {

            console.warn(
                "Central country helper failed:",
                error
            );
        }


        return false;
    }


    function populateRegularMarketplaceCountries() {

        const countryIDs = [

            "rmCountry",

            "rmShowroomCountry"

        ];


        let successful =
            false;


        countryIDs.forEach(
            function (id) {

                const helperWorked =
                    populateCountryUsingCentralHelper(
                        id
                    );


                if (helperWorked) {

                    successful = true;

                    return;
                }


                const directWorked =
                    populateCountrySelect(
                        id
                    );


                if (directWorked) {

                    successful = true;
                }
            }
        );


        /*
         * marketplace-countries.js may load
         * immediately before this file.
         *
         * If it is not ready yet, retry safely.
         */

        if (!successful) {

            let attempts = 0;

            const retry =
                setInterval(
                    function () {

                        attempts++;


                        let ready = false;


                        countryIDs.forEach(
                            function (id) {

                                const helperWorked =
                                    populateCountryUsingCentralHelper(
                                        id
                                    );


                                const directWorked =
                                    populateCountrySelect(
                                        id
                                    );


                                if (
                                    helperWorked ||
                                    directWorked
                                ) {

                                    ready = true;
                                }
                            }
                        );


                        if (
                            ready ||
                            attempts >= 10
                        ) {

                            clearInterval(
                                retry
                            );
                        }

                    },
                    500
                );
        }
    }


    function getSelectedCountry(
        selectId
    ) {

        const select =
            $(selectId);


        if (!select) {
            return null;
        }


        const option =
            select.selectedOptions &&
            select.selectedOptions[0];


        if (!option) {
            return null;
        }


        const value =
            String(
                option.value || ""
            ).trim();


        if (!value) {
            return null;
        }


        return {

            value: value,

            name:
                option.dataset.countryName ||
                option.textContent ||
                "",

            code2:
                option.dataset.countryCode ||
                "",

            code3:
                option.dataset.countryISO3 ||
                "",

            iso2:
                option.dataset.countryCode ||
                "",

            iso3:
                option.dataset.countryISO3 ||
                "",

            callingCode:
                option.dataset.callingCode ||
                "",

            phoneCode:
                option.dataset.callingCode ||
                "",

            flag:
                option.dataset.flag ||
                getCountryFlagFromOption(
                    option
                )
        };
    }


    function getCountryFlagFromOption(
        option
    ) {

        if (!option) {
            return "";
        }


        const text =
            option.textContent || "";


        const first =
            Array.from(text.trim())[0];


        /*
         * Country flag emoji generally occupies
         * two regional-indicator characters.
         */

        if (
            first &&
            first.codePointAt(0) >= 127397 &&
            first.codePointAt(0) <= 127568
        ) {

            return Array.from(text.trim())
                .slice(0, 2)
                .join("");
        }


        return "";
    }


    /* =====================================================
       LISTING CATEGORY UI
       ===================================================== */

    function populateListingCategories() {

        const type =
            $("rmListingType");

        const category =
            $("rmListingCategory");


        if (
            !type ||
            !category
        ) {

            return;
        }


        const selectedType =
            type.value;


        category.innerHTML = "";


        const first =
            document.createElement(
                "option"
            );


        first.value = "";

        first.textContent =
            "Select Category";


        category.appendChild(
            first
        );


        const list =
            CATEGORY_DATA[
                selectedType
            ] || [];


        list.forEach(
            function (item) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    item;

                option.textContent =
                    item;

                category.appendChild(
                    option
                );
            }
        );
    }


    /* =====================================================
       CONDITION UI
       ===================================================== */

    function populateConditionOptions() {

        const select =
            $("rmListingCondition");


        if (!select) {
            return;
        }


        if (
            select.options.length > 1
        ) {

            return;
        }


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


    /* =====================================================
       FILE VALIDATION
       ===================================================== */

    function validateImage(
        file
    ) {

        if (!file) {
            return {
                ok: true
            };
        }


        if (
            !String(
                file.type || ""
            )
            .startsWith("image/")
        ) {

            return {

                ok: false,

                message:
                    "Please select a valid image file."
            };
        }


        if (
            file.size >
            CONFIG.maxImageSize
        ) {

            return {

                ok: false,

                message:
                    "Image size must be 8 MB or less."
            };
        }


        return {
            ok: true
        };
    }


    function validateVideo(
        file
    ) {

        if (!file) {
            return {
                ok: true
            };
        }


        if (
            !String(
                file.type || ""
            )
            .startsWith("video/")
        ) {

            return {

                ok: false,

                message:
                    "Please select a valid video file."
            };
        }


        if (
            file.size >
            CONFIG.maxVideoSize
        ) {

            return {

                ok: false,

                message:
                    "Video size must be 20 MB or less."
            };
        }


        return {
            ok: true
        };
    }


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
                            reader.result || ""
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
       LISTING DATA
       ===================================================== */

    function collectListingData() {

        const selectedCountry =
            getSelectedCountry(
                "rmCountry"
            );


        return {

            type:
                $("rmListingType")
                    ?.value
                    ?.trim() || "",

            category:
                $("rmListingCategory")
                    ?.value
                    ?.trim() || "",

            condition:
                $("rmListingCondition")
                    ?.value
                    ?.trim() || "",

            title:
                $("rmListingTitle")
                    ?.value
                    ?.trim() || "",

            price:
                $("rmListingPrice")
                    ?.value
                    ?.trim() || "",

            country:
                selectedCountry?.value ||
                "",

            countryName:
                selectedCountry?.name ||
                "",

            countryCode:
                selectedCountry?.code2 ||
                "",

            countryISO3:
                selectedCountry?.code3 ||
                "",

            countryCallingCode:
                selectedCountry?.callingCode ||
                "",

            countryFlag:
                selectedCountry?.flag ||
                "",

            state:
                $("rmState")
                    ?.value
                    ?.trim() || "",

            pin:
                $("rmPin")
                    ?.value
                    ?.trim() || "",

            email:
                $("rmEmail")
                    ?.value
                    ?.trim()
                    .toLowerCase() ||
                getCurrentUserEmail(),

            description:
                $("rmDescription")
                    ?.value
                    ?.trim() || ""
        };
    }


    /* =====================================================
       LISTING SAVE
       ===================================================== */

    async function saveListing() {

        const status =
            $("rmListingStatus");


        if (
            !requireLogin(status)
        ) {

            return false;
        }


        const data =
            collectListingData();


        if (!data.type) {

            showStatus(
                status,
                "Please select listing type.",
                true
            );

            return false;
        }


        if (!data.category) {

            showStatus(
                status,
                "Please select category.",
                true
            );

            return false;
        }


        if (!data.title) {

            showStatus(
                status,
                "Please enter title.",
                true
            );

            return false;
        }


        if (!data.country) {

            showStatus(
                status,
                "Please select country.",
                true
            );

            return false;
        }


        if (!data.description) {

            showStatus(
                status,
                "Please enter description.",
                true
            );

            return false;
        }


        const imageFile =
            $("rmListingImage")
                ?.files
                ?.[0] ||
            null;


        const videoFile =
            $("rmListingVideo")
                ?.files
                ?.[0] ||
            null;


        const imageCheck =
            validateImage(
                imageFile
            );


        if (!imageCheck.ok) {

            showStatus(
                status,
                imageCheck.message,
                true
            );

            return false;
        }


        const videoCheck =
            validateVideo(
                videoFile
            );


        if (!videoCheck.ok) {

            showStatus(
                status,
                videoCheck.message,
                true
            );

            return false;
        }


        try {

            const imageData =
                await readFileAsDataURL(
                    imageFile
                );


            const videoData =
                await readFileAsDataURL(
                    videoFile
                );


            const listings =
                loadJSON(
                    CONFIG.listingsKey,
                    []
                );


            const editID =
                $("rmListingForm")
                    ?.dataset
                    ?.editId || "";


            if (editID) {

                const index =
                    listings.findIndex(
                        function (item) {

                            return (
                                item.id ===
                                editID
                            );
                        }
                    );


                if (index === -1) {

                    showStatus(
                        status,
                        "Listing not found.",
                        true
                    );

                    return false;
                }


                /*
                 * Only owner can edit.
                 */

                if (
                    listings[index].ownerEmail !==
                    getCurrentUserEmail()
                ) {

                    showStatus(
                        status,
                        "You can edit only your own listing.",
                        true
                    );

                    return false;
                }


                listings[index] = {

                    ...listings[index],

                    ...data,

                    image:
                        imageData ||
                        listings[index].image ||
                        "",

                    video:
                        videoData ||
                        listings[index].video ||
                        "",

                    updatedAt:
                        nowISO()
                };


                saveJSON(
                    CONFIG.listingsKey,
                    listings
                );


                clearListingForm();


                showStatus(
                    status,
                    "Listing updated successfully.",
                    false
                );


                renderListings();


                return true;
            }


            const listing = {

                id:
                    generateID("listing"),

                ownerEmail:
                    getCurrentUserEmail(),

                ownerName:
                    getSession()?.name ||
                    "",

                ...data,

                image:
                    imageData || "",

                video:
                    videoData || "",

                createdAt:
                    nowISO(),

                updatedAt:
                    nowISO()
            };


            listings.push(
                listing
            );


            if (
                !saveJSON(
                    CONFIG.listingsKey,
                    listings
                )
            ) {

                showStatus(
                    status,
                    "Unable to save listing. Storage may be full.",
                    true
                );

                return false;
            }


            clearListingForm();


            showStatus(
                status,
                "Listing saved successfully.",
                false
            );


            renderListings();


            return true;

        } catch (error) {

            console.error(
                "Listing save error:",
                error
            );


            showStatus(
                status,
                "Unable to save listing. The selected media may be too large.",
                true
            );


            return false;
        }
    }


    /* =====================================================
       CLEAR LISTING FORM
       ===================================================== */

    function clearListingForm() {

        const form =
            $("rmListingForm");


        if (form) {

            form.reset();

            delete form.dataset.editId;
        }


        populateListingCategories();


        const cancel =
            $("rmCancelListingEditButton");


        if (cancel) {

            cancel.style.display =
                "none";
        }


        const email =
            $("rmEmail");


        if (
            email &&
            getCurrentUserEmail()
        ) {

            email.value =
                getCurrentUserEmail();
        }
    }


    /* =====================================================
       EDIT LISTING
       ===================================================== */

    function editListing(
        id
    ) {

        if (
            !requireLogin(
                $("rmListingStatus")
            )
        ) {

            return;
        }


        const listings =
            loadJSON(
                CONFIG.listingsKey,
                []
            );


        const listing =
            listings.find(
                function (item) {

                    return item.id === id;
                }
            );


        if (!listing) {
            return;
        }


        if (
            listing.ownerEmail !==
            getCurrentUserEmail()
        ) {

            showStatus(
                $("rmListingStatus"),
                "You can edit only your own listing.",
                true
            );

            return;
        }


        const form =
            $("rmListingForm");


        if (!form) {
            return;
        }


        form.dataset.editId =
            id;


        if ($("rmListingType"))
            $("rmListingType").value =
                listing.type || "";


        populateListingCategories();


        if ($("rmListingCategory"))
            $("rmListingCategory").value =
                listing.category || "";


        if ($("rmListingCondition"))
            $("rmListingCondition").value =
                listing.condition || "";


        if ($("rmListingTitle"))
            $("rmListingTitle").value =
                listing.title || "";


        if ($("rmListingPrice"))
            $("rmListingPrice").value =
                listing.price || "";


        if ($("rmCountry"))
            $("rmCountry").value =
                listing.country || "";


        if ($("rmState"))
            $("rmState").value =
                listing.state || "";


        if ($("rmPin"))
            $("rmPin").value =
                listing.pin || "";


        if ($("rmEmail"))
            $("rmEmail").value =
                listing.email ||
                getCurrentUserEmail();


        if ($("rmDescription"))
            $("rmDescription").value =
                listing.description || "";


        const cancel =
            $("rmCancelListingEditButton");


        if (cancel) {

            cancel.style.display =
                "";
        }


        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       DELETE LISTING
       ===================================================== */

    function deleteListing(
        id
    ) {

        if (
            !requireLogin(
                $("rmListingStatus")
            )
        ) {

            return;
        }


        const listings =
            loadJSON(
                CONFIG.listingsKey,
                []
            );


        const listing =
            listings.find(
                function (item) {

                    return item.id === id;
                }
            );


        if (!listing) {
            return;
        }


        if (
            listing.ownerEmail !==
            getCurrentUserEmail()
        ) {

            showStatus(
                $("rmListingStatus"),
                "You can delete only your own listing.",
                true
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Delete this listing?"
            );


        if (!confirmed) {
            return;
        }


        const remaining =
            listings.filter(
                function (item) {

                    return item.id !== id;
                }
            );


        saveJSON(
            CONFIG.listingsKey,
            remaining
        );


        showStatus(
            $("rmListingStatus"),
            "Listing deleted.",
            false
        );


        renderListings();
    }


    /* =====================================================
       LISTING CARD
       ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
    }


    function renderListingCard(
        listing
    ) {

        const owner =
            listing.ownerEmail ===
            getCurrentUserEmail();


        const mediaImage =
            listing.image
                ? `
                    <img
                        src="${listing.image}"
                        alt="${escapeHTML(listing.title)}"
                        loading="lazy"
                    >
                  `
                : "";


        const mediaVideo =
            listing.video
                ? `
                    <video
                        controls
                        preload="metadata"
                    >
                        <source
                            src="${listing.video}"
                        >
                    </video>
                  `
                : "";


        const locationParts = [

            listing.countryFlag ||
                "",

            listing.countryName ||
                listing.country ||
                "",

            listing.countryCode
                ? "(" +
                  listing.countryCode +
                  ")"
                : "",

            listing.countryCallingCode ||
                "",

            listing.state ||
                "",

            listing.pin
                ? "PIN " +
                  listing.pin
                : ""

        ].filter(Boolean);


        return `

            <article
                class="rm-listing-card"
                data-listing-id="${escapeHTML(listing.id)}"
            >

                <div class="rm-listing-media">

                    ${mediaImage}

                    ${mediaVideo}

                </div>


                <div class="rm-listing-content">

                    <div class="rm-listing-type">
                        ${escapeHTML(
                            listing.type
                        )}
                    </div>


                    <h3>
                        ${escapeHTML(
                            listing.title
                        )}
                    </h3>


                    <p>
                        <strong>Category:</strong>
                        ${escapeHTML(
                            listing.category
                        )}
                    </p>


                    <p>
                        <strong>Condition:</strong>
                        ${escapeHTML(
                            listing.condition
                        )}
                    </p>


                    ${
                        listing.price
                        ? `
                            <p>
                                <strong>Price:</strong>
                                ${escapeHTML(
                                    listing.price
                                )}
                                ${CONFIG.currency}
                            </p>
                          `
                        : ""
                    }


                    <p>
                        <strong>Country:</strong>
                        ${escapeHTML(
                            locationParts.join(" ")
                        )}
                    </p>


                    ${
                        listing.description
                        ? `
                            <p class="rm-description">
                                ${escapeHTML(
                                    listing.description
                                )}
                            </p>
                          `
                        : ""
                    }


                    ${
                        owner
                        ? `
                            <div class="rm-owner-actions">

                                <button
                                    type="button"
                                    data-action="edit-listing"
                                    data-id="${escapeHTML(listing.id)}"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    data-action="delete-listing"
                                    data-id="${escapeHTML(listing.id)}"
                                >
                                    Delete
                                </button>

                            </div>
                          `
                        : ""
                    }

                </div>

            </article>
        `;
    }


    /* =====================================================
       RENDER LISTINGS
       ===================================================== */

    function renderListings() {

        const container =
            $("rmListings");


        if (!container) {
            return;
        }


        const listings =
            loadJSON(
                CONFIG.listingsKey,
                []
            );


        if (!Array.isArray(listings) ||
            !listings.length) {

            container.innerHTML =
                "<p>No listings found.</p>";

            return;
        }


        /*
         * Private own-listing view:
         * logged-in user sees their own listings.
         *
         * If not logged in, no private listings
         * are displayed.
         */

        if (!isLoggedIn()) {

            container.innerHTML =
                "<p>Please login to view your saved listings.</p>";

            return;
        }


        const email =
            getCurrentUserEmail();


        const ownListings =
            listings.filter(
                function (item) {

                    return (
                        item.ownerEmail ===
                        email
                    );
                }
            );


        if (!ownListings.length) {

            container.innerHTML =
                "<p>You have no saved listings yet.</p>";

            return;
        }


        container.innerHTML =
            ownListings
                .slice()
                .reverse()
                .map(
                    renderListingCard
                )
                .join("");


        bindListingCardActions();
    }


    function bindListingCardActions() {

        const container =
            $("rmListings");


        if (!container) {
            return;
        }


        container
            .querySelectorAll(
                "[data-action='edit-listing']"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            editListing(
                                button.dataset.id
                            );
                        }
                    );
                }
            );


        container
            .querySelectorAll(
                "[data-action='delete-listing']"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteListing(
                                button.dataset.id
                            );
                        }
                    );
                }
            );
    }


    /* =====================================================
       SHOWROOM DATA
       ===================================================== */

    function collectShowroomData() {

        const selectedCountry =
            getSelectedCountry(
                "rmShowroomCountry"
            );


        return {

            name:
                $("rmShowroomName")
                    ?.value
                    ?.trim() || "",

            type:
                $("rmShowroomType")
                    ?.value
                    ?.trim() || "",

            reachGlobal:
                !!$("rmShowroomReachGlobal")
                    ?.checked,

            reachInternational:
                !!$("rmShowroomReachInternational")
                    ?.checked,

            country:
                selectedCountry?.value ||
                "",

            countryName:
                selectedCountry?.name ||
                "",

            countryCode:
                selectedCountry?.code2 ||
                "",

            countryISO3:
                selectedCountry?.code3 ||
                "",

            countryCallingCode:
                selectedCountry?.callingCode ||
                "",

            countryFlag:
                selectedCountry?.flag ||
                "",

            state:
                $("rmShowroomState")
                    ?.value
                    ?.trim() || "",

            pin:
                $("rmShowroomPin")
                    ?.value
                    ?.trim() || "",

            email:
                $("rmShowroomEmail")
                    ?.value
                    ?.trim()
                    .toLowerCase() ||
                getCurrentUserEmail(),

            description:
                $("rmShowroomDescription")
                    ?.value
                    ?.trim() || ""
        };
    }


    /* =====================================================
       SHOWROOM PAYMENT STATE
       ===================================================== */

    let showroomPaymentVerified =
        false;


    function verifyShowroomPayment() {

        const status =
            $("rmPaymentStatus");


        if (
            !requireLogin(status)
        ) {

            return false;
        }


        /*
         * IMPORTANT:
         * This is only the local prototype payment
         * state. It does NOT claim that PayPal has
         * verified a real transaction.
         */

        showroomPaymentVerified =
            true;


        if ($("rmPaymentAccountStatus")) {

            $("rmPaymentAccountStatus")
                .textContent =
                "Payment step ready";
        }


        showStatus(
            status,
            "Showroom payment step accepted locally. Real payment verification must be connected to the payment gateway before charging users.",
            false
        );


        return true;
    }


    /* =====================================================
       PAYMENT CONNECT BUTTON
       ===================================================== */

    function connectPaymentAccount() {

        const status =
            $("rmPaymentStatus");


        if (
            !requireLogin(status)
        ) {

            return;
        }


        if ($("rmPaymentAccountStatus")) {

            $("rmPaymentAccountStatus")
                .textContent =
                "Payment account setup selected";
        }


        showStatus(
            status,
            "Payment account setup is ready. Connect the live payment gateway before publishing paid ads.",
            false
        );
    }


    /* =====================================================
       SAVE SHOWROOM
       ===================================================== */

    async function saveShowroom() {

        const status =
            $("rmShowroomStatus");


        if (
            !requireLogin(status)
        ) {

            return false;
        }


        const data =
            collectShowroomData();


        if (!data.name) {

            showStatus(
                status,
                "Please enter business/showroom name.",
                true
            );

            return false;
        }


        if (!data.type) {

            showStatus(
                status,
                "Please select business/showroom type.",
                true
            );

            return false;
        }


        if (
            !data.reachGlobal &&
            !data.reachInternational
        ) {

            showStatus(
                status,
                "Please select Global / Worldwide, International, or both.",
                true
            );

            return false;
        }


        if (!data.country) {

            showStatus(
                status,
                "Please select country.",
                true
            );

            return false;
        }


        if (!data.description) {

            showStatus(
                status,
                "Please enter business description.",
                true
            );

            return false;
        }


        /*
         * $10 USD requirement.
         */

        if (!showroomPaymentVerified) {

            showStatus(
                status,
                "The showroom/business advertisement price is $10 USD. Complete the payment step before publishing.",
                true
            );

            return false;
        }


        const imageFile =
            $("rmShowroomImage")
                ?.files
                ?.[0] ||
            null;


        const videoFile =
            $("rmShowroomVideo")
                ?.files
                ?.[0] ||
            null;


        const imageCheck =
            validateImage(
                imageFile
            );


        if (!imageCheck.ok) {

            showStatus(
                status,
                imageCheck.message,
                true
            );

            return false;
        }


        const videoCheck =
            validateVideo(
                videoFile
            );


        if (!videoCheck.ok) {

            showStatus(
                status,
                videoCheck.message,
                true
            );

            return false;
        }


        try {

            const imageData =
                await readFileAsDataURL(
                    imageFile
                );


            const videoData =
                await readFileAsDataURL(
                    videoFile
                );


            const showrooms =
                loadJSON(
                    CONFIG.showroomsKey,
                    []
                );


            const form =
                $("rmShowroomForm");


            const editID =
                form?.dataset
                    ?.editId || "";


            if (editID) {

                const index =
                    showrooms.findIndex(
                        function (item) {

                            return (
                                item.id ===
                                editID
                            );
                        }
                    );


                if (index === -1) {

                    showStatus(
                        status,
                        "Showroom advertisement not found.",
                        true
                    );

                    return false;
                }


                if (
                    showrooms[index].ownerEmail !==
                    getCurrentUserEmail()
                ) {

                    showStatus(
                        status,
                        "You can edit only your own advertisement.",
                        true
                    );

                    return false;
                }


                showrooms[index] = {

                    ...showrooms[index],

                    ...data,

                    priceUSD:
                        CONFIG.showroomPrice,

                    paymentStatus:
                        "verified-local-prototype",

                    image:
                        imageData ||
                        showrooms[index].image ||
                        "",

                    video:
                        videoData ||
                        showrooms[index].video ||
                        "",

                    updatedAt:
                        nowISO()
                };


                saveJSON(
                    CONFIG.showroomsKey,
                    showrooms
                );


                clearShowroomForm();


                showStatus(
                    status,
                    "Business/showroom advertisement updated successfully.",
                    false
                );


                renderShowrooms();


                return true;
            }


            const showroom = {

                id:
                    generateID("showroom"),

                ownerEmail:
                    getCurrentUserEmail(),

                ownerName:
                    getSession()?.name ||
                    "",

                ...data,

                priceUSD:
                    CONFIG.showroomPrice,

                currency:
                    CONFIG.currency,

                paymentStatus:
                    "verified-local-prototype",

                image:
                    imageData || "",

                video:
                    videoData || "",

                createdAt:
                    nowISO(),

                updatedAt:
                    nowISO()
            };


            showrooms.push(
                showroom
            );


            if (
                !saveJSON(
                    CONFIG.showroomsKey,
                    showrooms
                )
            ) {

                showStatus(
                    status,
                    "Unable to save showroom advertisement. Storage may be full.",
                    true
                );

                return false;
            }


            clearShowroomForm();


            showroomPaymentVerified =
                false;


            showStatus(
                status,
                "Business/showroom advertisement saved successfully.",
                false
            );


            renderShowrooms();


            return true;

        } catch (error) {

            console.error(
                "Showroom save error:",
                error
            );


            showStatus(
                status,
                "Unable to save showroom advertisement.",
                true
            );


            return false;
        }
    }


    /* =====================================================
       CLEAR SHOWROOM FORM
       ===================================================== */

    function clearShowroomForm() {

        const form =
            $("rmShowroomForm");


        if (form) {

            form.reset();

            delete form.dataset.editId;
        }


        const reset =
            $("rmResetShowroomButton");


        if (reset) {

            reset.style.display =
                "";
        }


        const email =
            $("rmShowroomEmail");


        if (
            email &&
            getCurrentUserEmail()
        ) {

            email.value =
                getCurrentUserEmail();
        }


        showroomPaymentVerified =
            false;
    }


    /* =====================================================
       EDIT SHOWROOM
       ===================================================== */

    function editShowroom(
        id
    ) {

        if (
            !requireLogin(
                $("rmShowroomStatus")
            )
        ) {

            return;
        }


        const showrooms =
            loadJSON(
                CONFIG.showroomsKey,
                []
            );


        const showroom =
            showrooms.find(
                function (item) {

                    return item.id === id;
                }
            );


        if (!showroom) {
            return;
        }


        if (
            showroom.ownerEmail !==
            getCurrentUserEmail()
        ) {

            showStatus(
                $("rmShowroomStatus"),
                "You can edit only your own advertisement.",
                true
            );

            return;
        }


        const form =
            $("rmShowroomForm");


        if (!form) {
            return;
        }


        form.dataset.editId =
            id;


        if ($("rmShowroomName"))
            $("rmShowroomName").value =
                showroom.name || "";


        if ($("rmShowroomType"))
            $("rmShowroomType").value =
                showroom.type || "";


        if ($("rmShowroomReachGlobal"))
            $("rmShowroomReachGlobal").checked =
                !!showroom.reachGlobal;


        if ($("rmShowroomReachInternational"))
            $("rmShowroomReachInternational").checked =
                !!showroom.reachInternational;


        if ($("rmShowroomCountry"))
            $("rmShowroomCountry").value =
                showroom.country || "";


        if ($("rmShowroomState"))
            $("rmShowroomState").value =
                showroom.state || "";


        if ($("rmShowroomPin"))
            $("rmShowroomPin").value =
                showroom.pin || "";


        if ($("rmShowroomEmail"))
            $("rmShowroomEmail").value =
                showroom.email ||
                getCurrentUserEmail();


        if ($("rmShowroomDescription"))
            $("rmShowroomDescription").value =
                showroom.description || "";


        showroomPaymentVerified =
            true;


        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =====================================================
       DELETE SHOWROOM
       ===================================================== */

    function deleteShowroom(
        id
    ) {

        if (
            !requireLogin(
                $("rmShowroomStatus")
            )
        ) {

            return;
        }


        const showrooms =
            loadJSON(
                CONFIG.showroomsKey,
                []
            );


        const showroom =
            showrooms.find(
                function (item) {

                    return item.id === id;
                }
            );


        if (!showroom) {
            return;
        }


        if (
            showroom.ownerEmail !==
            getCurrentUserEmail()
        ) {

            showStatus(
                $("rmShowroomStatus"),
                "You can delete only your own advertisement.",
                true
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Delete this business/showroom advertisement?"
            );


        if (!confirmed) {
            return;
        }


        const remaining =
            showrooms.filter(
                function (item) {

                    return item.id !== id;
                }
            );


        saveJSON(
            CONFIG.showroomsKey,
            remaining
        );


        showStatus(
            $("rmShowroomStatus"),
            "Business/showroom advertisement deleted.",
            false
        );


        renderShowrooms();
    }


    /* =====================================================
       SHOWROOM CARD
       ===================================================== */

    function renderShowroomCard(
        showroom
    ) {

        const mediaImage =
            showroom.image
                ? `
                    <img
                        src="${showroom.image}"
                        alt="${escapeHTML(showroom.name)}"
                        loading="lazy"
                    >
                  `
                : "";


        const mediaVideo =
            showroom.video
                ? `
                    <video
                        controls
                        preload="metadata"
                    >
                        <source
                            src="${showroom.video}"
                        >
                    </video>
                  `
                : "";


        const reach = [];


        if (
            showroom.reachGlobal
        ) {

            reach.push(
                "Global / Worldwide"
            );
        }


        if (
            showroom.reachInternational
        ) {

            reach.push(
                "International"
            );
        }


        const locationParts = [

            showroom.countryFlag ||
                "",

            showroom.countryName ||
                showroom.country ||
                "",

            showroom.countryCode
                ? "(" +
                  showroom.countryCode +
                  ")"
                : "",

            showroom.countryCallingCode ||
                "",

            showroom.state ||
                "",

            showroom.pin
                ? "PIN " +
                  showroom.pin
                : ""

        ].filter(Boolean);


        return `

            <article
                class="rm-showroom-card"
                data-showroom-id="${escapeHTML(showroom.id)}"
            >

                <div class="rm-showroom-media">

                    ${mediaImage}

                    ${mediaVideo}

                </div>


                <div class="rm-showroom-content">

                    <div class="rm-showroom-badge">
                        Business / Showroom
                    </div>


                    <h3>
                        ${escapeHTML(
                            showroom.name
                        )}
                    </h3>


                    <p>
                        <strong>Type:</strong>
                        ${escapeHTML(
                            showroom.type
                        )}
                    </p>


                    <p>
                        <strong>Reach:</strong>
                        ${escapeHTML(
                            reach.join(" + ")
                        )}
                    </p>


                    <p>
                        <strong>Country:</strong>
                        ${escapeHTML(
                            locationParts.join(" ")
                        )}
                    </p>


                    <p>
                        <strong>Advertisement:</strong>
                        $${CONFIG.showroomPrice}
                        USD
                    </p>


                    ${
                        showroom.description
                        ? `
                            <p class="rm-description">
                                ${escapeHTML(
                                    showroom.description
                                )}
                            </p>
                          `
                        : ""
                    }


                    <div class="rm-owner-actions">

                        <button
                            type="button"
                            data-action="edit-showroom"
                            data-id="${escapeHTML(showroom.id)}"
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            data-action="delete-showroom"
                            data-id="${escapeHTML(showroom.id)}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </article>
        `;
    }


    /* =====================================================
       RENDER SHOWROOMS
       ===================================================== */

    function renderShowrooms() {

        const container =
            $("rmShowrooms");


        if (!container) {
            return;
        }


        const showrooms =
            loadJSON(
                CONFIG.showroomsKey,
                []
            );


        if (!isLoggedIn()) {

            container.innerHTML =
                "<p>Please login to view your saved business/showroom advertisements.</p>";

            return;
        }


        const email =
            getCurrentUserEmail();


        const ownShowrooms =
            Array.isArray(showrooms)
                ? showrooms.filter(
                    function (item) {

                        return (
                            item.ownerEmail ===
                            email
                        );
                    }
                )
                : [];


        if (!ownShowrooms.length) {

            container.innerHTML =
                "<p>You have no saved business/showroom advertisements yet.</p>";

            return;
        }


        container.innerHTML =
            ownShowrooms
                .slice()
                .reverse()
                .map(
                    renderShowroomCard
                )
                .join("");


        bindShowroomCardActions();
    }


    function bindShowroomCardActions() {

        const container =
            $("rmShowrooms");


        if (!container) {
            return;
        }


        container
            .querySelectorAll(
                "[data-action='edit-showroom']"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            editShowroom(
                                button.dataset.id
                            );
                        }
                    );
                }
            );


        container
            .querySelectorAll(
                "[data-action='delete-showroom']"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteShowroom(
                                button.dataset.id
                            );
                        }
                    );
                }
            );
    }


    /* =====================================================
       EVENT BINDING
       ===================================================== */

    function bindEvents() {

        const loginButton =
            $("rmLoginButton");


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                login
            );
        }


        const logoutButton =
            $("rmLogoutButton");


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                logout
            );
        }


        const listingType =
            $("rmListingType");


        if (listingType) {

            listingType.addEventListener(
                "change",
                populateListingCategories
            );
        }


        const saveListingButton =
            $("rmSaveListingButton");


        if (saveListingButton) {

            saveListingButton.addEventListener(
                "click",
                saveListing
            );
        }


        const cancelListingButton =
            $("rmCancelListingEditButton");


        if (cancelListingButton) {

            cancelListingButton.addEventListener(
                "click",
                clearListingForm
            );
        }


        const connectPaymentButton =
            $("rmConnectPaymentButton");


        if (connectPaymentButton) {

            connectPaymentButton.addEventListener(
                "click",
                connectPaymentAccount
            );
        }


        const payShowroomButton =
            $("rmPayShowroomButton");


        if (payShowroomButton) {

            payShowroomButton.addEventListener(
                "click",
                verifyShowroomPayment
            );
        }


        const publishShowroomButton =
            $("rmPublishShowroomButton");


        if (publishShowroomButton) {

            publishShowroomButton.addEventListener(
                "click",
                saveShowroom
            );
        }


        const resetShowroomButton =
            $("rmResetShowroomButton");


        if (resetShowroomButton) {

            resetShowroomButton.addEventListener(
                "click",
                clearShowroomForm
            );
        }


        /*
         * Pressing Enter in login form
         */

        const loginBox =
            $("rmLoginBox");


        if (loginBox) {

            loginBox.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        login();
                    }
                }
            );
        }
    }


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        populateListingCategories();

        populateConditionOptions();

        populateRegularMarketplaceCountries();

        bindEvents();

        updateLoginUI();

        renderListings();

        renderShowrooms();


        /*
         * Keep email fields synchronized
         * after page initialization.
         */

        const email =
            getCurrentUserEmail();


        if (
            email &&
            $("rmEmail")
        ) {

            $("rmEmail").value =
                email;
        }


        if (
            email &&
            $("rmShowroomEmail")
        ) {

            $("rmShowroomEmail").value =
                email;
        }
    }


    /* =====================================================
       SAFE DOM READY
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_REGULAR_MARKETPLACE = {

        version:
            CONFIG.version,

        config:
            CONFIG,

        categories:
            CATEGORY_DATA,

        conditions:
            CONDITION_DATA,

        getListings:
            function () {

                return loadJSON(
                    CONFIG.listingsKey,
                    []
                );
            },

        getShowrooms:
            function () {

                return loadJSON(
                    CONFIG.showroomsKey,
                    []
                );
            },

        renderListings:
            renderListings,

        renderShowrooms:
            renderShowrooms,

        login:
            login,

        logout:
            logout,

        verifyPayment:
            verifyShowroomPayment,

        populateCountries:
            populateRegularMarketplaceCountries,

        getSelectedCountry:
            getSelectedCountry
    };


})();