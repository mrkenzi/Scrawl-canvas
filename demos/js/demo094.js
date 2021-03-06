var mycode = function() {
	'use strict';
	//hide-start
	var testTicker = Date.now(),
		testTime = testTicker,
		testNow,
		testMessage = document.getElementById('testmessage');
	//hide-end

	//define variables
	var myGroup = scrawl.group[scrawl.pad.mycanvas.base],
		scale = 1,
		scaleMax = 1.5,
		scaleMin = 0.7,
		scaleDelta = 0.002,
		tiggy,
		myStarts = [
          scrawl.makeVector({
				x: 100,
				y: 100
			}),
          scrawl.makeVector({
				x: 300,
				y: 100
			}),
          scrawl.makeVector({
				x: 500,
				y: 100
			}),
          scrawl.makeVector({
				x: 500,
				y: 300
			}),
          scrawl.makeVector({
				x: 300,
				y: 300
			}),
          scrawl.makeVector({
				x: 100,
				y: 300
			}),
          scrawl.makeVector({
				x: 100,
				y: 500
			}),
          scrawl.makeVector({
				x: 300,
				y: 500
			}),
          scrawl.makeVector({
				x: 500,
				y: 500
			})
        ];

	//import image into scrawl library
	scrawl.getImagesByClass('demo094');

	//define entity
	tiggy = scrawl.makePicture({
		width: 200,
		height: 200,
		handleX: 'center',
		handleY: 'center',
		startX: 100,
		startY: 100,
		source: 'tiger',
	});

	//animation object
	scrawl.makeAnimation({
		fn: function() {
			if (!scrawl.isBetween(scale, scaleMax, scaleMin)) {
				scaleDelta = -scaleDelta;
			}
			scale += scaleDelta;
			tiggy.setDelta({
				roll: 1,
				scale: scaleDelta,
			});
			scrawl.clear();
			for (var i = 0, iz = myStarts.length; i < iz; i++) {
				tiggy.set({
					start: myStarts[i],
				}).stamp();
			}
			scrawl.show();

			//hide-start
			testNow = Date.now();
			testTime = testNow - testTicker;
			testTicker = testNow;
			testMessage.innerHTML = 'Milliseconds per screen refresh: ' + Math.ceil(testTime) + '; fps: ' + Math.floor(1000 / testTime) + ', ' + tiggy.scale;
			//hide-end
		},
	});
};

scrawl.loadExtensions({
	path: '../source/',
	minified: false,
	extensions: ['animation', 'images'],
	callback: function() {
		window.addEventListener('load', function() {
			scrawl.init();
			mycode();
		}, false);
	},
});
