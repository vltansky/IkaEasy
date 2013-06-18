if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

function addMaxValue(){
	$('ul#units li.unit').each(function(){
		try{
			$('a.setMax', this).click();
			var maxVal = $('input.textfield', this).val();
			$('a.setMin', this).click();
			var container = $('<span class="ikaeasy_barracks_max"> / ' + maxVal + '</span>');
			$('div.forminput', this).append(container);
		}
		catch(ex){}
	});
}

zJS.Page.barracks = {
	init : function() {
		addMaxValue();
	},
	
	refresh : function() {
		this.init();
	}
};

zJS.Page.shipyard = {
	init : function() {
		addMaxValue();
	},
	
	refresh : function() {
		this.init();
	}
};