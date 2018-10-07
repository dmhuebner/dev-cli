const consoleStyles = require('../utils/consoleStyles')();

module.exports = (args) => {
  switch (args._[1].trim()) {
    case 'node-cli':
      // generate node-cli project with params (args._[2])
      console.log(consoleStyles.setConsoleColor('lightblue', `Generating ${args._[1]}...`));
      break;
    default:
      console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. Cannot generate a project with '${args._[1]}'`);
  }
}