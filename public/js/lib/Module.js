window.module = (function() {
	var exports = {};

	var require = function( key ) {
		return exports[ key ];
	};
	
	return {
		exports: exports,
		require: require
	};
})();