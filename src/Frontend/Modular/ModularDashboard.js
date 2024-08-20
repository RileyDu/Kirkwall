import React, { useEffect, useState } from 'react';
import { CustomerSettings } from './CustomerSettings.js';
import { MetricSettings } from './MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import {
  Box,
  useColorMode,
  useMediaQuery,
  Heading,
  Grid,
  GridItem,
  Flex,
  Menu,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  IconButton,
  MenuButton,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import ChartDataMapper from './ChartDataMapper.js';
import { TbColumns1, TbColumns2, TbColumns3 } from 'react-icons/tb';
import { FaChessRook } from 'react-icons/fa';
import { FaChevronDown } from 'react-icons/fa';
import { useWeatherData } from '../WeatherDataContext.js';
import { keyframes } from '@emotion/react';


import { motion } from 'framer-motion';
const MotionBox = motion(Box);

const chartComponents = {
  line: LineChart,
  bar: BarChart,
  // Add more chart types here as needed
};

const ModularDashboard = ({ statusOfAlerts }) => {
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [metricSettings, setMetricSettings] = useState([]);

  const [layoutStable, setLayoutStable] = useState(true);
  const [chartLayoutIcon, setChartLayoutIcon] = useState(TbColumns2);
  const [chartLayout, setChartLayout] = useState(2);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { colorMode } = useColorMode();
  const { currentUser } = useAuth();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');


  const { chartData, handleTimePeriodChange, loading } = useWeatherData();

  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');


  useEffect(() => {
    if (currentUser) {
      const customer = CustomerSettings.find(
        customer => customer.email === currentUser.email
      );
      if (customer) {
        setCustomerMetrics(customer.metric);
        setCustomerName(customer.name);
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

  const handleLayoutChange = layout => {
    if (layout === chartLayout) return;

    setIsPopoverOpen(false);
    setChartLayout(layout);
    setChartLayoutIcon(
      layout === 1 ? TbColumns1 : layout === 2 ? TbColumns2 : TbColumns3
    );

    setLayoutStable(false);
    setTimeout(() => {
      setLayoutStable(true);
    }, 0);
  };

  const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100%">
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color={getLogoColor()}
        />
      </Flex>
    );
  }

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Flex justify={isLargerThan768 ? 'space-between' : 'center'}>
        <Heading size="lg" mb="4">
          {customerName} Dashboard
        </Heading>
        <Menu>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            {isLargerThan768 && (
              <Popover
                isOpen={isPopoverOpen}
                onClose={() => setIsPopoverOpen(false)}
              >
                <PopoverTrigger>
                  <span>
                    <Tooltip label="Chart Layout">
                      <IconButton
                        icon={chartLayoutIcon}
                        variant="outline"
                        size={iconSize}
                        color="#212121"
                        bg={'brand.400'}
                        _hover={{ bg: 'brand.800' }}
                        border={'2px solid #fd9801'}
                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                      />
                    </Tooltip>
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  width={'200px'}
                  color="white"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={colorMode === 'light' ? '#212121' : '#fd9801'}
                >
                  <PopoverArrow
                    borderTop={'2px solid'}
                    borderTopColor={
                      colorMode === 'light' ? '#212121' : '#fd9801'
                    }
                    borderLeft={'2px solid'}
                    borderLeftColor={
                      colorMode === 'light' ? '#212121' : '#fd9801'
                    }
                  />
                  <PopoverBody>
                    <Flex justify="space-evenly">
                      <Tooltip label="1 Column">
                        <IconButton
                          icon={<TbColumns1 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="1 Column Layout"
                          onClick={() => handleLayoutChange(1)}
                          color="#212121"
                          bg={chartLayout === 1 ? 'brand.800' : 'brand.400'}
                          _hover={{ bg: 'brand.800' }}
                          border={'2px solid #fd9801'}
                        />
                      </Tooltip>
                      <Tooltip label="2 Column">
                        <IconButton
                          icon={<TbColumns2 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="2 Column Layout"
                          onClick={() => handleLayoutChange(2)}
                          color="#212121"
                          bg={chartLayout === 2 ? 'brand.800' : 'brand.400'}
                          _hover={{ bg: 'brand.800' }}
                          border={'2px solid #fd9801'}
                        />
                      </Tooltip>
                      <Tooltip label="3 Column">
                        <IconButton
                          icon={<TbColumns3 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="3 Column Layout"
                          onClick={() => handleLayoutChange(3)}
                          color="#212121"
                          bg={chartLayout === 3 ? 'brand.800' : 'brand.400'}
                          _hover={{ bg: 'brand.800' }}
                          border={'2px solid #fd9801'}
                        />
                      </Tooltip>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}
            <Tooltip label="Toggle Charts">
              <MenuButton
                as={Button}
                bg="brand.400"
                color="black"
                _hover={{ bg: '#d7a247' }}
                border={'2px solid #fd9801'}
                size={isLargerThan768 ? 'md' : 'sm'}
                ml={isLargerThan768 ? '2' : '4'}
              >
                <FaChevronDown />
              </MenuButton>
            </Tooltip>
          </motion.div>
        </Menu>
      </Flex>

      {layoutStable && (
        <Grid
          templateColumns={{
            base: '1fr',
            md: `repeat(${chartLayout}, 1fr)`,
            lg: `repeat(${chartLayout}, 1fr)`,
          }}
          gap="6"
        >
          {customerMetrics.map(metric => {
            const settingsOfMetric = metricSettings.find(
              m => m.metric === metric
            );
            const title = settingsOfMetric
              ? settingsOfMetric.name
              : 'Metric Title';
            const dataForMetric = settingsOfMetric?.soloData;
            const chartDataForMetric = chartData.find(
              chart => chart.metric === metric
            );
            const chartType = chartDataForMetric?.type || 'bar';

            const dataForChart = ChartDataMapper({ dataForMetric });

            const ChartComponent = chartComponents[chartType] || LineChart;

            return (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <GridItem
                  key={metric}
                  colSpan={{ base: 1, lg: 1 }}
                  display="flex"
                >
                  <ChartWrapper
                    key={metric}
                    title={title}
                    metric={metric}
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    chart="temperature"
                    weatherData={dataForChart}
                    handleTimePeriodChange={handleTimePeriodChange}
                    typeOfChart={chartType}
                    chartDataForMetric={chartDataForMetric}
                  >
                    <ChartComponent
                      data={dataForChart}
                      metric={metric}
                      style={{ flex: 1 }}
                    />
                  </ChartWrapper>
                </GridItem>
              </MotionBox>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default ModularDashboard;
