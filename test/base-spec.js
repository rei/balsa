'use strict';

var _ = require( 'lodash-node' );

var getBase = function () {
    return require( '../relays/base' );
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

    it.skip( 'Supplies a log function to call when log events occur', function () {
        var onLogCalled = false;
        var myRelay = new getBase()( { onLog: function () { onLogCalled = true } } );
        myRelay.log();
        onLogCalled.should.be.ok();
    } );
} );
