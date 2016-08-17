/**
 * maelstrom-sass | lib/tasks/docs.js
 */
'use strict';

const SassDoc = require('sassdoc');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function($plugin, $maelstrom)
{
    return function()
    {
        let $src = $maelstrom.config.sass.sassdoc.src;
        SassDoc('./src/', $maelstrom.config.sass.sassdoc);
    };
};
