var balsa = new require( '../index' )( {
    relays: [
        new require( '../relays/console' )()
    ]
} );

balsa.debug( 'debug message' );
balsa.info( 'info message' );
balsa.warn( 'warn message' );
balsa.error( 'error message' );
