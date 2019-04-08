const consoleStyles = require('../utils/consoleStyles')(),
    processFiles = require('../utils/processFiles')(),
    path = require('path'),
    fs = require('fs'),
    ora = require('ora'),
    inquirer = require('inquirer'),
    processConfigs = require('../utils/processConfigs')();

module.exports = (args) => {
  let templates;
  let templatesSourceDirectory;
  let seedProjectsDirectory;
  const parsedConfigData = processConfigs.getConfigs();
  // TODO There should be some error handling for if you don't provide a valid directory - like if there is no seedProjectsDirectory.json

  const currentTemplatesDirectory = parsedConfigData && parsedConfigData.generate && parsedConfigData.generate.templatesDirectory ? parsedConfigData.generate.templatesDirectory : null;

  // Set the templatesSourceDirectory to a custom templates directory if there is one. Otherwise default to the internal templates directory.
  if (currentTemplatesDirectory && typeof(currentTemplatesDirectory) === 'string' && currentTemplatesDirectory.trim().toLowerCase() !== 'none') {
    templates = fs.readdirSync(currentTemplatesDirectory);
    templatesSourceDirectory = currentTemplatesDirectory;

    seedProjectsDirectory = processConfigs.generator.getSeedProjectsDir(templatesSourceDirectory);
  } else {
    templates = fs.readdirSync(path.join(__dirname, '/../templates'));
    templatesSourceDirectory = path.join(__dirname, '/../templates');
    seedProjectsDirectory = require('../templates/seedProjectsDirectory');
  }

  // Check if there is a template that matches the project_type argument
  if (templates && templates.length && templates.indexOf(args._[1].trim()) !== -1) {
    if (args._[2] && args._[2].split(' ').length < 2) {

      console.log(consoleStyles.horizontalLine('-'));
      console.log(consoleStyles.setConsoleColor('lightblue', `Generating ${args._[1]}`));

      // Add basic variables
      const variables = {
        projectName: args._[2].trim()
      };

      const questionPromptsArray = [];

      // Concatenate basic variables with custom variables for template
      seedProjectsDirectory.seedProjects.some(projectSeedConfig => {
        if (projectSeedConfig.name === args._[1] && projectSeedConfig.customVariables) {

          // Create question objects for each customVariable in the seed template
          for (let customVar in projectSeedConfig.customVariables) {
            if (projectSeedConfig.customVariables.hasOwnProperty(customVar)) {

              const question = {
                type: 'input',
                name: customVar,
                message: projectSeedConfig.customVariables[customVar],
                default: projectSeedConfig.customVariables[customVar]
              };

              if (customVar === 'firstModel') {
                question.default = 'foo';
              }

              questionPromptsArray.push(question);
            }
          }
          return true;
        }
      });

      inquirer.prompt(questionPromptsArray).then(answers => {
        // TODO Trim the answers before generating
        // TODO Check that all the answers are truthy
        answers.projectName = variables.projectName;

        const spinner = ora('Generating project...\n').start();
        // give processFiles.generateProjectFromSeed a directory to interpolate all of the files in and copy to the user's current working directory
        const directory = args._[1].trim();
        const currentWorkingDir = process.cwd();

        // Generate new project from seed project with customVariable prompt answers
        processFiles.generateProjectFromSeed(`${templatesSourceDirectory}/${directory}`, `${currentWorkingDir}/${args._[2]}`, answers).then(() => {
          console.log(`${consoleStyles.setConsoleColor('green', 'Success')}\n(${consoleStyles.setConsoleColor('yellow', args._[1].trim())}) project titled "${consoleStyles.setConsoleColor('lightblue', variables.projectName)}" was created successfully!`);
          spinner.text = `Project ${consoleStyles.setConsoleColor('yellow', args._[2])} generated successfully`;
          spinner.succeed();
          console.log('|');
          console.log(`cd into ${consoleStyles.setConsoleColor('yellow', args._[2])} and install any dependencies`);
        }).catch(error => {
          console.log(`${consoleStyles.setConsoleColor('red', 'Error: ')}`, error);
          spinner.fail();
        });
      });
    } else {
      console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. New project needs to have a project name (it ideally shouldn't have spaces in it)`);
    }
  } else {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. Cannot generate a project with '${args._[1]}' enter 'dev help generate' to see the options available`);
    console.log('------');
    console.log(`${consoleStyles.setConsoleColor('lightblue', 'Tip:')} Check to see which directory the dev-cli is configured to use for the generator command. enter 'dev help config generate' for help changing the Seed Templates directory`);
  }
};
