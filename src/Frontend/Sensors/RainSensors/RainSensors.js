import React from 'react';
import { Box, Heading, Divider } from '@chakra-ui/react';

import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';

export default function RainSensors({ weatherData }) {
   return (
       <Box p="4" width={'100%'} height={'100%'}>
           <Heading size="xl" textAlign={'center'} mb={'4'}>Rain Sensors</Heading>
           <ChartWrapper title="Rain Levels">
               <BarChart data={weatherData} metric="rainfall_amount" />
           </ChartWrapper>
           <Divider my={'8'} borderColor="blue.500" borderWidth="4px" />
           <ChartWrapper title="Rain Levels">
               <LineChart data={weatherData} metric="rainfall_amount" />
           </ChartWrapper>
       </Box>
   );
}
