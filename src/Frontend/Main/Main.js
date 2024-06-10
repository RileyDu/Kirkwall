import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';

const MainContent = ({ weatherData }) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, []);

  const handleTempChartChange = newType => {
    setTempChartType(newType);
  };

  const handleHumidityChartChange = newType => {
    setHumidityChartType(newType);
  };

  const handleWindChartChange = newType => {
    setWindChartType(newType);
  };

  const handleRainfallChartChange = newType => {
    setRainfallChartType(newType);
  };

  if (!isReady) {
    return (
      <Box bg="white" flex="1" p="4">
        
      </Box>
    );
  }

  return (
    <Box bg="white" flex="1" p="4">
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="6">
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Temperature Over Time (°F)"
            onChartChange={handleTempChartChange}
            data={weatherData}
            metric="temperature"
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" />
            ) : (
              <BarChart data={weatherData} metric="temperature" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Humidity Percentage Levels"
            onChartChange={handleHumidityChartChange}
            data={weatherData}
            metric="percent_humidity"
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleRainfallChartChange}
            data={weatherData}
            metric="rain_15_min_inches"
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Wind Speed (mph)"
            onChartChange={handleWindChartChange}
            data={weatherData}
            metric="wind_speed"
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
