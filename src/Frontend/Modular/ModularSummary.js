import { Box } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/color-mode';
import { useMediaQuery } from '@chakra-ui/media-query';
import { useAuth } from '../AuthComponents/AuthContext.js';

const ModularSummary = ({ statusOfAlerts }) => {

    const { colorMode } = useColorMode();
    const { currentUser } = useAuth();
    const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <Box
      bg={colorMode === 'light' ? 'brand.50' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
      flex="1"
      p="4"
      pt={statusOfAlerts ? '10px' : '74px'}
      width={isLargerThan768 ? 'calc(100% - 70px)' : '100%'}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <div>
        <h1>Modular Summary</h1>
      </div>
    </Box>
  );
};

export default ModularSummary;
