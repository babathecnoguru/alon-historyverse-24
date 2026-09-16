/* =========================================================
   ALON HISTORYVERSE 24
   GLOBAL MARKETPLACE ENGINE
   Creator: Baba Thecno Guru
   Version: 24.1
   File: marketplace.js

   FEATURES
   ---------------------------------------------------------
   • Marketplace login / profile
   • Logout
   • Global advertisements
   • Business / Shop listings
   • Products
   • Jobs
   • Services
   • Country database integration
   • Search
   • Category filtering
   • Save
   • Edit
   • Delete
   • Preview
   • Image storage through IndexedDB
   • Video storage through IndexedDB
   • Local persistent data
   • Mobile-friendly
   • No external libraries

   IMPORTANT
   ---------------------------------------------------------
   • Global Marketplace only
   • Regular Marketplace is NOT modified here
   • Existing file/path structure is preserved
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ALON_MARKETPLACE_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "24.1",

    dataStorage:
        "alon_historyverse_marketplace",

    countryStorage:
        "alon_marketplace_country",

    accountStorage:
        "alon_historyverse_marketplace_account",

    sessionStorage:
        "alon_historyverse_marketplace_session",

    databaseName:
        "ALON_HISTORYVERSE_MARKETPLACE_DB",

    databaseVersion:
        1,

    mediaStore:
        "media",

    currency:
        "USD"

};


/* =========================================================
   STATE
   ========================================================= */

const MARKETPLACE_STATE = {

    products: [],

    jobs: [],

    services: [],

    advertisements: [],

    selectedCountry: "",

    searchText: "",

    category: "",

    editingAdvertisementId: null,

    initialized: false,

    databaseReady: false,

    loggedIn: false,

    account: {

        mobile: "",

        email: ""

    }

};


/* =========================================================
   JSON STORAGE
   ========================================================= */

function marketplaceLoadJSON(
    key,
    fallback
) {

    try {

        const saved =
            localStorage.getItem(key);


        if (!saved) {

            return fallback;

        }


        return JSON.parse(saved);

    } catch (error) {

        console.warn(
            "Marketplace storage read error:",
            error
        );

        return fallback;

    }

}


function marketplaceSaveJSON(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Marketplace storage save error:",
            error
        );

        return false;

    }

}


/* =========================================================
   MARKETPLACE DATA
   ========================================================= */

function marketplaceLoadData() {

    const data =
        marketplaceLoadJSON(

            ALON_MARKETPLACE_CONFIG
                .dataStorage,

            {

                products: [],

                jobs: [],

                services: [],

                advertisements: []

            }

        );


    if (
        !data ||
        typeof data !== "object"
    ) {

        return {

            products: [],

            jobs: [],

            services: [],

            advertisements: []

        };

    }


    return {

        products:
            Array.isArray(data.products)
                ? data.products
                : [],

        jobs:
            Array.isArray(data.jobs)
                ? data.jobs
                : [],

        services:
            Array.isArray(data.services)
                ? data.services
                : [],

        advertisements:
            Array.isArray(data.advertisements)
                ? data.advertisements
                : []

    };

}


function marketplaceSaveData() {

    return marketplaceSaveJSON(

        ALON_MARKETPLACE_CONFIG
            .dataStorage,

        {

            products:
                MARKETPLACE_STATE.products,

            jobs:
                MARKETPLACE_STATE.jobs,

            services:
                MARKETPLACE_STATE.services,

            advertisements:
                MARKETPLACE_STATE.advertisements

        }

    );

}


/* =========================================================
   ID
   ========================================================= */

function marketplaceCreateId(
    prefix
) {

    return (

        String(prefix || "item") +

        "_" +

        Date.now() +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 9)

    );

}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function marketplaceEscapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

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


/* =========================================================
   URL SAFETY
   ========================================================= */

function marketplaceSafeURL(
    value
) {

    const text =
        String(value || "").trim();


    if (!text) {

        return "";

    }


    try {

        const url =
            new URL(text);


        if (

            url.protocol === "http:" ||

            url.protocol === "https:"

        ) {

            return url.href;

        }

    } catch (error) {

        return "";

    }


    return "";

}


/* =========================================================
   COUNTRY DATABASE
   ---------------------------------------------------------
   Supports:
   • MARKETPLACE_COUNTRIES
   • ALON_MARKETPLACE_COUNTRIES
   • ALON_WORLD_COUNTRIES
   • WORLD_COUNTRIES
   • window/globalThis versions
   • direct arrays
   • { countries: [...] }
   • { data: [...] }
   ========================================================= */

function marketplaceNormalizeCountrySource(
    source
) {

    if (
        Array.isArray(source)
    ) {

        return source;

    }


    if (
        source &&
        typeof source === "object"
    ) {

        if (
            Array.isArray(
                source.countries
            )
        ) {

            return source.countries;

        }


        if (
            Array.isArray(
                source.data
            )
        ) {

            return source.data;

        }


        if (
            Array.isArray(
                source.list
            )
        ) {

            return source.list;

        }

    }


    return [];

}


function marketplaceGetCountries() {

    const sources = [];


    /*
     * Global lexical variables.
     * typeof prevents ReferenceError when a
     * particular country variable does not exist.
     */

    if (
        typeof MARKETPLACE_COUNTRIES !==
        "undefined"
    ) {

        sources.push(
            MARKETPLACE_COUNTRIES
        );

    }


    if (
        typeof ALON_MARKETPLACE_COUNTRIES !==
        "undefined"
    ) {

        sources.push(
            ALON_MARKETPLACE_COUNTRIES
        );

    }


    if (
        typeof ALON_WORLD_COUNTRIES !==
        "undefined"
    ) {

        sources.push(
            ALON_WORLD_COUNTRIES
        );

    }


    if (
        typeof WORLD_COUNTRIES !==
        "undefined"
    ) {

        sources.push(
            WORLD_COUNTRIES
        );

    }


    /*
     * window/globalThis versions.
     */

    if (
        typeof window !== "undefined"
    ) {

        sources.push(
            window.MARKETPLACE_COUNTRIES
        );

        sources.push(
            window.ALON_MARKETPLACE_COUNTRIES
        );

        sources.push(
            window.ALON_WORLD_COUNTRIES
        );

        sources.push(
            window.WORLD_COUNTRIES
        );

    }


    if (
        typeof globalThis !== "undefined"
    ) {

        sources.push(
            globalThis.MARKETPLACE_COUNTRIES
        );

        sources.push(
            globalThis.ALON_MARKETPLACE_COUNTRIES
        );

        sources.push(
            globalThis.ALON_WORLD_COUNTRIES
        );

        sources.push(
            globalThis.WORLD_COUNTRIES
        );

    }


    const result = [];

    const seen =
        new Set();


    sources.forEach(

        function(source) {

            const countries =
                marketplaceNormalizeCountrySource(
                    source
                );


            countries.forEach(

                function(country) {

                    if (
                        !country ||
                        typeof country !== "object"
                    ) {

                        return;

                    }


                    const code =

                        String(

                            country.code ||

                            country.iso ||

                            country.isoCode ||

                            country.iso2 ||

                            country.cca2 ||

                            country.countryCode ||

                            ""

                        )

                            .trim()
                            .toUpperCase();


                    const name =

                        String(

                            country.name ||

                            country.country ||

                            country.countryName ||

                            country.label ||

                            country.title ||

                            ""

                        )

                            .trim();


                    if (
                        !code &&
                        !name
                    ) {

                        return;

                    }


                    const key =
                        code ||
                        name.toLowerCase();


                    if (
                        seen.has(key)
                    ) {

                        return;

                    }


                    seen.add(key);


                    result.push(
                        country
                    );

                }

            );

        }

    );


    return result;

}


/* =========================================================
   COUNTRY CODE
   ========================================================= */

function marketplaceCountryCode(
    country
) {

    if (
        !country
    ) {

        return "";

    }


    return String(

        country.code ||

        country.iso ||

        country.isoCode ||

        country.iso2 ||

        country.cca2 ||

        country.countryCode ||

        ""

    )

        .trim()
        .toUpperCase();

}


/* =========================================================
   COUNTRY NAME
   ========================================================= */

function marketplaceCountryObjectName(
    country
) {

    if (
        !country
    ) {

        return "";

    }


    return String(

        country.name ||

        country.country ||

        country.countryName ||

        country.label ||

        country.title ||

        ""

    ).trim();

}


/* =========================================================
   COUNTRY CALLING CODE
   ========================================================= */

function marketplaceCountryCallingCode(
    country
) {

    if (
        !country
    ) {

        return "";

    }


    return String(

        country.callingCode ||

        country.calling_code ||

        country.dialCode ||

        country.dial_code ||

        country.phoneCode ||

        country.phone_code ||

        ""

    ).trim();

}


/* =========================================================
   COUNTRY FINDER
   ========================================================= */

function marketplaceFindCountry(
    code
) {

    const countries =
        marketplaceGetCountries();


    const target =
        String(code || "")
            .trim()
            .toUpperCase();


    if (!target) {

        return null;

    }


    return countries.find(

        function(country) {

            return (

                marketplaceCountryCode(
                    country
                ) === target

            );

        }

    ) || null;

}


/* =========================================================
   COUNTRY NAME
   ========================================================= */

function marketplaceCountryName(
    code
) {

    const country =
        marketplaceFindCountry(code);


    if (!country) {

        return String(
            code || ""
        );

    }


    return (

        marketplaceCountryObjectName(
            country
        ) ||

        String(
            code || ""
        )

    );

}


/* =========================================================
   COUNTRY FLAG
   ========================================================= */

function marketplaceCountryFlag(
    code
) {

    const country =
        marketplaceFindCountry(code);


    if (!country) {

        return "";

    }


    return String(

        country.flag ||

        country.emoji ||

        country.flagEmoji ||

        country.flag_emoji ||

        ""

    );

}


/* =========================================================
   COUNTRY SELECT
   ========================================================= */

function marketplacePopulateCountrySelect(
    selector,
    includeAll
) {

    const select =
        document.querySelector(
            selector
        );


    if (!select) {

        return;

    }


    const countries =
        marketplaceGetCountries();


    const current =
        select.value;


    select.innerHTML =

        includeAll

            ? '<option value="">All Countries</option>'

            : '<option value="">Select Country</option>';


    if (!countries.length) {

        console.warn(
            "Marketplace country database could not be loaded."
        );

        return;

    }


    countries.forEach(

        function(country) {

            const code =
                marketplaceCountryCode(
                    country
                );


            const name =
                marketplaceCountryObjectName(
                    country
                ) ||
                "Unknown Country";


            const flag =
                String(

                    country.flag ||

                    country.emoji ||

                    country.flagEmoji ||

                    country.flag_emoji ||

                    ""

                );


            const callingCode =
                marketplaceCountryCallingCode(
                    country
                );


            if (!code) {

                return;

            }


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                code;


            option.textContent =

                (

                    flag

                        ? flag + " "

                        : ""

                ) +

                name +

                " [" +
                code +
                "]" +

                (

                    callingCode

                        ? " (" +
                          callingCode +
                          ")"

                        : ""

                );


            select.appendChild(
                option
            );

        }

    );


    if (current) {

        const matchingOption =
            Array.from(
                select.options
            ).find(

                function(option) {

                    return (

                        String(
                            option.value
                        ).toUpperCase() ===
                        String(
                            current
                        ).toUpperCase()

                    );

                }

            );


        if (matchingOption) {

            select.value =
                matchingOption.value;

        }

    }

}


/* =========================================================
   INDEXEDDB
   ========================================================= */

let MARKETPLACE_DB = null;


function marketplaceOpenDatabase() {

    return new Promise(

        function(resolve, reject) {

            if (
                !("indexedDB" in window)
            ) {

                reject(
                    new Error(
                        "IndexedDB is not supported."
                    )
                );

                return;

            }


            const request =
                indexedDB.open(

                    ALON_MARKETPLACE_CONFIG
                        .databaseName,

                    ALON_MARKETPLACE_CONFIG
                        .databaseVersion

                );


            request.onupgradeneeded =
                function(event) {

                    const db =
                        event.target.result;


                    if (

                        !db.objectStoreNames
                            .contains(

                                ALON_MARKETPLACE_CONFIG
                                    .mediaStore

                            )

                    ) {

                        db.createObjectStore(

                            ALON_MARKETPLACE_CONFIG
                                .mediaStore,

                            {

                                keyPath:
                                    "id"

                            }

                        );

                    }

                };


            request.onsuccess =
                function(event) {

                    MARKETPLACE_DB =
                        event.target.result;


                    MARKETPLACE_STATE
                        .databaseReady = true;


                    MARKETPLACE_DB.onversionchange =
                        function() {

                            MARKETPLACE_DB.close();

                            MARKETPLACE_DB =
                                null;

                            MARKETPLACE_STATE
                                .databaseReady =
                                false;

                        };


                    resolve(
                        MARKETPLACE_DB
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }

    );

}


/* =========================================================
   STORE MEDIA
   ========================================================= */

function marketplaceStoreMedia(
    file,
    adId,
    type
) {

    return new Promise(

        function(resolve, reject) {

            if (
                !file ||
                !MARKETPLACE_DB
            ) {

                resolve(null);

                return;

            }


            const mediaId =
                marketplaceCreateId(
                    type || "media"
                );


            const transaction =
                MARKETPLACE_DB.transaction(

                    [
                        ALON_MARKETPLACE_CONFIG
                            .mediaStore
                    ],

                    "readwrite"

                );


            const store =
                transaction.objectStore(

                    ALON_MARKETPLACE_CONFIG
                        .mediaStore

                );


            const record = {

                id:
                    mediaId,

                advertisementId:
                    adId,

                type:
                    type,

                name:
                    file.name || "",

                mime:
                    file.type || "",

                size:
                    file.size || 0,

                blob:
                    file,

                createdAt:
                    new Date().toISOString()

            };


            const request =
                store.put(record);


            request.onsuccess =
                function() {

                    resolve(
                        mediaId
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }

    );

}


/* =========================================================
   GET MEDIA
   ========================================================= */

function marketplaceGetMedia(
    mediaId
) {

    return new Promise(

        function(resolve, reject) {

            if (
                !MARKETPLACE_DB ||
                !mediaId
            ) {

                resolve(null);

                return;

            }


            const transaction =
                MARKETPLACE_DB.transaction(

                    [
                        ALON_MARKETPLACE_CONFIG
                            .mediaStore
                    ],

                    "readonly"

                );


            const store =
                transaction.objectStore(

                    ALON_MARKETPLACE_CONFIG
                        .mediaStore

                );


            const request =
                store.get(mediaId);


            request.onsuccess =
                function() {

                    resolve(
                        request.result || null
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }

    );

}


/* =========================================================
   DELETE MEDIA
   ========================================================= */

function marketplaceDeleteMedia(
    mediaId
) {

    return new Promise(

        function(resolve) {

            if (
                !MARKETPLACE_DB ||
                !mediaId
            ) {

                resolve(false);

                return;

            }


            const transaction =
                MARKETPLACE_DB.transaction(

                    [
                        ALON_MARKETPLACE_CONFIG
                            .mediaStore
                    ],

                    "readwrite"

                );


            const store =
                transaction.objectStore(

                    ALON_MARKETPLACE_CONFIG
                        .mediaStore

                );


            const request =
                store.delete(
                    mediaId
                );


            request.onsuccess =
                function() {

                    resolve(true);

                };


            request.onerror =
                function() {

                    resolve(false);

                };

        }

    );

}


/* =========================================================
   DELETE AD MEDIA
   ========================================================= */

function marketplaceDeleteAdvertisementMedia(
    ad
) {

    if (
        !ad ||
        typeof ad !== "object"
    ) {

        return Promise.resolve([]);

    }


    const ids = [

        ...(Array.isArray(ad.imageIds)
            ? ad.imageIds
            : []),

        ad.videoId || null

    ]

        .filter(Boolean);


    return Promise.all(

        ids.map(

            function(id) {

                return marketplaceDeleteMedia(
                    id
                );

            }

        )

    );

}


/* =========================================================
   LOGIN / ACCOUNT
   ========================================================= */

function marketplaceGetAccount() {

    const account =
        marketplaceLoadJSON(

            ALON_MARKETPLACE_CONFIG
                .accountStorage,

            null

        );


    if (
        !account ||
        typeof account !== "object"
    ) {

        return {

            mobile: "",

            email: ""

        };

    }


    return {

        mobile:
            String(
                account.mobile || ""
            ).trim(),

        email:
            String(
                account.email || ""
            ).trim()
            .toLowerCase()

    };

}


function marketplaceGetSession() {

    const session =
        marketplaceLoadJSON(

            ALON_MARKETPLACE_CONFIG
                .sessionStorage,

            null

        );


    if (
        !session ||
        typeof session !== "object"
    ) {

        return null;

    }


    if (!session.active) {

        return null;

    }


    const email =
        String(
            session.email || ""
        )
            .trim()
            .toLowerCase();


    if (!email) {

        return null;

    }


    return {

        active:
            true,

        mobile:
            String(
                session.mobile || ""
            ).trim(),

        email:
            email,

        loginTime:
            session.loginTime || ""

    };

}


/* =========================================================
   UPDATE ACCOUNT UI
   ========================================================= */

function marketplaceUpdateAccountUI(
    statusMessage
) {

    const loginBox =
        document.getElementById(
            "marketplaceLoginBox"
        );


    const profileBox =
        document.getElementById(
            "marketplaceProfileBox"
        );


    const profileEmail =
        document.getElementById(
            "marketplaceProfileEmail"
        );


    const status =
        document.getElementById(
            "marketplaceLoginStatus"
        );


    if (
        MARKETPLACE_STATE.loggedIn
    ) {

        if (loginBox) {

            loginBox.style.display =
                "none";

        }


        if (profileBox) {

            profileBox.style.display =
                "block";

        }


        if (profileEmail) {

            profileEmail.textContent =

                MARKETPLACE_STATE
                    .account
                    .email ||

                MARKETPLACE_STATE
                    .account
                    .mobile ||

                "Marketplace User";

        }


        if (status) {

            status.textContent =
                "";

            status.classList.remove(
                "show"
            );

        }


        return;

    }


    if (loginBox) {

        loginBox.style.display =
            "block";

    }


    if (profileBox) {

        profileBox.style.display =
            "none";

    }


    if (
        statusMessage &&
        status
    ) {

        status.textContent =
            statusMessage;

        status.classList.add(
            "show"
        );


        window.setTimeout(

            function() {

                status.textContent =
                    "";

                status.classList.remove(
                    "show"
                );

            },

            2500

        );

    }

}


/* =========================================================
   LOGIN
   ---------------------------------------------------------
   Local browser session only.
   Password is never stored.
   ========================================================= */

function marketplaceLogin() {

    const mobileInput =
        document.getElementById(
            "marketplaceLoginMobile"
        );


    const emailInput =
        document.getElementById(
            "marketplaceLoginEmail"
        );


    const passwordInput =
        document.getElementById(
            "marketplaceLoginPassword"
        );


    const mobile =
        mobileInput
            ? String(
                mobileInput.value || ""
              ).trim()
            : "";


    const email =
        emailInput
            ? String(
                emailInput.value || ""
              )
                .trim()
                .toLowerCase()
            : "";


    const password =
        passwordInput
            ? String(
                passwordInput.value || ""
              )
            : "";


    if (!email) {

        marketplaceUpdateAccountUI(
            "Please enter your email."
        );

        return false;

    }


    if (
        !email.includes("@") ||
        !email.includes(".")
    ) {

        marketplaceUpdateAccountUI(
            "Please enter a valid email."
        );

        return false;

    }


    if (!password) {

        marketplaceUpdateAccountUI(
            "Please enter your password."
        );

        return false;

    }


    if (password.length < 4) {

        marketplaceUpdateAccountUI(
            "Password must contain at least 4 characters."
        );

        return false;

    }


    const account = {

        mobile:
            mobile,

        email:
            email,

        updatedAt:
            new Date().toISOString()

    };


    /*
     * Password is intentionally NOT stored.
     * This remains a local browser identity layer,
     * not server-side authentication.
     */

    marketplaceSaveJSON(

        ALON_MARKETPLACE_CONFIG
            .accountStorage,

        account

    );


    const sessionSaved =
        marketplaceSaveJSON(

            ALON_MARKETPLACE_CONFIG
                .sessionStorage,

            {

                active:
                    true,

                mobile:
                    mobile,

                email:
                    email,

                loginTime:
                    new Date().toISOString()

            }

        );


    if (!sessionSaved) {

        marketplaceUpdateAccountUI(
            "Login session could not be saved."
        );

        return false;

    }


    MARKETPLACE_STATE.loggedIn =
        true;


    MARKETPLACE_STATE.account = {

        mobile:
            mobile,

        email:
            email

    };


    if (passwordInput) {

        passwordInput.value =
            "";

    }


    marketplaceUpdateAccountUI();


    marketplaceRenderAdvertisements();


    return true;

}


/* =========================================================
   LOGOUT
   ========================================================= */

function marketplaceLogout() {

    marketplaceSaveJSON(

        ALON_MARKETPLACE_CONFIG
            .sessionStorage,

        {

            active:
                false

        }

    );


    MARKETPLACE_STATE.loggedIn =
        false;


    MARKETPLACE_STATE.account = {

        mobile: "",

        email: ""

    };


    MARKETPLACE_STATE
        .editingAdvertisementId =
        null;


    marketplaceUpdateAccountUI(
        "You have been logged out."
    );


    marketplaceRenderAdvertisements();

}


/* =========================================================
   RESTORE LOGIN
   ========================================================= */

function marketplaceRestoreLogin() {

    const session =
        marketplaceGetSession();


    const savedAccount =
        marketplaceGetAccount();


    if (
        session &&
        session.email
    ) {

        /*
         * Session must belong to the saved account.
         * This prevents a stale session from being
         * treated as another account.
         */

        if (

            savedAccount.email &&

            savedAccount.email !==
                session.email

        ) {

            marketplaceSaveJSON(

                ALON_MARKETPLACE_CONFIG
                    .sessionStorage,

                {

                    active:
                        false

                }

            );


            MARKETPLACE_STATE.loggedIn =
                false;


            MARKETPLACE_STATE.account =
                savedAccount;


            marketplaceUpdateAccountUI();

            return false;

        }


        MARKETPLACE_STATE.loggedIn =
            true;


        MARKETPLACE_STATE.account = {

            mobile:
                session.mobile ||
                savedAccount.mobile ||
                "",

            email:
                session.email

        };


        marketplaceUpdateAccountUI();


        return true;

    }


    MARKETPLACE_STATE.loggedIn =
        false;


    MARKETPLACE_STATE.account =
        savedAccount;


    marketplaceUpdateAccountUI();


    return false;

}


/* =========================================================
   LOGIN EVENTS
   ========================================================= */

function marketplaceBindLoginEvents() {

    const loginButton =
        document.getElementById(
            "marketplaceLoginButton"
        );


    if (loginButton) {

        loginButton.addEventListener(

            "click",

            function() {

                marketplaceLogin();

            }

        );

    }


    const logoutButton =
        document.getElementById(
            "marketplaceLogoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(

            "click",

            function() {

                marketplaceLogout();

            }

        );

    }


    const passwordInput =
        document.getElementById(
            "marketplaceLoginPassword"
        );


    if (passwordInput) {

        passwordInput.addEventListener(

            "keydown",

            function(event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    marketplaceLogin();

                }

            }

        );

    }

}


/* =========================================================
   REQUIRE LOGIN
   ========================================================= */

function marketplaceRequireLogin() {

    if (
        MARKETPLACE_STATE.loggedIn
    ) {

        return true;

    }


    marketplaceUpdateAccountUI(

        "Please login first to manage your advertisements."

    );


    const account =
        document.getElementById(
            "marketplaceAccount"
        );


    if (account) {

        account.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }


    return false;

}


/* =========================================================
   ADVERTISEMENT FORM
   ========================================================= */

function marketplaceGetAdvertisementForm() {

    function value(id) {

        const element =
            document.getElementById(
                id
            );


        return element

            ? String(
                element.value || ""
              ).trim()

            : "";

    }


    return {

        title:
            value("adTitle"),

        businessName:
            value("businessName"),

        category:
            value("adCategory"),

        description:
            value("adDescription"),

        country:
            value("adCountry")
                .toUpperCase(),

        state:
            value("adState"),

        city:
            value("adCity"),

        price:
            value("adPrice"),

        currency:
            value("adCurrency") ||
            ALON_MARKETPLACE_CONFIG
                .currency,

        offer:
            value("adOffer"),

        phone:
            value("adPhone"),

        email:
            value("adEmail")
                .toLowerCase(),

        website:
            value("adWebsite"),

        social:
            value("adSocial"),

        videoURL:
            value("adVideoURL")

    };

}


/* =========================================================
   FILE INPUTS
   ========================================================= */

function marketplaceGetAdvertisementFiles() {

    const imageInput =
        document.getElementById(
            "adImages"
        );


    const videoInput =
        document.getElementById(
            "adVideo"
        );


    return {

        images:

            imageInput &&
            imageInput.files

                ? Array.from(
                    imageInput.files
                  )

                : [],

        video:

            videoInput &&
            videoInput.files &&
            videoInput.files.length

                ? videoInput.files[0]

                : null

    };

}


/* =========================================================
   SAVE ADVERTISEMENT
   ========================================================= */

async function marketplaceSaveAdvertisement() {

    if (
        !marketplaceRequireLogin()
    ) {

        return null;

    }


    const form =
        marketplaceGetAdvertisementForm();


    if (!form.title) {

        alert(
            "Please enter an advertisement title."
        );

        return null;

    }


    const ads =
        MARKETPLACE_STATE
            .advertisements;


    let adId =
        MARKETPLACE_STATE
            .editingAdvertisementId;


    let existing =
        null;


    if (adId) {

        existing =
            ads.find(

                function(ad) {

                    return ad.id === adId;

                }

            ) || null;

    }


    /*
     * Editing permission.
     */

    if (
        existing &&
        existing.ownerEmail &&
        String(
            existing.ownerEmail
        ).toLowerCase() !==
        String(
            MARKETPLACE_STATE
                .account
                .email
        ).toLowerCase()
    ) {

        alert(
            "You can edit only your own advertisement."
        );

        return null;

    }


    if (!adId) {

        adId =
            marketplaceCreateId(
                "ad"
            );

    }


    const files =
        marketplaceGetAdvertisementFiles();


    const ad = {

        id:
            adId,

        title:
            form.title,

        businessName:
            form.businessName,

        category:
            form.category,

        description:
            form.description,

        country:
            form.country,

        state:
            form.state,

        city:
            form.city,

        price:
            form.price,

        currency:
            form.currency,

        offer:
            form.offer,

        phone:
            form.phone,

        email:
            form.email,

        website:
            marketplaceSafeURL(
                form.website
            ),

        social:
            marketplaceSafeURL(
                form.social
            ),

        videoURL:
            marketplaceSafeURL(
                form.videoURL
            ),

        imageIds:

            existing &&
            Array.isArray(
                existing.imageIds
            )

                ? [
                    ...existing.imageIds
                  ]

                : [],

        videoId:

            existing

                ? (
                    existing.videoId ||
                    null
                  )

                : null,

        ownerEmail:
            MARKETPLACE_STATE
                .account
                .email,

        ownerMobile:
            MARKETPLACE_STATE
                .account
                .mobile,

        createdAt:

            existing

                ? existing.createdAt

                : new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    /* ---------------------------------------------
       NEW IMAGES
       --------------------------------------------- */

    if (
        files.images.length &&
        MARKETPLACE_DB
    ) {

        for (
            const image of files.images
        ) {

            if (
                !image.type ||
                !image.type.startsWith(
                    "image/"
                )
            ) {

                continue;

            }


            const imageId =
                await marketplaceStoreMedia(

                    image,

                    adId,

                    "image"

                );


            if (imageId) {

                ad.imageIds.push(
                    imageId
                );

            }

        }

    }


    /* ---------------------------------------------
       VIDEO
       --------------------------------------------- */

    if (
        files.video &&
        MARKETPLACE_DB
    ) {

        if (ad.videoId) {

            await marketplaceDeleteMedia(
                ad.videoId
            );

        }


        if (
            files.video.type &&
            files.video.type.startsWith(
                "video/"
            )
        ) {

            ad.videoId =
                await marketplaceStoreMedia(

                    files.video,

                    adId,

                    "video"

                );

        }

    }


    /* ---------------------------------------------
       REPLACE / ADD
       --------------------------------------------- */

    if (existing) {

        const index =
            ads.findIndex(

                function(item) {

                    return item.id === adId;

                }

            );


        if (index !== -1) {

            ads[index] =
                ad;

        }

    } else {

        ads.push(
            ad
        );

    }


    MARKETPLACE_STATE
        .advertisements =
        ads;


    if (
        !marketplaceSaveData()
    ) {

        alert(
            "Advertisement could not be saved. Browser storage may be full."
        );

        return null;

    }


    MARKETPLACE_STATE
        .editingAdvertisementId =
        null;


    marketplaceClearAdvertisementForm();


    marketplaceRenderAdvertisements();


    alert(

        existing

            ? "Advertisement updated successfully."

            : "Advertisement saved successfully."

    );


    return ad;

}


/* =========================================================
   CLEAR FORM
   ========================================================= */

function marketplaceClearAdvertisementForm() {

    const form =
        document.getElementById(
            "advertisementForm"
        );


    if (form) {

        form.reset();

    }


    MARKETPLACE_STATE
        .editingAdvertisementId =
        null;


    const button =
        document.getElementById(
            "saveAdButton"
        );


    if (button) {

        button.textContent =
            "💾 Save Advertisement";

    }

}


/* =========================================================
   EDIT ADVERTISEMENT
   ========================================================= */

async function marketplaceEditAdvertisement(
    id
) {

    if (
        !marketplaceRequireLogin()
    ) {

        return;

    }


    const ad =
        MARKETPLACE_STATE
            .advertisements
            .find(

                function(item) {

                    return item.id === id;

                }

            );


    if (!ad) {

        return;

    }


    /*
     * Only the owner can edit.
     */

    if (

        ad.ownerEmail &&

        String(
            ad.ownerEmail
        ).toLowerCase() !==
        String(
            MARKETPLACE_STATE
                .account
                .email
        ).toLowerCase()

    ) {

        alert(
            "You can edit only your own advertisement."
        );

        return;

    }


    function setValue(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (element) {

            element.value =
                value || "";

        }

    }


    setValue(
        "adTitle",
        ad.title
    );


    setValue(
        "businessName",
        ad.businessName
    );


    setValue(
        "adCategory",
        ad.category
    );


    setValue(
        "adDescription",
        ad.description
    );


    setValue(
        "adCountry",
        ad.country
    );


    setValue(
        "adState",
        ad.state
    );


    setValue(
        "adCity",
        ad.city
    );


    setValue(
        "adPrice",
        ad.price
    );


    setValue(
        "adCurrency",
        ad.currency
    );


    setValue(
        "adOffer",
        ad.offer
    );


    setValue(
        "adPhone",
        ad.phone
    );


    setValue(
        "adEmail",
        ad.email
    );


    setValue(
        "adWebsite",
        ad.website
    );


    setValue(
        "adSocial",
        ad.social
    );


    setValue(
        "adVideoURL",
        ad.videoURL
    );


    MARKETPLACE_STATE
        .editingAdvertisementId =
        id;


    const saveButton =
        document.getElementById(
            "saveAdButton"
        );


    if (saveButton) {

        saveButton.textContent =
            "✏️ Update Advertisement";

    }


    const section =
        document.getElementById(
            "createAd"
        );


    if (section) {

        section.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }

}


/* =========================================================
   DELETE ADVERTISEMENT
   ========================================================= */

async function marketplaceDeleteAdvertisement(
    id
) {

    if (
        !marketplaceRequireLogin()
    ) {

        return;

    }


    const index =
        MARKETPLACE_STATE
            .advertisements
            .findIndex(

                function(ad) {

                    return ad.id === id;

                }

            );


    if (index === -1) {

        return;

    }


    const ad =
        MARKETPLACE_STATE
            .advertisements[index];


    if (

        ad.ownerEmail &&

        String(
            ad.ownerEmail
        ).toLowerCase() !==
        String(
            MARKETPLACE_STATE
                .account
                .email
        ).toLowerCase()

    ) {

        alert(
            "You can delete only your own advertisement."
        );

        return;

    }


    const confirmed =
        window.confirm(

            "Delete this advertisement?"

        );


    if (!confirmed) {

        return;

    }


    await marketplaceDeleteAdvertisementMedia(
        ad
    );


    MARKETPLACE_STATE
        .advertisements
        .splice(
            index,
            1
        );


    marketplaceSaveData();


    if (

        MARKETPLACE_STATE
            .editingAdvertisementId === id

    ) {

        marketplaceClearAdvertisementForm();

    }


    marketplaceRenderAdvertisements();

}


/* =========================================================
   PREVIEW
   ========================================================= */

async function marketplacePreviewAdvertisement(
    id
) {

    const ad =
        MARKETPLACE_STATE
            .advertisements
            .find(

                function(item) {

                    return item.id === id;

                }

            );


    if (!ad) {

        return;

    }


    let imageText = "";


    if (

        Array.isArray(
            ad.imageIds
        ) &&

        ad.imageIds.length

    ) {

        imageText =

            "\nImages: " +
            ad.imageIds.length;

    }


    const videoText =

        (

            ad.videoId ||
            ad.videoURL

        )

            ? "\nVideo: Available"

            : "";


    alert(

        ad.title +

        "\n\n" +

        (

            ad.businessName

                ? "Business: " +
                  ad.businessName +
                  "\n"

                : ""

        ) +

        (

            ad.description

                ? "\n" +
                  ad.description +
                  "\n"

                : ""

        ) +

        (

            ad.country

                ? "\nCountry: " +
                  marketplaceCountryName(
                      ad.country
                  )

                : ""

        ) +

        (

            ad.state

                ? "\nState: " +
                  ad.state

                : ""

        ) +

        (

            ad.city

                ? "\nCity: " +
                  ad.city

                : ""

        ) +

        (

            ad.price

                ? "\nPrice: " +
                  ad.currency +
                  " " +
                  ad.price

                : ""

        ) +

        (

            ad.offer

                ? "\nOffer: " +
                  ad.offer

                : ""

        ) +

        imageText +

        videoText

    );

}


/* =========================================================
   RENDER ADVERTISEMENTS
   ========================================================= */

function marketplaceRenderAdvertisements() {

    const container =
        document.getElementById(
            "myAdsList"
        );


    if (!container) {

        return;

    }


    let ads =
        MARKETPLACE_STATE
            .advertisements;


    /*
     * My Ads is private to the active local session.
     */

    if (
        MARKETPLACE_STATE.loggedIn
    ) {

        const email =
            String(
                MARKETPLACE_STATE
                    .account
                    .email || ""
            )
                .trim()
                .toLowerCase();


        ads =
            ads.filter(

                function(ad) {

                    /*
                     * Old ads without ownerEmail remain
                     * visible for compatibility.
                     */

                    return (

                        !ad.ownerEmail ||

                        String(
                            ad.ownerEmail
                        )
                            .trim()
                            .toLowerCase() ===
                        email

                    );

                }

            );

    } else {

        ads = [];

    }


    if (!ads.length) {

        container.innerHTML =

            MARKETPLACE_STATE.loggedIn

                ? "<div>No advertisements created yet.</div>"

                : "<div>Login to view and manage your advertisements.</div>";

        return;

    }


    container.innerHTML =
        "";


    ads.forEach(

        function(ad) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "ah-card marketplace-ad-card";


            const location = [

                marketplaceCountryName(
                    ad.country
                ),

                ad.state,

                ad.city

            ]

                .filter(Boolean)

                .join(
                    " • "
                );


            const mediaInfo =

                (

                    Array.isArray(
                        ad.imageIds
                    ) &&

                    ad.imageIds.length

                )

                    ?

                        "<p>🖼️ " +
                        ad.imageIds.length +
                        " image(s)</p>"

                    :

                        "";


            const videoInfo =

                (

                    ad.videoId ||
                    ad.videoURL

                )

                    ?

                        "<p>🎥 Video available</p>"

                    :

                        "";


            card.innerHTML = `

                <h3>
                    ${marketplaceEscapeHTML(
                        ad.title
                    )}
                </h3>


                ${
                    ad.businessName

                        ? `

                            <p>
                                <strong>
                                    Business:
                                </strong>

                                ${marketplaceEscapeHTML(
                                    ad.businessName
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    ad.category

                        ? `

                            <p>
                                <strong>
                                    Category:
                                </strong>

                                ${marketplaceEscapeHTML(
                                    ad.category
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    ad.description

                        ? `

                            <p>
                                ${marketplaceEscapeHTML(
                                    ad.description
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    location

                        ? `

                            <p>
                                <strong>
                                    📍
                                </strong>

                                ${marketplaceEscapeHTML(
                                    location
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    ad.price

                        ? `

                            <p>
                                <strong>
                                    💰
                                </strong>

                                ${marketplaceEscapeHTML(
                                    ad.currency
                                )}

                                ${marketplaceEscapeHTML(
                                    ad.price
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    ad.offer

                        ? `

                            <p>
                                <strong>
                                    Offer:
                                </strong>

                                ${marketplaceEscapeHTML(
                                    ad.offer
                                )}
                            </p>

                          `

                        : ""
                }


                ${mediaInfo}

                ${videoInfo}


                ${
                    ad.email

                        ? `

                            <p>
                                📧
                                ${marketplaceEscapeHTML(
                                    ad.email
                                )}
                            </p>

                          `

                        : ""
                }


                ${
                    ad.phone

                        ? `

                            <p>
                                📞
                                ${marketplaceEscapeHTML(
                                    ad.phone
                                )}
                            </p>

                          `

                        : ""
                }


                <div class="marketplace-ad-actions">

                    <button
                        type="button"
                        data-marketplace-edit-ad="${marketplaceEscapeHTML(
                            ad.id
                        )}"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        type="button"
                        data-marketplace-delete-ad="${marketplaceEscapeHTML(
                            ad.id
                        )}"
                    >
                        🗑️ Delete
                    </button>


                    <button
                        type="button"
                        data-marketplace-preview-ad="${marketplaceEscapeHTML(
                            ad.id
                        )}"
                    >
                        👁️ Preview
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }

    );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function marketplaceAddProduct(
    product
) {

    if (
        !product ||
        typeof product !== "object"
    ) {

        return null;

    }


    const item = {

        id:
            product.id ||
            marketplaceCreateId(
                "product"
            ),

        title:
            product.title ||
            product.name ||
            "Untitled Product",

        description:
            product.description ||
            "",

        category:
            product.category ||
            "General",

        price:
            product.price !== undefined
                ? product.price
                : "",

        currency:
            product.currency ||
            ALON_MARKETPLACE_CONFIG
                .currency,

        country:
            String(
                product.country ||
                MARKETPLACE_STATE
                    .selectedCountry ||
                ""
            ).toUpperCase(),

        image:
            product.image ||
            "",

        seller:
            product.seller ||
            "",

        phone:
            product.phone ||
            "",

        email:
            product.email ||
            "",

        url:
            marketplaceSafeURL(
                product.url ||
                ""
            ),

        createdAt:
            new Date().toISOString()

    };


    MARKETPLACE_STATE
        .products
        .push(
            item
        );


    marketplaceSaveData();

    marketplaceRenderAll();


    return item;

}


/* =========================================================
   JOBS
   ========================================================= */

function marketplaceAddJob(
    job
) {

    if (
        !job ||
        typeof job !== "object"
    ) {

        return null;

    }


    const item = {

        id:
            job.id ||
            marketplaceCreateId(
                "job"
            ),

        title:
            job.title ||
            job.position ||
            "Untitled Job",

        company:
            job.company ||
            "",

        description:
            job.description ||
            "",

        category:
            job.category ||
            "General",

        country:
            String(
                job.country ||
                MARKETPLACE_STATE
                    .selectedCountry ||
                ""
            ).toUpperCase(),

        city:
            job.city ||
            "",

        salary:
            job.salary ||
            "",

        type:
            job.type ||
            "Full Time",

        email:
            job.email ||
            "",

        phone:
            job.phone ||
            "",

        url:
            marketplaceSafeURL(
                job.url ||
                ""
            ),

        createdAt:
            new Date().toISOString()

    };


    MARKETPLACE_STATE
        .jobs
        .push(
            item
        );


    marketplaceSaveData();

    marketplaceRenderAll();


    return item;

}


/* =========================================================
   SERVICES
   ========================================================= */

function marketplaceAddService(
    service
) {

    if (
        !service ||
        typeof service !== "object"
    ) {

        return null;

    }


    const item = {

        id:
            service.id ||
            marketplaceCreateId(
                "service"
            ),

        title:
            service.title ||
            service.name ||
            "Untitled Service",

        description:
            service.description ||
            "",

        category:
            service.category ||
            "General",

        price:
            service.price !== undefined
                ? service.price
                : "",

        currency:
            service.currency ||
            ALON_MARKETPLACE_CONFIG
                .currency,

        country:
            String(
                service.country ||
                MARKETPLACE_STATE
                    .selectedCountry ||
                ""
            ).toUpperCase(),

        city:
            service.city ||
            "",

        provider:
            service.provider ||
            "",

        phone:
            service.phone ||
            "",

        email:
            service.email ||
            "",

        url:
            marketplaceSafeURL(
                service.url ||
                ""
            ),

        createdAt:
            new Date().toISOString()

    };


    MARKETPLACE_STATE
        .services
        .push(
            item
        );


    marketplaceSaveData();

    marketplaceRenderAll();


    return item;

}


/* =========================================================
   SEARCH
   ========================================================= */

function marketplaceSearch(
    text
) {

    MARKETPLACE_STATE.searchText =

        String(text || "")
            .trim()
            .toLowerCase();


    marketplaceRenderAll();

}


/* =========================================================
   CATEGORY
   ========================================================= */

function marketplaceSetCategory(
    category
) {

    MARKETPLACE_STATE.category =

        String(category || "")
            .trim()
            .toLowerCase();


    marketplaceRenderAll();

}


/* =========================================================
   COUNTRY
   ========================================================= */

function marketplaceSetCountry(
    country
) {

    MARKETPLACE_STATE.selectedCountry =

        String(country || "")
            .trim()
            .toUpperCase();


    marketplaceSaveJSON(

        ALON_MARKETPLACE_CONFIG
            .countryStorage,

        MARKETPLACE_STATE
            .selectedCountry

    );


    marketplaceRenderAll();

}


/* =========================================================
   FILTER
   ========================================================= */

function marketplaceFilterItem(
    item
) {

    if (
        !item ||
        typeof item !== "object"
    ) {

        return false;

    }


    const search =
        MARKETPLACE_STATE
            .searchText;


    const category =
        MARKETPLACE_STATE
            .category;


    const country =
        MARKETPLACE_STATE
            .selectedCountry;


    const searchable = [

        item.title,

        item.name,

        item.description,

        item.category,

        item.company,

        item.provider,

        item.seller,

        item.city,

        item.state,

        item.country,

        item.email,

        item.phone,

        item.salary,

        item.price

    ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();


    if (

        search &&

        !searchable.includes(
            search
        )

    ) {

        return false;

    }


    if (

        category &&

        String(
            item.category || ""
        )
            .trim()
            .toLowerCase() !==
        category

    ) {

        return false;

    }


    if (

        country &&

        String(
            item.country || ""
        )
            .trim()
            .toUpperCase() !==
        country

    ) {

        return false;

    }


    return true;

}


/* =========================================================
   FILTERED DATA
   ========================================================= */

function marketplaceGetProducts() {

    return MARKETPLACE_STATE
        .products
        .filter(
            marketplaceFilterItem
        );

}


function marketplaceGetJobs() {

    return MARKETPLACE_STATE
        .jobs
        .filter(
            marketplaceFilterItem
        );

}


function marketplaceGetServices() {

    return MARKETPLACE_STATE
        .services
        .filter(
            marketplaceFilterItem
        );

}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function marketplaceRenderProducts() {

    const container =
        document.getElementById(
            "productsList"
        );


    if (!container) {

        return;

    }


    const products =
        marketplaceGetProducts();


    if (!products.length) {

        container.innerHTML =
            "<div>No products available yet.</div>";

        return;

    }


    container.innerHTML =

        products.map(

            function(product) {

                return `

                    <article class="ah-card">

                        <h3>
                            ${marketplaceEscapeHTML(
                                product.title
                            )}
                        </h3>

                        <p>
                            ${marketplaceEscapeHTML(
                                product.description
                            )}
                        </p>

                        ${
                            product.price !== "" &&
                            product.price !== null &&
                            product.price !== undefined

                                ? `

                                    <strong>
                                        ${marketplaceEscapeHTML(
                                            product.currency
                                        )}

                                        ${marketplaceEscapeHTML(
                                            product.price
                                        )}
                                    </strong>

                                  `

                                : ""
                        }

                        <p>
                            ${marketplaceEscapeHTML(
                                marketplaceCountryName(
                                    product.country
                                )
                            )}
                        </p>

                    </article>

                `;

            }

        ).join("");

}


/* =========================================================
   RENDER JOBS
   ========================================================= */

function marketplaceRenderJobs() {

    const container =
        document.getElementById(
            "jobsList"
        );


    if (!container) {

        return;

    }


    const jobs =
        marketplaceGetJobs();


    if (!jobs.length) {

        container.innerHTML =
            "<div>No jobs available yet.</div>";

        return;

    }


    container.innerHTML =

        jobs.map(

            function(job) {

                return `

                    <article class="ah-card">

                        <h3>
                            ${marketplaceEscapeHTML(
                                job.title
                            )}
                        </h3>

                        ${
                            job.company

                                ? `

                                    <p>
                                        <strong>
                                            ${marketplaceEscapeHTML(
                                                job.company
                                            )}
                                        </strong>
                                    </p>

                                  `

                                : ""
                        }

                        <p>
                            ${marketplaceEscapeHTML(
                                job.description
                            )}
                        </p>

                        <p>
                            ${marketplaceEscapeHTML(
                                marketplaceCountryName(
                                    job.country
                                )
                            )}

                            ${
                                job.city

                                    ? " • " +
                                      marketplaceEscapeHTML(
                                          job.city
                                      )

                                    : ""
                            }

                        </p>

                    </article>

                `;

            }

        ).join("");

}


/* =========================================================
   RENDER SERVICES
   ========================================================= */

function marketplaceRenderServices() {

    const container =
        document.getElementById(
            "servicesList"
        );


    if (!container) {

        return;

    }


    const services =
        marketplaceGetServices();


    if (!services.length) {

        container.innerHTML =
            "<div>No services available yet.</div>";

        return;

    }


    container.innerHTML =

        services.map(

            function(service) {

                return `

                    <article class="ah-card">

                        <h3>
                            ${marketplaceEscapeHTML(
                                service.title
                            )}
                        </h3>

                        <p>
                            ${marketplaceEscapeHTML(
                                service.description
                            )}
                        </p>

                        ${
                            service.price !== "" &&
                            service.price !== null &&
                            service.price !== undefined

                                ? `

                                    <strong>
                                        ${marketplaceEscapeHTML(
                                            service.currency
                                        )}

                                        ${marketplaceEscapeHTML(
                                            service.price
                                        )}
                                    </strong>

                                  `

                                : ""
                        }

                        <p>
                            ${marketplaceEscapeHTML(
                                marketplaceCountryName(
                                    service.country
                                )
                            )}
                        </p>

                    </article>

                `;

            }

        ).join("");

}


/* =========================================================
   RENDER ALL
   ========================================================= */

function marketplaceRenderAll() {

    marketplaceRenderAdvertisements();

    marketplaceRenderProducts();

    marketplaceRenderJobs();

    marketplaceRenderServices();

}


/* =========================================================
   SEARCH EVENTS
   ========================================================= */

function marketplaceBindSearch() {

    const form =
        document.getElementById(
            "marketplaceSearchForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(

        "submit",

        function(event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "marketplaceSearch"
                );


            marketplaceSearch(

                input
                    ? input.value
                    : ""

            );

        }

    );

}


/* =========================================================
   COUNTRY EVENTS
   ========================================================= */

function marketplaceBindCountryEvents() {

    const country =
        document.getElementById(
            "country"
        );


    if (country) {

        country.addEventListener(

            "change",

            function() {

                marketplaceSetCountry(
                    this.value
                );

            }

        );

    }


    const adCountry =
        document.getElementById(
            "adCountry"
        );


    if (adCountry) {

        adCountry.addEventListener(

            "change",

            function() {

                const mainCountry =
                    document.getElementById(
                        "country"
                    );


                if (mainCountry) {

                    mainCountry.value =
                        this.value;

                }


                marketplaceSetCountry(
                    this.value
                );

            }

        );

    }

}


/* =========================================================
   CATEGORY EVENTS
   ========================================================= */

function marketplaceBindCategoryEvents() {

    const category =
        document.getElementById(
            "marketplaceCategory"
        );


    if (!category) {

        return;

    }


    category.addEventListener(

        "change",

        function() {

            marketplaceSetCategory(
                this.value
            );

        }

    );

}


/* =========================================================
   AD FORM EVENTS
   ========================================================= */

function marketplaceBindAdvertisementEvents() {

    const form =
        document.getElementById(
            "advertisementForm"
        );


    if (form) {

        form.addEventListener(

            "submit",

            async function(event) {

                event.preventDefault();

                await marketplaceSaveAdvertisement();

            }

        );


        form.addEventListener(

            "reset",

            function() {

                setTimeout(

                    function() {

                        MARKETPLACE_STATE
                            .editingAdvertisementId =
                            null;


                        const button =
                            document.getElementById(
                                "saveAdButton"
                            );


                        if (button) {

                            button.textContent =
                                "💾 Save Advertisement";

                        }

                    },

                    0

                );

            }

        );

    }


    const clearButton =
        document.getElementById(
            "clearAdButton"
        );


    if (clearButton) {

        clearButton.addEventListener(

            "click",

            function() {

                MARKETPLACE_STATE
                    .editingAdvertisementId =
                    null;

            }

        );

    }

}


/* =========================================================
   AD LIST EVENTS
   ========================================================= */

function marketplaceBindAdvertisementListEvents() {

    const container =
        document.getElementById(
            "myAdsList"
        );


    if (!container) {

        return;

    }


    container.addEventListener(

        "click",

        async function(event) {

            const target =
                event.target;


            const editButton =
                target.closest
                    ? target.closest(
                        "[data-marketplace-edit-ad]"
                    )
                    : null;


            const deleteButton =
                target.closest
                    ? target.closest(
                        "[data-marketplace-delete-ad]"
                    )
                    : null;


            const previewButton =
                target.closest
                    ? target.closest(
                        "[data-marketplace-preview-ad]"
                    )
                    : null;


            if (editButton) {

                await marketplaceEditAdvertisement(

                    editButton.dataset
                        .marketplaceEditAd

                );

                return;

            }


            if (deleteButton) {

                await marketplaceDeleteAdvertisement(

                    deleteButton.dataset
                        .marketplaceDeleteAd

                );

                return;

            }


            if (previewButton) {

                await marketplacePreviewAdvertisement(

                    previewButton.dataset
                        .marketplacePreviewAd

                );

            }

        }

    );

}


/* =========================================================
   SAVED COUNTRY
   ========================================================= */

function marketplaceLoadSavedCountry() {

    const saved =
        marketplaceLoadJSON(

            ALON_MARKETPLACE_CONFIG
                .countryStorage,

            ""

        );


    MARKETPLACE_STATE
        .selectedCountry =

        String(
            saved || ""
        )
            .trim()
            .toUpperCase();

}


/* =========================================================
   INITIALIZE
   ========================================================= */

async function marketplaceInit() {

    if (
        MARKETPLACE_STATE.initialized
    ) {

        return;

    }


    /* ---------------------------------------------
       LOAD DATA
       --------------------------------------------- */

    const data =
        marketplaceLoadData();


    MARKETPLACE_STATE.products =
        data.products;


    MARKETPLACE_STATE.jobs =
        data.jobs;


    MARKETPLACE_STATE.services =
        data.services;


    MARKETPLACE_STATE.advertisements =
        data.advertisements;


    /* ---------------------------------------------
       COUNTRY
       --------------------------------------------- */

    marketplaceLoadSavedCountry();


    /* ---------------------------------------------
       DATABASE
       --------------------------------------------- */

    try {

        await marketplaceOpenDatabase();

    } catch (error) {

        console.warn(

            "Marketplace media database unavailable. " +
            "Text data will still be saved.",

            error

        );

    }


    /* ---------------------------------------------
       COUNTRY SELECTORS
       --------------------------------------------- */

    marketplacePopulateCountrySelect(

        "#country",

        true

    );


    marketplacePopulateCountrySelect(

        "#adCountry",

        false

    );


    /* ---------------------------------------------
       RESTORE COUNTRY
       --------------------------------------------- */

    const country =
        document.getElementById(
            "country"
        );


    if (

        country &&

        MARKETPLACE_STATE
            .selectedCountry

    ) {

        const matchingOption =
            Array.from(
                country.options
            ).find(

                function(option) {

                    return (

                        String(
                            option.value
                        ).toUpperCase() ===
                        MARKETPLACE_STATE
                            .selectedCountry

                    );

                }

            );


        if (matchingOption) {

            country.value =
                matchingOption.value;

        }

    }


    const adCountry =
        document.getElementById(
            "adCountry"
        );


    if (

        adCountry &&

        MARKETPLACE_STATE
            .selectedCountry

    ) {

        const matchingAdOption =
            Array.from(
                adCountry.options
            ).find(

                function(option) {

                    return (

                        String(
                            option.value
                        ).toUpperCase() ===
                        MARKETPLACE_STATE
                            .selectedCountry

                    );

                }

            );


        if (matchingAdOption) {

            adCountry.value =
                matchingAdOption.value;

        }

    }


    /* ---------------------------------------------
       LOGIN
       --------------------------------------------- */

    marketplaceRestoreLogin();

    marketplaceBindLoginEvents();


    /* ---------------------------------------------
       EVENTS
       --------------------------------------------- */

    marketplaceBindSearch();

    marketplaceBindCountryEvents();

    marketplaceBindCategoryEvents();

    marketplaceBindAdvertisementEvents();

    marketplaceBindAdvertisementListEvents();


    /* ---------------------------------------------
       RENDER
       --------------------------------------------- */

    marketplaceRenderAll();


    MARKETPLACE_STATE.initialized =
        true;


    console.log(
        "ALON HISTORYVERSE 24 Global Marketplace loaded successfully."
    );

}


/* =========================================================
   AUTO START
   ========================================================= */

if (

    document.readyState ===
    "loading"

) {

    document.addEventListener(

        "DOMContentLoaded",

        function() {

            marketplaceInit();

        }

    );

} else {

    marketplaceInit();

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.ALON_MARKETPLACE = {

    init:
        marketplaceInit,

    login:
        marketplaceLogin,

    logout:
        marketplaceLogout,

    isLoggedIn:
        function() {

            return MARKETPLACE_STATE
                .loggedIn;

        },

    getAccount:
        function() {

            return {

                mobile:
                    MARKETPLACE_STATE
                        .account
                        .mobile,

                email:
                    MARKETPLACE_STATE
                        .account
                        .email

            };

        },

    saveAdvertisement:
        marketplaceSaveAdvertisement,

    editAdvertisement:
        marketplaceEditAdvertisement,

    deleteAdvertisement:
        marketplaceDeleteAdvertisement,

    previewAdvertisement:
        marketplacePreviewAdvertisement,

    addProduct:
        marketplaceAddProduct,

    addJob:
        marketplaceAddJob,

    addService:
        marketplaceAddService,

    search:
        marketplaceSearch,

    setCountry:
        marketplaceSetCountry,

    setCategory:
        marketplaceSetCategory,

    render:
        marketplaceRenderAll,

    getProducts:
        marketplaceGetProducts,

    getJobs:
        marketplaceGetJobs,

    getServices:
        marketplaceGetServices,

    getAdvertisements:
        function() {

            return MARKETPLACE_STATE
                .advertisements;

        }

};