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
  port = config.port || 3000;

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

const {%firstModelCapitalized%} = require('./src/models/{%firstModelCapitalized%}');

/*======================
* Router Dependencies
*======================*/

const {%firstModelLowerCase%}Router = require('./src/routes/{%firstModelLowerCase%}Routes')({%firstModelCapitalized%});

/*======================
* Main routes
*======================*/
// TODO Add your routes
app.use('/api/{%firstModelLowerCase%}', {%firstModelLowerCase%}Router);

// Health check
app.get('/', (req, res) => {
  res.send(`${packageJson.name} is up and running on Port: ${packageJson}`); // TODO replace welcome text
});

/*======================
* Listen to the server
*======================*/

app.listen(port, () => {
  console.log(`${chalk.cyan('{%projectName%} is running on PORT:')} ${chalk.green(port)}`); // TODO replace listening text
});

module.exports = app;
