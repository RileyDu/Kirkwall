import { useState, useEffect, useRef } from 'react';
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
} from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard.js';
import { FaChartLine, FaChartBar, FaBell, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, BarChart } from '../Charts/Charts.js';
import { useWeatherData } from '../WeatherDataContext.js';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import axios from 'axios'; // Import Axios

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
  const [threshKill, setThreshKill] = useState(false);
  const [timeframe, setTimeframe] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [timeOfToggle, setTimeOfToggle] = useState('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [userHasChosenTimeframe, setUserHasChosenTimeframe] = useState(false);
  const [toggleTimeAsDate, setToggleTimeAsDate] = useState('');
  const threshKillChanged = useRef(false);
  const MotionButton = motion(Button);
  const toast = useToast();

  const { thresholds, alertsThreshold, fetchAlertsThreshold } =
    useWeatherData();

  // Find the latest threshold for the selected metric, assign a graph to the threshold
  const findLatestThreshold = metric => {
    const threshold = thresholds.find(threshold => threshold.metric === metric);
    const highThreshold = threshold?.high ?? '';
    const lowThreshold = threshold?.low ?? '';
    const phone = threshold?.phone ?? '';
    const email = threshold?.email ?? '';
    const timeframe = threshold?.timeframe ?? '';
    const threshkill = threshold?.thresh_kill ?? false;
    const timestamp = threshold?.timestamp ?? '';
    return {
      highThreshold,
      lowThreshold,
      phone,
      email,
      timeframe,
      threshkill,
      timestamp,
    };
  };

  useEffect(() => {
    const latestThreshold = findLatestThreshold(metric);

    // Check if the timeframe is "99 days" and treat it as an indefinite pause
    const isIndefinitePause = latestThreshold?.timeframe.days === 99;
    // console.log(isIndefinitePause)
    // console.log(latestThreshold?.timeframe)

    // If there's a timestamp and a timeframe and it's not an indefinite pause
    if (
      latestThreshold?.timestamp &&
      latestThreshold?.timeframe &&
      !isIndefinitePause
    ) {
      const { formatted, date } = calculateTimeOfToggle(
        latestThreshold?.timestamp,
        latestThreshold?.timeframe
      );
      setTimeOfToggle(formatted);
      setToggleTimeAsDate(date);
    } else if (isIndefinitePause) {
      setTimeOfToggle('Indefinitely Paused');
      setToggleTimeAsDate(null); // Clear the date since it's paused indefinitely
    }

    // Set other threshold-related states
    setHighThreshold(latestThreshold.highThreshold);
    setLowThreshold(latestThreshold.lowThreshold);
    setThreshKill(latestThreshold.threshkill);
    setTimeframe(latestThreshold.timeframe);
    setTimestamp(latestThreshold.timestamp);

    setPhoneNumbers(
      latestThreshold.phone?.split(',').map(phone => phone.trim()) || ['']
    );
    setEmailsForThreshold(
      latestThreshold.email?.split(',').map(email => email.trim()) || ['']
    );
  }, [metric, thresholds]);

  // If the time of toggle is set, start polling for the threshold timeframe to be met and reverse thresh_kill
  useEffect(() => {
    if (!toggleTimeAsDate) return;

    console.log('toggleTimeAsDate:', toggleTimeAsDate);
    const intervalId = setInterval(() => {
      const now = new Date();
      // const toggleTime = new Date(timeOfToggle);
      // console.log('now:', now, 'toggleTimeAsDate:', toggleTimeAsDate);
      if (now >= toggleTimeAsDate) {
        submitNewThresholdAfterPause();
        toast({
          title: 'Threshold pause ended.',
          description: 'Alerts are now active again.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
        clearInterval(intervalId); // Stop polling once the threshold is submitted
        setTimeOfToggle('');
        setToggleTimeAsDate('');
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [toggleTimeAsDate]);

  //Styling based on color mode
  const getBackgroundColor = () => 'gray.700';
  const getContentBackgroundColor = () =>
    colorMode === 'light' ? '#F0F4F8' : 'gray.800';
  const getChartBgColor = () =>
    colorMode === 'light' ? '#e0e0e0' : 'gray.800';
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

    // Use the newTimeframe if it's available, otherwise use the cleared timeframe when pause is off
    console.log('threshKill', threshKill);
    console.log('newTimeframe', newTimeframe);
    console.log('timeframe', timeframe);
    const timeOfPause = threshKill ? newTimeframe || timeframe : null; // Ensure `null` when threshKill is off
    console.log('timeOfPause', timeOfPause);

    try {
      // Perform Axios POST request to create the threshold
      await axios.post('/api/create_threshold', {
        metric,
        high: parseFloat(highThreshold),
        low: parseFloat(lowThreshold),
        phone: phoneNumbersString,
        email: emailsString,
        timestamp: timestamp,
        thresh_kill: threshKill, // Send the correct boolean
        timeframe: timeOfPause, // Send `null` if `threshKill` is off
      });

      console.log('Alerts Set or Cleared');
    } catch (error) {
      console.error('Error creating threshold:', error);
    } finally {
      setIsThresholdModalOpen(false);
    }
  };

  const submitNewThresholdAfterPause = async () => {
    const timestamp = new Date().toISOString();
    const phoneNumbersString = phoneNumbers.join(', ');
    const emailsString = emailsForThreshold.join(', ');

    try {
      // Create a new threshold with `thresh_kill` set to false and `timeframe` set to null
      await axios.post('/api/create_threshold', {
        metric,
        high: parseFloat(highThreshold),
        low: parseFloat(lowThreshold),
        phone: phoneNumbersString,
        email: emailsString,
        timestamp: timestamp,
        thresh_kill: false, // Turn off thresh_kill
        timeframe: null, // Clear the timeframe
      });
      console.log(
        'Threshold updated: thresh_kill turned off and timeframe cleared.'
      );
      // Optionally, you can update the state to reflect that the pause has ended
      setThreshKill(false);
      setTimeframe('');
    } catch (error) {
      console.error('Error submitting new threshold after pause:', error);
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
      // Create a new threshold with empty values to clear the current threshold
      await axios.post('/api/create_threshold', {
        metric,
        high: null, // Clear high threshold
        low: null, // Clear low threshold
        phone: '', // Clear phone numbers
        email: '', // Clear emails
        timestamp: timestamp,
        thresh_kill: false, // Ensure thresh_kill is off
        timeframe: null, // Clear timeframe
      });
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
      // Perform Axios DELETE request to delete the alert
      await axios.delete(`/api/delete_alert/${id}`);

      // Fetch alerts after deleting the alert
      await fetchAlertsThreshold();

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

  const groupedAlerts =
    Array.isArray(alertsThreshold) &&
    alertsThreshold?.reduce((acc, alert) => {
      const { metric } = alert;
      if (!acc[metric]) {
        acc[metric] = [];
      }
      acc[metric].push(alert);
      return acc;
    }, {});

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

  const handleTimePickerSubmit = () => {
    const hour = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);

    // Check if both hour and minute are 0
    if (hour === 0 && minute === 0) {
      toast({
        title: 'Invalid Timeframe',
        description: 'Please enter a valid hour or minute.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return; // Exit the function early
    }

    const timeframe = `${selectedHour}:${selectedMinute}:00`;
    console.log('Selected Timeframe:', timeframe);

    setIsTimePickerOpen(false); // Close the popover
    setNewTimeframe(timeframe); // Set the new timeframe
    setUserHasChosenTimeframe(true);
    let currentTime = new Date().toISOString();
    setNewTimeframe(timeframe);
    const calculatedTimeOfToggle = calculateTimeOfToggle(
      currentTime,
      timeframe
    );
    // Fix: only pass the formatted string to `timeOfToggle`
    setTimeOfToggle(calculatedTimeOfToggle?.formatted);

    // Keep the `date` part for comparisons
    setToggleTimeAsDate(calculatedTimeOfToggle?.date);
  };

  useEffect(() => {
    if (userHasChosenTimeframe) {
      handleFormSubmit(); // Call the form submit after the newTimeframe is updated
    }
  }, [userHasChosenTimeframe]);

  useEffect(() => {
    if (threshKill && !timeframe) {
      setIsTimePickerOpen(true);
    } else {
      setIsTimePickerOpen(false);
    }
  }, [threshKill, timeframe]);

  useEffect(() => {
    // Only trigger the form submission if the user actually changed the toggle
    if (!threshKill && threshKillChanged.current) {
      console.log('Form submitted thru switch to off threshKill');
      handleFormSubmit();
      threshKillChanged.current = false; // Reset the ref after the form is submitted
    }
  }, [threshKill]);

  const handleThreshKillToggle = () => {
    threshKillChanged.current = true; // Set this to true when the user interacts with the toggle

    if (!threshKill) {
      // When turning on the threshKill (pause)
      setThreshKill(true);
      setIsTimePickerOpen(true);
    } else {
      // When turning off the threshKill (pause)
      setThreshKill(false);
      setNewTimeframe('');
      setTimeframe('');
      setSelectedHour('');
      setSelectedMinute('');
      setTimeOfToggle('');

      console.log('ThreshKill toggled off?', false);
      console.log('New Timeframe cleared?', '');
      console.log('Timeframe cleared?', '');
      console.log('Selected Hour cleared?', '');
      console.log('Selected Minute cleared?', '');
      console.log('Time of Toggle cleared?', '');
    }
  };

  const calculateTimeOfToggle = (timestamp, timeframe) => {
    if (!timestamp || !timeframe) {
      console.error('Invalid timestamp or timeframe', { timestamp, timeframe });
      return null;
    }

    // Handle timeframe if it's an object
    if (typeof timeframe === 'object') {
      // Assuming the object contains properties like { minutes: 1 }
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = timeframe;
      timeframe = `${hours}:${minutes}:${seconds}`;
    }

    if (typeof timeframe !== 'string') {
      console.error('Invalid timeframe type, expected a string', { timeframe });
      return null;
    }

    const timestampDate = new Date(timestamp);
    if (isNaN(timestampDate)) {
      console.error('Invalid timestamp format', { timestamp });
      return null;
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (timeframe.includes('day')) {
      const dayMatch = timeframe.match(/(\d+) day/);
      if (dayMatch) {
        days = parseInt(dayMatch[1], 10);
      }

      const timePart = timeframe.split(', ')[1];
      [hours, minutes, seconds] = timePart.split(':').map(Number);
    } else {
      [hours, minutes, seconds] = timeframe.split(':').map(Number);
    }

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      console.error('Invalid timeframe format', { timeframe });
      return null;
    }

    const timeframeInMs =
      (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds) * 1000;
    const timeOfToggleDate = new Date(timestampDate.getTime() + timeframeInMs);

    return {
      formatted: format(timeOfToggleDate, 'hh:mm a (MMM d)'),
      date: timeOfToggleDate,
    };
  };

  return (
    <>
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
              <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                mt={-2}
                className="time-period-buttons"
              >
                {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map(timePeriod => (
                  <MotionButton
                    key={timePeriod}
                    variant="solid"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTimeButtonClick(timePeriod)}
                    bg={
                      currentTimePeriod === timePeriod ? '#3D5A80' : 'gray.100'
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
                bg={getChartBgColor()}
                p={4}
                borderRadius="md"
                boxShadow="md"
                border="2px solid #00BCD4"
                mb={4}
                h={'40vh'}
                className="chart-area"
              >
                {/* // If the data is still loading, show a loading spinner */}
                {loading ? (
                  <CircularProgress isIndeterminate color="blue.400" />
                ) : (
                  renderChart()
                )}
              </Flex>
              <Box
                display="flex"
                justifyContent="center"
                mb={4}
                className="chart-type-buttons"
              >
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
                  whileHover={{ scale: 1.1, bg: '#00BCD4' }}
                  whileTap={{ scale: 0.9 }}
                  bg={typeOfChart === 'line' ? '#3D5A80' : 'gray.100'}
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
                  bg={typeOfChart === 'bar' ? '#3D5A80' : 'gray.100'}
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
                  className="set-thresholds-button"
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
                  className="thresholds-display"
                >
                  {highThreshold || lowThreshold ? (
                    <>
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignContent={'center'}
                      >
                        <Text
                          fontSize="xl"
                          fontWeight="bold"
                          textDecor={'underline'}
                          pb="2"
                          // textAlign={'center'}
                          color="white"
                        >
                          Thresholds
                        </Text>
                        {timeOfToggle && (
                          <Text
                            color="white"
                            fontSize={'sm'}
                            whiteSpace={'nowrap'}
                            textDecor="underline"
                          >
                            Back on @ {timeOfToggle}
                          </Text>
                        )}
                      </Box>
                      <Flex
                        width={'100%'}
                        justify={'space-between'}
                        alignItems={'center'}
                        flexWrap={'nowrap'}
                      >
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
                        <Box
                          fontSize={['xs', 'md']}
                          ml={8}
                          mr={1}
                          color="white"
                          whiteSpace={'nowrap'}
                        >
                          Pause Threshold
                        </Box>
                        <Popover
                          isOpen={isTimePickerOpen}
                          onClose={() => setIsTimePickerOpen(false)}
                          closeOnBlur={false}
                          placement="top"
                          width={'auto'}
                        >
                          <PopoverTrigger>
                            <Switch
                              id="threshold-alerts"
                              isChecked={threshKill}
                              onChange={handleThreshKillToggle}
                              colorScheme={'blue'}
                            />
                          </PopoverTrigger>
                          <PopoverContent
                            width="auto"
                            maxWidth="fit-content"
                            border={'2px solid #3D5A80'}
                            // p={4}
                          >
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverBody mt={8}>
                              <Flex
                                alignItems={'center'}
                                justifyContent={'center'}
                                flexDirection="column"
                              >
                                <Flex
                                  alignItems={'center'}
                                  justifyContent={'center'}
                                  mb={4}
                                >
                                  <Box textAlign="center" mr={2}>
                                    <Input
                                      type="number"
                                      placeholder="HH"
                                      value={selectedHour}
                                      onChange={e =>
                                        setSelectedHour(e.target.value)
                                      }
                                      max={23}
                                      min={0}
                                      width="60px"
                                      textAlign={'center'}
                                      border={'2px solid #3D5A80'}
                                    />
                                    <FormLabel
                                      mt={1}
                                      ml={3}
                                      fontSize="sm"
                                      textAlign="center"
                                    >
                                      HOURS
                                    </FormLabel>
                                  </Box>
                                  <Text fontWeight="bold" mx={2} mb={8}>
                                    :
                                  </Text>
                                  <Box textAlign="center" ml={2}>
                                    <Input
                                      type="number"
                                      placeholder="MM"
                                      value={selectedMinute}
                                      onChange={e =>
                                        setSelectedMinute(e.target.value)
                                      }
                                      max={59}
                                      min={0}
                                      width="60px"
                                      textAlign={'center'}
                                      border={'2px solid #3D5A80'}
                                    />
                                    <FormLabel
                                      mt={1}
                                      ml={3}
                                      fontSize="sm"
                                      textAlign="center"
                                    >
                                      MINUTES
                                    </FormLabel>
                                  </Box>
                                </Flex>
                              </Flex>
                            </PopoverBody>
                            <PopoverFooter
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                            >
                              <Button
                                variant="blue"
                                width="100%"
                                mt={2}
                                onClick={() => {
                                  setThreshKill(true);
                                  setNewTimeframe('99 days'); // Set timeframe to "indefinite"
                                  setUserHasChosenTimeframe(true); // Submit the new threshold state
                                  setIsTimePickerOpen(false);
                                  setTimeOfToggle('Indefinitely Paused');
                                }}
                              >
                                Pause Indefinitely
                              </Button>
                              <Button
                                onClick={handleTimePickerSubmit}
                                variant="blue"
                                mt={2}
                              >
                                Pause Until Selected Timeframe
                              </Button>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
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
                          {groupedAlerts[metric]?.map((alert, index) => (
                            <Box
                              key={index}
                              bg="#cee8ff"
                              p={2}
                              borderRadius="md"
                              boxShadow="md"
                            >
                              <Flex
                                justify="space-between"
                                align="center"
                                mr={1}
                              >
                                <Text color="#212121">{alert.message}</Text>
                                <FaTrash
                                  color="#212121"
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
                  className="map-component"
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
        <Modal
          isOpen={isThresholdModalOpen}
          onClose={handleCloseThresholdModal}
        >
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
                      border={'2px solid #3D5A80'}
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
                      border={'2px solid #3D5A80'}
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
                  border={'2px solid #3D5A80'}
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
                  border={'2px solid #3D5A80'}
                  color={'#212121'}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Alert Frequency (Minutes)</FormLabel>
                <Select
                  placeholder="Select frequency"
                  value={alertFrequency}
                  onChange={e => setAlertFrequency(e.target.value)}
                  bg={'white'}
                  border={'2px solid #3D5A80'}
                  color={'#212121'}
                >
                  <option value="10">10 Minutes</option>
                  <option value="20">20 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="40">40 Minutes</option>
                  <option value="50">50 Minutes</option>
                  <option value="60">60 Minutes</option>
                </Select>
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
                borderRadius={'full'}
              >
                Clear Form
              </Button>
              <Button
                variant="solid"
                bg="gray.400"
                color="white"
                _hover={{ bg: 'gray.500' }}
                onClick={handleCloseThresholdModal}
                mr={3}
                borderRadius={'full'}
              >
                Cancel
              </Button>
              <Button variant="blue" color="black" onClick={handleFormSubmit}>
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default ChartExpandModal;
