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
  VStack,
  HStack,
  useMediaQuery,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/react';
import { useAuth } from '../AuthComponents/AuthContext.js';
import SavedLinksModal from './SavedLinksModal.js';
import { motion } from 'framer-motion';

const AgScrapper = ({ statusOfAlerts }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { currentUser } = useAuth();
  const { colorMode } = useColorMode();

  const userEmail = currentUser?.email;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [nextResults, setNextResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSites, setSelectedSites] = useState([
    'Big Iron',
    'Purple Wave',
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [baseIndex, setBaseIndex] = useState(0); // Track the start index for animations

  const [savedLinks, setSavedLinks] = useState(() => {
    const userEmail = currentUser?.email;
    if (!userEmail) return [];

    const storageKey = `savedLinks_${userEmail}`;
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  });

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const searchEquipment = async () => {
    if (query.length < 3) {
      setError('Please enter at least 3 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setResults([]);

    try {
      const requests = [];

      if (selectedSites.includes('Big Iron')) {
        requests.push(
          axios.get('/api/scrapeBigIron', { params: { query, page: 1 } })
        );
      }
      if (selectedSites.includes('Purple Wave')) {
        requests.push(
          axios.get('/api/scrapePurpleWave', { params: { query, page: 1 } })
        );
      }

      // Use Promise.allSettled to handle each request independently
      const responses = await Promise.allSettled(requests);

      const successfulResults = responses
        .filter(response => response.status === 'fulfilled')
        .flatMap(response => response.value.data);

      const errors = responses.filter(
        response => response.status === 'rejected'
      );

      if (errors.length > 0) {
        console.error('One or more sites failed:', errors);
      }

      if (successfulResults.length > 0) {
        setResults(successfulResults);
        prefetchNextPage(2);
      } else {
        setError('No data found on selected sites.');
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const prefetchNextPage = async page => {
    setLoadingNext(true);
    try {
      const nextRequests = [];

      if (selectedSites.includes('Big Iron')) {
        nextRequests.push(
          axios.get('/api/scrapeBigIron', { params: { query, page } })
        );
      }
      if (selectedSites.includes('Purple Wave')) {
        nextRequests.push(
          axios.get('/api/scrapePurpleWave', { params: { query, page } })
        );
      }

      const nextResponses = await Promise.all(nextRequests);
      const newNextResults = nextResponses.flatMap(response => response.data);
      setNextResults(newNextResults);
    } catch (err) {
      console.error('Error prefetching next page:', err);
    } finally {
      setLoadingNext(false);
    }
  };

  const handleLoadMore = async () => {
    setResults(prevResults => {
      const newBaseIndex = prevResults.length; // Update base index for the new batch
      setBaseIndex(newBaseIndex);
      return [...prevResults, ...nextResults];
    });

    const nextPage = currentPage + 1;
    setNextResults([]);
    setCurrentPage(nextPage);
    await prefetchNextPage(nextPage + 1);
  };


  const handleClearResults = () => {
    setQuery('');
    setResults([]);
    setNextResults([]);
    setCurrentPage(1);
  };

  const toggleLinkInLocalStorage = (title, link) => {
    if (!userEmail) return;

    const storageKey = `savedLinks_${userEmail}`;
    const existingLinks = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Check if the link already exists
    const linkExists = existingLinks.some(savedLink => savedLink.link === link);

    let updatedLinks;
    if (linkExists) {
      // Remove if it already exists
      updatedLinks = existingLinks.filter(savedLink => savedLink.link !== link);
    } else {
      // Add new link with title
      updatedLinks = [...existingLinks, { title, link }];
    }

    localStorage.setItem(storageKey, JSON.stringify(updatedLinks));
    setSavedLinks(updatedLinks); // Update state to reflect changes in real-time
  };

  const isLinkSaved = link =>
    savedLinks.some(savedLink => savedLink.link === link);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: (index - baseIndex) * 0.1, // Reset delay for the new batch of items
      }
    })
  };

  return (
    <Box
      mx="auto"
      pt={statusOfAlerts ? '10px' : '74px'}
      px={4}
      maxW="container.xl"
      textAlign="center"
    >
      <Heading size={isLargerThan768 ? 'lg' : 'md'} fontWeight="bold" mb={4}>
        AgScraper: Agriculture Equipment Search
      </Heading>

      <HStack
        spacing={isLargerThan768 ? 2 : 4}
        w="full"
        justifyContent="center"
      >
        <Input
          variant="outline"
          placeholder="Enter equipment type..."
          size="lg"
          value={query}
          onChange={e => setQuery(e.target.value)}
          colorScheme="teal"
        />
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            // rightIcon={<ChevronDownIcon />}
            colorScheme="teal"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            w="20%"
          >
            Select Sites
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              defaultValue={['Big Iron', 'Purple Wave']}
              // title="Sites"
              type="checkbox"
              onChange={setSelectedSites}
            >
              <MenuItemOption value="Big Iron">Big Iron</MenuItemOption>
              <MenuItemOption value="Purple Wave">Purple Wave</MenuItemOption>
            </MenuOptionGroup>
          </MenuList>
        </Menu>

        <Button
          colorScheme="yellow"
          onClick={onOpen}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="full"
        >
          ★
        </Button>

        <Button
          colorScheme="teal"
          onClick={searchEquipment}
          // isLoading={loading}
          loadingText="Searching"
          isDisabled={query.length < 3 || loading}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="full"
        >
          Search
        </Button>

        {/* {results.length > 0 && ( */}
        <Button
          colorScheme="red"
          onClick={handleClearResults}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="full"
          isDisabled={query.length < 1}
        >
          Clear
        </Button>
      </HStack>

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}
      {loading && (
        <Box display={'flex'} justifyContent={'center'} mt={'100px'}>
          <dotlottie-player
            // src="https://lottie.host/aa5a13e0-d18a-4a94-a12a-e2d4dec5563c/9kTrjfgaWK.json" // hand
            // src="https://lottie.host/8f2ae775-e459-4074-bc30-abcf715786da/K00szLdcP4.json" // blue blocks
            src="https://lottie.host/56f013ea-1157-45f1-aff0-13bee76388dc/dlL0MwupV0.json" // spinner
            background="transparent"
            speed="1"
            style={{ width: '600px', height: '600px' }}
            loop
            autoplay
          ></dotlottie-player>
        </Box>
      )}
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={6}
        mt={6}
      >
        {results.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              transition="transform 0.5s"
              _hover={{ transform: 'scale(1.05)' }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
              height={'100%'}
            >
              <Image
                src={item.image}
                alt={item.equipmentName}
                w="100%"
                h="175px"
                objectFit="cover"
                onClick={() => window.open(item.link, '_blank')}
                cursor={'pointer'}
              />
              <Box p={4} flex="1" display="flex" flexDirection="column">
                <Stat mb={2}>
                  <StatLabel fontWeight="bold" fontSize="lg">
                    {item.equipmentName}
                  </StatLabel>
                  <StatNumber color="teal.500">{item.price}</StatNumber>
                </Stat>
                <Text mb={4}>{item.source}</Text>

                <Box
                  mt="auto"
                  display="flex"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Button
                    as="a"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    colorScheme="teal"
                    size="sm"
                    variant="outline"
                    w="full"
                    flex={6}
                  >
                    View on Auction Site
                  </Button>
                  <Button
                    colorScheme="yellow"
                    size="sm"
                    onClick={() =>
                      toggleLinkInLocalStorage(item.equipmentName, item.link)
                    }
                    w="full"
                    flex={1}
                  >
                    {isLinkSaved(item.link) ? '★' : '☆'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Grid>
      {results.length > 0 && (
        <Box mt={6}>
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
      {/* Hook up the modal with isOpen and onClose from useDisclosure */}
      <SavedLinksModal
        savedLinks={savedLinks}
        setSavedLinks={setSavedLinks}
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
};

export default AgScrapper;
