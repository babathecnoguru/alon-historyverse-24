/* =========================================================
   ALON HISTORYVERSE 24
   MASTER CONTROLLER
   File: jss/master-controller.js
   Creator: Baba Thecno Guru
   Version: 24.0

   Purpose:
   - Coordinate project JavaScript engines
   - Detect current page
   - Start available modules safely
   - Prevent duplicate initialization
   - Provide global project controller
   - Maintain stable frontend architecture

   IMPORTANT:
   This controller does NOT modify root index paths.
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       PROJECT CONFIGURATION
    ===================================================== */

    const CONFIG = {

        project:
            "ALON HISTORYVERSE 24",

        creator:
            "Baba Thecno Guru",

        version:
            "24.0",

        controller:
            "master-controller",

        debug:
            false,

        autoStart:
            true,

        startupDelay:
            0
    };


    /* =====================================================
       ENGINE REGISTRY
    ===================================================== */

    const ENGINES = {

        data: {
            name: "Data Engine",
            global: "ALON_DATA",
            ready: false
        },

        core: {
            name: "Core Engine",
            global: "ALON_CORE",
            ready: false
        },

        engine: {
            name: "Main Engine",
            global: "ALON_ENGINE",
            ready: false
        },

        language: {
            name: "Language Engine",
            global: "ALON_LANGUAGE",
            ready: false
        },

        libraryEngine: {
            name: "Library Engine",
            global: "ALON_LIBRARY",
            ready: false
        },

        library: {
            name: "Library Controller",
            global: "ALON_LIBRARY_UI",
            ready: false
        },

        articles: {
            name: "Articles Engine",
            global: "ALON_ARTICLES",
            ready: false
        },

        explore: {
            name: "Explore Engine",
            global: "ALON_EXPLORE",
            ready: false
        },

        countriesClick: {
            name: "Countries Click Engine",
            global: "ALON_COUNTRIES_CLICK",
            ready: false
        },

        country: {
            name: "Country Engine",
            global: "ALON_COUNTRY",
            ready: false
        },

        firebase: {
            name: "Firebase Engine",
            global: "ALON_FIREBASE",
            ready: false
        },

        admin: {
            name: "Admin Engine",
            global: "ALON_ADMIN",
            ready: false
        },

        contact: {
            name: "Contact Engine",
            global: "ALON_CONTACT",
            ready: false
        }

    };


    /* =====================================================
       STATE
       ===================================================== */

    const STATE = {

        initialized:
            false,

        initializing:
            false,

        ready:
            false,

        page:
            "",

        startTime:
            null,

        endTime:
            null,

        errors:
            [],

        warnings:
            [],

        events:
            [],

        engineCount:
            0,

        readyEngineCount:
            0

    };


    /* =====================================================
       LOGGING
       ===================================================== */

    function log() {

        if (!CONFIG.debug) {
            return;
        }

        console.log(
            "[ALON MASTER]",
            ...arguments
        );
    }


    function warn() {

        if (!CONFIG.debug) {
            return;
        }

        console.warn(
            "[ALON MASTER]",
            ...arguments
        );
    }


    function errorLog() {

        console.error(
            "[ALON MASTER]",
            ...arguments
        );
    }


    /* =====================================================
       PAGE DETECTION
       ===================================================== */

    function getCurrentPage() {

        const path =
            window.location.pathname
                .toLowerCase();


        const file =
            path
                .split("/")
                .pop();


        if (
            !file ||
            file === ""
        ) {

            return "home";
        }


        if (
            file === "index.html"
        ) {

            return "home";
        }


        return file.replace(
            ".html",
            ""
        );
    }


    /* =====================================================
       URL INFORMATION
       ===================================================== */

    function getURLInfo() {

        return {

            href:
                window.location.href,

            pathname:
                window.location.pathname,

            search:
                window.location.search,

            hash:
                window.location.hash,

            page:
                getCurrentPage()

        };
    }


    /* =====================================================
       ENGINE CHECK
       ===================================================== */

    function checkEngine(
        key
    ) {

        const engine =
            ENGINES[key];


        if (!engine) {

            return false;
        }


        const exists =
            !!window[
                engine.global
            ];


        engine.ready =
            exists;


        return exists;
    }


    /* =====================================================
       CHECK ALL ENGINES
       ===================================================== */

    function checkAllEngines() {

        let readyCount = 0;

        const keys =
            Object.keys(
                ENGINES
            );


        keys.forEach(
            function (key) {

                if (
                    checkEngine(key)
                ) {

                    readyCount++;
                }

            }
        );


        STATE.engineCount =
            keys.length;


        STATE.readyEngineCount =
            readyCount;


        return readyCount;
    }


    /* =====================================================
       ENGINE GETTER
       ===================================================== */

    function getEngine(
        key
    ) {

        const engine =
            ENGINES[key];


        if (!engine) {
            return null;
        }


        return (
            window[
                engine.global
            ] || null
        );
    }


    /* =====================================================
       ENGINE STATUS
       ===================================================== */

    function getEngineStatus() {

        const result = {};


        Object.keys(
            ENGINES
        ).forEach(
            function (key) {

                const engine =
                    ENGINES[key];


                result[key] = {

                    name:
                        engine.name,

                    global:
                        engine.global,

                    ready:
                        !!window[
                            engine.global
                        ]

                };

            }
        );


        return result;
    }


    /* =====================================================
       EVENT RECORDING
       ===================================================== */

    function recordEvent(
        name,
        detail
    ) {

        STATE.events.push({

            name:
                name,

            detail:
                detail || null,

            time:
                new Date().toISOString()

        });


        if (
            STATE.events.length >
            100
        ) {

            STATE.events.shift();
        }
    }


    /* =====================================================
       ERROR RECORDING
       ===================================================== */

    function recordError(
        source,
        error
    ) {

        const item = {

            source:
                source,

            message:
                error &&
                error.message
                    ? error.message
                    : String(error),

            time:
                new Date().toISOString()

        };


        STATE.errors.push(
            item
        );


        if (
            STATE.errors.length >
            50
        ) {

            STATE.errors.shift();
        }


        errorLog(
            source,
            error
        );
    }


    /* =====================================================
       WARNING RECORDING
       ===================================================== */

    function recordWarning(
        source,
        message
    ) {

        const item = {

            source:
                source,

            message:
                String(message),

            time:
                new Date().toISOString()

        };


        STATE.warnings.push(
            item
        );


        if (
            STATE.warnings.length >
            50
        ) {

            STATE.warnings.shift();
        }


        warn(
            source,
            message
        );
    }


    /* =====================================================
       CUSTOM EVENT DISPATCH
       ===================================================== */

    function dispatch(
        name,
        detail
    ) {

        recordEvent(
            name,
            detail
        );


        try {

            document.dispatchEvent(
                new CustomEvent(
                    name,
                    {
                        detail:
                            detail || {}
                    }
                )
            );

        } catch (error) {

            recordError(
                "event:" + name,
                error
            );
        }
    }


    /* =====================================================
       SAFE MODULE INITIALIZER
       ===================================================== */

    async function initializeModule(
        key
    ) {

        const engine =
            ENGINES[key];


        if (!engine) {

            recordWarning(
                "initializeModule",
                "Unknown engine: " + key
            );

            return false;
        }


        const module =
            getEngine(key);


        if (!module) {

            recordWarning(
                engine.name,
                "Engine not loaded."
            );

            return false;
        }


        /*
         * Some engines auto-initialize.
         * If they expose initialize(), call it safely.
         */

        if (
            typeof module.initialize ===
            "function"
        ) {

            try {

                const result =
                    module.initialize();


                if (
                    result &&
                    typeof result.then ===
                    "function"
                ) {

                    await result;
                }


            } catch (error) {

                recordError(
                    engine.name,
                    error
                );

                return false;
            }
        }


        engine.ready =
            true;


        return true;
    }


    /* =====================================================
       START CORE SYSTEMS
       ===================================================== */

    async function startCoreSystems() {

        /*
         * The existing engines normally
         * auto-start themselves.
         *
         * Master Controller only coordinates
         * them if they expose initialize().
         */

        const order = [

            "data",

            "core",

            "engine",

            "language"

        ];


        for (
            const key of order
        ) {

            if (
                getEngine(key)
            ) {

                await initializeModule(
                    key
                );
            }
        }
    }


    /* =====================================================
       START PAGE SYSTEMS
       ===================================================== */

    async function startPageSystems() {

        const page =
            STATE.page;


        const modules = [];


        switch (page) {

            case "library":

                modules.push(
                    "libraryEngine",
                    "library"
                );

                break;


            case "department":

                modules.push(
                    "libraryEngine",
                    "library"
                );

                break;


            case "subject":

                modules.push(
                    "libraryEngine",
                    "library"
                );

                break;


            case "book":

                modules.push(
                    "libraryEngine",
                    "library"
                );

                break;


            case "read":

                modules.push(
                    "libraryEngine",
                    "library"
                );

                break;


            case "articles":

                modules.push(
                    "articles"
                );

                break;


            case "article":

                modules.push(
                    "articles"
                );

                break;


            case "discover":

                modules.push(
                    "explore"
                );

                break;


            case "categories":

                modules.push(
                    "explore"
                );

                break;


            case "explore":

                modules.push(
                    "explore"
                );

                break;


            case "countries":

                modules.push(
                    "countriesClick"
                );

                break;


            case "country":

                modules.push(
                    "country"
                );

                break;


            case "contact":

                modules.push(
                    "contact"
                );

                break;


            case "admin":

                modules.push(
                    "admin"
                );

                break;


            case "admin-articles":

                modules.push(
                    "admin"
                );

                break;

        }


        /*
         * Firebase is optional.
         * If configured it can be used,
         * otherwise the rest of the site
         * must continue working.
         */

        if (
            getEngine(
                "firebase"
            )
        ) {

            modules.push(
                "firebase"
            );
        }


        for (
            const key of modules
        ) {

            await initializeModule(
                key
            );
        }
    }


    /* =====================================================
       LANGUAGE EVENT
       ===================================================== */

    function bindLanguageEvents() {

        document.addEventListener(
            "alon:language-change",
            function (event) {

                recordEvent(
                    "language-change",
                    event.detail
                );


                dispatch(
                    "alon:master-language-change",
                    event.detail
                );

            }
        );
    }


    /* =====================================================
       LIBRARY EVENT
       ===================================================== */

    function bindLibraryEvents() {

        document.addEventListener(
            "alon:library-ready",
            function (event) {

                recordEvent(
                    "library-ready",
                    event.detail
                );


                dispatch(
                    "alon:master-library-ready",
                    event.detail
                );

            }
        );
    }


    /* =====================================================
       ARTICLES EVENT
       ===================================================== */

    function bindArticleEvents() {

        document.addEventListener(
            "alon:articles-ready",
            function (event) {

                recordEvent(
                    "articles-ready",
                    event.detail
                );


                dispatch(
                    "alon:master-articles-ready",
                    event.detail
                );

            }
        );
    }


    /* =====================================================
       GLOBAL ERROR HANDLER
       ===================================================== */

    function bindGlobalErrors() {

        window.addEventListener(
            "error",
            function (event) {

                if (
                    !event ||
                    !event.error
                ) {
                    return;
                }


                recordError(
                    "window",
                    event.error
                );
            }
        );


        window.addEventListener(
            "unhandledrejection",
            function (event) {

                recordError(
                    "promise",
                    event.reason
                );
            }
        );
    }


    /* =====================================================
       CONNECTION STATUS
       ===================================================== */

    function getConnectionStatus() {

        return {

            online:
                navigator.onLine,

            type:
                navigator.connection
                    ? navigator.connection.effectiveType
                    : null

        };
    }


    function bindConnectionEvents() {

        window.addEventListener(
            "online",
            function () {

                dispatch(
                    "alon:connection-change",
                    {
                        online: true
                    }
                );

            }
        );


        window.addEventListener(
            "offline",
            function () {

                dispatch(
                    "alon:connection-change",
                    {
                        online: false
                    }
                );

            }
        );
    }


    /* =====================================================
       PAGE VISIBILITY
       ===================================================== */

    function bindVisibilityEvents() {

        document.addEventListener(
            "visibilitychange",
            function () {

                dispatch(
                    "alon:visibility-change",
                    {
                        visible:
                            !document.hidden
                    }
                );

            }
        );
    }


    /* =====================================================
       STORAGE EVENTS
       ===================================================== */

    function bindStorageEvents() {

        window.addEventListener(
            "storage",
            function (event) {

                dispatch(
                    "alon:storage-change",
                    {
                        key:
                            event.key,

                        oldValue:
                            event.oldValue,

                        newValue:
                            event.newValue
                    }
                );

            }
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    async function initialize() {

        if (
            STATE.initialized ||
            STATE.initializing
        ) {

            return;
        }


        STATE.initializing =
            true;


        STATE.startTime =
            Date.now();


        STATE.page =
            getCurrentPage();


        log(
            "Starting Master Controller...",
            STATE.page
        );


        bindGlobalErrors();

        bindConnectionEvents();

        bindVisibilityEvents();

        bindStorageEvents();

        bindLanguageEvents();

        bindLibraryEvents();

        bindArticleEvents();


        /*
         * Give page scripts a chance
         * to finish loading.
         */

        if (
            CONFIG.startupDelay >
            0
        ) {

            await new Promise(
                function (resolve) {

                    setTimeout(
                        resolve,
                        CONFIG.startupDelay
                    );

                }
            );
        }


        /*
         * Start shared systems.
         */

        await startCoreSystems();


        /*
         * Start current-page systems.
         */

        await startPageSystems();


        /*
         * Refresh engine status.
         */

        checkAllEngines();


        STATE.endTime =
            Date.now();


        STATE.initialized =
            true;


        STATE.initializing =
            false;


        STATE.ready =
            true;


        const startupTime =
            STATE.endTime -
            STATE.startTime;


        dispatch(
            "alon:master-ready",
            {

                project:
                    CONFIG.project,

                version:
                    CONFIG.version,

                page:
                    STATE.page,

                startupTime:
                    startupTime,

                engines:
                    getEngineStatus(),

                connection:
                    getConnectionStatus()

            }
        );


        console.log(
            "ALON HISTORYVERSE 24 Master Controller ready."
        );
    }


    /* =====================================================
       REFRESH ENGINE STATUS
       ===================================================== */

    function refresh() {

        checkAllEngines();

        return getEngineStatus();
    }


    /* =====================================================
       GET STATUS
       ===================================================== */

    function getStatus() {

        return {

            project:
                CONFIG.project,

            creator:
                CONFIG.creator,

            version:
                CONFIG.version,

            initialized:
                STATE.initialized,

            initializing:
                STATE.initializing,

            ready:
                STATE.ready,

            page:
                STATE.page,

            engineCount:
                STATE.engineCount,

            readyEngineCount:
                STATE.readyEngineCount,

            engines:
                getEngineStatus(),

            connection:
                getConnectionStatus(),

            errors:
                STATE.errors.slice(),

            warnings:
                STATE.warnings.slice(),

            events:
                STATE.events.slice()

        };
    }


    /* =====================================================
       HEALTH CHECK
       ===================================================== */

    function healthCheck() {

        const engines =
            getEngineStatus();


        const loaded =
            Object.keys(
                engines
            ).filter(
                function (key) {

                    return engines[key].ready;

                }
            ).length;


        const total =
            Object.keys(
                engines
            ).length;


        return {

            healthy:
                STATE.ready &&
                loaded > 0,

            page:
                STATE.page,

            loaded:
                loaded,

            total:
                total,

            online:
                navigator.onLine,

            errors:
                STATE.errors.length,

            warnings:
                STATE.warnings.length

        };
    }


    /* =====================================================
       MANUAL ENGINE START
       ===================================================== */

    async function startEngine(
        key
    ) {

        return await initializeModule(
            key
        );
    }


    /* =====================================================
       PROJECT NAVIGATION
       ===================================================== */

    function goTo(
        path
    ) {

        if (!path) {
            return;
        }


        window.location.href =
            path;
    }


    function goHome() {

        /*
         * Master Controller is normally
         * used from pages inside /html/.
         */

        goTo(
            "../index.html"
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_MASTER = {

        config:
            CONFIG,

        state:
            STATE,

        engines:
            ENGINES,

        initialize:
            initialize,

        refresh:
            refresh,

        status:
            getStatus,

        health:
            healthCheck,

        getEngine:
            getEngine,

        getEngineStatus:
            getEngineStatus,

        startEngine:
            startEngine,

        getCurrentPage:
            getCurrentPage,

        getURLInfo:
            getURLInfo,

        getConnectionStatus:
            getConnectionStatus,

        goTo:
            goTo,

        goHome:
            goHome

    };


    /*
     * Compatibility alias.
     */

    window.ALON_MASTER_CONTROLLER =
        window.ALON_MASTER;


    /* =====================================================
       AUTO START
       ===================================================== */

    if (
        CONFIG.autoStart
    ) {

        if (
            document.readyState ===
            "loading"
        ) {

            document.addEventListener(
                "DOMContentLoaded",
                initialize
            );

        } else {

            initialize();
        }
    }


})();