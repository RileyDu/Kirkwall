import { Box, Text, Grid, GridItem, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export const getLabelForMetric = (metric) => {
  switch (metric) {
    case 'temperature':
      return { label: '°F', addSpace: false };
    case 'percent_humidity':
      return { label: '%', addSpace: false };
    case 'rain_15_min_inches':
      return { label: 'inches', addSpace: true };
    case 'wind_speed':
      return { label: 'MPH', addSpace: true };
    default:
      return { label: '', addSpace: false };
  }
};

const ChartDetails = ({ chartType, metric, weatherData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      setLoading(false);
    }
  }, [weatherData]);

  const reversedData = weatherData ? [...weatherData].reverse() : [];
  const currentData = reversedData.map((data) => data[metric]);

  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue = currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

  const calculateTimePeriod = (dataLength) => {
    const totalMinutes = dataLength * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timePeriod = calculateTimePeriod(currentData.length - 1);

  const { label, addSpace } = getLabelForMetric(metric);

  const formatValue = (value) => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={[1, 2, 3]}
              border="1px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
            >
              <Text fontSize={['md', 'lg', '2xl']} fontWeight="bold">
                {formatValue(mostRecentValue)}
              </Text>
              <Text>Current</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={[1, 2, 3]}
              border="1px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
            >
              <Text fontSize={['md', 'lg', '2xl']} fontWeight="bold">
                {formatValue(min)}
              </Text>
              <Text>Low</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={[1, 2, 3]}
              border="1px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
            >
              <Text fontSize={['md', 'lg', '2xl']} fontWeight="bold">
                {formatValue(max)}
              </Text>
              <Text>High</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={[1, 2, 3]}
              border="1px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
            >
              <Flex alignItems="center">
                <Text fontSize={['md', 'lg', '2xl']} fontWeight="bold">
                  {timePeriod}
                </Text>
              </Flex>
              <Text>Time Period</Text>
            </Box>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};

export default ChartDetails;
