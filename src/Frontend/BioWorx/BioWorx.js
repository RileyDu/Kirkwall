import {
    Box,
    Heading,
    Grid,
    GridItem,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const BioWorx = () => {
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
          Dakota BioWorx Mock Data
        </Heading>
      </Box>
    );
  };
  
  export default BioWorx;
  