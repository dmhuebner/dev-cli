const consoleStyles = require('../utils/consoleStyles')(),
      fs = require('fs'),
      path = require('path'),
      seedProjectsDirectory = require('../templates/seedProjectsDirectory');

const templates = fs.readdirSync(path.join(__dirname, '/../templates'));
let templatesListString = '';

seedProjectsDirectory.seedProjects.forEach(projectInfo => {
  if (templates.indexOf(projectInfo.name) !== -1) {
    templatesListString += consoleStyles.setConsoleColor('pink', `\n${projectInfo.name}`);
    templatesListString += ` -  ${projectInfo.description}`;
  }
});
// const templatesListString = templates.join('\n');

const generateHelpContent = `
    dev-cli ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('yellow', '<type_of_project> <project_name> <project_author>')} (optional)

    ${consoleStyles.setConsoleColor('yellow', '<type_of_project>')} ..... The type of project you want to generate (must match the name of a project seed in templates)
    ${consoleStyles.setConsoleColor('yellow', '<project_name>')} ........ The name of the project
    ${consoleStyles.setConsoleColor('yellow', '<project_author>')} ...... The author of the project (optional)
    \nTypes of projects you can generate:\n${templatesListString}`;

const mainHelpContent = `
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
${consoleStyles.centered('dev-cli Help Menu')}

    dev-cli [command] <options>
    ${consoleStyles.setConsoleColor('yellow', 'generate')} ........... generates a seed project based on the second argument you pass
    ${consoleStyles.setConsoleColor('yellow', 'g')} .................. Alias for generate
    ${consoleStyles.setConsoleColor('yellow', 'version')} ............ show package version
    ${consoleStyles.setConsoleColor('yellow', 'help')} ............... show help menu for a command

${consoleStyles.verticalSpace()}
${consoleStyles.horizontalLine()}`;

const menus = {
  main: mainHelpContent,
  generate: generateHelpContent,
  g: generateHelpContent
};

module.exports = (args) => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
}