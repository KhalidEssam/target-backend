const http = require('http');
const app = require('./app');
const { handleWebSocket } = require('./controllers/webhookController');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

// WebSocket upgrade handler on /api/websocket
server.on('upgrade', (request, socket, head) => {
  if (request.url === '/api/websocket') {
    handleWebSocket(request, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
