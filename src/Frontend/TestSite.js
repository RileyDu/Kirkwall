import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  Grid,
  Text,
  Button,
  Input,
  Image, 
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';

const TestSite = () => {
  const [query, setQuery] = useState(''); // State for search query
  const [bigIronResults, setBigIronResults] = useState([]); // State for storing search results from Big Iron
  const [purpleWaveResults, setPurpleWaveResults] = useState([]); // State for storing search results from Purple Wave
  const [loading, setLoading] = useState(false); // State for showing loading indicator
  const [error, setError] = useState(null); // State for handling errors

  // Function to search for equipment by making an API request to the backend
  const searchEquipment = async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Use Promise.all to make both API calls simultaneously
      const [bigIronResponse] = await Promise.all([
        axios.get('/api/scrapeBigIron', {
          params: { query },
        }),
        // axios.get('/api/scrapePurpleWave', {
        //   params: { query },
        // })
      ]);
  
      // Set the results for each site
      setBigIronResults(bigIronResponse.data);
    //   setPurpleWaveResults(purpleWaveResponse.data);
  
      console.log('Big Iron search results:', bigIronResponse.data);
    //   console.log('Purple Wave search results:', purpleWaveResponse.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
//   maxWidth="md"
  mx="auto"
  mt={16}
  px={4}
  display="flex"
  flexDirection="column"
  alignItems="center"
>
  <Heading as="h1" fontSize="2xl" mb={6} textAlign="center">
    AgScrapper: Agriculture Equipment Search
  </Heading>

  {/* Search Input */}
  <Input
    variant="outline"
    placeholder="Enter equipment type..."
    size="lg"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    mb={4}
    colorScheme="teal"
  />

  {/* Search Button */}
  <Button
    colorScheme="teal"
    size="lg"
    onClick={searchEquipment}
    isLoading={loading}
    loadingText="Searching"
    w="full"
    mb={6}
  >
    Search
  </Button>

  {/* Error Handling */}
  {error && (
    <Text color="red.500" mt={4} textAlign="center">
      {error}
    </Text>
  )}

  {/* Display Search Results */}
  <Grid
    templateColumns="repeat(3, 4fr)"
    gap={6}
    mt={6}
    w="full"
  >
    {bigIronResults.map((item, index) => (
      <Box
        key={index}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        transition="transform 0.2s"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Image src={item.image} alt={item.equipmentName} w="100%" h="200px" objectFit="cover" />
        <Box p={4}>
          <Stat mb={2}>
            <StatLabel fontWeight="bold" fontSize="lg">
              {item.equipmentName}
            </StatLabel>
            <StatNumber color="teal.500">{item.price}</StatNumber>
          </Stat>
          <Button
            as="a"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            colorScheme="teal"
            size="sm"
            variant="outline"
            w="full"
          >
            View on Auction Site
          </Button>
        </Box>
      </Box>
    ))}
  </Grid>
</Box>

  );
};

export default TestSite;
