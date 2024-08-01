import React, { useEffect, useState } from 'react';
import { CustomerSettings } from './CustomerSettings.js';
import { MetricSettings } from './MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { Box, useColorMode, useMediaQuery, Heading, Grid, GridItem } from '@chakra-ui/react';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import { useWeatherData } from '../WeatherDataContext.js';

const ModularDashboard = () => {
  const { currentUser } = useAuth();
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [metricSettings, setMetricSettings] = useState([]);
  const { colorMode } = useColorMode();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const statusOfAlerts = true; // Example default value; update as necessary
  const chartLayout = 2; // Example default value; update as necessary
  const tempChartType = 'line'; // Example default value; update as necessary
  const timePeriod = '3H'; // Example default value; update as necessary

  const {
    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
    loading,
    handleTimePeriodChange,
    watchdogData,
    watchdogTempData,
    watchdogHumData,
    rivercityTempData,
    rivercityHumData,
    rivercityData,
    chartData,
  } = useWeatherData();

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
      const selectedMetrics = MetricSettings.filter(metric =>
        customerMetrics.includes(metric.metric)
      );
      if (selectedMetrics) {
        setMetricSettings(selectedMetrics);
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

      <Grid
        templateColumns={{
          base: '1fr',
          md: `repeat(${chartLayout}, 1fr)`,
          lg: `repeat(${chartLayout}, 1fr)`,
        }}
        gap="6"
      >
        {customerMetrics.map(metric => {
          const settingsOfMetric = metricSettings.find(m => m.metric === metric);
          const title = settingsOfMetric ? settingsOfMetric.name : 'Metric Title';
          const dataForMetric = settingsOfMetric?.soloData;

          // Ensure dataForMetric is pointing to the correct dataset, like tempData, humidityData, etc.
          let chartData;
          switch (dataForMetric) {
            case 'tempData':
              chartData = tempData || weatherData;
              break;
            case 'humidityData':
              chartData = humidityData || weatherData;
              break;
            case 'windData':
              chartData = windData || weatherData;
              break;
            case 'rainfallData':
              chartData = rainfallData || weatherData;
              break;
            case 'soilMoistureData':
              chartData = soilMoistureData || weatherData;
              break;
            case 'leafWetnessData':
              chartData = leafWetnessData || weatherData;
              break;
            case 'watchdogTempData':
              chartData = watchdogTempData || watchdogData;
              break;
            case 'watchdogHumData':
              chartData = watchdogHumData || watchdogData;
              break;
            case 'rivercityTempData':
              chartData = rivercityTempData || rivercityData;
              break;
            case 'rivercityHumData':
              chartData = rivercityHumData || rivercityData;
              break;
            default:
              chartData = weatherData;
          }

          return (
            <GridItem key={metric} colSpan={{ base: 1, lg: 1 }} display="flex">
              <ChartWrapper
                title={title}
                metric={metric}
                flex="1"
                timePeriod={timePeriod}
                display="flex"
                flexDirection="column"
                chart="temperature"
              >
                {tempChartType === 'line' ? (
                  <LineChart
                    data={chartData}
                    metric={metric}
                    style={{ flex: 1 }}
                  />
                ) : (
                  <BarChart
                    data={chartData}
                    metric={metric}
                    style={{ flex: 1 }}
                  />
                )}
              </ChartWrapper>
              <p>{}</p>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ModularDashboard;
