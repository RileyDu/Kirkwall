import {
    Box,
    Heading,
    Grid,
    GridItem,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const CssTrial = () => {
    const cardBg = useColorModeValue('gray.500', 'gray.800');
    const cardShadow = useColorModeValue('md', 'dark-lg');
  
    const [data, setData] = useState([]);
  
    useEffect(() => {
      const fetchSensorData = async () => {
        try {
          const response = await axios.get('/api/mockdata/css');
          setData(response.data);
          console.log('Fetched BME280 data:', response.data);
        } catch (error) {
          console.error('Error fetching BME280 data:', error);
        }
      };
  
      fetchSensorData();
    }, []);
  
    const chartLabels = data.map((item) => {
      const date = new Date(item.recorded_at);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${hours}:${minutes} (${day}/${month})`;
    });
  
    const variableMapping = {
      temperature_celsius: { label: 'Temperature (°C)', color: 'rgba(230, 25, 75, 0.8)' },
      pressure_hpa: { label: 'Pressure (hPa)', color: 'rgba(60, 180, 75, 0.8)' },
      altitude_meters: { label: 'Altitude (m)', color: 'rgba(67, 99, 216, 0.8)' },
      humidity_percent: { label: 'Humidity (%)', color: 'rgba(255, 225, 25, 0.8)' },
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: {
          ticks: { color: 'white', autoSkip: true, maxTicksLimit: 10 },
          title: { display: true, text: 'Timestamp', color: 'white' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
        y: {
          ticks: { color: 'white' },
          title: { display: true, text: 'Value', color: 'white' },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
        },
      },
    };
  
    return (
      <Box mx="auto" mt={24} mb={12} px={4} display="flex" flexDirection="column" alignItems="center">
        <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
          CubeSatSim Sensor Readings
        </Heading>
  
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap={6}
          width="80%"
        >
          {Object.keys(variableMapping).map((key) => {
            const dataset = {
              labels: chartLabels,
              datasets: [
                {
                  label: variableMapping[key].label,
                  data: data.map((item) => parseFloat(item[key])),
                  borderColor: variableMapping[key].color,
                  backgroundColor: variableMapping[key].color.replace('0.8', '0.2'),
                },
              ],
            };
  
            return (
              <GridItem
                key={key}
                bg={cardBg}
                p={4}
                shadow={cardShadow}
                borderRadius="md"
              >
                <Heading size="md" mb={2} textAlign="center" color="white">
                  {variableMapping[key].label}
                </Heading>
                <Line data={dataset} options={options} />
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    );
  };
  
  export default CssTrial;
  