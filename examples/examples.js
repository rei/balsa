'use strict';

var _               = require( 'lodash-node' );
var Logger          = require( '../index' );
var ConsoleRelay    = require( '../relays/console' );
var defaultConfig   = require( '../lib/default-config' );

var LEVELS = defaultConfig.levels.concat( _.keys( defaultConfig.aliases ) );

var LOGGERS = {

    no_relay: new Logger(),

    single_relay: new Logger( {
        relays: [
            new ConsoleRelay()
        ]
    } ),

    multi_relays: new Logger( {
        relays: [
            new ConsoleRelay( {
                messageFormat: 'ConsoleRelay 0: $TIMESTAMP $LEVEL\t$PREFIX\t$MESSAGE'
            } ),
            new ConsoleRelay( {
                messageFormat: 'ConsoleRelay 1: $TIMESTAMP $LEVEL\t$PREFIX\t$MESSAGE'
            } )
        ]
    } ),

    logger_config: new Logger( {
        prefix:         'example-prefix',
        minLevel:       'warn',
        messageFormat:  '{"timestamp":"$TIMESTAMP","level":"$LEVEL","prefix":"$PREFIX","message":"$MESSAGE"}',
        relays: [
            new ConsoleRelay()
        ]
    } ),

    relay_config_overrides: new Logger( {
        minLevel:       'warn',
        prefix:         'logger-prefix',
        messageFormat:  'logger: [$PREFIX] [$MESSAGE]',
        relays: [
            new ConsoleRelay(),
            new ConsoleRelay( {
                minLevel:       'error',
                prefix:         'relay-prefix',
                messageFormat:  'relay: [$PREFIX] [$MESSAGE]',
            } )
        ]
    } ),
};

for ( var log in LOGGERS ){
    var curLogger = LOGGERS[ log ];

    console.log( '---- Running "' + log + '" example ----');

    LEVELS.forEach( function ( level ) {
        curLogger[ level ]( 'Logging for', level );
    } );
}
