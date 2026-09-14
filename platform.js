/* ============================================================
   ALON HISTORYVERSE 24
   PLATFORM ENGINE
   File: jss/platform.js
   Creator: Baba Thecno Guru
   Version: 24.0

   PURPOSE
   ------------------------------------------------------------
   • Device / browser detection
   • Mobile / tablet / desktop detection
   • Online / offline state
   • Screen / viewport information
   • LocalStorage availability
   • Touch capability
   • PWA / standalone detection
   • Service Worker readiness
   • Platform events
   • Safe platform information
   • No root index/path changes
   ============================================================ */

(function (window, document) {

    "use strict";

    /* ========================================================
       PROJECT CONFIG
       ======================================================== */

    const PROJECT = {
        name: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0"
    };


    /* ========================================================
       STORAGE KEYS
       ======================================================== */

    const STORAGE_KEYS = {
        platformInfo: "alon_historyverse_platform_info",
        platformReady: "alon_historyverse_platform_ready"
    };


    /* ========================================================
       INTERNAL STATE
       ======================================================== */

    const STATE = {
        initialized: false,
        online: navigator.onLine !== false,
        mobile: false,
        tablet: false,
        desktop: false,
        touch: false,
        standalone: false,
        serviceWorkerSupported: false,
        serviceWorkerReady: false,
        localStorageAvailable: false,
        browser: "unknown",
        os: "unknown",
        device: "unknown",
        viewport: {
            width: 0,
            height: 0
        }
    };


    /* ========================================================
       DOM HELPERS
       ======================================================== */

    function $(selector, root) {

        try {

            return (root || document).querySelector(selector);

        } catch (error) {

            return null;
        }
    }


    function dispatch(name, detail) {

        try {

            document.dispatchEvent(
                new CustomEvent(name, {
                    detail: detail || {}
                })
            );

        } catch (error) {

            /* Older browser safety */
        }
    }


    /* ========================================================
       STORAGE TEST
       ======================================================== */

    function checkLocalStorage() {

        try {

            if (!window.localStorage) {
                return false;
            }

            const testKey =
                "__alon_historyverse_storage_test__";

            window.localStorage.setItem(testKey, "1");
            window.localStorage.removeItem(testKey);

            return true;

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       TOUCH DETECTION
       ======================================================== */

    function detectTouch() {

        return (
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    }


    /* ========================================================
       VIEWPORT
       ======================================================== */

    function updateViewport() {

        STATE.viewport.width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            0;

        STATE.viewport.height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            0;

        updateDeviceClass();

        dispatch(
            "alon:viewport-change",
            getViewport()
        );
    }


    function updateDeviceClass() {

        const width = STATE.viewport.width;

        STATE.mobile = width <= 767;

        STATE.tablet =
            width >= 768 &&
            width <= 1024;

        STATE.desktop = width > 1024;

        document.documentElement.classList.toggle(
            "alon-mobile",
            STATE.mobile
        );

        document.documentElement.classList.toggle(
            "alon-tablet",
            STATE.tablet
        );

        document.documentElement.classList.toggle(
            "alon-desktop",
            STATE.desktop
        );
    }


    function getViewport() {

        return {
            width: STATE.viewport.width,
            height: STATE.viewport.height,
            mobile: STATE.mobile,
            tablet: STATE.tablet,
            desktop: STATE.desktop
        };
    }


    /* ========================================================
       OPERATING SYSTEM DETECTION
       ======================================================== */

    function detectOS() {

        const userAgent =
            navigator.userAgent ||
            navigator.vendor ||
            "";

        if (/Windows NT/i.test(userAgent)) {
            return "Windows";
        }

        if (/Android/i.test(userAgent)) {
            return "Android";
        }

        if (
            /iPhone|iPad|iPod/i.test(userAgent)
        ) {
            return "iOS";
        }

        if (/Mac OS X/i.test(userAgent)) {
            return "macOS";
        }

        if (/Linux/i.test(userAgent)) {
            return "Linux";
        }

        if (/CrOS/i.test(userAgent)) {
            return "ChromeOS";
        }

        return "Unknown";
    }


    /* ========================================================
       BROWSER DETECTION
       ======================================================== */

    function detectBrowser() {

        const ua = navigator.userAgent || "";

        if (/Edg\//i.test(ua)) {
            return "Microsoft Edge";
        }

        if (/OPR\//i.test(ua)) {
            return "Opera";
        }

        if (/SamsungBrowser/i.test(ua)) {
            return "Samsung Internet";
        }

        if (/Firefox\//i.test(ua)) {
            return "Firefox";
        }

        if (
            /Chrome\//i.test(ua) &&
            !/Edg\//i.test(ua)
        ) {
            return "Chrome";
        }

        if (
            /Safari\//i.test(ua) &&
            !/Chrome\//i.test(ua)
        ) {
            return "Safari";
        }

        if (/MSIE|Trident/i.test(ua)) {
            return "Internet Explorer";
        }

        return "Unknown";
    }


    /* ========================================================
       DEVICE TYPE
       ======================================================== */

    function detectDevice() {

        const ua = navigator.userAgent || "";

        if (/iPad/i.test(ua)) {
            return "Tablet";
        }

        if (
            /Android/i.test(ua) &&
            !/Mobile/i.test(ua)
        ) {
            return "Tablet";
        }

        if (
            /Mobile|iPhone|iPod|Android/i.test(ua)
        ) {
            return "Mobile";
        }

        if (STATE.tablet) {
            return "Tablet";
        }

        if (STATE.mobile) {
            return "Mobile";
        }

        return "Desktop";
    }


    /* ========================================================
       STANDALONE / PWA DETECTION
       ======================================================== */

    function detectStandalone() {

        const standaloneMedia =
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches;

        const iosStandalone =
            window.navigator.standalone === true;

        return Boolean(
            standaloneMedia ||
            iosStandalone
        );
    }


    /* ========================================================
       SERVICE WORKER
       ======================================================== */

    async function checkServiceWorker() {

        if (!("serviceWorker" in navigator)) {

            STATE.serviceWorkerSupported = false;
            STATE.serviceWorkerReady = false;

            return false;
        }

        STATE.serviceWorkerSupported = true;

        try {

            await navigator.serviceWorker.ready;

            STATE.serviceWorkerReady = true;

            dispatch(
                "alon:service-worker-ready",
                {
                    supported: true,
                    ready: true
                }
            );

            return true;

        } catch (error) {

            STATE.serviceWorkerReady = false;

            return false;
        }
    }


    /* ========================================================
       CONNECTION STATUS
       ======================================================== */

    function updateConnectionStatus(isOnline) {

        STATE.online = Boolean(isOnline);

        document.documentElement.classList.toggle(
            "alon-online",
            STATE.online
        );

        document.documentElement.classList.toggle(
            "alon-offline",
            !STATE.online
        );

        dispatch(
            STATE.online
                ? "alon:online"
                : "alon:offline",
            {
                online: STATE.online
            }
        );

        dispatch(
            "alon:connection-change",
            {
                online: STATE.online
            }
        );
    }


    /* ========================================================
       PLATFORM INFORMATION
       ======================================================== */

    function getPlatformInfo() {

        return {

            project: PROJECT.name,

            creator: PROJECT.creator,

            version: PROJECT.version,

            browser: STATE.browser,

            os: STATE.os,

            device: STATE.device,

            mobile: STATE.mobile,

            tablet: STATE.tablet,

            desktop: STATE.desktop,

            touch: STATE.touch,

            online: STATE.online,

            standalone: STATE.standalone,

            serviceWorkerSupported:
                STATE.serviceWorkerSupported,

            serviceWorkerReady:
                STATE.serviceWorkerReady,

            localStorageAvailable:
                STATE.localStorageAvailable,

            viewport: {
                width: STATE.viewport.width,
                height: STATE.viewport.height
            },

            language:
                navigator.language || "en",

            languages:
                Array.isArray(navigator.languages)
                    ? navigator.languages.slice()
                    : [],

            timezone:
                (() => {
                    try {

                        return Intl.DateTimeFormat()
                            .resolvedOptions()
                            .timeZone || "Unknown";

                    } catch (error) {

                        return "Unknown";
                    }
                })()
        };
    }


    /* ========================================================
       SAVE PLATFORM INFO
       ======================================================== */

    function savePlatformInfo() {

        if (!STATE.localStorageAvailable) {
            return false;
        }

        try {

            localStorage.setItem(
                STORAGE_KEYS.platformInfo,
                JSON.stringify(
                    getPlatformInfo()
                )
            );

            localStorage.setItem(
                STORAGE_KEYS.platformReady,
                "true"
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       READ SAVED PLATFORM INFO
       ======================================================== */

    function getSavedPlatformInfo() {

        if (!STATE.localStorageAvailable) {
            return null;
        }

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEYS.platformInfo
                );

            if (!raw) {
                return null;
            }

            return JSON.parse(raw);

        } catch (error) {

            return null;
        }
    }


    /* ========================================================
       DEVICE CLASS
       ======================================================== */

    function getDeviceClass() {

        if (STATE.mobile) {
            return "mobile";
        }

        if (STATE.tablet) {
            return "tablet";
        }

        return "desktop";
    }


    /* ========================================================
       IS MOBILE
       ======================================================== */

    function isMobile() {

        return STATE.mobile;
    }


    /* ========================================================
       IS TABLET
       ======================================================== */

    function isTablet() {

        return STATE.tablet;
    }


    /* ========================================================
       IS DESKTOP
       ======================================================== */

    function isDesktop() {

        return STATE.desktop;
    }


    /* ========================================================
       IS ONLINE
       ======================================================== */

    function isOnline() {

        return STATE.online;
    }


    /* ========================================================
       IS TOUCH DEVICE
       ======================================================== */

    function isTouchDevice() {

        return STATE.touch;
    }


    /* ========================================================
       IS PWA
       ======================================================== */

    function isStandalone() {

        return STATE.standalone;
    }


    /* ========================================================
       PLATFORM STATUS
       ======================================================== */

    function getStatus() {

        return {

            initialized:
                STATE.initialized,

            online:
                STATE.online,

            device:
                STATE.device,

            deviceClass:
                getDeviceClass(),

            browser:
                STATE.browser,

            os:
                STATE.os,

            touch:
                STATE.touch,

            standalone:
                STATE.standalone,

            localStorage:
                STATE.localStorageAvailable,

            serviceWorker:
                {
                    supported:
                        STATE.serviceWorkerSupported,

                    ready:
                        STATE.serviceWorkerReady
                },

            viewport:
                getViewport()
        };
    }


    /* ========================================================
       ADD PLATFORM BODY CLASSES
       ======================================================== */

    function applyPlatformClasses() {

        const html =
            document.documentElement;

        html.classList.add(
            "alon-historyverse-platform"
        );

        html.classList.toggle(
            "alon-touch",
            STATE.touch
        );

        html.classList.toggle(
            "alon-no-touch",
            !STATE.touch
        );

        html.classList.toggle(
            "alon-pwa",
            STATE.standalone
        );

        html.classList.toggle(
            "alon-browser-online",
            STATE.online
        );

        html.classList.toggle(
            "alon-browser-offline",
            !STATE.online
        );

        html.classList.toggle(
            "alon-storage-ok",
            STATE.localStorageAvailable
        );
    }


    /* ========================================================
       ONLINE EVENT
       ======================================================== */

    function handleOnline() {

        updateConnectionStatus(true);
        savePlatformInfo();
    }


    /* ========================================================
       OFFLINE EVENT
       ======================================================== */

    function handleOffline() {

        updateConnectionStatus(false);
        savePlatformInfo();
    }


    /* ========================================================
       RESIZE EVENT
       ======================================================== */

    function handleResize() {

        updateViewport();

        STATE.device =
            detectDevice();

        applyPlatformClasses();
    }


    /* ========================================================
       VISIBILITY EVENT
       ======================================================== */

    function handleVisibility() {

        dispatch(
            "alon:visibility-change",
            {
                visible:
                    document.visibilityState === "visible",

                state:
                    document.visibilityState
            }
        );
    }


    /* ========================================================
       PWA DISPLAY MODE CHANGE
       ======================================================== */

    function watchDisplayMode() {

        if (!window.matchMedia) {
            return;
        }

        try {

            const media =
                window.matchMedia(
                    "(display-mode: standalone)"
                );

            const update = function () {

                STATE.standalone =
                    detectStandalone();

                applyPlatformClasses();

                dispatch(
                    "alon:display-mode-change",
                    {
                        standalone:
                            STATE.standalone
                    }
                );
            };

            if (
                typeof media.addEventListener ===
                "function"
            ) {

                media.addEventListener(
                    "change",
                    update
                );

            } else if (
                typeof media.addListener ===
                "function"
            ) {

                media.addListener(update);
            }

        } catch (error) {

            /* Safe fallback */
        }
    }


    /* ========================================================
       INITIALIZE
       ======================================================== */

    async function initialize() {

        if (STATE.initialized) {
            return getPlatformInfo();
        }

        try {

            STATE.localStorageAvailable =
                checkLocalStorage();

            STATE.touch =
                detectTouch();

            STATE.online =
                navigator.onLine !== false;

            updateViewport();

            STATE.browser =
                detectBrowser();

            STATE.os =
                detectOS();

            STATE.device =
                detectDevice();

            STATE.standalone =
                detectStandalone();

            STATE.serviceWorkerSupported =
                "serviceWorker" in navigator;

            applyPlatformClasses();

            window.addEventListener(
                "online",
                handleOnline
            );

            window.addEventListener(
                "offline",
                handleOffline
            );

            window.addEventListener(
                "resize",
                handleResize,
                { passive: true }
            );

            document.addEventListener(
                "visibilitychange",
                handleVisibility
            );

            watchDisplayMode();

            STATE.initialized = true;

            await checkServiceWorker();

            savePlatformInfo();

            dispatch(
                "alon:platform-ready",
                getPlatformInfo()
            );

            return getPlatformInfo();

        } catch (error) {

            STATE.initialized = true;

            dispatch(
                "alon:platform-error",
                {
                    message:
                        error &&
                        error.message
                            ? error.message
                            : "Platform initialization error"
                }
            );

            return getPlatformInfo();
        }
    }


    /* ========================================================
       DESTROY
       ======================================================== */

    function destroy() {

        window.removeEventListener(
            "online",
            handleOnline
        );

        window.removeEventListener(
            "offline",
            handleOffline
        );

        window.removeEventListener(
            "resize",
            handleResize
        );

        document.removeEventListener(
            "visibilitychange",
            handleVisibility
        );

        STATE.initialized = false;
    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.ALON_PLATFORM = {

        project: PROJECT,

        state: STATE,

        initialize: initialize,

        destroy: destroy,

        getInfo: getPlatformInfo,

        getStatus: getStatus,

        getSavedInfo:
            getSavedPlatformInfo,

        getViewport:
            getViewport,

        getDeviceClass:
            getDeviceClass,

        isMobile:
            isMobile,

        isTablet:
            isTablet,

        isDesktop:
            isDesktop,

        isOnline:
            isOnline,

        isTouchDevice:
            isTouchDevice,

        isStandalone:
            isStandalone,

        checkServiceWorker:
            checkServiceWorker,

        saveInfo:
            savePlatformInfo
    };


    /* ========================================================
       COMPATIBILITY GLOBAL
       ======================================================== */

    window.ALON_HISTORYVERSE_PLATFORM =
        window.ALON_PLATFORM;


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
   END OF ALON HISTORYVERSE 24 PLATFORM ENGINE
   ============================================================ */