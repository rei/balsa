# Balsa [![Build Status](https://travis-ci.org/reidev/balsa.svg?branch=master)](https://travis-ci.org/reidev/balsa)

> Lightweight, multi-relay JavaScript logging for the browser

Balsa is a lightweight, multi-relay logging library designed for use in the
browser. It includes a relay for consistent, cross-browser JavaScript `console`
logging, as well as an AJAX relay to send log messages to logging servers.

## Project Status

Work-in-progress. Please come back later :)

## Prerequisites

An environment that supports the
[CommonJS](http://wiki.commonjs.org/wiki/CommonJS) module pattern (`require`,
`module`, `exports`, etc.), e.g., [Node.js](http://nodejs.org/), but it really
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
balsa.debug( 'Debug message' );
balsa.info( 'Info message' );
balsa.warn( 'Warning message' );
balsa.error( 'Error message' );
```

## Initialization

To begin using Balsa, you must first import it with `require`, and create a new
instance. All API functions assume this step.

```js
var balsa = new require( 'balsa' )();
```

You may configure Balsa during instantiation as in the following example.

Please note that **all configuration is optional** and the following represents
the default value of each optional configuration item.

```js
var balsa = new require( 'balsa' )( {

    // Enable/disable logging. Can be modified post-instantiation via
    // `.enable()` and `.disable()`
    enable: true,

    // Logging prefix that will be prepended to each log message, e.g., [myApp]
    prefix: undefined,

    // Define default logging level. If 'all', all levels will be logged. May be
    // changed post-instantiation with `.maxLevel()`. Relays may override this
    // value in their own configuration.
    maxLevel: 'all',

    // Define the message format. Relays may override this value in their own
    // configuration.
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

Log a message at the specified level. There are 4 available levels, from most to
least severe:

1. `error`, `err`
2. `warning`, `warn`
3. `info`, `log`
4. `debug`

```js
balsa.debug( 'Debug message' );

balsa.info( 'Info message' );
balsa.log( 'Also an info message' );

balsa.warning( 'Warning message' );
balsa.warn( 'Also a warning message' );

balsa.error( 'Error message' );
balsa.err( 'Also an error message' );
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

### balsa.prefix( *prefix* )

Set the prefix that will be prepended to every log message.

```js
// Prefix all messages with '[myApp]'
balsa.prefix( '[myApp]' );
```

### balsa.maxLevel( *maxLevel* )

Sets the maximum default level message that will be logged. If 'all', all levels
will be logged.

Note that relays may define their own max level, which will override this value
for those relays.

```js
// Only log warnings and below (error)
balsa.maxLevel( 'warning' );
```

### balsa.messageFormat( *messageFormat* )

Sets the format each message will be outputted as. Available variables are:

- `$TIMESTAMP` - Timestamp of the log, in [ISO 8601](http://en.wikipedia.org/wiki/ISO_8601)
- `$PREFIX` - The message prefix
- `$MESSAGE` - The message body

```js
// Configures the message format, e.g.,
// 2014-09-30T18:58:45+08:00, [myApp], Log message
balsa.messageFormat( '$TIMESTAMP, $PREFIX, $MESSAGE' );
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

Relays are where your log messages get sent to. You can attach 0 or more relays
to any Balsa instance.

### Relay configuration

All relays may define their own max levels, e.g., one relay may log messages of
all levels, and another may log only `error`-level messages.

All relays may also define their own message formats, e.g., one relay may format
its messages with a timestamp, and another relay may choose to omit the
timestamp.

```js
// Add a new console relay that logs all levels, and has a message format of
// `$PREFIX: $MESSAGE`
balsa.add( new require( 'balsa/relays/console' )( {
    maxLevel: 'all',
    messageFormat: '$PREFIX: $MESSAGE'
} ) );
```

### Core relays

Balsa comes with two relays, `console` and `ajax`.

#### console

A cross-browser relay. Uses the browser's build-in JavaScript console functions
or if the `console` object does not exist, the logger will fail silently to
prevent runtime errors.

```js
balsa.add( new require( 'balsa/relays/console' )() );
```

#### ajax

An AJAX relay. Allows you to make an AJAX call to a REST service. Two
configuration options, `host` and `port` are required, but `type` is optional.

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

TODO: Finish this section.

## Inspiration

- [Apache log4j](http://logging.apache.org/log4j/2.x/)
- [winston](https://github.com/flatiron/winston)
- [minilog](https://github.com/mixu/minilog)
