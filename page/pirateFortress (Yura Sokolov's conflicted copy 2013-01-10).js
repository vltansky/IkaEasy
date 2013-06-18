if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.pirateFortress = {
    init : function() {
		var id = 'ikaeasy-automotization';
        $('.pirateHeader').append('<span class="button" id="' + id + '">Автоматизация</span>');
		$('#' + id).click(function(){
			$('#pirateCaptureBox .table01 tbody tr td.action a').eq(0).click();
		});
    }
};