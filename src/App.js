import React, { useState, useEffect, useRef } from 'react';
import {
  ChakraProvider,
  Box,
  Spinner,
  useMediaQuery,
  Flex,
  useColorMode,
  IconButton,
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
import { FaChessRook, FaQuestion } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';

import { keyframes } from '@emotion/react';
import WatchdogSensors from './Frontend/Sensors/WatchdogSensors/WatchdogSensors.js';
import MapComponent from './Frontend/Maps/KirkwallMap.js';
import GrandFarmMap from './Frontend/Maps/GrandFarmMap.js';
import { motion } from 'framer-motion';
import HelpModal from './Frontend/Modals/HelpModal.js';
import OptionsModal from './Frontend/Modals/OptionsModal.js';
import ModularDashboard from './Frontend/Modular/ModularDashboard.js';
import FaqsModal from './Frontend/Modals/FaqsModal.js';
import ModularSummary from './Frontend/Modular/ModularSummary.js';
import RedirectBasedOnAuth from './Frontend/AuthComponents/RedirectBasedOnAuth.js';
import ThankYou from './Frontend/Alert/ThankYou.js';
import ThankYouAdmin from './Frontend/Alert/ThankYouAdmin.js';
import EnergyPage from './Frontend/OneTimers/Energy/EnergyPage.js';
import WeeklyRecap from './Frontend/WeeklyRecap/WeeklyRecap.js';
import VideoPlayerPage from './Frontend/OneTimers/VideoFeed/VideoPlayerPage.js';
import AgScrapper from './Frontend/OneTimers/AgScrapper/AgScrapper.js';
import ColdChainDash from './Frontend/OneTimers/ColdChain/ColdChainDash.js';
import SOAlerts from './Frontend/SOAlerts/soalerts.js';
import RecapChatbot from './Frontend/WeeklyRecap/RecapChatbot.js'; // Import RecapChatbot
import BioWorx from './Frontend/Clients/BioWorx/BioWorx.js';
import PrivacyPolicy from './Frontend/Privacy/PrivacyPolicy.js';
import Onboarding from './Frontend/AuthComponents/Onboarding.js';
import DisasterShieldLogin from './Frontend/AuthComponents/DisasterShieldLogin.js';
import DisasterShield from './Frontend/Clients/DisasterShield/DisasterShieldMap.js';
import TrialESP32Data from './Frontend/OneTimers/ESP32/ESPMock.js';

import { useAuth } from './Frontend/AuthComponents/AuthContext.js';
import axios from 'axios'; // For fetching recap data

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
}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const location = useLocation();

  const { currentUser } = useAuth();

  const shouldShowSidebar =
    location.pathname !== '/' &&
    location.pathname !== '/signup' &&
    location.pathname !== '/landing' &&
    location.pathname !== '/dslogin' &&
    location.pathname !== '/disastershield';

  const { colorMode } = useColorMode();

  const MotionIconButton = motion(IconButton);

  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false); // State for OptionsModal
  const [isFaqsModalOpen, setFaqsModalOpen] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isRecapChatbotOpen, setRecapChatbotOpen] = useState(false);
  
  // State for RecapChatbot data
  const [recapData, setRecapData] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);

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

  const handleOpenRecapChatbot = async () => {
    // Fetch recap data before opening the modal
    try {
      // Get the current user email
      const userEmail = currentUser?.email || 'test@kirkwall.io';
      
      // Example API calls to fetch recap data - modify these according to your backend structure
      const recapResponse = await axios.get(`/api/weekly-recap?user_email=${userEmail}`);
      const alertsResponse = await axios.get(`/api/alerts/recent?user_email=${userEmail}`);
      
      setRecapData(recapResponse.data);
      setRecentAlerts(alertsResponse.data);
      
      // Open the modal after data is fetched
      setRecapChatbotOpen(true);
    } catch (error) {
      console.error('Error fetching recap data:', error);
      // You might want to show a toast notification here
      
      // Open the modal anyway with mock data for testing
      setRecapData([
        { metric: 'temperature', high: 49.85, low: -22.1, avg: 32.5, alert_count: 4 },
        { metric: 'humidity', high: 91, low: 60, avg: 78.65, alert_count: 0 },
        { metric: 'soil_moisture', high: 230, low: 180, avg: 197.77, alert_count: 1 },
        { metric: 'wind_speed', high: 22, low: 3, avg: 11.29, alert_count: 0 }
      ]);
      setRecentAlerts([
        { sensor_id: 'temp_01', alert_type: 'low_temp', value: 39.1, timestamp: '2025-04-10 04:30:00' },
        { sensor_id: 'temp_03', alert_type: 'low_temp', value: 38.5, timestamp: '2025-04-10 05:15:00' },
        { sensor_id: 'soil_02', alert_type: 'high_moisture', value: 235, timestamp: '2025-04-11 13:45:00' }
      ]);
      setRecapChatbotOpen(true);
    }
  };
  
  const handleCloseRecapChatbot = () => setRecapChatbotOpen(false);

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

          {currentUser?.email === 'test@kirkwall.io' && (
            <MotionIconButton
              icon={<IoSparkles />}
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
              onClick={handleOpenRecapChatbot}
              position="fixed"
              bottom="20px"
              right="20px"
              zIndex="1000"
            />
          )}

          {/* RecapChatbot Modal */}
          {isRecapChatbotOpen && recapData && (
            <RecapChatbot
              recapData={recapData}
              recentAlerts={recentAlerts}
              userEmail={currentUser?.email || 'test@kirkwall.io'}
              onClose={handleCloseRecapChatbot}
            />
          )}

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
        location.pathname !== '/privacypolicy' &&
        location.pathname !== '/landing' &&
        location.pathname !== '/dslogin' && (
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
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/" element={<Login />} />
          <Route path="/dslogin" element={<DisasterShieldLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ModularDashboard
                  statusOfAlerts={showAlerts}
                  expandButtonRef={expandButtonRef}
                  runThresholdTour={runThresholdTour}
                  setRunThresholdTour={setRunThresholdTour}
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
            path="/weeklyrecap"
            element={
              <ProtectedRoute>
                <WeeklyRecap statusOfAlerts={showAlerts} />
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
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
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
            path="/agscraper"
            element={<AgScrapper statusOfAlerts={showAlerts} />}
          />
          <Route
            path="/videofeed"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']}>
                <VideoPlayerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coldchain"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']}>
                <ColdChainDash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/soalerts"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']}>
                <SOAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bioworx"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']}>
                <BioWorx />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disastershield"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io', 'nathalia@futureinnox.com']}>
                <DisasterShield />
              </ProtectedRoute>
            }
          />
          <Route
            path="/TrialESP32"
            element={
              <ProtectedRoute allowedUsers={['test@kirkwall.io']}>
                <TrialESP32Data />
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