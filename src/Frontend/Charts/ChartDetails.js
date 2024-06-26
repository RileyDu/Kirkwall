import { Box, Text, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getWeatherData } from '../../Backend/Graphql_helper';

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

const ChartDetails = ({ chartType, metric }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [limit, setLimit] = useState(26);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData('25');
        setWeatherData(response.data.weather_data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []); // Add limit as a dependency to refetch data when it changes

  const reversedData = [...weatherData].reverse();

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

  const timePeriod = calculateTimePeriod(currentData.length - 1); // Subtract 1 to account for the most recent value

  const { label, addSpace } = getLabelForMetric(metric);

  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  // const incrementLimit = () => setLimit(prevLimit => prevLimit + 1);
  // const decrementLimit = () => setLimit(prevLimit => Math.max(1, prevLimit - 1)); // Ensure limit does not go below 1

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
            border="1px solid"
            borderColor="#212121"
            borderRadius="md"
            boxShadow="md"
          >
            <Text fontSize="2xl" fontWeight="bold">
              {formatValue(mostRecentValue)}
            </Text>
            <Text>Current Value</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
            border="1px solid"
            borderColor="#212121"
            borderRadius="md"
            boxShadow="md"
            mt={3}
          >
            <Text fontSize="2xl" fontWeight="bold">
              {formatValue(min)}
            </Text>
            <Text>Low</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
            border="1px solid"
            borderColor="#212121"
            borderRadius="md"
            boxShadow="md"
            mt={3}
          >
            <Text fontSize="2xl" fontWeight="bold">
              {formatValue(max)}
            </Text>
            <Text>High</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={2}
            border="1px solid"
            borderColor="#212121"
            borderRadius="md"
            boxShadow="md"
            mt={3}
          >
            <Flex alignItems="center">
              {/* <Icon as={FaPlus} color="green.500" mr={2} ml={2} boxSize={5} onClick={incrementLimit} /> */}
              <Text fontSize="2xl" fontWeight="bold" >
                {timePeriod}
              </Text>
              {/* <Icon as={FaMinus} color="red.500" boxSize={5} onClick={decrementLimit} /> */}
            </Flex>
            <Text>Time Period</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChartDetails;
