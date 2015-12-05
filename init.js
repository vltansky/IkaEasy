appendStyle(zJS.Utils.getUrl('css/ikaeasy.css?version=2.0.0.91'));//@todo change with update
//appendStyle(zJS.Utils.getUrl('css/ikalogs.css?version=2.0.0.91'));//@todo add if with settings
appendStyle('/skin/compiled-' + zJS.Utils.getServerDomain() + '-island.css');

function appendScript(src) {
    $('head').append('<script type="text/javascript" src="' + src + '"></script>');
}

function appendStyle(src) {
    $('head').append('<link href="' + src + '"  rel="stylesheet" type="text/css" />');
}

function getiUrlImage(url) {
    return chrome.extension.getURL('images/' + url);
}

function createDynamic(title, content) {
    return zJS.Utils.createDynamic(title, content);
}

function getServerDomain() {
    return zJS.Utils.getServerDomain();
}

function askms(params, handler) {
    zJS.Utils.askms(params, handler || false);
}

function getJSON(url, callback) {
    $.ajax({
        url: url,
        async: true,
        dataType: "json",
        error: callback,
        success: callback
    });
}

function postJSON(url, data, callback) {
    $.ajax({
        url: url,
        data: data,
        async: true,
        type: "POST",
        error: callback || false,
        success: callback || false,
        dataType: "json"
    });
}

Array.prototype.removeEl = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}