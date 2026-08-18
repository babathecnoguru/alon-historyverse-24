/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/subject-engine.js

   SUBJECT CHANNEL ENGINE
   VERSION: V100-FINAL

   FLOW:

       library.html
            ↓
       subject.html
            ↓
       subject-engine.js
            ↓
       book.html?subject=...

   Creator / Owner:
   Baba Thecno Guru
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const SUBJECT_ENGINE = {

    name:
        "ALON HISTORYVERSE 24",

    version:
        "V100-FINAL",

    storagePrefix:
        "alon_historyverse_subject"

};


/* =========================================================
   DOM HELPERS
========================================================= */

function subjectQuery(
    selector,
    root = document
) {

    try {

        return root.querySelector(
            selector
        );

    } catch (error) {

        console.warn(
            "Subject selector error:",
            selector,
            error
        );

        return null;

    }

}


function subjectQueryAll(
    selector,
    root = document
) {

    try {

        return Array.from(
            root.querySelectorAll(
                selector
            )
        );

    } catch (error) {

        console.warn(
            "Subject selector error:",
            selector,
            error
        );

        return [];

    }

}


/* =========================================================
   NOTIFICATION
========================================================= */

function subjectNotify(
    message,
    type = "info"
) {

    const box =
        subjectQuery(
            "#notifications"
        );

    if (!box) {

        return;

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "subject-notification " +
        "subject-notification-" +
        type;


    item.textContent =
        message;


    box.appendChild(
        item
    );


    window.setTimeout(
        () => {

            item.remove();

        },
        3000
    );

}


/* =========================================================
   URL STATE
========================================================= */

function getSubjectURLState() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        department:
            (
                params.get(
                    "department"
                ) || ""
            )
            .trim()
            .toLowerCase(),

        subject:
            (
                params.get(
                    "subject"
                ) || ""
            )
            .trim()
            .toLowerCase(),

        search:
            (
                params.get(
                    "search"
                ) || ""
            )
            .trim()

    };

}


/* =========================================================
   SUBJECT CONTEXT
========================================================= */

function updateSubjectContext(
    state
) {

    const context =
        subjectQuery(
            "#subject-context"
        );


    if (!context) {

        return;

    }


    if (state.subject) {

        context.textContent =
            "Selected subject: " +
            formatSubjectName(
                state.subject
            );

        return;

    }


    if (state.department) {

        context.textContent =
            "Department: " +
            formatSubjectName(
                state.department
            ) +
            " • Showing related subjects.";

        return;

    }


    context.textContent =
        "Showing all Library subjects.";

}


/* =========================================================
   NAME FORMATTER
========================================================= */

function formatSubjectName(
    value
) {

    return String(
        value || ""
    )
    .replace(
        /[-_]+/g,
        " "
    )
    .replace(
        /\b\w/g,
        letter =>
            letter.toUpperCase()
    );

}


/* =========================================================
   SEARCH
========================================================= */

function getSearchInput() {

    return subjectQuery(
        "#subject-search-input"
    );

}


function filterSubjects() {

    const input =
        getSearchInput();


    const cards =
        subjectQueryAll(
            "[data-subject-card]"
        );


    const empty =
        subjectQuery(
            "#subject-empty"
        );


    const query =
        String(
            input?.value || ""
        )
        .trim()
        .toLowerCase();


    let visible =
        0;


    cards.forEach(
        card => {

            const text =
                (
                    card.textContent
                    + " "
                    + (
                        card.getAttribute(
                            "data-subject"
                        ) || ""
                    )
                    + " "
                    + (
                        card.getAttribute(
                            "data-category"
                        ) || ""
                    )
                )
                .toLowerCase();


            const activeFilter =
                getActiveFilter();


            const category =
                (
                    card.getAttribute(
                        "data-category"
                    ) || ""
                )
                .toLowerCase();


            const searchMatch =
                !query ||
                text.includes(
                    query
                );


            const filterMatch =
                activeFilter === "all" ||
                category === activeFilter;


            const visibleCard =
                searchMatch &&
                filterMatch;


            card.hidden =
                !visibleCard;


            if (visibleCard) {

                visible++;

            }

        }
    );


    if (empty) {

        empty.classList.toggle(
            "show",
            visible === 0
        );

    }


    updateCount(
        visible
    );


    saveSubjectState();

}


/* =========================================================
   ACTIVE FILTER
========================================================= */

function getActiveFilter() {

    const active =
        subjectQuery(
            "[data-subject-filter].active"
        );


    return (
        active?.getAttribute(
            "data-subject-filter"
        )
        || "all"
    );

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

function initializeFilters() {

    const filters =
        subjectQueryAll(
            "[data-subject-filter]"
        );


    if (
        filters.length === 0
    ) {

        return;

    }


    filters.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    filters.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    filterSubjects();

                }
            );

        }
    );

}


/* =========================================================
   SEARCH INITIALIZATION
========================================================= */

function initializeSearch() {

    const form =
        subjectQuery(
            "#subject-search-form"
        );


    const input =
        getSearchInput();


    if (!form || !input) {

        return;

    }


    const state =
        getSubjectURLState();


    if (state.search) {

        input.value =
            state.search;

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            filterSubjects();

            const query =
                input.value.trim();


            if (query) {

                subjectNotify(
                    "Searching subjects: " +
                    query,
                    "info"
                );

            }

        }
    );


    input.addEventListener(
        "input",
        () => {

            filterSubjects();

        }
    );

}


/* =========================================================
   SUBJECT CARD ROUTING
========================================================= */

function initializeSubjectCards() {

    const cards =
        subjectQueryAll(
            "[data-subject-card]"
        );


    cards.forEach(
        card => {

            card.addEventListener(
                "click",
                event => {

                    /*
                       Keep browser modifier-key
                       behavior intact.
                    */

                    if (
                        event.ctrlKey ||
                        event.metaKey ||
                        event.shiftKey ||
                        event.altKey
                    ) {

                        return;

                    }


                    const subject =
                        card.getAttribute(
                            "data-subject"
                        );


                    if (!subject) {

                        return;

                    }


                    event.preventDefault();


                    openBookForSubject(
                        subject
                    );

                }
            );

        }
    );

}


/* =========================================================
   OPEN BOOK FOR SUBJECT
========================================================= */

function openBookForSubject(
    subject
) {

    const clean =
        String(
            subject || ""
        )
        .trim()
        .toLowerCase();


    if (!clean) {

        subjectNotify(
            "Subject is unavailable.",
            "warning"
        );

        return false;

    }


    try {

        sessionStorage.setItem(
            `${SUBJECT_ENGINE.storagePrefix}_last_subject`,
            clean
        );

    } catch (error) {

        console.warn(
            "Subject storage unavailable:",
            error
        );

    }


    const url =
        new URL(
            "book.html",
            window.location.href
        );


    url.searchParams.set(
        "subject",
        clean
    );


    window.location.href =
        url.href;


    return true;

}


/* =========================================================
   DEPARTMENT FILTER
========================================================= */

function applyDepartmentContext() {

    const state =
        getSubjectURLState();


    if (!state.department) {

        return;

    }


    /*
       The subject cards remain available.
       Department is treated as context until
       department-specific subject data is expanded.
    */

    updateSubjectContext(
        state
    );

}


/* =========================================================
   SUBJECT SELECTED STATE
========================================================= */

function applySelectedSubject() {

    const state =
        getSubjectURLState();


    if (!state.subject) {

        return;

    }


    const cards =
        subjectQueryAll(
            "[data-subject-card]"
        );


    cards.forEach(
        card => {

            const value =
                (
                    card.getAttribute(
                        "data-subject"
                    ) || ""
                )
                .toLowerCase();


            if (
                value === state.subject
            ) {

                card.setAttribute(
                    "data-selected",
                    "true"
                );

            }

        }
    );

}


/* =========================================================
   STATE STORAGE
========================================================= */

function saveSubjectState() {

    const input =
        getSearchInput();


    const state = {

        search:
            input?.value.trim()
            || "",

        filter:
            getActiveFilter(),

        timestamp:
            Date.now()

    };


    try {

        sessionStorage.setItem(
            `${SUBJECT_ENGINE.storagePrefix}_state`,
            JSON.stringify(
                state
            )
        );

    } catch (error) {

        console.warn(
            "Unable to save Subject state:",
            error
        );

    }

}


/* =========================================================
   RESTORE STATE
========================================================= */

function restoreSubjectState() {

    let state = null;


    try {

        const raw =
            sessionStorage.getItem(
                `${SUBJECT_ENGINE.storagePrefix}_state`
            );


        if (raw) {

            state =
                JSON.parse(
                    raw
                );

            }

    } catch (error) {

        console.warn(
            "Unable to restore Subject state:",
            error
        );

    }


    if (!state) {

        return;

    }


    const input =
        getSearchInput();


    if (
        input &&
        !input.value &&
        state.search
    ) {

        input.value =
            state.search;

    }


    if (state.filter) {

        const filterButton =
            subjectQuery(
                `[data-subject-filter="${CSS.escape(state.filter)}"]`
            );


        if (filterButton) {

            subjectQueryAll(
                "[data-subject-filter]"
            )
            .forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            filterButton.classList.add(
                "active"
            );

        }

    }

}


/* =========================================================
   COUNT
========================================================= */

function updateCount(
    count
) {

    const status =
        subjectQuery(
            "#subject-status"
        );


    if (!status) {

        return;

    }


    status.innerHTML =
        "Subject Channel: Ready • " +
        "Showing <span class=\"subject-count\">" +
        String(count) +
        "</span> subjects • Version: " +
        SUBJECT_ENGINE.version;

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    const button =
        subjectQuery(
            "[data-subject-menu-toggle]"
        );


    const menu =
        subjectQuery(
            "#subject-mobile-menu"
        );


    if (!button || !menu) {

        return;

    }


    const closeButton =
        subjectQuery(
            "[data-subject-menu-close]",
            menu
        );


    button.addEventListener(
        "click",
        () => {

            const open =
                menu.hidden === false;


            menu.hidden =
                open;


            button.setAttribute(
                "aria-expanded",
                String(!open)
            );

        }
    );


    closeButton?.addEventListener(
        "click",
        () => {

            menu.hidden =
                true;


            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }
    );


    subjectQueryAll(
        "a",
        menu
    ).forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    menu.hidden =
                        true;


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        }
    );

}


/* =========================================================
   LANGUAGE BUTTON
========================================================= */

function initializeLanguageButton() {

    const button =
        subjectQuery(
            "#subjectLanguageBtn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            /*
               If the global language engine exists,
               use it.

               Otherwise do not crash the page.
            */

            try {

                if (
                    typeof window
                        .ALON_HISTORYVERSE
                        ?.Language
                        ?.toggle ===
                    "function"
                ) {

                    window
                        .ALON_HISTORYVERSE
                        .Language
                        .toggle();

                    return;

                }

            } catch (error) {

                console.warn(
                    "Global language bridge unavailable:",
                    error
                );

            }


            subjectNotify(
                "Language system is available from the main ALON language engine.",
                "info"
            );

        }
    );

}


/* =========================================================
   YEAR
========================================================= */

function initializeYear() {

    subjectQueryAll(
        "[data-year]"
    )
    .forEach(
        element => {

            element.textContent =
                String(
                    new Date()
                        .getFullYear()
                );

        }
    );

}


/* =========================================================
   HEALTH
========================================================= */

function subjectHealth() {

    return {

        name:
            SUBJECT_ENGINE.name,

        version:
            SUBJECT_ENGINE.version,

        page:
            "subject",

        status:
            "ready",

        timestamp:
            Date.now()

    };

}


/* =========================================================
   PUBLIC API
========================================================= */

const SubjectAPI = {

    version:
        SUBJECT_ENGINE.version,

    health:
        subjectHealth,

    search:
        filterSubjects,

    openBook:
        openBookForSubject

};


/* =========================================================
   GLOBAL EXPORT
========================================================= */

try {

    window.ALON_HISTORYVERSE =
        window.ALON_HISTORYVERSE
        || {};


    window.ALON_HISTORYVERSE.Subject =
        SubjectAPI;

} catch (error) {

    console.warn(
        "Subject API export failed:",
        error
    );

}


/* =========================================================
   MAIN INITIALIZER
========================================================= */

function initializeSubjectEngine() {

    if (
        document.body?.getAttribute(
            "data-page"
        ) !==
        "library-subject"
    ) {

        return;

    }


    try {

        initializeYear();

        initializeMobileMenu();

        initializeLanguageButton();

        restoreSubjectState();

        initializeFilters();

        initializeSearch();

        initializeSubjectCards();

        applyDepartmentContext();

        applySelectedSubject();

        filterSubjects();


        document.documentElement.setAttribute(
            "data-subject-engine",
            "ready"
        );


        const status =
            subjectQuery(
                "#subject-status"
            );


        if (status) {

            const count =
                subjectQueryAll(
                    "[data-subject-card]"
                )
                .filter(
                    card =>
                        !card.hidden
                )
                .length;


            status.innerHTML =
                "Subject Channel: Ready • " +
                "Showing <span class=\"subject-count\">" +
                String(count) +
                "</span> subjects • Version: " +
                SUBJECT_ENGINE.version;

        }


        window.dispatchEvent(
            new CustomEvent(
                "alon:subject-ready",
                {
                    detail:
                        subjectHealth()
                }
            )
        );


        console.info(
            "ALON HISTORYVERSE 24 Subject Engine:",
            SUBJECT_ENGINE.version,
            "READY"
        );

    } catch (error) {

        console.error(
            "Subject Engine initialization error:",
            error
        );


        document.documentElement.setAttribute(
            "data-subject-engine",
            "error"
        );


        const status =
            subjectQuery(
                "#subject-status"
            );


        if (status) {

            status.textContent =
                "Subject Channel: Initialization error.";

        }

    }

}


/* =========================================================
   DOM START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSubjectEngine,
        {
            once: true
        }
    );

} else {

    initializeSubjectEngine();

}


/* =========================================================
   EXPORT
========================================================= */

export {

    SUBJECT_ENGINE,

    SubjectAPI,

    subjectHealth,

    filterSubjects,

    openBookForSubject,

    initializeSubjectEngine

};


/* =========================================================
   END
========================================================= */