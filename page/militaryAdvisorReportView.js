if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.militaryAdvisorReportView = {
    //dont_refresh: true,

    init: function() {
        if(typeof ikalogs != "undefined") {
            var _ikalogs = new ikalogs();
        }
        if($('#troopsReport').find('.result').length > 0 && !$(".ikaeasy_full_report_btn").length) {
            var $full_report = $('.link:first').clone().addClass('ikaeasy_full_report_btn'),
                _now = zJS.Var._now(), // get now in seconds
                //expire = _now + 86400 * 30, // 30 days TODO change it
                battles = zJS.Utils.ls.getValue('battles'), // get battles or false
                $resources_container = $(".result ul.resources"),
                combatId = $full_report.find("a.button").attr('href').match(/detailedCombatId=(\d+)/i)[1],
                amount,
                total = 0,
                resource_type,
                temp_res = [];

            if(!battles){
                battles = {};
            }
            if(!battles[combatId] || (typeof battles[combatId] !== "undefined" && battles[combatId].resources.length < 1)) {
                if(!battles[combatId]){
                    battles[combatId] = {};
                }
                if($resources_container.length > 0) {
                    $resources_container.find("li").each(function(i, el) {
                        var in_count = zJS.Utils.format.onlyInt(el.innerHTML);
                        temp_res.push({
                            amount: in_count,
                            type: $(el).find("img").attr('src').match(/icon_(\S+)_/i)[1]
                        });
                        total += in_count;
                    });
                    battles[combatId].resources = temp_res;
                    battles[combatId].total = total;
                }
                zJS.Utils.ls.setValue('battles', battles); // expire var if needed, in "ikalogs.js" same function
                console.log(battles);
            }
            $('#militaryAdvisorReportView').find('div.content').after($full_report);
        }
    }
};