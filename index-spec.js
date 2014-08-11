'use strict';

require( 'should' );
var proxyquire = require( 'proxyquire' );
var sinon = require( 'sinon' );


describe( '***REDACTED*** JS Log', function ( ) {
    before( function ( ) {
      var self = this;
      self.getInstance = function ( ) {
        return require( '../index' );
      };
    } );


    describe( 'Constructor', function ( ) {

      it( 'is type constructor', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        Logger.should.be.a.Function;

        myLogger = new Logger();
        myLogger.should.be.an.instanceOf( Logger );
      } );

      it( 'it does not require any parameters', function ( ) {
        var Logger = this.getInstance();
        Logger.bind( null, null ).should.not.throw();
      } );
    } );

    describe( 'Configurations', function ( ) {
        it( 'accepts configuration object at instantiation', function ( ) {
          var Logger = this.getInstance();
          var myConfig = {
            foo: bar
          };
          Logger.bind( null, myConfig ).should.not.throw();
        } );

        it( 'accepts a toggle configuration' );
        it( 'accepts logging level configuration' );
        it( 'accepts logging alias' );
        it( 'accepts a namespace for messages' );
        it( 'accepts appenders at instantiation' );
    } );

    describe( 'Appenders', function ( ) {
      it( '')
    } );

} );
