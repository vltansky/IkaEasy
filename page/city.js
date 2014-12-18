if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.city = {
    init: function() {
        //this.play_sound();
        this._updateBuilds();

        this.infoBlock();
        this._watcher();
        $('#portOccupierShip1').css('z-index', '9999999');
        $('#portOccupierShip2').css('z-index', '9999999');
        setInterval(this._update_watcher.bind(this), 1000);
    },

    refresh: function() {
        $('#ikaeasy_builds').remove();
        this.init();
    },
    play_sound: function(){
        var audio = new Audio('http://crypteia.webatu.com/sounds/city-view.ogg');
        audio.volume=0.2;
        audio.play();
    },
    infoBlock: function(){
       var warehouses=$('.building.warehouse'), sum_lvl=0;
        console.log(warehouses);
        for(var i=0;i<warehouses.length;i++){
            sum_lvl+=parseInt($(warehouses[i]).attr('class').match(/level(\d+)/)[1]);
        }
        var protecred_resources=sum_lvl*480+100;
        console.log(protecred_resources);
    },
    _updateBuilds: function() {
        var emb = false, myCity = zJS.Var.isMyCity();

        this._builds = {};
        var builds = zJS.Var.getTransferVars()['builds'];
        $.each(builds, function(k, v) {
            v['building'] = jQuery.trim(v['building'].replace('constructionSite', ''));

            if(!this._builds[v['building']]) {
                this._builds[v['building']] = {};
            }

            this._builds[v['building']][k] = v;
            this._builds[v['building']][k].position = k;

            if((myCity) && (!emb) && (v['building'] == 'embassy')) {
                emb = {title: v['name'], pos_id: k, city_id: zJS.Var.getCityId()};
                zJS.Utils.ls.setValue('embassy', emb);
            }
        }.bind(this));
    },

    _getBuild: function(name) {
        var build = this._builds[name] || false;
        if(build) {
            $.each(build, function(k, v) {
                build = v;
                return false;
            });
        }

        return build;
    },

    _getResearch: function() {
        zJS.Utils.getAjax('http://' + top.location.host + '/index.php?view=noViewChange&researchType=economy&templateView=researchAdvisor&actionRequest=' + zJS.Var.getActionRequest() + '&ajax=1', function(data) {
            this._checkResearch(data[1][1]);
        }.bind(this));
    },

    _getBuildLvl: function(obj) {
        return $(obj).attr('class').match(/level(\d+)/)[1];
    },

    _watcher: function() {
        this.__watcher_is_updating = true;

        this._watcher_values = zJS.Utils.ls.getValue('watcher_value');
        if(!this._watcher_values) {
            this._getResearch();
        }

        // Узнаем уровень Бюро Архитектора, Плотницкой мастерской и пр.
        this.__watcher_minus = {};
        this.__watcher_minus["wood"] = (this._getBuild('carpentering')) ? (100 - this._getBuild('carpentering')['level']) / 100 : 1;
        this.__watcher_minus["marble"] = (this._getBuild('architect')) ? (100 - this._getBuild('architect')['level']) / 100 : 1;
        this.__watcher_minus["wine"] = (this._getBuild('vineyard')) ? (100 - this._getBuild('vineyard')['level']) / 100 : 1;
        this.__watcher_minus["crystal"] = (this._getBuild('optician')) ? (100 - this._getBuild('optician')['level']) / 100 : 1;
        this.__watcher_minus["sulfur"] = (this._getBuild('fireworker')) ? (100 - this._getBuild('fireworker')['level']) / 100 : 1;

        var redAll = 0;
        if(this._watcher_values.pulley) {
            redAll = 2;
        }
        if(this._watcher_values.geometry) {
            redAll = redAll + 4;
        }
        if(this._watcher_values.spirit) {
            redAll = redAll + 8;
        }
        redAll = (100 - redAll) / 100;

        $.each(this.__watcher_minus, function(k, v) {
            this.__watcher_minus[k] = redAll + v - 1;
        }.bind(this));

        var db = zJS.DB._loadDB();
        var $worldmap = $('#worldmap');
        var worldmap_top = Math.abs($worldmap.offset().top), worldmap_left = Math.abs($worldmap.offset().left);

        var parent = $('<div id="ikaeasy_builds"></div>'), location = $('#locations');
        $worldmap.append(parent);

        $(parent).css({
            top: $(location).css('top'),
            left: $(location).css('left'),
            width: $(location).width(),
            height: $(location).height()
        });

        $.each(this._builds, function(name, builds) {
            $.each(builds, function(pos, build) {
                if(typeof build['level'] == "undefined") {
                    return true;
                }

                var b_coord = db.pos[name];
                if(build['completed']) {
                    b_coord = db.pos['constructionSite'];
                }

                var build_pos = $('#position' + build['position']);

                // Создаем у каждого здания табличку для уровня, а так же блок с ресами
                var block = $('<div class="ikaeasy_watcher" id="ikaeasy_watcher_' + build['position'] + '"><div class="ikaeasy_watcher_circle">' + build['level'] + '</div><div class="ikaeasy_watcher_buttons"><div class="watche_up"></div><div class="watche_down"></div></div><div class="ikaeasy_watcher_tooltip"></div></div>');
                $(block).css({
                    left: parseInt($(build_pos).css('left')) + b_coord[0]['x'],
                    top: parseInt($(build_pos).css('top')) + b_coord[0]['y']
                });

                $('.watche_up', block).attr('onclick', "ajaxHandlerCall('http://" + top.location.host + "/index.php?action=CityScreen&function=upgradeBuilding&actionRequest=" + zJS.Var.getActionRequest() + "&currentCityId=" + zJS.Var.getCityId() + "&cityId=" + zJS.Var.getCityId() + "&position=" + build['position'] + "&level=" + build['level'] + "&backgroundView=city');");

                $(parent).append(block);

                if(!zJS.Var.isMyCity()) {
                    $('#ikaeasy_watcher_' + build['position']).attr('class', 'ikaeasy_watcher build_gray');
                    $('#ikaeasy_watcher_' + build['position'] + ' .ikaeasy_watcher_buttons').hide();
                }
            }.bind(this));
        }.bind(this));

        this.__watcher_is_updating = false;
        this._update_watcher();
    },

    _update_watcher: function() {
        if(!zJS.Var.isMyCity()) {
            return;
        }

        if(this.__watcher_is_updating) {
            return false;
        }

        this.__watcher_is_updating = true;

        this._updateBuilds();
        var db = zJS.DB._loadDB();

        // Узнаем кол-во ресурсов в городе
        var sourceOnCity = zJS.Var.getCityResources();

        // Проверяем, нет ли строящихся зданий?
        var bb_icon = ($('#locations').find('.constructionSite').length > 0) ? 'build_blue' : 'build_green';
        $('#ikaeasy_builds').find('.ikaeasy_watcher').hide();

        $.each(this._builds, function(name, builds) {
            $.each(builds, function(pos, build) {
                if(typeof build['level'] == "undefined") {
                    return true;
                }

                var block = $('#ikaeasy_watcher_' + build['position']);
                var b_source = db.source[name];
                var b_coord = db.pos[name];
                var b_lvl = parseInt(build['level']);

                if(build['completed']) {
                    b_coord = db.pos['constructionSite'];
                    b_lvl++;
                }

                var tooltip = $('.ikaeasy_watcher_tooltip', block);
                $(tooltip).empty();

                var sources_ok = true;
                var class_icon = 'build_red';
                if(b_source[b_lvl - 1]) {
                    $.each(b_source[b_lvl - 1], function(k, v) {
                        if(v == 0) {
                            return true;
                        }

                        var b_minus = Math.floor(v * this.__watcher_minus[k]);
                        var b_need = (sourceOnCity[k] - b_minus);

                        if(b_need < 0) {
                            sources_ok = false;
                        }

                        var line = $('<div class="' + k + '"><div class="ikaeasy_tooltip_left"></div><div class="ikaeasy_tooltip_right"></div><div class="ikaeasy_tooltip_center">' + zJS.Utils.formatNumber(b_need) + '</div></div>');

                        if(b_need < 0) {
                            $(line).addClass('ikaeasy_red');
                        }

                        $(tooltip).append(line);
                    }.bind(this));

                    if(sources_ok) {
                        class_icon = (build['completed']) ? 'build_gray' : bb_icon;
                    }
                }
                else {
                    class_icon = 'build_gray';
                }

                if(build['completed']) {
                    var $worldmap = $('#worldmap');
                    var worldmap_top = Math.abs($worldmap.offset().top), worldmap_left = Math.abs($worldmap.offset().left);
                    var b_coord = db.pos['constructionSite'];
                    var build_pos = $('#position' + build['position']);
                    $(block).css({
                        left: parseInt($(build_pos).css('left')) + b_coord[0]['x'],
                        top: parseInt($(build_pos).css('top')) + b_coord[0]['y']
                    });
                }

                $('.watche_down', block).attr('onclick', "if(confirm('" + zJS.Lang.ConfirmDowngrade + "')){ajaxHandlerCall('http://" + top.location.host + "/index.php?action=CityScreen&function=demolishBuilding&actionRequest=" + zJS.Var.getActionRequest() + "&currentCityId=" + zJS.Var.getCityId() + "&cityId=" + zJS.Var.getCityId() + "&position=" + build['position'] + "&level=" + build['level'] + "&backgroundView=city');}");

                $('#ikaeasy_watcher_' + build['position']).attr('class', 'ikaeasy_watcher ' + class_icon).show();
            }.bind(this));
        }.bind(this));

        this.__watcher_is_updating = false;
    },

    _checkResearch: function(data) {
        data = jQuery.parseJSON(data.new_js_params).currResearchType;

        var result = {};

        $.each(data, function(k, v) {
            if((v.aHref.indexOf('2020') > -1) && (v.liClass == 'explored')) {
                result['pulley'] = true;
            }
            else if((v.aHref.indexOf('2060') > -1) && (v.liClass == 'explored')) {
                result['geometry'] = true;
            }
            else if((v.aHref.indexOf('2100') > -1) && (v.liClass == 'explored')) {
                result['spirit'] = true;
            }
        }.bind(this));

        if(result['spirit']) {
            zJS.Utils.ls.setValue('watcher_value', result);
        }
        else {
            zJS.Utils.ls.setValue('watcher_value', result, 3600);
        }

        // Обновляем список "скидок"
        this.__watcher_minus = {};
        this.__watcher_minus["wood"] = (this._getBuild('carpentering')) ? (100 - this._getBuild('carpentering')['level']) / 100 : 1;
        this.__watcher_minus["marble"] = (this._getBuild('architect')) ? (100 - this._getBuild('architect')['level']) / 100 : 1;
        this.__watcher_minus["wine"] = (this._getBuild('vineyard')) ? (100 - this._getBuild('vineyard')['level']) / 100 : 1;
        this.__watcher_minus["crystal"] = (this._getBuild('optician')) ? (100 - this._getBuild('optician')['level']) / 100 : 1;
        this.__watcher_minus["sulfur"] = (this._getBuild('fireworker')) ? (100 - this._getBuild('fireworker')['level']) / 100 : 1;

        var redAll = 0;
        if(result['pulley']) {
            redAll = 2;
        }
        if(result['geometry']) {
            redAll = redAll + 4;
        }
        if(result['spirit']) {
            redAll = redAll + 8;
        }
        redAll = (100 - redAll) / 100;

        $.each(this.__watcher_minus, function(k, v) {
            this.__watcher_minus[k] = redAll + v - 1;
        }.bind(this));

        this._update_watcher();
    }
};