import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Box bg="black" color="white" w="250px" minH="100vh" p="4">
      <Box mb="4">Sensor Categories</Box>
      <Box _hover={{ color: 'green' }} mb="2" onClick={() => navigate('/TempSensors')}>
        Temperature Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2">
        Humidity Sensors
      </Box>
      <Box _hover={{ color: 'green' }} mb="2">
        Soil Moisture Sensors
      </Box>
    </Box>
  );
  };

  export default Sidebar