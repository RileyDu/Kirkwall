import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  IconButton,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const SavedLinksModal = ({
  savedLinks,
  setSavedLinks,
  currentUser,
  isOpen,
  onClose,
}) => {
  const handleRemoveLink = link => {
    const updatedLinks = savedLinks.filter(
      savedLink => savedLink.link !== link
    );
    setSavedLinks(updatedLinks);
    const userEmail = currentUser?.email;
    if (userEmail) {
      const storageKey = `savedLinks_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedLinks));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="scale" size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" borderRadius="lg" boxShadow="xl" p={4}>
        <ModalHeader
          fontSize="2xl"
          textAlign="center"
          fontWeight="bold"
          color="white"
        >
          Saved Links
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {savedLinks.length > 0 ? (
            <VStack spacing={4} align="stretch" color={'black'}>
              {savedLinks.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={3}
                  bg="gray.300"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{
                    bg: 'gray.100',
                    transform: 'scale(1.02)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  color={'black'}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginRight: '8px',
                      color: 'black',
                      fontWeight: 'medium',
                    }}
                  >
                    {item.title}
                  </a>
                  <IconButton
                    aria-label="Remove link"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleRemoveLink(item.link)}
                    _hover={{
                      bg: 'red.600',
                      transform: 'rotate(-15deg)',
                      transition: 'all 0.2s',
                    }}
                  />
                </Box>
              ))}
            </VStack>
          ) : (
            <Text fontSize="lg" color="gray.500" textAlign="center" mt={4}>
              No saved links.
            </Text>
          )}
        </ModalBody>
        <Divider mt={4} mb={4} />
        <ModalFooter justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={onClose}
            variant="solid"
            size="lg"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SavedLinksModal;
