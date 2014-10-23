var nowTabId, _url;
function checkForValidUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('.ikariam.gameforge.com') > -1) {
        chrome.pageAction.show(tabId);
        nowTabId = tabId;
        _url = tab.url;
    }
    else {
        window.close();
    }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);


chrome.extension.onRequest.addListener(
    function (request, sender, callback) {
        if (request.type == "ajax") {
            new _ajax(request.url, request.method, request.vars, callback);
        } else {
            callback({}); // snub them.
        }
    }
);



function _ajax(url, method, vars, callback) {
    if (!method) {
        method = 'GET';
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.onreadystatechange = function() {
        alert(0);
        xhr.onreadystatechange = function () {
            alert(xhr.readyState);
            if (xhr.readyState == 4) {
                alert(xhr.responseText);
                callback && callback({response : xhr.responseText});
            }
        }
    };

    xhr.onerror = function(e){
        alert(e);
        console.error("XHR failed for " + url + ", " + e);
    };

    if (method.toLowerCase() == 'post') {
        xhr.setRequestHeader('Accept-Charset', 'utf-8');
        xhr.setRequestHeader('Accept-Language', 'ru, en');
        xhr.setRequestHeader('Connection', 'close');
        xhr.setRequestHeader('Content-length', vars.length);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    try {
        xhr.send(vars);
    } catch (e) {
        alert('aхтунг');
        console.error("XHR failed for " + url + ", " + e);
    }
}