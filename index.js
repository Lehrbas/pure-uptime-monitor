const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
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
        res.end('hey!\n');
        console.log(buffer);
    });
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

