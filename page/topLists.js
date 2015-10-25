if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.highscore = {
    init: function() {
        var allys = zJS.Utils.marker.getAllAllys();

        function refreshTop() {
            $('.centerButton .button').click();
        }

        $('.highscore tr').each(function() {
            //debugger;

            var markerMenu = $('<div class="ikaeasy_top_marker_menu" />').appendTo($(this));
            for(var i = 0; i < 8; i++) {
                var menuCell = $('<div class="ikaeasy_top_menuCell" id="' + zJS.Utils.marker.getColorById(i - 1) + '" />').appendTo($(markerMenu));
                if(i == 0) {
                    $(menuCell).click(function(e) {
                        var ally = $(e.target).parent().parent();
                        ally = $('.ikaeasy_marker_big', $(ally));
                        zJS.Utils.marker.deleteAlly($(ally)[0].id);
                        $(this).parent().hide(500);
                        setTimeout(refreshTop, 500);
                    }).attr('style', 'padding-left: 1px;');
                }
                else {
                    $(menuCell).click(function(e) {
                        var ally = $(e.target).parent().parent();
                        ally = $('.ikaeasy_marker_big', $(ally));
                        zJS.Utils.marker.setAllyColor($(ally)[0].id, 'marker_' + $(this)[0].id);
                        $(this).parent().hide(500);
                        setTimeout(refreshTop, 500);
                    });
                }
            }

            ////////////////////////////////////////////
            var allyTag = $('.allytag a', $(this)).text() == '' ? '-' : $('.allytag a', $(this)).text();

            $('<div class="ikaeasy_marker_big" id="' + allyTag + '"/>').insertBefore($('.action a', $(this))).click(function(e) {
                if($(this).hasClass('clicked')) {
                    $('.ikaeasy_top_marker_menu', $(this).parent().parent()).hide(500);
                    $(this).removeClass('clicked');
                }
                else {
                    $(this).addClass('clicked');
                    $('.ikaeasy_top_marker_menu', $(this).parent().parent()).attr('style', 'left:350px; margin-top:1px;').show(1000);
                }
            });

            if(!$(this).hasClass('own') && !$(this).hasClass('ownally')) {
                for(var q = 0; q < allys.length; q++) {
                    for(var s = 0; s < allys[q].length; s++) {
                        if(allyTag == allys[q][s]) {
                            $(this).addClass('marker_top_' + zJS.Utils.marker.getColorById(q));
                        }
                    }
                }
            }
        });
    },

    refresh: function() {
        this.init();
    }
};
zJS.Page.highscoreAlly = {
    init: function() {

        function refreshTop() {
            $('.centerButton .button').click();
        }

        var allys = zJS.Utils.marker.getAllAllys();
        $('.highscore tr').each(function() {

            var markerMenu = $('<div class="ikaeasy_top_marker_menu" />').appendTo($(this));
            for(var i = 0; i < 8; i++) {
                var menuCell = $('<div class="ikaeasy_top_menuCell" id="' + zJS.Utils.marker.getColorById(i - 1) + '" />').appendTo($(markerMenu));
                if(i == 0) {
                    $(menuCell).click(function(e) {
                        var ally = $(e.target).parent().parent();
                        ally = $('.ikaeasy_marker_big_ally', $(ally));
                        zJS.Utils.marker.deleteAlly($(ally)[0].id);
                        $(this).parent().hide(500);
                        setTimeout(refreshTop, 500);
                    }).attr('style', 'padding-left: 1px;');
                }
                else {
                    $(menuCell).click(function(e) {
                        debugger;
                        var ally = $(e.target).parent().parent();
                        ally = $('.ikaeasy_marker_big_ally', $(ally));
                        zJS.Utils.marker.setAllyColor($(ally)[0].id, 'marker_' + $(this)[0].id);
                        $(this).parent().hide(500);
                        setTimeout(refreshTop, 500);
                    });
                }
            }

            ////////////////////////////////////////////


            var allyTag = $('.name', $(this)).text();
            allyTag = allyTag.substring(allyTag.indexOf('(') + 1, allyTag.indexOf(')'));

            $('<div class="ikaeasy_marker_big_ally" id="' + allyTag + '" />').click(function() {
                if($(this).hasClass('clicked')) {
                    $('.ikaeasy_top_marker_menu', $(this).parent().parent()).hide(500);
                    $(this).removeClass('clicked');
                }
                else {
                    $(this).addClass('clicked');
                    $('.ikaeasy_top_marker_menu', $(this).parent().parent()).attr('style', 'left:350px; margin-top:1px;').show(1000);
                }
            }).insertBefore($('.action a', $(this)));

            if(!$(this).hasClass('own') && !$(this).hasClass('ownally')) {
                for(var q = 0; q < allys.length; q++) {
                    for(var s = 0; s < allys[q].length; s++) {
                        if(allyTag == allys[q][s]) {
                            $(this).addClass('marker_top_' + zJS.Utils.marker.getColorById(q));
                        }
                    }
                }
            }
        });
    },

    refresh: function() {
        this.init();
    }
};