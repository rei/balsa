var _forEach     = require( 'lodash-node/compat/collections/forEach' );
var getTimestamp = require( './timestamp' );

/**
 * Add interface methods to the logger.
 */
module.exports = function addInterfaceMethods ( logger ) {
    _forEach( logger.config.levels, function ( level ) {
        logger[ level ] = function () {

            // Consider all `arguments` to the interface message chunks, a la
            // console.log( message, [ message, message, ... ] ), convert
            // `arguments` to a real array for consumption by the relays.
            // See http://mdn.io/arguments for more info
            var messageChunks = Array.prototype.slice.call( arguments );

            _forEach( logger.config.relays, function ( relay ) {
                var eventPacket = {
                    timestamp:  getTimestamp(),
                    level:      level,
                    rawMessage: messageChunks
                };

                relay.log( eventPacket, logger.config );
            } )
        }
    } );
};
