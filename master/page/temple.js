if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.temple = {
    _container: $("#temple_c"),
    init: function() {
    },

    checkTimer: function(){
        console.log(" LETS CHECK! ");
        var $coolDown = $("#js_WonderTextCooldown", this._container);
        var activated = $("#js_WonderTextDuration");
        var temple_level = parseInt($("#wonderLevelDisplay").text());
        var $button = $("#js_WonderActivateButton");
        if(!$timer.length && zJS.Utils.getItem("pirateDeadlineActive") == 2){
            zJS.Utils.setItem("pirateDeadline", null);
            zJS.Utils.setItem("pirateDeadlineActive", 0);
            this.enableShortcutButton();
            console.log("PIRATE NO COUNTDOWN");
        }else if($timer.length && zJS.Utils.getItem("pirateDeadlineActive") == 1){
            zJS.Utils.setItem("pirateDeadlineActive", 2);
            this.disableShortcutButton();
            this.startTimer();
            console.log("== Active 2");
        }
    },

    startTimer: function(){
        console.log("===pirate start timer");
        var self = this,
            format = '%M:%S';
        if(zJS.Utils.hoursBetween(new Date(), localStorage.getItem("pirateDeadline"))>0){
            format = '%H:%M:%S';
        }
        $("#ikaez_pirateCountdown").countdown(zJS.Utils.getItem("pirateDeadline"), function(event) {
            $(this).text(
                event.strftime(format)
            );
        }).on('finish.countdown', function(event) {
            self.enableShortcutButton();
        });
    },
};