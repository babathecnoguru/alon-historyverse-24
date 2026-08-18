/* =========================================================
   ALON HISTORYVERSE 24 — V100
   FILE: jss/read.js

   LIBRARY READ CHANNEL MASTER ENGINE
   Creator / Owner: Baba Thecno Guru

   CONNECTS:
   library-engine.js
   book.html
   read.html

   FEATURES:
   - Book URL loading
   - Book information
   - Read page rendering
   - Article/content loading
   - Search compatibility
   - Back navigation
   - Mobile menu compatibility
   - LocalStorage
   - Reading progress
   - Recent books
   - Safe HTML escaping
   - Notifications
   - Accessibility
   - Duplicate initialization protection
   - Public API
========================================================= */


/* =========================================================
   01. GLOBAL CONFIG
========================================================= */

const READ_CONFIG = {

    name:
        "ALON HISTORYVERSE 24",

    creator:
        "Baba Thecno Guru",

    version:
        "V100-READ-FINAL",

    storageKey:
        "alon_historyverse_read",

    pages: {

        library:
            "library.html",

        department:
            "department.html",

        subject:
            "subject.html",

        book:
            "book.html",

        read:
            "read.html"

    }

};


/* =========================================================
   02. READ STATE
========================================================= */

const ReadEngine = {

    initialized:
        false,

    book:
        null,

    bookId:
        "",

    progress:
        0,

    error:
        false

};


/* =========================================================
   03. SAFE TEXT
========================================================= */

function readText(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }

    return String(value).trim();

}


/* =========================================================
   04. ESCAPE HTML
========================================================= */

function escapeRead(value) {

    return readText(value)

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
   05. LIBRARY ENGINE BRIDGE
========================================================= */

function readLibraryEngine() {

    return (
        window.ALON_HISTORYVERSE_LIBRARY ||
        null
    );

}


/* =========================================================
   06. GET URL PARAMETER
========================================================= */

function getReadParameter(
    name
) {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        return readText(
            params.get(name)
        )
        .toLowerCase();

    }
    catch (error) {

        return "";

    }

}


/* =========================================================
   07. GET CURRENT BOOK ID
========================================================= */

function getCurrentBookId() {

    return getReadParameter(
        "book"
    );

}


/* =========================================================
   08. GET BOOK
========================================================= */

function findReadBook(
    bookId
) {

    const library =
        readLibraryEngine();

    if (
        library &&
        typeof library.getBook ===
            "function"
    ) {

        return library.getBook(
            bookId
        );

    }


    /*
       Safe fallback.

       This is only used if the
       library engine has not loaded.
    */

    if (
        typeof LIBRARY_DATA !==
        "undefined" &&
        Array.isArray(
            LIBRARY_DATA.books
        )
    ) {

        return LIBRARY_DATA.books.find(
            book =>
                book.id ===
                String(bookId)
                    .trim()
                    .toLowerCase()
        );

    }


    return null;

}


/* =========================================================
   09. STORAGE
========================================================= */

function loadReadState() {

    try {

        const raw =
            localStorage.getItem(
                READ_CONFIG.storageKey
            );

        if (!raw) {

            return {

                lastBook:
                    "",

                recentBooks:
                    [],

                progress:
                    {}

            };

        }


        const data =
            JSON.parse(raw);


        return {

            lastBook:
                data.lastBook ||
                "",

            recentBooks:
                Array.isArray(
                    data.recentBooks
                )
                    ? data.recentBooks
                    : [],

            progress:
                data.progress &&
                typeof data.progress ===
                    "object"
                    ? data.progress
                    : {}

        };

    }
    catch (error) {

        return {

            lastBook:
                "",

            recentBooks:
                [],

            progress:
                {}

        };

    }

}


/* =========================================================
   10. SAVE STORAGE
========================================================= */

function saveReadState(
    state
) {

    try {

        localStorage.setItem(
            READ_CONFIG.storageKey,
            JSON.stringify(
                state
            )
        );

        return true;

    }
    catch (error) {

        console.warn(
            "ALON Read: storage save failed.",
            error
        );

        return false;

    }

}


/* =========================================================
   11. REMEMBER BOOK
========================================================= */

function rememberReadBook(
    bookId
) {

    if (!bookId) {

        return;

    }


    const state =
        loadReadState();


    state.lastBook =
        bookId;


    state.recentBooks =
        state.recentBooks.filter(
            id =>
                id !== bookId
        );


    state.recentBooks.unshift(
        bookId
    );


    if (
        state.recentBooks.length >
        20
    ) {

        state.recentBooks =
            state.recentBooks.slice(
                0,
                20
            );

    }


    saveReadState(
        state
    );

}


/* =========================================================
   12. READING PROGRESS
========================================================= */

function loadReadProgress(
    bookId
) {

    if (!bookId) {

        return 0;

    }


    const state =
        loadReadState();


    const value =
        Number(
            state.progress?.[
                bookId
            ]
        );


    if (
        !Number.isFinite(value)
    ) {

        return 0;

    }


    return Math.max(
        0,
        Math.min(
            100,
            value
        )
    );

}


/* =========================================================
   13. SAVE READING PROGRESS
========================================================= */

function saveReadProgress(
    bookId,
    progress
) {

    if (!bookId) {

        return;

    }


    const state =
        loadReadState();


    if (!state.progress) {

        state.progress =
            {};

    }


    state.progress[
        bookId
    ] =
        Math.max(
            0,
            Math.min(
                100,
                Number(progress) || 0
            )
        );


    saveReadState(
        state
    );

}


/* =========================================================
   14. PAGE CHECK
========================================================= */

function isReadPage() {

    return (
        document.body?.dataset?.page ===
        "library-read"
    );

}


/* =========================================================
   15. UPDATE TEXT ELEMENT
========================================================= */

function setReadText(
    selector,
    value
) {

    const element =
        document.querySelector(
            selector
        );

    if (!element) {

        return;

    }


    element.textContent =
        readText(value);

}


/* =========================================================
   16. RENDER BOOK HEADER
========================================================= */

function renderReadHeader(
    book
) {

    if (!book) {

        return;

    }


    /*
       Title
    */

    document
        .querySelectorAll(
            "[data-read-title]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.title || "";

            }
        );


    /*
       Description
    */

    document
        .querySelectorAll(
            "[data-read-description]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.description || "";

            }
        );


    /*
       Icon
    */

    document
        .querySelectorAll(
            "[data-read-icon]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.icon || "📖";

            }
        );


    /*
       Subject
    */

    document
        .querySelectorAll(
            "[data-read-subject]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.subject || "";

            }
        );


    /*
       Category
    */

    document
        .querySelectorAll(
            "[data-read-category]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.category || "";

            }
        );


    /*
       ID
    */

    document
        .querySelectorAll(
            "[data-read-book-id]"
        )
        .forEach(
            element => {

                element.textContent =
                    book.id || "";

            }
        );


    /*
       Status
    */

    document
        .querySelectorAll(
            "[data-read-status]"
        )
        .forEach(
            element => {

                element.textContent =
                    "Reading: " +
                    (
                        book.title ||
                        "Book"
                    );

            }
        );


    /*
       Document title
    */

    if (book.title) {

        document.title =
            book.title +
            " — ALON HISTORYVERSE 24";

    }

}


/* =========================================================
   17. RENDER BOOK CONTENT
========================================================= */

function renderReadContent(
    book
) {

    if (!book) {

        return;

    }


    const content =
        document.querySelector(
            "[data-read-content]"
        );


    if (!content) {

        return;

    }


    /*
       If the HTML page already
       contains book content,
       don't destroy it.
    */

    const existing =
        content.innerHTML.trim();


    /*
       Book objects currently contain
       description but not a full
       chapter database.

       Therefore show a safe
       library reading introduction.
    */

    if (!existing) {

        content.innerHTML = `

            <section
                class="read-book-introduction"
            >

                <div
                    class="read-book-icon"
                    aria-hidden="true"
                >
                    ${escapeRead(
                        book.icon || "📖"
                    )}
                </div>

                <h2>
                    ${escapeRead(
                        book.title
                    )}
                </h2>

                <p>
                    ${escapeRead(
                        book.description ||
                        "This book is part of the ALON HISTORYVERSE 24 Library."
                    )}
                </p>

                <div
                    class="read-book-message"
                    role="note"
                >
                    <strong>
                        ALON HISTORYVERSE 24
                    </strong>

                    <p>
                        This knowledge channel is
                        being prepared for reading.
                        More chapters and historical
                        knowledge can be connected
                        here without changing the
                        Library structure.
                    </p>

                </div>

            </section>

        `;

    }

}


/* =========================================================
   18. RENDER BOOK META
========================================================= */

function renderReadMeta(
    book
) {

    if (!book) {

        return;

    }


    const mappings = {

        title:
            book.title,

        subject:
            book.subject,

        category:
            book.category,

        description:
            book.description

    };


    Object.entries(
        mappings
    )
    .forEach(
        ([key, value]) => {

            document
                .querySelectorAll(
                    `[data-read-meta="${key}"]`
                )
                .forEach(
                    element => {

                        element.textContent =
                            readText(
                                value
                            );

                    }
                );

        }
    );

}


/* =========================================================
   19. READING PROGRESS UI
========================================================= */

function updateReadProgressUI(
    progress
) {

    const value =
        Math.max(
            0,
            Math.min(
                100,
                Number(progress) || 0
            )
        );


    document
        .querySelectorAll(
            "[data-read-progress]"
        )
        .forEach(
            element => {

                if (
                    element.tagName ===
                    "PROGRESS"
                ) {

                    element.value =
                        value;

                }
                else {

                    element.style.width =
                        value + "%";

                }

            }
        );


    document
        .querySelectorAll(
            "[data-read-progress-text]"
        )
        .forEach(
            element => {

                element.textContent =
                    Math.round(value) +
                    "% read";

            }
        );


    const progressInput =
        document.querySelector(
            "[data-read-progress-input]"
        );


    if (progressInput) {

        progressInput.value =
            value;

    }

}


/* =========================================================
   20. CALCULATE SCROLL PROGRESS
========================================================= */

function calculateReadProgress() {

    const content =
        document.querySelector(
            "[data-read-content]"
        );


    if (!content) {

        return 0;

    }


    const rect =
        content.getBoundingClientRect();


    const viewportHeight =
        window.innerHeight ||
        document.documentElement.clientHeight;


    const contentHeight =
        content.scrollHeight;


    if (
        contentHeight <=
        viewportHeight
    ) {

        return 100;

    }


    const top =
        window.scrollY +
        rect.top;


    const current =
        window.scrollY -
        top +
        viewportHeight;


    const progress =
        (
            current /
            contentHeight
        ) *
        100;


    return Math.max(
        0,
        Math.min(
            100,
            progress
        )
    );

}


/* =========================================================
   21. READ PROGRESS EVENTS
========================================================= */

function initReadProgress() {

    const bookId =
        ReadEngine.bookId;

    if (!bookId) {

        return;

    }


    const saved =
        loadReadProgress(
            bookId
        );


    ReadEngine.progress =
        saved;


    updateReadProgressUI(
        saved
    );


    if (
        document.documentElement.dataset
            .readScrollBound !==
        "true"
    ) {

        document.documentElement.dataset
            .readScrollBound =
            "true";


        let timer =
            null;


        window.addEventListener(
            "scroll",
            () => {

                window.clearTimeout(
                    timer
                );


                timer =
                    window.setTimeout(
                        () => {

                            const progress =
                                calculateReadProgress();


                            ReadEngine.progress =
                                progress;


                            saveReadProgress(
                                bookId,
                                progress
                            );


                            updateReadProgressUI(
                                progress
                            );

                        },
                        100
                    );

            },
            {
                passive: true
            }
        );

    }

}


/* =========================================================
   22. BACK TO BOOK
========================================================= */

function goBackToBook() {

    const bookId =
        ReadEngine.bookId ||
        getCurrentBookId();


    if (bookId) {

        window.location.assign(
            READ_CONFIG.pages.book +
            "?subject=" +
            encodeURIComponent(
                ReadEngine.book?.subject ||
                ""
            )
        );

        return true;

    }


    window.location.assign(
        READ_CONFIG.pages.library
    );

    return true;

}


/* =========================================================
   23. BACK TO LIBRARY
========================================================= */

function goBackToLibrary() {

    window.location.assign(
        READ_CONFIG.pages.library
    );

    return true;

}


/* =========================================================
   24. ROUTING BUTTONS
========================================================= */

function initReadNavigation() {

    if (
        document.documentElement.dataset
            .readNavigationBound ===
        "true"
    ) {

        return;

    }


    document.documentElement.dataset
        .readNavigationBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const backBook =
                event.target.closest(
                    "[data-read-back-book]"
                );


            if (backBook) {

                event.preventDefault();

                goBackToBook();

                return;

            }


            const backLibrary =
                event.target.closest(
                    "[data-read-back-library]"
                );


            if (backLibrary) {

                event.preventDefault();

                goBackToLibrary();

                return;

            }


            const home =
                event.target.closest(
                    "[data-read-library]"
                );


            if (home) {

                event.preventDefault();

                goBackToLibrary();

            }

        }
    );

}


/* =========================================================
   25. READ SEARCH
========================================================= */

function initReadSearch() {

    const inputs =
        document.querySelectorAll(
            "[data-read-search]"
        );


    inputs.forEach(
        input => {

            if (
                input.dataset.readSearchBound ===
                "true"
            ) {

                return;

            }


            input.dataset.readSearchBound =
                "true";


            input.addEventListener(
                "input",
                () => {

                    const query =
                        readText(
                            input.value
                        )
                        .toLowerCase();


                    const content =
                        document.querySelector(
                            "[data-read-content]"
                        );


                    if (!content) {

                        return;

                    }


                    const paragraphs =
                        content.querySelectorAll(
                            "p, h2, h3, h4, li"
                        );


                    paragraphs.forEach(
                        element => {

                            if (!query) {

                                element.hidden =
                                    false;

                                return;

                            }


                            element.hidden =
                                !element
                                    .textContent
                                    .toLowerCase()
                                    .includes(
                                        query
                                    );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   26. NOTIFICATION
========================================================= */

function readNotify(
    message,
    type = "info"
) {

    const library =
        readLibraryEngine();


    if (
        library &&
        typeof library.notify ===
            "function"
    ) {

        library.notify(
            message,
            type
        );

        return;

    }


    const box =
        document.querySelector(
            "[data-notifications]"
        );


    if (!box) {

        return;

    }


    box.textContent =
        readText(message);


    box.dataset.type =
        type;


    box.classList.add(
        "show"
    );


    setTimeout(
        () => {

            box.classList.remove(
                "show"
            );

        },
        2500
    );

}


/* =========================================================
   27. INVALID BOOK
========================================================= */

function showInvalidBook() {

    ReadEngine.error =
        true;


    const title =
        document.querySelector(
            "[data-read-title]"
        );


    const description =
        document.querySelector(
            "[data-read-description]"
        );


    const status =
        document.querySelector(
            "[data-read-status]"
        );


    if (title) {

        title.textContent =
            "Book Not Found";

    }


    if (description) {

        description.textContent =
            "The requested book could not be found in the ALON HISTORYVERSE 24 Library.";

    }


    if (status) {

        status.textContent =
            "Book unavailable";

    }


    const content =
        document.querySelector(
            "[data-read-content]"
        );


    if (content) {

        content.innerHTML = `

            <section
                class="read-error-card"
                role="alert"
            >

                <h2>
                    📖 Book Not Found
                </h2>

                <p>
                    The requested book does not
                    exist in the current Library data.
                </p>

                <button
                    type="button"
                    data-read-back-library
                >
                    Back to Library
                </button>

            </section>

        `;

    }


    readNotify(
        "Book not found.",
        "warning"
    );

}


/* =========================================================
   28. ACCESSIBILITY
========================================================= */

function setupReadAccessibility() {

    document
        .querySelectorAll(
            "[data-read-content]"
        )
        .forEach(
            content => {

                content.setAttribute(
                    "aria-live",
                    "polite"
                );

            }
        );


    document
        .querySelectorAll(
            "[data-read-title]"
        )
        .forEach(
            title => {

                if (
                    !title.id
                ) {

                    title.id =
                        "read-book-title";

                }

            }
        );


    document
        .querySelectorAll(
            "[data-read-content]"
        )
        .forEach(
            content => {

                const title =
                    document.querySelector(
                        "[data-read-title]"
                    );


                if (
                    title &&
                    title.id
                ) {

                    content.setAttribute(
                        "aria-labelledby",
                        title.id
                    );

                }

            }
        );

}


/* =========================================================
   29. YEAR
========================================================= */

function setReadYear() {

    document
        .querySelectorAll(
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
   30. BOOK LOADING
========================================================= */

function loadReadBook() {

    if (!isReadPage()) {

        return false;

    }


    const bookId =
        getCurrentBookId();


    ReadEngine.bookId =
        bookId;


    if (!bookId) {

        showInvalidBook();

        return false;

    }


    const book =
        findReadBook(
            bookId
        );


    if (!book) {

        showInvalidBook();

        return false;

    }


    ReadEngine.book =
        book;


    ReadEngine.error =
        false;


    rememberReadBook(
        book.id
    );


    renderReadHeader(
        book
    );


    renderReadMeta(
        book
    );


    renderReadContent(
        book
    );


    return true;

}


/* =========================================================
   31. READY EVENT
========================================================= */

function dispatchReadReady() {

    document.dispatchEvent(
        new CustomEvent(
            "historyverse:read-ready",
            {
                detail: {

                    engine:
                        ReadEngine,

                    book:
                        ReadEngine.book,

                    bookId:
                        ReadEngine.bookId

                }
            }
        )
    );

}


/* =========================================================
   32. MASTER INITIALIZATION
========================================================= */

function initializeRead() {

    if (
        ReadEngine.initialized
    ) {

        return ReadEngine;

    }


    /*
       Only activate the Read Engine
       on the actual Read page.
    */

    if (!isReadPage()) {

        return ReadEngine;

    }


    try {

        /*
           Load selected book.
        */

        loadReadBook();


        /*
           Reading progress.
        */

        initReadProgress();


        /*
           Navigation.
        */

        initReadNavigation();


        /*
           Search.
        */

        initReadSearch();


        /*
           Accessibility.
        */

        setupReadAccessibility();


        /*
           Year.
        */

        setReadYear();


        ReadEngine.initialized =
            true;


        document.documentElement.dataset
            .readReady =
            "true";


        document.body
            ?.classList
            .add(
                "read-ready"
            );


        dispatchReadReady();


        console.log(
            "ALON HISTORYVERSE 24 Read Engine ready:",
            {
                version:
                    READ_CONFIG.version,

                book:
                    ReadEngine.book,

                bookId:
                    ReadEngine.bookId
            }
        );


        return ReadEngine;

    }
    catch (error) {

        console.error(
            "ALON Read Engine initialization error:",
            error
        );


        ReadEngine.error =
            true;


        return ReadEngine;

    }

}


/* =========================================================
   33. PUBLIC API
========================================================= */

window.ALON_HISTORYVERSE_READ = {

    config:
        READ_CONFIG,

    state:
        ReadEngine,

    init:
        initializeRead,

    getBook:
        () =>
            ReadEngine.book,

    getBookId:
        () =>
            ReadEngine.bookId,

    loadBook:
        loadReadBook,

    progress:
        () =>
            ReadEngine.progress,

    saveProgress:
        saveReadProgress,

    loadProgress:
        loadReadProgress,

    backToBook:
        goBackToBook,

    backToLibrary:
        goBackToLibrary,

    notify:
        readNotify

};


/* =========================================================
   34. AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            /*
               library-engine.js may also
               be loaded on this page.

               Its own Read handler will
               safely run without creating
               duplicate menu handlers.
            */

            initializeRead();

        },
        {
            once: true
        }
    );

}
else {

    initializeRead();

}


/* =========================================================
   END OF ALON HISTORYVERSE 24 V100
   READ CHANNEL MASTER ENGINE
========================================================= */