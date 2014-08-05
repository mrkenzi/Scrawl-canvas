/*! scrawl-canvas 2014-08-05 */
var scrawl=function(a){"use strict";return a.newBlock=function(b){return new a.Block(b)},a.Block=function(b){return b=a.safeObject(b),a.Sprite.call(this,b),a.Position.prototype.set.call(this,b),this.width=b.width||a.d.Block.width,this.height=b.height||a.d.Block.height,this.registerInLibrary(),a.pushUnique(a.group[this.group].sprites,this.name),this},a.Block.prototype=Object.create(a.Sprite.prototype),a.Block.prototype.type="Block",a.Block.prototype.classname="spritenames",a.d.Block={},a.mergeInto(a.d.Block,a.d.Sprite),a.Block.prototype.clip=function(a){var b=this.prepareStamp();return a.save(),this.rotateCell(a),a.beginPath(),a.rect(b.x,b.y,this.width*this.scale,this.height*this.scale),a.clip(),this},a.Block.prototype.clear=function(b,c){var d=this.prepareStamp();return a.cell[c].setToClearShape(),this.rotateCell(b),b.clearRect(d.x,d.y,this.width*this.scale,this.height*this.scale),this},a.Block.prototype.clearWithBackground=function(b,c){var d=a.cell[c],e=d.get("backgroundColor"),f=a.ctx[c],g=f.get("fillStyle"),h=f.get("strokeStyle"),i=f.get("globalAlpha"),j=this.prepareStamp(),k=this.width*this.scale,l=this.height*this.scale;return this.rotateCell(b),b.fillStyle=e,b.strokeStyle=e,b.globalAlpha=1,b.strokeRect(j.x,j.y,k,l),b.fillRect(j.x,j.y,k,l),b.fillStyle=g,b.strokeStyle=h,b.globalAlpha=i,this},a.Block.prototype.draw=function(b,c){var d=this.prepareStamp();return a.cell[c].setEngine(this),this.rotateCell(b),b.strokeRect(d.x,d.y,this.width*this.scale,this.height*this.scale),this},a.Block.prototype.fill=function(b,c){var d=this.prepareStamp();return a.cell[c].setEngine(this),this.rotateCell(b),b.fillRect(d.x,d.y,this.width*this.scale,this.height*this.scale),this},a.Block.prototype.drawFill=function(b,c){var d=this.prepareStamp(),e=this.width*this.scale,f=this.height*this.scale;return a.cell[c].setEngine(this),this.rotateCell(b),b.strokeRect(d.x,d.y,e,f),this.clearShadow(b,c),b.fillRect(d.x,d.y,e,f),this},a.Block.prototype.fillDraw=function(b,c){var d=this.prepareStamp(),e=this.width*this.scale,f=this.height*this.scale;return a.cell[c].setEngine(this),this.rotateCell(b),b.fillRect(d.x,d.y,e,f),this.clearShadow(b,c),b.strokeRect(d.x,d.y,e,f),this},a.Block.prototype.sinkInto=function(b,c){var d=this.prepareStamp(),e=this.width*this.scale,f=this.height*this.scale;return a.cell[c].setEngine(this),this.rotateCell(b),b.fillRect(d.x,d.y,e,f),b.strokeRect(d.x,d.y,this.width*this.scale,this.height*this.scale),this},a.Block.prototype.floatOver=function(b,c){var d=this.prepareStamp(),e=this.width*this.scale,f=this.height*this.scale;return a.cell[c].setEngine(this),this.rotateCell(b),b.strokeRect(d.x,d.y,e,f),b.fillRect(d.x,d.y,e,f),this},a}(scrawl);