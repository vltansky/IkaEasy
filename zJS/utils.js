if(typeof  zJS == "undefined") {
    zJS = {};
}

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


zJS.Utils = {
    replaceAll: function(s1, s2) {
        return this.split(s1).join(s2)
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
                        allAllys[i].remove(q);
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
        setValue: function(name, value, time) {
            var _value = {};
            _value["value"] = value;
            _value["expire"] = (time) ? (new Date()).getTime() + time * 1000 : 0;
            localStorage[name] = JSON.stringify(_value);
        },

        getValue: function(name) {
            var _value = (!localStorage[name]) ? false : ((localStorage[name] != 'false') ? $.parseJSON(localStorage[name]) : false);
            if(_value) {
                if((_value['expire'] > 0) && (_value['expire'] < (new Date()).getTime())) {
                    localStorage.removeItem(name);
                    _value = false;
                }
            }
            return (_value) ? _value['value'] : false;
        },

        removeValue: function(name) {
            localStorage.removeItem(name);
        }
    },
    generateServerName: function(name){
        return zJS.Utils.getServerDomain() + "_" + zJS.Utils.getServerWorld() + "_" + name;
    },
    getDateNow: function(){
      return Math.floor((new Date()).getTime() / 1000);
    },
    getUrl: function(str) {
        return chrome.extension.getURL(str);
    },

    getServerDomain: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[2] : false) || 'ru';
    },

    getServerWorld: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[1] : false) || 's?';
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
        if($leftMenu.length == 0) {
            $('#container').append('<div id="leftMenu"></div>');
        }
        var $js_viewCityMenu = $('#js_viewCityMenu');
        if($js_viewCityMenu.length == 0) {
            $leftMenu.append('<div id="js_viewCityMenu" class="slot_menu city_menu"></div>');
        }

        if($('.menu_slots', '#js_viewCityMenu').length == 0) {
            $js_viewCityMenu.append('<ul class="menu_slots"></ul>');
        }

        var menu_slot = $js_viewCityMenu.find('.menu_slots');

        var _slot = $('li', menu_slot).length;
        var li = $('<li class="expandable slot' + _slot + '" style="width: 53px; "><div class="image ' + image + '"></div><div class="name"><span class="namebox">' + title + '</span></div></li>');
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

    execute_js: function(js) {
        zJS.Utils.ls.setValue('execute_js', js, 5);

        var customEvent = document.createEvent('Event');
        customEvent.initEvent('execute_js', true, true);
        $('#__ikaeasy')[0].dispatchEvent(customEvent);
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
    }
};


Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};