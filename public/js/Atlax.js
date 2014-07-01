/*
 * @description - Clase nucleo del proyecto
 */
!function( window, exports, require ) {
	/**
	 * Imports
	 */
	var Cache = require( "Cache" );
	var $ = require( "Utils" );

	/**
	 * Metodos privados
	 */
	function addImageToCtxCanvas( image, x, y, width, height ) {
		this.ctx.drawImage( image,
			x, y,
			width  || image.width,
			height || image.height
		);
	}

	/**
	 * Metodos publicos
	 */
	function addImageToAtlax( fileImage, x, y, width, height ) {
		var _self = this;

		var fileImageChached = this.CacheAtlax.get( fileImage.name );

		if( fileImageChached !== undefined ) {
			if( fileImageChached.infoFile.lastModDate < fileImage.lastModifiedDate ) {
				this.CacheAtlax.set( fileImage.name, {
					infoFile: {
						type: fileImage.type,
						size: fileImage.size,
						lastModDate: fileImage.lastModifiedDate
					}
				});
			}

			addImageToCtxCanvas.call( _self, fileImageChached.infoCtx.image, x, y, width, height );
			return;
		}

		var reader = new FileReader();
		reader.onload = (function( fileImage, x, y, width, height ) {
			return function( e ) {
				var image = $.createImage( e.target.result, function() {
					addImageToCtxCanvas.call( _self, this, x, y, width, height );
				});

				_self.CacheAtlax.set( fileImage.name, {
					infoFile: {
						type: fileImage.type,
						size: fileImage.size,
						lastModDate: fileImage.lastModifiedDate
					},
					infoCtx: {
						image: image,
						x: x,
						y: y,
						width: width,
						height: height
					}
				});
			};
		})( fileImage, x, y, width, height );
		reader.readAsDataURL( fileImage );

		return reader;
	}

	function getMousePos( event ) {
		var rect = this.canvas.getBoundingClientRect();
			
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	/**
	 * @Constructor
	 */
	function Atlax( config ) {
		var _self = this;

		this.CacheAtlax = new Cache();
		this.CacheFile = new Cache();

		this.canvas = $.get( config.id );
		this.ctx = this.canvas.getContext( "2d" );

		this.addImageToAtlax = addImageToAtlax;
		this.getMousePos = getMousePos;

		if( config.width )
			this.canvas.width = config.width;
		if( config.height )
			this.canvas.height = config.height;

		this.canvas.addEventListener( 'dragover', function( event ) {
			event.stopPropagation();
			event.preventDefault();
		}, false );

		if( config.drop ) {
			this.canvas.addEventListener( 'drop', function( event ) {
				event.stopPropagation();
				event.preventDefault();
				config.drop.apply( _self, arguments );
			}, false );
		}
	}

	exports.Atlax = Atlax;
}( window, module.exports, module.require );