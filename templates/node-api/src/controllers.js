/***********************
* Request Controllers
************************/

// Handlers container
const controllers = () => {
  const ping = (data, callback) => {
    // Callback HTTP status code and payload
    callback(200, {routeName: 'ping'});
  }

  const notFound = (data, callback) => {
    callback(404);
  }

  /* ======= THE FOLLOWING ARE A COUPLE EXAMPLE ROUTE HANDLERS TO POST AND GET USERS. THEY SHOULD BE REPLACED =======*/


  // Define
  const users = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
      _users[data.method](data, callback);
    } else {
      callback(405);
    }
  };

  //Container for the users sub-methods
  const _users = {};

  // Users - post
  // Requested data: firstName, lastName, username, password, tosAgreement
  // Optional data: none
  _users.post = (data, callback) => {
    // Check that all required fields are filled out
    const request = {
      firstName: typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : null,
      lastName: typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : null,
      username: typeof (data.payload.username) === 'string' ? data.payload.username.trim() : null,
      password: typeof (data.payload.password) === 'string' && data.payload.password.length > 5 ? data.payload.password.trim() : null,
      tosAgreement: typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? true : null
    };

    if (request.firstName && request.lastName && request.username && request.password && request.tosAgreement) {
      // TODO Do Stuff!!
    } else {
      callback(400, {error: `Bad Request${checkRequest(request) ? ':' + checkRequest(request) : ''}`});
    }
  };

  // Users - get
  // Required data: phone
  // Optional data: none
  _users.get = (data, callback) => {
    // Check that the phone number provided is valid
    const request = {
      username: typeof(data.queryStringObject.username) === 'string' ? data.queryStringObject.username.trim() : null
    };

    if (request.username) {
      // TODO Do Stuff!!
    } else {
      callback(400, {error: `Bad Request${checkRequest(request) ? ':' + checkRequest(request) : ''}`});
    }
  };

  /************
   * Private
   *************/

  // Checks payload and builds a string of invalid fields
  function checkRequest(request) {
    let invalidFields = '';

    for (let key in request) {
      if (!request[key]) {
        invalidFields += ' ' + key;
      }
    }

    return invalidFields;
  };

  return {
    ping,
    notFound,
    users
  };
};

module.exports = controllers;