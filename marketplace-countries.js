/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.7 WORKING FLAG COUNTRY SYSTEM
   Creator: Baba Thecno Guru

   USES:
   • Regular Marketplace
   • Global Marketplace
   • Jobs / Careers compatibility

   FORMAT:
   🇮🇳 India (IN • IND) +91

   IMPORTANT:
   • This file is the marketplace country source.
   • No world-countries.js dependency.
   • Flag is always first.
   • ISO2 + ISO3 + Calling Code included.
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       COUNTRY DATABASE
       [Name, ISO2, ISO3, Calling Code, Flag]
       ===================================================== */

    const COUNTRY_DATA = [

        ["Afghanistan", "AF", "AFG", "+93", "🇦🇫"],
        ["Albania", "AL", "ALB", "+355", "🇦🇱"],
        ["Algeria", "DZ", "DZA", "+213", "🇩🇿"],
        ["Andorra", "AD", "AND", "+376", "🇦🇩"],
        ["Angola", "AO", "AGO", "+244", "🇦🇴"],
        ["Antigua and Barbuda", "AG", "ATG", "+1-268", "🇦🇬"],
        ["Argentina", "AR", "ARG", "+54", "🇦🇷"],
        ["Armenia", "AM", "ARM", "+374", "🇦🇲"],
        ["Australia", "AU", "AUS", "+61", "🇦🇺"],
        ["Austria", "AT", "AUT", "+43", "🇦🇹"],
        ["Azerbaijan", "AZ", "AZE", "+994", "🇦🇿"],

        ["Bahamas", "BS", "BHS", "+1-242", "🇧🇸"],
        ["Bahrain", "BH", "BHR", "+973", "🇧🇭"],
        ["Barbados", "BB", "BRB", "+1-246", "🇧🇧"],
        ["Belarus", "BY", "BLR", "+375", "🇧🇾"],
        ["Belgium", "BE", "BEL", "+32", "🇧🇪"],
        ["Belize", "BZ", "BLZ", "+501", "🇧🇿"],
        ["Benin", "BJ", "BEN", "+229", "🇧🇯"],
        ["Bhutan", "BT", "BTN", "+975", "🇧🇹"],
        ["Bolivia", "BO", "BOL", "+591", "🇧🇴"],
        ["Bosnia and Herzegovina", "BA", "BIH", "+387", "🇧🇦"],
        ["Botswana", "BW", "BWA", "+267", "🇧🇼"],
        ["Brazil", "BR", "BRA", "+55", "🇧🇷"],
        ["Brunei", "BN", "BRN", "+673", "🇧🇳"],
        ["Bulgaria", "BG", "BGR", "+359", "🇧🇬"],
        ["Burkina Faso", "BF", "BFA", "+226", "🇧🇫"],
        ["Burundi", "BI", "BDI", "+257", "🇧🇮"],

        ["Cabo Verde", "CV", "CPV", "+238", "🇨🇻"],
        ["Cambodia", "KH", "KHM", "+855", "🇰🇭"],
        ["Cameroon", "CM", "CMR", "+237", "🇨🇲"],
        ["Canada", "CA", "CAN", "+1", "🇨🇦"],
        ["Central African Republic", "CF", "CAF", "+236", "🇨🇫"],
        ["Chad", "TD", "TCD", "+235", "🇹🇩"],
        ["Chile", "CL", "CHL", "+56", "🇨🇱"],
        ["China", "CN", "CHN", "+86", "🇨🇳"],
        ["Colombia", "CO", "COL", "+57", "🇨🇴"],
        ["Comoros", "KM", "COM", "+269", "🇰🇲"],
        ["Congo", "CG", "COG", "+242", "🇨🇬"],
        ["Costa Rica", "CR", "CRI", "+506", "🇨🇷"],
        ["Croatia", "HR", "HRV", "+385", "🇭🇷"],
        ["Cuba", "CU", "CUB", "+53", "🇨🇺"],
        ["Cyprus", "CY", "CYP", "+357", "🇨🇾"],
        ["Czechia", "CZ", "CZE", "+420", "🇨🇿"],

        ["Democratic Republic of the Congo", "CD", "COD", "+243", "🇨🇩"],
        ["Denmark", "DK", "DNK", "+45", "🇩🇰"],
        ["Djibouti", "DJ", "DJI", "+253", "🇩🇯"],
        ["Dominica", "DM", "DMA", "+1-767", "🇩🇲"],
        ["Dominican Republic", "DO", "DOM", "+1-809", "🇩🇴"],

        ["Ecuador", "EC", "ECU", "+593", "🇪🇨"],
        ["Egypt", "EG", "EGY", "+20", "🇪🇬"],
        ["El Salvador", "SV", "SLV", "+503", "🇸🇻"],
        ["Equatorial Guinea", "GQ", "GNQ", "+240", "🇬🇶"],
        ["Eritrea", "ER", "ERI", "+291", "🇪🇷"],
        ["Estonia", "EE", "EST", "+372", "🇪🇪"],
        ["Eswatini", "SZ", "SWZ", "+268", "🇸🇿"],
        ["Ethiopia", "ET", "ETH", "+251", "🇪🇹"],

        ["Fiji", "FJ", "FJI", "+679", "🇫🇯"],
        ["Finland", "FI", "FIN", "+358", "🇫🇮"],
        ["France", "FR", "FRA", "+33", "🇫🇷"],

        ["Gabon", "GA", "GAB", "+241", "🇬🇦"],
        ["Gambia", "GM", "GMB", "+220", "🇬🇲"],
        ["Georgia", "GE", "GEO", "+995", "🇬🇪"],
        ["Germany", "DE", "DEU", "+49", "🇩🇪"],
        ["Ghana", "GH", "GHA", "+233", "🇬🇭"],
        ["Greece", "GR", "GRC", "+30", "🇬🇷"],
        ["Grenada", "GD", "GRD", "+1-473", "🇬🇩"],
        ["Guatemala", "GT", "GTM", "+502", "🇬🇹"],
        ["Guinea", "GN", "GIN", "+224", "🇬🇳"],
        ["Guinea-Bissau", "GW", "GNB", "+245", "🇬🇼"],
        ["Guyana", "GY", "GUY", "+592", "🇬🇾"],

        ["Haiti", "HT", "HTI", "+509", "🇭🇹"],
        ["Honduras", "HN", "HND", "+504", "🇭🇳"],
        ["Hungary", "HU", "HUN", "+36", "🇭🇺"],

        ["Iceland", "IS", "ISL", "+354", "🇮🇸"],
        ["India", "IN", "IND", "+91", "🇮🇳"],
        ["Indonesia", "ID", "IDN", "+62", "🇮🇩"],
        ["Iran", "IR", "IRN", "+98", "🇮🇷"],
        ["Iraq", "IQ", "IRQ", "+964", "🇮🇶"],
        ["Ireland", "IE", "IRL", "+353", "🇮🇪"],
        ["Israel", "IL", "ISR", "+972", "🇮🇱"],
        ["Italy", "IT", "ITA", "+39", "🇮🇹"],
        ["Ivory Coast", "CI", "CIV", "+225", "🇨🇮"],

        ["Jamaica", "JM", "JAM", "+1-876", "🇯🇲"],
        ["Japan", "JP", "JPN", "+81", "🇯🇵"],
        ["Jordan", "JO", "JOR", "+962", "🇯🇴"],

        ["Kazakhstan", "KZ", "KAZ", "+7", "🇰🇿"],
        ["Kenya", "KE", "KEN", "+254", "🇰🇪"],
        ["Kiribati", "KI", "KIR", "+686", "🇰🇮"],
        ["Kuwait", "KW", "KWT", "+965", "🇰🇼"],
        ["Kyrgyzstan", "KG", "KGZ", "+996", "🇰🇬"],

        ["Laos", "LA", "LAO", "+856", "🇱🇦"],
        ["Latvia", "LV", "LVA", "+371", "🇱🇻"],
        ["Lebanon", "LB", "LBN", "+961", "🇱🇧"],
        ["Lesotho", "LS", "LSO", "+266", "🇱🇸"],
        ["Liberia", "LR", "LBR", "+231", "🇱🇷"],
        ["Libya", "LY", "LBY", "+218", "🇱🇾"],
        ["Liechtenstein", "LI", "LIE", "+423", "🇱🇮"],
        ["Lithuania", "LT", "LTU", "+370", "🇱🇹"],
        ["Luxembourg", "LU", "LUX", "+352", "🇱🇺"],

        ["Madagascar", "MG", "MDG", "+261", "🇲🇬"],
        ["Malawi", "MW", "MWI", "+265", "🇲🇼"],
        ["Malaysia", "MY", "MYS", "+60", "🇲🇾"],
        ["Maldives", "MV", "MDV", "+960", "🇲🇻"],
        ["Mali", "ML", "MLI", "+223", "🇲🇱"],
        ["Malta", "MT", "MLT", "+356", "🇲🇹"],
        ["Marshall Islands", "MH", "MHL", "+692", "🇲🇭"],
        ["Mauritania", "MR", "MRT", "+222", "🇲🇷"],
        ["Mauritius", "MU", "MUS", "+230", "🇲🇺"],
        ["Mexico", "MX", "MEX", "+52", "🇲🇽"],
        ["Micronesia", "FM", "FSM", "+691", "🇫🇲"],
        ["Moldova", "MD", "MDA", "+373", "🇲🇩"],
        ["Monaco", "MC", "MCO", "+377", "🇲🇨"],
        ["Mongolia", "MN", "MNG", "+976", "🇲🇳"],
        ["Montenegro", "ME", "MNE", "+382", "🇲🇪"],
        ["Morocco", "MA", "MAR", "+212", "🇲🇦"],
        ["Mozambique", "MZ", "MOZ", "+258", "🇲🇿"],
        ["Myanmar", "MM", "MMR", "+95", "🇲🇲"],

        ["Namibia", "NA", "NAM", "+264", "🇳🇦"],
        ["Nauru", "NR", "NRU", "+674", "🇳🇷"],
        ["Nepal", "NP", "NPL", "+977", "🇳🇵"],
        ["Netherlands", "NL", "NLD", "+31", "🇳🇱"],
        ["New Zealand", "NZ", "NZL", "+64", "🇳🇿"],
        ["Nicaragua", "NI", "NIC", "+505", "🇳🇮"],
        ["Niger", "NE", "NER", "+227", "🇳🇪"],
        ["Nigeria", "NG", "NGA", "+234", "🇳🇬"],
        ["North Korea", "KP", "PRK", "+850", "🇰🇵"],
        ["North Macedonia", "MK", "MKD", "+389", "🇲🇰"],
        ["Norway", "NO", "NOR", "+47", "🇳🇴"],

        ["Oman", "OM", "OMN", "+968", "🇴🇲"],

        ["Palau", "PW", "PLW", "+680", "🇵🇼"],
        ["Panama", "PA", "PAN", "+507", "🇵🇦"],
        ["Papua New Guinea", "PG", "PNG", "+675", "🇵🇬"],
        ["Paraguay", "PY", "PRY", "+595", "🇵🇾"],
        ["Peru", "PE", "PER", "+51", "🇵🇪"],
        ["Philippines", "PH", "PHL", "+63", "🇵🇭"],
        ["Poland", "PL", "POL", "+48", "🇵🇱"],
        ["Portugal", "PT", "PRT", "+351", "🇵🇹"],

        ["Qatar", "QA", "QAT", "+974", "🇶🇦"],

        ["Romania", "RO", "ROU", "+40", "🇷🇴"],
        ["Russia", "RU", "RUS", "+7", "🇷🇺"],
        ["Rwanda", "RW", "RWA", "+250", "🇷🇼"],

        ["Saint Kitts and Nevis", "KN", "KNA", "+1-869", "🇰🇳"],
        ["Saint Lucia", "LC", "LCA", "+1-758", "🇱🇨"],
        ["Saint Vincent and the Grenadines", "VC", "VCT", "+1-784", "🇻🇨"],
        ["Samoa", "WS", "WSM", "+685", "🇼🇸"],
        ["San Marino", "SM", "SMR", "+378", "🇸🇲"],
        ["Sao Tome and Principe", "ST", "STP", "+239", "🇸🇹"],
        ["Saudi Arabia", "SA", "SAU", "+966", "🇸🇦"],
        ["Senegal", "SN", "SEN", "+221", "🇸🇳"],
        ["Serbia", "RS", "SRB", "+381", "🇷🇸"],
        ["Seychelles", "SC", "SYC", "+248", "🇸🇨"],
        ["Sierra Leone", "SL", "SLE", "+232", "🇸🇱"],
        ["Singapore", "SG", "SGP", "+65", "🇸🇬"],
        ["Slovakia", "SK", "SVK", "+421", "🇸🇰"],
        ["Slovenia", "SI", "SVN", "+386", "🇸🇮"],
        ["Solomon Islands", "SB", "SLB", "+677", "🇸🇧"],
        ["Somalia", "SO", "SOM", "+252", "🇸🇴"],
        ["South Africa", "ZA", "ZAF", "+27", "🇿🇦"],
        ["South Korea", "KR", "KOR", "+82", "🇰🇷"],
        ["South Sudan", "SS", "SSD", "+211", "🇸🇸"],
        ["Spain", "ES", "ESP", "+34", "🇪🇸"],
        ["Sri Lanka", "LK", "LKA", "+94", "🇱🇰"],
        ["Sudan", "SD", "SDN", "+249", "🇸🇩"],
        ["Suriname", "SR", "SUR", "+597", "🇸🇷"],
        ["Sweden", "SE", "SWE", "+46", "🇸🇪"],
        ["Switzerland", "CH", "CHE", "+41", "🇨🇭"],
        ["Syria", "SY", "SYR", "+963", "🇸🇾"],

        ["Tajikistan", "TJ", "TJK", "+992", "🇹🇯"],
        ["Tanzania", "TZ", "TZA", "+255", "🇹🇿"],
        ["Thailand", "TH", "THA", "+66", "🇹🇭"],
        ["Timor-Leste", "TL", "TLS", "+670", "🇹🇱"],
        ["Togo", "TG", "TGO", "+228", "🇹🇬"],
        ["Tonga", "TO", "TON", "+676", "🇹🇴"],
        ["Trinidad and Tobago", "TT", "TTO", "+1-868", "🇹🇹"],
        ["Tunisia", "TN", "TUN", "+216", "🇹🇳"],
        ["Turkey", "TR", "TUR", "+90", "🇹🇷"],
        ["Turkmenistan", "TM", "TKM", "+993", "🇹🇲"],
        ["Tuvalu", "TV", "TUV", "+688", "🇹🇻"],

        ["Uganda", "UG", "UGA", "+256", "🇺🇬"],
        ["Ukraine", "UA", "UKR", "+380", "🇺🇦"],
        ["United Arab Emirates", "AE", "ARE", "+971", "🇦🇪"],
        ["United Kingdom", "GB", "GBR", "+44", "🇬🇧"],
        ["United States", "US", "USA", "+1", "🇺🇸"],
        ["Uruguay", "UY", "URY", "+598", "🇺🇾"],
        ["Uzbekistan", "UZ", "UZB", "+998", "🇺🇿"],

        ["Vanuatu", "VU", "VUT", "+678", "🇻🇺"],
        ["Vatican City", "VA", "VAT", "+379", "🇻🇦"],
        ["Venezuela", "VE", "VEN", "+58", "🇻🇪"],
        ["Vietnam", "VN", "VNM", "+84", "🇻🇳"],

        ["Yemen", "YE", "YEM", "+967", "🇾🇪"],

        ["Zambia", "ZM", "ZMB", "+260", "🇿🇲"],
        ["Zimbabwe", "ZW", "ZWE", "+263", "🇿🇼"]

    ];


    /* =====================================================
       BUILD STANDARD COUNTRY OBJECTS
       ===================================================== */

    const MARKETPLACE_COUNTRIES = COUNTRY_DATA.map(
        function (item) {

            const name = item[0];
            const iso2 = item[1];
            const iso3 = item[2];
            const callingCode = item[3];
            const flag = item[4];

            return {

                name: name,

                country: name,

                slug: name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),

                flag: flag,

                code2: iso2,
                code3: iso3,

                iso2: iso2,
                iso3: iso3,

                callingCode: callingCode,
                phoneCode: callingCode

            };

        }
    );


    /* =====================================================
       COUNTRY LABEL
       ===================================================== */

    function countryLabel(country) {

        if (!country) {
            return "";
        }

        const flag =
            country.flag ||
            "🌍";

        const name =
            country.name ||
            country.country ||
            "";

        const iso2 =
            country.iso2 ||
            country.code2 ||
            "";

        const iso3 =
            country.iso3 ||
            country.code3 ||
            "";

        const callingCode =
            country.callingCode ||
            country.phoneCode ||
            "";

        return [
            flag,
            name,
            "(" + iso2 + " • " + iso3 + ")",
            callingCode
        ]
            .filter(Boolean)
            .join(" ")
            .trim();
    }


    /* =====================================================
       FIND COUNTRY
       ===================================================== */

    function findCountry(value) {

        if (value === null || value === undefined) {
            return null;
        }

        const search =
            String(value)
                .trim()
                .toLowerCase();

        if (!search) {
            return null;
        }

        return MARKETPLACE_COUNTRIES.find(
            function (country) {

                return (

                    String(country.name)
                        .toLowerCase() === search

                    ||

                    String(country.country)
                        .toLowerCase() === search

                    ||

                    String(country.iso2)
                        .toLowerCase() === search

                    ||

                    String(country.iso3)
                        .toLowerCase() === search

                    ||

                    String(country.callingCode)
                        .toLowerCase() === search

                );

            }
        ) || null;
    }


    /* =====================================================
       CREATE COUNTRY OPTION
       ===================================================== */

    function createCountryOption(country) {

        const option =
            document.createElement("option");

        const label =
            countryLabel(country);

        option.value =
            country.iso2 ||
            country.code2 ||
            country.name ||
            "";

        option.textContent =
            label;

        option.dataset.countryName =
            country.name || "";

        option.dataset.countryCode =
            country.iso2 ||
            country.code2 ||
            "";

        option.dataset.countryISO3 =
            country.iso3 ||
            country.code3 ||
            "";

        option.dataset.callingCode =
            country.callingCode ||
            country.phoneCode ||
            "";

        option.dataset.flag =
            country.flag ||
            "🌍";

        return option;
    }


    /* =====================================================
       FILL ONE SELECT
       ===================================================== */

    function fillCountrySelect(
        selector,
        selectedValue
    ) {

        let select = null;

        if (
            typeof selector === "string"
        ) {

            if (
                selector.charAt(0) === "#"
            ) {

                select =
                    document.querySelector(
                        selector
                    );

            } else {

                select =
                    document.getElementById(
                        selector
                    ) ||
                    document.querySelector(
                        selector
                    );

            }

        } else if (
            selector &&
            selector.tagName === "SELECT"
        ) {

            select = selector;

        }

        if (!select) {
            return false;
        }


        const current =
            selectedValue ||
            select.value ||
            "";


        /*
         * Do not rebuild a select that is already
         * correctly populated. This prevents selected
         * country values from being lost.
         */

        if (
            select.options.length >
            MARKETPLACE_COUNTRIES.length
        ) {
            return true;
        }


        select.innerHTML = "";


        const placeholder =
            document.createElement("option");

        placeholder.value = "";

        placeholder.textContent =
            "🌍 Select Country";

        select.appendChild(
            placeholder
        );


        MARKETPLACE_COUNTRIES.forEach(
            function (country) {

                select.appendChild(
                    createCountryOption(
                        country
                    )
                );

            }
        );


        if (current) {

            const normalized =
                String(current)
                    .trim()
                    .toUpperCase();


            const match =
                Array.from(
                    select.options
                ).find(
                    function (option) {

                        return (

                            String(
                                option.value
                            )
                                .toUpperCase() ===
                            normalized

                            ||

                            String(
                                option.dataset.countryName ||
                                ""
                            )
                                .toUpperCase() ===
                            normalized

                            ||

                            String(
                                option.dataset.countryISO3 ||
                                ""
                            )
                                .toUpperCase() ===
                            normalized

                        );

                    }
                );


            if (match) {
                select.value =
                    match.value;
            }

        }


        return (
            select.options.length >
            1
        );
    }


    /* =====================================================
       FILL MARKETPLACE SELECTS
       ===================================================== */

    function fillMarketplaceSelects() {

        const ids = [

            /* Regular Marketplace */

            "rmCountry",
            "rmShowroomCountry",


            /* Global Marketplace */

            "country",
            "adCountry",


            /* Compatibility */

            "marketplaceCountry",
            "globalCountry",
            "showroomCountry"

        ];


        ids.forEach(
            function (id) {

                fillCountrySelect(id);

            }
        );

    }


    /* =====================================================
       GLOBAL EXPORTS
       ===================================================== */

    window.MARKETPLACE_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.ALON_MARKETPLACE_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.ALON_WORLD_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.WORLD_COUNTRIES =
        MARKETPLACE_COUNTRIES;

    window.GLOBAL_COUNTRIES =
        MARKETPLACE_COUNTRIES;


    /* =====================================================
       GLOBAL HELPERS
       ===================================================== */

    window.ALON_FIND_COUNTRY =
        findCountry;


    window.ALON_COUNTRY_LABEL =
        countryLabel;


    window.ALON_FILL_COUNTRY_SELECT =
        fillCountrySelect;


    window.ALON_FILL_MARKETPLACE_COUNTRIES =
        fillMarketplaceSelects;


    /* =====================================================
       DOM READY
       ===================================================== */

    function startCountrySystem() {

        fillMarketplaceSelects();


        /*
         * A small retry is useful when Marketplace
         * HTML creates fields dynamically.
         */

        let attempts = 0;


        const retry =
            setInterval(
                function () {

                    attempts++;


                    fillMarketplaceSelects();


                    if (
                        attempts >= 20
                    ) {

                        clearInterval(
                            retry
                        );

                    }

                },
                250
            );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startCountrySystem
        );

    } else {

        startCountrySystem();

    }


    window.addEventListener(
        "load",
        fillMarketplaceSelects
    );


    /* =====================================================
       MUTATION OBSERVER
       ===================================================== */

    if (
        window.MutationObserver
    ) {

        let observerTimer = null;


        const observer =
            new MutationObserver(
                function (mutations) {

                    let hasNewSelect =
                        false;


                    mutations.forEach(
                        function (mutation) {

                            if (
                                mutation.addedNodes &&
                                mutation.addedNodes.length
                            ) {

                                mutation.addedNodes
                                    .forEach(
                                        function (node) {

                                            if (
                                                node.nodeType ===
                                                1
                                            ) {

                                                if (
                                                    node.tagName ===
                                                    "SELECT"
                                                ) {

                                                    hasNewSelect =
                                                        true;

                                                }


                                                if (
                                                    node.querySelector &&
                                                    node.querySelector(
                                                        "select"
                                                    )
                                                ) {

                                                    hasNewSelect =
                                                        true;

                                                }

                                            }

                                        }
                                    );

                            }

                        }
                    );


                    if (
                        hasNewSelect
                    ) {

                        clearTimeout(
                            observerTimer
                        );


                        observerTimer =
                            setTimeout(
                                function () {

                                    fillMarketplaceSelects();

                                },
                                50
                            );

                    }

                }
            );


        observer.observe(
            document.documentElement,
            {
                childList: true,
                subtree: true
            }
        );

    }


    /* =====================================================
       DEBUG INFORMATION
       ===================================================== */

    console.log(
        "ALON HISTORYVERSE 24: marketplace-countries.js loaded successfully."
    );

    console.log(
        "ALON HISTORYVERSE 24: Countries loaded:",
        MARKETPLACE_COUNTRIES.length
    );

    console.log(
        "ALON HISTORYVERSE 24: India:",
        findCountry("IN")
    );


})();