import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  useColorMode,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook, FaChevronDown } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../WeatherDataContext';
import { handleChartChange } from '../Charts/ChartUtils';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const MainContent = ({ timePeriod, statusOfAlerts }) => {
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
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] =
    useState('bar');
  const [isReady, setIsReady] = useState(false);
  const [showSections, setShowSections] = useState({
    grandFarm: true,
    garage: true,
  });
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

  const toggleSection = section => {
    setShowSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

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
      pt={statusOfAlerts ? "10px" : "74px"}
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      
      <Flex justify="space-between" mb="4" alignItems="center">
        <Heading size="xl">Dashboard</Heading>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FaChevronDown />}
            bg="brand.400"
            color="black"
            _hover={{ bg: '#d7a247' }}
          >
            Toggle Sections
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => toggleSection('grandFarm')}>
              {showSections.grandFarm ? 'Hide' : 'Show'} Grand Farm Sensors
            </MenuItem>
            <MenuItem onClick={() => toggleSection('garage')}>
              {showSections.garage ? 'Hide' : 'Show'} Garage Sensors
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showSections.grandFarm ? 1 : 0,
          height: showSections.grandFarm ? 'auto' : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="lg" textAlign="center" mb="4">
          Grand Farm Sensors
        </Heading>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
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
                <LineChart
                  data={humidityData || weatherData}
                  metric="percent_humidity"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={humidityData || weatherData}
                  metric="percent_humidity"
                  style={{ flex: 1 }}
                />
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
                <LineChart
                  data={windData || weatherData}
                  metric="wind_speed"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={windData || weatherData}
                  metric="wind_speed"
                  style={{ flex: 1 }}
                />
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
                <LineChart
                  data={rainfallData || weatherData}
                  metric="rain_15_min_inches"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={rainfallData || weatherData}
                  metric="rain_15_min_inches"
                  style={{ flex: 1 }}
                />
              )}
            </ChartWrapper>
          </GridItem>
        </Grid>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showSections.garage ? 1 : 0,
          height: showSections.garage ? 'auto' : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <Heading size="lg" textAlign="center" my="4" mt="8">
          Garage Sensors
        </Heading>
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(2, 1fr)',
          }}
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
                <LineChart
                  data={watchdogTempData || watchdogData}
                  metric="temp"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={watchdogTempData || watchdogData}
                  metric="temp"
                  style={{ flex: 1 }}
                />
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
                <LineChart
                  data={watchdogHumData || watchdogData}
                  metric="hum"
                  style={{ flex: 1 }}
                />
              ) : (
                <BarChart
                  data={watchdogHumData || watchdogData}
                  metric="hum"
                  style={{ flex: 1 }}
                />
              )}
            </ChartWrapper>
          </GridItem>
        </Grid>
      </MotionBox>
    </Box>
  );
};

export default MainContent;