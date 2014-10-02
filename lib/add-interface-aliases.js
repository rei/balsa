var _forEach = require( 'lodash-node/compat/collections/forEach' );

/**
 * Add interface aliases to the target.
 */
module.exports = function addInterfaceAliases ( target ) {
    for( var alias in target.config.aliases ) {
        target[ alias ] = target[ target.config.aliases[ alias ] ];
    };
};
