import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../services/api.js';
import { Image } from 'cloudinary-react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Grid,
  GridItem,
  Text,
  Heading,
  Flex,
  Divider,
  useColorMode,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  useToast,
  IconButton,
  useBreakpointValue,
  FormControl,
  FormLabel,
  ModalFooter,
  Spinner,
  useMediaQuery,
  Select,
  Switch,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useWeatherData } from '../WeatherDataContext.js';
import AddInformationFormModal from './AddInformationFormModal.js';
import FaqsModal from './FaqsModal.js';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
const MotionTabPanel = motion(TabPanel);

const AdminExpandModal = ({ isOpen, onClose, userEmail }) => {
  const [adminId, setAdminId] = useState();
  const { colorMode } = useColorMode();
  const { thresholds, alertsThreshold } = useWeatherData();
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [threshKill, setThreshKill] = useState(false);
  const [timeframe, setTimeframe] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');

  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const [isFaqsModalOpen, setFaqsModalOpen] = useState(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  const [title, setTitle] = useState('Temperature (°F)');
  const [phoneNumbers, setPhoneNumbers] = useState(['']);
  const [emailsForThreshold, setEmailsForThreshold] = useState(['']);
  const [highThreshold, setHighThreshold] = useState('');
  const [lowThreshold, setLowThreshold] = useState('');
  const [metric, setMetric] = useState('temperature');

  const handleOpenThresholdModal = () => setIsThresholdModalOpen(true);
  const handleCloseThresholdModal = () => setIsThresholdModalOpen(false);
  const [selectedTab, setSelectedTab] = useState(0); // State to manage active tab

  const getModalBackgroundColor = () =>
    colorMode === 'light' ? 'whitesmoke' : 'gray.700';

  const [alertsLastHour, setAlertsLastHour] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const gridTemplateColumns = useBreakpointValue({
    base: '1fr', // Single column on small screens
    md: 'repeat(2, 1fr)', // Two columns on medium and larger screens
  });

  // Responsive modal size
  const modalWidth = useBreakpointValue({ base: '95%', md: '90%' });
  const modalHeight = useBreakpointValue({ base: '95vh', md: '85vh' });

  useEffect(() => {
    const fetchAlertsLastHour = async () => {
      setLoadingAlerts(true);
      try {
        const response = await api.get('/api/alerts_last_hour'); // Use Axios to call the new backend route
        const result = response.data;
        console.log('result', result);
        if (result && result.length > 0) {
          // Filter alerts based on userConfig
          const userMetrics =
            userConfig[userEmail]?.map(config => config.metric) || [];
          const filteredAlerts = result.filter(alert =>
            userMetrics.includes(alert.metric)
          );
          setAlertsLastHour(filteredAlerts);
          console.log('filteredAlerts', filteredAlerts);
        } else {
          setAlertsLastHour([]);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
        setAlertsLastHour([]);
      } finally {
        setLoadingAlerts(false);
      }
    };

    fetchAlertsLastHour();
  }, []); // Make sure userConfig is a dependency as it's used here

  // Send threshold data to the backend
  const handleFormSubmit = async () => {
    const timestamp = new Date().toISOString();
    const phoneNumbersString = phoneNumbers.join(', '); // Join phone numbers into a single string
    const emailsString = emailsForThreshold.join(', '); // Join emails into a single string

    try {
      // Perform Axios POST request to create the threshold
      await api.post('/api/create_threshold', {
        metric,
        high: parseFloat(highThreshold),
        low: parseFloat(lowThreshold),
        phone: phoneNumbersString,
        email: emailsString,
        timestamp: timestamp,
        thresh_kill: threshKill, // Send the correct boolean
        timeframe: null, // Send `null` if `threshKill` is off
      });

      console.log('Alerts Set or Cleared');
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
      // Create a new threshold with empty values to clear the current threshold
      await api.post('/api/create_threshold', {
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

  const uploadImage = async event => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'v0b3yxc7');

    try {
      // Upload image to Cloudinary
      const cloudinaryResponse = await api.post(
        'https://api.cloudinary.com/v1_1/dklraztco/image/upload',
        formData
      );
      const uploadedImageUrl = cloudinaryResponse.data.secure_url;
      setUploadedImageUrl(uploadedImageUrl);

      const userId = adminId;

      // Send the updated profile URL and other admin data to the backend
      const response = await api.put(`/api/update_profile_url/${userId}`, {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        company: company,
        thresh_kill: threshKill,
        profile_url: uploadedImageUrl,
      });

      console.log('Profile URL updated:', response.data);
    } catch (error) {
      console.error('Error uploading image or updating profile URL:', error);
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await api.get(`/api/admin_email`,{
          email: userEmail
        });
        const data = response.data;

        setAdminId(data.id);
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setPhone(data.phone);
        setEmail(data.email);
        setCompany(data.company);
        setThreshKill(data.thresh_kill);
        setUploadedImageUrl(data.profile_url);

        console.log(data); // Logging the admin data
      } catch (error) {
        console.error('Error fetching admin by email:', error);
      }
    };

    fetchAdmin();
  }, [userEmail]); // Add userEmail as a dependency so it updates when the email changes

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

  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000)
    .toISOString()
    .replace('Z', '.000000+00:00');

  const handleOpenFaqsModal = () => setFaqsModalOpen(true);
  const handleCloseFaqsModal = () => setFaqsModalOpen(false);

  const userConfig = {
    'pmo@grandfarm.com': [
      { label: 'Temperature', metric: 'temperature' },
      { label: 'Humidity', metric: 'percent_humidity' },
      { label: 'Wind Speed', metric: 'wind_speed' },
      { label: 'Soil Moisture', metric: 'soil_moisture' },
      { label: 'Leaf Wetness', metric: 'leaf_wetness' },
      { label: 'Rainfall', metric: 'rain_15_min_inches' },
    ],
    'jerrycromarty@imprimedicine.com': [
      { label: 'Freezer #1 Temp', metric: 'imFreezerOneTemp' },
      { label: 'Freezer #1 Hum', metric: 'imFreezerOneHum' },
      { label: 'Freezer #2 Temp', metric: 'imFreezerTwoTemp' },
      { label: 'Freezer #2 Hum', metric: 'imFreezerTwoHum' },
      { label: 'Freezer #3 Temp', metric: 'imFreezerThreeTemp' },
      { label: 'Freezer #3 Hum', metric: 'imFreezerThreeHum' },
      { label: 'Fridge #1 Temp', metric: 'imFridgeOneTemp' },
      { label: 'Fridge #1 Hum', metric: 'imFridgeOneHum' },
      { label: 'Fridge #2 Temp', metric: 'imFridgeTwoTemp' },
      { label: 'Fridge #2 Hum', metric: 'imFridgeTwoHum' },
      { label: 'Incu #1 Temp', metric: 'imIncubatorOneTemp' },
      { label: 'Incu #1 Hum', metric: 'imIncubatorOneHum' },
      { label: 'Incu #2 Temp', metric: 'imIncubatorTwoTemp' },
      { label: 'Incu #2 Hum', metric: 'imIncubatorTwoHum' },
    ],
    'russell@rjenergysolutions.com': [
      { label: 'Rivercity Temperature', metric: 'rctemp' },
      { label: 'Rivercity Humidity', metric: 'humidity' },
    ],
    'trey@watchdogprotect.com': [
      { label: 'Watchdog Temperature', metric: 'temp' },
      { label: 'Watchdog Humidity', metric: 'hum' },
    ],
    'test@kirkwall.io': [
      { label: 'Temperature (Watchdog)', metric: 'temp' },
      { label: 'Humidity (Watchdog)', metric: 'hum' },
      { label: 'Temperature (Rivercity)', metric: 'rctemp' },
      { label: 'Humidity (Rivercity)', metric: 'humidity' },
      { label: 'Temperature (GF)', metric: 'temperature' },
      { label: 'Humidity (GF)', metric: 'percent_humidity' },
      { label: 'Wind Speed (GF)', metric: 'wind_speed' },
      { label: 'Soil Moisture (GF)', metric: 'soil_moisture' },
      { label: 'Leaf Wetness (GF)', metric: 'leaf_wetness' },
      { label: 'Rainfall (GF)', metric: 'rain_15_min_inches' },
    ],
  };

  const metricToName = {
    temperature: 'Temperature',
    percent_humidity: 'Humidity',
    wind_speed: 'Wind',
    soil_moisture: 'Soil Moisture',
    leaf_wetness: 'Leaf Wetness',
    rain_15_min_inches: 'Rainfall',
    temp: 'Temperature (Watchdog)',
    hum: 'Humidity (Watchdog)',
    rctemp: 'Temperature (Rivercity)',
    humidity: 'Humidity (Rivercity)',
    imFreezerOneTemp: 'Freezer #1 Temp (°C)',
    imFreezerOneHum: 'Freezer #1 Humidity (%)',
    imFreezerTwoTemp: 'Freezer #2 Temp (°C)',
    imFreezerTwoHum: 'Freezer #2 Humidity (%)',
    imFreezerThreeTemp: 'Freezer #3 Temp (°C)',
    imFreezerThreeHum: 'Freezer #3 Humidity (%)',
    imFridgeOneTemp: 'Fridge #1 Temp (°C)',
    imFridgeOneHum: 'Fridge #1 Humidity (%)',
    imFridgeTwoTemp: 'Fridge #2 Temp (°C)',
    imFridgeTwoHum: 'Fridge #2 Humidity (%)',
    imIncubatorOneTemp: 'Incubator #1 Temp (°C)',
    imIncubatorOneHum: 'Incubator #1 Humidity (%)',
    imIncubatorTwoTemp: 'Incubator #2 Temp (°C)',
    imIncubatorTwoHum: 'Incubator #2 Humidity (%)',
  };
  const nameToMetric = Object.fromEntries(
    Object.entries(metricToName).map(([key, value]) => [
      value.toLowerCase(),
      key,
    ])
  );

  const MotionIconButton = motion(IconButton);
  const MotionButton = motion(Button);

  // Map tabs to render based on user configuration
  const tabsToRender = userConfig[userEmail] || [];

  const handleTabChange = index => {
    const { metric, label } = tabsToRender[index];
    setMetric(metric);
    setTitle(label);
    setSelectedTab(index); // Update the selected tab index state
  };

  // Group alerts by metric

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

  // Function to toggle threshold kill for DB and local state
  const handleThreshKillToggle = async () => {
    const newThreshKill = !threshKill; // Toggle the current value
    setThreshKill(newThreshKill); // Update local state

    try {
      const id = adminId;
      // Send the updated value to the database using Axios PUT request
      await api.put(`/api/update_admin/${id}`, {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        company: company,
        thresh_kill: newThreshKill, // Send the toggled thresh_kill value
      });

      toast({
        title: 'Threshold alerts updated.',
        description: `Threshold alerts have been ${
          newThreshKill ? 'disabled' : 'enabled'
        }.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating threshold kill:', error);

      toast({
        title: 'Error',
        description: 'Failed to update threshold alerts.',
        status: 'error',
        duration: 3000,
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
          width={modalWidth}
          height={modalHeight}
          maxWidth="100%"
          maxHeight="100vh"
        >
          <ModalHeader textAlign="center" bg="gray.700" mb="10px">
            <Heading color="white">Admin Panel</Heading>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody overflowY="auto">
            <Box height="100%">
              <Grid
                templateRows="auto 1fr"
                templateColumns={gridTemplateColumns}
                gap={6}
                height="100%"
              >
                <GridItem border="5px solid #cee8ff" p={3}>
                  <Heading mb={3} fontSize="2xl">
                    Profile
                  </Heading>
                  <Flex alignItems="center">
                    <Box
                      alignContent="center"
                      textAlign="center"
                      boxSize="150px"
                      border="5px solid #cee8ff"
                      borderRadius="150px"
                    >
                      <Image
                        cloudName="dklraztco"
                        publicId={uploadedImageUrl}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '50%',
                        }}
                      />
                    </Box>
                    <Box ml={3}>
                      <Text fontSize={['sm', 'md']}>
                        <strong>User:</strong> {firstName + ' ' + lastName}
                      </Text>
                      <Text fontSize={['sm', 'md']}>
                        <strong>Company:</strong> {company}
                      </Text>
                      <Text fontSize={['sm', 'md']}>
                        <strong>Phone:</strong> {phone}
                      </Text>
                      <Flex alignItems="baseline">
                        <Text fontSize={['sm', 'md']} fontWeight="bold">
                          Email:
                        </Text>
                        <Text fontSize={['10px', 'md']} ml={1}>
                          {email}
                        </Text>
                      </Flex>
                      <Text fontSize={['sm', 'md']}>
                        <strong>Thresholds Enabled:</strong>{' '}
                        {threshKill ? 'No' : 'Yes'}
                      </Text>
                    </Box>
                  </Flex>
                  <Box mt="7" ml={2} alignContent="center">
                    <Stack
                      direction={{ base: 'column', md: 'row' }}
                      spacing={4}
                    >
                      <Button as="label" cursor="pointer">
                        Change Profile Picture
                        <Input
                          type="file"
                          display="none"
                          onChange={uploadImage}
                        />
                      </Button>
                      <Button onClick={handleOpenModal}>Edit Details</Button>
                    </Stack>
                    <AddInformationFormModal
                      isOpen={isModalOpen}
                      onClose={handleCloseModal}
                      id={adminId}
                      firstName={firstName}
                      lastName={lastName}
                      phone={phone}
                      email={email}
                      company={company}
                      setFirstName={setFirstName}
                      setLastName={setLastName}
                      setPhone={setPhone}
                      setEmail={setEmail}
                      setCompany={setCompany}
                    />
                  </Box>
                </GridItem>

                <GridItem border="5px solid #cee8ff" p={3}>
                  <Heading mb={3} fontSize="2xl">
                    Alerts in the Last Hour
                  </Heading>

                  {loadingAlerts ? (
                    <Spinner size="lg" />
                  ) : alertsLastHour.length > 0 ? (
                    <Stack spacing={2}>
                      {Object.entries(
                        alertsLastHour.reduce((acc, alert) => {
                          acc[alert.metric] = (acc[alert.metric] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([metric, count], index) => (
                        <>
                          <Box
                            key={index}
                            bg="#cee8ff"
                            p={2}
                            borderRadius="md"
                            boxShadow="md"
                          >
                            <Text fontSize="md" color="#212121">
                              {metricToName[metric]} - {count} alert
                              {count > 1 ? 's' : ''}
                            </Text>
                          </Box>
                          <Divider mt={2} />
                        </>
                      ))}
                    </Stack>
                  ) : (
                    <Text fontSize="lg">No alerts found in the last hour.</Text>
                  )}
                </GridItem>

                <GridItem
                  colSpan={isLargerThan768 ? 2 : 1}
                  border="5px solid #cee8ff"
                  p={3}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={5}
                  >
                    <Heading fontSize="2xl">Threshold Logs</Heading>
                    <Box>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="threshold-alerts" mb="1" ml={1}>
                          PAUSE ALL THRESHOLDS
                        </FormLabel>
                        <Switch
                          id="threshold-alerts"
                          mb="1"
                          isChecked={threshKill}
                          onChange={handleThreshKillToggle}
                          colorScheme={'blue'}
                        />
                      </FormControl>
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
                  </Flex>
                  {isLargerThan768 && (
                    <Tabs
                      variant="solid-rounded"
                      colorScheme="gray"
                      isFitted
                      onChange={handleTabChange}
                    >
                      <TabList mb="4" overflowX="auto">
                        {tabsToRender.map((tab, index) => (
                          <Tab
                            key={index}
                            fontSize={{ base: 'xs', md: 'sm' }}
                            p={{ base: '2', md: '3' }}
                            // _selected={{ color: 'white', bg: 'orange.400' }}
                          >
                            {tab.label}
                          </Tab>
                        ))}
                      </TabList>

                      <Divider mt={'1'} w={'100%'} />
                      <TabPanels>
                        {tabsToRender.map((tab, index) => (
                          <MotionTabPanel
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Box maxH="300px" h={'300px'} overflowY="scroll">
                              {groupedAlerts[tab.metric]?.length ? (
                                <Stack spacing={2}>
                                  {groupedAlerts[tab.metric].map(
                                    (alert, alertIndex) => (
                                      <Box
                                        key={alertIndex}
                                        bg="#cee8ff"
                                        p={2}
                                        borderRadius="md"
                                        boxShadow="md"
                                      >
                                        <Flex
                                          justify="space-between"
                                          align="center"
                                        >
                                          <Text color="#212121" fontSize="sm">
                                            {alert.message}
                                          </Text>
                                        </Flex>
                                      </Box>
                                    )
                                  )}
                                </Stack>
                              ) : (
                                <Text fontSize="xl">No logs to show</Text>
                              )}
                            </Box>
                          </MotionTabPanel>
                        ))}
                      </TabPanels>
                    </Tabs>
                  )}
                  {!isLargerThan768 && (
                    <Box>
                      <Select
                        value={selectedTab}
                        onChange={e => handleTabChange(Number(e.target.value))}
                        mb="4"
                      >
                        {tabsToRender.map((tab, index) => (
                          <option key={index} value={index}>
                            {tab.label}
                          </option>
                        ))}
                      </Select>
                      <Box maxH="175px" h={'175px'} overflowY="scroll">
                        {alertsThreshold[tabsToRender[selectedTab]?.metric]
                          ?.length ? (
                          <Stack spacing={2}>
                            {alertsThreshold[
                              tabsToRender[selectedTab]?.metric
                            ].map((alert, alertIndex) => (
                              <Box
                                key={alertIndex}
                                bg="orange.400"
                                p={2}
                                borderRadius="md"
                                boxShadow="md"
                              >
                                <Flex justify="space-between" align="center">
                                  <Text color="#212121" fontSize="sm">
                                    {alert.message}
                                  </Text>
                                </Flex>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                    </Box>
                  )}
                </GridItem>
              </Grid>
            </Box>
          </ModalBody>
          {/* <Flex justifyContent="flex-end" p={3}>
            <MotionIconButton
              icon={<FaQuestion />}
              variant="outline"
              color="#212121"
              height={10}
              width={10}
              bg={'brand.400'}
              _hover={{ bg: 'brand.800' }}
              border={'2px solid #fd9801'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              ml={2}
              onClick={handleOpenFaqsModal}
            />
          </Flex> */}
        </ModalContent>
      </Modal>
      <FaqsModal isOpen={isFaqsModalOpen} onClose={handleCloseFaqsModal} />

      <Modal isOpen={isThresholdModalOpen} onClose={handleCloseThresholdModal}>
        <ModalOverlay />
        <ModalContent
          sx={{ border: '2px solid black', bg: getModalBackgroundColor() }}
        >
          <ModalHeader bg={'gray.800'} color={'white'}>
            Set Thresholds for {title}
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

export default AdminExpandModal;
