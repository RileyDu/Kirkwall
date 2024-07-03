import React from 'react';
import { Box, Heading, Divider, Spinner, Text, Flex } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import { useWeatherData } from '../../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function RainSensors() {

  const { weatherData, rainfallData, loading } = useWeatherData();

  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color="black"
        />
      </Flex>
    );
  }

  return (
    <Box p="4" width={'100%'} height={'100%'} pt={'64px'}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Rain Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard metric="rain_15_min_inches" weatherData={rainfallData || weatherData} />
      </Box>
      <ChartWrapper title="Rainfall (inches)" weatherData={rainfallData || weatherData}>
        <BarChart data={rainfallData || weatherData} metric="rain_15_min_inches" />
      </ChartWrapper>
      <Divider
        my={'8'}
        borderColor="#212121"
        borderWidth="4px"
        borderRadius={'full'}
      />
      <ChartWrapper title="Rainfall (inches)" weatherData={rainfallData || weatherData}>
        <LineChart data={rainfallData || weatherData} metric="rain_15_min_inches" />
      </ChartWrapper>
    </Box>
  );
}
