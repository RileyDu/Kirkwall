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
        borderColor: '#fd9801',
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
        min: min - 1,
        max: max + 1,
        title: {
          display: true,
          text: metric === 'temperature' ? 'Temperature (°F)' : metric,
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
        text: `${metric.charAt(0).toUpperCase() + metric.slice(1)} Over Time`,
      },
    },
  };
};

export const LineChart = ({ data, metric }) => {
  const chartData = processWeatherData(data, metric);
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
  const chartData = processWeatherData(data, metric);
  if (!chartData) return <Spinner size="xl" />;

  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey);

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};

// export const PieChart = ({ data, metric }) => {
//   const chartData = processWeatherData(data, metric);
//   if (!chartData) return <Spinner size="xl" />;

//   // Pie charts generally don't use scales, so default options can be applied here
//   return (
//     <Box h="100%" w="100%">
//       <Pie data={chartData} options={defaultChartOptions} />
//     </Box>
//   );
// };
