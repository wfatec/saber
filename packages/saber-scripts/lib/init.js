"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _path = require("path");

var _fs = require("fs");

var _emptyDir = require("empty-dir");

var _leftPad = require("left-pad");

var _chalk = require("saber-dev-utils/chalk");

var _inquirer = require("saber-dev-utils/inquirer");

function info(type, message) {
  console.log("".concat(_chalk["default"].green.bold((0, _leftPad["default"])(type, 12)), "  ").concat(message));
}

function error(message) {
  console.error(_chalk["default"].red(message));
}

function success(message) {
  console.error(_chalk["default"].green(message));
}

function init(_ref) {
  var demo = _ref.demo,
      install = _ref.install;
  var type = demo ? 'demo' : 'app';
  var cwd = (0, _path.join)(__dirname, '../boilerplates', type);
  var dest = process.cwd();
  var projectName = (0, _path.basename)(dest);

  if (!(0, _emptyDir.sync)(dest)) {
    error('Existing files here, please run init command in an empty folder!');
    process.exit(1);
  }

  console.log("Creating a new Dva app in ".concat(dest, "."));
  console.log();
  vfs.src(['**/*', '!node_modules/**/*'], {
    cwd: cwd,
    cwdbase: true,
    dot: true
  }).pipe(template(dest, cwd)).pipe(vfs.dest(dest)).on('end', function () {
    info('rename', 'gitignore -> .gitignore');
    (0, _fs.renameSync)((0, _path.join)(dest, 'gitignore'), (0, _path.join)(dest, '.gitignore'));

    if (install) {
      info('run', 'npm install');

      require('./install')(printSuccess);
    } else {
      printSuccess();
    }
  }).resume();

  function printSuccess() {
    success("\nSuccess! Created ".concat(projectName, " at ").concat(dest, ".\n\nInside that directory, you can run several commands:\n  * npm start: Starts the development server.\n  * npm run build: Bundles the app into dist for production.\n  * npm test: Run test.\n\nWe suggest that you begin by typing:\n  cd ").concat(dest, "\n  npm start\n\nHappy hacking!"));
  }
} // function template(dest, cwd) {
//   return through.obj(function (file, enc, cb) {
//     if (!file.stat.isFile()) {
//       return cb();
//     }
//     info('create', file.path.replace(cwd + '/', ''));
//     this.push(file);
//     cb();
//   });
// }


function copyTpl(opts) {
  var tpl = readFileSync(opts.templatePath, 'utf-8');
  var content = Mustache.render(tpl, opts.context);
  mkdirp.sync(dirname(opts.target));
  console.log("".concat(_chalk["default"].green('Write:'), " ").concat(relative(this.cwd, opts.target)));
  writeFileSync(opts.target, content, 'utf-8');
}

function copyDirectory(opts) {
  var _this = this;

  var files = glob.sync('**/*', {
    cwd: opts.path,
    dot: true,
    ignore: ['**/node_modules/**']
  });
  files.forEach(function (file) {
    var absFile = (0, _path.join)(opts.path, file);
    if (statSync(absFile).isDirectory()) return;

    if (file.endsWith('.tpl')) {
      _this.copyTpl({
        templatePath: absFile,
        target: (0, _path.join)(opts.target, file.replace(/\.tpl$/, '')),
        context: opts.context
      });
    } else {
      console.log("".concat(_chalk["default"].green('Copy: '), " ").concat(file));
      var absTarget = (0, _path.join)(opts.target, file);
      mkdirp.sync(dirname(absTarget));
      copyFileSync(absFile, absTarget);
    }
  });
}

function _default() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  console.log('args: ', args);
  return null;

  _inquirer["default"].prompt([{
    type: 'confirm',
    name: 'insist',
    message: "Do you insist on using dva-cli?",
    "default": false
  }]).then(function (_ref2) {
    var insist = _ref2.insist;

    if (insist) {
      init(args);
    } else {
      console.log('Have a good day!');
    }
  })["catch"](function (e) {
    console.error(_chalk["default"].red("> Project init failed."));
    console.error(e);
  });
}

;
module.exports = exports.default;