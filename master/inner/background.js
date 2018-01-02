var nowTabId, _url;

function checkForValidUrl(tabId, changeInfo, tab) {
    if(tab.url.indexOf('.ikariam.gameforge.com') > -1) {
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
    function(request, sender, callback) {
        if(request.type == "ajax") {
            new _ajax(request.url, request.method, request.vars, callback);
        }
        else {
            callback({}); // snub them.
        }
    }
);


function _ajax(url, method, vars, callback) {
    if(!method) {
        method = 'GET';
    }

    var xhr = new XMLHttpRequest();
    xhr.open(method.toUpperCase(), url, true);
    xhr.onreadystatechange = function() {
        console.log(0);
        xhr.onreadystatechange = function() {
            console.log(xhr.readyState);
            if(xhr.readyState == 4) {
                //alert(xhr.responseText);
                console.log(xhr.responseText);
                callback && callback({response: xhr.responseText});
            }
        };
    };

    xhr.onerror = function(e) {
        console.error("XHR failed for " + url + ", " + e);
    };

    if(method.toLowerCase() == 'post') {
        xhr.setRequestHeader('Accept-Charset', 'utf-8');
        xhr.setRequestHeader('Accept-Language', 'ru, en');
        xhr.setRequestHeader('Connection', 'close');
        xhr.setRequestHeader('Content-length', vars.length);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    try {
        xhr.send(vars);
    } catch(e) {
        console.error("XHR failed for " + url + ", " + e);
    }
}

mr.start();
chrome.storage.sync.get('mn', function(item) {
    if(item.mn == "false"){
        mr.stop();
    }
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(changes.mn.newValue == "false"){
        mr.stop();
        stopRequest();
    }else{
        mr.start();
    }
});

function startRequest() {
    console.log('live');
    window.setTimeout(startRequest, 1000);
}

startRequest();