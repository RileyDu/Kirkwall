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

  import { useWeatherData } from '../../WeatherDataContext.js';
  import ChartWrapper from '../../Charts/ChartWrapper.js';
  import { BarChart, LineChart } from '../../Charts/Charts.js';
  import MiniDashboard from '../../Charts/ChartDashboard.js';
  import { FaChessRook } from 'react-icons/fa';
  import { keyframes } from '@emotion/react';
  import { useEffect, useState } from 'react';
  import { handleChartChange } from '../../Charts/ChartUtils.js';

  
  export default function RivercitySensors({ statusOfAlerts }) {
    const { rivercityData, rivercityTempData, rivercityHumData, loading, handleTimePeriodChange } = useWeatherData();
    const [isReady, setIsReady] = useState(false);
    const [rivercityTempChartType, setRivercityTempChartType] = useState('bar');
    const [rivercityHumChartType, setRivercityHumChartType] = useState('bar');


  
    const { colorMode } = useColorMode();
  
    useEffect(() => {
      setIsReady(false);
      if (rivercityData && rivercityData.length > 0) {
        setIsReady(true);
      }
    }, [rivercityData]);

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
                title="Temperature (°F)"
                onChartChange={handleChartChange(setRivercityTempChartType)}
                weatherData={rivercityTempData || rivercityData}
                metric="rctemp"
                flex="1"
                display="flex"
                flexDirection="column"
                handleTimePeriodChange={handleTimePeriodChange}
              >
                {rivercityTempChartType === 'line' ? (
                  <LineChart
                    data={rivercityTempData || rivercityData}
                    metric="rctemp"
                    style={{ flex: 1 }}
                  />
                  ) : (
                  <BarChart
                    data={rivercityTempData || rivercityData}
                    metric="rctemp"
                    style={{ flex: 1 }}
                  />
                  )}
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
            <GridItem colSpan={{ base: 1, lg: 1 }} display="flex">
                    <ChartWrapper
                      title="Humidity (%)"
                      onChartChange={handleChartChange(setRivercityHumChartType)}
                      weatherData={rivercityHumData || rivercityData}
                      metric="humidity"
                      display="flex"
                      flexDirection="column"
                      handleTimePeriodChange={handleTimePeriodChange}
                    >
                      {rivercityHumChartType === 'line' ? (
                        <LineChart
                          data={rivercityHumData || rivercityData}
                          metric="humidity"
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <BarChart
                          data={rivercityHumData || rivercityData}
                          metric="humidity"
                          style={{ flex: 1 }}
                        />
                      )}
                    </ChartWrapper>
                  </GridItem>
            </Box>
          </Box>
        </Flex>
      </Box>
    );
  }
  