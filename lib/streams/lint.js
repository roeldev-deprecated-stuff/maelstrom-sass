/**
 * maelstrom-sass | lib/streams/lint.js
 */
'use strict';

const _                   = require('lodash');
const GulpScssLint        = require('gulp-scss-lint');
const GulpScssLintStylish = require('gulp-scss-lint-stylish');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let $config = this.maelstrom.config.sass.scssLint;

    if (_.isUndefined($config.customReport))
    {
        $config.customReport = GulpScssLintStylish;
    }
    else if (!_.isFunction($config.customReport))
    {
        delete $config.customReport;
    }

    return GulpScssLint($config);
};
