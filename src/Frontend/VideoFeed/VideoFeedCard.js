import { Box, Badge, Text } from '@chakra-ui/react';
import { FaCamera } from 'react-icons/fa';

const VideoFeedCard = ({ title, location, status, streamUrl }) => {
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      bgColor="gray.700"
      p={4}
      position="relative"
      border="2px solid #3D5A80"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        bg="gray.800"
        height="315px"
      >
        {streamUrl ? (
          <iframe
            width="560px"
            height="315px"
            src={streamUrl}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <FaCamera size="80px" color="gray.400" />
        )}
      </Box>
      
      {/* Live/Offline Badge */}
      <Badge
        position="absolute"
        top="6"
        right="6"
        colorScheme={status === 'live' ? 'red' : 'gray'}
        bg={status === 'live' ? 'red.500' : 'gray.500'}
        color="white"
        fontSize="0.9em"
        fontWeight="bold"
        px="3"
        py="1"
        borderRadius="full"
        boxShadow="md"
        transform="scale(1.1)"
      >
        {status === 'live' ? 'LIVE' : 'OFFLINE'}
      </Badge>

      <Box mt={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">{title}</Text>
        <Text fontSize="md" color="white">{Date && new Date().toLocaleString()}</Text>
        <Text fontSize="sm" color="gray.300">{location}</Text>
      </Box>
    </Box>
  );
};

export default VideoFeedCard;
