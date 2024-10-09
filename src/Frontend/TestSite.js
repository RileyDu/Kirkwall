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
  Menu,
  MenuButton,
  MenuList,
  MenuItemOption,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const TestSite = () => {
  const [query, setQuery] = useState('');
  const [bigIronResults, setBigIronResults] = useState([]);
  const [purpleWaveResults, setPurpleWaveResults] = useState([]);
  const [nextBigIronResults, setNextBigIronResults] = useState([]);
  const [nextPurpleWaveResults, setNextPurpleWaveResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSites, setSelectedSites] = useState(['Big Iron', 'Purple Wave']);
  const [currentPage, setCurrentPage] = useState(1);

  const searchEquipment = async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    try {
      const requests = [];
      
      if (selectedSites.includes('Big Iron')) {
        requests.push(
          axios.get('/api/scrapeBigIron', { params: { query, page: 1 } })
            .then(response => setBigIronResults(response.data))
        );
      }
      if (selectedSites.includes('Purple Wave')) {
        requests.push(
          axios.get('/api/scrapePurpleWave', { params: { query, page: 1 } })
            .then(response => setPurpleWaveResults(response.data))
        );
      }

      await Promise.all(requests);
      prefetchNextPage(2); // Prefetch the second page right after the initial fetch
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const prefetchNextPage = async (page) => {
    setLoadingNext(true);
    try {
      const nextRequests = [];

      if (selectedSites.includes('Big Iron')) {
        nextRequests.push(
          axios.get('/api/scrapeBigIron', { params: { query, page } })
            .then(response => setNextBigIronResults(response.data))
        );
      }
      if (selectedSites.includes('Purple Wave')) {
        nextRequests.push(
          axios.get('/api/scrapePurpleWave', { params: { query, page } })
            .then(response => setNextPurpleWaveResults(response.data))
        );
      }

      await Promise.all(nextRequests);
    } catch (err) {
      console.error('Error prefetching next page:', err);
    } finally {
      setLoadingNext(false);
    }
  };

  const handleLoadMore = async () => {
    setBigIronResults(prevResults => [...prevResults, ...nextBigIronResults]);
    setPurpleWaveResults(prevResults => [...prevResults, ...nextPurpleWaveResults]);

    // Clear the next results and fetch the next page after the current one
    const nextPage = currentPage + 1;
    setNextBigIronResults([]);
    setNextPurpleWaveResults([]);
    setCurrentPage(nextPage);

    await prefetchNextPage(nextPage + 1);
  };

  return (
    <Box mx="auto" mt={16} px={4} display="flex" flexDirection="column" alignItems="center">
      <Heading as="h1" fontSize="2xl" mb={6} textAlign="center">
        AgScrapper: Agriculture Equipment Search
      </Heading>

      <Input
        variant="outline"
        placeholder="Enter equipment type..."
        size="lg"
        value={query}
        onChange={e => setQuery(e.target.value)}
        mb={4}
        colorScheme="teal"
      />

      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal" mb={4}>
          Select Sites
        </MenuButton>
        <MenuList>
          <MenuOptionGroup
            defaultValue={['Big Iron', 'Purple Wave']}
            title="Sites"
            type="checkbox"
            onChange={value => setSelectedSites(value)}
          >
            <MenuItemOption value="Big Iron">Big Iron</MenuItemOption>
            <MenuItemOption value="Purple Wave">Purple Wave</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

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

      {error && (
        <Text color="red.500" mt={4} textAlign="center">
          {error}
        </Text>
      )}

      <Grid templateColumns="repeat(4, 4fr)" gap={6} mt={6} w="full">
        {[...bigIronResults, ...purpleWaveResults].map((item, index) => (
          <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="md" transition="transform 0.2s" _hover={{ transform: 'scale(1.05)' }}>
            <Image src={item.image} alt={item.equipmentName} w="100%" h="200px" objectFit="cover" />
            <Box p={4}>
              <Stat mb={2}>
                <StatLabel fontWeight="bold" fontSize="lg">{item.equipmentName}</StatLabel>
                <StatNumber color="teal.500">{item.price}</StatNumber>
              </Stat>
              <Button as="a" href={item.link} target="_blank" rel="noopener noreferrer" colorScheme="teal" size="sm" variant="outline" w="full">View on Auction Site</Button>
              <Text>{item.source}</Text>
            </Box>
          </Box>
        ))}
      </Grid>

      {(bigIronResults.length > 0 || purpleWaveResults.length > 0) && (
        <Box mt={6} display="flex" justifyContent="center">
          <Button
            onClick={handleLoadMore}
            isDisabled={loadingNext}
            colorScheme="teal"
            size="lg"
          >
            {loadingNext ? 'Loading...' : 'Show More'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default TestSite;
