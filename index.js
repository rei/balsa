var _merge      = require( 'lodash-node/compat/objects/merge' );
var _noop       = require( 'lodash-node/compat/utilities/noop' );
var _cloneDeep  = require( 'lodash-node/compat/objects/cloneDeep');
var mustache    = require( 'mustache' );

module.exports = function ( args ) {
    var self = {};

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

            // Define default maximum logging level for appenders. `null` -> log
            // ALL THE THINGS
            maxLevel: null,

            // Define default message format for appenders
            messageFormat: '[{{timestamp}}] [{{level}}]\t[{{namespace}}]\t{{{messages}}}'
        }
    };

    /** Get the numerical logging level from a `levelName`, case insensitive. If
        `levelName` is not a string, or is not found the logging `levels`,
        return -1.
    */
    var _getLevelCode = function ( levelName, levels ) {
        if ( typeof levelName !== 'string' ) return -1;
        levelName = levelName.toLowerCase();
        return levels.indexOf( levelName );
    };

    /** Given `rawAppenders`, expand each appender, and override default appender
        config if specified in the appender.
    */
    var _expandAppenders = function ( rawAppenders, defaultConfig ) {
        var appenders = {};

        // Return an empty object if appenders is not defined, invalid, etc.
        if ( typeof rawAppenders !== 'object' ) return appenders;

        // For every defined appender...
        for ( var appender in rawAppenders ) {
            var curAppender         = rawAppenders[ appender ];
            var defaultConfigClone  = _cloneDeep( defaultConfig );

            // If only the appender function is defined, expand appender definition
            // to an object using the function as the 'appender' property, and the
            // default appender config as the appender configuration
            if ( typeof curAppender === 'function' ) {
                appenders[ appender ] = {
                    appender:   curAppender,
                    config:     defaultConfigClone
                };


            // If an appender object is defined, make sure it has the required
            // properties, and override any specified config properties from the
            // default appender config
            } else if ( typeof curAppender === 'object' ) {

                var missingProps = ! curAppender.appender || ! curAppender.config;
                if( missingProps ) throw new Error(
                    'Invalid appender definition structure encountered for `' +
                    appender + '`. Appender structures must contain an ' +
                    '`appender` and `config` property.'
                );

                appenders[ appender ] = {
                    appender:   curAppender.appender,
                    config:     _merge( defaultConfigClone, curAppender.config )
                };

            // Otherwise it's an invalid appender definition. Throw an error.
            } else throw new Error( 'Invalid appender property encountered: ' + curAppender );
        }

        // Return constructed appender object
        return appenders;
    };

    // Initialize logger configuration, i.e., merge specified configuration
    // with default configuration
    args = args || {};
    var config = _merge( CONFIG_DEFAULTS, args.config );

    // Initialize appenders
    var appenders = _expandAppenders( args.appenders, config.appenderConfig );

    /** Update the specified configuration on-demand
    */
    self.config = function ( configUpdates ) {
        config = _merge( config, configUpdates );
    };

    // Add an interface method for the specified `level`
    var _addInterfaceMethod = function( level ){

        self[ level ] = function () {

            // If logging is not enabled, just return
            if( ! config.enable ) return;

            // Consider all `arguments` to the interface message chunks, a la
            // console.log( message, [ message, message, ... ] ), convert
            // `arguments` to a real array for consumption by the appenders.
            // See http://mdn.io/arguments for more info
            var messages = Array.prototype.slice.call( arguments );

            // For each appender, if the current level is at or below the
            // appender's max level, OR the max level is falsey (i.e., log ALL
            // THE THINGS), call the appender's handler function
            for ( var appender in appenders ) {
                var curAppender = appenders[ appender ];

                // Determine if this level is enabled
                var maxLevel        = curAppender.config.maxLevel;
                var levelCode       = _getLevelCode( level, config.levels );
                var maxLevelCode    = _getLevelCode( maxLevel, config.levels );
                var levelEnabled    = ! maxLevel || levelCode <= maxLevelCode;

                if ( levelEnabled ) {

                    // Format message string if the message format exists.
                    // Otherwise, just join the messages
                    var renderedMessage;
                    var messageFormat = curAppender.config.messageFormat;
                    if ( messageFormat ) renderedMessage = mustache.render( messageFormat, {
                        timestamp:  new Date().toISOString(), // TODO: Add option to format time with a callback
                        level:      level,
                        namespace:  config.namespace,
                        messages:   messages.join( ' ' )
                    } );
                    else renderedMessage = messages.join( ' ' );

                    // Interpret the level name if necessary
                    var levelInterp     = curAppender.config.levelInterp;
                    var hasInterp       = typeof levelInterp === 'object' &&
                                          typeof levelInterp[ level ] !== 'undefined';
                    var interpedLevel   = hasInterp ? levelInterp[ level ] : level;

                    // Call the appender with all the info it needs to append a
                    // log message.
                    curAppender.appender( {

                        // Name of the appender as specified in `appenders`
                        name:           appender,

                        // The translated appender level name
                        level:          interpedLevel,

                        // The level code (where 0 is most severe)
                        levelCode:      levelCode,

                        // Message namespace
                        namespace:      config.namespace,

                        // The array of messages
                        messages:       messages,

                        // Message formatted as a string
                        renderedMessage: renderedMessage,

                        // The appender's configuration
                        config:         appenders[ appender ].config,
                    } );
                }
            }
        };
    };

    // Construct an interface method for all levels
    for ( var i = 0; i < config.levels.length; ++i ) _addInterfaceMethod( config.levels[ i ] );

    // Construct aliases
    for ( var alias in config.aliases ) self[ alias ] = self[ config.aliases[ alias ] ];

    return self;
};
