/*====================
 CLI related tasks
====================*/

/* Dependencies */

const readline = require('readline'),
      util = require('util'),
      debug = util.debuglog('cli'),
      events = require('events'),
      commands = require('./commands'),
      helpers = require('./helpers');

class _events extends events {};
const e = new _events();

// Instantiate CLI module object
const cli = {};

/*=====================
 Input Event Handlers
======================*/

e.on('man', (string) => {
  cli.responders.help();
});

e.on('help', (string) => {
  cli.responders.help();
});

e.on('exit', () => {
  process.exit(0);
});

/*====================
 CLI style functions
=====================*/

// Create vertical space
cli.verticalSpace = (lines) => {
  lines = lines && typeof(lines) === 'number' ? lines : 1;

  for (let i = 0; i < lines; i++) {
    console.log('');
  }
};

// Create a horizontal line across the terminal
cli.horizontalLine = () => {
  // Get the available screen size
  const width = process.stdout.columns;
  let line = '';

  for (let i = 0; i < width; i++) {
    line += '=';
  }

  console.log(line);
};

// Create centered text on the screen
cli.centered = (string) => {
  string = string.trim() && typeof(string) === 'string' ? string.trim() : '';

  // Get the available screen size
  const width = process.stdout.columns;

  // Calculate the required left padding
  const leftPadding = Math.floor((width - string.length) / 2);

  // Add leftPadding before the string
  let line = '';

  for (let i = 0; i < leftPadding; i++) {
    line += ' ';
  }

  line += string;

  console.log(line);
};

/*==================
 Event Responders
===================*/

cli.responders = {};

// help / man
cli.responders.help = () => {
  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command followed by its explanation in white and yellow respectively
  for (let key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 50 - line.length;

      for (let i = 0; i < padding; i++) {
        line += ' ';
      }

      line += value;

      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace();
  cli.horizontalLine();
};

// Exit
cli.responders.exit = () => {
  process.exit(0);
};

// Input processor
cli.processInput = (string) => {
  string = typeof(string) === 'string' && string.trim().length ? string.trim() : null;

  // Process the input if the user wrote something, otherwise ignore it
  if (string) {

    // Get acceptable command inputs from commands file
    const commandInputs = [];

    for (let key in commands) {
      if (commands.hasOwnProperty(key)) {
        commandInputs.push(key);
      }
    }

    // Go through the possible inputs an emit an event when a match is found
    let matchFound = false;
    let counter = 0;

    commandInputs.some((input) => {
      if (string.toLowerCase().indexOf(input) !== -1) {
        matchFound = true;

        // Emit an event matching the unique input and include the full string given by user
        e.emit(input, string);
        return true;
      }
    });

    // If no match is found, tell user to try again
    if (!matchFound) {
      console.log(`${helpers.setConsoleColor('red', 'Invalid Input')} - Please try again.\nEnter 'help' for a list of valid inputs.`);
    }
  }
};

// Init script
cli.init = () => {
  // Send the start message to the console in dark blue
  console.log(helpers.setConsoleColor('blue', 'The CLI is running'));

  // Start the CLI interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ''
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separately
  _interface.on('line', (string) => {
    // Send to the input processor
    cli.processInput(string);
  });

  // Re-initialize the prompt
  _interface.prompt();

  // If the user stops the CLI, kill the associated process
  _interface.on('close', () => {
    process.exit(0);
  });

};

module.exports = cli;