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

export default function WatchdogSensors({ statusOfAlerts }) {
  const { watchdogData, loading, watchdogTempData, watchdogHumData, handleTimePeriodChange } = useWeatherData();
  const [isReady, setIsReady] = useState(false);
  const [watchdogTempChartType, setWatchdogTempChartType] = useState('bar');
  const [watchdogHumidityChartType, setWatchdogHumidityChartType] = useState('bar');

  const { colorMode } = useColorMode();


  useEffect(() => {
    setIsReady(false);
    if (watchdogData && watchdogData.length > 0) {
      setIsReady(true);
    }
  }, [watchdogData]);

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

  const checkWaterSensor = data => {
    return data.some(entry => entry.water === 'yes');
  };

  const waterDetected = checkWaterSensor(watchdogData);

  return (
    <Box p="4" width="100%" height="100%" pt={statusOfAlerts ? "10px" : "74px"}>
      <Heading textAlign="center" mb="4" >
        Watchdog Sensors
      </Heading>
      <Box textAlign="center" mb="4">
        <Text
          display="inline-block"
          px="4"
          py="2"
          borderRadius="md"
          bg={waterDetected ? 'red.100' : 'green.100'}
          color={waterDetected ? 'red.600' : 'green.600'}
          fontWeight="bold"
          borderColor={waterDetected ? 'red.600' : 'green.600'}
          borderWidth="2px"
        >
          {waterDetected ? 'Water Detected' : 'No Water Detected'}
        </Text>
      </Box>
      <Box width="100%">
        <MiniDashboard weatherData={watchdogTempData || watchdogData} metric="temp" />
      </Box>

      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <Box color={colorMode === 'light' ? 'black' : 'white'}>
          <ChartWrapper
                      title="Temperature in Garage (°F)"
                      onChartChange={handleChartChange(setWatchdogTempChartType)}
                      weatherData={watchdogTempData || watchdogData}
                      metric="temp"
                      handleTimePeriodChange={handleTimePeriodChange}
                    >
                      {watchdogTempChartType === 'line' ? (
                        <LineChart
                          data={watchdogTempData || watchdogData}
                          metric="temp"
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <BarChart
                          data={watchdogTempData || watchdogData}
                          metric="temp"
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
            <MiniDashboard weatherData={watchdogHumData || watchdogData} metric="hum" />
          </Box>
          <Box color={colorMode === 'light' ? 'black' : 'white'}>
            <ChartWrapper
                      title="Humidity in Garage (%)"
                      onChartChange={handleChartChange(setWatchdogHumidityChartType)}
                      weatherData={watchdogHumData || watchdogData}
                      metric="hum"
                      handleTimePeriodChange={handleTimePeriodChange}
                    >
                      {watchdogHumidityChartType === 'line' ? (
                        <LineChart
                          data={watchdogHumData || watchdogData}
                          metric="hum"
                          style={{ flex: 1 }}
                        />
                      ) : (
                        <BarChart
                          data={watchdogHumData || watchdogData}
                          metric="hum"
                          style={{ flex: 1 }}
                        />
                      )}
                    </ChartWrapper>
          </Box>
        </Box>
      </Flex>
      {/* <Divider
        my="8"
        borderWidth="4px"
        borderRadius="full"
        bg={'brand.600'}
      /> */}

      {/* <Grid
        templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={6}
        mt={8}
      >
        {watchdogData.map(entry => (
          <GridItem key={entry.dataid}>
            <Box
              border="2px solid #212121"
              borderRadius="lg"
              overflow="hidden"
              p="6"
              bg={'brand.50'}
              boxShadow={'lg'}
            >
              <Heading size="lg" mb="2">
                Location: {entry.device_location}
              </Heading>
              <Text>
                <strong>Temperature:</strong> {entry.temp}°F
              </Text>
              <Text color={entry.hum > 90 ? 'red.500' : 'green.500'}>
                <strong>Humidity:</strong> {entry.hum}%
              </Text>
              <Text color={entry.water === 'no' ? 'green.500' : 'red.500'}>
                <strong>Water Level:</strong> {entry.water}
              </Text>
              <Text>
                <strong>Reading Time:</strong>{' '}
                {new Date(entry.reading_time).toLocaleString()}
              </Text>
              <Divider my="4" />
              <Text>
                <strong>API Name:</strong> {entry.api.apiname}
              </Text>
              <Text>
                <strong>Customer Name:</strong> {entry.api.customer.name}
              </Text>
            </Box>
          </GridItem>
        ))}
      </Grid> */}
    </Box>
  );
}
