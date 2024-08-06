import { Box, Text, Flex, useColorMode } from '@chakra-ui/react';
import { MinusIcon, AddIcon } from '@chakra-ui/icons';

const getLabelForMetric = metric => {
  const metricLabels = {
    temperature: { label: '°F', addSpace: false },
    temp: { label: '°F', addSpace: false },
    rctemp: { label: '°F', addSpace: false },

    imFreezerOneTemp: { label: '°C', addSpace: false },
    imFreezerTwoTemp: { label: '°C', addSpace: false },
    imFreezerThreeTemp: { label: '°C', addSpace: false },
    imFridgeOneTemp: { label: '°C', addSpace: false },
    imFridgeTwoTemp: { label: '°C', addSpace: false },
    imIncubatorOneTemp: { label: '°C', addSpace: false },
    imIncubatorTwoTemp: { label: '°C', addSpace: false },

    imFreezerOneHum: { label: '%', addSpace: false },
    imFreezerTwoHum: { label: '%', addSpace: false },
    imFreezerThreeHum: { label: '%', addSpace: false },
    imFridgeOneHum: { label: '%', addSpace: false },
    imFridgeTwoHum: { label: '%', addSpace: false },
    imIncubatorOneHum: { label: '%', addSpace: false },
    imIncubatorTwoHum: { label: '%', addSpace: false },

    hum: { label: '%', addSpace: false },
    percent_humidity: { label: '%', addSpace: false },
    humidity: { label: '%', addSpace: false },
    rain_15_min_inches: { label: 'inches', addSpace: true },
    wind_speed: { label: 'MPH', addSpace: true },
    soil_moisture: { label: 'centibars', addSpace: true },
    leaf_wetness: { label: 'out of 15', addSpace: true },
  };

  return metricLabels[metric] || { label: '', addSpace: false };
};

const MiniDashboard = ({ weatherData, metric, adjustTimePeriod, setCurrentValue }) => {
  const reversedData = [...weatherData]?.reverse();
  const currentData = reversedData.map((data) => data[metric]);

  const { colorMode } = useColorMode();

  const min = currentData.length > 0 ? Math.min(...currentData) : 'N/A';
  const max = currentData.length > 0 ? Math.max(...currentData) : 'N/A';
  const mostRecentValue =
    currentData.length > 0 ? currentData[currentData.length - 1] : 'N/A';

    if (setCurrentValue) setCurrentValue(mostRecentValue);

  const calculateTimePeriod = (dataLength) => {
    const totalMinutes = metric === 'temp' || metric === 'hum' ? dataLength * 10 : dataLength * 5;
    const totalHours = Math.floor(totalMinutes / 60);

    if (totalHours < 24) {
      return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
    } else if (totalHours < 72) {
      return '1 day';
    } else if (totalHours < 168) {
      return '3 days';
    } else {
      return '1 week';
    }
  };

  const timePeriod = calculateTimePeriod(currentData.length - 1);
  const { label, addSpace } = getLabelForMetric(metric);
  const formatValue = (value) => `${value}${addSpace ? ' ' : ''}${label}`;

  return (
    <Box>
      <Flex justifyContent="space-evenly" mb={4} >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="2px solid"
          borderColor={colorMode === 'light' ? 'brand.800' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(mostRecentValue)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Current</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="2px solid"
          borderColor={colorMode === 'light' ? 'brand.800' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(min)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Low</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="2px solid"
          borderColor={colorMode === 'light' ? 'brand.800' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
            {formatValue(max)}
          </Text>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>High</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          border="2px solid"
          borderColor={colorMode === 'light' ? 'brand.800' : 'white'}
          color={colorMode === 'light' ? '#212121' : 'white'}
          bg={colorMode === 'light' ? 'white' : ''}
          borderRadius="md"
          boxShadow="lg"
          m={1}
          width={['70px', '100px', '150px', '175px']}
          textAlign="center"
        >
          <Flex alignItems="center">
            <Text fontSize={['sm', 'md', 'xl', '2xl']} fontWeight="bold">
              {timePeriod}
            </Text>
          </Flex>
          <Text fontSize={['xs', 'sm', 'lg', 'xl']}>Time</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default MiniDashboard;
