import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Divider,
  Select,
  Collapse,
  IconButton,
  StatNumber,
  StatLabel,
  Stat,
  Icon,
  Grid,
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import {
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaChartBar,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

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
      soil_moisture: { label: 'centibar', addSpace: true },
      leaf_wetness: { label: 'out of 15', addSpace: true },
    };

    return metricLabels[metric] || { label: '', addSpace: false };
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/weekly-recap/${id}`);
      setRecentAlerts(recentAlerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
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

      {recapData && (
        <Box mt={4} width="100%">
          {Object.keys(recapData).length === 0 ? (
            <Text fontSize="lg" color="gray.600">
              Loading weekly recap data...
            </Text>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing={6}>
              <AnimatePresence>
                {Object.keys(recapData).map((metric, index) => {
                  const metricName =
                    metricToName[recapData[metric]?.metric] ||
                    recapData[metric]?.metric; // Use friendly name or fallback to raw name

                  const { label, addSpace } = getLabelForMetric(
                    recapData[metric]?.metric
                  );
                  return (
                    <motion.div
                      key={recapData[metric]?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }} // Stagger animation by 0.1s
                    >
                      <Box
                        p={6}
                        borderWidth="1px"
                        borderRadius="lg"
                        shadow="lg"
                        bg="radial-gradient(circle, rgba(49,126,182,1) 0%, rgba(18,53,94,1) 90%)"
                        _hover={{
                          shadow: '2xl',
                          transform: 'scale(1.05)',
                          bg: 'rgba(18,53,94,1)',
                        }}
                        color="black"
                        transition="all 0.3s ease"
                      >
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          mb={4}
                        >
                          <Heading
                            size="md"
                            color="white"
                            fontWeight="bold"
                            textDecoration="underline"
                          >
                            {metricName}
                          </Heading>
                          <Icon
                            as={FaChartBar} // Replace with an appropriate icon for your metric
                            color="white"
                            boxSize={6}
                          />
                        </Flex>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Stat>
                            <StatLabel fontSize="sm" color="#cee8ff">
                              High
                            </StatLabel>
                            <StatNumber fontSize="lg" color="white">
                              {recapData[metric]?.high}
                              {addSpace ? ' ' : ''}
                              {label}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="sm" color="#cee8ff">
                              Avg
                            </StatLabel>
                            <StatNumber fontSize="lg" color="white">
                              {recapData[metric]?.avg}
                              {addSpace ? ' ' : ''}
                              {label}
                            </StatNumber>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="sm" color="#cee8ff">
                              Low
                            </StatLabel>
                            <StatNumber fontSize="lg" color="white">
                              {recapData[metric]?.low}
                              {addSpace ? ' ' : ''}
                              {label}
                            </StatNumber>
                          </Stat>
                          <Box>
                            <Text fontSize="sm" color="#cee8ff">
                              Alerts
                            </Text>
                            <Text
                              fontSize="lg"
                              color="white"
                              fontWeight={'bold'}
                            >
                              {alertCounts[recapData[metric]?.metric] || 0}
                            </Text>
                          </Box>
                        </Grid>
                      </Box>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </SimpleGrid>
          )}
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
