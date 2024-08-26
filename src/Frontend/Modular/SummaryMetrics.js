import { useWeatherData } from '../WeatherDataContext.js';

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
    rivercityTempData,
    rivercityHumData,
    watchdogData,
    rivercityData,
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
  } = useWeatherData();

  const calculateMetrics = (data, metric) => {
    if (!data || data.length === 0) return { average: 'N/A', current: 'N/A', high: 'N/A', low: 'N/A' };

    const sum = data.reduce((sum, item) => sum + item[metric], 0);
    const average = (sum / data.length).toFixed(2);
    const current = data[data.length - 1][metric].toFixed(2);
    const high = Math.max(...data.map(item => item[metric])).toFixed(2);
    const low = Math.min(...data.map(item => item[metric])).toFixed(2);

    return { average, current, high, low };
  };

  return [
    {
      label: 'Average Temp (°F)',
      ...calculateMetrics(tempData || weatherData, 'temperature'),
      metric: 'temperature',
    },
    {
      label: 'Average Humidity (%)',
      ...calculateMetrics(humidityData || weatherData, 'percent_humidity'),
      metric: 'percent_humidity',
    },
    {
      label: 'Average Wind Speed (mph)',
      ...calculateMetrics(windData || weatherData, 'wind_speed'),
      metric: 'wind_speed',
    },
    {
      label: 'Average Soil Moisture (centibars)',
      ...calculateMetrics(soilMoistureData || weatherData, 'soil_moisture'),
      metric: 'soil_moisture',
    },
    {
      label: 'Total Rainfall (inches)',
      ...calculateMetrics(rainfallData || weatherData, 'rain_15_min_inches'),
      metric: 'rain_15_min_inches',
    },
    {
      label: 'Average Leaf Wetness (0-15)',
      ...calculateMetrics(leafWetnessData || weatherData, 'leaf_wetness'),
      metric: 'leaf_wetness',
    },
    {
      label: 'Garage Temp (°F)',
      ...calculateMetrics(watchdogTempData || watchdogData, 'temp'),
      metric: 'temp',
    },
    {
      label: 'Garage Humidity (%)',
      ...calculateMetrics(watchdogHumData || watchdogData, 'hum'),
      metric: 'hum',
    },
    {
      label: 'Rivercity Temperature (°F)',
      ...calculateMetrics(rivercityTempData || rivercityData, 'rctemp'),
      metric: 'rctemp',
    },
    {
      label: 'Rivercity Humidity (%)',
      ...calculateMetrics(rivercityHumData || rivercityData, 'humidity'),
      metric: 'humidity',
    },
    // {
    //   label: 'Impri Freezer #1 (°C)',
    //   ...calculateMetrics(impriFreezerOneTempData, 'imFreezerOneTemp'),
    //   metric: 'imFreezerOneTemp',
    // },
    // {
    //   label: 'Impri Freezer #1 (%)',
    //   ...calculateMetrics(impriFreezerOneHumData, 'imFreezerOneHum'),
    //   metric: 'imFreezerOneHum',
    // },
    {
      label: 'Impri Freezer #2 (°C)',
      ...calculateMetrics(impriFreezerTwoTempData, 'imFreezerTwoTemp'),
      metric: 'imFreezerTwoTemp',
    },
    {
      label: 'Impri Freezer #2 (%)',
      ...calculateMetrics(impriFreezerTwoHumData, 'imFreezerTwoHum'),
      metric: 'imFreezerTwoHum',
    },
    {
      label: 'Impri Freezer #3 (°C)',
      ...calculateMetrics(impriFreezerThreeTempData, 'imFreezerThreeTemp'),
      metric: 'imFreezerThreeTemp',
    },
    {
      label: 'Impri Freezer #3 (%)',
      ...calculateMetrics(impriFreezerThreeHumData, 'imFreezerThreeHum'),
      metric: 'imFreezerThreeHum',
    },
    {
      label: 'Impri Fridge #1 (°C)',
      ...calculateMetrics(impriFridgeOneTempData, 'imFridgeOneTemp'),
      metric: 'imFridgeOneTemp',
    },
    {
      label: 'Impri Fridge #1 (%)',
      ...calculateMetrics(impriFridgeOneHumData, 'imFridgeOneHum'),
      metric: 'imFridgeOneHum',
    },
    {
      label: 'Impri Fridge #2 (°C)',
      ...calculateMetrics(impriFridgeTwoTempData, 'imFridgeTwoTemp'),
      metric: 'imFridgeTwoTemp',
    },
    {
      label: 'Impri Fridge #2 (%)',
      ...calculateMetrics(impriFridgeTwoHumData, 'imFridgeTwoHum'),
      metric: 'imFridgeTwoHum',
    },
    // {
    //   label: 'Impri Incubator #1 (°C)',
    //   ...calculateMetrics(impriIncuOneTempData, 'imIncubatorOneTemp'),
    //   metric: 'imIncubatorOneTemp',
    // },
    // {
    //   label: 'Impri Incubator #1 (%)',
    //   ...calculateMetrics(impriIncuOneHumData, 'imIncubatorOneHum'),
    //   metric: 'imIncubatorOneHum',
    // },
    {
      label: 'Impri Incubator #2 (°C)',
      ...calculateMetrics(impriIncuTwoTempData, 'imIncubatorTwoTemp'),
      metric: 'imIncubatorTwoTemp',
    },
    {
      label: 'Impri Incubator #2 (%)',
      ...calculateMetrics(impriIncuTwoHumData, 'imIncubatorTwoHum'),
      metric: 'imIncubatorTwoHum',
    },
  ];
};
