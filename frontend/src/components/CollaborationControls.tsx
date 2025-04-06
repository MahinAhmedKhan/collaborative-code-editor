import { useEffect, useState } from 'react';
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
  Badge,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon, ViewIcon } from '@chakra-ui/icons';
import { CollaborationSession } from '@/utils/collaboration';

interface CollaborationControlsProps {
  activeRoom: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: () => void;
  collaborationSession: CollaborationSession | null;
}

const CollaborationControls = ({ 
  activeRoom, 
  onCreateRoom, 
  onJoinRoom, 
  onLeaveRoom,
  collaborationSession,
}: CollaborationControlsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [roomId, setRoomId] = useState('');
  const [userCount, setUserCount] = useState(1);
  const toast = useToast();

  useEffect(() => {
    if (!collaborationSession) return;
  
    const awareness = collaborationSession.awareness;
  
    const updateUserCount = () => {
      const count = awareness.getStates().size;
      console.log('User count updated:', count);
      setUserCount(count);
    };
  
    awareness.on('change', updateUserCount);
    updateUserCount();
  
    return () => {
      awareness.off('change', updateUserCount);
    };
  }, [collaborationSession?.awareness]);
  

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

  const handleCopyRoomId = async () => {
    if (activeRoom) {
      await navigator.clipboard.writeText(activeRoom);
      toast({
        title: 'Room ID copied!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
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
            <HStack>
            <Badge colorScheme="green" p={2} borderRadius="md">
              Connected to Room: {activeRoom}
            </Badge>
            <Tooltip label="Copy Room ID">
                <IconButton
                  aria-label="Copy room ID"
                  icon={<CopyIcon />}
                  size="sm"
                  onClick={handleCopyRoomId}
                />
              </Tooltip>
              <Badge colorScheme="purple" p={2} borderRadius="md">
                <HStack spacing={2}>
                  <ViewIcon />
                  <Text>{userCount} user{userCount !== 1 ? 's' : ''}</Text>
                </HStack>
              </Badge>
              </HStack>           
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