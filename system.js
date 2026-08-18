/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/system.js
   MASTER SYSTEM / INTEGRATION ENGINE
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   SYSTEM CONFIG
========================================================= */

const ALON_SYSTEM = {

    name:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "V100",

    storagePrefix:
        "alon_historyverse_",

    initialized:
        false

};


/* =========================================================
   STORAGE HELPERS
========================================================= */

function storageKey(
    key
) {

    return (
        ALON_SYSTEM.storagePrefix +
        key
    );

}


function readStorage(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(
                storageKey(
                    key
                )
            );


        if (
            value === null
        ) {

            return fallback;

        }


        return JSON.parse(
            value
        );

    } catch {

        return fallback;

    }

}


function writeStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            storageKey(
                key
            ),

            JSON.stringify(
                value
            )

        );

        return true;

    } catch {

        return false;

    }

}


function removeStorage(
    key
) {

    try {

        localStorage.removeItem(
            storageKey(
                key
            )
        );

        return true;

    } catch {

        return false;

    }

}


/* =========================================================
   EVENT BUS
========================================================= */

const ALON_EVENTS = {

    listeners: {},


    on(
        event,
        callback
    ) {

        if (
            !this.listeners[event]
        ) {

            this.listeners[event] =
                [];

        }


        this.listeners[event]
            .push(
                callback
            );

    },


    off(
        event,
        callback
    ) {

        if (
            !this.listeners[event]
        ) {

            return;

        }


        this.listeners[event] =
            this.listeners[event]
                .filter(
                    fn =>
                        fn !==
                        callback
                );

    },


    emit(
        event,
        data = {}
    ) {

        const callbacks =
            this.listeners[event] ||
            [];


        callbacks.forEach(
            callback => {

                try {

                    callback(
                        data
                    );

                } catch (
                    error
                ) {

                    console.error(
                        "ALON event error:",
                        error
                    );

                }

            }
        );


        document.dispatchEvent(
            new CustomEvent(
                `alon:${event}`,
                {
                    detail:
                        data
                }
            )
        );

    }

};


/* =========================================================
   APPLICATION STATE
========================================================= */

const SystemState = {

    online:
        navigator.onLine,

    language:
        "en",

    theme:
        "dark",

    user:
        null,

    admin:
        false,

    firebase:
        false,

    loading:
        false,

    initialized:
        false

};


/* =========================================================
   NETWORK STATUS
========================================================= */

function updateNetworkStatus(
    online
) {

    SystemState.online =
        online;


    document.documentElement
        .classList.toggle(
            "offline",
            !online
        );


    document.documentElement
        .classList.toggle(
            "online",
            online
        );


    ALON_EVENTS.emit(
        "networkchange",
        {
            online
        }
    );

}


window.addEventListener(
    "online",
    () => {

        updateNetworkStatus(
            true
        );

    }
);


window.addEventListener(
    "offline",
    () => {

        updateNetworkStatus(
            false
        );

    }
);


/* =========================================================
   THEME SYSTEM
========================================================= */

function getTheme() {

    return readStorage(
        "theme",
        "dark"
    );

}


function setTheme(
    theme
) {

    const validThemes =
        [
            "dark",
            "light",
            "system"
        ];


    if (
        !validThemes.includes(
            theme
        )
    ) {

        return false;

    }


    SystemState.theme =
        theme;


    writeStorage(
        "theme",
        theme
    );


    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    ALON_EVENTS.emit(
        "themechange",
        {
            theme
        }
    );


    return true;

}


function initializeTheme() {

    setTheme(
        getTheme()
    );

}


/* =========================================================
   USER SYSTEM
========================================================= */

function getUser() {

    return readStorage(
        "user",
        null
    );

}


function setUser(
    user
) {

    SystemState.user =
        user || null;


    writeStorage(
        "user",
        SystemState.user
    );


    ALON_EVENTS.emit(
        "userchange",
        {
            user:
                SystemState.user
        }
    );

}


function logoutUser() {

    setUser(
        null
    );


    SystemState.admin =
        false;


    writeStorage(
        "admin",
        false
    );


    ALON_EVENTS.emit(
        "logout"
    );

}


/* =========================================================
   ADMIN STATE
========================================================= */

function isAdmin() {

    return Boolean(
        SystemState.admin
    );

}


function setAdmin(
    value
) {

    SystemState.admin =
        Boolean(
            value
        );


    writeStorage(
        "admin",
        SystemState.admin
    );


    ALON_EVENTS.emit(
        "adminchange",
        {
            admin:
                SystemState.admin
        }
    );

}


/* =========================================================
   ARTICLE SYSTEM BRIDGE
========================================================= */

function getArticleSystem() {

    return window.ALON_ARTICLES ||
           window.HISTORYVERSE_ARTICLES ||
           null;

}


function createArticle(
    article
) {

    const engine =
        getArticleSystem();


    if (
        engine &&
        typeof engine.create ===
            "function"
    ) {

        const result =
            engine.create(
                article
            );


        ALON_EVENTS.emit(
            "articlecreated",
            {
                article:
                    result
            }
        );


        return result;

    }


    return null;

}


function updateArticle(
    id,
    changes
) {

    const engine =
        getArticleSystem();


    if (
        engine &&
        typeof engine.update ===
            "function"
    ) {

        const result =
            engine.update(
                id,
                changes
            );


        ALON_EVENTS.emit(
            "articleupdated",
            {
                id,
                article:
                    result
            }
        );


        return result;

    }


    return null;

}


function deleteArticle(
    id
) {

    const engine =
        getArticleSystem();


    if (
        engine &&
        typeof engine.remove ===
            "function"
    ) {

        const result =
            engine.remove(
                id
            );


        ALON_EVENTS.emit(
            "articledeleted",
            {
                id
            }
        );


        return result;

    }


    return false;

}


/* =========================================================
   FAVORITES SYSTEM
========================================================= */

function getFavorites() {

    return readStorage(
        "favorites",
        []
    );

}


function isFavorite(
    id
) {

    return getFavorites()
        .includes(
            id
        );

}


function toggleFavorite(
    id
) {

    const favorites =
        getFavorites();


    const index =
        favorites.indexOf(
            id
        );


    if (
        index === -1
    ) {

        favorites.push(
            id
        );

    } else {

        favorites.splice(
            index,
            1
        );

    }


    writeStorage(
        "favorites",
        favorites
    );


    ALON_EVENTS.emit(
        "favoritechange",
        {
            id,
            favorite:
                index === -1
        }
    );


    return index === -1;

}


/* =========================================================
   READING HISTORY
========================================================= */

function getReadingHistory() {

    return readStorage(
        "reading-history",
        []
    );

}


function addReadingHistory(
    articleId
) {

    if (
        !articleId
    ) {

        return;

    }


    let history =
        getReadingHistory();


    history =
        history.filter(
            id =>
                id !==
                articleId
        );


    history.unshift(
        articleId
    );


    /*
       Keep history manageable.
    */

    history =
        history.slice(
            0,
            100
        );


    writeStorage(
        "reading-history",
        history
    );


    ALON_EVENTS.emit(
        "readinghistorychange",
        {
            articleId
        }
    );

}


/* =========================================================
   CONTRIBUTION SYSTEM
========================================================= */

function getContributions() {

    return readStorage(
        "contributions",
        []
    );

}


function saveContribution(
    contribution
) {

    if (
        !contribution
    ) {

        return null;

    }


    const contributions =
        getContributions();


    const item = {

        id:
            contribution.id ||
            `contribution-${Date.now()}`,

        title:
            contribution.title ||
            "",

        content:
            contribution.content ||
            "",

        author:
            contribution.author ||
            "Anonymous",

        language:
            contribution.language ||
            SystemState.language,

        status:
            contribution.status ||
            "pending",

        createdAt:
            contribution.createdAt ||
            new Date()
                .toISOString()

    };


    contributions.push(
        item
    );


    writeStorage(
        "contributions",
        contributions
    );


    ALON_EVENTS.emit(
        "contributioncreated",
        {
            contribution:
                item
        }
    );


    return item;

}


/* =========================================================
   RECENT SEARCHES
========================================================= */

function getRecentSearches() {

    return readStorage(
        "recent-searches",
        []
    );

}


function saveSearch(
    query
) {

    const value =
        String(
            query || ""
        ).trim();


    if (
        !value
    ) {

        return;

    }


    let searches =
        getRecentSearches();


    searches =
        searches.filter(
            item =>
                item.toLowerCase() !==
                value.toLowerCase()
        );


    searches.unshift(
        value
    );


    searches =
        searches.slice(
            0,
            20
        );


    writeStorage(
        "recent-searches",
        searches
    );

}


/* =========================================================
   LANGUAGE BRIDGE
========================================================= */

function connectLanguageSystem() {

    const current =
        readStorage(
            "language",
            "en"
        );


    SystemState.language =
        current;


    /*
       Connect to world-language engine.
    */

    if (
        window.ALON_WORLD_LANGUAGE
    ) {

        try {

            const language =
                window.ALON_WORLD_LANGUAGE
                    .current;


            if (
                typeof language ===
                    "function"
            ) {

                SystemState.language =
                    language();

            }

        } catch {

            /* safe fallback */

        }

    }


    document.documentElement
        .setAttribute(
            "lang",
            SystemState.language
        );


    ALON_EVENTS.on(
        "worldlanguagechange",
        data => {

            if (
                data &&
                data.language
            ) {

                SystemState.language =
                    data.language;

                writeStorage(
                    "language",
                    data.language
                );

            }

        }
    );

}


/* =========================================================
   FIREBASE BRIDGE
========================================================= */

function connectFirebase() {

    /*
       Firebase can be connected through
       the global Firebase configuration.

       This keeps V100 compatible with
       both local and cloud data modes.
    */

    if (
        window.firebase
    ) {

        SystemState.firebase =
            true;

        ALON_EVENTS.emit(
            "firebaseconnected"
        );

        return true;

    }


    SystemState.firebase =
        false;


    ALON_EVENTS.emit(
        "firebaseoffline"
    );


    return false;

}


/* =========================================================
   PAGE LOADING SYSTEM
========================================================= */

function setLoading(
    value
) {

    SystemState.loading =
        Boolean(
            value
        );


    document.documentElement
        .classList.toggle(
            "loading",
            SystemState.loading
        );


    ALON_EVENTS.emit(
        "loadingchange",
        {
            loading:
                SystemState.loading
        }
    );

}


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

window.addEventListener(
    "error",
    event => {

        ALON_EVENTS.emit(
            "error",
            {
                message:
                    event.message,

                source:
                    event.filename,

                line:
                    event.lineno
            }
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        ALON_EVENTS.emit(
            "error",
            {
                message:
                    String(
                        event.reason
                    )
            }
        );

    }
);


/* =========================================================
   CLICKABLE CARD ENHANCEMENT
========================================================= */

function initializeClickableElements() {

    document
        .querySelectorAll(
            "[data-open-article]"
        )
        .forEach(
            element => {

                if (
                    element.dataset
                        .alonSystemReady ===
                    "true"
                ) {

                    return;

                }


                element.dataset
                    .alonSystemReady =
                    "true";


                const articleId =
                    element.dataset
                        .openArticle;


                element.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(
                                "a, button"
                            )
                        ) {

                            return;

                        }


                        if (
                            window.ALON_HISTORYVERSE &&
                            typeof
                                window.ALON_HISTORYVERSE
                                    .openArticle ===
                                "function"
                        ) {

                            window.ALON_HISTORYVERSE
                                .openArticle(
                                    articleId
                                );

                        }

                    }
                );

            }
        );

}


/* =========================================================
   ARTICLE VIEW TRACKING
========================================================= */

function initializeArticleTracking() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const articleId =
        params.get(
            "id"
        );


    if (
        articleId
    ) {

        addReadingHistory(
            articleId
        );

    }

}


/* =========================================================
   SEARCH TRACKING
========================================================= */

ALON_EVENTS.on(
    "search",
    data => {

        if (
            data &&
            data.query
        ) {

            saveSearch(
                data.query
            );

        }

    }
);


/* =========================================================
   ADMIN ACTION BRIDGE
========================================================= */

function initializeAdminBridge() {

    document.addEventListener(
        "click",
        event => {

            const deleteButton =
                event.target.closest(
                    "[data-delete-article]"
                );


            if (
                deleteButton
            ) {

                const id =
                    deleteButton.dataset
                        .deleteArticle;


                if (
                    !id ||
                    !isAdmin()
                ) {

                    return;

                }


                const confirmed =
                    window.confirm(
                        "Delete this article?"
                    );


                if (
                    confirmed
                ) {

                    deleteArticle(
                        id
                    );

                }

            }

        }
    );

}


/* =========================================================
   PERSIST SYSTEM STATE
========================================================= */

function persistSystemState() {

    writeStorage(
        "language",
        SystemState.language
    );


    writeStorage(
        "theme",
        SystemState.theme
    );


    writeStorage(
        "admin",
        SystemState.admin
    );

}


/* =========================================================
   MASTER INITIALIZATION
========================================================= */

function initializeSystem() {

    if (
        ALON_SYSTEM.initialized
    ) {

        return;

    }


    ALON_SYSTEM.initialized =
        true;


    SystemState.initialized =
        true;


    initializeTheme();

    connectLanguageSystem();

    connectFirebase();

    initializeClickableElements();

    initializeArticleTracking();

    initializeAdminBridge();

    persistSystemState();


    ALON_EVENTS.emit(
        "systemready",
        {
            name:
                ALON_SYSTEM.name,

            version:
                ALON_SYSTEM.version
        }
    );


    document.documentElement
        .classList.add(
            "alon-ready"
        );

}


/* =========================================================
   GLOBAL ALON SYSTEM API
========================================================= */

window.ALON_SYSTEM = {

    config:
        ALON_SYSTEM,

    state:
        SystemState,

    events:
        ALON_EVENTS,

    storage: {

        get:
            readStorage,

        set:
            writeStorage,

        remove:
            removeStorage

    },

    theme: {

        get:
            getTheme,

        set:
            setTheme

    },

    user: {

        get:
            getUser,

        set:
            setUser,

        logout:
            logoutUser

    },

    admin: {

        get:
            isAdmin,

        set:
            setAdmin

    },

    articles: {

        create:
            createArticle,

        update:
            updateArticle,

        delete:
            deleteArticle

    },

    favorites: {

        get:
            getFavorites,

        has:
            isFavorite,

        toggle:
            toggleFavorite

    },

    history: {

        get:
            getReadingHistory,

        add:
            addReadingHistory

    },

    contributions: {

        get:
            getContributions,

        add:
            saveContribution

    },

    searches: {

        get:
            getRecentSearches,

        save:
            saveSearch

    },

    loading:
        setLoading,

    init:
        initializeSystem

};


/* =========================================================
   AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSystem
    );

} else {

    initializeSystem();

}


/* =========================================================
   END OF MASTER SYSTEM
========================================================= */