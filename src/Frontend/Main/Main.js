// MainContent.jsx
import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { getWeatherData } from '../../Backend/Graphql_helper';
import { handleChartChange } from '../Charts/ChartUtils';

const MainContent = ({
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
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const [selectedTimePeriodTemp, setSelectedTimePeriodTemp] = useState('3H');
  const [selectedTimePeriodHumidity, setSelectedTimePeriodHumidity] = useState('3H');
  const [selectedTimePeriodWind, setSelectedTimePeriodWind] = useState('3H');
  const [selectedTimePeriodRainfall, setSelectedTimePeriodRainfall] = useState('3H');
  const [specificChartMetric, setSpecificChartMetric] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for time period:', timePeriod);
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
    if (weatherData.length > 0) {
      setIsReady(true);
    }
  }, [weatherData]);

  const handleTimePeriodChange = (metric, timePeriod) => {
    console.log('Handle Time Period Change:', metric, timePeriod);
    switch (metric) {
      case 'temperature':
        setSelectedTimePeriodTemp(timePeriod);
        break;
      case 'percent_humidity':
        setSelectedTimePeriodHumidity(timePeriod);
        break;
      case 'wind_speed':
        setSelectedTimePeriodWind(timePeriod);
        break;
      case 'rain_15_min_inches':
        setSelectedTimePeriodRainfall(timePeriod);
        break;
      default:
        break;
    }
    setSpecificChartMetric(metric);
    console.log('Selected specific chart metric:', specificChartMetric);
  };

  const setupInterval = (metric, selectedTimePeriod, setData) => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriod);
        console.log(`Fetching ${metric} data with limit:`, limit);
        const result = await getWeatherData(metric, limit);
        setData(result.data.weather_data);
      } catch (error) {
        console.error(`Error fetching ${metric} data:`, error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    return intervalId;
  };

  useEffect(() => {
    let intervalId;
    if (specificChartMetric === 'temperature') {
      intervalId = setupInterval('temperature', selectedTimePeriodTemp, setTempData);
    }
    return () => clearInterval(intervalId);
  }, [specificChartMetric, selectedTimePeriodTemp]);

  useEffect(() => {
    let intervalId;
    if (specificChartMetric === 'percent_humidity') {
      intervalId = setupInterval('humidity', selectedTimePeriodHumidity, setHumidityData);
    }
    return () => clearInterval(intervalId);
  }, [specificChartMetric, selectedTimePeriodHumidity]);

  useEffect(() => {
    let intervalId;
    if (specificChartMetric === 'wind_speed') {
      intervalId = setupInterval('wind', selectedTimePeriodWind, setWindData);
    }
    return () => clearInterval(intervalId);
  }, [specificChartMetric, selectedTimePeriodWind]);

  useEffect(() => {
    let intervalId;
    if (specificChartMetric === 'rain_15_min_inches') {
      intervalId = setupInterval('rain', selectedTimePeriodRainfall, setRainfallData);
    }
    return () => clearInterval(intervalId);
  }, [specificChartMetric, selectedTimePeriodRainfall]);

  const determineLimitBasedOnTimePeriod = (timePeriod) => {
    console.log('Determining limit for time period:', timePeriod);
    switch (timePeriod) {
      case '1H':
        return 13;
      case '3H':
        return 37;
      case '6H':
        return 73;
      case '12H':
        return 145;
      case '1D':
        return 289;
      case '3D':
        return 865;
      case '1W':
        return 2017;
      default:
        return 37;
    }
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
      pt="74px"
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
            weatherData={tempData || weatherData}
            metric="temperature"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            key={tempChartType}
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {tempChartType === 'line' ? (
              <LineChart data={tempData || weatherData} metric="temperature" style={{ flex: 1 }} />
            ) : (
              <BarChart data={tempData || weatherData} metric="temperature" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Humidity (%)"
            onChartChange={handleChartChange(setHumidityChartType)}
            weatherData={humidityData || weatherData}
            metric="percent_humidity"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            key={humidityChartType}
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {humidityChartType === 'line' ? (
              <LineChart data={humidityData || weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            ) : (
              <BarChart data={humidityData || weatherData} metric="percent_humidity" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Wind Speed (mph)"
            onChartChange={handleChartChange(setWindChartType)}
            weatherData={windData || weatherData}
            metric="wind_speed"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            key={windChartType}
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {windChartType === 'line' ? (
              <LineChart data={windData || weatherData} metric="wind_speed" style={{ flex: 1 }} />
            ) : (
              <BarChart data={windData || weatherData} metric="wind_speed" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={{ base: 1, lg: 2 }} display="flex">
          <ChartWrapper
            title="Rainfall (in)"
            onChartChange={handleChartChange(setRainfallChartType)}
            weatherData={rainfallData || weatherData}
            metric="rain_15_min_inches"
            flex="1"
            timePeriod={timePeriod}
            display="flex"
            flexDirection="column"
            key={rainfallChartType}
            handleTimePeriodChange={handleTimePeriodChange}
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            ) : (
              <BarChart data={rainfallData || weatherData} metric="rain_15_min_inches" style={{ flex: 1 }} />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
