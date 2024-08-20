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
  TabPanels,
  TabPanel,
  useBreakpointValue,
  IconButton,
  Tooltip,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
import { LineChart, BarChart } from '../../Charts/Charts.js';
import ChartWrapper from '../../Charts/ChartWrapper.js';
import {
  FaChessRook,
  FaChevronDown,
  FaTemperatureHigh,
  FaTint,
} from 'react-icons/fa';
import { RiLayoutGridFill } from 'react-icons/ri';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../../WeatherDataContext.js';
import { handleChartChange } from '../../Charts/ChartUtils.js';
import { motion } from 'framer-motion';
const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);
const MotionIconButton = motion(IconButton);

const MedDashboard = ({ timePeriod, statusOfAlerts }) => {
  const {
    weatherData,
    loading,
    handleTimePeriodChange,
    impriFreezerOneTempData,
    impriFreezerOneHumData,
    impriFreezerTwoTempData,
    impriFreezerTwoHumData,
    impriFreezerThreeTempData,
    impriFreezerThreeHumData,
    impriFridgeOneTempData,
    impriFridgeOneHumData,
    impriFridgeTwoTempData,
    impriFridgeTwoHumData,
    impriIncuOneTempData,
    impriIncuOneHumData,
    impriIncuTwoTempData,
    impriIncuTwoHumData,
    chartData,
  } = useWeatherData();

  const [imFreezerOneTempChartType, setImFreezerOneTempChartType] =
    useState('');
  const [imFreezerOneHumChartType, setImFreezerOneHumChartType] = useState('');
  const [imFreezerTwoTempChartType, setImFreezerTwoTempChartType] =
    useState('');
  const [imFreezerTwoHumChartType, setImFreezerTwoHumChartType] = useState('');
  const [imFreezerThreeTempChartType, setImFreezerThreeTempChartType] =
    useState('');
  const [imFreezerThreeHumChartType, setImFreezerThreeHumChartType] =
    useState('');
  const [imFridgeOneTempChartType, setImFridgeOneTempChartType] = useState('');
  const [imFridgeOneHumChartType, setImFridgeOneHumChartType] = useState('');
  const [imFridgeTwoTempChartType, setImFridgeTwoTempChartType] = useState('');
  const [imFridgeTwoHumChartType, setImFridgeTwoHumChartType] = useState('');
  const [imIncubatorOneTempChartType, setImIncubatorOneTempChartType] =
    useState('');
  const [imIncubatorOneHumChartType, setImIncubatorOneHumChartType] =
    useState('');
  const [imIncubatorTwoTempChartType, setImIncubatorTwoTempChartType] =
    useState('');
  const [imIncubatorTwoHumChartType, setImIncubatorTwoHumChartType] =
    useState('');
  const [chartLayout, setChartLayout] = useState(2);
  const [layoutStable, setLayoutStable] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReady, setIsReady] = useState(false);

  const [visibleCharts, setVisibleCharts] = useState({
    impriMed: [
      // 'Freezer #1 Temp', // UNCOMMENT TO SHOW ON PAGE LOAD AFTER SENSOR HAS BEEN FIXED
      // 'Freezer #1 Hum', // UNCOMMENT TO SHOW ON PAGE LOAD AFTER SENSOR HAS BEEN FIXED
      'Freezer #2 Temp',
      'Freezer #2 Hum',
      'Freezer #3 Temp',
      'Freezer #3 Hum',
      'Fridge #1 Temp',
      'Fridge #1 Hum',
      'Fridge #2 Temp',
      'Fridge #2 Hum',
      // 'Incubator #1 Temp', // UNCOMMENT TO SHOW ON PAGE LOAD AFTER SENSOR HAS BEEN FIXED
      // 'Incubator #1 Hum', // UNCOMMENT TO SHOW ON PAGE LOAD AFTER SENSOR HAS BEEN FIXED
      'Incubator #2 Temp',
      'Incubator #2 Hum',
    ],
  });

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const { colorMode } = useColorMode();

  const updateChartTypes = chartData => {
    chartData.forEach(chart => {
      switch (chart.metric) {
        case 'imFreezerOneTemp':
          setImFreezerOneTempChartType(chart.type);
          break;
        case 'imFreezerOneHum':
          setImFreezerOneHumChartType(chart.type);
          break;
        case 'imFreezerTwoTemp':
          setImFreezerTwoTempChartType(chart.type);
          break;
        case 'imFreezerTwoHum':
          setImFreezerTwoHumChartType(chart.type);
          break;
        case 'imFreezerThreeTemp':
          setImFreezerThreeTempChartType(chart.type);
          break;
        case 'imFreezerThreeHum':
          setImFreezerThreeHumChartType(chart.type);
          break;
        case 'imFridgeOneTemp':
          setImFridgeOneTempChartType(chart.type);
          break;
        case 'imFridgeOneHum':
          setImFridgeOneHumChartType(chart.type);
          break;
        case 'imFridgeTwoTemp':
          setImFridgeTwoTempChartType(chart.type);
          break;
        case 'imFridgeTwoHum':
          setImFridgeTwoHumChartType(chart.type);
          break;
        case 'imIncubatorOneTemp':
          setImIncubatorOneTempChartType(chart.type);
          break;
        case 'imIncubatorOneHum':
          setImIncubatorOneHumChartType(chart.type);
          break;
        case 'imIncubatorTwoTemp':
          setImIncubatorTwoTempChartType(chart.type);
          break;
        case 'imIncubatorTwoHum':
          setImIncubatorTwoHumChartType(chart.type);
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
    Temp: <FaTemperatureHigh />,
    Hum: <FaTint />,
  };

  // Function to extract the last word and return the correct icon
  const getChartIcon = chartName => {
    const lastWord = chartName.split(' ').pop(); // Extract the last word
    return charts[lastWord] || null; // Return the corresponding icon
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
    >
      <Tabs variant="soft-rounded" colorScheme="orange">
        <TabPanels>
          <MotionTabPanel
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            key="main-dashboard"
          >
            <Flex
              justifyContent={isLargerThan768 ? 'space-between' : 'center'}
              mb="2"
            >
              <Heading
                size={isLargerThan768 ? 'lg' : 'xl'}
                textDecoration={isLargerThan768 ? 'none' : 'underline'}
              >
                ImpriMed Dashboard
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
                    onClick={isOpen ? onClose : onOpen}
                    border={'2px solid #fd9801'}
                    size={isLargerThan768 ? 'md' : 'sm'}
                    ml={isLargerThan768 ? '0' : '4'}
                    mt={isLargerThan768 ? '0' : '1'}
                  >
                    <FaChevronDown />
                  </MenuButton>
                </Tooltip>
                <MenuList sx={{ bg: '#212121', border: '2px' }}>
                  {[
                    'Freezer #1 Temp',
                    'Freezer #1 Hum',
                    'Freezer #2 Temp',
                    'Freezer #2 Hum',
                    'Freezer #3 Temp',
                    'Freezer #3 Hum',
                    'Fridge #1 Temp',
                    'Fridge #1 Hum',
                    'Fridge #2 Temp',
                    'Fridge #2 Hum',
                    'Incubator #1 Temp',
                    'Incubator #1 Hum',
                    'Incubator #2 Temp',
                    'Incubator #2 Hum',
                  ].map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('impriMed', chart)}
                      bg={
                        visibleCharts.impriMed.includes(chart)
                          ? 'blue.100'
                          : '#212121'
                      }
                      color={
                        visibleCharts.impriMed.includes(chart)
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
                        {getChartIcon(chart)}
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
              {visibleCharts.impriMed.includes('Freezer #1 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImFreezerOneTempChartType
                    )}
                    weatherData={impriFreezerOneTempData}
                    metric="imFreezerOneTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #1 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerOneTempChartType}
                    
                  >
                    {imFreezerOneTempChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerOneTempData}
                        metric="imFreezerOneTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerOneTempData}
                        metric="imFreezerOneTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Freezer #1 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImFreezerOneHumChartType
                    )}
                    weatherData={impriFreezerOneHumData}
                    metric="imFreezerOneHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #1 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerOneHumChartType}
                  >
                    {imFreezerOneHumChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerOneHumData}
                        metric="imFreezerOneHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerOneHumData}
                        metric="imFreezerOneHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Freezer #2 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImFreezerTwoTempChartType
                    )}
                    weatherData={impriFreezerTwoTempData}
                    metric="imFreezerTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #2 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerTwoTempChartType}
                  >
                    {imFreezerTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerTwoTempData}
                        metric="imFreezerTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerTwoTempData}
                        metric="imFreezerTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Freezer #2 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImFreezerTwoHumChartType
                    )}
                    weatherData={impriFreezerTwoHumData}
                    metric="imFreezerTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #2 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerTwoHumChartType}
                  >
                    {imFreezerTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerTwoHumData}
                        metric="imFreezerTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerTwoHumData}
                        metric="imFreezerTwoHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Freezer #3 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImFreezerThreeTempChartType
                    )}
                    weatherData={impriFreezerThreeTempData}
                    metric="imFreezerThreeTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #3 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerThreeTempChartType}
                  >
                    {imFreezerThreeTempChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerThreeTempData}
                        metric="imFreezerThreeTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerThreeTempData}
                        metric="imFreezerThreeTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Freezer #3 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImFreezerThreeHumChartType
                    )}
                    weatherData={impriFreezerThreeHumData}
                    metric="imFreezerThreeHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Freezer #3 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imFreezerThreeHumChartType}
                  >
                    {imFreezerThreeHumChartType === 'line' ? (
                      <LineChart
                        data={impriFreezerThreeHumData}
                        metric="imFreezerThreeHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFreezerThreeHumData}
                        metric="imFreezerThreeHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Fridge #1 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImFridgeOneTempChartType
                    )}
                    weatherData={impriFridgeOneTempData}
                    metric="imFridgeOneTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Fridge #1 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imFridgeOneTempChartType}
                  >
                    {imFridgeOneTempChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeOneTempData}
                        metric="imFridgeOneTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeOneTempData}
                        metric="imFridgeOneTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Fridge #1 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImFridgeOneHumChartType
                    )}
                    weatherData={impriFridgeOneHumData}
                    metric="imFridgeOneHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Fridge #1 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imFridgeOneHumChartType}
                  >
                    {imFridgeOneHumChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeOneHumData}
                        metric="imFridgeOneHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeOneHumData}
                        metric="imFridgeOneHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Fridge #2 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImFridgeTwoTempChartType
                    )}
                    weatherData={impriFridgeTwoTempData}
                    metric="imFridgeTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Fridge #2 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imFridgeTwoTempChartType}
                  >
                    {imFridgeTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeTwoTempData}
                        metric="imFridgeTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeTwoTempData}
                        metric="imFridgeTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Fridge #2 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImFridgeTwoHumChartType
                    )}
                    weatherData={impriFridgeTwoHumData}
                    metric="imFridgeTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Fridge #2 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imFridgeTwoHumChartType}
                  >
                    {imFridgeTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriFridgeTwoHumData}
                        metric="imFridgeTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriFridgeTwoHumData}
                        metric="imFridgeTwoHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Incubator #1 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImIncubatorOneTempChartType
                    )}
                    weatherData={impriIncuOneTempData}
                    metric="imIncubatorOneTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Incubator #1 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imIncubatorOneTempChartType}
                  >
                    {imIncubatorOneTempChartType === 'line' ? (
                      <LineChart
                        data={impriIncuOneTempData}
                        metric="imIncubatorOneTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuOneTempData}
                        metric="imIncubatorOneTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Incubator #1 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImIncubatorOneHumChartType
                    )}
                    weatherData={impriIncuOneHumData}
                    metric="imIncubatorOneHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Incubator #1 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imIncubatorOneHumChartType}
                  >
                    {imIncubatorOneHumChartType === 'line' ? (
                      <LineChart
                        data={impriIncuOneHumData}
                        metric="imIncubatorOneHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuOneHumData}
                        metric="imIncubatorOneHum"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Incubator #2 Temp') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Temperature (°C)"
                    onChartChange={handleChartChange(
                      setImIncubatorTwoTempChartType
                    )}
                    weatherData={impriIncuTwoTempData}
                    metric="imIncubatorTwoTemp"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Incubator #2 Temp'}
                    chartLayout={chartLayout}
                    typeOfChart={imIncubatorTwoTempChartType}
                  >
                    {imIncubatorTwoTempChartType === 'line' ? (
                      <LineChart
                        data={impriIncuTwoTempData}
                        metric="imIncubatorTwoTemp"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuTwoTempData}
                        metric="imIncubatorTwoTemp"
                        style={{ flex: 1 }}
                      />
                    )}
                  </ChartWrapper>
                </GridItem>
              )}
              {visibleCharts.impriMed.includes('Incubator #2 Hum') && (
                <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                  <ChartWrapper
                    title="Humidity (%)"
                    onChartChange={handleChartChange(
                      setImIncubatorTwoHumChartType
                    )}
                    weatherData={impriIncuTwoHumData}
                    metric="imIncubatorTwoHum"
                    flex="1"
                    timePeriod={timePeriod}
                    display="flex"
                    flexDirection="column"
                    handleTimePeriodChange={handleTimePeriodChange}
                    toggleChartVisibility={toggleChartVisibility}
                    section={'impriMed'}
                    chart={'Incubator #2 Hum'}
                    chartLayout={chartLayout}
                    typeOfChart={imIncubatorTwoHumChartType}
                  >
                    {imIncubatorTwoHumChartType === 'line' ? (
                      <LineChart
                        data={impriIncuTwoHumData}
                        metric="imIncubatorTwoHum"
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <BarChart
                        data={impriIncuTwoHumData}
                        metric="imIncubatorTwoHum"
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
          </Flex>
        )}
          </MotionTabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MedDashboard;
