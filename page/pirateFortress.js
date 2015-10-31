if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.pirateFortress = {
    init: function() {
        //$('#pirateCaptureBox .table01 tbody tr td.action a').click(function() {
        //    setInterval(function() {
        //        var inerval = Math.floor((Math.random() * 600) + 1) * 1000;
        //        setTimeout(pirateAction, inerval);
        //    }, 2.5 * 60 * 1000); // 2.5 * 60 - seconds to minutes, * 1000 - ms to seconds
        //});


        function pirateAction(){
            var cityId = 391;
            $('#js_cityIdOnChange').val(cityId);
            zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");
            setTimeout(function () {
                console.log('================================= Pirate action!');
                zJS.Utils.execute_js("ajaxHandlerCall('?view=pirateFortress&position=17&action=PiracyScreen&function=capture&buildingLevel=1&cityId=" + cityId + "');");
            }, 600); // TODO set interval with checking
        }
    }
};