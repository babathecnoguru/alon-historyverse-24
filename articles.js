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

    project: "ALON HISTORYVERSE 24",

    creator: "Baba Thecno Guru",

    version: "24.0",

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
            year: "numeric",
            month: "long",
            day: "numeric"
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
        getArticlesData();

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

            return (

                title.includes(search) ||

                category.includes(search) ||

                description.includes(search) ||

                content.includes(search) ||

                author.includes(search) ||

                sources.includes(search)

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
        getArticlesData();

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
        getArticlesData();

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

    return getArticlesData().length;

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
   RENDER ARTICLES
   ========================================================= */

function renderArticles(
    articles = getArticlesData()
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

        updateArticleCount(0);

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
            getArticlesData(),
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
                ) === String(
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

            <header class="article-full-header">

                <span class="article-category">
                    ${category}
                </span>

                <h1>
                    ${title}
                </h1>

                ${
                    description
                        ? `
                        <p class="article-description">
                            ${description}
                        </p>
                        `
                        : ""
                }

                <div class="article-meta">

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

            <div class="article-body">

                ${content.replace(
                    /\n/g,
                    "<br>"
                )}

            </div>

            ${
                sources
                    ? `
                    <section class="article-sources">

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

    return getArticlesData()

        .filter(
            function (item) {

                return String(
                    item.id
                ) !== String(
                    article.id
                );

            }
        )

        .filter(
            function (item) {

                return String(
                    item.category ||
                    ""
                ).toLowerCase()
                === category;

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
                ) === String(
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