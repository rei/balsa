# Balsa [![Build Status](https://travis-ci.org/reidev/balsa.svg?branch=master)](https://travis-ci.org/reidev/balsa)

> Lightweight, multi-relay JavaScript logging for the browser

Balsa is a lightweight logging library designed for use in the browser. It
supports consistent, cross-browser JavaScript `console` logging, as well as
asynchronous HTTP requests (AJAX) to send log messages to logging servers.

## Project Status

Work-in-progress. Please come back later :)

## Prerequisites

An environment that supports the
[CommonJS](http://wiki.commonjs.org/wiki/CommonJS) module pattern (`require`,
`module.exports`, etc.), e.g., [Node.js](http://nodejs.org/) or
[Browserify](http://browserify.org/).

## Basic Usage

The following example demonstrates a basic way of using Balsa:

```js
// Create a new Balsa logger
var Balsa = require( 'balsa' );
var balsa = new Balsa();

balsa.log( 'No relays added yet; This message will go nowhere.' );

// Add a relay to the console
balsa.add( new require( 'balsa/relay/console' )() );

balsa.log( 'This will be logged to the console!' );

// Start loggin'!
balsa.log( 'Standard message' );
balsa.debug( 'Debug-level messages' );
balsa.info( 'Info-level message' );
balsa.warning( 'Warning-level message' );
balsa.error( 'Error-level message' );
```

## API

To begin using Balsa, you must first import it with `require`. This step is
assumed for all API sections below.

```js
var Balsa = require( 'balsa' );
```

### new Balsa( [options] )

Instantiate a new balsa logger.

```js
var balsa = new Balsa();
```

You may configure balsa at instantiation time as in the following example.
Please note that **all configuration is optional** and the following represents
the **default value** of each optional configuration item.

```js
var balsa = new Balsa( {

    // Enable/disable logging. Can be modified post-instantiation via
    // `.enable()` and `.disable()`
    enable: true,

    // Logging prefix that will be prepended to each log message.
    prefix: undefined,

    // Define available logging levels, beginning with the most-severe
    levels: [
        'error',
        'warning',
        'info',
        'debug'
    ],

    // Define aliases for logging levels, alias:level, e.g.,
    // `log.err()` -> `log.error()`
    aliases: {
        err:    'error',
        warn:   'warning',
        log:    'info'
    },

    // Define default logging level. If undefined, all levels will be logged.
    // May be changed post-instantiation with `.maxLevel()`. Relays may override
    // this value in their own configuration.
    maxLevel: undefined,

    // Define default message format.
    messageFormat: '{{timestamp}} {{prefix}} {{message}}',

    // Add an initial set of relays. Can be added post-instantiation with
    // `.add()`
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
