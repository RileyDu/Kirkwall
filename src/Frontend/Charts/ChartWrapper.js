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
} from '@chakra-ui/react';
import { FaExpandAlt,  } from 'react-icons/fa';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal'; // Adjust the path as necessary
import { getLabelForMetric } from './ChartDetails';
import { useColorMode } from '@chakra-ui/react';
import axios from 'axios';

const ChartWrapper = ({
  title,
  children,
  onChartChange,
  metric,
  weatherData,
  timePeriod,
  adjustTimePeriod,
  handleTimePeriodChange,
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showIcons, setShowIcons] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [lastAlertTime, setLastAlertTime] = useState(null);

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

  const iconSize = '24';

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  const handleFormSubmit = () => {
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

    console.log('phone number', phoneNumber)
    console.log('high threshold', highThreshold);
    console.log('low threshold', lowThreshold)

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
    const chartSettings = JSON.parse(localStorage.getItem(`chartSettings_${title}`));
    if (chartSettings) {
      const { phoneNumber, highThreshold, lowThreshold } = chartSettings;
      const lastValue = weatherData && weatherData.length > 0 ? weatherData[0][metric] : null;
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

  const mostRecentValue = weatherData && weatherData.length > 0 ? weatherData[0][metric] : 'N/A';
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  const fontSize = useBreakpointValue({ base: 'sm', md: 'lg' });
  const paddingBottom = useBreakpointValue({ base: '16', md: '16' });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const calculateTimePeriod = dataLength => {
    const totalMinutes = dataLength * 5;
    const totalHours = Math.floor(totalMinutes / 60);
  
    if (totalHours < 24) {
      return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    } else if (totalHours < 72) { // Less than 3 days
      return '1 day';
    } else if (totalHours < 168) { // Less than 1 week
      return '3 days';
    } else {
      return '1 week';
    }
  };
  

  const timeOfGraph = calculateTimePeriod(weatherData.length - 1);


  const MotionIconButton = motion(IconButton);

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
                  <Text fontSize={fontSize}>
                    Time Period: {timeOfGraph}
                  </Text>
                </Box>
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
                    aria-label="Change Chart Type"
                    onClick={handleChartTypeChange}
                    whileTap={{ scale: 0.9 }}
                    mr={2}
                    bg={'brand.400'}
                    _hover={{ bg: 'brand.800' }}
                    border={'2px solid #fd9801'}
                    whileHover={{ scale: 1.1 }}
                  />
                </Tooltip>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.45 }}
              >
                <Tooltip label="Expand Chart">
                  <IconButton
                    icon={<FaExpandAlt />}
                    variant="outline"
                    color="#212121"
                    aria-label="Expand Chart"
                    onClick={handleOpenModal}
                    mr={2}
                    bg={'brand.400'}
                    _hover={{ bg: 'brand.800' }}
                    border={'2px solid #fd9801'}
                    whileHover={{ scale: 1.1 }}
                  />
                </Tooltip>
              </motion.div>
            </Flex>
          )}
        </Flex>
        {children}
      </Box>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chart Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4} id="highThreshold">
              <FormLabel>High Threshold</FormLabel>
              <Input
                type="number"
                step="0.01"
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4} id="lowThreshold">
              <FormLabel>Low Threshold</FormLabel>
              <Input
                type="number"
                step="0.01"
                value={lowThreshold}
                onChange={(e) => setLowThreshold(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleFormSubmit}>
              Save
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ChartExpandModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        chartType={chartType}
        timePeriod={timePeriod}
        adjustTimePeriod={adjustTimePeriod}
        handleTimePeriodChange={handleTimePeriodChange}
      />
    </>
  );
};

export default ChartWrapper;
