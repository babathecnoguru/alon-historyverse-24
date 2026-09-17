/* =========================================================
   ALON HISTORYVERSE 24
   MARKETPLACE COUNTRIES DATABASE
   ---------------------------------------------------------
   Version: 24.2
   Creator: Baba Thecno Guru

   PURPOSE
   • Global country database
   • Used by Marketplace
   • Used by Jobs & Careers
   • ISO Alpha-2 code
   • Country name
   • Flag
   • International calling code
   • Global safe access
   ========================================================= */

(function () {
    "use strict";

    const MARKETPLACE_COUNTRIES = [

        { name: "Afghanistan", code: "AF", flag: "🇦🇫", callingCode: "+93" },
        { name: "Albania", code: "AL", flag: "🇦🇱", callingCode: "+355" },
        { name: "Algeria", code: "DZ", flag: "🇩🇿", callingCode: "+213" },
        { name: "Andorra", code: "AD", flag: "🇦🇩", callingCode: "+376" },
        { name: "Angola", code: "AO", flag: "🇦🇴", callingCode: "+244" },
        { name: "Antigua and Barbuda", code: "AG", flag: "🇦🇬", callingCode: "+1-268" },
        { name: "Argentina", code: "AR", flag: "🇦🇷", callingCode: "+54" },
        { name: "Armenia", code: "AM", flag: "🇦🇲", callingCode: "+374" },
        { name: "Australia", code: "AU", flag: "🇦🇺", callingCode: "+61" },
        { name: "Austria", code: "AT", flag: "🇦🇹", callingCode: "+43" },
        { name: "Azerbaijan", code: "AZ", flag: "🇦🇿", callingCode: "+994" },

        { name: "Bahamas", code: "BS", flag: "🇧🇸", callingCode: "+1-242" },
        { name: "Bahrain", code: "BH", flag: "🇧🇭", callingCode: "+973" },
        { name: "Bangladesh", code: "BD", flag: "🇧🇩", callingCode: "+880" },
        { name: "Barbados", code: "BB", flag: "🇧🇧", callingCode: "+1-246" },
        { name: "Belarus", code: "BY", flag: "🇧🇾", callingCode: "+375" },
        { name: "Belgium", code: "BE", flag: "🇧🇪", callingCode: "+32" },
        { name: "Belize", code: "BZ", flag: "🇧🇿", callingCode: "+501" },
        { name: "Benin", code: "BJ", flag: "🇧🇯", callingCode: "+229" },
        { name: "Bhutan", code: "BT", flag: "🇧🇹", callingCode: "+975" },
        { name: "Bolivia", code: "BO", flag: "🇧🇴", callingCode: "+591" },
        { name: "Bosnia and Herzegovina", code: "BA", flag: "🇧🇦", callingCode: "+387" },
        { name: "Botswana", code: "BW", flag: "🇧🇼", callingCode: "+267" },
        { name: "Brazil", code: "BR", flag: "🇧🇷", callingCode: "+55" },
        { name: "Brunei", code: "BN", flag: "🇧🇳", callingCode: "+673" },
        { name: "Bulgaria", code: "BG", flag: "🇧🇬", callingCode: "+359" },
        { name: "Burkina Faso", code: "BF", flag: "🇧🇫", callingCode: "+226" },
        { name: "Burundi", code: "BI", flag: "🇧🇮", callingCode: "+257" },

        { name: "Cabo Verde", code: "CV", flag: "🇨🇻", callingCode: "+238" },
        { name: "Cambodia", code: "KH", flag: "🇰🇭", callingCode: "+855" },
        { name: "Cameroon", code: "CM", flag: "🇨🇲", callingCode: "+237" },
        { name: "Canada", code: "CA", flag: "🇨🇦", callingCode: "+1" },
        { name: "Central African Republic", code: "CF", flag: "🇨🇫", callingCode: "+236" },
        { name: "Chad", code: "TD", flag: "🇹🇩", callingCode: "+235" },
        { name: "Chile", code: "CL", flag: "🇨🇱", callingCode: "+56" },
        { name: "China", code: "CN", flag: "🇨🇳", callingCode: "+86" },
        { name: "Colombia", code: "CO", flag: "🇨🇴", callingCode: "+57" },
        { name: "Comoros", code: "KM", flag: "🇰🇲", callingCode: "+269" },
        { name: "Congo", code: "CG", flag: "🇨🇬", callingCode: "+242" },
        { name: "Costa Rica", code: "CR", flag: "🇨🇷", callingCode: "+506" },
        { name: "Croatia", code: "HR", flag: "🇭🇷", callingCode: "+385" },
        { name: "Cuba", code: "CU", flag: "🇨🇺", callingCode: "+53" },
        { name: "Cyprus", code: "CY", flag: "🇨🇾", callingCode: "+357" },
        { name: "Czech Republic", code: "CZ", flag: "🇨🇿", callingCode: "+420" },

        { name: "Denmark", code: "DK", flag: "🇩🇰", callingCode: "+45" },
        { name: "Djibouti", code: "DJ", flag: "🇩🇯", callingCode: "+253" },
        { name: "Dominica", code: "DM", flag: "🇩🇲", callingCode: "+1-767" },
        { name: "Dominican Republic", code: "DO", flag: "🇩🇴", callingCode: "+1-809" },

        { name: "Ecuador", code: "EC", flag: "🇪🇨", callingCode: "+593" },
        { name: "Egypt", code: "EG", flag: "🇪🇬", callingCode: "+20" },
        { name: "El Salvador", code: "SV", flag: "🇸🇻", callingCode: "+503" },
        { name: "Equatorial Guinea", code: "GQ", flag: "🇬🇶", callingCode: "+240" },
        { name: "Eritrea", code: "ER", flag: "🇪🇷", callingCode: "+291" },
        { name: "Estonia", code: "EE", flag: "🇪🇪", callingCode: "+372" },
        { name: "Eswatini", code: "SZ", flag: "🇸🇿", callingCode: "+268" },
        { name: "Ethiopia", code: "ET", flag: "🇪🇹", callingCode: "+251" },

        { name: "Fiji", code: "FJ", flag: "🇫🇯", callingCode: "+679" },
        { name: "Finland", code: "FI", flag: "🇫🇮", callingCode: "+358" },
        { name: "France", code: "FR", flag: "🇫🇷", callingCode: "+33" },

        { name: "Gabon", code: "GA", flag: "🇬🇦", callingCode: "+241" },
        { name: "Gambia", code: "GM", flag: "🇬🇲", callingCode: "+220" },
        { name: "Georgia", code: "GE", flag: "🇬🇪", callingCode: "+995" },
        { name: "Germany", code: "DE", flag: "🇩🇪", callingCode: "+49" },
        { name: "Ghana", code: "GH", flag: "🇬🇭", callingCode: "+233" },
        { name: "Greece", code: "GR", flag: "🇬🇷", callingCode: "+30" },
        { name: "Grenada", code: "GD", flag: "🇬🇩", callingCode: "+1-473" },
        { name: "Guatemala", code: "GT", flag: "🇬🇹", callingCode: "+502" },
        { name: "Guinea", code: "GN", flag: "🇬🇳", callingCode: "+224" },
        { name: "Guinea-Bissau", code: "GW", flag: "🇬🇼", callingCode: "+245" },
        { name: "Guyana", code: "GY", flag: "🇬🇾", callingCode: "+592" },

        { name: "Haiti", code: "HT", flag: "🇭🇹", callingCode: "+509" },
        { name: "Honduras", code: "HN", flag: "🇭🇳", callingCode: "+504" },
        { name: "Hungary", code: "HU", flag: "🇭🇺", callingCode: "+36" },

        { name: "Iceland", code: "IS", flag: "🇮🇸", callingCode: "+354" },
        { name: "India", code: "IN", flag: "🇮🇳", callingCode: "+91" },
        { name: "Indonesia", code: "ID", flag: "🇮🇩", callingCode: "+62" },
        { name: "Iran", code: "IR", flag: "🇮🇷", callingCode: "+98" },
        { name: "Iraq", code: "IQ", flag: "🇮🇶", callingCode: "+964" },
        { name: "Ireland", code: "IE", flag: "🇮🇪", callingCode: "+353" },
        { name: "Israel", code: "IL", flag: "🇮🇱", callingCode: "+972" },
        { name: "Italy", code: "IT", flag: "🇮🇹", callingCode: "+39" },

        { name: "Jamaica", code: "JM", flag: "🇯🇲", callingCode: "+1-876" },
        { name: "Japan", code: "JP", flag: "🇯🇵", callingCode: "+81" },
        { name: "Jordan", code: "JO", flag: "🇯🇴", callingCode: "+962" },

        { name: "Kazakhstan", code: "KZ", flag: "🇰🇿", callingCode: "+7" },
        { name: "Kenya", code: "KE", flag: "🇰🇪", callingCode: "+254" },
        { name: "Kiribati", code: "KI", flag: "🇰🇮", callingCode: "+686" },
        { name: "Kuwait", code: "KW", flag: "🇰🇼", callingCode: "+965" },
        { name: "Kyrgyzstan", code: "KG", flag: "🇰🇬", callingCode: "+996" },

        { name: "Laos", code: "LA", flag: "🇱🇦", callingCode: "+856" },
        { name: "Latvia", code: "LV", flag: "🇱🇻", callingCode: "+371" },
        { name: "Lebanon", code: "LB", flag: "🇱🇧", callingCode: "+961" },
        { name: "Lesotho", code: "LS", flag: "🇱🇸", callingCode: "+266" },
        { name: "Liberia", code: "LR", flag: "🇱🇷", callingCode: "+231" },
        { name: "Libya", code: "LY", flag: "🇱🇾", callingCode: "+218" },
        { name: "Liechtenstein", code: "LI", flag: "🇱🇮", callingCode: "+423" },
        { name: "Lithuania", code: "LT", flag: "🇱🇹", callingCode: "+370" },
        { name: "Luxembourg", code: "LU", flag: "🇱🇺", callingCode: "+352" },

        { name: "Madagascar", code: "MG", flag: "🇲🇬", callingCode: "+261" },
        { name: "Malawi", code: "MW", flag: "🇲🇼", callingCode: "+265" },
        { name: "Malaysia", code: "MY", flag: "🇲🇾", callingCode: "+60" },
        { name: "Maldives", code: "MV", flag: "🇲🇻", callingCode: "+960" },
        { name: "Mali", code: "ML", flag: "🇲🇱", callingCode: "+223" },
        { name: "Malta", code: "MT", flag: "🇲🇹", callingCode: "+356" },
        { name: "Marshall Islands", code: "MH", flag: "🇲🇭", callingCode: "+692" },
        { name: "Mauritania", code: "MR", flag: "🇲🇷", callingCode: "+222" },
        { name: "Mauritius", code: "MU", flag: "🇲🇺", callingCode: "+230" },
        { name: "Mexico", code: "MX", flag: "🇲🇽", callingCode: "+52" },
        { name: "Micronesia", code: "FM", flag: "🇫🇲", callingCode: "+691" },
        { name: "Moldova", code: "MD", flag: "🇲🇩", callingCode: "+373" },
        { name: "Monaco", code: "MC", flag: "🇲🇨", callingCode: "+377" },
        { name: "Mongolia", code: "MN", flag: "🇲🇳", callingCode: "+976" },
        { name: "Montenegro", code: "ME", flag: "🇲🇪", callingCode: "+382" },
        { name: "Morocco", code: "MA", flag: "🇲🇦", callingCode: "+212" },
        { name: "Mozambique", code: "MZ", flag: "🇲🇿", callingCode: "+258" },
        { name: "Myanmar", code: "MM", flag: "🇲🇲", callingCode: "+95" },

        { name: "Namibia", code: "NA", flag: "🇳🇦", callingCode: "+264" },
        { name: "Nauru", code: "NR", flag: "🇳🇷", callingCode: "+674" },
        { name: "Nepal", code: "NP", flag: "🇳🇵", callingCode: "+977" },
        { name: "Netherlands", code: "NL", flag: "🇳🇱", callingCode: "+31" },
        { name: "New Zealand", code: "NZ", flag: "🇳🇿", callingCode: "+64" },
        { name: "Nicaragua", code: "NI", flag: "🇳🇮", callingCode: "+505" },
        { name: "Niger", code: "NE", flag: "🇳🇪", callingCode: "+227" },
        { name: "Nigeria", code: "NG", flag: "🇳🇬", callingCode: "+234" },
        { name: "North Korea", code: "KP", flag: "🇰🇵", callingCode: "+850" },
        { name: "North Macedonia", code: "MK", flag: "🇲🇰", callingCode: "+389" },
        { name: "Norway", code: "NO", flag: "🇳🇴", callingCode: "+47" },

        { name: "Oman", code: "OM", flag: "🇴🇲", callingCode: "+968" },

        { name: "Pakistan", code: "PK", flag: "🇵🇰", callingCode: "+92" },
        { name: "Palau", code: "PW", flag: "🇵🇼", callingCode: "+680" },
        { name: "Palestine", code: "PS", flag: "🇵🇸", callingCode: "+970" },
        { name: "Panama", code: "PA", flag: "🇵🇦", callingCode: "+507" },
        { name: "Papua New Guinea", code: "PG", flag: "🇵🇬", callingCode: "+675" },
        { name: "Paraguay", code: "PY", flag: "🇵🇾", callingCode: "+595" },
        { name: "Peru", code: "PE", flag: "🇵🇪", callingCode: "+51" },
        { name: "Philippines", code: "PH", flag: "🇵🇭", callingCode: "+63" },
        { name: "Poland", code: "PL", flag: "🇵🇱", callingCode: "+48" },
        { name: "Portugal", code: "PT", flag: "🇵🇹", callingCode: "+351" },

        { name: "Qatar", code: "QA", flag: "🇶🇦", callingCode: "+974" },

        { name: "Romania", code: "RO", flag: "🇷🇴", callingCode: "+40" },
        { name: "Russia", code: "RU", flag: "🇷🇺", callingCode: "+7" },
        { name: "Rwanda", code: "RW", flag: "🇷🇼", callingCode: "+250" },

        { name: "Saint Kitts and Nevis", code: "KN", flag: "🇰🇳", callingCode: "+1-869" },
        { name: "Saint Lucia", code: "LC", flag: "🇱🇨", callingCode: "+1-758" },
        { name: "Saint Vincent and the Grenadines", code: "VC", flag: "🇻🇨", callingCode: "+1-784" },
        { name: "Samoa", code: "WS", flag: "🇼🇸", callingCode: "+685" },
        { name: "San Marino", code: "SM", flag: "🇸🇲", callingCode: "+378" },
        { name: "Sao Tome and Principe", code: "ST", flag: "🇸🇹", callingCode: "+239" },
        { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", callingCode: "+966" },
        { name: "Senegal", code: "SN", flag: "🇸🇳", callingCode: "+221" },
        { name: "Serbia", code: "RS", flag: "🇷🇸", callingCode: "+381" },
        { name: "Seychelles", code: "SC", flag: "🇸🇨", callingCode: "+248" },
        { name: "Sierra Leone", code: "SL", flag: "🇸🇱", callingCode: "+232" },
        { name: "Singapore", code: "SG", flag: "🇸🇬", callingCode: "+65" },
        { name: "Slovakia", code: "SK", flag: "🇸🇰", callingCode: "+421" },
        { name: "Slovenia", code: "SI", flag: "🇸🇮", callingCode: "+386" },
        { name: "Solomon Islands", code: "SB", flag: "🇸🇧", callingCode: "+677" },
        { name: "Somalia", code: "SO", flag: "🇸🇴", callingCode: "+252" },
        { name: "South Africa", code: "ZA", flag: "🇿🇦", callingCode: "+27" },
        { name: "South Korea", code: "KR", flag: "🇰🇷", callingCode: "+82" },
        { name: "South Sudan", code: "SS", flag: "🇸🇸", callingCode: "+211" },
        { name: "Spain", code: "ES", flag: "🇪🇸", callingCode: "+34" },
        { name: "Sri Lanka", code: "LK", flag: "🇱🇰", callingCode: "+94" },
        { name: "Sudan", code: "SD", flag: "🇸🇩", callingCode: "+249" },
        { name: "Suriname", code: "SR", flag: "🇸🇷", callingCode: "+597" },
        { name: "Sweden", code: "SE", flag: "🇸🇪", callingCode: "+46" },
        { name: "Switzerland", code: "CH", flag: "🇨🇭", callingCode: "+41" },
        { name: "Syria", code: "SY", flag: "🇸🇾", callingCode: "+963" },

        { name: "Taiwan", code: "TW", flag: "🇹🇼", callingCode: "+886" },
        { name: "Tajikistan", code: "TJ", flag: "🇹🇯", callingCode: "+992" },
        { name: "Tanzania", code: "TZ", flag: "🇹🇿", callingCode: "+255" },
        { name: "Thailand", code: "TH", flag: "🇹🇭", callingCode: "+66" },
        { name: "Timor-Leste", code: "TL", flag: "🇹🇱", callingCode: "+670" },
        { name: "Togo", code: "TG", flag: "🇹🇬", callingCode: "+228" },
        { name: "Tonga", code: "TO", flag: "🇹🇴", callingCode: "+676" },
        { name: "Trinidad and Tobago", code: "TT", flag: "🇹🇹", callingCode: "+1-868" },
        { name: "Tunisia", code: "TN", flag: "🇹🇳", callingCode: "+216" },
        { name: "Turkey", code: "TR", flag: "🇹🇷", callingCode: "+90" },
        { name: "Turkmenistan", code: "TM", flag: "🇹🇲", callingCode: "+993" },
        { name: "Tuvalu", code: "TV", flag: "🇹🇻", callingCode: "+688" },

        { name: "Uganda", code: "UG", flag: "🇺🇬", callingCode: "+256" },
        { name: "Ukraine", code: "UA", flag: "🇺🇦", callingCode: "+380" },
        { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", callingCode: "+971" },
        { name: "United Kingdom", code: "GB", flag: "🇬🇧", callingCode: "+44" },
        { name: "United States", code: "US", flag: "🇺🇸", callingCode: "+1" },
        { name: "Uruguay", code: "UY", flag: "🇺🇾", callingCode: "+598" },
        { name: "Uzbekistan", code: "UZ", flag: "🇺🇿", callingCode: "+998" },

        { name: "Vanuatu", code: "VU", flag: "🇻🇺", callingCode: "+678" },
        { name: "Vatican City", code: "VA", flag: "🇻🇦", callingCode: "+39" },
        { name: "Venezuela", code: "VE", flag: "🇻🇪", callingCode: "+58" },
        { name: "Vietnam", code: "VN", flag: "🇻🇳", callingCode: "+84" },

        { name: "Yemen", code: "YE", flag: "🇾🇪", callingCode: "+967" },

        { name: "Zambia", code: "ZM", flag: "🇿🇲", callingCode: "+260" },
        { name: "Zimbabwe", code: "ZW", flag: "🇿🇼", callingCode: "+263" }

    ];

    /* ---------------------------------------------------------
       GLOBAL EXPORT
       --------------------------------------------------------- */

    window.MARKETPLACE_COUNTRIES = MARKETPLACE_COUNTRIES;

    /* ---------------------------------------------------------
       OPTIONAL COMPATIBILITY ALIASES
       पुराने Marketplace code के लिए
       --------------------------------------------------------- */

    window.WORLD_COUNTRIES = MARKETPLACE_COUNTRIES;
    window.GLOBAL_COUNTRIES = MARKETPLACE_COUNTRIES;

    /* ---------------------------------------------------------
       READY FLAG
       --------------------------------------------------------- */

    window.MARKETPLACE_COUNTRIES_READY = true;

})();