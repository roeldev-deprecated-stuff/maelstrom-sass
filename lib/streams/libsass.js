/**
 * maelstrom-sass | lib/streams/libsass.js
 */
'use strict';

const GulpReplace = require('gulp-replace');
const GulpSass    = require('gulp-sass');
const Path        = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function()
{
    let $stream = GulpSass(this.maelstrom.config.sass.libsass)
        .on('error', GulpSass.logError);

    // when source comments are active, replace the full path (including disk
    // etc.) to a relative shorter path. eg:
    // _/* line 36, D:/path/to/project/assets/scss/some-file.scss */_
    // becomes _/* line 36, ./assets/scss/some-file.scss */_
    if (this.maelstrom.config.sass.libsass.sourceComments)
    {
        let $cwd = process.cwd();
        if (Path.sep === '\\')
        {
            $cwd = $cwd.replace(/\\/g, '/');
        }

        // regular expression to find the full path
        let $regexp = '(\/\* line [0-9]+, )('+ $cwd +')(.* \*\/)';

        // place all found parts back, except for the cwd part
        $stream.pipe( GulpReplace(new RegExp($regexp, 'g'), '$1.$3') );
    }

    return $stream;
};
