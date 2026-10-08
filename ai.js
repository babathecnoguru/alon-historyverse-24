/*
 * ALON HISTORYVERSE 24
 * AI + HELP + IMAGE + VIDEO + AD DISPLAY ENGINE
 * File: /ai.js
 *
 * Owner: Baba Thecno Guru
 *
 * PURPOSE
 * ------------------------------------------------------------
 * 1. Central public AI/help controller.
 * 2. Voice/microphone hooks.
 * 3. Text-help hooks.
 * 4. Spoken AI response hooks.
 * 5. AI Image Generator UI/controller.
 * 6. AI Video Generator UI/controller.
 * 7. Login-gate hooks for generation.
 * 8. Generation safety screening.
 * 9. Menu.js integration.
 * 10. Central rotating advertisement display box.
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This file does NOT replace Security/Admin systems.
 * This file does NOT create a general user-to-user messaging system.
 * This file does NOT claim to be a human or conscious system.
 * Actual image/video generation requires a secure backend/API.
 * API secrets must NEVER be placed in this public JavaScript file.
 */

(function () {
    "use strict";

    var ALON_AI = {

        version: "1.1.0",

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
            adBadge: null,

            imagePanel: null,
            imagePrompt: null,
            imageGenerate: null,
            imageClose: null,
            imageStatus: null,

            videoPanel: null,
            videoPrompt: null,
            videoGenerate: null,
            videoClose: null,
            videoStatus: null,

            loginPanel: null,
            loginClose: null,
            loginMessage: null
        },

        state: {
            aiOpen: false,
            listening: false,
            speaking: false,
            adIndex: 0,
            adTimer: null,
            adInterval: null,
            lastAdId: null,
            generatorOpen: null
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
            this.createGeneratorInterface();
            this.createAdDisplayBox();

            this.bindAIEvents();
            this.bindGeneratorEvents();
            this.bindGeneratorButtons();
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

            this.elements.imagePanel =
                document.getElementById("alonAIImagePanel");

            this.elements.imagePrompt =
                document.getElementById("alonAIImagePrompt");

            this.elements.imageGenerate =
                document.getElementById("alonAIImageGenerate");

            this.elements.imageClose =
                document.getElementById("alonAIImageClose");

            this.elements.imageStatus =
                document.getElementById("alonAIImageStatus");

            this.elements.videoPanel =
                document.getElementById("alonAIVideoPanel");

            this.elements.videoPrompt =
                document.getElementById("alonAIVideoPrompt");

            this.elements.videoGenerate =
                document.getElementById("alonAIVideoGenerate");

            this.elements.videoClose =
                document.getElementById("alonAIVideoClose");

            this.elements.videoStatus =
                document.getElementById("alonAIVideoStatus");

            this.elements.loginPanel =
                document.getElementById("alonAIGenerationLogin");

            this.elements.loginClose =
                document.getElementById("alonAILoginClose");

            this.elements.loginMessage =
                document.getElementById("alonAILoginMessage");
        },

        /* =====================================================
           AI INTERFACE
           ===================================================== */

        createAIInterface: function () {

            var existingInterface =
                document.getElementById("alonAIInterface");

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

            var wrapper =
                document.createElement("section");

            wrapper.id =
                "alonAIInterface";

            wrapper.setAttribute(
                "aria-label",
                "ALON HISTORYVERSE 24 AI Assistant"
            );

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

                        '<button type="button" id="alonAISpeak" aria-label="Read answer aloud">' +
                            '🔊' +
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
           GENERATOR INTERFACE
           ===================================================== */

        createGeneratorInterface: function () {

            var existingInterface =
                document.getElementById(
                    "alonAIGeneratorInterface"
                );

            if (existingInterface) {

                this.cacheElements();

                existingInterface.hidden = true;
                existingInterface.style.display = "none";

                return;
            }

            var wrapper =
                document.createElement("section");

            wrapper.id =
                "alonAIGeneratorInterface";

            wrapper.setAttribute(
                "aria-label",
                "ALON AI Image and Video Generator"
            );

            wrapper.hidden = true;
            wrapper.style.display = "none";

            wrapper.innerHTML =

                '<div id="alonAIImagePanel" hidden style="display:none;">' +

                    '<div class="alon-generator-header">' +
                        '<strong>🎨 AI Image Generator</strong>' +
                        '<button type="button" id="alonAIImageClose">×</button>' +
                    '</div>' +

                    '<p class="alon-generator-note">' +
                        'Describe the image you want to create.' +
                    '</p>' +

                    '<textarea ' +
                        'id="alonAIImagePrompt" ' +
                        'placeholder="Example: A golden ancient city at sunset..." ' +
                        'rows="4">' +
                    '</textarea>' +

                    '<button type="button" id="alonAIImageGenerate">' +
                        'Generate Image' +
                    '</button>' +

                    '<div id="alonAIImageStatus" class="alon-generator-status">' +
                        'Login is required for generation.' +
                    '</div>' +

                '</div>' +

                '<div id="alonAIVideoPanel" hidden style="display:none;">' +

                    '<div class="alon-generator-header">' +
                        '<strong>🎬 AI Video Generator</strong>' +
                        '<button type="button" id="alonAIVideoClose">×</button>' +
                    '</div>' +

                    '<p class="alon-generator-note">' +
                        'Describe the video you want to create.' +
                    '</p>' +

                    '<textarea ' +
                        'id="alonAIVideoPrompt" ' +
                        'placeholder="Example: A cinematic ancient city with people walking through a marketplace..." ' +
                        'rows="4">' +
                    '</textarea>' +

                    '<button type="button" id="alonAIVideoGenerate">' +
                        'Generate Video' +
                    '</button>' +

                    '<div id="alonAIVideoStatus" class="alon-generator-status">' +
                        'Login is required for generation.' +
                    '</div>' +

                '</div>' +

                '<div id="alonAIGenerationLogin" hidden style="display:none;">' +

                    '<div class="alon-generator-login-box">' +

                        '<button type="button" id="alonAILoginClose">' +
                            '×' +
                        '</button>' +

                        '<h3>Login Required</h3>' +

                        '<p id="alonAILoginMessage">' +
                            'Please log in to use AI Image and Video Generation.' +
                        '</p>' +

                        '<button type="button" id="alonAILoginButton">' +
                            'Login' +
                        '</button>' +

                    '</div>' +

                '</div>';

            document.body.appendChild(wrapper);

            this.cacheElements();
        },

        /* =====================================================
           GENERATOR MENU BUTTONS
           ===================================================== */

        bindGeneratorButtons: function () {

            var self = this;

            var imageButton =
                document.getElementById(
                    "aiImageGeneratorBtn"
                );

            var videoButton =
                document.getElementById(
                    "aiVideoGeneratorBtn"
                );

            /*
             * Direct handlers make the generator buttons
             * independent of other menu click handlers.
             */

            if (imageButton) {

                imageButton.onclick =
                    function (event) {

                        if (event) {
                            event.preventDefault();
                        }

                        self.openGenerator(
                            "image"
                        );

                        return false;
                    };
            }

            if (videoButton) {

                videoButton.onclick =
                    function (event) {

                        if (event) {
                            event.preventDefault();
                        }

                        self.openGenerator(
                            "video"
                        );

                        return false;
                    };
            }

            /*
             * Main-page generator buttons.
             */

            var imageButtons =
                document.querySelectorAll(
                    '[onclick*="openGenerator(\'image\')"]'
                );

            for (
                var i = 0;
                i < imageButtons.length;
                i++
            ) {

                if (
                    imageButtons[i] === imageButton
                ) {
                    continue;
                }

                imageButtons[i].onclick =
                    function (event) {

                        if (event) {
                            event.preventDefault();
                        }

                        self.openGenerator(
                            "image"
                        );

                        return false;
                    };
            }

            var videoButtons =
                document.querySelectorAll(
                    '[onclick*="openGenerator(\'video\')"]'
                );

            for (
                var j = 0;
                j < videoButtons.length;
                j++
            ) {

                if (
                    videoButtons[j] === videoButton
                ) {
                    continue;
                }

                videoButtons[j].onclick =
                    function (event) {

                        if (event) {
                            event.preventDefault();
                        }

                        self.openGenerator(
                            "video"
                        );

                        return false;
                    };
            }
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

            var adWrapper =
                document.createElement("aside");

            adWrapper.id =
                "alonAdDisplay";

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

                        '<button type="button" id="alonAdAction" class="alon-ad-action">' +
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

            var ads =
                this.getAdvertisements();

            if (!ads || !ads.length) {
                return;
            }

            var ad =
                ads[this.state.adIndex];

            if (!ad) {

                this.state.adIndex = 0;

                ad = ads[0];
            }

            this.state.lastAdId =
                ad.id;

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

                this.elements.adAction.onclick =
                    function () {

                        if (!ad.url) {
                            return;
                        }

                        window.location.href =
                            ad.url;
                    };
            }

            this.dispatch(
                "alon:ad-displayed",
                {
                    id: ad.id,
                    title: ad.title
                }
            );

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

            var seconds =
                10 + Math.floor(Math.random() * 3);

            this.state.adTimer =
                window.setTimeout(
                    function () {

                        self.showAdvertisement();

                        self.scheduleNextAdvertisement();

                    },
                    seconds * 1000
                );
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

            var speakButton =
                document.getElementById("alonAISpeak");

            if (speakButton) {

                speakButton.addEventListener(
                    "click",
                    function () {
                        self.speakCurrentResponse();
                    }
                );
            }
        },

        /* =====================================================
           GENERATOR EVENTS
           ===================================================== */

        bindGeneratorEvents: function () {

            var self = this;

            if (this.elements.imageGenerate) {

                this.elements.imageGenerate.addEventListener(
                    "click",
                    function () {
                        self.generateImage();
                    }
                );
            }

            if (this.elements.videoGenerate) {

                this.elements.videoGenerate.addEventListener(
                    "click",
                    function () {
                        self.generateVideo();
                    }
                );
            }

            if (this.elements.imageClose) {

                this.elements.imageClose.addEventListener(
                    "click",
                    function () {
                        self.closeGenerator("image");
                    }
                );
            }

            if (this.elements.videoClose) {

                this.elements.videoClose.addEventListener(
                    "click",
                    function () {
                        self.closeGenerator("video");
                    }
                );
            }

            if (this.elements.loginClose) {

                this.elements.loginClose.addEventListener(
                    "click",
                    function () {
                        self.closeLoginGate();
                    }
                );
            }

            var loginButton =
                document.getElementById("alonAILoginButton");

            if (loginButton) {

                loginButton.addEventListener(
                    "click",
                    function () {
                        self.requestLogin();
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

            document.addEventListener(
                "alon:ai-open-image-generator",
                function () {
                    self.openGenerator("image");
                }
            );

            document.addEventListener(
                "alon:ai-open-video-generator",
                function () {
                    self.openGenerator("video");
                }
            );
        },

        /* =====================================================
           AI OPEN / CLOSE
           ===================================================== */

        openAI: function () {

            if (!this.elements.aiBox) {
                this.createAIInterface();
            }

            if (!this.elements.aiBox) {
                return;
            }

            this.elements.aiBox.hidden =
                false;

            this.elements.aiBox.style.display =
                "block";

            this.state.aiOpen =
                true;

            if (this.elements.aiInput) {
                this.elements.aiInput.focus();
            }

            this.dispatch(
                "alon:ai-opened",
                {}
            );
        },

        closeAI: function () {

            if (!this.elements.aiBox) {
                return;
            }

            this.elements.aiBox.hidden =
                true;

            this.elements.aiBox.style.display =
                "none";

            this.state.aiOpen =
                false;

            this.stopSpeaking();

            this.dispatch(
                "alon:ai-closed",
                {}
            );
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

            this.elements.aiInput.value =
                "";

            this.answer(input);
        },

        /* =====================================================
           BASIC AI ROUTER
           ===================================================== */

        answer: function (input) {

            var text =
                String(input || "").toLowerCase();

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

            this.dispatch(
                "alon:ai-question",
                {
                    question: input,
                    response: response
                }
            );
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

            responseBox.textContent =
                text;
        },

        /* =====================================================
           SPEECH OUTPUT
           ===================================================== */

        speakCurrentResponse: function () {

            var responseBox =
                document.getElementById("alonAIResponse");

            if (!responseBox) {
                return;
            }

            var text =
                responseBox.textContent.trim();

            if (!text) {
                return;
            }

            this.speakText(text);
        },

        speakText: function (text) {

            if (
                !("speechSynthesis" in window)
            ) {

                this.showAIResponse(
                    "Voice output is not available in this browser."
                );

                return;
            }

            this.stopSpeaking();

            var self = this;

            var utterance =
                new SpeechSynthesisUtterance(text);

            var voices =
                window.speechSynthesis.getVoices();

            var femaleVoice =
                null;

            for (
                var i = 0;
                i < voices.length;
                i++
            ) {

                var name =
                    String(
                        voices[i].name || ""
                    ).toLowerCase();

                var lang =
                    String(
                        voices[i].lang || ""
                    ).toLowerCase();

                if (
                    name.indexOf("female") !== -1 ||
                    name.indexOf("zira") !== -1 ||
                    name.indexOf("samantha") !== -1 ||
                    name.indexOf("google uk english female") !== -1
                ) {

                    femaleVoice =
                        voices[i];

                    break;
                }

                if (
                    !femaleVoice &&
                    (
                        lang.indexOf("en-in") !== -1 ||
                        lang.indexOf("hi-in") !== -1
                    )
                ) {

                    femaleVoice =
                        voices[i];
                }
            }

            if (femaleVoice) {
                utterance.voice =
                    femaleVoice;
            }

            utterance.lang =
                document.documentElement.lang ||
                "en-IN";

            utterance.rate =
                1;

            utterance.pitch =
                1.05;

            utterance.onstart =
                function () {
                    self.state.speaking =
                        true;
                };

            utterance.onend =
                function () {
                    self.state.speaking =
                        false;
                };

            utterance.onerror =
                function () {
                    self.state.speaking =
                        false;
                };

            window.speechSynthesis.speak(
                utterance
            );
        },

        stopSpeaking: function () {

            if (
                "speechSynthesis" in window
            ) {

                window.speechSynthesis.cancel();

                this.state.speaking =
                    false;
            }
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

            recognition.continuous =
                false;

            recognition.interimResults =
                false;

            recognition.lang =
                document.documentElement.lang ||
                "en-IN";

            this.state.listening =
                true;

            this.showAIResponse(
                "Listening..."
            );

            recognition.onresult =
                function (event) {

                    var transcript =
                        event.results[0][0].transcript;

                    self.state.listening =
                        false;

                    if (self.elements.aiInput) {

                        self.elements.aiInput.value =
                            transcript;
                    }

                    self.answer(
                        transcript
                    );
                };

            recognition.onerror =
                function () {

                    self.state.listening =
                        false;

                    self.showAIResponse(
                        "Voice input could not be completed. Please try again or type your question."
                    );
                };

            recognition.onend =
                function () {

                    self.state.listening =
                        false;
                };

            recognition.start();
        },

        /* =====================================================
           GENERATION LOGIN CHECK
           ===================================================== */

        isGenerationLoggedIn: function () {

            if (
                window.ALON_AUTH &&
                typeof window.ALON_AUTH.isLoggedIn ===
                    "function"
            ) {

                try {

                    return !!window.ALON_AUTH.isLoggedIn();

                } catch (error) {

                    return false;
                }
            }

            return false;
        },

        requestLogin: function () {

            this.dispatch(
                "alon:ai-login-required",
                {
                    source: "ai-generator"
                }
            );

            if (
                window.ALON_AUTH &&
                typeof window.ALON_AUTH.openLogin ===
                    "function"
            ) {

                window.ALON_AUTH.openLogin();

                return;
            }

            window.location.href =
                "./login.html";
        },

        openLoginGate: function () {

            if (!this.elements.loginPanel) {

                this.createGeneratorInterface();

                this.cacheElements();
            }

            if (!this.elements.loginPanel) {
                return;
            }

            var generatorInterface =
                document.getElementById(
                    "alonAIGeneratorInterface"
                );

            if (generatorInterface) {

                generatorInterface.hidden =
                    false;

                generatorInterface.style.display =
                    "block";

                generatorInterface.style.visibility =
                    "visible";

                generatorInterface.style.opacity =
                    "1";
            }

            this.elements.loginPanel.hidden =
                false;

            this.elements.loginPanel.style.display =
                "block";

            this.elements.loginPanel.style.visibility =
                "visible";

            this.elements.loginPanel.style.opacity =
                "1";
        },

        closeLoginGate: function () {

            if (!this.elements.loginPanel) {
                return;
            }

            this.elements.loginPanel.hidden =
                true;

            this.elements.loginPanel.style.display =
                "none";

            this.elements.loginPanel.style.visibility =
                "hidden";

            this.elements.loginPanel.style.opacity =
                "0";
        },

        /* =====================================================
           GENERATOR OPEN / CLOSE
           ===================================================== */

        openGenerator: function (type) {

            if (
                type !== "image" &&
                type !== "video"
            ) {
                return;
            }

            /*
             * Make sure generator DOM exists even if this
             * function is called before normal initialization.
             */

            var generatorInterface =
                document.getElementById(
                    "alonAIGeneratorInterface"
                );

            if (!generatorInterface) {

                this.createGeneratorInterface();

                this.cacheElements();

                generatorInterface =
                    document.getElementById(
                        "alonAIGeneratorInterface"
                    );
            }

            if (!generatorInterface) {
                return;
            }

            /*
             * Always make the generator wrapper visible
             * before opening either panel.
             */

            generatorInterface.hidden =
                false;

            generatorInterface.style.display =
                "block";

            generatorInterface.style.visibility =
                "visible";

            generatorInterface.style.opacity =
                "1";

            generatorInterface.style.zIndex =
                "10000";

            /*
             * Hide both generator panels first.
             */

            if (this.elements.imagePanel) {

                this.elements.imagePanel.hidden =
                    true;

                this.elements.imagePanel.style.display =
                    "none";

                this.elements.imagePanel.style.visibility =
                    "hidden";
            }

            if (this.elements.videoPanel) {

                this.elements.videoPanel.hidden =
                    true;

                this.elements.videoPanel.style.display =
                    "none";

                this.elements.videoPanel.style.visibility =
                    "hidden";
            }

            /*
             * If the user is not logged in, show the
             * Login Required panel. This is the expected
             * behavior before actual generation access.
             */

            if (!this.isGenerationLoggedIn()) {

                this.state.generatorOpen =
                    type;

                this.openLoginGate();

                return;
            }

            /*
             * Logged-in state:
             * close login gate and show only the selected
             * generator panel.
             */

            this.closeLoginGate();

            if (
                type === "image" &&
                this.elements.imagePanel
            ) {

                this.elements.imagePanel.hidden =
                    false;

                this.elements.imagePanel.style.display =
                    "block";

                this.elements.imagePanel.style.visibility =
                    "visible";
            }

            if (
                type === "video" &&
                this.elements.videoPanel
            ) {

                this.elements.videoPanel.hidden =
                    false;

                this.elements.videoPanel.style.display =
                    "block";

                this.elements.videoPanel.style.visibility =
                    "visible";
            }

            this.state.generatorOpen =
                type;

            if (
                type === "image" &&
                this.elements.imagePrompt
            ) {

                this.elements.imagePrompt.focus();
            }

            if (
                type === "video" &&
                this.elements.videoPrompt
            ) {

                this.elements.videoPrompt.focus();
            }
        },

        closeGenerator: function (type) {

            if (
                type === "image" &&
                this.elements.imagePanel
            ) {

                this.elements.imagePanel.hidden =
                    true;

                this.elements.imagePanel.style.display =
                    "none";

                this.elements.imagePanel.style.visibility =
                    "hidden";
            }

            if (
                type === "video" &&
                this.elements.videoPanel
            ) {

                this.elements.videoPanel.hidden =
                    true;

                this.elements.videoPanel.style.display =
                    "none";

                this.elements.videoPanel.style.visibility =
                    "hidden";
            }

            if (
                type === "image" ||
                type === "video"
            ) {

                if (
                    this.state.generatorOpen ===
                    type
                ) {

                    this.state.generatorOpen =
                        null;
                }
            }
        },

        /* =====================================================
           GENERATION SAFETY
           ===================================================== */

        checkGenerationSafety: function (prompt) {

            var text =
                String(prompt || "")
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .trim();

            if (!text) {

                return {
                    allowed: false,
                    reason: "Please enter a prompt."
                };
            }

            var sexualTerms = [
                "nude",
                "naked",
                "porn",
                "pornographic",
                "pornography",
                "sexual",
                "sexually",
                "sexualized",
                "sex scene",
                "sex video",
                "sex photo",
                "explicit sexual",
                "sexually explicit",
                "nsfw",
                "topless",
                "bottomless",
                "fully naked",
                "without clothes",
                "without clothing",
                "remove clothes",
                "remove clothing",
                "undress",
                "undressing",
                "intimate nude",
                "nude photo",
                "nude video",
                "नग्न",
                "नंगी",
                "नंगा",
                "अश्लील",
                "सेक्स",
                "सेक्स वीडियो",
                "सेक्स फोटो"
            ];

            var realPersonTerms = [
                "celebrity",
                "celebrities",
                "politician",
                "politicians",
                "prime minister",
                "president",
                "actor",
                "actress",
                "singer",
                "model",
                "influencer",
                "public figure",
                "public figures",
                "famous person",
                "famous people",
                "real person",
                "real people",
                "real celebrity",
                "real politician",
                "real actor",
                "real actress",
                "real singer",
                "real model",
                "my celebrity",
                "a celebrity",
                "an actor",
                "an actress",
                "a singer",
                "a politician",
                "a public figure"
            ];

            var deepfakeTerms = [
                "deepfake",
                "deep fake",
                "face swap",
                "face-swap",
                "face replacement",
                "face replace",
                "impersonate",
                "impersonation",
                "fake identity",
                "fake person",
                "fake nude",
                "fake naked",
                "fake intimate",
                "intimate fake",
                "leaked video",
                "leaked photo",
                "leaked image",
                "undress",
                "undressing",
                "remove clothes",
                "remove clothing",
                "make them naked",
                "make her naked",
                "make him naked",
                "sexual deepfake"
            ];

            var hasSexual =
                this.containsAny(
                    text,
                    sexualTerms
                );

            var hasRealPerson =
                this.containsAny(
                    text,
                    realPersonTerms
                );

            var hasDeepfake =
                this.containsAny(
                    text,
                    deepfakeTerms
                );

            if (hasSexual) {

                return {
                    allowed: false,
                    reason:
                        "This request cannot be generated because ALON AI does not generate sexual, nude or explicit content."
                };
            }

            if (hasDeepfake) {

                return {
                    allowed: false,
                    reason:
                        "This request cannot be generated because ALON AI does not create deepfakes, impersonation or manipulated intimate content involving real people."
                };
            }

            if (hasRealPerson) {

                return {
                    allowed: false,
                    reason:
                        "This request cannot be generated because the public ALON AI generator does not create images or videos of real people, celebrities, politicians or public figures."
                };
            }

            var unsafeTerms = [
                "child sexual",
                "minor sexual",
                "sexual minor",
                "sexual abuse of a child",
                "child pornography",
                "csam",
                "explosive",
                "build a bomb",
                "make a bomb",
                "bomb making",
                "terrorist recruitment",
                "terrorist propaganda",
                "hacked account",
                "hack an account",
                "stolen password",
                "steal password",
                "malware",
                "ransomware",
                "violent torture",
                "graphic gore"
            ];

            if (
                this.containsAny(
                    text,
                    unsafeTerms
                )
            ) {

                return {
                    allowed: false,
                    reason:
                        "This request cannot be generated because it falls outside ALON AI safety rules."
                };
            }

            return {
                allowed: true,
                reason: ""
            };
        },

        containsAny: function (text, list) {

            for (
                var i = 0;
                i < list.length;
                i++
            ) {

                if (
                    text.indexOf(
                        list[i]
                    ) !== -1
                ) {

                    return true;
                }
            }

            return false;
        },

        /* =====================================================
           IMAGE GENERATION REQUEST
           ===================================================== */

        generateImage: function () {

            if (!this.isGenerationLoggedIn()) {

                this.openLoginGate();

                return;
            }

            if (!this.elements.imagePrompt) {
                return;
            }

            var prompt =
                this.elements.imagePrompt.value.trim();

            var safety =
                this.checkGenerationSafety(
                    prompt
                );

            if (!safety.allowed) {

                this.setGeneratorStatus(
                    "image",
                    safety.reason
                );

                return;
            }

            this.setGeneratorStatus(
                "image",
                "Preparing secure image-generation request..."
            );

            this.sendGenerationRequest(
                "image",
                prompt
            );
        },

        /* =====================================================
           VIDEO GENERATION REQUEST
           ===================================================== */

        generateVideo: function () {

            if (!this.isGenerationLoggedIn()) {

                this.openLoginGate();

                return;
            }

            if (!this.elements.videoPrompt) {
                return;
            }

            var prompt =
                this.elements.videoPrompt.value.trim();

            var safety =
                this.checkGenerationSafety(
                    prompt
                );

            if (!safety.allowed) {

                this.setGeneratorStatus(
                    "video",
                    safety.reason
                );

                return;
            }

            this.setGeneratorStatus(
                "video",
                "Preparing secure video-generation request..."
            );

            this.sendGenerationRequest(
                "video",
                prompt
            );
        },

        /* =====================================================
           GENERATION BACKEND HOOK
           ===================================================== */

        sendGenerationRequest: async function (
            type,
            prompt
        ) {

            var endpoint =
                type === "image"
                    ? "./api/ai-image"
                    : "./api/ai-video";

            try {

                var response =
                    await fetch(
                        endpoint,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            credentials:
                                "include",
                            body:
                                JSON.stringify({
                                    prompt: prompt,
                                    type: type
                                })
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        "Generation service unavailable."
                    );
                }

                var data =
                    await response.json();

                if (
                    !data ||
                    data.success !== true
                ) {

                    throw new Error(
                        data &&
                        data.message
                            ? data.message
                            : "Generation was not completed."
                    );
                }

                this.dispatch(
                    "alon:ai-generation-complete",
                    {
                        type: type,
                        result: data
                    }
                );

                this.setGeneratorStatus(
                    type,
                    "Generation completed."
                );

            } catch (error) {

                this.setGeneratorStatus(
                    type,
                    "Generation service is not connected yet. The secure generator interface is ready for the backend."
                );

                this.dispatch(
                    "alon:ai-generation-error",
                    {
                        type: type,
                        error:
                            error &&
                            error.message
                                ? error.message
                                : "Unknown error"
                    }
                );
            }
        },

        /* =====================================================
           GENERATOR STATUS
           ===================================================== */

        setGeneratorStatus: function (
            type,
            message
        ) {

            var element =
                type === "image"
                    ? this.elements.imageStatus
                    : this.elements.videoStatus;

            if (element) {
                element.textContent =
                    message;
            }
        },

        /* =====================================================
           FEATURE HANDLER
           ===================================================== */

        handleFeature: function (detail) {

            if (!detail) {
                return;
            }

            this.dispatch(
                "alon:ai-feature-seen",
                {
                    feature: detail
                }
            );
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

                        self.closeGenerator(
                            "image"
                        );

                        self.closeGenerator(
                            "video"
                        );

                        self.closeLoginGate();
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
                    text ||
                    "ALON HISTORYVERSE 24";
            }
        },

        /* =====================================================
           CUSTOM EVENT DISPATCHER
           ===================================================== */

        dispatch: function (
            name,
            detail
        ) {

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

                var event =
                    document.createEvent(
                        "CustomEvent"
                    );

                event.initCustomEvent(
                    name,
                    false,
                    false,
                    detail || {}
                );

                document.dispatchEvent(
                    event
                );
            }
        },

        /* =====================================================
           PUBLIC API
           ===================================================== */

        getStatus: function () {

            return {
                version:
                    this.version,

                initialized:
                    this.initialized,

                aiOpen:
                    this.state.aiOpen,

                listening:
                    this.state.listening,

                speaking:
                    this.state.speaking,

                generatorOpen:
                    this.state.generatorOpen,

                currentAd:
                    this.state.lastAdId
            };
        }
    };

    /* =========================================================
       PUBLIC GLOBAL
       ========================================================= */

    window.ALON_AI =
        ALON_AI;

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

                window.ALON_AI
                    .stopAdvertisementRotation();

                window.ALON_AI
                    .stopSpeaking();

            } else if (
                window.ALON_AI.initialized
            ) {

                window.ALON_AI
                    .startAdvertisementRotation();
            }
        }
    );

    /* =========================================================
       INITIALIZE
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

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