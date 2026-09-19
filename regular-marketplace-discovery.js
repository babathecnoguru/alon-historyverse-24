/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE DISCOVERY
   ---------------------------------------------------------
   File: regular-marketplace-discovery.js
   Version: 1.3 SAFE DISCOVERY + TEST
   ---------------------------------------------------------
   Features:
   • Brand Promoter
   • Travel & Tourist Places
   • Movie Promoter
   • World Culture & Local Life
   • Central Marketplace Country Database
   • Image Upload
   • Video Upload
   • Reach / Links
   • Local Storage
   • Delete
   • Safe Initialization
   • Visible Error Reporting
   • Discovery Working Test
   ========================================================= */

(function () {

    "use strict";

    var CONFIG = {
        version: "1.3",

        storage: {
            brands:
                "alon_historyverse_regular_brand_promoters",

            travel:
                "alon_historyverse_regular_travel_places",

            movies:
                "alon_historyverse_regular_movie_promoters",

            culture:
                "alon_historyverse_regular_world_culture"
        },

        maxImageSize: 8 * 1024 * 1024,
        maxVideoSize: 40 * 1024 * 1024
    };


    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function escapeHTML(value) {

        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function createId(prefix) {

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


    function getStorage(key) {

        try {

            var raw = localStorage.getItem(key);

            if (!raw) {
                return [];
            }

            var parsed = JSON.parse(raw);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Discovery storage read error:",
                error
            );

            return [];
        }
    }


    function saveStorage(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "Discovery storage save error:",
                error
            );

            return false;
        }
    }


    function getCountryDatabase() {

        try {

            if (
                Array.isArray(
                    window.MARKETPLACE_COUNTRIES
                )
            ) {

                return window.MARKETPLACE_COUNTRIES;

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

        } catch (error) {

            console.error(
                "Country database error:",
                error
            );
        }

        return [];
    }


    function getAccount() {

        try {

            var keys = [
                "alon_user",
                "alonUser",
                "alon_historyverse_user",
                "currentUser",
                "user"
            ];


            for (
                var i = 0;
                i < keys.length;
                i++
            ) {

                var value =
                    localStorage.getItem(
                        keys[i]
                    );

                if (!value) {
                    continue;
                }


                try {

                    var parsed =
                        JSON.parse(value);

                    if (parsed) {
                        return parsed;
                    }

                } catch (ignore) {

                    return {
                        email: value
                    };
                }
            }

        } catch (error) {

            console.error(
                "Account read error:",
                error
            );
        }

        return {
            email: "Guest"
        };
    }


    function getOwner() {

        var account = getAccount();

        return (
            account.email ||
            account.id ||
            account.userId ||
            account.name ||
            "Guest"
        );
    }


    /* =====================================================
       COUNTRY SYSTEM
       ===================================================== */

    function buildCountryOptions(selected) {

        var countries =
            getCountryDatabase();

        var html =
            '<option value="">Select Country</option>';


        if (!countries.length) {

            return (
                html +
                '<option value="">Country database loading...</option>'
            );
        }


        countries.forEach(function (country) {

            if (!country) {
                return;
            }


            var code =
                country.code ||
                country.iso ||
                country.isoCode ||
                "";


            var name =
                country.name ||
                country.country ||
                "";


            var flag =
                country.flag ||
                "";


            if (!name) {
                return;
            }


            var value =
                code || name;


            var selectedAttr =
                String(selected || "") ===
                String(value)
                    ? " selected"
                    : "";


            html +=
                '<option value="' +
                escapeHTML(value) +
                '"' +
                selectedAttr +
                ">" +
                escapeHTML(
                    (flag ? flag + " " : "") +
                    name
                ) +
                "</option>";
        });


        return html;
    }


    /* =====================================================
       CSS
       ===================================================== */

    function injectStyle() {

        if (
            document.getElementById(
                "alonDiscoveryInjectedStyle"
            )
        ) {
            return;
        }


        var style =
            document.createElement("style");

        style.id =
            "alonDiscoveryInjectedStyle";


        style.textContent = `

        .rmd-root {
            width: 100%;
            box-sizing: border-box;
            margin: 20px 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .rmd-test-box {
            margin: 0 0 20px 0;
            padding: 25px;
            border: 2px solid #d7b35a;
            border-radius: 15px;
            background: #fffdf5;
            color: #111;
            font-family: Arial, sans-serif;
            text-align: center;
            box-sizing: border-box;
        }

        .rmd-test-icon {
            font-size: 40px;
            line-height: 1.2;
        }

        .rmd-test-title {
            margin: 10px 0;
            color: #8b6508;
        }

        .rmd-test-text {
            margin: 8px 0;
            font-size: 16px;
        }

        .rmd-test-features {
            margin: 8px 0;
            color: #555;
        }

        .rmd-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 18px;
        }

        .rmd-tab {
            border: 1px solid #d7b35a;
            background: #05080f;
            color: #f0d27a;
            border-radius: 8px;
            padding: 10px 14px;
            cursor: pointer;
            font-weight: 700;
        }

        .rmd-tab.active {
            background: #d7b35a;
            color: #05080f;
        }

        .rmd-panel {
            display: none;
        }

        .rmd-panel.active {
            display: block;
        }

        .rmd-card {
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 18px;
            background: #fff;
            box-sizing: border-box;
        }

        .rmd-card h3 {
            margin-top: 0;
        }

        .rmd-form {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .rmd-form input,
        .rmd-form select,
        .rmd-form textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 11px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 15px;
        }

        .rmd-form textarea {
            min-height: 110px;
            resize: vertical;
        }

        .rmd-submit {
            border: 0;
            border-radius: 8px;
            padding: 12px 16px;
            background: #05080f;
            color: #f0d27a;
            font-weight: 700;
            cursor: pointer;
        }

        .rmd-feed {
            margin-top: 18px;
        }

        .rmd-item {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 14px;
            margin-bottom: 12px;
            background: #fafafa;
        }

        .rmd-item-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        .rmd-meta {
            font-size: 13px;
            color: #666;
            margin: 5px 0;
        }

        .rmd-description {
            white-space: pre-wrap;
            margin-top: 10px;
        }

        .rmd-media {
            width: 100%;
            max-height: 320px;
            object-fit: cover;
            border-radius: 8px;
            margin-top: 10px;
        }

        .rmd-delete {
            margin-top: 12px;
            padding: 8px 12px;
            border: 0;
            border-radius: 7px;
            background: #222;
            color: #fff;
            cursor: pointer;
        }

        .rmd-empty {
            padding: 15px;
            border: 1px dashed #aaa;
            border-radius: 8px;
            color: #666;
        }

        .rmd-status {
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 8px;
            background: #f5f5f5;
            color: #333;
        }

        .rmd-error {
            background: #fff0f0;
            border: 1px solid #d00;
            color: #900;
            padding: 14px;
            border-radius: 8px;
            margin: 10px 0;
        }

        .rmd-success {
            background: #f0fff4;
            border: 1px solid #198754;
            color: #146c43;
            padding: 12px;
            border-radius: 8px;
            margin: 10px 0;
        }

        .rmd-section-title {
            margin-top: 0;
            color: #111;
        }

        .rmd-small {
            font-size: 12px;
            color: #777;
        }

        @media (min-width: 700px) {

            .rmd-form-grid {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

        }

        `;


        document.head.appendChild(style);
    }


    /* =====================================================
       MEDIA
       ===================================================== */

    function readFileAsDataURL(file) {

        return new Promise(function (
            resolve,
            reject
        ) {

            if (!file) {
                resolve("");
                return;
            }


            var reader =
                new FileReader();


            reader.onload = function () {
                resolve(reader.result);
            };


            reader.onerror = function () {
                reject(
                    new Error(
                        "File could not be read."
                    )
                );
            };


            reader.readAsDataURL(file);
        });
    }


    function validateImage(file) {

        if (!file) {
            return true;
        }


        if (
            file.size >
            CONFIG.maxImageSize
        ) {

            alert(
                "Image is too large. Maximum size is 8 MB."
            );

            return false;
        }


        if (
            !String(file.type)
                .toLowerCase()
                .startsWith("image/")
        ) {

            alert(
                "Please select a valid image file."
            );

            return false;
        }


        return true;
    }


    function validateVideo(file) {

        if (!file) {
            return true;
        }


        if (
            file.size >
            CONFIG.maxVideoSize
        ) {

            alert(
                "Video is too large. Maximum size is 40 MB."
            );

            return false;
        }


        if (
            !String(file.type)
                .toLowerCase()
                .startsWith("video/")
        ) {

            alert(
                "Please select a valid video file."
            );

            return false;
        }


        return true;
    }


    /* =====================================================
       FORM FIELD
       ===================================================== */

    function commonLocationFields() {

        return `

        <div class="rmd-form-grid">

            <input
                type="text"
                name="state"
                placeholder="State / Province"
            >

            <input
                type="text"
                name="district"
                placeholder="District"
            >

            <input
                type="text"
                name="city"
                placeholder="City / Town"
            >

            <input
                type="text"
                name="village"
                placeholder="Village / Local Area"
            >

        </div>

        `;
    }


    function commonMediaFields() {

        return `

        <div class="rmd-form-grid">

            <div>
                <label>
                    Image
                </label>

                <input
                    type="file"
                    name="image"
                    accept="image/*"
                >

                <div class="rmd-small">
                    Maximum 8 MB
                </div>
            </div>


            <div>
                <label>
                    Video
                </label>

                <input
                    type="file"
                    name="video"
                    accept="video/*"
                >

                <div class="rmd-small">
                    Maximum 40 MB
                </div>
            </div>

        </div>

        `;
    }


    function commonReachFields() {

        return `

        <div class="rmd-form-grid">

            <input
                type="text"
                name="website"
                placeholder="Website / Page Link"
            >

            <input
                type="text"
                name="social"
                placeholder="Social Media Link"
            >

            <input
                type="text"
                name="reach"
                placeholder="Reach / Audience"
            >

        </div>

        `;
    }


    /* =====================================================
       BUILD HUB
       ===================================================== */

    function buildHub() {

        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );


        if (!hub) {

            throw new Error(
                "rmDiscoveryHub element was not found."
            );
        }


        hub.innerHTML = `

        <div class="rmd-root">

            <!-- =========================================
                 DISCOVERY TEST
                 Merged from SAFE DISCOVERY test code
                 ========================================= -->

            <div class="rmd-test-box">

                <div class="rmd-test-icon">
                    📁
                </div>

                <h2 class="rmd-test-title">
                    MARKETPLACE DISCOVERY
                </h2>

                <p class="rmd-test-text">
                    ✅ Discovery JavaScript is working.
                </p>

                <p class="rmd-test-features">
                    🏷️ Brand Promoter
                    • 🌍 Travel & Tourist
                    • 🎬 Movie Promoter
                    • 🌎 World Culture
                </p>

            </div>


            <div
                id="rmdStatus"
                class="rmd-status"
            >
                Marketplace Discovery is ready.
            </div>


            <div class="rmd-tabs">

                <button
                    type="button"
                    class="rmd-tab active"
                    data-panel="rmdBrands"
                >
                    🏷️ Brand Promoter
                </button>


                <button
                    type="button"
                    class="rmd-tab"
                    data-panel="rmdTravel"
                >
                    🌍 Travel & Tourist
                </button>


                <button
                    type="button"
                    class="rmd-tab"
                    data-panel="rmdMovies"
                >
                    🎬 Movie Promoter
                </button>


                <button
                    type="button"
                    class="rmd-tab"
                    data-panel="rmdCulture"
                >
                    🌎 World Culture
                </button>

            </div>


            <!-- BRAND -->

            <div
                id="rmdBrands"
                class="rmd-panel active"
            >

                <div class="rmd-card">

                    <h3 class="rmd-section-title">
                        🏷️ Brand Promoter
                    </h3>

                    <form
                        id="rmdBrandForm"
                        class="rmd-form"
                    >

                        <input
                            type="text"
                            name="brandName"
                            placeholder="Brand / Company Name"
                            required
                        >


                        <input
                            type="text"
                            name="title"
                            placeholder="Promotion Title"
                            required
                        >


                        <select
                            name="country"
                            required
                        >
                            ${buildCountryOptions("")}
                        </select>


                        ${commonLocationFields()}


                        <textarea
                            name="description"
                            placeholder="Brand description / promotion details"
                            required
                        ></textarea>


                        ${commonMediaFields()}


                        ${commonReachFields()}


                        <button
                            type="submit"
                            class="rmd-submit"
                        >
                            Publish Brand Promotion
                        </button>

                    </form>

                </div>


                <div
                    id="rmdBrandFeed"
                    class="rmd-feed"
                ></div>

            </div>


            <!-- TRAVEL -->

            <div
                id="rmdTravel"
                class="rmd-panel"
            >

                <div class="rmd-card">

                    <h3 class="rmd-section-title">
                        🌍 Travel & Tourist Places
                    </h3>

                    <form
                        id="rmdTravelForm"
                        class="rmd-form"
                    >

                        <input
                            type="text"
                            name="placeName"
                            placeholder="Place / Tourist Destination"
                            required
                        >


                        <input
                            type="text"
                            name="title"
                            placeholder="Travel Title"
                            required
                        >


                        <select
                            name="country"
                            required
                        >
                            ${buildCountryOptions("")}
                        </select>


                        ${commonLocationFields()}


                        <input
                            type="text"
                            name="localLocation"
                            placeholder="Local Location / Landmark"
                        >


                        <textarea
                            name="description"
                            placeholder="Tourist place description"
                            required
                        ></textarea>


                        ${commonMediaFields()}


                        ${commonReachFields()}


                        <button
                            type="submit"
                            class="rmd-submit"
                        >
                            Publish Travel Place
                        </button>

                    </form>

                </div>


                <div
                    id="rmdTravelFeed"
                    class="rmd-feed"
                ></div>

            </div>


            <!-- MOVIE -->

            <div
                id="rmdMovies"
                class="rmd-panel"
            >

                <div class="rmd-card">

                    <h3 class="rmd-section-title">
                        🎬 Movie Promoter
                    </h3>

                    <form
                        id="rmdMovieForm"
                        class="rmd-form"
                    >

                        <input
                            type="text"
                            name="movieName"
                            placeholder="Movie / Film Name"
                            required
                        >


                        <input
                            type="text"
                            name="title"
                            placeholder="Promotion Title"
                            required
                        >


                        <input
                            type="text"
                            name="language"
                            placeholder="Movie Language"
                        >


                        <select
                            name="country"
                            required
                        >
                            ${buildCountryOptions("")}
                        </select>


                        ${commonLocationFields()}


                        <textarea
                            name="description"
                            placeholder="Movie / promotion description"
                            required
                        ></textarea>


                        ${commonMediaFields()}


                        ${commonReachFields()}


                        <button
                            type="submit"
                            class="rmd-submit"
                        >
                            Publish Movie Promotion
                        </button>

                    </form>

                </div>


                <div
                    id="rmdMovieFeed"
                    class="rmd-feed"
                ></div>

            </div>


            <!-- CULTURE -->

            <div
                id="rmdCulture"
                class="rmd-panel"
            >

                <div class="rmd-card">

                    <h3 class="rmd-section-title">
                        🌎 World Culture & Local Life
                    </h3>

                    <form
                        id="rmdCultureForm"
                        class="rmd-form"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Culture / Local Life Title"
                            required
                        >


                        <input
                            type="text"
                            name="category"
                            placeholder="Culture Category"
                        >


                        <select
                            name="country"
                            required
                        >
                            ${buildCountryOptions("")}
                        </select>


                        ${commonLocationFields()}


                        <textarea
                            name="description"
                            placeholder="Describe culture, heritage, food, traditions, local life, etc."
                            required
                        ></textarea>


                        ${commonMediaFields()}


                        ${commonReachFields()}


                        <button
                            type="submit"
                            class="rmd-submit"
                        >
                            Publish World Culture
                        </button>

                    </form>

                </div>


                <div
                    id="rmdCultureFeed"
                    class="rmd-feed"
                ></div>

            </div>

        </div>

        `;
    }


    /* =====================================================
       STATUS
       ===================================================== */

    function showStatus(message, error) {

        var status =
            document.getElementById(
                "rmdStatus"
            );


        if (!status) {
            return;
        }


        status.className =
            error
                ? "rmd-error"
                : "rmd-success";


        status.textContent =
            message;
    }


    /* =====================================================
       FORM DATA
       ===================================================== */

    async function formToObject(
        form,
        type
    ) {

        var data = {};

        var formData =
            new FormData(form);


        formData.forEach(
            function (value, key) {

                if (
                    !(
                        value instanceof
                        File
                    )
                ) {

                    data[key] =
                        String(value || "")
                            .trim();
                }
            }
        );


        var image =
            form.querySelector(
                'input[name="image"]'
            );


        var video =
            form.querySelector(
                'input[name="video"]'
            );


        if (
            image &&
            image.files &&
            image.files[0]
        ) {

            if (
                !validateImage(
                    image.files[0]
                )
            ) {

                throw new Error(
                    "Invalid image."
                );
            }


            data.image =
                await readFileAsDataURL(
                    image.files[0]
                );
        }


        if (
            video &&
            video.files &&
            video.files[0]
        ) {

            if (
                !validateVideo(
                    video.files[0]
                )
            ) {

                throw new Error(
                    "Invalid video."
                );
            }


            data.video =
                await readFileAsDataURL(
                    video.files[0]
                );
        }


        data.id =
            createId("rmd");


        data.type =
            type;


        data.owner =
            getOwner();


        data.createdAt =
            new Date().toISOString();


        return data;
    }


    /* =====================================================
       FORM BINDING
       ===================================================== */

    function bindForms() {

        var brandForm =
            document.getElementById(
                "rmdBrandForm"
            );


        var travelForm =
            document.getElementById(
                "rmdTravelForm"
            );


        var movieForm =
            document.getElementById(
                "rmdMovieForm"
            );


        var cultureForm =
            document.getElementById(
                "rmdCultureForm"
            );


        if (brandForm) {

            brandForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    try {

                        var item =
                            await formToObject(
                                brandForm,
                                "brand"
                            );


                        var list =
                            getStorage(
                                CONFIG.storage.brands
                            );


                        list.unshift(item);


                        saveStorage(
                            CONFIG.storage.brands,
                            list
                        );


                        brandForm.reset();


                        renderBrands();


                        showStatus(
                            "Brand promotion published successfully.",
                            false
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showStatus(
                            error.message ||
                            "Could not publish brand promotion.",
                            true
                        );
                    }
                }
            );
        }


        if (travelForm) {

            travelForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    try {

                        var item =
                            await formToObject(
                                travelForm,
                                "travel"
                            );


                        var list =
                            getStorage(
                                CONFIG.storage.travel
                            );


                        list.unshift(item);


                        saveStorage(
                            CONFIG.storage.travel,
                            list
                        );


                        travelForm.reset();


                        renderTravel();


                        showStatus(
                            "Travel place published successfully.",
                            false
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showStatus(
                            error.message ||
                            "Could not publish travel place.",
                            true
                        );
                    }
                }
            );
        }


        if (movieForm) {

            movieForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    try {

                        var item =
                            await formToObject(
                                movieForm,
                                "movie"
                            );


                        var list =
                            getStorage(
                                CONFIG.storage.movies
                            );


                        list.unshift(item);


                        saveStorage(
                            CONFIG.storage.movies,
                            list
                        );


                        movieForm.reset();


                        renderMovies();


                        showStatus(
                            "Movie promotion published successfully.",
                            false
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showStatus(
                            error.message ||
                            "Could not publish movie promotion.",
                            true
                        );
                    }
                }
            );
        }


        if (cultureForm) {

            cultureForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    try {

                        var item =
                            await formToObject(
                                cultureForm,
                                "culture"
                            );


                        var list =
                            getStorage(
                                CONFIG.storage.culture
                            );


                        list.unshift(item);


                        saveStorage(
                            CONFIG.storage.culture,
                            list
                        );


                        cultureForm.reset();


                        renderCulture();


                        showStatus(
                            "World culture post published successfully.",
                            false
                        );

                    } catch (error) {

                        console.error(
                            error
                        );


                        showStatus(
                            error.message ||
                            "Could not publish culture post.",
                            true
                        );
                    }
                }
            );
        }
    }


    /* =====================================================
       TABS
       ===================================================== */

    function bindTabs() {

        var tabs =
            document.querySelectorAll(
                ".rmd-tab"
            );


        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        tabs.forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );
                            }
                        );


                        document
                            .querySelectorAll(
                                ".rmd-panel"
                            )
                            .forEach(
                                function (panel) {

                                    panel.classList.remove(
                                        "active"
                                    );
                                }
                            );


                        tab.classList.add(
                            "active"
                        );


                        var panelId =
                            tab.getAttribute(
                                "data-panel"
                            );


                        var panel =
                            document.getElementById(
                                panelId
                            );


                        if (panel) {

                            panel.classList.add(
                                "active"
                            );
                        }
                    }
                );
            }
        );
    }


    /* =====================================================
       MEDIA RENDER
       ===================================================== */

    function renderMedia(item) {

        var html = "";


        if (item.image) {

            html +=
                '<img class="rmd-media" src="' +
                escapeHTML(item.image) +
                '" alt="Discovery image">';
        }


        if (item.video) {

            html +=
                '<video class="rmd-media" controls preload="metadata">' +
                '<source src="' +
                escapeHTML(item.video) +
                '">' +
                "Your browser does not support video." +
                "</video>";
        }


        return html;
    }


    /* =====================================================
       ITEM RENDER
       ===================================================== */

    function renderItem(
        item,
        title,
        key,
        list
    ) {

        var locationParts = [];


        [
            item.village,
            item.city,
            item.district,
            item.state,
            item.country
        ].forEach(
            function (part) {

                if (part) {
                    locationParts.push(
                        part
                    );
                }
            }
        );


        var location =
            locationParts.join(
                " • "
            );


        return `

        <article
            class="rmd-item"
            data-id="${escapeHTML(item.id)}"
        >

            <div class="rmd-item-title">
                ${escapeHTML(
                    title
                )}
            </div>


            ${
                item.brandName
                    ? `
                    <div class="rmd-meta">
                        🏷️ Brand:
                        ${escapeHTML(
                            item.brandName
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.movieName
                    ? `
                    <div class="rmd-meta">
                        🎬 Movie:
                        ${escapeHTML(
                            item.movieName
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.placeName
                    ? `
                    <div class="rmd-meta">
                        📍 Place:
                        ${escapeHTML(
                            item.placeName
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.category
                    ? `
                    <div class="rmd-meta">
                        Category:
                        ${escapeHTML(
                            item.category
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.language
                    ? `
                    <div class="rmd-meta">
                        Language:
                        ${escapeHTML(
                            item.language
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                location
                    ? `
                    <div class="rmd-meta">
                        🌍 ${escapeHTML(
                            location
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.description
                    ? `
                    <div class="rmd-description">
                        ${escapeHTML(
                            item.description
                        )}
                    </div>
                    `
                    : ""
            }


            ${renderMedia(item)}


            ${
                item.website
                    ? `
                    <div class="rmd-meta">
                        🔗
                        ${escapeHTML(
                            item.website
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.social
                    ? `
                    <div class="rmd-meta">
                        📱
                        ${escapeHTML(
                            item.social
                        )}
                    </div>
                    `
                    : ""
            }


            ${
                item.reach
                    ? `
                    <div class="rmd-meta">
                        👥 Reach:
                        ${escapeHTML(
                            item.reach
                        )}
                    </div>
                    `
                    : ""
            }


            <div class="rmd-meta">
                Published:
                ${escapeHTML(
                    item.createdAt
                        ? new Date(
                            item.createdAt
                        ).toLocaleString()
                        : ""
                )}
            </div>


            <button
                type="button"
                class="rmd-delete"
                data-delete-key="${escapeHTML(key)}"
                data-delete-id="${escapeHTML(item.id)}"
            >
                Delete
            </button>

        </article>

        `;
    }


    /* =====================================================
       FEED
       ===================================================== */

    function renderFeed(
        elementId,
        list,
        key,
        titleResolver
    ) {

        var element =
            document.getElementById(
                elementId
            );


        if (!element) {
            return;
        }


        if (!list.length) {

            element.innerHTML =
                '<div class="rmd-empty">' +
                "No posts published yet." +
                "</div>";

            return;
        }


        element.innerHTML =
            list.map(
                function (item) {

                    return renderItem(
                        item,
                        titleResolver(item),
                        key,
                        list
                    );
                }
            ).join("");
    }


    /* =====================================================
       RENDER BRANDS
       ===================================================== */

    function renderBrands() {

        renderFeed(
            "rmdBrandFeed",
            getStorage(
                CONFIG.storage.brands
            ),
            CONFIG.storage.brands,
            function (item) {

                return (
                    item.title ||
                    item.brandName ||
                    "Brand Promotion"
                );
            }
        );
    }


    /* =====================================================
       RENDER TRAVEL
       ===================================================== */

    function renderTravel() {

        renderFeed(
            "rmdTravelFeed",
            getStorage(
                CONFIG.storage.travel
            ),
            CONFIG.storage.travel,
            function (item) {

                return (
                    item.title ||
                    item.placeName ||
                    "Travel Place"
                );
            }
        );
    }


    /* =====================================================
       RENDER MOVIES
       ===================================================== */

    function renderMovies() {

        renderFeed(
            "rmdMovieFeed",
            getStorage(
                CONFIG.storage.movies
            ),
            CONFIG.storage.movies,
            function (item) {

                return (
                    item.title ||
                    item.movieName ||
                    "Movie Promotion"
                );
            }
        );
    }


    /* =====================================================
       RENDER CULTURE
       ===================================================== */

    function renderCulture() {

        renderFeed(
            "rmdCultureFeed",
            getStorage(
                CONFIG.storage.culture
            ),
            CONFIG.storage.culture,
            function (item) {

                return (
                    item.title ||
                    "World Culture"
                );
            }
        );
    }


    /* =====================================================
       DELETE
       ===================================================== */

    function bindDeleteEvents() {

        document.addEventListener(
            "click",
            function (event) {

                var button =
                    event.target.closest(
                        ".rmd-delete"
                    );


                if (!button) {
                    return;
                }


                var key =
                    button.getAttribute(
                        "data-delete-key"
                    );


                var id =
                    button.getAttribute(
                        "data-delete-id"
                    );


                if (!key || !id) {
                    return;
                }


                var confirmDelete =
                    window.confirm(
                        "Delete this Discovery post?"
                    );


                if (!confirmDelete) {
                    return;
                }


                var list =
                    getStorage(key);


                var filtered =
                    list.filter(
                        function (item) {

                            return (
                                String(item.id) !==
                                String(id)
                            );
                        }
                    );


                saveStorage(
                    key,
                    filtered
                );


                renderAll();


                showStatus(
                    "Discovery post deleted.",
                    false
                );
            }
        );
    }


    /* =====================================================
       RENDER ALL
       ===================================================== */

    function renderAll() {

        renderBrands();

        renderTravel();

        renderMovies();

        renderCulture();
    }


    /* =====================================================
       SAFE INITIALIZATION
       ===================================================== */

    function initialize() {

        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );


        if (!hub) {

            console.error(
                "ALON Discovery: #rmDiscoveryHub not found."
            );

            return;
        }


        try {

            injectStyle();

            buildHub();

            bindTabs();

            bindForms();

            bindDeleteEvents();

            renderAll();


            showStatus(
                "ALON Marketplace Discovery loaded successfully.",
                false
            );


            console.log(
                "ALON DISCOVERY TEST: WORKING"
            );


            console.log(
                "ALON Regular Marketplace Discovery " +
                CONFIG.version +
                " loaded successfully."
            );

        } catch (error) {

            console.error(
                "ALON Discovery initialization error:",
                error
            );


            hub.innerHTML = `

                <div class="rmd-error">

                    <strong>
                        ALON Marketplace Discovery could not start.
                    </strong>

                    <br><br>

                    Error:
                    ${escapeHTML(
                        error.message ||
                        String(error)
                    )}

                    <br><br>

                    Please refresh the page once.

                </div>

            `;
        }
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_REGULAR_MARKETPLACE_DISCOVERY = {

        version:
            CONFIG.version,

        render:
            renderAll,

        renderBrands:
            renderBrands,

        renderTravel:
            renderTravel,

        renderMovies:
            renderMovies,

        renderCulture:
            renderCulture,

        getCountries:
            getCountryDatabase

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
            initialize
        );

    } else {

        initialize();
    }


})();