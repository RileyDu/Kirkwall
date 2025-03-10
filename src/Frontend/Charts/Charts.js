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
  Filler
} from 'chart.js';
import { Box, Spinner, useColorMode } from '@chakra-ui/react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

// Helper function to process data for chart
// Set the parameters for chart.js
const processWeatherData = (data, key, colorMode) => {
  if (!data) return null;

  const getColorOfLastValue = colorMode => {
    return colorMode === 'light' ? '#212121' : '#cee8ff';
  };

  const reversedData = [...data].reverse();

  const labels = reversedData.map(item => {
    let date = new Date(item.message_timestamp || item.reading_time || item.publishedat || item.last_communication_date);

    if (item.reading_time || item.publishedat) {
      date.setHours(date.getHours() + 5);
    }

    if (item.last_communication_date) {
      date.setHours(date.getHours() - 5);
    }

    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  // Special case for bathroom sensor: return two datasets (temperature & humidity)
  if (key === 'monnit_bathroom') {
    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°F)',
          data: reversedData.map(item => item.temperature),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 3,
          yAxisID: 'y-temp',
        },
        {
          label: 'Humidity (%)',
          data: reversedData.map(item => item.humidity),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 3,
          yAxisID: 'y-humidity',
        }
      ]
    };
  }

  // Default behavior for all other sensors
  return {
    labels,
    datasets: [
      {
        label: key,
        data: reversedData.map(item => item[key]),
        backgroundColor: '#4d648d80',
        borderColor: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? getColorOfLastValue(colorMode) : '#4d648d'
        ),
        borderWidth: 2,
        pointBackgroundColor: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? getColorOfLastValue(colorMode) : '#4d648d'
        ),
        pointRadius: reversedData.map((item, index) => (index === reversedData.length - 1 ? 5 : 3)),
        fill: 'start',
      },
    ],
  };
};


// Helper function to get the min and max values of the data
const getMinMax = data => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return { min, max };
};

// Helper function to create custom chart options
const createCustomChartOptions = (metric, data, colorMode) => {
  const { min, max } = getMinMax(data);
  const labelColor = colorMode === 'light' ? '#000000' : '#FFFFFF';
  const gridLineColor = colorMode === 'light' ? 'whitesmoke' : '#333333';

  if (metric === 'monnit_bathroom') {
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
            color: labelColor,
          },
          grid: {
            color: gridLineColor,
          },
        },
        'y-temp': {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°F)',
          },
          grid: {
            color: gridLineColor,
          },
        },
        'y-humidity': {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Humidity (%)',
          },
          grid: {
            drawOnChartArea: false,
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
          displayColors: true,
        },
        legend: {
          display: true,
        },
      },
    };
  }

  // Default settings for all other graphs
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
          color: labelColor,
        },
        grid: {
          color: gridLineColor,
        },
      },
      y: {
        min: min - 1,
        max: max + 1,
        ticks: {
          color: labelColor,
        },
        grid: {
          color: gridLineColor,
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
        displayColors: true,
      },
      legend: {
        display: false,
      },
    },
  };
};


// LineChart and BarChart components
// These components take in data and metric as props
// These are what are actually rendered in the app
export const LineChart = ({ data, metric }) => {
  // console.log('data:', data);
  console.log('metric:', metric);
  const { colorMode } = useColorMode();
  const chartData = processWeatherData(data, metric, colorMode);
  if (!chartData) return <Spinner size="xl" />;
  console.log('chartData:', chartData);
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
  console.log('chartData:', chartData);

  const dataKey = chartData.datasets[0].data;
  const options = createCustomChartOptions(metric, dataKey, colorMode);

  return (
    <Box h="100%" w="100%">
      <Bar data={chartData} options={options} />
    </Box>
  );
};
