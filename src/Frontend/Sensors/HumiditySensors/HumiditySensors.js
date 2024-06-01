import React from 'react';
import { Box, Heading, Divider } from '@chakra-ui/react';

import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';


export default function HumiditySensors({ weatherData }) {
   return (
       <Box p="4" width={'100%'} height={'100%'}>
   <Heading size="xl" textAlign={'center'} mb={'4'}>Humidity Sensors</Heading>
   <ChartWrapper title="Humidity Levels">
            <BarChart data={weatherData} metric="percent_humidity" />
          </ChartWrapper>
          <Divider my={'8'} borderColor="blue.500" borderWidth="4px" />
          <ChartWrapper title="Humidity Levels">
            <LineChart data={weatherData} metric="percent_humidity" />
          </ChartWrapper>
   </Box>
   );
}