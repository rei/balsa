var Logger = require( './index' );
var ConsoleAppender = require( './appenders/console' );

var LEVELS = [

    // Default levels
    'debug',
    'info',
    'warn',
    'error',

    // Aliases
    'err',
    'warning'
];

var LOGGERS = {

    simple: new Logger( {
        appenders: {
            console: ConsoleAppender
        }
    } ),

    configured: new Logger( {
        appenders: {
            console: {
                appender: ConsoleAppender,
                config: {
                    levelInterp: {
                        debug: 'log',
                        warning: 'warn'
                    }
                }
            }
        }
    } ),

    multi_simple: new Logger( {
        appenders: {
            console: ConsoleAppender,
            console2: ConsoleAppender
        }
    } ),

    mutli_configured: new Logger( {
        appenders: {
            console: {
                appender: ConsoleAppender,
                config: {
                    levelInterp: {
                        debug: 'log',
                        warning: 'warn'
                    }
                }
            },
            console2: {
                appender: ConsoleAppender,
                config: {
                    levelInterp: {
                        debug: 'log',
                        warning: 'warn'
                    }
                }
            }
        }
    } ),

    multi_mixed: new Logger( {
        appenders: {
            console: ConsoleAppender,
            console2: {
                appender: ConsoleAppender,
                config: {
                    levelInterp: {
                        debug: 'log',
                        warning: 'warn'
                    }
                }
            }
        }
    } ),

    format_console_messages: new Logger( {
        appenders: {
            console: {
                appender: ConsoleAppender,
                config: {
                    levelInterp: {
                        debug: 'log',
                        warning: 'warn'
                    },
                    messageFormat: '[{{timestamp}}] [{{level}}]\t{{{messages}}}',
                    formatMessages: true,
                }
            }
        }
    } ),

    verbose_console: new Logger( {
        appenders: {
            console: {
                appender: ConsoleAppender,
                config: {
                    verbose: true,
                }
            }
        }
    } ),
};

for ( var log in LOGGERS ){
    var curLogger = LOGGERS[ log ];

    console.log( '---- Running "', log, '" logger ----');

    for ( var i = 0; i < LEVELS.length; ++i ) {
        var curLevel = LEVELS[ i ];

        curLogger[ curLevel ]( 'Logging for', curLevel );
    }
}
