/**
 * maelstrom-sass | lib/streams/css.js
 */
'use strict';

const _                = require('lodash');
const GulpAutoprefixer = require('gulp-autoprefixer');
const GulpCssNano      = require('gulp-cssnano');
const GulpIf           = require('gulp-if');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($isProd)
{
    let $stream;
    let $pluginCss = this.maelstrom.plugin('maelstrom-css');

    // when the css plugin exists, use it's css stream to further process the
    // generated css
    if ($pluginCss)
    {
        $stream = $pluginCss.stream('css');
    }
    else
    {
        let $configAutoprefixer = this.maelstrom.config.sass.autoprefixer;
        if (_.isUndefined($configAutoprefixer))
        {
            $configAutoprefixer = this.maelstrom.config.css.autoprefixer;
        }

        $stream = GulpAutoprefixer($configAutoprefixer);

        // minify when in production mode
        $stream.pipe( GulpIf(this.maelstrom.utils.isProd() || $isProd,
                             GulpCssNano()) );
    }

    return $stream;
};
