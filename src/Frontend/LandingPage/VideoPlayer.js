import React from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = () => {
  const opts = {
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
    },
  };

  return (
    <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%' }}>
      <YouTube 
        videoId="w8drN_JKhT4" 
        opts={opts} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default VideoPlayer;
