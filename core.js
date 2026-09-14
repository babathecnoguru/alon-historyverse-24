/* =========================================================
   ALON HISTORYVERSE 24
   CORE ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/core.js
   ========================================================= */

"use strict";


/* =========================================================
   GLOBAL CONFIGURATION
   ========================================================= */

const ALON_CORE_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "24.0",

    storage: {

        language:
            "alon_historyverse_language",

        articles:
            "alon_historyverse_articles",

        drafts:
            "alon_historyverse_article_drafts",

        trash:
            "alon_historyverse_article_trash",

        loggedIn:
            "alon_historyverse_logged_in",

        adminLoggedIn:
            "alon_historyverse_admin_logged_in"

    },

    paths: {

        home:
            "../index.html",

        articles:
            "./articles.html",

        article:
            "./article.html",

        library:
            "./library.html",

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

        contact:
            "./contact.html",

        contribute:
            "./contribute.html",

        login:
            "./login.html",

        admin:
            "./admin.html"

    }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function coreGetElement(
    selector
) {

    if (!selector) {

        return null;

    }

    if (
        typeof selector !==
        "string"
    ) {

        return selector;

    }

    if (
        selector.startsWith("#")
    ) {

        return document.getElementById(
            selector.substring(1)
        );

    }

    return document.querySelector(
        selector
    );

}


function coreGetElements(
    selector
) {

    if (!selector) {

        return [];

    }

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function coreStorageGet(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(
                key
            );

        if (
            value === null
        ) {

            return fallback;

        }

        try {

            return JSON.parse(
                value
            );

        } catch {

            return value;

        }

    } catch (error) {

        console.error(
            "Core storage read error:",
            error
        );

        return fallback;

    }

}


function coreStorageSet(
    key,
    value
) {

    try {

        if (
            typeof value ===
            "string"
        ) {

            localStorage.setItem(
                key,
                value
            );

        } else {

            localStorage.setItem(
                key,
                JSON.stringify(
                    value
                )
            );

        }

        return true;

    } catch (error) {

        console.error(
            "Core storage write error:",
            error
        );

        return false;

    }

}


function coreStorageRemove(
    key
) {

    try {

        localStorage.removeItem(
            key
        );

        return true;

    } catch (error) {

        console.error(
            "Core storage remove error:",
            error
        );

        return false;

    }

}


function coreStorageClear() {

    try {

        localStorage.clear();

        return true;

    } catch (error) {

        console.error(
            "Core storage clear error:",
            error
        );

        return false;

    }

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function coreEscapeHTML(
    value
) {

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
   TEXT HELPERS
   ========================================================= */

function coreTrim(
    value
) {

    return String(
        value ?? ""
    ).trim();

}


function coreNormalizeText(
    value
) {

    return coreTrim(
        value
    )
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


function coreLimitText(
    value,
    maxLength
) {

    const text =
        String(
            value ?? ""
        );

    if (
        text.length <=
        maxLength
    ) {

        return text;

    }

    return (
        text.substring(
            0,
            maxLength
        ) +
        "…"
    );

}


/* =========================================================
   ID GENERATOR
   ========================================================= */

function coreCreateID(
    prefix = "alon"
) {

    return (

        String(prefix) +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10)

    );

}


/* =========================================================
   DATE / TIME
   ========================================================= */

function coreNowISO() {

    return new Date()
        .toISOString();

}


function coreFormatDate(
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
            year:
                "numeric",

            month:
                "long",

            day:
                "numeric"
        }
    );

}


function coreFormatDateTime(
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

    return date.toLocaleString(
        undefined,
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );

}


/* =========================================================
   URL HELPERS
   ========================================================= */

function coreGetURLParams() {

    return new URLSearchParams(
        window.location.search
    );

}


function coreGetURLParam(
    name,
    fallback = null
) {

    const params =
        coreGetURLParams();

    const value =
        params.get(
            name
        );

    if (
        value === null
    ) {

        return fallback;

    }

    return value;

}


function coreSetURLParam(
    name,
    value
) {

    const url =
        new URL(
            window.location.href
        );

    url.searchParams.set(
        name,
        value
    );

    window.history.pushState(
        {},
        "",
        url
    );

}


function coreRemoveURLParam(
    name
) {

    const url =
        new URL(
            window.location.href
        );

    url.searchParams.delete(
        name
    );

    window.history.pushState(
        {},
        "",
        url
    );

}


/* =========================================================
   PAGE DETECTION
   ========================================================= */

function coreGetCurrentPage() {

    const path =
        window.location.pathname;

    const file =
        path.split(
            "/"
        ).pop();

    if (
        !file ||
        file === "/"
    ) {

        return "index.html";

    }

    return file;

}


function coreIsPage(
    pageName
) {

    return (
        coreGetCurrentPage()
            .toLowerCase()
        ===
        String(
            pageName
        ).toLowerCase()
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function coreNavigate(
    url
) {

    if (!url) {

        return;

    }

    window.location.href =
        url;

}


function coreGoHome() {

    coreNavigate(
        ALON_CORE_CONFIG
            .paths
            .home
    );

}


function coreGoBack() {

    if (
        window.history.length >
        1
    ) {

        window.history.back();

    } else {

        coreGoHome();

    }

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function coreSetupMobileMenu() {

    const menuButton =
        coreGetElement(
            "#menuBtn"
        ) ||
        coreGetElement(
            "[data-menu-button]"
        );

    const mobileMenu =
        coreGetElement(
            "#mobileMenu"
        ) ||
        coreGetElement(
            "[data-mobile-menu]"
        );

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
                String(
                    isOpen
                )
            );

        }
    );


    const links =
        mobileMenu.querySelectorAll(
            "a"
        );

    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    mobileMenu.classList.remove(
                        "open"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function coreStatus(
    message,
    type = "info",
    duration = 3500
) {

    let status =
        coreGetElement(
            "#ah-status"
        );

    if (!status) {

        status =
            coreGetElement(
                "#status"
            );

    }

    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "ah-status";

        status.setAttribute(
            "role",
            "status"
        );

        document.body.appendChild(
            status
        );

    }

    status.textContent =
        message;

    status.dataset.type =
        type;

    status.classList.add(
        "active"
    );


    if (
        duration > 0
    ) {

        window.setTimeout(
            function () {

                status.classList.remove(
                    "active"
                );

            },
            duration
        );

    }

}


/* =========================================================
   SEARCH HELPERS
   ========================================================= */

function coreSearchText(
    value,
    query
) {

    const text =
        coreNormalizeText(
            value
        );

    const search =
        coreNormalizeText(
            query
        );

    if (!search) {

        return true;

    }

    return text.includes(
        search
    );

}


function coreFilterElements(
    elements,
    query
) {

    const search =
        coreNormalizeText(
            query
        );

    elements.forEach(
        function (element) {

            if (!search) {

                element.hidden =
                    false;

                return;

            }

            const text =
                coreNormalizeText(
                    element.textContent
                );

            element.hidden =
                !text.includes(
                    search
                );

        }
    );

}


/* =========================================================
   CLICKABLE CARDS
   ========================================================= */

function coreSetupClickableCards() {

    const cards =
        coreGetElements(
            "[data-href]"
        );

    cards.forEach(
        function (card) {

            card.style.cursor =
                "pointer";

            card.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target.closest(
                            "a, button, input, select, textarea"
                        )
                    ) {

                        return;

                    }

                    const url =
                        card.dataset.href;

                    if (url) {

                        coreNavigate(
                            url
                        );

                    }

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

                        const url =
                            card.dataset.href;

                        if (url) {

                            coreNavigate(
                                url
                            );

                        }

                    }

                }
            );

            card.setAttribute(
                "tabindex",
                "0"
            );

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function coreSetActiveNavigation() {

    const current =
        coreGetCurrentPage()
            .toLowerCase();

    const links =
        coreGetElements(
            "nav a, .nav a, .mobile-menu a"
        );

    links.forEach(
        function (link) {

            const href =
                link.getAttribute(
                    "href"
                );

            if (!href) {

                return;

            }

            const clean =
                href
                    .split("?")[0]
                    .split("#")[0];

            const page =
                clean
                    .split("/")
                    .pop()
                    .toLowerCase();

            if (
                page ===
                current
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
   IMAGE FALLBACK
   ========================================================= */

function coreSetupImageFallbacks() {

    const images =
        coreGetElements(
            "img"
        );

    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    if (
                        image.dataset.fallbackApplied
                    ) {

                        return;

                    }

                    image.dataset.fallbackApplied =
                        "true";

                    image.style.display =
                        "none";

                }
            );

        }
    );

}


/* =========================================================
   SCROLL TO TOP
   ========================================================= */

function coreScrollToTop(
    smooth = true
) {

    window.scrollTo({

        top:
            0,

        behavior:
            smooth
                ? "smooth"
                : "auto"

    });

}


/* =========================================================
   SCROLL TO ELEMENT
   ========================================================= */

function coreScrollTo(
    selector
) {

    const element =
        coreGetElement(
            selector
        );

    if (!element) {

        return false;

    }

    element.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

    return true;

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function coreSetupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             * "/" focuses the main search field.
             */

            if (
                event.key === "/" &&
                !event.ctrlKey &&
                !event.altKey &&
                !event.metaKey
            ) {

                const target =
                    event.target;

                const tag =
                    target &&
                    target.tagName
                        ? target.tagName
                        : "";

                if (
                    tag === "INPUT" ||
                    tag === "TEXTAREA" ||
                    tag === "SELECT"
                ) {

                    return;

                }

                const search =
                    coreGetElement(
                        "#searchInput"
                    ) ||
                    coreGetElement(
                        "#articleSearch"
                    ) ||
                    coreGetElement(
                        "[data-search-input]"
                    );

                if (search) {

                    event.preventDefault();

                    search.focus();

                }

            }


            /*
             * Escape closes common overlays.
             */

            if (
                event.key ===
                "Escape"
            ) {

                coreGetElements(
                    ".modal.open, .modal.active, .mobile-menu.open"
                )
                    .forEach(
                        function (element) {

                            element.classList.remove(
                                "open",
                                "active"
                            );

                        }
                    );

            }

        }
    );

}


/* =========================================================
   LOGIN STATE
   ========================================================= */

function coreIsLoggedIn() {

    return (
        coreStorageGet(
            ALON_CORE_CONFIG
                .storage
                .loggedIn,
            false
        ) === true
    );

}


function coreSetLoggedIn(
    value
) {

    return coreStorageSet(
        ALON_CORE_CONFIG
            .storage
            .loggedIn,
        Boolean(value)
    );

}


function coreLogout() {

    coreSetLoggedIn(
        false
    );

    coreStatus(
        "You have been logged out.",
        "success"
    );

}


/* =========================================================
   ADMIN STATE
   ========================================================= */

function coreIsAdminLoggedIn() {

    return (
        coreStorageGet(
            ALON_CORE_CONFIG
                .storage
                .adminLoggedIn,
            false
        ) === true
    );

}


function coreSetAdminLoggedIn(
    value
) {

    return coreStorageSet(
        ALON_CORE_CONFIG
            .storage
            .adminLoggedIn,
        Boolean(value)
    );

}


function coreAdminLogout() {

    coreSetAdminLoggedIn(
        false
    );

    coreStatus(
        "Admin session ended.",
        "success"
    );

}


/* =========================================================
   ARTICLE HELPERS
   ========================================================= */

function coreGetArticles() {

    const articles =
        coreStorageGet(
            ALON_CORE_CONFIG
                .storage
                .articles,
            []
        );

    return Array.isArray(
        articles
    )
        ? articles
        : [];

}


function coreGetArticleById(
    id
) {

    if (!id) {

        return null;

    }

    return (
        coreGetArticles()
            .find(
                function (article) {

                    return String(
                        article.id
                    ) === String(
                        id
                    );

                }
            ) ||
        null
    );

}


/* =========================================================
   ARTICLE URL
   ========================================================= */

function coreArticleURL(
    id
) {

    if (!id) {

        return (
            ALON_CORE_CONFIG
                .paths
                .articles
        );

    }

    return (
        ALON_CORE_CONFIG
            .paths
            .article +
        "?id=" +
        encodeURIComponent(
            id
        )
    );

}


/* =========================================================
   COUNTRY URL
   ========================================================= */

function coreCountryURL(
    country
) {

    if (!country) {

        return (
            ALON_CORE_CONFIG
                .paths
                .countries
        );

    }

    return (
        ALON_CORE_CONFIG
            .paths
            .country +
        "?country=" +
        encodeURIComponent(
            country
        )
    );

}


/* =========================================================
   CIVILIZATION URL
   ========================================================= */

function coreCivilizationURL(
    civilization
) {

    if (!civilization) {

        return (
            ALON_CORE_CONFIG
                .paths
                .civilizations
        );

    }

    return (
        ALON_CORE_CONFIG
            .paths
            .civilizations +
        "?civilization=" +
        encodeURIComponent(
            civilization
        )
    );

}


/* =========================================================
   EVENT LISTENER SAFE SETUP
   ========================================================= */

function coreOn(
    element,
    event,
    handler,
    options
) {

    if (!element) {

        return false;

    }

    element.addEventListener(
        event,
        handler,
        options
    );

    return true;

}


/* =========================================================
   CONNECTION STATUS
   ========================================================= */

function coreConnectionStatus() {

    return navigator.onLine
        ? "online"
        : "offline";

}


function coreSetupConnectionEvents() {

    window.addEventListener(
        "online",
        function () {

            coreStatus(
                "Connection restored.",
                "success"
            );

        }
    );


    window.addEventListener(
        "offline",
        function () {

            coreStatus(
                "You are currently offline.",
                "warning"
            );

        }
    );

}


/* =========================================================
   DOCUMENT READY
   ========================================================= */

function coreInitialize() {

    coreSetupMobileMenu();

    coreSetActiveNavigation();

    coreSetupClickableCards();

    coreSetupImageFallbacks();

    coreSetupKeyboardShortcuts();

    coreSetupConnectionEvents();

}


/* =========================================================
   GLOBAL CORE API
   ========================================================= */

window.ALON_CORE = {

    config:
        ALON_CORE_CONFIG,

    dom:
        coreGetElement,

    domAll:
        coreGetElements,

    storageGet:
        coreStorageGet,

    storageSet:
        coreStorageSet,

    storageRemove:
        coreStorageRemove,

    storageClear:
        coreStorageClear,

    escapeHTML:
        coreEscapeHTML,

    trim:
        coreTrim,

    normalize:
        coreNormalizeText,

    limit:
        coreLimitText,

    createID:
        coreCreateID,

    now:
        coreNowISO,

    formatDate:
        coreFormatDate,

    formatDateTime:
        coreFormatDateTime,

    params:
        coreGetURLParams,

    param:
        coreGetURLParam,

    setParam:
        coreSetURLParam,

    removeParam:
        coreRemoveURLParam,

    page:
        coreGetCurrentPage,

    isPage:
        coreIsPage,

    navigate:
        coreNavigate,

    home:
        coreGoHome,

    back:
        coreGoBack,

    status:
        coreStatus,

    search:
        coreSearchText,

    filter:
        coreFilterElements,

    scrollTop:
        coreScrollToTop,

    scrollTo:
        coreScrollTo,

    loggedIn:
        coreIsLoggedIn,

    setLoggedIn:
        coreSetLoggedIn,

    logout:
        coreLogout,

    adminLoggedIn:
        coreIsAdminLoggedIn,

    setAdminLoggedIn:
        coreSetAdminLoggedIn,

    adminLogout:
        coreAdminLogout,

    articles:
        coreGetArticles,

    articleById:
        coreGetArticleById,

    articleURL:
        coreArticleURL,

    countryURL:
        coreCountryURL,

    civilizationURL:
        coreCivilizationURL,

    connection:
        coreConnectionStatus,

    on:
        coreOn,

    initialize:
        coreInitialize

};


/* =========================================================
   AUTO INITIALIZATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        coreInitialize
    );

} else {

    coreInitialize();

}


/* =========================================================
   END OF CORE.JS
   ALON HISTORYVERSE 24
   ========================================================= */