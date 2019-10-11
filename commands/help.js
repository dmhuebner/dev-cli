const consoleStyles = require('../utils/consoleStyles')(),
      fs = require('fs'),
      path = require('path'),
      processConfigs = require('../utils/processConfigs')();

let templates,
    seedProjectsDirectory;

const parsedConfigData = processConfigs.getConfigs();
const currentTemplatesDirectory = parsedConfigData && parsedConfigData.generate && parsedConfigData.generate.templatesDirectory ? parsedConfigData.generate.templatesDirectory : null;

// Set the templatesSourceDirectory to a custom templates directory if there is one. Otherwise default to the internal templates directory.
if (currentTemplatesDirectory && typeof(currentTemplatesDirectory) === 'string' && currentTemplatesDirectory.trim().toLowerCase() !== 'none') {

  templates = fs.readdirSync(currentTemplatesDirectory);

  seedProjectsDirectory = processConfigs.generator.getSeedProjectsDir(currentTemplatesDirectory);
  console.log('Custom templates dir');
} else {
  templates = fs.readdirSync(path.join(__dirname, '/../templates'));
  seedProjectsDirectory = require('../templates/seedProjectsDirectory')
}


let generateTemplatesListString = '';

seedProjectsDirectory.seedProjects.forEach(projectInfo => {
  if (templates.indexOf(projectInfo.name) !== -1) {
    generateTemplatesListString += consoleStyles.setConsoleColor('pink', `            ${projectInfo.name}`);
    generateTemplatesListString += ` -  ${projectInfo.description}\n`;
  }
});

const configs = processConfigs.getConfigs();
const commands = Object.keys(configs);

let configCommandsListString = '';

commands.forEach(command => {
  configCommandsListString += consoleStyles.setConsoleColor('pink', `            ${command}`);
  configCommandsListString += ` -  ${configs[command].description}\n`;
});

const generateHelpContent = `
${consoleStyles.horizontalLine()}

${consoleStyles.centered('Generate Command Help Menu')}

    dev ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('yellow', '<type_of_project> <project_name>')}

    ${consoleStyles.setConsoleColor('yellow', '<type_of_project>')} ........ The type of project you want to generate (must match the name of a project seed in templates)
    ${consoleStyles.setConsoleColor('yellow', '<project_name>')} ........... The name of the project

        Each project seed has custom variables you can pass in.

        Once you press enter you will be prompted to enter values for the custom variables for that seed project.

        ${consoleStyles.setConsoleColor('lightblue', `Types of projects you can generate:`)}\n${generateTemplatesListString}

        Type ${consoleStyles.setConsoleColor('lightblue', 'dev help <type_of_project>')} for more information about generating that type of project.
`;

const snippetHelpContent = `
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
    Select a saved snippet to copy to your clipboard.

    dev ${consoleStyles.setConsoleColor('lightblue', 'snippet')}
    dev ${consoleStyles.setConsoleColor('lightblue', 'snip')}
    dev ${consoleStyles.setConsoleColor('lightblue', 's')}
    
    Create a new snippet with the content you currently have copied to your clipboard.
    
    dev ${consoleStyles.setConsoleColor('lightblue', 'snippet')} ${consoleStyles.setConsoleColor('yellow', 'new')}
    dev ${consoleStyles.setConsoleColor('lightblue', 'snip')} ${consoleStyles.setConsoleColor('yellow', 'new')}
    dev ${consoleStyles.setConsoleColor('lightblue', 's')} ${consoleStyles.setConsoleColor('yellow', 'new')}
    
    Provide values for the questions below:
    
    ${consoleStyles.setConsoleColor('yellow', '<name>')} .................. The name of the new snippet
    ${consoleStyles.setConsoleColor('yellow', '<description>')} ........... A description of the new snippet
`;

const configHelpContent = `
${consoleStyles.horizontalLine()}

${consoleStyles.centered('Command Configurations')}

    
    dev ${consoleStyles.setConsoleColor('lightblue', 'config')} ${consoleStyles.setConsoleColor('yellow', '<command>')}
    dev ${consoleStyles.setConsoleColor('lightblue', 'c')} ${consoleStyles.setConsoleColor('yellow', '<command>')}
    
    Commands you can configure:\n${configCommandsListString}
    
    Type ${consoleStyles.setConsoleColor('lightblue', 'dev help config-<command>')} for more information about configuring that command.
    
${consoleStyles.horizontalLine('-')}
`;

const mainHelpContent = `
${consoleStyles.horizontalLine()}
${consoleStyles.verticalSpace()}
${consoleStyles.centered('dev Help Menu')}

    dev [command] <options>
    ${consoleStyles.setConsoleColor('yellow', 'generate (g)')} ............... Generates a project based on a seed template using custom variables you provide.

    ${consoleStyles.setConsoleColor('yellow', 'snippet (snip, s)')} .......... Creates snippets from contents of your clipboard and lets you cycle through previously saved snippets and copy them to your clipboard.
    
    ${consoleStyles.setConsoleColor('yellow', 'config (c)')} ................. Configure certain commands.

    ${consoleStyles.setConsoleColor('yellow', 'version')} ................... Show package version

    ${consoleStyles.setConsoleColor('yellow', 'help (h, man)')} .............. Show help menu for a command (dev help <command>)

${consoleStyles.verticalSpace()}
${consoleStyles.horizontalLine()}`;

const menus = {
  main: mainHelpContent,
  generate: generateHelpContent,
  g: generateHelpContent,
  snippet: snippetHelpContent,
  snip: snippetHelpContent,
  s: snippetHelpContent,
  config: configHelpContent,
  c: configHelpContent,
};

const generateProjectVariableHelpDescription = (customVariables) => {
  let outputString = 'Custom variables\n';

  for (let customVar in customVariables) {
    outputString += `${consoleStyles.setConsoleColor('yellow', `<${customVar}>`)} ............ ${customVariables[customVar]}\n`;
  }

  return outputString;
};

const generateSeedProjectHelpContent = (project) => {
  let helpStringContent = `
${consoleStyles.horizontalLine()}

  ${consoleStyles.centered(`Generatable Template ${project.name} Help Menu`)}

  ${project.description}\n`;

  // Add any customHelp content if there is any
  helpStringContent += project.customHelp ? `\n${project.customHelp}\n` : '';

  helpStringContent += `\ndev ${consoleStyles.setConsoleColor('lightblue', 'generate')} ${consoleStyles.setConsoleColor('pink', `${project.name}`)} ${consoleStyles.setConsoleColor('yellow', '<project_name>')}\n\n`;
  helpStringContent += generateProjectVariableHelpDescription(project.customVariables);

  return helpStringContent;
};

const generateConfigHelpContent = (command) => {
  const capitalizedCommand = command.substring(0, 1).toUpperCase() + command.substring(1);
  let currentTemplatesDir;

  if (configs[command].templatesDirectory.toLowerCase() !== 'none') {
    currentTemplatesDir = consoleStyles.setConsoleColor('lightblue', configs[command].templatesDirectory);
  } else {
    currentTemplatesDir = consoleStyles.setConsoleColor('yellow', 'Internal default directory');
  }

  return `${consoleStyles.horizontalLine('-')}

${consoleStyles.centered(`${capitalizedCommand} Command Configurations`)}

${configs[command].description}
  
  dev ${consoleStyles.setConsoleColor('lightblue', 'config')} ${consoleStyles.setConsoleColor('yellow', 'generate')} ................ Allows you to specify a custom templates directory for your generatable seed projects.
  dev ${consoleStyles.setConsoleColor('lightblue', 'config')} ${consoleStyles.setConsoleColor('yellow', 'generate')} ${consoleStyles.setConsoleColor('pink', 'reset')} .......... Resets the generator templates directory to point to the internal, default templates directory.
  
The generator templates directory is currently set to: ${consoleStyles.setConsoleColor('yellow', currentTemplatesDir)}

${consoleStyles.horizontalLine('-')}`;
};

// Add template help views for generatable templates to menu:
seedProjectsDirectory.seedProjects.forEach(project => {
  menus[project.name] = generateSeedProjectHelpContent(project);
});

// Add template help views for command configs to menu:
commands.forEach(command => {
  menus[`config-${command}`] = generateConfigHelpContent(command);
});

module.exports = (args) => {

  const subCmd = args._[0] === 'help' || args._[0] === 'h' ? args._[1] : args._[0];

  console.log(menus[subCmd] || menus.main);
};
