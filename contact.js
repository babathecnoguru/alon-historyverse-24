/* =========================================================
   ALON HISTORYVERSE 24
   CONTACT ENGINE
   Creator: Baba Thecno Guru
   Version: 24.0
   File: jss/contact.js
   ========================================================= */

"use strict";


/* =========================================================
   CONFIGURATION
   ========================================================= */

const ALON_CONTACT_CONFIG = {

    project: "ALON HISTORYVERSE 24",

    creator: "Baba Thecno Guru",

    version: "24.0",

    storage: {

        draft:
            "alon_historyverse_contact_draft",

        messages:
            "alon_historyverse_contact_messages"

    },

    limits: {

        messageMinLength: 10,

        messageMaxLength: 5000,

        nameMaxLength: 100,

        subjectMaxLength: 200,

        emailMaxLength: 200

    }

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function contactElement(id) {

    return document.getElementById(id);

}


function contactQuery(selector) {

    return document.querySelector(selector);

}


function contactQueryAll(selector) {

    return document.querySelectorAll(selector);

}


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function contactGetStorage(
    key,
    fallback = null
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {

            return fallback;

        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "Contact storage read error:",
            error
        );

        return fallback;

    }

}


function contactSetStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            "Contact storage write error:",
            error
        );

        return false;

    }

}


function contactRemoveStorage(
    key
) {

    try {

        localStorage.removeItem(
            key
        );

        return true;

    } catch (error) {

        console.error(
            "Contact storage remove error:",
            error
        );

        return false;

    }

}


/* =========================================================
   SAFE TEXT
   ========================================================= */

function contactEscapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

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


/* =========================================================
   FORM FIELD HELPERS
   ========================================================= */

function getContactForm() {

    return (
        contactElement(
            "contactForm"
        ) ||
        contactQuery(
            "form"
        )
    );

}


function getContactField(
    names
) {

    const list =
        Array.isArray(names)
            ? names
            : [names];

    for (
        const name of list
    ) {

        const element =
            contactElement(name);

        if (element) {

            return element;

        }

    }

    return null;

}


function getContactFormData() {

    const nameField =
        getContactField([
            "name",
            "contactName",
            "userName"
        ]);

    const emailField =
        getContactField([
            "email",
            "contactEmail",
            "userEmail"
        ]);

    const subjectField =
        getContactField([
            "subject",
            "contactSubject"
        ]);

    const messageField =
        getContactField([
            "message",
            "contactMessage"
        ]);

    return {

        name:
            nameField
                ? nameField.value.trim()
                : "",

        email:
            emailField
                ? emailField.value.trim()
                : "",

        subject:
            subjectField
                ? subjectField.value.trim()
                : "",

        message:
            messageField
                ? messageField.value.trim()
                : "",

        savedAt:
            new Date().toISOString()

    };

}


/* =========================================================
   FORM STATUS MESSAGE
   ========================================================= */

function showContactMessage(
    message,
    type = "info"
) {

    let box =
        contactElement(
            "contactStatus"
        );

    if (!box) {

        box =
            contactElement(
                "formStatus"
            );

    }

    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "contactStatus";

        const form =
            getContactForm();

        if (form) {

            form.prepend(
                box
            );

        } else {

            document.body.prepend(
                box
            );

        }

    }

    box.textContent =
        message;

    box.className =
        "contact-status " +
        "contact-status-" +
        type;

    box.setAttribute(
        "role",
        "status"
    );

}


function clearContactMessage() {

    const box =
        contactElement(
            "contactStatus"
        ) ||
        contactElement(
            "formStatus"
        );

    if (box) {

        box.textContent =
            "";

        box.className =
            "contact-status";

    }

}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidContactEmail(
    email
) {

    if (!email) {

        return false;

    }

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(
        email
    );

}


/* =========================================================
   FORM VALIDATION
   ========================================================= */

function validateContactForm(
    data
) {

    const errors = [];

    if (!data.name) {

        errors.push(
            "Please enter your name."
        );

    } else if (
        data.name.length >
        ALON_CONTACT_CONFIG
            .limits
            .nameMaxLength
    ) {

        errors.push(
            "Name is too long."
        );

    }


    if (!data.email) {

        errors.push(
            "Please enter your email address."
        );

    } else if (
        data.email.length >
        ALON_CONTACT_CONFIG
            .limits
            .emailMaxLength
    ) {

        errors.push(
            "Email address is too long."
        );

    } else if (
        !isValidContactEmail(
            data.email
        )
    ) {

        errors.push(
            "Please enter a valid email address."
        );

    }


    if (!data.subject) {

        errors.push(
            "Please enter a subject."
        );

    } else if (
        data.subject.length >
        ALON_CONTACT_CONFIG
            .limits
            .subjectMaxLength
    ) {

        errors.push(
            "Subject is too long."
        );

    }


    if (!data.message) {

        errors.push(
            "Please enter your message."
        );

    } else if (
        data.message.length <
        ALON_CONTACT_CONFIG
            .limits
            .messageMinLength
    ) {

        errors.push(
            "Message is too short."
        );

    } else if (
        data.message.length >
        ALON_CONTACT_CONFIG
            .limits
            .messageMaxLength
    ) {

        errors.push(
            "Message is too long."
        );

    }

    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   SAVE DRAFT
   ========================================================= */

function saveContactDraft(
    silent = false
) {

    const data =
        getContactFormData();

    const success =
        contactSetStorage(
            ALON_CONTACT_CONFIG
                .storage
                .draft,
            data
        );

    if (
        success &&
        !silent
    ) {

        showContactMessage(
            "Contact form draft saved on this device.",
            "success"
        );

    }

    return success;

}


/* =========================================================
   LOAD DRAFT
   ========================================================= */

function loadContactDraft(
    showMessage = true
) {

    const draft =
        contactGetStorage(
            ALON_CONTACT_CONFIG
                .storage
                .draft,
            null
        );

    if (!draft) {

        if (showMessage) {

            showContactMessage(
                "No saved contact draft was found.",
                "info"
            );

        }

        return false;

    }

    const nameField =
        getContactField([
            "name",
            "contactName",
            "userName"
        ]);

    const emailField =
        getContactField([
            "email",
            "contactEmail",
            "userEmail"
        ]);

    const subjectField =
        getContactField([
            "subject",
            "contactSubject"
        ]);

    const messageField =
        getContactField([
            "message",
            "contactMessage"
        ]);


    if (nameField) {

        nameField.value =
            draft.name || "";

    }


    if (emailField) {

        emailField.value =
            draft.email || "";

    }


    if (subjectField) {

        subjectField.value =
            draft.subject || "";

    }


    if (messageField) {

        messageField.value =
            draft.message || "";

    }


    updateContactCharacterCount();


    if (showMessage) {

        showContactMessage(
            "Saved contact draft loaded.",
            "success"
        );

    }

    return true;

}


/* =========================================================
   CLEAR DRAFT
   ========================================================= */

function clearContactDraft(
    showMessage = true
) {

    const success =
        contactRemoveStorage(
            ALON_CONTACT_CONFIG
                .storage
                .draft
        );

    if (
        success &&
        showMessage
    ) {

        showContactMessage(
            "Saved contact draft cleared.",
            "success"
        );

    }

    return success;

}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetContactForm() {

    const form =
        getContactForm();

    if (form) {

        form.reset();

    }

    clearContactMessage();

    updateContactCharacterCount();

}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function updateContactCharacterCount() {

    const messageField =
        getContactField([
            "message",
            "contactMessage"
        ]);

    if (!messageField) {

        return;

    }

    const count =
        messageField.value.length;

    const counters =
        contactQueryAll(
            "[data-message-count], #messageCount, #characterCount"
        );

    counters.forEach(
        function (counter) {

            counter.textContent =
                count;

        }
    );


    const max =
        ALON_CONTACT_CONFIG
            .limits
            .messageMaxLength;

    const maxCounters =
        contactQueryAll(
            "[data-message-max]"
        );

    maxCounters.forEach(
        function (counter) {

            counter.textContent =
                max;

        }
    );

}


/* =========================================================
   SAVE PENDING MESSAGE
   ========================================================= */

function savePendingContactMessage(
    data
) {

    const messages =
        contactGetStorage(
            ALON_CONTACT_CONFIG
                .storage
                .messages,
            []
        );

    const list =
        Array.isArray(messages)
            ? messages
            : [];

    const record = {

        id:
            "contact_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 9),

        name:
            data.name,

        email:
            data.email,

        subject:
            data.subject,

        message:
            data.message,

        createdAt:
            new Date().toISOString(),

        status:
            "pending"

    };

    list.push(
        record
    );

    return contactSetStorage(
        ALON_CONTACT_CONFIG
            .storage
            .messages,
        list
    );

}


/* =========================================================
   FORM SUBMIT
   ========================================================= */

function handleContactSubmit(
    event
) {

    if (event) {

        event.preventDefault();

    }

    const data =
        getContactFormData();

    const validation =
        validateContactForm(
            data
        );

    if (
        !validation.valid
    ) {

        showContactMessage(
            validation.errors.join(
                " "
            ),
            "error"
        );

        return false;

    }


    /*
       Frontend-only storage.

       This does NOT send a real email.
       A backend/email service is required
       for real online delivery.
    */

    const saved =
        savePendingContactMessage(
            data
        );

    if (!saved) {

        showContactMessage(
            "The message could not be saved on this device.",
            "error"
        );

        return false;

    }


    clearContactDraft(
        false
    );


    showContactMessage(
        "Your message has been saved on this device. Real online delivery requires a backend or email service.",
        "success"
    );


    const form =
        getContactForm();

    if (form) {

        form.reset();

    }

    updateContactCharacterCount();

    return true;

}


/* =========================================================
   INPUT EVENTS
   ========================================================= */

function setupContactInputEvents() {

    const fields =
        contactQueryAll(
            "input, textarea, select"
        );

    fields.forEach(
        function (field) {

            field.addEventListener(
                "input",
                function () {

                    updateContactCharacterCount();

                }
            );

        }
    );

}


/* =========================================================
   BUTTON EVENTS
   ========================================================= */

function setupContactButtons() {

    const saveButtons =
        contactQueryAll(
            "[data-contact-save], #saveContactDraft"
        );

    saveButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    saveContactDraft();

                }
            );

        }
    );


    const loadButtons =
        contactQueryAll(
            "[data-contact-load], #loadContactDraft"
        );

    loadButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    loadContactDraft();

                }
            );

        }
    );


    const clearButtons =
        contactQueryAll(
            "[data-contact-clear], #clearContactDraft"
        );

    clearButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    clearContactDraft();

                }
            );

        }
    );


    const resetButtons =
        contactQueryAll(
            "[data-contact-reset], #resetContactForm"
        );

    resetButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    resetContactForm();

                }
            );

        }
    );

}


/* =========================================================
   FORM EVENT
   ========================================================= */

function setupContactForm() {

    const form =
        getContactForm();

    if (!form) {

        return;

    }

    form.addEventListener(
        "submit",
        handleContactSubmit
    );

}


/* =========================================================
   UNSAVED DRAFT NOTICE
   ========================================================= */

function hasContactDraft() {

    return (
        contactGetStorage(
            ALON_CONTACT_CONFIG
                .storage
                .draft,
            null
        ) !== null
    );

}


/* =========================================================
   CONTACT INITIALIZATION
   ========================================================= */

function initializeContactPage() {

    setupContactForm();

    setupContactInputEvents();

    setupContactButtons();

    updateContactCharacterCount();

}


/* =========================================================
   GLOBAL API
   ========================================================= */

window.ALON_CONTACT = {

    config:
        ALON_CONTACT_CONFIG,

    getData:
        getContactFormData,

    validate:
        validateContactForm,

    saveDraft:
        saveContactDraft,

    loadDraft:
        loadContactDraft,

    clearDraft:
        clearContactDraft,

    reset:
        resetContactForm,

    submit:
        handleContactSubmit,

    hasDraft:
        hasContactDraft,

    initialize:
        initializeContactPage

};


/* =========================================================
   AUTO INITIALIZATION
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeContactPage
    );

} else {

    initializeContactPage();

}


/* =========================================================
   END OF CONTACT.JS
   ALON HISTORYVERSE 24
   ========================================================= */