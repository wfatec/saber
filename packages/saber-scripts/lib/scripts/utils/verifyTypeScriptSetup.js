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

var resolve = require('resolve');

var path = require('path');

var paths = require('../../config/paths');

var os = require('os');

var immer = require('react-dev-utils/immer').produce;

var globby = require('react-dev-utils/globby').sync;

function writeJson(fileName, object) {
  fs.writeFileSync(fileName, JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL);
}

function verifyNoTypeScript() {
  var typescriptFiles = globby(['**/*.(ts|tsx)', '!**/node_modules', '!**/*.d.ts'], {
    cwd: paths.appSrc
  });

  if (typescriptFiles.length > 0) {
    console.warn(chalk.yellow("We detected TypeScript in your project (".concat(chalk.bold("src".concat(path.sep).concat(typescriptFiles[0])), ") and created a ").concat(chalk.bold('tsconfig.json'), " file for you.")));
    console.warn();
    return false;
  }

  return true;
}

function verifyTypeScriptSetup() {
  var firstTimeSetup = false;

  if (!fs.existsSync(paths.appTsConfig)) {
    if (verifyNoTypeScript()) {
      return;
    }

    writeJson(paths.appTsConfig, {});
    firstTimeSetup = true;
  }

  var isYarn = fs.existsSync(paths.yarnLockFile); // Ensure typescript is installed

  var ts;

  try {
    ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules
    }));
  } catch (_) {
    console.error(chalk.bold.red("It looks like you're trying to use TypeScript but do not have ".concat(chalk.bold('typescript'), " installed.")));
    console.error(chalk.bold('Please install', chalk.cyan.bold('typescript'), 'by running', chalk.cyan.bold(isYarn ? 'yarn add typescript' : 'npm install typescript') + '.'));
    console.error(chalk.bold('If you are not trying to use TypeScript, please remove the ' + chalk.cyan('tsconfig.json') + ' file from your package root (and any TypeScript files).'));
    console.error();
    process.exit(1);
  }

  var compilerOptions = {
    // These are suggested values and will be set when not present in the
    // tsconfig.json
    // 'parsedValue' matches the output value from ts.parseJsonConfigFileContent()
    target: {
      parsedValue: ts.ScriptTarget.ES5,
      suggested: 'es5'
    },
    lib: {
      suggested: ['dom', 'dom.iterable', 'esnext']
    },
    allowJs: {
      suggested: true
    },
    skipLibCheck: {
      suggested: true
    },
    esModuleInterop: {
      suggested: true
    },
    allowSyntheticDefaultImports: {
      suggested: true
    },
    strict: {
      suggested: true
    },
    forceConsistentCasingInFileNames: {
      suggested: true
    },
    // TODO: Enable for v4.0 (#6936)
    // noFallthroughCasesInSwitch: { suggested: true },
    // These values are required and cannot be changed by the user
    // Keep this in sync with the webpack config
    module: {
      parsedValue: ts.ModuleKind.ESNext,
      value: 'esnext',
      reason: 'for import() and import/export'
    },
    moduleResolution: {
      parsedValue: ts.ModuleResolutionKind.NodeJs,
      value: 'node',
      reason: 'to match webpack resolution'
    },
    resolveJsonModule: {
      value: true,
      reason: 'to match webpack loader'
    },
    isolatedModules: {
      value: true,
      reason: 'implementation limitation'
    },
    noEmit: {
      value: true
    },
    jsx: {
      parsedValue: ts.JsxEmit.React,
      suggested: 'react'
    },
    paths: {
      value: undefined,
      reason: 'aliased imports are not supported'
    }
  };
  var formatDiagnosticHost = {
    getCanonicalFileName: function getCanonicalFileName(fileName) {
      return fileName;
    },
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: function getNewLine() {
      return os.EOL;
    }
  };
  var messages = [];
  var appTsConfig;
  var parsedTsConfig;
  var parsedCompilerOptions;

  try {
    var _ts$readConfigFile = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile),
        readTsConfig = _ts$readConfigFile.config,
        error = _ts$readConfigFile.error;

    if (error) {
      throw new Error(ts.formatDiagnostic(error, formatDiagnosticHost));
    }

    appTsConfig = readTsConfig; // Get TS to parse and resolve any "extends"
    // Calling this function also mutates the tsconfig above,
    // adding in "include" and "exclude", but the compilerOptions remain untouched

    var result;
    parsedTsConfig = immer(readTsConfig, function (config) {
      result = ts.parseJsonConfigFileContent(config, ts.sys, path.dirname(paths.appTsConfig));
    });

    if (result.errors && result.errors.length) {
      throw new Error(ts.formatDiagnostic(result.errors[0], formatDiagnosticHost));
    }

    parsedCompilerOptions = result.options;
  } catch (e) {
    if (e && e.name === 'SyntaxError') {
      console.error(chalk.red.bold('Could not parse', chalk.cyan('tsconfig.json') + '.', 'Please make sure it contains syntactically correct JSON.'));
    }

    console.log(e && e.message ? "".concat(e.message) : '');
    process.exit(1);
  }

  if (appTsConfig.compilerOptions == null) {
    appTsConfig.compilerOptions = {};
    firstTimeSetup = true;
  }

  for (var _i = 0, _Object$keys = Object.keys(compilerOptions); _i < _Object$keys.length; _i++) {
    var option = _Object$keys[_i];
    var _compilerOptions$opti = compilerOptions[option],
        parsedValue = _compilerOptions$opti.parsedValue,
        value = _compilerOptions$opti.value,
        suggested = _compilerOptions$opti.suggested,
        reason = _compilerOptions$opti.reason;
    var valueToCheck = parsedValue === undefined ? value : parsedValue;
    var coloredOption = chalk.cyan('compilerOptions.' + option);

    if (suggested != null) {
      if (parsedCompilerOptions[option] === undefined) {
        appTsConfig.compilerOptions[option] = suggested;
        messages.push("".concat(coloredOption, " to be ").concat(chalk.bold('suggested'), " value: ").concat(chalk.cyan.bold(suggested), " (this can be changed)"));
      }
    } else if (parsedCompilerOptions[option] !== valueToCheck) {
      appTsConfig.compilerOptions[option] = value;
      messages.push("".concat(coloredOption, " ").concat(chalk.bold(valueToCheck == null ? 'must not' : 'must'), " be ").concat(valueToCheck == null ? 'set' : chalk.cyan.bold(value)) + (reason != null ? " (".concat(reason, ")") : ''));
    }
  } // tsconfig will have the merged "include" and "exclude" by this point


  if (parsedTsConfig.include == null) {
    appTsConfig.include = ['src'];
    messages.push("".concat(chalk.cyan('include'), " should be ").concat(chalk.cyan.bold('src')));
  }

  if (messages.length > 0) {
    if (firstTimeSetup) {
      console.log(chalk.bold('Your', chalk.cyan('tsconfig.json'), 'has been populated with default values.'));
      console.log();
    } else {
      console.warn(chalk.bold('The following changes are being made to your', chalk.cyan('tsconfig.json'), 'file:'));
      messages.forEach(function (message) {
        console.warn('  - ' + message);
      });
      console.warn();
    }

    writeJson(paths.appTsConfig, appTsConfig);
  } // Reference `react-scripts` types


  if (!fs.existsSync(paths.appTypeDeclarations)) {
    fs.writeFileSync(paths.appTypeDeclarations, "/// <reference types=\"react-scripts\" />".concat(os.EOL));
  }
}

module.exports = verifyTypeScriptSetup;