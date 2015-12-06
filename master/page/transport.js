if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.transport = {
    _sources: [-500, 500, 1000, 2000, 5000],

    init: function() {
        this.moveTransportBtn();
        if(!zJS.Options.getOption('transport')) {
            this._addTransportBtns();
        }
        this.SaveTime();
    },

    _addTransportBtns: function() {
        var self = this;

        $('.ikaeasy_resource').remove();

        $('#transportGoods ul.resourceAssign li').each(function() {
            var obj = this;
            var box = $('<div class="ikaeasy_resource"></div>');
            $('div.sliderinput', this).append(box);
                $('.minusPlusValueContainer').remove();
                $('.minus', '.resourceAssign').each(function() {
                    $(this).remove();
                });
                $('.plus', '.resourceAssign').each(function() {
                    $(this).remove();
                });

                var button = [];
                button.push($('<a class="button" style="padding: 2px 10px;" href="#">-</a>'));
                button.push($('<a class="button" style="padding: 2px 10px;" href="#">+</a>'));
                button.push($('<a class="button" href="#">+1k</a>'));
                button.push($('<a class="button" href="#">+2k</a>'));
                button.push($('<a class="button" href="#">+5k</a>'));

                $.each(button, function(k, v) {
                    $(v).click(function(e) {
                        e.preventDefault();
                        self.addSource(k, obj);
                    });

                    box.append(v);
                });

                //adding style
                $('#transportGoods ul.resourceAssign').each(function() {
                    $(this).css('width', '100%').css('margin', '10px 5px');
                });
                $('#transportGoods ul.resourceAssign li div.sliderinput').each(function() {
                    $(this).css('margin', '0 25px');
                });
                $('#transportGoods ul.resourceAssign li input').each(function() {
                    $(this).css('left', '330px').css('top', '-29px');
                });
                $('#transportGoods ul.resourceAssign li .ikaeasy_resource').each(function() {
                    $(this).css('width', '180px').css('position', 'relative').css('top', '-50px').css('left', '380px').css('text-align', 'center');
                });
                $('#transportGoods ul.resourceAssign li .ikaeasy_resource a.button').each(function() {
                    $(this).css('padding', '2px 5px');
                });

            var a1 = $('a.setMax', this), a2 = $('a.setMin', this);
            var aa1 = $(a1).clone(), aa2 = $(a2).clone();

            $(a1).before(aa1);
            $(a2).before(aa2);

            $(a1).remove();
            $(a2).remove();

            aa1.removeAttr('id');
            aa2.removeAttr('id');

            $(aa1).click(function(e) {
                e.preventDefault();
                var val = parseInt($('input', obj).val());
                $('input', obj).val('999999').focus().blur();

                var newval = parseInt($('input', obj).val());

                if(newval % 500 !== 0) {
                    if(newval - (newval % 500) > val) {
                        newval -= (newval % 500);
                        $('input', obj).val(newval).focus().blur();
                    }
                }
            });

            $(aa2).click(function(e) {
                e.preventDefault();
                var val = parseInt($('input', obj).val());

                if((val > 500) && (val % 500 !== 0)) {
                    val -= (val % 500);
                }
                else {
                    val = 0;
                }

                $('input', obj).val(val).focus().blur();
            });
        });
    },

    moveTransportBtn: function() {
        if($("#ikaeasy_tranport_btn").length === 0) {
            var $transport_container = $('#missionSummary').addClass('ikaeasy_transport_container');
            var $transportersCapacity = $('.transportersCapacity');
            $transportersCapacity.before($transport_container);
            var $transBtn = $('<br><center id="ikaeasy_tranport_btn"><input id="submit" class="button action_bubble" title="" type="submit" value="' + zJS.Lang.Transport + '"></center>').appendTo($('.resourceAssign'));
            $transportersCapacity.before($transBtn);
        }
    },

    addSource: function(k, obj) {
        var val = parseInt($('input', obj).val());

        if((k === 0) && (val % 500 !== 0)) {
            val -= (val % 500);
        }
        else if((k == 1) && (val % 500 !== 0)) {
            val += 500 - (val % 500);
        }
        else {
            val += this._sources[k];
        }

        $('input', obj).val(val).focus().blur();
    },

    SaveTime: function() {
        var journeyTime = $("#journeyTime");
    }
};