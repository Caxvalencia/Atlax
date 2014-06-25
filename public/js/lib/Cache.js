!function( window, exports, require ) {
	function Cache() {
		var cached = {};

		return {
			/*
			 * @param {String} key
 			 * @param {Object} value
 			 */
			set: function( key, value ) {
				cached[ key ] = value;
				return this;
			},

			/*
			 * @param {String} key
 			 */
			get: function( key ) {
				return cached[ key ];
			}
		};
	}

	exports.Cache = Cache;
}( window, module.exports, module.require );