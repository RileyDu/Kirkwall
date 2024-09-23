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

  // Define a dictionary for deveui mappings (example, replace with actual data)
  const deveuiPerMetric = {
    imFreezerOneTemp: '1234',
    imFreezerOneHum: '1234',
    // Add other mappings here
  };

  // Combine all available metrics for filtering
  const allMetrics = [
    ...weatherMetrics,
    ...watchdogMetrics,
    ...rivercityMetrics,
    ...impriMedMetrics,
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
      } else if (rivercityMetrics.includes(metric)) {
        response = await axios.get('/api/rivercity_data', {
          params: { type: metric, limit: 1009 },
        });
      } else if (weatherMetrics.includes(metric)) {
        response = await axios.get('/api/weather_data', {
          params: { type: metric, limit: 2017 },
        });
      } else if (impriMedMetrics.includes(metric)) {
        const deveui = deveuiPerMetric[metric];
        response = await axios.get('/api/impriMed_data', {
          params: { deveui: deveui, limit: 1009 },
        });
        response.data = renameKeyToMetric(response.data, metric);
      }
      return response?.data || [];
    } catch (error) {
      console.error(`Error fetching data for ${metric}:`, error);
      return [];
    }
  }

  // Calculate high, low, and average for a given dataset
  function calculateMetrics(data) {
    if (!data || data.length === 0) return { high: null, low: null, avg: null };
  
    const values = data.map((item) => item[Object.keys(item)[0]]);
    const high = Math.max(...values).toFixed(2);
    const low = Math.min(...values).toFixed(2);
    const avg = (values.reduce((acc, value) => acc + value, 0) / values.length).toFixed(2);
  
    return { high, low, avg };
  }
  

  // Rename key to metric for impriMed data
  function renameKeyToMetric(data, metric) {
    return data.map((d) => {
      const value = metric.endsWith('Temp') ? d.rctemp : d.humidity;
      return { [metric]: value, publishedat: d.publishedat };
    });
  }
};
