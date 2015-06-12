if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
function AddIkaEasyOptionsfunction() {
    //Cleaning up
    var $tabMenu = $("ul#tabMenu");
    $('#js_tabIkaEasyOptions').remove();
    $('#tabIkaEasyOptions').remove();

    //Creating the tab itself
    $('.tabmenu').css('display', 'block').append('<li onclick="switchTab(\'tabIkaEasyOptions\');" id="js_tabIkaEasyOptions" class="tab"><b class="tabIkaEasyOptions">IkaEasy</b></li>');
    var tabContent = $('<div id="tabIkaEasyOptions" style="display: none;" />').appendTo('.mainContent');

    //Transport type
    var transportOptionsTab = $('<div class="contentBox01h" id="ikaeasyTransport" />').appendTo(tabContent);
    $('<h3 class="header">IkaEasy</h3>').appendTo(transportOptionsTab);
    var transportOptionsContent = $('<div class="content" />').appendTo(transportOptionsTab);
    $('<div class="footer" />').appendTo(transportOptionsTab);

    var transportOriginalTxt = '<div id="ikaeasyOriginalTransport" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.transport.original + '</span></div>';
    var transportIkaeasyTxt = '<div id="ikaeasyIkaeasyTransport" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.transport.ikaeasy + '</span></div>';


    var movement_tabs_enabled = '<div id="ikaeasy_options_movement_tabs_enable" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.movement_tabs.enable + '</span></div>';
    var movement_tabs_disabled= '<div id="ikaeasy_options_movement_tabs_disabled" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.movement_tabs.disable + '</span></div>';

    var gold_per_hour_enabled = '<div id="ikaeasy_options-gold_per_hour_enabled" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.gold_per_hour.enable + '</span></div>';
    var gold_per_hour_disabled= '<div id="ikaeasy_options-gold_per_hour_disabled" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.gold_per_hour.disable + '</span></div>';

    $('<table class="options table01"><tr><td>'+ zJS.Lang.options.transport.header +'</td><td class="left"><form>' + transportOriginalTxt + transportIkaeasyTxt + '</form></td></tr><tr><td>'+ zJS.Lang.options.movement_tabs.header +'</td><td class="left"><form>' + movement_tabs_enabled + movement_tabs_disabled + '</form></td></tr><tr><td>'+ zJS.Lang.options.gold_per_hour.header +'</td><td class="left"><form>' + gold_per_hour_enabled + gold_per_hour_disabled + '</form></td></tr></table>').appendTo(transportOptionsContent);

    if(localStorage[zJS.Utils.getPlace() + 'transporter-type'] == 1) {
        $('#Img', '#ikaeasyIkaeasyTransport').addClass('checked');
    }
    else {
        $('#Img', '#ikaeasyOriginalTransport').addClass('checked');
    }

    $('#ikaeasyOriginalTransport').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasyIkaeasyTransport').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'transporter-type'] = 1;
    });
    $('#ikaeasyIkaeasyTransport').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasyOriginalTransport').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'transporter-type'] = 0;
    });
    //Transport type END

    if(localStorage[zJS.Utils.getPlace() + 'options-gold_per_hour'] == 1) {
        $('#Img', '#ikaeasy_options-gold_per_hour_disabled').addClass('checked');
    }
    else {
        $('#Img', '#ikaeasy_options-gold_per_hour_enabled').addClass('checked');
    }

    $('#ikaeasy_options-gold_per_hour_enabled').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options-gold_per_hour_disabled').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options-gold_per_hour'] = 0;
    });
    $('#ikaeasy_options-gold_per_hour_disabled').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options-gold_per_hour_enabled').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options-gold_per_hour'] = 1;
    });
    //movement tabs END

    if(localStorage[zJS.Utils.getPlace() + 'options_movement_tabs'] == 1) {
        $('#Img', '#ikaeasy_options_movement_tabs_disabled').addClass('checked');
    }
    else {
        $('#Img', '#ikaeasy_options_movement_tabs_enable').addClass('checked');
    }

    $('#ikaeasy_options_movement_tabs_enable').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options_movement_tabs_disabled').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options_movement_tabs'] = 0;
    });
    $('#ikaeasy_options_movement_tabs_disabled').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options_movement_tabs_enable').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options_movement_tabs'] = 1;
    });
    //Gold per hour END
}
zJS.Page.options = {
    init: function() {
        AddIkaEasyOptionsfunction()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsAccount = {
    init: function() {
        AddIkaEasyOptionsfunction()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsNotification = {
    init: function() {
        AddIkaEasyOptionsfunction()
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsFacebook = {
    init: function() {
        AddIkaEasyOptionsfunction()
    },

    refresh: function() {
        this.init();
    }
};