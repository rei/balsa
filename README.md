# balsa [![Build Status](https://travis-ci.org/reidev/balsa.svg?branch=master)](https://travis-ci.org/reidev/balsa)

> Lightweight, multi-relay JavaScript logging for the browser

Balsa is a lightweight logging library designed for use in the browser. It
supports consistent, cross-browser JavaScript `console` logging, as well as
asynchronous HTTP requests (AJAX) to send log messages to logging servers.

## Project Status

Work-in-progress. Please come back later :)

## Prerequisites

An environment that supports the [CommonJS](http://wiki.commonjs.org/wiki/CommonJS)
module pattern (`require`, `module.exports`, etc.), e.g.,
[Node.js](http://nodejs.org/) or [Browserify](http://browserify.org/).

## Examples

### Create a new `balsa` logger

```js
var balsa = Object.create( require( 'balsa' ) );

balsa.log( 'No relays added yet; This message will go nowhere.' );
```

### Add a console relay

```js
balsa.add( require( 'balsa/relay/console' ) );

balsa.log( 'This will be logged to the console!' );
```

### Add an AJAX relay

```js
balsa.add( require( 'balsa/relay/ajax' ), {
    host: 'log.example.com',
    port: 1234
} );

balsa.log( 'This will be logged to the console and to log.example.com:1234' );
```

## Disable all logging

```js
balsa.disable();

balsa.log( 'Logging is completely disabled.' );
```

## Example (Old, configuration-based)

```js
var Logger          = require( 'balsa' );
var consoleAppender = require( 'balsa/appender/console' );
var netAppender     = require( 'balsa/appender/net' );


// Create a new logger
var log = new Logger( {

    // Logger configuration. Showing DEFAULT values. All values, including the
    // `config` object are OPTIONAL.
    config: {

        // Enable/disable logging for this logger
        enableLogging: true,

        // Define logging levels. `log.error`, `log.warning`, etc.
        levels: [
            'error',
            'warning',
            'info',
            'debug'
        ],

        // Define aliases for levels. `log.err` -> `log.error`, etc.
        aliases: {
            err:    'error',
            warn:   'warning',
        },

        // Default appender configurations. All appenders will have this
        // configuration unless overridden.
        appenderConfig: {

            // Define default maximum logging level for appenders
            maxLevel: 'error',

            // Define default message format for appenders
            messageFormat: '{{timestamp}} {{message}}',

        },
    },

    // Register appenders
    appenders: {

        // Appender with NO config overrides
        console: ConsoleAppender,

        // Appender WITH config overrides
        net: {
            appender: NetAppender,
            config: {
                maxLevel: 'warning',
                messageFormat: '{{timestamp}} {{message}} {{url}} {{userAgent}}'
            }
        }
    };
} );


// Log things at different levels
log.debug( 'Secrets' );
log.info( 'Yo' );
log.warning( 'Whoa' );
log.error( 'OMG ERROR' );

log.warn( 'Whoa 2' );
log.err( 'OMG ERROR 2' );

```


## Specifying Appenders

Appenders are specified in the `appenders` section when instantiating a new
logger.

### Minimal

The simplest way to enable an appender is to create a name -> appender
reference in the `appenders` section when instantiating a new Logger:

```js
var Logger          = require( 'balsa' );
var ConsoleAppender = require( 'balsa/appenders/console' );

var log = new Logger( {
    appenders: {
        console: ConsoleAppender
    }
} );
```

### Configure an Appender

To define a configuration for an appender, create a name -> appender object
in the `appenders` section like so:

```js
var Logger          = require( 'balsa' );
var ConsoleAppender = require( 'balsa/appenders/console' );

var log = new Logger( {

    appenders: {

        console: {

            // Reference to the appender
            appender: ConsoleAppender,

            // Configuration for the appender
            config: {

                // Maximum level this appender will log at
                maxLevel: 'error',

                // Message format
                messageFormat: '{{timestamp}} {{message}}',

                // Interpret level names as other level names within this
                // appender
                levelInterp: {
                    error:      'error',
                    warning:    'warn',
                    info:       'info',
                    debug:      'log'
                }
            }
        }
    }
} );
```

### Define Default Configuration for All Appenders

Configure default appender configurations in the `config.appenderConfig`
section, i.e., all appenders will have the specified configuration unless they
specify their own `config`:

```js
var Logger          = require( 'balsa' );
var ConsoleAppender = require( 'balsa/appenders/console' );

var log = new Logger( {

    // Logger configuration
    config: {

        // Default appender configurations. All appenders will have these
        // configuration values unless overridden.
        appenderConfig: {

            maxLevel: 'info',

            messageFormat: '{{timestamp}} {{message}}',
        },
    },

    // Register appenders
    appenders: {

        // Appender with NO config overrides. Will adopt default configuration
        // specified above
        console: ConsoleAppender,

        // Appender WITH config overrides. Will overwrite specified config
        // values.
        console2: {
            appender: ConsoleAppender,
            config: {
                maxLevel:       'warning',
                messageFormat:  '{{timestamp}} {{message}} {{url}} {{userAgent}}',
                levelInterp: {
                    error:      'error',
                    warning:    'warn',
                    info:       'info',
                    debug:      'log'
                }
            }
        }
    };
} );
