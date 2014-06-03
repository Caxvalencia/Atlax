!function( window, undefined ) {
	var require = function( urlJS ) {

		if( !/\.js$/.test( urlJS ) ) {
			urlJS = urlJS + '.js';
		}

		var js = document.createElement( "script" );
			console.log( urlJS )
		js.onload = function() {
			console.log( urlJS )
			document.getElementsByTagName( "head" )[ 0 ].appendChild( js );
		};
		js.src = urlJS;
	};

	window.require = require;
}( window );