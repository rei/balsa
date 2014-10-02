var _forEach = require( 'lodash-node/compat/collections/forEach' );

/**
 * Add interface methods to the target.
 */
module.exports = function addInterfaceMethods ( target ) {
    _forEach( target.config.levels, function ( level ) {
        target[ level ] = function () {
            console.log( 'Interface method "' + level + '" called!');
        }
    } );
};
