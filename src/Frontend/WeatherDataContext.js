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
  const [selectedTimePeriodWDHum, setSelectedTimePeriodWDHum] = useState('3H');
  const [selectedTimePeriodRCTemp, setSelectedTimePeriodRCTemp] =
    useState('3H');
  const [selectedTimePeriodRCHum, setSelectedTimePeriodRCHum] = useState('3H');
  const [
    selectedTimePeriodIMFreezerOneTemp,
    setSelectedTimePeriodIMFreezerOneTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFreezerOneHum,
    setSelectedTimePeriodIMFreezerOneHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFreezerTwoTemp,
    setSelectedTimePeriodIMFreezerTwoTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFreezerTwoHum,
    setSelectedTimePeriodIMFreezerTwoHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFreezerThreeTemp,
    setSelectedTimePeriodIMFreezerThreeTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFreezerThreeHum,
    setSelectedTimePeriodIMFreezerThreeHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFridgeOneTemp,
    setSelectedTimePeriodIMFridgeOneTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFridgeOneHum,
    setSelectedTimePeriodIMFridgeOneHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFridgeTwoTemp,
    setSelectedTimePeriodIMFridgeTwoTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMFridgeTwoHum,
    setSelectedTimePeriodIMFridgeTwoHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMIncubatorOneTemp,
    setSelectedTimePeriodIMIncubatorOneTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMIncubatorOneHum,
    setSelectedTimePeriodIMIncubatorOneHum,
  ] = useState('3H');
  const [
    selectedTimePeriodIMIncubatorTwoTemp,
    setSelectedTimePeriodIMIncubatorTwoTemp,
  ] = useState('3H');
  const [
    selectedTimePeriodIMIncubatorTwoHum,
    setSelectedTimePeriodIMIncubatorTwoHum,
  ] = useState('3H');
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
  const [impriFreezerThreeTempData, setImpriFreezerThreeTempData] =
    useState(null);
  const [impriFreezerThreeHumData, setImpriFreezerThreeHumData] =
    useState(null);
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
    freezerOne: '0080E1150618C9DE',
    freezerTwo: '0080E115054FC6DF',
    freezerThree: '0080E1150618B549',
    fridgeOne: '0080E1150619155F',
    fridgeTwo: '0080E115061924EA',
    incubatorOne: '0080E115054FF1DC',
    incubatorTwo: '0080E1150618B45F',
  };

  const deveuiPerMetric = {
    imFreezerOneTemp: '0080E1150618C9DE',
    imFreezerOneHum: '0080E1150618C9DE',
    imFreezerTwoTemp: '0080E115054FC6DF',
    imFreezerTwoHum: '0080E115054FC6DF',
    imFreezerThreeTemp: '0080E1150618B549',
    imFreezerThreeHum: '0080E1150618B549',
    imFridgeOneTemp: '0080E1150619155F',
    imFridgeOneHum: '0080E1150619155F',
    imFridgeTwoTemp: '0080E115061924EA',
    imFridgeTwoHum: '0080E115061924EA',
    imIncubatorOneTemp: '0080E115054FF1DC',
    imIncubatorOneHum: '0080E115054FF1DC',
    imIncubatorTwoTemp: '0080E1150618B45F',
    imIncubatorTwoHum: '0080E1150618B45F',
  };

  const fetchDeviceData = async (deviceKey, setTempData, setHumData, limit) => {
    const deveui = devices[deviceKey];
    console.log('Fetching data for deveui:', deveui);

    try {
      const response = await axios.get(
        `/api/impriMed_data`,
        {
          params: {
            limit: limit,
            deveui: deveui, // This will properly attach the deveui as a query parameter
          },
        }
      );
      // console.log(response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        const latestData = response.data;

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
          publishedat: data.publishedat,
        }));

        const humDataArray = latestData.map(data => ({
          [humKey]: data.humidity,
          publishedat: data.publishedat,
        }));

        // Set the entire array of temperature and humidity data
        setTempData(tempDataArray);
        setHumData(humDataArray);
        console.log(`Latest temperature data for ${deviceKey}:`, tempDataArray);
        console.log(`Latest humidity data for ${deviceKey}:`, humDataArray);
      }
    } catch (error) {
      console.error(`Error fetching data for ${deviceKey}:`, error);
    }
  };

  useEffect(() => {
    if (
      currentUser &&
      currentUser.email === 'jerrycromarty@imprimedicine.com'
    ) {
      const fetchAllDeviceData = async () => {
        await Promise.all([
          // fetchDeviceData('freezerOne', setImpriFreezerOneTempData, setImpriFreezerOneHumData, 19),
          fetchDeviceData(
            'freezerTwo',
            setImpriFreezerTwoTempData,
            setImpriFreezerTwoHumData,
            19
          ),
          fetchDeviceData(
            'freezerThree',
            setImpriFreezerThreeTempData,
            setImpriFreezerThreeHumData,
            19
          ),
          fetchDeviceData(
            'fridgeOne',
            setImpriFridgeOneTempData,
            setImpriFridgeOneHumData,
            19
          ),
          fetchDeviceData(
            'fridgeTwo',
            setImpriFridgeTwoTempData,
            setImpriFridgeTwoHumData,
            19
          ),
          // fetchDeviceData('incubatorOne', setImpriIncubatorOneTempData, setImpriIncubatorOneHumData, 19),
          fetchDeviceData(
            'incubatorTwo',
            setImpriIncubatorTwoTempData,
            setImpriIncubatorTwoHumData,
            19
          ),
        ]);
        setLoading(false);
      };

      fetchAllDeviceData();

      const intervalId = setInterval(fetchAllDeviceData, 600000); // Fetch data every 10 minutes

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [currentUser]);

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
        currentUser?.email === 'test@kirkwall.io')
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
        currentUser?.email === 'trey@watchdogprotect.com')
    ) {
      const fetchData = async () => {
        try {
          if (currentUser.email === 'test@kirkwall.io') {
            const [watchdogResponse, rivercityResponse] = await Promise.all([
              axios.get('/api/watchdog_data', {
                params: { type: 'all', limit: '19' },
              }),
              axios.get('/api/rivercity_data', {
                params: { type: 'all', limit: '19' },
              }),
            ]);

            if (Array.isArray(watchdogResponse.data)) {
              setWatchdogData(watchdogResponse.data);
            } else {
              setWatchdogData([]);
            }

            if (Array.isArray(rivercityResponse.data)) {
              setRivercityData(rivercityResponse.data);
            } else {
              setRivercityData([]);
            }
          } else if (currentUser.email === 'trey@watchdogprotect.com') {
            const watchdogResponse = await axios.get('/api/watchdog_data', {
              params: { type: 'all', limit: '19' },
            });

            if (Array.isArray(watchdogResponse.data)) {
              setWatchdogData(watchdogResponse.data);
            } else {
              setWatchdogData([]);
            }

            setRivercityData([]); // Clear rivercity data for this user
          }

          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setWatchdogData([]);
          setRivercityData([]);
          setLoading(false);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 30000);

      return () => clearInterval(intervalId);
    }
  }, [currentUser]);

  const fetchAlertsThreshold = async () => {
    console.log('Received request for alerts per user');
    const userMetrics = CustomerSettings.find(
      customer => customer.email === currentUser?.email
    )?.metric;

    try {
      const response = await axios.get('/api/alerts_per_user', {
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
        if (dataLoaded.rivercityTemp) {
          fetchSpecificData('rctemp', selectedTimePeriodRCTemp);
        }
        if (dataLoaded.rivercityHum) {
          fetchSpecificData('humidity', selectedTimePeriodRCHum);
        }
        if (dataLoaded.imFreezerOneTemp) {
          fetchSpecificData(
            'imFreezerOneTemp',
            selectedTimePeriodIMFreezerOneTemp
          );
        }
        if (dataLoaded.imFreezerOneHum) {
          fetchSpecificData(
            'imFreezerOneHum',
            selectedTimePeriodIMFreezerOneHum
          );
        }
        if (dataLoaded.imFreezerTwoTemp) {
          fetchSpecificData(
            'imFreezerTwoTemp',
            selectedTimePeriodIMFreezerTwoTemp
          );
        }
        if (dataLoaded.imFreezerTwoHum) {
          fetchSpecificData(
            'imFreezerTwoHum',
            selectedTimePeriodIMFreezerTwoHum
          );
        }
        if (dataLoaded.imFreezerThreeTemp) {
          fetchSpecificData(
            'imFreezerThreeTemp',
            selectedTimePeriodIMFreezerThreeTemp
          );
        }
        if (dataLoaded.imFreezerThreeHum) {
          fetchSpecificData(
            'imFreezerThreeHum',
            selectedTimePeriodIMFreezerThreeHum
          );
        }
        if (dataLoaded.imFridgeOneTemp) {
          fetchSpecificData(
            'imFridgeOneTemp',
            selectedTimePeriodIMFridgeOneTemp
          );
        }
        if (dataLoaded.imFridgeOneHum) {
          fetchSpecificData('imFridgeOneHum', selectedTimePeriodIMFridgeOneHum);
        }
        if (dataLoaded.imFridgeTwoTemp) {
          fetchSpecificData(
            'imFridgeTwoTemp',
            selectedTimePeriodIMFridgeTwoTemp
          );
        }
        if (dataLoaded.imFridgeTwoHum) {
          fetchSpecificData('imFridgeTwoHum', selectedTimePeriodIMFridgeTwoHum);
        }
        if (dataLoaded.imIncubatorOneTemp) {
          fetchSpecificData(
            'imIncubatorOneTemp',
            selectedTimePeriodIMIncubatorOneTemp
          );
        }
        if (dataLoaded.imIncubatorOneHum) {
          fetchSpecificData(
            'imIncubatorOneHum',
            selectedTimePeriodIMIncubatorOneHum
          );
        }
        if (dataLoaded.imIncubatorTwoTemp) {
          fetchSpecificData(
            'imIncubatorTwoTemp',
            selectedTimePeriodIMIncubatorTwoTemp
          );
        }
        if (dataLoaded.imIncubatorTwoHum) {
          fetchSpecificData(
            'imIncubatorTwoHum',
            selectedTimePeriodIMIncubatorTwoHum
          );
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
        setDataLoaded(prevState => ({
          ...prevState,
          imFreezerThreeTemp: true,
        }));
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
        setDataLoaded(prevState => ({
          ...prevState,
          imIncubatorOneTemp: true,
        }));
        break;
      case 'imIncubatorOneHum':
        setSelectedTimePeriodIMIncubatorOneHum(timePeriod);
        setDataLoaded(prevState => ({ ...prevState, imIncubatorOneHum: true }));
        break;
      case 'imIncubatorTwoTemp':
        setSelectedTimePeriodIMIncubatorTwoTemp(timePeriod);
        setDataLoaded(prevState => ({
          ...prevState,
          imIncubatorTwoTemp: true,
        }));
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
  const impriMedMetrics = [
    'imFreezerOneTemp',
    'imFreezerOneHum',
    'imFreezerTwoTemp',
    'imFreezerTwoHum',
    'imFreezerThreeTemp',
    'imFreezerThreeHum',
    'imFridgeOneTemp',
    'imFridgeOneHum',
    'imFridgeTwoTemp',
    'imFridgeTwoHum',
    'imIncubatorOneTemp',
    'imIncubatorOneHum',
    'imIncubatorTwoTemp',
    'imIncubatorTwoHum',
  ];

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
  
    // Define all metric groups
    const weatherMetrics = [
      'temperature',
      'percent_humidity',
      'wind_speed',
      'rain_15_min_inches',
      'soil_moisture',
      'leaf_wetness',
    ];

    // Determine which limits to use based on the metric
    let limits;
    if (weatherMetrics.includes(metric)) {
      limits = weatherLimits;
    } else {
      limits = defaultLimits;
    }
  
    console.log(limits[timePeriod]);
    // Return the appropriate limit based on the time period, or the default if time period is not found
    return limits[timePeriod]
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
      } else if (rivercityMetrics.includes(metric)) {
        // Fetch rivercity data using Axios
        const response = await axios.get('/api/rivercity_data', {
          params: {
            type: metric, // type: 'rctemp' or 'humidity'
            limit: limit,
          },
        });
        switch (metric) {
          case 'rctemp':
            setRivercityTempData(response.data);
            break;
          case 'humidity':
            setRivercityHumData(response.data);
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
      } else if (impriMedMetrics.includes(metric)) {
        // Fetch impriMed data using Axios
        const deveui = deveuiPerMetric[metric];
        const response = await axios.get('/api/impriMed_data', {
          params: {
            deveui: deveui,
            limit: limit,
          },
        });
  
        const latestData = response.data;
        const renameKeyToMetric = (data, metric) => {
          return data.map((d) => {
            const value = metric.endsWith('Temp') ? d.rctemp : d.humidity;
            return {
              [metric]: value,
              publishedat: d.publishedat,
            };
          });
        };
  
        switch (metric) {
          case 'imFreezerOneTemp':
            setImpriFreezerOneTempData(renameKeyToMetric(latestData, 'imFreezerOneTemp'));
            break;
          case 'imFreezerOneHum':
            setImpriFreezerOneHumData(renameKeyToMetric(latestData, 'imFreezerOneHum'));
            break;
          case 'imFreezerTwoTemp':
            setImpriFreezerTwoTempData(renameKeyToMetric(latestData, 'imFreezerTwoTemp'));
            break;
          case 'imFreezerTwoHum':
            setImpriFreezerTwoHumData(renameKeyToMetric(latestData, 'imFreezerTwoHum'));
            break;
          case 'imFreezerThreeTemp':
            setImpriFreezerThreeTempData(renameKeyToMetric(latestData, 'imFreezerThreeTemp'));
            break;
          case 'imFreezerThreeHum':
            setImpriFreezerThreeHumData(renameKeyToMetric(latestData, 'imFreezerThreeHum'));
            break;
          case 'imFridgeOneTemp':
            setImpriFridgeOneTempData(renameKeyToMetric(latestData, 'imFridgeOneTemp'));
            break;
          case 'imFridgeOneHum':
            setImpriFridgeOneHumData(renameKeyToMetric(latestData, 'imFridgeOneHum'));
            break;
          case 'imFridgeTwoTemp':
            setImpriFridgeTwoTempData(renameKeyToMetric(latestData, 'imFridgeTwoTemp'));
            break;
          case 'imFridgeTwoHum':
            setImpriFridgeTwoHumData(renameKeyToMetric(latestData, 'imFridgeTwoHum'));
            break;
          case 'imIncubatorOneTemp':
            setImpriIncubatorOneTempData(renameKeyToMetric(latestData, 'imIncubatorOneTemp'));
            break;
          case 'imIncubatorOneHum':
            setImpriIncubatorOneHumData(renameKeyToMetric(latestData, 'imIncubatorOneHum'));
            break;
          case 'imIncubatorTwoTemp':
            setImpriIncubatorTwoTempData(renameKeyToMetric(latestData, 'imIncubatorTwoTemp'));
            break;
          case 'imIncubatorTwoHum':
            setImpriIncubatorTwoHumData(renameKeyToMetric(latestData, 'imIncubatorTwoHum'));
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
        setChartData,
        fetchChartData,
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
