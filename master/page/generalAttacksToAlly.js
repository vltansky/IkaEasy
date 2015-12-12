if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}
zJS.Page.embassyGeneralAttacksToAlly = {
    exportTableToPlainText: function($table) {
        var $rows = $table.find('tr:has(td)'),
            result = '';
        $rows.each(function(){
            result += $('.time', this).text().split(' ').join('') +
                ' | ' + $('td', this).eq(1).text() +
                ' | ' + $('td', this).eq(2).text() +
                ' | ' + $('a', this).eq(0).text() + $('a', this).eq(1).text()
                + ' >>> '
                + $('a', this).eq(3).text() + $('a', this).eq(4).text() + '\r\n';
        });
        return result;
    },
    init: function() {
        var toAll = zJS.Lang.Send_General_Log_Header + '\r\n---------------------------------------------------------------\r\n';
        var $attacksTable = $("#embassyGeneralAttacksToAlly").find(".contentBox01h .embassyTable");
        toAll+= this.exportTableToPlainText($attacksTable);


        //$('.rowRanks').each(function() {
        //    var row = this;
        //    var counter = 0;
        //    $('a', this).each(function() {
        //        if($(this).data('updated')) {
        //            return true;
        //        }
        //
        //        var _this = this;
        //        $.get(this.href, function(data) {
        //            var s = data.indexOf('<span id="js_islandBreadCoords"> ') + '<span id="js_islandBreadCoords"> '.length;
        //            var e = data.indexOf('</span>', s);
        //            $(_this).text($(_this).text() + data.substring(s, e)).data('updated', true);
        //            counter++;
        //            if(counter == 2)
        //                toAll += $('.time', row).text().split(' ').join('') + ' | ' + $('td', row).eq(1).text() + ' | ' + $('td', row).eq(2).text() + ' | ' + $('a', row).eq(0).text() + ' >>> ' + $('a', row).eq(1).text() + '\r\n';
        //        });
        //    });
        //});
        $('#ikaeasy-sendAttacksToAll').remove();
        $('<center><a href="#" class="button" id="ikaeasy-sendAttacksToAll" style="width:100%; height:100px;" >' + zJS.Lang.Send_General_Log + '</a></center><br />').attr('onclick', "ajaxHandlerCall('?view=sendIKMessage&msgType=51&allyId=" + zJS.Var.getAllyId() + "'); return false;").appendTo('.buildingDescription').click(function() {
            localStorage['ikaiasy-msg-to-send'] = toAll;
        });
    }
};