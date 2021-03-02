const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Get requested URL
    let parsedUrl = url.parse(req.url, true);

    // Parse requested url - get pathname
    let path = parsedUrl.pathname;

    // Regex to trim out slashes from both sides
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    res.end('hey!\n');

    console.log('path: ' + trimmedPath)
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

