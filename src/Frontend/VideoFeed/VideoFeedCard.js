import { Box, Badge, Text } from '@chakra-ui/react';

const VideoFeedCard = ({ title, location, status, streamUrl }) => {
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      width="300px"
      bgColor="gray.700"
      p={4}
      position="relative"
    >
      <iframe
        width="100%"
        height="170px"
        src={streamUrl}
        title={title}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
      ></iframe>
      
      {/* Live/Offline Badge */}
      <Badge
        position="absolute"
        top="4"
        right="4"
        colorScheme={status === 'live' ? 'red' : 'gray'}
        borderRadius="full"
        px="2"
      >
        {status === 'live' ? 'LIVE' : 'OFFLINE'}
      </Badge>

      <Box mt={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">{title}</Text>
        <Text fontSize="sm" color="gray.300">{location}</Text>
      </Box>
    </Box>
  );
};

export default VideoFeedCard;
