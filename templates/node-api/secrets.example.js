/*** This file should be replaced with a 'secrets.js' file that has actual API credentials ***/

const secrets = {
  env: {
    test: {
      hashingSecret: 'thisIsASecret'
    },
    production: {
      hashingSecret: 'thisIsAlsoASecret'
    }
  }
};

module.exports = secrets;