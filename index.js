var _assign             = require( 'lodash-node/compat/objects/assign' );
var _forEach            = require( 'lodash-node/compat/collections/forEach' );
var addInterfaceMethod  = require( './lib/add-interface-method' );
var expandRelays        = require( './lib/expand-relays' );
var DEFAULT_CONFIG      = require( './lib/default-config' );

function BalsaLogger ( config ) {
    var self = {};

    // Merge default configuration options
    config = _assign( {}, DEFAULT_OPTS, config );

    // Construct an interface method for all levels
    // @todo update to use lodash's forEach
    _forEach( config.levels, function ( level ) {
        addInterfaceMethod( level, self, relays, config );
    } );

    // Construct aliases
    // @todo update to use lodash's forEach
    for ( var alias in config.aliases ) {
        self[ alias ] = self[ config.aliases[ alias ] ];
    }

    return self;
};

module.exports = BalsaLogger;
