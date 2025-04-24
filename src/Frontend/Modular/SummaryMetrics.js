import { useWeatherData } from '../WeatherDataContext.js';

const isValidNumber = value => typeof value === 'number' && !isNaN(value);


export const SummaryMetrics = () => {
  const {
    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
    watchdogTempData,
    watchdogHumData,
    watchdogData,
    monnitBathroomData,
    monnitFridgeData,
    monnitFreezerData,
    monnitAmpData,
  } = useWeatherData();

  const calculateTimePeriod = (metric, dataLength) => {
    const totalMinutes =
      metric === 'temperature' ||
      metric === 'percent_humidity' ||
      metric === 'wind_speed' ||
      metric === 'rain_15_min_inches' ||
      metric === 'soil_moisture' ||
      metric === 'leaf_wetness'
        ? dataLength * 5
        : metric === 'monnit_bathroom' || metric === 'monnit_fridge' || metric === 'monnit_freezer' || metric === 'monnit_amp'
        ? dataLength * 15
        : dataLength * 10;
    const totalHours = Math.floor(totalMinutes / 60);

    if (totalHours < 2) {
      return `${totalHours} Hour`;
    } else if (totalHours < 24) {
      return `${totalHours} Hours`;
    } else if (totalHours < 72) {
      // Less than 3 days
      return '1 Day';
    } else if (totalHours < 168) {
      // Less than 1 week
      return '3 Days';
    } else {
      return '1 Week';
    }
  };

  const calculateMetrics = (data, metric) => {
    if (!data || data.length === 0) return { average: 'N/A', current: 'N/A', high: 'N/A', low: 'N/A' };
  
    // Helper function to convert to number
    const toNumber = value => {
      const num = parseFloat(value);
      return !isNaN(num) ? num : 'N/A';
    };
  
    // Filter out invalid data and make sure all values are numbers
    const validData = data.map(item => ({
      ...item,
      [metric]: toNumber(item[metric]),
    })).filter(item => typeof item[metric] === 'number' && !isNaN(item[metric]));
  
    if (validData.length === 0) return { average: 'N/A', current: 'N/A', high: 'N/A', low: 'N/A' };
  
    const sum = validData.reduce((sum, item) => sum + item[metric], 0);
    const average = (sum / validData.length).toFixed(2);
  
    const current = toNumber(validData[0][metric]) !== 'N/A' ? validData[0][metric].toFixed(2) : 'N/A';
    const high = Math.max(...validData.map(item => item[metric])).toFixed(2);
    const low = Math.min(...validData.map(item => item[metric])).toFixed(2);
  
    const timeOfData = calculateTimePeriod(metric, validData.length - 1);
  
    return { average, current, high, low, timeOfData };
  };
  
  
  

  return [
    {
      label: 'Average Temperature',
      ...calculateMetrics(tempData || weatherData, 'temperature'),
      metric: 'temperature',
    },
    {
      label: 'Average Humidity',
      ...calculateMetrics(humidityData || weatherData, 'percent_humidity'),
      metric: 'percent_humidity',
    },
    {
      label: 'Average Wind Speed',
      ...calculateMetrics(windData || weatherData, 'wind_speed'),
      metric: 'wind_speed',
    },
    {
      label: 'Average Soil Moisture',
      ...calculateMetrics(soilMoistureData || weatherData, 'soil_moisture'),
      metric: 'soil_moisture',
    },
    {
      label: 'Total Rainfall',
      ...calculateMetrics(rainfallData || weatherData, 'rain_15_min_inches'),
      metric: 'rain_15_min_inches',
    },
    {
      label: 'Average Leaf Wetness',
      ...calculateMetrics(leafWetnessData || weatherData, 'leaf_wetness'),
      metric: 'leaf_wetness',
    },
    {
      label: 'Garage Temperature',
      ...calculateMetrics(watchdogTempData || watchdogData, 'temp'),
      metric: 'temp',
    },
    {
      label: 'Garage Humidity',
      ...calculateMetrics(watchdogHumData || watchdogData, 'hum'),
      metric: 'hum',
    },
    {
      label: 'Fridge Temperature',
      ...calculateMetrics(monnitFridgeData, 'monnit_fridge'),
      metric: 'monnit_fridge',
    },
    {
      label: 'Freezer Temperature',
      ...calculateMetrics(monnitFreezerData, 'monnit_freezer'),
      metric: 'monnit_freezer',
    },
    {
      label: 'Bathroom Temperature',
      ...calculateMetrics(monnitBathroomData, 'monnit_bathroom'),
      metric: 'monnit_bathroom',
    },
    {
      label: 'Lamp Amp Hours',
      ...calculateMetrics(monnitAmpData, 'monnit_amp'),
      metric: 'monnit_amp',
    }
  ];
};
