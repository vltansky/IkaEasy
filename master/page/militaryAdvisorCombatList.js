if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.militaryAdvisorCombatList = {
    //dont_refresh: true,
    init: function() {
        console.log(" ==== militaryAdvisorCombatList");
        if($(".ikaez_combat_tr").length < 1) {
            this._resources();
        }
    },

    _resources: function(){
        var $table = $("#combatList"),
            battles = zJS.Utils.ls.getValue('battles'), // get battles or false
            db = zJS.DB._loadDB(),
            combatId,
            combatLink,
            $wrapper,
            $target_td,
            $target_th,
            sidebar;

        //if(!battles){ // stop function if no battles
        //    return false;
        //}
        $target_th = $table.find("thead th").last().before('<th class="ikaez_combat_resources_th"><img src="' + db.images.resources.all + '"></th>');

        sidebar = '<li class="accordionItem" style=""><a class="accordionTitle active">Statistics<span class="indicator"></span></a><div class="accordionContent"><div id="premiumAdvisorSidebar" class="dynamic">'+
            '<p>' + zJS.Lang.robbed + ': ' + battles.total + '<img src="' + db.images.resources.all + '">.</p></div></div></li>';
        $("#sidebarWidget").append(sidebar);

        $table.find("tbody tr").each(function(i, el){
            combatId = zJS.Utils.format.onlyInt($(this).find("td input[type='checkbox']").attr("name"));
            combatLink = $(this).find("a.watchBattle").attr("href");
            console.log(battles[combatId]);
            if(!battles[combatId]) {
                $.ajax({
                    url: combatLink,
                    success: function(data) {
                        var start = data.indexOf('ikariam.getClass(ajax.Responder, ') + 'ikariam.getClass(ajax.Responder,'.length,
                            end = data.indexOf(',["updateBacklink",{"link"', start),
                            $resources_container,
                            combatId,
                            $html,
                            battles = zJS.Utils.ls.getValue('battles'), // get battles or false
                            total = 0,
                            temp_res = [];

                        var parsedJson = JSON.parse(data.substring(start, end) + ']');
                        if(parsedJson[0][0] == 'changeView' && parsedJson[0][1][0] == 'militaryAdvisorReportView') {
                            $html = $(parsedJson[0][1][1]);
                            if($html.find("#combatRoundTimer").length < 1) {
                                if(!battles) {
                                    battles = {
                                        total: 0
                                    };
                                }// !battles
                                combatId = $html.find(".link:first a.button").attr('href').match(/detailedCombatId=(\d+)/i)[1];

                                if(!battles[combatId]) {
                                    battles[combatId] = {};
                                    $resources_container = $html.find("ul.resources");
                                    var $td;
                                    $td = $("tr.ikaez_combatId-"+combatId).find(".ikaez_combat_resources_td");
                                    if($resources_container.length > 0) {
                                        var __inner;
                                        $resources_container.find("li").each(function(i, el) {
                                            var in_count = zJS.Utils.format.onlyInt(el.innerHTML); // amount of robbed resources
                                            temp_res.push({
                                                amount: in_count,
                                                type: $(el).find("img").attr('src').match(/icon_(\S+)_/i)[1]// type of res (wood, marble,..)
                                            });
                                            total += in_count;
                                        });
                                        battles[combatId].resources = temp_res;
                                        battles[combatId].total = total;
                                        battles.total += total;
                                        zJS.Utils.ls.setValue('battles', battles); // expire var if needed, in "ikalogs.js" same function
                                        $td.find(".ikaez_amount").text(total); // set total

                                        if(temp_res.length>1) {
                                            __inner = '<div class="ikaez_combat_resources_tooltip">';
                                            $.each(temp_res, function(i, resource) {
                                                __inner += '<span class="ikaez_battle_resource"><img src="' + db.images.resources.small[resource.type] + '">' +
                                                    ' <span class="ikaez_amount">' + resource.amount + '</span></span>';
                                            });
                                            __inner += '</div>';
                                            $td.append(__inner);
                                        }
                                    } // $resources_container.length
                                    else{
                                        zJS.Utils.ls.setValue('battles', battles); // expire var if needed, in "ikalogs.js" same function
                                        $td.find(".ikaez_amount").text(0); // set total
                                    }

                                }//!battles[combatId]
                            }// #combatRoundTimer.length
                        }// 'changeView && militaryAdvisorReportView
                    } // sucess
                });//ajax;
            }// !battles[combatId

            var classes = 'ikaez_combat_tr ikaez_combatId-'+combatId;
            if(typeof battles[combatId] !== "undefined" && typeof battles[combatId].ikalogs !== "undefined"){
                classes += ' ikaez_combat_ikalogs';
            }
            $(this).addClass(classes);
            $(this).find("td").last().before("<td class='ikaez_combat_resources_td'></td>");
            $target_td = $(this).find(".ikaez_combat_resources_td");
            $wrapper = $("<div />", {
                "class": "innerWrapper",
                "css"  : {
                    "height"  : $target_td.height(),
                    "width"   : "100%",
                    "position": "relative"
                }
            });
            $target_td.wrapInner($wrapper);
            var total = battles[combatId] ? (battles[combatId].total ? battles[combatId].total : 0) : '-',
                total_image = battles[combatId] && battles[combatId].resources && battles[combatId].resources.length == 1 ? db.images.resources.small[battles[combatId].resources[0].type] : db.images.resources.all;
            var _inner = '<div class="ikaez_combat_resources_total"><img src="' + total_image + '"> <span class="ikaez_amount">' + total + '</span></div>';
            if(typeof battles[combatId] !== "undefined" && typeof battles[combatId].resources !== "undefined" && battles[combatId].resources.length>1) {
                _inner += '<div class="ikaez_combat_resources_tooltip">';
                $.each(battles[combatId].resources, function(i, resource) {
                    _inner += '<span class="ikaez_battle_resource"><img src="' + db.images.resources.small[resource.type] + '">' +
                        ' <span class="ikaez_amount">' + resource.amount + '</span></span>';
                });
                _inner += '</div>';
            }
            $(this).find(".innerWrapper").html(_inner);
        });
    }
};