import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
import { FaChevronDown } from 'react-icons/fa/index.esm.js';
import { SettingsIcon } from '@chakra-ui/icons';
import { useAuth } from '../AuthComponents/AuthContext.js';

import { useWeatherData } from '../WeatherDataContext.js';

function WeatherAlerts({ isVisible }) {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const { loading } = useWeatherData();

  const { currentUser } = useAuth();

  const [stateCode, setStateCode] = useState(() => {
    return localStorage.getItem('stateCode') || 'ND';
  });

  // Set state code based on user email
  useEffect(() => {
    if (
      currentUser &&
      currentUser.email === 'jerrycromarty@imprimedicine.com'
    ) {
      setStateCode('CA');
    } else if (currentUser && currentUser.email === 'pmo@grandfarm.com') {
      setStateCode('ND');
    } else {
      setStateCode('ND');
    }
  }, [currentUser]);

  const [isChangeStateCodeModalOpen, setIsChangeStateCodeModalOpen] =
    useState(false);
  const [newStateCode, setNewStateCode] = useState(stateCode);

  // Fetch weather alerts for the current state
  const fetchWeatherAlerts = async () => {
    try {
      // console.log(`Fetching weather alerts for state: ${stateCode}`);
      const response = await axios.get(
        `https://api.weather.gov/alerts/active?area=${stateCode}`
      );
      // console.log('API response:', response.data);

      if (response.data.features && response.data.features.length > 0) {
        setAlerts(response.data.features);
        setError('');
      } else {
        setAlerts([]);
        setError(`No weather alerts in your state (${stateCode})`);
      }
    } catch (err) {
      // console.error('Error fetching weather alerts:', err);
      setError(err.response?.data?.detail || 'An error occurred.');
      setAlerts([]);
    }
  };

  // Fetch weather alerts when the state code changes
  useEffect(() => {
    fetchWeatherAlerts();
  }, [stateCode]);

  // Update state code when the modal is closed
  useEffect(() => {
    setNewStateCode(stateCode);
  }, [isChangeStateCodeModalOpen, stateCode]);

  // Save state code to local storage
  useEffect(() => {
    localStorage.setItem('stateCode', stateCode);
  }, [stateCode]);

  // Handle alert click
  const handleAlertClick = alert => {
    setSelectedAlert(alert);
    setShowDescription(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    setSelectedAlert(null);
  };

  // Toggle alert description
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Handle state code change
  const handleChangeStateCode = () => {
    setStateCode(newStateCode);
    setIsChangeStateCodeModalOpen(false);
  };

  // Return null if the user is not logged in
  if (loading) return null;

  // Return null if the component is not visible
  if (!isVisible) return null;

  // Return null if the user is not authorized
  return currentUser ? (
    <Center>
      <Box p={0} width="100%" zIndex={999} pt={'64px'}>
        {error && !alerts.length && (
          <Alert
            status="error"
            mb={0}
            borderRadius="0"
            bgColor="red.500"
            color="white"
            w={'100%'}
          >
            <AlertIcon ml={2} />
            <Tooltip label="Change State">
              <Icon
                as={SettingsIcon}
                cursor="pointer"
                onClick={() => setIsChangeStateCodeModalOpen(true)}
                mr={4}
              />
            </Tooltip>
            <AlertTitle fontSize={'lg'}>{error}</AlertTitle>
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
            >
              <AlertIcon color="white" />
              <Tooltip label="Change State">
                <Icon
                  as={SettingsIcon}
                  cursor="pointer"
                  onClick={() => setIsChangeStateCodeModalOpen(true)}
                  mr={2}
                />
              </Tooltip>
              <AlertTitle w={'125px'}>{stateCode} Alerts:</AlertTitle>
              <Flex wrap="wrap" alignItems="center" justify="center">
                {' '}
                {/* Adjust this Flex container */}
                {alerts.map(alert => (
                  <Box
                    d="flex"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    border="2px"
                    borderColor="black"
                    borderRadius="xl"
                    p="1"
                    bg="gray.50"
                    mx={1}
                    my={1}
                    cursor="pointer"
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                    // width={'auto'}
                    flex="1 1 auto"
                    h={'auto'}
                  >
                    <Tooltip
                      label={`Location: ${alert.properties.areaDesc}`}
                      aria-label="Area Description"
                    >
                      <AlertDescription px={1} fontSize="md" color="red.500">
                        {alert.properties.event}
                      </AlertDescription>
                    </Tooltip>
                  </Box>
                ))}
              </Flex>
            </Alert>
          )}
        </Flex>
      </Box>
      {/* Modal for displaying alert details */}
      {selectedAlert && (
        <Modal isOpen={!!selectedAlert} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent border="2px solid black" bg="#2D3748" color={'white'}>
            <ModalHeader bg={'#212121'} color={'white'}>
              {selectedAlert.properties.event}
            </ModalHeader>
            <ModalCloseButton size={'lg'} mt={1} />
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
              <FaChevronDown
                onClick={toggleDescription}
                mr={3}
                cursor={'pointer'}
              />
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      {/* Modal for changing the state code */}
      <Modal
        isOpen={isChangeStateCodeModalOpen}
        onClose={() => setIsChangeStateCodeModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent border="2px solid black" bg="#2D3748">
          <ModalHeader bg={'#212121'} color={'white'}>
            Change State Code
          </ModalHeader>
          <ModalCloseButton size={'lg'} mt={1} color={'white'} />
          <ModalBody>
            <FormControl id="state-code">
              <FormLabel color={'white'}>New State Code</FormLabel>
              <Input
                value={newStateCode}
                onChange={e => setNewStateCode(e.target.value.toUpperCase())}
                maxLength={2}
                minLength={2}
                color={'white'}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant={'sidebar'}
              mr={3}
              onClick={handleChangeStateCode}
              color={'white'}
            >
              Save
            </Button>
            <Button
              variant={'sidebar'}
              onClick={() => setIsChangeStateCodeModalOpen(false)}
              color={'white'}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  ) : null;
}

export default WeatherAlerts;
