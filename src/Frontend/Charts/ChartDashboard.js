import { Box, Text, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getWeatherData } from '../../Backend/Graphql_helper';

const getLabelForMetric = (metric) => {
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

const MiniDashboard = ({ metric }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const reversedData = [...weatherData].reverse();
  const currentData = reversedData.map(data => data[metric]);

  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue = currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

  const calculateTimePeriod = dataLength => {
    const totalMinutes = dataLength * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timePeriod = calculateTimePeriod(currentData.length - 1);
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Flex justifyContent="space-evenly" mb={4}>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" bg='#fd9801' borderRadius="md" boxShadow="lg" m={1} width={'200px'}>
            <Text fontSize="3xl" fontWeight="bold" color={"#212121"}>{formatValue(mostRecentValue)}</Text>
            <Text fontSize={'2xl'} >Current Value</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" bg='#fd9801' borderRadius="md" boxShadow="lg" m={1} width={'200px'}>
            <Text fontSize="3xl" fontWeight="bold">{formatValue(min)}</Text>
            <Text fontSize={'2xl'}>Low</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" bg='#fd9801' borderRadius="md" boxShadow="lg" m={1} width={'200px'}>
            <Text fontSize="3xl" fontWeight="bold">{formatValue(max)}</Text>
            <Text fontSize={'2xl'}>High</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" bg='#fd9801' borderRadius="md" boxShadow="lg" m={1} width={'200px'}>
            <Flex alignItems="center">
              <Text fontSize="3xl" fontWeight="bold">{timePeriod}</Text>
            </Flex>
            <Text fontSize={'2xl'}>Time Period</Text>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default MiniDashboard;
