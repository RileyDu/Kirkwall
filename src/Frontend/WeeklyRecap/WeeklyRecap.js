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
  IconButton
} from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
      soil_moisture: { label: 'centibars', addSpace: true },
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

  return (
    <Box
  minHeight="100vh"
  display="flex"
  flexDirection="column"
  alignItems="center"
  pt={statusOfAlerts ? '10px' : '74px'}
  px={4}
>
  <Flex justifyContent="space-between" alignItems="center" width="100%">
    <Heading size="2xl" fontWeight="bold">
      Recap for {formatDateMMDDYY(new Date(weekStartDate))} - {formatDateMMDDYY(new Date(weekEndDate))}
    </Heading>
  </Flex>

  {/* Dropdown for selecting week */}
  <Select
    onChange={handleWeekChange}
    value={weekStartDate}
    mt={4}
    mb={4}
    maxWidth="300px"
    borderRadius="full"
    shadow="sm"
    _hover={{ shadow: 'md' }}
    _focus={{ borderColor: 'teal.500' }}
  >
    {availableWeeks.map(week => (
      <option key={week} value={week}>
        {formatDateMMDDYY(new Date(week))} - {formatDateMMDDYY(getEndDate(new Date(week)))}
      </option>
    ))}
  </Select>

  {recapData && (
    <Box mt={4} width="100%">
      {Object.keys(recapData).length === 0 ? (
        <Text fontSize="lg" color="gray.600">Loading weekly recap data...</Text>
      ) : (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 6 }}
          spacing={6}
        >
          <AnimatePresence>
            {Object.keys(recapData).map((metric, index) => {
              const { label, addSpace } = getLabelForMetric(recapData[metric]?.metric);
              return (
                <motion.div
                  key={recapData[metric]?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}  // Stagger animation by 0.1s
                >
                  <Box
                    p={6}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="lg"
                    bg="white"
                    _hover={{ shadow: 'xl', transform: 'scale(1.02)' }}
                    color="black"
                    transition="all 0.3s ease"
                  >
                    <Heading
                      size="md"
                      mb={2}
                      color="teal.600"
                      fontWeight="bold"
                      textDecoration="underline"
                    >
                      {recapData[metric]?.metric}
                    </Heading>
                    <Text fontSize="lg" mb={1}>
                      <strong>High:</strong> {recapData[metric]?.high}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text fontSize="lg" mb={1}>
                      <strong>Low:</strong> {recapData[metric]?.low}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text fontSize="lg" mb={1}>
                      <strong>Avg:</strong> {recapData[metric]?.avg}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text fontSize="lg">
                      <strong>Alerts:</strong> {alertCounts[recapData[metric]?.metric] || 0}
                    </Text>
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
      mt={6}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      shadow="lg"
      bg="white"
      color="black"
      maxWidth="800px"
      textAlign="left"
      position="relative"
    >
      <Heading
        size="md"
        color="teal.600"
        fontWeight="bold"
        mb={4}
        textDecoration="underline"
      >
        This Week's Alerts
      </Heading>

      {/* Collapse Component for Alerts */}
      <Collapse startingHeight={200} in={expandAlerts}>
        {recentAlerts.map(alert => (
          <Box key={alert.id} mb={2}>
            <Text fontSize="md" color="gray.800">
              {alert.message}
            </Text>
            <Divider mb={2} />
          </Box>
        ))}
      </Collapse>

      {/* Chevron Icon for Expanding/Collapsing */}
      <Flex justifyContent="center" mt={2}>
        <IconButton
          onClick={() => setExpandAlerts(!expandAlerts)}
          icon={expandAlerts ? <FaChevronUp /> : <FaChevronDown />}
          aria-label="Expand Alerts"
          variant="blue"
          borderRadius="full"
          size="sm"
        />
      </Flex>
    </Box>
  )}
</Box>
  );
};

export default WeeklyRecap;
