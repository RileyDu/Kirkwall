import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    Text,
    Box,
    IconButton,
  } from '@chakra-ui/react';
  import { DeleteIcon } from '@chakra-ui/icons';
  
  const SavedLinksModal = ({ savedLinks, setSavedLinks, currentUser }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const handleRemoveLink = (link) => {
      const updatedLinks = savedLinks.filter(savedLink => savedLink.link !== link);
      setSavedLinks(updatedLinks);
      const userEmail = currentUser?.email;
      if (userEmail) {
        const storageKey = `savedLinks_${userEmail}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedLinks));
      }
    };
  
    return (
      <>
        <Button onClick={onOpen} colorScheme="blue" mt={4}>
          View Saved Links
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxW="600px">
            <ModalHeader>Saved Links</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {savedLinks.length > 0 ? (
                savedLinks.map((item, index) => (
                  <Box key={index} mb={2} display="flex" alignItems="center" justifyContent="space-between">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ marginRight: '8px', color: 'teal' }}>
                      {item.title}
                    </a>
                    <IconButton
                      aria-label="Remove link"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleRemoveLink(item.link)}
                    />
                  </Box>
                ))
              ) : (
                <Text>No saved links.</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default SavedLinksModal;
  