if(typeof  zJS == "undefined") {
    zJS = {};
}

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


zJS.Config = {
    //server_url: 'https://localhost:8080/ikaeasy-server/server.php/api/v1'
    server_url: 'https://multitan.co.il/ikaeasy/server.php/api/v1'
};

zJS.Utils = {
    setItem: function(name, value){
        localStorage.setItem(this.getServerDomain() + "_" + this.getServerWorld() + "_" + name, value);
        return true;
    },

    getItem: function(name){
        return localStorage.getItem(this.getServerDomain() + "_" + this.getServerWorld() + "_"+name);
    },
    replaceAll: function(s1, s2) {
        return this.split(s1).join(s2);
    },

    getLocWine: function() {
        return zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_" + zJS.Var.getCityId() + "_wine";
    },
    getLocFinance: function() {
        return zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_finance";
    },

    getPlace: function() {
        return zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_";
    },
    hoursBetween: function(date1, date2) {
        var diffMs = Date.parse(date1) - Date.parse(date2);
        return Math.round((diffMs % 86400000) / 3600000);//после деления - перевод милисекунд в часы
    },

    marker: {
        getColors: function() {
            return ['orange', 'bordo', 'pink', 'purple', 'turquoise', 'black', 'white'];
        },

        getMarkerColors: function() {
            var cityColors = this.getColors();
            for(var i = 0; i < cityColors.length; i++) {
                cityColors[i] = 'marker_' + cityColors[i];
            }
            return cityColors;
        },

        getAllysByColor: function(color) {
            color = this.stripColor(color);
            var allAllys = this.getAllAllys();
            return allAllys[this.getColorId(color)];
        },

        getColorId: function(color) {
            var cityColors = this.getColors();
            for(var i = 0; i < cityColors.length; i++) {
                if(cityColors[i] == color)
                    return i;
            }
            return -1;
        },

        getColorById: function(id) {
            if(id == -1) return 'blank';
            var cityColors = this.getColors();
            return cityColors[id];
        },

        getAllAllys: function() {
            var cityColors = this.getColors();
            var markerAllys = [];
            var addition = zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_";
            for(var i = 0; i < cityColors.length; i++) {
                markerAllys[i] = localStorage.getItem(addition + cityColors[i]) ? JSON.parse(localStorage.getItem(addition + cityColors[i])) : [];
            }
            return markerAllys;
        },

        setAllAllys: function(allys) {
            var cityColors = this.getColors();
            var addition = zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_";
            for(var i = 0; i < cityColors.length; i++) {
                localStorage.removeItem(addition + cityColors[i]);
                localStorage.setItem(addition + cityColors[i], JSON.stringify(allys[i]));
            }
        },

        stripColor: function(color) {
            var s = 'marker_'.length;
            color = color.substring(s, color.length);
            return color;
        },

        setAllyColor: function(ally, color) {
            color = this.stripColor(color);
            var allAllys = this.deleteExistingAlly(this.getAllAllys(), ally);
            allAllys[this.getColorId(color)].push(ally);
            this.setAllAllys(allAllys);
        },

        deleteAlly: function(ally) {
            var allAllys = this.getAllAllys();
            for(var i = 0; i < allAllys.length; i++) {
                for(var q = 0; q < allAllys[i].length; q++) {
                    if(allAllys[i][q] == ally) {
                        console.log("Found "+ally);
                        allAllys[i].remove(q);
                        console.log(allAllys);
                        this.setAllAllys(allAllys);
                        return;
                    }
                }
            }
            return true;
        },

        deleteExistingAlly: function(allAllys, ally) {
            for(var i = 0; i < allAllys.length; i++) {
                for(var q = 0; q < allAllys[i].length; q++) {
                    if(allAllys[i][q] == ally) {
                        allAllys[i].remove(q);
                        return allAllys;
                    }
                }
            }
            return allAllys;
        }
    },

    ls: {
        /*
        @param {string} name
        @param {string} value
        @param {number} time expire time in seconds
         */
        setValue: function(name, value, time) {
            var _value = {};
            _value.value = value;
            _value.expire = (time) ? (new Date()).getTime() + time * 1000 : 0;
            localStorage[name] = JSON.stringify(_value);
        },

        getValue: function(name) {
            var _value = (!localStorage[name]) ? false : ((localStorage[name] != 'false') ? $.parseJSON(localStorage[name]) : false);
            if(_value) {
                if((_value.expire > 0) && (_value.expire < (new Date()).getTime())) {
                    localStorage.removeItem(name);
                    _value = false;
                }
            }
            return (_value) ? _value.value : false;
        },

        removeValue: function(name) {
            localStorage.removeItem(name);
        }
    },
    generateServerName: function(name){
        return zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_" + name;
    },

    generateSubDomain: function(){
        return "https://" + zJS.Utils.getServerWorld() + "-" + zJS.Utils.getServerDomain();
    },

    generateDomain: function(){
        return zJS.Utils.generateSubDomain() + ".ikariam.gameforge.com";
    },
    getDateNow: function(){
      return Math.floor((new Date()).getTime() / 1000);
    },
    getUrl: function(str) {
        return chrome.extension.getURL(str);
    },

    getServerDomain: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[2] : false) || 'ru'; //ru
    },

    getServerWorld: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[1] : false) || 's?'; //s22
    },

    getServerPrefix: function(){
      return this.getServerDomain() + "_" + this.getServerWorld() + "_";
    },

    askms: function(params, callback) {
        if((params.vars) && (typeof params.vars == 'object')) {
            params.vars = $.param(params.vars);
        }

        chrome.extension.sendRequest(params, function(response) {
            callback && callback(response);
        });
    },

    ucfirst: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },

    extractClass: function(name) {
        var obj = window;
        var name_pieces = name.split(".");
        for(var i = 0; i < name_pieces.length; i++) {
            if(typeof obj != "undefined") {
                obj = obj[name_pieces[i]];
            }
        }
        return obj;
    },

    getDynamicWin: function(title, content) {
        var _window = $('<ul class="dynamic main_dynamic"><li class="dynamic_panel"><a href="#toggle" tabindex="0" class="dynamic_title">' + title + '<span class="indicator"></span></a><div class="dynamic_content"><div class="dynamic"></div></div></li></ul>');
        $('.dynamic', _window).append(content);

        return _window;
    },


    createDynamic: function(title, content) {
        var window = $('<ul id="sidebarWidget" style="width: 228px; "><li class="accordionItem"><a href="#toggle" tabindex="0" class="accordionTitle active" style="cursor:default !important;">' + title + '</a><div class="accordionContent"><div class="dynamic"></div></div></li></ul>');
        $('.dynamic', window).append(content);
        $('#sidebar').append(window);

        return window;
    },

    formatNumber: function(number, def) {
        def = def || "0";
        var sep = zJS.Var.getSeparators();
        var result = ((number || "") + "").replace(/(\d)(?=(?:\d{3})+(?:$|\.|,))/g, "$1" + sep.thousand).replace(".", sep.decimal);

        if(!result || result == "0") {
            return def;
        }
        else {
            return result;
        }
    },

    getAjax: function(url, callback) {
        $.get(url, function(data) {
            callback && callback(jQuery.parseJSON(data));
        });
    },

    addToLeftMenu: function(image, title) {
        var $leftMenu = $('#leftMenu');
        if(!$leftMenu.length) {
            $('#container').append('<div id="leftMenu"></div>');
        }
        var $js_viewCityMenu = $('#js_viewCityMenu');
        if(!$js_viewCityMenu.length) {
            $leftMenu.append('<div id="js_viewCityMenu" class="slot_menu city_menu"></div>');
        }

        if(!$('.menu_slots', '#js_viewCityMenu').length) {
            $js_viewCityMenu.append('<ul class="menu_slots"></ul>');
        }

        var menu_slot = $js_viewCityMenu.find('.menu_slots');

        var _slot = $('li', menu_slot).length;
        var li = $('<li class="slot' + _slot + '" style="width: 53px; "><div class="image ' + image + '"></div><div class="name"><span class="namebox">' + title + '</span></div></li>');
        $(menu_slot).prepend(li);

        var animate = false;
        $(li).hover(function() {
            $('#js_viewCityMenu').css('zIndex', 120000);
            animate = $(li).animate({width: 199}, 250);
        }.bind(this), function() {
            if(animate) {
                animate.stop();
            }

            animate = $(li).animate({width: 53}, 250);
        }.bind(this));

        return li;
    },

    addToSideBar: function(title, content, classes){
        if(classes === undefined){
            classes = '';
        }
      var $sideBar = $("#sidebar"),
          template = '<li class="accordionItem '+classes+'" style=""><a class="accordionTitle active">'+title+'<span class="indicator"></span></a><div class="accordionContent"><div class="ikaez_sidebar_padding_content">'+content+'</div></div></li>';

        if($sideBar.length){
            $sideBar.find("#sidebarWidget").append(template);
        }else{
            $("#leftMenu").after('<div id="sidebar" class="ikaez_sidebar_generated"><ul id="sidebarWidget">'+template+'</ul></div>');
        }


        $(".accordionItem .accordionTitle .indicator").off("click.ikaez").on("click.ikaez", function(){
            console.log("toggle click");
            $(this).parent().toggleClass("active").next(".accordionContent").toggleClass("ikaez_toggle");
        });
    },

    execute_js: function(js) {
        zJS.Utils.ls.setValue('execute_js', js, 5);

        var customEvent = document.createEvent('Event');
        customEvent.initEvent('execute_js', true, true);
        $('#__ikaeasy')[0].dispatchEvent(customEvent);
    },
    hoursToTime: function(dhours) {
        return Math.floor(dhours) + ':' + ('0' + ((dhours % 1)*60).toFixed(0)).slice(-2);
    },
    transformHours: function(hours) {
        if(hours < 24)
            return Math.round(hours) + ' ' + zJS.Lang.hours;
        if(hours < 730)
            return Math.round(hours / 24) + ' ' + zJS.Lang.days;
        else if(hours < 8765)
            return Math.round(hours / 730) + ' ' + zJS.Lang.months;
        else if(hours >= 8765)
            return Math.round(hours / 8765) + ' ' + zJS.Lang.years;

    },

    draggable: function(obj1, obj2, callback) {
        this._draggble = {
            drag: false,
            mouseX: 0,
            mouseY: 0,
            sX: 0,
            xY: 0
        };

        $(obj1).mousedown(function(e) {
            this._draggble.drag = true;
            this._draggble.mouseX = e.pageX;
            this._draggble.mouseY = e.pageY;
            this._draggble.sX = $(obj2).offset().left;
            this._draggble.sY = $(obj2).offset().top;
        }.bind(this));
        var $body = $('body');
        $body.mouseup(function(e) {
            if(this._draggble.drag) {
                callback && callback();
                this._draggble.drag = false;
            }
        }.bind(this));

        $body.mousemove(function(e) {
            if(this._draggble.drag) {
                var pos = {
                    top: this._draggble.sY + (e.pageY - this._draggble.mouseY),
                    left: this._draggble.sX + (e.pageX - this._draggble.mouseX)
                };

                $(obj2).css(pos);
            }
        }.bind(this));
    },

    format: {
      onlyInt: function(a){
          return parseInt(a.replace(/[^\d]+/g, ''));
      }
    },
    island: {
        jumpToCoord: function(x,y){
            $("#inputXCoord").val(x);
            $("#inputYCoord").val(y);
            $("form[name='navInputForm']").find(".submitButton").click();
            this.showTravelTime();
        },
        getSelectedCoord: function(_this){
            //var title = $(_this).attr('title');
            var res = $(_this).attr('title').split(' ');
            if(typeof res !== "undefined") {
                res = res[1].split(':');

                return {
                    x: zJS.Utils.format.onlyInt(res[0]),
                    y: zJS.Utils.format.onlyInt(res[1])
                };
            }
            return false;
        },
        showTravelTime: function(){
            var $res_container = $("#ikaez_islands_travel_time");
            if($res_container.length>0) {
                // TODO start loading
                setTimeout(function () {
                    // TODO end loading
                    var activeIsland = zJS.Var.getActiveIsland(),
                        targetIsland = zJS.Var.getWorldActiveIsland();
                    if(targetIsland.x == activeIsland.x && targetIsland.y == activeIsland.y) {
                        $res_container.html('10'+zJS.Lang.char_minute);
                        return true;
                    }
                    var a = targetIsland.x - activeIsland.x,
                        b = targetIsland.y - activeIsland.y,
                        math = 20 * Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)); // speed = 1200/60

                    var hours = Math.floor(math / 60),
                        minutes = Math.floor(math % 60),
                        res;
                    hours = hours ? hours + zJS.Lang.char_hour : '';
                    minutes = minutes ? minutes + zJS.Lang.char_minute : '';
                    // TODO add seconds
                    res = (hours ? hours : '') + ' ' + (minutes ? minutes : '');
                    $res_container.html(res);
                }, 400);
                return true;
            }else{
                return false;
            }
        },
    },
    Date: {
        fromString: function(stringDate) {
            var stringArray = stringDate.split(' '),
                date = '',
                now_date = new Date();
            if(stringArray[1]) {
                date = stringArray[0].split('.');
                console.log("=== fromString: if date");
                return new Date(date[1] + '.' + date[0] + '.' + date[2] + ' ' + stringArray[1]);
            }
            return new Date(now_date.getMonth()+1 + '.' + now_date.getDate() + '.' + now_date.getFullYear() + ' ' + stringArray[0]);
        },

        countDown: function(duration, display) {
            var start = Date.now(),
                diff,
                minutes,
                seconds;

            function timer() {
                // get the number of seconds that have elapsed since
                // startTimer() was called
                diff = duration - (((Date.now() - start) / 1000) | 0);

                // does the same job as parseInt truncates the float
                minutes = (diff / 60) | 0;
                seconds = (diff % 60) | 0;

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if(diff <= 0) {
                    // add one second so that the count down starts at the full duration
                    // example 05:00 not 04:59
                    start = Date.now() + 1000;
                }
            };
            // we don't want to wait a full second before the timer starts
            timer();
            setInterval(timer, 1000);
        },
    }
};


Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};
