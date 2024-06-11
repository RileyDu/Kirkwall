import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { useMediaQuery, Flex, Box, IconButton, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate } from 'react-router-dom';
import WeatherAlerts from '../Alert/WeatherAlerts';

const Header = ({ toggleMobileMenu }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [showAlerts, setShowAlerts] = useState(true);

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
          <img
            src="/kirkwall_logo_1_white.png"
            alt="kirkwall logo"
            height="150px"
            width="150px"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          />
        </Box>
        {isLargerThan768 ? (
          user ? (
            <Flex fontSize="2em" color="white" align="center">
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
                  <PopoverHeader fontWeight="bold" fontSize="xl" bg="#fd9801">Grand Farm</PopoverHeader>
                  <PopoverBody>
                    <Logout />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          ) : null
        ) : (
          <IconButton
            icon={<FaBars />}
            bg="transparent"
            aria-label="Menu"
            onClick={toggleMobileMenu}
            color="white"
          />
        )}
      </Flex>
      {/* {showAlerts && <WeatherAlerts isVisible={showAlerts} onClose={toggleAlerts} />} */}
    </>
  );
};

export default Header;
