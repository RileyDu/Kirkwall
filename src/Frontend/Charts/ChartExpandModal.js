import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { m, motion } from 'framer-motion';

const ChartExpandModal = ({
  isOpen,
  onClose,
  children,
  title,
  metric,
  onChartChange,
  handleTimePeriodChange,
  weatherData,
}) => {
  const { colorMode } = useColorMode();
  const MotionButton = motion(Button);

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent
        sx={{
          width: {
            base: '90%', // 90% width for small screens
            sm: '80%', // 80% width for small devices
            md: '70%', // 70% width for medium devices
            lg: '60%', // 60% width for large devices
            xl: '60%', // 50% width for extra large devices
          },
          maxWidth: '100%', // Ensure the modal doesn't exceed the viewport width
          height: {
            base: 'auto', // Auto height for small screens
            sm: 'auto', // Auto height for small devices
            md: '70vh', // 70% of viewport height for medium devices
            lg: '70vh', // 70% of viewport height for large devices
            xl: '85vh', // 60% of viewport height for extra large devices
          },
          maxHeight: '100%', // Ensure the modal doesn't exceed the viewport height
        }}
      >
        <ModalHeader bg="#212121" color="white" fontSize="2xl" borderTopRadius={'md'}>
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
              onClick={() => handleTimePeriodChange(metric, '1H')}
            >
              1H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '3H')}
            >
              3H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '6H')}
            >
              6H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '12H')}
            >
              12H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '1D')}
            >
              1D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '3D')}
            >
              3D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange(metric, '1W')}
            >
              1W
            </MotionButton>
          </Box>
          <Box
            h={['500px', '600px', '650px']}
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
          <MiniDashboard metric={metric} weatherData={weatherData} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
