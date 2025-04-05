import { Box, Button, useToast, Text} from "@chakra-ui/react"
import { executeCode } from "@/api";
import { useState } from "react";

const Output = ({ editorRef, language }: { editorRef: any, language: string }) => {

  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  async function runCode() {

    const sourceCode = editorRef.current.getValue();

    try{
      setIsLoading(true);
      const {run: result}= await executeCode(language, sourceCode);
      setOutput(result.output.split('\n'));
      result.stderr ? setError(true) : setError(false);
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
    <Box w='50%' bg='gray.800'>
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
