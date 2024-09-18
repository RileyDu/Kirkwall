import { Box, Button, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight={'100vh'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'} // Ensures the Box takes the full height of the viewport
    >
      <Box
        gap={8}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        p={8}
        background={'gray.600'}
        borderRadius={'lg'}
        boxShadow={'lg'}
        maxWidth={'600px'}
        textAlign={'center'}
        color={'white'}
      >
        <Heading size={'2xl'} color={'white'} fontWeight={'bold'}>Thank You!</Heading>
        <Text fontSize={'xl'}>
          Your alerts for the sensor have been paused indefinitely. Please
          remember to reactivate when ready, thank you!
        </Text>
        <Button variant={'blue'} onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default ThankYou;
