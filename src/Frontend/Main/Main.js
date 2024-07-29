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
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts.js';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { FaChessRook, FaChevronDown, FaPlus, FaMinus, FaTemperatureHigh, FaTint, FaWind, FaWater, FaLeaf, FaCloudRain } from 'react-icons/fa/index.esm.js';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../WeatherDataContext.js';
import { handleChartChange } from '../Charts/ChartUtils.js';
import { motion } from 'framer-motion';

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
    APIIDs,
  } = useWeatherData();

  const [tempChartType, setTempChartType] = useState('bar');
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [soilMoistureChartType, setSoilMoistureChartType] = useState('bar');
  const [leafWetnessChartType, setLeafWetnessChartType] = useState('bar');
  const [watchdogTempChartType, setWatchdogTempChartType] = useState('bar');
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] =
    useState('bar');
  const [rivercityTempChartType, setRivercityTempChartType] = useState('bar');
  const [rivercityHumChartType, setRivercityHumChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const [visibleCharts, setVisibleCharts] = useState({
    // mainpage: ['temperature', 'humidity', 'wind', 'soilMoisture', 'leafWetness', 'rainfall'],
    grandFarm: [
      'temperature',
      'humidity',
      'wind',
      'soil',
      'leaf',
      'rainfall',
    ],
    garage: ['temperature', 'humidity'],
    rivercity: ['temperature', 'humidity'],
  });

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const toggleChartVisibility = (section, chart) => {
    setVisibleCharts(prevState => {
      const newSectionCharts = prevState[section].includes(chart)
        ? prevState[section].filter(item => item !== chart)
        : [...prevState[section], chart];
      return { ...prevState, [section]: newSectionCharts };
    });
  };

  const handleMenuItemClick = (location, chart) => {
    toggleChartVisibility(location, chart);
    onOpen(); // Reopen the menu after the user action
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

  const charts = {
    temperature: <FaTemperatureHigh />,
    humidity: <FaTint />,
    wind: <FaWind />,
    soil: <FaWater />,
    leaf: <FaLeaf />,
    rainfall: <FaCloudRain />,
  };

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? "calc(100% - 70px)" : "100%"}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Tabs variant="soft-rounded" colorScheme="orange">
        <TabList mb="6" justifyContent={isLargerThan768 ? 'flex-start' : 'space-evenly'}>
          <Tab
            fontSize={{ base: 'sm', md: 'md' }}
            color={colorMode === 'light' ? 'black' : 'white'}
            _selected={{ color: 'white', bg: 'orange.400' }}
          >
            Main
          </Tab>
          <Tab
            fontSize={{ base: 'sm', md: 'md' }}
            color={colorMode === 'light' ? 'black' : 'white'}
            _selected={{ color: 'white', bg: 'orange.400' }}
          >
            Grand Farm
          </Tab>
          <Tab
            fontSize={{ base: 'sm', md: 'md' }}
            color={colorMode === 'light' ? 'black' : 'white'}
            _selected={{ color: 'white', bg: 'orange.400' }}
          >
            Garage
          </Tab>
          <Tab
            fontSize={{ base: 'sm', md: 'md' }}
            color={colorMode === 'light' ? 'black' : 'white'}
            _selected={{ color: 'white', bg: 'orange.400' }}
          >
            Freezer
          </Tab>
        </TabList>
        <Divider mt={'-4'} w={'100%'}/>
        <TabPanels>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="main-dashboard"
          >
            <Flex justify={isLargerThan768 ? 'space-between' : 'center'}>
              <Heading size="lg" mb="4">
                Main Dashboard
              </Heading>
              <Menu isOpen={isOpen}>
                <Tooltip label="Toggle Charts">
                <MenuButton
                  as={Button}
                  bg="brand.400"
                  color="black"
                  _hover={{ bg: '#d7a247' }}
                  onClick={isOpen ? onClose : onOpen}
                  size={isLargerThan768 ? 'md' : 'sm'}
                  ml={isLargerThan768 ? '2' : '4'}
                >
                  <FaChevronDown />
                </MenuButton>
                  </Tooltip>
                <MenuList placement="top"  bg={colorMode === "light" ? '#212121' : "black"} border={'2px'} borderColor={colorMode === "light" ? '#212121' : "black"}>
                  {Object.keys(charts).map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => handleMenuItemClick('grandFarm', chart)}
                      bg={
                        visibleCharts.grandFarm.includes(chart)
                          ? 'green.100'
                          : '#212121'
                      }
                      color={
                        visibleCharts.grandFarm.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                      border={'1px solid #212121'}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                  {['temperature', 'humidity'].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => handleMenuItemClick('garage', chart)}
                      bg={
                        visibleCharts.garage.includes(chart)
                          ? 'brand.200'
                          : '#212121'
                      }
                      color={
                        visibleCharts.garage.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                      border={'1px solid #212121'}

                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                  {['temperature', 'humidity'].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => handleMenuItemClick('rivercity', chart)}
                      bg={
                        visibleCharts.rivercity.includes(chart)
                          ? 'blue.100'
                          : '#212121'
                      }
                      color={
                        visibleCharts.rivercity.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                      border={'1px solid #212121'}
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              transition={{ duration: 0.5 }}
              mb={'8'}
            >
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                }}
                gap="6"
              >
                {visibleCharts.grandFarm.includes('temperature') && (
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
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="temperature"
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
                )}
                {visibleCharts.grandFarm.includes('humidity') && (
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
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="humidity"
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
                )}
                {visibleCharts.grandFarm.includes('wind') && (
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
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="wind"
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
                )}
                {visibleCharts.grandFarm.includes('soil') && (
                  <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Soil Moisture (centibar)"
                      onChartChange={handleChartChange(
                        setSoilMoistureChartType
                      )}
                      weatherData={soilMoistureData || weatherData}
                      metric="soil_moisture"
                      flex="1"
                      timePeriod={timePeriod}
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="soil"
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
                )}
                {visibleCharts.grandFarm.includes('leaf') && (
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
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="leaf"
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
                )}
                {visibleCharts.grandFarm.includes('rainfall') && (
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
                      toggleChartVisibility={toggleChartVisibility}
                      section="grandFarm"
                      chart="rainfall"
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
                )}
                {visibleCharts.garage.includes('temperature') && (
                  <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Temperature (°F)"
                      onChartChange={handleChartChange(
                        setWatchdogTempChartType
                      )}
                      weatherData={watchdogTempData || watchdogData}
                      metric="temp"
                      flex="1"
                      timePeriod={timePeriod}
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                      toggleChartVisibility={toggleChartVisibility}
                      section="garage"
                      chart="temperature"
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
                )}
                {visibleCharts.garage.includes('humidity') && (
                  <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Humidity (%)"
                      onChartChange={handleChartChange(
                        setWatchdogHumidityChartType
                      )}
                      weatherData={watchdogHumData || watchdogData}
                      metric="hum"
                      flex="1"
                      timePeriod={timePeriod}
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                      toggleChartVisibility={toggleChartVisibility}
                      section="garage"
                      chart="humidity"
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
                )}
                {visibleCharts.rivercity.includes('temperature') && (
                  <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Temperature (°F)"
                      onChartChange={handleChartChange(
                        setRivercityTempChartType
                      )}
                      weatherData={rivercityTempData || rivercityData}
                      metric="rctemp"
                      flex="1"
                      timePeriod={timePeriod}
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                      toggleChartVisibility={toggleChartVisibility}
                      section="rivercity"
                      chart="temperature"
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
                )}
                {visibleCharts.rivercity.includes('humidity') && (
                  <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Humidity (%)"
                      onChartChange={handleChartChange(
                        setRivercityHumChartType
                      )}
                      weatherData={rivercityHumData || rivercityData}
                      metric="humidity"
                      flex="1"
                      timePeriod={timePeriod}
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                      toggleChartVisibility={toggleChartVisibility}
                      section="rivercity"
                      chart="humidity"
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
                )}
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
            <Flex justify="space-between">
              <Heading size="lg" textAlign="center" mb="4">
                Grand Farm Sensors
              </Heading>
              <Menu isOpen={isOpen}>
                <MenuButton
                  as={Button}
                  bg="brand.400"
                  color="black"
                  _hover={{ bg: '#d7a247' }}
                  onClick={isOpen ? onClose : onOpen}
                >
                  <FaChevronDown />
                </MenuButton>
                <MenuList sx={{ bg: '#212121', border: '2px' }}>
                  {Object.keys(charts).map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('grandFarm', chart)}
                      bg={
                        visibleCharts.grandFarm.includes(chart)
                          ? 'brand.50'
                          : '#212121'
                      }
                      color={
                        visibleCharts.grandFarm.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {visibleCharts.grandFarm.includes(chart)
                            ? 'Hide'
                            : 'Show'}{' '}
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              gap="6"
            >
              {visibleCharts.grandFarm.includes('temperature') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="temperature"
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
              )}
              {visibleCharts.grandFarm.includes('humidity') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="humidity"
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
              )}
              {visibleCharts.grandFarm.includes('wind') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="wind"
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
              )}
              {visibleCharts.grandFarm.includes('soil') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="soil"
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
              )}
              {visibleCharts.grandFarm.includes('leaf') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="leaf"
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
              )}
              {visibleCharts.grandFarm.includes('rainfall') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="grandFarm"
                    chart="rainfall"
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
              )}
            </Grid>
          </MotionTabPanel>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="garage-sensors"
          >
            <Flex justify="space-between">
              <Heading size="lg" textAlign="center" mb="4">
                Garage Sensors
              </Heading>
              <Menu isOpen={isOpen}>
                <MenuButton
                  as={Button}
                  bg="brand.400"
                  color="black"
                  _hover={{ bg: '#d7a247' }}
                  onClick={isOpen ? onClose : onOpen}
                >
                  <FaChevronDown />
                </MenuButton>
                <MenuList placement="top" sx={{ bg: '#212121', border: '2px' }}>
                  {['temperature', 'humidity'].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('garage', chart)}
                      bg={
                        visibleCharts.garage.includes(chart)
                          ? 'brand.50'
                          : '#212121'
                      }
                      color={
                        visibleCharts.garage.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {visibleCharts.garage.includes(chart)
                            ? 'Hide'
                            : 'Show'}{' '}
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              gap="6"
            >
              {visibleCharts.garage.includes('temperature') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="garage"
                    chart="temperature"
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
              )}
              {visibleCharts.garage.includes('humidity') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setWatchdogHumidityChartType
                    )}
                    weatherData={watchdogHumData || watchdogData}
                    metric="hum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section="garage"
                    chart="humidity"
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
              )}
            </Grid>
          </MotionTabPanel>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="freezer-sensors"
          >
            <Flex justify="space-between">
              <Heading size="lg" textAlign="center" mb="4">
                Freezer Sensors
              </Heading>
              <Menu isOpen={isOpen}>
                <MenuButton
                  as={Button}
                  bg="brand.400"
                  color="black"
                  _hover={{ bg: '#d7a247' }}
                  onClick={isOpen ? onClose : onOpen}
                >
                  <FaChevronDown />
                </MenuButton>
                <MenuList sx={{ bg: '#212121', border: '2px' }}>
                  {['temperature', 'humidity'].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('rivercity', chart)}
                      bg={
                        visibleCharts.rivercity.includes(chart)
                          ? 'brand.50'
                          : '#212121'
                      }
                      color={
                        visibleCharts.rivercity.includes(chart)
                          ? '#212121'
                          : 'white'
                      }
                    >
                      <Flex
                        alignItems="center"
                        justifyContent={'center'}
                        w={'100%'}
                      >
                        {charts[chart]}
                        <Box ml="2">
                          {visibleCharts.rivercity.includes(chart)
                            ? 'Hide'
                            : 'Show'}{' '}
                          {chart.charAt(0).toUpperCase() + chart.slice(1)}
                        </Box>
                      </Flex>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              gap="6"
            >
              {visibleCharts.rivercity.includes('temperature') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="rivercity"
                    chart="temperature"
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
              )}
              {visibleCharts.rivercity.includes('humidity') && (
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
                    toggleChartVisibility={toggleChartVisibility}
                    section="rivercity"
                    chart="humidity"
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
              )}
            </Grid>
          </MotionTabPanel>
        </TabPanels>
      </Tabs>
      {/* <VoiceControl onCommand={handleVoiceCommand} />
      {isModalOpen && (
        <ChartExpandModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`${modalChart.charAt(0).toUpperCase() + modalChart.slice(1)} Chart`}
          weatherData={weatherData}
          metric={modalChart}
          onChartChange={(type) => {
            switch (modalChart) {
              case 'temperature':
                setTempChartType(type);
                break;
              case 'humidity':
                setHumidityChartType(type);
                break;
              case 'wind':
                setWindChartType(type);
                break;
              case 'soilMoisture':
                setSoilMoistureChartType(type);
                break;
              case 'leafWetness':
                setLeafWetnessChartType(type);
                break;
              case 'rainfall':
                setRainfallChartType(type);
                break;
              default:
                break;
            }
          }}
          handleTimePeriodChange={handleTimePeriodChange}
          currentTimePeriod={currentTimePeriod}
          setCurrentTimePeriod={setCurrentTimePeriod}
          sensorMap="grandfarm"
        />
      )} */}
    </Box>
  );
};

export default MainContent;
