import { Box } from '@chakra-ui/react';

const TestVideoFeed = () => {
  const playVideo = () => {
    const player = document.getElementById('vlc-player');
    player.playlist.play();
  };

  const pauseVideo = () => {
    const player = document.getElementById('vlc-player');
    player.playlist.pause();
  };

  return (
    <Box
      mx="auto"
      mt={16}
      px={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <iframe
        width="560"
        height="315"
        src="https://player.twitch.tv/?channel=rileyduu&parent=kirkwall-demo.vercel.app"
        title="video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen="true"
        
      ></iframe>
    </Box>
  );
};

export default TestVideoFeed;
