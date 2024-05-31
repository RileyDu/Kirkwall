import { Box, Divider, Heading } from '@chakra-ui/react';
import TempBarGraph from '../../Charts/TempBarChart';
import ChartWrapper from '../../Charts/ChartWrapper';
import { getWeatherData } from '../../../Backend/Graphql_helper';
import { BarChart, LineChart } from '../../Charts/Charts';
import { useEffect, useState } from 'react';

export default function TempSensors() {
  const [weatherData, setWeatherData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Box p="4" width={'100%'} height={'100%'}>
      <Heading size="lg" textAlign={'center'} mb={'4'}>
        Temperature Sensors
      </Heading>
      <ChartWrapper title="Temperature Over Time">
        <LineChart data={weatherData} metric="temperature" />
      </ChartWrapper>
      <Divider my={'8'} borderColor="blue.500" borderWidth="4px" />
      <ChartWrapper title="Temperature Over Time">
        <BarChart data={weatherData} metric="temperature" />
      </ChartWrapper>
      <Divider my={'8'} borderColor="blue.500" borderWidth="4px" />
      {/* <ChartWrapper title="Temperature Levels"> */}
        <TempBarGraph /> 
        {/* Brought this in from the previous Demo, doesnt work as well as it should with the wrapper */}
      {/* </ChartWrapper> */}
      {/* <ChartWrapper title="Humidity Over Time">
        <LineChart data={weatherData} metric="humidity" />
      </ChartWrapper> */}
    </Box>
  );
}
