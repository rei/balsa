/**
 * Get a timestamp in ISO 8601 <http://en.wikipedia.org/wiki/ISO_8601> with IE8
 * compatability.
 *
 * Based on polyfill from
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 */
function pad( number ) {
  if ( number < 10 ) {
    return '0' + number;
  }
  return number;
}

var getISOTimestampCompat = function() {
    var d = new Date();
    return d.getUTCFullYear() +
        '-' + pad( d.getUTCMonth() + 1 ) +
        '-' + pad( d.getUTCDate() ) +
        'T' + pad( d.getUTCHours() ) +
        ':' + pad( d.getUTCMinutes() ) +
        ':' + pad( d.getUTCSeconds() ) +
        '.' + ( d.getUTCMilliseconds() / 1000 ).toFixed( 3 ).slice( 2, 5 ) +
        'Z';
};

// If no Date.prototype.toISOString available fall back to IE8 compat function
module.exports = Date.prototype.toISOString ? ( new Date() ).toISOString() : getISOTimestampCompat;
