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
        this._addTransportBtns();
        this.SaveTime();
    },

    change_to_ikaeasy_transport_buttons: function(_this, self){
        console.log('change_to_ikaeasy_transport_buttons');
        if($(_this).find('.ikaeasy_resource').length === 0) {
            var box = $('<div class="ikaeasy_resource"></div>');
            $('div.sliderinput', _this).append(box);
            $('.minusPlusValueContainer').remove();
            $('.minus', '.resourceAssign').remove();
            $('.plus', '.resourceAssign').remove();

            var button;
            button = '<a class="button plus_minis ikaez_transport_button_trigger" data-sum="-500" href="#">-</a>';
            button += '<a class="button plus_minis ikaez_transport_button_trigger" data-sum="+500" href="#">+</a>';
            button += '<a class="button ikaez_transport_button_trigger" data-sum="+1000" href="#">+1k</a>';
            button += '<a class="button ikaez_transport_button_trigger" data-sum="+2000"  href="#">+2k</a>';
            button += '<a class="button ikaez_transport_button_trigger" data-sum="+5000"  href="#">+5k</a>';

            box.append(button);
        }
    },

    ikaeasy_transporter_click_handler: function(){
        $(".ikaez_transport_button_trigger").on("click", function(){
            var $input = $(this).parent().closest(".sliderinput").find("input");
            var val = parseInt($input.val());
            var sum = parseInt($(this).attr('data-sum'));

            //if((k === 0) && (val % 500 !== 0)) {
            //    val -= (val % 500);
            //}
            //else if((k == 1) && (val % 500 !== 0)) {
            //    val += 500 - (val % 500);
            //}
            //else {
            val += sum;
            //}
            $input.val(val).focus().blur();
        });
    },
    _addTransportBtns: function() {
        console.log('_addTransportBtns');
        var $container = $("#transportGoods");
        if(!$container.hasClass("ikaez_complete")) {
            var self = this;
            $('#transportGoods ul.resourceAssign li').each(function() {
                var obj = this;
                if(zJS.Options.getOption('transport')) {
                    self.change_to_ikaeasy_transport_buttons(this);
                }

                // @todo optimize code here
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

            if(zJS.Options.getOption('transport')) {
                $container.addClass("ikaez_transport_goods");
            }
            this.ikaeasy_transporter_click_handler();

            $container.addClass("ikaez_complete");
        }
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

    SaveTime: function() {
        var journeyTime = $("#journeyTime");
    }
};