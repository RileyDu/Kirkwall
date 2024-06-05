import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { useMediaQuery, Flex, Box, IconButton, Avatar, AvatarBadge } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import Logout from '../../Frontend/AuthComponents/Logout';
import { useNavigate } from 'react-router-dom';
import WeatherAlerts from '../Alert/WeatherAlerts';

const Header = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const DividerBox = () => (
    <Box height="1.5em" width="3px" bg="white" />
  );

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
        zIndex="1000"
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
            <Flex fontSize={'2em'} color={'white'} align="center">
              {/* <Box mx="5" _hover={{ textDecoration: 'underline', cursor: 'pointer' }} lineHeight="1.5em" onClick={() => navigate('/')}>
                Home
              </Box> */}
              {/* <DividerBox />
              <Box mx="5" _hover={{ textDecoration: 'underline', cursor: 'pointer' }} lineHeight="1.5em" onClick={() => navigate('/Sensors')}>
                Sensors
              </Box> */}
              {/* <DividerBox />
              <Box mx="5" _hover={{ textDecoration: 'underline', cursor: 'pointer' }} lineHeight="1.5em">
                Reports
              </Box> */}
              <Avatar
                size="md"
                name="Grand Farm Logo"
                src="/GrandFarmLogo.jpg" // Ensure this path is correct and the image is in the public directory
              >
              </Avatar>
              {/* <Box mx="5" onClick={() => navigate('/profile')}>
                {user.displayName || user.email}
              </Box> */}
            </Flex>
          ) : null
        ) : (
          <IconButton icon={<FaBars />} bg="transparent" aria-label="Menu" />
        )}
      </Flex>
      <WeatherAlerts />
    </>
  );
};

export default Header;
