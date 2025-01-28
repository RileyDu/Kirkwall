import React from 'react';
import { InlineWidget } from 'react-calendly';
import { Box, Heading } from '@chakra-ui/react';

export default function Onboarding() {
  // Fixed background for the card
  const cardBg = 'gray.500';

  // Fixed Calendly color parameters
  const calendlyUrl = 'https://calendly.com/ujjwal-kirkwall/30min?background_color=ffffff&text_color=000000&primary_color=ffc107';

  return (
    <Box
      mx="auto"
      mt={16}
      px={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Heading mb={6} textAlign="center" size="xl" fontWeight="bold">
        New Customer Onboarding
      </Heading>

      <Box
        bg={cardBg}
        borderRadius="20px"
        p={6}
        maxW="1200px"
        width="100%"
      >
        {/* Calendly React component */}
        <InlineWidget
          url={calendlyUrl}
          styles={{ minWidth: '320px', height: '700px' }}
        />
      </Box>
    </Box>
  );
}
