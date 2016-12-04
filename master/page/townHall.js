/**
 * Created by Tansky on 24.10.2014.
 * Improved time calculation by matobodo on 02.12.2016
 */

if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.townHall = {
    init: function() {
        var inhabitants = [10, 50, 100, 250, 500];
        function result_time(happiness, freespace) {
            var time; //time is in minutes
            var last_happiness = happiness - freespace + 1; //happines when last inhabitant is beeing created
            if (happiness < freespace) {
                time = '\u221E';
            } else {
                time = (-50*Math.log((happiness-freespace)/happiness)).toFixed(1);
            }
            return time;
        }
        var js_TownHallOccupiedSpace = $("#js_TownHallOccupiedSpace").text(),
            js_TownHallMaxInhabitants = $("#js_TownHallMaxInhabitants").text(),
            happiness = $("#js_TownHallHappinessLargeValue").text();
        var freespace = js_TownHallMaxInhabitants - js_TownHallOccupiedSpace;
        var result_hours = [];
        for (var i = 0; i < inhabitants.length; i++) {
            result_hours[i] = result_time(happiness, inhabitants[i]);
        }
        result_hours[result_hours.length] = result_time(happiness, freespace);
        var text = '';
        var display_count = 3;
        for (var i = inhabitants.length - 1; i >= 0 && display_count; i--) {
            if (inhabitants[i] * 2 <= freespace) {
                text = '<br>' + zJS.Lang.Next + ' ' + inhabitants[i] + ' ' + zJS.Lang.in + ' ' + result_hours[i] + ' ' + zJS.Lang.hours + text;
                display_count--;
            }
        }
        text = zJS.Lang.WillBeFullIn + ' ' + result_hours[result_hours.length - 1] + ' ' + zJS.Lang.hours + text;
        $("ul.floatleft li.actions:not(.ikaeasy_complete)").after('<li id="ikaeasy_full_in" class="">' + text + '<br><span style="color:red; font-size:8px;">beta</span></span></li>');
        $("ul.floatleft li.actions").addClass('ikaeasy_complete');
    },

    refresh: function() {
        this.init();
    }
};
