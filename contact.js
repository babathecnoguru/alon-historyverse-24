/* =========================================================
   ALON HISTORYVERSE 24
   VERSION: V100
   FILE: jss/content.js

   MASTER CONTENT + ARTICLE ENGINE
   ---------------------------------------------------------
   Includes:
   - Articles
   - Add article
   - Edit article
   - Delete article
   - Publish / unpublish
   - Drafts
   - Featured articles
   - Search
   - Categories
   - Subjects
   - Civilizations
   - Countries
   - Heritage
   - Timeline
   - Gallery content
   - Local history
   - Tourism history
   - Historical buildings
   - Historical roads
   - Railway history
   - Maps
   - Natural / historical content
========================================================= */


/* =========================================================
   01. FIREBASE CONNECTION
========================================================= */

import {
    HistoryVerseFirebase
} from "./firebase.js";


/* =========================================================
   02. GLOBAL CONTENT STATE
========================================================= */

const ContentEngine = {

    version: "V100",

    articles: [],

    categories: [],

    subjects: [],

    civilizations: [],

    countries: [],

    heritage: [],

    timeline: [],

    gallery: [],

    buildings: [],

    roads: [],

    railways: [],

    maps: [],

    localHistory: [],

    tourismHistory: [],

    searchResults: [],

    currentArticle: null,

    loading: false,

    initialized: false,

    cacheLoaded: false

};


/* =========================================================
   03. COLLECTION NAMES
========================================================= */

const COLLECTIONS = {

    articles: "articles",

    categories: "categories",

    subjects: "subjects",

    civilizations: "civilizations",

    countries: "countries",

    heritage: "heritage",

    timeline: "timeline",

    gallery: "gallery",

    buildings: "historical_buildings",

    roads: "historical_roads",

    railways: "railway_history",

    maps: "historical_maps",

    localHistory: "local_history",

    tourismHistory: "tourism_history"

};


/* =========================================================
   04. BASIC HELPERS
========================================================= */

function cleanText(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value).trim();

}


function createId() {

    return (

        Date.now().toString(36) +

        Math.random()
            .toString(36)
            .substring(2, 10)

    );

}


function normalizeText(
    value
) {

    return cleanText(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        );

}


/* =========================================================
   05. ARTICLE NORMALIZER
========================================================= */

function normalizeArticle(
    article = {}
) {

    const now =
        new Date().toISOString();


    return {

        id:
            cleanText(article.id) ||
            createId(),

        title:
            cleanText(article.title),

        titleHi:
            cleanText(
                article.titleHi ||
                article.titleHindi
            ),

        titleEn:
            cleanText(
                article.titleEn ||
                article.titleEnglish
            ),

        description:
            cleanText(
                article.description
            ),

        descriptionHi:
            cleanText(
                article.descriptionHi
            ),

        descriptionEn:
            cleanText(
                article.descriptionEn
            ),

        content:
            cleanText(
                article.content
            ),

        contentHi:
            cleanText(
                article.contentHi
            ),

        contentEn:
            cleanText(
                article.contentEn
            ),

        image:
            cleanText(
                article.image ||
                article.imageUrl
            ),

        gallery:
            Array.isArray(
                article.gallery
            )
                ? article.gallery
                : [],

        author:
            cleanText(
                article.author
            ),

        authorId:
            cleanText(
                article.authorId
            ),

        category:
            cleanText(
                article.category
            ),

        subject:
            cleanText(
                article.subject
            ),

        civilization:
            cleanText(
                article.civilization
            ),

        country:
            cleanText(
                article.country
            ),

        state:
            cleanText(
                article.state
            ),

        location:
            cleanText(
                article.location
            ),

        period:
            cleanText(
                article.period
            ),

        era:
            cleanText(
                article.era
            ),

        tags:
            Array.isArray(article.tags)
                ? article.tags
                : [],

        keywords:
            Array.isArray(article.keywords)
                ? article.keywords
                : [],

        sources:
            Array.isArray(article.sources)
                ? article.sources
                : [],

        sourceUrl:
            cleanText(
                article.sourceUrl
            ),

        license:
            cleanText(
                article.license
            ),

        copyright:
            cleanText(
                article.copyright
            ),

        contributorPermission:
            Boolean(
                article.contributorPermission
            ),

        status:
            cleanText(
                article.status
            ) || "draft",

        featured:
            Boolean(
                article.featured
            ),

        verified:
            Boolean(
                article.verified
            ),

        moderated:
            Boolean(
                article.moderated
            ),

        views:
            Number(article.views) || 0,

        likes:
            Number(article.likes) || 0,

        shares:
            Number(article.shares) || 0,

        createdAt:
            article.createdAt ||
            now,

        updatedAt:
            article.updatedAt ||
            now,

        publishedAt:
            article.publishedAt ||
            null

    };

}


/* =========================================================
   06. ARTICLE VALIDATION
========================================================= */

function validateArticle(
    article
) {

    const errors = [];


    if (
        !cleanText(article.title)
    ) {

        errors.push(
            "Article title is required."
        );

    }


    if (
        !cleanText(article.content)
    ) {

        errors.push(
            "Article content is required."
        );

    }


    if (
        !cleanText(article.category)
    ) {

        errors.push(
            "Article category is required."
        );

    }


    if (
        article.contributorPermission === false
    ) {

        errors.push(
            "Contributor permission is required."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   07. LOCAL CACHE
========================================================= */

function saveArticleCache(
    articles
) {

    try {

        localStorage.setItem(
            "historyverse_articles",
            JSON.stringify(
                articles
            )
        );

        return true;

    } catch (error) {

        console.warn(
            "Article cache could not be saved.",
            error
        );

        return false;

    }

}


function loadArticleCache() {

    try {

        const saved =
            localStorage.getItem(
                "historyverse_articles"
            );


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(saved);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   08. GET ALL ARTICLES
========================================================= */

async function getAllArticles(
    forceRefresh = false
) {

    if (
        !forceRefresh &&
        ContentEngine.articles.length
    ) {

        return ContentEngine.articles;

    }


    ContentEngine.loading = true;


    try {

        if (
            HistoryVerseFirebase.isReady()
        ) {

            const articles =
                await HistoryVerseFirebase
                    .articles
                    .getAll();


            ContentEngine.articles =
                articles.map(
                    normalizeArticle
                );


        } else {

            ContentEngine.articles =
                loadArticleCache()
                    .map(
                        normalizeArticle
                    );

        }


        ContentEngine.cacheLoaded =
            true;


        saveArticleCache(
            ContentEngine.articles
        );


        return ContentEngine.articles;

    } catch (error) {

        console.error(
            "Could not load articles:",
            error
        );


        ContentEngine.articles =
            loadArticleCache()
                .map(
                    normalizeArticle
                );


        return ContentEngine.articles;

    } finally {

        ContentEngine.loading = false;

    }

}


/* =========================================================
   09. GET ARTICLE BY ID
========================================================= */

async function getArticle(
    articleId
) {

    if (!articleId) {

        return null;

    }


    const local =
        ContentEngine.articles.find(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (local) {

        ContentEngine.currentArticle =
            local;

        return local;

    }


    try {

        if (
            HistoryVerseFirebase.isReady()
        ) {

            const article =
                await HistoryVerseFirebase
                    .articles
                    .get(articleId);


            if (article) {

                const normalized =
                    normalizeArticle(
                        article
                    );


                ContentEngine.currentArticle =
                    normalized;


                return normalized;

            }

        }

    } catch (error) {

        console.error(
            "Could not load article:",
            error
        );

    }


    return null;

}


/* =========================================================
   10. ADD ARTICLE
========================================================= */

async function addArticle(
    articleData
) {

    const article =
        normalizeArticle(
            articleData
        );


    const validation =
        validateArticle(
            article
        );


    if (!validation.valid) {

        throw new Error(
            validation.errors.join(" ")
        );

    }


    article.status =
        article.status || "draft";


    article.createdAt =
        new Date().toISOString();


    article.updatedAt =
        new Date().toISOString();


    if (
        HistoryVerseFirebase.isReady()
    ) {

        const firebaseData = {
            ...article
        };


        delete firebaseData.id;


        const id =
            await HistoryVerseFirebase
                .articles
                .create(
                    firebaseData
                );


        article.id =
            id;

    }


    ContentEngine.articles.push(
        article
    );


    saveArticleCache(
        ContentEngine.articles
    );


    emitContentEvent(
        "articlecreated",
        {
            article
        }
    );


    return article;

}


/* =========================================================
   11. EDIT ARTICLE
========================================================= */

async function editArticle(
    articleId,
    articleData
) {

    if (!articleId) {

        throw new Error(
            "Article ID is required."
        );

    }


    const index =
        ContentEngine.articles.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    let existing = null;


    if (index >= 0) {

        existing =
            ContentEngine.articles[index];

    } else {

        existing =
            await getArticle(
                articleId
            );

    }


    if (!existing) {

        throw new Error(
            "Article not found."
        );

    }


    const updated =
        normalizeArticle({

            ...existing,

            ...articleData,

            id:
                articleId,

            updatedAt:
                new Date().toISOString()

        });


    const validation =
        validateArticle(
            updated
        );


    if (!validation.valid) {

        throw new Error(
            validation.errors.join(" ")
        );

    }


    if (
        HistoryVerseFirebase.isReady()
    ) {

        const firebaseData = {
            ...updated
        };


        delete firebaseData.id;


        await HistoryVerseFirebase
            .articles
            .update(
                articleId,
                firebaseData
            );

    }


    if (index >= 0) {

        ContentEngine.articles[index] =
            updated;

    } else {

        ContentEngine.articles.push(
            updated
        );

    }


    ContentEngine.currentArticle =
        updated;


    saveArticleCache(
        ContentEngine.articles
    );


    emitContentEvent(
        "articleupdated",
        {
            article:
                updated
        }
    );


    return updated;

}


/* =========================================================
   12. DELETE ARTICLE
========================================================= */

async function deleteArticle(
    articleId
) {

    if (!articleId) {

        throw new Error(
            "Article ID is required."
        );

    }


    const index =
        ContentEngine.articles.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (
        HistoryVerseFirebase.isReady()
    ) {

        await HistoryVerseFirebase
            .articles
            .delete(
                articleId
            );

    }


    if (index >= 0) {

        ContentEngine.articles.splice(
            index,
            1
        );

    }


    if (
        ContentEngine.currentArticle &&
        String(
            ContentEngine.currentArticle.id
        ) ===
        String(articleId)
    ) {

        ContentEngine.currentArticle =
            null;

    }


    saveArticleCache(
        ContentEngine.articles
    );


    emitContentEvent(
        "articledeleted",
        {
            articleId
        }
    );


    return true;

}


/* =========================================================
   13. PUBLISH ARTICLE
========================================================= */

async function publishArticle(
    articleId
) {

    return editArticle(
        articleId,
        {

            status:
                "published",

            publishedAt:
                new Date().toISOString(),

            moderated:
                true

        }
    );

}


/* =========================================================
   14. UNPUBLISH ARTICLE
========================================================= */

async function unpublishArticle(
    articleId
) {

    return editArticle(
        articleId,
        {

            status:
                "draft"

        }
    );

}


/* =========================================================
   15. FEATURE / UNFEATURE
========================================================= */

async function setFeatured(
    articleId,
    featured = true
) {

    return editArticle(
        articleId,
        {
            featured:
                Boolean(featured)
        }
    );

}


/* =========================================================
   16. PUBLISHED ARTICLES
========================================================= */

async function getPublishedArticles(
    limitCount = 50
) {

    const articles =
        await getAllArticles();


    return articles

        .filter(
            article =>
                article.status ===
                "published"
        )

        .sort(
            (
                a,
                b
            ) =>
                new Date(
                    b.publishedAt ||
                    b.createdAt
                ) -
                new Date(
                    a.publishedAt ||
                    a.createdAt
                )
        )

        .slice(
            0,
            limitCount
        );

}


/* =========================================================
   17. FEATURED ARTICLES
========================================================= */

async function getFeaturedArticles(
    limitCount = 12
) {

    const articles =
        await getPublishedArticles(
            100
        );


    return articles

        .filter(
            article =>
                article.featured === true
        )

        .slice(
            0,
            limitCount
        );

}


/* =========================================================
   18. DRAFT ARTICLES
========================================================= */

async function getDraftArticles() {

    const articles =
        await getAllArticles();


    return articles.filter(
        article =>
            article.status ===
            "draft"
    );

}


/* =========================================================
   19. SEARCH ARTICLES
========================================================= */

async function searchArticles(
    searchTerm,
    options = {}
) {

    const term =
        normalizeText(
            searchTerm
        );


    if (!term) {

        ContentEngine.searchResults =
            [];

        return [];

    }


    const articles =
        await getAllArticles();


    const category =
        normalizeText(
            options.category
        );


    const country =
        normalizeText(
            options.country
        );


    const civilization =
        normalizeText(
            options.civilization
        );


    const results =
        articles.filter(
            article => {

                if (
                    options.publishedOnly &&
                    article.status !==
                    "published"
                ) {

                    return false;

                }


                if (
                    category &&
                    normalizeText(
                        article.category
                    ) !== category
                ) {

                    return false;

                }


                if (
                    country &&
                    normalizeText(
                        article.country
                    ) !== country
                ) {

                    return false;

                }


                if (
                    civilization &&
                    normalizeText(
                        article.civilization
                    ) !== civilization
                ) {

                    return false;

                }


                const searchable = [

                    article.title,

                    article.titleHi,

                    article.titleEn,

                    article.description,

                    article.descriptionHi,

                    article.descriptionEn,

                    article.content,

                    article.contentHi,

                    article.contentEn,

                    article.category,

                    article.subject,

                    article.civilization,

                    article.country,

                    article.state,

                    article.location,

                    article.period,

                    article.era,

                    ...article.tags,

                    ...article.keywords

                ]

                .map(
                    normalizeText
                )

                .join(" ");


                return searchable.includes(
                    term
                );

            }
        );


    ContentEngine.searchResults =
        results;


    emitContentEvent(
        "search",
        {
            term,
            results
        }
    );


    return results;

}


/* =========================================================
   20. SEARCH WITH SCORE
========================================================= */

async function smartSearch(
    searchTerm
) {

    const term =
        normalizeText(
            searchTerm
        );


    if (!term) {

        return [];

    }


    const articles =
        await getAllArticles();


    const scored =
        articles

            .map(
                article => {

                    let score = 0;


                    const title =
                        normalizeText(
                            article.title
                        );


                    const description =
                        normalizeText(
                            article.description
                        );


                    const content =
                        normalizeText(
                            article.content
                        );


                    if (
                        title.includes(term)
                    ) {

                        score += 100;

                    }


                    if (
                        description.includes(term)
                    ) {

                        score += 40;

                    }


                    if (
                        content.includes(term)
                    ) {

                        score += 20;

                    }


                    if (
                        normalizeText(
                            article.category
                        ).includes(term)
                    ) {

                        score += 30;

                    }


                    if (
                        normalizeText(
                            article.country
                        ).includes(term)
                    ) {

                        score += 30;

                    }


                    if (
                        article.tags.some(
                            tag =>
                                normalizeText(
                                    tag
                                ).includes(term)
                        )
                    ) {

                        score += 35;

                    }


                    return {

                        article,

                        score

                    };

                }
            )

            .filter(
                item =>
                    item.score > 0
            )

            .sort(
                (
                    a,
                    b
                ) =>
                    b.score -
                    a.score
            );


    return scored.map(
        item =>
            item.article
    );

}


/* =========================================================
   21. CATEGORY FILTER
========================================================= */

async function getArticlesByCategory(
    category
) {

    const articles =
        await getPublishedArticles(
            500
        );


    return articles.filter(
        article =>
            normalizeText(
                article.category
            ) ===
            normalizeText(
                category
            )
    );

}


/* =========================================================
   22. COUNTRY FILTER
========================================================= */

async function getArticlesByCountry(
    country
) {

    const articles =
        await getPublishedArticles(
            500
        );


    return articles.filter(
        article =>
            normalizeText(
                article.country
            ) ===
            normalizeText(
                country
            )
    );

}


/* =========================================================
   23. CIVILIZATION FILTER
========================================================= */

async function getArticlesByCivilization(
    civilization
) {

    const articles =
        await getPublishedArticles(
            500
        );


    return articles.filter(
        article =>
            normalizeText(
                article.civilization
            ) ===
            normalizeText(
                civilization
            )
    );

}


/* =========================================================
   24. TIMELINE CONTENT
========================================================= */

async function getTimelineEvents() {

    if (
        ContentEngine.timeline.length
    ) {

        return ContentEngine.timeline;

    }


    try {

        if (
            HistoryVerseFirebase.isReady()
        ) {

            ContentEngine.timeline =
                await HistoryVerseFirebase
                    .getAll(
                        COLLECTIONS.timeline
                    );

        }


    } catch (error) {

        console.error(
            "Timeline loading failed:",
            error
        );

    }


    return ContentEngine.timeline;

}


/* =========================================================
   25. GENERIC CONTENT COLLECTION
========================================================= */

async function getContentCollection(
    type,
    forceRefresh = false
) {

    if (
        !COLLECTIONS[type]
    ) {

        return [];

    }


    if (
        !forceRefresh &&
        Array.isArray(
            ContentEngine[type]
        ) &&
        ContentEngine[type].length
    ) {

        return ContentEngine[type];

    }


    try {

        if (
            HistoryVerseFirebase.isReady()
        ) {

            const data =
                await HistoryVerseFirebase
                    .getAll(
                        COLLECTIONS[type]
                    );


            ContentEngine[type] =
                data;


            return data;

        }

    } catch (error) {

        console.error(
            `Could not load ${type}:`,
            error
        );

    }


    return [];

}


/* =========================================================
   26. CONTENT CREATION
========================================================= */

async function createContent(
    type,
    data
) {

    if (
        !COLLECTIONS[type]
    ) {

        throw new Error(
            "Invalid content type."
        );

    }


    if (
        !HistoryVerseFirebase.isReady()
    ) {

        throw new Error(
            "Firebase is required for this content."
        );

    }


    const id =
        await HistoryVerseFirebase.create(
            COLLECTIONS[type],
            data
        );


    if (
        Array.isArray(
            ContentEngine[type]
        )
    ) {

        ContentEngine[type].push({

            id,

            ...data

        });

    }


    emitContentEvent(
        "contentcreated",
        {
            type,
            id,
            data
        }
    );


    return id;

}


/* =========================================================
   27. CONTENT UPDATE
========================================================= */

async function updateContent(
    type,
    id,
    data
) {

    if (
        !COLLECTIONS[type]
    ) {

        throw new Error(
            "Invalid content type."
        );

    }


    await HistoryVerseFirebase.update(
        COLLECTIONS[type],
        id,
        data
    );


    if (
        Array.isArray(
            ContentEngine[type]
        )
    ) {

        const index =
            ContentEngine[type].findIndex(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (index >= 0) {

            ContentEngine[type][index] = {

                ...ContentEngine[type][index],

                ...data

            };

        }

    }


    emitContentEvent(
        "contentupdated",
        {
            type,
            id,
            data
        }
    );


    return true;

}


/* =========================================================
   28. CONTENT DELETE
========================================================= */

async function deleteContent(
    type,
    id
) {

    if (
        !COLLECTIONS[type]
    ) {

        throw new Error(
            "Invalid content type."
        );

    }


    await HistoryVerseFirebase.delete(
        COLLECTIONS[type],
        id
    );


    if (
        Array.isArray(
            ContentEngine[type]
        )
    ) {

        ContentEngine[type] =
            ContentEngine[type].filter(
                item =>
                    String(item.id) !==
                    String(id)
            );

    }


    emitContentEvent(
        "contentdeleted",
        {
            type,
            id
        }
    );


    return true;

}


/* =========================================================
   29. ARTICLE CARD
========================================================= */

function createArticleCard(
    article,
    options = {}
) {

    const item =
        normalizeArticle(
            article
        );


    const card =
        document.createElement(
            "article"
        );


    card.className =
        options.className ||
        "article-card";


    card.dataset.articleId =
        item.id;


    const image =
        item.image
            ? `
                <div class="article-card-image">
                    <img
                        src="${escapeAttribute(item.image)}"
                        alt="${escapeAttribute(item.title)}"
                        loading="lazy"
                    >
                </div>
              `
            : "";


    const title =
        escapeHTML(
            item.title
        );


    const description =
        escapeHTML(
            item.description
        );


    const category =
        escapeHTML(
            item.category
        );


    card.innerHTML = `

        ${image}

        <div class="article-card-body">

            ${
                category
                    ? `
                        <span class="article-card-category">
                            ${category}
                        </span>
                      `
                    : ""
            }

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

            <button
                type="button"
                data-article-open="${escapeAttribute(item.id)}"
            >
                Read Article
            </button>

        </div>

    `;


    return card;

}


/* =========================================================
   30. ARTICLE RENDERER
========================================================= */

function renderArticle(
    article,
    container
) {

    if (!container) {

        return false;

    }


    const item =
        normalizeArticle(
            article
        );


    container.innerHTML = `

        <article
            class="full-article"
            data-article-id="${escapeAttribute(item.id)}"
        >

            ${
                item.image
                    ? `
                        <img
                            class="full-article-image"
                            src="${escapeAttribute(item.image)}"
                            alt="${escapeAttribute(item.title)}"
                        >
                      `
                    : ""
            }

            <header class="full-article-header">

                <div class="article-meta">

                    ${
                        item.category
                            ? `<span>${escapeHTML(item.category)}</span>`
                            : ""
                    }

                    ${
                        item.period
                            ? `<span>${escapeHTML(item.period)}</span>`
                            : ""
                    }

                </div>

                <h1>
                    ${escapeHTML(item.title)}
                </h1>

                ${
                    item.description
                        ? `
                            <p>
                                ${escapeHTML(item.description)}
                            </p>
                          `
                        : ""
                }

            </header>

            <div class="full-article-content">

                ${sanitizeArticleHTML(item.content)}

            </div>

            ${
                item.sources.length
                    ? `
                        <section class="article-sources">

                            <h2>
                                Sources
                            </h2>

                            <ul>

                                ${item.sources
                                    .map(
                                        source =>
                                            `<li>${escapeHTML(source)}</li>`
                                    )
                                    .join("")
                                }

                            </ul>

                        </section>
                      `
                    : ""
            }

        </article>

    `;


    ContentEngine.currentArticle =
        item;


    return true;

}


/* =========================================================
   31. ARTICLE OPENING
========================================================= */

async function openArticle(
    articleId,
    container = null
) {

    const article =
        await getArticle(
            articleId
        );


    if (!article) {

        notifyContent(
            "Article not found.",
            "error"
        );

        return null;

    }


    if (container) {

        renderArticle(
            article,
            container
        );

    }


    emitContentEvent(
        "articleopened",
        {
            article
        }
    );


    return article;

}


/* =========================================================
   32. ARTICLE EVENT HANDLER
========================================================= */

function setupArticleEvents() {

    document.addEventListener(
        "click",
        async event => {

            const button =
                event.target.closest(
                    "[data-article-open]"
                );


            if (!button) {

                return;

            }


            const id =
                button.dataset.articleOpen;


            if (!id) {

                return;

            }


            const article =
                await getArticle(
                    id
                );


            if (!article) {

                return;

            }


            const target =
                document.querySelector(
                    "[data-article-view]"
                );


            if (target) {

                renderArticle(
                    article,
                    target
                );

            }

        }
    );

}


/* =========================================================
   33. HTML SAFETY
========================================================= */

function escapeHTML(
    value
) {

    return cleanText(
        value
    )
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


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}


/* =========================================================
   34. ARTICLE HTML SANITIZER
========================================================= */

function sanitizeArticleHTML(
    html
) {

    const source =
        cleanText(html);


    if (!source) {

        return "";

    }


    const template =
        document.createElement(
            "template"
        );


    template.innerHTML =
        source;


    const dangerous =
        template.content.querySelectorAll(
            "script, iframe, object, embed, " +
            "form, style, link, meta"
        );


    dangerous.forEach(
        element =>
            element.remove()
    );


    template.content
        .querySelectorAll("*")
        .forEach(
            element => {

                Array.from(
                    element.attributes
                ).forEach(
                    attribute => {

                        const name =
                            attribute.name
                                .toLowerCase();


                        const value =
                            attribute.value
                                .trim()
                                .toLowerCase();


                        if (
                            name.startsWith(
                                "on"
                            )
                        ) {

                            element.removeAttribute(
                                attribute.name
                            );

                        }


                        if (
                            (
                                name === "href" ||
                                name === "src"
                            ) &&
                            value.startsWith(
                                "javascript:"
                            )
                        ) {

                            element.removeAttribute(
                                attribute.name
                            );

                        }

                    }
                );

            }
        );


    return template.innerHTML;

}


/* =========================================================
   35. CONTENT EVENT
========================================================= */

function emitContentEvent(
    eventName,
    detail
) {

    document.dispatchEvent(
        new CustomEvent(
            `historyverse:${eventName}`,
            {
                detail
            }
        )
    );

}


/* =========================================================
   36. NOTIFICATION BRIDGE
========================================================= */

function notifyContent(
    message,
    type = "info"
) {

    if (
        window.HistoryVerse &&
        typeof window.HistoryVerse.notify ===
            "function"
    ) {

        window.HistoryVerse.notify(
            message,
            type
        );

        return;

    }


    console.log(
        `[HistoryVerse ${type}]`,
        message
    );

}


/* =========================================================
   37. LOAD ALL CONTENT
========================================================= */

async function loadAllContent() {

    await getAllArticles();


    const types = [

        "categories",

        "subjects",

        "civilizations",

        "countries",

        "heritage",

        "timeline",

        "gallery",

        "buildings",

        "roads",

        "railways",

        "maps",

        "localHistory",

        "tourismHistory"

    ];


    await Promise.all(
        types.map(
            type =>
                getContentCollection(
                    type
                )
        )
    );


    ContentEngine.initialized =
        true;


    ContentEngine.cacheLoaded =
        true;


    emitContentEvent(
        "contentready",
        {
            articles:
                ContentEngine.articles.length
        }
    );


    return ContentEngine;

}


/* =========================================================
   38. CONTENT INITIALIZATION
========================================================= */

async function initializeContent() {

    if (
        ContentEngine.initialized
    ) {

        return ContentEngine;

    }


    setupArticleEvents();


    try {

        await loadAllContent();

    } catch (error) {

        console.error(
            "Content engine initialization failed:",
            error
        );

    }


    return ContentEngine;

}


/* =========================================================
   39. PUBLIC API
========================================================= */

const HistoryVerseContent = {

    state:
        ContentEngine,

    collections:
        COLLECTIONS,

    normalizeArticle,

    validateArticle,

    getAllArticles,

    getArticle,

    addArticle,

    editArticle,

    deleteArticle,

    publishArticle,

    unpublishArticle,

    setFeatured,

    getPublishedArticles,

    getFeaturedArticles,

    getDraftArticles,

    searchArticles,

    smartSearch,

    getArticlesByCategory,

    getArticlesByCountry,

    getArticlesByCivilization,

    getTimelineEvents,

    getContentCollection,

    createContent,

    updateContent,

    deleteContent,

    createArticleCard,

    renderArticle,

    openArticle,

    loadAllContent,

    initialize:

        initializeContent

};


/* =========================================================
   40. GLOBAL API
========================================================= */

if (
    typeof window !== "undefined"
) {

    window.HistoryVerseContent =
        HistoryVerseContent;

}


/* =========================================================
   41. AUTO INITIALIZATION
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeContent,
        {
            once: true
        }
    );

} else {

    initializeContent();

}


/* =========================================================
   END OF ALON HISTORYVERSE 24 V100
   MASTER CONTENT ENGINE
========================================================= */