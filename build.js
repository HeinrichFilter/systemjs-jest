#!/usr/bin/env node

/*
 * Copyright 2015 CodeEmpathy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var Builder = require('systemjs-builder');
var path = require('path');
var fs = require('fs');

var builder = new Builder();
var pkgRoot = getPkgRoot();
var pkgJson = getPkgJson(pkgRoot);

var configFile = (pkgJson.jspm && pkgJson.jspm.configFile) || 'config.js';
configFile = path.join(pkgRoot, configFile);

var configLoaded = Promise.resolve();

var inputFileName = process.argv[2];

if (fs.existsSync(configFile)) {
  configLoaded = builder.loadConfig(configFile);
}

configLoaded.then(function () {
  return builder.buildSFX(inputFileName);
}).then(function (output) {
  console.log(output.source);
}, function (error) {
  console.error(error.stack || error);
  process.exit(1);
});

function getPkgRoot() {
  var cwd = process.cwd();

  var cwdPackageRoot = cwd;
  while (!fs.existsSync(path.join(cwdPackageRoot, 'package.json'))) {
    if (cwdPackageRoot === '/') {
      cwdPackageRoot = cwd;
      break;
    }
    cwdPackageRoot = path.resolve(cwdPackageRoot, '..');
  }

  return cwdPackageRoot;
}

function getPkgJson(packageRoot) {
  var pkgJsonPath = path.join(packageRoot, 'package.json');
  var pkgJson = fs.existsSync(pkgJsonPath) ? require(pkgJsonPath) : {};

  return pkgJson;
}
