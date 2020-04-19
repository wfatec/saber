#!/usr/bin/env node

const program = require('saber-dev-utils/commander');

program
  .option('--demo', 'Generate dva project for demo')
  .option('--no-install', 'Install dependencies after boilerplate, default: true')
  .parse(process.argv);

require('../lib/init')(program);
