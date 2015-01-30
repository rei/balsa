'use strict';

var _ = require( 'lodash' );
var sinon = require( 'sinon' );

var getBase = function () {
    return require( '../../relays/base' );
};

var getUtil = function () {
    return require( '../../lib/util' );
};

var getTestLoggerConfig = function () {
    return {
        levels: [
            'low-level',
            'high-level'
        ],
        messageFormat:  '$TIMESTAMP $LEVEL $PREFIX $MESSAGE',
        prefix:         'prefix',
    };
};

describe( 'Base Relay', function () {

    it( 'requires to be created with the `new` operator', function () {
        var BaseRelay = getBase();
        var myRelay   = null;

        BaseRelay.should.be.a.Function;
        myRelay = new BaseRelay( { onLog: _.noop } );

        myRelay.should.be.an.Object;
        myRelay.should.not.be.an.instanceOf( BaseRelay );
    } );

    it( 'requires at least an `opts.onLog` callback function', function () {
        new getBase().bind( null ).should.throw( 'New relays must supply at least an `opts.onLog` callback function.' );
        new getBase().bind( null, { onLog: _.noop } ).should.not.throw();
    } );

    it( 'supplies a log function to call when log events occur', function () {
        var onLogSpy = sinon.spy();
        var myRelay = new getBase()( { onLog: onLogSpy } );
        myRelay.log( {
                timestamp:  getUtil().getTimestamp(),
                level:      'test-level',
                rawArgs:    [ 'foo', 'bar', 'fizz', 'bang' ]
            },
            getTestLoggerConfig()
        );
        onLogSpy.calledOnce.should.be.ok;
    } );

    it( 'calls the onLog callback with a log event', function ( done ) {
        var testTimestamp   = getUtil().getTimestamp();
        var testLevel       = 'test-level';
        var testRawArgs     = [ 'foo', 'bar', 'fizz', 'bang' ];
        var testPrefix      = 'myApp';
        var testMsgFmt      = '';


        var myRelay = new getBase()( {
            onLog: function ( logEvent ) {
                logEvent.should.have.properties( {
                    timestamp:  testTimestamp,
                    level:      testLevel,
                    prefix:     testPrefix,
                    rawArgs:    testRawArgs,
                    message:    ''
                } );
                done();
            }
        } );

        myRelay.log( {
                timestamp:  testTimestamp,
                level:      testLevel,
                rawArgs:    testRawArgs
            },
            {
                prefix:         testPrefix,
                messageFormat:  testMsgFmt
            }
        );
    } );

    it( 'renders the raw log message', function ( done ) {
        var myRelay = new getBase()( {
            onLog: function ( logEvent ) {
                logEvent.message.should.be.equal( 'timestamp level prefix message-arg-1 message-arg-2' );
                done();
            }
        } );
        myRelay.log( {
                timestamp:  'timestamp',
                level:      'level',
                rawArgs:    [ 'message-arg-1', 'message-arg-2' ]
            },
            getTestLoggerConfig()
        );
    } );

    it( 'accepts minLevel opt from relay config but falls back to logger config', function () {
        var onLogSpy    = sinon.spy();
        var levels      = getTestLoggerConfig().levels;
        var logEvent    = {
            timestamp:  getUtil().getTimestamp(),
            level:      levels[ 0 ],
            rawArgs:    [ 'foo', 'bar', 'fizz', 'bang' ]
        };

        // Relay config
        onLogSpy.reset();
        var myRelay = new getBase()( {
            minLevel:   levels[ 1 ],
            onLog:      onLogSpy
        } );
        myRelay.log( logEvent, getTestLoggerConfig() );
        onLogSpy.called.should.not.be.ok;

        // Logger config
        onLogSpy.reset();
        myRelay = new getBase()( { onLog: onLogSpy } );
        myRelay.log( logEvent,
            _.assign( {}, getTestLoggerConfig(), { minLevel: levels[ 1 ] } )
        );
        onLogSpy.called.should.not.be.ok;
    } );

    it( 'accepts messageFormat opt from relay config but falls back to logger config', function ( done ) {

        var doneCalled      = 0;
        var finish          = function () { if ( ++doneCalled === 2 ) done() };
        var logEventStub    = { timestamp: '', level: '', rawArgs: [] };

        var myRelay = new getBase()( {
            messageFormat:  'message-format-from-relay-config',
            onLog:          function ( logEvent ) {
                logEvent.message.should.be.equal( 'message-format-from-relay-config' );
                finish();
            }
        } );
        myRelay.log( logEventStub,
            _.assign( {}, getTestLoggerConfig(), {
                messageFormat:  'message-format-from-logger-config'
            } )
        );

        myRelay = new getBase()( {
            onLog:          function ( logEvent ) {
                logEvent.message.should.be.equal( 'message-format-from-logger-config' );
                finish();
            }
        } );
        myRelay.log( logEventStub,
            _.assign( {}, getTestLoggerConfig(), {
                messageFormat:  'message-format-from-logger-config'
            } )
        );
    } );
} );
