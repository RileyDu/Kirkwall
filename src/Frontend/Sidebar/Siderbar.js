import { Flex, Stack, Button, Box, IconButton, useColorMode } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { FaDog } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  bg: 'brand.400',
  color: '#212121',
  _hover: {
    bg: 'brand.800',
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
            <MinimizedSidebarContent navigate={navigate} toggleSidebar={toggleSidebar} colorMode={colorMode}/>
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
          variant={'pill'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          bg={'brand.400'}
        />
      </Box>
    </MotionFlex>
  );
};

const SidebarContent = ({ navigate, colorMode }) => (
  <>
    <MotionButton
      variant="sidebar"
      leftIcon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      justifyContent="flex-start"
      fontSize={'md'}
      mt={16}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Temperature Sensors
    </MotionButton>
    <MotionButton
      variant="sidebar"
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
      leftIcon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      justifyContent="flex-start"
      fontSize={'md'}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Wind Sensors
    </MotionButton>
    <MotionButton
      variant="sidebar"
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
      leftIcon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      justifyContent="flex-start"
      fontSize={'md'}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Rain Sensors
    </MotionButton>
    <MotionButton
      variant="sidebar"
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
      leftIcon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      justifyContent="flex-start"
      fontSize={'md'}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Humidity Sensors
    </MotionButton>
    <MotionButton
      variant="sidebar"
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
      leftIcon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      justifyContent="flex-start"
      fontSize={'md'}
      {...buttonStyleProps}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      Watchdog Sensors
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
      bg={'brand.400'}
      border={'2px solid #fd9801'}
      _hover={{ bg: 'brand.800' }}
      color={colorMode === 'light' ? 'black' : 'black'}
    />
    <MotionIconButton
      icon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      aria-label="Wind Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg={'brand.400'}
      border={'2px solid #fd9801'}
      _hover={{ bg: 'brand.800' }}
      color={colorMode === 'light' ? 'black' : 'black'}

    />
    <MotionIconButton
      icon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      aria-label="Rain Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg={'brand.400'}
      border={'2px solid #fd9801'}
      _hover={{ bg: 'brand.800' }}
      color={colorMode === 'light' ? 'black' : 'black'}

    />
    <MotionIconButton
      icon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      aria-label="Humidity Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg={'brand.400'}
      border={'2px solid #fd9801'}
      _hover={{ bg: 'brand.800' }}
      color={colorMode === 'light' ? 'black' : 'black'}

    />
        <MotionIconButton
      icon={<FaDog size="30" />}
      onClick={() => navigate('/WatchdogSensors')}
      aria-label="Watchdog Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      bg={'brand.400'}
      border={'2px solid #fd9801'}
      _hover={{ bg: 'brand.800' }}
      color={colorMode === 'light' ? 'black' : 'black'}

    />
  </MotionStack>
);

export default Sidebar;
