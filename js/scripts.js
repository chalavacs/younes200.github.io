jQuery(document).ready(function ($) {

	var links = $('.navigation').find('li');
    slide = $('.slide');
	sidebar = $('#button-sidebar');
    button = $('.button');
    mywindow = $(window);
    htmlbody = $('html,body');
	
    $(window).stellar();

	sidebar.sidr({
		onOpen: function(){
			sidebar.addClass("icon-arrow-left").removeClass("icon-menu");
		},
		onClose: function(){
			sidebar.removeClass("icon-arrow-left").addClass("icon-menu");;
		}
	});
	
    


    slide.waypoint(function (event, direction) {

        dataslide = $(this).attr('data-slide');

        if (direction === 'down') {
            $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
        }
        else {
            $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
        }

    });
 
    mywindow.scroll(function () {
        if (mywindow.scrollTop() == 0) {
            $('.navigation li[data-slide="1"]').addClass('active');
            $('.navigation li[data-slide="2"]').removeClass('active');
        }
    });

    function goToByScroll(dataslide) {
        htmlbody.animate({
            scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
        }, 2000, 'easeInOutQuint');
    }



    links.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        goToByScroll(dataslide);
    });

    button.click(function (e) {
        e.preventDefault();
        dataslide = $(this).attr('data-slide');
        goToByScroll(dataslide);

    });


});