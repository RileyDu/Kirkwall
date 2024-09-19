import React, { useState, useEffect, useRef } from 'react';
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
import FaqsModal from './Frontend/Modals/FaqsModal.js';
import ModularSummary from './Frontend/Modular/ModularSummary.js';
import RedirectBasedOnAuth from './Frontend/AuthComponents/RedirectBasedOnAuth.js';
import ThankYou from './Frontend/Alert/ThankYou.js';
import ThankYouAdmin from './Frontend/Alert/ThankYouAdmin.js';
import EnergyPage from './Frontend/Energy/EnergyPage.js';

const Layout = ({
  children,
  isMinimized,
  toggleSidebar,
  isMobileMenuOpen,
  toggleMobileMenu,
  statusOfAlerts,
  expandButtonRef,
  startTourButtonRef,
  runThresholdTour,
  setRunThresholdTour,
  // setIsTourRunning,
  // isTourRunning,
  // activeChartID,
  // setActiveChartID
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/landing';

  const { colorMode } = useColorMode();

  const MotionIconButton = motion(IconButton);

  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false); // State for OptionsModal
  const [isFaqsModalOpen, setFaqsModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false); 

  const handleOpenOptionsModal = () => setOptionsModalOpen(true);
  const handleCloseOptionsModal = () => setOptionsModalOpen(false);
  const handleOpenHelpModal = () => {
    setHelpModalOpen(true);
    handleCloseOptionsModal(); // Close the OptionsModal when opening the HelpModal
  };

  const handleOpenFaqsModal = () => {
    setFaqsModalOpen(true);
    setOptionsModalOpen(false); // Close OptionsModal when opening FaqsModal
  };
  const handleCloseHelpModal = () => setHelpModalOpen(false);
  const handleCloseFaqsModal = () => setFaqsModalOpen(false);

  const [runTour, setRunTour] = useState(false);


  return (
    <Flex
      minH="100vh"
      bg={colorMode === 'light' ? '#FFFFFF' : 'gray.700'}
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

      {shouldShowSidebar && (
        <>
      <MotionIconButton
        icon={<FaQuestion />}
        variant="outline"
        color="#212121"
        height={10}
        width={10}
        bg={'#cee8ff'}
        _hover={{ bg: '#3D5A80', color: 'white' }}
        border={'2px solid #3D5A80'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        ml={2}
        onClick={handleOpenOptionsModal}
        position="fixed"
        bottom="20px"
        left="20px"
        zIndex="1000"
      />

      <OptionsModal
        isOpen={isOptionsModalOpen}
        onClose={handleCloseOptionsModal}
        expandButtonRef={expandButtonRef}
        onContactUsClick={handleOpenHelpModal}
        onHelpClick={() => {
          handleCloseOptionsModal();
          setRunTour(true);
        }}
        onFaqsClick={handleOpenFaqsModal}
        startTourButtonRef={startTourButtonRef} 
        runThresholdTour={runThresholdTour}
        setRunThresholdTour={setRunThresholdTour}
        // setIsTourRunning={setIsTourRunning}
        // isTourRunning={isTourRunning}
        // activeChartID={activeChartID}
        // setActiveChartID={setActiveChartID}        
        />
      </>
      )}




      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={handleCloseHelpModal}
        title="" // Pass any necessary props
        description="" // Pass any necessary props
        setTitle={() => {}}
        setDescription={() => {}}
      />

      <FaqsModal
        isOpen={isFaqsModalOpen}
        onClose={handleCloseFaqsModal} // Close the FaqsModal
      />

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
  const [runThresholdTour, setRunThresholdTour] = useState(false);

  const expandButtonRef = useRef(null);
  const startTourButtonRef = useRef(null); 

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
      {location.pathname !== '/' &&
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
        expandButtonRef={expandButtonRef}
        startTourButtonRef={startTourButtonRef}
        runThresholdTour={runThresholdTour}
        setRunThresholdTour={setRunThresholdTour}
      >
        <Routes>
          {/* <Route path="/landing" element={<LandingPage />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ModularDashboard statusOfAlerts={showAlerts} expandButtonRef={expandButtonRef} runThresholdTour={runThresholdTour} setRunThresholdTour={setRunThresholdTour}
         />
              </ProtectedRoute>
            }
          />
          <Route
            path="/summary"
            element={
              <ProtectedRoute>
                <ModularSummary statusOfAlerts={showAlerts} />
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
            path="/thankyou"
            element={
              <ProtectedRoute>
                <ThankYou />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thankyouadmin"
            element={
              <ProtectedRoute>
                <ThankYouAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/energy"
            element={
              <ProtectedRoute>
                <EnergyPage statusOfAlerts={showAlerts} />
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
            <Route path="*" element={<RedirectBasedOnAuth />} />
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
