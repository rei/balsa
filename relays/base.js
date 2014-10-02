var _noop = require( 'lodash-node/compat/utilities/noop' );

// Last relay ID
var lastId = 0;

/**
 * Base relay. All relays should extend this.
 */
module.exports = function BaseRelay ( logCallback ) {
    var self = {};

    self.id = lastId++;

    self.log = logCallback || function ( message ) {
        console.log( 'Relay', self.id, 'logging with message', message );
    };

    return self;
};
