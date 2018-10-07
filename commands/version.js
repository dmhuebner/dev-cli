const { version } = require('../package.json');
const consoleStyles = require('../utils/consoleStyles')();

module.exports = (args) => {
  console.log(consoleStyles.setConsoleColor('yellow', `v${version}`));
}