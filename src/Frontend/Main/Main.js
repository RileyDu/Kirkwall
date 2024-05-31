import { Box, Grid, GridItem } from '@chakra-ui/react';
import { LineChart, BarChart } from '../Charts/Charts';
import ChartWrapper from '../Charts/ChartWrapper';

const MainContent = ({ weatherData }) => (
    <Box bg="white" flex="1" p="4">
      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        <GridItem colSpan={1}>
          <ChartWrapper title="Temperature Over Time">
            <LineChart data={weatherData} metric="temperature" />
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Humidity Levels">
            <BarChart data={weatherData} metric="percent_humidity" />
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Rainfall (15 min)">
            <BarChart data={weatherData} metric="rain_15_min_inches" />
          </ChartWrapper>
        </GridItem>
        <GridItem colSpan={1}>
          <ChartWrapper title="Wind Speed">
            <LineChart data={weatherData} metric="wind_speed" />
          </ChartWrapper>
        </GridItem>
      </Grid>
    </Box>
  );

  
  export default MainContent