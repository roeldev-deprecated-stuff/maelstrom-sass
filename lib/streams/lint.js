/**
 * maelstrom-sass | lib/streams/lint.js
 */
'use strict';

const _                   = require('underscore');
const GulpScssLint        = require('gulp-scss-lint');
const GulpScssLintStylish = require('gulp-scss-lint-stylish');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;

    /**
     * Lint Sass .scss files npm package _gulp-scss-lint_ and Ruby gem
     * _scss-lint_.
     */
    this.addStream('lint', function()
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
};
