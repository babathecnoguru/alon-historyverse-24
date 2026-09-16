/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE JS
   ---------------------------------------------------------
   FILE:
   html/regular-marketplace.js

   IMPORTANT:
   • This file is ONLY for Regular Marketplace.
   • DO NOT use this code in marketplace.js.
   • Global Marketplace remains untouched.
   ========================================================= */

(function () {
    "use strict";

    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const CONFIG = {
        version: "24.5",

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

        imageMaxSize:
            8 * 1024 * 1024,

        videoMaxSize:
            20 * 1024 * 1024
    };


    /* =========================================================
       CATEGORY DATABASE
       ========================================================= */

    const ITEM_CATEGORIES = [
        {
            value: "electronics",
            label: "Electronics"
        },
        {
            value: "mobile",
            label: "Mobile"
        },
        {
            value: "computer",
            label: "Computer"
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
            label: "Home"
        },
        {
            value: "appliances",
            label: "Appliances"
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
    ];


    const PROPERTY_CATEGORIES = [
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
    ];


    const VEHICLE_CATEGORIES = [
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
            label: "Three Wheeler"
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
    ];


    /* =========================================================
       SHOWROOM / ADVERTISEMENT CATEGORIES
       ========================================================= */

    const SHOWROOM_CATEGORIES = [
        {
            value: "showroom",
            label: "Showroom"
        },
        {
            value: "shop",
            label: "Shop"
        },
        {
            value: "dealer",
            label: "Dealer"
        },
        {
            value: "manufacturer",
            label: "Manufacturer"
        },
        {
            value: "service",
            label: "Service Provider"
        },
        {
            value: "real-estate",
            label: "Real Estate"
        },
        {
            value: "vehicle-dealer",
            label: "Vehicle Dealer"
        },
        {
            value: "electronics",
            label: "Electronics"
        },
        {
            value: "mobile-computer",
            label: "Mobile / Computer"
        },
        {
            value: "furniture",
            label: "Furniture"
        },
        {
            value: "clothing",
            label: "Clothing / Fashion"
        },
        {
            value: "agriculture",
            label: "Agriculture"
        },
        {
            value: "machinery",
            label: "Machinery"
        },
        {
            value: "food",
            label: "Food / Restaurant"
        },
        {
            value: "education",
            label: "Education"
        },
        {
            value: "jobs",
            label: "Jobs / Careers"
        },
        {
            value: "other",
            label: "Other Business"
        }
    ];


    /* =========================================================
       DOM HELPER
       ========================================================= */

    function $(id) {
        return document.getElementById(id);
    }


    /* =========================================================
       SAFE STORAGE
       ========================================================= */

    function readStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);

            if (!raw) {
                return fallback;
            }

            const parsed = JSON.parse(raw);

            return parsed;
        } catch (error) {
            console.error(
                "Regular Marketplace storage read error:",
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

            return true;
        } catch (error) {
            return false;
        }
    }


    /* =========================================================
       ID GENERATOR
       ========================================================= */

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


    /* =========================================================
       CURRENT ACCOUNT
       ========================================================= */

    function getAccount() {
        return readStorage(
            CONFIG.accountStorage,
            null
        );
    }


    function getSession() {
        return readStorage(
            CONFIG.sessionStorage,
            null
        );
    }


    function getLoggedInAccount() {

        const session = getSession();

        if (!session || !session.loggedIn) {
            return null;
        }

        return getAccount();
    }


    function requireLogin() {

        const account = getLoggedInAccount();

        if (!account) {

            showStatus(
                "rmLoginStatus",
                "Please login first.",
                true
            );

            const loginBox = $("rmLoginBox");

            if (loginBox) {
                loginBox.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            return false;
        }

        return true;
    }


    /* =========================================================
       STATUS
       ========================================================= */

    function showStatus(
        id,
        message,
        error
    ) {

        const element = $(id);

        if (!element) {
            return;
        }

        element.textContent = message;

        element.classList.add("show");

        if (error) {
            element.style.color = "#b00000";
            element.style.background = "#fff5f5";
            element.style.borderColor = "#e0aaaa";
        } else {
            element.style.color = "#276627";
            element.style.background = "#f5fff5";
            element.style.borderColor = "#a9d3a9";
        }
    }


    function hideStatus(id) {

        const element = $(id);

        if (!element) {
            return;
        }

        element.classList.remove("show");
        element.textContent = "";
    }


    /* =========================================================
       CATEGORY MANAGEMENT
       ========================================================= */

    function getCategoriesByType(type) {

        if (type === "property") {
            return PROPERTY_CATEGORIES;
        }

        if (type === "vehicle") {
            return VEHICLE_CATEGORIES;
        }

        return ITEM_CATEGORIES;
    }


    function populateListingCategories(
        selectedValue
    ) {

        const select = $("rmListingCategory");

        if (!select) {
            return;
        }

        const type =
            $("rmListingType")?.value || "item";

        const categories =
            getCategoriesByType(type);

        select.innerHTML = "";

        const firstOption =
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "Select Category";

        select.appendChild(firstOption);


        categories.forEach(function (category) {

            const option =
                document.createElement("option");

            option.value =
                category.value;

            option.textContent =
                category.label;

            if (
                selectedValue &&
                selectedValue === category.value
            ) {
                option.selected = true;
            }

            select.appendChild(option);

        });
    }


    /* =========================================================
       SHOWROOM CATEGORY
       ========================================================= */

    function ensureShowroomCategories() {

        const select =
            $("rmShowroomType");

        if (!select) {
            return;
        }

        const current =
            select.value;

        select.innerHTML = "";

        const first =
            document.createElement("option");

        first.value = "";

        first.textContent =
            "Select Category";

        select.appendChild(first);


        SHOWROOM_CATEGORIES.forEach(
            function (category) {

                const option =
                    document.createElement("option");

                option.value =
                    category.value;

                option.textContent =
                    category.label;

                if (
                    current &&
                    current === category.value
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );
    }


    /* =========================================================
       COUNTRY DATABASE
       ========================================================= */

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
            country.title ||
            ""
        );
    }


    function getCountryCode(country) {

        if (!country) {
            return "";
        }

        return (
            country.code2 ||
            country.iso2 ||
            country.code ||
            ""
        );
    }


    function getCountryFlag(country) {

        if (!country) {
            return "";
        }

        return country.flag || "";
    }


    function populateCountrySelect(
        selectId
    ) {

        const select =
            $(selectId);

        if (!select) {
            return;
        }

        const database =
            getCountryDatabase();

        const oldValue =
            select.value;

        select.innerHTML = "";

        const firstOption =
            document.createElement("option");

        firstOption.value = "";

        firstOption.textContent =
            "Select Country";

        select.appendChild(firstOption);


        database.forEach(
            function (country) {

                const option =
                    document.createElement("option");

                const code =
                    getCountryCode(country);

                const name =
                    getCountryName(country);

                const flag =
                    getCountryFlag(country);

                option.value =
                    code || name;

                option.textContent =
                    (
                        flag
                            ? flag + " "
                            : ""
                    ) +
                    name +
                    (
                        code
                            ? " (" + code + ")"
                            : ""
                    );

                option.dataset.countryName =
                    name;

                option.dataset.code2 =
                    code;

                option.dataset.code3 =
                    country.code3 || "";

                option.dataset.slug =
                    country.slug || "";

                if (
                    oldValue &&
                    (
                        oldValue === option.value ||
                        oldValue === code ||
                        oldValue === name
                    )
                ) {
                    option.selected = true;
                }

                select.appendChild(option);

            }
        );
    }


    /* =========================================================
       FILE READING
       ========================================================= */

    function readFileAsDataURL(file) {

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

                reader.readAsDataURL(file);
            }
        );
    }


    function validateFile(
        file,
        type
    ) {

        if (!file) {
            return {
                valid: true
            };
        }

        if (type === "image") {

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {
                return {
                    valid: false,
                    message:
                        "Please select a valid image file."
                };
            }

            if (
                file.size >
                CONFIG.imageMaxSize
            ) {
                return {
                    valid: false,
                    message:
                        "Image size must be 8 MB or less."
                };
            }
        }


        if (type === "video") {

            if (
                !file.type.startsWith(
                    "video/"
                )
            ) {
                return {
                    valid: false,
                    message:
                        "Please select a valid video file."
                };
            }

            if (
                file.size >
                CONFIG.videoMaxSize
            ) {
                return {
                    valid: false,
                    message:
                        "Video size must be 20 MB or less."
                };
            }
        }


        return {
            valid: true
        };
    }


    /* =========================================================
       LISTING DATA
       ========================================================= */

    function getListings() {

        const listings =
            readStorage(
                CONFIG.listingStorage,
                []
            );

        return Array.isArray(listings)
            ? listings
            : [];
    }


    function saveListings(listings) {

        return writeStorage(
            CONFIG.listingStorage,
            listings
        );
    }


    /* =========================================================
       LISTING EDIT STATE
       ========================================================= */

    let editingListingId = null;


    /* =========================================================
       LISTING FORM DATA
       ========================================================= */

    async function collectListingData() {

        const account =
            getLoggedInAccount();

        if (!account) {
            throw new Error(
                "Please login first."
            );
        }


        const imageInput =
            $("rmListingImage");

        const videoInput =
            $("rmListingVideo");


        const imageFile =
            imageInput?.files?.[0] || null;

        const videoFile =
            videoInput?.files?.[0] || null;


        const imageCheck =
            validateFile(
                imageFile,
                "image"
            );

        if (!imageCheck.valid) {
            throw new Error(
                imageCheck.message
            );
        }


        const videoCheck =
            validateFile(
                videoFile,
                "video"
            );

        if (!videoCheck.valid) {
            throw new Error(
                videoCheck.message
            );
        }


        const image =
            await readFileAsDataURL(
                imageFile
            );

        const video =
            await readFileAsDataURL(
                videoFile
            );


        const countrySelect =
            $("rmCountry");

        const selectedCountry =
            countrySelect?.selectedOptions?.[0];


        const data = {

            id:
                editingListingId ||
                createId("listing"),

            ownerEmail:
                account.email || "",

            ownerName:
                account.name || "",

            type:
                $("rmListingType")?.value ||
                "item",

            category:
                $("rmListingCategory")?.value ||
                "",

            condition:
                $("rmListingCondition")?.value ||
                "",

            title:
                $("rmListingTitle")?.value.trim() ||
                "",

            price:
                $("rmListingPrice")?.value ||
                "",

            country:
                $("rmCountry")?.value ||
                "",

            countryName:
                selectedCountry?.dataset?.countryName ||
                selectedCountry?.textContent ||
                "",

            countryCode:
                selectedCountry?.dataset?.code2 ||
                "",

            state:
                $("rmState")?.value.trim() ||
                "",

            pin:
                $("rmPin")?.value.trim() ||
                "",

            email:
                $("rmEmail")?.value.trim() ||
                account.email ||
                "",

            description:
                $("rmDescription")?.value.trim() ||
                "",

            image:
                image,

            video:
                video,

            updatedAt:
                new Date().toISOString()
        };


        if (!data.title) {
            throw new Error(
                "Please enter a listing title."
            );
        }


        if (!data.category) {
            throw new Error(
                "Please select a category."
            );
        }


        if (!data.country) {
            throw new Error(
                "Please select a country."
            );
        }


        if (!data.description) {
            throw new Error(
                "Please enter a description."
            );
        }


        if (!data.email) {
            throw new Error(
                "Please enter a contact email."
            );
        }


        if (!editingListingId) {

            data.createdAt =
                new Date().toISOString();
        }


        return data;
    }


    /* =========================================================
       SAVE LISTING
       ========================================================= */

    async function handleListingSubmit(
        event
    ) {

        event.preventDefault();

        hideStatus(
            "rmListingStatus"
        );


        if (!requireLogin()) {
            return;
        }


        try {

            const listing =
                await collectListingData();

            const listings =
                getListings();


            if (editingListingId) {

                const index =
                    listings.findIndex(
                        function (item) {
                            return (
                                item.id ===
                                editingListingId
                            );
                        }
                    );


                if (index === -1) {

                    throw new Error(
                        "Listing not found."
                    );
                }


                /*
                 * Preserve existing media when
                 * edit form does not select a new file.
                 */

                if (
                    !listing.image &&
                    listings[index].image
                ) {
                    listing.image =
                        listings[index].image;
                }


                if (
                    !listing.video &&
                    listings[index].video
                ) {
                    listing.video =
                        listings[index].video;
                }


                listing.createdAt =
                    listings[index].createdAt;


                listings[index] =
                    listing;


                editingListingId =
                    null;


                showStatus(
                    "rmListingStatus",
                    "Listing updated successfully.",
                    false
                );

            } else {

                listings.unshift(
                    listing
                );


                showStatus(
                    "rmListingStatus",
                    "Listing saved successfully.",
                    false
                );
            }


            if (
                !saveListings(
                    listings
                )
            ) {

                throw new Error(
                    "Listing could not be saved. Browser storage may be full."
                );
            }


            resetListingForm();

            renderListings();

        } catch (error) {

            console.error(
                "Listing save error:",
                error
            );

            showStatus(
                "rmListingStatus",
                error.message ||
                    "Could not save listing.",
                true
            );
        }
    }


    /* =========================================================
       RESET LISTING FORM
       ========================================================= */

    function resetListingForm() {

        const form =
            $("rmListingForm");

        if (form) {
            form.reset();
        }


        editingListingId =
            null;


        populateListingCategories();


        const cancel =
            $("rmCancelListingEditButton");

        if (cancel) {
            cancel.classList.add(
                "rm-hidden"
            );
        }


        const button =
            $("rmSaveListingButton");

        if (button) {
            button.textContent =
                "Save Listing";
        }
    }


    /* =========================================================
       EDIT LISTING
       ========================================================= */

    function editListing(id) {

        if (!requireLogin()) {
            return;
        }


        const listings =
            getListings();


        const listing =
            listings.find(
                function (item) {
                    return item.id === id;
                }
            );


        if (!listing) {

            showStatus(
                "rmListingStatus",
                "Listing not found.",
                true
            );

            return;
        }


        const account =
            getLoggedInAccount();


        if (
            listing.ownerEmail !==
            account.email
        ) {

            showStatus(
                "rmListingStatus",
                "You can edit only your own listing.",
                true
            );

            return;
        }


        editingListingId =
            listing.id;


        const type =
            $("rmListingType");

        if (type) {
            type.value =
                listing.type || "item";
        }


        populateListingCategories(
            listing.category
        );


        const condition =
            $("rmListingCondition");

        if (condition) {
            condition.value =
                listing.condition || "";
        }


        setValue(
            "rmListingTitle",
            listing.title
        );

        setValue(
            "rmListingPrice",
            listing.price
        );

        setValue(
            "rmCountry",
            listing.country
        );

        setValue(
            "rmState",
            listing.state
        );

        setValue(
            "rmPin",
            listing.pin
        );

        setValue(
            "rmEmail",
            listing.email
        );

        setValue(
            "rmDescription",
            listing.description
        );


        const cancel =
            $("rmCancelListingEditButton");

        if (cancel) {
            cancel.classList.remove(
                "rm-hidden"
            );
        }


        const button =
            $("rmSaveListingButton");

        if (button) {
            button.textContent =
                "Update Listing";
        }


        showStatus(
            "rmListingStatus",
            "Editing listing. Select new media only if you want to replace the existing media.",
            false
        );


        $("rmListingForm")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =========================================================
       DELETE LISTING
       ========================================================= */

    function deleteListing(id) {

        if (!requireLogin()) {
            return;
        }


        const listings =
            getListings();

        const account =
            getLoggedInAccount();


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
            account.email
        ) {

            showStatus(
                "rmListingStatus",
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


        const filtered =
            listings.filter(
                function (item) {
                    return item.id !== id;
                }
            );


        saveListings(
            filtered
        );


        renderListings();


        showStatus(
            "rmListingStatus",
            "Listing deleted successfully.",
            false
        );
    }


    /* =========================================================
       RENDER LISTINGS
       ========================================================= */

    function renderListings() {

        const container =
            $("rmListings");

        if (!container) {
            return;
        }


        const account =
            getLoggedInAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Please login to view your listings.' +
                '</div>';

            return;
        }


        const listings =
            getListings().filter(
                function (item) {
                    return (
                        item.ownerEmail ===
                        account.email
                    );
                }
            );


        if (!listings.length) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'No listings available yet.' +
                '</div>';

            return;
        }


        const grid =
            document.createElement("div");

        grid.className =
            "rm-list-grid";


        listings.forEach(
            function (listing) {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "rm-card";


                const title =
                    document.createElement("h3");

                title.textContent =
                    listing.title ||
                    "Untitled Listing";

                card.appendChild(
                    title
                );


                addCardRow(
                    card,
                    "Type",
                    listing.type
                );

                addCardRow(
                    card,
                    "Category",
                    getCategoryLabel(
                        listing.type,
                        listing.category
                    )
                );

                addCardRow(
                    card,
                    "Condition",
                    listing.condition
                );

                addCardRow(
                    card,
                    "Price",
                    listing.price
                        ? listing.price +
                          " " +
                          CONFIG.currency
                        : ""
                );

                addCardRow(
                    card,
                    "Country",
                    listing.countryName ||
                    listing.country
                );

                addCardRow(
                    card,
                    "State / Province",
                    listing.state
                );

                addCardRow(
                    card,
                    "PIN / ZIP",
                    listing.pin
                );

                addCardRow(
                    card,
                    "Email",
                    listing.email
                );

                addCardRow(
                    card,
                    "Description",
                    listing.description
                );


                if (listing.image) {

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.className =
                        "rm-card-media";

                    image.src =
                        listing.image;

                    image.alt =
                        listing.title ||
                        "Listing image";

                    image.loading =
                        "lazy";

                    card.appendChild(
                        image
                    );
                }


                if (listing.video) {

                    const video =
                        document.createElement(
                            "video"
                        );

                    video.className =
                        "rm-card-video";

                    video.controls =
                        true;

                    video.preload =
                        "metadata";

                    const source =
                        document.createElement(
                            "source"
                        );

                    source.src =
                        listing.video;

                    video.appendChild(
                        source
                    );

                    card.appendChild(
                        video
                    );
                }


                const actions =
                    document.createElement(
                        "div"
                    );

                actions.className =
                    "rm-actions";


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
                        editListing(
                            listing.id
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
                        deleteListing(
                            listing.id
                        );
                    }
                );


                actions.appendChild(
                    editButton
                );

                actions.appendChild(
                    deleteButton
                );

                card.appendChild(
                    actions
                );


                grid.appendChild(
                    card
                );

            }
        );


        container.innerHTML = "";

        container.appendChild(
            grid
        );
    }


    /* =========================================================
       CATEGORY LABEL
       ========================================================= */

    function getCategoryLabel(
        type,
        value
    ) {

        const categories =
            getCategoriesByType(type);

        const found =
            categories.find(
                function (item) {
                    return (
                        item.value ===
                        value
                    );
                }
            );


        return found
            ? found.label
            : value || "";
    }


    function addCardRow(
        card,
        label,
        value
    ) {

        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return;
        }


        const row =
            document.createElement(
                "div"
            );

        row.className =
            "rm-card-row";


        const strong =
            document.createElement(
                "strong"
            );

        strong.textContent =
            label + ": ";


        const span =
            document.createElement(
                "span"
            );

        span.textContent =
            value;


        row.appendChild(
            strong
        );

        row.appendChild(
            span
        );


        card.appendChild(
            row
        );
    }


    /* =========================================================
       SHOWROOM DATA
       ========================================================= */

    function getShowrooms() {

        const showrooms =
            readStorage(
                CONFIG.showroomStorage,
                []
            );

        return Array.isArray(showrooms)
            ? showrooms
            : [];
    }


    function saveShowrooms(
        showrooms
    ) {

        return writeStorage(
            CONFIG.showroomStorage,
            showrooms
        );
    }


    let editingShowroomId = null;

    let showroomPaymentVerified =
        false;


    /* =========================================================
       SHOWROOM DATA COLLECTION
       ========================================================= */

    async function collectShowroomData() {

        const account =
            getLoggedInAccount();


        if (!account) {
            throw new Error(
                "Please login first."
            );
        }


        if (!showroomPaymentVerified) {

            throw new Error(
                "Please complete the payment verification step first."
            );
        }


        const globalReach =
            Boolean(
                $("rmShowroomReachGlobal")?.checked
            );


        const internationalReach =
            Boolean(
                $("rmShowroomReachInternational")?.checked
            );


        if (
            !globalReach &&
            !internationalReach
        ) {

            throw new Error(
                "Please select Global / Worldwide, International, or both."
            );
        }


        const imageFile =
            $("rmShowroomImage")?.files?.[0] ||
            null;


        const videoFile =
            $("rmShowroomVideo")?.files?.[0] ||
            null;


        const imageCheck =
            validateFile(
                imageFile,
                "image"
            );


        if (!imageCheck.valid) {
            throw new Error(
                imageCheck.message
            );
        }


        const videoCheck =
            validateFile(
                videoFile,
                "video"
            );


        if (!videoCheck.valid) {
            throw new Error(
                videoCheck.message
            );
        }


        const image =
            await readFileAsDataURL(
                imageFile
            );


        const video =
            await readFileAsDataURL(
                videoFile
            );


        const countrySelect =
            $("rmShowroomCountry");


        const selectedCountry =
            countrySelect?.selectedOptions?.[0];


        const data = {

            id:
                editingShowroomId ||
                createId("showroom"),

            ownerEmail:
                account.email || "",

            ownerName:
                account.name || "",

            showroomName:
                $("rmShowroomName")?.value.trim() ||
                "",

            showroomType:
                $("rmShowroomType")?.value ||
                "",

            reach: {
                global:
                    globalReach,

                international:
                    internationalReach
            },

            country:
                $("rmShowroomCountry")?.value ||
                "",

            countryName:
                selectedCountry?.dataset?.countryName ||
                selectedCountry?.textContent ||
                "",

            countryCode:
                selectedCountry?.dataset?.code2 ||
                "",

            state:
                $("rmShowroomState")?.value.trim() ||
                "",

            pin:
                $("rmShowroomPin")?.value.trim() ||
                "",

            email:
                $("rmShowroomEmail")?.value.trim() ||
                account.email ||
                "",

            description:
                $("rmShowroomDescription")?.value.trim() ||
                "",

            image:
                image,

            video:
                video,

            price:
                CONFIG.showroomPrice,

            currency:
                CONFIG.showroomPrice
                    ? CONFIG.currency
                    : "",

            paymentVerified:
                true,

            paymentMethod:
                "Bank Account",

            updatedAt:
                new Date().toISOString()
        };


        if (!data.showroomName) {
            throw new Error(
                "Please enter showroom / business name."
            );
        }


        if (!data.showroomType) {
            throw new Error(
                "Please select advertisement category."
            );
        }


        if (!data.country) {
            throw new Error(
                "Please select country."
            );
        }


        if (!data.email) {
            throw new Error(
                "Please enter business email."
            );
        }


        if (!data.description) {
            throw new Error(
                "Please enter advertisement description."
            );
        }


        if (!editingShowroomId) {

            data.createdAt =
                new Date().toISOString();
        }


        return data;
    }


    /* =========================================================
       PAYMENT GATE
       ========================================================= */

    function verifyShowroomPayment() {

        if (!requireLogin()) {
            return;
        }


        /*
         * IMPORTANT:
         *
         * A static GitHub Pages website cannot securely verify
         * an actual bank transaction.
         *
         * This button only records the local verification state.
         *
         * Real automatic verification requires a secure backend
         * or payment gateway.
         */

        showroomPaymentVerified =
            true;


        showStatus(
            "rmPaymentStatus",
            "Payment step accepted locally. Advertisement can now be published.",
            false
        );
    }


    /* =========================================================
       SHOWROOM SUBMIT
       ========================================================= */

    async function handleShowroomSubmit(
        event
    ) {

        event.preventDefault();

        hideStatus(
            "rmShowroomStatus"
        );


        if (!requireLogin()) {
            return;
        }


        try {

            const showroom =
                await collectShowroomData();


            const showrooms =
                getShowrooms();


            if (editingShowroomId) {

                const index =
                    showrooms.findIndex(
                        function (item) {
                            return (
                                item.id ===
                                editingShowroomId
                            );
                        }
                    );


                if (index === -1) {

                    throw new Error(
                        "Advertisement not found."
                    );
                }


                if (
                    !showroom.image &&
                    showrooms[index].image
                ) {
                    showroom.image =
                        showrooms[index].image;
                }


                if (
                    !showroom.video &&
                    showrooms[index].video
                ) {
                    showroom.video =
                        showrooms[index].video;
                }


                showroom.createdAt =
                    showrooms[index].createdAt;


                showrooms[index] =
                    showroom;


                editingShowroomId =
                    null;


                showStatus(
                    "rmShowroomStatus",
                    "Advertisement updated successfully.",
                    false
                );

            } else {

                showrooms.unshift(
                    showroom
                );


                showStatus(
                    "rmShowroomStatus",
                    "Advertisement published successfully.",
                    false
                );
            }


            if (
                !saveShowrooms(
                    showrooms
                )
            ) {

                throw new Error(
                    "Advertisement could not be saved. Browser storage may be full."
                );
            }


            resetShowroomForm();

            renderShowrooms();

        } catch (error) {

            console.error(
                "Showroom save error:",
                error
            );


            showStatus(
                "rmShowroomStatus",
                error.message ||
                    "Could not publish advertisement.",
                true
            );
        }
    }


    /* =========================================================
       RESET SHOWROOM
       ========================================================= */

    function resetShowroomForm() {

        const form =
            $("rmShowroomForm");

        if (form) {
            form.reset();
        }


        editingShowroomId =
            null;

        showroomPaymentVerified =
            false;


        const publish =
            $("rmPublishShowroomButton");

        if (publish) {
            publish.textContent =
                "Publish Advertisement";
        }


        hideStatus(
            "rmPaymentStatus"
        );
    }


    /* =========================================================
       EDIT SHOWROOM
       ========================================================= */

    function editShowroom(id) {

        if (!requireLogin()) {
            return;
        }


        const showrooms =
            getShowrooms();


        const showroom =
            showrooms.find(
                function (item) {
                    return item.id === id;
                }
            );


        if (!showroom) {

            showStatus(
                "rmShowroomStatus",
                "Advertisement not found.",
                true
            );

            return;
        }


        const account =
            getLoggedInAccount();


        if (
            showroom.ownerEmail !==
            account.email
        ) {

            showStatus(
                "rmShowroomStatus",
                "You can edit only your own advertisement.",
                true
            );

            return;
        }


        editingShowroomId =
            showroom.id;


        setValue(
            "rmShowroomName",
            showroom.showroomName
        );


        setValue(
            "rmShowroomType",
            showroom.showroomType
        );


        setChecked(
            "rmShowroomReachGlobal",
            Boolean(
                showroom.reach?.global
            )
        );


        setChecked(
            "rmShowroomReachInternational",
            Boolean(
                showroom.reach?.international
            )
        );


        setValue(
            "rmShowroomCountry",
            showroom.country
        );


        setValue(
            "rmShowroomState",
            showroom.state
        );


        setValue(
            "rmShowroomPin",
            showroom.pin
        );


        setValue(
            "rmShowroomEmail",
            showroom.email
        );


        setValue(
            "rmShowroomDescription",
            showroom.description
        );


        /*
         * Editing an already published advertisement
         * keeps its payment state.
         */

        showroomPaymentVerified =
            Boolean(
                showroom.paymentVerified
            );


        showStatus(
            "rmShowroomStatus",
            "Editing advertisement.",
            false
        );


        $("rmShowroomForm")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* =========================================================
       DELETE SHOWROOM
       ========================================================= */

    function deleteShowroom(id) {

        if (!requireLogin()) {
            return;
        }


        const showrooms =
            getShowrooms();


        const account =
            getLoggedInAccount();


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
            account.email
        ) {

            showStatus(
                "rmShowroomStatus",
                "You can delete only your own advertisement.",
                true
            );

            return;
        }


        const confirmed =
            window.confirm(
                "Delete this advertisement?"
            );


        if (!confirmed) {
            return;
        }


        const filtered =
            showrooms.filter(
                function (item) {
                    return item.id !== id;
                }
            );


        saveShowrooms(
            filtered
        );


        renderShowrooms();


        showStatus(
            "rmShowroomStatus",
            "Advertisement deleted successfully.",
            false
        );
    }


    /* =========================================================
       RENDER SHOWROOMS
       ========================================================= */

    function renderShowrooms() {

        const container =
            $("rmShowrooms");

        if (!container) {
            return;
        }


        const account =
            getLoggedInAccount();


        if (!account) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'Please login to view your advertisements.' +
                '</div>';

            return;
        }


        const showrooms =
            getShowrooms().filter(
                function (item) {
                    return (
                        item.ownerEmail ===
                        account.email
                    );
                }
            );


        if (!showrooms.length) {

            container.innerHTML =
                '<div class="rm-empty">' +
                'No advertisements available yet.' +
                '</div>';

            return;
        }


        const grid =
            document.createElement(
                "div"
            );

        grid.className =
            "rm-list-grid";


        showrooms.forEach(
            function (showroom) {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "rm-card";


                const title =
                    document.createElement(
                        "h3"
                    );

                title.textContent =
                    showroom.showroomName ||
                    "Advertisement";


                card.appendChild(
                    title
                );


                addCardRow(
                    card,
                    "Category",
                    getShowroomCategoryLabel(
                        showroom.showroomType
                    )
                );


                const reachText = [];


                if (
                    showroom.reach?.global
                ) {
                    reachText.push(
                        "Global / Worldwide"
                    );
                }


                if (
                    showroom.reach?.international
                ) {
                    reachText.push(
                        "International"
                    );
                }


                addCardRow(
                    card,
                    "Reach",
                    reachText.join(
                        " + "
                    )
                );


                addCardRow(
                    card,
                    "Country",
                    showroom.countryName ||
                    showroom.country
                );


                addCardRow(
                    card,
                    "State / Province",
                    showroom.state
                );


                addCardRow(
                    card,
                    "PIN / ZIP",
                    showroom.pin
                );


                addCardRow(
                    card,
                    "Email",
                    showroom.email
                );


                addCardRow(
                    card,
                    "Description",
                    showroom.description
                );


                addCardRow(
                    card,
                    "Advertisement Price",
                    showroom.price +
                    " " +
                    showroom.currency
                );


                addCardRow(
                    card,
                    "Payment Method",
                    showroom.paymentMethod
                );


                addCardRow(
                    card,
                    "Payment Status",
                    showroom.paymentVerified
                        ? "Accepted locally"
                        : "Not verified"
                );


                if (showroom.image) {

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.className =
                        "rm-card-media";

                    image.src =
                        showroom.image;

                    image.alt =
                        showroom.showroomName ||
                        "Advertisement image";

                    image.loading =
                        "lazy";

                    card.appendChild(
                        image
                    );
                }


                if (showroom.video) {

                    const video =
                        document.createElement(
                            "video"
                        );

                    video.className =
                        "rm-card-video";

                    video.controls =
                        true;

                    video.preload =
                        "metadata";


                    const source =
                        document.createElement(
                            "source"
                        );

                    source.src =
                        showroom.video;


                    video.appendChild(
                        source
                    );


                    card.appendChild(
                        video
                    );
                }


                const actions =
                    document.createElement(
                        "div"
                    );

                actions.className =
                    "rm-actions";


                const edit =
                    document.createElement(
                        "button"
                    );

                edit.type =
                    "button";

                edit.className =
                    "rm-btn";

                edit.textContent =
                    "Edit";

                edit.addEventListener(
                    "click",
                    function () {
                        editShowroom(
                            showroom.id
                        );
                    }
                );


                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.className =
                    "rm-btn rm-btn-danger";

                remove.textContent =
                    "Delete";

                remove.addEventListener(
                    "click",
                    function () {
                        deleteShowroom(
                            showroom.id
                        );
                    }
                );


                actions.appendChild(
                    edit
                );

                actions.appendChild(
                    remove
                );


                card.appendChild(
                    actions
                );


                grid.appendChild(
                    card
                );

            }
        );


        container.innerHTML = "";

        container.appendChild(
            grid
        );
    }


    /* =========================================================
       SHOWROOM CATEGORY LABEL
       ========================================================= */

    function getShowroomCategoryLabel(
        value
    ) {

        const found =
            SHOWROOM_CATEGORIES.find(
                function (item) {
                    return (
                        item.value ===
                        value
                    );
                }
            );


        return found
            ? found.label
            : value || "";
    }


    /* =========================================================
       FORM HELPERS
       ========================================================= */

    function setValue(
        id,
        value
    ) {

        const element =
            $(id);

        if (!element) {
            return;
        }

        element.value =
            value ?? "";
    }


    function setChecked(
        id,
        value
    ) {

        const element =
            $(id);

        if (!element) {
            return;
        }

        element.checked =
            Boolean(value);
    }


    /* =========================================================
       LOGIN
       ========================================================= */

    function handleLogin() {

        hideStatus(
            "rmLoginStatus"
        );


        const name =
            $("rmLoginName")?.value.trim() ||
            "";


        const email =
            $("rmLoginEmail")?.value.trim().toLowerCase() ||
            "";


        const password =
            $("rmLoginPassword")?.value ||
            "";


        const agreement =
            Boolean(
                $("rmAgreement")?.checked
            );


        if (!name) {

            showStatus(
                "rmLoginStatus",
                "Please enter your name.",
                true
            );

            return;
        }


        if (!email) {

            showStatus(
                "rmLoginStatus",
                "Please enter your email address.",
                true
            );

            return;
        }


        if (!isValidEmail(email)) {

            showStatus(
                "rmLoginStatus",
                "Please enter a valid email address.",
                true
            );

            return;
        }


        if (!password) {

            showStatus(
                "rmLoginStatus",
                "Please enter your password.",
                true
            );

            return;
        }


        if (!agreement) {

            showStatus(
                "rmLoginStatus",
                "You must accept the Marketplace Agreement before login.",
                true
            );

            return;
        }


        const account = {

            name:
                name,

            email:
                email,

            /*
             * This is only a local prototype account.
             * A real production login requires a secure backend.
             */

            password:
                password,

            updatedAt:
                new Date().toISOString()
        };


        writeStorage(
            CONFIG.accountStorage,
            account
        );


        writeStorage(
            CONFIG.sessionStorage,
            {
                loggedIn: true,

                email:
                    email,

                loginAt:
                    new Date().toISOString()
            }
        );


        updateLoginUI();


        showStatus(
            "rmLoginStatus",
            "Login successful.",
            false
        );


        renderListings();

        renderShowrooms();
    }


    /* =========================================================
       LOGOUT
       ========================================================= */

    function logout() {

        removeStorage(
            CONFIG.sessionStorage
        );


        showroomPaymentVerified =
            false;


        updateLoginUI();


        renderListings();

        renderShowrooms();


        showStatus(
            "rmLoginStatus",
            "Logged out successfully.",
            false
        );
    }


    /* =========================================================
       LOGIN UI
       ========================================================= */

    function updateLoginUI() {

        const account =
            getLoggedInAccount();


        const loginBox =
            $("rmLoginBox");


        const profileBox =
            $("rmProfileBox");


        const profileEmail =
            $("rmProfileEmail");


        if (account) {

            if (loginBox) {
                loginBox.classList.add(
                    "rm-hidden"
                );
            }


            if (profileBox) {
                profileBox.classList.remove(
                    "rm-hidden"
                );
            }


            if (profileEmail) {
                profileEmail.textContent =
                    account.email || "";
            }

        } else {

            if (loginBox) {
                loginBox.classList.remove(
                    "rm-hidden"
                );
            }


            if (profileBox) {
                profileBox.classList.add(
                    "rm-hidden"
                );
            }


            if (profileEmail) {
                profileEmail.textContent =
                    "";
            }
        }
    }


    /* =========================================================
       EMAIL VALIDATION
       ========================================================= */

    function isValidEmail(
        email
    ) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);
    }


    /* =========================================================
       EVENT LISTENERS
       ========================================================= */

    function bindEvents() {

        const listingType =
            $("rmListingType");


        if (listingType) {

            listingType.addEventListener(
                "change",
                function () {

                    populateListingCategories();

                }
            );
        }


        const listingForm =
            $("rmListingForm");


        if (listingForm) {

            listingForm.addEventListener(
                "submit",
                handleListingSubmit
            );
        }


        const cancelListing =
            $("rmCancelListingEditButton");


        if (cancelListing) {

            cancelListing.addEventListener(
                "click",
                function () {

                    resetListingForm();

                    hideStatus(
                        "rmListingStatus"
                    );

                }
            );
        }


        const loginButton =
            $("rmLoginButton");


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                handleLogin
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


        const showroomForm =
            $("rmShowroomForm");


        if (showroomForm) {

            showroomForm.addEventListener(
                "submit",
                handleShowroomSubmit
            );
        }


        const paymentButton =
            $("rmPayShowroomButton");


        if (paymentButton) {

            paymentButton.addEventListener(
                "click",
                verifyShowroomPayment
            );
        }


        const resetShowroom =
            $("rmResetShowroomButton");


        if (resetShowroom) {

            resetShowroom.addEventListener(
                "click",
                function () {

                    resetShowroomForm();

                    hideStatus(
                        "rmShowroomStatus"
                    );

                }
            );
        }
    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function init() {

        ensureShowroomCategories();


        populateListingCategories();


        populateCountrySelect(
            "rmCountry"
        );


        populateCountrySelect(
            "rmShowroomCountry"
        );


        updateLoginUI();


        bindEvents();


        renderListings();


        renderShowrooms();


        console.log(
            "ALON HISTORYVERSE 24 Regular Marketplace JS loaded.",
            "Version:",
            CONFIG.version
        );
    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.ALON_REGULAR_MARKETPLACE = {

        version:
            CONFIG.version,

        config:
            CONFIG,

        categories: {
            items:
                ITEM_CATEGORIES,

            property:
                PROPERTY_CATEGORIES,

            vehicles:
                VEHICLE_CATEGORIES,

            showroom:
                SHOWROOM_CATEGORIES
        },

        getListings:
            getListings,

        getShowrooms:
            getShowrooms,

        renderListings:
            renderListings,

        renderShowrooms:
            renderShowrooms,

        login:
            handleLogin,

        logout:
            logout,

        verifyPayment:
            verifyShowroomPayment
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

})();