/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/world-language.js

   WORLD LANGUAGE ENGINE
   LANGUAGE UI
   MOBILE MENU COMPATIBILITY

   Creator / Owner:
   Baba Thecno Guru

   Version:
   ALON-WORLD-LANGUAGE-100-FIXED
========================================================= */


/* =========================================================
   01. ENGINE CONFIG
========================================================= */

const WORLD_LANGUAGE_CONFIG = {

    version:
        "ALON-WORLD-LANGUAGE-100-FIXED",

    defaultLanguage:
        "en",

    storageKey:
        "alon_historyverse_language",

    translationStorageKey:
        "alon_historyverse_translations"

};


/* =========================================================
   02. WORLD LANGUAGE REGISTRY
========================================================= */

const WORLD_LANGUAGES = [

    {
        code: "en",
        name: "English",
        nativeName: "English",
        region: "World",
        rtl: false
    },

    {
        code: "hi",
        name: "Hindi",
        nativeName: "हिन्दी",
        region: "India",
        rtl: false
    },

    {
        code: "bn",
        name: "Bengali",
        nativeName: "বাংলা",
        region: "South Asia",
        rtl: false
    },

    {
        code: "te",
        name: "Telugu",
        nativeName: "తెలుగు",
        region: "India",
        rtl: false
    },

    {
        code: "mr",
        name: "Marathi",
        nativeName: "मराठी",
        region: "India",
        rtl: false
    },

    {
        code: "ta",
        name: "Tamil",
        nativeName: "தமிழ்",
        region: "India",
        rtl: false
    },

    {
        code: "ur",
        name: "Urdu",
        nativeName: "اردو",
        region: "South Asia",
        rtl: true
    },

    {
        code: "gu",
        name: "Gujarati",
        nativeName: "ગુજરાતી",
        region: "India",
        rtl: false
    },

    {
        code: "kn",
        name: "Kannada",
        nativeName: "ಕನ್ನಡ",
        region: "India",
        rtl: false
    },

    {
        code: "ml",
        name: "Malayalam",
        nativeName: "മലയാളം",
        region: "India",
        rtl: false
    },

    {
        code: "pa",
        name: "Punjabi",
        nativeName: "ਪੰਜਾਬੀ",
        region: "South Asia",
        rtl: false
    },

    {
        code: "ar",
        name: "Arabic",
        nativeName: "العربية",
        region: "Middle East",
        rtl: true
    },

    {
        code: "fr",
        name: "French",
        nativeName: "Français",
        region: "Europe",
        rtl: false
    },

    {
        code: "de",
        name: "German",
        nativeName: "Deutsch",
        region: "Europe",
        rtl: false
    },

    {
        code: "es",
        name: "Spanish",
        nativeName: "Español",
        region: "Europe / Americas",
        rtl: false
    },

    {
        code: "ja",
        name: "Japanese",
        nativeName: "日本語",
        region: "East Asia",
        rtl: false
    },

    {
        code: "zh",
        name: "Chinese",
        nativeName: "中文",
        region: "East Asia",
        rtl: false
    },

    {
        code: "la",
        name: "Latin",
        nativeName: "Latina",
        region: "Historical",
        rtl: false
    }

];


/* =========================================================
   03. SAFE STORAGE HELPERS
========================================================= */

function ahLanguageStorageGet(key) {

    try {

        return localStorage.getItem(key);

    } catch (error) {

        console.warn(
            "ALON HISTORYVERSE: localStorage read failed.",
            error
        );

        return null;
    }

}


function ahLanguageStorageSet(key, value) {

    try {

        localStorage.setItem(
            key,
            value
        );

        return true;

    } catch (error) {

        console.warn(
            "ALON HISTORYVERSE: localStorage write failed.",
            error
        );

        return false;
    }

}


/* =========================================================
   04. LANGUAGE LOOKUP
========================================================= */

function getWorldLanguage(code) {

    return WORLD_LANGUAGES.find(
        language =>
            language.code === code
    ) || null;

}


/* =========================================================
   05. GET CURRENT LANGUAGE
========================================================= */

function getCurrentWorldLanguage() {

    const savedLanguage =
        ahLanguageStorageGet(
            WORLD_LANGUAGE_CONFIG.storageKey
        );

    return getWorldLanguage(
        savedLanguage ||
        WORLD_LANGUAGE_CONFIG.defaultLanguage
    ) || getWorldLanguage("en");

}


/* =========================================================
   06. APPLY LANGUAGE
========================================================= */

function applyWorldLanguage(code) {

    const language =
        getWorldLanguage(code);

    if (!language) {

        console.warn(
            "ALON HISTORYVERSE: Unknown language:",
            code
        );

        return false;
    }


    /*
       Save selected language
    */

    ahLanguageStorageSet(
        WORLD_LANGUAGE_CONFIG.storageKey,
        language.code
    );


    /*
       Update HTML language
    */

    document.documentElement.lang =
        language.code;


    /*
       Update text direction
    */

    document.documentElement.dir =
        language.rtl
            ? "rtl"
            : "ltr";


    /*
       Store global state
    */

    window.ALON_LANGUAGE =
        language.code;


    window.ALON_LANGUAGE_DATA =
        language;


    /*
       Update language buttons
       if they exist.
    */

    document
        .querySelectorAll(
            "[data-language]"
        )
        .forEach(button => {

            const active =
                button.getAttribute(
                    "data-language"
                ) === language.code;

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-selected",
                active
                    ? "true"
                    : "false"
            );

        });


    /*
       Notify other ALON systems
    */

    document.dispatchEvent(
        new CustomEvent(
            "alon:languagechange",
            {
                detail: {
                    code: language.code,
                    language: language
                }
            }
        )
    );


    return true;

}


/* =========================================================
   07. LANGUAGE PANEL
========================================================= */

function initWorldLanguagePanel() {

    const toggle =
        document.querySelector(
            "[data-language-toggle]"
        );

    const panel =
        document.querySelector(
            "[data-language-panel]"
        );

    const close =
        document.querySelector(
            "[data-language-close]"
        );

    const options =
        document.querySelectorAll(
            "[data-language]"
        );


    if (!panel) {

        return;
    }


    /*
       Open
    */

    if (toggle) {

        toggle.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                const isHidden =
                    panel.hasAttribute(
                        "hidden"
                    );

                if (isHidden) {

                    panel.removeAttribute(
                        "hidden"
                    );

                    document.body.classList.add(
                        "language-open"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                } else {

                    closeWorldLanguagePanel();

                }

            }
        );

    }


    /*
       Close
    */

    if (close) {

        close.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closeWorldLanguagePanel();

            }
        );

    }


    /*
       Language selection
    */

    options.forEach(
        option => {

            option.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    const code =
                        option.getAttribute(
                            "data-language"
                        );

                    if (!code) {

                        return;
                    }


                    const changed =
                        applyWorldLanguage(
                            code
                        );


                    if (changed) {

                        closeWorldLanguagePanel();


                        showLanguageNotification(
                            getWorldLanguage(code)
                        );

                    }

                }
            );

        }
    );

}


/* =========================================================
   08. CLOSE LANGUAGE PANEL
========================================================= */

function closeWorldLanguagePanel() {

    const panel =
        document.querySelector(
            "[data-language-panel]"
        );

    const toggle =
        document.querySelector(
            "[data-language-toggle]"
        );


    if (panel) {

        panel.setAttribute(
            "hidden",
            ""
        );

    }


    if (toggle) {

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    document.body.classList.remove(
        "language-open"
    );

}


/* =========================================================
   09. LANGUAGE NOTIFICATION
========================================================= */

function showLanguageNotification(
    language
) {

    if (!language) {

        return;
    }


    const notificationContainer =
        document.querySelector(
            "[data-notifications]"
        );


    /*
       If notification system exists,
       use it.
    */

    if (notificationContainer) {

        const notification =
            document.createElement(
                "div"
            );

        notification.className =
            "notification language-notification";


        notification.textContent =
            `Language: ${language.nativeName}`;


        notificationContainer.appendChild(
            notification
        );


        window.setTimeout(
            () => {

                notification.remove();

            },
            2200
        );


        return;
    }


    /*
       No alert().
       Silent fallback.
    */

    console.info(
        "ALON HISTORYVERSE language:",
        language.nativeName
    );

}


/* =========================================================
   10. MOBILE MENU COMPATIBILITY
========================================================= */

function initWorldMobileMenu() {

    const toggle =
        document.querySelector(
            "[data-menu-toggle]"
        );

    const menu =
        document.querySelector(
            "[data-mobile-menu]"
        );

    const close =
        document.querySelector(
            "[data-menu-close]"
        );

    const links =
        document.querySelectorAll(
            "[data-menu-link]"
        );


    if (!toggle || !menu) {

        return;
    }


    /*
       Open / Close
    */

    toggle.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const isOpen =
                toggle.getAttribute(
                    "aria-expanded"
                ) === "true";


            if (isOpen) {

                closeWorldMobileMenu();

            } else {

                openWorldMobileMenu();

            }

        }
    );


    /*
       Close button
    */

    if (close) {

        close.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                closeWorldMobileMenu();

            }
        );

    }


    /*
       Menu links
    */

    links.forEach(
        link => {

            link.addEventListener(
                "click",
                function() {

                    closeWorldMobileMenu();

                }
            );

        }
    );

}


/* =========================================================
   11. OPEN MOBILE MENU
========================================================= */

function openWorldMobileMenu() {

    const toggle =
        document.querySelector(
            "[data-menu-toggle]"
        );

    const menu =
        document.querySelector(
            "[data-mobile-menu]"
        );


    if (!toggle || !menu) {

        return;
    }


    menu.removeAttribute(
        "hidden"
    );


    toggle.setAttribute(
        "aria-expanded",
        "true"
    );


    toggle.setAttribute(
        "aria-label",
        "Close menu"
    );


    document.body.classList.add(
        "menu-open"
    );


    document.dispatchEvent(
        new CustomEvent(
            "alon:menuopen"
        )
    );

}


/* =========================================================
   12. CLOSE MOBILE MENU
========================================================= */

function closeWorldMobileMenu() {

    const toggle =
        document.querySelector(
            "[data-menu-toggle]"
        );

    const menu =
        document.querySelector(
            "[data-mobile-menu]"
        );


    if (menu) {

        menu.setAttribute(
            "hidden",
            ""
        );

    }


    if (toggle) {

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );


        toggle.setAttribute(
            "aria-label",
            "Open menu"
        );

    }


    document.body.classList.remove(
        "menu-open"
    );


    document.dispatchEvent(
        new CustomEvent(
            "alon:menuclose"
        )
    );

}


/* =========================================================
   13. ESC KEY CONTROL
========================================================= */

function initWorldEscapeControl() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key !== "Escape"
            ) {

                return;
            }


            closeWorldMobileMenu();

            closeWorldLanguagePanel();

        }
    );

}


/* =========================================================
   14. CLICK OUTSIDE LANGUAGE PANEL
========================================================= */

function initLanguageOutsideClick() {

    document.addEventListener(
        "click",
        function(event) {

            const panel =
                document.querySelector(
                    "[data-language-panel]"
                );

            const toggle =
                document.querySelector(
                    "[data-language-toggle]"
                );


            if (!panel) {

                return;
            }


            if (
                panel.hasAttribute("hidden")
            ) {

                return;
            }


            if (
                panel.contains(event.target)
                ||
                (
                    toggle &&
                    toggle.contains(event.target)
                )
            ) {

                return;
            }


            closeWorldLanguagePanel();

        }
    );

}


/* =========================================================
   15. RESTORE SAVED LANGUAGE
========================================================= */

function restoreSavedWorldLanguage() {

    const savedLanguage =
        ahLanguageStorageGet(
            WORLD_LANGUAGE_CONFIG.storageKey
        );


    const code =
        getWorldLanguage(
            savedLanguage
        )
            ? savedLanguage
            : WORLD_LANGUAGE_CONFIG.defaultLanguage;


    applyWorldLanguage(
        code
    );

}


/* =========================================================
   16. GLOBAL API
========================================================= */

window.ALONWorldLanguage = {

    config:
        WORLD_LANGUAGE_CONFIG,

    languages:
        WORLD_LANGUAGES,

    get:
        getWorldLanguage,

    current:
        getCurrentWorldLanguage,

    apply:
        applyWorldLanguage,

    openMenu:
        openWorldMobileMenu,

    closeMenu:
        closeWorldMobileMenu,

    closeLanguage:
        closeWorldLanguagePanel

};


/* =========================================================
   17. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           Restore language first
        */

        restoreSavedWorldLanguage();


        /*
           Initialize language UI
        */

        initWorldLanguagePanel();


        /*
           Initialize mobile menu
        */

        initWorldMobileMenu();


        /*
           ESC controls
        */

        initWorldEscapeControl();


        /*
           Outside click
        */

        initLanguageOutsideClick();


        /*
           Ready event
        */

        document.dispatchEvent(
            new CustomEvent(
                "alon:language-ready"
            )
        );

    }
);


/* =========================================================
   END OF WORLD LANGUAGE ENGINE
========================================================= */