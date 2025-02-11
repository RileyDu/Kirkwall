import React from 'react';
import { useWeatherData } from '../WeatherDataContext.js';

const ChartDataMapper = ({ dataForMetric }) => {
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
  } = useWeatherData();

  let dataForChart;
  switch (dataForMetric) {
    case 'tempData':
      dataForChart = tempData || weatherData;
      break;
    case 'humidityData':
      dataForChart = humidityData || weatherData;
      break;
    case 'windData':
      dataForChart = windData || weatherData;
      break;
    case 'rainfallData':
      dataForChart = rainfallData || weatherData;
      break;
    case 'soilMoistureData':
      dataForChart = soilMoistureData || weatherData;
      break;
    case 'leafWetnessData':
      dataForChart = leafWetnessData || weatherData;
      break;
    case 'watchdogTempData':
      dataForChart = watchdogTempData || watchdogData;
      break;
    case 'watchdogHumData':
      dataForChart = watchdogHumData || watchdogData;
      break;
    case 'monnitBathroomData':
      dataForChart = monnitBathroomData || monnitBathroomData;
      break;
    case 'monnitFridgeData':
      dataForChart = monnitFridgeData || monnitFridgeData;
      break;
    case 'monnitFreezerData':
      dataForChart = monnitFreezerData || monnitFreezerData;
      break;
    default:
      dataForChart = weatherData;
  }

  return dataForChart;
};

export default ChartDataMapper;
