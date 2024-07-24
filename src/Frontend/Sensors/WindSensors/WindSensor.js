import React from 'react';
import { Box, Heading, Text, Spinner, Flex, Divider, useMediaQuery, useColorMode } from '@chakra-ui/react';
import ReactSpeedometer from 'react-d3-speedometer';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
// import WindGauageStyling from './WindGaugeStyling.css';
import { useWeatherData } from '../../WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { handleChartChange } from '../../Charts/ChartUtils';

const getCardinalDirection = (degree) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degree % 360) / 45);
  return directions[index % 8];
};



export default function WindSensors({ statusOfAlerts }) {
  const [isMobile] = useMediaQuery("(max-width: 767px)");

  const { weatherData, windData, loading, handleTimePeriodChange } = useWeatherData();
  const [windChartType, setWindChartType] = useState('bar');

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

  const latestWindSpeed = weatherData[0]?.wind_speed;
  const latestWindDirection = weatherData[0]?.wind_direction;

  if (latestWindSpeed === undefined) {
    return (
      <Box p="4" width="100%" height="100%" textAlign="center">
        <Heading size="xl">Wind Sensors</Heading>
        <Box p="4" width="100%" height="100%" textAlign="center">
          <Text>No wind data available.</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100%" textAlign="center" p={'4'} pt={statusOfAlerts ? "10px" : "74px"}>
      <Heading size="xl" pb={'4'}>
        Wind Sensors
      </Heading>
      <Box width="100%" mb="4">
        <MiniDashboard metric="wind_speed" weatherData={weatherData} />
      </Box>
      {!isMobile && (
        <>
          <Flex
            direction="column"
            align="center"
            justify="center"
            p="4"
            textAlign="center"
            border={'2px'}
            borderColor="#fd9801"
            borderRadius="md"
            boxShadow="md"
            mb="4"
            bg={colorMode === 'light' ? '#f9f9f9' : '#303030'}
          >
            <Box border={'4px'} borderColor="brand.800" borderRadius="lg" px={2} mb={4} bg={'brand.400'}  textAlign="center">
            <Text fontSize="xxx-large" mb={'6'} mt={'6'} color={'#212121'}>
              Current Wind Speed and Direction: {latestWindSpeed} MPH {getCardinalDirection(latestWindDirection)}
            </Text>
            </Box>
            <Box mb={'-180px'} pb={'-180px'} >
              <ReactSpeedometer
                minValue={0}
                maxValue={100}
                value={Number(latestWindSpeed)}
                segments={9}
                segmentColors={[
                  '#00FF00', // Calm
                  '#7FFF00', // Light Breeze
                  '#FFFF00', // Gentle Breeze
                  '#FFD700', // Moderate Breeze
                  '#FFA500', // Fresh Breeze
                  '#FF8C00', // Strong Breeze
                  '#FF4500', // Gale
                  '#FF0000', // Strong Gale
                  '#8B0000', // Storm
                ]}
                customSegmentStops={[0, 5, 11, 19, 28, 38, 49, 61, 74, 100]}
                customSegmentLabels={[
                  { text: '0-5', position: 'OUTSIDE' },
                  { text: '6-11', position: 'OUTSIDE' },
                  { text: '12-19', position: 'OUTSIDE' },
                  { text: '20-28', position: 'OUTSIDE' },
                  { text: '29-38', position: 'OUTSIDE' },
                  { text: '39-49', position: 'OUTSIDE' },
                  { text: '50-61', position: 'OUTSIDE' },
                  { text: '62-74', position: 'OUTSIDE' },
                  { text: '75+', position: 'OUTSIDE' },
                ]}
                needleHeightRatio={0.7}
                needleColor="#000000"
                needleTransitionDuration={1000}
                needleTransition="easeElastic"
                valueTextShadowColor="black"
                currentValueText=" "
                width={800}
                height={600}
                textColor='grey'
              />
            </Box>
          </Flex>
          <Divider
            my={'8'}
            borderWidth="4px"
            borderRadius={'full'}
          />
        </>
      )}
      <Box width="100%" mb="4" color={colorMode === 'light' ? 'black' : 'white'}>
        <ChartWrapper
          title="Wind Speed (mph)"
          onChartChange={handleChartChange(setWindChartType)}
          weatherData={windData || weatherData}
          metric="wind_speed"
          handleTimePeriodChange={handleTimePeriodChange}
        >
          {windChartType === 'line' ? (
            <LineChart
              data={windData || weatherData}
              metric="wind_speed"
              style={{ flex: 1 }}
            />
          ) : (
            <BarChart
              data={windData || weatherData}
              metric="wind_speed"
              style={{ flex: 1 }}
            />
          )}
        </ChartWrapper>
      </Box>
      <Divider
        my={'8'}
        borderWidth="4px"
        borderRadius={'full'}
      />
      <Box width="100%" mb="4" color={colorMode === 'light' ? 'black' : 'white'}>
        <ChartWrapper title="Wind Speed (MPH)" weatherData={windData || weatherData} metric={'wind_speed'}>
          <BarChart data={windData || weatherData} metric="wind_speed" />
        </ChartWrapper>
      </Box>
    </Box>
  );
}
