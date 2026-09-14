(function () {
    "use strict";

    /* =========================================================
       ALON HISTORYVERSE 24
       LIBRARY UI CONTROLLER
       File: jss/library.js
       Creator: Baba Thecno Guru
       Version: 24.0
       ========================================================= */

    const CONFIG = {
        project: "ALON HISTORYVERSE 24",
        creator: "Baba Thecno Guru",
        version: "24.0",

        dataPath: "../json/library.json",

        storageKey: "alon_historyverse_library",

        selectors: {
            search: [
                "#librarySearch",
                "#bookSearch",
                "[data-library-search]"
            ],

            departments: [
                "#departmentsGrid",
                "#libraryDepartments",
                "#departmentList",
                "[data-library-departments]"
            ],

            subjects: [
                "#subjectsGrid",
                "#departmentSubjects",
                "#subjectList",
                "[data-library-subjects]"
            ],

            books: [
                "#booksGrid",
                "#subjectBooks",
                "#bookList",
                "[data-library-books]"
            ],

            status: [
                "#libraryStatus",
                "#status",
                "[data-library-status]"
            ]
        }
    };


    /* =========================================================
       STATE
       ========================================================= */

    const STATE = {
        data: null,
        departments: [],
        subjects: [],
        books: [],

        currentDepartment: null,
        currentSubject: null,
        currentBook: null,

        searchText: "",

        initialized: false
    };


    /* =========================================================
       DOM HELPERS
       ========================================================= */

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }


    function $$(selector, root) {
        return Array.from(
            (root || document).querySelectorAll(selector)
        );
    }


    function findFirst(selectors) {

        for (const selector of selectors) {

            const element = $(selector);

            if (element) {
                return element;
            }
        }

        return null;
    }


    /* =========================================================
       SAFE HTML
       ========================================================= */

    function escapeHTML(value) {

        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =========================================================
       SLUG
       ========================================================= */

    function slugify(value) {

        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }


    /* =========================================================
       URL PARAMETER
       ========================================================= */

    function getParam(name) {

        try {

            const params =
                new URLSearchParams(
                    window.location.search
                );

            return params.get(name);

        } catch (error) {

            return null;
        }
    }


    /* =========================================================
       STATUS
       ========================================================= */

    function showStatus(message, type) {

        const element =
            findFirst(
                CONFIG.selectors.status
            );

        if (!element) {
            return;
        }

        element.textContent =
            message || "";

        element.dataset.status =
            type || "info";

        element.style.display =
            message ? "" : "none";
    }


    /* =========================================================
       DATA LOADING
       ========================================================= */

    async function loadData() {

        /*
         * First use ALON_LIBRARY if
         * library-engine.js is already loaded.
         */

        if (
            window.ALON_LIBRARY &&
            window.ALON_LIBRARY.load
        ) {

            const data =
                await window.ALON_LIBRARY.load();

            if (data) {

                STATE.data =
                    data;

                normalizeData();

                return data;
            }
        }


        /*
         * Otherwise load library.json
         * directly.
         */

        try {

            showStatus(
                "Loading Library...",
                "loading"
            );


            const response =
                await fetch(
                    CONFIG.dataPath,
                    {
                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );
            }


            const data =
                await response.json();


            STATE.data =
                data;

            normalizeData();

            showStatus(
                "",
                "success"
            );


            return data;

        } catch (error) {

            console.error(
                "Library data error:",
                error
            );


            showStatus(
                "Library data could not be loaded.",
                "error"
            );


            return null;
        }
    }


    /* =========================================================
       NORMALIZE DATA
       ========================================================= */

    function normalizeData() {

        const data =
            STATE.data || {};


        let departments = [];


        if (
            data.library &&
            Array.isArray(
                data.library.departments
            )
        ) {

            departments =
                data.library.departments;

        } else if (
            Array.isArray(
                data.departments
            )
        ) {

            departments =
                data.departments;
        }


        STATE.departments =
            departments;


        STATE.subjects = [];

        STATE.books = [];


        departments.forEach(
            function (department) {

                const subjects =
                    Array.isArray(
                        department.subjects
                    )
                        ? department.subjects
                        : [];


                subjects.forEach(
                    function (subject) {

                        STATE.subjects.push({

                            ...subject,

                            departmentId:
                                department.id,

                            departmentName:
                                department.name

                        });


                        const books =
                            Array.isArray(
                                subject.books
                            )
                                ? subject.books
                                : [];


                        books.forEach(
                            function (book) {

                                STATE.books.push({

                                    ...book,

                                    departmentId:
                                        department.id,

                                    departmentName:
                                        department.name,

                                    subjectId:
                                        subject.id,

                                    subjectName:
                                        subject.name

                                });

                            }
                        );

                    }
                );

            }
        );
    }


    /* =========================================================
       FIND HELPERS
       ========================================================= */

    function findDepartment(value) {

        if (!value) {
            return null;
        }


        const search =
            String(value)
                .toLowerCase()
                .trim();


        return (
            STATE.departments.find(
                function (item) {

                    return (
                        String(
                            item.id || ""
                        ).toLowerCase() === search
                        ||
                        String(
                            item.name || ""
                        ).toLowerCase() === search
                        ||
                        slugify(
                            item.name
                        ) === search
                    );
                }
            ) || null
        );
    }


    function findSubject(value) {

        if (!value) {
            return null;
        }


        const search =
            String(value)
                .toLowerCase()
                .trim();


        return (
            STATE.subjects.find(
                function (item) {

                    return (
                        String(
                            item.id || ""
                        ).toLowerCase() === search
                        ||
                        String(
                            item.name || ""
                        ).toLowerCase() === search
                        ||
                        slugify(
                            item.name
                        ) === search
                    );
                }
            ) || null
        );
    }


    function findBook(value) {

        if (!value) {
            return null;
        }


        const search =
            String(value)
                .toLowerCase()
                .trim();


        return (
            STATE.books.find(
                function (item) {

                    return (
                        String(
                            item.id || ""
                        ).toLowerCase() === search
                        ||
                        String(
                            item.title || ""
                        ).toLowerCase() === search
                        ||
                        slugify(
                            item.title
                        ) === search
                    );
                }
            ) || null
        );
    }


    /* =========================================================
       DEPARTMENT CARD
       ========================================================= */

    function createDepartmentCard(
        department
    ) {

        const card =
            document.createElement("article");


        card.className =
            "library-card library-department-card";


        card.dataset.departmentId =
            department.id || "";


        const subjects =
            Array.isArray(
                department.subjects
            )
                ? department.subjects
                : [];


        let bookCount = 0;


        subjects.forEach(
            function (subject) {

                if (
                    Array.isArray(
                        subject.books
                    )
                ) {

                    bookCount +=
                        subject.books.length;
                }
            }
        );


        card.innerHTML = `

            <div class="library-card-icon">
                ${escapeHTML(
                    department.icon || "📚"
                )}
            </div>

            <div class="library-card-body">

                <h3>
                    ${escapeHTML(
                        department.name ||
                        "Department"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        department.description ||
                        "Explore this department."
                    )}
                </p>

                <div class="library-card-meta">

                    <span>
                        ${subjects.length}
                        Subjects
                    </span>

                    <span>
                        ${bookCount}
                        Books
                    </span>

                </div>

            </div>

            <div class="library-card-arrow">
                →
            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openDepartment(
                    department.id ||
                    department.name
                );

            }
        );


        return card;
    }


    /* =========================================================
       SUBJECT CARD
       ========================================================= */

    function createSubjectCard(
        subject
    ) {

        const card =
            document.createElement("article");


        card.className =
            "library-card library-subject-card";


        card.dataset.subjectId =
            subject.id || "";


        const books =
            Array.isArray(
                subject.books
            )
                ? subject.books
                : [];


        card.innerHTML = `

            <div class="library-card-icon">
                ${escapeHTML(
                    subject.icon || "📖"
                )}
            </div>

            <div class="library-card-body">

                <h3>
                    ${escapeHTML(
                        subject.name ||
                        "Subject"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        subject.description ||
                        "Explore this subject."
                    )}
                </p>

                <div class="library-card-meta">

                    <span>
                        ${books.length}
                        Books
                    </span>

                </div>

            </div>

            <div class="library-card-arrow">
                →
            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openSubject(
                    subject.id ||
                    subject.name,
                    subject.departmentId
                );

            }
        );


        return card;
    }


    /* =========================================================
       BOOK CARD
       ========================================================= */

    function createBookCard(
        book
    ) {

        const card =
            document.createElement("article");


        card.className =
            "library-card library-book-card";


        card.dataset.bookId =
            book.id || "";


        card.innerHTML = `

            <div class="library-card-icon">
                ${escapeHTML(
                    book.icon || "📕"
                )}
            </div>

            <div class="library-card-body">

                <h3>
                    ${escapeHTML(
                        book.title ||
                        "Untitled Book"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        book.description ||
                        "Open this book."
                    )}
                </p>

                <div class="library-card-meta">

                    ${
                        book.author
                            ? `
                                <span>
                                    ✍️
                                    ${escapeHTML(
                                        book.author
                                    )}
                                </span>
                              `
                            : ""
                    }

                    ${
                        book.level
                            ? `
                                <span>
                                    ${escapeHTML(
                                        book.level
                                    )}
                                </span>
                              `
                            : ""
                    }

                </div>

            </div>

            <div class="library-card-arrow">
                →
            </div>

        `;


        card.addEventListener(
            "click",
            function () {

                openBook(
                    book.id ||
                    book.title
                );

            }
        );


        return card;
    }


    /* =========================================================
       RENDER DEPARTMENTS
       ========================================================= */

    function renderDepartments() {

        const container =
            findFirst(
                CONFIG.selectors.departments
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (
            STATE.departments.length === 0
        ) {

            container.innerHTML =
                `
                <div class="library-empty">
                    No departments found.
                </div>
                `;

            return;
        }


        STATE.departments.forEach(
            function (department) {

                container.appendChild(
                    createDepartmentCard(
                        department
                    )
                );

            }
        );
    }


    /* =========================================================
       RENDER SUBJECTS
       ========================================================= */

    function renderSubjects(
        departmentId
    ) {

        const container =
            findFirst(
                CONFIG.selectors.subjects
            );


        if (!container) {
            return;
        }


        const department =
            findDepartment(
                departmentId
            );


        if (!department) {

            showStatus(
                "Department not found.",
                "error"
            );

            return;
        }


        STATE.currentDepartment =
            department;


        const subjects =
            Array.isArray(
                department.subjects
            )
                ? department.subjects
                : [];


        container.innerHTML = "";


        subjects.forEach(
            function (subject) {

                container.appendChild(
                    createSubjectCard({

                        ...subject,

                        departmentId:
                            department.id,

                        departmentName:
                            department.name

                    })
                );

            }
        );


        updatePageTitle(
            department.name
        );
    }


    /* =========================================================
       RENDER BOOKS
       ========================================================= */

    function renderBooks(
        subjectId
    ) {

        const container =
            findFirst(
                CONFIG.selectors.books
            );


        if (!container) {
            return;
        }


        const subject =
            findSubject(
                subjectId
            );


        if (!subject) {

            showStatus(
                "Subject not found.",
                "error"
            );

            return;
        }


        STATE.currentSubject =
            subject;


        const books =
            STATE.books.filter(
                function (book) {

                    return (
                        book.subjectId ===
                        subject.id
                    );

                }
            );


        container.innerHTML = "";


        if (books.length === 0) {

            container.innerHTML =
                `
                <div class="library-empty">
                    No books found in this subject.
                </div>
                `;

            return;
        }


        books.forEach(
            function (book) {

                container.appendChild(
                    createBookCard(
                        book
                    )
                );

            }
        );


        updatePageTitle(
            subject.name
        );
    }


    /* =========================================================
       SEARCH
       ========================================================= */

    function searchBooks(
        query
    ) {

        STATE.searchText =
            String(
                query || ""
            )
                .toLowerCase()
                .trim();


        const container =
            findFirst(
                CONFIG.selectors.books
            );


        if (!container) {
            return [];
        }


        let books =
            STATE.books.slice();


        if (
            STATE.searchText
        ) {

            books =
                books.filter(
                    function (book) {

                        const text = [

                            book.title,

                            book.author,

                            book.category,

                            book.level,

                            book.description,

                            book.subjectName,

                            book.departmentName

                        ]
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                        return text.includes(
                            STATE.searchText
                        );
                    }
                );
        }


        container.innerHTML = "";


        if (books.length === 0) {

            container.innerHTML =
                `
                <div class="library-empty">
                    No matching books found.
                </div>
                `;

            return [];
        }


        books.forEach(
            function (book) {

                container.appendChild(
                    createBookCard(
                        book
                    )
                );

            }
        );


        return books;
    }


    /* =========================================================
       SEARCH EVENT
       ========================================================= */

    function bindSearch() {

        const input =
            findFirst(
                CONFIG.selectors.search
            );


        if (!input) {
            return;
        }


        if (
            input.dataset
                .librarySearchBound ===
            "true"
        ) {
            return;
        }


        input.dataset
            .librarySearchBound =
            "true";


        input.addEventListener(
            "input",
            function () {

                searchBooks(
                    input.value
                );

            }
        );
    }


    /* =========================================================
       PAGE TITLE
       ========================================================= */

    function updatePageTitle(
        title
    ) {

        $$(
            "#libraryTitle, #departmentTitle, #subjectTitle, [data-library-title]"
        )
            .forEach(
                function (element) {

                    if (
                        element.dataset
                            .keepTitle ===
                        "true"
                    ) {
                        return;
                    }

                    element.textContent =
                        title;
                }
            );
    }


    /* =========================================================
       NAVIGATION
       ========================================================= */

    function openLibrary() {

        window.location.href =
            "./library.html";
    }


    function openDepartment(
        id
    ) {

        const department =
            findDepartment(id);


        if (!department) {
            return;
        }


        window.location.href =
            "./subject.html?department=" +
            encodeURIComponent(
                department.id ||
                slugify(
                    department.name
                )
            );
    }


    function openSubject(
        id,
        departmentId
    ) {

        const subject =
            findSubject(id);


        if (!subject) {
            return;
        }


        let url =
            "./book.html?subject=" +
            encodeURIComponent(
                subject.id ||
                slugify(
                    subject.name
                )
            );


        if (departmentId) {

            url +=
                "&department=" +
                encodeURIComponent(
                    departmentId
                );
        }


        window.location.href =
            url;
    }


    function openBook(
        id
    ) {

        const book =
            findBook(id);


        if (!book) {
            return;
        }


        window.location.href =
            "./read.html?book=" +
            encodeURIComponent(
                book.id ||
                slugify(
                    book.title
                )
            );
    }


    /* =========================================================
       BACK BUTTON
       ========================================================= */

    function bindBackButtons() {

        $$(
            "[data-library-back]"
        )
            .forEach(
                function (button) {

                    if (
                        button.dataset
                            .libraryBackBound ===
                        "true"
                    ) {
                        return;
                    }


                    button.dataset
                        .libraryBackBound =
                        "true";


                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();


                            if (
                                window.history.length >
                                1
                            ) {

                                window.history.back();

                            } else {

                                openLibrary();
                            }

                        }
                    );

                }
            );
    }


    /* =========================================================
       CURRENT PAGE
       ========================================================= */

    function getCurrentPage() {

        const file =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        if (
            file === "library.html"
        ) {
            return "library";
        }


        if (
            file === "department.html"
        ) {
            return "department";
        }


        if (
            file === "subject.html"
        ) {
            return "subject";
        }


        if (
            file === "book.html"
        ) {
            return "book";
        }


        if (
            file === "read.html"
        ) {
            return "read";
        }


        return "";
    }


    /* =========================================================
       PAGE INITIALIZATION
       ========================================================= */

    function renderCurrentPage() {

        const page =
            getCurrentPage();


        if (
            page === "library"
        ) {

            renderDepartments();

        }


        else if (
            page === "department"
        ) {

            const department =
                getParam(
                    "department"
                ) ||
                getParam(
                    "id"
                );


            if (department) {

                renderSubjects(
                    department
                );
            }

        }


        else if (
            page === "subject"
        ) {

            const subject =
                getParam(
                    "subject"
                ) ||
                getParam(
                    "id"
                );


            if (subject) {

                renderBooks(
                    subject
                );
            }

        }


        else if (
            page === "book"
        ) {

            const bookId =
                getParam(
                    "book"
                ) ||
                getParam(
                    "id"
                );


            const book =
                findBook(
                    bookId
                );


            if (book) {

                STATE.currentBook =
                    book;
            }

        }


        else if (
            page === "read"
        ) {

            const bookId =
                getParam(
                    "book"
                ) ||
                getParam(
                    "id"
                );


            const book =
                findBook(
                    bookId
                );


            if (book) {

                STATE.currentBook =
                    book;
            }

        }
    }


    /* =========================================================
       INITIALIZE
       ========================================================= */

    async function initialize() {

        if (
            STATE.initialized
        ) {
            return;
        }


        STATE.initialized =
            true;


        const data =
            await loadData();


        if (!data) {
            return;
        }


        renderCurrentPage();

        bindSearch();

        bindBackButtons();


        /*
         * Notify other project systems.
         */

        document.dispatchEvent(
            new CustomEvent(
                "alon:library-ui-ready",
                {
                    detail: {
                        state: STATE
                    }
                }
            )
        );


        console.log(
            "ALON HISTORYVERSE 24 Library JS ready."
        );
    }


    /* =========================================================
       PUBLIC API
       ========================================================= */

    window.ALON_LIBRARY_UI = {

        config:
            CONFIG,

        state:
            STATE,

        initialize:
            initialize,

        load:
            loadData,

        renderDepartments:
            renderDepartments,

        renderSubjects:
            renderSubjects,

        renderBooks:
            renderBooks,

        searchBooks:
            searchBooks,

        findDepartment:
            findDepartment,

        findSubject:
            findSubject,

        findBook:
            findBook,

        openLibrary:
            openLibrary,

        openDepartment:
            openDepartment,

        openSubject:
            openSubject,

        openBook:
            openBook,

        getCurrentPage:
            getCurrentPage

    };


    /* Compatibility */

    window.ALON_LIBRARY_JS =
        window.ALON_LIBRARY_UI;


    /* =========================================================
       AUTO START
       ========================================================= */

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