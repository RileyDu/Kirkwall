import { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Box, useColorMode } from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getWeatherData } from '../../Backend/Graphql_helper';

const ChartExpandModal = ({ isOpen, onClose, children, title, metric, onChartChange }) => {
  const [chartType, setChartType] = useState('bar');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('3H'); // Default time period
  const [data, setData] = useState([]);

  const { colorMode } = useColorMode();
  const MotionButton = motion(Button);

  const changeChartType = (type) => {
    setChartType(type);
    if (onChartChange) {
      onChartChange(type);
    }
  };

  const handleTimePeriodChange = (timePeriod) => {
    setSelectedTimePeriod(timePeriod);
  };

  const getBackgroundColor = (colorMode) =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const limit = determineLimitBasedOnTimePeriod(selectedTimePeriod);
        const result = await getWeatherData(metric, limit);
        setData(result.data.weather_data); // Adjust according to your API response structure
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [metric, selectedTimePeriod]); // Trigger fetchData when metric or selectedTimePeriod changes

  const determineLimitBasedOnTimePeriod = (timePeriod) => {
    switch (timePeriod) {
      case '1H':
        return 13; // Example limit for 1 hour
      case '3H':
        return 37; // Example limit for 3 hours
      case '6H':
        return 73; // Example limit for 6 hours
      case '12H':
        return 145; // Example limit for 12 hours
      case '1D':
        return 289; // Example limit for 1 day
      case '3D':
        return 865; // Example limit for 3 days
      case '1W':
        return 2017; // Example limit for 1 week
      default:
        return 37; // Default limit
    }
  };

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
          <Box display="flex" justifyContent="space-between" my={4}>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('1H')}
            >
              1H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('3H')}
            >
              3H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('6H')}
            >
              6H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('12H')}
            >
              12H
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('1D')}
            >
              1D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('3D')}
            >
              3D
            </MotionButton>
            <MotionButton
              variant="pill"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimePeriodChange('1W')}
            >
              1W
            </MotionButton>
          </Box>
          <Box
            h="825px"
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
            weatherData={data}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
