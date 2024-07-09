import React from 'react';
import MainSection from './MainSection';
import ThreatSection from './ThreatSection';
import Header from './Header';
import Footer from './Footer';
import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from './theme';

const LandingPage = () => (
  <ChakraProvider theme={theme}>
  <Box textAlign="center" fontSize="xl" bg="navy.900" color="white">    <Header />
    <MainSection />
    <ThreatSection />
    <Footer />
  </Box>
</ChakraProvider>
);

export default LandingPage;
