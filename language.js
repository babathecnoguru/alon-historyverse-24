/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/language.js
   GLOBAL WORLD LANGUAGE + TRANSLATION ENGINE
   Creator / Owner: Baba Thecno Guru

   VERSION:
   ALON-LANGUAGE-ENGINE-200

   FEATURES:
   - World Language Registry
   - India Language Registry
   - English / Hindi Interface
   - Language Detection
   - LocalStorage Persistence
   - Language Panel
   - Language Search
   - RTL Support
   - data-i18n
   - data-i18n-placeholder
   - data-i18n-title
   - Dynamic DOM Translation
   - Custom Language Events
   - Global ALON_LANGUAGE_ENGINE API
   - Future Translation Provider Hook
========================================================= */


/* =========================================================
   ENGINE CONFIG
========================================================= */

const LANGUAGE_CONFIG = {

    version:
        "ALON-LANGUAGE-ENGINE-200",

    defaultLanguage:
        "en",

    fallbackLanguage:
        "en",

    storageKey:
        "alon_historyverse_language",

    autoDetect:
        true,

    supportedInterfaceLanguages: [
        "en",
        "hi"
    ],

    rtlLanguages: [
        "ar",
        "fa",
        "he",
        "ur"
    ],

    panelId:
        "languagePanel",

    listId:
        "languageList",

    searchId:
        "languageSearch",

    openButtonId:
        "languageBtn",

    closeButtonId:
        "closeLang",

    observeDOM:
        true

};


/* =========================================================
   WORLD LANGUAGE REGISTRY
========================================================= */

export const WORLD_LANGUAGES = [

    {
        code: "en",
        name: "English",
        nativeName: "English",
        region: "World",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "United Kingdom",
            "United States",
            "Canada",
            "Australia",
            "New Zealand"
        ]
    },

    {
        code: "hi",
        name: "Hindi",
        nativeName: "हिन्दी",
        region: "South Asia",
        family: "Indo-European",
        script: "Devanagari",
        countries: [
            "India"
        ]
    },

    {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        region: "South Asia",
        family: "Indo-European",
        script: "Bengali",
        countries: [
            "India",
            "Bangladesh"
        ]
    },

    {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        region: "South Asia",
        family: "Dravidian",
        script: "Telugu",
        countries: [
            "India"
        ]
    },

    {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        region: "South Asia",
        family: "Indo-European",
        script: "Devanagari",
        countries: [
            "India"
        ]
    },

    {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        region: "South Asia",
        family: "Dravidian",
        script: "Tamil",
        countries: [
            "India",
            "Sri Lanka"
        ]
    },

    {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        region: "South Asia",
        family: "Indo-European",
        script: "Gujarati",
        countries: [
            "India"
        ]
    },

    {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        region: "South Asia",
        family: "Dravidian",
        script: "Kannada",
        countries: [
            "India"
        ]
    },

    {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        region: "South Asia",
        family: "Dravidian",
        script: "Malayalam",
        countries: [
            "India"
        ]
    },

    {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        region: "South Asia",
        family: "Indo-European",
        script: "Gurmukhi",
        countries: [
            "India",
            "Pakistan"
        ]
    },

    {
        code: "ur",
        name: "Urdu",
        nativeName: "اردو",
        region: "South Asia",
        family: "Indo-European",
        script: "Arabic",
        countries: [
            "India",
            "Pakistan"
        ]
    },

    {
        code: "or",
        name: "Odia",
        nativeName: "ଓଡ଼ିଆ",
        region: "South Asia",
        family: "Indo-European",
        script: "Odia",
        countries: [
            "India"
        ]
    },

    {
        code: "as",
        name: "Assamese",
        nativeName: "অসমীয়া",
        region: "South Asia",
        family: "Indo-European",
        script: "Bengali-Assamese",
        countries: [
            "India"
        ]
    },

    {
        code: "ne",
        name: "Nepali",
        nativeName: "नेपाली",
        region: "South Asia",
        family: "Indo-European",
        script: "Devanagari",
        countries: [
            "Nepal",
            "India"
        ]
    },

    {
        code: "sa",
        name: "Sanskrit",
        nativeName: "संस्कृतम्",
        region: "South Asia",
        family: "Indo-European",
        script: "Devanagari",
        countries: [
            "India"
        ]
    },

    {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        region: "Middle East",
        family: "Afro-Asiatic",
        script: "Arabic",
        countries: [
            "Egypt",
            "Saudi Arabia",
            "United Arab Emirates",
            "Iraq",
            "Jordan"
        ]
    },

    {
        code: "fa",
        name: "Persian",
        nativeName: "فارسی",
        region: "West Asia",
        family: "Indo-European",
        script: "Perso-Arabic",
        countries: [
            "Iran",
            "Afghanistan",
            "Tajikistan"
        ]
    },

    {
        code: "he",
        name: "Hebrew",
        nativeName: "עברית",
        region: "Middle East",
        family: "Afro-Asiatic",
        script: "Hebrew",
        countries: [
            "Israel"
        ]
    },

    {
        code: "tr",
        name: "Turkish",
        nativeName: "Türkçe",
        region: "West Asia / Europe",
        family: "Turkic",
        script: "Latin",
        countries: [
            "Turkey"
        ]
    },

    {
        code: "ru",
        name: "Russian",
        nativeName: "Русский",
        region: "Europe / Asia",
        family: "Indo-European",
        script: "Cyrillic",
        countries: [
            "Russia",
            "Belarus",
            "Kazakhstan"
        ]
    },

    {
        code: "uk",
        name: "Ukrainian",
        nativeName: "Українська",
        region: "Europe",
        family: "Indo-European",
        script: "Cyrillic",
        countries: [
            "Ukraine"
        ]
    },

    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Germany",
            "Austria",
            "Switzerland"
        ]
    },

    {
        code: "fr",
        name: "French",
        nativeName: "Français",
        region: "Europe / World",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "France",
            "Canada",
            "Belgium",
            "Switzerland"
        ]
    },

    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        region: "Europe / Americas",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Spain",
            "Mexico",
            "Argentina",
            "Colombia"
        ]
    },

    {
        code: "pt",
        name: "Portuguese",
        nativeName: "Português",
        region: "Europe / Americas",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Portugal",
            "Brazil"
        ]
    },

    {
        code: "it",
        name: "Italian",
        nativeName: "Italiano",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Italy"
        ]
    },

    {
        code: "nl",
        name: "Dutch",
        nativeName: "Nederlands",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Netherlands",
            "Belgium"
        ]
    },

    {
        code: "pl",
        name: "Polish",
        nativeName: "Polski",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Poland"
        ]
    },

    {
        code: "el",
        name: "Greek",
        nativeName: "Ελληνικά",
        region: "Europe",
        family: "Indo-European",
        script: "Greek",
        countries: [
            "Greece",
            "Cyprus"
        ]
    },

    {
        code: "sv",
        name: "Swedish",
        nativeName: "Svenska",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Sweden"
        ]
    },

    {
        code: "no",
        name: "Norwegian",
        nativeName: "Norsk",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Norway"
        ]
    },

    {
        code: "da",
        name: "Danish",
        nativeName: "Dansk",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Denmark"
        ]
    },

    {
        code: "fi",
        name: "Finnish",
        nativeName: "Suomi",
        region: "Europe",
        family: "Uralic",
        script: "Latin",
        countries: [
            "Finland"
        ]
    },

    {
        code: "cs",
        name: "Czech",
        nativeName: "Čeština",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Czech Republic"
        ]
    },

    {
        code: "hu",
        name: "Hungarian",
        nativeName: "Magyar",
        region: "Europe",
        family: "Uralic",
        script: "Latin",
        countries: [
            "Hungary"
        ]
    },

    {
        code: "ro",
        name: "Romanian",
        nativeName: "Română",
        region: "Europe",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Romania"
        ]
    },

    {
        code: "bg",
        name: "Bulgarian",
        nativeName: "Български",
        region: "Europe",
        family: "Indo-European",
        script: "Cyrillic",
        countries: [
            "Bulgaria"
        ]
    },

    {
        code: "sr",
        name: "Serbian",
        nativeName: "Српски",
        region: "Europe",
        family: "Indo-European",
        script: "Cyrillic / Latin",
        countries: [
            "Serbia"
        ]
    },

    {
        code: "zh",
        name: "Chinese",
        nativeName: "中文",
        region: "East Asia",
        family: "Sino-Tibetan",
        script: "Chinese",
        countries: [
            "China",
            "Taiwan",
            "Singapore"
        ]
    },

    {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        region: "East Asia",
        family: "Japonic",
        script: "Japanese",
        countries: [
            "Japan"
        ]
    },

    {
        code: "ko",
        name: "Korean",
        nativeName: "한국어",
        region: "East Asia",
        family: "Koreanic",
        script: "Hangul",
        countries: [
            "South Korea",
            "North Korea"
        ]
    },

    {
        code: "mn",
        name: "Mongolian",
        nativeName: "Монгол",
        region: "East Asia",
        family: "Mongolic",
        script: "Cyrillic / Traditional",
        countries: [
            "Mongolia"
        ]
    },

    {
        code: "th",
        name: "Thai",
        nativeName: "ไทย",
        region: "Southeast Asia",
        family: "Kra-Dai",
        script: "Thai",
        countries: [
            "Thailand"
        ]
    },

    {
        code: "vi",
        name: "Vietnamese",
        nativeName: "Tiếng Việt",
        region: "Southeast Asia",
        family: "Austroasiatic",
        script: "Latin",
        countries: [
            "Vietnam"
        ]
    },

    {
        code: "id",
        name: "Indonesian",
        nativeName: "Bahasa Indonesia",
        region: "Southeast Asia",
        family: "Austronesian",
        script: "Latin",
        countries: [
            "Indonesia"
        ]
    },

    {
        code: "ms",
        name: "Malay",
        nativeName: "Bahasa Melayu",
        region: "Southeast Asia",
        family: "Austronesian",
        script: "Latin",
        countries: [
            "Malaysia",
            "Brunei",
            "Singapore"
        ]
    },

    {
        code: "tl",
        name: "Filipino",
        nativeName: "Filipino",
        region: "Southeast Asia",
        family: "Austronesian",
        script: "Latin",
        countries: [
            "Philippines"
        ]
    },

    {
        code: "sw",
        name: "Swahili",
        nativeName: "Kiswahili",
        region: "Africa",
        family: "Niger-Congo",
        script: "Latin",
        countries: [
            "Kenya",
            "Tanzania",
            "Uganda"
        ]
    },

    {
        code: "am",
        name: "Amharic",
        nativeName: "አማርኛ",
        region: "Africa",
        family: "Afro-Asiatic",
        script: "Ge'ez",
        countries: [
            "Ethiopia"
        ]
    },

    {
        code: "yo",
        name: "Yoruba",
        nativeName: "Yorùbá",
        region: "Africa",
        family: "Niger-Congo",
        script: "Latin",
        countries: [
            "Nigeria"
        ]
    },

    {
        code: "ig",
        name: "Igbo",
        nativeName: "Igbo",
        region: "Africa",
        family: "Niger-Congo",
        script: "Latin",
        countries: [
            "Nigeria"
        ]
    },

    {
        code: "zu",
        name: "Zulu",
        nativeName: "isiZulu",
        region: "Africa",
        family: "Niger-Congo",
        script: "Latin",
        countries: [
            "South Africa"
        ]
    },

    {
        code: "ha",
        name: "Hausa",
        nativeName: "Hausa",
        region: "Africa",
        family: "Afro-Asiatic",
        script: "Latin / Arabic",
        countries: [
            "Nigeria",
            "Niger"
        ]
    },

    {
        code: "af",
        name: "Afrikaans",
        nativeName: "Afrikaans",
        region: "Africa",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "South Africa",
            "Namibia"
        ]
    },

    {
        code: "la",
        name: "Latin",
        nativeName: "Latina",
        region: "Historical",
        family: "Indo-European",
        script: "Latin",
        countries: [
            "Historical Europe"
        ]
    },

    {
        code: "eo",
        name: "Esperanto",
        nativeName: "Esperanto",
        region: "World",
        family: "Constructed",
        script: "Latin",
        countries: []
    }

];


/* =========================================================
   INDIA LANGUAGE REGISTRY
========================================================= */

export const INDIA_LANGUAGES = [

    {
        code: "hi",
        name: "Hindi",
        nativeName: "हिन्दी",
        script: "Devanagari"
    },

    {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        script: "Bengali"
    },

    {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        script: "Telugu"
    },

    {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        script: "Devanagari"
    },

    {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        script: "Tamil"
    },

    {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        script: "Gujarati"
    },

    {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        script: "Kannada"
    },

    {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        script: "Malayalam"
    },

    {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        script: "Gurmukhi"
    },

    {
        code: "or",
        name: "Odia",
        nativeName: "ଓଡ଼ିଆ",
        script: "Odia"
    },

    {
        code: "as",
        name: "Assamese",
        nativeName: "অসমীয়া",
        script: "Bengali-Assamese"
    },

    {
        code: "ur",
        name: "Urdu",
        nativeName: "اردو",
        script: "Perso-Arabic"
    },

    {
        code: "sa",
        name: "Sanskrit",
        nativeName: "संस्कृतम्",
        script: "Devanagari"
    },

    {
        code: "ne",
        name: "Nepali",
        nativeName: "नेपाली",
        script: "Devanagari"
    }

];


/* =========================================================
   UI TRANSLATION DICTIONARY
========================================================= */

const UI_TRANSLATIONS = {

    en: {

        home: "Home",
        history: "History",
        explore: "Explore",
        articles: "Articles",
        timeline: "Timeline",
        library: "Library",
        countries: "Countries",
        civilizations: "Civilizations",
        heritage: "Heritage",
        discover: "Discover",
        gallery: "Gallery",
        contribute: "Contribute",
        about: "About",
        contact: "Contact",
        search: "Search",
        language: "Language",
        read: "Read",
        books: "Books",
        subjects: "Subjects",
        departments: "Departments",
        admin: "Admin",
        close: "Close",
        open: "Open",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        submit: "Submit",
        loading: "Loading",
        next: "Next",
        previous: "Previous",
        back: "Back",
        homePage: "Home Page",
        noResults: "No results found",
        languageNotFound: "No language found",
        tryAnotherLanguage: "Try another language name.",
        selectLanguage: "Select Language",
        currentLanguage: "Current Language",
        worldLanguages: "World Languages",
        indiaLanguages: "Indian Languages"

    },


    hi: {

        home: "होम",
        history: "इतिहास",
        explore: "खोजें",
        articles: "लेख",
        timeline: "समयरेखा",
        library: "पुस्तकालय",
        countries: "देश",
        civilizations: "सभ्यताएँ",
        heritage: "विरासत",
        discover: "डिस्कवर",
        gallery: "गैलरी",
        contribute: "योगदान करें",
        about: "हमारे बारे में",
        contact: "संपर्क",
        search: "खोजें",
        language: "भाषा",
        read: "पढ़ें",
        books: "पुस्तकें",
        subjects: "विषय",
        departments: "विभाग",
        admin: "एडमिन",
        close: "बंद करें",
        open: "खोलें",
        save: "सहेजें",
        cancel: "रद्द करें",
        delete: "हटाएँ",
        edit: "संपादित करें",
        submit: "जमा करें",
        loading: "लोड हो रहा है",
        next: "अगला",
        previous: "पिछला",
        back: "वापस",
        homePage: "होम पेज",
        noResults: "कोई परिणाम नहीं मिला",
        languageNotFound: "कोई भाषा नहीं मिली",
        tryAnotherLanguage: "किसी अन्य भाषा का नाम आज़माएँ।",
        selectLanguage: "भाषा चुनें",
        currentLanguage: "वर्तमान भाषा",
        worldLanguages: "विश्व भाषाएँ",
        indiaLanguages: "भारतीय भाषाएँ"

    }

};


/* =========================================================
   KNOWN PHRASE DICTIONARY
========================================================= */

const KNOWN_PHRASES = {

    en: {

        "home": "Home",
        "history": "History",
        "explore": "Explore",
        "articles": "Articles",
        "countries": "Countries",
        "civilizations": "Civilizations",
        "heritage": "Heritage",
        "timeline": "Timeline",
        "library": "Library",
        "language": "Language",
        "search": "Search",
        "read": "Read",
        "books": "Books",
        "subjects": "Subjects",
        "departments": "Departments",
        "contact": "Contact",
        "about": "About",
        "gallery": "Gallery",
        "contribute": "Contribute"

    },

    hi: {

        "home": "होम",
        "history": "इतिहास",
        "explore": "खोजें",
        "articles": "लेख",
        "countries": "देश",
        "civilizations": "सभ्यताएँ",
        "heritage": "विरासत",
        "timeline": "समयरेखा",
        "library": "पुस्तकालय",
        "language": "भाषा",
        "search": "खोजें",
        "read": "पढ़ें",
        "books": "पुस्तकें",
        "subjects": "विषय",
        "departments": "विभाग",
        "contact": "संपर्क",
        "about": "हमारे बारे में",
        "gallery": "गैलरी",
        "contribute": "योगदान करें"

    }

};


/* =========================================================
   INTERNAL STATE
========================================================= */

let currentLanguage =
    LANGUAGE_CONFIG.defaultLanguage;

let languagePanelOpen =
    false;

let languageInitialized =
    false;

let domObserver =
    null;


/* =========================================================
   SAFE LOCAL STORAGE
========================================================= */

function getStoredLanguage() {

    try {

        return localStorage.getItem(
            LANGUAGE_CONFIG.storageKey
        );

    } catch (error) {

        return null;

    }

}


function saveLanguage(code) {

    try {

        localStorage.setItem(
            LANGUAGE_CONFIG.storageKey,
            code
        );

    } catch (error) {

        /* Storage may be unavailable. */

    }

}


/* =========================================================
   LANGUAGE NORMALIZATION
========================================================= */

function normalizeLanguageCode(code) {

    return String(code || "")
        .trim()
        .toLowerCase()
        .replace("_", "-")
        .split("-")[0];

}


/* =========================================================
   LANGUAGE VALIDATION
========================================================= */

function isLanguageSupported(code) {

    const normalized =
        normalizeLanguageCode(code);

    return WORLD_LANGUAGES.some(
        language =>
            language.code === normalized
    );

}


function isInterfaceLanguage(code) {

    const normalized =
        normalizeLanguageCode(code);

    return LANGUAGE_CONFIG
        .supportedInterfaceLanguages
        .includes(normalized);

}


/* =========================================================
   BROWSER LANGUAGE DETECTION
========================================================= */

function detectBrowserLanguage() {

    if (!LANGUAGE_CONFIG.autoDetect) {

        return null;

    }

    if (
        typeof navigator === "undefined"
    ) {

        return null;

    }

    const browserLanguage =
        navigator.language ||
        navigator.userLanguage ||
        "";

    const shortCode =
        normalizeLanguageCode(
            browserLanguage
        );

    return isLanguageSupported(
        shortCode
    )
        ? shortCode
        : null;

}


/* =========================================================
   LANGUAGE INFORMATION
========================================================= */

export function getLanguage(code) {

    const normalized =
        normalizeLanguageCode(code);

    return WORLD_LANGUAGES.find(
        language =>
            language.code === normalized
    ) || null;

}


export function getLanguages() {

    return [
        ...WORLD_LANGUAGES
    ];

}


export function getIndiaLanguages() {

    return [
        ...INDIA_LANGUAGES
    ];

}


export function getInterfaceLanguages() {

    return WORLD_LANGUAGES.filter(
        language =>
            isInterfaceLanguage(
                language.code
            )
    );

}


/* =========================================================
   CURRENT LANGUAGE
========================================================= */

export function getCurrentLanguage() {

    return currentLanguage;

}


export function getCurrentLanguageInfo() {

    return getLanguage(
        currentLanguage
    );

}


/* =========================================================
   RTL SUPPORT
========================================================= */

function isRTL(code) {

    return LANGUAGE_CONFIG
        .rtlLanguages
        .includes(
            normalizeLanguageCode(code)
        );

}


function applyTextDirection() {

    if (
        typeof document === "undefined"
    ) {

        return;

    }

    const direction =
        isRTL(currentLanguage)
            ? "rtl"
            : "ltr";

    document.documentElement
        .setAttribute(
            "dir",
            direction
        );

}


/* =========================================================
   TRANSLATION KEY
========================================================= */

export function translateKey(key) {

    const normalizedKey =
        String(key || "").trim();

    if (!normalizedKey) {

        return "";

    }

    const currentDictionary =
        UI_TRANSLATIONS[
            currentLanguage
        ];

    if (
        currentDictionary &&
        Object.prototype.hasOwnProperty.call(
            currentDictionary,
            normalizedKey
        )
    ) {

        return currentDictionary[
            normalizedKey
        ];

    }

    const fallbackDictionary =
        UI_TRANSLATIONS[
            LANGUAGE_CONFIG.fallbackLanguage
        ];

    if (
        fallbackDictionary &&
        Object.prototype.hasOwnProperty.call(
            fallbackDictionary,
            normalizedKey
        )
    ) {

        return fallbackDictionary[
            normalizedKey
        ];

    }

    return normalizedKey;

}


/* =========================================================
   APPLY TEXT TRANSLATION
========================================================= */

function translateElementText(element) {

    if (!element) {
        return;
    }

    const key =
        element.getAttribute(
            "data-i18n"
        );

    if (!key) {
        return;
    }

    const translated =
        translateKey(key);

    element.textContent =
        translated;

}


/* =========================================================
   APPLY PLACEHOLDER TRANSLATION
========================================================= */

function translateElementPlaceholder(element) {

    if (!element) {
        return;
    }

    const key =
        element.getAttribute(
            "data-i18n-placeholder"
        );

    if (!key) {
        return;
    }

    element.setAttribute(
        "placeholder",
        translateKey(key)
    );

}


/* =========================================================
   APPLY TITLE TRANSLATION
========================================================= */

function translateElementTitle(element) {

    if (!element) {
        return;
    }

    const key =
        element.getAttribute(
            "data-i18n-title"
        );

    if (!key) {
        return;
    }

    element.setAttribute(
        "title",
        translateKey(key)
    );

}


/* =========================================================
   APPLY ARIA LABEL TRANSLATION
========================================================= */

function translateElementAria(element) {

    if (!element) {
        return;
    }

    const key =
        element.getAttribute(
            "data-i18n-aria"
        );

    if (!key) {
        return;
    }

    element.setAttribute(
        "aria-label",
        translateKey(key)
    );

}


/* =========================================================
   APPLY INTERFACE LANGUAGE
========================================================= */

export function applyInterfaceLanguage(root = document) {

    if (!root) {
        return;
    }

    const elements =
        root.querySelectorAll
            ? root.querySelectorAll(
                "[data-i18n]"
            )
            : [];

    elements.forEach(
        translateElementText
    );


    const placeholders =
        root.querySelectorAll
            ? root.querySelectorAll(
                "[data-i18n-placeholder]"
            )
            : [];

    placeholders.forEach(
        translateElementPlaceholder
    );


    const titles =
        root.querySelectorAll
            ? root.querySelectorAll(
                "[data-i18n-title]"
            )
            : [];

    titles.forEach(
        translateElementTitle
    );


    const ariaLabels =
        root.querySelectorAll
            ? root.querySelectorAll(
                "[data-i18n-aria]"
            )
            : [];

    ariaLabels.forEach(
        translateElementAria
    );


    if (
        typeof document !== "undefined"
    ) {

        document.documentElement
            .setAttribute(
                "lang",
                currentLanguage
            );

    }

    applyTextDirection();

    updateLanguageIndicator();

}


/* =========================================================
   LANGUAGE INDICATOR
========================================================= */

export function updateLanguageIndicator() {

    const language =
        getCurrentLanguageInfo();

    if (!language) {
        return;
    }

    const indicators =
        document.querySelectorAll(
            "[data-current-language]"
        );

    indicators.forEach(
        element => {

            element.textContent =
                language.nativeName;

        }
    );


    const names =
        document.querySelectorAll(
            "[data-current-language-name]"
        );

    names.forEach(
        element => {

            element.textContent =
                language.name;

        }
    );


    const codes =
        document.querySelectorAll(
            "[data-current-language-code]"
        );

    codes.forEach(
        element => {

            element.textContent =
                language.code
                    .toUpperCase();

        }
    );

}


/* =========================================================
   SET LANGUAGE
========================================================= */

export function setLanguage(code) {

    const normalized =
        normalizeLanguageCode(code);

    if (
        !isLanguageSupported(
            normalized
        )
    ) {

        console.warn(
            "[ALON LANGUAGE] Unsupported language:",
            normalized
        );

        return false;

    }


    const previousLanguage =
        currentLanguage;


    currentLanguage =
        normalized;


    saveLanguage(
        normalized
    );


    applyInterfaceLanguage();


    updateLanguageIndicator();


    if (
        typeof document !== "undefined"
    ) {

        document.dispatchEvent(
            new CustomEvent(
                "historyverse:languagechange",
                {
                    detail: {

                        language:
                            normalized,

                        previousLanguage:
                            previousLanguage,

                        languageInfo:
                            getLanguage(
                                normalized
                            ),

                        interfaceSupported:
                            isInterfaceLanguage(
                                normalized
                            )

                    }
                }
            )
        );

    }


    return true;

}


/* =========================================================
   LANGUAGE PANEL
========================================================= */

export function openLanguagePanel() {

    const panel =
        document.getElementById(
            LANGUAGE_CONFIG.panelId
        );

    if (!panel) {

        console.warn(
            "[ALON LANGUAGE] languagePanel not found."
        );

        return false;

    }


    panel.classList.add(
        "open"
    );


    panel.setAttribute(
        "aria-hidden",
        "false"
    );


    languagePanelOpen =
        true;


    document.body.classList.add(
        "language-panel-open"
    );


    renderLanguageList();


    return true;

}


export function closeLanguagePanel() {

    const panel =
        document.getElementById(
            LANGUAGE_CONFIG.panelId
        );

    if (!panel) {
        return false;
    }


    panel.classList.remove(
        "open"
    );


    panel.setAttribute(
        "aria-hidden",
        "true"
    );


    languagePanelOpen =
        false;


    document.body.classList.remove(
        "language-panel-open"
    );


    document.body.style.overflow =
        "";


    return true;

}


export function toggleLanguagePanel() {

    if (languagePanelOpen) {

        return closeLanguagePanel();

    }

    return openLanguagePanel();

}


/* =========================================================
   LANGUAGE LIST FILTER
========================================================= */

export function searchLanguages(
    query = ""
) {

    const term =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!term) {

        return [
            ...WORLD_LANGUAGES
        ];

    }


    return WORLD_LANGUAGES.filter(
        language => {

            const countries =
                Array.isArray(
                    language.countries
                )
                    ? language.countries
                        .join(" ")
                        .toLowerCase()
                    : "";


            return (

                language.name
                    .toLowerCase()
                    .includes(term)

                ||

                language.nativeName
                    .toLowerCase()
                    .includes(term)

                ||

                language.code
                    .toLowerCase()
                    .includes(term)

                ||

                language.region
                    .toLowerCase()
                    .includes(term)

                ||

                language.family
                    .toLowerCase()
                    .includes(term)

                ||

                language.script
                    .toLowerCase()
                    .includes(term)

                ||

                countries.includes(term)

            );

        }
    );

}


/* =========================================================
   LANGUAGE LIST RENDERER
========================================================= */

export function renderLanguageList(
    searchTerm = ""
) {

    const container =
        document.getElementById(
            LANGUAGE_CONFIG.listId
        );

    if (!container) {
        return;
    }


    const languages =
        searchLanguages(
            searchTerm
        );


    if (!languages.length) {

        container.innerHTML = `

            <div class="empty-state">

                <strong
                    data-i18n="languageNotFound"
                >
                    ${escapeHTML(
                        translateKey(
                            "languageNotFound"
                        )
                    )}
                </strong>

                <p
                    data-i18n="tryAnotherLanguage"
                >
                    ${escapeHTML(
                        translateKey(
                            "tryAnotherLanguage"
                        )
                    )}
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        languages
            .map(
                language => {

                    const active =
                        language.code ===
                        currentLanguage;


                    return `

                        <button
                            type="button"
                            class="
                                language-item
                                ${active
                                    ? "active"
                                    : ""}
                            "
                            data-language-code="
                                ${escapeHTML(
                                    language.code
                                )}
                            "
                            aria-current="
                                ${active
                                    ? "true"
                                    : "false"}
                            "
                        >

                            <span
                                class="language-native"
                            >
                                ${escapeHTML(
                                    language.nativeName
                                )}
                            </span>

                            <span
                                class="language-name"
                            >
                                ${escapeHTML(
                                    language.name
                                )}
                            </span>

                            <span
                                class="language-code"
                            >
                                ${escapeHTML(
                                    language.code
                                        .toUpperCase()
                                )}
                            </span>

                        </button>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            "[data-language-code]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const code =
                            button.dataset
                                .languageCode;


                        setLanguage(
                            code
                        );


                        closeLanguagePanel();

                    }
                );

            }
        );

}


/* =========================================================
   LANGUAGE SEARCH INPUT
========================================================= */

function setupLanguageSearch() {

    const input =
        document.getElementById(
            LANGUAGE_CONFIG.searchId
        );

    if (!input) {
        return;
    }


    if (
        input.dataset
            .languageSearchReady ===
        "true"
    ) {

        return;

    }


    input.dataset
        .languageSearchReady =
        "true";


    input.addEventListener(
        "input",
        () => {

            renderLanguageList(
                input.value
            );

        }
    );

}


/* =========================================================
   LANGUAGE EVENTS
========================================================= */

function setupLanguageEvents() {

    const openButton =
        document.getElementById(
            LANGUAGE_CONFIG.openButtonId
        );


    const closeButton =
        document.getElementById(
            LANGUAGE_CONFIG.closeButtonId
        );


    openButton?.addEventListener(
        "click",
        openLanguagePanel
    );


    closeButton?.addEventListener(
        "click",
        closeLanguagePanel
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                languagePanelOpen
            ) {

                closeLanguagePanel();

            }

        }
    );


    document.addEventListener(
        "click",
        event => {

            const panel =
                document.getElementById(
                    LANGUAGE_CONFIG.panelId
                );


            if (
                !panel ||
                !languagePanelOpen
            ) {

                return;

            }


            const target =
                event.target;


            if (
                target.closest(
                    `#${LANGUAGE_CONFIG.panelId}`
                )
            ) {

                return;

            }


            if (
                target.closest(
                    `#${LANGUAGE_CONFIG.openButtonId}`
                )
            ) {

                return;

            }


            closeLanguagePanel();

        }
    );

}


/* =========================================================
   DYNAMIC DOM OBSERVER
========================================================= */

function setupDOMObserver() {

    if (
        !LANGUAGE_CONFIG.observeDOM
    ) {

        return;

    }


    if (
        typeof MutationObserver ===
        "undefined"
    ) {

        return;

    }


    if (domObserver) {

        return;

    }


    domObserver =
        new MutationObserver(
            mutations => {

                mutations.forEach(
                    mutation => {

                        mutation
                            .addedNodes
                            .forEach(
                                node => {

                                    if (
                                        node.nodeType !==
                                        Node.ELEMENT_NODE
                                    ) {

                                        return;

                                    }


                                    applyInterfaceLanguage(
                                        node
                                    );

                                }
                            );

                    }
                );

            }
        );


    domObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

}


/* =========================================================
   TRANSLATION PROVIDER HOOK
========================================================= */

let translationProvider =
    null;


export function setTranslationProvider(
    provider
) {

    if (
        provider !== null &&
        typeof provider !== "function"
    ) {

        throw new TypeError(
            "Translation provider must be a function or null."
        );

    }


    translationProvider =
        provider;

}


/* =========================================================
   TRANSLATION ENGINE
========================================================= */

export async function translateText(
    text,
    sourceLanguage = "auto",
    targetLanguage = currentLanguage
) {

    const cleanText =
        String(text ?? "")
            .trim();


    if (!cleanText) {
        return "";
    }


    const source =
        normalizeLanguageCode(
            sourceLanguage
        );


    const target =
        normalizeLanguageCode(
            targetLanguage
        );


    if (
        sourceLanguage !== "auto" &&
        source === target
    ) {

        return cleanText;

    }


    const known =
        translateKnownPhrase(
            cleanText,
            target
        );


    if (known !== null) {

        return known;

    }


    if (
        typeof translationProvider ===
        "function"
    ) {

        try {

            const result =
                await translationProvider(
                    cleanText,
                    sourceLanguage,
                    target
                );


            if (
                typeof result === "string" &&
                result.trim()
            ) {

                return result;

            }

        } catch (error) {

            console.warn(
                "[ALON LANGUAGE] Translation provider failed:",
                error
            );

        }

    }


    /*
       No external provider is connected.
       Return original text safely.
    */

    return cleanText;

}


/* =========================================================
   KNOWN PHRASE TRANSLATION
========================================================= */

function translateKnownPhrase(
    text,
    targetLanguage
) {

    const normalized =
        String(text || "")
            .trim()
            .toLowerCase();


    const dictionary =
        KNOWN_PHRASES[
            targetLanguage
        ];


    if (
        !dictionary
    ) {

        return null;

    }


    if (
        Object.prototype.hasOwnProperty.call(
            dictionary,
            normalized
        )
    ) {

        return dictionary[
            normalized
        ];

    }


    return null;

}


/* =========================================================
   INITIAL LANGUAGE
========================================================= */

function determineInitialLanguage() {

    const saved =
        getStoredLanguage();


    if (
        saved &&
        isLanguageSupported(
            saved
        )
    ) {

        return normalizeLanguageCode(
            saved
        );

    }


    const detected =
        detectBrowserLanguage();


    if (
        detected &&
        isLanguageSupported(
            detected
        )
    ) {

        /*
           Browser language can select a world
           language, but interface translation
           is only available where dictionaries
           exist.
        */

        return detected;

    }


    return LANGUAGE_CONFIG
        .defaultLanguage;

}


/* =========================================================
   PUBLIC INITIALIZER
========================================================= */

export function initLanguageSystem() {

    if (
        languageInitialized
    ) {

        applyInterfaceLanguage();

        setupLanguageSearch();

        return true;

    }


    currentLanguage =
        determineInitialLanguage();


    setupLanguageSearch();

    setupLanguageEvents();

    applyInterfaceLanguage();

    updateLanguageIndicator();

    setupDOMObserver();


    languageInitialized =
        true;


    if (
        typeof document !== "undefined"
    ) {

        document.dispatchEvent(
            new CustomEvent(
                "historyverse:languageinit",
                {
                    detail: {

                        language:
                            currentLanguage,

                        languageInfo:
                            getCurrentLanguageInfo()

                    }
                }
            )
        );

    }


    return true;

}


/* =========================================================
   SAFE HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   LANGUAGE STATISTICS
========================================================= */

export function getLanguageStats() {

    const regions = {};

    WORLD_LANGUAGES.forEach(
        language => {

            const region =
                language.region ||
                "Unknown";


            if (
                !regions[region]
            ) {

                regions[region] = 0;

            }


            regions[region]++;

        }
    );


    return {

        total:
            WORLD_LANGUAGES.length,

        interfaceLanguages:
            LANGUAGE_CONFIG
                .supportedInterfaceLanguages
                .length,

        indiaLanguages:
            INDIA_LANGUAGES.length,

        rtlLanguages:
            LANGUAGE_CONFIG
                .rtlLanguages
                .length,

        regions

    };

}


/* =========================================================
   LANGUAGE RESET
========================================================= */

export function resetLanguage() {

    currentLanguage =
        LANGUAGE_CONFIG.defaultLanguage;


    saveLanguage(
        currentLanguage
    );


    applyInterfaceLanguage();


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:languagechange",
            {
                detail: {

                    language:
                        currentLanguage,

                    reset:
                        true

                }
            }
        )
    );


    return true;

}


/* =========================================================
   GLOBAL LANGUAGE API
========================================================= */

window.ALON_LANGUAGE_ENGINE = {

    version:
        LANGUAGE_CONFIG.version,

    config:
        LANGUAGE_CONFIG,

    getLanguages,

    getIndiaLanguages,

    getInterfaceLanguages,

    getLanguage,

    getCurrentLanguage,

    getCurrentLanguageInfo,

    getLanguageStats,

    isLanguageSupported,

    isInterfaceLanguage,

    setLanguage,

    resetLanguage,

    translateKey,

    translateText,

    applyInterfaceLanguage,

    updateLanguageIndicator,

    openLanguagePanel,

    closeLanguagePanel,

    toggleLanguagePanel,

    renderLanguageList,

    search:
        searchLanguages,

    setTranslationProvider,

    init:
        initLanguageSystem

};


/* =========================================================
   AUTO START
========================================================= */

function autoInitialize() {

    if (
        typeof document ===
        "undefined"
    ) {

        return;

    }


    initLanguageSystem();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        autoInitialize,
        {
            once: true
        }
    );

} else {

    autoInitialize();

}


/* =========================================================
   END OF ALON LANGUAGE ENGINE
========================================================= */