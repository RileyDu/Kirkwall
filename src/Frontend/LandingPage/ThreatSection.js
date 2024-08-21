import React from 'react';
import { Box, VStack, Heading, Text, Flex, Image, Link, Button, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionImage = motion(Image);

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const ThreatSection = () => {
  const navigate = useNavigate();
  return (
  <Box width="100%" py={10} bg="navy.900">
    <Box maxW="1200px" mx="auto" textAlign="left">
      <VStack spacing={10} align="stretch">
        <Box id="the-challenge">
          <Heading as="h2" size="xl" mb={4} color="primary.100">
            The Challenge
          </Heading>
          <Text fontSize="lg" mb={4} color="primary.200">
            America's critical infrastructure sectors are vulnerable due to outdated security measures, fragmented solutions, and increased threats.
          </Text>
          
          <MotionFlex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            id="foreign-attacks"
          >
            <Box flex="1" mr={{ base: 0, lg: 10 }} mb={{ base: 6, lg: 0 }}>
              <Heading as="h2" size="lg" mb={4} color="primary.100">
                Foreign Attacks
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                <strong>Example 1:</strong> In 2018, Russian attacks targeted US utilities.
                <br />
                <strong>Example 2:</strong> In 2022, FBI warned of ransomware attacks on US agriculture.
                <br />
                <strong>Example 3:</strong> Recent Volt Typhoon invasion accessed multiple sectors, preparing for disruption.
                <br />
                <strong>Example 4:</strong> Russian state-sponsored actors have conducted spearphishing campaigns and deployed malware to gain access to critical infrastructure systems.
              </Text>
              {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}>
                <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                  Request Demo
                </Button>
              </Link> */}
            </Box>
            <MotionImage
              src="jobsite.jpg"
              alt="Foreign Attacks"
              width={{ base: "100%", lg: "45%" }}
              objectFit="cover"
              whileHover={{ scale: 1.05 }}
            />
          </MotionFlex>

          <MotionFlex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            id="domestic-threats"
          >
            <MotionImage
              src="combine2.jpg"
              alt="Domestic Threats"
              width={{ base: "100%", lg: "45%" }}
              objectFit="cover"
              mb={{ base: 6, lg: 0 }}
              whileHover={{ scale: 1.05 }}
            />
            <Box flex="1" ml={{ base: 0, lg: 10 }}>
              <Heading as="h2" size="lg" mb={4} color="primary.100">
                Domestic Threats
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                <strong>Example 1:</strong> In 2016, a teenager caused a DDoS attack on 911 services.
                <br />
                <strong>Example 2:</strong> In 2021, a hacker attempted to poison a water treatment plant using a former employee's credentials.
                <br />
                <strong>Example 3:</strong> In July 2021, cyber actors introduced ransomware to a Maine-based water treatment facility.
                <br />
                <strong>Example 4:</strong> In March 2019, a former employee attempted to threaten drinking water safety by using unrevoked credentials to access a facility computer.
              </Text>
              {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}>
                <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                  Request Demo
                </Button>
              </Link> */}
            </Box>
          </MotionFlex>

          <MotionFlex
            direction={{ base: "column", lg: "row" }}
            justify="space-between"
            align="center"
            py={10}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            id="existential-threats"
          >
            <MotionImage
              src="network.jpg"
              alt="Existential Threats"
              width={{ base: "100%", lg: "45%" }}
              objectFit="cover"
              mb={{ base: 6, lg: 0 }}
              whileHover={{ scale: 1.05 }}
            />
            <Box flex="1" ml={{ base: 0, lg: 10 }}>
              <Heading as="h2" size="lg" mb={4} color="primary.100">
                Existential Threats
              </Heading>
              <Text fontSize="lg" mb={4} color="primary.200">
                <strong>Market Manipulation:</strong> Sabotaging commodities to raise trade value.
                <br />
                <strong>Competitive Sabotage:</strong> Gaining unauthorized access to business data to disrupt operations.
                <br />
                <strong>Example 1:</strong> Cyber actors have targeted U.S. energy sectors to disrupt services.
                <br />
                <strong>Example 2:</strong> Advanced Persistent Threat (APT) actors have exploited vulnerabilities in IT systems to gain long-term access and disrupt operations.
              </Text>
              {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}>
                <Button size="lg" colorScheme="primary" variant="solid" mt={4}>
                  Request Demo
                </Button>
              </Link> */}
            </Box>
          </MotionFlex>
        </Box>

        <MotionBox
          textAlign="center"
          py={10}
          bg="navy.800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          id="kirkwall-solution"
        >
          <Heading as="h2" size="2xl" mb={4} color="primary.100">
            Kirkwall's Solution
          </Heading>
          <Text fontSize="lg" color="primary.200" mb={6}>
            A centralized, sensor-agnostic, scalable, and proactive solution to transform security and ensure resilience.
          </Text>
          {/* <Link href="https://kirkwall-demo.vercel.app/" style={{ textDecoration: 'none' }}> */}
            <Button size="lg" colorScheme="primary" variant="solid" onClick={() => navigate('/login')}>
              Get Started
            </Button>
          {/* </Link> */}
        </MotionBox>

        <MotionBox
          textAlign="center"
          py={10}
          bg="navy.800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          id="cyber-news"
        >
          <Heading as="h2" size="2xl" mb={4} color="primary.100">
            Latest in Cybersecurity
          </Heading>
          <Text fontSize="lg" color="primary.200" mb={6}>
            Stay updated with the latest news and trends in cybersecurity, from new threats and breaches to innovations in security technology.
          </Text>
          <Link href="https://www.cisa.gov/topics/cyber-threats-and-advisories" isExternal>
            <Button size="lg" colorScheme="primary">
              Read More
            </Button>
          </Link>
        </MotionBox>
      </VStack>
    </Box>
    <Icon as={FaArrowUp} w={10} h={10} position="fixed" bottom={5} right={5} color="primary.300" onClick={scrollToTop} cursor="pointer" />
  </Box>
);
};

export default ThreatSection;
