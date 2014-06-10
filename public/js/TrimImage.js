window.ImageUtils = (function( window, $, undefined ) {
	/**
	 * @description - Crea un objeto para manipular la imagen pasada por el parametro
	 * @constructor
	 *
	 * @param {image object} image - Imagen a procesar
	 * @param {function} funcLoadBack - Función back para el load de la imagen
	 */
	var ImageUtils = function( image, funcLoadBack ) {
		this.image = configureImage( image, funcLoadBack );
		this.trim = trim;
		this.trimTop = trimTop;
		this.trimBottom = trimBottom;
		// this.trimRight = trimRight;
		// this.trimLeft = trimLeft;

		return this;
	}

	function configureImage( image, funcBack ) {
		if( $.isString( image ) ) {
			return $.createImage( image, funcBack );
		}

		if( funcBack )
			image.onload = funcBack;

		return image;
	}

	/**
	 * @description - Devuelve un objeto imageData a partir de una imagen dada
	 *
	 * @param {image object} image - Objeto imagen
	 * @return {imageData object}
	 */
	function getImageData( image ) {
		var imgW = image.width,
			imgH = image.height;

		var context = $.createCanvasBack( imgW, imgH ).context;
		context.drawImage( image, 0, 0, imgW, imgH );

		return context.getImageData( 0, 0, imgW, imgH );
	}

	/**
	 * @description - Convierte un imageData object a un image object
	 *
	 * @param {imageData} imageData - Objeto con matriz de datos de la imagen
	 * @return {image object}
	 */
	function getImage( imageData, funcBack ) {
		validateImageData( imageData );
		
		var imgW = imageData.width,
			imgH = imageData.height;

		var cnvBack = $.createCanvasBack( imgW, imgH );

		var context = cnvBack.context,
			canvas = cnvBack.canvas;
		
		context.putImageData( imageData, 0, 0 );
		var image = new Image();
		image.width = imgW;
		image.height = imgH;

		if( funcBack )
			image.onload = funcBack;

		image.src = canvas.toDataURL( 'image/png' );

		return image;
	}

	/**
	 * METODOS PUBLICOS
	 *
	 * trim()
	 * trimTop()
	 * trimBottom()
	 * trimLeft()
	 * trimRight()
	 *
	 */

	/**
	 * @description - Elimina pixeles innecesarios para los bordes de la imagen
	 * @return {image object}
	 */
	function trim() {
		return getImage( _trim( getImageData( this.image ) ) );
	}

	/**
	 * @description - Elimina pixeles innecesarios para el borde superior de la imagen
	 * @return {image object}
	 */
	function trimTop() {
		return getImage( _trimTop( getImageData( this.image ) ) );
	}

	/**
	 * @description - Elimina pixeles innecesarios para el borde inferior de la imagen
	 * @return {image object}
	 */
	function trimBottom() {
		return getImage( _trimBottom( getImageData( this.image ) ) );
	}

	/**
	 * METODOS PRIVADOS
	 *
	 * _trim( imageData )
	 * _trimTop( imageData )
	 * _trimBottom( imageData )
	 * _trimLeft( imageData )
	 * _trimRight( imageData )
	 *
	 */

	/**
	 * @description - Elimina pixeles de la imagen innecesarios
	 *
	 * @param {imageData} imageData - Datos de la imagen en forma de matriz
	 * @return {imageData object}
	 */
	function _trim( imageData ) {
		validateImageData( imageData );

		var trimmedImage = _trimTop( imageData );
			trimmedImage = _trimBottom( trimmedImage );
		// trimmedImage = _trimRight( trimmedImage );
		// trimmedImage = _trimLeft( trimmedImage );

		return trimmedImage;
	}

	/**
	 * @description - Devuelve un array de datos de la imagen 
	 *
	 * @param {imageData} imageData - Matriz de datos de la imagen
	 * @return {imageData object}
	 */
	function _trimTop( imageData ) {
		validateImageData( imageData );

		var row = 0,
			len_col = imageData.width * 4,
			len_row = imageData.height;

		readImageData( "top", imageData, function( r, c ) {
			if( this.alpha() != 0 ) {
				row = r-1;
				return "break";
			}
		});

		return cutImageData( imageData, row, 0, len_row, len_col );
	}

	/**
	 * @description - Devuelve un array de datos de la imagen 
	 *
	 * @param {imageData} imageData - Matriz de datos de la imagen
	 * @return {imageData object}
	 */
	function _trimBottom( imageData ) {
		var row = 0,
			len_col = imageData.width * 4,
			len_row = imageData.height;

		readImageData( "bottom", imageData, function( r, c ) {
			if( this.alpha() == 0 ) {
				this.red( 255 );
				this.alpha( 0 );
			}

			// if( this.alpha() != 0 ) {
			// 	row = r+1;
			// 	return "break";
			// }
		});

		// return cutImageData( imageData, row, 0, len_row, len_col );
		return cutImageData( imageData, 0, 0, len_row, len_col );
	}

	function cutImageData( imageData, rowIni, colIni, rowFin, colFin ) {
		validateImageData( imageData );

		var pixels = imageData.data,
			row, col, rowCurrent;

		rowFin = rowFin == 0 ? 1 : rowFin;
		colFin = colFin == 0 ? 1 : colFin;

		var copyHeight = rowFin == rowIni ? 1 : rowFin-rowIni;

		var context = $.createCanvasBack( colFin / 4, copyHeight ).context,
			copyImageData = context.createImageData( colFin / 4, copyHeight );

		var countCopy = 0
		for( row = rowIni; row < rowFin; row++ ) {
			rowCurrent = row * colFin;

			for( col = colIni; col < colFin; col += 4, countCopy += 4 ) {
				copyImageData.data[ countCopy ]   = pixels[ rowCurrent + col ];
				copyImageData.data[ countCopy+1 ] = pixels[ rowCurrent + col+1 ];
				copyImageData.data[ countCopy+2 ] = pixels[ rowCurrent + col+2 ];
				copyImageData.data[ countCopy+3 ] = pixels[ rowCurrent + col+3 ];
			}
		}

		return copyImageData;
	}

	function readImageData( typeReader, imageData, funcBack ) {
		validateImageData( imageData );

		var pixels = imageData.data,
			row, col, rowCurrent = -1;

		var len_col = imageData.width * 4,
			len_row = imageData.height;

		var isBreak = false;

		if( typeReader.toUpperCase() === "TOP" ) {
			var rowIni = 0,
				rowFin = len_row,
				colIni = 0,
				colFin = len_col,

				interator = {
					row: 1,
					col: 4
				};

			for( row = rowIni; row < rowFin; row += interator.row ) {
				rowCurrent = row * len_col;

				for( col = colIni; col < colFin; col += interator.col ) {
					isBreak = funcBack.apply({
						red:   getAndSetForPixel([ rowCurrent + col ]),
						green: getAndSetForPixel([ rowCurrent + col+1 ]),
						blue:  getAndSetForPixel([ rowCurrent + col+2 ]),
						alpha: getAndSetForPixel([ rowCurrent + col+3 ])
					}, [row, col] );

					if ( isBreak == "break" ) {
						break;
					}
				}
				if ( isBreak == "break" ) {
					break;
				}
			}
		} else if( typeReader.toUpperCase() === "BOTTOM" ) {
			var rowIni = len_row,
				rowFin = 0,
				colIni = len_col,
				colFin = 0;

			for( row = rowIni; row >= rowFin; row-- ) {
				rowCurrent = row * colIni;

				for( col = colIni; col >= colFin; col -= 4 ) {
					isBreak = funcBack.apply({
						red:   getAndSetForPixel([ rowCurrent + col-3 ]),
						green: getAndSetForPixel([ rowCurrent + col-2 ]),
						blue:  getAndSetForPixel([ rowCurrent + col-1 ]),
						alpha: getAndSetForPixel([ rowCurrent + col ])
					}, [row, col] );

					if ( isBreak == "break" ) {
						break;
					}
				}
				if ( isBreak == "break" ) {
					break;
				}
			}
		}

		function getAndSetForPixel( pos ) {
			return function( val ) {
				if( !val ) return pixels[ pos ];

				pixels[ pos ] = val;
			};
		}

		return imageData;
	}

	function validateImageData( imageData ) {
		if( $.is( imageData ) !== "imagedata" )
			throw "ImageData Exception: No es compatible el tipo de dato";
	}

	/**
	 * test
	 */
	var imagenObject = ImageUtils( "img/ico-save.png" );
	var imagen = ImageUtils( "img/ico-save.png" ).image;
	imagen.onload = function() {
		var cax = getImageData( imagen );
		var imagen2 = getImage( readImageData( "top", cax, function( row, col ) {
			if( this.alpha() == 0 ) {
				this.red( 255 );
				this.green( 0 );
				this.blue( 0 );
				this.alpha( 255 );
				if( row > 20 ) return "break"
			}
		}) );

		imagen2.onload = function() {
			var imageData2 = getImageData( imagen2 );
			imagen2 = getImage( cutImageData( imageData2, 10, 0, imagen2.height/2, imageData2.width * 4 ) );

			document.body.appendChild( imagen );
			document.body.appendChild( imagen2 );
			document.body.appendChild( imagenObject.trim() );
		}
	};

	return ImageUtils;
})( window, Utils.Mix );