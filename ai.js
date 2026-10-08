/*
 * ALON HISTORYVERSE 24
 * AI + HELP + AD DISPLAY ENGINE
 * File: /ai.js
 *
 * Owner: Baba Thecno Guru
 *
 * PURPOSE
 * ------------------------------------------------------------
 * 1. Central public AI/help controller.
 * 2. Voice/microphone hooks.
 * 3. Text-help hooks.
 * 4. Language-system hooks.
 * 5. Menu.js integration.
 * 6. Future verification/reporting hooks.
 * 7. Central rotating advertisement display box.
 * 8. Future paid/top-up advertising hooks.
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This file does NOT replace Security/Admin systems.
 * This file does NOT create a general user-to-user messaging system.
 * This file does NOT claim to be a human or conscious system.
 * This is the public ALON HISTORYVERSE 24 software assistant layer.
 */

(function () {
    "use strict";

    /* =========================================================
       ALON AI NAMESPACE
       ========================================================= */

    var ALON_AI = {

        version: "1.0.0",

        initialized: false,

        elements: {
            aiBox: null,
            aiInput: null,
            aiSend: null,
            aiVoice: null,
            aiClose: null,
            aiStatus: null,

            adBox: null,
            adTitle: null,
            adText: null,
            adAction: null,
            adBadge: null
        },

        state: {
            aiOpen: false,
            listening: false,
            adIndex: 0,
            adTimer: null,
            adInterval: null,
            lastAdId: null
        },

        /* =====================================================
           START
           ===================================================== */

        init: function () {

            if (this.initialized) {
                return;
            }

            this.cacheElements();
            this.createAIInterface();
            this.createAdDisplayBox();

            this.bindAIEvents();
            this.bindMenuEvents();
            this.bindKeyboardEvents();

            this.startAdvertisementRotation();

            this.initialized = true;

            this.dispatch("alon:ai-ready", {
                version: this.version
            });

            this.setStatus("ALON HISTORYVERSE 24");

        },

        /* =====================================================
           DOM CACHE
           ===================================================== */

        cacheElements: function () {

            this.elements.aiBox =
                document.getElementById("alonAIBox");

            this.elements.aiInput =
                document.getElementById("alonAIInput");

            this.elements.aiSend =
                document.getElementById("alonAISend");

            this.elements.aiVoice =
                document.getElementById("alonAIVoice");

            this.elements.aiClose =
                document.getElementById("alonAIClose");

            this.elements.aiStatus =
                document.getElementById("alonAIStatus");

            this.elements.adBox =
                document.getElementById("alonAdBox");

            this.elements.adTitle =
                document.getElementById("alonAdTitle");

            this.elements.adText =
                document.getElementById("alonAdText");

            this.elements.adAction =
                document.getElementById("alonAdAction");

            this.elements.adBadge =
                document.getElementById("alonAdBadge");
        },

        /* =====================================================
           AI INTERFACE
           ===================================================== */

        createAIInterface: function () {

            var existingInterface =
                document.getElementById("alonAIInterface");

            /*
             * If the interface already exists in the page,
             * cache all of its internal controls instead of
             * returning with empty AI element references.
             */

            if (existingInterface) {

                this.elements.aiBox =
                    document.getElementById("alonAIBox");

                this.elements.aiInput =
                    document.getElementById("alonAIInput");

                this.elements.aiSend =
                    document.getElementById("alonAISend");

                this.elements.aiVoice =
                    document.getElementById("alonAIVoice");

                this.elements.aiClose =
                    document.getElementById("alonAIClose");

                this.elements.aiStatus =
                    document.getElementById("alonAIStatus");

                return;
            }

            var wrapper = document.createElement("section");

            wrapper.id = "alonAIInterface";

            wrapper.setAttribute("aria-label", "ALON HISTORYVERSE 24 AI Assistant");

            wrapper.innerHTML =
                '<div id="alonAIBox" hidden>' +

                    '<div class="alon-ai-header">' +
                        '<strong>ALON AI</strong>' +
                        '<button type="button" id="alonAIClose" aria-label="Close AI">×</button>' +
                    '</div>' +

                    '<div id="alonAIStatus" class="alon-ai-status">' +
                        'ALON HISTORYVERSE 24' +
                    '</div>' +

                    '<div id="alonAIResponse" class="alon-ai-response">' +
                        'How can I help you?' +
                    '</div>' +

                    '<div class="alon-ai-controls">' +

                        '<input ' +
                            'type="text" ' +
                            'id="alonAIInput" ' +
                            'placeholder="Ask ALON..." ' +
                            'autocomplete="off" ' +
                        '/>' +

                        '<button type="button" id="alonAISend">' +
                            'Send' +
                        '</button>' +

                        '<button type="button" id="alonAIVoice" aria-label="Use microphone">' +
                            '🎤' +
                        '</button>' +

                    '</div>' +

                '</div>';

            document.body.appendChild(wrapper);

            this.elements.aiBox =
                document.getElementById("alonAIBox");

            this.elements.aiInput =
                document.getElementById("alonAIInput");

            this.elements.aiSend =
                document.getElementById("alonAISend");

            this.elements.aiVoice =
                document.getElementById("alonAIVoice");

            this.elements.aiClose =
                document.getElementById("alonAIClose");

            this.elements.aiStatus =
                document.getElementById("alonAIStatus");
        },

        /* =====================================================
           AD DISPLAY BOX
           ===================================================== */

        createAdDisplayBox: function () {

            if (document.getElementById("alonAdDisplay")) {
                this.elements.adBox =
                    document.getElementById("alonAdBox");

                this.elements.adTitle =
                    document.getElementById("alonAdTitle");

                this.elements.adText =
                    document.getElementById("alonAdText");

                this.elements.adAction =
                    document.getElementById("alonAdAction");

                this.elements.adBadge =
                    document.getElementById("alonAdBadge");

                return;
            }

            var adWrapper = document.createElement("aside");

            adWrapper.id = "alonAdDisplay";

            adWrapper.setAttribute(
                "aria-label",
                "ALON HISTORYVERSE 24 advertisements"
            );

            adWrapper.innerHTML =

                '<div id="alonAdBox" class="alon-ad-box">' +

                    '<div class="alon-ad-top">' +

                        '<span id="alonAdBadge" class="alon-ad-badge">' +
                            'ALON' +
                        '</span>' +

                        '<span class="alon-ad-label">' +
                            'ADVERTISEMENT' +
                        '</span>' +

                    '</div>' +

                    '<div class="alon-ad-content">' +

                        '<h3 id="alonAdTitle">' +
                            'ALON HISTORYVERSE 24' +
                        '</h3>' +

                        '<p id="alonAdText">' +
                            'Explore history, knowledge and the world.' +
                        '</p>' +

                        '<button ' +
                            'type="button" ' +
                            'id="alonAdAction" ' +
                            'class="alon-ad-action">' +
                            'Explore' +
                        '</button>' +

                    '</div>' +

                '</div>';

            document.body.appendChild(adWrapper);

            this.elements.adBox =
                document.getElementById("alonAdBox");

            this.elements.adTitle =
                document.getElementById("alonAdTitle");

            this.elements.adText =
                document.getElementById("alonAdText");

            this.elements.adAction =
                document.getElementById("alonAdAction");

            this.elements.adBadge =
                document.getElementById("alonAdBadge");
        },

        /* =====================================================
           CENTRAL AD DATABASE
           ===================================================== */

        getAdvertisements: function () {

            return [

                {
                    id: "history",
                    badge: "HISTORY",
                    title: "Explore History",
                    text: "Discover civilizations, historical events and knowledge from around the world.",
                    action: "Explore History",
                    url: "./civilizations.html"
                },

                {
                    id: "countries",
                    badge: "WORLD",
                    title: "Explore Countries",
                    text: "Learn about countries, people, cultures and places across the world.",
                    action: "Explore Countries",
                    url: "./countries.html"
                },

                {
                    id: "heritage",
                    badge: "HERITAGE",
                    title: "Discover Heritage",
                    text: "Explore cultural heritage, monuments, traditions and important places.",
                    action: "Explore Heritage",
                    url: "./heritage.html"
                },

                {
                    id: "articles",
                    badge: "ARTICLES",
                    title: "Read Articles",
                    text: "Explore knowledge and informative articles inside ALON HISTORYVERSE 24.",
                    action: "Read Articles",
                    url: "./articles.html"
                },

                {
                    id: "library",
                    badge: "LIBRARY",
                    title: "Open the Library",
                    text: "Explore books, knowledge resources and educational material.",
                    action: "Open Library",
                    url: "./library.html"
                },

                {
                    id: "global-business",
                    badge: "BUSINESS",
                    title: "Global Business",
                    text: "Discover business opportunities and listings across the world.",
                    action: "Open Business",
                    url: "./marketplace.html"
                },

                {
                    id: "local-business",
                    badge: "LOCAL",
                    title: "Local Business",
                    text: "Discover local businesses and services through ALON HISTORYVERSE 24.",
                    action: "Explore Local",
                    url: "./regular-marketplace.html#rmDiscoveryHub"
                },

                {
                    id: "jobs",
                    badge: "JOBS",
                    title: "Find Jobs",
                    text: "Explore local and international job opportunities.",
                    action: "Open Jobs",
                    url: "./jobs.html"
                },

                {
                    id: "marketplace",
                    badge: "MARKETPLACE",
                    title: "Global Marketplace",
                    text: "Explore products and marketplace opportunities.",
                    action: "Open Marketplace",
                    url: "./marketplace.html"
                },

                {
                    id: "regular-marketplace",
                    badge: "MARKETPLACE",
                    title: "Regular Marketplace",
                    text: "Explore vehicles and other marketplace listings.",
                    action: "Open Marketplace",
                    url: "./regular-marketplace.html"
                },

                {
                    id: "discovery",
                    badge: "DISCOVERY",
                    title: "Marketplace Discovery",
                    text: "Discover additional categories and listings through the discovery hub.",
                    action: "Discover",
                    url: "./regular-marketplace.html#rmDiscoveryHub"
                },

                {
                    id: "luxury",
                    badge: "LUXURY",
                    title: "Luxury Lifestyle",
                    text: "Explore luxury lifestyle categories and premium listings.",
                    action: "Open Luxury",
                    url: "./luxury-lifestyle.html"
                },

                {
                    id: "gallery",
                    badge: "GALLERY",
                    title: "Explore Gallery",
                    text: "Explore visual content and discover more through ALON HISTORYVERSE 24.",
                    action: "Open Gallery",
                    url: "./gallery.html"
                },

                {
                    id: "contribute",
                    badge: "CONTRIBUTE",
                    title: "Contribute Knowledge",
                    text: "Help improve the platform by contributing useful knowledge and information.",
                    action: "Contribute",
                    url: "./contribute.html"
                },

                {
                    id: "discover",
                    badge: "DISCOVER",
                    title: "Discover ALON HISTORYVERSE 24",
                    text: "Explore the wider world of history, knowledge, culture and discovery.",
                    action: "Discover",
                    url: "./discover.html"
                }

            ];
        },

        /* =====================================================
           SHOW ONE AD
           ===================================================== */

        showAdvertisement: function () {

            var ads = this.getAdvertisements();

            if (!ads || !ads.length) {
                return;
            }

            var ad = ads[this.state.adIndex];

            if (!ad) {
                this.state.adIndex = 0;
                ad = ads[0];
            }

            this.state.lastAdId = ad.id;

            if (this.elements.adBadge) {
                this.elements.adBadge.textContent =
                    ad.badge || "ALON";
            }

            if (this.elements.adTitle) {
                this.elements.adTitle.textContent =
                    ad.title || "";
            }

            if (this.elements.adText) {
                this.elements.adText.textContent =
                    ad.text || "";
            }

            if (this.elements.adAction) {

                this.elements.adAction.textContent =
                    ad.action || "Open";

                this.elements.adAction.onclick = function () {

                    if (!ad.url) {
                        return;
                    }

                    window.location.href = ad.url;
                };
            }

            this.dispatch("alon:ad-displayed", {
                id: ad.id,
                title: ad.title
            });

            this.state.adIndex++;

            if (this.state.adIndex >= ads.length) {
                this.state.adIndex = 0;
            }
        },

        /* =====================================================
           AD ROTATION
           ===================================================== */

        startAdvertisementRotation: function () {

            this.stopAdvertisementRotation();

            this.showAdvertisement();

            this.scheduleNextAdvertisement();
        },

        scheduleNextAdvertisement: function () {

            var self = this;

            /*
             * Random interval:
             * 10, 11 or 12 seconds.
             */

            var seconds =
                10 + Math.floor(Math.random() * 3);

            this.state.adTimer =
                window.setTimeout(function () {

                    self.showAdvertisement();

                    self.scheduleNextAdvertisement();

                }, seconds * 1000);
        },

        stopAdvertisementRotation: function () {

            if (this.state.adTimer) {

                window.clearTimeout(
                    this.state.adTimer
                );

                this.state.adTimer = null;
            }

            if (this.state.adInterval) {

                window.clearInterval(
                    this.state.adInterval
                );

                this.state.adInterval = null;
            }
        },

        /* =====================================================
           FUTURE TOP-UP / PAID AD HOOK
           ===================================================== */

        addAdvertisement: function (advertisement) {

            /*
             * Future use:
             * Paid/top-up ads can be inserted here.
             *
             * Nothing is charged or connected right now.
             */

            if (!advertisement) {
                return false;
            }

            this.dispatch("alon:ad-add-request", {
                advertisement: advertisement
            });

            return true;
        },

        /* =====================================================
           AI EVENTS
           ===================================================== */

        bindAIEvents: function () {

            var self = this;

            if (this.elements.aiSend) {

                this.elements.aiSend.addEventListener(
                    "click",
                    function () {
                        self.processInput();
                    }
                );
            }

            if (this.elements.aiInput) {

                this.elements.aiInput.addEventListener(
                    "keydown",
                    function (event) {

                        if (event.key === "Enter") {

                            event.preventDefault();

                            self.processInput();
                        }
                    }
                );
            }

            if (this.elements.aiClose) {

                this.elements.aiClose.addEventListener(
                    "click",
                    function () {
                        self.closeAI();
                    }
                );
            }

            if (this.elements.aiVoice) {

                this.elements.aiVoice.addEventListener(
                    "click",
                    function () {
                        self.startVoiceInput();
                    }
                );
            }
        },

        /* =====================================================
           MENU.JS CONNECTION
           ===================================================== */

        bindMenuEvents: function () {

            var self = this;

            document.addEventListener(
                "alon:ai-open-menu",
                function () {
                    self.openAI();
                }
            );

            document.addEventListener(
                "alon:ai-close-menu",
                function () {
                    self.closeAI();
                }
            );

            document.addEventListener(
                "alon:open-language",
                function () {

                    self.dispatch(
                        "alon:ai-language-request",
                        {}
                    );
                }
            );

            document.addEventListener(
                "alon:feature-open",
                function (event) {

                    self.handleFeature(
                        event.detail || {}
                    );
                }
            );
        },

        /* =====================================================
           AI OPEN / CLOSE
           ===================================================== */

        openAI: function () {

            /*
             * Safe recovery:
             * If AI interface elements were not cached during
             * initial loading, create/cache them now instead
             * of silently failing.
             */

            if (!this.elements.aiBox) {

                this.createAIInterface();

            }

            if (!this.elements.aiBox) {
                return;
            }

            this.elements.aiBox.hidden = false;

            this.state.aiOpen = true;

            if (this.elements.aiInput) {
                this.elements.aiInput.focus();
            }

            this.dispatch("alon:ai-opened", {});
        },

        closeAI: function () {

            if (!this.elements.aiBox) {
                return;
            }

            this.elements.aiBox.hidden = true;

            this.state.aiOpen = false;

            this.dispatch("alon:ai-closed", {});
        },

        /* =====================================================
           INPUT PROCESSING
           ===================================================== */

        processInput: function () {

            if (!this.elements.aiInput) {
                return;
            }

            var input =
                this.elements.aiInput.value.trim();

            if (!input) {
                return;
            }

            this.elements.aiInput.value = "";

            this.answer(input);
        },

        /* =====================================================
           BASIC AI ROUTER
           ===================================================== */

        answer: function (input) {

            var text = String(input || "").toLowerCase();

            var response =
                "I can help you explore ALON HISTORYVERSE 24.";

            if (
                text.indexOf("history") !== -1 ||
                text.indexOf("इतिहास") !== -1
            ) {

                response =
                    "You can explore history and civilizations from the History section.";

            } else if (
                text.indexOf("country") !== -1 ||
                text.indexOf("countries") !== -1 ||
                text.indexOf("देश") !== -1
            ) {

                response =
                    "You can explore countries, cultures and world information from the Countries section.";

            } else if (
                text.indexOf("job") !== -1 ||
                text.indexOf("jobs") !== -1 ||
                text.indexOf("नौकरी") !== -1
            ) {

                response =
                    "Open Jobs to explore local and international opportunities.";

            } else if (
                text.indexOf("business") !== -1 ||
                text.indexOf("व्यवसाय") !== -1
            ) {

                response =
                    "ALON HISTORYVERSE 24 provides business discovery and marketplace features.";

            } else if (
                text.indexOf("marketplace") !== -1 ||
                text.indexOf("बाजार") !== -1
            ) {

                response =
                    "You can explore Global Marketplace, Regular Marketplace and Marketplace Discovery.";

            } else if (
                text.indexOf("help") !== -1 ||
                text.indexOf("मदद") !== -1 ||
                text.indexOf("सहायता") !== -1
            ) {

                response =
                    "Tell me what you want to do and I will guide you through the available ALON HISTORYVERSE 24 features.";
            }

            this.showAIResponse(response);

            this.dispatch("alon:ai-question", {
                question: input,
                response: response
            });
        },

        /* =====================================================
           AI RESPONSE
           ===================================================== */

        showAIResponse: function (text) {

            var responseBox =
                document.getElementById("alonAIResponse");

            if (!responseBox) {
                return;
            }

            responseBox.textContent = text;
        },

        /* =====================================================
           VOICE INPUT
           ===================================================== */

        startVoiceInput: function () {

            var self = this;

            var SpeechRecognition =
                window.SpeechRecognition ||
                window.webkitSpeechRecognition;

            if (!SpeechRecognition) {

                this.showAIResponse(
                    "Voice input is not available in this browser. You can type your question instead."
                );

                return;
            }

            if (this.state.listening) {
                return;
            }

            var recognition =
                new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.lang =
                document.documentElement.lang ||
                "en-IN";

            this.state.listening = true;

            this.showAIResponse(
                "Listening..."
            );

            recognition.onresult =
                function (event) {

                    var transcript =
                        event.results[0][0].transcript;

                    self.state.listening = false;

                    if (self.elements.aiInput) {
                        self.elements.aiInput.value =
                            transcript;
                    }

                    self.answer(transcript);
                };

            recognition.onerror =
                function () {

                    self.state.listening = false;

                    self.showAIResponse(
                        "Voice input could not be completed. Please try again or type your question."
                    );
                };

            recognition.onend =
                function () {

                    self.state.listening = false;
                };

            recognition.start();
        },

        /* =====================================================
           FEATURE HANDLER
           ===================================================== */

        handleFeature: function (detail) {

            if (!detail) {
                return;
            }

            this.dispatch("alon:ai-feature-seen", {
                feature: detail
            });
        },

        /* =====================================================
           KEYBOARD
           ===================================================== */

        bindKeyboardEvents: function () {

            var self = this;

            document.addEventListener(
                "keydown",
                function (event) {

                    if (event.key === "Escape") {

                        if (self.state.aiOpen) {
                            self.closeAI();
                        }
                    }

                }
            );
        },

        /* =====================================================
           STATUS
           ===================================================== */

        setStatus: function (text) {

            if (this.elements.aiStatus) {
                this.elements.aiStatus.textContent =
                    text || "ALON HISTORYVERSE 24";
            }
        },

        /* =====================================================
           CUSTOM EVENT DISPATCHER
           ===================================================== */

        dispatch: function (name, detail) {

            try {

                document.dispatchEvent(
                    new CustomEvent(
                        name,
                        {
                            detail: detail || {}
                        }
                    )
                );

            } catch (error) {

                /*
                 * Older-browser protection.
                 */

                var event =
                    document.createEvent("CustomEvent");

                event.initCustomEvent(
                    name,
                    false,
                    false,
                    detail || {}
                );

                document.dispatchEvent(event);
            }
        },

        /* =====================================================
           PUBLIC API
           ===================================================== */

        getStatus: function () {

            return {
                version: this.version,
                initialized: this.initialized,
                aiOpen: this.state.aiOpen,
                listening: this.state.listening,
                currentAd: this.state.lastAdId
            };
        }
    };

    /* =========================================================
       PUBLIC GLOBAL
       ========================================================= */

    window.ALON_AI = ALON_AI;

    /* =========================================================
       PAGE VISIBILITY
       ========================================================= */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (!window.ALON_AI) {
                return;
            }

            if (document.hidden) {

                window.ALON_AI.stopAdvertisementRotation();

            } else if (window.ALON_AI.initialized) {

                window.ALON_AI.startAdvertisementRotation();
            }
        }
    );

    /* =========================================================
       INITIALIZE
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            function () {
                ALON_AI.init();
            },
            {
                once: true
            }
        );

    } else {

        ALON_AI.init();
    }

})();