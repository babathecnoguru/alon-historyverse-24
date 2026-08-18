/* =========================================================
   ALON HISTORYVERSE 24
   VERSION: V100
   FILE: jss/firebase.js

   FIREBASE CORE
   ---------------------------------------------------------
   - Firebase Initialization
   - Authentication
   - Firestore
   - Storage
   - Article CRUD
   - Published / Featured Articles
   - Safe Firebase Access
========================================================= */


/* =========================================================
   01. FIREBASE SDK IMPORTS
========================================================= */

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";


/* =========================================================
   02. FIREBASE CONFIG
========================================================= */

/*
   IMPORTANT:
   यहाँ अपनी Firebase Console की असली configuration डालना।

   अभी खाली रखा गया है ताकि गलत Firebase project
   accidentally connect न हो।
*/

const FIREBASE_CONFIG = {

    apiKey: "",

    authDomain: "",

    projectId: "",

    storageBucket: "",

    messagingSenderId: "",

    appId: "",

    measurementId: ""

};


/* =========================================================
   03. CONFIG VALIDATION
========================================================= */

function isFirebaseConfigured() {

    const requiredKeys = [

        "apiKey",

        "authDomain",

        "projectId",

        "storageBucket",

        "messagingSenderId",

        "appId"

    ];


    return requiredKeys.every(
        key =>
            typeof FIREBASE_CONFIG[key] === "string" &&
            FIREBASE_CONFIG[key].trim() !== ""
    );

}


/* =========================================================
   04. FIREBASE STATE
========================================================= */

let firebaseApp = null;

let auth = null;

let db = null;

let storage = null;

let firebaseReady = false;


/* =========================================================
   05. FIREBASE INITIALIZATION
========================================================= */

function initializeHistoryVerseFirebase() {

    if (!isFirebaseConfigured()) {

        console.warn(
            "ALON HISTORYVERSE 24: Firebase configuration is not set yet."
        );

        firebaseReady = false;

        return false;

    }


    try {

        if (getApps().length > 0) {

            firebaseApp = getApp();

        } else {

            firebaseApp =
                initializeApp(
                    FIREBASE_CONFIG
                );

        }


        auth =
            getAuth(
                firebaseApp
            );


        db =
            getFirestore(
                firebaseApp
            );


        storage =
            getStorage(
                firebaseApp
            );


        firebaseReady = true;


        console.info(
            "ALON HISTORYVERSE 24: Firebase initialized successfully."
        );


        return true;

    } catch (error) {

        firebaseReady = false;


        console.error(
            "ALON HISTORYVERSE 24: Firebase initialization failed.",
            error
        );


        return false;

    }

}


/* =========================================================
   06. AUTO INITIALIZE
========================================================= */

initializeHistoryVerseFirebase();


/* =========================================================
   07. FIREBASE STATUS
========================================================= */

function isFirebaseReady() {

    return firebaseReady === true;

}


function getFirebaseApp() {

    return firebaseApp;

}


function getFirebaseAuth() {

    return auth;

}


function getFirestoreDB() {

    return db;

}


function getFirebaseStorage() {

    return storage;

}


/* =========================================================
   08. AUTHENTICATION — LOGIN
========================================================= */

async function loginUser(
    email,
    password
) {

    if (!auth) {

        throw new Error(
            "Firebase Authentication is not configured."
        );

    }


    if (!email || !password) {

        throw new Error(
            "Email and password are required."
        );

    }


    const result =
        await signInWithEmailAndPassword(
            auth,
            String(email).trim(),
            password
        );


    return result.user;

}


/* =========================================================
   09. AUTHENTICATION — REGISTER
========================================================= */

async function registerUser(
    email,
    password,
    displayName = ""
) {

    if (!auth) {

        throw new Error(
            "Firebase Authentication is not configured."
        );

    }


    if (!email || !password) {

        throw new Error(
            "Email and password are required."
        );

    }


    const result =
        await createUserWithEmailAndPassword(
            auth,
            String(email).trim(),
            password
        );


    if (
        displayName &&
        String(displayName).trim()
    ) {

        await updateProfile(
            result.user,
            {
                displayName:
                    String(
                        displayName
                    ).trim()
            }
        );

    }


    return result.user;

}


/* =========================================================
   10. LOGOUT
========================================================= */

async function logoutUser() {

    if (!auth) {

        return false;

    }


    await signOut(
        auth
    );


    return true;

}


/* =========================================================
   11. CURRENT USER
========================================================= */

function getCurrentUser() {

    if (!auth) {

        return null;

    }


    return auth.currentUser;

}


/* =========================================================
   12. AUTH STATE LISTENER
========================================================= */

function watchAuthState(
    callback
) {

    if (!auth) {

        if (
            typeof callback ===
            "function"
        ) {

            callback(null);

        }


        return () => {};

    }


    return onAuthStateChanged(
        auth,
        user => {

            if (
                typeof callback ===
                "function"
            ) {

                callback(user);

            }

        }
    );

}


/* =========================================================
   13. DELETE CURRENT USER
========================================================= */

async function removeCurrentUser() {

    const user =
        getCurrentUser();


    if (!user) {

        throw new Error(
            "No authenticated user."
        );

    }


    await deleteUser(
        user
    );


    return true;

}


/* =========================================================
   14. FIRESTORE COLLECTION
========================================================= */

function getCollection(
    collectionName
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (!collectionName) {

        throw new Error(
            "Collection name is required."
        );

    }


    return collection(
        db,
        collectionName
    );

}


/* =========================================================
   15. GET DOCUMENT
========================================================= */

async function getDocument(
    collectionName,
    documentId
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (
        !collectionName ||
        !documentId
    ) {

        throw new Error(
            "Collection name and document ID are required."
        );

    }


    const documentReference =
        doc(
            db,
            collectionName,
            documentId
        );


    const snapshot =
        await getDoc(
            documentReference
        );


    if (!snapshot.exists()) {

        return null;

    }


    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}


/* =========================================================
   16. CREATE DOCUMENT
========================================================= */

async function createDocument(
    collectionName,
    data
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (!data) {

        throw new Error(
            "Document data is required."
        );

    }


    const documentData = {

        ...data,

        createdAt:
            data.createdAt ||
            serverTimestamp(),

        updatedAt:
            serverTimestamp()

    };


    const documentReference =
        await addDoc(
            collection(
                db,
                collectionName
            ),
            documentData
        );


    return documentReference.id;

}


/* =========================================================
   17. SET / SAVE DOCUMENT
========================================================= */

async function saveDocument(
    collectionName,
    documentId,
    data
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (
        !collectionName ||
        !documentId
    ) {

        throw new Error(
            "Collection name and document ID are required."
        );

    }


    await setDoc(
        doc(
            db,
            collectionName,
            documentId
        ),
        {

            ...data,

            updatedAt:
                serverTimestamp()

        },
        {
            merge: true
        }
    );


    return documentId;

}


/* =========================================================
   18. UPDATE DOCUMENT
========================================================= */

async function editDocument(
    collectionName,
    documentId,
    data
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (
        !collectionName ||
        !documentId
    ) {

        throw new Error(
            "Collection name and document ID are required."
        );

    }


    await updateDoc(
        doc(
            db,
            collectionName,
            documentId
        ),
        {

            ...data,

            updatedAt:
                serverTimestamp()

        }
    );


    return true;

}


/* =========================================================
   19. DELETE DOCUMENT
========================================================= */

async function removeDocument(
    collectionName,
    documentId
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    if (
        !collectionName ||
        !documentId
    ) {

        throw new Error(
            "Collection name and document ID are required."
        );

    }


    await deleteDoc(
        doc(
            db,
            collectionName,
            documentId
        )
    );


    return true;

}


/* =========================================================
   20. GET ALL COLLECTION DOCUMENTS
========================================================= */

async function getCollectionDocuments(
    collectionName
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    const snapshot =
        await getDocs(
            collection(
                db,
                collectionName
            )
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


/* =========================================================
   21. QUERY DOCUMENTS
========================================================= */

async function queryDocuments(
    collectionName,
    conditions = [],
    sortField = null,
    sortDirection = "desc",
    resultLimit = null
) {

    if (!db) {

        throw new Error(
            "Firestore is not configured."
        );

    }


    const collectionReference =
        collection(
            db,
            collectionName
        );


    const queryParts = [];


    if (
        Array.isArray(
            conditions
        )
    ) {

        conditions.forEach(
            condition => {

                if (
                    condition &&
                    condition.field &&
                    condition.operator
                ) {

                    queryParts.push(
                        where(
                            condition.field,
                            condition.operator,
                            condition.value
                        )
                    );

                }

            }
        );

    }


    if (sortField) {

        queryParts.push(
            orderBy(
                sortField,
                sortDirection
            )
        );

    }


    if (
        Number.isInteger(
            resultLimit
        ) &&
        resultLimit > 0
    ) {

        queryParts.push(
            limit(
                resultLimit
            )
        );

    }


    const finalQuery =
        query(
            collectionReference,
            ...queryParts
        );


    const snapshot =
        await getDocs(
            finalQuery
        );


    return snapshot.docs.map(
        document => ({

            id:
                document.id,

            ...document.data()

        })
    );

}


/* =========================================================
   22. FILE UPLOAD
========================================================= */

async function uploadFile(
    file,
    folder = "historyverse"
) {

    if (!storage) {

        throw new Error(
            "Firebase Storage is not configured."
        );

    }


    if (!(file instanceof File)) {

        throw new Error(
            "A valid file is required."
        );

    }


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    const uniqueName =
        `${Date.now()}_${safeName}`;


    const storagePath =
        `${folder}/${uniqueName}`;


    const storageReference =
        ref(
            storage,
            storagePath
        );


    const uploadResult =
        await uploadBytes(
            storageReference,
            file
        );


    const downloadURL =
        await getDownloadURL(
            uploadResult.ref
        );


    return {

        name:
            safeName,

        path:
            storagePath,

        url:
            downloadURL,

        size:
            file.size,

        type:
            file.type

    };

}


/* =========================================================
   23. DELETE FILE
========================================================= */

async function removeFile(
    storagePath
) {

    if (!storage) {

        throw new Error(
            "Firebase Storage is not configured."
        );

    }


    if (!storagePath) {

        throw new Error(
            "Storage path is required."
        );

    }


    const storageReference =
        ref(
            storage,
            storagePath
        );


    await deleteObject(
        storageReference
    );


    return true;

}


/* =========================================================
   24. ARTICLE DATABASE
========================================================= */

const ARTICLE_COLLECTION =
    "articles";


/* =========================================================
   25. GET ARTICLE
========================================================= */

async function getArticle(
    articleId
) {

    return getDocument(
        ARTICLE_COLLECTION,
        articleId
    );

}


/* =========================================================
   26. CREATE ARTICLE
========================================================= */

async function createArticle(
    articleData
) {

    if (!articleData) {

        throw new Error(
            "Article data is required."
        );

    }


    return createDocument(
        ARTICLE_COLLECTION,
        {

            ...articleData,

            status:
                articleData.status ||
                "draft"

        }
    );

}


/* =========================================================
   27. UPDATE ARTICLE
========================================================= */

async function updateArticle(
    articleId,
    articleData
) {

    return editDocument(
        ARTICLE_COLLECTION,
        articleId,
        articleData
    );

}


/* =========================================================
   28. DELETE ARTICLE
========================================================= */

async function deleteArticle(
    articleId
) {

    return removeDocument(
        ARTICLE_COLLECTION,
        articleId
    );

}


/* =========================================================
   29. GET ALL ARTICLES
========================================================= */

async function getAllArticles() {

    return getCollectionDocuments(
        ARTICLE_COLLECTION
    );

}


/* =========================================================
   30. GET PUBLISHED ARTICLES
========================================================= */

async function getPublishedArticles(
    resultLimit = 50
) {

    return queryDocuments(

        ARTICLE_COLLECTION,

        [

            {

                field:
                    "status",

                operator:
                    "==",

                value:
                    "published"

            }

        ],

        "publishedAt",

        "desc",

        resultLimit

    );

}


/* =========================================================
   31. GET FEATURED ARTICLES
========================================================= */

async function getFeaturedArticles(
    resultLimit = 12
) {

    return queryDocuments(

        ARTICLE_COLLECTION,

        [

            {

                field:
                    "status",

                operator:
                    "==",

                value:
                    "published"

            },

            {

                field:
                    "featured",

                operator:
                    "==",

                value:
                    true

            }

        ],

        "publishedAt",

        "desc",

        resultLimit

    );

}


/* =========================================================
   32. PUBLIC FIREBASE API
========================================================= */

const HistoryVerseFirebase = {

    config:
        FIREBASE_CONFIG,


    isConfigured:
        isFirebaseConfigured,


    isReady:
        isFirebaseReady,


    initialize:
        initializeHistoryVerseFirebase,


    app:
        getFirebaseApp,


    auth:
        getFirebaseAuth,


    db:
        getFirestoreDB,


    storage:
        getFirebaseStorage,


    login:
        loginUser,


    register:
        registerUser,


    logout:
        logoutUser,


    currentUser:
        getCurrentUser,


    watchAuth:
        watchAuthState,


    deleteUser:
        removeCurrentUser,


    collection:
        getCollection,


    get:
        getDocument,


    create:
        createDocument,


    save:
        saveDocument,


    update:
        editDocument,


    delete:
        removeDocument,


    getAll:
        getCollectionDocuments,


    query:
        queryDocuments,


    upload:
        uploadFile,


    deleteFile:
        removeFile,


    articles: {

        get:
            getArticle,

        create:
            createArticle,

        update:
            updateArticle,

        delete:
            deleteArticle,

        getAll:
            getAllArticles,

        published:
            getPublishedArticles,

        featured:
            getFeaturedArticles

    }

};


/* =========================================================
   33. GLOBAL COMPATIBILITY
========================================================= */

if (
    typeof window !== "undefined"
) {

    window.HistoryVerseFirebase =
        HistoryVerseFirebase;

}


/* =========================================================
   34. EXPORTS
========================================================= */

export {

    FIREBASE_CONFIG,

    firebaseApp,

    auth,

    db,

    storage,

    isFirebaseConfigured,

    isFirebaseReady,

    initializeHistoryVerseFirebase,

    getFirebaseApp,

    getFirebaseAuth,

    getFirestoreDB,

    getFirebaseStorage,

    loginUser,

    registerUser,

    logoutUser,

    getCurrentUser,

    watchAuthState,

    removeCurrentUser,

    getCollection,

    getDocument,

    createDocument,

    saveDocument,

    editDocument,

    removeDocument,

    getCollectionDocuments,

    queryDocuments,

    uploadFile,

    removeFile,

    getArticle,

    createArticle,

    updateArticle,

    deleteArticle,

    getAllArticles,

    getPublishedArticles,

    getFeaturedArticles,

    HistoryVerseFirebase

};


/* =========================================================
   END OF ALON HISTORYVERSE 24 V100
========================================================= */