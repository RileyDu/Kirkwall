import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
  useToast,
  useBreakpointValue,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Input,
} from '@chakra-ui/react';
import {
  FaExpandAlt,
  FaTimes,
  FaChartBar,
  FaChartLine,
  FaMap,
  FaEyeSlash,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal.js';
import { getLabelForMetric } from './ChartDashboard.js';
import { useColorMode } from '@chakra-ui/react';
import MiniMap from '../Maps/GrandFarmMiniMap.js';
import WatchdogMap from '../Maps/WatchdogMiniMap.js';
import RivercityMap from '../Maps/RivercityMiniMap.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import ImpriMiniMap from '../Maps/ImpriMiniMap.js';
import { useWeatherData } from '../WeatherDataContext.js';
import axios from 'axios';

const ChartWrapper = ({
  title,
  children,
  metric,
  weatherData,
  handleTimePeriodChange,
  chartLayout,
  typeOfChart,
  chartDataForMetric,
  handleMenuItemClick,
  setFilteredChartData,
  expandButtonRef,
}) => {
  const [currentTimePeriod, setCurrentTimePeriod] = useState('3H');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sensorMap, setSensorMap] = useState('grandfarm'); // State to toggle between map and chart
  const [userTitle, setUserTitle] = useState('Location');
  const { chartData, setChartData } = useWeatherData();
  const isMounted = useRef(false);
  const [newTitle, setNewTitle] = useState(chartDataForMetric?.location);
  const [chartType, setChartType] = useState(chartDataForMetric?.type);
  const [chartID, setChartID] = useState(chartDataForMetric?.id);
  const [isTitlePopoverOpen, setIsTitlePopoverOpen] = useState(false);

  // Function to handle chart type change and switch between bar and line chart
  // User can switch between bar and line chart by button click
  // Function to handle chart type change
  const handleChartTypeChange = (chartId, currentType) => {
    const newChartType = currentType === 'line' ? 'bar' : 'line';

    // Mark this change as user-initiated
    isUserAction.current = true;

    // Set the chart type state
    setChartType(newChartType);

    // Update chartData with the new chart type
    setFilteredChartData(prevData =>
      prevData.map(chart =>
        chart.id === chartId ? { ...chart, type: newChartType } : chart
      )
    );
  };

  const isUserAction = useRef(false);

  useEffect(() => {
    if (isUserAction.current) {
      handleChartEdit();
      isUserAction.current = false; // Reset the flag after the update
    }
  }, [chartType, chartData]);

  const { currentUser } = useAuth();

  const mapComponents = {
    grandfarm: MiniMap,
    garage: WatchdogMap,
    freezer: RivercityMap,
    imprimed: ImpriMiniMap,
  };

  const MapComponent = mapComponents[sensorMap] || null;

  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();

  // Function to render close button on the chart
  // Close button is rendered only on the home page and grandfarm, watchdogprotect, imprimed pages for now
  const renderCloseButton = () => {
    const routesWithCloseButton = [
      '/dashboard',
      '/grandfarm',
      '/watchdogprotect',
      '/imprimed',
    ];
    return isLargerThan768 && routesWithCloseButton.includes(location.pathname);
  };

  const isDashboard = () => {
    const routesWithTitle = ['/dashboard'];
    return routesWithTitle.includes(location.pathname);
  };

  // Function to toggle between map and chart
  const toggleMap = () => {
    setShowMap(!showMap);
  };
  // Function to set the map to display based on the metric
  const setMapToDisplay = (metric, currentUser) => {
    // Check for special case
    if (
      currentUser &&
      currentUser.email === 'jerrycromarty@imprimedicine.com'
    ) {
      setSensorMap('imprimed');
      return;
    }
    switch (metric) {
      case 'temperature':
      case 'percent_humidity':
      case 'wind_speed':
      case 'rain_15_min_inches':
      case 'soil_moisture':
      case 'leaf_wetness':
        setSensorMap('grandfarm');
        break;
      case 'temp':
      case 'hum':
        setSensorMap('garage');
        break;
      case 'humidity':
      case 'rctemp':
        setSensorMap('freezer');
        break;
      case 'imFreezerOneTemp':
      case 'imFreezerOneHum':
      case 'imFreezerTwoTemp':
      case 'imFreezerTwoHum':
      case 'imFreezerThreeTemp':
      case 'imFreezerThreeHum':
      case 'imFridgeOneTemp':
      case 'imFridgeOneHum':
      case 'imFridgeTwoTemp':
      case 'imFridgeTwoHum':
      case 'imIncubatorOneTemp':
      case 'imIncubatorOneHum':
      case 'imIncubatorTwoTemp':
      case 'imIncubatorTwoHum':
        setSensorMap('imprimed');
      default:
        console.error(`Unknown metric: ${metric}`);
    }
  };

  // Set the map to display based on the metric on page load
  useEffect(() => {
    setMapToDisplay(metric, currentUser);
  }, [metric, currentUser]);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#e0e0e0' : 'gray.800';

  const handleTitleChange = e => setNewTitle(e.target.value);
  const handleTitleSubmit = () => {
    setIsTitlePopoverOpen(false);
    setUserTitle(newTitle);
    handleChartEdit();
  };

  const getLogoToDisplay = (metric, colorMode) => {
    const logoMap = {
      light: {
        temperature: 'DavisLogoBlack.png',
        percent_humidity: 'DavisLogoBlack.png',
        wind_speed: 'DavisLogoBlack.png',
        rain_15_min_inches: 'DavisLogoBlack.png',
        soil_moisture: 'DavisLogoBlack.png',
        leaf_wetness: 'DavisLogoBlack.png',
        temp: 'WatchdogLogoBlack.png',
        hum: 'WatchdogLogoBlack.png',
        humidity: 'rci-logo-blue.png',
        rctemp: 'rci-logo-blue.png',
        imFreezerOneTemp: 'rci-logo-blue.png',
        imFreezerOneHum: 'rci-logo-blue.png',
        imFreezerTwoTemp: 'rci-logo-blue.png',
        imFreezerTwoHum: 'rci-logo-blue.png',
        imFreezerThreeTemp: 'rci-logo-blue.png',
        imFreezerThreeHum: 'rci-logo-blue.png',
        imFridgeOneTemp: 'rci-logo-blue.png',
        imFridgeOneHum: 'rci-logo-blue.png',
        imFridgeTwoTemp: 'rci-logo-blue.png',
        imFridgeTwoHum: 'rci-logo-blue.png',
        imIncubatorOneTemp: 'rci-logo-blue.png',
        imIncubatorOneHum: 'rci-logo-blue.png',
        imIncubatorTwoTemp: 'rci-logo-blue.png',
        imIncubatorTwoHum: 'rci-logo-blue.png',
      },
      dark: {
        temperature: 'DavisLogoWhite.png',
        percent_humidity: 'DavisLogoWhite.png',
        wind_speed: 'DavisLogoWhite.png',
        rain_15_min_inches: 'DavisLogoWhite.png',
        soil_moisture: 'DavisLogoWhite.png',
        leaf_wetness: 'DavisLogoWhite.png',
        temp: 'WatchdogLogoWhite.png',
        hum: 'WatchdogLogoWhite.png',
        humidity: 'rci-logo-white.png',
        rctemp: 'rci-logo-white.png',
        impriTemp: 'rci-logo-white.png',
        imFreezerOneTemp: 'rci-logo-white.png',
        imFreezerOneHum: 'rci-logo-white.png',
        imFreezerTwoTemp: 'rci-logo-white.png',
        imFreezerTwoHum: 'rci-logo-white.png',
        imFreezerThreeTemp: 'rci-logo-white.png',
        imFreezerThreeHum: 'rci-logo-white.png',
        imFridgeOneTemp: 'rci-logo-white.png',
        imFridgeOneHum: 'rci-logo-white.png',
        imFridgeTwoTemp: 'rci-logo-white.png',
        imFridgeTwoHum: 'rci-logo-white.png',
        imIncubatorOneTemp: 'rci-logo-white.png',
        imIncubatorOneHum: 'rci-logo-white.png',
        imIncubatorTwoTemp: 'rci-logo-white.png',
        imIncubatorTwoHum: 'rci-logo-white.png',
      },
    };

    return logoMap[colorMode][metric] || '';
  };

  const [logo, setLogo] = useState('');

  useEffect(() => {
    setLogo(getLogoToDisplay(metric, colorMode));
  }, [metric, colorMode]);

  const mostRecentValue =
    weatherData && weatherData.length > 0 ? weatherData[0][metric] : 'N/A';
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  const fontSize = useBreakpointValue({
    base: 'xs',
    md: 'sm',
    lg: 'sm',
    xl: 'md',
    xxl: 'lg',
  });
  const titleSize = useBreakpointValue({ base: 'sm', md: 'lg' });
  const paddingBottom = useBreakpointValue({ base: '16', md: '16' });
  const iconSize = useBreakpointValue({ base: 'xs', md: 'sm' });
  const closeSize = useBreakpointValue({ base: 'sm', md: 'lg' });

  const calculateTimePeriod = dataLength => {
    const totalMinutes =
      metric === 'temperature' ||
      metric === 'percent_humidity' ||
      metric === 'wind_speed' ||
      metric === 'rain_15_min_inches' ||
      metric === 'soil_moisture' ||
      metric === 'leaf_wetness'
        ? dataLength * 5
        : dataLength * 10;
    const totalHours = Math.floor(totalMinutes / 60);

    if (totalHours < 24) {
      return `${totalHours}H`;
    } else if (totalHours < 72) {
      // Less than 3 days
      return '1D';
    } else if (totalHours < 168) {
      // Less than 1 week
      return '3D';
    } else {
      return '1W';
    }
  };

  const getChartIcon = () => {
    switch (chartType) {
      case 'bar':
        return <FaChartBar />;
      case 'line':
        return <FaChartLine />;
      default:
        return <FaChartBar />;
    }
  };

  // const showLoadingToast = () => {
  //   toast({
  //     title: 'Loading Data',
  //     description: 'We are fetching the latest data for you.',
  //     status: 'info',
  //     duration: null, // Keeps the toast open until manually closed
  //     isClosable: true,
  //     size: 'lg',
  //     position: 'top',
  //   });
  // };

  const handleTimeButtonClick = async timePeriod => {
    if (timePeriod === currentTimePeriod) return; // Prevent fetching if the time period is already selected

    // showLoadingToast();
    setLoading(true);

    try {
      const result = await handleTimePeriodChange(metric, timePeriod);
      setCurrentTimePeriod(timePeriod); // Update the current time period after successful fetch
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      toast.closeAll(); // Close all toasts when loading is complete
    }
  }, [loading, toast]);

  const timeOfGraph =
    weatherData && calculateTimePeriod(weatherData.length - 1);

  const MotionButton = motion(Button);

  const MotionIconButton = motion(IconButton);

  const editChart = async (id, metric, timeperiod, type, location, hidden) => {
    try {
      console.log(
        'Editing chart:',
        id,
        metric,
        timeperiod,
        type,
        location,
        hidden
      );
      const result = await axios.put(
        '/api/update_chart',
        {
          id,
          metric,
          timeperiod,
          type,
          location,
          hidden,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Updated chart:', result);
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  const handleChartEdit = () => {
    const id = chartDataForMetric?.id;
    const metric = chartDataForMetric?.metric;
    const timeperiod = chartDataForMetric?.timeperiod;
    const type = chartType;
    const location = newTitle || chartDataForMetric?.location;
    const hidden = chartDataForMetric?.hidden;
    editChart(id, metric, timeperiod, type, location, hidden);
  };

  const [runModalTour, setRunModalTour] = useState(false);

  return (
    <>
      <Box
        border="2px"
        borderColor="#3D5A80"
        borderRadius="md"
        boxShadow="md"
        p="4"
        pb={paddingBottom}
        bg={getBackgroundColor(colorMode)}
        h="500px"
        w="100%"
      >
        <Flex justify="space-between" mb="4" align="center">
          <Box
            fontSize={titleSize}
            fontWeight="bold"
            whiteSpace="nowrap"
            // overflow="hidden"
            // textOverflow="ellipsis"
          >
            {logo && (
              <img
                src={logo}
                alt="logo"
                width="100px"
                border="2px solid #212121"
                mb="2"
              />
            )}
            {title}
          </Box>

          <Flex justify="space-between" align="center" w="100%">
            {/* First Group: Aligned to the flex-start */}
            <Flex alignItems="center" justifyContent="flex-start" ml={4}>
              {isDashboard() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <Box
                    border="2px"
                    borderColor="#3D5A80"
                    borderRadius="lg"
                    px={2}
                    py={0.5}
                    mr={2}
                    bg={'#cee8ff'}
                    color={'black'}
                  >
                    <Popover
                      isOpen={isTitlePopoverOpen}
                      onClose={() => setIsTitlePopoverOpen(false)}
                      placement="bottom"
                    >
                      <PopoverTrigger>
                        <Text
                          fontSize={fontSize}
                          cursor="pointer"
                          onClick={() =>
                            setIsTitlePopoverOpen(!isTitlePopoverOpen)
                          }
                        >
                          {newTitle || chartDataForMetric?.location}
                        </Text>
                      </PopoverTrigger>
                      <PopoverContent
                        bg="brand.50"
                        color="white"
                        borderRadius="md"
                        border="2px solid #212121"
                        p={0}
                        w="auto"
                      >
                        <PopoverArrow
                          bg="#212121"
                          border={'2px solid #212121'}
                        />
                        <PopoverCloseButton size={closeSize} color="white" />
                        <PopoverHeader
                          bg="#212121"
                          fontWeight="bold"
                          color="white"
                        >
                          EDIT TITLE
                        </PopoverHeader>
                        <PopoverBody bg={'#cee8ff'}>
                          <Input
                            value={newTitle || chartDataForMetric?.location}
                            onChange={handleTitleChange}
                            sx={{
                              color: 'black',
                              bg: 'white',
                              border: '2px solid #3D5A80',
                            }}
                          />
                          <Button
                            mt={2}
                            onClick={handleTitleSubmit}
                            variant={'blue'}
                          >
                            Save
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                </motion.div>
              )}
              {/* Second button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <Box
                  border="2px"
                  borderColor="#3D5A80"
                  borderRadius="lg"
                  px={2}
                  py={0.5}
                  mr={2}
                  bg={'#cee8ff'}
                  color={'black'}
                >
                  <Tooltip label="Current Value">
                    <Text fontSize={fontSize}>
                      {formatValue(mostRecentValue)}
                    </Text>
                  </Tooltip>
                </Box>
              </motion.div>
            </Flex>

            {/* Second Group: Aligned to the flex-end */}
            <Flex alignItems="center" justifyContent="flex-end">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <Box
                  border="2px"
                  borderColor="#3D5A80"
                  borderRadius="lg"
                  px={2}
                  py={0.5}
                  mr={2}
                  bg={'#cee8ff'}
                  color={'black'}
                >
                  <Popover
                    trigger="hover"
                    placement="bottom"
                    closeOnBlur
                    closeOnEsc
                  >
                    <PopoverTrigger>
                      <Text fontSize={fontSize}>{timeOfGraph}</Text>
                    </PopoverTrigger>
                    <PopoverContent
                      bg="brand.50"
                      color="white"
                      borderRadius="md"
                      border="2px solid #212121"
                      p={0} // Remove padding to ensure the content uses full space
                      w="auto" // Ensure width adapts to content
                    >
                      <PopoverArrow bg="#212121" border={'2px solid #212121'} />
                      <PopoverHeader
                        bg="#212121"
                        fontWeight="bold"
                        color="white"
                      >
                        TIME SELECTOR
                      </PopoverHeader>
                      <PopoverCloseButton
                        size={closeSize}
                        color="white"
                        mt={[1, -1]}
                      />
                      <PopoverBody color="#212121" p={0}>
                        <Box
                          display="flex"
                          flexWrap="wrap" // Allows buttons to wrap if they don't fit in one line
                          gap={0.5}
                          p={2} // Add some padding inside the Box for spacing
                          w="100%" // Ensure the Box takes full width
                        >
                          {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map(
                            timePeriod => (
                              <MotionButton
                                key={timePeriod}
                                variant="pill"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleTimeButtonClick(timePeriod)
                                }
                                bg={
                                  currentTimePeriod === timePeriod
                                    ? '#3D5A80'
                                    : 'gray.100'
                                }
                                _hover={{ bg: '#3D5A80', color: 'white' }}
                                color={
                                  currentTimePeriod === timePeriod
                                    ? 'white'
                                    : 'black'
                                }
                                fontSize={fontSize}
                                flex="1 1 0" // Ensures buttons take equal space and grow
                                m={0} // Remove margin
                              >
                                {timePeriod}
                              </MotionButton>
                            )
                          )}
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              </motion.div>
              {chartLayout !== 3 && isLargerThan768 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.35 }}
                  >
                    <Tooltip label="Map">
                      <MotionIconButton
                        id="step1"
                        icon={<FaMap />}
                        variant="outline"
                        color="black"
                        size={iconSize}
                        bg={'#cee8ff'}
                        _hover={{ bg: '#cee8ff' }}
                        onClick={toggleMap}
                        border={'2px solid #3D5A80'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        mr={2}
                      />
                    </Tooltip>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.35 }}
                  >
                    <Tooltip label="Change Chart Type">
                      <MotionIconButton
                        id="step2"
                        icon={getChartIcon()}
                        variant="outline"
                        color="#212121"
                        size={iconSize}
                        bg={'#cee8ff'}
                        _hover={{ bg: '#cee8ff' }}
                        onClick={() =>
                          handleChartTypeChange(chartID, chartType)
                        }
                        border={'2px solid #3D5A80'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        mr={2}
                      />
                    </Tooltip>
                  </motion.div>
                </>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Tooltip label="Expand Chart">
                  <MotionIconButton
                    ref={expandButtonRef}
                    id="step3"
                    icon={<FaExpandAlt />}
                    variant="outline"
                    color="#212121"
                    size={iconSize}
                    bg={'#cee8ff'}
                    _hover={{ bg: '#cee8ff' }}
                    onClick={onOpen}
                    border={'2px solid #3D5A80'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </Tooltip>
              </motion.div>
              {renderCloseButton() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Tooltip label="Hide Chart">
                    <MotionIconButton
                      id="step4"
                      icon={<FaEyeSlash />}
                      variant="outline"
                      color="#212121"
                      size={iconSize}
                      bg={'#cee8ff'}
                      _hover={{ bg: '#cee8ff' }}
                      onClick={() => handleMenuItemClick(metric)}
                      border={'2px solid #3D5A80'}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      ml={2}
                      mr={2}
                    />
                  </Tooltip>
                </motion.div>
              )}
            </Flex>
          </Flex>
        </Flex>

        {showMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'linear', stiffness: 50 }}
          >
            <MapComponent />
          </motion.div>
        )}
        {!showMap && children}
      </Box>
      <ChartExpandModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        children={children}
        weatherData={weatherData}
        metric={metric}
        onChartChange={handleChartTypeChange}
        chartID={chartID}
        // chartType={chartType}
        // adjustTimePeriod={adjustTimePeriod}
        handleTimePeriodChange={handleTimePeriodChange}
        currentTimePeriod={currentTimePeriod}
        setCurrentTimePeriod={setCurrentTimePeriod}
        sensorMap={sensorMap}
        MapComponent={MapComponent}
        typeOfChart={typeOfChart}
        chartLocation={newTitle || chartDataForMetric?.location}
        runModalTour={runModalTour}
        // runThresholdTour={runThresholdTour}
        // setRunThresholdTour={setRunThresholdTour}
        // isTourRunning={isTourRunning}
        // setIsTourRunning={setIsTourRunning}
        // activeChartID={activeChartID}
        // setActiveChartID={setActiveChartID}
      />
    </>
  );
};

export default ChartWrapper;
