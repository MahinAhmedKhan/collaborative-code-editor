import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_BOILER_PLATE } from '@/constants';
import Output from './Output';
import { CollaborationSession, createCollaborationSession, destroyCollaborationSession, setupEditorBinding } from '@/utils/collaboration';
import CollaborationControls from './CollaborationControls';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(CODE_BOILER_PLATE.javascript || '// some comment');
  const [language, setLanguage] = useState('javascript');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession| null>(null);
  const [isCollaborating, setIsCollaborating] = useState(false);

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();

    if (isCollaborating && collaborationSession) {
      setupEditorBinding(editor, language, collaborationSession);
    }
  };

  const onSelect = (lang: string) => {
    if (isCollaborating && collaborationSession && editorRef.current) {
      destroyCollaborationSession(collaborationSession);
      const newSession = createCollaborationSession(activeRoom!);
      setCollaborationSession(newSession)
      setupEditorBinding(editorRef.current, lang, newSession);
    }

    setLanguage(lang);
    if (!isCollaborating){
      setValue(
        CODE_BOILER_PLATE[lang as keyof typeof CODE_BOILER_PLATE]
      )
    }   
  };

  useEffect(() => {
    if (CODE_BOILER_PLATE[language as keyof typeof CODE_BOILER_PLATE]) {
      setValue(CODE_BOILER_PLATE[language as keyof typeof CODE_BOILER_PLATE]);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (collaborationSession) {
        destroyCollaborationSession(collaborationSession);
      }
    }
  }, [collaborationSession])

  const createRoom = () => {
    const roomId = uuidv4();
    joinRoom(roomId)
  }

  const joinRoom = (roomId: string) => {
    if (collaborationSession) {
      destroyCollaborationSession(collaborationSession);
    }
    const session = createCollaborationSession(roomId);
    setCollaborationSession(session);
    setActiveRoom(roomId);
    setIsCollaborating(true);
    if (editorRef.current) {
      setupEditorBinding(editorRef.current, language, session);
    }
  }

  const leaveRoom = () => {
    if (collaborationSession) {
      destroyCollaborationSession(collaborationSession);
    }
    setActiveRoom(null);
    setIsCollaborating(false);

    setValue(CODE_BOILER_PLATE[language as keyof typeof CODE_BOILER_PLATE] || '// some comment');
  }

  return (
    <Box>
      <CollaborationControls
        activeRoom={activeRoom}
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
        onLeaveRoom={leaveRoom}
      />
      <HStack>
        <Box w='50%'>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
            height="90vh"
            language={language}
            theme="vs-dark"
            defaultValue={CODE_BOILER_PLATE.javascript}
            value={isCollaborating ? undefined : value}
            onChange={newValue => {
              if (!isCollaborating) {
                setValue(newValue ?? '');
              }
            }}
            onMount={onMount}
            optins= {{
              readOnly: isCollaborating && !collaborationSession
            }}
          />
        </Box>
        <Output 
          editorRef={editorRef} 
          language={language}
          isCollaborating={isCollaborating}
          collaborationSession={collaborationSession}
        />
      </HStack>      
    </Box>
  );
};

export default CodeEditor;
