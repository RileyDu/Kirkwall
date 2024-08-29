import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import Joyride, { STATUS } from 'react-joyride';
import { FaQuestionCircle, FaHandsHelping, FaInfoCircle } from 'react-icons/fa';

const OptionsModal = ({ isOpen, onClose, onContactUsClick, onHelpClick, onFaqsClick, expandButtonRef, runThresholdTour, setRunThresholdTour, chartId }) => {
  const { colorMode } = useColorMode();
  const [runTour, setRunTour] = useState(false);

  const getColor = () => {
    if (colorMode === 'light') {
      return 'gray.600';
    } else {
      return 'white';
    }
  };

  const steps = [
    {
      target: '#step1',
      content: 'See the geolocation of the sensor.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#step2',
      content: 'Toggle between line and bar chart.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '#step3',
      disableBeacon: true,
      content: (
        <Box>
          <Text>On the click of this button, more features such as setting thresholds for the current parameter are available.</Text>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => {
              if (expandButtonRef.current) {
                expandButtonRef.current.click();
                setRunTour(false); // Stop the current tour (if needed)
                setRunThresholdTour(chartId);
              } else {
                console.error('Expand Chart button not found');
              }
            }}
          >
            Tour Thresholds
          </Button>
        </Box>
      ),
      placement: 'bottom',
    },
    {
      target: '#step4',
      disableBeacon: true,
      content: 'Choose to hide this chart from the dashboard.',
      placement: 'bottom',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false); // Reset the tour state after it finishes or is skipped
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
              <Box textAlign="center" onClick={onContactUsClick} cursor="pointer" mt={4}>
                <Icon as={FaQuestionCircle} w={12} h={12} color={getColor()} />
                <Text fontSize="lg" color={getColor()} mt={2}>
                  Contact Us
                </Text>
              </Box>
              <Box textAlign="center" onClick={handleHelpClick} cursor="pointer" id="step3" mb={4}>
                <Icon as={FaHandsHelping} w={12} h={12} color={getColor()} />
                <Text fontSize="lg" color={getColor()} mt={2}>
                  Tutorial
                </Text>
              </Box>
              {/* <Box textAlign="center" onClick={onFaqsClick} cursor="pointer" mb={4}>
                <Icon as={FaInfoCircle} w={12} h={12} color={getColor()} />
                <Text fontSize="lg" color={getColor()} mt={2}>
                  FAQs
                </Text>
              </Box> */}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OptionsModal;
