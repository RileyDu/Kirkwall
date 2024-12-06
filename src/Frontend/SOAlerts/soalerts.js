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
    Tag,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const SOAlerts = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
  
    const [securityAlerts, setSecurityAlerts] = useState([]);
  
    // Fetch security alerts from backend
    useEffect(() => {
      const fetchSecurityAlerts = async () => {
        try {
          const response = await axios.get('/api/soalerts');
          setSecurityAlerts(response.data);
        } catch (error) {
          console.error('Error fetching security alerts:', error);
        }
      };
  
      fetchSecurityAlerts();
    }, []);
  
    // Severity colors
    const severityColors = {
      high: 'red',
      medium: 'orange',
      low: 'yellow',
    };
  
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
          Cold Chain Dashboard
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
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Alert Name</Th>
                      <Th>Severity</Th>
                      <Th>Source IP</Th>
                      <Th>Timestamp</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {securityAlerts.map((alert) => (
                      <Tr key={alert.id} _hover={{ bg: 'gray.100' }}>
                        <Td>{alert.alert_name}</Td>
                        <Td>
                          <Tag
                            colorScheme={severityColors[alert.severity.toLowerCase()] || 'gray'}
                            size="sm"
                          >
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </Tag>
                        </Td>
                        <Td>{alert.source_ip || 'N/A'}</Td>
                        <Td>{new Date(alert.timestamp).toLocaleString()}</Td>
                      </Tr>
                    ))}
                    {/* If no alerts are present, display a message */}
                    {securityAlerts.length === 0 && (
                      <Tr>
                        <Td colSpan={4} textAlign="center">
                          No active alerts.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    );
  };
  
  export default SOAlerts;
  