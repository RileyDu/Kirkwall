import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeatherData } from '../Backend/Graphql_helper';
const WeatherDataContext = createContext();

export const useWeatherData = () => {
  return useContext(WeatherDataContext);
};

export const WeatherDataProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWeatherData('25');
      setWeatherData(response.data.weather_data);
    } catch (error) {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 300000); // 300,000 milliseconds = 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <WeatherDataContext.Provider value={{ weatherData, loading, error, fetchData }}>
      {children}
    </WeatherDataContext.Provider>
  );
};