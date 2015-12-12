if(typeof  zJS == "undefined") {
    zJS = {};
}

var navigation = function() {
    this._action = false;
    this._action_name = '';

    this._container = $('<span style="display: none;" id="__ikaeasy"></span>');
    $('body').append(this._container).append('<span style="display: none;" id="__ikaeasy_sources"></span>');

    $(this._container).on('change_tpl', this._changeTpl.bind(this));
    $(this._container).on('is_init', this._initBg.bind(this));

    appendScript(chrome.extension.getURL('inner/ikaeasy.js'));
};

navigation.prototype = {
    _changeTpl: function() {
        if((this._getTplId()) && (this._action) && (this._action.dont_refresh)) {
            return;
        }

        this._action && this._action.destroy && this._action.destroy();

        if(this._getTplId()) {
            this._initPage(this._getTplId());
        }
        else {
            this._action = false;
        }

        this._bg && this._bg.refresh && this._bg.refresh();
        this._common && this._common.refresh && this._common.refresh();
    },

    _initBg: function() {
        this._common = this._initPage("__common");
        this._bg = this._initPage(this._getBgId());
    },

    _initPage: function(name) {
        if(typeof name != 'string') {
            return;
        }

        var content_func = zJS.Utils.extractClass("zJS.Page." + name);
        if(typeof content_func == 'object') {
            console.log("zJS.Page." + name);
            this._action = content_func;
            this._action.init();
            this._action_name = name;
        }

        return this._action;
    },

    _getTplId: function() {
        return $(this._container).attr('tpl') || false;
    },

    _getBgId: function() {
        return $(this._container).attr('bg');
    }
};

var version = $('#GF_toolbar').find('.version').text().replace(/[^\d\.]+/g, '').split('.');
if(version.length == 3) {
    version.push('0');
}
if(version[0] == '0') {
    version.splice(0, 1);
}

var ver = parseInt(version.join(''));
if(ver >= 500) {
    zJS.Navigation = new navigation();
}