import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Compass from 'react-compass';



export default function WindSensors({ WeatherData }) {
    const windDirection = WeatherData.wind_direction;
    const windSpeed = WeatherData.wind_speed;
   return (
       <Box p="4" width={'100%'} height={'100%'}>
   <Heading size="xl" textAlign={'center'}> Wind Sensors </Heading>
   <Box>
    <Compass direction={windDirection} />
    <p>Wind Speed: {windSpeed} km/h</p>
  </Box>
   </Box>
   );
}