var _forEach = require( 'lodash-node/compat/collections/forEach' );

/**
 * Add interface aliases to the target.
 */
module.exports = function addInterfaceAliases ( aliases, target ) {
    for( var alias in aliases ) {
        target[ alias ] = target[ aliases[ alias ] ];
    };
};
