if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

$.fn.firstText = function () {
 return $(this).first().contents().filter(function () {
  return this.nodeType == 3;
 }).text();
}

function addNeedText(){
	var res = $('.resUpgrade .resources li').eq(0).attr("class");
	if ($('.resUpgrade .' + res).length == 2) {
			$('.resUpgrade h4')[0].innerText = zJS.Lang.Next_Level;
			var _need = $('.resUpgrade .resources li').eq(0).firstText().replace(/\D+/g,"");
			var _have = $('.resUpgrade .resources li').eq(1).firstText().replace(/\D+/g,"");
			$('div.resUpgrade ul.resources:last').after('<h4 class="bold center">' + zJS.Lang.Required + '</h4><ul class="resources"><li class="' + res + '">'+ zJS.Utils.formatNumber(_need-_have) +'</li></ul>');    
		}
}

zJS.Page.wonder = {
    init : function() {
        addNeedText();
    },
	
	refresh : function() {
		this.init();
	}
};

zJS.Page.tradegood = {
    init : function() {
        addNeedText();
    },
	
	refresh : function() {
		this.init();
	}
};

zJS.Page.resource = {
    init : function() {
        addNeedText();
    },
	
	refresh : function() {
		this.init();
	}
};