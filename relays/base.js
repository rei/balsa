var _isNull = require( 'lodash-node/compat/objects/isNull' );
var util    = require( '../lib/util' );

// Last relay ID
var lastId = 0;

/**
 * Base relay. All relays should extend this.
 */
module.exports = function BaseRelay ( relayOpts ) {
    var self = {};

    self.id = lastId++;

    self.log = function ( logEvent, loggerConfig ) {

        // Determine if this relay is enabled at this level
        var minLevel        = relayOpts.minLevel || loggerConfig.minLevel;
        var levelCode       = util.getLevelCode( logEvent.level, loggerConfig.levels );
        var minLevelCode    = util.getLevelCode( minLevel, loggerConfig.levels );
        var levelEnabled    = _isNull( minLevel ) || levelCode >= minLevelCode;

        if ( levelEnabled ) {
            // Use message format from the relay, or the logger
            var messageFormat = relayOpts.messageFormat || loggerConfig.messageFormat;

            // Render message based on message format
            var renderedMessage = messageFormat
                .replace( '$TIMESTAMP', logEvent.timeStamp )
                .replace( '$LEVEL',     logEvent.level )
                .replace( '$PREFIX',    logEvent.prefix )
                .replace( '$MESSAGE',   logEvent.rawMessage.join( ' ' ) );

            relayOpts.onLog( {
                timestamp:          logEvent.timestamp,
                level:              logEvent.level,
                prefix:             loggerConfig.prefix,
                rawMessage:         logEvent.rawMessage,
                renderedMessage:    renderedMessage
            } );
        }
    };

    return self;
};
