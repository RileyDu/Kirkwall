import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Center } from '@chakra-ui/react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';

function WeatherAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [conditions, setConditions] = useState('');
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const [isAlertVisible, setIsAlertVisible] = useState(true); 
  
  const zipcode = '58102';

  const fetchWeatherAlerts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather-alerts/${zipcode}`);
      setConditions(response.data.conditions);
      setAlerts(response.data.alerts);
      setError('');
      setIsAlertVisible(true); 
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
      setAlerts([]);
      setConditions('');
      setIsAlertVisible(true); 
    }
  };

  useEffect(() => {
    fetchWeatherAlerts();
  }, []);

  return (
    user ? (
      <Center>
        <Box p={0} width="100%">
          {error && isAlertVisible && (
            <Alert status="error" mb={0} borderRadius="0" bgColor="red.500" color="white">
              <AlertIcon />
              <AlertTitle mr={2}>{error}</AlertTitle>
              <CloseButton position="absolute" right="8px" size="lg" onClick={() => setIsAlertVisible(false)} />
            </Alert>
          )}
          <Flex justifyContent="center" alignItems="center" mb={0}>
            {isAlertVisible && (
              <Alert status="warning" mb={0} borderRadius="0" bgColor="red.500" color="white" width="100%">
                <Text fontSize="xl" fontWeight="bold" paddingRight={5}>{conditions}</Text>
                <AlertIcon color="white" />
                {alerts.map((alert) => (
                  <Box border={"2px"} borderColor="black" borderRadius="50px" p="2" bg="gray.50" key={alert} mx={2}>
                    <AlertDescription px={4} fontSize={"large"} color={"red.500"}>{alert}</AlertDescription>
                  </Box>
                ))}
                <CloseButton position="absolute" right="8px" size={"lg"} onClick={() => setIsAlertVisible(false)} />
              </Alert>
            )}
          </Flex>
        </Box>
      </Center>
    ) : null
  );
}

export default WeatherAlerts;
