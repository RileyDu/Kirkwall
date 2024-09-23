import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SummaryMetrics } from '../Modular/SummaryMetrics.js';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import { WeeklyRecapHelper } from './WeeklyRecapHelper.js';

const WeeklyRecap = ({ statusOfAlerts }) => {
    const { currentUser } = useAuth();
    const userEmail = currentUser?.email;
    const userMetrics =
        CustomerSettings.find(customer => customer.email === userEmail)?.metric || [];

    const [isMonday, setIsMonday] = useState(false);
    const [recapData, setRecapData] = useState({});

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (dayOfWeek === 1) { // 1 represents Monday
            setIsMonday(true);
            console.log('Today is Monday! Fetching weekly recap data...');
            
            // Fetch the data and set it in the state
            WeeklyRecapHelper(userMetrics).then((data) => {
                setRecapData(data);
            });
        } else {
            setIsMonday(false);
        }
    }, [userMetrics]);

    const getLabelForMetric = (metric) => {
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

    return (
        <Box
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            pt={statusOfAlerts ? '10px' : '74px'}
        >
            <Flex justifyContent="space-between" alignItems="center">
                <Heading>Weekly Recap</Heading>
            </Flex>
            {isMonday && (
                <Box mt={4}>
                    {Object.keys(recapData).length === 0 ? (
                        <Text>Loading weekly recap data...</Text>
                    ) : (
                        Object.keys(recapData).map((metric) => {
                            const { label, addSpace } = getLabelForMetric(metric);
                            return (
                                <Box key={metric} mb={4} p={4} borderWidth="1px" borderRadius="lg">
                                    <Heading size="md">{metric}</Heading>
                                    <Text>
                                        High: {recapData[metric]?.high}
                                        {addSpace ? ' ' : ''}
                                        {label}
                                    </Text>
                                    <Text>
                                        Low: {recapData[metric]?.low}
                                        {addSpace ? ' ' : ''}
                                        {label}
                                    </Text>
                                    <Text>
                                        Avg: {recapData[metric]?.avg}
                                        {addSpace ? ' ' : ''}
                                        {label}
                                    </Text>
                                </Box>
                            );
                        })
                    )}
                </Box>
            )}
        </Box>
    );
};

export default WeeklyRecap;
