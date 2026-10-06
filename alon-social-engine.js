/* ============================================================
   ALON HISTORYVERSE 24
   ALON SOCIAL ENGINE.js
   Version 2.0.0
   Creator: Baba Thecno Guru

   CENTRAL PUBLIC SOCIAL / ENGAGEMENT ENGINE
   ------------------------------------------------------------
   Like
   Dislike
   Save / Favorite
   Comments
   Reports
   Views
   Country Reach
   Aggregate Analytics
   Notifications
   Listing Status
   Sold / Filled / Booked / Rented / Closed
   Owner Controls
   Context-Restricted Messaging
   Feature Analytics
   Public Engagement Helpers

   SUPPORTED PUBLIC SYSTEMS
   ------------------------------------------------------------
   Articles
   Books
   Countries
   Civilizations
   Heritage
   Timeline
   Library
   Global Marketplace
   Regular Marketplace
   Marketplace Discovery
   Local Jobs
   International Jobs
   Global Business
   Local Business
   Luxury Items
   Luxury Lifestyle
   Movies
   Serials
   Podcasts
   Hosting
   Web Series
   Songs
   Albums
   Sports
   Games
   Tourist Guide
   Tourist Places
   Plants / Trees / Knowledge

   PRIVACY / MESSAGING RULE
   ------------------------------------------------------------
   Messaging is NEVER general user-to-user messaging.

   Allowed contexts:
   Seller <-> Buyer
   Business <-> Customer
   Employer <-> Applicant

   A message requires:
   1. Valid context/listing/job/business/product ID.
   2. Valid relationship.
   3. Backend authorization in production.
   4. Recipient belongs to that exact context.

   Public message data:
   - Name
   - Profile photo
   - Selected subject/context
   - Message
   - Timestamp

   Internal IDs are never rendered by the public messaging UI.

   SECURITY
   ------------------------------------------------------------
   Security/Admin systems are NOT part of this engine.

   localStorage is NOT a secure authorization mechanism.

   Production authorization, real users, real country reach,
   private messaging and global analytics MUST be handled by
   the backend/database.

   This engine never fabricates users, views, countries,
   sales or messages.

   IMPORTANT
   ------------------------------------------------------------
   This engine does NOT replace:
   - Regular Marketplace
   - Jobs
   - Global Marketplace
   - Luxury Lifestyle
   - Marketplace Discovery
   - Security
   - Admin
   - Existing page navigation
   - Existing page design
   - Existing listing storage

   It acts as a central public engagement layer.
   ============================================================ */

(function (window, document) {

    "use strict";


    /* ============================================================
       ROOT
       ============================================================ */

    var ALON =
        window.ALON_HISTORYVERSE =
        window.ALON_HISTORYVERSE || {};

    var SOCIAL =
        ALON.social =
        ALON.social || {};

    SOCIAL.version = "2.0.0";
    SOCIAL.engine = "ALON SOCIAL ENGINE";


    /* ============================================================
       STORAGE
       ============================================================ */

    var PREFIX =
        "alon_historyverse_social_";

    var STORAGE = {

        likes:
            PREFIX + "likes",

        dislikes:
            PREFIX + "dislikes",

        saves:
            PREFIX + "saves",

        comments:
            PREFIX + "comments",

        reports:
            PREFIX + "reports",

        views:
            PREFIX + "views",

        notifications:
            PREFIX + "notifications",

        messages:
            PREFIX + "messages",

        analytics:
            PREFIX + "analytics",

        features:
            PREFIX + "features",

        statuses:
            PREFIX + "statuses",

        ownership:
            PREFIX + "ownership",

        follows:
            PREFIX + "follows"
    };


    /* ============================================================
       UTILITIES
       ============================================================ */

    function read(key, fallback) {

        try {

            var value =
                window.localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            return fallback;
        }
    }


    function write(key, value) {

        try {

            window.localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;

        } catch (error) {

            return false;
        }
    }


    function clean(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value).trim();
    }


    function id(prefix) {

        return (
            clean(prefix) ||
            "social"
        ) +
        "_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10);
    }


    function timestamp() {

        return new Date().toISOString();
    }


    function normalizeCountry(country) {

        return clean(country) || "Unknown";
    }


    function normalizeEmail(email) {

        return clean(email).toLowerCase();
    }


    function safeNumber(value) {

        var number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : 0;
    }


    function clone(value) {

        try {

            return JSON.parse(
                JSON.stringify(value)
            );

        } catch (error) {

            return value;
        }
    }


    /* ============================================================
       COUNTRY FLAGS
       ============================================================ */

    var COUNTRY_FLAGS = {

        India: "🇮🇳",
        "United States": "🇺🇸",
        "United Kingdom": "🇬🇧",
        Canada: "🇨🇦",
        Australia: "🇦🇺",
        Germany: "🇩🇪",
        France: "🇫🇷",
        Italy: "🇮🇹",
        Spain: "🇪🇸",
        Japan: "🇯🇵",
        China: "🇨🇳",
        Brazil: "🇧🇷",
        Russia: "🇷🇺",
        UAE: "🇦🇪",
        Singapore: "🇸🇬",
        Nepal: "🇳🇵",
        Bangladesh: "🇧🇩",
        Pakistan: "🇵🇰",
        "Sri Lanka": "🇱🇰",
        Unknown: "🌍"
    };


    function countryFlag(country) {

        country =
            normalizeCountry(country);

        return (
            COUNTRY_FLAGS[country] ||
            "🌍"
        );
    }


    /* ============================================================
       CURRENT USER
       ------------------------------------------------------------
       This is only a client-side identity hint.

       It MUST NOT be treated as secure authorization.
       ============================================================ */

    function currentUser() {

        var user = null;


        try {

            if (ALON.currentUser) {

                user =
                    ALON.currentUser;
            }

        } catch (error) {}


        if (!user) {

            var possibleKeys = [

                "alon_historyverse_current_user",
                "alon_user",
                "alonUser",
                "alon_account",
                "alon_historyverse_user",
                "alon_historyverse_account",
                "regular_marketplace_account",
                "currentUser",
                "user"
            ];


            for (
                var i = 0;
                i < possibleKeys.length;
                i++
            ) {

                try {

                    var saved =
                        window.localStorage.getItem(
                            possibleKeys[i]
                        );


                    if (saved) {

                        var parsed =
                            JSON.parse(saved);


                        if (parsed) {

                            user =
                                parsed;

                            break;
                        }
                    }

                } catch (error) {}
            }
        }


        if (!user) {

            return {

                id: "guest",

                name: "Guest",

                photo: "",

                email: "",

                country: "Unknown"
            };
        }


        return {

            id:
                clean(
                    user.id ||
                    user.userId ||
                    user.uid
                ) || "guest",

            name:
                clean(
                    user.name ||
                    user.displayName ||
                    user.ownerName
                ) || "Guest",

            photo:
                clean(
                    user.photo ||
                    user.photoURL ||
                    user.avatar
                ),

            email:
                normalizeEmail(
                    user.email ||
                    user.ownerEmail
                ),

            country:
                normalizeCountry(
                    user.country ||
                    user.countryName
                )
        };
    }


    /* ============================================================
       TARGET NORMALIZATION
       ============================================================ */

    function target(options) {

        options =
            options || {};


        return {

            targetId:
                clean(
                    options.targetId ||
                    options.id ||
                    options.listingId ||
                    options.articleId ||
                    options.jobId ||
                    options.businessId ||
                    options.productId
                ),

            targetType:
                clean(
                    options.targetType ||
                    options.type ||
                    options.contextType
                ) || "content",

            feature:
                clean(
                    options.feature ||
                    options.featureName
                ),

            listingId:
                clean(
                    options.listingId
                ),

            articleId:
                clean(
                    options.articleId
                ),

            jobId:
                clean(
                    options.jobId
                ),

            businessId:
                clean(
                    options.businessId
                ),

            productId:
                clean(
                    options.productId
                ),

            subjectId:
                clean(
                    options.subjectId
                ),

            title:
                clean(
                    options.title ||
                    options.subjectTitle ||
                    options.listingTitle ||
                    options.productTitle ||
                    options.jobTitle ||
                    options.businessName
                )
        };
    }


    /* ============================================================
       FEATURE REGISTRY
       ============================================================ */

    var FEATURE_META = {

        articles: {
            title: "Articles",
            type: "content"
        },

        books: {
            title: "Books",
            type: "content"
        },

        countries: {
            title: "Countries",
            type: "knowledge"
        },

        civilizations: {
            title: "Civilizations",
            type: "knowledge"
        },

        heritage: {
            title: "Heritage",
            type: "knowledge"
        },

        timeline: {
            title: "Timeline",
            type: "knowledge"
        },

        library: {
            title: "Library",
            type: "knowledge"
        },

        plants: {
            title: "World Trees & Plants",
            type: "knowledge"
        },

        trees: {
            title: "Trees & Plants",
            type: "knowledge"
        },

        shell: {
            title: "Shankh",
            type: "knowledge"
        },

        shankh: {
            title: "Shankh",
            type: "knowledge"
        },

        marketplace: {
            title: "Marketplace",
            type: "marketplace"
        },

        globalMarketplace: {
            title: "Global Marketplace",
            type: "marketplace"
        },

        regularMarketplace: {
            title: "Regular Marketplace",
            type: "marketplace"
        },

        marketplaceDiscovery: {
            title: "Marketplace Discovery",
            type: "marketplace"
        },

        localJobs: {
            title: "Local Jobs",
            type: "jobs"
        },

        internationalJobs: {
            title: "International Jobs",
            type: "jobs"
        },

        globalBusiness: {
            title: "Global Business",
            type: "business"
        },

        localBusiness: {
            title: "Local Business",
            type: "business"
        },

        luxuryItems: {
            title: "Luxury Items",
            type: "luxury"
        },

        luxuryLifestyle: {
            title: "Luxury Lifestyle",
            type: "luxury"
        },

        movies: {
            title: "Movies",
            type: "entertainment"
        },

        serials: {
            title: "Serials",
            type: "entertainment"
        },

        podcasts: {
            title: "Podcasts",
            type: "entertainment"
        },

        hosting: {
            title: "Hosting",
            type: "technology"
        },

        webSeries: {
            title: "Web Series",
            type: "entertainment"
        },

        songs: {
            title: "Songs",
            type: "music"
        },

        albums: {
            title: "Albums",
            type: "music"
        },

        sports: {
            title: "Sports",
            type: "sports"
        },

        games: {
            title: "Games",
            type: "games"
        },

        touristGuide: {
            title: "Tourist Guide",
            type: "travel"
        },

        touristPlaces: {
            title: "Tourist Places",
            type: "travel"
        },

        cultureTourGuide: {
            title: "Culture Tour Guide",
            type: "travel"
        },

        worldCulture: {
            title: "World Culture",
            type: "culture"
        }
    };


    SOCIAL.FEATURE_META =
        FEATURE_META;


    /* ============================================================
       FEATURE
       ============================================================ */

    function getFeature(name) {

        var key =
            clean(name);

        if (FEATURE_META[key]) {

            return FEATURE_META[key];
        }


        var normalized =
            key
                .toLowerCase()
                .replace(
                    /[\s_-]/g,
                    ""
                );


        var keys =
            Object.keys(
                FEATURE_META
            );


        for (
            var i = 0;
            i < keys.length;
            i++
        ) {

            var current =
                keys[i]
                    .toLowerCase()
                    .replace(
                        /[\s_-]/g,
                        ""
                    );


            if (
                current ===
                normalized
            ) {

                return FEATURE_META[
                    keys[i]
                ];
            }
        }


        return null;
    }


    /* ============================================================
       GENERIC USER ACTION STORAGE
       ============================================================ */

    function userHasAction(data, targetId, userId) {

        if (
            !data[targetId] ||
            !Array.isArray(
                data[targetId].users
            )
        ) {
            return false;
        }


        return (
            data[targetId]
                .users
                .indexOf(userId) !== -1
        );
    }


    function ensureActionItem(
        data,
        targetId
    ) {

        if (!data[targetId]) {

            data[targetId] = {

                count: 0,

                users: []
            };
        }


        if (
            !Array.isArray(
                data[targetId].users
            )
        ) {

            data[targetId].users = [];
        }


        data[targetId].count =
            safeNumber(
                data[targetId].count
            );
    }


    /* ============================================================
       LIKE
       ============================================================ */

    function getLikes() {

        return read(
            STORAGE.likes,
            {}
        );
    }


    function like(options) {

        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var data =
            getLikes();

        var user =
            currentUser();


        ensureActionItem(
            data,
            item.targetId
        );


        /*
         * One account cannot create duplicate likes.
         */

        if (
            !userHasAction(
                data,
                item.targetId,
                user.id
            )
        ) {

            data[item.targetId]
                .users
                .push(user.id);

            data[item.targetId]
                .count++;
        }


        write(
            STORAGE.likes,
            data
        );


        recordAnalytics(
            "like",
            item,
            user.country
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            liked: true
        };
    }


    function unlike(options) {

        var item =
            target(options);

        var data =
            getLikes();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            return {

                success: true,

                count: 0,

                liked: false
            };
        }


        var index =
            data[item.targetId]
                .users
                .indexOf(user.id);


        if (index !== -1) {

            data[item.targetId]
                .users
                .splice(
                    index,
                    1
                );

            data[item.targetId]
                .count =
                Math.max(
                    0,
                    data[item.targetId]
                        .count - 1
                );
        }


        write(
            STORAGE.likes,
            data
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            liked: false
        };
    }


    /* ============================================================
       DISLIKE
       ============================================================ */

    function getDislikes() {

        return read(
            STORAGE.dislikes,
            {}
        );
    }


    function dislike(options) {

        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var data =
            getDislikes();

        var user =
            currentUser();


        ensureActionItem(
            data,
            item.targetId
        );


        if (
            !userHasAction(
                data,
                item.targetId,
                user.id
            )
        ) {

            data[item.targetId]
                .users
                .push(user.id);

            data[item.targetId]
                .count++;
        }


        write(
            STORAGE.dislikes,
            data
        );


        recordAnalytics(
            "dislike",
            item,
            user.country
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            disliked: true
        };
    }


    function undislike(options) {

        var item =
            target(options);

        var data =
            getDislikes();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            return {

                success: true,

                count: 0,

                disliked: false
            };
        }


        var index =
            data[item.targetId]
                .users
                .indexOf(user.id);


        if (index !== -1) {

            data[item.targetId]
                .users
                .splice(
                    index,
                    1
                );

            data[item.targetId]
                .count =
                Math.max(
                    0,
                    data[item.targetId]
                        .count - 1
                );
        }


        write(
            STORAGE.dislikes,
            data
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            disliked: false
        };
    }


    /* ============================================================
       SAVE / FAVORITE
       ============================================================ */

    function getSaves() {

        return read(
            STORAGE.saves,
            {}
        );
    }


    function save(options) {

        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var data =
            getSaves();

        var user =
            currentUser();


        ensureActionItem(
            data,
            item.targetId
        );


        if (
            !userHasAction(
                data,
                item.targetId,
                user.id
            )
        ) {

            data[item.targetId]
                .users
                .push(user.id);

            data[item.targetId]
                .count++;
        }


        write(
            STORAGE.saves,
            data
        );


        recordAnalytics(
            "save",
            item,
            user.country
        );


        return {

            success: true,

            saved: true,

            count:
                data[item.targetId]
                    .count
        };
    }


    function unsave(options) {

        var item =
            target(options);

        var data =
            getSaves();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            return {

                success: true,

                saved: false,

                count: 0
            };
        }


        var index =
            data[item.targetId]
                .users
                .indexOf(user.id);


        if (index !== -1) {

            data[item.targetId]
                .users
                .splice(
                    index,
                    1
                );

            data[item.targetId]
                .count =
                Math.max(
                    0,
                    data[item.targetId]
                        .count - 1
                );
        }


        write(
            STORAGE.saves,
            data
        );


        return {

            success: true,

            saved: false,

            count:
                data[item.targetId]
                    .count
        };
    }


    function isSaved(targetId) {

        var data =
            getSaves();

        var user =
            currentUser();


        return userHasAction(
            data,
            targetId,
            user.id
        );
    }


    /* ============================================================
       COMMENTS
       ============================================================ */

    function getComments() {

        return read(
            STORAGE.comments,
            {}
        );
    }


    function addComment(options) {

        options =
            options || {};


        var item =
            target(options);

        var text =
            clean(
                options.text ||
                options.comment
            );


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        if (!text) {

            return {

                success: false,

                error:
                    "Comment cannot be empty."
            };
        }


        var data =
            getComments();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            data[item.targetId] = [];
        }


        var comment = {

            id:
                id("comment"),

            targetId:
                item.targetId,

            targetType:
                item.targetType,

            name:
                user.name,

            photo:
                user.photo,

            text:
                text,

            createdAt:
                timestamp()
        };


        data[item.targetId]
            .push(comment);


        write(
            STORAGE.comments,
            data
        );


        recordAnalytics(
            "comment",
            item,
            user.country
        );


        return {

            success: true,

            comment:
                publicComment(
                    comment
                )
        };
    }


    function publicComment(comment) {

        if (!comment) {
            return null;
        }


        return {

            id:
                clean(
                    comment.id
                ),

            name:
                clean(
                    comment.name
                ) || "User",

            photo:
                clean(
                    comment.photo
                ),

            text:
                clean(
                    comment.text
                ),

            createdAt:
                clean(
                    comment.createdAt
                )
        };
    }


    function comments(options) {

        var item =
            target(options);

        var data =
            getComments();


        return (
            data[item.targetId] ||
            []
        )
        .map(
            publicComment
        );
    }


    function deleteComment(options) {

        options =
            options || {};


        var item =
            target(options);

        var commentId =
            clean(
                options.commentId
            );

        var data =
            getComments();


        if (
            !data[item.targetId]
        ) {

            return {
                success: false
            };
        }


        var index =
            data[item.targetId]
                .findIndex(
                    function (comment) {

                        return (
                            comment.id ===
                            commentId
                        );
                    }
                );


        if (index === -1) {

            return {
                success: false
            };
        }


        /*
         * Production deletion must be authorized
         * by backend ownership/moderation logic.
         */

        if (
            backend &&
            typeof backend.authorizeCommentDelete ===
            "function"
        ) {

            return Promise.resolve(
                backend.authorizeCommentDelete({

                    commentId:
                        commentId,

                    targetId:
                        item.targetId
                })
            )
            .then(
                function (result) {

                    if (
                        !result ||
                        result.success !== true
                    ) {

                        return {
                            success: false
                        };
                    }


                    data[item.targetId]
                        .splice(
                            index,
                            1
                        );


                    write(
                        STORAGE.comments,
                        data
                    );


                    return {
                        success: true
                    };
                }
            );
        }


        return {

            success: false,

            error:
                "Secure comment authorization is required."
        };
    }


    /* ============================================================
       REPORTS
       ============================================================ */

    function getReports() {

        return read(
            STORAGE.reports,
            []
        );
    }


    function report(options) {

        options =
            options || {};


        var item =
            target(options);

        var reason =
            clean(
                options.reason
            ) || "Other";


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var reports =
            getReports();


        var reportItem = {

            id:
                id("report"),

            targetId:
                item.targetId,

            targetType:
                item.targetType,

            reason:
                reason,

            details:
                clean(
                    options.details
                ),

            status:
                "pending",

            createdAt:
                timestamp()
        };


        reports.push(
            reportItem
        );


        write(
            STORAGE.reports,
            reports
        );


        recordAnalytics(
            "report",
            item,
            currentUser().country
        );


        return {

            success: true,

            report: {

                id:
                    reportItem.id,

                targetId:
                    reportItem.targetId,

                targetType:
                    reportItem.targetType,

                reason:
                    reportItem.reason,

                status:
                    reportItem.status,

                createdAt:
                    reportItem.createdAt
            }
        };
    }


    /* ============================================================
       VIEWS
       ============================================================ */

    function getViews() {

        return read(
            STORAGE.views,
            {}
        );
    }


    function recordView(options) {

        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var data =
            getViews();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            data[item.targetId] = {

                total: 0,

                countries: {},

                lastViewed:
                    null
            };
        }


        var country =
            normalizeCountry(
                options &&
                options.country
                    ? options.country
                    : user.country
            );


        data[item.targetId]
            .total++;


        if (
            !data[item.targetId]
                .countries[country]
        ) {

            data[item.targetId]
                .countries[country] = 0;
        }


        data[item.targetId]
            .countries[country]++;


        data[item.targetId]
            .lastViewed =
            timestamp();


        write(
            STORAGE.views,
            data
        );


        recordAnalytics(
            "view",
            item,
            country
        );


        return {

            success: true,

            total:
                data[item.targetId]
                    .total,

            countries:
                clone(
                    data[item.targetId]
                        .countries
                )
        };
    }


    function getViewStats(targetId) {

        var data =
            getViews();


        return (
            data[targetId] || {

                total: 0,

                countries: {},

                lastViewed:
                    null
            }
        );
    }


    /* ============================================================
       COUNTRY REACH
       ============================================================ */

    function countryReach(targetId) {

        var stats =
            getViewStats(
                targetId
            );


        var countries =
            stats.countries || {};


        return Object.keys(
            countries
        )
        .map(
            function (country) {

                return {

                    country:
                        country,

                    flag:
                        countryFlag(
                            country
                        ),

                    count:
                        safeNumber(
                            countries[
                                country
                            ]
                        )
                };
            }
        )
        .sort(
            function (a, b) {

                return (
                    b.count -
                    a.count
                );
            }
        );
    }


    function countryReachDisplay(targetId) {

        return countryReach(
            targetId
        )
        .map(
            function (item) {

                return (
                    item.flag +
                    " " +
                    item.country +
                    " — " +
                    item.count +
                    " viewers"
                );
            }
        );
    }


    /* ============================================================
       ANALYTICS
       ============================================================ */

    function getAnalytics() {

        return read(
            STORAGE.analytics,
            {}
        );
    }


    function recordAnalytics(
        action,
        item,
        country
    ) {

        item =
            item || {};


        var data =
            getAnalytics();

        var targetId =
            clean(
                item.targetId
            );


        if (!targetId) {
            return false;
        }


        if (!data[targetId]) {

            data[targetId] = {

                actions: {},

                countries: {},

                firstSeen:
                    timestamp(),

                lastSeen:
                    timestamp()
            };
        }


        if (
            !data[targetId]
                .actions[action]
        ) {

            data[targetId]
                .actions[action] = 0;
        }


        data[targetId]
            .actions[action]++;


        data[targetId]
            .lastSeen =
            timestamp();


        if (country) {

            country =
                normalizeCountry(
                    country
                );


            if (
                !data[targetId]
                    .countries[country]
            ) {

                data[targetId]
                    .countries[country] = 0;
            }


            data[targetId]
                .countries[country]++;
        }


        write(
            STORAGE.analytics,
            data
        );


        return true;
    }


    /* ============================================================
       SOCIAL SUMMARY
       ============================================================ */

    function stats(targetId) {

        var likes =
            getLikes();

        var dislikes =
            getDislikes();

        var saves =
            getSaves();

        var commentData =
            getComments();

        var viewData =
            getViews();


        var likeItem =
            likes[targetId] || {

                count: 0,

                users: []
            };


        var dislikeItem =
            dislikes[targetId] || {

                count: 0,

                users: []
            };


        var saveItem =
            saves[targetId] || {

                count: 0,

                users: []
            };


        var viewItem =
            viewData[targetId] || {

                total: 0,

                countries: {}
            };


        var user =
            currentUser();


        return {

            targetId:
                targetId,

            likes:
                safeNumber(
                    likeItem.count
                ),

            dislikes:
                safeNumber(
                    dislikeItem.count
                ),

            saves:
                safeNumber(
                    saveItem.count
                ),

            comments:
                (
                    commentData[
                        targetId
                    ] || []
                ).length,

            views:
                safeNumber(
                    viewItem.total
                ),

            countries:
                clone(
                    viewItem.countries
                ),

            countryReach:
                countryReach(
                    targetId
                ),

            liked:
                userHasAction(
                    likes,
                    targetId,
                    user.id
                ),

            disliked:
                userHasAction(
                    dislikes,
                    targetId,
                    user.id
                ),

            saved:
                userHasAction(
                    saves,
                    targetId,
                    user.id
                )
        };
    }


    /* ============================================================
       NOTIFICATIONS
       ============================================================ */

    function getNotifications() {

        return read(
            STORAGE.notifications,
            []
        );
    }


    function notify(options) {

        options =
            options || {};


        var notifications =
            getNotifications();


        var notification = {

            id:
                id("notification"),

            recipientId:
                clean(
                    options.recipientId
                ),

            type:
                clean(
                    options.type
                ) || "system",

            title:
                clean(
                    options.title
                ) || "ALON HISTORYVERSE 24",

            message:
                clean(
                    options.message
                ),

            targetId:
                clean(
                    options.targetId
                ),

            status:
                clean(
                    options.status
                ),

            contextType:
                clean(
                    options.contextType
                ),

            read:
                false,

            createdAt:
                timestamp()
        };


        /*
         * Without a recipient there is no private
         * notification delivery.
         */

        if (!notification.recipientId) {

            return {

                success: false,

                error:
                    "Recipient is required."
            };
        }


        notifications.unshift(
            notification
        );


        if (
            notifications.length >
            500
        ) {

            notifications =
                notifications.slice(
                    0,
                    500
                );
        }


        write(
            STORAGE.notifications,
            notifications
        );


        return {

            success: true
        };
    }


    function userNotifications(userId) {

        userId =
            clean(
                userId
            ) ||
            currentUser().id;


        return getNotifications()
            .filter(
                function (item) {

                    return (
                        item.recipientId ===
                        userId
                    );
                }
            )
            .map(
                function (item) {

                    return {

                        id:
                            item.id,

                        type:
                            item.type,

                        title:
                            item.title,

                        message:
                            item.message,

                        targetId:
                            item.targetId,

                        status:
                            item.status,

                        contextType:
                            item.contextType,

                        read:
                            item.read,

                        createdAt:
                            item.createdAt
                    };
                }
            );
    }


    function unreadNotificationCount(userId) {

        return userNotifications(
            userId
        )
        .filter(
            function (item) {

                return item.read !== true;
            }
        ).length;
    }


    function readNotification(
        notificationId
    ) {

        var notifications =
            getNotifications();

        var user =
            currentUser();

        var changed =
            false;


        notifications.forEach(
            function (item) {

                if (
                    item.id ===
                    notificationId &&
                    item.recipientId ===
                    user.id
                ) {

                    item.read =
                        true;

                    changed =
                        true;
                }
            }
        );


        write(
            STORAGE.notifications,
            notifications
        );


        return changed;
    }


    function deleteNotification(
        notificationId
    ) {

        var notifications =
            getNotifications();

        var user =
            currentUser();

        var before =
            notifications.length;


        notifications =
            notifications.filter(
                function (item) {

                    return !(
                        item.id ===
                        notificationId &&
                        item.recipientId ===
                        user.id
                    );
                }
            );


        write(
            STORAGE.notifications,
            notifications
        );


        return (
            notifications.length !==
            before
        );
    }


    /* ============================================================
       LISTING / ITEM STATUS SYSTEM
       ============================================================ */

    var STATUS_VALUES = [

        "draft",
        "active",
        "pending",
        "available",
        "sold",
        "filled",
        "closed",
        "rented",
        "booked",
        "cancelled",
        "expired",
        "paused"
    ];


    function validStatus(status) {

        return (
            STATUS_VALUES.indexOf(
                clean(status).toLowerCase()
            ) !== -1
        );
    }


    function getStatuses() {

        return read(
            STORAGE.statuses,
            {}
        );
    }


    function getStatus(targetId) {

        var data =
            getStatuses();


        return (
            data[targetId] || {

                status: "active",

                updatedAt:
                    null
            }
        );
    }


    function setStatus(options) {

        options =
            options || {};


        var item =
            target(options);

        var status =
            clean(
                options.status
            ).toLowerCase();


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        if (!validStatus(status)) {

            return {

                success: false,

                error:
                    "Invalid listing status."
            };
        }


        var data =
            getStatuses();

        var oldStatus =
            data[item.targetId]
                ? data[item.targetId].status
                : "active";


        /*
         * Owner/backend authorization.
         */

        if (
            backend &&
            typeof backend.authorizeStatusChange ===
            "function"
        ) {

            return Promise.resolve(
                backend.authorizeStatusChange({

                    target:
                        item,

                    oldStatus:
                        oldStatus,

                    newStatus:
                        status
                })
            )
            .then(
                function (authorized) {

                    if (
                        !authorized ||
                        authorized.success !== true
                    ) {

                        return {

                            success: false,

                            error:
                                authorized &&
                                authorized.error
                                    ? authorized.error
                                    : "Status change denied."
                        };
                    }


                    return saveStatusChange(
                        data,
                        item,
                        oldStatus,
                        status
                    );
                }
            );
        }


        /*
         * Local mode is useful for existing frontend
         * systems, but is not secure authorization.
         */

        var result =
            saveStatusChange(
                data,
                item,
                oldStatus,
                status
            );


        return result;
    }


    function saveStatusChange(
        data,
        item,
        oldStatus,
        status
    ) {

        data[item.targetId] = {

            status:
                status,

            previousStatus:
                oldStatus,

            updatedAt:
                timestamp()
        };


        write(
            STORAGE.statuses,
            data
        );


        recordAnalytics(
            "status_" + status,
            item,
            currentUser().country
        );


        /*
         * Context notification can be sent by the
         * backend when a real recipient exists.
         */

        if (
            backend &&
            typeof backend.notifyStatusChange ===
            "function"
        ) {

            try {

                backend.notifyStatusChange({

                    target:
                        item,

                    oldStatus:
                        oldStatus,

                    newStatus:
                        status
                });

            } catch (error) {}
        }


        return {

            success: true,

            status:
                status,

            previousStatus:
                oldStatus
        };
    }


    function markSold(options) {

        options =
            options || {};

        options.status =
            "sold";

        return setStatus(
            options
        );
    }


    function markFilled(options) {

        options =
            options || {};

        options.status =
            "filled";

        return setStatus(
            options
        );
    }


    function markBooked(options) {

        options =
            options || {};

        options.status =
            "booked";

        return setStatus(
            options
        );
    }


    function markRented(options) {

        options =
            options || {};

        options.status =
            "rented";

        return setStatus(
            options
        );
    }


    function markClosed(options) {

        options =
            options || {};

        options.status =
            "closed";

        return setStatus(
            options
        );
    }


    function reopenListing(options) {

        options =
            options || {};

        options.status =
            "active";

        return setStatus(
            options
        );
    }


    /* ============================================================
       MESSAGE RELATIONSHIPS
       ============================================================ */

    var MESSAGE_RELATIONSHIPS = [

        "seller-buyer",

        "buyer-seller",

        "business-customer",

        "customer-business",

        "employer-applicant",

        "applicant-employer"
    ];


    function validRelationship(
        relationship
    ) {

        relationship =
            clean(
                relationship
            ).toLowerCase();


        return (
            MESSAGE_RELATIONSHIPS
                .indexOf(
                    relationship
                ) !== -1
        );
    }


    /* ============================================================
       MESSAGE CONTEXT
       ============================================================ */

    function getMessageContext(options) {

        options =
            options || {};


        return {

            type:
                clean(
                    options.contextType ||
                    options.targetType ||
                    options.type
                ).toLowerCase(),

            feature:
                clean(
                    options.feature
                ),

            listingId:
                clean(
                    options.listingId
                ),

            transactionId:
                clean(
                    options.transactionId
                ),

            jobId:
                clean(
                    options.jobId
                ),

            businessId:
                clean(
                    options.businessId
                ),

            productId:
                clean(
                    options.productId
                ),

            subjectId:
                clean(
                    options.subjectId
                ),

            subjectTitle:
                clean(
                    options.subjectTitle ||
                    options.contextTitle ||
                    options.listingTitle ||
                    options.productTitle ||
                    options.jobTitle ||
                    options.businessName
                )
        };
    }


    function hasMessageContext(options) {

        var context =
            getMessageContext(
                options
            );


        return !!(
            context.listingId ||
            context.transactionId ||
            context.jobId ||
            context.businessId ||
            context.productId ||
            context.subjectId
        );
    }


    /* ============================================================
       BACKEND ADAPTER
       ============================================================ */

    var backend =
        null;


    function setBackend(adapter) {

        if (
            !adapter ||
            typeof adapter !==
            "object"
        ) {

            backend =
                null;

            return false;
        }


        backend =
            adapter;


        return true;
    }


    function getBackend() {

        return backend;
    }


    function sync(method, payload) {

        if (
            !backend ||
            typeof backend[method] !==
            "function"
        ) {

            return Promise.resolve({

                success: false,

                localOnly: true,

                error:
                    "Backend method is not configured."
            });
        }


        try {

            return Promise.resolve(
                backend[method](
                    payload
                )
            );

        } catch (error) {

            return Promise.resolve({

                success: false,

                error:
                    error.message
            });
        }
    }


    /* ============================================================
       MESSAGE AUTHORIZATION
       ============================================================ */

    function authorizeMessage(
        options
    ) {

        options =
            options || {};


        var relationship =
            clean(
                options.relationship
            ).toLowerCase();


        if (
            !validRelationship(
                relationship
            )
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "Invalid messaging relationship."
            });
        }


        if (
            !hasMessageContext(
                options
            )
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "A valid selected subject or transaction context is required."
            });
        }


        if (
            !backend ||
            typeof backend.authorizeMessage !==
            "function"
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "Secure backend authorization is required for messaging."
            });
        }


        var context =
            getMessageContext(
                options
            );


        try {

            return Promise.resolve(
                backend.authorizeMessage({

                    relationship:
                        relationship,

                    context:
                        context,

                    subjectTitle:
                        context.subjectTitle,

                    currentUserSession:
                        true
                })
            );

        } catch (error) {

            return Promise.resolve({

                success: false,

                error:
                    error.message
            });
        }
    }


    function canMessage(options) {

        return authorizeMessage(
            options
        );
    }


    /* ============================================================
       PUBLIC MESSAGE SANITIZER
       ============================================================ */

    function publicMessage(message) {

        if (!message) {
            return null;
        }


        return {

            name:
                clean(
                    message.name
                ) || "User",

            photo:
                clean(
                    message.photo
                ),

            subject:
                clean(
                    message.subject ||
                    message.subjectTitle
                ),

            message:
                clean(
                    message.message
                ),

            createdAt:
                clean(
                    message.createdAt
                )
        };
    }


    /* ============================================================
       SEND MESSAGE
       ============================================================ */

    function sendMessage(options) {

        options =
            options || {};


        var text =
            clean(
                options.message
            );


        if (!text) {

            return Promise.resolve({

                success: false,

                error:
                    "Message cannot be empty."
            });
        }


        var context =
            getMessageContext(
                options
            );


        if (
            !hasMessageContext(
                options
            )
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "Messaging requires a selected subject, listing, job or business context."
            });
        }


        return authorizeMessage(
            options
        )
        .then(
            function (authorization) {

                if (
                    !authorization ||
                    authorization.success !==
                    true
                ) {

                    return {

                        success: false,

                        error:
                            authorization &&
                            authorization.error
                                ? authorization.error
                                : "Messaging authorization failed."
                    };
                }


                if (
                    !backend ||
                    typeof backend.sendContextMessage !==
                    "function"
                ) {

                    return {

                        success: false,

                        error:
                            "Secure message delivery is not configured."
                    };
                }


                var sendPayload = {

                    relationship:
                        clean(
                            options.relationship
                        ).toLowerCase(),

                    context:
                        context,

                    message:
                        text
                };


                try {

                    return Promise.resolve(
                        backend.sendContextMessage(
                            sendPayload
                        )
                    )
                    .then(
                        function (result) {

                            if (
                                !result ||
                                result.success !==
                                true
                            ) {

                                return {

                                    success: false,

                                    error:
                                        result &&
                                        result.error
                                            ? result.error
                                            : "Message was not delivered."
                                };
                            }


                            return {

                                success: true,

                                message:
                                    publicMessage(
                                        result.message
                                    )
                            };
                        }
                    );

                } catch (error) {

                    return {

                        success: false,

                        error:
                            error.message
                    };
                }
            }
        );
    }


    /* ============================================================
       CONVERSATION
       ============================================================ */

    function conversation(options) {

        options =
            options || {};


        if (
            !hasMessageContext(
                options
            )
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "Conversation context is required."
            });
        }


        if (
            !backend ||
            typeof backend.getContextConversation !==
            "function"
        ) {

            return Promise.resolve({

                success: false,

                error:
                    "Secure backend conversation access is required."
            });
        }


        try {

            return Promise.resolve(
                backend.getContextConversation({

                    context:
                        getMessageContext(
                            options
                        ),

                    relationship:
                        clean(
                            options.relationship
                        ).toLowerCase()
                })
            )
            .then(
                function (result) {

                    if (
                        !result ||
                        result.success !== true
                    ) {

                        return {

                            success: false,

                            error:
                                result &&
                                result.error
                                    ? result.error
                                    : "Conversation access denied."
                        };
                    }


                    return {

                        success: true,

                        messages:
                            (
                                result.messages ||
                                []
                            )
                            .map(
                                publicMessage
                            )
                    };
                }
            );

        } catch (error) {

            return Promise.resolve({

                success: false,

                error:
                    error.message
            });
        }
    }


    /* ============================================================
       FEATURE OPEN ANALYTICS
       ============================================================ */

    function featureOpen(feature) {

        var meta =
            getFeature(
                feature
            );


        if (!meta) {

            return {

                success: false,

                error:
                    "Unknown feature."
            };
        }


        var data =
            read(
                STORAGE.features,
                {}
            );


        var key =
            clean(
                feature
            );


        if (!data[key]) {

            data[key] = {

                title:
                    meta.title,

                type:
                    meta.type,

                opens:
                    0,

                lastOpened:
                    null
            };
        }


        data[key]
            .opens++;


        data[key]
            .lastOpened =
            timestamp();


        write(
            STORAGE.features,
            data
        );


        return {

            success: true,

            feature:
                clone(
                    data[key]
                )
        };
    }


    /* ============================================================
       FEATURE LINK TRACKING
       ============================================================ */

    function bindFeatureLinks(root) {

        root =
            root ||
            document;


        var links =
            root.querySelectorAll(
                "[data-feature]"
            );


        for (
            var i = 0;
            i < links.length;
            i++
        ) {

            if (
                links[i]
                    .dataset
                    .alonSocialBound ===
                "true"
            ) {

                continue;
            }


            links[i]
                .dataset
                .alonSocialBound =
                "true";


            links[i].addEventListener(
                "click",
                function () {

                    var feature =
                        this.getAttribute(
                            "data-feature"
                        );


                    featureOpen(
                        feature
                    );
                }
            );
        }


        return links.length;
    }


    /* ============================================================
       AUTO VIEW TRACKING
       ------------------------------------------------------------
       Any element with:
       data-social-target="ID"

       may automatically record one view when it
       enters the page.

       Pages can also call recordView() directly.
       ============================================================ */

    function bindViewTracking(root) {

        root =
            root ||
            document;


        var elements =
            root.querySelectorAll(
                "[data-social-target]"
            );


        for (
            var i = 0;
            i < elements.length;
            i++
        ) {

            if (
                elements[i]
                    .dataset
                    .alonViewBound ===
                "true"
            ) {

                continue;
            }


            elements[i]
                .dataset
                .alonViewBound =
                "true";


            (
                function (element) {

                    var targetId =
                        clean(
                            element.getAttribute(
                                "data-social-target"
                            )
                        );


                    var targetType =
                        clean(
                            element.getAttribute(
                                "data-social-type"
                            )
                        ) ||
                        "content";


                    if (!targetId) {
                        return;
                    }


                    if (
                        "IntersectionObserver" in
                        window
                    ) {

                        var observer =
                            new IntersectionObserver(
                                function (
                                    entries,
                                    observerInstance
                                ) {

                                    entries.forEach(
                                        function (entry) {

                                            if (
                                                entry.isIntersecting
                                            ) {

                                                recordView({

                                                    targetId:
                                                        targetId,

                                                    targetType:
                                                        targetType
                                                });


                                                observerInstance
                                                    .unobserve(
                                                        element
                                                    );
                                            }
                                        }
                                    );
                                },
                                {
                                    threshold:
                                        0.25
                                }
                            );


                        observer.observe(
                            element
                        );

                    } else {

                        recordView({

                            targetId:
                                targetId,

                            targetType:
                                targetType
                        });
                    }

                }
            )(
                elements[i]
            );
        }


        return elements.length;
    }


    /* ============================================================
       OWNER / LISTING CONTEXT
       ============================================================ */

    function setOwnership(options) {

        options =
            options || {};


        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var user =
            currentUser();


        var data =
            read(
                STORAGE.ownership,
                {}
            );


        data[item.targetId] = {

            ownerId:
                clean(
                    options.ownerId
                ) || user.id,

            ownerName:
                clean(
                    options.ownerName
                ) || user.name,

            ownerEmail:
                normalizeEmail(
                    options.ownerEmail
                ) || user.email,

            updatedAt:
                timestamp()
        };


        write(
            STORAGE.ownership,
            data
        );


        return {

            success: true
        };
    }


    function getOwnership(targetId) {

        var data =
            read(
                STORAGE.ownership,
                {}
            );


        return (
            data[targetId] ||
            null
        );
    }


    function isOwner(options) {

        options =
            options || {};


        var item =
            target(options);

        var owner =
            getOwnership(
                item.targetId
            );

        var user =
            currentUser();


        if (!owner) {

            return false;
        }


        return (
            (
                owner.ownerId &&
                owner.ownerId ===
                user.id
            ) ||
            (
                owner.ownerEmail &&
                owner.ownerEmail ===
                user.email
            )
        );
    }


    /* ============================================================
       GENERIC OWNER DELETE AUTHORIZATION
       ============================================================ */

    function authorizeOwnerAction(
        options
    ) {

        options =
            options || {};


        var item =
            target(options);


        if (!item.targetId) {

            return Promise.resolve({

                success: false,

                error:
                    "Target ID required."
            });
        }


        if (
            backend &&
            typeof backend.authorizeOwnerAction ===
            "function"
        ) {

            try {

                return Promise.resolve(
                    backend.authorizeOwnerAction({

                        action:
                            clean(
                                options.action
                            ),

                        target:
                            item
                    })
                );

            } catch (error) {

                return Promise.resolve({

                    success: false,

                    error:
                        error.message
                });
            }
        }


        /*
         * Frontend fallback.
         * This is NOT secure authorization.
         */

        return Promise.resolve({

            success:
                isOwner(
                    item
                ),

            localOnly:
                true,

            error:
                "Backend owner authorization is not configured."
        });
    }


    /* ============================================================
       FEATURE / TARGET SUMMARY
       ============================================================ */

    function fullSummary(options) {

        var item =
            target(options);


        if (!item.targetId) {

            return {

                success: false,

                error:
                    "Target ID required."
            };
        }


        var social =
            stats(
                item.targetId
            );


        var status =
            getStatus(
                item.targetId
            );


        var ownership =
            getOwnership(
                item.targetId
            );


        return {

            success: true,

            target:
                item,

            social:
                social,

            status:
                status,

            ownership:
                ownership,

            owner:
                isOwner(
                    item
                ),

            countryReach:
                countryReach(
                    item.targetId
                )
        };
    }


    /* ============================================================
       PUBLIC API
       ============================================================ */

    SOCIAL.currentUser =
        currentUser;

    SOCIAL.getFeature =
        getFeature;

    SOCIAL.target =
        target;

    SOCIAL.like =
        like;

    SOCIAL.unlike =
        unlike;

    SOCIAL.dislike =
        dislike;

    SOCIAL.undislike =
        undislike;

    SOCIAL.save =
        save;

    SOCIAL.unsave =
        unsave;

    SOCIAL.isSaved =
        isSaved;

    SOCIAL.addComment =
        addComment;

    SOCIAL.comments =
        comments;

    SOCIAL.deleteComment =
        deleteComment;

    SOCIAL.report =
        report;

    SOCIAL.recordView =
        recordView;

    SOCIAL.getViewStats =
        getViewStats;

    SOCIAL.countryReach =
        countryReach;

    SOCIAL.countryReachDisplay =
        countryReachDisplay;

    SOCIAL.stats =
        stats;

    SOCIAL.fullSummary =
        fullSummary;

    SOCIAL.notify =
        notify;

    SOCIAL.notifications =
        userNotifications;

    SOCIAL.unreadNotificationCount =
        unreadNotificationCount;

    SOCIAL.readNotification =
        readNotification;

    SOCIAL.deleteNotification =
        deleteNotification;

    SOCIAL.getStatus =
        getStatus;

    SOCIAL.setStatus =
        setStatus;

    SOCIAL.markSold =
        markSold;

    SOCIAL.markFilled =
        markFilled;

    SOCIAL.markBooked =
        markBooked;

    SOCIAL.markRented =
        markRented;

    SOCIAL.markClosed =
        markClosed;

    SOCIAL.reopenListing =
        reopenListing;

    SOCIAL.canMessage =
        canMessage;

    SOCIAL.sendMessage =
        sendMessage;

    SOCIAL.conversation =
        conversation;

    SOCIAL.publicMessage =
        publicMessage;

    SOCIAL.featureOpen =
        featureOpen;

    SOCIAL.bindFeatureLinks =
        bindFeatureLinks;

    SOCIAL.bindViewTracking =
        bindViewTracking;

    SOCIAL.setOwnership =
        setOwnership;

    SOCIAL.getOwnership =
        getOwnership;

    SOCIAL.isOwner =
        isOwner;

    SOCIAL.authorizeOwnerAction =
        authorizeOwnerAction;

    SOCIAL.setBackend =
        setBackend;

    SOCIAL.getBackend =
        getBackend;

    SOCIAL.sync =
        sync;


    /* ============================================================
       GLOBAL ALIAS
       ============================================================ */

    window.ALON_SOCIAL_ENGINE =
        SOCIAL;


    /* ============================================================
       READY EVENT
       ============================================================ */

    function initialize() {

        try {

            bindFeatureLinks(
                document
            );

        } catch (error) {

            /*
             * Social errors must never stop
             * the main website.
             */
        }


        try {

            bindViewTracking(
                document
            );

        } catch (error) {}


        try {

            window.dispatchEvent(
                new CustomEvent(
                    "alon:social:ready",
                    {
                        detail: {

                            version:
                                SOCIAL.version,

                            engine:
                                SOCIAL.engine,

                            features:
                                Object.keys(
                                    FEATURE_META
                                )
                        }
                    }
                )
            );

        } catch (error) {}
    }


    /* ============================================================
       DYNAMIC CONTENT SUPPORT
       ------------------------------------------------------------
       Existing Marketplace / Jobs / Discovery pages create
       content dynamically. A lightweight observer allows the
       central engine to recognize newly inserted data-feature
       and data-social-target elements without replacing the
       existing page code.
       ============================================================ */

    function observeDynamicContent() {

        if (
            !window.MutationObserver
        ) {
            return;
        }


        var observer =
            new MutationObserver(
                function (mutations) {

                    var shouldBind =
                        false;


                    for (
                        var i = 0;
                        i < mutations.length;
                        i++
                    ) {

                        if (
                            mutations[i]
                                .addedNodes
                                .length
                        ) {

                            shouldBind =
                                true;

                            break;
                        }
                    }


                    if (!shouldBind) {
                        return;
                    }


                    try {

                        bindFeatureLinks(
                            document
                        );

                    } catch (error) {}


                    try {

                        bindViewTracking(
                            document
                        );

                    } catch (error) {}

                }
            );


        try {

            observer.observe(
                document.documentElement,
                {
                    childList: true,
                    subtree: true
                }
            );

        } catch (error) {}
    }


    /* ============================================================
       INITIALIZATION
       ============================================================ */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                initialize();

                observeDynamicContent();

            },
            {
                once: true
            }
        );

    } else {

        initialize();

        observeDynamicContent();
    }


})(window, document);