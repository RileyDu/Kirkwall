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
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './Frontend/AuthComponents/ProtectedRoute';
import SignUp from './Frontend/AuthComponents/Signup';
import Login from './Frontend/AuthComponents/Login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './Backend/Firebase';
import Header from './Frontend/Header/Header';



const customTheme = extendTheme({
  colors: {
    navy: '#001f3f',
    black: '#000000',
    green: '#00a300',
    white: '#ffffff',
  },
  fonts: {
    heading: 'Oswald, sans-serif',
    body: 'Oswald, sans-serif',
  },
});

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

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
      <Router>
        <AuthProvider>
          <Box>
            <Header />
            <Flex>
              <Routes>
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      {isLargerThan768 && <Sidebar />}
                      <MainContent weatherData={weatherData} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Flex>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};



const Sidebar = () => (
  <Box bg="black" color="white" w="250px" minH="100vh" p="4">
    <Box mb="4">Sensor Categories</Box>
    <Box _hover={{ color: 'green' }} mb="2">
      Temperature Sensors
    </Box>
    <Box _hover={{ color: 'green' }} mb="2">
      Humidity Sensors
    </Box>
    <Box _hover={{ color: 'green' }} mb="2">
      Soil Moisture Sensors
    </Box>
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
  <Box
    border="1px"
    borderColor="green"
    borderRadius="md"
    p="6"
    bg="white"
    h="500px"
    w="100%"
  >
    <Flex justify="space-between" mb="4">
      <Box fontSize="lg" fontWeight="bold">
        {title}
      </Box>
      <Flex>
        <Tooltip label="Customize">
          <IconButton
            icon={<FaCog />}
            variant="outline"
            colorScheme="green"
            size="sm"
            mr="2"
          />
        </Tooltip>
        <Tooltip label="Help">
          <IconButton
            icon={<FaQuestionCircle />}
            variant="outline"
            colorScheme="navy"
            size="sm"
          />
        </Tooltip>
      </Flex>
    </Flex>
    {children}
  </Box>
);

export default App;
