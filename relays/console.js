'use strict';

var BaseRelay = require( './base' );

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
    opts.formatMessage  = typeof opts.formatMessage !== 'undefined' ? opts.formatMessage : true,
    opts.verbose        = typeof opts.verbose       !== 'undefined' ? opts.verbose : false

    // Implement onLog callback
    opts.onLog = function ( logEvent ) {

        // Set message to raw rawArgs unless `formatMessages` is set
        var message = opts.formatMessage ? [ logEvent.message ] : logEvent.rawArgs;

        // Attempt to log
        try {
            console[ logEvent.level ].apply( console, message );

        // Capture any errors. Report to console if `verbose` option set.
        } catch ( err ) {
            if ( opts.verbose ) {
                try {
                    console.warn(
                        'Warning: Problem logging at', logEvent.level + ':', err
                    );
                } catch ( e ) {}
            }
        }
    };

    // Return a new base relay, specifying the log callback
    return new BaseRelay( opts );
};
