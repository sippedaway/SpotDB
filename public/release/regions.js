const regionMappings = {
    "AR": "Argentina",
    "AU": "Australia",
    "AT": "Austria",
    "BE": "Belgium",
    "BO": "Bolivia",
    "BR": "Brazil",
    "BG": "Bulgaria",
    "CA": "Canada",
    "CL": "Chile",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DO": "Dominican Republic",
    "DE": "Germany",
    "EC": "Ecuador",
    "EE": "Estonia",
    "SV": "El Salvador",
    "FI": "Finland",
    "FR": "France",
    "GR": "Greece",
    "GT": "Guatemala",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IE": "Ireland",
    "IT": "Italy",
    "LV": "Latvia",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MY": "Malaysia",
    "MT": "Malta",
    "MX": "Mexico",
    "NL": "Netherlands",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NO": "Norway",
    "PA": "Panama",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "SG": "Singapore",
    "SK": "Slovakia",
    "ES": "Spain",
    "SE": "Sweden",
    "CH": "Switzerland",
    "TW": "Taiwan",
    "TR": "Turkey",
    "UY": "Uruguay",
    "US": "United States",
    "GB": "United Kingdom",
    "AD": "Andorra",
    "LI": "Liechtenstein",
    "MC": "Monaco",
    "ID": "Indonesia",
    "JP": "Japan",
    "TH": "Thailand",
    "VN": "Vietnam",
    "RO": "Romania",
    "IL": "Israel",
    "ZA": "South Africa",
    "SA": "Saudi Arabia",
    "AE": "United Arab Emirates",
    "BH": "Bahrain",
    "QA": "Qatar",
    "OM": "Oman",
    "KW": "Kuwait",
    "EG": "Egypt",
    "MA": "Morocco",
    "DZ": "Algeria",
    "TN": "Tunisia",
    "LB": "Lebanon",
    "JO": "Jordan",
    "PS": "Palestine",
    "IN": "India",
    "BY": "Belarus",
    "KZ": "Kazakhstan",
    "MD": "Moldova",
    "UA": "Ukraine",
    "AL": "Albania",
    "BA": "Bosnia and Herzegovina",
    "HR": "Croatia",
    "ME": "Montenegro",
    "MK": "North Macedonia",
    "RS": "Serbia",
    "SI": "Slovenia",
    "KR": "South Korea",
    "BD": "Bangladesh",
    "PK": "Pakistan",
    "LK": "Sri Lanka",
    "GH": "Ghana",
    "KE": "Kenya",
    "NG": "Nigeria",
    "TZ": "Tanzania",
    "UG": "Uganda",
    "AG": "Antigua and Barbuda",
    "AM": "Armenia",
    "BS": "Bahamas",
    "BB": "Barbados",
    "BZ": "Belize",
    "BT": "Bhutan",
    "BW": "Botswana",
    "BF": "Burkina Faso",
    "CV": "Cape Verde",
    "CW": "Curacao",
    "DM": "Dominica",
    "FJ": "Fiji",
    "GM": "Gambia",
    "GE": "Georgia",
    "GD": "Grenada",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "JM": "Jamaica",
    "KI": "Kiribati",
    "LS": "Lesotho",
    "LR": "Liberia",
    "MW": "Malawi",
    "MV": "Maldives",
    "ML": "Mali",
    "MH": "Marshall Islands",
    "FM": "Micronesia",
    "NA": "Namibia",
    "NR": "Nauru",
    "NE": "Niger",
    "PW": "Palau",
    "PG": "Papua New Guinea",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SN": "Senegal",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SB": "Solomon Islands",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "SR": "Suriname",
    "TL": "Timor-Leste",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TV": "Tuvalu",
    "VU": "Vanuatu",
    "AZ": "Azerbaijan",
    "BN": "Brunei",
    "BI": "Burundi",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "TD": "Chad",
    "KM": "Comoros",
    "GQ": "Equatorial Guinea",
    "SZ": "Eswatini",
    "GA": "Gabon",
    "GN": "Guinea",
    "KG": "Kyrgyzstan",
    "LA": "Laos",
    "MO": "Macau",
    "MR": "Mauritania",
    "MN": "Mongolia",
    "NP": "Nepal",
    "RW": "Rwanda",
    "TG": "Togo",
    "UZ": "Uzbekistan",
    "ZW": "Zimbabwe",
    "BJ": "Benin",
    "MG": "Madagascar",
    "MU": "Mauritius",
    "MZ": "Mozambique",
    "AO": "Angola",
    "CI": "Ivory Coast",
    "DJ": "Djibouti",
    "ZM": "Zambia",
    "CD": "Democratic Republic of Congo",
    "CG": "Republic of the Congo",
    "IQ": "Iraq",
    "LY": "Libya",
    "TJ": "Tajikistan",
    "VE": "Venezuela",
    "ET": "Ethiopia",
    "XK": "Kosovo"
};