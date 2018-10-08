const consoleStyles = require('../utils/consoleStyles')(),
      processFiles = require('../utils/processFiles')(),
      path = require('path'),
      fs = require('fs');

module.exports = (args) => {
  const templates = fs.readdirSync(path.join(__dirname, '/../templates'));

  // Check if there is a template that matches the project_type argument
  if (templates && templates.length && templates.indexOf(args._[1].trim()) !== -1) {
    console.log(consoleStyles.horizontalLine('-'));
    console.log(consoleStyles.setConsoleColor('lightblue', `Generating ${args._[1]}...`));
    const variables = {
      projectName: args._[2].trim(),
      projectAuthor: args._[3] ? args._[3].trim() : ''
    };
    // give processFiles.createProject a directory to interpolate all of the files in and copy to the user's current working directory
    const directory = args._[1].trim();
    processFiles.generateProjectFromSeed(path.join(__dirname, `/../templates/${directory}`), path.join(__dirname, `/../output/${args._[2]}`), variables).then((result) => {
      console.log(`${consoleStyles.setConsoleColor('green', result)}\n(${consoleStyles.setConsoleColor('yellow', args._[1].trim())}) project titled "${consoleStyles.setConsoleColor('lightblue', variables.projectName)}" was created successfully!`);
    }).catch(error => {
      console.log(`${consoleStyles.setConsoleColor('red', 'Error: ')}`, error);
    });
  } else {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. Cannot generate a project with '${args._[1]}'`);
  }
}