/**
 * Utility module.
 */
var _isString = require( 'lodash-node/compat/objects/isString' );

/**
 * Get a timestamp in ISO 8601 <http://en.wikipedia.org/wiki/ISO_8601> with a
 * IE8 compatability fallback.
 *
 * Based on polyfill from http://mdn.io/date.prototype.toISOString
 */
var getISOTimestamp = function () {

    var d = new Date();

    // If Date.prototype.toISOString is available, just use that
    if ( Date.prototype.toISOString ) {
        return d.toISOString()
    }

    var pad = function ( number ) {
      if ( number < 10 ) { return '0' + number }
      return number;
    }

    return d.getUTCFullYear() +
        '-' + pad( d.getUTCMonth() + 1 ) +
        '-' + pad( d.getUTCDate() ) +
        'T' + pad( d.getUTCHours() ) +
        ':' + pad( d.getUTCMinutes() ) +
        ':' + pad( d.getUTCSeconds() ) +
        '.' + ( d.getUTCMilliseconds() / 1000 ).toFixed( 3 ).slice( 2, 5 ) +
        'Z';
};

// Expose utilities
module.exports = {
    getTimestamp: getISOTimestamp
}
