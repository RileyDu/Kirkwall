import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, useColorMode, Flex } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import { getWeatherData } from '../../Backend/Graphql_helper';

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
        console.log('Fetching data for time period:', timePeriod); // Log the time period
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
    }, 1000); // delay to let layout stabilize

    return () => clearTimeout(timer);
  }, [isMinimized]);

  const handleTimePeriodChange = (metric, timePeriod) => {
    console.log('Handle Time Period Change:', metric, timePeriod); // Log metric and timePeriod
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
    console.log('Selected specific chart metric:', specificChartMetric); // Log the updated metric
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriodTemp);
        console.log('Fetching temperature data with limit:', limit); // Log the limit
        const result = await getWeatherData('temperature', limit);
        setTempData(result.data.weather_data);
      } catch (error) {
        console.error('Error fetching temperature data:', error);
      }
    };

    if (specificChartMetric === 'temperature') {
      fetchData();
    }
  }, [specificChartMetric, selectedTimePeriodTemp]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriodHumidity);
        console.log('Fetching humidity data with limit:', limit); // Log the limit
        const result = await getWeatherData('humidity', limit);
        setHumidityData(result.data.weather_data);
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    if (specificChartMetric === 'percent_humidity') {
      fetchData();
    }
  }, [specificChartMetric, selectedTimePeriodHumidity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriodWind);
        console.log('Fetching wind data with limit:', limit); // Log the limit
        const result = await getWeatherData('wind', limit);
        setWindData(result.data.weather_data);
      } catch (error) {
        console.error('Error fetching wind data:', error);
      }
    };

    if (specificChartMetric === 'wind_speed') {
      fetchData();
    }
  }, [specificChartMetric, selectedTimePeriodWind]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriodRainfall);
        console.log('Fetching rainfall data with limit:', limit); // Log the limit
        const result = await getWeatherData('rain', limit);
        setRainfallData(result.data.weather_data);
      } catch (error) {
        console.error('Error fetching rainfall data:', error);
      }
    };

    if (specificChartMetric === 'rain_15_min_inches') {
      fetchData();
    }
  }, [specificChartMetric, selectedTimePeriodRainfall]);

  const determineLimitBasedOnTimePeriod = (timePeriod) => {
    console.log('Determining limit for time period:', timePeriod); // Log the time period
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
