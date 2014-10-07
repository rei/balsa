var gulp        = require( 'gulp' );
var gutil       = require( 'gulp-util' );
var istanbul    = require( 'gulp-istanbul' );
var mocha       = require( 'gulp-mocha' );
var jshint      = require( 'gulp-jshint' );

var JS_SRC = [ 'index.js', 'lib/**/*.js', 'relays/**/*.js' ];
var TEST_SRC = [ 'test/**/*.js' ];

// Run unit tets. Pass `--cover` if you'd also like a coverage report.
gulp.task( 'test', function ( cb ) {

    // If `--cover` is not set, just run tests
    if ( !gutil.env.cover ) {
        gulp.src( [ 'test/**/*.js' ] )
            .pipe( mocha() )
            .on( 'end', cb );
    }

    gulp.src( JS_SRC )
        .pipe( istanbul( { includeUntested: true } ) )
        .on( 'finish', function () {
            gulp.src( TEST_SRC )
                .pipe( mocha() )
                .pipe( istanbul.writeReports( {
                    reporters: [ 'text' ]
                } ) )
                .on( 'end', cb );
        } );
} );

// Run JS hint
gulp.task( 'jshint', function () {
    return gulp.src( JS_SRC.concat( TEST_SRC ) )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'default' ) )
        .pipe( jshint.reporter( 'fail' ) );
} );
