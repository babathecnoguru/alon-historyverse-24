/* =========================================================
   ALON HISTORYVERSE 24 — V100
   FILE: jss/library-engine.js

   LIBRARY CHANNEL MASTER ENGINE — FINAL FIXED
   Creator / Owner: Baba Thecno Guru

   CONNECTS:
   library.html
   department.html
   subject.html
   book.html
   read.html

   IMPORTANT:
   - Matches the REAL library.html structure.
   - Supports data-menu-toggle.
   - Supports #mobile-menu.
   - Prevents duplicate menu handlers.
   - Safe navigation.
   - Library routing.
   - Subject / Book / Read routing.
   - Search.
   - LocalStorage.
   - Language compatibility.
========================================================= */


/* =========================================================
   GLOBAL CONFIG
========================================================= */

const LIBRARY_CONFIG = {

    name: "ALON HISTORYVERSE 24",

    creator: "Baba Thecno Guru",

    version: "V100-LIBRARY-FINAL-2",

    storageKey:
        "alon_historyverse_library",

    pages: {

        library: "library.html",

        department: "department.html",

        subject: "subject.html",

        book: "book.html",

        read: "read.html"

    }

};


/* =========================================================
   LIBRARY DATA
========================================================= */

const LIBRARY_DATA = {

    departments: [

        {
            id: "history",
            title: "History",
            icon: "📜",
            description:
                "History, civilizations, empires and historical events."
        },

        {
            id: "science",
            title: "Science",
            icon: "🔬",
            description:
                "Science, discoveries, experiments and scientific knowledge."
        },

        {
            id: "technology",
            title: "Technology",
            icon: "💻",
            description:
                "Computers, programming, digital systems and technology."
        },

        {
            id: "nature",
            title: "Nature",
            icon: "🌿",
            description:
                "Nature, forests, mountains, wildlife and ecosystems."
        },

        {
            id: "career",
            title: "Jobs & Careers",
            icon: "💼",
            description:
                "Jobs, careers, qualifications, skills and employment."
        },

        {
            id: "culture",
            title: "Culture",
            icon: "🎭",
            description:
                "Culture, traditions, languages, arts and heritage."
        }

    ],


    subjects: [

        {
            id: "history",
            title: "History",
            category: "humanities",
            icon: "📜"
        },

        {
            id: "civilization",
            title: "Civilization",
            category: "humanities",
            icon: "🏛️"
        },

        {
            id: "science",
            title: "Science",
            category: "science",
            icon: "🔬"
        },

        {
            id: "physics",
            title: "Physics",
            category: "science",
            icon: "⚛️"
        },

        {
            id: "mathematics",
            title: "Mathematics",
            category: "science",
            icon: "➗"
        },

        {
            id: "biology",
            title: "Biology",
            category: "science",
            icon: "🧬"
        },

        {
            id: "computer",
            title: "Computer",
            category: "technology",
            icon: "💻"
        },

        {
            id: "programming",
            title: "Programming",
            category: "technology",
            icon: "👨‍💻"
        },

        {
            id: "technology",
            title: "Technology",
            category: "technology",
            icon: "⚙️"
        },

        {
            id: "geography",
            title: "Geography",
            category: "humanities",
            icon: "🗺️"
        },

        {
            id: "culture",
            title: "Culture",
            category: "humanities",
            icon: "🎭"
        },

        {
            id: "nature",
            title: "Nature",
            category: "nature",
            icon: "🌿"
        },

        {
            id: "mountains",
            title: "Mountains",
            category: "nature",
            icon: "🏔️"
        },

        {
            id: "forests",
            title: "Forests & Trees",
            category: "nature",
            icon: "🌳"
        },

        {
            id: "jobs",
            title: "Jobs & Careers",
            category: "career",
            icon: "💼"
        },

        {
            id: "education",
            title: "Education",
            category: "career",
            icon: "🎓"
        },

        {
            id: "law",
            title: "Law",
            category: "humanities",
            icon: "⚖️"
        },

        {
            id: "arts",
            title: "Arts",
            category: "humanities",
            icon: "🎨"
        }

    ],


    books: [

        {
            id: "science-knowledge",
            title: "Science Knowledge",
            subject: "science",
            category: "science",
            icon: "🔬",
            description:
                "General scientific knowledge, discoveries and concepts."
        },

        {
            id: "mathematics-knowledge",
            title: "Mathematics Knowledge",
            subject: "mathematics",
            category: "mathematics",
            icon: "➗",
            description:
                "Mathematical concepts, numbers, equations and ideas."
        },

        {
            id: "physics-knowledge",
            title: "Physics Knowledge",
            subject: "physics",
            category: "science",
            icon: "⚛️",
            description:
                "Matter, energy, motion, forces and physical laws."
        },

        {
            id: "biology-knowledge",
            title: "Biology Knowledge",
            subject: "biology",
            category: "science",
            icon: "🧬",
            description:
                "Life, organisms, cells, evolution and living systems."
        },

        {
            id: "computer-knowledge",
            title: "Computer Knowledge",
            subject: "computer",
            category: "computer",
            icon: "💻",
            description:
                "Computers, hardware, software, programming and digital knowledge."
        },

        {
            id: "programming-knowledge",
            title: "Programming Knowledge",
            subject: "programming",
            category: "computer",
            icon: "👨‍💻",
            description:
                "Programming languages, algorithms and software development."
        },

        {
            id: "technology-knowledge",
            title: "Technology Knowledge",
            subject: "technology",
            category: "computer",
            icon: "⚙️",
            description:
                "Modern technology, inventions, innovation and digital systems."
        },

        {
            id: "history-knowledge",
            title: "History Knowledge",
            subject: "history",
            category: "history",
            icon: "📜",
            description:
                "Historical events, civilizations, people and important eras."
        },

        {
            id: "civilization-knowledge",
            title: "Civilization Knowledge",
            subject: "civilization",
            category: "history",
            icon: "🏛️",
            description:
                "Ancient and modern civilizations and human development."
        },

        {
            id: "cities",
            title: "Cities",
            subject: "geography",
            category: "cities",
            icon: "🏙️",
            description:
                "Cities, urban development, architecture and local knowledge."
        },

        {
            id: "villages",
            title: "Villages",
            subject: "culture",
            category: "villages",
            icon: "🏡",
            description:
                "Rural life, villages, traditions and local history."
        },

        {
            id: "mountains",
            title: "Mountains",
            subject: "mountains",
            category: "nature",
            icon: "🏔️",
            description:
                "Mountain ranges, geology, landscapes and natural history."
        },

        {
            id: "forests-trees",
            title: "Forests & Trees",
            subject: "forests",
            category: "nature",
            icon: "🌳",
            description:
                "Trees, forests, ecosystems and natural history."
        },

        {
            id: "nature-knowledge",
            title: "Nature Knowledge",
            subject: "nature",
            category: "nature",
            icon: "🌿",
            description:
                "Natural environments, ecosystems and wildlife."
        },

        {
            id: "literature",
            title: "Literature",
            subject: "arts",
            category: "literature",
            icon: "📖",
            description:
                "Writing, stories, poetry and literary knowledge."
        },

        {
            id: "jobs-careers",
            title: "Jobs & Careers",
            subject: "jobs",
            category: "career",
            icon: "💼",
            description:
                "Career paths, jobs, qualifications, skills and employment."
        },

        {
            id: "government-jobs",
            title: "Government Jobs",
            subject: "jobs",
            category: "career",
            icon: "🏛️",
            description:
                "General information about government career paths and examinations."
        },

        {
            id: "private-jobs",
            title: "Private Jobs",
            subject: "jobs",
            category: "career",
            icon: "🏢",
            description:
                "Private-sector careers, skills and professional opportunities."
        },

        {
            id: "computer-jobs",
            title: "Computer Jobs",
            subject: "computer",
            category: "career",
            icon: "🧑‍💻",
            description:
                "Computer-related careers, technical skills and digital professions."
        },

        {
            id: "education-careers",
            title: "Education & Careers",
            subject: "education",
            category: "career",
            icon: "🎓",
            description:
                "Education, qualifications, learning and career development."
        }

    ]

};


/* =========================================================
   DEFAULT STORAGE
========================================================= */

function createDefaultLibraryState() {

    return {

        version:
            LIBRARY_CONFIG.version,

        lastPage: "",

        lastSubject: "",

        lastBook: "",

        history: []

    };

}


/* =========================================================
   STORAGE — SAFE
========================================================= */

function loadLibraryState() {

    try {

        const raw =
            localStorage.getItem(
                LIBRARY_CONFIG.storageKey
            );

        if (!raw) {

            return createDefaultLibraryState();

        }

        const data =
            JSON.parse(raw);

        return {

            version:
                data.version ||
                LIBRARY_CONFIG.version,

            lastPage:
                data.lastPage || "",

            lastSubject:
                data.lastSubject || "",

            lastBook:
                data.lastBook || "",

            history:
                Array.isArray(data.history)
                    ? data.history
                    : []

        };

    } catch (error) {

        console.warn(
            "ALON Library: storage read failed.",
            error
        );

        return createDefaultLibraryState();

    }

}


function saveLibraryState(state) {

    try {

        localStorage.setItem(
            LIBRARY_CONFIG.storageKey,
            JSON.stringify(state)
        );

    } catch (error) {

        console.warn(
            "ALON Library: storage save failed.",
            error
        );

    }

}


/* =========================================================
   URL
========================================================= */

function getLibraryParams() {

    return new URLSearchParams(
        window.location.search
    );

}


function getParam(name) {

    return (
        getLibraryParams().get(name) || ""
    )
    .trim()
    .toLowerCase();

}


/* =========================================================
   SAFE PAGE NAVIGATION
========================================================= */

function libraryNavigate(
    page,
    params = {}
) {

    const target =
        LIBRARY_CONFIG.pages[page];

    if (!target) {

        console.warn(
            "ALON Library: invalid page:",
            page
        );

        return false;

    }

    const query =
        new URLSearchParams();

    Object.entries(params)
        .forEach(
            ([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {

                    query.set(
                        key,
                        String(value)
                    );

                }

            }
        );

    const url =
        query.toString()
            ? `${target}?${query.toString()}`
            : target;

    window.location.assign(url);

    return true;

}


/* =========================================================
   DATA LOOKUPS
========================================================= */

function getSubject(id) {

    const value =
        String(id || "")
            .trim()
            .toLowerCase();

    return LIBRARY_DATA.subjects.find(
        item =>
            item.id === value
    );

}


function getDepartment(id) {

    const value =
        String(id || "")
            .trim()
            .toLowerCase();

    return LIBRARY_DATA.departments.find(
        item =>
            item.id === value
    );

}


function getBook(id) {

    const value =
        String(id || "")
            .trim()
            .toLowerCase();

    return LIBRARY_DATA.books.find(
        item =>
            item.id === value
    );

}


function getBooksBySubject(subject) {

    const value =
        String(subject || "")
            .trim()
            .toLowerCase();

    return LIBRARY_DATA.books.filter(
        book =>
            book.subject === value
    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchLibrary(query) {

    const value =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!value) {

        return {

            subjects:
                [...LIBRARY_DATA.subjects],

            books:
                [...LIBRARY_DATA.books],

            departments:
                [...LIBRARY_DATA.departments]

        };

    }

    return {

        subjects:
            LIBRARY_DATA.subjects.filter(
                item =>
                    `${item.title} ${item.id}`
                        .toLowerCase()
                        .includes(value)
            ),

        books:
            LIBRARY_DATA.books.filter(
                item =>
                    `${item.title} ${item.description} ${item.subject} ${item.category}`
                        .toLowerCase()
                        .includes(value)
            ),

        departments:
            LIBRARY_DATA.departments.filter(
                item =>
                    `${item.title} ${item.description} ${item.id}`
                        .toLowerCase()
                        .includes(value)
            )

    };

}


/* =========================================================
   PAGE MEMORY
========================================================= */

function rememberPage() {

    const state =
        loadLibraryState();

    const page =
        document.body?.dataset?.page || "";

    const subject =
        getParam("subject");

    const book =
        getParam("book");

    state.lastPage =
        page;

    if (subject) {

        state.lastSubject =
            subject;

    }

    if (book) {

        state.lastBook =
            book;

    }

    if (page) {

        state.history.push({

            page,

            subject,

            book,

            time:
                Date.now()

        });

    }

    if (
        state.history.length > 30
    ) {

        state.history =
            state.history.slice(-30);

    }

    saveLibraryState(state);

}


/* =========================================================
   YEAR
========================================================= */

function setCurrentYear() {

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
   NOTIFICATION
========================================================= */

let libraryNotificationTimer =
    null;


function libraryNotify(message) {

    const box =
        document.querySelector(
            "[data-notifications]"
        );

    if (!box) {

        return;

    }

    box.textContent =
        String(message || "");

    box.classList.add("show");

    if (libraryNotificationTimer) {

        clearTimeout(
            libraryNotificationTimer
        );

    }

    libraryNotificationTimer =
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
   MOBILE MENU — REAL LIBRARY.HTML SYSTEM
========================================================= */

function closeLibraryMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    const buttons =
        document.querySelectorAll(
            "[data-menu-toggle]"
        );

    if (!menu) {

        return;

    }

    menu.hidden =
        true;

    menu.classList.remove(
        "is-open",
        "open",
        "active",
        "show"
    );

    menu.setAttribute(
        "aria-hidden",
        "true"
    );

    buttons.forEach(
        button => {

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.classList.remove(
                "active",
                "open"
            );

        }
    );

    document.body.classList.remove(
        "menu-open",
        "mobile-menu-open",
        "no-scroll"
    );

}


function openLibraryMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    const buttons =
        document.querySelectorAll(
            "[data-menu-toggle]"
        );

    if (!menu) {

        console.warn(
            "ALON Library: #mobile-menu not found."
        );

        return;

    }

    menu.hidden =
        false;

    menu.classList.add(
        "is-open",
        "open",
        "active",
        "show"
    );

    menu.setAttribute(
        "aria-hidden",
        "false"
    );

    buttons.forEach(
        button => {

            button.setAttribute(
                "aria-expanded",
                "true"
            );

            button.classList.add(
                "active",
                "open"
            );

        }
    );

    document.body.classList.add(
        "menu-open",
        "mobile-menu-open"
    );

}


function toggleLibraryMenu() {

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    if (!menu) {

        return;

    }

    if (menu.hidden) {

        openLibraryMenu();

    }
    else {

        closeLibraryMenu();

    }

}


/* =========================================================
   MOBILE MENU INIT
========================================================= */

function initMobileLibraryMenu() {

    const buttons =
        document.querySelectorAll(
            "[data-menu-toggle]"
        );

    const menu =
        document.getElementById(
            "mobile-menu"
        );

    /*
       This is the important fix.

       REAL library.html uses:
       data-menu-toggle
       #mobile-menu

       The old engine did NOT listen to data-menu-toggle.
    */

    if (!buttons.length) {

        console.warn(
            "ALON Library: [data-menu-toggle] not found."
        );

    }

    if (!menu) {

        console.warn(
            "ALON Library: #mobile-menu not found."
        );

        return;

    }


    buttons.forEach(
        button => {

            /*
               Prevent duplicate listeners
               if initLibrary() is called twice.
            */

            if (
                button.dataset.libraryMenuBound ===
                "true"
            ) {

                return;

            }

            button.dataset.libraryMenuBound =
                "true";


            button.setAttribute(
                "aria-controls",
                "mobile-menu"
            );

            button.setAttribute(
                "aria-expanded",
                String(!menu.hidden)
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    toggleLibraryMenu();

                }
            );

        }
    );


    /*
       Close buttons.

       Supports:
       data-menu-close
       data-library-menu-close
       data-book-menu-close
       data-subject-menu-close
       data-department-menu-close
       data-read-menu-close
    */

    menu
        .querySelectorAll(
            [
                "[data-menu-close]",
                "[data-library-menu-close]",
                "[data-book-menu-close]",
                "[data-subject-menu-close]",
                "[data-department-menu-close]",
                "[data-read-menu-close]"
            ].join(",")
        )
        .forEach(
            closeButton => {

                if (
                    closeButton.dataset.libraryCloseBound ===
                    "true"
                ) {

                    return;

                }

                closeButton.dataset.libraryCloseBound =
                    "true";

                closeButton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        closeLibraryMenu();

                    }
                );

            }
        );


    /*
       Menu links close the menu
       before navigation.
    */

    menu
        .querySelectorAll(
            "a"
        )
        .forEach(
            link => {

                if (
                    link.dataset.libraryLinkBound ===
                    "true"
                ) {

                    return;

                }

                link.dataset.libraryLinkBound =
                    "true";

                link.addEventListener(
                    "click",
                    () => {

                        closeLibraryMenu();

                    }
                );

            }
        );


    /*
       Click outside menu = close.
    */

    document.addEventListener(
        "click",
        event => {

            if (
                menu.hidden
            ) {

                return;

            }

            const clickedInside =
                menu.contains(
                    event.target
                );

            const clickedButton =
                event.target.closest(
                    "[data-menu-toggle]"
                );

            if (
                !clickedInside &&
                !clickedButton
            ) {

                closeLibraryMenu();

            }

        }
    );


    /*
       Escape = close.
    */

    if (
        document.documentElement.dataset
            .libraryEscapeBound !==
        "true"
    ) {

        document.documentElement.dataset
            .libraryEscapeBound =
            "true";

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLibraryMenu();

                }

            }
        );

    }

}


/* =========================================================
   GENERAL LIBRARY ROUTING
========================================================= */

function initLibraryRouting() {

    if (
        document.documentElement.dataset
            .libraryRouteBound ===
        "true"
    ) {

        return;

    }

    document.documentElement.dataset
        .libraryRouteBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest(
                    "[data-library-route]"
                );

            if (!target) {

                return;

            }

            /*
               Don't interfere with
               modifier-key clicks.
            */

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {

                return;

            }

            event.preventDefault();

            const page =
                target.dataset.libraryRoute;

            const subject =
                target.dataset.subject || "";

            const book =
                target.dataset.book || "";

            const search =
                target.dataset.search || "";

            libraryNavigate(
                page,
                {
                    subject,
                    book,
                    search
                }
            );

        }
    );

}


/* =========================================================
   SUBJECT ROUTING
========================================================= */

function initSubjectRouting() {

    if (
        document.documentElement.dataset
            .subjectRouteBound ===
        "true"
    ) {

        return;

    }

    document.documentElement.dataset
        .subjectRouteBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    "[data-subject-route]"
                );

            if (!card) {

                return;

            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {

                return;

            }

            event.preventDefault();

            const subject =
                card.dataset.subjectRoute;

            if (!subject) {

                return;

            }

            libraryNavigate(
                "book",
                {
                    subject
                }
            );

        }
    );

}


/* =========================================================
   BOOK ROUTING
========================================================= */

function initBookRouting() {

    if (
        document.documentElement.dataset
            .bookRouteBound ===
        "true"
    ) {

        return;

    }

    document.documentElement.dataset
        .bookRouteBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    "[data-book-route]"
                );

            if (!card) {

                return;

            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {

                return;

            }

            event.preventDefault();

            const book =
                card.dataset.bookRoute;

            if (!book) {

                return;

            }

            libraryNavigate(
                "read",
                {
                    book
                }
            );

        }
    );

}


/* =========================================================
   DEPARTMENT ROUTING
========================================================= */

function initDepartmentRouting() {

    if (
        document.documentElement.dataset
            .departmentRouteBound ===
        "true"
    ) {

        return;

    }

    document.documentElement.dataset
        .departmentRouteBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const target =
                event.target.closest(
                    "[data-department-route]"
                );

            if (!target) {

                return;

            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {

                return;

            }

            event.preventDefault();

            const department =
                target.dataset.departmentRoute;

            if (!department) {

                return;

            }

            libraryNavigate(
                "subject",
                {
                    department
                }
            );

        }
    );

}


/* =========================================================
   SUBJECT PAGE URL
========================================================= */

function applySubjectURL() {

    if (
        document.body?.dataset?.page !==
        "library-subject"
    ) {

        return;

    }

    const subject =
        getParam("subject");

    const search =
        getParam("search");

    const input =
        document.getElementById(
            "subject-search-input"
        );

    if (
        search &&
        input
    ) {

        input.value =
            search;

        input.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );

    }

    if (!subject) {

        return;

    }

    const cards =
        document.querySelectorAll(
            "[data-subject-card]"
        );

    let found =
        false;

    cards.forEach(
        card => {

            const value =
                String(
                    card.dataset.subject ||
                    ""
                )
                .trim()
                .toLowerCase();

            const match =
                value === subject;

            card.hidden =
                !match;

            if (match) {

                found =
                    true;

            }

        }
    );

    const context =
        document.getElementById(
            "subject-context"
        );

    if (
        context &&
        found
    ) {

        context.textContent =
            "Selected subject: " +
            subject;

    }

}


/* =========================================================
   BOOK PAGE URL
========================================================= */

function applyBookURL() {

    if (
        document.body?.dataset?.page !==
        "library-book"
    ) {

        return;

    }

    const subject =
        getParam("subject");

    const search =
        getParam("search");

    const input =
        document.getElementById(
            "book-search-input"
        );

    if (
        search &&
        input
    ) {

        input.value =
            search;

        input.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );

    }

    if (!subject) {

        return;

    }

    const cards =
        document.querySelectorAll(
            "[data-book-card]"
        );

    let found =
        false;

    cards.forEach(
        card => {

            const cardSubject =
                String(
                    card.dataset.subject ||
                    card.dataset.bookSubject ||
                    ""
                )
                .trim()
                .toLowerCase();

            const category =
                String(
                    card.dataset.category ||
                    ""
                )
                .trim()
                .toLowerCase();

            const match =
                cardSubject === subject ||
                category === subject;

            card.hidden =
                !match;

            if (match) {

                found =
                    true;

            }

        }
    );

    const context =
        document.getElementById(
            "book-context"
        );

    if (
        context &&
        found
    ) {

        context.textContent =
            "Showing books for: " +
            subject;

    }

}


/* =========================================================
   READ PAGE
========================================================= */

function initReadPage() {

    if (
        document.body?.dataset?.page !==
        "library-read"
    ) {

        return;

    }

    const bookId =
        getParam("book");

    if (!bookId) {

        return;

    }

    const book =
        getBook(bookId);

    if (!book) {

        console.warn(
            "ALON Library: book not found:",
            bookId
        );

        return;

    }

    const title =
        document.querySelector(
            "[data-read-title]"
        );

    const description =
        document.querySelector(
            "[data-read-description]"
        );

    const icon =
        document.querySelector(
            "[data-read-icon]"
        );

    const status =
        document.querySelector(
            "[data-read-status]"
        );

    if (title) {

        title.textContent =
            book.title;

    }

    if (description) {

        description.textContent =
            book.description;

    }

    if (icon) {

        icon.textContent =
            book.icon;

    }

    if (status) {

        status.textContent =
            "Reading: " +
            book.title;

    }

}


/* =========================================================
   LANGUAGE COMPATIBILITY
========================================================= */

function initLanguageCompatibility() {

    if (
        document.documentElement.dataset
            .libraryLanguageBound ===
        "true"
    ) {

        return;

    }

    document.documentElement.dataset
        .libraryLanguageBound =
        "true";


    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "#subjectLanguageBtn, [data-library-language], [data-language-button]"
                );

            if (!button) {

                return;

            }

            document.dispatchEvent(
                new CustomEvent(
                    "historyverse:language-request",
                    {
                        detail: {

                            page:
                                document.body?.dataset?.page ||
                                "library"

                        }
                    }
                )
            );

            libraryNotify(
                "Language system ready."
            );

        }
    );

}


/* =========================================================
   GLOBAL SEARCH HOOK
========================================================= */

function initLibrarySearch() {

    const inputs =
        document.querySelectorAll(
            "#library-search-input, #subject-search-input, #book-search-input, [data-library-search]"
        );

    inputs.forEach(
        input => {

            if (
                input.dataset.librarySearchBound ===
                "true"
            ) {

                return;

            }

            input.dataset.librarySearchBound =
                "true";

            input.addEventListener(
                "input",
                () => {

                    const results =
                        searchLibrary(
                            input.value
                        );

                    input.dispatchEvent(
                        new CustomEvent(
                            "historyverse:library-search",
                            {
                                bubbles: true,
                                detail: {
                                    query:
                                        input.value,
                                    results
                                }
                            }
                        )
                    );

                }
            );

        }
    );

}


/* =========================================================
   LIBRARY HEALTH
========================================================= */

function libraryHealth() {

    return {

        name:
            LIBRARY_CONFIG.name,

        creator:
            LIBRARY_CONFIG.creator,

        version:
            LIBRARY_CONFIG.version,

        departments:
            LIBRARY_DATA.departments.length,

        subjects:
            LIBRARY_DATA.subjects.length,

        books:
            LIBRARY_DATA.books.length,

        computerBooks:
            LIBRARY_DATA.books.filter(
                book =>
                    book.subject === "computer" ||
                    book.category === "computer"
            ).length,

        careerBooks:
            LIBRARY_DATA.books.filter(
                book =>
                    book.category === "career"
            ).length,

        menuButton:
            !!document.querySelector(
                "[data-menu-toggle]"
            ),

        mobileMenu:
            !!document.getElementById(
                "mobile-menu"
            ),

        ready:
            true

    };

}


/* =========================================================
   MASTER INIT
========================================================= */

let libraryEngineStarted =
    false;


async function initLibrary() {

    /*
       Prevent duplicate initialization.
    */

    if (libraryEngineStarted) {

        return true;

    }

    libraryEngineStarted =
        true;


    try {

        rememberPage();

        setCurrentYear();

        /*
           FIRST:
           Real mobile menu connection.
        */

        initMobileLibraryMenu();

        /*
           Routing.
        */

        initLibraryRouting();

        initSubjectRouting();

        initBookRouting();

        initDepartmentRouting();

        /*
           Other systems.
        */

        initLanguageCompatibility();

        initLibrarySearch();

        applySubjectURL();

        applyBookURL();

        initReadPage();


        document.documentElement.dataset
            .libraryReady =
            "true";

        document.body
            ?.classList
            .add(
                "library-ready"
            );


        /*
           Debug health information.
        */

        window.ALON_LIBRARY_HEALTH =
            libraryHealth();


        console.log(
            "ALON HISTORYVERSE 24 Library Engine ready:",
            window.ALON_LIBRARY_HEALTH
        );


        return true;

    }
    catch (error) {

        libraryEngineStarted =
            false;

        console.error(
            "ALON Library Engine initialization error:",
            error
        );

        return false;

    }

}


/* =========================================================
   PUBLIC API
========================================================= */

window.ALON_HISTORYVERSE_LIBRARY = {

    config:
        LIBRARY_CONFIG,

    data:
        LIBRARY_DATA,

    init:
        initLibrary,

    health:
        libraryHealth,

    search:
        searchLibrary,

    getSubject:
        getSubject,

    getDepartment:
        getDepartment,

    getBook:
        getBook,

    getBooksBySubject:
        getBooksBySubject,

    navigate:
        libraryNavigate,

    notify:
        libraryNotify,

    openMenu:
        openLibraryMenu,

    closeMenu:
        closeLibraryMenu,

    toggleMenu:
        toggleLibraryMenu

};


/* =========================================================
   AUTO START
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            initLibrary();

        },
        {
            once: true
        }
    );

}
else {

    initLibrary();

}


/* =========================================================
   END
========================================================= */