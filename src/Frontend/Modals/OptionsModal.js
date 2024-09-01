import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  VStack,
  Icon,
  useMediaQuery,
} from '@chakra-ui/react';
import Joyride, { STATUS } from 'react-joyride';
import { FaQuestionCircle, FaHandsHelping, FaInfoCircle } from 'react-icons/fa';
import { interval } from 'date-fns';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { MetricSettings } from '../Modular/MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';

const OptionsModal = ({
  isOpen,
  onClose,
  onContactUsClick,
  onHelpClick,
  expandButtonRef,
  runThresholdTour,
  setRunThresholdTour,
  chartId,
  isTourRunning,
  setIsTourRunning,
  activeChartID,
  setActiveChartID,
}) => {
  const { colorMode } = useColorMode();
  const [runTour, setRunTour] = useState(false);
  const { currentUser } = useAuth();
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [metricSettings, setMetricSettings] = useState([]);
  const joyrideRef = useRef(); // Create the joyrideRef
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');


  const getColor = () => (colorMode === 'light' ? 'gray.600' : 'white');

  useEffect(() => {
    if (currentUser) {
      const customer = CustomerSettings.find(
        customer => customer.email === currentUser.email
      );
      if (customer) {
        setCustomerMetrics(customer.metric);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (customerMetrics.length > 0) {
      const selectedMetrics = MetricSettings.filter(metric =>
        customerMetrics.includes(metric.metric)
      );
      if (selectedMetrics) {
        setMetricSettings(selectedMetrics);
      }
    }
  }, [customerMetrics]);

  console.log(metricSettings);

  const steps = [
    {
      target: '#step1',
      content: 'See the geolocation of the sensor.',
      disableBeacon: true,
      placement: 'bottom',
      hideBackButton: true,
    },
    {
      target: '#step2',
      content: 'Toggle between line and bar chart.',
      placement: 'bottom',
      disableBeacon: true,
      hideBackButton: true,
    },
    {
      target: '#step4',
      disableBeacon: true,
      content: 'Choose to hide this chart from the dashboard.',
      placement: 'bottom',
      hideBackButton: true,
    },
    {
      target: '#step3',
      disableBeacon: true,
      content: 'This is how you access more features for your chart.',
      placement: 'bottom',
      hideBackButton: true,
    },
    {
      target: '#step3',
      disableBeacon: true,
      content: 'This is the expanded modal for your chart.',
      placement: 'bottom',
      spotlightPadding: 0,
      disableOverlay: true,
      hideBackButton: true,
    },
    {
      target: '.time-period-buttons',
      disableBeacon: true,
      content: 'Select different time periods for your data here.',
      hideBackButton: true,
    },
    {
      target: '.chart-area',
      disableBeacon: true,
      content: 'This is where your selected chart is displayed.',
      hideBackButton: true,

    },
    {
      target: '.chart-type-buttons',
      disableBeacon: true,
      content: 'Switch between line and bar charts here.',
      hideBackButton: true,
    },
    {
      target: '.set-thresholds-button',
      disableBeacon: true,
      content: 'Set alerts for specific thresholds here.',
      hideBackButton: true,
    },
    {
      target: '.thresholds-display',
      disableBeacon: true,
      content: 'View your current readings, thresholds and alerts here.',
      hideBackButton: true,
    },
    {
      target: '.map-component',
      disableBeacon: true,
      content: 'View the geolocation of the sensor.',
      hideBackButton: true,
    },
  ];

  const handleJoyrideCallback = data => {
    const { status, index } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false); // Reset the tour state after it finishes or is skipped
    } else if (index === 4 && expandButtonRef.current) {
      // Trigger the click when reaching the step 3
      expandButtonRef.current.click();
      setTimeout(() => {
        // Continue the tour after 1 second delay
        if (joyrideRef.current) {
          joyrideRef.current.next();
        }
      }, 2000);
    }
  };

  const startTour = () => {
    setRunTour(true); // Start the tour
  };

  const handleHelpClick = () => {
    onHelpClick(); // Perform any additional help click actions
    startTour(); // Trigger the tour
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        disableScrolling={true}
        styles={{
          options: {
            zIndex: 10000,
          },
          buttonClose: {
            display: 'none',
          },
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          sx={{
            border: '2px solid black',
            bg: colorMode === 'light' ? 'whitesmoke' : 'gray.700',
          }}
        >
          <ModalHeader bg="gray.800" color="white">
            Choose an Option
          </ModalHeader>
          <ModalCloseButton color="white" size="lg" mt={1} />
          <ModalBody>
            <VStack spacing={8}>
              <Box
                textAlign="center"
                onClick={onContactUsClick}
                cursor="pointer"
                mt={4}
              >
                <Icon as={FaQuestionCircle} w={12} h={12} color={getColor()} />
                <Text fontSize="lg" color={getColor()} mt={2}>
                  Contact Us
                </Text>
              </Box>
              {isLargerThan768 &&
              <Box
                textAlign="center"
                onClick={handleHelpClick}
                cursor="pointer"
                id="step3"
                mb={4}
              >
                <Icon as={FaHandsHelping} w={12} h={12} color={getColor()} />
                <Text fontSize="lg" color={getColor()} mt={2}>
                  Tutorial
                </Text>
              </Box>
              }
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OptionsModal;
