/* global google */


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

// You can adjust the colors and groupings as needed.
const typeColorMapping = {
  // Emergency services: Red
  Ambulance: '#e74c3c',
  'Emergency Aid': '#e74c3c',
  'Emergency Management': '#e74c3c',
  'Fire Department': '#e74c3c',
  'National Guard': '#e74c3c',
  'Police Department': '#e74c3c',
  'U.S. Armed Forces': '#e74c3c',
  'Veterans Affairs': '#e74c3c',

  // Medical/Health: Blue
  'Health Department': '#3498db',
  'Medical/Hospital': '#3498db',
  'Mental Health Services': '#3498db',
  Pharmacy: '#3498db',

  // Food-related: Orange
  'Food Distribution': '#e67e22',
  'Food/Grocery': '#e67e22',
  'Food/Pantry': '#e67e22',
  'Food/Restaurant': '#e67e22',

  // Construction and related services: Purple
  'Building materials': '#9b59b6',
  'Construction company': '#9b59b6',
  'Demolition contractor': '#9b59b6',
  Electrical: '#9b59b6',
  'Heating / HVAC': '#9b59b6',
  Plumber: '#9b59b6',
  Hardware: '#9b59b6',
  Lumber: '#9b59b6',
  Furniture: '#9b59b6',
  Sanitation: '#9b59b6',

  // Agriculture: Green
  'Animal Feed': '#27ae60',
  Farms: '#27ae60',
  'Farms/Ranches': '#27ae60',
  Forestry: '#27ae60',
  Lawn: '#27ae60',
  USDA: '#27ae60',

  // Transportation-related: Teal
  Airport: '#1abc9c',
  'Gas Station': '#1abc9c',
  'Transportation/Freight': '#1abc9c',
  'Transportation/Shuttle': '#1abc9c',
  'Transportation/Truck': '#1abc9c',

  // Community/Public Services: Gray
  Legal: '#7f8c8d',
  'Places of Worship': '#7f8c8d',
  'Salvation Army': '#7f8c8d',
  School: '#7f8c8d',
  Shelter: '#7f8c8d',
  'Social Services': '#7f8c8d',

  // Utilities/Tech: Light Blue
  Telecommunications: '#2980b9',

  // Miscellaneous/Commercial: Neutral gray-blue
  'Self-storage facility': '#95a5a6',

  // Energy: Yellow
  'Wind Energy': '#f1c40f',
};

const legendData = [
  { label: 'Emergency Services', color: '#e74c3c' },
  { label: 'Medical/Health', color: '#3498db' },
  { label: 'Food', color: '#e67e22' },
  { label: 'Construction', color: '#9b59b6' },
  { label: 'Agriculture', color: '#27ae60' },
  { label: 'Transportation', color: '#1abc9c' },
  { label: 'Community Services', color: '#7f8c8d' },
  { label: 'Telecommunications', color: '#2980b9' },
  { label: 'Miscellaneous', color: '#95a5a6' },
  { label: 'Energy', color: '#f1c40f' },
];

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
              site.latitude &&
              site.longitude && (
                <Marker
                  key={site.id}
                  position={{
                    lat: parseFloat(site.latitude),
                    lng: parseFloat(site.longitude),
                  }}
                  icon={{
                    // Using a circle symbol with fillColor from our mapping
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: typeColorMapping[site.type] || '#000', // fallback color
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 8,
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
                    <Td>
                      <Flex alignItems="center">
                        <Box
                          w="12px"
                          h="12px"
                          borderRadius="full"
                          bg={typeColorMapping[site.type] || '#000'}
                          mr={2}
                        />
                        {site.type}
                        
                      </Flex>
                    </Td>
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
        <Box p={4} border="1px solid gray" borderRadius="md">
          <Heading size="sm" mb={2}>
            Legend
          </Heading>
          {legendData.map(item => (
            <Flex key={item.label} alignItems="center" mb={1}>
              <Box
                w="12px"
                h="12px"
                bg={item.color}
                borderRadius="full"
                mr={2}
              />
              <Text fontSize="sm">{item.label}</Text>
            </Flex>
          ))}
        </Box>
    </Box>
  );
};

export default DisasterShield;
