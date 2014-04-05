/*! scrawl 2014-04-05 */
"use strict";var scrawl=function(a){return a.newShape=function(b){return new a.Shape(b)},a.Shape=function(b){return b=a.isa(b,"obj")?b:{},a.Sprite.call(this,b),a.Position.prototype.set.call(this,b),this.isLine=a.isa(b.isLine,"bool")?b.isLine:!0,this.dataSet=a.xt(this.data)?this.buildDataSet(this.data):"",this.registerInLibrary(),a.pushUnique(a.group[this.group].sprites,this.name),this},a.Shape.prototype=Object.create(a.Sprite.prototype),a.Shape.prototype.type="Shape",a.Shape.prototype.classname="spritenames",a.d.Shape={dataSet:!1,isLine:!0,method:"draw"},a.mergeInto(a.d.Shape,a.d.Sprite),a.Shape.prototype.set=function(b){return a.Sprite.prototype.set.call(this,b),b=a.isa(b,"obj")?b:{},a.xt(b.data)&&(this.dataSet=this.buildDataSet(this.data),delete this.offset),this},a.Shape.prototype.getPivotOffsetVector=function(){return this.isLine?a.Sprite.prototype.getPivotOffsetVector.call(this):this.getCenteredPivotOffsetVector()},a.Shape.prototype.buildDataSet=function(b){for(var c,d,e=[],f=999999,g=999999,h=-999999,i=-999999,j=this.start.x,k=this.start.y,l=b.match(/([A-Za-z][0-9. ,\-]*)/g),m=function(a,b){f=f>a?a:f,g=g>b?b:g,h=a>h?a:h,i=b>i?b:i},n=0,o=l.length;o>n;n++){if(c=l[n][0],d=l[n].match(/(-?[0-9.]+\b)/g)){for(var p=0,q=d.length;q>p;p++)d[p]=parseFloat(d[p]);switch(c){case"H":for(var p=0,q=d.length;q>p;p++)j=d[p],m(j,k);break;case"V":for(var p=0,q=d.length;q>p;p++)k=d[p],m(j,k);break;case"M":for(var p=0,q=d.length;q>p;p+=2)j=d[p],k=d[p+1],m(j,k);case"L":case"T":for(var p=0,q=d.length;q>p;p+=2)j=d[p],k=d[p+1],m(j,k);break;case"Q":case"S":for(var p=0,q=d.length;q>p;p+=4)j=d[p+2],k=d[p+3],m(j,k);break;case"C":for(var p=0,q=d.length;q>p;p+=6)j=d[p+4],k=d[p+5],m(j,k);break;case"h":for(var p=0,q=d.length;q>p;p++)j+=d[p],m(j,k);break;case"v":for(var p=0,q=d.length;q>p;p++)k+=d[p],m(j,k);break;case"m":case"l":case"t":for(var p=0,q=d.length;q>p;p+=2)j+=d[p],k+=d[p+1],m(j,k);break;case"q":case"s":for(var p=0,q=d.length;q>p;p+=4)j+=d[p+2],k+=d[p+3],m(j,k);break;case"c":for(var p=0,q=d.length;q>p;p+=6)j+=d[p+4],k+=d[p+5],m(j,k)}}e.push({c:c,p:d})}for(var n=0,o=e.length;o>n;n++){if(a.contains(["M","L","C","Q","S","T"],e[n].c))for(var p=0,q=e[n].p.length;q>p;p+=2)e[n].p[p]-=f,e[n].p[p+1]-=g;if("H"===e[n].c)for(var p=0,q=e[n].p.length;q>p;p++)e[n].p[p]-=f;if("V"===e[n].c)for(var p=0,q=e[n].p.length;q>p;p++)e[n].p[p]-=g}return this.width=h-f,this.height=i-g,e},a.Shape.prototype.doOutline=function(b,c){if(a.cell[c].setEngine(this),!this.dataSet&&this.data&&this.buildDataSet(this.data),this.dataSet){var d,e,f,g=this.prepareStamp(),h=0,i=0,j=0,k=0;this.rotateCell(b),b.translate(g.x,g.y),b.beginPath(),a.contains(["M"],this.dataSet[0].c)||b.moveTo(h,i);for(var l=0,m=this.dataSet.length;m>l;l++)switch(d=this.dataSet[l],d.c){case"M":h=d.p[0],i=d.p[1],j=h,k=i,b.moveTo(h*this.scale,i*this.scale);for(var n=2,o=d.p.length;o>n;n+=2)h=d.p[n],i=d.p[n+1],j=h,k=i,b.lineTo(h*this.scale,i*this.scale);break;case"m":h+=d.p[0],i+=d.p[1],j=h,k=i,b.moveTo(h*this.scale,i*this.scale);for(var n=2,o=d.p.length;o>n;n+=2)h+=d.p[n],i+=d.p[n+1],j=h,k=i,b.lineTo(h*this.scale,i*this.scale);break;case"Z":case"z":b.closePath();break;case"L":for(var n=0,o=d.p.length;o>n;n+=2)h=d.p[n],i=d.p[n+1],j=h,k=i,b.lineTo(h*this.scale,i*this.scale);break;case"l":for(var n=0,o=d.p.length;o>n;n+=2)h+=d.p[n],i+=d.p[n+1],j=h,k=i,b.lineTo(h*this.scale,i*this.scale);break;case"H":for(var n=0,o=d.p.length;o>n;n++)h=d.p[n],j=h,b.lineTo(h*this.scale,i*this.scale);break;case"h":for(var n=0,o=d.p.length;o>n;n++)h+=d.p[n],j=h,b.lineTo(h*this.scale,i*this.scale);break;case"V":for(var n=0,o=d.p.length;o>n;n++)i=d.p[n],k=i,b.lineTo(h*this.scale,i*this.scale);break;case"v":for(var n=0,o=d.p.length;o>n;n++)i+=d.p[n],k=i,b.lineTo(h*this.scale,i*this.scale);break;case"C":for(var n=0,o=d.p.length;o>n;n+=6)b.bezierCurveTo(d.p[n]*this.scale,d.p[n+1]*this.scale,d.p[n+2]*this.scale,d.p[n+3]*this.scale,d.p[n+4]*this.scale,d.p[n+5]*this.scale),j=d.p[n+2],k=d.p[n+3],h=d.p[n+4],i=d.p[n+5];break;case"c":for(var n=0,o=d.p.length;o>n;n+=6)b.bezierCurveTo((h+d.p[n])*this.scale,(i+d.p[n+1])*this.scale,(h+d.p[n+2])*this.scale,(i+d.p[n+3])*this.scale,(h+d.p[n+4])*this.scale,(i+d.p[n+5])*this.scale),j=h+d.p[n+2],k=i+d.p[n+3],h+=d.p[n+4],i+=d.p[n+5];break;case"S":for(var n=0,o=d.p.length;o>n;n+=4)l>0&&a.contains(["C","c","S","s"],this.dataSet[l-1].c)?(e=h+(h-j),f=i+(i-k)):(e=h,f=i),b.bezierCurveTo(e*this.scale,f*this.scale,d.p[n]*this.scale,d.p[n+1]*this.scale,d.p[n+2]*this.scale,d.p[n+3]*this.scale),j=d.p[n],k=d.p[n+1],h=d.p[n+2],i=d.p[n+3];break;case"s":for(var n=0,o=d.p.length;o>n;n+=4)l>0&&a.contains(["C","c","S","s"],this.dataSet[l-1].c)?(e=h+(h-j),f=i+(i-k)):(e=h,f=i),b.bezierCurveTo(e*this.scale,f*this.scale,(h+d.p[n])*this.scale,(i+d.p[n+1])*this.scale,(h+d.p[n+2])*this.scale,(i+d.p[n+3])*this.scale),j=h+d.p[n],k=i+d.p[n+1],h+=d.p[n+2],i+=d.p[n+3];break;case"Q":for(var n=0,o=d.p.length;o>n;n+=4)b.quadraticCurveTo(d.p[n]*this.scale,d.p[n+1]*this.scale,d.p[n+2]*this.scale,d.p[n+3]*this.scale),j=d.p[n],k=d.p[n+1],h=d.p[n+2],i=d.p[n+3];break;case"q":for(var n=0,o=d.p.length;o>n;n+=4)b.quadraticCurveTo((h+d.p[n])*this.scale,(i+d.p[n+1])*this.scale,(h+d.p[n+2])*this.scale,(i+d.p[n+3])*this.scale),j=h+d.p[n],k=i+d.p[n+1],h+=d.p[n+2],i+=d.p[n+3];break;case"T":for(var n=0,o=d.p.length;o>n;n+=2)l>0&&a.contains(["Q","q","T","t"],this.dataSet[l-1].c)?(e=h+(h-j),f=i+(i-k)):(e=h,f=i),b.quadraticCurveTo(e*this.scale,f*this.scale,d.p[n]*this.scale,d.p[n+1]*this.scale),j=e,k=f,h=d.p[n],i=d.p[n+1];break;case"t":for(var n=0,o=d.p.length;o>n;n+=2)l>0&&a.contains(["Q","q","T","t"],this.dataSet[l-1].c)?(e=h+(h-j),f=i+(i-k)):(e=h,f=i),b.quadraticCurveTo(e*this.scale,f*this.scale,(h+d.p[n])*this.scale,(i+d.p[n+1])*this.scale),j=e,k=f,h+=d.p[n],i+=d.p[n+1]}}return this},a.Shape.prototype.clip=function(a){return a.save(),this.doOutline(a),a.clip(),this},a.Shape.prototype.clear=function(b,c){var d=a.cell[c];return this.clip(b,c),b.clearRect(0,0,d.get("actualWidth"),d.get(".actualHeight")),b.restore(),this},a.Shape.prototype.clearWithBackground=function(b,c){var d=a.cell[c];return this.clip(b,c),b.fillStyle=d.backgroundColor,b.fillRect(0,0,d.get("actualWidth"),d.get("actualHeight")),b.fillStyle=a.ctx[c].get("fillStyle"),b.restore(),this},a.Shape.prototype.draw=function(a,b){return this.doOutline(a,b),a.stroke(),this},a.Shape.prototype.fill=function(b,c){return this.doOutline(b,c),b.fill(a.ctx[this.context].get("winding")),this},a.Shape.prototype.drawFill=function(b,c){return this.doOutline(b,c),b.stroke(),this.clearShadow(b,c),b.fill(a.ctx[this.context].get("winding")),this},a.Shape.prototype.fillDraw=function(b,c){return this.doOutline(b,c),b.fill(a.ctx[this.context].get("winding")),this.clearShadow(b,c),b.stroke(),this},a.Shape.prototype.sinkInto=function(b,c){return this.doOutline(b,c),b.fill(a.ctx[this.context].get("winding")),b.stroke(),this},a.Shape.prototype.floatOver=function(b,c){return this.doOutline(b,c),b.stroke(),b.fill(a.ctx[this.context].get("winding")),this},a.Shape.prototype.checkHit=function(b){b=a.isa(b,"obj")?b:{};var c=a.pad[a.currentPad],d=a.cell[c.current].name,e=a.context[c.current],f=a.xt(b.tests)?b.tests:[{x:b.x||!1,y:b.y||!1}],g=!1;this.doOutline(e,d);for(var h=0,i=f.length;i>h&&!(g=e.isPointInPath(f[h].x,f[h].y));h++);return g?f[h]:!1},a}(scrawl);