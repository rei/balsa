var _forEach = require( 'lodash-node/compat/collections/forEach' );

/**
 * Add interface methods to the logger.
 */
module.exports = function addInterfaceMethods ( logger ) {
    _forEach( logger.config.levels, function ( level ) {
        logger[ level ] = function () {
            _forEach( logger.config.relays, function () {

            } )
        }
    } );
};
