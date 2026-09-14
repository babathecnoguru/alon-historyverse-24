/* =========================================================
   ALON HISTORYVERSE 24
   COUNTRIES CLICK ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/countries-click.js
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
        "24.0",

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
   CREATE COUNTRY URL
   ========================================================= */

function getCountryClickURL(
    country
) {

    if (!country) {

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
            String(country)
                .trim()
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

        return element.dataset.country;

    }


    /*
     * Alternative:
     * data-country-id="india"
     */

    if (
        element.dataset &&
        element.dataset.countryId
    ) {

        return element.dataset.countryId;

    }


    /*
     * Alternative:
     * data-country-name="India"
     */

    if (
        element.dataset &&
        element.dataset.countryName
    ) {

        return element.dataset.countryName;

    }


    /*
     * Try child element.
     */

    const child =
        element.querySelector(
            "[data-country], [data-country-id], [data-country-name]"
        );

    if (child) {

        return (
            child.dataset.country ||
            child.dataset.countryId ||
            child.dataset.countryName ||
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

                /* Ignore invalid URL. */

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

    if (!country) {

        return false;

    }

    window.location.href =
        getCountryClickURL(
            country
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


    /*
     * Visual accessibility.
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


    /*
     * Click event.
     */

    element.addEventListener(
        "click",
        function (event) {

            /*
             * Do not interfere with
             * buttons, forms or existing
             * links inside the card.
             */

            if (
                event.target.closest(
                    "button, input, select, textarea"
                )
            ) {

                return;

            }


            /*
             * If the clicked target is
             * already a country link,
             * allow its normal behavior.
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
        function (event) {

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

        "[data-country-id]",

        "[data-country-name]",

        ".country-card",

        ".country-item",

        ".country-row",

        ".country-box",

        ".country"

    ];


    const elements =
        new Set();


    selectors.forEach(
        function (selector) {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    function (element) {

                        elements.add(
                            element
                        );

                    }
                );

        }
    );


    elements.forEach(
        function (element) {

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
            "a[data-country], a[data-country-id], a[data-country-name]"
        );

    links.forEach(
        function (link) {

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
            "[data-country], .country-card, .country-item, .country-row"
        );


    cards.forEach(
        function (card) {

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


    searchInput.addEventListener(
        "input",
        function () {

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
            ".country-card, .country-item, .country-box"
        );


    cards.forEach(
        function (card) {

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

    if (!element || !country) {

        return false;

    }

    element.dataset.country =
        String(country);

    element.dataset.countrySlug =
        countryNameToSlug(
            country
        );

    return true;

}


/* =========================================================
   COUNTRY EVENT DELEGATION
   ========================================================= */

function setupCountryDelegation() {

    document.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "[data-open-country]"
                );

            if (!target) {

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
   INITIALIZE
   ========================================================= */

function initializeCountriesClick() {

    initializeCountryCards();

    normalizeCountryLinks();

    addCountryLinksToCards();

    setupCountrySearch();

    setupCountryDelegation();

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