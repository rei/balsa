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
var balsa = new require( 'balsa' )();

balsa.log( 'No relays added yet; This message will go nowhere.' );
```

### Add a relay

```js
var consoleRelay = new require( 'balsa/relay/console' )();
balsa.add( consoleRelay );

balsa.log( 'This will be logged to the console!' );
```

### Log at different levels

```js
balsa.log( 'Standard message' );
balsa.debug( 'Debug-level messages' );
balsa.info( 'Info-level message' );
balsa.warning( 'Warning-level message' );
balsa.error( 'Error-level message' );
```

### Add another relay

```js
var ajaxRelay = new require( 'balsa/relay/ajax' )( {
    host: 'log.example.com',
    port: 1234
} );
balsa.add( ajaxRelay );

balsa.log( 'This will be logged to the console AND to log.example.com:1234' );
```

### Remove a relay

```js
balsa.remove( consoleRelay );

balsa.log( 'This will now only log to log.example.com:1234' );
```

### Disable all logging

```js
balsa.disable();

balsa.log( 'Logging is completely disabled; This message will go nowhere.' );
```

## Configuration

You may configure balsa at instantiation time as in the following example. Please note that **all configuration is optional** and the following represents their **default values**.

```js
var balsa = new require( 'balsa' )( {

    // Enable/disable logging. Can be modified post-instantiation via `.enable()` and `.disable()`
    enable: true,

    // Define available logging levels, beginning with the most-severe
    levels: [
        'error',
        'warning',
        'info',
        'debug'
    ],

    // Define aliases for logging levels, alias:level, e.g., `log.err()` -> `log.error()`
    aliases: {
        err:    'error',
        warn:   'warning',
        log:    'info'
    },

    // Define default logging level. May be changed post-instantiation with `.maxLevel()`.
    // Relays may override this value in their own configuration.
    maxLevel: 'debug',

    // Define default message format. 
    messageFormat: '{{timestamp}} {{message}}',

    // Add an initial set of relays. Can be added post-instantiation with `.add()`
    relays: [
        new require( 'balsa/relay/console' )(),
        new require( 'balsa/relay/ajax' )( {
            host: 'log.example.com',
            port: 1234
        } )
    ];
} );

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
