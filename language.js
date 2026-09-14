/* =========================================================
   ALON HISTORYVERSE 24
   LANGUAGE ENGINE
   File: jss/language.js
   Creator: Baba Thecno Guru
   Version: 24.0
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0",

        storageKey: "alon_historyverse_language",

        defaultLanguage: "en",

        selectorId: "alonLanguageSelector",
        overlayId: "alonLanguageOverlay",

        buttonSelectors: [
            "#languageBtn",
            "[data-language-button]",
            "[data-open-language]"
        ]
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
       STATE
    ===================================================== */

    let currentLanguage = CONFIG.defaultLanguage;


    /* =====================================================
       STORAGE
    ===================================================== */

    function getSavedLanguage() {

        try {

            const saved = localStorage.getItem(
                CONFIG.storageKey
            );

            if (
                saved &&
                WORLD_LANGUAGE_CONFIG[saved]
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

        return (
            WORLD_LANGUAGE_CONFIG[languageCode] ||
            WORLD_LANGUAGE_CONFIG[CONFIG.defaultLanguage]
        );
    }


    /* =====================================================
       DIRECTION
    ===================================================== */

    function updateDirection(code) {

        const rtlLanguages = [
            "ar",
            "fa",
            "ur"
        ];

        const direction =
            rtlLanguages.includes(code)
                ? "rtl"
                : "ltr";

        document.documentElement.dir =
            direction;

        document.documentElement.lang =
            code;
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
    }


    /* =====================================================
       LANGUAGE BUTTON
    ===================================================== */

    function updateLanguageButtons() {

        const info =
            getLanguageInfo(currentLanguage);

        CONFIG.buttonSelectors.forEach(
            function (selector) {

                document
                    .querySelectorAll(selector)
                    .forEach(function (button) {

                        button.setAttribute(
                            "aria-label",
                            "Language: " +
                            info.nativeName
                        );

                        button.setAttribute(
                            "title",
                            "Language: " +
                            info.nativeName
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

            .alon-language-native {
                font-weight: 700;
            }

            .alon-language-english {
                color: #999;
                font-size: 12px;
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

        Object.keys(
            WORLD_LANGUAGE_CONFIG
        ).forEach(function (code) {

            const language =
                WORLD_LANGUAGE_CONFIG[code];

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

            button.innerHTML = `

                <span class="alon-language-flag">
                    ${language.flag}
                </span>

                <span class="alon-language-name">

                    <span class="alon-language-native">
                        ${escapeHTML(
                            language.nativeName
                        )}
                    </span>

                    <span class="alon-language-english">
                        ${escapeHTML(
                            language.name
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

        if (
            !WORLD_LANGUAGE_CONFIG[code]
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

        updateLanguageAttribute(code);

        updateDirection(code);

        updateLanguageButtons();

        dispatchLanguageEvent(code);

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
       INITIALIZE
    ===================================================== */

    function initialize() {

        currentLanguage =
            getSavedLanguage();

        updateLanguageAttribute(
            currentLanguage
        );

        updateDirection(
            currentLanguage
        );

        updateLanguageButtons();

        bindLanguageButtons();

        bindKeyboard();

        /*
         * Create selector only when needed.
         * This keeps the page lightweight.
         */

        console.log(
            "ALON HISTORYVERSE 24 Language Engine ready:",
            currentLanguage
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.WORLD_LANGUAGE_CONFIG =
        WORLD_LANGUAGE_CONFIG;

    window.ALON_LANGUAGE = {

        config: CONFIG,

        languages:
            WORLD_LANGUAGE_CONFIG,

        initialize:
            initialize,

        getLanguage:
            getLanguage,

        getLanguageInfo:
            getLanguageInfo,

        setLanguage:
            setLanguage,

        open:
            openSelector,

        close:
            closeSelector,

        render:
            renderLanguageList
    };


    /*
     * Compatibility function.
     * Other project files can call:
     *
     * window.openLanguageSelector()
     */

    window.openLanguageSelector =
        openSelector;


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