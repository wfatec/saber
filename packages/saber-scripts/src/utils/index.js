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

const runCommand = require('./runCommand')

module.exports = {
    isInstalled,
    runCommand
}
