/* =========================================================
   ALON HISTORYVERSE 24
   COUNTRIES CLICK ENGINE
   Creator: Baba Thecno Guru
   Version: 24.1
   File: jss/countries-click.js

   FEATURES
   ---------------------------------------------------------
   • Country card click
   • Country row click
   • Country box click
   • Country link normalization
   • Country search
   • Country slug support
   • Country code / name support
   • Central country database compatibility
   • Keyboard accessibility
   • Dynamic country elements support
   • Duplicate event protection
   • Mobile-friendly
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ALON_COUNTRIES_CLICK_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "24.1",

    countryPage:
        "./country.html",

    countriesPage:
        "./countries.html"

};


/* =========================================================
   SAFE TEXT
   ========================================================= */

function countriesClickEscapeHTML(
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
   COUNTRY VALUE NORMALIZER
   ========================================================= */

function normalizeCountryValue(
    country
) {

    return String(
        country || ""
    )
        .trim();

}


/* =========================================================
   CREATE COUNTRY URL
   ========================================================= */

function getCountryClickURL(
    country
) {

    const value =
        normalizeCountryValue(
            country
        );


    if (!value) {

        return (
            ALON_COUNTRIES_CLICK_CONFIG
                .countriesPage
        );

    }


    return (
        ALON_COUNTRIES_CLICK_CONFIG
            .countryPage +

        "?country=" +

        encodeURIComponent(
            value
        )
    );

}


/* =========================================================
   COUNTRY SLUG
   ========================================================= */

function countryNameToSlug(
    name
) {

    return String(
        name || ""
    )

        .trim()

        .toLowerCase()

        .replace(
            /&/g,
            "and"
        )

        .replace(
            /[^a-z0-9]+/g,
            "-"
        )

        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =========================================================
   FIND COUNTRY DATABASE
   ---------------------------------------------------------
   Supports the central country file without forcing
   a specific variable name.
   ========================================================= */

function getCountriesClickDatabase() {

    const candidates = [];


    /*
     * Global window variables.
     */

    if (
        Array.isArray(
            window.MARKETPLACE_COUNTRIES
        )
    ) {

        candidates.push(
            window.MARKETPLACE_COUNTRIES
        );

    }


    if (
        Array.isArray(
            window.ALON_WORLD_COUNTRIES
        )
    ) {

        candidates.push(
            window.ALON_WORLD_COUNTRIES
        );

    }


    if (
        Array.isArray(
            window.WORLD_COUNTRIES
        )
    ) {

        candidates.push(
            window.WORLD_COUNTRIES
        );

    }


    if (
        Array.isArray(
            window.ALON_MARKETPLACE_COUNTRIES
        )
    ) {

        candidates.push(
            window.ALON_MARKETPLACE_COUNTRIES
        );

    }


    /*
     * Global lexical variables.
     * Safe typeof checks prevent ReferenceError.
     */

    if (
        typeof MARKETPLACE_COUNTRIES !==
        "undefined" &&

        Array.isArray(
            MARKETPLACE_COUNTRIES
        )
    ) {

        candidates.push(
            MARKETPLACE_COUNTRIES
        );

    }


    if (
        typeof ALON_WORLD_COUNTRIES !==
        "undefined" &&

        Array.isArray(
            ALON_WORLD_COUNTRIES
        )
    ) {

        candidates.push(
            ALON_WORLD_COUNTRIES
        );

    }


    if (
        typeof WORLD_COUNTRIES !==
        "undefined" &&

        Array.isArray(
            WORLD_COUNTRIES
        )
    ) {

        candidates.push(
            WORLD_COUNTRIES
        );

    }


    /*
     * Return first valid database.
     */

    for (
        let index = 0;
        index < candidates.length;
        index++
    ) {

        if (
            candidates[index].length
        ) {

            return candidates[index];

        }

    }


    return [];

}


/* =========================================================
   COUNTRY CODE
   ========================================================= */

function getCountryCode(
    country
) {

    if (
        !country ||
        typeof country !== "object"
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

function getCountryName(
    country
) {

    if (
        !country ||
        typeof country !== "object"
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

    )
        .trim();

}


/* =========================================================
   FIND COUNTRY RECORD
   ========================================================= */

function findCountryRecord(
    value
) {

    const target =
        normalizeCountryValue(
            value
        );


    if (!target) {

        return null;

    }


    const upperTarget =
        target.toUpperCase();


    const database =
        getCountriesClickDatabase();


    return database.find(

        function(country) {

            const code =
                getCountryCode(
                    country
                );


            const name =
                getCountryName(
                    country
                );


            return (

                code ===
                upperTarget ||

                name.toLowerCase() ===
                target.toLowerCase()

            );

        }

    ) || null;

}


/* =========================================================
   COUNTRY CANONICAL VALUE
   ========================================================= */

function getCanonicalCountryValue(
    value
) {

    const target =
        normalizeCountryValue(
            value
        );


    if (!target) {

        return "";

    }


    const record =
        findCountryRecord(
            target
        );


    if (!record) {

        return target;

    }


    return (

        getCountryCode(
            record
        ) ||

        getCountryName(
            record
        ) ||

        target

    );

}


/* =========================================================
   FIND COUNTRY FROM ELEMENT
   ========================================================= */

function getCountryFromElement(
    element
) {

    if (!element) {

        return "";

    }


    /*
     * Preferred:
     * data-country="India"
     */

    if (
        element.dataset &&
        element.dataset.country
    ) {

        return (
            element.dataset.country
        );

    }


    /*
     * Country code:
     * data-country-code="IN"
     */

    if (
        element.dataset &&
        element.dataset.countryCode
    ) {

        return (
            element.dataset.countryCode
        );

    }


    /*
     * Alternative:
     * data-country-id="india"
     */

    if (
        element.dataset &&
        element.dataset.countryId
    ) {

        return (
            element.dataset.countryId
        );

    }


    /*
     * Alternative:
     * data-country-name="India"
     */

    if (
        element.dataset &&
        element.dataset.countryName
    ) {

        return (
            element.dataset.countryName
        );

    }


    /*
     * Open-country attribute.
     */

    if (
        element.dataset &&
        element.dataset.openCountry
    ) {

        return (
            element.dataset.openCountry
        );

    }


    /*
     * Try child element.
     */

    const child =
        element.querySelector(

            "[data-country], " +
            "[data-country-code], " +
            "[data-country-id], " +
            "[data-country-name], " +
            "[data-open-country]"

        );


    if (child) {

        return (

            child.dataset.country ||

            child.dataset.countryCode ||

            child.dataset.countryId ||

            child.dataset.countryName ||

            child.dataset.openCountry ||

            ""

        );

    }


    /*
     * Try link href.
     */

    const link =
        element.matches("a")

            ? element

            : element.querySelector(
                "a"
            );


    if (link) {

        const href =
            link.getAttribute(
                "href"
            );


        if (href) {

            try {

                const url =
                    new URL(
                        href,
                        window.location.href
                    );


                const country =
                    url.searchParams.get(
                        "country"
                    );


                if (country) {

                    return country;

                }

            } catch {

                /*
                 * Ignore invalid URL.
                 */

            }

        }

    }


    return "";

}


/* =========================================================
   NAVIGATE TO COUNTRY
   ========================================================= */

function openCountry(
    country
) {

    const value =
        normalizeCountryValue(
            country
        );


    if (!value) {

        return false;

    }


    window.location.href =
        getCountryClickURL(
            value
        );


    return true;

}


/* =========================================================
   MAKE ELEMENT CLICKABLE
   ========================================================= */

function makeCountryClickable(
    element
) {

    if (!element) {

        return;

    }


    /*
     * Prevent duplicate event binding.
     */

    if (
        element.dataset
            .alonCountryClickReady ===
        "true"
    ) {

        return;

    }


    const country =
        getCountryFromElement(
            element
        );


    if (!country) {

        return;

    }


    /*
     * Store normalized data.
     */

    element.dataset.country =
        country;


    element.dataset.countrySlug =
        countryNameToSlug(
            country
        );


    /*
     * Accessibility.
     */

    element.style.cursor =
        "pointer";


    if (
        !element.hasAttribute(
            "tabindex"
        )
    ) {

        element.setAttribute(
            "tabindex",
            "0"
        );

    }


    element.setAttribute(
        "role",
        element.getAttribute(
            "role"
        ) || "link"
    );


    /*
     * Mark as initialized.
     */

    element.dataset
        .alonCountryClickReady =
        "true";


    /*
     * Click event.
     */

    element.addEventListener(

        "click",

        function(event) {

            /*
             * Do not interfere with
             * controls inside the card.
             */

            if (
                event.target.closest(
                    "button, input, select, textarea"
                )
            ) {

                return;

            }


            /*
             * Existing links should keep
             * their normal navigation.
             */

            if (
                event.target.closest(
                    "a"
                )
            ) {

                return;

            }


            event.preventDefault();

            openCountry(
                country
            );

        }

    );


    /*
     * Keyboard support.
     */

    element.addEventListener(

        "keydown",

        function(event) {

            if (

                event.key ===
                    "Enter" ||

                event.key ===
                    " "

            ) {

                if (
                    event.target.closest(
                        "button, input, select, textarea, a"
                    )
                ) {

                    return;

                }


                event.preventDefault();


                openCountry(
                    country
                );

            }

        }

    );

}


/* =========================================================
   INITIALIZE COUNTRY CARDS
   ========================================================= */

function initializeCountryCards() {

    const selectors = [

        "[data-country]",

        "[data-country-code]",

        "[data-country-id]",

        "[data-country-name]",

        "[data-open-country]",

        ".country-card",

        ".country-item",

        ".country-row",

        ".country-box",

        ".country"

    ];


    const elements =
        new Set();


    selectors.forEach(

        function(selector) {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(

                    function(element) {

                        elements.add(
                            element
                        );

                    }

                );

        }

    );


    elements.forEach(

        function(element) {

            makeCountryClickable(
                element
            );

        }

    );

}


/* =========================================================
   LINK NORMALIZATION
   ========================================================= */

function normalizeCountryLinks() {

    const links =
        document.querySelectorAll(

            "a[data-country], " +
            "a[data-country-code], " +
            "a[data-country-id], " +
            "a[data-country-name], " +
            "a[data-open-country]"

        );


    links.forEach(

        function(link) {

            const country =
                getCountryFromElement(
                    link
                );


            if (!country) {

                return;

            }


            link.setAttribute(

                "href",

                getCountryClickURL(
                    country
                )

            );

        }

    );

}


/* =========================================================
   COUNTRY SEARCH
   ========================================================= */

function filterCountryCards(
    query
) {

    const search =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();


    const cards =
        document.querySelectorAll(

            "[data-country], " +
            "[data-country-id], " +
            "[data-country-name], " +
            ".country-card, " +
            ".country-item, " +
            ".country-row, " +
            ".country-box"

        );


    cards.forEach(

        function(card) {

            const country =
                getCountryFromElement(
                    card
                );


            const text =
                String(
                    card.textContent ||
                    ""
                )
                    .toLowerCase();


            const matches =

                !search ||

                country
                    .toLowerCase()
                    .includes(
                        search
                    ) ||

                text.includes(
                    search
                );


            card.hidden =
                !matches;

        }

    );

}


/* =========================================================
   COUNTRY SEARCH INPUT
   ========================================================= */

function setupCountrySearch() {

    const searchInput =

        document.getElementById(
            "countrySearch"
        ) ||

        document.querySelector(
            "[data-country-search]"
        );


    if (!searchInput) {

        return;

    }


    if (
        searchInput.dataset
            .alonCountrySearchReady ===
        "true"
    ) {

        return;

    }


    searchInput.dataset
        .alonCountrySearchReady =
        "true";


    searchInput.addEventListener(

        "input",

        function() {

            filterCountryCards(
                searchInput.value
            );

        }

    );

}


/* =========================================================
   URL COUNTRY SUPPORT
   ========================================================= */

function getCurrentCountry() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return (

        params.get(
            "country"
        ) ||

        ""

    );

}


/* =========================================================
   COUNTRY CARD AUTO-LINK
   ========================================================= */

function addCountryLinksToCards() {

    const cards =
        document.querySelectorAll(

            ".country-card, " +
            ".country-item, " +
            ".country-box, " +
            ".country-row"

        );


    cards.forEach(

        function(card) {

            /*
             * Do not modify cards which
             * already contain an anchor.
             */

            if (
                card.querySelector(
                    "a"
                )
            ) {

                return;

            }


            const country =
                getCountryFromElement(
                    card
                );


            if (!country) {

                return;

            }


            /*
             * Store URL for other
             * ALON engines.
             */

            card.dataset.href =
                getCountryClickURL(
                    country
                );

        }

    );

}


/* =========================================================
   COUNTRY DATA ATTRIBUTE HELPER
   ========================================================= */

function setCountryData(
    element,
    country
) {

    if (
        !element ||
        !country
    ) {

        return false;

    }


    const value =
        normalizeCountryValue(
            country
        );


    element.dataset.country =
        value;


    element.dataset.countrySlug =
        countryNameToSlug(
            value
        );


    const record =
        findCountryRecord(
            value
        );


    if (record) {

        const code =
            getCountryCode(
                record
            );


        const name =
            getCountryName(
                record
            );


        if (code) {

            element.dataset.countryCode =
                code;

        }


        if (name) {

            element.dataset.countryName =
                name;

        }

    }


    return true;

}


/* =========================================================
   COUNTRY EVENT DELEGATION
   ========================================================= */

function setupCountryDelegation() {

    if (
        document.documentElement.dataset
            .alonCountryDelegationReady ===
        "true"
    ) {

        return;

    }


    document.documentElement.dataset
        .alonCountryDelegationReady =
        "true";


    document.addEventListener(

        "click",

        function(event) {

            const target =
                event.target.closest(
                    "[data-open-country]"
                );


            if (!target) {

                return;

            }


            if (
                event.target.closest(
                    "button, input, select, textarea"
                )
            ) {

                return;

            }


            const country =
                target.dataset.openCountry;


            if (!country) {

                return;

            }


            event.preventDefault();


            openCountry(
                country
            );

        }

    );

}


/* =========================================================
   DYNAMIC COUNTRY OBSERVER
   ---------------------------------------------------------
   Supports country cards added later by JavaScript.
   ========================================================= */

function setupCountryMutationObserver() {

    if (
        typeof MutationObserver ===
        "undefined"
    ) {

        return;

    }


    if (
        document.documentElement.dataset
            .alonCountryObserverReady ===
        "true"
    ) {

        return;

    }


    document.documentElement.dataset
        .alonCountryObserverReady =
        "true";


    const observer =
        new MutationObserver(

            function(mutations) {

                let hasNewContent =
                    false;


                mutations.forEach(

                    function(mutation) {

                        if (
                            mutation.addedNodes &&
                            mutation.addedNodes.length
                        ) {

                            hasNewContent =
                                true;

                        }

                    }

                );


                if (!hasNewContent) {

                    return;

                }


                initializeCountryCards();

                normalizeCountryLinks();

                addCountryLinksToCards();

            }

        );


    observer.observe(

        document.body,

        {

            childList:
                true,

            subtree:
                true

        }

    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeCountriesClick() {

    initializeCountryCards();

    normalizeCountryLinks();

    addCountryLinksToCards();

    setupCountrySearch();

    setupCountryDelegation();

    setupCountryMutationObserver();

}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.ALON_COUNTRIES_CLICK = {

    config:
        ALON_COUNTRIES_CLICK_CONFIG,

    url:
        getCountryClickURL,

    slug:
        countryNameToSlug,

    getCountry:
        getCountryFromElement,

    findCountry:
        findCountryRecord,

    canonical:
        getCanonicalCountryValue,

    database:
        getCountriesClickDatabase,

    open:
        openCountry,

    filter:
        filterCountryCards,

    setData:
        setCountryData,

    initialize:
        initializeCountriesClick

};


/* =========================================================
   AUTO INITIALIZATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        initializeCountriesClick

    );

} else {

    initializeCountriesClick();

}


/* =========================================================
   END OF COUNTRIES-CLICK.JS
   ALON HISTORYVERSE 24
   ========================================================= */