/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
const spawn = require("saber-dev-utils/crossSpawn");

const runCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    const executedCommand = spawn.sync(command, args, {
      stdio: "inherit",
      shell: true,
    });

    executedCommand.on("error", (error) => {
      reject(error);
    });

    executedCommand.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

export default runCommand;
