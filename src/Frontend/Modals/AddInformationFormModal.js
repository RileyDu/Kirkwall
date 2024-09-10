import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useColorMode,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import api from '../services/api.js';

const AddInformationFormModal = ({
  isOpen,
  onClose,
  id,
  firstName,
  lastName,
  phone,
  email,
  company,
  setFirstName,
  setLastName,
  setPhone,
  setEmail,
  setCompany,
}) => {
  const [localFirstName, setLocalFirstName] = useState('');
  const [localLastName, setLocalLastName] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [localEmail, setLocalEmail] = useState('');
  const [localCompany, setLocalCompany] = useState('');
  const [localThreshKill, setLocalThreshKill] = useState(false);
  const { colorMode } = useColorMode();



  useEffect(() => {
    if (isOpen) {
      setLocalFirstName(firstName);
      setLocalLastName(lastName);
      setLocalPhone(phone);
      setLocalEmail(email);
      setLocalCompany(company);
      setLocalThreshKill(false);
    }
  }, [isOpen, firstName, lastName, phone, email, company]);

  const handleFormClear = () => {
    setLocalFirstName('');
    setLocalLastName('');
    setLocalPhone('');
    setLocalEmail('');
    setLocalCompany('');
  };


  const handleFormSubmit = async () => {
    try {
      // Perform Axios PUT request to update the admin
      await api.put(`/api/update_admin/${id}`, {
        firstname: localFirstName,
        lastname: localLastName,
        email: localEmail,
        phone: localPhone,
        company: localCompany,
        thresh_kill: localThreshKill,
      });
  
      // Update the local state after a successful update
      setFirstName(localFirstName);
      setLastName(localLastName);
      setPhone(localPhone);
      setEmail(localEmail);
      setCompany(localCompany);
  
      // Close the form/modal after update
      onClose();
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };
  


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent sx={{ border: '2px solid black', bg: 'white' }}>
        <ModalHeader bg={'gray.800'} color={'white'}>
          Add Information
        </ModalHeader>
        <ModalCloseButton color={'white'} size={'lg'} mt={1} />
        <ModalBody>
          <FormControl>
            <FormLabel color={colorMode === "light" ? '#212121' : "black"}>First Name</FormLabel>
            <Input
              type="text"
              value={localFirstName}
              onChange={(e) => setLocalFirstName(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
              
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color={colorMode === "light" ? '#212121' : "black"}>Last Name</FormLabel>
            <Input
              type="text"
              value={localLastName}
              onChange={(e) => setLocalLastName(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color={colorMode === "light" ? '#212121' : "black"}>Phone</FormLabel>
            <Input
              type="text"
              value={localPhone}
              onChange={(e) => setLocalPhone(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color={colorMode === "light" ? '#212121' : "black"}>Email</FormLabel>
            <Input
              type="email"
              disabled
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color={colorMode === "light" ? '#212121' : "black"}>Company</FormLabel>
            <Input
              type="text"
              value={localCompany}
              onChange={(e) => setLocalCompany(e.target.value)}
              bg={'white'}
              border={'2px solid #fd9801'}
              color={'#212121'}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="solid"
            bg="red.400"
            color="white"
            _hover={{ bg: 'red.500' }}
            mr={3}
            onClick={handleFormClear}
          >
            Clear Form
          </Button>
          <Button
            variant="solid"
            bg="orange.400"
            color="white"
            _hover={{ bg: 'orange.500' }}
            mr={3}
            onClick={handleFormSubmit}
          >
            Save
          </Button>
          <Button
            variant="solid"
            bg="gray.400"
            color="white"
            _hover={{ bg: 'gray.500' }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddInformationFormModal;