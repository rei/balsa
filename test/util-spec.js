'use strict';

var _ = require( 'lodash-node' );

var getUtil = function () {
    return require( '../lib/util' );
}

describe( 'Util', function () {
    describe( 'getISOTimestamp', function () {

        it( 'Returns the ISO 8601 timestamp', function () {
            var ISO8601RE = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/;
            var timestamp = getUtil().getTimestamp();

            ISO8601RE.test( timestamp ).should.be.ok;
        } );

        it( 'Uses a polyfill when `Date.prototype.toISOString` is not available', function () {
            Date.prototype.origToISOString  = Date.prototype.toISOString;
            Date.prototype.toISOString      = null;

            var control = (new Date()).origToISOString();
            var timestamp = getUtil().getTimestamp();

            timestamp.should.equal( control );

            Date.prototype.toISOString = Date.prototype.origToISOString;
        } );
    } );
} );
