/* =========================================================
   ALON HISTORYVERSE 24
   MAIN APPLICATION ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/app.js
   ========================================================= */

"use strict";


/* =========================================================
   APPLICATION CONFIGURATION
   ========================================================= */

const ALON_APP_CONFIG = {

    project: "ALON HISTORYVERSE 24",

    creator: "Baba Thecno Guru",

    version: "24.0",

    storage: {

        language:
            "alon_historyverse_language",

        articles:
            "alon_historyverse_articles",

        drafts:
            "alon_historyverse_article_drafts",

        trash:
            "alon_historyverse_article_trash",

        contactDraft:
            "alon_historyverse_contact_draft",

        contributionDraft:
            "alon_historyverse_contribution_draft",

        pendingContribution:
            "alon_historyverse_pending_contribution",

        loggedIn:
            "alon_historyverse_logged_in",

        adminLoggedIn:
            "alon_historyverse_admin_logged_in"
    },

    paths: {

        home:
            "../index.html",

        discover:
            "./discover.html",

        library:
            "./library.html",

        department:
            "./department.html",

        subject:
            "./subject.html",

        book:
            "./book.html",

        read:
            "./read.html",

        countries:
            "./countries.html",

        country:
            "./country.html",

        civilizations:
            "./civilizations.html",

        heritage:
            "./heritage.html",

        timeline:
            "./timeline.html",

        articles:
            "./articles.html",

        article:
            "./article.html",

        gallery:
            "./gallery.html",

        categories:
            "./categories.html",

        contribute:
            "./contribute.html",

        about:
            "./about.html",

        contact:
            "./contact.html",

        guidelines:
            "./guidelines.html",

        login:
            "./login.html",

        admin:
            "./admin.html"
    }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function appElement(id) {

    return document.getElementById(id);

}


function appQuery(selector) {

    return document.querySelector(selector);

}


function appQueryAll(selector) {

    return document.querySelectorAll(selector);

}


/* =========================================================
   SAFE STORAGE
   ========================================================= */

function appGetStorage(key, fallback = null) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {

            return fallback;

        }

        try {

            return JSON.parse(value);

        } catch {

            return value;

        }

    } catch (error) {

        console.error(
            "ALON App storage read error:",
            error
        );

        return fallback;

    }

}


function appSetStorage(key, value) {

    try {

        if (
            typeof value === "string"
        ) {

            localStorage.setItem(
                key,
                value
            );

        } else {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        }

        return true;

    } catch (error) {

        console.error(
            "ALON App storage write error:",
            error
        );

        return false;

    }

}


function appRemoveStorage(key) {

    try {

        localStorage.removeItem(key);

        return true;

    } catch (error) {

        console.error(
            "ALON App storage remove error:",
            error
        );

        return false;

    }

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function appEscapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

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


/* =========================================================
   APPLICATION STATUS
   ========================================================= */

function appSetStatus(
    message,
    type = "info"
) {

    const status =
        appElement("ah-status");

    if (!status) {

        return;

    }

    status.textContent =
        message;

    status.dataset.status =
        type;

    clearTimeout(
        window.alonStatusTimer
    );

    window.alonStatusTimer =
        setTimeout(
            function () {

                if (status) {

                    status.textContent =
                        "";

                    status.dataset.status =
                        "";

                }

            },
            3500
        );

}


/* =========================================================
   CURRENT PAGE
   ========================================================= */

function appGetCurrentPage() {

    const path =
        window.location.pathname;

    const file =
        path
            .split("/")
            .pop();

    return file ||
        "index.html";

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function appSetActiveNavigation() {

    const current =
        appGetCurrentPage();

    appQueryAll(
        "a[href]"
    ).forEach(
        function (link) {

            const href =
                link.getAttribute(
                    "href"
                );

            if (!href) {

                return;

            }

            if (
                href.startsWith("#") ||
                href.startsWith("http") ||
                href.startsWith("mailto:")
            ) {

                return;

            }

            const cleanHref =
                href
                    .split("?")[0]
                    .split("#")[0]
                    .split("/")
                    .pop();

            if (
                cleanHref === current
            ) {

                link.classList.add(
                    "active"
                );

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function appSetupMobileMenu() {

    const menuButton =
        appElement("menuBtn");

    const mobileMenu =
        appElement("mobileMenu");

    if (
        !menuButton ||
        !mobileMenu
    ) {

        return;

    }

    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                mobileMenu.classList.toggle(
                    "open"
                );

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            if (isOpen) {

                mobileMenu.removeAttribute(
                    "hidden"
                );

            } else {

                mobileMenu.setAttribute(
                    "hidden",
                    ""
                );

            }

        }
    );


    mobileMenu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu.classList.remove(
                            "open"
                        );

                        mobileMenu.setAttribute(
                            "hidden",
                            ""
                        );

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        function (event) {

            if (
                !mobileMenu.contains(
                    event.target
                ) &&
                !menuButton.contains(
                    event.target
                )
            ) {

                mobileMenu.classList.remove(
                    "open"
                );

                mobileMenu.setAttribute(
                    "hidden",
                    ""
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


/* =========================================================
   SEARCH ENGINE
   ========================================================= */

function appNormalizeSearch(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


function appSearchPage(
    query,
    selector = "[data-search-item]"
) {

    const search =
        appNormalizeSearch(query);

    const items =
        appQueryAll(selector);

    let visible = 0;

    items.forEach(
        function (item) {

            const text =
                appNormalizeSearch(
                    item.textContent
                );

            const match =
                !search ||
                text.includes(search);

            item.hidden =
                !match;

            if (match) {

                visible++;

            }

        }
    );

    return visible;

}


/* =========================================================
   SEARCH FORM
   ========================================================= */

function appSetupSearch() {

    const form =
        appElement("searchForm");

    if (!form) {

        return;

    }

    const input =
        form.querySelector(
            "input"
        );

    if (!input) {

        return;

    }

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const query =
                input.value.trim();

            if (!query) {

                appSetStatus(
                    "Type something to search.",
                    "warning"
                );

                input.focus();

                return;

            }

            const localResults =
                appSearchPage(
                    query
                );

            if (
                localResults > 0
            ) {

                appSetStatus(
                    localResults +
                    " result(s) found.",
                    "success"
                );

                return;

            }

            const target =
                ALON_APP_CONFIG
                    .paths
                    .articles +
                "?search=" +
                encodeURIComponent(
                    query
                );

            window.location.href =
                target;

        }
    );

}


/* =========================================================
   LANGUAGE SYSTEM
   ========================================================= */

function appGetLanguage() {

    const language =
        appGetStorage(
            ALON_APP_CONFIG.storage.language,
            "en"
        );

    if (
        typeof language === "string"
    ) {

        return language;

    }

    return "en";

}


function appSetLanguage(language) {

    if (!language) {

        return false;

    }

    const saved =
        appSetStorage(
            ALON_APP_CONFIG.storage.language,
            language
        );

    if (saved) {

        document.documentElement
            .setAttribute(
                "lang",
                language
            );

        document.body.dataset.language =
            language;

    }

    return saved;

}


function appSetupLanguageButton() {

    const button =
        appElement(
            "languageBtn"
        );

    if (!button) {

        return;

    }

    button.addEventListener(
        "click",
        function () {

            const current =
                appGetLanguage();

            if (
                window.WORLD_LANGUAGE_CONFIG &&
                typeof window
                    .WORLD_LANGUAGE_CONFIG
                    .openLanguageSelector ===
                    "function"
            ) {

                window
                    .WORLD_LANGUAGE_CONFIG
                    .openLanguageSelector();

                return;

            }

            if (
                typeof window
                    .openLanguageSelector ===
                "function"
            ) {

                window
                    .openLanguageSelector();

                return;

            }

            appSetStatus(
                "Language selector is loading.",
                "info"
            );

        }
    );

}


/* =========================================================
   ARTICLE HELPERS
   ========================================================= */

function appGetArticles() {

    const articles =
        appGetStorage(
            ALON_APP_CONFIG.storage.articles,
            []
        );

    return Array.isArray(articles)
        ? articles
        : [];

}


function appSaveArticles(
    articles
) {

    return appSetStorage(
        ALON_APP_CONFIG.storage.articles,
        articles
    );

}


function appGetArticleById(
    articleId
) {

    const articles =
        appGetArticles();

    return articles.find(
        function (article) {

            return String(
                article.id
            ) === String(
                articleId
            );

        }
    ) || null;

}


/* =========================================================
   ARTICLE LINK SUPPORT
   ========================================================= */

function appSetupArticleLinks() {

    appQueryAll(
        "[data-article-id]"
    ).forEach(
        function (element) {

            if (
                element.tagName ===
                "A"
            ) {

                return;

            }

            element.addEventListener(
                "click",
                function () {

                    const id =
                        element.dataset
                            .articleId;

                    if (!id) {

                        return;

                    }

                    window.location.href =
                        ALON_APP_CONFIG
                            .paths
                            .article +
                        "?id=" +
                        encodeURIComponent(
                            id
                        );

                }
            );

            element.setAttribute(
                "role",
                "button"
            );

            element.setAttribute(
                "tabindex",
                "0"
            );

            element.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        element.click();

                    }

                }
            );

        }
    );

}


/* =========================================================
   URL PARAMETERS
   ========================================================= */

function appGetQueryParameter(
    name
) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name);

}


/* =========================================================
   COUNTRY LINK SUPPORT
   ========================================================= */

function appOpenCountry(
    country
) {

    if (!country) {

        return;

    }

    window.location.href =
        ALON_APP_CONFIG
            .paths
            .country +
        "?country=" +
        encodeURIComponent(
            country
        );

}


/* =========================================================
   CIVILIZATION LINK SUPPORT
   ========================================================= */

function appOpenCivilization(
    civilization
) {

    if (!civilization) {

        return;

    }

    window.location.href =
        ALON_APP_CONFIG
            .paths
            .civilizations +
        "?civilization=" +
        encodeURIComponent(
            civilization
        );

}


/* =========================================================
   HERITAGE LINK SUPPORT
   ========================================================= */

function appOpenHeritage(
    heritageId
) {

    if (!heritageId) {

        return;

    }

    window.location.href =
        ALON_APP_CONFIG
            .paths
            .heritage +
        "?id=" +
        encodeURIComponent(
            heritageId
        );

}


/* =========================================================
   TIMELINE LINK SUPPORT
   ========================================================= */

function appOpenTimelineEvent(
    eventId
) {

    if (!eventId) {

        return;

    }

    window.location.href =
        ALON_APP_CONFIG
            .paths
            .timeline +
        "?event=" +
        encodeURIComponent(
            eventId
        );

}


/* =========================================================
   CLICKABLE CARDS
   ========================================================= */

function appSetupClickableCards() {

    appQueryAll(
        "[data-href]"
    ).forEach(
        function (card) {

            const target =
                card.dataset.href;

            if (!target) {

                return;

            }

            card.setAttribute(
                "role",
                "link"
            );

            card.setAttribute(
                "tabindex",
                "0"
            );

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            "a,button,input,select,textarea"
                        )
                    ) {

                        return;

                    }

                    window.location.href =
                        target;

                }
            );

            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter" ||
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        window.location.href =
                            target;

                    }

                }
            );

        }
    );

}


/* =========================================================
   EXTERNAL LINKS
   ========================================================= */

function appSetupExternalLinks() {

    appQueryAll(
        'a[href^="http"]'
    ).forEach(
        function (link) {

            try {

                const url =
                    new URL(
                        link.href
                    );

                if (
                    url.hostname !==
                    window.location.hostname
                ) {

                    link.setAttribute(
                        "target",
                        "_blank"
                    );

                    link.setAttribute(
                        "rel",
                        "noopener noreferrer"
                    );

                }

            } catch {

                /* Ignore invalid URLs */

            }

        }
    );

}


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

function appSetupImageFallback() {

    appQueryAll(
        "img"
    ).forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    image.dataset
                        .imageError =
                        "true";

                }
            );

        }
    );

}


/* =========================================================
   SCROLL TO TOP
   ========================================================= */

function appSetupScrollTop() {

    const button =
        appElement(
            "scrollTopBtn"
        );

    if (!button) {

        return;

    }

    window.addEventListener(
        "scroll",
        function () {

            button.hidden =
                window.scrollY < 400;

        }
    );

    button.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   BACK BUTTON
   ========================================================= */

function appSetupBackButtons() {

    appQueryAll(
        "[data-back]"
    ).forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    if (
                        window.history.length >
                        1
                    ) {

                        window.history.back();

                    } else {

                        window.location.href =
                            ALON_APP_CONFIG
                                .paths
                                .home;

                    }

                }
            );

        }
    );

}


/* =========================================================
   LOGIN STATE
   ========================================================= */

function appIsLoggedIn() {

    return (
        localStorage.getItem(
            ALON_APP_CONFIG.storage.loggedIn
        ) === "true"
    );

}


function appUpdateLoginUI() {

    const loggedIn =
        appIsLoggedIn();

    appQueryAll(
        "[data-logged-in-only]"
    ).forEach(
        function (element) {

            element.hidden =
                !loggedIn;

        }
    );

    appQueryAll(
        "[data-logged-out-only]"
    ).forEach(
        function (element) {

            element.hidden =
                loggedIn;

        }
    );

}


/* =========================================================
   LOGOUT
   ========================================================= */

function appLogout() {

    appRemoveStorage(
        ALON_APP_CONFIG.storage.loggedIn
    );

    appRemoveStorage(
        ALON_APP_CONFIG.storage.adminLoggedIn
    );

    appSetStatus(
        "You have been logged out.",
        "success"
    );

    appUpdateLoginUI();

}


/* =========================================================
   LOCAL ARTICLE STATISTICS
   ========================================================= */

function appGetArticleStatistics() {

    const articles =
        appGetArticles();

    const categories = {};

    articles.forEach(
        function (article) {

            const category =
                article.category ||
                "Other";

            categories[category] =
                (
                    categories[category] ||
                    0
                ) + 1;

        }
    );

    return {

        total:
            articles.length,

        categories:
            categories

    };

}


/* =========================================================
   DATE FORMATTER
   ========================================================= */

function appFormatDate(
    value
) {

    if (!value) {

        return "";

    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function appUpdateConnectionStatus() {

    const status =
        appElement(
            "connectionStatus"
        );

    if (!status) {

        return;

    }

    if (
        navigator.onLine
    ) {

        status.textContent =
            "Online";

        status.dataset.status =
            "online";

    } else {

        status.textContent =
            "Offline";

        status.dataset.status =
            "offline";

    }

}


/* =========================================================
   ONLINE / OFFLINE EVENTS
   ========================================================= */

function appSetupConnectionEvents() {

    window.addEventListener(
        "online",
        function () {

            appUpdateConnectionStatus();

            appSetStatus(
                "Internet connection restored.",
                "success"
            );

        }
    );


    window.addEventListener(
        "offline",
        function () {

            appUpdateConnectionStatus();

            appSetStatus(
                "You are offline. Local features remain available.",
                "warning"
            );

        }
    );

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

function appSetupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "/" &&
                ![
                    "INPUT",
                    "TEXTAREA",
                    "SELECT"
                ].includes(
                    document.activeElement.tagName
                )
            ) {

                const search =
                    document.querySelector(
                        'input[type="search"], input[name="search"]'
                    );

                if (search) {

                    event.preventDefault();

                    search.focus();

                }

            }

        }
    );

}


/* =========================================================
   PAGE INITIALIZATION
   ========================================================= */

function initializeALONApp() {

    try {

        appSetActiveNavigation();

        appSetupMobileMenu();

        appSetupSearch();

        appSetupLanguageButton();

        appSetupArticleLinks();

        appSetupClickableCards();

        appSetupExternalLinks();

        appSetupImageFallback();

        appSetupScrollTop();

        appSetupBackButtons();

        appUpdateLoginUI();

        appSetupConnectionEvents();

        appUpdateConnectionStatus();

        appSetupKeyboardShortcuts();

        document.documentElement
            .setAttribute(
                "data-alon-app",
                "24"
            );

        document.body.dataset
            .alonHistoryverse =
            "24";

        console.log(
            "ALON HISTORYVERSE 24 App initialized."
        );

    } catch (error) {

        console.error(
            "ALON HISTORYVERSE 24 App initialization error:",
            error
        );

    }

}


/* =========================================================
   GLOBAL APPLICATION API
   ========================================================= */

window.ALON_APP = {

    config:
        ALON_APP_CONFIG,

    element:
        appElement,

    query:
        appQuery,

    queryAll:
        appQueryAll,

    getStorage:
        appGetStorage,

    setStorage:
        appSetStorage,

    removeStorage:
        appRemoveStorage,

    escapeHTML:
        appEscapeHTML,

    setStatus:
        appSetStatus,

    getCurrentPage:
        appGetCurrentPage,

    getLanguage:
        appGetLanguage,

    setLanguage:
        appSetLanguage,

    search:
        appSearchPage,

    getQuery:
        appGetQueryParameter,

    getArticles:
        appGetArticles,

    getArticleById:
        appGetArticleById,

    getArticleStatistics:
        appGetArticleStatistics,

    formatDate:
        appFormatDate,

    isLoggedIn:
        appIsLoggedIn,

    logout:
        appLogout,

    openCountry:
        appOpenCountry,

    openCivilization:
        appOpenCivilization,

    openHeritage:
        appOpenHeritage,

    openTimelineEvent:
        appOpenTimelineEvent,

    refreshLogin:
        appUpdateLoginUI,

    initialize:
        initializeALONApp

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
        initializeALONApp
    );

} else {

    initializeALONApp();

}


/* =========================================================
   END OF APP.JS
   ALON HISTORYVERSE 24
   ========================================================= */