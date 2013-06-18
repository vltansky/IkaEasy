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
    }
};