/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE ENGINE
   ---------------------------------------------------------
   Version: 24.5 SAFE REGULAR MARKETPLACE
   Creator: Baba Thecno Guru

   IMPORTANT:
   - THIS FILE IS FOR REGULAR MARKETPLACE ONLY.
   - GLOBAL MARKETPLACE FILES ARE NOT MODIFIED.
   - Country system uses marketplace-countries.js.
   - Login / Logout
   - Item / Property / Vehicle
   - New / Used / Refurbished / N/A
   - Save / Edit / Delete
   - Image / Video
   - Private own listings
   - Showroom / Business Advertisement
   - $10 USD showroom advertisement
   - Global / International / Local Ad
   ========================================================= */

(function () {
    "use strict";

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

    const CATEGORY_DATA = {
        item: [
            "General Item",
            "Electronics",
            "Mobile Phone",
            "Computer / Laptop",
            "Tablet",
            "Camera",
            "TV",
            "Home Appliance",
            "Furniture",
            "Clothing",
            "Shoes",
            "Watch",
            "Jewellery",
            "Books",
            "Sports Item",
            "Tools",
            "Machinery",
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

    function byId(id) {
        return document.getElementById(id);
    }

    function safeJSONParse(value, fallback) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function readStorage(key, fallback) {
        const value = localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return safeJSONParse(value, fallback);
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getListings() {
        const value = readStorage(CONFIG.listingsKey, []);
        return Array.isArray(value) ? value : [];
    }

    function setListings(listings) {
        writeStorage(CONFIG.listingsKey, listings);
    }

    function getShowrooms() {
        const value = readStorage(CONFIG.showroomsKey, []);
        return Array.isArray(value) ? value : [];
    }

    function setShowrooms(showrooms) {
        writeStorage(CONFIG.showroomsKey, showrooms);
    }

    function getAccount() {
        return readStorage(CONFIG.accountKey, null);
    }

    function getSession() {
        return readStorage(CONFIG.sessionKey, null);
    }

    function isLoggedIn() {
        return !!getSession();
    }

    function getLoggedEmail() {
        const session = getSession();

        if (!session) {
            return "";
        }

        return session.email || "";
    }

    function setStatus(id, message, success) {
        const element = byId(id);

        if (!element) {
            return;
        }

        element.textContent = message || "";
        element.dataset.status = success ? "success" : "error";
    }

    function getCountryDatabase() {
        if (
            Array.isArray(window.MARKETPLACE_COUNTRIES) &&
            window.MARKETPLACE_COUNTRIES.length
        ) {
            return window.MARKETPLACE_COUNTRIES;
        }

        if (
            Array.isArray(window.ALON_MARKETPLACE_COUNTRIES) &&
            window.ALON_MARKETPLACE_COUNTRIES.length
        ) {
            return window.ALON_MARKETPLACE_COUNTRIES;
        }

        if (
            Array.isArray(window.ALON_WORLD_COUNTRIES) &&
            window.ALON_WORLD_COUNTRIES.length
        ) {
            return window.ALON_WORLD_COUNTRIES;
        }

        if (
            Array.isArray(window.WORLD_COUNTRIES) &&
            window.WORLD_COUNTRIES.length
        ) {
            return window.WORLD_COUNTRIES;
        }

        return [];
    }

    function populateCountryDirect(select) {
        if (!select) {
            return false;
        }

        const countries = getCountryDatabase();

        if (!countries.length) {
            return false;
        }

        const currentValue = select.value || "";

        select.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "🌍 Select Country";
        select.appendChild(placeholder);

        countries.forEach(function (country) {
            const option = document.createElement("option");

            const iso2 =
                country.iso2 ||
                country.code2 ||
                "";

            const iso3 =
                country.iso3 ||
                country.code3 ||
                "";

            const callingCode =
                country.callingCode ||
                country.phoneCode ||
                "";

            option.value = iso2;

            option.textContent =
                (country.flag || "🌍") +
                " " +
                (country.name || country.country || "") +
                " (" +
                iso2 +
                " • " +
                iso3 +
                ") " +
                callingCode;

            select.appendChild(option);
        });

        if (currentValue) {
            select.value = currentValue;
        }

        return true;
    }

    function populateRegularMarketplaceCountries() {
        const countryIds = [
            "rmCountry",
            "rmShowroomCountry"
        ];

        countryIds.forEach(function (id) {
            const select = byId(id);

            if (!select) {
                return;
            }

            let done = false;

            if (typeof window.ALON_FILL_COUNTRY_SELECT === "function") {
                done = window.ALON_FILL_COUNTRY_SELECT(select);
            }

            if (!done) {
                populateCountryDirect(select);
            }
        });
    }

    function retryCountryPopulation() {
        populateRegularMarketplaceCountries();

        let attempts = 0;

        const timer = setInterval(function () {
            attempts++;

            populateRegularMarketplaceCountries();

            const listingCountry = byId("rmCountry");
            const showroomCountry = byId("rmShowroomCountry");

            const listingReady =
                !listingCountry ||
                listingCountry.options.length > 1;

            const showroomReady =
                !showroomCountry ||
                showroomCountry.options.length > 1;

            if (
                (listingReady && showroomReady) ||
                attempts >= 10
            ) {
                clearInterval(timer);
            }
        }, 500);
    }

    function getSelectedCountry(selectId) {
        const select = byId(selectId);

        if (!select || !select.value) {
            return null;
        }

        const option =
            select.options[select.selectedIndex];

        if (!option) {
            return null;
        }

        const iso2 =
            option.dataset.iso2 ||
            option.value ||
            "";

        const country =
            option.dataset.country ||
            option.textContent ||
            "";

        const iso3 =
            option.dataset.iso3 ||
            "";

        const callingCode =
            option.dataset.callingCode ||
            "";

        const phoneCode =
            option.dataset.phoneCode ||
            callingCode;

        const flag =
            option.dataset.flag ||
            "🌍";

        return {
            name: country,
            country: country,
            flag: flag,
            iso2: iso2,
            iso3: iso3,
            code2: iso2,
            code3: iso3,
            callingCode: callingCode,
            phoneCode: phoneCode
        };
    }

    function populateSelect(select, values, placeholder) {
        if (!select) {
            return;
        }

        const oldValue = select.value;

        select.innerHTML = "";

        const first = document.createElement("option");
        first.value = "";
        first.textContent = placeholder || "Select";
        select.appendChild(first);

        values.forEach(function (value) {
            const option = document.createElement("option");

            option.value = value;
            option.textContent = value;

            select.appendChild(option);
        });

        if (oldValue) {
            select.value = oldValue;
        }
    }

    function populateListingCategories() {
        const typeSelect = byId("rmListingType");
        const categorySelect = byId("rmListingCategory");

        if (!typeSelect || !categorySelect) {
            return;
        }

        const type = String(typeSelect.value || "").toLowerCase();

        const categories =
            CATEGORY_DATA[type] ||
            [];

        populateSelect(
            categorySelect,
            categories,
            "Select Category"
        );
    }

    function populateListingTypes() {
        const select = byId("rmListingType");

        if (!select) {
            return;
        }

        populateSelect(
            select,
            ["item", "property", "vehicle"],
            "Select Type"
        );
    }

    function populateConditions() {
        const select = byId("rmListingCondition");

        if (!select) {
            return;
        }

        populateSelect(
            select,
            CONDITION_DATA,
            "Select Condition"
        );
    }

    function login() {
        const mobile =
            byId("rmLoginMobile")?.value.trim() || "";

        const email =
            byId("rmLoginEmail")?.value.trim().toLowerCase() || "";

        const password =
            byId("rmLoginPassword")?.value || "";

        if (!email) {
            setStatus(
                "rmLoginStatus",
                "Please enter your email.",
                false
            );
            return false;
        }

        if (!password) {
            setStatus(
                "rmLoginStatus",
                "Please enter your password.",
                false
            );
            return false;
        }

        const existingAccount = getAccount();

        if (
            existingAccount &&
            existingAccount.email === email &&
            existingAccount.password &&
            existingAccount.password !== password
        ) {
            setStatus(
                "rmLoginStatus",
                "Incorrect password.",
                false
            );
            return false;
        }

        const account = {
            mobile: mobile,
            email: email,
            password: password,
            updatedAt: Date.now()
        };

        writeStorage(
            CONFIG.accountKey,
            account
        );

        writeStorage(
            CONFIG.sessionKey,
            {
                email: email,
                loginAt: Date.now()
            }
        );

        updateLoginUI();

        setStatus(
            "rmLoginStatus",
            "Login successful.",
            true
        );

        setStatus(
            "rmMainStatus",
            "You are logged in as " + email,
            true
        );

        return true;
    }

    function logout() {
        localStorage.removeItem(CONFIG.sessionKey);

        updateLoginUI();

        setStatus(
            "rmMainStatus",
            "You have been logged out.",
            true
        );
    }

    function updateLoginUI() {
        const loginBox = byId("rmLoginBox");
        const profileBox = byId("rmProfileBox");
        const profileEmail = byId("rmProfileEmail");

        if (isLoggedIn()) {
            if (loginBox) {
                loginBox.style.display = "none";
            }

            if (profileBox) {
                profileBox.style.display = "";
            }

            if (profileEmail) {
                profileEmail.textContent =
                    getLoggedEmail();
            }
        } else {
            if (loginBox) {
                loginBox.style.display = "";
            }

            if (profileBox) {
                profileBox.style.display = "none";
            }
        }
    }

    function requireLogin() {
        if (isLoggedIn()) {
            return true;
        }

        setStatus(
            "rmMainStatus",
            "Please login first.",
            false
        );

        return false;
    }

    function readFileAsDataURL(file) {
        return new Promise(function (resolve, reject) {
            if (!file) {
                resolve("");
                return;
            }

            const reader = new FileReader();

            reader.onload = function () {
                resolve(reader.result || "");
            };

            reader.onerror = function () {
                reject(reader.error);
            };

            reader.readAsDataURL(file);
        });
    }

    async function readMultipleImages(input) {
        if (!input || !input.files) {
            return [];
        }

        const files =
            Array.from(input.files);

        const output = [];

        for (const file of files) {
            if (file.size > CONFIG.maxImageSize) {
                throw new Error(
                    "Image exceeds the 8 MB limit."
                );
            }

            const dataURL =
                await readFileAsDataURL(file);

            output.push({
                name: file.name,
                type: file.type,
                size: file.size,
                data: dataURL
            });
        }

        return output;
    }

    async function readSingleMedia(input, maxSize, label) {
        if (!input || !input.files || !input.files[0]) {
            return null;
        }

        const file = input.files[0];

        if (file.size > maxSize) {
            throw new Error(
                label + " exceeds the allowed size."
            );
        }

        const dataURL =
            await readFileAsDataURL(file);

        return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: dataURL
        };
    }

    async function saveListing(event) {
        if (event) {
            event.preventDefault();
        }

        if (!requireLogin()) {
            return;
        }

        const form = byId("regularListingForm");

        if (!form) {
            return;
        }

        const type =
            byId("rmListingType")?.value || "";

        const category =
            byId("rmListingCategory")?.value || "";

        const condition =
            byId("rmListingCondition")?.value || "";

        const title =
            byId("rmListingTitle")?.value.trim() || "";

        const price =
            byId("rmListingPrice")?.value.trim() || "";

        const state =
            byId("rmListingState")?.value.trim() || "";

        const pin =
            byId("rmListingPin")?.value.trim() || "";

        const description =
            byId("rmListingDescription")?.value.trim() || "";

        if (!type) {
            setStatus(
                "rmMainStatus",
                "Please select listing type.",
                false
            );
            return;
        }

        if (!category) {
            setStatus(
                "rmMainStatus",
                "Please select category.",
                false
            );
            return;
        }

        if (!condition) {
            setStatus(
                "rmMainStatus",
                "Please select condition.",
                false
            );
            return;
        }

        if (!title) {
            setStatus(
                "rmMainStatus",
                "Please enter listing title.",
                false
            );
            return;
        }

        if (!price) {
            setStatus(
                "rmMainStatus",
                "Please enter price.",
                false
            );
            return;
        }

        const country =
            getSelectedCountry("rmCountry");

        if (!country) {
            setStatus(
                "rmMainStatus",
                "Please select country.",
                false
            );
            return;
        }

        try {
            const imageInput =
                byId("rmListingImages");

            const videoInput =
                byId("rmListingVideo");

            const editingId =
                byId("rmEditingListingId")?.value || "";

            let images = [];

            if (imageInput && imageInput.files.length) {
                images =
                    await readMultipleImages(imageInput);
            }

            let video = null;

            if (videoInput && videoInput.files.length) {
                video =
                    await readSingleMedia(
                        videoInput,
                        CONFIG.maxVideoSize,
                        "Video"
                    );
            }

            const listings = getListings();

            const oldIndex =
                listings.findIndex(function (listing) {
                    return listing.id === editingId &&
                        listing.ownerEmail === getLoggedEmail();
                });

            let listing;

            if (oldIndex >= 0) {
                listing = listings[oldIndex];

                listing.type = type;
                listing.category = category;
                listing.condition = condition;
                listing.title = title;
                listing.price = price;
                listing.country = country;
                listing.state = state;
                listing.pin = pin;
                listing.description = description;
                listing.updatedAt = Date.now();

                if (images.length) {
                    listing.images = images;
                }

                if (video) {
                    listing.video = video;
                }

                listings[oldIndex] = listing;
            } else {
                listing = {
                    id:
                        "rm_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .slice(2, 8),

                    ownerEmail:
                        getLoggedEmail(),

                    type: type,
                    category: category,
                    condition: condition,
                    title: title,
                    price: price,
                    country: country,
                    state: state,
                    pin: pin,
                    description: description,
                    images: images,
                    video: video,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };

                listings.unshift(listing);
            }

            setListings(listings);

            clearListingForm();
            renderListings();

            setStatus(
                "rmMainStatus",
                oldIndex >= 0
                    ? "Listing updated successfully."
                    : "Listing saved successfully.",
                true
            );

        } catch (error) {
            setStatus(
                "rmMainStatus",
                error.message ||
                    "Unable to save listing.",
                false
            );
        }
    }

    function editListing(id) {
        if (!requireLogin()) {
            return;
        }

        const listing =
            getListings().find(function (item) {
                return (
                    item.id === id &&
                    item.ownerEmail === getLoggedEmail()
                );
            });

        if (!listing) {
            return;
        }

        const editing =
            byId("rmEditingListingId");

        if (editing) {
            editing.value = listing.id;
        }

        const type = byId("rmListingType");
        const category = byId("rmListingCategory");
        const condition = byId("rmListingCondition");

        if (type) {
            type.value = listing.type;
            populateListingCategories();
        }

        if (category) {
            category.value = listing.category;
        }

        if (condition) {
            condition.value = listing.condition;
        }

        if (byId("rmListingTitle")) {
            byId("rmListingTitle").value =
                listing.title || "";
        }

        if (byId("rmListingPrice")) {
            byId("rmListingPrice").value =
                listing.price || "";
        }

        if (byId("rmListingState")) {
            byId("rmListingState").value =
                listing.state || "";
        }

        if (byId("rmListingPin")) {
            byId("rmListingPin").value =
                listing.pin || "";
        }

        if (byId("rmListingDescription")) {
            byId("rmListingDescription").value =
                listing.description || "";
        }

        if (byId("rmCountry")) {
            byId("rmCountry").value =
                listing.country?.iso2 || "";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function deleteListing(id) {
        if (!requireLogin()) {
            return;
        }

        const listings =
            getListings();

        const filtered =
            listings.filter(function (listing) {
                return !(
                    listing.id === id &&
                    listing.ownerEmail === getLoggedEmail()
                );
            });

        setListings(filtered);

        renderListings();

        setStatus(
            "rmMainStatus",
            "Listing deleted.",
            true
        );
    }

    function clearListingForm() {
        const form =
            byId("regularListingForm");

        if (form) {
            form.reset();
        }

        if (byId("rmEditingListingId")) {
            byId("rmEditingListingId").value = "";
        }

        populateListingCategories();
    }

    function renderListings() {
        const container =
            byId("rmListingsList");

        if (!container) {
            return;
        }

        const email =
            getLoggedEmail();

        const listings =
            getListings().filter(function (listing) {
                return listing.ownerEmail === email;
            });

        if (!isLoggedIn()) {
            container.innerHTML =
                "<p>Please login to view your listings.</p>";
            return;
        }

        if (!listings.length) {
            container.innerHTML =
                "<p>No listings found.</p>";
            return;
        }

        container.innerHTML = "";

        listings.forEach(function (listing) {
            const card =
                document.createElement("article");

            card.className =
                "rm-listing-card";

            const country =
                listing.country || {};

            const media =
                Array.isArray(listing.images)
                    ? listing.images
                    : [];

            let mediaHTML = "";

            media.forEach(function (image) {
                if (image && image.data) {
                    mediaHTML +=
                        '<img src="' +
                        image.data +
                        '" alt="' +
                        escapeHTML(listing.title) +
                        '">';
                }
            });

            if (
                listing.video &&
                listing.video.data
            ) {
                mediaHTML +=
                    '<video controls src="' +
                    listing.video.data +
                    '"></video>';
            }

            card.innerHTML =
                '<div class="rm-card-media">' +
                mediaHTML +
                "</div>" +

                "<h3>" +
                escapeHTML(listing.title) +
                "</h3>" +

                "<p><strong>Type:</strong> " +
                escapeHTML(listing.type) +
                "</p>" +

                "<p><strong>Category:</strong> " +
                escapeHTML(listing.category) +
                "</p>" +

                "<p><strong>Condition:</strong> " +
                escapeHTML(listing.condition) +
                "</p>" +

                "<p><strong>Price:</strong> " +
                escapeHTML(listing.price) +
                " " +
                CONFIG.currency +
                "</p>" +

                "<p><strong>Country:</strong> " +
                escapeHTML(
                    (country.flag || "🌍") +
                    " " +
                    (country.name || "")
                ) +
                "</p>" +

                "<p><strong>State:</strong> " +
                escapeHTML(listing.state || "") +
                "</p>" +

                "<p><strong>PIN:</strong> " +
                escapeHTML(listing.pin || "") +
                "</p>" +

                "<p>" +
                escapeHTML(
                    listing.description || ""
                ) +
                "</p>" +

                '<div class="rm-card-actions">' +
                '<button type="button" data-edit-listing="' +
                listing.id +
                '">Edit</button>' +

                '<button type="button" data-delete-listing="' +
                listing.id +
                '">Delete</button>' +
                "</div>";

            container.appendChild(card);
        });
    }

    function escapeHTML(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function verifyShowroomPayment() {
        /*
         * Current local prototype:
         * $10 USD is required as the advertisement price.
         *
         * No real payment gateway verification is claimed here.
         * A real payment gateway can be connected later.
         */
        return true;
    }

    async function saveShowroom(event) {
        if (event) {
            event.preventDefault();
        }

        if (!requireLogin()) {
            return;
        }

        if (!verifyShowroomPayment()) {
            setStatus(
                "rmShowroomStatus",
                "Showroom advertisement requires $10 USD payment.",
                false
            );
            return;
        }

        const name =
            byId("rmShowroomName")?.value.trim() || "";

        const type =
            byId("rmShowroomType")?.value.trim() || "";

        const state =
            byId("rmShowroomState")?.value.trim() || "";

        const pin =
            byId("rmShowroomPin")?.value.trim() || "";

        const description =
            byId("rmShowroomDescription")?.value.trim() || "";

        if (!name) {
            setStatus(
                "rmShowroomStatus",
                "Please enter showroom/business name.",
                false
            );
            return;
        }

        if (!type) {
            setStatus(
                "rmShowroomStatus",
                "Please enter business type.",
                false
            );
            return;
        }

        const country =
            getSelectedCountry("rmShowroomCountry");

        if (!country) {
            setStatus(
                "rmShowroomStatus",
                "Please select country.",
                false
            );
            return;
        }

        const globalAd =
            !!byId("rmGlobalAd")?.checked;

        const internationalAd =
            !!byId("rmInternationalAd")?.checked;

        const localAd =
            !!byId("rmLocalAd")?.checked;

        if (
            !globalAd &&
            !internationalAd &&
            !localAd
        ) {
            setStatus(
                "rmShowroomStatus",
                "Select Global, International or Local Ad.",
                false
            );
            return;
        }

        try {
            const imageInput =
                byId("rmShowroomImage");

            const videoInput =
                byId("rmShowroomVideo");

            const editingId =
                byId("rmEditingShowroomId")?.value || "";

            let image = null;
            let video = null;

            if (
                imageInput &&
                imageInput.files.length
            ) {
                image =
                    await readSingleMedia(
                        imageInput,
                        CONFIG.maxImageSize,
                        "Image"
                    );
            }

            if (
                videoInput &&
                videoInput.files.length
            ) {
                video =
                    await readSingleMedia(
                        videoInput,
                        CONFIG.maxVideoSize,
                        "Video"
                    );
            }

            const showrooms =
                getShowrooms();

            const oldIndex =
                showrooms.findIndex(function (showroom) {
                    return (
                        showroom.id === editingId &&
                        showroom.ownerEmail === getLoggedEmail()
                    );
                });

            if (oldIndex >= 0) {
                const old =
                    showrooms[oldIndex];

                old.name = name;
                old.type = type;
                old.country = country;
                old.state = state;
                old.pin = pin;
                old.description = description;

                old.globalAd = globalAd;
                old.internationalAd =
                    internationalAd;
                old.localAd = localAd;

                old.priceUSD =
                    CONFIG.showroomPrice;

                old.updatedAt = Date.now();

                if (image) {
                    old.image = image;
                }

                if (video) {
                    old.video = video;
                }

                showrooms[oldIndex] = old;
            } else {
                showrooms.unshift({
                    id:
                        "showroom_" +
                        Date.now() +
                        "_" +
                        Math.random()
                            .toString(36)
                            .slice(2, 8),

                    ownerEmail:
                        getLoggedEmail(),

                    name: name,
                    type: type,
                    country: country,
                    state: state,
                    pin: pin,
                    description: description,

                    globalAd: globalAd,
                    internationalAd:
                        internationalAd,
                    localAd: localAd,

                    priceUSD:
                        CONFIG.showroomPrice,

                    image: image,
                    video: video,

                    private: true,

                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
            }

            setShowrooms(showrooms);

            clearShowroomForm();
            renderShowrooms();

            setStatus(
                "rmShowroomStatus",
                oldIndex >= 0
                    ? "Showroom advertisement updated."
                    : "Showroom advertisement saved. Price: $10 USD.",
                true
            );

        } catch (error) {
            setStatus(
                "rmShowroomStatus",
                error.message ||
                    "Unable to save showroom advertisement.",
                false
            );
        }
    }

    function editShowroom(id) {
        if (!requireLogin()) {
            return;
        }

        const showroom =
            getShowrooms().find(function (item) {
                return (
                    item.id === id &&
                    item.ownerEmail === getLoggedEmail()
                );
            });

        if (!showroom) {
            return;
        }

        if (byId("rmEditingShowroomId")) {
            byId("rmEditingShowroomId").value =
                showroom.id;
        }

        if (byId("rmShowroomName")) {
            byId("rmShowroomName").value =
                showroom.name || "";
        }

        if (byId("rmShowroomType")) {
            byId("rmShowroomType").value =
                showroom.type || "";
        }

        if (byId("rmShowroomState")) {
            byId("rmShowroomState").value =
                showroom.state || "";
        }

        if (byId("rmShowroomPin")) {
            byId("rmShowroomPin").value =
                showroom.pin || "";
        }

        if (byId("rmShowroomDescription")) {
            byId("rmShowroomDescription").value =
                showroom.description || "";
        }

        if (byId("rmShowroomCountry")) {
            byId("rmShowroomCountry").value =
                showroom.country?.iso2 || "";
        }

        if (byId("rmGlobalAd")) {
            byId("rmGlobalAd").checked =
                !!showroom.globalAd;
        }

        if (byId("rmInternationalAd")) {
            byId("rmInternationalAd").checked =
                !!showroom.internationalAd;
        }

        if (byId("rmLocalAd")) {
            byId("rmLocalAd").checked =
                !!showroom.localAd;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function deleteShowroom(id) {
        if (!requireLogin()) {
            return;
        }

        const filtered =
            getShowrooms().filter(function (showroom) {
                return !(
                    showroom.id === id &&
                    showroom.ownerEmail === getLoggedEmail()
                );
            });

        setShowrooms(filtered);

        renderShowrooms();

        setStatus(
            "rmShowroomStatus",
            "Showroom advertisement deleted.",
            true
        );
    }

    function clearShowroomForm() {
        const form =
            byId("regularShowroomForm");

        if (form) {
            form.reset();
        }

        if (byId("rmEditingShowroomId")) {
            byId("rmEditingShowroomId").value = "";
        }
    }

    function renderShowrooms() {
        const container =
            byId("rmShowroomsList");

        if (!container) {
            return;
        }

        if (!isLoggedIn()) {
            container.innerHTML =
                "<p>Please login to view your showroom advertisements.</p>";
            return;
        }

        const showrooms =
            getShowrooms().filter(function (showroom) {
                return showroom.ownerEmail === getLoggedEmail();
            });

        if (!showrooms.length) {
            container.innerHTML =
                "<p>No showroom advertisements found.</p>";
            return;
        }

        container.innerHTML = "";

        showrooms.forEach(function (showroom) {
            const card =
                document.createElement("article");

            card.className =
                "rm-showroom-card";

            const country =
                showroom.country || {};

            let mediaHTML = "";

            if (
                showroom.image &&
                showroom.image.data
            ) {
                mediaHTML +=
                    '<img src="' +
                    showroom.image.data +
                    '" alt="' +
                    escapeHTML(showroom.name) +
                    '">';
            }

            if (
                showroom.video &&
                showroom.video.data
            ) {
                mediaHTML +=
                    '<video controls src="' +
                    showroom.video.data +
                    '"></video>';
            }

            const reach = [];

            if (showroom.globalAd) {
                reach.push("Global / Worldwide");
            }

            if (showroom.internationalAd) {
                reach.push("International");
            }

            if (showroom.localAd) {
                reach.push("Local");
            }

            card.innerHTML =
                '<div class="rm-card-media">' +
                mediaHTML +
                "</div>" +

                "<h3>" +
                escapeHTML(showroom.name) +
                "</h3>" +

                "<p><strong>Business Type:</strong> " +
                escapeHTML(showroom.type) +
                "</p>" +

                "<p><strong>Country:</strong> " +
                escapeHTML(
                    (country.flag || "🌍") +
                    " " +
                    (country.name || "")
                ) +
                "</p>" +

                "<p><strong>State:</strong> " +
                escapeHTML(showroom.state || "") +
                "</p>" +

                "<p><strong>PIN:</strong> " +
                escapeHTML(showroom.pin || "") +
                "</p>" +

                "<p><strong>Advertisement:</strong> " +
                escapeHTML(reach.join(", ")) +
                "</p>" +

                "<p><strong>Price:</strong> $10 USD</p>" +

                "<p>" +
                escapeHTML(showroom.description || "") +
                "</p>" +

                '<div class="rm-card-actions">' +
                '<button type="button" data-edit-showroom="' +
                showroom.id +
                '">Edit</button>' +

                '<button type="button" data-delete-showroom="' +
                showroom.id +
                '">Delete</button>' +
                "</div>";

            container.appendChild(card);
        });
    }

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
                populateListingCategories
            );
        }

        const listingForm =
            byId("regularListingForm");

        if (listingForm) {
            listingForm.addEventListener(
                "submit",
                saveListing
            );
        }

        const clearListing =
            byId("rmClearListingButton");

        if (clearListing) {
            clearListing.addEventListener(
                "click",
                clearListingForm
            );
        }

        const showroomForm =
            byId("regularShowroomForm");

        if (showroomForm) {
            showroomForm.addEventListener(
                "submit",
                saveShowroom
            );
        }

        const clearShowroom =
            byId("rmClearShowroomButton");

        if (clearShowroom) {
            clearShowroom.addEventListener(
                "click",
                clearShowroomForm
            );
        }

        document.addEventListener(
            "click",
            function (event) {
                const editListing =
                    event.target.closest(
                        "[data-edit-listing]"
                    );

                if (editListing) {
                    editListing.blur();

                    editListing &&
                        editListing.dataset.editListing &&
                        editListing.dataset.editListing;

                    editListingFunction(
                        editListing.dataset.editListing
                    );

                    return;
                }

                const deleteListingButton =
                    event.target.closest(
                        "[data-delete-listing]"
                    );

                if (deleteListingButton) {
                    deleteListing(
                        deleteListingButton.dataset.deleteListing
                    );

                    return;
                }

                const editShowroomButton =
                    event.target.closest(
                        "[data-edit-showroom]"
                    );

                if (editShowroomButton) {
                    editShowroom(
                        editShowroomButton.dataset.editShowroom
                    );

                    return;
                }

                const deleteShowroomButton =
                    event.target.closest(
                        "[data-delete-showroom]"
                    );

                if (deleteShowroomButton) {
                    deleteShowroom(
                        deleteShowroomButton.dataset.deleteShowroom
                    );
                }
            }
        );
    }

    function editListingFunction(id) {
        editListing(id);
    }

    function init() {
        populateListingTypes();
        populateConditions();
        populateListingCategories();

        retryCountryPopulation();

        updateLoginUI();

        renderListings();
        renderShowrooms();

        bindEvents();
    }

    window.ALON_REGULAR_MARKETPLACE = {
        version: CONFIG.version,
        config: CONFIG,

        categories: CATEGORY_DATA,
        conditions: CONDITION_DATA,

        getListings: getListings,
        getShowrooms: getShowrooms,

        renderListings: renderListings,
        renderShowrooms: renderShowrooms,

        login: login,
        logout: logout,

        verifyPayment: verifyShowroomPayment,

        populateCountries:
            populateRegularMarketplaceCountries,

        getSelectedCountry:
            getSelectedCountry
    };

    if (
        document.readyState === "loading"
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

    window.addEventListener(
        "load",
        function () {
            retryCountryPopulation();
            updateLoginUI();
            renderListings();
            renderShowrooms();
        }
    );

})();