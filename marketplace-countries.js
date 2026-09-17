/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.7 SAFE MARKETPLACE COUNTRY SYSTEM
   Creator: Baba Thecno Guru

   USED BY:
   1. marketplace.html
      → Global Marketplace

   2. regular-marketpkes.js
      → Regular Marketplace

   JOBS & CAREERS:
      → NOT MODIFIED

   FEATURES:
   • One Marketplace Country Database
   • World Countries
   • Flag FIRST
   • Country Name
   • ISO-2
   • ISO-3
   • Calling Code
   • Regular Marketplace Support
   • Global Marketplace Support
   • rmCountry
   • rmShowroomCountry
   • Global Country IDs
   • Bangladesh excluded
   • Pakistan excluded
   ========================================================= */

(function () {

    "use strict";

    /* =====================================================
       COUNTRY DATA
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
        ["Czech Republic", "CZ", "CZE", "+420", "🇨🇿"],

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
        ["Palestine", "PS", "PSE", "+970", "🇵🇸"],
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

        ["Taiwan", "TW", "TWN", "+886", "🇹🇼"],
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
        ["Vatican City", "VA", "VAT", "+39", "🇻🇦"],
        ["Venezuela", "VE", "VEN", "+58", "🇻🇪"],
        ["Vietnam", "VN", "VNM", "+84", "🇻🇳"],

        ["Yemen", "YE", "YEM", "+967", "🇾🇪"],

        ["Zambia", "ZM", "ZMB", "+260", "🇿🇲"],
        ["Zimbabwe", "ZW", "ZWE", "+263", "🇿🇼"]

    ];


    /* =====================================================
       BUILD MARKETPLACE COUNTRY OBJECTS
       ===================================================== */

    const MARKETPLACE_COUNTRIES = COUNTRY_DATA.map(function (item) {

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
                .replace(/[^a-z0-9]+/g, "-"),

            flag: flag,

            code2: iso2,
            code3: iso3,

            iso2: iso2,
            iso3: iso3,

            callingCode: callingCode,
            phoneCode: callingCode

        };

    });


    /* =====================================================
       GLOBAL VARIABLES
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
       FIND COUNTRY
       ===================================================== */

    window.ALON_FIND_COUNTRY = function (value) {

        if (!value) {
            return null;
        }

        const search =
            String(value)
                .trim()
                .toLowerCase();

        return MARKETPLACE_COUNTRIES.find(function (country) {

            return (

                country.name.toLowerCase() === search ||

                country.country.toLowerCase() === search ||

                country.iso2.toLowerCase() === search ||

                country.iso3.toLowerCase() === search ||

                country.code2.toLowerCase() === search ||

                country.code3.toLowerCase() === search ||

                country.callingCode.toLowerCase() === search ||

                country.phoneCode.toLowerCase() === search

            );

        }) || null;

    };


    /* =====================================================
       COUNTRY LABEL
       FLAG ALWAYS FIRST
       ===================================================== */

    window.ALON_COUNTRY_LABEL = function (country) {

        if (!country) {
            return "";
        }

        const flag =
            country.flag || "🌍";

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

        const calling =
            country.callingCode ||
            country.phoneCode ||
            "";

        return (

            flag +
            " " +
            name +
            " (" +
            iso2 +
            " • " +
            iso3 +
            ") " +
            calling

        ).trim();

    };


    /* =====================================================
       FILL COUNTRY SELECT
       ===================================================== */

    window.ALON_FILL_COUNTRY_SELECT =
        function (selector, selectedValue) {

            let select = selector;

            if (typeof selector === "string") {

                select =
                    document.querySelector(selector);

            }

            if (
                !select ||
                select.tagName !== "SELECT"
            ) {
                return false;
            }


            const oldValue =
                selectedValue !== undefined
                    ? String(selectedValue)
                    : String(select.value || "");


            /* Clear */

            select.innerHTML = "";


            /* Placeholder */

            const placeholder =
                document.createElement("option");

            placeholder.value = "";

            placeholder.textContent =
                "🌍 Select Country";

            select.appendChild(
                placeholder
            );


            /* Countries */

            MARKETPLACE_COUNTRIES.forEach(
                function (country) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        country.iso2;


                    /* FLAG FIRST */

                    option.textContent =
                        country.flag +
                        " " +
                        country.name +
                        " (" +
                        country.iso2 +
                        " • " +
                        country.iso3 +
                        ") " +
                        country.callingCode;


                    /* Data */

                    option.dataset.country =
                        country.name;

                    option.dataset.iso2 =
                        country.iso2;

                    option.dataset.iso3 =
                        country.iso3;

                    option.dataset.callingCode =
                        country.callingCode;

                    option.dataset.phoneCode =
                        country.phoneCode;

                    option.dataset.flag =
                        country.flag;


                    select.appendChild(option);

                }
            );


            /* Restore previous value */

            if (oldValue) {

                const searchValue =
                    oldValue
                        .trim()
                        .toLowerCase();


                const found =
                    Array.from(
                        select.options
                    ).find(function (option) {

                        return (

                            option.value
                                .toLowerCase() ===
                            searchValue ||

                            option.dataset.country
                                .toLowerCase() ===
                            searchValue ||

                            option.dataset.iso2
                                .toLowerCase() ===
                            searchValue ||

                            option.dataset.iso3
                                .toLowerCase() ===
                            searchValue

                        );

                    });


                if (found) {

                    select.value =
                        found.value;

                }

            }


            return true;

        };


    /* =====================================================
       ALL MARKETPLACE COUNTRY SELECT IDs
       ===================================================== */

    function fillMarketplaceSelects() {

        const ids = [

            /* Regular Marketplace */

            "rmCountry",
            "rmShowroomCountry",

            /* Global Marketplace */

            "country",
            "adCountry",
            "marketplaceCountry",
            "globalCountry",
            "showroomCountry"

        ];


        ids.forEach(function (id) {

            const select =
                document.getElementById(id);


            if (select) {

                const currentValue =
                    select.value || "";


                window.ALON_FILL_COUNTRY_SELECT(
                    select,
                    currentValue
                );

            }

        });

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            fillMarketplaceSelects,
            {
                once: true
            }
        );

    } else {

        fillMarketplaceSelects();

    }


    /* =====================================================
       WINDOW LOAD
       ===================================================== */

    window.addEventListener(
        "load",
        fillMarketplaceSelects,
        {
            once: true
        }
    );


    /* =====================================================
       SAFE MUTATION OBSERVER
       -----------------------------------------------------
       Only watch for newly added SELECT elements.
       Do NOT continuously rewrite existing selects.
       ===================================================== */

    if (window.MutationObserver) {

        let observerTimer = null;

        const observer =
            new MutationObserver(
                function (mutations) {

                    let hasNewSelect =
                        false;


                    mutations.forEach(
                        function (mutation) {

                            if (
                                mutation.type !==
                                "childList"
                            ) {
                                return;
                            }


                            mutation.addedNodes.forEach(
                                function (node) {

                                    if (
                                        node.nodeType !==
                                        1
                                    ) {
                                        return;
                                    }


                                    if (
                                        node.tagName ===
                                        "SELECT" ||
                                        (
                                            node.querySelector &&
                                            node.querySelector(
                                                "select"
                                            )
                                        )
                                    ) {

                                        hasNewSelect =
                                            true;

                                    }

                                }
                            );

                        }
                    );


                    if (!hasNewSelect) {
                        return;
                    }


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
            );


        if (document.documentElement) {

            observer.observe(
                document.documentElement,
                {
                    childList: true,
                    subtree: true
                }
            );

        }

    }


    /* =====================================================
       READY STATUS
       ===================================================== */

    window.ALON_MARKETPLACE_COUNTRIES_READY =
        true;


    window.ALON_MARKETPLACE_COUNTRY_COUNT =
        MARKETPLACE_COUNTRIES.length;


})();