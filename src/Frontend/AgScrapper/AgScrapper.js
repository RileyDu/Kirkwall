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
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '../AuthComponents/AuthContext.js';
import SavedLinksModal from './SavedLinksModal.js';
import animationData from './Perfect-loop-cube-SVG.json';
import Lottie from 'react-lottie';

const AgScrapper = () => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { currentUser } = useAuth();
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
    setResults(prevResults => [...prevResults, ...nextResults]);
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

  console.log('animationData', animationData);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Box mx="auto" mt={16} px={4} maxW="container.xl" textAlign="center">
      <Heading as="h1" fontSize="2xl" mb={6}>
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
            w="25%"
          >
            Select Sites
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              defaultValue={['Big Iron', 'Purple Wave']}
              title="Sites"
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
          isLoading={loading}
          loadingText="Searching"
          isDisabled={query.length < 3}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          maxW="full"
        >
          Search
        </Button>

        {results.length > 0 && (
          <Button
            colorScheme="red"
            onClick={handleClearResults}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            maxW="full"
          >
            Clear
          </Button>
        )}
      </HStack>

      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}

      {loading && (
        <Box display={'flex'} justifyContent={'center'} mt={6}>
          <iframe
            src="https://lottie.host/embed/29e878f1-e85d-4a1c-a3a1-68c18b876d52/3iCbnE5CTe.json"
            height={600}
            width={600}
          ></iframe>
        </Box>
      )}

      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
        gap={6}
        mt={6}
      >
        {results.map((item, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.05)' }}
          >
            <Image
              src={item.image}
              alt={item.equipmentName}
              w="100%"
              h="175px"
              objectFit="cover"
            />
            <Box p={4}>
              <Stat mb={2}>
                <StatLabel fontWeight="bold" fontSize="lg">
                  {item.equipmentName}
                </StatLabel>
                <StatNumber color="teal.500">{item.price}</StatNumber>
              </Stat>
              <Text>{item.source}</Text>
              <Button
                as="a"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                colorScheme="teal"
                size="sm"
                variant="outline"
                w="full"
                mb={2}
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
                mb={2}
              >
                {isLinkSaved(item.link) ? '★ Saved' : '☆ Save'}
              </Button>
            </Box>
          </Box>
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
