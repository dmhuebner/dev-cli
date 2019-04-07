const consoleStyles = require('../utils/consoleStyles')(),
    processConfigs = require('../utils/processConfigs')(),
    fs = require('fs'),
    inquirer = require('inquirer'),
    helpCommand = require('./help');

module.exports = (args) => {

    const configGenerate = () => {
        const questionPromptsArray = [];

        console.log(consoleStyles.horizontalLine('-'));
        console.log('');
        console.log(consoleStyles.centered('Generator Configuration'));
        console.log('');

        const question = {
            type: 'input',
            name: 'generatorTemplatePath',
            message: 'Enter custom path to the templates directory that you want to use with the Generate command.',
            default: 'none'
        };

        questionPromptsArray.push(question);

        inquirer.prompt(questionPromptsArray).then(answers => {
            const parsedData = processConfigs.getConfigs();
            const updatedData = JSON.parse(JSON.stringify(parsedData));

            if (typeof (answers.generatorTemplatePath) === 'string') {
                updatedData.generate.templatesDirectory = answers.generatorTemplatePath.trim();
            }

            console.log('');

            try {
                // Try to use the new path to make sure it exists
                if (updatedData.generate.templatesDirectory.toLowerCase() !== 'none') {
                    fs.readdirSync(updatedData.generate.templatesDirectory);
                    console.log(`${consoleStyles.setConsoleColor('green', 'Success')} - The Generator templates directory has been changed to: ${consoleStyles.setConsoleColor('lightblue', updatedData.generate.templatesDirectory)}`);
                } else {
                    console.log(`${consoleStyles.setConsoleColor('green', 'Success')} - The Generator ${consoleStyles.setConsoleColor('yellow', 'templates directory has been reset')} to the internal default directory`);
                }

                // Only set the configs if the path to the custom templates directory is a valid path
                processConfigs.setConfigs(updatedData);
            } catch (error) {
                console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} Invalid Path. The path you entered to your custom templates directory is invalid. Please try again.`);
            }
        });
    };

    const resetGeneratorConfig = () => {
        console.log(consoleStyles.horizontalLine('-'));
        console.log(consoleStyles.centered('\n\nGenerator Configuration\n\n'));
        console.log('Restoring Generator settings to default\n');

        const parsedData = processConfigs.getConfigs();
        const updatedData = JSON.parse(JSON.stringify(parsedData));
        updatedData.generate.templatesDirectory = 'none';

        processConfigs.setConfigs(updatedData);

        console.log(`${consoleStyles.setConsoleColor('green', 'Success')} - The Generator ${consoleStyles.setConsoleColor('yellow', 'templates directory has been reset')} to the internal default directory`);
    };

    if (args._[1]) {
        switch (args._[1]) {
            case 'g':
            case 'generate':
                // Check if reset argument was passed in
                if (args._[2] && args._[2].toLowerCase() === 'reset') {
                    resetGeneratorConfig();
                } else {
                    configGenerate();
                }
                break;
            default:
                console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} Invalid argument. There are no configuration options for '${consoleStyles.setConsoleColor('yellow', `${args._[1]}`)}' enter ${consoleStyles.setConsoleColor('lightblue', 'dev help config')} to see the options available`);
        }
    } else {
        console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} invalid argument. There are no configuration options for '${args._[1]}' enter 'dev help config' to see the options available\n`);
        helpCommand({"_": ['help', 'config']});
    }
};
