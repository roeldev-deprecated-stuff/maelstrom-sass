/**
 * maelstrom-sass | lib/tasks/lint.js
 */
'use strict';

const GulpMocha = require('gulp-mocha');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        process.stdout.write('\u001b[2J');

        return $maelstrom.gulp.src('test/*.js', { 'read': false })
            .pipe( $maelstrom.stream('plumber') )
            .pipe( GulpMocha({ 'reporter': 'spec' }) );
    };
};
