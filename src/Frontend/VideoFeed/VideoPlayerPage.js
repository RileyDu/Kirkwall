import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import VideoFeedCard from './VideoFeedCard.js';

const VideoPlayerPage = () => {
  const videoFeeds = [
    {
      title: 'Camera #1',
      location: 'Fargo, ND, USA',
      status: 'live',
      streamUrl: 'https://player.twitch.tv/?channel=rileyduu&parent=kirkwall-demo.vercel.app&controls=false&autoplay=true&muted=false'
    },
    {
      title: 'Camera #2',
      location: 'Fargo, ND, USA',
      status: 'offline',
      streamUrl: ''
    },
    {
      title: 'Camera #3',
      location: 'Fargo, ND, USA',
      status: 'offline',
      streamUrl: ''
    },
    {
      title: 'Camera #4',
      location: 'Fargo, ND, USA',
      status: 'offline',
      streamUrl: ''
    },
    {
      title: 'Camera #5',
      location: 'Fargo, ND, USA',
      status: 'offline',
      streamUrl: ''
    },
    {
      title: 'Camera #6',
      location: 'Fargo, ND, USA',
      status: 'offline',
      streamUrl: ''
    },
  ];

  return (
    <Box mx="auto" mt={16} px={4}>
      <Heading size="xl" textAlign="center" mb={8}>
        Video Monitoring
      </Heading>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {videoFeeds.map((feed, index) => (
          <VideoFeedCard
            key={index}
            title={feed.title}
            location={feed.location}
            status={feed.status}
            streamUrl={feed.streamUrl}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default VideoPlayerPage;
