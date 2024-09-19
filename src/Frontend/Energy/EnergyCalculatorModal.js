import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  RadioGroup,
  Radio,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react';

const EnergyCalculatorModal = ({ isOpen, onClose, electricityRate, fetchElectricityRate, onCalculateCost, deviceName, setDeviceName }) => {
  const [zipCode, setZipCode] = useState('');
  const [inputMode, setInputMode] = useState('wattage'); // Toggle between 'wattage' and 'voltage-current'
  const [wattage, setWattage] = useState('');
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true); // State to control disabled inputs

  // Function to handle fetching electricity rate and enabling inputs
  const handleGetElectricityRate = () => {
    fetchElectricityRate(zipCode);
    setIsDisabled(false);
  };

  // Function to calculate energy cost based on user inputs
  const calculateEnergyCost = () => {
    if (!electricityRate || !hoursPerDay) {
      setError('Please enter all required fields and fetch the electricity rate.');
      return;
    }

    // Calculate power in watts
    let powerInWatts;
    if (inputMode === 'wattage') {
      if (!wattage) {
        setError('Please enter the wattage of the device.');
        return;
      }
      powerInWatts = parseFloat(wattage);
    } else {
      if (!voltage || !current) {
        setError('Please enter both voltage and current for the device.');
        return;
      }
      powerInWatts = parseFloat(voltage) * parseFloat(current);
    }

    // Calculate energy cost
    setError(null); // Reset error
    const kWhPerDay = (powerInWatts * hoursPerDay) / 1000; // Convert watts to kilowatt-hours
    const costPerDay = kWhPerDay * electricityRate; // Daily cost
    const weeklyCost = costPerDay * 7; // Weekly cost
    const monthlyCost = costPerDay * 30; // Monthly cost (approximate)
    const yearlyCost = costPerDay * 365; // Yearly cost (approximate)

    onCalculateCost({
      daily: costPerDay.toFixed(2),
      weekly: weeklyCost.toFixed(2),
      monthly: monthlyCost.toFixed(2),
      yearly: yearlyCost.toFixed(2),
    }); // Send calculated costs to parent component
  };

  // Handle user input changes
  const handleZipCodeChange = e => setZipCode(e.target.value);
  const handleDeviceNameChange = e => setDeviceName(e.target.value);
  const handleWattageChange = e => setWattage(e.target.value);
  const handleVoltageChange = e => setVoltage(e.target.value);
  const handleCurrentChange = e => setCurrent(e.target.value);
  const handleHoursPerDayChange = e => setHoursPerDay(e.target.value);
  const handleInputModeChange = value => setInputMode(value);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Energy Calculator</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" w="100%" boxShadow="lg" borderRadius="md" bg="gray.800" color="white" mb={4}>
            <FormControl>
              <FormLabel>Zip Code</FormLabel>
              <Input type="text" value={zipCode} onChange={handleZipCodeChange} placeholder="Enter zip code" />
            </FormControl>
            <Button colorScheme="blue" onClick={handleGetElectricityRate}>Get Electricity Rate</Button>

            {electricityRate && (
              <Text textDecoration={'underline'}>Electricity Rate: ${electricityRate} per kWh</Text>
            )}

            <FormControl isDisabled={isDisabled}>
              <FormLabel>Device Name</FormLabel>
              <Input type="text" value={deviceName} onChange={handleDeviceNameChange} placeholder="e.g., Refrigerator" />
            </FormControl>

            {/* Toggle between Wattage and Voltage/Current input modes */}
            <FormControl as="fieldset" isDisabled={isDisabled}>
              <FormLabel as="legend">Input Mode</FormLabel>
              <RadioGroup onChange={handleInputModeChange} value={inputMode}>
                <HStack spacing="24px">
                  <Radio value="wattage">Wattage</Radio>
                  <Radio value="voltage-current">Voltage/Current</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>

            {/* Wattage Input */}
            {inputMode === 'wattage' && (
              <FormControl isDisabled={isDisabled}>
                <FormLabel>Device Wattage (W)</FormLabel>
                <Input type="number" value={wattage} onChange={handleWattageChange} placeholder="e.g., 100" />
              </FormControl>
            )}

            {/* Voltage and Current Input */}
            {inputMode === 'voltage-current' && (
              <>
                <FormControl isDisabled={isDisabled}>
                  <FormLabel>Voltage (V)</FormLabel>
                  <Input type="number" value={voltage} onChange={handleVoltageChange} placeholder="e.g., 120" />
                </FormControl>
                <FormControl isDisabled={isDisabled}>
                  <FormLabel>Current (A)</FormLabel>
                  <Input type="number" value={current} onChange={handleCurrentChange} placeholder="e.g., 2" />
                </FormControl>
              </>
            )}

            <FormControl isDisabled={isDisabled}>
              <FormLabel>Hours of Use per Day</FormLabel>
              <Input type="number" value={hoursPerDay} onChange={handleHoursPerDayChange} placeholder="e.g., 5" />
            </FormControl>
            <Button colorScheme="green" onClick={calculateEnergyCost} isDisabled={isDisabled}>Calculate Energy Cost</Button>

            {error && <Text color="red.500">{error}</Text>}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EnergyCalculatorModal;
