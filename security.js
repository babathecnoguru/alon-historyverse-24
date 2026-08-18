/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/security.js

   SECURITY ENGINE
   CONTENT VALIDATION
   XSS SANITIZATION
   ADMIN SESSION CONTROL

   Creator / Owner:
   Baba Thecno Guru

   Version:
   ALON-SECURITY-100-FIXED
========================================================= */


/* =========================================================
   01. SECURITY CONFIG
========================================================= */

const AH_SECURITY_CONFIG = {

    version:
        "ALON-SECURITY-100-FIXED",

    /*
       IMPORTANT:
       Client-side PIN is NOT real security.
       For a real production admin system,
       authentication must be moved to a server/Firebase
       authentication system.

       This PIN is only a local UI protection layer.
    */

    adminPin:
        "2424",

    maxTitleLength:
        100,

    maxContentLength:
        5000,

    /*
       Keep this list conservative.
       Exact words are checked instead of blindly
       blocking parts of legitimate words.
    */

    bannedWords: [
        "spam",
        "hack",
        "casino",
        "free-money",
        "crypto"
    ],

    adminSessionKey:
        "ah_admin_authenticated",

    adminSessionTimeKey:
        "ah_admin_authenticated_at",

    adminSessionDuration:
        30 * 60 * 1000

};


/* =========================================================
   02. SAFE STRING CONVERTER
========================================================= */

function ahSecurityString(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value);

}


/* =========================================================
   03. HTML SANITIZER
========================================================= */

function ahSanitizeHTML(text) {

    const value =
        ahSecurityString(text);


    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   04. SAFE TEXT NORMALIZATION
========================================================= */

function ahNormalizeText(text) {

    return ahSecurityString(text)
        .normalize("NFKC")
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   05. BANNED WORD CHECK
========================================================= */

function ahContainsBannedWord(text) {

    const normalized =
        ahNormalizeText(text)
            .toLowerCase();


    for (
        const word
        of AH_SECURITY_CONFIG.bannedWords
    ) {

        const cleanWord =
            ahNormalizeText(word)
                .toLowerCase();


        if (!cleanWord) {
            continue;
        }


        /*
           Escape regex characters.
        */

        const escaped =
            cleanWord.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        /*
           Word-boundary style check.

           Hyphenated terms such as
           free-money are still detected.
        */

        const pattern =
            new RegExp(
                `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
                "i"
            );


        if (
            pattern.test(normalized)
        ) {

            return {
                blocked: true,
                word: word
            };

        }

    }


    return {
        blocked: false,
        word: null
    };

}


/* =========================================================
   06. CONTENT VALIDATION
========================================================= */

function ahValidateContent(
    title,
    content
) {

    const cleanTitle =
        ahNormalizeText(title);

    const cleanContent =
        ahNormalizeText(content);


    /*
       Required title
    */

    if (!cleanTitle) {

        return {
            valid: false,
            reason: "Article title is required."
        };

    }


    /*
       Required content
    */

    if (!cleanContent) {

        return {
            valid: false,
            reason: "Article content is required."
        };

    }


    /*
       Title length
    */

    if (
        cleanTitle.length >
        AH_SECURITY_CONFIG.maxTitleLength
    ) {

        return {
            valid: false,
            reason:
                `Title cannot exceed ${AH_SECURITY_CONFIG.maxTitleLength} characters.`
        };

    }


    /*
       Content length
    */

    if (
        cleanContent.length >
        AH_SECURITY_CONFIG.maxContentLength
    ) {

        return {
            valid: false,
            reason:
                `Content cannot exceed ${AH_SECURITY_CONFIG.maxContentLength} characters.`
        };

    }


    /*
       Banned words
    */

    const bannedResult =
        ahContainsBannedWord(
            `${cleanTitle} ${cleanContent}`
        );


    if (
        bannedResult.blocked
    ) {

        return {
            valid: false,
            reason:
                "Article contains a restricted or spam-related term.",
            blockedWord:
                bannedResult.word
        };

    }


    /*
       Everything passed
    */

    return {

        valid: true,

        title:
            cleanTitle,

        content:
            cleanContent

    };

}


/* =========================================================
   07. NOTIFICATION HELPER
========================================================= */

function ahSecurityNotify(
    message,
    type = "error"
) {

    const container =
        document.querySelector(
            "[data-notifications]"
        );


    /*
       Use site's notification system
       if available.
    */

    if (container) {

        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            `notification security-notification ${type}`;


        notification.setAttribute(
            "role",
            "alert"
        );


        notification.textContent =
            message;


        container.appendChild(
            notification
        );


        window.setTimeout(
            () => {

                notification.remove();

            },
            3000
        );


        return;

    }


    /*
       Fallback
    */

    console.warn(
        "ALON SECURITY:",
        message
    );

}


/* =========================================================
   08. SAFE SESSION STORAGE
========================================================= */

function ahSessionGet(key) {

    try {

        return sessionStorage.getItem(
            key
        );

    } catch (error) {

        console.warn(
            "ALON SECURITY: sessionStorage read failed.",
            error
        );

        return null;

    }

}


function ahSessionSet(
    key,
    value
) {

    try {

        sessionStorage.setItem(
            key,
            value
        );

        return true;

    } catch (error) {

        console.warn(
            "ALON SECURITY: sessionStorage write failed.",
            error
        );

        return false;

    }

}


function ahSessionRemove(key) {

    try {

        sessionStorage.removeItem(
            key
        );

    } catch (error) {

        console.warn(
            "ALON SECURITY: sessionStorage remove failed.",
            error
        );

    }

}


/* =========================================================
   09. CHECK ADMIN SESSION
========================================================= */

function ahIsAdminAuthenticated() {

    const authenticated =
        ahSessionGet(
            AH_SECURITY_CONFIG.adminSessionKey
        );


    if (
        authenticated !== "true"
    ) {

        return false;

    }


    const loginTime =
        Number(
            ahSessionGet(
                AH_SECURITY_CONFIG.adminSessionTimeKey
            )
        );


    /*
       Invalid timestamp
    */

    if (
        !loginTime ||
        Number.isNaN(loginTime)
    ) {

        ahClearAdminSession();

        return false;

    }


    /*
       Session expired
    */

    const expired =
        Date.now() -
        loginTime >
        AH_SECURITY_CONFIG.adminSessionDuration;


    if (expired) {

        ahClearAdminSession();

        return false;

    }


    return true;

}


/* =========================================================
   10. CREATE ADMIN SESSION
========================================================= */

function ahCreateAdminSession() {

    ahSessionSet(
        AH_SECURITY_CONFIG.adminSessionKey,
        "true"
    );


    ahSessionSet(
        AH_SECURITY_CONFIG.adminSessionTimeKey,
        String(Date.now())
    );

}


/* =========================================================
   11. CLEAR ADMIN SESSION
========================================================= */

function ahClearAdminSession() {

    ahSessionRemove(
        AH_SECURITY_CONFIG.adminSessionKey
    );


    ahSessionRemove(
        AH_SECURITY_CONFIG.adminSessionTimeKey
    );

}


/* =========================================================
   12. VERIFY ADMIN
========================================================= */

function ahVerifyAdmin() {

    /*
       Existing valid session
    */

    if (
        ahIsAdminAuthenticated()
    ) {

        return true;

    }


    /*
       Local UI authentication only.
    */

    let userPin = null;


    try {

        userPin =
            window.prompt(
                "🔒 Security Access Required\n\nEnter Admin PIN:"
            );

    } catch (error) {

        ahSecurityNotify(
            "Security verification could not be opened."
        );

        return false;

    }


    /*
       User cancelled
    */

    if (
        userPin === null
    ) {

        return false;

    }


    /*
       Normalize PIN
    */

    userPin =
        String(userPin).trim();


    /*
       Validate
    */

    if (
        userPin !==
        AH_SECURITY_CONFIG.adminPin
    ) {

        ahSecurityNotify(
            "Invalid Admin PIN. Action denied."
        );

        return false;

    }


    /*
       Create session
    */

    ahCreateAdminSession();


    ahSecurityNotify(
        "Admin verification successful.",
        "success"
    );


    return true;

}


/* =========================================================
   13. LOGOUT ADMIN
========================================================= */

function ahAdminLogout() {

    ahClearAdminSession();


    ahSecurityNotify(
        "Admin session closed.",
        "success"
    );

}


/* =========================================================
   14. SAFE ARTICLE OBJECT
========================================================= */

function ahSanitizeArticle(article) {

    if (
        !article ||
        typeof article !== "object"
    ) {

        return null;

    }


    return {

        id:
            ahSecurityString(
                article.id
            ),

        title:
            ahSanitizeHTML(
                article.title
            ),

        content:
            ahSanitizeHTML(
                article.content
            ),

        date:
            ahSanitizeHTML(
                article.date
            )

    };

}


/* =========================================================
   15. SAFE JSON PARSER
========================================================= */

function ahSafeJSONParse(
    value,
    fallback = []
) {

    if (!value) {

        return fallback;

    }


    try {

        const parsed =
            JSON.parse(value);


        return parsed;

    } catch (error) {

        console.warn(
            "ALON SECURITY: Invalid JSON storage data.",
            error
        );


        return fallback;

    }

}


/* =========================================================
   16. GLOBAL SECURITY API
========================================================= */

const HistoryVerseSecurity = {

    config:
        AH_SECURITY_CONFIG,

    sanitizeHTML:
        ahSanitizeHTML,

    normalizeText:
        ahNormalizeText,

    validateContent:
        function(title, content) {

            const result =
                ahValidateContent(
                    title,
                    content
                );


            /*
               Backward-compatible boolean
               result for master.js.
            */

            if (!result.valid) {

                ahSecurityNotify(
                    result.reason
                );

                return false;

            }


            return true;

        },

    validateContentDetailed:
        ahValidateContent,

    containsBannedWord:
        ahContainsBannedWord,

    verifyAdmin:
        ahVerifyAdmin,

    isAdminAuthenticated:
        ahIsAdminAuthenticated,

    logoutAdmin:
        ahAdminLogout,

    sanitizeArticle:
        ahSanitizeArticle,

    safeJSONParse:
        ahSafeJSONParse

};


/* =========================================================
   17. GLOBAL COMPATIBILITY
========================================================= */

window.HVSecurity =
    HistoryVerseSecurity;


/*
   New ALON API
*/

window.ALONSecurity =
    HistoryVerseSecurity;


/* =========================================================
   18. SECURITY READY EVENT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        document.dispatchEvent(
            new CustomEvent(
                "alon:security-ready"
            )
        );

    }
);


/* =========================================================
   END OF SECURITY ENGINE
========================================================= */