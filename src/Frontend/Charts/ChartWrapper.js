import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tooltip,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
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
} from '@chakra-ui/react';
import {
  FaExpandAlt,
  FaChessRook,
  FaChartBar,
  FaChartLine,
  FaMap,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal'; // Adjust the path as necessary
import ChartDetails, { getLabelForMetric } from './ChartDetails';
import { useColorMode } from '@chakra-ui/react';
import axios from 'axios';
import MiniMap from '../Maps/MiniMap';
import WatchdogMap from '../Maps/WatchdogMap';
import RivercityMap from '../Maps/RivercityMap';
import { useAuth } from '../AuthComponents/AuthContext';
import ImpriMiniMap from '../Maps/ImpriMiniMap';
const ChartWrapper = ({
  title,
  children,
  onChartChange,
  metric,
  weatherData,
  handleTimePeriodChange,
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showIcons, setShowIcons] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [lastAlertTime, setLastAlertTime] = useState(null);
  const [currentTimePeriod, setCurrentTimePeriod] = useState('3H');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sensorMap, setSensorMap] = useState('grandfarm'); // State to toggle between map and chart

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

  const toggleMap = () => {
    setShowMap(!showMap);
  };
  const setMapToDisplay = (metric, currentUser) => {
    // Check for special case
    if (currentUser && currentUser.email === 'jerrycromarty@imprimedicine.com') {
      setSensorMap('imprimed');
      return;
    }    switch (metric) {
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

  const restrictedRoutes = [
    '/TempSensors',
    '/HumiditySensors',
    '/SoilMoistureSensors',
    '/WindSensors',
    '/RainSensors',
    '/WatchdogSensors',
    '/RivercitySensors',
  ];

  useEffect(() => {
    setShowIcons(!restrictedRoutes.includes(location.pathname));

    const chartSettings = JSON.parse(
      localStorage.getItem(`chartSettings_${title}`)
    );
    if (chartSettings) {
      setPhoneNumber(chartSettings.phoneNumber || '');
      setHighThreshold(chartSettings.highThreshold || '');
      setLowThreshold(chartSettings.lowThreshold || '');
    }
  }, [location.pathname, title]);

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : 'gray.800';

  const handleFormSubmit = () => {
    // let formattedPhoneNumber = phoneNumber.startsWith('+1')
    //   ? phoneNumber
    //   : `+1${phoneNumber}`;

    const chartSettings = {
      phoneNumber: phoneNumber,
      highThreshold: parseFloat(highThreshold),
      lowThreshold: parseFloat(lowThreshold),
    };

    localStorage.setItem(
      `chartSettings_${title}`,
      JSON.stringify(chartSettings)
    );

    toast({
      title: 'Settings saved.',
      description: 'Your chart settings have been saved successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    console.log('phone number', phoneNumber);
    console.log('high threshold', highThreshold);
    console.log('low threshold', lowThreshold);

    handleCloseModal();
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
      return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    } else if (totalHours < 72) {
      // Less than 3 days
      return '1 day';
    } else if (totalHours < 168) {
      // Less than 1 week
      return '3 days';
    } else {
      return '1 week';
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

  const timeOfGraph = calculateTimePeriod(weatherData.length - 1);

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
          {logo && <img src={logo} alt="logo" width="100px" border="2px solid #212121" mb="2"/>}
            {title}
          </Box>
          {showIcons && (
            <Flex alignItems="center">
              {/* <motion.div
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
                  <Text fontSize={fontSize}>
                    Current: {formatValue(mostRecentValue)}
                  </Text>
                </Box>
              </motion.div> */}
              {/* <motion.div
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
                > */}
                  {/* <Popover
                    trigger="hover"
                    placement="bottom"
                    closeOnBlur
                    closeOnEsc
                  > */}
                    {/* <PopoverTrigger>
                      <Text fontSize={fontSize}>Time: {timeOfGraph}</Text>
                    </PopoverTrigger> */}
                    {/* <PopoverContent
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
                      <PopoverBody color="#212121" p={0}> */}
                        {/* Remove padding for full width use */}
                        {/* <Box
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
                  </Popover> */}
                {/* </Box>
              </motion.div> */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Tooltip label="Thresholds">
                  <MotionIconButton
                    icon={<FaChessRook />}
                    variant="outline"
                    color="#212121"
                    size="md"
                    bg={'brand.400'}
                    _hover={{ bg: 'brand.800' }}
                    onClick={handleOpenModal}
                    mr={2}
                    border={'2px solid #fd9801'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </Tooltip>
              </motion.div> */}
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
            </Flex>
          )}
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
