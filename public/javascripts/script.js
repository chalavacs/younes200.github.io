	var lastPoints = [];
	var easing = 0.4;
  
  // local drawing data
	var ldrawing = [];
  // remote drawing data
  var rdrawing = [];
  
	var users = [];
  
	var drawbuffer = [];
	var flickr;
	
	var connected = false;
	const RETRY_INTERVAL = 10000;
	var timeout;
	
	var isMouseDown = false;
	var mouse = new Point();
	var canvas;
	var context;
  var lcanvas;
  var lcontext;
	var color = "rgb(244, 119, 35)";
	var strokeSize = 20;
  var redrawIntervalId;
  var resizeIntervalId;
	
	var DEFAULT_BRUSH_SIZE = 30;
	var MAX_BRUSH_SIZE = 50;
	var MIN_BRUSH_SIZE = 5;
	var INK_AMOUNT = 2;
	var SPLASH_RANGE = 75;
	var SPLASH_INK_SIZE = 10;
  
$(document).ready(function () {
	

	
	if (Modernizr.canvas) {
		
		canvas = $("canvas")[0]; ;
    lcanvas = $("lcanvas")[0];
    
		// get the context
		context = canvas.getContext('2d');
    lcontext = lcanvas.getContext('2d');
    
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);
		
		document.addEventListener('mousemove', mouseMove, false);
		document.addEventListener('mousedown', mouseDown, false);
		document.addEventListener('mouseup', mouseUp, false);
		
		brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
		
		// start draw loop
		setInterval(loop, 1000 / 60);
	}
	
	// sockets
	var socket = io.connect('http://');
	
	socket.on('connect', function () {
		connected = true;
		clearTimeout(timeout);
	});
	
	socket.on('disconnect', function () {
		connected = false;
		console.log('disconnected');
		//content.html("<b>Disconnected! Trying to automatically to reconnect in " +  RETRY_INTERVAL/1000 + " seconds.</b>");
		retryConnectOnFailure(RETRY_INTERVAL);
	});
	
	socket.on('user-connected', function (data) {
		console.log("user connected :", data.id);
		users[data.id] = data;
		$('#cursor').clone().appendTo('#cursor_container').attr('id', "cursor-" + data.id).append("<b>user" + data.id + "</b>");
	});
	
	socket.on('users-connected', function (data) {
		
		for (var i = 0; i < data.length; i++) {
			var current = data[i];
			
			$('#cursor').clone().appendTo('#cursor_container').attr('id', "cursor-" + current.id).append("<b>user" + current.id + "</b>");
			
			if (current.cursor)
				setCursor(current.id, current.cursor.x, current.cursor.y);
			//create cursor here
			users[current.id] = current;
		}
		
	});
	
	socket.on('user-disconnected', function (data) {
		console.log("user disconnected :", data);
		var user = users[data.id]
			if (user) {
				
				// delete cursor here
				$("#cursor-" + data.id).remove();
				delete users[user.id];
			}
	});
	
	socket.on('receive-mousemove', function (data) {
		setCursor(data.id, data.cursor.x, data.cursor.y);
	});
	
	socket.on('receive-draw', function (data) {
		rdrawing.push(data);
		
	});
	
	socket.on('receive-draw-bulk', function (data) {
		
		for (var i = 0; i < data.length; i++) {
			// add lines to local draw buffer
			rdrawing = rdrawing.concat(data[i].path);
		}
		redraw(context, data);
		
	});
	
	socket.on('receive-draw-clear', function () {
		rdrawing = [];
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
	});
	
	// TODO register id in cookie
	socket.emit("new-user", {
		id : Math.round(Math.random() * 10000)
	});
	
	$("#nav .clear").click(function () {
		
		socket.emit('draw-clear');
		ldrawing = [];
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
		}
		
	});
	
	function mouseMove(e) {
    mouse.set(e.clientX, e.clientY);
	}
	
	function mouseDown(e) {
    
		brush.resetTip();
    brush.update(mouse);
    
		isMouseDown = true;
    drawbuffer.push({x:mouse.x, y:mouse.y});
	}
	
	function mouseUp(e) {
		isMouseDown = false;
    
    socket.emit('draw', {
				path : drawbuffer,
				color : color,
				size : strokeSize
			});
      
	}
	
	function loop() {
    
		if (isMouseDown) {
      // draw the brush on local canvas first
			brush.draw(lcontext, mouse, color, strokeSize);
      ldrawing.push({x:mouse.x, y:mouse.y});
      drawbuffer.push({x:mouse.x, y:mouse.y});
		}
	}
	
	$(document).bind('mousemove', function (e) {
		socket.emit('mousemove', {
			x : e.pageX / $(window).width(),
			y : e.pageY / $(window).height()
		});
	})
	
	
	
	// Get the coordinates for a mouse or touch event
	function getCoords(e) {
		if (e.offsetX) {
			return {
				x : e.offsetX,
				y : e.offsetY
			};
		} else if (e.layerX) {
			return {
				x : e.layerX,
				y : e.layerY
			};
		} else {
			return {
				x : e.pageX - canvas.offsetLeft,
				y : e.pageY - canvas.offsetTop
			};
		}
	}
	
	function drawlines(lines) {
		
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			drawline(line);
		}
	}
	
	function drawline(data) {
		
		context.save();
		var line = data.path
			context.strokeStyle = data.color;
		context.lineWidth = data.strokeSize;
		context.lineCap = "round";
		context.lineJoin = "round"
			
			context.beginPath();
		context.moveTo(line[0].x, line[0].y);
		for (var i = 1; i < line.length; i++) {
			var p = line[i];
			context.lineTo(p.x, p.y);
			context.stroke();
		}
		
		context.closePath();
		context.restore();
	}
	
	function setCursor(id, x, y) {
		var pageX = x * $(window).width();
		var pageY = y * $(window).height();
		$("#cursor-" + id).css({
			left : pageX,
			top : pageY
		});
	}
	
	function resizeCanvas() {
    
    clearTimeout(resizeIntervalId);
    resizeIntervalId = setTimeout(doneResizing, 500);
  }
  
  function doneResizing(){
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
    
		lcanvas.width = window.innerWidth;
		lcanvas.height = window.innerHeight;
		//redraw();
	}
  
  function redraw(ctx, data){
      		// redraw stuff
		
      
      clearInterval(redrawIntervalId);
			brush.resetTip();
      brush.update(data[0]);
      
       console.log("recover start strokeSize",strokeSize);
       var i = 1;
      var redrawIntervalId = setInterval(function()
      {
          if(i < data.length)
          {
            brush.draw(ctx, data[i], color, strokeSize); 
            i++;
          }else {
            clearInterval(redrawIntervalId);
            console.log("recover end");
          }
      }, 1000 / 60);
      
      
  }
  
	
	var options = {
		autoPlay : false,
		nextButton : true,
		prevButton : true,
		animateStartingFrameIn : true,
		transitionThreshold : 250,
		//keyNavigation: false,
		swipeNavigation : false
	}
	var sequence = $("#sequence").sequence(options).data("sequence");
	
	$.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=e606900de034115b34006a4dcf2c5766&user_id=58821970@N00&photoset_id=72157629696932450&format=json&jsoncallback=?",
		function (data) {
		
		if (data.stat != "ok") {
			
			// something broke!
			console.log(data.stat);
			return;
		}
		flickr = data.photoset.photo;
		
		updatebackground();
		
	});
	
	$("#nav .refresh").click(function () {
		
		sequence.init.preloader();
		updatebackground();
		
	});
	
	function updatebackground() {
		
		var photo = flickr[Math.floor(Math.random() * flickr.length)];
		var url = "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b_d.jpg"
			
			$.backstretch(url, {
				speed : 500
			},
				function () {
				sequence.init.preloader().remove();
				resizeCanvas();
			});
	}
	
	$('a[data-sequence]').click(function (e) {
		var sequenceid = $(e.target).data("sequence");
		sequence.goTo(sequenceid)
		
	});
	
	$("#nav #dots ul li").click(function (e) {
		
		color = $(e.currentTarget).css('background-color');
		
		$('#nav #dots ul li').each(function (index) {
			$(this).removeClass("cur");
		});
		$(e.currentTarget).addClass("cur");
	});
	
	var retryConnectOnFailure = function (retryInMilliseconds) {
		setTimeout(function () {
			if (!connected) {
				$.get('/ping', function (data) {
					connected = true;
					window.location.href = unescape(window.location.pathname);
				});
				retryConnectOnFailure(retryInMilliseconds);
			}
		}, retryInMilliseconds);
	}
});



