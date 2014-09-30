
/** Get the numerical logging level from a `levelName`, case insensitive. If
    `levelName` is not a string, or is not found the logging `levels`,
    return -1.
*/
var getLevelCode = function ( levelName, levels ) {
    if ( typeof levelName !== 'string' ) return -1;
    levelName = levelName.toLowerCase();
    return levels.indexOf( levelName );
};

module.exports = getLevelCode;
