import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Box, Spinner } from '@chakra-ui/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const processWeatherData = (data, key) => {
  if (!data) return null;

  const reversedData = [...data].reverse();

  const chartData = {
    labels: reversedData.map(item => new Date(item.message_timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: key,
        data: reversedData.map(item => item[key]),
        backgroundColor: 'rgba(0,163,0,0.4)',
        borderColor: 'rgba(0,163,0,1)',
        borderWidth: 1,
        pointBackgroundColor: reversedData.map((item, index) => 
          index === reversedData.length - 1 ? 'red' : 'rgba(0,163,0,1)'
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
};

const temperatureChartOptions = {
  ...defaultChartOptions,
  scales: {
    ...defaultChartOptions.scales,
    y: {
      ...defaultChartOptions.scales.y,
      min: 40,
      max: 80,
    },
  },
};

export const LineChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;
  
  const options = metric === 'temperature' ? temperatureChartOptions : defaultChartOptions;

  return (
    <Box h="100%" w="100%">
      <Line data={chartData} options={options} />
    </Box>
  );
};

export const BarChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;
  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={defaultChartOptions} />
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
