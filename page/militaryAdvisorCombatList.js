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
            $wrapper,
            $target_td,
            $target_th;

        //if(!battles){ // stop function if no battles
        //    return false;
        //}
        $target_th = $table.find("thead th").last().addClass("ikaez_combat_resources_th").text(zJS.Lang.robbed);

        $table.find("tbody tr").each(function(i, el){
            combatId = zJS.Utils.format.onlyInt($(this).find("td input[type='checkbox']").attr("name"));
            $(this).addClass('ikaez_combat_tr ikaez_combatId-'+combatId);
            $target_td = $(this).find("td").last().addClass("ikaez_combat_resources_td");
            $wrapper = $("<div />", {
                "class": "innerWrapper",
                "css"  : {
                    "height"  : $target_td.height(),
                    "width"   : "100%",
                    "position": "relative"
                }
            });
            $target_td.wrapInner($wrapper);
            var total = battles[combatId] && battles[combatId].total ? battles[combatId].total : '-',
                total_image = battles[combatId] && battles[combatId].resources && battles[combatId].resources.length == 1 ? db.images.resources.small[battles[combatId].resources[0].type] : db.images.resources.all;
            var _inner = '<div class="ikaez_combat_resources_total"><img src="' + total_image + '"> ' + total + '</div>';
            if(battles[combatId] && battles[combatId].resources.length>1) {
                _inner += '<div class="ikaez_combat_resources_tooltip">';
                $.each(battles[combatId].resources, function(i, resource) {
                    _inner += '<span class="ikaez_battle_resource"><img src="' + db.images.resources.small[resource.type] + '">' +
                        ' ' + resource.amount + '</span>';
                });
                _inner += '</div>';
            }
            $(this).find(".innerWrapper").html(_inner)
        });
    }
};