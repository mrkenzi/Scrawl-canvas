'use strict';
/**
# scrawlPath

## Purpose and features

The Path module adds Path sprites - path-based objects - to the core module

* Defines a sprite composed of lines, quadratic and bezier curves, etc
* Can act as a path along which other sprites can be positioned and animated
* See also Shape object, which achieves a similar thing in a different way

@module scrawlPath
**/

var scrawl = (function(my){

/**
# window.scrawl

scrawlPath module adaptions to the Scrawl library object

## New library sections

* scrawl.point 
* scrawl.link 

## New default attributes

* Position.pathPlace - default: 0
* Position.pathRoll - default: 0;
* Position.addPathRoll - default: false;
* Position.path - default: '';

@class window.scrawl_Path
**/

/**
scrawl.deleteSprite hook function - modified by path module
@method pathDeleteSprite
@private
**/
	my.pathDeleteSprite = function(mySprite){
		var myPointList,
			myLinkList;
		if(mySprite.type === 'Path'){
			myPointList = mySprite.getFullPointList();
			myLinkList = mySprite.getFullLinkList();
			for(var j=0, w=myPointList.length; j<w; j++){
				my.removeItem(my.pointnames, myPointList[j]);
				delete my.point[myPointList[j]];
				}
			for(var j=0, w=myLinkList.length; j<w; j++){
				my.removeItem(my.linknames, myLinkList[j]);
				delete my.link[myLinkList[j]];
				}
			}
		};
/**
Clone a Scrawl.js object, optionally altering attribute values in the cloned object

(This function replaces the core function)

@method Base.clone
@param {Object} items Object containing attribute key:value pairs; will overwrite existing values in the cloned, but not the source, Object
@return Cloned object
@chainable
@example
	var box = scrawl.newBlock({
		width: 50,
		height: 50,
		});
	var newBox = box.clone({
		height: 100,
		});
	newBox.get('width');		//returns 50
	newBox.get('height');		//returns 100
**/
	my.Base.prototype.clone = function(items){
		var b = my.mergeOver(this.parse(), my.safeObject(items));
		delete b.context;	//required for successful cloning of sprites
		return (this.type === 'Path') ? my.makePath(b) : new my[this.type](b);
		};
	my.d.Position.pathPlace = 0;
	my.d.Position.pathRoll = 0;
	my.d.Position.addPathRoll = false;
	my.d.Position.path = '';
	my.mergeInto(my.d.Cell, my.d.Position);
	my.mergeInto(my.d.Sprite, my.d.Position);
	if(my.xt(my.d.Block)){my.mergeInto(my.d.Block, my.d.Sprite);}
	if(my.xt(my.d.Shape)){my.mergeInto(my.d.Shape, my.d.Sprite);}
	if(my.xt(my.d.Wheel)){my.mergeInto(my.d.Wheel, my.d.Sprite);}
	if(my.xt(my.d.Picture)){my.mergeInto(my.d.Picture, my.d.Sprite);}
	if(my.xt(my.d.Phrase)){my.mergeInto(my.d.Phrase, my.d.Sprite);}
/**
Position constructor hook function - modified by path module
@method pathPositionInit
@private
**/
	my.Position.prototype.pathPositionInit = function(items){
		this.path = items.path || my.d[this.type].path;
		this.pathRoll = items.pathRoll || my.d[this.type].pathRoll;
		this.addPathRoll = items.addPathRoll || my.d[this.type].addPathRoll;
		this.pathPlace = items.pathPlace || my.d[this.type].pathPlace;
		};
/**
Position.setDelta hook function - modified by path module
@method pathPositionSetDelta
@private
**/
	my.Position.prototype.pathPositionSetDelta = function(items){
		if(items.pathPlace){
			this.pathPlace += items.pathPlace;
			}
		};
/**
Cell.prepareToCopyCell hook function - modified by path module
@method pathPrepareToCopyCell
@private
**/
	my.Cell.prototype.pathPrepareToCopyCell = function(){
		var	here;
		if(my.contains(my.spritenames, this.path) && my.sprite[this.path].type === 'Path'){
			here = my.sprite[this.path].getPerimeterPosition(this.pathPlace, this.pathSpeedConstant, this.addPathRoll);
			this.start.x = (!this.lockX) ? here.x : this.start.x;
			this.start.y = (!this.lockY) ? here.y : this.start.y;
			this.pathRoll = here.r || 0;
			}
		};
/**
Sprite.stamp hook function - modified by path module
@method pathStamp
@private
**/
	my.Sprite.prototype.pathStamp = function(method, cell){
		var here;
		if(my.contains(my.spritenames, this.path) && my.sprite[this.path].type === 'Path'){
			here = my.sprite[this.path].getPerimeterPosition(this.pathPlace, this.pathSpeedConstant, this.addPathRoll);
			this.start.x = (!this.lockX) ? here.x : this.start.x;
			this.start.y = (!this.lockY) ? here.y : this.start.y;
			this.pathRoll = here.r || 0;
			}
		};
/**
A __factory__ function to generate new Point objects
@method newPoint
@param {Object} items Key:value Object argument for setting attributes
@return Point object
@private
**/
	my.newPoint = function(items){
		return new my.Point(items);
		};
/**
A __factory__ function to generate new Link objects
@method newLink
@param {Object} items Key:value Object argument for setting attributes
@return Link object
@private
**/
	my.newLink = function(items){
		return new my.Link(items);
		};
/**
A __factory__ function to generate new Path objects

_Note: this function does NOT produce Path sprites_ - use scrawl.makePath()
@method newPath
@param {Object} items Key:value Object argument for setting attributes
@return Path object
@private
**/
	my.newPath = function(items){
		return new my.Path(items);
		};
/**
A __factory__ function to generate new Path sprites
@method makePath
@param {Object} items Key:value Object argument for setting attributes
@return Path sprite
@example
	scrawl.makePath({
		startX: 50,
		startY: 20,
		fillStyle: 'red',
		data: 'M0,0 50,0 60,20, 10,20 0,0z',
		});
**/
	my.makePath = function(items){
		items = (my.isa(items,'obj')) ? items : {};
		var minX = 999999, 
			minY = 999999, 
			maxX = -999999, 
			maxY = -999999,
			myShape, 
			sn, 
			tn, 
			lib, 
			sx, 
			sy, 
			set, 
			data, 
			command, 
			temppoint,
			lc = 0, 
			pc = 0, 
			cx = 0, 
			cy = 0;
		var	myPivot = (my.xt(items.pivot)) ? my.point[myPivot] || my.sprite[myPivot] : false;
		items.start = (my.xt(items.start)) ? items.start : {};
		items.scaleX = items.scaleX || 1; 
		items.scaleY = items.scaleY || 1;
		items.startX = (myPivot) ? ((myPivot.type === 'Point') ? myPivot.local.x : myPivot.start.x) : (items.startX || items.start.x || 0); 
		items.startY = (myPivot) ? ((myPivot.type === 'Point') ? myPivot.local.y : myPivot.start.y) : (items.startY || items.start.y || 0); 
		items.isLine = (my.isa(items.isLine,'bool')) ? items.isLine : true;
		var checkMinMax = function(cx,cy){
			minX = (minX > cx) ? cx : minX;
			minY = (minY > cy) ? cy : minY;
			maxX = (maxX < cx) ? cx : maxX;
			maxY = (maxY < cy) ? cy : maxY;
			};
		var getPathSetData = function(sim){
			var psd = sim.match(/(-?[0-9.]+\b)/g);
			if(psd){
				for(var j=0, w=psd.length; j<w; j++){
					psd[j] = parseFloat(psd[j]);
					}
				return psd;
				}
			return false;
			};
		var generatePoint = function(_tempname,_pcount,_shapename,_x,_y,_lcount,_sx,_sy){
			my.newPoint({
				name: _tempname+'_p'+_pcount,
				sprite: _shapename,
				currentX: _x*_sx,
				currentY: _y*_sy,
				startLink: _tempname+'_l'+_lcount,
				});
			};
		var generateLink = function(_tempname,_lcount,_shapename,_spec,_act,_spt,_ept,_cp1,_cp2){
			_ept = (my.xt(_ept)) ? _ept : {};
			_cp1 = (my.xt(_cp1)) ? _cp1 : {};
			_cp2 = (my.xt(_cp2)) ? _cp2 : {};
			my.newLink({
				name: _tempname+'_l'+_lcount,
				sprite: _shapename,
				species: _spec, 
				startPoint: _spt.name,
				endPoint: _ept.name || false,
				controlPoint1: _cp1.name || false,
				controlPoint2: _cp2.name || false,
				precision: items.precision || false,
				action: _act,
				});
			};
		if(my.xt(items.data)){
			myShape = my.newPath(items);
			sn = myShape.name;
			tn = sn.replace('~','_','g');
			lib = my.point;
			sx = items.scaleX;
			sy = items.scaleY;
			if(myShape){
				set = items.data.match(/([A-Za-z][0-9. ,\-]*)/g);
				generatePoint(tn, pc, sn, cx, cy, lc, sx, sy); pc++;
				for(var i=0,z=set.length; i<z; i++){
					command = set[i][0];
					data = getPathSetData(set[i]);
					switch(command){
						case 'M' :
							cx = data[0], cy = data[1];
							checkMinMax(cx,cy);
							generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
							generateLink(tn, lc, sn, false, 'move', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
							for(var k=2,v=data.length;k<v;k+=2){
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx = data[k], cy = data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						case 'm' :
							if(i===0){
								cx = data[0], cy = data[1];
								}
							else{
								cx += data[0], cy += data[1];
								}
							checkMinMax(cx,cy);
							generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
							generateLink(tn, lc, sn, false, 'move', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
							for(var k=2,v=data.length;k<v;k+=2){
								generatePoint(tn, pc, sn, cx+data[k], cy+data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx += data[k], cy += data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						case 'Z' :
						case 'z' :
							generatePoint(tn, pc, sn, myShape.start.x, myShape.start.y, lc+1, sx, sy); pc++;
							generateLink(tn, lc, sn, false, 'close', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
							break;
						case 'L' :
							for(var k=0,v=data.length;k<v;k+=2){
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx = data[k], cy = data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						case 'l' :
							for(var k=0,v=data.length;k<v;k+=2){
								generatePoint(tn, pc, sn, cx+data[k], cy+data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx += data[k], cy += data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						case 'H' :
							for(var k=0,v=data.length;k<v;k++){
								generatePoint(tn, pc, sn, data[k], cy, lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx = data[k];
								checkMinMax(cx,cy);
								}
							break;
						case 'h' :
							for(var k=0,v=data.length;k<v;k++){
								generatePoint(tn, pc, sn, cx+data[k], cy, lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cx += data[k];
								checkMinMax(cx,cy);
								}
							break;
						case 'V' :
							for(var k=0,v=data.length;k<v;k++){
								generatePoint(tn, pc, sn, cx, data[k], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cy = data[k];
								checkMinMax(cx,cy);
								}
							break;
						case 'v' :
							for(var k=0,v=data.length;k<v;k++){
								generatePoint(tn, pc, sn, cx, cy+data[k], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'line', 'add', lib[tn+'_p'+(pc-2)], lib[tn+'_p'+(pc-1)]); lc++;
								cy += data[k];
								checkMinMax(cx,cy);
								}
							break;
						case 'C' :
							for(var k=0,v=data.length;k<v;k+=6){
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, data[k+2], data[k+3], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, data[k+4], data[k+5], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'bezier', 'add', lib[tn+'_p'+(pc-4)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-2)]); lc++;
								cx = data[k+4], cy = data[k+5];
								checkMinMax(cx,cy);
								}
							break;
						case 'c' :
							for(var k=0,v=data.length;k<v;k+=6){
								generatePoint(tn, pc, sn, cx+data[k], cy+data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, cx+data[k+2], cy+data[k+3], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, cx+data[k+4], cy+data[k+5], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'bezier', 'add', lib[tn+'_p'+(pc-4)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-2)]); lc++;
								cx += data[k+4], cy += data[k+5];
								checkMinMax(cx,cy);
								}
							break;
						case 'S' :
							for(var k=0,v=data.length;k<v;k+=4){
								if(i>0 && my.contains(['C','c','S','s'], set[i-1][0])){
									lib[tn+'_p'+(pc-2)].clone({
										name: tn+'_p'+pc,
										currentX: cx+(cx-lib[tn+'_p'+(pc-2)].currentX),
										currentY: cy+(cy-lib[tn+'_p'+(pc-2)].currentY),
										}), pc++;
									}
								else{
									generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
									}
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, data[k+2], data[k+3], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'bezier', 'add', lib[tn+'_p'+(pc-4)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-2)]); lc++;
								cx = data[k+2], cy = data[k+3];
								checkMinMax(cx,cy);
								}
							break;
						case 's' :
							for(var k=0,v=data.length;k<v;k+=4){
								if(i>0 && my.contains(['C','c','S','s'], set[i-1][0])){
									lib[tn+'_p'+(pc-2)].clone({
										name: tn+'_p'+pc,
										currentX: cx+(cx-lib[tn+'_p'+(pc-2)].currentX),
										currentY: cy+(cy-lib[tn+'_p'+(pc-2)].currentY),
										}), pc++;
									}
								else{
									generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
									}
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, data[k+2], data[k+3], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'bezier', 'add', lib[tn+'_p'+(pc-4)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-2)]); lc++;
								cx += data[k+2], cy += data[k+3];
								checkMinMax(cx,cy);
								}
							break;
						case 'Q' :
							for(var k=0,v=data.length;k<v;k+=4){
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, data[k+2], data[k+3], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'quadratic', 'add', lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-2)]); lc++;
								cx = data[k+2], cy = data[k+3];
								checkMinMax(cx,cy);
								}
							break;
						case 'q' :
							for(var k=0,v=data.length;k<v;k+=4){
								generatePoint(tn, pc, sn, cx+data[k], cy+data[k+1], lc+1, sx, sy); pc++;
								generatePoint(tn, pc, sn, cx+data[k+2], cy+data[k+3], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'quadratic', 'add', lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-2)]); lc++;
								cx += data[k+2], cy += data[k+3];
								checkMinMax(cx,cy);
								}
							break;
						case 'T' :
							for(var k=0,v=data.length;k<v;k+=2){
								if(i>0 && my.contains(['Q','q','T','t'], set[i-1][0])){
									lib[tn+'_p'+(pc-2)].clone({
										name: tn+'_p'+pc,
										currentX: cx+(cx-lib[tn+'_p'+(pc-2)].currentX),
										currentY: cy+(cy-lib[tn+'_p'+(pc-2)].currentY),
										}), pc++;
									}
								else{
									generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
									}
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'quadratic', 'add', lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-2)]); lc++;
								cx = data[k], cy = data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						case 't' :
							for(var k=0,v=data.length;k<v;k+=2){
								if(i>0 && my.contains(['Q','q','T','t'], set[i-1][0])){
									lib[tn+'_p'+(pc-2)].clone({
										name: tn+'_p'+pc,
										currentX: cx+(cx-lib[tn+'_p'+(pc-2)].currentX),
										currentY: cy+(cy-lib[tn+'_p'+(pc-2)].currentY),
										}), pc++;
									}
								else{
									generatePoint(tn, pc, sn, cx, cy, lc+1, sx, sy); pc++;
									}
								generatePoint(tn, pc, sn, data[k], data[k+1], lc+1, sx, sy); pc++;
								generateLink(tn, lc, sn, 'quadratic', 'add', lib[tn+'_p'+(pc-3)], lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc-2)]); lc++;
								cx += data[k], cy += data[k+1];
								checkMinMax(cx,cy);
								}
							break;
						default :
						}
					}
				generateLink(tn, lc, sn, false, 'end', lib[tn+'_p'+(pc-1)], lib[tn+'_p'+(pc)]);
				myShape.set({
					firstPoint: tn + '_p0',
					width: (maxX - minX) * items.scaleX,
					height: (maxY - minY) * items.scaleY,
					});
				myShape.buildPositions();
				return myShape;
				}
			}
		return false;
		};
	my.pushUnique(my.sectionlist, 'point');
	my.pushUnique(my.nameslist, 'pointnames');
	my.pushUnique(my.sectionlist, 'link');
	my.pushUnique(my.nameslist, 'linknames');
		
/**
# Path
	
## Instantiation

* scrawl.makePath() - Irregular, path-based shapes

Additional factory functions to instantiate Path objects are available in the __pathFactoryFunctions__ module

## Purpose

* Defines a sprite composed of lines, quadratic and bezier curves, etc
* Makes use of, but doesn't contain, Point and Link objects to define the sprite
* Can be used as a path for placing and animating other sprites
* Point objects can be used as pivots by other sprites

## Access

* scrawl.sprite.PATHNAME - for the Path sprite object

@class Path
@constructor
@extends Sprite
@param {Object} [items] Key:value Object argument for setting attributes
**/		
	my.Path = function(items){
		items = my.safeObject(items);
		my.Sprite.call(this, items);
		my.Position.prototype.set.call(this, items);
		this.isLine = (my.isa(items.isLine,'bool')) ? items.isLine : true;
		this.linkList = [];
		this.linkDurations = [];
		this.pointList = [];
		this.registerInLibrary();
		my.pushUnique(my.group[this.group].sprites, this.name);
		return this;
		}
	my.Path.prototype = Object.create(my.Sprite.prototype);
/**
@property type
@type String
@default 'Path'
@final
**/		
	my.Path.prototype.type = 'Path';
	my.Path.prototype.classname = 'spritenames';
	my.d.Path = {
/**
POINTNAME of the Point object that commences the drawing operation

Set automatically by Path creation factory functions
@property firstPoint
@type String
@default ''
@private
**/
		firstPoint: '',
/**
Drawing flag - when set to true, will treat the first drawing (not positioning) data point as the start point

Generally this is set automatically as part of an outline factory function
@property isLine
@type Boolean
@default true
**/
		isLine: true,
/**
Drawing flag - when true, path will be closed

_Note: this attribute must be set to true for those drawing methods that use a fill flood as part of their operation
@property closed
@type Boolean
@default true
**/
		closed: true,
/**
Array of LINKNAME Strings for Link objects associated with this Path sprite
@property linkList
@type Array
@default []
@private
**/
		linkList: [],
/**
Array of length (Number) values for each Link object associated with this Path sprite
@property linkDurations
@type Array
@default []
@private
**/
		linkDurations: [],
/**
Array of POINTNAME Strings for Point objects associated with this Path sprite
@property pointList
@type Array
@default []
@private
**/
		pointList: [],
/**
Path length - calculated automatically by scrawl

_Note: this value will be affected by the value of the precision attribute - hiher precisions lead to more accurate perimeterLength values, particularly along curves_
@property perimeterLength
@type Number
@default 0
**/
		perimeterLength: 0,
/**
Path marker sprites - SPRITENAME String of sprite used at start of the Path
@property markStart
@type String
@default ''
**/
		markStart: '',
/**
Path marker sprites - SPRITENAME String of sprite used at the line/curve joints along the Path
@property markMid
@type String
@default ''
**/
		markMid: '',
/**
Path marker sprites - SPRITENAME String of sprite used at end of the Path
@property markEnd
@type String
@default ''
**/
		markEnd: '',
/**
Path marker sprites - SPRITENAME String of sprite used as the fallback when markStart, markMid or markEnd attributes are not set
@property mark
@type String
@default ''
**/
		mark: '',
/**
Path sprite default method attribute is 'draw', not 'fill'
@property method
@type String
@default 'draw'
**/
		method: 'draw',
/**
Set the iterations required for calculating path length and positioning data - higher figures (eg 100) ensure sprites will follow the path more accurately
@property precision
@type Number
@default 10
**/
		precision: 10,
		};
	my.mergeInto(my.d.Path, my.d.Sprite);
/**
Helper function - define the sprite's path on the &lt;canvas&gt; element's context engine
@method prepareShape
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.prepareShape = function(ctx, cell){
		var here;
		my.cell[cell].setEngine(this);
		if(this.firstPoint){
			here = this.prepareStamp();
			this.rotateCell(ctx);
			ctx.translate(here.x,here.y);
			ctx.beginPath();
			my.link[my.point[this.firstPoint].startLink].sketch(ctx);
			}
		return this;
		}
/**
Augments Position.getPivotOffsetVector()
@method getPivotOffsetVector
@return A Vector of calculated offset values to help determine where sprite drawing should start
@private
**/
	my.Path.prototype.getPivotOffsetVector = function(){
		return (this.isLine) ? my.Sprite.prototype.getPivotOffsetVector.call(this) : this.getCenteredPivotOffsetVector();
		};
/**
Display helper function

Stamp mark sprites onto Path

@method stampMark
@param {Sprite} sprite Sprite object to be stamped
@param {Number} pos Path position (between 0 and 1)
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.stampMark = function(sprite, pos, ctx, cell){
		var	tPath,
			tPathPlace,
			tGroup,
			tHandle;
		tPath = sprite.path;
		tPathPlace = sprite.pathPlace;
		tGroup = sprite.group;
		tHandle = sprite.handle;
		sprite.set({
			path: this.name,
			pathPlace: pos,
			group: cell,
			handle: this.handle,
			}).forceStamp();
		sprite.set({
			path: tPath,
			pathPlace: tPathPlace,
			group: tGroup,
			handle: tHandle,
			});
		return this;
		};
/**
Display helper function

Prepare mark sprites for stamping onto Path

@method addMarks
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.addMarks = function(ctx, cell){
		var mark = this.get('mark'),
			markStart = this.get('markStart'),
			markMid = this.get('markMid'),
			markEnd = this.get('markEnd'),
			myMark = false,
			sprite,
			linkDurations;
		if(mark || markStart || markMid || markEnd){
			this.buildPositions();
			linkDurations = this.get('linkDurations');
			myMark = markStart || mark || false;
			if(myMark && my.contains(my.spritenames, myMark)){
				this.stampMark(my.sprite[myMark], 0, ctx, cell);
				}
			myMark = markMid || mark || false;
			if(myMark && my.contains(my.spritenames, myMark)){
				sprite = my.sprite[myMark];
				for(var j=0, w=linkDurations.length-1; j<w; j++){
					this.stampMark(sprite, linkDurations[j], ctx, cell);
					}
				}
			myMark = markEnd || mark || false;
			if(myMark && my.contains(my.spritenames, myMark)){
				this.stampMark(my.sprite[myMark], 1, ctx, cell);
				}
			}
		return this;
		};
/**
Stamp helper function - perform a 'clip' method draw
@method clip
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.clip = function(ctx, cell){
		if(this.closed){
			this.prepareShape(ctx, cell);
			ctx.clip();
			}
		return this;
		};
/**
Stamp helper function - perform a 'clear' method draw
@method clear
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.clear = function(ctx, cell){
		this.prepareShape(ctx, cell);
		ctx.globalCompositeOperation = 'destination-out';
		ctx.stroke();
		ctx.fill(my.ctx[this.context].get('winding'));
		ctx.globalCompositeOperation = my.ctx[cell].get('globalCompositeOperation');
		return this;
		};
/**
Stamp helper function - perform a 'clearWithBackground' method draw
@method clearWithBackground
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.clearWithBackground = function(ctx, cell){
		var c = my.cell[cell],
			bc = c.get('backgroundColor'),
			cx = my.ctx[cell],
			fillStyle = cx.get('fillStyle'),
			strokeStyle = cx.get('strokeStyle'),
			ga = cx.get('globalAlpha');
		this.prepareShape(ctx, cell);
		ctx.fillStyle = bc;
		ctx.strokeStyle = bc;
		ctx.globalAlpha = 1;
		ctx.stroke();
		ctx.fill(my.ctx[this.context].get('winding'));
		ctx.fillStyle = fillStyle;
		ctx.strokeStyle = strokeStyle;
		ctx.globalAlpha = globalAlpha;
		return this;
		};
/**
Stamp helper function - perform a 'fill' method draw
@method fill
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.fill = function(ctx, cell){
		if(this.get('closed')){
			this.prepareShape(ctx, cell);
			ctx.fill(my.ctx[this.context].get('winding'));
			this.addMarks(ctx, cell);
			}
		return this;
		};
/**
Stamp helper function - perform a 'draw' method draw
@method draw
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.draw = function(ctx, cell){
		this.prepareShape(ctx, cell);
		ctx.stroke();
		this.addMarks(ctx, cell);
		return this;
		};
/**
Stamp helper function - perform a 'drawFill' method draw
@method drawFill
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.drawFill = function(ctx, cell){
		this.prepareShape(ctx, cell);
		ctx.stroke();
		if(this.get('closed')){
			this.clearShadow(ctx, cell);
			ctx.fill(my.ctx[this.context].get('winding'));
			}
		this.addMarks(ctx, cell);
		return this;
		};
/**
Stamp helper function - perform a 'fillDraw' method draw
@method fillDraw
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.fillDraw = function(ctx, cell){
		this.prepareShape(ctx, cell);
		if(this.get('closed')){
			ctx.fill(my.ctx[this.context].get('winding'));
			this.clearShadow(ctx, cell);
			}
		ctx.stroke();
		this.addMarks(ctx, cell);
		return this;
		};
/**
Stamp helper function - perform a 'sinkInto' method draw
@method sinkInto
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.sinkInto = function(ctx, cell){
		this.prepareShape(ctx, cell);
		if(this.get('closed')){
			ctx.fill(my.ctx[this.context].get('winding'));
			}
		ctx.stroke();
		this.addMarks(ctx, cell);
		return this;
		};
/**
Stamp helper function - perform a 'floatOver' method draw
@method floatOver
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.floatOver = function(ctx, cell){
		this.prepareShape(ctx, cell);
		ctx.stroke();
		if(this.get('closed')){
			ctx.fill(my.ctx[this.context].get('winding'));
			}
		this.addMarks(ctx, cell);
		return this;
		};
/**
Stamp helper function - perform a 'none' method draw. This involves setting the &lt;canvas&gt; element's context engine's values with this sprite's context values and defining the sprites path, on the canvas, but not drawing (fill stroke) the sprite.
@method none
@param {Object} ctx JavaScript context engine for Cell's &lt;canvas&gt; element
@param {String} cell CELLNAME string of Cell to be drawn on; by default, will use the Cell associated with this sprite's Group object
@return This
@chainable
@private
**/
	my.Path.prototype.none = function(ctx, cell){
		this.prepareShape(ctx, cell);
		return this;
		};
/**
@method getFullPointList
@return Array containing POINTNAME Strings of all Point objects associated with this Path object
**/
	my.Path.prototype.getFullPointList = function(){
		var myPointList = [],
			search = new RegExp(this.name + '_.*');
		for(var i=0, z=my.pointnames.length; i<z; i++){
			if(search.test(my.pointnames[i])){
				myPointList.push(my.pointnames[i]);
				}
			}
		return myPointList;
		};
/**
@method getFullLinkList
@return Array containing LINKNAME Strings of all Link objects associated with this Path object
**/
	my.Path.prototype.getFullLinkList = function(){
		var myLinkList = [],
			search = new RegExp(this.name + '_.*');
		for(var i=0, z=my.linknames.length; i<z; i++){
			if(search.test(my.linknames[i])){
				myLinkList.push(my.linknames[i]);
				}
			}
		return myLinkList;
		};
/**
Calculate and return Path object's path length

Accuracy of returned value depends on the setting of the __precision__ attribute; lower precision is less accurate for curves
@method getPerimeterLength
@param {Boolean} [force] If set to true, forces a complete recalculation
@return Path length, in pixels
**/
	my.Path.prototype.getPerimeterLength = function(force){
		if(force || !this.get('perimeterLength') || this.get('linkDurations').length === 0){
			this.buildPositions();
			}
		return this.get('perimeterLength');
		};
/**
Helper function - calculate the positions and lengths of the Path's constituent Point and Link objects
@method buildPositions
@return This
@chainable
@private
**/
	my.Path.prototype.buildPositions = function(){
		var linkList = this.get('linkList'),
			linkDurations = [],
			cumLen = 0, 
			len, 
			myLink,
			tPos;
		for(var i=0, z=linkList.length; i<z; i++){
			my.link[linkList[i]].setPositions();
			}
		for(var i=0, z=linkList.length; i<z; i++){
			myLink = my.link[linkList[i]];
			tPos = myLink.get('positions');
			len = tPos[tPos.length - 1].cumulativeLength;
			cumLen += len;
			linkDurations.push(cumLen);
			}
		for(var i=0, z=linkList.length; i<z; i++){
			linkDurations[i] /= cumLen;
			}
		my.Base.prototype.set.call(this, {
			perimeterLength: cumLen,
			linkDurations: linkDurations,
			});
		return this;
		};
/**
Calculate coordinates of point at given distance along the Shape sprite's path
@method getPerimeterPosition
@param {Number} [val] Distance along path, between 0 (start) and 1 (end); default: 1
@param {Boolean} [steady] Steady flag - if true, return 'steady calculation' coordinates; otherwise return 'simple calculation' coordinates. Default: true
@param {Boolean} [roll] Roll flag - if true, return tangent angle (degrees) at that point along the path. Default: false
@param {Boolean} [local] Local flag - if true, return coordinate Vector relative to Sprite start parameter; otherwise return Cell coordinate Vector. Default: false
@return Vector coordinates
**/
	my.Path.prototype.getPerimeterPosition = function(val, steady, roll, local){
		val = (my.isa(val,'num')) ? val : 1;
		steady = (my.isa(steady,'bool')) ? steady : true;
		roll = (my.isa(roll,'num') && roll) ? true : roll;
		roll = (my.isa(roll,'bool')) ? roll : false;
		local = (my.isa(local,'bool')) ? local : false;
		var	myLink,
			linkVal,
			linkList,
			linkDurations,
			before,
			bVal,
			after,
			aVal,
			here,
			angle;
		this.getPerimeterLength();
		linkList = this.get('linkList')
		linkDurations = this.get('linkDurations');
		for(var i=0, z=linkList.length; i<z; i++){
			myLink = my.link[linkList[i]];
			if(linkDurations[i] >= val){
				if(i === 0){
					linkVal = val/linkDurations[i];
					}
				else{
					linkVal = ((val-linkDurations[i-1])/(linkDurations[i]-linkDurations[i-1]));
					}
				linkVal = (linkVal < 0) ? 0 : ((linkVal > 1) ? 1 : linkVal);
				bVal = (linkVal-0.0000001 < 0) ? 0 : linkVal-0.0000001;
				aVal = (linkVal+0.0000001 > 1) ? 1 : linkVal+0.0000001;
				if(steady){
					if(roll){
						before = (local) ? myLink.getLocalSteadyPositionOnLink(bVal) : myLink.getSteadyPositionOnLink(bVal);
						after = (local) ? myLink.getLocalSteadyPositionOnLink(aVal) : myLink.getSteadyPositionOnLink(aVal);
						here = (local) ? myLink.getLocalSteadyPositionOnLink(linkVal) : myLink.getSteadyPositionOnLink(linkVal);
						angle = Math.atan2(after.y-before.y, after.x-before.x)/my.radian;
						return {x:here.x, y:here.y, r:angle};
						}
					else{
						return (local) ? myLink.getLocalSteadyPositionOnLink(linkVal) : myLink.getSteadyPositionOnLink(linkVal);
						}
					}
				else{
					if(roll){
						before = (local) ? myLink.getLocalPositionOnLink(bVal) : myLink.getPositionOnLink(bVal);
						after = (local) ? myLink.getLocalPositionOnLink(aVal) : myLink.getPositionOnLink(aVal);
						here = (local) ? myLink.getLocalPositionOnLink(linkVal) : myLink.getPositionOnLink(linkVal);
						angle = Math.atan2(after.y-before.y, after.x-before.x)/my.radian;
						return {x:here.x, y:here.y, r:angle};
						}
					else{
						return (local) ? myLink.getLocalPositionOnLink(linkVal) : myLink.getPositionOnLink(linkVal);
						}
					}
				}
			}
		return false;
		};
/**
Check a set of coordinates to see if any of them fall within this sprite's path - uses JavaScript's _isPointInPath_ function

Argument object contains the following attributes:

* __tests__ - an array of Vector coordinates to be checked; alternatively can be a single Vector
* __x__ - X coordinate
* __y__ - Y coordinate

Either the 'tests' attribute should contain a Vector, or an array of vectors, or the x and y attributes should be set to Number values
@method checkHit
@param {Object} items Argument object
@return The first coordinate to fall within the sprite's path; false if none fall within the path
**/
	my.Path.prototype.checkHit = function(items){
		items = my.safeObject(items);
		var pad = my.pad[items.pad] || my.pad[my.currentPad],
			cell = my.cell[pad.current].name,
			ctx = my.context[pad.current],
			tests = (my.xt(items.tests)) ? items.tests : [{x: (items.x || false), y: (items.y || false)}],
			result = false,
			winding,
			closed = this.get('closed');
		this.prepareShape(ctx, cell);
		for(var i=0, z=tests.length; i<z; i++){
			result = ctx.isPointInPath(tests[i].x, tests[i].y);
			if(result){
				break;
				}
			}
		return (result) ? tests[i] : false;
		};
/**
Collision detection helper function

Parses the collisionPoints array to generate coordinate Vectors representing the sprite's collision points
@method buildCollisionVectors
@param {Array} [items] Array of collision point data
@return This
@chainable
@private
**/
	my.Path.prototype.buildCollisionVectors = function(items){
		if(my.xt(my.d.Path.fieldChannel)){
			var	p = (my.xt(items)) ? this.parseCollisionPoints(items) : this.collisionPoints,
				myAdvance,
				point,
				currentPos = 0;
			this.collisionVectors = [];
			for(var i=0, z=p.length; i<z; i++){
				if(my.isa(p[i], 'num') && p[i] >= 0){
					if(p[i] > 1){
						//regular points along the path
						myAdvance = 1/p[i];
						for(var j=0; j<p[i]; j++){
							point = this.getPerimeterPosition(currentPos, true, false, true);
							this.collisionVectors.push(point);
							currentPos += myAdvance;
							}
						}
					else{
						//a point at a specific position on the path
						point = this.getPerimeterPosition(p[i], true, false, true);
						this.collisionVectors.push(point);
						}
					}
				else if(my.isa(p[i], 'str')){
					switch(p[i]) {
						case 'start' : 	this.collisionVectors.push(my.newVector()); break;
						}
					}
				else if(my.isa(p[i], 'vector')){
					this.collisionVectors.push(p[i]);
					}
				}
			}
		return this;
		};

/**
# Point
	
## Instantiation

* Objects created via Path factories
* scrawl.makeCartesianPoints() - deprecated
* scrawl.makePolarPoints() - deprecated

## Purpose

* Defines a movable point within a Path sprite object
* Acts as a coordinate vector for Link drawing

Path creation factories will all create Point objects automatically as part of the generation process. Point objects will be named regularly, depending on the factory:

* scrawl.makeLine(): SPRITENAME_p1 (start point), SPRITENAME_p2 (end point)
* scrawl.makeQuadratic(): SPRITENAME_p1 (start point), SPRITENAME_p2 (control point), SPRITENAME_p3 (end point)
* scrawl.makeBezier(): SPRITENAME_p1 (start point), SPRITENAME_p2 (first control point), SPRITENAME_p3 (second control point), SPRITENAME_p4 (end point)
* scrawl.makeRegularShape(): each angle point is numbered consecutively, starting at SPRITENAME_p1
* scrawl.makePath(): points are numbered consecutively, beginning from SPRITENAME_p1 at the start of the path; the end point of a line, quadratic curve or bezier curve will also act as the start point for the next line or curve

## Access

* scrawl.point.POINTNAME - for the Point object

@class Point
@constructor
@extends Base
@param {Object} [items] Key:value Object argument for setting attributes
**/		
	my.Point = function(items){
		items = my.safeObject(items);
		my.Base.call(this, items);
		var local = (my.xt(items.local)) ? items.local : {};
		this.sprite = items.sprite || '';
		this.local = items.local || my.newVector({
			x: items.startX || items.currentX || local.x || 0,
			y: items.startY || items.currentY || local.y || 0,
			});
		this.startLink = items.startLink || '';
		this.fixed = items.fixed || false;
		if(my.xto([items.angle,items.distance])){
			this.setPolar(items);
			}
		my.point[this.name] = this;
		my.pushUnique(my.pointnames, this.name);
		if(this.sprite && my.sprite[this.sprite].type === 'Path'){
			my.pushUnique(my.sprite[this.sprite].pointList, this.name);
			}
		return this;
		}
	my.Point.prototype = Object.create(my.Base.prototype);
/**
@property type
@type String
@default 'Point'
@final
**/		
	my.Point.prototype.type = 'Point';
	my.Point.prototype.classname = 'pointnames';
	my.d.Point = {
/**
SPRITENAME String of point object's parent sprite
@property sprite
@type String
@default ''
**/
		sprite: '',
/**
Point's coordinate Vector - generally the Vector marks the Point's position (in pixels) from the Parent sprite's start coordinates, though this can be changed by setting the __fixed__ attribute to true.

The following argument attributes can be used to initialize, set and get this attribute's component values:

* __startX__ or __currentX__ to set the x coordinate value
* __startY__ or __currentY__ to set the y coordinate value
@property local
@type Vector
@default zero value Vector
**/
		local: my.newVector(),
/**
LINKNAME of Link object for which this Point acts as the start coordinate; generated automatically by the Shape creation factory functions
@property startLink
@type String
@default ''
@private
**/
		startLink: '',
/**
Fixed attribute is used to fix the Point to a specific Cell coordinate Vector (true), or to a Sprite start Vector (SPRITENAME). Default action is to treat the Point as local to its parent Sprite's start coordinate
@property fixed
@type Boolean
@default false
**/
		fixed: false,
		};
	my.mergeInto(my.d.Point, my.d.Base);
/**
Augments Base.set(), to allow users to set the local attributes using startX, startY, currentX, currentY, distance, angle
@method set
@param {Object} items Object consisting of key:value attributes
@return This
@chainable
**/
	my.Point.prototype.set = function(items){
		my.Base.prototype.set.call(this, items);
		items = my.safeObject(items);
		var local = (my.xt(items.local)) ? items.local : {};
		if(my.xto([items.distance, items.angle])){
			this.setPolar(items);
			}
		else if(my.xto([items.startX, items.startY, items.currentX, items.currentY, items.local])){
			this.local.x = (my.xt(items.startX)) ? items.startX : ((my.xt(items.currentX)) ? items.currentX : ((my.xt(local.x)) ? local.x : this.local.x));
			this.local.y = (my.xt(items.startY)) ? items.startY : ((my.xt(items.currentY)) ? items.currentY : ((my.xt(local.y)) ? local.y : this.local.y));
			}
		return this;
		};
/**
Add values to the local attribute. Permitted attributes of the argument object include:

* __startX__, __currentX__ - added to _local.x
* __startY__, __currentY__ - added to _local.y
* __distance__ - recalculates the _local_ vector to set its values to equal vector's current magnitude + distance (in pixels)
* __angle__ - recalculates the _local_ vector to rotate it by the angle value (in degrees)
@method setDelta
@param {Object} items Object consisting of key:value attributes
@return This
@chainable
**/
	my.Point.prototype.setDelta = function(items){
		var m,
			d, 
			a,
			local = (my.xt(items.local)) ? items.local : {};
		items = my.safeObject(items);
		if(my.xto([items.startX,items.startY,items.currentX,items.currentY, items.local])){
			this.local.x += (my.xt(items.startX)) ? items.startX : ((my.xt(items.currentX)) ? items.currentX : ((my.xt(local.x)) ? local.x : 0));
			this.local.y += (my.xt(items.startY)) ? items.startY : ((my.xt(items.currentY)) ? items.currentY : ((my.xt(local.y)) ? local.y : 0));
			}
		if(my.xt(items.distance)){
			m = this.local.getMagnitude()
			this.local.scalarMultiply((items.distance + m)/m);
			}
		if(my.xt(items.angle)){
			d = this.local.getMagnitude();
			a = Math.atan2(this.local.y, this.local.x);
			a += (items.angle * my.radian);
			this.local.x = d * Math.cos(a);
			this.local.y = d * Math.sin(a);
			}
		return this;
		};
/**
Sets the local attribute using angle and/or distance parameters:

* __distance__ - calculates the _local_ vector to set its values to equal vector's current magnitude + distance (in pixels)
* __angle__ - calculates the _local_ vector to rotate it by the angle value (in degrees)
@method setPolar
@param {Object} items Object consisting of key:value attributes
@return This
@chainable
**/
	my.Point.prototype.setPolar = function(items){
		var m,
			d,
			a;
		my.Base.prototype.set.call(this, items);
		items = my.safeObject(items);
		if(my.xta([items.distance,items.angle])){
			a = items.angle * my.radian;
			this.local.x = items.distance * Math.cos(a);
			this.local.y = items.distance * Math.sin(a);
			}
		else{
			if(my.xt(items.distance)){
				m = this.local.getMagnitude();
				m = (my.xt(m) && m > 0.0000001) ? m : 1;
				this.local.scalarMultiply(items.distance/m);
				}
			if(my.xt(items.angle)){
				d = this.local.getMagnitude();
				a = items.angle * my.radian;
				this.local.x = d * Math.cos(a);
				this.local.y = d * Math.sin(a);
				}
			}
		return this;
		};
/**
Retrieve Point object's coordinates, together with additional data

* Coordinate reference frame determined by the value of Point.local
* Coordinate values determined by setting of Point.fixed, Point.local and the parent Shape object's position and settings

Return object has the following attributes:

* __name__ - Point.name
* __current__ - coordinate Vector
* __startLink__ - Point.startLink

@method getData
@return Result object
@private
**/
	my.Point.prototype.getData = function(){
		var c,
			s = my.sprite[this.sprite],
			myPivot,
			d,
			fixed = this.fixed,
			scale = s.scale;
		if(my.xt(this.local) && this.local.type === 'Vector'){
			c = this.local.getVector();
			if(my.isa(fixed,'str') && (my.contains(my.spritenames, fixed) || my.contains(my.pointnames, fixed))){
				myPivot = my.sprite[fixed] || my.point[fixed];
				if(myPivot.type === 'Point'){
					c = myPivot.local.getVector().scalarMultiply(scale || 1);
					}
				else{
					c = (myPivot.type === 'Particle') ? myPivot.get('place') : myPivot.start.getVector();
					}
				}
			else if(!fixed){
				c.scalarMultiply(scale || 1);
				}
			else{
				d = (c.getMagnitude() !== 0) ? s.start.getVector() : my.newVector();
				c.vectorSubtract(d);
				c.scalarMultiply(scale || 1);
				c.rotate(-s.roll);
				}
			return {
				name: this.name,
				current: c,
				startLink: this.startLink,
				};
			}
		return false;
		};
/**
Retrieve Point object's coordinates

* Coordinate reference frame determined by the value of Point.local
* Coordinate values determined by setting of Point.fixed, Point.local and the parent Shape object's position and settings
@method getCurrentCoordinates
@return Coordinate Vector
**/
	my.Point.prototype.getCurrentCoordinates = function(){
		return this.getData().current;
		};
/**
Set Point.fixed attribute
@method setToFixed
@param {Mixed} items - either a coordinate Vector; or an Object with x and y attributes; or a Number representing the horizontal coordinate, in pixels, from &lt;canvas&gt; element's left edge; or a pivot SPRITENAME, POINTNAME or PARTICLENAME String
@param {Number} [y] - vertical coordinate, in pixels, from &lt;canvas&gt; element's top edge
@return This
@chainable
**/
	my.Point.prototype.setToFixed = function(items, y){
		var myX,
			myY;
		if(my.isa(items,'str')){
			this.fixed = items;
			}
		else{
			myX = (my.isa(items,'obj') && my.xt(items.x)) ? items.x : ((my.isa(items,'num')) ? items : 0);
			myY = (my.isa(items,'obj') && my.xt(items.y)) ? items.y : ((my.isa(y,'num')) ? y : 0);
			this.local.set({
				x: myX,
				y: myY,
				});
			this.fixed = true;
			}
		return this;
		};

/**
# Link
	
## Instantiation

* Objects created via Path factories

## Purpose

* Defines the type of line to be drawn between two Point objects
* Can be of the form (species): line, bezier, quadratic
* Posesses actions: 'add', 'move' (to not draw a line), 'close' (end Point is Path object's startPoint), 'end' (for non-closed Path objects)
* Makes use of additional control points to determine curves

## Access

* scrawl.link.LINKNAME - for the Link object

@class Link
@constructor
@extends Base
@param {Object} [items] Key:value Object argument for setting attributes
@private
**/		
	my.Link = function(items){
		items = my.safeObject(items);
		my.Base.call(this, items);
		my.Base.prototype.set.call(this, items);
		this.startPoint = items.startPoint || my.d.Link.startPoint;
		this.sprite = (my.xt(my.point[this.startPoint])) ? my.point[this.startPoint].sprite : my.d.Link.sprite;
		this.endPoint = items.endPoint || my.d.Link.endPoint;
		this.species = items.species || my.d.Link.species;
		this.action = items.action || my.d.Link.action;
		my.link[this.name] = this;
		my.pushUnique(my.linknames, this.name);
		this.setPositions();
		if(this.startPoint && this.sprite && this.action === 'add'){
			my.pushUnique(my.sprite[this.sprite].linkList, this.name);
			}
		return this;
		}
	my.Link.prototype = Object.create(my.Base.prototype);
/**
@property type
@type String
@default 'Link'
@final
**/		
	my.Link.prototype.type = 'Link';
	my.Link.prototype.classname = 'linknames';
	my.d.Link = {
/**
Type of link - permitted values include: 'line', 'quadratic', 'bezier'
@property species
@type String
@default ''
**/
		species: '',
/**
POINTNAME of start Point object - used by line, quadratic and bezier links
@property startPoint
@type String
@default ''
**/
		startPoint: '',
/**
SPRITENAME of this Link's parent sprite object
@property sprite
@type String
@default ''
**/
		sprite: '',
/**
POINTNAME of end Point object - used by line, quadratic and bezier links
@property endPoint
@type String
@default ''
**/
		endPoint: '',
/**
POINTNAME of first control Point object - used by quadratic and bezier links
@property controlPoint1
@type String
@default ''
**/
		controlPoint1: '',
/**
POINTNAME of second control Point object - used by bezier links
@property controlPoint2
@type String
@default ''
**/
		controlPoint2: '',
/**
Link object's action - permitted values include: 'add', 'move', 'close', 'end'
@property startLink
@type String
@default 'add'
**/
		action: 'add',
/**
Link length - this value will be affected by the value of the parent Sprite object's __precision__ attribute
@property length
@type Number
@default 0
@private
**/
		length: 0,
/**
Positions Array along the length of the Link's path - these values will be affected by the value of the parent Sprite object's __precision__ attribute
@property positions
@type Array
@default []
@private
**/
		positions: [],
		};
	my.mergeInto(my.d.Link, my.d.Base);
/**
Augments Base.set()
@method set
@param {Object} items Object consisting of key:value attributes
@return This
@chainable
**/
	my.Link.prototype.set = function(items){
		my.Base.prototype.set.call(this, items);
		items = my.safeObject(items);
		if(my.isa(items.sprite,'str') && items.sprite !== this.sprite && this.sprite){
			my.removeItem(my.sprite[this.sprite].linkList, this.name);
			}
		if(my.isa(items.action,'str') && this.sprite && my.contains(my.spritenames, this.sprite)){
			if(items.action === 'add'){
				my.pushUnique(my.sprite[this.sprite].linkList, this.name);
				}
			else{
				my.removeItem(my.sprite[this.sprite].linkList, this.name);
				}
			}
		return this;
		};
/**
Position calculation helper function
@method pointOnLine
@param {Point} origin Start Point for calculation
@param {Point} destination End Point for calculation
@param {Number} val Distance between start and end points, where 0 = start and 1 = end
@return Coordinate Vector
@private
**/
	my.Link.prototype.pointOnLine = function(origin, destination, val){
		if(origin && destination && my.isa(val,'num')){
			var a = destination.getVectorSubtract(origin),
				b = a.getScalarMultiply(val),
				c = b.getVectorAdd(origin);
			return c;
			}
		return false;
		};
/**
Position calculation helper function

Result Object contains the following attributes:

* __start__ - Link.start Point object's local Vector
* __end__ - Link.end Point object's local Vector
* __control1__ - Link.controlPoint1 Point object's local Vector
* __control2__ - Link.controlPoint2 Point object's local Vector
@method getPointCoordinates
@return Result Object
@private
**/
	my.Link.prototype.getPointCoordinates = function(){
		var result = {
			start: (this.startPoint) ? my.point[this.startPoint].getCurrentCoordinates() : my.newVector(),
			end: (this.endPoint) ? my.point[this.endPoint].getCurrentCoordinates() : my.newVector(),
			};
		if(my.contains(['quadratic', 'bezier'], this.species)){
			result.control1 = (this.controlPoint1) ? my.point[this.controlPoint1].getCurrentCoordinates() : my.newVector();
			if(this.species === 'bezier'){
				result.control2 = (this.controlPoint2) ? my.point[this.controlPoint2].getCurrentCoordinates() : my.newVector();
				}
			}
		return result;
		};
/**
Position calculation helper function
@method getLocalPositionOnLink
@param {Number} [val] - distance along link, where 0 = start and 1 = end
@return coordinate Vector
@private
**/
	my.Link.prototype.getLocalPositionOnLink = function(val){
		val = (my.isa(val, 'num')) ? val : 1;
		var pts = this.getPointCoordinates(),
			mid1,
			mid2, 
			fst1, 
			fst2, 
			fst3, 
			sec1, 
			sec2,
			result;
		switch(this.species){
			case 'line':
				result = this.pointOnLine(pts.start, pts.end, val);
				break;
			case 'quadratic':
				mid1 = this.pointOnLine(pts.start, pts.control1, val);
				mid2 = this.pointOnLine(pts.control1, pts.end, val);
				result = this.pointOnLine(mid1, mid2, val);
				break;
			case 'bezier':
				fst1 = this.pointOnLine(pts.start, pts.control1, val);
				fst2 = this.pointOnLine(pts.control1, pts.control2, val);
				fst3 = this.pointOnLine(pts.control2, pts.end, val);
				sec1 = this.pointOnLine(fst1, fst2, val);
				sec2 = this.pointOnLine(fst2, fst3, val);
				result = this.pointOnLine(sec1, sec2, val);
				break;
			default: 
				result = pts.end || pts.start || my.newVector();
			}
		return result;
		};
/**
Position calculation helper function
@method getPositionOnLink
@param {Number} [val] - distance along link, where 0 = start and 1 = end
@return coordinate Vector
@private
**/
	my.Link.prototype.getPositionOnLink = function(val){
		var mySprite = my.sprite[this.sprite],
			scale = mySprite.scale,
			roll = mySprite.roll,
			result;
		if(my.isa(val, 'num')){
			result = this.getLocalPositionOnLink(val);
			return result.scalarMultiply(scale).rotate(roll).vectorAdd(mySprite.start);
			}
		return false;
		};
/**
Position calculation helper function
@method getLocalSteadyPositionOnLink
@param {Number} [val] - distance along link, where 0 = start and 1 = end
@return coordinate Vector
@private
**/
	my.Link.prototype.getLocalSteadyPositionOnLink = function(val){
		val = (my.isa(val, 'num')) ? val : 1;
		var	s,
			d, 
			dPos,
			precision = my.sprite[this.sprite].get('precision'),
			positions = this.positions,
			length = this.length,
			distance = length * val;
		distance = (distance > positions[precision].cumulativeLength) ? positions[precision].cumulativeLength : ((distance < 0) ? 0 : distance);
		for(var i=1; i<=precision; i++){
			if(distance <= positions[i].cumulativeLength){
				s = positions[i-1].p;
				d = positions[i].p.getVectorSubtract(s);
				dPos = (distance - positions[i-1].cumulativeLength)/positions[i].length;
				return d.scalarMultiply(dPos).vectorAdd(s);
				}
			}
		return false;
		};
/**
Position calculation helper function
@method getSteadyPositionOnLink
@param {Number} [val] - distance along link, where 0 = start and 1 = end
@return coordinate Vector
@private
**/
	my.Link.prototype.getSteadyPositionOnLink = function(val){
		var mySprite = my.sprite[this.sprite],
			d = this.getLocalSteadyPositionOnLink(val);
			d.scalarMultiply(mySprite.scale).rotate(mySprite.roll).vectorAdd(mySprite.start);
		return d;
		};
/**
Returns length of Link, in pixels
@method getLength
@return Length, in pixels
**/
	my.Link.prototype.getLength = function(){
		this.setPositions();
		return this.length;
		};
/**
(re)Calculate the Link object's __positions__ array
@method setPositions
@param {Number} [val] - precision level for the calculation. Default: parent Shape object's precision value
@return This
@chainable
**/
	my.Link.prototype.setPositions = function(val){
		var pts = this.getPointCoordinates(),
			precision = (my.isa(val, 'num') && val > 0) ? val : (my.sprite[this.sprite].get('precision')),
			step = 1/precision, 
			pos, 
			here, 
			vHere, 
			dist, 
			d,
			cumLen = 0,
			cur = pts.start.getVector(),
			sprite = my.sprite[this.sprite],
			temp = sprite.roll;
		this.positions = [];
		this.positions.push({
			p: cur.getVector(),
			length: 0,
			cumulativeLength: cumLen,
			});
		sprite.set({roll: 0,});
		for(var i=0; i<precision; i++){
			pos = step * (i + 1);
			here = this.getPositionOnLink(pos);
			here.vectorSubtract(sprite.start);
			vHere = here.getVector();
			dist = here.vectorSubtract(cur).getMagnitude();
			cur = vHere;
			cumLen += dist;
			this.positions.push({
				p: cur.getVector(),
				length: dist,
				cumulativeLength: cumLen,
				});
			}
		this.length = this.positions[precision].cumulativeLength;
		sprite.roll = temp;
		return this;
		};
/**
Path object drawing helper function

_Note: this function is recursive_

@method sketch
@param {Object} ctx Sprite Cell's &lt;canvas&gt; element's context engine Object
@return True (eventually)
@private
**/
	my.Link.prototype.sketch = function(ctx){
		var myEnd, 
			myCon1, 
			myCon2,
			myResult;
		switch(this.action){
			case 'close' :
				ctx.closePath();
				break;
			case 'move' :
				try{
					myEnd = my.point[this.endPoint].getData();
					ctx.moveTo(
						myEnd.current.x, 
						myEnd.current.y
						);
					}
				catch(e){
					return true;
					}
				break;
			case 'add' :
				try{
					switch(this.species){
						case 'line' :
							myEnd = my.point[this.endPoint].getData();
							ctx.lineTo(
								myEnd.current.x, 
								myEnd.current.y
								);
							break;
						case 'quadratic' :
							myCon1 = my.point[this.get('controlPoint1')].getData();
							myEnd = my.point[this.endPoint].getData();
							ctx.quadraticCurveTo(
								myCon1.current.x, 
								myCon1.current.y,
								myEnd.current.x, 
								myEnd.current.y
								);
							break;
						case 'bezier' :
							myCon1 = my.point[this.get('controlPoint1')].getData();
							myCon2 = my.point[this.get('controlPoint2')].getData();
							myEnd = my.point[this.endPoint].getData();
							ctx.bezierCurveTo(
								myCon1.current.x, 
								myCon1.current.y,
								myCon2.current.x, 
								myCon2.current.y,
								myEnd.current.x, 
								myEnd.current.y
								);
							break;
						default : 
							return true;
						}
					}
				catch(e){
					return true;
					}
				break;
			default :
				return true;
				break;
			}
		try{
			myResult = my.link[my.point[this.endPoint].startLink].sketch(ctx);
			}
		catch(e){
			return true;
			}
		return true;
		};

	return my;
	}(scrawl));
