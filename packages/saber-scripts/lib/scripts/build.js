// @remove-on-eject-begin

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict'; // Do this as the first thing so that any code reading it knows the right env.

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production'; // Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.

process.on('unhandledRejection', function (err) {
  throw err;
}); // Ensure environment variables are read.

require('../config/env'); // @remove-on-eject-begin
// Do the preflight checks (only happens before eject).


var verifyPackageTree = require('./utils/verifyPackageTree');

if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}

var verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');

verifyTypeScriptSetup(); // @remove-on-eject-end

var path = require('path');

var chalk = require('react-dev-utils/chalk');

var fs = require('fs-extra');

var webpack = require('webpack');

var configFactory = require('../config/webpack.config');

var paths = require('../config/paths');

var checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

var formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

var printHostingInstructions = require('react-dev-utils/printHostingInstructions');

var FileSizeReporter = require('react-dev-utils/FileSizeReporter');

var printBuildError = require('react-dev-utils/printBuildError');

var measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
var printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
var useYarn = fs.existsSync(paths.yarnLockFile); // These sizes are pretty large. We'll warn for bundles exceeding them.

var WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
var WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
var isInteractive = process.stdout.isTTY; // Warn and crash if required files are missing

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
} // Generate configuration


var config = configFactory('production'); // We require that you explicitly set browsers and do not fall back to
// browserslist defaults.

var _require = require('react-dev-utils/browsersHelper'),
    checkBrowsers = _require.checkBrowsers;

checkBrowsers(paths.appPath, isInteractive).then(function () {
  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  return measureFileSizesBeforeBuild(paths.appBuild);
}).then(function (previousFileSizes) {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fs.emptyDirSync(paths.appBuild); // Merge with the public folder

  copyPublicFolder(); // Start the webpack build

  return build(previousFileSizes);
}).then(function (_ref) {
  var stats = _ref.stats,
      previousFileSizes = _ref.previousFileSizes,
      warnings = _ref.warnings;

  if (warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'));
    console.log(warnings.join('\n\n'));
    console.log('\nSearch for the ' + chalk.underline(chalk.yellow('keywords')) + ' to learn more about each warning.');
    console.log('To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n');
  } else {
    console.log(chalk.green('Compiled successfully.\n'));
  }

  console.log('File sizes after gzip:\n');
  printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild, WARN_AFTER_BUNDLE_GZIP_SIZE, WARN_AFTER_CHUNK_GZIP_SIZE);
  console.log();

  var appPackage = require(paths.appPackageJson);

  var publicUrl = paths.publicUrlOrPath;
  var publicPath = config.output.publicPath;
  var buildFolder = path.relative(process.cwd(), paths.appBuild);
  printHostingInstructions(appPackage, publicUrl, publicPath, buildFolder, useYarn);
}, function (err) {
  var tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';

  if (tscCompileOnError) {
    console.log(chalk.yellow('Compiled with the following type errors (you may want to check these before deploying your app):\n'));
    printBuildError(err);
  } else {
    console.log(chalk.red('Failed to compile.\n'));
    printBuildError(err);
    process.exit(1);
  }
})["catch"](function (err) {
  if (err && err.message) {
    console.log(err.message);
  }

  process.exit(1);
}); // Create the production build and print the deployment instructions.

function build(previousFileSizes) {
  // We used to support resolving modules according to `NODE_PATH`.
  // This now has been deprecated in favor of jsconfig/tsconfig.json
  // This lets you use absolute paths in imports inside large monorepos:
  if (process.env.NODE_PATH) {
    console.log(chalk.yellow('Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'));
    console.log();
  }

  console.log('Creating an optimized production build...');
  var compiler = webpack(config);
  return new Promise(function (resolve, reject) {
    compiler.run(function (err, stats) {
      var messages;

      if (err) {
        if (!err.message) {
          return reject(err);
        }

        var errMessage = err.message; // Add additional information for postcss errors

        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage += '\nCompileError: Begins at CSS selector ' + err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: []
        });
      } else {
        messages = formatWebpackMessages(stats.toJson({
          all: false,
          warnings: true,
          errors: true
        }));
      }

      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }

        return reject(new Error(messages.errors.join('\n\n')));
      }

      if (process.env.CI && (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') && messages.warnings.length) {
        console.log(chalk.yellow('\nTreating warnings as errors because process.env.CI = true.\n' + 'Most CI servers set it automatically.\n'));
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats: stats,
        previousFileSizes: previousFileSizes,
        warnings: messages.warnings
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: function filter(file) {
      return file !== paths.appHtml;
    }
  });
}