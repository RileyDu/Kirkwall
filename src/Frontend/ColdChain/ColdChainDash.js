import { 
    Box, Heading, Menu, MenuButton, MenuList, MenuItem, Button, Flex, Stack, Grid, GridItem, Divider, Text, useColorModeValue 
  } from '@chakra-ui/react';
  import { ChevronDownIcon } from '@chakra-ui/icons';
  
  const ColdChainDash = () => {
    const cardBg = useColorModeValue("white", "gray.800");
    const cardShadow = useColorModeValue("md", "dark-lg");
  
    return (
      <Box mx="auto" mt={16} px={4} display="flex" flexDirection="column" alignItems="center">
        <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
          Cold Chain Dashboard
        </Heading>
  
        {/* Grid Layout for Dashboard Tiles */}
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
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
                <Heading size="md" textAlign="left">Customers</Heading>
                <Menu>
                  <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                    Select Customer
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Customer 1</MenuItem>
                    <MenuItem>Customer 2</MenuItem>
                    <MenuItem>Customer 3</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Divider mb={4} />
              {/* Placeholder Data */}
              <Text>Customer Name: Example Corp</Text>
              <Text>Total Fleets: 5</Text>
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
                <Heading size="md" textAlign="left">Locations</Heading>
                <Menu>
                  <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                    Select Location
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Warehouse A</MenuItem>
                    <MenuItem>Warehouse B</MenuItem>
                    <MenuItem>Warehouse C</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Divider mb={4} />
              <Text>Location: Warehouse A</Text>
              <Text>Temperature: 2°C</Text>
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
                <Heading size="md" textAlign="left">Fleets</Heading>
                <Menu>
                  <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
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
                <Heading size="md" textAlign="left">Sensors</Heading>
                <Menu>
                  <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                    Select Sensor
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Temperature Sensor</MenuItem>
                    <MenuItem>Humidity Sensor</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Divider mb={4} />
              <Text>Sensor: Temp Sensor 1</Text>
              <Text>Current Reading: 5°C</Text>
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
                <Heading size="md" textAlign="left">Alerts</Heading>
                <Menu>
                  <MenuButton as={Button} size="sm" rightIcon={<ChevronDownIcon />}>
                    Select Alert Type
                  </MenuButton>
                  <MenuList>
                    <MenuItem>High Temperature Alert</MenuItem>
                    <MenuItem>Low Temperature Alert</MenuItem>
                    <MenuItem>Humidity Alert</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Divider mb={4} />
              <Text>Alert: High Temp Alert</Text>
              <Text>Status: Active</Text>
            </Box>
          </GridItem>
  
          {/* Energy Consumption Tile */}
          <GridItem>
            <Box
              bg={cardBg}
              borderRadius="20px"
              boxShadow={cardShadow}
              p={6}
              position="relative"
            >
              <Flex justify="space-between" mb={2}>
                <Heading size="md" textAlign="left">Energy Consumption</Heading>
                <Button size="sm" colorScheme="teal" variant="outline">Details</Button>
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
                <Heading size="md" textAlign="left">Reports</Heading>
                <Button size="sm" colorScheme="teal" variant="outline">Generate</Button>
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
  