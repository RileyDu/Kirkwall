import { Box, Heading, SimpleGrid, Input } from '@chakra-ui/react';
import { useState } from 'react';
import VideoFeedCard from './VideoFeedCard.js';

const VideoPlayerPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter feeds based on search query
  const filteredFeeds = videoFeeds.filter(feed =>
    feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feed.title.replace(/\D/g, '').includes(searchQuery) // Fuzzy match for numbers
  );

  return (
    <Box mx="auto" mt={16} px={4}>
      <Heading size="xl" textAlign="center" mb={4}>
        Video Monitoring
      </Heading>
      
      <Input
        placeholder="Search video feeds"
        mb={4}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        width={'50%'}
      />
      
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {filteredFeeds.map((feed, index) => (
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
