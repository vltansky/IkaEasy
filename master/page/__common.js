if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.__common = {
    _notes: [],
    _pirateButtonStorage: zJS.Utils.ls.getValue(zJS.Utils.getServerPrefix()+'pirateButton'),

    init: function() {

        this.copyright();
        this.notification.init();

        if($("#worldmap_iso").length > 0){
            if(zJS.Options.getOption('searchIslands')) {
                this._islandsSearch();
            }
            this._islandsTimeTravel();
        }
        if(this._pirateButtonStorage && zJS.Options.getOption("pirateButton")) {
            this._pirateButton();
        }
        this.init_popup();
        this._getUserData();
        this._nextCity();

        if(zJS.Options.getOption('transporter')) {
            this._transporter();
        }
        this._addOtherButtons();
        this._changeForumBtn();
        this._addIkaEasylinks();
        this._getProduction();
        if(zJS.Options.getOption('gold_per_hour')){
            this.gold_consumption.init();
        }

        // was added by gameforge
        //if(document.getElementsByTagName('body')[0].id !== "worldmap_iso") {
        //    this._addLinkToIslandFeature();
        //}
    },

    refresh: function() {
        console.log('=========== REFRESH =============');
        //console.time('refresh');
        $('#ikaeasy_nextCity').remove();
        $('#ikaeasy_transporter').parent().parent().parent().parent().parent().remove();

        $.each(this._notes, function(k, v) {
            $(v).remove();
        });

        this._notes = [];

        $("ul.resources li div p:first-child").parent().parent()
            .css("cursor", "")
            .removeAttr("onClick");
        //console.timeEnd('refresh');
        this.init();
    },

    copyright: function() {
        var $copy = $(".copyright");
        if(!$copy.hasClass("ikaez_DOM")){
            $copy.html('IkaEasy, made by Vlad Tansky <i>(SWAT)</i>.<a href="mailto:vl.tansky@gmail.com">vl.tansky@gmail.com</a>').addClass("ikaez_DOM");
        }
    },

    _pirateButton: function(){
        console.log("_pirateButton");
        if(!$("#ikaez_fastPirateButtons").length) {
            var self = this;
            $('head').append('<link rel="stylesheet" href="' + zJS.Utils.generateDomain() + '/skin/compiled-ru-city.css" type="text/css" />'); // @TODO change "RU" to local

            var classes = '', btn_classes = 'button capture ikaez_pirateCapture', flag = false;
            if(zJS.Utils.getItem("pirateDeadlineActive") == 2 && zJS.Utils.getItem("pirateDeadline") !== null && zJS.Utils.getItem("pirateDeadline") > new Date().getTime()){
                flag = true;
                classes += 'disabled';
                btn_classes += ' button_disabled';
            }
            var _inner = '<div id="ikaez_fastPirateButtons" class="'+ classes +'"><a href="javascript:void(0);" class="'+ btn_classes +'">'+ zJS.Lang.pirate_capture +'</a><div id="ikaez_pirateCountdown"></div></div>';
            $("body").append(_inner);

            if(flag){
                zJS.Page.pirateFortress.disableShortcutButton();
                zJS.Page.pirateFortress.startTimer();
            }else{
                zJS.Page.pirateFortress.enableShortcutButton();
            }

            $("#ikaez_fastPirateButtons a").on('click', function(){
                console.log("=== Pirate click");
                if(!$(this).hasClass("disabled")) {
                    if(zJS.Var.getCityId != self._pirateButtonStorage.cityId) {
                        $('#js_cityIdOnChange').val(self._pirateButtonStorage.cityId);
                        zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");
                    }
                    setTimeout(function() {
                        console.log('action!');
                        zJS.Utils.execute_js("ajaxHandlerCall('" + self._pirateButtonStorage.url + "');");
                        zJS.Page.pirateFortress.captureClicked(self._pirateButtonStorage.url);
                    }, 1000); // TODO set interval with checking
                }else{
                    console.log("=== Pirate disabled");
                }
            });

        }
    },

    _islandsTimeTravel: function(){
        console.log("_islandsTimeTravel");
        var $triggers = $(".islandTile, #mapCoordInput .submitButton"), $res_container;

        if($("#ikaez_islands_travel_time").length < 1){
            $res_container = $("<div>", {id: "ikaez_islands_travel_time"});
            $("#footer").find(".footerbg").append($res_container);
        }

        $triggers.on('click', zJS.Utils.island.showTravelTime);

        zJS.Utils.island.showTravelTime();
    },

    _islandsSearch: function() {
        console.log("_islandsSearch");
        if (!$("#ikaez_islandsSearch").length) {
        var isSearchActive = 0,
            $worldmap = $("#worldmap"),
            $islands = $worldmap.find(".islandTile"),
            resources_converted = {
                "marble": 2,
                "glass": 3,
                "sulfur": 4,
                "wine": 1,
                "wood": 5
            },
            searchParameters = {
                wonder : [],
                tradegood: [],
                general: []
            },
            foundedCoords = [],
            foundedCoordsLastLength,
            existsCorrds = {},
            activeFoundedCoords = 0;
            console.log("_islandsSearch");
            var db = zJS.DB._loadDB(),
                button_image = 'background-image:url('+ zJS.Utils.generateDomain()+ '/skin/pirateFortress/button_arrow_70x50_sprite.png)';

            var inner = '<div id="ikaez_islandsSearch"><div id="ikaez_islandSearch_counter"><span' +
            ' class="ikaez_iSS_cnt_current">0</span><span class="ikaez_iSS_cnt_sep">/</span><span' +
            ' class="ikaez_iSS_cnt_from">0</span></div><div class="ikaez_islandSearch_general_buttons"><button' +
            ' class="ikaez_islandSearch_gbutton button reset" data-name="reset" data-type="general">' + zJS.Lang.is_search_restart + '</button><button class="ikaez_islandSearch_gbutton button" data-name="full" data-type="general">' + zJS.Lang.is_search_full + '</button><button class="ikaez_islandSearch_gbutton button" data-name="empty" data-type="general">' + zJS.Lang.is_search_empty + '</button></div><div class="ikaez_islandSearch_resources">';
            // button left
            inner += '<a id="ikaez_islandSearch_prev" class="unactive" href="javascript:void(0)" style="' + button_image + '"></a>';
            // resources buttons
            $.each(db.images.resources, function (name, imgUrl) {
                if(name != 'wood' && name !== 'all' && name != 'small')
                inner += '<button class="ikaez_islandSearch_resource_btn button" data-name="' + resources_converted[name] + '" data-type="tradegood"><img src="' + imgUrl + '"></button>';
            });
            // button next
            inner += '<a id="ikaez_islandSearch_next" class="unactive" href="javascript:void(0)" style="' + button_image + '"></a>';

            inner += '</div><div class="ikaez_islandSearch_wonders">';
            // wonders buttons
            $.each(db.images.wonders, function (name, imgUrl) {
                inner += '<button class="ikaez_islandSearch_wonder_btn button" data-name="' + name + '" data-type="wonder"><img src="' + imgUrl + '"></button>';
            });
            inner += '</div></div>';
            $("#footer").find(".footerbg").prepend(inner);

            if(typeof $counter == "undefined"){
                var $counter = $("#ikaez_islandSearch_counter"),
                    $counter_current = $counter.find(".ikaez_iSS_cnt_current"),
                    $counter_from = $counter.find(".ikaez_iSS_cnt_from");
                }

        $("#ikaez_islandsSearch button").on('click', function () {
            $worldmap.addClass("ikaez_islandSearching");
            $("#ikaez_islandSearch_next").removeClass("unactive");
            // execute while map dynamic loading
            $islands.bind("DOMSubtreeModified",function(){
                //$(this).css('background','#000');
                filterIsland(this);
                setFromCounter();
            });
        });
        $("#ikaez_islandsSearch button").on('click', button_click);


        function setFromCounter(count){
            if(typeof count == "undefined"){
                count = foundedCoords.length;
            }
            if(typeof $counter == "undefined"){
                var $counter = $("#ikaez_islandSearch_counter"),
                    $counter_current = $counter.find(".ikaez_iSS_cnt_current"),
                    $counter_from = $counter.find(".ikaez_iSS_cnt_from");
            }
            if(foundedCoordsLastLength != count) {
                $counter_from.text(count);
                foundedCoordsLastLength = count;
            }
        }
        function filterIsland(){
            var _this, uploaded = false;
            if(typeof arguments[1] !== "undefined") {
                _this = arguments[1];
            }else if(typeof arguments[0] !== "undefined"){
                _this = arguments[0];
            }
            if(!$(_this).hasClass("oceanTile") && !$(_this).hasClass("ikaez_islandSearch_filtered")) {
                var check = true,
                    $wonder = $(_this).find(".wonder"),
                    $tradegood = $(_this).find(".tradegood"),
                    coords = zJS.Utils.island.getSelectedCoord(_this),
                    cities = $(_this).find(".cities").text();
                if (searchParameters.wonder.length > 0) {
                    check = $wonder.is("." + searchParameters.wonder.join(",."));
                }
                coords.wonder = 'wonder'+$wonder.attr('class').match(/wonder(\d+)/)[1];

                if (searchParameters.tradegood.length > 0 && check) {
                    check = $tradegood.is("." + searchParameters.tradegood.join(",."));
                }
                coords.tradegood = 'tradegood'+$tradegood.attr('class').match(/tradegood(\d+)/)[1];

                if (searchParameters.general.length > 0 && check) {
                    if (searchParameters.general.indexOf('generalfull') > -1 && searchParameters.general.indexOf('generalempty') > -1) {
                        check = cities > 0 && cities < 16;
                    } else {
                        if (searchParameters.general.indexOf('generalfull') > -1) {
                            check = cities < 16;
                        }
                        if (searchParameters.general.indexOf('generalempty') > -1) {
                            check = cities > 0;
                        }
                    }
                }
                coords.cities = cities;

                if (check) {
                    $(_this).addClass("ikaez_islandSearch_filtered");
                    isSearchActive++;
                    if(!existsCorrds[coords.x+coords.y]) {
                        foundedCoords.push(coords);
                        existsCorrds[coords.x+coords.y] = true;
                    }
                } else{
                    if(existsCorrds[coords.x+coords.y]) {
                        foundedCoords = $.grep(foundedCoords, function (el) {
                            var coord_check = el.x != coords.x || el.y != coords.y;

                            if (searchParameters.wonder.length > 0 && coord_check) {
                                coord_check = searchParameters.wonder.indexOf(el.wonder) > -1;
                            }

                            if (searchParameters.tradegood.length > 0 && coord_check) {
                                coord_check = searchParameters.tradegood.indexOf(el.tradegood) > -1;
                            }

                            if (searchParameters.general.length > 0 && coord_check) {
                                if (searchParameters.general.indexOf('generalfull') > -1 && searchParameters.general.indexOf('generalempty') > -1) {
                                    coord_check = el.cities > 0 && el.cities < 16;
                                } else {
                                    if (searchParameters.general.indexOf('generalfull') > -1) {
                                        coord_check = el.cities < 16;
                                    }
                                    if (searchParameters.general.indexOf('generalempty') > -1) {
                                        coord_check = el.cities > 0;
                                    }
                                }
                            }
                            return coord_check;
                        });
                        existsCorrds[coords.x+coords.y] = false;
                    }
                    if (foundedCoords.length) {
                        $("#ikaez_islandSearch_next").removeClass("unactive");
                    }
                }
            }
        }

        function button_click(){
            console.log("button_click");
            var name = $(this).data('name'),
                type = $(this).data('type'),
                $search_islands = isSearchActive ? $worldmap.find(".islandTile.ikaez_islandSearch_filtered") : $islands;
            $(this).toggleClass("active");
                if ($(this).hasClass("active")) {
                    searchParameters[type].push(type + name);
                }else{
                    searchParameters[type].removeEl(type + name);
                }

                // *** Filter islands ***
                $islands.removeClass("ikaez_islandSearch_filtered").each(filterIsland);
                setFromCounter();
                console.log(foundedCoords);

                if(name == "reset"){
                    $("#ikaez_islandsSearch button").removeClass("active");
                    isSearchActive = 0;
                    setFromCounter(0);

                    resources_converted = {
                        "marble": 2,
                        "glass": 3,
                        "sulfur": 4,
                        "wine": 1,
                        "wood": 5
                    };
                    searchParameters = {
                        wonder : [],
                        tradegood: [],
                        general: []
                    };
                    foundedCoords = [];
                    existsCorrds = {};
                    activeFoundedCoords = 0;
                }

            if(!isSearchActive){
                $islands.removeClass("ikaez_islandSearch_filtered");
                $worldmap.removeClass("ikaez_islandSearching");
                $("#ikaez_islandSearch_prev, #ikaez_islandSearch_next").addClass("unactive");
            }
        }

        function next_prev_function(){
            zJS.Utils.island.jumpToCoord(foundedCoords[activeFoundedCoords].x, foundedCoords[activeFoundedCoords].y);

            $counter_current.text(activeFoundedCoords);
            if (activeFoundedCoords < foundedCoords.length) {
                $("#ikaez_islandSearch_next").removeClass("unactive");
            } else {
                $("#ikaez_islandSearch_next").addClass("unactive");
            }

            if (!activeFoundedCoords) {
                $("#ikaez_islandSearch_prev").addClass("unactive");
            } else {
                $("#ikaez_islandSearch_prev").removeClass("unactive");
            }
        }
        function button_next(){
            if(!$(this).hasClass("unactive")) {
                activeFoundedCoords++;
                next_prev_function();
            }
        }

        function button_prev(){
            if(!$(this).hasClass("unactive")) {
                activeFoundedCoords--;
                next_prev_function();
            }
        }

        $("#ikaez_islandSearch_prev").on("click", button_prev);
        $("#ikaez_islandSearch_next").on("click", button_next);

        }
    },

    notification:{
        init: function(){
            console.log('check notification');
            this.check_permission();
            this.advisers.init();
        },

        check_permission: function(){
            if (Notification.permission !== "granted")
                Notification.requestPermission();
        },

        advisers:{
            init: function(){
                if($("a.premiumactive").length || $("a.normalactive").length) {
                    var notification = new Notification(zJS.Lang.notifications.advisers.overall.title, {
                        icon: chrome.extension.getURL('images/capturePoints.png'),
                        body: zJS.Lang.notifications.advisers.overall.body,
                    });
                }
            }
        }
    },
    _checkUpdates: function(){
        console.log("_checkUpdates");
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

    init_popup: function(){
        console.log("init_popup");
        if((localStorage.getItem("popup_v5") === null || zJS.Utils.hoursBetween(new Date(), localStorage.getItem("popup_date")) > 12) || localStorage.getItem("popup_date") === null) {
            if ($("#ikaez_popup").length < 1) {
                $("#container").append('<div class="popup_contentbox"> <div id="ikaez_popup" class="popupMessage" style="top: 171px; left: 720px; z-index: 19999;"> <div id="notesHeader" class="hd header draggable mousedown"> <div class="header headerLeft"></div> <div class="header headerMiddle"> </div><div class="header headerRight"></div> </div><div id="resizablepanel_notes_c" class="notes_box popupContent"> <div class="messagebox">' + zJS.Lang.options.development.overview + zJS.Lang.options.development.donate_link + '</div> <a href="#" id="dismiss_popup" class="button">Close</a> </div> <div class="ft footer"></div> </div> </div>');
            }

            $("#dismiss_popup").on('click', function () {
                console.log('dissmis');
                $("#ikaez_popup").hide();
            });

            if(localStorage.getItem("popup_v4") !== null){
                localStorage.removeItem("popup_v4");
            }
            localStorage.setItem("popup_v5", true);
            localStorage.setItem("popup_date", new Date());

            $("#ikaez_donate").off().on("click", function(){
                localStorage.setItem("popup_donate", true);
            })
        }
    },
    /*
     * Display resource spend per hour
     */
    _getProduction: function() {
        console.log("_checkUpdates");
        //console.time('_getProduction');
        $('.ikaeasy_delet_me').each(function() {
            $(this).remove();
        });

        var resCol = ['wood', 'wine', 'marble', 'crystal', 'sulfur'];

        for(var i = 0; i < 5; i++) {
            var clas = i == 3 ? 'glass' : resCol[i];
            var tmpVar = i === 0 ? '#js_GlobalMenu_resourceProduction' : '#js_GlobalMenu_production_' + resCol[i];
            var tmpRes = $(tmpVar).text() == '-' ? 0 : $(tmpVar).text().replace(/[^\d+]/g, '');
            if(i == 1) {

                var wineLeftTime,
                    GlobalWine=$("#js_GlobalMenu_wine").text(),
                    k=1;
                while(GlobalWine.slice(-1)=="k"){
                    GlobalWine=GlobalWine.substring(0, GlobalWine.length - 1);
                    k*=10; }
                GlobalWine=(k>1)?GlobalWine.replace(/[^\d+]/g, '')*k:GlobalWine.replace(/[^\d+]/g, '');
                tmpRes -= $("#js_GlobalMenu_WineConsumption").text().replace(/[^\d+]/g, '');
                if(tmpRes < 0) {
                    wineLeftTime = Math.abs(parseFloat(GlobalWine / tmpRes));
                    wineLeftTime = zJS.Utils.transformHours(wineLeftTime);
                    //@todo В настройках выбирать прим. "показывать расход за день, неделю"
                    /*jshint multistr: true */
                    var wine_tooltip = '<p class="smallFont ikaeasy_delet_me">' + zJS.Lang.left + ': ' + wineLeftTime + '</p>\
                    <p class="smallFont ikaeasy_delet_me">' + zJS.Lang.per_day + ': ' + zJS.Utils.formatNumber(tmpRes * 24) + '</p>\
                    <p class="smallFont ikaeasy_delet_me">' + zJS.Lang.per_week + ': ' + zJS.Utils.formatNumber(tmpRes * 168) + '</p>';
                    //<p class="smallFont ikaeasy_delet_me">'+zJS.Lang.per_month + ': ' + zJS.Utils.formatNumber(tmpRes*730)+'</p>';
                    $("#js_GlobalMenu_wine_tooltip").prepend(wine_tooltip);
                }
            }
            tmpRes = tmpRes < 0 ? zJS.Utils.formatNumber(tmpRes) : '+' + zJS.Utils.formatNumber(tmpRes);
            var search = i === 0 ? '#js_GlobalMenu_resourceProduction' : '#js_GlobalMenu_production_container_' + resCol[i];
            if($(search)[0].className.indexOf('invisible') == -1 || i == 1) {
                var tmpIns = tmpRes.substring(0, 1) == '-' ? 'ikaeasy_resources_negative' : 'ikaeasy_resources_positive';
                var template;
                if(i == 1 && tmpRes < 0)
                    template = '<div class="ikaeasy_delet_me"><span id="ikaeasy-' + clas + '" class="' + tmpIns + '">' + zJS.Utils.formatNumber(tmpRes) + ' <span class="ikaeasy_wine_left_time">' + wineLeftTime + '</span></span></div>';
                else
                    template = '<div class="ikaeasy_delet_me"><span id="ikaeasy-' + clas + '" class="' + tmpIns + '">' + zJS.Utils.formatNumber(tmpRes) + '</span></div>';
                var $addTo = $('#resources_' + clas);
                $(template).appendTo($addTo);
                $addTo.addClass("ikaez_resource_added");
            }
        }
        console.timeEnd('_getProduction');
    },

    gold_consumption: {
        /*
         * Get finance per hour
         */
        init: function(){
            console.log("gold_consumption init");
            this.get();
            this.set();
        },

        get: function() {
            console.time('gold_consumption::get');
            var LocFinanceDate = zJS.Utils.getLocFinance() + '_date';
            if((localStorage.getItem(LocFinanceDate) !== null && zJS.Utils.hoursBetween(new Date(), localStorage.getItem(LocFinanceDate)) > 1) || localStorage.getItem(LocFinanceDate) === null) {
                console.log('Ajax get finance');
                try {
                    //console.time('_getFinance::ajax');
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
                            if(status === false)
                                ex = 0 - ex;

                            //console.log(ex);
                            var LocFinance = zJS.Utils.getLocFinance(),
                                LocFinanceDate = zJS.Utils.getLocFinance() + '_date';

                            localStorage.setItem(LocFinance, ex);
                            localStorage.setItem(LocFinanceDate, new Date());
                        }
                    });
                    //console.timeEnd('_getFinance::ajax');
                }
                catch(err) {
                    console.log(err);
                }
            }
            console.timeEnd('gold_consumption::get');
        },


        /*
         * Display gold per hour
         */
        set: function() {
            console.time('gold_consumption::set');
            var LocFinance = zJS.Utils.getLocFinance();
            var value = localStorage.getItem(LocFinance),
                np_char = 'red',
                np_symb = '';
            if(value >= 0) {
                np_char = 'ikaeasy_green';
                np_symb = '+';
            }
            $("#js_GlobalMenu_gold").append('<span id="IkaEasy_Gold_per_hour" class="ikaeasy_delet_me ' + np_char + '">' + np_symb + zJS.Utils.formatNumber(value) + '</span>');
            console.timeEnd('gold_consumption::set');
        }
    },

    /*
     * Get user data
     */
    _getUserData: function() {
        console.time('_getUserData');
        if(!zJS.Utils.getItem('user_data')) {
            console.log('Ajax get user data');
            try {
                //console.time('_getFinance::ajax');
                $.ajax({
                    url: '/index.php',
                    success: function(data) {
                        var userData;
                        var start = data.indexOf('dataSetForView = {') + 'dataSetForView = {'.length;
                        var end = data.indexOf('bgViewData: bgViewData,', start);
                        userData = data.substring(start, end);
                        userData = userData.replace(/\/\*.+?\*\/|\/\/.*(?=[\n\r])/g, '');
                        var backgroundView = null, hasAlly = null;
                        /*jslint evil: true */
                        eval("userData = {"+userData+"}");
                        zJS.Utils.setItem("user_data", JSON.stringify(userData));
                        //$.ajax({
                        //    url: zJS.Config.server_url + '/users',
                        //    type: 'post',
                        //    data: {
                        //        'user_id' : userData.avatarId,
                        //        'ally_id' : userData.avatarAllyId,
                        //        'server' : zJS.Utils.getServerWorld(),
                        //        'language' : zJS.Utils.getServerDomain()
                        //    },
                        //    success: function(data) {
                        //        console.log(data.message);
                        //        zJS.Utils.setItem("user_data", userData);
                        //        console.log('set user');
                        //    },
                        //    error: function(data){
                        //        console.log(data.responseJSON.message);
                        //        if(data.responseJSON.code == '1'){
                        //            console.log('set user');
                        //            zJS.Utils.setItem("user_data", JSON.stringify(userData));
                        //        }
                        //    }
                        //});
// TODO send to server
                    }
                });
                //console.timeEnd('_getUserData::ajax');
            }
            catch(err) {
                console.log(err);
            }
        }
        console.timeEnd('_getUserData');
    },

    _changeForumBtn: function() {
        $('#GF_toolbar').find('li.forum a')[0].href = 'http://board.' + zJS.Utils.getServerDomain() + '.ikariam.gameforge.com/index.php?page=Index';
    },
    _addIkaEasylinks: function(){
        console.log("_addIkaEasylinks");
        var $cashe_el=$('#GF_toolbar').find('li.ikhelp:not(.ikaez_completed)');
        $cashe_el.before('<li class="ikaez_fb_link"><a class="noViewParameters" target="_blank" href="'+zJS.Lang.ikaeasy_link+'" title="IkaEasy"> Ikariam Easy</a></li>');
        $cashe_el.addClass('ikaez_completed');
    },
    _addOtherButtons: function() {
        console.time('_addOtherButtons');

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
        if(zJS.Var.getAllyId()) {
            // Кнопка на общее сообщение
            var common_message = zJS.Utils.addToLeftMenu('image_chat', zJS.Lang.Circular_message);
            $(common_message).attr('onclick', "ajaxHandlerCall('?view=sendIKMessage&msgType=51&allyId=" + zJS.Var.getAllyId() + "'); return false;");

            this._notes.push(common_message);
        }
        console.timeEnd('_addOtherButtons');
    },
    /*
     * Get and display next city link
     */
    _nextCity: function() {
        console.time('_nextCity');
        if(!this._cities) {
            this._cities = zJS.Var.getTransferVars().cities;
        }

        var cnt_cities = 0, _first = false, _next = -1, id = this._cities.selectedCity;
        $.each(this._cities, function(k, v) {
            if(k.indexOf('city_') === 0) {
                cnt_cities++;

                if(!_first) {
                    _first = v.id;
                }

                if(_next === 0) {
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
            console.log("next");
            zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");


        }.bind(this));
        console.timeEnd('_nextCity');
    },
    /*
     * Transporter navigation (in left menu)
     */
    _transporter: function() {
        console.time('_transporter');
        this._cities = zJS.Var.getTransferVars().cities;
        var cnt_cities = 0;
        $.each(this._cities, function(k, v) {
            if(k.indexOf('city_') === 0) {
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
            if(k.indexOf('city_') === 0) {
                var line = $(this._getCityName(k));

                if(this._cities[k].relationship != 'ownCity') {
                    if($('#ikaeasy_not_mycities', cities).length === 0) {
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
            zJS.Utils.ls.setValue('transporter_is_show', false);
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
        //console.time('_getCityName');
        var city = this._cities[id];
        var html_city = $('<div class="ikaeasy_' + city.relationship + '"><div class="ikaeasy_tr_res"></div><div class="ikaeasy_tr_fleet"></div><div class="ikaeasy_tr_army"></div><span>' + city.coords + ' ' + city.name + '</span></div>');

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

        //console.timeEnd('_getCityName');
        return html_city;
    },

    _addLinkToIslandFeature: function() {
        console.time('_addLinkToIslandFeature');
        var resourceType = $("ul.resources li div p:first-child"),
            islandId = zJS.Var.getIsland().islandId;

        // Добавляем ссылку для дерева
        $("#resources_wood")
            .css("cursor", "pointer")
            .attr("onClick", "ajaxHandlerCall('?view=resource&type=resource&islandId=" + islandId + "'); return false;");

        // Добавляем ссылку для Драгоценного ресурса
        resourceType.not(".invisible").eq(1).parent().parent()
            .css("cursor", "pointer")
            .attr("onClick", "ajaxHandlerCall('?view=tradegood&islandId=" + islandId + "'); return false;");
        console.timeEnd('_addLinkToIslandFeature')
    }
};