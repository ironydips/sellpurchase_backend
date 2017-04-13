/**
 * preinstall
 *
 * creates a symlink in `node_modules` to allow non-relative local `require`
 *   require('_/foo'); // loads {root}/lib/foo/index.js
 *
 * set as npm preinstall command
 *   { "scripts": "preinstall": "./bin/preinstall"}
 */
var fs = require('fs');
var path = require('path');

var symlink = "_";
var libDir = path.join(__dirname, '..', 'lib');
var reqDir = path.join(__dirname, '..', 'node_modules');
var symLinkPath = path.join(reqDir, symlink);

if (!fs.existsSync(symLinkPath)) {
  fs.symlinkSync(libDir, symLinkPath, 'dir');
}
