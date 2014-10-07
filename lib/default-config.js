'use strict';

/**
 * Defined default configuration
 */
module.exports = {

    // Enable/disable all logging
    enabled: true,

    // Define logging levels
    levels: [
        'debug',
        'log',
        'info',
        'warn',
        'error'
    ],

    // Define aliases for levels
    aliases: {
        warning:    'warn',
        err:        'error'
    },

    // Define default message namespace
    prefix: null,

    // Define default minimum logging level for relays.
    // `null` means log ALL THE THINGS
    minLevel: null,

    // Define default message format
    messageFormat: '$TIMESTAMP $LEVEL\t$PREFIX\t$MESSAGE',

    // Define relays
    relays: []
};
