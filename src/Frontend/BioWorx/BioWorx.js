import {
    Box,
    Heading,
    Grid,
    GridItem,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const SOAlerts = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
  
    const [mockData, setMockData] = useState([]);
  
    // Fetch security alerts from backend
    useEffect(() => {
      const fetchMockData = async () => {
        try {
          const response = await axios.get('/api/mockdata');
          setMockData(response.data);
        } catch (error) {
          console.error('Error fetching mock data:', error);
        }
      };
  
      fetchMockData();
    }, []);
  
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
          BioWorx Mock Data
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
          {/* Alerts Table Tile */}
          <GridItem colSpan={3}>
            <Box
              bg={cardBg}
              borderRadius="20px"
              boxShadow={cardShadow}
              p={6}
              position="relative"
            >
              <Heading size="md" textAlign="left" mb={4}>
                Security Alerts
              </Heading>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    );
  };
  
  export default SOAlerts;
  