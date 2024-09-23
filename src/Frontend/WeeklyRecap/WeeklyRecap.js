import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { SummaryMetrics } from '../Modular/SummaryMetrics.js';
import { CustomerSettings } from '../Modular/CustomerSettings.js';
import { useAuth } from '../AuthComponents/AuthContext.js';

const WeeklyRecap = ({ statusOfAlerts }) => {
    const { currentUser } = useAuth();
    const userEmail = currentUser?.email;
    const userMetrics =
        CustomerSettings.find(customer => customer.email === userEmail)?.metric || [];

    const [isMonday, setIsMonday] = useState(false);

    useEffect(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (dayOfWeek === 1) { // 1 represents Monday
            setIsMonday(true);
            console.log('Today is Monday! Fetching weekly recap data...');
            // Place your data fetching logic here
            // For example: fetchDataAndUpdateDB();
        } else {
            setIsMonday(false);
        }
    }, []);

    console.log(userMetrics);

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
                    {/* Add components or data visualization for weekly recap */}
                    <p>Weekly recap data will be displayed here.</p>
                </Box>
            )}
        </Box>
    );
};

export default WeeklyRecap;
