import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Button,
  Image,
  Link,
  Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionImage = motion(Image);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const MainSection = () => {
  const navigate = useNavigate();

  return (
    <Box width="100%" py={10} bg="navy.900">
      <Box maxW="1200px" mx="auto" textAlign="left">
        <VStack spacing={10} align="stretch">
          <MotionBox
            textAlign="center"
            py={10}
            bg="navy.800"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            id="overview"
          >
            <Box
              mb={4}
              display={'flex'}
              justifyContent={'center'}
              alignContent={'center'}
            >
              <Box position="relative" paddingTop="56.25%" width="100%">
                {/* 16:9 Aspect Ratio */}
                <iframe
                  src={`https://www.youtube.com/embed/w8drN_JKhT4`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Kirkwall Demo"
                ></iframe>
              </Box>
            </Box>
            <Heading as="h1" size="2xl" mb={4} color="primary.100">
              Comprehensive Monitoring for Your Business
            </Heading>
            <Text fontSize="lg" color="primary.200" mb={6}>
              Protect your critical infrastructure with our advanced monitoring
              and real-time alert system.
            </Text>
            {/* <Link
            href="https://kirkwall-demo.vercel.app/"
            style={{ textDecoration: 'none' }}
          > */}
            <Button
              size="lg"
              colorScheme="primary"
              variant="solid"
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
            {/* </Link> */}
          </MotionBox>

          <MotionFlex
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            id="core-values"
          >
            <MotionImage
              src={'dashboard.png'}
              alt="Kirkwall Dashboard"
              width={{ base: '100%', lg: '45%' }}
              objectFit="cover"
              mb={{ base: 6, lg: 0 }}
              whileHover={{ scale: 1.05 }}
            />
            <Box flex="1" ml={{ base: 0, lg: 10 }}>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Overview
              </Heading>
              <Text fontSize="lg" mb={4}>
                Kirkwall is your trusted partner in operational security,
                offering real-time monitoring and alerts to protect your
                critical systems from downtime and threats.
              </Text>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Our Promise
              </Heading>
              <Text fontSize="lg" color="primary.200">
                Proactive. Predictive. Secure.
              </Text>
              <Link
                href="mailto:will@kirkwall.com"
                style={{ textDecoration: 'none' }}
              >
                <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                  Request Demo
                </Button>
              </Link>
            </Box>
          </MotionFlex>

          <MotionFlex
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            id="core-values"
          >
            <Box flex="1" mr={{ base: 0, lg: 10 }} mb={{ base: 6, lg: 0 }}>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Core Values
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                <ul>
                  <li>Adaptable & Scalable</li>
                  <li>High Security Standards</li>
                  <li>Predictive Maintenance</li>
                  <li>Innovative Technology</li>
                  <li>Unified Monitoring</li>
                  <li>Compatibility with All Systems</li>
                  <li>Homegrown Expertise</li>
                </ul>
              </Text>
              {/* <Link href="https://kirkwall-demo.vercel.app/">       
                   <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                Get Started
              </Button>
            </Link> */}
            </Box>
            <MotionImage
              src="team.jpg"
              alt="Kirkwall Values"
              width={{ base: '100%', lg: '45%' }}
              objectFit="cover"
              whileHover={{ scale: 1.05 }}
            />
          </MotionFlex>

          <MotionFlex
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            id="our-philosophy"
          >
            <MotionImage
              src="topdowncombine.jpg"
              alt="Kirkwall Philosophy"
              width={{ base: '100%', lg: '45%' }}
              objectFit="cover"
              mb={{ base: 6, lg: 0 }}
              whileHover={{ scale: 1.05 }}
            />
            <Box flex="1" ml={{ base: 0, lg: 10 }}>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Our Philosophy
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                Challenging conventional security, Kirkwall pushes boundaries to
                deliver exceptional protection and value.
              </Text>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Our Voice
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                Bold, Innovative, and Relentless in our pursuit of excellence.
              </Text>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                About Kirkwall
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                Founded in 2022, Kirkwall is dedicated to safeguarding
                agricultural, industrial, and manufacturing sectors with
                state-of-the-art monitoring and security solutions.
              </Text>
              {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}>
              <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                Get Started
              </Button>
            </Link> */}
            </Box>
          </MotionFlex>

          <MotionBox
            textAlign="center"
            py={10}
            bg="navy.800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            id="securing-america"
          >
            <Heading as="h2" size="2xl" mb={4} color="primary.100">
              Securing America's Critical Infrastructure
            </Heading>
            <Text fontSize="lg" color="primary.200" mb={6}>
              Addressing vulnerabilities in Agriculture, Energy, Water,
              Industrial, and Manufacturing sectors.
            </Text>
            {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}>
            <Button size="lg" colorScheme="primary" variant="solid">
              Get Started
            </Button>
          </Link> */}
          </MotionBox>

          <MotionFlex
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            id="solutions"
          >
            <Box flex="1" mr={{ base: 0, lg: 10 }} mb={{ base: 6, lg: 0 }}>
              <Heading as="h2" size="xl" mb={4} color="primary.100">
                Solutions We Offer
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                <ul>
                  <li>Real-time Threat Detection</li>
                  <li>Advanced Incident Response</li>
                  <li>Comprehensive Risk Management</li>
                  <li>IoT Security</li>
                </ul>
              </Text>
              <Link
                href="mailto:will@kirkwall.com"
                style={{ textDecoration: 'none' }}
              >
                <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                  Request Demo
                </Button>
              </Link>
            </Box>
            <MotionImage
              src="sensor.jpg"
              alt="Security Solutions"
              width={{ base: '100%', lg: '45%' }}
              objectFit="cover"
              whileHover={{ scale: 1.05 }}
            />
          </MotionFlex>
        </VStack>
      </Box>
      <Icon
        as={FaArrowUp}
        w={10}
        h={10}
        position="fixed"
        bottom={5}
        right={5}
        color="primary.300"
        onClick={scrollToTop}
        cursor="pointer"
      />
    </Box>
  );
};

export default MainSection;
