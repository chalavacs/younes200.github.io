
var socket;
var users = [];
var user = {
      draw: []
    }

  

var drawbuffer = [];

var connected = false;
const RETRY_INTERVAL = 10000;
var timeout;

var isMouseDown = false;
var mouse = new Point();

var canvas, localcanvas;
var context, lcontext;

var rdrawing = [];

const INK_COLOR = "rgb(0, 0, 0)";
const REMOTE_INK_COLOR = "rgb(197, 28, 48)";

var strokeSize = 20;
var drawIntervalId;
var resizeIntervalId;

var brush;

var DEFAULT_BRUSH_SIZE = 30;
var MAX_BRUSH_SIZE = 50;
var MIN_BRUSH_SIZE = 5;
var INK_AMOUNT = 20;
var SPLASH_RANGE = 10;
var SPLASH_INK_SIZE = 5;

$(document).ready(function () {
	init();
});

function init() {
	// Background
	$.backstretch("bg.jpg", {
		speed : 500
	},
		connect);
	
}

function connect() {
	// sockets
	socket = io.connect('http://');
	
	socket.on('error', function (reason) {
		console.error('Unable to connect Socket.IO', reason);
	});
	
	socket.on('connect', function () {
		connected = true;
		clearTimeout(timeout);
		
		initUI();
	});
	
	socket.on('disconnect', function () {
		connected = false;
		console.log('disconnected');
		//content.html("<b>Disconnected! Trying to automatically to reconnect in " +  RETRY_INTERVAL/1000 + " seconds.</b>");
		retryConnectOnFailure(RETRY_INTERVAL);
	});
	
	socket.on('me', function (data) {
    user = data;
    if(data.draw)
    {
      redraw_with_interval(lcontext, user.draw);
    }
    
	});
	
	socket.on('join', function (data) {
		console.log("user connected :", data.id);
		users[data.id] = data;
		$('#cursor').clone().appendTo('#cursor_container').attr('id', "cursor-" + data.id).append("<b>user" + data.id + "</b>");
	});
	
	socket.on('users', function (data) {
		
		for (var i = 0; i < data.length; i++) {
			var current = data[i];
			
			$('#cursor').clone().appendTo('#cursor_container').attr('id', "cursor-" + current.id).append("<b>user" + current.id + "</b>");
			
			if (current.cursor)
				setCursor(current.id, current.cursor.x, current.cursor.y);
			//create cursor here
			users[current.id] = current;
		}
		
	});
	
	socket.on('leave', function (data) {
		
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
    
    console.log("receive-draw", data);
    
		rdrawing.push(data);
		redraw(context, rdrawing, REMOTE_INK_COLOR);
	});
	
	socket.on('user-clear', function () {
		rdrawing = [];
		context.clear();
	});
	
	
}

function onDocumentMouseMove(e) {
	
	// update the mouse position
	mouse.set(e.clientX, e.clientY);
	
	// send the cursor coordinate
	socket.emit('mousemove', {
		x : e.pageX / $(window).width(),
		y : e.pageY / $(window).height()
	});
	
}

function onDocumentMouseDown(e) {
	brush.reset();
	isMouseDown = true;
}

function onDocumentMouseUp(e) {
	user.draw.push({
		path : drawbuffer,
		size : strokeSize
	});
	
	socket.emit('draw', {
		path : drawbuffer,
		size : strokeSize,
    user_id : user.user_id
	});
	
	drawbuffer = [];
	isMouseDown = false;
}

// main loop for drawing
function loop() {
	brush.position(mouse);
	if (isMouseDown) {
		// draw the brush on local canvas first
		brush.draw(lcontext, mouse, INK_COLOR, strokeSize);
		drawbuffer.push({
			x : mouse.x,
			y : mouse.y
		});
	}
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

function doneResizing() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	localcanvas.width = window.innerWidth;
	localcanvas.height = window.innerHeight;
	
	redraw_all();
}

function redrawAllWithInterval() {
	redraw_with_interval(lcontext, user.draw, INK_COLOR);
	redraw_with_interval(context, rdrawing, REMOTE_INK_COLOR);
}

function redraw_all() {
	redraw(lcontext, user.draw, INK_COLOR);
	redraw(context, rdrawing, REMOTE_INK_COLOR);
}

function redraw(ctx, data, color) {
	// redraw stuff
	
	console.log("recover start strokeSize="+strokeSize+ "color="+color);
	var i = 0;
	var j = 0;
	
	var brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
	
	for (i = 0; i < data.length; i++) {
		brush.position(data[i].path[j]);
		brush.reset();
		for (j = 0; j < data[i].path.length; j++) {
			brush.position(data[i].path[j]);
			brush.draw(ctx, data[i].path[j], color, data[i].size);
		}
		j = 0;
	}
}

function redraw_with_interval(ctx, data, color) {
	// redraw stuff
	clearInterval(drawIntervalId);
	
	var i = 0;
	var j = 0;
	
	var brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
	drawIntervalId = setInterval(function () {
			
			if (i < data.length) {
				
				// reset brush
				if (j == 0) {
					
					console.log("position with (line, position)=(" + i + "," + j + ")");
					brush.position(data[i].path[j]);
					brush.reset();
					
				}
				brush.position(data[i].path[j]);
				brush.draw(ctx, data[i].path[j], color, data[i].size);
				
				if (j < data[i].path.length - 1) {
					j++
				} else if (++i < data.length) {
					j = 0;
				} else {
					clearInterval(drawIntervalId);
					return;
				}
				
			} else {
				clearInterval(drawIntervalId);
				return;
			}
			
		}, 1000 / 60);
	
}

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

// UI


function initUI() {
    
	if (Modernizr.canvas) {
		
		canvas = document.getElementById('canvas');
		
		localcanvas = document.getElementById('local-canvas');
		
		// get the context
		context = canvas.getContext('2d');
		context.clear = function () {
			this.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		lcontext = localcanvas.getContext('2d');
		lcontext.clear = function () {
			this.clearRect(0, 0, localcanvas.width, localcanvas.height);
		}
		
    
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);
		
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    
    localcanvas.width = window.innerWidth;
    localcanvas.height = window.innerHeight;
  
  
		document.onmousedown = onDocumentMouseDown;
		document.onmouseup = onDocumentMouseUp;
		document.onmousemove = onDocumentMouseMove;
		
		brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
		
		// start draw loop
		setInterval(loop, 1000 / 60);
	}
	

	// Tools
	$("#nav #dots ul li a").click(function (e) {
		
		color = $(e.target).css('background-color');
		
		$('#nav #dots ul li a').each(function (index) {
			$(this).removeClass("cur");
		});
		$(e.target).addClass("cur");
	});
	
	// Info
	$('#info').click(function (e) {
		if (!e.target.href) {
			$('#info').toggleClass("hide");
		}
		return false;
	});
	
	// clear button
	$("#nav .clear").click(function () {
		
		socket.emit('clear');
		user.draw = [];
		
		if (lcontext) {
			lcontext.clear();
		}
		
		clearInterval(drawIntervalId);
		
	});
	
}
