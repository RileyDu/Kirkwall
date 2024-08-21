import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Spinner,
  useMediaQuery,
  Flex,
  useColorMode,
  IconButton
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
import TempSensors from './Frontend/Sensors/TempSensors/TempSensors.js';
import HumiditySensors from './Frontend/Sensors/HumiditySensors/HumiditySensors.js';
import SoilSensors from './Frontend/Sensors/SoilSensors/SoilSensors.js';
import RainSensors from './Frontend/Sensors/RainSensors/RainSensors.js';
import WindSensors from './Frontend/Sensors/WindSensors/WindSensor.js';
import MobileMenu from './Frontend/MobileMenu/MobileMenu.js';
import customTheme from './Frontend/Styles/theme.js';
import { WeatherDataProvider } from './Frontend/WeatherDataContext.js';
import { FaChessRook, FaQuestion, FaEllipsisV } from 'react-icons/fa';
import { keyframes } from '@emotion/react';
import WatchdogSensors from './Frontend/Sensors/WatchdogSensors/WatchdogSensors.js';
import RivercitySensors from './Frontend/Sensors/RivercitySensors/RiverycitySensors.js';
import MapComponent from './Frontend/Maps/KirkwallMap.js';
import LandingPage from './Frontend/LandingPage/LandingPage.js';
import ImpriMedMap from './Frontend/Maps/ImpriMedMap.js';
import GrandFarmMap from './Frontend/Maps/GrandFarmMap.js';
import RJMap from './Frontend/Maps/RJMap.js';
import WatchdogProtectMap from './Frontend/Maps/WatchdogMap.js';
import { motion } from 'framer-motion';
import HelpModal from './Frontend/Modals/HelpModal.js';
import OptionsModal from './Frontend/Modals/OptionsModal.js';
import ModularDashboard from './Frontend/Modular/ModularDashboard.js';

const Layout = ({
  children,
  isMinimized,
  toggleSidebar,
  isMobileMenuOpen,
  toggleMobileMenu,
  statusOfAlerts,
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== '/login' &&
    location.pathname !== '/signup' &&
    location.pathname !== '/landing';

  const { colorMode } = useColorMode();

  const MotionIconButton = motion(IconButton);

  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const handleOpenHelpModal = () => setHelpModalOpen(true);
  const handleCloseHelpModal = () => setHelpModalOpen(false);

  return (
    <Flex
      minH="100vh"
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      overflowX={'hidden'}
    >
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
        mt={!isLargerThan768 && shouldShowSidebar && '0'}
      >
        {children}
      </Box>

      <MotionIconButton
        icon={<FaEllipsisV />}
        variant="outline"
        color="#212121"
        height={10}
        width={10}
        bg={'brand.400'}
        _hover={{ bg: 'brand.800' }}
        border={'2px solid #fd9801'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        ml={2}
        onClick={handleOpenHelpModal}
        position="fixed"
        bottom="20px"
        left="20px"
        zIndex="1000"
      />

        
      
      <HelpModal isOpen={isHelpModalOpen} onClose={handleCloseHelpModal} />
    </Flex>
  );
};

const MainApp = () => {
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
      {location.pathname !== '/login' &&
        location.pathname !== '/signup' &&
        location.pathname !== '/landing' && (
          <Header
            toggleMobileMenu={toggleMobileMenu}
            isMinimized={isMinimized}
            isVisible={showAlerts}
            toggleAlerts={toggleAlerts}
          />
        )}
      <Layout
        isMinimized={isMinimized}
        toggleSidebar={toggleSidebar}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        statusOfAlerts={showAlerts}
      >
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ModularDashboard statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TempSensors"
            element={
              <ProtectedRoute>
                <TempSensors statusOfAlerts={showAlerts} />
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
                <SoilSensors />
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
                <WatchdogSensors statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RivercitySensors"
            element={
              <ProtectedRoute>
                <RivercitySensors statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapComponent statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/imprimed/map"
            element={
              <ProtectedRoute
                allowedUsers={['jerrycromarty@imprimedicine.com']}
              >
                <ImpriMedMap statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grandfarm/map"
            element={
              <ProtectedRoute allowedUsers={['pmo@grandfarm.com']}>
                <GrandFarmMap statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rjenergy/map"
            element={
              <ProtectedRoute allowedUsers={['russell@rjenergysolutions.com']}>
                <RJMap statusOfAlerts={showAlerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchdogprotect/map"
            element={
              <ProtectedRoute allowedUsers={['trey@watchdogprotect.com']}>
                <WatchdogProtectMap statusOfAlerts={showAlerts} />
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
