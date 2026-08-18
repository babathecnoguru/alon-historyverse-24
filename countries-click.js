/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/countries-click.js

   COUNTRY CARD / FULL LINE CLICK ENGINE
   Creator / Owner: Baba Thecno Guru

   PURPOSE:
   - पूरी country card clickable
   - mouse click support
   - touch/mobile support
   - keyboard Enter / Space support
   - dynamically created cards support
   - existing countries.html के साथ compatible
   - कोई inline HTML dependency नहीं
========================================================= */


/* =========================================================
   GLOBAL CONFIG
========================================================= */

const ALON_COUNTRIES_CLICK_CONFIG = {

    version:
        "ALON-HV24-COUNTRIES-CLICK-100",

    cardSelector:
        ".country-card",

    countryAttribute:
        "data-country",

    defaultPage:
        "./countries.html",

    parameter:
        "country"

};


/* =========================================================
   SAFE COUNTRY VALUE
========================================================= */

function getCountryFromCard(card) {

    if (!card) {
        return "";
    }


    const value =
        card.getAttribute(
            ALON_COUNTRIES_CLICK_CONFIG
                .countryAttribute
        );


    if (!value) {
        return "";
    }


    return String(value)
        .trim();

}


/* =========================================================
   OPEN COUNTRY
========================================================= */

function openCountry(card) {

    const country =
        getCountryFromCard(card);


    if (!country) {

        console.warn(
            "ALON HISTORYVERSE 24: country value missing.",
            card
        );

        return;

    }


    /*
       If the HTML already contains a real href,
       use that href.

       This keeps the engine compatible with
       future country-detail pages.
    */

    const existingHref =
        card.getAttribute(
            "href"
        );


    if (
        existingHref &&
        existingHref !== "#" &&
        existingHref.trim() !== ""
    ) {

        window.location.href =
            existingHref;

        return;

    }


    /*
       Fallback:
       countries.html?country=...
    */

    const url =
        new URL(
            ALON_COUNTRIES_CLICK_CONFIG
                .defaultPage,
            window.location.href
        );


    url.searchParams.set(
        ALON_COUNTRIES_CLICK_CONFIG
            .parameter,
        country
    );


    window.location.href =
        url.href;

}


/* =========================================================
   MAKE CARD FULLY CLICKABLE
========================================================= */

function prepareCountryCard(card) {

    if (!card) {
        return;
    }


    /*
       Prevent duplicate initialization.
    */

    if (
        card.dataset
            .alonCountryClickReady ===
        "true"
    ) {

        return;

    }


    card.dataset
        .alonCountryClickReady =
        "true";


    /*
       Accessibility
    */

    if (
        !card.hasAttribute(
            "role"
        )
    ) {

        card.setAttribute(
            "role",
            "link"
        );

    }


    if (
        !card.hasAttribute(
            "tabindex"
        )
    ) {

        card.setAttribute(
            "tabindex",
            "0"
        );

    }


    /*
       Cursor support through JS.
       CSS can override this later.
    */

    card.style.cursor =
        "pointer";


    /* =====================================================
       MOUSE / TOUCH CLICK
    ====================================================== */

    card.addEventListener(
        "click",
        function (event) {

            /*
               Don't interfere with actual
               buttons, inputs or links placed
               inside a card in future.
            */

            const interactive =
                event.target.closest(
                    "button, input, select, textarea"
                );


            if (
                interactive &&
                interactive !== card
            ) {

                return;

            }


            /*
               Existing <a class="country-card">
               already has native navigation.

               In that case we don't need
               another navigation event.
            */

            if (
                card.tagName
                    .toLowerCase() ===
                "a"
            ) {

                return;

            }


            event.preventDefault();

            openCountry(
                card
            );

        }
    );


    /* =====================================================
       KEYBOARD
    ====================================================== */

    card.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {

                return;

            }


            event.preventDefault();


            openCountry(
                card
            );

        }
    );

}


/* =========================================================
   FIND ALL COUNTRY CARDS
========================================================= */

function initializeCountryCards() {

    const cards =
        document.querySelectorAll(
            ALON_COUNTRIES_CLICK_CONFIG
                .cardSelector
        );


    if (!cards.length) {

        return;

    }


    cards.forEach(
        function (card) {

            prepareCountryCard(
                card
            );

        }
    );

}


/* =========================================================
   DYNAMIC CONTENT OBSERVER
========================================================= */

/*
   अगर countries.js बाद में नई cards बनाता है,
   तो यह engine उन्हें भी automatically
   clickable बनाएगा.
*/

function observeCountryCards() {

    if (
        typeof MutationObserver ===
        "undefined"
    ) {

        return;

    }


    const observer =
        new MutationObserver(
            function (mutations) {

                let shouldScan =
                    false;


                mutations.forEach(
                    function (mutation) {

                        if (
                            mutation.addedNodes &&
                            mutation.addedNodes.length
                        ) {

                            shouldScan =
                                true;

                        }

                    }
                );


                if (shouldScan) {

                    initializeCountryCards();

                }

            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

}


/* =========================================================
   PUBLIC INITIALIZER
========================================================= */

function initCountriesClick() {

    initializeCountryCards();

    observeCountryCards();

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initCountriesClick,
        {
            once: true
        }
    );

} else {

    initCountriesClick();

}


/* =========================================================
   GLOBAL API
========================================================= */

window.ALON_HISTORYVERSE_COUNTRIES_CLICK = {

    version:
        ALON_COUNTRIES_CLICK_CONFIG
            .version,

    init:
        initCountriesClick,

    refresh:
        initializeCountryCards,

    open:
        openCountry

};


/* =========================================================
   END OF COUNTRIES CLICK ENGINE
========================================================= */