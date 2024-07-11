import { Box, Divider, Heading, Flex, Spinner, Text, useColorMode } from '@chakra-ui/react';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import { useWeatherData } from '../../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function SoilSensors({ statusOfAlerts }) {
  const { weatherData, soilMoistureData, loading } = useWeatherData();

  const { colorMode } = useColorMode();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(false);
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');

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
          color={getLogoColor()}
        />
      </Flex>
    );
  }

  return (
    <Box p="4" width={'100%'} height={'100%'} pt={statusOfAlerts ? "10px" : "74px"}>
      <Heading size="xl" textAlign={'center'} mb={'4'}>
        Soil Moisture Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard
          weatherData={soilMoistureData || weatherData}
          metric="soil_moisture"
        />
      </Box>
      <Flex
        direction="row"
        justifyContent="space-between"
        color={colorMode === 'light' ? 'black' : 'white'}
      >
        <Box width="100%">
          <ChartWrapper
            title="Soil Moisture (centibar)"
            weatherData={soilMoistureData || weatherData}
            metric={'soil_moisture'}
          >
            <LineChart data={soilMoistureData || weatherData} metric="soil_moisture" />
          </ChartWrapper>
          <Divider my={'8'} borderWidth="4px" borderRadius={'full'} />
          <ChartWrapper
            title="Soil Moisture (centibar)"
            weatherData={soilMoistureData || weatherData}
            metric={'soil_moisture'}
          >
            <BarChart data={soilMoistureData || weatherData} metric="soil_moisture" />
          </ChartWrapper>
        </Box>
      </Flex>
    </Box>
  );
}
