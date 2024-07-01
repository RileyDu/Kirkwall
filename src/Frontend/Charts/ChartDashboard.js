import { Box, Text, Flex } from '@chakra-ui/react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';


const getLabelForMetric = metric => {
  switch (metric) {
    case 'temperature':
      return { label: '°F', addSpace: false };
    case 'percent_humidity':
      return { label: '% Humidity', addSpace: false };
    case 'rain_15_min_inches':
      return { label: 'inches', addSpace: true };
    case 'wind_speed':
      return { label: 'MPH', addSpace: true };
    default:
      return { label: '', addSpace: false };
  }
};

const MiniDashboard = ({ weatherData, metric, adjustTimePeriod }) => {
  const reversedData = [...weatherData]?.reverse();
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

  const timePeriod = calculateTimePeriod(currentData.length - 1);
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      <Flex justifyContent="space-evenly" mb={4} flexWrap="wrap">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor="brand.800"
          bg="brand.400"
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['xl', '2xl']} fontWeight="bold" color={'#212121'}>
            {formatValue(mostRecentValue)}
          </Text>
          <Text fontSize={['lg', 'xl']}>Current</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor="brand.800"
          bg="brand.400"
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['xl', '2xl']} fontWeight="bold">
            {formatValue(min)}
          </Text>
          <Text fontSize={['lg', 'xl']}>Low</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor="brand.800"
          bg="brand.400"
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['xl', '2xl']} fontWeight="bold">
            {formatValue(max)}
          </Text>
          <Text fontSize={['lg', 'xl']}>High</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="3px solid"
          borderColor="brand.800"
          bg="brand.400"
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['100px', '150px', '175px']}
          textAlign="center"
        >
          <Flex alignItems="center">
          {/* <MinusIcon
                  icon={<MinusIcon />}
                  onClick={() => adjustTimePeriod(-12)}
                  aria-label="Decrease time period"
                  mr={2}
                  color={'red'}
                  cursor={'pointer'}
                /> */}
            <Text fontSize={['xl', '2xl']} fontWeight="bold">
              {timePeriod}
            </Text>
            {/* <AddIcon
                  icon={<AddIcon />}
                  onClick={() => adjustTimePeriod(12)}
                  aria-label="Increase time period"
                  ml={2}
                  color={'green'}
                  cursor={'pointer'}
                /> */}
          </Flex>
          <Text fontSize={['lg', 'xl']}>Time Period</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default MiniDashboard;
