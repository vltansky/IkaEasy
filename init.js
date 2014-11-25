appendStyle(zJS.Utils.getUrl('css/ikaeasy.css'));
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