/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/core.js
   CORE APPLICATION ENGINE
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   MODULE IMPORTS
========================================================= */

import {
    APP_DATA,
    getHomeData,
    getExploreData
} from "./data.js";

import {
    initLanguageSystem,
    openLanguagePanel,
    closeLanguagePanel,
    getCurrentLanguage
} from "./language.js";

import {
    initArticleSystem
} from "./articles.js";

import {
    initLibrarySystem
} from "./library.js";

import {
    initExploreSystem
} from "./explore.js";

import {
    initAdminSystem
} from "./admin.js";


/* =========================================================
   GLOBAL APPLICATION OBJECT
========================================================= */

const HistoryVerse = {

    version: "ALON HISTORYVERSE 24",

    creator: "Baba Thecno Guru",

    currentRoute: "home",

    initialized: false,

    elements: {},

    config: {
        defaultRoute: "home",
        scrollToTop: true,
        rememberRoute: true
    }

};


/* =========================================================
   DOM CACHE
========================================================= */

function cacheElements() {

    HistoryVerse.elements = {

        app:
            document.getElementById("app"),

        menuBtn:
            document.getElementById("menuBtn"),

        closeMenu:
            document.getElementById("closeMenu"),

        drawer:
            document.getElementById("drawer"),

        backdrop:
            document.getElementById("backdrop"),

        languageBtn:
            document.getElementById("languageBtn"),

        languagePanel:
            document.getElementById("languagePanel"),

        closeLang:
            document.getElementById("closeLang"),

        langSearch:
            document.getElementById("langSearch"),

        translateBtn:
            document.getElementById("translateBtn"),

        mainNavigation:
            document.getElementById("mainNavigation")

    };

}


/* =========================================================
   SAFE STORAGE
========================================================= */

const Storage = {

    get(key, fallback = null) {

        try {

            const value =
                localStorage.getItem(key);

            return value === null
                ? fallback
                : value;

        } catch (error) {

            return fallback;

        }

    },


    set(key, value) {

        try {

            localStorage.setItem(
                key,
                value
            );

        } catch (error) {

            /* Storage may be disabled. */

        }

    },


    remove(key) {

        try {

            localStorage.removeItem(key);

        } catch (error) {

            /* Ignore storage errors. */

        }

    }

};


/* =========================================================
   ROUTE HELPERS
========================================================= */

function normalizeRoute(route) {

    if (!route) {
        return "home";
    }

    return String(route)
        .replace(/^#/, "")
        .replace(/^\/+/, "")
        .trim()
        .toLowerCase() || "home";

}


function getRoute() {

    const hash =
        window.location.hash;

    return normalizeRoute(
        hash || "#home"
    );

}


function navigate(route) {

    const normalized =
        normalizeRoute(route);

    const newHash =
        `#${normalized}`;

    if (
        window.location.hash !==
        newHash
    ) {

        window.location.hash =
            newHash;

    } else {

        renderRoute(normalized);

    }

}


/* =========================================================
   ROUTE TITLES
========================================================= */

const ROUTE_TITLES = {

    home:
        "ALON HISTORYVERSE 24",

    articles:
        "Articles | ALON HISTORYVERSE 24",

    article:
        "Article | ALON HISTORYVERSE 24",

    timeline:
        "Timeline | ALON HISTORYVERSE 24",

    library:
        "Library | ALON HISTORYVERSE 24",

    departments:
        "Departments | ALON HISTORYVERSE 24",

    subjects:
        "Subjects | ALON HISTORYVERSE 24",

    books:
        "Books | ALON HISTORYVERSE 24",

    read:
        "Read | ALON HISTORYVERSE 24",

    countries:
        "Countries | ALON HISTORYVERSE 24",

    civilizations:
        "Civilizations | ALON HISTORYVERSE 24",

    heritage:
        "Heritage | ALON HISTORYVERSE 24",

    discover:
        "Discover | ALON HISTORYVERSE 24",

    gallery:
        "Gallery | ALON HISTORYVERSE 24",

    categories:
        "Categories | ALON HISTORYVERSE 24",

    contribute:
        "Contribute | ALON HISTORYVERSE 24",

    agreement:
        "Contributor Agreement | ALON HISTORYVERSE 24",

    guidelines:
        "Guidelines | ALON HISTORYVERSE 24",

    about:
        "About | ALON HISTORYVERSE 24",

    contact:
        "Contact | ALON HISTORYVERSE 24",

    privacy:
        "Privacy Policy | ALON HISTORYVERSE 24",

    terms:
        "Terms | ALON HISTORYVERSE 24",

    copyright:
        "Copyright | ALON HISTORYVERSE 24",

    admin:
        "Admin | ALON HISTORYVERSE 24",

    "admin-articles":
        "Admin Articles | ALON HISTORYVERSE 24"

};


/* =========================================================
   HOME PAGE
========================================================= */

function renderHome() {

    const app =
        HistoryVerse.elements.app;

    const data =
        getHomeData
            ? getHomeData()
            : {};

    app.innerHTML = `

        <section class="hero">

            <p class="hero-eyebrow">
                THE HUMAN STORY • PAST TO PRESENT
            </p>

            <h1>
                ALON
                <span>HISTORYVERSE</span>
                24
            </h1>

            <p>
                Explore humanity through civilizations,
                countries, heritage, timelines, cultures,
                knowledge and stories from around the world.
            </p>


            <form
                class="search-box"
                id="globalSearchForm"
            >

                <input
                    type="search"
                    id="globalSearchInput"
                    placeholder="Search history, civilizations, countries, people..."
                    autocomplete="off"
                    aria-label="Search HistoryVerse"
                >

                <button
                    type="submit"
                    class="gold-btn"
                >
                    Search
                </button>

            </form>


            <div class="quick-actions">

                <a
                    href="#articles"
                    class="quick-action"
                >
                    📜 Articles
                </a>

                <a
                    href="#timeline"
                    class="quick-action"
                >
                    ⌛ Timeline
                </a>

                <a
                    href="#library"
                    class="quick-action"
                >
                    📚 Library
                </a>

                <a
                    href="#countries"
                    class="quick-action"
                >
                    🌍 Countries
                </a>

            </div>

        </section>


        <section class="section">

            <div class="section-heading">

                <div>

                    <p class="hero-eyebrow">
                        EXPLORE
                    </p>

                    <h2>
                        Discover the Human Story
                    </h2>

                </div>

                <p>
                    History • Culture • Knowledge
                </p>

            </div>


            <div
                class="card-grid"
                id="homeExploreGrid"
            >

                ${renderHomeExploreCards(data)}

            </div>

        </section>


        <section class="section">

            <div class="section-heading">

                <div>

                    <p class="hero-eyebrow">
                        FEATURED
                    </p>

                    <h2>
                        Featured History
                    </h2>

                </div>

            </div>


            <div
                class="card-grid"
                id="featuredHistoryGrid"
            >

                ${renderFeaturedCards(data)}

            </div>

        </section>


        <footer class="footer">

            <strong>
                ALON HISTORYVERSE 24
            </strong>

            <br>

            Created by
            <strong>
                Baba Thecno Guru
            </strong>

        </footer>

    `;


    setupHomeSearch();

}


/* =========================================================
   HOME EXPLORE CARDS
========================================================= */

function renderHomeExploreCards(data) {

    const items =
        data?.explore ||
        getExploreData?.() ||
        [

            {
                route: "civilizations",
                icon: "🏛️",
                title: "Civilizations",
                description:
                    "Explore the rise, development and legacy of great civilizations."
            },

            {
                route: "countries",
                icon: "🌍",
                title: "Countries",
                description:
                    "Discover nations, cultures, people and historical journeys."
            },

            {
                route: "heritage",
                icon: "🏺",
                title: "Heritage",
                description:
                    "Explore cultural, historical and natural heritage."
            },

            {
                route: "timeline",
                icon: "⌛",
                title: "Timeline",
                description:
                    "Travel through important moments across human history."
            },

            {
                route: "library",
                icon: "📚",
                title: "Library",
                description:
                    "Enter the Library, Departments, Subjects, Books and Read system."
            },

            {
                route: "discover",
                icon: "🔎",
                title: "Discover",
                description:
                    "Find new stories, knowledge and historical connections."
            }

        ];


    return items
        .map(item => `

            <a
                href="#${item.route}"
                class="card card-clickable"
            >

                <div
                    style="
                        font-size: 1.8rem;
                        margin-bottom: 13px;
                    "
                >
                    ${escapeHTML(item.icon || "✦")}
                </div>

                <h3>
                    ${escapeHTML(item.title)}
                </h3>

                <p>
                    ${escapeHTML(item.description)}
                </p>

            </a>

        `)
        .join("");

}


/* =========================================================
   FEATURED CARDS
========================================================= */

function renderFeaturedCards(data) {

    const items =
        data?.featured ||
        [

            {
                route: "articles",
                icon: "📜",
                title: "Historical Articles",
                description:
                    "Read curated stories from different eras and regions."
            },

            {
                route: "civilizations",
                icon: "🏛️",
                title: "Ancient Worlds",
                description:
                    "Explore civilizations that shaped human history."
            },

            {
                route: "heritage",
                icon: "🏺",
                title: "World Heritage",
                description:
                    "Discover places, traditions and cultural treasures."
            }

        ];


    return items
        .map(item => `

            <a
                href="#${item.route}"
                class="card card-clickable"
            >

                <div
                    style="
                        color: var(--gold-light);
                        font-size: 1.5rem;
                        margin-bottom: 12px;
                    "
                >
                    ${escapeHTML(item.icon || "✦")}
                </div>

                <h3>
                    ${escapeHTML(item.title)}
                </h3>

                <p>
                    ${escapeHTML(item.description)}
                </p>

            </a>

        `)
        .join("");

}


/* =========================================================
   SEARCH
========================================================= */

function setupHomeSearch() {

    const form =
        document.getElementById(
            "globalSearchForm"
        );

    const input =
        document.getElementById(
            "globalSearchInput"
        );


    if (!form || !input) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                input.value.trim();

            if (!query) {

                input.focus();

                return;

            }


            Storage.set(
                "alon_historyverse_last_search",
                query
            );


            const encoded =
                encodeURIComponent(query);

            navigate(
                `discover?search=${encoded}`
            );

        }
    );

}


/* =========================================================
   GENERIC PAGE
========================================================= */

function renderGenericPage(
    title,
    description,
    icon = "✦"
) {

    const app =
        HistoryVerse.elements.app;

    app.innerHTML = `

        <section class="hero">

            <p class="hero-eyebrow">
                ALON HISTORYVERSE 24
            </p>

            <h1>
                ${escapeHTML(icon)}
                ${escapeHTML(title)}
            </h1>

            <p>
                ${escapeHTML(description)}
            </p>

        </section>


        <section class="section">

            <div class="notice">

                This section is connected to the
                ALON HISTORYVERSE 24 application engine.
                Its full data system is handled by the
                corresponding module.

            </div>

        </section>

    `;

}


/* =========================================================
   ROUTE RENDERER
========================================================= */

async function renderRoute(route) {

    const normalized =
        normalizeRoute(route);

    HistoryVerse.currentRoute =
        normalized;


    document.title =
        ROUTE_TITLES[normalized] ||
        "ALON HISTORYVERSE 24";


    updateActiveNavigation(
        normalized
    );


    const app =
        HistoryVerse.elements.app;


    if (!app) {
        return;
    }


    /*
       Core routes are rendered here.
       Feature-specific systems can take control
       when their module exposes a renderer.
    */

    switch (normalized) {

        case "home":

            renderHome();

            break;


        case "articles":

            if (
                typeof window.renderArticlesPage ===
                "function"
            ) {

                window.renderArticlesPage();

            } else {

                renderGenericPage(
                    "Articles",
                    "Explore historical articles from the HistoryVerse collection.",
                    "📜"
                );

            }

            break;


        case "timeline":

            if (
                typeof window.renderTimelinePage ===
                "function"
            ) {

                window.renderTimelinePage();

            } else {

                renderGenericPage(
                    "Timeline",
                    "Travel through important events and eras of human history.",
                    "⌛"
                );

            }

            break;


        case "library":

            if (
                typeof window.renderLibraryPage ===
                "function"
            ) {

                window.renderLibraryPage();

            } else {

                renderGenericPage(
                    "Library",
                    "Explore Departments, Subjects, Books and the Read system.",
                    "📚"
                );

            }

            break;


        case "departments":

            if (
                typeof window.renderDepartmentsPage ===
                "function"
            ) {

                window.renderDepartmentsPage();

            } else {

                renderGenericPage(
                    "Departments",
                    "Explore the major knowledge departments of the HistoryVerse Library.",
                    "🏢"
                );

            }

            break;


        case "subjects":

            if (
                typeof window.renderSubjectsPage ===
                "function"
            ) {

                window.renderSubjectsPage();

            } else {

                renderGenericPage(
                    "Subjects",
                    "Browse subjects and areas of historical knowledge.",
                    "📖"
                );

            }

            break;


        case "books":

            if (
                typeof window.renderBooksPage ===
                "function"
            ) {

                window.renderBooksPage();

            } else {

                renderGenericPage(
                    "Books",
                    "Explore historical books and knowledge collections.",
                    "📕"
                );

            }

            break;


        case "read":

            if (
                typeof window.renderReadPage ===
                "function"
            ) {

                window.renderReadPage();

            } else {

                renderGenericPage(
                    "Read",
                    "Read books, articles and historical knowledge.",
                    "📄"
                );

            }

            break;


        case "countries":

            if (
                typeof window.renderCountriesPage ===
                "function"
            ) {

                window.renderCountriesPage();

            } else {

                renderGenericPage(
                    "Countries",
                    "Explore countries, cultures, peoples and historical journeys.",
                    "🌍"
                );

            }

            break;


        case "civilizations":

            if (
                typeof window.renderCivilizationsPage ===
                "function"
            ) {

                window.renderCivilizationsPage();

            } else {

                renderGenericPage(
                    "Civilizations",
                    "Explore civilizations and their contributions to human history.",
                    "🏛️"
                );

            }

            break;


        case "heritage":

            if (
                typeof window.renderHeritagePage ===
                "function"
            ) {

                window.renderHeritagePage();

            } else {

                renderGenericPage(
                    "Heritage",
                    "Discover cultural, historical and natural heritage.",
                    "🏺"
                );

            }

            break;


        case "discover":

            if (
                typeof window.renderDiscoverPage ===
                "function"
            ) {

                window.renderDiscoverPage();

            } else {

                renderGenericPage(
                    "Discover",
                    "Search and discover historical knowledge across the HistoryVerse.",
                    "🔎"
                );

            }

            break;


        case "gallery":

            renderGenericPage(
                "Gallery",
                "Explore historical images, visual collections and cultural media.",
                "🖼️"
            );

            break;


        case "categories":

            renderGenericPage(
                "Categories",
                "Browse HistoryVerse content by historical category.",
                "🗂️"
            );

            break;


        case "contribute":

            renderGenericPage(
                "Contribute",
                "Share historical knowledge with the HistoryVerse community.",
                "🤝"
            );

            break;


        case "agreement":

            renderGenericPage(
                "Contributor Agreement",
                "Review the rules and responsibilities for contributors.",
                "📜"
            );

            break;


        case "guidelines":

            renderGenericPage(
                "Guidelines",
                "Learn the content and contribution guidelines.",
                "📋"
            );

            break;


        case "about":

            renderGenericPage(
                "About",
                "Learn more about ALON HISTORYVERSE 24 and Baba Thecno Guru.",
                "ℹ️"
            );

            break;


        case "contact":

            renderGenericPage(
                "Contact",
                "Connect with the ALON HISTORYVERSE 24 team.",
                "📩"
            );

            break;


        case "privacy":

            renderGenericPage(
                "Privacy Policy",
                "Learn how HistoryVerse handles privacy and information.",
                "🔒"
            );

            break;


        case "terms":

            renderGenericPage(
                "Terms",
                "Review the terms governing use of HistoryVerse.",
                "📄"
            );

            break;


        case "copyright":

            renderGenericPage(
                "Copyright",
                "Learn about copyright and content ownership.",
                "©️"
            );

            break;


        case "admin":

            if (
                typeof window.renderAdminPage ===
                "function"
            ) {

                window.renderAdminPage();

            } else {

                renderGenericPage(
                    "Admin Panel",
                    "Manage HistoryVerse content and systems.",
                    "⚙️"
                );

            }

            break;


        case "admin-articles":

            if (
                typeof window.renderAdminArticlesPage ===
                "function"
            ) {

                window.renderAdminArticlesPage();

            } else {

                renderGenericPage(
                    "Admin Articles",
                    "Create, edit and delete HistoryVerse articles.",
                    "🛠️"
                );

            }

            break;


        default:

            renderHome();

            break;

    }


    if (
        HistoryVerse.config.scrollToTop
    ) {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (
        HistoryVerse.config.rememberRoute
    ) {

        Storage.set(
            "alon_historyverse_last_route",
            normalized
        );

    }

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation(
    route
) {

    const links =
        document.querySelectorAll(
            "#mainNavigation a"
        );


    links.forEach(link => {

        const linkRoute =
            normalizeRoute(
                link.dataset.route ||
                link.getAttribute("href")
            );


        link.classList.toggle(
            "active",
            linkRoute === route
        );

    });

}


/* =========================================================
   MENU
========================================================= */

function openMenu() {

    const {
        drawer,
        backdrop,
        menuBtn
    } = HistoryVerse.elements;


    if (!drawer) {
        return;
    }


    drawer.classList.add(
        "open"
    );


    backdrop?.classList.add(
        "open"
    );


    drawer.setAttribute(
        "aria-hidden",
        "false"
    );


    menuBtn?.setAttribute(
        "aria-expanded",
        "true"
    );


    document.body.style.overflow =
        "hidden";

}


function closeMenu() {

    const {
        drawer,
        backdrop,
        menuBtn
    } = HistoryVerse.elements;


    drawer?.classList.remove(
        "open"
    );


    backdrop?.classList.remove(
        "open"
    );


    drawer?.setAttribute(
        "aria-hidden",
        "true"
    );


    menuBtn?.setAttribute(
        "aria-expanded",
        "false"
    );


    if (
        !HistoryVerse.elements.languagePanel
            ?.classList.contains("open")
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   LANGUAGE PANEL
========================================================= */

function showLanguagePanel() {

    closeMenu();

    openLanguagePanel?.();

}


function hideLanguagePanel() {

    closeLanguagePanel?.();

    document.body.style.overflow =
        "";

}


/* =========================================================
   GLOBAL CLICK HANDLING
========================================================= */

function setupGlobalClicks() {

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "a[href^='#']"
                );


            if (!link) {
                return;
            }


            const href =
                link.getAttribute(
                    "href"
                );


            if (
                !href ||
                href === "#"
            ) {
                return;
            }


            /*
               Close drawer when navigating.
            */

            if (
                HistoryVerse.elements.drawer
                    ?.classList.contains("open")
            ) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   HASH ROUTING
========================================================= */

function setupRouter() {

    window.addEventListener(
        "hashchange",
        () => {

            renderRoute(
                getRoute()
            );

        }
    );


    window.addEventListener(
        "popstate",
        () => {

            renderRoute(
                getRoute()
            );

        }
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

function setupKeyboardControls() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

                hideLanguagePanel();

            }

        }
    );

}


/* =========================================================
   HEADER CONTROLS
========================================================= */

function setupHeaderControls() {

    const {
        menuBtn,
        closeMenu: closeMenuBtn,
        backdrop,
        languageBtn,
        closeLang
    } = HistoryVerse.elements;


    menuBtn?.addEventListener(
        "click",
        openMenu
    );


    closeMenuBtn?.addEventListener(
        "click",
        closeMenu
    );


    backdrop?.addEventListener(
        "click",
        closeMenu
    );


    languageBtn?.addEventListener(
        "click",
        showLanguagePanel
    );


    closeLang?.addEventListener(
        "click",
        hideLanguagePanel
    );

}


/* =========================================================
   MODULE INITIALIZATION
========================================================= */

function initializeModules() {

    try {

        initLanguageSystem?.();

    } catch (error) {

        console.error(
            "Language system initialization failed:",
            error
        );

    }


    try {

        initArticleSystem?.();

    } catch (error) {

        console.error(
            "Article system initialization failed:",
            error
        );

    }


    try {

        initLibrarySystem?.();

    } catch (error) {

        console.error(
            "Library system initialization failed:",
            error
        );

    }


    try {

        initExploreSystem?.();

    } catch (error) {

        console.error(
            "Explore system initialization failed:",
            error
        );

    }


    try {

        initAdminSystem?.();

    } catch (error) {

        console.error(
            "Admin system initialization failed:",
            error
        );

    }

}


/* =========================================================
   APPLICATION INITIALIZATION
========================================================= */

function initializeHistoryVerse() {

    if (
        HistoryVerse.initialized
    ) {

        return;

    }


    cacheElements();

    setupHeaderControls();

    setupGlobalClicks();

    setupRouter();

    setupKeyboardControls();

    initializeModules();


    HistoryVerse.initialized =
        true;


    const initialRoute =
        getRoute();


    renderRoute(
        initialRoute
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   PUBLIC API
========================================================= */

window.ALON_HISTORYVERSE_24 = {

    version:
        HistoryVerse.version,

    creator:
        HistoryVerse.creator,

    navigate,

    getRoute,

    renderRoute,

    openMenu,

    closeMenu,

    openLanguagePanel:
        showLanguagePanel,

    closeLanguagePanel:
        hideLanguagePanel,

    getCurrentLanguage,

    storage:
        Storage

};


/* =========================================================
   START APPLICATION
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeHistoryVerse,
        {
            once: true
        }
    );

} else {

    initializeHistoryVerse();

}