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
} from '@chakra-ui/react';
import VoiceControl from '../../services/VoiceControl';
import { LineChart, BarChart } from '../../Charts/Charts';
import Logout from '../../AuthComponents/Logout';
import { auth } from '../../../Backend/Firebase';
import ChartWrapper from '../../Charts/ChartWrapper';
import { FaChessRook, FaChevronDown, FaPlus, FaMinus, FaTemperatureHigh, FaTint, FaWind, FaWater, FaLeaf, FaCloudRain } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useWeatherData } from '../../WeatherDataContext';
import { handleChartChange } from '../../Charts/ChartUtils';
import { motion } from 'framer-motion';
// import { useAuth } from '../AuthComponents/AuthContext.js';
import ChartExpandModal from '../../Charts/ChartExpandModal';


const MotionBox = motion(Box);
const MotionTabPanel = motion(TabPanel);

const RJDashboard = ({ timePeriod, statusOfAlerts }) => {
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
  const [visibleCharts, setVisibleCharts] = useState({
    grandFarm: ['temperature', 'humidity', 'wind', 'soilMoisture', 'leafWetness', 'rainfall'],
    garage: ['temperature', 'humidity'],
    rivercity: ['temperature', 'humidity'],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChart, setModalChart] = useState('');
  const [currentTimePeriod, setCurrentTimePeriod] = useState('1H');

  const { colorMode } = useColorMode();
  const iconColor = useColorModeValue('black', 'white');

  const showSection = (section) => {
    setShowSections((prevState) => ({
      ...prevState,
      [section]: true,
    }));
  };

  const hideSection = (section) => {
    setShowSections((prevState) => ({
      ...prevState,
      [section]: false,
    }));
  };

  const showChart = (section, chart) => {
    setVisibleCharts((prevState) => ({
      ...prevState,
      [section]: [...prevState[section], chart],
    }));
  };

  const hideChart = (section, chart) => {
    setVisibleCharts((prevState) => ({
      ...prevState,
      [section]: prevState[section].filter((item) => item !== chart),
    }));
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('show grand farm')) {
      showSection('grandFarm');
    } else if (command.includes('hide grand farm')) {
      hideSection('grandFarm');
    } else if (command.includes('show garage')) {
      showSection('garage');
    } else if (command.includes('hide garage')) {
      hideSection('garage');
    } else if (command.includes('show freezer')) {
      showSection('rivercity');
    } else if (command.includes('hide freezer')) {
      hideSection('rivercity');
    } else if (command.includes('show temperature')) {
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

  const openModal = (chart) => {
    setModalChart(chart);
    setIsModalOpen(true);
  };

  const logOut = () => {
    auth.signOut().then(() => {
      console.log('User logged out');
      // Additional logout logic if needed
    }).catch((error) => {
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

  const toggleSection = (section) => {
    setShowSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const toggleChartVisibility = (section, chart) => {
    setVisibleCharts((prevState) => {
      const newSectionCharts = prevState[section].includes(chart)
        ? prevState[section].filter((item) => item !== chart)
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
        bg={isVisible ? "red.400" : "green.400"}
        color="white"
        _hover={{ bg: isVisible ? "red.500" : "green.500" }}
        size="sm"
        aria-label={`${isVisible ? 'Hide' : 'Show'} ${chart}`}
      />
    </Tooltip>
  );

  const charts = {
    temperature: <FaTemperatureHigh />,
    humidity: <FaTint />,
    wind: <FaWind />,
    soilMoisture: <FaWater />,
    leafWetness: <FaLeaf />,
    rainfall: <FaCloudRain />
  };

  return (

    
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width="calc(100% - 80px)"
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
            <Flex justify="space-between" mb="6" alignItems="center">
              <Heading size="lg">RJ Energy Dashboard</Heading>
            </Flex>
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: showSections.rivercity ? 1 : 0,
                height: showSections.rivercity ? 'auto' : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Flex justify="center" align="center" mb="4">
  <Heading size="lg" textAlign="center">
    Freezer Sensors
  </Heading>
  <Menu>
    <MenuButton
      as={Button}
      bg="brand.400"
      color="black"
      _hover={{ bg: '#d7a247' }}
      ml={2}
      size={'xs'}
      mt={2}
    >
      <FaChevronDown />
    </MenuButton>
    <MenuList>
      {['temperature', 'humidity'].map(chart => (
        <MenuItem
          key={chart}
          onClick={() => toggleChartVisibility('rivercity', chart)}
        >
          <Flex alignItems="center">
            {charts[chart]}
            <Box ml="2">
              {visibleCharts.rivercity.includes(chart) ? 'Hide' : 'Show'}{' '}
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
        </TabPanels>
      </Tabs>
      
      <VoiceControl onCommand={handleVoiceCommand} />
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
      )}
    </Box>
  );
};
export default RJDashboard