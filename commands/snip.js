const consoleStyles = require('../utils/consoleStyles')(),
    processFiles = require('../utils/processFiles')(),
    path = require('path'),
    fs = require('fs'),
    ora = require('ora'),
    inquirer = require('inquirer'),
    clipboardy = require('clipboardy');

module.exports = (args) => {
    const snippets = fs.readdirSync(path.join(__dirname, '/../snippets'));

    // Check that there was only the one "snip" argument passed
    if (snippets && snippets.length && args._.length < 2) {

        // TODO the contents of this if block should be a function

        console.log(consoleStyles.horizontalLine('-'));
        console.log(consoleStyles.setConsoleColor('lightblue', `Choose a Snippet to copy to your clipboard`));

        // Read data from a file
        const rawFileData = fs.readFileSync(path.join(__dirname, `/../snippets`, 'snippets.json'));
        const parsedData = processFiles.parseJsonToObject(rawFileData);

        const questionPromptsArray = [];

        const question = {
            type: 'list',
            name: 'chosenSnippet',
            message: 'Choose a Snippet',
            choices: []
        };

        // Create list of snippets for user to choose from
        parsedData.forEach(snippetObj => {
            if (snippetObj) {
                question.choices.push({
                    name: snippetObj.name,
                    value: snippetObj
                });
            }
        });

        questionPromptsArray.push(question);

        inquirer.prompt(questionPromptsArray).then(answers => {

            // Copy chosenSnippet to clipboard
            clipboardy.writeSync(answers.chosenSnippet.content);

            console.log('|');
            console.log('');
            console.log('');
            console.log(`${consoleStyles.setConsoleColor('yellow', `${answers.chosenSnippet.content}`)}`);
            console.log('');
            console.log('');
            console.log('|');
            console.log(`${consoleStyles.setConsoleColor('pink', `Copied `)}${consoleStyles.setConsoleColor('yellow', `${answers.chosenSnippet.name}`)}${consoleStyles.setConsoleColor('pink', ` to Clipboard!`)}`);
            console.log(consoleStyles.horizontalLine('-'));
        });
    } else if (snippets && snippets.length && args._.length === 2 && args._[1].toLowerCase() === 'new') {
        // TODO create new snippets
        console.log(consoleStyles.horizontalLine('-'));
        console.log(consoleStyles.setConsoleColor('lightblue', `Create a new Snippet`));

        const fromClipboard = clipboardy.readSync();

        if (fromClipboard) {
            const questionPromptsArray = [
                {
                    type: 'input',
                    name: 'name',
                    message: 'Snippet Name'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Snippet Description'
                }
            ];

            inquirer.prompt(questionPromptsArray).then(answers => {

                answers.content = fromClipboard;

                // Read data from a file
                const rawFileData = fs.readFileSync(path.join(__dirname, `/../snippets`, 'snippets.json'));
                const parsedData = processFiles.parseJsonToObject(rawFileData);

                // Create list of snippets for user to choose from
                parsedData.push(answers);

                fs.writeFileSync(path.join(__dirname, `/../snippets/snippets.json`), JSON.stringify(parsedData));

                console.log('|');
                console.log('');
                console.log('');
                console.log(`${consoleStyles.setConsoleColor('yellow', `${fromClipboard}`)}`);
                console.log('');
                console.log('');
                console.log('|');
                console.log(`${consoleStyles.setConsoleColor('green', `Created `)}${consoleStyles.setConsoleColor('yellow', `${answers.name}`)} Snippet from ${consoleStyles.setConsoleColor('pink', `clipboard`)} content!`);
                console.log(consoleStyles.horizontalLine('-'));
            });
        } else {
            console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} Unable to create snippet. There is nothing copied to your device's clipboard. Copy something to your clipboard to create a snippet.`);
        }
    } else {
        if (snippets && snippets.length) {
            console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} Invalid number or arguments or type of arguments. Type "${consoleStyles.setConsoleColor('lightblue', `dev help snippet`)}" for information on how to use snippet.`);
        } else {
            console.log(`${consoleStyles.setConsoleColor('red', 'Error:')} No Snippets found. You must add snippets before you can use this command.`);
        }
    }
};
