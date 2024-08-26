import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Text,
  Stack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaChessRook } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/color-mode';
import { useMediaQuery } from '@chakra-ui/media-query';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { SummaryMetrics } from './SummaryMetrics.js';
import { CustomerSettings } from './CustomerSettings.js';
import { useWeatherData } from '../WeatherDataContext.js';
import { keyframes } from '@emotion/react';

const ModularSummary = ({ statusOfAlerts }) => {
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const userEmail = currentUser.email;
  const userMetrics =
    CustomerSettings.find(customer => customer.email === userEmail)?.metric ||
    [];

  const { loading, alertsThreshold } = useWeatherData();

  const metrics = SummaryMetrics();

  const filteredSummaryMetrics = metrics.filter(metric =>
    userMetrics.includes(metric.metric)
  );

  const getLabelForMetric = metric => {
    const metricLabels = {
      temperature: { label: '°F', addSpace: false },
      temp: { label: '°F', addSpace: false },
      rctemp: { label: '°F', addSpace: false },

      imFreezerOneTemp: { label: '°C', addSpace: false },
      imFreezerTwoTemp: { label: '°C', addSpace: false },
      imFreezerThreeTemp: { label: '°C', addSpace: false },
      imFridgeOneTemp: { label: '°C', addSpace: false },
      imFridgeTwoTemp: { label: '°C', addSpace: false },
      imIncubatorOneTemp: { label: '°C', addSpace: false },
      imIncubatorTwoTemp: { label: '°C', addSpace: false },

      imFreezerOneHum: { label: '%', addSpace: false },
      imFreezerTwoHum: { label: '%', addSpace: false },
      imFreezerThreeHum: { label: '%', addSpace: false },
      imFridgeOneHum: { label: '%', addSpace: false },
      imFridgeTwoHum: { label: '%', addSpace: false },
      imIncubatorOneHum: { label: '%', addSpace: false },
      imIncubatorTwoHum: { label: '%', addSpace: false },

      hum: { label: '%', addSpace: false },
      percent_humidity: { label: '%', addSpace: false },
      humidity: { label: '%', addSpace: false },
      rain_15_min_inches: { label: 'inches', addSpace: true },
      wind_speed: { label: 'MPH', addSpace: true },
      soil_moisture: { label: 'centibars', addSpace: true },
      leaf_wetness: { label: 'out of 15', addSpace: true },
    };

    return metricLabels[metric] || { label: '', addSpace: false };
  };

  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');
  const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color={getLogoColor()}
        />
      </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Statistics Overview</Tab>
          <Tab>Alert Backlog</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Heading size="lg" mb="4" textAlign="center">
              Statistics Overview
            </Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {filteredSummaryMetrics.map((metric, index) => {
                const { label, addSpace } = getLabelForMetric(metric.metric);
                const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;
                return (
                  <GridItem key={index}>
                    <Box
                      bgGradient="linear(to-r, teal.500, blue.500)"
                      borderRadius="lg"
                      boxShadow="xl"
                      p={4}
                      color="white"
                    >
                      <Stat>
                        <Box>
                          <StatLabel>{metric.label}</StatLabel>
                        </Box>
                        <SimpleGrid columns={2} spacing={4}>
                          <Box>
                            <StatNumber>{formatValue(metric.current)} Current</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{formatValue(metric.high)} High</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{formatValue(metric.average)} Average</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{formatValue(metric.low)} Low</StatNumber>
                          </Box>
                        </SimpleGrid>
                      </Stat>
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mb="4" textAlign="center">
              Alerts Backlog
            </Heading>
            <Box
              bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
              borderRadius="lg"
              p={4}
              boxShadow="xl"
              h="auto"
              overflowY="scroll"
            >
              <Stack spacing={4}>
                {alertsThreshold?.length > 0 ? (
                  alertsThreshold.map((alert, alertIndex) => (
                    <Box
                      key={alertIndex}
                      bg="orange.400"
                      p={3}
                      borderRadius="md"
                      boxShadow="md"
                    >
                      <Flex justify="space-between" align="center">
                        <Text color="#212121" fontSize="sm">
                          {alert.message}
                        </Text>
                      </Flex>
                    </Box>
                  ))
                ) : (
                  <Box
                    bg="orange.400"
                    p={3}
                    borderRadius="md"
                    boxShadow="md"
                    _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
                  >
                    <Flex justify="space-between" align="center">
                      <Text color="#212121" fontSize="sm">
                        No Alerts
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Stack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ModularSummary;
