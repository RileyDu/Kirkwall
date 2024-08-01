import React, { useEffect, useState } from 'react';
import { CustomerSettings } from './CustomerSettings.js';
import { MetricSettings } from './MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { Box, useColorMode, useMediaQuery, Heading, Grid, GridItem, Divider } from '@chakra-ui/react';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import { m } from 'framer-motion';

const ModularDashboard = () => {
  const { currentUser } = useAuth();
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [metricSettings, setMetricSettings] = useState([]);
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

useEffect(() => {
    if (customerMetrics.length > 0) {
        const metricSettings = MetricSettings.filter(metric =>
            customerMetrics.includes(metric.metric)
        );
        if (metricSettings) {
        setMetricSettings(metricSettings);
        }
    }
}, [customerMetrics]);

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

        <div>
      {metricSettings.map(metric => (
        <>
        <p key={metric.id}>{metric.metric}</p>
        <p key={metric.id}>{metric.name}</p>
        <p key={metric.id}>{metric.unit}</p>
        <p key={metric.id}>{metric.color}</p>
        <p key={metric.id}>{metric.company}</p>
        <p key={metric.id}>{metric.sourceData}</p>
        <p key={metric.id}>{metric.soloData}</p>
        <Divider />
        </>
    ))}
    </div>

      {/* <Grid
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
      </Grid> */}
    </Box>
  );
};

export default ModularDashboard;
