import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

import EnergyCalculatorModal from './EnergyCalculatorModal.js'; // Import the modal component
import { useAuth } from '../AuthComponents/AuthContext.js';

const EnergyPage = ({ statusOfAlerts }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [electricityRate, setElectricityRate] = useState(null);
  const [costs, setCosts] = useState(null);
  const [error, setError] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const { currentUser } = useAuth();

  // Function to fetch electricity rate from OpenEI API based on zip code
  const fetchElectricityRate = async zipCode => {
    try {
      const response = await axios.get('https://api.openei.org/utility_rates', {
        params: {
          version: 'latest',
          format: 'json',
          api_key: process.env.REACT_APP_OPEN_EI_API_KEY,
          address: zipCode,
          limit: 1,
          detail: 'full',
        },
      });
      const data = response.data.items[0];
      const rate = getElectricityRate(data, 'kWh');
      setElectricityRate(rate);
    } catch (error) {
      setError('Failed to fetch electricity rate. Please try again later.');
      console.error('Error fetching electricity rate:', error);
    }
  };

  // Helper function to extract electricity rate by type
  const getElectricityRate = (data, type) => {
    if (!data || !data.energyratestructure) return 'N/A';
    for (let i = 0; i < data.energyratestructure.length; i++) {
      const period = data.energyratestructure[i];
      for (let j = 0; j < period.length; j++) {
        if (period[j].unit === type) {
          return period[j].rate;
        }
      }
    }
    return 'N/A';
  };

  // Fetch electricity rate based on user's zip code on component mount
  useEffect(() => {
    if (currentUser) {
      const zipCode = currentUser.zipCode || '58102'; // Replace '58102' with a default or user-specific value
      fetchElectricityRate(zipCode);
    }
  }, [currentUser]);

  // Function to receive calculated energy costs from the modal
  const handleCalculateCost = calculatedCosts => {
    setCosts(calculatedCosts);
    onClose(); // Close the modal after calculation
  };

  return (
    <Box
      minHeight={'100vh'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    //   justifyContent={'center'}
    pt={statusOfAlerts ? '10px' : '74px'}
    >
      <Heading>
        Energy Cost Calculator
        <Button
          variant={'blue'}
          onClick={onOpen}
          ml={2}
          mb={2}
          rightIcon={<AddIcon />}
        >
          Add Device
        </Button>
      </Heading>
      {error && <Text color="red.500">{error}</Text>}
      <Box>USER PROFILE CARD HERE</Box>
      {costs && (
        <VStack
          spacing={4}
          align="stretch"
          maxW="500px"
          w="100%"
          p={4}
          boxShadow="lg"
          borderRadius="md"
          bg="gray.800"
          color="white"
          mt={4}
        >
          <Box>
            <Heading size="md">Costs for {deviceName}</Heading>
            <Text>
              Rate for {deviceName}: ${electricityRate} per kWh
            </Text>
            <Text>Hours used per day: {hoursPerDay}</Text>
            <SimpleGrid columns={[1, null, 2]} spacing={4} mt={4}>
              <Stat bg="teal.500" p={4} borderRadius="md" boxShadow="md">
                <StatLabel>Daily Cost</StatLabel>
                <StatNumber>${costs.daily}</StatNumber>
                <StatHelpText>per day</StatHelpText>
              </Stat>
              <Stat bg="blue.500" p={4} borderRadius="md" boxShadow="md">
                <StatLabel>Weekly Cost</StatLabel>
                <StatNumber>${costs.weekly}</StatNumber>
                <StatHelpText>per week</StatHelpText>
              </Stat>
              <Stat bg="orange.500" p={4} borderRadius="md" boxShadow="md">
                <StatLabel>Monthly Cost</StatLabel>
                <StatNumber>${costs.monthly}</StatNumber>
                <StatHelpText>per month</StatHelpText>
              </Stat>
              <Stat bg="red.500" p={4} borderRadius="md" boxShadow="md">
                <StatLabel>Yearly Cost</StatLabel>
                <StatNumber>${costs.yearly}</StatNumber>
                <StatHelpText>per year</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>
        </VStack>
      )}

      {/* Energy Calculator Modal */}
      <EnergyCalculatorModal
        isOpen={isOpen}
        onClose={onClose}
        electricityRate={electricityRate}
        onCalculateCost={handleCalculateCost}
        deviceName={deviceName}
        setDeviceName={setDeviceName}
        hoursPerDay={hoursPerDay}
        setHoursPerDay={setHoursPerDay}
      />
    </Box>
  );
};

export default EnergyPage;
