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

    describe.only( 'Instantiation', function ( ) {

      it( 'requires to be created with the new operator', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        Logger.should.be.a.Function;
        myLogger = new Logger();

        myLogger.should.be.an.Object;
        myLogger.should.not.be.an.instanceOf( Logger );

      } );

      it( 'it does not require any parameters', function ( ) {
        var Logger = this.getInstance();
        Logger.bind( null, null ).should.not.throw();
      } );

      it( 'it returns a default logger if not parameters are passed', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        myLogger = new Logger();
        myLogger.should.have.properties( [
          'config',
          'error',
          'warn',
          'debug',
          'err',
          'warning'
        ] );
      } );

      it( 'will have a method to output errors', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        myLogger = new Logger();

        myLogger.error.should.be.a.Function;
        myLogger.error( 'test' );

        myLogger.err.should.be.a.Function;
        myLogger.err( 'test' );
      } );

      it( 'will have a method to output warnings', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        myLogger = new Logger();

        myLogger.warn.should.be.a.Function;
        myLogger.warn( 'test' );

        myLogger.warning.should.be.a.Function;
        myLogger.warning( 'test' );
      } );

      it( 'will have a method to output debug messages', function ( ) {
        var Logger = this.getInstance();
        var myLogger = null;

        myLogger = new Logger();

        myLogger.debug.should.be.a.Function;
        myLogger.debug( 'test' );
      } )
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
