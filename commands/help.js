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
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
    dev ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('yellow', '<type_of_project> <project_name>')}

    ${consoleStyles.setConsoleColor('yellow', '<type_of_project>')} ........ The type of project you want to generate (must match the name of a project seed in templates)
    ${consoleStyles.setConsoleColor('yellow', '<project_name>')} ........... The name of the project
    \nEach project seed has custom variables you can pass in.
    \nOnce you press enter you will be prompted to enter values for the custom variables for that seed project.
    \nTypes of projects you can generate:\n${templatesListString}
    \nType ${consoleStyles.setConsoleColor('lightblue', 'dev help <type_of_project>')} for more information about generating that type of project.`;

const mainHelpContent = `
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
${consoleStyles.centered('dev Help Menu')}

    dev [command] <options>
    ${consoleStyles.setConsoleColor('yellow', 'generate, g')} ............. generates a project based on a seed template using custom variables you provide.
    ${consoleStyles.setConsoleColor('yellow', 'version')} ................. show package version
    ${consoleStyles.setConsoleColor('yellow', 'help, h, man')} ............ show help menu for a command

${consoleStyles.verticalSpace()}
${consoleStyles.horizontalLine()}`;

const menus = {
  main: mainHelpContent,
  generate: generateHelpContent,
  g: generateHelpContent
};

const generateProjectVariableHelpDescription = (customVariables) => {
  let outputString = 'Custom variables\n';

  for (let customVar in customVariables) {
    outputString += `${consoleStyles.setConsoleColor('yellow', `<${customVar}>`)} ........ ${customVariables[customVar]}\n`;
  }

  return outputString;
};

const generateSeedProjectHelpContent = (project) => {
  let helpStringContent = `${project.description}\n`;

  helpStringContent += `\ndev ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('pink', `${project.name}`)} ${consoleStyles.setConsoleColor('yellow', '<project_name>')}\n\n`;
  helpStringContent += generateProjectVariableHelpDescription(project.customVariables);

  return helpStringContent;
};

// Add template help views to menu:
seedProjectsDirectory.seedProjects.forEach(project => {
  menus[project.name] = generateSeedProjectHelpContent(project);
});

module.exports = (args) => {
  const subCmd = args._[0] === 'help' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
