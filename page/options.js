if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
function AddIkaEasyOptionsfunction() {
    //Cleaning up
    var $tabMenu=$("ul#tabMenu");
    $('#js_tabIkaEasyOptions').remove();
    $('#tabIkaEasyOptions').remove();

    //Creating the tab itself
    $('.tabmenu').css('display', 'block').append('<li onclick="switchTab(\'tabIkaEasyOptions\');" id="js_tabIkaEasyOptions" class="tab"><b class="tabIkaEasyOptions">IkaEasy</b></li>');
    var tabContent = $('<div id="tabIkaEasyOptions" style="display: none;" />').appendTo('.mainContent');

    //Transport type
    var transportOptionsTab = $('<div class="contentBox01h" id="ikaeasyTransport" />').appendTo(tabContent);
    $('<h3 class="header">' + zJS.Lang.options.transport.header + '</h3>').appendTo(transportOptionsTab);
    var transportOptionsContent = $('<div class="content" />').appendTo(transportOptionsTab);
    $('<div class="footer" />').appendTo(transportOptionsTab);

    var transportOriginalTxt = '<div id="ikaeasyOriginalTransport" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.transport.original + '</span></div>';
    var transportIkaeasyTxt = '<div id="ikaeasyIkaeasyTransport" class="margin10 clearfix"><div id="Img" class="checkbox radio floatleft"></div><span class="smallFont floatleft checkbox_label">' + zJS.Lang.options.transport.ikaeasy + '</span></div>';
    $('<table><tr><td class="vertical_top"></td><td class="left"><form>' + transportOriginalTxt + transportIkaeasyTxt + '</form></td></tr></table>').appendTo(transportOptionsContent);

    if(localStorage[zJS.Utils.getPlace() + 'transporter-type'] == 1){
        $('#Img', '#ikaeasyIkaeasyTransport').addClass('checked');
    }
    else{
        $('#Img', '#ikaeasyOriginalTransport').addClass('checked');
    }

    $('#ikaeasyOriginalTransport').click(function(){
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasyIkaeasyTransport').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'transporter-type'] = 0;
    });
    $('#ikaeasyIkaeasyTransport').click(function(){
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasyOriginalTransport').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'transporter-type'] = 1;
    });
    //Transport type END
}
zJS.Page.options = {
    init : function() {
        AddIkaEasyOptionsfunction()
    },

    refresh : function() {
        this.init();
    }
};

zJS.Page.optionsAccount = {
    init : function() {
        AddIkaEasyOptionsfunction()
    },

    refresh : function() {
        this.init();
    }
};

zJS.Page.optionsNotification = {
    init : function() {
        AddIkaEasyOptionsfunction()
    },

    refresh : function() {
        this.init();
    }
};

zJS.Page.optionsFacebook = {
    init : function() {
        AddIkaEasyOptionsfunction()
    },

    refresh : function() {
        this.init();
    }
};