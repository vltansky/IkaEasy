if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.__common = {
    _notes: [],

    init: function() {
        this.notification_init();
        //this._checkUpdates();//@todo доработать проверку событий
        this._transporter();
        this._nextCity();
        this._addOtherButtons();
        this._changeForumBtn();
        this._addIkaEasylinks();
        this._getProduction();
        this._getFinance();
        this._setFinance();
        if(document.getElementsByTagName('body')[0].id !== "worldmap_iso") {
            this._addLinkToIslandFeature();
        }
    },

    refresh: function() {
        console.log('=========== REFRESH =============');
        console.time('refresh');
        //this._checkUpdates();
        $('#ikaeasy_nextCity').remove();
        $('#ikaeasy_transporter').parent().parent().parent().parent().parent().remove();

        $.each(this._notes, function(k, v) {
            $(v).remove();
        });

        this._notes = [];

        $("ul.resources li div p:first-child").parent().parent()
            .css("cursor", "")
            .removeAttr("onClick");
        console.timeEnd('refresh');
        this.init();
    },
    notification_init: function () {
        console.log('check notification');
    if (!Notification) {
        alert('Please us a modern version of Chrome, Firefox, Opera or Firefox.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();

    //var notification = new Notification('IkaEasy: new notification', {
    //    icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
    //    body: message,
    //});


    //notification.onclick = function () {
    //    window.open("http://stackoverflow.com/a/13328397/1269037");
    //}
},
    _checkUpdates: function(){
        $("#js_GlobalMenu_military").addClass('premiumactive');

        chrome.storage.sync.get('last_generalAdvisor_notification', function(data) {
            console.log(data);
        });
        if($("a.premiumactive").length || $("a.normalactive").length){//@todo add non premium active & add what advisor
            console.log('====HAVE NEWS====');
            chrome.storage.sync.set({'last_generalAdvisor_notification': zJS.Utils.getDateNow()}, function() {
                var link = document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'http://www.iconj.com/ico/x/k/xknwndqq9w.ico';
                document.getElementsByTagName('head')[0].appendChild(link);
                new Notification('IkaEasy: new notification', {
                    icon: chrome.extension.getURL('images/advisors/militaryAdvisor.png')//@todo change link
                    //body: message
                });
            });
        }
        else{
            var new_link = document.createElement('link');
            new_link.type = 'image/x-icon';
            new_link.rel = 'shortcut icon';
            new_link.href = '/favicon.ico';
            document.getElementsByTagName('head')[0].appendChild(new_link);

        }
    },
    /*
     * Display resource spend per hour
     */
    _getProduction: function() {
        console.time('_getProduction');
        $('.ikaeasy_delet_me').each(function() {
            $(this).remove();
        });

        var resCol = ['wood', 'wine', 'marble', 'crystal', 'sulfur'];

        for(var i = 0; i < 5; i++) {
            var clas = i == 3 ? 'glass' : resCol[i];
            var tmpVar = i == 0 ? '#js_GlobalMenu_resourceProduction' : '#js_GlobalMenu_production_' + resCol[i];
            var tmpRes = $(tmpVar).text() == '-' ? 0 : $(tmpVar).text().replace(/[^\d+]/g, '');
            if(i == 1) {

                var wineLeftTime,
                    GlobalWine=$("#js_GlobalMenu_wine").text(),
                    k=1;
                while(GlobalWine.slice(-1)=="k"){
                    GlobalWine=GlobalWine.substring(0, GlobalWine.length - 1);
                    k*=10; }
                GlobalWine=(k>1)?GlobalWine.replace(/[^\d+]/g, '')*k:GlobalWine.replace(/[^\d+]/g, '');
                console.log(GlobalWine);
                tmpRes -= $("#js_GlobalMenu_WineConsumption").text().replace(/[^\d+]/g, '');
                if(tmpRes < 0) {
                    wineLeftTime = Math.abs(parseFloat(GlobalWine / tmpRes));
                    wineLeftTime = zJS.Utils.transformHours(wineLeftTime);
                    //@todo В настройках выбирать прим. "показывать расход за день, неделю"
                    var wine_tooltip = '<p class="smallFont ikaeasy_delet_me">' + zJS.Lang.left + ': ' + wineLeftTime + '</p>\
                    <p class="smallFont ikaeasy_delet_me">' + zJS.Lang.per_day + ': ' + zJS.Utils.formatNumber(tmpRes * 24) + '</p>\
                    <p class="smallFont ikaeasy_delet_me">' + zJS.Lang.per_week + ': ' + zJS.Utils.formatNumber(tmpRes * 168) + '</p>';
                    //<p class="smallFont ikaeasy_delet_me">'+zJS.Lang.per_month + ': ' + zJS.Utils.formatNumber(tmpRes*730)+'</p>';
                    $("#js_GlobalMenu_wine_tooltip").prepend(wine_tooltip);
                }
            }
            tmpRes = tmpRes < 0 ? zJS.Utils.formatNumber(tmpRes) : '+' + zJS.Utils.formatNumber(tmpRes);
            var search = i == 0 ? '#js_GlobalMenu_resourceProduction' : '#js_GlobalMenu_production_container_' + resCol[i];
            if($(search)[0].className.indexOf('invisible') == -1 || i == 1) {
                var tmpIns = tmpRes.substring(0, 1) == '-' ? 'ikaeasy_resources_negative' : 'ikaeasy_resources_positive';
                var template;
                if(i == 1 && tmpRes < 0)
                    template = '<div class="ikaeasy_delet_me"><span id="ikaeasy-' + clas + '" class="' + tmpIns + '">' + zJS.Utils.formatNumber(tmpRes) + ' <span class="ikaeasy_wine_left_time">' + wineLeftTime + '</span></span></div>';
                else
                    template = '<div class="ikaeasy_delet_me"><span id="ikaeasy-' + clas + '" class="' + tmpIns + '">' + zJS.Utils.formatNumber(tmpRes) + '</span></div>';
                $(template).appendTo($('#resources_' + clas));
            }
        }
        console.timeEnd('_getProduction');
    },
    /*
     * Get finance per hour
     */
    _getFinance: function() {
        console.time('_getFinance');
        var LocFinanceDate = zJS.Utils.getLocFinance() + '_date';
        if((localStorage.getItem(LocFinanceDate) != null && zJS.Utils.hoursBetween(new Date(), localStorage.getItem(LocFinanceDate)) > 1) || localStorage.getItem(LocFinanceDate) == null) {
            console.log('Ajax get finance');
            try {
                console.time('_getFinance::ajax');
                $.ajax({
                    url: $('#js_GlobalMenu_gold').attr('href'),
                    success: function(data) {
                        var ex;
                        var start = data.indexOf('ikariam.getClass(ajax.Responder') + 'ikariam.getClass(ajax.Responder'.length;
                        var end = data.indexOf("updateTemplateData", start);
                        ex = data.substring(start, end);
                        end = ex.indexOf('updateBackgroundData');
                        start = end - 200;
                        ex = ex.substring(start, end);
                        start = ex.indexOf('<td class=\"hidden bold\">') + '<td class=\"hidden bold\">'.length;
                        ex = ex.substring(start, end);
                        var status = true;
                        if(ex.indexOf('red') > -1)
                            status = false;
                        ex = ex.replace(/[^\d+]/g, '');
                        ex = ex.match(/\d+/); // "3"
                        if(status == false)
                            ex = 0 - ex;

                        //console.log(ex);
                        var LocFinance = zJS.Utils.getLocFinance(),
                            LocFinanceDate = zJS.Utils.getLocFinance() + '_date';

                        localStorage.setItem(LocFinance, ex);
                        localStorage.setItem(LocFinanceDate, new Date());
                    }
                });
                console.timeEnd('_getFinance::ajax');
            }
            catch(err) {
                console.log(err);
            }
        }
        console.timeEnd('_getFinance');
    },
    /*
     * Display gold per hour
     */
    _setFinance: function() {
        console.time('_setFinance');
        var LocFinance = zJS.Utils.getLocFinance();
        var value = localStorage.getItem(LocFinance),
            np_char = 'ikaeasy_green';
        if(value < 0)
            np_char = 'red';
        $("#js_GlobalMenu_gold").append('<span id="IkaEasy_Gold_per_hour" class="ikaeasy_delet_me ' + np_char + '">' + zJS.Utils.formatNumber(value) + '</span>');
        console.timeEnd('_setFinance');
    },

    _changeForumBtn: function() {
        $('#GF_toolbar').find('li.forum a')[0].href = 'http://board.' + zJS.Utils.getServerDomain() + '.ikariam.gameforge.com/index.php?page=Index';
    },
    _addIkaEasylinks: function(){
        var $cashe_el=$('#GF_toolbar').find('li.ikhelp:not(.ikaez_completed)');
        $cashe_el.before('<li class="ikaez_fb_link"><a class="noViewParameters" target="_blank" href="'+zJS.Lang.ikaeasy_link+'" title="IkaEasy"> IkaEasy</a></li>');
        $cashe_el.addClass('ikaez_completed');
    },
    _addOtherButtons: function() {
        console.time('_addOtherButtons');
        if(zJS.Var.getAllyId()) {
            // Кнопка на общее сообщение
            var common_message = zJS.Utils.addToLeftMenu('image_chat', zJS.Lang.Circular_message);
            $(common_message).attr('onclick', "ajaxHandlerCall('?view=sendIKMessage&msgType=51&allyId=" + zJS.Var.getAllyId() + "'); return false;");

            this._notes.push(common_message);
        }

        var emb = zJS.Utils.ls.getValue('embassy');
        if(emb) {
            if(zJS.Utils.ls.getValue('open_embassy')) {
                if(zJS.Var.getCityId() != emb.city_id) {
                    $('#js_cityIdOnChange').val(emb.city_id);
                    $('#changeCityForm').submit();
                }
                else {
                    zJS.Utils.execute_js("ajaxHandlerCall('?view=embassy&cityId=" + emb.city_id + "&position=" + emb.pos_id + "');");
                    zJS.Utils.ls.removeValue('open_embassy');
                }
            }

            // Кнопка на открытие посольства
            var embassy = zJS.Utils.addToLeftMenu('image_embassy', emb.title);
            $(embassy).click(function() {
                if(zJS.Var.getCityId() != emb.city_id) {
                    zJS.Utils.ls.setValue('open_embassy', 1);
                    $('#js_cityIdOnChange').val(emb.city_id);
                    $('#changeCityForm').submit();
                }
                else {
                    zJS.Utils.execute_js("ajaxHandlerCall('?view=embassy&cityId=" + emb.city_id + "&position=" + emb.pos_id + "');");
                }
            });

            this._notes.push(embassy);
        }
        console.timeEnd('_addOtherButtons');
    },
    /*
     * Get and display next city link
     */
    _nextCity: function() {
        console.time('_nextCity');
        if(!this._cities) {
            this._cities = zJS.Var.getTransferVars()['cities'];
        }

        var cnt_cities = 0, _first = false, _next = -1, id = this._cities.selectedCity;
        $.each(this._cities, function(k, v) {
            if(k.indexOf('city_') == 0) {
                cnt_cities++;

                if(!_first) {
                    _first = v.id;
                }

                if(_next == 0) {
                    _next = v.id;
                    return false;
                }

                if(k == id) {
                    _next = 0;
                }
            }
        });

        if(cnt_cities < 2) {
            return;
        }

        var nextCity = $('<li class="ikaeasy_nextCity" id="ikaeasy_nextCity"></li>');
        $('#cityResources').find('.resources').prepend(nextCity);

        $(nextCity).click(function() {
            if(_next < 1) {
                _next = _first;
            }

            $('#js_cityIdOnChange').val(_next);
            $('#changeCityForm').submit();
        }.bind(this));
        console.timeEnd('_nextCity');
    },
    /*
     * Transporter navigation (in left menu)
     */
    _transporter: function() {
        console.time('_transporter');
        this._cities = zJS.Var.getTransferVars()['cities'];
        var cnt_cities = 0;
        $.each(this._cities, function(k, v) {
            if(k.indexOf('city_') == 0) {
                cnt_cities++;
                if(cnt_cities > 1) {
                    return false;
                }
            }
        });

        if(cnt_cities < 2) {
            return;
        }
        var _window = $('<div class="ikaeasy_dynamic"></div>');
        $('body').append(_window);

        var pos = zJS.Utils.ls.getValue('transporter_position');
        if(pos) {
            $(_window).css(pos);
        }

        var li = zJS.Utils.addToLeftMenu('image_transporter', zJS.Lang.Transporter);
        this._notes.push(li);

        var cities = $('<div class="ikaeasy_transporter" id="ikaeasy_transporter"></div>');
        $.each(this._cities, function(k, v) {
            if(k.indexOf('city_') == 0) {
                var line = $(this._getCityName(k));

                if(this._cities[k].relationship != 'ownCity') {
                    if($('#ikaeasy_not_mycities', cities).length == 0) {
                        $(cities).append('<div class="box_border" id="ikaeasy_box_border"></div>');
                        $(cities).append('<div id="ikaeasy_not_mycities"></div>');

                        $('#ikaeasy_box_border', cities).click(function() {
                            $('#ikaeasy_not_mycities', cities).slideToggle('fast', function() {
                                zJS.Utils.ls.setValue('transporter_is_show_not_my', $('#ikaeasy_not_mycities', cities).is(':visible'));
                            });
                        });

                        if(zJS.Utils.ls.getValue('transporter_is_show_not_my')) {
                            $('#ikaeasy_not_mycities', cities).show();
                        }
                    }

                    $('#ikaeasy_not_mycities', cities).append(line);
                }
                else {
                    $(cities).append(line);
                }
            }
        }.bind(this));

        $(_window).append($(zJS.Utils.getDynamicWin(zJS.Lang.Transporter, cities)));

        $(li).click(function() {
            $(_window).fadeToggle('fast', function() {
                zJS.Utils.ls.setValue('transporter_is_show', $(_window).is(':visible'));
            });
        }.bind(this));

        $('.indicator', _window).click(function(e) {
            e.preventDefault();
            $(_window).fadeOut('fast');
            zJS.Utils.ls.setValue('transporter_is_show', false)
        }.bind(this));

        if(zJS.Utils.ls.getValue('transporter_is_show')) {
            $(_window).show();
        }

        new zJS.Utils.draggable($('.dynamic_title', _window), _window, function() {
            zJS.Utils.ls.setValue('transporter_position', $(_window).offset());
        });
        console.timeEnd('_transporter');
    },

    _getCityName: function(id) {
        console.time('_getCityName');
        var city = this._cities[id];
        var html_city = $('<div class="ikaeasy_' + city.relationship + '"><div class="ikaeasy_tr_res"></div><div class="ikaeasy_tr_fleet"></div><div class="ikaeasy_tr_army"></div><span>' + city['coords'] + ' ' + city['name'] + '</span></div>');

        if(id == this._cities.selectedCity) {
            $(html_city).addClass('current_city');
        }
        else {
            $('span', html_city).click(function() {
                $('#js_cityIdOnChange').val(city.id);
                $('#changeCityForm').submit();
            });

            $('.ikaeasy_tr_army', html_city).attr('onclick', "ajaxHandlerCall('?view=deployment&deploymentType=army&destinationCityId=" + city.id + "');");
            $('.ikaeasy_tr_fleet', html_city).attr('onclick', "ajaxHandlerCall('?view=deployment&deploymentType=fleet&destinationCityId=" + city.id + "');");
            $('.ikaeasy_tr_res', html_city).attr('onclick', "ajaxHandlerCall('?view=transport&destinationCityId=" + city.id + "');");
        }

        console.timeEnd('_getCityName');
        return html_city;
    },

    _addLinkToIslandFeature: function() {
        console.time('_addLinkToIslandFeature');
        var resourceType = $("ul.resources li div p:first-child"),
            islandId = zJS.Var.getIsland()['islandId'];

        // Добавляем ссылку для дерева
        $("#resources_wood")
            .css("cursor", "pointer")
            .attr("onClick", "ajaxHandlerCall('?view=resource&type=resource&islandId=" + islandId + "')");

        // Добавляем ссылку для Драгоценного ресурса
        resourceType.not(".invisible").eq(1).parent().parent()
            .css("cursor", "pointer")
            .attr("onClick", "ajaxHandlerCall('?view=tradegood&islandId=" + islandId + "')");
        console.timeEnd('_addLinkToIslandFeature')
    }
};