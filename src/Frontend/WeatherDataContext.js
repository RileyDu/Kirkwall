import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthComponents/AuthContext.js';
import { CustomerSettings } from './Modular/CustomerSettings.js';
import axios from 'axios';
import qs from 'qs';
const WeatherDataContext = createContext();

export const useWeatherData = () => {
  return useContext(WeatherDataContext);
};

export const WeatherDataProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimePeriodTemp, setSelectedTimePeriodTemp] = useState('3H');
  const [selectedTimePeriodHumidity, setSelectedTimePeriodHumidity] =
    useState('3H');
  const [selectedTimePeriodWind, setSelectedTimePeriodWind] = useState('3H');
  const [selectedTimePeriodRainfall, setSelectedTimePeriodRainfall] =
    useState('3H');
  const [selectedTimePeriodSoilMoisture, setSelectedTimePeriodSoilMoisture] =
    useState('3H');
  const [selectedTimePeriodLeafWetness, setSelectedTimePeriodLeafWetness] =
    useState('3H');
  const [selectedTimePeriodWDTemp, setSelectedTimePeriodWDTemp] =
    useState('3H');
    const [selectedTimePeriodMonnitBathroom, setSelectedTimePeriodMonnitBathroom] = useState('3H');
    const [selectedTimePeriodMonnitFridge, setSelectedTimePeriodMonnitFridge] = useState('3H');
    const [selectedTimePeriodMonnitFreezer, setSelectedTimePeriodMonnitFreezer] = useState('3H');
  const [selectedTimePeriodWDHum, setSelectedTimePeriodWDHum] = useState('3H');
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [windData, setWindData] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [soilMoistureData, setSoilMoistureData] = useState(null);
  const [leafWetnessData, setLeafWetnessData] = useState(null);
  const [watchdogData, setWatchdogData] = useState([]);
  const [watchdogTempData, setWatchdogTempData] = useState(null);
  const [watchdogHumData, setWatchdogHumData] = useState(null);
  const [monnitBathroomData, setMonnitBathroomData] = useState(null);
  const [monnitFridgeData, setMonnitFridgeData] = useState(null);
  const [monnitFreezerData, setMonnitFreezerData] = useState(null);
  const [alertsThreshold, setAlertsThreshold] = useState({});
  const [thresholds, setThresholds] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState({
    temperature: false,
    humidity: false,
    wind: false,
    rainfall: false,
    soilMoisture: false,
    leafWetness: false,
    watchdogTemp: false,
    watchdogHum: false,
    monnitBathroom: false,
    monnitFridge: false,
    monnitFreezer: false,
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchThresholds = async () => {
      try {
        const result = await axios.get('/api/thresholds');
        if (Array.isArray(result.data)) {
          setThresholds(result.data);
        }
        // console.log('Thresholds from DB:', thresholds);
      } catch (error) {
        console.error('Error fetching thresholds:', error);
      }
    };

    fetchThresholds();
  }, []);

  const fetchChartData = async (setChartData) => {
    try {
      const response = await axios.get('/api/charts');
      if (Array.isArray(response.data)) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };
  
  useEffect(() => {
    // Call the exported function, passing in setChartData
    fetchChartData(setChartData);
  }, []);



  useEffect(() => {
    if (
      currentUser &&
      (currentUser?.email === 'pmo@grandfarm.com' ||
        currentUser?.email === 'test@kirkwall.io' ||
        currentUser?.email === 'nathalia@futureinnox.com')
    ) {
      const fetchData = async () => {
        try {
          // Replace getWeatherData with axios call to the backend API
          const response = await axios.get(
            `/api/weather_data?limit=37`
          );

          if (Array.isArray(response.data)) {
            setWeatherData(response.data); // Directly using the array returned by backend
            console.log('Weather data:', response.data);
          } else {
            setWeatherData([]); // Fallback if data structure is unexpected
          }

          setLoading(false);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setWeatherData([]);
          setLoading(false);
        }
      };

      // Initial data fetch
      fetchData();

      // Set up interval to fetch data every 30 seconds
      const intervalId = setInterval(fetchData, 30000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (
      currentUser &&
      (currentUser?.email === 'test@kirkwall.io' ||
        currentUser?.email === 'nathalia@futureinnox.com')
    ) {
      const fetchData = async () => {
        try {
          if (currentUser.email === 'test@kirkwall.io' || currentUser.email === 'nathalia@futureinnox.com') {
            const [watchdogResponse] = await Promise.all([
              axios.get('/api/watchdog_data', {
                params: { type: 'all', limit: '19' },
              })
            ]);

            if (Array.isArray(watchdogResponse.data)) {
              setWatchdogData(watchdogResponse.data);
            } else {
              setWatchdogData([]);
            }
            if (Array.isArray(watchdogResponse.data)) {
              setWatchdogData(watchdogResponse.data);
            } else {
              setWatchdogData([]);
            }
          }

          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setWatchdogData([]);
          setLoading(false);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 30000);

      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email === 'test@kirkwall.io') {
      const fetchAllMonnitData = () => {
        fetchMonnitData('monnit_bathroom', selectedTimePeriodMonnitBathroom);
        fetchMonnitData('monnit_fridge', selectedTimePeriodMonnitFridge);
        fetchMonnitData('monnit_freezer', selectedTimePeriodMonnitFreezer);
      };
  
      // Initial fetch
      fetchAllMonnitData();
  
      // Set up interval to fetch data every 30 seconds
      const intervalId = setInterval(fetchAllMonnitData, 60000);
  
      // Cleanup interval on component unmount or if dependencies change
      return () => clearInterval(intervalId);
    }
  }, [
    currentUser,
    selectedTimePeriodMonnitBathroom,
    selectedTimePeriodMonnitFridge,
    selectedTimePeriodMonnitFreezer,
  ]);
  

  const fetchAlertsThreshold = async () => {
    console.log('Received request for alerts per user');
    const userMetrics = CustomerSettings.find(
      customer => customer.email === currentUser?.email
    )?.metric;

    try {
      const response = await axios.get('/api/alerts/alerts_per_user', {
        params: {
          userMetrics: [...userMetrics],  // Ensure this is an array
        },
        paramsSerializer: params => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      });

      if (Array.isArray(response.data)) {
        const groupedAlerts = response.data.reduce((acc, alert) => {
          const { metric } = alert;
          if (!acc[metric]) {
            acc[metric] = [];
          }
          acc[metric].push(alert);
          return acc;
        }, {});
        setAlertsThreshold(response.data);
      } else {
        setAlertsThreshold({ 'not set': ['not set'] });
      }
    } catch (error) {
      console.error('Error fetching alerts per user:', error);
    }
  };

  useEffect(() => {
    {
      currentUser && fetchAlertsThreshold();
    }

    const intervalId = setInterval(() => {
      fetchAlertsThreshold();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [currentUser]);

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
      case 'monnit_bathroom':
        setSelectedTimePeriodMonnitBathroom(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, monnitBathroom: true }));
        break;
      case 'monnit_fridge':
        setSelectedTimePeriodMonnitFridge(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, monnitFridge: true }));
        break;
      case 'monnit_freezer':
        setSelectedTimePeriodMonnitFreezer(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, monnitFreezer: true }));
        break;
      default:
        break;
    }
    return fetchSpecificData(metric, timePeriod); // Return the promise
  };

  const weatherMetrics = [
    'temperature',
    'percent_humidity',
    'wind_speed',
    'rain_15_min_inches',
    'soil_moisture',
    'leaf_wetness',
  ];
  const watchdogMetrics = ['temp', 'hum'];

  const monnitMetrics = ['monnit_bathroom', 'monnit_fridge', 'monnit_freezer'];


  const determineLimitBasedOnTimePeriod = (metric, timePeriod) => {
    console.log(timePeriod, metric);
    // Define the weather limits and the default limits
    const weatherLimits = {
      '1H': 13,
      '3H': 37,
      '6H': 73,
      '12H': 145,
      '1D': 289,
      '3D': 865,
      '1W': 2017,
      default: 37,
    };
  
    const defaultLimits = {
      '1H': 7,
      '3H': 19,
      '6H': 37,
      '12H': 73,
      '1D': 145,
      '3D': 217,
      '1W': 1009,
      default: 19,
    };

    const monnitLimits = {
      '1H': 5,
      '3H': 13,
      '6H': 25,
      '12H': 49,
      '1D': 97,
      '3D': 289,
      '1W': 673,
      default: 73,
    };
  
    // Define all metric groups
    const weatherMetrics = [
      'temperature',
      'percent_humidity',
      'wind_speed',
      'rain_15_min_inches',
      'soil_moisture',
      'leaf_wetness',
    ];

    const monnitMetrics = [
      'monnit_bathroom',
      'monnit_fridge',
      'monnit_freezer',
    ];

    // Determine which limits to use based on the metric
    let limits;
    if (weatherMetrics.includes(metric)) {
      limits = weatherLimits;
    } else if (monnitMetrics.includes(metric)) {
      limits = monnitLimits;
    } else {
      limits = defaultLimits;
    }
  
    console.log(limits[timePeriod]);
    // Return the appropriate limit based on the time period, or the default if time period is not found
    return limits[timePeriod]
  };
  

// A helper function to rename the "current_reading" key to a new key (e.g., "monnit_bathroom")
const renameCurrentReadingKey = (data, newKey) => {
  return data.map(item => {
    const { current_reading, humidity, temperature, ...rest } = item;

    if (newKey === 'monnit_bathroom' && humidity !== undefined && temperature !== undefined) {
      return { ...rest, humidity, temperature };
    }

    return { ...rest, [newKey]: current_reading };
  });
};

const fetchMonnitData = async (sensor, timePeriod) => {
  try {
    const limit = determineLimitBasedOnTimePeriod(sensor, timePeriod);

    const response = await axios.get('/api/monnit', { params: { sensor, limit } });

    const renamedData = renameCurrentReadingKey(response.data, sensor);

    switch (sensor) {
      case 'monnit_bathroom':
        setMonnitBathroomData(renamedData); // Contains both `temperature` and `humidity`
        console.log('Bathroom sensor data:', renamedData);
        break;
      case 'monnit_fridge':
        setMonnitFridgeData(renamedData);
        console.log('Fridge sensor data:', renamedData);
        break;
      case 'monnit_freezer':
        setMonnitFreezerData(renamedData);
        console.log('Freezer sensor data:', renamedData);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Error fetching ${sensor} data:`, error);
  }
};



  const fetchSpecificData = async (metric, timePeriod) => {
    try {
      // Define the limit based on the time period
      const limit = determineLimitBasedOnTimePeriod(metric, timePeriod);
  
      if (watchdogMetrics.includes(metric)) {
        // Fetch watchdog data using Axios
        const response = await axios.get('/api/watchdog_data', {
          params: {
            type: metric, // type: 'temp' or 'hum'
            limit: limit,
          },
        });
        switch (metric) {
          case 'temp':
            setWatchdogTempData(response.data);
            break;
          case 'hum':
            setWatchdogHumData(response.data);
            break;
          default:
            break;
        }
      } else if (weatherMetrics.includes(metric)) {
        // Fetch weather data using Axios
        const response = await axios.get('/api/weather_data', {
          params: {
            type: metric, // type: 'temperature', 'percent_humidity', 'wind_speed', etc.
            limit: limit,
          },
        });
        switch (metric) {
          case 'temperature':
            setTempData(response.data);
            console.log(response.data);
            break;
          case 'percent_humidity':
            setHumidityData(response.data);
            break;
          case 'wind_speed':
            setWindData(response.data);
            break;
          case 'rain_15_min_inches':
            setRainfallData(response.data);
            break;
          case 'soil_moisture':
            setSoilMoistureData(response.data);
            break;
          case 'leaf_wetness':
            setLeafWetnessData(response.data);
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
        setLoading,
        handleTimePeriodChange,
        watchdogData,
        watchdogTempData,
        watchdogHumData,
        thresholds,
        alertsThreshold,
        fetchAlertsThreshold,
        chartData,
        setChartData,
        fetchChartData,
        monnitBathroomData,
        monnitFridgeData,
        monnitFreezerData,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
};
