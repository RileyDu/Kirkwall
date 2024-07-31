import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fa/index.esm.js';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal.js';
import ChartDetails, { getLabelForMetric } from './ChartDetails.js';
import { useColorMode } from '@chakra-ui/react';
import MiniMap from '../Maps/GrandFarmMiniMap.js';
import WatchdogMap from '../Maps/WatchdogMiniMap.js';
import RivercityMap from '../Maps/RivercityMiniMap.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import ImpriMiniMap from '../Maps/ImpriMiniMap.js';
import { useWeatherData } from '../WeatherDataContext.js';
import { updateChart } from '../../Backend/Graphql_helper.js';


const ChartWrapper = ({
  title,
  children,
  onChartChange,
  metric,
  weatherData,
  handleTimePeriodChange,
  toggleChartVisibility,
  section,
  chart,
  chartLayout,
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showIcons, setShowIcons] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTimePeriod, setCurrentTimePeriod] = useState('3H');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sensorMap, setSensorMap] = useState('grandfarm'); // State to toggle between map and chart
  const [userTitle, setUserTitle] = useState('Location');
  const [newTitle, setNewTitle] = useState('Enter New Location Label');
  const { chartData } = useWeatherData();

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

  const renderCloseButton = () => {
    const routesWithCloseButton = ['/', '/grandfarm', '/watchdogprotect'];
    return isLargerThan768 && routesWithCloseButton.includes(location.pathname);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };
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
      default:
        console.error(`Unknown metric: ${metric}`);
    }
  };

  // setMapToDisplay(metric);

  useEffect(() => {
    setMapToDisplay(metric, currentUser);
  }, [metric, currentUser]);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : 'gray.800';

  useEffect(() => {
    const savedTitle = localStorage.getItem(`chartTitle_${metric}`);
    if (savedTitle) {
      setUserTitle(savedTitle);
      setNewTitle(savedTitle);
    }
  }, [metric]);

  const handleTitleChange = e => setNewTitle(e.target.value);
  const handleTitleSubmit = () => {
    setUserTitle(newTitle);
    localStorage.setItem(`chartTitle_${metric}`, newTitle);
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
    md: 'md',
    lg: 'md',
    xl: 'lg',
    xxl: 'lg',
  });
  const paddingBottom = useBreakpointValue({ base: '16', md: '16' });
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const closeSize = useBreakpointValue({ base: 'sm', md: 'lg' });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const calculateTimePeriod = dataLength => {
    const totalMinutes =
      metric === 'temp' ||
      metric === 'hum' ||
      metric === 'humidity' ||
      metric === 'rctemp'
        ? dataLength * 10
        : dataLength * 5;
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

  const handleChartTypeChange = () => {
    const newChartType = chartType === 'bar' ? 'line' : 'bar';
    setChartType(newChartType);
    onChartChange(newChartType);
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

  const showLoadingToast = () => {
    toast({
      title: 'Loading Data',
      description: 'We are fetching the latest data for you.',
      status: 'info',
      duration: null, // Keeps the toast open until manually closed
      isClosable: true,
      size: 'lg',
      position: 'top',
    });
  };

  const handleTimeButtonClick = async timePeriod => {
    if (timePeriod === currentTimePeriod) return; // Prevent fetching if the time period is already selected

    showLoadingToast();
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

  const timeOfGraph = (weatherData && calculateTimePeriod(weatherData.length - 1));

  const MotionButton = motion(Button);

  const MotionIconButton = motion(IconButton);

  return (
    <>
      <Box
        border="2px"
        borderColor="#fd9801"
        borderRadius="md"
        boxShadow="md"
        p="6"
        pb={paddingBottom}
        bg={getBackgroundColor(colorMode)}
        h="500px"
        w="100%"
      >
        <Flex justify="space-between" mb="4" align="center">
          <Box fontSize={fontSize} fontWeight="bold">
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
          <Flex alignItems="center">
            {isLargerThan768 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <Box
                    border="2px"
                    borderColor="#fd9801"
                    borderRadius="lg"
                    px={2}
                    py={1}
                    mr={2}
                    bg={'brand.400'}
                    color={'#212121'}
                  >
                    <Popover trigger="hover" placement="bottom">
                      <PopoverTrigger>
                        <Text fontSize={fontSize} cursor="pointer">
                          {userTitle}
                        </Text>
                      </PopoverTrigger>
                      <PopoverContent
                        bg="brand.50"
                        color="white"
                        borderRadius="md"
                        border="2px solid #212121"
                        p={0} // Remove padding to ensure the content uses full space
                        w="auto" // Ensure width adapts to content
                      >
                        <PopoverArrow bg="#212121" border={'2px solid #212121'}/>
                        <PopoverCloseButton
                          size={closeSize}
                          color="white"
                          mt={[1, -1]}
                        />
                        <PopoverHeader
                          bg="#212121"
                          fontWeight="bold"
                          color="white"
                        >
                          EDIT TITLE{' '}
                        </PopoverHeader>
                        <PopoverBody>
                          <Input
                            value={newTitle}
                            onChange={handleTitleChange}
                            sx={{
                              color: 'black',
                              bg: 'white',
                              border: '2px solid #fd9801',
                            }}
                          />
                          <Button
                            mt={2}
                            onClick={handleTitleSubmit}
                            variant={'sidebar'}
                          >
                            Save
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                </motion.div>
              {chartLayout !== 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.15 }}
                >
                  <Box
                    border="2px"
                    borderColor="#fd9801"
                    borderRadius="lg"
                    px={2}
                    py={1}
                    mr={2}
                    bg={'brand.400'}
                    color={'#212121'}
                  >
                    <Tooltip label="Current Value">
                      <Text fontSize={fontSize}>
                         {formatValue(mostRecentValue)}
                      </Text>
                    </Tooltip>
                  </Box>
                </motion.div>
              )}
              </>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.25 }}
            >
              <Box
                border="2px"
                borderColor="#fd9801"
                borderRadius="lg"
                px={2}
                py={1}
                mr={2}
                bg={'brand.400'}
                color={'#212121'}
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
                    <PopoverHeader bg="#212121" fontWeight="bold" color="white">
                      TIME SELECTOR
                    </PopoverHeader>
                    <PopoverCloseButton
                      size={closeSize}
                      color="white"
                      mt={[1, -1]}
                    />
                    <PopoverBody color="#212121" p={0}>
                      {/* Remove padding for full width use */}
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
                              onClick={() => handleTimeButtonClick(timePeriod)}
                              bg={
                                currentTimePeriod === timePeriod
                                  ? 'brand.800'
                                  : 'gray.100'
                              }
                              color="black"
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
            {chartLayout !== 3 && (
              <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              <Tooltip label="Map">
                <MotionIconButton
                  icon={<FaMap />}
                  variant="outline"
                  color="#212121"
                  size={iconSize}
                  bg={'brand.400'}
                  _hover={{ bg: 'brand.800' }}
                  onClick={toggleMap}
                  border={'2px solid #fd9801'}
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
                  icon={getChartIcon()}
                  variant="outline"
                  color="#212121"
                  size={iconSize}
                  bg={'brand.400'}
                  _hover={{ bg: 'brand.800' }}
                  onClick={handleChartTypeChange}
                  border={'2px solid #fd9801'}
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
                  icon={<FaExpandAlt />}
                  variant="outline"
                  color="#212121"
                  size={iconSize}
                  bg={'brand.400'}
                  _hover={{ bg: 'brand.800' }}
                  onClick={onOpen}
                  border={'2px solid #fd9801'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </Tooltip>
            </motion.div>
            {renderCloseButton() && <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <Tooltip label="Close Chart">
                <MotionIconButton
                  icon={<FaTimes />}
                  variant="outline"
                  color="#212121"
                  size={iconSize}
                  bg={'brand.400'}
                  _hover={{ bg: 'brand.800' }}
                  onClick={() => toggleChartVisibility(section, chart)}
                  border={'2px solid #fd9801'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  ml={2}
                />
              </Tooltip>
            </motion.div>}
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
        onChartChange={onChartChange}
        // adjustTimePeriod={adjustTimePeriod}
        handleTimePeriodChange={handleTimePeriodChange}
        currentTimePeriod={currentTimePeriod}
        setCurrentTimePeriod={setCurrentTimePeriod}
        sensorMap={sensorMap}
      />
    </>
  );
};

export default ChartWrapper;
