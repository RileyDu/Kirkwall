import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useMediaQuery, Flex, Box, IconButton, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import WeatherAlerts from '../Alert/WeatherAlerts';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Header = ({ toggleMobileMenu, isMobileMenuOpen }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('Sidebar mounted');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        console.log('User is signed out');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const toggleAlerts = () => {
    setShowAlerts(!showAlerts);
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
        position="sticky"
        top="0"
        zIndex="1001"
        borderBottom="3px solid #fd9801"
      >
        <Box>
          <motion.div
            initial={{ x: '-40vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 10 }}
          >
            <img
              src="/kirkwall_logo_1_white.png"
              alt="kirkwall logo"
              height="150px"
              width="150px"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
          </motion.div>
        </Box>
        {isLargerThan768 ? (
          user ? (
            <Flex fontSize="2em" color="white" align="center">
              <motion.div
                initial={{ x: '40vw' }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 10 }}
              >
              <Popover>
                <PopoverTrigger>
                  <Avatar
                    size="md"
                    name="Grand Farm Logo"
                    src="/GrandFarmLogo.jpg"
                    cursor="pointer"
                  />
                </PopoverTrigger>
                <PopoverContent bg="white" borderColor="#212121" zIndex={1005}>
                  <PopoverCloseButton size="lg" />
                  <PopoverHeader fontWeight="bold" fontSize="xl" bg="#fd9801" borderRadius={"md"}>Grand Farm</PopoverHeader>
                  <PopoverBody>
                    <Logout />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              </motion.div>
            </Flex>
          ) : null
        ) : (
          user && location.pathname !== '/login' && (
            <IconButton 
              icon={isMobileMenuOpen ? <CloseIcon color="white" /> : <HamburgerIcon color="#212121" />}
              onClick={toggleMobileMenu}
              aria-label="Toggle Mobile Menu"
              display={{ base: 'block', md: 'none' }}
              position="fixed"
              top="1rem"
              right="1rem"
            />
          )
        )}
      </Flex>
      {/* {showAlerts && <WeatherAlerts isVisible={showAlerts} onClose={toggleAlerts} />} */}
    </>
  );
};

export default Header;
