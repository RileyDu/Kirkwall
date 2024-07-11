import { Flex, Stack, Button, Box, IconButton, useColorMode } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { FaDog, FaChevronLeft, FaChevronRight, FaGlobe, FaSnowflake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

const Sidebar = ({ isMinimized, toggleSidebar, isMobileMenuOpen, toggleMobileMenu }) => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const sidebarVariants = {
    collapsed: {
      width: '80px',
      transition: {
        width: { duration: 0.2, ease: 'easeInOut' },
      },
    },
    expanded: {
      width: '250px',
      transition: {
        width: { duration: 0.2, ease: 'easeInOut' },
      },
    },
  };

  return (
    <MotionFlex
      as="aside"
      bg="#212121"
      position="fixed"
      top="0"
      left="0"
      height="100%"
      variants={sidebarVariants}
      initial={isMinimized ? 'collapsed' : 'expanded'}
      animate={isMinimized ? 'collapsed' : 'expanded'}
      zIndex="1000"
      flexShrink={0}
      flexDirection="column"
      display={{ base: isMobileMenuOpen ? 'flex' : 'none', md: 'flex' }}
      pt={isMinimized ? '0' : '64px'}  // Add padding to prevent overlap with header
    >
      <Box overflowY="auto" height="100%">
        <Stack
          flex="1"
          py={{ base: '6', sm: '8' }}
          px={{ base: '4', sm: '6' }}
          bg="#212121"
          color="white"
          justifyContent="flex-start"
        >
          {isMinimized ? (
            <MinimizedSidebarContent navigate={navigate} toggleSidebar={toggleSidebar} colorMode={colorMode} />
          ) : (
            <SidebarContent navigate={navigate} colorMode={colorMode} />
          )}
        </Stack>
      </Box>
      <Box mt="auto" p="4" justifyContent={'center'} display={'flex'}>
        <MotionIconButton
          icon={isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
          onClick={toggleSidebar}
          aria-label={isMinimized ? 'Expand' : 'Minimize'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          bg="#F4B860"
          color="black"
        />
      </Box>
    </MotionFlex>
  );
};

const SidebarContent = ({ navigate, colorMode }) => (
  <>
    <MotionButton
      leftIcon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Temperature Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Wind Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Rain Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Humidity Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Watchdog Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<FaSnowflake size="30" />}
      onClick={() => navigate('/RivercitySensors')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Rivercity Sensors
    </MotionButton>
    <MotionButton
      leftIcon={<FaGlobe size="30" />}
      onClick={() => navigate('/map')}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Sensor Map
    </MotionButton>
  </>
);

const MinimizedSidebarContent = ({ navigate, toggleSidebar, colorMode }) => (
  <MotionStack spacing="4" mt={16}>
    <MotionIconButton
      icon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      aria-label="Temperature Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      aria-label="Wind Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      aria-label="Rain Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      aria-label="Humidity Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      aria-label="Watchdog Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
        <MotionIconButton
      icon={<FaSnowflake size="30" />}
      onClick={() => navigate('/RivercitySensors')}
      aria-label="Rivercity Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
    <MotionIconButton
      icon={<FaGlobe size="30" />}
      onClick={() => navigate('/map')}
      aria-label="Sensor Map"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg="#F4B860"
      color="black"
      _hover={{ bg: '#d7a247' }}
    />
  </MotionStack>
);

export default Sidebar;