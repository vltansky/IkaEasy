/**
 * Created by Tansky on 23.10.2014.
 */
if(typeof zJS == "undefined") {
    zJS = {};
}

if(typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.finances = {
    init: function() {
        var LocFinance = zJS.Utils.getLocFinance(),
            LocFinanceDate = zJS.Utils.getLocFinance() + '_date',
            $SumGoldTable = $("#finances").find('table.upkeepReductionTable:last');
        var GoldPerHour = $SumGoldTable.find('tr.result td.hidden.bold').text().replace(/[^\d+]/g, '');
        var pn_char = '';//по умолчанию берем значение +
        if($SumGoldTable.find('tr.result td.hidden.bold').text()[0] != GoldPerHour[0]) {
            pn_char = 'red';
            GoldPerHour = 0 - GoldPerHour;
        }
        localStorage.setItem(LocFinance, GoldPerHour);
        localStorage.setItem(LocFinanceDate, new Date());
        if(!$SumGoldTable.hasClass("ikaeasy_complete")) {
            var per_day = GoldPerHour * 24,
                per_week = GoldPerHour * 168,//24*7
                per_month = GoldPerHour * 730,//from google
                per_custom = GoldPerHour * 2;
            var template = '<tr class="ikaeasy_finance_tr"><td class="left reason"><img src="skin/layout/sigma.png" alt="Сумма"> <input class="textfield" id="ikaeasy_gold_calc" type="number" name="ikaeasy_gold_calc" value="2" size="4" min="1" max="5000"> ' + zJS.Lang.hours + '</td><td class="costs"></td><td class="left bar"></td><td id="ikaeasy_gold_custom" class="hidden ' + pn_char + ' bold">' + zJS.Utils.formatNumber(per_custom) + '</td> </tr> ' +
                '<tr class="ikaeasy_finance_tr"><td class="left reason"><img src="skin/layout/sigma.png" alt="Сумма"> ' + zJS.Lang.per_day + '</td><td class="costs"></td><td class="left bar"></td><td class="hidden ' + pn_char + ' bold">' + zJS.Utils.formatNumber(per_day) + '</td> </tr> ' +
                '<tr class="ikaeasy_finance_tr"><td class="left reason"><img src="skin/layout/sigma.png" alt="Сумма"> ' + zJS.Lang.per_week + '</td><td class="costs"></td><td class="left bar"></td><td class="hidden ' + pn_char + ' bold">' + zJS.Utils.formatNumber(per_week) + '</td> </tr> ' +
                '<tr class="ikaeasy_finance_tr"><td class="left reason"><img src="skin/layout/sigma.png" alt="Сумма"> ' + zJS.Lang.per_month + '</td><td class="costs"></td><td class="left bar"></td><td class="hidden ' + pn_char + ' bold">' + zJS.Utils.formatNumber(per_month) + '</td> </tr> ';
            $SumGoldTable.append(template);
            $SumGoldTable.addClass('ikaeasy_complete');
        }
        $("#ikaeasy_gold_calc").change(function() {
            var custom_number = $("#ikaeasy_gold_calc").val();
            var calc = custom_number * GoldPerHour;
            if(calc < 0)
                pn_char = 'red';
            $("#ikaeasy_gold_custom").removeClass('red').addClass(pn_char).text(zJS.Utils.formatNumber(calc));
        });

    },

    refresh: function() {

    }
};