import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Tooltip,
  Spinner,
  extendTheme,
  Button,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaCog, FaQuestionCircle, FaUserCircle, FaBars } from 'react-icons/fa';
import { LineChart, BarChart } from './Frontend/Charts'; 
import { getWeatherData } from './Backend/Graphql_helper'; 

const customTheme = extendTheme({
  colors: {
    navy: '#001f3f',
    black: '#000000',
    green: '#00a300',
    white: '#ffffff',
  },
});

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData();
        setWeatherData(response.data.weather_data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  return (
    <ChakraProvider theme={customTheme}>
      <Box>
        <Header />
        <Flex>
          {isLargerThan768 && <Sidebar />}
          <MainContent weatherData={weatherData} />
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

const Header = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  return (
    <Flex bg="navy" color="white" px="4" py="2" align="center" justify="space-between" position="sticky" top="0" zIndex="1000">
      <Box as="span" fontSize="lg" fontWeight="bold">Logo</Box>
      {isLargerThan768 ? (
        <Flex>
          <Box mx="2" _hover={{ color: 'green', textDecoration: 'underline' }}>Home</Box>
          <Box mx="2" _hover={{ color: 'green', textDecoration: 'underline' }}>Sensors</Box>
          <Box mx="2" _hover={{ color: 'green', textDecoration: 'underline' }}>Reports</Box>
        </Flex>
      ) : (
        <IconButton icon={<FaBars />} bg="transparent" aria-label="Menu" />
      )}
      <Box>
        <IconButton icon={<FaUserCircle />} bg="transparent" aria-label="User Profile" />
      </Box>
    </Flex>
  );
};

const Sidebar = () => (
  <Box
    bg="black"
    color="white"
    w="250px"
    minH="100vh"
    p="4"
  >
    <Box mb="4">Sensor Categories</Box>
    <Box _hover={{ color: 'green' }} mb="2">Temperature Sensors</Box>
    <Box _hover={{ color: 'green' }} mb="2">Humidity Sensors</Box>
    <Box _hover={{ color: 'green' }} mb="2">Soil Moisture Sensors</Box>
  </Box>
);

const MainContent = ({ weatherData }) => (
  <Box bg="white" flex="1" p="4">
    <Grid templateColumns="repeat(2, 1fr)" gap="6">
      <GridItem colSpan={1}>
        <ChartWrapper title="Temperature Over Time">
          <LineChart data={weatherData} metric="temperature" />
        </ChartWrapper>
      </GridItem>
      <GridItem colSpan={1}>
        <ChartWrapper title="Humidity Levels">
          <BarChart data={weatherData} metric="humidity" />
        </ChartWrapper>
      </GridItem>
      <GridItem colSpan={1}>
        <ChartWrapper title="Rainfall (15 min)">
          <BarChart data={weatherData} metric="rain_15_min_inches" />
        </ChartWrapper>
      </GridItem>
      <GridItem colSpan={1}>
        <ChartWrapper title="Wind Speed">
          <LineChart data={weatherData} metric="wind_speed" />
        </ChartWrapper>
      </GridItem>
    </Grid>
  </Box>
);

const ChartWrapper = ({ title, children }) => (
  <Box border="1px" borderColor="green" borderRadius="md" p="6" bg="white" h="500px" w="100%">
    <Flex justify="space-between" mb="4">
      <Box fontSize="lg" fontWeight="bold">{title}</Box>
      <Flex>
        <Tooltip label="Customize">
          <IconButton icon={<FaCog />} variant="outline" colorScheme="green" size="sm" mr="2" />
        </Tooltip>
        <Tooltip label="Help">
          <IconButton icon={<FaQuestionCircle />} variant="outline" colorScheme="navy" size="sm" />
        </Tooltip>
      </Flex>
    </Flex>
    {children}
  </Box>
);

export default App;
