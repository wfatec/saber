// @remove-file-on-eject

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'; // Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

process.on('unhandledRejection', function (err) {
  throw err;
});

var fs = require('fs-extra');

var path = require('path');

var chalk = require('react-dev-utils/chalk');

var execSync = require('child_process').execSync;

var spawn = require('react-dev-utils/crossSpawn');

var _require = require('react-dev-utils/browsersHelper'),
    defaultBrowsers = _require.defaultBrowsers;

var os = require('os');

var verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit() {
  try {
    execSync('git --version', {
      stdio: 'ignore'
    });

    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    console.warn('Git repo not initialized', e);
    return false;
  }
}

function tryGitCommit(appPath) {
  try {
    execSync('git add -A', {
      stdio: 'ignore'
    });
    execSync('git commit -m "Initialize project using Create React App"', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    // We couldn't commit in already initialized git repo,
    // maybe the commit author config is not set.
    // In the future, we might supply our own committer
    // like Ember CLI does, but for now, let's just
    // remove the Git files to avoid a half-done state.
    console.warn('Git commit not created', e);
    console.warn('Removing .git directory...');

    try {
      // unlinkSync() doesn't work on directories.
      fs.removeSync(path.join(appPath, '.git'));
    } catch (removeErr) {// Ignore.
    }

    return false;
  }
}

module.exports = function (appPath, appName, verbose, originalDirectory, templateName) {
  var appPackage = require(path.join(appPath, 'package.json'));

  var useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  if (!templateName) {
    console.log('');
    console.error("A template was not provided. This is likely because you're using an outdated version of ".concat(chalk.cyan('create-react-app'), "."));
    console.error("Please note that global installs of ".concat(chalk.cyan('create-react-app'), " are no longer supported."));
    return;
  }

  var templatePath = path.dirname(require.resolve("".concat(templateName, "/package.json"), {
    paths: [appPath]
  }));
  var templateJsonPath;

  if (templateName) {
    templateJsonPath = path.join(templatePath, 'template.json');
  } else {
    // TODO: Remove support for this in v4.
    templateJsonPath = path.join(appPath, '.template.dependencies.json');
  }

  var templateJson = {};

  if (fs.existsSync(templateJsonPath)) {
    templateJson = require(templateJsonPath);
  }

  var templatePackage = templateJson["package"] || {}; // Keys to ignore in templatePackage

  var templatePackageBlacklist = ['name', 'version', 'description', 'keywords', 'bugs', 'license', 'author', 'contributors', 'files', 'browser', 'bin', 'man', 'directories', 'repository', 'devDependencies', 'peerDependencies', 'bundledDependencies', 'optionalDependencies', 'engineStrict', 'os', 'cpu', 'preferGlobal', 'private', 'publishConfig']; // Keys from templatePackage that will be merged with appPackage

  var templatePackageToMerge = ['dependencies', 'scripts']; // Keys from templatePackage that will be added to appPackage,
  // replacing any existing entries.

  var templatePackageToReplace = Object.keys(templatePackage).filter(function (key) {
    return !templatePackageBlacklist.includes(key) && !templatePackageToMerge.includes(key);
  }); // Copy over some of the devDependencies

  appPackage.dependencies = appPackage.dependencies || {}; // Setup the script rules
  // TODO: deprecate 'scripts' key directly on templateJson

  var templateScripts = templatePackage.scripts || templateJson.scripts || {};
  appPackage.scripts = Object.assign({
    start: 'react-scripts start',
    build: 'react-scripts build',
    test: 'react-scripts test',
    eject: 'react-scripts eject'
  }, templateScripts); // Update scripts for Yarn users

  if (useYarn) {
    appPackage.scripts = Object.entries(appPackage.scripts).reduce(function (acc, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return _objectSpread({}, acc, _defineProperty({}, key, value.replace(/(npm run |npm )/, 'yarn ')));
    }, {});
  } // Setup the eslint config


  appPackage.eslintConfig = {
    "extends": 'react-app'
  }; // Setup the browsers list

  appPackage.browserslist = defaultBrowsers; // Add templatePackage keys/values to appPackage, replacing existing entries

  templatePackageToReplace.forEach(function (key) {
    appPackage[key] = templatePackage[key];
  });
  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os.EOL);
  var readmeExists = fs.existsSync(path.join(appPath, 'README.md'));

  if (readmeExists) {
    fs.renameSync(path.join(appPath, 'README.md'), path.join(appPath, 'README.old.md'));
  } // Copy the files for the user


  var templateDir = path.join(templatePath, 'template');

  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  } else {
    console.error("Could not locate supplied template: ".concat(chalk.green(templateDir)));
    return;
  } // modifies README.md commands based on user used package manager.


  if (useYarn) {
    try {
      var readme = fs.readFileSync(path.join(appPath, 'README.md'), 'utf8');
      fs.writeFileSync(path.join(appPath, 'README.md'), readme.replace(/(npm run |npm )/g, 'yarn '), 'utf8');
    } catch (err) {// Silencing the error. As it fall backs to using default npm commands.
    }
  }

  var gitignoreExists = fs.existsSync(path.join(appPath, '.gitignore'));

  if (gitignoreExists) {
    // Append if there's already a `.gitignore` file there
    var data = fs.readFileSync(path.join(appPath, 'gitignore'));
    fs.appendFileSync(path.join(appPath, '.gitignore'), data);
    fs.unlinkSync(path.join(appPath, 'gitignore'));
  } else {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    fs.moveSync(path.join(appPath, 'gitignore'), path.join(appPath, '.gitignore'), []);
  } // Initialize git repo


  var initializedGit = false;

  if (tryGitInit()) {
    initializedGit = true;
    console.log();
    console.log('Initialized a git repository.');
  }

  var command;
  var remove;
  var args;

  if (useYarn) {
    command = 'yarnpkg';
    remove = 'remove';
    args = ['add'];
  } else {
    command = 'npm';
    remove = 'uninstall';
    args = ['install', '--save', verbose && '--verbose'].filter(function (e) {
      return e;
    });
  } // Install additional template dependencies, if present
  // TODO: deprecate 'dependencies' key directly on templateJson


  var templateDependencies = templatePackage.dependencies || templateJson.dependencies;

  if (templateDependencies) {
    args = args.concat(Object.keys(templateDependencies).map(function (key) {
      return "".concat(key, "@").concat(templateDependencies[key]);
    }));
  } // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with react-scripts


  if (!isReactInstalled(appPackage)) {
    args = args.concat(['react', 'react-dom']);
  } // Install template dependencies, and react and react-dom if missing.


  if ((!isReactInstalled(appPackage) || templateName) && args.length > 1) {
    console.log();
    console.log("Installing template dependencies using ".concat(command, "..."));

    var _proc = spawn.sync(command, args, {
      stdio: 'inherit'
    });

    if (_proc.status !== 0) {
      console.error("`".concat(command, " ").concat(args.join(' '), "` failed"));
      return;
    }
  }

  if (args.find(function (arg) {
    return arg.includes('typescript');
  })) {
    console.log();
    verifyTypeScriptSetup();
  } // Remove template


  console.log("Removing template package using ".concat(command, "..."));
  console.log();
  var proc = spawn.sync(command, [remove, templateName], {
    stdio: 'inherit'
  });

  if (proc.status !== 0) {
    console.error("`".concat(command, " ").concat(args.join(' '), "` failed"));
    return;
  } // Create git commit if git repo was initialized


  if (initializedGit && tryGitCommit(appPath)) {
    console.log();
    console.log('Created git commit.');
  } // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.


  var cdpath;

  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  } // Change displayed command to yarn instead of yarnpkg


  var displayedCommand = useYarn ? 'yarn' : 'npm';
  console.log();
  console.log("Success! Created ".concat(appName, " at ").concat(appPath));
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan("  ".concat(displayedCommand, " start")));
  console.log('    Starts the development server.');
  console.log();
  console.log(chalk.cyan("  ".concat(displayedCommand, " ").concat(useYarn ? '' : 'run ', "build")));
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan("  ".concat(displayedCommand, " test")));
  console.log('    Starts the test runner.');
  console.log();
  console.log(chalk.cyan("  ".concat(displayedCommand, " ").concat(useYarn ? '' : 'run ', "eject")));
  console.log('    Removes this tool and copies build dependencies, configuration files');
  console.log('    and scripts into the app directory. If you do this, you can’t go back!');
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log("  ".concat(chalk.cyan("".concat(displayedCommand, " start"))));

  if (readmeExists) {
    console.log();
    console.log(chalk.yellow('You had a `README.md` file, we renamed it to `README.old.md`'));
  }

  console.log();
  console.log('Happy hacking!');
};

function isReactInstalled(appPackage) {
  var dependencies = appPackage.dependencies || {};
  return typeof dependencies.react !== 'undefined' && typeof dependencies['react-dom'] !== 'undefined';
}