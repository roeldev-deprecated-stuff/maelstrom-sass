/**
 * maelstrom-sass | lib/index.js
 *
 * Streams:
 * ✓ libsass
 * - ruby*
 * - compass*
 * ✓ lint
 * - test
 *
 * Tasks:
 * ✓ sass
 * ✓ sass:lint
 * - sass:test
 * - sass:clean
 */
'use strict';

const _                   = require('lodash');
const GulpAutoprefixer    = require('gulp-autoprefixer');
const GulpCssNano         = require('gulp-cssnano');
const GulpIf              = require('gulp-if');
const GulpReplace         = require('gulp-replace');
const GulpSass            = require('gulp-sass');
const GulpScssLint        = require('gulp-scss-lint');
const GulpScssLintStylish = require('gulp-scss-lint-stylish');
const GulpSize            = require('gulp-size');
const GulpSourceMaps      = require('gulp-sourcemaps');
const Path                = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom = this;
    const Config    = Maelstrom.config;
    const Gulp      = Maelstrom.gulp;
    const Utils     = Maelstrom.utils;

    // -------------------------------------------------------------------------

    let $plugin = new Maelstrom.Plugin(__filename, ['sass', 'scss'],
    {
        /**
         * Return the location of the Sass source files.
         */
        src: function($src)
        {
            let $defaultSrc = Config.src.sass + '/**/*.{sass,scss}';
            return Utils.extendArgs($src, $defaultSrc);
        },

        /**
         * Return the location of the CSS output folder.
         */
        dest: function()
        {
            return Config.dest.css;
        }
    });

    // -------------------------------------------------------------------------

    /**
     * Compile Sass with _gulp-sass_ (_Libsass_).
     */
    $plugin.addStream('libsass', function()
    {
        let $stream = GulpSass(Config.sass.libsass)
            .on('error', GulpSass.logError);

        // when source comments are active, replace the full path (including
        // disk etc.) to a relative shorter path. eg:
        // _/* line 36, D:/path/to/project/assets/scss/some-file.scss */_
        // becomes _/* line 36, ./assets/scss/some-file.scss */_
        if (Config.sass.libsass.sourceComments)
        {
            let $cwd = process.cwd();
            if (Path.sep === '\\')
            {
                $cwd = $cwd.replace(/\\/g, '/');
            }

            // regular expression to find the full path
            let $regexp = '(\/\* line [0-9]+, )('+ $cwd +')(.* \*\/)';

            // place all found parts back, except for the cwd part
            $stream.pipe( GulpReplace(new RegExp($regexp, 'g'), '$1.$3') );
        }

        return $stream;
    });

    /**
     * Lint Sass .scss files npm package _gulp-scss-lint_ and Ruby gem
     * _scss-lint_.
     */
    $plugin.addStream('lint', function()
    {
        let $config = Config.sass.scssLint;

        if (_.isUndefined($config.customReport))
        {
            $config.customReport = GulpScssLintStylish;
        }
        else if (!_.isFunction($config.customReport))
        {
            delete $config.customReport;
        }

        return GulpScssLint($config);
    });

    // -------------------------------------------------------------------------

    /**
     * Compile with the compiler set in the config/env vars.
     *
     * @WIP - Force libsass for now.
     */
    $plugin.addTask('sass', function()
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

        return Gulp.src( $plugin.src() )
            .pipe( Maelstrom.stream('plumber') )

            .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.init()) )
            .pipe( $plugin.stream($compiler) )
            // .pipe( Maelstrom.css()) )
            .pipe( GulpAutoprefixer($configAutoprefixer) )
            .pipe( GulpIf(Utils.isProd(), GulpCssNano()) )
            .pipe( GulpIf((Utils.isDev() && $createSourceMaps),
                          GulpSourceMaps.write()) )

            .pipe( Maelstrom.stream('size') )
            .pipe( Gulp.dest($plugin.dest()) );
            //.pipe( Maelstrom.stream('browsersync-reload') )
    });

    /**
     *
     */
    $plugin.addTask('sass:lint', function()
    {
        let $filesToExclude = '!' + Config.src.sass + '/maelstrom/*.scss';

        return Gulp.src( $plugin.src($filesToExclude) )
            .pipe( Maelstrom.stream('plumber') )
            .pipe( $plugin.stream('lint') );
    });

    return $plugin;
};
