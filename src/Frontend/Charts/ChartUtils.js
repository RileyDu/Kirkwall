// utils/chartUtils.js
export const handleChartChange = setChartType => newType => {
  setChartType(newType);
};

export const getThresholds = (weatherData, metric) => {
  if (!weatherData || weatherData.length === 0) return { high: '', low: '' };

  const latestData = weatherData[0]; // Assuming weatherData is sorted and latest data is first
  switch (metric) {
    case 'temperature':
      return {
        high: latestData.temperature_high_threshold || '',
        low: latestData.temperature_low_threshold || '',
      };
    case 'rain_15_min_inches':
      return {
        high: latestData.rain_15_min_inches_high_threshold || '',
        low: latestData.rain_15_min_inches_low_threshold || '',
      };
    case 'percent_humidity':
      return {
        high: latestData.percent_humidity_high_threshold || '',
        low: latestData.percent_humidity_low_threshold || '',
      };
    case 'wind_speed':
      return {
        high: latestData.wind_speed_high_threshold || '',
        low: latestData.wind_speed_low_threshold || '',
      };
    case 'leaf_wetness':
      return {
        high: latestData.leaf_wetness_high_threshold || '',
        low: latestData.leaf_wetness_low_threshold || '',
      };
    case 'soil_moisture':
      return {
        high: latestData.soil_moisture_high_threshold || '',
        low: latestData.soil_moisture_low_threshold || '',
      };
    case 'temp':
      return {
        high: latestData.temp_low_threshold || '',
        low: latestData.temp_high_threshold || '',
      };
    case 'hum':
      return {
        high: latestData.hum_low_threshold || '',
        low: latestData.hum_high_threshold || '',
      };
    case 'rctemp':
      return {
        high: latestData.rctemp_low_threshold || '',
        low: latestData.rctemp_high_threshold || '',
      };
    case 'humidity':
      return {
        high: latestData.humidity_low_threshold || '',
        low: latestData.humidity_high_threshold || '',
      };
    default:
      return { high: '', low: '' };
  }
};
