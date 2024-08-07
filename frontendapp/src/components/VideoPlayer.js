import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

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


  const videoPath = videoUrlOut; // Replace with your actual video path  

    const handleDownload = () => {  
        const link = document.createElement('a');  
        link.href = videoPath;  
        link.download = "predected.mp4"; // Replace with your desired file name  
        link.click();  
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
        <div className="button-container"
             style={{
              display: 'flex',
              justifyContent: 'center',
             }}>  
                <button onClick={handleDownload} className="download-button"
                        style={{
                          padding: '5px 10px',
                          backgroundColor: 'var(--main-color)',
                          color: 'white',
                          border: 'none',
                          width: 'fit-content',
                          borderRadius: '3px',
                        }}>  
                    Download Processed Video  
                </button>  
            </div>  
      </div>
    </div>
  );
};

export default VideoPlayer;