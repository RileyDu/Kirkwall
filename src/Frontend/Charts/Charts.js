import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Box, Spinner, useColorMode } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const processWeatherData = (data, key, colorMode) => {
  if (!data) return null;

  const getColorOfLastValue = (colorMode) => {
    return colorMode === 'light' ? '#212121' : 'white';
  };

  const reversedData = [...data].reverse();

  const chartData = {
    labels: reversedData.map(item =>
      new Date(item.message_timestamp || item.reading_time || item.publishedat).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    ),
    datasets: [
      {
        label: key,
        data: reversedData.map(item => item[key]),
        backgroundColor: '#fd9801',
        borderColor: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? getColorOfLastValue(colorMode) : '#fd9801'
        ),
        borderWidth: 2,
        pointBackgroundColor: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? getColorOfLastValue(colorMode) : '#fd9801'
        ),
        pointRadius: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? 5 : 3
        ),
      },
    ],
  };
  return chartData;
};

const getMinMax = (data) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { min, max };
};

const createCustomChartOptions = (metric, data, colorMode) => {
  const { min, max } = getMinMax(data);
  const labelColor = colorMode === 'light' ? '#000000' : '#FFFFFF';
  const gridLineColor = colorMode === 'light' ? '#e0e0e0' : '#333333'; // Set grid line color based on color mode
  const getYmin = (min, max) => {
    if (min > 0) {
      return Math.round(min - 1);
    } else if (min < 0) {
      return Math.round(min - 1);
    } else if (max > 0) {
      return Math.round(min - 1);
  };
  }
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
          color: labelColor,  // Set label color based on color mode
        },
        grid: {
          color: gridLineColor, // Set grid line color
        },
      },
      y: {
        min: getYmin(min, max),
        max: max > 1 ? Math.round(max + 1) : Math.round(max + .5),
        ticks: {
          color: labelColor,  // Set label color based on color mode
        },
        grid: {
          color: gridLineColor, // Set grid line color
        },
        title: {
          display: false,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#212121',
        titleFont: { size: 16 },
        titleColor: '#ffffff',
        bodyFont: { size: 16 },
        bodyColor: '#ffffff',
        footerFont: { size: 12 },
        footerColor: '#ffffff',
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const labelMap = {
              temperature: '°F',
              temp: '°F',
              rctemp: '°F',
              impriTemp: '°C',
              imFreezerOneTemp: '°C',
              imFreezerTwoTemp: '°C',
              imFreezerThreeTemp: '°C',
              imFridgeOneTemp: '°C',
              imFridgeTwoTemp: '°C',
              imIncubatorOneTemp: '°C',
              imIncubatorTwoTemp: '°C',
              imFreezerOneHum: '% Humidity',
              imFreezerTwoHum: '% Humidity',
              imFreezerThreeHum: '% Humidity',
              imFridgeOneHum: '% Humidity',
              imFridgeTwoHum: '% Humidity',
              imIncubatorOneHum: '% Humidity',
              imIncubatorTwoHum: '% Humidity',
              hum: '% Humidity',
              percent_humidity: '% Humidity',
              humidity: '% Humidity',
              rain_15_min_inches: 'inches',
              wind_speed: 'MPH',
              soil_moisture: 'centibars',
              leaf_wetness: 'out of 15',
            };
            
            const label = labelMap[context.dataset.label] || '';
            const value = context.raw;
            return `${value} ${label}`;
          }
          
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };
};

export const LineChart = ({ data, metric }) => {
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, colorMode);
  if (!chartData) return <Spinner size="xl" />;
  // console.log('chartData:', chartData);
  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey, colorMode);

  return (
    <Box h="100%" w="100%">
      <Line data={chartData} options={options} />
    </Box>
  );
};

export const BarChart = ({ data, metric }) => {
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, colorMode);
  if (!chartData) return <Spinner size="xl" />;
  // console.log('chartData:', chartData);

  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey, colorMode);

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};
