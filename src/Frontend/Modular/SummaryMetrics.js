// SummaryMetrics.js
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

  return [
    {
      label: 'Average Temp (°F)',
      value: tempData
        ? (
            tempData.reduce((sum, data) => sum + data.temperature, 0) /
            tempData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.temperature, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'temperature',
    },
    {
      label: 'Average Humidity (%)',
      value: humidityData
        ? (
            humidityData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            humidityData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'percent_humidity',
    },
    {
      label: 'Average Wind Speed (mph)',
      value: windData
        ? (
            windData.reduce((sum, data) => sum + data.wind_speed, 0) /
            windData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.wind_speed, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'wind_speed',
    },
    {
      label: 'Average Soil Moisture (centibars)',
      value: soilMoistureData
        ? (
            soilMoistureData.reduce(
              (sum, data) => sum + data.soil_moisture,
              0
            ) / soilMoistureData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.soil_moisture, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'soil_moisture',
    },
    {
      label: 'Total Rainfall (inches)',
      value: rainfallData
        ? rainfallData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : weatherData
        ? weatherData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : 'N/A',
      metric: 'rain_15_min_inches',
    },
    {
      label: 'Average Leaf Wetness (0-15)',
      value: leafWetnessData
        ? (
            leafWetnessData.reduce((sum, data) => sum + data.leaf_wetness, 0) /
            leafWetnessData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.leaf_wetness, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'leaf_wetness',
    },
    {
      label: 'Garage Average Temp (°F)',
      value: watchdogTempData
        ? (
            watchdogTempData.reduce((sum, data) => sum + data.temp, 0) /
            watchdogTempData.length
          ).toFixed(2)
        : watchdogData
        ? (
            watchdogData.reduce((sum, data) => sum + data.temp, 0) /
            watchdogData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'temp',
    },
    {
      label: 'Garage Humidity (%)',
      value: watchdogHumData
        ? (
            watchdogHumData.reduce((sum, data) => sum + data.hum, 0) /
            watchdogHumData.length
          ).toFixed(2)
        : watchdogData
        ? (
            watchdogData.reduce((sum, data) => sum + data.hum, 0) /
            watchdogData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'hum',
    },
    {
      label: 'Rivercity Temperature (°F)',
      value: rivercityTempData
        ? (
            rivercityTempData.reduce((sum, data) => sum + data.rctemp, 0) /
            rivercityTempData.length
          ).toFixed(2)
        : rivercityData
        ? (
            rivercityData.reduce((sum, data) => sum + data.rctemp, 0) /
            rivercityData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'rctemp',
    },
    {
      label: 'Rivercity Humidity (%)',
      value: rivercityHumData
        ? (
            rivercityHumData.reduce((sum, data) => sum + data.humidity, 0) /
            rivercityHumData.length
          ).toFixed(2)
        : rivercityData && rivercityData.length
        ? (
            rivercityData.reduce((sum, data) => sum + data.humidity, 0) /
            rivercityData.length
          ).toFixed(2)
        : 'N/A',
      metric: 'humidity',
    },
    // {
    //   label: 'Impri Freezer #1 (°C)',
    //   value: impriFreezerOneTempData
    //     ? (
    //         impriFreezerOneTempData.reduce(
    //           (sum, data) => sum + data.imFreezerOneTemp,
    //           0
    //         ) / impriFreezerOneTempData.length
    //       ).toFixed(2)
    //     : 'N/A',
    //   metric: 'imFreezerOneTemp',
    // },
    // {
    //   label: 'Impri Freezer #1 (%)',
    //   value: impriFreezerOneHumData
    //     ? (
    //         impriFreezerOneHumData.reduce(
    //           (sum, data) => sum + data.imFreezerOneHum,
    //           0
    //         ) / impriFreezerOneHumData.length
    //       ).toFixed(2)
    //     : 'N/A',
    //   metric: 'imFreezerOneHum',
    // },
    {
        label: 'Impri Freezer #2 (°C)',
        value: impriFreezerTwoTempData
          ? (
              impriFreezerTwoTempData.reduce(
                (sum, data) => sum + data.imFreezerTwoTemp,
                0
              ) / impriFreezerTwoTempData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFreezerTwoTemp',
    },
    {
        label: 'Impri Freezer #2 (%)',
        value: impriFreezerTwoHumData
          ? (
              impriFreezerTwoHumData.reduce(
                (sum, data) => sum + data.imFreezerTwoHum,
                0
              ) / impriFreezerTwoHumData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFreezerTwoHum',
    },
    {
        label: 'Impri Freezer #3 (°C)',
        value: impriFreezerThreeTempData
          ? (
              impriFreezerThreeTempData.reduce(
                (sum, data) => sum + data.imFreezerThreeTemp,
                0
              ) / impriFreezerThreeTempData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFreezerThreeTemp',
    },
    {
        label: 'Impri Freezer #3 (%)',
        value: impriFreezerThreeHumData
          ? (
              impriFreezerThreeHumData.reduce(
                (sum, data) => sum + data.imFreezerThreeHum,
                0
              ) / impriFreezerThreeHumData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFreezerThreeHum',
    },
    {
        label: 'Impri Fridge #1 (°C)',
        value: impriFridgeOneTempData
          ? (
              impriFridgeOneTempData.reduce(
                (sum, data) => sum + data.imFridgeOneTemp,
                0
              ) / impriFridgeOneTempData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFridgeOneTemp',
    },
    {
        label: 'Impri Fridge #1 (%)',
        value: impriFridgeOneHumData
          ? (
              impriFridgeOneHumData.reduce(
                (sum, data) => sum + data.imFridgeOneHum,
                0
              ) / impriFridgeOneHumData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFridgeOneHum',
    },
    {
        label: 'Impri Fridge #2 (°C)',
        value: impriFridgeTwoTempData
          ? (
              impriFridgeTwoTempData.reduce(
                (sum, data) => sum + data.imFridgeTwoTemp,
                0
              ) / impriFridgeTwoTempData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFridgeTwoTemp',
    },
    {
        label: 'Impri Fridge #2 (%)',
        value: impriFridgeTwoHumData
          ? (
              impriFridgeTwoHumData.reduce(
                (sum, data) => sum + data.imFridgeTwoHum,
                0
              ) / impriFridgeTwoHumData.length
            ).toFixed(2)
          : 'N/A',
        metric: 'imFridgeTwoHum',
    },
    // {
    //     label: 'Impri Incubator #1 (°C)',
    //     value: impriIncuOneTempData
    //       ? (
    //           impriIncuOneTempData
    //             .reduce((sum, data) => sum + data.imIncubatorOneTemp, 0) /
    //             impriIncuOneTempData.length
    //         ).toFixed(2)
    //         : 'N/A',
    //     metric: 'imIncubatorOneTemp',
    // },
    // {
    //     label: 'Impri Incubator #1 (%)',
    //     value: impriIncuOneHumData
    //       ? (
    //           impriIncuOneHumData
    //             .reduce((sum, data) => sum + data.imIncubatorOneHum, 0) /
    //             impriIncuOneHumData.length
    //         ).toFixed(2)
    //         : 'N/A',
    //     metric: 'imIncubatorOneHum',
    // },
    {
        label: 'Impri Incubator #2 (°C)',
        value: impriIncuTwoTempData
          ? (
              impriIncuTwoTempData
                .reduce((sum, data) => sum + data.imIncubatorTwoTemp, 0) /
                impriIncuTwoTempData.length
            ).toFixed(2)
            : 'N/A',
        metric: 'imIncubatorTwoTemp',
    },
    {
        label: 'Impri Incubator #2 (%)',
        value: impriIncuTwoHumData
          ? (
              impriIncuTwoHumData
                .reduce((sum, data) => sum + data.imIncubatorTwoHum, 0) /
                impriIncuTwoHumData.length
            ).toFixed(2)
            : 'N/A',
        metric: 'imIncubatorTwoHum',
    }
  ];
};
