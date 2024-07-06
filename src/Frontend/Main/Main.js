import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex, Button, Heading } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../WeatherDataContext'; // Adjust the import based on your file structure
import { handleChartChange } from '../Charts/ChartUtils';
import { motion } from 'framer-motion'; // Import Framer Motion
import MiniMap from '../Maps/MiniMap';

const MotionBox = motion(Box);

const MainContent = ({ timePeriod }) => {
  const {
    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    loading,
    handleTimePeriodChange,
    watchdogData,
    watchdogTempData,
    watchdogHumData,
  } = useWeatherData();

  const [tempChartType, setTempChartType] = useState('bar');
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [watchdogTempChartType, setWatchdogTempChartType] = useState('bar');
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const [showGrandFarm, setShowGrandFarm] = useState(true);
  const [showGarage, setShowGarage] = useState(true);
  const { colorMode } = useColorMode();

    // State to manage which charts have maps enabled
    const [showTempMap, setShowTempMap] = useState(false);
    const [showHumidityMap, setShowHumidityMap] = useState(false);
    const [showWindMap, setShowWindMap] = useState(false);
    const [showRainfallMap, setShowRainfallMap] = useState(false);
    const [showWatchdogTempMap, setShowWatchdogTempMap] = useState(false);
    const [showWatchdogHumidityMap, setShowWatchdogHumidityMap] = useState(false);

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
      {/* Grand Farm Sensors Section */}
      <Box display="flex" justifyContent="space-evenly">
      <Button onClick={() => setShowGrandFarm(!showGrandFarm)} variant={'pill'} size={'md'}>
        {showGrandFarm ? 'Hide Grand Farm Sensors' : 'Show Grand Farm Sensors'}
      </Button>
      <Button onClick={() => setShowGarage(!showGarage)}  variant={'pill'} size={'md'}>
        {showGarage ? 'Hide Garage Sensors' : 'Show Garage Sensors'}
      </Button>
      </Box>
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showGrandFarm ? 1 : 0, height: showGrandFarm ? 'auto' : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="xl" textAlign={'center'} mb={'4'}>
          Grand Farm Sensors
        </Heading>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap="6"
        >
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
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
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
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
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
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
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
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
      </MotionBox>

      {/* Garage Sensors Section */}
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: showGarage ? 1 : 0, height: showGarage ? 'auto' : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="xl" textAlign={'center'} my={'4'} mt={'8'}>
          Garage Sensors
        </Heading>
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)' }}
          gap="6"
        >
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
            <ChartWrapper
              title="Temperature (°F)"
              onChartChange={handleChartChange(setWatchdogTempChartType)}
              weatherData={watchdogTempData || watchdogData}
              metric="temp"
              flex="1"
              timePeriod={timePeriod}
              display="flex"
              flexDirection="column"
              handleTimePeriodChange={handleTimePeriodChange}
            >
              {watchdogTempChartType === 'line' ? (
                <LineChart data={watchdogTempData || watchdogData} metric="temp" style={{ flex: 1 }} />
              ) : (
                <BarChart data={watchdogTempData || watchdogData} metric="temp" style={{ flex: 1 }} />
              )}
            </ChartWrapper>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
            <ChartWrapper
              title="Humidity (%)"
              onChartChange={handleChartChange(setWatchdogHumidityChartType)}
              weatherData={watchdogHumData || watchdogData}
              metric="hum"
              flex="1"
              timePeriod={timePeriod}
              display="flex"
              flexDirection="column"
              handleTimePeriodChange={handleTimePeriodChange}
            >
              {watchdogHumidityChartType === 'line' ? (
                <LineChart data={watchdogHumData || watchdogData} metric="hum" style={{ flex: 1 }} />
              ) : (
                <BarChart data={watchdogHumData || watchdogData} metric="hum" style={{ flex: 1 }} />
              )}
            </ChartWrapper>
          </GridItem>
        </Grid>
      </MotionBox>
      {/* <MapComponent /> */}
    </Box>
  );
};

export default MainContent;
