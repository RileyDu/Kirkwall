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
  useBreakpointValue,
} from '@chakra-ui/react';
import { RiLayoutGridFill } from 'react-icons/ri/index.esm.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import ChartWrapper from '../Charts/ChartWrapper.js';
import {
  FaChessRook,
  FaChevronDown,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaWater,
  FaLeaf,
  FaCloudRain,
} from 'react-icons/fa/index.esm.js';
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
    chartData,
  } = useWeatherData();

  const [tempChartType, setTempChartType] = useState('');
  const [humidityChartType, setHumidityChartType] = useState('');
  const [windChartType, setWindChartType] = useState('');
  const [rainfallChartType, setRainfallChartType] = useState('');
  const [soilMoistureChartType, setSoilMoistureChartType] = useState('');
  const [leafWetnessChartType, setLeafWetnessChartType] = useState('');
  const [watchdogTempChartType, setWatchdogTempChartType] = useState('');
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] =
    useState('');
  const [rivercityTempChartType, setRivercityTempChartType] = useState('');
  const [rivercityHumChartType, setRivercityHumChartType] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [chartLayout, setChartLayout] = useState(2);
  const [layoutStable, setLayoutStable] = useState(true);
  const [visibleCharts, setVisibleCharts] = useState({
    // mainpage: ['temperature', 'humidity', 'wind', 'soilMoisture', 'leafWetness', 'rainfall'],
    grandFarm: ['temperature', 'humidity', 'wind', 'soil', 'leaf', 'rainfall'],
    garage: ['temperature', 'humidity'],
    rivercity: ['temperature', 'humidity'],
  });

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const MotionIconButton = motion(IconButton);
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const updateChartTypes = (chartData) => {
    chartData.forEach(chart => {
      switch (chart.metric) {
        case 'temperature':
          setTempChartType(chart.type);
          break;
        case 'percent_humidity':
          setHumidityChartType(chart.type);
          break;
        case 'wind_speed':
          setWindChartType(chart.type);
          break;
        case 'rain_15_min_inches':
          setRainfallChartType(chart.type);
          break;
        case 'soil_moisture':
          setSoilMoistureChartType(chart.type);
          break;
        case 'leaf_wetness':
          setLeafWetnessChartType(chart.type);
          break;
        case 'temp':
          setWatchdogTempChartType(chart.type);
          break;
        case 'hum':
          setWatchdogHumidityChartType(chart.type);
          break;
        case 'rctemp':
          setRivercityTempChartType(chart.type);
          break;
        case 'humidity':
          setRivercityHumChartType(chart.type);
          break;
        default:
          break;
      }
    });
  };

  useEffect(() => {
    if (chartData.length > 0) {
      updateChartTypes(chartData);
      // console.log('chartData:', chartData);
    }
  }, [chartData]);

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

  const toggleLayout = () => {
    if (chartLayout === 1) {
      setChartLayout(2);
    } else if (chartLayout === 2) {
      setChartLayout(3);
    } else {
      setChartLayout(1);
    }

    setLayoutStable(false);
    setTimeout(() => {
      setLayoutStable(true);
    }, 1);
  };

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
      // maxW={{ base: '100%', md: 'calc(100% - 70px)' }}
    >
      <Tabs variant="soft-rounded" colorScheme="orange">
        <TabList
          mb="6"
          justifyContent={isLargerThan768 ? 'flex-start' : 'space-evenly'}
        >
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
        <Divider mt={'-4'} w={'100%'} />
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
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.35 }}
                >
                  {isLargerThan768 && (
                  <Tooltip label="Toggle Layout">
                    <MotionIconButton
                      icon={<RiLayoutGridFill />}
                      variant="outline"
                      color="#212121"
                      size={iconSize}
                      bg={'brand.400'}
                      _hover={{ bg: 'brand.800' }}
                      onClick={toggleLayout}
                      border={'2px solid #fd9801'}
                      mr={2}
                    />
                  </Tooltip>
                  )}
                  <Tooltip label="Toggle Charts">
                    <MenuButton
                      as={Button}
                      bg="brand.400"
                      color="black"
                      _hover={{ bg: '#d7a247' }}
                      border={'2px solid #fd9801'}
                      onClick={isOpen ? onClose : onOpen}
                      size={isLargerThan768 ? 'md' : 'sm'}
                      ml={isLargerThan768 ? '2' : '4'}
                    >
                      <FaChevronDown />
                    </MenuButton>
                  </Tooltip>
                  <MenuList
                    placement="top"
                    bg={colorMode === 'light' ? '#212121' : 'black'}
                    border={'2px'}
                    borderColor={colorMode === 'light' ? '#212121' : 'black'}
                  >
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
                </motion.div>
              </Menu>
            </Flex>
            {layoutStable ? (
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
                    md: `repeat(${chartLayout}, 1fr)`,
                    lg: `repeat(${chartLayout}, 1fr)`,
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
                        chartLayout={chartLayout}
                        typeOfChart={tempChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={humidityChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={windChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={soilMoistureChartType}
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
                        onChartChange={handleChartChange(
                          setLeafWetnessChartType
                        )}
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
                        chartLayout={chartLayout}
                        typeOfChart={leafWetnessChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={rainfallChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={watchdogTempChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={watchdogHumidityChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={rivercityTempChartType}
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
                        chartLayout={chartLayout}
                        typeOfChart={rivercityHumChartType}
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
            ) : (
              <Flex justify="center" align="center" height="100%">
                {/* <Box
                  as={FaChessRook}
                  animation={`${spin} infinite 2s linear`}
                  fontSize="6xl"
                  color={getLogoColor()}
                /> */}
              </Flex>
            )}
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
                    typeOfChart={tempChartType}
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
                    typeOfChart={humidityChartType}
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
                    typeOfChart={windChartType}
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
                    typeOfChart={soilMoistureChartType}
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
                    typeOfChart={leafWetnessChartType}
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
                    typeOfChart={rainfallChartType}
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
                    typeOfChart={watchdogTempChartType}
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
                    typeOfChart={watchdogHumidityChartType}
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
                    typeOfChart={rivercityTempChartType}
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
                    typeOfChart={rivercityHumChartType}
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
