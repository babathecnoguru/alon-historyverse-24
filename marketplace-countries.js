/* =========================================================
   ALON HISTORYVERSE 24
   GLOBAL MARKETPLACE + JOBS
   WORLD COUNTRY DATABASE
   ---------------------------------------------------------
   Version: 24.2 SAFE GLOBAL
   Creator: Baba Thecno Guru

   FEATURES
   • Global country database
   • ISO / country code
   • Flag
   • Country name
   • Calling code
   • Jobs compatibility
   • Marketplace compatibility
   • Duplicate protection
   • Alphabetical sorting
   • Safe multiple-script loading
   • Public global API
   ========================================================= */

"use strict";


/* =========================================================
   SAFE GLOBAL DATABASE
   ---------------------------------------------------------
   IMPORTANT:
   Do NOT use:
       const MARKETPLACE_COUNTRIES = ...

   because this file may be loaded more than once.

   We use window so repeated loading does not create a
   top-level const/let redeclaration error.
   ========================================================= */

(function () {

    /* =====================================================
       ORIGINAL COUNTRY DATA
       ===================================================== */

    var COUNTRY_DATA = [

        { code:"AF", flag:"🇦🇫", name:"Afghanistan", callingCode:"+93" },
        { code:"AL", flag:"🇦🇱", name:"Albania", callingCode:"+355" },
        { code:"DZ", flag:"🇩🇿", name:"Algeria", callingCode:"+213" },
        { code:"AD", flag:"🇦🇩", name:"Andorra", callingCode:"+376" },
        { code:"AO", flag:"🇦🇴", name:"Angola", callingCode:"+244" },
        { code:"AG", flag:"🇦🇬", name:"Antigua and Barbuda", callingCode:"+1-268" },
        { code:"AR", flag:"🇦🇷", name:"Argentina", callingCode:"+54" },
        { code:"AM", flag:"🇦🇲", name:"Armenia", callingCode:"+374" },
        { code:"AU", flag:"🇦🇺", name:"Australia", callingCode:"+61" },
        { code:"AT", flag:"🇦🇹", name:"Austria", callingCode:"+43" },
        { code:"AZ", flag:"🇦🇿", name:"Azerbaijan", callingCode:"+994" },

        { code:"BS", flag:"🇧🇸", name:"Bahamas", callingCode:"+1-242" },
        { code:"BH", flag:"🇧🇭", name:"Bahrain", callingCode:"+973" },
        { code:"BD", flag:"🇧🇩", name:"Bangladesh", callingCode:"+880" },
        { code:"BB", flag:"🇧🇧", name:"Barbados", callingCode:"+1-246" },
        { code:"BY", flag:"🇧🇾", name:"Belarus", callingCode:"+375" },
        { code:"BE", flag:"🇧🇪", name:"Belgium", callingCode:"+32" },
        { code:"BZ", flag:"🇧🇿", name:"Belize", callingCode:"+501" },
        { code:"BJ", flag:"🇧🇯", name:"Benin", callingCode:"+229" },
        { code:"BT", flag:"🇧🇹", name:"Bhutan", callingCode:"+975" },
        { code:"BO", flag:"🇧🇴", name:"Bolivia", callingCode:"+591" },
        { code:"BA", flag:"🇧🇦", name:"Bosnia and Herzegovina", callingCode:"+387" },
        { code:"BW", flag:"🇧🇼", name:"Botswana", callingCode:"+267" },
        { code:"BR", flag:"🇧🇷", name:"Brazil", callingCode:"+55" },
        { code:"BN", flag:"🇧🇳", name:"Brunei", callingCode:"+673" },
        { code:"BG", flag:"🇧🇬", name:"Bulgaria", callingCode:"+359" },
        { code:"BF", flag:"🇧🇫", name:"Burkina Faso", callingCode:"+226" },
        { code:"BI", flag:"🇧🇮", name:"Burundi", callingCode:"+257" },

        { code:"CV", flag:"🇨🇻", name:"Cabo Verde", callingCode:"+238" },
        { code:"KH", flag:"🇰🇭", name:"Cambodia", callingCode:"+855" },
        { code:"CM", flag:"🇨🇲", name:"Cameroon", callingCode:"+237" },
        { code:"CA", flag:"🇨🇦", name:"Canada", callingCode:"+1" },
        { code:"CF", flag:"🇨🇫", name:"Central African Republic", callingCode:"+236" },
        { code:"TD", flag:"🇹🇩", name:"Chad", callingCode:"+235" },
        { code:"CL", flag:"🇨🇱", name:"Chile", callingCode:"+56" },
        { code:"CN", flag:"🇨🇳", name:"China", callingCode:"+86" },
        { code:"CO", flag:"🇨🇴", name:"Colombia", callingCode:"+57" },
        { code:"KM", flag:"🇰🇲", name:"Comoros", callingCode:"+269" },
        { code:"CG", flag:"🇨🇬", name:"Republic of the Congo", callingCode:"+242" },
        { code:"CD", flag:"🇨🇩", name:"Democratic Republic of the Congo", callingCode:"+243" },
        { code:"CR", flag:"🇨🇷", name:"Costa Rica", callingCode:"+506" },
        { code:"CI", flag:"🇨🇮", name:"Côte d'Ivoire", callingCode:"+225" },
        { code:"HR", flag:"🇭🇷", name:"Croatia", callingCode:"+385" },
        { code:"CU", flag:"🇨🇺", name:"Cuba", callingCode:"+53" },
        { code:"CY", flag:"🇨🇾", name:"Cyprus", callingCode:"+357" },
        { code:"CZ", flag:"🇨🇿", name:"Czechia", callingCode:"+420" },

        { code:"DK", flag:"🇩🇰", name:"Denmark", callingCode:"+45" },
        { code:"DJ", flag:"🇩🇯", name:"Djibouti", callingCode:"+253" },
        { code:"DM", flag:"🇩🇲", name:"Dominica", callingCode:"+1-767" },
        { code:"DO", flag:"🇩🇴", name:"Dominican Republic", callingCode:"+1-809 / +1-829 / +1-849" },

        { code:"EC", flag:"🇪🇨", name:"Ecuador", callingCode:"+593" },
        { code:"EG", flag:"🇪🇬", name:"Egypt", callingCode:"+20" },
        { code:"SV", flag:"🇸🇻", name:"El Salvador", callingCode:"+503" },
        { code:"GQ", flag:"🇬🇶", name:"Equatorial Guinea", callingCode:"+240" },
        { code:"ER", flag:"🇪🇷", name:"Eritrea", callingCode:"+291" },
        { code:"EE", flag:"🇪🇪", name:"Estonia", callingCode:"+372" },
        { code:"SZ", flag:"🇸🇿", name:"Eswatini", callingCode:"+268" },
        { code:"ET", flag:"🇪🇹", name:"Ethiopia", callingCode:"+251" },

        { code:"FJ", flag:"🇫🇯", name:"Fiji", callingCode:"+679" },
        { code:"FI", flag:"🇫🇮", name:"Finland", callingCode:"+358" },
        { code:"FR", flag:"🇫🇷", name:"France", callingCode:"+33" },

        { code:"GA", flag:"🇬🇦", name:"Gabon", callingCode:"+241" },
        { code:"GM", flag:"🇬🇲", name:"Gambia", callingCode:"+220" },
        { code:"GE", flag:"🇬🇪", name:"Georgia", callingCode:"+995" },
        { code:"DE", flag:"🇩🇪", name:"Germany", callingCode:"+49" },
        { code:"GH", flag:"🇬🇭", name:"Ghana", callingCode:"+233" },
        { code:"GR", flag:"🇬🇷", name:"Greece", callingCode:"+30" },
        { code:"GD", flag:"🇬🇩", name:"Grenada", callingCode:"+1-473" },
        { code:"GT", flag:"🇬🇹", name:"Guatemala", callingCode:"+502" },
        { code:"GN", flag:"🇬🇳", name:"Guinea", callingCode:"+224" },
        { code:"GW", flag:"🇬🇼", name:"Guinea-Bissau", callingCode:"+245" },
        { code:"GY", flag:"🇬🇾", name:"Guyana", callingCode:"+592" },

        { code:"HT", flag:"🇭🇹", name:"Haiti", callingCode:"+509" },
        { code:"HN", flag:"🇭🇳", name:"Honduras", callingCode:"+504" },
        { code:"HU", flag:"🇭🇺", name:"Hungary", callingCode:"+36" },

        { code:"IS", flag:"🇮🇸", name:"Iceland", callingCode:"+354" },
        { code:"IN", flag:"🇮🇳", name:"India", callingCode:"+91" },
        { code:"ID", flag:"🇮🇩", name:"Indonesia", callingCode:"+62" },
        { code:"IR", flag:"🇮🇷", name:"Iran", callingCode:"+98" },
        { code:"IQ", flag:"🇮🇶", name:"Iraq", callingCode:"+964" },
        { code:"IE", flag:"🇮🇪", name:"Ireland", callingCode:"+353" },
        { code:"IL", flag:"🇮🇱", name:"Israel", callingCode:"+972" },
        { code:"IT", flag:"🇮🇹", name:"Italy", callingCode:"+39" },

        { code:"JM", flag:"🇯🇲", name:"Jamaica", callingCode:"+1-876" },
        { code:"JP", flag:"🇯🇵", name:"Japan", callingCode:"+81" },
        { code:"JO", flag:"🇯🇴", name:"Jordan", callingCode:"+962" },

        { code:"KZ", flag:"🇰🇿", name:"Kazakhstan", callingCode:"+7" },
        { code:"KE", flag:"🇰🇪", name:"Kenya", callingCode:"+254" },
        { code:"KI", flag:"🇰🇮", name:"Kiribati", callingCode:"+686" },
        { code:"KP", flag:"🇰🇵", name:"North Korea", callingCode:"+850" },
        { code:"KR", flag:"🇰🇷", name:"South Korea", callingCode:"+82" },
        { code:"KW", flag:"🇰🇼", name:"Kuwait", callingCode:"+965" },
        { code:"KG", flag:"🇰🇬", name:"Kyrgyzstan", callingCode:"+996" },

        { code:"LA", flag:"🇱🇦", name:"Laos", callingCode:"+856" },
        { code:"LV", flag:"🇱🇻", name:"Latvia", callingCode:"+371" },
        { code:"LB", flag:"🇱🇧", name:"Lebanon", callingCode:"+961" },
        { code:"LS", flag:"🇱🇸", name:"Lesotho", callingCode:"+266" },
        { code:"LR", flag:"🇱🇷", name:"Liberia", callingCode:"+231" },
        { code:"LY", flag:"🇱🇾", name:"Libya", callingCode:"+218" },
        { code:"LI", flag:"🇱🇮", name:"Liechtenstein", callingCode:"+423" },
        { code:"LT", flag:"🇱🇹", name:"Lithuania", callingCode:"+370" },
        { code:"LU", flag:"🇱🇺", name:"Luxembourg", callingCode:"+352" },

        { code:"MG", flag:"🇲🇬", name:"Madagascar", callingCode:"+261" },
        { code:"MW", flag:"🇲🇼", name:"Malawi", callingCode:"+265" },
        { code:"MY", flag:"🇲🇾", name:"Malaysia", callingCode:"+60" },
        { code:"MV", flag:"🇲🇻", name:"Maldives", callingCode:"+960" },
        { code:"ML", flag:"🇲🇱", name:"Mali", callingCode:"+223" },
        { code:"MT", flag:"🇲🇹", name:"Malta", callingCode:"+356" },
        { code:"MH", flag:"🇲🇭", name:"Marshall Islands", callingCode:"+692" },
        { code:"MR", flag:"🇲🇷", name:"Mauritania", callingCode:"+222" },
        { code:"MU", flag:"🇲🇺", name:"Mauritius", callingCode:"+230" },
        { code:"MX", flag:"🇲🇽", name:"Mexico", callingCode:"+52" },
        { code:"FM", flag:"🇫🇲", name:"Micronesia", callingCode:"+691" },
        { code:"MD", flag:"🇲🇩", name:"Moldova", callingCode:"+373" },
        { code:"MC", flag:"🇲🇨", name:"Monaco", callingCode:"+377" },
        { code:"MN", flag:"🇲🇳", name:"Mongolia", callingCode:"+976" },
        { code:"ME", flag:"🇲🇪", name:"Montenegro", callingCode:"+382" },
        { code:"MA", flag:"🇲🇦", name:"Morocco", callingCode:"+212" },
        { code:"MZ", flag:"🇲🇿", name:"Mozambique", callingCode:"+258" },
        { code:"MM", flag:"🇲🇲", name:"Myanmar", callingCode:"+95" },

        { code:"NA", flag:"🇳🇦", name:"Namibia", callingCode:"+264" },
        { code:"NR", flag:"🇳🇷", name:"Nauru", callingCode:"+674" },
        { code:"NP", flag:"🇳🇵", name:"Nepal", callingCode:"+977" },
        { code:"NL", flag:"🇳🇱", name:"Netherlands", callingCode:"+31" },
        { code:"NZ", flag:"🇳🇿", name:"New Zealand", callingCode:"+64" },
        { code:"NI", flag:"🇳🇮", name:"Nicaragua", callingCode:"+505" },
        { code:"NE", flag:"🇳🇪", name:"Niger", callingCode:"+227" },
        { code:"NG", flag:"🇳🇬", name:"Nigeria", callingCode:"+234" },
        { code:"MK", flag:"🇲🇰", name:"North Macedonia", callingCode:"+389" },
        { code:"NO", flag:"🇳🇴", name:"Norway", callingCode:"+47" },

        { code:"OM", flag:"🇴🇲", name:"Oman", callingCode:"+968" },

        { code:"PK", flag:"🇵🇰", name:"Pakistan", callingingCode:"+92", callingCode:"+92" },
        { code:"PW", flag:"🇵🇼", name:"Palau", callingCode:"+680" },
        { code:"PA", flag:"🇵🇦", name:"Panama", callingCode:"+507" },
        { code:"PG", flag:"🇵🇬", name:"Papua New Guinea", callingCode:"+675" },
        { code:"PY", flag:"🇵🇾", name:"Paraguay", callingCode:"+595" },
        { code:"PE", flag:"🇵🇪", name:"Peru", callingCode:"+51" },
        { code:"PH", flag:"🇵🇭", name:"Philippines", callingCode:"+63" },
        { code:"PL", flag:"🇵🇱", name:"Poland", callingCode:"+48" },
        { code:"PT", flag:"🇵🇹", name:"Portugal", callingCode:"+351" },
        { code:"PS", flag:"🇵🇸", name:"Palestine", callingCode:"+970" },

        { code:"QA", flag:"🇶🇦", name:"Qatar", callingCode:"+974" },

        { code:"RO", flag:"🇷🇴", name:"Romania", callingCode:"+40" },
        { code:"RU", flag:"🇷🇺", name:"Russia", callingCode:"+7" },
        { code:"RW", flag:"🇷🇼", name:"Rwanda", callingCode:"+250" },

        { code:"KN", flag:"🇰🇳", name:"Saint Kitts and Nevis", callingCode:"+1-869" },
        { code:"LC", flag:"🇱🇨", name:"Saint Lucia", callingCode:"+1-758" },
        { code:"VC", flag:"🇻🇨", name:"Saint Vincent and the Grenadines", callingCode:"+1-784" },
        { code:"WS", flag:"🇼🇸", name:"Samoa", callingCode:"+685" },
        { code:"SM", flag:"🇸🇲", name:"San Marino", callingCode:"+378" },
        { code:"ST", flag:"🇸🇹", name:"São Tomé and Príncipe", callingCode:"+239" },
        { code:"SA", flag:"🇸🇦", name:"Saudi Arabia", callingCode:"+966" },
        { code:"SN", flag:"🇸🇳", name:"Senegal", callingCode:"+221" },
        { code:"RS", flag:"🇷🇸", name:"Serbia", callingCode:"+381" },
        { code:"SC", flag:"🇸🇨", name:"Seychelles", callingCode:"+248" },
        { code:"SL", flag:"🇸🇱", name:"Sierra Leone", callingCode:"+232" },
        { code:"SG", flag:"🇸🇬", name:"Singapore", callingCode:"+65" },
        { code:"SK", flag:"🇸🇰", name:"Slovakia", callingCode:"+421" },
        { code:"SI", flag:"🇸🇮", name:"Slovenia", callingCode:"+386" },
        { code:"SB", flag:"🇸🇧", name:"Solomon Islands", callingCode:"+677" },
        { code:"SO", flag:"🇸🇴", name:"Somalia", callingCode:"+252" },
        { code:"ZA", flag:"🇿🇦", name:"South Africa", callingCode:"+27" },
        { code:"SS", flag:"🇸🇸", name:"South Sudan", callingCode:"+211" },
        { code:"ES", flag:"🇪🇸", name:"Spain", callingCode:"+34" },
        { code:"LK", flag:"🇱🇰", name:"Sri Lanka", callingCode:"+94" },
        { code:"SD", flag:"🇸🇩", name:"Sudan", callingCode:"+249" },
        { code:"SR", flag:"🇸🇷", name:"Suriname", callingCode:"+597" },
        { code:"SE", flag:"🇸🇪", name:"Sweden", callingCode:"+46" },
        { code:"CH", flag:"🇨🇭", name:"Switzerland", callingCode:"+41" },
        { code:"SY", flag:"🇸🇾", name:"Syria", callingCode:"+963" },

        { code:"TW", flag:"🇹🇼", name:"Taiwan", callingCode:"+886" },
        { code:"TJ", flag:"🇹🇯", name:"Tajikistan", callingCode:"+992" },
        { code:"TZ", flag:"🇹🇿", name:"Tanzania", callingCode:"+255" },
        { code:"TH", flag:"🇹🇭", name:"Thailand", callingCode:"+66" },
        { code:"TL", flag:"🇹🇱", name:"Timor-Leste", callingCode:"+670" },
        { code:"TG", flag:"🇹🇬", name:"Togo", callingCode:"+228" },
        { code:"TO", flag:"🇹🇴", name:"Tonga", callingCode:"+676" },
        { code:"TT", flag:"🇹🇹", name:"Trinidad and Tobago", callingCode:"+1-868" },
        { code:"TN", flag:"🇹🇳", name:"Tunisia", callingCode:"+216" },
        { code:"TR", flag:"🇹🇷", name:"Türkiye", callingCode:"+90" },
        { code:"TM", flag:"🇹🇲", name:"Turkmenistan", callingCode:"+993" },
        { code:"TV", flag:"🇹🇻", name:"Tuvalu", callingCode:"+688" },

        { code:"UG", flag:"🇺🇬", name:"Uganda", callingCode:"+256" },
        { code:"UA", flag:"🇺🇦", name:"Ukraine", callingCode:"+380" },
        { code:"AE", flag:"🇦🇪", name:"United Arab Emirates", callingCode:"+971" },
        { code:"GB", flag:"🇬🇧", name:"United Kingdom", callingCode:"+44" },
        { code:"US", flag:"🇺🇸", name:"United States", callingCode:"+1" },
        { code:"UY", flag:"🇺🇾", name:"Uruguay", callingCode:"+598" },
        { code:"UZ", flag:"🇺🇿", name:"Uzbekistan", callingCode:"+998" },

        { code:"VU", flag:"🇻🇺", name:"Vanuatu", callingCode:"+678" },
        { code:"VA", flag:"🇻🇦", name:"Vatican City", callingCode:"+39" },
        { code:"VE", flag:"🇻🇪", name:"Venezuela", callingCode:"+58" },
        { code:"VN", flag:"🇻🇳", name:"Vietnam", callingCode:"+84" },

        { code:"XK", flag:"🇽🇰", name:"Kosovo", callingCode:"+383" },

        { code:"YE", flag:"🇾🇪", name:"Yemen", callingCode:"+967" },
        { code:"ZM", flag:"🇿🇲", name:"Zambia", callingCode:"+260" },
        { code:"ZW", flag:"🇿🇼", name:"Zimbabwe", callingCode:"+263" }

    ];


    /* =====================================================
       NORMALIZE + DUPLICATE PROTECTION
       ===================================================== */

    var countryMap = new Map();


    COUNTRY_DATA.forEach(function (country) {

        if (!country || typeof country !== "object") {
            return;
        }


        var code =
            String(country.code || "")
                .trim()
                .toUpperCase();


        var name =
            String(country.name || "")
                .trim();


        if (!code || !name) {
            return;
        }


        /* -----------------------------------------------
           Normalize main fields
           ----------------------------------------------- */

        country.code = code;
        country.iso = code;
        country.isoCode = code;
        country.countryCode = code;
        country.cca2 = code;

        country.name = name;
        country.countryName = name;

        country.flag =
            String(country.flag || "").trim();

        country.flagEmoji =
            country.flag;

        country.callingCode =
            String(country.callingCode || "").trim();

        country.dialCode =
            country.callingCode;

        country.phoneCode =
            country.callingCode;


        /* -----------------------------------------------
           Duplicate protection
           ----------------------------------------------- */

        if (!countryMap.has(code)) {

            countryMap.set(
                code,
                country
            );

        }

    });


    /* =====================================================
       CLEAN COUNTRY LIST
       ===================================================== */

    var cleanCountries =
        Array.from(
            countryMap.values()
        );


    /* =====================================================
       ALPHABETICAL SORT
       ===================================================== */

    cleanCountries.sort(function (a, b) {

        return String(a.name || "")
            .localeCompare(
                String(b.name || ""),
                undefined,
                {
                    sensitivity: "base"
                }
            );

    });


    /* =====================================================
       PUBLIC GLOBAL DATABASE
       ===================================================== */

    window.MARKETPLACE_COUNTRIES =
        cleanCountries;


    /* =====================================================
       PUBLIC COUNTRY LIST ALIAS
       ===================================================== */

    window.MARKETPLACE_COUNTRY_LIST =
        cleanCountries;


    /* =====================================================
       FIND COUNTRY BY ISO CODE
       ===================================================== */

    function marketplaceCountryByCode(code) {

        var target =
            String(code || "")
                .trim()
                .toUpperCase();


        if (!target) {
            return null;
        }


        return (
            cleanCountries.find(
                function (country) {

                    return (
                        country.code ===
                        target
                    );

                }
            ) || null
        );

    }


    /* =====================================================
       FIND COUNTRY BY COUNTRY NAME
       ===================================================== */

    function marketplaceCountryByName(name) {

        var target =
            String(name || "")
                .trim()
                .toLowerCase();


        if (!target) {
            return null;
        }


        return (
            cleanCountries.find(
                function (country) {

                    return (
                        String(
                            country.name || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        target
                    );

                }
            ) || null
        );

    }


    /* =====================================================
       FIND COUNTRY BY CALLING CODE
       -----------------------------------------------------
       IMPORTANT:
       Calling codes such as +1 and +7 are shared by
       multiple countries. Therefore this function returns
       the first exact database match only.

       Use ISO code for saved country identity.
       ===================================================== */

    function marketplaceCountryByCallingCode(
        callingCode
    ) {

        var target =
            String(callingCode || "")
                .trim();


        if (!target) {
            return null;
        }


        return (
            cleanCountries.find(
                function (country) {

                    return (
                        country.callingCode ===
                        target
                    );

                }
            ) || null
        );

    }


    /* =====================================================
       GET ALL COUNTRIES
       -----------------------------------------------------
       Return a copy of the array so external code cannot
       accidentally replace the central array itself.
       Country objects are kept compatible with existing
       Jobs / Marketplace code.
       ===================================================== */

    function getAllCountries() {

        return cleanCountries.slice();

    }


    /* =====================================================
       COUNTRY COUNT
       ===================================================== */

    function getCountryCount() {

        return cleanCountries.length;

    }


    /* =====================================================
       POPULATE SELECT ELEMENT
       -----------------------------------------------------
       Can be used by Jobs and Marketplace.

       Option value:
           ISO country code

       Option text:
           Flag + Country + Calling Code
       ===================================================== */

    function populateCountrySelect(
        selectElement,
        options
    ) {

        if (!selectElement) {
            return false;
        }


        options =
            options || {};


        var placeholder =
            options.placeholder ||
            "Select Country";


        var includeCallingCode =
            options.includeCallingCode !== false;


        var includeFlag =
            options.includeFlag !== false;


        var currentValue =
            String(
                selectElement.value || ""
            );


        /* -----------------------------------------------
           Clear existing options
           ----------------------------------------------- */

        selectElement.innerHTML = "";


        /* -----------------------------------------------
           Placeholder
           ----------------------------------------------- */

        var placeholderOption =
            document.createElement("option");


        placeholderOption.value = "";

        placeholderOption.textContent =
            placeholder;


        placeholderOption.disabled =
            false;


        placeholderOption.selected =
            !currentValue;


        selectElement.appendChild(
            placeholderOption
        );


        /* -----------------------------------------------
           Country options
           ----------------------------------------------- */

        cleanCountries.forEach(
            function (country) {

                var option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    country.code;


                var text = "";


                if (includeFlag) {

                    text +=
                        country.flag +
                        " ";

                }


                text +=
                    country.name;


                if (includeCallingCode) {

                    text +=
                        " (" +
                        country.callingCode +
                        ")";

                }


                option.textContent =
                    text;


                /* ---------------------------------------
                   Dataset compatibility
                   --------------------------------------- */

                option.dataset.code =
                    country.code;

                option.dataset.iso =
                    country.iso;

                option.dataset.countryCode =
                    country.countryCode;

                option.dataset.name =
                    country.name;

                option.dataset.countryName =
                    country.countryName;

                option.dataset.callingCode =
                    country.callingCode;

                option.dataset.dialCode =
                    country.dialCode;

                option.dataset.phoneCode =
                    country.phoneCode;

                option.dataset.flag =
                    country.flag;


                selectElement.appendChild(
                    option
                );

            }
        );


        /* -----------------------------------------------
           Restore previous ISO value
           ----------------------------------------------- */

        if (currentValue) {

            var matchingOption =
                Array.prototype.find.call(
                    selectElement.options,
                    function (option) {

                        return (
                            option.value ===
                            currentValue
                        );

                    }
                );


            if (matchingOption) {

                selectElement.value =
                    currentValue;

            } else {

                selectElement.value =
                    "";

            }

        } else {

            selectElement.value =
                "";

        }


        return true;

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ALON_MARKETPLACE_COUNTRIES = {

        all:
            getAllCountries,

        get:
            marketplaceCountryByCode,

        findByName:
            marketplaceCountryByName,

        findByCallingCode:
            marketplaceCountryByCallingCode,

        populateSelect:
            populateCountrySelect,

        count:
            getCountryCount

    };


    /* =====================================================
       BACKWARD COMPATIBILITY
       ===================================================== */

    window.marketplaceCountryByCode =
        marketplaceCountryByCode;


    window.marketplaceCountryByName =
        marketplaceCountryByName;


    window.marketplaceCountryByCallingCode =
        marketplaceCountryByCallingCode;


    window.populateMarketplaceCountries =
        populateCountrySelect;


    /* =====================================================
       READY FLAG
       ===================================================== */

    window.ALON_MARKETPLACE_COUNTRIES_READY =
        true;


    /* =====================================================
       DATABASE VERSION
       ===================================================== */

    window.ALON_MARKETPLACE_COUNTRIES_VERSION =
        "24.2";


    /* =====================================================
       DEBUG INFORMATION
       ===================================================== */

    console.log(
        "ALON HISTORYVERSE 24 Country Database loaded:",
        cleanCountries.length,
        "countries"
    );


})();