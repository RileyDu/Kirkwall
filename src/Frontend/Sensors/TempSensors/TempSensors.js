import { Box, Divider, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';

export default function TempSensors({ weatherData }) {

  if (!weatherData) {
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
        <MiniDashboard weatherData={weatherData} metric="temperature" />
      </Box>
      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <ChartWrapper title="Temperature (°F)">
            <LineChart data={weatherData} metric="temperature" />
          </ChartWrapper>
          <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"} />
          <ChartWrapper title="Temperature (°F)">
            <BarChart data={weatherData} metric="temperature" />
          </ChartWrapper>
        </Box>
      </Flex>
    </Box>
  );
}
