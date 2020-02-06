$(".mobile").click(function() {
  $("nav").slideToggle();  
});

var menu = $("nav");
jQuery(window).on('resize', function(){     
    if(!jQuery(".mobile").is(":visible") && !menu.is(':visible'))
    {
        menu.css({'display':''});   
    }
});
