// DataRequestModal.jsx
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  VStack,
  useToast,
} from '@chakra-ui/react';

const ExportDataModal = ({ isOpen, onClose }) => {
  const initialRef = React.useRef();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dataType: '',
    dateRange: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we'll just log the data and close the modal
    console.log('Form Data Submitted:', formData);
    toast({
      title: 'Request Submitted.',
      description: 'Your data request has been submitted successfully.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
    // Reset form
    setFormData({
      name: '',
      email: '',
      dataType: '',
      dateRange: '',
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Data</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Data Type</FormLabel>
                  <Select
                    placeholder="Select data type"
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleChange}
                  >
                    <option value="sales">Sales</option>
                    <option value="inventory">Inventory</option>
                    <option value="customers">Customers</option>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date Range</FormLabel>
                  <Input
                    type="text"
                    placeholder="e.g., 2023-01-01 to 2023-12-31"
                    name="dateRange"
                    value={formData.dateRange}
                    onChange={handleChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button bg={'#cee8ff'} mr={3}>
                Submit
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExportDataModal;
