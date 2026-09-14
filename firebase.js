/* =========================================================
   ALON HISTORYVERSE 24
   FIREBASE INTEGRATION ENGINE
   File: jss/firebase.js
   Creator: Baba Thecno Guru
   Version: 24.0

   IMPORTANT:
   This file does NOT contain fake Firebase credentials.
   Add the real Firebase configuration only after creating
   and configuring the Firebase project.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       FIREBASE CONFIGURATION
    ====================================================== */

    const FIREBASE_CONFIG = {

        /*
         * Paste the REAL Firebase configuration here later.
         *
         * Example structure:
         *
         * apiKey: "YOUR_REAL_API_KEY",
         * authDomain: "YOUR_PROJECT.firebaseapp.com",
         * projectId: "YOUR_PROJECT_ID",
         * storageBucket: "YOUR_PROJECT.firebasestorage.app",
         * messagingSenderId: "YOUR_SENDER_ID",
         * appId: "YOUR_APP_ID"
         *
         * DO NOT use fake values.
         */

        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };


    /* =====================================================
       FIREBASE STATE
    ====================================================== */

    const STATE = {

        initialized: false,

        available: false,

        authenticated: false,

        user: null,

        app: null,

        auth: null,

        db: null,

        storage: null,

        error: null
    };


    /* =====================================================
       CDN URLS
    ====================================================== */

    const FIREBASE_MODULE_URLS = {

        app:
            "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js",

        auth:
            "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js",

        firestore:
            "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js",

        storage:
            "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js"
    };


    /* =====================================================
       CONFIGURATION CHECK
    ====================================================== */

    function hasConfiguration() {

        return Boolean(

            FIREBASE_CONFIG.apiKey &&

            FIREBASE_CONFIG.authDomain &&

            FIREBASE_CONFIG.projectId &&

            FIREBASE_CONFIG.storageBucket &&

            FIREBASE_CONFIG.messagingSenderId &&

            FIREBASE_CONFIG.appId

        );
    }


    /* =====================================================
       STATUS
    ====================================================== */

    function getState() {

        return {
            ...STATE
        };
    }


    function isConfigured() {

        return hasConfiguration();
    }


    function isReady() {

        return (
            STATE.initialized === true &&
            STATE.available === true
        );
    }


    function isLoggedIn() {

        return (
            STATE.authenticated === true
        );
    }


    function getCurrentUser() {

        return STATE.user;
    }


    /* =====================================================
       SCRIPT LOADER
    ====================================================== */

    function loadScript(
        url
    ) {

        return new Promise(
            function (
                resolve,
                reject
            ) {

                if (!url) {

                    reject(
                        new Error(
                            "Firebase script URL is missing."
                        )
                    );

                    return;
                }


                const existing =
                    document.querySelector(
                        'script[data-alon-firebase="' +
                        url +
                        '"]'
                    );


                if (existing) {

                    resolve();

                    return;
                }


                const script =
                    document.createElement(
                        "script"
                    );


                script.type =
                    "module";


                script.src =
                    url;


                script.setAttribute(
                    "data-alon-firebase",
                    url
                );


                script.onload =
                    function () {

                        resolve();

                    };


                script.onerror =
                    function () {

                        reject(
                            new Error(
                                "Unable to load Firebase module."
                            )
                        );

                    };


                document.head.appendChild(
                    script
                );

            }
        );
    }


    /* =====================================================
       FIREBASE MODULE IMPORT
    ====================================================== */

    async function loadFirebaseModules() {

        const appModule =
            await import(
                FIREBASE_MODULE_URLS.app
            );


        const authModule =
            await import(
                FIREBASE_MODULE_URLS.auth
            );


        const firestoreModule =
            await import(
                FIREBASE_MODULE_URLS.firestore
            );


        const storageModule =
            await import(
                FIREBASE_MODULE_URLS.storage
            );


        return {

            app: appModule,

            auth: authModule,

            firestore:
                firestoreModule,

            storage:
                storageModule
        };
    }


    /* =====================================================
       INITIALIZE FIREBASE
    ====================================================== */

    async function initialize(
        customConfig
    ) {

        if (
            STATE.initialized
        ) {

            return getState();
        }


        const config = {

            ...FIREBASE_CONFIG,

            ...(customConfig || {})
        };


        if (
            !(
                config.apiKey &&
                config.authDomain &&
                config.projectId &&
                config.storageBucket &&
                config.messagingSenderId &&
                config.appId
            )
        ) {

            STATE.initialized =
                true;

            STATE.available =
                false;

            STATE.error =
                "Firebase configuration is not added yet.";

            console.warn(
                "ALON HISTORYVERSE 24: Firebase is not configured yet."
            );

            return getState();
        }


        try {

            const modules =
                await loadFirebaseModules();


            const firebaseApp =
                modules.app.initializeApp(
                    config
                );


            const firebaseAuth =
                modules.auth.getAuth(
                    firebaseApp
                );


            const firestoreDB =
                modules.firestore.getFirestore(
                    firebaseApp
                );


            const firebaseStorage =
                modules.storage.getStorage(
                    firebaseApp
                );


            STATE.app =
                firebaseApp;


            STATE.auth =
                firebaseAuth;


            STATE.db =
                firestoreDB;


            STATE.storage =
                firebaseStorage;


            STATE.initialized =
                true;


            STATE.available =
                true;


            STATE.error =
                null;


            modules.auth.onAuthStateChanged(
                firebaseAuth,
                function (user) {

                    STATE.user =
                        user || null;


                    STATE.authenticated =
                        Boolean(user);


                    try {

                        window.dispatchEvent(
                            new CustomEvent(
                                "alon:firebase-auth-change",
                                {
                                    detail: {
                                        user:
                                            user ||
                                            null
                                    }
                                }
                            )
                        );

                    } catch (error) {
                        /* Compatibility fallback */
                    }

                }
            );


            try {

                window.dispatchEvent(
                    new CustomEvent(
                        "alon:firebase-ready",
                        {
                            detail:
                                getState()
                        }
                    )
                );

            } catch (error) {
                /* Compatibility fallback */
            }


            console.log(
                "ALON HISTORYVERSE 24 Firebase initialized successfully."
            );


            return getState();


        } catch (error) {

            STATE.initialized =
                true;

            STATE.available =
                false;

            STATE.error =
                error &&
                error.message
                    ? error.message
                    : String(error);


            console.error(
                "ALON HISTORYVERSE 24 Firebase initialization failed:",
                error
            );


            return getState();
        }
    }


    /* =====================================================
       AUTHENTICATION
    ====================================================== */

    async function signInWithEmail(
        email,
        password
    ) {

        if (
            !STATE.auth
        ) {

            throw new Error(
                "Firebase Authentication is not initialized."
            );
        }


        const emailValue =
            String(
                email || ""
            ).trim();


        const passwordValue =
            String(
                password || ""
            );


        if (
            !emailValue ||
            !passwordValue
        ) {

            throw new Error(
                "Email and password are required."
            );
        }


        return STATE.auth &&
            window.firebase
                ? null
                : await import(
                    FIREBASE_MODULE_URLS.auth
                )
                .then(
                    function (authModule) {

                        return authModule
                            .signInWithEmailAndPassword(
                                STATE.auth,
                                emailValue,
                                passwordValue
                            );

                    }
                );
    }


    async function createAccount(
        email,
        password
    ) {

        if (
            !STATE.auth
        ) {

            throw new Error(
                "Firebase Authentication is not initialized."
            );
        }


        const emailValue =
            String(
                email || ""
            ).trim();


        const passwordValue =
            String(
                password || ""
            );


        if (
            !emailValue ||
            !passwordValue
        ) {

            throw new Error(
                "Email and password are required."
            );
        }


        const authModule =
            await import(
                FIREBASE_MODULE_URLS.auth
            );


        return authModule
            .createUserWithEmailAndPassword(
                STATE.auth,
                emailValue,
                passwordValue
            );
    }


    async function signOut() {

        if (
            !STATE.auth
        ) {

            throw new Error(
                "Firebase Authentication is not initialized."
            );
        }


        const authModule =
            await import(
                FIREBASE_MODULE_URLS.auth
            );


        await authModule.signOut(
            STATE.auth
        );


        STATE.user =
            null;


        STATE.authenticated =
            false;


        return true;
    }


    /* =====================================================
       PASSWORD RESET
    ====================================================== */

    async function resetPassword(
        email
    ) {

        if (
            !STATE.auth
        ) {

            throw new Error(
                "Firebase Authentication is not initialized."
            );
        }


        const emailValue =
            String(
                email || ""
            ).trim();


        if (!emailValue) {

            throw new Error(
                "Email address is required."
            );
        }


        const authModule =
            await import(
                FIREBASE_MODULE_URLS.auth
            );


        return authModule
            .sendPasswordResetEmail(
                STATE.auth,
                emailValue
            );
    }


    /* =====================================================
       FIRESTORE
    ====================================================== */

    async function addDocument(
        collectionName,
        data
    ) {

        if (
            !STATE.db
        ) {

            throw new Error(
                "Firestore is not initialized."
            );
        }


        if (
            !collectionName
        ) {

            throw new Error(
                "Collection name is required."
            );
        }


        const firestoreModule =
            await import(
                FIREBASE_MODULE_URLS.firestore
            );


        return firestoreModule
            .addDoc(
                firestoreModule.collection(
                    STATE.db,
                    collectionName
                ),
                data || {}
            );
    }


    async function setDocument(
        collectionName,
        documentId,
        data,
        merge
    ) {

        if (
            !STATE.db
        ) {

            throw new Error(
                "Firestore is not initialized."
            );
        }


        if (
            !collectionName ||
            !documentId
        ) {

            throw new Error(
                "Collection and document ID are required."
            );
        }


        const firestoreModule =
            await import(
                FIREBASE_MODULE_URLS.firestore
            );


        return firestoreModule
            .setDoc(
                firestoreModule.doc(
                    STATE.db,
                    collectionName,
                    documentId
                ),
                data || {},
                {
                    merge:
                        merge !== false
                }
            );
    }


    async function getDocument(
        collectionName,
        documentId
    ) {

        if (
            !STATE.db
        ) {

            throw new Error(
                "Firestore is not initialized."
            );
        }


        const firestoreModule =
            await import(
                FIREBASE_MODULE_URLS.firestore
            );


        const snapshot =
            await firestoreModule.getDoc(
                firestoreModule.doc(
                    STATE.db,
                    collectionName,
                    documentId
                )
            );


        if (
            !snapshot.exists()
        ) {

            return null;
        }


        return {

            id:
                snapshot.id,

            ...snapshot.data()
        };
    }


    async function deleteDocument(
        collectionName,
        documentId
    ) {

        if (
            !STATE.db
        ) {

            throw new Error(
                "Firestore is not initialized."
            );
        }


        const firestoreModule =
            await import(
                FIREBASE_MODULE_URLS.firestore
            );


        return firestoreModule
            .deleteDoc(
                firestoreModule.doc(
                    STATE.db,
                    collectionName,
                    documentId
                )
            );
    }


    /* =====================================================
       STORAGE
    ====================================================== */

    async function uploadFile(
        file,
        path
    ) {

        if (
            !STATE.storage
        ) {

            throw new Error(
                "Firebase Storage is not initialized."
            );
        }


        if (!file) {

            throw new Error(
                "File is required."
            );
        }


        if (!path) {

            throw new Error(
                "Storage path is required."
            );
        }


        const storageModule =
            await import(
                FIREBASE_MODULE_URLS.storage
            );


        const storageReference =
            storageModule.ref(
                STATE.storage,
                path
            );


        const result =
            await storageModule
                .uploadBytes(
                    storageReference,
                    file
                );


        const downloadURL =
            await storageModule
                .getDownloadURL(
                    result.ref
                );


        return {

            reference:
                result.ref,

            url:
                downloadURL
        };
    }


    async function deleteFile(
        path
    ) {

        if (
            !STATE.storage
        ) {

            throw new Error(
                "Firebase Storage is not initialized."
            );
        }


        if (!path) {

            throw new Error(
                "Storage path is required."
            );
        }


        const storageModule =
            await import(
                FIREBASE_MODULE_URLS.storage
            );


        const storageReference =
            storageModule.ref(
                STATE.storage,
                path
            );


        return storageModule
            .deleteObject(
                storageReference
            );
    }


    /* =====================================================
       ARTICLE HELPERS
    ====================================================== */

    async function saveArticle(
        article
    ) {

        if (!article) {

            throw new Error(
                "Article data is required."
            );
        }


        const articleId =
            article.id ||
            (
                window.ALON_ENGINE &&
                typeof window.ALON_ENGINE
                    .createId === "function"
                    ? window.ALON_ENGINE
                        .createId("article")
                    : "article-" +
                      Date.now()
            );


        const articleData = {

            ...article,

            id:
                articleId,

            updatedAt:
                new Date()
                    .toISOString()
        };


        return setDocument(
            "articles",
            articleId,
            articleData,
            true
        );
    }


    async function getArticle(
        articleId
    ) {

        if (!articleId) {

            return null;
        }


        return getDocument(
            "articles",
            articleId
        );
    }


    async function deleteArticle(
        articleId
    ) {

        if (!articleId) {

            throw new Error(
                "Article ID is required."
            );
        }


        /*
         * Permanent deletion should not normally
         * be used directly by the public UI.
         *
         * The admin system should preferably move
         * the article into a trash collection first.
         */

        return deleteDocument(
            "articles",
            articleId
        );
    }


    /* =====================================================
       ADMIN HELPERS
    ====================================================== */

    function isAdmin() {

        if (
            !STATE.user
        ) {

            return false;
        }


        /*
         * Real admin authorization must be enforced
         * with Firebase Security Rules / custom claims.
         *
         * This frontend check is NOT security.
         */

        return Boolean(
            STATE.user.admin === true
        );
    }


    /* =====================================================
       ERROR HANDLER
    ====================================================== */

    function getFriendlyError(
        error
    ) {

        if (!error) {

            return "Unknown Firebase error.";
        }


        const code =
            error.code || "";


        const messages = {

            "auth/invalid-email":
                "The email address is invalid.",

            "auth/user-not-found":
                "No account was found for this email.",

            "auth/wrong-password":
                "The password is incorrect.",

            "auth/email-already-in-use":
                "This email is already registered.",

            "auth/weak-password":
                "The password is too weak.",

            "auth/network-request-failed":
                "Network connection failed.",

            "permission-denied":
                "You do not have permission to perform this action.",

            "storage/unauthorized":
                "You do not have permission to access this file."
        };


        return (
            messages[code] ||
            error.message ||
            "Firebase operation failed."
        );
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const API = {

        config:
            FIREBASE_CONFIG,

        moduleURLs:
            FIREBASE_MODULE_URLS,

        state:
            STATE,

        getState:
            getState,

        isConfigured:
            isConfigured,

        isReady:
            isReady,

        isLoggedIn:
            isLoggedIn,

        getCurrentUser:
            getCurrentUser,

        initialize:
            initialize,

        signInWithEmail:
            signInWithEmail,

        createAccount:
            createAccount,

        signOut:
            signOut,

        resetPassword:
            resetPassword,

        addDocument:
            addDocument,

        setDocument:
            setDocument,

        getDocument:
            getDocument,

        deleteDocument:
            deleteDocument,

        uploadFile:
            uploadFile,

        deleteFile:
            deleteFile,

        saveArticle:
            saveArticle,

        getArticle:
            getArticle,

        deleteArticle:
            deleteArticle,

        isAdmin:
            isAdmin,

        getFriendlyError:
            getFriendlyError
    };


    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_FIREBASE =
        API;


    /* =====================================================
       INITIALIZATION NOTICE
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                /*
                 * Do not automatically initialize
                 * until real Firebase configuration
                 * has been provided.
                 */

                if (
                    hasConfiguration()
                ) {

                    initialize();
                }

            },
            {
                once: true
            }
        );

    } else {

        if (
            hasConfiguration()
        ) {

            initialize();
        }
    }


    console.log(
        "ALON HISTORYVERSE 24 firebase.js loaded."
    );

})();