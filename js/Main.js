!function( window, undefined ) {
	//Imports
	var $ = Utils.Mix();

	$.ready( "dom", main );

	function main() {
		var atlax = new ConfigureAtlax({
			id: "#canvas-atlax",
			width: window.innerWidth * .7,
			height: window.innerHeight * .7,

			drop: dropImage,

			dragOver: function( event ) {
				event.stopPropagation();
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
			}
		});
	}

	function dropImage( event ) {
		var contextAtlax = this;
		var files = event.dataTransfer.files; // FileList object.

		var eventX = contextAtlax.getMousePos( event ).x,
			eventY = contextAtlax.getMousePos( event ).y;

		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			if( !f.type.match( 'image.*' ) ) {
				continue;
			}

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function( theFile ) {
				return function( e ) {
			        // Render thumbnail.

					var imageUpload = new Image();
					
					imageUpload.onload = function() {
						contextAtlax.ctxAtlax.drawImage( this, eventX, eventY, this.width, this.height );
					};
					imageUpload.src = e.target.result;

				    document.getElementById('log').insertBefore( imageUpload, null);
				};
			})( f );

			// Read in the image file as a data URL.
			reader.readAsDataURL(f);

			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
				f.size, ' bytes, last modified: ',
				f.lastModifiedDate.toLocaleDateString(), '</li>');
		}
		document.getElementById( 'log' ).innerHTML = '<ul>' + output.join('') + '</ul>';
	}
}( window );