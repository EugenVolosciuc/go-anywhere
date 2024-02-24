const bestMonthsToVisit: [string, number[]][] = [
  ["AF", [3, 4, 9, 10]], // Afghanistan
  ["AL", [5, 6, 9]], // Albania
  ["DZ", [3, 4, 10, 11]], // Algeria
  ["AD", [5, 6, 9, 10]], // Andorra
  ["AO", [6, 7, 8, 9]], // Angola
  ["AG", [1, 2, 3, 11, 12]], // Antigua and Barbuda
  ["AR", [9, 10, 11]], // Argentina
  ["AM", [5, 6, 9, 10]], // Armenia
  ["AU", [4, 5, 9, 10]], // Australia
  ["AT", [5, 6, 9, 10]], // Austria
  ["AZ", [5, 6, 9, 10]], // Azerbaijan
  ["BS", [12, 1, 2, 3, 4, 5]], // Bahamas
  ["BH", [11, 12, 1, 2, 3]], // Bahrain
  ["BD", [12, 1, 2, 11]], // Bangladesh
  ["BB", [1, 2, 3, 11, 12]], // Barbados
  ["BY", [6, 7, 8, 9]], // Belarus
  ["BE", [5, 6, 9, 10]], // Belgium
  ["BZ", [11, 12, 1, 2, 3]], // Belize
  ["BJ", [11, 12, 1, 2, 7, 8, 9, 10]], // Benin
  ["BT", [3, 4, 10, 11]], // Bhutan
  ["BO", [4, 5, 9, 10]], // Bolivia
  ["BA", [5, 6, 9, 10]], // Bosnia and Herzegovina
  ["BW", [4, 5, 6, 7, 8, 9, 10]], // Botswana
  ["BR", [4, 5, 9, 10, 11]], // Brazil
  ["BN", [1, 2, 7, 8, 9, 10, 11, 12]], // Brunei
  ["BG", [5, 6, 9, 10]], // Bulgaria
  ["BF", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Burkina Faso
  ["BI", [6, 7, 8, 9, 10]], // Burundi
  ["KH", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Cambodia
  ["CM", [11, 12, 1, 2, 7, 8, 9, 10]], // Cameroon
  ["CA", [6, 7, 8]], // Canada
  ["CV", [6, 7, 8, 9, 10]], // Cape Verde
  ["CF", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Central African Republic
  ["TD", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Chad
  ["CL", [9, 10, 11]], // Chile
  ["CN", [4, 5, 9, 10]], // China
  ["CO", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Colombia
  ["KM", [6, 7, 8, 9, 10]], // Comoros
  ["CR", [12, 1, 2, 3, 6, 7, 8, 9, 10, 11]], // Costa Rica
  ["HR", [5, 6, 9, 10]], // Croatia
  ["CU", [12, 1, 2, 3, 11]], // Cuba
  ["CY", [5, 6, 9, 10]], // Cyprus
  ["CZ", [5, 6, 9, 10]], // Czech Republic
  ["CD", [3, 4, 10, 11]], // Democratic Republic of the Congo
  ["DK", [6, 7, 8, 9, 10]], // Denmark
  ["DJ", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Djibouti
  ["DM", [1, 2, 3, 11, 12]], // Dominica
  ["DO", [12, 1, 2, 3, 11]], // Dominican Republic
  ["TL", [5, 6, 7, 8, 9, 10]], // East Timor
  ["EC", [12, 1, 2, 3, 6, 7, 8, 9, 10, 11]], // Ecuador
  ["EG", [3, 4, 10, 11]], // Egypt
  ["SV", [12, 1, 2, 3, 11]], // El Salvador
  ["GQ", [1, 2, 7, 8, 9, 10, 11, 12]], // Equatorial Guinea
  ["ER", [12, 1, 2, 3, 11]], // Eritrea
  ["EE", [5, 6, 9, 10]], // Estonia
  ["ET", [10, 11, 12, 1, 2, 3, 9]], // Ethiopia
  ["FJ", [6, 7, 8, 9, 10]], // Fiji
  ["FI", [6, 7, 8, 9, 10]], // Finland
  ["FR", [5, 6, 9, 10]], // France
  ["GA", [6, 7, 8, 9, 10]], // Gabon
  ["GM", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Gambia
  ["GE", [5, 6, 9, 10]], // Georgia
  ["DE", [5, 6, 9, 10]], // Germany
  ["GH", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Ghana
  ["GR", [5, 6, 9, 10]], // Greece
  ["GD", [1, 2, 3, 11, 12]], // Grenada
  ["GT", [12, 1, 2, 3, 11]], // Guatemala
  ["GN", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Guinea
  ["GW", [6, 7, 8, 9, 10]], // Guinea-Bissau
  ["GY", [1, 2, 3, 11, 12]], // Guyana
  ["HT", [12, 1, 2, 3, 11]], // Haiti
  ["HN", [12, 1, 2, 3, 11]], // Honduras
  ["HU", [5, 6, 9, 10]], // Hungary
  ["IS", [6, 7, 8, 9, 10]], // Iceland
  ["IN", [11, 12, 1, 2, 9, 10]], // India
  ["ID", [5, 6, 7, 8]], // Indonesia
  ["IR", [3, 4, 10, 11]], // Iran
  ["IQ", [3, 4, 10, 11]], // Iraq
  ["IE", [5, 6, 9, 10]], // Ireland
  ["IL", [4, 5, 9, 10]], // Israel
  ["IT", [5, 6, 9, 10]], // Italy
  ["CI", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Ivory Coast
  ["JM", [12, 1, 2, 3, 11]], // Jamaica
  ["JP", [4, 5, 10, 11]], // Japan
  ["JO", [4, 5, 9, 10]], // Jordan
  ["KZ", [6, 7, 8, 9]], // Kazakhstan
  ["KE", [6, 7, 8, 9, 10]], // Kenya
  ["KI", [6, 7, 8, 9, 10]], // Kiribati
  ["KW", [11, 12, 1, 2, 3]], // Kuwait
  ["KG", [6, 7, 8, 9]], // Kyrgyzstan
  ["LA", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Laos
  ["LV", [5, 6, 9, 10]], // Latvia
  ["LB", [4, 5, 9, 10]], // Lebanon
  ["LS", [9, 10, 11, 12, 1, 2, 3, 4]], // Lesotho
  ["LR", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Liberia
  ["LY", [3, 4, 10, 11]], // Libya
  ["LI", [5, 6, 9, 10]], // Liechtenstein
  ["LT", [5, 6, 9, 10]], // Lithuania
  ["LU", [5, 6, 9, 10]], // Luxembourg
  ["MK", [5, 6, 9, 10]], // Macedonia
  ["MG", [4, 5, 6, 9, 10, 11]], // Madagascar
  ["MW", [5, 6, 7, 8, 9, 10]], // Malawi
  ["MY", [11, 12, 1, 2]], // Malaysia
  ["MV", [11, 12, 1, 2]], // Maldives
  ["ML", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Mali
  ["MT", [5, 6, 9, 10]], // Malta
  ["MH", [6, 7, 8, 9, 10]], // Marshall Islands
  ["MR", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Mauritania
  ["MU", [6, 7, 8, 9, 10]], // Mauritius
  ["MX", [11, 12, 1, 2]], // Mexico
  ["FM", [6, 7, 8, 9, 10]], // Micronesia
  ["MD", [5, 6, 9, 10]], // Moldova
  ["MC", [5, 6, 9, 10]], // Monaco
  ["MN", [6, 7, 8, 9]], // Mongolia
  ["ME", [5, 6, 9, 10]], // Montenegro
  ["MA", [4, 5, 9, 10, 11]], // Morocco
  ["MZ", [4, 5, 6, 7, 8, 9, 10, 11]], // Mozambique
  ["MM", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Myanmar
  ["NA", [5, 6, 7, 8, 9, 10]], // Namibia
  ["NR", [6, 7, 8, 9, 10]], // Nauru
  ["NP", [10, 11, 12, 1, 2, 3, 4, 9]], // Nepal
  ["NL", [5, 6, 9, 10]], // Netherlands
  ["NZ", [3, 4, 10, 11]], // New Zealand
  ["NI", [12, 1, 2, 3, 11]], // Nicaragua
  ["NE", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Niger
  ["NG", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Nigeria
  ["KP", [6, 7, 8, 9]], // North Korea
  ["NO", [6, 7, 8, 9, 10]], // Norway
  ["OM", [11, 12, 1, 2, 3]], // Oman
  ["PK", [11, 12, 1, 2, 9, 10]], // Pakistan
  ["PW", [6, 7, 8, 9, 10]], // Palau
  ["PA", [12, 1, 2, 3, 11]], // Panama
  ["PG", [6, 7, 8, 9, 10]], // Papua New Guinea
  ["PY", [4, 5, 9, 10]], // Paraguay
  ["PE", [12, 1, 2, 3, 6, 7, 8, 9, 10, 11]], // Peru
  ["PH", [11, 12, 1, 2]], // Philippines
  ["PL", [5, 6, 9, 10]], // Poland
  ["PT", [5, 6, 9, 10]], // Portugal
  ["QA", [11, 12, 1, 2, 3]], // Qatar
  ["RO", [5, 6, 9, 10]], // Romania
  ["RU", [6, 7, 8, 9, 10]], // Russia
  ["RW", [6, 7, 8, 9, 10]], // Rwanda
  ["KN", [1, 2, 3, 11, 12]], // Saint Kitts and Nevis
  ["KP", [6, 7, 8, 9]], // North Korea
  ["LC", [1, 2, 3, 11, 12]], // Saint Lucia
  ["VC", [1, 2, 3, 11, 12]], // Saint Vincent and the Grenadines
  ["WS", [6, 7, 8, 9, 10]], // Samoa
  ["SM", [5, 6, 9, 10]], // San Marino
  ["ST", [6, 7, 8, 9, 10]], // Sao Tome and Principe
  ["SA", [11, 12, 1, 2, 9, 10]], // Saudi Arabia
  ["SN", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Senegal
  ["RS", [5, 6, 9, 10]], // Serbia
  ["SC", [6, 7, 8, 9, 10]], // Seychelles
  ["SL", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Sierra Leone
  ["SG", [11, 12, 1, 2]], // Singapore
  ["SK", [5, 6, 9, 10]], // Slovakia
  ["SI", [5, 6, 9, 10]], // Slovenia
  ["SB", [6, 7, 8, 9, 10]], // Solomon Islands
  ["SO", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Somalia
  ["ZA", [3, 4, 10, 11]], // South Africa
  ["KR", [6, 7, 8, 9, 10]], // South Korea
  ["SS", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // South Sudan
  ["ES", [5, 6, 9, 10]], // Spain
  ["LK", [11, 12, 1, 2, 9, 10]], // Sri Lanka
  ["SD", [11, 12, 1, 2, 6, 7, 8, 9, 10]], // Sudan
  ["SR", [1, 2, 11, 12]], // Suriname
  ["SY", [4, 5, 9, 10]], // Syria
  ["SE", [6, 7, 8, 9, 10]], // Sweden
  ["CH", [5, 6, 9, 10]], // Switzerland
  ["SY", [4, 5, 9, 10]], // Syria
  ["TW", [3, 4, 10, 11]], // Taiwan
  ["TJ", [6, 7, 8, 9]], // Tajikistan
  ["TZ", [6, 7, 8, 9, 10]], // Tanzania
  ["TH", [11, 12, 1, 2]], // Thailand
  ["TG", [11, 12, 1, 2, 7, 8, 9, 10]], // Togo
  ["TO", [6, 7, 8, 9, 10]], // Tonga
  ["TT", [1, 2, 3, 11, 12]], // Trinidad and Tobago
  ["TN", [3, 4, 10, 11]], // Tunisia
  ["TR", [5, 6, 9, 10]], // Turkey
  ["TM", [6, 7, 8, 9, 10]], // Turkmenistan
  ["TV", [6, 7, 8, 9, 10]], // Tuvalu
  ["UG", [6, 7, 8, 9, 10]], // Uganda
  ["UA", [5, 6, 9, 10]], // Ukraine
  ["AE", [11, 12, 1, 2, 9, 10]], // United Arab Emirates
  ["GB", [5, 6, 9, 10]], // United Kingdom
  ["US", [5, 6, 9, 10]], // United States
  ["UY", [4, 5, 9, 10]], // Uruguay
  ["UZ", [6, 7, 8, 9]], // Uzbekistan
  ["VU", [6, 7, 8, 9, 10]], // Vanuatu
  ["VA", [5, 6, 9, 10]], // Vatican City
  ["VE", [12, 1, 2, 3, 11]], // Venezuela
  ["VN", [11, 12, 1, 2, 5, 6, 9, 10]], // Vietnam
  ["YE", [11, 12, 1, 2, 9, 10]], // Yemen
  ["ZM", [5, 6, 7, 8, 9, 10]], // Zambia
  ["ZW", [5, 6, 7, 8, 9, 10]], // Zimbabwe
];

export default bestMonthsToVisit.reduce<Record<string, number[]>>(
  (accumulator, currentVal) => {
    accumulator[currentVal[0]] = currentVal[1];
    return accumulator;
  },
  {}
);
