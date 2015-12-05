/**
 * Created by Tansky on 24.10.2014.
 */

if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.townHall = {
    init: function() {
        var js_TownHallOccupiedSpace = $("#js_TownHallOccupiedSpace").text(),
            js_TownHallMaxInhabitants = $("#js_TownHallMaxInhabitants").text(),
            happiness = $("#js_TownHallHappinessLargeValue").text();
        var freespace = js_TownHallMaxInhabitants - js_TownHallOccupiedSpace;
        var result_hours = 0;
        for(var i = 0; i <= freespace; i++) {
            result_hours += 1 / (happiness / 50);
            freespace--;
        }//ikaeasy_delet_me
        $("ul.floatleft li.actions:not(.ikaeasy_complete)").after('<li id="ikaeasy_full_in" class="">' + zJS.Lang.WillBeFullIn + ' ' + result_hours.toFixed(1) + ' ' + zJS.Lang.hours + '<br><span style="color:red; font-size:8px;">beta</span></span></li>');
        $("ul.floatleft li.actions").addClass('ikaeasy_complete');
    },

    refresh: function() {
        this.init();
    }
};