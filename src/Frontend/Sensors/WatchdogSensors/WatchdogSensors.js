import { Box, Divider, Heading, Flex, Spinner, Text } from '@chakra-ui/react';
import { useWeatherData } from '../../WeatherDataContext';

export default function WatchdogSensors() {
    const { watchdogData, isLoading } = useWeatherData();

    if (isLoading) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box p="4" width="100%" height="100%" pt="64px">
            <Heading textAlign="center" mb="4">
                Watchdog Sensors
            </Heading>
            {watchdogData.map((entry) => (
                <Box key={entry.dataid} borderWidth="1px" borderRadius="lg" overflow="hidden" p="6" mb="4">
                    <Heading size="md" mb="2">
                        Device Location: {entry.device_location}
                    </Heading>
                    <Text><strong>Temperature:</strong> {entry.temp}°C</Text>
                    <Text><strong>Humidity:</strong> {entry.hum}%</Text>
                    <Text><strong>Water Level:</strong> {entry.water}</Text>
                    <Text><strong>Reading Time:</strong> {new Date(entry.reading_time).toLocaleString()}</Text>
                    <Divider my="4" />
                    <Text><strong>API Name:</strong> {entry.api.apiname}</Text>
                    <Text><strong>Customer Name:</strong> {entry.api.customer.name}</Text>
                </Box>
            ))}
        </Box>
    );
}
