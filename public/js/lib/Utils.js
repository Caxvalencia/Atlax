/**
 * Utils.js Modulo de utilidades para el JavaScript y el DOM API
 */
!function( window, undefined ) {
	const isNumber = "number",
		isString = "string",
		isObject = "object",
		isArray = "array",
		isFunction = "function",
		isUndefined = undefined,
		isNull = null,
		isRegExp = "regexp",

		objectEmpty = {},
		stringEmpty = "",

		regExp_Is = /\s([a-z|A-Z]+)/,
		regExp_Trim = /^\s+|\s+$/g;

	var StringUtils = {
		EMPTY: stringEmpty,
		trim: function( str ) {
			return str.replace( regExp_Trim, stringEmpty );
		},
		trimToNull: function( str ) {
			return this.isEmpty( this.trim( str ) ) ? isNull : this.trim( str );
		},
		isEmpty: function( str ) {
			return stringEmpty === str;
		},
	};

	var ObjectUtils = {
		EMPTY: objectEmpty,

		extend: function( objeto, nuevo ) {
			objeto = objeto || objectEmpty;

			for( var indice in nuevo )
				if( nuevo.hasOwnProperty( indice ) )
					objeto[ indice ] = nuevo[ indice ];

			return objeto;
		},
		clone: function( clon ) {
			return this.extend( this.EMPTY, clon );
		},
		is: function( element ) {
			return objectEmpty.toString.call( element ).match( regExp_Is )[ 1 ].toLowerCase();
		},
		isNumber: function( element ) {
			return isNumber === this.is( element );
		},
		isString: function( element ) {
			return isString === this.is( element );
		},
		isObject: function( element ) {
			return isObject === this.is( element );
		},
		isArray: function( element ) {
			return isArray === this.is( element );
		},
		isFunction: function( element ) {
			return isFunction === this.is( element );
		},
		isUndefined: function( element ) {
			return isUndefined === element;
		},
		isNull: function( element ) {
			return isNull === element;
		},
		isRegExp: function( element ) {
			return isRegExp === this.is( element );
		}
	};

	var existQuerySelector = document.querySelector && document.querySelectorAll;
	var DOMUtils = {
		ready: function( type, callFunc ) {
			type = type.toLowerCase() === "dom" ? "DOMContentLoaded" : "load";
			document.addEventListener( type, callFunc );
		},
		getTag: function( tag ) {
			return document.getElementsByTagName( tag );
		},
		getId: function( id ) {
			return document.getElementById( id );
		},
		getClass: function( cls ) {
			return document.getElementsByClassName( cls );
		},
		get: function( element ) {
			element = StringUtils.trimToNull( element );

			if( existQuerySelector && element != null ) {
				if( /^#/.test( element ) )
					return document.querySelector( element );
				else
					return document.querySelectorAll( element );
			};
		},
		getFirst: function( element ) {
			return document.querySelector( element );
		},
		createCanvasBack: function( width, height, funcBack ) {
			var canvasDum = document.createElement( "canvas" );
			canvasDum.width = width;
			canvasDum.height = height;
			var contextDum = canvasDum.getContext( "2d" );

			var scoper = {
				canvas: canvasDum,
				context: contextDum
			};

			if( funcBack ) {
				funcBack.apply( scoper, [ contextDum, canvasDum ]);
			}

			return scoper;
		},
		createImage: function( url, funcBack ) {
			var img = new Image();

			if( funcBack )
				img.onload = funcBack;
				
			img.src = url;

			return img;
		}
	};

	/**
	 * PollyFils
	 **/
	if( !Array.prototype.forEach ) {
		Array.prototype.forEach = function( fun ) {
			"use strict";

			if( this === void 0 || this === null )
				throw new TypeError();

			if( typeof fun !== "function" )
				throw new TypeError();
			var t = Object( this );
			var len = t.length >>> 0;

			var thisArg = arguments.length >= 2 ? arguments[ 1 ] : void 0;
			for( var i = 0; i < len; i++ ) {
		  		if( i in t )
					fun.call( thisArg, t[ i ], i, t );
			}
		};
	}

	var mix = ObjectUtils.EMPTY;
	ObjectUtils.extend( mix, StringUtils );
	ObjectUtils.extend( mix, ObjectUtils );
	ObjectUtils.extend( mix, DOMUtils );

	window.Utils = {
		StringUtils: StringUtils,
		ObjectUtils: ObjectUtils,
		DOMUtils: DOMUtils,

		Mix: mix
	};
}( window );