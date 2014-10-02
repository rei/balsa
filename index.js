var _defaults           = require( 'lodash-node/compat/objects/defaults' );
var addInterfaceMethods = require( './lib/add-interface-methods' );
var addInterfaceAliases = require( './lib/add-interface-aliases' );
var DEFAULT_CONFIG      = require( './lib/default-config' );

module.exports = function BalsaLogger ( config ) {
    var self = {};

    // Process configuration, set internal state
    config = _defaults( DEFAULT_CONFIG, config );
    self.enabled    = config.enable;
    self.prefix     = config.prefix;

    // Add logging interface methods and aliases
    addInterfaceMethods( config.levels, self );
    addInterfaceAliases( config.aliases, self );

    /** Enable logging */
    self.enable  = function () { self.enabled = true }

    /** Disable all logging */
    self.disable = function () { self.enabled = false }

    /**
     * Set the prefix that will be prepended to every log message.
     * @param {string} prefix - The prefix string, e.g., 'myApp'
     */
    self.prefix = function ( prefix ) { /** TODO */ }

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
    self.minLevel = function ( level ) { /** TODO */ }

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
    self.messageFormat = function ( format ) { /** TODO */ }

    /**
     * Adds a new relay.
     *
     * @param {object} relay - A relay
     * @returns {number} The relay ID for use during removal
     */
    self.add = function ( relay ) { /* TODO */ }

    /**
     * Removes a relay.
     * @param  {number} relayID - The ID of the target relay
     */
    self.remove = function ( relayID ) { /* TODO */ }

    return self;
};
