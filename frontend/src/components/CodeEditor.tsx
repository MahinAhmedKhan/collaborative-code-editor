import { Box, HStack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_BOILER_PLATE } from '@/constants';
import Output from './Output';
import { CollaborationSession, createCollaborationSession, destroyCollaborationSession, observeLanguageChange, setupEditorBinding, updateSharedLanguage } from '@/utils/collaboration';
import CollaborationControls from './CollaborationControls';

const CodeEditor = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });
  const editorRef = useRef(null);
  const [value, setValue] = useState(CODE_BOILER_PLATE.javascript || '// some comment');
  const [language, setLanguage] = useState('javascript');
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession| null>(null);
  const [isCollaborating, setIsCollaborating] = useState(false);

  useEffect(() => {
    if (collaborationSession && isCollaborating) {
      observeLanguageChange(collaborationSession, (newLanguage) => {
        setLanguage(newLanguage);
        setValue(CODE_BOILER_PLATE[newLanguage as keyof typeof CODE_BOILER_PLATE] || '// some comment');
      });
      const existingLanguage = collaborationSession.languageMap?.get('currentLanguage');
      if (existingLanguage) {
        setLanguage(existingLanguage);
        setValue(CODE_BOILER_PLATE[existingLanguage as keyof typeof CODE_BOILER_PLATE] || '// some comment');
      }
    }

  }, [collaborationSession, isCollaborating]);


  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();

    if (isCollaborating && collaborationSession) {
      setupEditorBinding(editor, language, collaborationSession);
    }
  };

  const onSelect = (lang: string) => {
    if (isCollaborating && collaborationSession && editorRef.current) {
      updateSharedLanguage(collaborationSession, lang);
      // destroyCollaborationSession(collaborationSession);
      // const newSession = createCollaborationSession(activeRoom!);
      // setCollaborationSession(newSession)
      // setupEditorBinding(editorRef.current, lang, newSession);
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
    updateSharedLanguage(session, language);
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
        collaborationSession={collaborationSession}
      />
      
      {isSmallScreen ? (
        <VStack spacing={4} w="full">
          <Box w="full">
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              height="50vh"
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
              options={{
                readOnly: isCollaborating && !collaborationSession
              }}
            />
          </Box>
          <Box w="full">
            <Output
              editorRef={editorRef}
              language={language}
              isCollaborating={isCollaborating}
              collaborationSession={collaborationSession}
            />
          </Box>
        </VStack>
      ) : (
        <HStack spacing={4} align="start">
          <Box flex={1}>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
              height="85vh"
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
              options={{
                readOnly: isCollaborating && !collaborationSession
              }}
            />
          </Box>
          <Box flex={1} w='full' h="90vh">
            <Output
              editorRef={editorRef}
              language={language}
              isCollaborating={isCollaborating}
              collaborationSession={collaborationSession}
            />
          </Box>
        </HStack>
      )}
    </Box>
  );

};

export default CodeEditor;
