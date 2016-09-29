if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
function getGoods(id) {
    return parseInt($("[id=" + id + "]")[0].innerHTML.replace(',', ''));
}
function write() {
    "use strict";
    var resourcesBox = $('[class="barbarianCityInfosText"]');
    if (resourcesBox.length == 0) {
        return;
    }
    var wood = getGoods("js_islandBarbarianResourceresource");
    var wine = getGoods("js_islandBarbarianResourcetradegood1");
    var marble = getGoods("js_islandBarbarianResourcetradegood2");
    var glass = getGoods("js_islandBarbarianResourcetradegood3");
    var sulfur = getGoods("js_islandBarbarianResourcetradegood4");
    var sum = wood + wine + marble + glass + sulfur;
    var shipsCount = Math.ceil(sum / 500);

    var placeForText = $("div[class=barbarianCityKingSpeech]");
    placeForText.text(zJS.Lang.You_will_rob+" " + sum +" "+ zJS.Lang.Resources+ ", "+zJS.Lang.you_need +" "+ shipsCount +" " + zJS.Lang.ships);
}
zJS.Page.barbarianVillage = {
    init: function() {
        write();
    },
    refresh: function() {
        this.init();
    }
};