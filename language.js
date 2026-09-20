/* =========================================================
   ALON HISTORYVERSE 24
   LANGUAGE ENGINE
   File: jss/language.js
   Creator: Baba Thecno Guru
   Version: 24.2 SAFE LANGUAGE ENGINE
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.2",

        storageKey: "alon_historyverse_language",

        defaultLanguage: "en",

        selectorId: "alonLanguageSelector",
        overlayId: "alonLanguageOverlay",

        buttonSelectors: [
            "#languageBtn",
            "[data-language-button]",
            "[data-open-language]"
        ],

        translationAttribute: "data-i18n",
        placeholderAttribute: "data-i18n-placeholder",
        titleAttribute: "data-i18n-title",
        ariaAttribute: "data-i18n-aria",

        /*
         * Original English text is stored on the DOM node.
         * This prevents Hindi -> English from getting stuck.
         */
        originalTextAttribute: "data-alon-original",

        /*
         * Home is translated normally.
         * Every page therefore follows the selected language.
         */
        homeAlwaysEnglish: false
    };


    /* =====================================================
       WORLD LANGUAGE CONFIG
    ===================================================== */

    const WORLD_LANGUAGE_CONFIG = {

        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            flag: "🇬🇧"
        },

        hi: {
            code: "hi",
            name: "Hindi",
            nativeName: "हिन्दी",
            flag: "🇮🇳"
        },

        bn: {
            code: "bn",
            name: "Bengali",
            nativeName: "বাংলা",
            flag: "🇮🇳"
        },

        gu: {
            code: "gu",
            name: "Gujarati",
            nativeName: "ગુજરાતી",
            flag: "🇮🇳"
        },

        mr: {
            code: "mr",
            name: "Marathi",
            nativeName: "मराठी",
            flag: "🇮🇳"
        },

        ta: {
            code: "ta",
            name: "Tamil",
            nativeName: "தமிழ்",
            flag: "🇮🇳"
        },

        te: {
            code: "te",
            name: "Telugu",
            nativeName: "తెలుగు",
            flag: "🇮🇳"
        },

        kn: {
            code: "kn",
            name: "Kannada",
            nativeName: "ಕನ್ನಡ",
            flag: "🇮🇳"
        },

        ml: {
            code: "ml",
            name: "Malayalam",
            nativeName: "മലയാളം",
            flag: "🇮🇳"
        },

        pa: {
            code: "pa",
            name: "Punjabi",
            nativeName: "ਪੰਜਾਬੀ",
            flag: "🇮🇳"
        },

        ur: {
            code: "ur",
            name: "Urdu",
            nativeName: "اردو",
            flag: "🇵🇰"
        },

        ne: {
            code: "ne",
            name: "Nepali",
            nativeName: "नेपाली",
            flag: "🇳🇵"
        },

        sa: {
            code: "sa",
            name: "Sanskrit",
            nativeName: "संस्कृतम्",
            flag: "🇮🇳"
        },

        es: {
            code: "es",
            name: "Spanish",
            nativeName: "Español",
            flag: "🇪🇸"
        },

        fr: {
            code: "fr",
            name: "French",
            nativeName: "Français",
            flag: "🇫🇷"
        },

        de: {
            code: "de",
            name: "German",
            nativeName: "Deutsch",
            flag: "🇩🇪"
        },

        it: {
            code: "it",
            name: "Italian",
            nativeName: "Italiano",
            flag: "🇮🇹"
        },

        pt: {
            code: "pt",
            name: "Portuguese",
            nativeName: "Português",
            flag: "🇵🇹"
        },

        ru: {
            code: "ru",
            name: "Russian",
            nativeName: "Русский",
            flag: "🇷🇺"
        },

        uk: {
            code: "uk",
            name: "Ukrainian",
            nativeName: "Українська",
            flag: "🇺🇦"
        },

        ar: {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            flag: "🇸🇦"
        },

        fa: {
            code: "fa",
            name: "Persian",
            nativeName: "فارسی",
            flag: "🇮🇷"
        },

        tr: {
            code: "tr",
            name: "Turkish",
            nativeName: "Türkçe",
            flag: "🇹🇷"
        },

        zh: {
            code: "zh",
            name: "Chinese",
            nativeName: "中文",
            flag: "🇨🇳"
        },

        ja: {
            code: "ja",
            name: "Japanese",
            nativeName: "日本語",
            flag: "🇯🇵"
        },

        ko: {
            code: "ko",
            name: "Korean",
            nativeName: "한국어",
            flag: "🇰🇷"
        },

        th: {
            code: "th",
            name: "Thai",
            nativeName: "ไทย",
            flag: "🇹🇭"
        },

        vi: {
            code: "vi",
            name: "Vietnamese",
            nativeName: "Tiếng Việt",
            flag: "🇻🇳"
        },

        id: {
            code: "id",
            name: "Indonesian",
            nativeName: "Bahasa Indonesia",
            flag: "🇮🇩"
        },

        ms: {
            code: "ms",
            name: "Malay",
            nativeName: "Bahasa Melayu",
            flag: "🇲🇾"
        }
    };


    /* =====================================================
       WORLD LANGUAGE ENGINE COMPATIBILITY
    ===================================================== */

    function getActiveLanguageConfig() {

        if (
            window.WORLD_LANGUAGE_CONFIG &&
            typeof window.WORLD_LANGUAGE_CONFIG === "object"
        ) {
            return window.WORLD_LANGUAGE_CONFIG;
        }

        return WORLD_LANGUAGE_CONFIG;
    }


    function getAvailableLanguages() {

        return getActiveLanguageConfig();
    }


    function syncWorldLanguageConfig() {

        const external =
            window.WORLD_LANGUAGE_CONFIG;

        if (
            external &&
            typeof external === "object"
        ) {

            Object.keys(external).forEach(
                function (code) {

                    if (
                        !WORLD_LANGUAGE_CONFIG[code]
                    ) {
                        WORLD_LANGUAGE_CONFIG[code] =
                            external[code];
                    }

                }
            );
        }
    }


    /* =====================================================
       STATE
    ===================================================== */

    let currentLanguage =
        CONFIG.defaultLanguage;

    let translationObserver = null;

    let translationTimer = null;

    let isTranslating = false;


    /* =====================================================
       RTL
    ===================================================== */

    const RTL_LANGUAGES = [
        "ar",
        "fa",
        "ur",
        "he",
        "ps",
        "ku"
    ];


    function isRTL(code) {

        return RTL_LANGUAGES.includes(
            String(code || "").toLowerCase()
        );
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function getSavedLanguage() {

        try {

            const saved =
                localStorage.getItem(
                    CONFIG.storageKey
                );

            if (
                saved &&
                getAvailableLanguages()[saved]
            ) {
                return saved;
            }

        } catch (error) {

            console.warn(
                "Language storage unavailable:",
                error
            );
        }

        return CONFIG.defaultLanguage;
    }


    function saveLanguage(code) {

        try {

            localStorage.setItem(
                CONFIG.storageKey,
                code
            );

        } catch (error) {

            console.warn(
                "Unable to save language:",
                error
            );
        }
    }


    /* =====================================================
       LANGUAGE GETTER
    ===================================================== */

    function getLanguage() {

        return currentLanguage;
    }


    function getLanguageInfo(code) {

        const languageCode =
            code || currentLanguage;

        const languages =
            getAvailableLanguages();

        return (
            languages[languageCode] ||
            languages[CONFIG.defaultLanguage] ||
            WORLD_LANGUAGE_CONFIG.en
        );
    }


    /* =====================================================
       DIRECTION
    ===================================================== */

    function updateDirection(code) {

        const direction =
            isRTL(code)
                ? "rtl"
                : "ltr";

        document.documentElement.dir =
            direction;

        document.documentElement.lang =
            code;

        document.documentElement.setAttribute(
            "data-direction",
            direction
        );

        document.documentElement.classList.toggle(
            "alon-rtl",
            direction === "rtl"
        );
    }


    /* =====================================================
       LANGUAGE ATTRIBUTE
    ===================================================== */

    function updateLanguageAttribute(code) {

        document.documentElement.setAttribute(
            "data-language",
            code
        );

        document.documentElement.setAttribute(
            "lang",
            code
        );

        const info =
            getLanguageInfo(code);

        if (info) {

            document.documentElement.setAttribute(
                "data-language-name",
                info.name || ""
            );

            document.documentElement.setAttribute(
                "data-language-native",
                info.nativeName || ""
            );
        }
    }


    /* =====================================================
       TRANSLATION DICTIONARY
       English + Hindi core website interface
    ===================================================== */

    const TRANSLATIONS = {

        hi: {

            "Home": "होम",
            "Back": "वापस",
            "Search": "खोजें",
            "Search...": "खोजें...",
            "Login": "लॉगिन",
            "Logout": "लॉगआउट",
            "Register": "रजिस्टर करें",
            "Account": "खाता",
            "Profile": "प्रोफ़ाइल",
            "Settings": "सेटिंग्स",
            "Language": "भाषा",
            "Languages": "भाषाएँ",
            "World Languages": "विश्व भाषाएँ",
            "Choose Language": "भाषा चुनें",
            "Select your preferred language":
                "अपनी पसंदीदा भाषा चुनें",
            "Close": "बंद करें",
            "Close language selector":
                "भाषा चयन बंद करें",
            "Save": "सहेजें",
            "Delete": "हटाएँ",
            "Edit": "संपादित करें",
            "Cancel": "रद्द करें",
            "Submit": "जमा करें",
            "Submit Ad": "विज्ञापन जमा करें",
            "Continue": "जारी रखें",
            "Next": "आगे",
            "Previous": "पिछला",
            "Open": "खोलें",
            "Close Menu": "मेनू बंद करें",
            "Menu": "मेनू",

            "Explore": "अन्वेषण",
            "Library": "पुस्तकालय",
            "History": "इतिहास",
            "Countries": "देश",
            "Civilizations": "सभ्यताएँ",
            "Heritage": "विरासत",
            "Timeline": "समयरेखा",
            "Articles": "लेख",
            "Knowledge": "ज्ञान",
            "Community": "समुदाय",
            "Information": "जानकारी",
            "About": "हमारे बारे में",
            "Contact": "संपर्क",
            "Privacy": "गोपनीयता",
            "Terms": "नियम और शर्तें",
            "Copyright": "कॉपीराइट",
            "Admin": "एडमिन",

            "Marketplace": "मार्केटप्लेस",
            "Global Marketplace":
                "ग्लोबल मार्केटप्लेस",
            "Regular Marketplace":
                "रेगुलर मार्केटप्लेस",
            "Jobs": "नौकरियाँ",
            "Careers": "करियर",
            "Sell": "बेचें",
            "Buy": "खरीदें",
            "My Ads": "मेरे विज्ञापन",
            "Business": "व्यवसाय",
            "Showroom": "शोरूम",
            "Advertisement": "विज्ञापन",
            "Price": "कीमत",
            "Currency": "मुद्रा",
            "Country": "देश",
            "State": "राज्य",
            "District": "ज़िला",
            "City": "शहर",
            "Location": "स्थान",
            "Description": "विवरण",
            "Category": "श्रेणी",
            "Image": "चित्र",
            "Video": "वीडियो",

            "Item": "वस्तु",
            "Property": "संपत्ति",
            "Vehicle": "वाहन",
            "New": "नया",
            "Used": "पुराना",
            "Refurbished": "नवीनीकृत",

            "House": "मकान",
            "Shop": "दुकान",
            "Flat": "फ्लैट",
            "Bungalow": "बंगला",
            "Plot": "प्लॉट",
            "Land": "भूमि",
            "Car": "कार",
            "SUV": "एसयूवी",
            "Motorcycle": "मोटरसाइकिल",
            "Bike": "बाइक",
            "Scooter": "स्कूटर",
            "Truck": "ट्रक",
            "Bus": "बस",
            "Van": "वैन",

            "Open Discovery": "डिस्कवरी खोलें",
            "Discovery": "डिस्कवरी",
            "← Back": "← वापस",

            "Choose Country": "देश चुनें",
            "Select Country": "देश चुनें",
            "Select Category": "श्रेणी चुनें",
            "Select Language": "भाषा चुनें",

            "Email": "ईमेल",
            "Password": "पासवर्ड",
            "Username": "यूज़रनेम",
            "Name": "नाम",
            "Phone": "फ़ोन",
            "Mobile": "मोबाइल",

            "Welcome": "स्वागत है",
            "Welcome to ALON HISTORYVERSE 24":
                "ALON HISTORYVERSE 24 में आपका स्वागत है",

            "History, civilizations, countries, culture, heritage and knowledge":
                "इतिहास, सभ्यताएँ, देश, संस्कृति, विरासत और ज्ञान",

            "No results found":
                "कोई परिणाम नहीं मिला",

            "Loading...":
                "लोड हो रहा है...",

            "Please wait...":
                "कृपया प्रतीक्षा करें...",

            "Are you sure?":
                "क्या आप सुनिश्चित हैं?",

            "Yes": "हाँ",
            "No": "नहीं",
            "OK": "ठीक है",

            "Login required":
                "लॉगिन आवश्यक है",

            "Please login first":
                "कृपया पहले लॉगिन करें",

            "Logout successful":
                "लॉगआउट सफल रहा",

            "Saved successfully":
                "सफलतापूर्वक सहेजा गया",

            "Deleted successfully":
                "सफलतापूर्वक हटा दिया गया",

            "Updated successfully":
                "सफलतापूर्वक अपडेट किया गया",

            "Error":
                "त्रुटि",

            "Success":
                "सफलता"
        }
    };


    /* =====================================================
       TRANSLATION HELPERS
    ===================================================== */

    function getTranslation(
        text,
        languageCode
    ) {

        if (
            !text ||
            typeof text !== "string"
        ) {
            return text;
        }

        const code =
            languageCode || currentLanguage;

        const cleanText =
            normalizeTranslationKey(text);

        if (!cleanText) {
            return text;
        }

        /*
         * English always returns the original English key.
         */
        if (code === "en") {
            return cleanText;
        }

        const dictionary =
            TRANSLATIONS[code];

        if (
            dictionary &&
            Object.prototype.hasOwnProperty.call(
                dictionary,
                cleanText
            )
        ) {
            return dictionary[cleanText];
        }

        return cleanText;
    }


    function normalizeTranslationKey(text) {

        return String(text || "")
            .replace(/\s+/g, " ")
            .trim();
    }


    /* =====================================================
       ORIGINAL TEXT MANAGEMENT
       This is the main fix for English <-> Hindi.
    ===================================================== */

    function getOriginalTextNodeText(textNode) {

        if (!textNode) {
            return "";
        }

        const parent =
            textNode.parentElement;

        if (!parent) {
            return textNode.textContent || "";
        }

        if (
            textNode.hasOwnProperty(
                "__alonOriginalText"
            )
        ) {
            return textNode.__alonOriginalText;
        }

        const stored =
            textNode.__alonOriginalText;

        if (typeof stored === "string") {
            return stored;
        }

        return textNode.textContent || "";
    }


    function rememberOriginalText(
        textNode
    ) {

        if (!textNode) {
            return;
        }

        if (
            typeof textNode.__alonOriginalText ===
            "string"
        ) {
            return;
        }

        textNode.__alonOriginalText =
            textNode.textContent;
    }


    function restoreOriginalText(
        textNode
    ) {

        if (!textNode) {
            return;
        }

        if (
            typeof textNode.__alonOriginalText ===
            "string"
        ) {

            textNode.textContent =
                textNode.__alonOriginalText;
        }
    }


    /* =====================================================
       TRANSLATE ELEMENT
    ===================================================== */

    function translateElement(
        element,
        languageCode
    ) {

        if (
            !element ||
            element.nodeType !== 1
        ) {
            return;
        }

        const code =
            languageCode || currentLanguage;


        /* -----------------------------------------------
           Explicit data-i18n
        ------------------------------------------------ */

        if (
            element.hasAttribute(
                CONFIG.translationAttribute
            )
        ) {

            const key =
                normalizeTranslationKey(
                    element.getAttribute(
                        CONFIG.translationAttribute
                    )
                );

            const translated =
                getTranslation(
                    key,
                    code
                );

            if (
                element.children.length === 0
            ) {

                element.textContent =
                    translated;

            } else {

                const textNode =
                    Array.from(
                        element.childNodes
                    ).find(function (node) {

                        return (
                            node.nodeType ===
                            Node.TEXT_NODE &&
                            node.textContent.trim()
                        );
                    });

                if (textNode) {

                    rememberOriginalText(
                        textNode
                    );

                    /*
                     * Explicit data-i18n is authoritative.
                     * Use its English key rather than already
                     * translated DOM text.
                     */
                    textNode.__alonOriginalText =
                        key;

                    textNode.textContent =
                        translated;
                }
            }
        }


        /* -----------------------------------------------
           Placeholder
        ------------------------------------------------ */

        if (
            element.hasAttribute(
                CONFIG.placeholderAttribute
            )
        ) {

            const key =
                normalizeTranslationKey(
                    element.getAttribute(
                        CONFIG.placeholderAttribute
                    )
                );

            element.setAttribute(
                "placeholder",
                getTranslation(
                    key,
                    code
                )
            );
        }


        /* -----------------------------------------------
           Title
        ------------------------------------------------ */

        if (
            element.hasAttribute(
                CONFIG.titleAttribute
            )
        ) {

            const key =
                normalizeTranslationKey(
                    element.getAttribute(
                        CONFIG.titleAttribute
                    )
                );

            element.setAttribute(
                "title",
                getTranslation(
                    key,
                    code
                )
            );
        }


        /* -----------------------------------------------
           ARIA
        ------------------------------------------------ */

        if (
            element.hasAttribute(
                CONFIG.ariaAttribute
            )
        ) {

            const key =
                normalizeTranslationKey(
                    element.getAttribute(
                        CONFIG.ariaAttribute
                    )
                );

            element.setAttribute(
                "aria-label",
                getTranslation(
                    key,
                    code
                )
            );
        }
    }


    /* =====================================================
       TRANSLATE PAGE
    ===================================================== */

    function translatePage() {

        if (isTranslating) {
            return;
        }

        isTranslating = true;

        try {

            const code =
                CONFIG.homeAlwaysEnglish &&
                isHomePage()
                    ? "en"
                    : currentLanguage;


            /* -------------------------------------------
               Explicit translation attributes
            ------------------------------------------- */

            document
                .querySelectorAll(
                    "[" +
                    CONFIG.translationAttribute +
                    "],[" +
                    CONFIG.placeholderAttribute +
                    "],[" +
                    CONFIG.titleAttribute +
                    "],[" +
                    CONFIG.ariaAttribute +
                    "]"
                )
                .forEach(function (element) {

                    translateElement(
                        element,
                        code
                    );

                });


            /* -------------------------------------------
               Common interface text
            ------------------------------------------- */

            if (document.body) {

                translateCommonText(
                    document.body,
                    code
                );
            }


            /* -------------------------------------------
               Document title
            ------------------------------------------- */

            translateDocumentTitle(code);


            /* -------------------------------------------
               HTML language metadata
            ------------------------------------------- */

            updateLanguageAttribute(code);

            updateDirection(code);

            updateLanguageButtons();


            document.documentElement.setAttribute(
                "data-translation-ready",
                "true"
            );


            dispatchTranslationEvent(
                code
            );

        } finally {

            isTranslating = false;
        }
    }


    /* =====================================================
       DOCUMENT TITLE
    ===================================================== */

    function translateDocumentTitle(
        languageCode
    ) {

        if (!document.title) {
            return;
        }

        const code =
            languageCode || currentLanguage;

        const titleElement =
            document.querySelector(
                "title"
            );

        /*
         * Keep a permanent English title source.
         */
        if (
            titleElement &&
            typeof titleElement.__alonOriginalTitle !==
            "string"
        ) {

            titleElement.__alonOriginalTitle =
                document.title;
        }

        let originalTitle =
            titleElement &&
            typeof titleElement.__alonOriginalTitle ===
            "string"
                ? titleElement.__alonOriginalTitle
                : document.title;

        originalTitle =
            normalizeTranslationKey(
                originalTitle
            );

        if (!originalTitle) {
            return;
        }

        if (code === "en") {

            document.title =
                originalTitle;

            return;
        }

        document.title =
            getTranslation(
                originalTitle,
                code
            );
    }


    /* =====================================================
       COMMON TEXT TRANSLATION
       SAFE REVERSIBLE VERSION
    ===================================================== */

    function translateCommonText(
        root,
        languageCode
    ) {

        if (!root) {
            return;
        }

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode:
                        function (node) {

                            const parent =
                                node.parentElement;

                            if (!parent) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            const tag =
                                parent.tagName
                                    .toLowerCase();

                            if (
                                tag === "script" ||
                                tag === "style" ||
                                tag === "noscript" ||
                                tag === "template" ||
                                tag === "code" ||
                                tag === "pre"
                            ) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            if (
                                parent.hasAttribute(
                                    "data-i18n-ignore"
                                )
                            ) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            if (
                                parent.closest(
                                    "[data-i18n-ignore]"
                                )
                            ) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            if (
                                !node.textContent.trim()
                            ) {
                                return NodeFilter.FILTER_REJECT;
                            }

                            return NodeFilter.FILTER_ACCEPT;
                        }
                }
            );


        const nodes = [];

        let node;

        while (
            (node = walker.nextNode())
        ) {
            nodes.push(node);
        }


        nodes.forEach(function (textNode) {

            if (!textNode) {
                return;
            }

            /*
             * Remember the real English DOM text before
             * changing anything.
             */
            rememberOriginalText(
                textNode
            );

            const original =
                textNode.__alonOriginalText;

            if (
                typeof original !== "string"
            ) {
                return;
            }

            const trimmed =
                normalizeTranslationKey(
                    original
                );

            if (!trimmed) {
                return;
            }

            /*
             * Do not replace arbitrary long content.
             * This protects articles, descriptions,
             * Marketplace data and user-created content.
             */
            if (
                trimmed.length > 120
            ) {
                return;
            }

            /*
             * Only translate known dictionary entries.
             * Unknown content remains untouched.
             */
            const dictionary =
                TRANSLATIONS[languageCode];

            if (
                languageCode !== "en" &&
                !dictionary
            ) {
                return;
            }

            if (
                languageCode !== "en" &&
                !Object.prototype.hasOwnProperty.call(
                    dictionary,
                    trimmed
                )
            ) {
                return;
            }

            const translated =
                getTranslation(
                    trimmed,
                    languageCode
                );

            if (
                textNode.textContent !==
                translated
            ) {

                const leading =
                    original.match(
                        /^\s*/
                    );

                const trailing =
                    original.match(
                        /\s*$/
                    );

                textNode.textContent =
                    (leading
                        ? leading[0]
                        : "") +
                    translated +
                    (trailing
                        ? trailing[0]
                        : "");
            }

        });
    }


    /* =====================================================
       HOME PAGE DETECTION
    ===================================================== */

    function isHomePage() {

        const path =
            String(
                window.location.pathname || ""
            ).toLowerCase();

        const file =
            path.split("/").pop();

        return (
            file === "" ||
            file === "index.html" ||
            file === "index.htm"
        );
    }


    /* =====================================================
       TRANSLATION EVENT
    ===================================================== */

    function dispatchTranslationEvent(
        code
    ) {

        try {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:translation-ready",
                    {
                        detail: {
                            code: code,
                            language:
                                getLanguageInfo(code)
                        }
                    }
                )
            );

        } catch (error) {

            console.warn(
                "Translation event error:",
                error
            );
        }
    }


    /* =====================================================
       TRANSLATION OBSERVER
       SAFE DYNAMIC UI SUPPORT
    ===================================================== */

    function startTranslationObserver() {

        if (
            translationObserver ||
            !document.body
        ) {
            return;
        }

        translationObserver =
            new MutationObserver(
                function (mutations) {

                    let shouldTranslate =
                        false;

                    mutations.forEach(
                        function (mutation) {

                            /*
                             * Only newly added UI needs
                             * another translation pass.
                             */
                            if (
                                mutation.type ===
                                "childList" &&
                                mutation.addedNodes.length
                            ) {

                                /*
                                 * Ignore our own language
                                 * overlay changes.
                                 */
                                let relevant =
                                    false;

                                Array.from(
                                    mutation.addedNodes
                                ).forEach(
                                    function (added) {

                                        if (
                                            added.nodeType !==
                                            Node.ELEMENT_NODE
                                        ) {
                                            return;
                                        }

                                        if (
                                            added.id ===
                                            CONFIG.overlayId
                                        ) {
                                            return;
                                        }

                                        if (
                                            added.closest &&
                                            added.closest(
                                                "#" +
                                                CONFIG.overlayId
                                            )
                                        ) {
                                            return;
                                        }

                                        relevant = true;
                                    }
                                );

                                if (relevant) {
                                    shouldTranslate =
                                        true;
                                }
                            }

                        }
                    );

                    if (
                        shouldTranslate &&
                        !isTranslating
                    ) {

                        window.clearTimeout(
                            translationTimer
                        );

                        translationTimer =
                            window.setTimeout(
                                function () {

                                    translatePage();

                                },
                                80
                            );
                    }

                }
            );

        translationObserver.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* =====================================================
       LANGUAGE BUTTON
    ===================================================== */

    function updateLanguageButtons() {

        /*
         * Use the English language name for the
         * visible accessibility label.
         * This prevents "Language: हिन्दी" appearing
         * unexpectedly at the top.
         */

        const info =
            getLanguageInfo(
                currentLanguage
            );

        const englishName =
            info &&
            info.name
                ? info.name
                : "Language";

        CONFIG.buttonSelectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(function (button) {

                        button.setAttribute(
                            "aria-label",
                            "Language: " +
                            englishName
                        );

                        button.setAttribute(
                            "title",
                            "Language: " +
                            englishName
                        );

                        button.dataset.language =
                            currentLanguage;

                    });
            }
        );
    }


    /* =====================================================
       OVERLAY
    ===================================================== */

    function createOverlay() {

        let overlay =
            document.getElementById(
                CONFIG.overlayId
            );

        if (overlay) {
            return overlay;
        }

        overlay =
            document.createElement("div");

        overlay.id =
            CONFIG.overlayId;

        overlay.className =
            "alon-language-overlay";

        overlay.innerHTML = `
            <div
                class="alon-language-box"
                role="dialog"
                aria-modal="true"
                aria-labelledby="alonLanguageTitle"
            >

                <button
                    type="button"
                    class="alon-language-close"
                    id="alonLanguageClose"
                    aria-label="Close language selector"
                    title="Close language selector"
                >
                    ×
                </button>

                <div class="alon-language-heading">

                    <div class="alon-language-globe">
                        🌐
                    </div>

                    <div>
                        <h2 id="alonLanguageTitle">
                            Choose Language
                        </h2>

                        <p>
                            Select your preferred language
                        </p>
                    </div>

                </div>

                <div
                    id="alonLanguageList"
                    class="alon-language-list"
                ></div>

            </div>
        `;

        document.body.appendChild(
            overlay
        );

        injectSelectorStyles();

        const closeButton =
            overlay.querySelector(
                "#alonLanguageClose"
            );

        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeSelector
            );
        }

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

        return overlay;
    }


    /* =====================================================
       SELECTOR STYLES
    ===================================================== */

    function injectSelectorStyles() {

        if (
            document.getElementById(
                "alonLanguageStyles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "alonLanguageStyles";

        style.textContent = `

            .alon-language-overlay {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background: rgba(0,0,0,.78);
                backdrop-filter: blur(7px);
            }

            .alon-language-overlay.active {
                display: flex;
            }

            .alon-language-box {
                position: relative;
                width: min(620px, 100%);
                max-height: 88vh;
                overflow: auto;
                padding: 26px;
                border: 1px solid #d7b35a;
                border-radius: 20px;
                background: #05080f;
                color: #f5f0df;
                box-shadow:
                    0 25px 80px rgba(0,0,0,.65);
            }

            .alon-language-close {
                position: absolute;
                top: 12px;
                right: 14px;
                width: 38px;
                height: 38px;
                border: 1px solid #555;
                border-radius: 50%;
                background: #111722;
                color: #f0d27a;
                font-size: 25px;
                cursor: pointer;
            }

            .alon-language-heading {
                display: flex;
                align-items: center;
                gap: 15px;
                padding-right: 45px;
                margin-bottom: 22px;
            }

            .alon-language-globe {
                font-size: 42px;
            }

            .alon-language-heading h2 {
                margin: 0 0 5px;
                color: #f0d27a;
                font-family: Georgia, serif;
            }

            .alon-language-heading p {
                margin: 0;
                color: #aaa;
                font-size: 14px;
            }

            .alon-language-list {
                display: grid;
                grid-template-columns:
                    repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

            .alon-language-option {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                padding: 13px;
                border: 1px solid #29303d;
                border-radius: 12px;
                background: #0b111b;
                color: #eee;
                text-align: left;
                cursor: pointer;
                transition: .2s ease;
            }

            .alon-language-option:hover {
                border-color: #d7b35a;
                transform: translateY(-1px);
            }

            .alon-language-option.active {
                border-color: #f0d27a;
                background: #17150e;
                box-shadow:
                    0 0 0 1px #d7b35a inset;
            }

            .alon-language-flag {
                width: 30px;
                font-size: 22px;
                text-align: center;
            }

            .alon-language-name {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            /*
             * English name is now the primary visible name.
             * This keeps "Hindi" visible instead of "हिन्दी"
             * when the selector is being displayed.
             */

            .alon-language-english {
                font-weight: 700;
                color: #eee;
            }

            .alon-language-native {
                color: #999;
                font-size: 12px;
            }

            [dir="rtl"] .alon-language-option {
                text-align: right;
            }

            [dir="rtl"] .alon-language-heading {
                padding-right: 0;
                padding-left: 45px;
            }

            [dir="rtl"] .alon-language-close {
                right: auto;
                left: 14px;
            }

            @media (max-width: 520px) {

                .alon-language-box {
                    padding: 20px;
                    border-radius: 16px;
                }

                .alon-language-list {
                    grid-template-columns: 1fr;
                }

                .alon-language-heading h2 {
                    font-size: 20px;
                }

            }

        `;

        document.head.appendChild(
            style
        );
    }


    /* =====================================================
       RENDER LANGUAGE LIST
    ===================================================== */

    function renderLanguageList() {

        syncWorldLanguageConfig();

        const overlay =
            createOverlay();

        const list =
            overlay.querySelector(
                "#alonLanguageList"
            );

        if (!list) {
            return;
        }

        list.innerHTML = "";

        const languages =
            getAvailableLanguages();


        Object.keys(
            languages
        ).forEach(function (code) {

            const language =
                languages[code];

            if (!language) {
                return;
            }

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "alon-language-option" +
                (
                    code === currentLanguage
                        ? " active"
                        : ""
                );

            button.dataset.language =
                code;

            /*
             * English name is intentionally shown first.
             * Native name is secondary.
             */

            button.innerHTML = `

                <span class="alon-language-flag">
                    ${escapeHTML(
                        language.flag || "🌐"
                    )}
                </span>

                <span class="alon-language-name">

                    <span class="alon-language-english">
                        ${escapeHTML(
                            language.name ||
                            code
                        )}
                    </span>

                    <span class="alon-language-native">
                        ${escapeHTML(
                            language.nativeName ||
                            language.name ||
                            code
                        )}
                    </span>

                </span>

            `;

            button.addEventListener(
                "click",
                function () {

                    setLanguage(code);

                    closeSelector();
                }
            );

            list.appendChild(
                button
            );

        });
    }


    /* =====================================================
       OPEN SELECTOR
    ===================================================== */

    function openSelector() {

        syncWorldLanguageConfig();

        const overlay =
            createOverlay();

        renderLanguageList();

        overlay.classList.add(
            "active"
        );

        document.body.style.overflow =
            "hidden";
    }


    /* =====================================================
       CLOSE SELECTOR
    ===================================================== */

    function closeSelector() {

        const overlay =
            document.getElementById(
                CONFIG.overlayId
            );

        if (overlay) {

            overlay.classList.remove(
                "active"
            );
        }

        document.body.style.overflow =
            "";
    }


    /* =====================================================
       SET LANGUAGE
    ===================================================== */

    function setLanguage(code) {

        syncWorldLanguageConfig();

        const languages =
            getAvailableLanguages();

        if (
            !languages[code]
        ) {

            console.warn(
                "Unsupported language:",
                code
            );

            return false;
        }

        currentLanguage =
            code;

        saveLanguage(code);

        updateLanguageAttribute(
            code
        );

        updateDirection(
            code
        );

        updateLanguageButtons();

        translatePage();

        dispatchLanguageEvent(
            code
        );

        /*
         * Refresh selector so active language
         * is immediately updated.
         */
        const overlay =
            document.getElementById(
                CONFIG.overlayId
            );

        if (overlay) {
            renderLanguageList();
        }

        return true;
    }


    /* =====================================================
       LANGUAGE EVENT
    ===================================================== */

    function dispatchLanguageEvent(code) {

        try {

            const event =
                new CustomEvent(
                    "alon:language-change",
                    {
                        detail: {
                            code: code,
                            language:
                                getLanguageInfo(code)
                        }
                    }
                );

            document.dispatchEvent(
                event
            );

        } catch (error) {

            console.warn(
                "Language event error:",
                error
            );
        }
    }


    /* =====================================================
       CONNECT TO WORLD LANGUAGE ENGINE
       world-language.js can be loaded after this file.
    ===================================================== */

    function bindWorldLanguageEngine() {

        document.addEventListener(
            "alon:world-language-change",
            function (event) {

                const detail =
                    event &&
                    event.detail
                        ? event.detail
                        : null;

                if (
                    !detail ||
                    !detail.code
                ) {
                    return;
                }

                const code =
                    detail.code;

                syncWorldLanguageConfig();

                if (
                    getAvailableLanguages()[code]
                ) {

                    currentLanguage =
                        code;

                    saveLanguage(code);

                    updateLanguageAttribute(
                        code
                    );

                    updateDirection(
                        code
                    );

                    updateLanguageButtons();

                    translatePage();

                    dispatchLanguageEvent(
                        code
                    );
                }

            }
        );
    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    function bindLanguageButtons() {

        CONFIG.buttonSelectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(function (button) {

                        if (
                            button.dataset
                                .languageBound === "true"
                        ) {
                            return;
                        }

                        button.dataset
                            .languageBound = "true";

                        button.addEventListener(
                            "click",
                            function (event) {

                                event.preventDefault();

                                openSelector();
                            }
                        );

                    });
            }
        );
    }


    /* =====================================================
       KEYBOARD CONTROL
    ===================================================== */

    function bindKeyboard() {

        if (
            document.documentElement.dataset
                .languageKeyboardBound === "true"
        ) {
            return;
        }

        document.documentElement.dataset
            .languageKeyboardBound = "true";

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeSelector();
                }

            }
        );
    }


    /* =====================================================
       CROSS-PAGE LANGUAGE SUPPORT
    ===================================================== */

    function applySavedLanguage() {

        syncWorldLanguageConfig();

        const saved =
            getSavedLanguage();

        currentLanguage =
            saved;

        updateLanguageAttribute(
            currentLanguage
        );

        updateDirection(
            currentLanguage
        );

        updateLanguageButtons();
    }


    /* =====================================================
       TRANSLATION MARKUP HELPER
    ===================================================== */

    function markElement(
        element,
        key
    ) {

        if (
            !element ||
            !key
        ) {
            return;
        }

        element.setAttribute(
            CONFIG.translationAttribute,
            key
        );

        translateElement(
            element,
            currentLanguage
        );
    }


    /* =====================================================
       BACK BUTTON ENGINE
       Only elements explicitly marked as:
       data-alon-back
       are changed.
    ===================================================== */

    function bindBackButtons() {

        document
            .querySelectorAll(
                "[data-alon-back]"
            )
            .forEach(function (button) {

                if (
                    button.dataset
                        .alonBackBound === "true"
                ) {
                    return;
                }

                button.dataset
                    .alonBackBound = "true";

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        if (
                            window.history.length > 1
                        ) {

                            window.history.back();

                        } else {

                            window.location.href =
                                "./index.html";
                        }

                    }
                );

            });
    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initialize() {

        syncWorldLanguageConfig();

        applySavedLanguage();

        bindLanguageButtons();

        bindKeyboard();

        bindWorldLanguageEngine();

        bindBackButtons();

        /*
         * Translate existing page.
         */

        translatePage();

        /*
         * Handle dynamically-created UI safely.
         * The observer no longer watches attribute changes,
         * preventing loops and interference with other systems.
         */

        startTranslationObserver();


        /*
         * Wait briefly for world-language.js
         * when it is loaded after language.js.
         */

        window.setTimeout(
            function () {

                syncWorldLanguageConfig();

                const saved =
                    getSavedLanguage();

                if (
                    saved !== currentLanguage
                ) {

                    currentLanguage =
                        saved;

                    updateLanguageAttribute(
                        saved
                    );

                    updateDirection(
                        saved
                    );

                    updateLanguageButtons();

                    translatePage();
                }

            },
            0
        );


        console.log(
            "ALON HISTORYVERSE 24 Language Engine ready:",
            currentLanguage
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    /*
     * Only create the fallback global registry if
     * another world-language engine has not already
     * created one.
     *
     * This avoids overwriting the external registry.
     */

    if (
        !window.WORLD_LANGUAGE_CONFIG
    ) {

        window.WORLD_LANGUAGE_CONFIG =
            WORLD_LANGUAGE_CONFIG;
    }


    window.ALON_LANGUAGE = {

        config:
            CONFIG,

        languages:
            getAvailableLanguages(),

        initialize:
            initialize,

        getLanguage:
            getLanguage,

        getLanguageInfo:
            getLanguageInfo,

        getTranslation:
            getTranslation,

        translate:
            translatePage,

        translateElement:
            translateElement,

        setLanguage:
            setLanguage,

        open:
            openSelector,

        close:
            closeSelector,

        render:
            renderLanguageList,

        isRTL:
            isRTL,

        mark:
            markElement,

        bindBack:
            bindBackButtons
    };


    /* =====================================================
       COMPATIBILITY FUNCTIONS
    ===================================================== */

    window.openLanguageSelector =
        openSelector;


    window.setALONLanguage =
        setLanguage;


    window.getALONLanguage =
        getLanguage;


    window.translateALONPage =
        translatePage;


    /* =====================================================
       AUTO START
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();
    }

})();