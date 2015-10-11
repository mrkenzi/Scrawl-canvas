/*! scrawl-canvas 2015-10-11 */
if(window.scrawl&&window.scrawl.work.extensions&&!window.scrawl.contains(window.scrawl.work.extensions,"color"))var scrawl=function(a){"use strict";return a.newColor=function(b){return a.makeColor(b)},a.makeColor=function(b){return new a.Color(b)},a.Color=function(b){return b=a.safeObject(b),a.Base.call(this,b),this.set(b),a.xt(b.color)&&this.convert(b.color),b.random&&this.generateRandomColor(b),this.checkValues(),a.design[this.name]=this,a.pushUnique(a.designnames,this.name),this},a.Color.prototype=Object.create(a.Base.prototype),a.Color.prototype.type="Color",a.Color.prototype.classname="designnames",a.work.d.Color={r:0,g:0,b:0,a:1,rShift:0,gShift:0,bShift:0,aShift:0,rMax:255,gMax:255,bMax:255,aMax:1,rMin:0,gMin:0,bMin:0,aMin:0,rBounce:!1,gBounce:!1,bBounce:!1,aBounce:!1,autoUpdate:!1},a.mergeInto(a.work.d.Color,a.work.d.Base),a.Color.prototype.get=function(b){return a.xt(b)?"random"===b?(this.generateRandomColor(),this.get()):a.Base.prototype.get.call(this,b):"rgba("+(this.r||0)+", "+(this.g||0)+", "+(this.b||0)+", "+a.xtGet(this.a,1)+")"},a.Color.prototype.clone=function(b){var c,d,e;return b=a.safeObject(b),c=this.parse(),d=a.mergeOver(c,b),e=a.makeColor(d),b.random&&(delete e.r,delete e.g,delete e.b,delete e.a,e.generateRandomColor(b)),e},a.Color.prototype.getData=function(){return this.get("autoUpdate")&&this.update(),this.checkValues(),this.get()},a.Color.prototype.generateRandomColor=function(b){var c=a.xtGet;return b=a.safeObject(b),this.rMax=c(b.rMax,this.rMax,255),this.gMax=c(b.gMax,this.gMax,255),this.bMax=c(b.bMax,this.bMax,255),this.aMax=c(b.aMax,this.aMax,1),this.rMin=c(b.rMin,this.rMin,0),this.gMin=c(b.gMin,this.gMin,0),this.bMin=c(b.bMin,this.bMin,0),this.aMin=c(b.aMin,this.aMin,0),this.r=b.r||Math.round(Math.random()*(this.rMax-this.rMin)+this.rMin),this.g=b.g||Math.round(Math.random()*(this.gMax-this.gMin)+this.gMin),this.b=b.b||Math.round(Math.random()*(this.bMax-this.bMin)+this.bMin),this.a=b.a||Math.random()*(this.aMax-this.aMin)+this.aMin,this.checkValues(),this},a.Color.prototype.checkValues=function(){var a=Math.floor(this.r)||0,b=Math.floor(this.g)||0,c=Math.floor(this.b)||0,d=this.a||1;return this.r=a>255?255:0>a?0:a,this.g=b>255?255:0>b?0:b,this.b=c>255?255:0>c?0:c,this.a=d>1?1:0>d?0:d,this},a.Color.prototype.set=function(b){return a.Base.prototype.set.call(this,b),b=a.safeObject(b),b.random?this.generateRandomColor(b):b.color?this.convert(b.color):this.checkValues(),this},a.Color.prototype.update=function(){var b,c,d,e,f,g,h,i=["r","g","b","a"],j=a.isBetween;for(b=0,c=i.length;c>b;b++)d=this[i[b]],e=this[i[b]+"Shift"],f=this[i[b]+"Min"],g=this[i[b]+"Max"],h=this[i[b]+"Bounce"],e&&(j(d+e,g,f,!0)||(h?e=-e:(d=d>(g+f)/2?g:f,e=0)),this[i[b]]=d+e,this[i[b]+"Shift"]=e);return this},a.Color.prototype.setDelta=function(b){return b=a.isa(b,"obj")?b:{},a.Base.prototype.set.call(this,{r:(this.r||0)+(b.r||0),g:(this.g||0)+(b.g||0),b:(this.b||0)+(b.b||0),a:(this.a||1)+(b.a||0)}),this.checkValues(),this},a.Color.prototype.convert=function(b){var c,d,e,f,g;if(b=a.isa(b,"str")?b:"",b.length>0){if(b.toLowerCase(),c=0,d=0,e=0,f=1,"#"===b[0])b.length<5?(c=this.toDecimal(b[1]+b[1]),d=this.toDecimal(b[2]+b[2]),e=this.toDecimal(b[3]+b[3])):b.length<8&&(c=this.toDecimal(b[1]+b[2]),d=this.toDecimal(b[3]+b[4]),e=this.toDecimal(b[5]+b[6]));else if(/rgb\(/.test(b))g=b.match(/([0-9.]+\b)/g),/%/.test(b)?(c=Math.round(g[0]/100*255),d=Math.round(g[1]/100*255),e=Math.round(g[2]/100*255)):(c=Math.round(g[0]),d=Math.round(g[1]),e=Math.round(g[2]));else if(/rgba\(/.test(b))g=b.match(/([0-9.]+\b)/g),c=g[0],d=g[1],e=g[2],f=g[3];else switch(b){case"green":c=0,d=128,e=0;break;case"silver":c=192,d=192,e=192;break;case"lime":c=0,d=255,e=0;break;case"gray":c=128,d=128,e=128;break;case"grey":c=128,d=128,e=128;break;case"olive":c=128,d=128,e=0;break;case"white":c=255,d=255,e=255;break;case"yellow":c=255,d=255,e=0;break;case"maroon":c=128,d=0,e=0;break;case"navy":c=0,d=0,e=128;break;case"red":c=255,d=0,e=0;break;case"blue":c=0,d=0,e=255;break;case"purple":c=128,d=0,e=128;break;case"teal":c=0,d=128,e=128;break;case"fuchsia":c=255,d=0,e=255;break;case"aqua":c=0,d=255,e=255;break;default:c=0,d=0,e=0}this.r=c,this.g=d,this.b=e,this.a=f,this.checkValues()}return this},a.Color.prototype.toHex=function(a){return a.toString(16)},a.Color.prototype.toDecimal=function(a){return parseInt(a,16)},a.Color.prototype.remove=function(){return delete a.dsn[this.name],delete a.design[this.name],a.removeItem(a.designnames,this.name),!0},a}(scrawl);