import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const MainContent = ({
  weatherData,
  isMinimized,
  timePeriod,
  adjustTimePeriod,
}) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, [isMinimized]);

  const handleChartChange = setChartType => newType => {
    setChartType(newType);
  };

  const spin = keyframes`
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    `;

  if (!isReady) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color="black"
        />
      </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt="74px" // Adjust this value based on your header height
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap="6"
        flex="1"
      >
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Temperature (°F)"
            onChartChange={handleChartChange(setTempChartType)}
            weatherData={weatherData}
            metric="temperature"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={tempChartType} // Add this key to ensure re-render
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="temperature" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Humidity (%)"
            onChartChange={handleChartChange(setHumidityChartType)}
            weatherData={weatherData}
            metric="percent_humidity"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={humidityChartType} // Add this key to ensure re-render
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={rainfallChartType} // Add this key to ensure re-render
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Wind Speed (MPH)"
            onChartChange={handleChartChange(setWindChartType)}
            weatherData={weatherData}
            metric="wind_speed"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={windChartType} // Add this key to ensure re-render
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
