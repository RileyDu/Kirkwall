import React from 'react';
import { Box, Heading, Text, Spinner, Flex, Divider } from '@chakra-ui/react';
import ReactSpeedometer from 'react-d3-speedometer';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import WindGauageStyling from './WindGaugeStyling.css';

const getCardinalDirection = (degree) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degree % 360) / 45);
  return directions[index % 8];
};

export default function WindSensors({ weatherData }) {
  if (!weatherData) {
    console.log('WeatherData is not defined', weatherData);
    return (
      <Box p="4" width="100%" height="100%" textAlign="center">
        <Spinner size="xl" />
        <Text mt="4">Loading wind data...</Text>
      </Box>
    );
  }

  const latestWindSpeed = weatherData[0]?.wind_speed;
  const latestWindDirection = weatherData[0]?.wind_direction;

  if (latestWindSpeed === undefined) {
    return (
      <Box p="4" width="100%" height="100%" textAlign="center">
        <Heading size="xl">Wind Sensors</Heading>
        <Box p="4" width="100%" height="100%" textAlign="center">
          <Text>No wind data available.</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100%" textAlign="center" p={'4'}>
      <Heading size="xl" py={'4'}>
        Wind Sensors
      </Heading>
      <Box width="100%" mb="4">
        <MiniDashboard metric="wind_speed" />
      </Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        p="4"
        textAlign="center"
        border={'1px'}
        borderColor="#fd9801"
        borderRadius="md"
        boxShadow="md"
        mb="4"
      >
        <Text fontSize="xxx-large" mb={'6'} mt={'6'}>
          Current Wind Speed and Direction: {latestWindSpeed} MPH {getCardinalDirection(latestWindDirection)}
        </Text>
        <Box marginBottom={'-40px'}>
          <ReactSpeedometer
            className="custom-speedometer"
            minValue={0}
            maxValue={100}
            value={Number(latestWindSpeed)}
            segments={9}
            segmentColors={[
              '#00FF00', // Calm
              '#7FFF00', // Light Breeze
              '#FFFF00', // Gentle Breeze
              '#FFD700', // Moderate Breeze
              '#FFA500', // Fresh Breeze
              '#FF8C00', // Strong Breeze
              '#FF4500', // Gale
              '#FF0000', // Strong Gale
              '#8B0000', // Storm
            ]}
            customSegmentStops={[0, 5, 11, 19, 28, 38, 49, 61, 74, 100]}
            customSegmentLabels={[
              { text: '0-5', position: 'OUTSIDE' },
              { text: '6-11', position: 'OUTSIDE' },
              { text: '12-19', position: 'OUTSIDE' },
              { text: '20-28', position: 'OUTSIDE' },
              { text: '29-38', position: 'OUTSIDE' },
              { text: '39-49', position: 'OUTSIDE' },
              { text: '50-61', position: 'OUTSIDE' },
              { text: '62-74', position: 'OUTSIDE' },
              { text: '75+', position: 'OUTSIDE' },
            ]}
            needleHeightRatio={0.7}
            needleColor="#000000"
            needleTransitionDuration={1000}
            needleTransition="easeElastic"
            height={400}
            width={600}
            textColor="black"
            valueTextShadowColor="black"
            currentValueText=" "
          />
        </Box>
      </Flex>
      <Divider
        my={'8'}
        borderColor="#212121"
        borderWidth="4px"
        borderRadius={'full'}
      />
      <Box width="100%" mb="4">
        <ChartWrapper title="Wind Speed Over Time">
          <LineChart data={weatherData} metric="wind_speed" />
        </ChartWrapper>
      </Box>
      <Divider
        my={'8'}
        borderColor="#212121"
        borderWidth="4px"
        borderRadius={'full'}
      />
      <Box width="100%" mb="4">
        <ChartWrapper title="Wind Speed Distribution">
          <BarChart data={weatherData} metric="wind_speed" />
        </ChartWrapper>
      </Box>
    </Box>
  );
}
