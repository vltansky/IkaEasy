if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.pirateFortress = {
    init: function() {
        // Раскоментируешь - грозит бан :))
        //$('#pirateCaptureBox .table01 tbody tr td.action a').click(function() {// Запускаем скрипт при нажатии на "захват"
        //    setInterval(function() {//Ставим интервал в 2.5 минуты к примеру
        //        var inerval = Math.floor((Math.random() * 600) + 1) * 1000;// возьмём случайное число от 1 до 6000 милисекунд, тоесть 1 минуты
        //        setTimeout(pirateAction, inerval); // через указанное время отправимся за пиратами (и получим бал, помни об этом!!!)
        //    }, 2.5 * 60 * 1000); // 2.5 * 60 - seconds to minutes, * 1000 - ms to seconds
        //});


        function pirateAction(){// Функция о которой лучше забыть
            var cityId = 391;// номер моего города, для тестов. Чтобы работало для всех - добавь настройки
            $('#js_cityIdOnChange').val(cityId);// меняем город на свой, в котором крепость, чтобы не выдало ошибки
            zJS.Utils.execute_js("ajaxHandlerCallFromForm(document.getElementById('changeCityForm'));");// Запускаем скрипт икариама для смены городов
            setTimeout(function () {// На всякий подождём 0.6 секунды, пока смениться город
                console.log('================================= Pirate action!');
                zJS.Utils.execute_js("ajaxHandlerCall('?view=pirateFortress&position=17&action=PiracyScreen&function=capture&buildingLevel=1&cityId=" + cityId + "');");// Отправляемся за пиратами и радуемся =)
            }, 600); // TODO set interval with checking
        }
    }
};