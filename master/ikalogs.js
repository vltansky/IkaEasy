var ikalogs = function() {
    this.init();
};

ikalogs.prototype = {
    _cnt_round_for_part: 20,

    _loader: getiUrlImage('ikalogs-loader.gif'),

    _short: false,
    _full: {},
    _users_ally: {},
    _user_id: null,

    _box: false,

    _all_rounds: 0,
    _rep_id: 0,
    ls_battles: {},

    _rounds: [],
    _rounds_each: [2, 5, 10, 15, 20, 25, 50, 75, 100],

    _select_report_type: 'select[name="report_type"]',

    _cnt_ally_names: 0,

    init: function() {
        var user_data = $.parseJSON(zJS.Utils.getItem('user_data'));
        this._user_id = user_data.avatarId;
        console.log(this._user_id);

        this.ls_battles = zJS.Utils.ls.getValue('battles');
        if(!this.ls_battles){
            this.ls_battles = {
                total: 0
            };
        }

        this._make_box();
    },

    _analize: function(e) {
        e.preventDefault();

        $('.ikalogs_result', this._box).hide();
        $('.ikalogs_block', this._box).hide();
        $('.ikalogs_loader', this._box).show();
        $('.ikalogs_loader span', this._box).text(zJS.Lang.ikalogs.get_info);

        if($(this._select_report_type, this._box).val() == 'between') {
            var __rounds = $('.ikalogs_between input', this._box).val();
            if(__rounds == '') {
                $(this._select_report_type, this._box).val('short');
            }

            __rounds = __rounds.replace(/\s/g, '').split(',');
            $.each(__rounds, function(k, v) {
                if(/^\d+$/.test(v)) {
                    this._rounds.push(parseInt(v));
                }
                else if(/^\d+\-\d+$/.test(v)) {
                    var t = v.split('-');
                    if(parseInt(t[0]) < parseInt(t[1])) {
                        this._update_rounds(t[0], t[1]);
                    }
                    else if(t[0] > t[1]) {
                        this._update_rounds(t[1], t[0]);
                    }
                    else {
                        this._rounds.push(parseInt(t[0]));
                    }
                }
            }.bind(this));

            if(this._rounds.length == 0) {
                $(this._select_report_type, this._box).val('short');
            }
            else {
                this._rounds = jQuery.unique(this._rounds);
                this._rounds = this._rounds.sort(function(a, b) {
                    return a > b;
                });
            }
        }

        var count = 0, self = this;
        var _afterAll = function() {
            if(--count == 0) {
                self.isComplete();
            }
        };
        var $troopsReport = $('#troopsReport');
        var url = $troopsReport.find('.contentBox01h p.link a').eq(0).attr('href');
        this._rep_id = url.match(/detailedCombatId=(\d+)/i)[1];

        // Получаем краткий доклад
        count++;
        this._get_short_log(_afterAll);

        $troopsReport.find('div.attacker span > a').each(function() {
            count++;
            self._get_user_ally($.trim($(this).text()), _afterAll);
        });

        $troopsReport.find('div.defender span > a').each(function() {
            count++;
            self._get_user_ally($.trim($(this).text()), _afterAll);
        });

        count++;

        $.get('/index.php?view=highscore&showMe=1&ajax=1', function(data) {
            data = jQuery.parseJSON(data)[1][1][1];
            var t = data.match(/<tr class="(.*?\s)?own(\s.*?)?">[\s\S]*?<td class="name">([^<]+)<\/td>[\s\S]*?<td class="allytag">([\s\S]*?)<\/td>/);
            if(t) {
                this._users_ally[$.trim(t[3])] = $.trim(t[4].replace(/(<[^>]+>)/g, ''));
            }
            _afterAll();
        }.bind(this));

        // Нужно ли вообще получать раунды?
        if($(this._select_report_type, this._box).val() != 'short') {
            // Нужно! Значит для начала по любому получим первый раунд

            var first = '';
            url = $troopsReport.find('.contentBox01h p.link a').eq(0).attr('href');
            var __first_r = url.match(/combatRound=(\d+)/i)[1];

            $('.ikalogs_loader span', this._box).text(zJS.Lang.ikalogs.get_rounds);
            count++;
            $.get('?view=militaryAdvisorDetailedReportView&combatRound=' + __first_r + '&detailedCombatId=' + this._rep_id + '&ajax=1', function(data) {
                data = jQuery.parseJSON(data)[1][1][1];
                first = this._parse_report(data);

                if(first != '') {
                    this._all_rounds = parseInt(first.match(/\d+ \/ (\d+)<\/li>/i)[1]);

                    switch($(this._select_report_type, this._box).val()) {
                        case 'each' :
                            this._get_round_list(parseInt($('select[name="report_rounds"]', this._box).val()));
                            break;

                        case "full" :
                            this._get_round_list(1);
                            break;

                        case "last" :
                            this._rounds = [this._all_rounds];
                            break;
                    }

                    var _index = 0;

                    if(this._rounds[_index] == 1) {
                        this._setFullRound(first);
                        _index++;
                    }

                    // Получаем инфу о юзере (как минмум id)
                    count++;
                    //$.get('?view=options&ajax=1', function(data) {
                    //    data = jQuery.parseJSON(data)[1][1][1];
                    //    var a = data.match(/<div id="options_debug">[\s\S]*?<td>[\s\S]*?<td[\s\S]*?>([\s\S]+?)<\/td>/mi);
                    //    this._user_id = ((a) && (a.length == 2)) ? $.trim(a[1]) : 0;
                    //
                    //    if(!this._user_id) {
                    //        // Пробуем разок повторить
                    //        count++;
                    //        $.get('?view=options&ajax=1', function(data) {
                    //            data = jQuery.parseJSON(data)[1][1][1];
                    //            var a = data.match(/<div id="options_debug">[\s\S]*?<td>[\s\S]*?<td[\s\S]*?>([\s\S]+?)<\/td>/mi);
                    //            this._user_id = ((a) && (a.length == 2)) ? $.trim(a[1]) : 0;
                    //
                    //            if(!this._user_id) {
                    //                this._user_id_log = data;
                    //            }
                    //
                    //            _afterAll();
                    //        }.bind(this));
                    //    }
                    //
                    //    _afterAll();
                    //}.bind(this));
                    _afterAll();
                    // Загружаем раунды по 5 штук за раз
                    var queue = [].concat(this._rounds),
                        ikalogs_loader_progress = $('.ikalogs_loader_progress div', this._box),
                        query_func = function() {
                            if(queue.length) {
                                var r_id = queue.shift();
                                count++;
                                $.get('?view=militaryAdvisorDetailedReportView&combatRound=' + r_id + '&detailedCombatId=' + this._rep_id + '&ajax=1', function(data) {
                                    try {
                                        data = jQuery.parseJSON(data)[1][1][1];
                                    } catch(e) {
                                        queue.push(r_id);
                                        query_func();
                                        _afterAll();
                                        return;
                                    }

                                    var t = this._parse_report(data);
                                    if(t != '') {
                                        this._setFullRound(t);
                                    }
                                    query_func();
                                    _afterAll();

                                    $(ikalogs_loader_progress).width((100 - ((queue.length * 100) / this._rounds.length)) + '%');
                                }.bind(this));
                            }
                        }.bind(this);

                    for(var i = 0; i < 5; i++) {
                        query_func();
                    }
                }
                _afterAll();
            }.bind(this));
        }
        else {
            count++;
            _afterAll();
        }
    },

    _setFullRound: function(data) {
        var rounds = data.match(/(\d+) \/ (\d+)<\/li>/i);

        if(rounds.length == 3) {
            var round = parseInt(rounds[1]);
            $.each(this._rounds, function(k, v) {
                if(v == round) {
                    this._full[round] = data;
                    return false;
                }
            }.bind(this));
        }
    },

    _get_user_ally: function(name, callback) {
        this._cnt_ally_names++;
        var post = {
            highscoreType: 'score',
            offset: -1,
            view: 'highscore',
            sbm: 'Submit',
            searchUser: name,
            ajax: 1
        };


        $.post('/index.php', post, function(data) {
            try {
                data = jQuery.parseJSON(data)[1][1][1];
            } catch(e) {
                this._get_user_ally(name, callback);
                return;
            }

            this._users_ally[name] = '';

            var pattern = /<td class="name[\s\S]*?">([^<]+)<\/td>[\s\S]*?<td class="allytag">([\s\S]*?)<\/td>/g;
            var matches = data.match(pattern);

            if(matches) {
                $.each(matches, function(k, v) {
                    var t = v.match(/<td class="name[\s\S]*?">([^<]+)<\/td>[\s\S]*?<td class="allytag">([\s\S]*?)<\/td>/);
                    if(t) {
                        if($.trim(t[1].replace(/(<[^>]+>)/g, '')) == name) {
                            this._users_ally[name] = $.trim(t[2].replace(/(<[^>]+>)/g, ''));
                        }
                    }
                }.bind(this));
            }

            callback();
        }.bind(this));
    },

    _update_rounds: function(a, b) {
        for(var i = parseInt(a); i <= parseInt(b); i++) {
            this._rounds.push(i);
        }
    },

    _get_short_log: function(callback) {
        $.get('?view=militaryAdvisorReportView&combatId=' + this._rep_id + '&ajax=1', function(data) {
            data = jQuery.parseJSON(data)[1][1][1];

            this._short = data.match(/<div id="militaryAdvisorReportView">([\s\S]*?)$/)[1];
            callback();
        }.bind(this));
    },

    _get_round_list: function(step) {
        for(var i = 1; i <= this._all_rounds; i += step) {
            this._rounds.push(i);
        }
    },

    _parse_report: function(data) {
        var matches = data.match(/id="mainview"([\s\S]*?)$/i);
        return (!matches) ? '' : ((matches.length == 2) ? matches[1] : matches[0]);
    },

    isComplete: function() {
        $('.ikalogs_loader span', this._box).text(zJS.Lang.ikalogs.saving);
        this._send_report();
    },

    _get_response: function(data) {
        $('.ikalogs_block', this._box).hide();
        $('.ikalogs_loader', this._box).hide();
        $('.ikalogs_result', this._box).show();

        if((data) && (data.status == 'ok')) {
            $('.ikalogs_result span', this._box).text(zJS.Lang.ikalogs.saving_success);
            $('.ikalogs_result a', this._box)
                .text(zJS.Lang.ikalogs.open_report)
                .attr('href', data.url)
                .attr('target', '__blank')
                .off('click', this._repeat.bind(this));

            this.ls_battles = zJS.Utils.ls.getValue('battles');
            if(!this.ls_battles){
                this.ls_battles = {
                    total: 0
                };
            }

            if(typeof this.ls_battles[this._rep_id] === "undefined") {
                this.ls_battles[this._rep_id] = {
                    total: 0
                }
            }
            this.ls_battles[this._rep_id].ikalogs = data.url;
            zJS.Utils.ls.setValue('battles', this.ls_battles);
        }
        else {
            this._show_failed(data);
        }
    },

    _show_failed: function(data) {
        data && data.errorNo && console && console.log('ErrorNo: ' + data.errorNo);

        $('.ikalogs_result span', this._box).html('<span style="color:#bb0000;">' + zJS.Lang.ikalogs.saving_failed + '</span>');
        $('.ikalogs_result a', this._box)
            .text(zJS.Lang.ikalogs.repeat)
            .on('click', this._repeat.bind(this));
    },

    _repeat: function(e) {
        $('.ikalogs_result a', this._box).off('click', this._repeat.bind(this));
        this._analize(e);
    },

    _send_report: function() {
        var version = $('#GF_toolbar').find('.version').text().replace(/[^\d\.]+/g, '').split('.');
        if(version.length == 3) {
            version.push('0');
        }
        if(version[0] == '0') {
            version.splice(0, 1);
        }

        var _obj = {
            'short': this._short,
            'server': this.get_server_domain(),
            'world': this.get_server_world().substring(1),
            'rounds': jQuery.unique(this._rounds),
            'max': this._all_rounds,
            'ally': this._users_ally,
            'rep_id': this._rep_id,
            'version': parseInt(version.join('')),
            'user': this._user_id,
            'user_log': (this._user_id_log) ? this._user_id_log : '',
            'finished': 0
        };

        $('.ikalogs_loader_progress div', this._box).width('0%');
        if(this._rounds.length > this._cnt_round_for_part) {
            this._sendPartLogs(_obj, 0);
        }
        else {
            _obj['full'] = this._full;
            _obj['finished'] = 1;
            this._sendRequest(_obj);
        }
    },

    _sendPartLogs: function(obj, start, id) {
        $('.ikalogs_loader_progress div', this._box).width((start * 100 / this._rounds.length) + '%');

        obj['full'] = {};

        if((id) && (start > 0)) {
            obj['id'] = id;
        }
        else if((start > 0) && (!id)) {
            this._show_failed(data);
        }

        if(start < obj.rounds.length) {
            if(start == this._cnt_round_for_part) {
                obj['short'] = 'incomplete';
            }

            for(var j = 1; j <= this._cnt_round_for_part; j++) {
                obj['full'][obj.rounds[obj.rounds.length - (start + j)]] = this._full[obj.rounds[obj.rounds.length - (start + j)]];
            }

            start += this._cnt_round_for_part;
        }
        else {
            obj['finished'] = 1;
            this._sendRequest(obj);

            return;
        }

        this._sendRequest(obj, function(data) {
            if((data) && (data.status == 'ok') && (data.rep_id)) {
                this._sendPartLogs(obj, start, data.rep_id);
            }
            else {
                this._show_failed(data);
            }
        }.bind(this));
    },

    _checkIsAuth: function() {
        getJSON('http://ikalogs.ru/layout/user/isAuth/', function(data) {
            if(data && data.auth && data.email) {
                $('#ikalogs_auth').text(data.email);
            }
            else {
                $('#ikalogs_auth').html('<a href="http://ikalogs.ru" target="__blank" style="font-weight: inherit;color:red;">' + zJS.Lang.ikalogs.auth.not_logged + '</a>');
            }
        }.bind(this));
    },

    _sendRequest: function(vars, callback) {
        postJSON('http://ikalogs.ru/common/import/', vars, function(data) {
            if(!data.status) {
                data = {'status': 'failed'};
            }

            if(!callback) {
                this._get_response(data);
            }
            else {
                callback(data);
            }
        }.bind(this));
    },

    _make_box: function() {
        console.log('IkaLogs make box');
        if($('.__ikalogs').length > 0) {
            return;
        }

        var _types = '';
        $.each(zJS.Lang.ikalogs.types, function(k, v) {
            _types += '<option value="' + k + '">' + v + '</option>';
        });

        var report_round = '';
        $.each(this._rounds_each, function(k, v) {
            report_round += '<option value="' + v + '">' + zJS.Lang.ikalogs.each + ' ' + v + '</option>';
        });

        if($('#ikalogs_saver').length > 0) {
            $('#ikalogs_saver').parent().parent().parent().parent().remove();
        }

        var dynamic_content = '<div style="padding: 5px 5px;" class="ikalogs_block" id="ikalogs_saver">' +
            '<div id="ikalogs_auth" style="text-align: center; padding-bottom: 10px;font-weight: bold;"></div>' +
            '<div id="ikalogs_already_exist"><a href=""></a></div>' +
            '<select name="report_type" style="width:203px;">' + _types + '</select>' +
            '<select name="report_rounds" style="width:203px; display:none;">' + report_round + '</select>' +
            '<div class="ikalogs_between" style="width:208px; display: none; text-align: center;">' +
            '<p style="color:gray; font-size: 9px; text-align: left; margin: 10px 3px 2px 3px;">' + zJS.Lang.ikalogs.help_bw + '</p>' +
            '<input type="text" name="between" style="width:197px;">' +
            '</div>' +
            '<div class="centerButton"><a href="" class="button" style="color:#542C0F">' + zJS.Lang.ikalogs.analyze + '</a></div>' +
            '</div>' +
            '<div class="content ikalogs_loader" style="padding: 5px 5px; display: none; text-align: center;position:relative;">' +
            '<div class="ikalogs_loader_progress" style="position: absolute;z-index: 5;width: 178px;height: 10px;top: 8px;left: 21px;opacity: 0.3;">' +
            '<div style="background: red;height: 100%;width: 0;"></div>' +
            '</div>' +
            '<img src="' + this._loader + '" alt="" style="width:190px;" /><br/><span></span></div>' +
            '<div class="content ikalogs_result" style="padding: 5px 5px; display: none; text-align: center;"><span style="font-weight: bold;"></span><br/><br/><a href=""></a></div>';

        this._box = createDynamic(zJS.Lang.ikalogs.save_log, dynamic_content);

        $('#backTo').after(this._box);

        var url = $('#troopsReport').find('.contentBox01h p.link a').eq(0).attr('href');
        this._rep_id = url.match(/detailedCombatId=(\d+)/i)[1];

        if(typeof this.ls_battles[this._rep_id] !== "undefined" && this.ls_battles[this._rep_id].ikalogs) {
            $('#ikalogs_already_exist a', this._box)
                .text(zJS.Lang.ikalogs.last_report)
                .attr('href', this.ls_battles[this._rep_id].ikalogs)
                .attr('target', '__blank')
                .off('click', this._repeat.bind(this));
        }
        this._checkIsAuth();

        $(this._select_report_type, this._box).change(function() {
            $('select[name="report_rounds"]', this._box).hide();
            $('.ikalogs_between', this._box).hide();

            switch($(this._select_report_type, this._box).val()) {
                case 'each' :
                    $('select[name="report_rounds"]', this._box).show();
                    break;

                case "between" :
                    $('.ikalogs_between', this._box).show();
                    break;
            }
        }.bind(this));

        $('a.button', this._box).click(this._analize.bind(this));
    },

    get_server_domain: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[2] : false) || 'ru';
    },

    get_server_world: function() {
        var hostMatch = /(s\d+)-([a-z]+)?\.ikariam.gameforge.com/i.exec(top.location.host);
        return (hostMatch ? hostMatch[1] : false) || 's?';
    }
};