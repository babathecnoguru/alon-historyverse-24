/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.5 SAFE CENTRAL COUNTRY SYSTEM
   Creator: Baba Thecno Guru

   PURPOSE
   • Central country database
   • Regular Marketplace support
   • Jobs compatibility
   • Flag
   • Country name
   • ISO-2
   • ISO-3
   • Calling code
   • Automatic dropdown support

   IMPORTANT
   • Global Marketplace files are NOT modified
   • Regular Marketplace IDs:
       rmCountry
       rmShowroomCountry
   ========================================================= */

(function (window) {
    "use strict";

    /* -----------------------------------------------------
       WORLD COUNTRY DATA
       ----------------------------------------------------- */

    const COUNTRY_DATA = [

        ["Afghanistan","AF","AFG","+93","🇦🇫"],
        ["Albania","AL","ALB","+355","🇦🇱"],
        ["Algeria","DZ","DZA","+213","🇩🇿"],
        ["Andorra","AD","AND","+376","🇦🇩"],
        ["Angola","AO","AGO","+244","🇦🇴"],
        ["Antigua and Barbuda","AG","ATG","+1","🇦🇬"],
        ["Argentina","AR","ARG","+54","🇦🇷"],
        ["Armenia","AM","ARM","+374","🇦🇲"],
        ["Australia","AU","AUS","+61","🇦🇺"],
        ["Austria","AT","AUT","+43","🇦🇹"],
        ["Azerbaijan","AZ","AZE","+994","🇦🇿"],

        ["Bahamas","BS","BHS","+1","🇧🇸"],
        ["Bahrain","BH","BHR","+973","🇧🇭"],
        ["Barbados","BB","BRB","+1","🇧🇧"],
        ["Belarus","BY","BLR","+375","🇧🇾"],
        ["Belgium","BE","BEL","+32","🇧🇪"],
        ["Belize","BZ","BLZ","+501","🇧🇿"],
        ["Benin","BJ","BEN","+229","🇧🇯"],
        ["Bhutan","BT","BTN","+975","🇧🇹"],
        ["Bolivia","BO","BOL","+591","🇧🇴"],
        ["Bosnia and Herzegovina","BA","BIH","+387","🇧🇦"],
        ["Botswana","BW","BWA","+267","🇧🇼"],
        ["Brazil","BR","BRA","+55","🇧🇷"],
        ["Brunei","BN","BRN","+673","🇧🇳"],
        ["Bulgaria","BG","BGR","+359","🇧🇬"],
        ["Burkina Faso","BF","BFA","+226","🇧🇫"],
        ["Burundi","BI","BDI","+257","🇧🇮"],

        ["Cabo Verde","CV","CPV","+238","🇨🇻"],
        ["Cambodia","KH","KHM","+855","🇰🇭"],
        ["Cameroon","CM","CMR","+237","🇨🇲"],
        ["Canada","CA","CAN","+1","🇨🇦"],
        ["Central African Republic","CF","CAF","+236","🇨🇫"],
        ["Chad","TD","TCD","+235","🇹🇩"],
        ["Chile","CL","CHL","+56","🇨🇱"],
        ["China","CN","CHN","+86","🇨🇳"],
        ["Colombia","CO","COL","+57","🇨🇴"],
        ["Comoros","KM","COM","+269","🇰🇲"],
        ["Congo","CG","COG","+242","🇨🇬"],
        ["Costa Rica","CR","CRI","+506","🇨🇷"],
        ["Croatia","HR","HRV","+385","🇭🇷"],
        ["Cuba","CU","CUB","+53","🇨🇺"],
        ["Cyprus","CY","CYP","+357","🇨🇾"],
        ["Czechia","CZ","CZE","+420","🇨🇿"],

        ["Democratic Republic of the Congo","CD","COD","+243","🇨🇩"],
        ["Denmark","DK","DNK","+45","🇩🇰"],
        ["Djibouti","DJ","DJI","+253","🇩🇯"],
        ["Dominica","DM","DMA","+1","🇩🇲"],
        ["Dominican Republic","DO","DOM","+1","🇩🇴"],

        ["Ecuador","EC","ECU","+593","🇪🇨"],
        ["Egypt","EG","EGY","+20","🇪🇬"],
        ["El Salvador","SV","SLV","+503","🇸🇻"],
        ["Equatorial Guinea","GQ","GNQ","+240","🇬🇶"],
        ["Eritrea","ER","ERI","+291","🇪🇷"],
        ["Estonia","EE","EST","+372","🇪🇪"],
        ["Eswatini","SZ","SWZ","+268","🇸🇿"],
        ["Ethiopia","ET","ETH","+251","🇪🇹"],

        ["Fiji","FJ","FJI","+679","🇫🇯"],
        ["Finland","FI","FIN","+358","🇫🇮"],
        ["France","FR","FRA","+33","🇫🇷"],

        ["Gabon","GA","GAB","+241","🇬🇦"],
        ["Gambia","GM","GMB","+220","🇬🇲"],
        ["Georgia","GE","GEO","+995","🇬🇪"],
        ["Germany","DE","DEU","+49","🇩🇪"],
        ["Ghana","GH","GHA","+233","🇬🇭"],
        ["Greece","GR","GRC","+30","🇬🇷"],
        ["Grenada","GD","GRD","+1","🇬🇩"],
        ["Guatemala","GT","GTM","+502","🇬🇹"],
        ["Guinea","GN","GIN","+224","🇬🇳"],
        ["Guinea-Bissau","GW","GNB","+245","🇬🇼"],
        ["Guyana","GY","GUY","+592","🇬🇾"],

        ["Haiti","HT","HTI","+509","🇭🇹"],
        ["Honduras","HN","HND","+504","🇭🇳"],
        ["Hungary","HU","HUN","+36","🇭🇺"],

        ["Iceland","IS","ISL","+354","🇮🇸"],
        ["India","IN","IND","+91","🇮🇳"],
        ["Indonesia","ID","IDN","+62","🇮🇩"],
        ["Iran","IR","IRN","+98","🇮🇷"],
        ["Iraq","IQ","IRQ","+964","🇮🇶"],
        ["Ireland","IE","IRL","+353","🇮🇪"],
        ["Israel","IL","ISR","+972","🇮🇱"],
        ["Italy","IT","ITA","+39","🇮🇹"],
        ["Ivory Coast","CI","CIV","+225","🇨🇮"],

        ["Jamaica","JM","JAM","+1","🇯🇲"],
        ["Japan","JP","JPN","+81","🇯🇵"],
        ["Jordan","JO","JOR","+962","🇯🇴"],

        ["Kazakhstan","KZ","KAZ","+7","🇰🇿"],
        ["Kenya","KE","KEN","+254","🇰🇪"],
        ["Kiribati","KI","KIR","+686","🇰🇮"],
        ["Kuwait","KW","KWT","+965","🇰🇼"],
        ["Kyrgyzstan","KG","KGZ","+996","🇰🇬"],

        ["Laos","LA","LAO","+856","🇱🇦"],
        ["Latvia","LV","LVA","+371","🇱🇻"],
        ["Lebanon","LB","LBN","+961","🇱🇧"],
        ["Lesotho","LS","LSO","+266","🇱🇸"],
        ["Liberia","LR","LBR","+231","🇱🇷"],
        ["Libya","LY","LBY","+218","🇱🇾"],
        ["Liechtenstein","LI","LIE","+423","🇱🇮"],
        ["Lithuania","LT","LTU","+370","🇱🇹"],
        ["Luxembourg","LU","LUX","+352","🇱🇺"],

        ["Madagascar","MG","MDG","+261","🇲🇬"],
        ["Malawi","MW","MWI","+265","🇲🇼"],
        ["Malaysia","MY","MYS","+60","🇲🇾"],
        ["Maldives","MV","MDV","+960","🇲🇻"],
        ["Mali","ML","MLI","+223","🇲🇱"],
        ["Malta","MT","MLT","+356","🇲🇹"],
        ["Marshall Islands","MH","MHL","+692","🇲🇭"],
        ["Mauritania","MR","MRT","+222","🇲🇷"],
        ["Mauritius","MU","MUS","+230","🇲🇺"],
        ["Mexico","MX","MEX","+52","🇲🇽"],
        ["Micronesia","FM","FSM","+691","🇫🇲"],
        ["Moldova","MD","MDA","+373","🇲🇩"],
        ["Monaco","MC","MCO","+377","🇲🇨"],
        ["Mongolia","MN","MNG","+976","🇲🇳"],
        ["Montenegro","ME","MNE","+382","🇲🇪"],
        ["Morocco","MA","MAR","+212","🇲🇦"],
        ["Mozambique","MZ","MOZ","+258","🇲🇿"],
        ["Myanmar","MM","MMR","+95","🇲🇲"],

        ["Namibia","NA","NAM","+264","🇳🇦"],
        ["Nauru","NR","NRU","+674","🇳🇷"],
        ["Nepal","NP","NPL","+977","🇳🇵"],
        ["Netherlands","NL","NLD","+31","🇳🇱"],
        ["New Zealand","NZ","NZL","+64","🇳🇿"],
        ["Nicaragua","NI","NIC","+505","🇳🇮"],
        ["Niger","NE","NER","+227","🇳🇪"],
        ["Nigeria","NG","NGA","+234","🇳🇬"],
        ["North Korea","KP","PRK","+850","🇰🇵"],
        ["North Macedonia","MK","MKD","+389","🇲🇰"],
        ["Norway","NO","NOR","+47","🇳🇴"],

        ["Oman","OM","OMN","+968","🇴🇲"],

        ["Palau","PW","PLW","+680","🇵🇼"],
        ["Palestine","PS","PSE","+970","🇵🇸"],
        ["Panama","PA","PAN","+507","🇵🇦"],
        ["Papua New Guinea","PG","PNG","+675","🇵🇬"],
        ["Paraguay","PY","PRY","+595","🇵🇾"],
        ["Peru","PE","PER","+51","🇵🇪"],
        ["Philippines","PH","PHL","+63","🇵🇭"],
        ["Poland","PL","POL","+48","🇵🇱"],
        ["Portugal","PT","PRT","+351","🇵🇹"],

        ["Qatar","QA","QAT","+974","🇶🇦"],

        ["Romania","RO","ROU","+40","🇷🇴"],
        ["Russia","RU","RUS","+7","🇷🇺"],
        ["Rwanda","RW","RWA","+250","🇷🇼"],

        ["Saint Kitts and Nevis","KN","KNA","+1","🇰🇳"],
        ["Saint Lucia","LC","LCA","+1","🇱🇨"],
        ["Saint Vincent and the Grenadines","VC","VCT","+1","🇻🇨"],
        ["Samoa","WS","WSM","+685","🇼🇸"],
        ["San Marino","SM","SMR","+378","🇸🇲"],
        ["Sao Tome and Principe","ST","STP","+239","🇸🇹"],
        ["Saudi Arabia","SA","SAU","+966","🇸🇦"],
        ["Senegal","SN","SEN","+221","🇸🇳"],
        ["Serbia","RS","SRB","+381","🇷🇸"],
        ["Seychelles","SC","SYC","+248","🇸🇨"],
        ["Sierra Leone","SL","SLE","+232","🇸🇱"],
        ["Singapore","SG","SGP","+65","🇸🇬"],
        ["Slovakia","SK","SVK","+421","🇸🇰"],
        ["Slovenia","SI","SVN","+386","🇸🇮"],
        ["Solomon Islands","SB","SLB","+677","🇸🇧"],
        ["Somalia","SO","SOM","+252","🇸🇴"],
        ["South Africa","ZA","ZAF","+27","🇿🇦"],
        ["South Korea","KR","KOR","+82","🇰🇷"],
        ["South Sudan","SS","SSD","+211","🇸🇸"],
        ["Spain","ES","ESP","+34","🇪🇸"],
        ["Sri Lanka","LK","LKA","+94","🇱🇰"],
        ["Sudan","SD","SDN","+249","🇸🇩"],
        ["Suriname","SR","SUR","+597","🇸🇷"],
        ["Sweden","SE","SWE","+46","🇸🇪"],
        ["Switzerland","CH","CHE","+41","🇨🇭"],
        ["Syria","SY","SYR","+963","🇸🇾"],

        ["Taiwan","TW","TWN","+886","🇹🇼"],
        ["Tajikistan","TJ","TJK","+992","🇹🇯"],
        ["Tanzania","TZ","TZA","+255","🇹🇿"],
        ["Thailand","TH","THA","+66","🇹🇭"],
        ["Timor-Leste","TL","TLS","+670","🇹🇱"],
        ["Togo","TG","TGO","+228","🇹🇬"],
        ["Tonga","TO","TON","+676","🇹🇴"],
        ["Trinidad and Tobago","TT","TTO","+1","🇹🇹"],
        ["Tunisia","TN","TUN","+216","🇹🇳"],
        ["Turkey","TR","TUR","+90","🇹🇷"],
        ["Turkmenistan","TM","TKM","+993","🇹🇲"],
        ["Tuvalu","TV","TUV","+688","🇹🇻"],

        ["Uganda","UG","UGA","+256","🇺🇬"],
        ["Ukraine","UA","UKR","+380","🇺🇦"],
        ["United Arab Emirates","AE","ARE","+971","🇦🇪"],
        ["United Kingdom","GB","GBR","+44","🇬🇧"],
        ["United States","US","USA","+1","🇺🇸"],
        ["Uruguay","UY","URY","+598","🇺🇾"],
        ["Uzbekistan","UZ","UZB","+998","🇺🇿"],

        ["Vanuatu","VU","VUT","+678","🇻🇺"],
        ["Vatican City","VA","VAT","+39","🇻🇦"],
        ["Venezuela","VE","VEN","+58","🇻🇪"],
        ["Vietnam","VN","VNM","+84","🇻🇳"],

        ["Yemen","YE","YEM","+967","🇾🇪"],

        ["Zambia","ZM","ZMB","+260","🇿🇲"],
        ["Zimbabwe","ZW","ZWE","+263","🇿🇼"]

    ];

    /* -----------------------------------------------------
       CONVERT ARRAY → OBJECT DATABASE
       ----------------------------------------------------- */

    const MARKETPLACE_COUNTRIES = COUNTRY_DATA.map(function (item) {

        return {
            name: item[0],
            country: item[0],
            slug: item[0]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
            flag: item[4],
            code2: item[1],
            code3: item[2],
            iso2: item[1],
            iso3: item[2],
            callingCode: item[3],
            phoneCode: item[3]
        };

    });

    /* -----------------------------------------------------
       GLOBAL EXPORTS
       ----------------------------------------------------- */

    window.MARKETPLACE_COUNTRIES = MARKETPLACE_COUNTRIES;

    /* Compatibility names used by older ALON files */

    window.ALON_WORLD_COUNTRIES = MARKETPLACE_COUNTRIES;
    window.WORLD_COUNTRIES = MARKETPLACE_COUNTRIES;

    /* -----------------------------------------------------
       FIND COUNTRY
       ----------------------------------------------------- */

    window.ALON_FIND_COUNTRY = function (value) {

        if (!value) return null;

        const search = String(value)
            .trim()
            .toLowerCase();

        return MARKETPLACE_COUNTRIES.find(function (country) {

            return (
                country.name.toLowerCase() === search ||
                country.country.toLowerCase() === search ||
                country.code2.toLowerCase() === search ||
                country.code3.toLowerCase() === search ||
                country.slug.toLowerCase() === search ||
                country.callingCode === search ||
                country.phoneCode === search
            );

        }) || null;
    };

    /* -----------------------------------------------------
       COUNTRY LABEL
       ----------------------------------------------------- */

    window.ALON_COUNTRY_LABEL = function (country) {

        if (!country) return "";

        return (
            country.flag +
            " " +
            country.name +
            " (" +
            country.code2 +
            " • " +
            country.code3 +
            ") " +
            country.callingCode
        );
    };

    /* -----------------------------------------------------
       POPULATE COUNTRY SELECT
       ----------------------------------------------------- */

    window.ALON_FILL_COUNTRY_SELECT = function (
        selector,
        selectedValue
    ) {

        const select =
            typeof selector === "string"
                ? document.querySelector(selector)
                : selector;

        if (!select) return false;

        const oldValue =
            selectedValue !== undefined &&
            selectedValue !== null
                ? String(selectedValue)
                : String(select.value || "");

        select.innerHTML = "";

        const placeholder =
            document.createElement("option");

        placeholder.value = "";
        placeholder.textContent =
            "🌍 Select Country";

        select.appendChild(placeholder);

        MARKETPLACE_COUNTRIES.forEach(function (country) {

            const option =
                document.createElement("option");

            option.value = country.code2;

            option.textContent =
                country.flag +
                " " +
                country.name +
                " (" +
                country.code2 +
                " • " +
                country.code3 +
                ") " +
                country.callingCode;

            option.dataset.country =
                country.name;

            option.dataset.code2 =
                country.code2;

            option.dataset.code3 =
                country.code3;

            option.dataset.callingCode =
                country.callingCode;

            option.dataset.flag =
                country.flag;

            select.appendChild(option);

        });

        /* -------------------------------------------------
           Restore old saved country values
           ------------------------------------------------- */

        if (oldValue) {

            const found =
                window.ALON_FIND_COUNTRY(oldValue);

            if (found) {
                select.value = found.code2;
            }

        }

        return true;
    };

    /* -----------------------------------------------------
       AUTO INITIALIZE REGULAR MARKETPLACE
       ----------------------------------------------------- */

    function initRegularMarketplaceCountries() {

        const listingCountry =
            document.getElementById("rmCountry");

        const showroomCountry =
            document.getElementById("rmShowroomCountry");

        if (listingCountry) {

            window.ALON_FILL_COUNTRY_SELECT(
                listingCountry
            );

        }

        if (showroomCountry) {

            window.ALON_FILL_COUNTRY_SELECT(
                showroomCountry
            );

        }
    }

    /* -----------------------------------------------------
       DOM READY
       ----------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initRegularMarketplaceCountries
        );

    } else {

        initRegularMarketplaceCountries();

    }

    /* -----------------------------------------------------
       ALSO RETRY ON LOAD
       ----------------------------------------------------- */

    window.addEventListener(
        "load",
        initRegularMarketplaceCountries
    );

    /* -----------------------------------------------------
       DATABASE VERSION
       ----------------------------------------------------- */

    window.MARKETPLACE_COUNTRIES_VERSION =
        "24.5 SAFE CENTRAL WORLD";

})(window);