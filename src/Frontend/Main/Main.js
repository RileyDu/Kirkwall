import { Box, Grid, GridItem } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { useState } from 'react';

const MainContent = ({ weatherData }) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('bar');
  const [rainfallChartType, setRainfallChartType] = useState('bar');

  const handleTempChartChange = newType => {
    setTempChartType(newType);
  };

  const handleHumidityChartChange = newType => {
    setHumidityChartType(newType);
  };

  const handleWindChartChange = newType => {
    setWindChartType(newType);
  };

  const handleRainfallChartChange = newType => {
    setRainfallChartType(newType);
  };

  return (
    <Box bg="lightgrey" flex="1" p="4">
      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Temperature Over Time (°F)"
            onChartChange={handleTempChartChange}
            data={weatherData}
            metric="temperature"
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" />
            ) : (
              <BarChart data={weatherData} metric="temperature" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Humidity Percentage Levels"
            onChartChange={handleHumidityChartChange}
            data={weatherData}
            metric="percent_humidity"
          >
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Rainfall (inches)"
            onChartChange={handleRainfallChartChange}
            data={weatherData}
            metric="rain_15_min_inches"
          >
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Wind Speed (mph)"
            onChartChange={handleWindChartChange}
            data={weatherData}
            metric="wind_speed"
          >
            {windChartType === 'line' ? (
              <LineChart data={weatherData} metric="wind_speed" />
            ) : (
              <BarChart data={weatherData} metric="wind_speed" />
            )}
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default MainContent;
