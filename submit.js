/* =========================================================
   ALON HISTORYVERSE 24
   VERSION: V100
   FILE: jss/submit.js

   MASTER SUBMIT ENGINE
   ---------------------------------------------------------
   Combines:
   - Article submission
   - Contributor submission
   - Form handling
   - Validation bridge
   - Copyright / permission checks
   - Image upload
   - Firebase submission
   - Local fallback
   - Draft support
   - Submission status
   - Preview
   - Reset
   - Notifications
   - Accessibility
========================================================= */


/* =========================================================
   01. SUBMIT STATE
========================================================= */

const SubmitEngine = {

    version: "V100",

    initialized: false,

    submitting: false,

    currentForm: null,

    currentSubmission: null,

    draft: null,

    preview: false,

    errors: [],

    success: false

};


/* =========================================================
   02. SAFE TEXT
========================================================= */

function submitText(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }

    return String(value).trim();

}


/* =========================================================
   03. PLATFORM BRIDGE
========================================================= */

function submitPlatform() {

    return window.HistoryVersePlatform || null;

}


/* =========================================================
   04. FIREBASE BRIDGE
========================================================= */

function submitFirebase() {

    return window.HistoryVerseFirebase || null;

}


/* =========================================================
   05. ENGINE BRIDGE
========================================================= */

function submitCoreEngine() {

    return window.HistoryVerseEngine || null;

}


/* =========================================================
   06. CREATE LOCAL ID
========================================================= */

function createSubmitId() {

    return (
        "submission-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


/* =========================================================
   07. FORM TO DATA
========================================================= */

function formToSubmitData(form) {

    if (!form) {

        return {};

    }


    const formData =
        new FormData(form);


    const data = {};


    formData.forEach(
        (
            value,
            key
        ) => {

            if (
                typeof value ===
                "string"
            ) {

                data[key] =
                    submitText(value);

            } else {

                data[key] =
                    value;

            }

        }
    );


    const permission =
        form.querySelector(
            "[name='permissionConfirmed']"
        );


    if (permission) {

        data.permissionConfirmed =
            permission.checked;

    }


    const agreement =
        form.querySelector(
            "[name='agreement']"
        );


    if (agreement) {

        data.agreementAccepted =
            agreement.checked;

    }


    return data;

}


/* =========================================================
   08. NORMALIZE SUBMISSION
========================================================= */

function normalizeSubmission(data) {

    const result = {

        id:
            data.id ||
            createSubmitId(),

        title:
            submitText(
                data.title
            ),

        description:
            submitText(
                data.description
            ),

        content:
            submitText(
                data.content
            ),

        category:
            submitText(
                data.category
            ),

        country:
            submitText(
                data.country
            ),

        state:
            submitText(
                data.state
            ),

        civilization:
            submitText(
                data.civilization
            ),

        subject:
            submitText(
                data.subject
            ),

        year:
            submitText(
                data.year
            ),

        tags:
            normalizeTags(
                data.tags
            ),

        keywords:
            normalizeTags(
                data.keywords
            ),

        source:
            submitText(
                data.source ||
                data.sources
            ),

        sources:
            submitText(
                data.sources ||
                data.source
            ),

        license:
            submitText(
                data.license ||
                data.contentLicense
            ),

        contentLicense:
            submitText(
                data.contentLicense ||
                data.license
            ),

        image:
            data.image ||
            "",

        imageLicense:
            submitText(
                data.imageLicense
            ),

        permissionConfirmed:
            data.permissionConfirmed ===
            true,

        agreementAccepted:
            data.agreementAccepted ===
            true,

        status:
            data.status ||
            "pending",

        createdAt:
            data.createdAt ||
            new Date().toISOString()

    };


    return result;

}


/* =========================================================
   09. TAG NORMALIZER
========================================================= */

function normalizeTags(value) {

    if (
        Array.isArray(value)
    ) {

        return value
            .map(
                item =>
                    submitText(item)
            )
            .filter(Boolean);

    }


    if (!value) {

        return [];

    }


    return String(value)
        .split(",")
        .map(
            item =>
                submitText(item)
        )
        .filter(Boolean);

}


/* =========================================================
   10. VALIDATE FORM
========================================================= */

function validateSubmitData(data) {

    const platform =
        submitPlatform();


    if (
        platform &&
        typeof platform.validateSubmission ===
            "function"
    ) {

        return platform.validateSubmission(
            data
        );

    }


    const errors = [];


    if (
        submitText(data.title).length <
        3
    ) {

        errors.push(
            "Title must contain at least 3 characters."
        );

    }


    if (
        submitText(data.content).length <
        20
    ) {

        errors.push(
            "Content is too short."
        );

    }


    if (
        !submitText(data.category)
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


    return {

        valid:
            errors.length === 0,

        errors

    };

}


/* =========================================================
   11. COPYRIGHT CHECK
========================================================= */

function validateSubmitCopyright(data) {

    const platform =
        submitPlatform();


    if (
        platform &&
        typeof platform.validateCopyright ===
            "function"
    ) {

        return platform.validateCopyright(
            data
        );

    }


    return {

        valid: true,

        errors: []

    };

}


/* =========================================================
   12. DUPLICATE CHECK
========================================================= */

function checkSubmitDuplicate(data) {

    const platform =
        submitPlatform();


    if (
        platform &&
        typeof platform.isDuplicateSubmission ===
            "function"
    ) {

        return platform.isDuplicateSubmission(
            data
        );

    }


    return false;

}


/* =========================================================
   13. IMAGE UPLOAD
========================================================= */

async function uploadSubmissionImage(
    file
) {

    if (
        !file ||
        !(file instanceof File)
    ) {

        return "";

    }


    const firebase =
        submitFirebase();


    if (
        firebase &&
        typeof firebase.upload ===
            "function"
    ) {

        try {

            const result =
                await firebase.upload(
                    file,
                    "historyverse/submissions"
                );


            return result.url || "";

        } catch (error) {

            console.warn(
                "Submission image upload failed:",
                error
            );

        }

    }


    return "";

}


/* =========================================================
   14. PREPARE IMAGE
========================================================= */

async function prepareSubmissionImage(
    form,
    data
) {

    if (!form) {

        return data;

    }


    const input =
        form.querySelector(
            "input[type='file'][name='image'], input[type='file'][data-submit-image]"
        );


    if (
        !input ||
        !input.files ||
        !input.files.length
    ) {

        return data;

    }


    const file =
        input.files[0];


    const url =
        await uploadSubmissionImage(
            file
        );


    if (url) {

        data.image =
            url;

    }


    return data;

}


/* =========================================================
   15. LOCAL SUBMISSION FALLBACK
========================================================= */

function saveLocalSubmission(
    data
) {

    const key =
        "historyverse-submissions";


    let submissions = [];


    try {

        submissions =
            JSON.parse(
                localStorage.getItem(
                    key
                ) || "[]"
            );

    } catch (error) {

        submissions = [];

    }


    if (
        !Array.isArray(
            submissions
        )
    ) {

        submissions = [];

    }


    submissions.push(
        data
    );


    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                submissions
            )
        );

        return true;

    } catch (error) {

        return false;

    }

}


/* =========================================================
   16. FIREBASE SUBMISSION
========================================================= */

async function saveFirebaseSubmission(
    data
) {

    const firebase =
        submitFirebase();


    if (
        !firebase ||
        !firebase.isReady ||
        !firebase.isReady()
    ) {

        return null;

    }


    if (
        firebase.create
    ) {

        return firebase.create(
            "submissions",
            data
        );

    }


    return null;

}


/* =========================================================
   17. SUBMIT CONTENT
========================================================= */

async function submitContent(
    data,
    options = {}
) {

    if (
        SubmitEngine.submitting
    ) {

        return {

            success: false,

            errors: [
                "A submission is already being processed."
            ]

        };

    }


    SubmitEngine.submitting =
        true;


    SubmitEngine.errors =
        [];

    SubmitEngine.success =
        false;


    try {

        const normalized =
            normalizeSubmission(
                data
            );


        const validation =
            validateSubmitData(
                normalized
            );


        if (
            !validation.valid
        ) {

            SubmitEngine.errors =
                validation.errors;


            return {

                success: false,

                errors:
                    validation.errors

            };

        }


        const copyright =
            validateSubmitCopyright(
                normalized
            );


        if (
            !copyright.valid
        ) {

            SubmitEngine.errors =
                copyright.errors;


            return {

                success: false,

                errors:
                    copyright.errors

            };

        }


        if (
            checkSubmitDuplicate(
                normalized
            )
        ) {

            const errors = [

                "Duplicate content detected."

            ];


            SubmitEngine.errors =
                errors;


            return {

                success: false,

                errors

            };

        }


        normalized.status =
            options.status ||
            "pending";


        let saved =
            false;


        /*
         * Primary platform submission.
         */

        const platform =
            submitPlatform();


        if (
            platform &&
            typeof platform.createSubmission ===
                "function"
        ) {

            const result =
                platform.createSubmission(
                    normalized
                );


            if (
                result &&
                result.success
            ) {

                SubmitEngine
                    .currentSubmission =
                    result.submission;

                saved = true;

            }

        }


        /*
         * Firebase direct fallback.
         */

        if (
            !saved
        ) {

            const firebaseId =
                await saveFirebaseSubmission(
                    normalized
                );


            if (firebaseId) {

                normalized.id =
                    firebaseId;

                saved = true;

            }

        }


        /*
         * Local fallback.
         */

        if (
            !saved
        ) {

            saved =
                saveLocalSubmission(
                    normalized
                );

        }


        if (!saved) {

            return {

                success: false,

                errors: [
                    "Unable to save submission."
                ]

            };

        }


        SubmitEngine
            .currentSubmission =
            normalized;


        SubmitEngine.success =
            true;


        showSubmitMessage(
            "Your submission has been sent for review.",
            "success"
        );


        document.dispatchEvent(
            new CustomEvent(
                "historyverse:submit-success",
                {
                    detail:
                        normalized
                }
            )
        );


        return {

            success: true,

            submission:
                normalized

        };

    } catch (error) {

        console.error(
            "HistoryVerse submission failed:",
            error
        );


        SubmitEngine.errors = [

            error.message ||
            "Submission failed."

        ];


        showSubmitMessage(
            SubmitEngine.errors[0],
            "error"
        );


        return {

            success: false,

            errors:
                SubmitEngine.errors

        };

    } finally {

        SubmitEngine.submitting =
            false;

    }

}


/* =========================================================
   18. FORM SUBMIT
========================================================= */

async function handleSubmitForm(
    form
) {

    if (!form) {

        return false;

    }


    SubmitEngine.currentForm =
        form;


    const data =
        formToSubmitData(
            form
        );


    const agreement =
        form.querySelector(
            "[name='agreement']"
        );


    if (
        agreement &&
        !agreement.checked
    ) {

        showSubmitMessage(
            "Please accept the contributor agreement.",
            "warning"
        );


        return false;

    }


    if (
        agreement &&
        agreement.checked
    ) {

        const platform =
            submitPlatform();


        if (
            platform &&
            typeof platform.acceptContributorAgreement ===
                "function"
        ) {

            platform.acceptContributorAgreement(
                "V100"
            );

        }

    }


    const permission =
        form.querySelector(
            "[name='permissionConfirmed']"
        );


    if (
        permission &&
        !permission.checked
    ) {

        showSubmitMessage(
            "Please confirm that you have permission to submit this content.",
            "warning"
        );


        return false;

    }


    await prepareSubmissionImage(
        form,
        data
    );


    setSubmitLoading(
        form,
        true
    );


    const result =
        await submitContent(
            data
        );


    setSubmitLoading(
        form,
        false
    );


    if (
        result.success
    ) {

        resetSubmitForm(
            form
        );

        clearSubmitDraft();

    }


    return result.success;

}


/* =========================================================
   19. LOADING STATE
========================================================= */

function setSubmitLoading(
    form,
    loading
) {

    if (!form) {

        return;

    }


    form
        .querySelectorAll(
            "button[type='submit'], input[type='submit']"
        )
        .forEach(
            button => {

                button.disabled =
                    loading;


                if (
                    loading
                ) {

                    button.dataset
                        .submitOriginalText =
                        button.textContent;

                    button.textContent =
                        "Submitting...";

                } else if (
                    button.dataset
                        .submitOriginalText
                ) {

                    button.textContent =
                        button.dataset
                            .submitOriginalText;

                }

            }
        );


    form
        .setAttribute(
            "aria-busy",
            loading
                ? "true"
                : "false"
        );

}


/* =========================================================
   20. RESET FORM
========================================================= */

function resetSubmitForm(
    form
) {

    if (!form) {

        return;

    }


    form.reset();


    form
        .querySelectorAll(
            "[data-submit-preview]"
        )
        .forEach(
            preview => {

                preview.innerHTML =
                    "";

                preview.hidden =
                    true;

            }
        );


    SubmitEngine.preview =
        false;


    return true;

}


/* =========================================================
   21. DRAFT STORAGE
========================================================= */

const SUBMIT_DRAFT_KEY =
    "historyverse-submit-draft";


function saveSubmitDraft(
    data
) {

    try {

        localStorage.setItem(
            SUBMIT_DRAFT_KEY,
            JSON.stringify(
                data
            )
        );


        SubmitEngine.draft =
            data;


        return true;

    } catch (error) {

        return false;

    }

}


function loadSubmitDraft() {

    try {

        const draft =
            JSON.parse(
                localStorage.getItem(
                    SUBMIT_DRAFT_KEY
                ) || "null"
            );


        SubmitEngine.draft =
            draft;


        return draft;

    } catch (error) {

        return null;

    }

}


function clearSubmitDraft() {

    try {

        localStorage.removeItem(
            SUBMIT_DRAFT_KEY
        );

    } catch (error) {

        /* Safe fallback */

    }


    SubmitEngine.draft =
        null;


    return true;

}


/* =========================================================
   22. AUTO DRAFT
========================================================= */

function setupAutoDraft(
    form
) {

    if (!form) {

        return;

    }


    let timer = null;


    form.addEventListener(
        "input",
        () => {

            window.clearTimeout(
                timer
            );


            timer =
                window.setTimeout(
                    () => {

                        saveSubmitDraft(
                            formToSubmitData(
                                form
                            )
                        );

                    },
                    800
                );

        }
    );

}


/* =========================================================
   23. RESTORE DRAFT
========================================================= */

function restoreDraftToForm(
    form
) {

    const draft =
        loadSubmitDraft();


    if (
        !draft ||
        !form
    ) {

        return false;

    }


    Object.keys(
        draft
    )
        .forEach(
            key => {

                const field =
                    form.querySelector(
                        `[name="${key}"]`
                    );


                if (!field) {

                    return;

                }


                if (
                    field.type ===
                    "checkbox"
                ) {

                    field.checked =
                        draft[key] ===
                        true;

                } else if (
                    field.type !==
                    "file"
                ) {

                    field.value =
                        Array.isArray(
                            draft[key]
                        )

                            ? draft[key]
                                .join(", ")

                            : draft[key];

                }

            }
        );


    return true;

}


/* =========================================================
   24. PREVIEW
========================================================= */

function previewSubmission(
    form
) {

    if (!form) {

        return false;

    }


    const data =
        normalizeSubmission(
            formToSubmitData(
                form
            )
        );


    const preview =
        form.querySelector(
            "[data-submit-preview]"
        ) ||
        document.querySelector(
            "[data-submit-preview]"
        );


    if (!preview) {

        return false;

    }


    preview.hidden =
        false;


    preview.innerHTML = `

        <article
            class="submit-preview-card"
        >

            <h2>
                ${escapeSubmit(
                    data.title ||
                    "Untitled"
                )}
            </h2>

            ${
                data.category
                    ? `
                        <p>
                            <strong>
                                Category:
                            </strong>
                            ${escapeSubmit(data.category)}
                        </p>
                      `
                    : ""
            }

            ${
                data.year
                    ? `
                        <p>
                            <strong>
                                Year:
                            </strong>
                            ${escapeSubmit(data.year)}
                        </p>
                      `
                    : ""
            }

            ${
                data.description
                    ? `
                        <p>
                            ${escapeSubmit(data.description)}
                        </p>
                      `
                    : ""
            }

            <div
                class="submit-preview-content"
            >
                ${escapeSubmit(
                    data.content
                ).replace(
                    /\n/g,
                    "<br>"
                )}
            </div>

            ${
                data.source
                    ? `
                        <p>
                            <strong>
                                Source:
                            </strong>
                            ${escapeSubmit(data.source)}
                        </p>
                      `
                    : ""
            }

        </article>

    `;


    SubmitEngine.preview =
        true;


    return true;

}


/* =========================================================
   25. NOTIFICATION
========================================================= */

function showSubmitMessage(
    message,
    type = "info"
) {

    const platform =
        submitPlatform();


    if (
        platform &&
        typeof platform.notify ===
            "function"
    ) {

        platform.notify(
            message,
            type
        );


        return;

    }


    const container =
        document.querySelector(
            "[data-notifications]"
        );


    if (!container) {

        return;

    }


    const element =
        document.createElement(
            "div"
        );


    element.className =
        `historyverse-notification ${type}`;


    element.textContent =
        message;


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
   26. ESCAPE HTML
========================================================= */

function escapeSubmit(
    value
) {

    return submitText(
        value
    )

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
   27. SUBMIT EVENTS
========================================================= */

function setupSubmitEvents() {

    document.addEventListener(
        "submit",
        async event => {

            const form =
                event.target.closest(
                    "[data-history-submit], [data-submit-form]"
                );


            if (!form) {

                return;

            }


            event.preventDefault();


            await handleSubmitForm(
                form
            );

        }
    );


    document.addEventListener(
        "click",
        event => {

            const previewButton =
                event.target.closest(
                    "[data-submit-preview-button]"
                );


            if (previewButton) {

                const form =
                    previewButton.closest(
                        "form"
                    );


                if (form) {

                    previewSubmission(
                        form
                    );

                }

                return;

            }


            const resetButton =
                event.target.closest(
                    "[data-submit-reset]"
                );


            if (resetButton) {

                const form =
                    resetButton.closest(
                        "form"
                    );


                if (form) {

                    resetSubmitForm(
                        form
                    );

                }

                return;

            }


            const clearDraftButton =
                event.target.closest(
                    "[data-submit-clear-draft]"
                );


            if (
                clearDraftButton
            ) {

                clearSubmitDraft();


                const form =
                    clearDraftButton.closest(
                        "form"
                    );


                if (form) {

                    resetSubmitForm(
                        form
                    );

                }

            }

        }
    );

}


/* =========================================================
   28. FORM INITIALIZATION
========================================================= */

function initializeSubmitForms() {

    document
        .querySelectorAll(
            "[data-history-submit], [data-submit-form]"
        )
        .forEach(
            form => {

                setupAutoDraft(
                    form
                );

            }
        );

}


/* =========================================================
   29. ACCESSIBILITY
========================================================= */

function setupSubmitAccessibility() {

    document
        .querySelectorAll(
            "[data-submit-preview]"
        )
        .forEach(
            preview => {

                preview.setAttribute(
                    "aria-live",
                    "polite"
                );

            }
        );


    document
        .querySelectorAll(
            "textarea[name='content']"
        )
        .forEach(
            textarea => {

                if (
                    !textarea.getAttribute(
                        "aria-label"
                    )
                ) {

                    textarea.setAttribute(
                        "aria-label",
                        "Historical article content"
                    );

                }

            }
        );

}


/* =========================================================
   30. INITIALIZE
========================================================= */

function initializeSubmit() {

    if (
        SubmitEngine.initialized
    ) {

        return SubmitEngine;

    }


    setupSubmitEvents();

    initializeSubmitForms();

    setupSubmitAccessibility();


    SubmitEngine.initialized =
        true;


    document.dispatchEvent(
        new CustomEvent(
            "historyverse:submit-ready",
            {
                detail:
                    SubmitEngine
            }
        )
    );


    return SubmitEngine;

}


/* =========================================================
   31. PUBLIC API
========================================================= */

const HistoryVerseSubmit = {

    state:
        SubmitEngine,

    formToData:
        formToSubmitData,

    normalize:
        normalizeSubmission,

    validate:
        validateSubmitData,

    validateCopyright:
        validateSubmitCopyright,

    checkDuplicate:
        checkSubmitDuplicate,

    uploadImage:
        uploadSubmissionImage,

    submit:
        submitContent,

    handleForm:
        handleSubmitForm,

    reset:
        resetSubmitForm,

    saveDraft:
        saveSubmitDraft,

    loadDraft:
        loadSubmitDraft,

    clearDraft:
        clearSubmitDraft,

    restoreDraft:
        restoreDraftToForm,

    preview:
        previewSubmission,

    initialize:
        initializeSubmit

};


/* =========================================================
   32. GLOBAL API
========================================================= */

if (
    typeof window !== "undefined"
) {

    window.HistoryVerseSubmit =
        HistoryVerseSubmit;

}


/* =========================================================
   33. AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSubmit,
        {
            once: true
        }
    );

} else {

    initializeSubmit();

}


/* =========================================================
   END OF ALON HISTORYVERSE 24 V100
   MASTER SUBMIT ENGINE
========================================================= */