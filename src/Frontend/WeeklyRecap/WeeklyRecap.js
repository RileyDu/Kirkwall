import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Divider,
  Select,
  StatNumber,
  StatLabel,
  Stat,
  Collapse,
  IconButton
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Utility function to format date as MM/DD/YY
const formatDateMMDDYY = date => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
  return `${month}/${day}/${year}`;
};

// Utility function to calculate the start of the week (Monday)
const getStartOfWeek = date => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const difference = (day === 0 ? -6 : 1) - day; // Adjust to get Monday
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + difference);
  return startOfWeek;
};

// Utility function to calculate end date as Sunday of the week
const getEndDate = startDate => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Monday + 6 = Sunday
  return endDate;
};

const WeeklyRecap = ({ statusOfAlerts }) => {
  const { currentUser } = useAuth();
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
  const [expandAlerts, setExpandAlerts] = useState(false);

  // Fetch available weeks for dropdown on component mount
  useEffect(() => {
    const fetchAvailableWeeks = async () => {
      try {
        const response = await axios.get('/api/weekly-recap/weeks');
        setAvailableWeeks(response.data.map(week => week.week_start_date));
        if (response.data.length > 0) {
          const mostRecentWeek = response.data[0].week_start_date;
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

      try {
        const recapResponse = await axios.get('/api/weekly-recap', {
          params: { user_email: userEmail, week_start_date: weekStartDate },
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

        // Set initial selected sensor to the first metric in the list
        if (recapResponse.data && Object.keys(recapResponse.data).length > 0) {
          setSelectedSensor(Object.keys(recapResponse.data)[0]);
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
  };

  const handleSensorChange = e => {
    setSelectedSensor(e.target.value);
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


  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      pt={statusOfAlerts ? '10px' : '74px'}
      px={4}
    >
      {weekStartDate && (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mb={4}
        >
          <Heading size="2xl" fontWeight="bold">
            Recap for {formatDateMMDDYY(new Date(weekStartDate))} -{' '}
            {formatDateMMDDYY(new Date(weekEndDate))}
          </Heading>
          <Select
            onChange={handleWeekChange}
            value={weekStartDate}
            maxWidth="300px"
            borderRadius="full"
            shadow="sm"
            _hover={{ shadow: 'md' }}
            _focus={{ borderColor: 'teal.500' }}
          >
            {availableWeeks.map(week => (
              <option key={week} value={week}>
                {formatDateMMDDYY(new Date(week))} -{' '}
                {formatDateMMDDYY(getEndDate(new Date(week)))}
              </option>
            ))}
          </Select>
        </Flex>
      )}

      {recapData && selectedSensor && (
        <Box mt={4} width="100%">
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading size="lg">Select a Sensor</Heading>
            <Select
              value={selectedSensor}
              onChange={handleSensorChange}
              maxWidth="300px"
              borderRadius="full"
              shadow="sm"
              _hover={{ shadow: 'md' }}
              _focus={{ borderColor: 'teal.500' }}
            >
              {Object.keys(recapData).map(sensor => (
                <option key={sensor} value={sensor}>
                  {metricToName[recapData[sensor]?.metric] || sensor}
                </option>
              ))}
            </Select>
          </Flex>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
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
                    borderRadius="lg"
                    shadow="lg"
                    bg="teal.500"
                    color="white"
                    transition="all 0.3s ease"
                  >
                    <Stat>
                      <StatLabel fontSize="md" color="#cee8ff">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </StatLabel>
                      <StatNumber fontSize="2xl" color="white">
                        {recapData[selectedSensor]?.[type]}
                        {addSpace ? ' ' : ''}
                        {label}
                      </StatNumber>
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
                borderRadius="lg"
                shadow="lg"
                bg="teal.500"
                color="white"
                transition="all 0.3s ease"
              >
                <Stat>
                  <StatLabel fontSize="md" color="#cee8ff">
                    Alerts
                  </StatLabel>
                  <StatNumber fontSize="2xl" color="white">
                    {alertCounts[recapData[selectedSensor]?.metric] || 0}
                  </StatNumber>
                </Stat>
              </Box>
            </motion.div>
          </SimpleGrid>
        </Box>
      )}

{recentAlerts.length > 0 && (
        <Box
          justifyContent={'center'}
          alignItems={'center'}
          display={'flex'}
          width="100%"
          mt={6}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
          <Box
            mt={6}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            shadow="lg"
            bgGradient="linear(to-r, teal.500, blue.500)"
            color="white"
            maxWidth="900px"
            textAlign="left"
            position="relative"
          >
            <Heading
              size="md"
              fontWeight="bold"
              mb={4}
              textDecoration="underline"
              color={'white'}
            >
              This Week's Alerts
            </Heading>

            {/* Collapse Component for Alerts */}
            <Collapse startingHeight={200} in={expandAlerts}>
              {recentAlerts.map(alert => (
                <Box key={alert.id} mb={2}>
                  <Text fontSize="md" color="white">
                    {alert.message}
                  </Text>
                  <Divider mb={2} mt={2} borderColor="whiteAlpha.600" />
                </Box>
              ))}
            </Collapse>

            {/* Chevron Icon for Expanding/Collapsing */}
            <Flex justifyContent="center" mt={2}>
              <IconButton
                onClick={() => setExpandAlerts(!expandAlerts)}
                icon={expandAlerts ? <FaChevronUp /> : <FaChevronDown />}
                aria-label="Expand Alerts"
                borderRadius="full"
                size="sm"
                colorScheme="teal"
                variant="outline"
              />
            </Flex>
          </Box>
        </motion.div>
        </Box>
      )}
    </Box>
  );
};

export default WeeklyRecap;
