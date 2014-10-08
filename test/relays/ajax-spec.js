'use strict';

var _       = require( 'lodash-node' );
var pequire = require( 'proxyquire' );
var sinon   = require( 'sinon' );

var AJAX_RELAY_PATH  = '../../relays/ajax';

describe( 'AjaxRelay', function () {

    it( 'extends the base relay with on onLog callback function', function () {
        var myAjaxRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )( {
            endpoint: 'example.com'
        } );
        myAjaxRelay.should.have.properties( [ 'onLog' ] );
    } );

    it( 'passes along options to the base relay', function () {
        var CONSTRUCTOR_OPTS = {
            endpoint:       'example.com',
            messageFormat:  'foo',
            minLevel:       'bar'
        };

        var myConsoleRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts }
        } )( CONSTRUCTOR_OPTS );

        myConsoleRelay.should.have.properties( CONSTRUCTOR_OPTS );
    } );

    it( 'requires an endpoint option', function () {
        require( AJAX_RELAY_PATH ).bind( null )
            .should.throw( 'New Ajax relays must supply at least an `opts.endpoint` URL string.' );
    } );

    it( 'makes a post to the endpoint', function () {
        var atomicPostSpy = sinon.spy( function () {
            return {
                success: function () {
                    return {
                        error: _.noop
                    };
                }
            };
        } );

        var myAjaxRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts },
            atomic: { post: atomicPostSpy }
        } )( { endpoint: 'example.com' } );

        myAjaxRelay.onLog( 'foo' );

        atomicPostSpy.calledOnce.should.be.ok;
        atomicPostSpy.calledWith( 'example.com' ).should.be.ok;
    } );

    it( 'maps logData properties to logEvent properties', function () {
        var atomicPostSpy = sinon.spy( function () {
            return {
                success: function () {
                    return {
                        error: _.noop
                    };
                }
            };
        } );

        var myAjaxRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts },
            atomic: { post: atomicPostSpy }
        } )( {
            endpoint: 'example.com',
            logDataMap: {
                logFoo: 'eventFoo',
                logBar: 'eventBar'
            }
        } );

        myAjaxRelay.onLog( {
            eventFoo: 'derefEventFoo',
            eventBar: 'derefEventBar'
        } );

        atomicPostSpy.calledOnce.should.be.ok;
        atomicPostSpy.calledWith( 'example.com', {
            logFoo: 'derefEventFoo',
            logBar: 'derefEventBar'
        } ).should.be.ok;
    } );

    it( 'handles POST successes and errors', function () {
        var errorSpy = sinon.spy( function ( cb ) {
            cb();
        } );
        var successSpy = sinon.spy( function ( cb ) {
            cb();
            return { error: errorSpy };
        } );
        var atomicPostSpy = sinon.spy( function () {
            return { success: successSpy };
        } );

        var consoleInfoSpy = sinon.spy();
        var origConsoleInfo = console.info;
        console.info = consoleInfoSpy;

        var consoleWarnSpy = sinon.spy();
        var origConsoleWarn = console.warn;
        console.warn = consoleWarnSpy;

        // Verbose set
        var myAjaxRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts },
            atomic: { post: atomicPostSpy }
        } )( {
            endpoint:   'example.com',
            verbose:    true
        } );

        myAjaxRelay.onLog( 'foo' );

        successSpy.calledOnce.should.be.ok;
        consoleInfoSpy.calledOnce.should.be.ok;
        consoleInfoSpy.calledWith( 'Ajax log to "example.com" was successful.' ).should.be.ok;

        errorSpy.calledOnce.should.be.ok;
        consoleWarnSpy.calledOnce.should.be.ok;
        consoleWarnSpy.calledWith( 'Warning: Ajax log to "example.com" was NOT successful.' ).should.be.ok;

        // Verbose cleared
        errorSpy.reset();
        successSpy.reset();
        atomicPostSpy.reset();

        consoleInfoSpy.reset();
        consoleWarnSpy.reset();

        myAjaxRelay = pequire( AJAX_RELAY_PATH, {
            './base': function ( opts ) { return opts },
            atomic: { post: atomicPostSpy }
        } )( { endpoint: 'example.com' } );

        myAjaxRelay.onLog( 'foo' );

        successSpy.calledOnce.should.be.ok;
        consoleInfoSpy.calledOnce.should.not.be.ok;

        errorSpy.calledOnce.should.be.ok;
        consoleWarnSpy.calledOnce.should.not.be.ok;

        console.info = origConsoleInfo;
        console.warn = origConsoleWarn;
    } );
} );
