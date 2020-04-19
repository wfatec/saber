// @remove-file-on-eject

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var chalk = require('react-dev-utils/chalk');

var fs = require('fs');

var semver = require('semver');

var path = require('path'); // We assume that having wrong versions of these
// in the tree will likely break your setup.
// This is a relatively low-effort way to find common issues.


function verifyPackageTree() {
  var depsToCheck = [// These are packages most likely to break in practice.
  // See https://github.com/facebook/create-react-app/issues/1795 for reasons why.
  // I have not included Babel here because plugins typically don't import Babel (so it's not affected).
  'babel-eslint', 'babel-jest', 'babel-loader', 'eslint', 'jest', 'webpack', 'webpack-dev-server']; // Inlined from semver-regex, MIT license.
  // Don't want to make this a dependency after ejecting.

  var getSemverRegex = function getSemverRegex() {
    return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi;
  };

  var ownPackageJson = require('../../package.json');

  var expectedVersionsByDep = {}; // Gather wanted deps

  depsToCheck.forEach(function (dep) {
    var expectedVersion = ownPackageJson.dependencies[dep];

    if (!expectedVersion) {
      throw new Error('This dependency list is outdated, fix it.');
    }

    if (!getSemverRegex().test(expectedVersion)) {
      throw new Error("The ".concat(dep, " package should be pinned, instead got version ").concat(expectedVersion, "."));
    }

    expectedVersionsByDep[dep] = expectedVersion;
  }); // Verify we don't have other versions up the tree

  var currentDir = __dirname; // eslint-disable-next-line no-constant-condition

  var _loop2 = function _loop2() {
    var previousDir = currentDir;
    currentDir = path.resolve(currentDir, '..');

    if (currentDir === previousDir) {
      // We've reached the root.
      return "break";
    }

    var maybeNodeModules = path.resolve(currentDir, 'node_modules');

    if (!fs.existsSync(maybeNodeModules)) {
      return "continue";
    }

    depsToCheck.forEach(function (dep) {
      var maybeDep = path.resolve(maybeNodeModules, dep);

      if (!fs.existsSync(maybeDep)) {
        return;
      }

      var maybeDepPackageJson = path.resolve(maybeDep, 'package.json');

      if (!fs.existsSync(maybeDepPackageJson)) {
        return;
      }

      var depPackageJson = JSON.parse(fs.readFileSync(maybeDepPackageJson, 'utf8'));
      var expectedVersion = expectedVersionsByDep[dep];

      if (!semver.satisfies(depPackageJson.version, expectedVersion)) {
        console.error(chalk.red("\nThere might be a problem with the project dependency tree.\n" + "It is likely ".concat(chalk.bold('not'), " a bug in Create React App, but something you need to fix locally.\n\n")) + "The ".concat(chalk.bold(ownPackageJson.name), " package provided by Create React App requires a dependency:\n\n") + chalk.green("  \"".concat(chalk.bold(dep), "\": \"").concat(chalk.bold(expectedVersion), "\"\n\n")) + "Don't try to install it manually: your package manager does it automatically.\n" + "However, a different version of ".concat(chalk.bold(dep), " was detected higher up in the tree:\n\n") + "  ".concat(chalk.bold(chalk.red(maybeDep)), " (version: ").concat(chalk.bold(chalk.red(depPackageJson.version)), ") \n\n") + "Manually installing incompatible versions is known to cause hard-to-debug issues.\n\n" + chalk.red("If you would prefer to ignore this check, add ".concat(chalk.bold('SKIP_PREFLIGHT_CHECK=true'), " to an ").concat(chalk.bold('.env'), " file in your project.\n") + "That will permanently disable this message but you might encounter other issues.\n\n") + "To ".concat(chalk.green('fix'), " the dependency tree, try following the steps below in the exact order:\n\n") + "  ".concat(chalk.cyan('1.'), " Delete ").concat(chalk.bold('package-lock.json'), " (").concat(chalk.underline('not'), " ").concat(chalk.bold('package.json'), "!) and/or ").concat(chalk.bold('yarn.lock'), " in your project folder.\n") + "  ".concat(chalk.cyan('2.'), " Delete ").concat(chalk.bold('node_modules'), " in your project folder.\n") + "  ".concat(chalk.cyan('3.'), " Remove \"").concat(chalk.bold(dep), "\" from ").concat(chalk.bold('dependencies'), " and/or ").concat(chalk.bold('devDependencies'), " in the ").concat(chalk.bold('package.json'), " file in your project folder.\n") + "  ".concat(chalk.cyan('4.'), " Run ").concat(chalk.bold('npm install'), " or ").concat(chalk.bold('yarn'), ", depending on the package manager you use.\n\n") + "In most cases, this should be enough to fix the problem.\n" + "If this has not helped, there are a few other things you can try:\n\n" + "  ".concat(chalk.cyan('5.'), " If you used ").concat(chalk.bold('npm'), ", install ").concat(chalk.bold('yarn'), " (http://yarnpkg.com/) and repeat the above steps with it instead.\n") + "     This may help because npm has known issues with package hoisting which may get resolved in future versions.\n\n" + "  ".concat(chalk.cyan('6.'), " Check if ").concat(chalk.bold(maybeDep), " is outside your project directory.\n") + "     For example, you might have accidentally installed something in your home folder.\n\n" + "  ".concat(chalk.cyan('7.'), " Try running ").concat(chalk.bold("npm ls ".concat(dep)), " in your project folder.\n") + "     This will tell you which ".concat(chalk.underline('other'), " package (apart from the expected ").concat(chalk.bold(ownPackageJson.name), ") installed ").concat(chalk.bold(dep), ".\n\n") + "If nothing else helps, add ".concat(chalk.bold('SKIP_PREFLIGHT_CHECK=true'), " to an ").concat(chalk.bold('.env'), " file in your project.\n") + "That would permanently disable this preflight check in case you want to proceed anyway.\n\n" + chalk.cyan("P.S. We know this message is long but please read the steps above :-) We hope you find them helpful!\n"));
        process.exit(1);
      }
    });
  };

  _loop: while (true) {
    var _ret = _loop2();

    switch (_ret) {
      case "break":
        break _loop;

      case "continue":
        continue;
    }
  }
}

module.exports = verifyPackageTree;