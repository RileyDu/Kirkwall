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
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
  
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };
  
  const center = {
    lat: 39.8283, // Default center (USA)
    lng: -98.5795,
  };
  
  const DisasterShield = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
    const [disasterSites, setDisasterSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
  
    // Load Google Maps API
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this is set in .env
    });
  
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
  
    if (loadError) return <Text>Error loading maps</Text>;
    if (!isLoaded) return <Text>Loading Maps...</Text>;
  
    return (
      <Box mx="auto" mt={16} px={4} display="flex" flexDirection="column" alignItems="center">
        <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
          Disaster Shield Locations
        </Heading>
  
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={6}
          width="100%"
          maxW="1200px"
        >
          {/* Disaster Sites Table */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Box bg={cardBg} borderRadius="20px" boxShadow={cardShadow} p={6}>
              <Heading size="md" textAlign="left" mb={4}>
                Registered Locations
              </Heading>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Address</Th>
                      <Th>Phone Number</Th>
                      <Th>Type</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {disasterSites.map((site) => (
                      <Tr key={site.id} onClick={() => setSelectedSite(site)} cursor="pointer">
                        <Td>{site.name}</Td>
                        <Td>{site.address}</Td>
                        <Td>{site.phone_number}</Td>
                        <Td>{site.type}</Td>
                      </Tr>
                    ))}
                    {disasterSites.length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center">
                          No locations registered.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </GridItem>
  
          {/* Google Maps Section */}
          <GridItem colSpan={1}>
            <Box bg={cardBg} borderRadius="20px" boxShadow={cardShadow} p={4}>
              <Heading size="md" textAlign="left" mb={4}>
                Map View
              </Heading>
              <GoogleMap mapContainerStyle={mapContainerStyle} zoom={4} center={center}>
                {disasterSites.map((site) => (
                  <Marker
                    key={site.id}
                    position={{
                      lat: parseFloat(site.latitude) || 0,
                      lng: parseFloat(site.longitude) || 0,
                    }}
                    onClick={() => setSelectedSite(site)}
                  />
                ))}
                {selectedSite && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(selectedSite.latitude) || 0,
                      lng: parseFloat(selectedSite.longitude) || 0,
                    }}
                    onCloseClick={() => setSelectedSite(null)}
                  >
                    <Box>
                      <Heading size="sm">{selectedSite.name}</Heading>
                      <Text>{selectedSite.type}</Text>
                      <Text>{selectedSite.address}</Text>
                    </Box>
                  </InfoWindow>
                )}
              </GoogleMap>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    );
  };
  
  export default DisasterShield;
  