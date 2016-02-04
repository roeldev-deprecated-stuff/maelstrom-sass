/**
 * maelstrom-sass | lib/streams/concat.js
 */
'use strict';

var GulpSass = require('gulp-sass');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let Maelstrom = this.maelstrom;
    let Config    = Maelstrom.config;

    /**
     * Compile Sass with _gulp-sass_ (_Libsass_).
     */
    this.addStream('libsass', function()
    {
        return GulpSass(Config.sass.libsass).on('error', GulpSass.logError);
    });
};
