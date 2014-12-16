if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.island = {
    init: function() {

        var wood_lvl = zJS.Var.getIsland()['wood'];
        var res_lvl = zJS.Var.getIsland()['tradegood'];
        var wonder_lvl = zJS.Var.getIsland()['wonder'];
        $('#islandresource').append($('<div class="ikaeasy_watcher build_default" style="top:50px; left:70px;"><div class="ikaeasy_watcher_circle">' + wood_lvl + '</div></div>'));
        $('#islandtradegood').append($('<div class="ikaeasy_watcher build_default" style="top:60px; left:80px;"><div class="ikaeasy_watcher_circle">' + res_lvl + '</div></div>'));
        $('#islandwonder').append($('<div class="ikaeasy_watcher build_default" style="top:125px; left:60px;"><div class="ikaeasy_watcher_circle">' + wonder_lvl + '</div></div>'));

        this._showIslandInfo();
        this._sendWorld();
        this._addMarker();
        this._colorizeCities();
    },

    refresh: function() {
        console.log('===== REFRESH =====');
        this._showIslandInfo(false);
        this._sendWorld();
        this._addMarker();
        this._colorizeCities();
    },

    _colorizeCities: function() {
        //Подчищаем
        for(var i = 0; i < 17; i++) {
            $('#js_cityLocation' + i + 'LinkHover').attr('class', 'hover island_feature_img invisible');
            $('#js_cityLocation' + i + 'Link').attr('class', 'link_img island_feature_img');
            $('#js_cityLocation' + i + 'Link .flag').attr('class', 'position flag animation_16steps');
        }
        //debugger;
        var allys = zJS.Utils.marker.getAllAllys();
        for(var i = 0; i < 17; i++) {
            var City = $('#cityLocation').find(i);
            if(!$(City).hasClass('own') && !$(City).hasClass('ally') && !$(City).hasClass('treaty')) {
                for(var q = 0; q < allys.length; q++) {
                    for(var s = 0; s < allys[q].length; s++) {
                        var allyTag = zJS.Var.getIsland()['cities'][i].ownerAllyTag == null && zJS.Var.getIsland()['cities'][i].type != 'buildplace' ? '-' : zJS.Var.getIsland()['cities'][i].ownerAllyTag;
                        if(allyTag == allys[q][s]) {
                            if($('#cityLocation' + i).hasClass('animated_off')) {
                                $('#js_cityLocation' + i + 'Link').addClass('ikaeasy_city_link_' + zJS.Utils.marker.getColorById(q));
                                $('#js_cityLocation' + i + 'LinkHover').addClass('ikaeasy_city_linkHover_' + zJS.Utils.marker.getColorById(q));
                            }
                            else {
                                $('#js_cityLocation' + i + 'Link').addClass('ikaeasy_city_link_' + zJS.Utils.marker.getColorById(q) + '_animated');
                                $('#js_cityLocation' + i + 'LinkHover').addClass('ikaeasy_city_linkHover_' + zJS.Utils.marker.getColorById(q));
                                $('#js_cityLocation' + i + 'Link .flag').addClass('ikaeasy_flag_' + zJS.Utils.marker.getColorById(q) + '_animated');
                            }
                        }
                    }
                }

            }
        }
    },

    _addMarker: function() {
        //Чистим себя на случай обновления страницы
        $('#markerMenu').remove();
        $('#ikaeasy_marker_btn').remove();
        var $body = $('body');
        var markerMenu = $('<div id="markerMenu" style="display: none;"><div id="markerMenuTitle">Alliance marker</div></div>').appendTo($body);
        $('<div id="markerLeft"></div>').appendTo($(markerMenu));
        var cityColors = zJS.Utils.marker.getMarkerColors();
        for(var i = 0; i < cityColors.length; i++) {
            $('<div class="ikaeasy_marker_ally_list"><div class="cityBox ' + cityColors[i] + '" id="' + cityColors[i] + '" /></div>').appendTo($(markerMenu));
            $('.cityBox').eq(i).click(function() {
                zJS.Utils.marker.setAllyColor($('#js_selectedCityAllyName').text(), this.id);
                zJS.Page.island._colorizeCities();
                $(markerMenu).hide(500).delay(500).hide(1);
                setTimeout(zJS.Page.island._addMarker, 500);
            });
            var allysByColor = zJS.Utils.marker.getAllysByColor(cityColors[i]);
            for(var q = 0; q < allysByColor.length; q++) {
                var delP = $('<p class="markerAllys" style="cursor:pointer;">' + allysByColor[q] + '</p>');
                $(delP).click(function() {
                    zJS.Utils.marker.deleteAlly($(this).text());
                    //zJS.Page.island._addMarker();
                    $(this).remove();
                    zJS.Page.island._colorizeCities();
                });
                $('.ikaeasy_marker_ally_list').eq(i).append($(delP));
            }
        }

        $('<div id="markerRight"></div>').appendTo($(markerMenu));

        var markerBtn = $('<span id="ikaeasy_marker_btn" />').click(function(e) {
            if($(markerMenu).css('display') == 'none') {
                var position = $(sidebar).position();
                $(markerMenu).show(1000).offset({left: position.left + 230, top: position.top + 19});
            }
            else {
                $(markerMenu).hide(500);
            }
        }).appendTo($('#js_selectedCityAlly').find('.icons'));
        $body.mouseup(function(e) {
            if(e.target.id != "ikaeasy_marker_btn" && e.target.id != "markerMenu" && e.target.className != "ikaeasy_marker_ally_list" && e.target.className != "markerAllys")
                $(markerMenu).hide(500);
        });
    },

    _showIslandInfo: function(UpdateLevel) {
        UpdateLevel = typeof UpdateLevel !== 'undefined' ? UpdateLevel : true;
        console.log('SHOW ISLAND INFO ===');
        var id = zJS.Var.getIsland()['islandId'],
            cities = zJS.Var.getIsland()['cities'],
            _now = Math.floor((new Date()).getTime() / 1000);

        var users = {}, users_req = {}, islands_data = {}, active_cities=0;
        if(zJS.Utils.ls.getValue('users')) {
            users = zJS.Utils.ls.getValue('users');
        }
        if(zJS.Utils.ls.getValue('islands_data')){
            islands_data=zJS.Utils.ls.getValue('islands_data');
        }


if(!$('.ikaez_score').length>0) {
    $.each(cities, function(k, v) {
        if(v.type == "city") {
            active_cities++;
            console.log(v.id);
            var score = ((!users[v.ownerId]) || (!users[v.ownerId]['h']) || (users[v.ownerId]['e'] < _now)) ? '<span class="ikaez_score"></span>' : '<span class="ikaez_score"> #' + users[v.ownerId]['h'] + '</span>',
                ally = ((v.ownerAllyTag) && (v.ownerAllyTag != '')) ? ' [' + v.ownerAllyTag + ']' : '',
                level = ((v.level) && (v.level != '')) ? '<div class="ikaeasy_levelcity">' + v.level + '</div>' : '',
                $cashe_city_gl = $('#cityLocation' + k),
                BD;
            if($cashe_city_gl.hasClass("own") && score && score != '') {
                BD = ((v.level) && (v.level != '')) ? Math.floor(v.level / 4 + 3) : '';
            }
            else {
                BD = (v.level) ? Math.floor(v.level / 4 + 3) - 2 : false;
            }
            var BD_WRAP = (BD != false) ? '<span class="ikaeasy_BD"><img src="skin/resources/icon_actionpoints.png" />' + BD + '</span>' : '',
                $cashe_city = $('#js_cityLocation' + k + 'TitleText');
            var city = $cashe_city.html() + ally + score + BD_WRAP;
            $cashe_city.html(city);
            if(UpdateLevel == true) {
                $cashe_city_gl.append(level);
            }

            this._recalcWidth(k);
            if((((!users[v.ownerId]) || (!users[v.ownerId]['h']) || (users[v.ownerId]['e'] < _now)) && (!users_req[v.ownerId]))) {
                users_req[v.ownerId] = [k];
                $.get('http://' + top.location.host + '/index.php?view=cityDetails&destinationCityId=' + v.id + '&ajax=1', function(data) {
                    data = $.parseJSON(data)[1][1][1];

                    var score = $.trim(data.match(/id="js_selectedCityScore">([^<]+)</)[1].replace(/[\s]+/, '')),
                    //city_level = $.trim(data.match(/id="js_selectedCityLevel">([^<]+)</)[1].replace(/[\s]+/, '')),
                        __score = score.split(/[^\d]/);
                    var _score = __score[0];

                    if(__score.length >= 3) {
                        _score += '.' + __score[1][0];
                    }
                    for(var i = 1; i < __score.length; i++) {
                        _score += 'k';
                    }
                    users[v.ownerId] = {'h': _score, 's': score.replace(/[^\d]+/g, ''), 'e': _now + 43200};
                    zJS.Utils.ls.setValue('users', users, 86400);

                    $.each(users_req[v.ownerId], function(k, v) {
                        var $cashe_score = $('#js_cityLocation' + v + 'TitleText span.ikaez_score');
                        $cashe_score.html('#'+_score);
                        //var $cashe_city_gll = $('#cityLocation' + k);
                        this._recalcWidth(v);
                    }.bind(this));

                    this._sendWorld();
                }.bind(this));
            }
            else if(users_req[v.ownerId]) {
                users_req[v.ownerId].push(k);
            }
        }
    }.bind(this));
}


        if(islands_data[id] && parseInt(islands_data[id]['count'])!=active_cities){
            this._sendWorld(true);
        }

        $('#cities').find('div.islandfeature div.scroll_img').each(function() {
            var w = 9;
            $(this).find('div').each(function() {
                w += parseInt($(this).width());
            });

            $(this).css({width: w, left: parseInt($(this).parent().width()) / 2 - w / 2});
        });
    },

    _recalcWidth: function(k) {
        var w = 9, obj = $('#js_cityLocation' + k + 'TitleScroll');
        $(obj).find('div').each(function() {
            w += parseInt($(this).width());
        });

        $(obj).css({width: w, left: 55 - w / 2});
    },

    _sendWorld: function(force) {
        console.log(force);
        force = typeof force !== 'undefined' ? force : false;
        var islands_data = {}, active_cities=0;
        if(zJS.Utils.ls.getValue('islands_data')) {
            islands_data = zJS.Utils.ls.getValue('islands_data');
        }
        console.log('send map');
        var id = zJS.Var.getIsland()['islandId'], cities = zJS.Var.getIsland()['cities'], _now = Math.floor((new Date()).getTime() / 1000) - 3;
        if(!islands_data[id] || force===true) {
            var score = {},
                users = zJS.Utils.ls.getValue('users'),
                data = zJS.Var.getIsland(),
                ok = true
                ;

            $.each(cities, function(k, v) {
                if(v.type == "city") {
                    active_cities++;
                    if(force!==true) {
                        if((!users[v.ownerId]) || (!users[v.ownerId]['h']) || (users[v.ownerId]['e'] < _now)) {
                            ok = false;
                            return false;
                        }
                    }

                    score[v.ownerId] = users[v.ownerId]['s'];
                }
            }.bind(this));

            if(!ok) {
                console.log('map: !ok');
                return;
            }

            data['server'] = this.get_server_domain();
            data['world'] = this.get_server_world().substring(1);
            data['score'] = score;

            postJSON('http://ikalogs.ru/common/world/', data);

            // zJS.Utils.askms({type : 'ajax', url : 'http://ikalogs.ru/common/world/', 'method' : 'post', vars : data}, false);
            islands_data[id]={'status': true, 'count':active_cities};
            zJS.Utils.ls.setValue('islands_data', islands_data, 86400 * 2);
        }
    },

    get_server_domain: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[2] : false) || 'ru';
    },

    get_server_world: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[1] : false) || 's?';
    }
};
