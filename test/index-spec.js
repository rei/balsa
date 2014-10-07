'use strict';

var should  = require( 'should' );
var sinon   = require( 'sinon' );

var getLogger = function () {
    return require( '../index' );
};

var getBaseRelay = function () {
    return require( '../relays/base' );
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

            // Actually enables and disables logging
            var onLogSpy = sinon.spy();
            myLogger = new getLogger()( {
                relays: [ new getBaseRelay()( { onLog: onLogSpy } ) ]
            } );
            myLogger.log( 'foo' );
            myLogger.disable();
            myLogger.log( 'bar' );
            onLogSpy.calledOnce.should.be.ok;
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
            myLogger.config.relays[ 0 ].should.be.eql( { id: 'fake-id' } );

            // Can log via a relays added during initialization
            var onLogSpy = sinon.spy();
            var onLogSpy2 = sinon.spy();
            myLogger = new getLogger()( {
                relays: [
                    new getBaseRelay()( { onLog: onLogSpy } ),
                    new getBaseRelay()( { onLog: onLogSpy2 } )
                ]
            } );
            myLogger.log( 'foo' );
            onLogSpy.calledOnce.should.be.ok;
            onLogSpy2.calledOnce.should.be.ok;

            // Can be set post initialization
            myLogger = new getLogger()();
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

            // Can log via relays added after initialization
            onLogSpy.reset();
            onLogSpy2.reset();
            myLogger = new getLogger()();

            myLogger.add( new getBaseRelay()( { onLog: onLogSpy } ) );
            myLogger.log( 'foo' );
            onLogSpy.calledOnce.should.be.ok;

            myLogger.add( new getBaseRelay()( { onLog: onLogSpy2 } ) );
            myLogger.log( 'foo' );
            onLogSpy.calledTwice.should.be.ok;
            onLogSpy2.calledOnce.should.be.ok;
        } );

        it( 'can have relays removed', function () {
            var onLogSpy0 = sinon.spy();
            var onLogSpy1 = sinon.spy();
            var onLogSpy2 = sinon.spy();

            var myLogger = new getLogger()();
            myLogger.add( new getBaseRelay()( { onLog: onLogSpy0 } ) );
            myLogger.add( new getBaseRelay()( { onLog: onLogSpy1 } ) );
            myLogger.add( new getBaseRelay()( { onLog: onLogSpy2 } ) );

            myLogger.log( 'foo' );

            onLogSpy0.calledOnce.should.be.true;
            onLogSpy1.calledOnce.should.be.true;
            onLogSpy2.calledOnce.should.be.true;

            myLogger.remove( 1 );
            myLogger.config.relays.should.have.lengthOf( 2 );

            myLogger.log( 'bar' );
            onLogSpy0.calledTwice.should.be.true;
            onLogSpy1.calledOnce.should.be.true;
            onLogSpy2.calledTwice.should.be.true;
        } );

        it( 'can set a minimum logging level', function () {
            // Defaults to null
            var myLogger = new getLogger()();
            should( myLogger.config.minLevel === null).should.be.ok;

            // When null, logs ALL THE THINGS
            var onLogSpy = sinon.spy();
            myLogger.add( new getBaseRelay()( { onLog: onLogSpy } ) ) ;
            myLogger.debug( 'debug' );
            myLogger.error( 'error' );
            onLogSpy.calledTwice.should.be.true;

            // Can be set during initialization
            myLogger = new getLogger()( { minLevel: 'test-level' } );
            myLogger.config.minLevel.should.equal( 'test-level' );

            // Can be set post-initialization
            myLogger = new getLogger()();
            myLogger.minLevel( 'test-level-2' );
            myLogger.config.minLevel.should.equal( 'test-level-2' );

            // Does not log things below the minimum level
            onLogSpy.reset();
            myLogger = new getLogger()( { minLevel: 'error' } );
            myLogger.add( new getBaseRelay()( { onLog: onLogSpy } ) ) ;
            myLogger.debug( 'debug' );
            myLogger.error( 'error' );
            onLogSpy.calledOnce.should.be.true;
        } );

        it( 'can define a message prefix', function () {
            // Defaults to null
            var myLogger = new getLogger()();
            should( myLogger.config.prefix === null).should.be.ok;

            // Can be set during initialization
            myLogger = new getLogger()( {
                prefix: 'test-prefix'
            } );
            myLogger.config.prefix.should.equal( 'test-prefix' );

            // Can be set post-initialization
            myLogger = new getLogger()();
            myLogger.prefix( 'test-prefix-2' );
            myLogger.config.prefix.should.equal( 'test-prefix-2' );
        } );

        it( 'can define a message format', function () {
            // Defaults to '$TIMESTAMP $LEVEL\t$PREFIX\t$MESSAGES'
            var myLogger = new getLogger()();
            myLogger.config.messageFormat
                .should.equal( '$TIMESTAMP $LEVEL\t$PREFIX\t$MESSAGES' );

            // Can be set during initialization
            myLogger = new getLogger()( {
                messageFormat: 'test-messageFormat'
            } );
            myLogger.config.messageFormat.should.equal( 'test-messageFormat' );

            // Can be set post-initialization
            myLogger = new getLogger()();
            myLogger.messageFormat( 'test-messageFormat-2' );
            myLogger.config.messageFormat.should.equal( 'test-messageFormat-2' );
        } );
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
} );
