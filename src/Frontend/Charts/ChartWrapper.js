import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { BsBarChartFill } from 'react-icons/bs';
import { FaChartBar, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChartDetails, { getLabelForMetric } from './ChartDetails';

const ChartWrapper = ({
  title,
  children,
  onChartChange,
  metric,
  weatherData,
  timePeriod,
  adjustTimePeriod
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showIcons, setShowIcons] = useState(true);
  const location = useLocation();

  const changeChartType = type => {
    setChartType(type);
    if (onChartChange) {
      onChartChange(type);
    }
  };

  const restrictedRoutes = [
    '/TempSensors',
    '/HumiditySensors',
    '/SoilMoistureSensors',
    '/WindSensors',
    '/RainSensors',
  ];

  useEffect(() => {
    setShowIcons(!restrictedRoutes.includes(location.pathname));
  }, [location.pathname]);

  const iconSize = '24';

  const mostRecentValue =
    weatherData && weatherData.length > 0 ? weatherData[0][metric] : 'N/A';
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

  const fontSize = useBreakpointValue({ base: 'sm', md: 'lg' });
  const paddingBottom = useBreakpointValue({ base: '16', md: '16' });

  return (
    <Box
      border="2px"
      borderColor="#fd9801"
      borderRadius="md"
      boxShadow="md"
      p="6"
      pb={paddingBottom}
      bg="#f5f5f5"
      h="500px"
      w="100%"
    >
      <Flex justify="space-between" mb="4" align="center">
        <Box fontSize={fontSize} fontWeight="bold">
          {title}
        </Box>
        {showIcons && (
          <Flex alignItems="center">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Box
                border="2px"
                borderColor="#fd9801"
                borderRadius="lg"
                px={2}
                py={1}
                mr={2}
                bg={'white'}
              >
                <Text fontSize={fontSize}>
                  Current: {formatValue(mostRecentValue)}
                </Text>
              </Box>
            </motion.div>
            <Popover>
              <PopoverTrigger>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Box>
                    <Tooltip label="Customize">
                      <IconButton
                        icon={<FaCog />}
                        variant="outline"
                        colorScheme="#fd9801"
                        size="sm"
                        mr="2"
                        bg={'white'}
                      />
                    </Tooltip>
                  </Box>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent
                borderColor="#212121"
                mr={2}
                border="2px"
                borderRadius="lg"
              >
                <PopoverCloseButton color="white" size="lg" />
                <PopoverHeader
                  fontWeight="bold"
                  fontSize="xl"
                  bg="#fd9801"
                  color="white"
                  borderRadius="md"
                >
                  Customize Chart
                </PopoverHeader>
                <PopoverBody bg={'#f5f5f5'} borderRadius="md">
                  <Text
                    fontWeight="bold"
                    fontSize="lg"
                    py={2}
                    textAlign="center"
                  >
                    Select Chart Type
                  </Text>
                  <Button
                    mr={2}
                    mb={2}
                    borderRadius="md"
                    border="1px"
                    color="#fd9801"
                    bg="white"
                    borderColor="#212121"
                    width="100%"
                    onClick={() => changeChartType('line')}
                    leftIcon={<FaChartLine size={iconSize} />}
                  >
                    LINE
                  </Button>
                  <Button
                    mr={2}
                    borderRadius="md"
                    border="1px"
                    color="#fd9801"
                    bg="white"
                    borderColor="#212121"
                    width="100%"
                    onClick={() => changeChartType('bar')}
                    leftIcon={<FaChartBar size={iconSize} />}
                  >
                    BAR
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                >
                  <Box>
                    <Tooltip label="Details">
                      <IconButton
                        icon={<BsBarChartFill />}
                        variant="outline"
                        colorScheme="#212121"
                        size="sm"
                        bg={'white'}
                      />
                    </Tooltip>
                  </Box>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent
                borderColor="#212121"
                mr={2}
                border="2px"
                borderRadius="lg"
              >
                <PopoverCloseButton color="white" size="lg" />
                <PopoverHeader
                  fontWeight="bold"
                  fontSize="xl"
                  bg="#fd9801"
                  color="white"
                  borderRadius="md"
                >
                  Chart Details
                </PopoverHeader>
                <PopoverBody bg={'#f5f5f5'} borderRadius="md">
                  <ChartDetails
                    chartType={chartType}
                    metric={metric}
                    weatherData={weatherData}
                    timePeriod={timePeriod}
                    adjustTimePeriod={adjustTimePeriod}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        )}
      </Flex>
      {children}
    </Box>
  );
};

export default ChartWrapper;
