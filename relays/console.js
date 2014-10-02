var _merge      = require( 'lodash-node/compat/objects/merge' );
var BaseRelay   = require( './base' );

/**
 * Console relay.
 *
 * Default behavior is to proxy your environment's natural console behavior,
 * e.g., `mylog.warn` will proxy `console.warn` directly respecting standard
 * parameter patterns. (I.e., by default, this appender will not utilize
 * message formatting.)
 *
 * @param {object}  opts - Options object. All options are optional.
 * @param {boolean} [opts.formatMessages=false] - Respect message formatting
 * @param {boolean} [opts.verbose=false] - If true, report errors with logging, otherwise, fail silently.
*/
module.exports = function ConsoleRelay ( opts ) {

    // Process options
    opts = opts || {};
    _merge( opts, {
        formatMessage:  false,
        verbose:        false
    } )

    // Return a new base relay, specifying the log callback
    return new BaseRelay( {
        onLog: function ( pkt ) {

            // Set message to raw rawMessage unless `formatMessages` is set
            var message = opts.formatMessage ? [ pkt.renderedMessage ] : pkt.rawMessage;

            // Attempt to log
            try {
                console[ pkt.level ].apply( console, message );

            // Capture any errors. Report to console if `verbose` option set.
            } catch ( err ) {
                if ( opts.verbose ) {
                    console.warn ( 'Problem logging at', pkt.level, ':', err );
                }
            };
        }
    } );
};
