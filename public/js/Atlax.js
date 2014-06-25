/*
 * @description - Clase nucleo del proyecto
 */
!function( window, exports, require ) {
	var Cache = require( "Cache" );

	function Atlax() {
		this.CacheAtlax = new Cache();
		this.CacheFile = new Cache();
	}

	exports.Atlax = Atlax;
}( window, module.exports, module.require );