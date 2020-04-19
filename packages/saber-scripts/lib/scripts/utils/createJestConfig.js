// @remove-file-on-eject

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require('fs');

var chalk = require('react-dev-utils/chalk');

var paths = require('../../config/paths');

var modules = require('../../config/modules');

module.exports = function (resolve, rootDir, isEjecting) {
  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  var setupTestsMatches = paths.testsSetup.match(/src[/\\]setupTests\.(.+)/);
  var setupTestsFileExtension = setupTestsMatches && setupTestsMatches[1] || 'js';
  var setupTestsFile = fs.existsSync(paths.testsSetup) ? "<rootDir>/src/setupTests.".concat(setupTestsFileExtension) : undefined;
  var config = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
    setupFiles: [isEjecting ? 'react-app-polyfill/jsdom' : require.resolve('react-app-polyfill/jsdom')],
    setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],
    testEnvironment: 'jest-environment-jsdom-fourteen',
    transform: {
      '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': isEjecting ? '<rootDir>/node_modules/babel-jest' : resolve('config/jest/babelTransform.js'),
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': resolve('config/jest/fileTransform.js')
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
    modulePaths: modules.additionalModulePaths || [],
    moduleNameMapper: _objectSpread({
      '^react-native$': 'react-native-web',
      '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
    }, modules.jestAliases || {}),
    moduleFileExtensions: [].concat(_toConsumableArray(paths.moduleFileExtensions), ['node']).filter(function (ext) {
      return !ext.includes('mjs');
    }),
    watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname']
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  var overrides = Object.assign({}, require(paths.appPackageJson).jest);
  var supportedKeys = ['clearMocks', 'collectCoverageFrom', 'coveragePathIgnorePatterns', 'coverageReporters', 'coverageThreshold', 'displayName', 'extraGlobals', 'globalSetup', 'globalTeardown', 'moduleNameMapper', 'resetMocks', 'resetModules', 'restoreMocks', 'snapshotSerializers', 'transform', 'transformIgnorePatterns', 'watchPathIgnorePatterns'];

  if (overrides) {
    supportedKeys.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(overrides, key)) {
        if (Array.isArray(config[key]) || _typeof(config[key]) !== 'object') {
          // for arrays or primitive types, directly override the config key
          config[key] = overrides[key];
        } else {
          // for object types, extend gracefully
          config[key] = Object.assign({}, config[key], overrides[key]);
        }

        delete overrides[key];
      }
    });
    var unsupportedKeys = Object.keys(overrides);

    if (unsupportedKeys.length) {
      var isOverridingSetupFile = unsupportedKeys.indexOf('setupFilesAfterEnv') > -1;

      if (isOverridingSetupFile) {
        console.error(chalk.red('We detected ' + chalk.bold('setupFilesAfterEnv') + ' in your package.json.\n\n' + 'Remove it from Jest configuration, and put the initialization code in ' + chalk.bold('src/setupTests.js') + '.\nThis file will be loaded automatically.\n'));
      } else {
        console.error(chalk.red('\nOut of the box, Create React App only supports overriding ' + 'these Jest options:\n\n' + supportedKeys.map(function (key) {
          return chalk.bold("  \u2022 " + key);
        }).join('\n') + '.\n\n' + 'These options in your package.json Jest configuration ' + 'are not currently supported by Create React App:\n\n' + unsupportedKeys.map(function (key) {
          return chalk.bold("  \u2022 " + key);
        }).join('\n') + '\n\nIf you wish to override other Jest options, you need to ' + 'eject from the default setup. You can do so by running ' + chalk.bold('npm run eject') + ' but remember that this is a one-way operation. ' + 'You may also file an issue with Create React App to discuss ' + 'supporting more options out of the box.\n'));
      }

      process.exit(1);
    }
  }

  return config;
};