import { Box, Text, Flex, useColorMode } from '@chakra-ui/react';

// Adds labels to the value based on the metric
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
  };

  return metricLabels[metric] || { label: '', addSpace: false };
};

// MiniDashboard component
// Displays the time period, current value, min, and max values for a metric
// Used in multiple places in the app
const MiniDashboard = ({ weatherData, metric, setCurrentValue }) => {
  // Reverse the data so that the most recent data is at the end
  const reversedData = [...weatherData]?.reverse();
  // Get the current data for the metric
  const currentData = reversedData.map((data) => data[metric]);

  const { colorMode } = useColorMode();
  // Get the min, max, and most recent value for the metric
  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue =
    currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

    if (setCurrentValue) setCurrentValue(mostRecentValue);

  // Calculate the time period based on the length of the data
  // Also based on the metric, grand farm comes in 5 minute intervals
  // While everything else is in 10 minute intervals
  const calculateTimePeriod = (dataLength) => {
    const totalMinutes =
      metric === 'temperature' ||
      metric === 'percent_humidity' ||
      metric === 'wind_speed' ||
      metric === 'rain_15_min_inches' ||
      metric === 'soil_moisture' ||
      metric === 'leaf_wetness'
        ? dataLength * 5
        : dataLength * 10;
    const totalHours = Math.floor(totalMinutes / 60);

    if (totalHours < 24) {
      return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    } else if (totalHours < 72) {
      return '1 day';
    } else if (totalHours < 168) {
      return '3 days';
    } else {
      return '1 week';
    }
  };

  const timePeriod = calculateTimePeriod(currentData.length - 1);
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = (value) => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      <Flex justifyContent="space-evenly" mb={4} >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor={colorMode === 'light' ? '#cee8ff' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(mostRecentValue)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Current</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor={colorMode === 'light' ? '#cee8ff' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(min)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Low</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor={colorMode === 'light' ? '#cee8ff' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(max)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>High</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor={colorMode === 'light' ? '#cee8ff' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Flex alignItems="center">
            <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
              {timePeriod}
            </Text>
          </Flex>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Time</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default MiniDashboard;
