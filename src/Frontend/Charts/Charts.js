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

  const chartData = {
    labels: reversedData.map(item => {
      const timestamp = item.message_timestamp || item.reading_time || item.publishedat;
      // Convert to UTC if the timestamp does not contain a timezone
      const date = timestamp.includes("Z") || timestamp.includes("+") ? new Date(timestamp) : new Date(`${timestamp}Z`);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }),
    datasets: [
      {
        label: key,
        data: reversedData.map(item => item[key]),
        backgroundColor: '#4d648d80',
        borderColor: reversedData.map((item, index) =>
          index === reversedData.length - 1
            ? getColorOfLastValue(colorMode)
            : '#4d648d'
        ),
        borderWidth: 2,
        // borderRadius: 30,
        pointBackgroundColor: reversedData.map((item, index) =>
          index === reversedData.length - 1
            ? getColorOfLastValue(colorMode)
            : '#4d648d'
        ),
        pointRadius: reversedData.map((item, index) =>
          index === reversedData.length - 1 ? 5 : 3
        ),
        // cubicInterpolationMode: 'monotone', // Add this line to enable smooth curves
        // tension: 0.4,
        fill: 'start',
      },
    ],
  };
  return chartData;
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
  const gridLineColor = colorMode === 'light' ? 'whitesmoke' : '#333333'; // Set grid line color based on color mode

  // Helper function to set the y-axis min value
  const getYmin = (min, max) => {
    if (min > 0 && max > 1) {
      return Math.round(min - 1);
    } else if (min < 0) {
      return Math.round(min - 1);
    } else if (min === 0 && max < 0.09) {
      return Math.round(min);
    } else if (min === 0 && max === 0) {
      return Math.round(min);
    } 
  };

  // Helper function to set the y-axis max value
  const getYmax = (min, max) => {
    if (min === 0 && max === 0) {
      return 1;
    } else if (min === 0 && max < 0.09) {
      return 0.1;
    } else if (max > 0) {
      return Math.round(max + 1);
    } else {
      return Math.round(max + 1);
    }
  };

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
          color: labelColor, // Set label color based on color mode
        },
        grid: {
          color: gridLineColor, // Set grid line color
        },
      },
      y: {
        min: getYmin(min, max),
        max: getYmax(min, max),
        ticks: {
          color: labelColor, // Set label color based on color mode
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
          },
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

// LineChart and BarChart components
// These components take in data and metric as props
// These are what are actually rendered in the app
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
