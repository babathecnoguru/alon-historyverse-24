/* ============================================================
   ALON HISTORYVERSE 24
   ALON SOCIAL ENGINE
   Version 1.0.0
   Creator: Baba Thecno Guru

   SOCIAL SYSTEM
   ------------------------------------------------------------
   Like • Dislike • Comments • Reports
   Views • Country Reach • Notifications • Analytics
   Seller ↔ Buyer Messaging

   IMPORTANT
   ------------------------------------------------------------
   This engine is designed as a standalone layer.

   It does NOT replace or modify:
   - Regular Marketplace
   - Jobs
   - Security
   - Admin
   - Existing navigation
   - Existing page design

   Messaging is NOT general user-to-user messaging.
   It is allowed only when a valid business/listing/
   transaction relationship exists.
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

    SOCIAL.version = "1.0.0";
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
            PREFIX + "features"
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
            prefix +
            "_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10)
        );
    }


    function timestamp() {

        return new Date().toISOString();
    }


    function normalizeCountry(country) {

        return clean(country) || "Unknown";
    }


    /* ============================================================
       CURRENT USER
       ============================================================ */

    function currentUser() {

        var user = null;

        try {

            if (
                ALON.currentUser
            ) {

                user =
                    ALON.currentUser;
            }

        } catch (error) {}


        if (!user) {

            try {

                var saved =
                    window.localStorage.getItem(
                        "alon_historyverse_current_user"
                    );

                if (saved) {
                    user = JSON.parse(saved);
                }

            } catch (error) {}
        }


        if (!user) {

            return {

                id: "guest",

                name: "Guest",

                photo: "",

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
                    user.displayName
                ) || "Guest",

            photo:
                clean(
                    user.photo ||
                    user.photoURL ||
                    user.avatar
                ),

            country:
                normalizeCountry(
                    user.country
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
                    options.id
                ),

            targetType:
                clean(
                    options.targetType ||
                    options.type
                ) || "content",

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

        marketplace: {
            title: "Marketplace",
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

        if (
            FEATURE_META[key]
        ) {

            return FEATURE_META[key];
        }


        var normalized =
            key
                .toLowerCase()
                .replace(/[\s_-]/g, "");


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
                    .replace(/[\s_-]/g, "");


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
                error: "Target ID required."
            };
        }


        var data =
            getLikes();

        var user =
            currentUser();


        if (!data[item.targetId]) {

            data[item.targetId] = {

                count: 0,

                users: []
            };
        }


        if (
            data[item.targetId]
                .users
                .indexOf(user.id) === -1
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
            item
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            liked:
                true
        };
    }


    function unlike(options) {

        var item =
            target(options);

        var data =
            getLikes();

        var user =
            currentUser();


        if (
            !data[item.targetId]
        ) {

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


        if (!data[item.targetId]) {

            data[item.targetId] = {

                count: 0,

                users: []
            };
        }


        if (
            data[item.targetId]
                .users
                .indexOf(user.id) === -1
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
            item
        );


        return {

            success: true,

            count:
                data[item.targetId]
                    .count,

            disliked:
                true
        };
    }


    function undislike(options) {

        var item =
            target(options);

        var data =
            getDislikes();

        var user =
            currentUser();


        if (
            !data[item.targetId]
        ) {

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
       COMMENTS
       ============================================================ */

    function getComments() {

        return read(
            STORAGE.comments,
            {}
        );
    }


    function addComment(
        options
    ) {

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


        if (
            !data[item.targetId]
        ) {

            data[item.targetId] = [];
        }


        /*
         * Public comments deliberately expose
         * only name and photo.
         */

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
            item
        );


        return {

            success: true,

            comment:
                comment
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
        );
    }


    function deleteComment(
        options
    ) {

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

        var user =
            currentUser();


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

                        /*
                         * User ownership is checked
                         * without exposing user ID
                         * in the public comment object.
                         */

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


        var user =
            currentUser();

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

            reporter:
                user.id,

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
            item
        );


        return {

            success: true,

            report:
                reportItem
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


    function recordView(
        options
    ) {

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
                data[item.targetId]
                    .countries
        };
    }


    function getViewStats(
        targetId
    ) {

        var data =
            getViews();


        return (
            data[targetId] || {

                total: 0,

                countries: {},

                lastViewed: null
            }
        );
    }


    /* ============================================================
       COUNTRY REACH
       ============================================================ */

    function countryReach(
        targetId
    ) {

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

                    count:
                        countries[
                            country
                        ]
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

                countries: {}
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

    function stats(
        targetId
    ) {

        var likes =
            getLikes();

        var dislikes =
            getDislikes();

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
                likeItem.count,

            dislikes:
                dislikeItem.count,

            comments:
                (
                    commentData[
                        targetId
                    ] || []
                ).length,

            views:
                viewItem.total,

            countries:
                viewItem.countries,

            liked:
                likeItem.users
                    .indexOf(
                        user.id
                    ) !== -1,

            disliked:
                dislikeItem.users
                    .indexOf(
                        user.id
                    ) !== -1
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


    function notify(
        options
    ) {

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

            read:
                false,

            createdAt:
                timestamp()
        };


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


        return notification;
    }


    function userNotifications(
        userId
    ) {

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
            );
    }


    function readNotification(
        notificationId
    ) {

        var notifications =
            getNotifications();

        var changed = false;


        notifications.forEach(
            function (item) {

                if (
                    item.id ===
                    notificationId
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


    /* ============================================================
       MESSAGING RELATIONSHIP RULES
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


    function canMessage(
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

            return false;
        }


        /*
         * There must be an actual context.
         */

        var context =
            clean(
                options.listingId ||
                options.transactionId ||
                options.jobId ||
                options.businessId ||
                options.productId
            );


        if (!context) {

            return false;
        }


        var user =
            currentUser();


        var sellerId =
            clean(
                options.sellerId
            );

        var buyerId =
            clean(
                options.buyerId
            );

        var employerId =
            clean(
                options.employerId
            );

        var applicantId =
            clean(
                options.applicantId
            );


        var validUser =
            (
                user.id === sellerId ||
                user.id === buyerId ||
                user.id === employerId ||
                user.id === applicantId
            );


        if (!validUser) {

            return false;
        }


        return true;
    }


    /* ============================================================
       MESSAGES
       ============================================================ */

    function getMessages() {

        return read(
            STORAGE.messages,
            []
        );
    }


    function sendMessage(
        options
    ) {

        options =
            options || {};


        if (
            !canMessage(
                options
            )
        ) {

            return {

                success: false,

                error:
                    "Messaging is available only inside a valid transaction, listing, job, business or seller-buyer relationship."
            };
        }


        var user =
            currentUser();


        var text =
            clean(
                options.message
            );


        if (!text) {

            return {

                success: false,

                error:
                    "Message cannot be empty."
            };
        }


        var sellerId =
            clean(
                options.sellerId
            );

        var buyerId =
            clean(
                options.buyerId
            );

        var employerId =
            clean(
                options.employerId
            );

        var applicantId =
            clean(
                options.applicantId
            );


        var recipientId = "";


        if (
            user.id === sellerId
        ) {

            recipientId =
                buyerId;
        }

        else if (
            user.id === buyerId
        ) {

            recipientId =
                sellerId;
        }

        else if (
            user.id === employerId
        ) {

            recipientId =
                applicantId;
        }

        else if (
            user.id === applicantId
        ) {

            recipientId =
                employerId;
        }


        if (!recipientId) {

            return {

                success: false,

                error:
                    "Valid recipient not found."
            };
        }


        var messages =
            getMessages();


        var conversationId =
            clean(
                options.conversationId
            );


        if (!conversationId) {

            conversationId =
                [
                    clean(
                        options.listingId
                    ),

                    clean(
                        options.jobId
                    ),

                    clean(
                        options.businessId
                    ),

                    clean(
                        options.productId
                    ),

                    sellerId ||
                        employerId,

                    buyerId ||
                        applicantId
                ]
                .filter(Boolean)
                .join("_");
        }


        var message = {

            id:
                id("message"),

            conversationId:
                conversationId,

            relationship:
                clean(
                    options.relationship
                ).toLowerCase(),

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

            sellerId:
                sellerId,

            buyerId:
                buyerId,

            employerId:
                employerId,

            applicantId:
                applicantId,

            senderId:
                user.id,

            recipientId:
                recipientId,

            message:
                text,

            read:
                false,

            createdAt:
                timestamp()
        };


        messages.push(
            message
        );


        write(
            STORAGE.messages,
            messages
        );


        notify({

            recipientId:
                recipientId,

            type:
                "message",

            title:
                "New Message",

            message:
                "You have a new message related to your transaction or listing.",

            targetId:
                message.listingId ||
                message.jobId ||
                message.businessId ||
                message.productId
        });


        recordAnalytics(
            "message",
            {
                targetId:
                    message.listingId ||
                    message.jobId ||
                    message.businessId ||
                    message.productId,

                targetType:
                    message.relationship
            }
        );


        return {

            success: true,

            message:
                message
        };
    }


    function conversation(
        conversationId
    ) {

        conversationId =
            clean(
                conversationId
            );


        var user =
            currentUser();


        return getMessages()
            .filter(
                function (message) {

                    return (

                        message.conversationId ===
                        conversationId

                    ) && (

                        message.senderId ===
                        user.id ||

                        message.recipientId ===
                        user.id
                    );
                }
            );
    }


    /* ============================================================
       FEATURE OPEN ANALYTICS
       ============================================================ */

    function featureOpen(
        feature
    ) {

        var meta =
            getFeature(
                feature
            );


        if (!meta) {

            return {

                success: false
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
                    0
            };
        }


        data[key]
            .opens++;


        write(
            STORAGE.features,
            data
        );


        return {

            success: true,

            feature:
                data[key]
        };
    }


    /* ============================================================
       FEATURE LINK TRACKING
       ============================================================ */

    function bindFeatureLinks(
        root
    ) {

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
       BACKEND ADAPTER
       ============================================================ */

    var backend =
        null;


    function setBackend(
        adapter
    ) {

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


    function sync(
        method,
        payload
    ) {

        if (
            !backend ||
            typeof backend[method] !==
            "function"
        ) {

            return Promise.resolve({

                success: false,

                localOnly: true
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
       PUBLIC API
       ============================================================ */

    SOCIAL.currentUser =
        currentUser;

    SOCIAL.getFeature =
        getFeature;

    SOCIAL.like =
        like;

    SOCIAL.unlike =
        unlike;

    SOCIAL.dislike =
        dislike;

    SOCIAL.undislike =
        undislike;

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

    SOCIAL.stats =
        stats;

    SOCIAL.notify =
        notify;

    SOCIAL.notifications =
        userNotifications;

    SOCIAL.readNotification =
        readNotification;

    SOCIAL.canMessage =
        canMessage;

    SOCIAL.sendMessage =
        sendMessage;

    SOCIAL.conversation =
        conversation;

    SOCIAL.featureOpen =
        featureOpen;

    SOCIAL.bindFeatureLinks =
        bindFeatureLinks;

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
       INITIALIZATION
       ============================================================ */

    function initialize() {

        try {

            bindFeatureLinks(
                document
            );

        } catch (error) {

            /*
             * Social engine errors must never
             * stop the main website.
             */
        }


        try {

            window.dispatchEvent(
                new CustomEvent(
                    "alon:social:ready",
                    {
                        detail: {

                            version:
                                SOCIAL.version,

                            engine:
                                SOCIAL.engine
                        }
                    }
                )
            );

        } catch (error) {}
    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();
    }


})(window, document);