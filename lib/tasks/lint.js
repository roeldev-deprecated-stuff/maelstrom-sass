/**
 * maelstrom-sass | lib/tasks/lint.js
 */
'use strict';

const GulpIf = require('gulp-if');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        let $filesToExclude = '!' + $maelstrom.config.src.sass +
                              '/maelstrom/*.scss';

        return $maelstrom.gulp.src( $plugin.src($filesToExclude) )
            .pipe( $maelstrom.stream('plumber') )
            .pipe( GulpIf($maelstrom.config.sass.lint,
                          $plugin.stream('lint')) );
    };
};
