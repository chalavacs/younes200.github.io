jQuery(document).ready(function ($) {

	var links = $('.navigation').find('li'),
	scrolling = false,
    slide = $('.slide'),
	sidebar = $('#button-sidebar'),
    button = $('.button'),
    mywindow = $(window),
    htmlbody = $('body');
	
    //$(window).stellar();

		
		var current=0;
		function showHeading(){
			
			var $heading = $('#heading'+(current+1));
			var $title = $('#title'+(current+1));
			
			$title.css({opacity: 0,display: "block"}).animate({opacity: 1.0}, 500);
			$heading.css({opacity: 0,left: -50}).animate({opacity: 1.0,left: ($heading.parent().width() / 2 - $heading.width() / 2)}, 1000);
			
			
			setTimeout(function(){
					$heading.css({opacity: 1}).animate({opacity: 0,left: -50}, 500,function(){showHeading();});    
					$title.css({opacity: 1}).animate({opacity: 0}, 500,function(){ $title.css({display: "none"}); });    
					current=(current+1)%4;
					
			}, 5000);
		}

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
				console.log("dataslide=", dataslide);
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
		if(!scrolling){
			scrolling = true;
			htmlbody.scrollTo( $('.slide[data-slide="' + dataslide + '"]'), 2000 , {axis:'y', onAfter:function(){ 
				scrolling = false;
				} 
			})
		}
		console.log("here");
		/*.animate({
            scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top -  $(window).position().top
        }, 2000, 'easeInOutQuint');
		*/
    }


	$('.navigation').localScroll({
		axis:'y'
	});
	
	
	// Attach a submit handler to the form
	$( "#contact-form" ).submit(function( event ) {
	 
	 
		// Stop form from submitting normally
		event.preventDefault();
	 
		// Get some values from elements on the page:
		var $form = $( this ),
			name = $form.find( "input[name='name']" ).val(),
			email = $form.find( "input[name='email']" ).val(),
			subject = $form.find( "input[name='subject']" ).val(),
			message = $form.find( "input[name='message']" ).val();
	 
		// Send the data using post
		var posting = $.ajax({
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Authorization", "Basic YXBpOmtleS0xeTh3OTdwcnBpbGwwdzMtNGotNHRlaHN5bzYyMjI0Mg==");
				},
				type: "post",
				url: "https://api.mailgun.net/v2/interactive-object.com/messages",
				dataType: 'json',
				async: false,
				data: '{"from": "'+email+'", "to" : "contact@interactive-object.com", "subject":"[Website] '+subject+'", "text":"'+message+'"}'
			});
	 
		// Put the results in a div
		posting.done(function( data ) {
			alert('Thanks for your comment!'); 
			
		});
	});


	setTimeout(function(){
		showHeading();
	}, 500);
});