import {
    Box,
    Divider,
    Heading,
    Flex,
    Spinner,
    Text,
    Grid,
    GridItem,
    useColorMode
  } from '@chakra-ui/react';
  import { useWeatherData } from '../../WeatherDataContext';
  import ChartWrapper from '../../Charts/ChartWrapper';
  import { BarChart, LineChart } from '../../Charts/Charts';
  import MiniDashboard from '../../Charts/ChartDashboard';
  import { FaChessRook } from 'react-icons/fa';
  import { keyframes } from '@emotion/react';
  import { useEffect, useState } from 'react';
  
  export default function RivercitySensors({ statusOfAlerts }) {
    const { rivercityData, rivercityTempData, rivercityHumData, loading } = useWeatherData();
    const [isReady, setIsReady] = useState(false);
  
    const { colorMode } = useColorMode();
  
    useEffect(() => {
      setIsReady(false);
      if (rivercityData && rivercityData.length > 0) {
        setIsReady(true);
      }
    }, [rivercityData]);
  
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
      <Box p="4" width="100%" height="100%" pt={statusOfAlerts ? "10px" : "74px"}>
        <Heading textAlign="center" mb="4" >
          Rivercity Sensors
        </Heading>
        <Box width="100%">
          <MiniDashboard weatherData={rivercityTempData || rivercityData} metric="rctemp" />
        </Box>
        <Flex direction="row" justifyContent="space-between">
          <Box width="100%">
            <Box color={colorMode === 'light' ? 'black' : 'white'}>
            <ChartWrapper
              title="Temperature in Freezer (°F)"
              weatherData={rivercityTempData || rivercityData}
              metric="rctemp"
            >
              <LineChart data={rivercityTempData || rivercityData} metric="rctemp" />
            </ChartWrapper>
            </Box>
            <Divider
              my="8"
              // borderColor="#212121"
              borderWidth="4px"
              borderRadius="full"
            />
            <Box width="100%">
              <MiniDashboard weatherData={rivercityHumData || rivercityData} metric="humidity" />
            </Box>
            <Box color={colorMode === 'light' ? 'black' : 'white'}>
            <ChartWrapper
              title="Humidity in Freezer (%)"
              weatherData={rivercityHumData || rivercityData}
              metric="humidity"
            >
              <BarChart data={rivercityHumData || rivercityData} metric="humidity" />
            </ChartWrapper>
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  }
  