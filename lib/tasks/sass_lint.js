/**
 * maelstrom-sass | lib/tasks/sass_lint.js
 */
'use strict';

module.exports = function()
{
    const self      = this; // plugin object
    const Maelstrom = this.maelstrom;
    const Config    = Maelstrom.config;
    const Gulp      = Maelstrom.gulp;

    /**
     * Compile with the compiler set in the config/env vars.
     *
     * @WIP - Force libsass for now.
     */
    this.addTask('sass:lint', function()
    {
        let $filesToExclude = '!' + Config.src.sass + '/maelstrom/*.scss';

        return Gulp.src( self.src($filesToExclude) )
            .pipe( Maelstrom.plumber() )
            .pipe( self.stream('lint') );
    });
};
