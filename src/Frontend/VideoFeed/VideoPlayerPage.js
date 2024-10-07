import { Box, Heading } from '@chakra-ui/react';
import TestVideoFeed from './TestVideoFeed.js';

const VideoPlayerPage = () => {
  return (
    <Box
      mx="auto"
      mt={16}
      px={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Heading size={'lg'} mt={2} textAlign="center">
        Live Video Feed
      </Heading>
      <TestVideoFeed />
    </Box>
  );
};

export default VideoPlayerPage;
