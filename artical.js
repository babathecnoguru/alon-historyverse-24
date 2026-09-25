/* =========================================================
   ALON HISTORYVERSE 24
   ARTICLE MANAGEMENT ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/article.js
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ALON_ARTICLE_CONFIG = {

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
            "../html/articles.html",

        article:
            "../html/article.html"

    }

};


/* =========================================================
   CIVILIZATIONS
   ========================================================= */

const ALON_ARTICLE_CIVILIZATIONS = [

    {
        id: "sanatan-hindu-civilization",
        name: "Sanatan Hindu Civilization",
        symbol: "🛕",
        region: "South Asia",
        period: "Ancient to Present"
    },

    {
        id: "mesopotamian-civilizations",
        name: "Mesopotamian Civilizations",
        symbol: "🏺",
        region: "Middle East",
        period: "Ancient"
    },

    {
        id: "ancient-egypt",
        name: "Ancient Egypt",
        symbol: "𓂀",
        region: "Africa",
        period: "Ancient"
    },

    {
        id: "indus-valley-civilization",
        name: "Indus Valley Civilization",
        symbol: "🏛️",
        region: "South Asia",
        period: "Ancient"
    },

    {
        id: "ancient-chinese-civilization",
        name: "Ancient Chinese Civilization",
        symbol: "🏯",
        region: "East Asia",
        period: "Ancient"
    },

    {
        id: "ancient-greek-civilization",
        name: "Ancient Greek Civilization",
        symbol: "🏛️",
        region: "Europe",
        period: "Classical"
    },

    {
        id: "roman-civilization",
        name: "Roman Civilization",
        symbol: "🏛️",
        region: "Europe",
        period: "Classical"
    },

    {
        id: "persian-civilization",
        name: "Persian Civilization",
        symbol: "🏺",
        region: "Middle East",
        period: "Ancient"
    },

    {
        id: "maya-civilization",
        name: "Maya Civilization",
        symbol: "🌎",
        region: "Americas",
        period: "Ancient"
    },

    {
        id: "inca-civilization",
        name: "Inca Civilization",
        symbol: "☀️",
        region: "Americas",
        period: "Ancient"
    },

    {
        id: "aztec-civilization",
        name: "Aztec Civilization",
        symbol: "🌎",
        region: "Americas",
        period: "Ancient"
    },

    {
        id: "byzantine-civilization",
        name: "Byzantine Civilization",
        symbol: "🏛️",
        region: "Europe",
        period: "Medieval"
    },

    {
        id: "khmer-civilization",
        name: "Khmer Civilization",
        symbol: "🏯",
        region: "Asia",
        period: "Medieval"
    },

    {
        id: "nubian-civilization",
        name: "Nubian Civilization",
        symbol: "🏺",
        region: "Africa",
        period: "Ancient"
    },

    {
        id: "olmec-civilization",
        name: "Olmec Civilization",
        symbol: "🌎",
        region: "Americas",
        period: "Ancient"
    },

    {
        id: "classical-japanese-civilization",
        name: "Classical Japanese Civilization",
        symbol: "⛩️",
        region: "Asia",
        period: "Classical"
    }

];


/* =========================================================
   ARTICLE CATEGORIES
   ========================================================= */

const ALON_ARTICLE_CATEGORIES = [

    "History",

    "Civilizations",

    "Countries",

    "Culture",

    "Heritage",

    "Ancient History",

    "Medieval History",

    "Modern History",

    "Science",

    "Technology",

    "Mathematics",

    "Astronomy",

    "Medicine",

    "Philosophy",

    "Religion & Traditions",

    "Art & Architecture",

    "Wars & Battles",

    "Kings & Kingdoms",

    "Literature",

    "Biography",

    "Other"

];


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function articleGetStorage(
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
            "Article storage read error:",
            error
        );

        return fallback;

    }

}


function articleSetStorage(
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
            "Article storage write error:",
            error
        );

        return false;

    }

}


/* =========================================================
   ARTICLE DATA
   ========================================================= */

function getArticles() {

    const articles =
        articleGetStorage(
            ALON_ARTICLE_CONFIG.storage.articles,
            []
        );

    return Array.isArray(articles)
        ? articles
        : [];

}


function saveArticles(
    articles
) {

    return articleSetStorage(
        ALON_ARTICLE_CONFIG.storage.articles,
        Array.isArray(articles)
            ? articles
            : []
    );

}


/* =========================================================
   TRASH
   ========================================================= */

function getArticleTrash() {

    const trash =
        articleGetStorage(
            ALON_ARTICLE_CONFIG.storage.trash,
            []
        );

    return Array.isArray(trash)
        ? trash
        : [];

}


function saveArticleTrash(
    trash
) {

    return articleSetStorage(
        ALON_ARTICLE_CONFIG.storage.trash,
        Array.isArray(trash)
            ? trash
            : []
    );

}


/* =========================================================
   DRAFTS
   ========================================================= */

function getArticleDrafts() {

    const drafts =
        articleGetStorage(
            ALON_ARTICLE_CONFIG.storage.drafts,
            []
        );

    return Array.isArray(drafts)
        ? drafts
        : [];

}


function saveArticleDrafts(
    drafts
) {

    return articleSetStorage(
        ALON_ARTICLE_CONFIG.storage.drafts,
        Array.isArray(drafts)
            ? drafts
            : []
    );

}


/* =========================================================
   ID
   ========================================================= */

function createArticleId() {

    return (
        "article_" +
        Date.now().toString(36) +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


/* =========================================================
   DATE
   ========================================================= */

function articleNow() {

    return new Date().toISOString();

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function articleEscapeHTML(
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
   CIVILIZATION HELPERS
   ========================================================= */

function getArticleCivilizations() {

    return [
        ...ALON_ARTICLE_CIVILIZATIONS
    ];

}


function getCivilizationById(
    civilizationId
) {

    return ALON_ARTICLE_CIVILIZATIONS.find(
        function (civilization) {

            return String(
                civilization.id
            ) === String(
                civilizationId
            );

        }
    ) || null;

}


/* =========================================================
   CATEGORY HELPERS
   ========================================================= */

function getArticleCategoriesList() {

    return [
        ...ALON_ARTICLE_CATEGORIES
    ];

}


/* =========================================================
   CREATE ARTICLE OBJECT
   ========================================================= */

function buildArticleData(
    data = {}
) {

    const civilization =
        getCivilizationById(
            data.civilizationId ||
            data.civilization ||
            ""
        );

    const now =
        articleNow();

    return {

        id:
            data.id ||
            createArticleId(),

        title:
            String(
                data.title ||
                ""
            ).trim(),

        category:
            String(
                data.category ||
                "Other"
            ).trim(),

        civilizationId:
            civilization
                ? civilization.id
                : "",

        civilization:
            civilization
                ? civilization.name
                : "",

        civilizationSymbol:
            civilization
                ? civilization.symbol
                : "",

        civilizationRegion:
            civilization
                ? civilization.region
                : "",

        civilizationPeriod:
            civilization
                ? civilization.period
                : "",

        description:
            String(
                data.description ||
                data.shortDescription ||
                ""
            ).trim(),

        content:
            String(
                data.content ||
                ""
            ).trim(),

        author:
            String(
                data.author ||
                "Baba Thecno Guru"
            ).trim(),

        sources:
            String(
                data.sources ||
                ""
            ).trim(),

        image:
            String(
                data.image ||
                ""
            ).trim(),

        video:
            String(
                data.video ||
                ""
            ).trim(),

        tags:
            Array.isArray(data.tags)
                ? data.tags
                : String(
                    data.tags ||
                    ""
                )
                    .split(",")
                    .map(
                        function (tag) {

                            return tag.trim();

                        }
                    )
                    .filter(Boolean),

        status:
            data.status ||
            "published",

        createdAt:
            data.createdAt ||
            now,

        updatedAt:
            now

    };

}


/* =========================================================
   CREATE ARTICLE
   ========================================================= */

function createArticle(
    data = {}
) {

    const article =
        buildArticleData(
            data
        );

    if (!article.title) {

        return {

            success: false,

            error:
                "Article title is required."

        };

    }

    if (!article.content) {

        return {

            success: false,

            error:
                "Article content is required."

        };

    }

    const articles =
        getArticles();

    articles.push(
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

    return {

        success: true,

        article:
            article

    };

}


/* =========================================================
   UPDATE ARTICLE
   ========================================================= */

function updateArticle(
    articleId,
    data = {}
) {

    const articles =
        getArticles();

    const index =
        articles.findIndex(
            function (article) {

                return String(
                    article.id
                ) === String(
                    articleId
                );

            }
        );

    if (index === -1) {

        return {

            success: false,

            error:
                "Article not found."

        };

    }

    const oldArticle =
        articles[index];

    const updated =
        buildArticleData({

            ...oldArticle,

            ...data,

            id:
                oldArticle.id,

            createdAt:
                oldArticle.createdAt

        });

    if (!updated.title) {

        return {

            success: false,

            error:
                "Article title is required."

        };

    }

    if (!updated.content) {

        return {

            success: false,

            error:
                "Article content is required."

        };

    }

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
                "Article could not be updated."

        };

    }

    return {

        success: true,

        article:
            updated

    };

}


/* =========================================================
   GET ARTICLE
   ========================================================= */

function getArticle(
    articleId
) {

    return getArticles().find(
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
   DELETE ARTICLE
   ========================================================= */

function deleteArticle(
    articleId
) {

    const articles =
        getArticles();

    const index =
        articles.findIndex(
            function (article) {

                return String(
                    article.id
                ) === String(
                    articleId
                );

            }
        );

    if (index === -1) {

        return {

            success: false,

            error:
                "Article not found."

        };

    }

    const article =
        articles[index];

    articles.splice(
        index,
        1
    );

    const saved =
        saveArticles(
            articles
        );

    if (!saved) {

        return {

            success: false,

            error:
                "Article could not be deleted."

        };

    }

    const trash =
        getArticleTrash();

    trash.push({

        ...article,

        deletedAt:
            articleNow()

    });

    saveArticleTrash(
        trash
    );

    return {

        success: true,

        article:
            article

    };

}


/* =========================================================
   RESTORE ARTICLE
   ========================================================= */

function restoreArticle(
    articleId
) {

    const trash =
        getArticleTrash();

    const index =
        trash.findIndex(
            function (article) {

                return String(
                    article.id
                ) === String(
                    articleId
                );

            }
        );

    if (index === -1) {

        return {

            success: false,

            error:
                "Deleted article not found."

        };

    }

    const article =
        trash[index];

    trash.splice(
        index,
        1
    );

    saveArticleTrash(
        trash
    );

    const articles =
        getArticles();

    articles.push({

        ...article,

        status:
            "published",

        updatedAt:
            articleNow()

    });

    saveArticles(
        articles
    );

    return {

        success: true,

        article:
            article

    };

}


/* =========================================================
   PERMANENT DELETE
   ========================================================= */

function permanentlyDeleteArticle(
    articleId
) {

    const trash =
        getArticleTrash();

    const filtered =
        trash.filter(
            function (article) {

                return String(
                    article.id
                ) !== String(
                    articleId
                );

            }
        );

    if (
        filtered.length ===
        trash.length
    ) {

        return {

            success: false,

            error:
                "Deleted article not found."

        };

    }

    saveArticleTrash(
        filtered
    );

    return {

        success: true

    };

}


/* =========================================================
   DRAFT CREATE
   ========================================================= */

function saveArticleDraft(
    data = {}
) {

    const drafts =
        getArticleDrafts();

    const draft =
        {

            ...data,

            id:
                data.id ||
                createArticleId(),

            savedAt:
                articleNow()

        };

    const index =
        drafts.findIndex(
            function (item) {

                return String(
                    item.id
                ) === String(
                    draft.id
                );

            }
        );

    if (index >= 0) {

        drafts[index] =
            draft;

    } else {

        drafts.push(
            draft
        );

    }

    saveArticleDrafts(
        drafts
    );

    return {

        success: true,

        draft:
            draft

    };

}


/* =========================================================
   DELETE DRAFT
   ========================================================= */

function deleteArticleDraft(
    draftId
) {

    const drafts =
        getArticleDrafts();

    const filtered =
        drafts.filter(
            function (draft) {

                return String(
                    draft.id
                ) !== String(
                    draftId
                );

            }
        );

    saveArticleDrafts(
        filtered
    );

    return {

        success: true

    };

}


/* =========================================================
   ARTICLES BY CIVILIZATION
   ========================================================= */

function getArticlesByCivilization(
    civilizationId
) {

    if (!civilizationId) {

        return [];

    }

    return getArticles().filter(
        function (article) {

            return String(
                article.civilizationId ||
                ""
            ) === String(
                civilizationId
            );

        }
    );

}


/* =========================================================
   ARTICLES BY CATEGORY
   ========================================================= */

function getArticlesByCategory(
    category
) {

    if (
        !category ||
        String(category).toLowerCase() === "all"
    ) {

        return getArticles();

    }

    return getArticles().filter(
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


/* =========================================================
   SEARCH ARTICLES
   ========================================================= */

function searchManagedArticles(
    query = ""
) {

    const search =
        String(
            query
        )
            .trim()
            .toLowerCase();

    if (!search) {

        return getArticles();

    }

    return getArticles().filter(
        function (article) {

            const searchable = [

                article.title,

                article.category,

                article.civilization,

                article.description,

                article.content,

                article.author,

                article.sources,

                ...(Array.isArray(article.tags)
                    ? article.tags
                    : [])

            ]
                .join(" ")
                .toLowerCase();

            return searchable.includes(
                search
            );

        }
    );

}


/* =========================================================
   ARTICLE COUNTS
   ========================================================= */

function getManagedArticleCount() {

    return getArticles().length;

}


function getCivilizationArticleCount(
    civilizationId
) {

    return getArticlesByCivilization(
        civilizationId
    ).length;

}


/* =========================================================
   RENDER CIVILIZATION SELECT
   ========================================================= */

function renderCivilizationSelect(
    select
) {

    if (!select) {

        return;

    }

    const current =
        select.value;

    select.innerHTML = `

        <option value="">
            Select Civilization
        </option>

    `;

    ALON_ARTICLE_CIVILIZATIONS.forEach(
        function (civilization) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                civilization.id;

            option.textContent =
                civilization.symbol +
                " " +
                civilization.name;

            select.appendChild(
                option
            );

        }
    );

    if (current) {

        select.value =
            current;

    }

}


/* =========================================================
   RENDER CATEGORY SELECT
   ========================================================= */

function renderCategorySelect(
    select
) {

    if (!select) {

        return;

    }

    const current =
        select.value;

    select.innerHTML = `

        <option value="">
            Select Category
        </option>

    `;

    ALON_ARTICLE_CATEGORIES.forEach(
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

    if (current) {

        select.value =
            current;

    }

}


/* =========================================================
   FORM HELPERS
   ========================================================= */

function getArticleFormData(
    form
) {

    if (!form) {

        return {};

    }

    const formData =
        new FormData(
            form
        );

    return {

        title:
            formData.get(
                "title"
            ) || "",

        category:
            formData.get(
                "category"
            ) || "",

        civilizationId:
            formData.get(
                "civilizationId"
            ) ||
            formData.get(
                "civilization"
            ) ||
            "",

        description:
            formData.get(
                "description"
            ) ||
            formData.get(
                "shortDescription"
            ) ||
            "",

        content:
            formData.get(
                "content"
            ) || "",

        author:
            formData.get(
                "author"
            ) || "Baba Thecno Guru",

        sources:
            formData.get(
                "sources"
            ) || "",

        image:
            formData.get(
                "image"
            ) || "",

        video:
            formData.get(
                "video"
            ) || "",

        tags:
            formData.get(
                "tags"
            ) || ""

    };

}


/* =========================================================
   FORM CREATE
   ========================================================= */

function setupArticleCreateForm(
    form
) {

    if (!form) {

        return;

    }

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const data =
                getArticleFormData(
                    form
                );

            const result =
                createArticle(
                    data
                );

            if (!result.success) {

                alert(
                    result.error
                );

                return;

            }

            form.reset();

            window.dispatchEvent(
                new CustomEvent(
                    "alonArticleCreated",
                    {
                        detail:
                            result.article
                    }
                )
            );

            alert(
                "Article saved successfully."
            );

        }
    );

}


/* =========================================================
   FORM UPDATE
   ========================================================= */

function setupArticleEditForm(
    form,
    articleId
) {

    if (!form || !articleId) {

        return;

    }

    const article =
        getArticle(
            articleId
        );

    if (!article) {

        return;

    }

    const title =
        form.elements.namedItem(
            "title"
        );

    const category =
        form.elements.namedItem(
            "category"
        );

    const civilization =
        form.elements.namedItem(
            "civilizationId"
        ) ||
        form.elements.namedItem(
            "civilization"
        );

    const description =
        form.elements.namedItem(
            "description"
        );

    const content =
        form.elements.namedItem(
            "content"
        );

    const author =
        form.elements.namedItem(
            "author"
        );

    const sources =
        form.elements.namedItem(
            "sources"
        );

    const image =
        form.elements.namedItem(
            "image"
        );

    const video =
        form.elements.namedItem(
            "video"
        );

    const tags =
        form.elements.namedItem(
            "tags"
        );


    if (title) {

        title.value =
            article.title || "";

    }

    if (category) {

        category.value =
            article.category || "";

    }

    if (civilization) {

        civilization.value =
            article.civilizationId || "";

    }

    if (description) {

        description.value =
            article.description || "";

    }

    if (content) {

        content.value =
            article.content || "";

    }

    if (author) {

        author.value =
            article.author ||
            "Baba Thecno Guru";

    }

    if (sources) {

        sources.value =
            article.sources || "";

    }

    if (image) {

        image.value =
            article.image || "";

    }

    if (video) {

        video.value =
            article.video || "";

    }

    if (tags) {

        tags.value =
            Array.isArray(article.tags)
                ? article.tags.join(", ")
                : "";

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const data =
                getArticleFormData(
                    form
                );

            const result =
                updateArticle(
                    articleId,
                    data
                );

            if (!result.success) {

                alert(
                    result.error
                );

                return;

            }

            window.dispatchEvent(
                new CustomEvent(
                    "alonArticleUpdated",
                    {
                        detail:
                            result.article
                    }
                )
            );

            alert(
                "Article updated successfully."
            );

        }
    );

}


/* =========================================================
   ARTICLE DELETE BUTTON
   ========================================================= */

function setupArticleDeleteButton(
    button,
    articleId
) {

    if (!button || !articleId) {

        return;

    }

    button.addEventListener(
        "click",
        function () {

            const confirmed =
                window.confirm(
                    "Delete this article?"
                );

            if (!confirmed) {

                return;

            }

            const result =
                deleteArticle(
                    articleId
                );

            if (!result.success) {

                alert(
                    result.error
                );

                return;

            }

            window.dispatchEvent(
                new CustomEvent(
                    "alonArticleDeleted",
                    {
                        detail:
                            result.article
                    }
                )
            );

            alert(
                "Article moved to Trash."
            );

        }
    );

}


/* =========================================================
   CIVILIZATION ARTICLE LINK
   ========================================================= */

function getCivilizationArticlesURL(
    civilizationId
) {

    return (
        ALON_ARTICLE_CONFIG.paths.articles +
        "?civilization=" +
        encodeURIComponent(
            civilizationId
        )
    );

}


/* =========================================================
   ARTICLE DATA EXPORT
   ========================================================= */

function exportArticlesData() {

    const data = {

        project:
            ALON_ARTICLE_CONFIG.project,

        version:
            ALON_ARTICLE_CONFIG.version,

        exportedAt:
            articleNow(),

        articles:
            getArticles(),

        trash:
            getArticleTrash(),

        drafts:
            getArticleDrafts()

    };

    return data;

}


/* =========================================================
   GLOBAL ARTICLE API
   ========================================================= */

window.ALON_ARTICLE = {

    config:
        ALON_ARTICLE_CONFIG,

    civilizations:
        getArticleCivilizations,

    categories:
        getArticleCategoriesList,

    get:
        getArticle,

    getAll:
        getArticles,

    create:
        createArticle,

    update:
        updateArticle,

    delete:
        deleteArticle,

    restore:
        restoreArticle,

    permanentDelete:
        permanentlyDeleteArticle,

    drafts:
        getArticleDrafts,

    saveDraft:
        saveArticleDraft,

    deleteDraft:
        deleteArticleDraft,

    byCivilization:
        getArticlesByCivilization,

    byCategory:
        getArticlesByCategory,

    search:
        searchManagedArticles,

    count:
        getManagedArticleCount,

    civilizationCount:
        getCivilizationArticleCount,

    getCivilization:
        getCivilizationById,

    civilizationURL:
        getCivilizationArticlesURL,

    renderCivilizationSelect:
        renderCivilizationSelect,

    renderCategorySelect:
        renderCategorySelect,

    getFormData:
        getArticleFormData,

    setupCreateForm:
        setupArticleCreateForm,

    setupEditForm:
        setupArticleEditForm,

    setupDeleteButton:
        setupArticleDeleteButton,

    export:
        exportArticlesData

};


/* =========================================================
   AUTO SELECT SETUP
   ========================================================= */

function initializeArticleManagement() {

    const civilizationSelect =
        document.querySelector(
            '[name="civilizationId"]'
        ) ||
        document.querySelector(
            '[name="civilization"]'
        ) ||
        document.getElementById(
            "articleCivilization"
        );

    if (civilizationSelect) {

        renderCivilizationSelect(
            civilizationSelect
        );

    }


    const categorySelect =
        document.querySelector(
            '[name="category"]'
        ) ||
        document.getElementById(
            "articleCategory"
        );

    if (categorySelect) {

        renderCategorySelect(
            categorySelect
        );

    }

}


/* =========================================================
   AUTO INITIALIZATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeArticleManagement
    );

} else {

    initializeArticleManagement();

}


/* =========================================================
   END OF ARTICLE.JS
   ALON HISTORYVERSE 24
   ========================================================= */