/**
 * Utility module.
 */
var _isString = require( 'lodash-node/compat/objects/isString' );
var _isArray = require( 'lodash-node/compat/objects/isArray' );

/**
 * Get the numerical logging level from a `levelName`, case insensitive. If
 * `levelName` is not found in the logging `levels`, return -1.
 *
 * @param {string}  levelName   - The name of the level
 * @param {array}   levels      - An array of level names (strings)
 */
var getLevelCode = function ( levelName, levels ) {
    if ( !_isString( levelName ) || !_isArray( levels ) ) {
        return -1;
    }
    levelName = levelName.toLowerCase();
    return levels.indexOf( levelName );
};

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
    getLevelCode: getLevelCode,
    getTimestamp: getISOTimestamp
}
