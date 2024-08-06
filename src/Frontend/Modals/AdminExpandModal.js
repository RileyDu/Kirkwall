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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useWeatherData } from '../WeatherDataContext.js';
import AddInformationFormModal from './AddInformationFormModal.js';
import { getAdminByEmail, getIdByEmail, updateProfileUrl} from '../../Backend/Graphql_helper.js';

const MotionTabPanel = motion(TabPanel);

const AdminExpandModal = ({ isOpen, onClose, title, userEmail }) => {

  const [adminId, setAdminId] = useState();
  const { colorMode } = useColorMode();
  const dividerColor = colorMode === 'light' ? 'brand.50' : 'white';
  const { thresholds, alertsThreshold, fetchAlertsThreshold } = useWeatherData();
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

  const uploadImage = (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "v0b3yxc7");

    axios.post("https://api.cloudinary.com/v1_1/dklraztco/image/upload", formData)
      .then((response) => {
        console.log(response);
        const uploadedImageUrl = response.data.secure_url;
        setUploadedImageUrl(uploadedImageUrl);

        const userId = adminId;

        updateProfileUrl(userId, firstName, lastName, email, phone, company, threshKill, uploadedImageUrl)
          .then((graphqlResponse) => {
            console.log("Profile URL updated:", graphqlResponse);
            if (graphqlResponse.data) {
              console.log("Updated Admin Data:", graphqlResponse.data.update_admin);
            }
            if (graphqlResponse.errors) {
              console.error("Errors:", graphqlResponse.errors);
            }
          })
          .catch((graphqlError) => {
            console.log("Error updating profile URL:", graphqlError);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getAdminByEmail(userEmail);
        setAdminId(data["data"]["admin"][0]["id"])
        setFirstName(data["data"]["admin"][0]["firstname"]);
        setLastName(data["data"]["admin"][0]["lastname"]);
        setPhone(data["data"]["admin"][0]["phone"]);
        setEmail(data["data"]["admin"][0]["email"]);
        setCompany(data["data"]["admin"][0]["company"]);
        setThreshKill(data["data"]["admin"][0]["thresh_kill"]);
        setUploadedImageUrl(data["data"]["admin"][0]["profile_url"]);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdmin();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const userConfig = {
    'pmo@grandfarm.com': ['Temperature', 'Humidity', 'Wind Speed', 'Soil Moisture', 'Leaf Wetness', 'Rainfall'],
    'jerrycromarty@imprimedicine.com': ['Rivercity Temperature', 'Rivercity Humidity'],
    'russell@rjenergysolutions.com': ['Rivercity Temperature', 'Rivercity Humidity'],
    'trey@watchdogprotect.com': ['Watchdog Temperature', 'Watchdog Humidity'],
    'test@kirkwall.io': ['Temperature', 'Humidity', 'Wind Speed', 'Soil Moisture', 'Leaf Wetness', 'Rainfall', 'Watchdog Temperature', 'Watchdog Humidity', 'Rivercity Temperature', 'Rivercity Humidity']
  };


  // const userId = {
  //   'pmo@grandfarm.com': ['Temperature', 'Humidity', 'Wind Speed', 'Soil Moisture', 'Leaf Wetness', 'Rainfall'],
  //   'jerrycromarty@imprimedicine.com': ['Rivercity Temperature', 'Rivercity Humidity'],
  //   'russell@rjenergysolutions.com': ['Rivercity Temperature', 'Rivercity Humidity'],
  //   'trey@watchdogprotect.com': ['Watchdog Temperature', 'Watchdog Humidity'],
  //   'test@kirkwall.io': ['Temperature', 'Humidity', 'Wind Speed', 'Soil Moisture', 'Leaf Wetness', 'Rainfall', 'Watchdog Temperature', 'Watchdog Humidity', 'Rivercity Temperature', 'Rivercity Humidity']
  // };

  const tabsToRender = userConfig[userEmail] || [];

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

          <ModalBody overflowY="auto">
            <Box overflowY="auto">
              <Grid templateColumns={{ base: '1fr', md: '1fr auto 1fr' }} gap={6} height="100%">
                <GridItem w="100%" h="100%" border="5px solid #fd9801" p={3}>
                  <Heading mb={3} fontSize="2xl">
                    Profile
                  </Heading>

                  <Flex alignItems="center">
                    <Box
                      alignContent="center" textAlign="center" boxSize="150px" border="5px solid #fd9801" borderRadius="150px"
                    >
                      <Image cloudName="dklraztco" publicId={uploadedImageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </Box>
                    <Box ml={3}>
                      {/* <p>{getIdByEmail("test@kirkwall.io")}</p> */}
                      <Text fontSize="md" fontWeight="bold">Name: {firstName + " " + lastName}</Text>
                      <Text fontSize="md" fontWeight="bold">Phone: {phone}</Text>
                      <Text fontSize="md" fontWeight="bold">Email: {email}</Text>
                      <Text fontSize="md" fontWeight="bold">Company: {company}</Text>
                    </Box>
                  </Flex>

                  <Box mt="7" ml={2} alignContent="center">
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                      <Button as="label" cursor="pointer">
                        Upload Profile Photo
                        <Input type="file" display="none" onChange={uploadImage} />
                      </Button>

                      <Button onClick={handleOpenModal}>
                        Edit information
                      </Button>
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

                    <Tabs variant="soft-rounded" colorScheme="orange" isFitted>
                      <TabList mb="4" overflowX="auto">
                        {tabsToRender.map((tabName, index) => (
                          <Tab
                            key={index}
                            fontSize={{ base: 'xs', md: 'sm' }}
                            p={{ base: '2', md: '3' }}
                            color={colorMode === 'light' ? 'black' : 'white'}
                            _selected={{ color: 'white', bg: 'orange.400' }}
                          >
                            {tabName}
                          </Tab>
                        ))}
                      </TabList>

                      <Divider mt={'1'} w={'100%'} />

                      <TabPanels>
                        {tabsToRender.map((tabName, index) => (
                          <MotionTabPanel
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Box maxH="360px" overflowY="auto">
                              {alertsThreshold[tabName.toLowerCase().replace(/ /g, '_')]?.length ? (
                                <Stack spacing={2}>
                                  {alertsThreshold[tabName.toLowerCase().replace(/ /g, '_')].map((alert, index) => (
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
                        ))}
                      </TabPanels>
                    </Tabs>
                  </Box>
                </GridItem>
              </Grid>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AdminExpandModal;
