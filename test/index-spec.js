'use strict';

var should      = require( 'should' );
var proxyquire  = require( 'proxyquire' );
var sinon       = require( 'sinon' );

var getLogger = function ( ) {
    return require( '../index' );
};

describe( 'Balsa', function ( ) {

    describe( 'Initialization', function ( ) {

        it( 'requires to be created with the `new` operator', function () {
            var Logger      = getLogger();
            var myLogger    = null;

            Logger.should.be.a.Function;
            myLogger = new Logger();

            myLogger.should.be.an.Object;
            myLogger.should.not.be.an.instanceOf( Logger );
        } );

        it( 'does not require any parameters', function () {
            var Logger = getLogger();
            Logger.bind( null, null ).should.not.throw();
        } );

        it( 'returns a logger with the expected properties', function () {
            var Logger      = getLogger();
            var myLogger    = new Logger();

            myLogger.should.have.properties( [

                // Interfaces
                'debug',
                'info',     'log',
                'warn',     'warning',
                'error',    'err',

                // API
                'enable',   'disable',
                'add',      'remove',
                'prefix',   'minLevel',
                'messageFormat',

                // Properties
                'config'
            ] );
        } );
    } );

    describe( 'Configuration', function () {

        it( 'can be enabled and disabled', function () {
            // Defaults to enabled
            var myLogger = new getLogger()();
            myLogger.config.enabled.should.be.true;

            // Can be set to disabled during instantiation
            myLogger = new getLogger()( { enabled: false } );
            myLogger.config.enabled.should.be.false;

            // Can be set to enabled after initilization
            myLogger = new getLogger()( { enabled: false } );
            myLogger.enable();
            myLogger.config.enabled.should.be.true;

            // Can be set to disabled after initilization
            myLogger = new getLogger()( { enabled: true } );
            myLogger.disable();
            myLogger.config.enabled.should.be.false;
        } );

        it( 'can have relays added', function () {
            // Defaults to no relays
            var myLogger = new getLogger()();
            myLogger.config.relays
                .should.be.instanceOf( Array )
                .and.have.lengthOf( 0 );

            // Can be set during initialization
            myLogger = new getLogger()( {
                relays: [ { id: 'fake-id' } ]
            } );
            myLogger.config.relays[ 0 ].should.be.eql( { id: 'fake-id' } )

            // Can be set post initialization
            var myLogger = new getLogger()();
            var fakeRelay0Id = myLogger.add( { id: 0 } );
            var fakeRelay1Id = myLogger.add( { id: 1 } );
            var fakeRelay2Id = myLogger.add( { id: 2 } );

            myLogger.config.relays[ 0 ].should.be.eql( { id: 0 } );
            myLogger.config.relays[ 1 ].should.be.eql( { id: 1 } );
            myLogger.config.relays[ 2 ].should.be.eql( { id: 2 } );

            // Each relay must return its ID
            fakeRelay0Id.should.equal( 0 );
            fakeRelay1Id.should.equal( 1 );
            fakeRelay2Id.should.equal( 2 );
        } );

        it( 'can have relays removed', function () {
            var myLogger = new getLogger()();
            var fakeRelay0Id = myLogger.add( { id: 0 } );
            var fakeRelay1Id = myLogger.add( { id: 1 } );
            var fakeRelay2Id = myLogger.add( { id: 2 } );

            myLogger.remove( fakeRelay1Id );

            myLogger.config.relays.should.have.lengthOf( 2 );
            myLogger.config.relays[ 0 ].should.be.eql( { id: 0 } );
            myLogger.config.relays[ 1 ].should.be.eql( { id: 2 } );
        } );

        it( 'can set a minimum logging level' );

        it( 'can define a message prefix' );

        it( 'can define a message format' );
    } );

    describe.skip( 'Logging', function () {

        it( 'has a method to output debug messages', function () {
            var myLogger = new getLogger()();

            myLogger.debug.should.be.a.Function;
            myLogger.debug.bind( null, 'debug here' ).should.not.throw();
        } );

        it( 'will have a method to output infomational messages', function ( ) {
            var myLogger = new getLogger()();

            myLogger.info.should.be.a.Function;
            myLogger.info.bind( null, 'info here' ).should.not.throw();

        } );

        it( 'will have a method to output warnings', function ( ) {
            var myLogger = new getLogger()();

            myLogger.warn.should.be.a.Function;
            myLogger.warn.bind( null, 'warn here' ).should.not.throw();

            myLogger.warning.should.be.a.Function;
            myLogger.warning.bind( null, 'warning, alias for warn here' ).should.not.throw();
        } );

        it( 'has a method to output errors', function ( ) {
            var myLogger = new getLogger()();

            myLogger.error.should.be.a.Function;
            myLogger.error.bind( null, 'error here' ).should.not.throw();

            myLogger.err.should.be.a.Function;
            myLogger.err.bind( null, 'err, alias for error here' ).should.not.throw();
        } );

    } );

    describe.skip( 'Configurations', function ( ) {

        beforeEach( function ( ) {
            this.Logger = getLogger();
        } );

        it( 'accepts configuration object at instantiation', function ( ) {
            var Logger = this.Logger;
            var myConfig = {
                foo: 'bar'
            };
            Logger.bind( null, myConfig ).should.not.throw();
        } );

        it( 'can disable logging at instantiation', function ( ) {
            var Logger = this.Logger;
            var myConfig = {
                enable: false
            };
            var myLogger = new Logger( myConfig );
        } );

        it( 'accepts logging level configuration at instantiation', function ( ) {
            var Logger = this.Logger;
            var myConfig = {
                levels: [ 'yo', 'yarbp' ]
            };
            var myLogger = new Logger( myConfig );
        } );

        it( 'accepts logging alias at instantiation', function ( ) {
            var Logger = this.Logger;
            var myConfig = {
                aliases: {
                    yo: 'info'
                }
            };
            var myLogger = new Logger( myConfig );
        } );

        it( 'accepts a namespace for messages at instantiation', function ( ) {
            var Logger = this.Logger;
            var myConfig = {
                namespace: 'meow'
            };
            var myLogger = new Logger( myConfig );
        } );
    } );

    describe.skip( 'Relays', function ( ) {
        it( 'accepts appender configurations at instantiation' );

        it( 'accepts a simple appender references' );

        it( 'accepts configurations for each appender' );
    } );

} );
