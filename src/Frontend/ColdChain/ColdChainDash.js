import {
  Box,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Flex,
  Grid,
  GridItem,
  Divider,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const ColdChainDash = () => {
  const cardBg = useColorModeValue('gray.500', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  // Define the customer profiles and their sensor/alert options
  const customers = {
    'test@kirkwall.io': {
      locations: ['Incubator', 'Grand Farm'],
      sensors: ['Temperature Sensor', 'Humidity Sensor'],
      alerts: ['High Temperature Alert', 'Low Temperature Alert'],
    },
    'pmo@grandfarm.com': {
      locations: ['Grand Farm'],
      sensors: ['Temperature Sensor', 'Pressure Sensor'],
      alerts: ['Pressure Alert', 'Humidity Alert'],
    },
    'jerrycromarty@imprimed.com': {
      locations: ['ImpriMed'],
      sensors: ['Light Sensor', 'CO2 Sensor'],
      alerts: ['CO2 Alert', 'Light Intensity Alert'],
    },
  };

  // Local state to track selected customer
  const [selectedCustomer, setSelectedCustomer] = useState('test@kirkwall.io');
  const [selectedLocation, setSelectedLocation] = useState(customers[selectedCustomer].locations[0]);
  const [selectedSensor, setSelectedSensor] = useState('');
//   const [selectedAlert, setSelectedAlert] = useState('');

const handleCustomerChange = (customer) => {
  setSelectedCustomer(customer);
  setSelectedLocation(customers[customer].locations[0]); // Automatically select the first location
  setSelectedSensor('');
};

  return (
    <Box
      mx="auto"
      mt={16}
      px={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
        Cold Chain Dashboard
      </Heading>

      {/* Grid Layout for Dashboard Tiles */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
        width="100%"
        maxW="1200px"
      >
        {/* Customers Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >


            {/* Header Row */}
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Customers
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                >
                  Select Customer
                </MenuButton>
                <MenuList>
                  {Object.keys(customers).map(customer => (
                    <MenuItem
                      key={customer}
                      onClick={() => handleCustomerChange(customer)}
                    >
                      {customer}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Divider mb={4} />
            {/* Display selected customer information */}
            <Text>Customer: {selectedCustomer}</Text>
          </Box>
        </GridItem>


        {/* Locations Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Locations
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                >
                  Select Location
                </MenuButton>
                <MenuList>
                  {customers[selectedCustomer].locations.map(location => (
                    <MenuItem
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {location}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Divider mb={4} />
            <Text>Location: {selectedLocation}</Text>
          </Box>
        </GridItem>

        {/* Fleets Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Fleets
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                >
                  Select Fleet
                </MenuButton>
                <MenuList>
                  <MenuItem>Fleet 1</MenuItem>
                  <MenuItem>Fleet 2</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Divider mb={4} />
            <Text>Fleet Name: Fleet 1</Text>
            <Text>Active Vehicles: 12</Text>
          </Box>
        </GridItem>

        {/* Sensors Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Sensors
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                >
                  Select Sensor
                </MenuButton>
                <MenuList>
                  {customers[selectedCustomer].sensors.map(sensor => (
                    <MenuItem key={sensor}>{sensor}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Divider mb={4} />
            <Text>
              Current Sensor: {customers[selectedCustomer].sensors[0]}
            </Text>
          </Box>
        </GridItem>

        {/* Alerts Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Alerts
              </Heading>
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  rightIcon={<ChevronDownIcon />}
                >
                  Select Alert Type
                </MenuButton>
                <MenuList>
                  {customers[selectedCustomer].alerts.map(alert => (
                    <MenuItem key={alert}>{alert}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
            <Divider mb={4} />
            <Text>Current Alert: {customers[selectedCustomer].alerts[0]}</Text>
          </Box>
        </GridItem>

        {/* Energy Usage Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Energy Consumption
              </Heading>
              <Button size="sm" colorScheme="teal" variant="outline">
                Details
              </Button>
            </Flex>
            <Divider mb={4} />
            <Text>Energy Usage: 350 kWh</Text>
            <Text>Cost: $50</Text>
          </Box>
        </GridItem>

        {/* Reports Tile */}
        <GridItem>
          <Box
            bg={cardBg}
            borderRadius="20px"
            boxShadow={cardShadow}
            p={6}
            position="relative"
          >
            <Flex justify="space-between" mb={2}>
              <Heading size="md" textAlign="left">
                Reports
              </Heading>
              <Button size="sm" colorScheme="teal" variant="outline">
                Generate
              </Button>
            </Flex>
            <Divider mb={4} />
            <Text>Last Report: 01 Oct 2024</Text>
            <Text>Download: Available</Text>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ColdChainDash;
