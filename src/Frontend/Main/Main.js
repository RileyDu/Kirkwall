import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex, Text } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';


const MainContent = ({
  weatherData,
  isMinimized,
  timePeriod,
  adjustTimePeriod,
}) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, [isMinimized]);

  const handleChartChange = setChartType => newType => {
    setChartType(newType);
  };

  
      const spin = keyframes`
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    `;
  if (!isReady) {

    return (
      <Flex justify="center" align="center" height="100%">
      <Box
        as={FaChessRook}
        animation={`${spin} infinite 2s linear`}
        fontSize="6xl"
        color="black"
      />
      {/* <Text mt="4" fontSize="lg" color="teal.500">
        Loading...
      </Text> */}
    </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'white' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      width="100%"
      pb={12}
      overflowY="auto"
      height="calc(100vh - 64px)"
      mt='10px'
    >
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="6"
          height="100%"
          alignItems="start">
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Temperature (°F)"
            onChartChange={handleChartChange(setTempChartType)}
            weatherData={weatherData}
            metric="temperature"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" />
            ) : (
              <BarChart data={weatherData} metric="temperature" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Humidity (%)"
            onChartChange={handleChartChange(setHumidityChartType)}
            weatherData={weatherData}
            metric="percent_humidity"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Wind Speed (MPH)"
            onChartChange={handleChartChange(setWindChartType)}
            weatherData={weatherData}
            metric="wind_speed"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
