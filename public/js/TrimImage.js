window.ImageUtils = (function( window, $, undefined ) {
	/**
	 * @description - Crea un objeto para manipula la imagen pasada por el parametro
	 * @constructor
	 *
	 * @param {image object} image - Imagen a procesar
	 */
	var ImageUtils = function( image ) {
		this.image = configureImage( image );
		this.trim = trim;
		this.trimTop = trimTop;
		// this.trimBottom = trimBottom;
		// this.trimRight = trimRight;
		// this.trimLeft = trimLeft;

		return this;
	}

	function configureImage( image ) {
		if( $.isString( image ) ) {
			return $.createImage( image );
		}

		return image;
	}

	/**
	 * @param {image Object} image
	 * @return {imageData}
	 */
	function getImageData( image ) {
		var imgW = image.width,
			imgH = image.height;

		var context = $.createCanvasBack( imgW, imgH ).context;
		context.drawImage( image, 0, 0, imgW, imgH );

		return context.getImageData( 0, 0, imgW, imgH );
	}

	/**
	 * @description - Convierte un image data a image object
	 * @method
	 *
	 * @param {imageData} imageData - Objeto con matriz de datos de la imagen
	 * @return {image object}
	 */
	function getImage( imageData ) {
		var imgW = imageData.width,
			imgH = imageData.height;

		var cnvBack = $.createCanvasBack( imgW, imgH );

		var context = cnvBack.context,
			canvas = cnvBack.canvas;
		
		context.putImageData( imageData, 0, 0 );
		var image = new Image();
		image.width = imgW;
		image.height = imgH;
		image.src = canvas.toDataURL( 'image/png' );

		return image;
	}

	/**
	 * METODOS PRIVADOS
	 */

	/**
	 * @description - Elimina pixeles de la imagen innecesarios
	 *
	 * @param {imageData} imageData - Datos de la imagen en forma de matriz
	 * @return {imageData object}
	 */
	function _trim( imageData ) {
		var trimmedImage = _trimTop( imageData );
		// trimmedImage = _trimBottom( trimmedImage );
		// trimmedImage = _trimRight( trimmedImage );
		// trimmedImage = _trimLeft( trimmedImage );

		return trimmedImage;
	}

	/**
	 * @public
	 * 
	 * @description - Elimina pixeles innecesarios para la imagen del contexto
	 * @method
	 *
	 * @return {image object}
	 */
	function trim() {
		return getImage( _trim( getImageData( this.image ) ) );
	}

	/**
	 * @description - Devuelve un array de datos de la imagen 
	 * @method
	 *
	 * @param {imageData} imageData - Matriz de datos de la imagen
	 * @return {imageData object}
	 */
	function _trimTop( imageData ) {
		var col0 = 0,
			row = 0,
			len_col = imageData.width * 4,
			len_row = imageData.height,
			top = cutImageData( imageData, row, col0, row, len_col );

		while( isEmptyRow( top ) && row <= 50 ) {
			top = null;
			row++;
			top = cutImageData( imageData, row, col0, row, len_col );
		}

		return cutImageData( imageData, row, col0, len_row, len_col );
	}

	function cutImageData( imageData, rowIni, colIni, rowFin, colFin ) {
		var pixels = imageData.data;
		var row, col, rowCurrent;

		rowFin = rowFin == 0 ? 1 : rowFin;
		colFin = colFin == 0 ? 1 : colFin;

		var context = $.createCanvasBack( colFin / 4, rowFin ).context;
		var copyImageData = context.createImageData( colFin / 4, (rowFin-rowIni) == 0 ? 1 : rowFin-rowIni );

		for( row = rowIni; row < rowFin; row++ ) {
			rowCurrent = row * colFin;

			for( col = colIni; col < colFin; col += 4 ) {
				copyImageData.data[ rowCurrent + col ]   = pixels[ rowCurrent + col ];
				copyImageData.data[ rowCurrent + col+1 ] = pixels[ rowCurrent + col+1 ];
				copyImageData.data[ rowCurrent + col+2 ] = pixels[ rowCurrent + col+2 ];
				copyImageData.data[ rowCurrent + col+3 ] = pixels[ rowCurrent + col+3 ];
			}
		}

console.log( "->>" + copyImageData.width, copyImageData.height, rowFin-rowIni );
		return copyImageData;
	}

	function isEmptyRow( imageData ) {
		var isEmpty = true,
			row, col,
			pixels = imageData.data,
			len_row = imageData.height,
			len_col = imageData.width * 4;

		for( row = 0; row < len_row; row++ ) {
			rowCurrent = row * len_col;

			for( col = 0; col < len_col; col += 4 ) {
				if( pixels[ rowCurrent + col+3 ] != 0 ) {
					isEmpty = false;
					break;
				}
			}
		}

		return isEmpty;
	}

	/**
	 * @public
	 *
	 * @description - Elimina pixeles inncesario para la parte superior de la imagen
	 * @method
	 *
	 * @return {image object}
	 */
	function trimTop() {
		return getImage( _trimTop( getImageData( this.image ) ) );
	}

	function readImageData( imageData, funcBack ) {
		var len_imgData = imageData.data.length,
			pixels = imageData.data,
			pixel,
			row, col, rowCurrent,
			red, green, blue, alpha;

		var len_col = imageData.width * 4,
			len_row = imageData.height;

		var isBreak;

		for( row = 0; row < len_row; row++ ) {
			rowCurrent = row * len_col;

			for( col = 0; col < len_col; col += 4 ) {
				pixel = {
					red:   getAndSetForPixel([ rowCurrent + col ]),
					green: getAndSetForPixel([ rowCurrent + col+1 ]),
					blue:  getAndSetForPixel([ rowCurrent + col+2 ]),
					alpha: getAndSetForPixel([ rowCurrent + col+3 ])
				};
				
				isBreak = funcBack.apply( pixel, [row, col] );

				if ( isBreak == "break" ) {
					break;
				}
			}
			if ( isBreak == "break" ) {
				break;
			}
		}

		function getAndSetForPixel( pos ) {
			return function( val ) {
				if( !val ) {
					return pixels[ pos ];
				}

				pixels[ pos ] = val;
			};
		}

		return imageData;
	}

	/**
	 * test
	 */
	var imagenObject = ImageUtils( "img/ico-save.png" );
	var imagen = ImageUtils( "img/ico-save.png" ).image;
	imagen.onload = function() {
		var cax = getImageData( imagen );
		var imagen2 = getImage( readImageData( cax, function( row, col ) {
			this.red( 255 - this.red() );
			this.green( 255 - this.green() );
			this.blue( 255 - this.blue() );
		}) );

		imagen2.onload = function() {
			var imageData2 = getImageData( imagen2 );
			// imagen2 = getImage( cutImageData( imageData2, 0, 0, imagen2.height, imageData2.width * 4 ) );

			document.body.appendChild( imagen );
			document.body.appendChild( imagen2 );
			document.body.appendChild( imagenObject.trim() );
		}
	};

	return ImageUtils;
})( window, Utils.Mix );