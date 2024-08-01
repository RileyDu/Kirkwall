import React, { useEffect, useState } from 'react';
import { CustomerSettings } from './CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { Box, useColorMode, useMediaQuery, Heading, Grid, GridItem } from '@chakra-ui/react';
// import ChartWrapper from './ChartWrapper'; // Uncomment if used
// import LineChart from './LineChart'; // Import if not already
// import BarChart from './BarChart'; // Import if not already
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';

const ModularDashboard = () => {
  const { currentUser } = useAuth();
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const { colorMode } = useColorMode();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const statusOfAlerts = true; // Example default value; update as necessary
  const chartLayout = 2; // Example default value; update as necessary
  const tempData = []; // Example default value; update as necessary
  const weatherData = []; // Example default value; update as necessary
  const tempChartType = 'line'; // Example default value; update as necessary
  const timePeriod = 'week'; // Example default value; update as necessary

  useEffect(() => {
    if (currentUser) {
      const customer = CustomerSettings.find(
        customer => customer.email === currentUser.email
      );
      if (customer) {
        setCustomerMetrics(customer.metric);
      }
    }
  }, [currentUser]);

  const handleChartChange = (setChartType) => {
    // Define the function logic
  };

  const handleTimePeriodChange = () => {
    // Define the function logic
  };

  const toggleChartVisibility = () => {
    // Define the function logic
  };

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Heading size="lg" mb="4">
        Modular Dashboard
      </Heading>

      <Grid
        templateColumns={{
          base: '1fr',
          md: `repeat(${chartLayout}, 1fr)`,
          lg: `repeat(${chartLayout}, 1fr)`,
        }}
        gap="6"
      >
        {customerMetrics.map(metric => (
          <GridItem key={metric} colSpan={{ base: 1, lg: 1 }} display="flex">
            <ChartWrapper
              title="Temperature (°F)"
            //   onChartChange={handleChartChange}
            //   weatherData={tempData || weatherData}
              metric={metric}
              flex="1"
              timePeriod={timePeriod}
              display="flex"
              flexDirection="column"
            //   handleTimePeriodChange={handleTimePeriodChange}
            //   toggleChartVisibility={toggleChartVisibility}
              chart="temperature"
            //   chartLayout={chartLayout}
            >
              {tempChartType === 'line' ? (
                <LineChart
                  data={tempData || weatherData}
                  metric="temperature"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={tempData || weatherData}
                  metric="temperature"
                  style={{ flex: 1 }}
                />
              )}
            </ChartWrapper>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default ModularDashboard;
