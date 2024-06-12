import React from 'react';
import { Box, Heading, Divider } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';

export default function RainSensors({ weatherData }) {
   return (
       <Box p="4" width={'100%'} height={'100%'}>
           <Heading size="xl" textAlign={'center'} mb={'4'}>Rain Sensors</Heading>
           <Box width="100%" ml="4">
          <MiniDashboard metric="rain_15_min_inches" weatherData={weatherData} />
        </Box>
           <ChartWrapper title="Rain Levels">
               <BarChart data={weatherData} metric="rain_15_min_inches" />
           </ChartWrapper>
           <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"} />
           <ChartWrapper title="Rain Levels">
               <LineChart data={weatherData} metric="rain_15_min_inches" />
           </ChartWrapper>
       </Box>
   );
}
