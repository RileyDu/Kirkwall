import React from 'react';
import { Box, Heading, Divider, Flex, useColorMode } from '@chakra-ui/react';
import MiniDashboard from '../../Charts/ChartDashboard.js';
import ChartWrapper from '../../Charts/ChartWrapper.js';
import { BarChart, LineChart } from '../../Charts/Charts.js';
import { useWeatherData } from '../../WeatherDataContext.js';
import { FaChessRook } from 'react-icons/fa/index.esm.js';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { handleChartChange } from '../../Charts/ChartUtils.js';

export default function HumiditySensors({ statusOfAlerts }) {

  const { 

    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
    loading,
    handleTimePeriodChange,
    watchdogData,
    watchdogTempData,
    watchdogHumData,
    rivercityTempData,
    rivercityHumData,
    rivercityData,
    APIIDs,

   } = useWeatherData();

  const [isReady, setIsReady] = useState(false);
  const [humidityChartType, setHumidityChartType] = useState('bar');
  const [tempChartType, setTempChartType] = useState('bar');



  const { colorMode } = useColorMode();

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
        Humidity Sensors
      </Heading>
      <Box width="100%">
        <MiniDashboard metric="percent_humidity" weatherData={humidityData || weatherData} />
      </Box>
      <Box color={colorMode === 'light' ? 'black' : 'white'}>
      <ChartWrapper
        title="Humidity (%)"
        onChartChange={handleChartChange(setHumidityChartType)}
        weatherData={humidityData || weatherData} 
        metric="percent_humidity"
        handleTimePeriodChange={handleTimePeriodChange}
        >
        
        {humidityChartType === 'line' ? (
                        <LineChart
                          data={humidityData || weatherData}
                          metric="percent_humidity"
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <BarChart
                          data={humidityData || weatherData}
                          metric="percent_humidity"
                          style={{ flex: 1 }}
                        />
                      )}

      </ChartWrapper>
      </Box>
      {/* <Divider
        my={'8'}
        borderWidth="4px"
        borderRadius={'full'}
      />
      <Box color={colorMode === 'light' ? 'black' : 'white'}>
      <ChartWrapper title="Humidity (%)" weatherData={humidityData || weatherData} metric={"percent_humidity"}>
        <LineChart data={humidityData || weatherData} metric="percent_humidity" />
      </ChartWrapper>
      </Box> */}
    </Box>
  );
}
