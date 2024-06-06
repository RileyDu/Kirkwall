import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Flex,
  Spinner,
  useMediaQuery,
} from '@chakra-ui/react';

import { getWeatherData } from './Backend/Graphql_helper';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Frontend/AuthComponents/AuthContext';
import ProtectedRoute from './Frontend/AuthComponents/ProtectedRoute';
import SignUp from './Frontend/AuthComponents/Signup';
import Login from './Frontend/AuthComponents/Login';
import Header from './Frontend/Header/Header';
import customTheme from './Frontend/Styles/theme';
import Sidebar from './Frontend/Sidebar/Siderbar';
import MainContent from './Frontend/Main/Main';
import TempSensors from './Frontend/Sensors/TempSensors/TempSensors';
import SensorsMain from './Frontend/Sensors/SensorsMain/SensorsMain';
import HumiditySensors from './Frontend/Sensors/HumiditySensors/HumiditySensors';
import SoilSensors from './Frontend/Sensors/SoilSensors/SoilSensors';
import WindSensors from './Frontend/Sensors/WindSensors/WindSensor';
import RainSensors from './Frontend/Sensors/RainSensors/RainSensors';

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

    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
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
            <Flex minH="100vh">
              {isLargerThan768 && <Sidebar />}
              <Box flex="1" overflowY="auto" ml={isLargerThan768 ? '250px' : '0'} >
                <Routes>
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <MainContent weatherData={weatherData} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/Sensors"
                    element={
                      <ProtectedRoute>
                        <SensorsMain />
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
              </Box>
            </Flex>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
