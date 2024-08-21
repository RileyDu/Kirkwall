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
  IconButton,
  Switch,
  Tooltip,
} from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard.js';
import { FaChartLine, FaChartBar, FaBell, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, BarChart } from '../Charts/Charts.js';
import { createThreshold, deleteAlert } from '../../Backend/Graphql_helper.js';
import { useWeatherData } from '../WeatherDataContext.js';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';

// This is the modal that appears when a chart is expanded
// It is a child of the ChartWrapper component
// It contains the chart, a mini dashboard, and a map, as well as the threshold settings & logs
const ChartExpandModal = ({
  isOpen,
  onClose,
  title,
  metric,
  onChartChange,
  chartID,
  // chartType,
  handleTimePeriodChange,
  weatherData,
  currentTimePeriod,
  setCurrentTimePeriod,
  MapComponent,
  typeOfChart,
  chartLocation,
}) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [emailsForThreshold, setEmailsForThreshold] = useState(['']);
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [currentValue, setCurrentValue] = useState(null);
  const { thresholds, alertsThreshold, fetchAlertsThreshold } =
    useWeatherData();

  // Find the latest threshold for the selected metric, assign a graph to the threshold
  const findLatestThreshold = metric => {
    const threshold = thresholds.find(threshold => threshold.metric === metric);
    const highThreshold = threshold?.high ?? '';
    const lowThreshold = threshold?.low ?? '';
    const phone = threshold?.phone ?? '';
    const email = threshold?.email ?? '';
    return { highThreshold, lowThreshold, phone, email };
  };

  // Update the threshold values when the metric or thresholds change, fetched from the database
  useEffect(() => {
    const latestThreshold = findLatestThreshold(metric);
    setHighThreshold(latestThreshold.highThreshold);
    setLowThreshold(latestThreshold.lowThreshold);

    // Ensure phone numbers are set as an array
    const phoneNumbersArray = latestThreshold.phone
      ? latestThreshold.phone.split(',').map(phone => phone.trim()) // Split and trim each phone number
      : ['']; // Default to an array with an empty string if no phone numbers

    setPhoneNumbers(phoneNumbersArray);

    // Ensure emails are set as an array
    const emailsArray = latestThreshold.email
      ? latestThreshold.email.split(',').map(email => email.trim()) // Split and trim each email
      : ['']; // Default to an array with an empty string if no emails

    setEmailsForThreshold(emailsArray);
  }, [metric, thresholds]);

  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://kirkwall-demo.vercel.app'
      : 'http://localhost:3001';

  const MotionButton = motion(Button);
  const toast = useToast();

  //Styling based on color mode
  const getBackgroundColor = () => 'gray.700';
  const getContentBackgroundColor = () =>
    colorMode === 'light' ? 'brand.50' : 'gray.800';
  const getModalBackgroundColor = () =>
    colorMode === 'light' ? 'whitesmoke' : 'gray.700';

  // Handle time period button click
  const handleTimeButtonClick = async timePeriod => {
    if (timePeriod === currentTimePeriod) return;
    setLoading(true);
    try {
      await handleTimePeriodChange(metric, timePeriod);
      setCurrentTimePeriod(timePeriod);
    } catch (error) {
      console.error('Error changing time period:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set the font size based on the breakpoint
  const fontSize = useBreakpointValue({
    base: 'xs',
    md: 'md',
    lg: 'md',
    xl: 'lg',
    xxl: 'lg',
  });

  // Render the chart based on the selected chart type
  const renderChart = () => {
    switch (typeOfChart) {
      case 'line':
        return <LineChart data={weatherData} metric={metric} />;
      case 'bar':
        return <BarChart data={weatherData} metric={metric} />;
      default:
        return <LineChart data={weatherData} metric={metric} />;
    }
  };

  // Open and close threshold modal functions
  const handleOpenThresholdModal = () => setIsThresholdModalOpen(true);
  const handleCloseThresholdModal = () => setIsThresholdModalOpen(false);

  // Send threshold data to the backend
  const handleFormSubmit = async () => {
    const timestamp = new Date().toISOString();
    const phoneNumbersString = phoneNumbers.join(', '); // Join phone numbers into a single string
    const emailsString = emailsForThreshold.join(', '); // Join emails into a single string

    try {
      await createThreshold(
        metric,
        parseFloat(highThreshold),
        parseFloat(lowThreshold),
        phoneNumbersString,
        emailsString,
        timestamp
      );
      console.log('Alerts Set');
    } catch (error) {
      console.error('Error creating threshold:', error);
    } finally {
      setIsThresholdModalOpen(false);
    }
  };

  // Clear the threshold data and send it to the backend
  const handleFormClear = async () => {
    const timestamp = new Date().toISOString();
    setHighThreshold('');
    setLowThreshold('');
    setPhoneNumbers([]);
    setEmailsForThreshold([]);
    try {
      await createThreshold(
        metric,
        highThreshold,
        lowThreshold,
        '',
        '',
        timestamp
      );
      console.log('Alerts Cleared');
    } catch (error) {
      console.error('Error clearing threshold:', error);
    } finally {
      setIsThresholdModalOpen(false);
    }
  };

  // Clear alerts for the selected metric
  // This function is called when the trash icon is clicked on an alert
  // Toast notifications are used to show the status of the alert deletion
  const clearAlerts = async id => {
    const toastId = 'delete-alert-toast';

    // Show loading toast notification
    toast({
      id: toastId,
      title: 'Deleting alert...',
      description: `The alert is being deleted.`,
      status: 'loading',
      duration: null,
      isClosable: true,
    });

    try {
      await deleteAlert(id);
      await fetchAlertsThreshold(); // Fetch alerts after deleting

      // Update the toast to success
      toast.update(toastId, {
        title: 'Alert deleted.',
        description: `The alert has been successfully deleted.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting alert:', error);

      // Update the toast to error
      toast.update(toastId, {
        title: 'Error deleting alert.',
        description: 'There was an error deleting the alert. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Add a new phone number input
  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  // Remove a phone number input
  const handleRemovePhoneNumber = index => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  // Update phone number value
  const handlePhoneNumberChange = (value, index) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    updatedPhoneNumbers[index] = value;
    setPhoneNumbers(updatedPhoneNumbers);
  };

  // Add a new email input
  const handleAddEmail = () => {
    setEmailsForThreshold([...emailsForThreshold, '']);
  };

  // Remove an email input
  const handleRemoveEmail = index => {
    setEmailsForThreshold(emailsForThreshold.filter((_, i) => i !== index));
  };

  // Update email value
  const handleEmailChange = (value, index) => {
    const updatedEmails = [...emailsForThreshold];
    updatedEmails[index] = value;
    setEmailsForThreshold(updatedEmails);
  };

  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent
          marginTop={'15px'}
          width="90%"
          maxWidth="100%"
          height="90vh"
          maxHeight="90vh"
          display="flex"
          flexDirection="column"
          bg={getBackgroundColor()}
        >
          {/* The title and chart location of the selected chart */}
          <ModalHeader
            bg="#2121"
            color="white"
            fontSize={fontSize}
            borderTopRadius={'md'}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {title} for {chartLocation}
          </ModalHeader>
          <ModalCloseButton size="lg" color="white" mt={1} />
          <ModalBody
            display="flex"
            flexDirection="column"
            flexGrow={1}
            p={4}
            bg={getContentBackgroundColor()}
            borderBottomRadius={'md'}
            boxShadow="md"
          >
            {/* Enables the user to select the time period for the chart
             Talks to the backend to fetch a different limit of data based on the time period selected */}
            <Box display="flex" justifyContent="space-between" mb={2} mt={-2}>
              {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map(timePeriod => (
                <MotionButton
                  key={timePeriod}
                  variant="solid"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTimeButtonClick(timePeriod)}
                  bg={
                    currentTimePeriod === timePeriod ? 'orange.400' : 'gray.100'
                  }
                  color={currentTimePeriod === timePeriod ? 'white' : 'black'}
                  size={['sm', 'md']}
                >
                  {timePeriod}
                </MotionButton>
              ))}
            </Box>
            <Flex
              justify="center"
              alignItems="center"
              flexGrow={2}
              bg={getContentBackgroundColor()}
              p={4}
              borderRadius="md"
              boxShadow="md"
              border="2px solid #fd9801"
              mb={4}
              h={'40vh'}
            >
              {/* // If the data is still loading, show a loading spinner */}
              {loading ? (
                <CircularProgress isIndeterminate color="brand.800" />
              ) : (
                renderChart()
              )}
            </Flex>
            <Box display="flex" justifyContent="center" mb={4}>
              {/* // Buttons to change the chart type
              // syncs with the parent component to change the chart type in the chart wrapper */}
              <MotionButton
                variant={'solid'}
                onClick={() => {
                  onChartChange(chartID, typeOfChart);
                }}
                leftIcon={<FaChartLine />}
                size={['sm', 'md']}
                mx={1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                bg={typeOfChart === 'line' ? 'orange.400' : 'gray.100'}
                color={typeOfChart === 'line' ? 'white' : 'black'}
              >
                LINE
              </MotionButton>
              <MotionButton
                variant={'solid'}
                onClick={() => {
                  onChartChange(chartID, typeOfChart);
                }}
                leftIcon={<FaChartBar />}
                mx={1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size={['sm', 'md']}
                bg={typeOfChart === 'bar' ? 'orange.400' : 'gray.100'}
                color={typeOfChart === 'bar' ? 'white' : 'black'}
              >
                BAR
              </MotionButton>
              {/* // Button to open the threshold modal */}
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
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={4}
              mt={4}
              flexGrow={1}
            >
              {/* Display the threshold credentials for the specific metric */}
              <Box
                bg="gray.700"
                borderRadius="md"
                boxShadow="md"
                p={4}
                height="430px"
              >
                {highThreshold || lowThreshold ? (
                  <>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      textDecor={'underline'}
                      pb="2"
                      textAlign={'center'}
                      color="white"
                    >
                      Thresholds
                    </Text>
                    <Flex width={'100%'} justify={'space-between'} alignItems={'center'}>
                      <HStack gap={6} justify={'flex-start'} width={'75%'}>
                        {highThreshold ? (
                          <Text color="white" fontSize={['xs', 'md']}>
                            <strong>High:</strong> {highThreshold}
                          </Text>
                        ) : null}
                        {lowThreshold ? (
                          <Text color="white" fontSize={['xs', 'md']}>
                            <strong>Low:</strong> {lowThreshold}
                          </Text>
                        ) : null}
                        {phoneNumbers?.length > 0 ? (
                          <Text color="white" fontSize={['xs', 'md']}>
                            <strong>Phone:</strong> {phoneNumbers.join(', ')}
                          </Text>
                        ) : null}
                        {emailsForThreshold?.length > 0 ? (
                          <Text color="white" fontSize={['xs', 'md']}>
                            <strong>Email:</strong>{' '}
                            {emailsForThreshold.join(', ')}
                          </Text>
                        ) : null}
                      </HStack>
                      <FormControl
                        display="flex"
                        alignItems="center"
                        justify={'flex-end'}
                        width={'25%'}
                        ml={24}
                      >
                        <Tooltip label={`Toggle Threshold Alerts For ${title}`}>
                        <FormLabel htmlFor="threshold-alerts" mb="0">
                          PAUSE THRESHOLDS
                        </FormLabel>
                        </Tooltip>
                        <Switch
                          id="threshold-alerts"
                          mb="1"
                          // isChecked={threshKill}
                          // onChange={handleThreshKillToggle}
                          colorScheme={'orange'}
                          />
                      </FormControl>
                    </Flex>
                    <Box
                      mt={2}
                      p={2}
                      bg="gray.800"
                      border="1px solid grey"
                      borderRadius="md"
                      overflowY="scroll"
                      minHeight="160px"
                      maxHeight="200px"
                      height={'100%'}
                    >
                      {/* Map out all alerts for the metric from the db */}
                      <Stack spacing={2}>
                        {alertsThreshold[metric]?.map((alert, index) => (
                          <Box
                            key={index}
                            bg="orange.400"
                            p={2}
                            borderRadius="md"
                            boxShadow="md"
                          >
                            <Flex justify="space-between" align="center" mr={1}>
                              <Text color="#212121">{alert.message}</Text>
                              <FaTrash
                                color="white"
                                onClick={() => clearAlerts(alert.id)}
                                aria-label="Delete alert"
                                cursor="pointer"
                                size={20}
                              />
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </>
                ) : (
                  <Text color={'white'} mt={4}>
                    Set thresholds to see alerts
                  </Text>
                )}
                <Divider my={4} borderColor={'white'} />
                <MiniDashboard
                  weatherData={weatherData}
                  metric={metric}
                  setCurrentValue={setCurrentValue}
                  mt={2}
                />
              </Box>
              <Box
                bg="gray.700"
                borderRadius="md"
                boxShadow="md"
                p={4}
                height="430px"
              >
                <Box height="100%">
                  <MapComponent />
                </Box>
              </Box>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* // Threshold modal to set high/low thresholds & contact details for alerts */}
      <Modal isOpen={isThresholdModalOpen} onClose={handleCloseThresholdModal}>
        <ModalOverlay />
        <ModalContent
          sx={{ border: '2px solid black', bg: getModalBackgroundColor() }}
        >
          <ModalHeader bg={'gray.800'} color={'white'}>
            Add Thresholds for {title}
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            <FormControl>
              <FormLabel>Phone Numbers</FormLabel>
              {phoneNumbers?.map((phoneNumber, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Input
                    type="text"
                    value={phoneNumber}
                    onChange={e =>
                      handlePhoneNumberChange(e.target.value, index)
                    }
                    bg={'white'}
                    border={'2px solid #fd9801'}
                    color={'#212121'}
                    mr={2}
                  />
                  <IconButton
                    icon={<CloseIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemovePhoneNumber(index)}
                  />
                </Box>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={handleAddPhoneNumber}
                size="sm"
                mt={2}
                colorScheme="blue"
              >
                Add Phone Number
              </Button>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Emails</FormLabel>
              {emailsForThreshold?.map((email, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <Input
                    type="text"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value, index)}
                    bg={'white'}
                    border={'2px solid #fd9801'}
                    color={'#212121'}
                    mr={2}
                  />
                  <IconButton
                    icon={<CloseIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleRemoveEmail(index)}
                  />
                </Box>
              ))}
              <Button
                leftIcon={<AddIcon />}
                onClick={handleAddEmail}
                size="sm"
                mt={2}
                colorScheme="blue"
              >
                Add Email
              </Button>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>High Threshold</FormLabel>
              <Input
                type="number"
                value={highThreshold}
                onChange={e => setHighThreshold(e.target.value)}
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
                onChange={e => setLowThreshold(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              bg="red.400"
              color="white"
              _hover={{ bg: 'red.500' }}
              mr={3}
              onClick={handleFormClear}
            >
              Clear Form
            </Button>
            <Button
              variant="solid"
              bg="orange.400"
              color="white"
              _hover={{ bg: 'orange.500' }}
              mr={3}
              onClick={handleFormSubmit}
            >
              Save
            </Button>
            <Button
              variant="solid"
              bg="gray.400"
              color="white"
              _hover={{ bg: 'gray.500' }}
              onClick={handleCloseThresholdModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ChartExpandModal;
