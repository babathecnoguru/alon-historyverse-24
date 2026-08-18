/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/articles.js
   ARTICLE MANAGEMENT ENGINE
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   STORAGE CONFIG
========================================================= */

const ARTICLE_STORAGE_KEY =
    "alon_historyverse_articles";


const ARTICLE_VERSION =
    "ALON-ARTICLES-100";


/* =========================================================
   DEFAULT ARTICLES
========================================================= */

const DEFAULT_ARTICLES = [

    {
        id: "bhagavad-gita",

        title: {
            en: "Bhagavad Gita",
            hi: "श्रीमद्भगवद्गीता"
        },

        description: {
            en:
                "Explore the historical and cultural significance of the Bhagavad Gita.",

            hi:
                "श्रीमद्भगवद्गीता के ऐतिहासिक और सांस्कृतिक महत्व को जानें।"
        },

        content: {
            en:
                "The Bhagavad Gita is one of the important texts of Indian philosophical and spiritual tradition.",

            hi:
                "श्रीमद्भगवद्गीता भारतीय दार्शनिक और आध्यात्मिक परंपरा के महत्वपूर्ण ग्रंथों में से एक है।"
        },

        category:
            "Religion & Philosophy",

        author:
            "Baba Thecno Guru",

        image:
            "",

        status:
            "published",

        featured:
            true,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    },


    {
        id: "indus-valley",

        title: {
            en:
                "Indus Valley Civilization",

            hi:
                "सिंधु घाटी सभ्यता"
        },

        description: {
            en:
                "Discover one of the world's earliest urban civilizations.",

            hi:
                "दुनिया की प्राचीनतम नगरीय सभ्यताओं में से एक के बारे में जानें।"
        },

        content: {
            en:
                "The Indus Valley Civilization developed across parts of South Asia and became known for planned cities, craft production, trade and water management.",

            hi:
                "सिंधु घाटी सभ्यता दक्षिण एशिया के विभिन्न भागों में विकसित हुई और नियोजित नगरों, शिल्प, व्यापार तथा जल प्रबंधन के लिए जानी जाती है।"
        },

        category:
            "Ancient History",

        author:
            "Baba Thecno Guru",

        image:
            "",

        status:
            "published",

        featured:
            true,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    },


    {
        id: "ancient-egypt",

        title: {
            en:
                "Ancient Egypt",

            hi:
                "प्राचीन मिस्र"
        },

        description: {
            en:
                "Explore the civilization of the Nile and its remarkable cultural legacy.",

            hi:
                "नील नदी की सभ्यता और उसकी अद्भुत सांस्कृतिक विरासत को जानें।"
        },

        content: {
            en:
                "Ancient Egypt developed around the Nile River and produced monumental architecture, writing systems and rich cultural traditions.",

            hi:
                "प्राचीन मिस्र नील नदी के आसपास विकसित हुआ और उसने विशाल वास्तुकला, लेखन प्रणालियों तथा समृद्ध सांस्कृतिक परंपराओं को जन्म दिया।"
        },

        category:
            "Ancient History",

        author:
            "Baba Thecno Guru",

        image:
            "",

        status:
            "draft",

        featured:
            false,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    }

];


/* =========================================================
   INTERNAL HELPERS
========================================================= */

function generateArticleId(
    title
) {

    const base =
        String(title || "article")
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            );


    const suffix =
        Date.now()
            .toString(36);


    return (
        base ||
        "article"
    ) +
        "-" +
        suffix;

}


/* =========================================================
   SAFE STORAGE READ
========================================================= */

function readArticles() {

    try {

        const saved =
            localStorage.getItem(
                ARTICLE_STORAGE_KEY
            );


        if (!saved) {

            return [
                ...DEFAULT_ARTICLES
            ];

        }


        const parsed =
            JSON.parse(saved);


        if (
            !Array.isArray(parsed)
        ) {

            return [
                ...DEFAULT_ARTICLES
            ];

        }


        return parsed;

    } catch (error) {

        console.error(
            "HistoryVerse article storage error:",
            error
        );


        return [
            ...DEFAULT_ARTICLES
        ];

    }

}


/* =========================================================
   SAVE ARTICLES
========================================================= */

function saveArticles(
    articles
) {

    try {

        localStorage.setItem(
            ARTICLE_STORAGE_KEY,
            JSON.stringify(
                articles
            )
        );


        return true;

    } catch (error) {

        console.error(
            "Unable to save articles:",
            error
        );


        return false;

    }

}


/* =========================================================
   INITIALIZE STORAGE
========================================================= */

export function initializeArticles() {

    try {

        const existing =
            localStorage.getItem(
                ARTICLE_STORAGE_KEY
            );


        if (!existing) {

            saveArticles(
                DEFAULT_ARTICLES
            );

        }

    } catch (error) {

        console.error(
            "Article initialization failed:",
            error
        );

    }

}


/* =========================================================
   GET ALL ARTICLES
========================================================= */

export function getArticles() {

    return readArticles();

}


/* =========================================================
   GET ARTICLE BY ID
========================================================= */

export function getArticleById(
    id
) {

    if (!id) {
        return null;
    }


    return readArticles().find(
        article =>
            article.id === id
    ) || null;

}


/* =========================================================
   GET PUBLISHED ARTICLES
========================================================= */

export function getPublishedArticles() {

    return readArticles().filter(
        article =>
            article.status ===
            "published"
    );

}


/* =========================================================
   GET DRAFT ARTICLES
========================================================= */

export function getDraftArticles() {

    return readArticles().filter(
        article =>
            article.status ===
            "draft"
    );

}


/* =========================================================
   GET FEATURED ARTICLES
========================================================= */

export function getFeaturedArticles() {

    return readArticles().filter(
        article =>
            article.status ===
                "published" &&
            article.featured === true
    );

}


/* =========================================================
   CREATE ARTICLE
========================================================= */

export function createArticle(
    articleData = {}
) {

    const now =
        new Date().toISOString();


    const title =
        articleData.title || {};


    const englishTitle =
        String(
            title.en ||
            articleData.titleEn ||
            ""
        ).trim();


    const hindiTitle =
        String(
            title.hi ||
            articleData.titleHi ||
            ""
        ).trim();


    if (
        !englishTitle &&
        !hindiTitle
    ) {

        return {

            success: false,

            error:
                "Article title is required."

        };

    }


    const articles =
        readArticles();


    const article = {

        id:
            articleData.id ||
            generateArticleId(
                englishTitle ||
                hindiTitle
            ),

        title: {

            en:
                englishTitle,

            hi:
                hindiTitle

        },

        description: {

            en:
                String(
                    articleData.description?.en ||
                    articleData.descriptionEn ||
                    ""
                ).trim(),

            hi:
                String(
                    articleData.description?.hi ||
                    articleData.descriptionHi ||
                    ""
                ).trim()

        },

        content: {

            en:
                String(
                    articleData.content?.en ||
                    articleData.contentEn ||
                    ""
                ).trim(),

            hi:
                String(
                    articleData.content?.hi ||
                    articleData.contentHi ||
                    ""
                ).trim()

        },

        category:
            String(
                articleData.category ||
                "General History"
            ).trim(),

        author:
            String(
                articleData.author ||
                "Baba Thecno Guru"
            ).trim(),

        image:
            String(
                articleData.image ||
                ""
            ).trim(),

        status:
            articleData.status ===
                "published"
                ? "published"
                : "draft",

        featured:
            articleData.featured === true,

        createdAt:
            articleData.createdAt ||
            now,

        updatedAt:
            now

    };


    articles.unshift(
        article
    );


    const saved =
        saveArticles(
            articles
        );


    if (!saved) {

        return {

            success: false,

            error:
                "Article could not be saved."

        };

    }


    dispatchArticleEvent(
        "created",
        article
    );


    return {

        success: true,

        article

    };

}


/* =========================================================
   UPDATE ARTICLE
========================================================= */

export function updateArticle(
    id,
    updates = {}
) {

    if (!id) {

        return {

            success: false,

            error:
                "Article ID is required."

        };

    }


    const articles =
        readArticles();


    const index =
        articles.findIndex(
            article =>
                article.id === id
        );


    if (index === -1) {

        return {

            success: false,

            error:
                "Article not found."

        };

    }


    const current =
        articles[index];


    const updated = {

        ...current,

        ...updates,

        title: {

            ...current.title,

            ...(updates.title || {})

        },

        description: {

            ...current.description,

            ...(updates.description || {})

        },

        content: {

            ...current.content,

            ...(updates.content || {})

        },

        updatedAt:
            new Date().toISOString()

    };


    if (
        updates.status !== undefined
    ) {

        updated.status =
            updates.status ===
                "published"
                ? "published"
                : "draft";

    }


    updated.featured =
        updates.featured === true;


    articles[index] =
        updated;


    const saved =
        saveArticles(
            articles
        );


    if (!saved) {

        return {

            success: false,

            error:
                "Article update failed."

        };

    }


    dispatchArticleEvent(
        "updated",
        updated
    );


    return {

        success: true,

        article:
            updated

    };

}


/* =========================================================
   DELETE ARTICLE
========================================================= */

export function deleteArticle(
    id
) {

    if (!id) {

        return {

            success: false,

            error:
                "Article ID is required."

        };

    }


    const articles =
        readArticles();


    const article =
        articles.find(
            item =>
                item.id === id
        );


    if (!article) {

        return {

            success: false,

            error:
                "Article not found."

        };

    }


    const remaining =
        articles.filter(
            item =>
                item.id !== id
        );


    const saved =
        saveArticles(
            remaining
        );


    if (!saved) {

        return {

            success: false,

            error:
                "Article deletion failed."

        };

    }


    dispatchArticleEvent(
        "deleted",
        article
    );


    return {

        success: true,

        article

    };

}


/* =========================================================
   PUBLISH ARTICLE
========================================================= */

export function publishArticle(
    id
) {

    return updateArticle(
        id,
        {
            status:
                "published"
        }
    );

}


/* =========================================================
   MOVE TO DRAFT
========================================================= */

export function draftArticle(
    id
) {

    return updateArticle(
        id,
        {
            status:
                "draft"
        }
    );

}


/* =========================================================
   FEATURE / UNFEATURE
========================================================= */

export function setFeatured(
    id,
    value = true
) {

    return updateArticle(
        id,
        {
            featured:
                value === true
        }
    );

}


/* =========================================================
   ARTICLE SEARCH
========================================================= */

export function searchArticles(
    query,
    options = {}
) {

    const term =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();


    const articles =
        readArticles();


    let results =
        articles;


    if (options.publishedOnly) {

        results =
            results.filter(
                article =>
                    article.status ===
                    "published"
            );

    }


    if (
        options.category
    ) {

        const category =
            String(
                options.category
            )
                .trim()
                .toLowerCase();


        results =
            results.filter(
                article =>
                    String(
                        article.category
                    )
                        .toLowerCase()
                        .includes(
                            category
                        )
            );

    }


    if (!term) {

        return results;

    }


    return results.filter(
        article => {

            const searchable =
                [

                    article.title?.en,

                    article.title?.hi,

                    article.description?.en,

                    article.description?.hi,

                    article.content?.en,

                    article.content?.hi,

                    article.category,

                    article.author

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


            return searchable.includes(
                term
            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

export function getArticlesByCategory(
    category
) {

    if (!category) {

        return getArticles();

    }


    const target =
        String(
            category
        )
            .trim()
            .toLowerCase();


    return readArticles().filter(
        article =>
            String(
                article.category
            )
                .toLowerCase() ===
            target
    );

}


/* =========================================================
   GET CATEGORIES
========================================================= */

export function getArticleCategories() {

    const categories =
        readArticles()
            .map(
                article =>
                    article.category
            )
            .filter(Boolean);


    return [
        ...new Set(
            categories
        )
    ];

}


/* =========================================================
   LANGUAGE-SAFE TITLE
========================================================= */

export function getArticleTitle(
    article,
    language = "en"
) {

    if (!article) {
        return "";
    }


    const title =
        article.title || {};


    return (

        title[language] ||

        title.en ||

        title.hi ||

        ""

    );

}


/* =========================================================
   LANGUAGE-SAFE DESCRIPTION
========================================================= */

export function getArticleDescription(
    article,
    language = "en"
) {

    if (!article) {
        return "";
    }


    const description =
        article.description || {};


    return (

        description[language] ||

        description.en ||

        description.hi ||

        ""

    );

}


/* =========================================================
   LANGUAGE-SAFE CONTENT
========================================================= */

export function getArticleContent(
    article,
    language = "en"
) {

    if (!article) {
        return "";
    }


    const content =
        article.content || {};


    return (

        content[language] ||

        content.en ||

        content.hi ||

        ""

    );

}


/* =========================================================
   ARTICLE IMAGE
========================================================= */

export function getArticleImage(
    article
) {

    if (!article) {
        return "";
    }


    return article.image || "";

}


/* =========================================================
   ARTICLE STATUS
========================================================= */

export function getArticleStatus(
    article
) {

    if (!article) {
        return "draft";
    }


    return article.status ===
        "published"
        ? "published"
        : "draft";

}


/* =========================================================
   ARTICLE CARD HTML
========================================================= */

export function createArticleCard(
    article,
    language = "en"
) {

    if (!article) {
        return "";
    }


    const title =
        escapeHTML(
            getArticleTitle(
                article,
                language
            )
        );


    const description =
        escapeHTML(
            getArticleDescription(
                article,
                language
            )
        );


    const category =
        escapeHTML(
            article.category ||
            "History"
        );


    const author =
        escapeHTML(
            article.author ||
            "Baba Thecno Guru"
        );


    const image =
        escapeHTML(
            article.image || ""
        );


    const imageHTML =
        image

            ? `

                <div class="article-card-image">

                    <img
                        src="${image}"
                        alt="${title}"
                        loading="lazy"
                    >

                </div>

            `

            : `

                <div class="article-card-image article-card-placeholder">

                    <span>
                        📜
                    </span>

                </div>

            `;


    return `

        <article
            class="article-card"
            data-article-id="${escapeHTML(
                article.id
            )}"
            tabindex="0"
            role="link"
        >

            ${imageHTML}


            <div class="article-card-body">

                <div class="article-card-category">

                    ${category}

                </div>


                <h3 class="article-card-title">

                    ${title}

                </h3>


                <p class="article-card-description">

                    ${description}

                </p>


                <div class="article-card-meta">

                    <span>
                        ${author}
                    </span>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   ARTICLE COUNTS
========================================================= */

export function getArticleStats() {

    const articles =
        readArticles();


    return {

        total:
            articles.length,

        published:
            articles.filter(
                article =>
                    article.status ===
                    "published"
            ).length,

        drafts:
            articles.filter(
                article =>
                    article.status ===
                    "draft"
            ).length,

        featured:
            articles.filter(
                article =>
                    article.featured === true
            ).length

    };

}


/* =========================================================
   RESET ARTICLES
========================================================= */

export function resetArticles() {

    const copied =
        DEFAULT_ARTICLES.map(
            article => ({
                ...article,

                title: {
                    ...article.title
                },

                description: {
                    ...article.description
                },

                content: {
                    ...article.content
                }

            })
        );


    const saved =
        saveArticles(
            copied
        );


    if (saved) {

        dispatchArticleEvent(
            "reset",
            copied
        );

    }


    return saved;

}


/* =========================================================
   ARTICLE EVENTS
========================================================= */

function dispatchArticleEvent(
    action,
    data
) {

    document.dispatchEvent(
        new CustomEvent(
            "historyverse:article",
            {
                detail: {

                    action,

                    data,

                    version:
                        ARTICLE_VERSION

                }

            }
        )
    );

}


/* =========================================================
   STORAGE EVENT
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key !==
            ARTICLE_STORAGE_KEY
        ) {

            return;

        }


        document.dispatchEvent(
            new CustomEvent(
                "historyverse:articlesync",
                {
                    detail: {
                        articles:
                            readArticles()
                    }
                }
            )
        );

    }
);


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
   GLOBAL ARTICLE API
========================================================= */

window.ALON_ARTICLE_ENGINE = {

    getAll:
        getArticles,

    getById:
        getArticleById,

    getPublished:
        getPublishedArticles,

    getDrafts:
        getDraftArticles,

    getFeatured:
        getFeaturedArticles,

    create:
        createArticle,

    update:
        updateArticle,

    delete:
        deleteArticle,

    publish:
        publishArticle,

    draft:
        draftArticle,

    setFeatured,

    search:
        searchArticles,

    getByCategory:
        getArticlesByCategory,

    getCategories:
        getArticleCategories,

    stats:
        getArticleStats,

    reset:
        resetArticles

};


/* =========================================================
   INITIALIZE
========================================================= */

initializeArticles();


/* =========================================================
   END OF ARTICLE ENGINE
========================================================= */