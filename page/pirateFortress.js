if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.pirateFortress = {
    init : function() {
		$('#pirateCaptureBox .table01 tbody tr td.action a').click(function(){
			console.log(new Date());
			setTimeout(function(){
				$(this).click();
			}, 2.5 * 60 * 1000 + 5000);
		});
    }
};