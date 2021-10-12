(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.mergeImages = factory());
}(this, (function () {
	'use strict';

	// Defaults
	const defaultOptions = {
		format: 'image/png',
		quality: 0.92,
		width: undefined,
		height: undefined,
		Canvas: undefined,
		crossOrigin: undefined
	};

	const getX = (image, width) => {
		if (image.right != undefined)
			return width - (image.right + (image.width || image.img.width));
		return image.left || image.x || 0;
	}

	const getY = (image, height) => {
		if (image.bottom != undefined)
			return height - (image.bottom + (image.height || image.img.height));
		return image.top || image.y || 0;
	}

	// Return Promise
	const mergeImages = (sources = [], options = {}) => new Promise(resolve => {
		options = Object.assign({}, defaultOptions, options);

		// Setup browser/Node.js specific variables
		const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
		const Image = options.Image || window.Image;

		// Load sources
		const images = sources.map(source => new Promise((resolve, reject) => {
			// Convert sources to objects
			if (source.constructor.name !== 'Object') {
				source = { src: source };
			}

			// Resolve source and img when loaded
			var img = new Image();
			img.crossOrigin = options.crossOrigin;
			img.onerror = () => reject(new Error('Couldn\'t load image'));
			img.onload = () => resolve(Object.assign({}, source, { img }));
			img.src = source.src;
		}));

		// Get canvas context
		const ctx = canvas.getContext('2d');

		// When sources have loaded
		resolve(Promise.all(images)
			.then(images => {

				//set canvas dimention
				let canvasH = 0;
				let canvasW = 0;

				// Set canvas dimensions
				const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
				canvas.width = getSize('width');
				canvas.height = getSize('height');
				var pixelRatio = 3;
				console.log('pixelRatio:', pixelRatio)
				// lets scale the canvas and change its CSS width/height to make it high res.
				canvas.style.width = canvas.width +'px';
				canvas.style.height = canvas.height +'px';
				canvas.width *= pixelRatio;
				canvas.height *= pixelRatio;
				// Draw images to canvas
				images.forEach(image => {
					console.log('image:', image)
					if(image.src == "../img/canvas.png"){
						console.log('image:', image)
						ctx.filter = "brightness(110%)";
						canvasW = image.x + image.width
						canvasH = image.y + image.height
					}else{
						ctx.filter = "brightness(100%)";
					}
				// Now that its high res we need to compensate so our images can be drawn as normal, by scaling everything up by the pixelRatio.
					ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
					ctx.globalAlpha = image.opacity ? image.opacity : 1;
                    ctx.imageSmoothingEnabled = false;
					return ctx.drawImage(image.img, getX(image, canvas.width), getY(image, canvas.height), image.width || image.img.width, image.height || image.img.height);
				});
				

				ctx.font = "14px Arial";
				var width = ctx.measureText("Hello World").width
				console.log('width:', width)
				ctx.fillText("Hello World", canvasW-width, canvasH);

				var qwfqwf = document.getElementById('image');
				ctx.drawImage(qwfqwf,  260, 243, 457, 181)
				console.log('qwfqwf:', qwfqwf)

				return canvas.toDataURL(options.format, options.quality);
			}));
	});

	return mergeImages;

})));
//# sourceMappingURL=index.umd.js.map