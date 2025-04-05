import { Box, HStack } from '@chakra-ui/react';
import { Editor } from '@monaco-editor/react';
import { useState, useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import { CODE_BOILER_PLATE } from '@/constants';
import Output from './Output';

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(CODE_BOILER_PLATE.javascript || '// some comment');
  const [language, setLanguage] = useState('javascript');

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (lang: string) => {
    setLanguage(lang);
    setValue(
      CODE_BOILER_PLATE[lang as keyof typeof CODE_BOILER_PLATE]
    )
  };

  // Initialize with the correct boilerplate when component mounts
  useEffect(() => {
    if (CODE_BOILER_PLATE[language as keyof typeof CODE_BOILER_PLATE]) {
      setValue(CODE_BOILER_PLATE[language as keyof typeof CODE_BOILER_PLATE]);
    }
  }, []);

  return (
    <Box>
      <HStack>
        <Box w='50%'>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
            height="90vh"
            language={language}
            theme="vs-dark"
            defaultValue={CODE_BOILER_PLATE.javascript}
            value={value}
            onChange={newValue => {
              setValue(newValue ?? '');
            }}
            onMount={onMount}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </HStack>
      
    </Box>
  );
};

export default CodeEditor;
