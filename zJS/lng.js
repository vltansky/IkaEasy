if(typeof  zJS == "undefined") {
    zJS = {};
}

var assignedLng = {
    'ru': 'ru',
    'en': 'en',
    'us': 'en',
    'test': 'en',
    'bg': 'bg',
    'it': 'it',
    'ro': 'ro',
    'br': 'br',
    'lv': 'lv',
    'pl': 'pl',
    'ar': 'es',
    'es': 'es',
    'mx': 'es',
    'ph': 'es',
    'tw': 'tw',
    'de': 'de',
    'rs': 'rs',
    'il': 'il',
    'tr': 'tr'
};

var lang = assignedLng[zJS.Utils.getServerDomain()] || 'en';
console.log(lang);
zJS.Lang = langs.en;

if((lang != 'en') && (langs[lang])) {
    zJS.Lang = $.extend(true, zJS.Lang, langs[lang]);
}
