/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE DISCOVERY
   ---------------------------------------------------------
   File: regular-marketplace-discovery.js
   Version: 1.1
   Creator: Baba Thecno Guru

   FEATURES
   • Brand Promoter
   • Travel & Tourist Places
   • Movie Promoter
   • World Culture & Local Life
   • Existing MARKETPLACE_COUNTRIES support
   • Save / Delete
   • Mobile friendly
   • Local browser storage
   • Does NOT modify Global Marketplace
   • Does NOT modify Jobs
   • Does NOT modify marketplace-countries.js
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       CONFIGURATION
       ========================================================= */

    const CONFIG = {

        version: "1.1",

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

        maxImageSize:
            8 * 1024 * 1024,

        maxVideoSize:
            40 * 1024 * 1024

    };


    /* =========================================================
       BASIC HELPERS
       ========================================================= */

    function escapeHTML(value) {

        return String(value || "")
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
                .substring(2, 10)
        );

    }


    function getStorage(key) {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {
                return [];
            }

            const parsed =
                JSON.parse(value);

            return Array.isArray(parsed)
                ? parsed
                : [];

        } catch (error) {

            console.error(
                "Regular Marketplace Discovery storage error:",
                error
            );

            return [];

        }

    }


    function setStorage(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "Regular Marketplace Discovery save error:",
                error
            );

            return false;

        }

    }


    function getAccount() {

        try {

            const possibleKeys = [

                "alon_historyverse_regular_marketpkes_session",

                "alon_historyverse_regular_marketplace_session"

            ];

            for (
                let i = 0;
                i < possibleKeys.length;
                i++
            ) {

                const raw =
                    localStorage.getItem(
                        possibleKeys[i]
                    );

                if (!raw) {
                    continue;
                }

                try {

                    const parsed =
                        JSON.parse(raw);

                    if (parsed) {
                        return parsed;
                    }

                } catch (error) {

                    /* Continue to next possible key */

                }

            }

        } catch (error) {

            console.error(error);

        }

        return null;

    }


    function getOwner() {

        const account =
            getAccount();

        if (!account) {

            return {

                id: "local-user",

                name: "ALON User",

                email: ""

            };

        }

        return {

            id:
                account.id ||
                account.email ||
                account.name ||
                "local-user",

            name:
                account.name ||
                "ALON User",

            email:
                account.email ||
                ""

        };

    }


    /* =========================================================
       COUNTRY DATABASE
       IMPORTANT:
       Existing country database is ONLY READ.
       Nothing is changed here.
       ========================================================= */

    function getCountryDatabase() {

        if (
            Array.isArray(
                window.MARKETPLACE_COUNTRIES
            ) &&
            window.MARKETPLACE_COUNTRIES.length
        ) {

            return window.MARKETPLACE_COUNTRIES;

        }


        if (
            Array.isArray(
                window.ALON_WORLD_COUNTRIES
            ) &&
            window.ALON_WORLD_COUNTRIES.length
        ) {

            return window.ALON_WORLD_COUNTRIES;

        }


        if (
            Array.isArray(
                window.WORLD_COUNTRIES
            ) &&
            window.WORLD_COUNTRIES.length
        ) {

            return window.WORLD_COUNTRIES;

        }


        return [];

    }


    function countryLabel(country) {

        if (!country) {
            return "";
        }

        const flag =
            country.flag || "";

        const name =
            country.name ||
            country.country ||
            "";

        const code =
            country.code ||
            country.iso ||
            "";

        const callingCode =
            country.callingCode ||
            country.phone ||
            "";

        let label =
            (flag ? flag + " " : "") +
            name;

        if (code) {

            label +=
                " (" +
                code +
                ")";

        }

        if (callingCode) {

            label +=
                " " +
                callingCode;

        }

        return label.trim();

    }


    function buildCountryOptions() {

        const countries =
            getCountryDatabase();

        let html =
            '<option value="">Select Country</option>';

        countries.forEach(function (country) {

            const value =
                country.code ||
                country.iso ||
                country.name ||
                "";

            const label =
                countryLabel(country);

            if (!value || !label) {
                return;
            }

            html +=
                '<option value="' +
                escapeHTML(value) +
                '">' +
                escapeHTML(label) +
                "</option>";

        });

        return html;

    }


    /* =========================================================
       FILE READER
       ========================================================= */

    function readFileAsDataURL(file) {

        return new Promise(function (resolve, reject) {

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

            reader.readAsDataURL(file);

        });

    }


    function validateMedia(
        file,
        type
    ) {

        if (!file) {

            return {
                valid: true
            };

        }

        if (
            type === "image" &&
            file.size > CONFIG.maxImageSize
        ) {

            return {

                valid: false,

                message:
                    "Image must be 8 MB or smaller."

            };

        }

        if (
            type === "video" &&
            file.size > CONFIG.maxVideoSize
        ) {

            return {

                valid: false,

                message:
                    "Video must be 40 MB or smaller."

            };

        }

        return {
            valid: true
        };

    }


    /* =========================================================
       GLOBAL STYLE
       ========================================================= */

    function injectStyle() {

        if (
            document.getElementById(
                "rmDiscoveryStyle"
            )
        ) {

            return;

        }

        const style =
            document.createElement("style");

        style.id =
            "rmDiscoveryStyle";

        style.textContent = `

            .rmd-wrapper {
                width: 100%;
                box-sizing: border-box;
            }

            .rmd-title {
                margin: 0 0 8px;
                color: #8b6508;
                font-size: 28px;
            }

            .rmd-intro {
                color: #555;
                line-height: 1.6;
                margin-bottom: 20px;
            }

            .rmd-tabs {
                display: grid;
                grid-template-columns:
                    repeat(4, minmax(0, 1fr));
                gap: 10px;
                margin-bottom: 18px;
            }

            .rmd-tab {
                border: 1px solid #d7b35a;
                border-radius: 12px;
                background: #fff;
                color: #795600;
                padding: 12px 8px;
                cursor: pointer;
                font-weight: 700;
                line-height: 1.3;
            }

            .rmd-tab:hover {
                background: #fff8df;
            }

            .rmd-tab.active {
                background: #d7b35a;
                color: #111;
            }

            .rmd-panel {
                display: none;
                padding: 18px;
                border: 1px solid #ddd;
                border-radius: 16px;
                background: #fff;
            }

            .rmd-panel.active {
                display: block;
            }

            .rmd-panel h3 {
                margin-top: 0;
                color: #8b6508;
            }

            .rmd-grid {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 14px;
            }

            .rmd-field {
                width: 100%;
            }

            .rmd-full {
                grid-column: 1 / -1;
            }

            .rmd-field label {
                display: block;
                margin-bottom: 6px;
                color: #222;
                font-weight: 700;
            }

            .rmd-field input,
            .rmd-field select,
            .rmd-field textarea {
                width: 100%;
                padding: 11px;
                border: 1px solid #ccc;
                border-radius: 10px;
                background: #fff;
                color: #111;
                font-size: 15px;
                box-sizing: border-box;
            }

            .rmd-field textarea {
                min-height: 120px;
                resize: vertical;
            }

            .rmd-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 9px;
                margin-top: 15px;
            }

            .rmd-btn {
                border: 1px solid #b58d28;
                border-radius: 10px;
                padding: 10px 16px;
                background: #fff;
                color: #795600;
                cursor: pointer;
                font-weight: 700;
            }

            .rmd-btn-primary {
                background: #d7b35a;
                color: #111;
            }

            .rmd-btn-danger {
                border-color: #c44b4b;
                color: #b00000;
            }

            .rmd-status {
                display: none;
                margin-top: 12px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 9px;
                background: #fafafa;
                line-height: 1.5;
            }

            .rmd-status.show {
                display: block;
            }

            .rmd-feed {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 14px;
                margin-top: 18px;
            }

            .rmd-card {
                border: 1px solid #ddd;
                border-radius: 14px;
                overflow: hidden;
                background: #fff;
                padding: 14px;
                box-shadow:
                    0 3px 12px rgba(0,0,0,.05);
            }

            .rmd-card h4 {
                margin: 0 0 8px;
                color: #8b6508;
                font-size: 19px;
            }

            .rmd-card p {
                margin: 6px 0;
                color: #333;
                line-height: 1.5;
            }

            .rmd-card-media {
                width: 100%;
                max-height: 260px;
                object-fit: cover;
                border-radius: 10px;
                margin: 9px 0;
                display: block;
            }

            .rmd-card-video {
                width: 100%;
                max-height: 280px;
                border-radius: 10px;
                margin: 9px 0;
                display: block;
            }

            .rmd-meta {
                font-size: 13px;
                color: #777;
            }

            .rmd-empty {
                grid-column: 1 / -1;
                padding: 15px;
                border: 1px dashed #ccc;
                border-radius: 10px;
                color: #666;
                background: #fafafa;
            }

            .rmd-small {
                color: #777;
                font-size: 13px;
                line-height: 1.5;
            }

            .rmd-check {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-top: 8px;
                line-height: 1.5;
            }

            .rmd-check input {
                width: auto;
                margin-top: 4px;
            }

            @media (max-width: 800px) {

                .rmd-tabs {
                    grid-template-columns: 1fr 1fr;
                }

                .rmd-grid,
                .rmd-feed {
                    grid-template-columns: 1fr;
                }

                .rmd-full {
                    grid-column: auto;
                }

            }

            @media (max-width: 480px) {

                .rmd-tabs {
                    grid-template-columns: 1fr;
                }

                .rmd-panel {
                    padding: 13px;
                }

            }

        `;

        document.head.appendChild(style);

    }


    /* =========================================================
       FORM FIELD BUILDERS
       ========================================================= */

    function commonLocationFields(prefix) {

        return `

            <div class="rmd-field">

                <label>
                    Country
                </label>

                <select
                    id="${prefix}Country"
                >
                    ${buildCountryOptions()}
                </select>

            </div>


            <div class="rmd-field">

                <label>
                    State / Province
                </label>

                <input
                    id="${prefix}State"
                    type="text"
                    placeholder="Enter state / province"
                >

            </div>


            <div class="rmd-field">

                <label>
                    City
                </label>

                <input
                    id="${prefix}City"
                    type="text"
                    placeholder="Enter city"
                >

            </div>


            <div class="rmd-field">

                <label>
                    Village / Local Area
                </label>

                <input
                    id="${prefix}Village"
                    type="text"
                    placeholder="Enter village / local area"
                >

            </div>


            <div class="rmd-field rmd-full">

                <label>
                    Local Location
                </label>

                <input
                    id="${prefix}Location"
                    type="text"
                    placeholder="Enter local location / landmark"
                >

            </div>

        `;

    }


    /* =========================================================
       DISCOVERY HUB HTML
       ========================================================= */

    function buildHub() {

        const hub =
            document.getElementById(
                "rmDiscoveryHub"
            );

        if (!hub) {

            console.error(
                "ALON Discovery Hub: #rmDiscoveryHub not found."
            );

            return false;

        }


        hub.innerHTML = `

            <div class="rmd-wrapper">

                <h2 class="rmd-title">
                    🌍 ALON Discovery & Promotion Hub
                </h2>

                <p class="rmd-intro">
                    Promote brands, discover tourist places,
                    promote movies and share world culture
                    and local life through ALON HISTORYVERSE 24.
                </p>


                <div class="rmd-tabs">

                    <button
                        type="button"
                        class="rmd-tab active"
                        data-rmd-tab="brand"
                    >
                        🏷️ Brand Promoter
                    </button>

                    <button
                        type="button"
                        class="rmd-tab"
                        data-rmd-tab="travel"
                    >
                        🌍 Travel & Tourist
                    </button>

                    <button
                        type="button"
                        class="rmd-tab"
                        data-rmd-tab="movie"
                    >
                        🎬 Movie Promoter
                    </button>

                    <button
                        type="button"
                        class="rmd-tab"
                        data-rmd-tab="culture"
                    >
                        🌎 World Culture
                    </button>

                </div>


                <!-- =================================================
                     BRAND
                     ================================================= -->

                <div
                    class="rmd-panel active"
                    id="rmdPanelBrand"
                >

                    <h3>
                        🏷️ Brand Promoter
                    </h3>

                    <p class="rmd-small">
                        Promote your brand nationally,
                        internationally or worldwide.
                    </p>

                    <form id="rmdBrandForm">

                        <div class="rmd-grid">

                            <div class="rmd-field">

                                <label>
                                    Brand Name
                                </label>

                                <input
                                    id="rmdBrandName"
                                    type="text"
                                    required
                                    placeholder="Enter brand name"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Brand Category
                                </label>

                                <select
                                    id="rmdBrandCategory"
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="fashion">
                                        Fashion
                                    </option>

                                    <option value="food">
                                        Food & Beverage
                                    </option>

                                    <option value="technology">
                                        Technology
                                    </option>

                                    <option value="electronics">
                                        Electronics
                                    </option>

                                    <option value="automobile">
                                        Automobile
                                    </option>

                                    <option value="beauty">
                                        Beauty
                                    </option>

                                    <option value="education">
                                        Education
                                    </option>

                                    <option value="travel">
                                        Travel
                                    </option>

                                    <option value="real-estate">
                                        Real Estate
                                    </option>

                                    <option value="agriculture">
                                        Agriculture
                                    </option>

                                    <option value="manufacturing">
                                        Manufacturing
                                    </option>

                                    <option value="services">
                                        Services
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            ${commonLocationFields("rmdBrand")}


                            <div class="rmd-field">

                                <label>
                                    Promotion Reach
                                </label>

                                <select
                                    id="rmdBrandReach"
                                >

                                    <option value="local">
                                        Local
                                    </option>

                                    <option value="national">
                                        National
                                    </option>

                                    <option value="international">
                                        International
                                    </option>

                                    <option value="global">
                                        Global / Worldwide
                                    </option>

                                </select>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Website / Social Link
                                </label>

                                <input
                                    id="rmdBrandLink"
                                    type="url"
                                    placeholder="https://example.com"
                                >

                            </div>


                            <div class="rmd-field rmd-full">

                                <label>
                                    Brand Description
                                </label>

                                <textarea
                                    id="rmdBrandDescription"
                                    required
                                    placeholder="Describe your brand, products and services"
                                ></textarea>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Brand Image
                                </label>

                                <input
                                    id="rmdBrandImage"
                                    type="file"
                                    accept="image/*"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Brand Video
                                </label>

                                <input
                                    id="rmdBrandVideo"
                                    type="file"
                                    accept="video/*"
                                >

                            </div>

                        </div>


                        <div class="rmd-actions">

                            <button
                                type="submit"
                                class="rmd-btn rmd-btn-primary"
                            >
                                Publish Brand
                            </button>

                        </div>


                        <div
                            id="rmdBrandStatus"
                            class="rmd-status"
                        ></div>

                    </form>


                    <div
                        id="rmdBrandFeed"
                        class="rmd-feed"
                    ></div>

                </div>


                <!-- =================================================
                     TRAVEL
                     ================================================= -->

                <div
                    class="rmd-panel"
                    id="rmdPanelTravel"
                >

                    <h3>
                        🌍 Travel & Tourist Places
                    </h3>

                    <p class="rmd-small">
                        Share tourist places from country to
                        state, city, village and local location.
                    </p>

                    <form id="rmdTravelForm">

                        <div class="rmd-grid">

                            <div class="rmd-field">

                                <label>
                                    Tourist Place Name
                                </label>

                                <input
                                    id="rmdTravelName"
                                    type="text"
                                    required
                                    placeholder="Enter tourist place"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Place Category
                                </label>

                                <select
                                    id="rmdTravelCategory"
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="heritage">
                                        Heritage
                                    </option>

                                    <option value="historical">
                                        Historical
                                    </option>

                                    <option value="nature">
                                        Nature
                                    </option>

                                    <option value="beach">
                                        Beach
                                    </option>

                                    <option value="mountain">
                                        Mountain
                                    </option>

                                    <option value="wildlife">
                                        Wildlife
                                    </option>

                                    <option value="religious">
                                        Religious / Spiritual
                                    </option>

                                    <option value="city">
                                        City Attraction
                                    </option>

                                    <option value="village">
                                        Village Tourism
                                    </option>

                                    <option value="local">
                                        Local Attraction
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            ${commonLocationFields("rmdTravel")}


                            <div class="rmd-field">

                                <label>
                                    Tour Guide Type
                                </label>

                                <select
                                    id="rmdTravelGuide"
                                >

                                    <option value="none">
                                        No Guide
                                    </option>

                                    <option value="local">
                                        Local Tour Guide
                                    </option>

                                    <option value="vip">
                                        VIP Tour Guide
                                    </option>

                                    <option value="local-vip">
                                        Local + VIP Guide
                                    </option>

                                </select>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Promotion Reach
                                </label>

                                <select
                                    id="rmdTravelReach"
                                >

                                    <option value="local">
                                        Local
                                    </option>

                                    <option value="national">
                                        National
                                    </option>

                                    <option value="international">
                                        International
                                    </option>

                                    <option value="global">
                                        Global / Worldwide
                                    </option>

                                </select>

                            </div>


                            <div class="rmd-field rmd-full">

                                <label>
                                    Travel Post
                                </label>

                                <textarea
                                    id="rmdTravelDescription"
                                    required
                                    placeholder="Describe the place, attractions, local experience, travel information, etc."
                                ></textarea>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Place Image
                                </label>

                                <input
                                    id="rmdTravelImage"
                                    type="file"
                                    accept="image/*"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Place Video / Reel
                                </label>

                                <input
                                    id="rmdTravelVideo"
                                    type="file"
                                    accept="video/*"
                                >

                            </div>

                        </div>


                        <div class="rmd-actions">

                            <button
                                type="submit"
                                class="rmd-btn rmd-btn-primary"
                            >
                                Publish Travel Post
                            </button>

                        </div>


                        <div
                            id="rmdTravelStatus"
                            class="rmd-status"
                        ></div>

                    </form>


                    <div
                        id="rmdTravelFeed"
                        class="rmd-feed"
                    ></div>

                </div>


                <!-- =================================================
                     MOVIE
                     ================================================= -->

                <div
                    class="rmd-panel"
                    id="rmdPanelMovie"
                >

                    <h3>
                        🎬 Movie Promoter
                    </h3>

                    <p class="rmd-small">
                        Filmmakers and movie teams can promote
                        movies locally, nationally and worldwide.
                    </p>

                    <form id="rmdMovieForm">

                        <div class="rmd-grid">

                            <div class="rmd-field">

                                <label>
                                    Movie Name
                                </label>

                                <input
                                    id="rmdMovieName"
                                    type="text"
                                    required
                                    placeholder="Enter movie name"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Movie Language
                                </label>

                                <input
                                    id="rmdMovieLanguage"
                                    type="text"
                                    placeholder="Hindi, English, Tamil, etc."
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Movie Type
                                </label>

                                <select
                                    id="rmdMovieType"
                                >

                                    <option value="film">
                                        Film
                                    </option>

                                    <option value="short-film">
                                        Short Film
                                    </option>

                                    <option value="documentary">
                                        Documentary
                                    </option>

                                    <option value="series">
                                        Web Series
                                    </option>

                                    <option value="music-video">
                                        Music Video
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Promotion Reach
                                </label>

                                <select
                                    id="rmdMovieReach"
                                >

                                    <option value="local">
                                        Local
                                    </option>

                                    <option value="national">
                                        National
                                    </option>

                                    <option value="international">
                                        International
                                    </option>

                                    <option value="global">
                                        Global / Worldwide
                                    </option>

                                </select>

                            </div>


                            ${commonLocationFields("rmdMovie")}


                            <div class="rmd-field rmd-full">

                                <label>
                                    Movie Description
                                </label>

                                <textarea
                                    id="rmdMovieDescription"
                                    required
                                    placeholder="Movie story, cast, production information, release information, etc."
                                ></textarea>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Poster / Image
                                </label>

                                <input
                                    id="rmdMovieImage"
                                    type="file"
                                    accept="image/*"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Trailer / Reel / Video
                                </label>

                                <input
                                    id="rmdMovieVideo"
                                    type="file"
                                    accept="video/*"
                                >

                            </div>


                            <div class="rmd-field rmd-full">

                                <label>
                                    Trailer / Movie Link
                                </label>

                                <input
                                    id="rmdMovieLink"
                                    type="url"
                                    placeholder="https://example.com"
                                >

                            </div>

                        </div>


                        <div class="rmd-actions">

                            <button
                                type="submit"
                                class="rmd-btn rmd-btn-primary"
                            >
                                Publish Movie
                            </button>

                        </div>


                        <div
                            id="rmdMovieStatus"
                            class="rmd-status"
                        ></div>

                    </form>


                    <div
                        id="rmdMovieFeed"
                        class="rmd-feed"
                    ></div>

                </div>


                <!-- =================================================
                     CULTURE
                     ================================================= -->

                <div
                    class="rmd-panel"
                    id="rmdPanelCulture"
                >

                    <h3>
                        🌎 World Culture & Local Life
                    </h3>

                    <p class="rmd-small">
                        Share countries, states, cities,
                        villages and local culture, food,
                        dress, music, dance, festivals,
                        art, heritage, language and local life.
                    </p>

                    <form id="rmdCultureForm">

                        <div class="rmd-grid">

                            <div class="rmd-field">

                                <label>
                                    Culture / Place Title
                                </label>

                                <input
                                    id="rmdCultureName"
                                    type="text"
                                    required
                                    placeholder="Enter title"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Culture Category
                                </label>

                                <select
                                    id="rmdCultureCategory"
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="country">
                                        Country
                                    </option>

                                    <option value="state">
                                        State / Province
                                    </option>

                                    <option value="city">
                                        City
                                    </option>

                                    <option value="village">
                                        Village
                                    </option>

                                    <option value="local-life">
                                        Local Life
                                    </option>

                                    <option value="food">
                                        Food
                                    </option>

                                    <option value="dress">
                                        Dress
                                    </option>

                                    <option value="music">
                                        Music
                                    </option>

                                    <option value="dance">
                                        Dance
                                    </option>

                                    <option value="festival">
                                        Festival
                                    </option>

                                    <option value="art">
                                        Art
                                    </option>

                                    <option value="heritage">
                                        Heritage
                                    </option>

                                    <option value="language">
                                        Language
                                    </option>

                                    <option value="tradition">
                                        Tradition
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>

                            </div>


                            ${commonLocationFields("rmdCulture")}


                            <div class="rmd-field rmd-full">

                                <label>
                                    Culture / Local Life Description
                                </label>

                                <textarea
                                    id="rmdCultureDescription"
                                    required
                                    placeholder="Describe the culture, food, dress, music, dance, festival, heritage, language or local life."
                                ></textarea>

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Image
                                </label>

                                <input
                                    id="rmdCultureImage"
                                    type="file"
                                    accept="image/*"
                                >

                            </div>


                            <div class="rmd-field">

                                <label>
                                    Video / Reel / Short
                                </label>

                                <input
                                    id="rmdCultureVideo"
                                    type="file"
                                    accept="video/*"
                                >

                            </div>

                        </div>


                        <div class="rmd-actions">

                            <button
                                type="submit"
                                class="rmd-btn rmd-btn-primary"
                            >
                                Publish Culture Post
                            </button>

                        </div>


                        <div
                            id="rmdCultureStatus"
                            class="rmd-status"
                        ></div>

                    </form>


                    <div
                        id="rmdCultureFeed"
                        class="rmd-feed"
                    ></div>

                </div>

            </div>

        `;

        return true;

    }


    /* =========================================================
       TAB SYSTEM
       ========================================================= */

    function bindTabs() {

        const tabs =
            document.querySelectorAll(
                ".rmd-tab"
            );

        tabs.forEach(function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    const target =
                        tab.getAttribute(
                            "data-rmd-tab"
                        );

                    document
                        .querySelectorAll(
                            ".rmd-tab"
                        )
                        .forEach(function (item) {

                            item.classList.remove(
                                "active"
                            );

                        });

                    document
                        .querySelectorAll(
                            ".rmd-panel"
                        )
                        .forEach(function (panel) {

                            panel.classList.remove(
                                "active"
                            );

                        });

                    tab.classList.add(
                        "active"
                    );

                    const panel =
                        document.getElementById(
                            "rmdPanel" +
                            target.charAt(0).toUpperCase() +
                            target.slice(1)
                        );

                    if (panel) {

                        panel.classList.add(
                            "active"
                        );

                    }

                }
            );

        });

    }


    /* =========================================================
       STATUS
       ========================================================= */

    function showStatus(
        id,
        message
    ) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.textContent =
            message;

        element.classList.add(
            "show"
        );

    }


    /* =========================================================
       MEDIA DATA
       ========================================================= */

    async function getMediaData(
        imageId,
        videoId
    ) {

        const imageInput =
            document.getElementById(
                imageId
            );

        const videoInput =
            document.getElementById(
                videoId
            );

        const imageFile =
            imageInput &&
            imageInput.files &&
            imageInput.files[0]
                ? imageInput.files[0]
                : null;

        const videoFile =
            videoInput &&
            videoInput.files &&
            videoInput.files[0]
                ? videoInput.files[0]
                : null;


        const imageCheck =
            validateMedia(
                imageFile,
                "image"
            );

        if (!imageCheck.valid) {

            throw new Error(
                imageCheck.message
            );

        }


        const videoCheck =
            validateMedia(
                videoFile,
                "video"
            );

        if (!videoCheck.valid) {

            throw new Error(
                videoCheck.message
            );

        }


        let image = "";
        let video = "";


        if (imageFile) {

            image =
                await readFileAsDataURL(
                    imageFile
                );

        }


        if (videoFile) {

            video =
                await readFileAsDataURL(
                    videoFile
                );

        }


        return {
            image,
            video
        };

    }


    /* =========================================================
       LOCATION DATA
       ========================================================= */

    function getLocation(
        prefix
    ) {

        return {

            country:
                document.getElementById(
                    prefix + "Country"
                )?.value || "",

            state:
                document.getElementById(
                    prefix + "State"
                )?.value || "",

            city:
                document.getElementById(
                    prefix + "City"
                )?.value || "",

            village:
                document.getElementById(
                    prefix + "Village"
                )?.value || "",

            location:
                document.getElementById(
                    prefix + "Location"
                )?.value || ""

        };

    }


    /* =========================================================
       CARD MEDIA
       ========================================================= */

    function renderMedia(item) {

        let html = "";


        if (item.image) {

            html +=
                '<img class="rmd-card-media" ' +
                'src="' +
                escapeHTML(item.image) +
                '" alt="Published image">';

        }


        if (item.video) {

            html +=
                '<video class="rmd-card-video" ' +
                'controls playsinline ' +
                'src="' +
                escapeHTML(item.video) +
                '"></video>';

        }


        return html;

    }


    function renderLocation(item) {

        const parts = [];

        if (item.country) {
            parts.push(item.country);
        }

        if (item.state) {
            parts.push(item.state);
        }

        if (item.city) {
            parts.push(item.city);
        }

        if (item.village) {
            parts.push(item.village);
        }

        if (item.location) {
            parts.push(item.location);
        }

        if (!parts.length) {
            return "";
        }

        return escapeHTML(
            parts.join(" • ")
        );

    }


    /* =========================================================
       OWNER CHECK
       ========================================================= */

    function isOwner(item) {

        const owner =
            getOwner();

        if (!item) {
            return false;
        }

        if (
            item.ownerId &&
            owner.id &&
            item.ownerId === owner.id
        ) {

            return true;

        }

        if (
            item.ownerEmail &&
            owner.email &&
            item.ownerEmail === owner.email
        ) {

            return true;

        }

        return false;

    }


    /* =========================================================
       GENERIC DELETE
       ========================================================= */

    function deleteItem(
        storageKey,
        id
    ) {

        const data =
            getStorage(
                storageKey
            );

        const item =
            data.find(function (entry) {

                return entry.id === id;

            });


        if (!item) {
            return;
        }


        if (!isOwner(item)) {

            alert(
                "Only the owner can delete this post."
            );

            return;

        }


        const confirmed =
            window.confirm(
                "Delete this post?"
            );

        if (!confirmed) {
            return;
        }


        const updated =
            data.filter(function (entry) {

                return entry.id !== id;

            });


        setStorage(
            storageKey,
            updated
        );

    }


    /* =========================================================
       BRAND RENDER
       ========================================================= */

    function renderBrands() {

        const feed =
            document.getElementById(
                "rmdBrandFeed"
            );

        if (!feed) {
            return;
        }


        const data =
            getStorage(
                CONFIG.storage.brands
            );


        if (!data.length) {

            feed.innerHTML =
                '<div class="rmd-empty">' +
                'No brand promotions published yet.' +
                '</div>';

            return;

        }


        feed.innerHTML =
            data
                .slice()
                .reverse()
                .map(function (item) {

                    const ownerControls =
                        isOwner(item)
                            ? `
                                <div class="rmd-actions">

                                    <button
                                        type="button"
                                        class="rmd-btn rmd-btn-danger"
                                        data-rmd-delete-brand="${escapeHTML(item.id)}"
                                    >
                                        Delete
                                    </button>

                                </div>
                              `
                            : "";


                    const link =
                        item.link
                            ? `
                                <p>
                                    <strong>Link:</strong>
                                    <a
                                        href="${escapeHTML(item.link)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Visit
                                    </a>
                                </p>
                              `
                            : "";


                    return `

                        <article class="rmd-card">

                            <h4>
                                🏷️ ${escapeHTML(item.name)}
                            </h4>

                            ${renderMedia(item)}

                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(item.category)}
                            </p>

                            <p>
                                <strong>Reach:</strong>
                                ${escapeHTML(item.reach)}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${renderLocation(item) || "Not specified"}
                            </p>

                            <p>
                                ${escapeHTML(item.description)}
                            </p>

                            ${link}

                            <div class="rmd-meta">
                                Published by
                                ${escapeHTML(item.ownerName)}
                            </div>

                            ${ownerControls}

                        </article>

                    `;

                })
                .join("");

    }


    /* =========================================================
       TRAVEL RENDER
       ========================================================= */

    function renderTravel() {

        const feed =
            document.getElementById(
                "rmdTravelFeed"
            );

        if (!feed) {
            return;
        }


        const data =
            getStorage(
                CONFIG.storage.travel
            );


        if (!data.length) {

            feed.innerHTML =
                '<div class="rmd-empty">' +
                'No tourist places published yet.' +
                '</div>';

            return;

        }


        feed.innerHTML =
            data
                .slice()
                .reverse()
                .map(function (item) {

                    const ownerControls =
                        isOwner(item)
                            ? `
                                <div class="rmd-actions">

                                    <button
                                        type="button"
                                        class="rmd-btn rmd-btn-danger"
                                        data-rmd-delete-travel="${escapeHTML(item.id)}"
                                    >
                                        Delete
                                    </button>

                                </div>
                              `
                            : "";


                    return `

                        <article class="rmd-card">

                            <h4>
                                🌍 ${escapeHTML(item.name)}
                            </h4>

                            ${renderMedia(item)}

                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(item.category)}
                            </p>

                            <p>
                                <strong>Guide:</strong>
                                ${escapeHTML(item.guide)}
                            </p>

                            <p>
                                <strong>Reach:</strong>
                                ${escapeHTML(item.reach)}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${renderLocation(item) || "Not specified"}
                            </p>

                            <p>
                                ${escapeHTML(item.description)}
                            </p>

                            <div class="rmd-meta">
                                Published by
                                ${escapeHTML(item.ownerName)}
                            </div>

                            ${ownerControls}

                        </article>

                    `;

                })
                .join("");

    }


    /* =========================================================
       MOVIE RENDER
       ========================================================= */

    function renderMovies() {

        const feed =
            document.getElementById(
                "rmdMovieFeed"
            );

        if (!feed) {
            return;
        }


        const data =
            getStorage(
                CONFIG.storage.movies
            );


        if (!data.length) {

            feed.innerHTML =
                '<div class="rmd-empty">' +
                'No movie promotions published yet.' +
                '</div>';

            return;

        }


        feed.innerHTML =
            data
                .slice()
                .reverse()
                .map(function (item) {

                    const ownerControls =
                        isOwner(item)
                            ? `
                                <div class="rmd-actions">

                                    <button
                                        type="button"
                                        class="rmd-btn rmd-btn-danger"
                                        data-rmd-delete-movie="${escapeHTML(item.id)}"
                                    >
                                        Delete
                                    </button>

                                </div>
                              `
                            : "";


                    const link =
                        item.link
                            ? `
                                <p>
                                    <strong>Trailer / Link:</strong>
                                    <a
                                        href="${escapeHTML(item.link)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open
                                    </a>
                                </p>
                              `
                            : "";


                    return `

                        <article class="rmd-card">

                            <h4>
                                🎬 ${escapeHTML(item.name)}
                            </h4>

                            ${renderMedia(item)}

                            <p>
                                <strong>Type:</strong>
                                ${escapeHTML(item.type)}
                            </p>

                            <p>
                                <strong>Language:</strong>
                                ${escapeHTML(item.language || "Not specified")}
                            </p>

                            <p>
                                <strong>Reach:</strong>
                                ${escapeHTML(item.reach)}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${renderLocation(item) || "Not specified"}
                            </p>

                            <p>
                                ${escapeHTML(item.description)}
                            </p>

                            ${link}

                            <div class="rmd-meta">
                                Published by
                                ${escapeHTML(item.ownerName)}
                            </div>

                            ${ownerControls}

                        </article>

                    `;

                })
                .join("");

    }


    /* =========================================================
       CULTURE RENDER
       ========================================================= */

    function renderCulture() {

        const feed =
            document.getElementById(
                "rmdCultureFeed"
            );

        if (!feed) {
            return;
        }


        const data =
            getStorage(
                CONFIG.storage.culture
            );


        if (!data.length) {

            feed.innerHTML =
                '<div class="rmd-empty">' +
                'No culture posts published yet.' +
                '</div>';

            return;

        }


        feed.innerHTML =
            data
                .slice()
                .reverse()
                .map(function (item) {

                    const ownerControls =
                        isOwner(item)
                            ? `
                                <div class="rmd-actions">

                                    <button
                                        type="button"
                                        class="rmd-btn rmd-btn-danger"
                                        data-rmd-delete-culture="${escapeHTML(item.id)}"
                                    >
                                        Delete
                                    </button>

                                </div>
                              `
                            : "";


                    return `

                        <article class="rmd-card">

                            <h4>
                                🌎 ${escapeHTML(item.name)}
                            </h4>

                            ${renderMedia(item)}

                            <p>
                                <strong>Category:</strong>
                                ${escapeHTML(item.category)}
                            </p>

                            <p>
                                <strong>Location:</strong>
                                ${renderLocation(item) || "Not specified"}
                            </p>

                            <p>
                                ${escapeHTML(item.description)}
                            </p>

                            <div class="rmd-meta">
                                Published by
                                ${escapeHTML(item.ownerName)}
                            </div>

                            ${ownerControls}

                        </article>

                    `;

                })
                .join("");

    }


    /* =========================================================
       BRAND SUBMIT
       ========================================================= */

    async function submitBrand(
        event
    ) {

        event.preventDefault();


        try {

            const owner =
                getOwner();


            const name =
                document.getElementById(
                    "rmdBrandName"
                ).value.trim();

            const category =
                document.getElementById(
                    "rmdBrandCategory"
                ).value;

            const reach =
                document.getElementById(
                    "rmdBrandReach"
                ).value;

            const link =
                document.getElementById(
                    "rmdBrandLink"
                ).value.trim();

            const description =
                document.getElementById(
                    "rmdBrandDescription"
                ).value.trim();


            if (!name ||
                !category ||
                !description
            ) {

                showStatus(
                    "rmdBrandStatus",
                    "Please complete the required brand fields."
                );

                return;

            }


            const media =
                await getMediaData(
                    "rmdBrandImage",
                    "rmdBrandVideo"
                );


            const location =
                getLocation(
                    "rmdBrand"
                );


            const item = {

                id:
                    createId("brand"),

                ownerId:
                    owner.id,

                ownerName:
                    owner.name,

                ownerEmail:
                    owner.email,

                name,

                category,

                reach,

                link,

                description,

                ...location,

                image:
                    media.image,

                video:
                    media.video,

                createdAt:
                    new Date().toISOString()

            };


            const data =
                getStorage(
                    CONFIG.storage.brands
                );


            data.push(item);


            if (
                !setStorage(
                    CONFIG.storage.brands,
                    data
                )
            ) {

                throw new Error(
                    "Could not save the brand promotion."
                );

            }


            event.target.reset();

            showStatus(
                "rmdBrandStatus",
                "Brand promotion published successfully."
            );

            renderBrands();


        } catch (error) {

            console.error(error);

            showStatus(
                "rmdBrandStatus",
                error.message ||
                "Unable to publish brand promotion."
            );

        }

    }


    /* =========================================================
       TRAVEL SUBMIT
       ========================================================= */

    async function submitTravel(
        event
    ) {

        event.preventDefault();


        try {

            const owner =
                getOwner();


            const name =
                document.getElementById(
                    "rmdTravelName"
                ).value.trim();

            const category =
                document.getElementById(
                    "rmdTravelCategory"
                ).value;

            const guide =
                document.getElementById(
                    "rmdTravelGuide"
                ).value;

            const reach =
                document.getElementById(
                    "rmdTravelReach"
                ).value;

            const description =
                document.getElementById(
                    "rmdTravelDescription"
                ).value.trim();


            if (
                !name ||
                !category ||
                !description
            ) {

                showStatus(
                    "rmdTravelStatus",
                    "Please complete the required travel fields."
                );

                return;

            }


            const media =
                await getMediaData(
                    "rmdTravelImage",
                    "rmdTravelVideo"
                );


            const location =
                getLocation(
                    "rmdTravel"
                );


            const item = {

                id:
                    createId("travel"),

                ownerId:
                    owner.id,

                ownerName:
                    owner.name,

                ownerEmail:
                    owner.email,

                name,

                category,

                guide,

                reach,

                description,

                ...location,

                image:
                    media.image,

                video:
                    media.video,

                createdAt:
                    new Date().toISOString()

            };


            const data =
                getStorage(
                    CONFIG.storage.travel
                );


            data.push(item);


            if (
                !setStorage(
                    CONFIG.storage.travel,
                    data
                )
            ) {

                throw new Error(
                    "Could not save the travel post."
                );

            }


            event.target.reset();

            showStatus(
                "rmdTravelStatus",
                "Travel post published successfully."
            );

            renderTravel();


        } catch (error) {

            console.error(error);

            showStatus(
                "rmdTravelStatus",
                error.message ||
                "Unable to publish travel post."
            );

        }

    }


    /* =========================================================
       MOVIE SUBMIT
       ========================================================= */

    async function submitMovie(
        event
    ) {

        event.preventDefault();


        try {

            const owner =
                getOwner();


            const name =
                document.getElementById(
                    "rmdMovieName"
                ).value.trim();

            const language =
                document.getElementById(
                    "rmdMovieLanguage"
                ).value.trim();

            const type =
                document.getElementById(
                    "rmdMovieType"
                ).value;

            const reach =
                document.getElementById(
                    "rmdMovieReach"
                ).value;

            const link =
                document.getElementById(
                    "rmdMovieLink"
                ).value.trim();

            const description =
                document.getElementById(
                    "rmdMovieDescription"
                ).value.trim();


            if (
                !name ||
                !description
            ) {

                showStatus(
                    "rmdMovieStatus",
                    "Please complete the required movie fields."
                );

                return;

            }


            const media =
                await getMediaData(
                    "rmdMovieImage",
                    "rmdMovieVideo"
                );


            const location =
                getLocation(
                    "rmdMovie"
                );


            const item = {

                id:
                    createId("movie"),

                ownerId:
                    owner.id,

                ownerName:
                    owner.name,

                ownerEmail:
                    owner.email,

                name,

                language,

                type,

                reach,

                link,

                description,

                ...location,

                image:
                    media.image,

                video:
                    media.video,

                createdAt:
                    new Date().toISOString()

            };


            const data =
                getStorage(
                    CONFIG.storage.movies
                );


            data.push(item);


            if (
                !setStorage(
                    CONFIG.storage.movies,
                    data
                )
            ) {

                throw new Error(
                    "Could not save the movie promotion."
                );

            }


            event.target.reset();

            showStatus(
                "rmdMovieStatus",
                "Movie promotion published successfully."
            );

            renderMovies();


        } catch (error) {

            console.error(error);

            showStatus(
                "rmdMovieStatus",
                error.message ||
                "Unable to publish movie promotion."
            );

        }

    }


    /* =========================================================
       CULTURE SUBMIT
       ========================================================= */

    async function submitCulture(
        event
    ) {

        event.preventDefault();


        try {

            const owner =
                getOwner();


            const name =
                document.getElementById(
                    "rmdCultureName"
                ).value.trim();

            const category =
                document.getElementById(
                    "rmdCultureCategory"
                ).value;

            const description =
                document.getElementById(
                    "rmdCultureDescription"
                ).value.trim();


            if (
                !name ||
                !category ||
                !description
            ) {

                showStatus(
                    "rmdCultureStatus",
                    "Please complete the required culture fields."
                );

                return;

            }


            const media =
                await getMediaData(
                    "rmdCultureImage",
                    "rmdCultureVideo"
                );


            const location =
                getLocation(
                    "rmdCulture"
                );


            const item = {

                id:
                    createId("culture"),

                ownerId:
                    owner.id,

                ownerName:
                    owner.name,

                ownerEmail:
                    owner.email,

                name,

                category,

                description,

                ...location,

                image:
                    media.image,

                video:
                    media.video,

                createdAt:
                    new Date().toISOString()

            };


            const data =
                getStorage(
                    CONFIG.storage.culture
                );


            data.push(item);


            if (
                !setStorage(
                    CONFIG.storage.culture,
                    data
                )
            ) {

                throw new Error(
                    "Could not save the culture post."
                );

            }


            event.target.reset();

            showStatus(
                "rmdCultureStatus",
                "Culture post published successfully."
            );

            renderCulture();


        } catch (error) {

            console.error(error);

            showStatus(
                "rmdCultureStatus",
                error.message ||
                "Unable to publish culture post."
            );

        }

    }


    /* =========================================================
       EVENT DELEGATION
       ========================================================= */

    function bindDeleteEvents() {

        const hub =
            document.getElementById(
                "rmDiscoveryHub"
            );

        if (!hub) {
            return;
        }


        hub.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "button"
                    );

                if (!button) {
                    return;
                }


                const brandId =
                    button.getAttribute(
                        "data-rmd-delete-brand"
                    );

                if (brandId) {

                    deleteItem(
                        CONFIG.storage.brands,
                        brandId
                    );

                    renderBrands();

                    return;

                }


                const travelId =
                    button.getAttribute(
                        "data-rmd-delete-travel"
                    );

                if (travelId) {

                    deleteItem(
                        CONFIG.storage.travel,
                        travelId
                    );

                    renderTravel();

                    return;

                }


                const movieId =
                    button.getAttribute(
                        "data-rmd-delete-movie"
                    );

                if (movieId) {

                    deleteItem(
                        CONFIG.storage.movies,
                        movieId
                    );

                    renderMovies();

                    return;

                }


                const cultureId =
                    button.getAttribute(
                        "data-rmd-delete-culture"
                    );

                if (cultureId) {

                    deleteItem(
                        CONFIG.storage.culture,
                        cultureId
                    );

                    renderCulture();

                    return;

                }

            }
        );

    }


    /* =========================================================
       FORM BINDING
       ========================================================= */

    function bindForms() {

        const brandForm =
            document.getElementById(
                "rmdBrandForm"
            );

        const travelForm =
            document.getElementById(
                "rmdTravelForm"
            );

        const movieForm =
            document.getElementById(
                "rmdMovieForm"
            );

        const cultureForm =
            document.getElementById(
                "rmdCultureForm"
            );


        if (brandForm) {

            brandForm.addEventListener(
                "submit",
                submitBrand
            );

        }


        if (travelForm) {

            travelForm.addEventListener(
                "submit",
                submitTravel
            );

        }


        if (movieForm) {

            movieForm.addEventListener(
                "submit",
                submitMovie
            );

        }


        if (cultureForm) {

            cultureForm.addEventListener(
                "submit",
                submitCulture
            );

        }

    }


    /* =========================================================
       RENDER ALL
       ========================================================= */

    function renderAll() {

        renderBrands();

        renderTravel();

        renderMovies();

        renderCulture();

    }


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    function initialize() {

        try {

            const hub =
                document.getElementById(
                    "rmDiscoveryHub"
                );

            if (!hub) {

                console.error(
                    "ALON HISTORYVERSE 24: " +
                    "rmDiscoveryHub container was not found."
                );

                return;

            }


            injectStyle();


            if (!buildHub()) {
                return;
            }


            bindTabs();

            bindForms();

            bindDeleteEvents();

            renderAll();


            console.log(
                "ALON HISTORYVERSE 24 Regular Marketplace Discovery " +
                "loaded successfully. Version:",
                CONFIG.version
            );


        } catch (error) {

            console.error(
                "ALON Discovery initialization error:",
                error
            );

        }

    }


    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

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


})();