const cli = require('./lib/cli');

const app = {};

// Init function
app.init = () => {

  // Start the CLI
  cli.init();
}

// Initialize the app
app.init();

module.exports = app;