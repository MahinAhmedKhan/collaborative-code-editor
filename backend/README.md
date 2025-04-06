# Collaborative Code Editor - Backend

This directory contains the backend WebSocket server for the Collaborative Code Editor project. The server handles real-time collaboration between users using Yjs.

## Features

- WebSocket server for real-time communication
- Document synchronization using Yjs
- User awareness (cursor positions, user presence)
- Room-based collaboration
- Automatic garbage collection for deleted content

## Technologies Used

- Node.js
- WebSockets (ws)
- Yjs for real-time collaboration
- y-websocket for WebSocket integration

## Development

To run the backend server:

```bash
# From the backend directory
npm start
```

Or from the root directory:

```bash
npm run backend
```

## Project Structure

- `src/server.js` - WebSocket server implementation
- `src/y-websocket-utils.js` - Utilities for Yjs WebSocket integration

## Note

The backend server must be running for the collaboration features in the frontend application to work. The server runs on port 1234 by default. See the main README.md in the root directory for complete setup instructions.
