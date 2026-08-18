/* =========================================================
   ALON HISTORYVERSE 24
   FILE: jss/admin.js
   ADMIN + ARTICLE MANAGEMENT INTERFACE
   Creator / Owner: Baba Thecno Guru
========================================================= */


/* =========================================================
   ARTICLE ENGINE
========================================================= */

import {

    getArticles,

    getArticleById,

    createArticle,

    updateArticle,

    deleteArticle,

    publishArticle,

    draftArticle,

    setFeatured,

    searchArticles,

    getArticleCategories,

    getArticleStats,

    getArticleTitle,

    getArticleDescription,

    getArticleContent

} from "./articles.js";


/* =========================================================
   ADMIN STATE
========================================================= */

const AdminState = {

    editingId:
        null,

    search:
        "",

    category:
        "",

    status:
        "",

    language:
        "en"

};


/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector) {

    return document.querySelector(
        selector
    );

}


function $all(selector) {

    return Array.from(
        document.querySelectorAll(
            selector
        )
    );

}


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   ADMIN INITIALIZATION
========================================================= */

export function initAdmin() {

    setupAdminForm();

    setupAdminSearch();

    setupAdminFilters();

    setupAdminActions();

    setupArticleEvents();

    renderAdmin();

}


/* =========================================================
   MAIN ADMIN RENDER
========================================================= */

export function renderAdmin() {

    renderStatistics();

    renderCategoryFilter();

    renderArticles();

    updateEditMode();

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

    const stats =
        getArticleStats();


    const total =
        $("[data-admin-total]");


    const published =
        $("[data-admin-published]");


    const drafts =
        $("[data-admin-drafts]");


    const featured =
        $("[data-admin-featured]");


    if (total) {

        total.textContent =
            stats.total;

    }


    if (published) {

        published.textContent =
            stats.published;

    }


    if (drafts) {

        drafts.textContent =
            stats.drafts;

    }


    if (featured) {

        featured.textContent =
            stats.featured;

    }


    /*
       Alternative IDs for compatibility
       with different admin layouts.
    */

    setText(
        "#totalArticles",
        stats.total
    );


    setText(
        "#publishedArticles",
        stats.published
    );


    setText(
        "#draftArticles",
        stats.drafts
    );


    setText(
        "#featuredArticles",
        stats.featured
    );

}


/* =========================================================
   TEXT HELPER
========================================================= */

function setText(
    selector,
    value
) {

    const element =
        $(selector);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function renderCategoryFilter() {

    const select =
        $(
            "#articleCategoryFilter"
        ) ||
        $(
            "[data-article-category-filter]"
        );


    if (!select) {

        return;

    }


    const current =
        AdminState.category;


    const categories =
        getArticleCategories();


    const options = [

        `<option value="">
            All Categories
        </option>`,

        ...categories.map(
            category => `

                <option
                    value="${escapeHTML(
                        category
                    )}"
                    ${
                        category ===
                        current
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHTML(
                        category
                    )}
                </option>

            `
        )

    ];


    select.innerHTML =
        options.join("");

}


/* =========================================================
   ARTICLE LIST
========================================================= */

function renderArticles() {

    const container =
        $(
            "#adminArticlesList"
        ) ||
        $(
            "[data-admin-articles]"
        ) ||
        $(
            "#articlesList"
        );


    if (!container) {

        return;

    }


    let articles;


    if (AdminState.search) {

        articles =
            searchArticles(
                AdminState.search,
                {
                    category:
                        AdminState.category ||
                        undefined
                }
            );

    } else {

        articles =
            getArticles();

    }


    /*
       Status filter
    */

    if (AdminState.status) {

        articles =
            articles.filter(
                article =>
                    article.status ===
                    AdminState.status
            );

    }


    /*
       Category filter
    */

    if (
        AdminState.category &&
        !AdminState.search
    ) {

        const target =
            AdminState.category
                .toLowerCase();


        articles =
            articles.filter(
                article =>
                    String(
                        article.category
                    )
                        .toLowerCase() ===
                    target
            );

    }


    if (!articles.length) {

        container.innerHTML = `

            <div
                class="admin-empty-state"
            >

                <div>
                    📜
                </div>

                <h3>
                    No articles found
                </h3>

                <p>
                    Try another search or
                    create a new article.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        articles
            .map(
                article =>
                    createAdminArticleCard(
                        article
                    )
            )
            .join("");


    attachArticleCardEvents(
        container
    );

}


/* =========================================================
   ADMIN ARTICLE CARD
========================================================= */

function createAdminArticleCard(
    article
) {

    const title =
        getArticleTitle(
            article,
            AdminState.language
        ) ||
        getArticleTitle(
            article,
            "en"
        );


    const description =
        getArticleDescription(
            article,
            AdminState.language
        );


    const status =
        article.status ===
        "published"
            ? "Published"
            : "Draft";


    const statusClass =
        article.status ===
        "published"
            ? "published"
            : "draft";


    return `

        <article

            class="
                admin-article-card
                article-row
                ${statusClass}
            "

            data-admin-article-id="
                ${escapeHTML(
                    article.id
                )}
            "

            tabindex="0"

            role="button"

        >

            <div
                class="admin-article-main"
            >

                <div
                    class="admin-article-icon"
                >
                    📜
                </div>


                <div
                    class="admin-article-info"
                >

                    <h3>
                        ${escapeHTML(
                            title
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            description
                        )}
                    </p>


                    <div
                        class="admin-article-meta"
                    >

                        <span>
                            ${escapeHTML(
                                article.category
                            )}
                        </span>


                        <span>
                            ${escapeHTML(
                                article.author
                            )}
                        </span>


                        <span
                            class="
                                article-status
                                ${statusClass}
                            "
                        >
                            ${status}
                        </span>

                    </div>

                </div>

            </div>


            <div
                class="admin-article-actions"
            >

                <button

                    type="button"

                    class="
                        admin-action-btn
                        edit-article
                    "

                    data-action="edit"

                    data-id="
                        ${escapeHTML(
                            article.id
                        )}
                    "

                >
                    Edit
                </button>


                ${
                    article.status ===
                    "published"

                        ? `

                            <button

                                type="button"

                                class="
                                    admin-action-btn
                                    draft-article
                                "

                                data-action="draft"

                                data-id="
                                    ${escapeHTML(
                                        article.id
                                    )}
                                "

                            >
                                Draft

                            </button>

                        `

                        : `

                            <button

                                type="button"

                                class="
                                    admin-action-btn
                                    publish-article
                                "

                                data-action="publish"

                                data-id="
                                    ${escapeHTML(
                                        article.id
                                    )}
                                "

                            >
                                Publish

                            </button>

                        `
                }


                <button

                    type="button"

                    class="
                        admin-action-btn
                        ${
                            article.featured
                                ? "featured-active"
                                : ""
                        }
                    "

                    data-action="featured"

                    data-id="
                        ${escapeHTML(
                            article.id
                        )}
                    "

                >

                    ${
                        article.featured
                            ? "★ Featured"
                            : "☆ Feature"
                    }

                </button>


                <button

                    type="button"

                    class="
                        admin-action-btn
                        delete-article
                    "

                    data-action="delete"

                    data-id="
                        ${escapeHTML(
                            article.id
                        )}
                    "

                >
                    Delete

                </button>

            </div>

        </article>

    `;

}


/* =========================================================
   CARD EVENTS
========================================================= */

function attachArticleCardEvents(
    container
) {

    $all(
        "[data-admin-article-id]",
        container
    );

}


/* =========================================================
   ARTICLE CARD CLICK SYSTEM
========================================================= */

function setupCardInteraction(
    card
) {

    if (!card) {

        return;

    }


    card.addEventListener(
        "click",
        event => {

            /*
               Buttons must remain independent.
            */

            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            const id =
                card.dataset
                    .adminArticleId;


            if (id) {

                editArticle(
                    id
                );

            }

        }
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                    "Enter" &&
                event.key !==
                    " "
            ) {

                return;

            }


            if (
                event.target.closest(
                    "button"
                )
            ) {

                return;

            }


            event.preventDefault();


            const id =
                card.dataset
                    .adminArticleId;


            if (id) {

                editArticle(
                    id
                );

            }

        }
    );

}


/* =========================================================
   FIX CARD EVENTS
========================================================= */

function attachArticleCardEvents(
    container
) {

    const cards =
        container.querySelectorAll(
            "[data-admin-article-id]"
        );


    cards.forEach(
        card => {

            setupCardInteraction(
                card
            );


            const buttons =
                card.querySelectorAll(
                    "[data-action]"
                );


            buttons.forEach(
                button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();


                            const action =
                                button.dataset
                                    .action;


                            const id =
                                button.dataset
                                    .id;


                            handleArticleAction(
                                action,
                                id
                            );

                        }
                    );

                }
            );

        }
    );

}


/* =========================================================
   ARTICLE ACTION HANDLER
========================================================= */

function handleArticleAction(
    action,
    id
) {

    if (!id) {

        return;

    }


    switch (action) {

        case "edit":

            editArticle(id);

            break;


        case "publish":

            publishArticle(
                id
            );

            notify(
                "Article published successfully."
            );

            renderAdmin();

            break;


        case "draft":

            draftArticle(
                id
            );

            notify(
                "Article moved to draft."
            );

            renderAdmin();

            break;


        case "featured":

            toggleFeatured(
                id
            );

            break;


        case "delete":

            confirmDelete(
                id
            );

            break;

    }

}


/* =========================================================
   FEATURE TOGGLE
========================================================= */

function toggleFeatured(
    id
) {

    const article =
        getArticleById(
            id
        );


    if (!article) {

        return;

    }


    setFeatured(
        id,
        !article.featured
    );


    notify(
        article.featured
            ? "Article removed from featured."
            : "Article added to featured."
    );


    renderAdmin();

}


/* =========================================================
   DELETE CONFIRMATION
========================================================= */

function confirmDelete(
    id
) {

    const article =
        getArticleById(
            id
        );


    if (!article) {

        return;

    }


    const title =
        getArticleTitle(
            article,
            AdminState.language
        );


    const confirmed =
        window.confirm(

            `Delete "${title}"?\n\n` +
            `This action cannot be undone.`

        );


    if (!confirmed) {

        return;

    }


    const result =
        deleteArticle(
            id
        );


    if (
        result.success
    ) {

        if (
            AdminState.editingId ===
            id
        ) {

            clearForm();

        }


        notify(
            "Article deleted successfully."
        );


        renderAdmin();

    } else {

        notify(
            result.error ||
            "Unable to delete article."
        );

    }

}


/* =========================================================
   ADMIN FORM
========================================================= */

function setupAdminForm() {

    const form =
        $(
            "#articleForm"
        ) ||
        $(
            "[data-article-form]"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            saveArticleFromForm(
                form
            );

        }
    );


    const cancelButton =
        $(
            "#cancelArticle"
        ) ||
        $(
            "[data-cancel-article]"
        );


    cancelButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            clearForm();

        }
    );


    const newButton =
        $(
            "#newArticle"
        ) ||
        $(
            "[data-new-article]"
        );


    newButton?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            clearForm();

        }
    );

}


/* =========================================================
   SAVE ARTICLE FROM FORM
========================================================= */

function saveArticleFromForm(
    form
) {

    const data =
        getFormData(
            form
        );


    if (
        !data.title.en &&
        !data.title.hi
    ) {

        notify(
            "Please enter an article title."
        );

        return;

    }


    /*
       EDIT MODE
    */

    if (
        AdminState.editingId
    ) {

        const result =
            updateArticle(
                AdminState.editingId,
                data
            );


        if (
            result.success
        ) {

            notify(
                "Article updated successfully."
            );


            clearForm();

            renderAdmin();

        } else {

            notify(
                result.error ||
                "Unable to update article."
            );

        }


        return;

    }


    /*
       CREATE MODE
    */

    const result =
        createArticle(
            data
        );


    if (
        result.success
    ) {

        notify(
            "Article created successfully."
        );


        clearForm();

        renderAdmin();

    } else {

        notify(
            result.error ||
            "Unable to create article."
        );

    }

}


/* =========================================================
   FORM DATA
========================================================= */

function getFormData(
    form
) {

    const formData =
        new FormData(
            form
        );


    const get =
        (
            ...names
        ) => {

            for (
                const name of names
            ) {

                const value =
                    formData.get(
                        name
                    );


                if (
                    value !== null
                ) {

                    return String(
                        value
                    ).trim();

                }

            }


            return "";

        };


    const featured =
        form.querySelector(
            '[name="featured"]'
        );


    const status =
        get(
            "status"
        );


    return {

        title: {

            en:
                get(
                    "titleEn",
                    "title_en",
                    "title"
                ),

            hi:
                get(
                    "titleHi",
                    "title_hi"
                )

        },


        description: {

            en:
                get(
                    "descriptionEn",
                    "description_en",
                    "description"
                ),

            hi:
                get(
                    "descriptionHi",
                    "description_hi"
                )

        },


        content: {

            en:
                get(
                    "contentEn",
                    "content_en",
                    "content"
                ),

            hi:
                get(
                    "contentHi",
                    "content_hi"
                )

        },


        category:
            get(
                "category"
            ) ||
            "General History",


        author:
            get(
                "author"
            ) ||
            "Baba Thecno Guru",


        image:
            get(
                "image",
                "imageUrl"
            ),


        status:
            status ===
                "published"
                ? "published"
                : "draft",


        featured:
            Boolean(
                featured?.checked
            )

    };

}


/* =========================================================
   EDIT ARTICLE
========================================================= */

export function editArticle(
    id
) {

    const article =
        getArticleById(
            id
        );


    if (!article) {

        notify(
            "Article not found."
        );

        return;

    }


    AdminState.editingId =
        id;


    fillArticleForm(
        article
    );


    updateEditMode();


    const form =
        $(
            "#articleForm"
        ) ||
        $(
            "[data-article-form]"
        );


    if (form) {

        form.scrollIntoView(
            {
                behavior:
                    "smooth",
                block:
                    "start"
            }
        );

    }

}


/* =========================================================
   FILL FORM
========================================================= */

function fillArticleForm(
    article
) {

    setField(
        [
            "titleEn",
            "title_en",
            "title"
        ],
        article.title?.en
    );


    setField(
        [
            "titleHi",
            "title_hi"
        ],
        article.title?.hi
    );


    setField(
        [
            "descriptionEn",
            "description_en",
            "description"
        ],
        article.description?.en
    );


    setField(
        [
            "descriptionHi",
            "description_hi"
        ],
        article.description?.hi
    );


    setField(
        [
            "contentEn",
            "content_en",
            "content"
        ],
        article.content?.en
    );


    setField(
        [
            "contentHi",
            "content_hi"
        ],
        article.content?.hi
    );


    setField(
        [
            "category"
        ],
        article.category
    );


    setField(
        [
            "author"
        ],
        article.author
    );


    setField(
        [
            "image",
            "imageUrl"
        ],
        article.image
    );


    setField(
        [
            "status"
        ],
        article.status
    );


    const featured =
        document.querySelector(
            '[name="featured"]'
        );


    if (featured) {

        featured.checked =
            article.featured === true;

    }

}


/* =========================================================
   SET FORM FIELD
========================================================= */

function setField(
    names,
    value
) {

    for (
        const name of names
    ) {

        const element =
            document.querySelector(
                `[name="${name}"]`
            );


        if (
            element
        ) {

            element.value =
                value || "";

            return;

        }

    }

}


/* =========================================================
   CLEAR FORM
========================================================= */

export function clearForm() {

    AdminState.editingId =
        null;


    const form =
        $(
            "#articleForm"
        ) ||
        $(
            "[data-article-form]"
        );


    if (form) {

        form.reset();

    }


    const status =
        document.querySelector(
            '[name="status"]'
        );


    if (status) {

        status.value =
            "draft";

    }


    const author =
        document.querySelector(
            '[name="author"]'
        );


    if (author) {

        author.value =
            "Baba Thecno Guru";

    }


    updateEditMode();

}


/* =========================================================
   EDIT MODE UI
========================================================= */

function updateEditMode() {

    const title =
        $(
            "#articleFormTitle"
        ) ||
        $(
            "[data-article-form-title]"
        );


    const submit =
        $(
            "#articleSubmit"
        ) ||
        $(
            "[data-article-submit]"
        );


    const cancel =
        $(
            "#cancelArticle"
        ) ||
        $(
            "[data-cancel-article]"
        );


    if (
        AdminState.editingId
    ) {

        if (title) {

            title.textContent =
                "Edit Article";

        }


        if (submit) {

            submit.textContent =
                "Update Article";

        }


        if (cancel) {

            cancel.hidden =
                false;

        }

    } else {

        if (title) {

            title.textContent =
                "Create Article";

        }


        if (submit) {

            submit.textContent =
                "Create Article";

        }


        if (cancel) {

            cancel.hidden =
                true;

        }

    }

}


/* =========================================================
   SEARCH
========================================================= */

function setupAdminSearch() {

    const input =
        $(
            "#articleSearch"
        ) ||
        $(
            "[data-article-search]"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            AdminState.search =
                input.value.trim();


            renderArticles();

        }
    );

}


/* =========================================================
   FILTERS
========================================================= */

function setupAdminFilters() {

    const category =
        $(
            "#articleCategoryFilter"
        ) ||
        $(
            "[data-article-category-filter]"
        );


    category?.addEventListener(
        "change",
        () => {

            AdminState.category =
                category.value;


            renderArticles();

        }
    );


    const status =
        $(
            "#articleStatusFilter"
        ) ||
        $(
            "[data-article-status-filter]"
        );


    status?.addEventListener(
        "change",
        () => {

            AdminState.status =
                status.value;


            renderArticles();

        }
    );


    const language =
        $(
            "#adminLanguage"
        ) ||
        $(
            "[data-admin-language]"
        );


    language?.addEventListener(
        "change",
        () => {

            AdminState.language =
                language.value ||
                "en";


            renderArticles();

        }
    );

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function setupAdminActions() {

    const publishAll =
        $(
            "[data-publish-all]"
        );


    publishAll?.addEventListener(
        "click",
        () => {

            const drafts =
                getArticles().filter(
                    article =>
                        article.status ===
                        "draft"
                );


            drafts.forEach(
                article => {

                    publishArticle(
                        article.id
                    );

                }
            );


            notify(
                `${drafts.length} article(s) published.`
            );


            renderAdmin();

        }
    );


    const resetButton =
        $(
            "[data-reset-articles]"
        );


    resetButton?.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Reset all articles to default data?"
                );


            if (!confirmed) {

                return;

            }


            import(
                "./articles.js"
            )
                .then(
                    module => {

                        module
                            .resetArticles();


                        notify(
                            "Articles reset successfully."
                        );


                        clearForm();

                        renderAdmin();

                    }
                );

        }
    );

}


/* =========================================================
   ARTICLE ENGINE EVENTS
========================================================= */

function setupArticleEvents() {

    document.addEventListener(
        "historyverse:article",
        () => {

            renderAdmin();

        }
    );


    document.addEventListener(
        "historyverse:articlesync",
        () => {

            renderAdmin();

        }
    );

}


/* =========================================================
   NOTIFICATION
========================================================= */

function notify(
    message
) {

    const existing =
        document.querySelector(
            ".historyverse-admin-notice"
        );


    existing?.remove();


    const notice =
        document.createElement(
            "div"
        );


    notice.className =
        "historyverse-admin-notice";


    notice.textContent =
        message;


    document.body.appendChild(
        notice
    );


    requestAnimationFrame(
        () => {

            notice.classList.add(
                "show"
            );

        }
    );


    window.setTimeout(
        () => {

            notice.classList.remove(
                "show"
            );


            window.setTimeout(
                () => {

                    notice.remove();

                },
                300
            );

        },
        2500
    );

}


/* =========================================================
   PUBLIC ADMIN API
========================================================= */

window.ALON_ADMIN_ENGINE = {

    render:
        renderAdmin,

    edit:
        editArticle,

    clear:
        clearForm,

    create:
        createArticle,

    update:
        updateArticle,

    delete:
        deleteArticle,

    publish:
        publishArticle,

    draft:
        draftArticle,

    featured:
        setFeatured,

    search:
        searchArticles,

    stats:
        getArticleStats

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
        initAdmin
    );

} else {

    initAdmin();

}


/* =========================================================
   END OF ADMIN ENGINE
========================================================= */