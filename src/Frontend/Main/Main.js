// MainContent.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../WeatherDataContext'; // Adjust the import based on your file structure
import { handleChartChange } from '../Charts/ChartUtils';

const MainContent = ({ timePeriod }) => {
  const {
    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    loading,
    handleTimePeriodChange,
    watchdogData
  } = useWeatherData();

  const [tempChartType, setTempChartType] = useState('bar');
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  if (loading) {
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
      pt="74px"
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
            weatherData={tempData || weatherData}
            metric="temperature"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {tempChartType === 'line' ? (
              <LineChart data={tempData || weatherData} metric="temperature" style={{ flex: 1 }} />
            ) : (
              <BarChart data={tempData || weatherData} metric="temperature" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Humidity (%)"
            onChartChange={handleChartChange(setHumidityChartType)}
            weatherData={humidityData || weatherData}
            metric="percent_humidity"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {humidityChartType === 'line' ? (
              <LineChart data={humidityData || weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            ) : (
              <BarChart data={humidityData || weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Wind (mph)"
            onChartChange={handleChartChange(setWindChartType)}
            weatherData={windData || weatherData}
            metric="wind_speed"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {windChartType === 'line' ? (
              <LineChart data={windData || weatherData} metric="wind_speed" style={{ flex: 1 }} />
            ) : (
              <BarChart data={windData || weatherData} metric="wind_speed" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Rainfall (in)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={rainfallData || weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            ) : (
              <BarChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Rainfall (in)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={rainfallData || weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            ) : (
              <BarChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
