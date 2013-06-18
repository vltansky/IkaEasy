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
					wine = data.substring(start, end);
					start = data.indexOf('savedWine[25] = ') + 'savedWine[25] = '.length;
					end = data.indexOf(';', start);
					var discount = data.substring(start,end);
					discount = discount > 0 ? discount : 0;
					console.log('wine: ' + wine + '\r\ndiscount: ' + discount);
					wine = wine > 0 ? Math.round(wine - discount) : 0;
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