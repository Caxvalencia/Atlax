!function( window, undefined ) {
	if( !window.File || !window.FileReader || !window.FileList || !window.Blob ) {
		throw "Exception: No se encontro API Files";
	}

	var $ = Utils.Mix; //Encapsula la libreria de utilidades Utils.js

	window.Atlax = (function() {
		var contructor = function( config ) {
			var canvasAtlax = $.get( config.id ),
				ctxAtlax = canvasAtlax.getContext( "2d" );

			if( config.width )
				canvasAtlax.width = config.width;
			if( config.height )
				canvasAtlax.height = config.height;

			function getMousePos( event ) {
				var rect = canvasAtlax.getBoundingClientRect();
				
				return {
					x: event.clientX - rect.left,
					y: event.clientY - rect.top
				};
			}

			function addImageToAtlax( fileImage, x, y, width, height ) {
				var fileImageChached = CacheAtlax.get( fileImage.name );

				if( fileImageChached !== undefined ) {
					if( fileImageChached.infoFile.lastModDate < fileImage.lastModifiedDate ) {
						CacheAtlax.set( fileImage.name, {
							infoFile: {
								type: fileImage.type,
								size: fileImage.size,
								lastModDate: fileImage.lastModifiedDate
							}
						});
					}

					addImageToCtxCanvas( fileImageChached.infoCtx.image, x, y, width, height );
					return;
				}

				var reader = new FileReader();
				reader.onload = (function( fileImage, x, y, width, height ) {
					return function( e ) {
						var image = $.createImage( e.target.result, function() {
							addImageToCtxCanvas( this, x, y, width, height );
						});

						CacheAtlax.set( fileImage.name, {
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

			function addImageToCtxCanvas( image, x, y, width, height ) {
				ctxAtlax.drawImage( image,
					x, y,
					width  || image.width,
					height || image.height
				);
			}

			$.extend( contructor, {
				canvasAtlax: canvasAtlax,
				ctxAtlax: ctxAtlax,
				getMousePos: getMousePos,
				addImageToAtlax: addImageToAtlax
			});

			canvasAtlax.addEventListener( 'dragover', function( event ) {
				event.stopPropagation();
				event.preventDefault();
			}, false );

			if( config.drop )
				canvasAtlax.addEventListener( 'drop', function( event ) {
					event.stopPropagation();
					event.preventDefault();
					config.drop.apply( contructor, arguments );
				}, false );
		};

		return contructor;
	})();
}( window );