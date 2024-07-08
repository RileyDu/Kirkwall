import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Icon,
  Tooltip,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { FaChevronDown } from 'react-icons/fa';
import { InfoIcon } from '@chakra-ui/icons';

function WeatherAlerts({ isVisible, onClose, isMinimized }) {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [user] = useAuthState(auth);

  // State for managing the state code
  const [stateCode, setStateCode] = useState(() => {
    // Retrieve stateCode from localStorage or default to 'ND'
    return localStorage.getItem('stateCode') || 'ND';
  });

  // State for the state code change modal
  const [isChangeStateCodeModalOpen, setIsChangeStateCodeModalOpen] = useState(false);
  const [newStateCode, setNewStateCode] = useState(stateCode);

  const fetchWeatherAlerts = async () => {
    try {
      console.log(`Fetching weather alerts for state: ${stateCode}`);
      const response = await axios.get(
        `https://api.weather.gov/alerts/active?area=${stateCode}`
      );
      console.log('API response:', response.data);

      if (response.data.features && response.data.features.length > 0) {
        setAlerts(response.data.features);
        setError(''); // Clear any previous error message
      } else {
        setAlerts([]);
        setError('No weather alerts in your area.');
      }
    } catch (err) {
      console.error('Error fetching weather alerts:', err);
      setError(err.response?.data?.detail || 'An error occurred.');
      setAlerts([]);
    }
  };

  // Fetch weather alerts when the component mounts or stateCode changes
  useEffect(() => {
    fetchWeatherAlerts();
  }, [stateCode]);

  // Sync newStateCode with stateCode when the modal opens
  useEffect(() => {
    setNewStateCode(stateCode);
  }, [isChangeStateCodeModalOpen, stateCode]);

  // Save stateCode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stateCode', stateCode);
  }, [stateCode]);

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setShowDescription(false); // Reset the show description state
  };

  const handleModalClose = () => {
    setSelectedAlert(null);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  const handleChangeStateCode = () => {
    setStateCode(newStateCode);
    setIsChangeStateCodeModalOpen(false);
  };

  if (!isVisible) return null; // Return null if the component is not visible

  return user ? (
    <Center>
      <Box p={0} width="100%" zIndex={999} pt={'64px'} ml={!isMinimized ? '250px' : '84px'}>
        {error && !alerts.length && (
          <Alert
            status="error"
            mb={0}
            borderRadius="0"
            bgColor="red.500"
            color="white"
          >
            <AlertIcon />
            <AlertTitle mr={2}>{error}</AlertTitle>
            <Tooltip label="Change State">
              <Icon as={InfoIcon} ml={2} cursor="pointer" onClick={() => setIsChangeStateCodeModalOpen(true)} position={'absolute'} right={'50px'} />
            </Tooltip>
            <CloseButton
              position="absolute"
              right="8px"
              size="lg"
              onClick={onClose}
            />
          </Alert>
        )}
        <Flex justifyContent="center" alignItems="center" mb={0}>
          {!error && alerts.length > 0 && (
            <Alert
              status="warning"
              mb={0}
              borderRadius="0"
              bgColor="red.500"
              color="white"
              width="100%"
              //   position={'relative'}
              //   overflow={'auto'}
            >
              <AlertIcon color="white" />
              <AlertTitle>{stateCode} Weather Alerts:</AlertTitle>
              {alerts.map((alert) => (
                <Box
                  border="2px"
                  borderColor="black"
                  borderRadius="xl"
                  p="1"
                  bg="gray.50"
                  mx={1}
                  cursor="pointer"
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  textAlign={'center'}
                >
                  <Tooltip label={`Location: ${alert.properties.areaDesc}`} aria-label="Area Description">
                    <AlertDescription px={1} fontSize="md" color="red.500">
                      {alert.properties.event}
                    </AlertDescription>
                  </Tooltip>
                </Box>
              ))}
              <Tooltip label="Change State">
                <Icon as={InfoIcon} ml={2} cursor="pointer" onClick={() => setIsChangeStateCodeModalOpen(true)} position={'absolute'} right={'50px'} />
              </Tooltip>
              <CloseButton
                position="absolute"
                right="8px"
                size={'lg'}
                onClick={onClose}
              />
            </Alert>
          )}
        </Flex>
      </Box>
      {selectedAlert && (
        <Modal isOpen={!!selectedAlert} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent border="2px solid black" bg="#2D3748">
            <ModalHeader bg={'#212121'} color={'white'}>
              {selectedAlert.properties.event}
            </ModalHeader>
            <ModalCloseButton size={'lg'} mt={1}/>
            <ModalBody fontSize={'lg'}>
              <Text my={1}>
                <strong>Alert:</strong> {selectedAlert.properties.headline}
              </Text>
              <Text my={1}>
                <strong>Effective:</strong>{' '}
                {new Date(selectedAlert.properties.effective).toLocaleString()}
              </Text>
              <Text my={1}>
                <strong>Expires:</strong>{' '}
                {new Date(selectedAlert.properties.expires).toLocaleString()}
              </Text>
              <Text my={1}>
                <strong>Area:</strong> {selectedAlert.properties.areaDesc}
              </Text>
              <Text my={1}>
                <strong>Instruction:</strong>{' '}
                {selectedAlert.properties.instruction}
              </Text>

              {showDescription && (
                <Text mt={2}>
                  <strong>Alert Description:</strong>{' '}
                  {selectedAlert.properties.description}
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <FaChevronDown onClick={toggleDescription} mr={3} cursor={'pointer'} />
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* Modal for changing state code */}
      <Modal isOpen={isChangeStateCodeModalOpen} onClose={() => setIsChangeStateCodeModalOpen(false)}>
        <ModalOverlay />
        <ModalContent border="2px solid black" bg="#2D3748">
          <ModalHeader bg={'#212121'} color={'white'}>Change State Code</ModalHeader>
          <ModalCloseButton size={'lg'} mt={1}/>
          <ModalBody>
            <FormControl id="state-code">
              <FormLabel>New State Code</FormLabel>
              <Input
                value={newStateCode}
                onChange={(e) => setNewStateCode(e.target.value.toUpperCase())}
                maxLength={2}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant={'sidebar'} mr={3} onClick={handleChangeStateCode}>
              Update
            </Button>
            {/* <Button variant="ghost" onClick={() => setIsChangeStateCodeModalOpen(false)}>
              Cancel
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  ) : null;
}

export default WeatherAlerts;
