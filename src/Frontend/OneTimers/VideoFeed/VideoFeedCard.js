import { Box, Badge, Text, IconButton } from '@chakra-ui/react';
import { FaCamera, FaExpand } from 'react-icons/fa';
import { useDisclosure } from '@chakra-ui/react';
import FullscreenModal from './FullScreenModal.js';

const VideoFeedCard = ({ title, location, status, streamUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      
      <Badge
        position="absolute"
        top={status === 'live' ? '6' : '6'}
        right={status === 'live' ? '6' : '7'}
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

      {/* <IconButton
        icon={<FaExpand />}
        position="absolute"
        bottom="4"
        right="4"
        onClick={onOpen}
        // colorScheme="whiteAlpha"
        variant={'blue'}
        aria-label="Expand to Fullscreen"
        borderRadius={'10px'}
      /> */}

      <Box mt={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">{title}</Text>
        <Text fontSize="md" color="white">{Date && new Date().toLocaleString()}</Text>
        <Text fontSize="sm" color="gray.300">{location}</Text>
      </Box>

      {/* Fullscreen Modal */}
      <FullscreenModal isOpen={isOpen} onClose={onClose} streamUrl={streamUrl} />
    </Box>
  );
};

export default VideoFeedCard;
