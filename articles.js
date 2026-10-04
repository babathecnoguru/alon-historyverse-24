/* =========================================================
   ALON HISTORYVERSE 24
   ARTICLES ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/articles.js
========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
========================================================= */

const ALON_ARTICLES_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "24.0",

    storage: {

        articles:
            "alon_historyverse_articles",

        drafts:
            "alon_historyverse_article_drafts",

        trash:
            "alon_historyverse_article_trash"

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

        contribute:
            "./contribute.html"

    }

};


/* =========================================================
   CIVILIZATION STRUCTURE
========================================================= */

const ALON_ARTICLES_CIVILIZATIONS = [

    {
        id:
            "hinduism",

        name:
            "Hinduism",

        symbol:
            "🛕",

        region:
            "South Asia",

        period:
            "Ancient to Present"
    },

    {
        id:
            "buddhism",

        name:
            "Buddhism",

        symbol:
            "☸️",

        region:
            "South Asia",

        period:
            "Ancient to Present"
    },

    {
        id:
            "sikhism",

        name:
            "Sikhism",

        symbol:
            "☬",

        region:
            "South Asia",

        period:
            "Medieval to Present"
    },

    {
        id:
            "mesopotamian-civilizations",

        name:
            "Mesopotamian Civilizations",

        symbol:
            "𒀭",

        region:
            "Mesopotamia",

        period:
            "Ancient"
    },

    {
        id:
            "ancient-egypt",

        name:
            "Ancient Egypt",

        symbol:
            "𓂀",

        region:
            "Africa",

        period:
            "Ancient"
    },

    {
        id:
            "indus-valley-civilization",

        name:
            "Indus Valley Civilization",

        symbol:
            "🏺",

        region:
            "South Asia",

        period:
            "Ancient"
    },

    {
        id:
            "ancient-chinese-civilization",

        name:
            "Ancient Chinese Civilization",

        symbol:
            "🏯",

        region:
            "East Asia",

        period:
            "Ancient"
    },

    {
        id:
            "ancient-greek-civilization",

        name:
            "Ancient Greek Civilization",

        symbol:
            "🏛️",

        region:
            "Europe",

        period:
            "Ancient"
    },

    {
        id:
            "roman-civilization",

        name:
            "Roman Civilization",

        symbol:
            "🏛️",

        region:
            "Europe",

        period:
            "Ancient"
    },

    {
        id:
            "persian-civilization",

        name:
            "Persian Civilization",

        symbol:
            "👑",

        region:
            "West Asia",

        period:
            "Ancient"
    },

    {
        id:
            "maya-civilization",

        name:
            "Maya Civilization",

        symbol:
            "🌎",

        region:
            "Mesoamerica",

        period:
            "Ancient"
    },

    {
        id:
            "inca-civilization",

        name:
            "Inca Civilization",

        symbol:
            "⛰️",

        region:
            "South America",

        period:
            "Ancient"
    },

    {
        id:
            "aztec-civilization",

        name:
            "Aztec Civilization",

        symbol:
            "☀️",

        region:
            "Mesoamerica",

        period:
            "Ancient"
    },

    {
        id:
            "byzantine-civilization",

        name:
            "Byzantine Civilization",

        symbol:
            "🏰",

        region:
            "Europe",

        period:
            "Medieval"
    },

    {
        id:
            "khmer-civilization",

        name:
            "Khmer Civilization",

        symbol:
            "🛕",

        region:
            "Southeast Asia",

        period:
            "Medieval"
    },

    {
        id:
            "nubian-civilization",

        name:
            "Nubian Civilization",

        symbol:
            "🏺",

        region:
            "Africa",

        period:
            "Ancient"
    },

    {
        id:
            "olmec-civilization",

        name:
            "Olmec Civilization",

        symbol:
            "🗿",

        region:
            "Mesoamerica",

        period:
            "Ancient"
    },

    {
        id:
            "classical-japanese-civilization",

        name:
            "Classical Japanese Civilization",

        symbol:
            "⛩️",

        region:
            "East Asia",

        period:
            "Ancient to Medieval"
    }

];


/* =========================================================
   HINDUISM / SANATANI HINDU SECTIONS
========================================================= */

const ALON_ARTICLES_CIVILIZATION_SECTIONS = [

    {
        id:
            "sanatani-hindu",

        civilizationId:
            "hinduism",

        name:
            "Sanatani Hindu",

        symbol:
            "🛕",

        type:
            "parent"
    },

    {
        id:
            "puranas",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Puranas",

        symbol:
            "📜",

        type:
            "religious-text"
    },

    {
        id:
            "shastras",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Shastras",

        symbol:
            "📖",

        type:
            "religious-text"
    },

    {
        id:
            "granth",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Granth",

        symbol:
            "📚",

        type:
            "religious-text"
    },

    {
        id:
            "bhagavad-gita",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Bhagavad Gita",

        symbol:
            "📖",

        type:
            "religious-text"
    },

    {
        id:
            "mahabharata",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Mahabharata",

        symbol:
            "📜",

        type:
            "religious-text"
    },

    {
        id:
            "four-vedas",

        civilizationId:
            "hinduism",

        parentId:
            "sanatani-hindu",

        name:
            "Four Vedas",

        symbol:
            "🕉️",

        type:
            "religious-text"
    },

    {
        id:
            "rigveda",

        civilizationId:
            "hinduism",

        parentId:
            "four-vedas",

        name:
            "Rigveda",

        symbol:
            "📜",

        type:
            "veda"
    },

    {
        id:
            "samaveda",

        civilizationId:
            "hinduism",

        parentId:
            "four-vedas",

        name:
            "Samaveda",

        symbol:
            "📜",

        type:
            "veda"
    },

    {
        id:
            "yajurveda",

        civilizationId:
            "hinduism",

        parentId:
            "four-vedas",

        name:
            "Yajurveda",

        symbol:
            "📜",

        type:
            "veda"
    },

    {
        id:
            "atharvaveda",

        civilizationId:
            "hinduism",

        parentId:
            "four-vedas",

        name:
            "Atharvaveda",

        symbol:
            "📜",

        type:
            "veda"
    },

    {
        id:
            "kings-and-maharajas",

        civilizationId:
            "hinduism",

        name:
            "Kings & Maharajas",

        symbol:
            "👑",

        type:
            "history"
    },

    {
        id:
            "wars-and-battles",

        civilizationId:
            "hinduism",

        name:
            "Wars & Battles",

        symbol:
            "⚔️",

        type:
            "history"
    },

    {
        id:
            "muslim-rule",

        civilizationId:
            "hinduism",

        name:
            "Muslim Rule",

        symbol:
            "🏰",

        type:
            "history"
    },

    {
        id:
            "taj-mahal-and-architecture",

        civilizationId:
            "hinduism",

        name:
            "Taj Mahal & Architecture",

        symbol:
            "🕌",

        type:
            "history"
    },

    {
        id:
            "british-rule",

        civilizationId:
            "hinduism",

        name:
            "British Rule",

        symbol:
            "🏛️",

        type:
            "history"
    }

];


/* =========================================================
   STORAGE
========================================================= */

function articlesGetStorage(
    key,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;

        }

        const parsed =
            JSON.parse(value);

        return parsed;

    } catch (error) {

        console.error(
            "Articles storage read error:",
            error
        );

        return fallback;

    }

}


function articlesSetStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Articles storage write error:",
            error
        );

        return false;

    }

}


/* =========================================================
   ARTICLE DATA
========================================================= */

function getArticlesData() {

    const articles =
        articlesGetStorage(
            ALON_ARTICLES_CONFIG
                .storage
                .articles,
            []
        );

    if (!Array.isArray(articles)) {

        return [];

    }

    return articles;

}


/* =========================================================
   CIVILIZATION HELPERS
========================================================= */

function getArticleCivilization(
    civilizationId
) {

    if (!civilizationId) {

        return null;

    }

    return ALON_ARTICLES_CIVILIZATIONS.find(
        function (civilization) {

            return String(
                civilization.id
            ).toLowerCase()
            ===
            String(
                civilizationId
            ).toLowerCase();

        }
    ) || null;

}


function getArticleCivilizationSection(
    sectionId
) {

    if (!sectionId) {

        return null;

    }

    return ALON_ARTICLES_CIVILIZATION_SECTIONS.find(
        function (section) {

            return String(
                section.id
            ).toLowerCase()
            ===
            String(
                sectionId
            ).toLowerCase();

        }
    ) || null;

}


/* =========================================================
   ARTICLE SCOPE
========================================================= */

function getArticleScopeFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const civilization =
        params.get(
            "civilization"
        ) || "";

    const section =
        params.get(
            "section"
        ) || "";

    return {

        civilization:
            civilization,

        section:
            section

    };

}


function articleMatchesScope(
    article,
    scope
) {

    if (!article || !scope) {

        return false;

    }


    const requestedCivilization =
        String(
            scope.civilization || ""
        )
        .trim()
        .toLowerCase();


    const requestedSection =
        String(
            scope.section || ""
        )
        .trim()
        .toLowerCase();


    if (requestedCivilization) {

        const articleCivilization =
            String(
                article.civilizationId ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            articleCivilization !==
            requestedCivilization
        ) {

            return false;

        }

    }


    if (requestedSection) {

        const articleSection =
            String(
                article.civilizationSectionId ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            articleSection !==
            requestedSection
        ) {

            return false;

        }

    }


    return true;

}


function getScopedArticles(
    articles = getArticlesData()
) {

    const scope =
        getArticleScopeFromURL();


    if (
        !scope.civilization &&
        !scope.section
    ) {

        return Array.isArray(articles)
            ? articles
            : [];

    }


    return (
        Array.isArray(articles)
            ? articles
            : []
    ).filter(
        function (article) {

            return articleMatchesScope(
                article,
                scope
            );

        }
    );

}


/* =========================================================
   SAFE HTML
========================================================= */

function articlesEscapeHTML(
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
   DATE FORMAT
========================================================= */

function articlesFormatDate(
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


/* =========================================================
   ARTICLE URL
========================================================= */

function getArticleURL(
    articleId
) {

    return (
        ALON_ARTICLES_CONFIG
            .paths
            .article +

        "?id=" +

        encodeURIComponent(
            articleId
        )
    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchArticles(
    query = ""
) {

    const articles =
        getScopedArticles();

    const search =
        String(query)
            .trim()
            .toLowerCase();

    if (!search) {

        return articles;

    }

    return articles.filter(
        function (article) {

            const title =
                String(
                    article.title || ""
                ).toLowerCase();

            const category =
                String(
                    article.category || ""
                ).toLowerCase();

            const description =
                String(
                    article.description ||
                    article.shortDescription ||
                    ""
                ).toLowerCase();

            const content =
                String(
                    article.content || ""
                ).toLowerCase();

            const author =
                String(
                    article.author || ""
                ).toLowerCase();

            const sources =
                String(
                    article.sources || ""
                ).toLowerCase();

            const civilization =
                String(
                    article.civilization || ""
                ).toLowerCase();

            const civilizationSection =
                String(
                    article.civilizationSection ||
                    ""
                ).toLowerCase();

            return (

                title.includes(search) ||

                category.includes(search) ||

                description.includes(search) ||

                content.includes(search) ||

                author.includes(search) ||

                sources.includes(search) ||

                civilization.includes(search) ||

                civilizationSection.includes(search)

            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function filterArticlesByCategory(
    category = "all"
) {

    const articles =
        getScopedArticles();

    if (
        !category ||
        category.toLowerCase() === "all"
    ) {

        return articles;

    }

    return articles.filter(
        function (article) {

            return String(
                article.category || ""
            )
            .toLowerCase()
            ===
            String(category)
                .toLowerCase();

        }
    );

}


/* =========================================================
   SORT ARTICLES
========================================================= */

function sortArticles(
    articles,
    mode = "newest"
) {

    const list =
        Array.isArray(articles)
            ? [...articles]
            : [];

    if (
        mode === "oldest"
    ) {

        return list.sort(
            function (a, b) {

                return (
                    new Date(
                        a.createdAt || 0
                    ) -

                    new Date(
                        b.createdAt || 0
                    )
                );

            }
        );

    }

    if (
        mode === "title"
    ) {

        return list.sort(
            function (a, b) {

                return String(
                    a.title || ""
                ).localeCompare(
                    String(
                        b.title || ""
                    )
                );

            }
        );

    }

    return list.sort(
        function (a, b) {

            return (
                new Date(
                    b.updatedAt ||
                    b.createdAt ||
                    0
                ) -

                new Date(
                    a.updatedAt ||
                    a.createdAt ||
                    0
                )
            );

        }
    );

}


/* =========================================================
   GET CATEGORIES
========================================================= */

function getArticleCategories() {

    const articles =
        getScopedArticles();

    const categories =
        new Set();

    articles.forEach(
        function (article) {

            if (
                article.category
            ) {

                categories.add(
                    article.category
                );

            }

        }
    );

    return Array.from(
        categories
    ).sort();

}


/* =========================================================
   ARTICLE COUNT
========================================================= */

function getArticleCount() {

    return getScopedArticles().length;

}


/* =========================================================
   CREATE ARTICLE CARD
========================================================= */

function createArticleCard(
    article
) {

    const id =
        articlesEscapeHTML(
            article.id
        );

    const title =
        articlesEscapeHTML(
            article.title ||
            "Untitled Article"
        );

    const category =
        articlesEscapeHTML(
            article.category ||
            "Other"
        );

    const description =
        articlesEscapeHTML(
            article.description ||
            article.shortDescription ||
            ""
        );

    const author =
        articlesEscapeHTML(
            article.author ||
            "Baba Thecno Guru"
        );

    const date =
        articlesEscapeHTML(
            articlesFormatDate(
                article.updatedAt ||
                article.createdAt
            )
        );

    return `

        <article
            class="article-card"
            data-article-id="${id}"
            data-search-item
        >

            <a
                class="article-card-link"
                href="${getArticleURL(
                    article.id
                )}"
            >

                <div class="article-card-content">

                    <span class="article-category">
                        ${category}
                    </span>

                    <h3>
                        ${title}
                    </h3>

                    ${
                        description
                            ? `
                            <p>
                                ${description}
                            </p>
                            `
                            : ""
                    }

                    <div class="article-meta">

                        <span>
                            ${author}
                        </span>

                        ${
                            date
                                ? `
                                <span>
                                    ${date}
                                </span>
                                `
                                : ""
                        }

                    </div>

                    <span class="article-read-more">
                        Read Article →
                    </span>

                </div>

            </a>

        </article>

    `;

}


/* =========================================================
   RENDER CURRENT SCOPE
========================================================= */

function renderArticleScope() {

    const container =
        document.getElementById(
            "articleScope"
        );

    if (!container) {

        return;

    }


    const scope =
        getArticleScopeFromURL();


    const civilization =
        getArticleCivilization(
            scope.civilization
        );


    const section =
        getArticleCivilizationSection(
            scope.section
        );


    if (
        !civilization &&
        !section
    ) {

        container.innerHTML = "";

        return;

    }


    let title = "";

    let symbol = "";


    if (section) {

        title =
            section.name;

        symbol =
            section.symbol || "";

    } else if (civilization) {

        title =
            civilization.name;

        symbol =
            civilization.symbol || "";

    }


    container.innerHTML = `

        <div class="article-scope">

            <span class="article-scope-symbol">
                ${articlesEscapeHTML(symbol)}
            </span>

            <span class="article-scope-title">
                ${articlesEscapeHTML(title)}
            </span>

        </div>

    `;

}


/* =========================================================
   RENDER ARTICLES
========================================================= */

function renderArticles(
    articles = getScopedArticles()
) {

    const container =
        document.getElementById(
            "articlesList"
        );

    if (!container) {

        return;

    }


    if (
        !Array.isArray(articles) ||
        articles.length === 0
    ) {

        container.innerHTML = `

            <div class="articles-empty">

                <h3>
                    No Articles Found
                </h3>

                <p>
                    Try another search or category,
                    or create a new article.
                </p>

            </div>

        `;

        updateArticleCount(
            0
        );

        return;

    }


    container.innerHTML =
        articles
            .map(
                createArticleCard
            )
            .join("");


    updateArticleCount(
        articles.length
    );

}


/* =========================================================
   ARTICLE COUNT UI
========================================================= */

function updateArticleCount(
    count = getArticleCount()
) {

    const elements =
        document.querySelectorAll(
            "[data-article-count]"
        );

    elements.forEach(
        function (element) {

            element.textContent =
                count;

        }
    );

}


/* =========================================================
   CATEGORY FILTER UI
========================================================= */

function populateArticleCategories() {

    const select =
        document.getElementById(
            "articleCategoryFilter"
        );

    if (!select) {

        return;

    }


    const current =
        select.value;

    const categories =
        getArticleCategories();


    select.innerHTML = `

        <option value="all">
            All Categories
        </option>

    `;


    categories.forEach(
        function (category) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category;

            option.textContent =
                category;

            select.appendChild(
                option
            );

        }
    );


    if (
        categories.includes(
            current
        )
    ) {

        select.value =
            current;

    }

}


/* =========================================================
   SEARCH + FILTER
========================================================= */

function applyArticleFilters() {

    const searchInput =
        document.getElementById(
            "articleSearch"
        );

    const categorySelect =
        document.getElementById(
            "articleCategoryFilter"
        );

    const sortSelect =
        document.getElementById(
            "articleSort"
        );


    const search =
        searchInput
            ? searchInput.value
            : "";


    const category =
        categorySelect
            ? categorySelect.value
            : "all";


    const sortMode =
        sortSelect
            ? sortSelect.value
            : "newest";


    let results =
        searchArticles(
            search
        );


    if (
        category &&
        category !== "all"
    ) {

        results =
            results.filter(
                function (article) {

                    return String(
                        article.category ||
                        ""
                    ).toLowerCase()

                    ===

                    String(
                        category
                    ).toLowerCase();

                }
            );

    }


    results =
        sortArticles(
            results,
            sortMode
        );


    renderArticles(
        results
    );

}


/* =========================================================
   SEARCH EVENTS
========================================================= */

function setupArticleSearch() {

    const input =
        document.getElementById(
            "articleSearch"
        );

    if (!input) {

        return;

    }

    input.addEventListener(
        "input",
        applyArticleFilters
    );

}


/* =========================================================
   CATEGORY EVENTS
========================================================= */

function setupArticleCategoryFilter() {

    const select =
        document.getElementById(
            "articleCategoryFilter"
        );

    if (!select) {

        return;

    }

    select.addEventListener(
        "change",
        applyArticleFilters
    );

}


/* =========================================================
   SORT EVENTS
========================================================= */

function setupArticleSort() {

    const select =
        document.getElementById(
            "articleSort"
        );

    if (!select) {

        return;

    }

    select.addEventListener(
        "change",
        applyArticleFilters
    );

}


/* =========================================================
   URL SEARCH
========================================================= */

function applyURLSearch() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        params.get(
            "search"
        );


    if (!search) {

        return;

    }


    const input =
        document.getElementById(
            "articleSearch"
        );


    if (input) {

        input.value =
            search;

    }


    applyArticleFilters();

}


/* =========================================================
   FEATURED ARTICLES
========================================================= */

function renderFeaturedArticles() {

    const container =
        document.getElementById(
            "featuredArticles"
        );

    if (!container) {

        return;

    }


    const articles =
        sortArticles(
            getScopedArticles(),
            "newest"
        ).slice(
            0,
            6
        );


    if (
        articles.length === 0
    ) {

        container.innerHTML = `

            <div class="articles-empty">

                <p>
                    No articles available yet.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        articles
            .map(
                createArticleCard
            )
            .join("");

}


/* =========================================================
   ARTICLE PREVIEW
========================================================= */

function renderArticlePreview(
    articleId
) {

    const container =
        document.getElementById(
            "articlePreview"
        );

    if (!container) {

        return;

    }


    const article =
        getArticlesData().find(
            function (item) {

                return String(
                    item.id
                )
                ===
                String(
                    articleId
                );

            }
        );


    if (!article) {

        container.innerHTML = `

            <div class="article-not-found">

                <h2>
                    Article Not Found
                </h2>

                <p>
                    The requested article
                    could not be found.
                </p>

                <a
                    href="${ALON_ARTICLES_CONFIG.paths.articles}"
                >
                    Back to Articles
                </a>

            </div>

        `;

        return;

    }


    const title =
        articlesEscapeHTML(
            article.title
        );


    const category =
        articlesEscapeHTML(
            article.category ||
            "Other"
        );


    const description =
        articlesEscapeHTML(
            article.description ||
            article.shortDescription ||
            ""
        );


    const content =
        articlesEscapeHTML(
            article.content ||
            ""
        );


    const author =
        articlesEscapeHTML(
            article.author ||
            "Baba Thecno Guru"
        );


    const date =
        articlesEscapeHTML(
            articlesFormatDate(
                article.updatedAt ||
                article.createdAt
            )
        );


    const sources =
        articlesEscapeHTML(
            article.sources ||
            ""
        );


    container.innerHTML = `

        <article
            class="article-full"
        >

            <header
                class="article-full-header"
            >

                <span
                    class="article-category"
                >
                    ${category}
                </span>

                <h1>
                    ${title}
                </h1>

                ${
                    description
                        ? `
                        <p
                            class="article-description"
                        >
                            ${description}
                        </p>
                        `
                        : ""
                }

                <div
                    class="article-meta"
                >

                    <span>
                        By ${author}
                    </span>

                    ${
                        date
                            ? `
                            <span>
                                ${date}
                            </span>
                            `
                            : ""
                    }

                </div>

            </header>

            <div
                class="article-body"
            >

                ${content.replace(
                    /\n/g,
                    "<br>"
                )}

            </div>

            ${
                sources
                    ? `
                    <section
                        class="article-sources"
                    >

                        <h3>
                            Sources & References
                        </h3>

                        <p>
                            ${sources.replace(
                                /\n/g,
                                "<br>"
                            )}
                        </p>

                    </section>
                    `
                    : ""
            }

        </article>

    `;

}


/* =========================================================
   URL ARTICLE
========================================================= */

function loadArticleFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const articleId =
        params.get(
            "id"
        );


    if (!articleId) {

        return;

    }


    renderArticlePreview(
        articleId
    );

}


/* =========================================================
   RELATED ARTICLES
========================================================= */

function getRelatedArticles(
    article,
    limit = 4
) {

    if (!article) {

        return [];

    }


    const category =
        String(
            article.category ||
            ""
        ).toLowerCase();


    const civilizationId =
        String(
            article.civilizationId ||
            ""
        ).toLowerCase();


    const sectionId =
        String(
            article.civilizationSectionId ||
            ""
        ).toLowerCase();


    return getArticlesData()

        .filter(
            function (item) {

                return String(
                    item.id
                )
                !==
                String(
                    article.id
                );

            }
        )

        .filter(
            function (item) {

                const itemCivilization =
                    String(
                        item.civilizationId ||
                        ""
                    ).toLowerCase();


                const itemSection =
                    String(
                        item.civilizationSectionId ||
                        ""
                    ).toLowerCase();


                if (
                    civilizationId &&
                    itemCivilization !==
                    civilizationId
                ) {

                    return false;

                }


                if (
                    sectionId &&
                    itemSection !==
                    sectionId
                ) {

                    return false;

                }


                return String(
                    item.category ||
                    ""
                ).toLowerCase()
                ===
                category;

            }
        )

        .slice(
            0,
            limit
        );

}


/* =========================================================
   RENDER RELATED ARTICLES
========================================================= */

function renderRelatedArticles(
    articleId
) {

    const container =
        document.getElementById(
            "relatedArticles"
        );


    if (!container) {

        return;

    }


    const article =
        getArticlesData().find(
            function (item) {

                return String(
                    item.id
                )
                ===
                String(
                    articleId
                );

            }
        );


    if (!article) {

        return;

    }


    const related =
        getRelatedArticles(
            article
        );


    if (
        related.length === 0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML =
        related
            .map(
                createArticleCard
            )
            .join("");

}


/* =========================================================
   ARTICLE PAGE INITIALIZATION
========================================================= */

function initializeArticlesPage() {

    populateArticleCategories();

    setupArticleSearch();

    setupArticleCategoryFilter();

    setupArticleSort();

    renderArticleScope();

    renderArticles();

    renderFeaturedArticles();

    applyURLSearch();

    loadArticleFromURL();


    const articleId =
        new URLSearchParams(
            window.location.search
        ).get(
            "id"
        );


    if (articleId) {

        renderRelatedArticles(
            articleId
        );

    }

}


/* =========================================================
   GLOBAL ARTICLES API
========================================================= */

window.ALON_ARTICLES = {

    config:
        ALON_ARTICLES_CONFIG,

    civilizations:
        ALON_ARTICLES_CIVILIZATIONS,

    civilizationSections:
        ALON_ARTICLES_CIVILIZATION_SECTIONS,

    getCivilization:
        getArticleCivilization,

    getCivilizationSection:
        getArticleCivilizationSection,

    getScope:
        getArticleScopeFromURL,

    scoped:
        getScopedArticles,

    get:
        getArticlesData,

    search:
        searchArticles,

    filter:
        filterArticlesByCategory,

    sort:
        sortArticles,

    categories:
        getArticleCategories,

    count:
        getArticleCount,

    render:
        renderArticles,

    renderScope:
        renderArticleScope,

    featured:
        renderFeaturedArticles,

    preview:
        renderArticlePreview,

    related:
        getRelatedArticles,

    initialize:
        initializeArticlesPage

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
        initializeArticlesPage
    );

} else {

    initializeArticlesPage();

}


/* =========================================================
   END OF ARTICLES.JS
   ALON HISTORYVERSE 24
========================================================= */