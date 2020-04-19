"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _which = require("which");

function runCmd(cmd, args, fn) {
  args = args || [];

  var runner = require('child_process').spawn(cmd, args, {
    // keep color
    stdio: "inherit"
  });

  runner.on('close', function (code) {
    if (fn) {
      fn(code);
    }
  });
}

function findNpm() {
  var npms = process.platform === 'win32' ? ['tnpm.cmd', 'cnpm.cmd', 'npm.cmd'] : ['tnpm', 'cnpm', 'npm'];

  for (var i = 0; i < npms.length; i++) {
    try {
      _which["default"].sync(npms[i]);

      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {}
  }

  throw new Error('please install npm');
}

function _default(done) {
  var npm = findNpm();
  runCmd(_which["default"].sync(npm), ['install'], function () {
    runCmd(_which["default"].sync(npm), ['install', 'dva', '--save'], function () {
      console.log(npm + ' install end');
      done();
    });
  });
}

;
module.exports = exports.default;