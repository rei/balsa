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

describe( 'Base Relay', function () {

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

    it( 'Supplies a log function to call when log events occur', function () {
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
} );
