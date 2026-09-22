/* =========================================================
   ALON HISTORYVERSE 24
   ADMIN MANAGEMENT SYSTEM + SECURITY LAYER
   Creator: Baba Thecno Guru
   Version: 25.0 SECURITY READY
   File: jss/admin.js

   IMPORTANT:
   - Existing article functions preserved.
   - Existing storage keys preserved.
   - LocalStorage admin flag is NOT trusted.
   - Real authorization must come from secure backend.
   - Owner credentials are NEVER stored in this file.
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
========================================================= */

const ALON_ADMIN_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "25.0 SECURITY READY",

    storage: {

        articles:
            "alon_historyverse_articles",

        drafts:
            "alon_historyverse_article_drafts",

        trash:
            "alon_historyverse_article_trash",

        login:
            "alon_historyverse_logged_in",

        admin:
            "alon_historyverse_admin_logged_in",

        securitySession:
            "alon_historyverse_security_session"

    },

    /*
       DO NOT PUT OWNER PASSWORD OR SECRET HERE.

       Example when backend is ready:

       window.ALON_SECURITY_API =
           "https://your-secure-api.example.com";
    */

    security: {

        sessionEndpoint:
            "/api/admin/session",

        loginEndpoint:
            "/api/admin/login",

        logoutEndpoint:
            "/api/admin/logout",

        auditEndpoint:
            "/api/admin/audit",

        timeout:
            5 * 60 * 1000

    }

};


/* =========================================================
   SECURITY STATE
========================================================= */

let ALON_SECURITY_STATE = {

    authenticated:
        false,

    owner:
        false,

    sessionId:
        null,

    expiresAt:
        null,

    checked:
        false,

    backendAvailable:
        false

};


/* =========================================================
   SECURITY API
========================================================= */

function getSecurityAPI() {

    const configured =
        window.ALON_SECURITY_API;

    if (
        configured &&
        typeof configured === "string"
    ) {

        return configured.replace(
            /\/+$/,
            ""
        );

    }

    return "";

}


/* =========================================================
   SECURITY FETCH
========================================================= */

async function securityFetch(
    path,
    options = {}
) {

    const api =
        getSecurityAPI();

    if (!api) {

        throw new Error(
            "Secure Admin API is not configured."
        );

    }


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {})

    };


    const response =
        await fetch(
            api + path,
            {
                ...options,
                headers,
                credentials:
                    "include"
            }
        );


    let data =
        null;


    try {

        data =
            await response.json();

    } catch {

        data =
            null;

    }


    if (!response.ok) {

        const error =
            new Error(
                data &&
                data.message
                    ? data.message
                    : "Security request failed."
            );

        error.status =
            response.status;

        error.data =
            data;

        throw error;

    }


    return data;

}


/* =========================================================
   SECURITY SESSION
========================================================= */

function saveSecuritySession(
    session
) {

    try {

        localStorage.setItem(
            ALON_ADMIN_CONFIG.storage.securitySession,
            JSON.stringify(
                {
                    authenticated:
                        true,

                    owner:
                        true,

                    sessionId:
                        session.sessionId ||
                        null,

                    expiresAt:
                        session.expiresAt ||
                        null
                }
            )
        );

    } catch (error) {

        console.error(
            "Security session storage error:",
            error
        );

    }

}


/* =========================================================
   CLEAR SECURITY SESSION
========================================================= */

function clearSecuritySession() {

    try {

        localStorage.removeItem(
            ALON_ADMIN_CONFIG.storage.securitySession
        );

        /*
           Old admin flag is deliberately
           removed as well.
        */

        localStorage.removeItem(
            ALON_ADMIN_CONFIG.storage.admin
        );

    } catch (error) {

        console.error(
            "Security session clear error:",
            error
        );

    }


    ALON_SECURITY_STATE = {

        authenticated:
            false,

        owner:
            false,

        sessionId:
            null,

        expiresAt:
            null,

        checked:
            true,

        backendAvailable:
            ALON_SECURITY_STATE.backendAvailable

    };

}


/* =========================================================
   READ CACHED SESSION
========================================================= */

function getCachedSecuritySession() {

    try {

        const raw =
            localStorage.getItem(
                ALON_ADMIN_CONFIG.storage.securitySession
            );


        if (!raw) {

            return null;

        }


        const session =
            JSON.parse(raw);


        if (
            !session ||
            session.authenticated !== true ||
            session.owner !== true
        ) {

            return null;

        }


        if (
            session.expiresAt
        ) {

            const expiry =
                new Date(
                    session.expiresAt
                ).getTime();


            if (
                Number.isFinite(expiry) &&
                Date.now() >= expiry
            ) {

                clearSecuritySession();

                return null;

            }

        }


        return session;

    } catch (error) {

        console.error(
            "Cached security session error:",
            error
        );

        return null;

    }

}


/* =========================================================
   VERIFY OWNER SESSION
========================================================= */

async function verifyOwnerSession() {

    const api =
        getSecurityAPI();


    /*
       FAIL CLOSED

       Without a configured secure backend,
       browser storage cannot create Admin access.
    */

    if (!api) {

        ALON_SECURITY_STATE = {

            authenticated:
                false,

            owner:
                false,

            sessionId:
                null,

            expiresAt:
                null,

            checked:
                true,

            backendAvailable:
                false

        };

        return false;

    }


    try {

        const result =
            await securityFetch(
                ALON_ADMIN_CONFIG.security.sessionEndpoint,
                {
                    method:
                        "GET"
                }
            );


        if (
            result &&
            result.authenticated === true &&
            result.owner === true
        ) {

            ALON_SECURITY_STATE = {

                authenticated:
                    true,

                owner:
                    true,

                sessionId:
                    result.sessionId ||
                    null,

                expiresAt:
                    result.expiresAt ||
                    null,

                checked:
                    true,

                backendAvailable:
                    true

            };


            saveSecuritySession(
                ALON_SECURITY_STATE
            );


            return true;

        }


        clearSecuritySession();

        ALON_SECURITY_STATE.backendAvailable =
            true;

        return false;

    } catch (error) {

        console.error(
            "Owner session verification failed:",
            error
        );


        clearSecuritySession();

        ALON_SECURITY_STATE.backendAvailable =
            true;

        return false;

    }

}


/* =========================================================
   ADMIN AUTHORIZATION
========================================================= */

function isAdminLoggedIn() {

    /*
       IMPORTANT:

       Do NOT trust this value from LocalStorage.

       It is retained only for compatibility
       with old ALON code.

       Real authorization is ALON_SECURITY_STATE.
    */

    return (
        ALON_SECURITY_STATE.authenticated === true &&
        ALON_SECURITY_STATE.owner === true
    );

}


/* =========================================================
   USER LOGIN
========================================================= */

function isUserLoggedIn() {

    return (
        localStorage.getItem(
            ALON_ADMIN_CONFIG.storage.login
        ) === "true"
    );

}


/* =========================================================
   REQUIRE OWNER
========================================================= */

function requireAdminLogin() {

    if (
        !isAdminLoggedIn()
    ) {

        showAdminMessage(
            "Owner Admin authentication required.",
            "warning"
        );

        lockAdminControls();

        return false;

    }

    return true;

}


/* =========================================================
   LOCK ADMIN CONTROLS
========================================================= */

function lockAdminControls() {

    document
        .querySelectorAll(
            "[data-admin-only]"
        )
        .forEach(
            element => {

                element.style.display =
                    "none";

            }
        );


    document
        .querySelectorAll(
            "[data-admin-login-required]"
        )
        .forEach(
            element => {

                element.style.display =
                    "";

            }
        );


    const status =
        document.getElementById(
            "adminLoginStatus"
        );


    if (status) {

        status.textContent =
            "Owner authentication required.";

    }

}


/* =========================================================
   OWNER LOGIN
========================================================= */

async function adminLogin(
    credentials = {}
) {

    const api =
        getSecurityAPI();


    if (!api) {

        showAdminMessage(
            "Secure Admin API is not configured. Admin access remains locked.",
            "error"
        );

        lockAdminControls();

        return false;

    }


    try {

        const result =
            await securityFetch(
                ALON_ADMIN_CONFIG.security.loginEndpoint,
                {
                    method:
                        "POST",

                    body:
                        JSON.stringify(
                            credentials
                        )
                }
            );


        if (
            !result ||
            result.authenticated !== true ||
            result.owner !== true
        ) {

            clearSecuritySession();

            showAdminMessage(
                "Owner authentication failed.",
                "error"
            );

            lockAdminControls();

            return false;

        }


        ALON_SECURITY_STATE = {

            authenticated:
                true,

            owner:
                true,

            sessionId:
                result.sessionId ||
                null,

            expiresAt:
                result.expiresAt ||
                null,

            checked:
                true,

            backendAvailable:
                true

        };


        saveSecuritySession(
            ALON_SECURITY_STATE
        );


        await writeSecurityAudit(
            "OWNER_LOGIN_SUCCESS"
        );


        showAdminMessage(
            "Owner authentication successful.",
            "success"
        );


        refreshAdminUI();


        return true;

    } catch (error) {

        console.error(
            "Admin login error:",
            error
        );


        clearSecuritySession();


        showAdminMessage(
            "Secure owner login failed.",
            "error"
        );


        lockAdminControls();


        return false;

    }

}


/* =========================================================
   OWNER LOGOUT
========================================================= */

async function adminLogout() {

    try {

        if (
            getSecurityAPI()
        ) {

            await securityFetch(
                ALON_ADMIN_CONFIG.security.logoutEndpoint,
                {
                    method:
                        "POST"
                }
            );

        }

    } catch (error) {

        console.error(
            "Secure logout error:",
            error
        );

    }


    clearSecuritySession();


    showAdminMessage(
        "Owner Admin session ended.",
        "info"
    );


    refreshAdminUI();


    return true;

}


/* =========================================================
   SECURITY AUDIT
========================================================= */

async function writeSecurityAudit(
    action,
    metadata = {}
) {

    const api =
        getSecurityAPI();


    if (!api) {

        return false;

    }


    if (
        !ALON_SECURITY_STATE.authenticated
    ) {

        return false;

    }


    try {

        await securityFetch(
            ALON_ADMIN_CONFIG.security.auditEndpoint,
            {
                method:
                    "POST",

                body:
                    JSON.stringify(
                        {
                            action,
                            metadata,
                            timestamp:
                                new Date().toISOString()
                        }
                    )
            }
        );


        return true;

    } catch (error) {

        console.error(
            "Security audit error:",
            error
        );

        return false;

    }

}


/* =========================================================
   STORAGE HELPERS
========================================================= */

function adminGetStorage(
    key,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (!value) {

            return fallback;

        }


        return JSON.parse(
            value
        );

    } catch (error) {

        console.error(
            "Admin storage read error:",
            error
        );


        return fallback;

    }

}


function adminSetStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                value
            )
        );


        return true;

    } catch (error) {

        console.error(
            "Admin storage write error:",
            error
        );


        return false;

    }

}


function adminRemoveStorage(
    key
) {

    try {

        localStorage.removeItem(
            key
        );


        return true;

    } catch (error) {

        console.error(
            "Admin storage remove error:",
            error
        );


        return false;

    }

}


/* =========================================================
   ARTICLES
========================================================= */

function getAdminArticles() {

    return adminGetStorage(
        ALON_ADMIN_CONFIG.storage.articles,
        []
    );

}


function saveAdminArticles(
    articles
) {

    return adminSetStorage(
        ALON_ADMIN_CONFIG.storage.articles,
        articles
    );

}


/* =========================================================
   TRASH
========================================================= */

function getAdminTrash() {

    return adminGetStorage(
        ALON_ADMIN_CONFIG.storage.trash,
        []
    );

}


function saveAdminTrash(
    trash
) {

    return adminSetStorage(
        ALON_ADMIN_CONFIG.storage.trash,
        trash
    );

}


/* =========================================================
   ARTICLE ID
========================================================= */

function generateAdminArticleId() {

    return (
        "AH24-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}


/* =========================================================
   DATE
========================================================= */

function adminDateTime() {

    return new Date().toISOString();

}


function formatAdminDate(
    value
) {

    if (!value) {

        return "Unknown date";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleString();

}


/* =========================================================
   ESCAPE
========================================================= */

function adminEscapeHTML(
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
   NORMALIZE ARTICLE
========================================================= */

function normalizeAdminArticle(
    article
) {

    return {

        id:
            article.id ||
            generateAdminArticleId(),

        title:
            article.title ||
            "Untitled Article",

        category:
            article.category ||
            "Other",

        description:
            article.description ||
            article.shortDescription ||
            "",

        content:
            article.content ||
            "",

        sources:
            article.sources ||
            "",

        author:
            article.author ||
            "Baba Thecno Guru",

        status:
            article.status ||
            "published",

        createdAt:
            article.createdAt ||
            adminDateTime(),

        updatedAt:
            article.updatedAt ||
            adminDateTime()

    };

}


/* =========================================================
   FIND ARTICLE
========================================================= */

function findAdminArticle(
    articleId
) {

    const articles =
        getAdminArticles();


    return articles.find(
        article =>
            String(article.id) ===
            String(articleId)
    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchAdminArticles(
    query = ""
) {

    const articles =
        getAdminArticles();


    const search =
        String(query)
            .trim()
            .toLowerCase();


    if (!search) {

        return articles;

    }


    return articles.filter(
        article => {

            const title =
                String(
                    article.title ||
                    ""
                ).toLowerCase();


            const category =
                String(
                    article.category ||
                    ""
                ).toLowerCase();


            const description =
                String(
                    article.description ||
                    ""
                ).toLowerCase();


            const content =
                String(
                    article.content ||
                    ""
                ).toLowerCase();


            const author =
                String(
                    article.author ||
                    ""
                ).toLowerCase();


            return (
                title.includes(search) ||
                category.includes(search) ||
                description.includes(search) ||
                content.includes(search) ||
                author.includes(search)
            );

        }
    );

}


/* =========================================================
   FILTER
========================================================= */

function filterAdminArticles(
    category = "all"
) {

    const articles =
        getAdminArticles();


    if (
        !category ||
        category.toLowerCase() ===
        "all"
    ) {

        return articles;

    }


    return articles.filter(
        article =>
            String(
                article.category ||
                ""
            ).toLowerCase() ===
            category.toLowerCase()
    );

}


/* =========================================================
   CREATE
========================================================= */

function createAdminArticle(
    data = {}
) {

    if (
        !requireAdminLogin()
    ) {

        return null;

    }


    const articles =
        getAdminArticles();


    const article =
        normalizeAdminArticle(
            {
                ...data,

                id:
                    generateAdminArticleId(),

                createdAt:
                    adminDateTime(),

                updatedAt:
                    adminDateTime(),

                status:
                    "published"
            }
        );


    articles.unshift(
        article
    );


    if (
        !saveAdminArticles(
            articles
        )
    ) {

        showAdminMessage(
            "Article could not be saved.",
            "error"
        );

        return null;

    }


    writeSecurityAudit(
        "ARTICLE_CREATED",
        {
            articleId:
                article.id
        }
    );


    showAdminMessage(
        "Article created successfully.",
        "success"
    );


    refreshAdminUI();


    return article;

}


/* =========================================================
   UPDATE
========================================================= */

function updateAdminArticle(
    articleId,
    changes = {}
) {

    if (
        !requireAdminLogin()
    ) {

        return null;

    }


    const articles =
        getAdminArticles();


    const index =
        articles.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (
        index === -1
    ) {

        showAdminMessage(
            "Article not found.",
            "error"
        );

        return null;

    }


    articles[index] = {

        ...articles[index],

        ...changes,

        id:
            articles[index].id,

        updatedAt:
            adminDateTime()

    };


    if (
        !saveAdminArticles(
            articles
        )
    ) {

        showAdminMessage(
            "Article update failed.",
            "error"
        );

        return null;

    }


    writeSecurityAudit(
        "ARTICLE_UPDATED",
        {
            articleId:
                articleId
        }
    );


    showAdminMessage(
        "Article updated successfully.",
        "success"
    );


    refreshAdminUI();


    return articles[index];

}


/* =========================================================
   DELETE
========================================================= */

function deleteAdminArticle(
    articleId
) {

    if (
        !requireAdminLogin()
    ) {

        return false;

    }


    const articles =
        getAdminArticles();


    const index =
        articles.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (
        index === -1
    ) {

        showAdminMessage(
            "Article not found.",
            "error"
        );

        return false;

    }


    const article =
        articles[index];


    const confirmation =
        confirm(
            "Move this article to Trash?\n\n" +
            article.title
        );


    if (!confirmation) {

        return false;

    }


    const trash =
        getAdminTrash();


    trash.unshift(
        {
            ...article,

            deletedAt:
                adminDateTime(),

            deletedFrom:
                "admin"
        }
    );


    articles.splice(
        index,
        1
    );


    const trashSaved =
        saveAdminTrash(
            trash
        );


    const articlesSaved =
        saveAdminArticles(
            articles
        );


    if (
        !trashSaved ||
        !articlesSaved
    ) {

        showAdminMessage(
            "Article could not be moved to Trash.",
            "error"
        );

        return false;

    }


    writeSecurityAudit(
        "ARTICLE_MOVED_TO_TRASH",
        {
            articleId:
                articleId
        }
    );


    showAdminMessage(
        "Article moved to Trash.",
        "success"
    );


    refreshAdminUI();


    return true;

}


/* =========================================================
   RESTORE
========================================================= */

function restoreAdminArticle(
    articleId
) {

    if (
        !requireAdminLogin()
    ) {

        return false;

    }


    const trash =
        getAdminTrash();


    const index =
        trash.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (
        index === -1
    ) {

        showAdminMessage(
            "Deleted article not found.",
            "error"
        );

        return false;

    }


    const article =
        trash[index];


    delete article.deletedAt;

    delete article.deletedFrom;


    article.status =
        "published";


    article.updatedAt =
        adminDateTime();


    const articles =
        getAdminArticles();


    articles.unshift(
        article
    );


    trash.splice(
        index,
        1
    );


    saveAdminArticles(
        articles
    );


    saveAdminTrash(
        trash
    );


    writeSecurityAudit(
        "ARTICLE_RESTORED",
        {
            articleId:
                articleId
        }
    );


    showAdminMessage(
        "Article restored successfully.",
        "success"
    );


    refreshAdminUI();


    return true;

}


/* =========================================================
   PERMANENT DELETE
========================================================= */

function permanentlyDeleteAdminArticle(
    articleId
) {

    if (
        !requireAdminLogin()
    ) {

        return false;

    }


    const trash =
        getAdminTrash();


    const index =
        trash.findIndex(
            article =>
                String(article.id) ===
                String(articleId)
        );


    if (
        index === -1
    ) {

        showAdminMessage(
            "Deleted article not found.",
            "error"
        );

        return false;

    }


    const article =
        trash[index];


    const confirmation =
        confirm(
            "PERMANENTLY DELETE this article?\n\n" +
            article.title +
            "\n\nThis action cannot be undone."
        );


    if (!confirmation) {

        return false;

    }


    trash.splice(
        index,
        1
    );


    saveAdminTrash(
        trash
    );


    writeSecurityAudit(
        "ARTICLE_PERMANENTLY_DELETED",
        {
            articleId:
                articleId
        }
    );


    showAdminMessage(
        "Article permanently deleted.",
        "success"
    );


    refreshAdminUI();


    return true;

}


/* =========================================================
   EMPTY TRASH
========================================================= */

function emptyAdminTrash() {

    if (
        !requireAdminLogin()
    ) {

        return false;

    }


    const trash =
        getAdminTrash();


    if (
        trash.length === 0
    ) {

        showAdminMessage(
            "Trash is already empty.",
            "info"
        );

        return false;

    }


    const confirmation =
        confirm(
            "Permanently delete all articles in Trash?\n\n" +
            trash.length +
            " article(s) will be removed."
        );


    if (!confirmation) {

        return false;

    }


    adminSetStorage(
        ALON_ADMIN_CONFIG.storage.trash,
        []
    );


    writeSecurityAudit(
        "TRASH_EMPTIED",
        {
            count:
                trash.length
        }
    );


    showAdminMessage(
        "Trash emptied successfully.",
        "success"
    );


    refreshAdminUI();


    return true;

}


/* =========================================================
   STATISTICS
========================================================= */

function getAdminStatistics() {

    const articles =
        getAdminArticles();


    const trash =
        getAdminTrash();


    const categories =
        {};


    articles.forEach(
        article => {

            const category =
                article.category ||
                "Other";


            categories[category] =
                (
                    categories[category] ||
                    0
                ) + 1;

        }
    );


    return {

        totalArticles:
            articles.length,

        trashArticles:
            trash.length,

        categories:
            categories

    };

}


/* =========================================================
   STATISTICS UI
========================================================= */

function renderAdminStatistics() {

    const stats =
        getAdminStatistics();


    const totalElement =
        document.getElementById(
            "adminTotalArticles"
        );


    const trashElement =
        document.getElementById(
            "adminTrashArticles"
        );


    const categoryElement =
        document.getElementById(
            "adminCategoryCount"
        );


    if (totalElement) {

        totalElement.textContent =
            stats.totalArticles;

    }


    if (trashElement) {

        trashElement.textContent =
            stats.trashArticles;

    }


    if (categoryElement) {

        categoryElement.textContent =
            Object.keys(
                stats.categories
            ).length;

    }


    return stats;

}


/* =========================================================
   ARTICLE RENDER
========================================================= */

function renderAdminArticles(
    articles = getAdminArticles()
) {

    const container =
        document.getElementById(
            "adminArticlesList"
        );


    if (!container) {

        return;

    }


    if (
        !Array.isArray(
            articles
        )
    ) {

        articles = [];

    }


    if (
        articles.length === 0
    ) {

        container.innerHTML = `

            <div class="admin-empty">

                <h3>
                    No Articles Found
                </h3>

                <p>
                    Create an article or
                    change your search/filter.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        articles
            .map(
                article => {

                    const id =
                        adminEscapeHTML(
                            article.id
                        );


                    const title =
                        adminEscapeHTML(
                            article.title
                        );


                    const category =
                        adminEscapeHTML(
                            article.category
                        );


                    const author =
                        adminEscapeHTML(
                            article.author
                        );


                    const date =
                        adminEscapeHTML(
                            formatAdminDate(
                                article.updatedAt ||
                                article.createdAt
                            )
                        );


                    return `

                        <article
                            class="admin-article-card"
                            data-article-id="${id}"
                        >

                            <div
                                class="admin-article-info"
                            >

                                <h3>
                                    ${title}
                                </h3>

                                <p>
                                    <strong>
                                        Category:
                                    </strong>
                                    ${category}
                                </p>

                                <p>
                                    <strong>
                                        Author:
                                    </strong>
                                    ${author}
                                </p>

                                <small>
                                    Updated:
                                    ${date}
                                </small>

                            </div>


                            <div
                                class="admin-article-actions"
                            >

                                <button
                                    type="button"
                                    onclick="adminEditArticle('${id}')"
                                >
                                    Edit
                                </button>


                                <button
                                    type="button"
                                    onclick="adminPreviewArticle('${id}')"
                                >
                                    Preview
                                </button>


                                <button
                                    type="button"
                                    onclick="deleteAdminArticle('${id}')"
                                >
                                    Delete
                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   TRASH RENDER
========================================================= */

function renderAdminTrash() {

    const container =
        document.getElementById(
            "adminTrashList"
        );


    if (!container) {

        return;

    }


    const trash =
        getAdminTrash();


    if (
        trash.length === 0
    ) {

        container.innerHTML = `

            <div class="admin-empty">

                <h3>
                    Trash is Empty
                </h3>

                <p>
                    Deleted articles
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        trash
            .map(
                article => {

                    const id =
                        adminEscapeHTML(
                            article.id
                        );


                    const title =
                        adminEscapeHTML(
                            article.title
                        );


                    const deleted =
                        adminEscapeHTML(
                            formatAdminDate(
                                article.deletedAt
                            )
                        );


                    return `

                        <article
                            class="admin-trash-card"
                            data-article-id="${id}"
                        >

                            <div>

                                <h3>
                                    ${title}
                                </h3>

                                <small>
                                    Deleted:
                                    ${deleted}
                                </small>

                            </div>


                            <div
                                class="admin-trash-actions"
                            >

                                <button
                                    type="button"
                                    onclick="restoreAdminArticle('${id}')"
                                >
                                    Restore
                                </button>


                                <button
                                    type="button"
                                    onclick="permanentlyDeleteAdminArticle('${id}')"
                                >
                                    Delete Forever
                                </button>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   SEARCH
========================================================= */

function setupAdminSearch() {

    const searchInput =
        document.getElementById(
            "adminSearch"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const results =
                searchAdminArticles(
                    this.value
                );


            renderAdminArticles(
                results
            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function setupAdminCategoryFilter() {

    const filter =
        document.getElementById(
            "adminCategoryFilter"
        );


    if (!filter) {

        return;

    }


    filter.addEventListener(
        "change",
        function () {

            const results =
                filterAdminArticles(
                    this.value
                );


            renderAdminArticles(
                results
            );

        }
    );

}


/* =========================================================
   EDIT
========================================================= */

function adminEditArticle(
    articleId
) {

    if (
        !requireAdminLogin()
    ) {

        return;

    }


    const article =
        findAdminArticle(
            articleId
        );


    if (!article) {

        showAdminMessage(
            "Article not found.",
            "error"
        );

        return;

    }


    const titleInput =
        document.getElementById(
            "articleTitle"
        );


    const categoryInput =
        document.getElementById(
            "articleCategory"
        );


    const descriptionInput =
        document.getElementById(
            "articleDescription"
        );


    const contentInput =
        document.getElementById(
            "articleContent"
        );


    const sourcesInput =
        document.getElementById(
            "articleSources"
        );


    if (titleInput) {

        titleInput.value =
            article.title || "";

    }


    if (categoryInput) {

        categoryInput.value =
            article.category || "Other";

    }


    if (descriptionInput) {

        descriptionInput.value =
            article.description || "";

    }


    if (contentInput) {

        contentInput.value =
            article.content || "";

    }


    if (sourcesInput) {

        sourcesInput.value =
            Array.isArray(
                article.sources
            )
                ? article.sources.join(
                    "\n"
                )
                : article.sources || "";

    }


    const editor =
        document.getElementById(
            "adminEditor"
        );


    if (editor) {

        editor.dataset.editingId =
            article.id;


        editor.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );

    }


    showAdminMessage(
        "Article loaded for editing.",
        "info"
    );

}


/* =========================================================
   PREVIEW
========================================================= */

function adminPreviewArticle(
    articleId
) {

    if (
        !requireAdminLogin()
    ) {

        return;

    }


    const article =
        findAdminArticle(
            articleId
        );


    if (!article) {

        return;

    }


    const preview =
        document.getElementById(
            "adminPreview"
        );


    if (!preview) {

        alert(
            article.title +
            "\n\n" +
            article.description +
            "\n\n" +
            article.content
        );

        return;

    }


    preview.innerHTML = `

        <div class="admin-preview-inner">

            <h2>
                ${adminEscapeHTML(
                    article.title
                )}
            </h2>

            <p>
                ${adminEscapeHTML(
                    article.description
                )}
            </p>

            <hr>

            <div>
                ${adminEscapeHTML(
                    article.content
                ).replace(
                    /\n/g,
                    "<br>"
                )}
            </div>

            ${
                article.sources
                    ? `

                        <hr>

                        <h4>
                            Sources
                        </h4>

                        <p>
                            ${adminEscapeHTML(
                                Array.isArray(
                                    article.sources
                                )
                                    ? article.sources.join(
                                        "\n"
                                    )
                                    : article.sources
                            ).replace(
                                /\n/g,
                                "<br>"
                            )}
                        </p>

                    `
                    : ""
            }

        </div>

    `;


    preview.hidden =
        false;


    preview.scrollIntoView(
        {
            behavior:
                "smooth",

            block:
                "start"
        }
    );

}


/* =========================================================
   SAVE FORM
========================================================= */

function saveAdminArticleFromForm() {

    if (
        !requireAdminLogin()
    ) {

        return false;

    }


    const titleInput =
        document.getElementById(
            "articleTitle"
        );


    const categoryInput =
        document.getElementById(
            "articleCategory"
        );


    const descriptionInput =
        document.getElementById(
            "articleDescription"
        );


    const contentInput =
        document.getElementById(
            "articleContent"
        );


    const sourcesInput =
        document.getElementById(
            "articleSources"
        );


    if (
        !titleInput ||
        !contentInput
    ) {

        showAdminMessage(
            "Admin article form not found.",
            "error"
        );

        return false;

    }


    const title =
        titleInput.value.trim();


    const category =
        categoryInput
            ? categoryInput.value
            : "Other";


    const description =
        descriptionInput
            ? descriptionInput.value.trim()
            : "";


    const content =
        contentInput.value.trim();


    const sources =
        sourcesInput
            ? sourcesInput.value.trim()
            : "";


    if (!title) {

        showAdminMessage(
            "Article title is required.",
            "warning"
        );

        titleInput.focus();

        return false;

    }


    if (!content) {

        showAdminMessage(
            "Article content is required.",
            "warning"
        );

        contentInput.focus();

        return false;

    }


    const editor =
        document.getElementById(
            "adminEditor"
        );


    const editingId =
        editor
            ? editor.dataset.editingId
            : "";


    if (editingId) {

        updateAdminArticle(
            editingId,
            {
                title,
                category,
                description,
                content,
                sources
            }
        );


        if (editor) {

            delete editor.dataset.editingId;

        }

    } else {

        createAdminArticle(
            {
                title,
                category,
                description,
                content,
                sources
            }
        );

    }


    return true;

}


/* =========================================================
   MESSAGE
========================================================= */

function showAdminMessage(
    message,
    type = "info"
) {

    let box =
        document.getElementById(
            "adminMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "adminMessage";


        box.setAttribute(
            "role",
            "status"
        );


        document.body.prepend(
            box
        );

    }


    box.className =
        "admin-message admin-" +
        type;


    box.textContent =
        message;


    clearTimeout(
        window.alonAdminMessageTimer
    );


    window.alonAdminMessageTimer =
        setTimeout(
            () => {

                if (box) {

                    box.textContent =
                        "";

                    box.className =
                        "admin-message";

                }

            },
            4000
        );

}


/* =========================================================
   EXPORT
========================================================= */

function exportAdminData() {

    if (
        !requireAdminLogin()
    ) {

        return;

    }


    const data = {

        project:
            ALON_ADMIN_CONFIG.project,

        creator:
            ALON_ADMIN_CONFIG.creator,

        version:
            ALON_ADMIN_CONFIG.version,

        exportedAt:
            adminDateTime(),

        articles:
            getAdminArticles(),

        trash:
            getAdminTrash(),

        drafts:
            adminGetStorage(
                ALON_ADMIN_CONFIG.storage.drafts,
                []
            )

    };


    const json =
        JSON.stringify(
            data,
            null,
            2
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "ALON_HISTORYVERSE_24_ADMIN_BACKUP.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    writeSecurityAudit(
        "ADMIN_BACKUP_EXPORTED"
    );


    showAdminMessage(
        "Admin backup exported.",
        "success"
    );

}


/* =========================================================
   IMPORT
========================================================= */

function importAdminData(
    file
) {

    if (
        !requireAdminLogin()
    ) {

        return;

    }


    if (!file) {

        showAdminMessage(
            "No backup file selected.",
            "warning"
        );

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !data ||
                    typeof data !==
                        "object"
                ) {

                    throw new Error(
                        "Invalid backup"
                    );

                }


                if (
                    Array.isArray(
                        data.articles
                    )
                ) {

                    saveAdminArticles(
                        data.articles
                    );

                }


                if (
                    Array.isArray(
                        data.trash
                    )
                ) {

                    saveAdminTrash(
                        data.trash
                    );

                }


                if (
                    Array.isArray(
                        data.drafts
                    )
                ) {

                    adminSetStorage(
                        ALON_ADMIN_CONFIG.storage.drafts,
                        data.drafts
                    );

                }


                writeSecurityAudit(
                    "ADMIN_BACKUP_IMPORTED"
                );


                showAdminMessage(
                    "Admin backup imported successfully.",
                    "success"
                );


                refreshAdminUI();

            } catch (error) {

                console.error(
                    "Admin import error:",
                    error
                );


                showAdminMessage(
                    "Invalid admin backup file.",
                    "error"
                );

            }

        };


    reader.readAsText(
        file
    );

}


/* =========================================================
   IMPORT SETUP
========================================================= */

function setupAdminImport() {

    const input =
        document.getElementById(
            "adminImportFile"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (file) {

                importAdminData(
                    file
                );

            }


            this.value =
                "";

        }
    );

}


/* =========================================================
   LOGIN UI
========================================================= */

function updateAdminLoginUI() {

    const loggedIn =
        isAdminLoggedIn();


    document
        .querySelectorAll(
            "[data-admin-only]"
        )
        .forEach(
            element => {

                element.style.display =
                    loggedIn
                        ? ""
                        : "none";

            }
        );


    document
        .querySelectorAll(
            "[data-admin-login-required]"
        )
        .forEach(
            element => {

                element.style.display =
                    loggedIn
                        ? "none"
                        : "";

            }
        );


    const status =
        document.getElementById(
            "adminLoginStatus"
        );


    if (status) {

        status.textContent =
            loggedIn
                ? "Owner Admin: AUTHENTICATED"
                : "Owner Admin: LOCKED";

    }

}


/* =========================================================
   REFRESH UI
========================================================= */

function refreshAdminUI() {

    renderAdminStatistics();

    renderAdminArticles();

    renderAdminTrash();

    updateAdminLoginUI();

}


/* =========================================================
   EVENTS
========================================================= */

function setupAdminEvents() {

    const saveButton =
        document.getElementById(
            "saveAdminArticle"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveAdminArticleFromForm
        );

    }


    const logoutButton =
        document.getElementById(
            "adminLogout"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            adminLogout
        );

    }


    const loginButton =
        document.getElementById(
            "adminLogin"
        );


    if (loginButton) {

        loginButton.addEventListener(
            "click",
            async () => {

                /*
                   Credentials should be collected
                   from the existing secure login UI.

                   Nothing is hard-coded here.
                */

                const emailInput =
                    document.getElementById(
                        "adminEmail"
                    );


                const passwordInput =
                    document.getElementById(
                        "adminPassword"
                    );


                await adminLogin(
                    {
                        email:
                            emailInput
                                ? emailInput.value.trim()
                                : "",

                        password:
                            passwordInput
                                ? passwordInput.value
                                : ""
                    }
                );

            }
        );

    }


    const exportButton =
        document.getElementById(
            "adminExport"
        );


    if (exportButton) {

        exportButton.addEventListener(
            "click",
            exportAdminData
        );

    }


    const emptyTrashButton =
        document.getElementById(
            "emptyAdminTrash"
        );


    if (emptyTrashButton) {

        emptyTrashButton.addEventListener(
            "click",
            emptyAdminTrash
        );

    }


    setupAdminSearch();

    setupAdminCategoryFilter();

    setupAdminImport();

}


/* =========================================================
   SECURITY INITIALIZATION
========================================================= */

async function initializeAdminSecurity() {

    /*
       Always start locked.
    */

    ALON_SECURITY_STATE =
        {

            authenticated:
                false,

            owner:
                false,

            sessionId:
                null,

            expiresAt:
                null,

            checked:
                false,

            backendAvailable:
                false

        };


    updateAdminLoginUI();


    const authenticated =
        await verifyOwnerSession();


    if (
        authenticated
    ) {

        showAdminMessage(
            "Owner Admin session verified.",
            "success"
        );

    } else {

        lockAdminControls();

        showAdminMessage(
            "Admin Control Center is locked. Owner authentication required.",
            "warning"
        );

    }


    refreshAdminUI();


    return authenticated;

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setupAdminEvents();

        refreshAdminUI();

        await initializeAdminSecurity();


        console.log(
            "ALON HISTORYVERSE 24 Admin Security Layer loaded."
        );

    }
);


/* =========================================================
   PUBLIC API
========================================================= */

window.ALON_ADMIN = {

    config:
        ALON_ADMIN_CONFIG,

    login:
        adminLogin,

    logout:
        adminLogout,

    isAuthenticated:
        isAdminLoggedIn,

    verifySession:
        verifyOwnerSession,

    getSecurityState:
        () =>
            ({
                ...ALON_SECURITY_STATE
            }),

    getArticles:
        getAdminArticles,

    getTrash:
        getAdminTrash,

    search:
        searchAdminArticles,

    filter:
        filterAdminArticles,

    create:
        createAdminArticle,

    update:
        updateAdminArticle,

    delete:
        deleteAdminArticle,

    restore:
        restoreAdminArticle,

    permanentDelete:
        permanentlyDeleteAdminArticle,

    emptyTrash:
        emptyAdminTrash,

    statistics:
        getAdminStatistics,

    export:
        exportAdminData,

    import:
        importAdminData,

    refresh:
        refreshAdminUI

};


/* =========================================================
   END
   ALON HISTORYVERSE 24
   ADMIN MANAGEMENT + SECURITY LAYER
========================================================= */