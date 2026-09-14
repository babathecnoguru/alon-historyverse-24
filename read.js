/* ============================================================
   ALON HISTORYVERSE 24
   READ ENGINE
   File: jss/read.js
   Creator: Baba Thecno Guru
   Version: 24.0

   PURPOSE
   ------------------------------------------------------------
   • Library → Book → Read flow
   • library.json से book data load करना
   • URL ?book=... / ?id=... पढ़ना
   • Book title / author / category / description दिखाना
   • Reading content display
   • Search support
   • Previous / Next book navigation
   • Mobile-friendly reading controls
   • Font size controls
   • Reading progress
   • Local reading position save
   • No root index/path changes
   ============================================================ */

(function (window, document) {

    "use strict";


    /* ========================================================
       CONFIG
       ======================================================== */

    const CONFIG = {

        dataUrl: "../json/library.json",

        storageKeys: {
            cache:
                "alon_historyverse_library_cache",

            readingProgress:
                "alon_historyverse_reading_progress",

            fontSize:
                "alon_historyverse_reader_font_size"
        },

        selectors: {

            title:
                "#bookTitle, [data-book-title]",

            author:
                "#bookAuthor, [data-book-author]",

            category:
                "#bookCategory, [data-book-category]",

            level:
                "#bookLevel, [data-book-level]",

            description:
                "#bookDescription, [data-book-description]",

            content:
                "#bookContent, [data-book-content]",

            department:
                "#bookDepartment, [data-book-department]",

            subject:
                "#bookSubject, [data-book-subject]",

            search:
                "#readSearch, #bookSearch, [data-read-search]",

            reader:
                "#reader, #readingArea, [data-reader]",

            status:
                "#readStatus, #bookStatus, [data-read-status]",

            error:
                "#readError, #bookError, [data-read-error]",

            progress:
                "#readingProgress, [data-reading-progress]"
        }

    };


    /* ========================================================
       STATE
       ======================================================== */

    const STATE = {

        initialized: false,

        loading: false,

        loaded: false,

        data: null,

        departments: [],

        books: [],

        currentBook: null,

        currentIndex: -1,

        currentBookId: null,

        fontSize: 18,

        progress: 0
    };


    /* ========================================================
       DOM HELPERS
       ======================================================== */

    function $(selector, root) {

        try {

            return (
                root || document
            ).querySelector(selector);

        } catch (error) {

            return null;
        }
    }


    function $$(selector, root) {

        try {

            return Array.from(
                (root || document)
                    .querySelectorAll(selector)
            );

        } catch (error) {

            return [];
        }
    }


    function dispatch(name, detail) {

        try {

            document.dispatchEvent(
                new CustomEvent(
                    name,
                    {
                        detail:
                            detail || {}
                    }
                )
            );

        } catch (error) {

            /* Safe fallback */
        }
    }


    /* ========================================================
       SAFE HTML
       ======================================================== */

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


    /* ========================================================
       STORAGE
       ======================================================== */

    function readStorage(key) {

        try {

            return localStorage.getItem(
                key
            );

        } catch (error) {

            return null;
        }
    }


    function writeStorage(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                value
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    function readJSON(key) {

        try {

            const value =
                readStorage(key);

            return value
                ? JSON.parse(value)
                : null;

        } catch (error) {

            return null;
        }
    }


    function writeJSON(
        key,
        value
    ) {

        try {

            return writeStorage(
                key,
                JSON.stringify(value)
            );

        } catch (error) {

            return false;
        }
    }


    /* ========================================================
       URL PARAMETERS
       ======================================================== */

    function getURLParameter(
        name
    ) {

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


    function getBookParameter() {

        return (
            getURLParameter("book") ||
            getURLParameter("id") ||
            getURLParameter("bookId")
        );
    }


    /* ========================================================
       SLUG
       ======================================================== */

    function slugify(value) {

        return String(
            value == null
                ? ""
                : value
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
    }


    /* ========================================================
       STATUS
       ======================================================== */

    function setStatus(
        message,
        type
    ) {

        const status =
            $(CONFIG.selectors.status);

        if (!status) {
            return;
        }

        status.textContent =
            message || "";

        status.dataset.status =
            type || "info";
    }


    /* ========================================================
       ERROR
       ======================================================== */

    function showError(
        message
    ) {

        const errorBox =
            $(CONFIG.selectors.error);

        if (errorBox) {

            errorBox.textContent =
                message || "Unable to load book.";

            errorBox.hidden = false;

        } else {

            setStatus(
                message,
                "error"
            );
        }
    }


    function hideError() {

        const errorBox =
            $(CONFIG.selectors.error);

        if (errorBox) {
            errorBox.hidden = true;
        }
    }


    /* ========================================================
       NORMALIZE LIBRARY
       ======================================================== */

    function normalizeLibrary(
        data
    ) {

        if (!data) {
            return [];
        }

        const root =
            data.library &&
            typeof data.library === "object"
                ? data.library
                : data;

        const departments =
            Array.isArray(
                root.departments
            )
                ? root.departments
                : [];

        const books = [];

        departments.forEach(
            function (department) {

                if (!department) {
                    return;
                }

                const departmentName =
                    department.name ||
                    department.title ||
                    "";

                const subjects =
                    Array.isArray(
                        department.subjects
                    )
                        ? department.subjects
                        : [];

                subjects.forEach(
                    function (subject) {

                        if (!subject) {
                            return;
                        }

                        const subjectName =
                            subject.name ||
                            subject.title ||
                            "";

                        const subjectBooks =
                            Array.isArray(
                                subject.books
                            )
                                ? subject.books
                                : [];

                        subjectBooks.forEach(
                            function (book) {

                                if (!book) {
                                    return;
                                }

                                books.push({

                                    ...book,

                                    department:
                                        book.department ||
                                        departmentName,

                                    subject:
                                        book.subject ||
                                        subjectName
                                });
                            }
                        );
                    }
                );
            }
        );

        return books;
    }


    /* ========================================================
       FETCH JSON
       ======================================================== */

    async function fetchLibrary() {

        STATE.loading = true;

        setStatus(
            "Loading library...",
            "loading"
        );

        try {

            const response =
                await fetch(
                    CONFIG.dataUrl,
                    {
                        cache: "no-cache"
                    }
                );

            if (!response.ok) {

                throw new Error(
                    "Library data could not be loaded."
                );
            }

            const data =
                await response.json();

            STATE.data = data;

            writeJSON(
                CONFIG.storageKeys.cache,
                data
            );

            STATE.books =
                normalizeLibrary(data);

            STATE.departments =
                data.library &&
                Array.isArray(
                    data.library.departments
                )
                    ? data.library.departments
                    : [];

            STATE.loaded = true;
            STATE.loading = false;

            setStatus(
                "",
                "ready"
            );

            return data;

        } catch (error) {

            STATE.loading = false;

            const cached =
                readJSON(
                    CONFIG.storageKeys.cache
                );

            if (cached) {

                STATE.data =
                    cached;

                STATE.books =
                    normalizeLibrary(
                        cached
                    );

                STATE.loaded = true;

                setStatus(
                    "Library loaded from saved cache.",
                    "offline"
                );

                return cached;
            }

            throw error;
        }
    }


    /* ========================================================
       FIND BOOK
       ======================================================== */

    function findBook(
        identifier
    ) {

        if (!identifier) {
            return null;
        }

        const value =
            String(identifier)
                .trim()
                .toLowerCase();

        const exactId =
            STATE.books.find(
                function (book) {

                    return String(
                        book.id || ""
                    ).toLowerCase() === value;
                }
            );

        if (exactId) {
            return exactId;
        }

        const exactSlug =
            STATE.books.find(
                function (book) {

                    return (
                        slugify(book.title) ===
                        slugify(identifier)
                    );
                }
            );

        if (exactSlug) {
            return exactSlug;
        }

        const exactTitle =
            STATE.books.find(
                function (book) {

                    return String(
                        book.title || ""
                    ).toLowerCase() === value;
                }
            );

        return exactTitle || null;
    }


    /* ========================================================
       FIND BOOK INDEX
       ======================================================== */

    function findBookIndex(
        book
    ) {

        if (!book) {
            return -1;
        }

        return STATE.books.indexOf(
            book
        );
    }


    /* ========================================================
       CURRENT BOOK
       ======================================================== */

    function setCurrentBook(
        book
    ) {

        STATE.currentBook =
            book || null;

        STATE.currentIndex =
            findBookIndex(book);

        STATE.currentBookId =
            book
                ? String(
                    book.id ||
                    slugify(book.title)
                )
                : null;

        loadReadingProgress();

        dispatch(
            "alon:book-change",
            {
                book:
                    STATE.currentBook,

                index:
                    STATE.currentIndex
            }
        );
    }


    /* ========================================================
       RENDER BASIC FIELD
       ======================================================== */

    function renderText(
        selector,
        value
    ) {

        const element =
            $(selector);

        if (!element) {
            return;
        }

        element.textContent =
            value == null
                ? ""
                : value;
    }


    /* ========================================================
       RENDER CURRENT BOOK
       ======================================================== */

    function renderBook(
        book
    ) {

        if (!book) {

            showError(
                "Book not found. Please return to the Library."
            );

            return;
        }

        hideError();

        renderText(
            CONFIG.selectors.title,
            book.title ||
            "Untitled Book"
        );

        renderText(
            CONFIG.selectors.author,
            book.author ||
            "ALON HISTORYVERSE 24"
        );

        renderText(
            CONFIG.selectors.category,
            book.category ||
            ""
        );

        renderText(
            CONFIG.selectors.level,
            book.level ||
            ""
        );

        renderText(
            CONFIG.selectors.description,
            book.description ||
            ""
        );

        renderText(
            CONFIG.selectors.department,
            book.department ||
            ""
        );

        renderText(
            CONFIG.selectors.subject,
            book.subject ||
            ""
        );

        renderContent(book);

        updateNavigation();

        applyFontSize();

        updateProgress();

        setStatus(
            "",
            "ready"
        );
    }


    /* ========================================================
       RENDER BOOK CONTENT
       ======================================================== */

    function renderContent(
        book
    ) {

        const reader =
            $(CONFIG.selectors.reader) ||
            $(CONFIG.selectors.content);

        if (!reader) {
            return;
        }

        const content =
            book.content ||
            book.text ||
            book.body ||
            book.read ||
            "";

        if (content) {

            const paragraphs =
                String(content)
                    .split(/\n{2,}/);

            reader.innerHTML =
                paragraphs
                    .map(
                        function (paragraph) {

                            return (
                                "<p>" +
                                escapeHTML(
                                    paragraph
                                )
                                .replace(
                                    /\n/g,
                                    "<br>"
                                ) +
                                "</p>"
                            );
                        }
                    )
                    .join("");

        } else {

            reader.innerHTML = `

                <div class="reader-empty">

                    <h3>
                        Reading Content
                    </h3>

                    <p>
                        This book entry currently
                        contains metadata and description,
                        but detailed reading content has
                        not been added yet.
                    </p>

                    <p>
                        ALON HISTORYVERSE 24
                        content can be expanded here
                        in future versions.
                    </p>

                </div>

            `;
        }

        reader.style.fontSize =
            STATE.fontSize + "px";
    }


    /* ========================================================
       SEARCH BOOKS
       ======================================================== */

    function searchBooks(
        query
    ) {

        const value =
            String(
                query || ""
            )
            .trim()
            .toLowerCase();

        if (!value) {
            return STATE.books.slice();
        }

        return STATE.books.filter(
            function (book) {

                const text = [

                    book.id,

                    book.title,

                    book.author,

                    book.category,

                    book.level,

                    book.description,

                    book.department,

                    book.subject

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

                return text.includes(value);
            }
        );
    }


    /* ========================================================
       RENDER SEARCH RESULTS
       ======================================================== */

    function renderSearchResults(
        results,
        container
    ) {

        if (!container) {
            return;
        }

        if (!results.length) {

            container.innerHTML = `

                <div class="reader-search-empty">

                    No books found.

                </div>

            `;

            return;
        }

        container.innerHTML =
            results.map(
                function (book) {

                    const id =
                        book.id ||
                        slugify(book.title);

                    return `

                        <button
                            type="button"
                            class="reader-book-result"
                            data-book-id="${escapeHTML(id)}"
                        >

                            <strong>
                                ${escapeHTML(
                                    book.title ||
                                    "Untitled"
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    book.author ||
                                    ""
                                )}
                            </span>

                            <small>
                                ${escapeHTML(
                                    book.category ||
                                    ""
                                )}
                            </small>

                        </button>

                    `;
                }
            )
            .join("");

        $$(".reader-book-result", container)
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const id =
                                button.dataset.bookId;

                            openBook(id);
                        }
                    );
                }
            );
    }


    /* ========================================================
       NAVIGATION
       ======================================================== */

    function updateNavigation() {

        const previous =
            $(
                "#previousBook, [data-previous-book]"
            );

        const next =
            $(
                "#nextBook, [data-next-book]"
            );

        const current =
            STATE.currentIndex;

        if (previous) {

            const hasPrevious =
                current > 0;

            previous.disabled =
                !hasPrevious;

            previous.setAttribute(
                "aria-disabled",
                String(!hasPrevious)
            );
        }

        if (next) {

            const hasNext =
                current >= 0 &&
                current <
                STATE.books.length - 1;

            next.disabled =
                !hasNext;

            next.setAttribute(
                "aria-disabled",
                String(!hasNext)
            );
        }
    }


    function openBook(
        identifier
    ) {

        const book =
            findBook(identifier);

        if (!book) {

            showError(
                "Requested book was not found."
            );

            return false;
        }

        const id =
            book.id ||
            slugify(book.title);

        try {

            const url =
                new URL(
                    window.location.href
                );

            url.searchParams.set(
                "book",
                id
            );

            window.history.pushState(
                {
                    book: id
                },
                "",
                url
            );

        } catch (error) {

            /* URL update is optional */
        }

        setCurrentBook(book);

        renderBook(book);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return true;
    }


    function openPrevious() {

        if (
            STATE.currentIndex <= 0
        ) {
            return false;
        }

        const book =
            STATE.books[
                STATE.currentIndex - 1
            ];

        return openBook(
            book.id ||
            slugify(book.title)
        );
    }


    function openNext() {

        if (
            STATE.currentIndex < 0 ||
            STATE.currentIndex >=
                STATE.books.length - 1
        ) {
            return false;
        }

        const book =
            STATE.books[
                STATE.currentIndex + 1
            ];

        return openBook(
            book.id ||
            slugify(book.title)
        );
    }


    /* ========================================================
       FONT SIZE
       ======================================================== */

    function loadFontSize() {

        const saved =
            readStorage(
                CONFIG.storageKeys.fontSize
            );

        if (!saved) {
            return;
        }

        const number =
            Number(saved);

        if (
            Number.isFinite(number) &&
            number >= 12 &&
            number <= 32
        ) {

            STATE.fontSize =
                number;
        }
    }


    function saveFontSize() {

        writeStorage(
            CONFIG.storageKeys.fontSize,
            String(STATE.fontSize)
        );
    }


    function applyFontSize() {

        const reader =
            $(CONFIG.selectors.reader) ||
            $(CONFIG.selectors.content);

        if (reader) {

            reader.style.fontSize =
                STATE.fontSize + "px";
        }

        document.documentElement.style
            .setProperty(
                "--alon-reader-font-size",
                STATE.fontSize + "px"
            );
    }


    function increaseFontSize() {

        STATE.fontSize =
            Math.min(
                32,
                STATE.fontSize + 1
            );

        saveFontSize();
        applyFontSize();

        dispatch(
            "alon:reader-font-size-change",
            {
                fontSize:
                    STATE.fontSize
            }
        );
    }


    function decreaseFontSize() {

        STATE.fontSize =
            Math.max(
                12,
                STATE.fontSize - 1
            );

        saveFontSize();
        applyFontSize();

        dispatch(
            "alon:reader-font-size-change",
            {
                fontSize:
                    STATE.fontSize
            }
        );
    }


    function resetFontSize() {

        STATE.fontSize = 18;

        saveFontSize();
        applyFontSize();
    }


    /* ========================================================
       READING PROGRESS
       ======================================================== */

    function getReaderElement() {

        return (
            $(
                CONFIG.selectors.reader
            ) ||
            $(
                CONFIG.selectors.content
            )
        );
    }


    function calculateProgress() {

        const reader =
            getReaderElement();

        if (!reader) {
            return 0;
        }

        const scrollTop =
            window.scrollY ||
            window.pageYOffset ||
            0;

        const readerTop =
            reader.getBoundingClientRect()
                .top +
            scrollTop;

        const readerHeight =
            reader.scrollHeight;

        const viewport =
            window.innerHeight;

        const total =
            readerHeight -
            viewport;

        if (total <= 0) {
            return 100;
        }

        const value =
            (
                (scrollTop -
                    readerTop) /
                total
            ) * 100;

        return Math.max(
            0,
            Math.min(
                100,
                value
            )
        );
    }


    function updateProgress() {

        STATE.progress =
            calculateProgress();

        const progress =
            $(CONFIG.selectors.progress);

        if (!progress) {
            return;
        }

        const value =
            Math.round(
                STATE.progress
            );

        if (
            progress.tagName ===
            "PROGRESS"
        ) {

            progress.value =
                value;

            progress.max =
                100;

        } else {

            progress.style.width =
                value + "%";

            progress.setAttribute(
                "aria-valuenow",
                String(value)
            );
        }
    }


    /* ========================================================
       SAVE READING POSITION
       ======================================================== */

    function saveReadingProgress() {

        if (
            !STATE.currentBookId
        ) {
            return;
        }

        const data =
            readJSON(
                CONFIG.storageKeys
                    .readingProgress
            ) || {};

        data[
            STATE.currentBookId
        ] = {

            progress:
                STATE.progress,

            scrollY:
                window.scrollY ||
                window.pageYOffset ||
                0,

            updatedAt:
                new Date().toISOString()
        };

        writeJSON(
            CONFIG.storageKeys
                .readingProgress,
            data
        );
    }


    function loadReadingProgress() {

        if (
            !STATE.currentBookId
        ) {
            return;
        }

        const data =
            readJSON(
                CONFIG.storageKeys
                    .readingProgress
            ) || {};

        const saved =
            data[
                STATE.currentBookId
            ];

        if (!saved) {
            return;
        }

        setTimeout(
            function () {

                if (
                    Number.isFinite(
                        Number(
                            saved.scrollY
                        )
                    )
                ) {

                    window.scrollTo({
                        top:
                            Number(
                                saved.scrollY
                            ),
                        behavior: "auto"
                    });
                }

                updateProgress();

            },
            250
        );
    }


    /* ========================================================
       SEARCH EVENTS
       ======================================================== */

    function setupSearch() {

        const input =
            $(
                CONFIG.selectors.search
            );

        if (!input) {
            return;
        }

        let container =
            $(
                "#readSearchResults, [data-read-results]"
            );

        if (!container) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "readSearchResults";

            input.parentNode &&
                input.parentNode.appendChild(
                    container
                );
        }

        input.addEventListener(
            "input",
            function () {

                const results =
                    searchBooks(
                        input.value
                    );

                renderSearchResults(
                    results,
                    container
                );
            }
        );
    }


    /* ========================================================
       BUTTON EVENTS
       ======================================================== */

    function setupButtons() {

        const previous =
            $(
                "#previousBook, [data-previous-book]"
            );

        const next =
            $(
                "#nextBook, [data-next-book]"
            );

        const increase =
            $(
                "#increaseFont, [data-font-increase]"
            );

        const decrease =
            $(
                "#decreaseFont, [data-font-decrease]"
            );

        const reset =
            $(
                "#resetFont, [data-font-reset]"
            );

        if (previous) {

            previous.addEventListener(
                "click",
                openPrevious
            );
        }

        if (next) {

            next.addEventListener(
                "click",
                openNext
            );
        }

        if (increase) {

            increase.addEventListener(
                "click",
                increaseFontSize
            );
        }

        if (decrease) {

            decrease.addEventListener(
                "click",
                decreaseFontSize
            );
        }

        if (reset) {

            reset.addEventListener(
                "click",
                resetFontSize
            );
        }
    }


    /* ========================================================
       SCROLL EVENTS
       ======================================================== */

    function setupScroll() {

        let ticking = false;

        window.addEventListener(
            "scroll",
            function () {

                if (ticking) {
                    return;
                }

                ticking = true;

                window.requestAnimationFrame(
                    function () {

                        updateProgress();

                        saveReadingProgress();

                        ticking = false;
                    }
                );
            },
            {
                passive: true
            }
        );
    }


    /* ========================================================
       POPSTATE
       ======================================================== */

    function setupHistory() {

        window.addEventListener(
            "popstate",
            function () {

                const id =
                    getBookParameter();

                if (id) {
                    openBook(id);
                }
            }
        );
    }


    /* ========================================================
       KEYBOARD SHORTCUTS
       ======================================================== */

    function setupKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.target &&
                    (
                        event.target.tagName ===
                            "INPUT" ||
                        event.target.tagName ===
                            "TEXTAREA"
                    )
                ) {
                    return;
                }

                if (
                    event.key ===
                    "+"
                ) {

                    increaseFontSize();
                }

                if (
                    event.key ===
                    "-"
                ) {

                    decreaseFontSize();
                }

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    openPrevious();
                }

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    openNext();
                }
            }
        );
    }


    /* ========================================================
       INITIAL BOOK LOAD
       ======================================================== */

    async function loadCurrentBook() {

        const identifier =
            getBookParameter();

        if (!identifier) {

            setStatus(
                "No book selected.",
                "info"
            );

            return null;
        }

        const book =
            findBook(identifier);

        if (!book) {

            showError(
                "The requested book was not found in the library."
            );

            return null;
        }

        setCurrentBook(book);

        renderBook(book);

        return book;
    }


    /* ========================================================
       INITIALIZE
       ======================================================== */

    async function initialize() {

        if (STATE.initialized) {
            return STATE;
        }

        STATE.initialized = true;

        loadFontSize();

        setupSearch();

        setupButtons();

        setupScroll();

        setupHistory();

        setupKeyboard();

        try {

            await fetchLibrary();

            await loadCurrentBook();

            dispatch(
                "alon:read-ready",
                {
                    book:
                        STATE.currentBook,

                    books:
                        STATE.books.length
                }
            );

        } catch (error) {

            showError(
                error &&
                error.message
                    ? error.message
                    : "Unable to load the library."
            );

            dispatch(
                "alon:read-error",
                {
                    message:
                        error &&
                        error.message
                            ? error.message
                            : "Read engine error"
                }
            );
        }

        return STATE;
    }


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.ALON_READ = {

        config:
            CONFIG,

        state:
            STATE,

        initialize:
            initialize,

        load:
            fetchLibrary,

        findBook:
            findBook,

        openBook:
            openBook,

        openPrevious:
            openPrevious,

        openNext:
            openNext,

        search:
            searchBooks,

        getCurrentBook:
            function () {
                return STATE.currentBook;
            },

        getBooks:
            function () {
                return STATE.books.slice();
            },

        getProgress:
            function () {
                return STATE.progress;
            },

        updateProgress:
            updateProgress,

        saveProgress:
            saveReadingProgress,

        increaseFontSize:
            increaseFontSize,

        decreaseFontSize:
            decreaseFontSize,

        resetFontSize:
            resetFontSize,

        getFontSize:
            function () {
                return STATE.fontSize;
            }
    };


    /* ========================================================
       COMPATIBILITY GLOBAL
       ======================================================== */

    window.ALON_READ_ENGINE =
        window.ALON_READ;


    /* ========================================================
       AUTO INITIALIZE
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {
                initialize();
            },
            {
                once: true
            }
        );

    } else {

        initialize();
    }


})(window, document);


/* ============================================================
   END OF ALON HISTORYVERSE 24 READ ENGINE
   ============================================================ */