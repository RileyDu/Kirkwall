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

import { AuthProvider } from './Frontend/AuthComponents/AuthContext.js';
import ProtectedRoute from './Frontend/AuthComponents/ProtectedRoute.js';
import SignUp from './Frontend/AuthComponents/Signup.js';
import Login from './Frontend/AuthComponents/Login.js';
import Header from './Frontend/Header/Header.js';
import Sidebar from './Frontend/Sidebar/Siderbar.js';
import MainContent from './Frontend/Main/Main.js';
import TempSensors from './Frontend/Sensors/TempSensors/TempSensors.js';
import HumiditySensors from './Frontend/Sensors/HumiditySensors/HumiditySensors.js';
import SoilSensors from './Frontend/Sensors/SoilSensors/SoilSensors.js';
import RainSensors from './Frontend/Sensors/RainSensors/RainSensors.js';
import WindSensors from './Frontend/Sensors/WindSensors/WindSensor.js';
import MobileMenu from './Frontend/MobileMenu/MobileMenu.js';
import customTheme from './Frontend/Styles/theme.js';
import { WeatherDataProvider } from './Frontend/WeatherDataContext.js';
import { FaChessRook } from 'react-icons/fa/index.esm.js';
import { keyframes } from '@emotion/react';
import WatchdogSensors from './Frontend/Sensors/WatchdogSensors/WatchdogSensors.js';
import RivercitySensors from './Frontend/Sensors/RivercitySensors/RiverycitySensors.js';
import MapComponent from './Frontend/Maps/KirkwallMap.js';
import LandingPage from './Frontend/LandingPage/LandingPage.js';
import ImpriMedMap from './Frontend/Maps/ImpriMedMap.js';
import GrandFarmDashboard from './Frontend/Clients/GrandFarm/GrandFarm.js';
import MedDashboard from './Frontend/Clients/ImpriMed/MedDashboard.js';
import GrandFarmMap from './Frontend/Maps/GrandFarmMap.js';
import RJDashboard from './Frontend/Clients/RjEnergy/RjDashboard.js';
import RJMap from './Frontend/Maps/RJMap.js';
import WatchDogProtectDashboard from './Frontend/Clients/WatchDogProtect/WatchDogProtectDashboard.js';
import WatchdogProtectMap from './Frontend/Maps/WatchdogMap.js';

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
        mt={!isLargerThan768 && shouldShowSidebar ? '70px' : '0'}
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
  const [showAlerts, setShowAlerts] = useState(false);
  




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
            <ProtectedRoute allowedUsers={['jerrycromarty@imprimedicine.com']} >
              <MedDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route path="/grandfarm" element={
            <ProtectedRoute allowedUsers={['pmo@grandfarm.com']}>
              <GrandFarmDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route path='/rjenergy' element={
            <ProtectedRoute allowedUsers={['russell@rjenergysolutions.com']}>
              <RJDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route path='/watchdogprotect' element={
            <ProtectedRoute allowedUsers={['trey@watchdogprotect.com']}>
              <WatchDogProtectDashboard statusOfAlerts={showAlerts} isMinimized={isMinimized}/>
            </ProtectedRoute>
          }/>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']} redirectPaths={{'jerrycromarty@imprimedicine.com' : '/imprimed', 'pmo@grandfarm.com' : '/grandfarm', 'russell@rjenergysolutions.com' :'/rjenergy', 'trey@watchdogprotect.com' : '/watchdogprotect' }}>
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
        <Route
          path="/rjenergy/map"
          element={
            <ProtectedRoute allowedUsers={['russell@rjenergysolutions.com']}>
              <RJMap statusOfAlerts={showAlerts}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchdogprotect/map"
          element={
            <ProtectedRoute allowedUsers={['trey@watchdogprotect.com']}>
              <WatchdogProtectMap statusOfAlerts={showAlerts}/>
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
