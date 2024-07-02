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
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal'; // Adjust the path as necessary
import ChartDetails, { getLabelForMetric } from './ChartDetails';
import { useColorMode } from '@chakra-ui/react';
import axios from 'axios';

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

  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const restrictedRoutes = [
    '/TempSensors',
    '/HumiditySensors',
    '/SoilMoistureSensors',
    '/WindSensors',
    '/RainSensors',
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
    colorMode === 'light' ? '#f9f9f9' : '#303030';

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

  const sendSMSAlert = async (to, body) => {
    try {
      const response = await axios.post('/send-sms', { to, body });
      console.log('SMS response:', response.data);
      toast({
        title: 'Alert sent.',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: 'Error sending alert.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkThresholdExceed = () => {
    const chartSettings = JSON.parse(
      localStorage.getItem(`chartSettings_${title}`)
    );
    if (chartSettings) {
      const { phoneNumber, highThreshold, lowThreshold } = chartSettings;
      const lastValue =
        weatherData && weatherData.length > 0 ? weatherData[0][metric] : null;
      const now = new Date();

      if (
        lastValue &&
        (lastValue > highThreshold || lastValue < lowThreshold) &&
        (!lastAlertTime || now - new Date(lastAlertTime) >= 5 * 60 * 1000)
      ) {
        const message = `${title} has exceeded the threshold. Current value: ${lastValue}`;
        sendSMSAlert(phoneNumber, message);
        setLastAlertTime(now);
      }
    }
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    //   checkThresholdExceed();
    // }, 305000); // 5 minutes
    // return () => clearInterval(interval);
  }, [weatherData, metric, title, lastAlertTime]);

  const mostRecentValue =
    weatherData && weatherData.length > 0 ? weatherData[0][metric] : 'N/A';
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  const fontSize = useBreakpointValue({ base: 'xs', md: 'lg' });
  const paddingBottom = useBreakpointValue({ base: '16', md: '16' });
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const closeSize = useBreakpointValue({ base: 'sm', md: 'lg' });


  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const calculateTimePeriod = dataLength => {
    const totalMinutes = dataLength * 5;
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
            {title}
          </Box>
          {showIcons && (
            <Flex alignItems="center">
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
                  <Text fontSize={fontSize}>
                    Current: {formatValue(mostRecentValue)}
                  </Text>
                </Box>
              </motion.div>
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
        <Text fontSize={fontSize}>Time: {timeOfGraph}</Text>
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
        <PopoverHeader bg="#212121" fontWeight="bold" color="white">
          TIME SELECTOR
        </PopoverHeader>
        <PopoverCloseButton size={closeSize} color="white" mt={[1,-1]}/>
        <PopoverBody color="#212121" p={0}> {/* Remove padding for full width use */}
          <Box
            display="flex"
            flexWrap="wrap" // Allows buttons to wrap if they don't fit in one line
            gap={0.5}
            p={2} // Add some padding inside the Box for spacing
            w="100%" // Ensure the Box takes full width
          >
            {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map(timePeriod => (
              <MotionButton
                key={timePeriod}
                variant="pill"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTimeButtonClick(timePeriod)}
                bg={currentTimePeriod === timePeriod ? 'brand.800' : 'gray.100'}
                color="black"
                fontSize={fontSize}
                flex="1 1 0" // Ensures buttons take equal space and grow
                m={0} // Remove margin
              >
                {timePeriod}
              </MotionButton>
            ))}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
                </Box>
              </motion.div>
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
        {children}
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
      />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent
          sx={{
            border: '2px solid black',
            bg: 'brand.50',
          }}
        >
          <ModalHeader bg={'#212121'} color={'white'}>
            Add Thresholds for {title}
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>High Threshold</FormLabel>
              <Input
                type="number"
                value={highThreshold}
                onChange={e => setHighThreshold(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Low Threshold</FormLabel>
              <Input
                type="number"
                value={lowThreshold}
                onChange={e => setLowThreshold(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="sidebar" mr={3} onClick={handleFormSubmit}>
              Save
            </Button>
            <Button variant="sidebar" onClick={handleCloseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChartWrapper;
