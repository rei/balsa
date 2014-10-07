'use strict';

var pequire = require( 'proxyquire' );
var sinon   = require( 'sinon' );

var CONSOLE_RELAY_PATH  = '../../relays/console';
var TEST_RAW_ARGS       = [ 'test', 'message' ];

describe( 'Console Relay', function () {

    it( 'extends the base relay with on onLog callback function', function () {
        var myConsoleRelay = pequire( CONSOLE_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )();
        myConsoleRelay.should.have.properties( [ 'onLog' ] );
    } );

    it( 'proxies logging methods to the global console object', function () {
        var consoleLogSpy = sinon.spy();

        var origConsoleLog = console.log;
        console.log = consoleLogSpy;

        var myConsoleRelay = pequire( CONSOLE_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )( {
            formatMessage: false
        } );

        myConsoleRelay.onLog( {
            level: 'log',
            rawArgs: TEST_RAW_ARGS
        } );

        consoleLogSpy.calledOnce.should.be.true;
        consoleLogSpy.calledWith( TEST_RAW_ARGS[ 0 ], TEST_RAW_ARGS[ 1 ] ).should.be.true;

        console.log = origConsoleLog;
    } );

    it( 'sends the formatted message to the global console object', function () {
        var consoleLogSpy = sinon.spy();

        var origConsoleLog = console.log;
        console.log = consoleLogSpy;

        var myConsoleRelay = pequire( CONSOLE_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )();

        myConsoleRelay.onLog( {
            level: 'log',
            message: TEST_RAW_ARGS.join( ' ' )
        } );

        consoleLogSpy.calledOnce.should.be.true;
        consoleLogSpy.calledWith( TEST_RAW_ARGS.join( ' ' ) ).should.be.true;

        console.log = origConsoleLog;
    } );

    it( 'fails silently when a logging method does not exist on the console', function () {
        var consoleWarnSpy = sinon.spy();

        var origConsoleWarn = console.warn;
        console.warn        = consoleWarnSpy;

        var myConsoleRelay = pequire( CONSOLE_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )();

        myConsoleRelay.onLog( { level: 'non-existent-level' } );

        consoleWarnSpy.called.should.be.false;

        console.warn = origConsoleWarn;
    } );

    it( 'warns in verbose mode when method does not exist on the console', function () {
        var consoleWarnSpy = sinon.spy();

        var origConsoleWarn = console.warn;
        console.warn        = consoleWarnSpy;

        var myConsoleRelay = pequire( CONSOLE_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )( {
            verbose: true
        } );

        myConsoleRelay.onLog( { level: 'non-existent-level' } );

        consoleWarnSpy.calledOnce.should.be.true;

        console.warn = origConsoleWarn;
    } );
} );
