import { Flex, Stack, Button, Box, IconButton } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Sidebar = ({ isMinimized, toggleSidebar, isMobileMenuOpen, toggleMobileMenu }) => {
  const navigate = useNavigate();

  const SidebarContent = () => (
    <Stack spacing="8">
      <Button
        variant="outline"
        color="white"
        _hover={{ bg: 'white', color: 'black' }}
        leftIcon={<WiThermometer size="30" />}
        onClick={() => navigate('/TempSensors')}
        justifyContent="flex-start"
        fontSize={'md'}
        mt={16}
        display={isMinimized ? 'none' : 'flex'}
      >
        Temperature Sensors
      </Button>
      <Button
        variant="outline"
        color="white"
        _hover={{ bg: 'white', color: 'black' }}
        leftIcon={<WiStrongWind size="30" />}
        onClick={() => navigate('/WindSensors')}
        justifyContent="flex-start"
        fontSize={'md'}
        display={isMinimized ? 'none' : 'flex'}
      >
        Wind Sensors
      </Button>
      <Button
        variant="outline"
        color="white"
        _hover={{ bg: 'white', color: 'black' }}
        leftIcon={<WiRain size="30" />}
        onClick={() => navigate('/RainSensors')}
        justifyContent="flex-start"
        fontSize={'md'}
        display={isMinimized ? 'none' : 'flex'}
      >
        Rain Sensors
      </Button>
      <Button
        variant="outline"
        color="white"
        _hover={{ bg: 'white', color: 'black' }}
        leftIcon={<WiHumidity size="30" />}
        onClick={() => navigate('/HumiditySensors')}
        justifyContent="flex-start"
        fontSize={'md'}
        display={isMinimized ? 'none' : 'flex'}
      >
        Humidity Sensors
      </Button>
    </Stack>
  );

  const MinimizedSidebarContent = () => (
    <Stack spacing="4" mt={16}>
      <IconButton
        icon={<WiThermometer size="30" />}
        onClick={() => navigate('/TempSensors')}
        aria-label="Temperature Sensors"
      />
      <IconButton
        icon={<WiStrongWind size="30" />}
        onClick={() => navigate('/WindSensors')}
        aria-label="Wind Sensors"
      />
      <IconButton
        icon={<WiRain size="30" />}
        onClick={() => navigate('/RainSensors')}
        aria-label="Rain Sensors"
      />
      <IconButton
        icon={<WiHumidity size="30" />}
        onClick={() => navigate('/HumiditySensors')}
        aria-label="Humidity Sensors"
      />
    </Stack>
  );

  return (
    <>
      <IconButton
        icon={isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={toggleMobileMenu}
        aria-label="Toggle Mobile Menu"
        display={{ base: 'block', md: 'none' }}
        position="fixed"
        top="1rem"
        left="1rem"
      />
      <Flex
        as="aside"
        bg="#212121"
        position="fixed"
        top="0"
        left="0"
        height="100%"
        width={isMinimized ? '80px' : '250px'}
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
            {isMinimized ? <MinimizedSidebarContent /> : <SidebarContent />}
          </Stack>
        </Box>
        <Box mt="auto" p="4">
          <IconButton
            icon={isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
            onClick={toggleSidebar}
            color="white"
            _hover={{ bg: 'white', color: 'black' }}
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
            variant={"outline"}
            width={'100%'}
          />
          </Box>
        </Flex>
      </>
    );
  };
  
  export default Sidebar;
  