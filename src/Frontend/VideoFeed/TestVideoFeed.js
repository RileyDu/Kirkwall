import { Box } from '@chakra-ui/react';

const TestVideoFeed = () => {
  return (
    <Box
      mx="auto"
      mt={16}
      px={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="xl"
      width="fit-content"
      bgColor="blackAlpha.800"
    border={'6px solid #3D5A80'}
    >
      <iframe
        width="1120"
        height="630"
        src="https://player.twitch.tv/?channel=rileyduu&parent=kirkwall-demo.vercel.app&controls=false&autoplay=true&muted=false"
        title="video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen="true"
        borderRadius="20px"
      ></iframe>
    </Box>
  );
};

export default TestVideoFeed;
