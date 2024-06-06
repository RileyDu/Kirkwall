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
    <Flex as="section" minH="100vh" bg='#212121'>
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
            <Button leftIcon={<FiGrid />} onClick={() => navigate('/TempSensors')}>Temperature Sensors</Button>
            <Button leftIcon={<FiPieChart />} onClick={() => navigate('/WindSensors')}>Wind Sensors</ Button>
            <Button leftIcon={<FiClock />} onClick={() => navigate('/RainSensors')}>Rain Sensors</Button>
            <Button leftIcon={<FiBookmark />} onClick={() => navigate('/HumiditySensors')}>Humidity Sensors</Button>
            <Button leftIcon={<FiGrid />} onClick={() => navigate('/SoilMoistureSensors')}>Soil Moisture Sensors</Button>
          </Stack>
        </Stack>
        <Stack spacing="4" divider={<StackDivider borderColor="bg.accent.subtle" />}>
          <Box />
          <Stack spacing="1">
            <Button leftIcon={<FiHelpCircle />}>Help Center</Button>
            <Button leftIcon={<FiSettings />}>Settings</Button>
          </Stack>
          <HStack spacing="3" justify="space-between">
            <HStack spacing="3">
              <Avatar boxSize="10" src="https://i.pravatar.cc/300" />
              <Box>
                <Text textStyle="sm" fontWeight="medium">
                  John Doe
                </Text>
                <Text textStyle="sm" color="fg.accent.muted">
                  john@chakra-ui.com
                </Text>
              </Box>
            </HStack>
            <IconButton variant="tertiary.accent" icon={<FiMoreVertical />} aria-label="Open Menu" />
          </HStack>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Sidebar;
