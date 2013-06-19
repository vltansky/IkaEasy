var front = function() {
    this._container = document.getElementById('__ikaeasy');
    this._container.setAttribute('bg', this._getBgId());

    this._updateResources();

    var customEvent = document.createEvent('Event');
    customEvent.initEvent('is_init', true, true);
    this._container.dispatchEvent(customEvent);

    this._customEvent = document.createEvent('Event');
    this._customEvent.initEvent('change_tpl', true, true);

    this._container.addEventListener('execute_js', this.execute_js.bind(this), false);

    // Инициализируем таймер, который будет искать изменения
    setInterval(this.loop.bind(this), 200);

    setInterval(this._updateResources.bind(this), 1000);
};

front.prototype = {
    _last   : '',
    _lastRequest : 0,

    loop : function() {
        var now = this._check();

        if (!this._lastRequest) {
            this._lastRequest = ikariam.model.requestTime;
        }

        if (((now) && (now != this._last)) || (ikariam.model.requestTime != this._lastRequest)) {
            this._updateResources();

            this._lastRequest = ikariam.model.requestTime;
            this._last = now;
            this._container.setAttribute('tpl', now || '');
            this._container.dispatchEvent(this._customEvent);
        }
    },

    _check : function() {
        if ((ikariam.templateView) && (ikariam.templateView.id)) {
            return ikariam.templateView.id;
        }

        return false;
    },

    _getBgId : function() {
        return ikariam.backgroundView.id || document.getElementsByTagName('body')[0].id;
    },

    _updateResources : function() {
        var trasferVars = {allyId : ikariam.model.avatarAllyId, actionRequest : ikariam.model.actionRequest, resources : ikariam.model.currentResources, cities : ikariam.model.relatedCityData, separators : {thousand : LocalizationStrings.thousandSeperator, decimal : LocalizationStrings.decimalPoint}, ships : ikariam.model.freeTransporters};
        if (this._getBgId() == 'city') {
            trasferVars['builds'] = ikariam.backgroundView.screen.data.position;
        } else if (this._getBgId() == 'island') {
            var data = ikariam.backgroundView.screen.data;
            trasferVars['island'] = {islandId : data.id, tradegood : data.tradegoodLevel, wonderType : data.wonder, wonder : data.wonderLevel, wood : data.resourceLevel, cities : data.cities};
        }

        this._container.innerHTML = JSON.stringify(trasferVars);
    },

    execute_js : function() {
        var js = localStorage.getItem('execute_js');
        if (js) {
            var _value = ((js != 'false') ? (($ && $.parseJSON) ? $.parseJSON(js) : eval('(' + js + ')')) : false);
            if (_value){
                if ((_value['expire'] == 0) || (_value['expire'] >= (new Date()).getTime())) {
                    try{
                        eval(_value['value']);
                    } catch(e) {

                    }
                }
            }
            localStorage.removeItem('execute_js');
        }
    }
};

var _front = new front();



if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()   + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':
                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':
                return String(value);

            case 'object':
                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());
