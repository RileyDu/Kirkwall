// File: api/cron-weekly-recap.js
import axios from 'axios';
import moment from 'moment-timezone';
import { CustomerSettings } from '../../Frontend/Modular/CustomerSettings.js';
import dotenv from 'dotenv';
dotenv.config();

const baseURL = process.env.BACKEND_URL || 'https://kirkwall-demo.vercel.app';

export const generateWeeklyRecap = async () => {
  console.log('Generating weekly recap data...');
  console.log('Using baseURL:', baseURL);

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
        console.log(
          `Weekly recap data inserted for ${email}, metric: ${metric}`
        );
      } catch (error) {
        console.error(
          `Error inserting weekly recap for ${metric} - ${email}:`,
          error
        );
      }
    }
  }
};

// Helper function to calculate weekly recap data
const calculateWeeklyRecap = async userMetrics => {
  const weatherMetrics = [
    'temperature',
    'percent_humidity',
    'wind_speed',
    'rain_15_min_inches',
    'soil_moisture',
    'leaf_wetness',
  ];
  const watchdogMetrics = ['temp', 'hum'];

  const allMetrics = [
    ...weatherMetrics,
    ...watchdogMetrics,
  ];

  const userAssignedMetrics = allMetrics.filter(metric =>
    userMetrics.includes(metric)
  );
  const metricData = {};

  for (const metric of userAssignedMetrics) {
    const data = await fetchSpecificData(metric);
    metricData[metric] = calculateMetrics(data);
  }

  return metricData;
};

// Fetch specific data based on the metric type
const fetchSpecificData = async metric => {

  try {
    let response;
    if (metric === 'temp' || metric === 'hum') {
      response = await axios.get(`${baseURL}/api/watchdog_data`, {
        params: { type: metric, limit: 1009 },
      });
    } else {
      response = await axios.get(`${baseURL}/api/weather_data`, {
        params: { type: metric, limit: 2017 },
      });
    }
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching data for ${metric}:`, error);
    return [];
  }
};

// Calculate high, low, and average for a given dataset
const calculateMetrics = data => {
  if (!data || data.length === 0) {
    return { high: null, low: null, avg: null };
  }

  const values = data
    .map(item => parseFloat(item[Object.keys(item)[0]]))
    .filter(value => !isNaN(value));

  if (values.length === 0) {
    return { high: null, low: null, avg: null };
  }

  const high = Math.max(...values);
  const low = Math.min(...values);
  const avg = (
    values.reduce((acc, value) => acc + value, 0) / values.length
  ).toFixed(2);

  return { high, low, avg };
};
