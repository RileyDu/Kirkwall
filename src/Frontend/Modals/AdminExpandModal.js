// import { getAdminByEmail } from '../../Backend/Graphql_helper.js';
import React, { useEffect, useState } from 'react';
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
  Avatar,
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
  useQuery
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useWeatherData } from '../WeatherDataContext.js';
import AddInformationFormModal from './AddInformationFormModal.js';
import { getAdminById } from '../../Backend/Graphql_helper.js';

const MotionTabPanel = motion(TabPanel);

const AdminExpandModal = ({ isOpen, onClose, title, userEmail }) => {
  const [adminId, setAdminId] = useState(4);
  const { colorMode } = useColorMode();
  const dividerColor = colorMode === 'light' ? 'brand.50' : 'white';
  const { thresholds, alertsThreshold, fetchAlertsThreshold } = useWeatherData();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicture, setProfilePicture] = useState('/RookLogoWhite.png');
  const toast = useToast();

  const [isModalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');



  useEffect(() => {
    const fetchAdmin = async () => {
      try{
        const data = await getAdminById();
        // const stringData = JSON.stringify(data);
        // const parsedData = JSON.parse(stringData);

          setFirstName(data["data"]["admin"][0]["firstname"]);
          setLastName(data["data"]["admin"][0]["lastname"]);
          setPhone(data["data"]["admin"][0]["phone"]);
          setEmail(data["data"]["admin"][0]["email"]);
          setCompany(data["data"]["admin"][0]["company"]);
        // console.log(data["data"]["admin"][0]["firstname"])
      }catch(error){
        console.log(error)
      }
    };

    fetchAdmin();
  }, []);


  

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent 
          width="90%"
          maxWidth="100%"
          height="80vh"
          maxHeight="90vh"
        >
          <ModalHeader textAlign="center" bg="gray.700" mb="10px">
            <Heading color="white">
              {title}
            </Heading>
          </ModalHeader>
          
          <ModalCloseButton color="white" />
          
          <ModalBody>
            <Grid templateColumns="1fr auto 1fr" gap={6} height="100%">
              <GridItem w="100%" h="100%" border="5px solid #fd9801" p={3}>
                <Heading mb={3} fontSize="2xl">
                  Profile
                </Heading>
                
                <Flex alignItems="center">
                  <Box 
                    alignContent="center" textAlign="center" boxSize="150px" border="5px solid #fd9801" borderRadius="150px"
                  >
                    <Avatar   
                      boxSize="120px"
                      name="Kirkwall"
                      src={profilePicture}
                    />
                  </Box>
                  <Box ml={3}>
                    <Text fontSize="md" fontWeight="bold">Name: {firstName + " " + lastName}</Text>
                    <Text fontSize="md" fontWeight="bold">Phone: {phone}</Text>
                    <Text fontSize="md" fontWeight="bold">Email: {email}</Text>
                    <Text fontSize="md" fontWeight="bold">Company: {company}</Text>
                  </Box>
                </Flex> 

                <Box mt="7" ml={2} alignContent="center">
                  <Button as="label" cursor="pointer">
                    Upload Profile Photo
                    <Input type="file" display="none" onChange={handleFileChange} />
                  </Button>

                  <Button ml={5} onClick={handleOpenModal}>
                    Edit information
                  </Button>

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

              <GridItem>
                <Flex justify="center" height="100%">
                  <Divider 
                    orientation="vertical" 
                    border="solid"
                    borderColor="#fd9801" 
                    height="100%" 
                    borderWidth="2px"
                  />
                </Flex>
              </GridItem>

              <GridItem w="100%" h="100%" border="5px solid #fd9801" p={3}>
                <Box>
                  <Heading justifyContent="center" mb={3} fontSize="2xl">
                    Threshold Logs
                  </Heading>
                  
                  <Tabs variant="soft-rounded" colorScheme="orange">
                    <TabList mb="4">
                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Temperature
                      </Tab>
                      
                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Humidity
                      </Tab>
                        
                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Wind
                      </Tab>
                      
                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Soil Moisture
                      </Tab>

                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Leaf Wetness
                      </Tab>

                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Rainfall
                      </Tab>

                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Watchdog Temperature
                      </Tab>
                      
                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Watchdog Humidity
                      </Tab>

                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Rivercity Temperature
                      </Tab>

                      <Tab
                        fontSize={{ base: 'xs', md: 'sm' }}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        _selected={{ color: 'white', bg: 'orange.400' }}
                      >
                        Rivercity Humidity
                      </Tab>

                    </TabList>
                    
                    <Divider mt={'1'} w={'100%'} />
                    
                    <TabPanels>
                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="temperature-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["temperature"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["temperature"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>

                      </MotionTabPanel>
                        
                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="humidity-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["percent_humidity"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["percent_humidity"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="wind-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>
                        
                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="soil-moisture-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["rain_15_min_inches"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["rain_15_min_inches"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="leaf-wetness-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["soil_moisture"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["soil_moisture"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="rainfall-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="watchdog-temperature-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="watchdog-humidity-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="rivercity-temperature-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                      <MotionTabPanel
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                        key="rivercity-humidity-logs"
                      >
                        <Box maxH="360px" overflowY="auto">
                          {alertsThreshold["wind_speed"]?.length ? (
                            <Stack spacing={2}>
                              {alertsThreshold["wind_speed"].map((alert, index) => (
                                <Box key={index} bg="orange.400" p={2} borderRadius="md" boxShadow="md">
                                  <Flex justify="space-between" align="center">
                                    <Text color="#212121" fontSize="sm">{alert.message}</Text>
                                  </Flex>
                                </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Text fontSize="xl">No logs to show</Text>
                        )}
                      </Box>
                      </MotionTabPanel>

                    </TabPanels>
                  </Tabs>
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminExpandModal;
