
// Define default configuration
var CONFIG_DEFAULTS = {

    // Enable/disable all logging
    enable: true,

    // Define logging levels
    levels: [
        'error',
        'warn',
        'info',
        'debug'
    ],

    // Define aliases for levels
    aliases: {
        err:        'error',
        warning:    'warn'
    },

    // Define default message namespace
    namespace: null,

    // Default appender config. Appenders may overwrite these values.
    appenderConfig: {

        // Define default maximum logging level for relays. `null` -> log
        // ALL THE THINGS
        maxLevel: null,

        // Define default message format for relays
        messageFormat: '[{{timestamp}}] [{{level}}]\t[{{namespace}}]\t{{{messages}}}'
    }
};

module.exports = CONFIG_DEFAULTS;
