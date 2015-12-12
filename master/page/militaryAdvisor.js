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
        this.$js_MilitaryMovementsFleetMovementsTable = $('#js_MilitaryMovementsFleetMovementsTable');
        if(zJS.Options.getOption('movement_tabs')) {
            this.movementTabs();
        }
        this.movementView();
    },

    movementTabs: function(){
        var tab_moves={
            all: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon').length,
            plunder: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.plunder').length,
            occupy: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.occupy').length,
            blockade: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.blockade').length,
            transport: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.transport').length,
            deployarmy: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.deployarmy').length,
            deployfleet: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.deployfleet').length,
            defend: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.defend').length,
            defend_port: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.defend_port').length,
            trade: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.trade').length,
            piracyRaid: this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon.piracyRaid').length
        };
        this.$js_MilitaryMovementsFleetMovementsTable.find('table:not(.ikaeasy_complete)').before('<ul id="ikaeasy_military_movements"><li id="ikaez_movements_all_li"><a href="#" class="ikaez_active" data-ikaeztype="all"><div id="ikaez_movements_all">' + zJS.Lang.movements.all + '</div><div class="ikaez_badge">' + tab_moves.all + '</div></a></li><li><a href="#" data-ikaeztype="transport"><img width="35" src="skin/interface/mission_transport.png" alt="' + zJS.Lang.movements.transport + '"><div class="ikaez_badge">' + tab_moves.transport + '</div></a></li><li><a href="#" data-ikaeztype="plunder"><img width="35"  src="skin/interface/mission_plunder.png" alt="' + zJS.Lang.movements.plunder + '"><div class="ikaez_badge">' + tab_moves.plunder + '</div></a></li><li><a href="#" data-ikaeztype="occupy"><img  width="35" src="skin/interface/mission_occupy.jpg" alt="' + zJS.Lang.movements.occupy + '"><div class="ikaez_badge">' + tab_moves.occupy + '</div></a></li><li><a href="#" data-ikaeztype="blockade"><img width="35"  src="skin/interface/mission_blockade.png" alt="' + zJS.Lang.movements.blockade + '"><div class="ikaez_badge">' + tab_moves.blockade + '</div></a></li><li><a href="#" data-ikaeztype="deployarmy"><img width="35"  src="skin/interface/mission_deployarmy.png" alt="' + zJS.Lang.movements.deployarmy + '"><div class="ikaez_badge">' + tab_moves.deployarmy + '</div></a></li><li><a href="#" data-ikaeztype="deployfleet"><img width="35" src="skin/interface/mission_deployfleet.png" alt="' + zJS.Lang.movements.deployfleet + '"><div class="ikaez_badge">' + tab_moves.deployfleet + '</div></a></li><li><a href="#" data-ikaeztype="defend"><img width="35" src="skin/interface/mission_defend.png" alt="' + zJS.Lang.movements.defend + '"><div class="ikaez_badge">' + tab_moves.defend + '</div></a></li><li><a href="#" data-ikaeztype="defend_port"><img width="35" src="skin/interface/mission_defend_port.png" alt="' + zJS.Lang.movements.defend_port + '"><div class="ikaez_badge">' + tab_moves.defend_port + '</div></a></li><li><a href="#" data-ikaeztype="trade"><img width="35" src="skin/interface/mission_trade.png" alt="' + zJS.Lang.movements.trade + '"><div class="ikaez_badge">' + tab_moves.trade + '</div></a></li><li><a href="#" data-ikaeztype="piracyRaid"><img width="35" src="skin/interface/mission_piracyRaid.png" alt="' + zJS.Lang.movements.piracyRaid + '"><div class="ikaez_badge">' + tab_moves.piracyRaid + '</div></a></li></ul>').addClass('ikaeasy_complete');
        var $ikaeasy_militaryView_cb = $("#ikaeasy_military_movements a");


        $ikaeasy_militaryView_cb.on("click", function () {
            var action = $(this).data('ikaeztype');
            $ikaeasy_militaryView_cb.removeClass('ikaez_active');
            $(this).addClass('ikaez_active');
            zJS.Page.militaryAdvisor._updateTableActions(action);
            //zJS.Utils.settingsStorage.setItem('MilitaryMovements_tab', action);
        });
    },

    _updateTableActions: function(action) {
        console.log('update table actions');
        if (action == "all") {
            this.$js_MilitaryMovementsFleetMovementsTable.find('tr').show();
        } else {
            this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.mission_icon').hide();
            this.$js_MilitaryMovementsFleetMovementsTable.find('tr').has('.' + action).show();
        }
    },

    movementView: function(){
        var db = zJS.DB._loadDB();


        this.$js_MilitaryMovementsFleetMovementsTable.find('td').each(function() {
            $(this).css('padding', '4px 0px').removeClass('right');
        });

        var total,
            self = this;

        // Отображение войск и флотов в военном советнике.
        this.$js_MilitaryMovementsFleetMovementsTable.find('tr:not(.ikaeasy_complete)').has('td').each(function() {
            console.time('TR movements select');
            total = 0;
            var wrapper = $('<div class="ikaeasy_transport_main"></div>'), res_count = 0;

            if($('.unit_detail_icon', this)[0] != null) {
                console.log($('.unit_detail_icon', this));
                $('.unit_detail_icon', this).each(function() {
                    if($(this).hasClass("resource_icon")){
                        console.log("resource");
                        total += zJS.Utils.format.onlyInt($(this).text());
                        res_count++;
                    }
                    $(wrapper).append($(this));
                });
                if(total && res_count>1) {
                    $(wrapper).append('<span class="ikaez_military_res_total unit_detail_icon resource_icon floatleft' +
                        ' icon40 bold center"><img src="' + db.images.resources.all + '"> ' + total + '</span>');
                }

                $('td', this).eq(3).empty().append(wrapper).attr('colspan', '2');
                $('td', this).eq(4).remove();
            }

            if(zJS.Options.getOption("arrivalTime")) {
                self.arrivalTime(this);
            }
            $(this).addClass('ikaeasy_complete');
            console.timeEnd('TR movements select');
        });
    },

    arrivalTime: function(_this){
        var diffTime = new Date() - zJS.Var.serverTime(),
            $timeContainer = $('span[id$="ArrivalDate"]', _this);
        var arr_time = zJS.Utils.Date.fromString($timeContainer.text());
        var arrival_date = new Date(arr_time.getTime()+diffTime),
            format = "HH:mm:ss";
        if(new Date().getDate() < arrival_date.getDate()){
            format = "DD.MM.YY HH:mm:ss";
        }
        $timeContainer.addClass("ikaez_hidden")
            .after('<span class="IkaEasy_transport_date">' + moment(arrival_date).format(format) + '</span>');
    },

    refresh: function() {
        this.init();
    }
};