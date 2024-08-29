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


  const steps = [
    {
      target: '#step1',
      content: 'This is the first step of the tour',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '#step2',
      content: 'This is the second step of the tour',
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
      content: 'This is the final step of the tour',
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
              <Box textAlign="center" onClick={onContactUsClick} cursor="pointer">
                <Icon as={FaQuestionCircle} w={12} h={12} color="gray.600" />
                <Text fontSize="lg" color="gray.600" mt={2}>
                  Contact Us
                </Text>
              </Box>
              <Box textAlign="center" onClick={handleHelpClick} cursor="pointer" id="step3">
                <Icon as={FaHandsHelping} w={12} h={12} color="gray.600" />
                <Text fontSize="lg" color="gray.600" mt={2}>
                  Tutorial
                </Text>
              </Box>
              <Box textAlign="center" onClick={onFaqsClick} cursor="pointer">
                <Icon as={FaInfoCircle} w={12} h={12} color="gray.600" />
                <Text fontSize="lg" color="gray.600" mt={2}>
                  FAQs
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              bg="gray.400"
              color="white"
              _hover={{ bg: 'gray.500' }}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OptionsModal;
