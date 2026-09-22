/* =========================================================
   ALON HISTORYVERSE 24
   WORLD LANGUAGE TRANSLATION ENGINE
   ---------------------------------------------------------
   File:
   world-language-translate.js

   Version:
   2.1 SAFE CONNECTED

   Creator:
   Baba Thecno Guru

   ---------------------------------------------------------
   PURPOSE
   ---------------------------------------------------------
   - Connect with existing world-language.js
   - Use WORLD_LANGUAGE_CONFIG as source of truth
   - Listen to alon:world-language-change
   - Translate website UI
   - Support data-translate attributes
   - Support placeholders
   - Support titles
   - Support aria-label
   - Support exact visible UI text
   - Support dynamically created content
   - Preserve original text
   - Restore original text when switching to English
   - Support RTL languages
   - Store language locally
   - Never change another user's language
   - Do NOT modify world-language.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ====================================================== */

    const CONFIG = {

        version:
            "2.1.0",

        storageKey:
            "alon_historyverse_language",

        defaultLanguage:
            "en",

        translateAttribute:
            "data-translate",

        placeholderAttribute:
            "data-translate-placeholder",

        titleAttribute:
            "data-translate-title",

        ariaAttribute:
            "data-translate-aria",

        originalTextAttribute:
            "data-alon-original-text",

        originalPlaceholderAttribute:
            "data-alon-original-placeholder",

        originalTitleAttribute:
            "data-alon-original-title",

        originalAriaAttribute:
            "data-alon-original-aria",

        debug:
            true

    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {

        initialized:
            false,

        language:
            CONFIG.defaultLanguage,

        observer:
            null,

        translating:
            false

    };


    /* =====================================================
       LANGUAGE DATABASE
       -----------------------------------------------------
       IMPORTANT:
       We DO NOT create a second language database.

       Existing world-language.js remains the source
       of truth.
    ====================================================== */

    function getLanguageDatabase() {

        if (
            window.WORLD_LANGUAGE_CONFIG &&
            typeof window.WORLD_LANGUAGE_CONFIG ===
                "object"
        ) {

            return window.WORLD_LANGUAGE_CONFIG;

        }

        return {};

    }


    /* =====================================================
       GET LANGUAGE
    ====================================================== */

    function normalizeLanguage(
        language
    ) {

        if (!language) {

            return CONFIG.defaultLanguage;
        }


        let value =
            String(language)
                .trim();


        /*
         * Exact code first.
         *
         * This is important for:
         *
         * en-US
         * en-GB
         * es-MX
         * pt-BR
         * fr-CA
         */

        const database =
            getLanguageDatabase();


        if (
            database[value]
        ) {

            return value;
        }


        if (
            database[
                value.toLowerCase()
            ]
        ) {

            return value.toLowerCase();
        }


        /*
         * Try language code before region.
         */

        const short =
            value
                .replace(
                    "_",
                    "-"
                )
                .split("-")[0]
                .toLowerCase();


        if (
            database[short]
        ) {

            return short;
        }


        return CONFIG.defaultLanguage;
    }


    /* =====================================================
       GET CURRENT LANGUAGE
    ====================================================== */

    function getLanguage() {

        /*
         * Existing ALON World Language engine
         * is preferred.
         */

        try {

            if (
                window.ALON_WORLD_LANGUAGE &&
                typeof window
                    .ALON_WORLD_LANGUAGE
                    .getCode ===
                    "function"
            ) {

                return normalizeLanguage(
                    window
                        .ALON_WORLD_LANGUAGE
                        .getCode()
                );
            }

        } catch (error) {

            debug(
                "World language API read failed.",
                error
            );

        }


        /*
         * localStorage fallback.
         */

        try {

            const stored =
                localStorage.getItem(
                    CONFIG.storageKey
                );


            if (stored) {

                return normalizeLanguage(
                    stored
                );
            }

        } catch (error) {

            debug(
                "localStorage read failed.",
                error
            );

        }


        return CONFIG.defaultLanguage;
    }


    /* =====================================================
       SAVE LANGUAGE
    ====================================================== */

    function saveLanguage(
        language
    ) {

        try {

            localStorage.setItem(
                CONFIG.storageKey,
                language
            );

        } catch (error) {

            debug(
                "localStorage save failed.",
                error
            );

        }

    }


    /* =====================================================
       TRANSLATION PACKS
       -----------------------------------------------------
       These are REAL supplied translations.

       English = original
       Hindi   = supplied
       Gujarati = supplied

       Other languages remain safely untranslated until
       their real translation pack is added.
    ====================================================== */

    const TRANSLATIONS = {


        /* =================================================
           ENGLISH
        ================================================= */

        en: {

            "site.title":
                "ALON HISTORYVERSE 24",

            "menu.home":
                "Home",

            "menu.explore":
                "Explore",

            "menu.library":
                "Library",

            "menu.history":
                "History",

            "menu.countries":
                "Countries",

            "menu.heritage":
                "Heritage",

            "menu.timeline":
                "Timeline",

            "menu.articles":
                "Articles",

            "menu.about":
                "About",

            "menu.platform":
                "Platform",

            "menu.community":
                "Community",

            "menu.settings":
                "Settings",

            "menu.language":
                "Language",

            "menu.account":
                "Account",

            "menu.logout":
                "Logout",

            "common.search":
                "Search",

            "common.close":
                "Close",

            "common.open":
                "Open",

            "common.back":
                "Back",

            "common.next":
                "Next",

            "common.previous":
                "Previous",

            "common.save":
                "Save",

            "common.delete":
                "Delete",

            "common.edit":
                "Edit",

            "common.cancel":
                "Cancel",

            "common.submit":
                "Submit",

            "common.login":
                "Login",

            "common.register":
                "Register",

            "common.discover":
                "Discover",

            "common.categories":
                "Categories",

            "common.gallery":
                "Gallery",

            "common.article":
                "Article",

            "common.country":
                "Country",

            "common.read":
                "Read",

            "common.view":
                "View",

            "common.learn":
                "Learn More",

            "library.title":
                "Knowledge Library",

            "library.departments":
                "Departments",

            "library.subjects":
                "Subjects",

            "library.books":
                "Books",

            "history.title":
                "History",

            "history.civilizations":
                "Civilizations",

            "history.timeline":
                "Timeline",

            "history.articles":
                "Articles",

            "countries.title":
                "World Countries",

            "countries.country":
                "Country",

            "heritage.title":
                "World Heritage",

            "heritage.culture":
                "Culture",

            "marketplace.title":
                "Marketplace",

            "marketplace.global":
                "Global Marketplace",

            "marketplace.regular":
                "Regular Marketplace",

            "marketplace.sell":
                "Sell",

            "marketplace.buy":
                "Buy",

            "marketplace.advertise":
                "Advertise",

            "jobs.title":
                "Jobs & Careers",

            "jobs.jobs":
                "Jobs",

            "jobs.careers":
                "Careers",

            "community.title":
                "Community",

            "community.guidelines":
                "Community Guidelines",

            "community.contribute":
                "Contribute",

            "community.agreement":
                "Contributor Agreement",

            "information.title":
                "Information",

            "information.contact":
                "Contact",

            "information.privacy":
                "Privacy",

            "information.terms":
                "Terms",

            "information.copyright":
                "Copyright",

            "language.select":
                "Select Language",

            "language.current":
                "Current Language",

            "status.online":
                "Online",

            "status.offline":
                "Offline",

            "status.loading":
                "Loading",

            "status.ready":
                "Ready"

        },


        /* =================================================
           HINDI
        ================================================= */

        hi: {

            "site.title":
                "ALON HISTORYVERSE 24",

            "menu.home":
                "होम",

            "menu.explore":
                "अन्वेषण",

            "menu.library":
                "लाइब्रेरी",

            "menu.history":
                "इतिहास",

            "menu.countries":
                "देश",

            "menu.heritage":
                "विरासत",

            "menu.timeline":
                "समयरेखा",

            "menu.articles":
                "लेख",

            "menu.about":
                "हमारे बारे में",

            "menu.platform":
                "प्लेटफ़ॉर्म",

            "menu.community":
                "समुदाय",

            "menu.settings":
                "सेटिंग्स",

            "menu.language":
                "भाषा",

            "menu.account":
                "अकाउंट",

            "menu.logout":
                "लॉगआउट",

            "common.search":
                "खोजें",

            "common.close":
                "बंद करें",

            "common.open":
                "खोलें",

            "common.back":
                "वापस",

            "common.next":
                "आगे",

            "common.previous":
                "पिछला",

            "common.save":
                "सहेजें",

            "common.delete":
                "डिलीट करें",

            "common.edit":
                "संपादित करें",

            "common.cancel":
                "रद्द करें",

            "common.submit":
                "सबमिट करें",

            "common.login":
                "लॉगिन",

            "common.register":
                "रजिस्टर करें",

            "common.discover":
                "खोजें",

            "common.categories":
                "श्रेणियाँ",

            "common.gallery":
                "गैलरी",

            "common.article":
                "लेख",

            "common.country":
                "देश",

            "common.read":
                "पढ़ें",

            "common.view":
                "देखें",

            "common.learn":
                "और जानें",

            "library.title":
                "ज्ञान लाइब्रेरी",

            "library.departments":
                "विभाग",

            "library.subjects":
                "विषय",

            "library.books":
                "पुस्तकें",

            "history.title":
                "इतिहास",

            "history.civilizations":
                "सभ्यताएँ",

            "history.timeline":
                "समयरेखा",

            "history.articles":
                "लेख",

            "countries.title":
                "विश्व के देश",

            "countries.country":
                "देश",

            "heritage.title":
                "विश्व विरासत",

            "heritage.culture":
                "संस्कृति",

            "marketplace.title":
                "मार्केटप्लेस",

            "marketplace.global":
                "ग्लोबल मार्केटप्लेस",

            "marketplace.regular":
                "रेगुलर मार्केटप्लेस",

            "marketplace.sell":
                "बेचें",

            "marketplace.buy":
                "खरीदें",

            "marketplace.advertise":
                "विज्ञापन दें",

            "jobs.title":
                "नौकरी और करियर",

            "jobs.jobs":
                "नौकरियाँ",

            "jobs.careers":
                "करियर",

            "community.title":
                "समुदाय",

            "community.guidelines":
                "सामुदायिक दिशानिर्देश",

            "community.contribute":
                "योगदान करें",

            "community.agreement":
                "योगदानकर्ता समझौता",

            "information.title":
                "जानकारी",

            "information.contact":
                "संपर्क",

            "information.privacy":
                "गोपनीयता",

            "information.terms":
                "शर्तें",

            "information.copyright":
                "कॉपीराइट",

            "language.select":
                "भाषा चुनें",

            "language.current":
                "वर्तमान भाषा",

            "status.online":
                "ऑनलाइन",

            "status.offline":
                "ऑफलाइन",

            "status.loading":
                "लोड हो रहा है",

            "status.ready":
                "तैयार"

        },


        /* =================================================
           GUJARATI
        ================================================= */

        gu: {

            "site.title":
                "ALON HISTORYVERSE 24",

            "menu.home":
                "હોમ",

            "menu.explore":
                "શોધો",

            "menu.library":
                "લાઇબ્રેરી",

            "menu.history":
                "ઇતિહાસ",

            "menu.countries":
                "દેશો",

            "menu.heritage":
                "વારસો",

            "menu.timeline":
                "સમયરેખા",

            "menu.articles":
                "લેખો",

            "menu.about":
                "અમારા વિશે",

            "menu.platform":
                "પ્લેટફોર્મ",

            "menu.community":
                "સમુદાય",

            "menu.settings":
                "સેટિંગ્સ",

            "menu.language":
                "ભાષા",

            "menu.account":
                "એકાઉન્ટ",

            "menu.logout":
                "લૉગઆઉટ",

            "common.search":
                "શોધો",

            "common.close":
                "બંધ કરો",

            "common.open":
                "ખોલો",

            "common.back":
                "પાછળ",

            "common.next":
                "આગળ",

            "common.previous":
                "પહેલાનું",

            "common.save":
                "સાચવો",

            "common.delete":
                "કાઢી નાખો",

            "common.edit":
                "ફેરફાર કરો",

            "common.cancel":
                "રદ કરો",

            "common.submit":
                "સબમિટ કરો",

            "common.login":
                "લૉગિન",

            "common.register":
                "નોંધણી કરો",

            "common.discover":
                "શોધો",

            "common.categories":
                "શ્રેણીઓ",

            "common.gallery":
                "ગેલેરી",

            "common.article":
                "લેખ",

            "common.country":
                "દેશ",

            "common.read":
                "વાંચો",

            "common.view":
                "જુઓ",

            "common.learn":
                "વધુ જાણો",

            "library.title":
                "જ્ઞાન લાઇબ્રેરી",

            "library.departments":
                "વિભાગો",

            "library.subjects":
                "વિષયો",

            "library.books":
                "પુસ્તકો",

            "history.title":
                "ઇતિહાસ",

            "history.civilizations":
                "સંસ્કૃતિઓ",

            "history.timeline":
                "સમયરેખા",

            "history.articles":
                "લેખો",

            "countries.title":
                "વિશ્વના દેશો",

            "countries.country":
                "દેશ",

            "heritage.title":
                "વિશ્વ વારસો",

            "heritage.culture":
                "સંસ્કૃતિ",

            "marketplace.title":
                "માર્કેટપ્લેસ",

            "marketplace.global":
                "ગ્લોબલ માર્કેટપ્લેસ",

            "marketplace.regular":
                "રેગ્યુલર માર્કેટપ્લેસ",

            "marketplace.sell":
                "વેચો",

            "marketplace.buy":
                "ખરીદો",

            "marketplace.advertise":
                "જાહેરાત આપો",

            "jobs.title":
                "નોકરી અને કારકિર્દી",

            "jobs.jobs":
                "નોકરીઓ",

            "jobs.careers":
                "કારકિર્દી",

            "community.title":
                "સમુદાય",

            "community.guidelines":
                "સમુદાય માર્ગદર્શિકા",

            "community.contribute":
                "યોગદાન આપો",

            "community.agreement":
                "યોગદાનકર્તા કરાર",

            "information.title":
                "માહિતી",

            "information.contact":
                "સંપર્ક",

            "information.privacy":
                "ગોપનીયતા",

            "information.terms":
                "શરતો",

            "information.copyright":
                "કૉપિરાઇટ",

            "language.select":
                "ભાષા પસંદ કરો",

            "language.current":
                "વર્તમાન ભાષા",

            "status.online":
                "ઓનલાઇન",

            "status.offline":
                "ઓફલાઇન",

            "status.loading":
                "લોડ થઈ રહ્યું છે",

            "status.ready":
                "તૈયાર"

        }

    };


    /* =====================================================
       EXACT TEXT MAP
       -----------------------------------------------------
       Used for existing index.html text that currently
       does not have data-translate attributes.
    ====================================================== */

    const EXACT_TEXT = {

        hi: {

            "Home":
                "होम",

            "Explore":
                "अन्वेषण",

            "Library":
                "लाइब्रेरी",

            "History":
                "इतिहास",

            "Countries":
                "देश",

            "Heritage":
                "विरासत",

            "Timeline":
                "समयरेखा",

            "Articles":
                "लेख",

            "About":
                "हमारे बारे में",

            "Platform":
                "प्लेटफ़ॉर्म",

            "Community":
                "समुदाय",

            "Settings":
                "सेटिंग्स",

            "Language":
                "भाषा",

            "Account":
                "अकाउंट",

            "Logout":
                "लॉगआउट",

            "Search":
                "खोजें",

            "Close":
                "बंद करें",

            "Open":
                "खोलें",

            "Back":
                "वापस",

            "Save":
                "सहेजें",

            "Delete":
                "डिलीट करें",

            "Edit":
                "संपादित करें",

            "Cancel":
                "रद्द करें",

            "Submit":
                "सबमिट करें",

            "Login":
                "लॉगिन",

            "Register":
                "रजिस्टर करें",

            "Discover":
                "खोजें",

            "Categories":
                "श्रेणियाँ",

            "Gallery":
                "गैलरी",

            "Article":
                "लेख",

            "Country":
                "देश",

            "Read":
                "पढ़ें",

            "View":
                "देखें",

            "Learn More":
                "और जानें",

            "Knowledge Library":
                "ज्ञान लाइब्रेरी",

            "Departments":
                "विभाग",

            "Subjects":
                "विषय",

            "Books":
                "पुस्तकें",

            "Civilizations":
                "सभ्यताएँ",

            "World Countries":
                "विश्व के देश",

            "World Heritage":
                "विश्व विरासत",

            "Culture":
                "संस्कृति",

            "Jobs & Careers":
                "नौकरी और करियर",

            "Jobs":
                "नौकरियाँ",

            "Careers":
                "करियर",

            "Marketplace":
                "मार्केटप्लेस",

            "Global Marketplace":
                "ग्लोबल मार्केटप्लेस",

            "Regular Marketplace":
                "रेगुलर मार्केटप्लेस",

            "Sell":
                "बेचें",

            "Buy":
                "खरीदें",

            "Advertise":
                "विज्ञापन दें",

            "Community Guidelines":
                "सामुदायिक दिशानिर्देश",

            "Contribute":
                "योगदान करें",

            "Contributor Agreement":
                "योगदानकर्ता समझौता",

            "Information":
                "जानकारी",

            "Contact":
                "संपर्क",

            "Privacy":
                "गोपनीयता",

            "Terms":
                "शर्तें",

            "Copyright":
                "कॉपीराइट",

            "Select Language":
                "भाषा चुनें",

            "Current Language":
                "वर्तमान भाषा",

            "Online":
                "ऑनलाइन",

            "Offline":
                "ऑफलाइन",

            "Loading":
                "लोड हो रहा है",

            "Ready":
                "तैयार"

        },


        gu: {

            "Home":
                "હોમ",

            "Explore":
                "શોધો",

            "Library":
                "લાઇબ્રેરી",

            "History":
                "ઇતિહાસ",

            "Countries":
                "દેશો",

            "Heritage":
                "વારસો",

            "Timeline":
                "સમયરેખા",

            "Articles":
                "લેખો",

            "About":
                "અમારા વિશે",

            "Platform":
                "પ્લેટફોર્મ",

            "Community":
                "સમુદાય",

            "Settings":
                "સેટિંગ્સ",

            "Language":
                "ભાષા",

            "Account":
                "એકાઉન્ટ",

            "Logout":
                "લૉગઆઉટ",

            "Search":
                "શોધો",

            "Close":
                "બંધ કરો",

            "Open":
                "ખોલો",

            "Back":
                "પાછળ",

            "Save":
                "સાચવો",

            "Delete":
                "કાઢી નાખો",

            "Edit":
                "ફેરફાર કરો",

            "Cancel":
                "રદ કરો",

            "Submit":
                "સબમિટ કરો",

            "Login":
                "લૉગિન",

            "Register":
                "નોંધણી કરો",

            "Discover":
                "શોધો",

            "Categories":
                "શ્રેણીઓ",

            "Gallery":
                "ગેલેરી",

            "Article":
                "લેખ",

            "Country":
                "દેશ",

            "Read":
                "વાંચો",

            "View":
                "જુઓ",

            "Learn More":
                "વધુ જાણો",

            "Knowledge Library":
                "જ્ઞાન લાઇબ્રેરી",

            "Departments":
                "વિભાગો",

            "Subjects":
                "વિષયો",

            "Books":
                "પુસ્તકો",

            "Civilizations":
                "સંસ્કૃતિઓ",

            "World Countries":
                "વિશ્વના દેશો",

            "World Heritage":
                "વિશ્વ વારસો",

            "Culture":
                "સંસ્કૃતિ",

            "Jobs & Careers":
                "નોકરી અને કારકિર્દી",

            "Jobs":
                "નોકરીઓ",

            "Careers":
                "કારકિર્દી",

            "Marketplace":
                "માર્કેટપ્લેસ",

            "Global Marketplace":
                "ગ્લોબલ માર્કેટપ્લેસ",

            "Regular Marketplace":
                "રેગ્યુલર માર્કેટપ્લેસ",

            "Sell":
                "વેચો",

            "Buy":
                "ખરીદો",

            "Advertise":
                "જાહેરાત આપો",

            "Community Guidelines":
                "સમુદાય માર્ગદર્શિકા",

            "Contribute":
                "યોગદાન આપો",

            "Contributor Agreement":
                "યોગદાનકર્તા કરાર",

            "Information":
                "માહિતી",

            "Contact":
                "સંપર્ક",

            "Privacy":
                "ગોપનીયતા",

            "Terms":
                "શરતો",

            "Copyright":
                "કૉપિરાઇટ",

            "Select Language":
                "ભાષા પસંદ કરો",

            "Current Language":
                "વર્તમાન ભાષા",

            "Online":
                "ઓનલાઇન",

            "Offline":
                "ઓફલાઇન",

            "Loading":
                "લોડ થઈ રહ્યું છે",

            "Ready":
                "તૈયાર"

        }

    };


    /* =====================================================
       DEBUG
    ====================================================== */

    function debug() {

        if (!CONFIG.debug) {
            return;
        }

        try {

            console.log.apply(
                console,
                [
                    "[ALON TRANSLATE]"
                ].concat(
                    Array.from(arguments)
                )
            );

        } catch (error) {
            /* silent */
        }
    }


    /* =====================================================
       TRANSLATION LOOKUP
    ====================================================== */

    function translate(
        key,
        language
    ) {

        const code =
            normalizeLanguage(
                language ||
                STATE.language
            );


        /*
         * Exact pack.
         */

        if (
            TRANSLATIONS[code] &&
            Object.prototype.hasOwnProperty.call(
                TRANSLATIONS[code],
                key
            )
        ) {

            return TRANSLATIONS[code][key];
        }


        /*
         * Region fallback.
         *
         * Example:
         * es-MX -> es
         * pt-BR -> pt
         */

        const short =
            code
                .split("-")[0]
                .toLowerCase();


        if (
            TRANSLATIONS[short] &&
            Object.prototype.hasOwnProperty.call(
                TRANSLATIONS[short],
                key
            )
        ) {

            return TRANSLATIONS[short][key];
        }


        /*
         * English fallback.
         */

        if (
            TRANSLATIONS.en &&
            Object.prototype.hasOwnProperty.call(
                TRANSLATIONS.en,
                key
            )
        ) {

            return TRANSLATIONS.en[key];
        }


        return key;
    }


    /* =====================================================
       EXACT TEXT TRANSLATION
    ====================================================== */

    function translateExactText(
        text,
        language
    ) {

        if (!text) {
            return text;
        }


        const code =
            normalizeLanguage(
                language ||
                STATE.language
            );


        /*
         * English should always restore original English.
         */

        if (
            code === "en"
        ) {

            return text;
        }


        const dictionary =
            EXACT_TEXT[code];


        if (
            dictionary &&
            Object.prototype.hasOwnProperty.call(
                dictionary,
                text
            )
        ) {

            return dictionary[text];
        }


        const short =
            code
                .split("-")[0]
                .toLowerCase();


        if (
            EXACT_TEXT[short] &&
            Object.prototype.hasOwnProperty.call(
                EXACT_TEXT[short],
                text
            )
        ) {

            return EXACT_TEXT[short][text];
        }


        return text;
    }


    /* =====================================================
       ORIGINAL TEXT STORAGE
    ====================================================== */

    function rememberText(
        element
    ) {

        if (!element) {
            return;
        }


        if (
            !element.hasAttribute(
                CONFIG.originalTextAttribute
            )
        ) {

            element.setAttribute(
                CONFIG.originalTextAttribute,
                element.textContent
            );
        }

    }


    function restoreOriginalText(
        element
    ) {

        if (
            !element ||
            !element.hasAttribute(
                CONFIG.originalTextAttribute
            )
        ) {

            return;
        }


        element.textContent =
            element.getAttribute(
                CONFIG.originalTextAttribute
            );
    }


    /* =====================================================
       PLACEHOLDER ORIGINAL
    ====================================================== */

    function rememberPlaceholder(
        element
    ) {

        if (
            !element ||
            !element.hasAttribute(
                "placeholder"
            )
        ) {

            return;
        }


        if (
            !element.hasAttribute(
                CONFIG.originalPlaceholderAttribute
            )
        ) {

            element.setAttribute(
                CONFIG.originalPlaceholderAttribute,
                element.getAttribute(
                    "placeholder"
                )
            );
        }

    }


    function restorePlaceholder(
        element
    ) {

        if (
            element &&
            element.hasAttribute(
                CONFIG.originalPlaceholderAttribute
            )
        ) {

            element.setAttribute(
                "placeholder",
                element.getAttribute(
                    CONFIG.originalPlaceholderAttribute
                )
            );
        }

    }


    /* =====================================================
       TITLE ORIGINAL
    ====================================================== */

    function rememberTitle(
        element
    ) {

        if (
            !element ||
            !element.hasAttribute(
                "title"
            )
        ) {

            return;
        }


        if (
            !element.hasAttribute(
                CONFIG.originalTitleAttribute
            )
        ) {

            element.setAttribute(
                CONFIG.originalTitleAttribute,
                element.getAttribute(
                    "title"
                )
            );
        }

    }


    function restoreTitle(
        element
    ) {

        if (
            element &&
            element.hasAttribute(
                CONFIG.originalTitleAttribute
            )
        ) {

            element.setAttribute(
                "title",
                element.getAttribute(
                    CONFIG.originalTitleAttribute
                )
            );
        }

    }


    /* =====================================================
       ARIA ORIGINAL
    ====================================================== */

    function rememberAria(
        element
    ) {

        if (
            !element ||
            !element.hasAttribute(
                "aria-label"
            )
        ) {

            return;
        }


        if (
            !element.hasAttribute(
                CONFIG.originalAriaAttribute
            )
        ) {

            element.setAttribute(
                CONFIG.originalAriaAttribute,
                element.getAttribute(
                    "aria-label"
                )
            );
        }

    }


    function restoreAria(
        element
    ) {

        if (
            element &&
            element.hasAttribute(
                CONFIG.originalAriaAttribute
            )
        ) {

            element.setAttribute(
                "aria-label",
                element.getAttribute(
                    CONFIG.originalAriaAttribute
                )
            );
        }

    }


    /* =====================================================
       TRANSLATE DATA ATTRIBUTES
    ====================================================== */

    function translateDataAttributes(
        element,
        language
    ) {

        if (!element) {
            return;
        }


        /*
         * data-translate
         */

        if (
            element.hasAttribute(
                CONFIG.translateAttribute
            )
        ) {

            const key =
                element.getAttribute(
                    CONFIG.translateAttribute
                );


            const value =
                translate(
                    key,
                    language
                );


            if (
                value &&
                value !== key
            ) {

                element.textContent =
                    value;
            }

        }


        /*
         * placeholder
         */

        if (
            element.hasAttribute(
                CONFIG.placeholderAttribute
            )
        ) {

            rememberPlaceholder(
                element
            );


            const key =
                element.getAttribute(
                    CONFIG.placeholderAttribute
                );


            element.setAttribute(
                "placeholder",
                translate(
                    key,
                    language
                )
            );
        }


        /*
         * title
         */

        if (
            element.hasAttribute(
                CONFIG.titleAttribute
            )
        ) {

            rememberTitle(
                element
            );


            const key =
                element.getAttribute(
                    CONFIG.titleAttribute
                );


            element.setAttribute(
                "title",
                translate(
                    key,
                    language
                )
            );
        }


        /*
         * aria-label
         */

        if (
            element.hasAttribute(
                CONFIG.ariaAttribute
            )
        ) {

            rememberAria(
                element
            );


            const key =
                element.getAttribute(
                    CONFIG.ariaAttribute
                );


            element.setAttribute(
                "aria-label",
                translate(
                    key,
                    language
                )
            );
        }

    }


    /* =====================================================
       TRANSLATE EXACT VISIBLE TEXT
    ====================================================== */

    function translateVisibleText(
        element,
        language
    ) {

        if (!element) {
            return;
        }


        /*
         * Do not touch inputs with user data.
         */

        const tag =
            element.tagName
                ? element.tagName.toLowerCase()
                : "";


        if (
            tag === "input" ||
            tag === "textarea"
        ) {

            return;
        }


        /*
         * Only simple text elements.
         *
         * This prevents us from destroying complex
         * HTML inside cards/components.
         */

        if (
            element.children &&
            element.children.length > 0
        ) {

            return;
        }


        const original =
            element.textContent;


        if (
            !original ||
            !original.trim()
        ) {

            return;
        }


        rememberText(
            element
        );


        const clean =
            original.trim();


        /*
         * English = restore original.
         */

        if (
            normalizeLanguage(
                language
            ) === "en"
        ) {

            restoreOriginalText(
                element
            );

            return;
        }


        const translated =
            translateExactText(
                clean,
                language
            );


        if (
            translated !== clean
        ) {

            /*
             * Preserve surrounding whitespace.
             */

            const leading =
                original.match(
                    /^\s*/
                );

            const trailing =
                original.match(
                    /\s*$/
                );


            element.textContent =
                (leading
                    ? leading[0]
                    : "") +
                translated +
                (trailing
                    ? trailing[0]
                    : "");
        }

    }


    /* =====================================================
       TRANSLATE ELEMENT
    ====================================================== */

    function translateElement(
        element,
        language
    ) {

        if (!element) {
            return;
        }


        const code =
            normalizeLanguage(
                language ||
                STATE.language
            );


        translateDataAttributes(
            element,
            code
        );


        translateVisibleText(
            element,
            code
        );


        /*
         * English restoration for attributes.
         */

        if (
            code === "en"
        ) {

            restorePlaceholder(
                element
            );

            restoreTitle(
                element
            );

            restoreAria(
                element
            );
        }

    }


    /* =====================================================
       TRANSLATE DOCUMENT
    ====================================================== */

    function translateDocument(
        root,
        language
    ) {

        if (STATE.translating) {
            return;
        }


        STATE.translating =
            true;


        try {

            const code =
                normalizeLanguage(
                    language ||
                    STATE.language
                );


            STATE.language =
                code;


            saveLanguage(
                code
            );


            /*
             * HTML language.
             */

            const database =
                getLanguageDatabase();


            const languageInfo =
                database[code];


            if (
                languageInfo
            ) {

                document.documentElement.lang =
                    languageInfo.code ||
                    code;


                document.documentElement.dir =
                    languageInfo.direction ||
                    "ltr";

            } else {

                document.documentElement.lang =
                    code;


                document.documentElement.dir =
                    isRTL(code)
                        ? "rtl"
                        : "ltr";
            }


            /*
             * Root selection.
             */

            const container =
                root || document;


            /*
             * Explicit translation elements.
             */

            const explicit =
                container.querySelectorAll
                    ? container.querySelectorAll(
                        "[" +
                        CONFIG.translateAttribute +
                        "]," +
                        "[" +
                        CONFIG.placeholderAttribute +
                        "]," +
                        "[" +
                        CONFIG.titleAttribute +
                        "]," +
                        "[" +
                        CONFIG.ariaAttribute +
                        "]"
                    )
                    : [];


            explicit.forEach(
                function (element) {

                    translateDataAttributes(
                        element,
                        code
                    );

                }
            );


            /*
             * Existing visible UI.
             */

            const visible =
                container.querySelectorAll
                    ? container.querySelectorAll(
                        "h1,h2,h3,h4,h5,h6," +
                        "p,a,button,label," +
                        "small,strong,li," +
                        "option"
                    )
                    : [];


            visible.forEach(
                function (element) {

                    translateVisibleText(
                        element,
                        code
                    );

                }
            );


            /*
             * Root itself.
             */

            if (
                container.nodeType === 1
            ) {

                translateElement(
                    container,
                    code
                );
            }


            debug(
                "Translated:",
                code
            );

        } finally {

            STATE.translating =
                false;
        }

    }


    /* =====================================================
       RTL
    ====================================================== */

    function isRTL(
        language
    ) {

        const database =
            getLanguageDatabase();


        const code =
            normalizeLanguage(
                language
            );


        if (
            database[code]
        ) {

            return (
                database[code]
                    .direction === "rtl"
            );
        }


        const short =
            code
                .split("-")[0]
                .toLowerCase();


        return [
            "ar",
            "fa",
            "he",
            "ur",
            "ps"
        ].includes(
            short
        );

    }


    /* =====================================================
       REAL WORLD LANGUAGE EVENT
       -----------------------------------------------------
       THIS IS THE IMPORTANT CONNECTION.

       world-language.js dispatches on DOCUMENT:

       alon:world-language-change
    ====================================================== */

    function connectWorldLanguage() {

        document.addEventListener(
            "alon:world-language-change",
            function (event) {

                let code = null;


                if (
                    event &&
                    event.detail
                ) {

                    code =
                        event.detail.code;


                    if (!code) {

                        const language =
                            event.detail.language;


                        if (
                            language &&
                            typeof language ===
                                "object"
                        ) {

                            code =
                                language.code;
                        }
                    }
                }


                code =
                    normalizeLanguage(
                        code ||
                        getLanguage()
                    );


                STATE.language =
                    code;


                saveLanguage(
                    code
                );


                translateDocument(
                    document,
                    code
                );


                debug(
                    "World language changed:",
                    code
                );

            }
        );

    }


    /* =====================================================
       STORAGE EVENT
    ====================================================== */

    function connectStorage() {

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key !==
                    CONFIG.storageKey
                ) {

                    return;
                }


                const code =
                    normalizeLanguage(
                        event.newValue ||
                        CONFIG.defaultLanguage
                    );


                STATE.language =
                    code;


                translateDocument(
                    document,
                    code
                );

            }
        );

    }


    /* =====================================================
       MUTATION OBSERVER
       -----------------------------------------------------
       Dynamic cards/content are translated after they
       appear.
    ====================================================== */

    function connectObserver() {

        if (
            typeof MutationObserver ===
            "undefined"
        ) {

            return;
        }


        if (
            STATE.observer
        ) {

            return;
        }


        let timer =
            null;


        STATE.observer =
            new MutationObserver(
                function (mutations) {

                    let added =
                        false;


                    for (
                        let i = 0;
                        i < mutations.length;
                        i++
                    ) {

                        if (
                            mutations[i]
                                .type ===
                                "childList" &&
                            mutations[i]
                                .addedNodes &&
                            mutations[i]
                                .addedNodes
                                .length
                        ) {

                            added =
                                true;

                            break;
                        }
                    }


                    if (!added) {
                        return;
                    }


                    clearTimeout(
                        timer
                    );


                    timer =
                        setTimeout(
                            function () {

                                translateDocument(
                                    document,
                                    STATE.language
                                );

                            },
                            80
                        );

                }
            );


        STATE.observer.observe(
            document.body ||
            document.documentElement,
            {
                childList:
                    true,

                subtree:
                    true
            }
        );

    }


    /* =====================================================
       PUBLIC SET LANGUAGE
    ====================================================== */

    function setLanguage(
        language
    ) {

        const code =
            normalizeLanguage(
                language
            );


        STATE.language =
            code;


        saveLanguage(
            code
        );


        /*
         * If world-language.js is available,
         * use its official selector engine.
         */

        try {

            if (
                window.ALON_WORLD_LANGUAGE &&
                typeof window
                    .ALON_WORLD_LANGUAGE
                    .select ===
                    "function"
            ) {

                window
                    .ALON_WORLD_LANGUAGE
                    .select(
                        code
                    );

                return code;
            }

        } catch (error) {

            debug(
                "Official language engine select failed.",
                error
            );
        }


        /*
         * Fallback.
         */

        translateDocument(
            document,
            code
        );


        try {

            window.dispatchEvent(
                new CustomEvent(
                    "alon:languageChanged",
                    {
                        detail: {
                            language:
                                code
                        }
                    }
                )
            );

        } catch (error) {

            /* silent */
        }


        return code;
    }


    /* =====================================================
       REFRESH
    ====================================================== */

    function refresh() {

        translateDocument(
            document,
            getLanguage()
        );

    }


    /* =====================================================
       INITIALIZE
    ====================================================== */

    function initialize() {

        if (
            STATE.initialized
        ) {

            return;
        }


        /*
         * Existing World Language engine should already
         * be loaded because this file is loaded AFTER it.
         */

        STATE.language =
            getLanguage();


        saveLanguage(
            STATE.language
        );


        /*
         * Connect FIRST so no language-change event is lost.
         */

        connectWorldLanguage();

        connectStorage();


        /*
         * Initial translation.
         */

        translateDocument(
            document,
            STATE.language
        );


        /*
         * Dynamic content.
         */

        connectObserver();


        STATE.initialized =
            true;


        debug(
            "WORLD LANGUAGE TRANSLATION ENGINE READY",
            {
                version:
                    CONFIG.version,

                language:
                    STATE.language,

                availableLanguages:
                    Object.keys(
                        getLanguageDatabase()
                    ).length,

                translationPacks:
                    Object.keys(
                        TRANSLATIONS
                    )

            }
        );

    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    window.ALON_WORLD_TRANSLATE = {

        version:
            CONFIG.version,

        config:
            CONFIG,

        state:
            STATE,

        translations:
            TRANSLATIONS,

        languageDatabase:
            function () {

                return getLanguageDatabase();

            },

        getLanguage:
            getLanguage,

        normalizeLanguage:
            normalizeLanguage,

        translate:
            translate,

        translateExactText:
            translateExactText,

        translateElement:
            translateElement,

        translateDocument:
            translateDocument,

        setLanguage:
            setLanguage,

        refresh:
            refresh

    };


    /* =====================================================
       START
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once:
                    true
            }
        );

    } else {

        initialize();

    }


})();