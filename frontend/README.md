# Collaborative Code Editor - Frontend

This directory contains the frontend application for the Collaborative Code Editor project. The frontend is built with React, TypeScript, and Vite, and uses the Monaco Editor component for code editing.

## Features

- Real-time collaborative code editing using Yjs and WebSockets
- Support for multiple programming languages
- Syntax highlighting and code completion
- User awareness (cursor positions, user presence)
- Room-based collaboration

## Technologies Used

- React 19
- TypeScript
- Vite
- Monaco Editor
- Chakra UI
- Yjs for real-time collaboration
- y-monaco for Monaco Editor binding

## Development

To run the frontend application:

```bash
# From the frontend directory
npm run dev
```

Or from the root directory:

```bash
npm run frontend
```

## Project Structure

- `src/components/` - React components
- `src/utils/` - Utility functions and helpers
- `src/constants.tsx` - Application constants

## Note

The frontend application requires the backend WebSocket server to be running for collaboration features to work. See the main README.md in the root directory for complete setup instructions.
