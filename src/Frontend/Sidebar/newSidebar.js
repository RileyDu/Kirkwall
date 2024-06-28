import {
    Flex,
    Stack,
    IconButton,
    Box,
    Button,
    useColorMode,
    useMediaQuery,
  } from '@chakra-ui/react';
  import {
    WiThermometer,
    WiStrongWind,
    WiRain,
    WiHumidity,
  } from 'react-icons/wi';
  import {
    FaChevronLeft,
    FaChevronRight,
    FaChevronUp,
    FaChevronDown,
  } from 'react-icons/fa';
  import { useNavigate } from 'react-router-dom';
  import { useState } from 'react';
  import { motion } from 'framer-motion';
  
  const MotionFlex = motion(Flex);
  const MotionBox = motion(Box);
  
  const Sidebar = ({ isCollapsed, onToggle }) => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
  
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
    const handleNavigation = (path) => {
      navigate(path);
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
  
    return (
      <>
        {isLargerThan768 ? (
          <MotionFlex
            as="aside"
            bg={colorMode === 'light' ? '#212121' : '#212121'}
            color="white"
            position="fixed"
            top="64px"
            left="0"
            height="calc(100vh - 64px)"
            width={isCollapsed ? '80px' : '250px'}
            zIndex="1000"
            flexDirection="column"
            initial={{ width: isCollapsed ? '80px' : '250px' }}
            animate={{ width: isCollapsed ? '80px' : '250px' }}
            transition={{ width: { duration: 0.5 } }}
            p="2"
          >
            <Box overflowY="auto" height="100%" width="100%">
              <Stack spacing={6} direction="column" alignItems="start" justifyContent="flex-start">
                <Button
                  leftIcon={<WiThermometer size="24px" />}
                  onClick={() => handleNavigation('/TempSensors')}
                  {...buttonStyleProps}
                >
                  {!isCollapsed && 'Temperature Sensors'}
                </Button>
                <Button
                  leftIcon={<WiStrongWind size="24px" />}
                  onClick={() => handleNavigation('/WindSensors')}
                  {...buttonStyleProps}
                >
                  {!isCollapsed && 'Wind Sensors'}
                </Button>
                <Button
                  leftIcon={<WiRain size="24px" />}
                  onClick={() => handleNavigation('/RainSensors')}
                  {...buttonStyleProps}
                >
                  {!isCollapsed && 'Rain Sensors'}
                </Button>
                <Button
                  leftIcon={<WiHumidity size="24px" />}
                  onClick={() => handleNavigation('/HumiditySensors')}
                  {...buttonStyleProps}
                >
                  {!isCollapsed && 'Humidity Sensors'}
                </Button>
                <IconButton
                  icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                  aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                  variant="ghost"
                  borderColor="teal.500"
                  color="white"
                  onClick={onToggle}
                  alignSelf="center"
                />
              </Stack>
            </Box>
          </MotionFlex>
        ) : (
          <MotionBox
            initial={{ y: '100%' }}
            animate={{ y: isSidebarOpen ? '0%' : '100%' }}
            transition={{ duration: 0.3 }}
            position="fixed"
            bottom="0"
            width="100%"
            bg={colorMode === 'light' ? '#212121' : '#212121'}
            color="white"
            p="2"
            zIndex="1000"
          >
            <Flex direction="row" justifyContent="space-around" alignItems="center">
              <Button
                leftIcon={<WiThermometer size="24px" />}
                onClick={() => handleNavigation('/TempSensors')}
                {...buttonStyleProps}
              >
                Temperature
              </Button>
              <Button
                leftIcon={<WiStrongWind size="24px" />}
                onClick={() => handleNavigation('/WindSensors')}
                {...buttonStyleProps}
              >
                Wind
              </Button>
              <Button
                leftIcon={<WiRain size="24px" />}
                onClick={() => handleNavigation('/RainSensors')}
                {...buttonStyleProps}
              >
                Rain
              </Button>
              <Button
                leftIcon={<WiHumidity size="24px" />}
                onClick={() => handleNavigation('/HumiditySensors')}
                {...buttonStyleProps}
              >
                Humidity
              </Button>
              <IconButton
                icon={isSidebarOpen ? <FaChevronDown /> : <FaChevronUp />}
                aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                variant="ghost"
                borderColor="teal.500"
                color="white"
                onClick={toggleSidebar}
                alignSelf="center"
              />
            </Flex>
          </MotionBox>
        )}
      </>
    );
  };
  
  export default Sidebar;