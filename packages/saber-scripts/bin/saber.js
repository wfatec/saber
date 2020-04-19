#!/usr/bin/env node

'use strict';

const chalk = require('saber-dev-utils/chalk');
const program = require('saber-dev-utils/commander');
const spawn = require('saber-dev-utils/crossSpawn');
const join = require('path').join;
const resolve = require('path').resolve;
const exists = require('fs').existsSync;
const readFileSync = require('fs').readFileSync;
const updater = require('update-notifier');
const pkg = require('../package.json');

// exit when the version of node is lower than 8
var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'Create React App requires Node 8 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

// Notify update when process exits
updater({ pkg: pkg }).notify({ defer: true });

if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  console.log('saber-scripts version ' + pkg.version);
  // if (!(pkg._from && pkg._resolved)) {
  //   console.log(chalk.cyan('@local'));
  // }
  return;
}

program
  .usage('<command> [options]')
  .on('--help', printHelp)
  .parse(process.argv);

const aliases = {
  g: 'generate',
};
const args = process.argv.slice(3);
let subcmd = program.args[0];
if (aliases[subcmd]) subcmd = aliases[subcmd];

if (!subcmd) {
  program.help();
} else {
  const bin = executable(subcmd);
  if (bin) {
    console.log(bin);
    wrap(spawn(bin, args, {stdio: 'inherit', customFds: [0, 1, 2]}));
  } else {
    program.help();
  }
}

function wrap(sp) {
  sp.on('close', function(code) {
    process.exit(code);
  });
}

function printHelp() {
  console.log('  Commands:');
  console.log();
  console.log('    init           Init a new dva application in the current folder');
  console.log('    new            Creates a new application');
  console.log('    generate       Generates new code (short-cut alias: "g")');
  console.log();
  console.log('  All commands can be run with -h (or --help) for more information.')
}

function executable(subcmd) {
  var file = join(__dirname, 'dva-' + subcmd);
  if (exists(file)) {
    return file;
  }
}

