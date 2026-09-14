/* =========================================================
   ALON HISTORYVERSE 24
   GLOBAL MARKETPLACE ENGINE V1
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STORAGE KEYS
    ====================================================== */

    const LISTINGS_KEY =
        "alon_historyverse_marketplace_listings_v1";

    const PROFILE_KEY =
        "alon_historyverse_marketplace_profile_v1";


    /* =====================================================
       GLOBAL STATE
    ====================================================== */

    let listings = [];

    let currentProfile = null;

    let editingListingId = null;

    let alonMap = null;

    let mapMarkers = [];

    let selectedCountry = "";


    /* =====================================================
       CATEGORY NAMES
    ====================================================== */

    const CATEGORY_NAMES = {

        vehicle: "🚗 Vehicle",

        property: "🏠 Property",

        business: "🏪 Business",

        hotel: "🏨 Hotel",

        fuel: "⛽ Petrol / CNG",

        garage: "🔧 Garage / Mechanic",

        job: "📋 Local Job"

    };


    /* =====================================================
       PROHIBITED CONTENT
    ====================================================== */

    const FORBIDDEN_PATTERN = new RegExp(
        [
            "weapon",
            "firearm",
            "gun",
            "rifle",
            "pistol",
            "ammunition",
            "explosive",
            "bomb",
            "grenade",
            "drug",
            "cocaine",
            "heroin",
            "meth",
            "narcotic",
            "stolen",
            "counterfeit",
            "fake passport",
            "human trafficking",
            "trafficking",
            "child abuse",
            "sexual exploitation",
            "illegal service",
            "terrorist",
            "terrorism",

            /* Animals / birds */
            "dog for sale",
            "cat for sale",
            "bird for sale",
            "parrot for sale",
            "animal for sale",
            "animals for sale",
            "wildlife for sale",
            "pet for sale",
            "pets for sale"
        ].join("|"),
        "i"
    );


    /* =====================================================
       DOM HELPERS
    ====================================================== */

    function $(selector) {

        return document.querySelector(selector);

    }


    function $all(selector) {

        return Array.from(
            document.querySelectorAll(selector)
        );

    }


    function escapeHTML(value) {

        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function safeText(value) {

        return String(value == null ? "" : value)
            .trim();

    }


    /* =====================================================
       COUNTRY DATABASE
    ====================================================== */

    function getCountries() {

        if (
            Array.isArray(window.MARKETPLACE_COUNTRIES)
        ) {

            return window.MARKETPLACE_COUNTRIES;

        }

        return [];

    }


    function countryByCode(code) {

        const countries = getCountries();

        return countries.find(
            country =>
                country.code === code
        ) || null;

    }


    function countryLabel(country) {

        if (!country) {

            return "";

        }

        return (
            country.flag +
            " " +
            country.name +
            " " +
            country.callingCode
        );

    }


    /* =====================================================
       COUNTRY SELECTS
    ====================================================== */

    function populateCountries() {

        const countries =
            getCountries();

        const selects = [

            $("#mpCountryFilter"),

            $("#mpAccountCountry"),

            $("#mpListingCountry")

        ];

        selects.forEach(select => {

            if (!select) {

                return;

            }

            const current =
                select.value;

            const firstOption =
                select.options[0];

            select.innerHTML = "";

            if (firstOption) {

                const option =
                    document.createElement("option");

                option.value =
                    firstOption.value;

                option.textContent =
                    firstOption.textContent;

                select.appendChild(option);

            }

            countries.forEach(country => {

                const option =
                    document.createElement("option");

                option.value =
                    country.code;

                option.textContent =
                    countryLabel(country);

                select.appendChild(option);

            });

            if (current) {

                select.value =
                    current;

            }

        });

    }


    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    function loadListings() {

        try {

            const raw =
                localStorage.getItem(
                    LISTINGS_KEY
                );

            if (!raw) {

                listings = [];

                return;

            }

            const parsed =
                JSON.parse(raw);

            listings =
                Array.isArray(parsed)
                    ? parsed
                    : [];

        } catch (error) {

            console.error(
                "Marketplace listings load error:",
                error
            );

            listings = [];

        }

    }


    function saveListings() {

        try {

            localStorage.setItem(
                LISTINGS_KEY,
                JSON.stringify(listings)
            );

            return true;

        } catch (error) {

            console.error(
                "Marketplace listings save error:",
                error
            );

            return false;

        }

    }


    function loadProfile() {

        try {

            const raw =
                localStorage.getItem(
                    PROFILE_KEY
                );

            if (!raw) {

                currentProfile = null;

                return;

            }

            currentProfile =
                JSON.parse(raw);

        } catch (error) {

            console.error(
                "Marketplace profile load error:",
                error
            );

            currentProfile = null;

        }

    }


    function saveProfile(profile) {

        currentProfile =
            profile;

        try {

            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(profile)
            );

        } catch (error) {

            console.error(
                "Marketplace profile save error:",
                error
            );

        }

    }


    function clearProfile() {

        currentProfile = null;

        try {

            localStorage.removeItem(
                PROFILE_KEY
            );

        } catch (error) {

            console.error(error);

        }

    }


    /* =====================================================
       USER ID
    ====================================================== */

    function getUserId() {

        if (
            currentProfile &&
            currentProfile.uid
        ) {

            return currentProfile.uid;

        }

        return "";

    }


    function makeLocalUserId() {

        return (
            "local_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 10)
        );

    }


    /* =====================================================
       FIREBASE DETECTION
    ====================================================== */

    function firebaseReady() {

        return (
            window.HistoryVerseFirebase &&
            typeof window.HistoryVerseFirebase.login ===
                "function"
        );

    }


    /* =====================================================
       FILE TO DATA URL
    ====================================================== */

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
                            reader.error
                        );

                    };

                reader.readAsDataURL(file);

            }
        );

    }


    async function filesToDataURLs(files) {

        const result = [];

        if (!files) {

            return result;

        }

        for (
            const file of Array.from(files)
        ) {

            /*
             * Keep local fallback media small.
             * Real Firebase Storage should be used
             * when cloud storage is configured.
             */

            if (
                file.size >
                2 * 1024 * 1024
            ) {

                continue;

            }

            try {

                const data =
                    await fileToDataURL(file);

                if (data) {

                    result.push(data);

                }

            } catch (error) {

                console.error(
                    "Media conversion error:",
                    error
                );

            }

        }

        return result;

    }


    /* =====================================================
       CONTENT SAFETY
    ====================================================== */

    function containsForbiddenContent(values) {

        const text =
            values
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

        return FORBIDDEN_PATTERN.test(
            text
        );

    }


    function validateListingContent(data) {

        const values = [

            data.title,

            data.brand,

            data.model,

            data.condition,

            data.price,

            data.description,

            data.city,

            data.state,

            data.road,

            data.category

        ];

        if (
            containsForbiddenContent(
                values
            )
        ) {

            return {
                valid: false,

                message:
                    "This listing appears to contain prohibited or restricted content."
            };

        }


        /*
         * Animals and birds are not allowed.
         */

        const animalPattern =
            /\b(animal|animals|bird|birds|parrot|dog|dogs|cat|cats|horse|horses|cow|cows|goat|goats|sheep|livestock|wildlife)\b/i;

        const combined =
            values
                .filter(Boolean)
                .join(" ");

        if (
            animalPattern.test(
                combined
            )
        ) {

            return {
                valid: false,

                message:
                    "Animals and birds cannot be sold or listed in the ALON Marketplace."
            };

        }


        return {
            valid: true,
            message: ""
        };

    }


    /* =====================================================
       LOCATION VALIDATION
    ====================================================== */

    function validCoordinates(lat, lng) {

        const latitude =
            Number(lat);

        const longitude =
            Number(lng);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {

            return false;

        }

        if (
            latitude < -90 ||
            latitude > 90
        ) {

            return false;

        }

        if (
            longitude < -180 ||
            longitude > 180
        ) {

            return false;

        }

        return true;

    }


    /* =====================================================
       LISTING NORMALIZATION
    ====================================================== */

    function normalizeListing(listing) {

        return {

            id:
                listing.id ||
                (
                    "listing_" +
                    Date.now() +
                    "_" +
                    Math.random()
                        .toString(36)
                        .slice(2, 9)
                ),

            ownerId:
                listing.ownerId ||
                "",

            sellerName:
                listing.sellerName ||
                "Marketplace User",

            sellerPhoto:
                listing.sellerPhoto ||
                "",

            country:
                listing.country ||
                "",

            category:
                listing.category ||
                "",

            title:
                listing.title ||
                "",

            brand:
                listing.brand ||
                "",

            model:
                listing.model ||
                "",

            year:
                listing.year ||
                "",

            condition:
                listing.condition ||
                "",

            price:
                listing.price ||
                "",

            description:
                listing.description ||
                "",

            city:
                listing.city ||
                "",

            state:
                listing.state ||
                "",

            road:
                listing.road ||
                "",

            lat:
                Number(
                    listing.lat
                ),

            lng:
                Number(
                    listing.lng
                ),

            photos:
                Array.isArray(
                    listing.photos
                )
                    ? listing.photos
                    : [],

            video:
                listing.video ||
                "",

            createdAt:
                listing.createdAt ||
                Date.now(),

            updatedAt:
                listing.updatedAt ||
                Date.now(),

            status:
                listing.status ||
                "published"

        };

    }


    /* =====================================================
       COUNTRY NAME
    ====================================================== */

    function getCountryName(code) {

        const country =
            countryByCode(code);

        return country
            ? countryLabel(country)
            : code || "Unknown";

    }


    /* =====================================================
       FILTER LISTINGS
    ====================================================== */

    function getFilteredListings() {

        const country =
            safeText(
                $("#mpCountryFilter")?.value
            ).toUpperCase();

        const category =
            safeText(
                $("#mpCategoryFilter")?.value
            );

        const search =
            safeText(
                $("#mpSearch")?.value
            ).toLowerCase();


        return listings
            .filter(
                listing =>
                    listing.status !==
                    "deleted"
            )
            .filter(
                listing =>
                    !country ||
                    listing.country === country
            )
            .filter(
                listing =>
                    !category ||
                    listing.category === category
            )
            .filter(
                listing => {

                    if (!search) {

                        return true;

                    }

                    const text = [

                        listing.title,

                        listing.brand,

                        listing.model,

                        listing.description,

                        listing.city,

                        listing.state,

                        listing.road,

                        listing.country

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    return text.includes(
                        search
                    );

                }
            )
            .sort(
                (a, b) =>
                    Number(b.createdAt) -
                    Number(a.createdAt)
            );

    }


    /* =====================================================
       RENDER LISTINGS
    ====================================================== */

    function renderListings() {

        const grid =
            $("#mpListingsGrid");

        const empty =
            $("#mpEmptyListings");

        const count =
            $("#mpListingCount");

        if (!grid) {

            return;

        }

        const filtered =
            getFilteredListings();

        grid.innerHTML = "";

        if (count) {

            count.textContent =
                filtered.length +
                (
                    filtered.length === 1
                        ? " listing"
                        : " listings"
                );

        }

        if (
            empty
        ) {

            empty.style.display =
                filtered.length
                    ? "none"
                    : "";

        }


        filtered.forEach(
            listing => {

                grid.appendChild(
                    createListingCard(
                        listing,
                        false
                    )
                );

            }
        );

        updateMap(
            filtered
        );

    }


    /* =====================================================
       CREATE LISTING CARD
    ====================================================== */

    function createListingCard(
        listing,
        ownerView
    ) {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "mp-listing-card";

        const category =
            CATEGORY_NAMES[
                listing.category
            ] ||
            "Marketplace";

        const photo =
            listing.photos &&
            listing.photos.length
                ? listing.photos[0]
                : "";

        const sellerPhoto =
            listing.sellerPhoto ||
            "";

        const location =
            [
                getCountryName(
                    listing.country
                ),
                listing.city,
                listing.state,
                listing.road
            ]
                .filter(Boolean)
                .join(" • ");


        const mediaHTML =
            photo
                ? `
                    <div class="mp-listing-media">
                        <img
                            src="${escapeHTML(photo)}"
                            alt="${escapeHTML(listing.title)}"
                            loading="lazy"
                        >
                        <span class="mp-listing-category">
                            ${escapeHTML(category)}
                        </span>
                    </div>
                `
                : `
                    <div class="mp-listing-media">
                        <div class="mp-listing-no-media">
                            📷
                        </div>
                        <span class="mp-listing-category">
                            ${escapeHTML(category)}
                        </span>
                    </div>
                `;


        const videoButton =
            listing.video
                ? `
                    <button
                        type="button"
                        class="mp-small-btn"
                        data-video-id="${escapeHTML(listing.id)}"
                    >
                        🎥 Video
                    </button>
                `
                : "";


        const ownerButtons =
            ownerView
                ? `
                    <button
                        type="button"
                        class="mp-small-btn"
                        data-edit-id="${escapeHTML(listing.id)}"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        type="button"
                        class="mp-small-btn danger"
                        data-delete-id="${escapeHTML(listing.id)}"
                    >
                        🗑️ Delete
                    </button>
                `
                : "";


        card.innerHTML = `

            ${mediaHTML}

            <div class="mp-listing-body">

                <h3 class="mp-listing-title">
                    ${escapeHTML(listing.title)}
                </h3>

                ${
                    listing.price
                        ? `
                            <div class="mp-listing-price">
                                ${escapeHTML(listing.price)}
                            </div>
                        `
                        : ""
                }

                <div class="mp-listing-meta">

                    ${
                        listing.brand
                            ? `
                                <span>
                                    🏷️ ${escapeHTML(listing.brand)}
                                </span>
                            `
                            : ""
                    }

                    ${
                        listing.model
                            ? `
                                <span>
                                    🔖 ${escapeHTML(listing.model)}
                                </span>
                            `
                            : ""
                    }

                    ${
                        listing.year
                            ? `
                                <span>
                                    📅 ${escapeHTML(listing.year)}
                                </span>
                            `
                            : ""
                    }

                    <span>
                        📍 ${escapeHTML(location)}
                    </span>

                </div>

                <div class="mp-listing-description">
                    ${escapeHTML(listing.description)}
                </div>

                <div class="mp-seller">

                    <div class="mp-seller-photo">

                        ${
                            sellerPhoto
                                ? `
                                    <img
                                        src="${escapeHTML(sellerPhoto)}"
                                        alt=""
                                    >
                                `
                                : "👤"
                        }

                    </div>

                    <div class="mp-seller-info">

                        <div class="mp-seller-name">
                            ${escapeHTML(listing.sellerName)}
                        </div>

                        <div class="mp-seller-label">
                            Seller
                        </div>

                    </div>

                </div>

                <div class="mp-listing-actions">

                    <button
                        type="button"
                        class="mp-small-btn"
                        data-map-id="${escapeHTML(listing.id)}"
                    >
                        🗺️ Map
                    </button>

                    ${
                        !ownerView
                            ? `
                                <button
                                    type="button"
                                    class="mp-small-btn"
                                    data-contact-id="${escapeHTML(listing.id)}"
                                >
                                    💬 Contact Seller
                                </button>
                            `
                            : ""
                    }

                    ${videoButton}

                    ${ownerButtons}

                </div>

            </div>
        `;


        return card;

    }


    /* =====================================================
       MY LISTINGS
    ====================================================== */

    function renderMyListings() {

        const container =
            $("#mpMyListings");

        if (!container) {

            return;

        }

        container.innerHTML = "";


        if (!currentProfile) {

            container.innerHTML = `
                <div class="mp-empty">
                    <div class="mp-empty-icon">
                        👤
                    </div>

                    <h3>
                        Login required
                    </h3>

                    <p>
                        Login or register to see your listings.
                    </p>
                </div>
            `;

            return;

        }


        const userId =
            getUserId();

        const mine =
            listings.filter(
                listing =>
                    listing.ownerId ===
                    userId &&
                    listing.status !==
                    "deleted"
            );


        if (!mine.length) {

            container.innerHTML = `
                <div class="mp-empty">
                    <div class="mp-empty-icon">
                        📁
                    </div>

                    <h3>
                        No listings yet
                    </h3>

                    <p>
                        Create your first marketplace listing.
                    </p>
                </div>
            `;

            return;

        }


        mine.forEach(
            listing => {

                container.appendChild(
                    createListingCard(
                        listing,
                        true
                    )
                );

            }
        );

    }


    /* =====================================================
       OPEN / CLOSE PANELS
    ====================================================== */

    function openPanel(panelName) {

        const map = {

            account:
                "#mpAccountPanel",

            listing:
                "#mpListingPanel",

            mine:
                "#mpMyListingsPanel",

            map:
                "#mpMapPanel"

        };


        const selector =
            map[panelName];

        if (!selector) {

            return;

        }

        const panel =
            $(selector);

        if (!panel) {

            return;

        }


        panel.classList.remove(
            "mp-hidden"
        );


        panel.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function closePanel(panelName) {

        const map = {

            account:
                "#mpAccountPanel",

            listing:
                "#mpListingPanel",

            mine:
                "#mpMyListingsPanel"

        };


        const selector =
            map[panelName];

        if (!selector) {

            return;

        }


        const panel =
            $(selector);

        if (panel) {

            panel.classList.add(
                "mp-hidden"
            );

        }

    }


    /* =====================================================
       ACCOUNT STATUS
    ====================================================== */

    function setAccountStatus(
        message,
        type
    ) {

        const box =
            $("#mpAccountStatus");

        if (!box) {

            return;

        }

        box.textContent =
            message || "";

        box.className =
            "mp-status" +
            (
                type
                    ? " " + type
                    : ""
            );

    }


    /* =====================================================
       LISTING STATUS
    ====================================================== */

    function setListingStatus(
        message,
        type
    ) {

        const box =
            $("#mpListingStatus");

        if (!box) {

            return;

        }

        box.textContent =
            message || "";

        box.className =
            "mp-status" +
            (
                type
                    ? " " + type
                    : ""
            );

    }


    /* =====================================================
       ACCOUNT FORM
    ====================================================== */

    async function handleAccountSubmit(
        event
    ) {

        event.preventDefault();


        const country =
            safeText(
                $("#mpAccountCountry")?.value
            ).toUpperCase();

        const fullName =
            safeText(
                $("#mpFullName")?.value
            );

        const email =
            safeText(
                $("#mpEmail")?.value
            ).toLowerCase();

        const password =
            $("#mpPassword")?.value || "";

        const terms =
            $("#mpAccountTerms")?.checked;


        if (!country) {

            setAccountStatus(
                "Please select your country.",
                "error"
            );

            return;

        }


        if (!fullName) {

            setAccountStatus(
                "Please enter your full name.",
                "error"
            );

            return;

        }


        if (!email) {

            setAccountStatus(
                "Please enter your email.",
                "error"
            );

            return;

        }


        if (
            password.length < 6
        ) {

            setAccountStatus(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;

        }


        if (!terms) {

            setAccountStatus(
                "You must accept the Marketplace Terms.",
                "error"
            );

            return;

        }


        const photoInput =
            $("#mpProfilePhoto");

        let profilePhoto =
            currentProfile?.photo ||
            "";


        if (
            photoInput &&
            photoInput.files &&
            photoInput.files[0]
        ) {

            const file =
                photoInput.files[0];

            /*
             * Local fallback profile images are
             * intentionally limited in size.
             */

            if (
                file.size <=
                2 * 1024 * 1024
            ) {

                try {

                    profilePhoto =
                        await fileToDataURL(
                            file
                        );

                } catch (error) {

                    console.error(
                        error
                    );

                }

            }

        }


        setAccountStatus(
            "Processing account...",
            ""
        );


        /*
         * Firebase authentication.
         *
         * The existing project Firebase module is
         * used only when it is actually configured.
         */

        if (
            firebaseReady()
        ) {

            try {

                const firebase =
                    window.HistoryVerseFirebase;


                let result = null;


                if (
                    typeof firebase.login ===
                    "function"
                ) {

                    result =
                        await firebase.login(
                            email,
                            password
                        );

                }


                const firebaseUser =
                    result?.user ||
                    result ||
                    null;


                saveProfile({

                    uid:
                        firebaseUser?.uid ||
                        makeLocalUserId(),

                    name:
                        fullName,

                    email:
                        email,

                    country:
                        country,

                    photo:
                        profilePhoto,

                    loggedIn:
                        true,

                    updatedAt:
                        Date.now()

                });


                setAccountStatus(
                    "Account login successful.",
                    "success"
                );


                renderMyListings();

                renderListings();

                return;

            } catch (error) {

                console.warn(
                    "Firebase login was not completed:",
                    error
                );

                /*
                 * If Firebase is not configured,
                 * safely fall through to the local
                 * marketplace profile mode.
                 */

            }

        }


        /*
         * Local fallback.
         *
         * Password is intentionally NOT saved
         * in localStorage.
         */

        const existingId =
            currentProfile?.uid ||
            makeLocalUserId();


        saveProfile({

            uid:
                existingId,

            name:
                fullName,

            email:
                email,

            country:
                country,

            photo:
                profilePhoto,

            loggedIn:
                true,

            updatedAt:
                Date.now()

        });


        setAccountStatus(
            "Marketplace profile is ready on this device. Cloud account login will activate when Firebase is configured.",
            "success"
        );


        renderMyListings();

        renderListings();

    }


    /* =====================================================
       LOGOUT
    ====================================================== */

    async function logout() {

        if (
            firebaseReady() &&
            typeof window.HistoryVerseFirebase.logout ===
                "function"
        ) {

            try {

                await window.HistoryVerseFirebase.logout();

            } catch (error) {

                console.warn(
                    "Firebase logout:",
                    error
                );

            }

        }


        clearProfile();

        renderMyListings();

        renderListings();

        setAccountStatus(
            "Logged out.",
            "success"
        );

    }


    /* =====================================================
       FILL ACCOUNT FORM
    ====================================================== */

    function fillAccountForm() {

        if (!currentProfile) {

            return;

        }


        const country =
            $("#mpAccountCountry");

        const name =
            $("#mpFullName");

        const email =
            $("#mpEmail");


        if (country) {

            country.value =
                currentProfile.country ||
                "";

        }


        if (name) {

            name.value =
                currentProfile.name ||
                "";

        }


        if (email) {

            email.value =
                currentProfile.email ||
                "";

        }

    }


    /* =====================================================
       OPEN NEW LISTING
    ====================================================== */

    function openNewListing() {

        if (!currentProfile) {

            openPanel(
                "account"
            );

            setAccountStatus(
                "Login or register before creating a listing.",
                "error"
            );

            return;

        }


        editingListingId = null;

        clearListingForm();

        const title =
            $("#mpListingFormTitle");

        if (title) {

            title.textContent =
                "Create Listing";

        }


        const country =
            $("#mpListingCountry");

        if (
            country &&
            currentProfile.country
        ) {

            country.value =
                currentProfile.country;

        }


        openPanel(
            "listing"
        );

    }


    /* =====================================================
       CLEAR LISTING FORM
    ====================================================== */

    function clearListingForm() {

        const form =
            $("#mpListingForm");

        if (!form) {

            return;

        }

        form.reset();

        const id =
            $("#mpListingId");

        if (id) {

            id.value = "";

        }

        editingListingId =
            null;

        setListingStatus(
            "",
            ""
        );

    }


    /* =====================================================
       EDIT LISTING
    ====================================================== */

    function editListing(
        listingId
    ) {

        if (!currentProfile) {

            return;

        }


        const listing =
            listings.find(
                item =>
                    item.id ===
                    listingId
            );


        if (!listing) {

            return;

        }


        if (
            listing.ownerId !==
            getUserId()
        ) {

            return;

        }


        editingListingId =
            listing.id;


        const title =
            $("#mpListingFormTitle");

        if (title) {

            title.textContent =
                "Edit Listing";

        }


        setValue(
            "#mpListingId",
            listing.id
        );

        setValue(
            "#mpListingCountry",
            listing.country
        );

        setValue(
            "#mpListingCategory",
            listing.category
        );

        setValue(
            "#mpListingTitle",
            listing.title
        );

        setValue(
            "#mpListingBrand",
            listing.brand
        );

        setValue(
            "#mpListingModel",
            listing.model
        );

        setValue(
            "#mpListingYear",
            listing.year
        );

        setValue(
            "#mpListingCondition",
            listing.condition
        );

        setValue(
            "#mpListingPrice",
            listing.price
        );

        setValue(
            "#mpListingCity",
            listing.city
        );

        setValue(
            "#mpListingState",
            listing.state
        );

        setValue(
            "#mpListingRoad",
            listing.road
        );

        setValue(
            "#mpListingLat",
            listing.lat
        );

        setValue(
            "#mpListingLng",
            listing.lng
        );

        setValue(
            "#mpListingDescription",
            listing.description
        );


        const legal =
            $("#mpListingLegal");

        if (legal) {

            legal.checked =
                true;

        }


        openPanel(
            "listing"
        );

    }


    function setValue(
        selector,
        value
    ) {

        const element =
            $(selector);

        if (element) {

            element.value =
                value == null
                    ? ""
                    : value;

        }

    }


    /* =====================================================
       SAVE LISTING
    ====================================================== */

    async function handleListingSubmit(
        event
    ) {

        event.preventDefault();


        if (!currentProfile) {

            openPanel(
                "account"
            );

            setListingStatus(
                "Login or register before publishing a listing.",
                "error"
            );

            return;

        }


        const country =
            safeText(
                $("#mpListingCountry")?.value
            ).toUpperCase();

        const category =
            safeText(
                $("#mpListingCategory")?.value
            );

        const title =
            safeText(
                $("#mpListingTitle")?.value
            );

        const brand =
            safeText(
                $("#mpListingBrand")?.value
            );

        const model =
            safeText(
                $("#mpListingModel")?.value
            );

        const year =
            safeText(
                $("#mpListingYear")?.value
            );

        const condition =
            safeText(
                $("#mpListingCondition")?.value
            );

        const price =
            safeText(
                $("#mpListingPrice")?.value
            );

        const city =
            safeText(
                $("#mpListingCity")?.value
            );

        const state =
            safeText(
                $("#mpListingState")?.value
            );

        const road =
            safeText(
                $("#mpListingRoad")?.value
            );

        const lat =
            Number(
                $("#mpListingLat")?.value
            );

        const lng =
            Number(
                $("#mpListingLng")?.value
            );

        const description =
            safeText(
                $("#mpListingDescription")?.value
            );

        const legal =
            $("#mpListingLegal")?.checked;


        /* -------------------------------------------------
           Required fields
        -------------------------------------------------- */

        if (!country) {

            setListingStatus(
                "Country is required.",
                "error"
            );

            return;

        }


        if (!category) {

            setListingStatus(
                "Please select a category.",
                "error"
            );

            return;

        }


        if (!title) {

            setListingStatus(
                "Listing title is required.",
                "error"
            );

            return;

        }


        if (!city) {

            setListingStatus(
                "City is required.",
                "error"
            );

            return;

        }


        if (!road) {

            setListingStatus(
                "Road / Area / Location is required.",
                "error"
            );

            return;

        }


        if (
            !validCoordinates(
                lat,
                lng
            )
        ) {

            setListingStatus(
                "Valid latitude and longitude are required.",
                "error"
            );

            return;

        }


        if (!description) {

            setListingStatus(
                "Description is required.",
                "error"
            );

            return;

        }


        if (!legal) {

            setListingStatus(
                "You must accept the listing responsibility rules.",
                "error"
            );

            return;

        }


        /* -------------------------------------------------
           Safety check
        -------------------------------------------------- */

        const safety =
            validateListingContent({

                title,

                brand,

                model,

                condition,

                price,

                description,

                city,

                state,

                road,

                category

            });


        if (!safety.valid) {

            setListingStatus(
                safety.message,
                "error"
            );

            return;

        }


        setListingStatus(
            "Preparing listing...",
            ""
        );


        /* -------------------------------------------------
           Existing listing
        -------------------------------------------------- */

        let existing =
            editingListingId
                ? listings.find(
                    item =>
                        item.id ===
                        editingListingId
                )
                : null;


        /* -------------------------------------------------
           Photos
        -------------------------------------------------- */

        let photos =
            existing?.photos || [];


        const photoInput =
            $("#mpListingPhotos");


        if (
            photoInput &&
            photoInput.files &&
            photoInput.files.length
        ) {

            const selectedPhotos =
                await filesToDataURLs(
                    photoInput.files
                );


            if (
                selectedPhotos.length
            ) {

                photos =
                    selectedPhotos;

            }

        }


        /* -------------------------------------------------
           Video
        -------------------------------------------------- */

        let video =
            existing?.video || "";


        const videoInput =
            $("#mpListingVideo");


        if (
            videoInput &&
            videoInput.files &&
            videoInput.files[0]
        ) {

            const videoFile =
                videoInput.files[0];


            /*
             * Local fallback video limit.
             */

            if (
                videoFile.size <=
                4 * 1024 * 1024
            ) {

                try {

                    video =
                        await fileToDataURL(
                            videoFile
                        );

                } catch (error) {

                    console.error(
                        error
                    );

                }

            } else {

                setListingStatus(
                    "Local fallback videos are limited to 4 MB. Configure cloud storage for larger media.",
                    "error"
                );

                return;

            }

        }


        /* -------------------------------------------------
           Listing object
        -------------------------------------------------- */

        const now =
            Date.now();


        const listing =
            normalizeListing({

                id:
                    existing?.id ||
                    undefined,

                ownerId:
                    getUserId(),

                sellerName:
                    currentProfile.name ||
                    "Marketplace User",

                sellerPhoto:
                    currentProfile.photo ||
                    "",

                country,

                category,

                title,

                brand,

                model,

                year,

                condition,

                price,

                description,

                city,

                state,

                road,

                lat,

                lng,

                photos,

                video,

                createdAt:
                    existing?.createdAt ||
                    now,

                updatedAt:
                    now,

                status:
                    "published"

            });


        /* -------------------------------------------------
           Save
        -------------------------------------------------- */

        if (existing) {

            const index =
                listings.findIndex(
                    item =>
                        item.id ===
                        existing.id
                );


            if (index >= 0) {

                listings[index] =
                    listing;

            }

        } else {

            listings.unshift(
                listing
            );

        }


        const saved =
            saveListings();


        if (!saved) {

            setListingStatus(
                "Could not save the listing on this device.",
                "error"
            );

            return;

        }


        setListingStatus(
            "Listing saved successfully.",
            "success"
        );


        editingListingId =
            null;


        renderListings();

        renderMyListings();


        /*
         * Clear form after a short delay,
         * so the success message can be seen.
         */

        setTimeout(
            function () {

                clearListingForm();

                closePanel(
                    "listing"
                );

            },
            700
        );

    }


    /* =====================================================
       DELETE LISTING
    ====================================================== */

    function deleteListing(
        listingId
    ) {

        if (!currentProfile) {

            return;

        }


        const listing =
            listings.find(
                item =>
                    item.id ===
                    listingId
            );


        if (!listing) {

            return;

        }


        if (
            listing.ownerId !==
            getUserId()
        ) {

            return;

        }


        const confirmed =
            window.confirm(
                "Delete this listing?"
            );


        if (!confirmed) {

            return;

        }


        listings =
            listings.filter(
                item =>
                    item.id !==
                    listingId
            );


        saveListings();

        renderListings();

        renderMyListings();

    }


    /* =====================================================
       CONTACT SELLER
    ====================================================== */

    function contactSeller(
        listingId
    ) {

        const listing =
            listings.find(
                item =>
                    item.id ===
                    listingId
            );


        if (!listing) {

            return;

        }


        /*
         * Do not expose seller phone/email.
         *
         * This prototype opens a private
         * contact message prompt. A future
         * server-backed messaging system can
         * store and deliver the message.
         */

        if (!currentProfile) {

            openPanel(
                "account"
            );

            setAccountStatus(
                "Login or register to contact a seller privately.",
                "error"
            );

            return;

        }


        const message =
            window.prompt(
                "Write your private message to " +
                listing.sellerName +
                ":"
            );


        if (!message) {

            return;

        }


        /*
         * For now we keep the message only as a
         * local pending message record.
         *
         * No private seller contact data is exposed.
         */

        const messagesKey =
            "alon_historyverse_marketplace_messages_v1";


        let messages = [];


        try {

            messages =
                JSON.parse(
                    localStorage.getItem(
                        messagesKey
                    ) || "[]"
                );

        } catch (error) {

            messages = [];

        }


        messages.push({

            id:
                "msg_" +
                Date.now(),

            listingId:
                listing.id,

            senderId:
                getUserId(),

            senderName:
                currentProfile.name,

            message:
                message,

            createdAt:
                Date.now(),

            status:
                "pending"

        });


        try {

            localStorage.setItem(
                messagesKey,
                JSON.stringify(messages)
            );

        } catch (error) {

            console.error(
                error
            );

        }


        window.alert(
            "Your private contact request was saved. Seller contact details were not publicly exposed."
        );

    }


    /* =====================================================
       VIDEO VIEWER
    ====================================================== */

    function showVideo(
        listingId
    ) {

        const listing =
            listings.find(
                item =>
                    item.id ===
                    listingId
            );


        if (
            !listing ||
            !listing.video
        ) {

            return;

        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.style.position =
            "fixed";

        overlay.style.inset =
            "0";

        overlay.style.zIndex =
            "99999";

        overlay.style.background =
            "rgba(0,0,0,0.9)";

        overlay.style.display =
            "flex";

        overlay.style.alignItems =
            "center";

        overlay.style.justifyContent =
            "center";

        overlay.style.padding =
            "20px";


        overlay.innerHTML = `

            <div
                style="
                    width:min(900px,100%);
                    background:#0b111c;
                    border:1px solid #d7b35a;
                    border-radius:14px;
                    padding:14px;
                "
            >

                <button
                    type="button"
                    id="mpVideoClose"
                    style="
                        float:right;
                        background:transparent;
                        border:1px solid #d7b35a;
                        color:#f0d27a;
                        border-radius:8px;
                        padding:6px 10px;
                        cursor:pointer;
                        font-size:20px;
                    "
                >
                    ×
                </button>

                <video
                    src="${escapeHTML(listing.video)}"
                    controls
                    playsinline
                    style="
                        width:100%;
                        max-height:75vh;
                        margin-top:35px;
                        border-radius:10px;
                        background:#000;
                    "
                ></video>

            </div>
        `;


        document.body.appendChild(
            overlay
        );


        const close =
            $("#mpVideoClose");


        if (close) {

            close.addEventListener(
                "click",
                function () {

                    overlay.remove();

                }
            );

        }


        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    overlay.remove();

                }

            }
        );

    }


    /* =====================================================
       MAP INITIALIZATION
    ====================================================== */

    function initMap() {

        if (
            !window.L ||
            !$("#alonMap")
        ) {

            return;

        }


        if (alonMap) {

            return;

        }


        alonMap =
            window.L.map(
                "alonMap",
                {
                    zoomControl: true
                }
            ).setView(
                [20, 0],
                2
            );


        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    "&copy; OpenStreetMap contributors"
            }
        ).addTo(
            alonMap
        );


        updateMap(
            getFilteredListings()
        );

    }


    /* =====================================================
       UPDATE MAP
    ====================================================== */

    function updateMap(
        mapListings
    ) {

        if (!alonMap) {

            return;

        }


        mapMarkers.forEach(
            marker => {

                try {

                    alonMap.removeLayer(
                        marker
                    );

                } catch (error) {

                    console.warn(
                        error
                    );

                }

            }
        );


        mapMarkers = [];


        const bounds = [];


        mapListings.forEach(
            listing => {

                if (
                    !validCoordinates(
                        listing.lat,
                        listing.lng
                    )
                ) {

                    return;

                }


                const marker =
                    window.L.marker([
                        Number(listing.lat),
                        Number(listing.lng)
                    ]).addTo(
                        alonMap
                    );


                const country =
                    getCountryName(
                        listing.country
                    );


                marker.bindPopup(`
                    <div>
                        <strong>
                            ${escapeHTML(listing.title)}
                        </strong>

                        <br>

                        <span>
                            ${escapeHTML(country)}
                        </span>

                        <br>

                        <span>
                            📍 ${escapeHTML(listing.city)}
                        </span>

                        ${
                            listing.price
                                ? `
                                    <br>
                                    <strong>
                                        ${escapeHTML(listing.price)}
                                    </strong>
                                `
                                : ""
                        }
                    </div>
                `);


                mapMarkers.push(
                    marker
                );


                bounds.push([
                    Number(listing.lat),
                    Number(listing.lng)
                ]);

            }
        );


        if (
            bounds.length === 1
        ) {

            alonMap.setView(
                bounds[0],
                13
            );

        } else if (
            bounds.length > 1
        ) {

            alonMap.fitBounds(
                bounds,
                {
                    padding: [
                        35,
                        35
                    ]
                }
            );

        }

    }


    /* =====================================================
       FOCUS MAP LISTING
    ====================================================== */

    function focusListingOnMap(
        listingId
    ) {

        const listing =
            listings.find(
                item =>
                    item.id ===
                    listingId
            );


        if (
            !listing ||
            !validCoordinates(
                listing.lat,
                listing.lng
            )
        ) {

            return;

        }


        openPanel(
            "map"
        );


        setTimeout(
            function () {

                initMap();


                if (!alonMap) {

                    return;

                }


                alonMap.setView(
                    [
                        Number(listing.lat),
                        Number(listing.lng)
                    ],
                    14
                );


                const marker =
                    mapMarkers.find(
                        item => {

                            const position =
                                item.getLatLng();

                            return (
                                Math.abs(
                                    position.lat -
                                    Number(listing.lat)
                                ) < 0.000001 &&
                                Math.abs(
                                    position.lng -
                                    Number(listing.lng)
                                ) < 0.000001
                            );

                        }
                    );


                if (marker) {

                    marker.openPopup();

                }

            },
            250
        );

    }


    /* =====================================================
       CURRENT LOCATION
    ====================================================== */

    function useCurrentLocation() {

        if (
            !navigator.geolocation
        ) {

            setListingStatus(
                "Geolocation is not supported by this browser.",
                "error"
            );

            return;

        }


        setListingStatus(
            "Finding your location...",
            ""
        );


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                setValue(
                    "#mpListingLat",
                    lat
                );

                setValue(
                    "#mpListingLng",
                    lng
                );


                setListingStatus(
                    "Current location added.",
                    "success"
                );


                if (alonMap) {

                    alonMap.setView(
                        [
                            lat,
                            lng
                        ],
                        14
                    );

                }

            },

            function (error) {

                console.warn(
                    "Geolocation error:",
                    error
                );


                setListingStatus(
                    "Could not get your location. Please enter coordinates manually.",
                    "error"
                );

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 60000

            }

        );

    }


    /* =====================================================
       MAP CURRENT LOCATION
    ====================================================== */

    function locateUserOnMap() {

        if (
            !navigator.geolocation
        ) {

            return;

        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                initMap();


                if (!alonMap) {

                    return;

                }


                alonMap.setView(
                    [
                        lat,
                        lng
                    ],
                    14
                );


                window.L.circleMarker(
                    [
                        lat,
                        lng
                    ],
                    {
                        radius: 8
                    }
                )
                    .addTo(alonMap)
                    .bindPopup(
                        "📍 Your current location"
                    )
                    .openPopup();

            },

            function () {

                window.alert(
                    "Could not access your location."
                );

            },

            {
                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 60000

            }

        );

    }


    /* =====================================================
       EVENT DELEGATION
    ====================================================== */

    function bindListingActions() {

        document.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target.closest(
                        "[data-map-id], [data-edit-id], [data-delete-id], [data-contact-id], [data-video-id]"
                    );


                if (!target) {

                    return;

                }


                if (
                    target.dataset.mapId
                ) {

                    focusListingOnMap(
                        target.dataset.mapId
                    );

                    return;

                }


                if (
                    target.dataset.editId
                ) {

                    editListing(
                        target.dataset.editId
                    );

                    return;

                }


                if (
                    target.dataset.deleteId
                ) {

                    deleteListing(
                        target.dataset.deleteId
                    );

                    return;

                }


                if (
                    target.dataset.contactId
                ) {

                    contactSeller(
                        target.dataset.contactId
                    );

                    return;

                }


                if (
                    target.dataset.videoId
                ) {

                    showVideo(
                        target.dataset.videoId
                    );

                }

            }
        );

    }


    /* =====================================================
       FILTER EVENTS
    ====================================================== */

    function bindFilters() {

        const country =
            $("#mpCountryFilter");

        const category =
            $("#mpCategoryFilter");

        const search =
            $("#mpSearch");

        const searchBtn =
            $("#mpSearchBtn");


        if (country) {

            country.addEventListener(
                "change",
                renderListings
            );

        }


        if (category) {

            category.addEventListener(
                "change",
                renderListings
            );

        }


        if (search) {

            search.addEventListener(
                "input",
                function () {

                    renderListings();

                }
            );

            search.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        renderListings();

                    }

                }
            );

        }


        if (searchBtn) {

            searchBtn.addEventListener(
                "click",
                renderListings
            );

        }

    }


    /* =====================================================
       ACTION BUTTONS
    ====================================================== */

    function bindActions() {

        $all(
            "[data-market-action]"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const action =
                            button.dataset.marketAction;


                        if (
                            action ===
                            "login"
                        ) {

                            fillAccountForm();

                            openPanel(
                                "account"
                            );

                            return;

                        }


                        if (
                            action ===
                            "create"
                        ) {

                            openNewListing();

                            return;

                        }


                        if (
                            action ===
                            "jobs"
                        ) {

                            if (
                                $("#mpCategoryFilter")
                            ) {

                                $("#mpCategoryFilter").value =
                                    "job";

                            }

                            renderListings();

                            document
                                .querySelector(
                                    ".mp-listings-section"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });

                            return;

                        }


                        if (
                            action ===
                            "map"
                        ) {

                            openPanel(
                                "map"
                            );

                            setTimeout(
                                initMap,
                                250
                            );

                            return;

                        }


                        if (
                            action ===
                            "mine"
                        ) {

                            renderMyListings();

                            openPanel(
                                "mine"
                            );

                        }

                    }
                );

            }
        );


        const loginOpen =
            $("#mpLoginOpenBtn");

        if (loginOpen) {

            loginOpen.addEventListener(
                "click",
                function () {

                    fillAccountForm();

                    openPanel(
                        "account"
                    );

                }
            );

        }


        const createHero =
            $("#mpCreateHeroBtn");

        if (createHero) {

            createHero.addEventListener(
                "click",
                openNewListing
            );

        }


        const mapHero =
            $("#mpMapHeroBtn");

        if (mapHero) {

            mapHero.addEventListener(
                "click",
                function () {

                    openPanel(
                        "map"
                    );

                    setTimeout(
                        initMap,
                        250
                    );

                }
            );

        }


        const logout =
            $("#mpLogoutBtn");

        if (logout) {

            logout.addEventListener(
                "click",
                logoutHandler
            );

        }


        const currentLocation =
            $("#mpCurrentLocationBtn");

        if (currentLocation) {

            currentLocation.addEventListener(
                "click",
                useCurrentLocation
            );

        }


        const locate =
            $("#mpLocateMeBtn");

        if (locate) {

            locate.addEventListener(
                "click",
                locateUserOnMap
            );

        }


        const clear =
            $("#mpClearListingBtn");

        if (clear) {

            clear.addEventListener(
                "click",
                clearListingForm
            );

        }

    }


    async function logoutHandler() {

        await logout();

    }


    /* =====================================================
       CLOSE BUTTONS
    ====================================================== */

    function bindCloseButtons() {

        $all(
            "[data-close-panel]"
        ).forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        closePanel(
                            button.dataset.closePanel
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       FORBIDDEN CATEGORY CHECK
    ====================================================== */

    function bindCategorySafety() {

        const category =
            $("#mpListingCategory");


        if (!category) {

            return;

        }


        category.addEventListener(
            "change",
            function () {

                /*
                 * No animal/bird category exists.
                 * This extra check keeps the system
                 * protected if a category is later
                 * added incorrectly.
                 */

                const value =
                    category.value.toLowerCase();


                if (
                    /animal|bird|wildlife|pet/.test(
                        value
                    )
                ) {

                    category.value = "";

                    setListingStatus(
                        "Animals and birds are not allowed in the marketplace.",
                        "error"
                    );

                }

            }
        );

    }


    /* =====================================================
       ACCOUNT PROFILE DISPLAY
    ====================================================== */

    function updateAccountButton() {

        const button =
            $("#mpLoginOpenBtn");

        if (!button) {

            return;

        }


        if (
            currentProfile &&
            currentProfile.name
        ) {

            button.textContent =
                "👤 " +
                currentProfile.name;

        } else {

            button.textContent =
                "👤 Login / Register";

        }

    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    function init() {

        populateCountries();

        loadListings();

        loadProfile();

        fillAccountForm();

        updateAccountButton();

        renderListings();

        renderMyListings();

        bindFilters();

        bindActions();

        bindCloseButtons();

        bindListingActions();

        bindCategorySafety();


        const accountForm =
            $("#mpAccountForm");

        if (accountForm) {

            accountForm.addEventListener(
                "submit",
                handleAccountSubmit
            );

        }


        const listingForm =
            $("#mpListingForm");

        if (listingForm) {

            listingForm.addEventListener(
                "submit",
                handleListingSubmit
            );

        }


        /*
         * Initialize the map after the page
         * becomes visible.
         */

        setTimeout(
            function () {

                if (
                    $("#mpMapPanel") &&
                    !$("#mpMapPanel").classList.contains(
                        "mp-hidden"
                    )
                ) {

                    initMap();

                }

            },
            300
        );


        console.log(
            "ALON HISTORYVERSE 24 Global Marketplace initialized."
        );

    }


    /* =====================================================
       DOM READY
    ====================================================== */

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


    /* =====================================================
       PUBLIC API
    ====================================================== */

    window.ALONMarketplace = {

        getListings:
            function () {

                return listings.slice();

            },

        refresh:
            function () {

                loadListings();

                renderListings();

                renderMyListings();

            },

        openCreate:
            openNewListing,

        openMap:
            function () {

                openPanel("map");

                setTimeout(
                    initMap,
                    250
                );

            }

    };


})();