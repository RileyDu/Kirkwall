import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  StackDivider,
  Text,
  Button
} from '@chakra-ui/react'
import {
  FiBookmark,
  FiClock,
  FiGrid,
  FiHelpCircle,
  FiMoreVertical,
  FiPieChart,
  FiSearch,
  FiSettings,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Flex as="section" bg='#212121'>
      <Stack
        flex="1"
        maxW={{ base: 'full', sm: 'xs' }}
        py={{ base: '6', sm: '8' }}
        px={{ base: '4', sm: '6' }}
        bg="bg.accent.default"
        color="fg.accent.default"
        borderRightWidth="1px"
        justifyContent="space-between"
      >
        <Stack spacing="8">
          <Stack spacing="1">
            <Button variant="outline" color='white' _hover={{ bg: 'white', color: 'black' }} leftIcon={<FiGrid />} onClick={() => navigate('/TempSensors')}>Temperature Sensors</Button>
            <Button variant="outline" color='white' _hover={{ bg: 'white', color: 'black' }} leftIcon={<FiPieChart />} onClick={() => navigate('/WindSensors')}>Wind Sensors</ Button>
            <Button variant="outline" color='white' _hover={{ bg: 'white', color: 'black' }} leftIcon={<FiClock />} onClick={() => navigate('/RainSensors')}>Rain Sensors</Button>
            <Button variant="outline" color='white' _hover={{ bg: 'white', color: 'black' }} leftIcon={<FiBookmark />} onClick={() => navigate('/HumiditySensors')}>Humidity Sensors</Button>
            <Button variant={"outline"} color='white' _hover={{ bg: 'white', color: 'black' }} leftIcon={<FiGrid />} onClick={() => navigate('/SoilMoistureSensors')}>Soil Moisture Sensors</Button>
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
