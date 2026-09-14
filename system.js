/* =========================================================
   ALON HISTORYVERSE 24
   SYSTEM ENGINE
   Version: 24.0
   Creator: Baba Thecno Guru

   Purpose:
   - System status
   - Browser information
   - Online / Offline status
   - LocalStorage availability
   - Viewport information
   - Page visibility
   - Device capability checks
   - System events
   - Basic application health

   This is a frontend system helper.
   It does NOT provide server-side security.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0",

        storageKeys: {
            systemInfo:
                "alon_historyverse_system_info",

            systemReady:
                "alon_historyverse_system_ready",

            systemLog:
                "alon_historyverse_system_log"
        },

        maxLogEntries: 100
    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {
        initialized: false,
        ready: false,

        online:
            navigator.onLine,

        visible:
            document.visibilityState === "visible",

        storageAvailable: false,

        device: {
            mobile: false,
            tablet: false,
            desktop: false,
            touch: false
        },

        browser: {
            name: "Unknown",
            version: "Unknown"
        },

        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio:
                window.devicePixelRatio || 1
        },

        errors: 0,
        warnings: 0,

        startedAt: null,
        lastUpdated: null
    };


    /* =====================================================
       HELPERS
    ====================================================== */

    function nowISO() {
        return new Date().toISOString();
    }


    function safeString(value) {
        return String(value ?? "");
    }


    /* =====================================================
       STORAGE
    ====================================================== */

    function checkStorage() {

        try {

            const testKey =
                "__alon_historyverse_storage_test__";

            localStorage.setItem(
                testKey,
                "ok"
            );

            const result =
                localStorage.getItem(
                    testKey
                ) === "ok";

            localStorage.removeItem(
                testKey
            );

            STATE.storageAvailable =
                result;

            return result;

        } catch (error) {

            STATE.storageAvailable =
                false;

            return false;
        }
    }


    function saveStorage(
        key,
        value
    ) {

        if (!STATE.storageAvailable) {
            return false;
        }

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


    function readStorage(
        key,
        fallback
    ) {

        if (!STATE.storageAvailable) {
            return fallback;
        }

        try {

            const value =
                localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            return fallback;
        }
    }


    /* =====================================================
       DEVICE DETECTION
    ====================================================== */

    function detectDevice() {

        const width =
            window.innerWidth;

        const touch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

        STATE.device.touch =
            touch;

        /*
         * These ranges are practical UI
         * categories, not exact hardware detection.
         */

        STATE.device.mobile =
            width <= 767;

        STATE.device.tablet =
            width >= 768 &&
            width <= 1024;

        STATE.device.desktop =
            width > 1024;

        return STATE.device;
    }


    /* =====================================================
       BROWSER DETECTION
    ====================================================== */

    function detectBrowser() {

        const ua =
            navigator.userAgent || "";

        let name =
            "Unknown";

        let version =
            "Unknown";


        if (
            /Edg\//i.test(ua)
        ) {

            name = "Microsoft Edge";

            const match =
                ua.match(
                    /Edg\/([\d.]+)/i
                );

            if (match) {
                version = match[1];
            }

        } else if (
            /OPR\//i.test(ua)
        ) {

            name = "Opera";

            const match =
                ua.match(
                    /OPR\/([\d.]+)/i
                );

            if (match) {
                version = match[1];
            }

        } else if (
            /Chrome\//i.test(ua) &&
            !/Edg\//i.test(ua)
        ) {

            name = "Chrome";

            const match =
                ua.match(
                    /Chrome\/([\d.]+)/i
                );

            if (match) {
                version = match[1];
            }

        } else if (
            /Firefox\//i.test(ua)
        ) {

            name = "Firefox";

            const match =
                ua.match(
                    /Firefox\/([\d.]+)/i
                );

            if (match) {
                version = match[1];
            }

        } else if (
            /Safari\//i.test(ua) &&
            !/Chrome\//i.test(ua)
        ) {

            name = "Safari";

            const match =
                ua.match(
                    /Version\/([\d.]+)/i
                );

            if (match) {
                version = match[1];
            }

        } else if (
            /MSIE|Trident/i.test(ua)
        ) {

            name = "Internet Explorer";
        }


        STATE.browser = {
            name,
            version
        };

        return STATE.browser;
    }


    /* =====================================================
       VIEWPORT
    ====================================================== */

    function updateViewport() {

        STATE.viewport = {

            width:
                window.innerWidth,

            height:
                window.innerHeight,

            devicePixelRatio:
                window.devicePixelRatio || 1
        };

        return STATE.viewport;
    }


    /* =====================================================
       CONNECTION STATUS
    ====================================================== */

    function updateConnectionStatus(
        online
    ) {

        STATE.online =
            Boolean(online);

        STATE.lastUpdated =
            nowISO();

        saveSystemInfo();

        dispatch(
            "alon:system-connection",
            {
                online:
                    STATE.online
            }
        );
    }


    /* =====================================================
       VISIBILITY STATUS
    ====================================================== */

    function updateVisibility() {

        STATE.visible =
            document.visibilityState ===
            "visible";

        STATE.lastUpdated =
            nowISO();

        dispatch(
            "alon:system-visibility",
            {
                visible:
                    STATE.visible
            }
        );
    }


    /* =====================================================
       SYSTEM INFORMATION
    ====================================================== */

    function getSystemInfo() {

        return {

            project:
                CONFIG.project,

            creator:
                CONFIG.creator,

            version:
                CONFIG.version,

            online:
                STATE.online,

            visible:
                STATE.visible,

            storageAvailable:
                STATE.storageAvailable,

            device:
                {
                    ...STATE.device
                },

            browser:
                {
                    ...STATE.browser
                },

            viewport:
                {
                    ...STATE.viewport
                },

            language:
                navigator.language ||
                "",

            languages:
                Array.isArray(
                    navigator.languages
                )
                    ? [
                        ...navigator.languages
                    ]
                    : [],

            platform:
                navigator.platform ||
                "",

            userAgent:
                navigator.userAgent ||
                "",

            cookieEnabled:
                navigator.cookieEnabled,

            hardwareConcurrency:
                navigator.hardwareConcurrency ||
                null,

            maxTouchPoints:
                navigator.maxTouchPoints ||
                0,

            startedAt:
                STATE.startedAt,

            lastUpdated:
                STATE.lastUpdated,

            errors:
                STATE.errors,

            warnings:
                STATE.warnings
        };
    }


    /* =====================================================
       SAVE SYSTEM INFORMATION
    ====================================================== */

    function saveSystemInfo() {

        STATE.lastUpdated =
            nowISO();

        const info =
            getSystemInfo();

        saveStorage(
            CONFIG.storageKeys.systemInfo,
            info
        );

        return info;
    }


    /* =====================================================
       EVENT DISPATCHER
    ====================================================== */

    function dispatch(
        eventName,
        detail
    ) {

        try {

            document.dispatchEvent(
                new CustomEvent(
                    eventName,
                    {
                        detail:
                            detail || {}
                    }
                )
            );

        } catch (error) {

            console.warn(
                "ALON SYSTEM: event failed",
                error
            );
        }
    }


    /* =====================================================
       SYSTEM LOG
    ====================================================== */

    function writeLog(
        type,
        message,
        details
    ) {

        const logs =
            readStorage(
                CONFIG.storageKeys.systemLog,
                []
            );

        const list =
            Array.isArray(logs)
                ? logs
                : [];

        list.push({

            id:
                Date.now().toString(36) +
                Math.random()
                    .toString(36)
                    .slice(2, 7),

            type:
                type || "info",

            message:
                safeString(message),

            details:
                details || null,

            timestamp:
                nowISO()
        });


        const limited =
            list.slice(
                -CONFIG.maxLogEntries
            );

        saveStorage(
            CONFIG.storageKeys.systemLog,
            limited
        );
    }


    function info(
        message,
        details
    ) {

        writeLog(
            "info",
            message,
            details
        );
    }


    function warn(
        message,
        details
    ) {

        STATE.warnings += 1;

        writeLog(
            "warning",
            message,
            details
        );

        console.warn(
            "ALON SYSTEM:",
            message,
            details || ""
        );
    }


    function error(
        message,
        details
    ) {

        STATE.errors += 1;

        writeLog(
            "error",
            message,
            details
        );

        console.error(
            "ALON SYSTEM:",
            message,
            details || ""
        );
    }


    /* =====================================================
       SYSTEM EVENTS
    ====================================================== */

    function bindEvents() {

        window.addEventListener(
            "online",
            function () {

                updateConnectionStatus(
                    true
                );

                info(
                    "Connection restored."
                );
            }
        );


        window.addEventListener(
            "offline",
            function () {

                updateConnectionStatus(
                    false
                );

                warn(
                    "Browser is offline."
                );
            }
        );


        document.addEventListener(
            "visibilitychange",
            function () {

                updateVisibility();
            }
        );


        window.addEventListener(
            "resize",
            function () {

                updateViewport();

                detectDevice();

                saveSystemInfo();

                dispatch(
                    "alon:system-resize",
                    {
                        viewport:
                            STATE.viewport,

                        device:
                            STATE.device
                    }
                );
            }
        );


        window.addEventListener(
            "orientationchange",
            function () {

                setTimeout(
                    function () {

                        updateViewport();

                        detectDevice();

                        saveSystemInfo();

                        dispatch(
                            "alon:system-orientation",
                            {
                                viewport:
                                    STATE.viewport,

                                device:
                                    STATE.device
                            }
                        );

                    },
                    100
                );
            }
        );
    }


    /* =====================================================
       PAGE INFORMATION
    ====================================================== */

    function getPageInfo() {

        const path =
            window.location.pathname ||
            "";

        const parts =
            path.split("/");

        const file =
            parts.length
                ? parts[parts.length - 1]
                : "";

        return {

            url:
                window.location.href,

            pathname:
                path,

            file:
                file || "index.html",

            protocol:
                window.location.protocol,

            host:
                window.location.host,

            referrer:
                document.referrer || "",

            title:
                document.title || "",

            readyState:
                document.readyState,

            visibility:
                document.visibilityState
        };
    }


    /* =====================================================
       CAPABILITY CHECKS
    ====================================================== */

    function getCapabilities() {

        return {

            localStorage:
                STATE.storageAvailable,

            sessionStorage:
                checkSessionStorage(),

            fetch:
                typeof window.fetch ===
                "function",

            promises:
                typeof Promise !==
                "undefined",

            customEvents:
                typeof CustomEvent !==
                "undefined",

            serviceWorker:
                "serviceWorker" in
                navigator,

            notifications:
                "Notification" in
                window,

            geolocation:
                "geolocation" in
                navigator,

            camera:
                !!(
                    navigator.mediaDevices &&
                    navigator.mediaDevices
                        .getUserMedia
                ),

            touch:
                STATE.device.touch,

            online:
                navigator.onLine
        };
    }


    function checkSessionStorage() {

        try {

            const key =
                "__alon_historyverse_session_test__";

            sessionStorage.setItem(
                key,
                "ok"
            );

            const result =
                sessionStorage.getItem(
                    key
                ) === "ok";

            sessionStorage.removeItem(
                key
            );

            return result;

        } catch (error) {

            return false;
        }
    }


    /* =====================================================
       HEALTH CHECK
    ====================================================== */

    function healthCheck() {

        const capabilities =
            getCapabilities();

        const healthy =
            Boolean(
                capabilities.fetch &&
                capabilities.promises
            );

        return {

            healthy,

            project:
                CONFIG.project,

            version:
                CONFIG.version,

            online:
                STATE.online,

            storage:
                STATE.storageAvailable,

            capabilities,

            errors:
                STATE.errors,

            warnings:
                STATE.warnings,

            timestamp:
                nowISO()
        };
    }


    /* =====================================================
       READY STATE
    ====================================================== */

    function setReady() {

        STATE.ready =
            true;

        saveStorage(
            CONFIG.storageKeys.systemReady,
            {
                ready: true,
                timestamp:
                    nowISO(),
                version:
                    CONFIG.version
            }
        );

        dispatch(
            "alon:system-ready",
            {
                system:
                    getSystemInfo()
            }
        );
    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    function initialize() {

        if (STATE.initialized) {
            return getSystemInfo();
        }

        STATE.startedAt =
            nowISO();

        checkStorage();

        detectDevice();

        detectBrowser();

        updateViewport();

        STATE.online =
            navigator.onLine;

        STATE.visible =
            document.visibilityState ===
            "visible";

        bindEvents();

        saveSystemInfo();

        info(
            "ALON HISTORYVERSE 24 system initialized."
        );

        STATE.initialized =
            true;

        setReady();

        return getSystemInfo();
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const SYSTEM = {

        config:
            CONFIG,

        state:
            STATE,

        initialize,

        getInfo:
            getSystemInfo,

        getSystemInfo,

        getPageInfo,

        getCapabilities,

        healthCheck,

        saveInfo:
            saveSystemInfo,

        detectDevice,

        detectBrowser,

        updateViewport,

        isOnline:
            function () {
                return STATE.online;
            },

        isVisible:
            function () {
                return STATE.visible;
            },

        isMobile:
            function () {
                return STATE.device.mobile;
            },

        isTablet:
            function () {
                return STATE.device.tablet;
            },

        isDesktop:
            function () {
                return STATE.device.desktop;
            },

        hasTouch:
            function () {
                return STATE.device.touch;
            },

        storageAvailable:
            function () {
                return STATE.storageAvailable;
            },

        info,

        warn,

        error,

        getLogs:
            function () {

                return readStorage(
                    CONFIG.storageKeys.systemLog,
                    []
                );
            },

        clearLogs:
            function () {

                return saveStorage(
                    CONFIG.storageKeys.systemLog,
                    []
                );
            }
    };


    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_SYSTEM =
        SYSTEM;

    window.ALON_HISTORYVERSE_SYSTEM =
        SYSTEM;


    /* =====================================================
       AUTO START
    ====================================================== */

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


})();