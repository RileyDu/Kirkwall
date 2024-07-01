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

// Process weather data function now takes color mode as a parameter
const processWeatherData = (data, key, colorMode) => {
  if (!data) return null;
  
  const getColorOfLastValue = (colorMode) => {
    return colorMode === 'light' ? '#212121' : 'white';
  };

  const reversedData = [...data].reverse();

  const chartData = {
    labels: reversedData.map(item =>
      new Date(item.message_timestamp).toLocaleTimeString([], {
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

const createCustomChartOptions = (metric, dataKey) => {
  const { min, max } = getMinMax(dataKey);
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
        },
      },
      y: {
        min: min > 1 ? min - 1 : min,
        max: max + 1,
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
              'temperature': '°F',
              'percent_humidity': '% Humidity',
              'rain_15_min_inches': 'inches',
              'wind_speed': 'MPH'
            };
            const label = labelMap[metric] || '';
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
  const { colorMode } = useColorMode();  // Get color mode here
  const chartData = processWeatherData(data, metric, colorMode);
  if (!chartData) return <Spinner size="xl" />;

  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey);

  return (
    <Box h="100%" w="100%">
      <Line data={chartData} options={options} />
    </Box>
  );
};

export const BarChart = ({ data, metric }) => {
  const { colorMode } = useColorMode();  // Get color mode here
  const chartData = processWeatherData(data, metric, colorMode);
  if (!chartData) return <Spinner size="xl" />;

  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey);

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};
