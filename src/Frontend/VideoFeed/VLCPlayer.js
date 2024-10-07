import React from 'react';

const VLCPlayer = () => {
  return (
    <div>
      <object
        type="application/x-vlc-plugin"
        width="640"
        height="480"
        data="rtsp://admin:K1rkw@ll!@192.168.1.226"
      >
        <param name="movie" value="rtsp://admin:K1rkw@ll!@192.168.1.226" />
        <param name="autoplay" value="true" />
        <param name="controls" value="true" />
        <param name="volume" value="50" />
      </object>
    </div>
  );
};

export default VLCPlayer;
