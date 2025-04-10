import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { setupWSConnection } from './y-websocket-utils.js';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Y.js WebSocket Server\n');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  console.log('Client connected');
  console.log('Connection from: ', req.headers['user-agent']);
  
  const url = new URL(req.url, 'http://localhost:1234');
  const roomName = url.pathname.slice(1);
  
  console.log('Setting up connection for room: ', roomName);
  setupWSConnection(ws, req, { docName: roomName });
});

server.listen(1234, () => {
  console.log('Y.js WebSocket server running on port 1234');
});
