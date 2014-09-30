var mustache        = require( 'mustache' );
var _getLevelCode   = require( './get-level-code' );

// Add an interface method for the specified `level`
var addInterfaceMethod = function( level, target, appenders, config ) {

    target[ level ] = function () {

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

module.exports = addInterfaceMethod;
