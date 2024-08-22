import { Box, Grid, GridItem, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useMediaQuery } from '@chakra-ui/media-query';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { SummaryMetrics } from './SummaryMetrics.js';
import { CustomerSettings } from './CustomerSettings.js';

const ModularSummary = ({ statusOfAlerts }) => {
  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const userEmail = currentUser.email;

  // Call SummaryMetrics to get the array
  const metrics = SummaryMetrics();

  const filteredSummaryMetrics = metrics.filter(metric => {
    const userMetrics = CustomerSettings.find(customer => customer.email === userEmail)?.metric || [];
    console.log(userMetrics);
    
    return userMetrics.includes(metric.metric);
  });

  console.log(filteredSummaryMetrics);

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
                      <StatNumber color="white">{metric.value}</StatNumber>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
    </Box>
  );
};

export default ModularSummary;
