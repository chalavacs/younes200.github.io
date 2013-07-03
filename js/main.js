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
  
  impress().init();
  IO.scaleFix();
  IO.hideUrlBar();
  selectnav("nav");
  
  i18n.init({ fallbackLng: 'en' }, function(t) {
	  // translate nav
	  $("body").i18n();
  });

  $(window).hashchange( function(){
    var hash = location.hash;
    
    console.log("hash:", hash);
    // Iterate over all nav links, setting the "selected" class as-appropriate.
    $('#nav li').each(function(){
      var that = $(this);
      that[ that.attr( 'href' ) === hash ? 'addClass' : 'removeClass' ]( 'active' );
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

