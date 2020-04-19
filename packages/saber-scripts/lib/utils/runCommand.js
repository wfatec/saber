"use strict";

/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
var spawn = require("saber-dev-utils/crossSpawn");

var runCommand = function runCommand(command, args) {
  return new Promise(function (resolve, reject) {
    var executedCommand = spawn.sync(command, args, {
      stdio: "inherit",
      shell: true
    });
    executedCommand.on("error", function (error) {
      reject(error);
    });
    executedCommand.on("exit", function (code) {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

module.exports = runCommand;