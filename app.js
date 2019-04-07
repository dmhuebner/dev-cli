const minimist = require('minimist'),
      consoleStyles = require('./utils/consoleStyles')();

module.exports = () => {
  const args = minimist(process.argv.slice(2));

  let cmd = args._[0] || 'help';

  if (args.version || args.v) {
    cmd = 'version';
  }

  if (args.help || args.h) {
    cmd = 'help';
  }

  switch (cmd) {
    case 'generate':
    case 'g':
      require('./commands/generate')(args);
      break;
    case 'snippet':
    case 'snip':
    case 's':
      require('./commands/snip')(args);
      break;
    case 'config':
    case 'c':
      require('./commands/config')(args);
      break;
    case 'version':
    case '--version':
    case '-v':
      require('./commands/version')(args);
      break;
    case 'help':
    case 'h':
    case 'man':
      require('./commands/help')(args);
      break;
    default:
      console.error(`${consoleStyles.setConsoleColor('red', 'Error:')}" ${cmd}" is not a valid command.`);
      console.log('Type "dev help" for a list of valid commands');
      break;
  }
};
