/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-fontface-shiv-mq-cssclasses-addtest-teststyles-testprop-testallprops-hasevent-domprefixes-css_mask
 */
;
window.Modernizr = function (a, b, c) {
	function A(a) {
		j.cssText = a
	}
	function B(a, b) {
		return A(prefixes.join(a + ";") + (b || ""))
	}
	function C(a, b) {
		return typeof a === b
	}
	function D(a, b) {
		return !!~("" + a).indexOf(b)
	}
	function E(a, b) {
		for (var d in a)
			if (j[a[d]] !== c)
				return b == "pfx" ? a[d] : !0;
		return !1
	}
	function F(a, b, d) {
		for (var e in a) {
			var f = b[a[e]];
			if (f !== c)
				return d === !1 ? a[e] : C(f, "function") ? f.bind(d || b) : f
		}
		return !1
	}
	function G(a, b, c) {
		var d = a.charAt(0).toUpperCase() + a.substr(1),
		e = (a + " " + n.join(d + " ") + d).split(" ");
		return C(b, "string") || C(b, "undefined") ? E(e, b) : (e = (a + " " + o.join(d + " ") + d).split(" "), F(e, b, c))
	}
	var d = "2.5.3",
	e = {},
	f = !0,
	g = b.documentElement,
	h = "modernizr",
	i = b.createElement(h),
	j = i.style,
	k,
	l = {}
	
	.toString,
	m = "Webkit Moz O ms",
	n = m.split(" "),
	o = m.toLowerCase().split(" "),
	p = {},
	q = {},
	r = {},
	s = [],
	t = s.slice,
	u,
	v = function (a, c, d, e) {
		var f,
		i,
		j,
		k = b.createElement("div"),
		l = b.body,
		m = l ? l : b.createElement("body");
		if (parseInt(d, 10))
			while (d--)
				j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), k.appendChild(j);
		return f = ["&#173;", "<style>", a, "</style>"].join(""),
		k.id = h,
		m.innerHTML += f,
		m.appendChild(k),
		l || (m.style.background = "", g.appendChild(m)),
		i = c(k, a),
		l ? k.parentNode.removeChild(k) : m.parentNode.removeChild(m),
		!!i
	},
	w = function (b) {
		var c = a.matchMedia || a.msMatchMedia;
		if (c)
			return c(b).matches;
		var d;
		return v("@media " + b + " { #" + h + " { position: absolute; } }", function (b) {
			d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute"
		}),
		d
	},
	x = function () {
		function d(d, e) {
			e = e || b.createElement(a[d] || "div"),
			d = "on" + d;
			var f = d in e;
			return f || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(d, ""), f = C(e[d], "function"), C(e[d], "undefined") || (e[d] = c), e.removeAttribute(d))),
			e = null,
			f
		}
		var a = {
			select : "input",
			change : "input",
			submit : "form",
			reset : "form",
			error : "img",
			load : "img",
			abort : "img"
		};
		return d
	}
	(),
	y = {}
	
	.hasOwnProperty,
	z;
	!C(y, "undefined") && !C(y.call, "undefined") ? z = function (a, b) {
		return y.call(a, b)
	}
	 : z = function (a, b) {
		return b in a && C(a.constructor.prototype[b], "undefined")
	},
	Function.prototype.bind || (Function.prototype.bind = function (b) {
		var c = this;
		if (typeof c != "function")
			throw new TypeError;
		var d = t.call(arguments, 1),
		e = function () {
			if (this instanceof e) {
				var a = function () {};
				a.prototype = c.prototype;
				var f = new a,
				g = c.apply(f, d.concat(t.call(arguments)));
				return Object(g) === g ? g : f
			}
			return c.apply(b, d.concat(t.call(arguments)))
		};
		return e
	});
	var H = function (a, c) {
		var d = a.join(""),
		f = c.length;
		v(d, function (a, c) {
			var d = b.styleSheets[b.styleSheets.length - 1],
			g = d ? d.cssRules && d.cssRules[0] ? d.cssRules[0].cssText : d.cssText || "" : "",
			h = a.childNodes,
			i = {};
			while (f--)
				i[h[f].id] = h[f];
			e.fontface = /src/i.test(g) && g.indexOf(c.split(" ")[0]) === 0
		}, f, c)
	}
	(['@font-face {font-family:"font";src:url("https://")}'], ["fontface"]);
	p.fontface = function () {
		return e.fontface
	};
	for (var I in p)
		z(p, I) && (u = I.toLowerCase(), e[u] = p[I](), s.push((e[u] ? "" : "no-") + u));
	return e.addTest = function (a, b) {
		if (typeof a == "object")
			for (var d in a)
				z(a, d) && e.addTest(d, a[d]);
		else {
			a = a.toLowerCase();
			if (e[a] !== c)
				return e;
			b = typeof b == "function" ? b() : b,
			g.className += " " + (b ? "" : "no-") + a,
			e[a] = b
		}
		return e
	},
	A(""),
	i = k = null,
	function (a, b) {
		function g(a, b) {
			var c = a.createElement("p"),
			d = a.getElementsByTagName("head")[0] || a.documentElement;
			return c.innerHTML = "x<style>" + b + "</style>",
			d.insertBefore(c.lastChild, d.firstChild)
		}
		function h() {
			var a = k.elements;
			return typeof a == "string" ? a.split(" ") : a
		}
		function i(a) {
			var b = {},
			c = a.createElement,
			e = a.createDocumentFragment,
			f = e();
			a.createElement = function (a) {
				var e = (b[a] || (b[a] = c(a))).cloneNode();
				return k.shivMethods && e.canHaveChildren && !d.test(a) ? f.appendChild(e) : e
			},
			a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + h().join().replace(/\w+/g, function (a) {
						return b[a] = c(a),
						f.createElement(a),
						'c("' + a + '")'
					}) + ");return n}")(k, f)
		}
		function j(a) {
			var b;
			return a.documentShived ? a : (k.shivCSS && !e && (b = !!g(a, "article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}audio{display:none}canvas,video{display:inline-block;*display:inline;*zoom:1}[hidden]{display:none}audio[controls]{display:inline-block;*display:inline;*zoom:1}mark{background:#FF0;color:#000}")), f || (b = !i(a)), b && (a.documentShived = b), a)
		}
		var c = a.html5 || {},
		d = /^<|^(?:button|form|map|select|textarea)$/i,
		e,
		f;
		(function () {
			var a = b.createElement("a");
			a.innerHTML = "<xyz></xyz>",
			e = "hidden" in a,
			f = a.childNodes.length == 1 || function () {
				try {
					b.createElement("a")
				} catch (a) {
					return !0
				}
				var c = b.createDocumentFragment();
				return typeof c.cloneNode == "undefined" || typeof c.createDocumentFragment == "undefined" || typeof c.createElement == "undefined"
			}
			()
		})();
		var k = {
			elements : c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
			shivCSS : c.shivCSS !== !1,
			shivMethods : c.shivMethods !== !1,
			type : "default",
			shivDocument : j
		};
		a.html5 = k,
		j(b)
	}
	(this, b),
	e._version = d,
	e._domPrefixes = o,
	e._cssomPrefixes = n,
	e.mq = w,
	e.hasEvent = x,
	e.testProp = function (a) {
		return E([a])
	},
	e.testAllProps = G,
	e.testStyles = v,
	g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + s.join(" ") : ""),
	e
}
(this, this.document), Modernizr.addTest("cssmask", Modernizr.testAllProps("mask"));
