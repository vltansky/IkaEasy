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
                zJS.Lang.options.transport.ikaeasy,
                zJS.Lang.options.transport.original
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

        this.addOption({
            id: 'infoBlock',
            title: zJS.Lang.options.infoBox.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'pirateButton',
            title: zJS.Lang.options.pirateButton.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });

        this.addOption({
            id: 'arrivalTime',
            title: zJS.Lang.options.arrivalTime.header,
            options: [
                zJS.Lang.options.arrivalTime.enable,
                zJS.Lang.options.arrivalTime.disable
            ]
        });

        this.addOption({
            id: 'shipsOwner',
            title: zJS.Lang.options.shipsOwner.header,
            options: [
                zJS.Lang.options.enable,
                zJS.Lang.options.disable
            ]
        });



        // Options end

        zJS.Options.$content.appendTo(innerContent);


        //Development section
        var devSection = $('<div class="contentBox01h" id="ikaeasyDev" />').appendTo(tabContent);
        $('<h3 class="header">Development</h3>').appendTo(devSection);
        var devSectionContent = $('<div class="content" />').appendTo(devSection);
        $('<div class="footer" />').appendTo(devSection);
        $('<div class="development_content">'+zJS.Lang.options.development.overview + zJS.Lang.options.development.donate_link +'</div>').appendTo(devSectionContent);


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

        // return boolean except string
        if(this.options[id] == 'true' || !this.options[id]){
            return true;
        }else if(this.options[id] == 'false'){
            return false;
        }

        return this.options[id];
    },

    saveOption: function(id, value){
        console.log("saving option..");
        this.options[id] = value;
        zJS.Utils.ls.setValue("options", this.options);
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