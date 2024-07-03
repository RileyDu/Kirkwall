import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeatherData, getWatchdogData } from '../Backend/Graphql_helper';


const WeatherDataContext = createContext();

export const useWeatherData = () => {
  return useContext(WeatherDataContext);
};

export const WeatherDataProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimePeriodTemp, setSelectedTimePeriodTemp] = useState('3H');
  const [selectedTimePeriodHumidity, setSelectedTimePeriodHumidity] = useState('3H');
  const [selectedTimePeriodWind, setSelectedTimePeriodWind] = useState('3H');
  const [selectedTimePeriodRainfall, setSelectedTimePeriodRainfall] = useState('3H');
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [watchdogData, setWatchdogData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({
    temperature: false,
    humidity: false,
    wind: false,
    rainfall: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData('all', '37'); // default time period
        if (Array.isArray(response.data.weather_data)) {
          setWeatherData(response.data.weather_data);
        } else {
          setWeatherData([]);
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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWatchdogData();
        if (Array.isArray(response.data.watchdog_data)) {
          setWatchdogData(response.data.watchdog_data);
        } else {
          setWatchdogData([]);
        }
      } catch (error) {
        console.error('Error fetching watchdog data:', error);
        setWatchdogData([]);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.values(dataLoaded).some(loaded => loaded)) {
      const intervalId = setInterval(() => {
        if (dataLoaded.temperature) {
          fetchSpecificData('temperature', selectedTimePeriodTemp);
        }
        if (dataLoaded.humidity) {
          fetchSpecificData('percent_humidity', selectedTimePeriodHumidity);
        }
        if (dataLoaded.wind) {
          fetchSpecificData('wind_speed', selectedTimePeriodWind);
        }
        if (dataLoaded.rainfall) {
          fetchSpecificData('rain_15_min_inches', selectedTimePeriodRainfall);
        }
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [dataLoaded, selectedTimePeriodTemp, selectedTimePeriodHumidity, selectedTimePeriodWind, selectedTimePeriodRainfall]);

  const handleTimePeriodChange = async (metric, timePeriod) => {
    switch (metric) {
      case 'temperature':
        setSelectedTimePeriodTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, temperature: true }));
        break;
      case 'percent_humidity':
        setSelectedTimePeriodHumidity(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, humidity: true }));
        break;
      case 'wind_speed':
        setSelectedTimePeriodWind(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, wind: true }));
        break;
      case 'rain_15_min_inches':
        setSelectedTimePeriodRainfall(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, rainfall: true }));
        break;
      default:
        break;
    }
    return fetchSpecificData(metric, timePeriod); // Return the promise
  };
  

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

  const fetchSpecificData = async (metric, timePeriod) => {
    try {
      const response = await getWeatherData(metric, determineLimitBasedOnTimePeriod(timePeriod));
      switch (metric) {
        case 'temperature':
          setTempData(response.data.weather_data);
          break;
        case 'percent_humidity':
          setHumidityData(response.data.weather_data);
          break;
        case 'wind_speed':
          setWindData(response.data.weather_data);
          break;
        case 'rain_15_min_inches':
          setRainfallData(response.data.weather_data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${metric} data:`, error);
    }
  };

  return (
    <WeatherDataContext.Provider
      value={{
        weatherData,
        tempData,
        humidityData,
        windData,
        rainfallData,
        loading,
        handleTimePeriodChange,
        watchdogData
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
};
