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
              {filteredSummaryMetrics.map((metric, index) => (
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
                            <StatNumber>{metric.current} Current</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{metric.high} High</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{metric.average} Average</StatNumber>
                          </Box>
                          <Box>
                            <StatNumber>{metric.low} Low</StatNumber>
                          </Box>
                        </SimpleGrid>
                      </Stat>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mb="4" textAlign="center">
              Alerts Backlog
            </Heading>
            <Box
              // mt={8}
              bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
              borderRadius="lg"
              p={4}
              boxShadow="xl"
              // maxH="300px"
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
