/* =========================================================
   ALON HISTORYVERSE 24
   COUNTRY ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/country.js
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ALON_COUNTRY_CONFIG = {

    project:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "24.0",

    dataPath:
        "../json/countries.json",

    countriesPage:
        "./countries.html",

    countryPage:
        "./country.html",

    heritagePage:
        "./heritage.html",

    timelinePage:
        "./timeline.html",

    homePage:
        "../index.html"

};


/* =========================================================
   STATE
   ========================================================= */

let ALON_COUNTRY_DATA = [];

let ALON_CURRENT_COUNTRY = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

function countryGetElement(
    selector
) {

    if (!selector) {

        return null;

    }

    if (
        selector.startsWith("#")
    ) {

        return document.getElementById(
            selector.substring(1)
        );

    }

    return document.querySelector(
        selector
    );

}


function countryGetElements(
    selector
) {

    if (!selector) {

        return [];

    }

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function countryEscapeHTML(
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
   ARRAY HELPER
   ========================================================= */

function countryArray(
    value
) {

    if (
        Array.isArray(value)
    ) {

        return value;

    }

    if (
        typeof value ===
        "string" &&
        value.trim()
    ) {

        return [
            value
        ];

    }

    return [];

}


/* =========================================================
   URL HELPERS
   ========================================================= */

function getCountryParameter() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get(
            "country"
        ) ||
        params.get(
            "id"
        ) ||
        ""
    ).trim();

}


function countrySlug(
    value
) {

    return String(
        value || ""
    )

        .toLowerCase()

        .trim()

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
   COUNTRY MATCHING
   ========================================================= */

function findCountry(
    query
) {

    const search =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();

    if (!search) {

        return null;

    }


    return (
        ALON_COUNTRY_DATA.find(
            function (country) {

                const id =
                    String(
                        country.id ||
                        ""
                    )
                        .toLowerCase();

                const name =
                    String(
                        country.name ||
                        ""
                    )
                        .toLowerCase();

                const nativeName =
                    String(
                        country.nativeName ||
                        ""
                    )
                        .toLowerCase();

                const slug =
                    countrySlug(
                        country.name
                    );


                return (

                    search === id ||

                    search === name ||

                    search === nativeName ||

                    search === slug

                );

            }
        ) ||
        null
    );

}


/* =========================================================
   LOAD JSON DATA
   ========================================================= */

async function loadCountryData() {

    try {

        const response =
            await fetch(
                ALON_COUNTRY_CONFIG.dataPath,
                {
                    cache:
                        "no-cache"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Country data request failed: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (
            Array.isArray(
                data
            )
        ) {

            ALON_COUNTRY_DATA =
                data;

        } else if (
            Array.isArray(
                data.countries
            )
        ) {

            ALON_COUNTRY_DATA =
                data.countries;

        } else {

            throw new Error(
                "Invalid countries.json format."
            );

        }


        return ALON_COUNTRY_DATA;

    } catch (error) {

        console.error(
            "Country data loading error:",
            error
        );

        showCountryError(
            "Country database could not be loaded."
        );

        return [];

    }

}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function showCountryError(
    message
) {

    const containers = [

        "#countryError",

        "#countryContent",

        "#countryDetails",

        "#countryPage"

    ];


    for (
        const selector of containers
    ) {

        const element =
            countryGetElement(
                selector
            );

        if (element) {

            element.innerHTML = `

                <div class="country-error">

                    <h2>
                        Country Information Unavailable
                    </h2>

                    <p>
                        ${countryEscapeHTML(
                            message
                        )}
                    </p>

                    <a
                        href="${ALON_COUNTRY_CONFIG.countriesPage}"
                    >
                        ← Back to Countries
                    </a>

                </div>

            `;

            return;

        }

    }

}


/* =========================================================
   COUNTRY HEADER
   ========================================================= */

function renderCountryHeader(
    country
) {

    const container =
        countryGetElement(
            "#countryHeader"
        ) ||
        countryGetElement(
            ".country-header"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="country-flag">

            ${
                country.flag
                    ? countryEscapeHTML(
                        country.flag
                    )
                    : "🌍"
            }

        </div>

        <div class="country-header-text">

            <span class="country-label">
                COUNTRY
            </span>

            <h1>
                ${countryEscapeHTML(
                    country.name
                )}
            </h1>

            ${
                country.officialName
                    ? `
                        <p>
                            ${countryEscapeHTML(
                                country.officialName
                            )}
                        </p>
                    `
                    : ""
            }

        </div>

    `;

}


/* =========================================================
   BASIC FACTS
   ========================================================= */

function renderCountryFacts(
    country
) {

    const container =
        countryGetElement(
            "#countryFacts"
        ) ||
        countryGetElement(
            ".country-facts"
        );


    if (!container) {

        return;

    }


    const facts = [

        [
            "Capital",
            country.capital
        ],

        [
            "Continent",
            country.continent ||
            country.region
        ],

        [
            "Currency",
            country.currency
        ],

        [
            "Languages",
            country.languages
        ],

        [
            "Government",
            country.government
        ],

        [
            "Country Code",
            country.code
        ]

    ];


    container.innerHTML =
        facts
            .filter(
                function (fact) {

                    return (
                        fact[1] !==
                        undefined &&
                        fact[1] !==
                        null &&
                        String(
                            fact[1]
                        ).trim()
                    );

                }
            )
            .map(
                function (fact) {

                    const value =
                        Array.isArray(
                            fact[1]
                        )
                            ? fact[1].join(
                                ", "
                            )
                            : fact[1];

                    return `

                        <div class="country-fact">

                            <span>
                                ${countryEscapeHTML(
                                    fact[0]
                                )}
                            </span>

                            <strong>
                                ${countryEscapeHTML(
                                    value
                                )}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   DESCRIPTION
   ========================================================= */

function renderCountryDescription(
    country
) {

    const container =
        countryGetElement(
            "#countryDescription"
        ) ||
        countryGetElement(
            ".country-description"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <h2>
            About ${countryEscapeHTML(
                country.name
            )}
        </h2>

        <p>
            ${countryEscapeHTML(
                country.description ||
                "Historical and cultural information about this country."
            )}
        </p>

    `;

}


/* =========================================================
   HISTORY
   ========================================================= */

function renderCountryHistory(
    country
) {

    const container =
        countryGetElement(
            "#countryHistory"
        ) ||
        countryGetElement(
            ".country-history"
        );


    if (!container) {

        return;

    }


    const history =
        country.history ||
        {};


    const sections = [

        [
            "Ancient History",
            history.ancient
        ],

        [
            "Medieval History",
            history.medieval
        ],

        [
            "Modern History",
            history.modern
        ]

    ];


    const available =
        sections.filter(
            function (section) {

                return (
                    section[1] !==
                    undefined &&
                    section[1] !==
                    null &&
                    String(
                        section[1]
                    ).trim()
                );

            }
        );


    if (
        available.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            History
        </h2>

        <div class="country-history-grid">

            ${
                available
                    .map(
                        function (section) {

                            return `

                                <article
                                    class="country-history-card"
                                >

                                    <h3>
                                        ${countryEscapeHTML(
                                            section[0]
                                        )}
                                    </h3>

                                    <p>
                                        ${countryEscapeHTML(
                                            section[1]
                                        )}
                                    </p>

                                </article>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   CIVILIZATIONS
   ========================================================= */

function renderCountryCivilizations(
    country
) {

    const container =
        countryGetElement(
            "#countryCivilizations"
        ) ||
        countryGetElement(
            ".country-civilizations"
        );


    if (!container) {

        return;

    }


    const civilizations =
        countryArray(
            country.civilizations
        );


    if (
        civilizations.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            Civilizations
        </h2>

        <div class="country-tag-list">

            ${
                civilizations
                    .map(
                        function (item) {

                            return `

                                <span
                                    class="country-tag"
                                >
                                    ${countryEscapeHTML(
                                        item
                                    )}
                                </span>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   CULTURE
   ========================================================= */

function renderCountryCulture(
    country
) {

    const container =
        countryGetElement(
            "#countryCulture"
        ) ||
        countryGetElement(
            ".country-culture"
        );


    if (!container) {

        return;

    }


    const culture =
        country.culture;


    if (!culture) {

        container.innerHTML =
            "";

        return;

    }


    if (
        typeof culture ===
        "string"
    ) {

        container.innerHTML = `

            <h2>
                Culture
            </h2>

            <p>
                ${countryEscapeHTML(
                    culture
                )}
            </p>

        `;

        return;

    }


    const items =
        Object.entries(
            culture
        );


    container.innerHTML = `

        <h2>
            Culture
        </h2>

        <div class="country-culture-grid">

            ${
                items
                    .map(
                        function (
                            [
                                key,
                                value
                            ]
                        ) {

                            const displayValue =
                                Array.isArray(
                                    value
                                )
                                    ? value.join(
                                        ", "
                                    )
                                    : value;

                            return `

                                <div
                                    class="country-culture-card"
                                >

                                    <h3>
                                        ${countryEscapeHTML(
                                            key
                                        )}
                                    </h3>

                                    <p>
                                        ${countryEscapeHTML(
                                            displayValue
                                        )}
                                    </p>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   MAJOR CITIES
   ========================================================= */

function renderCountryCities(
    country
) {

    const container =
        countryGetElement(
            "#countryCities"
        ) ||
        countryGetElement(
            ".country-cities"
        );


    if (!container) {

        return;

    }


    const cities =
        countryArray(
            country.majorCities
        );


    if (
        cities.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            Major Cities
        </h2>

        <div class="country-city-grid">

            ${
                cities
                    .map(
                        function (city) {

                            return `

                                <div
                                    class="country-city-card"
                                >

                                    <span>
                                        🏛️
                                    </span>

                                    <strong>
                                        ${countryEscapeHTML(
                                            city
                                        )}
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   SUBDIVISIONS
   ========================================================= */

function renderCountrySubdivisions(
    country
) {

    const container =
        countryGetElement(
            "#countrySubdivisions"
        ) ||
        countryGetElement(
            ".country-subdivisions"
        );


    if (!container) {

        return;

    }


    const subdivisions =
        countryArray(
            country.subdivisions
        );


    if (
        subdivisions.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            States / Provinces / Regions
        </h2>

        <div class="country-subdivision-grid">

            ${
                subdivisions
                    .map(
                        function (
                            subdivision,
                            index
                        ) {

                            const name =
                                typeof subdivision ===
                                "string"
                                    ? subdivision
                                    : (
                                        subdivision.name ||
                                        subdivision.title ||
                                        "Region " +
                                        (
                                            index +
                                            1
                                        )
                                    );

                            return `

                                <button
                                    type="button"
                                    class="country-subdivision-card"
                                    data-subdivision="${countryEscapeHTML(
                                        name
                                    )}"
                                >

                                    <span>
                                        📍
                                    </span>

                                    <strong>
                                        ${countryEscapeHTML(
                                            name
                                        )}
                                    </strong>

                                </button>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;


    setupSubdivisionClicks();

}


/* =========================================================
   SUBDIVISION CLICK
   ========================================================= */

function setupSubdivisionClicks() {

    const buttons =
        countryGetElements(
            "[data-subdivision]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const name =
                        button.dataset
                            .subdivision;

                    /*
                     * Country-state detail pages
                     * can be connected later.
                     */

                    showCountryMessage(
                        name +
                        " detail page will be added to the country database later."
                    );

                }
            );

        }
    );

}


/* =========================================================
   HERITAGE
   ========================================================= */

function renderCountryHeritage(
    country
) {

    const container =
        countryGetElement(
            "#countryHeritage"
        ) ||
        countryGetElement(
            ".country-heritage"
        );


    if (!container) {

        return;

    }


    const heritage =
        countryArray(
            country.heritageSites
        );


    if (
        heritage.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            Heritage & Historic Sites
        </h2>

        <div class="country-heritage-grid">

            ${
                heritage
                    .map(
                        function (site) {

                            const name =
                                typeof site ===
                                "string"
                                    ? site
                                    : (
                                        site.name ||
                                        site.title ||
                                        "Heritage Site"
                                    );

                            return `

                                <a
                                    class="country-heritage-card"
                                    href="${ALON_COUNTRY_CONFIG.heritagePage}"
                                >

                                    <span>
                                        🏛️
                                    </span>

                                    <strong>
                                        ${countryEscapeHTML(
                                            name
                                        )}
                                    </strong>

                                </a>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   FAMOUS PEOPLE
   ========================================================= */

function renderCountryPeople(
    country
) {

    const container =
        countryGetElement(
            "#countryPeople"
        ) ||
        countryGetElement(
            ".country-people"
        );


    if (!container) {

        return;

    }


    const people =
        countryArray(
            country.famousPeople
        );


    if (
        people.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            Famous Historical People
        </h2>

        <div class="country-people-grid">

            ${
                people
                    .map(
                        function (person) {

                            const name =
                                typeof person ===
                                "string"
                                    ? person
                                    : (
                                        person.name ||
                                        person.title ||
                                        "Historical Figure"
                                    );

                            return `

                                <div
                                    class="country-person-card"
                                >

                                    <span>
                                        👤
                                    </span>

                                    <strong>
                                        ${countryEscapeHTML(
                                            name
                                        )}
                                    </strong>

                                </div>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   MAJOR EVENTS
   ========================================================= */

function renderCountryEvents(
    country
) {

    const container =
        countryGetElement(
            "#countryEvents"
        ) ||
        countryGetElement(
            ".country-events"
        );


    if (!container) {

        return;

    }


    const events =
        countryArray(
            country.majorEvents
        );


    if (
        events.length ===
        0
    ) {

        container.innerHTML =
            "";

        return;

    }


    container.innerHTML = `

        <h2>
            Major Historical Events
        </h2>

        <div class="country-events-list">

            ${
                events
                    .map(
                        function (event) {

                            const title =
                                typeof event ===
                                "string"
                                    ? event
                                    : (
                                        event.title ||
                                        event.name ||
                                        "Historical Event"
                                    );

                            const year =
                                typeof event ===
                                "object"
                                    ? (
                                        event.year ||
                                        event.date ||
                                        ""
                                    )
                                    : "";

                            const description =
                                typeof event ===
                                "object"
                                    ? (
                                        event.description ||
                                        ""
                                    )
                                    : "";

                            return `

                                <article
                                    class="country-event-card"
                                >

                                    ${
                                        year
                                            ? `
                                                <span class="country-event-year">
                                                    ${countryEscapeHTML(
                                                        year
                                                    )}
                                                </span>
                                            `
                                            : ""
                                    }

                                    <h3>
                                        ${countryEscapeHTML(
                                            title
                                        )}
                                    </h3>

                                    ${
                                        description
                                            ? `
                                                <p>
                                                    ${countryEscapeHTML(
                                                        description
                                                    )}
                                                </p>
                                            `
                                            : ""
                                    }

                                </article>

                            `;

                        }
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function setupCountryNavigation() {

    const backButtons =
        countryGetElements(
            "[data-country-back]"
        );


    backButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        ALON_COUNTRY_CONFIG
                            .countriesPage;

                }
            );

        }
    );


    const homeButtons =
        countryGetElements(
            "[data-country-home]"
        );


    homeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    window.location.href =
                        ALON_COUNTRY_CONFIG
                            .homePage;

                }
            );

        }
    );

}


/* =========================================================
   COUNTRY MESSAGE
   ========================================================= */

function showCountryMessage(
    message
) {

    let box =
        countryGetElement(
            "#countryStatus"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "countryStatus";

        box.setAttribute(
            "role",
            "status"
        );

        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;

    box.classList.add(
        "active"
    );


    window.setTimeout(
        function () {

            box.classList.remove(
                "active"
            );

        },
        3500
    );

}


/* =========================================================
   RENDER COMPLETE COUNTRY
   ========================================================= */

function renderCountry(
    country
) {

    if (!country) {

        showCountryError(
            "Country was not found in the database."
        );

        return;

    }


    ALON_CURRENT_COUNTRY =
        country;


    renderCountryHeader(
        country
    );

    renderCountryFacts(
        country
    );

    renderCountryDescription(
        country
    );

    renderCountryHistory(
        country
    );

    renderCountryCivilizations(
        country
    );

    renderCountryCulture(
        country
    );

    renderCountryCities(
        country
    );

    renderCountrySubdivisions(
        country
    );

    renderCountryHeritage(
        country
    );

    renderCountryPeople(
        country
    );

    renderCountryEvents(
        country
    );


    document.title =
        (
            country.name +
            " • ALON HISTORYVERSE 24"
        );


    document.documentElement
        .dataset.country =
        countrySlug(
            country.name
        );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initializeCountryPage() {

    setupCountryNavigation();


    const query =
        getCountryParameter();


    if (!query) {

        showCountryError(
            "No country was selected. Please choose a country from the Countries page."
        );

        return;

    }


    await loadCountryData();


    if (
        ALON_COUNTRY_DATA.length ===
        0
    ) {

        return;

    }


    const country =
        findCountry(
            query
        );


    renderCountry(
        country
    );

}


/* =========================================================
   GLOBAL COUNTRY API
   ========================================================= */

window.ALON_COUNTRY = {

    config:
        ALON_COUNTRY_CONFIG,

    data:
        function () {

            return ALON_COUNTRY_DATA;

        },

    current:
        function () {

            return ALON_CURRENT_COUNTRY;

        },

    find:
        findCountry,

    load:
        loadCountryData,

    render:
        renderCountry,

    slug:
        countrySlug,

    initialize:
        initializeCountryPage

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
        initializeCountryPage
    );

} else {

    initializeCountryPage();

}


/* =========================================================
   END OF COUNTRY.JS
   ALON HISTORYVERSE 24
   ========================================================= */