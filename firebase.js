
/* =========================================================
   ALON HISTORYVERSE 24
   FIREBASE INTEGRATION ENGINE
   File: jss/firebase.js
   Creator: Baba Thecno Guru
   Version: 25.0 FIREBASE API INTEGRATION

   Services:
   - Firebase Authentication
   - Cloud Firestore
   - Firebase Storage
   - Authentication state events
   - Article helpers
   - Admin custom-claim verification

   IMPORTANT:
   Insert the real Firebase Web App configuration below.
   Enforce all permissions using Firebase Security Rules.
   ========================================================= */

(function () {
    "use strict";

    if (window.ALON_FIREBASE) {
        console.warn(
            "ALON_FIREBASE is already loaded."
        );
        return;
    }

    /* =====================================================
       FIREBASE CONFIGURATION

       Get these values from:
       Firebase Console > Project settings > Your apps

       Do not insert service-account private keys here.
    ====================================================== */

    const FIREBASE_CONFIG = {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    };

    /* =====================================================
       FIREBASE SDK URLS
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
       STATE
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
        adminClaim: false,
        error: null
    };

    let firebaseModules = null;
    let modulesPromise = null;
    let initializationPromise = null;
    let authObserverStarted = false;

    /* =====================================================
       CONFIGURATION
    ====================================================== */

    function hasConfiguration(config) {
        const value = config || FIREBASE_CONFIG;

        return Boolean(
            value.apiKey &&
            value.authDomain &&
            value.projectId &&
            value.storageBucket &&
            value.messagingSenderId &&
            value.appId
        );
    }

    function getState() {
        return {
            initialized: STATE.initialized,
            available: STATE.available,
            authenticated: STATE.authenticated,
            user: STATE.user,
            app: STATE.app,
            auth: STATE.auth,
            db: STATE.db,
            storage: STATE.storage,
            adminClaim: STATE.adminClaim,
            error: STATE.error
        };
    }

    function isConfigured() {
        return hasConfiguration();
    }

    function isReady() {
        return (
            STATE.initialized === true &&
            STATE.available === true &&
            Boolean(STATE.app) &&
            Boolean(STATE.auth) &&
            Boolean(STATE.db) &&
            Boolean(STATE.storage)
        );
    }

    function isLoggedIn() {
        return (
            STATE.authenticated === true &&
            Boolean(STATE.user)
        );
    }

    function getCurrentUser() {
        return STATE.user;
    }

    function requireReady() {
        if (!isReady()) {
            throw new Error(
                STATE.error ||
                "Firebase is not initialized. Check the Firebase configuration."
            );
        }
    }

    function requireAuth() {
        requireReady();

        if (!STATE.user) {
            throw new Error(
                "Please sign in before performing this operation."
            );
        }

        return STATE.user;
    }

    /* =====================================================
       LOAD FIREBASE MODULES
    ====================================================== */

    async function loadFirebaseModules() {
        if (firebaseModules) {
            return firebaseModules;
        }

        if (modulesPromise) {
            return modulesPromise;
        }

        modulesPromise = (async function () {
            try {
                const [
                    appModule,
                    authModule,
                    firestoreModule,
                    storageModule
                ] = await Promise.all([
                    import(FIREBASE_MODULE_URLS.app),
                    import(FIREBASE_MODULE_URLS.auth),
                    import(FIREBASE_MODULE_URLS.firestore),
                    import(FIREBASE_MODULE_URLS.storage)
                ]);

                firebaseModules = {
                    app: appModule,
                    auth: authModule,
                    firestore: firestoreModule,
                    storage: storageModule
                };

                return firebaseModules;
            } catch (error) {
                modulesPromise = null;
                throw error;
            }
        })();

        return modulesPromise;
    }

    /* =====================================================
       EVENTS
    ====================================================== */

    function dispatchEvent(name, detail) {
        try {
            window.dispatchEvent(
                new CustomEvent(name, {
                    detail: detail
                })
            );
        } catch (error) {
            console.warn(
                "Firebase event could not be dispatched:",
                name
            );
        }
    }

    function dispatchAuthChange() {
        dispatchEvent(
            "alon:firebase-auth-change",
            {
                user: STATE.user,
                authenticated: STATE.authenticated,
                adminClaim: STATE.adminClaim
            }
        );
    }

    /* =====================================================
       INITIALIZE FIREBASE
    ====================================================== */

    async function initialize(customConfig) {
        if (isReady()) {
            return getState();
        }

        if (initializationPromise) {
            return initializationPromise;
        }

        const config = {
            ...FIREBASE_CONFIG,
            ...(customConfig || {})
        };

        if (!hasConfiguration(config)) {
            STATE.initialized = false;
            STATE.available = false;
            STATE.error =
                "Firebase configuration is missing. Add the real Firebase Web App configuration.";

            console.warn(
                "ALON HISTORYVERSE 24: Firebase configuration is incomplete."
            );

            return getState();
        }

        initializationPromise = (async function () {
            try {
                const modules =
                    await loadFirebaseModules();

                let firebaseApp;

                const existingApps =
                    modules.app.getApps();

                const existingDefaultApp =
                    existingApps.find(function (app) {
                        return app.name === "[DEFAULT]";
                    });

                if (existingDefaultApp) {
                    const existingConfig =
                        existingDefaultApp.options;

                    if (
                        existingConfig.projectId !==
                        config.projectId
                    ) {
                        throw new Error(
                            "A different default Firebase project is already initialized on this page."
                        );
                    }

                    firebaseApp =
                        existingDefaultApp;
                } else {
                    firebaseApp =
                        modules.app.initializeApp(config);
                }

                const firebaseAuth =
                    modules.auth.getAuth(firebaseApp);

                const firestoreDB =
                    modules.firestore.getFirestore(firebaseApp);

                const firebaseStorage =
                    modules.storage.getStorage(firebaseApp);

                STATE.app = firebaseApp;
                STATE.auth = firebaseAuth;
                STATE.db = firestoreDB;
                STATE.storage = firebaseStorage;

                STATE.initialized = true;
                STATE.available = true;
                STATE.error = null;

                if (!authObserverStarted) {
                    authObserverStarted = true;

                    modules.auth.onAuthStateChanged(
                        firebaseAuth,
                        async function (user) {
                            STATE.user = user || null;
                            STATE.authenticated =
                                Boolean(user);

                            STATE.adminClaim = false;

                            if (user) {
                                try {
                                    const tokenResult =
                                        await modules.auth
                                            .getIdTokenResult(user);

                                    STATE.adminClaim =
                                        tokenResult.claims.admin === true;
                                } catch (error) {
                                    STATE.adminClaim = false;

                                    console.warn(
                                        "Unable to verify Firebase admin claim."
                                    );
                                }
                            }

                            dispatchAuthChange();
                        }
                    );
                }

                dispatchEvent(
                    "alon:firebase-ready",
                    getState()
                );

                console.log(
                    "ALON HISTORYVERSE 24: Firebase initialized."
                );

                return getState();
            } catch (error) {
                STATE.initialized = false;
                STATE.available = false;
                STATE.error =
                    error && error.message
                        ? error.message
                        : String(error);

                STATE.app = null;
                STATE.auth = null;
                STATE.db = null;
                STATE.storage = null;

                console.error(
                    "ALON HISTORYVERSE 24 Firebase initialization failed:",
                    error
                );

                dispatchEvent(
                    "alon:firebase-error",
                    {
                        message: STATE.error
                    }
                );

                return getState();
            } finally {
                initializationPromise = null;
            }
        })();

        return initializationPromise;
    }

    /* =====================================================
       AUTHENTICATION
    ====================================================== */

    async function signInWithEmail(email, password) {
        requireReady();

        const emailValue =
            String(email || "").trim();

        const passwordValue =
            String(password || "");

        if (!emailValue || !passwordValue) {
            throw new Error(
                "Email and password are required."
            );
        }

        return firebaseModules.auth
            .signInWithEmailAndPassword(
                STATE.auth,
                emailValue,
                passwordValue
            );
    }

    async function createAccount(email, password) {
        requireReady();

        const emailValue =
            String(email || "").trim();

        const passwordValue =
            String(password || "");

        if (!emailValue || !passwordValue) {
            throw new Error(
                "Email and password are required."
            );
        }

        return firebaseModules.auth
            .createUserWithEmailAndPassword(
                STATE.auth,
                emailValue,
                passwordValue
            );
    }

    async function signOut() {
        requireReady();

        await firebaseModules.auth.signOut(
            STATE.auth
        );

        // The auth-state observer updates STATE.
        return true;
    }

    async function resetPassword(email) {
        requireReady();

        const emailValue =
            String(email || "").trim();

        if (!emailValue) {
            throw new Error(
                "Email address is required."
            );
        }

        return firebaseModules.auth
            .sendPasswordResetEmail(
                STATE.auth,
                emailValue
            );
    }

    async function sendEmailVerification() {
        requireAuth();

        return firebaseModules.auth
            .sendEmailVerification(
                STATE.user
            );
    }

    async function updateDisplayName(displayName) {
        requireAuth();

        const name =
            String(displayName || "").trim();

        if (!name) {
            throw new Error(
                "Display name is required."
            );
        }

        return firebaseModules.auth
            .updateProfile(
                STATE.user,
                {
                    displayName: name
                }
            );
    }

    async function refreshIdToken(forceRefresh) {
        requireAuth();

        const token =
            await firebaseModules.auth
                .getIdToken(
                    STATE.user,
                    forceRefresh === true
                );

        return token;
    }

    async function getIdTokenResult(forceRefresh) {
        requireAuth();

        const result =
            await firebaseModules.auth
                .getIdTokenResult(
                    STATE.user,
                    forceRefresh === true
                );

        STATE.adminClaim =
            result.claims.admin === true;

        return result;
    }

    /* =====================================================
       AUTH STATE LISTENER
    ====================================================== */

    function onAuthStateChanged(callback) {
        requireReady();

        if (typeof callback !== "function") {
            throw new Error(
                "Authentication callback must be a function."
            );
        }

        return firebaseModules.auth
            .onAuthStateChanged(
                STATE.auth,
                callback
            );
    }

    /* =====================================================
       FIRESTORE HELPERS
    ====================================================== */

    function validateCollectionName(name) {
        if (
            typeof name !== "string" ||
            !name.trim() ||
            name.trim().includes("/")
        ) {
            throw new Error(
                "A valid Firestore collection name is required."
            );
        }

        return name.trim();
    }

    function validateDocumentId(id) {
        if (
            typeof id !== "string" ||
            !id.trim() ||
            id.trim().includes("/")
        ) {
            throw new Error(
                "A valid Firestore document ID is required."
            );
        }

        return id.trim();
    }

    async function addDocument(collectionName, data) {
        requireReady();

        const collection =
            validateCollectionName(collectionName);

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new Error(
                "Document data must be an object."
            );
        }

        return firebaseModules.firestore.addDoc(
            firebaseModules.firestore.collection(
                STATE.db,
                collection
            ),
            data
        );
    }

    async function setDocument(
        collectionName,
        documentId,
        data,
        merge
    ) {
        requireReady();

        const collection =
            validateCollectionName(collectionName);

        const id =
            validateDocumentId(documentId);

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new Error(
                "Document data must be an object."
            );
        }

        return firebaseModules.firestore.setDoc(
            firebaseModules.firestore.doc(
                STATE.db,
                collection,
                id
            ),
            data,
            {
                merge: merge !== false
            }
        );
    }

    async function getDocument(
        collectionName,
        documentId
    ) {
        requireReady();

        const collection =
            validateCollectionName(collectionName);

        const id =
            validateDocumentId(documentId);

        const snapshot =
            await firebaseModules.firestore.getDoc(
                firebaseModules.firestore.doc(
                    STATE.db,
                    collection,
                    id
                )
            );

        if (!snapshot.exists()) {
            return null;
        }

        return {
            id: snapshot.id,
            ...snapshot.data()
        };
    }

    async function deleteDocument(
        collectionName,
        documentId
    ) {
        requireReady();

        const collection =
            validateCollectionName(collectionName);

        const id =
            validateDocumentId(documentId);

        return firebaseModules.firestore.deleteDoc(
            firebaseModules.firestore.doc(
                STATE.db,
                collection,
                id
            )
        );
    }

    async function queryDocuments(
        collectionName,
        options
    ) {
        requireReady();

        const collection =
            validateCollectionName(collectionName);

        const settings = options || {};

        const constraints = [];

        if (Array.isArray(settings.where)) {
            settings.where.forEach(function (condition) {
                if (
                    !Array.isArray(condition) ||
                    condition.length !== 3
                ) {
                    throw new Error(
                        "Each where condition must contain field, operator and value."
                    );
                }

                constraints.push(
                    firebaseModules.firestore.where(
                        condition[0],
                        condition[1],
                        condition[2]
                    )
                );
            });
        }

        if (settings.orderBy) {
            if (typeof settings.orderBy === "string") {
                constraints.push(
                    firebaseModules.firestore.orderBy(
                        settings.orderBy
                    )
                );
            } else {
                constraints.push(
                    firebaseModules.firestore.orderBy(
                        settings.orderBy.field,
                        settings.orderBy.direction || "asc"
                    )
                );
            }
        }

        if (settings.limit !== undefined) {
            const limitValue =
                Number(settings.limit);

            if (
                !Number.isInteger(limitValue) ||
                limitValue < 1 ||
                limitValue > 500
            ) {
                throw new Error(
                    "Query limit must be between 1 and 500."
                );
            }

            constraints.push(
                firebaseModules.firestore.limit(
                    limitValue
                )
            );
        }

        const collectionRef =
            firebaseModules.firestore.collection(
                STATE.db,
                collection
            );

        const queryRef =
            constraints.length
                ? firebaseModules.firestore.query(
                    collectionRef,
                    ...constraints
                )
                : collectionRef;

        const snapshot =
            await firebaseModules.firestore.getDocs(
                queryRef
            );

        return snapshot.docs.map(function (item) {
            return {
                id: item.id,
                ...item.data()
            };
        });
    }

    function listenDocument(
        collectionName,
        documentId,
        callback,
        onError
    ) {
        requireReady();

        if (typeof callback !== "function") {
            throw new Error(
                "A document listener callback is required."
            );
        }

        const reference =
            firebaseModules.firestore.doc(
                STATE.db,
                validateCollectionName(collectionName),
                validateDocumentId(documentId)
            );

        return firebaseModules.firestore.onSnapshot(
            reference,
            function (snapshot) {
                callback(
                    snapshot.exists()
                        ? {
                            id: snapshot.id,
                            ...snapshot.data()
                        }
                        : null
                );
            },
            typeof onError === "function"
                ? onError
                : function (error) {
                    console.error(
                        "Firestore document listener failed:",
                        error
                    );
                }
        );
    }

    function listenCollection(
        collectionName,
        callback,
        options,
        onError
    ) {
        requireReady();

        if (typeof callback !== "function") {
            throw new Error(
                "A collection listener callback is required."
            );
        }

        const settings = options || {};
        const constraints = [];

        if (Array.isArray(settings.where)) {
            settings.where.forEach(function (condition) {
                if (
                    !Array.isArray(condition) ||
                    condition.length !== 3
                ) {
                    throw new Error(
                        "Each where condition must contain field, operator and value."
                    );
                }

                constraints.push(
                    firebaseModules.firestore.where(
                        condition[0],
                        condition[1],
                        condition[2]
                    )
                );
            });
        }

        if (settings.orderBy) {
            const order = settings.orderBy;

            constraints.push(
                firebaseModules.firestore.orderBy(
                    typeof order === "string"
                        ? order
                        : order.field,
                    typeof order === "string"
                        ? "asc"
                        : (order.direction || "asc")
                )
            );
        }

        if (settings.limit !== undefined) {
            const limitValue = Number(settings.limit);

            if (
                !Number.isInteger(limitValue) ||
                limitValue < 1 ||
                limitValue > 500
            ) {
                throw new Error(
                    "Listener limit must be between 1 and 500."
                );
            }

            constraints.push(
                firebaseModules.firestore.limit(
                    limitValue
                )
            );
        }

        const reference =
            firebaseModules.firestore.collection(
                STATE.db,
                validateCollectionName(collectionName)
            );

        const queryRef =
            constraints.length
                ? firebaseModules.firestore.query(
                    reference,
                    ...constraints
                )
                : reference;

        return firebaseModules.firestore.onSnapshot(
            queryRef,
            function (snapshot) {
                callback(
                    snapshot.docs.map(function (item) {
                        return {
                            id: item.id,
                            ...item.data()
                        };
                    })
                );
            },
            typeof onError === "function"
                ? onError
                : function (error) {
                    console.error(
                        "Firestore collection listener failed:",
                        error
                    );
                }
        );
    }

    /* =====================================================
       STORAGE HELPERS
    ====================================================== */

    async function uploadFile(file, path) {
        requireReady();

        if (!file) {
            throw new Error(
                "A file is required."
            );
        }

        if (
            typeof path !== "string" ||
            !path.trim()
        ) {
            throw new Error(
                "A valid Storage path is required."
            );
        }

        const storageReference =
            firebaseModules.storage.ref(
                STATE.storage,
                path.trim()
            );

        const result =
            await firebaseModules.storage.uploadBytes(
                storageReference,
                file,
                {
                    contentType:
                        file.type || "application/octet-stream"
                }
            );

        const downloadURL =
            await firebaseModules.storage.getDownloadURL(
                result.ref
            );

        return {
            reference: result.ref,
            fullPath: result.ref.fullPath,
            url: downloadURL
        };
    }

    async function deleteFile(path) {
        requireReady();

        if (
            typeof path !== "string" ||
            !path.trim()
        ) {
            throw new Error(
                "A valid Storage path is required."
            );
        }

        const storageReference =
            firebaseModules.storage.ref(
                STATE.storage,
                path.trim()
            );

        return firebaseModules.storage.deleteObject(
            storageReference
        );
    }

    /* =====================================================
       ARTICLE HELPERS

       Firestore rules must restrict who may create,
       update and delete articles.
    ====================================================== */

    async function saveArticle(article) {
        requireReady();

        if (
            !article ||
            typeof article !== "object" ||
            Array.isArray(article)
        ) {
            throw new Error(
                "Article data is required."
            );
        }

        const articleId =
            article.id ||
            (
                window.ALON_ENGINE &&
                typeof window.ALON_ENGINE.createId === "function"
                    ? window.ALON_ENGINE.createId("article")
                    : "article-" +
                      (
                          window.crypto &&
                          typeof window.crypto.randomUUID === "function"
                              ? window.crypto.randomUUID()
                              : Date.now() + "-" +
                                Math.random().toString(36).slice(2)
                      )
            );

        const articleData = {
            ...article,
            id: articleId,
            updatedAt:
                new Date().toISOString()
        };

        await setDocument(
            "articles",
            String(articleId),
            articleData,
            true
        );

        return {
            id: String(articleId)
        };
    }

    async function getArticle(articleId) {
        if (!articleId) {
            return null;
        }

        return getDocument(
            "articles",
            String(articleId)
        );
    }

    async function deleteArticle(articleId) {
        if (!articleId) {
            throw new Error(
                "Article ID is required."
            );
        }

        return deleteDocument(
            "articles",
            String(articleId)
        );
    }

    /* =====================================================
       ADMIN HELPERS

       Admin status must be assigned through trusted
       Firebase Admin SDK/server-side code.

       Never trust localStorage or user-edited properties.
    ====================================================== */

    function isAdmin() {
        return Boolean(
            STATE.user &&
            STATE.adminClaim === true
        );
    }

    async function verifyAdmin(forceRefresh) {
        requireAuth();

        const result =
            await getIdTokenResult(
                forceRefresh === true
            );

        return result.claims.admin === true;
    }

    /* =====================================================
       FRIENDLY ERRORS
    ====================================================== */

    function getFriendlyError(error) {
        if (!error) {
            return "Unknown Firebase error.";
        }

        const code = error.code || "";

        const messages = {
            "auth/invalid-email":
                "The email address is invalid.",

            "auth/user-not-found":
                "No account was found for this email.",

            "auth/wrong-password":
                "The password is incorrect or invalid.",

            "auth/invalid-credential":
                "The email or password is incorrect.",

            "auth/email-already-in-use":
                "This email is already registered.",

            "auth/weak-password":
                "Firebase rejected the password as too weak.",

            "auth/network-request-failed":
                "Network connection failed.",

            "auth/too-many-requests":
                "Too many attempts. Please try again later.",

            "auth/operation-not-allowed":
                "This sign-in method is not enabled in Firebase.",

            "permission-denied":
                "Firebase Security Rules denied this operation.",

            "storage/unauthorized":
                "Firebase Storage denied access to this file.",

            "storage/canceled":
                "The file upload was canceled.",

            "storage/object-not-found":
                "The requested file was not found.",

            "unavailable":
                "Firebase service is temporarily unavailable."
        };

        return (
            messages[code] ||
            error.message ||
            "Firebase operation failed."
        );
    }

    /* =====================================================
       PUBLIC API

       Existing API names are preserved.
    ====================================================== */

    const API = {
        config: FIREBASE_CONFIG,
        moduleURLs: FIREBASE_MODULE_URLS,
        state: STATE,

        getState: getState,
        isConfigured: isConfigured,
        isReady: isReady,
        isLoggedIn: isLoggedIn,
        getCurrentUser: getCurrentUser,

        initialize: initialize,
        loadFirebaseModules: loadFirebaseModules,

        signInWithEmail: signInWithEmail,
        createAccount: createAccount,
        signOut: signOut,
        resetPassword: resetPassword,
        sendEmailVerification: sendEmailVerification,
        updateDisplayName: updateDisplayName,
        refreshIdToken: refreshIdToken,
        getIdTokenResult: getIdTokenResult,
        onAuthStateChanged: onAuthStateChanged,

        addDocument: addDocument,
        setDocument: setDocument,
        getDocument: getDocument,
        deleteDocument: deleteDocument,
        queryDocuments: queryDocuments,
        listenDocument: listenDocument,
        listenCollection: listenCollection,

        uploadFile: uploadFile,
        deleteFile: deleteFile,

        saveArticle: saveArticle,
        getArticle: getArticle,
        deleteArticle: deleteArticle,

        isAdmin: isAdmin,
        verifyAdmin: verifyAdmin,

        getFriendlyError: getFriendlyError
    };

    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_FIREBASE = API;

    /* =====================================================
       AUTO INITIALIZATION

       Missing configuration does not permanently block
       a later call to initialize(realConfig).
    ====================================================== */

    function autoInitialize() {
        if (hasConfiguration()) {
            initialize().catch(function (error) {
                console.error(
                    "Firebase auto-initialization failed:",
                    error
                );
            });
        } else {
            console.info(
                "ALON HISTORYVERSE 24: Add the real Firebase configuration before using Firebase services."
            );
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            autoInitialize,
            { once: true }
        );
    } else {
        autoInitialize();
    }

    console.log(
        "ALON HISTORYVERSE 24 firebase.js v25.0 loaded."
    );

})();
