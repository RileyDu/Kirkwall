import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useColorMode,
    VStack,
    Icon,
  } from '@chakra-ui/react';
  import React from 'react';
  import { FaQuestionCircle, FaHandsHelping } from 'react-icons/fa/index.esm.js';
  
  const OptionsModal = ({ isOpen, onClose, onContactUsClick, onHelpClick }) => {
    const { colorMode } = useColorMode();
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent sx={{ border: '2px solid black', bg: colorMode === 'light' ? 'whitesmoke' : 'gray.700' }}>
          <ModalHeader bg={'gray.800'} color={'white'}>
            Choose an Option
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            <VStack spacing={8}>
              <Box textAlign="center" onClick={onContactUsClick} cursor="pointer">
                <Icon as={FaQuestionCircle} w={12} h={12} color="gray.600" />
                <Text fontSize="lg" color="gray.600" mt={2}>
                  Contact Us
                </Text>
              </Box>
              <Box textAlign="center" onClick={onHelpClick} cursor="pointer">
                <Icon as={FaHandsHelping} w={12} h={12} color="gray.600" />
                <Text fontSize="lg" color="gray.600" mt={2}>
                  Help
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              bg="gray.400"
              color="white"
              _hover={{ bg: 'gray.500' }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };
  
  export default OptionsModal;
  