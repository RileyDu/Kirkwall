import { Box, Grid, GridItem } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';
import { useState } from 'react';

const MainContent = ({ weatherData }) => {
  const [tempChartType, setTempChartType] = useState('line');
  const [humidityChartType, setHumidityChartType] = useState('line');
  const [windChartType, setWindChartType] = useState('line');
  const [rainfallChartType, setRainfallChartType] = useState('line');
  const [tempChartInterval, setTempChartInterval] = useState(1);
  const [humidityChartInterval, setHumidityChartInterval] = useState(1);
  const [windChartInterval, setWindChartInterval] = useState(1);
  const [rainfallChartInterval, setRainfallChartInterval] = useState(1);



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
    <Box bg="#fd9801" flex="1" p="4">
      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        <GridItem colSpan={1}>
          <ChartWrapper
            title="Temperature Over Time"
            onChartChange={handleTempChartChange}
          >
            {tempChartType === 'line' ? (
              <LineChart data={weatherData} metric="temperature" />
            ) : (
              <BarChart data={weatherData} metric="temperature" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Humidity Levels" onChartChange={handleHumidityChartChange}>
            {humidityChartType === 'line' ? (
              <LineChart data={weatherData} metric="percent_humidity" />
            ) : (
              <BarChart data={weatherData} metric="percent_humidity" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Rainfall (15 min)" onChartChange={handleRainfallChartChange}>
            {rainfallChartType === 'line' ? (
              <LineChart data={weatherData} metric="rain_15_min_inches" />
            ) : (
              <BarChart data={weatherData} metric="rain_15_min_inches" />
            )}
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Wind Speed" onChartChange={handleWindChartChange}>
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
