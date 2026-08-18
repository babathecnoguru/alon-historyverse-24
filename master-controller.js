/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/master-controller.js
   MASTER CONTROLLER
   VERSION: V100
   Creator / Owner: Baba Thecno Guru

   MAIN SYSTEMS
   ---------------------------------------------------------
   1. Mobile Menu
   2. Search
   3. Navigation
   4. Language Button
   5. Status System
   6. Global API
   7. Safe JSON Loader
   8. Page Compatibility
========================================================= */

(function () {

    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const CONFIG = {

        version: "V100",

        home: "./index.html",

        paths: {

            discover: "./html/discover.html",
            categories: "./html/categories.html",
            gallery: "./html/gallery.html",

            articles: "./html/articles.html",
            article: "./html/article.html",

            library: "./html/library.html",
            department: "./html/department.html",
            subject: "./html/subject.html",
            book: "./html/book.html",
            read: "./html/read.html",

            civilizations: "./html/civilizations.html",
            heritage: "./html/heritage.html",
            timeline: "./html/timeline.html",

            mathematics: "./html/mathematics.html",
            computer: "./html/computer.html",
            jobs: "./html/jobs.html",
            trees: "./html/trees.html",

            countries: "./html/countries.html",
            country: "./html/country.html",

            contribute: "./html/contribute.html",

            about: "./html/about.html",
            contact: "./html/contact.html",

            guidelines: "./html/guidelines.html",
            agreement: "./html/contributor-agreement.html",
            copyright: "./html/copyright.html",
            privacy: "./html/privacy.html",
            terms: "./html/terms.html",

            login: "./html/login.html",
            admin: "./html/admin.html"
        }

    };


    /* =====================================================
       DOM HELPERS
    ===================================================== */

    const $ = function (selector) {
        return document.querySelector(selector);
    };

    const byId = function (id) {
        return document.getElementById(id);
    };


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuBtn =
        byId("menuBtn");

    const closeMenu =
        byId("closeMenu");

    const mobileMenu =
        byId("mobileMenu");

    const mobileLinks =
        byId("mobileLinks");

    const languageBtn =
        byId("languageBtn");

    const searchForm =
        byId("searchForm");

    const searchInput =
        byId("searchInput");

    const statusBox =
        byId("ah-status");


    /* =====================================================
       STATUS SYSTEM
    ===================================================== */

    function setStatus(message) {

        if (!statusBox) {
            return;
        }

        statusBox.textContent =
            message;

    }


    /* =====================================================
       SAFE NAVIGATION
    ===================================================== */

    function openPage(path) {

        if (!path) {
            return;
        }

        window.location.href =
            path;

    }


    function goHome() {

        openPage(CONFIG.home);

    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.style.display =
            "block";

        document.body.style.overflow =
            "hidden";

        if (menuBtn) {

            menuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeMobileMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.style.display =
            "none";

        document.body.style.overflow =
            "";

        if (menuBtn) {

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* =====================================================
       MOBILE MENU EVENTS
    ===================================================== */

    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            openMenu
        );

    }


    if (closeMenu) {

        closeMenu.addEventListener(
            "click",
            closeMobileMenu
        );

    }


    /* =====================================================
       CLOSE MENU WITH ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================================
       MOBILE MENU LINKS
    ===================================================== */

    const mobileItems = [

        {
            name: "Explore",
            target: "#explore"
        },

        {
            name: "Library",
            target: CONFIG.paths.library
        },

        {
            name: "Departments",
            target: CONFIG.paths.department
        },

        {
            name: "Subjects",
            target: CONFIG.paths.subject
        },

        {
            name: "Books",
            target: CONFIG.paths.book
        },

        {
            name: "Read",
            target: CONFIG.paths.read
        },

        {
            name: "Countries",
            target: CONFIG.paths.countries
        },

        {
            name: "Civilizations",
            target: CONFIG.paths.civilizations
        },

        {
            name: "Heritage",
            target: CONFIG.paths.heritage
        },

        {
            name: "Timeline",
            target: CONFIG.paths.timeline
        },

        {
            name: "Articles",
            target: CONFIG.paths.articles
        },

        {
            name: "Gallery",
            target: CONFIG.paths.gallery
        },

        {
            name: "Contribute",
            target: CONFIG.paths.contribute
        },

        {
            name: "About",
            target: CONFIG.paths.about
        },

        {
            name: "Contact",
            target: CONFIG.paths.contact
        },

        {
            name: "Login",
            target: CONFIG.paths.login
        }

    ];


    function buildMobileMenu() {

        if (!mobileLinks) {
            return;
        }

        mobileLinks.innerHTML = "";

        mobileItems.forEach(
            function (item) {

                const link =
                    document.createElement("a");

                link.href =
                    item.target;

                link.textContent =
                    item.name;

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileMenu();

                    }
                );

                mobileLinks.appendChild(
                    link
                );

            }
        );

    }


    buildMobileMenu();


    /* =====================================================
       SEARCH DATABASE
    ===================================================== */

    const SEARCH_MAP = {

        library: [
            "library",
            "libraries",
            "book",
            "books",
            "read",
            "department",
            "departments",
            "subject",
            "subjects"
        ],

        history: [
            "history",
            "ancient",
            "historical",
            "civilization",
            "civilizations",
            "king",
            "kings",
            "ruler",
            "rulers",
            "war",
            "wars",
            "culture"
        ],

        countries: [
            "country",
            "countries",
            "world",
            "nation",
            "nations"
        ],

        heritage: [
            "heritage",
            "fort",
            "forts",
            "monument",
            "monuments",
            "palace",
            "palaces",
            "culture"
        ],

        timeline: [
            "timeline",
            "time",
            "period",
            "periods",
            "era",
            "eras"
        ],

        articles: [
            "article",
            "articles",
            "writing",
            "content"
        ],

        gallery: [
            "gallery",
            "image",
            "images",
            "photo",
            "photos"
        ],

        computer: [
            "computer",
            "technology",
            "tech"
        ],

        mathematics: [
            "math",
            "mathematics"
        ],

        jobs: [
            "job",
            "jobs",
            "career",
            "careers"
        ],

        trees: [
            "tree",
            "trees",
            "nature",
            "forest",
            "forests"
        ],

        discover: [
            "discover",
            "explore"
        ],

        contribute: [
            "contribute",
            "contribution",
            "submit"
        ]

    };


    /* =====================================================
       SEARCH ENGINE
    ===================================================== */

    function searchWebsite(query) {

        if (!query) {
            return null;
        }

        const text =
            query
                .toLowerCase()
                .trim();

        if (!text) {
            return null;
        }


        /*
         * Exact page-name matching
         */

        if (
            text === "library"
        ) {
            return CONFIG.paths.library;
        }

        if (
            text === "countries" ||
            text === "country"
        ) {
            return CONFIG.paths.countries;
        }

        if (
            text === "articles" ||
            text === "article"
        ) {
            return CONFIG.paths.articles;
        }

        if (
            text === "gallery"
        ) {
            return CONFIG.paths.gallery;
        }

        if (
            text === "heritage"
        ) {
            return CONFIG.paths.heritage;
        }

        if (
            text === "timeline"
        ) {
            return CONFIG.paths.timeline;
        }


        /*
         * Keyword matching
         */

        for (
            const key of Object.keys(
                SEARCH_MAP
            )
        ) {

            const keywords =
                SEARCH_MAP[key];

            const found =
                keywords.some(
                    function (word) {

                        return text.includes(
                            word
                        );

                    }
                );

            if (found) {

                if (
                    CONFIG.paths[key]
                ) {

                    return CONFIG.paths[key];

                }

            }

        }

        return null;

    }


    /* =====================================================
       SEARCH FORM
    ===================================================== */

    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const query =
                    searchInput
                        ? searchInput.value.trim()
                        : "";

                if (!query) {

                    setStatus(
                        "Please enter something to search."
                    );

                    if (searchInput) {
                        searchInput.focus();
                    }

                    return;
                }


                const target =
                    searchWebsite(query);


                if (target) {

                    setStatus(
                        "Opening results..."
                    );

                    openPage(target);

                } else {

                    setStatus(
                        "No direct page found for \"" +
                        query +
                        "\". Try Library, History, Countries, Heritage, Timeline or Articles."
                    );

                }

            }
        );

    }


    /* =====================================================
       LANGUAGE SYSTEM
    ===================================================== */

    function languageSystem() {

        /*
         * Future language engine can connect here.
         *
         * Supported architecture:
         *
         * English
         * Hindi
         * World Languages
         */

        if (window.ALON_LANGUAGE_ENGINE) {

            if (
                typeof
                window.ALON_LANGUAGE_ENGINE.open ===
                "function"
            ) {

                window.ALON_LANGUAGE_ENGINE.open();

                return;

            }

        }


        alert(
            "English interface is active.\n\n" +
            "Hindi and World Language support can be connected through the language engine."
        );

    }


    if (languageBtn) {

        languageBtn.addEventListener(
            "click",
            languageSystem
        );

    }


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link) {
                return;
            }

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(
                    targetId
                );

            if (!target) {
                return;
            }

            event.preventDefault();

            closeMobileMenu();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(
                null,
                "",
                targetId
            );

        }
    );


    /* =====================================================
       CARD SAFETY
    ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            const card =
                event.target.closest(
                    ".ah-card"
                );

            if (!card) {
                return;
            }

            /*
             * Whole card is already clickable
             * because .ah-card itself is <a>.
             */

            card.classList.add(
                "ah-card-clicked"
            );

        }
    );


    /* =====================================================
       JSON LOADER
    ===================================================== */

    async function loadJSON(path) {

        if (!path) {
            return null;
        }

        try {

            const response =
                await fetch(path);

            if (!response.ok) {

                return null;

            }

            return await response.json();

        } catch (error) {

            console.warn(
                "ALON JSON unavailable:",
                path
            );

            return null;

        }

    }


    /* =====================================================
       PAGE INFORMATION
    ===================================================== */

    function getPageInfo() {

        return {

            title:
                document.title,

            url:
                window.location.href,

            path:
                window.location.pathname,

            version:
                CONFIG.version

        };

    }


    /* =====================================================
       GLOBAL API
    ===================================================== */

    const API = {

        name:
            "ALON HISTORYVERSE 24",

        version:
            CONFIG.version,

        files:
            CONFIG.paths,

        config:
            CONFIG,

        open:
            openPage,

        home:
            goHome,

        menu: {

            open:
                openMenu,

            close:
                closeMobileMenu

        },

        search:
            searchWebsite,

        status:
            setStatus,

        loadJSON:
            loadJSON,

        page:
            getPageInfo

    };


    /* =====================================================
       GLOBAL COMPATIBILITY
    ===================================================== */

    window.ALON_HISTORYVERSE =
        API;

    window.HISTORYVERSE =
        API;

    window.HV =
        API;


    /* =====================================================
       LEGACY NAVIGATION FUNCTIONS
    ===================================================== */

    window.openHistoryVersePage =
        openPage;

    window.goHistoryVerseHome =
        goHome;


    /* =====================================================
       READY EVENT
    ===================================================== */

    function systemReady() {

        setStatus(
            "ALON HISTORYVERSE 24 • V100 • Ready"
        );

        console.log(
            "======================================"
        );

        console.log(
            "ALON HISTORYVERSE 24"
        );

        console.log(
            "MASTER CONTROLLER: READY"
        );

        console.log(
            "VERSION:",
            CONFIG.version
        );

        console.log(
            "======================================"
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            systemReady
        );

    } else {

        systemReady();

    }


})();