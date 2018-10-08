const http = require('http'),
  https = require('https'),
  url = require('url'),
  StringDecoder = require('string_decoder').StringDecoder,
  fs = require('fs'),
  config = require('../config'),
  controllers = require('./controllers')(),
  helpers = require('./helpers')(),
  path = require('path'),
  util = require('util'),
  debug = util.debuglog('server');

// Instantiate server module object
const server = {};

// Instantiate http server
server.httpServer = http.createServer((req, res) => {
  server.unifiedServer(req, res);
});

// Instantiate https server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
  server.unifiedServer(req, res);
});

// All server logic for both http and https servers
server.unifiedServer = (req, res) => {
  // Get url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '').toLowerCase();

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toLowerCase();

  // Get request headers as object
  const headers = req.headers;

  // Get request body, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Request is now finished
    const requestBody = helpers.parseJsonToObject(buffer);

    // Choose the handler this request should go to. If no handler is found, use not found handler
    const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : controllers.notFound;

    // Construct data object to send to handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: requestBody
    };

    // Route request to handler specified in the router
    try {
      chosenHandler(data, (statusCode, payload) => {
        server.processHandlerResponse(res, method, trimmedPath, statusCode, payload);
      });
    } catch(error) {
      debug(error);
      server.processHandlerResponse(res, method, trimmedPath, 500, {error: 'An unknown error has occurred'});
    }

  });
}

// Process the response from the handler
server.processHandlerResponse = (res, method, trimmedPath, statusCode, payload) => {

  // Use statusCode called back by handler or default to 200
  statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

  // User payload called back by handler or default to empty object
  payload = typeof(payload) === 'object' ? payload : {};

  // Convert payload to string
  const payloadString = JSON.stringify(payload);

  // Return the response
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(statusCode);
  res.end(payloadString);

  // Log the response
  // If the response is 200 or 201 print green otherwise print red
  if (statusCode === 200 || statusCode === 201) {
    debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
  } else {
    debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
  }
};

/*=========================
* Define request router
*==========================*/
server.router = {
  'ping': controllers.ping,
  'api/users': controllers.users
};

// Init script
server.init = () => {
  // Start the http server
  server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The http server is listening on port ${config.httpPort} in ${config.envName} environment...`);
  });

  // Start the https server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log('\x1b[36m%s\x1b[0m', `The https server is listening on port ${config.httpsPort} in ${config.envName} environment...`);
  });
};

module.exports = server;