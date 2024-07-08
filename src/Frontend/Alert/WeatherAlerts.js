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
  Button 
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';

function WeatherAlerts({ isVisible, onClose }) {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [user] = useAuthState(auth);

  // Hardcoded state code for Fargo, ND (ND)
  const stateCode = 'MN';

  const fetchWeatherAlerts = async () => {
    try {
      console.log(`Fetching weather alerts for state: ${stateCode}`);
      const response = await axios.get(`https://api.weather.gov/alerts/active?area=${stateCode}`);
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

  // Fetch weather alerts when the component mounts
  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

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

  if (!isVisible) return null; // Return null if the component is not visible

  return (
    user ? (
      <Center>
        <Box p={0} width="100%" zIndex={999} pt={'64px'} ml={'250px'}>
          {(error && !alerts.length) && (
            <Alert status="error" mb={0} borderRadius="0" bgColor="red.500" color="white">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
              <CloseButton position="absolute" right="8px" size="lg" onClick={onClose} />
            </Alert>
          )}
          <Flex justifyContent="center" alignItems="center" mb={0}>
            <Alert status="warning" mb={0} borderRadius="0" bgColor="red.500" color="white" width="100%">
              <AlertIcon color="white" />
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <Box 
                    border={"2px"} 
                    borderColor="black" 
                    borderRadius="50px" 
                    p="2" 
                    bg="gray.50" 
                    mx={2} 
                    cursor="pointer" 
                    key={alert.id}
                    onClick={() => handleAlertClick(alert)}
                  >
                    <AlertDescription px={4} fontSize={"large"} color={"red.500"}>
                      {alert.properties.event}
                    </AlertDescription>
                  </Box>
                ))
              ) : !error ? (
                <Text fontSize="xl" fontWeight="bold" paddingRight={5}>No weather alerts in your area.</Text>
              ) : null}
              <CloseButton position="absolute" right="8px" size={"lg"} onClick={onClose} />
            </Alert>
          </Flex>
        </Box>

        {selectedAlert && (
          <Modal isOpen={!!selectedAlert} onClose={handleModalClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedAlert.properties.event}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text><strong>Alert:</strong> {selectedAlert.properties.headline}</Text>
                <Text><strong>Effective:</strong> {new Date(selectedAlert.properties.effective).toLocaleString()}</Text>
                <Text><strong>Expires:</strong> {new Date(selectedAlert.properties.expires).toLocaleString()}</Text>
                <Text><strong>Area:</strong> {selectedAlert.properties.areaDesc}</Text>
                <Text><strong>Instruction:</strong> {selectedAlert.properties.instruction}</Text>
                
                {showDescription && (
                  <Text mt={2}><strong>Alert Description:</strong> {selectedAlert.properties.description}</Text>
                )}
              </ModalBody>
              <ModalFooter>
              <Button onClick={toggleDescription} mr={3} colorScheme="teal">
                  {showDescription ? 'Hide Description' : 'Show Description'}
                </Button>
                <Button colorScheme="blue" onClick={handleModalClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Center>
    ) : null
  );
}

export default WeatherAlerts;
