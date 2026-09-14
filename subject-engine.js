/* =========================================================
   ALON HISTORYVERSE 24
   SUBJECT ENGINE
   Version: 24.0
   Creator: Baba Thecno Guru

   Purpose:
   Library → Department → Subject

   Data Source:
   ../json/library.json

   URL Examples:
   subject.html?department=mathematics
   subject.html?department=computer
   subject.html?department=history-civilizations
   subject.html?department=countries-world

   This file does NOT modify root index.html.
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       CONFIGURATION
    ====================================================== */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        version: "24.0",

        dataUrl: "../json/library.json",

        cacheKey: "alon_historyverse_library_cache",
        positionKey: "alon_historyverse_subject_position",

        pageName: "subject.html",

        paths: {
            home: "../index.html",
            library: "./library.html",
            department: "./department.html",
            subject: "./subject.html",
            book: "./book.html",
            read: "./read.html"
        }
    };


    /* =====================================================
       STATE
    ====================================================== */

    const STATE = {
        data: null,
        departments: [],
        currentDepartment: null,
        subjects: [],
        filteredSubjects: [],
        initialized: false,
        loading: false,
        error: null
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

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalize(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase();
    }

    function slugify(value) {
        return String(value ?? "")
            .trim()
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }


    /* =====================================================
       URL HELPERS
    ====================================================== */

    function getQueryValue(name) {
        try {
            const params = new URLSearchParams(
                window.location.search
            );

            return params.get(name) || "";
        } catch (error) {
            return "";
        }
    }

    function getDepartmentQuery() {
        return (
            getQueryValue("department") ||
            getQueryValue("dept") ||
            getQueryValue("id") ||
            ""
        );
    }


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function openPage(path) {
        if (!path) return;

        window.location.href = path;
    }

    function openDepartment(departmentId) {
        if (!departmentId) return;

        openPage(
            `${CONFIG.paths.department}?department=${encodeURIComponent(
                departmentId
            )}`
        );
    }

    function openSubject(subjectId, departmentId) {
        if (!subjectId) return;

        let url =
            `${CONFIG.paths.book}?subject=${encodeURIComponent(
                subjectId
            )}`;

        if (departmentId) {
            url +=
                `&department=${encodeURIComponent(
                    departmentId
                )}`;
        }

        openPage(url);
    }

    function openLibrary() {
        openPage(CONFIG.paths.library);
    }

    function openHome() {
        openPage(CONFIG.paths.home);
    }


    /* =====================================================
       STORAGE
    ====================================================== */

    function getStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function setStorage(key, value) {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }


    /* =====================================================
       DATA NORMALIZATION
    ====================================================== */

    function normalizeDepartments(data) {
        if (!data) return [];

        if (Array.isArray(data)) {
            return data;
        }

        if (Array.isArray(data.departments)) {
            return data.departments;
        }

        if (
            data.library &&
            Array.isArray(data.library.departments)
        ) {
            return data.library.departments;
        }

        if (
            data.data &&
            Array.isArray(data.data.departments)
        ) {
            return data.data.departments;
        }

        return [];
    }

    function normalizeSubjects(department) {
        if (!department) return [];

        if (Array.isArray(department.subjects)) {
            return department.subjects;
        }

        if (
            department.data &&
            Array.isArray(department.data.subjects)
        ) {
            return department.data.subjects;
        }

        return [];
    }


    /* =====================================================
       DATA LOADING
    ====================================================== */

    async function loadLibraryData() {
        if (STATE.loading) {
            return STATE.data;
        }

        STATE.loading = true;
        STATE.error = null;

        try {
            const response = await fetch(
                CONFIG.dataUrl,
                {
                    cache: "no-store"
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Library data HTTP ${response.status}`
                );
            }

            const data = await response.json();

            STATE.data = data;
            STATE.departments =
                normalizeDepartments(data);

            try {
                setStorage(
                    CONFIG.cacheKey,
                    JSON.stringify(data)
                );
            } catch (error) {
                /* Ignore cache failure */
            }

            STATE.loading = false;

            return data;

        } catch (error) {

            STATE.error = error;

            /*
             * Try cached data if network/file loading fails.
             */

            try {
                const cached =
                    getStorage(CONFIG.cacheKey);

                if (cached) {
                    const parsed =
                        JSON.parse(cached);

                    STATE.data = parsed;
                    STATE.departments =
                        normalizeDepartments(parsed);

                    STATE.loading = false;

                    return parsed;
                }

            } catch (cacheError) {
                /* Ignore cache error */
            }

            STATE.loading = false;

            throw error;
        }
    }


    /* =====================================================
       DEPARTMENT FINDER
    ====================================================== */

    function findDepartment(query) {
        const target = normalize(query);

        if (!target) return null;

        return (
            STATE.departments.find(function (department) {

                const id =
                    normalize(
                        department.id ||
                        department.slug ||
                        ""
                    );

                const name =
                    normalize(
                        department.name ||
                        department.title ||
                        ""
                    );

                const departmentId =
                    normalize(
                        department.departmentId ||
                        ""
                    );

                return (
                    id === target ||
                    name === target ||
                    departmentId === target ||
                    slugify(name) === target
                );

            }) || null
        );
    }


    /* =====================================================
       SUBJECT HELPERS
    ====================================================== */

    function getSubjectId(subject) {
        return (
            subject.id ||
            subject.subjectId ||
            subject.slug ||
            slugify(
                subject.name ||
                subject.title ||
                "subject"
            )
        );
    }

    function getSubjectName(subject) {
        return (
            subject.name ||
            subject.title ||
            subject.subject ||
            "Untitled Subject"
        );
    }

    function getSubjectDescription(subject) {
        return (
            subject.description ||
            subject.summary ||
            subject.about ||
            ""
        );
    }

    function getSubjectBooks(subject) {
        if (Array.isArray(subject.books)) {
            return subject.books;
        }

        if (
            subject.data &&
            Array.isArray(subject.data.books)
        ) {
            return subject.data.books;
        }

        return [];
    }


    /* =====================================================
       SUBJECT SELECTION
    ====================================================== */

    function selectCurrentDepartment() {

        const query =
            getDepartmentQuery();

        if (!query) {
            STATE.currentDepartment = null;
            STATE.subjects = [];
            return null;
        }

        const department =
            findDepartment(query);

        STATE.currentDepartment =
            department;

        STATE.subjects =
            normalizeSubjects(department);

        STATE.filteredSubjects =
            STATE.subjects.slice();

        return department;
    }


    /* =====================================================
       SEARCH
    ====================================================== */

    function searchSubjects(query) {

        const term =
            normalize(query);

        if (!term) {
            STATE.filteredSubjects =
                STATE.subjects.slice();

            renderSubjects();

            return;
        }

        STATE.filteredSubjects =
            STATE.subjects.filter(
                function (subject) {

                    const searchable = [
                        getSubjectId(subject),
                        getSubjectName(subject),
                        getSubjectDescription(subject),
                        subject.category,
                        subject.level,
                        subject.author
                    ]
                        .map(normalize)
                        .join(" ");

                    return searchable.includes(term);
                }
            );

        renderSubjects();
    }


    /* =====================================================
       SUBJECT CARD
    ====================================================== */

    function createSubjectCard(
        subject,
        departmentId
    ) {

        const id =
            getSubjectId(subject);

        const name =
            getSubjectName(subject);

        const description =
            getSubjectDescription(subject);

        const books =
            getSubjectBooks(subject);

        const bookCount =
            books.length;

        const category =
            subject.category ||
            "Knowledge";

        const level =
            subject.level ||
            "";

        return `
            <article
                class="ah-subject-card"
                data-subject-card
                data-subject-id="${escapeHTML(id)}"
                tabindex="0"
                role="button"
                aria-label="Open ${escapeHTML(name)}"
            >

                <div class="ah-subject-icon">
                    📚
                </div>

                <div class="ah-subject-content">

                    <h3>
                        ${escapeHTML(name)}
                    </h3>

                    ${
                        description
                            ? `
                                <p>
                                    ${escapeHTML(
                                        description
                                    )}
                                </p>
                            `
                            : ""
                    }

                    <div class="ah-subject-meta">

                        <span>
                            ${escapeHTML(category)}
                        </span>

                        ${
                            level
                                ? `
                                    <span>
                                        ${escapeHTML(level)}
                                    </span>
                                `
                                : ""
                        }

                        <span>
                            ${bookCount}
                            ${
                                bookCount === 1
                                    ? " Book"
                                    : " Books"
                            }
                        </span>

                    </div>

                </div>

                <div class="ah-subject-arrow">
                    →
                </div>

            </article>
        `;
    }


    /* =====================================================
       RENDER SUBJECTS
    ====================================================== */

    function renderSubjects() {

        const container =
            $(
                "#subjectsContainer"
            ) ||
            $(
                "#subjectContainer"
            ) ||
            $(
                "[data-subjects]"
            ) ||
            $(
                ".subjects-grid"
            );

        if (!container) {
            return;
        }

        if (!STATE.currentDepartment) {

            container.innerHTML = `
                <div class="ah-empty-state">
                    <div>📚</div>
                    <h3>Department Not Selected</h3>
                    <p>
                        Please select a department
                        from the Library.
                    </p>
                    <button
                        type="button"
                        data-open-library
                    >
                        Open Library
                    </button>
                </div>
            `;

            return;
        }

        if (!STATE.filteredSubjects.length) {

            container.innerHTML = `
                <div class="ah-empty-state">
                    <div>🔎</div>
                    <h3>No Subjects Found</h3>
                    <p>
                        No subjects match your
                        current search.
                    </p>
                </div>
            `;

            return;
        }

        const departmentId =
            STATE.currentDepartment.id ||
            STATE.currentDepartment.slug ||
            slugify(
                STATE.currentDepartment.name ||
                ""
            );

        container.innerHTML =
            STATE.filteredSubjects
                .map(function (subject) {
                    return createSubjectCard(
                        subject,
                        departmentId
                    );
                })
                .join("");

        bindSubjectCards();
    }


    /* =====================================================
       RENDER DEPARTMENT HEADER
    ====================================================== */

    function renderDepartmentHeader() {

        const department =
            STATE.currentDepartment;

        if (!department) {
            return;
        }

        const name =
            department.name ||
            department.title ||
            "Library Department";

        const description =
            department.description ||
            department.summary ||
            "";

        const titleElement =
            $(
                "#departmentTitle"
            ) ||
            $(
                "#subjectDepartmentTitle"
            ) ||
            $(
                "[data-department-title]"
            );

        const descriptionElement =
            $(
                "#departmentDescription"
            ) ||
            $(
                "#subjectDepartmentDescription"
            ) ||
            $(
                "[data-department-description]"
            );

        if (titleElement) {
            titleElement.textContent =
                name;
        }

        if (descriptionElement) {
            descriptionElement.textContent =
                description;
        }

        document.title =
            `${name} Subjects • ALON HISTORYVERSE 24`;
    }


    /* =====================================================
       SUBJECT CARD EVENTS
    ====================================================== */

    function bindSubjectCards() {

        const cards =
            $$("[data-subject-card]");

        cards.forEach(function (card) {

            const subjectId =
                card.dataset.subjectId;

            card.addEventListener(
                "click",
                function () {

                    openSubject(
                        subjectId,
                        STATE.currentDepartment &&
                        (
                            STATE.currentDepartment.id ||
                            STATE.currentDepartment.slug ||
                            slugify(
                                STATE.currentDepartment.name ||
                                ""
                            )
                        )
                    );

                }
            );

            card.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        card.click();
                    }
                }
            );

        });
    }


    /* =====================================================
       SEARCH EVENTS
    ====================================================== */

    function bindSearch() {

        const input =
            $(
                "#subjectSearch"
            ) ||
            $(
                "#searchSubjects"
            ) ||
            $(
                "[data-subject-search]"
            );

        if (!input) {
            return;
        }

        input.addEventListener(
            "input",
            function () {
                searchSubjects(
                    input.value
                );
            }
        );
    }


    /* =====================================================
       LIBRARY / DEPARTMENT BUTTONS
    ====================================================== */

    function bindNavigationButtons() {

        $$(
            "[data-open-library]"
        ).forEach(function (button) {

            button.addEventListener(
                "click",
                openLibrary
            );

        });

        $$(
            "[data-open-home]"
        ).forEach(function (button) {

            button.addEventListener(
                "click",
                openHome
            );

        });

        $$(
            "[data-open-department]"
        ).forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const departmentId =
                        button.dataset.openDepartment ||
                        (
                            STATE.currentDepartment &&
                            (
                                STATE.currentDepartment.id ||
                                STATE.currentDepartment.slug
                            )
                        );

                    openDepartment(
                        departmentId
                    );
                }
            );

        });
    }


    /* =====================================================
       STATUS
    ====================================================== */

    function showStatus(message) {

        const status =
            $(
                "#subjectStatus"
            ) ||
            $(
                "[data-subject-status]"
            ) ||
            $(
                "#status"
            );

        if (!status) {
            return;
        }

        status.textContent =
            message || "";

        status.hidden =
            !message;
    }


    /* =====================================================
       ERROR VIEW
    ====================================================== */

    function renderError(error) {

        const container =
            $(
                "#subjectsContainer"
            ) ||
            $(
                "#subjectContainer"
            ) ||
            $(
                "[data-subjects]"
            ) ||
            $(
                ".subjects-grid"
            );

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="ah-error-state">

                <div>⚠️</div>

                <h3>
                    Unable to Load Subjects
                </h3>

                <p>
                    The library data could not
                    be loaded right now.
                </p>

                <button
                    type="button"
                    data-subject-retry
                >
                    Retry
                </button>

            </div>
        `;

        const retry =
            $(
                "[data-subject-retry]"
            );

        if (retry) {
            retry.addEventListener(
                "click",
                initialize
            );
        }

        console.error(
            "ALON SUBJECT ENGINE:",
            error
        );
    }


    /* =====================================================
       INITIALIZATION
    ====================================================== */

    async function initialize() {

        if (STATE.initialized) {
            return;
        }

        showStatus(
            "Loading subjects..."
        );

        try {

            await loadLibraryData();

            selectCurrentDepartment();

            renderDepartmentHeader();

            renderSubjects();

            bindSearch();

            bindNavigationButtons();

            showStatus("");

            STATE.initialized = true;

            document.dispatchEvent(
                new CustomEvent(
                    "alon:subject-ready",
                    {
                        detail: {
                            department:
                                STATE.currentDepartment,
                            subjects:
                                STATE.subjects
                        }
                    }
                )
            );

        } catch (error) {

            showStatus(
                "Unable to load library data."
            );

            renderError(error);
        }
    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    const SUBJECT_ENGINE = {

        config: CONFIG,
        state: STATE,

        initialize,

        load: loadLibraryData,

        search: searchSubjects,

        findDepartment,

        render: renderSubjects,

        getDepartment: function () {
            return STATE.currentDepartment;
        },

        getSubjects: function () {
            return STATE.subjects.slice();
        },

        getFilteredSubjects: function () {
            return STATE.filteredSubjects.slice();
        },

        openSubject,

        openDepartment,

        openLibrary,

        openHome
    };


    /* =====================================================
       GLOBAL EXPORT
    ====================================================== */

    window.ALON_SUBJECT_ENGINE =
        SUBJECT_ENGINE;

    window.ALON_SUBJECT =
        SUBJECT_ENGINE;


    /* =====================================================
       AUTO START
    ====================================================== */

    function start() {

        const page =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();

        /*
         * Only auto-start on subject.html.
         */

        if (
            page === CONFIG.pageName ||
            document.querySelector(
                "[data-subjects]"
            ) ||
            document.querySelector(
                "#subjectsContainer"
            )
        ) {
            initialize();
        }
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    } else {

        start();

    }

})();