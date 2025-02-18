import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  useColorModeValue,
  Button,
  Select,
  Input,
  Flex,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  Marker,
  OverlayView,
  useLoadScript,
} from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '70vh',
};

const center = {
  lat: 44.36, // Center of South Dakota
  lng: -100.165,
};

const DisasterShield = () => {
  const cardBg = useColorModeValue('gray.500', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const [disasterSites, setDisasterSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  // Filtering, sorting, and search state
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState(''); // e.g. 'name', 'address', 'type'
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapID = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

  // Fetch disaster shield data from backend
  useEffect(() => {
    const fetchDisasterSites = async () => {
      try {
        const response = await axios.get('/api/disastershield');
        setDisasterSites(response.data);
      } catch (error) {
        console.error('Error fetching disaster sites:', error);
      }
    };

    fetchDisasterSites();
  }, []);
  // New state to store manual edit values for each site (keyed by site.id)

  if (loadError) return <Text>Error loading maps</Text>;
  if (!isLoaded) return <Text>Loading Maps...</Text>;

  // Compute unique cities and service types
  const uniqueCities = Array.from(
    new Set(disasterSites.map(site => site.city).filter(city => city))
  );
  
  const uniqueServiceTypes = Array.from(
    new Set(disasterSites.map(site => site.type).filter(type => type))
  );

  // Filter sites based on selected city, service type, and search query
  const filteredSites = disasterSites.filter(site => {
    let cityMatch = true;
    let typeMatch = true;
    let searchMatch = true;

    if (selectedCity !== 'All') {
      cityMatch = site.city === selectedCity;
    }
    
    if (selectedType !== 'All') {
      typeMatch = site.type === selectedType;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      searchMatch =
        (site.name && site.name.toLowerCase().includes(query)) ||
        (site.address && site.address.toLowerCase().includes(query)) ||
        (site.phone_number &&
          site.phone_number.toLowerCase().includes(query)) ||
        (site.type && site.type.toLowerCase().includes(query));
    }
    return cityMatch && typeMatch && searchMatch;
  });

  // Sort filtered sites if a sortBy field is selected
  if (sortBy) {
    filteredSites.sort((a, b) => {
      const aVal = a[sortBy] ? a[sortBy].toString() : '';
      const bVal = b[sortBy] ? b[sortBy].toString() : '';
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }

  return (
    <Box mx="auto" display="flex" flexDirection="column" alignItems="center">
      {/* Filtering & Sorting Controls */}
      <Box width="90%" mb={4} mt={24} display="flex" flexWrap="wrap" gap={4}>
        <Select
          maxW="200px"
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
        <Select
          maxW="200px"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
        >
          <option value="All">All Service Types</option>
          {uniqueServiceTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select
          maxW="200px"
          placeholder="Sort By"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="address">Address</option>
          <option value="type">Type</option>
        </Select>
        {sortBy && (
          <Button
            onClick={() =>
              setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
            }
          >
            {sortDirection === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        )}
      </Box>

      {/* Google Map Section */}
      <Box width="90%" mb={8} boxShadow={cardShadow}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={7}
          center={center}
          mapId={mapID}
        >
          {filteredSites.map(
            site =>
              // Only render marker if valid coordinates exist
              site.latitude &&
              site.longitude && (
                <Marker
                  key={site.id}
                  position={{
                    lat: parseFloat(site.latitude),
                    lng: parseFloat(site.longitude),
                  }}
                  onClick={() => setSelectedSite(site)}
                />
              )
          )}
          {selectedSite && (
            <OverlayView
              position={{
                lat: parseFloat(selectedSite.latitude) || 0,
                lng: parseFloat(selectedSite.longitude) || 0,
              }}
              mapPaneName={OverlayView.FLOAT_PANE}
              getPixelPositionOffset={(width, height) => ({
                x: (width - 250) / 2,
                y: -height - 125,
              })}
            >
              <Box
                bg="white"
                color="black"
                p={3}
                borderRadius="md"
                boxShadow="md"
                position="relative"
                minWidth="250px"
                display="inline-block"
              >
                <Button
                  position="absolute"
                  top={1}
                  right={1}
                  onClick={() => setSelectedSite(null)}
                  color="black"
                  p={2}
                >
                  X
                </Button>
                <Heading size="xs" color="black">
                  {selectedSite.name}
                </Heading>
                <Text textDecoration="underline">{selectedSite.type}</Text>
                <Text>{selectedSite.address}</Text>
                <Text>{selectedSite.phone_number}</Text>
              </Box>
            </OverlayView>
          )}
        </GoogleMap>
      </Box>

      {/* Disaster Sites Table */}
      <Box
        width="100%"
        maxW="1400px"
        bg={cardBg}
        borderRadius="20px"
        boxShadow={cardShadow}
        p={6}
        overflowX="auto"
        height={'100%'}
        mb={8}
        minHeight={'70vh'}
      >
        {/* Header with search input */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Heading size="md">Registered Locations</Heading>
          <Input
            maxW="300px"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Flex>
        <TableContainer maxHeight="60vh" overflowY="auto">
          <Table variant="simple" size="md">
            <Thead position="sticky" top={0} bg="gray.500" zIndex={1}>
              <Tr>
                <Th>Name</Th>
                <Th>Address</Th>
                <Th>Phone Number</Th>
                <Th>Type</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSites.length > 0 ? (
                filteredSites.map(site => (
                  <Tr
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    cursor="pointer"
                  >
                    <Td>{site.name}</Td>
                    <Td>{site.address}</Td>
                    <Td>{site.phone_number}</Td>
                    <Td>{site.type}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5} textAlign="center">
                    No locations match your criteria.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default DisasterShield;
