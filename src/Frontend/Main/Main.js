import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { getWeatherData } from '../../Backend/Graphql_helper';

const MainContent = ({
  // weatherData,
  isMinimized,
  timePeriod,
  adjustTimePeriod,
}) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');
  const [isReady, setIsReady] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('3H'); // Default time period
  const [specificChartMetric, setSpecificChartMetric] = useState('all');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData('all', timePeriod);
        if (Array.isArray(response.data.weather_data)) {
          setWeatherData(response.data.weather_data);
        } else {
          setWeatherData([]);
          console.error('Fetched weather data is not an array');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherData([]);
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [timePeriod]);

  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 600); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, [isMinimized]);

  const handleTimePeriodChange = (metric, timePeriod) => {
    setSelectedTimePeriod(timePeriod);
    setSpecificChartMetric(metric)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriod);
        const result = await getWeatherData(specificChartMetric, limit);
        setWeatherData(result.data.weather_data); // Adjust according to your API response structure
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [specificChartMetric, selectedTimePeriod]); // Trigger fetchData when metric or selectedTimePeriod changes

  const determineLimitBasedOnTimePeriod = (timePeriod) => {
    switch (timePeriod) {
      case '1H':
        return 13; // Example limit for 1 hour
      case '3H':
        return 37; // Example limit for 3 hours
      case '6H':
        return 73; // Example limit for 6 hours
      case '12H':
        return 145; // Example limit for 12 hours
      case '1D':
        return 289; // Example limit for 1 day
      case '3D':
        return 865; // Example limit for 3 days
      case '1W':
        return 2017; // Example limit for 1 week
      default:
        return 37; // Default limit
    }
  };

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
      </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.800'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt="74px" // Adjust this value based on your header height
      width="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap="6"
        flex="1"
      >
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Temperature (°F)"
            onChartChange={handleChartChange(setTempChartType)}
            weatherData={weatherData}
            metric="temperature"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={tempChartType} // Add this key to ensure re-render
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="temperature" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Humidity (%)"
            onChartChange={handleChartChange(setHumidityChartType)}
            weatherData={weatherData}
            metric="percent_humidity"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={humidityChartType} // Add this key to ensure re-render
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            // adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={rainfallChartType} // Add this key to ensure re-render
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Wind Speed (MPH)"
            onChartChange={handleChartChange(setWindChartType)}
            weatherData={weatherData}
            metric="wind_speed"
            flex="1"
            timePeriod={timePeriod}
            adjustTimePeriod={adjustTimePeriod}
            display="flex"
            flexDirection="column"
            key={windChartType} // Add this key to ensure re-render
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" style={{ flex: 1 }} />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
