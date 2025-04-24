import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Flex, Heading, Text, SimpleGrid, Divider, Stat, StatNumber, 
  StatLabel, Button, useToast, Menu, MenuButton, MenuList, MenuItem, 
  useMediaQuery, StatHelpText
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { LineChart } from '../Charts/Charts.js';
import RecapChartWrapper from './RecapChartWrapper.js';
import RecapChatbot from './RecapChatbot.js';

const MotionBox = motion(Box);

// Utility constants and functions
const METRIC_NAMES = {
  temperature: 'Temperature',
  percent_humidity: 'Humidity',
  wind_speed: 'Wind',
  soil_moisture: 'Soil Moisture',
  leaf_wetness: 'Leaf Wetness',
  rain_15_min_inches: 'Rainfall',
  temp: 'Temperature (Watchdog)',
  hum: 'Humidity (Watchdog)',
};

const METRIC_LABELS = {
  temperature: { label: '°F', addSpace: false },
  temp: { label: '°F', addSpace: false },
  hum: { label: '%', addSpace: false },
  percent_humidity: { label: '%', addSpace: false },
  rain_15_min_inches: { label: 'inches', addSpace: true },
  wind_speed: { label: 'MPH', addSpace: true },
  soil_moisture: { label: 'centibars', addSpace: true },
  leaf_wetness: { label: 'out of 15', addSpace: true },
  monnit_bathroom: { label: '', addSpace: false },
  monnit_fridge: { label: '°F', addSpace: false },
  monnit_freezer: { label: '°F', addSpace: false },
  monnit_amp: { label: 'Ah', addSpace: true },
};

// Format date as MM/DD/YY
const formatDate = date => {
  const d = new Date(date);
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
};

// Get end date (start date + 6 days)
const getEndDate = startDate => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return endDate;
};

// Calculate percentage difference with indication
const calculateDiff = (current, previous) => {
  if (previous === undefined || current === undefined) return null;
  
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

// Calculate alert differential with special cases
const calculateAlertDiff = (current, previous) => {
  if (previous === 0 && current === 0) return { value: 'No change', color: 'gray' };
  if (previous === undefined || current === undefined) return { value: 'No change', color: 'gray' };
  
  if (previous === 0 && current > 0) return { value: '100% ▲', color: 'green' };
  if (previous > 0 && current === 0) return { value: '100% ▼', color: 'red' };
  
  return calculateDiff(current, previous);
};

const WeeklyRecap = ({ statusOfAlerts }) => {
  const { currentUser } = useAuth();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const toast = useToast();
  const hasMounted = useRef(false);
  
  // State variables
  const [recapData, setRecapData] = useState({});
  const [previousRecapData, setPreviousRecapData] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [alertCounts, setAlertCounts] = useState({});
  const [previousAlertCounts, setPreviousAlertCounts] = useState({});
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState('');
  const [sensorData, setSensorData] = useState({});
  const [showChatbot, setShowChatbot] = useState(false);
  
  // Get user metrics
  const userEmail = currentUser?.email;
  const userMetrics = CustomerSettings.find(customer => 
    customer.email === userEmail)?.metric || [];

  // Fetch available weeks
  useEffect(() => {
    const fetchAvailableWeeks = async () => {
      try {
        const response = await axios.get('/api/weekly-recap/weeks');
        const weeks = response.data.map(week => week.week_start_date);
        
        setAvailableWeeks(weeks);
        
        if (weeks.length > 0) {
          setWeekStartDate(weeks[0]);
          setWeekEndDate(formatDate(getEndDate(new Date(weeks[0]))));
        }
      } catch (error) {
        console.error('Error fetching available weeks:', error);
      }
    };

    fetchAvailableWeeks();
  }, []);

  // Fetch current week data
  useEffect(() => {
    const fetchWeeklyRecapData = async () => {
      if (!userEmail || userMetrics.length === 0 || !weekStartDate) return;

      try {
        // Fetch recap data
        const recapResponse = await axios.get('/api/weekly-recap', {
          params: { user_email: userEmail, week_start_date: weekStartDate }
        });
        setRecapData(recapResponse.data);

        // Fetch and filter alerts
        const alertResponse = await axios.get('/api/alerts/recap', {
          params: { start_date: weekStartDate }
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

        // Set initial selected sensor
        if (!hasMounted.current && recapResponse.data && Object.keys(recapResponse.data).length > 0) {
          setSelectedSensor(Object.keys(recapResponse.data)[0]);
          hasMounted.current = true;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchWeeklyRecapData();
  }, [userEmail, userMetrics, weekStartDate]);

  // Fetch sensor data for chart
  useEffect(() => {
    const fetchSensorData = async () => {
      if (!selectedSensor || !weekStartDate || !weekEndDate) return;

      try {
        const response = await axios.get('/api/sensor_data', {
          params: {
            sensor: recapData[selectedSensor]?.metric,
            start_date: weekStartDate,
            end_date: new Date(weekEndDate).toISOString().split('T')[0],
          }
        });
        setSensorData(response.data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchSensorData();
  }, [selectedSensor, weekStartDate, weekEndDate, recapData]);

  // Fetch previous week data for comparison
  useEffect(() => {
    const fetchPreviousWeekData = async () => {
      if (!userEmail || !userMetrics.length || !weekStartDate) return;

      const previousDate = new Date(weekStartDate);
      previousDate.setDate(previousDate.getDate() - 7);
      const prevDateStr = previousDate.toISOString().split('T')[0];

      try {
        // Fetch previous recap data
        const recapResponse = await axios.get('/api/weekly-recap', {
          params: { user_email: userEmail, week_start_date: prevDateStr }
        });
        setPreviousRecapData(recapResponse.data);

        // Fetch previous alerts
        const alertResponse = await axios.get('/api/alerts/recap', {
          params: { start_date: prevDateStr }
        });
        const filteredAlerts = alertResponse.data.filter(alert =>
          userMetrics.includes(alert.metric)
        );

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

  // Event handlers
  const handleWeekChange = week => {
    setWeekStartDate(week);
    setWeekEndDate(formatDate(getEndDate(new Date(week))));
    setShowChatbot(false);
  };

  const handleSensorChange = sensor => {
    setSelectedSensor(sensor);
  };

  const handleOpenChatbot = () => {
    if (!recapData || Object.keys(recapData).length === 0) {
      toast({
        title: 'No data to analyze',
        description: 'There is no weekly recap data available for analysis.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setShowChatbot(true);
  };

  // Calculate metrics for rendering
  const currentMetric = recapData[selectedSensor]?.metric;
  const metricName = METRIC_NAMES[currentMetric] || selectedSensor;
  const { label, addSpace } = METRIC_LABELS[currentMetric] || { label: '', addSpace: false };
  const currentAlertCount = alertCounts[currentMetric] || 0;
  const previousAlertCount = previousAlertCounts[currentMetric] || 0;
  const alertDifferential = calculateAlertDiff(currentAlertCount, previousAlertCount);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      pt={statusOfAlerts ? '10px' : '74px'}
      px={isLargerThan768 ? 12 : 4}
      position="relative"
    >
      {weekStartDate && (
        <Flex
          flexDirection={isLargerThan768 ? 'row' : 'column'}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mb={4}
          px={1}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Heading size={isLargerThan768 ? 'lg' : 'md'} fontWeight="bold" mb={!isLargerThan768 ? 4 : 0}>
              Recap for {metricName} ({formatDate(new Date(weekStartDate))} - {formatDate(new Date(weekEndDate))})
            </Heading>
          </motion.div>
          
          <Box display="flex" gap={4}>
            {/* Sensor selector */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                maxWidth="200px"
                borderRadius="md"
                bg="gray.800"
                color="white"
                _hover={{ shadow: 'md' }}
              >
                {metricName || 'Select Sensor'}
              </MenuButton>
              <MenuList bg="gray.700" color="white">
                {Object.keys(recapData).map(sensor => (
                  <MenuItem
                    key={sensor}
                    onClick={() => handleSensorChange(sensor)}
                    bg={sensor === selectedSensor ? 'gray.900' : 'gray.700'}
                    _hover={{ bg: 'gray.600' }}
                  >
                    {METRIC_NAMES[recapData[sensor]?.metric] || sensor}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            
            {/* Week selector */}
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                maxWidth="200px"
                borderRadius="md"
                bg="gray.800"
                color="white"
                _hover={{ shadow: 'md' }}
              >
                {formatDate(new Date(weekStartDate))} - {formatDate(getEndDate(new Date(weekStartDate)))}
              </MenuButton>
              <MenuList bg="gray.700" color="white">
                {availableWeeks.map(week => (
                  <MenuItem
                    key={week}
                    onClick={() => handleWeekChange(week)}
                    bg={week === weekStartDate ? 'gray.900' : 'gray.700'}
                    _hover={{ bg: 'gray.600' }}
                  >
                    {formatDate(new Date(week))} - {formatDate(getEndDate(new Date(week)))}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      )}

      {recapData && selectedSensor && (
        <MotionBox
          p={6}
          borderWidth="1px"
          borderRadius="xl"
          shadow="lg"
          bg="gray.900"
          color="white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Box width="100%">
            {/* Stats cards */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={6}>
              {['high', 'avg', 'low'].map((type, index) => {
                const currentValue = recapData[selectedSensor]?.[type];
                const previousValue = previousRecapData[selectedSensor]?.[type];
                const differential = calculateDiff(currentValue, previousValue);
                
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: index * 0.3 }}
                  >
                    <Box
                      p={6}
                      borderColor={differential?.color || 'gray.400'}
                      borderWidth="1px"
                      borderRadius="xl"
                      shadow="lg"
                      bg="gray.800"
                      color="white"
                      textAlign="center"
                    >
                      <Stat>
                        <StatLabel fontSize="lg" color="gray.400">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </StatLabel>
                        <StatNumber fontSize="4xl" color="white" mb={1}>
                          {currentValue}
                          {addSpace ? ' ' : ''}
                          {label}
                        </StatNumber>
                        {differential && (
                          <>
                            <StatHelpText color={differential.color}>
                              {differential.value}
                            </StatHelpText>
                            <StatHelpText color="gray.400" fontSize="md">
                              vs previous week
                            </StatHelpText>
                          </>
                        )}
                      </Stat>
                    </Box>
                  </motion.div>
                );
              })}
              
              {/* Alerts card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Box
                  p={6}
                  borderWidth="1px"
                  borderRadius="xl"
                  borderColor={alertDifferential?.color || 'gray.400'}
                  shadow="lg"
                  bg="gray.800"
                  color="white"
                  textAlign="center"
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
                        <StatHelpText color="gray.400" fontSize="md">
                          vs previous week
                        </StatHelpText>
                      </>
                    )}
                  </Stat>
                </Box>
              </motion.div>
            </SimpleGrid>
            
            {/* Chart section */}
            {sensorData && sensorData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
              >
                <RecapChartWrapper>
                  <LineChart data={sensorData} metric={currentMetric} />
                </RecapChartWrapper>
              </motion.div>
            )}

            {/* Alerts and AI analysis section */}
            <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} spacing={6} width="100%" mt={6}>
              {/* Alerts panel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              >
                <Box
                  p={6}
                  borderWidth="1px"
                  borderRadius="xl"
                  shadow="lg"
                  bg="gray.700"
                  color="white"
                  height="335px"
                >
                  <Heading size="md" fontWeight="bold" mb={4} textDecoration="underline">
                    All Alerts for Selected Week
                  </Heading>
                  <Box overflowY="scroll" maxHeight="250px">
                    {recentAlerts.length > 0 ? (
                      recentAlerts.map(alert => (
                        <Box key={alert.id} mb={2}>
                          <Text fontSize="sm">{alert.message}</Text>
                          <Divider mb={2} mt={2} borderColor="whiteAlpha.600" />
                        </Box>
                      ))
                    ) : (
                      <Text fontSize="2xl" textAlign="center" mt={12}>
                        No alerts for this week.
                      </Text>
                    )}
                  </Box>
                </Box>
              </motion.div>
              
              {/* AI Analysis panel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              >
                <Box
                  bg="gray.700"
                  borderRadius="xl"
                  borderWidth="1px"
                  p={6}
                  height="335px"
                  position="relative"
                >
                  <Heading size="md" mb={2} textDecoration="underline">
                    AI Analysis
                  </Heading>
                  <Box p={4} bg="gray.700" borderRadius="md" mb={4} fontSize="lg">
                    <Text>
                      Open our AI assistant to analyze this week's data across all sensors 
                      and get insights, trends, and recommendations. The assistant will help you
                      understand your data and provide actionable insights.
                    </Text>
                  </Box>
                  <Button
                    variant="blue"
                    onClick={handleOpenChatbot}
                    width="99%"
                    size={isLargerThan768 ? 'lg' : 'md'}
                    position="absolute"
                    bottom="4"
                    left="1"
                  >
                    Open AI Assistant
                  </Button>
                </Box>
              </motion.div>
            </SimpleGrid>
          </Box>
        </MotionBox>
      )}
      
      {/* AI Chatbot */}
      {showChatbot && (
        <RecapChatbot
          recapData={recapData}
          recentAlerts={recentAlerts}
          userEmail={userEmail}
          onClose={() => setShowChatbot(false)}
        />
      )}
    </Box>
  );
};

export default WeeklyRecap;