var _merge                  = require( 'lodash-node/compat/objects/merge' );
var _expandAppenders        = require( './lib/expand-relays' );
var _addInterfaceMethod     = require( './lib/add-interface-method' );
var CONFIG_DEFAULTS         = require( './lib/config-defaults' );
var DEFAULT_APPENDERS       = require( './lib/default-relays' );

/**
 * Logger
 * @desc    Creates an instance of a logger.
 * @class
 * @param   {Object} args
 * @returns {Logger}
 */
function Logger( args ) {
    var self = {};

    // Initialize logger configuration, i.e., merge specified configuration
    // with default configuration
    args = args || {};

    var config = _merge( CONFIG_DEFAULTS, args.config );

    // Initialize relays
    var relays = _expandAppenders(
        _merge( DEFAULT_APPENDERS, args.relays ),
        config.appenderConfig
    );

    /** Update the specified configuration on-demand
    */
    self.config = function ( configUpdates ) {
        if ( !configUpdates ) {
            return TypeError( 'Config updates must be an object' );
        }

        _merge( this.config, configUpdates );
    };


    // Construct an interface method for all levels
    // @todo update to use lodash's forEach
    for ( var i = 0; i < config.levels.length; ++i ) {
        _addInterfaceMethod( config.levels[ i ], self, relays, config );
    }

    // Construct aliases
    // @todo update to use lodash's forEach
    for ( var alias in config.aliases ) {
        self[ alias ] = self[ config.aliases[ alias ] ];
    }

    return self;
};


module.exports = Logger;
