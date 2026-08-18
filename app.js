/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/app.js
   MAIN APPLICATION CONTROLLER
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   IMPORT CORE SYSTEMS
========================================================= */

import {
    getArticles,
    getPublishedArticles,
    getFeaturedArticles,
    searchArticles,
    getArticleById,
    getArticleTitle,
    getArticleDescription,
    createArticleCard
} from "./articles.js";


/* =========================================================
   APPLICATION CONFIG
========================================================= */

const APP = {

    name:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "V100",

    defaultLanguage:
        "en",

    storageLanguage:
        "alon_historyverse_language",

    articlePage:
        "article.html",

    homePage:
        "index.html"

};


/* =========================================================
   GLOBAL STATE
========================================================= */

const AppState = {

    language:
        APP.defaultLanguage,

    search:
        "",

    currentPage:
        "",

    initialized:
        false

};


/* =========================================================
   DOM SHORTCUTS
========================================================= */

function $(selector) {

    return document.querySelector(
        selector
    );

}


function $all(selector) {

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    value
) {

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
   LANGUAGE STORAGE
========================================================= */

function loadLanguage() {

    try {

        const saved =
            localStorage.getItem(
                APP.storageLanguage
            );


        if (
            saved &&
            typeof saved ===
                "string"
        ) {

            AppState.language =
                saved;

        }

    } catch (error) {

        console.warn(
            "Language storage unavailable.",
            error
        );

    }

}


/* =========================================================
   SAVE LANGUAGE
========================================================= */

function saveLanguage(
    language
) {

    try {

        localStorage.setItem(
            APP.storageLanguage,
            language
        );

    } catch (error) {

        console.warn(
            "Unable to save language.",
            error
        );

    }

}


/* =========================================================
   LANGUAGE DETECTION
========================================================= */

function detectLanguage() {

    const browserLanguage =
        navigator.language ||
        "";


    if (
        browserLanguage
            .toLowerCase()
            .startsWith("hi")
    ) {

        return "hi";

    }


    return "en";

}


/* =========================================================
   INITIAL LANGUAGE
========================================================= */

function initializeLanguage() {

    try {

        const saved =
            localStorage.getItem(
                APP.storageLanguage
            );


        if (saved) {

            AppState.language =
                saved;

        } else {

            AppState.language =
                detectLanguage();

            saveLanguage(
                AppState.language
            );

        }

    } catch {

        AppState.language =
            detectLanguage();

    }


    document.documentElement
        .setAttribute(
            "lang",
            AppState.language
        );

}


/* =========================================================
   SET LANGUAGE
========================================================= */

export function setLanguage(
    language
) {

    if (
        !language
    ) {

        return;

    }


    AppState.language =
        language;


    saveLanguage(
        language
    );


    document.documentElement
        .setAttribute(
            "lang",
            language
        );


    /*
       Connect with global language
       engine if available.
    */

    if (
        window.ALON_LANGUAGE_ENGINE &&
        typeof
            window.ALON_LANGUAGE_ENGINE
                .setLanguage ===
            "function"
    ) {

        window.ALON_LANGUAGE_ENGINE
            .setLanguage(
                language
            );

    }


    updateLanguageButtons();

    renderCurrentPage();


    document.dispatchEvent(
        new CustomEvent(
            "alon:languagechange",
            {
                detail: {
                    language
                }
            }
        )
    );

}


/* =========================================================
   LANGUAGE BUTTONS
========================================================= */

function setupLanguageButtons() {

    $all(
        "[data-language]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        const language =
                            button.dataset
                                .language;


                        setLanguage(
                            language
                        );

                    }
                );

            }
        );


    $all(
        "[data-lang]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        const language =
                            button.dataset
                                .lang;


                        setLanguage(
                            language
                        );

                    }
                );

            }
        );

}


/* =========================================================
   UPDATE LANGUAGE BUTTONS
========================================================= */

function updateLanguageButtons() {

    $all(
        "[data-language]"
    )
        .forEach(
            button => {

                const active =
                    button.dataset
                        .language ===
                    AppState.language;


                button.classList.toggle(
                    "active",
                    active
                );

                button.setAttribute(
                    "aria-pressed",
                    String(
                        active
                    )
                );

            }
        );


    $all(
        "[data-lang]"
    )
        .forEach(
            button => {

                const active =
                    button.dataset
                        .lang ===
                    AppState.language;


                button.classList.toggle(
                    "active",
                    active
                );

            }
        );

}


/* =========================================================
   CURRENT PAGE
========================================================= */

function detectCurrentPage() {

    const path =
        window.location.pathname;


    const file =
        path
            .split("/")
            .pop()
            .toLowerCase();


    AppState.currentPage =
        file ||
        APP.homePage;


    if (
        AppState.currentPage ===
        ""
    ) {

        AppState.currentPage =
            APP.homePage;

    }

}


/* =========================================================
   NAVIGATION SYSTEM
========================================================= */

function setupNavigation() {

    $all(
        "[data-nav]"
    )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    event => {

                        const target =
                            element.dataset
                                .nav;


                        if (
                            !target
                        ) {

                            return;

                        }


                        event.preventDefault();


                        navigate(
                            target
                        );

                    }
                );

            }
        );


    /*
       Normal internal links are preserved.
       We only enhance links explicitly
       marked for ALON navigation.
    */

}


/* =========================================================
   NAVIGATE
========================================================= */

export function navigate(
    target
) {

    if (
        !target
    ) {

        return;

    }


    let destination =
        target;


    /*
       Support article IDs.
    */

    if (
        target.startsWith(
            "article:"
        )
    ) {

        const id =
            target.substring(
                8
            );


        destination =
            `${APP.articlePage}?id=${encodeURIComponent(
                id
            )}`;

    }


    window.location.href =
        destination;

}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

    const menuButton =
        $(
            "[data-menu-toggle]"
        ) ||
        $(
            "#menuToggle"
        );


    const menu =
        $(
            "[data-mobile-menu]"
        ) ||
        $(
            "#mobileMenu"
        );


    if (
        !menuButton ||
        !menu
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const open =
                menu.classList.toggle(
                    "open"
                );


            menuButton.classList.toggle(
                "active",
                open
            );


            menuButton.setAttribute(
                "aria-expanded",
                String(
                    open
                )
            );

        }
    );


    /*
       Close after navigation.
    */

    $all(
        "a",
        menu
    );


    menu.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    "a"
                );


            if (
                link
            ) {

                menu.classList.remove(
                    "open"
                );


                menuButton.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   SEARCH SYSTEM
========================================================= */

function setupSearch() {

    const forms =
        $all(
            "[data-search-form]"
        );


    forms.forEach(
        form => {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const input =
                        form.querySelector(
                            "input"
                        );


                    const query =
                        input
                            ? input.value.trim()
                            : "";


                    performSearch(
                        query
                    );

                }
            );

        }
    );


    $all(
        "[data-search-input]"
    )
        .forEach(
            input => {

                input.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key !==
                            "Enter"
                        ) {

                            return;

                        }


                        event.preventDefault();


                        performSearch(
                            input.value.trim()
                        );

                    }
                );

            }
        );

}


/* =========================================================
   PERFORM SEARCH
========================================================= */

export function performSearch(
    query
) {

    AppState.search =
        String(
            query || ""
        ).trim();


    const results =
        searchArticles(
            AppState.search,
            {
                publishedOnly:
                    true
            }
        );


    renderSearchResults(
        results
    );


    document.dispatchEvent(
        new CustomEvent(
            "alon:search",
            {
                detail: {
                    query:
                        AppState.search,

                    results
                }
            }
        )
    );

}


/* =========================================================
   SEARCH RESULTS
========================================================= */

function renderSearchResults(
    results
) {

    const container =
        $(
            "[data-search-results]"
        ) ||
        $(
            "#searchResults"
        );


    if (
        !container
    ) {

        /*
           If there is no search result
           area on the current page,
           go to articles page.
        */

        if (
            AppState.search
        ) {

            window.location.href =
                `articles.html?search=${encodeURIComponent(
                    AppState.search
                )}`;

        }


        return;

    }


    if (
        !results.length
    ) {

        container.innerHTML = `

            <div
                class="search-empty"
            >

                <h3>
                    ${
                        AppState.language ===
                        "hi"

                            ? "कोई परिणाम नहीं मिला"

                            : "No results found"
                    }
                </h3>

                <p>
                    ${
                        AppState.language ===
                        "hi"

                            ? "कृपया दूसरा शब्द खोजें।"

                            : "Try another search term."
                    }
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        results
            .map(
                article =>
                    createArticleCard(
                        article,
                        AppState.language
                    )
            )
            .join("");


    setupArticleCards(
        container
    );

}


/* =========================================================
   ARTICLE CARD SYSTEM
========================================================= */

function setupArticleCards(
    root = document
) {

    const cards =
        root.querySelectorAll(
            "[data-article-id]"
        );


    cards.forEach(
        card => {

            /*
               Prevent duplicate listeners.
            */

            if (
                card.dataset
                    .alonReady ===
                "true"
            ) {

                return;

            }


            card.dataset
                .alonReady =
                "true";


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
                event => {

                    /*
                       Buttons/links inside cards
                       work independently.
                    */

                    if (
                        event.target.closest(
                            "button, a"
                        )
                    ) {

                        return;

                    }


                    const id =
                        card.dataset
                            .articleId;


                    if (
                        id
                    ) {

                        openArticle(
                            id
                        );

                    }

                }
            );


            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key !==
                            "Enter" &&
                        event.key !==
                            " "
                    ) {

                        return;

                    }


                    if (
                        event.target.closest(
                            "button, a"
                        )
                    ) {

                        return;

                    }


                    event.preventDefault();


                    const id =
                        card.dataset
                            .articleId;


                    if (
                        id
                    ) {

                        openArticle(
                            id
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   OPEN ARTICLE
========================================================= */

export function openArticle(
    id
) {

    const article =
        getArticleById(
            id
        );


    if (
        !article
    ) {

        return;

    }


    window.location.href =
        `${APP.articlePage}?id=${encodeURIComponent(
            id
        )}`;

}


/* =========================================================
   HOME FEATURED ARTICLES
========================================================= */

function renderFeaturedArticles() {

    const container =
        $(
            "[data-featured-articles]"
        ) ||
        $(
            "#featuredArticles"
        );


    if (
        !container
    ) {

        return;

    }


    const articles =
        getFeaturedArticles();


    if (
        !articles.length
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML =
        articles
            .map(
                article =>
                    createArticleCard(
                        article,
                        AppState.language
                    )
            )
            .join("");


    setupArticleCards(
        container
    );

}


/* =========================================================
   LATEST ARTICLES
========================================================= */

function renderLatestArticles() {

    const container =
        $(
            "[data-latest-articles]"
        ) ||
        $(
            "#latestArticles"
        );


    if (
        !container
    ) {

        return;

    }


    const articles =
        getPublishedArticles()
            .slice(
                0,
                8
            );


    container.innerHTML =
        articles
            .map(
                article =>
                    createArticleCard(
                        article,
                        AppState.language
                    )
            )
            .join("");


    setupArticleCards(
        container
    );

}


/* =========================================================
   ALL ARTICLES
========================================================= */

function renderAllArticles() {

    const container =
        $(
            "[data-all-articles]"
        ) ||
        $(
            "#allArticles"
        );


    if (
        !container
    ) {

        return;

    }


    const articles =
        getPublishedArticles();


    container.innerHTML =
        articles
            .map(
                article =>
                    createArticleCard(
                        article,
                        AppState.language
                    )
            )
            .join("");


    setupArticleCards(
        container
    );

}


/* =========================================================
   ARTICLE DETAIL PAGE
========================================================= */

function renderArticlePage() {

    if (
        !window.location.pathname
            .toLowerCase()
            .includes(
                "article.html"
            )
    ) {

        return;

    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get(
            "id"
        );


    if (
        !id
    ) {

        return;

    }


    const article =
        getArticleById(
            id
        );


    if (
        !article
    ) {

        return;

    }


    const title =
        getArticleTitle(
            article,
            AppState.language
        );


    const description =
        getArticleDescription(
            article,
            AppState.language
        );


    const content =
        getArticleContentSafe(
            article
        );


    setContent(
        [
            "[data-article-title]",
            "#articleTitle"
        ],
        title
    );


    setContent(
        [
            "[data-article-description]",
            "#articleDescription"
        ],
        description
    );


    const contentElements =
        [
            "[data-article-content]",
            "#articleContent"
        ];


    contentElements.forEach(
        selector => {

            const element =
                $(selector);


            if (
                element
            ) {

                element.innerHTML =
                    content;

            }

        }
    );


    setContent(
        [
            "[data-article-category]",
            "#articleCategory"
        ],
        article.category
    );


    setContent(
        [
            "[data-article-author]",
            "#articleAuthor"
        ],
        article.author
    );


    const image =
        $(
            "[data-article-image]"
        ) ||
        $(
            "#articleImage"
        );


    if (
        image &&
        article.image
    ) {

        image.src =
            article.image;


        image.alt =
            title;

    }

}


/* =========================================================
   SAFE ARTICLE CONTENT
========================================================= */

function getArticleContentSafe(
    article
) {

    const content =
        article.content || {};


    return (

        content[
            AppState.language
        ] ||

        content.en ||

        content.hi ||

        ""

    );

}


/* =========================================================
   SET TEXT CONTENT
========================================================= */

function setContent(
    selectors,
    value
) {

    selectors.forEach(
        selector => {

            const element =
                $(selector);


            if (
                element
            ) {

                element.textContent =
                    value || "";

            }

        }
    );

}


/* =========================================================
   RENDER CURRENT PAGE
========================================================= */

export function renderCurrentPage() {

    renderFeaturedArticles();

    renderLatestArticles();

    renderAllArticles();

    renderArticlePage();

    /*
       Admin page is handled by
       admin.js, but language changes
       can still refresh it.
    */

    if (
        window.ALON_ADMIN_ENGINE &&
        typeof
            window.ALON_ADMIN_ENGINE
                .render ===
            "function"
    ) {

        window.ALON_ADMIN_ENGINE
            .render();

    }

}


/* =========================================================
   TRANSLATION BRIDGE
========================================================= */

function setupTranslationBridge() {

    document.addEventListener(
        "alon:languagechange",
        event => {

            const language =
                event.detail
                    ?.language;


            if (
                language
            ) {

                AppState.language =
                    language;

            }


            renderCurrentPage();

        }
    );


    document.addEventListener(
        "historyverse:languagechange",
        event => {

            const language =
                event.detail
                    ?.language;


            if (
                language
            ) {

                AppState.language =
                    language;

            }


            renderCurrentPage();

        }
    );

}


/* =========================================================
   GLOBAL SEARCH OVERLAY
========================================================= */

function setupSearchOverlay() {

    const openButtons =
        $all(
            "[data-search-open]"
        );


    const closeButtons =
        $all(
            "[data-search-close]"
        );


    const overlay =
        $(
            "[data-search-overlay]"
        ) ||
        $(
            "#searchOverlay"
        );


    if (
        !overlay
    ) {

        return;

    }


    openButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    overlay.classList.add(
                        "open"
                    );


                    overlay.setAttribute(
                        "aria-hidden",
                        "false"
                    );


                    const input =
                        overlay.querySelector(
                            "input"
                        );


                    input?.focus();

                }
            );

        }
    );


    closeButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    closeSearchOverlay(
                        overlay
                    );

                }
            );

        }
    );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                overlay
            ) {

                closeSearchOverlay(
                    overlay
                );

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeSearchOverlay(
                    overlay
                );

            }

        }
    );

}


/* =========================================================
   CLOSE SEARCH OVERLAY
========================================================= */

function closeSearchOverlay(
    overlay
) {

    if (
        !overlay
    ) {

        return;

    }


    overlay.classList.remove(
        "open"
    );


    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================================
   PAGE SCROLL SYSTEM
========================================================= */

function setupScrollSystem() {

    /*
       We intentionally do NOT create
       nested scrolling containers.

       The normal document/page remains
       the main scroll surface.
    */

    document.documentElement
        .style
        .scrollBehavior =
        "smooth";


    $all(
        "[data-scroll-top]"
    )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        window.scrollTo(
                            {
                                top:
                                    0,

                                behavior:
                                    "smooth"
                            }
                        );

                    }
                );

            }
        );

}


/* =========================================================
   BACK TO TOP VISIBILITY
========================================================= */

function setupBackToTop() {

    const button =
        $(
            "[data-back-to-top]"
        ) ||
        $(
            "#backToTop"
        );


    if (
        !button
    ) {

        return;

    }


    function update() {

        button.classList.toggle(
            "visible",
            window.scrollY >
                500
        );

    }


    window.addEventListener(
        "scroll",
        update,
        {
            passive:
                true
        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }
    );


    update();

}


/* =========================================================
   EXTERNAL LANGUAGE ENGINE BRIDGE
========================================================= */

function connectLanguageEngine() {

    if (
        window.ALON_LANGUAGE_ENGINE
    ) {

        try {

            if (
                typeof
                    window.ALON_LANGUAGE_ENGINE
                        .getLanguage ===
                "function"
            ) {

                const language =
                    window.ALON_LANGUAGE_ENGINE
                        .getLanguage();


                if (
                    language
                ) {

                    AppState.language =
                        language;

                }

            }

        } catch (error) {

            console.warn(
                "Language engine bridge error.",
                error
            );

        }

    }

}


/* =========================================================
   APP READY EVENT
========================================================= */

function dispatchReady() {

    document.dispatchEvent(
        new CustomEvent(
            "alon:ready",
            {
                detail: {

                    app:
                        APP.name,

                    version:
                        APP.version,

                    language:
                        AppState.language

                }

            }
        )
    );

}


/* =========================================================
   MAIN INITIALIZATION
========================================================= */

export function initApp() {

    if (
        AppState.initialized
    ) {

        return;

    }


    AppState.initialized =
        true;


    detectCurrentPage();

    initializeLanguage();

    loadLanguage();

    connectLanguageEngine();

    setupLanguageButtons();

    updateLanguageButtons();

    setupNavigation();

    setupMobileMenu();

    setupSearch();

    setupSearchOverlay();

    setupTranslationBridge();

    setupScrollSystem();

    setupBackToTop();

    renderCurrentPage();

    dispatchReady();

}


/* =========================================================
   GLOBAL ALON APP API
========================================================= */

window.ALON_HISTORYVERSE = {

    config:
        APP,

    state:
        AppState,

    init:
        initApp,

    setLanguage,

    navigate,

    search:
        performSearch,

    openArticle,

    render:
        renderCurrentPage

};


/* =========================================================
   AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    );

} else {

    initApp();

}


/* =========================================================
   END OF APP CONTROLLER
========================================================= */