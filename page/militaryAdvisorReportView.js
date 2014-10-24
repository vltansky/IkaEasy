if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.militaryAdvisorReportView = {
    dont_refresh : true,

    init : function() {
        if (typeof ikalogs != "undefined") {
            var _ikalogs = new ikalogs();
        }
    var $full_report=$('.link:first');
    $('#militaryAdvisorReportView').find('div.content').after($full_report);
        $full_report.addClass('ikaeasy_full_report_btn');
    }
};