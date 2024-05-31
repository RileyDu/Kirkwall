import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../Backend/Firebase';
import { Divider, useMediaQuery } from '@chakra-ui/react';
import { Flex, Box, IconButton } from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import Logout from '../../Frontend/AuthComponents/Logout';

const Header = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [user] = useAuthState(auth);
  return (
    <Flex
      bg="#1A9687"
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
          src="/kirkwall_logo.png"
          alt="kirkwall logo"
          height="150px"
          width="150px"
        />
      </Box>
      {isLargerThan768 ? (
        user ? (
          <Flex fontSize={'2em'} fontWeight={'bold'} color={'black'} align="center">
            <Box mx="5" _hover={{ textDecoration: 'underline' }}>
              Home
            </Box>
            <Divider orientation="vertical" height={'1.5em'} borderWidth={'2px'} borderColor={'black'}/>
            <Box mx="5" _hover={{ textDecoration: 'underline' }}>
              Sensors
            </Box>
            <Divider orientation="vertical" height={'1.5em'} borderWidth={'2px'} borderColor={'black'}/>
            <Box mx="5" _hover={{ textDecoration: 'underline' }}>
              Reports
            </Box>
          </Flex>
        ) : null
      ) : (
        <IconButton icon={<FaBars />} bg="transparent" aria-label="Menu" />
      )}
      {/* <Box>
          <IconButton
            icon={<FaUserCircle />}
            bg="transparent"
            aria-label="User Profile"
            />
        </Box> */}
      {user && <Logout />}
    </Flex>
  );
};

export default Header;
