import React from 'react';
import { Box, Heading, Divider } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';


export default function HumiditySensors({ weatherData }) {
   return (
       <Box p="4" width={'100%'} height={'100%'}>
   <Heading size="xl" textAlign={'center'} mb={'4'}>Humidity Sensors</Heading>
   <Box width="100%" ml="4">
          <MiniDashboard metric="percent_humidity" />
        </Box>
   <ChartWrapper title="Humidity Levels">
            <BarChart data={weatherData} metric="percent_humidity" />
          </ChartWrapper>
          <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"}/>
          <ChartWrapper title="Humidity Levels">
            <LineChart data={weatherData} metric="percent_humidity" />
          </ChartWrapper>
   </Box>
   );
}