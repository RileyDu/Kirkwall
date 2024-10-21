import { 
    Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button, Flex, Stack 
  } from '@chakra-ui/react';
  import { ChevronDownIcon } from '@chakra-ui/icons';
  
  const ColdChainDash = () => {
    return (
      <Box
        mx="auto"
        mt={16}
        px={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading mb={6}>Cold Chain Dashboard</Heading>
  
        {/* Customers Dropdown */}
        <Flex direction="row" mb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Customer
            </MenuButton>
            <MenuList>
              <MenuItem>Customer 1</MenuItem>
              <MenuItem>Customer 2</MenuItem>
              <MenuItem>Customer 3</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Locations Dropdown */}
        <Flex direction="row" mb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Location
            </MenuButton>
            <MenuList>
              <MenuItem>Warehouse A</MenuItem>
              <MenuItem>Warehouse B</MenuItem>
              <MenuItem>Warehouse C</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Fleets Dropdown */}
        <Flex direction="row" mb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Fleet
            </MenuButton>
            <MenuList>
              <MenuItem>Fleet 1</MenuItem>
              <MenuItem>Fleet 2</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Sensors Dropdown */}
        <Flex direction="row" mb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Sensor
            </MenuButton>
            <MenuList>
              <MenuItem>Temperature Sensor</MenuItem>
              <MenuItem>Humidity Sensor</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Alerts Dropdown */}
        <Flex direction="row" mb={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              Select Alert Type
            </MenuButton>
            <MenuList>
              <MenuItem>High Temperature Alert</MenuItem>
              <MenuItem>Low Temperature Alert</MenuItem>
              <MenuItem>Humidity Alert</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
  
        {/* Action Buttons */}
        <Stack direction="row" spacing={4} mt={8}>
          <Button colorScheme="teal">Energy Consumption</Button>
          <Button colorScheme="teal">Reports</Button>
        </Stack>
      </Box>
    );
  };
  
  export default ColdChainDash;
  