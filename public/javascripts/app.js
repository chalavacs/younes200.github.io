$(document).ready(function () {
	
	var lastPoints = [];
	var easing = 0.4;
	var drawing = [];
	var users = [];
	var drawbuffer;
  var flickr;
	
  
  
	var canvas;
  var context;
  
  if(Modernizr.canvas){
  
    canvas = $("canvas")[0];;
      // get the context
     context = canvas.getContext('2d');
    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);
	}
  
		// sockets
	var socket = io.connect('http://');
	
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
	
	socket.on('receive-draw', function (line) {
		drawing.push(line);
		drawline(line);
	});
	
	socket.on('receive-draw-bulk', function (lines) {
		
		for (var i = 0; i < lines.length; i++) {
			// add lines to local draw buffer
			drawing.push(lines[i]);
		}
		if(context){
      drawlines(lines);
    }
		
	});
	
	socket.on('receive-draw-clear', function () {
		drawing = [];
    if(context){
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
	});
	
	// TODO register id in cookie
	socket.emit("new-user", {
		id : Math.round(Math.random() * 10000)
	});
  
 
	$(".clear-button").click(function () {
		
		socket.emit('draw-clear');
    drawing = [];
    if(context){
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
		
	});
  
  
	$('body').on('drag dragstart dragend', function (e) {
		
		var type = e.handleObj.type;
    if(context){
      draw(e.clientX, e.clientY, type);
    }
		
	});
	
	$(document).bind('mousemove', function (e) {
		socket.emit('mousemove', {
			x : e.pageX / $(window).width(),
			y : e.pageY / $(window).height()
		});
	})
	
	function draw(x, y, type) {
		
		if (type === "dragstart") {
			drawbuffer = [];
			context.beginPath();
			drawbuffer.push({
				x : x,
				y : y
			});
			return context.moveTo(x, y);
		} else if (type === "drag") {
			drawbuffer.push({
				x : x,
				y : y
			});
			context.lineTo(x, y);
			context.strokeStyle = "rgba(255,217,0,1)";
			context.fillStyle = "rgba(255,217,0,1)";
			context.lineWidth = 10;
			context.lineCap = "round";
			context.lineJoin = "round"
				return context.stroke();
		} else {
			// add the line
			drawing.push(drawbuffer);
			socket.emit('draw', drawbuffer);
			return context.closePath();
		}
	};
	
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
	
	function drawline(line) {
		context.beginPath();
		context.moveTo(line[0].x, line[0].y);
		for (var i = 1; i < line.length; i++) {
			var p = line[i];
			context.lineTo(p.x, p.y);
			context.strokeStyle = "rgba(255,217,0,0.1)";
			context.fillStyle = "rgba(255,217,0,0.1)";
			context.lineWidth = 10;
			context.lineCap = "round";
			context.lineJoin = "round"
				context.stroke();
		}
		
		context.closePath();
		
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
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		// redraw stuff
		drawlines(drawing);
		
	}
  

  
  
  
  var options = {
      autoPlay:false,
      nextButton: true,
				prevButton: true,
				animateStartingFrameIn: true,
				transitionThreshold: 250,
      }
  var sequence = $("#sequence").sequence(options).data("sequence");
  
  
    
    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=e606900de034115b34006a4dcf2c5766&user_id=58821970@N00&photoset_id=72157629696932450&format=json&jsoncallback=?", 
    function (data) {
      
      if (data.stat != "ok") {
        
        // something broke!
        console.log(data.stat );
        return;
      }
      flickr = data.photoset.photo;
     
      updatebackground();
      
    });
  
  
  
  $(".refresh-button").click(function () {
	
    sequence.init.preloader();
		updatebackground();
		
	});
	
   function updatebackground(){

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
  
  
  

  
  
	
	
});
