'use strict';

var getUtil = function () {
    return require( '../lib/util' );
};

describe( 'Util', function () {
    describe( 'getISOTimestamp', function () {

        var ISO8601RE = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/;

        it( 'Returns the ISO 8601 timestamp', function () {
            var timestamp = getUtil().getTimestamp();
            ISO8601RE.test( timestamp ).should.be.ok;
        } );

        it( 'Uses a polyfill when `Date.prototype.toISOString` is not available', function () {
            Date.prototype.origToISOString  = Date.prototype.toISOString;
            Date.prototype.toISOString      = null;

            ISO8601RE.test( getUtil().getTimestamp() ).should.be.ok;

            Date.prototype.toISOString = Date.prototype.origToISOString;
        } );
    } );
} );
