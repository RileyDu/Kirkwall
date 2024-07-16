import { Flex, Stack, Button, Box, IconButton, Image, useColorMode, Icon } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { FaDog, FaGlobe, FaSnowflake, FaChessRook,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import { GiGroundSprout } from "react-icons/gi";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeatherData } from '../WeatherDataContext';

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

const Sidebar = ({ isMinimized, toggleSidebar, isMobileMenuOpen, statusOfAlerts }) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const { loading } = useWeatherData();

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

  return (
    <MotionFlex
      as="aside"
      bg="gray.800"
      position="fixed"
      // top="54px" // Adjust to the header height
      left="2"
      height="calc(90%-64px)" // Adjust to the header height
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="20px"
      variants={sidebarVariants}
      initial={isMinimized ? 'collapsed' : 'expanded'}
      animate={isMinimized ? 'collapsed' : 'expanded'}
      zIndex="1000"
      flexShrink={0}
      flexDirection="column"
      display={{ base: isMobileMenuOpen ? 'flex' : 'none', md: 'flex' }}
      pt={isMinimized ? '0' : '20px'} // Add padding to prevent overlap with header
      mt={statusOfAlerts ? '2rem' : '6rem'  }
    >
      <Box overflowY="auto" height="100%">
        {isMinimized ? (
          <Box mb={'-4rem'} p="4" display="flex" justifyContent="center">
            <img
                src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`}
                alt="kirkwall logo"
                style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              />
          </Box>
        ) : (
          <motion.div >
            <Box ml={'2rem'}>
              <img
                src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
                alt="kirkwall logo"
                style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                onClick={() => navigate('/')}
              />
            </Box>
          </motion.div>
        )}
        <Stack
          flex="1"
          py={{ base: '6', sm: '8' }}
          px={{ base: '2', sm: '4' }}
          bg="transparent"
          color="white"
          justifyContent="center"
        >
          {isMinimized ? (
            <MinimizedSidebarContent navigate={navigate} toggleSidebar={toggleSidebar} colorMode={colorMode}/>
          ) : (
            <SidebarContent navigate={navigate} colorMode={colorMode} />
          )}
        </Stack>
      </Box>
      <Box mt="auto" p="4" justifyContent={'center'} display={'flex'}>
        <IconButton
          icon={<Box 
                  as={motion.div}
                  initial={isMinimized ? { rotate: 180 } : { rotate: 0 }}
                  animate={isMinimized ? { rotate: 0 } : { rotate: 180 }}
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

const SidebarContent = ({ navigate }) => (
  <>
    <MotionButton
      leftIcon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Temperature
    </MotionButton>
    <MotionButton
      leftIcon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Wind
    </MotionButton>
    <MotionButton
      leftIcon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Rain
    </MotionButton>
    <MotionButton
      leftIcon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Humidity
    </MotionButton>
    <MotionButton
      leftIcon={<GiGroundSprout size="30" />}
      onClick={() => navigate('/SoilMoistureSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Soil
    </MotionButton>
    <MotionButton
      leftIcon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Watchdog
    </MotionButton>
    <MotionButton
      leftIcon={<FaSnowflake size="30" />}
      onClick={() => navigate('/RivercitySensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Rivercity
    </MotionButton>
    <MotionButton
      leftIcon={<FaGlobe size="30" />}
      onClick={() => navigate('/map')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Map
    </MotionButton>
  </>
);

const MinimizedSidebarContent = ({ navigate }) => (
  <MotionStack spacing="4" mt={16} >
    <MotionIconButton
      icon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      aria-label="Temperature"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      aria-label="Wind"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      aria-label="Rain"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      aria-label="Humidity"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<GiGroundSprout size="30" />}
      onClick={() => navigate('/SoilMoistureSensors')}
      aria-label="Soil"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      aria-label="Watchdog"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<FaSnowflake size="30" />}
      onClick={() => navigate('/RivercitySensors')}
      aria-label="Rivercity"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<FaGlobe size="30" />}
      onClick={() => navigate('/map')}
      aria-label="Map"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
  </MotionStack>
);

export default Sidebar;
