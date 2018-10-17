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

    ${consoleStyles.setConsoleColor('yellow', '<type_of_project>')} ........ The type of project you want to generate (must match the name of a project seed in templates)
    ${consoleStyles.setConsoleColor('yellow', '<project_name>')} ........... The name of the project
    ${consoleStyles.setConsoleColor('yellow', '<project_author>')} ......... The author of the project
    ${consoleStyles.setConsoleColor('yellow', '<CUSTOM_VARIABLE>...')} ........ Custom variable (there may be multiple) specific to the seed project
    \nTypes of projects you can generate:\n${templatesListString}
    \nType ${consoleStyles.setConsoleColor('lightblue', 'dev-cli help <type_of_project>')} for more information about generating that type of project.`;

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

const generateProjectVariableHelpDescription = (customVariables) => {
  let outputString = '';

  outputString += `${consoleStyles.setConsoleColor('yellow', '<project_name>')} ........... The name of the project\n`;
  outputString += `${consoleStyles.setConsoleColor('yellow', '<project_author>')} ......... The author of the project\n`;

  for (let customVar in customVariables) {
    outputString += `${consoleStyles.setConsoleColor('yellow', `<${customVar}>`)} ........ ${customVariables[customVar]}\n`;
  }

  return outputString;
}

const generateSeedProjectHelpContent = (project) => {
  const customVarsArray = Object.keys(project.customVariables);
  customVarsArray.unshift('project_name', 'project_author');
  const customVarsFormattedArray = customVarsArray.map(variable => `<${variable}>`);
  const customVarsString = customVarsFormattedArray.join(' ');
  let helpStringContent = `${project.description}\n`;

  helpStringContent += `\ndev-cli ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('pink', `${project.name}`)} ${consoleStyles.setConsoleColor('yellow', customVarsString)}\n\n`;
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
}