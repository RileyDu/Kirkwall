import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { motion } from 'framer-motion';
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
  Popover,
  PopoverCloseButton,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Text
} from '@chakra-ui/react';
import { FaBars, FaSun, FaMoon, FaDog } from 'react-icons/fa';
import { WiThermometer, WiStrongWind, WiRain, WiHumidity } from 'react-icons/wi';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate } from 'react-router-dom';
import { useWeatherData } from '../WeatherDataContext';

const Header = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(true); // State to manage WeatherAlerts visibility
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false); // State to manage the summary modal visibility
  const { colorMode, toggleColorMode } = useColorMode();
  const { weatherData, loading, error, tempData, humidityData, windData, rainfallData, watchdogData } = useWeatherData();

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

  const summaryMetrics = [
    {
      label: 'Average Temperature @ GF (°F)',
      value: tempData
        ? (tempData.reduce((sum, data) => sum + data.temperature, 0) / tempData.length).toFixed(2)
        : weatherData
          ? (weatherData.reduce((sum, data) => sum + data.temperature, 0) / weatherData.length).toFixed(2)
          : 'N/A',
    },
    {
      label: 'Total Rainfall @ GF (inches)',
      value: rainfallData
        ? rainfallData.reduce((sum, data) => sum + data.rain_15_min_inches, 0).toFixed(2)
        : weatherData
          ? weatherData.reduce((sum, data) => sum + data.rain_15_min_inches, 0).toFixed(2)
          : 'N/A',
    },
    {
      label: 'Average Humidity @ GF (%)',
      value: humidityData
        ? (humidityData.reduce((sum, data) => sum + data.percent_humidity, 0) / humidityData.length).toFixed(2)
        : weatherData
          ? (weatherData.reduce((sum, data) => sum + data.percent_humidity, 0) / weatherData.length).toFixed(2)
          : 'N/A',
    },
    {
      label: 'Average Wind Speed @ GF (mph)',
      value: windData
        ? (windData.reduce((sum, data) => sum + data.wind_speed, 0) / windData.length).toFixed(2)
        : weatherData
          ? (weatherData.reduce((sum, data) => sum + data.wind_speed, 0) / weatherData.length).toFixed(2)
          : 'N/A',
    },
    // {
    //   label: 'Average Temperature @ Garage (mph)',
    //   value: watchdogData
    //     ? (windData.reduce((sum, data) => sum + data.temp, 0) / windData.length).toFixed(2)
    //     : watchdogData
    //       ? (watchdogData.reduce((sum, data) => sum + data.temp, 0) / watchdogData.length).toFixed(2)
    //       : 'N/A',
    // },
  ];

  const MotionIconButton = motion(IconButton);
  const MotionButton = motion(Button);

  const motionProps = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 50, damping: 10 }
  };

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
        <motion.div {...motionProps}>
          <Box>
            <img
              src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
              alt="kirkwall logo"
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            />
          </Box>
        </motion.div>
        <Flex align="center">
          <motion.div {...motionProps}>
            <MotionButton 
              onClick={onSummaryToggle} 
              size="sm" 
              mr="4"
              variant="sidebar"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSummaryOpen ? 'Hide Summary' : 'Show Summary'}
            </MotionButton>
          </motion.div>
          <motion.div {...motionProps}>
            <Tooltip label="Toggle Dark Mode">
              <MotionIconButton
                icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
                isRound
                size="lg"
                onClick={toggleColorMode}
                bg="transparent"
                color="whitesmoke"
                aria-label="Toggle Dark Mode"
                _hover={{ bg: 'transparent' }}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.9 }}
              />
            </Tooltip>
          </motion.div>
          {isLargerThan768 ? (
            user ? (
              <motion.div {...motionProps}>
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
                  <PopoverContent bg="brand.50" borderColor="#212121"  zIndex={1005}>
                    <PopoverCloseButton size="lg"  />
                    <PopoverHeader fontWeight="bold" fontSize="xl" bg="#212121" >Kirkwall</PopoverHeader>
                    <PopoverBody>
                      <Logout />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </motion.div>
            ) : null
          ) : (
            <motion.div {...motionProps}>
              <IconButton 
                icon={<FaBars />} 
                bg="transparent" 
                color="whitesmoke" 
                aria-label="Menu" 
                onClick={openDrawer} 
                ml="4"
              />
            </motion.div>
          )}
        </Flex>
      </Flex>

      <Drawer isOpen={!isLargerThan768 && isDrawerOpen} placement="left" onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Stack spacing={6} direction="column" alignItems="flex-start">
              <motion.div {...motionProps}>
                <Button
                  leftIcon={<WiThermometer size="24px" />}
                  onClick={() => handleNavigation('/TempSensors')}
                  {...buttonStyleProps}
                >
                  Temperature Sensors
                </Button>
              </motion.div>
              <motion.div {...motionProps}>
                <Button
                  leftIcon={<WiStrongWind size="24px" />}
                  onClick={() => handleNavigation('/WindSensors')}
                  {...buttonStyleProps}
                >
                  Wind Sensors
                </Button>
              </motion.div>
              <motion.div {...motionProps}>
                <Button
                  leftIcon={<WiRain size="24px" />}
                  onClick={() => handleNavigation('/RainSensors')}
                  {...buttonStyleProps}
                >
                  Rain Sensors
                </Button>
              </motion.div>
              <motion.div {...motionProps}>
                <Button
                  leftIcon={<WiHumidity size="24px" />}
                  onClick={() => handleNavigation('/HumiditySensors')}
                  {...buttonStyleProps}
                >
                  Humidity Sensors
                </Button>
                <motion.div {...motionProps}>
                <Button
                  leftIcon={<FaDog size="24px" />}
                  onClick={() => handleNavigation('/WatchdogSensors')}
                  {...buttonStyleProps}
                  mt={6}
                >
                  Watchdog Sensors
                </Button>
                </motion.div>
              </motion.div>
              {user && (
                <motion.div {...motionProps}>
                  <Button
                    leftIcon={<Avatar size="sm" name="Grand Farm Logo" src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`} />}
                    {...buttonStyleProps}
                    onClick={() => handleNavigation('/logout')}
                  >
                    Logout
                  </Button>
                </motion.div>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isSummaryOpen} onClose={onSummaryToggle}>
        <ModalOverlay />
        <ModalContent sx={{
          border: '2px solid black',
          bg: 'brand.50',
        }}>
          <ModalHeader bg={'#212121'} color={'white'}>Weather Summary</ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" height="100%">
                <Text>Loading...</Text>
              </Flex>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {summaryMetrics.map((metric, index) => (
                  <GridItem key={index}>
                    <Stat>
                      <StatLabel>{metric.label}</StatLabel>
                      <StatNumber>{metric.value}</StatNumber>
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
