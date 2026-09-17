/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.2 SAFE GLOBAL
   Creator: Baba Thecno Guru

   PURPOSE
   • Marketplace country database connection
   • Jobs & Careers country compatibility
   • ISO Alpha-2 code
   • Country name
   • Flag
   • International calling code
   • Uses world-countries.js as the main database
   • No duplicate country database
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       WORLD COUNTRIES DATABASE CONNECTION
       =====================================================

       IMPORTANT:
       world-countries.js must load BEFORE this file.

       world-countries.js provides:

       window.MARKETPLACE_COUNTRIES

       This file only connects Marketplace to that database.
       ===================================================== */

    if (
        !Array.isArray(window.MARKETPLACE_COUNTRIES) ||
        window.MARKETPLACE_COUNTRIES.length === 0
    ) {

        console.error(
            "ALON HISTORYVERSE 24 — World Countries database not loaded."
        );

        window.MARKETPLACE_COUNTRIES = [];

    }


    /* =====================================================
       MAIN MARKETPLACE DATABASE
       ===================================================== */

    const MARKETPLACE_COUNTRIES =
        window.MARKETPLACE_COUNTRIES;


    /* =====================================================
       GLOBAL EXPORT
       ===================================================== */

    window.MARKETPLACE_COUNTRIES =
        MARKETPLACE_COUNTRIES;


    /* =====================================================
       COMPATIBILITY ALIASES
       पुराने Marketplace code के लिए
       ===================================================== */

    window.WORLD_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.GLOBAL_COUNTRIES =
        MARKETPLACE_COUNTRIES;


    /* =====================================================
       MARKETPLACE DATABASE READY
       ===================================================== */

    window.MARKETPLACE_COUNTRIES_READY =
        Array.isArray(MARKETPLACE_COUNTRIES) &&
        MARKETPLACE_COUNTRIES.length > 0;


    /* =====================================================
       WORLD DATABASE READY
       ===================================================== */

    window.WORLD_COUNTRIES_READY =
        window.MARKETPLACE_COUNTRIES_READY;


    /* =====================================================
       GET ONE MARKETPLACE COUNTRY
       ===================================================== */

    window.getMarketplaceCountry = function (code) {

        const target =
            String(code || "")
                .trim()
                .toUpperCase();

        return MARKETPLACE_COUNTRIES.find(
            function (country) {

                return (
                    String(country.code || "")
                        .trim()
                        .toUpperCase() === target
                );

            }
        ) || null;

    };


    /* =====================================================
       GET ALL MARKETPLACE COUNTRIES
       ===================================================== */

    window.getMarketplaceCountries = function () {

        return MARKETPLACE_COUNTRIES.slice();

    };


    /* =====================================================
       SEARCH MARKETPLACE COUNTRIES
       ===================================================== */

    window.searchMarketplaceCountries = function (query) {

        const q =
            String(query || "")
                .trim()
                .toLowerCase();

        if (!q) {

            return MARKETPLACE_COUNTRIES.slice();

        }

        return MARKETPLACE_COUNTRIES.filter(
            function (country) {

                const name =
                    String(country.name || "")
                        .toLowerCase();

                const code =
                    String(country.code || "")
                        .toLowerCase();

                const callingCode =
                    String(country.callingCode || "")
                        .toLowerCase();

                return (
                    name.includes(q) ||
                    code.includes(q) ||
                    callingCode.includes(q)
                );

            }
        );

    };


    /* =====================================================
       GET COUNTRY BY NAME
       ===================================================== */

    window.getMarketplaceCountryByName = function (name) {

        const target =
            String(name || "")
                .trim()
                .toLowerCase();

        if (!target) {

            return null;

        }

        return MARKETPLACE_COUNTRIES.find(
            function (country) {

                return (
                    String(country.name || "")
                        .trim()
                        .toLowerCase() === target
                );

            }
        ) || null;

    };


    /* =====================================================
       GET COUNTRY CALLING CODE
       ===================================================== */

    window.getMarketplaceCallingCode = function (code) {

        const country =
            window.getMarketplaceCountry(code);

        return country
            ? country.callingCode
            : "";

    };


    /* =====================================================
       GET COUNTRY FLAG
       ===================================================== */

    window.getMarketplaceCountryFlag = function (code) {

        const country =
            window.getMarketplaceCountry(code);

        return country
            ? country.flag
            : "";

    };


    /* =====================================================
       WORLD COUNTRY COMPATIBILITY
       ===================================================== */

    window.getWorldCountry = function (code) {

        const target =
            String(code || "")
                .trim()
                .toUpperCase();

        return MARKETPLACE_COUNTRIES.find(
            function (country) {

                return (
                    String(country.code || "")
                        .trim()
                        .toUpperCase() === target
                );

            }
        ) || null;

    };


    /* =====================================================
       GET ALL WORLD COUNTRIES
       ===================================================== */

    window.getWorldCountries = function () {

        return MARKETPLACE_COUNTRIES.slice();

    };


    /* =====================================================
       SEARCH WORLD COUNTRIES
       ===================================================== */

    window.searchWorldCountries = function (query) {

        const q =
            String(query || "")
                .trim()
                .toLowerCase();

        if (!q) {

            return MARKETPLACE_COUNTRIES.slice();

        }

        return MARKETPLACE_COUNTRIES.filter(
            function (country) {

                return (
                    String(country.name || "")
                        .toLowerCase()
                        .includes(q) ||

                    String(country.code || "")
                        .toLowerCase()
                        .includes(q) ||

                    String(country.callingCode || "")
                        .toLowerCase()
                        .includes(q)
                );

            }
        );

    };


    /* =====================================================
       DATABASE STATUS
       ===================================================== */

    console.log(
        "ALON HISTORYVERSE 24 — Marketplace Countries connected:",
        MARKETPLACE_COUNTRIES.length
    );


    /* =====================================================
       249 COUNTRY TEST
       ===================================================== */

    console.assert(
        MARKETPLACE_COUNTRIES.length === 249,
        "ERROR: World Countries database must contain exactly 249 entries."
    );


    /* =====================================================
       INDIA TEST
       ===================================================== */

    const india =
        window.getMarketplaceCountry("IN");


    console.assert(
        india !== null,
        "ERROR: India was not found in Marketplace country database."
    );


    console.assert(
        india?.name === "India",
        "ERROR: India country name is incorrect."
    );


    console.assert(
        india?.callingCode === "+91",
        "ERROR: India calling code is incorrect."
    );


    console.assert(
        india?.flag === "🇮🇳",
        "ERROR: India flag is incorrect."
    );


    /* =====================================================
       FINAL READY MESSAGE
       ===================================================== */

    if (window.MARKETPLACE_COUNTRIES_READY) {

        console.log(
            "ALON HISTORYVERSE 24 — Marketplace Countries READY"
        );

    }

})();