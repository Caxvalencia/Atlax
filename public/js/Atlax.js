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

	/**
	 * Metodos privados
	 */
	function addImageToCtx( image, x, y, width, height ) {
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
		var _self = this,
			CacheAtlax = this.CacheAtlax;

		var fileImageCached = CacheAtlax.get( fileImage.name );

		if( fileImageCached !== undefined ) {
			if( fileImageCached.infoFile.lastModDate < fileImage.lastModifiedDate ) {
				CacheAtlax.set( fileImage.name, {
					infoFile: {
						type: fileImage.type,
						size: fileImage.size,
						lastModDate: fileImage.lastModifiedDate
					}
				});
			}

			addImageToCtx.call( _self, fileImageCached.infoCtx.image, x, y, width, height );
			return;
		}

		var reader = new FileReader();
		reader.onload = (function( fileImage, x, y, width, height ) {
			return function( e ) {
				var image = $.createImage( e.target.result, function() {
					addImageToCtx.call( _self, this, x, y, width, height );
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

	exports.Atlax = Atlax;
}( window, module.exports, module.require );