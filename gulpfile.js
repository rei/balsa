var gulp        = require( 'gulp' );
var istanbul    = require( 'gulp-istanbul' );
var mocha       = require( 'gulp-mocha' );

// Test with coverage
gulp.task( 'test', function ( cb ) {
  gulp.src( [ 'index.js', 'lib/**/*.js', 'relays/**/*.js' ] )
    .pipe( istanbul( {
        includeUntested: true
    } ) )
    .on( 'finish', function () {
      gulp.src( [ 'test/**/*.js' ] )
        .pipe( mocha() )
        .pipe( istanbul.writeReports( {
            reporters: [ 'text' ]
        } ) )
        .on( 'end', cb );
    });
});
