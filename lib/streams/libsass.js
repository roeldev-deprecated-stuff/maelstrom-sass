/**
 * maelstrom-sass | lib/streams/libsass.js
 */
'use strict';

const GulpSass = require('gulp-sass');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;

    /**
     * Compile Sass with _gulp-sass_ (_Libsass_).
     */
    this.addStream('libsass', function()
    {
        return GulpSass(Config.sass.libsass).on('error', GulpSass.logError);
    });
};
