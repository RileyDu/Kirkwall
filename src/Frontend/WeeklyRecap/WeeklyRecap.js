import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid, Divider } from '@chakra-ui/react';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import axios from 'axios';
import { WeeklyRecapHelper } from './WeeklyRecapHelper.js';

// Utility function to format date as MM/DD/YY
const formatDate = (date) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
  const day = date.getDate();
  const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  // Return formatted date as MM/DD/YY
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
};

// Utility function to calculate end date as Sunday of the week
const getEndDate = (startDate) => {
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

  const [isMonday, setIsMonday] = useState(false);
  const [recapData, setRecapData] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [alertCounts, setAlertCounts] = useState({});
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (dayOfWeek === 2) { // 2 represents Monday
      setIsMonday(true);

      // Set the week start date to the date in your recap data or a default value
      const startDate = new Date('2024-09-16T05:00:00.000Z'); // Replace with dynamic date if needed
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(getEndDate(startDate));
      
      setWeekStartDate(formattedStartDate);
      setWeekEndDate(formattedEndDate);
      
      console.log('Today is Monday! Fetching weekly recap data...');

      // axios.get('api/weekly-recap?user_email=' + userEmail).then(response => {
      //   setRecapData(response.data);
      // });

      WeeklyRecapHelper(userMetrics).then(data => {
        setRecapData(data);
      });

      axios
        .get('/api/alerts/recap')
        .then(response => {
          // Filter alerts based on user metrics
          const filteredAlerts = response.data.filter(alert =>
            userMetrics.includes(alert.metric)
          );
          setRecentAlerts(filteredAlerts);

          // Count alerts by metric
          const alertCount = filteredAlerts.reduce((count, alert) => {
            count[alert.metric] = (count[alert.metric] || 0) + 1;
            return count;
          }, {});
          setAlertCounts(alertCount);
        })
        .catch(error => {
          console.error('Error fetching alerts:', error);
        });
    } else {
      setIsMonday(false);
    }
  }, [userMetrics, userEmail]);

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

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      pt={statusOfAlerts ? '10px' : '74px'}
      px={4} // Add padding on the x-axis for better responsiveness
    >
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Heading>
          Recap for {weekStartDate} - {weekEndDate}
        </Heading>
      </Flex>

      {isMonday && (
        <Box mt={4} width="100%">
          {Object.keys(recapData).length === 0 ? (
            <Text>Loading weekly recap data...</Text>
          ) : (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 6 }} // Responsive columns
              spacing={4} // Space between grid items
            >
              {Object.keys(recapData).map(metric => {
                const { label, addSpace } = getLabelForMetric(recapData[metric]?.metric);
                return (
                  <Box
                    key={recapData[metric]?.metric}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="md"
                    bg="white"
                    _hover={{ shadow: 'lg' }} // Optional: Add hover effect
                    color={'black'}
                  >
                    <Heading size="md" mb={2} color={'black'} fontWeight="bold" textDecoration="underline">
                    {/* {recapData[metric]?.metric} */}
                    {metric}
                    </Heading>
                    <Text>
                      <strong>High:</strong> {recapData[metric]?.high}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text>
                      <strong>Low:</strong> {recapData[metric]?.low}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text>
                      <strong>Avg:</strong> {recapData[metric]?.avg}
                      {addSpace ? ' ' : ''}{label}
                    </Text>
                    <Text>
                      {/* <strong>Alerts:</strong> {recapData[metric]?.alert_count} */}
                      <strong>Alerts:</strong> {alertCounts[metric] || 0}
                    </Text>
                  </Box>
                );
              })}
            </SimpleGrid>
          )}
        </Box>
      )}
      {/* Display recent alerts */}
      {recentAlerts.length > 0 && (
        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg" shadow="md" bg="white" color={'black'}>
          <Heading size="md" color={'black'} fontWeight={'bold'} textDecoration={'underline'}>This Week's Alerts</Heading>
          {recentAlerts.map(alert => (
            <>
            <Text key={alert.id}>
              {alert.message}
            </Text>
            <Divider />
            </>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WeeklyRecap;
