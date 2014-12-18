/*! ikariam-easy v0.1 | ikariam-easy.com */

/*! new page */
$('body').on('click', 'a[target^=_blank], a[rel^=external], area[target^=_blank]', function(e) {  
    window.open($(this).attr('href'));
    return false;
});  
        
/*! reload page */
$('body').on('click', 'a[target^=sayfayenile], a[rel^=appendix], area[target^=sayfayenile]', function(e) { 
    window.location= $(this).attr('href');
    return false;
});
     
/*! go top */
$('body').on('click', 'a', function(e) {
    $(window).scrollTop(0);
    e.preventDefault();
}); 
                        
 /*! tab menü */
$(document).ready(function() {
	//Default Action 1
	$(".tab_content").hide(); //Hide all content
	$("ul.tabs li:first").addClass("active").show(); //Activate first tab
	$(".tab_content:first").show(); //Show first tab content
	
	//On Click Event 1
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content
		var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active content
		return false;
	});
});
