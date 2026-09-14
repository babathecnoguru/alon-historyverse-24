/* =========================================================
   ALON HISTORYVERSE 24
   ENGINE
   File: jss/engine.js
   Creator: Baba Thecno Guru
   Version: 24.0
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       BASIC CONFIGURATION
    ====================================================== */

    const ENGINE = {
        name: "ALON HISTORYVERSE 24 ENGINE",
        version: "24.0",
        creator: "Baba Thecno Guru",
        ready: false
    };


    /* =====================================================
       SAFE DOM HELPERS
    ====================================================== */

    function $(selector, parent) {
        try {
            return (
                parent || document
            ).querySelector(selector);
        } catch (error) {
            return null;
        }
    }


    function $$(selector, parent) {
        try {
            return Array.from(
                (parent || document)
                    .querySelectorAll(selector)
            );
        } catch (error) {
            return [];
        }
    }


    function byId(id) {
        return document.getElementById(id);
    }


    /* =====================================================
       DATA ACCESS
    ====================================================== */

    function getData() {
        return window.ALON_DATA || {};
    }


    function getPaths() {
        return (
            window.ALON_PATHS ||
            getData().paths ||
            {}
        );
    }


    function getStorageKeys() {
        return (
            getData().storageKeys ||
            {}
        );
    }


    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    function getStorage(key, fallback) {
        try {
            const value =
                localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            try {
                return JSON.parse(value);
            } catch (jsonError) {
                return value;
            }

        } catch (error) {
            return fallback;
        }
    }


    function setStorage(key, value) {
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


    /* =====================================================
       SAFE HTML
    ====================================================== */

    function escapeHTML(value) {
        return String(
            value === undefined ||
            value === null
                ? ""
                : value
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       TEXT HELPERS
    ====================================================== */

    function normalizeText(value) {
        return String(
            value || ""
        )
            .trim()
            .replace(/\s+/g, " ");
    }


    function slugify(value) {
        if (
            typeof window.ALON_DATA
                ?.slugify === "function"
        ) {
            return window.ALON_DATA.slugify(
                value
            );
        }

        return normalizeText(value)
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }


    function truncate(
        value,
        length
    ) {
        const text =
            normalizeText(value);

        const limit =
            Number(length) || 160;

        if (
            text.length <= limit
        ) {
            return text;
        }

        return (
            text.substring(
                0,
                Math.max(
                    0,
                    limit - 3
                )
            ) + "..."
        );
    }


    /* =====================================================
       ID / DATE HELPERS
    ====================================================== */

    function createId(prefix) {
        const name =
            slugify(prefix || "item");

        return (
            name +
            "-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );
    }


    function formatDate(value) {
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

        try {
            return date.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );
        } catch (error) {
            return date.toDateString();
        }
    }


    function formatDateTime(value) {
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

        try {
            return date.toLocaleString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        } catch (error) {
            return date.toString();
        }
    }


    /* =====================================================
       URL HELPERS
    ====================================================== */

    function getParameter(name) {
        try {
            const params =
                new URLSearchParams(
                    window.location.search
                );

            return params.get(name);
        } catch (error) {
            return null;
        }
    }


    function getParameters() {
        const result = {};

        try {
            const params =
                new URLSearchParams(
                    window.location.search
                );

            params.forEach(
                function (value, key) {
                    result[key] = value;
                }
            );

        } catch (error) {
            return {};
        }

        return result;
    }


    function currentPage() {
        const path =
            window.location.pathname
                .split("/")
                .pop();

        return (
            path || "index.html"
        );
    }


    function buildURL(
        page,
        params
    ) {
        let url =
            page || "./index.html";

        if (
            params &&
            typeof params === "object"
        ) {
            const query =
                new URLSearchParams();

            Object.keys(params)
                .forEach(function (key) {
                    const value =
                        params[key];

                    if (
                        value !== undefined &&
                        value !== null &&
                        value !== ""
                    ) {
                        query.set(
                            key,
                            value
                        );
                    }
                });

            const queryString =
                query.toString();

            if (queryString) {
                url +=
                    "?" +
                    queryString;
            }
        }

        return url;
    }


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function go(url) {
        if (!url) {
            return false;
        }

        window.location.href = url;

        return true;
    }


    function openInNewTab(url) {
        if (!url) {
            return false;
        }

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

        return true;
    }


    function goHome() {
        const paths =
            getPaths();

        return go(
            paths.home ||
            "../index.html"
        );
    }


    function goToPage(
        page,
        params
    ) {
        return go(
            buildURL(
                page,
                params
            )
        );
    }


    /* =====================================================
       ARTICLE ENGINE
    ====================================================== */

    function getArticleKey() {
        const keys =
            getStorageKeys();

        return (
            keys.articles ||
            "alon_historyverse_articles"
        );
    }


    function getArticles() {
        const data =
            getStorage(
                getArticleKey(),
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }


    function saveArticles(
        articles
    ) {
        return setStorage(
            getArticleKey(),
            Array.isArray(articles)
                ? articles
                : []
        );
    }


    function findArticle(id) {
        if (!id) {
            return null;
        }

        const articles =
            getArticles();

        return (
            articles.find(
                function (article) {
                    return (
                        String(
                            article.id
                        ) === String(id)
                    );
                }
            ) || null
        );
    }


    function searchArticles(
        searchTerm
    ) {
        const term =
            normalizeText(
                searchTerm
            ).toLowerCase();

        const articles =
            getArticles();

        if (!term) {
            return articles;
        }

        return articles.filter(
            function (article) {
                const text = [
                    article.title,
                    article.category,
                    article.description,
                    article.content,
                    article.author,
                    article.sources
                ]
                    .map(
                        function (value) {
                            return String(
                                value || ""
                            );
                        }
                    )
                    .join(" ")
                    .toLowerCase();

                return text.includes(term);
            }
        );
    }


    function createArticle(data) {
        const article =
            data &&
            typeof data === "object"
                ? { ...data }
                : {};

        const now =
            new Date().toISOString();

        if (!article.id) {
            article.id =
                createId(
                    article.title ||
                    "article"
                );
        }

        article.title =
            normalizeText(
                article.title ||
                "Untitled Article"
            );

        article.category =
            normalizeText(
                article.category ||
                "Other"
            );

        article.description =
            normalizeText(
                article.description ||
                ""
            );

        article.content =
            String(
                article.content || ""
            );

        article.sources =
            String(
                article.sources || ""
            );

        article.createdAt =
            article.createdAt ||
            now;

        article.updatedAt =
            now;

        return article;
    }


    function addArticle(data) {
        const article =
            createArticle(data);

        const articles =
            getArticles();

        articles.unshift(
            article
        );

        return saveArticles(
            articles
        )
            ? article
            : null;
    }


    function updateArticle(
        id,
        data
    ) {
        const articles =
            getArticles();

        const index =
            articles.findIndex(
                function (article) {
                    return (
                        String(
                            article.id
                        ) === String(id)
                    );
                }
            );

        if (index === -1) {
            return null;
        }

        const updated = {
            ...articles[index],
            ...(data || {}),
            id:
                articles[index].id,
            updatedAt:
                new Date()
                    .toISOString()
        };

        articles[index] =
            updated;

        if (
            !saveArticles(
                articles
            )
        ) {
            return null;
        }

        return updated;
    }


    function deleteArticle(
        id
    ) {
        const articles =
            getArticles();

        const index =
            articles.findIndex(
                function (article) {
                    return (
                        String(
                            article.id
                        ) === String(id)
                    );
                }
            );

        if (index === -1) {
            return null;
        }

        const removed =
            articles.splice(
                index,
                1
            )[0];

        const keys =
            getStorageKeys();

        const trashKey =
            keys.articleTrash ||
            "alon_historyverse_article_trash";

        const trash =
            getStorage(
                trashKey,
                []
            );

        if (!Array.isArray(trash)) {
            return null;
        }

        removed.deletedAt =
            new Date()
                .toISOString();

        trash.unshift(
            removed
        );

        const savedArticles =
            saveArticles(
                articles
            );

        const savedTrash =
            setStorage(
                trashKey,
                trash
            );

        if (
            !savedArticles ||
            !savedTrash
        ) {
            return null;
        }

        return removed;
    }


    /* =====================================================
       GENERIC DATA SEARCH
    ====================================================== */

    function searchCollection(
        items,
        term,
        fields
    ) {
        if (!Array.isArray(items)) {
            return [];
        }

        const query =
            normalizeText(term)
                .toLowerCase();

        if (!query) {
            return items.slice();
        }

        const searchableFields =
            Array.isArray(fields) &&
            fields.length
                ? fields
                : [
                    "id",
                    "name",
                    "title",
                    "description",
                    "category",
                    "region",
                    "country",
                    "period",
                    "tags"
                ];

        return items.filter(
            function (item) {
                return searchableFields.some(
                    function (field) {
                        const value =
                            item &&
                            item[field];

                        if (
                            Array.isArray(
                                value
                            )
                        ) {
                            return value.some(
                                function (
                                    entry
                                ) {
                                    return String(
                                        entry
                                    )
                                        .toLowerCase()
                                        .includes(
                                            query
                                        );
                                }
                            );
                        }

                        return String(
                            value || ""
                        )
                            .toLowerCase()
                            .includes(
                                query
                            );
                    }
                );
            }
        );
    }


    /* =====================================================
       JSON DATA LOADER
    ====================================================== */

    async function loadJSON(
        url
    ) {
        if (!url) {
            throw new Error(
                "JSON URL is missing."
            );
        }

        const response =
            await fetch(
                url,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load JSON: " +
                response.status
            );
        }

        return await response.json();
    }


    async function loadDataFile(
        type
    ) {
        const data =
            getData();

        const paths =
            data.dataPaths ||
            {};

        const url =
            paths[type];

        if (!url) {
            throw new Error(
                "Data path not found: " +
                type
            );
        }

        return loadJSON(url);
    }


    /* =====================================================
       DATA CACHE
    ====================================================== */

    const DATA_CACHE = {};


    async function getRemoteData(
        type,
        forceReload
    ) {
        if (
            !forceReload &&
            DATA_CACHE[type]
        ) {
            return DATA_CACHE[type];
        }

        const data =
            await loadDataFile(
                type
            );

        DATA_CACHE[type] =
            data;

        return data;
    }


    function clearDataCache(
        type
    ) {
        if (type) {
            delete DATA_CACHE[type];
        } else {
            Object.keys(
                DATA_CACHE
            ).forEach(
                function (key) {
                    delete DATA_CACHE[key];
                }
            );
        }
    }


    /* =====================================================
       COUNTRY HELPERS
    ====================================================== */

    function countryURL(
        country
    ) {
        const paths =
            getPaths();

        const value =
            typeof country === "object"
                ? (
                    country.id ||
                    country.code ||
                    country.name
                )
                : country;

        return buildURL(
            paths.country ||
            "./country.html",
            {
                country:
                    slugify(value)
            }
        );
    }


    function openCountry(
        country
    ) {
        return go(
            countryURL(
                country
            )
        );
    }


    /* =====================================================
       CIVILIZATION HELPERS
    ====================================================== */

    function civilizationURL(
        civilization
    ) {
        const paths =
            getPaths();

        const value =
            typeof civilization ===
            "object"
                ? (
                    civilization.id ||
                    civilization.name
                )
                : civilization;

        return buildURL(
            paths.civilizations ||
            "./civilizations.html",
            {
                civilization:
                    slugify(value)
            }
        );
    }


    function openCivilization(
        civilization
    ) {
        return go(
            civilizationURL(
                civilization
            )
        );
    }


    /* =====================================================
       HERITAGE HELPERS
    ====================================================== */

    function heritageURL(
        heritage
    ) {
        const paths =
            getPaths();

        const value =
            typeof heritage ===
            "object"
                ? (
                    heritage.id ||
                    heritage.name
                )
                : heritage;

        return buildURL(
            paths.heritage ||
            "./heritage.html",
            {
                heritage:
                    slugify(value)
            }
        );
    }


    function openHeritage(
        heritage
    ) {
        return go(
            heritageURL(
                heritage
            )
        );
    }


    /* =====================================================
       TIMELINE HELPERS
    ====================================================== */

    function timelineURL(
        event
    ) {
        const paths =
            getPaths();

        const value =
            typeof event === "object"
                ? (
                    event.id ||
                    event.year ||
                    event.title
                )
                : event;

        return buildURL(
            paths.timeline ||
            "./timeline.html",
            {
                event:
                    slugify(value)
            }
        );
    }


    function openTimelineEvent(
        event
    ) {
        return go(
            timelineURL(
                event
            )
        );
    }


    /* =====================================================
       CLICKABLE ELEMENT ENGINE
    ====================================================== */

    function makeClickable(
        element,
        callback
    ) {
        if (
            !element ||
            typeof callback !==
                "function"
        ) {
            return;
        }

        element.style.cursor =
            "pointer";

        element.addEventListener(
            "click",
            function (event) {
                callback(
                    event,
                    element
                );
            }
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

                    callback(
                        event,
                        element
                    );
                }
            }
        );

        if (
            !element.hasAttribute(
                "tabindex"
            )
        ) {
            element.setAttribute(
                "tabindex",
                "0"
            );
        }
    }


    function initializeLinks() {
        $$(
            "[data-engine-link]"
        ).forEach(
            function (element) {
                const target =
                    element.getAttribute(
                        "data-engine-link"
                    );

                if (!target) {
                    return;
                }

                makeClickable(
                    element,
                    function () {
                        go(target);
                    }
                );
            }
        );
    }


    /* =====================================================
       DATA ATTRIBUTE NAVIGATION
    ====================================================== */

    function initializeDataNavigation() {

        $$(
            "[data-country]"
        ).forEach(
            function (element) {

                if (
                    element.hasAttribute(
                        "data-engine-bound"
                    )
                ) {
                    return;
                }

                element.setAttribute(
                    "data-engine-bound",
                    "true"
                );

                makeClickable(
                    element,
                    function () {
                        openCountry(
                            element.getAttribute(
                                "data-country"
                            )
                        );
                    }
                );
            }
        );


        $$(
            "[data-civilization]"
        ).forEach(
            function (element) {

                if (
                    element.hasAttribute(
                        "data-engine-bound"
                    )
                ) {
                    return;
                }

                element.setAttribute(
                    "data-engine-bound",
                    "true"
                );

                makeClickable(
                    element,
                    function () {
                        openCivilization(
                            element.getAttribute(
                                "data-civilization"
                            )
                        );
                    }
                );
            }
        );


        $$(
            "[data-heritage]"
        ).forEach(
            function (element) {

                if (
                    element.hasAttribute(
                        "data-engine-bound"
                    )
                ) {
                    return;
                }

                element.setAttribute(
                    "data-engine-bound",
                    "true"
                );

                makeClickable(
                    element,
                    function () {
                        openHeritage(
                            element.getAttribute(
                                "data-heritage"
                            )
                        );
                    }
                );
            }
        );


        $$(
            "[data-timeline-event]"
        ).forEach(
            function (element) {

                if (
                    element.hasAttribute(
                        "data-engine-bound"
                    )
                ) {
                    return;
                }

                element.setAttribute(
                    "data-engine-bound",
                    "true"
                );

                makeClickable(
                    element,
                    function () {
                        openTimelineEvent(
                            element.getAttribute(
                                "data-timeline-event"
                            )
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       SEARCH ENGINE
    ====================================================== */

    function initializeSearch() {

        $$(
            "[data-engine-search]"
        ).forEach(
            function (input) {

                if (
                    input.hasAttribute(
                        "data-engine-search-bound"
                    )
                ) {
                    return;
                }

                input.setAttribute(
                    "data-engine-search-bound",
                    "true"
                );

                input.addEventListener(
                    "input",
                    function () {

                        const term =
                            input.value;

                        const targetSelector =
                            input.getAttribute(
                                "data-search-target"
                            );

                        if (
                            !targetSelector
                        ) {
                            return;
                        }

                        const target =
                            $(
                                targetSelector
                            );

                        if (!target) {
                            return;
                        }

                        const cards =
                            $$(
                                "[data-search-item]",
                                target
                            );

                        cards.forEach(
                            function (
                                card
                            ) {
                                const text =
                                    normalizeText(
                                        card.textContent
                                    )
                                        .toLowerCase();

                                const query =
                                    normalizeText(
                                        term
                                    )
                                        .toLowerCase();

                                card.style.display =
                                    !query ||
                                    text.includes(
                                        query
                                    )
                                        ? ""
                                        : "none";
                            }
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       MOBILE MENU ENGINE
    ====================================================== */

    function initializeMobileMenu() {

        const button =
            byId("menuBtn");

        const menu =
            byId("mobileMenu");

        if (
            !button ||
            !menu
        ) {
            return;
        }

        if (
            button.hasAttribute(
                "data-engine-menu-bound"
            )
        ) {
            return;
        }

        button.setAttribute(
            "data-engine-menu-bound",
            "true"
        );

        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    menu.classList.toggle(
                        "open"
                    );

                menu.classList.toggle(
                    "active",
                    isOpen
                );

                button.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );
    }


    /* =====================================================
       LANGUAGE ENGINE BRIDGE
    ====================================================== */

    function getLanguage() {

        if (
            typeof window
                .ALON_DATA
                ?.getLanguage ===
            "function"
        ) {
            return window.ALON_DATA
                .getLanguage();
        }

        try {
            return (
                localStorage.getItem(
                    "alon_historyverse_language"
                ) ||
                "en"
            );
        } catch (error) {
            return "en";
        }
    }


    function setLanguage(
        language
    ) {

        if (!language) {
            return false;
        }

        if (
            typeof window
                .ALON_DATA
                ?.setLanguage ===
            "function"
        ) {
            return window.ALON_DATA
                .setLanguage(
                    language
                );
        }

        try {
            localStorage.setItem(
                "alon_historyverse_language",
                language
            );

            return true;

        } catch (error) {
            return false;
        }
    }


    function openLanguageSelector() {

        if (
            typeof window
                .openLanguageSelector ===
            "function"
        ) {
            return window
                .openLanguageSelector();
        }

        if (
            typeof window
                .ALON_LANGUAGE
                ?.openSelector ===
            "function"
        ) {
            return window.ALON_LANGUAGE
                .openSelector();
        }

        return false;
    }


    function initializeLanguageButton() {

        const button =
            byId("languageBtn");

        if (!button) {
            return;
        }

        if (
            button.hasAttribute(
                "data-engine-language-bound"
            )
        ) {
            return;
        }

        button.setAttribute(
            "data-engine-language-bound",
            "true"
        );

        button.addEventListener(
            "click",
            function () {
                openLanguageSelector();
            }
        );
    }


    /* =====================================================
       CONNECTION STATUS
    ====================================================== */

    function updateConnectionStatus() {

        const status =
            byId("ah-status");

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


    /* =====================================================
       KEYBOARD SHORTCUTS
    ====================================================== */

    function initializeKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "/" &&
                    !(
                        event.target &&
                        (
                            event.target.tagName ===
                                "INPUT" ||
                            event.target.tagName ===
                                "TEXTAREA" ||
                            event.target.isContentEditable
                        )
                    )
                ) {

                    const search =
                        $(
                            "#searchInput"
                        ) ||
                        $(
                            "#articleSearch"
                        ) ||
                        $(
                            "#countrySearch"
                        ) ||
                        $(
                            "[data-engine-search]"
                        );

                    if (search) {
                        event.preventDefault();
                        search.focus();
                    }
                }


                if (
                    event.key === "Escape"
                ) {

                    $$(
                        ".modal.open, .modal.active"
                    ).forEach(
                        function (
                            modal
                        ) {
                            modal.classList.remove(
                                "open"
                            );

                            modal.classList.remove(
                                "active"
                            );
                        }
                    );
                }
            }
        );
    }


    /* =====================================================
       EVENT LISTENERS
    ====================================================== */

    function initializeEvents() {

        window.addEventListener(
            "online",
            updateConnectionStatus
        );

        window.addEventListener(
            "offline",
            updateConnectionStatus
        );
    }


    /* =====================================================
       ENGINE INITIALIZATION
    ====================================================== */

    function initialize() {

        if (
            ENGINE.ready
        ) {
            return;
        }

        initializeLinks();

        initializeDataNavigation();

        initializeSearch();

        initializeMobileMenu();

        initializeLanguageButton();

        updateConnectionStatus();

        initializeKeyboard();

        initializeEvents();

        ENGINE.ready =
            true;

        try {
            window.dispatchEvent(
                new CustomEvent(
                    "alon:engine-ready",
                    {
                        detail: API
                    }
                )
            );
        } catch (error) {
            /* Compatibility fallback */
        }

        console.log(
            "ALON HISTORYVERSE 24 engine.js loaded successfully."
        );
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const API = {

        engine: ENGINE,

        $: $,

        $$: $$,

        byId: byId,

        getData: getData,

        getPaths: getPaths,

        getStorageKeys:
            getStorageKeys,

        getStorage:
            getStorage,

        setStorage:
            setStorage,

        removeStorage:
            removeStorage,

        escapeHTML:
            escapeHTML,

        normalizeText:
            normalizeText,

        slugify:
            slugify,

        truncate:
            truncate,

        createId:
            createId,

        formatDate:
            formatDate,

        formatDateTime:
            formatDateTime,

        getParameter:
            getParameter,

        getParameters:
            getParameters,

        currentPage:
            currentPage,

        buildURL:
            buildURL,

        go: go,

        goHome:
            goHome,

        goToPage:
            goToPage,

        openInNewTab:
            openInNewTab,

        getArticles:
            getArticles,

        saveArticles:
            saveArticles,

        findArticle:
            findArticle,

        searchArticles:
            searchArticles,

        createArticle:
            createArticle,

        addArticle:
            addArticle,

        updateArticle:
            updateArticle,

        deleteArticle:
            deleteArticle,

        searchCollection:
            searchCollection,

        loadJSON:
            loadJSON,

        loadDataFile:
            loadDataFile,

        getRemoteData:
            getRemoteData,

        clearDataCache:
            clearDataCache,

        countryURL:
            countryURL,

        openCountry:
            openCountry,

        civilizationURL:
            civilizationURL,

        openCivilization:
            openCivilization,

        heritageURL:
            heritageURL,

        openHeritage:
            openHeritage,

        timelineURL:
            timelineURL,

        openTimelineEvent:
            openTimelineEvent,

        makeClickable:
            makeClickable,

        initialize:
            initialize,

        getLanguage:
            getLanguage,

        setLanguage:
            setLanguage,

        openLanguageSelector:
            openLanguageSelector,

        updateConnectionStatus:
            updateConnectionStatus
    };


    /* =====================================================
       GLOBAL ENGINE OBJECT
    ====================================================== */

    window.ALON_ENGINE = API;


    /* =====================================================
       START
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {
        initialize();
    }

})();