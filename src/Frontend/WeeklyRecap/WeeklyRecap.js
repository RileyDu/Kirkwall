import { Box, Flex, Heading } from '@chakra-ui/react';

const WeeklyRecap = ({ statusOfAlerts }) => {
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
      </Box>
    );
};


export default WeeklyRecap