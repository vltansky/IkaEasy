if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

if(typeof zJS.Options == "undefined") {
    zJS.Options = {};
}

zJS.Options = {
    init: function(){
        console.log("options init");
        this.options = zJS.Utils.ls.getValue("options") || {};
        console.log(this.options);
        if($("#js_tabIkaEasyOptions").length){
            return false;
        }
        //Creating the tab itself
        $('.tabmenu').css('display', 'block').append('<li onclick="switchTab(\'tabIkaEasyOptions\');" id="js_tabIkaEasyOptions" class="tab"><b class="tabIkaEasyOptions">IkaEasy</b></li>');
        var tabContent = $('<div id="tabIkaEasyOptions" style="display: none;" />');
        // Creating inner content elements
        var contentBox = $('<div class="contentBox01h" id="ikaeasyTransport" />').appendTo(tabContent);
        $('<h3 class="header">IkaEasy</h3>').appendTo(contentBox);
        var innerContent = $('<div class="content" />').appendTo(contentBox);
        $('<div class="footer" />').appendTo(contentBox);
        zJS.Options.$content = $('<table class="options table01"></table>');

        // Options start

        this.addOption({
            id: 'transport',
            title: zJS.Lang.options.transport.header,
            options: [
                zJS.Lang.options.transport.original,
                zJS.Lang.options.transport.ikaeasy
            ]
        });

        this.addOption({
            id: 'movement_tabs',
            title: zJS.Lang.options.movement_tabs.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'gold_per_hour',
            title: zJS.Lang.options.gold_per_hour.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'island_ap',
            title: zJS.Lang.options.island_ap.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'searchIslands',
            title: zJS.Lang.options.search_islands.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'transporter',
            title: zJS.Lang.options.transporter.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'combatRobbedResources',
            title: zJS.Lang.options.combat_resources.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        // Options end

        zJS.Options.$content.appendTo(innerContent);
        tabContent.appendTo('.mainContent');

        // init JS action handler
        zJS.Options.actionHandler.init();
    },

    addOption: function(obj){
        var settings = {
            id: null,
            type: "true_false",
            title: 'undefined',
            options: {
                true: zJS.Lang.options.enable,
                false: zJS.Lang.options.disable
            },
            default: "true"
        };
        $.extend( settings, obj );
        if(!settings.id){
            console.warn("Options warning: no ID in settings");
            return false;
        }
        if(this.options[obj.id]){
            settings.default = this.options[obj.id];
        }
        var $controls = '',
            check_class;

        $.each(settings.options, function( key, value ) {
            if(key === 0){
                key = true;
            }else if(key == 1){
                key = false;
            }
            check_class = '';
            if(settings.default == key.toString()){
                check_class = 'checked';
            }
            console.debug(check_class);

            $controls += '<div id="ikaeasy_options-' +settings.id + '_' + key+'" data-value="' +key+ '" class="margin10 clearfix ikaeasy_options_btn"><div id="Img" class="checkbox radio floatleft '+ check_class +'"></div><span class="smallFont floatleft checkbox_label">' + value + '</span></div>';
        });

        $('<tr><td>' +settings.title+ '</td><td class="left"><form class="ikaez_options_form ikaez_options_type-'+ settings.type +'" data-id="'+ settings.id +'">' + $controls + '</form></td></tr>').appendTo(zJS.Options.$content);
    },

    getOption: function(id){
        if(!this.options){
            this.options = zJS.Utils.ls.getValue("options") || {};
        }

        console.log("get option :");
        console.log(this.options[id]);

        // return boolean except string
        if(this.options[id] == 'true' || !this.options[id]){
            return true;
        }else if(this.options[id] == 'false'){
            return false;
        }

        return this.options[id];
    },

    saveOption: function(id, value){
        console.log("save option :");

        this.options[id] = value;
        zJS.Utils.ls.setValue("options", this.options);

        console.log(this.options);
    }
};
zJS.Options.actionHandler = {
  init: function(){
      var $form_tf = $(".ikaez_options_form");

      $form_tf.find(".ikaeasy_options_btn").on('click', this.true_false);
  },

    true_false: function(){
        var value = $(this).attr('data-value'),
            $form = $(this).closest('.ikaez_options_form'),
            id = $form.attr('data-id');

        zJS.Options.saveOption(id, value);

        $form.find('.ikaeasy_options_btn #Img').toggleClass("checked");

    }
};

function AddIkaEasyOptionsfunction() {

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

    if(localStorage[zJS.Utils.getPlace() + 'options-island_ap'] == 1) {
        $('#Img', '#ikaeasy_options-ap_disabled').addClass('checked');
    }
    else {
        $('#Img', '#ikaeasy_options-ap_enabled').addClass('checked');
    }

    $('#ikaeasy_options-ap_enabled').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options-ap_disabled').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options-island_ap'] = 0;
    });
    $('#ikaeasy_options-ap_disabled').click(function() {
        $('#Img', this).addClass('checked');
        $('#Img', '#ikaeasy_options-ap_enabled').removeClass('checked');
        localStorage[zJS.Utils.getPlace() + 'options-island_ap'] = 1;
    });
    //Gold per hour END


    //Development section
    var devSection = $('<div class="contentBox01h" id="ikaeasyDev" />').appendTo(tabContent);
    $('<h3 class="header">Development</h3>').appendTo(devSection);
    var devSectionContent = $('<div class="content" />').appendTo(devSection);
    $('<div class="footer" />').appendTo(devSection);
    $('<div class="development_content">'+zJS.Lang.options.development.overview+'</div>').appendTo(devSectionContent);

}
zJS.Page.options = {
    init: function() {
        zJS.Options.init();
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsAccount = {
    init: function() {
        zJS.Options.init();
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsNotification = {
    init: function() {
        zJS.Options.init();
    },

    refresh: function() {
        this.init();
    }
};

zJS.Page.optionsFacebook = {
    init: function() {
        zJS.Options.init();
    },

    refresh: function() {
        this.init();
    }
};