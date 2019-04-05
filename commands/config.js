const consoleStyles = require('../utils/consoleStyles')(),
    processFiles = require('../utils/processFiles')(),
    processConfigs = require('../utils/processConfigs')(),
    path = require('path'),
    fs = require('fs'),
    ora = require('ora'),
    inquirer = require('inquirer');
seedProjectDirectory = require('../templates/seedProjectsDirectory');

module.exports = (args) => {
    // TODO make custom config args
    const templates = fs.readdirSync(path.join(__dirname, '/../templates'));

    console.log('CONFIG!');

    const questionPromptsArray = [];

    const question = {
        type: 'input',
        name: 'generatorTemplatePath',
        message: 'Enter custom path to the templates directory that you want to use with the generator.',
        default: 'none'
    };

    questionPromptsArray.push(question);

    inquirer.prompt(questionPromptsArray).then(answers => {
        const parsedData = processConfigs.getConfigs();
        const updatedData = {...parsedData};

        if (typeof (answers.generatorTemplatePath) === 'string') {
            updatedData.generator.templatesDirectory = answers.generatorTemplatePath.trim();
        }

        processConfigs.setConfigs(updatedData);

        console.log('The Generator templates directory has been changed to:', updatedData.generator.templatesDirectory);
    });
};
