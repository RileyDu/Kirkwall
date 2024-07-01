import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Spinner,
  useMediaQuery,
  Flex,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './Frontend/AuthComponents/AuthContext';
import ProtectedRoute from './Frontend/AuthComponents/ProtectedRoute';
import SignUp from './Frontend/AuthComponents/Signup';
import Login from './Frontend/AuthComponents/Login';
import Header from './Frontend/Header/Header';
import Sidebar from './Frontend/Sidebar/Siderbar';
import MainContent from './Frontend/Main/Main';
import TempSensors from './Frontend/Sensors/TempSensors/TempSensors';
import SensorsMain from './Frontend/Sensors/SensorsMain/SensorsMain';
import HumiditySensors from './Frontend/Sensors/HumiditySensors/HumiditySensors';
import SoilSensors from './Frontend/Sensors/SoilSensors/SoilSensors';
import RainSensors from './Frontend/Sensors/RainSensors/RainSensors';
import WindSensors from './Frontend/Sensors/WindSensors/WindSensor';
import MobileMenu from './Frontend/MobileMenu/MobileMenu';
import customTheme from './Frontend/Styles/theme';
import { getWeatherData } from './Backend/Graphql_helper';
import { WeatherDataProvider } from './Frontend/WeatherDataContext';
import { FaChessRook } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

const Layout = ({
  children,
  isMinimized,
  toggleSidebar,
  isMobileMenuOpen,
  toggleMobileMenu,
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <Flex minH="100vh">
      {isLargerThan768 && shouldShowSidebar && (
        <Sidebar
          isMinimized={isMinimized}
          toggleSidebar={toggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
        />
      )}
      <Box
        flex="1"
        overflowY="auto"
        ml={
          isLargerThan768 && shouldShowSidebar
            ? isMinimized
              ? '80px'
              : '250px'
            : '0'
        }
      >
        {children}
      </Box>
    </Flex>
  );
};

const MainApp = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState(37); // Default time period
  const location = useLocation();

  const toggleSidebar = () => setIsMinimized(!isMinimized);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // const adjustTimePeriod = adjustment => {
  //   setTimePeriod(prevTimePeriod => {
  //     const newTimePeriod = prevTimePeriod + adjustment;
  //     // Ensure the time period doesn't go below 60 minutes
  //     return newTimePeriod < 13 ? 13 : newTimePeriod;
  //   });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeatherData('all', timePeriod);
        if (Array.isArray(response.data.weather_data)) {
          setWeatherData(response.data.weather_data);
        } else {
          setWeatherData([]);
          console.error('Fetched weather data is not an array');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherData([]);
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    

    return () => clearInterval(intervalId);
  }, [timePeriod]);


  const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
if (loading) {

return (
  <Flex justify="center" align="center" height="100vh" width="100vw">
  <Box
    as={FaChessRook}
    animation={`${spin} infinite 2s linear`}
    fontSize="6xl"
    color="black"
  />
  {/* <Text mt="4" fontSize="lg" color="teal.500">
    Loading...
  </Text> */}
</Flex>
);
}

  return (
    <Box>
      {location.pathname !== '/login' && location.pathname !== '/signup' && (
        <Header toggleMobileMenu={toggleMobileMenu} />
      )}
      <Layout
        isMinimized={isMinimized}
        toggleSidebar={toggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      >
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainContent
                  weatherData={weatherData}
                  isMinimized={isMinimized}
                  timePeriod={timePeriod}
                  // adjustTimePeriod={adjustTimePeriod}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TempSensors"
            element={
              <ProtectedRoute>
                <TempSensors weatherData={weatherData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/HumiditySensors"
            element={
              <ProtectedRoute>
                <HumiditySensors weatherData={weatherData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SoilMoistureSensors"
            element={
              <ProtectedRoute>
                <SoilSensors weatherData={weatherData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WindSensors"
            element={
              <ProtectedRoute>
                <WindSensors weatherData={weatherData} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RainSensors"
            element={
              <ProtectedRoute>
                <RainSensors weatherData={weatherData} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={toggleMobileMenu} />
    </Box>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={customTheme}>
      <Router>
        <AuthProvider>
          <WeatherDataProvider>
            <MainApp />
          </WeatherDataProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
