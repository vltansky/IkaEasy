if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.pirateFortress = {
    _pirateButtonStorage: zJS.Utils.ls.getValue(zJS.Utils.getServerPrefix()+'pirateButton'),
    init: function() {
        if(zJS.Options.getOption("pirateButton")) {
            this._pirateShortcut();
        }

        this._checkCaptcha();

        // Раскоментируешь - грозит бан :))
        //$('#pirateCaptureBox .table01 tbody tr td.action a').click(function() {// Запускаем скрипт при нажатии на "захват"
        //    console.log("===== Pirate autoclick");
        //    setInterval(function() {//Ставим интервал в 2.5 минуты к примеру
        //        var inerval = Math.floor((Math.random() * 600) + 1) * 1000;// возьмём случайное число от 1 до 6000 милисекунд, тоесть 1 минуты
        //        setTimeout(pirateAction, inerval); // через указанное время отправимся за пиратами (и получим бал, помни об этом!!!)
        //    }, 2.5 * 60 * 1000); // 2.5 * 60 - seconds to minutes, * 1000 - ms to seconds
        //});
        //
        //
        //function pirateAction(){// Функция о которой лучше забыть
        //    var cityId = 391;// номер моего города, для тестов. Чтобы работало для всех - добавь настройки
        //    $('#js_cityIdOnChange').val(cityId);// меняем город на свой, в котором крепость, чтобы не выдало ошибки
        //    zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");// Запускаем скрипт икариама для смены городов
        //    setTimeout(function () {// На всякий подождём 0.6 секунды, пока смениться город
        //        console.log('================================= Pirate action!');
        //        zJS.Utils.execute_js("ajaxHandlerCall('?view=pirateFortress&position=17&action=PiracyScreen&function=capture&buildingLevel=1&cityId=" + cityId + "');");// Отправляемся за пиратами и радуемся =)
        //    }, 600); // TODO set interval with checking
        //}
    },

    checkTimer: function(){
        console.log(" LETS CHECK! ");
        var $timer = $("#pirateCaptureBox").find("#missionProgressTime");
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
        }).off('finish.countdown').on('finish.countdown', function(event) {
            console.log("============= CountDown Finished! =======");
            self.enableShortcutButton();


            if (Notification.permission !== "granted")
                Notification.requestPermission();

            var notification = new Notification('IkaEasy: Ваши пираты вернулись с захвата', {
                icon: chrome.extension.getURL('images/capturePoints.png'),
                body: "Нажмите сюда чтобы снова отправить пиратов на захват",
            });

            notification.onclick = function () {
                console.log("onclick");
                self.capturePirates();
                notification.close();
            }
        });
    },

    enableShortcutButton: function(){
        var $shortcutButton = $("#ikaez_fastPirateButtons");
        $shortcutButton.removeClass("disabled");
        $shortcutButton.find(".button.capture").removeClass("button_disabled");
    },

    disableShortcutButton: function(){
        var $shortcutButton = $("#ikaez_fastPirateButtons");
        $shortcutButton.addClass("disabled");
        $shortcutButton.find(".button.capture").addClass("button_disabled");
    },

    captureClicked: function(href){
        console.log("captured clicked");
        var levelTimes = [];
        levelTimes[1] = 150;
        levelTimes[3] = 450;
        levelTimes[5] = 900;
        levelTimes[7] = 1800;
        levelTimes[9] = 3600;
        levelTimes[11] = 7200;
        levelTimes[13] = 14400;
        levelTimes[15] = 28800;
        levelTimes[17] = 57600;

        var level = href.match(/buildingLevel=(\d+)/i)[1];
        var finishedDate =  new Date().getTime() + levelTimes[level] * 1000;
        // @todo domain localstorage
        zJS.Utils.setItem("pirateDeadline", finishedDate);
        zJS.Utils.setItem("pirateDeadlineActive", 1);
        //zJS.Utils.setItem("pirateLastHref", href);
    },

    capturePirates: function() {
        var self = this;
        if(zJS.Var.getCityId != self._pirateButtonStorage.cityId) {
            $('#js_cityIdOnChange').val(self._pirateButtonStorage.cityId);
            zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");
        }
        setTimeout(function() {
            console.log('action!');
            zJS.Utils.execute_js("ajaxHandlerCall('" + self._pirateButtonStorage.url + "');");
            self.captureClicked(self._pirateButtonStorage.url);
        }, 1000); // TODO set interval with checking
    },

    _pirateShortcut: function(){
        var self = this;
        this.checkTimer();
        $(".button.capture:not(.ikaez_pirateCapture)").off("click.timer").on("click.timer", function(){
            self.captureClicked($(this).attr("href"));
        });
        $(".action .button.capture:not(.ikaez_complete)").before('<a href="#" class="ikaez_save_pirate_capture"></a>').addClass("ikaez_complete");

        var $capture_links = $("a.ikaez_save_pirate_capture");

        $capture_links.on("click", function(e) {
            e.preventDefault();
            var href = $(this).next(".button.capture").attr('href');
            $capture_links.removeClass("ikaez_active");
            //$("#ikaez_fastPirateButtons").remove();
            $(this).addClass("ikaez_active");
            zJS.Utils.ls.setValue(zJS.Utils.getServerPrefix()+'pirateButton', {url: href, cityId: zJS.Var.getCityId()});
        });

        var pirateButtonStorage = zJS.Utils.ls.getValue(zJS.Utils.getServerPrefix()+'pirateButton');
        $(".button.capture[href='"+ pirateButtonStorage.url +"']").prev("a.ikaez_save_pirate_capture").addClass("ikaez_active");
    },

    _checkCaptcha: function(){
        if($(".captchaImage").length) {
            console.log("!=========== PIRATE CAPTCHA");

            var notification = new Notification('IkaEasy: new notification', {
                icon: zJS.Utils.generateDomain() + "/skin/resources/capturePoints.png",
                body: "Pirate captcha",
            });


            var audio = new Audio('http://ikariam-easy.com/pirate_notification.wav');
            audio.play();
        }
    }
};