/* =========================================================
   ALON HISTORYVERSE 24
   SUBMIT ENGINE
   Version: 24.0
   Creator: Baba Thecno Guru

   Purpose:
   Common form submission helper for:
   - Contributions
   - Contact messages
   - Articles
   - General ALON forms

   IMPORTANT:
   This frontend engine does NOT claim real server delivery.
   Real online submission requires a backend/API/database.

   Storage:
   localStorage
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

        storage: {
            contributions:
                "alon_historyverse_pending_contribution",

            contributionList:
                "alon_historyverse_contributions",

            contacts:
                "alon_historyverse_contact_messages",

            contactDraft:
                "alon_historyverse_contact_draft",

            articles:
                "alon_historyverse_articles",

            articleDrafts:
                "alon_historyverse_article_drafts",

            submitLog:
                "alon_historyverse_submit_log"
        },

        limits: {
            name: 150,
            email: 254,
            subject: 300,
            message: 10000,
            content: 100000,
            sources: 20000,
            title: 300
        }
    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {
        initialized: false,
        submitting: false,
        lastSubmission: null
    };


    /* =====================================================
       DOM HELPERS
    ====================================================== */

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $$(selector, root) {
        return Array.from(
            (root || document).querySelectorAll(selector)
        );
    }


    /* =====================================================
       TEXT HELPERS
    ====================================================== */

    function cleanText(value) {
        return String(value ?? "")
            .replace(/\r\n/g, "\n")
            .trim();
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function createId(prefix) {

        return (
            prefix +
            "_" +
            Date.now().toString(36) +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 9)
        );
    }

    function nowISO() {
        return new Date().toISOString();
    }


    /* =====================================================
       EMAIL VALIDATION
    ====================================================== */

    function isValidEmail(email) {

        const value =
            cleanText(email);

        if (!value) {
            return false;
        }

        if (value.length > CONFIG.limits.email) {
            return false;
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(value);
    }


    /* =====================================================
       STORAGE HELPERS
    ====================================================== */

    function getStorage(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            return fallback;
        }
    }


    function setStorage(key, value) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            console.warn(
                "ALON SUBMIT: storage failed",
                error
            );

            return false;
        }
    }


    function removeStorage(key) {

        try {

            localStorage.removeItem(key);

            return true;

        } catch (error) {

            return false;
        }
    }


    /* =====================================================
       STATUS MESSAGE
    ====================================================== */

    function showStatus(
        message,
        type,
        form
    ) {

        const root =
            form ||
            document;

        let status =
            root.querySelector(
                "[data-submit-status]"
            ) ||
            root.querySelector(
                ".submit-status"
            ) ||
            root.querySelector(
                "#submitStatus"
            );

        if (!status) {

            status =
                document.createElement(
                    "div"
                );

            status.className =
                "submit-status";

            status.setAttribute(
                "data-submit-status",
                ""
            );

            status.setAttribute(
                "role",
                "status"
            );

            if (form) {
                form.prepend(status);
            } else {
                document.body.prepend(status);
            }
        }

        status.textContent =
            message || "";

        status.dataset.type =
            type || "info";

        status.hidden =
            !message;

        return status;
    }


    /* =====================================================
       FIELD HELPERS
    ====================================================== */

    function getField(form, names) {

        if (!form) {
            return null;
        }

        for (const name of names) {

            const field =
                form.querySelector(
                    `[name="${name}"]`
                ) ||
                form.querySelector(
                    `#${name}`
                );

            if (field) {
                return field;
            }
        }

        return null;
    }


    function getValue(form, names) {

        const field =
            getField(form, names);

        if (!field) {
            return "";
        }

        return cleanText(
            field.value
        );
    }


    /* =====================================================
       VALIDATION
    ====================================================== */

    function validateRequired(
        value,
        label,
        minimum,
        maximum
    ) {

        const text =
            cleanText(value);

        if (!text) {
            return `${label} is required.`;
        }

        if (
            minimum &&
            text.length < minimum
        ) {
            return `${label} must contain at least ${minimum} characters.`;
        }

        if (
            maximum &&
            text.length > maximum
        ) {
            return `${label} is too long.`;
        }

        return "";
    }


    function validateContribution(form) {

        const name =
            getValue(
                form,
                ["name", "contributorName"]
            );

        const email =
            getValue(
                form,
                ["email", "contributorEmail"]
            );

        const title =
            getValue(
                form,
                ["title", "contributionTitle"]
            );

        const content =
            getValue(
                form,
                ["content", "contributionContent"]
            );

        const sources =
            getValue(
                form,
                ["sources", "references"]
            );

        const agreement =
            getField(
                form,
                [
                    "agreement",
                    "contributorAgreement"
                ]
            );

        let error =
            validateRequired(
                name,
                "Contributor name",
                2,
                CONFIG.limits.name
            );

        if (error) return error;

        if (!isValidEmail(email)) {
            return "Please enter a valid email address.";
        }

        error =
            validateRequired(
                title,
                "Contribution title",
                3,
                CONFIG.limits.title
            );

        if (error) return error;

        error =
            validateRequired(
                content,
                "Contribution content",
                50,
                CONFIG.limits.content
            );

        if (error) return error;

        error =
            validateRequired(
                sources,
                "Sources / references",
                5,
                CONFIG.limits.sources
            );

        if (error) return error;

        if (
            agreement &&
            !agreement.checked
        ) {
            return "Please accept the contributor agreement.";
        }

        return "";
    }


    function validateContact(form) {

        const name =
            getValue(
                form,
                ["name"]
            );

        const email =
            getValue(
                form,
                ["email"]
            );

        const subject =
            getValue(
                form,
                ["subject"]
            );

        const message =
            getValue(
                form,
                ["message"]
            );

        let error =
            validateRequired(
                name,
                "Name",
                2,
                CONFIG.limits.name
            );

        if (error) return error;

        if (!isValidEmail(email)) {
            return "Please enter a valid email address.";
        }

        error =
            validateRequired(
                subject,
                "Subject",
                2,
                CONFIG.limits.subject
            );

        if (error) return error;

        error =
            validateRequired(
                message,
                "Message",
                10,
                CONFIG.limits.message
            );

        if (error) return error;

        return "";
    }


    function validateArticle(form) {

        const title =
            getValue(
                form,
                ["title", "articleTitle"]
            );

        const content =
            getValue(
                form,
                ["content", "articleContent"]
            );

        const sources =
            getValue(
                form,
                ["sources", "references"]
            );

        let error =
            validateRequired(
                title,
                "Article title",
                3,
                CONFIG.limits.title
            );

        if (error) return error;

        error =
            validateRequired(
                content,
                "Article content",
                50,
                CONFIG.limits.content
            );

        if (error) return error;

        if (sources.length > CONFIG.limits.sources) {
            return "Sources / references are too long.";
        }

        return "";
    }


    /* =====================================================
       COLLECT FORM DATA
    ====================================================== */

    function collectFormData(form) {

        const data = {};

        if (!form) {
            return data;
        }

        const elements =
            $$(
                "input, textarea, select",
                form
            );

        elements.forEach(
            function (field) {

                if (!field.name) {
                    return;
                }

                if (
                    field.type === "checkbox"
                ) {

                    data[field.name] =
                        field.checked;

                    return;
                }

                if (
                    field.type === "radio"
                ) {

                    if (field.checked) {
                        data[field.name] =
                            field.value;
                    }

                    return;
                }

                if (
                    field.type === "file"
                ) {

                    data[field.name] =
                        Array.from(
                            field.files || []
                        ).map(function (file) {

                            return {
                                name: file.name,
                                type: file.type,
                                size: file.size,
                                lastModified:
                                    file.lastModified
                            };
                        });

                    return;
                }

                data[field.name] =
                    cleanText(
                        field.value
                    );
            }
        );

        return data;
    }


    /* =====================================================
       CREATE SUBMISSION OBJECT
    ====================================================== */

    function createSubmission(
        type,
        formData
    ) {

        return {

            id: createId(
                "submission"
            ),

            project:
                CONFIG.project,

            creator:
                CONFIG.creator,

            version:
                CONFIG.version,

            type:
                type,

            status:
                "pending",

            createdAt:
                nowISO(),

            updatedAt:
                nowISO(),

            data:
                formData
        };
    }


    /* =====================================================
       SAVE SUBMISSION
    ====================================================== */

    function saveSubmission(
        type,
        submission
    ) {

        let key;

        if (type === "contribution") {

            key =
                CONFIG.storage
                    .contributionList;

        } else if (type === "contact") {

            key =
                CONFIG.storage
                    .contacts;

        } else if (type === "article") {

            key =
                CONFIG.storage
                    .articles;

        } else {

            key =
                CONFIG.storage
                    .submitLog;
        }


        const existing =
            getStorage(
                key,
                []
            );

        const list =
            Array.isArray(existing)
                ? existing
                : [];

        list.push(
            submission
        );

        return setStorage(
            key,
            list
        );
    }


    /* =====================================================
       SUBMISSION LOG
    ====================================================== */

    function logSubmission(
        submission
    ) {

        const logs =
            getStorage(
                CONFIG.storage.submitLog,
                []
            );

        const list =
            Array.isArray(logs)
                ? logs
                : [];

        list.push({

            id:
                submission.id,

            type:
                submission.type,

            status:
                submission.status,

            createdAt:
                submission.createdAt
        });

        /*
         * Keep the local log reasonably small.
         */

        const limited =
            list.slice(-100);

        setStorage(
            CONFIG.storage.submitLog,
            limited
        );
    }


    /* =====================================================
       SUBMIT CONTRIBUTION
    ====================================================== */

    function submitContribution(
        form
    ) {

        if (!form) {
            return {
                success: false,
                message: "Contribution form not found."
            };
        }

        const error =
            validateContribution(
                form
            );

        if (error) {

            showStatus(
                error,
                "error",
                form
            );

            return {
                success: false,
                message: error
            };
        }


        const formData =
            collectFormData(form);

        const submission =
            createSubmission(
                "contribution",
                formData
            );


        /*
         * Keep the latest pending contribution
         * compatible with the existing project
         * contribution workflow.
         */

        setStorage(
            CONFIG.storage
                .contributions,
            submission
        );


        saveSubmission(
            "contribution",
            submission
        );

        logSubmission(
            submission
        );

        STATE.lastSubmission =
            submission;


        showStatus(
            "Contribution saved locally and marked as pending. Real online submission requires a backend.",
            "success",
            form
        );


        return {
            success: true,
            submission: submission
        };
    }


    /* =====================================================
       SUBMIT CONTACT
    ====================================================== */

    function submitContact(
        form
    ) {

        if (!form) {
            return {
                success: false,
                message: "Contact form not found."
            };
        }

        const error =
            validateContact(
                form
            );

        if (error) {

            showStatus(
                error,
                "error",
                form
            );

            return {
                success: false,
                message: error
            };
        }


        const formData =
            collectFormData(form);

        const submission =
            createSubmission(
                "contact",
                formData
            );


        saveSubmission(
            "contact",
            submission
        );

        logSubmission(
            submission
        );

        STATE.lastSubmission =
            submission;


        /*
         * Contact draft can be removed
         * after successful local save.
         */

        removeStorage(
            CONFIG.storage
                .contactDraft
        );


        showStatus(
            "Message saved locally. Real email delivery requires a backend or email service.",
            "success",
            form
        );


        return {
            success: true,
            submission: submission
        };
    }


    /* =====================================================
       SUBMIT ARTICLE
    ====================================================== */

    function submitArticle(
        form
    ) {

        if (!form) {
            return {
                success: false,
                message: "Article form not found."
            };
        }

        const error =
            validateArticle(
                form
            );

        if (error) {

            showStatus(
                error,
                "error",
                form
            );

            return {
                success: false,
                message: error
            };
        }


        const formData =
            collectFormData(form);

        const submission =
            createSubmission(
                "article",
                formData
            );


        saveSubmission(
            "article",
            submission
        );

        logSubmission(
            submission
        );

        STATE.lastSubmission =
            submission;


        showStatus(
            "Article saved locally and marked as pending.",
            "success",
            form
        );


        return {
            success: true,
            submission: submission
        };
    }


    /* =====================================================
       GENERIC SUBMIT
    ====================================================== */

    function submitForm(
        form,
        type
    ) {

        if (!form) {
            return {
                success: false,
                message: "Form not found."
            };
        }

        const submissionType =
            cleanText(
                type ||
                form.dataset.submitType ||
                "general"
            ).toLowerCase();


        if (
            submissionType ===
            "contribution"
        ) {
            return submitContribution(
                form
            );
        }


        if (
            submissionType ===
            "contact"
        ) {
            return submitContact(
                form
            );
        }


        if (
            submissionType ===
            "article"
        ) {
            return submitArticle(
                form
            );
        }


        const formData =
            collectFormData(form);

        const submission =
            createSubmission(
                submissionType,
                formData
            );

        saveSubmission(
            submissionType,
            submission
        );

        logSubmission(
            submission
        );

        STATE.lastSubmission =
            submission;


        showStatus(
            "Form data saved locally.",
            "success",
            form
        );


        return {
            success: true,
            submission: submission
        };
    }


    /* =====================================================
       FORM SUBMIT HANDLER
    ====================================================== */

    function handleSubmit(
        event
    ) {

        const form =
            event.target;

        if (
            !form ||
            form.tagName !== "FORM"
        ) {
            return;
        }

        const type =
            form.dataset.submitType ||
            form.dataset.formType ||
            "";


        /*
         * Only take control of forms
         * explicitly marked for this engine.
         */

        if (!type) {
            return;
        }


        event.preventDefault();

        if (STATE.submitting) {
            return;
        }

        STATE.submitting = true;


        try {

            submitForm(
                form,
                type
            );

        } finally {

            STATE.submitting = false;
        }
    }


    /* =====================================================
       FORM DISCOVERY
    ====================================================== */

    function bindForms() {

        $$(
            "form[data-submit-type], form[data-form-type]"
        ).forEach(
            function (form) {

                if (
                    form.dataset.submitEngineBound ===
                    "true"
                ) {
                    return;
                }

                form.addEventListener(
                    "submit",
                    handleSubmit
                );

                form.dataset.submitEngineBound =
                    "true";
            }
        );
    }


    /* =====================================================
       FILE VALIDATION HELPER
    ====================================================== */

    function validateFiles(
        files,
        options
    ) {

        const settings =
            options || {};

        const maxSize =
            Number(
                settings.maxSize ||
                50 * 1024 * 1024
            );

        const allowedTypes =
            Array.isArray(
                settings.allowedTypes
            )
                ? settings.allowedTypes
                : [];


        const fileList =
            Array.from(
                files || []
            );


        for (
            const file
            of fileList
        ) {

            if (
                file.size >
                maxSize
            ) {

                return {
                    valid: false,
                    message:
                        `${file.name} is larger than the allowed size.`
                };
            }


            if (
                allowedTypes.length &&
                !allowedTypes.includes(
                    file.type
                )
            ) {

                return {
                    valid: false,
                    message:
                        `${file.name} has an unsupported file type.`
                };
            }
        }


        return {
            valid: true,
            message: ""
        };
    }


    /* =====================================================
       CLEAR FORM
    ====================================================== */

    function clearForm(
        form
    ) {

        if (!form) {
            return;
        }

        try {
            form.reset();
        } catch (error) {
            /* Ignore reset errors */
        }

        showStatus(
            "",
            "info",
            form
        );
    }


    /* =====================================================
       GET STORED SUBMISSIONS
    ====================================================== */

    function getSubmissions(
        type
    ) {

        let key =
            CONFIG.storage.submitLog;

        if (
            type === "contribution"
        ) {

            key =
                CONFIG.storage
                    .contributionList;

        } else if (
            type === "contact"
        ) {

            key =
                CONFIG.storage
                    .contacts;

        } else if (
            type === "article"
        ) {

            key =
                CONFIG.storage
                    .articles;
        }


        const data =
            getStorage(
                key,
                []
            );

        return Array.isArray(data)
            ? data
            : [];
    }


    /* =====================================================
       DELETE LOCAL SUBMISSION
    ====================================================== */

    function deleteSubmission(
        type,
        id
    ) {

        if (!type || !id) {
            return false;
        }

        const list =
            getSubmissions(type);

        const filtered =
            list.filter(
                function (item) {
                    return item.id !== id;
                }
            );


        let key =
            CONFIG.storage.submitLog;

        if (
            type === "contribution"
        ) {

            key =
                CONFIG.storage
                    .contributionList;

        } else if (
            type === "contact"
        ) {

            key =
                CONFIG.storage
                    .contacts;

        } else if (
            type === "article"
        ) {

            key =
                CONFIG.storage
                    .articles;
        }


        return setStorage(
            key,
            filtered
        );
    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    function initialize() {

        if (STATE.initialized) {
            return;
        }

        bindForms();

        STATE.initialized =
            true;


        document.dispatchEvent(
            new CustomEvent(
                "alon:submit-ready"
            )
        );
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const SUBMIT_ENGINE = {

        config: CONFIG,

        state: STATE,

        initialize,

        submit:
            submitForm,

        submitContribution,

        submitContact,

        submitArticle,

        validateContribution,

        validateContact,

        validateArticle,

        validateFiles,

        collectFormData,

        getSubmissions,

        deleteSubmission,

        clearForm,

        showStatus
    };


    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_SUBMIT =
        SUBMIT_ENGINE;

    window.ALON_SUBMIT_ENGINE =
        SUBMIT_ENGINE;


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