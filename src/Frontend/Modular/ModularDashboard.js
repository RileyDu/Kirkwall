// =========================
// Imports Section
// =========================

// React and Hooks
import React, { useEffect, useState } from 'react';

// Chakra UI Components and Hooks
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
  MenuItem,
  MenuList,
  Checkbox,
  useDisclosure,
  Text,
} from '@chakra-ui/react';

// Animation Libraries
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Icons
import { TbColumns1, TbColumns2, TbColumns3 } from 'react-icons/tb';
import { FaChessRook, FaChevronDown } from 'react-icons/fa';

// HTTP Client
import axios from 'axios';

// Routing
import { useNavigate } from 'react-router-dom';

// Local Components and Contexts
import { CustomerSettings } from './CustomerSettings.js';
import { MetricSettings } from './MetricSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import ChartWrapper from '../Charts/ChartWrapper.js';
import { LineChart, BarChart } from '../Charts/Charts.js';
import ChartDataMapper from './ChartDataMapper.js';
import { useWeatherData } from '../WeatherDataContext.js';
import ChatGPTComponent from '../AI/ChatGPTComponent.js';

// =========================
// Motion-Enhanced Components
// =========================
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

// =========================
// Chart Components Mapping
// =========================
const chartComponents = {
  line: LineChart,
  bar: BarChart,
  // Add more chart types here as needed
};

// =========================
// ModularDashboard Component
// =========================
const ModularDashboard = ({
  statusOfAlerts,
  expandButtonRef,
  runTour,
  setRunTour,
  runThresholdTour,
  setRunThresholdTour,
  setIsTourRunning,
  isTourRunning,
  activeChartID,
  setActiveChartID,
}) => {
  // -------------------------
  // State Variables
  // -------------------------
  const [customerMetrics, setCustomerMetrics] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [metricSettings, setMetricSettings] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);

  const [layoutStable, setLayoutStable] = useState(true);
  const [chartLayoutIcon, setChartLayoutIcon] = useState(TbColumns2);
  const [chartLayout, setChartLayout] = useState(2);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showNewUserText, setShowNewUserText] = useState(false);

  // -------------------------
  // Chakra UI Hooks
  // -------------------------
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const iconSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // -------------------------
  // Authentication and Navigation
  // -------------------------
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // -------------------------
  // Weather Data Context
  // -------------------------
  const {
    chartData,
    fetchChartData,
    setChartData,
    handleTimePeriodChange,
    loading,
  } = useWeatherData();

  // -------------------------
  // Helper Functions
  // -------------------------

  /**
   * Sorts chart data based on selected customer metrics
   * @param {Array} chartData - Array of chart data
   */
  const sortChartDataPerCustomer = (chartData) => {
    if (chartData && metricSettings.length > 0) {
      const filteredData = chartData.filter((chart) =>
        metricSettings.some((metric) => metric.metric === chart.metric)
      );
      setFilteredChartData(filteredData);
    }
  };

  /**
   * Determines the logo color based on the current color mode
   * @returns {string} - Color value
   */
  const getLogoColor = () => (colorMode === 'light' ? 'black' : 'white');

  /**
   * Handles layout change for the dashboard
   * @param {number} layout - Desired layout (1, 2, or 3 columns)
   */
  const handleLayoutChange = (layout) => {
    if (layout === chartLayout) return;

    setIsPopoverOpen(false);
    setChartLayout(layout);
    setChartLayoutIcon(
      layout === 1 ? TbColumns1 : layout === 2 ? TbColumns2 : TbColumns3
    );

    setLayoutStable(false);
    setTimeout(() => {
      setLayoutStable(true);
    }, 1);
  };

  /**
   * Handles menu item click to toggle chart visibility
   * @param {string} metric - Metric identifier
   */
  const handleMenuItemClick = async (metric) => {
    // Toggle hidden state locally
    setFilteredChartData((prevData) =>
      prevData.map((chart) =>
        chart.metric === metric ? { ...chart, hidden: !chart.hidden } : chart
      )
    );

    // Find chartData based on metric
    const chartDataForMetric = filteredChartData.find(
      (chart) => chart.metric === metric
    );

    if (chartDataForMetric) {
      const updatedHiddenState = !chartDataForMetric.hidden;

      // Wait for the chart edit to complete before fetching new data
      try {
        await handleChartEdit(chartDataForMetric.id, updatedHiddenState);
        console.log('Chart update successful');

        // Optionally fetch updated chart data
        // fetchChartData(setChartData);
      } catch (error) {
        console.error('Error updating chart:', error);
      }
    }
  };

  /**
   * Sends a PUT request to update chart visibility on the server
   * @param {string} id - Chart identifier
   * @param {boolean} hidden - New hidden state
   */
  const handleChartEdit = async (id, hidden) => {
    // Find the chart data by ID
    const chartDataForMetric = chartData.find((chart) => chart.id === id);

    if (!chartDataForMetric) {
      console.error(`Chart with ID ${id} not found.`);
      return;
    }

    // Prepare updated chart details
    const updatedChartDetails = {
      id: chartDataForMetric.id,
      metric: chartDataForMetric.metric,
      timeperiod: chartDataForMetric.timeperiod,
      type: chartDataForMetric.type,
      location: chartDataForMetric.location,
      hidden: hidden,
    };

    try {
      console.log('Sending chart update:', updatedChartDetails);

      // Perform Axios PUT request to update the chart
      const response = await axios.put(`/api/update_chart`, updatedChartDetails);

      // Log the updated chart data returned from the server
      console.log('Updated chart:', response.data);
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  // -------------------------
  // Effects
  // -------------------------

  // Effect: Initialize customer metrics and name based on the current user
  useEffect(() => {
    if (currentUser) {
      const customer = CustomerSettings.find(
        (customer) => customer.email === currentUser.email
      );
      if (customer) {
        setCustomerMetrics(customer.metric);
        setCustomerName(customer.name);
      }
    }
  }, [currentUser]);

  // Effect: Update metric settings when customer metrics change
  useEffect(() => {
    if (customerMetrics.length > 0) {
      const selectedMetrics = MetricSettings.filter((metric) =>
        customerMetrics.includes(metric.metric)
      );
      setMetricSettings(selectedMetrics);
    }
  }, [customerMetrics]);

  // Effect: Sort chart data whenever chartData or metricSettings change
  useEffect(() => {
    if (chartData && metricSettings.length > 0) {
      sortChartDataPerCustomer(chartData);
    }
  }, [chartData, metricSettings]);

  // Effect: Show new user text after a delay if loading is true
  useEffect(() => {
    let timer;

    if (loading) {
      timer = setTimeout(() => setShowNewUserText(true), 2500); // 2.5-second delay
    } else {
      setShowNewUserText(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  // -------------------------
  // Animations
  // -------------------------

  // Define keyframes for spinning animation
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  // =========================
  // Render Loading States
  // =========================

  // Render loading state with animated icon and optional new user text
  if (loading) {
    return (
      <Flex
        direction="column"
        justify="center"
        align="center"
        height="100vh"
        textAlign="center"
        padding="4"
      >
        <Box
          as={FaChessRook}
          animation={`${spin} infinite 2s linear`}
          fontSize="6xl"
          color={getLogoColor()}
          mb={4}
        />
        {showNewUserText && (
          <>
            <Text fontSize="lg">
              New User? Please schedule an onboarding meeting to get you fully
              registered!
            </Text>
            <Text
              fontSize="lg"
              textDecor="underline"
              cursor="pointer"
              onClick={() => navigate('/onboarding')}
              mt={2}
            >
              Click here!
            </Text>
          </>
        )}
      </Flex>
    );
  }

  // Render fallback loading state if essential data isn't available
  if (
    !chartData ||
    metricSettings.length === 0 ||
    filteredChartData.length === 0 ||
    loading === true
  ) {
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

  // =========================
  // Main Render
  // =========================
  return (
    <Box
      bg={colorMode === 'light' ? '#FFFFFF' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      {/* Header Section */}
      <Flex justify={isLargerThan768 ? 'space-between' : 'center'}>
        <Heading size="lg" mb="4">
          {customerName} Dashboard
        </Heading>
        <Menu isOpen={isOpen}>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            {/* Chart Layout Popover for Larger Screens */}
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
                        bg={'#cee8ff'}
                        _hover={{ bg: '#3D5A80', color: 'white' }}
                        _active={{ bg: '#3D5A80', color: 'white' }}
                        border={'2px solid #3D5A80'}
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
                  borderColor="#212121"
                >
                  <PopoverArrow
                    borderTop={'2px solid'}
                    borderTopColor="#212121"
                    borderLeft={'2px solid'}
                    borderLeftColor="#212121"
                  />
                  <PopoverBody>
                    <Flex justify="space-evenly">
                      {/* Layout Option: 1 Column */}
                      <Tooltip label="1 Column">
                        <IconButton
                          icon={<TbColumns1 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="1 Column Layout"
                          onClick={() => handleLayoutChange(1)}
                          color="#212121"
                          bg={chartLayout === 1 ? '#3D5A80' : '#cee8ff'}
                          _hover={{ bg: '#3D5A80', color: 'white' }}
                          border={'2px solid #3D5A80'}
                        />
                      </Tooltip>

                      {/* Layout Option: 2 Columns */}
                      <Tooltip label="2 Column">
                        <IconButton
                          icon={<TbColumns2 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="2 Column Layout"
                          onClick={() => handleLayoutChange(2)}
                          color="#212121"
                          bg={chartLayout === 2 ? '#3D5A80' : '#cee8ff'}
                          _hover={{ bg: '#3D5A80', color: 'white' }}
                          border={'2px solid #3D5A80'}
                        />
                      </Tooltip>

                      {/* Layout Option: 3 Columns */}
                      <Tooltip label="3 Column">
                        <IconButton
                          icon={<TbColumns3 />}
                          variant="outline"
                          size={iconSize}
                          aria-label="3 Column Layout"
                          onClick={() => handleLayoutChange(3)}
                          color="#212121"
                          bg={chartLayout === 3 ? '#3D5A80' : '#cee8ff'}
                          _hover={{ bg: '#3D5A80', color: 'white' }}
                          border={'2px solid #3D5A80'}
                        />
                      </Tooltip>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            )}

            {/* Toggle Charts Menu */}
            <Tooltip label="Toggle Charts">
              <MenuButton
                as={Button}
                bg="#cee8ff"
                color="black"
                _hover={{ bg: '#3D5A80', color: 'white' }}
                _active={{ bg: '#3D5A80', color: 'white' }}
                border={'2px solid #3D5A80'}
                onClick={isOpen ? onClose : onOpen}
                size={isLargerThan768 ? 'md' : 'sm'}
                ml={isLargerThan768 ? '2' : '4'}
              >
                <FaChevronDown />
              </MenuButton>
            </Tooltip>

            {/* Charts Toggle Menu List */}
            <MenuList
              placement="top"
              bg={colorMode === 'light' ? '#212121' : 'black'}
              border={'2px'}
              borderColor={colorMode === 'light' ? '#212121' : 'black'}
            >
              {customerMetrics.map((metric, index) => (
                <MenuItem
                  key={metric}
                  bg={index % 2 === 0 ? '#212121' : '#303030'} // Alternate between two colors
                  color="white"
                  border={'1px solid #212121'}
                  cursor={'default'}
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    w="100%"
                  >
                    <Box display="flex" alignItems="center">
                      <Box ml="2">
                        {metricSettings.find((m) => m.metric === metric)?.name}
                      </Box>
                    </Box>
                    <Checkbox
                      isChecked={
                        !filteredChartData?.find(
                          (chart) => chart.metric === metric
                        )?.hidden
                      }
                      onChange={() => handleMenuItemClick(metric)}
                      colorScheme="green"
                    />
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </motion.div>
        </Menu>
      </Flex>

      {/* =========================
          Charts Grid
      ========================= */}
      <AnimatePresence>
        {layoutStable && (
          <MotionGrid
            layout // Ensure the Grid itself is aware of layout changes
            templateColumns={{
              base: '1fr',
              md: `repeat(${chartLayout}, 1fr)`,
              lg: `repeat(${chartLayout}, 1fr)`,
            }}
            gap="4"
          >
            {customerMetrics.map((metric, index) => {
              // Retrieve settings and data for each metric
              const settingsOfMetric = metricSettings.find(
                (m) => m.metric === metric
              );
              const title = settingsOfMetric
                ? settingsOfMetric.name
                : 'Metric Title';
              const dataForMetric = settingsOfMetric?.soloData;
              const chartDataForMetric = filteredChartData.find(
                (chart) => chart.metric === metric
              );
              const chartType = chartDataForMetric?.type;

              const isChartHidden = filteredChartData?.find(
                (chart) => chart.metric === metric
              )?.hidden;
              const dataForChart = ChartDataMapper({ dataForMetric });

              const ChartComponent = chartComponents[chartType] || LineChart;

              return (
                <AnimatePresence key={index}>
                  {!isChartHidden && (
                    <MotionBox
                      layout // This will ensure smooth position transitions
                      initial={{ opacity: 0, height: 'auto', scale: 0.5 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0 }}
                      transition={{ duration: 2 }}
                    >
                      <MotionGridItem
                        layout
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
                          weatherData={dataForChart}
                          handleTimePeriodChange={handleTimePeriodChange}
                          typeOfChart={chartType}
                          chartDataForMetric={chartDataForMetric}
                          handleMenuItemClick={handleMenuItemClick}
                          setFilteredChartData={setFilteredChartData}
                          chartLayout={chartLayout}
                          expandButtonRef={expandButtonRef}
                          runTour={runTour}
                          setRunTour={setRunTour}
                          runThresholdTour={runThresholdTour}
                          setRunThresholdTour={setRunThresholdTour}
                          isTourRunning={isTourRunning}
                          setIsTourRunning={setIsTourRunning}
                          activeChartID={activeChartID}
                          setActiveChartID={setActiveChartID}
                        >
                          {/* Render the appropriate chart component */}
                          <ChartComponent
                            data={dataForChart}
                            metric={metric}
                            style={{ flex: 1 }}
                          />
                        </ChartWrapper>
                      </MotionGridItem>
                    </MotionBox>
                  )}
                </AnimatePresence>
              );
            })}
          </MotionGrid>
        )}
      </AnimatePresence>
    </Box>
  );
};

// =========================
// Export Component
// =========================
export default ModularDashboard;
