import {
  Box,
  Divider,
  Heading,
  Flex,
  Spinner,
  Text,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useWeatherData } from '../../WeatherDataContext';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function WatchdogSensors() {
  const { watchdogData, loading } = useWeatherData();
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    setIsReady(false);
    if (watchdogData.length > 0) {
      setIsReady(true);
    }
  }, [watchdogData]);

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

  const checkWaterSensor = data => {
    return data.some(entry => entry.water === 'yes');
  };

  const waterDetected = checkWaterSensor(watchdogData);

  return (
    <Box p="4" width="100%" height="100%" pt="64px">
      <Heading textAlign="center" mb="4">
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
        <MiniDashboard weatherData={watchdogData} metric="temp" />
      </Box>

      <Flex direction="row" justifyContent="space-between">
        <Box width="100%">
          <ChartWrapper
            title="Temperature in Garage (°F)"
            weatherData={watchdogData}
            metric="temp"
          >
            <LineChart data={watchdogData} metric="temp" />
          </ChartWrapper>
          <Divider
            my="8"
            borderColor="#212121"
            borderWidth="4px"
            borderRadius="full"
          />
          <Box width="100%">
            <MiniDashboard weatherData={watchdogData} metric="hum" />
          </Box>
          <ChartWrapper
            title="Humidity in Garage (%)"
            weatherData={watchdogData}
            metric="hum"
          >
            <BarChart data={watchdogData} metric="hum" />
          </ChartWrapper>
        </Box>
      </Flex>
      <Divider
        my="8"
        borderColor="#212121"
        borderWidth="4px"
        borderRadius="full"
      />

      <Grid
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
      </Grid>
    </Box>
  );
}
