import React from 'react';
import { Box, useColorMode, useBreakpointValue } from '@chakra-ui/react';

const RecapChartWrapper = ({ children }) => {
  const { colorMode } = useColorMode();

  // Utility function to get background color based on color mode
  const getBackgroundColor = (colorMode) => 
    colorMode === 'light' ? '#e0e0e0' : 'gray.800';

  const getBorderColor = (colorMode) =>
    colorMode === 'light' ? '#3D5A80' : 'whiteAlpha.600';

  // Responsive padding for better spacing
//   const paddingBottom = useBreakpointValue({ base: '16', md: '16' });

  return (
    <Box
      border="2px"
      borderColor={getBorderColor(colorMode)}
      borderRadius="lg"
      boxShadow="lg"
      p="4"
    //   pb={paddingBottom}
      bg={getBackgroundColor(colorMode)}
      h="500px"
      w="100%"
      mt={6}
      mb={6}
    >
      {children}
    </Box>
  );
};

export default RecapChartWrapper;
