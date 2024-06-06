import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
import { Box, Spinner } from '@chakra-ui/react';

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

const processWeatherData = (data, key) => {
  if (!data) return null;

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
        borderColor: 'black',
        borderWidth: 1,
        pointBackgroundColor: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? 'red' : '#fd9801'
        ),
        pointRadius: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? 6 : 3
        ),
      },
    ],
  };
  return chartData;
};

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        maxRotation: 90,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: '#212121', // Background color
      titleFont: { size: 16 }, // Title font size
      titleColor: '#ffffff', // Title font color
      bodyFont: { size: 16 }, // Body font size
      bodyColor: '#ffffff', // Body font color
      footerFont: { size: 12 }, // Footer font size
      footerColor: '#ffffff', // Footer font color
      padding: 10, // Padding
      cornerRadius: 4, // Tooltip border radius
      displayColors: false, // Hide the color box in the tooltip
    },
  },
};

const humidityChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    tooltip: {
      ...defaultChartOptions.plugins.tooltip,
      callbacks: {
        label: function (context) {
          const label = '% Humidity'; // Hardcoded label
          const value = context.raw;
          return `${value}${label}`;
        },
      },
    },
  },
};

const rainfallChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    tooltip: {
      ...defaultChartOptions.plugins.tooltip,
      callbacks: {
        label: function (context) {
          const label = 'inches'; // Hardcoded label
          const value = context.raw;
          return `${value} ${label}`;
        },
      },
    },
  },
};

const windSpeedChartOptions = {
  ...defaultChartOptions,
  plugins: {
    ...defaultChartOptions.plugins,
    tooltip: {
      ...defaultChartOptions.plugins.tooltip,
      callbacks: {
        label: function (context) {
          const label = 'MPH'; // Hardcoded label
          const value = context.raw;
          return `${value} ${label}`;
        },
      },
    },
  },
};

const temperatureChartOptions = {
  ...defaultChartOptions,
  scales: {
    ...defaultChartOptions.scales,
    y: {
      ...defaultChartOptions.scales.y,
      min: 40,
      max: 90,
    },
  },
  plugins: {
    ...defaultChartOptions.plugins,
    tooltip: {
      ...defaultChartOptions.plugins.tooltip,
      callbacks: {
        label: function (context) {
          const label = '°F'; // Hardcoded label
          const value = context.raw;
          return `${value}${label}`;
        },
      },
    },
  },
};

export const LineChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;

  let options;
  switch (metric) {
    case 'temperature':
      options = temperatureChartOptions;
      break;
    case 'percent_humidity':
      options = humidityChartOptions;
      break;
    case 'rain_15_min_inches':
      options = rainfallChartOptions;
      break;
    case 'wind_speed':
      options = windSpeedChartOptions;
      break;
    default:
      options = defaultChartOptions;
  }

  return (
    <Box h="100%" w="100%">
      <Line data={chartData} options={options} />
    </Box>
  );
};

export const BarChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;

  let options;
  switch (metric) {
    case 'temperature':
      options = temperatureChartOptions;
      break;
    case 'percent_humidity':
      options = humidityChartOptions;
      break;
    case 'rain_15_min_inches':
      options = rainfallChartOptions;
      break;
    case 'wind_speed':
      options = windSpeedChartOptions;
      break;
    default:
      options = defaultChartOptions;
  }

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export const PieChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;
  return (
    <Box h="100%" w="100%">
      <Pie data={chartData} options={defaultChartOptions} />
    </Box>
  );
};
