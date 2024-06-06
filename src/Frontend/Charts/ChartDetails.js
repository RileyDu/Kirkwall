import { Box, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getWeatherData } from '../../Backend/Graphql_helper';

const ChartDetails = ({ chartType }) => {
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


  const currentData = reversedData.map(data => data.temperature);

  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue = currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

  return (
    <Box>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text fontWeight="bold">Chart Type: {chartType}</Text>
          <Text>Most Recent Value: {mostRecentValue}</Text>
          <Text>Min Value: {min}</Text>
          <Text>Max Value: {max}</Text>
        </>
      )}
    </Box>
  );
};

export default ChartDetails;
