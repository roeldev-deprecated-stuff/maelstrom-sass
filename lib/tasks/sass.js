/**
 * maelstrom-sass | lib/tasks/sass.js
 */
'use strict';

const _                = require('underscore');
const GulpAutoprefixer = require('gulp-autoprefixer');
const GulpCssNano      = require('gulp-cssnano');
const GulpIf           = require('gulp-if');
const GulpSize         = require('gulp-size');
const GulpSourceMaps   = require('gulp-sourcemaps');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const self      = this; // plugin object
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;
    const Gulp      = Maelstrom.gulp;
    const Utils     = Maelstrom.utils;

    /**
     * Compile with the compiler set in the config/env vars.
     *
     * @WIP - Force libsass for now.
     */
    this.addTask('sass', function()
    {
        let $compiler = Config.sass.compiler;

        // force libsass for now
        $compiler = 'libsass';

        let $configAutoprefixer = Config.sass.autoprefixer;
        if (_.isUndefined($configAutoprefixer))
        {
            $configAutoprefixer = Config.css.autoprefixer;
        }

        let $createSourceMaps = (Config.sass.sourcemaps !== false);

        return Gulp.src( self.src() )
            .pipe( Maelstrom.stream('plumber') )

            .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.init()) )
            .pipe( self.stream($compiler) )
            // .pipe( self.maelstrom.css()) )
            .pipe( GulpAutoprefixer($configAutoprefixer) )
            .pipe( GulpIf(Utils.isProd(), GulpCssNano()) )
            .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.write()) )

            .pipe( Maelstrom.stream('size') )
            .pipe( Gulp.dest(self.dest()) );
    });
};
