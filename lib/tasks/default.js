/**
 * maelstrom-sass | lib/tasks/default.js
 */
'use strict';

const GulpIf         = require('gulp-if');
const GulpSassGlob   = require('gulp-sass-glob');
const GulpSourceMaps = require('gulp-sourcemaps');
const GulpWait       = require('gulp-wait');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        let $compiler = $maelstrom.config.sass.compiler;

        // force libsass for now
        $compiler = 'libsass';

        let $createSourceMaps = ($maelstrom.config.sass.sourcemaps !== false);

        return $maelstrom.gulp.src( $plugin.src() )
            .pipe( $maelstrom.stream('plumber') )

            // wait for the file to be saved and thus not be locked
            .pipe( GulpWait($maelstrom.config.sass.wait) )

            // optionally add sourcemaps
            .pipe( GulpIf(($maelstrom.utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.init()) )

            // compile sass, autoprefix and minify (when --prod)
            .pipe( GulpSassGlob() )
            .pipe( $plugin.stream($compiler) )
            .pipe( $plugin.stream('css') )

            // write the sourcemap to the file
            .pipe( GulpIf(($maelstrom.utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.write('./')) )

            .pipe( $maelstrom.stream('size') )
            .pipe( $maelstrom.gulp.dest($plugin.dest()) );
            //.pipe( $maelstrom.stream('browsersync-reload') )
    };
};
