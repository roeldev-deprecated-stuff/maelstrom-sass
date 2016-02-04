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
 */
'use strict';

module.exports = function()
{
    const self = this; // maelstrom object

    this.plugin('sass',
    {
        'file':  __filename,
        'alias': ['scss'],

        /**
         * Return the location of the Sass source files.
         */
        src: function($src)
        {
            return self.utils.extendArgs($src,
                   self.config.src.sass + '/**/*.{sass,scss}');
        },

        /**
         * Return the location of the CSS output folder.
         */
        dest: function()
        {
            return self.config.dest.css;
        }
    });
};
