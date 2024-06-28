import { Flex, Stack, Button, Box, IconButton } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
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
  bg: '#fd9801',
  color: 'white',
  _hover: {
    bg: '#e38800',
  },
  boxShadow: 'md',
};

const Sidebar = ({ isMinimized, toggleSidebar, isMobileMenuOpen, toggleMobileMenu }) => {
  const navigate = useNavigate();

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
            <MinimizedSidebarContent navigate={navigate} toggleSidebar={toggleSidebar} />
          ) : (
            <SidebarContent navigate={navigate} />
          )}
        </Stack>
      </Box>
      <Box mt="auto" p="4" justifyContent={'center'} display={'flex'}>
        <IconButton
          icon={isMinimized ? <FaChevronRight /> : <FaChevronLeft />}
          onClick={toggleSidebar}
          color="white"
          // _hover={{ color: 'black' }}
          aria-label={isMinimized ? 'Expand' : 'Minimize'}
          variant={'pill'}
        />
      </Box>
    </MotionFlex>
  );
};

const SidebarContent = ({ navigate }) => (
  <>
    <MotionButton
      variant="outline"
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
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
      variant="outline"
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
      variant="outline"
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
      variant="outline"
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
  </>
);

const MinimizedSidebarContent = ({ navigate, toggleSidebar }) => (
  <MotionStack spacing="4" mt={16}>
    <MotionIconButton
      icon={<WiThermometer size="30" />}
      onClick={() => navigate('/TempSensors')}
      aria-label="Temperature Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
    <MotionIconButton
      icon={<WiStrongWind size="30" />}
      onClick={() => navigate('/WindSensors')}
      aria-label="Wind Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
    <MotionIconButton
      icon={<WiRain size="30" />}
      onClick={() => navigate('/RainSensors')}
      aria-label="Rain Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
    <MotionIconButton
      icon={<WiHumidity size="30" />}
      onClick={() => navigate('/HumiditySensors')}
      aria-label="Humidity Sensors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    />
    {/* <MotionIconButton
      icon={toggleSidebar ? <FaChevronLeft /> : <FaChevronRight />}
      onClick={toggleSidebar}
      color="white"
      _hover={{ bg: 'white', color: 'black' }}
      aria-label={toggleSidebar ? 'Minimize' : 'Expand'}
      variant={'pill'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
    /> */}
  </MotionStack>
);

export default Sidebar;
