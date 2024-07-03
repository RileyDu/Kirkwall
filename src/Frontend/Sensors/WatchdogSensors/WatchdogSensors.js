import { Box, Divider, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import ChartWrapper from '../../Charts/ChartWrapper';
import { BarChart, LineChart } from '../../Charts/Charts';
import MiniDashboard from '../../Charts/ChartDashboard';
import { useWeatherData } from '../../WeatherDataContext';

export default function WatchdogSensors() {

    const { watchdogData } = useWeatherData();

    return (
        <Box p="4" width={'100%'} height={'100%'} pt={'64px'}>
            <Heading  textAlign={'center'} mb={'4'}>
                Watchdog Sensors
            </Heading>
            {/* <Box width="100%">
                <MiniDashboard weatherData={[]} metric="watchdog" />
            </Box>
            <Flex direction="row" justifyContent="space-between">
                <Box width="100%">
                    <ChartWrapper title="Watchdog" weatherData={[]}>
                        <LineChart data={[]} metric="watchdog" />
                    </ChartWrapper>
                    <Divider my={'8'} borderColor="#212121" borderWidth="4px" borderRadius={"full"} />
                    <ChartWrapper title="Watchdog" weatherData={[]}>
                        <BarChart data={[]} metric="watchdog" />
                    </ChartWrapper>
                </Box>
            </Flex> */}
        </Box>
    );
}