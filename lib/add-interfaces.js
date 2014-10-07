'use strict';

var _forEach    = require( 'lodash-node/compat/collections/forEach' );
var util        = require( './util' );

/**
 * Add interface methods to the logger.
 */
module.exports = function addInterfaceMethods ( logger ) {
    _forEach( logger.config.levels, function ( level ) {
        logger[ level ] = function () {

            // If the logger is disabled, just return
            if ( !logger.config.enabled ) { return }

            // Consider all `arguments` to the interface message chunks, a la
            // console.log( message, [ message, message, ... ] ), convert
            // `arguments` to a real array for consumption by the relays.
            // See http://mdn.io/arguments for more info
            var rawArgs = Array.prototype.slice.call( arguments );

            _forEach( logger.config.relays, function ( relay ) {
                var logEvent = {
                    timestamp:  util.getTimestamp(),
                    level:      level,
                    rawArgs:    rawArgs
                };

                relay.log( logEvent, logger.config );
            } );
        };
    } );
};
