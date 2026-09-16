/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.2 SAFE COUNTRY DATABASE

   SOURCE:
   • countries.html
   • country.html

   VERIFIED DATA:
   • Country Name
   • Country Slug
   • Flag
   • ISO 2 Code
   • ISO 3 Code
   • Capital
   • Region

   IMPORTANT:
   • Regular Marketplace can use this database.
   • Jobs can use this database.
   • Global Marketplace is NOT modified.
   • No unverified calling codes are included.
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       MAIN COUNTRY DATABASE
       ===================================================== */

    const COUNTRIES = [

        {
            name: "India",
            country: "India",
            slug: "india",
            flag: "🇮🇳",
            code2: "IN",
            code3: "IND",
            capital: "New Delhi",
            region: "Asia"
        },

        {
            name: "United States",
            country: "United States",
            slug: "united-states",
            flag: "🇺🇸",
            code2: "US",
            code3: "USA",
            capital: "Washington, D.C.",
            region: "North America",
            aliases: [
                "United States of America",
                "USA"
            ]
        },

        {
            name: "United Kingdom",
            country: "United Kingdom",
            slug: "united-kingdom",
            flag: "🇬🇧",
            code2: "GB",
            code3: "GBR",
            capital: "London",
            region: "Europe",
            aliases: [
                "Britain",
                "Great Britain",
                "UK"
            ]
        },

        {
            name: "France",
            country: "France",
            slug: "france",
            flag: "🇫🇷",
            code2: "FR",
            code3: "FRA",
            capital: "Paris",
            region: "Europe"
        },

        {
            name: "Germany",
            country: "Germany",
            slug: "germany",
            flag: "🇩🇪",
            code2: "DE",
            code3: "DEU",
            capital: "Berlin",
            region: "Europe",
            aliases: [
                "Deutschland"
            ]
        },

        {
            name: "Italy",
            country: "Italy",
            slug: "italy",
            flag: "🇮🇹",
            code2: "IT",
            code3: "ITA",
            capital: "Rome",
            region: "Europe",
            aliases: [
                "Italia"
            ]
        },

        {
            name: "Spain",
            country: "Spain",
            slug: "spain",
            flag: "🇪🇸",
            code2: "ES",
            code3: "ESP",
            capital: "Madrid",
            region: "Europe",
            aliases: [
                "España"
            ]
        },

        {
            name: "China",
            country: "China",
            slug: "china",
            flag: "🇨🇳",
            code2: "CN",
            code3: "CHN",
            capital: "Beijing",
            region: "Asia",
            aliases: [
                "中国"
            ]
        },

        {
            name: "Japan",
            country: "Japan",
            slug: "japan",
            flag: "🇯🇵",
            code2: "JP",
            code3: "JPN",
            capital: "Tokyo",
            region: "Asia",
            aliases: [
                "日本"
            ]
        },

        {
            name: "Australia",
            country: "Australia",
            slug: "australia",
            flag: "🇦🇺",
            code2: "AU",
            code3: "AUS",
            capital: "Canberra",
            region: "Oceania"
        },

        {
            name: "Canada",
            country: "Canada",
            slug: "canada",
            flag: "🇨🇦",
            code2: "CA",
            code3: "CAN",
            capital: "Ottawa",
            region: "North America"
        },

        {
            name: "Brazil",
            country: "Brazil",
            slug: "brazil",
            flag: "🇧🇷",
            code2: "BR",
            code3: "BRA",
            capital: "Brasília",
            region: "South America",
            aliases: [
                "Brasil"
            ]
        },

        {
            name: "Egypt",
            country: "Egypt",
            slug: "egypt",
            flag: "🇪🇬",
            code2: "EG",
            code3: "EGY",
            capital: "Cairo",
            region: "Africa",
            aliases: [
                "Misr"
            ]
        },

        {
            name: "South Africa",
            country: "South Africa",
            slug: "south-africa",
            flag: "🇿🇦",
            code2: "ZA",
            code3: "ZAF",
            capital: "Pretoria / Cape Town / Bloemfontein",
            region: "Africa"
        },

        {
            name: "Mexico",
            country: "Mexico",
            slug: "mexico",
            flag: "🇲🇽",
            code2: "MX",
            code3: "MEX",
            capital: "Mexico City",
            region: "North America",
            aliases: [
                "México"
            ]
        },

        {
            name: "Argentina",
            country: "Argentina",
            slug: "argentina",
            flag: "🇦🇷",
            code2: "AR",
            code3: "ARG",
            capital: "Buenos Aires",
            region: "South America"
        },

        {
            name: "Nigeria",
            country: "Nigeria",
            slug: "nigeria",
            flag: "🇳🇬",
            code2: "NG",
            code3: "NGA",
            capital: "Abuja",
            region: "Africa"
        },

        {
            name: "New Zealand",
            country: "New Zealand",
            slug: "new-zealand",
            flag: "🇳🇿",
            code2: "NZ",
            code3: "NZL",
            capital: "Wellington",
            region: "Oceania",
            aliases: [
                "Aotearoa"
            ]
        }

    ];


    /* =====================================================
       NORMALIZE RECORDS
       ===================================================== */

    const MARKETPLACE_COUNTRIES =
        COUNTRIES.map(function (item) {

            return {

                name:
                    String(item.name || "").trim(),

                country:
                    String(item.country || item.name || "").trim(),

                slug:
                    String(item.slug || "").trim(),

                flag:
                    String(item.flag || "").trim(),

                code2:
                    String(item.code2 || "")
                        .trim()
                        .toUpperCase(),

                code3:
                    String(item.code3 || "")
                        .trim()
                        .toUpperCase(),

                capital:
                    String(item.capital || "").trim(),

                region:
                    String(item.region || "").trim(),

                aliases:
                    Array.isArray(item.aliases)
                        ? item.aliases.slice()
                        : []

            };

        });


    /* =====================================================
       MAIN GLOBAL DATABASE
       ===================================================== */

    window.MARKETPLACE_COUNTRIES =
        MARKETPLACE_COUNTRIES;


    /* =====================================================
       COMPATIBILITY ALIASES
       ===================================================== */

    window.ALON_MARKETPLACE_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.ALON_WORLD_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.WORLD_COUNTRIES =
        MARKETPLACE_COUNTRIES;


    /* =====================================================
       TOTAL COUNTRY COUNT
       ===================================================== */

    window.MARKETPLACE_COUNTRY_COUNT =
        MARKETPLACE_COUNTRIES.length;


    /* =====================================================
       FIND BY ISO-2 / ISO-3 CODE
       ===================================================== */

    window.getMarketplaceCountryByCode =
        function (code) {

            const search =
                String(code || "")
                    .trim()
                    .toUpperCase();

            if (!search) {
                return null;
            }

            return MARKETPLACE_COUNTRIES.find(
                function (country) {

                    return (
                        country.code2 === search ||
                        country.code3 === search
                    );

                }
            ) || null;

        };


    /* =====================================================
       FIND BY COUNTRY NAME
       ===================================================== */

    window.getMarketplaceCountryByName =
        function (name) {

            const search =
                String(name || "")
                    .trim()
                    .toLowerCase();

            if (!search) {
                return null;
            }

            return MARKETPLACE_COUNTRIES.find(
                function (country) {

                    if (
                        country.name
                            .toLowerCase() === search
                    ) {
                        return true;
                    }

                    if (
                        country.country
                            .toLowerCase() === search
                    ) {
                        return true;
                    }

                    return country.aliases.some(
                        function (alias) {

                            return (
                                String(alias)
                                    .toLowerCase() ===
                                search
                            );

                        }
                    );

                }
            ) || null;

        };


    /* =====================================================
       FIND BY SLUG
       ===================================================== */

    window.getMarketplaceCountryBySlug =
        function (slug) {

            const search =
                String(slug || "")
                    .trim()
                    .toLowerCase();

            if (!search) {
                return null;
            }

            return MARKETPLACE_COUNTRIES.find(
                function (country) {

                    return (
                        country.slug
                            .toLowerCase() === search
                    );

                }
            ) || null;

        };


    /* =====================================================
       SEARCH COUNTRIES
       ===================================================== */

    window.searchMarketplaceCountries =
        function (query) {

            const search =
                String(query || "")
                    .trim()
                    .toLowerCase();

            if (!search) {

                return MARKETPLACE_COUNTRIES.slice();

            }


            return MARKETPLACE_COUNTRIES.filter(
                function (country) {

                    const aliases =
                        country.aliases.join(" ");


                    const searchableText = [

                        country.name,

                        country.country,

                        country.slug,

                        country.code2,

                        country.code3,

                        country.capital,

                        country.region,

                        aliases

                    ]
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        search
                    );

                }
            );

        };


    /* =====================================================
       GET COUNTRIES BY REGION
       ===================================================== */

    window.getMarketplaceCountriesByRegion =
        function (region) {

            const search =
                String(region || "")
                    .trim()
                    .toLowerCase();

            if (!search) {
                return [];
            }

            return MARKETPLACE_COUNTRIES.filter(
                function (country) {

                    return (
                        country.region
                            .toLowerCase() ===
                        search
                    );

                }
            );

        };


    /* =====================================================
       CREATE COUNTRY DISPLAY TEXT
       ===================================================== */

    window.getMarketplaceCountryDisplay =
        function (country) {

            if (!country) {
                return "";
            }

            return (

                country.flag +
                " " +
                country.name +
                " (" +
                country.code2 +
                " • " +
                country.code3 +
                ")"

            );

        };


    /* =====================================================
       CREATE COUNTRY OPTION
       Useful for SELECT dropdowns
       ===================================================== */

    window.createMarketplaceCountryOption =
        function (country) {

            if (!country) {
                return null;
            }

            const option =
                document.createElement("option");


            option.value =
                country.code2;


            option.textContent =
                getMarketplaceCountryDisplay(
                    country
                );


            option.dataset.country =
                country.name;


            option.dataset.code2 =
                country.code2;


            option.dataset.code3 =
                country.code3;


            option.dataset.slug =
                country.slug;


            option.dataset.region =
                country.region;


            return option;

        };


    /* =====================================================
       POPULATE A SELECT ELEMENT
       ===================================================== */

    window.populateMarketplaceCountrySelect =
        function (
            selectElement,
            includePlaceholder
        ) {

            if (!selectElement) {
                return false;
            }


            const keepPlaceholder =
                includePlaceholder !== false;


            selectElement.innerHTML = "";


            if (keepPlaceholder) {

                const placeholder =
                    document.createElement("option");

                placeholder.value = "";

                placeholder.textContent =
                    "🌍 Select Country";

                placeholder.disabled = true;

                placeholder.selected = true;

                selectElement.appendChild(
                    placeholder
                );

            }


            MARKETPLACE_COUNTRIES.forEach(
                function (country) {

                    const option =
                        window.createMarketplaceCountryOption(
                            country
                        );

                    if (option) {

                        selectElement.appendChild(
                            option
                        );

                    }

                }
            );


            return true;

        };


    /* =====================================================
       DATABASE INFORMATION
       ===================================================== */

    window.MARKETPLACE_COUNTRY_DATABASE_INFO = {

        version: "24.2",

        source:
            "ALON HISTORYVERSE 24 countries.html + country.html",

        total:
            MARKETPLACE_COUNTRIES.length,

        verifiedFields: [

            "name",
            "country",
            "slug",
            "flag",
            "code2",
            "code3",
            "capital",
            "region"

        ],

        callingCodeAvailable: false,

        globalMarketplaceModified: false

    };


    /* =====================================================
       LOAD CONFIRMATION
       ===================================================== */

    console.log(
        "ALON HISTORYVERSE 24 Marketplace Country Database loaded:",
        MARKETPLACE_COUNTRIES.length,
        "countries"
    );


})();