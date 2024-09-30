import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Divider,
  StatNumber,
  StatLabel,
  Stat,
  Button,
  useToast,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  StatHelpText
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ChatbotModal from './WeeklyRecapAiModal.js';

// Helper function to adjust dates
const adjustWeekStartDate = (date) => {
  const targetDate = "2024-09-16"; // The date format to compare
  const currentDate = new Date(date);
  const formattedCurrentDate = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format

  // If the date does not match the target, subtract 6 days
  if (formattedCurrentDate !== targetDate) {
    currentDate.setDate(currentDate.getDate() - 6);
  }

  return currentDate.toISOString().split("T")[0]; // Return adjusted date in YYYY-MM-DD format
};

// Utility functions here (formatDateMMDDYY, getStartOfWeek, getEndDate, getLabelForMetric, metricToName)
const metricToName = {
  temperature: 'Temperature',
  percent_humidity: 'Humidity',
  wind_speed: 'Wind',
  soil_moisture: 'Soil Moisture',
  leaf_wetness: 'Leaf Wetness',
  rain_15_min_inches: 'Rainfall',
  temp: 'Temperature (Watchdog)',
  hum: 'Humidity (Watchdog)',
  rctemp: 'Temperature (Rivercity)',
  humidity: 'Humidity (Rivercity)',
  imFreezerOneTemp: 'Freezer #1 Temp',
  imFreezerOneHum: 'Freezer #1 Humidity',
  imFreezerTwoTemp: 'Freezer #2 Temp',
  imFreezerTwoHum: 'Freezer #2 Humidity',
  imFreezerThreeTemp: 'Freezer #3 Temp',
  imFreezerThreeHum: 'Freezer #3 Humidity',
  imFridgeOneTemp: 'Fridge #1 Temp',
  imFridgeOneHum: 'Fridge #1 Humidity',
  imFridgeTwoTemp: 'Fridge #2 Temp',
  imFridgeTwoHum: 'Fridge #2 Humidity',
  imIncubatorOneTemp: 'Incubator #1 Temp',
  imIncubatorOneHum: 'Incubator #1 Humidity',
  imIncubatorTwoTemp: 'Incubator #2 Temp',
  imIncubatorTwoHum: 'Incubator #2 Humidity',
};

// Utility function to format date as MM/DD/YY
const formatDateMMDDYY = date => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${month}/${day}/${year}`;
};

const getEndDate = startDate => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Monday + 6 = Sunday
  return endDate;
};

const getLabelForMetric = metric => {
  const metricLabels = {
    temperature: { label: '°F', addSpace: false },
    temp: { label: '°F', addSpace: false },
    rctemp: { label: '°F', addSpace: false },

    imFreezerOneTemp: { label: '°C', addSpace: false },
    imFreezerTwoTemp: { label: '°C', addSpace: false },
    imFreezerThreeTemp: { label: '°C', addSpace: false },
    imFridgeOneTemp: { label: '°C', addSpace: false },
    imFridgeTwoTemp: { label: '°C', addSpace: false },
    imIncubatorOneTemp: { label: '°C', addSpace: false },
    imIncubatorTwoTemp: { label: '°C', addSpace: false },

    imFreezerOneHum: { label: '%', addSpace: false },
    imFreezerTwoHum: { label: '%', addSpace: false },
    imFreezerThreeHum: { label: '%', addSpace: false },
    imFridgeOneHum: { label: '%', addSpace: false },
    imFridgeTwoHum: { label: '%', addSpace: false },
    imIncubatorOneHum: { label: '%', addSpace: false },
    imIncubatorTwoHum: { label: '%', addSpace: false },

    hum: { label: '%', addSpace: false },
    percent_humidity: { label: '%', addSpace: false },
    humidity: { label: '%', addSpace: false },
    rain_15_min_inches: { label: 'inches', addSpace: true },
    wind_speed: { label: 'MPH', addSpace: true },
    soil_moisture: { label: 'centibars', addSpace: true },
    leaf_wetness: { label: 'out of 15', addSpace: true },
  };

  return metricLabels[metric] || { label: '', addSpace: false };
};

const WeeklyRecap = ({ statusOfAlerts }) => {
  const { currentUser } = useAuth();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const userEmail = currentUser?.email;
  const userMetrics =
    CustomerSettings.find(customer => customer.email === userEmail)?.metric ||
    [];

  const [recapData, setRecapData] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [alertCounts, setAlertCounts] = useState({});
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]); // To store available weeks
  const [selectedSensor, setSelectedSensor] = useState(''); // State for selected sensor
  const [hasCopied, setHasCopied] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const toast = useToast(); // For showing copy notifications
  const hasMounted = useRef(false);

  useEffect(() => {
    const fetchAvailableWeeks = async () => {
      try {
        const response = await axios.get("/api/weekly-recap/weeks");
        const adjustedWeeks = response.data.map((week) => ({
          ...week,
          week_start_date: adjustWeekStartDate(week.week_start_date),
        }));
  
        setAvailableWeeks(adjustedWeeks.map((week) => week.week_start_date));
        console.log("Available weeks:", adjustedWeeks);
  
        if (adjustedWeeks.length > 0) {
          const mostRecentWeek = adjustedWeeks[0].week_start_date;
          setWeekStartDate(mostRecentWeek);
          setWeekEndDate(formatDateMMDDYY(getEndDate(new Date(mostRecentWeek))));
        }
      } catch (error) {
        console.error("Error fetching available weeks:", error);
      }
    };
  
    fetchAvailableWeeks();
  }, []);

  useEffect(() => {
    const fetchWeeklyRecapData = async () => {
      if (!userEmail || userMetrics.length === 0 || !weekStartDate) return;

      let adjustedWeekStartDate = weekStartDate;

      // Check if weekStartDate doesn't match "2024-09-16"
      if (weekStartDate !== "2024-09-16") {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + 6); // Add 6 days to the weekStartDate
        adjustedWeekStartDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      try {
        const recapResponse = await axios.get('/api/weekly-recap', {
          params: { user_email: userEmail, week_start_date: adjustedWeekStartDate },
        });
        setRecapData(recapResponse.data);

        const alertResponse = await axios.get('/api/alerts/recap', {
          params: { start_date: weekStartDate },
        });
        const filteredAlerts = alertResponse.data.filter(alert =>
          userMetrics.includes(alert.metric)
        );

        setRecentAlerts(filteredAlerts);

        // Count alerts by metric
        const alertCount = filteredAlerts.reduce((count, alert) => {
          count[alert.metric] = (count[alert.metric] || 0) + 1;
          return count;
        }, {});
        setAlertCounts(alertCount);

        // Set initial selected sensor only on initial page load
        if (!hasMounted.current) {
          if (recapResponse.data && Object.keys(recapResponse.data).length > 0) {
            setSelectedSensor(Object.keys(recapResponse.data)[0]);
          }
          hasMounted.current = true; // Mark that the component has mounted
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchWeeklyRecapData();
  }, [userEmail, userMetrics, weekStartDate]);
  

  const handleWeekChange = e => {
    const selectedWeekStartDate = e.target.value;
    const selectedWeekEndDate = formatDateMMDDYY(
      getEndDate(new Date(selectedWeekStartDate))
    );
    setWeekStartDate(selectedWeekStartDate);
    setWeekEndDate(selectedWeekEndDate);
    setHasCopied(false);
  };

  const handleSensorChange = e => {
    setSelectedSensor(e.target.value);
  };

  const copyToClipboard = () => {
    setHasCopied(true);
    const combinedData = {
      recapData: recapData,
      recentAlerts: recentAlerts,
    };
    const textToCopy = JSON.stringify(combinedData, null, 2);

    // Check if clipboard API is supported
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use the clipboard API
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast({
            title: 'Copied to clipboard!',
            description:
              'The weekly recap data and alerts have been copied to your clipboard.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        })
        .catch(err => {
          // Fallback to manual copy if an error occurs
          fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
      // Fallback to manual copy for older browsers or unsupported environments
      fallbackCopyTextToClipboard(textToCopy);
    }
  };

  // Fallback function for copying text
  const fallbackCopyTextToClipboard = text => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: 'Copied to clipboard!',
          description:
            'The weekly recap data and alerts have been copied to your clipboard.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Unable to copy the data to your clipboard.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    document.body.removeChild(textArea);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      pt={statusOfAlerts ? '10px' : '74px'}
      px={isLargerThan768 ? 12 : 4}
    >
      {weekStartDate && (
        <Flex
          flexDirection={isLargerThan768 ? 'row' : 'column'}
          justifyContent="space-between"
          alignItems={'center'}
          width="100%"
          mb={4}
          px={1}
        >
          <Heading size="lg" fontWeight="bold" mb={!isLargerThan768 ? 4 : 0}>
            Recap for {formatDateMMDDYY(new Date(weekStartDate))} -{' '}
            {formatDateMMDDYY(new Date(weekEndDate))}{' '}
          </Heading>
          <Box display="flex" gap={4}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                maxWidth="200px"
                borderRadius="md"
                shadow="sm"
                bg="gray.800"
                color="white"
                _hover={{ shadow: 'md' }}
                _focus={{ borderColor: 'teal.500' }}
                // border={'2px solid whiteAlpha.200'}
              >
                {metricToName[recapData[selectedSensor]?.metric] ||
                  selectedSensor ||
                  'Select Sensor'}
              </MenuButton>
              <MenuList bg="gray.700" color="white">
                {Object.keys(recapData).map(sensor => (
                  <MenuItem
                    key={sensor}
                    onClick={() =>
                      handleSensorChange({ target: { value: sensor } })
                    }
                    bg={'gray.700'}
                    _hover={{ bg: 'gray.600' }}
                    _focus={{ bg: '#3D5A80' }}
                  >
                    {metricToName[recapData[sensor]?.metric] || sensor}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                maxWidth="200px"
                borderRadius="md"
                shadow="sm"
                bg="gray.800"
                color="white"
                _hover={{ shadow: 'md' }}
                _focus={{ borderColor: 'teal.500' }}
                // border={'2px solid whiteAlpha.200'}
              >
                {weekStartDate
                  ? `${formatDateMMDDYY(
                      new Date(weekStartDate)
                    )} - ${formatDateMMDDYY(
                      getEndDate(new Date(weekStartDate))
                    )}`
                  : 'Select Week'}
              </MenuButton>
              <MenuList bg="gray.700" color="white">
                {availableWeeks.map(week => (
                  <MenuItem
                    key={week}
                    onClick={() =>
                      handleWeekChange({ target: { value: week } })
                    }
                    bg={'gray.700'}
                    _hover={{ bg: 'gray.600' }}
                    _focus={{ bg: '#3D5A80' }}
                  >
                    {formatDateMMDDYY(new Date(week))} -{' '}
                    {formatDateMMDDYY(getEndDate(new Date(week)))}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      )}
      {recapData && selectedSensor && (
        <Box
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          shadow="lg"
          bg="gray.900"
          color="white"
        >
          {/* Box for both rows of cards */}
          <Box width="100%">
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={6}>
              {['high', 'avg', 'low'].map((type, index) => {
                const { label, addSpace } = getLabelForMetric(
                  recapData[selectedSensor]?.metric
                );
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Box
                      p={6}
                      borderWidth="1px"
                      borderRadius="xl"
                      shadow="lg"
                      bg="gray.800"
                      color="white"
                      transition="all 0.3s ease"
                      textAlign={'center'}
                    >
                      <Stat>
                        <StatLabel fontSize="lg" color="gray.400">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </StatLabel>
                        <StatNumber fontSize="4xl" color="white" mb={1}>
                          {recapData[selectedSensor]?.[type]}
                          {addSpace ? ' ' : ''}
                          {label}
                        </StatNumber>
                        {/* <StatHelpText color="green">
                          100% ▲
                        </StatHelpText>
                        <StatHelpText color="gray.400" fontSize={'md'}>
                          vs last week
                        </StatHelpText> */}
                      </Stat>
                    </Box>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Box
                  p={6}
                  borderWidth="1px"
                  borderRadius="xl"
                  shadow="lg"
                  bg="gray.800"
                  color="white"
                  transition="all 0.3s ease"
                  textAlign={'center'}
                >
                  <Stat>
                    <StatLabel fontSize="lg" color="gray.400">
                      Alerts
                    </StatLabel>
                    <StatNumber fontSize="4xl" color="white" mb={1}>
                      {alertCounts[recapData[selectedSensor]?.metric] || 0}
                    </StatNumber>
                    {/* <StatHelpText color="red">100% ▼</StatHelpText>
                    <StatHelpText color="gray.400" fontSize={'md'}>
                      vs last week
                    </StatHelpText> */}
                  </Stat>
                </Box>
              </motion.div>
            </SimpleGrid>

            {/* Second row of cards */}
            {recentAlerts.length > 0 && (
              <SimpleGrid
                columns={{ base: 1, sm: 1, md: 2 }}
                spacing={6}
                width="100%"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="xl"
                    shadow="lg"
                    bg="gray.700"
                    color="white"
                    maxWidth="100%"
                    textAlign="left"
                    position="relative"
                    height="335px"
                  >
                    <Heading
                      size="md"
                      fontWeight="bold"
                      mb={4}
                      textDecoration="underline"
                      color={'white'}
                    >
                      Alerts for Selected Week
                    </Heading>
                    <Box overflowY={'scroll'} maxHeight="250px">
                      {recentAlerts.map(alert => (
                        <Box key={alert.id} mb={2}>
                          <Text fontSize="sm" color="white">
                            {alert.message}
                          </Text>
                          <Divider mb={2} mt={2} borderColor="whiteAlpha.600" />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  <Box
                    bg={'gray.700'}
                    borderRadius={'xl'}
                    borderWidth={'1px'}
                    p={6}
                    alignSelf="flex-start"
                    height={'auto'}
                  >
                    <Heading fontSize="lg" mb={2} color={'white'}>
                      Recap Data
                    </Heading>
                    <Box
                      p={4}
                      bg="gray.700"
                      borderRadius="md"
                      maxHeight="200px"
                      overflowY="scroll"
                      mb={4}
                    >
                      <Text fontSize="xs" color="white">
                        {JSON.stringify(recapData, null, 2)}
                      </Text>
                      <Text fontSize="xs" color="white">
                        {JSON.stringify(recentAlerts, null, 2)}
                      </Text>
                    </Box>
                    <Button
                      variant="blue"
                      onClick={copyToClipboard}
                      width={isLargerThan768 ? 'auto' : '100%'}
                    >
                      Copy to Clipboard
                    </Button>
                    <Button
                      variant={'blue'}
                      isDisabled={!hasCopied}
                      onClick={() => setShowChatbot(true)}
                      width={isLargerThan768 ? 'auto' : '100%'}
                      mt={isLargerThan768 ? 0 : 4}
                    >
                      Analyze Recap
                    </Button>
                    {!hasCopied && (
                      <Badge
                        ml={isLargerThan768 ? 12 : 0}
                        colorScheme="green"
                        fontSize={'sm'}
                        mt={isLargerThan768 ? 0 : 4}
                      >
                        Please copy to clipboard to access AI Analytics
                      </Badge>
                    )}
                  </Box>
                </motion.div>
              </SimpleGrid>
            )}
          </Box>
        </Box>
      )}
      {showChatbot && (
        <ChatbotModal
          showChatbot={showChatbot}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </Box>
  );
};

export default WeeklyRecap;
