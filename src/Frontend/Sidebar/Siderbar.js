import { Box, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Logout from '../AuthComponents/Logout';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Box
      bg="#212121"
      color="white"
      w="250px"
      p="4"
      position="sticky"
      top="0"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/TempSensors')} cursor={'pointer'}>
          Temperature Sensors
        </Box>
        <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/WindSensors')} cursor={'pointer'}>
          Wind Sensors
        </Box>
        <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/RainSensors')} cursor={'pointer'}>
          Rain Sensors
        </Box>
        <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/HumiditySensors')} cursor={'pointer'}>
          Humidity Sensors
        </Box>
        <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/SoilMoistureSensors')} cursor={'pointer'}>
          Soil Moisture Sensors
        </Box>
      </Box>

      <Logout />
    </Box>
  );
};

export default Sidebar;
