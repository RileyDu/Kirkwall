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
    case 'rivercityTempData':
      dataForChart = rivercityTempData || rivercityData;
      break;
    case 'rivercityHumData':
      dataForChart = rivercityHumData || rivercityData;
      break;
    case 'imFreezerOneTempData':
      dataForChart = impriFreezerOneTempData;
      break;
    case 'imFreezerOneHumData':
      dataForChart = impriFreezerOneHumData;
      break;
    case 'imFreezerTwoTempData':
      dataForChart = impriFreezerTwoTempData;
      break;
    case 'imFreezerTwoHumData':
      dataForChart = impriFreezerTwoHumData;
      break;
    case 'imFreezerThreeTempData':
      dataForChart = impriFreezerThreeTempData;
      break;
    case 'imFreezerThreeHumData':
      dataForChart = impriFreezerThreeHumData;
      break;
    case 'imFridgeOneTempData':
      dataForChart = impriFridgeOneTempData;
      break;
    case 'imFridgeOneHumData':
      dataForChart = impriFridgeOneHumData;
      break;
    case 'imFridgeTwoTempData':
      dataForChart = impriFridgeTwoTempData;
      break;
    case 'imFridgeTwoHumData':
      dataForChart = impriFridgeTwoHumData;
      break;
    case 'imIncubatorOneTempData':
      dataForChart = impriIncuOneTempData;
      break;
    case 'imIncubatorOneHumData':
      dataForChart = impriIncuOneHumData;
      break;
    case 'imIncubatorTwoTempData':
      dataForChart = impriIncuTwoTempData;
      break;
    case 'imIncubatorTwoHumData':
      dataForChart = impriIncuTwoHumData;
      break;
    default:
      dataForChart = weatherData;
  }

  return dataForChart;
};

export default ChartDataMapper;
