import { Box, Grid, GridItem, Stat, StatLabel, StatNumber, Flex } from '@chakra-ui/react';
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

  const { loading } = useWeatherData();

  // Call SummaryMetrics to get the array
  const metrics = SummaryMetrics();

  const filteredSummaryMetrics = metrics.filter(metric => {
    const userMetrics = CustomerSettings.find(customer => customer.email === userEmail)?.metric || [];    
    return userMetrics.includes(metric.metric);
  });

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
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {filteredSummaryMetrics.map((metric, index) => (
                  <GridItem key={index}>
                    <Stat>
                      <StatLabel color="white" textDecoration={'underline'}>{metric.label}</StatLabel>
                      <StatNumber color="white">{metric.average} Average</StatNumber>
                      <StatNumber color="white">{metric.current} Current</StatNumber>
                      <StatNumber color="white">{metric.high} High</StatNumber>
                      <StatNumber color="white">{metric.low} Low </StatNumber>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
    </Box>
  );
};

export default ModularSummary;
