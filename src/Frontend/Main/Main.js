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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook, FaChevronDown } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../WeatherDataContext';
import { handleChartChange } from '../Charts/ChartUtils';
import { motion } from 'framer-motion';
// import { useAuth } from '../AuthComponents/AuthContext.js';

const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);

const MainContent = ({ timePeriod, statusOfAlerts }) => {
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
    APIIDs
  } = useWeatherData();
  const [tempChartType, setTempChartType] = useState('bar');
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [soilMoistureChartType, setSoilMoistureChartType] = useState('bar');
  const [leafWetnessChartType, setLeafWetnessChartType] = useState('bar');
  const [watchdogTempChartType, setWatchdogTempChartType] = useState('bar');
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] = useState('bar');
  const [rivercityTempChartType, setRivercityTempChartType] = useState('bar');
  const [rivercityHumChartType, setRivercityHumChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const [showSections, setShowSections] = useState({
    grandFarm: true,
    garage: true,
    rivercity: true,
  });
  const { colorMode } = useColorMode();
  const iconColor = useColorModeValue('black', 'white');


  // const { currentUser } = useAuth();
  // // console.log('This is the current user: ', currentUser.email);

  // const doesUserHaveAPIAccess = () => {
  //   switch (currentUser.email) {
  //     case 'test@kirkwall.io':
  //       return 'ALL';
  //     case 'grandfarm@grandfarm.com':
  //     case 'pmo@grandfarm.com':
  //       return 'ACCESS_LEVEL_1';
  //     case 'jerrycromarty@imprimedicine.com':
  //       return 'ACCESS_LEVEL_2';
  //     default:
  //       return false;
  //   }
  // };
  
  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);
  
  const toggleSection = section => {
    setShowSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');
  
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
          color={getLogoColor()}
        />
      </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Tabs  variant="soft-rounded" colorScheme="orange">
        <TabList mb="6">
          <Tab color={colorMode === 'light' ? 'black' : 'white'} _selected={{ color: "white", bg: "orange.400" }}>Main Dashboard</Tab>
          <Tab color={colorMode === 'light' ? 'black' : 'white'}  _selected={{ color: "white", bg: "orange.400" }}>Grand Farm Sensors</Tab>
          <Tab color={colorMode === 'light' ? 'black' : 'white'}  _selected={{ color: "white", bg: "orange.400" }}>Garage Sensors</Tab>
          <Tab color={colorMode === 'light' ? 'black' : 'white'} _selected={{ color: "white", bg: "orange.400" }}>Freezer Sensors</Tab>
        </TabList>
        <TabPanels>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="main-dashboard"
          >
            <Flex justify="space-between" mb="6" alignItems="center">
              <Heading size="lg">Main Dashboard</Heading>
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
                  <MenuItem onClick={() => toggleSection('rivercity')}>
                    {showSections.rivercity ? 'Hide' : 'Show'} Freezer Sensors
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
              mb={showSections.grandFarm ? '8' : 0}
            >
              <Heading size="lg" textAlign="center" mb="4">
                Grand Farm Sensors
              </Heading>
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)',
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
                    title="Soil Moisture (centibar)"
                    onChartChange={handleChartChange(setSoilMoistureChartType)}
                    weatherData={soilMoistureData || weatherData}
                    metric="soil_moisture"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {soilMoistureChartType === 'line' ? (
                      <LineChart
                        data={soilMoistureData || weatherData}
                        metric="soil_moisture"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={soilMoistureData || weatherData}
                        metric="soil_moisture"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Leaf Wetness (0-15)"
                    onChartChange={handleChartChange(setLeafWetnessChartType)}
                    weatherData={leafWetnessData || weatherData}
                    metric="leaf_wetness"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {leafWetnessChartType === 'line' ? (
                      <LineChart
                        data={leafWetnessData || weatherData}
                        metric="leaf_wetness"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={leafWetnessData || weatherData}
                        metric="leaf_wetness"
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
              mb={8}
            >
              <Heading size="lg" textAlign="center" mb="4">
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
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showSections.rivercity ? 1 : 0,
                height: showSections.rivercity ? 'auto' : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Heading size="lg" textAlign="center" mb="4">
                Freezer Sensors
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
                    onChartChange={handleChartChange(setRivercityTempChartType)}
                    weatherData={rivercityTempData || rivercityData}
                    metric="rctemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {rivercityTempChartType === 'line' ? (
                      <LineChart
                        data={rivercityTempData || rivercityData}
                        metric="rctemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={rivercityTempData || rivercityData}
                        metric="rctemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(setRivercityHumChartType)}
                    weatherData={rivercityHumData || rivercityData}
                    metric="humidity"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                  >
                    {rivercityHumChartType === 'line' ? (
                      <LineChart
                        data={rivercityHumData || rivercityData}
                        metric="humidity"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={rivercityHumData || rivercityData}
                        metric="humidity"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              </Grid>
            </MotionBox>
          </MotionTabPanel>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="grand-farm-sensors"
          >
            <Heading size="lg" textAlign="center" mb="4">
              Grand Farm Sensors
            </Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
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
                  title="Soil Moisture (centibar)"
                  onChartChange={handleChartChange(setSoilMoistureChartType)}
                  weatherData={soilMoistureData || weatherData}
                  metric="soil_moisture"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {soilMoistureChartType === 'line' ? (
                    <LineChart
                      data={soilMoistureData || weatherData}
                      metric="soil_moisture"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={soilMoistureData || weatherData}
                      metric="soil_moisture"
                      style={{ flex: 1 }}
                    />
                  )}
                </ChartWrapper>
              </GridItem>
              <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                <ChartWrapper
                  title="Leaf Wetness (0-15)"
                  onChartChange={handleChartChange(setLeafWetnessChartType)}
                  weatherData={leafWetnessData || weatherData}
                  metric="leaf_wetness"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {leafWetnessChartType === 'line' ? (
                    <LineChart
                      data={leafWetnessData || weatherData}
                      metric="leaf_wetness"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={leafWetnessData || weatherData}
                      metric="leaf_wetness"
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
          </MotionTabPanel>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="garage-sensors"
          >
            <Heading size="lg" textAlign="center" mb="4">
              Garage Sensors
            </Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
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
          </MotionTabPanel>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="freezer-sensors"
          >
            <Heading size="lg" textAlign="center" mb="4">
              Freezer Sensors
            </Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap="6"
            >
              <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                <ChartWrapper
                  title="Temperature (°F)"
                  onChartChange={handleChartChange(setRivercityTempChartType)}
                  weatherData={rivercityTempData || rivercityData}
                  metric="rctemp"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {rivercityTempChartType === 'line' ? (
                    <LineChart
                      data={rivercityTempData || rivercityData}
                      metric="rctemp"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={rivercityTempData || rivercityData}
                      metric="rctemp"
                      style={{ flex: 1 }}
                    />
                  )}
                </ChartWrapper>
              </GridItem>
              <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                <ChartWrapper
                  title="Humidity (%)"
                  onChartChange={handleChartChange(setRivercityHumChartType)}
                  weatherData={rivercityHumData || rivercityData}
                  metric="humidity"
                  flex="1"
                  timePeriod={timePeriod}
                  display="flex"
                  flexDirection="column"
                  handleTimePeriodChange={handleTimePeriodChange}
                >
                  {rivercityHumChartType === 'line' ? (
                    <LineChart
                      data={rivercityHumData || rivercityData}
                      metric="humidity"
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <BarChart
                      data={rivercityHumData || rivercityData}
                      metric="humidity"
                      style={{ flex: 1 }}
                    />
                  )}
                </ChartWrapper>
              </GridItem>
            </Grid>
          </MotionTabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MainContent;
