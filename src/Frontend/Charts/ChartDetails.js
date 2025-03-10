import { Box, Text, Grid, GridItem, Flex, Icon } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';

export const getLabelForMetric = metric => {
  const metricLabels = {
    temperature: { label: '°F', addSpace: false },
    temp: { label: '°F', addSpace: false },
    hum: { label: '%', addSpace: false },
    percent_humidity: { label: '%', addSpace: false },
    rain_15_min_inches: { label: 'inches', addSpace: true },
    wind_speed: { label: 'MPH', addSpace: true },
    soil_moisture: { label: 'centibars', addSpace: true },
    leaf_wetness: { label: 'out of 15', addSpace: true },
    monnit_bathroom: { label: '???', addSpace: true },
    monnit_fridge: { label: '°F', addSpace: false },
    monnit_freezer: { label: '°F', addSpace: false },
  };

  return metricLabels[metric] || { label: '', addSpace: false };
};


const ChartDetails = ({
  chartType,
  metric,
  weatherData,
  timePeriod,
  adjustTimePeriod,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weatherData && weatherData.length > 0) {
      setLoading(false);
    }
  }, [weatherData]);

  const reversedData = weatherData ? [...weatherData].reverse() : [];
  const currentData = reversedData.map(data => data[metric]);

  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue =
    currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

  const calculateTimePeriod = dataLength => {
    const totalMinutes = dataLength * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  };

  const timePeriodDisplay = calculateTimePeriod(currentData.length - 1);

  const { label, addSpace } = getLabelForMetric(metric);

  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

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
              border="1.5px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
              bg={'white'}
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
              border="1.5px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
              bg={'white'}
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
              border="1.5px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
              bg={'white'}
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
              border="1.5px solid"
              borderColor="#212121"
              borderRadius="md"
              boxShadow="md"
              mt={[1, 2, 3]}
              bg={'white'}
            >
              <Flex alignItems="center">
                <MinusIcon
                  // icon={<MinusIcon />}
                  onClick={() => adjustTimePeriod(-12)}
                  aria-label="Decrease time period"
                  mr={2}
                  color={'red'}
                  cursor={'pointer'}
                />
                <Text fontSize={['md', 'lg', '2xl']} fontWeight="bold">
                  {timePeriodDisplay}
                </Text>
                <AddIcon
                  // icon={<AddIcon />}
                  onClick={() => adjustTimePeriod(12)}
                  aria-label="Increase time period"
                  ml={2}
                  color={'green'}
                  cursor={'pointer'}
                />
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
