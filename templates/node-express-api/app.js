const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      chalk = require('chalk'),
      debug = require('debug')('app'),
      logger = require('morgan'),
      config = require('./config'),
      packageJson = require('./package');


/*=================
* Database Setup
*=================*/
let db;
if (config.envName === 'test') {
  db = mongoose.connect('mongodb://localhost/{%projectName%}_TEST', { useNewUrlParser: true });  // TODO replace with unit test DB name
} else if (config.envName === 'production') {
  db = mongoose.connect('mongodb://localhost/{%projectName%}_PROD', { useNewUrlParser: true }); // TODO replace with prod DB name
} else {
  db = mongoose.connect('mongodb://localhost/{%projectName%}_DEV', { useNewUrlParser: true }); // TODO replace with Test DB name
}

const app = express(),
  port = process.env.NODE_ENV.port || 3000;

// Middleware
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/*========================
* Enable CORS Middleware
*========================*/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200'); // TODO localhost port may need to be changed
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

/*======================
* Model dependencies
*======================*/

const {%firstModel[capitalized]%} = require('./src/models/{%firstModel[capitalized]%}');

/*======================
* Router Dependencies
*======================*/

const {%firstModel%}Router = require('./src/routes/{%firstModel%}Routes')({%firstModel[capitalized]%});

/*======================
* Main routes
*======================*/
// TODO Add your routes
app.use('/{%firstModel%}', {%firstModel%}Router);

// Health check
app.get('/', (req, res) => {
  res.send(`${packageJson.name} v${packageJson.version} is up and running on Port: ${port}`); // TODO replace welcome text
});

/*======================
* Listen to the server
*======================*/

app.listen(port, () => {
  console.log(`${chalk.cyan(`{%projectName%} v${packageJson.version} is running on PORT:`)} ${chalk.green(port)}`); // TODO replace listening text
});

module.exports = app;
