'use strict';

var _ = require( 'lodash-node' );
var sinon = require( 'sinon' );

var getBase = function () {
    return require( '../relays/base' );
};

var getDefaultConfig = function () {
    return require( '../lib/default-config' );
};

var getUtil = function () {
    return require( '../lib/util' );
};

describe.only( 'Base Relay', function () {

    it( 'requires to be created with the `new` operator', function () {
        var BaseRelay = getBase();
        var myRelay   = null

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
                level:      'error',
                rawArgs:    [ 'foo', 'bar', 'fizz', 'bang' ]
            },
            getDefaultConfig()
        );
        onLogSpy.calledOnce.should.be.ok;
    } );

    it( 'calls the onLog callback with a log event', function ( done ) {
        var testTimestamp   = getUtil().getTimestamp();
        var testLevel       = 'error';
        var testRawArgs     = [ 'foo', 'bar', 'fizz', 'bang' ];
        var testPrefix      = 'myApp';
        var testMsgFmt      = ''


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

    it( 'relay minLevel opt clobbers logger config', function () {
        var onLogSpy    = sinon.spy();
        var levels      = getDefaultConfig().levels;
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
        myRelay.log( logEvent, getDefaultConfig() );
        onLogSpy.called.should.not.be.ok;

        // Logger config
        onLogSpy.reset();
        var myRelay = new getBase()( { onLog: onLogSpy } );
        myRelay.log( logEvent,
            _.assign( {}, getDefaultConfig(), { minLevel: levels[ 1 ] } )
        );
        onLogSpy.called.should.not.be.ok;
    } );
} );
