const consoleStyles = require('../utils/consoleStyles')(),
      processFiles = require('../utils/processFiles')(),
      path = require('path'),
      fs = require('fs'),
      ora = require('ora'),
      seedProjectDirectory = require('../templates/seedProjectsDirectory');

module.exports = (args) => {
  const templates = fs.readdirSync(path.join(__dirname, '/../templates'));

  // Check if there is a template that matches the project_type argument
  if (templates && templates.length && templates.indexOf(args._[1].trim()) !== -1) {
    const spinner = ora('Generating project...\n').start();

    console.log(consoleStyles.horizontalLine('-'));
    console.log(consoleStyles.setConsoleColor('lightblue', `Generating ${args._[1]}`));

    // Add basic variables
    const variables = {
      projectName: args._[2].trim(),
      projectAuthor: args._[3] ? args._[3].trim() : ''
    };

    // Concatenate basic variables with custom variables for template
    seedProjectDirectory.seedProjects.some(projectSeedConfig => {
      if (projectSeedConfig.name === args._[1] && projectSeedConfig.customVariables) {
        // Add custom variables
        let varCounter = 0;

        for (let customVar in projectSeedConfig.customVariables) {
          variables[customVar] = args._[4 + varCounter];
          varCounter++;
        }
        return true;
      }
    });
    // give processFiles.generateProjectFromSeed a directory to interpolate all of the files in and copy to the user's current working directory
    const directory = args._[1].trim();
    const currentWorkingDir = process.cwd();

    // Generate new project from seed project
    processFiles.generateProjectFromSeed(path.join(__dirname, `/../templates/${directory}`), `${currentWorkingDir}/${args._[2]}`, variables).then((result) => {
      console.log(`${consoleStyles.setConsoleColor('green', result)}\n(${consoleStyles.setConsoleColor('yellow', args._[1].trim())}) project titled "${consoleStyles.setConsoleColor('lightblue', variables.projectName)}" was created successfully!`);
      spinner.text = `Project ${consoleStyles.setConsoleColor('yellow', args._[2])} generated successfully`;
      spinner.succeed();
    }).catch(error => {
      console.log(`${consoleStyles.setConsoleColor('red', 'Error: ')}`, error);
      spinner.fail();
    });
  } else {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. Cannot generate a project with '${args._[1]}'`);
  }
}
