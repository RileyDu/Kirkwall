import { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Box, useColorMode } from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { m, motion } from 'framer-motion';

const ChartExpandModal = ({ isOpen, onClose, children, title, metric, onChartChange, handleTimePeriodChange, weatherData }) => {

  const { colorMode } = useColorMode();
  const MotionButton = motion(Button);


  const getBackgroundColor = (colorMode) =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="#212121" color="white" fontSize="2xl">
          {title}
          <MotionButton
            variant={'pill'}
            onClick={() => onChartChange('line')}
            leftIcon={<FaChartLine />}
            mx={2}
            ml={4}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            LINE
          </MotionButton>
          <MotionButton
            variant={'pill'}
            onClick={() => onChartChange('bar')}
            leftIcon={<FaChartBar />}
            mx={2}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            BAR
          </MotionButton>
        </ModalHeader>
        <ModalCloseButton size="lg" color="white" mt={2} />
        <ModalBody>
          <Box display="flex" justifyContent="space-between" my={4}>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'1H')}
            >
              1H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'3H')}
            >
              3H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'6H')}
            >
              6H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'12H')}
            >
              12H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'1D')}
            >
              1D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'3D')}
            >
              3D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric,'1W')}
            >
              1W
            </MotionButton>
          </Box>
          <Box
            h={['500px', '600px', '700px', '825px']} 
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg={getBackgroundColor(colorMode)}
            p="4"
            borderRadius="md"
            boxShadow="md"
            border="2px solid #fd9801"
            mb={4}
          >
            {children}
          </Box>
          <MiniDashboard
            metric={metric}
            weatherData={weatherData}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
