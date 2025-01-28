import axios from 'axios';

export const WeeklyRecapHelper = async (userMetrics) => {
  const weatherMetrics = [
    'temperature',
    'percent_humidity',
    'wind_speed',
    'rain_15_min_inches',
    'soil_moisture',
    'leaf_wetness',
  ];
  const watchdogMetrics = ['temp', 'hum'];


  // Combine all available metrics for filtering
  const allMetrics = [
    ...weatherMetrics,
    ...watchdogMetrics,
  ];

  // Filter only the metrics the user has access to
  const userAssignedMetrics = allMetrics.filter((metric) => userMetrics.includes(metric));

  const metricData = {};

  // Fetch data for each user-assigned metric
  for (const metric of userAssignedMetrics) {
    const data = await fetchSpecificData(metric);
    metricData[metric] = calculateMetrics(data);
  }

  return metricData;

  // Fetch specific data based on the metric type
  async function fetchSpecificData(metric) {
    try {
      let response;
      if (watchdogMetrics.includes(metric)) {
        response = await axios.get('/api/watchdog_data', {
          params: { type: metric, limit: 1009 },
        });
      } else if (weatherMetrics.includes(metric)) {
        response = await axios.get('/api/weather_data', {
          params: { type: metric, limit: 2017 },
        });
      } 
      return response?.data || [];
    } catch (error) {
      console.error(`Error fetching data for ${metric}:`, error);
      return [];
    }
  }

  // Calculate high, low, and average for a given dataset
  function calculateMetrics(data) {
    if (!data || data.length === 0) {
      return { high: null, low: null, avg: null };
    }
  
    // Extract values and ensure they are numbers
    const values = data.map((item) => {
      const value = parseFloat(item[Object.keys(item)[0]]);
      return isNaN(value) ? null : value;
    }).filter(value => value !== null); // Filter out any null values
  
    if (values.length === 0) {
      // If there are no valid numeric values, return null for all metrics
      return { high: null, low: null, avg: null };
    }
  
    // Check for empty arrays or invalid data leading to Infinity
    const high = values.length > 0 ? Math.max(...values) : null;
    const low = values.length > 0 ? Math.min(...values) : null;
    const avg = values.length > 0 ? (values.reduce((acc, value) => acc + value, 0) / values.length).toFixed(2) : null;
  
    // Handle cases where high, low, or avg is Infinity
    if (high === Infinity || low === Infinity || avg === Infinity) {
      console.error('Invalid data detected:', data);
      return { high: 'Invalid data', low: 'Invalid data', avg: 'Invalid data' };
    }
  
    return { high, low, avg };
  }
  
  
  
