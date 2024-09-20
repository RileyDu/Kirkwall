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
  Input,
  HStack,
  Flex,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Collapse,
  Divider,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import EnergyCalculatorModal from './EnergyCalculatorModal.js';
import { useAuth } from '../AuthComponents/AuthContext.js';

const EnergyPage = ({ statusOfAlerts }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [electricityRate, setElectricityRate] = useState(null);
  const [costs, setCosts] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(0);
  const [equipment, setEquipment] = useState([]);
  const { currentUser } = useAuth();
  const {
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
    isOpen: isPopoverOpen,
  } = useDisclosure();
  const [statsVisible, setStatsVisible] = useState({});

  const toggleStatsVisibility = deviceId => {
    setStatsVisible(prevState => ({
      ...prevState,
      [deviceId]: !prevState[deviceId],
    }));
  };

  const fetchData = async () => {
    if (currentUser && currentUser.email) {
      try {
        const energyInfoResponse = await axios.get(
          `/api/energy-info/${currentUser.email}`
        );
        setLocation(energyInfoResponse.data.location);
        const equipmentResponse = await axios.get(
          `/api/equipment/${currentUser.email}`
        );
        setEquipment(equipmentResponse.data);
        await fetchElectricityRate(energyInfoResponse.data.zip_code);
      } catch (error) {
        setError('Error fetching user data. Please try again later.');
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (equipment.length && electricityRate) {
      calculateCosts();
    }
  }, [equipment, electricityRate]);

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

  const calculateCosts = () => {
    let totalDailyCost = 0;
    let totalWeeklyCost = 0;
    let totalMonthlyCost = 0;
    let totalYearlyCost = 0;

    equipment.forEach(device => {
      const powerInWatts = device.wattage;
      const kWhPerDay = (powerInWatts * device.hours_per_day) / 1000;
      const costPerDay = kWhPerDay * electricityRate;

      totalDailyCost += costPerDay;
      totalWeeklyCost += costPerDay * 7;
      totalMonthlyCost += costPerDay * 30;
      totalYearlyCost += costPerDay * 365;
    });

    setCosts({
      daily: totalDailyCost.toFixed(2),
      weekly: totalWeeklyCost.toFixed(2),
      monthly: totalMonthlyCost.toFixed(2),
      yearly: totalYearlyCost.toFixed(2),
    });
  };

  const handleAddEquipment = async newEquipment => {
    try {
      const response = await axios.post('/api/equipment', newEquipment);
      setEquipment([...equipment, response.data]);
      onClose();
    } catch (error) {
      setError('Error adding equipment. Please try again later.');
      console.error('Error adding equipment:', error);
    }
  };

  const handleDeleteEquipment = async equipmentId => {
    try {
      await axios.delete(`/api/equipment/${equipmentId}`);
      setEquipment(equipment.filter(equipment => equipment.id !== equipmentId));
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  const handleLocationChange = async event => {
    try {
      await axios.put(`/api/energy-info/${currentUser.email}`, {
        location: location,
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
    onPopoverClose();
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={statusOfAlerts ? '10px' : '74px'}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Heading>Energy Cost Calculator</Heading>
        <Icon
          as={AddIcon}
          onClick={onOpen}
          ml={2}
          mt={2}
          cursor="pointer"
          bg={'#cee8ff'}
          border={'3px solid #3D5A80'}
          color={'black'}
          boxSize="30px"
          borderRadius="6px"
          p={1}
        />
      </Flex>
      {error && <Text color="red.500">{error}</Text>}

      {/* User Profile Card */}
      <Box
        maxW="700px"
        w="100%"
        p={6}
        boxShadow="lg"
        borderRadius="md"
        bg="gray.900"
        color="white"
        mt={4}
        mb={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        position="relative"
      >
        <Flex alignItems="center" mb={4}>
          <Icon as={MdLocationOn} w={8} h={8} color="teal.400" />
          <Heading size="lg" ml={2}>
            {location || 'Location'}
          </Heading>
          <Popover
            isOpen={isPopoverOpen}
            onOpen={onPopoverOpen}
            onClose={onPopoverClose}
          >
            <PopoverTrigger>
              <EditIcon
                size="lg"
                onClick={onPopoverOpen}
                position={'absolute'}
                top={1}
                right={1}
                cursor={'pointer'}
              />
            </PopoverTrigger>
            <PopoverContent bg="gray.800" color="white">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Input
                  placeholder="Enter new location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  bg="gray.700"
                  borderColor="teal.400"
                />
              </PopoverBody>
              <PopoverFooter>
                <Button colorScheme="teal" onClick={handleLocationChange}>
                  Save
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </Flex>
        <VStack spacing={3} width="100%">
          <HStack justify="space-between" w="100%" px={2}>
            <Box>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color="gray.300"
                textDecoration={'underline'}
              >
                Zip Code
              </Text>
              <Text>{currentUser?.zipCode || '58102'}</Text>
            </Box>
            <Box>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color="gray.300"
                textDecoration={'underline'}
              >
                Live Rate
              </Text>
              <Text>
                {electricityRate ? `$${electricityRate} per kWh` : 'Loading...'}
              </Text>
            </Box>
            <Box>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color="gray.300"
                textDecoration={'underline'}
              >
                Total Yearly Energy Cost
              </Text>
              <Text>{costs ? `$${costs.yearly}` : 'Not Calculated'}</Text>
            </Box>
          </HStack>
        </VStack>
      </Box>

      {/* Equipment Cards in Grid */}
      <SimpleGrid columns={[1, null, 1]} spacing={4} maxW="800px" w="100%">
        {equipment.map(device => (
          <Flex
            key={device.id}
            p={4}
            pb={statsVisible[device.id] ? 4 : 0}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            bg="gray.800"
            color="white"
            direction="column"
            alignItems="stretch"
            justify="space-between"
            position="relative"
          >
            <Box mb={2} position="relative">
              <Heading size="md" mb={2} textDecoration={'underline'}>
                {device.title}
              </Heading>
              <Icon
                as={FaTrash}
                position="absolute"
                top="0"
                right="0"
                cursor="pointer"
                onClick={() => handleDeleteEquipment(device.id)}
              />
            </Box>
            <Box>
              <Text fontSize={'lg'}>
                <strong>Hours used per day:</strong> {device.hours_per_day}{' '}
                hours
              </Text>
              <Text fontSize={'lg'}>
                <strong>Wattage:</strong> {device.wattage} W
              </Text>
              <Divider mt={2} mb={2} />
              <Text fontSize={'lg'}>
                <strong>Yearly Energy Cost:</strong> $
                {(
                  ((device.wattage * device.hours_per_day * electricityRate) /
                    1000) *
                  365
                ).toFixed(2)}
              </Text>
            </Box>
            <Flex justifyContent="flex-end" mt={2} position="relative">
              <Icon
                as={statsVisible[device.id] ? FaChevronUp : FaChevronDown}
                position="absolute"
                bottom="2.5"
                right="0"
                cursor="pointer"
                onClick={() => toggleStatsVisibility(device.id)}
                color="teal.400"
              />
            </Flex>
            <Collapse in={statsVisible[device.id]} animateOpacity>
              <SimpleGrid columns={2} spacing={4} mt={4}>
                <Stat bg="teal.500" p={4} borderRadius="md" boxShadow="md">
                  <StatLabel>Daily Cost</StatLabel>
                  <StatNumber>
                    $
                    {(
                      (device.wattage *
                        device.hours_per_day *
                        electricityRate) /
                      1000
                    ).toFixed(2)}
                  </StatNumber>
                  <StatHelpText>per day</StatHelpText>
                </Stat>
                <Stat bg="blue.500" p={4} borderRadius="md" boxShadow="md">
                  <StatLabel>Weekly Cost</StatLabel>
                  <StatNumber>
                    $
                    {(
                      ((device.wattage *
                        device.hours_per_day *
                        electricityRate) /
                        1000) *
                      7
                    ).toFixed(2)}
                  </StatNumber>
                  <StatHelpText>per week</StatHelpText>
                </Stat>
                <Stat bg="orange.500" p={4} borderRadius="md" boxShadow="md">
                  <StatLabel>Monthly Cost</StatLabel>
                  <StatNumber>
                    $
                    {(
                      ((device.wattage *
                        device.hours_per_day *
                        electricityRate) /
                        1000) *
                      30
                    ).toFixed(2)}
                  </StatNumber>
                  <StatHelpText>per month</StatHelpText>
                </Stat>
                <Stat bg="red.500" p={4} borderRadius="md" boxShadow="md">
                  <StatLabel>Yearly Cost</StatLabel>
                  <StatNumber>
                    $
                    {(
                      ((device.wattage *
                        device.hours_per_day *
                        electricityRate) /
                        1000) *
                      365
                    ).toFixed(2)}
                  </StatNumber>
                  <StatHelpText>per year</StatHelpText>
                </Stat>
              </SimpleGrid>
            </Collapse>
          </Flex>
        ))}
      </SimpleGrid>

      {/* Energy Calculator Modal */}
      <EnergyCalculatorModal
        isOpen={isOpen}
        onClose={onClose}
        electricityRate={electricityRate}
        deviceName={deviceName}
        setDeviceName={setDeviceName}
        hoursPerDay={hoursPerDay}
        setHoursPerDay={setHoursPerDay}
        handleAddEquipment={handleAddEquipment}
        currentUser={currentUser}
        calculateCosts={calculateCosts}
      />
    </Box>
  );
};

export default EnergyPage;
