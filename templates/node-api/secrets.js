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