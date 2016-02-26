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
const Maelstrom           = require('../../maelstrom/lib/index.js');
const Path                = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

const $plugin = new Maelstrom.Plugin(__filename, ['sass', 'scss'],
{
    /**
     * Return the location of the Sass source files.
     */
    src: function($src)
    {
        let $defaultSrc = Maelstrom.config.src.sass + '/**/*.{sass,scss}';
        return Maelstrom.utils.extendArgs($src, $defaultSrc);
    },

    /**
     * Return the location of the CSS output folder.
     */
    dest: function()
    {
        return Maelstrom.config.dest.css;
    }
});

// -----------------------------------------------------------------------------

/**
 * Compile Sass with _gulp-sass_ (_Libsass_).
 */
$plugin.setStream('libsass', function()
{
    let $stream = GulpSass(Maelstrom.config.sass.libsass)
        .on('error', GulpSass.logError);

    // when source comments are active, replace the full path (including disk
    // etc.) to a relative shorter path. eg:
    // _/* line 36, D:/path/to/project/assets/scss/some-file.scss */_
    // becomes _/* line 36, ./assets/scss/some-file.scss */_
    if (Maelstrom.config.sass.libsass.sourceComments)
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
$plugin.setStream('lint', function()
{
    let $config = Maelstrom.config.sass.scssLint;

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

// -----------------------------------------------------------------------------

/**
 * Compile with the compiler set in the config/env vars.
 *
 * @WIP - Force libsass for now.
 */
$plugin.setTask('default',
                [Maelstrom.TASK_WATCH, Maelstrom.TASK_COMPILE],
                function()
{
    let $compiler = Maelstrom.config.sass.compiler;

    // force libsass for now
    $compiler = 'libsass';

    let $configAutoprefixer = Maelstrom.config.sass.autoprefixer;
    if (_.isUndefined($configAutoprefixer))
    {
        $configAutoprefixer = Maelstrom.config.css.autoprefixer;
    }

    let $createSourceMaps = (Maelstrom.config.sass.sourcemaps !== false);

    return Maelstrom.gulp.src( $plugin.src() )
        .pipe( Maelstrom.stream('plumber') )

        .pipe( GulpIf((Maelstrom.utils.isDev() && $createSourceMaps),
                      GulpSourceMaps.init()) )
        .pipe( $plugin.stream($compiler) )
        // .pipe( Maelstrom.css()) )
        .pipe( GulpAutoprefixer($configAutoprefixer) )
        .pipe( GulpIf(Maelstrom.utils.isProd(), GulpCssNano()) )
        .pipe( GulpIf((Maelstrom.utils.isDev() && $createSourceMaps),
                      GulpSourceMaps.write()) )

        .pipe( Maelstrom.stream('size') )
        .pipe( Maelstrom.gulp.dest($plugin.dest()) );
        //.pipe( Maelstrom.stream('browsersync-reload') )
});

/**
 *
 */
$plugin.setTask('lint', [Maelstrom.TASK_LINT], function()
{
    let $filesToExclude = '!' + Maelstrom.config.src.sass + '/maelstrom/*.scss';

    return Maelstrom.gulp.src( $plugin.src($filesToExclude) )
        .pipe( Maelstrom.stream('plumber') )
        .pipe( GulpIf(Maelstrom.config.sass.lint, $plugin.stream('lint')) );
});

/**
 * Clean the CSS output dir from all excess files.
 */
$plugin.setTask('clean', [Maelstrom.TASK_CLEAN], function()
{
    Maelstrom.stream('clean', $plugin.dest());
});

// -----------------------------------------------------------------------------

module.exports = $plugin;
