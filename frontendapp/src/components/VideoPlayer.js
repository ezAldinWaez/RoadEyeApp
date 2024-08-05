import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';
import Chart1 from './Chart1/Chart1'

const VideoPlayer = ({ videoUrlOrg, videoUrlOut }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    console.log('VideoPlayer mounted with URL:', videoUrlOut);
  }, [videoUrlOut]);

  const handleCanPlay = () => {
    console.log('Video can play. Duration:', videoRef.current.duration);
  };

  const handleError = (e) => {
    console.error('Video error:', e);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '20px',
      margin: '20px',
      backgroundColor: 'var(--third-color)',
      borderRadius: '10px',
      }}>
      <div>
        <Typography variant="h6">Origin Video</Typography>
        <video 
          ref={videoRef}
          controls 
          width="100%" 
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          <source src={videoUrlOrg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div>
        <Typography variant="h6">Processed Video</Typography>
        <video 
          ref={videoRef}
          controls 
          width="100%" 
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          <source src={videoUrlOut} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;