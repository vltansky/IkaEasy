if(typeof  zJS == "undefined") {
    zJS = {};
}

var assignedLng = {
    'test': 'en',
    'en': 'en',
    'us': 'en',
    'de': 'de',
    'il': 'he',
    'pl': 'pl',
    'ru': 'ru',
    'rs': 'sr',
    'tr': 'tr',
    'ar': 'es',
    'br': 'pt',
    'cl': 'es',
    'co': 'es',
    'dk': 'da',
    'es': 'es',
    'fr': 'fr',
    'it': 'it',
    'lv': 'lv',
    'lt': 'lt',
    'hu': 'hu',
    'mx': 'es',
    'nl': 'nl',
    'no': 'no',
    'pe': 'es',
    'pt': 'pt',
    'ro': 'ro',
    'si': 'sl',
    'sk': 'sk',
    'fi': 'fi',
    'se': 'sv',
    've': 'es',
    'cz': 'cs',
    'gr': 'el',
    'bg': 'bg',
    'ae': 'ar',
    'ir': 'fa',
    'tw': 'zh',
    'hk': 'zh'
};

var lang = assignedLng[zJS.Utils.getServerDomain()] || 'en';
console.log(lang);
zJS.Lang = langs.en;

if((lang != 'en') && (langs[lang])) {
    zJS.Lang = $.extend(true, zJS.Lang, langs[lang]);
}
