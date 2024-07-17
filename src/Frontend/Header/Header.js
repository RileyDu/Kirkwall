import React, { useState, useEffect } from 'react';
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
  Text,
} from '@chakra-ui/react';
import {
  FaBars,
  FaSun,
  FaMoon,
  FaDog,
  FaGlobe,
  FaSnowflake,
} from 'react-icons/fa';
import { GiGroundSprout } from 'react-icons/gi';
import { FiAlertTriangle } from 'react-icons/fi';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate } from 'react-router-dom';
import { useWeatherData } from '../WeatherDataContext';
import WeatherAlerts from '../Alert/WeatherAlerts';
import { useAuth } from '../AuthComponents/AuthContext';


const Header = ({ isMinimized, isVisible, toggleAlerts }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  // const [user] = useAuthState(auth);
  const navigate = useNavigate();
  // const [showAlerts, setShowAlerts] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [customerRole, setCustomerRole] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    weatherData,
    loading,
    error,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
  } = useWeatherData();

  // const toggleAlerts = () => {
  //   setShowAlerts(!showAlerts);
  // };

  const { currentUser } = useAuth();
  const user = currentUser;
  const userEmail = user ? user.email : 'default';

  useEffect(() => {
    if (user) {
      if (user.email === 'pmo@grandfarm.com') {
        setCustomerRole('gf');
      } else if (user.email === 'jerrycromarty@imprimedicine.com') {
        setCustomerRole('imprimed');
      } else if (user.email === 'russell@rjenergysolutions.com') {
        setCustomerRole('rj');
      }
      else {
        setCustomerRole('default');
      }
    }
  }, [user]);

  const buttonConfig = {
    'pmo@grandfarm.com': [
      { icon: <WiThermometer size="30" />, label: 'Temperature', route: '/TempSensors' },
      { icon: <WiHumidity size="30" />, label: 'Humidity', route: '/HumiditySensors' },
      { icon: <WiStrongWind size="30" />, label: 'Wind', route: '/WindSensors' },
      { icon: <GiGroundSprout size="30" />, label: 'Soil', route: '/SoilMoistureSensors' },
      { icon: <WiRain size="30" />, label: 'Rain', route: '/RainSensors' },
      { icon: <FaGlobe size="30" />, label: 'Map', route: '/grandfarm/map' }
  
    ],
    'jerrycromarty@imprimedicine.com': [
      { icon: <FaSnowflake size="30" />, label: 'Rivercity', route: '/RivercitySensors' },
      { icon: <FaGlobe size="30" />, label: 'Map', route: '/imprimed/map' }
    ],
    'russell@rjenergysolutions.com': [
      { icon: <FaSnowflake size="30" />, label: 'Rivercity', route: '/RivercitySensors' },
      { icon: <FaGlobe size="30" />, label: 'Map', route: '/rjenergy/map' }
    ],
    'default': [
      { icon: <WiThermometer size="30" />, label: 'Temperature', route: '/TempSensors' },
      { icon: <WiHumidity size="30" />, label: 'Humidity', route: '/HumiditySensors' },
      { icon: <WiStrongWind size="30" />, label: 'Wind', route: '/WindSensors' },
      { icon: <GiGroundSprout size="30" />, label: 'Soil', route: '/SoilMoistureSensors' },
      { icon: <WiRain size="30" />, label: 'Rain', route: '/RainSensors' },
      { icon: <FaDog size="30" />, label: 'Watchdog', route: '/WatchdogSensors' },
      { icon: <FaSnowflake size="30" />, label: 'Rivercity', route: '/RivercitySensors' },
      { icon: <FaGlobe size="30" />, label: 'Map', route: '/map' }
    ]
  };

  const renderButtons = () => {
    const buttons = buttonConfig[userEmail] || buttonConfig['default'];
    return buttons.map((button, index) => (
      <motion.div {...motionProps}>
                <Button
                  key={index}
                  leftIcon={button.icon}
                  onClick={() => navigate(button.route)}
                  {...buttonStyleProps}
                >
                  {button.label}
                </Button>
              </motion.div>
    ))
  };

  const handleUserNavigation = () => {
    switch (customerRole) {
      case 'gf':
        navigate('/grandfarm');
        break;
      case 'imprimed':
        navigate('/imprimed');
        break;
      case 'rj':
        navigate('/rjenergy');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = path => {
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
    bg: '#F4B860',
    color: '#212121',
    _hover: {
      bg: '#d7a247',
    },
    boxShadow: 'md',
  };

  const summaryMetrics = [
    {
      label: 'Average Temp (°F)',
      value: tempData
        ? (
            tempData.reduce((sum, data) => sum + data.temperature, 0) /
            tempData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.temperature, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Humidity (%)',
      value: humidityData
        ? (
            humidityData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            humidityData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },

    {
      label: 'Average Wind Speed (mph)',
      value: windData
        ? (
            windData.reduce((sum, data) => sum + data.wind_speed, 0) /
            windData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.wind_speed, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Total Rainfall (inches)',
      value: rainfallData
        ? rainfallData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : weatherData
        ? weatherData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : 'N/A',
    },{
      label: 'Average Leaf Wetness (0-15)',
      value: leafWetnessData
        ? (
            leafWetnessData
              .reduce((sum, data) => sum + data.leaf_wetness, 0) /
            leafWetnessData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData
              .reduce((sum, data) => sum + data.leaf_wetness, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Soil Moisture (centibars)',
      value: soilMoistureData
        ? (
            soilMoistureData
              .reduce((sum, data) => sum + data.soil_moisture, 0) /
            soilMoistureData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData
              .reduce((sum, data) => sum + data.soil_moisture, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    }
  ];

  const MotionIconButton = motion(IconButton);
  const MotionButton = motion(Button);

  const motionProps = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 50, damping: 10 },
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
        borderBottom="3px solid #F4B860"
        height="64px"
      >
        <motion.div {...motionProps}>
          <Box>
            <img
              src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
              alt="kirkwall logo"
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
              onClick={() => handleUserNavigation()}
            />
          </Box>
        </motion.div>
        <Flex align="center">
          {currentUser && currentUser.email !== 'jerrycromarty@imprimedicine.com' && currentUser.email !== 'russell@rjenergysolutions.com' && (
            <motion.div {...motionProps}>
              <MotionButton
                onClick={onSummaryToggle}
                size={{ base: 'xs', md: 'md' }}
                px={{ base: 4, md: 6 }}
                mr="4"
                variant="sidebar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                bg="#F4B860"
                color="black"
              >
                {isSummaryOpen ? 'Hide Summary' : ' Weather Summary'}
              </MotionButton>
            </motion.div>
          )}
          {isLargerThan768 && (
            <motion.div {...motionProps}>
              <Tooltip label="Toggle Weather Alerts">
                <MotionIconButton
                  icon={<FiAlertTriangle />}
                  isRound
                  size="lg"
                  onClick={toggleAlerts}
                  bg="transparent"
                  color="whitesmoke"
                  aria-label="Toggle Weather Alerts"
                  _hover={{ bg: 'transparent' }}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 0.9 }}
                />
              </Tooltip>
            </motion.div>
          )}
          <motion.div {...motionProps}>
            <Tooltip label="Toggle Dark Mode">
              <MotionIconButton
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
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
                      name="User Logo"
                      src={
                        currentUser.email === 'pmo@grandfarm.com'
                          ? '/GrandFarmLogo.jpg'
                          : currentUser.email ===
                            'jerrycromarty@imprimedicine.com'
                          ? '/ImpriMedLogo.png'
                          : currentUser.email === 'russell@rjenergysolutions.com'
                          ? '/RJLogo.jpeg'
                          : '/RookLogoWhite.png'
                      }
                      cursor="pointer"
                      ml="4"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    bg="#2D3748"
                    borderColor="#F4B860"
                    zIndex={1005}
                  >
                    <PopoverCloseButton size="lg" />
                    <PopoverHeader
                      fontWeight="bold"
                      fontSize="xl"
                      bg="#212121"
                      color="white"
                    >
                      {currentUser.email === 'pmo@grandfarm.com'
                        ? 'Grand Farm'
                        : currentUser.email === 'jerrycromarty@imprimedicine.com'
                        ? 'ImpriMed'
                        : 'Kirkwall'}
                    </PopoverHeader>
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

      <Drawer
        isOpen={!isLargerThan768 && isDrawerOpen}
        placement="left"
        onClose={closeDrawer}
      >
        <DrawerOverlay />
        <DrawerContent bg="#2D3748" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderBottomColor="#F4B860">
            Menu
          </DrawerHeader>
          <DrawerBody color={'#212121'}>
            <Stack spacing={6} direction="column" alignItems="flex-start">
              {renderButtons()}
              {user && (
                <motion.div {...motionProps}>
                  <Button
                    leftIcon={
                      <Avatar
                        size="sm"
                        name="Grand Farm Logo"
                        src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`}
                      />
                    }
                    {...buttonStyleProps}
                    onClick={() => handleNavigation('/landing')}
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
        <ModalContent
          sx={{
            border: '2px solid black',
            bg: '#2D3748',
          }}
        >
          <ModalHeader bg={'#212121'} color={'white'}>
            Weather Summary
          </ModalHeader>
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
                      <StatLabel color="white" textDecoration={'underline'}>{metric.label}</StatLabel>
                      <StatNumber color="white">{metric.value}</StatNumber>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {isVisible && isLargerThan768 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WeatherAlerts
            isVisible={isVisible}
            onClose={toggleAlerts}
            isMinimized={isMinimized}
          />
        </motion.div>
      )}
    </>
  );
};

export default Header;
