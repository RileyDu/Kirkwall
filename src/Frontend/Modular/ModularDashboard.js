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
import { useWeatherData } from '../WeatherDataContext.js';
import { TbColumns1, TbColumns2, TbColumns3 } from 'react-icons/tb';
import { FaChevronDown } from 'react-icons/fa';

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

  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const {
    weatherData,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
    loading,
    handleTimePeriodChange,
    watchdogData,
    watchdogTempData,
    watchdogHumData,
    rivercityTempData,
    rivercityHumData,
    rivercityData,
    chartData,
    impriFreezerOneTempData,
    impriFreezerOneHumData,
    impriFreezerTwoTempData,
    impriFreezerTwoHumData,
    impriFreezerThreeTempData,
    impriFreezerThreeHumData,
    impriFridgeOneTempData,
    impriFridgeOneHumData,
    impriFridgeTwoTempData,
    impriFridgeTwoHumData,
    impriIncuOneTempData,
    impriIncuOneHumData,
    impriIncuTwoTempData,
    impriIncuTwoHumData,
  } = useWeatherData();

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

    // Close the popover before the layout change
    setIsPopoverOpen(false);
    setChartLayout(layout);
    setChartLayoutIcon(
      layout === 1 ? TbColumns1 : layout === 2 ? TbColumns2 : TbColumns3
    );

    setLayoutStable(false);
    // Reopen the popover after a short delay
    setTimeout(() => {
      setLayoutStable(true);
    }, 0);
  };

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
                // placement="top"
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
                    // bg="#212121"
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
                // onClick={isOpen ? onClose : onOpen}
                size={isLargerThan768 ? 'md' : 'sm'}
                ml={isLargerThan768 ? '2' : '4'}
              >
                <FaChevronDown />
              </MenuButton>
            </Tooltip>
            {/* <MenuList
                    placement="top"
                    bg={colorMode === 'light' ? '#212121' : 'black'}
                    border={'2px'}
                    borderColor={colorMode === 'light' ? '#212121' : 'black'}
                  > */}
            {/* {Object.keys(charts).map(chart => (
                      <MenuItem
                        key={chart}
                        onClick={() => handleMenuItemClick('grandFarm', chart)}
                        bg={
                          visibleCharts.grandFarm.includes(chart)
                            ? 'green.100'
                            : '#212121'
                        }
                        color={
                          visibleCharts.grandFarm.includes(chart)
                            ? '#212121'
                            : 'white'
                        }
                        border={'1px solid #212121'}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent={'center'}
                          w={'100%'}
                        >
                          {charts[chart]}
                          <Box ml="2">
                            {chart.charAt(0).toUpperCase() + chart.slice(1)}
                          </Box>
                        </Flex>
                      </MenuItem>
                    ))} */}
            {/* {['temperature', 'humidity'].map(chart => (
                      <MenuItem
                        key={chart}
                        onClick={() => handleMenuItemClick('garage', chart)}
                        bg={
                          visibleCharts.garage.includes(chart)
                            ? 'brand.200'
                            : '#212121'
                        }
                        color={
                          visibleCharts.garage.includes(chart)
                            ? '#212121'
                            : 'white'
                        }
                        border={'1px solid #212121'}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent={'center'}
                          w={'100%'}
                        >
                          {charts[chart]}
                          <Box ml="2">
                            {chart.charAt(0).toUpperCase() + chart.slice(1)}
                          </Box>
                        </Flex>
                      </MenuItem>
                    ))}
                    {['temperature', 'humidity'].map(chart => (
                      <MenuItem
                        key={chart}
                        onClick={() => handleMenuItemClick('rivercity', chart)}
                        bg={
                          visibleCharts.rivercity.includes(chart)
                            ? 'blue.100'
                            : '#212121'
                        }
                        color={
                          visibleCharts.rivercity.includes(chart)
                            ? '#212121'
                            : 'white'
                        }
                        border={'1px solid #212121'}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent={'center'}
                          w={'100%'}
                        >
                          {charts[chart]}
                          <Box ml="2">
                            {chart.charAt(0).toUpperCase() + chart.slice(1)}
                          </Box>
                        </Flex>
                      </MenuItem>
                    ))}
                  </MenuList> */}
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

            // Ensure dataForMetric is pointing to the correct dataset, like tempData, humidityData, etc.
            let dataForChart;
            switch (dataForMetric) {
              case 'tempData':
                dataForChart = tempData || weatherData;
                break;
              case 'humidityData':
                dataForChart = humidityData || weatherData;
                break;
              case 'windData':
                dataForChart = windData || weatherData;
                break;
              case 'rainfallData':
                dataForChart = rainfallData || weatherData;
                break;
              case 'soilMoistureData':
                dataForChart = soilMoistureData || weatherData;
                break;
              case 'leafWetnessData':
                dataForChart = leafWetnessData || weatherData;
                break;
              case 'watchdogTempData':
                dataForChart = watchdogTempData || watchdogData;
                break;
              case 'watchdogHumData':
                dataForChart = watchdogHumData || watchdogData;
                break;
              case 'rivercityTempData':
                dataForChart = rivercityTempData || rivercityData;
                break;
              case 'rivercityHumData':
                dataForChart = rivercityHumData || rivercityData;
                break;
              case 'imFreezerOneTempData':
                dataForChart = impriFreezerOneTempData;
                break;
              case 'imFreezerOneHumData':
                dataForChart = impriFreezerOneHumData;
                break;
              case 'imFreezerTwoTempData':
                dataForChart = impriFreezerTwoTempData;
                break;
              case 'imFreezerTwoHumData':
                dataForChart = impriFreezerTwoHumData;
                break;
              case 'imFreezerThreeTempData':
                dataForChart = impriFreezerThreeTempData;
                break;
              case 'imFreezerThreeHumData':
                dataForChart = impriFreezerThreeHumData;
                break;
              case 'imFridgeOneTempData':
                dataForChart = impriFridgeOneTempData;
                break;
              case 'imFridgeOneHumData':
                dataForChart = impriFridgeOneHumData;
                break;
              case 'imFridgeTwoTempData':
                dataForChart = impriFridgeTwoTempData;
                break;
              case 'imFridgeTwoHumData':
                dataForChart = impriFridgeTwoHumData;
                break;
              case 'imIncuOneTempData':
                dataForChart = impriIncuOneTempData;
                break;
              case 'imIncuOneHumData':
                dataForChart = impriIncuOneHumData;
                break;
              case 'imIncuTwoTempData':
                dataForChart = impriIncuTwoTempData;
                break;
              case 'imIncuTwoHumData':
                dataForChart = impriIncuTwoHumData;
                break;
              default:
                dataForChart = weatherData;
            }

            // Access the appropriate chart component
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
                    title={title}
                    metric={metric}
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    chart="temperature"
                    weatherData={dataForChart}
                    handleTimePeriodChange={handleTimePeriodChange}
                    // onChartChange={}
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
