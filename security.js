 /* ============================================================
    ALON HISTORYVERSE 24
    SECURITY ENGINE
    File: jss/security.js
    Creator: Baba Thecno Guru
    Version: 24.0

    PURPOSE
    ------------------------------------------------------------
    • Safe HTML / text handling
    • XSS-risk reduction for frontend rendering
    • URL validation
    • External link protection
    • LocalStorage safety helpers
    • Login / admin state checks
    • Input validation
    • File type / size validation
    • Security event logging
    • Basic browser security checks
    • No root index/path changes

    IMPORTANT
    ------------------------------------------------------------
    This is a FRONTEND security helper.

    It does NOT replace:
    • Server-side authentication
    • Firebase Security Rules
    • Backend authorization
    • Database permissions
    • HTTPS configuration
    • Server-side validation
    ============================================================ */

(function (window, document) {

    "use strict";


    /* ========================================================
       PROJECT
       ======================================================== */

    const PROJECT = {
        name: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0"
    };


    /* ========================================================
       CONFIGURATION
       ======================================================== */

    const CONFIG = {

        storageKeys: {

            loggedIn:
                "alon_historyverse_logged_in",

            adminLoggedIn:
                "alon_historyverse_admin_logged_in",

            securityLog:
                "alon_historyverse_security_log"
        },

        limits: {

            text:
                100000,

            title:
                300,

            description:
                5000,

            url:
                2048,

            fileSize:
                50 * 1024 * 1024
        },

        allowedImageTypes: [

            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/svg+xml"

        ],

        allowedVideoTypes: [

            "video/mp4",
            "video/webm",
            "video/ogg"

        ]
    };


    /* ========================================================
       STATE
       ======================================================== */

    const STATE = {

        initialized: false,

        secureContext:
            Boolean(
                window.isSecureContext
            ),

        localStorage:
            false,

        online:
            navigator.onLine !== false,

        lastEvent:
            null,

        blockedCount:
            0
    };


    /* ========================================================
       STORAGE
       ======================================================== */

    function storageAvailable() {

        try {

            if (!window.localStorage) {
                return false;
            }

            const key =
                "__alon_security_test__";

            localStorage.setItem(
                key,
                "1"
            );

            localStorage.removeItem(
                key
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    function storageGet(
        key
    ) {

        try {

            return localStorage.getItem(
                key
            );

        } catch (error) {

            return null;
        }
    }


    function storageSet(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                String(value)
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    function storageRemove(
        key
    ) {

        try {

            localStorage.removeItem(
                key
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       SAFE HTML ESCAPE
       ======================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value == null
                ? ""
                : value
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


    /* ========================================================
       SAFE TEXT
       ======================================================== */

    function sanitizeText(
        value,
        maxLength
    ) {

        let text =
            String(
                value == null
                    ? ""
                    : value
            );

        text =
            text
                .replace(
                    /\u0000/g,
                    ""
                )
                .replace(
                    /[\u0008\u000B\u000C\u000E\u000F]/g,
                    ""
                );

        if (
            Number.isFinite(
                Number(maxLength)
            )
        ) {

            text =
                text.slice(
                    0,
                    Number(maxLength)
                );
        }

        return text.trim();
    }


    /* ========================================================
       DANGEROUS HTML DETECTION
       ======================================================== */

    function containsDangerousHTML(
        value
    ) {

        const text =
            String(
                value == null
                    ? ""
                    : value
            );

        const patterns = [

            /<\s*script\b/i,

            /<\s*iframe\b/i,

            /<\s*object\b/i,

            /<\s*embed\b/i,

            /<\s*base\b/i,

            /<\s*form\b/i,

            /javascript\s*:/i,

            /vbscript\s*:/i,

            /data\s*:\s*text\/html/i,

            /on\w+\s*=/i,

            /<\s*meta\b/i,

            /<\s*link\b/i

        ];

        return patterns.some(
            function (pattern) {

                return pattern.test(
                    text
                );
            }
        );
    }


    /* ========================================================
       SANITIZE BASIC HTML
       ======================================================== */

    function sanitizeHTML(
        value
    ) {

        const text =
            String(
                value == null
                    ? ""
                    : value
            );

        if (
            !containsDangerousHTML(
                text
            )
        ) {

            return text;
        }

        /*
         * When untrusted HTML is detected,
         * convert the complete input to safe text.
         */

        STATE.blockedCount++;

        return escapeHTML(
            text
        );
    }


    /* ========================================================
       URL VALIDATION
       ======================================================== */

    function isSafeURL(
        value,
        options
    ) {

        const settings =
            options || {};

        if (!value) {
            return false;
        }

        const raw =
            String(value).trim();

        if (
            raw.length >
            CONFIG.limits.url
        ) {
            return false;
        }

        if (
            /[\u0000-\u001F]/.test(
                raw
            )
        ) {
            return false;
        }

        if (
            /^javascript:/i.test(
                raw
            )
        ) {
            return false;
        }

        if (
            /^vbscript:/i.test(
                raw
            )
        ) {
            return false;
        }

        if (
            /^data:/i.test(
                raw
            )
        ) {

            /*
             * Data URLs are blocked by default.
             */

            return false;
        }

        /*
         * Relative URLs are allowed.
         */

        if (
            raw.startsWith(
                "./"
            ) ||
            raw.startsWith(
                "../"
            ) ||
            raw.startsWith(
                "/"
            ) ||
            raw.startsWith(
                "#"
            ) ||
            raw.startsWith(
                "?"
            )
        ) {

            return true;
        }

        try {

            const url =
                new URL(
                    raw,
                    window.location.href
                );

            const protocol =
                url.protocol.toLowerCase();

            if (
                protocol !== "http:" &&
                protocol !== "https:"
            ) {
                return false;
            }

            if (
                settings.sameOriginOnly
            ) {

                return (
                    url.origin ===
                    window.location.origin
                );
            }

            return true;

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       SAFE URL
       ======================================================== */

    function safeURL(
        value,
        fallback
    ) {

        if (
            isSafeURL(value)
        ) {

            return String(value);
        }

        return (
            fallback ||
            "#"
        );
    }


    /* ========================================================
       EXTERNAL LINK PROTECTION
       ======================================================== */

    function protectExternalLink(
        anchor
    ) {

        if (
            !anchor ||
            anchor.tagName !== "A"
        ) {
            return false;
        }

        const href =
            anchor.getAttribute(
                "href"
            );

        if (
            !href ||
            !isSafeURL(href)
        ) {

            anchor.setAttribute(
                "href",
                "#"
            );

            anchor.dataset.securityBlocked =
                "true";

            return false;
        }

        try {

            const url =
                new URL(
                    href,
                    window.location.href
                );

            if (
                url.origin !==
                window.location.origin
            ) {

                anchor.setAttribute(
                    "rel",
                    "noopener noreferrer"
                );

                if (
                    anchor.target ===
                    "_blank"
                ) {

                    anchor.setAttribute(
                        "referrerpolicy",
                        "no-referrer"
                    );
                }
            }

            return true;

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       PROTECT ALL LINKS
       ======================================================== */

    function protectLinks(
        root
    ) {

        const container =
            root || document;

        const links =
            container.querySelectorAll
                ? container.querySelectorAll(
                    "a[href]"
                )
                : [];

        let protectedCount = 0;

        links.forEach(
            function (link) {

                if (
                    protectExternalLink(
                        link
                    )
                ) {

                    protectedCount++;
                }
            }
        );

        return protectedCount;
    }


    /* ========================================================
       LOGIN STATE
       ======================================================== */

    function isLoggedIn() {

        return (
            storageGet(
                CONFIG.storageKeys.loggedIn
            ) === "true"
        );
    }


    function isAdminLoggedIn() {

        return (
            storageGet(
                CONFIG.storageKeys.adminLoggedIn
            ) === "true"
        );
    }


    /*
     * Frontend admin flag is NOT secure authorization.
     */

    function requireLogin() {

        if (
            isLoggedIn()
        ) {
            return true;
        }

        logEvent(
            "login-required"
        );

        return false;
    }


    function requireAdmin() {

        if (
            isAdminLoggedIn()
        ) {
            return true;
        }

        logEvent(
            "admin-access-check-failed"
        );

        return false;
    }


    /* ========================================================
       INPUT VALIDATION
       ======================================================== */

    function validateRequired(
        value,
        fieldName
    ) {

        const text =
            sanitizeText(
                value
            );

        if (!text) {

            return {

                valid: false,

                message:
                    (
                        fieldName ||
                        "This field"
                    ) +
                    " is required."

            };
        }

        return {

            valid: true,

            message: ""
        };
    }


    function validateEmail(
        email
    ) {

        const value =
            sanitizeText(
                email,
                320
            );

        if (!value) {

            return {

                valid: false,

                message:
                    "Email address is required."
            };
        }

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (
            !pattern.test(
                value
            )
        ) {

            return {

                valid: false,

                message:
                    "Please enter a valid email address."
            };
        }

        return {

            valid: true,

            message: ""
        };
    }


    function validateLength(
        value,
        min,
        max,
        fieldName
    ) {

        const text =
            sanitizeText(
                value
            );

        if (
            text.length <
            Number(min || 0)
        ) {

            return {

                valid: false,

                message:
                    (
                        fieldName ||
                        "Text"
                    ) +
                    " is too short."
            };
        }

        if (
            text.length >
            Number(max || Infinity)
        ) {

            return {

                valid: false,

                message:
                    (
                        fieldName ||
                        "Text"
                    ) +
                    " is too long."
            };
        }

        return {

            valid: true,

            message: ""
        };
    }


    /* ========================================================
       FILE VALIDATION
       ======================================================== */

    function validateFile(
        file,
        type
    ) {

        if (!file) {

            return {

                valid: false,

                message:
                    "No file selected."
            };
        }

        if (
            file.size >
            CONFIG.limits.fileSize
        ) {

            return {

                valid: false,

                message:
                    "File is larger than the allowed 50 MB limit."
            };
        }

        const fileType =
            String(
                file.type || ""
            ).toLowerCase();

        let allowed =
            [];

        if (
            type === "image"
        ) {

            allowed =
                CONFIG.allowedImageTypes;

        } else if (
            type === "video"
        ) {

            allowed =
                CONFIG.allowedVideoTypes;

        } else {

            allowed =
                [
                    ...CONFIG.allowedImageTypes,
                    ...CONFIG.allowedVideoTypes
                ];
        }

        if (
            !allowed.includes(
                fileType
            )
        ) {

            return {

                valid: false,

                message:
                    "This file type is not allowed."
            };
        }

        return {

            valid: true,

            message: ""
        };
    }


    function validateFiles(
        files,
        type
    ) {

        const list =
            Array.from(
                files || []
            );

        const invalid =
            [];

        list.forEach(
            function (file) {

                const result =
                    validateFile(
                        file,
                        type
                    );

                if (
                    !result.valid
                ) {

                    invalid.push({

                        name:
                            file.name,

                        message:
                            result.message
                    });
                }
            }
        );

        return {

            valid:
                invalid.length === 0,

            invalid:
                invalid,

            files:
                list
        };
    }


    /* ========================================================
       SAFE JSON PARSING
       ======================================================== */

    function safeJSONParse(
        value,
        fallback
    ) {

        try {

            return JSON.parse(
                value
            );

        } catch (error) {

            return (
                fallback === undefined
                    ? null
                    : fallback
            );
        }
    }


    function safeJSONStringify(
        value,
        fallback
    ) {

        try {

            return JSON.stringify(
                value
            );

        } catch (error) {

            return (
                fallback === undefined
                    ? ""
                    : fallback
            );
        }
    }


    /* ========================================================
       OBJECT SANITIZER
       ======================================================== */

    function sanitizeObject(
        object,
        options
    ) {

        const settings =
            options || {};

        if (
            object === null ||
            object === undefined
        ) {

            return object;
        }

        if (
            typeof object ===
            "string"
        ) {

            return sanitizeText(
                object,
                settings.maxLength
            );
        }

        if (
            Array.isArray(object)
        ) {

            return object.map(
                function (item) {

                    return sanitizeObject(
                        item,
                        settings
                    );
                }
            );
        }

        if (
            typeof object ===
            "object"
        ) {

            const result = {};

            Object.keys(
                object
            ).forEach(
                function (key) {

                    /*
                     * Ignore prototype-like keys.
                     */

                    if (
                        key ===
                        "__proto__" ||
                        key ===
                        "constructor" ||
                        key ===
                        "prototype"
                    ) {
                        return;
                    }

                    result[key] =
                        sanitizeObject(
                            object[key],
                            settings
                        );
                }
            );

            return result;
        }

        return object;
    }


    /* ========================================================
       ARTICLE SECURITY
       ======================================================== */

    function sanitizeArticle(
        article
    ) {

        if (
            !article ||
            typeof article !==
            "object"
        ) {

            return null;
        }

        const result =
            sanitizeObject(
                article
            );

        if (
            result.title
        ) {

            result.title =
                sanitizeText(
                    result.title,
                    CONFIG.limits.title
                );
        }

        if (
            result.description
        ) {

            result.description =
                sanitizeText(
                    result.description,
                    CONFIG.limits.description
                );
        }

        if (
            result.content
        ) {

            result.content =
                sanitizeHTML(
                    result.content
                );
        }

        if (
            result.sources
        ) {

            result.sources =
                sanitizeText(
                    result.sources,
                    CONFIG.limits.text
                );
        }

        return result;
    }


    /* ========================================================
       SECURITY EVENT LOG
       ======================================================== */

    function logEvent(
        type,
        details
    ) {

        const event = {

            type:
                sanitizeText(
                    type,
                    200
                ),

            details:
                sanitizeObject(
                    details || {}
                ),

            timestamp:
                new Date().toISOString(),

            page:
                window.location.pathname,

            online:
                navigator.onLine !== false
        };

        STATE.lastEvent =
            event;

        if (
            !STATE.localStorage
        ) {

            return event;
        }

        try {

            const existing =
                safeJSONParse(
                    storageGet(
                        CONFIG.storageKeys
                            .securityLog
                    ),
                    []
                );

            const logs =
                Array.isArray(existing)
                    ? existing
                    : [];

            logs.push(event);

            /*
             * Keep only latest 100 events.
             */

            const trimmed =
                logs.slice(-100);

            storageSet(
                CONFIG.storageKeys
                    .securityLog,
                safeJSONStringify(
                    trimmed,
                    "[]"
                )
            );

        } catch (error) {

            /* Logging must never break the site */
        }

        return event;
    }


    /* ========================================================
       GET SECURITY LOG
       ======================================================== */

    function getSecurityLog() {

        if (
            !STATE.localStorage
        ) {

            return [];
        }

        return safeJSONParse(
            storageGet(
                CONFIG.storageKeys
                    .securityLog
            ),
            []
        );
    }


    /* ========================================================
       CLEAR SECURITY LOG
       ======================================================== */

    function clearSecurityLog() {

        if (
            !STATE.localStorage
        ) {
            return false;
        }

        return storageRemove(
            CONFIG.storageKeys
                .securityLog
        );
    }


    /* ========================================================
       SECURITY HEADERS / META CHECK
       ======================================================== */

    function checkSecurityMeta() {

        const results = {

            viewport:
                Boolean(
                    document.querySelector(
                        'meta[name="viewport"]'
                    )
                ),

            charset:
                Boolean(
                    document.querySelector(
                        'meta[charset]'
                    )
                ),

            referrer:
                Boolean(
                    document.querySelector(
                        'meta[name="referrer"]'
                    )
                ),

            contentSecurityPolicy:
                Boolean(
                    document.querySelector(
                        'meta[http-equiv="Content-Security-Policy"]'
                    )
                )
        };

        return results;
    }


    /* ========================================================
       FORM SECURITY
       ======================================================== */

    function protectForm(
        form
    ) {

        if (
            !form ||
            form.tagName !== "FORM"
        ) {
            return false;
        }

        form.setAttribute(
            "novalidate",
            form.getAttribute(
                "novalidate"
            ) !== null
                ? ""
                : form.getAttribute(
                    "novalidate"
                ) || ""
        );

        form.addEventListener(
            "submit",
            function () {

                const fields =
                    form.querySelectorAll(
                        "input, textarea"
                    );

                fields.forEach(
                    function (field) {

                        if (
                            field.type ===
                            "password"
                        ) {
                            return;
                        }

                        /*
                         * Do not rewrite user input
                         * automatically.
                         *
                         * Validation should happen
                         * before submission.
                         */
                    }
                );

                logEvent(
                    "form-submit",
                    {
                        form:
                            form.id ||
                            form.name ||
                            "unknown"
                    }
                );
            }
        );

        return true;
    }


    /* ========================================================
       PROTECT ALL FORMS
       ======================================================== */

    function protectForms() {

        const forms =
            document.querySelectorAll(
                "form"
            );

        forms.forEach(
            function (form) {

                protectForm(form);
            }
        );

        return forms.length;
    }


    /* ========================================================
       BLOCK DANGEROUS SCRIPT INJECTION
       ======================================================== */

    function checkInputForInjection(
        value
    ) {

        const text =
            String(
                value == null
                    ? ""
                    : value
            );

        const dangerousPatterns = [

            /<\s*script\b/i,

            /<\/\s*script\s*>/i,

            /javascript\s*:/i,

            /vbscript\s*:/i,

            /onerror\s*=/i,

            /onload\s*=/i,

            /onclick\s*=/i,

            /onmouseover\s*=/i,

            /<\s*iframe\b/i,

            /<\s*object\b/i,

            /<\s*embed\b/i

        ];

        const detected =
            dangerousPatterns.some(
                function (pattern) {

                    return pattern.test(
                        text
                    );
                }
            );

        if (detected) {

            STATE.blockedCount++;

            logEvent(
                "dangerous-input-detected"
            );
        }

        return detected;
    }


    /* ========================================================
       SAFE REDIRECT
       ======================================================== */

    function safeRedirect(
        url,
        fallback
    ) {

        const destination =
            safeURL(
                url,
                fallback ||
                "./"
            );

        if (
            destination === "#"
        ) {

            logEvent(
                "unsafe-redirect-blocked",
                {
                    url:
                        String(url || "")
                }
            );

            return false;
        }

        window.location.href =
            destination;

        return true;
    }


    /* ========================================================
       CONNECTION STATE
       ======================================================== */

    function updateConnection() {

        STATE.online =
            navigator.onLine !== false;

        document.documentElement.classList.toggle(
            "alon-security-online",
            STATE.online
        );

        document.documentElement.classList.toggle(
            "alon-security-offline",
            !STATE.online
        );
    }


    /* ========================================================
       GLOBAL LINK GUARD
       ======================================================== */

    function setupLinkGuard() {

        document.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target &&
                    event.target.closest
                        ? event.target.closest(
                            "a[href]"
                        )
                        : null;

                if (!target) {
                    return;
                }

                const href =
                    target.getAttribute(
                        "href"
                    );

                if (
                    href &&
                    !isSafeURL(href)
                ) {

                    event.preventDefault();

                    STATE.blockedCount++;

                    target.dataset.securityBlocked =
                        "true";

                    logEvent(
                        "unsafe-link-blocked",
                        {
                            href:
                                href
                        }
                    );
                }
            },
            true
        );
    }


    /* ========================================================
       GLOBAL INPUT GUARD
       ======================================================== */

    function setupInputGuard() {

        document.addEventListener(
            "input",
            function (event) {

                const target =
                    event.target;

                if (
                    !target ||
                    !(
                        target.matches &&
                        target.matches(
                            "input[type='text'], textarea, [contenteditable='true']"
                        )
                    )
                ) {
                    return;
                }

                /*
                 * We only inspect for obvious injection
                 * patterns. We do not silently delete
                 * user content.
                 */

                if (
                    checkInputForInjection(
                        target.value ||
                        target.textContent ||
                        ""
                    )
                ) {

                    target.dataset.securityWarning =
                        "true";
                }
            }
        );
    }


    /* ========================================================
       INITIALIZE
       ======================================================== */

    function initialize() {

        if (
            STATE.initialized
        ) {

            return getStatus();
        }

        STATE.localStorage =
            storageAvailable();

        STATE.online =
            navigator.onLine !== false;

        updateConnection();

        protectLinks(
            document
        );

        protectForms();

        setupLinkGuard();

        setupInputGuard();

        window.addEventListener(
            "online",
            function () {

                STATE.online = true;

                updateConnection();

                logEvent(
                    "connection-online"
                );
            }
        );

        window.addEventListener(
            "offline",
            function () {

                STATE.online = false;

                updateConnection();

                logEvent(
                    "connection-offline"
                );
            }
        );

        STATE.initialized =
            true;

        dispatchReady();

        return getStatus();
    }


    /* ========================================================
       READY EVENT
       ======================================================== */

    function dispatchReady() {

        try {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:security-ready",
                    {
                        detail:
                            getStatus()
                    }
                )
            );

        } catch (error) {

            /* Safe fallback */
        }
    }


    /* ========================================================
       STATUS
       ======================================================== */

    function getStatus() {

        return {

            project:
                PROJECT.name,

            version:
                PROJECT.version,

            initialized:
                STATE.initialized,

            secureContext:
                STATE.secureContext,

            localStorage:
                STATE.localStorage,

            online:
                STATE.online,

            loggedIn:
                isLoggedIn(),

            adminLoggedIn:
                isAdminLoggedIn(),

            blockedCount:
                STATE.blockedCount,

            lastEvent:
                STATE.lastEvent,

            securityMeta:
                checkSecurityMeta()
        };
    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.ALON_SECURITY = {

        project:
            PROJECT,

        config:
            CONFIG,

        state:
            STATE,

        initialize:
            initialize,

        getStatus:
            getStatus,

        escapeHTML:
            escapeHTML,

        sanitizeText:
            sanitizeText,

        sanitizeHTML:
            sanitizeHTML,

        sanitizeObject:
            sanitizeObject,

        sanitizeArticle:
            sanitizeArticle,

        containsDangerousHTML:
            containsDangerousHTML,

        checkInputForInjection:
            checkInputForInjection,

        isSafeURL:
            isSafeURL,

        safeURL:
            safeURL,

        safeRedirect:
            safeRedirect,

        protectLinks:
            protectLinks,

        protectExternalLink:
            protectExternalLink,

        protectForms:
            protectForms,

        protectForm:
            protectForm,

        validateRequired:
            validateRequired,

        validateEmail:
            validateEmail,

        validateLength:
            validateLength,

        validateFile:
            validateFile,

        validateFiles:
            validateFiles,

        isLoggedIn:
            isLoggedIn,

        isAdminLoggedIn:
            isAdminLoggedIn,

        requireLogin:
            requireLogin,

        requireAdmin:
            requireAdmin,

        logEvent:
            logEvent,

        getSecurityLog:
            getSecurityLog,

        clearSecurityLog:
            clearSecurityLog,

        checkSecurityMeta:
            checkSecurityMeta
    };


    /* ========================================================
       COMPATIBILITY GLOBAL
       ======================================================== */

    window.ALON_HISTORYVERSE_SECURITY =
        window.ALON_SECURITY;


    /* ========================================================
       AUTO INITIALIZE
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initialize();

            },
            {
                once: true
            }
        );

    } else {

        initialize();
    }


})(window, document);


/* ============================================================
   END OF ALON HISTORYVERSE 24 SECURITY ENGINE
   ============================================================ */