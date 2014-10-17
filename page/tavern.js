if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.tavern = {
	init : function() {
		this.getWine();
	},
	
	getWine : function(){
		try{
			var tavern = $('.tavern');
			
			$.ajax({
				url: $('a', tavern)[0].href,
				success: function(data){
					var locWine = zJS.Utils.getLocWine();
					var start = data.indexOf('wineSpendings: ') + 'wineSpendings: '.length;
					var end = data.indexOf(',', start);
					var regular_wine = data.substring(start, end);
					wine=$("#js_GlobalMenu_WineConsumption").text();
					var discount = regular_wine-wine;
					discount = discount > 0 ? discount : 0;
					console.log('wine: ' + wine + '\r\ndiscount: ' + discount);
					localStorage.setItem(locWine, wine);
					zJS.Page.__common._getProduction(1);
				}
			});
		}
		catch(err){
			console.log(err);
		}
	},
	
	refresh : function() {
		this.init();
	}
};