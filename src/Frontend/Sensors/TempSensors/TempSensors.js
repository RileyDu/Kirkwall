import { Box, Divider, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import { useWeatherData } from '../../WeatherDataContext';

export default function TempSensors({  }) {

  const { weatherData, tempData } = useWeatherData();

  if (!weatherData && !tempData) {
    console.log('WeatherData is not defined', weatherData);
    return (
      <Box p="4" width="100%" height="100%" textAlign="center">
        <Spinner size="xl" />
        <Text mt="4">Loading temperature data...</Text>
      </Box>
    );
  }

  return (
    <Box p="4" width={'100%'} height={'100%'}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Temperature Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard weatherData={tempData || weatherData} metric="temperature" />
      </Box>
      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <ChartWrapper title="Temperature (°F)" weatherData={tempData || weatherData}>
            <LineChart data={tempData || weatherData} metric="temperature" />
          </ChartWrapper>
          <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"} />
          <ChartWrapper title="Temperature (°F)" weatherData={tempData || weatherData}>
            <BarChart data={ tempData || weatherData} metric="temperature" />
          </ChartWrapper>
        </Box>
      </Flex>
    </Box>
  );
}
