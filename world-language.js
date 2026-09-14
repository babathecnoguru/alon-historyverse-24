/* =========================================================
   ALON HISTORYVERSE 24
   WORLD LANGUAGE ENGINE
   Version: 24.0
   Creator: Baba Thecno Guru

   Purpose:
   - World language configuration
   - Language selector
   - Language persistence
   - RTL language support
   - HTML lang / dir update
   - Language change events

   IMPORTANT:
   This file provides language selection and UI language
   infrastructure. It does NOT perform automatic translation
   of all website content by itself.

   Storage:
   alon_historyverse_language
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0",

        storageKey:
            "alon_historyverse_language",

        defaultLanguage:
            "en",

        selectorId:
            "alonWorldLanguageModal",

        buttonId:
            "worldLanguageButton"
    };


    /* =====================================================
       WORLD LANGUAGES
    ====================================================== */

    const WORLD_LANGUAGE_CONFIG = {

        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            region: "World",
            direction: "ltr"
        },

        hi: {
            code: "hi",
            name: "Hindi",
            nativeName: "हिन्दी",
            region: "India",
            direction: "ltr"
        },

        bn: {
            code: "bn",
            name: "Bengali",
            nativeName: "বাংলা",
            region: "India / Bangladesh",
            direction: "ltr"
        },

        gu: {
            code: "gu",
            name: "Gujarati",
            nativeName: "ગુજરાતી",
            region: "India",
            direction: "ltr"
        },

        mr: {
            code: "mr",
            name: "Marathi",
            nativeName: "मराठी",
            region: "India",
            direction: "ltr"
        },

        ta: {
            code: "ta",
            name: "Tamil",
            nativeName: "தமிழ்",
            region: "India / Sri Lanka",
            direction: "ltr"
        },

        te: {
            code: "te",
            name: "Telugu",
            nativeName: "తెలుగు",
            region: "India",
            direction: "ltr"
        },

        kn: {
            code: "kn",
            name: "Kannada",
            nativeName: "ಕನ್ನಡ",
            region: "India",
            direction: "ltr"
        },

        ml: {
            code: "ml",
            name: "Malayalam",
            nativeName: "മലയാളം",
            region: "India",
            direction: "ltr"
        },

        pa: {
            code: "pa",
            name: "Punjabi",
            nativeName: "ਪੰਜਾਬੀ",
            region: "India / Pakistan",
            direction: "ltr"
        },

        ur: {
            code: "ur",
            name: "Urdu",
            nativeName: "اردو",
            region: "South Asia",
            direction: "rtl"
        },

        ne: {
            code: "ne",
            name: "Nepali",
            nativeName: "नेपाली",
            region: "Nepal",
            direction: "ltr"
        },

        sa: {
            code: "sa",
            name: "Sanskrit",
            nativeName: "संस्कृतम्",
            region: "India",
            direction: "ltr"
        },

        es: {
            code: "es",
            name: "Spanish",
            nativeName: "Español",
            region: "Europe / Americas",
            direction: "ltr"
        },

        fr: {
            code: "fr",
            name: "French",
            nativeName: "Français",
            region: "Europe / Africa",
            direction: "ltr"
        },

        de: {
            code: "de",
            name: "German",
            nativeName: "Deutsch",
            region: "Europe",
            direction: "ltr"
        },

        it: {
            code: "it",
            name: "Italian",
            nativeName: "Italiano",
            region: "Europe",
            direction: "ltr"
        },

        pt: {
            code: "pt",
            name: "Portuguese",
            nativeName: "Português",
            region: "Europe / Americas",
            direction: "ltr"
        },

        ru: {
            code: "ru",
            name: "Russian",
            nativeName: "Русский",
            region: "Europe / Asia",
            direction: "ltr"
        },

        uk: {
            code: "uk",
            name: "Ukrainian",
            nativeName: "Українська",
            region: "Europe",
            direction: "ltr"
        },

        ar: {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            region: "Middle East / Africa",
            direction: "rtl"
        },

        fa: {
            code: "fa",
            name: "Persian",
            nativeName: "فارسی",
            region: "Iran / Central Asia",
            direction: "rtl"
        },

        tr: {
            code: "tr",
            name: "Turkish",
            nativeName: "Türkçe",
            region: "Europe / Asia",
            direction: "ltr"
        },

        zh: {
            code: "zh",
            name: "Chinese",
            nativeName: "中文",
            region: "China",
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
            region: "South Korea / North Korea",
            direction: "ltr"
        },

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
        }
    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {
        initialized: false,
        currentLanguage:
            CONFIG.defaultLanguage,
        modalOpen: false
    };


    /* =====================================================
       HELPERS
    ====================================================== */

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }


    function $$(selector, root) {
        return Array.from(
            (root || document).querySelectorAll(selector)
        );
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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

        const language =
            getLanguage(code);

        return language.direction === "rtl";
    }


    /* =====================================================
       APPLY LANGUAGE
    ====================================================== */

    function applyLanguage(code) {

        if (
            !WORLD_LANGUAGE_CONFIG[code]
        ) {
            code =
                CONFIG.defaultLanguage;
        }


        const language =
            getLanguage(code);

        STATE.currentLanguage =
            code;


        /*
         * Update HTML language.
         */

        document.documentElement.lang =
            language.code;


        /*
         * Update writing direction.
         */

        document.documentElement.dir =
            language.direction;


        /*
         * Helpful CSS class.
         */

        document.documentElement.classList
            .toggle(
                "alon-rtl",
                language.direction === "rtl"
            );


        /*
         * Store preference.
         */

        saveLanguage(code);


        /*
         * Update language buttons.
         */

        updateLanguageButtons(
            language
        );


        /*
         * Notify the rest of the website.
         */

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
                                language.direction
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
       MODAL STYLE
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
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 18px;
                background: rgba(0, 0, 0, .78);
                backdrop-filter: blur(8px);
            }

            .alon-world-language-overlay.open {
                display: flex;
            }

            .alon-world-language-modal {
                width: min(720px, 100%);
                max-height: 88vh;
                overflow: hidden;
                background: #05080f;
                border: 1px solid #d7b35a;
                border-radius: 18px;
                box-shadow:
                    0 20px 70px rgba(0,0,0,.65);
                color: #f0d27a;
            }

            .alon-world-language-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 18px 20px;
                border-bottom: 1px solid rgba(215,179,90,.35);
            }

            .alon-world-language-header h2 {
                margin: 0;
                font-size: 1.2rem;
            }

            .alon-world-language-close {
                width: 42px;
                height: 42px;
                border: 1px solid #d7b35a;
                border-radius: 10px;
                background: transparent;
                color: #f0d27a;
                cursor: pointer;
                font-size: 1.2rem;
            }

            .alon-world-language-list {
                display: grid;
                grid-template-columns:
                    repeat(auto-fit, minmax(180px, 1fr));
                gap: 10px;
                padding: 18px;
                max-height: 68vh;
                overflow-y: auto;
            }

            .alon-world-language-item {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 3px;
                min-height: 72px;
                padding: 12px;
                border: 1px solid rgba(215,179,90,.3);
                border-radius: 12px;
                background: rgba(255,255,255,.025);
                color: #f0d27a;
                cursor: pointer;
                text-align: left;
                transition: .2s ease;
            }

            .alon-world-language-item:hover,
            .alon-world-language-item.active {
                border-color: #f0d27a;
                background: rgba(215,179,90,.10);
                transform: translateY(-1px);
            }

            .alon-world-language-native {
                font-size: 1rem;
                font-weight: 700;
            }

            .alon-world-language-name {
                font-size: .82rem;
                opacity: .78;
            }

            .alon-world-language-region {
                font-size: .72rem;
                opacity: .55;
            }

            @media (max-width: 600px) {
                .alon-world-language-list {
                    grid-template-columns: 1fr 1fr;
                }
            }

            @media (max-width: 390px) {
                .alon-world-language-list {
                    grid-template-columns: 1fr;
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
            <div class="alon-world-language-header">

                <h2>
                    🌐 World Language
                </h2>

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
    }


    /* =====================================================
       RENDER LANGUAGE LIST
    ====================================================== */

    function renderLanguageList() {

        const list =
            document.querySelector(
                "[data-language-list]"
            );

        if (!list) {
            return;
        }


        list.innerHTML =
            getLanguages()
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
       OPEN / CLOSE SELECTOR
    ====================================================== */

    function openSelector() {

        createModal();

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
    }


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
            !WORLD_LANGUAGE_CONFIG[code]
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
       BIND LANGUAGE BUTTONS
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
       KEYBOARD SUPPORT
    ====================================================== */

    function bindKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Escape" &&
                    STATE.modalOpen
                ) {

                    closeSelector();
                }
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
                                )
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

        isRTL,

        getCode:
            function () {
                return STATE.currentLanguage;
            }
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

    /*
     * Compatibility with existing
     * language button integrations.
     */

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