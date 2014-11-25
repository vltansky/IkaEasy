if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
/*
 classes in TR:
 .mission_icon.plunder - набег
 .mission_icon.blockade - блокада
 .mission_icon.transport - транспортировка
 .mission_icon.deployarmy - размещение
 .mission_icon.defend - защита

 Who's movements:
 .mission.arrow_right_green - Мои войска в пути
 .mission.arrow_left_green - Мои войска возращаются


 */
zJS.Page.militaryAdvisor = {
    init: function() {
        var $js_MilitaryMovementsFleetMovementsTable = $('#js_MilitaryMovementsFleetMovementsTable');
        $js_MilitaryMovementsFleetMovementsTable.find('td').each(function() {
            $(this).css('padding', '4px 0px').removeClass('right');
        });

        // Отображение войск и флотов в военном советнике.
        $js_MilitaryMovementsFleetMovementsTable.find('tr:not(.ikaeasy_complete)').has('td').each(function() {
            var wrapper = $('<div class="ikaeasy_transport_main"></div>');

            if($('.unit_detail_icon', this)[0] != null) {
                $('.unit_detail_icon', this).each(function() {
                    $(wrapper).append($(this).addClass('ikaeasy_transport_unit'));
                });

                $('td', this).eq(3).empty().append(wrapper).attr('colspan', '2');
                $('td', this).eq(4).remove();
            }
            var $arrival_time = $('span[id$="ArrivalTime"]', this);
            var arrival_time = $arrival_time.text();
            var arrival_array = arrival_time.split(' ');
            var Arrival_time = 0;

            for(var i = 0; i < arrival_array.length; i++) {
                if(arrival_array[i].indexOf(zJS.Lang.char_second) !== -1)
                    Arrival_time += arrival_array[i].replace(/[^\d+]/g, '') * 1000;
                else if(arrival_array[i].indexOf(zJS.Lang.char_minute) !== -1)
                    Arrival_time += arrival_array[i].replace(/[^\d+]/g, '') * 60000;//60*1000
                else if(arrival_array[i].indexOf(zJS.Lang.char_hour) !== -1)
                    Arrival_time += arrival_array[i].replace(/[^\d+]/g, '') * 3600000;//60*1000*60
                else if(arrival_array[i].indexOf(zJS.Lang.char_day) !== -1)
                    Arrival_time += arrival_array[i].replace(/[^\d+]/g, '') * 86400000;//60*1000*60*24
            }
            var now = Date.now();
            var now_date = new Date();
            now += Arrival_time;
            var arrival_date = new Date(now);

            var dformat = '';
            if(arrival_date.getDate() != now_date.getDate() || arrival_date.getMonth() != now_date.getMonth())
                dformat = [arrival_date.getDate().padLeft(), (arrival_date.getMonth() + 1).padLeft()].join('.') + ' ';

            dformat += [arrival_date.getHours().padLeft(), arrival_date.getMinutes().padLeft()].join(':');
            $arrival_time.parent().append('<span class="IkaEasy_transport_date">' + dformat + '</span>');
            $(this).addClass('ikaeasy_complete');

        });
    },

    refresh: function() {
        this.init();
    }
};