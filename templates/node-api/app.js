const server = require('./src/server');

const app = {};

// Init function
app.init = () => {
  // Start the server
  server.init();
}

// Execute Init
app.init();

module.exports = app;