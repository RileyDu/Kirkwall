import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getWeatherData } from '../../Backend/Graphql_helper';

const ChartDetails = ({ chartType, metric }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData();
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

  const calculateTimePeriod = (dataLength) => {
    const totalMinutes = dataLength * 5;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };



  const timePeriod = calculateTimePeriod(currentData.length-1); // Subtract 1 to account for the most recent value

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" borderRadius="md" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold">{mostRecentValue}</Text>
            <Text>Most Recent Value</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" borderRadius="md" boxShadow="md" mt={3}>
            <Text fontSize="2xl" fontWeight="bold">{min}</Text>
            <Text>Min Value</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" borderRadius="md" boxShadow="md" mt={3}>
            <Text fontSize="2xl" fontWeight="bold">{max}</Text>
            <Text>Max Value</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" p={2} border="1px solid" borderColor="#212121" borderRadius="md" boxShadow="md" mt={3}>
            <Text fontSize="2xl" fontWeight="bold">{timePeriod}</Text>
            <Text>Time Period</Text>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChartDetails;
