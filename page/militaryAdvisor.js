if (typeof zJS == "undefined") {
    zJS = {};
}

if (typeof zJS.Page == "undefined") {
    zJS.Page = {};
}

zJS.Page.militaryAdvisor = {
    init : function() {
	
		$('#js_MilitaryMovementsFleetMovementsTable td').each(function(){
			$(this).css('padding', '4px 0px').removeClass('right');
		});
		
        // Отображение войск и флотов в военном советнике.
        $('#js_MilitaryMovementsFleetMovementsTable tr').has('td').each(function(){
            var wrapper = $('<div class="ikaeasy_transport_main"></div>');

			if($('.unit_detail_icon', this)[0] != null){
				$('.unit_detail_icon', this).each(function(){
					$(wrapper).append($(this).addClass('ikaeasy_transport_unit'));
				});

				$('td', this).eq(3).empty().append(wrapper).attr('colspan', '2');
				$('td', this).eq(4).remove();
			}
        });
    },

    refresh : function() {
        this.init();
    }
};