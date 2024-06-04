import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Box bg="black" color="white" w="250px" minH="100vh" p="4" >
      <Box mb="2" fontWeight="bold" fontSize="lg" textDecoration={'underline'}>Sensor Categories</Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/TempSensors')} cursor={'pointer'}>
        - Temperature Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/WindSensors')} cursor={'pointer'}>
        - Wind Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/RainSensors')} cursor={'pointer'}>
        - Rain Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/HumiditySensors')} cursor={'pointer'}>
        - Humidity Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/SoilMoistureSensors')} cursor={'pointer'}>
        - Soil Moisture Sensors
      </Box>
    </Box>
  );
  };

  export default Sidebar