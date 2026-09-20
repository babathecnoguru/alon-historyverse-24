/* =========================================================
   ALON HISTORYVERSE 24
   SAFE LANGUAGE ENGINE v24.3
   ---------------------------------------------------------
   Purpose:
   - English / Hindi language switching
   - Saved language survives refresh
   - Prevent unwanted English/Hindi mixing
   - Home card/page names remain English
   - Do NOT modify Global Marketplace / Jobs / Country DB
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIG
       ===================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.3",

        storageKey: "alon_historyverse_language",

        defaultLanguage: "en",

        selectorId: "alonLanguageSelector",
        overlayId: "alonLanguageOverlay",

        buttonSelectors: [
            "#languageBtn",
            "[data-language-button]",
            "[data-open-language]"
        ],

        translationAttributes: {
            text: "data-i18n",
            placeholder: "data-i18n-placeholder",
            title: "data-i18n-title",
            aria: "data-i18n-aria"
        },

        originalTextAttribute: "data-alon-original",

        /*
         * IMPORTANT
         * Home card/page names must remain English.
         */
        homeAlwaysEnglish: true
    };


    /* =====================================================
       WORLD LANGUAGE CONFIG
       ===================================================== */

    const WORLD_LANGUAGE_CONFIG = {
        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            direction: "ltr"
        },

        hi: {
            code: "hi",
            name: "Hindi",
            nativeName: "हिन्दी",
            direction: "ltr"
        },

        bn: {
            code: "bn",
            name: "Bengali",
            nativeName: "বাংলা",
            direction: "ltr"
        },

        gu: {
            code: "gu",
            name: "Gujarati",
            nativeName: "ગુજરાતી",
            direction: "ltr"
        },

        mr: {
            code: "mr",
            name: "Marathi",
            nativeName: "मराठी",
            direction: "ltr"
        },

        ta: {
            code: "ta",
            name: "Tamil",
            nativeName: "தமிழ்",
            direction: "ltr"
        },

        te: {
            code: "te",
            name: "Telugu",
            nativeName: "తెలుగు",
            direction: "ltr"
        },

        kn: {
            code: "kn",
            name: "Kannada",
            nativeName: "ಕನ್ನಡ",
            direction: "ltr"
        },

        ml: {
            code: "ml",
            name: "Malayalam",
            nativeName: "മലയാളം",
            direction: "ltr"
        },

        pa: {
            code: "pa",
            name: "Punjabi",
            nativeName: "ਪੰਜਾਬੀ",
            direction: "ltr"
        },

        ur: {
            code: "ur",
            name: "Urdu",
            nativeName: "اردو",
            direction: "rtl"
        },

        ne: {
            code: "ne",
            name: "Nepali",
            nativeName: "नेपाली",
            direction: "ltr"
        },

        sa: {
            code: "sa",
            name: "Sanskrit",
            nativeName: "संस्कृतम्",
            direction: "ltr"
        },

        es: {
            code: "es",
            name: "Spanish",
            nativeName: "Español",
            direction: "ltr"
        },

        fr: {
            code: "fr",
            name: "French",
            nativeName: "Français",
            direction: "ltr"
        },

        de: {
            code: "de",
            name: "German",
            nativeName: "Deutsch",
            direction: "ltr"
        },

        it: {
            code: "it",
            name: "Italian",
            nativeName: "Italiano",
            direction: "ltr"
        },

        pt: {
            code: "pt",
            name: "Portuguese",
            nativeName: "Português",
            direction: "ltr"
        },

        ru: {
            code: "ru",
            name: "Russian",
            nativeName: "Русский",
            direction: "ltr"
        },

        uk: {
            code: "uk",
            name: "Ukrainian",
            nativeName: "Українська",
            direction: "ltr"
        },

        ar: {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            direction: "rtl"
        },

        fa: {
            code: "fa",
            name: "Persian",
            nativeName: "فارسی",
            direction: "rtl"
        },

        tr: {
            code: "tr",
            name: "Turkish",
            nativeName: "Türkçe",
            direction: "ltr"
        },

        zh: {
            code: "zh",
            name: "Chinese",
            nativeName: "中文",
            direction: "ltr"
        },

        ja: {
            code: "ja",
            name: "Japanese",
            nativeName: "日本語",
            direction: "ltr"
        },

        ko: {
            code: "ko",
            name: "Korean",
            nativeName: "한국어",
            direction: "ltr"
        },

        th: {
            code: "th",
            name: "Thai",
            nativeName: "ไทย",
            direction: "ltr"
        },

        vi: {
            code: "vi",
            name: "Vietnamese",
            nativeName: "Tiếng Việt",
            direction: "ltr"
        },

        id: {
            code: "id",
            name: "Indonesian",
            nativeName: "Bahasa Indonesia",
            direction: "ltr"
        },

        ms: {
            code: "ms",
            name: "Malay",
            nativeName: "Bahasa Melayu",
            direction: "ltr"
        }
    };


    /* =====================================================
       TRANSLATIONS
       ===================================================== */

    const TRANSLATIONS = {

        hi: {

            /* ---------------- CORE ---------------- */

            "Home": "होम",
            "Back": "वापस",

            "Search": "खोजें",
            "Search...": "खोजें...",
            "Search history, countries, civilizations...":
                "इतिहास, देशों, सभ्यताओं में खोजें...",

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

            /* ---------------- MAIN ---------------- */

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

            /* ---------------- MARKETPLACE ---------------- */

            "Marketplace": "मार्केटप्लेस",
            "Global Marketplace": "ग्लोबल मार्केटप्लेस",
            "Regular Marketplace": "रेगुलर मार्केटप्लेस",

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

            /* ---------------- SELECTORS ---------------- */

            "Choose Country": "देश चुनें",
            "Select Country": "देश चुनें",
            "Select Category": "श्रेणी चुनें",
            "Select Language": "भाषा चुनें",

            /* ---------------- ACCOUNT ---------------- */

            "Email": "ईमेल",
            "Password": "पासवर्ड",
            "Username": "यूज़रनेम",
            "Name": "नाम",
            "Phone": "फ़ोन",
            "Mobile": "मोबाइल",

            /* ---------------- HOME ---------------- */

            "Discover": "डिस्कवर",
            "Explore historical knowledge.":
                "ऐतिहासिक ज्ञान का अन्वेषण करें।",

            "Categories": "श्रेणियाँ",
            "Browse knowledge by category.":
                "श्रेणी के अनुसार ज्ञान देखें।",

            "Gallery": "गैलरी",
            "Explore historical media.":
                "ऐतिहासिक मीडिया देखें।",

            "Read historical articles.":
                "ऐतिहासिक लेख पढ़ें।",

            "Article": "लेख",
            "Open article content.":
                "लेख सामग्री खोलें।",

            "Knowledge Library": "ज्ञान पुस्तकालय",
            "Enter the knowledge library.":
                "ज्ञान पुस्तकालय में प्रवेश करें।",

            "Departments": "विभाग",
            "Browse departments.":
                "विभाग देखें।",

            "Subjects": "विषय",
            "Explore subjects.":
                "विषयों का अन्वेषण करें।",

            "Books": "पुस्तकें",
            "Browse books.":
                "पुस्तकें देखें।",

            "Read": "पढ़ें",
            "Read knowledge content.":
                "ज्ञान सामग्री पढ़ें।",

            "Explore ancient and major civilizations.":
                "प्राचीन और प्रमुख सभ्यताओं का अन्वेषण करें।",

            "Explore historical heritage.":
                "ऐतिहासिक विरासत का अन्वेषण करें।",

            "Explore history through time.":
                "समय के माध्यम से इतिहास का अन्वेषण करें।",

            "World Countries": "विश्व के देश",
            "Explore countries of the world.":
                "विश्व के देशों का अन्वेषण करें।",

            "Country details":
                "देश का विवरण",

            "Explore country details.":
                "देश का विवरण देखें।",

            "Knowledge Departments": "ज्ञान विभाग",

            "Mathematics": "गणित",
            "Mathematics and problem solving.":
                "गणित और समस्या समाधान।",

            "Computer": "कंप्यूटर",
            "Computer knowledge and technology.":
                "कंप्यूटर ज्ञान और प्रौद्योगिकी।",

            "Jobs & Careers": "नौकरियाँ और करियर",
            "Jobs and career information.":
                "नौकरियों और करियर की जानकारी।",

            "Trees": "पेड़",
            "Knowledge about trees and nature.":
                "पेड़ों और प्रकृति के बारे में ज्ञान।",

            "Marketplace and selling system.":
                "मार्केटप्लेस और बिक्री प्रणाली।",

            "Buy, sell and advertise items, property and vehicles.":
                "वस्तुओं, संपत्ति और वाहनों को खरीदें, बेचें और विज्ञापन दें।",

            /* ---------------- COMMUNITY ---------------- */

            "Contribute": "योगदान करें",

            "Contribute knowledge to HistoryVerse.":
                "HistoryVerse में ज्ञान का योगदान करें।",

            "Guidelines": "दिशानिर्देश",

            "Community guidelines.":
                "समुदाय के दिशानिर्देश।",

            "Contributor Agreement":
                "योगदानकर्ता समझौता",

            "Contributor information and agreement.":
                "योगदानकर्ता की जानकारी और समझौता।",

            /* ---------------- INFORMATION ---------------- */

            "About ALON HISTORYVERSE 24.":
                "ALON HISTORYVERSE 24 के बारे में।",

            "Contact information.":
                "संपर्क जानकारी।",

            "Copyright information.":
                "कॉपीराइट जानकारी।",

            "Privacy information.":
                "गोपनीयता जानकारी।",

            "Terms and conditions.":
                "नियम और शर्तें।",

            "Login to your account.":
                "अपने खाते में लॉगिन करें।",

            "Open administration system.":
                "प्रशासन प्रणाली खोलें।",

            /* ---------------- PLATFORM ---------------- */

            "Platform": "प्लेटफ़ॉर्म",

            "Marketplace and platform services.":
                "मार्केटप्लेस और प्लेटफ़ॉर्म सेवाएँ।",

            "Contribute knowledge to ALON HISTORYVERSE 24.":
                "ALON HISTORYVERSE 24 में ज्ञान का योगदान करें।",

            "Read the community guidelines for the platform.":
                "प्लेटफ़ॉर्म के समुदाय दिशानिर्देश पढ़ें।",

            "Contact ALON HISTORYVERSE 24.":
                "ALON HISTORYVERSE 24 से संपर्क करें।",

            /* ---------------- SETTINGS ---------------- */

            "ALON HISTORYVERSE 24 Settings":
                "ALON HISTORYVERSE 24 सेटिंग्स",

            "Website settings and account controls.":
                "वेबसाइट सेटिंग्स और खाता नियंत्रण।",

            "Reset Website Preferences":
                "वेबसाइट प्राथमिकताएँ रीसेट करें",

            /* ---------------- STATUS ---------------- */

            "Welcome":
                "स्वागत है",

            "Welcome to ALON HISTORYVERSE 24":
                "ALON HISTORYVERSE 24 में आपका स्वागत है",

            "History, civilizations, countries, culture, heritage and knowledge.":
                "इतिहास, सभ्यताओं, देशों, संस्कृति, विरासत और ज्ञान।",

            "No results found":
                "कोई परिणाम नहीं मिला",

            "Loading...":
                "लोड हो रहा है...",

            "Please wait...":
                "कृपया प्रतीक्षा करें...",

            "Are you sure?":
                "क्या आप सुनिश्चित हैं?",

            "Yes":
                "हाँ",

            "No":
                "नहीं",

            "OK":
                "ठीक है",

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
       STATE
       ===================================================== */

    let currentLanguage = CONFIG.defaultLanguage;

    let observer = null;

    let translateTimer = null;

    let initialized = false;

    /*
     * Stable source text storage.
     *
     * This prevents a Hindi translation from becoming the
     * "original" text during refresh / mutation races.
     */
    const originalTextMap = new WeakMap();

    const originalTitleMap = new WeakMap();


    /* =====================================================
       NORMALIZE
       ===================================================== */

    function normalizeTranslationKey(value) {
        return String(value == null ? "" : value)
            .replace(/\s+/g, " ")
            .trim();
    }


    /* =====================================================
       LANGUAGE VALIDATION
       ===================================================== */

    function isSupportedLanguage(code) {
        return !!(
            code &&
            Object.prototype.hasOwnProperty.call(
                WORLD_LANGUAGE_CONFIG,
                code
            )
        );
    }


    /* =====================================================
       GET SAVED LANGUAGE
       ===================================================== */

    function getSavedLanguage() {
        try {
            const saved = localStorage.getItem(
                CONFIG.storageKey
            );

            if (isSupportedLanguage(saved)) {
                return saved;
            }
        } catch (error) {
            /* Safe fallback */
        }

        return CONFIG.defaultLanguage;
    }


    /* =====================================================
       SAVE LANGUAGE
       ===================================================== */

    function saveLanguage(code) {
        try {
            localStorage.setItem(
                CONFIG.storageKey,
                code
            );
        } catch (error) {
            /* Safe fallback */
        }
    }


    /* =====================================================
       FIND ENGLISH SOURCE FROM TRANSLATION
       -----------------------------------------------------
       Important for refresh race:
       If another script has already changed:
       English -> Hindi
       before this engine sees the node, recover English
       from the dictionary instead of permanently storing Hindi.
       ===================================================== */

    function findEnglishSourceText(value) {
        const clean = normalizeTranslationKey(value);

        if (!clean) {
            return "";
        }

        if (currentLanguage === "en") {
            return clean;
        }

        const dictionary =
            TRANSLATIONS[currentLanguage] || {};

        const dictionaryKeys =
            Object.keys(dictionary);

        for (let i = 0; i < dictionaryKeys.length; i++) {
            const englishKey = dictionaryKeys[i];

            const translatedValue =
                normalizeTranslationKey(
                    dictionary[englishKey]
                );

            if (
                translatedValue &&
                translatedValue === clean
            ) {
                return englishKey;
            }
        }

        /*
         * Also search every available dictionary.
         * This helps recover text when another language engine
         * changed the text before our engine initialized.
         */

        const languageCodes =
            Object.keys(TRANSLATIONS);

        for (let i = 0; i < languageCodes.length; i++) {
            const languageCode =
                languageCodes[i];

            const dictionary =
                TRANSLATIONS[languageCode] || {};

            const keys =
                Object.keys(dictionary);

            for (let j = 0; j < keys.length; j++) {
                const englishKey = keys[j];

                const translatedValue =
                    normalizeTranslationKey(
                        dictionary[englishKey]
                    );

                if (
                    translatedValue &&
                    translatedValue === clean
                ) {
                    return englishKey;
                }
            }
        }

        return clean;
    }


    /* =====================================================
       PRESERVE WHITESPACE
       ===================================================== */

    function replaceCoreTextPreservingWhitespace(
        originalRaw,
        newCoreText
    ) {
        const raw =
            String(originalRaw == null ? "" : originalRaw);

        const leadingMatch =
            raw.match(/^\s*/);

        const trailingMatch =
            raw.match(/\s*$/);

        const leading =
            leadingMatch ? leadingMatch[0] : "";

        const trailing =
            trailingMatch ? trailingMatch[0] : "";

        return (
            leading +
            newCoreText +
            trailing
        );
    }


    /* =====================================================
       ORIGINAL TEXT
       ===================================================== */

    function rememberOriginalText(textNode) {
        if (!textNode) {
            return;
        }

        if (
            originalTextMap.has(textNode) ||
            typeof textNode.__alonOriginalText === "string"
        ) {
            return;
        }

        const raw =
            textNode.textContent || "";

        const clean =
            normalizeTranslationKey(raw);

        if (!clean) {
            return;
        }

        const recovered =
            findEnglishSourceText(clean);

        const sourceText =
            replaceCoreTextPreservingWhitespace(
                raw,
                recovered
            );

        originalTextMap.set(
            textNode,
            sourceText
        );

        /*
         * Compatibility with older ALON language code.
         */
        textNode.__alonOriginalText =
            sourceText;
    }


    /* =====================================================
       GET ORIGINAL TEXT
       ===================================================== */

    function getOriginalTextNodeText(textNode) {
        if (!textNode) {
            return "";
        }

        if (originalTextMap.has(textNode)) {
            return originalTextMap.get(textNode);
        }

        if (
            typeof textNode.__alonOriginalText === "string"
        ) {
            const value =
                textNode.__alonOriginalText;

            originalTextMap.set(
                textNode,
                value
            );

            return value;
        }

        rememberOriginalText(textNode);

        if (originalTextMap.has(textNode)) {
            return originalTextMap.get(textNode);
        }

        return textNode.textContent || "";
    }


    /* =====================================================
       RESTORE ORIGINAL TEXT
       ===================================================== */

    function restoreOriginalText(textNode) {
        if (!textNode) {
            return;
        }

        const original =
            getOriginalTextNodeText(textNode);

        if (
            typeof original === "string" &&
            textNode.textContent !== original
        ) {
            textNode.textContent =
                original;
        }
    }


    /* =====================================================
       HOME PAGE DETECTION
       ===================================================== */

    function isHomePage() {
        try {
            const pathname =
                window.location.pathname || "";

            const cleanPath =
                pathname
                    .split("?")[0]
                    .split("#")[0];

            if (
                cleanPath === "" ||
                cleanPath === "/" ||
                cleanPath.endsWith("/index.html") ||
                cleanPath.endsWith("/index.htm")
            ) {
                return true;
            }
        } catch (error) {
            /* Safe fallback */
        }

        return false;
    }


    /* =====================================================
       HOME FILE / PAGE NAME PROTECTION
       -----------------------------------------------------
       These names MUST remain English on Home:
       Library
       History
       Countries
       Civilizations
       Heritage
       Timeline
       Articles
       etc.
       ===================================================== */

    function isHomeFilePageNameElement(element) {
        if (
            !CONFIG.homeAlwaysEnglish ||
            !isHomePage() ||
            !element
        ) {
            return false;
        }

        if (
            typeof element.matches !== "function"
        ) {
            return false;
        }

        /*
         * Main Home cards use:
         * .card h3
         */
        if (
            element.matches(
                ".card h3"
            )
        ) {
            return true;
        }

        return false;
    }


    /* =====================================================
       FORCE HOME CARD NAME TO ENGLISH
       ===================================================== */

    function keepHomeFilePageNameEnglish(element) {
        if (
            !isHomeFilePageNameElement(element)
        ) {
            return false;
        }

        const childNodes =
            Array.from(
                element.childNodes || []
            );

        for (
            let i = 0;
            i < childNodes.length;
            i++
        ) {
            const node =
                childNodes[i];

            if (
                node.nodeType !==
                Node.TEXT_NODE
            ) {
                continue;
            }

            const raw =
                node.textContent || "";

            const clean =
                normalizeTranslationKey(raw);

            if (!clean) {
                continue;
            }

            const english =
                findEnglishSourceText(clean);

            node.textContent =
                replaceCoreTextPreservingWhitespace(
                    raw,
                    english
                );

            originalTextMap.set(
                node,
                replaceCoreTextPreservingWhitespace(
                    raw,
                    english
                )
            );

            node.__alonOriginalText =
                originalTextMap.get(node);
        }

        return true;
    }


    /* =====================================================
       GET TRANSLATION
       ===================================================== */

    function getTranslation(
        text,
        languageCode
    ) {
        const clean =
            normalizeTranslationKey(text);

        if (!clean) {
            return "";
        }

        if (languageCode === "en") {
            return clean;
        }

        const dictionary =
            TRANSLATIONS[languageCode];

        if (!dictionary) {
            /*
             * Languages without a local dictionary currently
             * safely remain in their original English source.
             */
            return clean;
        }

        if (
            Object.prototype.hasOwnProperty.call(
                dictionary,
                clean
            )
        ) {
            return dictionary[clean];
        }

        return clean;
    }


    /* =====================================================
       TRANSLATE TEXT NODE
       ===================================================== */

    function translateTextNode(
        textNode,
        languageCode
    ) {
        if (!textNode) {
            return;
        }

        if (
            textNode.nodeType !==
            Node.TEXT_NODE
        ) {
            return;
        }

        const parent =
            textNode.parentElement;

        if (!parent) {
            return;
        }

        /*
         * Never touch protected elements.
         */
        if (
            parent.closest(
                "script,style,noscript,template,code,pre"
            )
        ) {
            return;
        }

        if (
            parent.closest(
                "[data-i18n-ignore]"
            )
        ) {
            return;
        }

        /*
         * Home card/page names remain English.
         */
        if (
            isHomeFilePageNameElement(
                parent
            )
        ) {
            keepHomeFilePageNameEnglish(
                parent
            );
            return;
        }

        rememberOriginalText(
            textNode
        );

        const original =
            getOriginalTextNodeText(
                textNode
            );

        const cleanOriginal =
            normalizeTranslationKey(
                original
            );

        if (!cleanOriginal) {
            return;
        }

        const translated =
            getTranslation(
                cleanOriginal,
                languageCode
            );

        const newText =
            replaceCoreTextPreservingWhitespace(
                original,
                translated
            );

        if (
            textNode.textContent !==
            newText
        ) {
            textNode.textContent =
                newText;
        }
    }


    /* =====================================================
       TRANSLATE COMMON TEXT
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
                    acceptNode: function (node) {
                        const parent =
                            node.parentElement;

                        if (!parent) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        if (
                            parent.closest(
                                "script,style,noscript,template,code,pre"
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

                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

        const nodes = [];

        let currentNode;

        while (
            (currentNode =
                walker.nextNode())
        ) {
            nodes.push(currentNode);
        }

        for (
            let i = 0;
            i < nodes.length;
            i++
        ) {
            translateTextNode(
                nodes[i],
                languageCode
            );
        }
    }


    /* =====================================================
       EXPLICIT ELEMENT TRANSLATION
       ===================================================== */

    function translateElement(
        element,
        languageCode
    ) {
        if (!element) {
            return;
        }

        /*
         * data-i18n text
         */
        const textKey =
            element.getAttribute(
                CONFIG.translationAttributes.text
            );

        if (textKey) {
            const translated =
                getTranslation(
                    textKey,
                    languageCode
                );

            /*
             * If the element has child nodes, only replace
             * direct text nodes to avoid destroying controls.
             */
            let hasElementChild = false;

            for (
                let i = 0;
                i < element.childNodes.length;
                i++
            ) {
                if (
                    element.childNodes[i]
                        .nodeType ===
                    Node.ELEMENT_NODE
                ) {
                    hasElementChild = true;
                    break;
                }
            }

            if (!hasElementChild) {
                element.textContent =
                    translated;
            } else {
                const childNodes =
                    Array.from(
                        element.childNodes
                    );

                for (
                    let i = 0;
                    i < childNodes.length;
                    i++
                ) {
                    const node =
                        childNodes[i];

                    if (
                        node.nodeType ===
                        Node.TEXT_NODE
                    ) {
                        node.textContent =
                            translated;
                        break;
                    }
                }
            }
        }

        /*
         * Placeholder
         */
        const placeholderKey =
            element.getAttribute(
                CONFIG.translationAttributes.placeholder
            );

        if (placeholderKey) {
            element.setAttribute(
                "placeholder",
                getTranslation(
                    placeholderKey,
                    languageCode
                )
            );
        }

        /*
         * Title
         */
        const titleKey =
            element.getAttribute(
                CONFIG.translationAttributes.title
            );

        if (titleKey) {
            element.setAttribute(
                "title",
                getTranslation(
                    titleKey,
                    languageCode
                )
            );
        }

        /*
         * ARIA label
         */
        const ariaKey =
            element.getAttribute(
                CONFIG.translationAttributes.aria
            );

        if (ariaKey) {
            element.setAttribute(
                "aria-label",
                getTranslation(
                    ariaKey,
                    languageCode
                )
            );
        }
    }


    /* =====================================================
       TRANSLATE EXPLICIT ELEMENTS
       ===================================================== */

    function translateExplicitElements(
        root,
        languageCode
    ) {
        if (!root) {
            return;
        }

        const selector = [
            "[" +
                CONFIG.translationAttributes.text +
            "]",

            "[" +
                CONFIG.translationAttributes.placeholder +
            "]",

            "[" +
                CONFIG.translationAttributes.title +
            "]",

            "[" +
                CONFIG.translationAttributes.aria +
            "]"
        ].join(",");

        let elements = [];

        if (
            root.nodeType ===
            Node.ELEMENT_NODE
        ) {
            if (
                root.matches(selector)
            ) {
                elements.push(root);
            }
        }

        const descendants =
            root.querySelectorAll
                ? root.querySelectorAll(selector)
                : [];

        for (
            let i = 0;
            i < descendants.length;
            i++
        ) {
            elements.push(
                descendants[i]
            );
        }

        for (
            let i = 0;
            i < elements.length;
            i++
        ) {
            translateElement(
                elements[i],
                languageCode
            );
        }
    }


    /* =====================================================
       DOCUMENT TITLE
       ===================================================== */

    function translateDocumentTitle(
        languageCode
    ) {
        const titleElement =
            document.querySelector("title");

        if (!titleElement) {
            return;
        }

        if (
            !originalTitleMap.has(
                titleElement
            )
        ) {
            originalTitleMap.set(
                titleElement,
                titleElement.textContent ||
                    CONFIG.project
            );
        }

        const original =
            originalTitleMap.get(
                titleElement
            );

        const clean =
            normalizeTranslationKey(
                original
            );

        /*
         * ALON HISTORYVERSE 24 remains the project name.
         * Translate only if a dictionary entry exists.
         */
        const translated =
            getTranslation(
                clean,
                languageCode
            );

        titleElement.textContent =
            translated;
    }


    /* =====================================================
       DOCUMENT LANGUAGE META
       ===================================================== */

    function updateDocumentLanguage(
        languageCode
    ) {
        const config =
            WORLD_LANGUAGE_CONFIG[
                languageCode
            ] ||
            WORLD_LANGUAGE_CONFIG.en;

        document.documentElement.lang =
            config.code;

        document.documentElement.dir =
            config.direction;

        document.documentElement
            .setAttribute(
                "data-alon-language",
                config.code
            );
    }


    /* =====================================================
       LANGUAGE BUTTONS
       ===================================================== */

    function getLanguageButtons() {
        const buttons = [];

        for (
            let i = 0;
            i < CONFIG.buttonSelectors.length;
            i++
        ) {
            const selector =
                CONFIG.buttonSelectors[i];

            const found =
                document.querySelectorAll(
                    selector
                );

            for (
                let j = 0;
                j < found.length;
                j++
            ) {
                if (
                    buttons.indexOf(
                        found[j]
                    ) === -1
                ) {
                    buttons.push(
                        found[j]
                    );
                }
            }
        }

        return buttons;
    }


    /* =====================================================
       UPDATE LANGUAGE BUTTONS
       -----------------------------------------------------
       Do NOT insert standalone "हिन्दी" text above search.
       Only update existing button attributes.
       ===================================================== */

    function updateLanguageButtons() {
        const buttons =
            getLanguageButtons();

        const config =
            WORLD_LANGUAGE_CONFIG[
                currentLanguage
            ] ||
            WORLD_LANGUAGE_CONFIG.en;

        for (
            let i = 0;
            i < buttons.length;
            i++
        ) {
            const button =
                buttons[i];

            /*
             * Store current language as data only.
             * No new visible text is inserted.
             */
            button.dataset.language =
                config.code;

            button.setAttribute(
                "aria-label",
                config.name
            );

            button.setAttribute(
                "title",
                config.name
            );
        }
    }


    /* =====================================================
       CREATE LANGUAGE OVERLAY
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

        overlay.setAttribute(
            "data-i18n-ignore",
            ""
        );

        overlay.style.display =
            "none";

        overlay.innerHTML = `
            <div class="alon-language-panel">

                <div class="alon-language-header">

                    <div>
                        <strong>Choose Language</strong>
                        <div>
                            Select your preferred language
                        </div>
                    </div>

                    <button
                        type="button"
                        data-alon-language-close
                        aria-label="Close language selector"
                    >
                        ×
                    </button>

                </div>

                <div
                    id="${CONFIG.selectorId}"
                    class="alon-language-list"
                ></div>

            </div>
        `;

        document.body.appendChild(
            overlay
        );

        const closeButton =
            overlay.querySelector(
                "[data-alon-language-close]"
            );

        if (closeButton) {
            closeButton.addEventListener(
                "click",
                function () {
                    closeLanguageSelector();
                }
            );
        }

        return overlay;
    }


    /* =====================================================
       RENDER LANGUAGE LIST
       ===================================================== */

    function renderLanguageList() {
        const overlay =
            document.getElementById(
                CONFIG.overlayId
            );

        if (!overlay) {
            return;
        }

        const list =
            document.getElementById(
                CONFIG.selectorId
            );

        if (!list) {
            return;
        }

        list.innerHTML = "";

        const languages =
            Object.keys(
                WORLD_LANGUAGE_CONFIG
            );

        for (
            let i = 0;
            i < languages.length;
            i++
        ) {
            const code =
                languages[i];

            const language =
                WORLD_LANGUAGE_CONFIG[
                    code
                ];

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "alon-language-option";

            button.dataset.language =
                code;

            if (
                code === currentLanguage
            ) {
                button.classList.add(
                    "active"
                );
            }

            button.innerHTML = `
                <span>
                    ${language.name}
                </span>
                <small>
                    ${language.nativeName}
                </small>
            `;

            button.addEventListener(
                "click",
                function () {
                    setLanguage(code);
                    closeLanguageSelector();
                }
            );

            list.appendChild(
                button
            );
        }
    }


    /* =====================================================
       OPEN LANGUAGE SELECTOR
       ===================================================== */

    function openLanguageSelector() {
        const overlay =
            createOverlay();

        if (!overlay) {
            return;
        }

        overlay.style.display =
            "block";

        renderLanguageList();
    }


    /* =====================================================
       CLOSE LANGUAGE SELECTOR
       ===================================================== */

    function closeLanguageSelector() {
        const overlay =
            document.getElementById(
                CONFIG.overlayId
            );

        if (!overlay) {
            return;
        }

        overlay.style.display =
            "none";
    }


    /* =====================================================
       BIND LANGUAGE BUTTONS
       ===================================================== */

    function bindLanguageButtons() {
        const buttons =
            getLanguageButtons();

        for (
            let i = 0;
            i < buttons.length;
            i++
        ) {
            const button =
                buttons[i];

            if (
                button.dataset
                    .alonLanguageBound ===
                "true"
            ) {
                continue;
            }

            button.dataset
                .alonLanguageBound =
                "true";

            button.addEventListener(
                "click",
                function (event) {
                    /*
                     * Do not block buttons that are explicitly
                     * controlled by another ALON system.
                     */
                    event.preventDefault();
                    event.stopPropagation();

                    openLanguageSelector();
                }
            );
        }
    }


    /* =====================================================
       BIND WORLD LANGUAGE ENGINE
       ===================================================== */

    function bindWorldLanguageEngine() {
        document.addEventListener(
            "alon:world-language-change",
            function (event) {
                const detail =
                    event.detail || {};

                const code =
                    detail.language ||
                    detail.code;

                if (
                    isSupportedLanguage(code)
                ) {
                    setLanguage(
                        code,
                        false
                    );
                }
            }
        );
    }


    /* =====================================================
       APPLY SAVED LANGUAGE
       ===================================================== */

    function applySavedLanguage() {
        const saved =
            getSavedLanguage();

        currentLanguage =
            saved;

        updateDocumentLanguage(
            currentLanguage
        );
    }


    /* =====================================================
       TRANSLATE PAGE
       ===================================================== */

    function translatePage() {
        if (!document.body) {
            return;
        }

        const languageCode =
            currentLanguage;

        /*
         * First explicit translations.
         */
        translateExplicitElements(
            document.body,
            languageCode
        );

        /*
         * Then common raw text.
         */
        translateCommonText(
            document.body,
            languageCode
        );

        /*
         * Finally protect Home file/page names.
         */
        if (isHomePage()) {
            const homeCards =
                document.querySelectorAll(
                    ".card h3"
                );

            for (
                let i = 0;
                i < homeCards.length;
                i++
            ) {
                keepHomeFilePageNameEnglish(
                    homeCards[i]
                );
            }
        }

        translateDocumentTitle(
            languageCode
        );

        updateDocumentLanguage(
            languageCode
        );

        updateLanguageButtons();
    }


    /* =====================================================
       SCHEDULE TRANSLATION
       ===================================================== */

    function scheduleTranslate() {
        if (translateTimer) {
            clearTimeout(
                translateTimer
            );
        }

        translateTimer =
            setTimeout(
                function () {
                    translateTimer = null;

                    if (!initialized) {
                        return;
                    }

                    translatePage();
                },
                80
            );
    }


    /* =====================================================
       MUTATION OBSERVER
       ===================================================== */

    function startObserver() {
        if (observer) {
            return;
        }

        if (!document.body) {
            return;
        }

        observer =
            new MutationObserver(
                function (mutations) {
                    let hasAddedNodes = false;

                    for (
                        let i = 0;
                        i < mutations.length;
                        i++
                    ) {
                        const mutation =
                            mutations[i];

                        if (
                            mutation.type ===
                                "childList" &&
                            mutation.addedNodes &&
                            mutation.addedNodes.length
                        ) {
                            hasAddedNodes = true;
                            break;
                        }
                    }

                    if (
                        hasAddedNodes
                    ) {
                        scheduleTranslate();
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
       SET LANGUAGE
       ===================================================== */

    function setLanguage(
        code,
        persist = true
    ) {
        if (
            !isSupportedLanguage(code)
        ) {
            code =
                CONFIG.defaultLanguage;
        }

        currentLanguage =
            code;

        if (persist) {
            saveLanguage(code);
        }

        updateDocumentLanguage(
            currentLanguage
        );

        /*
         * Translate from stable original English source,
         * not from whatever text happens to be visible.
         */
        translatePage();

        updateLanguageButtons();

        renderLanguageList();

        /*
         * Notify other ALON systems.
         */
        try {
            document.dispatchEvent(
                new CustomEvent(
                    "alon:language-change",
                    {
                        detail: {
                            language:
                                currentLanguage,
                            code:
                                currentLanguage
                        }
                    }
                )
            );
        } catch (error) {
            /* Safe fallback */
        }
    }


    /* =====================================================
       GET CURRENT LANGUAGE
       ===================================================== */

    function getLanguage() {
        return currentLanguage;
    }


    /* =====================================================
       RESET LANGUAGE
       ===================================================== */

    function resetLanguage() {
        setLanguage(
            CONFIG.defaultLanguage,
            true
        );
    }


    /* =====================================================
       BACK BUTTON SUPPORT
       ===================================================== */

    function bindBackButtons() {
        const buttons =
            document.querySelectorAll(
                "[data-alon-back]"
            );

        for (
            let i = 0;
            i < buttons.length;
            i++
        ) {
            const button =
                buttons[i];

            if (
                button.dataset
                    .alonBackBound ===
                "true"
            ) {
                continue;
            }

            button.dataset
                .alonBackBound =
                "true";

            button.addEventListener(
                "click",
                function () {
                    if (
                        window.history.length >
                        1
                    ) {
                        window.history.back();
                    }
                }
            );
        }
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_LANGUAGE = {

        config: CONFIG,

        languages:
            WORLD_LANGUAGE_CONFIG,

        translations:
            TRANSLATIONS,

        getLanguage:
            getLanguage,

        setLanguage:
            setLanguage,

        resetLanguage:
            resetLanguage,

        open:
            openLanguageSelector,

        close:
            closeLanguageSelector,

        translate:
            translatePage,

        getTranslation:
            getTranslation
    };


    /* =====================================================
       COMPATIBILITY FUNCTIONS
       ===================================================== */

    window.setALONLanguage =
        setLanguage;

    window.getALONLanguage =
        getLanguage;

    window.openALONLanguageSelector =
        openLanguageSelector;

    window.closeALONLanguageSelector =
        closeLanguageSelector;


    /* =====================================================
       WORLD LANGUAGE GLOBAL CONFIG
       ===================================================== */

    if (
        !window.WORLD_LANGUAGE_CONFIG
    ) {
        window.WORLD_LANGUAGE_CONFIG =
            WORLD_LANGUAGE_CONFIG;
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {
        if (initialized) {
            return;
        }

        initialized = true;

        /*
         * Load saved language BEFORE translation.
         */
        applySavedLanguage();

        /*
         * Create selector only after body exists.
         */
        createOverlay();

        bindLanguageButtons();

        bindWorldLanguageEngine();

        bindBackButtons();

        /*
         * First stable translation.
         */
        translatePage();

        /*
         * Watch dynamic content.
         */
        startObserver();

        /*
         * One final pass after other scripts finish their
         * initial DOM work.
         */
        setTimeout(
            function () {
                const saved =
                    getSavedLanguage();

                if (
                    saved !==
                    currentLanguage
                ) {
                    currentLanguage =
                        saved;
                }

                updateDocumentLanguage(
                    currentLanguage
                );

                translatePage();
            },
            0
        );
    }


    /* =====================================================
       START
       ===================================================== */

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