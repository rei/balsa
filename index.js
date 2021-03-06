'use strict';

var addInterfaceMethods = require( './lib/add-interfaces' );
var DEFAULT_CONFIG      = require( './lib/default-config' );

module.exports = function BalsaLogger ( config ) {
    var self = {};

    // Process configuration, set internal state
    self.config = config = config || {};
    config.enabled       = typeof config.enabled !== 'undefined' ? config.enabled : DEFAULT_CONFIG.enabled;
    config.levels        = config.levels || DEFAULT_CONFIG.levels.slice( 0 );
    config.aliases       = config.aliases || JSON.parse( JSON.stringify ( DEFAULT_CONFIG.aliases ) );
    config.prefix        = typeof config.prefix !== 'undefined' ? config.prefix : DEFAULT_CONFIG.prefix;
    config.minLevel      = typeof config.minLevel !== 'undefined' ? config.minLevel : DEFAULT_CONFIG.minLevel;
    config.messageFormat = config.messageFormat || DEFAULT_CONFIG.messageFormat;
    config.relays        = config.relays || DEFAULT_CONFIG.relays.slice( 0 );

    // Add logging interfaces
    addInterfaceMethods( self );

    // Add aliases
    for( var alias in self.config.aliases ) {
        self[ alias ] = self[ self.config.aliases[ alias ] ];
    }

    /** Enable logging */
    self.enable = function () {
        self.config.enabled = true;
    };

    /** Disable all logging */
    self.disable = function () {
        self.config.enabled = false;
    };

    /**
     * Adds a new relay
     * @param {object} relay - A relay object extended from BaseRelay.
     * @returns {number} The relay ID for use during removal
     */
    self.add = function ( relay ) {
        // A relay's "ID" is just its index in the array
        return self.config.relays.push( relay ) - 1;
    };

    /**
     * Removes a relay
     * @param  {number} relayID - The ID of the relay to remove
     */
    self.remove = function ( relayID ) {
        self.config.relays.splice( relayID, 1 );
    };

    /**
     * Set the prefix that will be prepended to every log message.
     * @param {string} prefix - The prefix string, e.g., 'myApp'
     */
    self.prefix = function ( prefix ) {
        self.config.prefix = prefix;
    };

    /**
     * Sets the default minimum logging level, i.e., don't log messages below
     * the specified level. If `null`, all levels will be logged. Possible
     * values are:
     *
     *     - null    - Log ALL THE THINGS
     *     - 'debug' - Don't log below debug (lowest level, so log everything)
     *     - 'info'  - Don't log below info
     *     - 'warn'  - Don't log below warn
     *     - 'error' - Don't log below error
     *
     * Relays may override this value in their own configuration.
     *
     * @param {string|null} level - The minimum default level
     */
    self.minLevel = function ( level ) {
        self.config.minLevel = level;
    };

    /**
     * Sets the default message format. Available variables are:
     *
     *     - `$TIMESTAMP` - Timestamp of the log, in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601)
     *     - `$LEVEL`     - The logging level
     *     - `$PREFIX`    - The message prefix
     *     - `$MESSAGE`   - The message body
     *
     * Relays may override this value in their own configuration.
     *
     * @param {string} format - The message format string
     */
    self.messageFormat = function ( format ) {
        self.config.messageFormat = format;
    };

    return self;
};
