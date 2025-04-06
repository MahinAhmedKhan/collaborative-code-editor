import { Box, Button, useToast, Text} from "@chakra-ui/react"
import { executeCode } from "@/api";
import { useEffect, useState } from "react";
import { CollaborationSession, observeRunAction, updateSharedOutput } from "@/utils/collaboration";

interface OutputProps {
  editorRef: any;
  language: string;
  isCollaborating: boolean;
  collaborationSession: CollaborationSession | null;
}

const Output = ({ editorRef, language, isCollaborating, collaborationSession }: OutputProps) => {

  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    if (collaborationSession && isCollaborating) {
      const unsubscribe = observeRunAction(collaborationSession, (newOutput, newIsError) => {
        setOutput(newOutput);
        setError(newIsError);
      });

      const existingOutput = collaborationSession.outputMap?.get('output');
      const existingIsError = collaborationSession.outputMap?.get('isError');
      if (existingOutput) {
        setOutput(existingOutput);
        setError(existingIsError || false);
      }

      return () => {
        unsubscribe;
      };
    }
  }, [collaborationSession, isCollaborating]);

  async function runCode() {

    const sourceCode = editorRef.current.getValue();

    try{
      setIsLoading(true);
      const {run: result}= await executeCode(language, sourceCode);
      const outputLines = result.output.split('\n');
      const hasError = !!result.stderr;
      setOutput(outputLines);
      setError(hasError);
      if (collaborationSession && isCollaborating) {
        updateSharedOutput(collaborationSession, outputLines, hasError);
      }
    } catch(error) {
      console.log(error);
      toast({
        title: 'An error occured',
        description: error.message || 'Something went wrong while executing code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box w='full' bg='gray.800'>
      <Button
        variant={'outline'}
        colorScheme='green'
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run
      </Button>
      <Box
        h='90vh'
        bg='gray.700'
        color={isError? 'red.500' : 'white'}
        p={4}
        border={isError? '5px solid' : '1px solid'}
        borderColor={isError ? 'red.500' : 'gray.500'}
      >
        {
          output ? (output as string[]).map((line: string, index: number) => <Text key={index}>{line}</Text>) :
          'Click Run to see the output'
        }
      </Box>
    </Box>
  )
}

export default Output
