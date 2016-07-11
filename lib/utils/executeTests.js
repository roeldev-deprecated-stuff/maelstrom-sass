/**
 * maelstrom-sass | lib/utils/executeTests.js
 */
'use strict';

const FileSystem = require('fs');
const Path       = require('path');
const SassTrue   = require('sass-true');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

module.exports = function executeTests($dir)
{
    var $items = FileSystem.readdirSync($dir);
    $items.forEach(function($item)
    {
        // ignore dirs and files starting with _
        if ($item.substr(0, 1) == '_') return;

        $item = Path.join($dir, $item);

        // when subdir
        if (!Path.extname($item))
        {
            executeTests($item);
        }
        // when scss file
        else if (Path.extname($item) === '.scss')
        {
            SassTrue.runSass({ 'file': $item }, describe, it);
        }
    });
};
