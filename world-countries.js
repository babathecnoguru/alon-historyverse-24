/* =========================================================
   ALON HISTORYVERSE 24
   WORLD COUNTRIES DATABASE
   File: world-countries.js
   Purpose: Jobs & Careers country selector
   ========================================================= */

"use strict";

window.MARKETPLACE_COUNTRIES = [
    {"code": "AF", "name": "Afghanistan", "flag": "🇦🇫", "callingCode": "+93"},
    {"code": "AL", "name": "Albania", "flag": "🇦🇱", "callingCode": "+355"},
    {"code": "DZ", "name": "Algeria", "flag": "🇩🇿", "callingCode": "+213"},
    {"code": "AS", "name": "American Samoa", "flag": "🇦🇸", "callingCode": "+1684"},
    {"code": "AD", "name": "Andorra", "flag": "🇦🇩", "callingCode": "+376"},
    {"code": "AO", "name": "Angola", "flag": "🇦🇴", "callingCode": "+244"},
    {"code": "AI", "name": "Anguilla", "flag": "🇦🇮", "callingCode": "+1264"},
    {"code": "AQ", "name": "Antarctica", "flag": "🇦🇶", "callingCode": "+672"},
    {"code": "AG", "name": "Antigua and Barbuda", "flag": "🇦🇬", "callingCode": "+1268"},
    {"code": "AR", "name": "Argentina", "flag": "🇦🇷", "callingCode": "+54"},
    {"code": "AM", "name": "Armenia", "flag": "🇦🇲", "callingCode": "+374"},
    {"code": "AW", "name": "Aruba", "flag": "🇦🇼", "callingCode": "+297"},
    {"code": "AU", "name": "Australia", "flag": "🇦🇺", "callingCode": "+61"},
    {"code": "AT", "name": "Austria", "flag": "🇦🇹", "callingCode": "+43"},
    {"code": "AZ", "name": "Azerbaijan", "flag": "🇦🇿", "callingCode": "+994"},
    {"code": "BS", "name": "Bahamas", "flag": "🇧🇸", "callingCode": "+1242"},
    {"code": "BH", "name": "Bahrain", "flag": "🇧🇭", "callingCode": "+973"},
    {"code": "BD", "name": "Bangladesh", "flag": "🇧🇩", "callingCode": "+880"},
    {"code": "BB", "name": "Barbados", "flag": "🇧🇧", "callingCode": "+1246"},
    {"code": "BY", "name": "Belarus", "flag": "🇧🇾", "callingCode": "+375"},
    {"code": "BE", "name": "Belgium", "flag": "🇧🇪", "callingCode": "+32"},
    {"code": "BZ", "name": "Belize", "flag": "🇧🇿", "callingCode": "+501"},
    {"code": "BJ", "name": "Benin", "flag": "🇧🇯", "callingCode": "+229"},
    {"code": "BM", "name": "Bermuda", "flag": "🇧🇲", "callingCode": "+1441"},
    {"code": "BT", "name": "Bhutan", "flag": "🇧🇹", "callingCode": "+975"},
    {"code": "BO", "name": "Bolivia", "flag": "🇧🇴", "callingCode": "+591"},
    {"code": "BQ", "name": "Bonaire, Sint Eustatius and Saba", "flag": "🇧🇶", "callingCode": "+599"},
    {"code": "BA", "name": "Bosnia and Herzegovina", "flag": "🇧🇦", "callingCode": "+387"},
    {"code": "BW", "name": "Botswana", "flag": "🇧🇼", "callingCode": "+267"},
    {"code": "BV", "name": "Bouvet Island", "flag": "🇧🇻", "callingCode": "+47"},
    {"code": "BR", "name": "Brazil", "flag": "🇧🇷", "callingCode": "+55"},
    {"code": "IO", "name": "British Indian Ocean Territory", "flag": "🇮🇴", "callingCode": "+246"},
    {"code": "BN", "name": "Brunei", "flag": "🇧🇳", "callingCode": "+673"},
    {"code": "BG", "name": "Bulgaria", "flag": "🇧🇬", "callingCode": "+359"},
    {"code": "BF", "name": "Burkina Faso", "flag": "🇧🇫", "callingCode": "+226"},
    {"code": "BI", "name": "Burundi", "flag": "🇧🇮", "callingCode": "+257"},
    {"code": "CV", "name": "Cape Verde", "flag": "🇨🇻", "callingCode": "+238"},
    {"code": "KH", "name": "Cambodia", "flag": "🇰🇭", "callingCode": "+855"},
    {"code": "CM", "name": "Cameroon", "flag": "🇨🇲", "callingCode": "+237"},
    {"code": "CA", "name": "Canada", "flag": "🇨🇦", "callingCode": "+1"},
    {"code": "KY", "name": "Cayman Islands", "flag": "🇰🇾", "callingCode": "+1345"},
    {"code": "CF", "name": "Central African Republic", "flag": "🇨🇫", "callingCode": "+236"},
    {"code": "TD", "name": "Chad", "flag": "🇹🇩", "callingCode": "+235"},
    {"code": "CL", "name": "Chile", "flag": "🇨🇱", "callingCode": "+56"},
    {"code": "CN", "name": "China", "flag": "🇨🇳", "callingCode": "+86"},
    {"code": "CX", "name": "Christmas Island", "flag": "🇨🇽", "callingCode": "+61"},
    {"code": "CC", "name": "Cocos (Keeling) Islands", "flag": "🇨🇨", "callingCode": "+61"},
    {"code": "CO", "name": "Colombia", "flag": "🇨🇴", "callingCode": "+57"},
    {"code": "KM", "name": "Comoros", "flag": "🇰🇲", "callingCode": "+269"},
    {"code": "CG", "name": "Republic of the Congo", "flag": "🇨🇬", "callingCode": "+242"},
    {"code": "CD", "name": "Democratic Republic of the Congo", "flag": "🇨🇩", "callingCode": "+243"},
    {"code": "CK", "name": "Cook Islands", "flag": "🇨🇰", "callingCode": "+682"},
    {"code": "CR", "name": "Costa Rica", "flag": "🇨🇷", "callingCode": "+506"},
    {"code": "CI", "name": "Ivory Coast", "flag": "🇨🇮", "callingCode": "+225"},
    {"code": "HR", "name": "Croatia", "flag": "🇭🇷", "callingCode": "+385"},
    {"code": "CU", "name": "Cuba", "flag": "🇨🇺", "callingCode": "+53"},
    {"code": "CW", "name": "Curaçao", "flag": "🇨🇼", "callingCode": "+5999"},
    {"code": "CY", "name": "Cyprus", "flag": "🇨🇾", "callingCode": "+357"},
    {"code": "CZ", "name": "Czechia", "flag": "🇨🇿", "callingCode": "+420"},
    {"code": "DK", "name": "Denmark", "flag": "🇩🇰", "callingCode": "+45"},
    {"code": "DJ", "name": "Djibouti", "flag": "🇩🇯", "callingCode": "+253"},
    {"code": "DM", "name": "Dominica", "flag": "🇩🇲", "callingCode": "+1767"},
    {"code": "DO", "name": "Dominican Republic", "flag": "🇩🇴", "callingCode": "+1809"},
    {"code": "EC", "name": "Ecuador", "flag": "🇪🇨", "callingCode": "+593"},
    {"code": "EG", "name": "Egypt", "flag": "🇪🇬", "callingCode": "+20"},
    {"code": "SV", "name": "El Salvador", "flag": "🇸🇻", "callingCode": "+503"},
    {"code": "GQ", "name": "Equatorial Guinea", "flag": "🇬🇶", "callingCode": "+240"},
    {"code": "ER", "name": "Eritrea", "flag": "🇪🇷", "callingCode": "+291"},
    {"code": "EE", "name": "Estonia", "flag": "🇪🇪", "callingCode": "+372"},
    {"code": "SZ", "name": "Eswatini", "flag": "🇸🇿", "callingCode": "+268"},
    {"code": "ET", "name": "Ethiopia", "flag": "🇪🇹", "callingCode": "+251"},
    {"code": "FK", "name": "Falkland Islands", "flag": "🇫🇰", "callingCode": "+500"},
    {"code": "FO", "name": "Faroe Islands", "flag": "🇫🇴", "callingCode": "+298"},
    {"code": "FJ", "name": "Fiji", "flag": "🇫🇯", "callingCode": "+679"},
    {"code": "FI", "name": "Finland", "flag": "🇫🇮", "callingCode": "+358"},
    {"code": "FR", "name": "France", "flag": "🇫🇷", "callingCode": "+33"},
    {"code": "GF", "name": "French Guiana", "flag": "🇬🇫", "callingCode": "+594"},
    {"code": "PF", "name": "French Polynesia", "flag": "🇵🇫", "callingCode": "+689"},
    {"code": "TF", "name": "French Southern Territories", "flag": "🇹🇫", "callingCode": "+262"},
    {"code": "GA", "name": "Gabon", "flag": "🇬🇦", "callingCode": "+241"},
    {"code": "GM", "name": "Gambia", "flag": "🇬🇲", "callingCode": "+220"},
    {"code": "GE", "name": "Georgia", "flag": "🇬🇪", "callingCode": "+995"},
    {"code": "DE", "name": "Germany", "flag": "🇩🇪", "callingCode": "+49"},
    {"code": "GH", "name": "Ghana", "flag": "🇬🇭", "callingCode": "+233"},
    {"code": "GI", "name": "Gibraltar", "flag": "🇬🇮", "callingCode": "+350"},
    {"code": "GR", "name": "Greece", "flag": "🇬🇷", "callingCode": "+30"},
    {"code": "GL", "name": "Greenland", "flag": "🇬🇱", "callingCode": "+299"},
    {"code": "GD", "name": "Grenada", "flag": "🇬🇩", "callingCode": "+1473"},
    {"code": "GP", "name": "Guadeloupe", "flag": "🇬🇵", "callingCode": "+590"},
    {"code": "GU", "name": "Guam", "flag": "🇬🇺", "callingCode": "+1671"},
    {"code": "GT", "name": "Guatemala", "flag": "🇬🇹", "callingCode": "+502"},
    {"code": "GG", "name": "Guernsey", "flag": "🇬🇬", "callingCode": "+44"},
    {"code": "GN", "name": "Guinea", "flag": "🇬🇳", "callingCode": "+224"},
    {"code": "GW", "name": "Guinea-Bissau", "flag": "🇬🇼", "callingCode": "+245"},
    {"code": "GY", "name": "Guyana", "flag": "🇬🇾", "callingCode": "+592"},
    {"code": "HT", "name": "Haiti", "flag": "🇭🇹", "callingCode": "+509"},
    {"code": "HM", "name": "Heard Island and McDonald Islands", "flag": "🇭🇲", "callingCode": "+672"},
    {"code": "VA", "name": "Holy See (Vatican City State)", "flag": "🇻🇦", "callingCode": "+39"},
    {"code": "HN", "name": "Honduras", "flag": "🇭🇳", "callingCode": "+504"},
    {"code": "HK", "name": "Hong Kong", "flag": "🇭🇰", "callingCode": "+852"},
    {"code": "HU", "name": "Hungary", "flag": "🇭🇺", "callingCode": "+36"},
    {"code": "IS", "name": "Iceland", "flag": "🇮🇸", "callingCode": "+354"},
    {"code": "IN", "name": "India", "flag": "🇮🇳", "callingCode": "+91"},
    {"code": "ID", "name": "Indonesia", "flag": "🇮🇩", "callingCode": "+62"},
    {"code": "IR", "name": "Iran", "flag": "🇮🇷", "callingCode": "+98"},
    {"code": "IQ", "name": "Iraq", "flag": "🇮🇶", "callingCode": "+964"},
    {"code": "IE", "name": "Ireland", "flag": "🇮🇪", "callingCode": "+353"},
    {"code": "IM", "name": "Isle of Man", "flag": "🇮🇲", "callingCode": "+44"},
    {"code": "IL", "name": "Israel", "flag": "🇮🇱", "callingCode": "+972"},
    {"code": "IT", "name": "Italy", "flag": "🇮🇹", "callingCode": "+39"},
    {"code": "JM", "name": "Jamaica", "flag": "🇯🇲", "callingCode": "+1876"},
    {"code": "JP", "name": "Japan", "flag": "🇯🇵", "callingCode": "+81"},
    {"code": "JE", "name": "Jersey", "flag": "🇯🇪", "callingCode": "+44"},
    {"code": "JO", "name": "Jordan", "flag": "🇯🇴", "callingCode": "+962"},
    {"code": "KZ", "name": "Kazakhstan", "flag": "🇰🇿", "callingCode": "+7"},
    {"code": "KE", "name": "Kenya", "flag": "🇰🇪", "callingCode": "+254"},
    {"code": "KI", "name": "Kiribati", "flag": "🇰🇮", "callingCode": "+686"},
    {"code": "KP", "name": "North Korea", "flag": "🇰🇵", "callingCode": "+850"},
    {"code": "KR", "name": "South Korea", "flag": "🇰🇷", "callingCode": "+82"},
    {"code": "KW", "name": "Kuwait", "flag": "🇰🇼", "callingCode": "+965"},
    {"code": "KG", "name": "Kyrgyzstan", "flag": "🇰🇬", "callingCode": "+996"},
    {"code": "LA", "name": "Laos", "flag": "🇱🇦", "callingCode": "+856"},
    {"code": "LV", "name": "Latvia", "flag": "🇱🇻", "callingCode": "+371"},
    {"code": "LB", "name": "Lebanon", "flag": "🇱🇧", "callingCode": "+961"},
    {"code": "LS", "name": "Lesotho", "flag": "🇱🇸", "callingCode": "+266"},
    {"code": "LR", "name": "Liberia", "flag": "🇱🇷", "callingCode": "+231"},
    {"code": "LY", "name": "Libya", "flag": "🇱🇾", "callingCode": "+218"},
    {"code": "LI", "name": "Liechtenstein", "flag": "🇱🇮", "callingCode": "+423"},
    {"code": "LT", "name": "Lithuania", "flag": "🇱🇹", "callingCode": "+370"},
    {"code": "LU", "name": "Luxembourg", "flag": "🇱🇺", "callingCode": "+352"},
    {"code": "MO", "name": "Macao", "flag": "🇲🇴", "callingCode": "+853"},
    {"code": "MG", "name": "Madagascar", "flag": "🇲🇬", "callingCode": "+261"},
    {"code": "MW", "name": "Malawi", "flag": "🇲🇼", "callingCode": "+265"},
    {"code": "MY", "name": "Malaysia", "flag": "🇲🇾", "callingCode": "+60"},
    {"code": "MV", "name": "Maldives", "flag": "🇲🇻", "callingCode": "+960"},
    {"code": "ML", "name": "Mali", "flag": "🇲🇱", "callingCode": "+223"},
    {"code": "MT", "name": "Malta", "flag": "🇲🇹", "callingCode": "+356"},
    {"code": "MH", "name": "Marshall Islands", "flag": "🇲🇭", "callingCode": "+692"},
    {"code": "MQ", "name": "Martinique", "flag": "🇲🇶", "callingCode": "+596"},
    {"code": "MR", "name": "Mauritania", "flag": "🇲🇷", "callingCode": "+222"},
    {"code": "MU", "name": "Mauritius", "flag": "🇲🇺", "callingCode": "+230"},
    {"code": "YT", "name": "Mayotte", "flag": "🇾🇹", "callingCode": "+262"},
    {"code": "MX", "name": "Mexico", "flag": "🇲🇽", "callingCode": "+52"},
    {"code": "FM", "name": "Micronesia", "flag": "🇫🇲", "callingCode": "+691"},
    {"code": "MD", "name": "Moldova", "flag": "🇲🇩", "callingCode": "+373"},
    {"code": "MC", "name": "Monaco", "flag": "🇲🇨", "callingCode": "+377"},
    {"code": "MN", "name": "Mongolia", "flag": "🇲🇳", "callingCode": "+976"},
    {"code": "ME", "name": "Montenegro", "flag": "🇲🇪", "callingCode": "+382"},
    {"code": "MS", "name": "Montserrat", "flag": "🇲🇸", "callingCode": "+1664"},
    {"code": "MA", "name": "Morocco", "flag": "🇲🇦", "callingCode": "+212"},
    {"code": "MZ", "name": "Mozambique", "flag": "🇲🇿", "callingCode": "+258"},
    {"code": "MM", "name": "Myanmar", "flag": "🇲🇲", "callingCode": "+95"},
    {"code": "NA", "name": "Namibia", "flag": "🇳🇦", "callingCode": "+264"},
    {"code": "NR", "name": "Nauru", "flag": "🇳🇷", "callingCode": "+674"},
    {"code": "NP", "name": "Nepal", "flag": "🇳🇵", "callingCode": "+977"},
    {"code": "NL", "name": "Netherlands", "flag": "🇳🇱", "callingCode": "+31"},
    {"code": "NC", "name": "New Caledonia", "flag": "🇳🇨", "callingCode": "+687"},
    {"code": "NZ", "name": "New Zealand", "flag": "🇳🇿", "callingCode": "+64"},
    {"code": "NI", "name": "Nicaragua", "flag": "🇳🇮", "callingCode": "+505"},
    {"code": "NE", "name": "Niger", "flag": "🇳🇪", "callingCode": "+227"},
    {"code": "NG", "name": "Nigeria", "flag": "🇳🇬", "callingCode": "+234"},
    {"code": "NU", "name": "Niue", "flag": "🇳🇺", "callingCode": "+683"},
    {"code": "NF", "name": "Norfolk Island", "flag": "🇳🇫", "callingCode": "+672"},
    {"code": "MK", "name": "North Macedonia", "flag": "🇲🇰", "callingCode": "+389"},
    {"code": "MP", "name": "Northern Mariana Islands", "flag": "🇲🇵", "callingCode": "+1670"},
    {"code": "NO", "name": "Norway", "flag": "🇳🇴", "callingCode": "+47"},
    {"code": "OM", "name": "Oman", "flag": "🇴🇲", "callingCode": "+968"},
    {"code": "PK", "name": "Pakistan", "flag": "🇵🇰", "callingCode": "+92"},
    {"code": "PW", "name": "Palau", "flag": "🇵🇼", "callingCode": "+680"},
    {"code": "PS", "name": "Palestine", "flag": "🇵🇸", "callingCode": "+970"},
    {"code": "PA", "name": "Panama", "flag": "🇵🇦", "callingCode": "+507"},
    {"code": "PG", "name": "Papua New Guinea", "flag": "🇵🇬", "callingCode": "+675"},
    {"code": "PY", "name": "Paraguay", "flag": "🇵🇾", "callingCode": "+595"},
    {"code": "PE", "name": "Peru", "flag": "🇵🇪", "callingCode": "+51"},
    {"code": "PH", "name": "Philippines", "flag": "🇵🇭", "callingCode": "+63"},
    {"code": "PN", "name": "Pitcairn", "flag": "🇵🇳", "callingCode": "+64"},
    {"code": "PL", "name": "Poland", "flag": "🇵🇱", "callingCode": "+48"},
    {"code": "PT", "name": "Portugal", "flag": "🇵🇹", "callingCode": "+351"},
    {"code": "PR", "name": "Puerto Rico", "flag": "🇵🇷", "callingCode": "+1787"},
    {"code": "QA", "name": "Qatar", "flag": "🇶🇦", "callingCode": "+974"},
    {"code": "RE", "name": "Réunion", "flag": "🇷🇪", "callingCode": "+262"},
    {"code": "RO", "name": "Romania", "flag": "🇷🇴", "callingCode": "+40"},
    {"code": "RU", "name": "Russia", "flag": "🇷🇺", "callingCode": "+7"},
    {"code": "RW", "name": "Rwanda", "flag": "🇷🇼", "callingCode": "+250"},
    {"code": "BL", "name": "Saint Barthélemy", "flag": "🇧🇱", "callingCode": "+590"},
    {"code": "SH", "name": "Saint Helena", "flag": "🇸🇭", "callingCode": "+290"},
    {"code": "KN", "name": "Saint Kitts and Nevis", "flag": "🇰🇳", "callingCode": "+1869"},
    {"code": "LC", "name": "Saint Lucia", "flag": "🇱🇨", "callingCode": "+1758"},
    {"code": "MF", "name": "Saint Martin", "flag": "🇲🇫", "callingCode": "+590"},
    {"code": "PM", "name": "Saint Pierre and Miquelon", "flag": "🇵🇲", "callingCode": "+508"},
    {"code": "VC", "name": "Saint Vincent and the Grenadines", "flag": "🇻🇨", "callingCode": "+1784"},
    {"code": "WS", "name": "Samoa", "flag": "🇼🇸", "callingCode": "+685"},
    {"code": "SM", "name": "San Marino", "flag": "🇸🇲", "callingCode": "+378"},
    {"code": "ST", "name": "Sao Tome and Principe", "flag": "🇸🇹", "callingCode": "+239"},
    {"code": "SA", "name": "Saudi Arabia", "flag": "🇸🇦", "callingCode": "+966"},
    {"code": "SN", "name": "Senegal", "flag": "🇸🇳", "callingCode": "+221"},
    {"code": "RS", "name": "Serbia", "flag": "🇷🇸", "callingCode": "+381"},
    {"code": "SC", "name": "Seychelles", "flag": "🇸🇨", "callingCode": "+248"},
    {"code": "SL", "name": "Sierra Leone", "flag": "🇸🇱", "callingCode": "+232"},
    {"code": "SG", "name": "Singapore", "flag": "🇸🇬", "callingCode": "+65"},
    {"code": "SX", "name": "Sint Maarten", "flag": "🇸🇽", "callingCode": "+1721"},
    {"code": "SK", "name": "Slovakia", "flag": "🇸🇰", "callingCode": "+421"},
    {"code": "SI", "name": "Slovenia", "flag": "🇸🇮", "callingCode": "+386"},
    {"code": "SB", "name": "Solomon Islands", "flag": "🇸🇧", "callingCode": "+677"},
    {"code": "SO", "name": "Somalia", "flag": "🇸🇴", "callingCode": "+252"},
    {"code": "ZA", "name": "South Africa", "flag": "🇿🇦", "callingCode": "+27"},
    {"code": "GS", "name": "South Georgia and the South Sandwich Islands", "flag": "🇬🇸", "callingCode": "+500"},
    {"code": "SS", "name": "South Sudan", "flag": "🇸🇸", "callingCode": "+211"},
    {"code": "ES", "name": "Spain", "flag": "🇪🇸", "callingCode": "+34"},
    {"code": "LK", "name": "Sri Lanka", "flag": "🇱🇰", "callingCode": "+94"},
    {"code": "SD", "name": "Sudan", "flag": "🇸🇩", "callingCode": "+249"},
    {"code": "SR", "name": "Suriname", "flag": "🇸🇷", "callingCode": "+597"},
    {"code": "SJ", "name": "Svalbard and Jan Mayen", "flag": "🇸🇯", "callingCode": "+47"},
    {"code": "SE", "name": "Sweden", "flag": "🇸🇪", "callingCode": "+46"},
    {"code": "CH", "name": "Switzerland", "flag": "🇨🇭", "callingCode": "+41"},
    {"code": "SY", "name": "Syria", "flag": "🇸🇾", "callingCode": "+963"},
    {"code": "TW", "name": "Taiwan", "flag": "🇹🇼", "callingCode": "+886"},
    {"code": "TJ", "name": "Tajikistan", "flag": "🇹🇯", "callingCode": "+992"},
    {"code": "TZ", "name": "Tanzania", "flag": "🇹🇿", "callingCode": "+255"},
    {"code": "TH", "name": "Thailand", "flag": "🇹🇭", "callingCode": "+66"},
    {"code": "TL", "name": "Timor-Leste", "flag": "🇹🇱", "callingCode": "+670"},
    {"code": "TG", "name": "Togo", "flag": "🇹🇬", "callingCode": "+228"},
    {"code": "TK", "name": "Tokelau", "flag": "🇹🇰", "callingCode": "+690"},
    {"code": "TO", "name": "Tonga", "flag": "🇹🇴", "callingCode": "+676"},
    {"code": "TT", "name": "Trinidad and Tobago", "flag": "🇹🇹", "callingCode": "+1868"},
    {"code": "TN", "name": "Tunisia", "flag": "🇹🇳", "callingCode": "+216"},
    {"code": "TR", "name": "Turkey", "flag": "🇹🇷", "callingCode": "+90"},
    {"code": "TM", "name": "Turkmenistan", "flag": "🇹🇲", "callingCode": "+993"},
    {"code": "TC", "name": "Turks and Caicos Islands", "flag": "🇹🇨", "callingCode": "+1649"},
    {"code": "TV", "name": "Tuvalu", "flag": "🇹🇻", "callingCode": "+688"},
    {"code": "UG", "name": "Uganda", "flag": "🇺🇬", "callingCode": "+256"},
    {"code": "UA", "name": "Ukraine", "flag": "🇺🇦", "callingCode": "+380"},
    {"code": "AE", "name": "United Arab Emirates", "flag": "🇦🇪", "callingCode": "+971"},
    {"code": "GB", "name": "United Kingdom", "flag": "🇬🇧", "callingCode": "+44"},
    {"code": "US", "name": "United States", "flag": "🇺🇸", "callingCode": "+1"},
    {"code": "UM", "name": "United States Minor Outlying Islands", "flag": "🇺🇲", "callingCode": "+1"},
    {"code": "UY", "name": "Uruguay", "flag": "🇺🇾", "callingCode": "+598"},
    {"code": "UZ", "name": "Uzbekistan", "flag": "🇺🇿", "callingCode": "+998"},
    {"code": "VU", "name": "Vanuatu", "flag": "🇻🇺", "callingCode": "+678"},
    {"code": "VE", "name": "Venezuela", "flag": "🇻🇪", "callingCode": "+58"},
    {"code": "VN", "name": "Vietnam", "flag": "🇻🇳", "callingCode": "+84"},
    {"code": "VG", "name": "Virgin Islands, British", "flag": "🇻🇬", "callingCode": "+1284"},
    {"code": "VI", "name": "Virgin Islands, U.S.", "flag": "🇻🇮", "callingCode": "+1340"},
    {"code": "WF", "name": "Wallis and Futuna", "flag": "🇼🇫", "callingCode": "+681"},
    {"code": "EH", "name": "Western Sahara", "flag": "🇪🇭", "callingCode": "+212"},
    {"code": "YE", "name": "Yemen", "flag": "🇾🇪", "callingCode": "+967"},
    {"code": "ZM", "name": "Zambia", "flag": "🇿🇲", "callingCode": "+260"},
    {"code": "ZW", "name": "Zimbabwe", "flag": "🇿🇼", "callingCode": "+263"},
    {"code": "AX", "name": "Åland Islands", "flag": "🇦🇽", "callingCode": "+35818"}
];

/* =========================================================
   COMPATIBILITY ALIASES
   ========================================================= */

window.WORLD_COUNTRIES = window.MARKETPLACE_COUNTRIES;

/* =========================================================
   GET ONE COUNTRY
   ========================================================= */

window.getWorldCountry = function (code) {

    const target =
        String(code || "")
            .trim()
            .toUpperCase();

    return window.MARKETPLACE_COUNTRIES.find(
        function (country) {
            return country.code === target;
        }
    ) || null;
};

/* =========================================================
   GET ALL COUNTRIES
   ========================================================= */

window.getWorldCountries = function () {

    return window.MARKETPLACE_COUNTRIES.slice();

};

/* =========================================================
   SEARCH COUNTRIES
   ========================================================= */

window.searchWorldCountries = function (query) {

    const q =
        String(query || "")
            .trim()
            .toLowerCase();

    if (!q) {
        return window.MARKETPLACE_COUNTRIES.slice();
    }

    return window.MARKETPLACE_COUNTRIES.filter(
        function (country) {

            return (
                country.name.toLowerCase().includes(q) ||
                country.code.toLowerCase().includes(q) ||
                country.callingCode.toLowerCase().includes(q)
            );

        }
    );
};

/* =========================================================
   DATABASE STATUS
   ========================================================= */

/* =========================================================
   DATABASE STATUS / TEST
   ========================================================= */

console.log(
    "ALON HISTORYVERSE 24 — World Countries loaded:",
    window.MARKETPLACE_COUNTRIES.length
);

console.assert(
    window.MARKETPLACE_COUNTRIES.length === 249,
    "ERROR: World Countries database must contain exactly 249 countries."
);

console.assert(
    window.getWorldCountry("IN")?.callingCode === "+91",
    "ERROR: India country data is incorrect."
);