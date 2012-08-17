(function(){function A(a,b,c){if(a===b)return a!==0||1/a==1/b;if(a==null||b==null)return a===b;a._chain&&(a=a._wrapped),b._chain&&(b=b._wrapped);if(a.isEqual&&w.isFunction(a.isEqual))return a.isEqual(b);if(b.isEqual&&w.isFunction(b.isEqual))return b.isEqual(a);var d=i.call(a);if(d!=i.call(b))return!1;switch(d){case"[object String]":return a==String(b);case"[object Number]":return a!=+a?b!=+b:a==0?1/a==1/b:a==+b;case"[object Date]":case"[object Boolean]":return+a==+b;case"[object RegExp]":return a.source==b.source&&a.global==b.global&&a.multiline==b.multiline&&a.ignoreCase==b.ignoreCase}if(typeof a!="object"||typeof b!="object")return!1;var e=c.length;while(e--)if(c[e]==a)return!0;c.push(a);var f=0,g=!0;if(d=="[object Array]"){f=a.length,g=f==b.length;if(g)while(f--)if(!(g=f in a==f in b&&A(a[f],b[f],c)))break}else{if("constructor"in a!="constructor"in b||a.constructor!=b.constructor)return!1;for(var h in a)if(w.has(a,h)){f++;if(!(g=w.has(b,h)&&A(a[h],b[h],c)))break}if(g){for(h in b)if(w.has(b,h)&&!(f--))break;g=!f}}return c.pop(),g}var a=this,b=a._,c={},d=Array.prototype,e=Object.prototype,f=Function.prototype,g=d.slice,h=d.unshift,i=e.toString,j=e.hasOwnProperty,k=d.forEach,l=d.map,m=d.reduce,n=d.reduceRight,o=d.filter,p=d.every,q=d.some,r=d.indexOf,s=d.lastIndexOf,t=Array.isArray,u=Object.keys,v=f.bind,w=function(a){return new E(a)};typeof exports!="undefined"?(typeof module!="undefined"&&module.exports&&(exports=module.exports=w),exports._=w):a._=w,w.VERSION="1.3.1";var x=w.each=w.forEach=function(a,b,d){if(a==null)return;if(k&&a.forEach===k)a.forEach(b,d);else if(a.length===+a.length){for(var e=0,f=a.length;e<f;e++)if(e in a&&b.call(d,a[e],e,a)===c)return}else for(var g in a)if(w.has(a,g)&&b.call(d,a[g],g,a)===c)return};w.map=w.collect=function(a,b,c){var d=[];return a==null?d:l&&a.map===l?a.map(b,c):(x(a,function(a,e,f){d[d.length]=b.call(c,a,e,f)}),a.length===+a.length&&(d.length=a.length),d)},w.reduce=w.foldl=w.inject=function(a,b,c,d){var e=arguments.length>2;a==null&&(a=[]);if(m&&a.reduce===m)return d&&(b=w.bind(b,d)),e?a.reduce(b,c):a.reduce(b);x(a,function(a,f,g){e?c=b.call(d,c,a,f,g):(c=a,e=!0)});if(!e)throw new TypeError("Reduce of empty array with no initial value");return c},w.reduceRight=w.foldr=function(a,b,c,d){var e=arguments.length>2;a==null&&(a=[]);if(n&&a.reduceRight===n)return d&&(b=w.bind(b,d)),e?a.reduceRight(b,c):a.reduceRight(b);var f=w.toArray(a).reverse();return d&&!e&&(b=w.bind(b,d)),e?w.reduce(f,b,c,d):w.reduce(f,b)},w.find=w.detect=function(a,b,c){var d;return y(a,function(a,e,f){if(b.call(c,a,e,f))return d=a,!0}),d},w.filter=w.select=function(a,b,c){var d=[];return a==null?d:o&&a.filter===o?a.filter(b,c):(x(a,function(a,e,f){b.call(c,a,e,f)&&(d[d.length]=a)}),d)},w.reject=function(a,b,c){var d=[];return a==null?d:(x(a,function(a,e,f){b.call(c,a,e,f)||(d[d.length]=a)}),d)},w.every=w.all=function(a,b,d){var e=!0;return a==null?e:p&&a.every===p?a.every(b,d):(x(a,function(a,f,g){if(!(e=e&&b.call(d,a,f,g)))return c}),e)};var y=w.some=w.any=function(a,b,d){b||(b=w.identity);var e=!1;return a==null?e:q&&a.some===q?a.some(b,d):(x(a,function(a,f,g){if(e||(e=b.call(d,a,f,g)))return c}),!!e)};w.include=w.contains=function(a,b){var c=!1;return a==null?c:r&&a.indexOf===r?a.indexOf(b)!=-1:(c=y(a,function(a){return a===b}),c)},w.invoke=function(a,b){var c=g.call(arguments,2);return w.map(a,function(a){return(w.isFunction(b)?b||a:a[b]).apply(a,c)})},w.pluck=function(a,b){return w.map(a,function(a){return a[b]})},w.max=function(a,b,c){if(!b&&w.isArray(a))return Math.max.apply(Math,a);if(!b&&w.isEmpty(a))return-Infinity;var d={computed:-Infinity};return x(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g>=d.computed&&(d={value:a,computed:g})}),d.value},w.min=function(a,b,c){if(!b&&w.isArray(a))return Math.min.apply(Math,a);if(!b&&w.isEmpty(a))return Infinity;var d={computed:Infinity};return x(a,function(a,e,f){var g=b?b.call(c,a,e,f):a;g<d.computed&&(d={value:a,computed:g})}),d.value},w.shuffle=function(a){var b=[],c;return x(a,function(a,d,e){d==0?b[0]=a:(c=Math.floor(Math.random()*(d+1)),b[d]=b[c],b[c]=a)}),b},w.sortBy=function(a,b,c){return w.pluck(w.map(a,function(a,d,e){return{value:a,criteria:b.call(c,a,d,e)}}).sort(function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0}),"value")},w.groupBy=function(a,b){var c={},d=w.isFunction(b)?b:function(a){return a[b]};return x(a,function(a,b){var e=d(a,b);(c[e]||(c[e]=[])).push(a)}),c},w.sortedIndex=function(a,b,c){c||(c=w.identity);var d=0,e=a.length;while(d<e){var f=d+e>>1;c(a[f])<c(b)?d=f+1:e=f}return d},w.toArray=function(a){return a?a.toArray?a.toArray():w.isArray(a)?g.call(a):w.isArguments(a)?g.call(a):w.values(a):[]},w.size=function(a){return w.toArray(a).length},w.first=w.head=function(a,b,c){return b!=null&&!c?g.call(a,0,b):a[0]},w.initial=function(a,b,c){return g.call(a,0,a.length-(b==null||c?1:b))},w.last=function(a,b,c){return b!=null&&!c?g.call(a,Math.max(a.length-b,0)):a[a.length-1]},w.rest=w.tail=function(a,b,c){return g.call(a,b==null||c?1:b)},w.compact=function(a){return w.filter(a,function(a){return!!a})},w.flatten=function(a,b){return w.reduce(a,function(a,c){return w.isArray(c)?a.concat(b?c:w.flatten(c)):(a[a.length]=c,a)},[])},w.without=function(a){return w.difference(a,g.call(arguments,1))},w.uniq=w.unique=function(a,b,c){var d=c?w.map(a,c):a,e=[];return w.reduce(d,function(c,d,f){if(0==f||(b===!0?w.last(c)!=d:!w.include(c,d)))c[c.length]=d,e[e.length]=a[f];return c},[]),e},w.union=function(){return w.uniq(w.flatten(arguments,!0))},w.intersection=w.intersect=function(a){var b=g.call(arguments,1);return w.filter(w.uniq(a),function(a){return w.every(b,function(b){return w.indexOf(b,a)>=0})})},w.difference=function(a){var b=w.flatten(g.call(arguments,1));return w.filter(a,function(a){return!w.include(b,a)})},w.zip=function(){var a=g.call(arguments),b=w.max(w.pluck(a,"length")),c=new Array(b);for(var d=0;d<b;d++)c[d]=w.pluck(a,""+d);return c},w.indexOf=function(a,b,c){if(a==null)return-1;var d,e;if(c)return d=w.sortedIndex(a,b),a[d]===b?d:-1;if(r&&a.indexOf===r)return a.indexOf(b);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===b)return d;return-1},w.lastIndexOf=function(a,b){if(a==null)return-1;if(s&&a.lastIndexOf===s)return a.lastIndexOf(b);var c=a.length;while(c--)if(c in a&&a[c]===b)return c;return-1},w.range=function(a,b,c){arguments.length<=1&&(b=a||0,a=0),c=arguments[2]||1;var d=Math.max(Math.ceil((b-a)/c),0),e=0,f=new Array(d);while(e<d)f[e++]=a,a+=c;return f};var z=function(){};w.bind=function(a,b){var c,d;if(a.bind===v&&v)return v.apply(a,g.call(arguments,1));if(!w.isFunction(a))throw new TypeError;return d=g.call(arguments,2),c=function(){if(this instanceof c){z.prototype=a.prototype;var e=new z,f=a.apply(e,d.concat(g.call(arguments)));return Object(f)===f?f:e}return a.apply(b,d.concat(g.call(arguments)))}},w.bindAll=function(a){var b=g.call(arguments,1);return b.length==0&&(b=w.functions(a)),x(b,function(b){a[b]=w.bind(a[b],a)}),a},w.memoize=function(a,b){var c={};return b||(b=w.identity),function(){var d=b.apply(this,arguments);return w.has(c,d)?c[d]:c[d]=a.apply(this,arguments)}},w.delay=function(a,b){var c=g.call(arguments,2);return setTimeout(function(){return a.apply(a,c)},b)},w.defer=function(a){return w.delay.apply(w,[a,1].concat(g.call(arguments,1)))},w.throttle=function(a,b){var c,d,e,f,g,h=w.debounce(function(){g=f=!1},b);return function(){c=this,d=arguments;var i=function(){e=null,g&&a.apply(c,d),h()};e||(e=setTimeout(i,b)),f?g=!0:a.apply(c,d),h(),f=!0}},w.debounce=function(a,b){var c;return function(){var d=this,e=arguments,f=function(){c=null,a.apply(d,e)};clearTimeout(c),c=setTimeout(f,b)}},w.once=function(a){var b=!1,c;return function(){return b?c:(b=!0,c=a.apply(this,arguments))}},w.wrap=function(a,b){return function(){var c=[a].concat(g.call(arguments,0));return b.apply(this,c)}},w.compose=function(){var a=arguments;return function(){var b=arguments;for(var c=a.length-1;c>=0;c--)b=[a[c].apply(this,b)];return b[0]}},w.after=function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}},w.keys=u||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[];for(var c in a)w.has(a,c)&&(b[b.length]=c);return b},w.values=function(a){return w.map(a,w.identity)},w.functions=w.methods=function(a){var b=[];for(var c in a)w.isFunction(a[c])&&b.push(c);return b.sort()},w.extend=function(a){return x(g.call(arguments,1),function(b){for(var c in b)a[c]=b[c]}),a},w.defaults=function(a){return x(g.call(arguments,1),function(b){for(var c in b)a[c]==null&&(a[c]=b[c])}),a},w.clone=function(a){return w.isObject(a)?w.isArray(a)?a.slice():w.extend({},a):a},w.tap=function(a,b){return b(a),a},w.isEqual=function(a,b){return A(a,b,[])},w.isEmpty=function(a){if(w.isArray(a)||w.isString(a))return a.length===0;for(var b in a)if(w.has(a,b))return!1;return!0},w.isElement=function(a){return!!a&&a.nodeType==1},w.isArray=t||function(a){return i.call(a)=="[object Array]"},w.isObject=function(a){return a===Object(a)},w.isArguments=function(a){return i.call(a)=="[object Arguments]"},w.isArguments(arguments)||(w.isArguments=function(a){return!!a&&!!w.has(a,"callee")}),w.isFunction=function(a){return i.call(a)=="[object Function]"},w.isString=function(a){return i.call(a)=="[object String]"},w.isNumber=function(a){return i.call(a)=="[object Number]"},w.isNaN=function(a){return a!==a},w.isBoolean=function(a){return a===!0||a===!1||i.call(a)=="[object Boolean]"},w.isDate=function(a){return i.call(a)=="[object Date]"},w.isRegExp=function(a){return i.call(a)=="[object RegExp]"},w.isNull=function(a){return a===null},w.isUndefined=function(a){return a===void 0},w.has=function(a,b){return j.call(a,b)},w.noConflict=function(){return a._=b,this},w.identity=function(a){return a},w.times=function(a,b,c){for(var d=0;d<a;d++)b.call(c,d)},w.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")},w.mixin=function(a){x(w.functions(a),function(b){G(b,w[b]=a[b])})};var B=0;w.uniqueId=function(a){var b=B++;return a?a+b:b},w.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var C=/.^/,D=function(a){return a.replace(/\\\\/g,"\\").replace(/\\'/g,"'")};w.template=function(a,b){var c=w.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(c.escape||C,function(a,b){return"',_.escape("+D(b)+"),'"}).replace(c.interpolate||C,function(a,b){return"',"+D(b)+",'"}).replace(c.evaluate||C,function(a,b){return"');"+D(b).replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return b?e(b,w):function(a){return e.call(this,a,w)}},w.chain=function(a){return w(a).chain()};var E=function(a){this._wrapped=a};w.prototype=E.prototype;var F=function(a,b){return b?w(a).chain():a},G=function(a,b){E.prototype[a]=function(){var a=g.call(arguments);return h.call(a,this._wrapped),F(b.apply(w,a),this._chain)}};w.mixin(w),x(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=d[a];E.prototype[a]=function(){var c=this._wrapped;b.apply(c,arguments);var d=c.length;return(a=="shift"||a=="splice")&&d===0&&delete c[0],F(c,this._chain)}}),x(["concat","join","slice"],function(a){var b=d[a];E.prototype[a]=function(){return F(b.apply(this._wrapped,arguments),this._chain)}}),E.prototype.chain=function(){return this._chain=!0,this},E.prototype.value=function(){return this._wrapped},typeof define=="function"&&define.amd&&define("underscore",function(){return w})}).call(this),function(){}.call(this)