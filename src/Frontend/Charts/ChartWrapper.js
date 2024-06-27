import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, IconButton, Tooltip, useBreakpointValue, useDisclosure } from '@chakra-ui/react';
import { FaExpandAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ChartExpandModal from './ChartExpandModal'; // Adjust the path as necessary
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <>
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
              <Tooltip label="Expand Chart">
                <IconButton
                  icon={<FaExpandAlt />}
                  variant="outline"
                  colorScheme="#212121"
                  size="sm"
                  bg={'white'}
                  onClick={onOpen}
                />
              </Tooltip>
            </Flex>
          )}
        </Flex>
        {children}
      </Box>
      <ChartExpandModal isOpen={isOpen} onClose={onClose} title={title} children={children} weatherData={weatherData} metric={metric}/>        
    </>
  );
};

export default ChartWrapper;
