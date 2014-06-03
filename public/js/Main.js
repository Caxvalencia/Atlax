!function( window, Utils, undefined ) {
	//Imports
	var $ = Utils.Mix;

	$.ready( "dom", main );

	function main() {
		var atlax = new Atlax({
			id: "#canvas-atlax",
			width: window.innerWidth * .7,
			height: window.innerHeight * .7,

			drop: dropImage
		});
	}

	function dropImage( event ) {
		var thisAtlax = this;
		var files = event.dataTransfer.files; // FileList object.

		var eventX = thisAtlax.getMousePos( event ).x,
			eventY = thisAtlax.getMousePos( event ).y;

		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			if( !f.type.match( 'image.*' ) ) {
				continue;
			}

			var reader = thisAtlax.addImageToAtlax( f, eventX, eventY );
			

			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
				f.size, ' bytes, last modified: ',
				f.lastModifiedDate.toLocaleDateString(), '</li>');
		}
		document.getElementById( 'log' ).innerHTML = '<ul>' + output.join('') + '</ul>';
	}
}( window, Utils );