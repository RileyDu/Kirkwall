import { Flex, Stack, Button, Box, IconButton, useColorMode } from '@chakra-ui/react';
import { WiThermometer, WiStrongWind, WiRain, WiHumidity } from 'react-icons/wi';
import { FaDog, FaGlobe, FaSnowflake, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { GiGroundSprout } from "react-icons/gi";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeatherData } from '../WeatherDataContext';
import { useAuth } from '../AuthComponents/AuthContext';
import { useEffect, useState } from 'react';

const MotionFlex = motion(Flex);
const MotionStack = motion(Stack);
const MotionIconButton = motion(IconButton);
const MotionButton = motion(Button);


const buttonStyleProps = {
  justifyContent: 'flex-start',
  width: '100%',
  alignItems: 'center',
  fontSize: 'md',
  borderRadius: 'md',
  mb: 4,
  bg: '#F4B860',
  color: 'black',
  _hover: {
    bg: '#d7a247',
  },
  boxShadow: 'md',
};

const motionProps = {
  initial: { opacity: 0, x: '-100%' },
  animate: { opacity: 1, x: 0 },
  transition: { type: 'spring', stiffness: 50, damping: 10 },
};

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
  'trey@watchdogprotect.com': [
    { icon: <WiThermometer size="30" />, label: 'Temperature', route: '/TempSensors' },
    { icon: <WiHumidity size="30" />, label: 'Humidity', route: '/HumiditySensors' },
    { icon: <WiStrongWind size="30" />, label: 'Wind', route: '/WindSensors' },
    { icon: <GiGroundSprout size="30" />, label: 'Soil', route: '/SoilMoistureSensors' },
    { icon: <WiRain size="30" />, label: 'Rain', route: '/RainSensors' },
    { icon: <FaDog size="30" />, label: 'Watchdog', route: '/WatchdogSensors' },
    { icon: <FaSnowflake size="30" />, label: 'Rivercity', route: '/RivercitySensors' },
    { icon: <FaGlobe size="30" />, label: 'Map', route: '/map' }
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

const Sidebar = ({ isMinimized, toggleSidebar, isMobileMenuOpen, statusOfAlerts }) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { loading } = useWeatherData();
  const [customerRole, setCustomerRole] = useState('');

  // Fetch current user email
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
      } else if (user.email === 'trey@watchdogprotect.com') {
        setCustomerRole('wdp');
      } 
      else {
        setCustomerRole('default');
      }
    }
  }, [user]);

  const handleNavigation = () => {
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
      case 'wdp':
        navigate('/watchdogprotect');
        break;
      default:
        navigate('/');
        break;
    }
  };

  const sidebarVariants = {
    collapsed: {
      width: '80px',
      transition: {
        width: { duration: 0.2, ease: 'easeInOut' },
      },
    },
    expanded: {
      width: '190px',
      transition: {
        width: { duration: 0.2, ease: 'easeInOut' },
      },
    },
  };

  if (loading) {
    return null;
  }

  const renderButtons = (isMinimized) => {
    const buttons = buttonConfig[userEmail] || buttonConfig['default'];
    return isMinimized ? (
      <MinimizedSidebarContent buttons={buttons} navigate={navigate} />
    ) : (
      <SidebarContent buttons={buttons} navigate={navigate} />
    );
  };

  return (
    <MotionFlex
      as="aside"
      bg="gray.800"
      position="fixed"
      left="2"
      height="calc(90%-64px)"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="20px"
      variants={sidebarVariants}
      initial={isMinimized ? 'collapsed' : 'expanded'}
      animate={isMinimized ? 'collapsed' : 'expanded'}
      zIndex="1000"
      flexShrink={0}
      flexDirection="column"
      display={{ base: isMobileMenuOpen ? 'flex' : 'none', md: 'flex' }}
      pt={isMinimized ? '0' : '20px'}
      mt={statusOfAlerts ? '2rem' : '6rem'}
    >
      <Box overflowY="auto" height="100%" overflowX="hidden">
        {isMinimized ? (
          <Box mb={'-4rem'} p="4" display="flex" justifyContent="center">
            <img
              src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`}
              alt="kirkwall logo"
              style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
              onClick={() => handleNavigation()}
            />
          </Box>
        ) : (
          <motion.div >
            <Box ml={'2rem'}>
              <img
                src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
                alt="kirkwall logo"
                style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                onClick={() => handleNavigation()}
              />
            </Box>
          </motion.div>
        )}
        <Stack
          flex="1"
          py={{ base: '6', sm: '8' }}
          px={{ base: '2', sm: '5' }}
          bg="transparent"
          color="white"
          justifyContent="center"
        >
          {renderButtons(isMinimized)}
        </Stack>
      </Box>
      <Box mt="auto" p="4" justifyContent={'center'} display={'flex'}>
        <IconButton
          icon={<Box 
            as={motion.div}
            initial={isMinimized ? { rotate: 0 } : { rotate: 360 }}
            animate={isMinimized ? { rotate: 360 } : { rotate: 0 }}
          >
            {isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
          </Box>}
          onClick={toggleSidebar}
          aria-label={isMinimized ? 'Expand' : 'Minimize'}
          bg="#F4B860"
          color="black"
          _hover={{ bg: '#d7a247' }}
          _focus={{ boxShadow: 'none' }}
          size="lg"
          rounded="full"
        />
      </Box>
    </MotionFlex>
  );
};

const SidebarContent = ({ buttons, navigate }) => (
  <>
    {buttons.map((btn, index) => (
      <MotionButton
        key={index}
        leftIcon={btn.icon}
        onClick={() => navigate(btn.route)}
        {...buttonStyleProps}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {btn.label}
      </MotionButton>
    ))}
  </>
);

const MinimizedSidebarContent = ({ buttons, navigate }) => (
  <MotionStack spacing="4" mt={16} >
    {buttons.map((btn, index) => (
      <MotionIconButton
        key={index}
        icon={btn.icon}
        onClick={() => navigate(btn.route)}
        aria-label={btn.label}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        bg="#F4B860"
        color="black"
        _hover={{ bg: '#d7a247' }}
      />
    ))}
  </MotionStack>
);

export default Sidebar;
