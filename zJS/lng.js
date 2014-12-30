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
    'bg': 'bg',
    'it': 'it',
    'ro': 'ro',
    'br': 'br',
    'lv': 'lv',
    'ar': 'es',
    'es': 'es',
    'mx': 'es',
    'ph': 'es',
    'tw': 'tw'
};

var lang = assignedLng[zJS.Utils.getServerDomain()] || 'en';
console.log(lang);
zJS.Lang = langs.en;

if((lang != 'en') && (langs[lang])) {
    zJS.Lang = $.extend(true, zJS.Lang, langs[lang]);
}
