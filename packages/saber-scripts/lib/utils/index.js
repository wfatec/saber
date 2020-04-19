"use strict";

/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
var isInstalled = function isInstalled(packageName) {
  try {
    require.resolve(packageName);

    return true;
  } catch (err) {
    return false;
  }
};

var runCommand = require('./runCommand');

module.exports = {
  isInstalled: isInstalled,
  runCommand: runCommand
};