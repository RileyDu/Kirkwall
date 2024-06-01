import { Box, Divider, Heading } from '@chakra-ui/react';
import TempBarGraph from '../../Charts/TempBarChart';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';

export default function TempSensors({ weatherData }) {

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
      
    </Box>
  );
}
