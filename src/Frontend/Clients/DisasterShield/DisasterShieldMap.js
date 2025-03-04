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
  Tooltip,
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
  height: '60vh',
};

const center = {
  lat: 44.36, // Center of South Dakota
  lng: -100.165,
};

// Color mapping for individual service types.
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

// Legend data defining our resource groups.
const legendData = [
  { label: 'Emergency Services', color: '#e74c3c' },
  { label: 'Medical/Health', color: '#3498db' },
  { label: 'Food', color: '#e67e22' },
  { label: 'Construction', color: '#9b59b6' },
  { label: 'Agriculture', color: '#27ae60' },
  { label: 'Transportation', color: '#1abc9c' },
  { label: 'Community Services', color: '#7f8c8d' },
  { label: 'Telecommunications', color: '#2980b9' },
  { label: 'Storage', color: '#95a5a6' },
  { label: 'Energy', color: '#f1c40f' },
];

const DisasterShield = () => {
  const cardBg = useColorModeValue('gray.500', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const [disasterSites, setDisasterSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);

  // Filtering, sorting, and search state
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState(''); // e.g. 'name', 'address', 'type'
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  // New state: which resource groups (legend items) are active.
  const [activeLegends, setActiveLegends] = useState(() => {
    const initial = {};
    legendData.forEach(item => {
      initial[item.label] = true;
    });
    return initial;
  });

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

  // Helper function: Given a site, determine its resource group based on the legend.
  const getSiteGroup = site => {
    const color = typeColorMapping[site.type];
    const groupItem = legendData.find(item => item.color === color);
    return groupItem ? groupItem.label : site.type;
  };

  if (loadError) return <Text>Error loading maps</Text>;
  if (!isLoaded) return <Text>Loading Maps...</Text>;

  // Compute unique cities
  const uniqueCities = Array.from(
    new Set(disasterSites.map(site => site.city).filter(city => city))
  );

  // First, filter sites based on city and search query.
  const baseFilteredSites = disasterSites.filter(site => {
    const cityMatch = selectedCity === 'All' || site.city === selectedCity;
    let searchMatch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      searchMatch =
        (site.name && site.name.toLowerCase().includes(query)) ||
        (site.address && site.address.toLowerCase().includes(query)) ||
        (site.phone_number &&
          site.phone_number.toLowerCase().includes(query)) ||
        (site.type && site.type.toLowerCase().includes(query));
    }
    return cityMatch && searchMatch;
  });

  // Compute available groups (based on base filters only).
  const availableGroups = new Set(
    baseFilteredSites.map(site => getSiteGroup(site))
  );

  // Then, only include sites whose group is toggled "on" in our legend.
  const filteredSites = baseFilteredSites.filter(
    site => activeLegends[getSiteGroup(site)]
  );

  // Sort the sites if needed.
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
    <Box position="relative" width="100vw" height="100vh">
      {/* Full-page Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
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
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: typeColorMapping[site.type] || '#000',
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
              <Text textDecoration="underline">
                {getSiteGroup(selectedSite)}
              </Text>
              <Text>{selectedSite.address}</Text>
              <Text>{selectedSite.phone_number}</Text>
            </Box>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Micro Table/Filtering Overlay */}
      <Box
        position="absolute"
        bottom="20px"
        left="20px"
        width="300px"
        bg="gray.700"
        p={3}
        borderRadius="md"
        boxShadow="lg"
        opacity={0.95}
        zIndex={1000}
      >
        <Heading size="sm" mb={2}>
          Locations
        </Heading>

        {/* Filters */}
        <Box mb={2}>
          <Select
            w="100%"
            mb={2}
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
            w="100%"
            mb={2}
            placeholder="Sort By"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="type">Type</option>
          </Select>
          <Input
            w="100%"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Box>

        {/* Simplified Table with Hover Tooltip */}
        <Box maxHeight="200px" overflowY="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.200">
              <Tr>
                <Th>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSites.length > 0 ? (
                filteredSites.map(site => (
                  <Tooltip
                    key={site.id}
                    label={
                      <Box whiteSpace="pre-line">
                        {`Type: ${site.type}\nAddress: ${site.address}\nPhone: ${site.phone_number}`}
                      </Box>
                    }
                    placement="top"
                    hasArrow
                    bg="gray.700"
                    color="white"
                  >
                    <Tr
                      onClick={() => setSelectedSite(site)}
                      cursor="pointer"
                      bg={typeColorMapping[site.type]}
                    >
                      <Td>{site.name}</Td>
                    </Tr>
                  </Tooltip>
                ))
              ) : (
                <Tr>
                  <Td colSpan={2} textAlign="center">
                    No locations match.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Legend */}
        <Box p={2} border="1px solid gray" borderRadius="md" mt={2}>
          <Heading size="xs" mb={1}>
            Legend
          </Heading>
          {legendData.map(item => (
            <Flex
              key={item.label}
              cursor="pointer"
              align="center"
              opacity={availableGroups.has(item.label)
                ? activeLegends[item.label]
                  ? 1
                  : 0.5
                : 0.3}
              mb={1}
              onClick={() =>
                setActiveLegends(prev => ({
                  ...prev,
                  [item.label]: !prev[item.label],
                }))
              }
            >
              <Box
                w="12px"
                h="12px"
                bg={item.color}
                borderRadius="full"
                mr={2}
              />
              <Text fontSize="xs">{item.label}</Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
export default DisasterShield;
