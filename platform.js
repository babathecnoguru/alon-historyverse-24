/* =========================================================
   ALON HISTORYVERSE 24
   VERSION: V100
   FILE: jss/platform.js

   MASTER PLATFORM ENGINE
   ---------------------------------------------------------
   Includes:
   - User system
   - Login / Logout bridge
   - Contributor system
   - Submit system
   - Content validation
   - Copyright / permission checks
   - Contributor agreement
   - Duplicate detection
   - Moderation queue
   - Notifications
   - User preferences
   - Accessibility helpers
   - Security helpers
   - Local storage
   - Safe navigation
========================================================= */


/* =========================================================
   01. PLATFORM STATE
========================================================= */

const PlatformEngine = {

    version: "V100",

    initialized: false,

    user: null,

    authenticated: false,

    submissions: [],

    notifications: [],

    moderationQueue: [],

    preferences: {},

    security: {

        sessionStarted: false,

        lastActivity: Date.now(),

        timeout: 30 * 60 * 1000

    }

};


/* =========================================================
   02. STORAGE KEYS
========================================================= */

const PLATFORM_STORAGE = {

    USER:
        "alon-historyverse-user",

    SUBMISSIONS:
        "alon-historyverse-submissions",

    NOTIFICATIONS:
        "alon-historyverse-notifications",

    PREFERENCES:
        "alon-historyverse-preferences",

    AGREEMENT:
        "alon-historyverse-contributor-agreement",

    MODERATION:
        "alon-historyverse-moderation",

    SECURITY:
        "alon-historyverse-security"

};


/* =========================================================
   03. SAFE JSON PARSER
========================================================= */

function platformParse(
    value,
    fallback = null
) {

    try {

        return JSON.parse(
            value
        );

    } catch (error) {

        return fallback;

    }

}


/* =========================================================
   04. SAFE STORAGE READ
========================================================= */

function platformRead(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (
            value === null
        ) {

            return fallback;

        }


        return platformParse(
            value,
            fallback
        );

    } catch (error) {

        console.warn(
            "ALON HISTORYVERSE 24: Storage read failed.",
            error
        );


        return fallback;

    }

}


/* =========================================================
   05. SAFE STORAGE WRITE
========================================================= */

function platformWrite(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                value
            )
        );


        return true;

    } catch (error) {

        console.warn(
            "ALON HISTORYVERSE 24: Storage write failed.",
            error
        );


        return false;

    }

}


/* =========================================================
   06. REMOVE STORAGE
========================================================= */

function platformRemove(
    key
) {

    try {

        localStorage.removeItem(
            key
        );


        return true;

    } catch (error) {

        return false;

    }

}


/* =========================================================
   07. USER SYSTEM
========================================================= */

function getCurrentUser() {

    return PlatformEngine.user;

}


function isLoggedIn() {

    return Boolean(
        PlatformEngine.authenticated &&
        PlatformEngine.user
    );

}


function setUser(
    user
) {

    if (!user) {

        return false;

    }


    PlatformEngine.user =
        user;

    PlatformEngine.authenticated =
        true;


    platformWrite(
        PLATFORM_STORAGE.USER,
        user
    );


    updateUserUI();


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:user-login",
            {
                detail: user
            }
        )
    );


    return true;

}


/* =========================================================
   08. LOGIN BRIDGE
========================================================= */

async function login(
    credentials = {}
) {

    const firebase =
        window.HistoryVerseFirebase;


    /*
     * Firebase login
     */

    if (
        firebase &&
        typeof firebase.login ===
            "function"
    ) {

        try {

            const user =
                await firebase.login(
                    credentials.email,
                    credentials.password
                );


            if (user) {

                const normalizedUser = {

                    id:
                        user.uid ||
                        user.id ||
                        credentials.email,

                    email:
                        user.email ||
                        credentials.email,

                    name:
                        user.displayName ||
                        credentials.name ||
                        credentials.email
                            .split("@")[0],

                    role:
                        user.role ||
                        "user"

                };


                setUser(
                    normalizedUser
                );

            }


            return user;

        } catch (error) {

            notify(
                error.message ||
                "Login failed.",
                "error"
            );


            throw error;

        }

    }


    /*
     * Local development fallback
     */

    if (
        credentials.email
    ) {

        const email =
            String(
                credentials.email
            )
                .trim()
                .toLowerCase();


        const user = {

            id:
                email,

            email,

            name:
                credentials.name ||
                email.split("@")[0],

            role:
                "user",

            local:
                true

        };


        setUser(
            user
        );


        return user;

    }


    return null;

}


/* =========================================================
   09. LOGOUT
========================================================= */

async function logout() {

    const firebase =
        window.HistoryVerseFirebase;


    if (
        firebase &&
        typeof firebase.logout ===
            "function"
    ) {

        try {

            await firebase.logout();

        } catch (error) {

            console.warn(
                "Firebase logout warning:",
                error
            );

        }

    }


    PlatformEngine.user =
        null;

    PlatformEngine.authenticated =
        false;


    platformRemove(
        PLATFORM_STORAGE.USER
    );


    updateUserUI();


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:user-logout"
        )
    );


    notify(
        "You have been logged out.",
        "success"
    );


    return true;

}


/* =========================================================
   10. RESTORE USER
========================================================= */

function restoreUser() {

    const saved =
        platformRead(
            PLATFORM_STORAGE.USER,
            null
        );


    if (
        saved &&
        typeof saved === "object"
    ) {

        PlatformEngine.user =
            saved;

        PlatformEngine.authenticated =
            true;

    }


    return saved;

}


/* =========================================================
   11. USER UI
========================================================= */

function updateUserUI() {

    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(
            element => {

                element.textContent =
                    PlatformEngine.user

                        ? (
                            PlatformEngine.user.name ||
                            PlatformEngine.user.email ||
                            "User"
                        )

                        : "Guest";

            }
        );


    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(
            element => {

                element.textContent =
                    PlatformEngine.user

                        ? (
                            PlatformEngine.user.email ||
                            ""
                        )

                        : "";

            }
        );


    document
        .querySelectorAll(
            "[data-login-required]"
        )
        .forEach(
            element => {

                element.hidden =
                    !PlatformEngine
                        .authenticated;

            }
        );


    document
        .querySelectorAll(
            "[data-guest-only]"
        )
        .forEach(
            element => {

                element.hidden =
                    PlatformEngine
                        .authenticated;

            }
        );


    document
        .querySelectorAll(
            "[data-user-only]"
        )
        .forEach(
            element => {

                element.hidden =
                    !PlatformEngine
                        .authenticated;

            }
        );

}


/* =========================================================
   12. CONTRIBUTOR AGREEMENT
========================================================= */

function hasContributorAgreement() {

    const agreement =
        platformRead(
            PLATFORM_STORAGE.AGREEMENT,
            null
        );


    return Boolean(
        agreement &&
        agreement.accepted === true
    );

}


function acceptContributorAgreement(
    version = "V100"
) {

    const agreement = {

        accepted:
            true,

        version,

        date:
            new Date()
                .toISOString()

    };


    platformWrite(
        PLATFORM_STORAGE.AGREEMENT,
        agreement
    );


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:agreement-accepted",
            {
                detail:
                    agreement
            }
        )
    );


    return agreement;

}


/* =========================================================
   13. CONTENT VALIDATION
========================================================= */

function validateSubmission(
    data
) {

    const errors = [];


    if (!data) {

        errors.push(
            "Submission data is required."
        );


        return {

            valid: false,

            errors

        };

    }


    const title =
        String(
            data.title ||
            ""
        ).trim();


    const content =
        String(
            data.content ||
            ""
        ).trim();


    if (
        title.length < 3
    ) {

        errors.push(
            "Title must contain at least 3 characters."
        );

    }


    if (
        content.length < 20
    ) {

        errors.push(
            "Content must contain at least 20 characters."
        );

    }


    if (
        !String(
            data.category ||
            ""
        ).trim()
    ) {

        errors.push(
            "Category is required."
        );

    }


    if (
        !data.source &&
        !data.sources
    ) {

        errors.push(
            "At least one source is required."
        );

    }


    if (
        data.image &&
        !data.imageLicense
    ) {

        errors.push(
            "Image license information is required."
        );

    }


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   14. COPYRIGHT VALIDATION
========================================================= */

function validateCopyright(
    data
) {

    const result = {

        valid: true,

        errors: []

    };


    if (!data) {

        result.valid =
            false;

        result.errors.push(
            "Content information is missing."
        );


        return result;

    }


    const permission =
        data.permissionConfirmed === true;


    const license =
        String(
            data.license ||
            data.contentLicense ||
            ""
        ).trim();


    if (
        !permission &&
        !license
    ) {

        result.valid =
            false;

        result.errors.push(
            "Copyright permission or license information is required."
        );

    }


    const source =
        String(
            data.source ||
            data.sources ||
            ""
        ).trim();


    if (
        source.length < 3
    ) {

        result.valid =
            false;

        result.errors.push(
            "A valid source is required."
        );

    }


    return result;

}


/* =========================================================
   15. CONTENT FINGERPRINT
========================================================= */

function createContentFingerprint(
    data = {}
) {

    const text = [

        data.title || "",

        data.description || "",

        data.content || "",

        data.source || data.sources || ""

    ]

        .join("|")

        .toLowerCase()

        .replace(
            /\s+/g,
            " "
        )

        .trim();


    let hash = 0;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        hash =
            (
                (
                    hash << 5
                ) -
                hash
            ) +
            text.charCodeAt(i);


        hash |= 0;

    }


    return String(
        Math.abs(hash)
    );

}


/* =========================================================
   16. DUPLICATE DETECTION
========================================================= */

function isDuplicateSubmission(
    data
) {

    const fingerprint =
        createContentFingerprint(
            data
        );


    return PlatformEngine
        .submissions
        .some(
            submission =>
                submission.fingerprint ===
                fingerprint &&
                submission.status !==
                "deleted"
        );

}


/* =========================================================
   17. SUBMISSION CREATION
========================================================= */

function createSubmission(
    data
) {

    const validation =
        validateSubmission(
            data
        );


    if (
        !validation.valid
    ) {

        return {

            success: false,

            errors:
                validation.errors

        };

    }


    const copyright =
        validateCopyright(
            data
        );


    if (
        !copyright.valid
    ) {

        return {

            success: false,

            errors:
                copyright.errors

        };

    }


    if (
        isDuplicateSubmission(
            data
        )
    ) {

        return {

            success: false,

            errors: [
                "Duplicate content detected."
            ]

        };

    }


    const currentUser =
        PlatformEngine.user;


    const submission = {

        id:
            createId(
                "submission"
            ),

        title:
            String(
                data.title
            ).trim(),

        description:
            String(
                data.description ||
                ""
            ).trim(),

        content:
            String(
                data.content
            ).trim(),

        category:
            String(
                data.category ||
                ""
            ).trim(),

        country:
            String(
                data.country ||
                ""
            ).trim(),

        state:
            String(
                data.state ||
                ""
            ).trim(),

        year:
            String(
                data.year ||
                ""
            ).trim(),

        source:
            String(
                data.source ||
                data.sources ||
                ""
            ).trim(),

        license:
            String(
                data.license ||
                data.contentLicense ||
                ""
            ).trim(),

        image:
            data.image ||
            "",

        imageLicense:
            String(
                data.imageLicense ||
                ""
            ).trim(),

        permissionConfirmed:
            data.permissionConfirmed === true,

        contributor:

            currentUser

                ? {

                    id:
                        currentUser.id ||
                        currentUser.uid ||
                        "",

                    name:
                        currentUser.name ||
                        currentUser.displayName ||
                        currentUser.email ||
                        "",

                    email:
                        currentUser.email ||
                        ""

                }

                : {

                    id:
                        "guest",

                    name:
                        "Guest",

                    email:
                        ""

                },

        status:
            "pending",

        fingerprint:
            createContentFingerprint(
                data
            ),

        createdAt:
            new Date()
                .toISOString(),

        updatedAt:
            new Date()
                .toISOString()

    };


    PlatformEngine
        .submissions
        .push(
            submission
        );


    saveSubmissions();


    addModerationItem(
        submission
    );


    notify(
        "Your submission has been sent for review.",
        "success"
    );


    return {

        success: true,

        submission

    };

}


/* =========================================================
   18. SAVE SUBMISSIONS
========================================================= */

function saveSubmissions() {

    return platformWrite(
        PLATFORM_STORAGE.SUBMISSIONS,
        PlatformEngine.submissions
    );

}


/* =========================================================
   19. LOAD SUBMISSIONS
========================================================= */

function loadSubmissions() {

    const saved =
        platformRead(
            PLATFORM_STORAGE.SUBMISSIONS,
            []
        );


    PlatformEngine.submissions =
        Array.isArray(saved)
            ? saved
            : [];


    return PlatformEngine.submissions;

}


/* =========================================================
   20. MODERATION QUEUE
========================================================= */

function loadModerationQueue() {

    const saved =
        platformRead(
            PLATFORM_STORAGE.MODERATION,
            []
        );


    PlatformEngine.moderationQueue =
        Array.isArray(saved)
            ? saved
            : [];


    return PlatformEngine.moderationQueue;

}


function addModerationItem(
    submission
) {

    if (!submission) {

        return false;

    }


    const alreadyExists =
        PlatformEngine
            .moderationQueue
            .some(
                item =>
                    item.submissionId ===
                    submission.id
            );


    if (alreadyExists) {

        return true;

    }


    PlatformEngine
        .moderationQueue
        .push({

            submissionId:
                submission.id,

            status:
                "pending",

            createdAt:
                new Date()
                    .toISOString()

        });


    platformWrite(
        PLATFORM_STORAGE.MODERATION,
        PlatformEngine.moderationQueue
    );


    return true;

}


/* =========================================================
   21. MODERATION ACTION
========================================================= */

function moderateSubmission(
    submissionId,
    action,
    note = ""
) {

    const submission =
        PlatformEngine
            .submissions
            .find(
                item =>
                    item.id ===
                    submissionId
            );


    if (!submission) {

        return {

            success: false,

            error:
                "Submission not found."

        };

    }


    const allowed = [

        "approve",

        "reject",

        "request_changes",

        "delete"

    ];


    if (
        !allowed.includes(
            action
        )
    ) {

        return {

            success: false,

            error:
                "Invalid moderation action."

        };

    }


    const statusMap = {

        approve:
            "approved",

        reject:
            "rejected",

        request_changes:
            "changes_required",

        delete:
            "deleted"

    };


    submission.status =
        statusMap[action];


    submission.moderationNote =
        String(
            note || ""
        );


    submission.moderatedAt =
        new Date()
            .toISOString();


    const queueItem =
        PlatformEngine
            .moderationQueue
            .find(
                item =>
                    item.submissionId ===
                    submissionId
            );


    if (queueItem) {

        queueItem.status =
            submission.status;

        queueItem.moderatedAt =
            submission.moderatedAt;

    }


    saveSubmissions();


    platformWrite(
        PLATFORM_STORAGE.MODERATION,
        PlatformEngine.moderationQueue
    );


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:submission-moderated",
            {
                detail:
                    submission
            }
        )
    );


    return {

        success: true,

        submission

    };

}


/* =========================================================
   22. NOTIFICATIONS
========================================================= */

function loadNotifications() {

    const saved =
        platformRead(
            PLATFORM_STORAGE.NOTIFICATIONS,
            []
        );


    PlatformEngine.notifications =
        Array.isArray(saved)
            ? saved
            : [];


    return PlatformEngine.notifications;

}


function notify(
    message,
    type = "info"
) {

    const notification = {

        id:
            createId(
                "notification"
            ),

        message:
            String(
                message || ""
            ),

        type,

        read:
            false,

        createdAt:
            new Date()
                .toISOString()

    };


    PlatformEngine
        .notifications
        .unshift(
            notification
        );


    platformWrite(
        PLATFORM_STORAGE.NOTIFICATIONS,
        PlatformEngine.notifications
    );


    showNotification(
        notification
    );


    return notification;

}


/* =========================================================
   23. VISUAL NOTIFICATION
========================================================= */

function showNotification(
    notification
) {

    let container =
        document.querySelector(
            "[data-notifications]"
        );


    /*
     * यदि HTML में notification container
     * नहीं है तो platform खुद बना देगा।
     */

    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.setAttribute(
            "data-notifications",
            ""
        );

        container.setAttribute(
            "aria-live",
            "polite"
        );

        document.body.appendChild(
            container
        );

    }


    const element =
        document.createElement(
            "div"
        );


    element.className =
        `historyverse-notification ${notification.type}`;


    element.textContent =
        notification.message;


    element.setAttribute(
        "role",
        "status"
    );


    container.appendChild(
        element
    );


    window.setTimeout(
        () => {

            element.remove();

        },
        5000
    );

}


/* =========================================================
   24. MARK NOTIFICATION READ
========================================================= */

function markNotificationRead(
    id
) {

    const notification =
        PlatformEngine
            .notifications
            .find(
                item =>
                    item.id ===
                    id
            );


    if (!notification) {

        return false;

    }


    notification.read =
        true;


    platformWrite(
        PLATFORM_STORAGE.NOTIFICATIONS,
        PlatformEngine.notifications
    );


    return true;

}


/* =========================================================
   25. USER PREFERENCES
========================================================= */

function loadPreferences() {

    const saved =
        platformRead(
            PLATFORM_STORAGE.PREFERENCES,
            {}
        );


    PlatformEngine.preferences =
        saved &&
        typeof saved === "object" &&
        !Array.isArray(saved)

            ? saved

            : {};


    return PlatformEngine.preferences;

}


function getPreference(
    key,
    fallback = null
) {

    if (!key) {

        return fallback;

    }


    return Object.prototype
        .hasOwnProperty.call(
            PlatformEngine.preferences,
            key
        )

        ? PlatformEngine
            .preferences[key]

        : fallback;

}


function setPreference(
    key,
    value
) {

    if (!key) {

        return false;

    }


    PlatformEngine
        .preferences[key] =
        value;


    platformWrite(
        PLATFORM_STORAGE.PREFERENCES,
        PlatformEngine.preferences
    );


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:preference-changed",
            {
                detail: {

                    key,

                    value

                }
            }
        )
    );


    return true;

}


/* =========================================================
   26. ACCESSIBILITY
========================================================= */

function setupAccessibility() {

    document
        .querySelectorAll(
            "[data-skip-content]"
        )
        .forEach(
            button => {

                if (
                    button.dataset
                        .platformAccessibilityBound
                ) {

                    return;

                }


                button.dataset
                    .platformAccessibilityBound =
                    "true";


                button.addEventListener(
                    "click",
                    () => {

                        const selector =
                            button.dataset
                                .skipContent;


                        const target =
                            document.querySelector(
                                selector
                            );


                        if (target) {

                            target.setAttribute(
                                "tabindex",
                                "-1"
                            );


                            target.focus();

                        }

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "img"
        )
        .forEach(
            image => {

                if (
                    !image.getAttribute(
                        "alt"
                    )
                ) {

                    image.setAttribute(
                        "alt",
                        "ALON HISTORYVERSE 24 image"
                    );

                }

            }
        );

}


/* =========================================================
   27. INPUT SANITIZATION
========================================================= */

function sanitizeText(
    value
) {

    return String(
        value || ""
    )

        .replace(
            /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
            ""
        )

        .replace(
            /javascript\s*:/gi,
            ""
        )

        .replace(
            /vbscript\s*:/gi,
            ""
        )

        .replace(
            /data\s*:\s*text\/html/gi,
            ""
        )

        .replace(
            /on\w+\s*=/gi,
            ""
        )

        .trim();

}


/* =========================================================
   28. SAFE URL
========================================================= */

function safeURL(
    value
) {

    if (!value) {

        return "";

    }


    try {

        const url =
            new URL(
                value,
                window.location.href
            );


        const allowed = [

            "http:",

            "https:",

            "mailto:"

        ];


        if (
            !allowed.includes(
                url.protocol
            )
        ) {

            return "";

        }


        return url.href;

    } catch (error) {

        return "";

    }

}


/* =========================================================
   29. SAFE NAVIGATION
========================================================= */

function safeNavigate(
    value
) {

    const url =
        safeURL(
            value
        );


    if (!url) {

        return false;

    }


    window.location.href =
        url;


    return true;

}


/* =========================================================
   30. SECURITY ACTIVITY
========================================================= */

function updateSecurityActivity() {

    PlatformEngine
        .security
        .lastActivity =
        Date.now();

}


function checkSecuritySession() {

    if (
        !PlatformEngine.authenticated
    ) {

        return true;

    }


    const elapsed =
        Date.now() -
        PlatformEngine
            .security
            .lastActivity;


    if (
        elapsed >
        PlatformEngine
            .security
            .timeout
    ) {

        logout();


        /*
         * logout() already creates a notification.
         */

        notify(
            "Your session expired.",
            "warning"
        );


        return false;

    }


    return true;

}


/* =========================================================
   31. SECURITY EVENTS
========================================================= */

function setupSecurityEvents() {

    [

        "click",

        "touchstart",

        "keydown",

        "scroll"

    ]

        .forEach(
            eventName => {

                document.addEventListener(
                    eventName,
                    updateSecurityActivity,
                    {
                        passive: true
                    }
                );

            }
        );


    window.setInterval(
        checkSecuritySession,
        60000
    );

}


/* =========================================================
   32. ID GENERATOR
========================================================= */

function createId(
    prefix = "hv"
) {

    return (

        prefix +

        "-" +

        Date.now().toString(
            36
        ) +

        "-" +

        Math.random()
            .toString(36)
            .slice(2, 9)

    );

}


/* =========================================================
   33. SUBMIT FORM HANDLER
========================================================= */

function setupSubmitForms() {

    document.addEventListener(
        "submit",
        event => {

            const form =
                event.target.closest(
                    "[data-history-submit]"
                );


            if (!form) {

                return;

            }


            event.preventDefault();


            const formData =
                new FormData(
                    form
                );


            const data = {};


            formData.forEach(
                (
                    value,
                    key
                ) => {

                    data[key] =

                        typeof value ===
                        "string"

                            ? sanitizeText(
                                value
                            )

                            : value;

                }
            );


            const agreement =
                form.querySelector(
                    "[name='agreement']"
                );


            if (
                agreement &&
                !agreement.checked
            ) {

                notify(
                    "Please accept the contributor agreement.",
                    "warning"
                );


                return;

            }


            if (
                agreement &&
                agreement.checked
            ) {

                acceptContributorAgreement();

            }


            const permission =
                form.querySelector(
                    "[name='permissionConfirmed']"
                );


            data.permissionConfirmed =

                permission

                    ? permission.checked

                    : Boolean(
                        data.permissionConfirmed
                    );


            const result =
                createSubmission(
                    data
                );


            if (
                result.success
            ) {

                form.reset();


                document.dispatchEvent(
                    new CustomEvent(
                        "historyverse:submission-created",
                        {
                            detail:
                                result.submission
                        }
                    )
                );

            } else {

                notify(
                    result.errors.join(
                        " "
                    ),
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   34. AUTH EVENTS
========================================================= */

function setupAuthEvents() {

    document.addEventListener(
        "click",
        async event => {

            const logoutButton =
                event.target.closest(
                    "[data-history-logout]"
                );


            if (
                logoutButton
            ) {

                event.preventDefault();

                await logout();

            }

        }
    );

}


/* =========================================================
   35. LOGIN FORM BRIDGE
========================================================= */

function setupLoginForms() {

    document.addEventListener(
        "submit",
        async event => {

            const form =
                event.target.closest(
                    "[data-history-login]"
                );


            if (!form) {

                return;

            }


            event.preventDefault();


            const emailInput =
                form.querySelector(
                    "[name='email']"
                );


            const passwordInput =
                form.querySelector(
                    "[name='password']"
                );


            const nameInput =
                form.querySelector(
                    "[name='name']"
                );


            try {

                const user =
                    await login({

                        email:
                            emailInput
                                ? emailInput.value
                                : "",

                        password:
                            passwordInput
                                ? passwordInput.value
                                : "",

                        name:
                            nameInput
                                ? nameInput.value
                                : ""

                    });


                if (user) {

                    notify(
                        "Login successful.",
                        "success"
                    );


                    document.dispatchEvent(
                        new CustomEvent(
                            "historyverse:login-success",
                            {
                                detail:
                                    user
                            }
                        )
                    );

                }

            } catch (error) {

                notify(
                    error.message ||
                    "Unable to login.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   36. FIREBASE AUTH STATE BRIDGE
========================================================= */

function setupFirebaseAuthBridge() {

    const firebase =
        window.HistoryVerseFirebase;


    if (
        !firebase ||
        typeof firebase.watchAuth !==
            "function"
    ) {

        return;

    }


    try {

        firebase.watchAuth(
            user => {

                if (user) {

                    PlatformEngine.user = {

                        id:
                            user.uid ||
                            user.id ||
                            "",

                        email:
                            user.email ||
                            "",

                        name:
                            user.displayName ||
                            user.email ||
                            "User",

                        role:
                            user.role ||
                            "user"

                    };


                    PlatformEngine.authenticated =
                        true;

                } else {

                    /*
                     * केवल Firebase user clear करें।
                     * Local fallback user को तभी हटाएँ जब
                     * वह Firebase session से आया हो।
                     */

                    if (
                        PlatformEngine.user &&
                        !PlatformEngine.user.local
                    ) {

                        PlatformEngine.user =
                            null;

                        PlatformEngine.authenticated =
                            false;

                    }

                }


                updateUserUI();

            }
        );

    } catch (error) {

        console.warn(
            "Firebase auth bridge unavailable:",
            error
        );

    }

}


/* =========================================================
   37. PLATFORM INITIALIZATION
========================================================= */

function initializePlatform() {

    if (
        PlatformEngine.initialized
    ) {

        return PlatformEngine;

    }


    restoreUser();

    loadSubmissions();

    loadNotifications();

    loadModerationQueue();

    loadPreferences();

    setupAccessibility();

    setupSecurityEvents();

    setupSubmitForms();

    setupAuthEvents();

    setupLoginForms();

    setupFirebaseAuthBridge();

    updateUserUI();


    PlatformEngine
        .security
        .sessionStarted =
        true;


    PlatformEngine
        .security
        .lastActivity =
        Date.now();


    PlatformEngine.initialized =
        true;


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:platform-ready",
            {
                detail:
                    PlatformEngine
            }
        )
    );


    return PlatformEngine;

}


/* =========================================================
   38. PUBLIC API
========================================================= */

const HistoryVersePlatform = {

    state:
        PlatformEngine,

    storage:
        PLATFORM_STORAGE,

    login,

    logout,

    getCurrentUser,

    isLoggedIn,

    setUser,

    restoreUser,

    updateUserUI,

    validateSubmission,

    validateCopyright,

    createSubmission,

    loadSubmissions,

    saveSubmissions,

    isDuplicateSubmission,

    createContentFingerprint,

    loadModerationQueue,

    addModerationItem,

    moderateSubmission,

    loadNotifications,

    notify,

    showNotification,

    markNotificationRead,

    hasContributorAgreement,

    acceptContributorAgreement,

    loadPreferences,

    getPreference,

    setPreference,

    sanitizeText,

    safeURL,

    safeNavigate,

    updateSecurityActivity,

    checkSecuritySession,

    initialize:
        initializePlatform

};


/* =========================================================
   39. GLOBAL API
========================================================= */

if (
    typeof window !== "undefined"
) {

    window.HistoryVersePlatform =
        HistoryVersePlatform;

}


/* =========================================================
   40. AUTO START
========================================================= */

if (
    typeof document !== "undefined"
) {

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePlatform,
            {
                once: true
            }
        );

    } else {

        initializePlatform();

    }

}


/* =========================================================
   END OF ALON HISTORYVERSE 24 V100
   MASTER PLATFORM ENGINE
========================================================= */