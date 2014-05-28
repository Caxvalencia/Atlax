!function( window, undefined ) {
	if( !window.File || !window.FileReader || !window.FileList || !window.Blob ) {
		throw "Exception: No se encontro API Files";
	}

	var $ = Utils.Mix; //Encapsula la libreria de utilidades Utils.js

	window.ConfigureAtlax = (function() {
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

			$.extend( contructor, {
				canvasAtlax: canvasAtlax,
				ctxAtlax: ctxAtlax,
				getMousePos: getMousePos
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