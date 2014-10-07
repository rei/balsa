'use strict';

/**
 * Add interface aliases to the logger.
 */
module.exports = function addInterfaceAliases ( logger ) {
    for( var alias in logger.config.aliases ) {
        logger[ alias ] = logger[ logger.config.aliases[ alias ] ];
    }
};
