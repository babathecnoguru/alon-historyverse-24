/* =========================================================
   ALON HISTORYVERSE 24
   DATA ENGINE
   File: jss/data.js
   Creator: Baba Thecno Guru
   Version: 24.0
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       PROJECT CONFIGURATION
    ====================================================== */

    const PROJECT = {
        name: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0",
        description:
            "History, civilizations, countries, culture, heritage and knowledge.",
        theme: {
            background: "#05080f",
            gold: "#d7b35a",
            goldLight: "#f0d27a"
        }
    };


    /* =====================================================
       STORAGE KEYS
    ====================================================== */

    const STORAGE_KEYS = {
        language: "alon_historyverse_language",

        articles: "alon_historyverse_articles",
        articleDrafts: "alon_historyverse_article_drafts",
        articleTrash: "alon_historyverse_article_trash",

        contactDraft: "alon_historyverse_contact_draft",
        contactMessages: "alon_historyverse_contact_messages",

        contributionDraft: "alon_historyverse_contribution_draft",
        pendingContribution:
            "alon_historyverse_pending_contribution",

        loggedIn: "alon_historyverse_logged_in",
        adminLoggedIn: "alon_historyverse_admin_logged_in"
    };


    /* =====================================================
       SITE PATHS
       These paths are for pages inside /html/
    ====================================================== */

    const PATHS = {
        home: "../index.html",

        discover: "./discover.html",
        categories: "./categories.html",
        gallery: "./gallery.html",

        articles: "./articles.html",
        article: "./article.html",
        contribute: "./contribute.html",

        library: "./library.html",
        department: "./department.html",
        subject: "./subject.html",
        book: "./book.html",
        read: "./read.html",

        civilizations: "./civilizations.html",
        heritage: "./heritage.html",
        timeline: "./timeline.html",

        countries: "./countries.html",
        country: "./country.html",

        mathematics: "./mathematics.html",
        computer: "./computer.html",
        jobs: "./jobs.html",
        trees: "./trees.html",

        about: "./about.html",
        contact: "./contact.html",
        guidelines: "./guidelines.html",
        contributorAgreement:
            "./contributor-agreement.html",

        copyright: "./copyright.html",
        privacy: "./privacy.html",
        privacyPolicy: "./privacy-policy.html",
        terms: "./terms.html",

        login: "./login.html",

        admin: "./admin.html",
        adminArticles: "./admin-articles.html"
    };


    /* =====================================================
       JSON DATA PATHS
    ====================================================== */

    const DATA_PATHS = {
        library: "../json/library.json",
        countries: "../json/countries.json",
        civilizations: "../json/civilizations.json",
        heritage: "../json/heritage.json",
        timeline: "../json/timeline.json"
    };


    /* =====================================================
       MAIN NAVIGATION
    ====================================================== */

    const NAVIGATION = [
        {
            id: "explore",
            title: "Explore",
            path: PATHS.discover
        },
        {
            id: "library",
            title: "Library",
            path: PATHS.library
        },
        {
            id: "history",
            title: "History",
            path: PATHS.civilizations
        },
        {
            id: "countries",
            title: "Countries",
            path: PATHS.countries
        },
        {
            id: "heritage",
            title: "Heritage",
            path: PATHS.heritage
        },
        {
            id: "timeline",
            title: "Timeline",
            path: PATHS.timeline
        },
        {
            id: "articles",
            title: "Articles",
            path: PATHS.articles
        },
        {
            id: "about",
            title: "About",
            path: PATHS.about
        }
    ];


    /* =====================================================
       EXPLORE CATEGORIES
    ====================================================== */

    const CATEGORIES = [
        {
            id: "history",
            title: "History",
            icon: "🏛️",
            description:
                "Explore ancient, medieval and modern history.",
            path: PATHS.civilizations
        },
        {
            id: "civilizations",
            title: "Civilizations",
            icon: "🌍",
            description:
                "Discover great civilizations of the world.",
            path: PATHS.civilizations
        },
        {
            id: "countries",
            title: "Countries",
            icon: "🗺️",
            description:
                "Explore countries, regions, cities and history.",
            path: PATHS.countries
        },
        {
            id: "heritage",
            title: "Heritage",
            icon: "🏰",
            description:
                "Discover historic monuments and heritage sites.",
            path: PATHS.heritage
        },
        {
            id: "timeline",
            title: "Timeline",
            icon: "⏳",
            description:
                "Travel through important historical events.",
            path: PATHS.timeline
        },
        {
            id: "library",
            title: "Knowledge Library",
            icon: "📚",
            description:
                "Learn through departments, subjects and books.",
            path: PATHS.library
        },
        {
            id: "culture",
            title: "Culture",
            icon: "🎭",
            description:
                "Explore cultures, traditions and heritage.",
            path: PATHS.heritage
        },
        {
            id: "articles",
            title: "Articles",
            icon: "📝",
            description:
                "Read and create historical knowledge articles.",
            path: PATHS.articles
        }
    ];


    /* =====================================================
       LIBRARY DEPARTMENTS
    ====================================================== */

    const DEPARTMENTS = [
        {
            id: "history-civilizations",
            title: "History & Civilizations",
            icon: "🏛️",
            path:
                PATHS.civilizations
        },
        {
            id: "countries-world",
            title: "Countries & World",
            icon: "🌎",
            path:
                PATHS.countries
        },
        {
            id: "culture-heritage",
            title: "Culture & Heritage",
            icon: "🏰",
            path:
                PATHS.heritage
        },
        {
            id: "mathematics",
            title: "Mathematics",
            icon: "➗",
            path:
                PATHS.mathematics
        },
        {
            id: "computer",
            title: "Computer & Technology",
            icon: "💻",
            path:
                PATHS.computer
        },
        {
            id: "jobs",
            title: "Jobs & Careers",
            icon: "💼",
            path:
                PATHS.jobs
        },
        {
            id: "trees",
            title: "Trees & Nature",
            icon: "🌳",
            path:
                PATHS.trees
        },
        {
            id: "timeline",
            title: "Historical Timeline",
            icon: "⏳",
            path:
                PATHS.timeline
        }
    ];


    /* =====================================================
       HISTORY PERIODS
    ====================================================== */

    const PERIODS = [
        {
            id: "prehistoric",
            title: "Prehistoric Era",
            description:
                "Human history before written records."
        },
        {
            id: "ancient",
            title: "Ancient History",
            description:
                "Early civilizations, kingdoms and empires."
        },
        {
            id: "classical",
            title: "Classical Era",
            description:
                "Greece, Rome and other classical civilizations."
        },
        {
            id: "medieval",
            title: "Medieval History",
            description:
                "Kingdoms, empires, cultures and major transformations."
        },
        {
            id: "early-modern",
            title: "Early Modern Era",
            description:
                "Renaissance, exploration and major global changes."
        },
        {
            id: "modern",
            title: "Modern History",
            description:
                "Industrialization, world wars and modern nations."
        },
        {
            id: "contemporary",
            title: "Contemporary Era",
            description:
                "Recent global history and the digital age."
        }
    ];


    /* =====================================================
       ARTICLE CATEGORIES
    ====================================================== */

    const ARTICLE_CATEGORIES = [
        "History",
        "Civilization",
        "Country",
        "Heritage",
        "Culture",
        "Timeline",
        "Biography",
        "Educational",
        "Other"
    ];


    /* =====================================================
       CONTENT TYPES
    ====================================================== */

    const CONTENT_TYPES = [
        {
            id: "article",
            title: "Article"
        },
        {
            id: "country",
            title: "Country"
        },
        {
            id: "civilization",
            title: "Civilization"
        },
        {
            id: "heritage",
            title: "Heritage"
        },
        {
            id: "timeline",
            title: "Timeline Event"
        },
        {
            id: "book",
            title: "Book"
        },
        {
            id: "subject",
            title: "Subject"
        }
    ];


    /* =====================================================
       COMMON COUNTRIES
    ====================================================== */

    const FEATURED_COUNTRIES = [
        {
            id: "india",
            name: "India",
            flag: "🇮🇳",
            continent: "Asia"
        },
        {
            id: "united-states",
            name: "United States",
            flag: "🇺🇸",
            continent: "North America"
        },
        {
            id: "united-kingdom",
            name: "United Kingdom",
            flag: "🇬🇧",
            continent: "Europe"
        },
        {
            id: "france",
            name: "France",
            flag: "🇫🇷",
            continent: "Europe"
        },
        {
            id: "germany",
            name: "Germany",
            flag: "🇩🇪",
            continent: "Europe"
        },
        {
            id: "italy",
            name: "Italy",
            flag: "🇮🇹",
            continent: "Europe"
        },
        {
            id: "spain",
            name: "Spain",
            flag: "🇪🇸",
            continent: "Europe"
        },
        {
            id: "china",
            name: "China",
            flag: "🇨🇳",
            continent: "Asia"
        },
        {
            id: "japan",
            name: "Japan",
            flag: "🇯🇵",
            continent: "Asia"
        },
        {
            id: "australia",
            name: "Australia",
            flag: "🇦🇺",
            continent: "Oceania"
        }
    ];


    /* =====================================================
       FEATURED CIVILIZATIONS
    ====================================================== */

    const FEATURED_CIVILIZATIONS = [
        {
            id: "mesopotamian",
            name: "Mesopotamian Civilizations",
            region: "Middle East",
            period: "Ancient"
        },
        {
            id: "ancient-egypt",
            name: "Ancient Egypt",
            region: "Africa",
            period: "Ancient"
        },
        {
            id: "indus-valley",
            name: "Indus Valley Civilization",
            region: "Asia",
            period: "Ancient"
        },
        {
            id: "ancient-china",
            name: "Ancient Chinese Civilizations",
            region: "Asia",
            period: "Ancient"
        },
        {
            id: "ancient-greece",
            name: "Ancient Greece",
            region: "Europe",
            period: "Classical"
        },
        {
            id: "roman",
            name: "Roman Civilization",
            region: "Europe",
            period: "Classical"
        },
        {
            id: "maya",
            name: "Maya Civilization",
            region: "Americas",
            period: "Pre-Columbian"
        },
        {
            id: "inca",
            name: "Inca Civilization",
            region: "Americas",
            period: "Pre-Columbian"
        },
        {
            id: "persian",
            name: "Persian Empires",
            region: "Middle East",
            period: "Ancient"
        },
        {
            id: "aztec",
            name: "Aztec Civilization",
            region: "Americas",
            period: "Pre-Columbian"
        }
    ];


    /* =====================================================
       HERITAGE CATEGORIES
    ====================================================== */

    const HERITAGE_CATEGORIES = [
        "Monument",
        "Fort",
        "Temple",
        "Historic City",
        "Archaeological Site",
        "Cultural Landscape",
        "Natural Heritage",
        "Religious Site",
        "Historic Structure"
    ];


    /* =====================================================
       SEARCH CONFIGURATION
    ====================================================== */

    const SEARCH_CONFIG = {
        minimumCharacters: 2,
        maximumResults: 50,

        searchableFields: [
            "title",
            "name",
            "description",
            "category",
            "country",
            "region",
            "period",
            "tags"
        ]
    };


    /* =====================================================
       DEFAULT APP SETTINGS
    ====================================================== */

    const DEFAULT_SETTINGS = {
        language: "en",
        theme: "dark",
        articlesPerPage: 12,
        enableSearch: true,
        enableAnimations: true
    };


    /* =====================================================
       UTILITY FUNCTIONS
    ====================================================== */

    function slugify(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }


    function getStorage(key, fallback) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }


    function setStorage(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

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


    function getLanguage() {
        try {
            return (
                localStorage.getItem(
                    STORAGE_KEYS.language
                ) || DEFAULT_SETTINGS.language
            );
        } catch (error) {
            return DEFAULT_SETTINGS.language;
        }
    }


    function setLanguage(language) {
        if (!language) {
            return false;
        }

        try {
            localStorage.setItem(
                STORAGE_KEYS.language,
                language
            );

            return true;
        } catch (error) {
            return false;
        }
    }


    function getArticles() {
        return getStorage(
            STORAGE_KEYS.articles,
            []
        );
    }


    function saveArticles(articles) {
        return setStorage(
            STORAGE_KEYS.articles,
            Array.isArray(articles)
                ? articles
                : []
        );
    }


    function getArticleDrafts() {
        return getStorage(
            STORAGE_KEYS.articleDrafts,
            []
        );
    }


    function getArticleTrash() {
        return getStorage(
            STORAGE_KEYS.articleTrash,
            []
        );
    }


    /* =====================================================
       ARTICLE ID GENERATOR
    ====================================================== */

    function createArticleId(title) {
        const slug = slugify(title);

        const timestamp = Date.now();

        if (slug) {
            return (
                slug +
                "-" +
                timestamp
            );
        }

        return (
            "article-" +
            timestamp
        );
    }


    /* =====================================================
       GENERIC DATA FILTER
    ====================================================== */

    function filterData(
        items,
        searchTerm,
        fields
    ) {
        if (!Array.isArray(items)) {
            return [];
        }

        const term = String(
            searchTerm || ""
        )
            .trim()
            .toLowerCase();

        if (!term) {
            return items.slice();
        }

        const searchableFields =
            Array.isArray(fields) && fields.length
                ? fields
                : SEARCH_CONFIG.searchableFields;

        return items.filter(function (item) {
            return searchableFields.some(
                function (field) {
                    const value =
                        item &&
                        item[field];

                    if (
                        Array.isArray(value)
                    ) {
                        return value.some(
                            function (entry) {
                                return String(
                                    entry
                                )
                                    .toLowerCase()
                                    .includes(
                                        term
                                    );
                            }
                        );
                    }

                    return String(
                        value || ""
                    )
                        .toLowerCase()
                        .includes(term);
                }
            );
        });
    }


    /* =====================================================
       CATEGORY LOOKUP
    ====================================================== */

    function getCategoryById(id) {
        return (
            CATEGORIES.find(
                function (category) {
                    return category.id === id;
                }
            ) || null
        );
    }


    function getDepartmentById(id) {
        return (
            DEPARTMENTS.find(
                function (department) {
                    return department.id === id;
                }
            ) || null
        );
    }


    function getCountryById(id) {
        return (
            FEATURED_COUNTRIES.find(
                function (country) {
                    return country.id === id;
                }
            ) || null
        );
    }


    function getCivilizationById(id) {
        return (
            FEATURED_CIVILIZATIONS.find(
                function (civilization) {
                    return (
                        civilization.id === id
                    );
                }
            ) || null
        );
    }


    /* =====================================================
       EXPORT GLOBAL DATA OBJECT
    ====================================================== */

    const ALON_DATA = {

        project: PROJECT,

        storageKeys: STORAGE_KEYS,

        paths: PATHS,

        dataPaths: DATA_PATHS,

        navigation: NAVIGATION,

        categories: CATEGORIES,

        departments: DEPARTMENTS,

        periods: PERIODS,

        articleCategories:
            ARTICLE_CATEGORIES,

        contentTypes: CONTENT_TYPES,

        featuredCountries:
            FEATURED_COUNTRIES,

        featuredCivilizations:
            FEATURED_CIVILIZATIONS,

        heritageCategories:
            HERITAGE_CATEGORIES,

        searchConfig:
            SEARCH_CONFIG,

        defaultSettings:
            DEFAULT_SETTINGS,

        slugify: slugify,

        getStorage: getStorage,

        setStorage: setStorage,

        removeStorage:
            removeStorage,

        getLanguage:
            getLanguage,

        setLanguage:
            setLanguage,

        getArticles:
            getArticles,

        saveArticles:
            saveArticles,

        getArticleDrafts:
            getArticleDrafts,

        getArticleTrash:
            getArticleTrash,

        createArticleId:
            createArticleId,

        filterData:
            filterData,

        getCategoryById:
            getCategoryById,

        getDepartmentById:
            getDepartmentById,

        getCountryById:
            getCountryById,

        getCivilizationById:
            getCivilizationById
    };


    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_DATA = ALON_DATA;

    /*
       Individual globals are also exposed for
       compatibility with older project scripts.
    */

    window.ALON_PROJECT = PROJECT;
    window.ALON_PATHS = PATHS;
    window.ALON_DATA_PATHS = DATA_PATHS;
    window.ALON_NAVIGATION = NAVIGATION;
    window.ALON_CATEGORIES = CATEGORIES;
    window.ALON_DEPARTMENTS = DEPARTMENTS;
    window.ALON_PERIODS = PERIODS;
    window.ALON_ARTICLE_CATEGORIES =
        ARTICLE_CATEGORIES;
    window.ALON_FEATURED_COUNTRIES =
        FEATURED_COUNTRIES;
    window.ALON_FEATURED_CIVILIZATIONS =
        FEATURED_CIVILIZATIONS;


    /* =====================================================
       READY EVENT
    ====================================================== */

    try {
        window.dispatchEvent(
            new CustomEvent(
                "alon:data-ready",
                {
                    detail: ALON_DATA
                }
            )
        );
    } catch (error) {
        /* Older browser fallback */
    }


    console.log(
        "ALON HISTORYVERSE 24 data.js loaded successfully."
    );

})();