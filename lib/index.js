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

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let $plugin = new this.Plugin(__filename, ['sass', 'scss'],
    {
        /**
         * Return the location of the Sass source files.
         */
        src: function($src)
        {
            let $defaultSrc = this.maelstrom.config.src.sass +
                              '/**/*.{sass,scss}';

            return this.maelstrom.utils.extendArgs($src, $defaultSrc);
        },

        /**
         * Return the location of the CSS output folder.
         */
        dest: function()
        {
            return this.maelstrom.config.dest.css;
        }
    });

    $plugin.readStreams();
    $plugin.readTasks();

    return $plugin;
};
