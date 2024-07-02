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
  useBreakpointValue,
  useToast
} from '@chakra-ui/react';
import MiniDashboard from './ChartDashboard';
import { FaChartLine, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ChartExpandModal = ({
  isOpen,
  onClose,
  children,
  title,
  metric,
  onChartChange,
  handleTimePeriodChange,
  weatherData,
  currentTimePeriod,
  setCurrentTimePeriod
}) => {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  // const [currentTimePeriod, setCurrentTimePeriod] = useState('3H');

  const MotionButton = motion(Button);

  const getBackgroundColor = colorMode =>
    colorMode === 'light' ? '#f9f9f9' : '#303030';

  const fontSize = useBreakpointValue({ base: 'sm', md: 'lg' });
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const closeSize = useBreakpointValue({ base: 'sm', md: 'lg' });

  const showLoadingToast = () => {
    toast({
      title: 'Loading Data',
      description: 'We are fetching the latest data for you.',
      status: 'info',
      duration: null, // Keeps the toast open until manually closed
      isClosable: true,
      size: 'lg',
      position: 'top',
    });
  };

  const handleTimeButtonClick = async (timePeriod) => {
    if (timePeriod === currentTimePeriod) return; // Prevent fetching if the time period is already selected

    showLoadingToast();
    setLoading(true);

    try {
      const result = await handleTimePeriodChange(metric, timePeriod);
      setCurrentTimePeriod(timePeriod); // Update the current time period after successful fetch
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      toast.closeAll(); // Close all toasts when loading is complete
    }
  }, [loading, toast]);

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent
        sx={{
          width: {
            base: '90%',
            sm: '80%',
            md: '70%',
            lg: '60%',
            xl: '60%',
          },
          maxWidth: '100%',
          height: {
            base: 'auto',
            sm: 'auto',
            md: '70vh',
            lg: '70vh',
            xl: '90vh',
          },
          maxHeight: '100%',
        }}
      >
        <ModalHeader bg="#212121" color="white" fontSize={fontSize} borderTopRadius={'md'}>
          {title}
          <MotionButton
            variant={'pill'}
            onClick={() => onChartChange('line')}
            leftIcon={<FaChartLine />}
            size={iconSize}
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
            size={iconSize}
          >
            BAR
          </MotionButton>
        </ModalHeader>
        <ModalCloseButton size={closeSize} color="white" mt={[3, 2]}/>
        <ModalBody>
          <Box display="flex" justifyContent="space-between" my={1}>
            {['1H', '3H', '6H', '12H', '1D', '3D', '1W'].map(timePeriod => (
              <MotionButton
                key={timePeriod}
                variant="pill"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTimeButtonClick(timePeriod)}
                bg={currentTimePeriod === timePeriod ? 'brand.800' : 'gray.100'}
                color={currentTimePeriod === timePeriod ? 'white' : 'black'}
              >
                {timePeriod}
              </MotionButton>
            ))}
          </Box>
          <Box
            h={['400px','500px', '600px', '650px']}
            w="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg={getBackgroundColor(colorMode)}
            p="4"
            borderRadius="md"
            boxShadow="md"
            border="2px solid #fd9801"
            mb={2}
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
