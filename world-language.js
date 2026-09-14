/* =========================================================
   ALON HISTORYVERSE 24
   WORLD LANGUAGE ENGINE
   Version: 24.1
   Creator: Baba Thecno Guru

   FEATURES
   ---------------------------------------------------------
   - World language catalogue
   - Indian States / UT language catalogue
   - Language search
   - Three-dot/mobile menu integration
   - Per-user / per-browser language preference
   - localStorage persistence
   - RTL support
   - HTML lang / dir update
   - Language change events
   - Existing language-button compatibility
   - No server-side/global language change

   STORAGE
   ---------------------------------------------------------
   alon_historyverse_language

   IMPORTANT
   ---------------------------------------------------------
   Language preference is stored ONLY in the current
   user's browser/device localStorage.

   It does NOT change the language for other users.

   NOTE:
   This engine provides language selection and locale
   infrastructure. Actual translation of arbitrary website
   content requires translation strings/data to be supplied
   by the website translation layer.
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {

        project:
            "ALON HISTORYVERSE 24",

        creator:
            "Baba Thecno Guru",

        version:
            "24.1",

        storageKey:
            "alon_historyverse_language",

        defaultLanguage:
            "en",

        selectorId:
            "alonWorldLanguageModal",

        buttonId:
            "worldLanguageButton",

        menuItemId:
            "alonWorldLanguageMenuItem",

        menuText:
            "World Languages"

    };


    /* =====================================================
       WORLD LANGUAGE DATABASE
       -----------------------------------------------------
       Includes major world languages + Indian languages.
    ====================================================== */

    const WORLD_LANGUAGE_CONFIG = {

        /* -------------------------------------------------
           ENGLISH
        ------------------------------------------------- */

        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            region: "World",
            direction: "ltr"
        },


        /* =================================================
           INDIA
        ================================================= */

        hi: {
            code: "hi",
            name: "Hindi",
            nativeName: "हिन्दी",
            region: "India",
            direction: "ltr"
        },

        as: {
            code: "as",
            name: "Assamese",
            nativeName: "অসমীয়া",
            region: "Assam, India",
            direction: "ltr"
        },

        bn: {
            code: "bn",
            name: "Bengali",
            nativeName: "বাংলা",
            region: "West Bengal / Tripura / Bangladesh",
            direction: "ltr"
        },

        brx: {
            code: "brx",
            name: "Bodo",
            nativeName: "बड़ो",
            region: "Assam, India",
            direction: "ltr"
        },

        doi: {
            code: "doi",
            name: "Dogri",
            nativeName: "डोगरी",
            region: "Jammu and Kashmir, India",
            direction: "ltr"
        },

        gu: {
            code: "gu",
            name: "Gujarati",
            nativeName: "ગુજરાતી",
            region: "Gujarat, India",
            direction: "ltr"
        },

        kn: {
            code: "kn",
            name: "Kannada",
            nativeName: "ಕನ್ನಡ",
            region: "Karnataka, India",
            direction: "ltr"
        },

        ks: {
            code: "ks",
            name: "Kashmiri",
            nativeName: "कॉशुर / کٲشُر",
            region: "Jammu and Kashmir, India",
            direction: "ltr"
        },

        kok: {
            code: "kok",
            name: "Konkani",
            nativeName: "कोंकणी",
            region: "Goa / Maharashtra / Karnataka, India",
            direction: "ltr"
        },

        mai: {
            code: "mai",
            name: "Maithili",
            nativeName: "मैथिली",
            region: "Bihar / Jharkhand, India",
            direction: "ltr"
        },

        ml: {
            code: "ml",
            name: "Malayalam",
            nativeName: "മലയാളം",
            region: "Kerala, India",
            direction: "ltr"
        },

        mni: {
            code: "mni",
            name: "Meitei",
            nativeName: "ꯃꯤꯇꯩ",
            region: "Manipur, India",
            direction: "ltr"
        },

        mr: {
            code: "mr",
            name: "Marathi",
            nativeName: "मराठी",
            region: "Maharashtra, India",
            direction: "ltr"
        },

        ne: {
            code: "ne",
            name: "Nepali",
            nativeName: "नेपाली",
            region: "Sikkim / West Bengal / Nepal",
            direction: "ltr"
        },

        or: {
            code: "or",
            name: "Odia",
            nativeName: "ଓଡ଼ିଆ",
            region: "Odisha, India",
            direction: "ltr"
        },

        pa: {
            code: "pa",
            name: "Punjabi",
            nativeName: "ਪੰਜਾਬੀ",
            region: "Punjab, India / Pakistan",
            direction: "ltr"
        },

        sa: {
            code: "sa",
            name: "Sanskrit",
            nativeName: "संस्कृतम्",
            region: "India",
            direction: "ltr"
        },

        sat: {
            code: "sat",
            name: "Santali",
            nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
            region: "Jharkhand / Odisha / West Bengal / India",
            direction: "ltr"
        },

        sd: {
            code: "sd",
            name: "Sindhi",
            nativeName: "सिन्धी / سنڌي",
            region: "India / Pakistan",
            direction: "ltr"
        },

        ta: {
            code: "ta",
            name: "Tamil",
            nativeName: "தமிழ்",
            region: "Tamil Nadu / Puducherry / Sri Lanka",
            direction: "ltr"
        },

        te: {
            code: "te",
            name: "Telugu",
            nativeName: "తెలుగు",
            region: "Andhra Pradesh / Telangana, India",
            direction: "ltr"
        },

        ur: {
            code: "ur",
            name: "Urdu",
            nativeName: "اردو",
            region: "India / Pakistan",
            direction: "rtl"
        },

        /* Additional Indian regional languages */

        awa: {
            code: "awa",
            name: "Awadhi",
            nativeName: "अवधी",
            region: "North India",
            direction: "ltr"
        },

        bho: {
            code: "bho",
            name: "Bhojpuri",
            nativeName: "भोजपुरी",
            region: "Bihar / Uttar Pradesh / Jharkhand",
            direction: "ltr"
        },

        raj: {
            code: "raj",
            name: "Rajasthani",
            nativeName: "राजस्थानी",
            region: "Rajasthan, India",
            direction: "ltr"
        },

        hif: {
            code: "hif",
            name: "Fiji Hindi",
            nativeName: "फ़िजी हिन्दी",
            region: "Fiji",
            direction: "ltr"
        },


        /* =================================================
           EUROPE
        ================================================= */

        sq: {
            code: "sq",
            name: "Albanian",
            nativeName: "Shqip",
            region: "Albania / Balkans",
            direction: "ltr"
        },

        hy: {
            code: "hy",
            name: "Armenian",
            nativeName: "Հայերեն",
            region: "Armenia",
            direction: "ltr"
        },

        az: {
            code: "az",
            name: "Azerbaijani",
            nativeName: "Azərbaycan dili",
            region: "Azerbaijan",
            direction: "ltr"
        },

        eu: {
            code: "eu",
            name: "Basque",
            nativeName: "Euskara",
            region: "Spain / France",
            direction: "ltr"
        },

        be: {
            code: "be",
            name: "Belarusian",
            nativeName: "Беларуская",
            region: "Belarus",
            direction: "ltr"
        },

        bs: {
            code: "bs",
            name: "Bosnian",
            nativeName: "Bosanski",
            region: "Bosnia and Herzegovina",
            direction: "ltr"
        },

        bg: {
            code: "bg",
            name: "Bulgarian",
            nativeName: "Български",
            region: "Bulgaria",
            direction: "ltr"
        },

        ca: {
            code: "ca",
            name: "Catalan",
            nativeName: "Català",
            region: "Spain / Europe",
            direction: "ltr"
        },

        hr: {
            code: "hr",
            name: "Croatian",
            nativeName: "Hrvatski",
            region: "Croatia",
            direction: "ltr"
        },

        cs: {
            code: "cs",
            name: "Czech",
            nativeName: "Čeština",
            region: "Czech Republic",
            direction: "ltr"
        },

        da: {
            code: "da",
            name: "Danish",
            nativeName: "Dansk",
            region: "Denmark",
            direction: "ltr"
        },

        nl: {
            code: "nl",
            name: "Dutch",
            nativeName: "Nederlands",
            region: "Netherlands / Belgium",
            direction: "ltr"
        },

        et: {
            code: "et",
            name: "Estonian",
            nativeName: "Eesti",
            region: "Estonia",
            direction: "ltr"
        },

        fi: {
            code: "fi",
            name: "Finnish",
            nativeName: "Suomi",
            region: "Finland",
            direction: "ltr"
        },

        fr: {
            code: "fr",
            name: "French",
            nativeName: "Français",
            region: "France / World",
            direction: "ltr"
        },

        gl: {
            code: "gl",
            name: "Galician",
            nativeName: "Galego",
            region: "Spain",
            direction: "ltr"
        },

        ka: {
            code: "ka",
            name: "Georgian",
            nativeName: "ქართული",
            region: "Georgia",
            direction: "ltr"
        },

        de: {
            code: "de",
            name: "German",
            nativeName: "Deutsch",
            region: "Germany / Europe",
            direction: "ltr"
        },

        el: {
            code: "el",
            name: "Greek",
            nativeName: "Ελληνικά",
            region: "Greece / Cyprus",
            direction: "ltr"
        },

        hu: {
            code: "hu",
            name: "Hungarian",
            nativeName: "Magyar",
            region: "Hungary",
            direction: "ltr"
        },

        is: {
            code: "is",
            name: "Icelandic",
            nativeName: "Íslenska",
            region: "Iceland",
            direction: "ltr"
        },

        ga: {
            code: "ga",
            name: "Irish",
            nativeName: "Gaeilge",
            region: "Ireland",
            direction: "ltr"
        },

        it: {
            code: "it",
            name: "Italian",
            nativeName: "Italiano",
            region: "Italy",
            direction: "ltr"
        },

        lv: {
            code: "lv",
            name: "Latvian",
            nativeName: "Latviešu",
            region: "Latvia",
            direction: "ltr"
        },

        lt: {
            code: "lt",
            name: "Lithuanian",
            nativeName: "Lietuvių",
            region: "Lithuania",
            direction: "ltr"
        },

        lb: {
            code: "lb",
            name: "Luxembourgish",
            nativeName: "Lëtzebuergesch",
            region: "Luxembourg",
            direction: "ltr"
        },

        mk: {
            code: "mk",
            name: "Macedonian",
            nativeName: "Македонски",
            region: "North Macedonia",
            direction: "ltr"
        },

        mt: {
            code: "mt",
            name: "Maltese",
            nativeName: "Malti",
            region: "Malta",
            direction: "ltr"
        },

        no: {
            code: "no",
            name: "Norwegian",
            nativeName: "Norsk",
            region: "Norway",
            direction: "ltr"
        },

        pl: {
            code: "pl",
            name: "Polish",
            nativeName: "Polski",
            region: "Poland",
            direction: "ltr"
        },

        pt: {
            code: "pt",
            name: "Portuguese",
            nativeName: "Português",
            region: "Portugal / Brazil / World",
            direction: "ltr"
        },

        ro: {
            code: "ro",
            name: "Romanian",
            nativeName: "Română",
            region: "Romania / Moldova",
            direction: "ltr"
        },

        ru: {
            code: "ru",
            name: "Russian",
            nativeName: "Русский",
            region: "Russia / Eastern Europe",
            direction: "ltr"
        },

        sr: {
            code: "sr",
            name: "Serbian",
            nativeName: "Српски",
            region: "Serbia / Balkans",
            direction: "ltr"
        },

        sk: {
            code: "sk",
            name: "Slovak",
            nativeName: "Slovenčina",
            region: "Slovakia",
            direction: "ltr"
        },

        sl: {
            code: "sl",
            name: "Slovenian",
            nativeName: "Slovenščina",
            region: "Slovenia",
            direction: "ltr"
        },

        es: {
            code: "es",
            name: "Spanish",
            nativeName: "Español",
            region: "Spain / Americas / World",
            direction: "ltr"
        },

        sv: {
            code: "sv",
            name: "Swedish",
            nativeName: "Svenska",
            region: "Sweden",
            direction: "ltr"
        },

        uk: {
            code: "uk",
            name: "Ukrainian",
            nativeName: "Українська",
            region: "Ukraine",
            direction: "ltr"
        },

        cy: {
            code: "cy",
            name: "Welsh",
            nativeName: "Cymraeg",
            region: "Wales",
            direction: "ltr"
        },


        /* =================================================
           MIDDLE EAST / CENTRAL ASIA
        ================================================= */

        ar: {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            region: "Middle East / North Africa",
            direction: "rtl"
        },

        fa: {
            code: "fa",
            name: "Persian",
            nativeName: "فارسی",
            region: "Iran / Afghanistan",
            direction: "rtl"
        },

        he: {
            code: "he",
            name: "Hebrew",
            nativeName: "עברית",
            region: "Israel",
            direction: "rtl"
        },

        ps: {
            code: "ps",
            name: "Pashto",
            nativeName: "پښتو",
            region: "Afghanistan / Pakistan",
            direction: "rtl"
        },

        ku: {
            code: "ku",
            name: "Kurdish",
            nativeName: "Kurdî",
            region: "Middle East",
            direction: "ltr"
        },

        tr: {
            code: "tr",
            name: "Turkish",
            nativeName: "Türkçe",
            region: "Türkiye / Europe",
            direction: "ltr"
        },

        ur: {
            code: "ur",
            name: "Urdu",
            nativeName: "اردو",
            region: "South Asia",
            direction: "rtl"
        },

        uz: {
            code: "uz",
            name: "Uzbek",
            nativeName: "Oʻzbekcha",
            region: "Uzbekistan / Central Asia",
            direction: "ltr"
        },

        kk: {
            code: "kk",
            name: "Kazakh",
            nativeName: "Қазақша",
            region: "Kazakhstan",
            direction: "ltr"
        },

        ky: {
            code: "ky",
            name: "Kyrgyz",
            nativeName: "Кыргызча",
            region: "Kyrgyzstan",
            direction: "ltr"
        },

        tg: {
            code: "tg",
            name: "Tajik",
            nativeName: "Тоҷикӣ",
            region: "Tajikistan",
            direction: "ltr"
        },

        tk: {
            code: "tk",
            name: "Turkmen",
            nativeName: "Türkmençe",
            region: "Turkmenistan",
            direction: "ltr"
        },


        /* =================================================
           EAST ASIA
        ================================================= */

        zh: {
            code: "zh",
            name: "Chinese",
            nativeName: "中文",
            region: "China / Taiwan / Singapore",
            direction: "ltr"
        },

        ja: {
            code: "ja",
            name: "Japanese",
            nativeName: "日本語",
            region: "Japan",
            direction: "ltr"
        },

        ko: {
            code: "ko",
            name: "Korean",
            nativeName: "한국어",
            region: "Korea",
            direction: "ltr"
        },

        mn: {
            code: "mn",
            name: "Mongolian",
            nativeName: "Монгол",
            region: "Mongolia",
            direction: "ltr"
        },


        /* =================================================
           SOUTH EAST ASIA
        ================================================= */

        th: {
            code: "th",
            name: "Thai",
            nativeName: "ไทย",
            region: "Thailand",
            direction: "ltr"
        },

        vi: {
            code: "vi",
            name: "Vietnamese",
            nativeName: "Tiếng Việt",
            region: "Vietnam",
            direction: "ltr"
        },

        id: {
            code: "id",
            name: "Indonesian",
            nativeName: "Bahasa Indonesia",
            region: "Indonesia",
            direction: "ltr"
        },

        ms: {
            code: "ms",
            name: "Malay",
            nativeName: "Bahasa Melayu",
            region: "Malaysia / Brunei / Singapore",
            direction: "ltr"
        },

        tl: {
            code: "tl",
            name: "Filipino",
            nativeName: "Filipino",
            region: "Philippines",
            direction: "ltr"
        },

        my: {
            code: "my",
            name: "Burmese",
            nativeName: "မြန်မာ",
            region: "Myanmar",
            direction: "ltr"
        },

        km: {
            code: "km",
            name: "Khmer",
            nativeName: "ខ្មែរ",
            region: "Cambodia",
            direction: "ltr"
        },

        lo: {
            code: "lo",
            name: "Lao",
            nativeName: "ລາວ",
            region: "Laos",
            direction: "ltr"
        },


        /* =================================================
           AFRICA
        ================================================= */

        sw: {
            code: "sw",
            name: "Swahili",
            nativeName: "Kiswahili",
            region: "East Africa",
            direction: "ltr"
        },

        am: {
            code: "am",
            name: "Amharic",
            nativeName: "አማርኛ",
            region: "Ethiopia",
            direction: "ltr"
        },

        ha: {
            code: "ha",
            name: "Hausa",
            nativeName: "Hausa",
            region: "West Africa",
            direction: "ltr"
        },

        yo: {
            code: "yo",
            name: "Yoruba",
            nativeName: "Yorùbá",
            region: "Nigeria / West Africa",
            direction: "ltr"
        },

        ig: {
            code: "ig",
            name: "Igbo",
            nativeName: "Igbo",
            region: "Nigeria",
            direction: "ltr"
        },

        zu: {
            code: "zu",
            name: "Zulu",
            nativeName: "isiZulu",
            region: "South Africa",
            direction: "ltr"
        },

        xh: {
            code: "xh",
            name: "Xhosa",
            nativeName: "isiXhosa",
            region: "South Africa",
            direction: "ltr"
        },

        af: {
            code: "af",
            name: "Afrikaans",
            nativeName: "Afrikaans",
            region: "South Africa / Namibia",
            direction: "ltr"
        },

        so: {
            code: "so",
            name: "Somali",
            nativeName: "Soomaali",
            region: "Somalia / Horn of Africa",
            direction: "ltr"
        },

        rw: {
            code: "rw",
            name: "Kinyarwanda",
            nativeName: "Ikinyarwanda",
            region: "Rwanda",
            direction: "ltr"
        },


        /* =================================================
           AMERICAS
        ================================================= */

        en_us: {
            code: "en-US",
            name: "English (United States)",
            nativeName: "English (US)",
            region: "United States",
            direction: "ltr"
        },

        en_gb: {
            code: "en-GB",
            name: "English (United Kingdom)",
            nativeName: "English (UK)",
            region: "United Kingdom",
            direction: "ltr"
        },

        es_mx: {
            code: "es-MX",
            name: "Spanish (Mexico)",
            nativeName: "Español (México)",
            region: "Mexico",
            direction: "ltr"
        },

        pt_br: {
            code: "pt-BR",
            name: "Portuguese (Brazil)",
            nativeName: "Português (Brasil)",
            region: "Brazil",
            direction: "ltr"
        },

        fr_ca: {
            code: "fr-CA",
            name: "French (Canada)",
            nativeName: "Français (Canada)",
            region: "Canada",
            direction: "ltr"
        },

        qu: {
            code: "qu",
            name: "Quechua",
            nativeName: "Runa Simi",
            region: "South America",
            direction: "ltr"
        },

        gn: {
            code: "gn",
            name: "Guarani",
            nativeName: "Avañe'ẽ",
            region: "Paraguay / South America",
            direction: "ltr"
        },


        /* =================================================
           OCEANIA
        ================================================= */

        mi: {
            code: "mi",
            name: "Māori",
            nativeName: "Te Reo Māori",
            region: "New Zealand",
            direction: "ltr"
        },

        sm: {
            code: "sm",
            name: "Samoan",
            nativeName: "Gagana Samoa",
            region: "Samoa / Pacific",
            direction: "ltr"
        },

        to: {
            code: "to",
            name: "Tongan",
            nativeName: "Lea Faka-Tonga",
            region: "Tonga / Pacific",
            direction: "ltr"
        },


        /* =================================================
           HISTORICAL / CLASSICAL
        ================================================= */

        la: {
            code: "la",
            name: "Latin",
            nativeName: "Latina",
            region: "Historical / Classical",
            direction: "ltr"
        },

        grc: {
            code: "grc",
            name: "Ancient Greek",
            nativeName: "Ἀρχαία ἑλληνικὴ",
            region: "Historical / Classical",
            direction: "ltr"
        }

    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {

        initialized:
            false,

        currentLanguage:
            CONFIG.defaultLanguage,

        modalOpen:
            false,

        menuItemCreated:
            false
    };


    /* =====================================================
       HELPERS
    ====================================================== */

    function $(selector, root) {

        return (
            root || document
        ).querySelector(
            selector
        );
    }


    function $$(selector, root) {

        return Array.from(
            (
                root || document
            ).querySelectorAll(
                selector
            )
        );
    }


    function escapeHTML(value) {

        return String(
            value ?? ""
        )
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


    /* =====================================================
       STORAGE
    ====================================================== */

    function getSavedLanguage() {

        try {

            return localStorage.getItem(
                CONFIG.storageKey
            );

        } catch (error) {

            return null;
        }
    }


    function saveLanguage(code) {

        try {

            localStorage.setItem(
                CONFIG.storageKey,
                code
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    /* =====================================================
       LANGUAGE LOOKUP
    ====================================================== */

    function getLanguage(code) {

        return (
            WORLD_LANGUAGE_CONFIG[
                code
            ] ||
            WORLD_LANGUAGE_CONFIG[
                CONFIG.defaultLanguage
            ]
        );
    }


    function getLanguages() {

        return Object.values(
            WORLD_LANGUAGE_CONFIG
        );
    }


    function isRTL(code) {

        return (
            getLanguage(code)
                .direction === "rtl"
        );
    }


    /* =====================================================
       APPLY LANGUAGE
    ====================================================== */

    function applyLanguage(code) {

        if (
            !WORLD_LANGUAGE_CONFIG[
                code
            ]
        ) {

            code =
                CONFIG.defaultLanguage;
        }


        const language =
            getLanguage(
                code
            );


        STATE.currentLanguage =
            code;


        document.documentElement.lang =
            language.code;


        document.documentElement.dir =
            language.direction;


        document.documentElement.classList.toggle(
            "alon-rtl",
            language.direction === "rtl"
        );


        document.documentElement.dataset.language =
            language.code;


        document.documentElement.dataset.languageName =
            language.name;


        /*
         * Save ONLY on this browser/device.
         */

        saveLanguage(
            code
        );


        updateLanguageButtons(
            language
        );


        updateMenuLanguageLabel(
            language
        );


        try {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:world-language-change",
                    {
                        detail: {

                            code:
                                language.code,

                            language:
                                language,

                            direction:
                                language.direction,

                            localOnly:
                                true
                        }
                    }
                )
            );

        } catch (error) {

            console.warn(
                "ALON WORLD LANGUAGE:",
                error
            );
        }


        return language;
    }


    /* =====================================================
       LANGUAGE BUTTONS
    ====================================================== */

    function updateLanguageButtons(
        language
    ) {

        const buttons =
            $$(
                "[data-world-language-button]"
            );


        buttons.forEach(
            function (button) {

                button.setAttribute(
                    "aria-label",
                    `Language: ${language.name}`
                );

                button.setAttribute(
                    "title",
                    `${language.name} (${language.nativeName})`
                );


                const label =
                    button.querySelector(
                        "[data-language-label]"
                    );


                if (label) {

                    label.textContent =
                        language.nativeName;
                }

            }
        );


        const defaultButton =
            document.getElementById(
                CONFIG.buttonId
            );


        if (defaultButton) {

            defaultButton.setAttribute(
                "aria-label",
                `Language: ${language.name}`
            );

            defaultButton.setAttribute(
                "title",
                `${language.name} (${language.nativeName})`
            );
        }
    }


    /* =====================================================
       THREE-DOT MENU INTEGRATION
    ====================================================== */

    function findMenuContainer() {

        const candidates = [

            "#mobileMenu",

            "#menu",

            ".mobile-menu",

            ".mobileMenu",

            ".ah-mobile-menu",

            ".ah-menu",

            ".menu-panel",

            ".menuPanel",

            "nav"

        ];


        for (
            let i = 0;
            i < candidates.length;
            i++
        ) {

            const element =
                document.querySelector(
                    candidates[i]
                );


            if (element) {

                return element;
            }
        }


        return null;
    }


    function createThreeDotLanguageItem() {

        if (
            document.getElementById(
                CONFIG.menuItemId
            )
        ) {

            STATE.menuItemCreated =
                true;

            return;
        }


        const menu =
            findMenuContainer();


        if (!menu) {

            return;
        }


        const item =
            document.createElement(
                "button"
            );


        item.type =
            "button";


        item.id =
            CONFIG.menuItemId;


        item.className =
            "alon-world-language-menu-item";


        item.setAttribute(
            "type",
            "button"
        );


        item.innerHTML = `
            <span
                class="alon-world-language-menu-icon"
                aria-hidden="true"
            >
                🌐
            </span>

            <span
                class="alon-world-language-menu-text"
            >
                World Languages
            </span>

            <span
                class="alon-world-language-menu-current"
                data-menu-language-current
            >
                English
            </span>
        `;


        item.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                openSelector();

            }
        );


        menu.appendChild(
            item
        );


        STATE.menuItemCreated =
            true;


        addMenuItemStyles();
    }


    function updateMenuLanguageLabel(
        language
    ) {

        const current =
            document.querySelector(
                "[data-menu-language-current]"
            );


        if (current) {

            current.textContent =
                language.nativeName;
        }
    }


    function addMenuItemStyles() {

        if (
            document.getElementById(
                "alonWorldLanguageMenuStyles"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "alonWorldLanguageMenuStyles";


        style.textContent = `

            .alon-world-language-menu-item {

                width: 100%;

                display: flex;

                align-items: center;

                gap: 10px;

                box-sizing: border-box;

                padding: 12px 14px;

                margin: 4px 0;

                border: 1px solid
                    rgba(215,179,90,.28);

                border-radius: 10px;

                background:
                    rgba(255,255,255,.025);

                color:
                    #f0d27a;

                cursor: pointer;

                text-align: left;

                font: inherit;

            }


            .alon-world-language-menu-item:hover {

                border-color:
                    #f0d27a;

                background:
                    rgba(215,179,90,.10);

            }


            .alon-world-language-menu-icon {

                font-size:
                    1.15rem;

                flex:
                    0 0 auto;

            }


            .alon-world-language-menu-text {

                flex:
                    1;

                font-weight:
                    700;

            }


            .alon-world-language-menu-current {

                opacity:
                    .65;

                font-size:
                    .78rem;

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       MODAL STYLES
    ====================================================== */

    function addModalStyles() {

        if (
            document.getElementById(
                "alonWorldLanguageStyles"
            )
        ) {

            return;
        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "alonWorldLanguageStyles";


        style.textContent = `

            .alon-world-language-overlay {

                position:
                    fixed;

                inset:
                    0;

                z-index:
                    99999;

                display:
                    none;

                align-items:
                    center;

                justify-content:
                    center;

                padding:
                    14px;

                box-sizing:
                    border-box;

                background:
                    rgba(0,0,0,.82);

                backdrop-filter:
                    blur(8px);

            }


            .alon-world-language-overlay.open {

                display:
                    flex;

            }


            .alon-world-language-modal {

                width:
                    min(760px,100%);

                max-height:
                    92vh;

                overflow:
                    hidden;

                background:
                    #05080f;

                border:
                    1px solid #d7b35a;

                border-radius:
                    18px;

                box-shadow:
                    0 20px 70px
                    rgba(0,0,0,.70);

                color:
                    #f0d27a;

                display:
                    flex;

                flex-direction:
                    column;

            }


            .alon-world-language-header {

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    space-between;

                gap:
                    12px;

                padding:
                    16px 18px;

                border-bottom:
                    1px solid
                    rgba(215,179,90,.35);

                flex:
                    0 0 auto;

            }


            .alon-world-language-title {

                margin:
                    0;

                font-size:
                    1.15rem;

            }


            .alon-world-language-subtitle {

                margin:
                    4px 0 0;

                font-size:
                    .75rem;

                opacity:
                    .62;

            }


            .alon-world-language-close {

                width:
                    42px;

                height:
                    42px;

                border:
                    1px solid #d7b35a;

                border-radius:
                    10px;

                background:
                    transparent;

                color:
                    #f0d27a;

                cursor:
                    pointer;

                font-size:
                    1.25rem;

                flex:
                    0 0 auto;

            }


            .alon-world-language-search-wrap {

                padding:
                    12px 18px;

                border-bottom:
                    1px solid
                    rgba(215,179,90,.18);

            }


            .alon-world-language-search {

                width:
                    100%;

                box-sizing:
                    border-box;

                padding:
                    12px 14px;

                border:
                    1px solid
                    rgba(215,179,90,.4);

                border-radius:
                    10px;

                outline:
                    none;

                background:
                    rgba(255,255,255,.04);

                color:
                    #fff;

                font: inherit;

            }


            .alon-world-language-search::placeholder {

                color:
                    rgba(255,255,255,.55);

            }


            .alon-world-language-list {

                display:
                    grid;

                grid-template-columns:
                    repeat(
                        auto-fill,
                        minmax(190px,1fr)
                    );

                gap:
                    9px;

                padding:
                    16px;

                overflow-y:
                    auto;

                max-height:
                    65vh;

                overscroll-behavior:
                    contain;

            }


            .alon-world-language-item {

                display:
                    flex;

                flex-direction:
                    column;

                align-items:
                    flex-start;

                justify-content:
                    center;

                gap:
                    3px;

                min-height:
                    76px;

                box-sizing:
                    border-box;

                padding:
                    11px;

                border:
                    1px solid
                    rgba(215,179,90,.28);

                border-radius:
                    12px;

                background:
                    rgba(255,255,255,.025);

                color:
                    #f0d27a;

                cursor:
                    pointer;

                text-align:
                    left;

                transition:
                    .18s ease;

            }


            .alon-world-language-item:hover,
            .alon-world-language-item.active {

                border-color:
                    #f0d27a;

                background:
                    rgba(215,179,90,.11);

                transform:
                    translateY(-1px);

            }


            .alon-world-language-native {

                font-size:
                    1rem;

                font-weight:
                    700;

            }


            .alon-world-language-name {

                font-size:
                    .80rem;

                opacity:
                    .78;

            }


            .alon-world-language-region {

                font-size:
                    .68rem;

                opacity:
                    .52;

            }


            .alon-world-language-empty {

                grid-column:
                    1 / -1;

                padding:
                    30px;

                text-align:
                    center;

                opacity:
                    .65;

            }


            @media (max-width:600px) {

                .alon-world-language-list {

                    grid-template-columns:
                        1fr 1fr;

                    padding:
                        12px;

                }

                .alon-world-language-modal {

                    max-height:
                        95vh;

                    border-radius:
                        14px;

                }

            }


            @media (max-width:390px) {

                .alon-world-language-list {

                    grid-template-columns:
                        1fr;

                }

            }

        `;


        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       CREATE MODAL
    ====================================================== */

    function createModal() {

        if (
            document.getElementById(
                CONFIG.selectorId
            )
        ) {

            return;
        }


        addModalStyles();


        const overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            CONFIG.selectorId;


        overlay.className =
            "alon-world-language-overlay";


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        const modal =
            document.createElement(
                "div"
            );


        modal.className =
            "alon-world-language-modal";


        modal.setAttribute(
            "role",
            "dialog"
        );


        modal.setAttribute(
            "aria-modal",
            "true"
        );


        modal.innerHTML = `

            <div
                class="alon-world-language-header"
            >

                <div>

                    <h2
                        class="alon-world-language-title"
                    >
                        🌐 World Languages
                    </h2>

                    <p
                        class="alon-world-language-subtitle"
                    >
                        Language preference is saved
                        only on this device
                    </p>

                </div>


                <button
                    type="button"
                    class="alon-world-language-close"
                    data-language-close
                    aria-label="Close language selector"
                >
                    ×
                </button>

            </div>


            <div
                class="alon-world-language-search-wrap"
            >

                <input
                    type="search"
                    class="alon-world-language-search"
                    data-language-search
                    placeholder="🔍 Search language..."
                    autocomplete="off"
                    spellcheck="false"
                    aria-label="Search language"
                >

            </div>


            <div
                class="alon-world-language-list"
                data-language-list
            ></div>

        `;


        overlay.appendChild(
            modal
        );


        document.body.appendChild(
            overlay
        );


        renderLanguageList();


        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    closeSelector();
                }

            }
        );


        const closeButton =
            modal.querySelector(
                "[data-language-close]"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSelector
            );
        }


        const search =
            modal.querySelector(
                "[data-language-search]"
            );


        if (search) {

            search.addEventListener(
                "input",
                function () {

                    renderLanguageList(
                        search.value
                    );

                }
            );
        }
    }


    /* =====================================================
       RENDER LANGUAGE LIST
    ====================================================== */

    function renderLanguageList(
        searchText = ""
    ) {

        const list =
            document.querySelector(
                "[data-language-list]"
            );


        if (!list) {

            return;
        }


        const query =
            String(
                searchText
            )
                .trim()
                .toLowerCase();


        const languages =
            getLanguages()
                .filter(
                    function (language) {

                        if (!query) {

                            return true;
                        }


                        const text = [

                            language.code,

                            language.name,

                            language.nativeName,

                            language.region

                        ]
                            .join(" ")
                            .toLowerCase();


                        return text.includes(
                            query
                        );
                    }
                );


        if (!languages.length) {

            list.innerHTML = `

                <div
                    class="alon-world-language-empty"
                >
                    No language found.
                </div>

            `;

            return;
        }


        list.innerHTML =
            languages
                .map(
                    function (language) {

                        const active =
                            language.code ===
                            STATE.currentLanguage;


                        return `

                            <button
                                type="button"
                                class="alon-world-language-item${active ? " active" : ""}"
                                data-language-code="${escapeHTML(language.code)}"
                                aria-pressed="${active ? "true" : "false"}"
                            >

                                <span
                                    class="alon-world-language-native"
                                >
                                    ${escapeHTML(
                                        language.nativeName
                                    )}
                                </span>


                                <span
                                    class="alon-world-language-name"
                                >
                                    ${escapeHTML(
                                        language.name
                                    )}
                                </span>


                                <span
                                    class="alon-world-language-region"
                                >
                                    ${escapeHTML(
                                        language.region
                                    )}
                                </span>

                            </button>

                        `;
                    }
                )
                .join("");


        $$(".alon-world-language-item")
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const code =
                                button.dataset
                                    .languageCode;


                            selectLanguage(
                                code
                            );

                        }
                    );

                }
            );
    }


    /* =====================================================
       OPEN SELECTOR
    ====================================================== */

    function openSelector() {

        createModal();

        createThreeDotLanguageItem();

        renderLanguageList();


        const overlay =
            document.getElementById(
                CONFIG.selectorId
            );


        if (!overlay) {

            return;
        }


        overlay.classList.add(
            "open"
        );


        overlay.setAttribute(
            "aria-hidden",
            "false"
        );


        STATE.modalOpen =
            true;


        document.body.style.overflow =
            "hidden";


        const search =
            overlay.querySelector(
                "[data-language-search]"
            );


        if (search) {

            search.value = "";

            window.setTimeout(
                function () {

                    search.focus();

                },
                50
            );
        }
    }


    /* =====================================================
       CLOSE SELECTOR
    ====================================================== */

    function closeSelector() {

        const overlay =
            document.getElementById(
                CONFIG.selectorId
            );


        if (!overlay) {

            return;
        }


        overlay.classList.remove(
            "open"
        );


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        STATE.modalOpen =
            false;


        document.body.style.overflow =
            "";
    }


    /* =====================================================
       SELECT LANGUAGE
    ====================================================== */

    function selectLanguage(
        code
    ) {

        if (
            !WORLD_LANGUAGE_CONFIG[
                code
            ]
        ) {

            return false;
        }


        applyLanguage(
            code
        );


        renderLanguageList();


        closeSelector();


        return true;
    }


    /* =====================================================
       BIND EXISTING LANGUAGE BUTTONS
    ====================================================== */

    function bindButtons() {

        const buttons =
            $$(
                "[data-world-language-button]"
            );


        buttons.forEach(
            function (button) {

                if (
                    button.dataset
                        .worldLanguageBound ===
                    "true"
                ) {

                    return;
                }


                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        openSelector();

                    }
                );


                button.dataset
                    .worldLanguageBound =
                    "true";

            }
        );


        const defaultButton =
            document.getElementById(
                CONFIG.buttonId
            );


        if (
            defaultButton &&
            defaultButton.dataset
                .worldLanguageBound !==
                "true"
        ) {

            defaultButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openSelector();

                }
            );


            defaultButton.dataset
                .worldLanguageBound =
                "true";
        }
    }


    /* =====================================================
       KEYBOARD
    ====================================================== */

    function bindKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    STATE.modalOpen
                ) {

                    closeSelector();

                }

            }
        );
    }


    /* =====================================================
       MENU RETRY
       -----------------------------------------------------
       Some websites create mobile menu after page load.
    ====================================================== */

    function watchForMenu() {

        createThreeDotLanguageItem();


        const observer =
            new MutationObserver(
                function () {

                    if (
                        !STATE.menuItemCreated
                    ) {

                        createThreeDotLanguageItem();

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


    /* =====================================================
       INITIALIZE
    ====================================================== */

    function initialize() {

        if (
            STATE.initialized
        ) {

            return;
        }


        const saved =
            getSavedLanguage();


        const initial =
            (
                saved &&
                WORLD_LANGUAGE_CONFIG[
                    saved
                ]
            )
                ? saved
                : CONFIG.defaultLanguage;


        applyLanguage(
            initial
        );


        createModal();

        bindButtons();

        bindKeyboard();

        createThreeDotLanguageItem();

        watchForMenu();


        STATE.initialized =
            true;


        try {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:world-language-ready",
                    {
                        detail: {

                            language:
                                getLanguage(
                                    STATE.currentLanguage
                                ),

                            localOnly:
                                true

                        }
                    }
                )
            );

        } catch (error) {

            console.warn(
                "ALON WORLD LANGUAGE:",
                error
            );
        }
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const WORLD_LANGUAGE = {

        config:
            CONFIG,

        state:
            STATE,

        languages:
            WORLD_LANGUAGE_CONFIG,

        initialize:
            initialize,

        open:
            openSelector,

        close:
            closeSelector,

        select:
            selectLanguage,

        apply:
            applyLanguage,

        get:
            getLanguage,

        getCurrent:
            function () {

                return getLanguage(
                    STATE.currentLanguage
                );

            },

        getAll:
            getLanguages,

        isRTL:
            isRTL,

        getCode:
            function () {

                return STATE.currentLanguage;

            },

        getSaved:
            getSavedLanguage

    };


    /* =====================================================
       GLOBAL EXPORTS
    ====================================================== */

    window.WORLD_LANGUAGE_CONFIG =
        WORLD_LANGUAGE_CONFIG;


    window.ALON_WORLD_LANGUAGE =
        WORLD_LANGUAGE;


    window.ALON_WORLD_LANGUAGE_ENGINE =
        WORLD_LANGUAGE;


    window.openWorldLanguageSelector =
        openSelector;


    /* =====================================================
       AUTO START
    ====================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }

})();