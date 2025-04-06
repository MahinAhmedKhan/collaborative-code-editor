# Collaborative Code Editor

A real-time collaborative code editor that allows multiple users to write and execute code together in various programming languages.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Collaboration**: Multiple users can edit code simultaneously
- **User Awareness**: See who's online and where they're editing
- **Multiple Language Support**: Write code in JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, Scala
- **Code Execution**: Run your code and see the output directly in the browser
- **Room-Based Collaboration**: Create or join rooms to collaborate with specific users
- **Syntax Highlighting**: Monaco Editor provides powerful syntax highlighting and IntelliSense

## Technologies Used

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Vite**: Fast build tool and development server
- **Monaco Editor**: VS Code's editor component for web applications
- **Chakra UI**: Component library for building accessible React applications
- **Yjs**: CRDT framework for real-time collaboration
- **y-websocket**: WebSocket provider for Yjs
- **y-monaco**: Monaco Editor binding for Yjs

### Backend
- **Node.js**: JavaScript runtime for the server
- **WebSocket**: Protocol for real-time communication
- **y-websocket**: Server implementation for Yjs collaboration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/collaborative-code-editor.git
   cd collaborative-code-editor
   ```

2. Install dependencies
   ```bash
   # Install all dependencies (root, frontend, and backend)
   npm run install:all
   ```

### Running the Application

1. Start both the backend server and frontend application with a single command:
   ```bash
   # From the root directory
   npm run dev
   ```

   Alternatively, you can start them separately:
   ```bash
   # Start the backend server
   npm run backend

   # In a new terminal, start the frontend
   npm run frontend
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Usage

### Creating a Collaboration Room
1. Click the "Create Room" button
2. Share the generated room ID with collaborators

### Joining a Collaboration Room
1. Click the "Join Room" button
2. Enter the room ID shared with you
3. Click "Join"

### Writing and Running Code
1. Select a programming language from the dropdown
2. Write your code in the editor
3. Click the "Run" button to execute the code
4. View the output in the right panel

### Collaborating with Others
- You'll see other users' cursors in real-time
- The user count indicator shows how many people are in the room
- All changes are synchronized in real-time

## Project Structure

```
collaborative-code-editor/
├── frontend/                  # Frontend application
│   ├── public/                # Static assets
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── utils/             # Utility functions
│   │   ├── constants.tsx      # Application constants
│   │   └── main.tsx           # Application entry point
├── backend/                   # Backend application
│   ├── src/                   # Source code
│   │   ├── server.js          # WebSocket server for collaboration
│   │   └── y-websocket-utils.js # Yjs WebSocket utilities
│   └── package.json           # Backend dependencies
├── .gitignore                 # Git ignore file
├── .prettierrc.json           # Prettier configuration
├── .prettierignore            # Prettier ignore file
└── package.json               # Root package.json for workspaces
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Yjs](https://yjs.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [Vite](https://vitejs.dev/)
