var _cloneDeep  = require( 'lodash-node/compat/objects/cloneDeep' );
var _merge      = require( 'lodash-node/compat/objects/merge' );

/**
 * Given `rawRelays`, expand each relay, and override default appender
 * config if specified in the appender.
 */
module.exports = function ( rawRelays, defaultConfig ) {
    var relays = {};

    // Return an empty object if relays is not defined, invalid, etc.
    if ( typeof rawRelays !== 'object' ) return relays;

    // For every defined appender...
    for ( var appender in rawRelays ) {
        var curAppender         = rawRelays[ appender ];
        var defaultConfigClone  = _cloneDeep( defaultConfig );

        // If only the appender function is defined, expand appender definition
        // to an object using the function as the 'appender' property, and the
        // default appender config as the appender configuration
        if ( typeof curAppender === 'function' ) {
            relays[ appender ] = {
                appender:   curAppender,
                config:     defaultConfigClone
            };


        // If an appender object is defined, make sure it has the required
        // properties, and override any specified config properties from the
        // default appender config
        } else if ( typeof curAppender === 'object' ) {

            var missingProps = ! curAppender.appender || ! curAppender.config;
            if( missingProps ) throw new Error(
                'Invalid appender definition structure encountered for `' +
                appender + '`. Appender structures must contain an ' +
                '`appender` and `config` property.'
            );

            relays[ appender ] = {
                appender:   curAppender.appender,
                config:     _merge( defaultConfigClone, curAppender.config )
            };

        // Otherwise it's an invalid appender definition. Throw an error.
        } else throw new Error( 'Invalid appender property encountered: ' + curAppender );
    }

    // Return constructed appender object
    return relays;
};