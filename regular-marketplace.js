/* =========================================================
   ALON HISTORYVERSE 24
   REGULAR MARKETPLACE ENGINE
   ---------------------------------------------------------
   IMPORTANT:
   This file belongs ONLY to Regular Marketplace.

   DO NOT MIX WITH:
   Global Marketplace / marketplace.js
   ========================================================= */

(function () {

"use strict";


/* =========================================================
   CONFIG
   ========================================================= */

const CONFIG = {

    project: "ALON HISTORYVERSE 24",

    version: "1.0",

    listingStorage:
        "alon_historyverse_regular_marketplace_listings",

    showroomStorage:
        "alon_historyverse_regular_marketplace_showrooms",

    accountStorage:
        "alon_historyverse_regular_marketplace_account",

    sessionStorage:
        "alon_historyverse_regular_marketplace_session",

    currency:
        "USD",

    showroomPrice:
        10

};


/* =========================================================
   STATE
   ========================================================= */

const state = {

    listings: [],

    showrooms: [],

    account: null,

    loggedIn: false,

    editingListingId: null,

    verifiedPayment: null

};


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {

    return document.getElementById(id);

}


function createId(prefix) {

    return (

        prefix +

        "_" +

        Date.now().toString(36) +

        "_" +

        Math.random()
            .toString(36)
            .slice(2, 9)

    );

}


function now() {

    return new Date().toISOString();

}


function escapeHTML(value) {

    return String(value ?? "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function readJSON(key, fallback) {

    try {

        const raw = localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        return JSON.parse(raw);

    } catch (error) {

        console.error(error);

        return fallback;

    }

}


function writeJSON(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}


function getCurrentUserEmail() {

    return state.account
        ? String(state.account.email || "").toLowerCase()
        : "";

}


/* =========================================================
   LOGIN
   ========================================================= */

function loadAccount() {

    state.account = readJSON(
        CONFIG.accountStorage,
        null
    );

    const session = readJSON(
        CONFIG.sessionStorage,
        null
    );

    state.loggedIn = !!(
        state.account &&
        session &&
        session.email
    );

}


function saveAccount(account) {

    state.account = account;

    state.loggedIn = true;

    writeJSON(
        CONFIG.accountStorage,
        account
    );

    writeJSON(
        CONFIG.sessionStorage,
        {
            email: account.email,
            loginAt: now()
        }
    );

}


function logout() {

    localStorage.removeItem(
        CONFIG.sessionStorage
    );

    state.loggedIn = false;

    state.account = null;

    state.verifiedPayment = null;

    updateLoginUI();

    renderListings();

    renderShowrooms();

}


function requireLogin() {

    if (state.loggedIn) {

        return true;

    }

    alert(
        "Please login first."
    );

    return false;

}


function handleLogin(event) {

    event.preventDefault();


    const name =
        $("rmLoginName").value.trim();

    const mobile =
        $("rmLoginMobile").value.trim();

    const email =
        $("rmLoginEmail").value
            .trim()
            .toLowerCase();

    const password =
        $("rmLoginPassword").value;

    const agreement =
        $("rmAgreement").checked;


    if (!agreement) {

        alert(
            "Please accept the Agreement first."
        );

        return;

    }


    if (!name || !mobile || !email) {

        alert(
            "Please complete all login fields."
        );

        return;

    }


    if (password.length < 4) {

        alert(
            "Password must contain at least 4 characters."
        );

        return;

    }


    /*
       Password is intentionally NOT stored.
       This local login is only a marketplace
       identity/session layer.
    */

    saveAccount({

        name,

        mobile,

        email,

        createdAt:
            state.account?.createdAt || now()

    });


    updateLoginUI();

    alert(
        "Login successful."
    );

}


function updateLoginUI() {

    const form =
        $("rmLoginForm");

    const profile =
        $("rmProfileBox");

    const status =
        $("rmLoginStatus");


    if (state.loggedIn) {

        form.classList.add(
            "rm-hidden"
        );

        profile.classList.remove(
            "rm-hidden"
        );


        $("rmProfileName")
            .textContent =
            state.account.name || "";


        $("rmProfileEmail")
            .textContent =
            state.account.email || "";


        status.textContent =
            "You are logged in. Login is hidden and Logout is available.";

    } else {

        form.classList.remove(
            "rm-hidden"
        );

        profile.classList.add(
            "rm-hidden"
        );


        status.textContent =
            "Please login to create, edit or delete your listings.";

    }

}


/* =========================================================
   CATEGORY SYSTEM
   ========================================================= */

const CATEGORY_DATA = {

    item: [

        ["electronics", "Electronics"],

        ["mobile", "Mobile"],

        ["furniture", "Furniture"],

        ["clothing", "Clothing"],

        ["home", "Home & Household"],

        ["tools", "Tools"],

        ["other-item", "Other Item"]

    ],


    property: [

        ["house", "House"],

        ["shop", "Shop"],

        ["flat", "Flat"],

        ["bungalow", "Bungalow"],

        ["plot", "Plot"],

        ["land", "Land"]

    ],


    vehicle: [

        ["car", "Car"],

        ["bike", "Bike"],

        ["truck", "Truck"],

        ["tractor", "Tractor"],

        ["jcb", "JCB"],

        ["other-vehicle", "Other Vehicle"]

    ]

};


function updateCategoryOptions() {

    const type =
        $("rmListingType").value;

    const select =
        $("rmListingCategory");


    select.innerHTML = "";

    if (!type) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "Select type first";

        select.appendChild(option);

        return;

    }


    const first =
        document.createElement("option");

    first.value = "";

    first.textContent =
        "Select Category";

    select.appendChild(first);


    CATEGORY_DATA[type].forEach(
        function (item) {

            const option =
                document.createElement("option");

            option.value = item[0];

            option.textContent = item[1];

            select.appendChild(option);

        }
    );

}


/* =========================================================
   COUNTRY SYSTEM
   ========================================================= */

function getCountryDatabase() {

    if (
        Array.isArray(
            window.MARKETPLACE_COUNTRIES
        )
    ) {

        return window.MARKETPLACE_COUNTRIES;

    }


    if (
        window.MARKETPLACE_COUNTRIES &&
        typeof window.MARKETPLACE_COUNTRIES === "object"
    ) {

        return Object.values(
            window.MARKETPLACE_COUNTRIES
        );

    }


    return [];

}


function countryName(item) {

    if (typeof item === "string") {

        return item;

    }

    return (

        item.name ||

        item.country ||

        item.label ||

        item.title ||

        ""

    );

}


function countryValue(item) {

    if (typeof item === "string") {

        return item;

    }

    return (

        item.code ||

        item.iso ||

        item.iso2 ||

        item.countryCode ||

        countryName(item)

    );

}


function populateCountries() {

    const countries =
        getCountryDatabase();


    const selects = [

        $("rmCountry"),

        $("rmShowroomCountry")

    ];


    selects.forEach(
        function (select) {

            if (!select) {
                return;
            }


            select.innerHTML = "";


            const first =
                document.createElement("option");

            first.value = "";

            first.textContent =
                "Select Country";

            select.appendChild(first);


            countries.forEach(
                function (item) {

                    const name =
                        countryName(item);

                    if (!name) {
                        return;
                    }


                    const option =
                        document.createElement("option");

                    option.value =
                        countryValue(item);

                    option.textContent =
                        name;

                    select.appendChild(option);

                }
            );

        }
    );

}


/* =========================================================
   IMAGE / VIDEO STORAGE
   ========================================================= */

function fileToDataURL(file) {

    return new Promise(
        function (resolve, reject) {

            if (!file) {

                resolve("");

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                reject;


            reader.readAsDataURL(file);

        }
    );

}


/*
   IndexedDB is used for media so images/videos
   do not have to be kept directly inside localStorage.
*/

const MEDIA_DB_NAME =
    "ALON_HISTORYVERSE_24_REGULAR_MARKETPLACE_MEDIA";

const MEDIA_DB_VERSION = 1;

const MEDIA_STORE = "media";


function openMediaDB() {

    return new Promise(
        function (resolve, reject) {

            if (!window.indexedDB) {

                resolve(null);

                return;

            }


            const request =
                indexedDB.open(
                    MEDIA_DB_NAME,
                    MEDIA_DB_VERSION
                );


            request.onupgradeneeded =
                function (event) {

                    const db =
                        event.target.result;


                    if (
                        !db.objectStoreNames.contains(
                            MEDIA_STORE
                        )
                    ) {

                        db.createObjectStore(
                            MEDIA_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                function () {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


async function saveMedia(file) {

    if (!file) {

        return null;

    }


    const id =
        createId("media");


    const db =
        await openMediaDB();


    /*
       Fallback for browsers without IndexedDB.
    */

    if (!db) {

        return {

            id,

            name: file.name,

            type: file.type,

            data:
                await fileToDataURL(file)

        };

    }


    return new Promise(
        function (resolve, reject) {

            const transaction =
                db.transaction(
                    MEDIA_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    MEDIA_STORE
                );


            store.put({

                id,

                name: file.name,

                type: file.type,

                blob: file

            });


            transaction.oncomplete =
                function () {

                    resolve({

                        id,

                        name: file.name,

                        type: file.type

                    });

                };


            transaction.onerror =
                function () {

                    reject(
                        transaction.error
                    );

                };

        }
    );

}


async function getMedia(id) {

    if (!id) {

        return null;

    }


    const db =
        await openMediaDB();


    if (!db) {

        return null;

    }


    return new Promise(
        function (resolve) {

            const transaction =
                db.transaction(
                    MEDIA_STORE,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    MEDIA_STORE
                );


            const request =
                store.get(id);


            request.onsuccess =
                function () {

                    resolve(
                        request.result || null
                    );

                };


            request.onerror =
                function () {

                    resolve(null);

                };

        }
    );

}


function createMediaElement(
    mediaRecord,
    mediaType
) {

    if (!mediaRecord) {

        return "";

    }


    if (mediaRecord.data) {

        if (
            mediaType === "video"
        ) {

            return `
                <video
                    class="rm-media"
                    controls
                    src="${mediaRecord.data}"
                ></video>
            `;

        }


        return `
            <img
                class="rm-media"
                src="${mediaRecord.data}"
                alt=""
            >
        `;

    }


    return "";

}


/* =========================================================
   LISTINGS STORAGE
   ========================================================= */

function loadData() {

    state.listings =
        readJSON(
            CONFIG.listingStorage,
            []
        );


    state.showrooms =
        readJSON(
            CONFIG.showroomStorage,
            []
        );

}


function saveListings() {

    writeJSON(
        CONFIG.listingStorage,
        state.listings
    );

}


function saveShowrooms() {

    writeJSON(
        CONFIG.showroomStorage,
        state.showrooms
    );

}


/* =========================================================
   LISTING SAVE
   ========================================================= */

async function handleListingSave(event) {

    event.preventDefault();


    if (!requireLogin()) {
        return;
    }


    const form =
        $("rmListingForm");


    const imageFile =
        $("rmImage").files[0] || null;


    const videoFile =
        $("rmVideo").files[0] || null;


    const imageMedia =
        imageFile
            ? await saveMedia(imageFile)
            : null;


    const videoMedia =
        videoFile
            ? await saveMedia(videoFile)
            : null;


    const existing =
        state.listings.find(
            function (item) {

                return (
                    item.id ===
                    state.editingListingId
                );

            }
        );


    const listing = {

        id:
            existing?.id ||
            createId("listing"),

        type:
            $("rmListingType").value,

        category:
            $("rmListingCategory").value,

        condition:
            $("rmCondition").value,

        title:
            $("rmTitle").value.trim(),

        price:
            $("rmPrice").value,

        country:
            $("rmCountry").value,

        state:
            $("rmState").value.trim(),

        district:
            $("rmDistrict").value.trim(),

        taluka:
            $("rmTaluka").value.trim(),

        pin:
            $("rmPin").value.trim(),

        description:
            $("rmDescription").value.trim(),

        phone:
            $("rmPhone").value.trim(),

        email:
            $("rmEmail").value.trim(),

        image:
            imageMedia ||
            existing?.image ||
            null,

        video:
            videoMedia ||
            existing?.video ||
            null,

        ownerEmail:
            getCurrentUserEmail(),

        ownerName:
            state.account.name,

        createdAt:
            existing?.createdAt ||
            now(),

        updatedAt:
            now()

    };


    if (existing) {

        const index =
            state.listings.indexOf(
                existing
            );


        state.listings[index] =
            listing;

    } else {

        state.listings.push(
            listing
        );

    }


    saveListings();


    state.editingListingId =
        null;


    form.reset();


    showStatus(
        "rmListingStatus",
        existing
            ? "Listing updated successfully."
            : "Listing saved successfully.",
        false
    );


    renderListings();

}


/* =========================================================
   LISTINGS RENDER
   ========================================================= */

function renderListings() {

    const box =
        $("rmMyListings");


    box.innerHTML = "";


    if (!state.loggedIn) {

        box.innerHTML =
            "<p>Please login to see your listings.</p>";

        return;

    }


    const email =
        getCurrentUserEmail();


    const mine =
        state.listings.filter(
            function (item) {

                return (
                    String(item.ownerEmail || "")
                        .toLowerCase() ===
                    email
                );

            }
        );


    if (!mine.length) {

        box.innerHTML =
            "<p>No listings yet.</p>";

        return;

    }


    mine.forEach(
        async function (item) {

            const article =
                document.createElement("article");


            article.className =
                "rm-listing";


            article.innerHTML = `

                <h3>
                    ${escapeHTML(item.title)}
                </h3>

                <div class="rm-meta">

                    <div>
                        Type:
                        ${escapeHTML(item.type)}
                    </div>

                    <div>
                        Category:
                        ${escapeHTML(item.category)}
                    </div>

                    <div>
                        Condition:
                        ${escapeHTML(item.condition)}
                    </div>

                    <div>
                        Price:
                        ${escapeHTML(item.price)}
                    </div>

                    <div>
                        Location:
                        ${escapeHTML(item.country)}
                        /
                        ${escapeHTML(item.state)}
                        /
                        ${escapeHTML(item.district)}
                        /
                        ${escapeHTML(item.taluka)}
                        /
                        ${escapeHTML(item.pin)}
                    </div>

                    <div>
                        Phone:
                        ${escapeHTML(item.phone)}
                    </div>

                    <div>
                        Email:
                        ${escapeHTML(item.email)}
                    </div>

                </div>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <div class="rm-actions">

                    <button
                        class="rm-btn"
                        data-edit-listing="${item.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="rm-btn danger"
                        data-delete-listing="${item.id}"
                    >
                        Delete
                    </button>

                </div>

                <div
                    id="media-${item.id}"
                ></div>

            `;


            box.appendChild(
                article
            );


            renderListingMedia(
                item
            );

        }
    );

}


async function renderListingMedia(item) {

    const box =
        document.getElementById(
            "media-" + item.id
        );


    if (!box) {
        return;
    }


    let html = "";


    if (item.image) {

        if (item.image.data) {

            html +=
                createMediaElement(
                    item.image,
                    "image"
                );

        } else {

            const media =
                await getMedia(
                    item.image.id
                );

            if (media) {

                const url =
                    URL.createObjectURL(
                        media.blob
                    );


                html += `
                    <img
                        class="rm-media"
                        src="${url}"
                        alt=""
                    >
                `;

            }

        }

    }


    if (item.video) {

        if (item.video.data) {

            html +=
                createMediaElement(
                    item.video,
                    "video"
                );

        } else {

            const media =
                await getMedia(
                    item.video.id
                );

            if (media) {

                const url =
                    URL.createObjectURL(
                        media.blob
                    );


                html += `
                    <video
                        class="rm-media"
                        controls
                        src="${url}"
                    ></video>
                `;

            }

        }

    }


    box.innerHTML =
        html;

}


/* =========================================================
   LISTING EDIT
   ========================================================= */

function editListing(id) {

    if (!requireLogin()) {
        return;
    }


    const listing =
        state.listings.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!listing) {
        return;
    }


    if (
        String(listing.ownerEmail)
            .toLowerCase() !==
        getCurrentUserEmail()
    ) {

        alert(
            "You can edit only your own listing."
        );

        return;

    }


    state.editingListingId =
        id;


    $("rmListingType").value =
        listing.type;


    updateCategoryOptions();


    $("rmListingCategory").value =
        listing.category;


    $("rmCondition").value =
        listing.condition;


    $("rmTitle").value =
        listing.title;


    $("rmPrice").value =
        listing.price;


    $("rmCountry").value =
        listing.country;


    $("rmState").value =
        listing.state;


    $("rmDistrict").value =
        listing.district;


    $("rmTaluka").value =
        listing.taluka;


    $("rmPin").value =
        listing.pin;


    $("rmPhone").value =
        listing.phone;


    $("rmEmail").value =
        listing.email;


    $("rmDescription").value =
        listing.description;


    window.scrollTo({

        top:
            $("rmListingForm")
                .getBoundingClientRect()
                .top +
            window.scrollY -
            20,

        behavior:
            "smooth"

    });

}


function deleteListing(id) {

    if (!requireLogin()) {
        return;
    }


    const listing =
        state.listings.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!listing) {
        return;
    }


    if (
        String(listing.ownerEmail)
            .toLowerCase() !==
        getCurrentUserEmail()
    ) {

        alert(
            "You can delete only your own listing."
        );

        return;

    }


    if (
        !confirm(
            "Delete this listing?"
        )
    ) {

        return;

    }


    state.listings =
        state.listings.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveListings();

    renderListings();

}


/* =========================================================
   SHOWROOM PAYMENT
   ========================================================= */

/*
   IMPORTANT SECURITY NOTE:

   This function does NOT pretend that payment succeeded.

   A real payment gateway/backend must return a verified
   payment confirmation before the advertisement is published.

   Replace the integration point below with the chosen
   gateway's official checkout + server verification.

*/

async function startShowroomPayment() {

    if (!requireLogin()) {
        return;
    }


    const form =
        $("rmShowroomForm");


    if (!form.reportValidity()) {
        return;
    }


    showPaymentStatus(
        "Opening secure payment integration...",
        false
    );


    /*
       SECURITY:
       Do not collect raw card number, CVV or PIN here.

       Those details must be entered inside the payment
       gateway's secure checkout.

       This placeholder intentionally refuses to mark
       the advertisement as paid.
    */


    state.verifiedPayment = null;


    $("rmPublishShowroomBtn").disabled =
        true;


    showPaymentStatus(

        "Payment gateway is not connected yet. No payment has been charged. Connect a real payment gateway and server-side verification before publishing.",

        true

    );

}


/*
   This function is the ONLY place where a verified
   gateway response should unlock publication.

   It must be called by trusted payment-verification
   code after the gateway confirms the $10 transaction.
*/

function acceptVerifiedPayment(
    paymentData
) {

    if (!paymentData) {
        return false;
    }


    if (
        paymentData.status !==
        "verified"
    ) {

        return false;

    }


    if (
        Number(paymentData.amount) !==
        CONFIG.showroomPrice
    ) {

        return false;

    }


    if (
        String(paymentData.currency)
            .toUpperCase() !==
        "USD"
    ) {

        return false;

    }


    if (!paymentData.paymentId) {

        return false;

    }


    state.verifiedPayment = {

        paymentId:
            paymentData.paymentId,

        amount:
            CONFIG.showroomPrice,

        currency:
            "USD",

        status:
            "verified",

        verifiedAt:
            now()

    };


    $("rmPublishShowroomBtn").disabled =
        false;


    showPaymentStatus(
        "Payment verified. The advertisement can now be published.",
        false
    );


    return true;

}


/* =========================================================
   SHOWROOM SAVE
   ========================================================= */

async function handleShowroomPublish(
    event
) {

    event.preventDefault();


    if (!requireLogin()) {
        return;
    }


    /*
       No verified payment = no publication.
    */

    if (!state.verifiedPayment) {

        showPaymentStatus(

            "Verified $10 payment is required before publishing.",

            true

        );

        return;

    }


    const imageFile =
        $("rmShowroomImage")
            .files[0];


    const videoFile =
        $("rmShowroomVideo")
            .files[0] ||
        null;


    if (!imageFile) {

        alert(
            "Please select a showroom image."
        );

        return;

    }


    const imageMedia =
        await saveMedia(
            imageFile
        );


    const videoMedia =
        videoFile
            ? await saveMedia(
                videoFile
            )
            : null;


    const showroom = {

        id:
            createId("showroom"),

        showroomName:
            $("rmShowroomName")
                .value
                .trim(),

        showroomType:
            $("rmShowroomType")
                .value,

        country:
            $("rmShowroomCountry")
                .value,

        state:
            $("rmShowroomState")
                .value
                .trim(),

        district:
            $("rmShowroomDistrict")
                .value
                .trim(),

        taluka:
            $("rmShowroomTaluka")
                .value
                .trim(),

        pin:
            $("rmShowroomPin")
                .value
                .trim(),

        phone:
            $("rmShowroomPhone")
                .value
                .trim(),

        email:
            $("rmShowroomEmail")
                .value
                .trim(),

        description:
            $("rmShowroomDescription")
                .value
                .trim(),

        image:
            imageMedia,

        video:
            videoMedia,

        ownerEmail:
            getCurrentUserEmail(),

        ownerName:
            state.account.name,

        payment:
            state.verifiedPayment,

        status:
            "published",

        createdAt:
            now()

    };


    state.showrooms.push(
        showroom
    );


    saveShowrooms();


    $("rmShowroomForm")
        .reset();


    state.verifiedPayment =
        null;


    $("rmPublishShowroomBtn")
        .disabled = true;


    showPaymentStatus(
        "Showroom advertisement published successfully.",
        false
    );


    renderShowrooms();

}


/* =========================================================
   SHOWROOM RENDER
   ========================================================= */

function renderShowrooms() {

    const box =
        $("rmShowroomListings");


    box.innerHTML = "";


    if (!state.loggedIn) {

        box.innerHTML =
            "<p>Please login to see your showroom advertisements.</p>";

        return;

    }


    const email =
        getCurrentUserEmail();


    const mine =
        state.showrooms.filter(
            function (item) {

                return (
                    String(item.ownerEmail || "")
                        .toLowerCase() ===
                    email
                );

            }
        );


    if (!mine.length) {

        box.innerHTML =
            "<p>No showroom advertisements yet.</p>";

        return;

    }


    mine.forEach(
        function (item) {

            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "rm-listing";


            article.innerHTML = `

                <h3>
                    ${escapeHTML(item.showroomName)}
                </h3>

                <div class="rm-meta">

                    <div>
                        Type:
                        ${escapeHTML(item.showroomType)}
                    </div>

                    <div>
                        Location:
                        ${escapeHTML(item.country)}
                        /
                        ${escapeHTML(item.state)}
                        /
                        ${escapeHTML(item.district)}
                        /
                        ${escapeHTML(item.taluka)}
                        /
                        ${escapeHTML(item.pin)}
                    </div>

                    <div>
                        Phone:
                        ${escapeHTML(item.phone)}
                    </div>

                    <div>
                        Email:
                        ${escapeHTML(item.email)}
                    </div>

                    <div>
                        Payment:
                        $10 USD
                        —
                        ${escapeHTML(
                            item.payment?.paymentId ||
                            "Verified"
                        )}
                    </div>

                </div>

                <p>
                    ${escapeHTML(item.description)}
                </p>

                <div
                    id="showroom-media-${item.id}"
                ></div>

                <div class="rm-actions">

                    <button
                        class="rm-btn danger"
                        data-delete-showroom="${item.id}"
                    >
                        Delete
                    </button>

                </div>

            `;


            box.appendChild(
                article
            );


            renderShowroomMedia(
                item
            );

        }
    );

}


async function renderShowroomMedia(
    item
) {

    const box =
        document.getElementById(
            "showroom-media-" +
            item.id
        );


    if (!box) {
        return;
    }


    let html = "";


    if (item.image) {

        if (item.image.data) {

            html +=
                createMediaElement(
                    item.image,
                    "image"
                );

        } else {

            const media =
                await getMedia(
                    item.image.id
                );


            if (media) {

                const url =
                    URL.createObjectURL(
                        media.blob
                    );


                html += `
                    <img
                        class="rm-media"
                        src="${url}"
                        alt=""
                    >
                `;

            }

        }

    }


    if (item.video) {

        if (item.video.data) {

            html +=
                createMediaElement(
                    item.video,
                    "video"
                );

        } else {

            const media =
                await getMedia(
                    item.video.id
                );


            if (media) {

                const url =
                    URL.createObjectURL(
                        media.blob
                    );


                html += `
                    <video
                        class="rm-media"
                        controls
                        src="${url}"
                    ></video>
                `;

            }

        }

    }


    box.innerHTML =
        html;

}


function deleteShowroom(id) {

    if (!requireLogin()) {
        return;
    }


    const showroom =
        state.showrooms.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!showroom) {
        return;
    }


    if (
        String(showroom.ownerEmail)
            .toLowerCase() !==
        getCurrentUserEmail()
    ) {

        alert(
            "You can delete only your own showroom advertisement."
        );

        return;

    }


    if (
        !confirm(
            "Delete this showroom advertisement?"
        )
    ) {

        return;

    }


    state.showrooms =
        state.showrooms.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveShowrooms();

    renderShowrooms();

}


/* =========================================================
   STATUS
   ========================================================= */

function showStatus(
    id,
    message,
    error
) {

    const box =
        $(id);


    if (!box) {
        return;
    }


    box.textContent =
        message;


    box.classList.add(
        "show"
    );


    box.classList.toggle(
        "error",
        !!error
    );


    box.classList.toggle(
        "ok",
        !error
    );

}


function showPaymentStatus(
    message,
    error
) {

    showStatus(
        "rmPaymentStatus",
        message,
        error
    );

}


/* =========================================================
   EVENT DELEGATION
   ========================================================= */

function handleListingActions(
    event
) {

    const editButton =
        event.target.closest(
            "[data-edit-listing]"
        );


    if (editButton) {

        editListing(
            editButton.dataset.editListing
        );

        return;

    }


    const deleteButton =
        event.target.closest(
            "[data-delete-listing]"
        );


    if (deleteButton) {

        deleteListing(
            deleteButton.dataset.deleteListing
        );

    }

}


function handleShowroomActions(
    event
) {

    const deleteButton =
        event.target.closest(
            "[data-delete-showroom]"
        );


    if (deleteButton) {

        deleteShowroom(
            deleteButton.dataset.deleteShowroom
        );

    }

}


/* =========================================================
   INIT
   ========================================================= */

function init() {

    loadData();

    loadAccount();

    populateCountries();

    updateCategoryOptions();

    updateLoginUI();

    renderListings();

    renderShowrooms();


    $("rmLoginForm")
        .addEventListener(
            "submit",
            handleLogin
        );


    $("rmLogoutBtn")
        .addEventListener(
            "click",
            logout
        );


    $("rmListingType")
        .addEventListener(
            "change",
            updateCategoryOptions
        );


    $("rmListingForm")
        .addEventListener(
            "submit",
            handleListingSave
        );


    $("rmCancelEdit")
        .addEventListener(
            "click",
            function () {

                state.editingListingId =
                    null;

                $("rmListingForm")
                    .reset();

                updateCategoryOptions();

            }
        );


    $("rmMyListings")
        .addEventListener(
            "click",
            handleListingActions
        );


    $("rmPayShowroomBtn")
        .addEventListener(
            "click",
            startShowroomPayment
        );


    $("rmShowroomForm")
        .addEventListener(
            "submit",
            handleShowroomPublish
        );


    $("rmShowroomListings")
        .addEventListener(
            "click",
            handleShowroomActions
        );

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.ALON_REGULAR_MARKETPLACE = {

    version:
        CONFIG.version,

    config:
        CONFIG,

    state,

    login:
        handleLogin,

    logout,

    acceptVerifiedPayment,

    renderListings,

    renderShowrooms

};


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();

}

})();