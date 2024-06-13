import React from 'react';
import { Box, Heading, Divider, Spinner, Text } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';

export default function HumiditySensors({ weatherData }) {

  if (!weatherData) {
    console.log('WeatherData is not defined', weatherData);
    return (
      <Box p="4" width="100%" height="100%" textAlign="center">
        <Spinner size="xl" />
        <Text mt="4">Loading humidity data...</Text>
      </Box>
    );
  }

  return (
    <Box p="4" width={'100%'} height={'100%'}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Humidity Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard metric="percent_humidity" weatherData={weatherData} />
      </Box>
      <ChartWrapper title="Humidity (%)">
        <BarChart data={weatherData} metric="percent_humidity" />
      </ChartWrapper>
      <Divider
        my={'8'}
        borderColor="#212121"
        borderWidth="4px"
        borderRadius={'full'}
      />
      <ChartWrapper title="Humidity (%)">
        <LineChart data={weatherData} metric="percent_humidity" />
      </ChartWrapper>
    </Box>
  );
}
