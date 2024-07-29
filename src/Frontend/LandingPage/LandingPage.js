import React from 'react';
// import MainSection from './MainSection.js';
import MainSection from './MainSection.js';
import ThreatSection from './ThreatSection.js';
import Header from './Header.js';
import Footer from './Footer.js';
import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from './theme.js';

const LandingPage = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl" bg="navy.900" color="white">
      <Header />
      <MainSection />
      <ThreatSection />
      <Footer />
    </Box>
  </ChakraProvider>
);

export default LandingPage;
