var express = require( 'express' ),
	app = express();

app.get( '/', function( req, res ) {
	res.sendfile( __dirname + '/public/main.html');
});

app.use( express.static( __dirname + '/public') );

app.listen( 8000, function() {
	console.log( "servidor corriendo!" );
});