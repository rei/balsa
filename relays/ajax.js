'use strict';

var atomic          = require( 'atomic' );
var BaseRelay       = require( './base' );

/**
 * Ajax relay.
 *
 * Fire a log message to a REST endpoint using AJAX.
 *
 * @param {object} opts                 - Options object
 * @param {string} opts.endpoint        - URL string of the endpoint
 * @param {string} [opts.minLevel='error']
 *                                      - Minimum level to log at
 * @param {object} [opts.logDatamap={level:'level', message: 'message'}]
 *                                      - Map from data sent to endpoint to
 *                                        `logEvent` data
 */
module.exports = function AjaxRelay ( opts ) {

    // Process options
    if ( !opts || !opts.endpoint ) {
        throw new TypeError( 'New Ajax relays must supply at least an `opts.endpoint` URL string.' );
    }
    opts.minLevel   = typeof opts.minLevel   !== 'undefined' ? opts.minLevel   : 'error';
    opts.verbose    = typeof opts.verbose    !== 'undefined' ? opts.verbose    : false;
    opts.logDataMap = typeof opts.logDataMap !== 'undefined' ? opts.logDataMap : {
        level:      'level',
        message:    'message'
    }

    opts.onLog = function ( logEvent ) {

        // Map logData properties to logEvent properties
        var logData = {};
        for ( var logProp in opts.logDataMap ) {
            logData[ logProp ] = logEvent[ opts.logDataMap[ logProp ] ];
        }

        atomic.post( opts.endpoint, logData )
            .success( function () {
                if ( opts.verbose ) {
                    try {
                        console.info( 'Ajax log to "' + opts.endpoint + '" was successful.' );
                    } catch ( e ) {}
                }
            } )
            .error( function () {
                if ( opts.verbose ) {
                    try {
                        console.warn( 'Warning: Ajax log to "' + opts.endpoint + '" was NOT successful.' );
                    } catch ( e ) {}
                }
            } );
    };

    return new BaseRelay( opts );
};
