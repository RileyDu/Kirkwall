import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorMode,
} from '@chakra-ui/react';

const SetThresholdsModal = ({
  isOpen,
  onClose,
  phoneNumber,
  userEmailForThreshold,
  highThreshold,
  lowThreshold,
  setPhoneNumber,
  setUserEmailForThreshold,
  setHighThreshold,
  setLowThreshold,
  handleFormClear,
  handleFormSubmit,
  metric,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ border: '2px solid black', bg: colorMode === 'light' ? 'whitesmoke' : 'gray.700' }}>
        <ModalHeader bg={'gray.800'} color={'white'}>
          Add Thresholds for {metric}
        </ModalHeader>
        <ModalCloseButton color={'white'} size={'lg'} mt={1} />
        <ModalBody>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type="text"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              value={userEmailForThreshold}
              onChange={e => setUserEmailForThreshold(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>High Threshold</FormLabel>
            <Input
              type="number"
              value={highThreshold}
              onChange={e => setHighThreshold(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Low Threshold</FormLabel>
            <Input
              type="number"
              value={lowThreshold}
              onChange={e => setLowThreshold(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" bg="red.400" color="white" _hover={{ bg: 'red.500' }} mr={3} onClick={handleFormClear}>
            Clear Form
          </Button>
          <Button variant="solid" bg="orange.400" color="white" _hover={{ bg: 'orange.500' }} mr={3} onClick={handleFormSubmit}>
            Save
          </Button>
          <Button variant="solid" bg="gray.400" color="white" _hover={{ bg: 'gray.500' }} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SetThresholdsModal;
