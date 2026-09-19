/* =========================================================
   FILE NAME: regular-marketplace-discovery.js

   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE DISCOVERY
   SAFE FEATURE ADD-ON
   ---------------------------------------------------------
   Adds:
   👀 Viewer / Explore
   ➕ Publisher / Add
   ✏️ Edit
   🗑️ Owner Delete
   👤 Owner Identification
   🔎 Search
   🌍 Country Filter
   🖼️ Image
   🎥 Video
   ✈️ Travel
   🧑‍🏫 Culture Tour Guide
   🎬 Movies
   📺 TV Serials
   🎙️ Podcasts
   🌐 Hosting
   🎞️ Web Series
   💎 Luxury
   🏆 Sports
   🎮 Games
   🎵 Songs
   💿 Albums
   🆕 New / Upcoming
   🌍 World Culture

   IMPORTANT:
   marketplace-countries.js is READ ONLY.
   This code only reads:
   window.MARKETPLACE_COUNTRIES
   with safe fallbacks.

   Existing Discovery code is NOT replaced.
   ========================================================= */

(function () {

    "use strict";

    var ADDON_VERSION = "SAFE FEATURE ADD-ON 1.0";

    /* =====================================================
       CENTRAL STORAGE KEYS
       ===================================================== */

    var STORAGE = {

        guide:
            "alon_historyverse_regular_culture_guides",

        serials:
            "alon_historyverse_regular_serials",

        podcasts:
            "alon_historyverse_regular_podcasts",

        hosting:
            "alon_historyverse_regular_hosting",

        webSeries:
            "alon_historyverse_regular_web_series",

        luxury:
            "alon_historyverse_regular_luxury",

        sports:
            "alon_historyverse_regular_sports",

        games:
            "alon_historyverse_regular_games",

        songs:
            "alon_historyverse_regular_songs",

        albums:
            "alon_historyverse_regular_albums",

        upcoming:
            "alon_historyverse_regular_upcoming"
    };


    /* =====================================================
       CATEGORY INFORMATION
       ===================================================== */

    var CATEGORIES = {

        rmdBrands: {
            name: "Brand Promoter",
            key:
                "alon_historyverse_regular_brand_promoters",
            feed: "rmdBrandFeed"
        },

        rmdTravel: {
            name: "Travel & Tourist",
            key:
                "alon_historyverse_regular_travel_places",
            feed: "rmdTravelFeed"
        },

        rmdGuides: {
            name: "Culture Tour Guide",
            key:
                STORAGE.guide,
            feed: "rmdGuideFeed"
        },

        rmdMovies: {
            name: "Movies",
            key:
                "alon_historyverse_regular_movie_promoters",
            feed: "rmdMovieFeed"
        },

        rmdSerials: {
            name: "TV Serials",
            key:
                STORAGE.serials,
            feed: "rmdSerialFeed"
        },

        rmdPodcasts: {
            name: "Podcasts",
            key:
                STORAGE.podcasts,
            feed: "rmdPodcastFeed"
        },

        rmdHosting: {
            name: "Hosting",
            key:
                STORAGE.hosting,
            feed: "rmdHostingFeed"
        },

        rmdWebSeries: {
            name: "Web Series",
            key:
                STORAGE.webSeries,
            feed: "rmdWebSeriesFeed"
        },

        rmdLuxury: {
            name: "Luxury",
            key:
                STORAGE.luxury,
            feed: "rmdLuxuryFeed"
        },

        rmdSports: {
            name: "Sports",
            key:
                STORAGE.sports,
            feed: "rmdSportsFeed"
        },

        rmdGames: {
            name: "Games",
            key:
                STORAGE.games,
            feed: "rmdGamesFeed"
        },

        rmdSongs: {
            name: "Songs",
            key:
                STORAGE.songs,
            feed: "rmdSongsFeed"
        },

        rmdAlbums: {
            name: "Albums",
            key:
                STORAGE.albums,
            feed: "rmdAlbumsFeed"
        },

        rmdUpcoming: {
            name: "New / Upcoming",
            key:
                STORAGE.upcoming,
            feed: "rmdUpcomingFeed"
        },

        rmdCulture: {
            name: "World Culture",
            key:
                "alon_historyverse_regular_world_culture",
            feed: "rmdCultureFeed"
        }
    };


    /* =====================================================
       SAFE HELPERS
       ===================================================== */

    function esc(value) {

        return String(
            value == null ? "" : value
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }


    function parse(value, fallback) {

        try {

            var result = JSON.parse(value);

            return result;

        } catch (error) {

            return fallback;
        }
    }


    function read(key) {

        try {

            var value =
                localStorage.getItem(key);

            if (!value) {
                return [];
            }

            var data =
                parse(value, []);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            return [];
        }
    }


    function write(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

            return true;

        } catch (error) {

            console.error(
                "RMD Add-on storage error:",
                error
            );

            return false;
        }
    }


    function makeId(prefix) {

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


    /* =====================================================
       READ ONLY COUNTRY DATABASE
       ===================================================== */

    function getCountries() {

        try {

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

        } catch (error) {

            console.error(
                "RMD country read error:",
                error
            );
        }

        return [];
    }


    function countryOptions() {

        var countries =
            getCountries();

        var html =
            '<option value="">All Countries</option>';


        countries.forEach(
            function (country) {

                if (!country) {
                    return;
                }

                var code =
                    country.code ||
                    country.iso ||
                    country.isoCode ||
                    country.name ||
                    "";

                var name =
                    country.name ||
                    country.country ||
                    code;

                var flag =
                    country.flag || "";


                html +=
                    '<option value="' +
                    esc(code) +
                    '">' +
                    esc(
                        (flag ? flag + " " : "") +
                        name
                    ) +
                    "</option>";
            }
        );


        return html;
    }


    function countryName(code) {

        if (!code) {
            return "";
        }

        var countries =
            getCountries();

        var found =
            countries.find(
                function (country) {

                    return String(
                        country.code ||
                        country.iso ||
                        country.isoCode ||
                        ""
                    ).toLowerCase() ===
                    String(code).toLowerCase();
                }
            );


        if (!found) {
            return String(code);
        }

        return (
            found.name ||
            found.country ||
            found.code ||
            code
        );
    }


    /* =====================================================
       ACCOUNT / OWNER
       ===================================================== */

    function getAccount() {

        var keys = [

            "alon_user",
            "alonUser",
            "alon_account",
            "alon_historyverse_user",
            "alon_historyverse_account",
            "regular_marketplace_account",
            "currentUser",
            "user"
        ];


        for (
            var i = 0;
            i < keys.length;
            i++
        ) {

            try {

                var raw =
                    localStorage.getItem(
                        keys[i]
                    );

                if (!raw) {
                    continue;
                }


                var parsed =
                    parse(raw, null);


                if (
                    parsed &&
                    typeof parsed === "object"
                ) {

                    return parsed;
                }


                return {
                    email: raw
                };

            } catch (error) {

                continue;
            }
        }


        return null;
    }


    function getOwner() {

        var account =
            getAccount();


        if (!account) {
            return "Guest";
        }


        return String(

            account.id ||
            account.userId ||
            account.email ||
            account.username ||
            account.phone ||
            account.name ||
            "Guest"

        );
    }


    function isOwner(item) {

        if (!item) {
            return false;
        }


        var owner =
            String(
                item.owner || ""
            ).trim();


        var current =
            String(
                getOwner()
            ).trim();


        if (
            !owner ||
            owner === "Guest" ||
            owner === "guest"
        ) {

            return false;
        }


        return owner === current;
    }


    /* =====================================================
       ADDON STYLE
       ===================================================== */

    function addStyle() {

        if (
            document.getElementById(
                "rmdSafeAddonStyle"
            )
        ) {
            return;
        }


        var style =
            document.createElement(
                "style"
            );

        style.id =
            "rmdSafeAddonStyle";


        style.textContent = `

        .rmd-addon-bar{
            margin:15px 0;
            padding:12px;
            border:1px solid #d7b35a;
            border-radius:12px;
            background:#05080f;
            color:#f0d27a;
        }

        .rmd-addon-mode{
            display:flex;
            flex-wrap:wrap;
            gap:8px;
            margin-bottom:10px;
        }

        .rmd-addon-mode button{
            border:1px solid #d7b35a;
            border-radius:8px;
            padding:10px 14px;
            cursor:pointer;
            font-weight:700;
            background:#111;
            color:#f0d27a;
        }

        .rmd-addon-mode button.active{
            background:#d7b35a;
            color:#05080f;
        }

        .rmd-addon-search{
            display:grid;
            grid-template-columns:
                minmax(0,2fr)
                minmax(0,1fr);
            gap:8px;
        }

        .rmd-addon-search input,
        .rmd-addon-search select{
            width:100%;
            box-sizing:border-box;
            padding:11px;
            border-radius:8px;
            border:1px solid #ccc;
            background:#fff;
            color:#111;
        }

        .rmd-addon-account{
            margin-top:8px;
            font-size:13px;
        }

        .rmd-addon-hidden{
            display:none !important;
        }

        .rmd-addon-actions{
            display:flex;
            flex-wrap:wrap;
            gap:7px;
            margin-top:10px;
        }

        .rmd-addon-action{
            border:0;
            border-radius:7px;
            padding:8px 11px;
            cursor:pointer;
            font-weight:700;
        }

        .rmd-addon-edit{
            background:#d7b35a;
            color:#05080f;
        }

        .rmd-addon-delete{
            background:#222;
            color:#fff;
        }

        .rmd-addon-owner{
            display:inline-block;
            margin-top:7px;
            padding:4px 8px;
            border-radius:20px;
            font-size:11px;
            background:#eee;
            color:#333;
        }

        .rmd-addon-publisher{
            margin-top:12px;
            padding:14px;
            border:1px solid #ddd;
            border-radius:10px;
            background:#fff;
            color:#111;
        }

        .rmd-addon-publisher form{
            display:grid;
            gap:9px;
        }

        .rmd-addon-publisher input,
        .rmd-addon-publisher select,
        .rmd-addon-publisher textarea{
            width:100%;
            box-sizing:border-box;
            padding:10px;
            border:1px solid #ccc;
            border-radius:8px;
        }

        .rmd-addon-publisher textarea{
            min-height:100px;
        }

        .rmd-addon-publisher button{
            padding:11px;
            border:0;
            border-radius:8px;
            cursor:pointer;
            font-weight:700;
            background:#05080f;
            color:#f0d27a;
        }

        .rmd-addon-editor{
            position:relative;
            margin:12px 0;
            padding:14px;
            border:2px solid #d7b35a;
            border-radius:10px;
            background:#fffdf5;
            color:#111;
        }

        .rmd-addon-editor input,
        .rmd-addon-editor textarea{
            width:100%;
            box-sizing:border-box;
            margin-top:5px;
            padding:9px;
            border:1px solid #ccc;
            border-radius:7px;
        }

        @media(max-width:650px){

            .rmd-addon-search{
                grid-template-columns:1fr;
            }

        }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       MODE BAR
       ===================================================== */

    var currentMode =
        "viewer";


    function buildModeBar() {

        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );

        if (!hub) {
            return;
        }


        if (
            document.getElementById(
                "rmdSafeAddonBar"
            )
        ) {
            return;
        }


        var bar =
            document.createElement(
                "div"
            );

        bar.id =
            "rmdSafeAddonBar";

        bar.className =
            "rmd-addon-bar";


        bar.innerHTML = `

            <div class="rmd-addon-mode">

                <button
                    type="button"
                    id="rmdViewerMode"
                    class="active">
                    👀 Viewer / Explore
                </button>

                <button
                    type="button"
                    id="rmdPublisherMode">
                    ➕ Publisher / Add
                </button>

            </div>

            <div class="rmd-addon-search">

                <input
                    type="search"
                    id="rmdGlobalSearch"
                    placeholder="🔎 Search Discovery...">

                <select
                    id="rmdCountryFilter">
                    ${countryOptions()}
                </select>

            </div>

            <div
                id="rmdAddonAccount"
                class="rmd-addon-account">
            </div>

        `;


        hub.insertBefore(
            bar,
            hub.firstChild
        );


        updateAccountText();


        document
            .getElementById(
                "rmdViewerMode"
            )
            .addEventListener(
                "click",
                function () {

                    setMode(
                        "viewer"
                    );
                }
            );


        document
            .getElementById(
                "rmdPublisherMode"
            )
            .addEventListener(
                "click",
                function () {

                    setMode(
                        "publisher"
                    );
                }
            );


        document
            .getElementById(
                "rmdGlobalSearch"
            )
            .addEventListener(
                "input",
                applyFilters
            );


        document
            .getElementById(
                "rmdCountryFilter"
            )
            .addEventListener(
                "change",
                applyFilters
            );
    }


    function updateAccountText() {

        var box =
            document.getElementById(
                "rmdAddonAccount"
            );

        if (!box) {
            return;
        }


        var account =
            getAccount();


        if (!account) {

            box.textContent =
                "👤 Account: Guest — publishing is available, but owner editing requires an identified account.";

            return;
        }


        box.innerHTML =
            "👤 Account: <strong>" +
            esc(
                account.email ||
                account.username ||
                account.name ||
                account.phone ||
                getOwner()
            ) +
            "</strong>";
    }


    function setMode(mode) {

        currentMode =
            mode === "publisher"
                ? "publisher"
                : "viewer";


        var viewer =
            document.getElementById(
                "rmdViewerMode"
            );

        var publisher =
            document.getElementById(
                "rmdPublisherMode"
            );


        if (viewer) {

            viewer.classList.toggle(
                "active",
                currentMode === "viewer"
            );
        }


        if (publisher) {

            publisher.classList.toggle(
                "active",
                currentMode === "publisher"
            );
        }


        document
            .querySelectorAll(
                "#rmDiscoveryHub form"
            )
            .forEach(
                function (form) {

                    form.classList.toggle(
                        "rmd-addon-hidden",
                        currentMode === "viewer"
                    );
                }
            );


        document
            .querySelectorAll(
                ".rmd-addon-publisher"
            )
            .forEach(
                function (box) {

                    box.classList.toggle(
                        "rmd-addon-hidden",
                        currentMode === "viewer"
                    );
                }
            );
    }


    /* =====================================================
       COMMON PUBLISHER FIELDS
       ===================================================== */

    function publisherFields(extra) {

        return `

            ${extra || ""}

            <select
                name="country"
                required>
                ${countryOptions()}
            </select>

            <input
                type="text"
                name="state"
                placeholder="State / Province">

            <input
                type="text"
                name="district"
                placeholder="District">

            <input
                type="text"
                name="city"
                placeholder="City / Town">

            <input
                type="text"
                name="village"
                placeholder="Village / Local Area">

            <input
                type="text"
                name="language"
                placeholder="Language">

            <textarea
                name="description"
                placeholder="Description"
                required></textarea>

            <label>
                🖼️ Image
                <input
                    type="file"
                    name="image"
                    accept="image/*">
            </label>

            <label>
                🎥 Video
                <input
                    type="file"
                    name="video"
                    accept="video/*">
            </label>

            <input
                type="url"
                name="website"
                placeholder="🔗 Website / Page Link">

            <input
                type="url"
                name="social"
                placeholder="📱 Social Media Link">

            <input
                type="text"
                name="reach"
                placeholder="👥 Reach / Audience">

            <button
                type="submit">
                💾 Save / Publish
            </button>
        `;
    }


    /* =====================================================
       NEW CATEGORY DEFINITIONS
       ===================================================== */

    var NEW_FORMS = [

        {
            id: "rmdGuideForm",
            panel: "rmdGuides",
            feed: "rmdGuideFeed",
            key: STORAGE.guide,
            title: "🧑‍🏫 Culture Tour Guide",
            extra: `
                <input
                    type="text"
                    name="guideName"
                    placeholder="Guide Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Tour / Guide Title"
                    required>

                <input
                    type="text"
                    name="experience"
                    placeholder="Experience">

                <input
                    type="text"
                    name="languages"
                    placeholder="Languages Spoken">

                <input
                    type="text"
                    name="specialty"
                    placeholder="Specialty">

                <input
                    type="text"
                    name="foodKnowledge"
                    placeholder="Food Knowledge">

                <input
                    type="text"
                    name="festivalKnowledge"
                    placeholder="Festival Knowledge">

                <input
                    type="text"
                    name="hiddenPlaces"
                    placeholder="Hidden Places">

                <input
                    type="text"
                    name="tourStyle"
                    placeholder="Tour Style">
            `
        },


        {
            id: "rmdSerialForm",
            panel: "rmdSerials",
            feed: "rmdSerialFeed",
            key: STORAGE.serials,
            title: "📺 TV Serials",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="TV Serial Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Promotion / Episode Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Genre / Category">
            `
        },


        {
            id: "rmdPodcastForm",
            panel: "rmdPodcasts",
            feed: "rmdPodcastFeed",
            key: STORAGE.podcasts,
            title: "🎙️ Podcasts",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Podcast Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Episode / Podcast Title"
                    required>

                <input
                    type="text"
                    name="host"
                    placeholder="Host / Creator">

                <input
                    type="text"
                    name="category"
                    placeholder="Podcast Category">
            `
        },


        {
            id: "rmdHostingForm",
            panel: "rmdHosting",
            feed: "rmdHostingFeed",
            key: STORAGE.hosting,
            title: "🌐 Hosting",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Hosting Provider"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Hosting Service / Plan"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Hosting Type">

                <input
                    type="text"
                    name="price"
                    placeholder="Price / Plan">
            `
        },


        {
            id: "rmdWebSeriesForm",
            panel: "rmdWebSeries",
            feed: "rmdWebSeriesFeed",
            key: STORAGE.webSeries,
            title: "🎞️ Web Series",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Web Series Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Series / Episode Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Genre / Category">
            `
        },


        {
            id: "rmdLuxuryForm",
            panel: "rmdLuxury",
            feed: "rmdLuxuryFeed",
            key: STORAGE.luxury,
            title: "💎 Luxury",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Luxury Item / Brand"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Luxury Listing Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Luxury Category">

                <input
                    type="text"
                    name="price"
                    placeholder="Price">
            `
        },


        {
            id: "rmdSportsForm",
            panel: "rmdSports",
            feed: "rmdSportsFeed",
            key: STORAGE.sports,
            title: "🏆 Sports",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Sport / Team / Player"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Sports Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Sport Category">

                <input
                    type="text"
                    name="event"
                    placeholder="Event / Tournament">
            `
        },


        {
            id: "rmdGamesForm",
            panel: "rmdGames",
            feed: "rmdGamesFeed",
            key: STORAGE.games,
            title: "🎮 Games",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Game Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Game Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Game Category">

                <input
                    type="text"
                    name="platform"
                    placeholder="Platform">
            `
        },


        {
            id: "rmdSongsForm",
            panel: "rmdSongs",
            feed: "rmdSongsFeed",
            key: STORAGE.songs,
            title: "🎵 Songs",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Song Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Song / Release Title"
                    required>

                <input
                    type="text"
                    name="artist"
                    placeholder="Artist / Singer">

                <input
                    type="text"
                    name="album"
                    placeholder="Album">
            `
        },


        {
            id: "rmdAlbumsForm",
            panel: "rmdAlbums",
            feed: "rmdAlbumsFeed",
            key: STORAGE.albums,
            title: "💿 Albums",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Album Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Album Title"
                    required>

                <input
                    type="text"
                    name="artist"
                    placeholder="Artist / Creator">

                <input
                    type="text"
                    name="genre"
                    placeholder="Genre">
            `
        },


        {
            id: "rmdUpcomingForm",
            panel: "rmdUpcoming",
            feed: "rmdUpcomingFeed",
            key: STORAGE.upcoming,
            title: "🆕 New / Upcoming",
            extra: `
                <input
                    type="text"
                    name="name"
                    placeholder="Project / Product Name"
                    required>

                <input
                    type="text"
                    name="title"
                    placeholder="Announcement Title"
                    required>

                <input
                    type="text"
                    name="category"
                    placeholder="Category">

                <input
                    type="text"
                    name="releaseDate"
                    placeholder="Release / Launch Date">
            `
        }
    ];


    /* =====================================================
       BUILD NEW PANELS
       ===================================================== */

    function buildNewPanels() {

        var tabs =
            document.querySelector(
                "#rmDiscoveryHub .rmd-tabs"
            );

        if (!tabs) {
            return;
        }


        NEW_FORMS.forEach(
            function (config) {

                if (
                    document.getElementById(
                        config.panel
                    )
                ) {
                    return;
                }


                var tab =
                    document.createElement(
                        "button"
                    );

                tab.type =
                    "button";

                tab.className =
                    "rmd-tab";

                tab.setAttribute(
                    "data-panel",
                    config.panel
                );

                tab.textContent =
                    config.title;


                tabs.appendChild(
                    tab
                );


                var panel =
                    document.createElement(
                        "div"
                    );

                panel.id =
                    config.panel;

                panel.className =
                    "rmd-panel";


                panel.innerHTML = `

                    <div class="rmd-card">

                        <h3 class="rmd-section-title">
                            ${esc(config.title)}
                        </h3>

                        <div class="rmd-addon-publisher">

                            <form
                                id="${esc(config.id)}">

                                ${publisherFields(
                                    config.extra
                                )}

                            </form>

                        </div>

                    </div>

                    <div
                        id="${esc(config.feed)}"
                        class="rmd-feed">
                    </div>

                `;


                tabs.parentNode.insertAdjacentElement(
                    "afterend",
                    panel
                );
            }
        );
    }


    /* =====================================================
       GENERIC PUBLISHING
       ===================================================== */

    function readFiles(form) {

        return new Promise(
            function (resolve, reject) {

                var result = {
                    image: "",
                    video: ""
                };


                var image =
                    form.querySelector(
                        'input[name="image"]'
                    );


                var video =
                    form.querySelector(
                        'input[name="video"]'
                    );


                var files = [];


                if (
                    image &&
                    image.files &&
                    image.files[0]
                ) {

                    files.push({
                        type: "image",
                        file:
                            image.files[0]
                    });
                }


                if (
                    video &&
                    video.files &&
                    video.files[0]
                ) {

                    files.push({
                        type: "video",
                        file:
                            video.files[0]
                    });
                }


                if (!files.length) {

                    resolve(result);

                    return;
                }


                var remaining =
                    files.length;


                files.forEach(
                    function (entry) {

                        var file =
                            entry.file;


                        if (
                            entry.type === "image" &&
                            file.size >
                            8 * 1024 * 1024
                        ) {

                            reject(
                                new Error(
                                    "Image maximum size is 8 MB."
                                )
                            );

                            return;
                        }


                        if (
                            entry.type === "video" &&
                            file.size >
                            40 * 1024 * 1024
                        ) {

                            reject(
                                new Error(
                                    "Video maximum size is 40 MB."
                                )
                            );

                            return;
                        }


                        if (
                            entry.type === "image" &&
                            !String(
                                file.type
                            )
                            .toLowerCase()
                            .startsWith(
                                "image/"
                            )
                        ) {

                            reject(
                                new Error(
                                    "Invalid image file."
                                )
                            );

                            return;
                        }


                        if (
                            entry.type === "video" &&
                            !String(
                                file.type
                            )
                            .toLowerCase()
                            .startsWith(
                                "video/"
                            )
                        ) {

                            reject(
                                new Error(
                                    "Invalid video file."
                                )
                            );

                            return;
                        }


                        var reader =
                            new FileReader();


                        reader.onload =
                            function () {

                                result[
                                    entry.type
                                ] =
                                    reader.result;


                                remaining--;


                                if (
                                    remaining === 0
                                ) {

                                    resolve(
                                        result
                                    );
                                }
                            };


                        reader.onerror =
                            function () {

                                reject(
                                    new Error(
                                        "Media file could not be read."
                                    )
                                );
                            };


                        reader.readAsDataURL(
                            file
                        );
                    }
                );
            }
        );
    }


    async function publishNew(
        form,
        config
    ) {

        try {

            var data = {};


            new FormData(
                form
            ).forEach(
                function (value, key) {

                    if (
                        !(
                            value instanceof
                            File
                        )
                    ) {

                        data[key] =
                            String(
                                value || ""
                            ).trim();
                    }
                }
            );


            var media =
                await readFiles(
                    form
                );


            data.image =
                media.image;

            data.video =
                media.video;


            data.id =
                makeId("rmd");


            data.owner =
                getOwner();


            data.createdAt =
                new Date().toISOString();


            data.type =
                config.id;


            var list =
                read(config.key);


            list.unshift(
                data
            );


            if (
                !write(
                    config.key,
                    list
                )
            ) {

                throw new Error(
                    "Could not save this post."
                );
            }


            form.reset();


            renderNewFeed(
                config
            );


            alert(
                config.title +
                " published successfully."
            );


        } catch (error) {

            console.error(
                "RMD publisher error:",
                error
            );


            alert(
                error.message ||
                "Could not publish post."
            );
        }
    }


    function bindNewForms() {

        NEW_FORMS.forEach(
            function (config) {

                var form =
                    document.getElementById(
                        config.id
                    );


                if (!form) {
                    return;
                }


                if (
                    form.getAttribute(
                        "data-rmd-safe-bound"
                    ) === "yes"
                ) {
                    return;
                }


                form.setAttribute(
                    "data-rmd-safe-bound",
                    "yes"
                );


                form.addEventListener(
                    "submit",
                    function (event) {

                        event.preventDefault();

                        publishNew(
                            form,
                            config
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       FEED RENDERING
       ===================================================== */

    function titleFor(
        item,
        category
    ) {

        return (
            item.title ||
            item.name ||
            item.brandName ||
            item.placeName ||
            item.guideName ||
            category.name
        );
    }


    function renderMedia(
        item
    ) {

        var html = "";


        if (item.image) {

            html += `
                <img
                    class="rmd-media"
                    src="${esc(item.image)}"
                    alt="Discovery image">
            `;
        }


        if (item.video) {

            html += `
                <video
                    class="rmd-media"
                    controls
                    preload="metadata">

                    <source
                        src="${esc(item.video)}">

                </video>
            `;
        }


        return html;
    }


    function renderAddonItem(
        item,
        category
    ) {

        var location = [

            item.village,
            item.city,
            item.district,
            item.state,
            item.country

        ]
        .filter(Boolean)
        .join(" • ");


        var ownerLabel =
            isOwner(item)
                ? "👤 My Post"
                : "👁 Public";


        return `

            <article
                class="rmd-item rmd-addon-item"
                data-addon-id="${esc(item.id)}"
                data-addon-key="${esc(category.key)}"
                data-addon-country="${esc(item.country || "")}"
                data-addon-search="${esc(
                    JSON.stringify(item)
                )}">

                <div class="rmd-item-title">
                    ${esc(
                        titleFor(
                            item,
                            category
                        )
                    )}
                </div>

                ${
                    item.guideName
                        ? `
                        <div class="rmd-meta">
                            🧑‍🏫 Guide:
                            ${esc(item.guideName)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.artist
                        ? `
                        <div class="rmd-meta">
                            🎤 Artist:
                            ${esc(item.artist)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.host
                        ? `
                        <div class="rmd-meta">
                            🎙️ Host:
                            ${esc(item.host)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.category
                        ? `
                        <div class="rmd-meta">
                            📂 Category:
                            ${esc(item.category)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.platform
                        ? `
                        <div class="rmd-meta">
                            🎮 Platform:
                            ${esc(item.platform)}
                        </div>
                        `
                        : ""
                }

                ${
                    location
                        ? `
                        <div class="rmd-meta">
                            🌍 ${esc(location)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.description
                        ? `
                        <div class="rmd-description">
                            ${esc(item.description)}
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
                            ${esc(item.website)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.social
                        ? `
                        <div class="rmd-meta">
                            📱
                            ${esc(item.social)}
                        </div>
                        `
                        : ""
                }

                ${
                    item.reach
                        ? `
                        <div class="rmd-meta">
                            👥 Reach:
                            ${esc(item.reach)}
                        </div>
                        `
                        : ""
                }

                <span class="rmd-addon-owner">
                    ${ownerLabel}
                </span>

                <div class="rmd-meta">

                    Published:
                    ${esc(
                        item.createdAt
                            ? new Date(
                                item.createdAt
                            ).toLocaleString()
                            : ""
                    )}

                </div>

                ${
                    isOwner(item)
                        ? `
                        <div class="rmd-addon-actions">

                            <button
                                type="button"
                                class="rmd-addon-action rmd-addon-edit"
                                data-addon-edit-id="${esc(item.id)}"
                                data-addon-edit-key="${esc(category.key)}">

                                ✏️ Edit

                            </button>

                            <button
                                type="button"
                                class="rmd-addon-action rmd-addon-delete"
                                data-addon-delete-id="${esc(item.id)}"
                                data-addon-delete-key="${esc(category.key)}">

                                🗑️ Delete

                            </button>

                        </div>
                        `
                        : ""
                }

            </article>
        `;
    }


    function renderNewFeed(
        config
    ) {

        var feed =
            document.getElementById(
                config.feed
            );


        if (!feed) {
            return;
        }


        var list =
            read(config.key);


        if (!list.length) {

            feed.innerHTML =
                '<div class="rmd-empty">' +
                "No posts published yet." +
                "</div>";

            return;
        }


        feed.innerHTML =
            list.map(
                function (item) {

                    return renderAddonItem(
                        item,
                        {
                            key:
                                config.key,

                            name:
                                config.title
                        }
                    );
                }
            ).join("");
    }


    function renderAllNewFeeds() {

        NEW_FORMS.forEach(
            function (config) {

                renderNewFeed(
                    config
                );
            }
        );
    }


    /* =====================================================
       OWNER ACTIONS
       ===================================================== */

    function findItem(
        key,
        id
    ) {

        var list =
            read(key);


        return (
            list.find(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(id);
                }
            ) ||
            null
        );
    }


    function deleteOwned(
        key,
        id
    ) {

        var list =
            read(key);


        var item =
            findItem(
                key,
                id
            );


        if (!item) {
            return;
        }


        if (!isOwner(item)) {

            alert(
                "Only the owner of this post can delete it."
            );

            return;
        }


        if (
            !window.confirm(
                "Delete your Discovery post?"
            )
        ) {
            return;
        }


        var filtered =
            list.filter(
                function (entry) {

                    return String(
                        entry.id
                    ) !==
                    String(id);
                }
            );


        write(
            key,
            filtered
        );


        renderAllNewFeeds();

        decorateExistingFeeds();
    }


    /* =====================================================
       EDIT
       ===================================================== */

    var editState = {
        key: null,
        id: null
    };


    function editableKeys(
        item
    ) {

        return Object.keys(
            item
        ).filter(
            function (key) {

                return (

                    key !== "id" &&
                    key !== "owner" &&
                    key !== "createdAt" &&
                    key !== "updatedAt" &&
                    key !== "type" &&
                    key !== "image" &&
                    key !== "video"

                );
            }
        );
    }


    function openEditor(
        key,
        id
    ) {

        var item =
            findItem(
                key,
                id
            );


        if (!item) {
            return;
        }


        if (!isOwner(item)) {

            alert(
                "Only the owner can edit this post."
            );

            return;
        }


        closeEditor();


        editState.key =
            key;

        editState.id =
            id;


        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );


        if (!hub) {
            return;
        }


        var box =
            document.createElement(
                "div"
            );


        box.id =
            "rmdSafeEditor";

        box.className =
            "rmd-addon-editor";


        var html = `

            <h3>
                ✏️ Edit Discovery Post
            </h3>

            <div class="rmd-small">
                Existing image/video will remain unchanged.
            </div>

        `;


        editableKeys(
            item
        ).forEach(
            function (keyName) {

                var value =
                    item[keyName] == null
                        ? ""
                        : item[keyName];


                html += `

                    <label
                        style="display:block;margin-top:9px;">

                        ${esc(
                            keyName
                        )}

                        <input
                            type="text"
                            data-rmd-edit-field="${esc(
                                keyName
                            )}"
                            value="${esc(
                                value
                            )}">

                    </label>

                `;
            }
        );


        html += `

            <div
                style="margin-top:12px;">

                <button
                    type="button"
                    id="rmdSaveEdit">

                    💾 Save Changes

                </button>

                <button
                    type="button"
                    id="rmdCancelEdit"
                    style="margin-left:7px;">

                    Cancel

                </button>

            </div>
        `;


        box.innerHTML =
            html;


        hub.insertBefore(
            box,
            hub.firstChild.nextSibling
        );


        document
            .getElementById(
                "rmdSaveEdit"
            )
            .addEventListener(
                "click",
                saveEdit
            );


        document
            .getElementById(
                "rmdCancelEdit"
            )
            .addEventListener(
                "click",
                closeEditor
            );


        box.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }


    function saveEdit() {

        if (
            !editState.key ||
            !editState.id
        ) {
            return;
        }


        var list =
            read(
                editState.key
            );


        var index =
            list.findIndex(
                function (item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        editState.id
                    );
                }
            );


        if (index < 0) {

            alert(
                "Post not found."
            );

            return;
        }


        if (
            !isOwner(
                list[index]
            )
        ) {

            alert(
                "Only the owner can edit this post."
            );

            return;
        }


        document
            .querySelectorAll(
                "[data-rmd-edit-field]"
            )
            .forEach(
                function (field) {

                    var key =
                        field.getAttribute(
                            "data-rmd-edit-field"
                        );


                    if (key) {

                        list[index][key] =
                            field.value;
                    }
                }
            );


        list[index].updatedAt =
            new Date().toISOString();


        write(
            editState.key,
            list
        );


        closeEditor();


        renderAllNewFeeds();

        decorateExistingFeeds();


        alert(
            "Post updated successfully."
        );
    }


    function closeEditor() {

        var editor =
            document.getElementById(
                "rmdSafeEditor"
            );


        if (editor) {
            editor.remove();
        }


        editState.key =
            null;

        editState.id =
            null;
    }


    /* =====================================================
       EXISTING FEEDS
       OWNER ACTIONS
       ===================================================== */

    function decorateExistingFeeds() {

        var oldCategories = [

            {
                feed:
                    "rmdBrandFeed",

                key:
                    "alon_historyverse_regular_brand_promoters"
            },

            {
                feed:
                    "rmdTravelFeed",

                key:
                    "alon_historyverse_regular_travel_places"
            },

            {
                feed:
                    "rmdMovieFeed",

                key:
                    "alon_historyverse_regular_movie_promoters"
            },

            {
                feed:
                    "rmdCultureFeed",

                key:
                    "alon_historyverse_regular_world_culture"
            }
        ];


        oldCategories.forEach(
            function (category) {

                var feed =
                    document.getElementById(
                        category.feed
                    );


                if (!feed) {
                    return;
                }


                var list =
                    read(
                        category.key
                    );


                feed
                    .querySelectorAll(
                        ".rmd-item"
                    )
                    .forEach(
                        function (article) {

                            var id =
                                article.getAttribute(
                                    "data-id"
                                );


                            var item =
                                list.find(
                                    function (
                                        entry
                                    ) {

                                        return String(
                                            entry.id
                                        ) ===
                                        String(id);
                                    }
                                );


                            if (!item) {
                                return;
                            }


                            article.setAttribute(
                                "data-addon-search",
                                JSON.stringify(
                                    item
                                )
                            );


                            article.setAttribute(
                                "data-addon-country",
                                item.country ||
                                ""
                            );


                            var oldDelete =
                                article.querySelector(
                                    ".rmd-delete"
                                );


                            if (oldDelete) {

                                oldDelete.style.display =
                                    "none";
                            }


                            if (
                                article.querySelector(
                                    ".rmd-addon-owner"
                                )
                            ) {
                                return;
                            }


                            var owner =
                                document.createElement(
                                    "span"
                                );


                            owner.className =
                                "rmd-addon-owner";


                            owner.textContent =
                                isOwner(item)
                                    ? "👤 My Post"
                                    : "👁 Public";


                            article.appendChild(
                                owner
                            );


                            if (
                                isOwner(item)
                            ) {

                                var actions =
                                    document.createElement(
                                        "div"
                                    );


                                actions.className =
                                    "rmd-addon-actions";


                                actions.innerHTML = `

                                    <button
                                        type="button"
                                        class="rmd-addon-action rmd-addon-edit"
                                        data-addon-edit-id="${esc(item.id)}"
                                        data-addon-edit-key="${esc(category.key)}">

                                        ✏️ Edit

                                    </button>

                                    <button
                                        type="button"
                                        class="rmd-addon-action rmd-addon-delete"
                                        data-addon-delete-id="${esc(item.id)}"
                                        data-addon-delete-key="${esc(category.key)}">

                                        🗑️ Delete

                                    </button>

                                `;


                                article.appendChild(
                                    actions
                                );
                            }
                        }
                    );
            }
        );
    }


    /* =====================================================
       SEARCH + COUNTRY FILTER
       ===================================================== */

    function applyFilters() {

        var searchInput =
            document.getElementById(
                "rmdGlobalSearch"
            );


        var countryInput =
            document.getElementById(
                "rmdCountryFilter"
            );


        var search =
            searchInput
                ? String(
                    searchInput.value
                )
                .trim()
                .toLowerCase()
                : "";


        var country =
            countryInput
                ? String(
                    countryInput.value
                )
                .trim()
                .toLowerCase()
                : "";


        document
            .querySelectorAll(
                "#rmDiscoveryHub .rmd-item"
            )
            .forEach(
                function (item) {

                    var text =
                        String(
                            item.getAttribute(
                                "data-addon-search"
                            ) ||
                            item.textContent ||
                            ""
                        )
                        .toLowerCase();


                    var itemCountry =
                        String(
                            item.getAttribute(
                                "data-addon-country"
                            ) ||
                            ""
                        )
                        .toLowerCase();


                    var searchOK =
                        !search ||
                        text.indexOf(
                            search
                        ) !== -1;


                    var countryOK =
                        !country ||
                        itemCountry ===
                        country;


                    item.style.display =
                        searchOK &&
                        countryOK
                            ? ""
                            : "none";
                }
            );
    }


    /* =====================================================
       CLICK EVENTS
       ===================================================== */

    function bindActionEvents() {

        if (
            window.__ALON_RMD_SAFE_ACTIONS__
        ) {
            return;
        }


        window.__ALON_RMD_SAFE_ACTIONS__ =
            true;


        document.addEventListener(
            "click",
            function (event) {

                var editButton =
                    event.target.closest(
                        ".rmd-addon-edit"
                    );


                if (editButton) {

                    event.preventDefault();
                    event.stopPropagation();


                    openEditor(
                        editButton.getAttribute(
                            "data-addon-edit-key"
                        ),
                        editButton.getAttribute(
                            "data-addon-edit-id"
                        )
                    );


                    return;
                }


                var deleteButton =
                    event.target.closest(
                        ".rmd-addon-delete"
                    );


                if (deleteButton) {

                    event.preventDefault();
                    event.stopPropagation();


                    deleteOwned(
                        deleteButton.getAttribute(
                            "data-addon-delete-key"
                        ),
                        deleteButton.getAttribute(
                            "data-addon-delete-id"
                        )
                    );
                }
            },
            true
        );
    }


    /* =====================================================
       OBSERVE EXISTING DISCOVERY
       ===================================================== */

    function observe() {

        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );


        if (!hub) {
            return;
        }


        if (
            window.__ALON_RMD_SAFE_OBSERVER__
        ) {
            return;
        }


        window.__ALON_RMD_SAFE_OBSERVER__ =
            true;


        var observer =
            new MutationObserver(
                function () {

                    decorateExistingFeeds();
                    applyFilters();
                }
            );


        observer.observe(
            hub,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* =====================================================
       BLOCK GUEST EDIT/DELETE ON OLD BUTTONS
       ===================================================== */

    function protectOldDeleteButtons() {

        if (
            window.__ALON_RMD_SAFE_DELETE_GUARD__
        ) {
            return;
        }


        window.__ALON_RMD_SAFE_DELETE_GUARD__ =
            true;


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


                var item =
                    findItem(
                        key,
                        id
                    );


                if (
                    item &&
                    !isOwner(item)
                ) {

                    event.preventDefault();
                    event.stopImmediatePropagation();


                    alert(
                        "Only the owner of this post can delete it."
                    );
                }
            },
            true
        );
    }


    /* =====================================================
       BLOCK OLD FORMS IN VIEWER MODE
       ===================================================== */

    function protectExistingForms() {

        if (
            window.__ALON_RMD_SAFE_FORM_GUARD__
        ) {
            return;
        }


        window.__ALON_RMD_SAFE_FORM_GUARD__ =
            true;


        document.addEventListener(
            "submit",
            function (event) {

                if (
                    currentMode !==
                    "viewer"
                ) {
                    return;
                }


                if (
                    event.target.closest(
                        "#rmDiscoveryHub"
                    )
                ) {

                    event.preventDefault();
                    event.stopImmediatePropagation();


                    alert(
                        "Viewer mode is read-only. Switch to Publisher / Add mode."
                    );
                }
            },
            true
        );
    }


    /* =====================================================
       RE-APPLY VIEWER / PUBLISHER MODE
       ===================================================== */

    function refreshMode() {

        setMode(
            currentMode
        );
    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function initializeAddon() {

        var hub =
            document.getElementById(
                "rmDiscoveryHub"
            );


        if (!hub) {
            return;
        }


        addStyle();

        buildModeBar();

        buildNewPanels();

        bindNewForms();

        bindActionEvents();

        protectOldDeleteButtons();

        protectExistingForms();

        observe();


        setTimeout(
            function () {

                decorateExistingFeeds();

                renderAllNewFeeds();

                updateAccountText();

                refreshMode();

                applyFilters();

            },
            300
        );


        console.log(
            "ALON Regular Marketplace Discovery " +
            ADDON_VERSION +
            " loaded."
        );
    }


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAddon
        );

    } else {

        initializeAddon();
    }


})();