import {
    Box,
    Heading,
    Grid,
    GridItem,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const TrialESP32Data = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
  
    const [trialData, setTrialData] = useState([]);
  
    // Fetch trial data from backend
    useEffect(() => {
      const fetchTrialData = async () => {
        try {
          const response = await axios.get('/api/alerts/trialESP32');
          setTrialData(response.data);
        } catch (error) {
          console.error('Error fetching trial ESP32 data:', error);
        }
      };
  
      fetchTrialData();
    }, []);
  
    return (
      <Box
        mx="auto"
        mt={20}
        px={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
          Trial ESP32 Data
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
          {/* Data Table Tile */}
          <GridItem colSpan={3}>
            <Box
              bg={cardBg}
              borderRadius="20px"
              boxShadow={cardShadow}
              p={6}
              position="relative"
            >
              <Heading size="md" textAlign="left" mb={4}>
                Trial ESP32 Data
              </Heading>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Button Toggle</Th>
                      <Th>Event Time</Th>
                      <Th>Light</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {trialData.map((record) => (
                      <Tr key={record.id}>
                        <Td>{record.id}</Td>
                        <Td>{record.button_toggle ? 'True' : 'False'}</Td>
                        <Td>
                          {new Date(record.event_time).toLocaleString()}
                        </Td>
                        <Td>{record.light ? 'True' : 'False'}</Td>
                      </Tr>
                    ))}
                    {/* If no records are present, display a message */}
                    {trialData.length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center">
                          No data available.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    );
  };
  
  export default TrialESP32Data;
  