const net = require('net');
const { pathToFileURL } = require('url');

function parseRequest (requestString) {
    const lines = requestString.split('\r\n');
    const [method, path] = lines[0].split(' ');

    const headers = {};
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line === '') break; // End of headers
        const [key, value] = line.split(': ');
        headers[key] = value;
    }
    
    return { method, path, headers };

}
const server = net.createServer((socket) => {
  console.log('Client connected');


    // Listen for data from the client
  socket.on('data', (data) => {
    const rawRequest = data.toString();
    const req = parseRequest (rawRequest);
    console.log(`Received request for: ${req.method} ${req.path}`);

    let responseBody = '';
    let statusCode = 200;
    let contentType = 'text/plain';
    let path = req.path;

    // Handle different paths
    if (path === '/') {
        responseBody = 'Welcome to the homepage!';
      } else if (path === '/about') {
        responseBody = 'About Us: This is a simple HTTP server.';
      } else {
        statusCode = 404;
        responseBody = '404 Not Found';
      }
    
    // Set headers and send the response
    const headers = [
        `HTTP/1.1 ${statusCode} OK`,
        `Content-Type: ${contentType}`,
        `Content-Length: ${responseBody.length}`,
        `X-Powered-By: Node.js`,
    ];

    const response = headers.join('\r\n') + '\r\n\r\n' + responseBody;
    socket.write(response);
    socket.end();
    });

    // Handle client disconnection
    socket.on('end', () => {
      console.log('Client disconnected');
    });

    //  Handle errors
    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});