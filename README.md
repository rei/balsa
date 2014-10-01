# Balsa [![Build Status](https://travis-ci.org/reidev/balsa.svg?branch=master)](https://travis-ci.org/reidev/balsa)

> Lightweight, multi-relay JavaScript logging for the browser

Balsa is a lightweight, multi-relay logging library designed for use in the
browser. It includes a relay for consistent, cross-browser JavaScript `console`
logging, as well as an AJAX relay to send log messages to logging servers.

The goal is to combine the power and flexibility of
[Apache log4j](http://logging.apache.org/log4j/2.x/), the easy API of
[winston](https://github.com/flatiron/winston), and the tiny footprint of
[minilog](https://github.com/mixu/minilog).

## Project Status

Work-in-progress. Please come back later :)

## Prerequisites

An environment that supports the
[CommonJS](http://wiki.commonjs.org/wiki/CommonJS) module pattern (`require`,
`module.exports`, etc.), e.g., [Node.js](http://nodejs.org/) but it really
shines when bundled with [Browserify](http://browserify.org/) and used in the
browser.

## Basic Usage

```js
// Create a new Balsa logger
var balsa = new require( 'balsa' )();

balsa.log( 'No relays added yet; This message will go nowhere.' );

// Add a `console` relay
balsa.add( new require( 'balsa/relay/console' )() );

balsa.log( 'This will be logged to the console!' );

// Start loggin'!
balsa.log( 'Standard message' );
balsa.debug( 'Debug-level messages' );
balsa.info( 'Info-level message' );
balsa.warning( 'Warning-level message' );
balsa.error( 'Error-level message' );
```

## Initialization

To begin using Balsa, you must first import it with `require`, and instantiate
a new Balsa object. All API functions assume this step.

```js
var balsa = new require( 'balsa' )();
```

You may configure Balsa at instantiation time as in the following example.

Please note that **all configuration is optional** and the following represents
the default value of each optional configuration item.

```js
var balsa = new require( 'balsa' )( {

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
    // May be changed post-instantiation with `.setMaxLevel()`. Relays may
    // override this value in their own configuration.
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

## API

After [initialization](#initialization), you may use any of the following
functions.

### balsa.{debug, info, warning, error, etc.}( *message* )

Log a message at the specified level. Levels correspond to the levels 
configured during initilization.

```js
balsa.debug( 'Debug-level messages' );
balsa.info( 'Info-level message' );
balsa.warning( 'Warning-level message' );
balsa.error( 'Error-level message' );
```

### balsa.enable()

Enable logging.

```js
balsa.enable();
```

### balsa.disable()

Disables all logging.

```js
balsa.disable();
```

### balsa.setPrefix( *prefix* )

Sets the *prefix* that will be prepended to every log message.

```js
// Prefix all messages with '[myApp]'
balsa.setPrefix( '[myApp]' );
```

### balsa.setMaxLevel( *maxLevel* )

Sets the *maxLevel* that will be logged. If the level does not exist, all
levels will be logged.

```js
// Only log warnings and above
balsa.setMaxLevel( 'warning' );
```

### balsa.setMessageFormat( *messageFormat* )

Sets the *messageFormat* that each message will be outputted as. Available
variables are:

- `{{timestamp}}` - Timestamp of the log, in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601)
- `{{prefix}}` - The message prefix
- `{{message}}` - The message body

```js
// Configures the message format, e.g.,
// '2014-09-30T18:58:45+00:00 // [myApp] // Log message'
balsa.setMessageFormat( '{{timestamp}} // {{prefix}} // {{message}}' );
```

### balsa.add( *relay* )

Adds a new *relay* to the logger.

```js
// Adds an AJAX relay with a custom level, a host, and a port.
balsa.add( new require( 'balsa/relays/ajax' )( {
    maxLevel: 'error',
    host: 'logs.example.com',
    port: 1234
} ) );
```

### balsa.remove( *relay* )

Removes a *relay* from the logger.

```js
// Create a new AJAX relay
var ajaxRelay = new require( 'balsa/relays/ajax' )( {
    maxLevel: 'error',
    host: 'logs.example.com',
    port: 1234
} )

// Add relay
balsa.add( ajaxRelay );

// Remove relay
balsa.remove( ajaxRelay );
```

## Relays

Relays are where your log messages get sent to. You can attach as many relays
as you want to your Balsa logger.

All relays can be configured with their own max levels, i.e., one relay may log
messages of all levels, and another may log only `error`-level messages.

### Core relays

Balsa comes with two relays, `console` and `ajax`, but you can make your own
as well!

#### console

A cross-browser relay. Uses the browser's build-in JavaScript console functions
or if the `console` object does not exist, the logger will fail silently to
prevent runtime errors.

```js
balsa.add( new require( 'balsa/relays/console' )() );
```

#### ajax

An AJAX relay. Allows you to make an AJAX call to a REST service. Two
configuration options, `host` and `port` are required.

```js
balsa.add( new require( 'balsa/relays/ajax' )( {

    // Host to send the request to
    host: 'logs.example.com',

    // Port to which the target service is bound
    port: 1234,

    // Type of HTTP method [default:'POST']
    type: 'POST'
} ) );
```

### Custom relays

You may also make your own relays. Use the core relays as examples, and
`require` them as you would a core relay.
