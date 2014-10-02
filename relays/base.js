var _noop = require( 'lodash-node/compat/utilities/noop' );
var getTimestamp = require( '../lib/timestamp')

// Last relay ID
var lastId = 0;

/**
 * Base relay. All relays should extend this.
 */
module.exports = function BaseRelay ( relayOpts ) {
    var self = {};

    self.id = lastId++;

    self.log = function ( logEvent, loggerConfig ) {

        // Use message format from the relay, or the logger
        var messageFormat = relayOpts.messageFormat || loggerConfig.messageFormat

        // Render message based on message format
        var renderedMessage = messageFormat
            .replace( '$TIMESTAMP', logEvent.timeStamp )
            .replace( '$LEVEL',     logEvent.level )
            .replace( '$PREFIX',    logEvent.prefix )
            .replace( '$MESSAGE',   logEvent.rawMessage.join( ' ' ) );

        relayOpts.onLog( {
            timestamp:          logEvent.timestamp,
            level:              logEvent.level,
            prefix:             logEvent.prefix,
            rawMessage:         logEvent.rawMessage,
            renderedMessage:    renderedMessage
        } );
    };

    return self;
};
