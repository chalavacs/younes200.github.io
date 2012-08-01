 
  /**
		 * Brush
		 */
	(function (window) {

		function Brush(size, inkAmount, splashRange, splashInkSize) {
			
			this.size = size;
			this.inkAmount = inkAmount;
			this.splashRange = splashRange;
			this.splashInkSize = splashInkSize;
			this.strokeSize = 0;
			this.reset();
			
			this._latest = null;
			this._latestStrokeLength = 0;
		}
		
		Brush.prototype = extend({}, Point.prototype, {
				_hairs : null,
				
				// Override Point set method
				set : function (x, y) {
					if (!this._latest) {
						this._latest = new Point(x, y);
					} else {
						this._latest.set(this);
					}
					Point.prototype.set.call(this, x, y);
				},
			
				reset : function () {
         
					var hairs = this._hairs = [];
					var inkAmount = this.inkAmount;
					var hairNum = this.size * 2;
					
					var range = this.size / 2;
					var rx,
					ry,
					c0,
					x0,
					y0;
					var c = random(Math.PI * 2),
					cv,
					sv,
					x,
					y;
					
					for (var i = 0, r; i < hairNum; i++) {
						rx = random(range);
						ry = rx / 2;
						c0 = random(Math.PI * 2);
						x0 = rx * Math.sin(c0);
						y0 = ry * Math.cos(c0);
						cv = Math.cos(c);
						sv = Math.sin(c);
						x = this.x + x0 * cv - y0 * sv;
						y = this.y + x0 * sv + y0 * cv;
						hairs[i] = new Hair(x, y, 10, inkAmount);
					}
          
         
				},
				
				position : function (p) {
					this.set(p);
					
					var stroke = this.subtract(this._latest);
					var hairs = this._hairs;
					for (var i = 0, len = hairs.length; i < len; i++) {
						hairs[i].position(stroke);
					}
					
					this._latestStrokeLength = stroke.length();
				},
				
				draw : function (ctx, p , color, strokeSize) {
         
        
         this.strokeSize = strokeSize;
         
					var hairs = this._hairs;
					for (var i = 0, len = hairs.length; i < len; i++) {
						hairs[i].draw(ctx, color);
					}
					
					if (this._latestStrokeLength > 30) {
						this.splash(context, color, this.splashRange, this.splashInkSize);
					}
          
					
				},
				
				splash : function (ctx, color, range, maxSize) {
					var num = random(12, 0);
					var c,
					r,
					x,
					y;
					
					ctx.save();
					for (var i = 0; i < num; i++) {
						r = random(range, 1);
						c = random(Math.PI * 2);
						x = this.x + r * Math.sin(c);
						y = this.y + r * Math.cos(c);
						dot(ctx, {
							x : x,
							y : y
						}, color, random(maxSize, 0));
					}
					ctx.restore();
				}
			});
		
		/**
		 * Hair
		 */
		function Hair(x, y, lineWidth, inkAmount) {
			Point.call(this, x, y);
			this.lineWidth = lineWidth;
			this.inkAmount = inkAmount;
			
			this._currentLineWidth = this.lineWidth;
			this._latest = this.clone();
		}
		
		Hair.prototype = extend({}, Point.prototype, {
				// Override Point offset method
				offset : function (p) {
					this._latest.set(this);
					Point.prototype.offset.call(this, p);
				},
				
				position : function (stroke) {
					this._latest.set(this);
					this.offset(stroke);
					
					var per = clamp(this.inkAmount / stroke.length(), 1, 0);
					this._currentLineWidth = this.lineWidth * per;
				},
				
				draw : function (ctx, color) {
					ctx.save();
					line(ctx, this._latest, this, color, this._currentLineWidth);
					ctx.restore();
				}
			});
		
		window.Brush = Brush;
		
	})(window);
	
	// Draw helpers
	
	function line(ctx, p1, p2, color, lineWidth) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.stroke();
	}
	
function dot(ctx, p, color, size) {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2, false);
		ctx.fill();
	}

  // Helpers

function clamp(n, max, min) {
    if (typeof min !== 'number') min = 0;
    return n > max ? max : n < min ? min : n;
}

function random(max, min) {
    if (typeof max !== 'number') {
        return Math.random();
    } else if (typeof min !== 'number') {
        min = 0;
    }
    return Math.random() * (max - min) + min;
}
	