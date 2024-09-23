import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, SimpleGrid } from '@chakra-ui/react';
import { SummaryMetrics } from '../Modular/SummaryMetrics.js';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { WeeklyRecapHelper } from './WeeklyRecapHelper.js';
import axios from 'axios';

const WeeklyRecap = ({ statusOfAlerts }) => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;
  const userMetrics =
    CustomerSettings.find(customer => customer.email === userEmail)?.metric ||
    [];

  const [isMonday, setIsMonday] = useState(false);
  const [recapData, setRecapData] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (dayOfWeek === 1) {
      // 1 represents Monday
      setIsMonday(true);
      console.log('Today is Monday! Fetching weekly recap data...');

      // Fetch the data and set it in the state
      WeeklyRecapHelper(userMetrics).then(data => {
        setRecapData(data);
      });
      axios
        .get('/api/alerts/recap')
        .then(response => {
          setRecentAlerts(response.data);
        })
        .catch(error => {
          console.error('Error fetching alerts:', error);
        });
    } else {
      setIsMonday(false);
    }
  }, [userMetrics]);

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
        <Heading>Weekly Recap</Heading>
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
                const { label, addSpace } = getLabelForMetric(metric);
                return (
                  <Box
                    key={metric}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="md"
                    bg="white"
                    _hover={{ shadow: 'lg' }} // Optional: Add hover effect
                  >
                    <Heading size="md" mb={2}>
                      {metric}
                    </Heading>
                    <Text>
                      <strong>High:</strong> {recapData[metric]?.high}
                      {addSpace ? ' ' : ''} {label}
                    </Text>
                    <Text>
                      <strong>Low:</strong> {recapData[metric]?.low}
                      {addSpace ? ' ' : ''} {label}
                    </Text>
                    <Text>
                      <strong>Avg:</strong> {recapData[metric]?.avg}
                      {addSpace ? ' ' : ''} {label}
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
        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
          <Heading size="md">Recent Alerts</Heading>
          {recentAlerts.map(alert => (
            <Text key={alert.id}>
              {alert.message} (at {new Date(alert.timestamp).toLocaleString()})
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WeeklyRecap;
