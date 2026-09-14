/* =========================================================
   ALON HISTORYVERSE 24
   LIBRARY ENGINE
   File: jss/library-engine.js
   Creator: Baba Thecno Guru
   Version: 24.0

   Library Flow:
   Library → Department → Subject → Book → Read

   Data Source:
   ../json/library.json

   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CONFIG
    ===================================================== */

    const CONFIG = {

        project:
            "ALON HISTORYVERSE 24",

        creator:
            "Baba Thecno Guru",

        version:
            "24.0",

        dataPath:
            "../json/library.json",

        storageKey:
            "alon_historyverse_library_data",

        cacheKey:
            "alon_historyverse_library_cache",

        cacheTime:
            1000 * 60 * 30

    };


    /* =====================================================
       STATE
    ===================================================== */

    const STATE = {

        data: null,

        departments: [],

        subjects: [],

        books: [],

        filteredBooks: [],

        currentDepartment: null,

        currentSubject: null,

        currentBook: null,

        initialized: false

    };


    /* =====================================================
       DOM HELPER
    ===================================================== */

    function $(selector, parent) {

        return (
            (parent || document).querySelector(
                selector
            )
        );
    }


    function $$(selector, parent) {

        return Array.from(
            (parent || document).querySelectorAll(
                selector
            )
        );
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function saveCache(data) {

        try {

            localStorage.setItem(
                CONFIG.cacheKey,
                JSON.stringify({
                    time: Date.now(),
                    data: data
                })
            );

        } catch (error) {

            console.warn(
                "Library cache could not be saved:",
                error
            );
        }
    }


    function getCache() {

        try {

            const raw =
                localStorage.getItem(
                    CONFIG.cacheKey
                );

            if (!raw) {
                return null;
            }

            const cache =
                JSON.parse(raw);

            if (
                !cache ||
                !cache.time ||
                !cache.data
            ) {
                return null;
            }

            if (
                Date.now() -
                cache.time >
                CONFIG.cacheTime
            ) {
                return null;
            }

            return cache.data;

        } catch (error) {

            console.warn(
                "Library cache error:",
                error
            );

            return null;
        }
    }


    /* =====================================================
       SAFE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(
            value == null
                ? ""
                : value
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


    /* =====================================================
       SLUG
    ===================================================== */

    function slugify(value) {

        return String(
            value || ""
        )
            .toLowerCase()
            .trim()
            .replace(
                /[^\w\s-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );
    }


    /* =====================================================
       URL PARAMETER
    ===================================================== */

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


    /* =====================================================
       STATUS
    ===================================================== */

    function showStatus(
        message,
        type
    ) {

        const selectors = [
            "#libraryStatus",
            "#status",
            ".library-status",
            "[data-library-status]"
        ];

        let element = null;

        for (
            let i = 0;
            i < selectors.length;
            i++
        ) {

            element =
                $(selectors[i]);

            if (element) {
                break;
            }
        }

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


    /* =====================================================
       DATA LOADER
    ===================================================== */

    async function loadLibraryData() {

        if (STATE.data) {

            return STATE.data;
        }


        const cached =
            getCache();

        if (cached) {

            STATE.data =
                cached;

            normalizeData();

            return STATE.data;
        }


        try {

            showStatus(
                "Loading library...",
                "loading"
            );


            const response =
                await fetch(
                    CONFIG.dataPath,
                    {
                        cache:
                            "no-cache"
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


            saveCache(data);

            normalizeData();

            showStatus(
                "",
                "success"
            );


            return data;

        } catch (error) {

            console.error(
                "Library data loading failed:",
                error
            );


            showStatus(
                "Library data could not be loaded.",
                "error"
            );


            return null;
        }
    }


    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    function normalizeData() {

        const data =
            STATE.data || {};


        /*
         * Supported structures:
         *
         * library.departments
         *
         * departments
         *
         */

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

                                    subjectId:
                                        subject.id,

                                    subjectName:
                                        subject.name,

                                    departmentId:
                                        department.id,

                                    departmentName:
                                        department.name

                                });

                            }
                        );

                    }
                );

            }
        );


        STATE.filteredBooks =
            STATE.books.slice();
    }


    /* =====================================================
       FIND DEPARTMENT
    ===================================================== */

    function findDepartment(
        idOrName
    ) {

        if (!idOrName) {
            return null;
        }


        const value =
            String(idOrName)
                .toLowerCase()
                .trim();


        return (
            STATE.departments.find(
                function (department) {

                    return (
                        String(
                            department.id || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        String(
                            department.name || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        slugify(
                            department.name
                        ) ===
                            value
                    );

                }
            ) || null
        );
    }


    /* =====================================================
       FIND SUBJECT
    ===================================================== */

    function findSubject(
        idOrName
    ) {

        if (!idOrName) {
            return null;
        }


        const value =
            String(idOrName)
                .toLowerCase()
                .trim();


        return (
            STATE.subjects.find(
                function (subject) {

                    return (
                        String(
                            subject.id || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        String(
                            subject.name || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        slugify(
                            subject.name
                        ) ===
                            value
                    );

                }
            ) || null
        );
    }


    /* =====================================================
       FIND BOOK
    ===================================================== */

    function findBook(
        idOrName
    ) {

        if (!idOrName) {
            return null;
        }


        const value =
            String(idOrName)
                .toLowerCase()
                .trim();


        return (
            STATE.books.find(
                function (book) {

                    return (
                        String(
                            book.id || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        String(
                            book.title || ""
                        )
                            .toLowerCase() ===
                            value
                        ||
                        slugify(
                            book.title
                        ) ===
                            value
                    );

                }
            ) || null
        );
    }


    /* =====================================================
       DEPARTMENT SUBJECTS
    ===================================================== */

    function getSubjectsByDepartment(
        departmentId
    ) {

        const department =
            findDepartment(
                departmentId
            );


        if (!department) {
            return [];
        }


        return Array.isArray(
            department.subjects
        )
            ? department.subjects
            : [];
    }


    /* =====================================================
       SUBJECT BOOKS
    ===================================================== */

    function getBooksBySubject(
        subjectId
    ) {

        const subject =
            findSubject(
                subjectId
            );


        if (!subject) {
            return [];
        }


        return STATE.books.filter(
            function (book) {

                return (
                    book.subjectId ===
                    subject.id
                );

            }
        );
    }


    /* =====================================================
       DEPARTMENT BOOKS
    ===================================================== */

    function getBooksByDepartment(
        departmentId
    ) {

        const department =
            findDepartment(
                departmentId
            );


        if (!department) {
            return [];
        }


        return STATE.books.filter(
            function (book) {

                return (
                    book.departmentId ===
                    department.id
                );

            }
        );
    }


    /* =====================================================
       RENDER DEPARTMENTS
    ===================================================== */

    function renderDepartments(
        container
    ) {

        const target =
            typeof container === "string"
                ? $(container)
                : container;


        if (!target) {
            return;
        }


        target.innerHTML = "";


        STATE.departments.forEach(
            function (department) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "library-department-card";


                card.dataset.departmentId =
                    department.id || "";


                card.dataset.libraryType =
                    "department";


                const subjects =
                    Array.isArray(
                        department.subjects
                    )
                        ? department.subjects
                        : [];


                const bookCount =
                    subjects.reduce(
                        function (
                            total,
                            subject
                        ) {

                            return (
                                total +
                                (
                                    Array.isArray(
                                        subject.books
                                    )
                                        ? subject.books.length
                                        : 0
                                )
                            );

                        },
                        0
                    );


                card.innerHTML = `

                    <div class="library-card-icon">
                        ${escapeHTML(
                            department.icon ||
                            "📚"
                        )}
                    </div>

                    <div class="library-card-content">

                        <h3>
                            ${escapeHTML(
                                department.name ||
                                "Department"
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                department.description ||
                                "Explore this knowledge department."
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


                target.appendChild(
                    card
                );

            }
        );


        bindLibraryCards(
            target
        );
    }


    /* =====================================================
       RENDER SUBJECTS
    ===================================================== */

    function renderSubjects(
        container,
        departmentId
    ) {

        const target =
            typeof container === "string"
                ? $(container)
                : container;


        if (!target) {
            return;
        }


        const subjects =
            getSubjectsByDepartment(
                departmentId
            );


        target.innerHTML = "";


        subjects.forEach(
            function (subject) {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "library-subject-card";


                card.dataset.subjectId =
                    subject.id || "";


                card.dataset.departmentId =
                    departmentId;


                card.dataset.libraryType =
                    "subject";


                const books =
                    Array.isArray(
                        subject.books
                    )
                        ? subject.books
                        : [];


                card.innerHTML = `

                    <div class="library-card-icon">
                        ${escapeHTML(
                            subject.icon ||
                            "📖"
                        )}
                    </div>

                    <div class="library-card-content">

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

                `;


                card.addEventListener(
                    "click",
                    function () {

                        openSubject(
                            subject.id ||
                            subject.name,

                            departmentId
                        );

                    }
                );


                target.appendChild(
                    card
                );

            }
        );


        bindLibraryCards(
            target
        );
    }


    /* =====================================================
       RENDER BOOKS
    ===================================================== */

    function renderBooks(
        container,
        subjectId
    ) {

        const target =
            typeof container === "string"
                ? $(container)
                : container;


        if (!target) {
            return;
        }


        let books =
            getBooksBySubject(
                subjectId
            );


        STATE.filteredBooks =
            books.slice();


        target.innerHTML = "";


        books.forEach(
            function (book) {

                target.appendChild(
                    createBookCard(
                        book
                    )
                );

            }
        );


        bindLibraryCards(
            target
        );
    }


    /* =====================================================
       CREATE BOOK CARD
    ===================================================== */

    function createBookCard(
        book
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "library-book-card";


        card.dataset.bookId =
            book.id || "";


        card.dataset.libraryType =
            "book";


        card.innerHTML = `

            <div class="library-card-icon">
                ${escapeHTML(
                    book.icon ||
                    "📕"
                )}
            </div>

            <div class="library-card-content">

                <h3>
                    ${escapeHTML(
                        book.title ||
                        "Untitled Book"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        book.description ||
                        "Open this book to continue reading."
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


    /* =====================================================
       SEARCH BOOKS
    ===================================================== */

    function searchBooks(
        query,
        books
    ) {

        const source =
            Array.isArray(books)
                ? books
                : STATE.books;


        const search =
            String(
                query || ""
            )
                .toLowerCase()
                .trim();


        if (!search) {

            return source.slice();
        }


        return source.filter(
            function (book) {

                const text = [

                    book.title,

                    book.author,

                    book.category,

                    book.description,

                    book.level,

                    book.subjectName,

                    book.departmentName

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                return text.includes(
                    search
                );

            }
        );
    }


    /* =====================================================
       FILTER BOOK CONTAINER
    ===================================================== */

    function filterBookContainer(
        container,
        query
    ) {

        const target =
            typeof container === "string"
                ? $(container)
                : container;


        if (!target) {
            return [];
        }


        const results =
            searchBooks(
                query,
                STATE.books
            );


        STATE.filteredBooks =
            results;


        target.innerHTML = "";


        results.forEach(
            function (book) {

                target.appendChild(
                    createBookCard(
                        book
                    )
                );

            }
        );


        return results;
    }


    /* =====================================================
       SEARCH INPUT BINDING
    ===================================================== */

    function bindSearch(
        input,
        container
    ) {

        const searchInput =
            typeof input === "string"
                ? $(input)
                : input;


        const target =
            typeof container === "string"
                ? $(container)
                : container;


        if (
            !searchInput ||
            !target
        ) {
            return;
        }


        searchInput.addEventListener(
            "input",
            function () {

                filterBookContainer(
                    target,
                    searchInput.value
                );

            }
        );
    }


    /* =====================================================
       CLICKABLE LIBRARY CARDS
    ===================================================== */

    function bindLibraryCards(
        container
    ) {

        const target =
            container ||
            document;


        $$(".library-card-link", target)
            .forEach(
                function (element) {

                    if (
                        element.dataset
                            .libraryBound ===
                        "true"
                    ) {
                        return;
                    }


                    element.dataset
                        .libraryBound =
                        "true";


                    element.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();


                            const type =
                                element.dataset
                                    .libraryType;


                            const id =
                                element.dataset
                                    .id;


                            if (
                                type ===
                                "department"
                            ) {

                                openDepartment(
                                    id
                                );

                            } else if (
                                type ===
                                "subject"
                            ) {

                                openSubject(
                                    id
                                );

                            } else if (
                                type ===
                                "book"
                            ) {

                                openBook(
                                    id
                                );

                            }

                        }
                    );

                }
            );
    }


    /* =====================================================
       OPEN DEPARTMENT
    ===================================================== */

    function openDepartment(
        departmentId
    ) {

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


        const url =
            "./subject.html?department=" +
            encodeURIComponent(
                department.id ||
                slugify(
                    department.name
                )
            );


        window.location.href =
            url;
    }


    /* =====================================================
       OPEN SUBJECT
    ===================================================== */

    function openSubject(
        subjectId,
        departmentId
    ) {

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


    /* =====================================================
       OPEN BOOK
    ===================================================== */

    function openBook(
        bookId
    ) {

        const book =
            findBook(
                bookId
            );


        if (!book) {

            showStatus(
                "Book not found.",
                "error"
            );

            return;
        }


        STATE.currentBook =
            book;


        const url =
            "./read.html?book=" +
            encodeURIComponent(
                book.id ||
                slugify(
                    book.title
                )
            );


        window.location.href =
            url;
    }


    /* =====================================================
       OPEN HOME LIBRARY
    ===================================================== */

    function openLibrary() {

        window.location.href =
            "./library.html";
    }


    /* =====================================================
       RENDER CURRENT PAGE
    ===================================================== */

    function renderCurrentPage() {

        const page =
            detectPage();


        if (
            page ===
            "library"
        ) {

            renderLibraryPage();

        } else if (
            page ===
            "department"
        ) {

            renderDepartmentPage();

        } else if (
            page ===
            "subject"
        ) {

            renderSubjectPage();

        } else if (
            page ===
            "book"
        ) {

            renderBookPage();

        } else if (
            page ===
            "read"
        ) {

            renderReadPage();
        }
    }


    /* =====================================================
       PAGE DETECTION
    ===================================================== */

    function detectPage() {

        const path =
            window.location.pathname
                .toLowerCase();


        if (
            path.endsWith(
                "/library.html"
            )
        ) {
            return "library";
        }


        if (
            path.endsWith(
                "/department.html"
            )
        ) {
            return "department";
        }


        if (
            path.endsWith(
                "/subject.html"
            )
        ) {
            return "subject";
        }


        if (
            path.endsWith(
                "/book.html"
            )
        ) {
            return "book";
        }


        if (
            path.endsWith(
                "/read.html"
            )
        ) {
            return "read";
        }


        return "";
    }


    /* =====================================================
       LIBRARY PAGE
    ===================================================== */

    function renderLibraryPage() {

        const containers = [

            "#departmentsGrid",

            "#libraryDepartments",

            "#departmentList",

            "[data-library-departments]"

        ];


        let target = null;


        for (
            let i = 0;
            i < containers.length;
            i++
        ) {

            target =
                $(containers[i]);

            if (target) {
                break;
            }
        }


        if (target) {

            renderDepartments(
                target
            );
        }
    }


    /* =====================================================
       DEPARTMENT PAGE
    ===================================================== */

    function renderDepartmentPage() {

        const departmentId =
            getParam(
                "department"
            ) ||
            getParam(
                "id"
            );


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


        const titleElements = [

            "#departmentTitle",

            "#libraryTitle",

            "[data-department-title]"

        ];


        titleElements.forEach(
            function (selector) {

                $$(selector)
                    .forEach(
                        function (element) {

                            element.textContent =
                                department.name;

                        }
                    );
            }
        );


        const description =
            department.description ||
            "";


        $$(
            "#departmentDescription, [data-department-description]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        description;

                }
            );


        const containers = [

            "#subjectsGrid",

            "#departmentSubjects",

            "#subjectList",

            "[data-library-subjects]"

        ];


        let target = null;


        for (
            let i = 0;
            i < containers.length;
            i++
        ) {

            target =
                $(containers[i]);

            if (target) {
                break;
            }
        }


        if (target) {

            renderSubjects(
                target,
                department.id
            );
        }
    }


    /* =====================================================
       SUBJECT PAGE
    ===================================================== */

    function renderSubjectPage() {

        const subjectId =
            getParam(
                "subject"
            ) ||
            getParam(
                "id"
            );


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


        $$(
            "#subjectTitle, [data-subject-title]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        subject.name;

                }
            );


        $$(
            "#subjectDescription, [data-subject-description]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        subject.description ||
                        "";

                }
            );


        const containers = [

            "#booksGrid",

            "#subjectBooks",

            "#bookList",

            "[data-library-books]"

        ];


        let target = null;


        for (
            let i = 0;
            i < containers.length;
            i++
        ) {

            target =
                $(containers[i]);

            if (target) {
                break;
            }
        }


        if (target) {

            renderBooks(
                target,
                subject.id
            );


            const searchInput =
                $(
                    "#bookSearch, #librarySearch, [data-book-search]"
                );


            if (searchInput) {

                bindSearch(
                    searchInput,
                    target
                );
            }
        }
    }


    /* =====================================================
       BOOK PAGE
    ===================================================== */

    function renderBookPage() {

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


        if (!book) {

            showStatus(
                "Book not found.",
                "error"
            );

            return;
        }


        STATE.currentBook =
            book;


        $$(
            "#bookTitle, [data-book-title]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        book.title ||
                        "Book";

                }
            );


        $$(
            "#bookDescription, [data-book-description]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        book.description ||
                        "";

                }
            );


        $$(
            "#bookAuthor, [data-book-author]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        book.author ||
                        "";

                }
            );


        const readButtons = [

            "#readBook",

            "[data-read-book]"

        ];


        readButtons.forEach(
            function (selector) {

                $$(selector)
                    .forEach(
                        function (button) {

                            button.addEventListener(
                                "click",
                                function () {

                                    openBook(
                                        book.id
                                    );

                                }
                            );

                        }
                    );
            }
        );
    }


    /* =====================================================
       READ PAGE
    ===================================================== */

    function renderReadPage() {

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


        if (!book) {

            showStatus(
                "Book not found.",
                "error"
            );

            return;
        }


        STATE.currentBook =
            book;


        $$(
            "#readTitle, #bookTitle, [data-read-title]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        book.title ||
                        "Reading";

                }
            );


        $$(
            "#readAuthor, [data-read-author]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        book.author ||
                        "";

                }
            );


        const content =
            book.content ||
            book.text ||
            book.description ||
            "Reading content will be added here.";


        $$(
            "#readContent, #bookContent, [data-read-content]"
        )
            .forEach(
                function (element) {

                    element.textContent =
                        content;

                }
            );
    }


    /* =====================================================
       GENERIC DATA CLICK HANDLER
    ===================================================== */

    function bindDataNavigation() {

        document.addEventListener(
            "click",
            function (event) {

                const element =
                    event.target.closest(
                        "[data-library-open]"
                    );


                if (!element) {
                    return;
                }


                const type =
                    element.dataset
                        .libraryOpen;


                const id =
                    element.dataset
                        .id ||
                    element.dataset
                        .libraryId;


                if (!id) {
                    return;
                }


                event.preventDefault();


                if (
                    type ===
                    "department"
                ) {

                    openDepartment(
                        id
                    );

                } else if (
                    type ===
                    "subject"
                ) {

                    openSubject(
                        id
                    );

                } else if (
                    type ===
                    "book"
                ) {

                    openBook(
                        id
                    );
                }

            }
        );
    }


    /* =====================================================
       BACK NAVIGATION
    ===================================================== */

    function bindBackButtons() {

        $$(
            "[data-library-back]"
        )
            .forEach(
                function (button) {

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


    /* =====================================================
       INITIALIZE
    ===================================================== */

    async function initialize() {

        if (
            STATE.initialized
        ) {
            return;
        }


        STATE.initialized =
            true;


        const data =
            await loadLibraryData();


        if (!data) {
            return;
        }


        renderCurrentPage();

        bindDataNavigation();

        bindBackButtons();


        /*
         * Allow other project engines
         * to know that library data
         * is ready.
         */

        try {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:library-ready",
                    {
                        detail: {
                            data:
                                STATE.data,

                            departments:
                                STATE.departments,

                            subjects:
                                STATE.subjects,

                            books:
                                STATE.books
                        }
                    }
                )
            );

        } catch (error) {

            console.warn(
                "Library ready event failed:",
                error
            );
        }


        console.log(
            "ALON HISTORYVERSE 24 Library Engine ready."
        );
    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.ALON_LIBRARY = {

        config:
            CONFIG,

        state:
            STATE,

        initialize:
            initialize,

        load:
            loadLibraryData,

        getDepartments:
            function () {

                return STATE.departments.slice();

            },

        getSubjects:
            function () {

                return STATE.subjects.slice();

            },

        getBooks:
            function () {

                return STATE.books.slice();

            },

        findDepartment:
            findDepartment,

        findSubject:
            findSubject,

        findBook:
            findBook,

        getSubjectsByDepartment:
            getSubjectsByDepartment,

        getBooksBySubject:
            getBooksBySubject,

        getBooksByDepartment:
            getBooksByDepartment,

        searchBooks:
            searchBooks,

        renderDepartments:
            renderDepartments,

        renderSubjects:
            renderSubjects,

        renderBooks:
            renderBooks,

        openLibrary:
            openLibrary,

        openDepartment:
            openDepartment,

        openSubject:
            openSubject,

        openBook:
            openBook,

        renderCurrentPage:
            renderCurrentPage

    };


    /* =====================================================
       COMPATIBILITY GLOBALS
    ===================================================== */

    window.ALON_LIBRARY_ENGINE =
        window.ALON_LIBRARY;


    /* =====================================================
       AUTO START
    ===================================================== */

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