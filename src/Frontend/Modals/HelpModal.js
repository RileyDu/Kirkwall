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
  Text,
  Icon,
  Textarea,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios'; // Import Axios
import { FaFileUpload } from 'react-icons/fa';
import { isDragActive } from 'framer-motion';

const HelpModal = ({
  isOpen,
  onClose,
  title,
  description,
  setTitle,
  setDescription,
}) => {
  const [localTitle, setLocalTitle] = useState('');
  const [localDescription, setLocalDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { colorMode } = useColorMode();

  const { currentUser } = useAuth();

  useEffect(() => {
      if (isOpen) {
          setLocalTitle(title);
          setLocalDescription(description);
      }
  }, [isOpen, title, description]);

  const handleFormSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('fromEmail', currentUser?.email);
        formData.append('title', localTitle);
        formData.append('description', localDescription);

        uploadedFiles.forEach((file) => {
            formData.append('attachments', file);
        });

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-enquiry`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('Email sent successfully');
            setUploadedFiles([]);
            onClose();
        } else {
            console.log('Failed to send email');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};


  const onDrop = (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: ".jpg,.jpeg,.png,.gif,.pdf,.docx,.xlsx,.txt",
      maxSize: 5 * 1024 * 1024 // 5 MB
  });

  const handleClose = () => {
    setUploadedFiles([]);
    onClose();
};

  return (
      <Modal isOpen={isOpen} onClose={handleClose}>
          <ModalOverlay />
          <ModalContent sx={{ border: '2px solid black', bg: colorMode === 'light' ? 'whitesmoke' : 'gray.700' }}>
              <ModalHeader bg={'gray.800'} color={'white'}>
                  Contact Us
              </ModalHeader>
              <ModalCloseButton color={'white'} size={'lg'} mt={1} />
              <ModalBody>

                  <FormControl>
                      <FormLabel >Summary</FormLabel>
                      <Input
                          type="text"
                          value={localTitle}
                          onChange={(e) => setLocalTitle(e.target.value)}
                          bg={'white'}
                          border={'2px solid #fd9801'}
                          color={'#212121'}
                      />
                  </FormControl>

                  <FormControl mt={4}>
                      <FormLabel >
                          What do you need help with? Provide as much detail as possible
                      </FormLabel>
                      <Textarea
                          value={localDescription}
                          onChange={(e) => setLocalDescription(e.target.value)}
                          bg={'white'}
                          border={'2px solid #fd9801'}
                          color={'#212121'}
                          minHeight="120px" // Adjusted for longer text input
                      />
                  </FormControl>

                  <FormControl mt={4}>
                      <FormLabel >
                          Attach any relevant files
                      </FormLabel>
                      <Box
                          {...getRootProps()}
                          p={5}
                          border="2px dashed"
                          borderColor="gray.300"
                          borderRadius="md"
                          bg="gray.100"
                          textAlign="center"
                          cursor="pointer"
                          transition="border 0.24s ease-in-out"
                          _hover={{ borderColor: 'blue.400' }}
                      >
                          <input {...getInputProps()} />
                          <Icon as={FaFileUpload} w={12} h={12} color="gray.400" />
                          <Text fontSize="lg" color="gray.500" mt={2}>
                              {isDragActive
                                  ? 'Drop the files here ...'
                                  : 'Drop files to attach or browse'}
                          </Text>
                          <Text fontSize="sm" color="gray.400" mt={1}>
                              File size should not exceed 5 MB
                          </Text>
                      </Box>
                      {uploadedFiles.length > 0 && (
                          <Box mt={2}>
                              <Text color="gray.600">Uploaded Files:</Text>
                              {uploadedFiles.map((file, index) => (
                                  <Text key={index} fontSize="sm" color="gray.500">
                                      {file.name}
                                  </Text>
                              ))}
                          </Box>
                      )}
                  </FormControl>

                  <FormControl mt={4}>
                      <FormLabel>
                          Your contact e-mail
                      </FormLabel>
                      <Input
                          type="email"
                          value={currentUser?.email} // Linked to email state
                          bg={'white'}
                          border={'2px solid #fd9801'}
                          color={'#212121'}
                      />
                  </FormControl>
              </ModalBody>
              <ModalFooter>
                  <Button
                      variant="solid"
                      bg="orange.400"
                      color="white"
                      _hover={{ bg: 'orange.500' }}
                      mr={3}
                      onClick={handleFormSubmit}
                  >
                      Submit
                  </Button>
                  <Button
                      variant="solid"
                      bg="gray.400"
                      color="white"
                      _hover={{ bg: 'gray.500' }}
                      onClick={handleClose}
                  >
                      Cancel
                  </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>
  );
};

export default HelpModal;
