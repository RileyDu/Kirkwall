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
  IconButton,
  Tooltip,
  useMediaQuery,
  useDisclosure,
} from '@chakra-ui/react';
// import VoiceControl from '../../services/VoiceControl';
import { LineChart, BarChart } from '../../Charts/Charts.js';
// import Logout from '../../Frontend/AuthComponents/Logout';
import { auth } from '../../../Backend/Firebase.js';
import ChartWrapper from '../../Charts/ChartWrapper.js';
import {
  FaChessRook,
  FaChevronDown,
  FaPlus,
  FaMinus,
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaWater,
  FaLeaf,
  FaCloudRain,
} from 'react-icons/fa/index.esm.js';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../../WeatherDataContext.js';
import { handleChartChange } from '../../Charts/ChartUtils.js';
import { motion } from 'framer-motion';
// import { useAuth } from '../AuthComponents/AuthContext.js';
// import ChartExpandModal from '../../Charts/ChartExpandModal';

const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);

const GrandFarmDashboard = ({ timePeriod, statusOfAlerts }) => {
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
  } = useWeatherData();

  const [tempChartType, setTempChartType] = useState('bar');
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [soilMoistureChartType, setSoilMoistureChartType] = useState('bar');
  const [leafWetnessChartType, setLeafWetnessChartType] = useState('bar');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReady, setIsReady] = useState(false);

  const [visibleCharts, setVisibleCharts] = useState({
    grandFarm: [
      'temperature',
      'humidity',
      'wind',
      'soil',
      'leaf',
      'rainfall',
    ],
  });

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChart, setModalChart] = useState('');
  const [currentTimePeriod, setCurrentTimePeriod] = useState('1H');

  const { colorMode } = useColorMode();
  const iconColor = useColorModeValue('black', 'white');


  const showChart = (section, chart) => {
    setVisibleCharts(prevState => ({
      ...prevState,
      [section]: [...prevState[section], chart],
    }));
  };

  const hideChart = (section, chart) => {
    setVisibleCharts(prevState => ({
      ...prevState,
      [section]: prevState[section].filter(item => item !== chart),
    }));
  };

  const handleVoiceCommand = command => {
    
    if (command.includes('show temperature')) {
      showChart('grandFarm', 'temperature');
    } else if (command.includes('hide temperature')) {
      hideChart('grandFarm', 'temperature');
    } else if (command.includes('show humidity')) {
      showChart('grandFarm', 'humidity');
    } else if (command.includes('hide humidity')) {
      hideChart('grandFarm', 'humidity');
    } else if (command.includes('show wind')) {
      showChart('grandFarm', 'wind');
    } else if (command.includes('hide wind')) {
      hideChart('grandFarm', 'wind');
    } else if (command.includes('show soil moisture')) {
      showChart('grandFarm', 'soilMoisture');
    } else if (command.includes('hide soil moisture')) {
      hideChart('grandFarm', 'soilMoisture');
    } else if (command.includes('show leaf wetness')) {
      showChart('grandFarm', 'leafWetness');
    } else if (command.includes('hide leaf wetness')) {
      hideChart('grandFarm', 'leafWetness');
    } else if (command.includes('show rainfall')) {
      showChart('grandFarm', 'rainfall');
    } else if (command.includes('hide rainfall')) {
      hideChart('grandFarm', 'rainfall');
    } else if (command.includes('expand temperature details')) {
      openModal('temperature');
    } else if (command.includes('expand humidity details')) {
      openModal('percent_humidity');
    } else if (command.includes('expand wind details')) {
      openModal('wind_speed');
    } else if (command.includes('expand soil moisture details')) {
      openModal('soil_moisture');
    } else if (command.includes('expand leaf wetness details')) {
      openModal('leaf_wetness');
    } else if (command.includes('expand rainfall details')) {
      openModal('rain_15_min_inches');
    } else if (command.includes('log out')) {
      logOut();
    } else if (command.includes('change temperature chart type to line')) {
      setTempChartType('line');
    } else if (command.includes('change temperature chart type to bar')) {
      setTempChartType('bar');
    } else if (command.includes('change humidity chart type to line')) {
      setHumidityChartType('line');
    } else if (command.includes('change humidity chart type to bar')) {
      setHumidityChartType('bar');
    } else {
      console.log('Command not recognized');
    }
  };

  const openModal = chart => {
    setModalChart(chart);
    setIsModalOpen(true);
  };

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('User logged out');
        // Additional logout logic if needed
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalChart('');
  };

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

  const ChartToggleButton = ({ isVisible, onClick, chart, icon }) => (
    <Tooltip label={isVisible ? `Hide ${chart}` : `Show ${chart}`}>
      <IconButton
        icon={isVisible ? <FaMinus /> : <FaPlus />}
        onClick={onClick}
        mx="1"
        bg={isVisible ? 'red.400' : 'green.400'}
        color="white"
        _hover={{ bg: isVisible ? 'red.500' : 'green.500' }}
        size="sm"
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${chart}`}
      />
    </Tooltip>
  );

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
                Grand Farm Dashboard
              </Heading>
              <Menu isOpen={isOpen}>
                <Tooltip label="Toggle Charts">
                  <MenuButton
                    as={Button}
                    onClick={isOpen ? onClose : onOpen}
                    size={isLargerThan768 ? 'md' : 'sm'}
                    ml={isLargerThan768 ? '0' : '4'}
                    bg="brand.400"
                    color="black"
                    _hover={{ bg: '#d7a247' }}
                  >
                    <FaChevronDown />
                  </MenuButton>
                </Tooltip>
                <MenuList sx={{ bg: '#212121', border: '2px' }}>
                  {Object.keys(charts).map(chart => (
                    <MenuItem
                      key={chart}
                      onClick={() => toggleChartVisibility('grandFarm', chart)}
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
                    >
                      <Flex alignItems="center" justifyContent={"center"} w={'100%'}>
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
                    section={'grandFarm'}
                    chart={'temperature'}
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
                    section={'grandFarm'}
                    chart={'humidity'}
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
                    section={'grandFarm'}
                    chart={'wind'}
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
                    section={'grandFarm'}
                    chart={'soil'}
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
                    section={'grandFarm'}
                    chart={'leaf'}
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
                    section={'grandFarm'}
                    chart={'rainfall'}
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
        </TabPanels>
      </Tabs>
      {/* <VoiceControl onCommand={handleVoiceCommand} />
      {isModalOpen && (
        <ChartExpandModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`${
            modalChart.charAt(0).toUpperCase() + modalChart.slice(1)
          } Chart`}
          weatherData={weatherData}
          metric={modalChart}
          onChartChange={type => {
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

export default GrandFarmDashboard;
