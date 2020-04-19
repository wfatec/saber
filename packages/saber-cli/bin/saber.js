#!/usr/bin/env node

/**
 * @param {string} command process to run
 * @param {string[]} args command line arguments
 * @returns {Promise<void>} promise
 */
const spawn = require('saber-dev-utils/crossSpawn');

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

/**
 * @param {string} packageName name of the package
 * @returns {boolean} is the package installed?
 */
const isInstalled = (packageName) => {
  try {
    require.resolve(packageName);

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * @typedef {Object} CliOption
 * @property {string} name display name
 * @property {string} package npm package name
 * @property {string} binName name of the executable file
 * @property {boolean} installed currently installed?
 * @property {string} url homepage
 */

/** @type {CliOption} */
const cli = {
  name: "webpack-cli",
  package: "webpack-cli",
  binName: "webpack-cli",
  installed: isInstalled("webpack-cli"),
  url: "https://github.com/webpack/webpack-cli",
};

if (!cli.installed) {
  const path = require("path");
  const fs = require("graceful-fs");
  const readLine = require("readline");

  const notify =
    "CLI for webpack must be installed.\n" + `  ${cli.name} (${cli.url})\n`;

  console.error(notify);

  const isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock"));

  const packageManager = isYarn ? "yarn" : "npm";
  const installOptions = [isYarn ? "add" : "install", "-D"];

  console.error(
    `We will use "${packageManager}" to install the CLI via "${packageManager} ${installOptions.join(
      " "
    )}".`
  );

  const question = `Do you want to install 'webpack-cli' (yes/no): `;

  const questionInterface = readLine.createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  // In certain scenarios (e.g. when STDIN is not in terminal mode), the callback function will not be
  // executed. Setting the exit code here to ensure the script exits correctly in those cases. The callback
  // function is responsible for clearing the exit code if the user wishes to install webpack-cli.
  process.exitCode = 1;
  questionInterface.question(question, (answer) => {
    questionInterface.close();

    const normalizedAnswer = answer.toLowerCase().startsWith("y");

    if (!normalizedAnswer) {
      console.error(
        "You need to install 'webpack-cli' to use webpack via CLI.\n" +
          "You can also install the CLI manually."
      );

      return;
    }
    process.exitCode = 0;

    console.log(
      `Installing '${
        cli.package
      }' (running '${packageManager} ${installOptions.join(" ")} ${
        cli.package
      }')...`
    );

    runCommand(packageManager, installOptions.concat(cli.package))
      .then(() => {
        require(cli.package); //eslint-disable-line
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  });
} else {
  const path = require("path");
  const pkgPath = require.resolve(`${cli.package}/package.json`);
  // eslint-disable-next-line node/no-missing-require
  const pkg = require(pkgPath);
  // eslint-disable-next-line node/no-missing-require
  require(path.resolve(path.dirname(pkgPath), pkg.bin[cli.binName]));
}
