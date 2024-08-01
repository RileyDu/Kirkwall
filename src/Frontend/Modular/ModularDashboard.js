import React, { useEffect, useState } from 'react';
import { CustomerSettings } from './CustomerSettings.js';
import { MetricSettings } from './MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { Box, useColorMode, useMediaQuery, Heading, Grid, GridItem } from '@chakra-ui/react';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import { useWeatherData } from '../WeatherDataContext.js';

const chartComponents = {
  line: LineChart,
  bar: BarChart,
  // Add more chart types here as needed
};

const ModularDashboard = () => {
  const { currentUser } = useAuth();
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [metricSettings, setMetricSettings] = useState([]);
  const { colorMode } = useColorMode();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const statusOfAlerts = true; // Example default value; update as necessary
  const chartLayout = 2; // Example default value; update as necessary

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
        (customer) => customer.email === currentUser.email
      );
      if (customer) {
        setCustomerMetrics(customer.metric);
        setCustomerName(customer.name);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (customerMetrics.length > 0) {
      const selectedMetrics = MetricSettings.filter((metric) =>
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
        {customerName} Dashboard
      </Heading>

      <Grid
        templateColumns={{
          base: '1fr',
          md: `repeat(${chartLayout}, 1fr)`,
          lg: `repeat(${chartLayout}, 1fr)`,
        }}
        gap="6"
      >
        {customerMetrics.map((metric) => {
          const settingsOfMetric = metricSettings.find((m) => m.metric === metric);
          const title = settingsOfMetric ? settingsOfMetric.name : 'Metric Title';
          const dataForMetric = settingsOfMetric?.soloData;
          const chartDataForMetric = chartData.find((chart) => chart.metric === metric);
          const chartType = chartDataForMetric?.type || 'bar';

          // Ensure dataForMetric is pointing to the correct dataset, like tempData, humidityData, etc.
          let dataForChart;
          switch (dataForMetric) {
            case 'tempData':
              dataForChart = tempData || weatherData;
              break;
            case 'humidityData':
              dataForChart = humidityData || weatherData;
              break;
            case 'windData':
              dataForChart = windData || weatherData;
              break;
            case 'rainfallData':
              dataForChart = rainfallData || weatherData;
              break;
            case 'soilMoistureData':
              dataForChart = soilMoistureData || weatherData;
              break;
            case 'leafWetnessData':
              dataForChart = leafWetnessData || weatherData;
              break;
            case 'watchdogTempData':
              dataForChart = watchdogTempData || watchdogData;
              break;
            case 'watchdogHumData':
              dataForChart = watchdogHumData || watchdogData;
              break;
            case 'rivercityTempData':
              dataForChart = rivercityTempData || rivercityData;
              break;
            case 'rivercityHumData':
              dataForChart = rivercityHumData || rivercityData;
              break;
            default:
              dataForChart = weatherData;
          }
          

          // Access the appropriate chart component
          const ChartComponent = chartComponents[chartType] || LineChart;

          return (
            <GridItem key={metric} colSpan={{ base: 1, lg: 1 }} display="flex">
              <ChartWrapper
                title={title}
                metric={metric}
                flex="1"
                display="flex"
                flexDirection="column"
                chart="temperature"
                weatherData={dataForChart}
                handleTimePeriodChange={handleTimePeriodChange}
                // onChartChange={}
              >
                <ChartComponent
                  data={dataForChart}
                  metric={metric}
                  style={{ flex: 1 }}
                />
              </ChartWrapper>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ModularDashboard;
