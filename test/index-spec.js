'use strict';
require( 'should' );
var proxyquire  = require( 'proxyquire' );
var sinon       = require( 'sinon' );

var getInstance = function ( ) {
    return require( '../index' );
};

describe( 'Balsa', function ( ) {

    describe.only( 'during initialization', function ( ) {

        it( 'requires to be created with the `new` operator', function () {
            var Logger      = getInstance();
            var myLogger    = null;

            Logger.should.be.a.Function;
            myLogger = new Logger();

            myLogger.should.be.an.Object;
            myLogger.should.not.be.an.instanceOf( Logger );
        } );

        it( 'does not require any parameters', function () {
            var Logger = getInstance();
            Logger.bind( null, null ).should.not.throw();
        } );

        it( 'returns a logger with the expected API', function () {
            var Logger      = getInstance();
            var myLogger    = new Logger();

            myLogger = new Logger();
            myLogger.should.have.properties( [

                // Logging functions and their aliases
                'debug',
                'info',     'log',
                'warning',  'warn',
                'error',    'err',

                // Other API functions
                'enable',   'disable',
                'add',      'remove',
                'prefix',   'minLevel',
                'messageFormat'
            ] );
        } );
    } );

    describe( 'Logging API', function ( ) {

        beforeEach( function ( ) {
            this.myLogger = new getInstance()();
        } );

        it( 'will have a method to output errors', function ( ) {
            var myLogger = this.myLogger;

            myLogger.error.should.be.a.Function;
            myLogger.error.bind( null, 'error here' ).should.not.throw();

            myLogger.err.should.be.a.Function;
            myLogger.err.bind( null, 'err, alias for error here' ).should.not.throw();
        } );

        it( 'will have a method to output warnings', function ( ) {
            var myLogger = this.myLogger;

            myLogger.warn.should.be.a.Function;
            myLogger.warn.bind( null, 'warn here' ).should.not.throw();

            myLogger.warning.should.be.a.Function;
            myLogger.warning.bind( null, 'warning, alias for warn here' ).should.not.throw();
        } );

        it( 'will have a method to output infomational messages', function ( ) {
            var myLogger = this.myLogger;

            myLogger.info.should.be.a.Function;
            myLogger.info.bind( null, 'info here' ).should.not.throw();

        } );

        it( 'will have a method to output debug messages', function ( ) {
            var myLogger = this.myLogger;

            myLogger.debug.should.be.a.Function;
            myLogger.debug.bind( null, 'debug here' ).should.not.throw();
        } );
    } );

    describe( 'Configurations', function ( ) {

        beforeEach( function ( ) {
            this.Logger = getInstance();
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

    describe( 'Appenders', function ( ) {
        it( 'accepts appender configurations at instantiation' );

        it( 'accepts a simple appender references' );

        it( 'accepts configurations for each appender' );
    } );

} );
