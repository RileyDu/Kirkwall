import { Flex, Stack, Button } from '@chakra-ui/react';
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
    <Flex as="section" bg="#212121" height="100vh">
      <Stack
        flex="1"
        maxW={{ base: 'full', sm: 'xs' }}
        py={{ base: '6', sm: '8' }}
        px={{ base: '4', sm: '6' }}
        bg="#212121"
        color="white"
        borderRightWidth="1px"
        justifyContent="space-between"
      >
        <Stack spacing="8">
          <Stack spacing="4">
            <Button
              variant="outline"
              color="white"
              _hover={{ bg: 'white', color: 'black' }}
              leftIcon={<WiThermometer size="30" />}
              onClick={() => navigate('/TempSensors')}
              justifyContent="flex-start"
              fontSize={'md'}
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
            <Button
              variant="outline"
              color="white"
              _hover={{ bg: 'white', color: 'black' }}
              leftIcon={<WiHumidity size="30" />}
              onClick={() => navigate('/SoilMoistureSensors')}
              justifyContent="flex-start"
              fontSize={'md'}
            >
              Soil Moisture Sensors
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
