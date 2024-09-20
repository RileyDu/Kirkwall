import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';

const EnergyCalculatorModal = ({
  isOpen,
  onClose,
  electricityRate,
  onCalculateCost,
  deviceName,
  setDeviceName,
  hoursPerDay,
  setHoursPerDay,
  handleAddEquipment, // Receive the function to add equipment
  currentUser
}) => {
  const [inputMode, setInputMode] = useState('wattage'); // Toggle between 'wattage' and 'voltage-current'
  const [wattage, setWattage] = useState('');
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [powerInWatts, setPowerInWatts] = useState(null);
  const [error, setError] = useState(null);

  // Function to calculate energy cost and add equipment
  const calculateEnergyCost = () => {
    if (!electricityRate || !hoursPerDay) {
      setError('Please enter all required fields.');
      return;
    }

    // Calculate power in watts
    if (inputMode === 'wattage') {
      if (!wattage) {
        setError('Please enter the wattage of the device.');
        return;
      }
      setPowerInWatts(parseFloat(wattage));
    } else {
      if (!voltage || !current) {
        setError('Please enter both voltage and current for the device.');
        return;
      }
      setPowerInWatts(parseFloat(voltage) * parseFloat(current));
    }

    // Calculate energy cost
    setError(null); // Reset error
    const kWhPerDay = (powerInWatts * hoursPerDay) / 1000; // Convert watts to kilowatt-hours
    const costPerDay = kWhPerDay * electricityRate; // Daily cost
    const weeklyCost = costPerDay * 7; // Weekly cost
    const monthlyCost = costPerDay * 30; // Monthly cost (approximate)
    const yearlyCost = costPerDay * 365; // Yearly cost (approximate)

    const calculatedCosts = {
      daily: costPerDay.toFixed(2),
      weekly: weeklyCost.toFixed(2),
      monthly: monthlyCost.toFixed(2),
      yearly: yearlyCost.toFixed(2),
    };

    onCalculateCost(calculatedCosts); // Send calculated costs to parent component
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    calculateEnergyCost();
    // calculateEnergyCost();
    const newEquipment = {
        email: currentUser.email,
        title: deviceName,
        wattage: powerInWatts,
        hours_per_day: hoursPerDay,
      };
  
      // Add new equipment
      handleAddEquipment(newEquipment);
    onClose();
  };

  // Handle user input changes
  const handleDeviceNameChange = (e) => setDeviceName(e.target.value);
  const handleWattageChange = (e) => setWattage(e.target.value);
  const handleVoltageChange = (e) => setVoltage(e.target.value);
  const handleCurrentChange = (e) => setCurrent(e.target.value);
  const handleHoursPerDayChange = (e) => setHoursPerDay(e.target.value);
  const handleInputModeChange = (value) => setInputMode(value);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Energy Calculator</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" w="100%" boxShadow="lg" borderRadius="md" bg="gray.800" color="white" mb={4}>
            <FormControl>
              <FormLabel>Device Name</FormLabel>
              <Input type="text" value={deviceName} onChange={handleDeviceNameChange} placeholder="e.g., Refrigerator" />
            </FormControl>

            {/* Toggle between Wattage and Voltage/Current input modes */}
            <FormControl as="fieldset">
              <FormLabel as="legend">Input Mode</FormLabel>
              <HStack spacing={0} width="100%">
                <Button
                  width="50%"
                  borderRadius="0"
                  borderLeftRadius="md"
                  onClick={() => handleInputModeChange('wattage')}
                  bg={inputMode === 'wattage' ? 'teal.500' : 'gray.600'}
                  color={inputMode === 'wattage' ? 'white' : 'gray.200'}
                  _hover={{ bg: inputMode === 'wattage' ? 'teal.600' : 'gray.500' }}
                >
                  Wattage
                </Button>
                <Button
                  width="50%"
                  borderRadius="0"
                  borderRightRadius="md"
                  onClick={() => handleInputModeChange('voltage-current')}
                  bg={inputMode === 'voltage-current' ? 'teal.500' : 'gray.600'}
                  color={inputMode === 'voltage-current' ? 'white' : 'gray.200'}
                  _hover={{ bg: inputMode === 'voltage-current' ? 'teal.600' : 'gray.500' }}
                >
                  Voltage/Current
                </Button>
              </HStack>
            </FormControl>

            {/* Wattage Input */}
            {inputMode === 'wattage' && (
              <FormControl>
                <FormLabel>Device Wattage (W)</FormLabel>
                <Input type="number" value={wattage} onChange={handleWattageChange} placeholder="e.g., 100" />
              </FormControl>
            )}

            {/* Voltage and Current Input */}
            {inputMode === 'voltage-current' && (
              <>
                <FormControl>
                  <FormLabel>Voltage (V)</FormLabel>
                  <Input type="number" value={voltage} onChange={handleVoltageChange} placeholder="e.g., 120" />
                </FormControl>
                <FormControl>
                  <FormLabel>Current (A)</FormLabel>
                  <Input type="number" value={current} onChange={handleCurrentChange} placeholder="e.g., 2" />
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel>Hours of Use per Day</FormLabel>
              <Input type="number" value={hoursPerDay} onChange={handleHoursPerDayChange} placeholder="e.g., 5" />
            </FormControl>
            <Button colorScheme="green" onClick={handleFormSubmit}>
              Add Equipment
            </Button>

            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EnergyCalculatorModal;
