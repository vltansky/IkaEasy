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
 .mission_icon.deployarmy - размещение войска
 .mission_icon.deployfleet - размещение флота
 .mission_icon.defend - защита

 Who's movements:
 .mission.arrow_right_green - Мои войска в пути
 .mission.arrow_left_green - Мои войска возращаются


 */


zJS.Page.militaryAdvisor = {
    init: function() {
        var action_options=["plunder", "blockade", "transport", "deployarmy", "deployfleet", "defend"];
        var $js_MilitaryMovementsFleetMovementsTable = $('#js_MilitaryMovementsFleetMovementsTable');
        $js_MilitaryMovementsFleetMovementsTable.find('table:not(.ikaeasy_complete)').prepend('<tr><td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="plunder" id="ikaeasy_militaryView_cb_plunder" checked/><label for="ikaeasy_militaryView_cb_plunder"> Набег</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb"  id="ikaeasy_militaryView_cb_blockade" data-ikaeztype="blockade" checked/><label for="ikaeasy_militaryView_cb_blockade"> Блокада</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="transport" id="ikaeasy_militaryView_cb_transport" checked/><label for="ikaeasy_militaryView_cb_transport"> Транпортировка</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="deployarmy" id="ikaeasy_militaryView_cb_deployarmy" checked/><label for="ikaeasy_militaryView_cb_deployarmy"> размещение войска</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="defend"  id="ikaeasy_militaryView_cb_defend" checked/><label for="ikaeasy_militaryView_cb_defend"> Защита</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="deployfleet"  id="ikaeasy_militaryView_cb_deployfleet" checked/><label for="ikaeasy_militaryView_cb_deployfleet"> размещение флота</label></td> <td></td> <td></td> </tr>').addClass('ikaeasy_complete');
        var $ikaeasy_militaryView_cb=$(".ikaeasy_militaryView_cb");

        $ikaeasy_militaryView_cb.each(function() {
            var action=$(this).data('ikaeztype');
            $(this).prop('checked', (zJS.Utils.settingsStorage.getItem('MilitaryMovements_'+action)=== "true"));
        });

        $ikaeasy_militaryView_cb.click(function() {
            //$('#Img', this).addClass('checked');
            //$('#Img', '#ikaeasyIkaeasyTransport').removeClass('checked');
            var action=$(this).data('ikaeztype');
            updateTableActions(action, this.checked);
            zJS.Utils.settingsStorage.setItem('MilitaryMovements_'+action, this.checked);
        });


        for(var i=1;i<action_options.length;i++){
            console.log(action_options[i]+': '+zJS.Utils.settingsStorage.getItem('MilitaryMovements_'+action_options[i]));
            if(zJS.Utils.settingsStorage.getItem('MilitaryMovements_'+action_options[i]) == "false") {
                $js_MilitaryMovementsFleetMovementsTable.find('tr:not(.ikaeasy_complete)').has('.' + action_options[i]).hide();
            }
        }

        function updateTableActions(action, value){
            if(value===true){
                $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.' + action).show("fast");
            }
            else{
                $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.' + action).hide("fast");
            }
        }

        $js_MilitaryMovementsFleetMovementsTable.find('td').each(function() {
            $(this).css('padding', '4px 0px').removeClass('right');
        });

        // Отображение войск и флотов в военном советнике.
        $js_MilitaryMovementsFleetMovementsTable.find('tr:not(.ikaeasy_complete)').has('td').each(function() {
            console.time('TR movements select');
            var wrapper = $('<div class="ikaeasy_transport_main"></div>');

            if($('.unit_detail_icon', this)[0] != null) {
                console.log($('.unit_detail_icon', this));
                $('.unit_detail_icon', this).each(function() {
                    $(wrapper).append($(this));
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
            console.timeEnd('TR movements select');
        });

    },

    refresh: function() {
        this.init();
    }
};