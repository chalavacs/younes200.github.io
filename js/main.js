var docElement = document.documentElement, browserUA = navigator.userAgent.toLowerCase();
docElement.className = docElement.className.replace(/(^|\s)preload(\s|$)/, "$1$2");
-1 < browserUA.search("windows phone os 7") && (docElement.className += " winphone");
-1 < browserUA.search("android 2.1") && (docElement.className += " winphone");
-1 < browserUA.search("symbian/3; series60") && (docElement.className += " symbian3");
if (-1 < browserUA.search("series60/3.0") || -1 < browserUA.search("series60/3.1") || -1 < browserUA.search("series60/3.2"))
	docElement.className += " symbian3 s60";
  
window.selectnav = function () {
	return function (a) {
		var c,
		f = function (a) {
			var b;
			if (!a)
				a = window.event;
			if (a.target)
				b = a.target;
			else if (a.srcElement)
				b = a.srcElement;
			if (b.nodeType == 3)
				b = b.parentNode;
			if (b.value)
				window.location.href = b.value
		};
		c = document.getElementById(a);
		var a = 0,
		g = c.parentNode,
		h = c.parentNode.innerHTML;
		a++;
		var i = c.children.length,
		d = '<option value="" active="active">Navigation</option>',
		e;
		for (e = 0; e < i; e++)
			var b = c.children[e].children[0], j = '<option value="' + b.href + '">', b = (b.innerText || b.textContent).toLowerCase(),
			b = b.charAt(0).toUpperCase() + b.slice(1), d = d + (j + b + "</option>");
		a === 1 && (d = '<select id="selectnav">' + d + "</select>");
		a--;
		g.innerHTML = h + d;
		a = document.getElementById("selectnav");
		a.remove(a.length - 1);
		a.addEventListener ? a.addEventListener("change", f, false) : a.attachEvent("onchange", f, false)
	}
}
();



window.matchMedia = window.matchMedia || (function (e, f) {
		var c,
		a = e.documentElement,
		b = a.firstElementChild || a.firstChild,
		d = e.createElement("body"),
		g = e.createElement("div");
		g.id = "mq-test-1";
		g.style.cssText = "position:absolute;top:-100em";
		d.appendChild(g);
		return function (h) {
			g.innerHTML = '&shy;<style media="' + h + '"> #mq-test-1 { width: 42px; }</style>';
			a.insertBefore(d, b);
			c = g.offsetWidth == 42;
			a.removeChild(d);
			return {
				matches : c,
				media : h
			}
		}
	})(document);

	
$(document).ready(function() {
  
  //$.backstretch("/img/background.jpg");
  impress().init();
  IO.scaleFix();
  IO.hideUrlBar();
  selectnav("nav");
  //initCanvas();
  
  i18n.init({ fallbackLng: 'en' }, function(t) {
	  // translate nav
	  $("body").i18n();
  });

  $(window).hashchange( function(){
    var hash = location.hash;
    // Iterate over all nav links, setting the "selected" class as-appropriate.
    $('#nav li').each(function(){
      var that = $(this);
	  
	  if(that.find("a:first").attr( 'href' ) === hash ){
		that.addClass( 'active' );
	  }else{
		that.removeClass( 'active' );
	  }
	  
    });
  })
  $(window).hashchange();
  
});



(function (a) {
	window.IO = window.IO || {};
	IO.viewportmeta = a.querySelector && a.querySelector('meta[name="viewport"]');
	IO.ua = navigator.userAgent;
	IO.scaleFix = function () {
		if (IO.viewportmeta && /iPhone|iPad|iPod/.test(IO.ua) && !/Opera Mini/.test(IO.ua)) {
			IO.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
			a.addEventListener("gesturestart", IO.gestureStart, false)
		}
	};
	IO.gestureStart = function () {
		IO.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.9"
	};
	IO.hideUrlBar =
	function () {
		/iPhone/.test(IO.ua) && (!pageYOffset && !location.hash) && setTimeout(function () {
			window.scrollTo(0, 1)
		}, 1E3)
	}
})(document);


var user = {
	draw : []
}

var drawbuffer = [],
	isMouseDown = false,
	mouse = new Point(),
	canvas, context,
	strokeSize = 20,
	drawIntervalId,
	resizeIntervalId,
	brush;

const INK_COLOR = "#c30";
const DEFAULT_BRUSH_SIZE = 30;
const MAX_BRUSH_SIZE = 50;
const MIN_BRUSH_SIZE = 5;
const INK_AMOUNT = 20;
const SPLASH_RANGE = 10;
const SPLASH_INK_SIZE = 5;




function onDocumentMouseMove(e) {
	
	// update the mouse position
	mouse.set(e.clientX, e.clientY);	
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
	
	drawbuffer = [];
	isMouseDown = false;
}

// clear button
function onMousedblclick() {	
	user.draw = [];
	if (context) {
		context.clear();
	}
	clearInterval(drawIntervalId);
}

// main loop for drawing
function loop() {
	brush.position(mouse);
	if (isMouseDown) {
		// draw the brush on local canvas first
		brush.draw(context, mouse, INK_COLOR, strokeSize);
		drawbuffer.push({
			x : mouse.x,
			y : mouse.y
		});
	}
}


function resizeCanvas() {
	
	clearTimeout(resizeIntervalId);
	resizeIntervalId = setTimeout(doneResizing, 500);
}

function doneResizing() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}


function drawline(ctx, data, color) {
	// redraw stuff
	var i = 0;
	var brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
	brush.position(data.path[0]);
	brush.reset();
	for (i = 0; i < data.path.length; i++) {
		brush.position(data.path[i]);
		brush.draw(ctx, data.path[i], color, data.size);
	}
}

function redraw(ctx, data, color) {
	// redraw stuff
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


function initCanvas() {
	
	if (Modernizr.canvas) {
		
		canvas = document.getElementById('canvas');		
		// get the context
		context = canvas.getContext('2d');
		context.clear = function () {
			this.clearRect(0, 0, canvas.width, canvas.height);
		}
		
		
		
		// resize the canvas to fill browser window dynamically
		window.addEventListener('resize', resizeCanvas, false);
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		document.onmousedown = onDocumentMouseDown;
		document.onmouseup = onDocumentMouseUp;
		document.onmousemove = onDocumentMouseMove;
		document.ondblclick = onMousedblclick;
		
		brush = new Brush(DEFAULT_BRUSH_SIZE, INK_AMOUNT, SPLASH_RANGE, SPLASH_INK_SIZE);
		
		// start draw loop
		setInterval(loop, 1000 / 60);
	}
	
	/* Tools
	$("#nav #dots ul li a").click(function (e) {
		
		color = $(e.target).css('background-color');
		
		$('#nav #dots ul li a').each(function (index) {
			$(this).removeClass("cur");
		});
		$(e.target).addClass("cur");
	});
	*/
	
}


