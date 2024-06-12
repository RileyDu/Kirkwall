import { Box, Divider, Heading, Flex } from '@chakra-ui/react';
import TempBarGraph from '../../Charts/TempBarChart';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';

export default function TempSensors({ weatherData }) {
  return (
    <Box p="4" width={'100%'} height={'100%'}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Temperature Sensors
      </Heading>
      <Box width="100%" ml="4">
        <MiniDashboard weatherData={weatherData} metric="temperature" />
      </Box>
      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <ChartWrapper title="Temperature Over Time">
            <LineChart data={weatherData} metric="temperature" />
          </ChartWrapper>
          <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"} />
          <ChartWrapper title="Temperature Over Time">
            <BarChart data={weatherData} metric="temperature" />
          </ChartWrapper>
        </Box>
      </Flex>
    </Box>
  );
}
