'use strict';

var util = require( './util' );

var addInterfaceMethod = function ( level, logger ) {
    logger[ level ] = function () {

        // If the logger is disabled, just return
        if ( !logger.config.enabled ) { return }

        // Consider all `arguments` to the interface message chunks, a la
        // console.log( message, [ message, message, ... ] ), convert
        // `arguments` to a real array for consumption by the relays.
        // See http://mdn.io/arguments for more info
        var rawArgs = Array.prototype.slice.call( arguments );

        for ( var i = 0; i < logger.config.relays.length; ++i ){
            var relay = logger.config.relays[ i ];

            var logEvent = {
                timestamp:  util.getTimestamp(),
                level:      level,
                rawArgs:    rawArgs
            };

            relay.log( logEvent, logger.config );
        }
    };
};

/**
 * Add interface methods to the logger.
 */
module.exports = function addInterfaceMethods ( logger ) {
    for ( var i = 0; i < logger.config.levels.length; ++i ) {
        addInterfaceMethod( logger.config.levels[ i ], logger );
    }
};
