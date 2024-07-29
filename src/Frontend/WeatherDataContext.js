import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeatherData, getWatchdogData, getRivercityData, getAlerts, getLatestThreshold } from '../Backend/Graphql_helper.js';

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
  const [selectedTimePeriodSoilMoisture, setSelectedTimePeriodSoilMoisture] = useState('3H');
  const [selectedTimePeriodLeafWetness, setSelectedTimePeriodLeafWetness] = useState('3H');
  const [selectedTimePeriodWDTemp, setSelectedTimePeriodWDTemp] = useState('3H');
  const [selectedTimePeriodWDHum, setSelectedTimePeriodWDHum] = useState('3H');
  const [selectedTimePeriodRCTemp, setSelectedTimePeriodRCTemp] = useState('3H');
  const [selectedTimePeriodRCHum, setSelectedTimePeriodRCHum] = useState('3H');
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [soilMoistureData, setSoilMoistureData] = useState(null);
  const [leafWetnessData, setLeafWetnessData] = useState(null);
  const [watchdogData, setWatchdogData] = useState([]);
  const [rivercityData, setRivercityData] = useState(null);
  const [rivercityTempData, setRivercityTempData] = useState(null);
  const [rivercityHumData, setRivercityHumData] = useState(null);
  const [watchdogTempData, setWatchdogTempData] = useState(null);
  const [watchdogHumData, setWatchdogHumData] = useState(null);
  const [alertsThreshold, setAlertsThreshold] = useState({});
  const [thresholds, setThresholds] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({
    temperature: false,
    humidity: false,
    wind: false,
    rainfall: false,
    soilMoisture: false,
    leafWetness: false,
    watchdogTemp: false,
    watchdogHum: false,
    rivercityTemp: false,
    rivercityHum: false,
  });

    useEffect(() => {
      const fetchThresholds = async () => {
        try {
          const result = await getLatestThreshold();
          if (Array.isArray(result.data.thresholds)) {
            setThresholds(result.data.thresholds);
          }
          // console.log('Thresholds from DB:', thresholds);
        } catch (error) {
          console.error('Error fetching thresholds:', error);
        }
      };

      fetchThresholds();

    }, []);

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
        const response = await getWatchdogData('all', '19');
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

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRivercityData('all', '19');
        if (Array.isArray(response.data.rivercity_data)) {
          setRivercityData(response.data.rivercity_data);
        } else {
          setRivercityData([]);
        }
      } catch (error) {
        console.error('Error fetching watchdog data:', error);
        setRivercityData([]);
        
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchAlertsThreshold = async () => {
    try {
      const response = await getAlerts();
      // console.log('Alerts Threshold 0:', response.data.alerts);
      if (Array.isArray(response.data.alerts)) {
        const groupedAlerts = response.data.alerts.reduce((acc, alert) => {
          const { metric } = alert;
          if (!acc[metric]) {
            acc[metric] = [];
          }
          acc[metric].push(alert);
          return acc;
        }, {});
        setAlertsThreshold(groupedAlerts);
        // console.log('Alerts Threshold 1st:', groupedAlerts);
      } else {
        setAlertsThreshold({ 'not set': ['not set'] });
        // console.log('Alerts Threshold 2nd:', { 'not set': ['not set'] });
      }
      // console.log('Alerts Threshold 3rd:', alertsThreshold);
    } catch (error) {
      console.error('Error fetching alerts', error);
    }
  };
  
  useEffect(() => {
    fetchAlertsThreshold();
  
    const intervalId = setInterval(() => {
      fetchAlertsThreshold();
    }, 30000); // 30 seconds
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [getAlerts]);
    

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
        if (dataLoaded.watchdogTemp) {
          fetchSpecificData('temp', selectedTimePeriodWDTemp);
        }
        if (dataLoaded.watchdogHum) {
          fetchSpecificData('hum', selectedTimePeriodWDHum);
        }
        if (dataLoaded.soilMoisture) {
          fetchSpecificData('soil_moisture', selectedTimePeriodSoilMoisture);
        }
        if (dataLoaded.leafWetness) {
          fetchSpecificData('leaf_wetness', selectedTimePeriodLeafWetness);
        }
        if (dataLoaded.rivercityTemp) {
          fetchSpecificData('rctemp', selectedTimePeriodRCTemp);
        }
        if (dataLoaded.rivercityHum) {
          fetchSpecificData('humidity', selectedTimePeriodRCHum);
        }
      }, 30000);
      return () => clearInterval(intervalId);
    }
  }, [
    dataLoaded,
    selectedTimePeriodTemp,
    selectedTimePeriodHumidity,
    selectedTimePeriodWind,
    selectedTimePeriodRainfall,
    selectedTimePeriodWDTemp,
    selectedTimePeriodWDHum,
    selectedTimePeriodSoilMoisture,
    selectedTimePeriodLeafWetness,
    selectedTimePeriodRCHum,
    selectedTimePeriodRCTemp,
  ]);

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
      case 'soil_moisture':
        setSelectedTimePeriodSoilMoisture(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, soilMoisture: true }));
        break;
      case 'leaf_wetness':
        setSelectedTimePeriodLeafWetness(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, leafWetness: true }));
        break;
      case 'temp':
        setSelectedTimePeriodWDTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, watchdogTemp: true }));
        break;
      case 'hum':
        setSelectedTimePeriodWDHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, watchdogHum: true }));
        break;
      case 'humidity':
        setSelectedTimePeriodRCHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, rivercityHum: true }));
        break;
      case 'rctemp':
        setSelectedTimePeriodRCTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, rivercityTemp: true }));
        break;
      default:
        break;
    }
    return fetchSpecificData(metric, timePeriod); // Return the promise
  };

  const weatherMetrics = ['temperature', 'percent_humidity', 'wind_speed', 'rain_15_min_inches', 'soil_moisture', 'leaf_wetness'];
  const watchdogMetrics = ['temp', 'hum'];
  const rivercityMetrics = ['rctemp', 'humidity'];
  

  const determineLimitBasedOnTimePeriod = timePeriod => {
    console.log('Determining limit for time period (weatherData):', timePeriod);
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

  const watchdogDetermineLimitBasedOnTimePeriod = timePeriod => {
    console.log('Determining limit for time period (watchdogData):', timePeriod);
    switch (timePeriod) {
      case '1H':
        return 7;
      case '3H':
        return 19;
      case '6H':
        return 37;
      case '12H':
        return 73;
      case '1D':
        return 145;
      case '3D':
        return 217;
      case '1W':
        return 1009;
      default:
        return 37;
    }
  };

  const rivercityDetermineLimitBasedOnTimePeriod = timePeriod => {
    console.log('Determining limit for time period (rivercityData):', timePeriod);
    switch (timePeriod) {
      case '1H':
        return 7;
      case '3H':
        return 19;
      case '6H':
        return 37;
      case '12H':
        return 73;
      case '1D':
        return 145;
      case '3D':
        return 217;
      case '1W':
        return 1009;
      default:
        return 37;
    }
  };

  const fetchSpecificData = async (metric, timePeriod) => {
    try {
      if (watchdogMetrics.includes(metric)) {
        const response = await getWatchdogData(metric, watchdogDetermineLimitBasedOnTimePeriod(timePeriod));
        switch (metric) {
          case 'temp':
            setWatchdogTempData(response.data.watchdog_data);
            break;
          case 'hum':
            setWatchdogHumData(response.data.watchdog_data);
            break;
          default:
            break;
        }
      } else if (rivercityMetrics.includes(metric)) {
        const response = await getRivercityData(metric, rivercityDetermineLimitBasedOnTimePeriod(timePeriod));
        switch (metric) {
          case 'rctemp':
            setRivercityTempData(response.data.rivercity_data);
            break;
          case 'humidity':
            setRivercityHumData(response.data.rivercity_data);
            break;
          default:
            break;
        }
      }
       else if (weatherMetrics.includes(metric)) {
        const response = await getWeatherData(metric, determineLimitBasedOnTimePeriod(timePeriod));
        switch (metric) {
          case 'temperature':
            setTempData(response.data.weather_data);
            console.log('Temperature data:', response.data.weather_data);
            break;
          case 'percent_humidity':
            setHumidityData(response.data.weather_data);
            console.log('Humidity data:', response.data.weather_data);
            break;
          case 'wind_speed':
            setWindData(response.data.weather_data);
            console.log('Wind data:', response.data.weather_data);
            break;
          case 'rain_15_min_inches':
            setRainfallData(response.data.weather_data);
            console.log('Rainfall data:', response.data.weather_data);
            break;
          case 'soil_moisture':
            setSoilMoistureData(response.data.weather_data);
            console.log('Soil moisture data:', response.data.weather_data);
            break;
          case 'leaf_wetness':
            setLeafWetnessData(response.data.weather_data);
            console.log('Leaf wetness data:', response.data.weather_data);
            break;
          default:
            break;
        }
      } else {
        console.warn(`Unknown metric: ${metric}`);
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
        soilMoistureData,
        leafWetnessData,
        loading,
        handleTimePeriodChange,
        watchdogData,
        watchdogTempData,
        watchdogHumData,
        rivercityData,
        rivercityTempData,
        rivercityHumData,
        thresholds,
        alertsThreshold,
        fetchAlertsThreshold,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
};
