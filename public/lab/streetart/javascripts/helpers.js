(function(global) {
    
// Data type check

function isObject(value, ignoreArray) {
    return typeof value === 'object' && value !== null;
}

function isNumber(value) {
    return typeof value === 'number';
}

function isString(value) {
    return typeof value === 'string';
}

function isFunction(value) {
    return typeof value === 'function';
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function isNull(value) {
    return value === null;
}

function isUndefined(value) {
    return typeof value === 'undefined';
}

global.isObject = isObject;
global.isNumber = isNumber;
global.isString = isString;
global.isFunction = isFunction;
global.isArray = isArray;
global.isNull = isNull;
global.isUndefined = isUndefined;


/**
 * extend
 */
function extend() {
    var target = arguments[0] || {}, o, p;

    for (var i = 1, len = arguments.length; i < len; i++) {
        o = arguments[i];

        if (!isObject(o)) continue;

        for (p in o) {
            target[p] = o[p];
        }
    }

    return target;
}

global.extend = extend;


// Random

function random(max, min) {
    if (isNaN(Number(max))) return Math.random();
    if (isNaN(Number(min))) min = 0;
    return Math.random() * (max - min) + min;
}

function randInt(max, min) {
    if (isNaN(Number(max))) return NaN;
    if (isNaN(Number(min))) min = 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
    
global.random = random;
global.random = randInt;

    
/**
 * Debug
 */
(function(global) {
    
    var limit = 0;
    var count = 0;
    
    function log() {
        if (limit > 0) {
            if (limit === count) return;
            count++;
        }
        window.console.log.apply(window.console, arguments);
    }
    
    log.limit = function(limitCount) {
        limit = limitCount < 0 ? 0 : limitCount;
    };
    
    global.log = log;
    
})(window);


/**
 * Point
 */
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Point.create = function(o, y) {
    if (isArray(o)) return new Point(o[0], o[1]);
    if (isObject(o)) return new Point(o.x, o.y);
    return new Point(o, y);
};

Point.add = function(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
};

Point.subtract = function(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
};

Point.scale = function(p, scaleX, scaleY) {
    if (isObject(scaleX)) {
        scaleY = scaleX.y;
        scaleX = scaleX.x;
    } else if (!isNumber(scaleY)) {
        scaleY = scaleX;
    }
    return new Point(p.x * scaleX, p.y * scaleY);
};

Point.equals = function(p1, p2) {
    return p1.x == p2.x && p1.y == p2.y;
};

Point.angle = function(p) {
    return Math.atan2(p.y, p.x);
};

Point.distance = function(p1, p2) {
    var a = p1.x - p2.x;
    var b = p1.y - p2.y;
    return Math.sqrt(a * a + b * b);
};

Point.dot = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
};

Point.cross = function(p1, p2) {
    return p1.x * p2.y - p1.y * p2.x;
};

Point.interpolate = function(p1, p2, f) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return new Point(p1.x + dx * f, p1.y + dy * f);
};

// Test
Point.polar = function(length, radian) {
    return new Point(length * Math.sin(radian), length * Math.cos(radian));
};

Point.prototype = {    
    add: function(p) {
        return Point.add(this, p);
    },
    
    subtract: function(p) {
        return Point.subtract(this, p);
    },
    
    scale: function(scaleX, scaleY) {
        return Point.scale(this, scaleX, scaleY);
    },
    
    equals: function(p) {
        return Point.equals(this, p);
    },
    
    angle: function() {
        return Point.angle(this);
    },
    
    distance: function(p) {
        return Point.distance(this, p);
    },
    
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    
    set: function(x, y) {
        if (isObject(x)) {
            y = x.y;
            x = x.x;
        }
        
        this.x = x || 0;
        this.y = y || 0;
        
        return this;
    },
    
    offset: function(x, y) {
        if (isObject(x)) {
            y = x.y;
            x = x.x;
        }
        
        this.x += x || 0;
        this.y += y || 0;
        
        return this;
    },
    
    normalize: function(thickness) {
        if (isNull(thickness) || isUndefined(thickness)) {
            thickness = 1;
        }
        
        var length = this.length();
        
        if (length > 0) {
            this.x = this.x / length * thickness;
            this.y = this.y / length * thickness;
        }
        
        return this;
    },
    
    negate: function() {
        this.x *= -1;
        this.y *= -1;
        
        return this;
    },
    
    perp: function() {
        this.x = - y;
        this.y = x;
        
        return this;
    },
    
    clone: function() {
        return Point.create(this);
    },

    toArray: function() {
        return [this.x, this.y];
    },
    
    toString: function() {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};

global.Point = Point;



/**
 * Timer
 */
function Timer(delay, repeatCount) {
    this.delay = delay || 0;
    this.repeatCount = repeatCount || 0;
}

Timer.prototype = {
    onTimer: null,
    onTimerComplete: null,
    _running: false,
    _currentCount: 0,
    _timerId: null,
    
    currentCount: function() {
        return this._currentCount;
    },
    
    running: function() {
        return this._running;
    },
    
    start: function() {
        if (this._running && !this.delay) return;
        
        var self = this;
        var timer = function() {
            if (self.onTimer) self.onTimer.call(self);

            if (self.repeatCount) {
                self._currentCount++;
                if (self._currentCount === self.repeatCount) {
                    self.stop();
                    if (self.onTimerComplete) self.onTimerComplete.call(self);
                    return;
                }
            }

            self._timerId = setTimeout(timer, self.delay);
        };
        
        this._timerId = setTimeout(timer, self.delay);
        this._running = true;
    },
    
    stop: function() {
        if (!this._running) return;
        
        clearTimeout(this._timerId);

        this._currentCount = 0;
        this._running = false;
    },
    
    reset: function() {
        this.stop();
        this.start();
    }
};

global.Timer = Timer;


(function(global) {
    /**
     * Random numbers generator
     * 
     * @see http://baagoe.com/en/RandomMusings/javascript/
     */
    
    function Xorshift() {
        var self = this;
        var seeds = (arguments.length) ? Array.prototype.slice.call(arguments) : [new Date().getTime()];
               
        var x = 123456789;
        var y = 362436069;
        var z = 521288629;
        var w = 88675123;
        var v = 886756453;

        self.uint32 = function() {
            var t = (x ^ (x >>> 7)) >>> 0;
            x = y;
            y = z;
            z = w;
            w = v;
            v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
            return ((y + y + 1) * v) >>> 0;
        };

        self.random = function() {
            return self.uint32() * 2.3283064365386963e-10;
        };

        self.fract53 = function() {
            return self.random() + (self.uint32() & 0x1fffff) * 1.1102230246251565e-16;
        };

        for (var i = 0, len = seeds.length, seed; i < len; i++) {
            seed = seeds[i];
            x ^= mash(seed) * 0x100000000;
            y ^= mash(seed) * 0x100000000;
            z ^= mash(seed) * 0x100000000;
            v ^= mash(seed) * 0x100000000;
            w ^= mash(seed) * 0x100000000;
        }
    }
    
    // Helper
    
    function mash(data) {
        data = data.toString();
        var n = 0xefc8249d;
        for (var i = 0, len = data.length; i < len; i++) {
            n += data.charCodeAt(i);
            var h = 0.02519603282416938 * n;
            n = h >>> 0;
            h -= n;
            h *= n;
            n = h >>> 0;
            h -= n;
            n += h * 0x100000000;
        }
        return (n >>> 0) * 2.3283064365386963e-10;
    }
    
    global.Xorshift = Xorshift;

})(global);


(function(global) {
    /**
     * Color
     */
    
    /**
     * @see http://www.w3.org/TR/css3-color/
     */
    var KEYWORDS = {
        aliceblue: 'rgb(240, 248, 255)',
        antiquewhite: 'rgb(250, 235, 215)',
        aqua: 'rgb(0, 255, 255)',
        aquamarine: 'rgb(127, 255, 212)',
        azure: 'rgb(240, 255, 255)',
        beige: 'rgb(245, 245, 220)',
        bisque: 'rgb(255, 228, 196)',
        black: 'rgb(0, 0, 0)',
        blanchedalmond: 'rgb(255, 235, 205)',
        blue: 'rgb(0, 0, 255)',
        blueviolet: 'rgb(138, 43, 226)',
        brown: 'rgb(165, 42, 42)',
        burlywood: 'rgb(222, 184, 135)',
        cadetblue: 'rgb(95, 158, 160)',
        chartreuse: 'rgb(127, 255, 0)',
        chocolate: 'rgb(210, 105, 30)',
        coral: 'rgb(255, 127, 80)',
        cornflowerblue: 'rgb(100, 149, 237)',
        cornsilk: 'rgb(255, 248, 220)',
        crimson: 'rgb(220, 20, 60)',
        cyan: 'rgb(0, 255, 255)',
        darkblue: 'rgb(0, 0, 139)',
        darkcyan: 'rgb(0, 139, 139)',
        darkgoldenrod: 'rgb(184, 134, 11)',
        darkgray: 'rgb(169, 169, 169)',
        darkgreen: 'rgb(0, 100, 0)',
        darkgrey: 'rgb(169, 169, 169)',
        darkkhaki: 'rgb(189, 183, 107)',
        darkmagenta: 'rgb(139, 0, 139)',
        darkolivegreen: 'rgb(85, 107, 47)',
        darkorange: 'rgb(255, 140, 0)',
        darkorchid: 'rgb(153, 50, 204)',
        darkred: 'rgb(139, 0, 0)',
        darksalmon: 'rgb(233, 150, 122)',
        darkseagreen: 'rgb(143, 188, 143)',
        darkslateblue: 'rgb(72, 61, 139)',
        darkslategray: 'rgb(47, 79, 79)',
        darkslategrey: 'rgb(47, 79, 79)',
        darkturquoise: 'rgb(0, 206, 209)',
        darkviolet: 'rgb(148, 0, 211)',
        deeppink: 'rgb(255, 20, 147)',
        deepskyblue: 'rgb(0, 191, 255)',
        dimgray: 'rgb(105, 105, 105)',
        dimgrey: 'rgb(105, 105, 105)',
        dodgerblue: 'rgb(30, 144, 255)',
        firebrick: 'rgb(178, 34, 34)',
        floralwhite: 'rgb(255, 250, 240)',
        forestgreen: 'rgb(34, 139, 34)',
        fuchsia: 'rgb(255, 0, 255)',
        gainsboro: 'rgb(220, 220, 220)',
        ghostwhite: 'rgb(248, 248, 255)',
        gold: 'rgb(255, 215, 0)',
        goldenrod: 'rgb(218, 165, 32)',
        gray: 'rgb(128, 128, 128)',
        green: 'rgb(0, 128, 0)',
        greenyellow: 'rgb(173, 255, 47)',
        grey: 'rgb(128, 128, 128)',
        honeydew: 'rgb(240, 255, 240)',
        hotpink: 'rgb(255, 105, 180)',
        indianred: 'rgb(205, 92, 92)',
        indigo: 'rgb(75, 0, 130)',
        ivory: 'rgb(255, 255, 240)',
        khaki: 'rgb(240, 230, 140)',
        lavender: 'rgb(230, 230, 250)',
        lavenderblush: 'rgb(255, 240, 245)',
        lawngreen: 'rgb(124, 252, 0)',
        lemonchiffon: 'rgb(255, 250, 205)',
        lightblue: 'rgb(173, 216, 230)',
        lightcoral: 'rgb(240, 128, 128)',
        lightcyan: 'rgb(224, 255, 255)',
        lightgoldenrodyellow: 'rgb(250, 250, 210)',
        lightgray: 'rgb(211, 211, 211)',
        lightgreen: 'rgb(144, 238, 144)',
        lightgrey: 'rgb(211, 211, 211)',
        lightpink: 'rgb(255, 182, 193)',
        lightsalmon: 'rgb(255, 160, 122)',
        lightseagreen: 'rgb(32, 178, 170)',
        lightskyblue: 'rgb(135, 206, 250)',
        lightslategray: 'rgb(119, 136, 153)',
        lightslategrey: 'rgb(119, 136, 153)',
        lightsteelblue: 'rgb(176, 196, 222)',
        lightyellow: 'rgb(255, 255, 224)',
        lime: 'rgb(0, 255, 0)',
        limegreen: 'rgb(50, 205, 50)',
        linen: 'rgb(250, 240, 230)',
        magenta: 'rgb(255, 0, 255)',
        maroon: 'rgb(128, 0, 0)',
        mediumaquamarine: 'rgb(102, 205, 170)',
        mediumblue: 'rgb(0, 0, 205)',
        mediumorchid: 'rgb(186, 85, 211)',
        mediumpurple: 'rgb(147, 112, 219)',
        mediumseagreen: 'rgb(60, 179, 113)',
        mediumslateblue: 'rgb(123, 104, 238)',
        mediumspringgreen: 'rgb(0, 250, 154)',
        mediumturquoise: 'rgb(72, 209, 204)',
        mediumvioletred: 'rgb(199, 21, 133)',
        midnightblue: 'rgb(25, 25, 112)',
        mintcream: 'rgb(245, 255, 250)',
        mistyrose: 'rgb(255, 228, 225)',
        moccasin: 'rgb(255, 228, 181)',
        navajowhite: 'rgb(255, 222, 173)',
        navy: 'rgb(0, 0, 128)',
        oldlace: 'rgb(253, 245, 230)',
        olive: 'rgb(128, 128, 0)',
        olivedrab: 'rgb(107, 142, 35)',
        orange: 'rgb(255, 165, 0)',
        orangered: 'rgb(255, 69, 0)',
        orchid: 'rgb(218, 112, 214)',
        palegoldenrod: 'rgb(238, 232, 170)',
        palegreen: 'rgb(152, 251, 152)',
        paleturquoise: 'rgb(175, 238, 238)',
        palevioletred: 'rgb(219, 112, 147)',
        papayawhip: 'rgb(255, 239, 213)',
        peachpuff: 'rgb(255, 218, 185)',
        peru: 'rgb(205, 133, 63)',
        pink: 'rgb(255, 192, 203)',
        plum: 'rgb(221, 160, 221)',
        powderblue: 'rgb(176, 224, 230)',
        purple: 'rgb(128, 0, 128)',
        red: 'rgb(255, 0, 0)',
        rosybrown: 'rgb(188, 143, 143)',
        royalblue: 'rgb(65, 105, 225)',
        saddlebrown: 'rgb(139, 69, 19)',
        salmon: 'rgb(250, 128, 114)',
        sandybrown: 'rgb(244, 164, 96)',
        seagreen: 'rgb(46, 139, 87)',
        seashell: 'rgb(255, 245, 238)',
        sienna: 'rgb(160, 82, 45)',
        silver: 'rgb(192, 192, 192)',
        skyblue: 'rgb(135, 206, 235)',
        slateblue: 'rgb(106, 90, 205)',
        slategray: 'rgb(112, 128, 144)',
        slategrey: 'rgb(112, 128, 144)',
        snow: 'rgb(255, 250, 250)',
        springgreen: 'rgb(0, 255, 127)',
        steelblue: 'rgb(70, 130, 180)',
        tan: 'rgb(210, 180, 140)',
        teal: 'rgb(0, 128, 128)',
        thistle: 'rgb(216, 191, 216)',
        tomato: 'rgb(255, 99, 71)',
        turquoise: 'rgb(64, 224, 208)',
        violet: 'rgb(238, 130, 238)',
        wheat: 'rgb(245, 222, 179)',
        white: 'rgb(255, 255, 255)',
        whitesmoke: 'rgb(245, 245, 245)',
        yellow: 'rgb(255, 255, 0)',
        yellowgreen: 'rgb(154, 205, 50)'
    };

    var RE_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
    var RE_RGBA = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)$/;
    var RE_HSL = /^hsl\(\s*([\d\.]+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*\)$/;
    var RE_HSLA = /^hsla\(\s*([\d\.]+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)\s*\)$/;
    var RE_HEX = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/; // 6 digit
    
    
    // Global object
    var Color = {
        create: function(str) {
            str = str.replace(/^\s*#|\s*$/g, '');
            str = str.toLowerCase();
            if (KEYWORDS[str]) str = KEYWORDS[str];

            var match;

            // RGB(A)
            if ((match = str.match(RE_RGB) || str.match(RE_RGBA))) {
                return new Color.RGBA(
                    parseInt(match[1], 10),
                    parseInt(match[2], 10),
                    parseInt(match[3], 10),
                    parseFloat(match.length === 4 ? 1 : match[4])
                );
            }

            // HSL(A)
            if ((match = str.match(RE_HSL) || str.match(RE_HSLA))) {
                return new Color.HSLA(
                    parseFloat(match[1]),
                    parseFloat(match[2]),
                    parseFloat(match[3]),
                    parseFloat(match.length === 4 ? 1 : match[4])
                );
            }

            // Hex
            if (str.length === 3) {
                // Hex 3 digit -> 6 digit
                str = str.replace(/(.)/g, '$1$1');
            }
            if ((match = str.match(RE_HEX))) {
                return new Color.RGBA(
                    parseInt(match[1], 16),
                    parseInt(match[2], 16),
                    parseInt(match[3], 16),
                    1
                );
            }

            return null;
        },
        
        luminance: function(color) {
            if (color instanceof Color.HSLA) color = color.toRGBA();
            return 0.298912 * color.r + 0.586611 * color.g + 0.114478 * color.b;
        },

        greyscale: function(color) {
            var lum = Color.luminance(color);
            return new Color.RGBA(lum, lum, lum, this.a);
        },

        nagate: function(color) {
            if (color instanceof Color.HSLA) color = color.toRGBA();
            return new Color.RGBA(255 - color.r, 255 - color.g, 255 - color.b, color.a);
        },

        /**
         * @see http://sass-lang.com/docs/yardoc/Sass/Script/Functions.html#mix-instance_method
         */
        mix: function(color1, color2, weight) {
            if (color1 instanceof Color.HSLA) color1 = color1.toRGBA();
            if (color2 instanceof Color.HSLA) color2 = color2.toRGBA();
            if (isNull(weight) || isUndefined(weight)) weight = 0.5;

            var w0 = 1 - weight;
            var w = w0 * 2 - 1;
            var a = color1.a - color2.a;
            var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
            var w2 = 1 - w1;

            return new Color.RGBA(
                Math.round(color1.r * w1 + color2.r * w2),
                Math.round(color1.g * w1 + color2.g * w2),
                Math.round(color1.b * w1 + color2.b * w2),
                Math.round(color1.a * w0 + color2.a * weight)
            );
        }
    };
    
    /**
     * Color.RGBA
     */
    Color.RGBA = function(r, g, b, a) {
        if (isArray(r)) {
            g = r[1];
            b = r[2];
            a = r[3];
            r = r[0];
        } else if (isObject(r)) {
            g = r.g;
            b = r.b;
            a = r.a;
            r = r.r;
        }
        
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = !isNumber(a) ? 1 : a;
    };
    
    Color.RGBA.prototype = {        
        toHSLA: function() {
            var hsl = rgbToHsl(Math.round(this.r), Math.round(this.g), Math.round(this.b));
            return new Hsla(hsl[0], hsl[1], hsl[2], this.a);
        },
        
        toArray: function() {
            return [Math.round(this.r), Math.round(this.g), Math.round(this.b), this.a];
        },
        
        clone: function() {
            return new Color.RGBA(this);
        },
        
        toString: function() {
            return 'rgba(' + Math.round(this.r) + ', ' + Math.round(this.g) + ', ' + Math.round(this.b) + ', ' + this.a + ')';
        }
    };
    
    
    /**
     * Color.HSLA
     */
    Color.HSLA = function(h, s, l, a) {
        if (isArray(h)) {
            s = h[1];
            l = h[2];
            a = h[3];
            h = h[0];
        } else if (isObject(h)) {
            s = h.s;
            l = h.l;
            a = h.a;
            h = h.h;
        }
        
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = !isNumber(a) ? 1 : a;
    };
    
    Color.HSLA.prototype = {
        toRGBA: function() {
            var rgb = hslToRgb(this.h, this.s, this.l);
            return new Rgba(rgb[0], rgb[1], rgb[2], this.a);
        },
        
        toArray: function() {
            return [this.h, this.s, this.l, this.a];
        },
        
        clone: function() {
            return new Color.HSLA(this);
        },
        
        toString: function() {
            return 'hsla(' + this.h + ', ' + this.s + '%, ' + this.l + '%, ' + this.a + ')';
        }
    };
    
    
    // Helpers
    
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            var d = max - min;
            switch (max) {
                case r: h = ((g - b) / d * 60 + 360) % 360; break;
                case g: h = (b - r) / d * 60 + 120; break;
                case b: h = (r - g) / d * 60 + 240; break;
            }
            s = l <= 0.5 ? d / (max + min) : d / (2 - max  - min);
        }

        return [h, s * 100, l * 100];
    }
    
    function hslToRgb(h, s, l) {
     s /= 100;
     l /= 100;

        var r, g, b;

        if(s === 0){
            r = g = b = l * 255;
        } else {
            var v2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var v1 = 2 * l - v2;
            r = Math.round(hueToRgb(v1, v2, h + 120) * 255);
            g = Math.round(hueToRgb(v1, v2, h) * 255);
            b = Math.round(hueToRgb(v1, v2, h - 120) * 255);
        }

        return [r, g, b];
    }

    function hueToRgb(v1, v2, vh) {
        vh /= 360;
        if (vh < 0) vh++;
        if (vh > 1) vh--;
        if (vh < 1 / 6) return v1 + (v2 - v1) * 6 * vh;
        if (vh < 1 / 2) return v2;
        if (vh < 2 / 3) return v1 + (v2 - v1) * (2 / 3 - vh) * 6;
        return v1;
    }
    
    global.Color = Color;
    
})(global);


// End libs block scope
})(window);
