const consoleStyles = require('../utils/consoleStyles')(),
    processFiles = require('../utils/processFiles')(),
    path = require('path'),
    fs = require('fs'),
    ora = require('ora'),
    inquirer = require('inquirer'),
    processConfigs = require('../utils/processConfigs')();

module.exports = (args) => {
  const {templateProject, newProjectName, argsFlag} = getGenerateArgs(args);
  const parsedConfigData = processConfigs.getConfigs();
  // TODO There should be some error handling for if you don't provide a valid directory - like if there is no seedProjectsDirectory.json
  const currentTemplatesDirectory = parsedConfigData && parsedConfigData.generate && parsedConfigData.generate.templatesDirectory ? parsedConfigData.generate.templatesDirectory : null;
  const {templates, templatesSourceDirectory, seedProjectsDirectory} = setSourceDirectories(currentTemplatesDirectory);

  // Check if there is a template that matches the project_type argument
  if (templates && templates.length && templates.indexOf(templateProject) !== -1) {
    if (newProjectName && newProjectName.split(',').length < 2) {

      console.log(consoleStyles.horizontalLine('-'));
      console.log(consoleStyles.setConsoleColor('lightblue', `Generating ${templateProject}`));

      // Add default variables
      const variables = {
        projectName: newProjectName
      };
      const currentConfigs = processConfigs.getConfigs();
      let delimiterToUse = currentConfigs.generate.defaultDelimiter;

      let questionPromptsArray = [];
      let quickVariableAnswers = {};

      // Concatenate basic variables with custom variables for template
      seedProjectsDirectory.seedProjects.some(projectSeedConfig => {
        // Check if the projectSeedConfig name matches the template name
        if (projectSeedConfig.name === templateProject && projectSeedConfig.customVariables) {

          if (projectSeedConfig.delimiter) {
            delimiterToUse = projectSeedConfig.delimiter;
          }

          // argsFlag is a string of values separated by " " - used to automatically supply values to projectTemplate variables
          if (argsFlag) {
            quickVariableAnswers = setProjectVariableAnswers(templateProject, projectSeedConfig.customVariables, argsFlag.split(',').map(a => a.trim()));
          } else {
            questionPromptsArray = createQuestionObjects(projectSeedConfig);
          }
          return true;
        }
      });

      if (argsFlag) {
        quickVariableAnswers.projectName = variables.projectName;
        generateProject(templatesSourceDirectory, templateProject, quickVariableAnswers, delimiterToUse);
      } else {
        inquirer.prompt(questionPromptsArray).then(answers => {
          // TODO Trim the answers before generating
          // TODO Check that all the answers are truthy
          answers.projectName = variables.projectName;
          // give processFiles.generateProjectFromSeed a template project to interpolate all of the files in and copy to the user's current working directory
          generateProject(templatesSourceDirectory, templateProject, answers, delimiterToUse);
        });
      }
    } else {
      errorMissingName();
    }
  } else {
    errorInvalidTemplate(templateProject);
  }

  function errorInvalidTemplate(projectTemplate) {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. Cannot generate a project with '${projectTemplate}' enter 'dev help generate' to see the options available`);
    console.log('------');
    console.log(`${consoleStyles.setConsoleColor('lightblue', 'Tip:')} Check to see which directory the dev-cli is configured to use for the generator command. enter 'dev help config generate' for help changing the Seed Templates directory`);
  }

  function errorMissingName() {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. New project needs to have a project name (it ideally shouldn't have spaces in it)`);
  }

  function errorInvalidNumberOfArgs(templateProject) {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. The number of arguments entered does not match the number of variables for the ${templateProject} template project.`);
  }

  function logError(error) {
    console.log(`${consoleStyles.setConsoleColor('red', 'Error: ')}`, error);
  }

  function logGenerateSuccess(projectTemplate, projectName) {
    console.log(`${consoleStyles.setConsoleColor('green', 'Success')}\n(${consoleStyles.setConsoleColor('yellow', projectTemplate)}) project titled "${consoleStyles.setConsoleColor('lightblue', projectName)}" was created successfully!`);
  }

  function generateProject(templatesSourceDirectory, sourceDir, projectVarAnswers, delimiterToUse) {
    const spinner = ora('Generating project...\n').start();
    const currentWorkingDir = process.cwd();
    // Generate new project from seed project with customVariable prompt answers
    processFiles.generateProjectFromSeed(`${templatesSourceDirectory}/${sourceDir}`, `${currentWorkingDir}/${projectVarAnswers.projectName}`, projectVarAnswers, delimiterToUse).then(() => {
      logGenerateSuccess(sourceDir, projectVarAnswers.projectName);
      spinner.text = `Project ${consoleStyles.setConsoleColor('yellow', projectVarAnswers.projectName)} generated successfully`;
      spinner.succeed();
      console.log('|');
      console.log(`cd into ${consoleStyles.setConsoleColor('yellow', projectVarAnswers.projectName)} and install any dependencies`);
    }).catch(error => {
      logError(error);
      spinner.fail();
    });
  }

  function createQuestionObjects(projectSeedConfig) {
    const questionPromptsArray = [];
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

    return questionPromptsArray;
  }

  function setSourceDirectories(currentTemplatesDirectory) {
    const sourceDirs = {};
    // Set the templatesSourceDirectory to a custom templates directory if there is one. Otherwise default to the internal templates directory.
    if (currentTemplatesDirectory && typeof(currentTemplatesDirectory) === 'string' && currentTemplatesDirectory.trim().toLowerCase() !== 'none') {
      sourceDirs.templates = fs.readdirSync(currentTemplatesDirectory);
      sourceDirs.templatesSourceDirectory = currentTemplatesDirectory;
      sourceDirs.seedProjectsDirectory = processConfigs.generator.getSeedProjectsDir(sourceDirs.templatesSourceDirectory);
    } else {
      sourceDirs.templates = fs.readdirSync(path.join(__dirname, '/../templates'));
      sourceDirs.templatesSourceDirectory = path.join(__dirname, '/../templates');
      sourceDirs.seedProjectsDirectory = require('../templates/seedProjectsDirectory');
    }

    return sourceDirs;
  }

  function getGenerateArgs(args) {
    return {
      templateProject: args._[1].trim(),
      newProjectName: args._[2].trim(),
      argsFlag: args && args.a && args.a.length ? args.a.trim() : null
    };
  }

  function setProjectVariableAnswers(templateProject, projectVariables, inputAnswersList) {
    const projectVariableKeys = Object.keys(projectVariables);
    if (projectVariableKeys.length === inputAnswersList.length) {
      const answerMap = {};
      projectVariableKeys.forEach((key, index) => {
        answerMap[key] = inputAnswersList[index];
      });
      return answerMap;
    } else {
      errorInvalidNumberOfArgs(templateProject);
      let errorMsg = `${templateProject}:\n\ntemplate variables:\n${projectVariableKeys.join('\n')}`;
      errorMsg += `\n\nArguments entered:\n${inputAnswersList.join('\n')}`;
      throw Error(errorMsg);
    }
  }
};
