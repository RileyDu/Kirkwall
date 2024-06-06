import { Flex, Stack, Button, Box } from '@chakra-ui/react';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Flex
      as="aside"
      bg="#212121"
      position="fixed"
      top="0"
      left="0"
      height="100vh"
      width="250px" // Adjust the width as necessary
      zIndex="1000" // Ensure the sidebar is above other content
      flexShrink={0}
      flexDirection="column"
    >
      <Box overflowY="auto" height="100%">
        <Stack
          flex="1"
          py={{ base: '6', sm: '8' }}
          px={{ base: '4', sm: '6' }}
          bg="#212121"
          color="white"
          borderRightWidth="1px"
          justifyContent="space-between"
        >
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
            >
              Humidity Sensors
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Sidebar;
