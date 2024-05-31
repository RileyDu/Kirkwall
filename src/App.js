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




export default App;
