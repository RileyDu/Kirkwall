import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdElectricBolt } from 'react-icons/md';
import {
  useMediaQuery,
  Flex,
  Box,
  IconButton,
  Avatar,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Tooltip,
  useColorMode,
  Popover,
  PopoverCloseButton,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  useDisclosure,
} from '@chakra-ui/react';
import {
  FaBars,
  FaSun,
  FaMoon,
  FaDog,
  FaGlobe,
  FaSnowflake,
  FaBookOpen,
  FaCalendarWeek,
  FaFileDownload,
  FaVideo,
  FaTractor,
  FaLock,
  FaAtom,
} from 'react-icons/fa';
import { TbFridge } from 'react-icons/tb';
import { GiGroundSprout } from 'react-icons/gi';
import { FiAlertTriangle } from 'react-icons/fi';
import {
  WiThermometer,
  WiStrongWind,
  WiRain,
  WiHumidity,
} from 'react-icons/wi';
import { RiAdminLine } from 'react-icons/ri';

import Logout from '../../Frontend/AuthComponents/Logout.js';
import { useNavigate } from 'react-router-dom';
import { useWeatherData } from '../WeatherDataContext.js';
import WeatherAlerts from '../Alert/WeatherAlerts.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import Admin from './Admin.js';
import AdminExpandModal from '../Modals/AdminExpandModal.js';
import ExportDataModal from '../Modals/ExportDataModal.js';
import { IoSparkles } from 'react-icons/io5';

const Header = ({ isMinimized, isVisible, toggleAlerts, handleOpenChatBotModal }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [customerRole, setCustomerRole] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const {
    isOpen: isAdminOpen,
    onOpen: onAdminOpen,
    onClose: onAdminClose,
  } = useDisclosure();

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();

  const { currentUser } = useAuth();
  const user = currentUser;
  const userEmail = user ? user.email : 'default';


const buttonConfig = {
  'pmo@grandfarm.com': [
    {
      icon: <WiThermometer size="30" />,
      label: 'Temperature',
      route: '/TempSensors',
    },
    {
      icon: <WiHumidity size="30" />,
      label: 'Humidity',
      route: '/HumiditySensors',
    },
    { icon: <WiStrongWind size="30" />, label: 'Wind', route: '/WindSensors' },
    {
      icon: <GiGroundSprout size="30" />,
      label: 'Soil',
      route: '/SoilMoistureSensors',
    },
    { icon: <WiRain size="30" />, label: 'Rain', route: '/RainSensors' },
    // { icon: <FaBookOpen size="30" />, label: 'Summary', route: '/summary' },
    { icon: <FaGlobe size="30" />, label: 'Map', route: '/grandfarm/map' },
    { icon: <MdElectricBolt size="30" />, label: 'Energy', route: '/energy' },
    // {
    //   icon: <FaCalendarWeek size="30" />,
    //   label: 'Weekly Recap',
    //   route: '/weeklyrecap',
    // },
  ],
  'nathalia@futureinnox.com': [
    {
      icon: <WiThermometer size="30" />,
      label: 'Temperature',
      route: '/TempSensors',
    },
    {
      icon: <WiHumidity size="30" />,
      label: 'Humidity',
      route: '/HumiditySensors',
    },
    { icon: <WiStrongWind size="30" />, label: 'Wind', route: '/WindSensors' },
    { icon: <FaDog size="30" />, label: 'Watchdog', route: '/WatchdogSensors' },
    { icon: <FaBookOpen size="30" />, label: 'Summary', route: '/summary' },
    { icon: <FaGlobe size="30" />, label: 'Map', route: '/map' },
  ],
  default: [
    { icon: <FaDog size="30" />, label: 'Watchdog', route: '/WatchdogSensors' },
    { icon: <FaBookOpen size="30" />, label: 'Summary', route: '/summary' },
    { icon: <FaGlobe size="30" />, label: 'Map', route: '/map' },
    { icon: <MdElectricBolt size="30" />, label: 'Energy', route: '/energy' },
    {
      icon: <FaCalendarWeek size="30" />,
      label: 'Weekly Recap',
      route: '/weeklyrecap',
    },
    { icon: <FaVideo size="30" />, label: 'Video Feeds', route: '/videofeed' },
    { icon: <FaTractor size="30" />, label: 'AgSraper', route: '/agscraper' },
    { icon: <TbFridge size="30" />, label: 'Cold Chain', route: '/coldchain' },
    { icon: <FaLock size="30" />, label: 'Security', route: '/soalerts' },
    { icon: <FaAtom size="30" />, label: 'Bioworx', route: '/bioworx' },
  ],
};

  const MotionIconButton = motion(IconButton);

  const motionProps = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  };

  const renderButtons = () => {
    const buttons = buttonConfig[userEmail] || buttonConfig['default'];
    return buttons.map((button, index) => (
      <motion.div {...motionProps}>
        <Button
          key={index}
          leftIcon={button.icon}
          onClick={() => navigate(button.route)}
          {...buttonStyleProps}
        >
          {button.label}
        </Button>
      </motion.div>
    ));
  };

  const handleUserNavigation = () => {
    switch (customerRole) {
      case 'gf':
        navigate('/grandfarm');
        break;
      case 'rj':
        navigate('/rjenergy');
        break;
      case 'wdp':
        navigate('/watchdogprotect');
      default:
        navigate('/dashboard');
        break;
    }
  };

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleNavigation = path => {
    navigate(path);
    closeDrawer();
  };

  const onSummaryToggle = () => {
    setSummaryOpen(!isSummaryOpen);
  };

  const buttonStyleProps = {
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    fontSize: 'md',
    borderRadius: 'md',
    mb: 4,
    bg: '#cee8ff',
    color: '#212121',
    boxShadow: 'md',
  };

  return (
    <>
      <Flex
        bg="#212121"
        color="white"
        px="4"
        py="2"
        align="center"
        justify="space-between"
        position="fixed"
        top="0"
        left="0"
        width="100%"
        zIndex="1001"
        borderBottom="3px solid #cee8ff"
        height="70px"
      >
        <motion.div {...motionProps}>
          <Box>
            {currentUser &&
              currentUser.email === 'nathalia@futureinnox.com' && (
                <img
                  src={`${process.env.PUBLIC_URL}/DisasterShieldShieldLogo.jpg`}
                  alt="Disaster Shield logo"
                  style={{ height: '60px', width: 'auto', cursor: 'pointer' }}
                  onClick={() => handleUserNavigation()}
                />
              )}
            {currentUser &&
              currentUser.email !== 'nathalia@futureinnox.com' && (
                <img
                  src={`${process.env.PUBLIC_URL}/kirkwall_logo_1_white.png`}
                  alt="kirkwall logo"
                  style={{ height: '40px', width: 'auto', cursor: 'pointer' }}
                  onClick={() => handleUserNavigation()}
                />
              )}
          </Box>
        </motion.div>
        <Flex align="center">
          {isLargerThan768 && (
            <>
              {currentUser && currentUser.email === 'test@kirkwall.io' && (
                <>
                
                <motion.div {...motionProps}>
                  <Tooltip label="Export Data">
                    <MotionIconButton
                      icon={<FaFileDownload />}
                      isRound
                      size="lg"
                      onClick={onExportOpen}
                      bg="transparent"
                      color="whitesmoke"
                      aria-label="Export Data"
                      _hover={{ bg: 'transparent' }}
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  </Tooltip>
                </motion.div>
                </>
              )}
              <motion.div {...motionProps}>
                <Tooltip label="Toggle Weather Alerts">
                  <MotionIconButton
                    icon={<FiAlertTriangle />}
                    isRound
                    size="lg"
                    onClick={toggleAlerts}
                    bg="transparent"
                    color="whitesmoke"
                    aria-label="Toggle Weather Alerts"
                    _hover={{ bg: 'transparent' }}
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </Tooltip>
              </motion.div>
            </>
          )}
          <motion.div {...motionProps}>
            <Tooltip label="Toggle Dark Mode">
              <MotionIconButton
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                isRound
                size="lg"
                onClick={toggleColorMode}
                bg="transparent"
                color="whitesmoke"
                aria-label="Toggle Dark Mode"
                _hover={{ bg: 'transparent' }}
                whileHover={{ scale: 1.4 }}
                whileTap={{ scale: 0.9 }}
              />
            </Tooltip>
          </motion.div>
          {isLargerThan768 ? (
            user ? (
              <motion.div {...motionProps}>
                <Popover>
                  <PopoverTrigger>
                    <Avatar
                      size="md"
                      name=""
                      src={
                        currentUser.email === 'pmo@grandfarm.com'
                          ? '/GrandFarmLogo.jpg'
                          : currentUser.email === 'nathalia@futureinnox.com'
                          ? '/DisasterSHIELD.jpg'
                          : '/RookLogoWhite.png'
                      }
                      cursor="pointer"
                      ml="4"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    bg="#2D3748"
                    borderColor="whiteAlpha.600"
                    zIndex={1005}
                  >
                    <PopoverCloseButton size="lg" />
                    <PopoverHeader
                      fontWeight="bold"
                      fontSize="xl"
                      bg="#212121"
                      color="white"
                    >
                      {currentUser.email === 'pmo@grandfarm.com'
                        ? 'Grand Farm'
                        : currentUser.email === 'nathalia@futureinnox.com'
                        ? 'Disaster Shield'
                        : 'Kirkwall'}
                    </PopoverHeader>
                    <PopoverBody>
                      <Admin onClick={onAdminOpen}>Admin</Admin>
                      <AdminExpandModal
                        isOpen={isAdminOpen}
                        onClose={onAdminClose}
                        title="Admin Panel"
                        userEmail={currentUser.email}
                      />
                      <Logout />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </motion.div>
            ) : null
          ) : (
            <motion.div {...motionProps}>
              <IconButton
                icon={<FaBars />}
                bg="transparent"
                color="whitesmoke"
                aria-label="Menu"
                onClick={openDrawer}
                ml="4"
              />
            </motion.div>
          )}
        </Flex>
      </Flex>

      <Drawer
        isOpen={!isLargerThan768 && isDrawerOpen}
        placement="left"
        onClose={closeDrawer}
      >
        <DrawerOverlay />
        <DrawerContent bg="#2D3748" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderBottomColor="#cee8ff">
            Menu
          </DrawerHeader>
          <DrawerBody color={'#212121'}>
            <Stack spacing={6} direction="column" alignItems="flex-start">
              {renderButtons()}
              {user && (
                <>
                  <motion.div {...motionProps}>
                    <Button
                      leftIcon={<RiAdminLine size="30" />}
                      {...buttonStyleProps}
                      onClick={onAdminOpen}
                    >
                      Admin
                    </Button>
                  </motion.div>
                  <motion.div {...motionProps}>
                    <Button
                      // leftIcon={
                      //   <Avatar
                      //     size="sm"
                      //     name="Kirkwall Logo"
                      //     src={`${process.env.PUBLIC_URL}/RookLogoWhite.png`}
                      //   />
                      // }
                      {...buttonStyleProps}
                      onClick={() => handleNavigation('/')}
                    >
                      LOGOUT
                    </Button>
                  </motion.div>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Move Modals Outside DrawerBody */}
      {user && (
        <>
          <AdminExpandModal
            isOpen={isAdminOpen}
            onClose={onAdminClose}
            title="Admin Panel"
            userEmail={currentUser.email}
          />
          <ExportDataModal isOpen={isExportOpen} onClose={onExportClose} />
        </>
      )}

      {isVisible && isLargerThan768 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WeatherAlerts
            isVisible={isVisible}
            onClose={toggleAlerts}
            isMinimized={isMinimized}
          />
        </motion.div>
      )}
    </>
  );
};

export default Header;
