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

				// Set canvas dimensions
				const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
				canvas.width = getSize('width');
				canvas.height = getSize('height');
				var pixelRatio = 3;

				// lets scale the canvas and change its CSS width/height to make it high res.
				canvas.style.width = canvas.width +'px';
				canvas.style.height = canvas.height +'px';
				canvas.width *= pixelRatio;
				canvas.height *= pixelRatio;

				
				//set frame dimention
				let canvasH = 0;
				let canvasW = 0;

				//set element dimention
				let bgPhoto = images[0];
				let texturePhoto = images[1];

				ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
				ctx.imageSmoothingEnabled = false;
				ctx.drawImage(bgPhoto.img, getX(bgPhoto, canvas.width), getY(bgPhoto, canvas.height), bgPhoto.width || bgPhoto.img.width, bgPhoto.height || bgPhoto.img.height);

				var waveImg = document.getElementById('image'+options.index);
				console.log('waveImg:', waveImg)
				//var waveImg = document.getElementById('image');
				ctx.drawImage(waveImg,options.waveX,options.waveY,765,
					60)

				ctx.filter = "brightness(110%)";
				canvasW = texturePhoto.x + texturePhoto.width
				canvasH = texturePhoto.y + texturePhoto.height

				if(options.textColor=="black") {
					ctx.filter = "brightness(110%)";
					ctx.globalAlpha = 0.2
				}else{
					ctx.filter = "brightness(50%)";
					ctx.globalAlpha = 0.1
				}
				ctx.drawImage(texturePhoto.img, getX(texturePhoto, canvas.width), getY(texturePhoto, canvas.height), texturePhoto.width || texturePhoto.img.width, texturePhoto.height || texturePhoto.img.height);

				ctx.globalAlpha = 1
				ctx.filter = "brightness(100%)";
				ctx.font = "6px OpenSans";
				ctx.fillStyle = options.textColor;

				//remove the extension
				let textToDraw = options.fileName.replace(/\.[^/.]+$/, "").toUpperCase()
				let width = ctx.measureText(textToDraw).width

				ctx.fillText(textToDraw, canvasW-width-36, canvasH-10);

				return canvas.toDataURL(options.format, options.quality);
			}));
	});

	return mergeImages;

})));
//# sourceMappingURL=index.umd.js.map