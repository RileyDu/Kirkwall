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
  VStack,
  useToast,
} from '@chakra-ui/react';

const ExportDataModal = ({ isOpen, onClose }) => {
  const initialRef = React.useRef();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    dataType: '',
    dateRangeStart: '',
    dateRangeEnd: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { dataType, dateRangeStart, dateRangeEnd } = formData;

    if (!dataType || !dateRangeStart || !dateRangeEnd) {
      toast({
        title: 'Missing Fields.',
        description: 'Please fill in all required fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Construct the query parameters
    const params = new URLSearchParams({
      metric: dataType,
      startDate: dateRangeStart,
      endDate: dateRangeEnd,
    });

    // Construct the full URL (adjust the base URL as needed)
    const url = `/api/export_data?${params.toString()}`;

    try {
      // Initiate the file download by creating a temporary link
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data.');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'exported_data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: 'Download Started.',
        description: 'Your CSV file is downloading.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      // Reset form
      setFormData({
        dataType: '',
        dateRangeStart: '',
        dateRangeEnd: '',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
          <ModalHeader>Export Data</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Data Metric Type</FormLabel>
                  <Select
                    placeholder="Select data type"
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleChange}
                  >
                    <option value="temp">Watchdog Temperature</option>
                    <option value="hum">Watchdog Humidity</option>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date Range Start</FormLabel>
                  <Input
                    type="date"
                    placeholder="Start Date"
                    name="dateRangeStart"
                    value={formData.dateRangeStart}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date Range End</FormLabel>
                  <Input
                    type="date"
                    placeholder="End Date"
                    name="dateRangeEnd"
                    value={formData.dateRangeEnd}
                    onChange={handleChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                colorScheme="blue"
                mr={3}
              >
                Export
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
