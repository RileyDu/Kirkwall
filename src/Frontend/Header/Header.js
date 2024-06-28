import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { 
  useMediaQuery, 
  Flex, 
  Box, 
  IconButton, 
  Avatar, 
  Button, 
  Drawer, 
  DrawerOverlay, 
  DrawerContent, 
  DrawerCloseButton, 
  DrawerHeader, 
  DrawerBody, 
  Stack, 
  Tooltip, 
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Popover,
  PopoverCloseButton,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Text
} from '@chakra-ui/react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { WiThermometer, WiStrongWind, WiRain, WiHumidity } from 'react-icons/wi';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate } from 'react-router-dom';
import WeatherAlerts from '../Alert/WeatherAlerts';
import { useWeatherData } from '../WeatherDataContext';



const Header = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(true); // State to manage WeatherAlerts visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false); // State to manage the summary modal visibility
  const { colorMode, toggleColorMode } = useColorMode();
  const { weatherData, loading, error } = useWeatherData();

  const toggleAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeDrawer();
  };

  const onSummaryToggle = () => {
    setSummaryOpen(!isSummaryOpen);
  };

  const buttonStyleProps = {
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    fontSize: 'md',
    borderRadius: 'md',
    mb: 4,
    bg: '#fd9801',
    color: 'white',
    _hover: {
      bg: '#e38800',
    },
    boxShadow: 'md',
  };

  const summaryMetrics = weatherData
    ? [
        {
          label: 'Average Temperature (°F)',
          value: (weatherData.reduce((sum, data) => sum + data.temperature, 0) / weatherData.length).toFixed(2),
        },
        {
          label: 'Total Rainfall (inches)',
          value: weatherData.reduce((sum, data) => sum + data.rain_15_min_inches, 0).toFixed(2),
        },
        {
          label: 'Average Humidity (%)',
          value: (weatherData.reduce((sum, data) => sum + data.percent_humidity, 0) / weatherData.length).toFixed(2),
        },
        {
          label: 'Average Wind Speed (mph)',
          value: (weatherData.reduce((sum, data) => sum + data.wind_speed, 0) / weatherData.length).toFixed(2),
        },
      ]
    : [
        { label: 'Average Temperature (°F)', value: 'N/A' },
        { label: 'Total Rainfall (inches)', value: 'N/A' },
        { label: 'Average Humidity (%)', value: 'N/A' },
        { label: 'Average Wind Speed (mph)', value: 'N/A' },
      ];

  return (
    <>
      <Flex
        bg="#212121"
        color="white"
        px="4"
        py="2"
        align="center"
        justify="space-between"
        position="fixed"
        top="0"
        left="0"
        width="100%"
        zIndex="1001"
        borderBottom="3px solid #fd9801"
        height="64px"
      >
        <Box>
          <img
            src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
            alt="kirkwall logo"
            style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </Box>
        <Flex align="center">
          <Button 
            onClick={onSummaryToggle} 
            size="sm" 
            mr="4"
            colorScheme="orange"
          >
            {isSummaryOpen ? 'Hide Summary' : 'Show Summary'}
          </Button>
          <Tooltip label="Toggle Dark Mode">
            <IconButton
              icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
              isRound
              size="lg"
              onClick={toggleColorMode}
              bg="transparent"
              color="whitesmoke"
              aria-label="Toggle Dark Mode"
            />
          </Tooltip>
          {isLargerThan768 ? (
            user ? (
              <Popover>
                <PopoverTrigger>
                  <Avatar
                    size="md"
                    name="Grand Farm Logo"
                    src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`}
                    cursor="pointer"
                    ml="4"
                  />
                </PopoverTrigger>
                <PopoverContent bg="white" borderColor="#212121" zIndex={1005}>
                  <PopoverCloseButton size="lg" />
                  <PopoverHeader fontWeight="bold" fontSize="xl" bg="#fd9801">Kirkwall</PopoverHeader>
                  <PopoverBody>
                    {/* <Button onClick={toggleAlerts} w="100%" size="lg" borderRadius="full" fontSize="xl">
                      TOGGLE ALERTS
                    </Button> */}
                    <Logout />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            ) : null
          ) : (
            <IconButton 
              icon={<FaBars />} 
              bg="transparent" 
              color="whitesmoke" 
              aria-label="Menu" 
              onClick={openDrawer} 
              ml="4"
            />
          )}
        </Flex>
      </Flex>
      {/* {showAlerts && <WeatherAlerts isVisible={showAlerts} onClose={toggleAlerts} />} Conditionally render WeatherAlerts */}

      <Drawer isOpen={!isLargerThan768 && isDrawerOpen} placement="left" onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Stack spacing={6} direction="column" alignItems="flex-start">
              <Button
                leftIcon={<WiThermometer size="24px" />}
                onClick={() => handleNavigation('/TempSensors')}
                {...buttonStyleProps}
              >
                Temperature Sensors
              </Button>
              <Button
                leftIcon={<WiStrongWind size="24px" />}
                onClick={() => handleNavigation('/WindSensors')}
                {...buttonStyleProps}
              >
                Wind Sensors
              </Button>
              <Button
                leftIcon={<WiRain size="24px" />}
                onClick={() => handleNavigation('/RainSensors')}
                {...buttonStyleProps}
              >
                Rain Sensors
              </Button>
              <Button
                leftIcon={<WiHumidity size="24px" />}
                onClick={() => handleNavigation('/HumiditySensors')}
                {...buttonStyleProps}
              >
                Humidity Sensors
              </Button>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isSummaryOpen} onClose={onSummaryToggle}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Weather Summary</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" height="100%">
                <Text>Loading...</Text>
              </Flex>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {summaryMetrics.map((metric, index) => (
                  <GridItem key={index}>
                    <Stat>
                      <StatLabel>{metric.label}</StatLabel>
                      <StatNumber>{metric.value}</StatNumber>
                      <StatHelpText>Summary of data</StatHelpText>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Header;