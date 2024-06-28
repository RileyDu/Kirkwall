import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Box, useColorMode } from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';


const ChartExpandModal = ({ isOpen, onClose, children, title, weatherData, metric, onChartChange, adjustTimePeriod }) => {
  const [chartType, setChartType] = useState('bar');

  const { colorMode } = useColorMode();
  const MotionButton = motion(Button);

  const changeChartType = type => {
    setChartType(type);
    if (onChartChange) {
      onChartChange(type);
    }
  };

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="#212121" color="white" fontSize="2xl">
          {title}
          <MotionButton
            variant={'pill'}
            onClick={() => changeChartType('line')}
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
            onClick={() => changeChartType('bar')}
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
          {/* <Box display="flex" justifyContent="space-between" my={4}>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>1H</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>3H</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>6H</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>12H</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>1D</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>3D</MotionButton>
            <MotionButton variant="pill" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>1W</MotionButton>
          </Box> */}
          <Box
            h="900px"
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
          <MiniDashboard metric={metric} weatherData={weatherData} adjustTimePeriod={adjustTimePeriod} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
