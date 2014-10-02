var balsa = new require( '../index' )( {
    relays: [
        new require( '../relays/console' )()
    ]
} );

balsa.log( 'hello' );
