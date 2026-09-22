/* =========================================================
   ALON HISTORYVERSE 24
   MASTER ADMIN CONTROLLER
   ---------------------------------------------------------
   File:
   jss/master-admin-controller.js

   Purpose:
   - Owner-only Master Admin control layer
   - Protect Admin operations
   - User management
   - Article management
   - Image management
   - Video management
   - Seller management
   - Listing management
   - Emergency delete
   - Security audit
   - Backend authorization required

   IMPORTANT:
   - NEVER store Owner password in this file.
   - NEVER use LocalStorage as real authorization.
   - Backend must verify the Owner session.
   - This file is intentionally independent from admin.js.
   ========================================================= */

(function (window, document) {

    "use strict";

    /* =========================================================
       MASTER ADMIN CONFIG
       ========================================================= */

    const MASTER_ADMIN_CONFIG = {

        version: "1.0.0",

        /*
         * Backend URL must be configured by the deployment.
         *
         * Example:
         * window.ALON_SECURITY_API =
         *     "https://your-secure-api.example.com";
         *
         * Do NOT put passwords or secrets here.
         */
        api: {

            get base() {

                return String(
                    window.ALON_SECURITY_API || ""
                ).replace(/\/+$/, "");

            },

            endpoints: {

                session: "/api/admin/session",

                login: "/api/admin/login",

                logout: "/api/admin/logout",

                audit: "/api/admin/audit",

                users: "/api/admin/users",

                articles: "/api/admin/articles",

                images: "/api/admin/images",

                videos: "/api/admin/videos",

                sellers: "/api/admin/sellers",

                listings: "/api/admin/listings",

                emergency: "/api/admin/emergency"

            }

        },

        storage: {

            /*
             * These values are informational/session state only.
             * They are NOT authorization.
             */
            sessionState:
                "alon_master_admin_session_state"

        },

        security: {

            ownerRequired: true,

            failClosed: true,

            preventNormalUsers: true,

            auditActions: true,

            destructiveConfirmation: true

        }

    };


    /* =========================================================
       INTERNAL STATE
       ========================================================= */

    const MASTER_ADMIN_STATE = {

        initialized: false,

        authenticated: false,

        owner: false,

        checkingSession: false,

        sessionId: null,

        ownerId: null,

        lastAction: null,

        lastError: null

    };


    /* =========================================================
       BASIC HELPERS
       ========================================================= */

    function safeString(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }

        return String(value);

    }


    function hasBackend() {

        return Boolean(
            MASTER_ADMIN_CONFIG.api.base
        );

    }


    function buildUrl(path) {

        if (!hasBackend()) {

            return "";

        }

        return (
            MASTER_ADMIN_CONFIG.api.base +
            path
        );

    }


    function isAuthenticatedOwner() {

        return (
            MASTER_ADMIN_STATE.authenticated === true &&
            MASTER_ADMIN_STATE.owner === true
        );

    }


    function setState(authenticated, owner, data) {

        MASTER_ADMIN_STATE.authenticated =
            authenticated === true;

        MASTER_ADMIN_STATE.owner =
            owner === true;

        if (data && typeof data === "object") {

            MASTER_ADMIN_STATE.sessionId =
                data.sessionId ||
                data.session_id ||
                null;

            MASTER_ADMIN_STATE.ownerId =
                data.ownerId ||
                data.owner_id ||
                null;

        }

    }


    /* =========================================================
       SAFE FETCH
       ========================================================= */

    async function apiRequest(
        endpoint,
        options
    ) {

        if (!hasBackend()) {

            throw new Error(
                "Secure Admin API is not configured."
            );

        }

        const config = options || {};

        const method =
            config.method || "GET";

        const headers = {

            "Accept":
                "application/json",

            ...(config.headers || {})

        };


        let body = config.body;


        if (
            body !== undefined &&
            body !== null &&
            typeof body !== "string"
        ) {

            headers["Content-Type"] =
                "application/json";

            body = JSON.stringify(body);

        }


        const response =
            await fetch(
                buildUrl(endpoint),
                {

                    method: method,

                    headers: headers,

                    body: body,

                    credentials: "include",

                    cache: "no-store"

                }
            );


        let result = null;

        try {

            result =
                await response.json();

        } catch (error) {

            result = null;

        }


        if (!response.ok) {

            const message =
                result &&
                (
                    result.message ||
                    result.error
                );

            throw new Error(
                message ||
                (
                    "Admin API request failed: " +
                    response.status
                )
            );

        }


        return result || {};

    }


    /* =========================================================
       OWNER SESSION VERIFICATION
       ========================================================= */

    async function verifyOwnerSession() {

        if (
            MASTER_ADMIN_STATE.checkingSession
        ) {

            return isAuthenticatedOwner();

        }


        MASTER_ADMIN_STATE.checkingSession =
            true;


        try {

            if (!hasBackend()) {

                setState(false, false);

                return false;

            }


            const result =
                await apiRequest(
                    MASTER_ADMIN_CONFIG.api.endpoints.session,
                    {

                        method: "GET"

                    }
                );


            const authenticated =
                result.authenticated === true;

            const owner =
                result.owner === true;


            setState(
                authenticated,
                owner,
                result
            );


            if (!owner) {

                setState(false, false);

            }


            return isAuthenticatedOwner();

        } catch (error) {

            setState(false, false);

            MASTER_ADMIN_STATE.lastError =
                error.message;

            return false;

        } finally {

            MASTER_ADMIN_STATE.checkingSession =
                false;

        }

    }


    /* =========================================================
       OWNER LOGIN
       ========================================================= */

    async function ownerLogin(credentials) {

        if (!hasBackend()) {

            throw new Error(
                "Secure Admin API is not configured."
            );

        }


        if (
            !credentials ||
            typeof credentials !== "object"
        ) {

            throw new Error(
                "Owner login information is required."
            );

        }


        /*
         * Credentials are sent directly to the secure backend.
         *
         * Do NOT log them.
         * Do NOT save them in LocalStorage.
         */
        const result =
            await apiRequest(
                MASTER_ADMIN_CONFIG.api.endpoints.login,
                {

                    method: "POST",

                    body: credentials

                }
            );


        if (
            result.authenticated !== true ||
            result.owner !== true
        ) {

            setState(false, false);

            throw new Error(
                "Owner authorization failed."
            );

        }


        setState(
            true,
            true,
            result
        );


        MASTER_ADMIN_STATE.lastAction =
            "owner_login";


        return true;

    }


    /* =========================================================
       OWNER LOGOUT
       ========================================================= */

    async function ownerLogout() {

        try {

            if (hasBackend()) {

                await apiRequest(
                    MASTER_ADMIN_CONFIG.api.endpoints.logout,
                    {

                        method: "POST"

                    }
                );

            }

        } catch (error) {

            MASTER_ADMIN_STATE.lastError =
                error.message;

        } finally {

            setState(false, false);

            MASTER_ADMIN_STATE.sessionId =
                null;

            MASTER_ADMIN_STATE.ownerId =
                null;

        }


        return true;

    }


    /* =========================================================
       SECURITY AUDIT
       ========================================================= */

    async function writeAudit(
        action,
        targetType,
        targetId,
        details
    ) {

        if (!isAuthenticatedOwner()) {

            return false;

        }


        try {

            await apiRequest(
                MASTER_ADMIN_CONFIG.api.endpoints.audit,
                {

                    method: "POST",

                    body: {

                        action:
                            safeString(action),

                        targetType:
                            safeString(targetType),

                        targetId:
                            safeString(targetId),

                        details:
                            details || {},

                        timestamp:
                            new Date().toISOString()

                    }

                }
            );


            return true;

        } catch (error) {

            /*
             * Audit failure must not silently authorize
             * a destructive operation.
             */
            MASTER_ADMIN_STATE.lastError =
                error.message;

            return false;

        }

    }


    /* =========================================================
       OWNER AUTHORIZATION GATE
       ========================================================= */

    async function requireOwner(
        action,
        targetType,
        targetId
    ) {

        const verified =
            await verifyOwnerSession();


        if (!verified) {

            throw new Error(
                "Owner authorization required."
            );

        }


        if (
            MASTER_ADMIN_CONFIG.security.auditActions
        ) {

            const auditOK =
                await writeAudit(
                    action,
                    targetType,
                    targetId,
                    {

                        stage: "authorization"

                    }
                );


            if (!auditOK) {

                throw new Error(
                    "Security audit could not be recorded."
                );

            }

        }


        return true;

    }


    /* =========================================================
       READ USERS
       ========================================================= */

    async function getUsers(
        filters
    ) {

        await requireOwner(
            "users_view",
            "users",
            ""
        );


        const query =
            filters &&
            typeof filters === "object"
                ? filters
                : {};


        const params =
            new URLSearchParams();


        Object.keys(query).forEach(
            function (key) {

                const value =
                    query[key];

                if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {

                    params.set(
                        key,
                        String(value)
                    );

                }

            }
        );


        const suffix =
            params.toString()
                ? "?" + params.toString()
                : "";


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.users +
            suffix,
            {

                method: "GET"

            }
        );

    }


    /* =========================================================
       DISABLE USER
       ========================================================= */

    async function disableUser(
        userId
    ) {

        await requireOwner(
            "user_disable",
            "user",
            userId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.users +
            "/" +
            encodeURIComponent(
                safeString(userId)
            ) +
            "/disable",
            {

                method: "POST",

                body: {

                    userId: userId

                }

            }
        );

    }


    /* =========================================================
       DELETE USER
       ========================================================= */

    async function deleteUser(
        userId
    ) {

        await requireOwner(
            "user_delete",
            "user",
            userId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.users +
            "/" +
            encodeURIComponent(
                safeString(userId)
            ),
            {

                method: "DELETE"

            }
        );

    }


    /* =========================================================
       READ ARTICLES
       ========================================================= */

    async function getArticles(
        filters
    ) {

        await requireOwner(
            "articles_view",
            "articles",
            ""
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.articles,
            {

                method: "POST",

                body: {

                    operation: "list",

                    filters:
                        filters || {}

                }

            }
        );

    }


    /* =========================================================
       DELETE ARTICLE
       ========================================================= */

    async function deleteArticle(
        articleId,
        permanent
    ) {

        const isPermanent =
            permanent === true;


        await requireOwner(
            isPermanent
                ? "article_permanent_delete"
                : "article_delete",
            "article",
            articleId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.articles,
            {

                method: "POST",

                body: {

                    operation:
                        isPermanent
                            ? "permanent_delete"
                            : "delete",

                    articleId:
                        articleId

                }

            }
        );

    }


    /* =========================================================
       RESTORE ARTICLE
       ========================================================= */

    async function restoreArticle(
        articleId
    ) {

        await requireOwner(
            "article_restore",
            "article",
            articleId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.articles,
            {

                method: "POST",

                body: {

                    operation: "restore",

                    articleId:
                        articleId

                }

            }
        );

    }


    /* =========================================================
       READ IMAGES
       ========================================================= */

    async function getImages(
        filters
    ) {

        await requireOwner(
            "images_view",
            "images",
            ""
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.images,
            {

                method: "POST",

                body: {

                    operation: "list",

                    filters:
                        filters || {}

                }

            }
        );

    }


    /* =========================================================
       DELETE IMAGE
       ========================================================= */

    async function deleteImage(
        imageId,
        permanent
    ) {

        const isPermanent =
            permanent === true;


        await requireOwner(
            isPermanent
                ? "image_permanent_delete"
                : "image_delete",
            "image",
            imageId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.images,
            {

                method: "POST",

                body: {

                    operation:
                        isPermanent
                            ? "permanent_delete"
                            : "delete",

                    imageId:
                        imageId

                }

            }
        );

    }


    /* =========================================================
       READ VIDEOS
       ========================================================= */

    async function getVideos(
        filters
    ) {

        await requireOwner(
            "videos_view",
            "videos",
            ""
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.videos,
            {

                method: "POST",

                body: {

                    operation: "list",

                    filters:
                        filters || {}

                }

            }
        );

    }


    /* =========================================================
       DELETE VIDEO
       ========================================================= */

    async function deleteVideo(
        videoId,
        permanent
    ) {

        const isPermanent =
            permanent === true;


        await requireOwner(
            isPermanent
                ? "video_permanent_delete"
                : "video_delete",
            "video",
            videoId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.videos,
            {

                method: "POST",

                body: {

                    operation:
                        isPermanent
                            ? "permanent_delete"
                            : "delete",

                    videoId:
                        videoId

                }

            }
        );

    }


    /* =========================================================
       READ SELLERS
       ========================================================= */

    async function getSellers(
        filters
    ) {

        await requireOwner(
            "sellers_view",
            "sellers",
            ""
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.sellers,
            {

                method: "POST",

                body: {

                    operation: "list",

                    filters:
                        filters || {}

                }

            }
        );

    }


    /* =========================================================
       DISABLE SELLER
       ========================================================= */

    async function disableSeller(
        sellerId
    ) {

        await requireOwner(
            "seller_disable",
            "seller",
            sellerId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.sellers,
            {

                method: "POST",

                body: {

                    operation: "disable",

                    sellerId:
                        sellerId

                }

            }
        );

    }


    /* =========================================================
       DELETE SELLER
       ========================================================= */

    async function deleteSeller(
        sellerId
    ) {

        await requireOwner(
            "seller_delete",
            "seller",
            sellerId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.sellers,
            {

                method: "POST",

                body: {

                    operation: "delete",

                    sellerId:
                        sellerId

                }

            }
        );

    }


    /* =========================================================
       READ LISTINGS
       ========================================================= */

    async function getListings(
        filters
    ) {

        await requireOwner(
            "listings_view",
            "listings",
            ""
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.listings,
            {

                method: "POST",

                body: {

                    operation: "list",

                    filters:
                        filters || {}

                }

            }
        );

    }


    /* =========================================================
       DELETE LISTING
       ========================================================= */

    async function deleteListing(
        listingId,
        permanent
    ) {

        const isPermanent =
            permanent === true;


        await requireOwner(
            isPermanent
                ? "listing_permanent_delete"
                : "listing_delete",
            "listing",
            listingId
        );


        return apiRequest(
            MASTER_ADMIN_CONFIG.api.endpoints.listings,
            {

                method: "POST",

                body: {

                    operation:
                        isPermanent
                            ? "permanent_delete"
                            : "delete",

                    listingId:
                        listingId

                }

            }
        );

    }


    /* =========================================================
       EMERGENCY DELETE
       ========================================================= */

    async function emergencyDelete(
        targetType,
        targetId,
        reason
    ) {

        if (
            !targetType ||
            !targetId
        ) {

            throw new Error(
                "Emergency delete target is required."
            );

        }


        if (
            MASTER_ADMIN_CONFIG.security
                .destructiveConfirmation
        ) {

            const confirmed =
                window.confirm(
                    "Emergency delete this item?\n\n" +
                    "Type: " +
                    safeString(targetType) +
                    "\nID: " +
                    safeString(targetId) +
                    "\n\n" +
                    "This action may be permanent."
                );


            if (!confirmed) {

                return {

                    cancelled: true

                };

            }

        }


        await requireOwner(
            "emergency_delete",
            targetType,
            targetId
        );


        const result =
            await apiRequest(
                MASTER_ADMIN_CONFIG.api.endpoints.emergency,
                {

                    method: "POST",

                    body: {

                        targetType:
                            targetType,

                        targetId:
                            targetId,

                        reason:
                            safeString(reason),

                        confirmation:
                            true

                    }

                }
            );


        MASTER_ADMIN_STATE.lastAction =
            "emergency_delete";


        return result;

    }


    /* =========================================================
       LOCK MASTER ADMIN UI
       ========================================================= */

    function lockAdminUI() {

        const selectors = [

            "[data-master-admin]",

            ".master-admin-control",

            ".master-admin-only"

        ];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(
                        function (element) {

                            element
                                .setAttribute(
                                    "aria-hidden",
                                    "true"
                                );

                            element
                                .setAttribute(
                                    "data-master-admin-locked",
                                    "true"
                                );

                            element.style.display =
                                "none";

                        }
                    );

            }
        );

    }


    /* =========================================================
       UNLOCK MASTER ADMIN UI
       ========================================================= */

    function unlockAdminUI() {

        if (!isAuthenticatedOwner()) {

            lockAdminUI();

            return false;

        }


        const selectors = [

            "[data-master-admin]",

            ".master-admin-control",

            ".master-admin-only"

        ];


        selectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(
                        function (element) {

                            element
                                .removeAttribute(
                                    "aria-hidden"
                                );

                            element
                                .removeAttribute(
                                    "data-master-admin-locked"
                                );

                            element.style.display =
                                "";

                        }
                    );

            }
        );


        return true;

    }


    /* =========================================================
       PROTECT MASTER ADMIN ACTION BUTTONS
       ========================================================= */

    function protectButtons() {

        document.addEventListener(
            "click",
            async function (event) {

                const button =
                    event.target.closest(
                        "[data-master-admin-action]"
                    );


                if (!button) {

                    return;

                }


                if (!isAuthenticatedOwner()) {

                    event.preventDefault();

                    event.stopPropagation();

                    await verifyOwnerSession();


                    if (
                        !isAuthenticatedOwner()
                    ) {

                        window.alert(
                            "Owner authorization required."
                        );

                    }

                    return;

                }

            },
            true
        );

    }


    /* =========================================================
       PAGE PROTECTION
       ========================================================= */

    async function protectPage() {

        lockAdminUI();


        const owner =
            await verifyOwnerSession();


        if (!owner) {

            lockAdminUI();

            return false;

        }


        unlockAdminUI();

        return true;

    }


    /* =========================================================
       PUBLIC MASTER ADMIN API
       ========================================================= */

    window.ALON_MASTER_ADMIN = {

        config:
            MASTER_ADMIN_CONFIG,

        state:
            MASTER_ADMIN_STATE,

        verifyOwnerSession:
            verifyOwnerSession,

        ownerLogin:
            ownerLogin,

        ownerLogout:
            ownerLogout,

        requireOwner:
            requireOwner,

        writeAudit:
            writeAudit,

        protectPage:
            protectPage,

        lockAdminUI:
            lockAdminUI,

        unlockAdminUI:
            unlockAdminUI,

        getUsers:
            getUsers,

        disableUser:
            disableUser,

        deleteUser:
            deleteUser,

        getArticles:
            getArticles,

        deleteArticle:
            deleteArticle,

        restoreArticle:
            restoreArticle,

        getImages:
            getImages,

        deleteImage:
            deleteImage,

        getVideos:
            getVideos,

        deleteVideo:
            deleteVideo,

        getSellers:
            getSellers,

        disableSeller:
            disableSeller,

        deleteSeller:
            deleteSeller,

        getListings:
            getListings,

        deleteListing:
            deleteListing,

        emergencyDelete:
            emergencyDelete

    };


    /* =========================================================
       INITIALIZATION
       ========================================================= */

    async function initialize() {

        if (
            MASTER_ADMIN_STATE.initialized
        ) {

            return;

        }


        MASTER_ADMIN_STATE.initialized =
            true;


        lockAdminUI();


        /*
         * Fail closed:
         * without a secure backend the Master Admin
         * remains locked.
         */
        if (!hasBackend()) {

            return;

        }


        await protectPage();

    }


    protectButtons();


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


})(window, document);