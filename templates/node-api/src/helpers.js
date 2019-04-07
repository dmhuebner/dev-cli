/***************************
* general helper functions
****************************/

const crypto = require('crypto'),
      config = require('../config');

// Container for helpers
const helpers = () => {
  // Create a SHA256 hash
  const hash = (str) => {
    if (typeof(str) === 'string' && str.length > 0) {
      return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
      return false;
    }
  };

// Parse a JSON string to an object in all cases, without throwing an error
  const parseJsonToObject = (string) => {
    try {
      return JSON.parse(string);
    } catch(error) {
      return {};
    }
  };

// Create a string of random alphanumeric characters of a given length
  const createRandomString = (stringLength) => {
    stringLength = typeof(stringLength) === 'number' && stringLength > 0 ? stringLength : false;

    if (stringLength) {
      // Define all the possible characters that could go into a string
      const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

      let randomString = '';

      for (let i = 1; i <= stringLength; i++) {
        // Get a random character from possibleCharacteers
        const randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append random character
        randomString += randomChar;
      }

      return randomString;
    }
  };

  return {
    hash,
    parseJsonToObject,
    createRandomString
  };
};

module.exports = helpers;
