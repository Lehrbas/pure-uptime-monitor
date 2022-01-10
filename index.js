const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log('Server listening on port ' + config.httpPort + ' in ' + config.envName);
});

// HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
    console.log('Server listening on port ' + config.httpsPort + ' in ' + config.envName);
});


// Server logic for both http and https
const unifiedServer = (req, res) => {
    // Get requested URL
    let parsedUrl = url.parse(req.url, true);

    // Parse requested url - get pathname
    let path = parsedUrl.pathname;

    // Regex to trim out slashes from both sides
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get object query string for url with params
    let queryStringObject = parsedUrl.query;

    //Get http method
    let method = req.method.toLowerCase();

    //Get headers as an object
    let headers = req.headers;

    //Get payload if exists
    //As the data in streming in, everytime a little bit is streaming in
    // it emits the event data, everytime it emits, it decodes to utf-8
    //  and appends to the buffer string
    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    //When the request finishes emiting the data event, or end of request
    // this is called even if there is no payload
    req.on('end', () => {
        buffer += decoder.end();

        // Redirect to path handler if exists, if not use notFound handler
        let chosenHandler = typeof (router[trimmedPath]) !== undefined ? handlers[trimmedPath] : handlers.notFound;

        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'payload': buffer,
            'method': method,
            'headers': headers
        };

        // Route the request to the specified handler
        chosenHandler(data, (status, payload) => {
            // Use status from handler callback or default to 200
            status = typeof (status) == 'number' ? status : 200;
            // Use payload form handler callback or default to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert payload to string, this is the payload that is send back to the user
            let payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(status);
            res.end(payloadString);

            console.log(status, payloadString)
        });
    });
};

// Define handlers
const handlers = {};

handlers.sample = (data, callback) => {
    // Callback a http code, and a payload object
    callback(200, { 'name': 'sample handler' });
};

handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
}
