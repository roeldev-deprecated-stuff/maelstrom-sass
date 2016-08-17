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

const Maelstrom = require('maelstrom');

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
    },

    // executeTests: require('./utils/executeTests.js')
});

// -----------------------------------------------------------------------------

/**
 * Autoprefix and further minify the result when not `--dev`.
 */
$plugin.setStream('./streams/css.js');

/**
 * Compile Sass with _gulp-sass_ (_Libsass_).
 */
$plugin.setStream('./streams/libsass.js');

/**
 * Lint Sass .scss files with npm package _gulp-scss-lint_ and Ruby gem
 * _scss-lint_.
 */
$plugin.setStream('./streams/lint.js');

// -----------------------------------------------------------------------------

/**
 * Compile with the compiler set in the config/env vars.
 *
 * @WIP - Force libsass for now.
 */
$plugin.setTask('./tasks/default.js', [
                    Maelstrom.TASK_WATCH,
                    Maelstrom.TASK_COMPILE]);

/**
 *
 */
$plugin.setTask('./tasks/lint.js', [
                    Maelstrom.TASK_WATCH,
                    Maelstrom.TASK_LINT]);

/**
 *
 */
$plugin.setTask('./tasks/test.js', [Maelstrom.TASK_TEST]);

/**
 *
 */
$plugin.setTask('./tasks/docs.js', [Maelstrom.TASK_COMPILE]);

/**
 * Clean the CSS output dir from all excess files.
 */
$plugin.setTask('clean', [Maelstrom.TASK_CLEAN], function()
{
    Maelstrom.stream('clean', $plugin.dest());
});

// -----------------------------------------------------------------------------

module.exports = $plugin;
