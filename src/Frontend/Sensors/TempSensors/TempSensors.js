import { Box, Divider, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import { useWeatherData } from '../../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function TempSensors({  }) {

  const { weatherData, tempData, loading } = useWeatherData();

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
        Temperature Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard weatherData={tempData || weatherData} metric="temperature" />
      </Box>
      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <ChartWrapper title="Temperature (°F)" weatherData={tempData || weatherData}>
            <LineChart data={tempData || weatherData} metric="temperature" />
          </ChartWrapper>
          <Divider my={'8'} borderWidth="4px" borderRadius={"full"} />
          <ChartWrapper title="Temperature (°F)" weatherData={tempData || weatherData}>
            <BarChart data={ tempData || weatherData} metric="temperature" />
          </ChartWrapper>
        </Box>
      </Flex>
    </Box>
  );
}
