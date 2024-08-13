import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { FaBell, FaExpandAlt, FaQuestion } from 'react-icons/fa/index.esm.js';
import { motion } from 'framer-motion';
import { useWeatherData } from '../WeatherDataContext.js';
import AddInformationFormModal from './AddInformationFormModal.js';
import {
  getAdminByEmail,
  updateProfileUrl,
  createThreshold,
  getThresholdsInTheLastHour,
  updateAdmin,
} from '../../Backend/Graphql_helper.js';
import FaqsModal from './FaqsModal.js';
import SetThresholdsModal from './SetThresholdsModal.js';

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

  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const [isFaqsModalOpen, setFaqsModalOpen] = useState(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  const [title, setTitle] = useState('Temperature (°F)');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userEmailForThreshold, setUserEmailForThreshold] = useState('');
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
        const result = await getThresholdsInTheLastHour();
        if (result && result.data && result.data.alerts) {
          // Filter alerts based on userConfig
          const userMetrics =
            userConfig[userEmail]?.map(config => config.metric) || [];
          const filteredAlerts = result.data.alerts.filter(alert =>
            userMetrics.includes(alert.metric)
          );
          setAlertsLastHour(filteredAlerts);
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
  }, [userEmail]);

  const handleFormSubmit = async () => {
    const timestamp = new Date().toISOString();
    const phoneNumbersString = phoneNumbers.join(', '); // Join phone numbers into a single string
    try {
      await createThreshold(
        metric,
        parseFloat(highThreshold),
        parseFloat(lowThreshold),
        phoneNumbersString,
        userEmailForThreshold,
        timestamp
      );
      console.log('Alerts Set');
    } catch (error) {
      console.error('Error creating threshold:', error);
    } finally {
      setIsThresholdModalOpen(false);
    }
  };

  const handleFormClear = async () => {
    const timestamp = new Date().toISOString();
    setHighThreshold('');
    setLowThreshold('');
    setPhoneNumber('');
    setUserEmailForThreshold('');
    try {
      await createThreshold(
        metric,
        highThreshold,
        lowThreshold,
        phoneNumber,
        userEmailForThreshold,
        timestamp
      );
    } catch (error) {
      console.error('Error clearing threshold:', error);
    } finally {
      setIsThresholdModalOpen(false);
    }
  };

  const uploadImage = event => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'v0b3yxc7');

    axios
      .post('https://api.cloudinary.com/v1_1/dklraztco/image/upload', formData)
      .then(response => {
        console.log(response);
        const uploadedImageUrl = response.data.secure_url;
        setUploadedImageUrl(uploadedImageUrl);

        const userId = adminId;
        updateProfileUrl(
          userId,
          firstName,
          lastName,
          email,
          phone,
          company,
          threshKill,
          uploadedImageUrl
        )
          .then(graphqlResponse => {
            console.log('Profile URL updated:', graphqlResponse);
            if (graphqlResponse.data) {
              console.log(
                'Updated Admin Data:',
                graphqlResponse.data.update_admin
              );
            }
            if (graphqlResponse.errors) {
              console.error('Errors:', graphqlResponse.errors);
            }
          })
          .catch(graphqlError => {
            console.log('Error updating profile URL:', graphqlError);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getAdminByEmail(userEmail);
        setAdminId(data['data']['admin'][0]['id']);
        setFirstName(data['data']['admin'][0]['firstname']);
        setLastName(data['data']['admin'][0]['lastname']);
        setPhone(data['data']['admin'][0]['phone']);
        setEmail(data['data']['admin'][0]['email']);
        setCompany(data['data']['admin'][0]['company']);
        setThreshKill(data['data']['admin'][0]['thresh_kill']);
        setUploadedImageUrl(data['data']['admin'][0]['profile_url']);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdmin();
  }, []);

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
    setPhoneNumber(latestThreshold.phone);
    setUserEmailForThreshold(latestThreshold.email);
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
      { label: 'Temperature', metric: 'temperature' },
      { label: 'Humidity', metric: 'percent_humidity' },
      { label: 'Wind Speed', metric: 'wind_speed' },
      { label: 'Soil Moisture', metric: 'soil_moisture' },
      { label: 'Leaf Wetness', metric: 'leaf_wetness' },
      { label: 'Rainfall', metric: 'rain_15_min_inches' },
      { label: 'Temperature (Watchdog)', metric: 'temp' },
      { label: 'Humidity (Watchdog)', metric: 'hum' },
      { label: 'Temperature (Rivercity)', metric: 'rctemp' },
      { label: 'Humidity (Rivercity)', metric: 'humidity' },
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

  // Function to toggle threshold kill for DB and local state
  const handleThreshKillToggle = async () => {
    const newThreshKill = !threshKill; // Toggle the current value
    setThreshKill(newThreshKill); // Update local state

    try {
      const id = adminId;
      // Send the updated value to the database
      await updateAdmin(id, firstName, lastName, email, phone, company, newThreshKill);
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
    const handleRemovePhoneNumber = (index) => {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    };
  
    // Update phone number value
    const handlePhoneNumberChange = (value, index) => {
      const updatedPhoneNumbers = [...phoneNumbers];
      updatedPhoneNumbers[index] = value;
      setPhoneNumbers(updatedPhoneNumbers);
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
                <GridItem border="5px solid #fd9801" p={3}>
                  <Heading mb={3} fontSize="2xl">
                    Profile
                  </Heading>
                  <Flex alignItems="center">
                    <Box
                      alignContent="center"
                      textAlign="center"
                      boxSize="150px"
                      border="5px solid #fd9801"
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

                <GridItem border="5px solid #fd9801" p={3}>
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
                            bg="orange.400"
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
                  border="5px solid #fd9801"
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
                          PAUSE THRESHOLDS
                        </FormLabel>
                        <Switch
                          id="threshold-alerts"
                          mb="1"
                          isChecked={threshKill}
                          onChange={handleThreshKillToggle}
                          colorScheme={'orange'}
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
                      variant="soft-rounded"
                      colorScheme="orange"
                      isFitted
                      onChange={handleTabChange}
                    >
                      <TabList mb="4" overflowX="auto">
                        {tabsToRender.map((tab, index) => (
                          <Tab
                            key={index}
                            fontSize={{ base: 'xs', md: 'sm' }}
                            p={{ base: '2', md: '3' }}
                            color={colorMode === 'light' ? 'black' : 'white'}
                            _selected={{ color: 'white', bg: 'orange.400' }}
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
                              {alertsThreshold[tab.metric]?.length ? (
                                <Stack spacing={2}>
                                  {alertsThreshold[tab.metric].map(
                                    (alert, alertIndex) => (
                                      <Box
                                        key={alertIndex}
                                        bg="orange.400"
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
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                bg={'white'}
                border={'2px solid #fd9801'}
                color={'#212121'}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                value={userEmailForThreshold}
                onChange={e => setUserEmailForThreshold(e.target.value)}
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
