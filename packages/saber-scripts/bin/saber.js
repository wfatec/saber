#!/usr/bin/env node

'use strict';

process.on('unhandledRejection', err => {
  throw err;
});



/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = (packageName) => {
  try {
    require.resolve(packageName);

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * @typedef {Object} CliOption
 * @property {string} name display name
 * @property {string} package npm package name
 * @property {string} binName name of the executable file
 * @property {boolean} installed currently installed?
 * @property {string} url homepage
 */

/** @type {CliOption} */
const cli = {
  name: "webpack-cli",
  package: "webpack-cli",
  binName: "webpack-cli",
  installed: isInstalled("webpack-cli"),
  url: "https://github.com/webpack/webpack-cli",
};

const path = require("path");
const pkgPath = require.resolve(`${cli.package}/package.json`);
// eslint-disable-next-line node/no-missing-require
const pkg = require(pkgPath);
// eslint-disable-next-line node/no-missing-require
require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]));
