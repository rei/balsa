/**
 * Defined default configuration
 */
module.exports = {

    // Enable/disable all logging
    enable: true,

    // Define logging levels
    levels: [
        'debug',
        'info',
        'warn',
        'error'
    ],

    // Define aliases for levels
    aliases: {
        log:        'info',
        warning:    'warn',
        err:        'error'
    },

    // Define default message namespace
    prefix: null,

    // Define default minimum logging level for relays.
    // `null` means log ALL THE THINGS
    minLevel: null,

    // Define default message format
    messageFormat: '$TIMESTAMP $LEVEL\t$NAMESPACE\t$MESSAGES',

    // Define relays
    relays: []
};
