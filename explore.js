/* =========================================================
   ALON HISTORYVERSE 24
   EXPLORE ENGINE
   File: jss/explore.js
   Creator: Baba Thecno Guru
   Version: 24.0
   ========================================================= */

(function () {
    "use strict";

    const CONFIG = {
        searchSelectors: [
            "#exploreSearch",
            "#discoverSearch",
            "#searchInput",
            "[data-explore-search]"
        ],

        cardSelectors: [
            "[data-explore-card]",
            "[data-discover-card]",
            ".discover-card",
            ".explore-card"
        ],

        filterSelectors: [
            "[data-explore-filter]",
            "[data-category-filter]"
        ]
    };


    /* =====================================================
       BASIC HELPERS
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


    function text(value) {
        return String(
            value || ""
        )
            .trim()
            .replace(/\s+/g, " ");
    }


    function lower(value) {
        return text(value).toLowerCase();
    }


    function escapeHTML(value) {
        if (
            window.ALON_CORE &&
            typeof window.ALON_CORE
                .escapeHTML === "function"
        ) {
            return window.ALON_CORE
                .escapeHTML(value);
        }

        if (
            window.ALON_ENGINE &&
            typeof window.ALON_ENGINE
                .escapeHTML === "function"
        ) {
            return window.ALON_ENGINE
                .escapeHTML(value);
        }

        return String(
            value === null ||
            value === undefined
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
       PATH CONFIGURATION
    ====================================================== */

    function getPaths() {
        if (
            window.ALON_DATA &&
            window.ALON_DATA.paths
        ) {
            return window.ALON_DATA.paths;
        }

        if (
            window.ALON_PATHS
        ) {
            return window.ALON_PATHS;
        }

        return {
            home: "../index.html",
            discover: "./discover.html",
            categories: "./categories.html",
            gallery: "./gallery.html",
            articles: "./articles.html",
            library: "./library.html",
            countries: "./countries.html",
            civilizations:
                "./civilizations.html",
            heritage: "./heritage.html",
            timeline: "./timeline.html"
        };
    }


    function go(url) {
        if (!url) {
            return false;
        }

        window.location.href = url;

        return true;
    }


    /* =====================================================
       EXPLORE DATABASE
    ====================================================== */

    const EXPLORE_DATA = [

        {
            id: "history",
            title: "History",
            icon: "🏛️",
            category: "history",
            description:
                "Explore ancient, medieval, early modern and modern history.",
            path: "./civilizations.html",
            keywords:
                "history ancient medieval modern historical past events"
        },

        {
            id: "civilizations",
            title: "Civilizations",
            icon: "🌍",
            category: "civilizations",
            description:
                "Discover the world's great civilizations, empires and cultures.",
            path: "./civilizations.html",
            keywords:
                "civilization empire ancient egypt mesopotamia rome greece maya inca"
        },

        {
            id: "countries",
            title: "Countries of the World",
            icon: "🗺️",
            category: "countries",
            description:
                "Explore countries, capitals, regions, cities and historical backgrounds.",
            path: "./countries.html",
            keywords:
                "countries world india usa france china japan australia europe asia"
        },

        {
            id: "heritage",
            title: "Heritage & Culture",
            icon: "🏰",
            category: "heritage",
            description:
                "Discover monuments, historic places, traditions and cultural heritage.",
            path: "./heritage.html",
            keywords:
                "heritage culture monument fort temple architecture tradition"
        },

        {
            id: "timeline",
            title: "Historical Timeline",
            icon: "⏳",
            category: "timeline",
            description:
                "Travel through important events from ancient history to the digital era.",
            path: "./timeline.html",
            keywords:
                "timeline events years bce ce ancient modern world history"
        },

        {
            id: "library",
            title: "Knowledge Library",
            icon: "📚",
            category: "library",
            description:
                "Explore departments, subjects, books and educational knowledge.",
            path: "./library.html",
            keywords:
                "library books department subject education knowledge study"
        },

        {
            id: "articles",
            title: "History Articles",
            icon: "📝",
            category: "articles",
            description:
                "Read historical articles and discover new knowledge.",
            path: "./articles.html",
            keywords:
                "articles history writing knowledge biography educational"
        },

        {
            id: "gallery",
            title: "History Gallery",
            icon: "🖼️",
            category: "gallery",
            description:
                "Explore historical images and video content.",
            path: "./gallery.html",
            keywords:
                "gallery images pictures videos history heritage photos"
        },

        {
            id: "mathematics",
            title: "Mathematics",
            icon: "➗",
            category: "education",
            description:
                "Learn mathematics from fundamentals to advanced concepts.",
            path: "./mathematics.html",
            keywords:
                "math mathematics numbers algebra geometry calculation education"
        },

        {
            id: "computer",
            title: "Computer & Technology",
            icon: "💻",
            category: "technology",
            description:
                "Learn computer basics, software, hardware, internet and technology.",
            path: "./computer.html",
            keywords:
                "computer technology hardware software internet windows keyboard mouse"
        },

        {
            id: "jobs",
            title: "Jobs & Careers",
            icon: "💼",
            category: "careers",
            description:
                "Explore career knowledge, job skills and professional development.",
            path: "./jobs.html",
            keywords:
                "jobs careers employment skills profession work"
        },

        {
            id: "trees",
            title: "Trees & Nature",
            icon: "🌳",
            category: "nature",
            description:
                "Explore trees, plants, nature and environmental knowledge.",
            path: "./trees.html",
            keywords:
                "trees nature plants environment forest ecology"
        }
    ];


    /* =====================================================
       POPULAR TOPICS
    ====================================================== */

    const POPULAR_TOPICS = [

        {
            id: "ancient-egypt",
            title: "Ancient Egypt",
            icon: "𓂀",
            search:
                "ancient egypt"
        },

        {
            id: "indus-valley",
            title: "Indus Valley Civilization",
            icon: "🏺",
            search:
                "indus valley civilization"
        },

        {
            id: "ancient-greece",
            title: "Ancient Greece",
            icon: "🏛️",
            search:
                "ancient greece"
        },

        {
            id: "roman-civilization",
            title: "Roman Civilization",
            icon: "🦅",
            search:
                "roman civilization"
        },

        {
            id: "great-wall",
            title: "Great Wall of China",
            icon: "🧱",
            search:
                "great wall china"
        },

        {
            id: "taj-mahal",
            title: "Taj Mahal",
            icon: "🕌",
            search:
                "taj mahal"
        },

        {
            id: "world-war",
            title: "World Wars",
            icon: "⚔️",
            search:
                "world wars"
        },

        {
            id: "renaissance",
            title: "Renaissance",
            icon: "🎨",
            search:
                "renaissance"
        }
    ];


    /* =====================================================
       GET SEARCH INPUT
    ====================================================== */

    function getSearchInput() {

        for (
            let i = 0;
            i < CONFIG.searchSelectors.length;
            i++
        ) {
            const element =
                $(
                    CONFIG.searchSelectors[i]
                );

            if (element) {
                return element;
            }
        }

        return null;
    }


    /* =====================================================
       GET EXPLORE CARDS
    ====================================================== */

    function getCards() {

        let cards = [];

        CONFIG.cardSelectors
            .forEach(
                function (selector) {

                    $$(selector)
                        .forEach(
                            function (card) {

                                if (
                                    !cards.includes(
                                        card
                                    )
                                ) {
                                    cards.push(
                                        card
                                    );
                                }
                            }
                        );
                }
            );

        return cards;
    }


    /* =====================================================
       CARD SEARCH
    ====================================================== */

    function searchCards(
        query
    ) {

        const cards =
            getCards();

        const value =
            lower(query);

        let visible =
            0;

        cards.forEach(
            function (card) {

                const searchable =
                    lower(
                        [
                            card.textContent,
                            card.getAttribute(
                                "data-search"
                            ),
                            card.getAttribute(
                                "data-keywords"
                            ),
                            card.getAttribute(
                                "data-category"
                            )
                        ]
                            .filter(Boolean)
                            .join(" ")
                    );

                const match =
                    !value ||
                    searchable.includes(
                        value
                    );

                card.style.display =
                    match ? "" : "none";

                if (match) {
                    visible++;
                }
            }
        );

        updateSearchMessage(
            value,
            visible
        );

        return visible;
    }


    /* =====================================================
       SEARCH MESSAGE
    ====================================================== */

    function updateSearchMessage(
        query,
        visible
    ) {

        const message =
            $(
                "#exploreSearchMessage"
            ) ||
            $(
                "#discoverSearchMessage"
            );

        if (!message) {
            return;
        }

        if (!query) {
            message.textContent = "";
            return;
        }

        if (visible === 0) {
            message.textContent =
                "No matching topics found.";
        } else {
            message.textContent =
                visible +
                " topic" +
                (
                    visible === 1
                        ? ""
                        : "s"
                ) +
                " found.";
        }
    }


    /* =====================================================
       CATEGORY FILTER
    ====================================================== */

    function filterCategory(
        category
    ) {

        const value =
            lower(category);

        const cards =
            getCards();

        cards.forEach(
            function (card) {

                if (
                    !value ||
                    value === "all"
                ) {
                    card.style.display =
                        "";
                    return;
                }

                const cardCategory =
                    lower(
                        card.getAttribute(
                            "data-category"
                        ) ||
                        card.getAttribute(
                            "data-explore-category"
                        )
                    );

                const cardText =
                    lower(
                        card.textContent
                    );

                const match =
                    cardCategory ===
                        value ||
                    cardText.includes(
                        value
                    );

                card.style.display =
                    match ? "" : "none";
            }
        );

        updateFilterButtons(
            category
        );
    }


    function updateFilterButtons(
        active
    ) {

        CONFIG.filterSelectors
            .forEach(
                function (selector) {

                    $$(selector)
                        .forEach(
                            function (
                                button
                            ) {

                                const value =
                                    lower(
                                        button.getAttribute(
                                            "data-explore-filter"
                                        ) ||
                                        button.getAttribute(
                                            "data-category-filter"
                                        )
                                    );

                                const isActive =
                                    value ===
                                    lower(
                                        active
                                    );

                                button.classList.toggle(
                                    "active",
                                    isActive
                                );

                                button.setAttribute(
                                    "aria-pressed",
                                    String(
                                        isActive
                                    )
                                );
                            }
                        );
                }
            );
    }


    /* =====================================================
       SEARCH + FILTER COMBINATION
    ====================================================== */

    let activeFilter =
        "all";


    function applyFilters() {

        const input =
            getSearchInput();

        const query =
            input
                ? lower(input.value)
                : "";

        const cards =
            getCards();

        let visible = 0;

        cards.forEach(
            function (card) {

                const category =
                    lower(
                        card.getAttribute(
                            "data-category"
                        ) ||
                        card.getAttribute(
                            "data-explore-category"
                        )
                    );

                const content =
                    lower(
                        [
                            card.textContent,
                            card.getAttribute(
                                "data-search"
                            ),
                            card.getAttribute(
                                "data-keywords"
                            )
                        ]
                            .filter(Boolean)
                            .join(" ")
                    );

                const categoryMatch =
                    !activeFilter ||
                    activeFilter === "all" ||
                    category ===
                        activeFilter;

                const searchMatch =
                    !query ||
                    content.includes(
                        query
                    );

                const match =
                    categoryMatch &&
                    searchMatch;

                card.style.display =
                    match ? "" : "none";

                if (match) {
                    visible++;
                }
            }
        );

        updateSearchMessage(
            query,
            visible
        );
    }


    /* =====================================================
       NAVIGATION FROM EXPLORE DATA
    ====================================================== */

    function navigateItem(
        item
    ) {

        if (!item) {
            return false;
        }

        if (
            item.path
        ) {
            return go(
                item.path
            );
        }

        return false;
    }


    /* =====================================================
       INITIALIZE EXISTING CARDS
    ====================================================== */

    function initializeExistingCards() {

        const cards =
            getCards();

        cards.forEach(
            function (card) {

                if (
                    card.hasAttribute(
                        "data-explore-bound"
                    )
                ) {
                    return;
                }

                card.setAttribute(
                    "data-explore-bound",
                    "true"
                );

                const href =
                    card.getAttribute(
                        "href"
                    );

                const dataPath =
                    card.getAttribute(
                        "data-path"
                    );

                const path =
                    dataPath ||
                    href;

                if (!path) {
                    return;
                }

                card.style.cursor =
                    "pointer";

                card.addEventListener(
                    "click",
                    function (event) {

                        const target =
                            event.target;

                        if (
                            target &&
                            target.closest &&
                            target.closest(
                                "a,button,input,select,textarea"
                            )
                        ) {
                            return;
                        }

                        go(path);
                    }
                );
            }
        );
    }


    /* =====================================================
       INITIALIZE SEARCH
    ====================================================== */

    function initializeSearch() {

        const input =
            getSearchInput();

        if (!input) {
            return;
        }

        if (
            input.hasAttribute(
                "data-explore-search-bound"
            )
        ) {
            return;
        }

        input.setAttribute(
            "data-explore-search-bound",
            "true"
        );

        input.addEventListener(
            "input",
            function () {
                applyFilters();
            }
        );


        input.addEventListener(
            "search",
            function () {
                applyFilters();
            }
        );
    }


    /* =====================================================
       INITIALIZE FILTER BUTTONS
    ====================================================== */

    function initializeFilters() {

        CONFIG.filterSelectors
            .forEach(
                function (selector) {

                    $$(selector)
                        .forEach(
                            function (
                                button
                            ) {

                                if (
                                    button.hasAttribute(
                                        "data-explore-filter-bound"
                                    )
                                ) {
                                    return;
                                }

                                button.setAttribute(
                                    "data-explore-filter-bound",
                                    "true"
                                );

                                button.addEventListener(
                                    "click",
                                    function () {

                                        activeFilter =
                                            lower(
                                                button.getAttribute(
                                                    "data-explore-filter"
                                                ) ||
                                                button.getAttribute(
                                                    "data-category-filter"
                                                ) ||
                                                "all"
                                            );

                                        applyFilters();

                                        updateFilterButtons(
                                            activeFilter
                                        );
                                    }
                                );
                            }
                        );
                }
            );
    }


    /* =====================================================
       TOPIC SEARCH
    ====================================================== */

    function searchTopic(
        query
    ) {

        const input =
            getSearchInput();

        if (!input) {
            return false;
        }

        input.value =
            query || "";

        applyFilters();

        input.focus();

        try {
            input.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "center"
                }
            );
        } catch (error) {
            /* Older browser */
        }

        return true;
    }


    /* =====================================================
       INITIALIZE POPULAR TOPICS
    ====================================================== */

    function initializePopularTopics() {

        $$(
            "[data-popular-topic]"
        ).forEach(
            function (element) {

                if (
                    element.hasAttribute(
                        "data-explore-topic-bound"
                    )
                ) {
                    return;
                }

                element.setAttribute(
                    "data-explore-topic-bound",
                    "true"
                );

                element.addEventListener(
                    "click",
                    function () {

                        const query =
                            element.getAttribute(
                                "data-popular-topic"
                            ) ||
                            element.textContent;

                        searchTopic(
                            query
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       DYNAMIC EXPLORE CARDS
       Only used when a target container exists.
    ====================================================== */

    function renderExploreCards(
        container
    ) {

        if (!container) {
            return;
        }

        const data =
            EXPLORE_DATA;

        container.innerHTML =
            data.map(
                function (item) {

                    return `
                        <article
                            class="explore-card discover-card"
                            data-explore-card
                            data-search="${escapeHTML(
                                item.title +
                                " " +
                                item.description +
                                " " +
                                item.keywords
                            )}"
                            data-keywords="${escapeHTML(
                                item.keywords
                            )}"
                            data-category="${escapeHTML(
                                item.category
                            )}"
                            tabindex="0"
                            role="link"
                            aria-label="${escapeHTML(
                                item.title
                            )}"
                            data-path="${escapeHTML(
                                item.path
                            )}"
                        >
                            <div class="explore-card-icon">
                                ${escapeHTML(
                                    item.icon
                                )}
                            </div>

                            <h3>
                                ${escapeHTML(
                                    item.title
                                )}
                            </h3>

                            <p>
                                ${escapeHTML(
                                    item.description
                                )}
                            </p>

                            <span class="explore-card-link">
                                Explore →
                            </span>
                        </article>
                    `;
                }
            )
                .join("");

        initializeExistingCards();
    }


    /* =====================================================
       DYNAMIC POPULAR TOPICS
    ====================================================== */

    function renderPopularTopics(
        container
    ) {

        if (!container) {
            return;
        }

        container.innerHTML =
            POPULAR_TOPICS.map(
                function (topic) {

                    return `
                        <button
                            type="button"
                            class="popular-topic"
                            data-popular-topic="${escapeHTML(
                                topic.search
                            )}"
                            aria-label="${escapeHTML(
                                topic.title
                            )}"
                        >
                            <span>
                                ${escapeHTML(
                                    topic.icon
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    topic.title
                                )}
                            </span>
                        </button>
                    `;
                }
            )
                .join("");

        initializePopularTopics();
    }


    /* =====================================================
       PAGE DETECTION
    ====================================================== */

    function isExplorePage() {

        const page =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        return (
            page ===
                "discover.html" ||
            page ===
                "categories.html" ||
            page ===
                "explore.html"
        );
    }


    /* =====================================================
       MAIN INITIALIZATION
    ====================================================== */

    function initialize() {

        if (
            !isExplorePage()
        ) {
            return;
        }

        initializeSearch();

        initializeFilters();

        initializeExistingCards();

        initializePopularTopics();


        const dynamicContainer =
            $(
                "#exploreCards"
            ) ||
            $(
                "#discoverCards"
            );

        if (
            dynamicContainer &&
            dynamicContainer.hasAttribute(
                "data-render-explore"
            )
        ) {
            renderExploreCards(
                dynamicContainer
            );
        }


        const topicContainer =
            $(
                "#popularTopics"
            );

        if (
            topicContainer &&
            topicContainer.hasAttribute(
                "data-render-popular-topics"
            )
        ) {
            renderPopularTopics(
                topicContainer
            );
        }


        const initialSearch =
            getSearchInput();

        if (
            initialSearch &&
            initialSearch.value
        ) {
            applyFilters();
        }


        window.dispatchEvent(
            new CustomEvent(
                "alon:explore-ready",
                {
                    detail: API
                }
            )
        );

        console.log(
            "ALON HISTORYVERSE 24 explore.js loaded successfully."
        );
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const API = {

        config: CONFIG,

        data: EXPLORE_DATA,

        popularTopics:
            POPULAR_TOPICS,

        getSearchInput:
            getSearchInput,

        getCards:
            getCards,

        searchCards:
            searchCards,

        filterCategory:
            filterCategory,

        applyFilters:
            applyFilters,

        searchTopic:
            searchTopic,

        navigateItem:
            navigateItem,

        renderExploreCards:
            renderExploreCards,

        renderPopularTopics:
            renderPopularTopics,

        initialize:
            initialize
    };


    window.ALON_EXPLORE =
        API;


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