import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { getWeatherData } from '../../Backend/Graphql_helper';
import { theme } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TempBarGraph() {
  const [weatherData, setWeatherData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getWeatherData();
      setWeatherData(response.data.weather_data);
    } catch (err) {
      console.error('Failed to fetch weather data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const convertUnixToCST = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const options = {
      timeZone: 'America/Chicago',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const temperatureData = weatherData.map((dataPoint) => dataPoint.temperature);
  const maxTemp = Math.max(...temperatureData);
  const minTemp = Math.min(...temperatureData);

  const data = {
    labels: weatherData.map((dataPoint) => convertUnixToCST(dataPoint.ts)),
    datasets: [
      {
        label: 'Temperature',
        data: weatherData.map((dataPoint) => dataPoint.temperature),
        backgroundColor: 'rgba(0,163, 0,0.4)',
        borderColor: 'black',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: minTemp - 3,
        max: maxTemp + 3,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature (Fahrenheit)',
      },
    },
  };

  return <Bar data={data} options={options} />;
}
