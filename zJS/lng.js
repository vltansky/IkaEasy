if(typeof  zJS == "undefined") {
    zJS = {};
}

var assignedLng = {
    'test': 'en',
    'de': 'de',
    'en': 'en',
    'ru': 'ru',
    'us': 'en',
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
    'rs': 'rs',
    'il': 'he',
    'tr': 'tr'
};

var lang = assignedLng[zJS.Utils.getServerDomain()] || 'en';
console.log(lang);
zJS.Lang = langs.en;

if((lang != 'en') && (langs[lang])) {
    zJS.Lang = $.extend(true, zJS.Lang, langs[lang]);
}
