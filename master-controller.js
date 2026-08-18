<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="theme-color"
        content="#05080f"
    >

    <meta
        name="description"
        content="ALON HISTORYVERSE 24 — Explore history, civilizations, countries, heritage, timelines, books, articles and knowledge."
    >

    <meta
        name="author"
        content="Baba Thecno Guru"
    >

    <title>ALON HISTORYVERSE 24</title>

    <!-- =====================================================
         GLOBAL CSS
    ====================================================== -->

    <link
        rel="stylesheet"
        href="css/style.css"
    >

</head>


<body>

<a
    class="skip-link"
    href="#main-content"
>
    Skip to content
</a>


<!-- =======================================================
     HEADER
======================================================= -->

<header class="site-header">

    <div class="brand-wrap">

        <a
            class="brand"
            href="./"
            data-page="home"
            aria-label="ALON HISTORYVERSE 24 Home"
        >
            <span>🏛️</span>
            <span>ALON HISTORYVERSE 24</span>
        </a>

        <span class="brand-subtitle">
            HISTORY • KNOWLEDGE • CIVILIZATION
        </span>

    </div>


    <div class="header-actions">

        <!-- LANGUAGE -->

        <button
            type="button"
            class="icon-button"
            id="languageButton"
            aria-label="Change language"
            aria-controls="languagePanel"
            aria-expanded="false"
        >
            🌐
        </button>


        <!-- MENU -->

        <button
            type="button"
            class="icon-button"
            id="menuButton"
            aria-label="Open menu"
            aria-controls="mobileMenu"
            aria-expanded="false"
        >
            ☰
        </button>

    </div>

</header>



<!-- =======================================================
     DESKTOP NAVIGATION
======================================================= -->

<nav
    class="desktop-nav"
    aria-label="Main navigation"
>

    <a href="html/library.html">
        Library
    </a>

    <a href="html/countries.html">
        Countries
    </a>

    <a href="html/civilizations.html">
        Civilizations
    </a>

    <a href="html/heritage.html">
        Heritage
    </a>

    <a href="html/timeline.html">
        Timeline
    </a>

    <a href="html/articles.html">
        Articles
    </a>

    <a href="html/discover.html">
        Discover
    </a>

</nav>



<!-- =======================================================
     MOBILE MENU
======================================================= -->

aside
id="mobileMenu"
class="mobile-menu"
hidden
aria-label="Mobile navigation"
>

    <a href="./">
        🏠 Home
    </a>

    <a href="html/library.html">
        📚 Library
    </a>

    <a href="html/department.html">
        🏛️ Departments
    </a>

    <a href="html/subject.html">
        📖 Subjects
    </a>

    <a href="html/book.html">
        📕 Books
    </a>

    <a href="html/read.html">
        📜 Read
    </a>

    <a href="html/countries.html">
        🌍 Countries
    </a>

    <a href="html/country.html">
        🗺️ Country Explorer
    </a>

    <a href="html/civilizations.html">
        🏺 Civilizations
    </a>

    <a href="html/heritage.html">
        🏰 Heritage
    </a>

    <a href="html/timeline.html">
        ⏳ Timeline
    </a>

    <a href="html/articles.html">
        📰 Articles
    </a>

    <a href="html/article.html">
        📄 Article
    </a>

    <a href="html/discover.html">
        🔎 Discover
    </a>

    <a href="html/categories.html">
        🗂️ Categories
    </a>

    <a href="html/gallery.html">
        🖼️ Gallery
    </a>

    <a href="html/mathematics.html">
        🔢 Mathematics
    </a>

    <a href="html/computer.html">
        💻 Computer
    </a>

    <a href="html/jobs.html">
        💼 Jobs & Careers
    </a>

    <a href="html/trees.html">
        🌳 Trees
    </a>

    <a href="html/contribute.html">
        ✍️ Contribute
    </a>

    <a href="html/about.html">
        ℹ️ About
    </a>

    <a href="html/contact.html">
        📞 Contact
    </a>

    <a href="html/login.html">
        🔐 Login
    </a>

    <a href="html/admin.html">
        ⚙️ Admin
    </a>

    <button
        type="button"
        id="mobileMenuClose"
    >
        Close Menu
    </button>

</aside>



<!-- =======================================================
     LANGUAGE PANEL
======================================================= -->

div
id="languagePanel"
class="language-panel"
hidden
role="dialog"
aria-modal="true"
aria-labelledby="languageTitle"
>

    <div class="language-panel-head">

        <h2 id="languageTitle">
            Select Language
        </h2>

        <button
            type="button"
            id="languageClose"
            aria-label="Close language panel"
        >
            ×
        </button>

    </div>


    <button
        type="button"
        class="language-option"
        data-language="en"
    >
        🇬🇧 English
    </button>


    <button
        type="button"
        class="language-option"
        data-language="hi"
    >
        🇮🇳 Hindi / हिन्दी
    </button>


    <button
        type="button"
        class="language-option"
        data-language="gu"
    >
        🇮🇳 Gujarati / ગુજરાતી
    </button>


    <button
        type="button"
        class="language-option"
        data-language="sa"
    >
        🕉️ Sanskrit / संस्कृत
    </button>

</div>



<!-- =======================================================
     MAIN HOME
======================================================= -->

<main
    id="main-content"
    class="container"
>


    <!-- HERO -->

    <section
        class="hero-section"
        id="home"
    >

        <div class="hero-card">

            <div class="hero-kicker">
                ALON HISTORYVERSE 24
            </div>


            <h1>
                Explore Human History
            </h1>


            <p class="hero-description">

                Discover ancient civilizations,
                countries, cultures, heritage,
                historical timelines, books,
                articles and knowledge from
                around the world.

            </p>



            <!-- SEARCH -->

            <form
                class="search-form"
                id="globalSearchForm"
                role="search"
            >

                <label
                    class="sr-only"
                    for="globalSearch"
                >
                    Search HistoryVerse
                </label>


                <input
                    type="search"
                    id="globalSearch"
                    name="q"
                    placeholder="Search history, countries, civilizations..."
                    autocomplete="off"
                >


                <button
                    type="submit"
                    aria-label="Search"
                >
                    🔎
                </button>

            </form>



            <!-- QUICK ACTIONS -->

            <div class="quick-actions">

                <a
                    class="quick-action"
                    href="html/library.html"
                >
                    📚 Open Library
                </a>


                <a
                    class="quick-action"
                    href="html/countries.html"
                >
                    🌍 Explore Countries
                </a>


                <a
                    class="quick-action"
                    href="html/civilizations.html"
                >
                    🏺 Civilizations
                </a>


                <a
                    class="quick-action"
                    href="html/timeline.html"
                >
                    ⏳ Historical Timeline
                </a>

            </div>

        </div>

    </section>



    <!-- ===================================================
         KNOWLEDGE SYSTEM
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                Knowledge System
            </div>

            <h2>
                Explore HistoryVerse
            </h2>

        </div>


        <div
            class="quick-actions"
            id="knowledgeNavigation"
        >

            <a
                class="quick-action clickable-card"
                href="html/library.html"
            >
                📚 Library
            </a>


            <a
                class="quick-action clickable-card"
                href="html/department.html"
            >
                🏛️ Departments
            </a>


            <a
                class="quick-action clickable-card"
                href="html/subject.html"
            >
                📖 Subjects
            </a>


            <a
                class="quick-action clickable-card"
                href="html/book.html"
            >
                📕 Books
            </a>


            <a
                class="quick-action clickable-card"
                href="html/read.html"
            >
                📜 Read
            </a>


            <a
                class="quick-action clickable-card"
                href="html/articles.html"
            >
                📰 Articles
            </a>


            <a
                class="quick-action clickable-card"
                href="html/heritage.html"
            >
                🏰 Heritage
            </a>


            <a
                class="quick-action clickable-card"
                href="html/discover.html"
            >
                🔎 Discover
            </a>

        </div>

    </section>



    <!-- ===================================================
         WORLD HISTORY
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                World History
            </div>

            <h2>
                Explore the World
            </h2>

            <p>
                Explore countries, civilizations,
                heritage sites and historical events.
            </p>

        </div>


        <div class="quick-actions">

            <a
                class="quick-action"
                href="html/countries.html"
            >
                🌍 Countries
            </a>


            <a
                class="quick-action"
                href="html/country.html"
            >
                🗺️ Country Explorer
            </a>


            <a
                class="quick-action"
                href="html/civilizations.html"
            >
                🏺 Civilizations
            </a>


            <a
                class="quick-action"
                href="html/heritage.html"
            >
                🏰 Heritage
            </a>


            <a
                class="quick-action"
                href="html/timeline.html"
            >
                ⏳ Timeline
            </a>

        </div>

    </section>



    <!-- ===================================================
         SUBJECTS
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                Subjects
            </div>

            <h2>
                Knowledge Categories
            </h2>

        </div>


        <div class="quick-actions">

            <a
                class="quick-action"
                href="html/mathematics.html"
            >
                🔢 Mathematics
            </a>


            <a
                class="quick-action"
                href="html/computer.html"
            >
                💻 Computer
            </a>


            <a
                class="quick-action"
                href="html/jobs.html"
            >
                💼 Jobs & Careers
            </a>


            <a
                class="quick-action"
                href="html/trees.html"
            >
                🌳 Trees
            </a>


            <a
                class="quick-action"
                href="html/categories.html"
            >
                🗂️ All Categories
            </a>

        </div>

    </section>



    <!-- ===================================================
         ARTICLES
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                History Articles
            </div>

            <h2>
                Latest Knowledge
            </h2>

        </div>


        <div
            id="featuredArticles"
            class="article-grid"
        >

            <div class="card">
                <div class="card-body">

                    <h3>
                        Explore Historical Articles
                    </h3>

                    <p>
                        Open the Articles section to
                        explore published historical
                        knowledge.
                    </p>

                    <a
                        class="quick-action"
                        href="html/articles.html"
                    >
                        Open Articles
                    </a>

                </div>
            </div>

        </div>

    </section>



    <!-- ===================================================
         HERITAGE
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                Heritage
            </div>

            <h2>
                Historical Heritage
            </h2>

            <p>
                Explore forts, monuments,
                ancient cities and cultural heritage.
            </p>

        </div>


        <div class="quick-actions">

            <a
                class="quick-action"
                href="html/heritage.html"
            >
                🏰 Explore Heritage
            </a>


            <a
                class="quick-action"
                href="html/gallery.html"
            >
                🖼️ Open Gallery
            </a>

        </div>

    </section>



    <!-- ===================================================
         CONTRIBUTE
    ==================================================== -->

    <section>

        <div class="section-heading">

            <div class="section-kicker">
                Community
            </div>

            <h2>
                Contribute to HistoryVerse
            </h2>

        </div>


        <div class="quick-actions">

            <a
                class="quick-action"
                href="html/contribute.html"
            >
                ✍️ Contribute
            </a>


            <a
                class="quick-action"
                href="html/guidelines.html"
            >
                📋 Guidelines
            </a>


            <a
                class="quick-action"
                href="html/contributor-agreement.html"
            >
                📜 Contributor Agreement
            </a>

        </div>

    </section>

</main>



<!-- =======================================================
     FOOTER
======================================================= -->

<footer class="site-footer">

    <div class="container">

        <h3>
            ALON HISTORYVERSE 24
        </h3>

        <p>
            Created and owned by Baba Thecno Guru.
        </p>


        <div class="quick-actions">

            <a href="html/about.html">
                About
            </a>

            <a href="html/contact.html">
                Contact
            </a>

            <a href="html/privacy.html">
                Privacy
            </a>

            <a href="html/terms.html">
                Terms
            </a>

            <a href="html/copyright.html">
                Copyright
            </a>

            <a href="html/login.html">
                Login
            </a>

        </div>

    </div>

</footer>



<!-- =======================================================
     CENTRAL ALON ROUTER / CONFIG
======================================================= -->

<script>

(function () {

    "use strict";


    /*
     * =====================================================
     * ALON HISTORYVERSE 24
     * CENTRAL ROUTING CONFIGURATION
     * =====================================================
     */


    const ALON_CONFIG = {

        brand:
            "ALON HISTORYVERSE 24",

        creator:
            "Baba Thecno Guru",

        root:
            "./",

        folders: {

            html:
                "html/",

            css:
                "css/",

            images:
                "images/",

            data:
                "data/",

            js:
                "jss/"

        },


        pages: {

            home:
                "./",

            library:
                "html/library.html",

            department:
                "html/department.html",

            subject:
                "html/subject.html",

            book:
                "html/book.html",

            read:
                "html/read.html",

            articles:
                "html/articles.html",

            article:
                "html/article.html",

            countries:
                "html/countries.html",

            country:
                "html/country.html",

            civilizations:
                "html/civilizations.html",

            heritage:
                "html/heritage.html",

            timeline:
                "html/timeline.html",

            discover:
                "html/discover.html",

            categories:
                "html/categories.html",

            gallery:
                "html/gallery.html",

            contribute:
                "html/contribute.html",

            guidelines:
                "html/guidelines.html",

            contributorAgreement:
                "html/contributor-agreement.html",

            about:
                "html/about.html",

            contact:
                "html/contact.html",

            login:
                "html/login.html",

            admin:
                "html/admin.html",

            copyright:
                "html/copyright.html",

            privacy:
                "html/privacy.html",

            terms:
                "html/terms.html",

            mathematics:
                "html/mathematics.html",

            computer:
                "html/computer.html",

            jobs:
                "html/jobs.html",

            trees:
                "html/trees.html"

        },


        data: {

            library:
                "data/library.json",

            heritage:
                "data/heritage.json",

            timeline:
                "data/timeline.json",

            countries:
                "data/countries.json",

            civilizations:
                "data/civilizations.json"

        }

    };


    /*
     * Expose central configuration
     */

    window.ALON_HISTORYVERSE =
        ALON_CONFIG;



    /*
     * =====================================================
     * SAFE PAGE NAVIGATION
     * =====================================================
     */

    window.ALON_GO = function (page) {

        const target =
            ALON_CONFIG.pages[page];


        if (!target) {

            console.warn(
                "ALON: Unknown page:",
                page
            );

            return false;

        }


        window.location.href =
            target;


        return true;

    };



    /*
     * =====================================================
     * MOBILE MENU
     * =====================================================
     */

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const mobileMenuClose =
        document.getElementById(
            "mobileMenuClose"
        );


    function openMenu() {

        if (!mobileMenu) {
            return;
        }


        mobileMenu.hidden =
            false;


        document.body.classList.add(
            "menu-open"
        );


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeMenu() {

        if (!mobileMenu) {
            return;
        }


        mobileMenu.hidden =
            true;


        document.body.classList.remove(
            "menu-open"
        );


        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    if (menuButton) {

        menuButton.addEventListener(
            "click",
            function () {

                if (mobileMenu.hidden) {

                    openMenu();

                } else {

                    closeMenu();

                }

            }
        );

    }


    if (mobileMenuClose) {

        mobileMenuClose.addEventListener(
            "click",
            closeMenu
        );

    }


    if (mobileMenu) {

        mobileMenu
            .querySelectorAll("a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });

    }



    /*
     * =====================================================
     * LANGUAGE PANEL
     * =====================================================
     */

    const languageButton =
        document.getElementById(
            "languageButton"
        );


    const languagePanel =
        document.getElementById(
            "languagePanel"
        );


    const languageClose =
        document.getElementById(
            "languageClose"
        );


    function openLanguage() {

        if (!languagePanel) {
            return;
        }


        languagePanel.hidden =
            false;


        document.body.classList.add(
            "language-open"
        );


        if (languageButton) {

            languageButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    function closeLanguage() {

        if (!languagePanel) {
            return;
        }


        languagePanel.hidden =
            true;


        document.body.classList.remove(
            "language-open"
        );


        if (languageButton) {

            languageButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    if (languageButton) {

        languageButton.addEventListener(
            "click",
            openLanguage
        );

    }


    if (languageClose) {

        languageClose.addEventListener(
            "click",
            closeLanguage
        );

    }



    /*
     * LANGUAGE STORAGE
     */

    document
        .querySelectorAll(
            ".language-option"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const language =
                        button.dataset.language;


                    if (!language) {
                        return;
                    }


                    localStorage.setItem(
                        "alon_historyverse_language",
                        language
                    );


                    document.documentElement
                        .setAttribute(
                            "lang",
                            language
                        );


                    document.dispatchEvent(
                        new CustomEvent(
                            "alon:languagechange",
                            {
                                detail: {
                                    language
                                }
                            }
                        )
                    );


                    closeLanguage();

                }
            );

        });



    /*
     * Restore language
     */

    const savedLanguage =
        localStorage.getItem(
            "alon_historyverse_language"
        );


    if (savedLanguage) {

        document.documentElement
            .setAttribute(
                "lang",
                savedLanguage
            );

    }



    /*
     * =====================================================
     * GLOBAL SEARCH
     * =====================================================
     */

    const searchForm =
        document.getElementById(
            "globalSearchForm"
        );


    const searchInput =
        document.getElementById(
            "globalSearch"
        );


    if (searchForm && searchInput) {

        searchForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const query =
                    searchInput.value.trim();


                if (!query) {

                    searchInput.focus();

                    return;

                }


                /*
                 * Send search to Articles page.
                 *
                 * This avoids incorrectly sending
                 * every search to Library.
                 */

                const url =
                    "html/articles.html?q=" +
                    encodeURIComponent(
                        query
                    );


                window.location.href =
                    url;

            }
        );

    }



    /*
     * =====================================================
     * ESC KEY
     * =====================================================
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeMenu();

                closeLanguage();

            }

        }
    );



    /*
     * =====================================================
     * CLOSE OVERLAY
     * =====================================================
     */

    document.addEventListener(
        "click",
        function (event) {

            if (
                document.body.classList.contains(
                    "menu-open"
                )
            ) {

                if (
                    mobileMenu &&
                    !mobileMenu.contains(
                        event.target
                    ) &&
                    event.target !==
                    menuButton
                ) {

                    closeMenu();

                }

            }

        }
    );



    /*
     * =====================================================
     * DEBUG / SYSTEM INFORMATION
     * =====================================================
     */

    window.ALON_SYSTEM = {

        version:
            "V100",

        files:
            60,

        architecture:
            "Root Index + HTML + CSS + JSS + DATA + IMAGES",

        singleIndex:
            true,

        rootIndex:
            true,

        githubPages:
            true,

        bilingual:
            true,

        mobile:
            true,

        centralizedNavigation:
            true

    };


    console.log(
        "ALON HISTORYVERSE 24 V100 initialized."
    );

})();

</script>



<!-- =======================================================
     OPTIONAL ENGINE LOADER
     
     IMPORTANT:
     The existing articles.js contains ES-module exports.
     Therefore it must be loaded as a module.
     
     The remaining project engines can be controlled by
     master-controller.js.
======================================================= -->

<script
    type="module"
    src="jss/articles.js"
></script>


<script
    src="jss/master-controller.js"
    defer
></script>


</body>
</html>