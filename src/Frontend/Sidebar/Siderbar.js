import { Box } from '@chakra-ui/react';

const Sidebar = () => (
    <Box bg="black" color="white" w="250px" minH="100vh" p="4">
      <Box mb="4">Sensor Categories</Box>
      <Box _hover={{ color: 'green' }} mb="2">
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

  export default Sidebar