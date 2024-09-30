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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
  StatHelpText,
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@chakra-ui/icons';
import ChatbotModal from './WeeklyRecapAiModal.js';
import { LineChart } from '../Charts/Charts.js';
import RecapChartWrapper from './RecapChartWrapper.js';

// Helper function to adjust dates
const adjustWeekStartDate = date => {
  const targetDate = '2024-09-16'; // The date format to compare
  const currentDate = new Date(date);
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format

  // If the date does not match the target, subtract 6 days
  if (formattedCurrentDate !== targetDate) {
    currentDate.setDate(currentDate.getDate() - 6);
  }

  return currentDate.toISOString().split('T')[0]; // Return adjusted date in YYYY-MM-DD format
};

const calculateDifferential = (current, previous) => {
  if (previous === undefined || current === undefined) return null; // Safety check for undefined data

  // console.log('current and previous', current, previous);

  const difference = current - previous;
  const percentage = ((difference / previous) * 100).toFixed(2);

  if (difference > 0) {
    return { value: `${percentage}% ▲`, color: 'green' };
  } else if (difference < 0) {
    return { value: `${percentage}% ▼`, color: 'red' };
  } else {
    return { value: 'No change', color: 'gray' };
  }
};

const calculateAlertDifferential = (current, previous) => {
  console.log('current and previous', current, previous);
  if (previous === 0 && current === 0)
    return { value: 'No change', color: 'gray' }; // Both weeks have zero alerts
  if (previous === undefined || current === undefined)
    return { value: 'No change', color: 'gray' }; // Handle undefined data

  // When there were no alerts in the previous week but there are alerts in the current week
  if (previous === 0 && current > 0) {
    return { value: '100% ▲', color: 'green' };
  }

  // When there were alerts in the previous week but none in the current week
  if (previous > 0 && current === 0) {
    return { value: '100% ▼', color: 'red' };
  }

  const difference = current - previous;
  const percentage = ((difference / previous) * 100).toFixed(2);

  if (difference > 0) {
    return { value: `${percentage}% ▲`, color: 'green' };
  } else if (difference < 0) {
    return { value: `${Math.abs(percentage)}% ▼`, color: 'red' };
  } else {
    return { value: 'No change', color: 'gray' };
  }
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
  const [previousRecapData, setPreviousRecapData] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [previousAlerts, setPreviousAlerts] = useState([]);
  const [alertCounts, setAlertCounts] = useState({});
  const [previousAlertCounts, setPreviousAlertCounts] = useState({});
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]); // To store available weeks
  const [selectedSensor, setSelectedSensor] = useState(''); // State for selected sensor
  const [sensorData, setSensorData] = useState({});
  const [hasCopied, setHasCopied] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const toast = useToast(); // For showing copy notifications
  const hasMounted = useRef(false);

  useEffect(() => {
    const fetchAvailableWeeks = async () => {
      try {
        const response = await axios.get('/api/weekly-recap/weeks');
        const adjustedWeeks = response.data.map(week => ({
          ...week,
          week_start_date: adjustWeekStartDate(week.week_start_date),
        }));

        setAvailableWeeks(adjustedWeeks.map(week => week.week_start_date));
        console.log('Available weeks:', adjustedWeeks);

        if (adjustedWeeks.length > 0) {
          const mostRecentWeek = adjustedWeeks[0].week_start_date;
          setWeekStartDate(mostRecentWeek);
          setWeekEndDate(
            formatDateMMDDYY(getEndDate(new Date(mostRecentWeek)))
          );
        }
      } catch (error) {
        console.error('Error fetching available weeks:', error);
      }
    };

    fetchAvailableWeeks();
  }, []);

  useEffect(() => {
    const fetchWeeklyRecapData = async () => {
      if (!userEmail || userMetrics.length === 0 || !weekStartDate) return;

      let adjustedWeekStartDate = weekStartDate;

      // Check if weekStartDate doesn't match "2024-09-16"
      if (weekStartDate !== '2024-09-16') {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + 6); // Add 6 days to the weekStartDate
        adjustedWeekStartDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      try {
        const recapResponse = await axios.get('/api/weekly-recap', {
          params: {
            user_email: userEmail,
            week_start_date: adjustedWeekStartDate,
          },
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
          if (
            recapResponse.data &&
            Object.keys(recapResponse.data).length > 0
          ) {
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

  useEffect(() => {
    const fetchSensorData = async () => {
      if (!selectedSensor || !weekStartDate || !weekEndDate) return;

      try {
        const response = await axios.get('/api/sensor_data', {
          params: {
            sensor: recapData[selectedSensor]?.metric, // Send as a string, not an array
            start_date: new Date(weekStartDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
            end_date: new Date(weekEndDate).toISOString().split('T')[0], // Format as YYYY-MM-DD
          },
        });

        setSensorData(response.data);
        console.log('Fetched sensor data for graph:', response.data);
        // Set state to handle the graph data
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, [selectedSensor, weekStartDate, weekEndDate]);

  useEffect(() => {
    const fetchPreviousWeekData = async () => {
      if (!userEmail || !userMetrics.length || !weekStartDate) return;

      const previousWeekStartDate = new Date(weekStartDate);
      previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7); // Move back one week

      try {
        const previousRecapResponse = await axios.get('/api/weekly-recap', {
          params: {
            user_email: userEmail,
            week_start_date: previousWeekStartDate.toISOString().split('T')[0],
          },
        });
        setPreviousRecapData(previousRecapResponse.data);
        const alertResponse = await axios.get('/api/alerts/recap', {
          params: {
            start_date: previousWeekStartDate.toISOString().split('T')[0],
          },
        });
        const filteredAlerts = alertResponse.data.filter(alert =>
          userMetrics.includes(alert.metric)
        );

        setPreviousAlerts(filteredAlerts);

        // Count alerts by metric
        const alertCount = filteredAlerts.reduce((count, alert) => {
          count[alert.metric] = (count[alert.metric] || 0) + 1;
          return count;
        }, {});
        setPreviousAlertCounts(alertCount);
      } catch (error) {
        console.error('Error fetching previous week data:', error);
      }
    };

    fetchPreviousWeekData();
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
    setShowChatbot(true);
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

  const currentAlertCount = alertCounts[recapData[selectedSensor]?.metric] || 0;
  const previousAlertCount =
    previousAlertCounts[recapData[selectedSensor]?.metric] || 0;
  const alertDifferential = calculateAlertDifferential(
    currentAlertCount,
    previousAlertCount
  );

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
          <Heading
            size={isLargerThan768 ? 'lg' : 'md'}
            fontWeight="bold"
            mb={!isLargerThan768 ? 4 : 0}
          >
            Recap for{' '}
            {metricToName[recapData[selectedSensor]?.metric] || selectedSensor}{' '}
            ({formatDateMMDDYY(new Date(weekStartDate))} -{' '}
            {formatDateMMDDYY(new Date(weekEndDate))})
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
                    bg={sensor === selectedSensor ? 'gray.900' : 'gray.700'}
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
                    bg={week === weekStartDate ? 'gray.900' : 'gray.700'}
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

                // Get the current and previous week's values
                const currentValue = recapData[selectedSensor]?.[type];
                const previousValue = previousRecapData[selectedSensor]?.[type];

                // Calculate the differential
                const differential = calculateDifferential(
                  currentValue,
                  previousValue
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
                        {differential && (
                          <>
                            <StatHelpText color={differential.color}>
                              {differential.value}
                            </StatHelpText>
                            <StatHelpText color="gray.400" fontSize={'md'}>
                              vs previous week
                            </StatHelpText>
                          </>
                        )}
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
                      {currentAlertCount}
                    </StatNumber>
                    {alertDifferential && (
                      <>
                        <StatHelpText color={alertDifferential.color}>
                          {alertDifferential.value}
                        </StatHelpText>
                        <StatHelpText color="gray.400" fontSize={'md'}>
                          vs previous week
                        </StatHelpText>
                      </>
                    )}
                  </Stat>
                </Box>
              </motion.div>
            </SimpleGrid>
            {sensorData && sensorData.length > 0 && recapData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
              >
                <RecapChartWrapper>
                  <LineChart
                    data={sensorData}
                    metric={recapData[selectedSensor]?.metric}
                  />
                </RecapChartWrapper>
              </motion.div>
            )}

            {/* Second row of cards */}
            {recentAlerts && (
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
                      All Alerts for Selected Week
                    </Heading>
                    <Box overflowY={'scroll'} maxHeight="250px">
                      {recentAlerts.length > 0 ? (
                        recentAlerts.map(alert => (
                          <Box key={alert.id} mb={2}>
                            <Text fontSize="sm" color="white">
                              {alert.message}
                            </Text>
                            <Divider
                              mb={2}
                              mt={2}
                              borderColor="whiteAlpha.600"
                            />
                          </Box>
                        ))
                      ) : (
                        <Text
                          fontSize="2xl"
                          color="white"
                          textAlign="center"
                          mt={12}
                        >
                          No alerts for this week.
                        </Text>
                      )}
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
                    height="335px"
                    position={'relative'}
                  >
                    <Heading
                      size={'md'}
                      mb={2}
                      color={'white'}
                      textDecoration={'underline'}
                    >
                      AI Analysis
                    </Heading>
                    <Box
                      p={4}
                      bg="gray.700"
                      borderRadius="md"
                      mb={4}
                      color="white"
                      fontSize={'lg'}
                    >
                      If you would like to analyze the data for this week for
                      all sensors, please click the button below. It will copy
                      the data into your clipboard. A chatbot will be
                      launched to analyze the data, please paste the data into
                      the chatbot to analyze it.
                    </Box>
                    <Button
                      variant={'blue'}
                      onClick={() => copyToClipboard()}
                      width={'99%'}
                      mt={isLargerThan768 ? 0 : 4}
                      size={isLargerThan768 ? 'lg' : 'md'}
                      position="absolute"
                      bottom="4"
                      left="1"
                    >
                      Analyze Recap
                    </Button>
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
