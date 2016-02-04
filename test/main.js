/**
 * maelstrom-sass | test/main.js
 */
'use strict';

var Assert     = require('assert');
var SassPlugin = require('../lib/index.js');
var Path       = require('path');

// // // // // // // // // // // // // // // // // // // // // // // // // // //

function getFixtureFile($file)
{
    return Path.resolve(__dirname, './fixtures/' + $file);
}

// -----------------------------------------------------------------------------
