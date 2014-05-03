/** Default console appender

    Default behavior is to proxy your environment's natural console behavior,
    e.g., `mylog.warn` will proxy `console.warn` directly respecting standard
    parameter patterns. (I.e., by default, this appender will not utilize
    message formatting.)

    Options:
        - formatMessages: If true, respect message format. Default: false.
        - verbose: If true, report errors with logging. Otherwise, fail siletnly. Default: false
*/
module.exports = function ( log ) {

    var FORMAT_ENABLED = log.config.formatMessages || false;
    var VERBOSE = log.config.verbose || false;

    var VERBOSE_PREFIX = '[balsa/ConsoleAppender]';

    // Log with raw messages unless `formatMessages` is set
    var message = FORMAT_ENABLED ? [ log.renderedMessage ] : log.messages;

    // Attempt to log
    try { console[ log.level ].apply( console, message );

    // Capture any errors. Report if `verbose` option set
    } catch ( err ) { if ( VERBOSE ) console.warn ( VERBOSE_PREFIX,
        'Problem logging at', log.level, ':', err
    ) };
};
