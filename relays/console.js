'use strict';

var _assign     = require( 'lodash-node/compat/objects/assign' );
var BaseRelay   = require( './base' );

/**
 * Console relay.
 *
 * Default behavior is to proxy your environment's natural console behavior,
 * e.g., `mylog.warn` will proxy `console.warn` directly respecting standard
 * parameter patterns. (I.e., by default, this appender will not utilize
 * message formatting.)
 *
 * @param {object}  opts                        - Options object. All options are optional.
 * @param {boolean} [opts.formatMessages=true]  - Respect message formatting
 * @param {boolean} [opts.verbose=false]        - If true, report errors with logging, otherwise, fail silently.
*/
module.exports = function ConsoleRelay ( opts ) {

    // Process options
    opts = opts || {};
    opts = _assign( {}, {
        formatMessage:  true,
        verbose:        false
    }, opts );

    // Return a new base relay, specifying the log callback
    return new BaseRelay( {
        onLog: function ( logEvent ) {

            // Set message to raw rawArgs unless `formatMessages` is set
            var message = opts.formatMessage ? [ logEvent.message ] : logEvent.rawArgs;

            // Attempt to log
            try {
                console[ logEvent.level ].apply( console, message );

            // Capture any errors. Report to console if `verbose` option set.
            } catch ( err ) {
                if ( opts.verbose ) {
                    console.warn( 'Warning: Problem logging at', logEvent.level + ':', err );
                }
            }
        }
    } );
};
