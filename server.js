const net = require('net');

const server = net.createServer((socket) => {
  console.log('Client connected');


  // 1. Listen for data from the client
  socket.on('data', (data) => {
    const request = data.toString();
    console.log('Received request:\n', request);
    

    // 2. Send a simple HTTP response back to the client
    const responseBody = 'Hello from the server!';
    const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${responseBody.length}\r\n\r\n${responseBody}`;
    socket.write(response);
    socket.end();
    });
    // 3. Handle client disconnection
    socket.on('end', () => {
      console.log('Client disconnected');
    });

    // 4. Handle errors
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