import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getWeatherData,
  getWatchdogData,
  getRivercityData,
  getImpriMedData,
  getAlerts,
  getLatestThreshold,
  getChartData,
} from '../Backend/Graphql_helper.js';
import { useAuth } from './AuthComponents/AuthContext.js';

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
  const [selectedTimePeriodIMFreezerOneTemp, setSelectedTimePeriodIMFreezerOneTemp] = useState('3H');
  const [selectedTimePeriodIMFreezerOneHum, setSelectedTimePeriodIMFreezerOneHum] = useState('3H');
  const [selectedTimePeriodIMFreezerTwoTemp, setSelectedTimePeriodIMFreezerTwoTemp] = useState('3H');
  const [selectedTimePeriodIMFreezerTwoHum, setSelectedTimePeriodIMFreezerTwoHum] = useState('3H');
  const [selectedTimePeriodIMFreezerThreeTemp, setSelectedTimePeriodIMFreezerThreeTemp] = useState('3H');
  const [selectedTimePeriodIMFreezerThreeHum, setSelectedTimePeriodIMFreezerThreeHum] = useState('3H');
  const [selectedTimePeriodIMFridgeOneTemp, setSelectedTimePeriodIMFridgeOneTemp] = useState('3H');
  const [selectedTimePeriodIMFridgeOneHum, setSelectedTimePeriodIMFridgeOneHum] = useState('3H');
  const [selectedTimePeriodIMFridgeTwoTemp, setSelectedTimePeriodIMFridgeTwoTemp] = useState('3H');
  const [selectedTimePeriodIMFridgeTwoHum, setSelectedTimePeriodIMFridgeTwoHum] = useState('3H');
  const [selectedTimePeriodIMIncubatorOneTemp, setSelectedTimePeriodIMIncubatorOneTemp] = useState('3H');
  const [selectedTimePeriodIMIncubatorOneHum, setSelectedTimePeriodIMIncubatorOneHum] = useState('3H');
  const [selectedTimePeriodIMIncubatorTwoTemp, setSelectedTimePeriodIMIncubatorTwoTemp] = useState('3H');
  const [selectedTimePeriodIMIncubatorTwoHum, setSelectedTimePeriodIMIncubatorTwoHum] = useState('3H');
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
  const [impriFreezerOneTempData, setImpriFreezerOneTempData] = useState(null); // NOT WORKING
  const [impriFreezerOneHumData, setImpriFreezerOneHumData] = useState(null); // NOT WORKING
  const [impriFreezerTwoHumData, setImpriFreezerTwoHumData] = useState(null);
  const [impriFreezerTwoTempData, setImpriFreezerTwoTempData] = useState(null);
  const [impriFreezerThreeTempData, setImpriFreezerThreeTempData] = useState(null);
  const [impriFreezerThreeHumData, setImpriFreezerThreeHumData] = useState(null);
  const [impriFridgeOneTempData, setImpriFridgeOneTempData] = useState(null);
  const [impriFridgeOneHumData, setImpriFridgeOneHumData] = useState(null);
  const [impriFridgeTwoTempData, setImpriFridgeTwoTempData] = useState(null);
  const [impriFridgeTwoHumData, setImpriFridgeTwoHumData] = useState(null);
  const [impriIncuOneTempData, setImpriIncubatorOneTempData] = useState(null); // NOT WORKING
  const [impriIncuOneHumData, setImpriIncubatorOneHumData] = useState(null); // NOT WORKING
  const [impriIncuTwoTempData, setImpriIncubatorTwoTempData] = useState(null);
  const [impriIncuTwoHumData, setImpriIncubatorTwoHumData] = useState(null);

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
    rivercityTemp: false,
    rivercityHum: false,
    imFreezerOneTemp: false,
    imFreezerOneHum: false,
    imFreezerTwoTemp: false,
    imFreezerTwoHum: false,
    imFreezerThreeTemp: false,
    imFreezerThreeHum: false,
    imFridgeOneTemp: false,
    imFridgeOneHum: false,
    imFridgeTwoTemp: false,
    imFridgeTwoHum: false,
    imIncubatorOneTemp: false,
    imIncubatorOneHum: false,
    imIncubatorTwoTemp: false,
    imIncubatorTwoHum: false,

  });

  const { currentUser } = useAuth();

  // IMPRIMED DATA FEED LOGIC
  const devices = {
    freezerOne: "deveui = '0080E1150618C9DE'",
    freezerTwo: "deveui = '0080E115054FC6DF'",
    freezerThree: "deveui = '0080E1150618B549'",
    fridgeOne: "deveui = '0080E1150619155F'",
    fridgeTwo: "deveui = '0080E115061924EA'",
    incubatorOne: "deveui = '0080E115054FF1DC'",
    incubatorTwo: "deveui = '0080E1150618B45F'",
  };

  const deveuiPerMetric = {
    imFreezerOneTemp: "deveui = '0080E1150618C9DE'",
    imFreezerOneHum: "deveui = '0080E1150618C9DE'",
    imFreezerTwoTemp: "deveui = '0080E115054FC6DF'",
    imFreezerTwoHum: "deveui = '0080E115054FC6DF'",
    imFreezerThreeTemp: "deveui = '0080E1150618B549'",
    imFreezerThreeHum: "deveui = '0080E1150618B549'",
    imFridgeOneTemp: "deveui = '0080E1150619155F'",
    imFridgeOneHum: "deveui = '0080E1150619155F'",
    imFridgeTwoTemp: "deveui = '0080E115061924EA'",
    imFridgeTwoHum: "deveui = '0080E115061924EA'",
    imIncubatorOneTemp: "deveui = '0080E115054FF1DC'",
    imIncubatorOneHum: "deveui = '0080E115054FF1DC'",
    imIncubatorTwoTemp: "deveui = '0080E1150618B45F'",
    imIncubatorTwoHum: "deveui = '0080E1150618B45F'",
  };

  const fetchDeviceData = async (deviceKey, setTempData, setHumData, limit) => {
    try {
      const response = await getImpriMedData(devices[deviceKey], limit); // Adjust the limit as needed
      if (Array.isArray(response.data.rivercity_data) && response.data.rivercity_data.length > 0) {
        const latestData = response.data.rivercity_data;

        // Determine the new keys based on the deviceKey
        let tempKey = 'rctemp';
        let humKey = 'humidity';

        switch (deviceKey) {
          case 'freezerOne':
            tempKey = 'imFreezerOneTemp';
            humKey = 'imFreezerOneHum';
            break;
          case 'freezerTwo':
            tempKey = 'imFreezerTwoTemp';
            humKey = 'imFreezerTwoHum';
            break;
          case 'freezerThree':
            tempKey = 'imFreezerThreeTemp';
            humKey = 'imFreezerThreeHum';
            break;
          case 'fridgeOne':
            tempKey = 'imFridgeOneTemp';
            humKey = 'imFridgeOneHum';
            break;
          case 'fridgeTwo':
            tempKey = 'imFridgeTwoTemp';
            humKey = 'imFridgeTwoHum';
            break;
          case 'incubatorOne':
            tempKey = 'imIncubatorOneTemp';
            humKey = 'imIncubatorOneHum';
            break;
          case 'incubatorTwo':
            tempKey = 'imIncubatorTwoTemp';
            humKey = 'imIncubatorTwoHum';
            break;
          default:
            break;
        }

        // Map the data to new keys
        const tempDataArray = latestData.map(data => ({
          [tempKey]: data.rctemp,
          publishedat: data.publishedat
        }));

        const humDataArray = latestData.map(data => ({
          [humKey]: data.humidity,
          publishedat: data.publishedat
        }));

        // Set the entire array of temperature and humidity data
        setTempData(tempDataArray);
        setHumData(humDataArray);
        setLoading(false);
        // console.log(`Latest temperature data for ${deviceKey}:`, tempDataArray);
        // console.log(`Latest humidity data for ${deviceKey}:`, humDataArray);
      }
    } catch (error) {
      console.error(`Error fetching data for ${deviceKey}:`, error);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.email === 'jerrycromarty@imprimedicine.com') {
      const fetchAllDeviceData = () => {
        // fetchDeviceData('freezerOne', setImpriFreezerOneTempData, setImpriFreezerOneHumData, 19);
        fetchDeviceData('freezerTwo', setImpriFreezerTwoTempData, setImpriFreezerTwoHumData, 19);
        fetchDeviceData('freezerThree', setImpriFreezerThreeTempData, setImpriFreezerThreeHumData, 19);
        fetchDeviceData('fridgeOne', setImpriFridgeOneTempData, setImpriFridgeOneHumData, 19);
        fetchDeviceData('fridgeTwo', setImpriFridgeTwoTempData, setImpriFridgeTwoHumData, 19);
        // fetchDeviceData('incubatorOne', setImpriIncubatorOneTempData, setImpriIncubatorOneHumData, 19);
        fetchDeviceData('incubatorTwo', setImpriIncubatorTwoTempData, setImpriIncubatorTwoHumData, 19);
      };

      fetchAllDeviceData();
      const intervalId = setInterval(fetchAllDeviceData, 60000); // Fetch data every 60 seconds

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [currentUser]);

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
    const fetchChartData = async () => {
      try {
        const response = await getChartData();
        if (Array.isArray(response.data.charts)) {
          setChartData(response.data.charts);
          // console.log('Chart data:', chartData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
    fetchChartData();
  }, []);

  useEffect(() => {
    if (currentUser && (currentUser.email === 'test@kirkwall.io' || currentUser.email === 'pmo@grandfarm.com')) {
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
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && (currentUser.email === 'test@kirkwall.io' || currentUser.email === 'trey@watchdogprotect.com')) {
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
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && currentUser.email === 'test@kirkwall.io') {
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
    }
  }, [currentUser]);

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
        } if (dataLoaded.imFreezerOneTemp) {
          fetchSpecificData('imFreezerOneTemp', selectedTimePeriodIMFreezerOneTemp);
        }
        if (dataLoaded.imFreezerOneHum) {
          fetchSpecificData('imFreezerOneHum', selectedTimePeriodIMFreezerOneHum);
        }
        if (dataLoaded.imFreezerTwoTemp) {
          fetchSpecificData('imFreezerTwoTemp', selectedTimePeriodIMFreezerTwoTemp);
        }
        if (dataLoaded.imFreezerTwoHum) {
          fetchSpecificData('imFreezerTwoHum', selectedTimePeriodIMFreezerTwoHum);
        }
        if (dataLoaded.imFreezerThreeTemp) {
          fetchSpecificData('imFreezerThreeTemp', selectedTimePeriodIMFreezerThreeTemp);
        }
        if (dataLoaded.imFreezerThreeHum) {
          fetchSpecificData('imFreezerThreeHum', selectedTimePeriodIMFreezerThreeHum);
        }
        if (dataLoaded.imFridgeOneTemp) {
          fetchSpecificData('imFridgeOneTemp', selectedTimePeriodIMFridgeOneTemp);
        }
        if (dataLoaded.imFridgeOneHum) {
          fetchSpecificData('imFridgeOneHum', selectedTimePeriodIMFridgeOneHum);
        }
        if (dataLoaded.imFridgeTwoTemp) {
          fetchSpecificData('imFridgeTwoTemp', selectedTimePeriodIMFridgeTwoTemp);
        }
        if (dataLoaded.imFridgeTwoHum) {
          fetchSpecificData('imFridgeTwoHum', selectedTimePeriodIMFridgeTwoHum);
        }
        if (dataLoaded.imIncubatorOneTemp) {
          fetchSpecificData('imIncubatorOneTemp', selectedTimePeriodIMIncubatorOneTemp);
        }
        if (dataLoaded.imIncubatorOneHum) {
          fetchSpecificData('imIncubatorOneHum', selectedTimePeriodIMIncubatorOneHum);
        }
        if (dataLoaded.imIncubatorTwoTemp) {
          fetchSpecificData('imIncubatorTwoTemp', selectedTimePeriodIMIncubatorTwoTemp);
        }
        if (dataLoaded.imIncubatorTwoHum) {
          fetchSpecificData('imIncubatorTwoHum', selectedTimePeriodIMIncubatorTwoHum);
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
    selectedTimePeriodIMFreezerOneHum,
    selectedTimePeriodIMFreezerOneTemp,
    selectedTimePeriodIMFreezerTwoHum,
    selectedTimePeriodIMFreezerTwoTemp,
    selectedTimePeriodIMFreezerThreeHum,
    selectedTimePeriodIMFreezerThreeTemp,
    selectedTimePeriodIMFridgeOneHum,
    selectedTimePeriodIMFridgeOneTemp,
    selectedTimePeriodIMFridgeTwoHum,
    selectedTimePeriodIMFridgeTwoTemp,
    selectedTimePeriodIMIncubatorOneHum,
    selectedTimePeriodIMIncubatorOneTemp,
    selectedTimePeriodIMIncubatorTwoHum,
    selectedTimePeriodIMIncubatorTwoTemp,
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
      case 'imFreezerOneTemp':
        setSelectedTimePeriodIMFreezerOneTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerOneTemp: true }));
        break;
      case 'imFreezerOneHum':
        setSelectedTimePeriodIMFreezerOneHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerOneHum: true }));
        break;
      case 'imFreezerTwoTemp':
        setSelectedTimePeriodIMFreezerTwoTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerTwoTemp: true }));
        break;
      case 'imFreezerTwoHum':
        setSelectedTimePeriodIMFreezerTwoHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerTwoHum: true }));
        break;
      case 'imFreezerThreeTemp':
        setSelectedTimePeriodIMFreezerThreeTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerThreeTemp: true }));
        break;
      case 'imFreezerThreeHum':
        setSelectedTimePeriodIMFreezerThreeHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFreezerThreeHum: true }));
        break;
      case 'imFridgeOneTemp':
        setSelectedTimePeriodIMFridgeOneTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFridgeOneTemp: true }));
        break;
      case 'imFridgeOneHum':
        setSelectedTimePeriodIMFridgeOneHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFridgeOneHum: true }));
        break;
      case 'imFridgeTwoTemp':
        setSelectedTimePeriodIMFridgeTwoTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFridgeTwoTemp: true }));
        break;
      case 'imFridgeTwoHum':
        setSelectedTimePeriodIMFridgeTwoHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imFridgeTwoHum: true }));
        break;
      case 'imIncubatorOneTemp':
        setSelectedTimePeriodIMIncubatorOneTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imIncubatorOneTemp: true }));
        break;
      case 'imIncubatorOneHum':
        setSelectedTimePeriodIMIncubatorOneHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imIncubatorOneHum: true }));
        break;
      case 'imIncubatorTwoTemp':
        setSelectedTimePeriodIMIncubatorTwoTemp(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imIncubatorTwoTemp: true }));
        break;
      case 'imIncubatorTwoHum':
        setSelectedTimePeriodIMIncubatorTwoHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imIncubatorTwoHum: true }));
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
  const rivercityMetrics = ['rctemp', 'humidity'];
  const impriMedMetrics = ['imFreezerOneTemp', 'imFreezerOneHum', 'imFreezerTwoTemp', 'imFreezerTwoHum', 'imFreezerThreeTemp', 'imFreezerThreeHum', 'imFridgeOneTemp', 'imFridgeOneHum', 'imFridgeTwoTemp', 'imFridgeTwoHum', 'imIncubatorOneTemp', 'imIncubatorOneHum', 'imIncubatorTwoTemp', 'imIncubatorTwoHum'];

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
    console.log(
      'Determining limit for time period (watchdogData):',
      timePeriod
    );
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
    console.log(
      'Determining limit for time period (rivercityData):',
      timePeriod
    );
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
        const response = await getWatchdogData(
          metric,
          watchdogDetermineLimitBasedOnTimePeriod(timePeriod)
        );
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
        const response = await getRivercityData(
          metric,
          rivercityDetermineLimitBasedOnTimePeriod(timePeriod)
        );
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
      } else if (weatherMetrics.includes(metric)) {
        const response = await getWeatherData(
          metric,
          determineLimitBasedOnTimePeriod(timePeriod)
        );
        switch (metric) {
          case 'temperature':
            setTempData(response.data.weather_data);
            // console.log('Temperature data:', response.data.weather_data);
            break;
          case 'percent_humidity':
            setHumidityData(response.data.weather_data);
            // console.log('Humidity data:', response.data.weather_data);
            break;
          case 'wind_speed':
            setWindData(response.data.weather_data);
            // console.log('Wind data:', response.data.weather_data);
            break;
          case 'rain_15_min_inches':
            setRainfallData(response.data.weather_data);
            // console.log('Rainfall data:', response.data.weather_data);
            break;
          case 'soil_moisture':
            setSoilMoistureData(response.data.weather_data);
            // console.log('Soil moisture data:', response.data.weather_data);
            break;
          case 'leaf_wetness':
            setLeafWetnessData(response.data.weather_data);
            // console.log('Leaf wetness data:', response.data.weather_data);
            break;
          default:
            break;
        }
      } else if (impriMedMetrics.includes(metric)) {
        const deveui = deveuiPerMetric[metric];
        const response = await getImpriMedData(
          deveui,
          rivercityDetermineLimitBasedOnTimePeriod(timePeriod)
        );
        switch (metric) {
          case 'imFreezerOneTemp':
            setImpriFreezerOneTempData(response.data.rivercity_data);
            break;
          case 'imFreezerOneHum':
            setImpriFreezerOneHumData(response.data.rivercity_data);
            break;
          case 'imFreezerTwoTemp':
            setImpriFreezerTwoTempData(response.data.rivercity_data);
            break;
          case 'imFreezerTwoHum':
            setImpriFreezerTwoHumData(response.data.rivercity_data);
            break;
          case 'imFreezerThreeTemp':
            setImpriFreezerThreeTempData(response.data.rivercity_data);
            break;
          case 'imFreezerThreeHum':
            setImpriFreezerThreeHumData(response.data.rivercity_data);
            break;
          case 'imFridgeOneTemp':
            setImpriFridgeOneTempData(response.data.rivercity_data);
            break;
          case 'imFridgeOneHum':
            setImpriFridgeOneHumData(response.data.rivercity_data);
            break;
          case 'imFridgeTwoTemp':
            setImpriFridgeTwoTempData(response.data.rivercity_data);
            break;
          case 'imFridgeTwoHum':
            setImpriFridgeTwoHumData(response.data.rivercity_data);
            break;
          case 'imIncubatorOneTemp':
            setImpriIncubatorOneTempData(response.data.rivercity_data);
            break;
          case 'imIncubatorOneHum':
            setImpriIncubatorOneHumData(response.data.rivercity_data);
            break;
          case 'imIncubatorTwoTemp':
            setImpriIncubatorTwoTempData(response.data.rivercity_data);
            break;
          case 'imIncubatorTwoHum':
            setImpriIncubatorTwoHumData(response.data.rivercity_data);
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
        rivercityData,
        rivercityTempData,
        rivercityHumData,
        thresholds,
        alertsThreshold,
        fetchAlertsThreshold,
        chartData,
        impriFreezerOneTempData,
        impriFreezerOneHumData,
        impriFreezerTwoTempData,
        impriFreezerTwoHumData,
        impriFreezerThreeTempData,
        impriFreezerThreeHumData,
        impriFridgeOneTempData,
        impriFridgeOneHumData,
        impriFridgeTwoTempData,
        impriFridgeTwoHumData,
        impriIncuOneTempData,
        impriIncuOneHumData,
        impriIncuTwoTempData,
        impriIncuTwoHumData,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
};
