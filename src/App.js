import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Spinner,
  useMediaQuery,
  Flex,
  useColorMode
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
import WatchdogSensors from './Frontend/Sensors/WatchdogSensors/WatchdogSensors';
import RivercitySensors from './Frontend/Sensors/RivercitySensors/RiverycitySensors';
import MapComponent from './Frontend/Maps/Map';
import LandingPage from './Frontend/LandingPage/LandingPage';
import { useAuth } from './Frontend/AuthComponents/AuthContext';
import MedDashboard from './Frontend/ImpriMed/MedDashboard';
import ImpriMedMap from './Frontend/Maps/ImpriMedMap';
import GrandFarmDashboard from './Frontend/GrandFarm/GrandFarm';
import GrandFarmMap from './Frontend/Maps/GrandFarmMap';

const Layout = ({
  children,
  isMinimized,
  toggleSidebar,
  isMobileMenuOpen,
  toggleMobileMenu,
  statusOfAlerts
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/landing';

  const { colorMode } = useColorMode();

  return (
    <Flex minH="100vh" bg={colorMode === 'light' ? 'brand.50' : 'gray.700'} overflowX={'hidden'}>
      {isLargerThan768 && shouldShowSidebar && (
        <Sidebar
          isMinimized={isMinimized}
          toggleSidebar={toggleSidebar}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          statusOfAlerts={statusOfAlerts}
        />
      )}
      <Box
        flex="1"
        overflowY="auto"
        ml={
          isLargerThan768 && shouldShowSidebar
            ? isMinimized
              ? '100px'
              : '190px'
            : '0'
        }
        mt={!isLargerThan768 ? '70px' : '0'}
      >
        
        {children}
      </Box>
    </Flex>
  );
};

const MainApp = () => {
  // const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState(37); // Default time period
  const location = useLocation();
  const [showAlerts, setShowAlerts] = useState(true);
  




  const toggleAlerts = () => {
    setShowAlerts(!showAlerts);
  };
  const toggleSidebar = () => setIsMinimized(!isMinimized);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/landing' && (
        <Header toggleMobileMenu={toggleMobileMenu} isMinimized={isMinimized} isVisible={showAlerts} toggleAlerts={toggleAlerts}/>
      )}
      <Layout
        isMinimized={isMinimized}
        toggleSidebar={toggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        statusOfAlerts={showAlerts}
      >
        <Routes>
          <Route path='/landing' element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/imprimed" element={
            <ProtectedRoute allowedUsers={['jerrycromarty@imprimedicine.com']}>
              <MedDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route path="/grandfarm" element={
            <ProtectedRoute allowedUsers={['pmo@grandfarm.com']}>
              <GrandFarmDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainContent
                  isMinimized={isMinimized}
                  timePeriod={timePeriod}
                  statusOfAlerts={showAlerts}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TempSensors"
            element={
              <ProtectedRoute>
                <TempSensors statusOfAlerts={showAlerts}/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/HumiditySensors"
            element={
              <ProtectedRoute>
                <HumiditySensors statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SoilMoistureSensors"
            element={
              <ProtectedRoute>
                <SoilSensors  />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WindSensors"
            element={
              <ProtectedRoute>
                <WindSensors statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RainSensors"
            element={
              <ProtectedRoute>
                <RainSensors statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WatchdogSensors"
            element={
              <ProtectedRoute>
                <WatchdogSensors statusOfAlerts={showAlerts}  />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/RivercitySensors"
            element={
              <ProtectedRoute>
                <RivercitySensors statusOfAlerts={showAlerts}  />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapComponent statusOfAlerts={showAlerts}/>
              </ProtectedRoute>
            }
          />
          <Route
          path="/imprimed/map"
          element={
            <ProtectedRoute allowedUsers={['jerrycromarty@imprimedicine.com']}>
              <ImpriMedMap statusOfAlerts={showAlerts}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/grandfarm/map"
          element={
            <ProtectedRoute allowedUsers={['pmo@grandfarm.com']}>
              <GrandFarmMap statusOfAlerts={showAlerts}/>
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
