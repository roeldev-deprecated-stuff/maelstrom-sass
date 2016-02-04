/**
 * maelstrom-sass | lib/streams/lint.js
 */
'use strict';

var _                   = require('underscore');
var GulpScssLint        = require('gulp-scss-lint');
var GulpScssLintStylish = require('gulp-scss-lint-stylish');

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
        var $config = Config.sass.scssLint;

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
