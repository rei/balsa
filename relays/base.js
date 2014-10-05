var _isNull = require( 'lodash-node/compat/objects/isNull' );
var _isFunction = require( 'lodash-node/compat/objects/isFunction' );
var _isPlainObject = require( 'lodash-node/compat/objects/isPlainObject' );
var util    = require( '../lib/util' );

/**
 * Base relay. All relays should extend this.
 *
 * @param {object} opts         - Constructor options for a new relay
 * @param {string} opts.onLog   - Callback for when a logging event occurs.
 *                                Will be passed a log event, which includes:
 *
 *                                  - timestamp - Timestamp, in ISO 8601
 *                                  - level     - Logging level
 *                                  - prefix:   - Message prefix
 *                                  - rawArgs:  - Raw logging arguments
 *                                  - message:  - The full rendered log message
 *
 * @param {string} [opts.minLevel=Balsa.config.minLevel]
 *                              - Minimum level to log at. Overrides global
 *                                config for this relay.
 *
 * @param {string} [opts.messageFormat=Balsa.config.messageFormat]
 *                              - Message format. Overrides global config for
 *                                this relay.
 *
 * @param {string} [opts.prefix=Balsa.config.prefix]
 *                              - Message prefix. Overrides global config for
 *                                this relay.
 */
module.exports = function BaseRelay ( opts ) {
    var self = {};

    // Process options
    if ( !_isPlainObject( opts ) || !_isFunction( opts.onLog ) ) {
        throw new TypeError( 'New relays must supply at least an `opts.onLog` callback function.' );
    }

    /**
     * Callback function called by Balsa.
     *
     * @param  {[type]} logEvent     [description]
     * @param  {[type]} loggerConfig [description]
     * @return {[type]}              [description]
     */
    self.log = function ( logEvent, loggerConfig ) {

        // Determine if this relay is enabled at this level
        var minLevel        = opts.minLevel || loggerConfig.minLevel;
        var levelCode       = loggerConfig.levels.indexOf( logEvent.level );
        var minLevelCode    = loggerConfig.levels.indexOf( minLevel );
        var levelEnabled    = _isNull( minLevel ) || levelCode >= minLevelCode;

        if ( levelEnabled ) {

            // Use message format from the relay, or the logger
            var messageFormat = opts.messageFormat || loggerConfig.messageFormat;

            // Render message based on message format
            var renderedMessage = messageFormat
                .replace( '$TIMESTAMP', logEvent.timeStamp )
                .replace( '$LEVEL',     logEvent.level )
                .replace( '$PREFIX',    logEvent.prefix )
                .replace( '$MESSAGE',   logEvent.rawMessage.join( ' ' ) );

            // Decorate log event with the rendered message and prefix
            logEvent.prefix = opts.prefix || loggerConfig.prefix;
            logEvent.message = renderedMessage;

            // Call the relay's onLog function
            opts.onLog( logEvent );
        }
    };

    return self;
};
