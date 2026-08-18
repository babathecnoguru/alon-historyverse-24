/* =========================================================
   ALON HISTORYVERSE 24
   MASTER COMPATIBILITY CONTROLLER — V100
   Creator / Owner: Baba Thecno Guru

   IMPORTANT:
   This file DOES NOT replace existing project systems.
   It works as a safe fallback layer.

   Existing HTML / JS systems remain untouched.
   Existing click handlers are respected.
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       DUPLICATE LOAD PROTECTION
    ===================================================== */

    if (window.__ALON_HISTORYVERSE_MASTER__) {
        return;
    }

    window.__ALON_HISTORYVERSE_MASTER__ = true;


    /* =====================================================
       MASTER INFORMATION
    ===================================================== */

    window.ALONHistoryVerseMaster = {

        version: "V100-COMPATIBILITY-1.0",

        ready: false,

        name: "ALON HISTORYVERSE 24"

    };


    /* =====================================================
       SAFE HELPERS
    ===================================================== */

    const $ = (selector, root = document) => {

        try {
            return root.querySelector(selector);
        } catch (_) {
            return null;
        }

    };


    const $$ = (selector, root = document) => {

        try {
            return Array.from(
                root.querySelectorAll(selector)
            );
        } catch (_) {
            return [];
        }

    };


    const safe = (fn) => {

        try {

            return fn();

        } catch (error) {

            console.warn(
                "[ALON MASTER]",
                error
            );

            return null;

        }

    };


    /* =====================================================
       SAFE NAVIGATION
    ===================================================== */

    const navigate = (url) => {

        if (!url) {
            return;
        }


        const target =
            String(url).trim();


        if (
            !target ||
            target === "#" ||
            target === "javascript:void(0)"
        ) {
            return;
        }


        safe(() => {

            window.location.href =
                target;

        });

    };


    window.ALON_HISTORYVERSE_NAVIGATE =
        navigate;


    /* =====================================================
       FIND URL FROM CARD
    ===================================================== */

    const getCardURL = (card) => {

        if (!card) {
            return "";
        }


        let url =
            card.getAttribute(
                "data-card-url"
            );


        if (!url) {

            url =
                card.getAttribute(
                    "data-href"
                );

        }


        if (!url) {

            url =
                card.getAttribute(
                    "data-url"
                );

        }


        if (!url) {

            const link =
                card.querySelector(
                    "a[href]"
                );


            if (link) {

                url =
                    link.getAttribute(
                        "href"
                    );

            }

        }


        return url || "";

    };


    /* =====================================================
       FULL CARD CLICK FALLBACK
       
       IMPORTANT:
       Existing button/link clicks are ignored.
       Existing handlers are not cancelled.
    ===================================================== */

    const setupCardFallback = () => {

        document.addEventListener(
            "click",
            (event) => {

                const card =
                    event.target.closest(
                        "[data-card], " +
                        "[data-article-card], " +
                        "[data-library-card], " +
                        ".content-card, " +
                        ".clickable-card, " +
                        ".clickable-row"
                    );


                if (!card) {
                    return;
                }


                /*
                 * Existing links/buttons continue
                 * to work normally.
                 */

                if (
                    event.target.closest(
                        "a, button, input, " +
                        "textarea, select, label"
                    )
                ) {
                    return;
                }


                const url =
                    getCardURL(card);


                if (!url) {
                    return;
                }


                /*
                 * Do NOT stop propagation.
                 * Existing project systems remain active.
                 */

                navigate(url);

            },
            false
        );

    };


    /* =====================================================
       KEYBOARD CARD FALLBACK
    ===================================================== */

    const setupKeyboardCards = () => {

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {
                    return;
                }


                const card =
                    event.target.closest(
                        "[data-card], " +
                        "[data-article-card], " +
                        "[data-library-card], " +
                        ".content-card, " +
                        ".clickable-card, " +
                        ".clickable-row"
                    );


                if (!card) {
                    return;
                }


                /*
                 * Don't interfere with
                 * controls inside cards.
                 */

                if (
                    event.target.closest(
                        "a, button, input, " +
                        "textarea, select"
                    )
                ) {
                    return;
                }


                const url =
                    getCardURL(card);


                if (!url) {
                    return;
                }


                event.preventDefault();

                navigate(url);

            },
            false
        );

    };


    /* =====================================================
       MOBILE MENU FALLBACK
       
       Only works if an existing menu system
       has not already handled the click.
    ===================================================== */

    const setupMenuFallback = () => {

        document.addEventListener(
            "click",
            (event) => {

                const toggle =
                    event.target.closest(
                        "[data-menu-toggle]"
                    );


                if (!toggle) {
                    return;
                }


                /*
                 * If another handler already
                 * prevented the event, do nothing.
                 */

                if (event.defaultPrevented) {
                    return;
                }


                const menu =
                    document.getElementById(
                        toggle.getAttribute(
                            "aria-controls"
                        ) || "mobile-menu"
                    );


                if (!menu) {
                    return;
                }


                /*
                 * Existing controller may already
                 * have changed this state.
                 *
                 * We only ensure accessibility state.
                 */

                const open =
                    !menu.hidden;


                toggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );

            },
            false
        );


        /*
         * Close button fallback
         */

        document.addEventListener(
            "click",
            (event) => {

                const close =
                    event.target.closest(
                        "[data-menu-close]"
                    );


                if (!close) {
                    return;
                }


                const menu =
                    close.closest(
                        "[data-mobile-menu]"
                    ) ||
                    $("#mobile-menu");


                if (!menu) {
                    return;
                }


                /*
                 * Existing handler gets priority.
                 * This only guarantees final state.
                 */

                if (!event.defaultPrevented) {

                    menu.hidden = true;

                    const toggle =
                        $(
                            "[data-menu-toggle]"
                        );


                    if (toggle) {

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }

            },
            false
        );

    };


    /* =====================================================
       LANGUAGE FALLBACK
    ===================================================== */

    const setupLanguageFallback = () => {

        document.addEventListener(
            "click",
            (event) => {

                const option =
                    event.target.closest(
                        "[data-language]"
                    );


                if (!option) {
                    return;
                }


                const language =
                    option.getAttribute(
                        "data-language"
                    );


                if (!language) {
                    return;
                }


                /*
                 * Save language without replacing
                 * existing language engine.
                 */

                safe(() => {

                    localStorage.setItem(
                        "historyverse-language",
                        language
                    );

                });


                safe(() => {

                    document.documentElement
                        .setAttribute(
                            "lang",
                            language
                        );

                });


                /*
                 * Tell existing systems that
                 * language changed.
                 */

                safe(() => {

                    document.dispatchEvent(
                        new CustomEvent(
                            "alon:language-change",
                            {
                                detail: {
                                    language
                                }
                            }
                        )
                    );

                });

            },
            false
        );

    };


    /* =====================================================
       SEARCH FALLBACK
       
       Existing search systems are not replaced.
    ===================================================== */

    const setupSearchFallback = () => {

        document.addEventListener(
            "submit",
            (event) => {

                const form =
                    event.target.closest(
                        "[data-search-form]"
                    );


                if (!form) {
                    return;
                }


                /*
                 * Existing search engine gets priority.
                 */

                if (event.defaultPrevented) {
                    return;
                }


                const input =
                    form.querySelector(
                        "[data-search-input]"
                    ) ||
                    form.querySelector(
                        "input[name='q']"
                    ) ||
                    form.querySelector(
                        "input[type='search']"
                    );


                if (!input) {
                    return;
                }


                const query =
                    input.value.trim();


                if (!query) {
                    return;
                }


                safe(() => {

                    localStorage.setItem(
                        "historyverse-search",
                        query
                    );

                });


                /*
                 * Only fallback when no existing
                 * system has stopped the form.
                 */

                event.preventDefault();


                navigate(
                    "articles.html?search=" +
                    encodeURIComponent(query)
                );

            },
            false
        );

    };


    /* =====================================================
       LIBRARY FALLBACK
       
       Supports:
       Library
       Department
       Subject
       Book
       Read
    ===================================================== */

    const setupLibraryFallback = () => {

        document.addEventListener(
            "click",
            (event) => {

                /*
                 * Don't interfere with actual links.
                 */

                if (
                    event.target.closest(
                        "a, button"
                    )
                ) {
                    return;
                }


                const department =
                    event.target.closest(
                        "[data-library-department]"
                    );


                const subject =
                    event.target.closest(
                        "[data-library-subject]"
                    );


                const book =
                    event.target.closest(
                        "[data-library-book]"
                    );


                const read =
                    event.target.closest(
                        "[data-library-read]"
                    );


                if (department) {

                    const value =
                        department.getAttribute(
                            "data-library-department"
                        );


                    if (value) {

                        navigate(
                            "department.html?department=" +
                            encodeURIComponent(value)
                        );

                    }

                    return;

                }


                if (subject) {

                    const value =
                        subject.getAttribute(
                            "data-library-subject"
                        );


                    if (value) {

                        navigate(
                            "subject.html?subject=" +
                            encodeURIComponent(value)
                        );

                    }

                    return;

                }


                if (book) {

                    const value =
                        book.getAttribute(
                            "data-library-book"
                        );


                    if (value) {

                        navigate(
                            "book.html?book=" +
                            encodeURIComponent(value)
                        );

                    }

                    return;

                }


                if (read) {

                    const value =
                        read.getAttribute(
                            "data-library-read"
                        );


                    if (value) {

                        navigate(
                            "read.html?book=" +
                            encodeURIComponent(value)
                        );

                    }

                }

            },
            false
        );

    };


    /* =====================================================
       BACK BUTTON FALLBACK
    ===================================================== */

    const setupBackFallback = () => {

        document.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        "[data-back], " +
                        "[data-history-back], " +
                        ".back-button"
                    );


                if (!button) {
                    return;
                }


                if (event.defaultPrevented) {
                    return;
                }


                event.preventDefault();


                safe(() => {

                    if (
                        window.history.length > 1
                    ) {

                        window.history.back();

                    } else {

                        navigate(
                            "index.html"
                        );

                    }

                });

            },
            false
        );

    };


    /* =====================================================
       YEAR FALLBACK
    ===================================================== */

    const setupYearFallback = () => {

        const year =
            new Date().getFullYear();


        $$(
            "[data-year], #current-year"
        ).forEach(
            element => {

                /*
                 * Only fill empty year fields.
                 * Existing content is not overwritten.
                 */

                if (
                    !element.textContent.trim()
                ) {

                    element.textContent =
                        String(year);

                }

            }
        );

    };


    /* =====================================================
       ARTICLE DUPLICATE CHECK
       
       IMPORTANT:
       Does not delete articles.
       It only exposes a safe utility.
    ===================================================== */

    const normalize = (value) => {

        return String(value ?? "")
            .toLowerCase()
            .normalize("NFKC")
            .replace(/\s+/g, " ")
            .trim();

    };


    const articleKey = (article) => {

        if (!article) {
            return "";
        }


        const id =
            normalize(
                article.id
            );


        if (id) {
            return "id:" + id;
        }


        const title =
            normalize(
                article.title ||
                article.name
            );


        return title
            ? "title:" + title
            : "";

    };


    window.ALON_HISTORYVERSE_ARTICLE_TOOLS = {

        normalize,

        articleKey,

        removeDuplicates(list) {

            if (!Array.isArray(list)) {
                return [];
            }


            const seen =
                new Set();


            return list.filter(
                article => {

                    const key =
                        articleKey(article);


                    if (!key) {
                        return true;
                    }


                    if (seen.has(key)) {
                        return false;
                    }


                    seen.add(key);

                    return true;

                }
            );

        }

    };


    /* =====================================================
       READY
    ===================================================== */

    const start = () => {

        setupCardFallback();

        setupKeyboardCards();

        setupMenuFallback();

        setupLanguageFallback();

        setupSearchFallback();

        setupLibraryFallback();

        setupBackFallback();

        setupYearFallback();


        window.ALONHistoryVerseMaster.ready =
            true;


        document.documentElement
            .setAttribute(
                "data-alon-master",
                "ready"
            );


        /*
         * Custom ready event.
         */

        safe(() => {

            document.dispatchEvent(
                new CustomEvent(
                    "alon:master-ready",
                    {
                        detail: {
                            version:
                                window
                                    .ALONHistoryVerseMaster
                                    .version
                        }
                    }
                )
            );

        });


        console.log(
            "ALON HISTORYVERSE 24 — Master Compatibility Controller Ready"
        );

    };


    /* =====================================================
       DOM READY
    ===================================================== */

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