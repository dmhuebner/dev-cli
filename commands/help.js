const consoleStyles = require('../utils/consoleStyles')();

const menus = {
  main: `
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
${consoleStyles.centered('dev-cli Help Menu')}

    dev-cli [command] <options>
    ${consoleStyles.setConsoleColor('yellow', 'generate')} ........... generates a seed project based on the second argument you pass
    ${consoleStyles.setConsoleColor('yellow', 'version')} ............ show package version
    ${consoleStyles.setConsoleColor('yellow', 'help')} ............... show help menu for a command

${consoleStyles.verticalSpace()}
${consoleStyles.horizontalLine()}`,

  today: `
    outside today <options>

    --location, -l ..... the location to use`
};

module.exports = (args) => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
}