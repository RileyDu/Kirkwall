// File: api/cron-weekly-recap.js
import axios from 'axios';
import moment from 'moment-timezone';
import { CustomerSettings } from '../path/to/customers.js'; // Import the CustomerSettings file
import dotenv from 'dotenv';
dotenv.config({ path: 'src/NewBackend/.env' });

const baseURL = process.env.BACKEND_URL || 'https://kirkwall-demo.vercel.app/';

export const generateWeeklyRecap = async () => {
  console.log('Generating weekly recap data...');

  // Loop through each customer from CustomerSettings
  for (const customer of CustomerSettings) {
    const { email, metric: customerMetrics } = customer;

    // Calculate recap data for each customer using the helper function
    const recapData = await calculateWeeklyRecap(customerMetrics);

    // Insert the recap data into the database for each metric
    for (const metric in recapData) {
      try {
        await axios.post(`${baseURL}/api/weekly-recap`, {
          user_email: email,
          metric,
          week_start_date: moment().startOf('week').format('YYYY-MM-DD'),
          high: recapData[metric].high,
          low: recapData[metric].low,
          avg: recapData[metric].avg,
          alert_count: recapData[metric].alert_count,
        });
        console.log(`Weekly recap data inserted for ${email}, metric: ${metric}`);
      } catch (error) {
        console.error(`Error inserting weekly recap for ${metric} - ${email}:`, error);
      }
    }
  }
};

// Helper function to calculate weekly recap data
const calculateWeeklyRecap = async (userMetrics) => {
  const weatherMetrics = [
    'temperature',
    'percent_humidity',
    'wind_speed',
    'rain_15_min_inches',
    'soil_moisture',
    'leaf_wetness',
  ];
  const watchdogMetrics = ['temp', 'hum'];
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

  const allMetrics = [
    ...weatherMetrics,
    ...watchdogMetrics,
    ...impriMedMetrics,
  ];

  const userAssignedMetrics = allMetrics.filter((metric) => userMetrics.includes(metric));
  const metricData = {};

  for (const metric of userAssignedMetrics) {
    const data = await fetchSpecificData(metric);
    metricData[metric] = calculateMetrics(data);
  }

  return metricData;
};

// Fetch specific data based on the metric type
const fetchSpecificData = async (metric) => {
  try {
    let response;
    if (metric.includes('temp') || metric.includes('hum')) {
      response = await axios.get(`${baseURL}/api/watchdog_data`, { params: { type: metric, limit: 1009 } });
    } else if (metric.startsWith('imFreezer') || metric.startsWith('imFridge') || metric.startsWith('imIncubator')) {
      const deveui = deveuiPerMetric[metric];
      response = await axios.get(`${baseURL}/api/impriMed_data`, { params: { deveui: deveui, limit: 1009 } });
      response.data = renameKeyToMetric(response.data, metric);
    } else {
      response = await axios.get(`${baseURL}/api/weather_data`, { params: { type: metric, limit: 2017 } });
    }
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching data for ${metric}:`, error);
    return [];
  }
};

// Calculate high, low, and average for a given dataset
const calculateMetrics = (data) => {
  if (!data || data.length === 0) {
    return { high: null, low: null, avg: null };
  }

  const values = data.map((item) => parseFloat(item[Object.keys(item)[0]])).filter(value => !isNaN(value));

  if (values.length === 0) {
    return { high: null, low: null, avg: null };
  }

  const high = Math.max(...values);
  const low = Math.min(...values);
  const avg = (values.reduce((acc, value) => acc + value, 0) / values.length).toFixed(2);

  return { high, low, avg };
};

// Rename key to metric for impriMed data
const renameKeyToMetric = (data, metric) => {
  return data.map((d) => {
    const value = metric.endsWith('Temp') ? d.rctemp : d.humidity;
    return { [metric]: value, publishedat: d.publishedat };
  });
};
