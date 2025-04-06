import { useState } from 'react';
import { 
  Button, 
  Box, 
  HStack, 
  Input, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  Text,
  useDisclosure,
  useToast,
  Badge
} from '@chakra-ui/react';

interface CollaborationControlsProps {
  activeRoom: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
}

const CollaborationControls = ({ 
  activeRoom, 
  onCreateRoom, 
  onJoinRoom, 
  onLeaveRoom 
}: CollaborationControlsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roomId, setRoomId] = useState('');
  const toast = useToast();

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast({
        title: 'Room ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    onJoinRoom(roomId);
    onClose();
  };

  return (
    <Box mb={4}>
      <HStack spacing={4}>
        {!activeRoom ? (
          <>
            <Button colorScheme="teal" onClick={onCreateRoom}>
              Create Room
            </Button>
            <Button colorScheme="blue" onClick={onOpen}>
              Join Room
            </Button>
          </>
        ) : (
          <>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Connected to Room: {activeRoom}
            </Badge>
            <Button colorScheme="red" onClick={onLeaveRoom}>
              Leave Room
            </Button>
          </>
        )}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Join Collaboration Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={2}>Enter the room ID to join:</Text>
            <Input 
              placeholder="Room ID" 
              value={roomId} 
              onChange={(e) => setRoomId(e.target.value)} 
              mb={4}
            />
            <Button colorScheme="blue" mr={3} onClick={handleJoinRoom}>
              Join
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CollaborationControls;