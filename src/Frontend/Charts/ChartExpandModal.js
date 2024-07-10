import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
  useColorMode,
  useToast,
  useBreakpointValue,
  Flex,
  Text,
  Divider,
  CircularProgress,
  SimpleGrid,
  Stack,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  HStack,
} from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import MiniMap from '../Maps/MiniMap';
import WatchdogMap from '../Maps/WatchdogMap';
import { FaChartLine, FaChartBar, FaBell, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, BarChart } from '../Charts/Charts';
import axios from 'axios';
// import ThresholdAlertEmail from './ThresholdAlertEmail';

const ChartExpandModal = ({
  isOpen,
  onClose,
  children,
  title,
  metric,
  onChartChange,
  handleTimePeriodChange,
  weatherData,
  currentTimePeriod,
  setCurrentTimePeriod,
  sensorMap,
}) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('line');
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [alerts, setAlerts] = useState(JSON.parse(localStorage.getItem('alerts')) || []);
  const [timer, setTimer] = useState(30);
  const [currentValue, setCurrentValue] = useState(null);
  const [lastAlertTime, setLastAlertTime] = useState(null); // Add last alert time state

  const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://kirkwall-demo.vercel.app'
  : 'http://localhost:3001';


  const MotionButton = motion(Button);
  const toast = useToast();

  const getBackgroundColor = () => 'gray.700';
  const getContentBackgroundColor = () => (colorMode === 'light' ? 'brand.50' : 'gray.800');
  const getTextColor = () => (colorMode === 'light' ? 'black' : 'white');
  const getModalBackgroundColor = () => (colorMode === 'light' ? 'whitesmoke' : 'gray.700');

  const handleTimeButtonClick = async (timePeriod) => {
    if (timePeriod === currentTimePeriod) return;

    setLoading(true);

    try {
      const result = await handleTimePeriodChange(metric, timePeriod);
      setCurrentTimePeriod(timePeriod);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          checkThresholds();
          return 300;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentValue, highThreshold, lowThreshold]);

  useEffect(() => {
    const savedChartSettings = JSON.parse(localStorage.getItem(`chartSettings_${title}`));

    if (savedChartSettings) {
      setPhoneNumber(savedChartSettings.phoneNumber || '');
      setUserEmail(savedChartSettings.userEmail || '');
      setHighThreshold(savedChartSettings.highThreshold || '');
      setLowThreshold(savedChartSettings.lowThreshold || '');
    }
  }, [title]);

  const sendSMSAlert = async (to, body) => {
    try {
      const response = await axios.post(`${apiUrl}/send-sms`, { to, body });
      // console.log('SMS response:', response.data);
      toast({
        title: 'Alert sent.',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // console.error('Error sending alert:', error, apiUrl);
      toast({
        title: 'Error sending alert.',
        description: error.message, apiUrl,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const sendEmailAlert = async (to, subject, text, html) => {
    try {
      const response = await axios.post(`${apiUrl}/send-email`, { to, subject, text, html });
      // console.log('Email response:', response.data);
      toast({
        title: 'Alert sent.',
        description: response.data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // console.error('Error sending alert:', error);
      toast({
        title: 'Error sending alert.',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkThresholds = () => {
    if (currentValue != null) {
      const now = new Date();
      const lastAlertTimeObj = lastAlertTime ? new Date(lastAlertTime) : null;

      if (highThreshold < currentValue) {
        const alertMessage = `Alert: The ${metric} value of ${currentValue} exceeds the high threshold of ${highThreshold}.`;
        if (!lastAlertTimeObj || now - lastAlertTimeObj >= 5 * 60 * 1000) {
          sendSMSAlert(phoneNumber, alertMessage);
          sendEmailAlert(userEmail, 'Threshold Alert', alertMessage);
          setLastAlertTime(now);
        }
        setAlerts((prevAlerts) => {
          const newAlerts = [...prevAlerts, alertMessage];
          localStorage.setItem('alerts', JSON.stringify(newAlerts));
          return newAlerts;
        });
      }

      if (lowThreshold > currentValue) {
        const alertMessage = `Alert: The ${metric} value of ${currentValue} is below the low threshold of ${lowThreshold}.`;
        if (!lastAlertTimeObj || now - lastAlertTimeObj >= 5 * 60 * 1000) {
          sendSMSAlert(phoneNumber, alertMessage);
          sendEmailAlert(userEmail, 'Threshold Alert', alertMessage);
          setLastAlertTime(now);
        }
        setAlerts((prevAlerts) => {
          const newAlerts = [...prevAlerts, alertMessage];
          localStorage.setItem('alerts', JSON.stringify(newAlerts));
          return newAlerts;
        });
      }
    }
  };

  const fontSize = useBreakpointValue({ base: 'xs', md: 'md', lg: 'md', xl: 'lg', xxl: 'lg' });

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <LineChart data={weatherData} metric={metric} />;
      case 'bar':
        return <BarChart data={weatherData} metric={metric} />;
      default:
        return <LineChart data={weatherData} metric={metric} />;
    }
  };

  const handleOpenThresholdModal = () => setIsThresholdModalOpen(true);
  const handleCloseThresholdModal = () => setIsThresholdModalOpen(false);
  const handleFormSubmit = () => {
    const chartSettings = {
      phoneNumber: phoneNumber,
      userEmail: userEmail,
      highThreshold: parseFloat(highThreshold),
      lowThreshold: parseFloat(lowThreshold),

    };

    localStorage.setItem(`chartSettings_${title}`, JSON.stringify(chartSettings));

    setIsThresholdModalOpen(false);
  };

  const clearAlerts = () => {
    setAlerts([]);
    localStorage.setItem('alerts', JSON.stringify([]));
  };


  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          width="90%"
          maxWidth="100%"
          height="90vh"
          maxHeight="90vh"
          display="flex"
          flexDirection="column"
          bg={getBackgroundColor()}
        >
          <ModalHeader
            bg="#2121"
            color="white"
            fontSize={fontSize}
            borderTopRadius={'md'}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {title}
          </ModalHeader>
          <ModalCloseButton size="lg" color="white" mt={1} />
          <ModalBody display="flex" flexDirection="column" flexGrow={1} p={4} bg={getContentBackgroundColor()} borderBottomRadius={'md'} boxShadow="md">
            <Box display="flex" justifyContent="space-between" mb={2} mt={-2}>
              {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map((timePeriod) => (
                <MotionButton
                  key={timePeriod}
                  variant="solid"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTimeButtonClick(timePeriod)}
                  bg={currentTimePeriod === timePeriod ? 'brand.800' : 'gray.100'}
                  color={currentTimePeriod === timePeriod ? 'white' : 'black'}
                  size={['sm', 'md']}
                >
                  {timePeriod}
                </MotionButton>
              ))}
            </Box>
            <Flex justify="center" alignItems="center" flexGrow={2} bg={getContentBackgroundColor()} p={4} borderRadius="md" boxShadow="md" border="2px solid #fd9801" mb={4} h={'40vh'}>
              {loading ? <CircularProgress isIndeterminate color="brand.800" /> : renderChart()}
            </Flex>
            <Box display="flex" justifyContent="center" mb={4}>
              <MotionButton
                variant={'solid'}
                onClick={() => { setChartType('line'); onChartChange('line'); }}
                leftIcon={<FaChartLine />}
                size={['sm', 'md']}
                mx={1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                bg={chartType === 'line' ? 'brand.800' : 'gray.100'}
                color={chartType === 'line' ? 'white' : 'black'}
              >
                LINE
              </MotionButton>
              <MotionButton
                variant={'solid'}
                onClick={() => { setChartType('bar'); onChartChange('bar'); }}
                leftIcon={<FaChartBar />}
                mx={1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size={['sm', 'md']}
                bg={chartType === 'bar' ? 'brand.800' : 'gray.100'}
                color={chartType === 'bar' ? 'white' : 'black'}
              >
                BAR
              </MotionButton>
              <MotionButton
                variant={'solid'}
                onClick={handleOpenThresholdModal}
                leftIcon={<FaBell />}
                mx={1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size={['sm', 'md']}
                bg={'gray.100'}
                color={'black'}
              >
                SET THRESHOLDS
              </MotionButton>
            </Box>
            <Divider />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4} flexGrow={1}>
              <Box bg="gray.700" borderRadius="md" boxShadow="md" p={4} height="430px">
                <MiniDashboard weatherData={weatherData} metric={metric} setCurrentValue={setCurrentValue} mt={2}  />
                <Divider my={8} borderColor={'white'}/>
                {highThreshold || lowThreshold ? (
                  <>
                    <HStack>
                      <Text color='white' fontSize="lg" fontWeight="bold">Alerts</Text>
                      <Text color='white'>High Threshold: {highThreshold}</Text>
                      <Text color='white'>Low Threshold: {lowThreshold}</Text>
                      <Text color='white'>Timer: {timer}s</Text>
                      <MotionButton
                        variant="solid"
                        onClick={clearAlerts}
                        leftIcon={<FaTrash />}
                        size={['sm', 'sm']}
                        mx={1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        bg={'gray.100'}
                        color={'black'}
                      >
                        CLEAR ALERTS
                      </MotionButton>
                    </HStack>
                    <Box
                      mt={2}
                      p={2}
                      bg="gray.800"
                      border="1px solid grey"
                      borderRadius="md"
                      overflowY="scroll"
                      minHeight="160px"
                      maxHeight="160px"

                    >
                      <Stack spacing={2}>
                        {alerts.map((alert, index) => (
                          <Box key={index} bg="brand.400" p={2} borderRadius="md" boxShadow="md">
                            <Text color="#212121">{alert}</Text>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </>
                ) : (
                  <Text color={'white'}mt={4}>Set thresholds to see alerts</Text>
                )}
              </Box>
              <Box bg="gray.700" borderRadius="md" boxShadow="md" p={4} height="430px">
                <Box height="100%">
                {sensorMap === 'grandfarm' ? <MiniMap /> : <WatchdogMap /> }
                </Box>
              </Box>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isThresholdModalOpen} onClose={handleCloseThresholdModal}>
        <ModalOverlay />
        <ModalContent sx={{ border: '2px solid black', bg: getModalBackgroundColor() }}>
          <ModalHeader bg={'gray.800'} color={'white'}>
            Add Thresholds for {title}
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>High Threshold</FormLabel>
              <Input
                type="number"
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}

              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Low Threshold</FormLabel>
              <Input
                type="number"
                value={lowThreshold}
                onChange={(e) => setLowThreshold(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}

              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="sidebar" mr={3} onClick={handleFormSubmit}>
              Save
            </Button>
            <Button variant="sidebar" onClick={handleCloseThresholdModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChartExpandModal;