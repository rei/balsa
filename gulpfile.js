var gulp        = require( 'gulp' );
var gutil       = require( 'gulp-util' );
var istanbul    = require( 'gulp-istanbul' );
var mocha       = require( 'gulp-mocha' );

// Run unit tets. Pass `--cover` if you'd also like a coverage report.
gulp.task( 'test', function ( cb ) {

    if ( !gutil.env.cover ) {
        gulp.src( [ 'test/**/*.js' ] )
            .pipe( mocha() )
            .on( 'end', cb );
    }

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
