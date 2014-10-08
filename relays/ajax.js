'use strict';

var _assign         = require( 'lodash-node/compat/objects/assign' );
var _isString       = require( 'lodash-node/compat/objects/isString' );
var _isPlainObject  = require( 'lodash-node/compat/objects/isPlainObject' );
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
    if ( !_isPlainObject( opts ) || !_isString( opts.endpoint ) ) {
        throw new TypeError( 'New Ajax relays must supply at least an `opts.endpoint` URL string.' );
    }
    opts = _assign( {}, {
        minLevel:   'error', // Log only error-level messages by default
        verbose:    false,
        logDataMap: {
            level:      'level',
            message:    'message'
        }
    }, opts );

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
