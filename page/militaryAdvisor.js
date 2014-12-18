if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
/*
 classes in TR:
 .plunder - набег
 .blockade - блокада
 .transport - транспортировка
 .deployarmy - размещение войска
 .deployfleet - размещение флота
 .defend - защита
 .defend_port - защита порта
 .occupy - окупация
 .trade - обмен
 Who's movements:
 .mission.arrow_right_green - Мои войска в пути
 .mission.arrow_left_green - Мои войска возращаются
 .piracyRaid - пираты


 */

//<tr><td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="plunder" id="ikaeasy_militaryView_cb_plunder" checked/><label for="ikaeasy_militaryView_cb_plunder"> Набег</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb"  id="ikaeasy_militaryView_cb_blockade" data-ikaeztype="blockade" checked/><label for="ikaeasy_militaryView_cb_blockade"> Блокада</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="transport" id="ikaeasy_militaryView_cb_transport" checked/><label for="ikaeasy_militaryView_cb_transport"> Транпортировка</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="deployarmy" id="ikaeasy_militaryView_cb_deployarmy" checked/><label for="ikaeasy_militaryView_cb_deployarmy"> размещение войска</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="defend"  id="ikaeasy_militaryView_cb_defend" checked/><label for="ikaeasy_militaryView_cb_defend"> Защита</label></td> <td><input type="checkbox" class="ikaeasy_militaryView_cb" data-ikaeztype="deployfleet"  id="ikaeasy_militaryView_cb_deployfleet" checked/><label for="ikaeasy_militaryView_cb_deployfleet"> размещение флота</label></td> <td></td> <td></td> </tr>
zJS.Page.militaryAdvisor = {
    init: function() {
        var $js_MilitaryMovementsFleetMovementsTable = $('#js_MilitaryMovementsFleetMovementsTable');
        var tab_moves={
            all: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon').length,
            plunder: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.plunder').length,
            occupy: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.occupy').length,
            blockade: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.blockade').length,
            transport: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.transport').length,
            deployarmy: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.deployarmy').length,
            deployfleet: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.deployfleet').length,
            defend: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.defend').length,
            defend_port: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.defend_port').length,
            trade: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.trade').length,
            piracyRaid: $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.piracyRaid').length
        };
        $js_MilitaryMovementsFleetMovementsTable.find('table:not(.ikaeasy_complete)').before('<ul id="ikaeasy_military_movements"><li id="ikaez_movements_all_li"><a href="#" class="ikaez_active" data-ikaeztype="all"><div id="ikaez_movements_all">'+zJS.Lang.movements.all+'</div><div class="ikaez_badge">'+tab_moves.all+'</div></a></li><li><a href="#" data-ikaeztype="transport"><img width="35" src="skin/interface/mission_transport.png" alt="'+zJS.Lang.movements.transport+'"><div class="ikaez_badge">'+tab_moves.transport+'</div></a></li><li><a href="#" data-ikaeztype="plunder"><img width="35"  src="skin/interface/mission_plunder.png" alt="'+zJS.Lang.movements.plunder+'"><div class="ikaez_badge">'+tab_moves.plunder+'</div></a></li><li><a href="#" data-ikaeztype="occupy"><img  width="35" src="skin/interface/mission_occupy.jpg" alt="'+zJS.Lang.movements.occupy+'"><div class="ikaez_badge">'+tab_moves.occupy+'</div></a></li><li><a href="#" data-ikaeztype="blockade"><img width="35"  src="skin/interface/mission_blockade.png" alt="'+zJS.Lang.movements.blockade+'"><div class="ikaez_badge">'+tab_moves.blockade+'</div></a></li><li><a href="#" data-ikaeztype="deployarmy"><img width="35"  src="skin/interface/mission_deployarmy.png" alt="'+zJS.Lang.movements.deployarmy+'"><div class="ikaez_badge">'+tab_moves.deployarmy+'</div></a></li><li><a href="#" data-ikaeztype="deployfleet"><img width="35" src="skin/interface/mission_deployfleet.png" alt="'+zJS.Lang.movements.deployfleet+'"><div class="ikaez_badge">'+tab_moves.deployfleet+'</div></a></li><li><a href="#" data-ikaeztype="defend"><img width="35" src="skin/interface/mission_defend.png" alt="'+zJS.Lang.movements.defend+'"><div class="ikaez_badge">'+tab_moves.defend+'</div></a></li><li><a href="#" data-ikaeztype="defend_port"><img width="35" src="skin/interface/mission_defend_port.png" alt="'+zJS.Lang.movements.defend_port+'"><div class="ikaez_badge">'+tab_moves.defend_port+'</div></a></li><li><a href="#" data-ikaeztype="trade"><img width="35" src="skin/interface/mission_trade.png" alt="'+zJS.Lang.movements.trade+'"><div class="ikaez_badge">'+tab_moves.trade+'</div></a></li><li><a href="#" data-ikaeztype="piracyRaid"><img width="35" src="skin/interface/mission_piracyRaid.png" alt="'+zJS.Lang.movements.piracyRaid+'"><div class="ikaez_badge">'+tab_moves.piracyRaid+'</div></a></li></ul>').addClass('ikaeasy_complete');
        var $ikaeasy_militaryView_cb=$("#ikaeasy_military_movements a");


        $ikaeasy_militaryView_cb.on("click", function() {
            var action=$(this).data('ikaeztype');
            $ikaeasy_militaryView_cb.removeClass('ikaez_active');
            $(this).addClass('ikaez_active');
            updateTableActions(action);
            //zJS.Utils.settingsStorage.setItem('MilitaryMovements_tab', action);
        });

        function updateTableActions(action){
            console.log('update table actions');
            if(action=="all") {
                $js_MilitaryMovementsFleetMovementsTable.find('tr').show();
            }else{
                $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon').hide();
                $js_MilitaryMovementsFleetMovementsTable.find('tr').has('.' + action).show();
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